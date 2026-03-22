#!/usr/bin/env node
const fs = require('fs');

// قراءة الدوال من content/reference/glslang
const glslContentPath = 'content/reference/glslang/functions/index.json';
let glslContentItems = [];
try {
  const d = JSON.parse(fs.readFileSync(glslContentPath, 'utf8'));
  d.groups?.forEach(g => {
    g.items?.forEach(i => glslContentItems.push(i.name));
  });
} catch(e) {
  console.log('Error reading content:', e.message);
}

// قراءة الدوال من data/ui/glsl/reference
const glslDataPath = 'data/ui/glsl/reference/functions.json';
let glslDataItems = [];
try {
  const d = JSON.parse(fs.readFileSync(glslDataPath, 'utf8'));
  glslDataItems = d.items?.map(i => i.name) || [];
} catch(e) {
  console.log('Error reading data:', e.message);
}

console.log('=== GLSL Functions ===');
console.log('Content items:', glslContentItems.length);
console.log('Data items:', glslDataItems.length);

// العناصر في content وليست في data
const missing = glslContentItems.filter(n => !glslDataItems.includes(n));
console.log('\nMissing from data:', missing.length);
missing.forEach(n => console.log(' -', n));

// العناصر الجديدة المضافة حديثاً
const newItems = ['barrier', 'memoryBarrier', 'dFdx', 'dFdy', 'fwidth', 'atomicAdd', 'imageLoad', 'imageStore'];
console.log('\nChecking new items:');
newItems.forEach(n => {
  const inData = glslDataItems.includes(n);
  console.log(' -', n + ':', inData ? '✅ في data' : '❌ غير موجود');
});