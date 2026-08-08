const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Database setup
const DB_PATH = process.env.DB_PATH || './data.db';
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize database tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      streak INTEGER DEFAULT 0,
      last_activity_date TEXT
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      answer_index INTEGER NOT NULL,
      is_correct INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS question_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT UNIQUE NOT NULL,
      total_attempts INTEGER DEFAULT 0,
      correct_attempts INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 0,
      next_review DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_type TEXT NOT NULL,
      topic_id TEXT,
      questions_count INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      score REAL DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

initDatabase();

// Load data files
const topics = JSON.parse(fs.readFileSync(path.join(__dirname, 'topics.json'), 'utf8'));
const questionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
const achievements = JSON.parse(fs.readFileSync(path.join(__dirname, 'achievements.json'), 'utf8'));
const dailyGoals = JSON.parse(fs.readFileSync(path.join(__dirname, 'daily-goals.json'), 'utf8'));

// Helper: Generate token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Helper: Get or create user
function getOrCreateUser(name) {
  let user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
  if (!user) {
    const token = generateToken();
    db.prepare('INSERT INTO users (name, token) VALUES (?, ?)').run(name, token);
    user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
  }
  return user;
}

// API Routes

// Register
app.post('/api/register', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = getOrCreateUser(name);
    res.json(user);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = getOrCreateUser(name);
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json(user);
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get topics
app.get('/api/topics', (req, res) => {
  try {
    res.json(topics.topics);
  } catch (error) {
    console.error('Topics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get questions
app.get('/api/questions', (req, res) => {
  try {
    const { topic_id, limit = 10 } = req.query;
    let filteredQuestions = questionsData.questions;

    if (topic_id) {
      filteredQuestions = filteredQuestions.filter(q => q.topic_id === topic_id);
    }

    // Shuffle and limit
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, parseInt(limit));

    res.json(selected);
  } catch (error) {
    console.error('Questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save progress
app.post('/api/progress', (req, res) => {
  try {
    const { question_id, answer_index, is_correct } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find question
    const question = questionsData.questions.find(q => q.id === question_id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Save progress
    db.prepare(`
      INSERT INTO progress (user_id, question_id, topic_id, answer_index, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `).run(user.id, question_id, question.topic_id, answer_index, is_correct ? 1 : 0);

    // Update question stats
    const existingStats = db.prepare('SELECT * FROM question_stats WHERE question_id = ?').get(question_id);
    if (existingStats) {
      db.prepare(`
        UPDATE question_stats
        SET total_attempts = total_attempts + 1,
            correct_attempts = correct_attempts + ?
        WHERE question_id = ?
      `).run(is_correct ? 1 : 0, question_id);
    } else {
      db.prepare(`
        INSERT INTO question_stats (question_id, total_attempts, correct_attempts)
        VALUES (?, 1, ?)
      `).run(question_id, is_correct ? 1 : 0);
    }

    // Update user XP
    if (is_correct) {
      db.prepare('UPDATE users SET xp = xp + 10 WHERE id = ?').run(user.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mistakes (questions with low accuracy)
app.get('/api/mistakes', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get questions where user answered incorrectly
    const mistakes = db.prepare(`
      SELECT DISTINCT p.question_id
      FROM progress p
      WHERE p.user_id = ? AND p.is_correct = 0
      ORDER BY p.created_at DESC
      LIMIT ?
    `).all(user.id, parseInt(limit));

    const mistakeQuestions = mistakes.map(m =>
      questionsData.questions.find(q => q.id === m.question_id)
    ).filter(q => q);

    res.json(mistakeQuestions);
  } catch (error) {
    console.error('Mistakes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_questions,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
        ROUND(AVG(is_correct) * 100, 2) as accuracy
      FROM progress
      WHERE user_id = ?
    `).get(user.id);

    res.json({
      ...user,
      total_questions: stats.total_questions || 0,
      correct_answers: stats.correct_answers || 0,
      accuracy: stats.accuracy || 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save session
app.post('/api/sessions', (req, res) => {
  try {
    const { session_type, topic_id, questions_count, correct_count, score } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.prepare('SELECT * FROM users WHERE token = ?').get(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    db.prepare(`
      INSERT INTO sessions (user_id, session_type, topic_id, questions_count, correct_count, score)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, session_type, topic_id, questions_count, correct_count, score);

    res.json({ success: true });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`SIE Exam Trainer server running on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
