const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'data', 'ref-source.txt');
const outputPath = path.join(rootDir, 'ref-.html');

const SECTION_INDENT = 8;
const LETTER_INDENT = 12;
const ITEM_INDENT = 16;

const VARIABLE_SECTIONS = [
  'Structures',
  'Enumerations',
  'Flags',
  'Object Handles',
  'Function Pointer Types',
  'Scalar Types',
  'Constants'
];

const SECTION_AR = {
  Commands: 'الدوال',
  Structures: 'الهياكل',
  Enumerations: 'التعدادات',
  Flags: 'الأعلام',
  'Object Handles': 'المقابض',
  'Function Pointer Types': 'مؤشرات الدوال',
  'Scalar Types': 'الأنواع الأساسية',
  Constants: 'الثوابت',
  'C Macro Definitions': 'الماكرو'
};

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
  } catch (error) {
    return null;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toReturnValueList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => ({
      value: item.value || item.name || '',
      description: item.description || ''
    }));
  }

  if (typeof value === 'object') {
    return Object.entries(value).map(([name, description]) => ({
      value: name,
      description: description || ''
    }));
  }

  return [];
}

function buildSignature(name, returnType, parameters) {
  if (!returnType) {
    return '';
  }

  const signatureParams = (parameters || [])
    .map((param) => `${param.type || 'auto'} ${param.name || 'value'}`)
    .join(', ');

  return `${returnType} ${name}(${signatureParams})`;
}

function normalizeFunctionDoc(item) {
  const returnType =
    typeof item.returnType === 'string' ? item.returnType : item.returnType?.name || '';
  const parameters = Array.isArray(item.parameters) ? item.parameters : [];
  const notes = Array.isArray(item.notes)
    ? item.notes
    : item.remarks
      ? [item.remarks]
      : [];

  return {
    name: item.name,
    signature: item.signature || buildSignature(item.name, returnType, parameters),
    description: item.description || '',
    parameters,
    returnType,
    returnValues: toReturnValueList(item.returnValues),
    notes,
    example: item.example || '',
    seeAlso: Array.isArray(item.seeAlso) ? item.seeAlso : [],
    category: item.category || ''
  };
}

function normalizeMacroDoc(item) {
  return {
    name: item.name,
    syntax: item.syntax || item.name,
    description: item.description || '',
    parameters: Array.isArray(item.parameters) ? item.parameters : [],
    returnValue: item.returnValue || '',
    notes: Array.isArray(item.notes) ? item.notes : [],
    example: item.example || ''
  };
}

function mergeDocs(baseDoc, nextDoc) {
  if (!baseDoc) {
    return nextDoc;
  }

  return {
    ...baseDoc,
    ...nextDoc,
    description:
      (nextDoc.description || '').length >= (baseDoc.description || '').length
        ? nextDoc.description
        : baseDoc.description,
    signature: nextDoc.signature || baseDoc.signature,
    syntax: nextDoc.syntax || baseDoc.syntax,
    parameters: nextDoc.parameters?.length ? nextDoc.parameters : baseDoc.parameters,
    returnValues: nextDoc.returnValues?.length ? nextDoc.returnValues : baseDoc.returnValues,
    notes: nextDoc.notes?.length ? nextDoc.notes : baseDoc.notes,
    example: nextDoc.example || baseDoc.example,
    returnValue: nextDoc.returnValue || baseDoc.returnValue,
    category: nextDoc.category || baseDoc.category,
    seeAlso: nextDoc.seeAlso?.length ? nextDoc.seeAlso : baseDoc.seeAlso
  };
}

function loadFunctionDocs() {
  const docs = new Map();
  const functionsJson = readJson(path.join('data', 'vulkan_functions.json'));
  const fullJson = readJson(path.join('data', 'vulkan_full_data.json'));

  if (functionsJson?.functions) {
    for (const item of functionsJson.functions) {
      docs.set(item.name, mergeDocs(docs.get(item.name), normalizeFunctionDoc(item)));
    }
  }

  if (fullJson?.functions) {
    for (const group of Object.values(fullJson.functions)) {
      for (const item of group.items || []) {
        docs.set(item.name, mergeDocs(docs.get(item.name), normalizeFunctionDoc(item)));
      }
    }
  }

  return docs;
}

function loadMacroDocs() {
  const docs = new Map();
  const macrosJson = readJson(path.join('data', 'vulkan_macros.json'));

  if (macrosJson?.macros) {
    for (const item of macrosJson.macros) {
      docs.set(item.name, normalizeMacroDoc(item));
    }
  }

  return docs;
}

function parseReferenceSections(sourceText) {
  const sections = {};
  let currentSection = null;
  let currentLetter = null;

  for (const rawLine of sourceText.split(/\r?\n/)) {
    if (!rawLine.trim()) {
      continue;
    }

    const indent = (rawLine.match(/^ */) || [''])[0].length;
    const value = rawLine.trim();

    if (indent < SECTION_INDENT) {
      currentSection = null;
      currentLetter = null;
      continue;
    }

    if (indent === SECTION_INDENT) {
      currentSection = value;
      currentLetter = null;
      sections[currentSection] = sections[currentSection] || {};
      continue;
    }

    if (!currentSection) {
      continue;
    }

    if (indent === LETTER_INDENT) {
      currentLetter = value;
      sections[currentSection][currentLetter] = sections[currentSection][currentLetter] || [];
      continue;
    }

    if (indent === ITEM_INDENT && currentLetter) {
      sections[currentSection][currentLetter].push(value);
    }
  }

  return sections;
}

function inferFunctionDescription(name) {
  if (name.startsWith('vkCmd')) {
    return 'أمر يُسجَّل داخل Command Buffer لتنفيذ عمليات الرسم أو النقل أو المزامنة على المعالج الرسومي.';
  }

  if (name.startsWith('vkCreate')) {
    return 'دالة لإنشاء مورد أو كائن من كائنات Vulkan وإرجاع مقبض صالح للاستخدام لاحقاً.';
  }

  if (name.startsWith('vkDestroy')) {
    return 'دالة لتحرير مورد أو تدمير كائن من كائنات Vulkan بعد الانتهاء من استخدامه.';
  }

  if (name.startsWith('vkGet')) {
    return 'دالة استعلام تُعيد خصائص أو مؤشرات أو مقابض أو معلومات تنفيذية من واجهة Vulkan.';
  }

  if (name.startsWith('vkEnumerate')) {
    return 'دالة استعراض تُستخدم لاكتشاف القوائم المدعومة مثل الطبقات أو الامتدادات أو الأجهزة.';
  }

  if (name.startsWith('vkAllocate')) {
    return 'دالة لحجز مورد أو ذاكرة أو مجموعة كائنات للاستخدام داخل تطبيق Vulkan.';
  }

  if (name.startsWith('vkFree')) {
    return 'دالة لتحرير الذاكرة أو الموارد التي جرى حجزها مسبقاً.';
  }

  if (name.startsWith('vkQueue')) {
    return 'دالة مرتبطة بالطوابير وإرسال الأعمال أو مزامنتها على الجهاز المنطقي.';
  }

  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) {
    return 'دالة مرتبطة بإتاحة الوصول إلى ذاكرة الجهاز من جهة المعالج أو إنهاء هذا الوصول.';
  }

  return 'دالة مرجعية من Vulkan. لا يتوفر لها وصف عربي تفصيلي في بيانات المشروع بعد، لذا عُرضت هنا كمرجع تنظيمي.';
}

function inferMacroDescription(name) {
  if (/^VK_(API_)?VERSION/.test(name) || name.includes('MAKE_VERSION')) {
    return 'ماكرو مرتبط ببناء أرقام إصدارات Vulkan أو استخراج أجزائها المختلفة.';
  }

  if (name.includes('HANDLE')) {
    return 'ماكرو مرتبط بتعريف المقابض أو تمثيلها داخل رؤوس Vulkan.';
  }

  if (name.includes('NULL')) {
    return 'ماكرو يعبّر عن قيمة فارغة أو غير مهيأة في سياق كائنات Vulkan.';
  }

  if (/^VK_(MAX|UUID|LUID|WHOLE|FALSE|TRUE|ATTACHMENT|SUBPASS|QUEUE|REMAINING)/.test(name)) {
    return 'ثابت أو ماكرو مرجعي يحدد حجماً أو قيمة خاصة أو حدّاً ثابتاً داخل واجهة Vulkan.';
  }

  return 'ماكرو مرجعي من Vulkan. لا يتوفر له شرح عربي مفصل في بيانات المشروع بعد.';
}

function inferVariableDescription(name, sectionName) {
  switch (sectionName) {
    case 'Structures':
      return 'هيكل بيانات من Vulkan يُستخدم لتمرير إعدادات أو استقبال نتائج من الدوال.';
    case 'Enumerations':
      return 'نوع تعداد يعرّف مجموعة قيم مسماة لاختيار سلوك أو حالة داخل Vulkan.';
    case 'Flags':
      return 'نوع أعلام bitmask يُستخدم لدمج عدة خيارات داخل قيمة واحدة.';
    case 'Object Handles':
      return 'مقبض لكائن من كائنات Vulkan يُستخدم كمرجع إلى مورد أو كيان تديره الواجهة.';
    case 'Function Pointer Types':
      return 'نوع مؤشر دالة أو callback يُستخدم لتمرير دوال مخصصة أو استرجاعها ديناميكياً.';
    case 'Scalar Types':
      return 'نوع أساسي أو نوع منصّة يُستخدم في واجهة Vulkan لتمثيل قيم منخفضة المستوى.';
    case 'Constants':
      return 'ثابت مرجعي من Vulkan يمثل قيمة خاصة أو حدّاً معروفاً مسبقاً.';
    default:
      return 'عنصر مرجعي من Vulkan ضمن صفحة الأنواع والثوابت.';
  }
}

function inferExtension(name) {
  const match = name.match(
    /(KHR|EXT|AMD|NVX|NV|INTEL|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX)$/
  );

  return match ? match[1] : '';
}

function inferFunctionFamily(name) {
  if (name.startsWith('vkCmd')) return 'أوامر Command Buffer';
  if (name.startsWith('vkCreate')) return 'الإنشاء';
  if (name.startsWith('vkDestroy')) return 'التدمير';
  if (name.startsWith('vkGet')) return 'الاستعلام';
  if (name.startsWith('vkEnumerate')) return 'الاستعراض';
  if (name.startsWith('vkAllocate')) return 'الحجز';
  if (name.startsWith('vkFree')) return 'التحرير';
  if (name.startsWith('vkQueue')) return 'الطوابير';
  return 'أوامر Vulkan';
}

function formatFunctionCategory(category, name) {
  const categories = {
    instance: 'المثيل',
    device: 'الجهاز المنطقي',
    physical_device: 'الجهاز الفيزيائي',
    queue: 'الطوابير',
    swapchain: 'سلسلة التبديل',
    surface: 'السطح',
    command_buffer: 'مخزن الأوامر',
    command_pool: 'مستودع الأوامر',
    render_pass: 'تمرير الرسم',
    pipeline: 'خط الأنابيب',
    shader: 'المظللات',
    descriptor: 'الواصفات',
    buffer: 'المخازن',
    image: 'الصور',
    memory: 'الذاكرة',
    synchronization: 'المزامنة',
    sync: 'المزامنة',
    query: 'الاستعلامات',
    debug: 'التصحيح',
    validation: 'التحقق'
  };

  if (!category) {
    return inferFunctionFamily(name);
  }

  return categories[category] || inferFunctionFamily(name);
}

function buildItemId(prefix, name) {
  return `${prefix}:${name}`;
}

function collectLetterItems(groupedSection, sectionName, builder) {
  const result = [];

  for (const [letter, items] of Object.entries(groupedSection || {})) {
    for (const name of items) {
      result.push(builder(name, letter, sectionName));
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

function buildData(sections, functionDocs, macroDocs) {
  const functions = collectLetterItems(sections.Commands, 'Commands', (name, letter, sectionName) => {
    const doc = functionDocs.get(name) || {};

    return {
      id: buildItemId('fn', name),
      name,
      letter,
      section: sectionName,
      sectionLabel: SECTION_AR[sectionName],
      badge: formatFunctionCategory(doc.category, name),
      description: doc.description || inferFunctionDescription(name),
      signature: doc.signature || '',
      parameters: doc.parameters || [],
      returnType: doc.returnType || '',
      returnValues: doc.returnValues || [],
      notes: doc.notes || [],
      example: doc.example || '',
      seeAlso: doc.seeAlso || [],
      extension: inferExtension(name)
    };
  });

  const macros = collectLetterItems(
    sections['C Macro Definitions'],
    'C Macro Definitions',
    (name, letter, sectionName) => {
      const doc = macroDocs.get(name) || {};

      return {
        id: buildItemId('macro', name),
        name,
        letter,
        section: sectionName,
        sectionLabel: SECTION_AR[sectionName],
        badge: doc.parameters?.length ? 'ماكرو قابل للاستدعاء' : 'ثابت/ماكرو',
        description: doc.description || inferMacroDescription(name),
        syntax: doc.syntax || name,
        parameters: doc.parameters || [],
        returnValue: doc.returnValue || '',
        notes: doc.notes || [],
        example: doc.example || '',
        extension: inferExtension(name)
      };
    }
  );

  const variables = VARIABLE_SECTIONS.flatMap((sectionName) =>
    collectLetterItems(sections[sectionName], sectionName, (name, letter, sourceSection) => ({
      id: buildItemId('var', `${sourceSection}:${name}`),
      name,
      letter,
      section: sourceSection,
      sectionLabel: SECTION_AR[sourceSection],
      badge: SECTION_AR[sourceSection],
      description: inferVariableDescription(name, sourceSection),
      extension: inferExtension(name)
    }))
  );

  return {
    meta: {
      title: 'مرجع Vulkan بالعربية',
      subtitle: 'فهرس عربي للدوال والأنواع والثوابت والماكرو مستخرج من مرجع Vulkan الرسمي',
      generatedAt: new Date().toISOString().slice(0, 10)
    },
    counts: {
      functions: functions.length,
      variables: variables.length,
      macros: macros.length
    },
    sections: {
      variables: VARIABLE_SECTIONS.map((name) => ({
        key: name,
        label: SECTION_AR[name],
        count: variables.filter((item) => item.section === name).length
      }))
    },
    items: {
      functions,
      variables,
      macros
    }
  };
}

function buildPage(data) {
  const payload = JSON.stringify(data).replace(/<\//g, '<\\/');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="مرجع عربي للدوال والأنواع والثوابت والماكرو في Vulkan">
  <meta name="keywords" content="Vulkan, مرجع, عربي, دوال, ماكرو, أنواع">
  <title>مرجع Vulkan بالعربية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <style>
    :root {
      --ref-surface: rgba(255, 255, 255, 0.04);
      --ref-surface-strong: rgba(255, 255, 255, 0.07);
      --ref-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
    }

    body {
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(233, 69, 96, 0.22), transparent 26%),
        radial-gradient(circle at top right, rgba(88, 166, 255, 0.18), transparent 24%),
        linear-gradient(180deg, #0b1020 0%, #12182d 52%, #0d1326 100%);
    }

    .ref-shell {
      max-width: 1480px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.3fr 0.9fr;
      gap: 18px;
      margin-bottom: 22px;
    }

    .hero-card,
    .summary-card,
    .controls,
    .list-panel,
    .detail-panel {
      background: var(--ref-surface);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 22px;
      box-shadow: var(--ref-shadow);
      backdrop-filter: blur(18px);
    }

    .hero-card {
      padding: 28px;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(233, 69, 96, 0.14);
      color: #ffd7de;
      font-size: 0.82rem;
      margin-bottom: 14px;
    }

    .hero h1 {
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.2;
      margin-bottom: 10px;
    }

    .hero p {
      color: var(--text-muted);
      max-width: 72ch;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .hero-meta span {
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      color: #dce6ff;
      font-size: 0.86rem;
    }

    .summary-card {
      padding: 22px;
      display: grid;
      gap: 14px;
    }

    .summary-card h2 {
      font-size: 1.05rem;
      color: #fff1f3;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .stat-box {
      padding: 14px;
      border-radius: 16px;
      background: var(--ref-surface-strong);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .stat-box strong {
      display: block;
      font-size: 1.5rem;
      color: #fff;
    }

    .stat-box span {
      color: var(--text-muted);
      font-size: 0.86rem;
    }

    .controls {
      padding: 18px;
      margin-bottom: 18px;
    }

    .search-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
    }

    .search-field {
      width: 100%;
      padding: 15px 18px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(13, 17, 23, 0.7);
      color: var(--text-color);
      font-family: var(--font-arabic);
      font-size: 1rem;
    }

    .tab-row,
    .filter-row,
    .letter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }

    .tab-btn,
    .filter-chip,
    .letter-chip {
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-color);
      border-radius: 999px;
      padding: 9px 14px;
      cursor: pointer;
      transition: 0.2s ease;
      font-family: var(--font-arabic);
    }

    .tab-btn.active,
    .filter-chip.active,
    .letter-chip:hover,
    .letter-chip.active {
      background: var(--accent-color);
      border-color: transparent;
      color: white;
    }

    .workspace {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
      gap: 18px;
      align-items: start;
    }

    .list-panel {
      padding: 18px;
      min-height: 65vh;
    }

    .detail-panel {
      padding: 22px;
      position: sticky;
      top: 20px;
    }

    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .panel-head h2 {
      font-size: 1.1rem;
    }

    .panel-muted {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .result-group + .result-group {
      margin-top: 18px;
    }

    .group-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 0.96rem;
      color: #fff;
    }

    .group-title span {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(233, 69, 96, 0.14);
      color: #ffd9df;
      font-weight: 800;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
    }

    .item-card {
      padding: 14px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: 0.2s ease;
      text-align: right;
    }

    .item-card:hover,
    .item-card.active {
      background: rgba(233, 69, 96, 0.12);
      border-color: rgba(233, 69, 96, 0.26);
      transform: translateY(-1px);
    }

    .item-top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: start;
      margin-bottom: 8px;
    }

    .item-name {
      font-family: var(--font-code);
      font-size: 0.92rem;
      color: #fff;
      line-height: 1.55;
      word-break: break-word;
    }

    .item-badge,
    .detail-badge,
    .extension-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    .item-badge,
    .detail-badge {
      background: rgba(88, 166, 255, 0.14);
      color: #cde5ff;
    }

    .extension-badge {
      background: rgba(63, 185, 80, 0.16);
      color: #d4ffd8;
      margin-top: 10px;
    }

    .item-desc {
      color: var(--text-muted);
      font-size: 0.87rem;
      line-height: 1.7;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .detail-head h3 {
      font-family: var(--font-code);
      font-size: 1.24rem;
      line-height: 1.5;
      margin: 10px 0 8px;
      word-break: break-word;
    }

    .detail-description {
      color: #f3f5fb;
      line-height: 1.9;
      margin-top: 14px;
    }

    .detail-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .detail-section {
      margin-top: 18px;
    }

    .detail-section h4 {
      margin-bottom: 10px;
      font-size: 0.98rem;
      color: #ffdfe4;
    }

    .code-block-lite {
      direction: ltr;
      text-align: left;
      background: rgba(13, 17, 23, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 14px;
      font-family: var(--font-code);
      font-size: 0.9rem;
      line-height: 1.7;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      overflow: hidden;
    }

    .details-table th,
    .details-table td {
      padding: 12px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      vertical-align: top;
      text-align: right;
    }

    .details-table th {
      color: #fff;
      background: rgba(255, 255, 255, 0.04);
      font-size: 0.84rem;
    }

    .details-table td {
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .details-table td code {
      color: #fff;
      font-family: var(--font-code);
    }

    .bullet-list {
      display: grid;
      gap: 8px;
      padding-right: 18px;
      color: var(--text-muted);
    }

    .no-results,
    .empty-state {
      padding: 28px 18px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px dashed rgba(255, 255, 255, 0.12);
      color: var(--text-muted);
      text-align: center;
    }

    .footer-note {
      margin-top: 22px;
      color: var(--text-muted);
      font-size: 0.88rem;
      text-align: center;
    }

    @media (max-width: 1080px) {
      .hero,
      .workspace {
        grid-template-columns: 1fr;
      }

      .detail-panel {
        position: static;
      }
    }

    @media (max-width: 680px) {
      .ref-shell {
        padding: 18px 12px 32px;
      }

      .hero-card,
      .summary-card,
      .controls,
      .list-panel,
      .detail-panel {
        border-radius: 18px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .search-row {
        grid-template-columns: 1fr;
      }

      .items-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="ref-shell">
    <section class="hero">
      <div class="hero-card">
        <div class="eyebrow">مرجع مستخرج من Vulkan API Reference Pages</div>
        <h1 id="hero-title"></h1>
        <p id="hero-subtitle"></p>
        <div class="hero-meta">
          <span>تركيز هذه الصفحة: الدوال، الأنواع والثوابت، والماكرو</span>
          <span>لغة العرض: العربية</span>
          <span id="generated-at"></span>
        </div>
      </div>
      <aside class="summary-card">
        <h2>إحصاءات المرجع</h2>
        <div class="stats-grid" id="stats-grid"></div>
        <p class="panel-muted">بعض العناصر تملك وصفاً عربياً كاملاً من ملفات المشروع، والبقية تُعرض بوصف تنظيمي احتياطي حتى يكتمل التعريب التفصيلي.</p>
      </aside>
    </section>

    <section class="controls">
      <div class="search-row">
        <input id="search-input" class="search-field" type="search" placeholder="ابحث باسم دالة أو نوع أو ماكرو مثل vkCreateInstance أو VkBuffer أو VK_MAKE_VERSION">
        <div class="panel-muted" id="results-meta"></div>
      </div>
      <div class="tab-row" id="tab-row"></div>
      <div class="filter-row" id="filter-row"></div>
      <div class="letter-row" id="letter-row"></div>
    </section>

    <section class="workspace">
      <div class="list-panel">
        <div class="panel-head">
          <h2 id="list-title">العناصر</h2>
          <div class="panel-muted" id="list-count"></div>
        </div>
        <div id="results"></div>
      </div>

      <aside class="detail-panel">
        <div id="detail"></div>
      </aside>
    </section>

    <p class="footer-note">
      الصفحة مولدة محلياً من المصدر الخام المحفوظ في <code>data/ref-source.txt</code> مع دمج الشروح المتاحة من ملفات البيانات العربية داخل المشروع.
    </p>
  </div>

  <script id="reference-data" type="application/json">${payload}</script>
  <script>
    const referenceData = JSON.parse(document.getElementById('reference-data').textContent);

    const tabConfig = {
      functions: { label: 'الدوال', emoji: '⚡' },
      variables: { label: 'الأنواع والثوابت', emoji: '📦' },
      macros: { label: 'الماكرو', emoji: '#️⃣' }
    };

    const state = {
      tab: 'functions',
      search: '',
      section: 'all',
      letter: 'all',
      selectedId: null
    };

    function escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function nl2br(value) {
      return escapeHtml(value).replace(/\\n/g, '<br>');
    }

    function getActiveItems() {
      const items = referenceData.items[state.tab] || [];
      const term = state.search.trim().toLowerCase();

      return items.filter((item) => {
        const matchesSection = state.section === 'all' || item.section === state.section;
        const matchesLetter = state.letter === 'all' || item.letter === state.letter;
        const haystack = [
          item.name,
          item.description,
          item.badge,
          item.sectionLabel,
          item.signature,
          item.syntax,
          item.extension
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return matchesSection && matchesLetter && (!term || haystack.includes(term));
      });
    }

    function ensureSelection(items) {
      if (!items.length) {
        state.selectedId = null;
        return;
      }

      const exists = items.some((item) => item.id === state.selectedId);
      if (!exists) {
        state.selectedId = items[0].id;
      }
    }

    function getSelectedItem(items) {
      return items.find((item) => item.id === state.selectedId) || null;
    }

    function groupItemsByLetter(items) {
      const groups = new Map();

      items.forEach((item) => {
        if (!groups.has(item.letter)) {
          groups.set(item.letter, []);
        }
        groups.get(item.letter).push(item);
      });

      return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], 'en'));
    }

    function renderHeader() {
      document.getElementById('hero-title').textContent = referenceData.meta.title;
      document.getElementById('hero-subtitle').textContent = referenceData.meta.subtitle;
      document.getElementById('generated-at').textContent = 'تاريخ التوليد: ' + referenceData.meta.generatedAt;

      const stats = [
        { label: 'دوال', value: referenceData.counts.functions },
        { label: 'أنواع وثوابت', value: referenceData.counts.variables },
        { label: 'ماكرو', value: referenceData.counts.macros }
      ];

      document.getElementById('stats-grid').innerHTML = stats
        .map((stat) => \`
          <div class="stat-box">
            <strong>\${stat.value.toLocaleString('en-US')}</strong>
            <span>\${stat.label}</span>
          </div>
        \`)
        .join('');
    }

    function renderTabs() {
      document.getElementById('tab-row').innerHTML = Object.entries(tabConfig)
        .map(([key, info]) => {
          const count = referenceData.counts[key];
          return \`
            <button class="tab-btn \${state.tab === key ? 'active' : ''}" data-tab="\${key}">
              \${info.emoji} \${info.label} <span>· \${count}</span>
            </button>
          \`;
        })
        .join('');

      document.querySelectorAll('[data-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          state.tab = button.dataset.tab;
          state.section = 'all';
          state.letter = 'all';
          state.selectedId = null;
          render();
        });
      });
    }

    function renderFilters(items) {
      const container = document.getElementById('filter-row');

      if (state.tab !== 'variables') {
        container.innerHTML = '';
        return;
      }

      const available = referenceData.sections.variables.filter((section) =>
        referenceData.items.variables.some((item) => item.section === section.key)
      );

      container.innerHTML = [
        \`<button class="filter-chip \${state.section === 'all' ? 'active' : ''}" data-section="all">الكل</button>\`,
        ...available.map(
          (section) =>
            \`<button class="filter-chip \${state.section === section.key ? 'active' : ''}" data-section="\${section.key}">\${section.label} · \${section.count}</button>\`
        )
      ].join('');

      container.querySelectorAll('[data-section]').forEach((button) => {
        button.addEventListener('click', () => {
          state.section = button.dataset.section;
          state.letter = 'all';
          state.selectedId = null;
          render();
        });
      });
    }

    function renderLetters(items) {
      const letters = Array.from(new Set(items.map((item) => item.letter))).sort((a, b) => a.localeCompare(b, 'en'));
      const container = document.getElementById('letter-row');

      if (!letters.length) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = [
        \`<button class="letter-chip \${state.letter === 'all' ? 'active' : ''}" data-letter="all">كل الحروف</button>\`,
        ...letters.map(
          (letter) =>
            \`<button class="letter-chip \${state.letter === letter ? 'active' : ''}" data-letter="\${letter}">\${letter}</button>\`
        )
      ].join('');

      container.querySelectorAll('[data-letter]').forEach((button) => {
        button.addEventListener('click', () => {
          state.letter = button.dataset.letter;
          state.selectedId = null;
          render();
        });
      });
    }

    function renderList(items) {
      const title = tabConfig[state.tab].label;
      const groups = groupItemsByLetter(items);

      document.getElementById('list-title').textContent = title;
      document.getElementById('list-count').textContent = items.length + ' عنصر';
      document.getElementById('results-meta').textContent = items.length
        ? 'النتائج الحالية: ' + items.length
        : 'لا توجد نتائج مطابقة';

      if (!items.length) {
        document.getElementById('results').innerHTML = '<div class="no-results">لم يتم العثور على عناصر مطابقة. غيّر كلمة البحث أو أزل أحد الفلاتر.</div>';
        return;
      }

      document.getElementById('results').innerHTML = groups
        .map(([letter, groupItems]) => \`
          <section class="result-group">
            <h3 class="group-title"><span>\${letter}</span> <strong>\${groupItems.length}</strong></h3>
            <div class="items-grid">
              \${groupItems
                .map(
                  (item) => \`
                    <button class="item-card \${state.selectedId === item.id ? 'active' : ''}" data-item-id="\${item.id}">
                      <div class="item-top">
                        <div class="item-name">\${escapeHtml(item.name)}</div>
                        <span class="item-badge">\${escapeHtml(item.badge || item.sectionLabel)}</span>
                      </div>
                      <div class="item-desc">\${escapeHtml(item.description)}</div>
                    </button>
                  \`
                )
                .join('')}
            </div>
          </section>
        \`)
        .join('');

      document.querySelectorAll('[data-item-id]').forEach((button) => {
        button.addEventListener('click', () => {
          state.selectedId = button.dataset.itemId;
          render();
        });
      });
    }

    function renderParameters(title, parameters) {
      if (!parameters || !parameters.length) {
        return '';
      }

      return \`
        <section class="detail-section">
          <h4>\${title}</h4>
          <table class="details-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>النوع</th>
                <th>الوصف</th>
              </tr>
            </thead>
            <tbody>
              \${parameters
                .map(
                  (param) => \`
                    <tr>
                      <td><code>\${escapeHtml(param.name || '')}</code></td>
                      <td><code>\${escapeHtml(param.type || '')}</code></td>
                      <td>\${escapeHtml(param.description || '')}</td>
                    </tr>
                  \`
                )
                .join('')}
            </tbody>
          </table>
        </section>
      \`;
    }

    function renderReturnValues(values) {
      if (!values || !values.length) {
        return '';
      }

      return \`
        <section class="detail-section">
          <h4>القيم المرجعة</h4>
          <table class="details-table">
            <thead>
              <tr>
                <th>القيمة</th>
                <th>الوصف</th>
              </tr>
            </thead>
            <tbody>
              \${values
                .map(
                  (entry) => \`
                    <tr>
                      <td><code>\${escapeHtml(entry.value || '')}</code></td>
                      <td>\${escapeHtml(entry.description || '')}</td>
                    </tr>
                  \`
                )
                .join('')}
            </tbody>
          </table>
        </section>
      \`;
    }

    function renderNotes(title, notes) {
      if (!notes || !notes.length) {
        return '';
      }

      return \`
        <section class="detail-section">
          <h4>\${title}</h4>
          <ul class="bullet-list">
            \${notes.map((note) => \`<li>\${escapeHtml(note)}</li>\`).join('')}
          </ul>
        </section>
      \`;
    }

    function renderDetail(item) {
      if (!item) {
        document.getElementById('detail').innerHTML = '<div class="empty-state">اختر عنصراً من القائمة لعرض تفاصيله هنا.</div>';
        return;
      }

      const codeBlock = item.signature || item.syntax;
      const returnValue = item.returnValue
        ? \`
            <section class="detail-section">
              <h4>القيمة الناتجة</h4>
              <div class="code-block-lite">\${escapeHtml(item.returnValue)}</div>
            </section>
          \`
        : '';

      const example = item.example
        ? \`
            <section class="detail-section">
              <h4>مثال</h4>
              <div class="code-block-lite">\${nl2br(item.example)}</div>
            </section>
          \`
        : '';

      const seeAlso = item.seeAlso?.length
        ? \`
            <section class="detail-section">
              <h4>انظر أيضاً</h4>
              <div class="detail-meta">
                \${item.seeAlso.map((name) => \`<span class="detail-badge">\${escapeHtml(name)}</span>\`).join('')}
              </div>
            </section>
          \`
        : '';

      document.getElementById('detail').innerHTML = \`
        <div class="detail-head">
          <span class="detail-badge">\${escapeHtml(item.sectionLabel)}</span>
          <h3>\${escapeHtml(item.name)}</h3>
          <div class="detail-meta">
            <span class="detail-badge">\${escapeHtml(item.badge || item.sectionLabel)}</span>
            \${item.extension ? \`<span class="extension-badge">امتداد: \${escapeHtml(item.extension)}</span>\` : ''}
          </div>
        </div>

        <p class="detail-description">\${escapeHtml(item.description)}</p>

        \${codeBlock ? \`
          <section class="detail-section">
            <h4>\${item.signature ? 'التوقيع' : 'الصياغة'}</h4>
            <div class="code-block-lite">\${escapeHtml(codeBlock)}</div>
          </section>
        \` : ''}

        \${renderParameters(item.section === 'C Macro Definitions' ? 'المعاملات' : 'المعاملات', item.parameters)}
        \${renderReturnValues(item.returnValues)}
        \${returnValue}
        \${renderNotes('ملاحظات', item.notes)}
        \${example}
        \${seeAlso}
      \`;
    }

    function render() {
      const items = getActiveItems();
      ensureSelection(items);
      const selectedItem = getSelectedItem(items);

      renderTabs();
      renderFilters(items);
      renderLetters(items);
      renderList(items);
      renderDetail(selectedItem);
    }

    document.getElementById('search-input').addEventListener('input', (event) => {
      state.search = event.target.value;
      state.selectedId = null;
      render();
    });

    renderHeader();
    render();
  </script>
</body>
</html>
`;
}

function main() {
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const sections = parseReferenceSections(sourceText);
  const functionDocs = loadFunctionDocs();
  const macroDocs = loadMacroDocs();
  const data = buildData(sections, functionDocs, macroDocs);
  const output = buildPage(data);

  fs.writeFileSync(outputPath, output);

  console.log(
    JSON.stringify(
      {
        output: path.relative(rootDir, outputPath),
        source: path.relative(rootDir, sourcePath),
        counts: data.counts
      },
      null,
      2
    )
  );
}

main();
