// ArabicVulkan - extracted heavy global helper functions from js/app.js (phase326)

function getAppTextValue(key) {
  return appTextLoader.getValue(key);
}

function freezeDataSlice(data = {}, key = '') {
  return Object.freeze(data?.[key] || {});
}

function applySdl3LexiconData(data = {}) {
  SDL3_SYNTHETIC_REFERENCE_OVERRIDES = Object.freeze(data.syntheticReferenceOverrides || {});
  SDL3_ARABIC_WORD_MAP = Object.freeze(data.arabicWordMap || {});
  SDL3_CATEGORY_TITLE_MAP = Object.freeze(data.categoryTitleMap || {});
  SDL3_NATIVE_SYMBOL_INFO = Object.freeze(data.nativeSymbolInfo || {});
  resetSdl3DerivedCaches();
}

function applySdl3TooltipOverrideData(data = {}) {
  SDL3_TOOLTIP_CONTENT_OVERRIDES = freezeDataSlice(data, 'tooltipContentOverrides');
}

function applySdl3ExampleGuideData(data = {}) {
  SDL3_EXAMPLE_GUIDES = freezeDataSlice(data, 'exampleGuides');
}

function applyVulkanExampleGuideData(data = {}) {
  VULKAN_EXAMPLE_GUIDES = freezeDataSlice(data, 'exampleGuides');
}

function applyVulkanParameterOverrideData(data = {}) {
  VULKAN_PARAMETER_OVERRIDES = freezeDataSlice(data, 'parameterOverrides');
}

function applyImguiExampleGuideData(data = {}) {
  IMGUI_EXAMPLE_GUIDES = freezeDataSlice(data, 'exampleGuides');
}

function applyImguiParameterOverrideData(data = {}) {
  IMGUI_PARAMETER_OVERRIDES = freezeDataSlice(data, 'parameterOverrides');
}

function applyGlslExampleGuideData(data = {}) {
  GLSL_EXAMPLE_GUIDES = freezeDataSlice(data, 'exampleGuides');
}

function applyGlslExampleTooltipOverrideData(data = {}) {
  GLSL_EXAMPLE_TOOLTIP_OVERRIDES = freezeDataSlice(data, 'tooltipOverrides');
}

function applyCppReferenceEnrichmentData(data = {}) {
  CPP_REFERENCE_ENRICHMENT = freezeDataSlice(data, 'referenceEnrichment');
}

function applyCppReferenceOfficialLinksData(data = {}) {
  CPP_REFERENCE_OFFICIAL_LINKS = freezeDataSlice(data, 'officialLinks');
}

function applyCppReferenceGuideData(data = {}) {
  CPP_REFERENCE_GUIDES = freezeDataSlice(data, 'referenceGuides');
}

function applyCppReferenceTooltipOverrideData(data = {}) {
  CPP_REFERENCE_TOOLTIP_OVERRIDES = freezeDataSlice(data, 'tooltipOverrides');
}

function applyVulkanSearchTables(data = {}) {
  enumReferenceMetadata = Object.freeze(data.enumReferenceMetadata || {});
  knownFieldMetadata = Object.freeze(data.knownFieldMetadata || {});
}

async function ensureAppTextData() {
  await appTextLoader.ensureLoaded();
}

function createEmptySdl3EntityData() {
  return {
    functions: [],
    types: [],
    enums: [],
    constants: [],
    macros: []
  };
}

function normalizeCanonicalSdl3Parameter(parameter = {}) {
  return {
    ...parameter,
    name: String(parameter?.name || '').trim(),
    type: String(parameter?.type || '').trim(),
    officialArabicDescription: String(
      parameter?.descriptionArabic
      || parameter?.officialArabicDescription
      || parameter?.description
      || ''
    ).trim(),
    originalDescription: String(parameter?.originalDescription || '').trim()
  };
}

function normalizeCanonicalSdl3Value(value = {}) {
  return {
    ...value,
    name: String(value?.name || '').trim(),
    value: String(value?.value || '').trim(),
    description: String(
      value?.descriptionArabic
      || value?.description
      || value?.meaningArabic
      || ''
    ).trim()
  };
}

function normalizeCanonicalSdl3Entity(item = {}, dataKey = '') {
  if (!item || typeof item !== 'object' || !item?.schemaVersion || !item?.identity?.name) {
    return item;
  }

  const normalizedKind = ({
    functions: 'function',
    types: 'type',
    enums: 'enum',
    constants: 'constant',
    macros: 'macro'
  })[String(item?.kind?.id || '').trim()] || ({
    functions: 'function',
    types: 'type',
    enums: 'enum',
    constants: 'constant',
    macros: 'macro'
  })[String(dataKey || '').trim()] || 'function';

  const signature = item?.signature || {};
  const details = item?.details || {};
  const source = item?.source || {};
  const summary = item?.summary || {};
  const links = item?.links || {};
  const identity = item?.identity || {};
  const header = String(signature?.header || '').trim();
  const kindDisplayName = String(item?.kind?.displayNameArabic || item?.kind?.displayName || '').trim();
  const officialDescription = String(
    summary?.actualTranslationArabic
    || summary?.sourceDescription
    || summary?.actualMeaningArabic
    || ''
  ).trim();
  const actualMeaning = String(
    summary?.actualMeaningArabic
    || summary?.actualTranslationArabic
    || summary?.sourceDescription
    || ''
  ).trim();

  return {
    ...item,
    name: String(identity?.name || '').trim(),
    slug: String(identity?.slug || '').trim(),
    titleArabic: String(identity?.titleArabic || '').trim(),
    aliases: Array.isArray(identity?.aliases) ? identity.aliases.slice() : [],
    kind: normalizedKind,
    syntax: String(signature?.raw || '').trim(),
    signature,
    parameters: Array.isArray(details?.parameters)
      ? details.parameters.map((parameter) => normalizeCanonicalSdl3Parameter(parameter))
      : [],
    values: Array.isArray(details?.values)
      ? details.values.map((value) => normalizeCanonicalSdl3Value(value))
      : [],
    returns: String(details?.returns || '').trim(),
    threadSafety: String(details?.threadSafety || '').trim(),
    remarks: Array.isArray(details?.remarks) ? details.remarks.slice() : [],
    notes: Array.isArray(details?.notes) ? details.notes.slice() : [],
    instructions: Array.isArray(details?.instructions) ? details.instructions.slice() : [],
    lifecycle: Array.isArray(details?.lifecycle) ? details.lifecycle.slice() : [],
    usageExample: details?.example || null,
    description: actualMeaning,
    officialArabicDescription: officialDescription,
    realMeaning: actualMeaning,
    whenToUse: String(summary?.whyUseArabic || '').trim(),
    practicalBenefit: String(summary?.carriedValueArabic || '').trim(),
    header,
    headerUrl: String(signature?.headerUrl || '').trim(),
    officialUrl: String(links?.officialUrl || '').trim(),
    sourceUrl: String(links?.sourceUrl || '').trim(),
    packageKey: String(source?.packageKey || '').trim(),
    packageName: String(source?.packageName || '').trim(),
    packageDisplayName: String(item?.library?.displayNameArabic || item?.library?.displayName || source?.packageName || '').trim(),
    categoryTitle: String(source?.category || kindDisplayName || '').trim(),
    categorySectionTitle: String(item?.library?.displayNameArabic || item?.library?.displayName || '').trim(),
    seeAlso: Array.isArray(links?.related)
      ? links.related.map((entry) => String(entry?.name || '').trim()).filter(Boolean)
      : []
  };
}

function mergeSdl3EntityPayload(nextData = {}) {
  const merged = createEmptySdl3EntityData();
  Object.keys(merged).forEach((dataKey) => {
    const currentItems = Array.isArray(sdl3EntityData?.[dataKey]) ? sdl3EntityData[dataKey] : [];
    const nextItems = Array.isArray(nextData?.[dataKey])
      ? nextData[dataKey].map((item) => normalizeCanonicalSdl3Entity(item, dataKey))
      : [];
    if (!nextItems.length) {
      merged[dataKey] = currentItems.slice();
      return;
    }

    const lookup = new Map();
    currentItems.forEach((item, index) => {
      const key = String(item?.name || `${dataKey}:${index}`);
      lookup.set(key, item);
    });
    nextItems.forEach((item, index) => {
      const key = String(item?.name || `${dataKey}:next:${index}`);
      lookup.set(key, item);
    });
    merged[dataKey] = Array.from(lookup.values());
  });

  sdl3EntityData = merged;
  resetSdl3DerivedCaches();
}

function buildCmakeVariableReferenceInfo(variableName = '') {
  const name = String(variableName || '').trim();
  if (!name) {
    return null;
  }

  if (CMAKE_INLINE_VARIABLE_REFERENCE_HELP[name]) {
    return CMAKE_INLINE_VARIABLE_REFERENCE_HELP[name];
  }

  if (/^CMAKE_<[A-Z]+>_STANDARD$/.test(name)) {
    return CMAKE_INLINE_VARIABLE_REFERENCE_HELP['CMAKE_<LANG>_STANDARD'];
  }

  if (/^CMAKE_[A-Z0-9]+_STANDARD$/.test(name)) {
    return {
      kindLabel: 'متغير CMake عام',
      typeLabel: 'معيار لغة افتراضي',
      meaning: `هذا متغير من عائلة CMAKE_<LANG>_STANDARD يحدد القيمة الافتراضية لمعيار اللغة المرتبط بها قبل إنشاء الأهداف الجديدة.`,
      whyUse: 'يفيد عندما تريد سياسة معيار موحدة على مستوى المشروع للغة معينة بدل ضبط كل target يدويًا من البداية.',
      actualUsage: 'أثره البنيوي يظهر أثناء configure عندما تنشئ الأهداف اللاحقة لتلك اللغة، لأنه يملأ الخاصية المقابلة لها افتراضيًا.'
    };
  }

  return {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير عادي',
    meaning: `هذه الصيغة تستبدل ${name} بقيمته الحالية داخل هذا الموضع من CMake.`,
    whyUse: 'تستخدم عندما تحفظ قيمة باسم ثم تعيد استعمالها لاحقًا داخل رسالة أو شرط أو مسار أو استدعاء أمر آخر.',
    actualUsage: 'تُقيَّم أثناء configure عندما يقرأ CMake هذا الوسيط. إذا كانت القيمة تمثل قائمة مثل stooges فستظهر عادة كنص مفصول بفواصل منقوطة ما لم يعيد الأمر الحالي تفسيرها كقائمة.'
  };
}

function buildCmakeEnvironmentReferenceInfo(variableName = '') {
  const name = String(variableName || '').trim();
  if (!name) {
    return null;
  }

  if (CMAKE_INLINE_ENVIRONMENT_REFERENCE_HELP[name]) {
    return CMAKE_INLINE_ENVIRONMENT_REFERENCE_HELP[name];
  }

  return {
    kindLabel: 'مرجع بيئة في CMake',
    typeLabel: 'متغير بيئة النظام',
    meaning: `هذه الصيغة تقرأ قيمة متغير البيئة ${name} من بيئة النظام الحالية أثناء configure.`,
    whyUse: 'تستخدم عندما يكون مصدر القيمة خارجيًا عن CMakeLists.txt نفسه، مثل إعدادات الجلسة أو مسارات يجهزها النظام.',
    actualUsage: 'تُقيَّم أثناء configure في العملية الحالية فقط، ثم يستهلك الأمر القيمة النصية الناتجة في هذا الموضع.'
  };
}

const contentCatalogs = window.__ARABIC_VULKAN_CONTENT_CATALOGS__ || {};
const {
  SDL3_HOME_FALLBACK_PACKAGE_META = {},
  SDL3_READY_EXAMPLES = [],
  VULKAN_READY_EXAMPLES = [],
  VULKAN_TO_IMGUI_EXAMPLE_IDS = [],
  SDL3_TO_IMGUI_EXAMPLE_SPECS = [],
  VULKAN_TO_SDL3_EXAMPLE_ID_SET = new Set(),
  VULKAN_TO_IMGUI_EXAMPLE_ID_SET = new Set(),
  getRawVulkanCatalogExampleById = () => null,
  getRawSdl3CatalogExampleById = () => null,
  isVulkanExampleMovedOut = () => false,
  isSdl3ExampleMovedToImgui = () => false,
  getSdl3BridgeExamples = () => []
} = contentCatalogs;

const REFERENCE_INSIGHTS_RUNTIME_KEY = 'referenceInsights';
const TUTORIAL_UI_RUNTIME_KEY = 'tutorialUi';

function ensureTutorialUiRuntime() {
  return runtimeAgentController.ensureRuntimeAgent(TUTORIAL_UI_RUNTIME_KEY);
}

function callRuntimeAgentMethod(agentKey, methodName, args = [], fallback) {
  return runtimeAgentController.callRuntimeAgentMethod(agentKey, methodName, args, fallback);
}

function callTutorialUiRuntime(methodName, args = [], fallback) {
  return callRuntimeAgentMethod(TUTORIAL_UI_RUNTIME_KEY, methodName, args, fallback);
}

function callReferenceInsightsRuntime(methodName, args = [], fallback) {
  return callRuntimeAgentMethod(REFERENCE_INSIGHTS_RUNTIME_KEY, methodName, args, fallback);
}

function createTutorialRuntimeInvoker(methodName, fallback) {
  return (...args) => callTutorialUiRuntime(methodName, args, fallback);
}

function buildTutorialContentFromLayouts(layouts = {}) {
  return callTutorialUiRuntime('buildTutorialContentFromLayouts', [layouts], (value = {}) => value);
}

function prepareTutorialCodeContainers(root = document) {
  getTutorialSupportRuntime()?.prepareTutorialCodeContainers?.(root);
}

function activateTutorialLazyCodeBlocks(root = document) {
  getTutorialSupportRuntime()?.activateTutorialLazyCodeBlocks?.(root);
}

function refreshTutorialCodePresentation(root = document) {
  getTutorialSupportRuntime()?.refreshTutorialCodePresentation?.(root);
}

function getAllGlslReferenceItems() {
  if (glslReferenceItemsCache) {
    return glslReferenceItemsCache;
  }

  if (glslReferenceItemsBuilding) {
    return [];
  }

  glslReferenceItemsBuilding = true;
  try {
    glslReferenceItemsCache = Object.entries(glslReferenceSections).flatMap(([sectionKey, section]) => {
      return (section.items || []).map((item) => ({
        ...item,
        sectionKey,
        sectionTitle: section.title,
        sectionIcon: section.icon || 'code',
        displayName: item.name
      }));
    });
    glslReferenceItemLookupCache = new Map();
    glslReferenceItemsCache.forEach((item) => {
      glslReferenceItemLookupCache.set(item.name, item);
      (item.aliases || []).forEach((alias) => {
        const normalizedAlias = String(alias || '').trim();
        if (normalizedAlias && !glslReferenceItemLookupCache.has(normalizedAlias)) {
          glslReferenceItemLookupCache.set(normalizedAlias, item);
        }
      });
    });
    return glslReferenceItemsCache;
  } finally {
    glslReferenceItemsBuilding = false;
  }
}

function getGlslReferenceItem(rawName) {
  const target = String(rawName || '').trim();
  if (!target) {
    return null;
  }

  if (!glslReferenceItemLookupCache) {
    getAllGlslReferenceItems();
  }

  return glslReferenceItemLookupCache?.get(target) || null;
}

function buildGlslReferenceTooltip(item) {
  if (!item) {
    return '';
  }

  const meaning = normalizeGlslExplanationText(preferArabicTooltipText(item.description, buildGlslPracticalRole(item)));
  const usage = normalizeGlslExplanationText(preferArabicTooltipText(item.usage, 'يظهر داخل الشيدر لتحديد دوره أو طريقة ربطه وأثره أثناء ترجمة الشيدر.'));
  const execution = normalizeGlslExplanationText(preferArabicTooltipText(item.execution, buildGlslTranslationReadText(item)));
  const kindLabel = localizeGlslKind(item.kind);
  const whyExists = item.kind
    ? `${item.displayName || item.name} موجود داخل GLSL لأنه يحدد جزءاً فعلياً من عقد الترجمة أو الواجهة أو التنفيذ داخل الشيدر.`
    : 'هذا العنصر موجود داخل GLSL لأنه يغير معنى الشيدر أثناء الترجمة أو أثناء تنفيذ المرحلة المرتبطة به.';

  return composeSemanticTooltip({
    title: item.displayName || item.name,
    kindLabel: 'عنصر GLSL',
    typeLabel: kindLabel || 'عنصر شيدر',
    library: 'GLSL',
    meaning,
    whyExists,
    whyUse: usage,
    actualUsage: execution
  });
}

function getGlslKindIcon(kind = '') {
  const text = String(kind || '');
  if (/Directive|Compilation/i.test(text)) return '#';
  if (/Entry Point|Control Flow|Loop Keyword/i.test(text)) return '↪';
  if (/Macro|Literal|Constant/i.test(text)) return 'C';
  if (/Qualifier|Layout|Storage|Interpolation|Memory Qualifier/i.test(text)) return '@';
  if (/Scalar|Vector|Matrix|Opaque Resource|Type/i.test(text)) return 'T';
  if (/Built-in.*Variable|Interface Variable/i.test(text)) return 'V';
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(text)) return 'ƒ';
  if (/Block|Structure|Interface/i.test(text)) return '{}';
  return 'GL';
}

function renderGlslKindLabel(text, kind, options = {}) {
  const wrapperClasses = ['entity-inline-label'];
  if (options.code) wrapperClasses.push('entity-inline-label-code');
  const badgeClass = options.code ? 'glsl-kind-badge inline' : 'glsl-kind-badge';
  return `<span class="${escapeAttribute(wrapperClasses.join(' '))}"><span class="${badgeClass}">${escapeHtml(getGlslKindIcon(kind))}</span><span class="entity-label-text">${escapeHtml(text)}</span></span>`;
}

function renderGlslReferenceChip(name, label = '') {
  const item = getGlslReferenceItem(name);
  const text = label || item?.displayName || name;

  if (!item) {
    return `<code>${escapeHtml(text)}</code>`;
  }

  const tooltip = buildGlslReferenceTooltip(item);
  const aria = escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`);
  const content = renderGlslKindLabel(text, item.kind, {code: true});
  return `<a href="#" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="showGlslReference('${escapeAttribute(item.name)}'); return false;">${content}</a>`;
}

const GLSL_EXPLANATION_TERM_REPLACEMENTS = [
  [/\bshader compiler\b/gi, 'مترجم الشيدر'],
  [/\binterface matching\b/gi, 'مطابقة الواجهة'],
  [/\bpreprocessing\b/gi, 'المعالجة المسبقة'],
  [/\bpreprocessor\b/gi, 'المعالج المسبق'],
  [/\brun(?:[ -]?time)\b/gi, 'وقت التنفيذ'],
  [/\bbuilt-ins?\b/gi, 'العناصر المدمجة'],
  [/\bqualifiers?\b/gi, 'محددات النوع'],
  [/\bfeatures?\b/gi, 'الميزات'],
  [/\btranslation\b/gi, 'الترجمة'],
  [/\bexecution\b/gi, 'التنفيذ'],
  [/\bshader\b/gi, 'شيدر'],
  [/\bGPU\b/g, 'المعالج الرسومي'],
  [/\bMacro\b/g, 'ماكرو'],
  [/\bCompute Shader\b/gi, 'شيدر الحوسبة'],
  [/\bVertex Input\b/gi, 'دخل الرؤوس']
];

function normalizeGlslExplanationText(text) {
  let value = decodeBasicHtmlEntities(String(text || ''))
    .replace(/\u00a0/g, ' ')
    .trim();

  if (!value) {
    return '';
  }

  GLSL_EXPLANATION_TERM_REPLACEMENTS.forEach(([pattern, replacement]) => {
    value = value.replace(pattern, replacement);
  });

  return value;
}

function localizeGlslKind(kind = '') {
  const value = String(kind || '').trim();
  if (!value) {
    return '';
  }
  if (/Compilation/i.test(value)) return 'توجيه ترجمة (#Directive)';
  if (/Directive/i.test(value)) return 'توجيه المعالجة المسبقة (#Directive)';
  if (/Layout Qualifier/i.test(value)) return 'محدد layout';
  if (/Layout Key/i.test(value)) return 'مفتاح داخل layout';
  if (/Storage Qualifier/i.test(value)) return 'محدد مساحة تخزين';
  if (/Interface Variable/i.test(value)) return 'متغير واجهة';
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(value)) return 'دالة مدمجة';
  if (/Built-in.*Variable/i.test(value)) return 'متغير مدمج';
  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(value)) return 'نوع أو مورد لغوي';
  if (/Block|Structure|Interface/i.test(value)) return 'بنية أو كتلة واجهة';
  if (/Entry Point|Control Flow|Loop Keyword/i.test(value)) return 'عنصر تحكم أو نقطة دخول';
  return normalizeGlslExplanationText(value);
}

function buildGlslEntityKindNote(item) {
  const kind = String(item?.kind || '').trim();

  if (/Compilation/i.test(kind)) {
    return 'هذا العنصر توجيه من لغة GLSL يفسره مترجم glslang أثناء ترجمة الشيدر. لا يمثل هذا العنصر دالة أو نوعًا في Vulkan، بل يؤثر فقط على طريقة تحليل الشيدر قبل تحويله إلى SPIR-V.';
  }

  if (/Directive/i.test(kind)) {
    return 'هذا العنصر توجيه من لغة GLSL يفسره مترجم glslang أثناء مرحلة المعالجة المسبقة أو أثناء ترجمة الشيدر. لا يمثل هذا العنصر دالة أو نوعًا في Vulkan، بل يؤثر فقط على تحليل الشيدر قبل تحويله إلى SPIR-V.';
  }

  return 'هذا العنصر جزء من لغة GLSL كما يفسره مترجم glslang، وليس كيانًا مباشرًا في واجهة Vulkan البرمجية.';
}

function inferGlslExecutionStageLabel(item) {
  const text = `${item?.kind || ''} ${item?.execution || ''} ${item?.usage || ''}`;
  if (/preprocessing|Directive|Conditional Compilation/i.test(text)) {
    return 'المعالجة المسبقة وترجمة الشيدر';
  }
  if (/translation|compiler|SPIR-V|Qualifier|Type|Interface/i.test(text)) {
    return 'ترجمة الشيدر ومطابقة الواجهة';
  }
  if (/Built-in.*Function|Built-in.*Variable|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function|Entry Point|Control Flow|Loop Keyword|Shader|sampling|Rasterization|Fragment|Vertex|execution/i.test(text)) {
    return 'ترجمة الشيدر وإنتاج SPIR-V';
  }
  return 'تحليل الشيدر وترجمته';
}

function buildGlslPracticalRole(item) {
  const kind = String(item?.kind || '');
  if (/Directive|Compilation/i.test(kind)) {
    return 'عنصر لغوي يقرأه مترجم glslang أثناء المعالجة المسبقة أو الترجمة لتحديد النص والقواعد المسموح بها قبل إنتاج SPIR-V (التمثيل الوسيط للشيدر).';
  }
  if (/Macro|Literal|Constant/i.test(kind)) {
    return 'عنصر ثابت أو قيمة يثبتها مترجم glslang أثناء ترجمة الشيدر، ثم يظهر أثرها في SPIR-V أو في القيم الثابتة الناتجة.';
  }
  if (/Qualifier|Layout|Storage/i.test(kind)) {
    return 'محدد لغوي يقرأه مترجم glslang لبناء وصف الواجهة والربط بين الشيدر والتطبيق قبل إنتاج SPIR-V.';
  }
  if (/Built-in.*Variable/i.test(kind)) {
    return 'اسم مدمج يربطه glslang بدلالة مرحلة معروفة، ثم يحول أثره إلى واجهة أو تعليمات ضمن SPIR-V.';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return 'دالة مدمجة يفسرها glslang أثناء الترجمة ثم يحولها إلى تعليمات داخل SPIR-V، لا إلى استدعاء باسم GLSL الأصلي.';
  }
  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'نوع لغوي يحدد شكل القيم أو الموارد التي يبني عليها glslang فحص العمليات ومطابقة الواجهة.';
  }
  if (/Block|Structure|Interface/i.test(kind)) {
    return 'بنية لغوية تنظم حقول الواجهة أو الموارد بحيث يستطيع glslang تحويلها إلى وصف متسق داخل SPIR-V.';
  }
  return 'عنصر لغوي يقرأه مترجم glslang أثناء ترجمة الشيدر ليبني منه دلالة صحيحة تنتقل آثارها إلى SPIR-V، لا إلى المعالج الرسومي مباشرة.';
}

const GLSL_INLINE_REFERENCE_TOOLTIP_OVERRIDES = {
  glslang: 'مترجم GLSL يحلل الشيدر ويحوّل أثر عناصره إلى SPIR-V (التمثيل الوسيط للشيدر).',
  GLSLang: 'مرجع محلي لعناصر GLSL كما يفسرها مترجم glslang أثناء الترجمة.',
  layout: 'محدد في GLSL يصف كيفية ربط المتغيرات أو تنظيم الواجهة داخل الشيدر.',
  location: 'محدد يعيّن موضع متغير واجهة صريحًا بين مراحل الشيدر أو بين الشيدر والتطبيق.',
  binding: 'محدد يعيّن رقم الربط الخاص بالمورد داخل مجموعة الواصفات.',
  set: 'محدد يعيّن رقم مجموعة الواصفات التي ينتمي إليها المورد.',
  push_constant: 'محدد يعلن أن الكتلة تستخدم مساحة push constants في Vulkan.',
  Vulkan: 'واجهة الرسوميات التي تستهلك SPIR-V الناتج من glslang وتطابقه مع الموارد ومراحل الشيدر.'
};

function buildGlslInlineReferenceDescriptor(name) {
  const token = String(name || '').trim();
  if (!token) {
    return null;
  }

  if (token === 'glslang' || token === 'GLSLang') {
    return {
      label: token,
      tooltip: GLSL_INLINE_REFERENCE_TOOLTIP_OVERRIDES[token],
      action: 'showGlslIndex()'
    };
  }

  if (token === 'Vulkan') {
    return {
      label: token,
      tooltip: GLSL_INLINE_REFERENCE_TOOLTIP_OVERRIDES[token],
      action: 'showHomePage()'
    };
  }

  const item = getGlslReferenceItem(token);
  if (!item) {
    return null;
  }

  return {
    label: token,
    tooltip: GLSL_INLINE_REFERENCE_TOOLTIP_OVERRIDES[token] || buildGlslReferenceTooltip(item),
    action: `showGlslReference('${escapeAttribute(item.name)}')`
  };
}

function renderGlslInlineReference(name, label = '') {
  const descriptor = buildGlslInlineReferenceDescriptor(name);
  const text = label || descriptor?.label || name;
  if (!descriptor) {
    return `<code dir="ltr">${escapeHtml(text)}</code>`;
  }

  const tooltip = String(descriptor.tooltip || text).replace(/\s+/g, ' ').trim();
  const aria = escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`);
  return `<a href="#" class="code-link glsl-prose-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="${descriptor.action}; return false;"><code dir="ltr">${escapeHtml(text)}</code></a>`;
}

function normalizeGlslInlineCodeText(source) {
  let raw = stripMarkup(decodeBasicHtmlEntities(String(source || '')))
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!raw) {
    return '';
  }

  if (/^layout\b/i.test(raw)) {
    raw = raw
      .replace(/^layout\s*\(\s*/i, 'layout(')
      .replace(/\s*\)\s*$/g, ')')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*=\s*/g, ' = ')
      .trim();
  }

  return raw;
}

function buildGlslInlineCodeTooltip(source) {
  const raw = normalizeGlslInlineCodeText(source);
  if (!raw) {
    return 'مثال برمجي داخل GLSL.';
  }
  if (/^layout\(location\b/i.test(raw)) {
    return 'مثال على تحديد location بشكل صريح داخل الشيدر.';
  }
  if (/^layout\(set\b/i.test(raw) && /\bbinding\b/i.test(raw)) {
    return 'مثال على تعيين set وbinding بشكل صريح لمورد داخل الشيدر.';
  }
  if (/^layout\(push_constant\)/i.test(raw)) {
    return 'مثال على إعلان كتلة تستخدم مساحة push constants في Vulkan.';
  }
  if (/^layout\(local_size_[xyz]/i.test(raw)) {
    return 'مثال على تثبيت أبعاد workgroup داخل Compute Shader.';
  }
  return 'مثال برمجي يوضح هذه الصيغة داخل GLSL.';
}

function renderGlslInlineCodeSnippet(source, tooltip = '') {
  const raw = normalizeGlslInlineCodeText(source);
  if (!raw) {
    return '';
  }

  const title = String(tooltip || buildGlslInlineCodeTooltip(raw)).trim();
  const aria = escapeAttribute(`${raw}: ${title}`);
  return `<code dir="ltr" class="glsl-inline-code" title="${escapeAttribute(title)}" aria-label="${aria}">${renderHighlightedCode(raw, {language: 'glsl'})}</code>`;
}

function renderGlslLinkedTextSegment(text) {
  const source = String(text || '');
  if (!source) {
    return '';
  }

  const tokenRegex = /\b(?:glslang|GLSLang|layout|location|binding|push_constant|set|Vulkan)\b/g;
  let lastIndex = 0;
  let rendered = '';

  source.replace(tokenRegex, (match, offset) => {
    rendered += escapeHtml(source.slice(lastIndex, offset));
    rendered += renderGlslInlineReference(match);
    lastIndex = offset + match.length;
    return match;
  });

  rendered += escapeHtml(source.slice(lastIndex));
  return rendered;
}

function renderGlslTechnicalProse(text) {
  const source = normalizeGlslExplanationText(decodeBasicHtmlEntities(String(text || '')).trim());
  if (!source) {
    return '';
  }

  if (/<\/?(?:a|code|span|strong|em|br)\b/i.test(source)) {
    return source;
  }

  const codeRegex = /`([^`]+)`|(layout\s*\([^)\n]+\))/gi;
  let lastIndex = 0;
  let rendered = '';

  source.replace(codeRegex, (match, backticked, layoutExpression, offset) => {
    rendered += renderGlslLinkedTextSegment(source.slice(lastIndex, offset));
    rendered += renderGlslInlineCodeSnippet(backticked || layoutExpression || match);
    lastIndex = offset + match.length;
    return match;
  });

  rendered += renderGlslLinkedTextSegment(source.slice(lastIndex));
  return rendered.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, ' ');
}

function buildGlslCompilerRoleText(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();
  const description = normalizeGlslExplanationText(stripMarkup(item?.description || '').trim());

  if (name === 'layout') {
    return 'يقرأ مترجم glslang هذا العنصر أثناء ترجمة الشيدر لاستخراج محددات layout الصريحة التي تثبت مواضع الواجهة وأرقام الربط ونوع مساحة الذاكرة. ثم يحول هذه المعلومات إلى وصف داخل SPIR-V (التمثيل الوسيط للشيدر) يجب أن يبقى متسقًا مع ربط الموارد في Vulkan.';
  }
  if (name === 'location') {
    return 'يقرأ مترجم glslang المفتاح location داخل layout لتثبيت رقم موضع واجهة صريح للمدخل أو المخرج. ثم يكتب أثر هذا الرقم في SPIR-V بحيث تستطيع مراحل الشيدر أو توصيف دخل الرؤوس في Vulkan مطابقته لاحقًا.';
  }
  if (name === 'binding') {
    return 'يقرأ مترجم glslang المفتاح binding داخل layout لتثبيت رقم الربط الخاص بالمورد. ثم يحول هذا الرقم إلى معلومة ربط داخل SPIR-V يجب أن تطابق وصف المورد في VkDescriptorSetLayoutBinding وعمليات كتابة الواصفات في Vulkan.';
  }
  if (name === 'set') {
    return 'يقرأ مترجم glslang المفتاح set داخل layout لتحديد مجموعة الواصفات التي ينتمي إليها المورد. ثم يكتب هذا الأثر في معلومات الربط الناتجة لكي يطابق VkPipelineLayout واستدعاءات vkCmdBindDescriptorSets في Vulkan.';
  }
  if (name === 'push_constant') {
    return 'يقرأ مترجم glslang المفتاح push_constant داخل layout لتمييز الكتلة على أنها مساحة push constants. ثم يولد منها وصف واجهة داخل SPIR-V يجب أن يطابق نطاقات VkPushConstantRange وطريقة تمرير vkCmdPushConstants في Vulkan.';
  }
  if (/^local_size_[xyz]$/.test(name)) {
    return `يقرأ مترجم glslang المفتاح ${name} داخل layout لتثبيت عدد الاستدعاءات المحلية في هذا البعد داخل شيدر الحوسبة. ثم يكتب هذه القيمة في SPIR-V بحيث تعتمد عليها دلالة vkCmdDispatch عند التنفيذ.`;
  }

  if (/Layout Qualifier/i.test(kind)) {
    return 'يستخدم مترجم glslang هذا العنصر لتفسير محددات layout وربطها بالموارد أو متغيرات الواجهة داخل الشيدر. ثم يحول أثرها إلى معلومات ربط صريحة داخل SPIR-V يعتمد عليها توافق الشيدر مع واجهة Vulkan.';
  }
  if (/Layout Key/i.test(kind)) {
    return `يقرأ مترجم glslang هذا العنصر بوصفه مفتاحًا داخل layout ليضيف معلومة ربط صريحة إلى تعريف المتغير أو الكتلة. ثم يستخدم أثرها في مطابقة الواجهة والموارد مع متطلبات Vulkan أثناء الترجمة والتحقق.`;
  }
  if (/Storage Qualifier/i.test(kind)) {
    return 'يستخدم مترجم glslang هذا العنصر لتصنيف المتغير ضمن مساحة التخزين أو الواجهة الصحيحة مثل in أو out أو uniform أو buffer. ثم يبني على هذا التصنيف قواعد التحقق وشكل الواجهة التي ستظهر آثارها في SPIR-V الناتج.';
  }
  if (/Interface Variable/i.test(kind)) {
    return 'يتعامل مترجم glslang مع هذا العنصر كجزء من واجهة المرحلة، فيسجل نوعه ومحدداته وموضعه كي يطابقه مع المرحلة السابقة أو اللاحقة ومع توصيفات الربط التي يعتمد عليها Vulkan.';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return 'يفسر مترجم glslang هذا العنصر كاستدعاء مدمج ذي دلالة معروفة، فيتحقق من أنواع الوسائط وسياق المرحلة ثم يترجمه إلى تعليمات داخل SPIR-V. ولا يرى المعالج الرسومي اسم الدالة الأصلي من GLSL، بل التعليمات الناتجة فقط.';
  }
  if (/Built-in.*Variable/i.test(kind)) {
    return 'يعامل مترجم glslang هذا العنصر كمتغير نظامي ذي معنى ثابت في واجهة المرحلة، فيتحقق من صحة قراءته أو كتابته ويثبت دلالته ضمن الواجهة المترجمة التي ستُستهلك لاحقًا داخل Vulkan.';
  }
  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'يستخدم مترجم glslang هذا العنصر لتثبيت النوع الدلالي للقيم أو الموارد داخل الشجرة الدلالية للشيدر. ثم يبني عليه فحص العمليات والمطابقة بين الواجهات والوصفات التي يعتمد عليها الربط مع Vulkan.';
  }
  if (/Directive|Compilation/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء المعالجة المسبقة أو في بداية ترجمة الشيدر لتحديد القواعد اللغوية والميزات المتاحة قبل تحويل الشيدر إلى SPIR-V (التمثيل الوسيط للشيدر). ولا ينتقل هذا العنصر نفسه إلى المعالج الرسومي، بل يظهر أثره فقط في النص المقبول أو في SPIR-V الناتج.';
  }
  if (/Block|Structure|Interface/i.test(kind)) {
    return 'يفكك مترجم glslang هذا العنصر إلى حقول ومحددات واجهة مترابطة، ثم يبني منها وصفًا منظمًا للواجهة أو الذاكرة داخل SPIR-V يجب أن يطابق تعريفات الربط والموارد في Vulkan.';
  }
  if (/Entry Point|Control Flow|Loop Keyword/i.test(kind)) {
    return 'يفسر مترجم glslang هذا العنصر كجزء من بنية التحكم أو نقطة الدخول داخل الشيدر، فيولّد منه عقدًا صريحة في شجرة التحليل ثم يحول أثرها إلى تعليمات داخل SPIR-V تحدد التفرع أو التكرار أو نقطة البدء الصحيحة.';
  }

  return `يقرأ مترجم glslang هذا العنصر أثناء تحليل الشيدر لأن ${description || 'له دلالة لغوية أو واجهية محددة داخل GLSL'}، ثم يحول أثره إلى معلومات ترجمة أو تحقق أو ربط يجب أن تبقى متسقة مع واجهة Vulkan وSPIR-V الناتج.`;
}

function buildGlslTranslationReadText(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();

  if (name === 'layout') {
    return 'يقرأ مترجم glslang هذا العنصر أثناء تحليل الشيدر في مرحلة الترجمة لاستخراج معلومات التموضع والربط الصريحة. ولا ينتقل هذا العنصر نفسه إلى المعالج الرسومي؛ بل يتحول أثره إلى وصف داخل SPIR-V (التمثيل الوسيط للشيدر).';
  }
  if (/^(location|binding|set|push_constant)$/.test(name) || /^local_size_[xyz]$/.test(name)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء تحليل الشيدر في مرحلة الترجمة بوصفه جزءًا من محددات layout. ولا ينتقل هذا العنصر نفسه إلى المعالج الرسومي؛ بل يتحول أثره إلى أرقام أو دلالات داخل SPIR-V الناتج.';
  }
  if (/Directive|Compilation/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء المعالجة المسبقة أو بداية ترجمة الشيدر لتحديد القواعد اللغوية والميزات المتاحة. ولا يظهر هذا العنصر كتعليمة تنفيذ داخل البرنامج الذي يعمل على المعالج الرسومي.';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء تحليل الشيدر بوصفه دالة مدمجة معروفة. ثم يحول أثره إلى تعليمات داخل SPIR-V، ولا يصل اسم الدالة الأصلي نفسه إلى المعالج الرسومي.';
  }
  if (/Built-in.*Variable|Interface Variable/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء تحليل واجهة المرحلة أو المتغيرات المدمجة ليثبت دلالته ومطابقة موضعه. ثم ينتقل أثره فقط إلى الواجهة أو التعليمات الناتجة في SPIR-V.';
  }
  if (/Storage Qualifier|Layout Qualifier|Layout Key/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء ترجمة الشيدر لتحديد مساحة التخزين أو محددات الربط أو التموضع. ثم يحول أثره إلى وصف واجهة صريح داخل SPIR-V الناتج.';
  }
  if (/Type|Matrix|Vector|Opaque Resource|Scalar|Block|Structure|Interface/i.test(kind)) {
    return 'يقرأ مترجم glslang هذا العنصر أثناء بناء الشجرة الدلالية للشيدر لتثبيت نوع البيانات أو شكل الواجهة أو تنظيم الحقول. ثم تظهر هذه الدلالة في SPIR-V، لا كعنصر GLSL خام على المعالج الرسومي.';
  }
  return 'يقرأ مترجم glslang هذا العنصر أثناء تحليل الشيدر في مرحلة الترجمة، ولا ينتقل هذا العنصر نفسه إلى المعالج الرسومي؛ بل يتحول أثره إلى معلومات أو تعليمات داخل SPIR-V الناتج.';
}

function buildGlslCompilationEffectText(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();

  if (name === 'layout') {
    return 'يغير هذا العنصر معلومات الواجهة والربط التي يثبتها المترجم للموارد أو متغيرات المراحل، مثل location وset وbinding أو مساحة push_constant.';
  }
  if (name === 'location') {
    return 'يغير هذا العنصر رقم الموضع الذي يربط به المتغير داخل واجهة المراحل أو مع التطبيق، مما يثبت المطابقة بدل الاعتماد على موضع ضمني.';
  }
  if (name === 'binding') {
    return 'يغير هذا العنصر رقم الربط الذي يسنده المترجم إلى المورد داخل وصف الواجهة، وبذلك يحدد أين يجب أن يربط المورد في Vulkan.';
  }
  if (name === 'set') {
    return 'يغير هذا العنصر رقم مجموعة الواصفات التي يسند إليها المورد، وبذلك يفصل بين المجموعة وبين فتحة الربط الداخلية للمورد.';
  }
  if (name === 'push_constant') {
    return 'يغير هذا العنصر نوع مساحة الربط التي تنتمي إليها الكتلة، بحيث تترجم على أنها مساحة push constants لا موردًا يربط عبر الواصفات العادية.';
  }
  if (/^local_size_[xyz]$/.test(name)) {
    return 'يغير هذا العنصر أبعاد مجموعة العمل التي يثبتها المترجم داخل شيدر الحوسبة، فتنتقل القيم إلى SPIR-V وتحدد تفسير أبعاد الإرسال.';
  }
  if (/Directive|Compilation/i.test(kind)) {
    return 'يغير هذا العنصر القواعد اللغوية أو الميزات المسموح بها أثناء ترجمة الشيدر، مثل الكلمات المفتاحية المتاحة أو الخصائص التي يسمح بها المترجم.';
  }
  if (/Storage Qualifier/i.test(kind)) {
    return 'يغير هذا العنصر تصنيف المتغير من حيث مساحة التخزين أو اتجاه الواجهة، وهذا ينعكس على قواعد التحقق وعلى شكل الواجهة الناتجة.';
  }
  if (/Layout Qualifier|Layout Key/i.test(kind)) {
    return 'يغير هذا العنصر معلومات الربط الصريحة التي يكتبها المترجم في الواجهة الناتجة، مثل موضع المتغير أو مجموعة المورد أو رقم ربطه.';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return 'يغير هذا العنصر التعليمات التي ينتجها glslang في SPIR-V ونوع العمليات المسموح بها على القيم الداخلة إليه، لكنه لا يبقى باسم GLSL الأصلي عند التنفيذ.';
  }
  if (/Built-in.*Variable|Interface Variable/i.test(kind)) {
    return 'يغير هذا العنصر دلالة المتغير داخل واجهة المرحلة أو داخل التعليمات الناتجة، مثل جهة القراءة أو الكتابة أو الموضع أو النوع المرافق.';
  }
  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'يغير هذا العنصر نوع القيم والعمليات المسموح بها وكيفية تمثيل الموارد أو المتجهات أو المصفوفات أثناء الترجمة والتحقق.';
  }
  if (/Block|Structure|Interface/i.test(kind)) {
    return 'يغير هذا العنصر شكل الواجهة أو تنظيم الحقول الذي يبنيه المترجم، وهذا يحدد كيف تظهر الكتلة أو البنية في SPIR-V وفي مطابقة الموارد.';
  }
  return 'يغير هذا العنصر ما يفهمه المترجم من القواعد أو الواجهة أو القيود المرتبطة بهذا الموضع في الشيدر، لا تعليمات التنفيذ المباشرة باسم GLSL الأصلي.';
}

function buildGlslVulkanBridgeText(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();

  if (name === 'layout' || /^(location|binding|set|push_constant)$/.test(name) || /^local_size_[xyz]$/.test(name)) {
    return 'يرتبط هذا العنصر مباشرة بعناصر اللغة مثل layout وlocation وbinding وset وpush_constant، لأن مترجم glslang يحولها إلى معلومات ربط صريحة يجب أن تطابق موارد Vulkan ومراحل الشيدر.';
  }
  if (/Storage Qualifier|Interface Variable/i.test(kind)) {
    return 'يرتبط هذا العنصر بواجهات مراحل الشيدر وبمحددات layout مثل location عند تمرير البيانات بين المراحل أو بين الشيدر والتطبيق، كما يرتبط بربط الموارد عندما يظهر مع uniform أو buffer.';
  }
  if (/Directive|Compilation/i.test(kind)) {
    return 'يرتبط هذا العنصر بإصدار اللغة أو الميزات التي تحدد ما إذا كانت صيغ مثل layout(set = 0, binding = 1) أو layout(push_constant) مسموحة عند ترجمة الشيدر قبل إنشاء VkShaderModule.';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return 'يرتبط هذا العنصر بنوع التعليمات والموارد التي ستظهر في SPIR-V، مما يحدد ما إذا كان الشيدر سيحتاج إلى صور أو عينات أو واجهات مرحلة يجب أن يطابقها Vulkan.';
  }
  if (/Built-in.*Variable|Block|Structure|Interface|Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'يرتبط هذا العنصر بمواضع الواجهة أو أنواع الموارد أو الكتل التي ينقلها SPIR-V إلى Vulkan، ولذلك يجب أن يطابق تعريفات layout ومراحل الشيدر والموارد المقابلة في التطبيق.';
  }
  return 'يرتبط هذا العنصر بعناصر اللغة التي تحدد شكل الواجهة أو الموارد أو مراحل الشيدر، ثم ينقل glslang أثره إلى SPIR-V الذي يستهلكه Vulkan.';
}

function buildGlslCompilerRoleExamples(item) {
  const name = String(item?.name || '').trim();

  if (name === 'layout') {
    return [
      {code: 'layout(location = 0)', tooltip: 'صيغة تثبت موضع واجهة صريحًا للمتغير داخل الشيدر.'},
      {code: 'layout(set = 0, binding = 1)', tooltip: 'صيغة تثبت مجموعة الواصفات ورقم الربط الخاص بالمورد داخل الشيدر.'},
      {code: 'layout(push_constant)', tooltip: 'صيغة تعلن أن الكتلة تستخدم مساحة push constants في Vulkan.'}
    ];
  }
  if (name === 'location') {
    return [
      {code: 'layout(location = 0)', tooltip: 'صيغة تثبت موضع واجهة صريحًا لمتغير يدخل في مطابقة المراحل أو التطبيق.'}
    ];
  }
  if (name === 'binding' || name === 'set') {
    return [
      {code: 'layout(set = 0, binding = 1)', tooltip: 'صيغة تثبت مجموعة الواصفات ورقم الربط للمورد بطريقة صريحة.'}
    ];
  }
  if (name === 'push_constant') {
    return [
      {code: 'layout(push_constant)', tooltip: 'صيغة تعلن أن الكتلة ستترجم على أنها مساحة push constants في Vulkan.'}
    ];
  }
  if (/^local_size_[xyz]$/.test(name)) {
    return [
      {code: 'layout(local_size_x = 16, local_size_y = 16)', tooltip: 'صيغة تثبت أبعاد مجموعة العمل المحلية داخل شيدر الحوسبة.'}
    ];
  }

  return [];
}

function renderGlslCompilerRoleSection(item) {
  const paragraphs = [
    buildGlslCompilerRoleText(item)
  ].filter(Boolean);
  const examples = buildGlslCompilerRoleExamples(item);

  return `
    ${paragraphs.map((text) => `<p>${renderGlslTechnicalProse(text)}</p>`).join('')}
    ${examples.length ? `<p><strong>أمثلة ربط صريحة:</strong> ${examples.map((entry) => renderGlslInlineCodeSnippet(entry.code, entry.tooltip)).join(' ')}</p>` : ''}
  `;
}

function getGlslRelatedEntries(item, limit = 10) {
  const seen = new Set([item?.name]);
  const aliases = (item?.aliases || [])
    .map((alias) => String(alias || '').trim())
    .filter(Boolean)
    .filter((alias) => {
      if (seen.has(alias)) return false;
      seen.add(alias);
      return true;
    })
    .map((alias) => ({type: 'alias', name: alias, label: alias}));

  const sectionMatches = (glslReferenceSections[item?.sectionKey]?.items || [])
    .filter((entry) => entry.name !== item?.name)
    .filter((entry) => {
      if (seen.has(entry.name)) return false;
      seen.add(entry.name);
      return true;
    })
    .slice(0, Math.max(0, limit - aliases.length))
    .map((entry) => ({type: 'section', name: entry.name, label: entry.displayName || entry.name}));

  return [...aliases, ...sectionMatches].slice(0, limit);
}

function buildSdl3ReferenceTooltipUncached(item) {
  if (!item) {
    return '';
  }

  const override = SDL3_TOOLTIP_CONTENT_OVERRIDES[String(item.name || '').trim()] || null;
  const profile = buildSdl3OperationalProfile(item);
  const exactType = getSdl3ExactElementTypeInfo(item);
  const compactOperation = sanitizeTooltipText(override?.actualOperation || buildSdl3ActualOperation(item) || '');
  const reasonExists = sanitizeTooltipText(override?.reasonExists || profile?.why || '');
  const compactBenefit = sanitizeTooltipText(override?.whyUse || override?.benefit || buildSdl3PracticalBenefitDetailed(item) || '');
  const meaning = sanitizeTooltipText(override?.meaning || profile?.meaning || buildSdl3PrimaryMeaning(item));
  const fallbackUsage = sanitizeTooltipText(override?.usage || buildSdl3UsageHint(item));
  const usageContext = compactSdl3TooltipGuidance(override?.usageContext || override?.when || profile?.when || buildSdl3WhenToUseHint(item), 150);
  const commonMistake = compactSdl3TooltipGuidance(override?.misuse || buildSdl3MissingOrMisuseImpact(item), 170);

  return composeSemanticTooltip({
    title: item.name,
    kindLabel: exactType.arabic || 'عنصر SDL3',
    typeLabel: exactType.display || exactType.arabic || 'عنصر SDL3',
    library: item.packageDisplayName || item.packageName || 'SDL3',
    meaning,
    whyExists: reasonExists,
    whyUse: compactBenefit || fallbackUsage,
    actualUsage: compactOperation || usageContext,
    warning: commonMistake,
    extra: item.referenceName ? [`المرجع المرتبط ${item.referenceName}`] : []
  }) || buildSdl3ShortReferenceTooltip(item);
}

function compactSdl3TooltipGuidance(text = '', maxLength = 160) {
  const clean = sanitizeTooltipText(text).replace(/\s+/g, ' ').trim();
  if (!clean) {
    return '';
  }

  const sentenceMatch = clean.match(/^(.+?[.؟!])(?:\s|$)/);
  const sentence = String(sentenceMatch ? sentenceMatch[1] : clean)
    .replace(/[.؟!]+$/g, '')
    .trim();

  if (!sentence) {
    return '';
  }

  if (sentence.length <= maxLength) {
    return sentence;
  }

  const sliced = sentence.slice(0, Math.max(0, maxLength - 1));
  const safeBoundary = Math.max(
    sliced.lastIndexOf(' '),
    sliced.lastIndexOf('،'),
    sliced.lastIndexOf('؛')
  );
  const output = safeBoundary > 60 ? sliced.slice(0, safeBoundary) : sliced;
  return `${output.trim()}…`;
}

function extractSdl3TooltipFieldText(rawTooltip = '', label = '') {
  const source = String(rawTooltip || '');
  const target = String(label || '').trim();
  if (!source || !target) {
    return '';
  }

  const line = source
    .split(/\n+/)
    .map((entry) => String(entry || '').trim())
    .find((entry) => entry.startsWith(`${target}:`));

  return line ? line.replace(new RegExp(`^${target}:\\s*`), '').trim() : '';
}

function normalizeSdl3TooltipSemanticKey(text) {
  return sanitizeTooltipText(normalizeSdl3ArabicTechnicalProse(text))
    .replace(/[.,:;!?،؛()[\]{}"'`]/g, ' ')
    .replace(/\b(?:هذا|هذه|ذلك|تلك|هو|هي|عنصر|كيان|محلي|داخل|ضمن|من|في|على|إلى|أو|له|لها|يمكنك|استخدامه|استخدامها|لاحقًا|لاحقا|حاليًا|حاليا|نفسه|نفسها)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getSdl3TooltipTypeLead(exactType) {
  const key = exactType?.key || '';
  const map = {
    function: 'دالة',
    'property-macro': 'ماكرو مفتاح خاصية',
    'function-like-macro': 'ماكرو شبيه بالدالة',
    'conditional-macro': 'ماكرو شرطي',
    macro: 'ماكرو',
    constant: 'ثابت',
    'flag-value': 'قيمة راية',
    enum: 'تعداد',
    flag: 'نوع رايات',
    callback: 'رد نداء',
    handle: 'مقبض معتم',
    struct: 'بنية',
    'flag-typedef': 'نوع رايات',
    typedef: 'اسم نوع بديل',
    type: 'نوع',
    entity: 'عنصر'
  };
  return map[key] || exactType?.arabic || 'عنصر';
}

function isLowValueSdl3ReferenceTooltipText(text, item = null) {
  const clean = sanitizeTooltipText(normalizeSdl3ArabicTechnicalProse(text)).replace(/\s+/g, ' ').trim();
  if (!clean) {
    return true;
  }

  const blockedPatterns = [
    /له شرح محلي داخل المشروع/,
    /كيان من SDL3/,
    /عنصر من SDL3/,
    /مرتبط بـ/,
    /يمكنك استخدامه لاحقًا داخل SDL3/,
    /من SDL3 أو من كائن قائم/,
    /تستخدمه لأن SDL3 يبني عليه/,
    /^هذا الماكرو يثبت القيمة\b/
  ];
  if (blockedPatterns.some((pattern) => pattern.test(clean))) {
    return true;
  }

  if (item) {
    const candidateKey = normalizeSdl3TooltipSemanticKey(clean);
    const nameKey = normalizeSdl3TooltipSemanticKey(buildSdl3NameMeaning(item));
    const officialKey = normalizeSdl3TooltipSemanticKey(buildSdl3OfficialDescription(item));
    if (candidateKey && nameKey && candidateKey === nameKey && officialKey && officialKey !== nameKey) {
      return true;
    }
  }

  return false;
}

function finalizeSdl3ShortReferenceTooltip(text, item, exactType) {
  let clean = sanitizeTooltipText(normalizeSdl3ArabicTechnicalProse(text || ''))
    .replace(/^(?:الوصف الرسمي(?: بالعربي)?|المعنى الحقيقي|المعنى|التعريف)\s*:\s*/g, '')
    .replace(/^Please refer to .*$/i, '')
    .replace(/\s*يمكنك استخدامه لاحقًا داخل SDL3\.?/g, '')
    .replace(/\s*من SDL3 أو من كائن قائم\.?/g, '')
    .replace(/\s*بعد الانتهاء منه\.?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return '';
  }

  const sentenceMatch = clean.match(/^(.+?[.؟!])(?:\s|$)/);
  clean = (sentenceMatch ? sentenceMatch[1] : clean).trim();

  clean = clean
    .replace(/^هذه الدالة\b/, 'دالة')
    .replace(/^هذا الماكرو\b/, 'ماكرو')
    .replace(/^هذا الثابت\b/, 'ثابت')
    .replace(/^هذه القيمة\b/, exactType?.key === 'flag-value' ? 'قيمة راية' : 'قيمة')
    .replace(/^هذا النوع\b/, getSdl3TooltipTypeLead(exactType))
    .replace(/^هذه البنية\b/, 'بنية')
    .replace(/^هذا الرد\b/, 'رد نداء')
    .replace(/^عنصر يصف\b/, 'يصف')
    .replace(/^عنصر يمثل\b/, 'يمثل')
    .replace(/^عنصر\b/, '')
    .replace(/[.؟!]+$/g, '')
    .trim();

  const lead = getSdl3TooltipTypeLead(exactType);
  if (exactType?.key === 'function' && /^ي[^\s]+/.test(clean)) {
    clean = `دالة ت${clean.slice(1)}`;
  }
  if (exactType?.key === 'struct' && /^ي[^\s]+/.test(clean)) {
    clean = `بنية ت${clean.slice(1)}`;
  }

  if (!new RegExp(`^(?:${lead}|دالة|بنية|تعداد|ثابت|ماكرو|رد نداء|مقبض|نوع|اسم نوع بديل|نوع رايات|قيمة راية)(?:\\s|$)`).test(clean)) {
    clean = `${lead} ${clean}`;
  }

  if (isLowValueSdl3ReferenceTooltipText(clean, item)) {
    return '';
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 18) {
    clean = words.slice(0, 18).join(' ').replace(/[،؛:\s]+$/g, '').trim();
  }

  return /[.؟!]$/.test(clean) ? clean : `${clean}.`;
}

function buildSdl3ShortReferenceTooltip(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const baseCandidates = [
    extractSdl3TooltipFieldText(item?.syntheticTooltip || '', 'المعنى الحقيقي'),
    extractSdl3TooltipFieldText(item?.syntheticTooltip || '', 'المعنى'),
  ];
  const candidates = item?.kind === 'function'
    ? [
      ...baseCandidates,
      buildSdl3OfficialDescription(item),
      buildSdl3FunctionMeaning(item),
      buildSdl3PrimaryMeaning(item),
      buildSdl3NameMeaning(item)
    ]
    : item?.kind === 'type'
      ? [
        ...baseCandidates,
        buildSdl3TypeMeaning(item),
        buildSdl3OfficialDescription(item),
        buildSdl3PrimaryMeaning(item),
        buildSdl3NameMeaning(item)
      ]
      : item?.kind === 'macro'
        ? [
          ...baseCandidates,
          buildSdl3MacroMeaning(item),
          buildSdl3OfficialDescription(item),
          buildSdl3PrimaryMeaning(item),
          buildSdl3NameMeaning(item)
        ]
        : [
          ...baseCandidates,
          buildSdl3PrimaryMeaning(item),
          buildSdl3OfficialDescription(item),
          buildSdl3NameMeaning(item)
        ];

  for (const candidate of candidates) {
    const tooltip = finalizeSdl3ShortReferenceTooltip(candidate, item, exactType);
    if (tooltip) {
      return tooltip;
    }
  }

  const fallbackLead = getSdl3TooltipTypeLead(exactType);
  const packageName = item?.packageDisplayName || item?.packageName || 'SDL3';
  return `${fallbackLead} من ${packageName}.`;
}

function getSdl3SectionCodicon(sectionKey) {
  const map = {
    api: 'command',
    image: 'file',
    mixer: 'macro',
    font: 'variable'
  };
  return map[sectionKey] || 'sdl3';
}

function renderSdl3StaticChip(text, label = '') {
  const content = label || text;
  return `<span class="related-link related-link-static" data-tooltip="${escapeAttribute(content)}" tabindex="0" aria-label="${escapeAttribute(content)}">${escapeHtml(content)}</span>`;
}


function renderTutorialConstantsSection(lessonData) {
  return callReferenceInsightsRuntime('renderTutorialConstantsSection', [lessonData], () => '');
}

function renderEntityRelatedConstantsSection(item, kind = 'entity') {
  return callReferenceInsightsRuntime('renderEntityRelatedConstantsSection', [item, kind], () => '');
}



let tutorialContent = window.__ARABIC_VULKAN_TUTORIALS__?.tutorialContent || {};

let vulkanFileSections = {};

let fileReferenceOverrides = {};

function inferFileCategoryLabel(fileName, sectionKey) {
  if (sectionKey === 'utility') return 'utility';
  if (fileName === 'vulkan.h') return 'الرئيسي';
  if (fileName === 'vulkan_core.h') return 'النواة';
  if (fileName.endsWith('.cppm')) return 'C++ Modules';
  if (fileName.endsWith('.hpp')) return 'C++ / HPP';
  if (/win32|android|wayland|xlib|xcb|metal|macos|ios|screen|directfb|fuchsia|ggp|ohos|vi/.test(fileName)) return 'منصات';
  if (/vk_/.test(fileName)) return 'مساعدات';
  return 'عام';
}

function inferFileDescription(fileName, sectionKey) {
  if (sectionKey === 'utility') {
    return `ملف مساعدة ضمن ${vulkanFileSections.utility.path} يضيف طبقة خدمية فوق تعريفات Vulkan الأساسية لتبسيط مهام متكررة أو داخلية.`;
  }
  if (fileName === 'vulkan_beta.h') return 'يجمع تعريفات وامتدادات Vulkan التجريبية أو غير المستقرة بعد، ويستخدم عند تجربة الميزات بيتا.';
  if (fileName === 'vulkan_profiles.hpp') return 'يعرض تعريفات مرتبطة بـ Vulkan Profiles في صياغة C++ للمطابقة مع ملفات التعريف والقدرات.';
  if (fileName === 'vulkan_layer_settings.hpp') return 'يوفر تعريفات إعدادات الطبقات في واجهة C++ لتكوين Validation Layers وأدوات التشخيص.';
  if (fileName === 'vulkan_extension_inspection.hpp') return 'يعرض أدوات C++ لفحص الامتدادات المتاحة ومقارنتها وتحديد ما يدعمه المثيل أو الجهاز.';
  if (fileName === 'vulkan_format_traits.hpp') return 'يوفر خصائص C++ مرتبطة بتنسيقات VkFormat مثل عدد المكونات ونوع القناة.';
  if (fileName === 'vulkan_hash.hpp') return 'يعرف hash helpers لاستخدام أنواع Vulkan-Hpp داخل حاويات STL مثل unordered_map.';
  if (fileName === 'vulkan_shared.hpp') return 'يجمع تعريفات أو أسس مشتركة تستخدمها ملفات Vulkan-Hpp الأخرى.';
  if (fileName === 'vulkan_static_assertions.hpp') return 'يحتوي على static assertions لضمان توافق التراكيب والافتراضات بين تعريفات Vulkan-Hpp وواجهة Vulkan.';
  if (fileName === 'vulkan_to_string.hpp') return 'يوفر تحويلات نصية لكثير من أنواع Vulkan-Hpp لتسهيل الطباعة والتشخيص.';
  return `ترويسة ${fileName} ضمن مجلد ${vulkanFileSections.headers.path} وتغطي جزءاً محدداً من واجهة Vulkan أو إحدى طبقاتها أو امتداداتها أو واجهات C++ الخاصة بها.`;
}

function inferFileIncludes(fileName, sectionKey) {
  const override = fileReferenceOverrides[fileName];
  if (override?.includes) return override.includes;
  if (sectionKey === 'utility') return [];
  if (fileName !== 'vulkan.h' && /^vulkan_.*\.h$/.test(fileName)) return ['vulkan.h'];
  if (fileName.endsWith('.hpp') || fileName.endsWith('.cppm')) return ['vulkan/vulkan.h'];
  return [];
}

function inferFileKeyItems(fileName, sectionKey) {
  const override = fileReferenceOverrides[fileName];
  if (override?.keyItems) return override.keyItems;
  if (sectionKey === 'utility') return ['VkInstance', 'VkDevice', 'VkResult'];
  if (fileName === 'vulkan_video.hpp') return ['VkVideoSessionKHR', 'VkVideoSessionParametersKHR'];
  if (fileName === 'vulkan_beta.h') return ['VkStructureType', 'VkResult'];
  if (fileName.endsWith('.hpp')) return ['VkInstance', 'VkDevice', 'VkResult'];
  if (fileName.endsWith('.h')) return ['VkInstance', 'VkDevice', 'vkCreateInstance'];
  return ['VkInstance', 'VkDevice'];
}

function inferFileUsage(fileName, sectionKey) {
  const override = fileReferenceOverrides[fileName];
  if (override?.usage) return override.usage;
  if (sectionKey === 'utility') {
    return `استخدم ${fileName} عندما تحتاج الوظائف المساعدة أو البنى المساندة التي لا تأتي من النواة المباشرة لـ Vulkan لكنها تسهل بناء الأدوات أو الطبقات أو الشيفرات المساندة.`;
  }
  if (fileName.endsWith('.cppm')) {
    return `استخدم ${fileName} إذا كان مشروعك يعتمد C++ Modules بدلاً من تضمين الترويسات التقليدية.`;
  }
  if (fileName.endsWith('.hpp')) {
    return `استخدم ${fileName} عندما تبني التطبيق بواجهة Vulkan-Hpp وتريد أصناف C++ وواجهاتها الحديثة بدلاً من الواجهة C المباشرة.`;
  }
  return `استخدم ${fileName} عندما تحتاج الجزء الذي يغطيه هذا الملف من واجهة Vulkan بدلاً من الاكتفاء بالترويسة العامة وحدها.`;
}

function inferFileExample(fileName, sectionKey) {
  const override = fileReferenceOverrides[fileName];
  if (override?.example) return override.example;
  const includePath = sectionKey === 'utility' ? `vulkan/utility/${fileName}` : `vulkan/${fileName}`;
  if (fileName.endsWith('.cppm')) {
    return `import ${fileName.replace(/\.cppm$/,'')};`;
  }
  return `#include <${includePath}>`;
}

function buildFileReferenceData() {
  const data = {};
  Object.entries(vulkanFileSections).forEach(([sectionKey, section]) => {
    section.files.forEach((fileName) => {
      const override = fileReferenceOverrides[fileName] || {};
      data[fileName] = {
        sectionKey,
        sectionTitle: section.title,
        sectionPath: section.path,
        path: `${section.path}/${fileName}`,
        category: inferFileCategoryLabel(fileName, sectionKey),
        description: override.description || inferFileDescription(fileName, sectionKey),
        includes: inferFileIncludes(fileName, sectionKey),
        keyItems: inferFileKeyItems(fileName, sectionKey),
        usage: override.usage || inferFileUsage(fileName, sectionKey),
        example: override.example || inferFileExample(fileName, sectionKey)
      };
    });
  });
  return data;
}

let fileReferenceData = buildFileReferenceData();
function getStaticFilePageUrl(fileName) {
  return getFileSourceViewerRuntime()?.getStaticFilePageUrl?.(fileName)
    || `pages/files/${encodeURIComponent(fileName)}.html`;
}

function getServedFileRelativePath(fileName) {
  const resolvedPath = getFileSourceViewerRuntime()?.getServedFileRelativePath?.(fileName);
  if (resolvedPath) {
    return resolvedPath;
  }

  const file = fileReferenceData[fileName];
  if (!file) {
    return '';
  }

  return file.sectionKey === 'utility'
    ? `sdk_include/vulkan/utility/${fileName}`
    : `sdk_include/vulkan/${fileName}`;
}

function renderLazyFileSourceSection(fileName) {
  return getFileSourceViewerRuntime()?.renderLazyFileSourceSection?.(fileName) || '';
}

function initLazyFileSourceViewers(root = document) {
  getFileSourceViewerRuntime()?.initLazyFileSourceViewers?.(root);
}

// ==================== تحميل البيانات ====================
function applyImguiStaticData(staticData = {}) {
  if (staticData.tooltips) {
    imguiStaticTooltips = {...staticData.tooltips};
  }
  if (staticData.kindMeta) {
    imguiKindMeta = {...staticData.kindMeta};
  }
  if (staticData.sectionIcons) {
    imguiSectionIconMap = {...staticData.sectionIcons};
  }
}

function resetClickNavigationDerivedCaches() {
  clearCategoryLookupCaches();
  vulkanConstantsRuntime?.resetConstantReferenceCaches?.();
  commandItemsCache.value = null;
  variableTypeItemLookupCache = null;
  usageBridgeFieldOwnersCache = null;
  usageBridgeExampleVariableIndexCache.clear();
}

const populateVariablesList = (...args) => vulkanSidebarRuntime?.populateVariablesList?.(...args);
const populateStructuresList = (...args) => vulkanSidebarRuntime?.populateStructuresList?.(...args);
const bindStructureNavItems = (...args) => vulkanSidebarRuntime?.bindStructureNavItems?.(...args);
const openStructureNavItem = (...args) => vulkanSidebarRuntime?.openStructureNavItem?.(...args);
const populateEnumsList = (...args) => vulkanSidebarRuntime?.populateEnumsList?.(...args);
const populateTutorialsList = (...args) => vulkanSidebarRuntime?.populateTutorialsList?.(...args);
const populateVulkanExamplesList = (...args) => vulkanSidebarRuntime?.populateVulkanExamplesList?.(...args);
const toggleVulkanExampleGroup = (...args) => vulkanSidebarRuntime?.toggleVulkanExampleGroup?.(...args);
const populateFilesList = (...args) => vulkanSidebarRuntime?.populateFilesList?.(...args);

function getVariableTypeCollections() {
  const structures = vulkanData.structures || {};
  return {
    handles: structures.handles || {title: 'المقابض', items: []},
    function_pointers: structures.function_pointers || {title: 'مؤشرات الدوال', items: []},
    scalar_types: structures.scalar_types || {title: 'الأنواع الأساسية', items: []}
  };
}

function countVariableItems() {
  return Object.values(getVariableTypeCollections()).reduce((total, category) => {
    return total + ((category.items || []).length);
  }, 0);
}

function findStructureCollectionKey(name) {
  for (const [key, category] of Object.entries(vulkanData.structures || {})) {
    if ((category.items || []).some((item) => item.name === name)) {
      return key;
    }
  }
  return '';
}

function isVariableStructureItem(name) {
  const key = findStructureCollectionKey(name);
  return key === 'handles' || key === 'function_pointers' || key === 'scalar_types'
    || buildSyntheticTypeItem(name)?.syntheticGroup === 'variable';
}

function escapeSelectorValue(value) {
  if (window.CSS && typeof window.CSS.escape === 'function') {
    return window.CSS.escape(value);
  }

  return String(value).replace(/["\\]/g, '\\$&');
}

// ==================== عرض الدروس التعليمية ====================
function renderTutorialLeadMedia(tutorialId, tutorial = null) {
  return getTutorialSupportRuntime()?.renderTutorialLeadMedia?.(tutorialId, tutorial) || '';
}

function openSectionVideoModal(scopeId) {
  return getTutorialSupportRuntime()?.openSectionVideoModal?.(scopeId) || false;
}

function closeSectionVideoModal(scopeId) {
  return getTutorialSupportRuntime()?.closeSectionVideoModal?.(scopeId) || false;
}

function closeActiveSectionVideoModal() {
  return getTutorialSupportRuntime()?.closeActiveSectionVideoModal?.() || false;
}

function handleSectionVideoModalBackdrop(event, scopeId) {
  return getTutorialSupportRuntime()?.handleSectionVideoModalBackdrop?.(event, scopeId) ?? true;
}

function openSectionVideoExternal(scopeId) {
  return getTutorialSupportRuntime()?.openSectionVideoExternal?.(scopeId) || false;
}

function closeTutorialVideoModal() {
  return getTutorialSupportRuntime()?.closeTutorialVideoModal?.() || false;
}

async function showTutorial(tutorialId, options = {}) {
  await ensureUiSegment('tutorialSupportRuntime');
  await ensureUiSegment('generalDetailPagesRuntime');
  return getGeneralDetailPagesRuntime()?.showTutorial?.(tutorialId, options);
}

// ==================== التنقل بين الدروس ====================
function getTutorialOrder() {
  return tutorialCatalog.map((tutorial) => tutorial.id);
}

function showTutorialPrev(currentId) {
  const tutorialOrder = getTutorialOrder();
  const currentIndex = tutorialOrder.indexOf(currentId);
  if (currentIndex > 0) {
    showTutorial(tutorialOrder[currentIndex - 1]);
  }
}

function showTutorialNext(currentId) {
  const tutorialOrder = getTutorialOrder();
  const currentIndex = tutorialOrder.indexOf(currentId);
  if (currentIndex < tutorialOrder.length - 1) {
    showTutorial(tutorialOrder[currentIndex + 1]);
  }
}

async function showTutorialsIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showTutorialsIndex?.(options);
}

// ==================== عرض الملفات ====================
async function showFile(fileName, options = {}) {
  await ensureUiSegment('fileSourceViewerRuntime');
  await ensureUiSegment('generalDetailPagesRuntime');
  return getGeneralDetailPagesRuntime()?.showFile?.(fileName, options);
}

async function showFilesIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showFilesIndex?.(options);
}

// البيانات الاحتياطية
// ==================== الصفحة الرئيسية ====================
function getHomePageRuntime() {
  return window.__ARABIC_VULKAN_HOME_PAGE__ || null;
}

function getReferenceRuntime() {
  return window.__ARABIC_VULKAN_REFERENCE_RUNTIME__ || null;
}

function getIndexPagesRuntime() {
  return window.__ARABIC_VULKAN_INDEX_PAGES__ || null;
}

function getVulkanValuePagesRuntime() {
  return window.__ARABIC_VULKAN_VALUE_PAGES__ || null;
}

function getVulkanReferencePagesRuntime() {
  return window.__ARABIC_VULKAN_REFERENCE_PAGES__ || null;
}

function getGeneralDetailPagesRuntime() {
  return window.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__ || null;
}

function getCppReferenceUtilsRuntime() {
  return window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
}

function getTutorialSupportRuntime() {
  return window.__ARABIC_VULKAN_TUTORIAL_SUPPORT__ || null;
}

function getFileSourceViewerRuntime() {
  return window.__ARABIC_VULKAN_FILE_SOURCE_VIEWER__ || null;
}

const imguiSectionRuntime = window.__ARABIC_VULKAN_IMGUI_SECTION__ || null;
const sdl3SectionRuntime = window.__ARABIC_VULKAN_SDL3_SECTION__ || null;

function formatHomeCount(value) {
  const runtime = getHomePageRuntime();
  return runtime?.formatHomeCount ? runtime.formatHomeCount(value) : '—';
}

function getHomeLibrarySectionId(key) {
  const runtime = getHomePageRuntime();
  return runtime?.getHomeLibrarySectionId
    ? runtime.getHomeLibrarySectionId(key)
    : `home-library-${String(key || '').trim()}`;
}

function scrollToHomeLibrarySection(key) {
  getHomePageRuntime()?.scrollToHomeLibrarySection?.(key);
}

async function showGlslHomeSection(sectionKey = '') {
  await showGlslIndex();
  if (!sectionKey) {
    return;
  }
  setTimeout(() => {
    scrollToAnchor(`glsl-section-${sectionKey}`);
  }, 40);
}

function escapeRegexText(text = '') {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getImguiSectionIcon(sectionKey = '') {
  return imguiSectionIconMap[sectionKey] || 'imgui';
}

function getImguiKindMeta(kind = '') {
  return imguiKindMeta[kind] || {label: 'عنصر', plural: 'العناصر', icon: 'imgui'};
}

function getCmakeKindMeta(kind = '') {
  return CMAKE_KIND_META[kind] || {label: 'عنصر CMake', plural: 'عناصر CMake', icon: 'file'};
}

function getCmakeSectionMeta(sectionKey = '') {
  return (cmakeSearchMeta?.sections || []).find((section) => section.key === sectionKey) || null;
}

function getCmakeEntriesByKind(kind = '') {
  return cmakeSearchEntries.filter((entry) => entry.kind === kind);
}

function findCmakeSearchEntryByName(rawName = '', preferredKind = '') {
  const name = String(rawName || '').trim();
  const kind = String(preferredKind || '').trim();
  if (!name || !cmakeSearchEntries.length) {
    return null;
  }

  const matchesEntry = (entry) => {
    if (!entry) {
      return false;
    }
    if (kind && entry.kind !== kind) {
      return false;
    }
    if (entry.name === name || entry.displayName === name || entry.slug === name) {
      return true;
    }
    return Array.isArray(entry.aliases) && entry.aliases.includes(name);
  };

  return cmakeSearchEntries.find(matchesEntry) || null;
}

function parseCmakeDefineToken(rawToken = '') {
  const match = /^-D([A-Za-z_][A-Za-z0-9_]*)(?:=(.*))?$/.exec(String(rawToken || '').trim());
  if (!match) {
    return null;
  }
  return {
    variableName: match[1],
    assignedValue: typeof match[2] === 'string' ? match[2] : ''
  };
}

function getCmakeReferenceAlias(rawName = '') {
  const name = String(rawName || '').trim();
  if (!name) {
    return null;
  }

  if (/^[A-Za-z0-9_.+-]+Config(?:Version)?\.cmake$/i.test(name)) {
    return {
      targetName: 'package config files and Config mode',
      label: name
    };
  }

  const buildKeywordAlias = (targetName, tokenName = name) => {
    const info = getCmakeSemanticTokenInfo(tokenName, {contextLabel: `صياغة ${targetName}`});
    return {
      targetName,
      label: tokenName,
      anchorId: getCanonicalReferenceDetailAnchorId('parameters', tokenName),
      tooltip: info ? buildCmakeSemanticTooltip(tokenName, info, {contextLabel: `صياغة ${targetName}`}) : '',
      relationKind: 'cmakeParameter',
      iconType: 'command'
    };
  };

  const keywordAliasMap = {
    APPEND: 'list',
    IN: 'foreach',
    LISTS: 'foreach',
    STATUS: 'message',
    FATAL_ERROR: 'message',
    VERSION: 'project',
    LANGUAGES: 'project',
    CXX: 'project',
    REQUIRED: 'find_package',
    COMPONENTS: 'find_package',
    REQUIRED_VARS: 'FindPackageHandleStandardArgs',
    QUIET: 'FindPackageHandleStandardArgs',
    CONFIG: 'find_package',
    ON: 'option',
    OFF: 'option',
    Debug: 'CMAKE_BUILD_TYPE',
    SameMajorVersion: 'CMakePackageConfigHelpers'
  };
  if (keywordAliasMap[name]) {
    return buildKeywordAlias(keywordAliasMap[name], name);
  }

  const aliasMap = {
    PUBLIC: {targetName: 'PUBLIC/PRIVATE/INTERFACE', label: 'PUBLIC'},
    PRIVATE: {targetName: 'PUBLIC/PRIVATE/INTERFACE', label: 'PRIVATE'},
    INTERFACE: {targetName: 'PUBLIC/PRIVATE/INTERFACE', label: 'INTERFACE'},
    BUILD_INTERFACE: {targetName: 'Generator Expressions', label: 'BUILD_INTERFACE'},
    INSTALL_INTERFACE: {targetName: 'Generator Expressions', label: 'INSTALL_INTERFACE'},
    'cache variables': {targetName: 'cache variables', label: 'cache variables'},
    'Cache Variables': {targetName: 'cache variables', label: 'Cache Variables'},
    'generator expressions': {targetName: 'Generator Expressions', label: 'generator expressions'},
    'Generator expressions': {targetName: 'Generator Expressions', label: 'Generator expressions'},
    'directory scope': {targetName: 'directory scope and add_subdirectory', label: 'directory scope'},
    'Directory scope': {targetName: 'directory scope and add_subdirectory', label: 'Directory scope'},
    ctest: {targetName: 'CTest', label: 'ctest'},
    'Config mode': {targetName: 'find_package', label: 'Config mode'},
    'module mode': {targetName: 'find_package', label: 'module mode'},
    'imported targets': {targetName: 'targets and usage requirements', label: 'imported targets'},
    write_basic_package_version_file: {targetName: 'CMakePackageConfigHelpers', label: 'write_basic_package_version_file'},
    configure_package_config_file: {targetName: 'CMakePackageConfigHelpers', label: 'configure_package_config_file'},
    find_package_handle_standard_args: {targetName: 'FindPackageHandleStandardArgs', label: 'find_package_handle_standard_args'}
  };

  return aliasMap[name] || null;
}

function getCmakeReferenceEntityContext(options = {}) {
  return options.referenceEntity || options.currentEntity || null;
}

function buildCmakeEntryTooltip(entry) {
  if (!entry) {
    return composeSemanticTooltip({
      title: 'CMake',
      kindLabel: 'مرجع CMake',
      typeLabel: 'عنصر بناء',
      library: 'CMake',
      meaning: 'مرجع محلي يشرح أوامر CMake ومتغيراته وخصائصه ومسار البناء العملي.',
      whyExists: 'وُجد لربط CMake Tutorial والمرجع الرسمي بصفحات عربية داخل المشروع نفسه.',
      whyUse: 'يفيد عندما تريد الانتقال من المفهوم إلى سطر CMakeLists.txt المناسب بسرعة.',
      actualUsage: 'يظهر في البحث والشريط الجانبي وروابط المرجع المعياري المحلي.'
    });
  }

  const kindMeta = getCmakeKindMeta(entry.kind);
  return composeSemanticTooltip({
    title: entry.name,
    kindLabel: 'مرجع CMake',
    typeLabel: kindMeta.label,
    library: 'CMake',
    meaning: entry.meaning || entry.description || '',
    whyExists: entry.purpose || entry.titleArabic || '',
    whyUse: entry.whyUse || '',
    actualUsage: entry.carriedValue || entry.description || ''
  });
}

const GENERIC_CANONICAL_REFERENCE_KIND_META = Object.freeze({
  functions: {label: 'دالة', plural: 'الدوال', icon: 'command'},
  commands: {label: 'أمر', plural: 'الأوامر', icon: 'command'},
  structures: {label: 'بنية', plural: 'البنى', icon: 'structure'},
  unions: {label: 'اتحاد', plural: 'الاتحادات', icon: 'structure'},
  variables: {label: 'متغير', plural: 'المتغيرات', icon: 'variable'},
  types: {label: 'نوع', plural: 'الأنواع', icon: 'structure'},
  enums: {label: 'تعداد', plural: 'التعدادات', icon: 'enum'},
  constants: {label: 'ثابت', plural: 'الثوابت', icon: 'constant'},
  macros: {label: 'ماكرو', plural: 'الماكرو', icon: 'macro'},
  headers: {label: 'ترويسة', plural: 'ملفات الترويسة', icon: 'file'},
  directives: {label: 'توجيه', plural: 'التوجيهات', icon: 'macro'},
  qualifiers: {label: 'محدد', plural: 'المحددات', icon: 'variable'},
  builtins: {label: 'عنصر مضمن', plural: 'العناصر المضمنة', icon: 'variable'},
  blocks: {label: 'كتلة', plural: 'الكتل', icon: 'structure'},
  'control-flow': {label: 'تحكم في التدفق', plural: 'عناصر التحكم في التدفق', icon: 'command'},
  expressions: {label: 'تعبير', plural: 'التعبيرات', icon: 'macro'},
  misc: {label: 'عنصر', plural: 'العناصر', icon: 'file'},
  properties: {label: 'خاصية', plural: 'الخصائص', icon: 'variable'},
  modules: {label: 'وحدة', plural: 'الوحدات', icon: 'file'},
  policies: {label: 'سياسة', plural: 'السياسات', icon: 'enum'},
  presets: {label: 'ضبطة مسبقة', plural: 'الضبطات المسبقة', icon: 'file'},
  concepts: {label: 'مفهوم', plural: 'المفاهيم', icon: 'tutorial'},
  examples: {label: 'مثال', plural: 'الأمثلة', icon: 'tutorial'}
});

const CANONICAL_REFERENCE_LIBRARY_LABELS = Object.freeze({
  cmake: 'CMake',
  vulkan: 'Vulkan',
  imgui: 'Dear ImGui',
  glslang: 'GLSLang',
  'sdl3-core': 'SDL3',
  'sdl3-image': 'SDL3_image',
  'sdl3-mixer': 'SDL3_mixer',
  'sdl3-ttf': 'SDL3_ttf'
});

const CANONICAL_REFERENCE_LIBRARY_ICON_TYPES = Object.freeze({
  cmake: 'file',
  vulkan: 'file',
  imgui: 'imgui',
  glslang: 'glsl',
  'sdl3-core': 'sdl3',
  'sdl3-image': 'sdl3',
  'sdl3-mixer': 'sdl3',
  'sdl3-ttf': 'sdl3'
});

function getCanonicalReferenceLibraryLabel(libraryId = '') {
  const normalizedLibraryId = String(libraryId || '').trim();
  return CANONICAL_REFERENCE_LIBRARY_LABELS[normalizedLibraryId] || normalizedLibraryId || 'هذه المكتبة';
}

function getCanonicalReferenceLibraryIconType(libraryId = '') {
  const normalizedLibraryId = String(libraryId || '').trim();
  return CANONICAL_REFERENCE_LIBRARY_ICON_TYPES[normalizedLibraryId] || 'file';
}

function getGenericCanonicalReferenceKindMeta(kindId = '') {
  return GENERIC_CANONICAL_REFERENCE_KIND_META[String(kindId || '').trim()] || {label: 'عنصر مرجعي', plural: 'عناصر مرجعية', icon: 'file'};
}

function getCanonicalImguiKindMeta(kindId = '') {
  const normalizedKindId = String(kindId || '').trim();
  const map = {
    functions: getImguiKindMeta('function'),
    enums: getImguiKindMeta('enum'),
    macros: getImguiKindMeta('macro'),
    types: getImguiKindMeta('type'),
    misc: getImguiKindMeta('type')
  };
  return map[normalizedKindId] || getGenericCanonicalReferenceKindMeta(normalizedKindId);
}

function getCanonicalSdl3KindMeta(kindId = '') {
  const normalizedKindId = String(kindId || '').trim();
  if (typeof getSdl3CollectionMeta === 'function') {
    if (normalizedKindId === 'structures' || normalizedKindId === 'variables') {
      const meta = getSdl3CollectionMeta(normalizedKindId);
      return {
        ...meta,
        label: meta.singular || meta.title || 'عنصر SDL3',
        plural: meta.title || meta.plural || 'عناصر SDL3'
      };
    }
    if (['functions', 'types', 'enums', 'constants', 'macros'].includes(normalizedKindId)) {
      const meta = getSdl3CollectionMeta(normalizedKindId);
      return {
        ...meta,
        label: meta.singular || meta.title || 'عنصر SDL3',
        plural: meta.title || meta.plural || 'عناصر SDL3'
      };
    }
  }
  return getGenericCanonicalReferenceKindMeta(normalizedKindId);
}

function getCanonicalGlslKindMeta(kindId = '') {
  const normalizedKindId = String(kindId || '').trim();
  const map = {
    functions: {label: 'دالة GLSL', plural: 'دوال GLSL', icon: 'command'},
    directives: {label: 'توجيه GLSL', plural: 'توجيهات GLSL', icon: 'macro'},
    qualifiers: {label: 'محدد GLSL', plural: 'محددات GLSL', icon: 'variable'},
    builtins: {label: 'عنصر GLSL مضمن', plural: 'العناصر المضمنة', icon: 'variable'},
    blocks: {label: 'كتلة GLSL', plural: 'كتل GLSL', icon: 'structure'},
    types: {label: 'نوع GLSL', plural: 'أنواع GLSL', icon: 'structure'}
  };
  return map[normalizedKindId] || getGenericCanonicalReferenceKindMeta(normalizedKindId);
}

function buildCanonicalReferenceFallbackTooltip(libraryId = '', kindId = '', fallbackName = '', level = 'entity') {
  const libraryLabel = getCanonicalReferenceLibraryLabel(libraryId);
  const kindMeta = getCanonicalReferenceKindMeta(libraryId, kindId);
  if (level === 'library') {
    return composeSemanticTooltip({
      title: libraryLabel,
      kindLabel: 'فهرس مكتبة',
      typeLabel: 'مرجع محلي',
      library: libraryLabel,
      meaning: `يفتح الفهرس المحلي الكامل لمكتبة ${libraryLabel} داخل طبقة المرجع المعياري في المشروع.`,
      whyExists: `وُجد حتى يجمع أقسام ${libraryLabel} وروابطها الداخلية تحت مسار مرجعي موحد.`,
      whyUse: 'يفيد عندما تريد التنقل بين أقسام المكتبة بسرعة من دون العودة إلى مسار جانبي مختلف.',
      actualUsage: 'يظهر في بطاقات الفهارس والروابط المرتبطة داخل الصفحات المرجعية.'
    });
  }

  if (level === 'kind') {
    return composeSemanticTooltip({
      title: kindMeta.plural || kindMeta.label || 'القسم',
      kindLabel: `فهرس ${libraryLabel}`,
      typeLabel: kindMeta.plural || 'قسم مرجعي',
      library: libraryLabel,
      meaning: `يفتح هذا الرابط فهرس ${kindMeta.plural || kindMeta.label || 'العناصر'} داخل مرجع ${libraryLabel}.`,
      whyExists: `وُجد حتى تبقى عناصر ${libraryLabel} مجمعة بحسب التصنيف البرمجي لا في قائمة طويلة واحدة.`,
      whyUse: 'يفيد عندما تريد استعراض كل العناصر المتقاربة في النوع قبل فتح صفحة عنصر بعينه.',
      actualUsage: 'يظهر في صفحات المكتبة وبطاقات الفهارس والروابط الداخلية بين الأقسام.'
    });
  }

  const title = String(fallbackName || '').trim() || kindMeta.label || 'عنصر مرجعي';
  return composeSemanticTooltip({
    title,
    kindLabel: `مرجع ${libraryLabel}`,
    typeLabel: kindMeta.label || 'عنصر مرجعي',
    library: libraryLabel,
    meaning: `يفتح صفحة ${title} داخل مرجع ${libraryLabel} المحلي مع الشرح العربي والروابط المرتبطة.`,
    whyExists: 'وُجد هذا الرابط حتى تبقى القراءة داخل المشروع نفسه مع Tooltip وروابط داخلية موحدة.',
    whyUse: 'يفيد عندما تريد الانتقال مباشرة من اسم العنصر إلى صفحته بدل البحث اليدوي عنه.',
    actualUsage: 'يظهر في بطاقات الفهارس والعناصر المرتبطة والجداول المرجعية داخل الصفحات.'
  });
}

function buildCanonicalReferenceRouteAction(level = 'entity', libraryId = '', kindId = '', slug = '') {
  const safeLibraryId = escapeAttribute(String(libraryId || '').trim());
  const safeKindId = escapeAttribute(String(kindId || '').trim());
  const safeSlug = escapeAttribute(String(slug || '').trim());

  if (level === 'library') {
    if (libraryId === 'cmake') {
      return 'showCmakeIndex()';
    }
    if (libraryId === 'vulkan') {
      return 'showVulkanIndex()';
    }
    return `showReferenceLibraryIndex('${safeLibraryId}')`;
  }

  if (level === 'kind') {
    if (libraryId === 'cmake') {
      return `showCmakeKindIndex('${safeKindId}')`;
    }
    return `showReferenceKindIndex('${safeLibraryId}', '${safeKindId}')`;
  }

  if (libraryId === 'cmake') {
    return `showCmakeEntity('${safeKindId}', '${safeSlug}')`;
  }

  return `showReferenceEntity('${safeLibraryId}', '${safeKindId}', '${safeSlug}')`;
}

function resolveCanonicalVulkanEntityDescriptor(kindId = '', fallbackName = '') {
  const name = String(fallbackName || '').trim();
  if (!name) {
    return null;
  }

  if (kindId === 'functions') {
    const item = typeof findCommandItemByName === 'function' ? findCommandItemByName(name) : null;
    return {
      iconType: 'command',
      tooltip: buildTooltipText('function', item) || buildCanonicalReferenceFallbackTooltip('vulkan', kindId, name)
    };
  }

  if (kindId === 'macros') {
    const item = typeof findMacroItemByName === 'function' ? findMacroItemByName(name) : null;
    return {
      iconType: 'macro',
      tooltip: buildTooltipText('macro', item) || buildCanonicalReferenceFallbackTooltip('vulkan', kindId, name)
    };
  }

  if (kindId === 'constants') {
    const item = typeof findConstantItemByName === 'function' ? findConstantItemByName(name) : null;
    return {
      iconType: 'constant',
      tooltip: buildTooltipText('constant', item) || buildCanonicalReferenceFallbackTooltip('vulkan', kindId, name)
    };
  }

  if (kindId === 'enums') {
    const item = typeof findItemInCategories === 'function' ? findItemInCategories(vulkanData.enums, name) : null;
    return {
      iconType: 'enum',
      tooltip: buildEnumItemTooltip(item) || buildCanonicalReferenceFallbackTooltip('vulkan', kindId, name)
    };
  }

  if (kindId === 'structures' || kindId === 'variables' || kindId === 'types' || kindId === 'unions') {
    const item = typeof findTypeItemByName === 'function' ? findTypeItemByName(name) : null;
    return {
      iconType: resolveReferenceIconType(name, {iconType: getCanonicalReferenceKindMeta('vulkan', kindId).icon}) || getCanonicalReferenceKindMeta('vulkan', kindId).icon,
      tooltip: buildTooltipText('type', item) || buildCanonicalReferenceFallbackTooltip('vulkan', kindId, name)
    };
  }

  return null;
}

function resolveCanonicalSdl3EntityDescriptor(kindId = '', fallbackName = '') {
  const name = String(fallbackName || '').trim();
  if (!name || typeof findSdl3AnyItemByName !== 'function') {
    return null;
  }

  const item = findSdl3AnyItemByName(name);
  if (!item) {
    return null;
  }

  const meta = item.kind === 'type'
    ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item))
    : getSdl3KindMeta(item.kind);
  return {
    iconType: meta.icon,
    tooltip: buildSdl3ReferenceTooltip(item)
  };
}

function resolveCanonicalImguiEntityDescriptor(kindId = '', fallbackName = '') {
  const name = String(fallbackName || '').trim();
  if (!name || typeof getImguiReferenceItem !== 'function') {
    return null;
  }

  const item = getImguiReferenceItem(name);
  if (!item) {
    return null;
  }

  return {
    iconType: getImguiKindMeta(item.kind || '').icon,
    tooltip: buildImguiReferenceTooltip(item)
  };
}

function resolveCanonicalGlslEntityDescriptor(kindId = '', fallbackName = '') {
  const name = String(fallbackName || '').trim();
  if (!name || typeof getGlslReferenceItem !== 'function') {
    return null;
  }

  const item = getGlslReferenceItem(name);
  if (!item) {
    return null;
  }

  return {
    iconType: getCanonicalReferenceKindMeta('glslang', kindId || item.kind || '').icon,
    tooltip: buildGlslReferenceTooltip(item)
  };
}

function resolveCanonicalReferenceEntityDescriptor(libraryId = '', kindId = '', fallbackName = '') {
  const normalizedLibraryId = String(libraryId || '').trim();
  if (!normalizedLibraryId) {
    return null;
  }

  if (normalizedLibraryId === 'vulkan') {
    return resolveCanonicalVulkanEntityDescriptor(kindId, fallbackName);
  }
  if (normalizedLibraryId === 'imgui') {
    return resolveCanonicalImguiEntityDescriptor(kindId, fallbackName);
  }
  if (normalizedLibraryId === 'glslang') {
    return resolveCanonicalGlslEntityDescriptor(kindId, fallbackName);
  }
  if (normalizedLibraryId.startsWith('sdl3-')) {
    return resolveCanonicalSdl3EntityDescriptor(kindId, fallbackName);
  }
  return null;
}

function getCanonicalReferenceKindMeta(libraryId = '', kindId = '') {
  const normalizedLibraryId = String(libraryId || '').trim();
  const normalizedKindId = String(kindId || '').trim();
  if (normalizedLibraryId === 'cmake') {
    return getCmakeKindMeta(normalizedKindId);
  }
  if (normalizedLibraryId === 'imgui') {
    return getCanonicalImguiKindMeta(normalizedKindId);
  }
  if (normalizedLibraryId === 'glslang') {
    return getCanonicalGlslKindMeta(normalizedKindId);
  }
  if (normalizedLibraryId.startsWith('sdl3-')) {
    return getCanonicalSdl3KindMeta(normalizedKindId);
  }
  return getGenericCanonicalReferenceKindMeta(normalizedKindId);
}

function resolveCanonicalReferenceRoute(route = '', fallbackName = '') {
  const normalizedRoute = String(route || '').trim();
  const match = /^#ref\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/.exec(normalizedRoute);
  if (!match) {
    return null;
  }

  const libraryId = decodeURIComponent(match[1] || '');
  const kindId = decodeURIComponent(match[2] || '');
  const slug = decodeURIComponent(match[3] || '');
  const kindMeta = getCanonicalReferenceKindMeta(libraryId, kindId);

  if (!kindId) {
    if (libraryId === 'cmake') {
      return {
        href: normalizedRoute,
        action: 'showCmakeIndex()',
        iconType: getCanonicalReferenceLibraryIconType(libraryId),
        tooltip: buildCmakeEntryTooltip(null)
      };
    }
    return {
      href: normalizedRoute,
      action: buildCanonicalReferenceRouteAction('library', libraryId),
      iconType: getCanonicalReferenceLibraryIconType(libraryId),
      tooltip: buildCanonicalReferenceFallbackTooltip(libraryId, '', fallbackName, 'library')
    };
  }

  if (!slug) {
    if (libraryId === 'cmake') {
      const section = getCmakeSectionMeta(kindId);
      return {
        href: normalizedRoute,
        action: `showCmakeKindIndex('${escapeAttribute(kindId)}')`,
        iconType: getCmakeKindMeta(kindId).icon,
        tooltip: section ? buildCmakeSectionSidebarTooltip(section) : `${getCmakeKindMeta(kindId).plural} داخل مرجع CMake المحلي.`
      };
    }
    return {
      href: normalizedRoute,
      action: buildCanonicalReferenceRouteAction('kind', libraryId, kindId),
      iconType: kindMeta.icon || getCanonicalReferenceLibraryIconType(libraryId),
      tooltip: buildCanonicalReferenceFallbackTooltip(libraryId, kindId, fallbackName, 'kind')
    };
  }

  if (libraryId === 'cmake') {
    const entry = cmakeSearchEntries.find((item) => item.kind === kindId && item.slug === slug)
      || findCmakeSearchEntryByName(fallbackName, kindId);

    return {
      href: normalizedRoute,
      action: `showCmakeEntity('${escapeAttribute(kindId)}', '${escapeAttribute(slug)}')`,
      iconType: getCmakeKindMeta(kindId).icon,
      tooltip: buildCmakeEntryTooltip(entry)
    };
  }

  const entityDescriptor = resolveCanonicalReferenceEntityDescriptor(libraryId, kindId, fallbackName);

  return {
    href: normalizedRoute,
    action: buildCanonicalReferenceRouteAction('entity', libraryId, kindId, slug),
    iconType: entityDescriptor?.iconType || kindMeta.icon || getCanonicalReferenceLibraryIconType(libraryId),
    tooltip: entityDescriptor?.tooltip || buildCanonicalReferenceFallbackTooltip(libraryId, kindId, fallbackName, 'entity')
  };
}

function populateCmakeList() {
  const container = document.getElementById('cmake-list');
  if (!container) {
    return;
  }

  const sections = getCmakeHomeSections();
  container.innerHTML = `
    <div class="nav-item" data-nav-type="cmake-index" data-nav-name="cmake" data-tooltip="${escapeAttribute('يفتح فهرس CMake المحلي المبني من الدليل الرسمي والصفحات الرسمية المرتبطة.')}" tabindex="0" role="button">
      <span>${renderEntityIcon('file', 'ui-codicon nav-icon', 'CMake')}</span>
      <span>فهرس CMake</span>
    </div>
    ${sections.map((section) => `
      <div class="nav-section cmake-reference-kind-section collapsed">
        <div class="nav-section-header" onclick="toggleSection('cmake-${escapeAttribute(section.key)}-list')">
          <h3>${renderEntityIcon(section.iconType, 'ui-codicon nav-icon', section.title)} ${escapeHtml(section.title)} <span class="nav-section-inline-count">${Number(section.count) || 0}</span></h3>
          <span class="icon">▼</span>
        </div>
        <div id="cmake-${escapeAttribute(section.key)}-list" class="nav-items">
          <div class="nav-item" data-nav-type="cmake-kind-index" data-nav-name="${escapeAttribute(section.key)}" data-tooltip="${escapeAttribute(buildCmakeSectionSidebarTooltip(section))}" aria-label="${escapeAttribute(`${section.title}: ${buildCmakeSectionSidebarTooltip(section).replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
            <span>${renderEntityIcon(section.iconType, 'ui-codicon nav-icon', section.title)}</span>
            <span>فهرس ${escapeHtml(section.title)}</span>
          </div>
          ${(getCmakeEntriesByKind(section.key) || []).map((entry) => `
            <div class="nav-item" data-nav-type="cmake" data-nav-kind="${escapeAttribute(entry.kind)}" data-nav-name="${escapeAttribute(entry.slug)}" data-tooltip="${escapeAttribute(buildCmakeEntryTooltip(entry))}" aria-label="${escapeAttribute(`${entry.name}: ${buildCmakeEntryTooltip(entry).replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
              <span>${renderEntityIcon(getCmakeKindMeta(entry.kind).icon, 'ui-codicon nav-icon', entry.name)}</span>
              <span>${escapeHtml(entry.name)}</span>
            </div>
          `).join('') || `<div class="nav-item">لا توجد عناصر في ${escapeHtml(section.title)}</div>`}
        </div>
      </div>
    `).join('')}
  `;
}

async function showCmakeIndex(options = {}) {
  await ensureUiSegment('cmakeSearch');
  populateCmakeList();
  await showReferenceLibraryIndex('cmake', options);
  setActiveSidebarItemBySelector('cmake-list', `.nav-item[data-nav-type="cmake-index"][data-nav-name="cmake"]`);
}

async function showCmakeKindIndex(kindId = '', options = {}) {
  await ensureUiSegment('cmakeSearch');
  populateCmakeList();
  await showReferenceKindIndex('cmake', kindId, options);
  setActiveSidebarItemBySelector('cmake-list', `.nav-item[data-nav-type="cmake-kind-index"][data-nav-name="${escapeSelectorValue(kindId)}"]`);
}

async function showCmakeEntity(kindId = '', slug = '', options = {}) {
  await ensureUiSegment('cmakeSearch');
  populateCmakeList();
  await showReferenceEntity('cmake', kindId, slug, options);
  setActiveSidebarItemBySelector('cmake-list', `.nav-item[data-nav-type="cmake"][data-nav-kind="${escapeSelectorValue(kindId)}"][data-nav-name="${escapeSelectorValue(slug)}"]`);
}

async function showVulkanIndex(options = {}) {
  await showReferenceLibraryIndex('vulkan', options);
  setActiveSidebarItemBySelector('vulkan-cluster', `.nav-item[data-nav-type="vulkan-index"][data-nav-name="vulkan"]`);
}

const getVulkanHomeMetrics = (...args) => vulkanHomeRuntime?.getVulkanHomeMetrics?.(...args) || ({totalCommands: 0, totalStructures: 0, totalEnums: 0, totalConstants: 0, totalVariables: 0, tutorialCount: 0, fileCount: 0});

function showHomePage(options = {}) {
  const run = async () => {
    await ensureUiSegment('homePageRuntime');
    return getHomePageRuntime()?.showHomePage?.(options);
  };
  return run();
}
