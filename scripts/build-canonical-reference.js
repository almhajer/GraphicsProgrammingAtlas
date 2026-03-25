#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outputRoot = path.join(rootDir, 'content', 'reference');
const manifestPath = path.join(outputRoot, 'manifest.json');
const schemaVersion = '2026-03-reference-architecture-1';

const STANDARD_KIND_META = {
  functions: {
    id: 'functions',
    displayName: 'Functions',
    displayNameArabic: 'الدوال',
    description: 'استدعاءات تنفذ فعلاً، تغيّر حالة، أو تعيد نتيجة، أو تبني مورداً.'
  },
  commands: {
    id: 'commands',
    displayName: 'Commands',
    displayNameArabic: 'الأوامر',
    description: 'تعليمات CMake التنفيذية التي تبني الرسم البياني للبناء أو تعدل خصائص الأهداف والمتغيرات.'
  },
  structures: {
    id: 'structures',
    displayName: 'Structures',
    displayNameArabic: 'البنى',
    description: 'حاويات حقول تقرأها المكتبة أو الواجهة كوحدة منطقية واحدة.'
  },
  variables: {
    id: 'variables',
    displayName: 'Variables',
    displayNameArabic: 'المتغيرات والأنواع الخاصة',
    description: 'مقابض، أنواع قياسية، مؤشرات دوال، وأعلام تمثل قيماً تمرر بين الدوال والحقول.'
  },
  properties: {
    id: 'properties',
    displayName: 'Properties',
    displayNameArabic: 'الخصائص',
    description: 'قيم مرتبطة بكيانات مثل target أو directory أو source file وتغيّر سلوك البناء فعلياً.'
  },
  types: {
    id: 'types',
    displayName: 'Types',
    displayNameArabic: 'الأنواع',
    description: 'أنواع مجردة أو صريحة تحمل معنى دلالياً وتظهر في التواقيع والبنى.'
  },
  enums: {
    id: 'enums',
    displayName: 'Enums',
    displayNameArabic: 'التعدادات',
    description: 'مجالات اختيار مغلقة تحدد نمطاً أو حالة أو مساراً تنفيذياً.'
  },
  constants: {
    id: 'constants',
    displayName: 'Constants',
    displayNameArabic: 'الثوابت',
    description: 'قيم ثابتة جاهزة تحمل معنى سلوكياً أو رمزياً محدداً.'
  },
  macros: {
    id: 'macros',
    displayName: 'Macros',
    displayNameArabic: 'الماكرو',
    description: 'توسعات نصية أو قيم توليدية يطبقها المعالج المسبق قبل الترجمة.'
  },
  modules: {
    id: 'modules',
    displayName: 'Modules',
    displayNameArabic: 'الوحدات',
    description: 'ملفات CMake جاهزة تضيف سلوكاً أو أدوات مساندة مثل الاختبارات أو التثبيت أو البحث عن الحزم.'
  },
  policies: {
    id: 'policies',
    displayName: 'Policies',
    displayNameArabic: 'السياسات',
    description: 'قواعد توافق تحدد هل يعتمد CMake السلوك القديم أو السلوك الأحدث لمسار معين.'
  },
  headers: {
    id: 'headers',
    displayName: 'Header Files',
    displayNameArabic: 'ملفات الترويسة',
    description: 'ترويسات تربط التطبيق بأنواع ودوال ومفاتيح مكتبة Vulkan الرسمية أو طبقاتها المساندة.'
  },
  directives: {
    id: 'directives',
    displayName: 'Directives',
    displayNameArabic: 'التوجيهات',
    description: 'أوامر موجهة للمترجم أو للـ preprocessor، لا تنفذ مباشرة على زمن التشغيل.'
  },
  qualifiers: {
    id: 'qualifiers',
    displayName: 'Qualifiers',
    displayNameArabic: 'المحددات',
    description: 'كلمات تحدد دور المتغير أو اتجاهه أو طريقة تموضعه في خط الأنابيب.'
  },
  builtins: {
    id: 'builtins',
    displayName: 'Built-ins',
    displayNameArabic: 'العناصر المضمنة',
    description: 'رموز أو متغيرات أو دوال يوفرها النظام نفسه داخل اللغة أو الواجهة.'
  },
  blocks: {
    id: 'blocks',
    displayName: 'Blocks',
    displayNameArabic: 'الكتل',
    description: 'بنى واجهات أو كتل ربط تجمع حقولاً ترتبط بمرحلة أو بوحدة واحدة.'
  },
  'control-flow': {
    id: 'control-flow',
    displayName: 'Control Flow',
    displayNameArabic: 'التحكم في التدفق',
    description: 'تعابير وأوامر تتحكم في مسار التنفيذ وتفرعاته وتكراره.'
  },
  expressions: {
    id: 'expressions',
    displayName: 'Expressions',
    displayNameArabic: 'التعبيرات',
    description: 'تراكيب أو عناصر تمثل ناتجاً حسابياً أو منطقياً أو شرطياً.'
  },
  presets: {
    id: 'presets',
    displayName: 'Presets',
    displayNameArabic: 'الضبطات المسبقة',
    description: 'تعريفات JSON تعلن إعدادات configure أو build أو test القابلة لإعادة الاستخدام بين المطورين والأدوات.'
  },
  concepts: {
    id: 'concepts',
    displayName: 'Concepts',
    displayNameArabic: 'المفاهيم',
    description: 'مفاهيم تشغيلية تشرح كيف يفكر CMake في configure وgenerate وtargets وscope وcache.'
  },
  examples: {
    id: 'examples',
    displayName: 'Examples',
    displayNameArabic: 'الأمثلة',
    description: 'أمثلة صغيرة تربط الأوامر والمتغيرات والخصائص بمسار عملي كامل داخل CMakeLists.txt.'
  },
  misc: {
    id: 'misc',
    displayName: 'Misc',
    displayNameArabic: 'عناصر أخرى',
    description: 'أي نوع لا يندرج مباشرة تحت الأقسام القياسية الأخرى.'
  }
};

const LIBRARY_META = {
  vulkan: {
    id: 'vulkan',
    displayName: 'Vulkan',
    displayNameArabic: 'فولكان',
    description: 'طبقة المرجع العربية لعناصر Vulkan منخفضة المستوى: الدوال والبنى والتعدادات والثوابت والأنواع.'
  },
  'sdl3-core': {
    id: 'sdl3-core',
    displayName: 'SDL3 API',
    displayNameArabic: 'SDL3',
    description: 'النواة الأساسية لـ SDL3: النوافذ، الإدخال، الأحداث، الصوت، والرسم الأساسي.'
  },
  'sdl3-audio': {
    id: 'sdl3-audio',
    displayName: 'SDL3Audio',
    displayNameArabic: 'SDL3Audio',
    description: 'مرجع عربي مستقل لفرع الصوت في SDL3: الأجهزة، SDL_AudioStream، تنسيقات العينات، وماكرو الصوت الرسمية.'
  },
  'sdl3-image': {
    id: 'sdl3-image',
    displayName: 'SDL3_image',
    displayNameArabic: 'SDL3_image',
    description: 'ملحق SDL3 الرسمي للصور والرسوم المتحركة وتحويلها إلى موارد قابلة للاستهلاك.'
  },
  'sdl3-mixer': {
    id: 'sdl3-mixer',
    displayName: 'SDL3_mixer',
    displayNameArabic: 'SDL3_mixer',
    description: 'ملحق SDL3 الرسمي للصوت والمزج وتشغيل الملفات والمسارات الصوتية.'
  },
  'sdl3-ttf': {
    id: 'sdl3-ttf',
    displayName: 'SDL3_ttf',
    displayNameArabic: 'SDL3_ttf',
    description: 'ملحق SDL3 الرسمي للخطوط والنصوص ورسم الحروف وقياسها.'
  },
  imgui: {
    id: 'imgui',
    displayName: 'Dear ImGui',
    displayNameArabic: 'Dear ImGui',
    description: 'مرجع عربي لعناصر Dear ImGui التفاعلية وحالتها ومعناها العملي داخل الإطار.'
  },
  glslang: {
    id: 'glslang',
    displayName: 'GLSLang',
    displayNameArabic: 'GLSLang',
    description: 'مرجع عربي لعناصر GLSL وGLSLang من التوجيهات حتى الدوال والعناصر المضمنة.'
  },
  cmake: {
    id: 'cmake',
    displayName: 'CMake',
    displayNameArabic: 'CMake',
    description: 'مرجع عربي عملي لأوامر CMake ومتغيراته وخصائصه ووحداته وسياساته وتدفق configure/generate/build.'
  }
};

const WORD_TRANSLATIONS = {
  animation: 'الرسوم المتحركة',
  encoder: 'المشفر',
  decoder: 'مفكك الترميز',
  frame: 'الإطار',
  stream: 'الدفق',
  image: 'الصورة',
  images: 'الصور',
  window: 'النافذة',
  renderer: 'العارض',
  render: 'الرسم',
  surface: 'السطح',
  texture: 'الخامة',
  event: 'الحدث',
  events: 'الأحداث',
  audio: 'الصوت',
  video: 'الفيديو',
  display: 'الشاشة',
  cursor: 'المؤشر',
  mouse: 'الفأرة',
  keyboard: 'لوحة المفاتيح',
  clipboard: 'الحافظة',
  font: 'الخط',
  text: 'النص',
  thread: 'الخيط',
  threads: 'الخيوط',
  color: 'اللون',
  colours: 'الألوان',
  file: 'الملف',
  files: 'الملفات',
  path: 'المسار',
  paths: 'المسارات',
  mode: 'الوضع',
  state: 'الحالة',
  status: 'الحالة',
  result: 'النتيجة',
  results: 'النتائج',
  type: 'النوع',
  types: 'الأنواع',
  flags: 'الأعلام',
  flag: 'العلم',
  style: 'النمط',
  properties: 'الخصائص',
  property: 'الخاصية',
  context: 'السياق',
  contexts: 'السياقات',
  device: 'الجهاز',
  devices: 'الأجهزة',
  shader: 'المظلل',
  module: 'الوحدة',
  queue: 'الطابور',
  buffer: 'المخزن',
  command: 'الأمر',
  commands: 'الأوامر',
  memory: 'الذاكرة',
  value: 'القيمة',
  values: 'القيم',
  header: 'الترويسة',
  input: 'الإدخال',
  output: 'الإخراج',
  styleflags: 'أعلام النمط',
  enum: 'التعداد',
  structure: 'البنية',
  internal: 'الداخلية',
  system: 'النظام',
  theme: 'السمة',
  storage: 'التخزين',
  translation: 'الترجمة'
};

const VERB_TRANSLATIONS = {
  add: 'إضافة',
  append: 'إلحاق',
  begin: 'بدء',
  build: 'بناء',
  clear: 'مسح',
  close: 'إغلاق',
  convert: 'تحويل',
  create: 'إنشاء',
  destroy: 'تدمير',
  disable: 'تعطيل',
  draw: 'رسم',
  enable: 'تفعيل',
  end: 'إنهاء',
  free: 'تحرير',
  get: 'جلب',
  init: 'تهيئة',
  initialize: 'تهيئة',
  load: 'تحميل',
  lock: 'قفل',
  open: 'فتح',
  pause: 'إيقاف مؤقت',
  pop: 'إزالة من القمة',
  push: 'دفع',
  query: 'استعلام',
  read: 'قراءة',
  release: 'تحرير',
  render: 'رسم',
  reset: 'إعادة ضبط',
  resume: 'استئناف',
  save: 'حفظ',
  set: 'ضبط',
  start: 'بدء',
  stop: 'إيقاف',
  submit: 'إرسال',
  unlock: 'فك القفل',
  update: 'تحديث',
  wait: 'انتظار',
  write: 'كتابة',
  acquire: 'الحصول على'
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function stripHtml(value) {
  return normalizeWhitespace(
    String(value || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  );
}

function cleanText(value) {
  return normalizeWhitespace(stripHtml(value));
}

function hasArabicText(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''));
}

function dedupeList(list = []) {
  const normalizedList = Array.isArray(list)
    ? list
    : (list === undefined || list === null || list === '')
      ? []
      : [list];
  return [...new Set(normalizedList.map((entry) => normalizeWhitespace(entry)).filter(Boolean))];
}

function buildLibraryIndexPath(libraryId) {
  return `content/reference/${libraryId}/index.json`;
}

function buildKindIndexPath(libraryId, kindId) {
  return `content/reference/${libraryId}/${kindId}/index.json`;
}

function buildEntityContentPath(libraryId, kindId, slug) {
  return `content/reference/${libraryId}/${kindId}/${slug}.json`;
}

function buildReferenceHash(libraryId = '', kindId = '', slug = '') {
  const parts = ['ref'];
  if (libraryId) parts.push(encodeURIComponent(libraryId));
  if (kindId) parts.push(encodeURIComponent(kindId));
  if (slug) parts.push(encodeURIComponent(slug));
  return `#${parts.join('/')}`;
}

function sentenceToLabel(text = '') {
  let clean = cleanText(text)
    .replace(/^الوصف الرسمي:\s*/i, '')
    .replace(/[.]+$/g, '')
    .replace(/^(دالة|بنية|تعداد|نوع|قيمة|ماكرو)\s+/u, '')
    .trim();
  if (!clean) {
    return '';
  }
  const clause = clean.split(/[،,:;]/u)[0].trim();
  if (clause && clause.length >= 12) {
    clean = clause;
  }
  return clean.length > 96
    ? clean.slice(0, 93).replace(/\s+\S*$/u, '').trim()
    : clean;
}

function splitIdentifierWords(name = '') {
  const normalized = String(name || '')
    .replace(/^#/, '')
    .replace(/::/g, '_')
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .trim();

  if (!normalized) {
    return [];
  }

  if (normalized.includes('_')) {
    return normalized
      .split('_')
      .filter(Boolean)
      .flatMap((chunk) => chunk.match(/[A-Z]+(?=[A-Z][a-z0-9]|\b)|[A-Z]?[a-z]+|[0-9]+/g) || [chunk]);
  }

  return normalized.match(/[A-Z]+(?=[A-Z][a-z0-9]|\b)|[A-Z]?[a-z]+|[0-9]+/g) || [normalized];
}

function slugifyName(name = '') {
  const words = splitIdentifierWords(name)
    .map((word) => String(word || '').toLowerCase())
    .filter(Boolean);

  return words.length ? words.join('-') : String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function translateWord(word = '') {
  const lowered = String(word || '').toLowerCase();
  if (!lowered) {
    return '';
  }
  return WORD_TRANSLATIONS[lowered] || word;
}

function translateNounPhrase(phrase = '') {
  const parts = normalizeWhitespace(String(phrase || ''))
    .replace(/[.,;:()]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !/^(a|an|the|of|to|for|with|into|from|by|on|in|at|or|and)$/i.test(word));

  if (!parts.length) {
    return '';
  }

  return parts
    .map((word) => translateWord(word))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateSimpleEnglishDescription(text = '') {
  const clean = cleanText(text).replace(/[.]+$/g, '');
  if (!clean || hasArabicText(clean)) {
    return '';
  }

  const exact = {
    'Font style flags': 'أعلام نمط الخط',
    'Opaque data!': 'بيانات معتمة لا يطّلع التطبيق على تفاصيلها الداخلية.',
    'The internal structure containing font information': 'بنية داخلية تحتوي معلومات الخط.',
    'An enum representing the status of an animation decoder': 'تعداد يمثل حالة مفكك الرسوم المتحركة.',
    'Create a window with the specified dimensions and flags': 'إنشاء نافذة بالأبعاد والأعلام المحددة.',
    'This function should only be called on the main thread': 'يجب استدعاء هذه الدالة من الخيط الرئيسي فقط.',
    'the title of the window, in UTF-8 encoding': 'يمثل عنوان النافذة بترميز UTF-8.',
    'the width of the window': 'يمثل عرض النافذة.',
    'the height of the window': 'يمثل ارتفاع النافذة.',
    'Add a frame to a stream of images being saved': 'إضافة إطار إلى دفق الصور الجاري حفظها.',
    'the stream receiving images': 'يمثل الدفق الذي يستقبل الصور.',
    'the surface to add as the next frame in the animation': 'يمثل السطح الذي سيضاف بوصفه الإطار التالي في الرسوم المتحركة.'
  };

  if (exact[clean]) {
    return exact[clean];
  }

  const directVerbMatch = /^(Add|Append|Begin|Build|Clear|Close|Convert|Create|Destroy|Disable|Draw|Enable|End|Free|Get|Init|Initialize|Load|Lock|Open|Pause|Pop|Push|Query|Read|Release|Render|Reset|Resume|Save|Set|Start|Stop|Submit|Unlock|Update|Wait|Write|Acquire)\s+(.+)$/i.exec(clean);
  if (directVerbMatch) {
    const verb = VERB_TRANSLATIONS[directVerbMatch[1].toLowerCase()] || directVerbMatch[1];
    const phrase = translateNounPhrase(
      directVerbMatch[2]
        .replace(/\bwith the specified\b/gi, '')
        .replace(/\bwith\b/gi, '')
        .replace(/\band\b/gi, ' ')
    );
    return phrase ? `${verb} ${phrase}.` : `${verb}.`;
  }

  const valueOrMatch = /^0,\s+or one or more ([A-Za-z0-9_]+)\s+OR'd together$/i.exec(clean);
  if (valueOrMatch) {
    return `تمثل القيمة 0 أو علماً واحداً أو عدة أعلام من النوع ${valueOrMatch[1]} مدموجة معاً.`;
  }

  const returnsMatch = /^Returns?\s+(.+)$/i.exec(clean);
  if (returnsMatch) {
    return `يعيد هذا الاستدعاء ${translateNounPhrase(returnsMatch[1]) || returnsMatch[1]}.`;
  }

  const createdPointerReturnMatch = /^\(\s*([^)]+)\s*\)\s*Returns?\s+the\s+(.+?)\s+that\s+was\s+created\s+or\s+NULL\s+on\s+failure;\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for\s+more\s+information$/i.exec(clean);
  if (createdPointerReturnMatch) {
    return `يعيد ${translateNounPhrase(createdPointerReturnMatch[2]) || createdPointerReturnMatch[2]} التي أُنشئت أو NULL عند الفشل؛ استخدم ${createdPointerReturnMatch[3]} لمعرفة السبب.`;
  }

  const boolReturnMatch = /^\(\s*([^)]+)\s*\)\s*Returns?\s+true\s+on\s+success\s+or\s+false\s+on\s+failure;\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for\s+more\s+information$/i.exec(clean);
  if (boolReturnMatch) {
    return `يعيد true عند النجاح وfalse عند الفشل؛ استخدم ${boolReturnMatch[2]} لمعرفة السبب.`;
  }

  const availableSinceMatch = /^This (?:function|enum|macro|type|struct) is available since (.+)$/i.exec(clean);
  if (availableSinceMatch) {
    return `هذا العنصر متاح منذ ${availableSinceMatch[1]}.`;
  }

  const enumMatch = /^An?\s+enum\s+representing\s+(.+)$/i.exec(clean);
  if (enumMatch) {
    return `تعداد يمثل ${translateNounPhrase(enumMatch[1]) || enumMatch[1]}.`;
  }

  const structureMatch = /^The\s+internal\s+structure\s+containing\s+(.+)$/i.exec(clean);
  if (structureMatch) {
    return `بنية داخلية تحتوي ${translateNounPhrase(structureMatch[1]) || structureMatch[1]}.`;
  }

  const referMatch = /^Please refer to ([A-Za-z0-9_]+) for details$/i.exec(clean);
  if (referMatch) {
    return `يُفهم هذا العنصر من خلال المرجع ${referMatch[1]} لأنه يحمل التفاصيل الدقيقة المرتبطة به.`;
  }

  return '';
}

const HEADER_SECTION_KEYS = ['headers', 'utility'];
const HEADER_SOURCE_BASE_URL = 'https://github.com/KhronosGroup/Vulkan-Headers/blob/main/include';
const HEADER_PLATFORM_LABELS = {
  android: 'Android',
  directfb: 'DirectFB',
  fuchsia: 'Fuchsia',
  ggp: 'GGP',
  ios: 'iOS',
  macos: 'macOS',
  metal: 'Metal',
  ohos: 'OpenHarmony',
  screen: 'QNX Screen',
  vi: 'Vi Surface',
  wayland: 'Wayland',
  win32: 'Win32',
  xcb: 'XCB',
  xlib: 'Xlib',
  xlib_xrandr: 'Xlib/Xrandr',
  beta: 'الإصدارات التجريبية',
  profiles: 'Vulkan Profiles'
};

function detectHeaderPlatformKey(fileName = '') {
  const match = /^vulkan_([a-z0-9_]+)\.h$/i.exec(String(fileName || ''));
  return match ? match[1].toLowerCase() : '';
}

function inferHeaderDescription(fileName, sectionKey, sectionTitle = '') {
  const platformKey = detectHeaderPlatformKey(fileName);
  const platformLabel = HEADER_PLATFORM_LABELS[platformKey] || platformKey.toUpperCase();
  if (fileName === 'vulkan.h') {
    return 'الملف الرئيسي الذي يجمع أغلب تعريفات ووحدات Vulkan في ترويسة واحدة قابلة للتضمين في كل الملفات.';
  }
  if (fileName === 'vulkan_core.h') {
    return 'ترويسة النواة الرسمية التي تحتوي الأنواع والتعدادات والهياكل والدوال القياسية قبل تقسيمها على الامتدادات والمنصات.';
  }
  if (fileName === 'vk_platform.h') {
    return 'ترويسة التوافق المنصاتي التي تعرّف الماكروز والأسس مثل VKAPI_CALL وVK_DEFINE_HANDLE قبل استخدام بقية الترويسات.';
  }
  if (platformKey && platformKey !== 'beta') {
    return `ترويسة امتدادات ${platformLabel} Surface لربط Vulkan بطبقة العرض والأدوات الأصلية على ${platformLabel}.`;
  }
  if (fileName.endsWith('.cppm')) {
    return 'وحدة C++ Modules من Vulkan-Hpp لتصدير الواجهة بصيغة وحدات حديثة بدلاً من التضمين التقليدي.';
  }
  if (fileName.endsWith('.hpp')) {
    return 'ترويسة C++ من طبقة Vulkan-Hpp توفر أصنافاً وتعدادات قوية النوع مع أغلفة RAII اختيارية.';
  }
  if (sectionKey === 'utility' || fileName.startsWith('vk_')) {
    return `ترويسة خدمية داخل ${sectionTitle || 'مجلد utility'} تضيف أدوات أو بنى مساندة فوق النواة الأساسية لـ Vulkan.`;
  }
  return `ترويسة ${fileName} تحزم مجموعة من الإعلانات الرسمية داخل حزمة Vulkan SDK لتسهيل الوصول إلى هذا الجزء من الواجهة.`;
}

function inferHeaderUsage(fileName, sectionKey) {
  if (fileName.endsWith('.cppm')) {
    return 'استخدم هذه الوحدة عندما يعتمد مشروعك C++ Modules وتريد استيراد واجهة Vulkan أو طبقة الفيديو دون التضمين التقليدي.';
  }
  if (fileName.endsWith('.hpp')) {
    return 'استخدم هذه الترويسة عند بناء المشروع بواجهة Vulkan-Hpp وتحتاج طبقة C++ الغنية بالأنواع والواجهات الحديثة.';
  }
  if (sectionKey === 'utility') {
    return 'استخدم هذه الترويسة المساندة عندما تطور أدوات، طبقات، أو حلول اختبار تتطلب وظائف إضافية فوق النواة الرئيسية.';
  }
  const platformKey = detectHeaderPlatformKey(fileName);
  if (platformKey && platformKey !== 'beta') {
    return `تستخدم هذه الترويسة عند استهداف منصة ${HEADER_PLATFORM_LABELS[platformKey] || platformKey.toUpperCase()} واحتياجك لإنشاء VkSurface ومزامنة النوافذ مع Vulkan.`;
  }
  if (fileName === 'vulkan_beta.h') {
    return 'تستخدم هذه الترويسة عندما تختبر امتدادات Vulkan التجريبية أو الميزات التي لم تُدمج بعد في الإصدار المستقر.';
  }
  return 'تستخدم هذه الترويسة عندما تحتاج التصريحات والأنواع التي تجمعها دون إعادة تعريفها في كل ملف على حدة.';
}

function inferHeaderIncludes(fileName, sectionKey) {
  if (sectionKey === 'utility') {
    return ['vulkan/vulkan.h'];
  }
  const platformKey = detectHeaderPlatformKey(fileName);
  if (platformKey && platformKey !== 'beta') {
    return ['vulkan/vulkan.h'];
  }
  if (fileName !== 'vulkan.h' && fileName.endsWith('.h')) {
    return ['vulkan/vulkan_core.h'];
  }
  return [];
}

function inferHeaderKeyItems(fileName) {
  if (fileName === 'vulkan.h' || fileName === 'vulkan_core.h') {
    return ['VkInstance', 'VkDevice', 'VkResult', 'vkCreateInstance'];
  }
  if (fileName.endsWith('.hpp') || fileName.endsWith('.cppm')) {
    return ['vk::Instance', 'vk::Device', 'vk::Result'];
  }
  const platformKey = detectHeaderPlatformKey(fileName);
  if (platformKey && platformKey !== 'beta') {
    return ['VkSurfaceKHR', `vkCreate${platformKey.charAt(0).toUpperCase()}${platformKey.slice(1)}SurfaceKHR`];
  }
  return ['VkInstance', 'VkDevice'];
}

function buildHeaderExampleSnippet(fileName, includePath, overrideExample = '') {
  const trimmedOverride = String(overrideExample || '').trim();
  if (trimmedOverride) {
    const comment = `// تضمين ${fileName} قبل استخدام العناصر التي يعلن عنها`;
    return `${comment}\n${trimmedOverride}`;
  }
  if (fileName.endsWith('.cppm')) {
    const moduleName = fileName.replace(/\.cppm$/i, '');
    return `// استيراد الوحدة التي تمثل هذه الترويسة في طبقة Vulkan-Hpp\nimport ${moduleName};`;
  }
  return `// تضمين الترويسة لإتاحة الأنواع والدوال التي تحتويها\n#include <${includePath}>`;
}

function buildHeaderSourceUrl(includePath = '') {
  const clean = String(includePath || '').replace(/^\.?\//, '');
  return clean ? `${HEADER_SOURCE_BASE_URL}/${clean}` : '';
}

function firstArabicOrTranslated(...values) {
  for (const value of values) {
    const clean = cleanText(value);
    if (!clean) {
      continue;
    }
    if (hasArabicText(clean)) {
      return clean;
    }
    const translated = translateSimpleEnglishDescription(clean);
    if (translated) {
      return translated;
    }
  }
  return '';
}

function buildArabicLabelFromName(name = '', kindId = '') {
  const words = splitIdentifierWords(name);
  if (!words.length) {
    return name;
  }

  const maybeVerb = VERB_TRANSLATIONS[String(words[0] || '').toLowerCase()];
  const nounPhrase = words.slice(maybeVerb ? 1 : 0).map((word) => translateWord(word)).join(' ').trim();

  if (maybeVerb && nounPhrase) {
    return `${maybeVerb} ${nounPhrase}`.trim();
  }

  if (kindId === 'functions' && nounPhrase) {
    return `تشغيل ${nounPhrase}`.trim();
  }

  if (kindId === 'structures' && nounPhrase) {
    return `بنية ${nounPhrase}`.trim();
  }

  if (kindId === 'enums' && nounPhrase) {
    return `تعداد ${nounPhrase}`.trim();
  }

  if (kindId === 'constants' && nounPhrase) {
    return `ثابت ${nounPhrase}`.trim();
  }

  if (kindId === 'macros' && nounPhrase) {
    return `ماكرو ${nounPhrase}`.trim();
  }

  if ((kindId === 'variables' || kindId === 'types') && nounPhrase) {
    return `نوع ${nounPhrase}`.trim();
  }

  return nounPhrase || name;
}

function chooseArabicLabel(name = '', kindId = '', candidates = []) {
  for (const candidate of candidates) {
    const clean = sentenceToLabel(candidate);
    if (clean) {
      return clean;
    }
  }
  return buildArabicLabelFromName(name, kindId);
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const clean = cleanText(value);
    if (clean) {
      return clean;
    }
  }
  return '';
}

function mapParameters(parameters = [], functionName = '') {
  return (parameters || []).map((param) => {
    const description = cleanText(param.description || '');
    const translated = translateSimpleEnglishDescription(description);
    const fallback = `يمثل المعامل ${param.name || 'value'} من النوع ${param.type || 'auto'} القيمة أو المورد الذي يعتمد عليه هذا الاستدعاء.`;
    return {
      name: param.name || '',
      type: param.type || '',
      descriptionArabic: hasArabicText(description) ? description : translated || fallback,
      originalDescription: description
    };
  }).filter((param) => param.name || param.type || param.descriptionArabic || functionName);
}

function mapMembers(members = []) {
  return (members || []).map((member) => {
    const description = cleanText(member.description || '');
    const fallback = `يمثل الحقل ${member.name || 'field'} من النوع ${member.type || 'auto'} جزءاً من القيمة التي تحملها هذه البنية أو هذا النوع.`;
    return {
      name: member.name || '',
      type: member.type || '',
      descriptionArabic: hasArabicText(description) ? description : translateSimpleEnglishDescription(description) || fallback,
      originalDescription: description
    };
  }).filter((member) => member.name || member.type || member.descriptionArabic);
}

function mapValues(values = [], ownerName = '') {
  return (values || []).map((value) => {
    const description = cleanText(value.description || '');
    const fallback = `تمثل القيمة ${value.name || ''} أحد الخيارات التي يقرأها العنصر ${ownerName || 'الحالي'} لتحديد سلوك أو حالة محددة.`;
    return {
      name: value.name || '',
      value: value.value || '',
      descriptionArabic: hasArabicText(description) ? description : translateSimpleEnglishDescription(description) || fallback,
      originalDescription: description
    };
  }).filter((value) => value.name || value.value || value.descriptionArabic);
}

function buildPracticalPurpose(kindId = '', item = {}) {
  const direct = firstArabicOrTranslated(
    item.whenToUse,
    Array.isArray(item.usage) ? item.usage[0] : '',
    Array.isArray(item.instructions) ? item.instructions[0] : '',
    Array.isArray(item.remarks) ? item.remarks[0] : ''
  );
  if (direct) {
    return direct;
  }

  const label = sentenceToLabel(firstArabicOrTranslated(item.officialArabicDescription, item.description))
    || buildArabicLabelFromName(item.name || '', kindId);
  if (kindId === 'functions') {
    return `تستخدم هذه الدالة عندما تحتاج إلى ${label} داخل التطبيق أو داخل مسار التنفيذ المرتبط بها.`;
  }
  if (kindId === 'structures') {
    return 'تستخدم هذه البنية عندما تريد تمرير الحقول المرتبطة بهذا المفهوم كوحدة واحدة.';
  }
  if (kindId === 'enums') {
    return 'يستخدم هذا التعداد عندما يحتاج الحقل أو الاستدعاء اختياراً واضحاً من مجموعة قيم محددة.';
  }
  if (kindId === 'constants') {
    return 'يستخدم هذا الثابت عندما تريد التعبير عن هذه الحالة أو هذه القيمة الرمزية دون أرقام سحرية.';
  }
  if (kindId === 'variables' || kindId === 'types') {
    return 'يستخدم هذا النوع عندما تحتاج القيمة أو المقبض أو المؤشر الذي يمثله داخل بقية الواجهة.';
  }
  if (kindId === 'headers') {
    return 'تُضمَّن هذه الترويسة عندما تحتاج الأنواع أو الدوال أو الامتدادات التي تعلن عنها قبل بناء بقية المسار.';
  }
  return '';
}

function buildWhyUse(kindId = '', item = {}) {
  const direct = firstArabicOrTranslated(
    item.practicalBenefit,
    Array.isArray(item.usage) ? item.usage[1] : '',
    Array.isArray(item.notes) ? item.notes[0] : '',
    Array.isArray(item.remarks) ? item.remarks[0] : ''
  );
  if (direct) {
    return direct;
  }

  if (kindId === 'functions') {
    return 'القيمة الحقيقية هنا هي الأثر التنفيذي الذي يحدثه الاستدعاء أو النتيجة التي يعيدها إلى التطبيق.';
  }
  if (kindId === 'structures') {
    return 'القيمة الحقيقية هنا أن المكتبة تقرأ الحقول مجتمعة لا كمتغيرات منفصلة متفرقة.';
  }
  if (kindId === 'enums') {
    return 'القيمة الحقيقية هنا أن كل اختيار يحدد فرعاً فعلياً من السلوك، لا مجرد تسمية شكلية.';
  }
  if (kindId === 'constants') {
    return 'القيمة الحقيقية هنا أن الاسم يحمل معنى السلوك أو الحالة مباشرة من دون الحاجة إلى حفظ الرقم الخام.';
  }
  if (kindId === 'variables' || kindId === 'types') {
    return 'القيمة الحقيقية هنا أنه يمثل نوع القيمة التي تتداولها بقية الواجهة بين الحقول والدوال.';
  }
  if (kindId === 'headers') {
    return 'القيمة الحقيقية هنا أن الترويسة تجمع التصريحات الرسمية في ملف واحد كي تبقى نقاط الدخول والأنواع موحدة بين الملفات.';
  }
  return '';
}

function buildCarriedValue(kindId = '', item = {}) {
  if (kindId === 'functions') {
    const returnMeaning = firstNonEmpty(
      typeof item.returns === 'object' ? item.returns?.meaning || item.returns?.trueMeaning || item.returns?.type : item.returns,
      item.returnValue,
      item.returnType
    );
    return returnMeaning
      ? `القيمة العملية لهذا الاستدعاء تظهر في ناتجه ${returnMeaning} وفي التغيير الذي يحدثه على المورد أو الحالة المرتبطة به.`
      : 'القيمة العملية لهذا الاستدعاء ليست نصاً أو تعريفاً فقط، بل الأثر الذي يحدثه على الحالة أو المورد المستهدف.';
  }
  if (kindId === 'structures') {
    return 'تحمل هذه البنية مجموعة حقول مترابطة تقرأها المكتبة كوحدة إعداد أو وصف أو حالة واحدة.';
  }
  if (kindId === 'variables' || kindId === 'types') {
    return 'يحمل هذا النوع القيمة الفعلية أو المقبض أو المؤشر الذي تمرره بقية الدوال والحقول في هذا المسار.';
  }
  if (kindId === 'enums') {
    return 'يحمل هذا التعداد اختياراً صريحاً بين مسارات أو حالات أو أوضاع معرّفة سلفاً.';
  }
  if (kindId === 'constants') {
    const raw = firstNonEmpty(item.value, item.syntax);
    return raw
      ? `القيمة الفعلية التي يحملها هذا الثابت هي ${raw}، لكن الاسم هو الذي يوضح معناها العملي داخل الكود.`
      : 'يحمل هذا الثابت قيمة جاهزة مرتبطة بمعنى سلوكي أو اصطلاحي محدد داخل الواجهة.';
  }
  if (kindId === 'macros') {
    const raw = firstNonEmpty(item.syntax, item.value);
    return raw
      ? `الماكرو يوسع إلى ${raw} أو إلى تعبير مشتق منه، والقيمة الحقيقية هنا هي المعنى الذي يضيفه هذا التوسع إلى الكود.`
      : 'الماكرو لا يحمل معنى شكلياً فقط، بل يحدد كيف سيتحول الكود أو أي قيمة سيتولد قبل الترجمة.';
  }
  if (kindId === 'directives') {
    return 'القيمة الحقيقية هنا أنها تغيّر ما يسمح به المترجم وما يراه الشيدر قبل أن يبدأ التنفيذ على العتاد.';
  }
  if (kindId === 'headers') {
    return 'تحمل هذه الترويسة التصريحات الرسمية التي تحتاجها الوحدات الأخرى، بدءاً من الأنواع والمقابض وحتى الامتدادات والمنصات، لذلك يعد تضمينها بوابة دخول لبقية العناصر.';
  }
  return 'يحمل هذا العنصر معنى تنفيذياً أو دلالياً يقرأه النظام أو اللغة عند استخدامه داخل السياق الصحيح.';
}

function buildActualMeaning(kindId = '', item = {}, libraryMeta = {}) {
  const directArabic = firstNonEmpty(item.realMeaning, item.officialArabicDescription, item.description);
  const translated = translateSimpleEnglishDescription(item.description || '');
  if (hasArabicText(directArabic)) {
    return directArabic.replace(/^الوصف الرسمي:\s*/i, '').trim();
  }
  if (translated) {
    return translated;
  }
  const label = buildArabicLabelFromName(item.name || '', kindId);
  if (kindId === 'functions') {
    return `تمثل هذه الدالة عملية ${label} داخل ${libraryMeta.displayNameArabic || libraryMeta.displayName || 'المكتبة'}، وتنفذ فعلاً عند استدعائها لا مجرد تعريف نظري.`;
  }
  if (kindId === 'structures') {
    return `تمثل هذه البنية ${label}، أي الحاوية التي تجمع الحقول التي ستقرأها المكتبة أو الواجهة كوحدة واحدة.`;
  }
  if (kindId === 'enums') {
    return `يمثل هذا التعداد ${label}، أي المجال الذي تختار منه القيم التي تحدد السلوك أو الحالة المرتبطة به.`;
  }
  if (kindId === 'constants') {
    return `يمثل هذا الثابت ${label}، أي قيمة رمزية ثابتة تحمل معنى فعلياً داخل الكود.`;
  }
  if (kindId === 'macros') {
    return `يمثل هذا الماكرو ${label}، أي توسعاً نصياً أو قيمة توليدية تؤثر في الكود قبل الترجمة.`;
  }
  if (kindId === 'variables' || kindId === 'types') {
    return `يمثل هذا النوع ${label}، أي القيمة أو المقبض أو المؤشر الذي تتعامل معه بقية الواجهة في هذا السياق.`;
  }
  if (kindId === 'headers') {
    return `يمثل هذا الملف ${label}، أي الترويسة التي تعلن عن الأنواع والدوال والامتدادات المرتبطة بهذا الجزء من ${libraryMeta.displayNameArabic || libraryMeta.displayName || 'المكتبة'}.`;
  }
  return `يمثل هذا العنصر ${label} داخل ${libraryMeta.displayNameArabic || libraryMeta.displayName || 'المكتبة'}.`;
}

function parseSimpleSignature(raw = '') {
  const clean = cleanText(raw);
  if (!clean) {
    return {raw: '', returnType: '', parameters: []};
  }

  const fnMatch = /^(.+?)\s+([A-Za-z_][A-Za-z0-9_:]*)\s*\(([\s\S]*)\)\s*;?$/m.exec(clean);
  if (!fnMatch) {
    return {raw: clean, returnType: '', parameters: []};
  }

  const params = fnMatch[3].trim() && fnMatch[3].trim() !== 'void'
    ? fnMatch[3].split(',').map((entry) => normalizeWhitespace(entry))
    : [];

  return {
    raw: clean,
    returnType: normalizeWhitespace(fnMatch[1]),
    parameters: params
  };
}

function buildEntitySkeleton(libraryId, kindId, itemName, item = {}) {
  const libraryMeta = LIBRARY_META[libraryId];
  const kindMeta = STANDARD_KIND_META[kindId] || STANDARD_KIND_META.misc;
  const slug = slugifyName(itemName);
  const label = chooseArabicLabel(itemName, kindId, [
    item.officialArabicDescription,
    item.realMeaning,
    item.description,
    Array.isArray(item.usage) ? item.usage[0] : '',
    item.usage
  ]);

  return {
    schemaVersion,
    library: libraryMeta,
    kind: kindMeta,
    identity: {
      name: itemName,
      slug,
      titleArabic: label,
      aliases: dedupeList(item.aliases || [])
    },
    route: {
      hash: buildReferenceHash(libraryId, kindId, slug),
      contentPath: buildEntityContentPath(libraryId, kindId, slug)
    },
    summary: {
      actualTranslationArabic: label,
      actualMeaningArabic: buildActualMeaning(kindId, item, libraryMeta),
      purposeArabic: buildPracticalPurpose(kindId, item),
      whyUseArabic: buildWhyUse(kindId, item),
      carriedValueArabic: buildCarriedValue(kindId, item),
      sourceDescription: cleanText(item.description || '')
    },
    signature: {
      raw: cleanText(item.signature || item.syntax || ''),
      header: cleanText(item.header || ''),
      headerUrl: cleanText(item.headerUrl || '')
    },
    details: {
      parameters: [],
      fields: [],
      values: [],
      usage: dedupeList(item.usage || []),
      notes: dedupeList(item.notes || []),
      remarks: dedupeList(item.remarks || []),
      instructions: dedupeList(item.instructions || []),
      lifecycle: dedupeList(item.lifecycle || []),
      returns: cleanText(item.returns || item.returnValue || ''),
      threadSafety: cleanText(item.threadSafety || ''),
      example: cleanText(item.example || item.parameterExample || item.usageExample?.code || '')
    },
    links: {
      officialUrl: cleanText(item.officialUrl || item.sourceUrl || ''),
      sourceUrl: cleanText(item.sourceUrl || ''),
      related: []
    },
    source: {
      dataset: '',
      category: cleanText(item.category || item.categoryTitle || item.sectionTitle || ''),
      packageKey: cleanText(item.packageKey || ''),
      packageName: cleanText(item.packageName || '')
    }
  };
}

function buildVulkanOfficialUrl(name = '') {
  const clean = String(name || '').trim();
  return clean ? `https://docs.vulkan.org/refpages/latest/refpages/source/${clean}.html` : '';
}

function isVulkanVariableLike(item = {}) {
  const name = String(item.name || '').trim();
  const description = cleanText(item.description || '');
  return /^PFN_/.test(name)
    || /^Vk[A-Za-z0-9_]*Flags(?:64)?$/.test(name)
    || /^VkBool32$/.test(name)
    || /^VkDevice(Address|Size)$/.test(name)
    || /^VkSampleMask$/.test(name)
    || /مقبض/.test(description)
    || /نوع عددي/.test(description)
    || /مؤشر دالة/.test(description);
}

function normalizeVulkanFunction(item) {
  const entity = buildEntitySkeleton('vulkan', 'functions', item.name, item);
  const signature = parseSimpleSignature(item.signature);
  entity.signature = {
    raw: item.signature || '',
    returnType: cleanText(item.returnType || signature.returnType),
    parameters: signature.parameters,
    header: '',
    headerUrl: ''
  };
  entity.details.parameters = mapParameters(item.parameters, item.name);
  entity.details.usage = dedupeList(item.usage || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = buildVulkanOfficialUrl(item.name);
  entity.source.dataset = 'data/vulkan_site_data.json';
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function normalizeVulkanTypeLike(item) {
  const kindId = isVulkanVariableLike(item) ? 'variables' : 'structures';
  const entity = buildEntitySkeleton('vulkan', kindId, item.name, item);
  entity.details.fields = mapMembers(item.members || []);
  entity.details.values = mapValues(item.values || [], item.name);
  entity.details.usage = dedupeList(item.usage || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = buildVulkanOfficialUrl(item.name);
  entity.source.dataset = 'data/vulkan_site_data.json';
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function normalizeVulkanEnum(item) {
  const entity = buildEntitySkeleton('vulkan', 'enums', item.name, item);
  entity.details.values = mapValues(item.values || [], item.name);
  entity.details.usage = dedupeList(item.usage || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = buildVulkanOfficialUrl(item.name);
  entity.source.dataset = 'data/vulkan_site_data.json';
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function normalizeVulkanConstant(item) {
  const entity = buildEntitySkeleton('vulkan', 'constants', item.name, item);
  entity.signature.raw = cleanText(item.syntax || item.name);
  entity.details.values = item.value ? [{
    name: item.name,
    value: cleanText(item.value),
    descriptionArabic: `هذه هي القيمة الخام التي يمثلها الثابت ${item.name}.`,
    originalDescription: ''
  }] : [];
  entity.details.usage = dedupeList(item.usage || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = buildVulkanOfficialUrl(item.name);
  entity.source.dataset = 'data/vulkan_site_data.json';
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function normalizeVulkanMacro(item) {
  const entity = buildEntitySkeleton('vulkan', 'macros', item.name, item);
  entity.signature.raw = cleanText(item.syntax || item.name);
  entity.details.parameters = mapParameters(item.parameters || [], item.name);
  entity.details.usage = dedupeList(item.usage || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = buildVulkanOfficialUrl(item.name);
  entity.source.dataset = 'data/vulkan_site_data.json';
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function getSdlLibraryId(packageKey = '') {
  switch (String(packageKey || '').trim()) {
    case 'audio':
      return 'sdl3-audio';
    case 'image':
      return 'sdl3-image';
    case 'mixer':
      return 'sdl3-mixer';
    case 'ttf':
      return 'sdl3-ttf';
    default:
      return 'sdl3-core';
  }
}

function normalizeSdlItem(item) {
  const kindMap = {
    function: 'functions',
    type: 'types',
    enum: 'enums',
    constant: 'constants',
    macro: 'macros'
  };
  const kindId = kindMap[item.kind] || 'misc';
  const libraryId = getSdlLibraryId(item.packageKey);
  const entity = buildEntitySkeleton(libraryId, kindId, item.name, item);
  const signature = parseSimpleSignature(item.syntax);
  entity.signature = {
    raw: cleanText(item.syntax || ''),
    returnType: signature.returnType,
    parameters: signature.parameters,
    header: cleanText(item.header || ''),
    headerUrl: cleanText(item.headerUrl || '')
  };
  entity.summary.actualMeaningArabic = buildActualMeaning(kindId, item, LIBRARY_META[libraryId]);
  entity.summary.actualTranslationArabic = chooseArabicLabel(item.name, kindId, [
    translateSimpleEnglishDescription(item.description || ''),
    item.description,
    buildArabicLabelFromName(item.name, kindId)
  ]);
  entity.identity.titleArabic = entity.summary.actualTranslationArabic;
  entity.details.parameters = mapParameters(item.parameters || [], item.name);
  entity.details.values = mapValues(item.values || [], item.name);
  entity.details.usage = dedupeList([
    ...((item.remarks || []).map((entry) => firstArabicOrTranslated(entry) || '')),
    firstArabicOrTranslated(item.version || '')
  ]);
  entity.details.remarks = dedupeList(item.remarks || []);
  entity.details.returns = hasArabicText(item.returns || '')
    ? cleanText(item.returns || '')
    : translateSimpleEnglishDescription(item.returns || '') || cleanText(item.returns || '');
  entity.details.threadSafety = hasArabicText(item.threadSafety || '')
    ? cleanText(item.threadSafety || '')
    : translateSimpleEnglishDescription(item.threadSafety || '') || cleanText(item.threadSafety || '');
  entity.summary.carriedValueArabic = buildCarriedValue(kindId, {
    ...item,
    returns: entity.details.returns,
    returnType: signature.returnType
  });
  entity.links.officialUrl = cleanText(item.officialUrl || '');
  entity.source.dataset = `data/ui/sdl3.json`;
  entity.links.related = dedupeList(item.seeAlso || []).map((name) => ({name}));
  return entity;
}

function normalizeImguiItem(item, sourcePath = 'data/ui/imgui/index.json') {
  const kindMap = {
    function: 'functions',
    type: 'types',
    enum: 'enums',
    constant: 'constants',
    macro: 'macros'
  };
  const kindId = kindMap[String(item.kind || '').toLowerCase()] || 'misc';
  const entity = buildEntitySkeleton('imgui', kindId, item.name, item);
  entity.summary.actualMeaningArabic = firstNonEmpty(item.realMeaning, item.officialArabicDescription, item.description);
  entity.summary.purposeArabic = firstNonEmpty(item.whenToUse, item.description);
  entity.summary.whyUseArabic = firstNonEmpty(item.practicalBenefit, item.misuseImpact);
  entity.summary.carriedValueArabic = buildCarriedValue(kindId, item);
  entity.summary.actualTranslationArabic = chooseArabicLabel(item.name, kindId, [
    item.officialArabicDescription,
    item.description,
    item.realMeaning
  ]);
  entity.identity.titleArabic = entity.summary.actualTranslationArabic;
  entity.details.parameters = (item.parameters || []).map((param) => ({
    name: param.name || '',
    type: param.type || '',
    descriptionArabic: firstNonEmpty(param.realRole, param.officialArabicDescription, param.actualUsage, param.whyPassed),
    originalDescription: ''
  }));
  entity.details.instructions = dedupeList(item.instructions || []);
  entity.details.notes = dedupeList(item.notes || []);
  entity.details.lifecycle = dedupeList(item.lifecycle || []);
  entity.details.returns = firstNonEmpty(item.returns?.meaning, item.returns?.trueMeaning);
  entity.details.example = cleanText(item.usageExample?.code || item.parameterExample || '');
  entity.signature = {
    raw: item.signature
      ? `${item.signature.returnType || 'void'} ${item.signature.name || item.name}(${(item.signature.params || []).map((param) => `${param.type || 'auto'} ${param.name || 'value'}`).join(', ')})`
      : '',
    returnType: cleanText(item.signature?.returnType || item.returns?.type || ''),
    parameters: (item.signature?.params || []).map((param) => `${param.type || 'auto'} ${param.name || 'value'}`),
    header: cleanText(item.header || ''),
    headerUrl: cleanText(item.sourceUrl || '')
  };
  entity.links.officialUrl = cleanText(item.sourceUrl || '');
  entity.links.related = dedupeList(item.related || []).map((name) => ({name}));
  entity.source.dataset = sourcePath;
  return entity;
}

function mapGlslSectionToKind(sectionKey = '') {
  switch (sectionKey) {
    case 'directives':
      return 'directives';
    case 'constants':
      return 'constants';
    case 'qualifiers':
      return 'qualifiers';
    case 'control_flow':
      return 'control-flow';
    case 'types':
      return 'types';
    case 'functions':
      return 'functions';
    case 'builtins':
      return 'builtins';
    case 'blocks':
      return 'blocks';
    default:
      return 'misc';
  }
}

function normalizeGlslItem(sectionKey, section, item, sourcePath = 'data/ui/glsl/index.json') {
  const kindId = mapGlslSectionToKind(sectionKey);
  const entity = buildEntitySkeleton('glslang', kindId, item.name, item);
  entity.summary.actualMeaningArabic = firstNonEmpty(item.description, item.effect, item.execution);
  entity.summary.purposeArabic = firstNonEmpty(item.usage, item.execution);
  entity.summary.whyUseArabic = firstNonEmpty(item.effect, item.vulkanBridge);
  entity.summary.carriedValueArabic = buildCarriedValue(kindId, item);
  entity.details.notes = dedupeList([
    cleanText(item.execution || ''),
    cleanText(item.effect || ''),
    cleanText(item.vulkanBridge || '')
  ]);
  entity.details.example = cleanText(item.example || '');
  entity.links.officialUrl = cleanText(item.sourceUrl || '');
  entity.source.dataset = sourcePath;
  entity.source.category = section.title || sectionKey;
  return entity;
}

function collectVulkanEntities() {
  const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'vulkan_site_data.json'), 'utf8'));
  const flatten = (obj) => Object.values(obj || {}).flatMap((group) => group.items || []);
  return [
    ...flatten(data.functions).map(normalizeVulkanFunction),
    ...flatten(data.structures).map(normalizeVulkanTypeLike),
    ...flatten(data.enums).map(normalizeVulkanEnum),
    ...flatten(data.constants).map(normalizeVulkanConstant),
    ...flatten(data.macros).map(normalizeVulkanMacro)
  ];
}

function collectSdlEntities() {
  const sdl3 = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'ui', 'sdl3.json'), 'utf8'));
  const entityData = sdl3?.sdl3EntityData || {};
  return [
    ...(entityData.functions || []).map(normalizeSdlItem),
    ...(entityData.types || []).map(normalizeSdlItem),
    ...(entityData.enums || []).map(normalizeSdlItem),
    ...(entityData.constants || []).map(normalizeSdlItem),
    ...(entityData.macros || []).map(normalizeSdlItem)
  ];
}

function collectImguiEntities() {
  const manifestPath = path.join(rootDir, 'data', 'ui', 'imgui', 'index.json');
  const manifest = readJson(manifestPath);
  const sections = manifest.sections || [];
  return sections.flatMap((section) => {
    const sectionPath = path.join(rootDir, section.path);
    const sectionData = readJson(sectionPath);
    const items = sectionData.items || [];
    return items.map((item) => normalizeImguiItem(item, section.path));
  });
}

function collectGlslEntities() {
  const manifestPath = path.join(rootDir, 'data', 'ui', 'glsl', 'index.json');
  const manifest = readJson(manifestPath);
  const referenceSections = manifest.reference?.sections || [];
  return referenceSections.flatMap((sectionMeta) => {
    const sectionPath = path.join(rootDir, sectionMeta.path);
    const sectionData = readJson(sectionPath);
    const sectionKey = sectionData.key || sectionMeta.key;
    return (sectionData.items || []).map((item) => normalizeGlslItem(sectionKey, sectionData, item, sectionMeta.path));
  });
}

function loadFileManifestByName(fileName) {
  const manifestPath = path.join(rootDir, 'pages', 'files', `${fileName}.manifest.json`);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  try {
    return readJson(manifestPath);
  } catch (error) {
    console.warn(`Failed to read file manifest for ${fileName}:`, error.message);
    return null;
  }
}

function collectHeaderEntities() {
  const filesJsonPath = path.join(rootDir, 'data', 'ui', 'files.json');
  if (!fs.existsSync(filesJsonPath)) {
    return [];
  }

  const filesData = readJson(filesJsonPath);
  const sections = filesData.vulkanFileSections || {};
  const overrides = filesData.fileReferenceOverrides || {};

  const entities = [];

  HEADER_SECTION_KEYS.forEach((sectionKey) => {
    const sectionMeta = sections[sectionKey];
    if (!sectionMeta) {
      return;
    }
    const sectionTitle = sectionMeta.title || sectionKey;
    const sectionPath = sectionMeta.path || 'vulkan';
    (sectionMeta.files || []).forEach((fileName) => {
      const manifest = loadFileManifestByName(`${fileName}`);
      const override = overrides[fileName] || {};
      const includePath = `${sectionPath}/${fileName}`.replace(/\/{2,}/g, '/');
      const description = override.description || inferHeaderDescription(fileName, sectionKey, sectionTitle);
      const usageText = override.usage || inferHeaderUsage(fileName, sectionKey);
      const includes = Array.isArray(override.includes) ? override.includes : inferHeaderIncludes(fileName, sectionKey);
      const keyItems = Array.isArray(override.keyItems) ? override.keyItems : inferHeaderKeyItems(fileName);
      const renderedExample = buildHeaderExampleSnippet(fileName, includePath, override.example);
      const detailNotes = [];
      if (manifest?.relativeSourcePath) {
        detailNotes.push(`المسار الداخلي: ${manifest.relativeSourcePath}`);
      } else {
        detailNotes.push(`المسار الداخلي: ${includePath}`);
      }
      if (manifest?.lineCount) {
        detailNotes.push(`عدد الأسطر التقريبي: ${manifest.lineCount}`);
      }

      const item = {
        description,
        usage: [usageText],
        notes: [],
        instructions: includes.map((header) => `ضمّن ${header} قبل ${fileName} لضمان توفر التعريفات أو الماكروز التي تعتمد عليها هذه الترويسة.`),
        example: renderedExample,
        realMeaning: description
      };

      const entity = buildEntitySkeleton('vulkan', 'headers', fileName, item);
      entity.signature = {
        raw: fileName.endsWith('.cppm') ? `import ${fileName.replace(/\.cppm$/i, '')};` : `#include <${includePath}>`,
        returnType: '',
        parameters: [],
        header: includePath,
        headerUrl: ''
      };
      entity.details.fields = includes.map((header) => ({
        name: header,
        type: 'header',
        descriptionArabic: `يعتمد ${fileName} على الترويسة ${header} لضبط التعريفات الأساسية قبل تضمينه.`,
        originalDescription: ''
      }));
      entity.details.values = keyItems.map((symbol) => ({
        name: symbol,
        value: '',
        descriptionArabic: `يتوفر ${symbol} بعد تضمين ${fileName} لأنه يعلن أو يعرّف داخل هذه الترويسة.`,
        originalDescription: ''
      }));
      entity.details.usage = [
        usageText,
        keyItems.length
          ? `تعرف هذه الترويسة عناصر أساسية مثل ${keyItems.slice(0, 4).join('، ')} حتى لا تضطر إلى إعادة التصريح عنها يدوياً.`
          : usageText
      ];
      entity.details.notes = [
        ...detailNotes,
        ...entity.details.notes,
        `تنتمي هذه الترويسة إلى مجموعة "${sectionTitle}".`
      ];
      entity.details.example = renderedExample;
      entity.links.related = keyItems;
      entity.links.officialUrl = buildHeaderSourceUrl(includePath);
      entity.source.dataset = 'data/ui/files.json';
      entity.source.category = sectionTitle;
      entity.source.packageKey = sectionKey;
      entity.source.packageName = sectionTitle;
      entities.push(entity);
    });
  });

  return entities;
}

function buildRegistry(entities) {
  const byNormalizedName = new Map();
  entities.forEach((entity) => {
    const keys = [entity.identity.name, ...(entity.identity.aliases || [])]
      .map((name) => normalizeWhitespace(String(name || '')).toLowerCase())
      .filter(Boolean);
    keys.forEach((key) => {
      const list = byNormalizedName.get(key) || [];
      list.push(entity);
      byNormalizedName.set(key, list);
    });
  });
  return {byNormalizedName};
}

function resolveRelatedEntries(related = [], currentEntity, registry) {
  return dedupeList((related || []).map((entry) => typeof entry === 'string' ? entry : entry?.name || ''))
    .map((name) => {
      const key = String(name || '').toLowerCase();
      const candidates = registry.byNormalizedName.get(key) || [];
      const preferred = candidates.find((candidate) => candidate.library.id === currentEntity.library.id)
        || candidates[0]
        || null;
      return preferred ? {
        name,
        route: preferred.route.hash,
        libraryId: preferred.library.id,
        kindId: preferred.kind.id
      } : {name, route: ''};
    });
}

function ensureUniqueSlugs(entities) {
  const seen = new Map();
  entities.forEach((entity) => {
    const key = `${entity.library.id}::${entity.kind.id}::${entity.identity.slug}`;
    const count = seen.get(key) || 0;
    if (count > 0) {
      entity.identity.slug = `${entity.identity.slug}-${count + 1}`;
      entity.route.hash = buildReferenceHash(entity.library.id, entity.kind.id, entity.identity.slug);
      entity.route.contentPath = buildEntityContentPath(entity.library.id, entity.kind.id, entity.identity.slug);
    }
    seen.set(key, count + 1);
  });
}

function buildGroupedEntries(entries) {
  const buckets = new Map();
  entries.forEach((entity) => {
    const letter = (entity.identity.name || entity.identity.slug || '#').charAt(0).toUpperCase();
    const bucket = buckets.get(letter) || [];
    bucket.push({
      name: entity.identity.name,
      slug: entity.identity.slug,
      titleArabic: entity.identity.titleArabic,
      shortDescription: entity.summary.actualMeaningArabic,
      route: entity.route.hash,
      officialUrl: entity.links.officialUrl
    });
    buckets.set(letter, bucket);
  });

  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'en'))
    .map(([letter, items]) => ({
      letter,
      items: items.sort((a, b) => a.name.localeCompare(b.name, 'en'))
    }));
}

function buildOutput(entities) {
  const existingManifest = fs.existsSync(manifestPath)
    ? readJson(manifestPath)
    : null;
  const manifest = {
    schemaVersion,
    generatedAt: new Date().toISOString(),
    root: 'content/reference',
    standardKinds: Object.values(STANDARD_KIND_META),
    libraries: []
  };

  const libraries = new Map();
  entities.forEach((entity) => {
    const libraryBucket = libraries.get(entity.library.id) || {
      library: entity.library,
      entries: [],
      kinds: new Map()
    };
    libraryBucket.entries.push(entity);
    const kindBucket = libraryBucket.kinds.get(entity.kind.id) || [];
    kindBucket.push(entity);
    libraryBucket.kinds.set(entity.kind.id, kindBucket);
    libraries.set(entity.library.id, libraryBucket);
  });

  for (const {library, entries, kinds} of [...libraries.values()].sort((a, b) => a.library.displayName.localeCompare(b.library.displayName, 'en'))) {
    const libraryIndex = {
      schemaVersion,
      generatedAt: manifest.generatedAt,
      library,
      totalCount: entries.length,
      routes: {
        hub: '#ref',
        library: buildReferenceHash(library.id)
      },
      kinds: []
    };

    for (const [kindId, kindEntries] of [...kinds.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
      const kindMeta = STANDARD_KIND_META[kindId] || STANDARD_KIND_META.misc;
      const kindIndex = {
        schemaVersion,
        generatedAt: manifest.generatedAt,
        library,
        kind: kindMeta,
        totalCount: kindEntries.length,
        routes: {
          hub: '#ref',
          library: buildReferenceHash(library.id),
          kind: buildReferenceHash(library.id, kindId)
        },
        groups: buildGroupedEntries(kindEntries)
      };

      writeJson(path.join(rootDir, buildKindIndexPath(library.id, kindId)), kindIndex);
      libraryIndex.kinds.push({
        ...kindMeta,
        count: kindEntries.length,
        path: buildKindIndexPath(library.id, kindId),
        route: buildReferenceHash(library.id, kindId)
      });
    }

    writeJson(path.join(rootDir, buildLibraryIndexPath(library.id)), libraryIndex);
    manifest.libraries.push({
      ...library,
      totalCount: entries.length,
      path: buildLibraryIndexPath(library.id),
      route: buildReferenceHash(library.id),
      kinds: libraryIndex.kinds
    });
  }

  const generatedLibraryIds = new Set(manifest.libraries.map((library) => library.id));
  (existingManifest?.libraries || []).forEach((library) => {
    if (!generatedLibraryIds.has(library?.id)) {
      manifest.libraries.push(library);
    }
  });

  fs.readdirSync(outputRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const libraryId = entry.name;
      if (generatedLibraryIds.has(libraryId)) {
        return;
      }
      const libraryIndexPath = path.join(outputRoot, libraryId, 'index.json');
      if (!fs.existsSync(libraryIndexPath)) {
        return;
      }
      try {
        const libraryIndex = readJson(libraryIndexPath);
        const library = libraryIndex?.library;
        if (!library?.id || generatedLibraryIds.has(library.id)) {
          return;
        }
        manifest.libraries.push({
          ...library,
          totalCount: Number(libraryIndex?.totalCount) || 0,
          path: buildLibraryIndexPath(library.id),
          route: buildReferenceHash(library.id),
          kinds: Array.isArray(libraryIndex?.kinds) ? libraryIndex.kinds : []
        });
        generatedLibraryIds.add(library.id);
      } catch (error) {
        console.warn(`Failed to preserve reference manifest entry for ${libraryId}:`, error.message);
      }
    });

  manifest.libraries.sort((a, b) => String(a?.displayName || a?.id || '').localeCompare(String(b?.displayName || b?.id || ''), 'en'));

  writeJson(manifestPath, manifest);
}

function writeEntities(entities) {
  entities.forEach((entity) => {
    writeJson(path.join(rootDir, entity.route.contentPath), entity);
  });
}

function main() {
  ensureDir(outputRoot);

  const entities = [
    ...collectVulkanEntities(),
    ...collectSdlEntities(),
    ...collectImguiEntities(),
    ...collectGlslEntities(),
    ...collectHeaderEntities()
  ];

  ensureUniqueSlugs(entities);
  const registry = buildRegistry(entities);
  entities.forEach((entity) => {
    entity.links.related = resolveRelatedEntries(entity.links.related, entity, registry);
  });

  writeEntities(entities);
  buildOutput(entities);
  execFileSync(process.execPath, [path.join(__dirname, 'build-cmake-reference.js')], {
    cwd: rootDir,
    stdio: 'inherit'
  });

  console.log(JSON.stringify({
    outputRoot: path.relative(rootDir, outputRoot),
    manifest: path.relative(rootDir, manifestPath),
    counts: entities.reduce((acc, entity) => {
      const libraryId = entity.library.id;
      acc[libraryId] = (acc[libraryId] || 0) + 1;
      return acc;
    }, {})
  }, null, 2));
}

main();
