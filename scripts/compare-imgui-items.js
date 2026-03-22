#!/usr/bin/env node
const fs = require('fs');

// جمع كل العناصر من data
let dataItems = new Set();
const sections = ['functions', 'widgets', 'windows', 'types', 'enums', 'macros', 'flags', 'misc', 'menus', 'popups', 'layout', 'interaction', 'colors', 'movement', 'animation', 'dragdrop', 'integrations', 'headers'];
sections.forEach(s => {
  try {
    const d = JSON.parse(fs.readFileSync('data/ui/imgui/sections/' + s + '.json', 'utf8'));
    d.items?.forEach(i => dataItems.add(i.name));
  } catch(e) {}
});

// جمع كل العناصر من content
let contentItems = new Map();
['functions', 'types', 'enums', 'macros'].forEach(section => {
  try {
    const d = JSON.parse(fs.readFileSync('content/reference/imgui/' + section + '/index.json', 'utf8'));
    d.groups?.forEach(g => {
      g.items?.forEach(i => contentItems.set(i.name, {section, group: g.title, item: i}));
    });
  } catch(e) {}
});

// إيجاد العناصر المفقودة
console.log('=== Items in content but NOT in data ===');
let missing = [];
for (const [name, info] of contentItems) {
  if (!dataItems.has(name)) {
    missing.push({name, info});
  }
}

missing.forEach(m => console.log('-', m.name, '(' + m.info.section + ')'));
console.log('\nTotal missing:', missing.length);
console.log('Data items:', dataItems.size);
console.log('Content items:', contentItems.size);