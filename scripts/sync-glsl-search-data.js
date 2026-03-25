#!/usr/bin/env node
/**
 * سكربت لإضافة العناصر الجديدة من content/reference/glslang إلى data/ui/glsl/reference
 * يحافظ على العناصر الموجودة ويضيف الجديدة فقط
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'reference', 'glslang');
const DATA_DIR = path.join(__dirname, '..', 'data', 'ui', 'glsl', 'reference');

const KIND_FILES = ['functions', 'types', 'directives', 'qualifiers', 'constants', 'builtins', 'control-flow', 'blocks'];

/**
 * تحويل عنصر من التنسيق الجديد إلى تنسيق البيانات القديم
 * مع الحفاظ على الحقول المتوافقة
 */
function convertItemToLegacyFormat(item, kindId) {
  const converted = {
    name: item.name,
    kind: inferKindLabel(item.name, kindId),
    description: item.shortDescription || item.titleArabic || '',
    sourceUrl: item.officialUrl || ''
  };

  // إضافة الحقول الاختيارية
  if (item.titleArabic) {
    converted.displayName = item.titleArabic;
  }

  // إضافة حقول إضافية للدوال
  if (kindId === 'functions') {
    converted.usage = inferUsage(item.name);
    converted.execution = inferExecution(item.name);
    converted.effect = '';
    converted.vulkanBridge = '';
    converted.example = inferExample(item.name);
  }

  return converted;
}

/**
 * استنتاج نوع الدالة
 */
function inferKindLabel(name, kindId) {
  if (kindId === 'functions') {
    const mathFuncs = ['abs', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'pow', 'exp', 'exp2', 'log', 'log2', 'sqrt', 'inversesqrt', 'floor', 'ceil', 'round', 'roundEven', 'trunc', 'mod', 'modf', 'min', 'max', 'clamp', 'mix', 'step', 'smoothstep', 'sign', 'fract', 'degrees', 'radians', 'fma'];
    const vectorFuncs = ['dot', 'cross', 'length', 'distance', 'normalize', 'reflect', 'refract', 'faceforward', 'outerProduct'];
    const matrixFuncs = ['transpose', 'determinant', 'inverse', 'matrixCompMult'];
    const textureFuncs = ['texture', 'textureLod', 'texelFetch'];
    const derivativeFuncs = ['dFdx', 'dFdy'];
    const compareFuncs = ['lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not'];
    const barrierFuncs = ['barrier', 'memoryBarrier', 'memoryBarrierBuffer', 'memoryBarrierImage', 'memoryBarrierShared', 'groupMemoryBarrier'];
    const boolFuncs = ['isinf', 'isnan'];

    if (mathFuncs.includes(name)) return 'Built-in Math Function';
    if (vectorFuncs.includes(name)) return 'Built-in Vector Function';
    if (matrixFuncs.includes(name)) return 'Built-in Matrix Function';
    if (textureFuncs.includes(name)) return 'Built-in Sampling Function';
    if (derivativeFuncs.includes(name)) return 'Built-in Derivative Function';
    if (compareFuncs.includes(name)) return 'Built-in Comparison Function';
    if (barrierFuncs.includes(name)) return 'Built-in Synchronization Function';
    if (boolFuncs.includes(name)) return 'Built-in Check Function';
    return 'Built-in Function';
  }
  if (kindId === 'types') return 'Type';
  if (kindId === 'directives') return 'Preprocessor Directive';
  if (kindId === 'qualifiers') return 'Qualifier';
  if (kindId === 'constants') return 'Built-in Constant';
  if (kindId === 'builtins') return 'Built-in Variable';
  if (kindId === 'control-flow') return 'Control Flow';
  return 'Language Construct';
}

/**
 * استنتاج الاستخدام
 */
function inferUsage(name) {
  const usageMap = {
    'texture': 'شائعة في Fragment Shader لقراءة الخامات.',
    'normalize': 'تستخدم مع normals والاتجاهات الضوئية والمتجهات الهندسية.',
    'dot': 'أساسية في الإضاءة وحساب الإسقاط والزوايا.',
    'mix': 'تستخدم للـ lerp، مزج الألوان، أو الانتقال بين حالتين.',
    'clamp': 'تقيد القيم داخل نطاق محدد.',
    'smoothstep': 'تستخدم للانتقالات الناعمة.',
    'cross': 'تستخدم لحساب العمود المشترك بين متجهين.',
    'reflect': 'تستخدم في حسابات الانعكاس.',
    'refract': 'تستخدم في حسابات الانكسار.',
    'distance': 'تستخدم لحساب المسافة بين نقطتين.',
    'length': 'تستخدم لحساب طول المتجه.',
    'step': 'تستخدم للاختبارات الحادة.',
    'barrier': 'تستخدم في Compute Shaders للتزامن.',
    'memoryBarrier': 'تستخدم لضمان ترتيب عمليات الذاكرة.'
  };
  return usageMap[name] || '';
}

/**
 * استنتاج طريقة التنفيذ
 */
function inferExecution(name) {
  const execMap = {
    'texture': 'توجه العتاد إلى تنفيذ sampling على Image/Sampler مربوطين من التطبيق.',
    'normalize': 'تولد تعليمات حسابية على GPU لتطبيع المكونات.',
    'dot': 'تولد سلسلة تعليمات multiply-add على GPU أو تعليمة مكافئة.',
    'mix': 'تنفذ حساب interpolation مباشر داخل الشيدر.',
    'sin': 'تحسب الجيب باستخدام دوال الرياضيات في GPU.',
    'cos': 'تحسب جيب التمام باستخدام دوال الرياضيات في GPU.'
  };
  return execMap[name] || '';
}

/**
 * استنتاج مثال
 */
function inferExample(name) {
  const exampleMap = {
    'texture': 'vec4 albedo = texture(texSampler, fragUv);',
    'normalize': 'vec3 N = normalize(inNormal);',
    'dot': 'float ndotl = max(dot(N, L), 0.0);',
    'mix': 'vec3 finalColor = mix(colorA, colorB, factor);',
    'clamp': 'float value = clamp(x, 0.0, 1.0);',
    'smoothstep': 'float t = smoothstep(0.0, 1.0, x);',
    'cross': 'vec3 tangent = cross(normal, up);',
    'reflect': 'vec3 R = reflect(I, N);',
    'refract': 'vec3 R = refract(I, N, eta);',
    'distance': 'float d = distance(p1, p2);',
    'length': 'float len = length(v);',
    'step': 'float s = step(edge, x);',
    'abs': 'float a = abs(x);',
    'sin': 'float s = sin(angle);',
    'cos': 'float c = cos(angle);'
  };
  return exampleMap[name] || '';
}

/**
 * دمج العناصر الجديدة مع الموجودة
 */
function mergeItems(existingItems, newItems, kindId) {
  const existingNames = new Set(existingItems.map(item => item.name));
  const itemsToAdd = [];

  for (const newItem of newItems) {
    if (!existingNames.has(newItem.name)) {
      itemsToAdd.push(convertItemToLegacyFormat(newItem, kindId));
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
 * معالجة ملف واحد
 */
function processKindFile(kindId) {
  const sourcePath = path.join(CONTENT_DIR, kindId, 'index.json');
  const targetPath = path.join(DATA_DIR, `${kindId}.json`);

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  لم يوجد: ${sourcePath}`);
    return null;
  }

  if (!fs.existsSync(targetPath)) {
    console.log(`⚠️  الملف الهدف غير موجود: ${targetPath}`);
    return null;
  }

  try {
    // قراءة المصدر الجديد
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    const sourceData = JSON.parse(sourceContent);

    // استخراج العناصر الجديدة
    const newItems = [];
    if (sourceData.groups && Array.isArray(sourceData.groups)) {
      for (const group of sourceData.groups) {
        if (group.items && Array.isArray(group.items)) {
          for (const item of group.items) {
            newItems.push(item);
          }
        }
      }
    }

    // قراءة الملف الهدف الموجود
    const targetContent = fs.readFileSync(targetPath, 'utf8');
    const targetData = JSON.parse(targetContent);

    // دمج العناصر
    const existingItems = targetData.items || [];
    const { merged, added } = mergeItems(existingItems, newItems, kindId);

    // تحديث الملف
    targetData.items = merged;

    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    console.log(`✅ تم تحديث: ${targetPath} (+${added} عنصر جديد، المجموع: ${merged.length})`);

    return { kindId, added, total: merged.length };
  } catch (error) {
    console.error(`❌ خطأ في ${kindId}:`, error.message);
    return null;
  }
}

/**
 * الدالة الرئيسية
 */
function main() {
  console.log('🔄 بدء إضافة العناصر الجديدة إلى بيانات GLSL...\n');

  const results = KIND_FILES.map(processKindFile);

  const totalAdded = results.filter(r => r !== null).reduce((sum, r) => sum + r.added, 0);
  const totalItems = results.filter(r => r !== null).reduce((sum, r) => sum + r.total, 0);
  console.log(`\n✨ تمت الإضافة! +${totalAdded} عنصر جديد، المجموع الكلي: ${totalItems} عنصر`);
}

main();