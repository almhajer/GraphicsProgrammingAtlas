const fs = require('fs');
const path = require('path');

const kw = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ui', 'cpp', 'reference-keywords.json'), 'utf8')).referenceData);

const guidesDir = path.join(__dirname, '..', 'data', 'ui', 'cpp');
const guideIndex = JSON.parse(fs.readFileSync(path.join(guidesDir, 'reference-guides-index.json'), 'utf8'));
const allGuides = {};
for (const file of guideIndex.files) {
  const chunk = JSON.parse(fs.readFileSync(path.join(guidesDir, '..', '..', file.path), 'utf8'));
  Object.assign(allGuides, chunk.referenceGuides || {});
}

const guideKeys = Object.keys(allGuides);
console.log('Keywords:', kw.length);
console.log('Guides:', guideKeys.length);
const missing = kw.filter(k => !guideKeys.includes(k));
console.log('Missing guides:', missing.length);
if (missing.length <= 30) console.log(missing.join(', '));
else { console.log('First 30:', missing.slice(0,30).join(', ')); console.log('...and', missing.length - 30, 'more'); }