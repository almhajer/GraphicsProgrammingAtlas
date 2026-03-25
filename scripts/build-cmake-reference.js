#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const libraryId = 'cmake';
const schemaVersion = '2026-03-reference-architecture-1';
const sourceRoot = path.join(rootDir, 'data', 'ui', 'cmake');
const outputRoot = path.join(rootDir, 'content', 'reference', libraryId);
const manifestPath = path.join(rootDir, 'content', 'reference', 'manifest.json');
const officialLinksOutputPath = path.join(outputRoot, 'official-links.json');
const searchOutputPath = path.join(rootDir, 'data', 'ui', 'cmake-search.json');

const LIBRARY_META = {
  id: 'cmake',
  displayName: 'CMake',
  displayNameArabic: 'CMake',
  description: 'مرجع عربي عملي لأوامر CMake ومتغيراته وخصائصه ووحداته وسياساته ومسار العمل من التهيئة إلى التوليد ثم البناء.'
};

const KIND_META = Object.freeze({
  commands: {
    id: 'commands',
    displayName: 'Commands',
    displayNameArabic: 'الأوامر',
    description: 'تعليمات CMake التنفيذية التي تبني الرسم البياني للبناء أو تعدل خصائص الأهداف والمتغيرات.',
    iconType: 'command'
  },
  variables: {
    id: 'variables',
    displayName: 'Variables',
    displayNameArabic: 'المتغيرات',
    description: 'متغيرات عادية أو Cache أو مدمجة تحدد المسارات والخيارات والقيم التي تقرأها مرحلة configure أو generate.',
    iconType: 'variable'
  },
  properties: {
    id: 'properties',
    displayName: 'Properties',
    displayNameArabic: 'الخصائص',
    description: 'خصائص ترتبط عادةً بـ target أو directory أو source file وتغيّر سلوك البناء العملي.',
    iconType: 'constant'
  },
  modules: {
    id: 'modules',
    displayName: 'Modules',
    displayNameArabic: 'الوحدات',
    description: 'وحدات CMake جاهزة تضيف أدوات أو منطقاً مسانداً مثل الاختبارات أو التثبيت أو البحث عن الحزم.',
    iconType: 'file'
  },
  policies: {
    id: 'policies',
    displayName: 'Policies',
    displayNameArabic: 'السياسات',
    description: 'قواعد توافق تحدد هل يستخدم CMake السلوك القديم أو السلوك الحديث لمسار محدد.',
    iconType: 'enum'
  },
  expressions: {
    id: 'expressions',
    displayName: 'Expressions',
    displayNameArabic: 'التعبيرات',
    description: 'تعبيرات تتأخر قراءتها إلى سياقات محددة مثل توليد خصائص target أو أوامر التثبيت والاختبار.',
    iconType: 'macro'
  },
  presets: {
    id: 'presets',
    displayName: 'Presets',
    displayNameArabic: 'الضبطات المسبقة',
    description: 'ملفات JSON تعلن إعدادات configure وbuild وtest القابلة لإعادة الاستخدام بين المطورين والأدوات.',
    iconType: 'file'
  },
  concepts: {
    id: 'concepts',
    displayName: 'Concepts',
    displayNameArabic: 'المفاهيم',
    description: 'مفاهيم تشغيلية تشرح كيف يفكر CMake في التهيئة والتوليد والبناء، وفي الأهداف ونطاقات الأدلة والمتغيرات المخزنة.',
    iconType: 'tutorial'
  },
  examples: {
    id: 'examples',
    displayName: 'Examples',
    displayNameArabic: 'الأمثلة',
    description: 'أمثلة صغيرة تربط أوامر CMake الأساسية بمسار عملي كامل داخل CMakeLists.txt وملفات البناء المرافقة.',
    iconType: 'tutorial'
  }
});

const KIND_ORDER = [
  'commands',
  'variables',
  'properties',
  'modules',
  'policies',
  'expressions',
  'presets',
  'concepts',
  'examples'
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function slugifyName(name = '') {
  const normalized = String(name || '')
    .normalize('NFKD')
    .replace(/[$]/g, ' dollar ')
    .replace(/[#]/g, ' sharp ')
    .replace(/[+]/g, ' plus ')
    .replace(/::/g, ' ')
    .replace(/[^A-Za-z0-9\u0600-\u06FF]+/g, ' ')
    .trim()
    .toLowerCase();

  const words = normalized.split(/\s+/).filter(Boolean);
  return words.join('-') || 'item';
}

function buildReferenceHash(kindId = '', slug = '') {
  const parts = ['ref', libraryId];
  if (kindId) {
    parts.push(encodeURIComponent(kindId));
  }
  if (slug) {
    parts.push(encodeURIComponent(slug));
  }
  return `#${parts.join('/')}`;
}

const CMAKE_SIGNATURE_PLACEHOLDER_HELP = Object.freeze({
  input: 'يمثل الملف أو القالب الذي يقرأه الأمر من شجرة المصدر أو من المسار الذي تحدده.',
  output: 'يمثل الملف الناتج أو المسار الذي سيكتبه الأمر داخل شجرة البناء أو التثبيت بحسب السياق.',
  dir: 'يمثل مجلدًا يكتبه المبرمج ليحدد أين تُنسخ الملفات أو من أين تُقرأ أو أي مسار يعمل عليه الأمر.',
  name: 'يمثل اسمًا يختاره المبرمج لهذا الهدف أو الاختبار أو الرسالة أو الكيان الذي يبنيه الأمر.',
  'project-name': 'يمثل الاسم الرسمي للمشروع كما سيظهر في متغيرات PROJECT_* ورسائل البناء والتصدير.',
  target: 'يمثل اسم هدف موجود داخل الرسم البنائي ليُطبَّق عليه الأمر أو تُقرأ خصائصه.',
  targets: 'يمثل قائمة أهداف موجودة يطبّق عليها الأمر نفسه أو يثبت نواتجها.',
  item: 'يمثل عنصرًا واحدًا يمرره المبرمج إلى الأمر مثل target أو مكتبة أو مسار أو خيار مرتبط بالسياق.',
  sources: 'يمثل قائمة ملفات المصدر أو الملفات المرتبطة بالهدف التي ستدخل في البناء.',
  source: 'يمثل ملف مصدر أو مسار مصدر مفرد يستخدمه الأمر في البناء أو التوليد.',
  packageName: 'يمثل اسم الحزمة التي تبحث عنها CMake أو تصدر لها ملفات التهيئة.',
  packagename: 'يمثل اسم الحزمة التي يكتبها المستخدم فعليًا مثل ZLIB أو SDL3 أو fmt داخل هذا الموضع.',
  components: 'يمثل قائمة المكونات الفرعية التي يطلبها المبرمج من الحزمة أو من خطوة التثبيت.',
  component: 'يمثل اسم مكوّن تثبيت أو مكوّن حزمة واحد.',
  variable: 'يمثل اسم متغير يكتبه المبرمج أو يقرأه الأمر داخل مرحلة التهيئة.',
  value: 'يمثل القيمة التي ستُسند إلى متغير أو خاصية أو خيار في هذا الموضع من الصياغة.',
  'file-module': 'يمثل اسم ملف CMake أو اسم module يكتبه المستخدم فعليًا ليقرأه include() من المسار الحالي أو من مسارات الوحدات المعروفة.',
  'private-public-interface': 'يمثل واحدة من كلمات النطاق المعروفة مثل PRIVATE أو PUBLIC أو INTERFACE، ويختار منها المستخدم ما يطابق طريقة نشر الإعداد.',
  depends: 'يمثل ملفات أو نواتج أو أهدافًا يعتمد عليها الأمر قبل التنفيذ.',
  style: 'يمثل القيمة الفعلية التي يكتبها المستخدم لاختيار شكل نهايات الأسطر مثل LF أو CRLF.',
  prop1: 'يمثل اسم خاصية رسمية من خصائص CMake تريد كتابتها على الهدف أو الكيان المعني.',
  value1: 'يمثل القيمة المقابلة للخاصية السابقة مباشرة، ولذلك يجب أن تطابق نوع هذه الخاصية ومعناها.',
  language: 'يمثل اسم لغة مثل C أو CXX حتى يعرف CMake أي أدوات وفحوص ومترجمات يجب تهيئتها.',
  version: 'يمثل إصدارًا أو رقم توافق يمرره المبرمج إلى الأمر للتحقق أو التصدير أو المقارنة.',
  min: 'يمثل الحد الأدنى من الإصدار أو القيمة المقبولة في هذا الموضع.',
  policy_max: 'يمثل الحد الأعلى لنطاق السياسات الذي تريد تثبيته مع الحد الأدنى للإصدار.',
  targets1: 'يمثل أول هدف في قائمة أهداف متكررة تسمح الصياغة بتمرير أكثر من واحد منها.',
  target1: 'يمثل أول هدف في قائمة أهداف متكررة تسمح الصياغة بتمرير أكثر من واحد منها.',
  components1: 'يمثل أول عنصر في قائمة مكونات متكررة.',
  arg: 'يمثل وسيطًا مفردًا يمرره المبرمج للأمر أو للاختبار أو للأمر الخارجي.',
  args: 'يمثل مجموعة وسائط يمررها المبرمج كما هي إلى أمر خارجي أو إلى خطوة لاحقة.',
  command: 'يمثل الأمر الخارجي أو الاستدعاء الذي سينفذه CMake في هذا الموضع.',
  runtime: 'يمثل موقعًا أو نوعًا يخص ملفات التنفيذ الناتجة مثل الملفات التنفيذية المشتركة أو الثنائية.',
  archive: 'يمثل موقعًا أو نوعًا يخص ملفات الأرشيف أو المكتبات الثابتة الناتجة.',
  library: 'يمثل موقعًا أو نوعًا يخص ملفات المكتبات المشتركة الناتجة.',
  destination: 'يمثل مجلد الوجهة الذي ستوضع فيه الملفات أو النواتج أثناء التثبيت أو النسخ.',
  major: 'يمثل رقم الإصدار الرئيسي.',
  minor: 'يمثل رقم الإصدار الفرعي.',
  patch: 'يمثل رقم الإصلاح أو الرقعة.',
  tweak: 'يمثل الرقم التفصيلي الأخير في الإصدار إذا استخدمته.'
});

const CMAKE_SIGNATURE_ARGUMENT_HELP = Object.freeze({
  version: 'يمثل رقم إصدار أو حد توافق يكتبه المستخدم فعليًا مثل 3.26 أو 1.2.0، وليس كلمة مفتاحية ثابتة من كلمات CMake.',
  value: 'يمثل قيمة فعلية يكتبها المستخدم في هذا الموضع مثل ON أو OFF أو 20 أو مسار أو اسم بحسب سياق الأمر الحالي.'
});

const CMAKE_SIGNATURE_KEYWORD_HELP = Object.freeze({
  APPEND: 'أمر فرعي يعني أن list() لن يستبدل القائمة الحالية، بل سيلحق العناصر التالية في آخرها لتظهر في أي foreach() أو شرط أو target يقرأ المتغير بعد ذلك.',
  IN: 'كلمة مفتاحية داخل foreach() تغيّر قراءة العناصر التالية: فهي لا تعني قيمة مستقلة، بل تعلن أن الحلقة ستفسر ما يليها وفق صيغة مصدر عناصر محددة.',
  LISTS: 'كلمة مفتاحية داخل foreach() تعني أن الأسماء التالية هي أسماء متغيرات تحمل قوائم، وسيقرأ CMake عناصرها الفعلية ثم يكرر الجسم عليها أثناء configure.',
  VERSION: 'كلمة مفتاحية تعلن أن القيم التالية تمثل رقم إصدار أو حد توافق. وجودها يغير السلوك العملي لأن CMake سيملأ متغيرات إصدار أو يفرض حدًا أدنى أو يكتب metadata إصدار بحسب الأمر الذي يحملها.',
  FATAL_ERROR: 'خيار يجعل الخطأ قاتلًا: ليس مجرد وسم شكلي، بل يعني أن CMake سيوقف التهيئة فورًا بدل متابعة configure مع تحذير أو رسالة عادية.',
  LANGUAGES: 'كلمة مفتاحية تعلن اللغات التي يجب أن يجهز CMake مترجماتها وفحوصها. أثرها العملي أنها تحدد أي toolchains وفحوص لغة ستدخل مرحلة configure أصلًا.',
  EXCLUDE_FROM_ALL: 'خيار يمنع الهدف أو المجلد من الدخول في البناء الافتراضي الشامل إلا إذا طلبته صراحة.',
  SYSTEM: 'خيار يعلّم بعض المسارات أو الترويسات على أنها نظامية بحيث يعاملها المصرّف أو CMake بطريقة أقل إزعاجًا للتحذيرات.',
  PROPERTIES: 'كلمة مفتاحية تعلن أن الأزواج التالية هي أسماء خصائص وقيمها وستكتب مباشرة على الكيان المستهدف.',
  COMMAND: 'كلمة مفتاحية تبدأ أمرًا أو استدعاءً خارجيًا سيدخل في مسار التوليد أو البناء أو الاختبار.',
  DEPENDS: 'كلمة مفتاحية تعلن الملفات أو الأهداف أو النواتج التي يجب أن يعتمد عليها هذا السطر قبل تنفيذه.',
  ARGS: 'كلمة مفتاحية قديمة أو مساعدة تشير إلى أن العناصر التالية هي وسائط تمرر إلى الأمر الخارجي.',
  OUTPUT: 'كلمة مفتاحية تعلن الملفات التي سيولدها هذا الأمر فعليًا حتى يدخلها CMake في الرسم البنائي.',
  NAME: 'كلمة مفتاحية تضبط الاسم المنطقي أو الظاهر للكيان الذي يعلنه الأمر الحالي.',
  TARGETS: 'كلمة مفتاحية تعلن أن العناصر التالية هي أسماء أهداف CMake لا ملفات خام.',
  RUNTIME: 'كلمة مفتاحية تختص بمسار أو تصنيف الملفات التنفيذية الناتجة عند التثبيت.',
  ARCHIVE: 'كلمة مفتاحية تختص بمسار أو تصنيف ملفات الأرشيف مثل المكتبات الثابتة.',
  LIBRARY: 'كلمة مفتاحية تختص بمسار أو تصنيف ملفات المكتبات المشتركة.',
  DESTINATION: 'كلمة مفتاحية تعلن المجلد النهائي الذي ستنسخ إليه الملفات أو النواتج.',
  COMPONENTS: 'كلمة مفتاحية تعلن أن العناصر التالية تمثل مكونات فرعية. أثرها العملي أنها تقيد النتيجة بالمكونات المطلوبة فقط بدل تحميل الحزمة كلها أو اعتبار أي جزء منها كافيًا.',
  REQUIRED: 'خيار يعني أن العنصر الحالي ليس اختياريًا. أثره العملي أن غيابه يفشل configure بدل ترك النتيجة في حالة جزئية أو قابلة للتجاوز.',
  REQUIRED_VARS: 'كلمة مفتاحية تعلن أن المتغيرات التالية هي معيار النجاح الحقيقي لوحدة البحث. وجودها لا يجمّل الصياغة فقط، بل يحدد هل ستعلن الوحدة الحزمة FOUND أم ستفشل.',
  STATIC: 'خيار يطلب مكتبة ثابتة أو سلوكًا ثابتًا في هذا الموضع بدل المشاركة الديناميكية.',
  SHARED: 'خيار يطلب مكتبة مشتركة/ديناميكية قابلة للربط وقت التشغيل.',
  MODULE: 'خيار يطلب مكتبة وحدات خاصة بالتحميل أو المكوّنات غير المربوطة كاعتمادية عادية.',
  OBJECT: 'خيار يطلب هدف object library ينتج ملفات object فقط دون ملف مكتبة نهائي مستقل.',
  INTERFACE: 'خيار يعلن هدفًا واجهيًا أو نطاقًا ينشر متطلبات الاستعمال دون نواتج ترجمة عادية.',
  PUBLIC: 'نطاق يعني أن الإعداد يخص الهدف الحالي وينتقل أيضًا إلى من يستهلكه لاحقًا.',
  PRIVATE: 'نطاق يعني أن الإعداد يخص الهدف الحالي فقط ولا يورَّث إلى المستهلكين.',
  BEFORE: 'خيار يطلب إدراج الإعداد أو المسار قبل القيم السابقة بدل إضافته في النهاية.',
  COPYONLY: 'خيار يجعل configure_file ينسخ الملف كما هو دون استبدال المتغيرات داخله.',
  '@ONLY': 'خيار يجعل الاستبدال يقتصر على صيغة ‎@VAR@‎ دون صيغة ‎${VAR}‎ داخل الملف.',
  NEWLINE_STYLE: 'كلمة مفتاحية تعلن أن القيمة التالية تختار شكل نهايات الأسطر في الملف الناتج.',
  CACHE: 'كلمة مفتاحية تعلن أن القيمة ستكتب في cache حتى تبقى مرئية وقابلة للتعديل بين تشغيلات configure.',
  PATH: 'تحدد أن نوع قيمة الـ cache هنا هو مسار ملفات أو مجلدات لا نصًا عاديًا عامًا.',
  STATUS: 'كلمة مفتاحية تطلب رسالة حالة معلوماتية أثناء configure. أثرها العملي أنها تطبع تشخيصًا مرئيًا للمطور من دون تحويل المسار إلى فشل أو تحذير قاتل.',
  EXPORT: 'كلمة مفتاحية تربط التثبيت أو التوليد بمجموعة تصدير تعاد قراءتها من مشاريع أخرى.',
  ON: 'قيمة منطقية تعني التفعيل داخل اصطلاح CMake. أثرها العملي أن الشرط أو الخيار أو الخاصية المقروءة بعدها ستتعامل مع الحالة على أنها مفعلة فعلاً.',
  OFF: 'قيمة منطقية تعني التعطيل داخل اصطلاح CMake. أثرها العملي أن الشرط أو الخيار أو الخاصية المقروءة بعدها ستتعامل مع الحالة على أنها متوقفة أو غير مطلوبة.',
  COMPATIBILITY: 'كلمة مفتاحية تعلن مستوى التوافق الذي ستستخدمه ملفات الحزمة أو الإصدار عند المقارنة.',
  CXX: 'قيمة لغة تعني C++ داخل project() أو enable_language() وما يشبههما. أثرها العملي أن CMake سيجهز مترجم C++ وفحوصه ومتغيراته وخصائصه الافتراضية.',
  if: 'بداية شرط CMake يقرر هل ستفسر الأوامر التالية أم ستتجاوزها.',
  endif: 'نهاية كتلة الشرط المفتوحة عبر if أو if-like command.'
});

const CMAKE_SIGNATURE_VARIABLE_HELP = Object.freeze({
  CMAKE_CURRENT_SOURCE_DIR: {
    type: 'متغير مدمج',
    description: 'هذا متغير مدمج يشير إلى مجلد المصدر الحالي للدليل الجاري معالجته. عندما تراه داخل ${...} فهو يُقيَّم أثناء configure في scope الدليل الحالي لا كقيمة ثابتة عامة للمشروع كله.'
  },
  CMAKE_CURRENT_BINARY_DIR: {
    type: 'متغير مدمج',
    description: 'هذا متغير مدمج يشير إلى مجلد البناء الحالي المقابل للدليل الجاري. يفيد لتوجيه الملفات المولدة إلى build tree الصحيح أثناء configure.'
  },
  PROJECT_SOURCE_DIR: {
    type: 'متغير مدمج',
    description: 'هذا متغير مدمج يشير إلى جذر المشروع المنطقي المرتبط بآخر project() فعّال، لذلك يختلف عن CMAKE_CURRENT_SOURCE_DIR عندما تكون داخل subdirectory.'
  },
  PROJECT_BINARY_DIR: {
    type: 'متغير مدمج',
    description: 'هذا متغير مدمج يشير إلى مجلد البناء المنطقي للمشروع الحالي كما عرّفه project().'
  },
  CMAKE_CXX_STANDARD: {
    type: 'متغير CMake عام',
    description: 'هذا متغير CMake عام يضبط القيمة الافتراضية للخاصية CXX_STANDARD على أهداف C++ الجديدة. أثره الحقيقي يظهر عند إنشاء targets لاحقة، لا بمجرد كتابة الاسم وحده.'
  },
  'CMAKE_<LANG>_STANDARD': {
    type: 'نمط متغير CMake',
    description: 'هذا اسم نمطي لعائلة متغيرات مثل CMAKE_C_STANDARD وCMAKE_CXX_STANDARD. الجزء <LANG> placeholder يمثل اللغة الفعلية، وبعد استبداله يصبح المتغير مسؤولًا عن default معيار تلك اللغة للأهداف الجديدة.'
  },
  CXX_STANDARD: {
    type: 'خاصية target',
    description: 'هذا اسم خاصية target لا توسعة متغير. تضبط معيار C++ لهدف بعينه، بينما CMAKE_CXX_STANDARD يضع فقط القيمة الافتراضية للأهداف التي ستنشأ لاحقًا.'
  }
});

const CMAKE_SIGNATURE_ENVIRONMENT_HELP = Object.freeze({
  HOME: 'هذا مرجع إلى متغير البيئة HOME من النظام الحالي. يقرأه CMake أثناء configure، وإذا خزنت الناتج في cache أو متغير عادي فالمخزن هو القيمة النصية الحالية لا رابطًا حيًا إلى البيئة.'
});

function normalizeCmakePlaceholderKey(token = '') {
  return String(token || '')
    .replace(/^<|>\.\.\.$|>$/g, '')
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\.\.\.$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]+/g, '');
}

function uniqueRowsByName(rows = []) {
  const seen = new Set();
  return rows.filter((row) => {
    const name = String(row?.name || '').trim();
    if (!name || seen.has(name)) {
      return false;
    }
    seen.add(name);
    return true;
  });
}

function buildCmakePlaceholderDescription(token = '', entry = {}, optional = false) {
  const normalizedKey = normalizeCmakePlaceholderKey(token);
  const generic = CMAKE_SIGNATURE_PLACEHOLDER_HELP[normalizedKey]
    || CMAKE_SIGNATURE_PLACEHOLDER_HELP[normalizedKey.toLowerCase()]
    || 'يمثل قيمة يكتبها المبرمج في هذا الموضع من الصياغة، وليست كلمة ثابتة من كلمات CMake نفسها.';
  const optionalNote = optional
    ? 'وجوده هنا اختياري لأنه يقع داخل جزء محاط بأقواس مربعة في التوقيع.'
    : 'وجوده هنا جزء مطلوب من الشكل الأساسي للاستدعاء ما لم توضّح الصفحة غير ذلك.';

  return `${generic} ${optionalNote}`;
}

function buildCmakeKeywordDescription(token = '', entry = {}, optional = false) {
  const base = CMAKE_SIGNATURE_KEYWORD_HELP[token]
    || CMAKE_SIGNATURE_KEYWORD_HELP[token.toUpperCase()]
    || `هذه كلمة مفتاحية داخل صياغة ${entry.name || 'أمر CMake'} تغيّر كيف يفسر CMake العناصر التالية في هذا الموضع.`;
  const optionalNote = optional
    ? 'هذا الجزء اختياري، لذلك يمرره المبرمج فقط عندما يحتاج السلوك الذي تفعّله هذه الكلمة.'
    : 'وجود هذه الكلمة هنا جزء مباشر من الصياغة التي يتوقعها CMake في هذا الموضع.';

  return `${base} ${optionalNote}`;
}

function buildCmakeArgumentDescription(token = '', entry = {}, optional = false) {
  const key = String(token || '').trim();
  const base = CMAKE_SIGNATURE_ARGUMENT_HELP[key]
    || `يمثل قيمة فعلية يكتبها المستخدم في هذا الموضع داخل صياغة ${entry.name || 'أمر CMake'}، وليس كلمة ثابتة يقرأها CMake حرفيًا.`;
  const optionalNote = optional
    ? 'وجود هذا الوسيط اختياري، لذلك تكتبه فقط عندما تحتاج السلوك أو التحديد الإضافي الذي يفعّله.'
    : 'هذا الوسيط جزء مطلوب من الاستدعاء، لذلك يجب على المستخدم كتابة قيمة حقيقية هنا بدل الاسم النمطي.';

  return `${base} ${optionalNote}`;
}

function buildCmakeOptionalGroupDescription(token = '', entry = {}) {
  const raw = String(token || '').trim();
  const inner = raw.replace(/^\[|\]$/g, '').trim();

  if (/^NEWLINE_STYLE\b/i.test(inner)) {
    return 'هذه مجموعة اختيارية تغيّر سلوك configure_file(). إذا كتبتها فابدأ بالكلمة NEWLINE_STYLE ثم اكتب القيمة الفعلية لشكل نهايات الأسطر مثل LF أو CRLF. حذف المجموعة يعني ترك شكل الأسطر للسلوك الافتراضي.';
  }

  if (/^COMPONENTS\b/i.test(inner)) {
    return 'هذه مجموعة اختيارية في find_package(). إذا كتبتها فابدأ بالكلمة COMPONENTS ثم اكتب أسماء المكونات التي تريدها فعليًا مثل Widgets أو Tools. وجودها يقيّد الاكتشاف بالمكوّنات المطلوبة بدل الحزمة كلها.';
  }

  if (/^RUNTIME\|LIBRARY\|ARCHIVE\b/i.test(inner) && /\bDESTINATION\b/i.test(inner)) {
    return 'هذه مجموعة اختيارية في install(TARGETS ...). يختار المستخدم أولًا نوع النواتج الذي يتحدث عنه مثل RUNTIME أو LIBRARY أو ARCHIVE، ثم يكتب DESTINATION ثم المجلد الفعلي الذي ستذهب إليه هذه النواتج.';
  }

  return `هذه مجموعة اختيارية داخل صياغة ${entry.name || 'أمر CMake'}. الأقواس المربعة تعني أنك تستطيع حذف المجموعة كلها، وإذا استخدمتها فعليك كتابة عناصرها الفعلية بالترتيب الظاهر داخلها لا باعتبارها نصًا توضيحيًا فقط.`;
}

function buildCmakeVariableDescription(token = '') {
  const name = String(token || '').trim();
  if (!name) {
    return 'هذا رمز متغير أو خاصية داخل CMake.';
  }
  return CMAKE_SIGNATURE_VARIABLE_HELP[name]?.description
    || `هذا اسم متغير أو خاصية داخل CMake، ويجب فهمه من السياق الذي يُقرأ فيه داخل configure أو generate.`;
}

function buildCmakeEnvironmentDescription(token = '') {
  const name = String(token || '').trim();
  if (!name) {
    return 'هذه الصيغة تقرأ متغيرًا من بيئة النظام الحالية أثناء configure.';
  }
  return CMAKE_SIGNATURE_ENVIRONMENT_HELP[name]
    || `هذه الصيغة تقرأ متغير البيئة ${name} من العملية التي شغلت CMake أثناء configure.`;
}

function buildCmakeSignatureTokenEntry(token = '', entry = {}, options = {}) {
  const rawToken = String(token || '').trim();
  if (!rawToken || rawToken === '...') {
    return null;
  }

  const optional = Boolean(options.optional);

  if (/^\[[^\[\]]+\]$/.test(rawToken)) {
    return {
      name: rawToken,
      type: 'مجموعة اختيارية في الصياغة',
      semanticKind: 'group',
      descriptionArabic: buildCmakeOptionalGroupDescription(rawToken, entry)
    };
  }

  if (/^<[^>]+>(?:\.\.\.)?$/.test(rawToken)) {
    return {
      name: rawToken.replace(/\.\.\.$/, ''),
      type: optional ? 'argument اختياري يكتبه المستخدم' : 'argument إلزامي يكتبه المستخدم',
      semanticKind: 'placeholder',
      descriptionArabic: buildCmakePlaceholderDescription(rawToken, entry, optional)
    };
  }

  if (/^"(?:\\.|[^"\\])*"$/.test(rawToken) || /^'(?:\\.|[^'\\])*'$/.test(rawToken)) {
    return {
      name: rawToken,
      type: optional ? 'argument اختياري يكتبه المستخدم' : 'argument إلزامي يكتبه المستخدم',
      semanticKind: 'argument',
      descriptionArabic: /help text/i.test(rawToken)
        ? 'هذا نص وصفي يكتبه المستخدم فعليًا ليشرح الخيار في cache أو الواجهة المرتبطة به، وليس كلمة مفتاحية تقرؤها CMake كسلوك مستقل.'
        : buildCmakeArgumentDescription(rawToken, entry, optional)
    };
  }

  if (CMAKE_SIGNATURE_VARIABLE_HELP[rawToken]) {
    return {
      name: rawToken,
      type: CMAKE_SIGNATURE_VARIABLE_HELP[rawToken].type,
      semanticKind: rawToken === 'CXX_STANDARD' ? 'property' : 'variable',
      descriptionArabic: buildCmakeVariableDescription(rawToken)
    };
  }

  if (/^\$ENV\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(rawToken)) {
    return {
      name: rawToken,
      type: 'قراءة من متغير بيئة',
      semanticKind: 'environment',
      descriptionArabic: buildCmakeEnvironmentDescription(rawToken.slice(5, -1))
    };
  }

  if (/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(rawToken)) {
    const variableName = rawToken.slice(2, -1);
    return {
      name: rawToken,
      type: 'توسعة متغير CMake',
      semanticKind: 'variable',
      descriptionArabic: `${buildCmakeVariableDescription(variableName)} هذه الصيغة نفسها تعني أن CMake سيستبدل الاسم بقيمته الحالية في هذا الموضع أثناء configure.`
    };
  }

  if (/^\$<.+>$/.test(rawToken)) {
    return {
      name: rawToken,
      type: 'Generator Expression',
      semanticKind: 'expression',
      descriptionArabic: 'هذه صيغة Generator Expression، أي أنها لا تُحسم فور قراءة الملف بل تُقيَّم في سياق لاحق مثل توليد الخصائص أو أوامر التثبيت أو الإعدادات المرتبطة بالهدف.'
    };
  }

  if (/^-D[A-Za-z_][A-Za-z0-9_]*$/.test(rawToken)) {
    return {
      name: rawToken,
      type: 'تعريف Cache من سطر الأوامر',
      semanticKind: 'flag',
      descriptionArabic: `هذا خيار سطر أوامر يعرّف قيمة cache للمتغير ${rawToken.slice(2)} قبل بدء configure.`
    };
  }

  if (/^-W[A-Za-z0-9_+-]+$/.test(rawToken)) {
    return {
      name: rawToken,
      type: 'خيار ترجمة',
      semanticKind: 'flag',
      descriptionArabic: 'هذا علم ترجمة يمرَّر عادة إلى المصرّف عبر target_compile_options أو متغيرات مكافئة لضبط مستوى التحذيرات أو السلوك.'
    };
  }

  if (/^[a-z][a-z0-9_]*$/.test(rawToken)) {
    return {
      name: rawToken,
      type: optional ? 'argument اختياري' : 'argument إلزامي',
      semanticKind: 'argument',
      descriptionArabic: buildCmakeArgumentDescription(rawToken, entry, optional)
    };
  }

  return {
    name: rawToken,
    type: optional ? 'خيار اختياري' : 'كلمة مفتاحية ثابتة في الصياغة',
    semanticKind: 'keyword',
    descriptionArabic: buildCmakeKeywordDescription(rawToken, entry, optional)
  };
}

function collectCmakeSignatureTokens(text = '', options = {}, bucket = []) {
  const source = String(text || '').trim();
  if (!source) {
    return bucket;
  }

  const tokenRegex = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$ENV\{[A-Za-z_][A-Za-z0-9_]*\}|\$\{[A-Za-z_][A-Za-z0-9_]*\}|\$<.+?>|<[^>]+>\.\.\.|<[^>]+>|\[[^\]]+\]|@[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_]*|\.\.\./g;
  const tokens = source.match(tokenRegex) || [];

  tokens.forEach((token) => {
    if (/^\[[\s\S]+\]$/.test(token)) {
      const inner = token.slice(1, -1).trim();
      const isCompositeGroup = /[\s|]/.test(inner) || inner.includes('...');
      if (isCompositeGroup) {
        bucket.push({token, optional: true});
      }
      collectCmakeSignatureTokens(inner, {...options, optional: true}, bucket);
      return;
    }

    if (token === '...' || token === '|' || token === '(' || token === ')') {
      return;
    }

    bucket.push({token, optional: Boolean(options.optional)});
  });

  return bucket;
}

function buildCmakeSignatureParameters(entry = {}) {
  const manual = Array.isArray(entry.parameters) ? entry.parameters.filter(Boolean) : [];
  const signature = String(entry.signature || '').trim();
  if (!signature) {
    return manual;
  }

  const innerSignature = signature.includes('(') && signature.lastIndexOf(')') > signature.indexOf('(')
    ? signature.slice(signature.indexOf('(') + 1, signature.lastIndexOf(')'))
    : signature;

  const generated = collectCmakeSignatureTokens(innerSignature)
    .map(({token, optional}) => buildCmakeSignatureTokenEntry(token, entry, {optional}))
    .filter(Boolean);

  return uniqueRowsByName([
    ...manual,
    ...generated.filter((row) => !manual.some((manualRow) => String(manualRow?.name || '').trim() === row.name))
  ]);
}

function readKindEntries(kindId) {
  const filePath = path.join(sourceRoot, `${kindId}.json`);
  const payload = readJson(filePath);
  if (!Array.isArray(payload)) {
    throw new Error(`Expected array in ${filePath}`);
  }
  return payload.map((entry) => ({
    ...entry,
    kindId
  }));
}

function resolveRelatedLinks(allEntries, related = []) {
  return (Array.isArray(related) ? related : []).map((item) => {
    if (typeof item === 'string') {
      const match = allEntries.find((entry) => entry.name === item);
      if (!match) {
        return {name: item, route: ''};
      }
      return {
        name: match.name,
        route: buildReferenceHash(match.kindId, match.slug),
        libraryId,
        kindId: match.kindId
      };
    }

    if (!item || typeof item !== 'object') {
      return null;
    }

    const explicitKindId = String(item.kindId || item.kind || '').trim();
    const match = explicitKindId
      ? allEntries.find((entry) => entry.kindId === explicitKindId && entry.name === item.name)
      : allEntries.find((entry) => entry.name === item.name);

    if (!match) {
      return {
        name: item.name || '',
        route: item.route || '',
        href: item.href || ''
      };
    }

    return {
      name: match.name,
      route: buildReferenceHash(match.kindId, match.slug),
      libraryId,
      kindId: match.kindId
    };
  }).filter(Boolean);
}

function buildEntityPayload(entry, allEntries, generatedAt) {
  const kindMeta = KIND_META[entry.kindId];
  const datasetPath = `data/ui/cmake/${entry.kindId}.json`;
  return {
    schemaVersion,
    generatedAt,
    library: LIBRARY_META,
    kind: {
      id: kindMeta.id,
      displayName: kindMeta.displayName,
      displayNameArabic: kindMeta.displayNameArabic,
      description: kindMeta.description
    },
    identity: {
      name: entry.name,
      slug: entry.slug,
      titleArabic: entry.titleArabic,
      aliases: Array.isArray(entry.aliases) ? entry.aliases : []
    },
    route: {
      hash: buildReferenceHash(entry.kindId, entry.slug),
      contentPath: `content/reference/${libraryId}/${entry.kindId}/${entry.slug}.json`
    },
    summary: {
      actualTranslationArabic: entry.titleArabic,
      actualMeaningArabic: entry.actualMeaningArabic,
      purposeArabic: entry.purposeArabic,
      whyUseArabic: entry.whyUseArabic,
      carriedValueArabic: entry.carriedValueArabic,
      sourceDescription: entry.shortDescription || entry.actualMeaningArabic
    },
    signature: {
      raw: entry.signature || '',
      header: entry.header || '',
      headerUrl: entry.headerUrl || ''
    },
    details: {
      parameters: buildCmakeSignatureParameters(entry),
      fields: Array.isArray(entry.fields) ? entry.fields : [],
      values: Array.isArray(entry.values) ? entry.values : [],
      usage: Array.isArray(entry.usage) ? entry.usage : [],
      notes: Array.isArray(entry.notes) ? entry.notes : [],
      remarks: Array.isArray(entry.remarks) ? entry.remarks : [],
      instructions: Array.isArray(entry.instructions) ? entry.instructions : [],
      lifecycle: [],
      returns: entry.returns || '',
      threadSafety: entry.threadSafety || '',
      example: entry.example || ''
    },
    links: {
      officialUrl: entry.officialUrl || '',
      sourceUrl: entry.officialUrl || '',
      related: resolveRelatedLinks(allEntries, entry.related)
    },
    source: {
      dataset: datasetPath,
      category: kindMeta.displayNameArabic,
      packageKey: '',
      packageName: 'CMake'
    }
  };
}

function groupEntriesForKind(entries) {
  const groups = new Map();

  entries.forEach((entry) => {
    const first = String(entry.name || '').trim().charAt(0) || '#';
    const letter = /[A-Za-z]/.test(first) ? first.toUpperCase() : first;
    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter).push({
      name: entry.name,
      slug: entry.slug,
      titleArabic: entry.titleArabic,
      shortDescription: entry.shortDescription || entry.actualMeaningArabic,
      route: buildReferenceHash(entry.kindId, entry.slug),
      officialUrl: entry.officialUrl || ''
    });
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([letter, items]) => ({
      letter,
      items: items.sort((left, right) => left.name.localeCompare(right.name, 'en'))
    }));
}

function buildKindIndex(kindId, entries, generatedAt) {
  const kindMeta = KIND_META[kindId];
  return {
    schemaVersion,
    generatedAt,
    library: LIBRARY_META,
    kind: {
      id: kindMeta.id,
      displayName: kindMeta.displayName,
      displayNameArabic: kindMeta.displayNameArabic,
      description: kindMeta.description
    },
    totalCount: entries.length,
    routes: {
      hub: '#ref',
      library: buildReferenceHash(),
      kind: buildReferenceHash(kindId)
    },
    groups: groupEntriesForKind(entries)
  };
}

function buildLibraryIndex(entriesByKind, generatedAt) {
  const kinds = KIND_ORDER
    .filter((kindId) => Array.isArray(entriesByKind[kindId]) && entriesByKind[kindId].length > 0)
    .map((kindId) => {
      const kindMeta = KIND_META[kindId];
      const count = entriesByKind[kindId].length;
      return {
        id: kindMeta.id,
        displayName: kindMeta.displayName,
        displayNameArabic: kindMeta.displayNameArabic,
        description: kindMeta.description,
        count,
        path: `content/reference/${libraryId}/${kindId}/index.json`,
        route: buildReferenceHash(kindId)
      };
    });

  return {
    schemaVersion,
    generatedAt,
    library: LIBRARY_META,
    totalCount: kinds.reduce((total, kind) => total + kind.count, 0),
    routes: {
      hub: '#ref',
      library: buildReferenceHash()
    },
    kinds
  };
}

function updateManifest(libraryIndex, generatedAt) {
  const manifest = readJson(manifestPath);
  const standardKinds = Array.isArray(manifest.standardKinds) ? [...manifest.standardKinds] : [];
  Object.values(KIND_META).forEach((kindMeta) => {
    if (!standardKinds.some((entry) => entry.id === kindMeta.id)) {
      standardKinds.push({
        id: kindMeta.id,
        displayName: kindMeta.displayName,
        displayNameArabic: kindMeta.displayNameArabic,
        description: kindMeta.description
      });
    }
  });

  const libraries = Array.isArray(manifest.libraries) ? [...manifest.libraries] : [];
  const libraryPayload = {
    id: LIBRARY_META.id,
    displayName: LIBRARY_META.displayName,
    displayNameArabic: LIBRARY_META.displayNameArabic,
    description: LIBRARY_META.description,
    totalCount: libraryIndex.totalCount,
    path: `content/reference/${libraryId}/index.json`,
    route: buildReferenceHash(),
    kinds: libraryIndex.kinds
  };
  const existingIndex = libraries.findIndex((entry) => entry.id === libraryId);
  if (existingIndex >= 0) {
    libraries[existingIndex] = libraryPayload;
  } else {
    libraries.push(libraryPayload);
  }

  writeJson(manifestPath, {
    ...manifest,
    generatedAt,
    standardKinds,
    libraries
  });
}

function buildSearchPayload(entriesByKind, generatedAt) {
  const orderedEntries = KIND_ORDER.flatMap((kindId) => (entriesByKind[kindId] || []));
  return {
    generatedAt,
    meta: {
      libraryId,
      displayName: LIBRARY_META.displayName,
      displayNameArabic: LIBRARY_META.displayNameArabic,
      description: LIBRARY_META.description,
      officialUrl: 'https://cmake.org/cmake/help/latest/',
      tutorialUrl: 'https://cmake.org/cmake/help/latest/guide/tutorial/index.html',
      sections: KIND_ORDER
        .filter((kindId) => (entriesByKind[kindId] || []).length > 0)
        .map((kindId) => {
          const kindMeta = KIND_META[kindId];
          return {
            key: kindId,
            title: kindMeta.displayNameArabic,
            titleEn: kindMeta.displayName,
            count: entriesByKind[kindId].length,
            route: buildReferenceHash(kindId),
            iconType: kindMeta.iconType
          };
        })
    },
    entries: orderedEntries.map((entry) => ({
      libraryId,
      name: entry.name,
      displayName: entry.name,
      slug: entry.slug,
      kind: entry.kindId,
      kindLabelArabic: KIND_META[entry.kindId].displayNameArabic,
      iconType: KIND_META[entry.kindId].iconType,
      sectionKey: entry.kindId,
      sectionTitle: KIND_META[entry.kindId].displayNameArabic,
      titleArabic: entry.titleArabic,
      description: entry.shortDescription || entry.actualMeaningArabic,
      meaning: entry.actualMeaningArabic,
      purpose: entry.purposeArabic,
      whyUse: entry.whyUseArabic,
      carriedValue: entry.carriedValueArabic,
      route: buildReferenceHash(entry.kindId, entry.slug),
      officialUrl: entry.officialUrl || '',
      aliases: Array.isArray(entry.aliases) ? entry.aliases : [],
      tooltip: [entry.titleArabic, entry.actualMeaningArabic, entry.whyUseArabic].filter(Boolean).join('\n')
    }))
  };
}

function buildOfficialLinksPayload(generatedAt) {
  return {
    schemaVersion,
    generatedAt,
    sourceName: 'CMake Official Documentation',
    sourceLabelArabic: 'المرجع الرسمي لـ CMake',
    entities: {},
    links: []
  };
}

function main() {
  const generatedAt = new Date().toISOString();
  const entriesByKind = {};

  KIND_ORDER.forEach((kindId) => {
    entriesByKind[kindId] = readKindEntries(kindId).map((entry) => ({
      ...entry,
      slug: slugifyName(entry.slug || entry.name),
      shortDescription: normalizeWhitespace(entry.shortDescription || entry.actualMeaningArabic || entry.titleArabic || '')
    }));
  });

  const allEntries = KIND_ORDER.flatMap((kindId) => entriesByKind[kindId]);

  fs.rmSync(outputRoot, {recursive: true, force: true});
  ensureDir(outputRoot);

  const libraryIndex = buildLibraryIndex(entriesByKind, generatedAt);
  writeJson(path.join(outputRoot, 'index.json'), libraryIndex);

  KIND_ORDER.forEach((kindId) => {
    const kindEntries = entriesByKind[kindId];
    if (!kindEntries.length) {
      return;
    }

    const kindDir = path.join(outputRoot, kindId);
    ensureDir(kindDir);
    writeJson(path.join(kindDir, 'index.json'), buildKindIndex(kindId, kindEntries, generatedAt));

    kindEntries.forEach((entry) => {
      writeJson(
        path.join(kindDir, `${entry.slug}.json`),
        buildEntityPayload(entry, allEntries, generatedAt)
      );
    });
  });

  updateManifest(libraryIndex, generatedAt);
  writeJson(officialLinksOutputPath, buildOfficialLinksPayload(generatedAt));
  writeJson(searchOutputPath, buildSearchPayload(entriesByKind, generatedAt));
}

main();
