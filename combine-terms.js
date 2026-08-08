const fs = require('fs');
const path = require('path');

// Read both term files
const mainGlossary = JSON.parse(fs.readFileSync(path.join(__dirname, 'glossary.json'), 'utf8'));
const additionalData = JSON.parse(fs.readFileSync(path.join(__dirname, 'additional-terms.json'), 'utf8'));

// Combine terms
const allTerms = [
  ...mainGlossary.terms,
  ...additionalData.additional_terms
];

// Update glossary.json with combined terms
const combinedData = {
  terms: allTerms
};

fs.writeFileSync(
  path.join(__dirname, 'glossary.json'),
  JSON.stringify(combinedData, null, 2)
);

console.log(`Total terms: ${allTerms.length}`);
console.log(`- Previous terms: ${mainGlossary.terms.length}`);
console.log(`- New terms: ${additionalData.additional_terms.length}`);

// Count by topic
const topicCounts = {};
allTerms.forEach(t => {
  topicCounts[t.topic_id] = (topicCounts[t.topic_id] || 0) + 1;
});

console.log('\nTerms by topic:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  console.log(`  ${topic}: ${count} terms`);
});
