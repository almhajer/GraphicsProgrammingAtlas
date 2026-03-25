#!/usr/bin/env node
/**
 * سكربت لإضافة العناصر الجديدة من content/reference/imgui إلى data/ui/imgui/sections
 * يحافظ على العناصر الموجودة ويضيف الجديدة فقط
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'reference', 'imgui');
const DATA_DIR = path.join(__dirname, '..', 'data', 'ui', 'imgui', 'sections');

// الأقسام في content/reference/imgui
const SOURCE_SECTIONS = ['functions', 'types', 'macros', 'enums'];

// mapping من أقسام content إلى أقسام data
const SECTION_MAPPING = {
  'functions': ['functions', 'widgets', 'windows', 'menus', 'popups', 'layout', 'interaction', 'colors', 'movement', 'animation', 'dragdrop', 'integrations'],
  'types': ['types'],
  'macros': ['macros'],
  'enums': ['enums', 'flags']
};

/**
 * تحويل عنصر من التنسيق الجديد إلى تنسيق البيانات القديم
 */
function convertItemToLegacyFormat(item, sectionId) {
  const converted = {
    name: item.name,
    kind: inferImGuiKind(item.name, sectionId),
    shortTooltip: item.shortDescription || item.titleArabic || '',
    description: item.shortDescription || '',
    realMeaning: item.shortDescription || '',
    whenToUse: '',
    practicalBenefit: ''
  };

  if (item.titleArabic) {
    converted.displayName = item.titleArabic;
  }

  return converted;
}

/**
 * استنتاج نوع العنصر
 */
function inferImGuiKind(name, sectionId) {
  // أنواع الأقسام الرئيسية
  if (sectionId === 'types') return 'type';
  if (sectionId === 'enums' || sectionId === 'flags') return 'enum';
  if (sectionId === 'macros') return 'macro';

  // أنواع الدوال بناءً على الاسم
  const nameLower = name.toLowerCase();

  if (nameLower.includes('begin') || nameLower.includes('end')) return 'window';
  if (nameLower.includes('button')) return 'button';
  if (nameLower.includes('input') || nameLower.includes('slider') || nameLower.includes('drag')) return 'input';
  if (nameLower.includes('text') || nameLower.includes('label')) return 'text';
  if (nameLower.includes('combo') || nameLower.includes('listbox')) return 'combo';
  if (nameLower.includes('table') || nameLower.includes('column')) return 'table';
  if (nameLower.includes('plot') || nameLower.includes('graph')) return 'plot';
  if (nameLower.includes('image')) return 'image';
  if (nameLower.includes('menu') || nameLower.includes('popup')) return 'menu';
  if (nameLower.includes('tab') || nameLower.includes('tabbar')) return 'tab';
  if (nameLower.includes('tooltip')) return 'tooltip';
  if (nameLower.includes('separator') || nameLower.includes('spacing')) return 'separator';
  if (nameLower.includes('treenode') || nameLower.includes('collapsingheader')) return 'tree';
  if (nameLower.includes('progress')) return 'progress';
  if (nameLower.includes('color')) return 'color';
  if (nameLower.includes('checkbox') || nameLower.includes('radio')) return 'button';
  if (nameLower.includes('selectable')) return 'button';

  return 'widget';
}

/**
 * دمج العناصر الجديدة مع الموجودة
 */
function mergeItems(existingItems, newItems, sectionId) {
  const existingNames = new Set(existingItems.map(item => item.name));
  const itemsToAdd = [];

  for (const newItem of newItems) {
    if (!existingNames.has(newItem.name)) {
      itemsToAdd.push(convertItemToLegacyFormat(newItem, sectionId));
    }
  }

  if (itemsToAdd.length === 0) {
    return { merged: existingItems, added: 0 };
  }

  return {
    merged: [...existingItems, ...itemsToAdd],
    added: itemsToAdd.length
  };
}

/**
 * قراءة العناصر من content
 */
function readContentItems(sourceSection) {
  const sourcePath = path.join(CONTENT_DIR, sourceSection, 'index.json');

  if (!fs.existsSync(sourcePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const data = JSON.parse(content);

    const items = [];
    if (data.groups && Array.isArray(data.groups)) {
      for (const group of data.groups) {
        if (group.items && Array.isArray(group.items)) {
          for (const item of group.items) {
            items.push(item);
          }
        }
      }
    }
    return items;
  } catch (error) {
    console.error(`خطأ في قراءة ${sourcePath}:`, error.message);
    return [];
  }
}

/**
 * معالجة ملف بيانات واحد
 */
function processDataFile(targetSection, newItems) {
  const targetPath = path.join(DATA_DIR, `${targetSection}.json`);

  if (!fs.existsSync(targetPath)) {
    return null;
  }

  try {
    const targetContent = fs.readFileSync(targetPath, 'utf8');
    const targetData = JSON.parse(targetContent);
    const existingItems = targetData.items || [];

    const { merged, added } = mergeItems(existingItems, newItems, targetSection);

    if (added > 0) {
      targetData.items = merged;
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    }

    return { section: targetSection, added, total: merged.length };
  } catch (error) {
    console.error(`خطأ في ${targetSection}:`, error.message);
    return null;
  }
}

/**
 * الدالة الرئيسية
 */
function main() {
  console.log('🔄 بدء إضافة العناصر الجديدة إلى بيانات ImGui...\n');

  let totalAdded = 0;
  let totalItems = 0;

  for (const sourceSection of SOURCE_SECTIONS) {
    const newItems = readContentItems(sourceSection);
    const targetSections = SECTION_MAPPING[sourceSection] || [sourceSection];

    console.log(`\n📁 معالجة ${sourceSection} (${newItems.length} عنصر من content)...`);

    for (const targetSection of targetSections) {
      const result = processDataFile(targetSection, newItems);
      if (result) {
        console.log(`  ✅ ${targetSection}.json: +${result.added} عنصر جديد، المجموع: ${result.total}`);
        totalAdded += result.added;
        totalItems += result.total;
      }
    }
  }

  console.log(`\n✨ تمت الإضافة! +${totalAdded} عنصر جديد، المجموع الكلي: ${totalItems} عنصر`);
}

main();