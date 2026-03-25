const fs = require('fs');
const path = require('path');

const keywords = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ui', 'cpp', 'reference-keywords.json'), 'utf8'));

const guidesDir = path.join(__dirname, '..', 'data', 'ui', 'cpp');
const guideIndex = JSON.parse(fs.readFileSync(path.join(guidesDir, 'reference-guides-index.json'), 'utf8'));
const allGuides = {};
for (const file of guideIndex.files) {
  const chunk = JSON.parse(fs.readFileSync(path.join(guidesDir, '..', '..', file.path), 'utf8'));
  Object.assign(allGuides, chunk.referenceGuides || {});
}

const guideKeys = Object.keys(allGuides);
const allKeys = Object.keys(keywords.referenceData);
const missing = allKeys.filter(k => !guideKeys.includes(k));

console.log(`Total keywords: ${allKeys.length}`);
console.log(`Have guides: ${guideKeys.length}`);
console.log(`Missing guides: ${missing.length}`);
console.log('Missing:', missing.join(', '));