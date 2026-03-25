#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data', 'split');
const CATEGORY_KEYS = ['functions', 'structures', 'enums', 'constants', 'macros'];
const DEFAULT_LIMIT = 80;

const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');
const failOnError = args.has('--fail-on-error');
const limitArg = process.argv.find((arg) => /^--limit=/.test(arg));
const displayLimit = limitArg ? Number(limitArg.split('=')[1]) || DEFAULT_LIMIT : DEFAULT_LIMIT;

const WEAK_TEXT_PATTERNS = [
  /الوصف الرسمي:/,
  /ثابت مرجعي يعطي قيمة خاصة أو حداً معروفاً/,
  /ثابت خاص بامتداد أو ميزة محددة/,
  /تعداد تقرؤه Vulkan في الحقول أو الدوال المرتبطة به/,
  /يمثل هذا التعداد القيم التي تحدد/,
  /يمثل هذا النوع من الأعلام/,
  /يجمع بتات مستقلة/,
  /يمثل المقبض .* يحدد/,
  /يمثل مقبضًا من النوع/,
  /يمثل عنوان بيانات إدخال من النوع/,
  /يمثل عنوان خرج أو بيانات قابلة للكتابة/,
  /قيمة تعتمد عليها Vulkan لتحديد معنى هذا الاستدعاء/,
  /رمز فشل من Vulkan\. راجع المواصفة/,
  /اختر إحدى القيم المعرفة في هذا التعداد/,
  /اضبط بقية الحقول المطلوبة/
];

function walkJsonFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  const files = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  });

  return files.sort();
}

function collectItemArrays(node, containerPath = [], arrays = []) {
  if (!node || typeof node !== 'object') {
    return arrays;
  }

  if (Array.isArray(node.items)) {
    arrays.push({items: node.items, containerPath});
  }

  Object.entries(node).forEach(([key, value]) => {
    if (key === 'items') {
      return;
    }
    collectItemArrays(value, containerPath.concat(key), arrays);
  });

  return arrays;
}

function sanitizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isWeakText(value) {
  const text = sanitizeText(value);
  if (!text) {
    return true;
  }
  return WEAK_TEXT_PATTERNS.some((pattern) => pattern.test(text));
}

function hasMeaningfulUsage(value) {
  const text = sanitizeText(value);
  if (!text) {
    return false;
  }
  if (text.length < 24) {
    return false;
  }
  return !WEAK_TEXT_PATTERNS.some((pattern) => pattern.test(text));
}

function addIssue(issues, severity, rule, category, file, itemName, field, message) {
  issues.push({
    severity,
    rule,
    category,
    file,
    itemName,
    field,
    message
  });
}

function scoreItemRichness(item) {
  if (!item || typeof item !== 'object') {
    return 0;
  }

  let score = 0;
  if (sanitizeText(item.description)) score += 4;
  if (Array.isArray(item.usage)) score += item.usage.filter((entry) => sanitizeText(entry)).length * 2;
  if (Array.isArray(item.notes)) score += item.notes.filter((entry) => sanitizeText(entry)).length;
  if (sanitizeText(item.example)) score += 2;
  if (Array.isArray(item.parameters)) score += item.parameters.filter((entry) => sanitizeText(entry.description)).length * 2;
  if (Array.isArray(item.members)) score += item.members.filter((entry) => sanitizeText(entry.description)).length * 2;
  if (Array.isArray(item.values)) score += item.values.filter((entry) => sanitizeText(entry.description)).length * 2;
  if (Array.isArray(item.returnValues)) score += item.returnValues.filter((entry) => sanitizeText(entry.description)).length * 2;
  if (sanitizeText(item.value)) score += 1;
  if (sanitizeText(item.syntax)) score += 1;
  return score;
}

function auditFunctionItem(item, ctx, issues) {
  if (!sanitizeText(item.description)) {
    addIssue(issues, 'error', 'missing-function-description', ctx.category, ctx.file, item.name, 'description', 'الدالة بلا وصف عربي.');
  } else if (isWeakText(item.description)) {
    addIssue(issues, 'warning', 'weak-function-description', ctx.category, ctx.file, item.name, 'description', 'وصف الدالة عام أو رسمي أكثر من اللازم ويحتاج معنى تنفيذي محلي.');
  }

  if (!Array.isArray(item.usage) || !item.usage.some(hasMeaningfulUsage)) {
    addIssue(issues, 'warning', 'missing-function-usage', ctx.category, ctx.file, item.name, 'usage', 'الدالة لا تملك شرح استخدام عملي كافي.');
  }

  (item.parameters || []).forEach((param) => {
    const fieldPath = `parameters.${param.name || 'unknown'}.description`;
    if (!sanitizeText(param.description)) {
      addIssue(issues, 'error', 'missing-parameter-description', ctx.category, ctx.file, item.name, fieldPath, `المعامل ${param.name || 'غير مسمى'} بلا وصف.`);
    } else if (isWeakText(param.description)) {
      addIssue(issues, 'warning', 'weak-parameter-description', ctx.category, ctx.file, item.name, fieldPath, `وصف المعامل ${param.name || 'غير مسمى'} عام ولا يوضح دوره الحقيقي.`);
    }
  });

  (item.returnValues || []).forEach((entry) => {
    const fieldPath = `returnValues.${entry.value || 'unknown'}.description`;
    if (!sanitizeText(entry.description)) {
      addIssue(issues, 'error', 'missing-return-value-description', ctx.category, ctx.file, item.name, fieldPath, `القيمة الراجعة ${entry.value || 'غير مسماة'} بلا شرح.`);
    } else if (isWeakText(entry.description)) {
      addIssue(issues, 'warning', 'weak-return-value-description', ctx.category, ctx.file, item.name, fieldPath, `شرح القيمة الراجعة ${entry.value || 'غير مسماة'} لا يوضح أثرها العملي.`);
    }
  });
}

function auditStructureItem(item, ctx, issues) {
  const members = Array.isArray(item.members) ? item.members : [];
  const memberNames = new Set(members.map((member) => String(member.name || '').trim()).filter(Boolean));
  const notesAndExample = [item.example, ...(item.notes || [])].join('\n');

  if (!sanitizeText(item.description)) {
    addIssue(issues, 'error', 'missing-structure-description', ctx.category, ctx.file, item.name, 'description', 'البنية بلا وصف عربي.');
  } else if (isWeakText(item.description)) {
    addIssue(issues, 'warning', 'weak-structure-description', ctx.category, ctx.file, item.name, 'description', 'وصف البنية عام أو آلي أكثر من اللازم.');
  }

  if (!Array.isArray(item.usage) || !item.usage.some(hasMeaningfulUsage)) {
    addIssue(issues, 'warning', 'missing-structure-usage', ctx.category, ctx.file, item.name, 'usage', 'البنية لا تملك شرح استخدام عملي كاف.');
  }

  members.forEach((member) => {
    const fieldPath = `members.${member.name || 'unknown'}.description`;
    if (!sanitizeText(member.description)) {
      addIssue(issues, 'error', 'missing-structure-member-description', ctx.category, ctx.file, item.name, fieldPath, `الحقل ${member.name || 'غير مسمى'} بلا وصف.`);
    } else if (isWeakText(member.description)) {
      addIssue(issues, 'warning', 'weak-structure-member-description', ctx.category, ctx.file, item.name, fieldPath, `وصف الحقل ${member.name || 'غير مسمى'} عام ولا يشرح فائدة الحقل.`);
    }
  });

  if (/\bsType\b/.test(notesAndExample) && !memberNames.has('sType')) {
    addIssue(issues, 'warning', 'structure-stype-mismatch', ctx.category, ctx.file, item.name, 'example/notes', 'يوجد ذكر لـ sType بينما البنية نفسها لا تحتوي هذا الحقل.');
  }

  if (/\bpNext\b/.test(notesAndExample) && !memberNames.has('pNext')) {
    addIssue(issues, 'warning', 'structure-pnext-mismatch', ctx.category, ctx.file, item.name, 'example/notes', 'يوجد ذكر لـ pNext بينما البنية نفسها لا تحتوي هذا الحقل.');
  }
}

function auditEnumItem(item, ctx, issues) {
  if (!sanitizeText(item.description)) {
    addIssue(issues, 'error', 'missing-enum-description', ctx.category, ctx.file, item.name, 'description', 'التعداد بلا وصف عربي.');
  } else if (isWeakText(item.description)) {
    addIssue(issues, 'warning', 'weak-enum-description', ctx.category, ctx.file, item.name, 'description', 'وصف التعداد عام ولا يوضح ماذا يغير فعليًا.');
  }

  if (!Array.isArray(item.usage) || !item.usage.some(hasMeaningfulUsage)) {
    addIssue(issues, 'warning', 'missing-enum-usage', ctx.category, ctx.file, item.name, 'usage', 'التعداد لا يملك شرح استخدام عملي كاف.');
  }

  (item.values || []).forEach((entry) => {
    const fieldPath = `values.${entry.name || 'unknown'}.description`;
    if (!sanitizeText(entry.description)) {
      addIssue(issues, 'error', 'missing-enum-value-description', ctx.category, ctx.file, item.name, fieldPath, `القيمة ${entry.name || 'غير مسماة'} بلا شرح.`);
    } else if (isWeakText(entry.description)) {
      addIssue(issues, 'warning', 'weak-enum-value-description', ctx.category, ctx.file, item.name, fieldPath, `شرح القيمة ${entry.name || 'غير مسماة'} عام ولا يوضح معنى اختيارها.`);
    }
  });
}

function auditConstantLikeItem(item, ctx, issues) {
  if (!sanitizeText(item.description)) {
    addIssue(issues, 'error', `missing-${ctx.category}-description`, ctx.category, ctx.file, item.name, 'description', 'العنصر بلا وصف عربي.');
  } else if (isWeakText(item.description)) {
    addIssue(issues, 'warning', `weak-${ctx.category}-description`, ctx.category, ctx.file, item.name, 'description', 'الوصف عام ولا يوضح فائدة القيمة أو الماكرو فعليًا.');
  }

  if (!Array.isArray(item.usage) || !item.usage.some(hasMeaningfulUsage)) {
    addIssue(issues, 'warning', `missing-${ctx.category}-usage`, ctx.category, ctx.file, item.name, 'usage', 'لا يوجد شرح استخدام عملي كاف لهذا العنصر.');
  }

  if (ctx.category === 'constants' && !sanitizeText(item.value)) {
    addIssue(issues, 'warning', 'missing-constant-value', ctx.category, ctx.file, item.name, 'value', 'الثابت لا يملك قيمة أو صياغة عددية موثقة.');
  }
}

function auditItem(category, item, file, issues) {
  const ctx = {category, file};
  if (!item || typeof item !== 'object' || !item.name) {
    return;
  }

  if (category === 'functions') {
    auditFunctionItem(item, ctx, issues);
    return;
  }

  if (category === 'structures') {
    auditStructureItem(item, ctx, issues);
    return;
  }

  if (category === 'enums') {
    auditEnumItem(item, ctx, issues);
    return;
  }

  auditConstantLikeItem(item, ctx, issues);
}

function buildAuditReport() {
  const files = walkJsonFiles(DATA_DIR);
  const issues = [];
  const itemRegistry = new Map();
  const stats = {
    files: files.length,
    rawItems: 0,
    items: 0,
    duplicatesCollapsed: 0,
    byCategory: {},
    bySeverity: {error: 0, warning: 0}
  };

  files.forEach((filePath) => {
    const relativeFile = path.relative(ROOT_DIR, filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);

    CATEGORY_KEYS.forEach((category) => {
      const root = parsed[category];
      if (!root) {
        return;
      }

      const arrays = collectItemArrays(root);
      arrays.forEach(({items}) => {
        items.forEach((item) => {
          if (!item || typeof item !== 'object' || !item.name) {
            return;
          }

          stats.rawItems += 1;
          const key = `${category}:${item.name}`;
          const candidate = {
            category,
            file: relativeFile,
            item,
            richness: scoreItemRichness(item)
          };
          const existing = itemRegistry.get(key);
          if (!existing || candidate.richness > existing.richness) {
            itemRegistry.set(key, candidate);
          }
        });
      });
    });
  });

  itemRegistry.forEach((entry) => {
    stats.items += 1;
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
    auditItem(entry.category, entry.item, entry.file, issues);
  });

  stats.duplicatesCollapsed = Math.max(0, stats.rawItems - stats.items);

  issues.forEach((issue) => {
    stats.bySeverity[issue.severity] = (stats.bySeverity[issue.severity] || 0) + 1;
  });

  return {stats, issues};
}

function printTextReport(report) {
  const {stats, issues} = report;
  console.log('تقرير تدقيق جودة المرجع');
  console.log(`الملفات المفحوصة: ${stats.files}`);
  console.log(`العناصر الخام: ${stats.rawItems}`);
  console.log(`العناصر الفريدة بعد الدمج: ${stats.items}`);
  console.log(`التكرارات المدمجة: ${stats.duplicatesCollapsed}`);
  console.log(`الأخطاء: ${stats.bySeverity.error || 0}`);
  console.log(`التحذيرات: ${stats.bySeverity.warning || 0}`);
  console.log('');
  console.log('التوزيع حسب الفئة:');
  CATEGORY_KEYS.forEach((category) => {
    console.log(`- ${category}: ${stats.byCategory[category] || 0}`);
  });
  console.log('');
  console.log(`أبرز ${Math.min(displayLimit, issues.length)} مشكلة:`);
  issues.slice(0, displayLimit).forEach((issue, index) => {
    console.log(
      `${index + 1}. [${issue.severity}] ${issue.category} :: ${issue.itemName} :: ${issue.field} :: ${issue.message} (${issue.file})`
    );
  });
}

const report = buildAuditReport();

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printTextReport(report);
}

if (failOnError && (report.stats.bySeverity.error || 0) > 0) {
  process.exit(2);
}
