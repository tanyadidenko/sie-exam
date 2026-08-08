const fs = require('fs');
const path = require('path');

// Read all question files
const mainQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
const additionalData = JSON.parse(fs.readFileSync(path.join(__dirname, 'additional-questions.json'), 'utf8'));
const moreData = JSON.parse(fs.readFileSync(path.join(__dirname, 'more-questions.json'), 'utf8'));

// Combine all questions
const allQuestions = [
  ...mainQuestions.questions,
  ...additionalData.additional_questions,
  ...moreData.more_questions
];

// Update questions.json with combined questions
const combinedData = {
  questions: allQuestions
};

fs.writeFileSync(
  path.join(__dirname, 'questions.json'),
  JSON.stringify(combinedData, null, 2)
);

console.log(`Combined questions: ${allQuestions.length} total`);
console.log(`- Main questions: ${mainQuestions.questions.length}`);
console.log(`- Additional questions: ${additionalData.additional_questions.length}`);
console.log(`- More questions: ${moreData.more_questions.length}`);

// Count by topic
const topicCounts = {};
allQuestions.forEach(q => {
  topicCounts[q.topic_id] = (topicCounts[q.topic_id] || 0) + 1;
});

console.log('\nQuestions by topic:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  console.log(`  ${topic}: ${count} questions`);
});

// Calculate percentages
const total = allQuestions.length;
console.log('\nDistribution:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  const pct = ((count / total) * 100).toFixed(1);
  console.log(`  ${topic}: ${count} (${pct}%)`);
});
