const fs = require('fs');
const path = require('path');

// Read all question files
const mainQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
const finalData = JSON.parse(fs.readFileSync(path.join(__dirname, 'final-questions.json'), 'utf8'));

// Combine all questions
const allQuestions = [
  ...mainQuestions.questions,
  ...finalData.final_questions
];

// Update questions.json with combined questions
const combinedData = {
  questions: allQuestions
};

fs.writeFileSync(
  path.join(__dirname, 'questions.json'),
  JSON.stringify(combinedData, null, 2)
);

console.log(`Total questions: ${allQuestions.length}`);
console.log(`- Previous questions: ${mainQuestions.questions.length}`);
console.log(`- New questions: ${finalData.final_questions.length}`);

// Count by topic
const topicCounts = {};
allQuestions.forEach(q => {
  topicCounts[q.topic_id] = (topicCounts[q.topic_id] || 0) + 1;
});

console.log('\nQuestions by topic:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  const pct = ((count / allQuestions.length) * 100).toFixed(1);
  console.log(`  ${topic}: ${count} (${pct}%)`);
});
