const fs = require('fs');
const path = require('path');

// Read both question files
const mainQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));
const additionalData = JSON.parse(fs.readFileSync(path.join(__dirname, 'additional-questions.json'), 'utf8'));

// Combine questions
const allQuestions = [
  ...mainQuestions.questions,
  ...additionalData.additional_questions
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

// Count by topic
const topicCounts = {};
allQuestions.forEach(q => {
  topicCounts[q.topic_id] = (topicCounts[q.topic_id] || 0) + 1;
});

console.log('\nQuestions by topic:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  console.log(`  ${topic}: ${count} questions`);
});
