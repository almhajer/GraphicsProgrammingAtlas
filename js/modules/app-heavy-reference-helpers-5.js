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

function applyCppReferenceData(data = {}) {
  CPP_REFERENCE_DATA = freezeDataSlice(data, 'referenceData');
}

function applyCppReferenceEnrichmentData(data = {}) {
  CPP_REFERENCE_ENRICHMENT = freezeDataSlice(data, 'referenceEnrichment');
}

function applyCppReferenceOfficialLinksData(data = {}) {
  CPP_REFERENCE_OFFICIAL_LINKS = freezeDataSlice(data, 'officialLinks');
}

function applyCppReferenceGuideData(data = {}) {
  CPP_REFERENCE_GUIDES = freezeDataSlice(data, 'referenceGuides');
  CPP_DEEP_GUIDES = freezeDataSlice(data, 'deepGuides');
}

function applyCppReferenceTooltipOverrideData(data = {}) {
  CPP_REFERENCE_TOOLTIP_OVERRIDES = freezeDataSlice(data, 'tooltipOverrides');
}

function applyCppHomeData(data = {}) {
  CPP_HOME_DATA = Object.freeze(data || {});
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

function readGlslCachedItemText(cache, item, builder) {
  if (!item || typeof item !== 'object') {
    return String(builder(item) || '');
  }

  if (cache?.has(item)) {
    return String(cache.get(item) || '');
  }

  const value = String(builder(item) || '');
  cache?.set(item, value);
  return value;
}

function readGlslCachedText(cache, text, builder) {
  const key = String(text || '');
  if (!key) {
    return '';
  }

  if (cache?.has(key)) {
    return String(cache.get(key) || '');
  }

  const value = String(builder(key) || '');
  cache?.set(key, value);
  return value;
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
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();

  if (/Compilation/i.test(kind)) {
    return 'هذا العنصر توجيه من لغة GLSL يفسره مترجم glslang أثناء ترجمة الشيدر. لا يمثل هذا العنصر دالة أو نوعًا في Vulkan، بل يؤثر فقط على طريقة تحليل الشيدر قبل تحويله إلى SPIR-V.';
  }

  if (/Directive/i.test(kind)) {
    return 'هذا العنصر توجيه من لغة GLSL يفسره مترجم glslang أثناء مرحلة المعالجة المسبقة أو أثناء ترجمة الشيدر. لا يمثل هذا العنصر دالة أو نوعًا في Vulkan، بل يؤثر فقط على تحليل الشيدر قبل تحويله إلى SPIR-V.';
  }

  if (/Math Function/i.test(kind)) {
    return `هذا العنصر دالة حسابية مدمجة مثل ${name || 'إحدى دوال الرياضيات في GLSL'}. دورها الحقيقي هو تحويل قيم عددية أو متجهية داخل الشيدر نفسه، لذلك glslang يترجمها إلى عملية حسابية في SPIR-V من دون أن تضيف واجهة جديدة أو موردًا جديدًا.`;
  }

  if (/Sampling Function/i.test(kind)) {
    return `هذا العنصر دالة sampling مدمجة تقرأ مورد صورة أو sampler من داخل الشيدر. glslang يربطها بعملية قراءة فعلية من مورد مربوط، لذلك معناها البرمجي يرتبط بالوصفات والموارد لا بمجرد حساب عددي معزول.`;
  }

  if (/Derivative Function/i.test(kind)) {
    return `هذا العنصر دالة مشتقات مدمجة تعتمد على نمط تنفيذ الشظايا في المرحلة الرسومية لحساب تغير القيمة بين invocations متجاورة. معناها البرمجي ليس رياضيات عامة فقط، بل معلومات مشتقة مرتبطة بطريقة تنفيذ الـ fragment shader.`;
  }

  if (/Synchronization Function/i.test(kind)) {
    return `هذا العنصر دالة تزامن مدمجة تضبط رؤية الذاكرة أو ترتيب الوصول داخل الشيدر، خصوصًا في compute. معناها الحقيقي هو فرض قيد تنفيذ أو ذاكرة، لا إنتاج قيمة حسابية عادية.`;
  }

  if (/Interpolation Function/i.test(kind)) {
    return `هذا العنصر دالة interpolation مدمجة تبني قيمة وسيطة من قيم أخرى داخل الشيدر. معناها البرمجي هو تشكيل انتقال أو مزج محسوب، لا مجرد استدعاء اسم عام في اللغة.`;
  }

  if (/Range Function/i.test(kind)) {
    return `هذا العنصر دالة نطاق مدمجة تضبط قيمة داخل حدين أو تختار أصغر/أكبر قيمة. معناها الحقيقي هو تقييد المجال العددي الذي ستستمر به الحسابات اللاحقة داخل الشيدر.`;
  }

  if (/Vector Function/i.test(kind)) {
    return `هذا العنصر دالة متجهات مدمجة تتعامل مع اتجاهات أو علاقات هندسية بين متجهات، مثل الانعكاس أو الانكسار أو الضرب الاتجاهي. لذلك أثرها الحقيقي هندسي داخل الشيدر لا شكلي في الواجهة.`;
  }

  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function|Synchronization Function/i.test(kind)) {
    return `هذا العنصر دالة مدمجة يستدعيها الشيدر مثل ${name || 'إحدى دوال GLSL'}، فيتعرف glslang على معناها ويحوّلها إلى عملية مقابلة داخل SPIR-V. ليست API من Vulkan، لكنها قد تؤثر في الحسابات أو الموارد التي يعتمد عليها الشيدر هناك.`;
  }

  if (name === 'gl_Position' || name === 'gl_PointSize' || name === 'gl_FragDepth') {
    return `هذا العنصر متغير مخرج مدمج يكتب إليه الشيدر ليؤثر في مرحلة ثابتة لاحقة. معنى ${name} ليس مجرد متغير جاهز، بل قناة إخراج خاصة يقرأها مسار الرسم بعد انتهاء المرحلة ليحدد الموضع أو حجم النقطة أو قيمة العمق.`;
  }

  if (/^(gl_VertexIndex|gl_InstanceIndex|gl_DrawID|gl_BaseVertex|gl_BaseInstance)$/.test(name)) {
    return `هذا العنصر متغير دخل مدمج يمرر إلى الشيدر معلومات عن أمر الرسم الحالي نفسه. معنى ${name} برمجيًا أنه يصف أي vertex أو instance أو draw يعالَج الآن، لذلك يستخدم لفهرسة البيانات أو اختيار فرع مرتبط باستدعاء الرسم.`;
  }

  if (/^(gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_PrimitiveID)$/.test(name)) {
    return `هذا العنصر متغير مدمج يمثل حالة fragment أو primitive الحالية بعد مرورها عبر المسار الرسومي. معنى ${name} ليس موردًا ولا واجهة عامة، بل قيمة يولدها rasterization أو المسار الثابت لتخبر الشيدر بموقع الشظية أو اتجاه الوجه أو إحداثيات النقطة أو رقم البدائية.`;
  }

  if (/^(gl_GlobalInvocationID|gl_LocalInvocationID|gl_LocalInvocationIndex|gl_WorkGroupID|gl_NumWorkGroups|gl_WorkGroupSize)$/.test(name)) {
    return `هذا العنصر متغير مدمج خاص بمسار compute يصف مكان الـ invocation الحالية داخل dispatch أو داخل workgroup. معنى ${name} برمجيًا هو فهرسة العمل على البيانات لا تمرير قيمة واجهة بين المراحل الرسومية.`;
  }

  if (name === 'gl_ClipDistance') {
    return 'هذا العنصر متغير واجهة مدمج يمرر مسافات القص التي ستستخدمها المراحل الثابتة لقص البدائية. معناه الحقيقي أنه جسر بين ما يحسبه الشيدر وبين قرار القص الهندسي قبل rasterization.';
  }

  if (/Built-in.*Variable|Interface Variable/i.test(kind)) {
    return 'هذا العنصر متغير مدمج أو متغير واجهة يحمل معنى نظاميًا ثابتًا داخل مرحلة معينة من الشيدر. glslang لا يعامله كمتغير عادي يعرّفه المستخدم، بل يربطه مباشرة بحالة تنفيذ أو موضع واجهة معروف في SPIR-V.';
  }

  if (/Qualifier|Layout|Storage/i.test(kind)) {
    return 'هذا العنصر محدد لغوي لا ينتج قيمة بحد ذاته، بل يغيّر طريقة تفسير المتغير أو الكتلة: أين تعيش، وكيف تُربط، وما القيود المفروضة عليها. لذلك أثره الحقيقي يظهر في الواجهة المترجمة وفي مطابقة الشيدر مع موارد Vulkan.';
  }

  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'هذا العنصر نوع لغوي يحدد شكل البيانات التي يستطيع الشيدر تمريرها أو حسابها أو ربطها كمورد. glslang يبني عليه فحص التوافق والعمليات المسموحة قبل أن يترجم الشيدر إلى SPIR-V.';
  }

  if (/Block|Structure|Interface/i.test(kind)) {
    return 'هذا العنصر بنية واجهة أو كتلة تجمع عدة حقول تحت عقد واحد يترجمه glslang إلى وصف منظم في SPIR-V. أهميته ليست في الاسم فقط، بل في شكل الذاكرة أو الواجهة الذي يجب أن يطابقه التطبيق.';
  }

  return 'هذا العنصر لبنة لغوية داخل GLSL يفسرها glslang أثناء بناء المعنى الكامل للشيدر، ثم ينقل أثرها إلى SPIR-V الذي يستهلكه مسار التنفيذ في Vulkan.';
}

function inferGlslExecutionStageLabel(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();
  const text = `${kind} ${item?.execution || ''} ${item?.usage || ''}`;
  if (/preprocessing|Directive|Conditional Compilation/i.test(text)) {
    return 'المعالجة المسبقة وترجمة الشيدر';
  }
  if (/^(gl_VertexIndex|gl_InstanceIndex|gl_DrawID|gl_BaseVertex|gl_BaseInstance)$/.test(name)) {
    return 'تثبيت معطيات الرسم المدمجة';
  }
  if (/^(gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_PrimitiveID)$/.test(name)) {
    return 'تثبيت حالة fragment/primitive';
  }
  if (/^(gl_GlobalInvocationID|gl_LocalInvocationID|gl_LocalInvocationIndex|gl_WorkGroupID|gl_NumWorkGroups|gl_WorkGroupSize)$/.test(name)) {
    return 'تثبيت فهرسة compute والعمل';
  }
  if (name === 'gl_Position' || name === 'gl_PointSize' || name === 'gl_FragDepth') {
    return 'تثبيت خرج المرحلة للمسار الثابت';
  }
  if (name === 'gl_ClipDistance') {
    return 'مطابقة واجهة القص وتثبيتها';
  }
  if (/Math Function/i.test(kind)) {
    return 'تحليل العملية الحسابية وإنتاجها';
  }
  if (/Sampling Function/i.test(kind)) {
    return 'تحليل قراءة المورد وإنتاجها';
  }
  if (/Derivative Function/i.test(kind)) {
    return 'تحليل المشتقات وإنتاجها';
  }
  if (name === 'pow') {
    return 'تحليل العملية الأسية وإنتاجها';
  }
  if (/Storage Qualifier|Layout Qualifier|Layout Key|Interface Variable|Type|Matrix|Vector|Opaque Resource|Scalar|Block|Structure|Interface/i.test(kind)) {
    return 'ترجمة الشيدر ومطابقة الواجهة';
  }
  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function/i.test(kind)) {
    return 'تحليل الاستدعاء وإنتاج العملية';
  }
  if (/Synchronization Function/i.test(kind) || /^(memoryBarrier|memoryBarrierImage|memoryBarrierBuffer|groupMemoryBarrier|barrier)$/.test(name)) {
    return 'تحليل التزامن وإنتاج القيود';
  }
  if (/Built-in.*Variable/i.test(kind)) {
    return 'تحليل المتغير المدمج وتثبيت دلالته';
  }
  if (/Entry Point|Control Flow|Loop Keyword/i.test(kind)) {
    return 'بناء التدفق وإنتاج SPIR-V';
  }
  if (/translation|compiler|SPIR-V|Shader|sampling|Rasterization|Fragment|Vertex|execution/i.test(text)) {
    return 'ترجمة الشيدر وإنتاج SPIR-V';
  }
  return 'تحليل الشيدر وترجمته';
}

function buildGlslExecutionStageNote(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();

  if (name === 'gl_Position' || name === 'gl_PointSize' || name === 'gl_FragDepth') {
    return `أثر ${name} يظهر عندما يثبت glslang أن هذه القيمة ستخرج من الشيدر إلى مرحلة ثابتة لاحقة في المسار الرسومي. لذلك ما يهم هنا ليس مجرد وجود متغير مدمج، بل أن SPIR-V الناتج سيعلن هذا الخرج بحيث تستخدمه مراحل مثل القص أو rasterization أو depth testing بعد انتهاء الشيدر.`;
  }

  if (/^(gl_VertexIndex|gl_InstanceIndex|gl_DrawID|gl_BaseVertex|gl_BaseInstance)$/.test(name)) {
    return `أثر ${name} يظهر عندما يثبت glslang أن الشيدر سيقرأ معطى نظاميًا قادمًا من أمر الرسم نفسه. لذلك الدلالة التي تكتب في SPIR-V هنا هي دخل مدمج مرتبط بسياق draw أو instance أو index، لا متغير واجهة يعرّفه المستخدم يدويًا.`;
  }

  if (/^(gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_PrimitiveID)$/.test(name)) {
    return `أثر ${name} يظهر عندما يثبت glslang أن القيمة ستأتي من حالة rasterization أو من البدائية الحالية قبل تنفيذ fragment shader أو أثناءه. هذا يعني أن SPIR-V الناتج يحمل دخلًا مدمجًا يمثل حالة هندسية/شاشية يولدها المسار الرسومي، لا موردًا أو ثابتًا محليًا.`;
  }

  if (/^(gl_GlobalInvocationID|gl_LocalInvocationID|gl_LocalInvocationIndex|gl_WorkGroupID|gl_NumWorkGroups|gl_WorkGroupSize)$/.test(name)) {
    return `أثر ${name} يظهر عندما يثبت glslang أن الشيدر يحتاج إلى معرفة موقع الـ invocation الحالية داخل dispatch أو workgroup. لذلك ما يُكتب في SPIR-V هنا هو دخل أو ثابت مدمج يصف تنظيم العمل في compute، لا قيمة يمررها التطبيق عبر واجهة متغيرة عادية.`;
  }

  if (name === 'gl_ClipDistance') {
    return 'أثر gl_ClipDistance يظهر عندما يثبت glslang أن الشيدر سيصدر مسافات قص يجب أن تنتقل عبر الواجهة إلى المراحل الثابتة. لذلك التغيير الحقيقي هنا يقع في واجهة القص التي ستستخدمها المراحل اللاحقة لرفض أجزاء من البدائية أو إبقائها.';
  }

  if (/Directive|Compilation/i.test(kind)) {
    return 'أثر هذا العنصر يبدأ قبل اكتمال تحليل الشيدر نفسه، لأنه يحدد القواعد أو الميزات أو النص الذي سيدخل أصلًا إلى glslang قبل توليد SPIR-V.';
  }

  if (/Math Function/i.test(kind) && name !== 'pow') {
    return `أثر ${name || 'هذه الدالة'} يظهر عندما يحلل glslang التعبير الحسابي نفسه ويثبت نوع المدخلات والناتج، ثم يحوله إلى عملية رياضية مقابلة في SPIR-V. المعنى البرمجي هنا هو تغيير القيمة المحسوبة داخل الشيدر، لا تعديل الواجهة أو الموارد.`;
  }

  if (/Sampling Function/i.test(kind)) {
    return `أثر ${name || 'هذه الدالة'} يظهر عندما يحلل glslang عملية القراءة من sampler أو image ويتأكد من توافق نوع المورد والإحداثيات، ثم يولد تعليمة sampling أو fetch المناسبة في SPIR-V. لذلك التغيير الحقيقي هنا يقع في طريقة قراءة المورد المرتبط داخل الشيدر.`;
  }

  if (/Derivative Function/i.test(kind)) {
    return `أثر ${name || 'هذه الدالة'} يظهر عندما يقرر glslang أن الناتج يجب أن يُشتق من تغير القيمة بين invocations متجاورة في مرحلة fragment. لذلك ما يُبنى في SPIR-V هنا هو معنى مشتقة شاشة، لا عملية رياضية عامة مستقلة عن سياق التنفيذ.`;
  }

  if (name === 'pow') {
    return 'أثر pow يظهر عندما يحلل glslang علاقة القاعدة بالأس ويتأكد من توافق الأنواع، ثم يحول الاستدعاء إلى عملية أسية في SPIR-V أو إلى التسلسل المكافئ الذي يراه مناسبًا. لذلك التغيير الحقيقي هنا يقع في شكل الحساب غير الخطي الذي سينفذه الشيدر، لا في بقاء اسم pow أثناء التنفيذ.';
  }

  if (/Built-in.*Function|Math Function|Sampling Function|Interpolation Function|Range Function|Vector Function|Derivative Function/i.test(kind)) {
    return `أثر ${name || 'هذه الدالة'} يظهر عندما يحلل glslang الاستدعاء نفسه، ويتحقق من أنواع الوسائط، ثم يستبدله بعملية مقابلة داخل SPIR-V. ما ينفذه المعالج الرسومي لاحقًا هو العملية الناتجة، لا اسم الدالة المكتوب في GLSL.`;
  }

  if (/Synchronization Function/i.test(kind) || /^(memoryBarrier|memoryBarrierImage|memoryBarrierBuffer|groupMemoryBarrier|barrier)$/.test(name)) {
    return `أثر ${name || 'هذه الدالة'} لا يقتصر على حساب قيمة، بل يضيف معنى تزامنيًا وقيود رؤية أو ترتيب وصول داخل الشيدر. glslang يترجم هذا المعنى إلى تعليمات وقيود مناسبة في SPIR-V ليفهم التنفيذ كيف ينسق الوصول إلى الذاكرة.`;
  }

  if (/Built-in.*Variable|Interface Variable/i.test(kind)) {
    return 'أثر هذا العنصر يظهر أثناء تثبيت المتغير المدمج أو واجهة المرحلة التي ينتمي إليها، لأن glslang يجب أن يربطه بدلالة نظامية معروفة قبل أن يكتب وصفه في SPIR-V.';
  }

  if (/Qualifier|Layout|Storage/i.test(kind)) {
    return 'أثر هذا العنصر يظهر أثناء بناء الواجهة وقواعد الربط، لأنه لا ينتج قيمة تنفيذية مباشرة بل يغير كيف يفسر glslang المتغير أو الكتلة أو المورد عند الترجمة.';
  }

  if (/Type|Matrix|Vector|Opaque Resource|Scalar|Block|Structure|Interface/i.test(kind)) {
    return 'أثر هذا العنصر يظهر عندما يبني glslang المعنى البنيوي للشيدر: شكل البيانات، توافق الحقول، وصورة الواجهة أو المورد التي ستنتقل لاحقًا إلى SPIR-V.';
  }

  if (/Entry Point|Control Flow|Loop Keyword/i.test(kind)) {
    return 'أثر هذا العنصر يظهر أثناء بناء التدفق التنفيذي للشيدر، لأن glslang يحوله إلى بنية تحكم صريحة داخل SPIR-V مثل التفرع أو الحلقة أو نقطة الدخول.';
  }

  return 'هذا الحقل يبين في أي لحظة من الترجمة يترك العنصر أثره الحقيقي داخل glslang: هل يغير النص، أم يثبت الواجهة، أم يولد عملية أو بنية ستظهر لاحقًا في SPIR-V.';
}

function buildGlslPracticalRole(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '');
  if (name === 'clamp') {
    return 'دالة مدمجة تُستخدم لتقييد قيمة داخل مجال محدد. glslang لا يتعامل معها كاسم نصي فقط، بل يحل النسخة المناسبة من الدالة بحسب نوع المدخلات ثم يحولها إلى عملية تقييد فعلية في SPIR-V.';
  }
  if (name === 'gl_Position' || name === 'gl_PointSize' || name === 'gl_FragDepth') {
    return `متغير خرج مدمج يكتب إليه الشيدر لتمرير نتيجة تؤثر مباشرة في مرحلة ثابتة لاحقة. معنى ${name} الحقيقي هو إخراج موضع أو حجم أو عمق سيُستهلك بعد انتهاء الشيدر.`;
  }
  if (/^(gl_VertexIndex|gl_InstanceIndex|gl_DrawID|gl_BaseVertex|gl_BaseInstance)$/.test(name)) {
    return `متغير دخل مدمج يصف أي عنصر من أمر الرسم يعالَج الآن. معنى ${name} الحقيقي هو فهرسة الـ vertex أو الـ instance أو الـ draw الحالي ليبني الشيدر عليه القراءة أو الاختيار.`;
  }
  if (/^(gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_PrimitiveID)$/.test(name)) {
    return `متغير مدمج يمثل حالة fragment أو primitive الحالية داخل المسار الرسومي. معنى ${name} الحقيقي أنه يمنح الشيدر معلومة جاهزة عن موضع الشظية أو اتجاه الوجه أو إحداثيات النقطة أو رقم البدائية.`;
  }
  if (/^(gl_GlobalInvocationID|gl_LocalInvocationID|gl_LocalInvocationIndex|gl_WorkGroupID|gl_NumWorkGroups|gl_WorkGroupSize)$/.test(name)) {
    return `متغير مدمج خاص بـ compute يحدد مكان الـ invocation الحالية أو أبعاد العمل. معنى ${name} الحقيقي هو فهرسة توزيع العمل على البيانات داخل dispatch أو workgroup.`;
  }
  if (name === 'gl_ClipDistance') {
    return 'متغير واجهة مدمج يمرر مسافات القص التي ستستخدمها المراحل الثابتة لقص البدائية. معناه الحقيقي أنه يربط ما يحسبه الشيدر بقرار clipping اللاحق.';
  }
  if (/Math Function/i.test(kind)) {
    return 'دالة رياضية مدمجة تغيّر قيمة عددية أو متجهية داخل الشيدر، مثل اللوغاريتم أو الجذر أو الجيب. glslang يترجمها إلى عملية حسابية فعلية في SPIR-V، لذلك معناها الحقيقي هو الحساب نفسه لا اسم الدالة.';
  }
  if (/Sampling Function/i.test(kind)) {
    return 'دالة قراءة موارد مدمجة تستعمل sampler أو image للحصول على بيانات من مورد مربوط. glslang يترجمها إلى تعليمة قراءة مورد، لذلك معناها الحقيقي مرتبط بالوصول إلى texture أو image لا بوصف لغوي عام.';
  }
  if (/Derivative Function/i.test(kind)) {
    return 'دالة مشتقات مدمجة تستخدمها الشظايا لاستخراج معدل تغير قيمة عبر الجيران على الشاشة. glslang يثبت هذا المعنى كمعلومة مشتقة في SPIR-V لا كحساب مستقل عن سياق المرحلة.';
  }
  if (/Synchronization Function/i.test(kind)) {
    return 'دالة تزامن مدمجة تضبط متى تصبح الكتابات مرئية أو متى يجب أن تتماشى invocations العمل قبل المتابعة. glslang يترجمها إلى قيود تزامن وذاكرة داخل SPIR-V.';
  }
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
    return 'دالة مدمجة يتعرف عليها glslang عبر الاسم وأنواع المعاملات، ثم يختار الـ overload الصحيح ويحوّل الاستدعاء إلى عملية دلالية فعلية داخل SPIR-V بدل الإبقاء على اسم GLSL النصي.';
  }
  if (/Type|Matrix|Vector|Opaque Resource|Scalar/i.test(kind)) {
    return 'نوع لغوي يحدد شكل القيم أو الموارد التي يبني عليها glslang فحص العمليات ومطابقة الواجهة.';
  }
  if (/Block|Structure|Interface/i.test(kind)) {
    return 'بنية لغوية تنظم حقول الواجهة أو الموارد بحيث يستطيع glslang تحويلها إلى وصف متسق داخل SPIR-V.';
  }
  return 'عنصر لغوي يقرأه مترجم glslang أثناء ترجمة الشيدر ليبني منه دلالة صحيحة تنتقل آثارها إلى SPIR-V، لا إلى المعالج الرسومي مباشرة.';
}

function buildGlslSectionMeaningNote(item) {
  const name = String(item?.name || '').trim();
  const sectionKey = String(item?.sectionKey || '').trim();
  const sectionTitle = String(item?.sectionTitle || '').trim() || 'هذه المجموعة';
  const kind = String(item?.kind || '').trim();

  if (sectionKey === 'functions') {
    if (/Math Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص العمليات الرياضية الجاهزة التي تغيّر القيم داخل الشيدر نفسه. وجود ${name || 'هذا العنصر'} هنا يعني أنك تتعامل مع حساب مدمج يترجمه glslang إلى عملية عددية في SPIR-V مثل لوغاريتم أو جذر أو دالة مثلثية.`;
    }
    if (/Sampling Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص دوال قراءة الموارد. وجود ${name || 'هذا العنصر'} هنا يعني أنك تتعامل مع عملية تصل من الشيدر إلى sampler أو image مربوط، ثم يحولها glslang إلى تعليمة sampling أو fetch في SPIR-V.`;
    }
    if (/Derivative Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص المشتقات التي تعتمد على تغير القيم بين الشظايا المتجاورة. وجود ${name || 'هذا العنصر'} هنا يعني أنك لا تجري حسابًا عامًا فقط، بل تستخرج معلومة مرتبطة بكيفية تنفيذ fragment shader على الشاشة.`;
    }
    if (/Synchronization Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص التزامن والذاكرة. وجود ${name || 'هذا العنصر'} هنا يعني أنك تفرض ترتيبًا أو رؤيةً للقراءة والكتابة داخل الشيدر، لا تحسب قيمة عددية جديدة فقط.`;
    }
    if (/Interpolation Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص المزج وبناء القيم الوسيطة. وجود ${name || 'هذا العنصر'} هنا يعني أنك تشكل قيمة انتقالية بين مدخلات أخرى وفق قاعدة interpolation واضحة.`;
    }
    if (/Range Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص تقييد المجال العددي أو اختيار الحدود. وجود ${name || 'هذا العنصر'} هنا يعني أن دوره الحقيقي هو إبقاء القيمة ضمن مجال أو اختيار حد أدنى/أعلى قبل متابعة الحسابات.`;
    }
    if (/Vector Function/i.test(kind)) {
      return `هذه المجموعة الفرعية داخل الدوال المضمنة تخص العمليات الهندسية على المتجهات. وجود ${name || 'هذا العنصر'} هنا يعني أنك تبني علاقة اتجاهية أو هندسية مثل انعكاس أو انكسار أو تعامد داخل الشيدر.`;
    }
    return `هذه المجموعة لا تجمع أسماء متشابهة فقط، بل تجمع العمليات الجاهزة التي يفهمها glslang مباشرة داخل الشيدر. وجود ${name || 'هذا العنصر'} هنا يعني أنك تتعامل مع دالة مدمجة تتحول عند الترجمة إلى عملية فعلية في SPIR-V.`;
  }

  if (sectionKey === 'types') {
    return `هذه المجموعة تشرح أنواع البيانات والموارد التي يبني عليها الشيدر تعبيراته وواجهاته. وجود ${name || 'هذا العنصر'} هنا يعني أنه يحدد شكل القيمة أو المورد وما العمليات التي يسمح بها glslang عليه قبل إنتاج SPIR-V.`;
  }

  if (sectionKey === 'directives') {
    return `هذه المجموعة تخص التوجيهات التي تغيّر قواعد الترجمة نفسها قبل تحليل الشيدر كاملًا. وجود ${name || 'هذا العنصر'} هنا يعني أن أثره يقع في تمكين صياغات أو ميزات أو شروط ترجمة، لا في إنتاج قيمة تنفيذية مباشرة.`;
  }

  if (sectionKey === 'qualifiers') {
    return `هذه المجموعة تخص المحددات التي تغيّر معنى المتغيرات والكتل والواجهات. وجود ${name || 'هذا العنصر'} هنا يعني أن دوره الحقيقي هو ضبط مكان البيانات أو طريقة ربطها أو قيود استخدامها، لا إنتاج قيمة مستقلة بحد ذاته.`;
  }

  if (sectionKey === 'constants') {
    return `هذه المجموعة تجمع القيم الثابتة والأسماء الجاهزة التي يفسرها glslang كمدخلات ثابتة أو رموز معروفة أثناء الترجمة. وجود ${name || 'هذا العنصر'} هنا يعني أن أهميته في القيمة أو الدلالة الثابتة التي ينقلها إلى الشيدر.`;
  }

  if (sectionKey === 'builtins') {
    if (name === 'gl_Position' || name === 'gl_PointSize' || name === 'gl_FragDepth') {
      return `هذه المجموعة الفرعية داخل المتغيرات المضمنة تخص المخرجات النظامية التي يكتبها الشيدر لتتلقاها مرحلة ثابتة لاحقة. وجود ${name} هنا يعني أنك لا تتعامل مع متغير عادي، بل مع خرج يغير موضع الرسم أو حجم النقطة أو العمق.`;
    }
    if (/^(gl_VertexIndex|gl_InstanceIndex|gl_DrawID|gl_BaseVertex|gl_BaseInstance)$/.test(name)) {
      return `هذه المجموعة الفرعية داخل المتغيرات المضمنة تخص معطيات الرسم التي يحقنها النظام في الشيدر من أمر draw نفسه. وجود ${name} هنا يعني أنه يصف أي vertex أو instance أو draw يُعالَج الآن.`;
    }
    if (/^(gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_PrimitiveID)$/.test(name)) {
      return `هذه المجموعة الفرعية داخل المتغيرات المضمنة تخص حالة fragment أو primitive بعد المرور عبر المسار الرسومي. وجود ${name} هنا يعني أنك تقرأ معلومة يولدها rasterization أو إعدادات الوجه/النقطة/البدائية الحالية.`;
    }
    if (/^(gl_GlobalInvocationID|gl_LocalInvocationID|gl_LocalInvocationIndex|gl_WorkGroupID|gl_NumWorkGroups|gl_WorkGroupSize)$/.test(name)) {
      return `هذه المجموعة الفرعية داخل المتغيرات المضمنة تخص فهرسة العمل في compute. وجود ${name} هنا يعني أنك تقرأ موقع الـ invocation الحالية أو أبعاد العمل التي بُني عليها dispatch.`;
    }
    if (name === 'gl_ClipDistance') {
      return 'هذه المجموعة الفرعية داخل المتغيرات المضمنة تخص واجهة القص. وجود gl_ClipDistance هنا يعني أنك تمرر مسافات clipping ستستخدمها المراحل اللاحقة لاتخاذ قرار قص البدائية.';
    }
    return `هذه المجموعة تشرح المتغيرات والأسماء النظامية التي تمنح الشيدر وصولًا إلى واجهة المرحلة أو حالة التنفيذ. وجود ${name || 'هذا العنصر'} هنا يعني أنه يرتبط بمدخل أو مخرج أو حالة مدمجة يفهمها glslang ويثبتها داخل واجهة SPIR-V.`;
  }

  if (sectionKey === 'control-flow') {
    return `هذه المجموعة تخص العناصر التي تبني منطق التنفيذ نفسه داخل الشيدر، مثل التفرع والتكرار ونقطة البدء. وجود ${name || 'هذا العنصر'} هنا يعني أن أثره يظهر في بنية التدفق التي يترجمها glslang إلى تعليمات تحكم داخل SPIR-V.`;
  }

  if (sectionKey === 'blocks') {
    return `هذه المجموعة تخص البنى والكتل التي تجمع عدة حقول تحت واجهة واحدة أو تخطيط ذاكرة واحد. وجود ${name || 'هذا العنصر'} هنا يعني أن دوره الحقيقي هو تنظيم البيانات التي سيطابقها التطبيق والـ shader معًا عند الربط.`;
  }

  return `${sectionTitle} تشرح عائلة عناصر تتشارك نفس الدور الدلالي داخل GLSL. وجود ${name || 'هذا العنصر'} هنا يعني أن فهمه مرتبط بوظيفته داخل الترجمة والواجهة، لا باسم التصنيف وحده.`;
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

function renderGlslCodeSnippetGroup(entries = [], title = 'GLSL') {
  const normalizedEntries = Array.isArray(entries)
    ? entries
        .map((entry) => ({
          code: normalizeGlslInlineCodeText(entry?.code || ''),
          tooltip: String(entry?.tooltip || '').trim()
        }))
        .filter((entry) => entry.code)
    : [];

  if (!normalizedEntries.length) {
    return '';
  }

  const rawCode = normalizedEntries.map((entry) => entry.code).join('\n');
  const renderedCodeHtml = normalizedEntries
    .map((entry) => {
      const highlighted = renderHighlightedCode(entry.code, {language: 'glsl'});
      if (!entry.tooltip) {
        return highlighted;
      }
      return `<span title="${escapeAttribute(entry.tooltip)}">${highlighted}</span>`;
    })
    .join('\n');

  const fallback = `
    <div class="code-container glsl-inline-snippet-group">
      <div class="code-toolbar">
        <div class="code-toolbar-title"><span>${escapeHtml(title)}</span></div>
        <div class="code-actions">
          <span class="code-language">GLSL</span>
          <button type="button" onclick="toggleCodeBlock(this)" class="code-action-btn" data-expanded-label="طي الكود" data-collapsed-label="إظهار الكود" aria-expanded="true">طي الكود</button>
          <button type="button" onclick="copyCode(this)" class="code-action-btn" data-default-label="نسخ الكود">نسخ الكود</button>
        </div>
      </div>
      <pre class="code-block"><code dir="ltr" class="language-glsl" data-raw-code="${escapeAttribute(rawCode)}">${renderedCodeHtml}</code></pre>
    </div>
  `;

  return callTutorialUiRuntime('renderDocCodeContainer', [{
    titleHtml: `<span>${escapeHtml(title)}</span>`,
    rawCode,
    renderedCodeHtml,
    language: 'glsl',
    containerClassName: 'glsl-inline-snippet-group'
  }], fallback);
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

  if (name === 'clamp') {
    return 'داخل GLSLang تمثل clamp عملية تقييد لا مجرد اسم دالة. عندما يقرأها glslang يفحص نوع القيمة والحدين، ويختار النسخة المطابقة من الدالة، ثم يحول الاستدعاء إلى عملية في SPIR-V تعيد قيمة لا تنزل عن الحد الأدنى ولا تتجاوز الحد الأعلى.';
  }
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
    return 'يفسر مترجم glslang هذا العنصر كاستدعاء مدمج ذي دلالة معروفة، فيتحقق من أنواع الوسائط وسياق المرحلة ثم يترجمه إلى عملية SPIR-V مناسبة. لذلك ما يصل إلى التنفيذ ليس اسم الدالة من GLSL، بل العملية الناتجة بعد حل الـ overload والتحقق الدلالي.';
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
    return 'يتعرف مترجم glslang على هذا العنصر بوصفه استدعاءً لدالة GLSL مدمجة، ثم يفحص التوافق بين نوع المعاملات والنسخة الصحيحة من الـ overload. بعد ذلك لا يحتفظ بالاسم النصي نفسه، بل يستبدل الاستدعاء بعملية دلالية واضحة في SPIR-V مثل حساب رياضي أو sampling أو مشتقة أو تزامن بحسب نوع الدالة.';
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

  if (name === 'pow') {
    return 'يغير pow شكل الحساب نفسه من تحويل خطي بسيط إلى استجابة أسية. عند الترجمة يثبت glslang أن الناتج يجب أن يحسب برفع القاعدة إلى الأس، وهذا ينعكس مباشرة على شكل المنحنى العددي المستخدم لاحقًا في تصحيح الجاما أو تدرج الإضاءة أو أي معالجة غير خطية أخرى.';
  }
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
    return 'يغير هذا العنصر نوع العملية التي سيبنيها glslang داخل SPIR-V: هل هي حساب عددي، أم قراءة مورد، أم مشتقة، أم تزامن. لذلك ما يتبدل فعليًا ليس اسم الدالة فقط، بل معنى العملية نفسها، ونوع المدخلات المقبولة، وشكل الناتج أو القيود التي سترافقه بعد الترجمة.';
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
    return 'يرتبط هذا العنصر بـ Vulkan عبر ما يولده في SPIR-V لا عبر اسم GLSL نفسه. إذا كانت الدالة حسابية بحتة فغالبًا لا تحتاج توصيف Vulkan خاصًا، أما إذا كانت sampling أو image أو تزامنًا داخل compute فهي تفترض وجود موارد ووصفات وربما مراحل استخدام متوافقة مع ما ربطه التطبيق في Vulkan.';
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

function buildGlslReferenceExample(item) {
  const name = String(item?.name || '').trim();
  const kind = String(item?.kind || '').trim();
  const explicitExample = String(item?.example || '').trim();
  const hasCompleteExample = /#version\b|void\s+main\s*\(/.test(explicitExample);
  const explicitExampleLineCount = explicitExample ? explicitExample.split('\n').length : 0;
  const hasMeaningfulExampleBody = /#version\b/.test(explicitExample) || explicitExampleLineCount >= 4;

  if (explicitExample && hasCompleteExample && hasMeaningfulExampleBody) {
    return explicitExample;
  }

  if (name === '#version') {
    return `#version 460 core
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.6, 0.2, 1.0);
}`;
  }

  if (name === '#extension') {
    return `#version 460 core
#extension GL_ARB_separate_shader_objects : enable
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(0.2, 0.7, 1.0, 1.0);
}`;
  }

  if (name === '#define') {
    return `#version 460
#define GAMMA 2.2
layout(location = 0) out vec4 outColor;

void main() {
    vec3 linearColor = vec3(0.5, 0.3, 0.1);
    vec3 corrected = pow(linearColor, vec3(1.0 / GAMMA));
    outColor = vec4(corrected, 1.0);
}`;
  }

  if (name === '#if') {
    return `#version 460
#define USE_TEXTURE 1

#if USE_TEXTURE
layout(set = 0, binding = 0) uniform sampler2D albedoMap;
layout(location = 0) in vec2 fragUv;
#endif

layout(location = 0) out vec4 outColor;

void main() {
#if USE_TEXTURE
    outColor = texture(albedoMap, fragUv);
#else
    outColor = vec4(1.0);
#endif
}`;
  }

  if (/^(true|false)$/.test(name)) {
    const boolValue = name === 'true' ? 'true' : 'false';
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    bool enabled = ${boolValue};
    outColor = enabled ? vec4(0.1, 0.8, 0.3, 1.0) : vec4(0.7, 0.1, 0.1, 1.0);
}`;
  }

  if (/^__(LINE|FILE|VERSION)__$/.test(name)) {
    if (name === '__VERSION__') {
      return `#version 460
#if __VERSION__ >= 460
#define SUPPORTS_CURRENT_PROFILE 1
#endif

layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(float(SUPPORTS_CURRENT_PROFILE), 0.0, 0.0, 1.0);
}`;
    }

    return `#version 460
#define DEBUG_VALUE ${name}
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(float(DEBUG_VALUE % 8) / 7.0, 0.3, 0.8, 1.0);
}`;
  }

  if (/^gl_Max/.test(name)) {
    return `#version 460
const int limitValue = ${name};
layout(location = 0) out vec4 outColor;

void main() {
    float normalizedLimit = clamp(float(limitValue) / 256.0, 0.0, 1.0);
    outColor = vec4(normalizedLimit, 0.2, 0.7, 1.0);
}`;
  }

  if (name === 'gl_Position') {
    return `#version 460
layout(location = 0) in vec2 inPosition;

void main() {
    gl_Position = vec4(inPosition, 0.0, 1.0);
}`;
  }

  if (name === 'gl_VertexIndex') {
    return `#version 460
const vec2 positions[3] = vec2[](
    vec2(-0.8, -0.8),
    vec2(0.8, -0.8),
    vec2(0.0, 0.8)
);

void main() {
    vec2 position = positions[gl_VertexIndex];
    gl_Position = vec4(position, 0.0, 1.0);
}`;
  }

  if (name === 'gl_InstanceIndex') {
    return `#version 460
layout(location = 0) in vec2 inPosition;

void main() {
    float offset = float(gl_InstanceIndex) * 0.35;
    gl_Position = vec4(inPosition + vec2(offset, 0.0), 0.0, 1.0);
}`;
  }

  if (name === 'gl_PointCoord') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    vec2 uv = gl_PointCoord;
    outColor = vec4(uv, 0.0, 1.0);
}`;
  }

  if (name === 'gl_FrontFacing') {
    return `#version 460
layout(location = 0) in vec3 inNormal;
layout(location = 0) out vec4 outColor;

void main() {
    vec3 normal = gl_FrontFacing ? normalize(inNormal) : -normalize(inNormal);
    outColor = vec4(normal * 0.5 + 0.5, 1.0);
}`;
  }

  if (name === 'gl_PrimitiveID') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float tint = float(gl_PrimitiveID % 4) / 3.0;
    outColor = vec4(tint, 0.3, 1.0 - tint, 1.0);
}`;
  }

  if (name === 'gl_FragCoord') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    vec2 screenUv = gl_FragCoord.xy / vec2(1280.0, 720.0);
    outColor = vec4(screenUv, 0.0, 1.0);
}`;
  }

  if (name === 'gl_FragDepth') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    gl_FragDepth = 0.35;
    outColor = vec4(0.2, 0.6, 1.0, 1.0);
}`;
  }

  if (name === 'gl_DrawID') {
    return `#version 460
const vec2 positions[3] = vec2[](
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
    vec2(0.0, 0.5)
);

void main() {
    float drawOffset = float(gl_DrawID) * 0.25;
    vec2 position = positions[gl_VertexIndex] + vec2(drawOffset, 0.0);
    gl_Position = vec4(position, 0.0, 1.0);
}`;
  }

  if (name === 'gl_BaseVertex') {
    return `#version 460
const vec2 positions[6] = vec2[](
    vec2(-0.8, -0.5),
    vec2(-0.4, 0.5),
    vec2(0.0, -0.5),
    vec2(0.2, -0.5),
    vec2(0.6, 0.5),
    vec2(1.0, -0.5)
);

void main() {
    vec2 position = positions[gl_VertexIndex + gl_BaseVertex];
    gl_Position = vec4(position, 0.0, 1.0);
}`;
  }

  if (name === 'gl_BaseInstance') {
    return `#version 460
layout(location = 0) in vec2 inPosition;

void main() {
    float instanceOffset = float(gl_InstanceIndex + gl_BaseInstance) * 0.2;
    gl_Position = vec4(inPosition + vec2(instanceOffset, 0.0), 0.0, 1.0);
}`;
  }

  if (name === 'gl_ClipDistance') {
    return `#version 460
layout(location = 0) in vec3 worldPos;
layout(location = 1) in vec4 clipPlane;

void main() {
    gl_Position = vec4(worldPos, 1.0);
    gl_ClipDistance[0] = dot(vec4(worldPos, 1.0), clipPlane);
}`;
  }

  if (name === 'gl_PointSize') {
    return `#version 460
layout(location = 0) in vec2 inPosition;

void main() {
    gl_Position = vec4(inPosition, 0.0, 1.0);
    gl_PointSize = 12.0;
}`;
  }

  if (name === 'gl_GlobalInvocationID') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    imageStore(outputImage, pixel, vec4(0.0, 0.5, 1.0, 1.0));
}`;
  }

  if (name === 'gl_LocalInvocationID') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    vec2 localUv = vec2(gl_LocalInvocationID.xy) / vec2(7.0, 7.0);
    imageStore(outputImage, ivec2(gl_GlobalInvocationID.xy), vec4(localUv, 0.0, 1.0));
}`;
  }

  if (name === 'gl_LocalInvocationIndex') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
shared vec4 tileCache[64];

void main() {
    tileCache[gl_LocalInvocationIndex] = vec4(float(gl_LocalInvocationIndex) / 63.0);
    barrier();
}`;
  }

  if (name === 'gl_WorkGroupID') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    vec2 groupColor = vec2(gl_WorkGroupID.xy % 4u) / 3.0;
    imageStore(outputImage, ivec2(gl_GlobalInvocationID.xy), vec4(groupColor, 0.2, 1.0));
}`;
  }

  if (name === 'gl_NumWorkGroups') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    vec2 dispatchRatio = vec2(gl_WorkGroupID.xy) / max(vec2(gl_NumWorkGroups.xy - 1u), vec2(1.0));
    imageStore(outputImage, ivec2(gl_GlobalInvocationID.xy), vec4(dispatchRatio, 0.0, 1.0));
}`;
  }

  if (name === 'gl_WorkGroupSize') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 4, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    vec2 normalizedLocal = vec2(gl_LocalInvocationID.xy) / vec2(gl_WorkGroupSize.xy - uvec2(1u));
    imageStore(outputImage, ivec2(gl_GlobalInvocationID.xy), vec4(normalizedLocal, 0.5, 1.0));
}`;
  }

  if (name === 'layout') {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inUv;
layout(set = 0, binding = 0) uniform sampler2D albedoMap;
layout(location = 0) out vec2 fragUv;

void main() {
    fragUv = inUv;
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'location') {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inColor;
layout(location = 0) out vec3 fragColor;

void main() {
    fragColor = inColor;
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'binding') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 1) uniform sampler2D albedoMap;

void main() {
    outColor = texture(albedoMap, fragUv);
}`;
  }

  if (name === 'set') {
    return `#version 460
layout(set = 0, binding = 0) uniform CameraData {
    mat4 viewProj;
} cameraData;

layout(location = 0) in vec3 inPosition;

void main() {
    gl_Position = cameraData.viewProj * vec4(inPosition, 1.0);
}`;
  }

  if (name === 'push_constant') {
    return `#version 460
layout(push_constant) uniform PushData {
    mat4 model;
    vec4 tint;
} pushData;

layout(location = 0) in vec3 inPosition;
layout(location = 0) out vec4 outTint;

void main() {
    outTint = pushData.tint;
    gl_Position = pushData.model * vec4(inPosition, 1.0);
}`;
  }

  if (/^local_size_[xyz]$/.test(name)) {
    const layoutLine = name === 'local_size_z'
      ? 'layout(local_size_x = 4, local_size_y = 4, local_size_z = 4) in;'
      : 'layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;';
    return `#version 460
${layoutLine}
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    vec2 localUv = vec2(gl_LocalInvocationID.xy) / max(vec2(gl_WorkGroupSize.xy - uvec2(1u)), vec2(1.0));
    imageStore(outputImage, ivec2(gl_GlobalInvocationID.xy), vec4(localUv, 0.0, 1.0));
}`;
  }

  if (name === 'in') {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inColor;
layout(location = 0) out vec3 fragColor;

void main() {
    fragColor = inColor;
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'out') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(fragUv, 0.0, 1.0);
}`;
  }

  if (name === 'uniform') {
    return `#version 460
layout(set = 0, binding = 0) uniform CameraData {
    mat4 viewProj;
} cameraData;

layout(location = 0) in vec3 inPosition;

void main() {
    gl_Position = cameraData.viewProj * vec4(inPosition, 1.0);
}`;
  }

  if (name === 'buffer') {
    return `#version 460
layout(local_size_x = 64) in;
layout(set = 0, binding = 0) buffer ParticleBuffer {
    vec4 positions[];
} particleBuffer;

void main() {
    uint index = gl_GlobalInvocationID.x;
    particleBuffer.positions[index].xy += vec2(0.01, 0.0);
}`;
  }

  if (name === 'const') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    const float gamma = 2.2;
    vec3 linearColor = vec3(0.4, 0.2, 0.1);
    outColor = vec4(pow(linearColor, vec3(1.0 / gamma)), 1.0);
}`;
  }

  if (name === 'flat') {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in int inMaterialIndex;
layout(location = 0) flat out int materialIndex;

void main() {
    materialIndex = inMaterialIndex;
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'smooth') {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inUv;
layout(location = 0) smooth out vec2 fragUv;

void main() {
    fragUv = inUv;
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'readonly') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) readonly uniform image2D inputImage;
layout(set = 0, binding = 1, rgba8) writeonly uniform image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    vec4 value = imageLoad(inputImage, pixel);
    imageStore(outputImage, pixel, value);
}`;
  }

  if (name === 'writeonly') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) writeonly uniform image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    imageStore(outputImage, pixel, vec4(1.0, 0.6, 0.1, 1.0));
}`;
  }

  if (name === 'shared') {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
shared vec4 tileCache[64];

void main() {
    uint localIndex = gl_LocalInvocationIndex;
    tileCache[localIndex] = vec4(float(localIndex) / 63.0);
    barrier();
}`;
  }

  if (name === 'struct') {
    return `#version 460
struct Light {
    vec3 position;
    vec3 color;
};

layout(location = 0) out vec4 outColor;

void main() {
    Light keyLight = Light(vec3(2.0, 4.0, 1.0), vec3(1.0, 0.9, 0.7));
    outColor = vec4(keyLight.color, 1.0);
}`;
  }

  if (name === 'uniform block') {
    return `#version 460
layout(set = 0, binding = 0) uniform CameraData {
    mat4 viewProj;
} cameraData;

layout(location = 0) in vec3 inPosition;

void main() {
    gl_Position = cameraData.viewProj * vec4(inPosition, 1.0);
}`;
  }

  if (name === 'buffer block') {
    return `#version 460
layout(local_size_x = 64) in;
layout(set = 0, binding = 0) buffer ParticleBuffer {
    vec4 positions[];
} particleBuffer;

void main() {
    uint index = gl_GlobalInvocationID.x;
    particleBuffer.positions[index].xy += vec2(0.01, 0.0);
}`;
  }

  if (name === 'gl_PerVertex') {
    return `#version 460
layout(location = 0) in vec3 inPosition;

out gl_PerVertex {
    vec4 gl_Position;
};

void main() {
    gl_Position = vec4(inPosition, 1.0);
}`;
  }

  if (name === 'main') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 0) uniform sampler2D albedoMap;

void main() {
    vec3 albedo = texture(albedoMap, fragUv).rgb;
    outColor = vec4(albedo, 1.0);
}`;
  }

  if (name === 'if') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;

void main() {
    if (fragUv.x > 0.5) {
        outColor = vec4(1.0, 0.8, 0.2, 1.0);
    } else {
        outColor = vec4(0.1, 0.3, 0.9, 1.0);
    }
}`;
  }

  if (name === 'for') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float sum = 0.0;
    for (int i = 0; i < 4; ++i) {
        sum += float(i) * 0.25;
    }
    outColor = vec4(vec3(sum), 1.0);
}`;
  }

  if (name === 'while') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float value = 0.0;
    int count = 0;
    while (value < 0.75 && count < 4) {
        value += 0.2;
        ++count;
    }
    outColor = vec4(value, 0.2, 1.0 - value, 1.0);
}`;
  }

  if (name === 'switch') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    int materialIndex = 2;
    switch (materialIndex) {
        case 0:
            outColor = vec4(1.0, 0.2, 0.2, 1.0);
            break;
        case 1:
            outColor = vec4(0.2, 1.0, 0.3, 1.0);
            break;
        default:
            outColor = vec4(0.2, 0.5, 1.0, 1.0);
            break;
    }
}`;
  }

  if (name === 'return') {
    return `#version 460
layout(location = 0) out vec4 outColor;

vec3 applyTint(vec3 color) {
    if (length(color) < 0.001) {
        return vec3(0.0);
    }
    return normalize(color) * 0.8;
}

void main() {
    vec3 tinted = applyTint(vec3(0.7, 0.4, 0.2));
    outColor = vec4(tinted, 1.0);
}`;
  }

  if (name === 'break') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float sum = 0.0;
    for (int i = 0; i < 8; ++i) {
        if (i == 4) {
            break;
        }
        sum += 0.15;
    }
    outColor = vec4(sum, 0.2, 0.8, 1.0);
}`;
  }

  if (name === 'continue') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float sum = 0.0;
    for (int i = 0; i < 6; ++i) {
        if ((i % 2) == 0) {
            continue;
        }
        sum += 0.25;
    }
    outColor = vec4(0.2, sum, 0.9, 1.0);
}`;
  }

  if (name === 'discard') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;

void main() {
    if (distance(fragUv, vec2(0.5)) > 0.45) {
        discard;
    }
    outColor = vec4(fragUv, 1.0, 1.0);
}`;
  }

  if (/Sampling Function/i.test(kind) || name === 'texture') {
    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 0) uniform sampler2D albedoMap;

void main() {
    vec3 albedo = texture(albedoMap, fragUv).rgb;
    outColor = vec4(albedo, 1.0);
}`;
  }

  if (/Image Function/i.test(kind) || /^(imageLoad|imageStore)$/.test(name)) {
    if (name === 'imageStore') {
      return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    imageStore(outputImage, pixel, vec4(1.0, 0.4, 0.0, 1.0));
}`;
    }

    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform readonly image2D inputImage;
layout(set = 0, binding = 1, rgba8) uniform writeonly image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    vec4 value = imageLoad(inputImage, pixel);
    imageStore(outputImage, pixel, value);
}`;
  }

  if (/Check Function/i.test(kind) || /^(isnan|isinf)$/.test(name)) {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float sampleValue = 0.0 / 0.0;
    bool invalidValue = ${name}(sampleValue);
    outColor = invalidValue ? vec4(1.0, 0.1, 0.1, 1.0) : vec4(0.1, 0.8, 0.2, 1.0);
}`;
  }

  if (/^(any|all)$/.test(name)) {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    bvec3 mask = bvec3(true, false, true);
    bool result = ${name}(mask);
    outColor = result ? vec4(0.2, 0.9, 0.3, 1.0) : vec4(0.8, 0.2, 0.2, 1.0);
}`;
  }

  if (name === 'not') {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    bvec3 mask = bvec3(true, false, false);
    bvec3 inverted = not(mask);
    outColor = inverted.x ? vec4(0.9, 0.8, 0.2, 1.0) : vec4(0.2, 0.3, 0.9, 1.0);
}`;
  }

  if (/^(greaterThan|greaterThanEqual|lessThan|lessThanEqual|equal|notEqual)$/.test(name)) {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    vec3 a = vec3(0.2, 0.6, 0.9);
    vec3 b = vec3(0.3, 0.6, 0.5);
    bvec3 mask = ${name}(a, b);
    outColor = vec4(mask.x ? 1.0 : 0.0, mask.y ? 1.0 : 0.0, mask.z ? 1.0 : 0.0, 1.0);
}`;
  }

  if (/Math Function/i.test(kind) || /Range Function/i.test(kind) || /Vector Function/i.test(kind) || /Interpolation Function/i.test(kind) || /Derivative Function/i.test(kind)) {
    const expressionMap = {
      normalize: 'vec3 result = normalize(vec3(0.5, 1.0, 0.2));',
      dot: 'float result = dot(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.8, 0.6));',
      mix: 'vec3 result = mix(vec3(1.0, 0.2, 0.1), vec3(0.1, 0.4, 1.0), 0.35);',
      clamp: 'float result = clamp(rawValue, 0.0, 1.0);',
      pow: 'vec3 result = pow(color, vec3(1.0 / 2.2));',
      log: 'float result = log(max(luminance, 0.0001));',
      log2: 'float result = log2(max(signalValue, 0.0001));',
      dFdx: 'float result = dFdx(heightValue);',
      dFdy: 'float result = dFdy(heightValue);',
      reflect: 'vec3 result = reflect(-viewDir, normal);'
    };
    const declarationMap = {
      clamp: '    float rawValue = 1.4;',
      pow: '    vec3 color = vec3(0.8, 0.6, 0.4);',
      log: '    float luminance = 0.7;',
      log2: '    float signalValue = 4.0;',
      dFdx: '    float heightValue = fragUv.x;',
      dFdy: '    float heightValue = fragUv.y;',
      reflect: '    vec3 viewDir = normalize(vec3(0.2, 0.4, 1.0));\n    vec3 normal = normalize(vec3(0.0, 0.0, 1.0));'
    };
    const defaultDeclaration = /Derivative Function/i.test(kind)
      ? '    float heightValue = fragUv.x;'
      : '    vec3 color = vec3(0.8, 0.6, 0.4);';
    const defaultExpression = /Derivative Function/i.test(kind)
      ? `float result = ${name}(heightValue);`
      : `vec3 result = vec3(${name}(0.5));`;

    return `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;

void main() {
${declarationMap[name] || defaultDeclaration}
    ${expressionMap[name] || defaultExpression}
    outColor = vec4(vec3(result), 1.0);
}`;
  }

  if (/Synchronization Function/i.test(kind) || /^(memoryBarrier|memoryBarrierImage|memoryBarrierBuffer|groupMemoryBarrier|barrier)$/.test(name)) {
    return `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform coherent image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    imageStore(outputImage, pixel, vec4(1.0, 0.0, 0.0, 1.0));
    ${name}();
}`;
  }

  if (/Built-in Input Variable/i.test(kind)) {
    return `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(1.0);
    // استخدم ${name} هنا ضمن المرحلة المناسبة لهذا المتغير.
}`;
  }

  if (/Built-in Output Variable/i.test(kind)) {
    return `#version 460
void main() {
    ${name} = ${name === 'gl_FragDepth' ? '0.5' : 'vec4(0.0, 0.0, 0.0, 1.0)'};
}`;
  }

  if (/Directive|Compilation/i.test(kind)) {
    return `#version 460

void main() {
}`;
  }

  if (/Control Flow/i.test(kind)) {
    return `#version 460

void main() {
    // مثال ابتدائي متكامل للتحكم بالتدفق داخل الشيدر.
}`;
  }

  if (/Storage Qualifier/i.test(kind)) {
    return `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 0) out vec3 outColor;

void main() {
    outColor = inPosition;
}`;
  }

  if (/Type|Matrix|Vector|Scalar/i.test(kind)) {
    const typeExampleMap = {
      void: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(1.0);
}`,
      float: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    float intensity = 0.75;
    outColor = vec4(vec3(intensity), 1.0);
}`,
      int: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    int tileIndex = 3;
    outColor = vec4(float(tileIndex) / 4.0, 0.2, 0.8, 1.0);
}`,
      uint: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    uint instanceId = 5u;
    outColor = vec4(float(instanceId) / 8.0, 0.4, 0.1, 1.0);
}`,
      bool: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    bool enabled = true;
    outColor = enabled ? vec4(0.0, 0.8, 0.3, 1.0) : vec4(0.8, 0.1, 0.1, 1.0);
}`,
      vec2: `#version 460
layout(location = 0) in vec2 inPosition;

void main() {
    vec2 clipPosition = inPosition * 0.5;
    gl_Position = vec4(clipPosition, 0.0, 1.0);
}`,
      vec3: `#version 460
layout(location = 0) in vec3 inColor;
layout(location = 0) out vec4 outColor;

void main() {
    vec3 albedo = normalize(inColor) * 0.5 + 0.5;
    outColor = vec4(albedo, 1.0);
}`,
      vec4: `#version 460
layout(location = 0) in vec3 inPosition;

void main() {
    vec4 clipPosition = vec4(inPosition, 1.0);
    gl_Position = clipPosition;
}`,
      mat4: `#version 460
layout(set = 0, binding = 0) uniform TransformData {
    mat4 mvp;
} transformData;
layout(location = 0) in vec3 inPosition;

void main() {
    gl_Position = transformData.mvp * vec4(inPosition, 1.0);
}`,
      sampler2D: `#version 460
layout(location = 0) in vec2 fragUv;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 0) uniform sampler2D albedoMap;

void main() {
    outColor = texture(albedoMap, fragUv);
}`,
      ivec2: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    ivec2 pixel = ivec2(gl_FragCoord.xy);
    outColor = vec4(vec2(pixel % 32) / 31.0, 0.0, 1.0);
}`,
      ivec3: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    ivec3 coord = ivec3(1, 2, 3);
    outColor = vec4(vec3(coord) / 3.0, 1.0);
}`,
      uvec2: `#version 460
layout(location = 0) out vec4 outColor;

void main() {
    uvec2 tile = uvec2(8u, 4u);
    outColor = vec4(vec2(tile) / vec2(8.0, 4.0), 0.3, 1.0);
}`,
      uvec3: `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    uvec3 gid = gl_GlobalInvocationID;
    imageStore(outputImage, ivec2(gid.xy), vec4(vec2(gid.xy % 16u) / 15.0, 0.2, 1.0));
}`,
      mat3: `#version 460
layout(location = 0) in vec3 inNormal;
layout(location = 0) out vec4 outColor;

void main() {
    mat3 normalMatrix = mat3(1.0);
    vec3 normal = normalize(normalMatrix * inNormal);
    outColor = vec4(normal * 0.5 + 0.5, 1.0);
}`,
      samplerCube: `#version 460
layout(location = 0) in vec3 viewDir;
layout(location = 0) out vec4 outColor;
layout(set = 0, binding = 0) uniform samplerCube skyboxSampler;

void main() {
    outColor = texture(skyboxSampler, normalize(viewDir));
}`,
      image2D: `#version 460
layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
layout(set = 0, binding = 0, rgba8) uniform writeonly image2D outputImage;

void main() {
    ivec2 pixel = ivec2(gl_GlobalInvocationID.xy);
    imageStore(outputImage, pixel, vec4(0.9, 0.3, 0.1, 1.0));
}`
    };

    if (typeExampleMap[name]) {
      return typeExampleMap[name];
    }

    return `#version 460

void main() {
    ${name} value = ${/vec/i.test(name) ? `${name}(1.0)` : /mat/i.test(name) ? `${name}(1.0)` : `${name}(0)`};
}`;
  }

  return `#version 460

void main() {
    // مثال ابتدائي للعنصر ${name}
}`;
}

const buildGlslReferenceTooltipUncached = buildGlslReferenceTooltip;
buildGlslReferenceTooltip = function buildGlslReferenceTooltipCached(item) {
  return readGlslCachedItemText(glslReferenceTooltipCache, item, buildGlslReferenceTooltipUncached);
};

const renderGlslTechnicalProseUncached = renderGlslTechnicalProse;
renderGlslTechnicalProse = function renderGlslTechnicalProseCached(text) {
  const source = normalizeGlslExplanationText(decodeBasicHtmlEntities(String(text || '')).trim());
  if (!source || /<\/?(?:a|code|span|strong|em|br)\b/i.test(source)) {
    return renderGlslTechnicalProseUncached(text);
  }
  return readGlslCachedText(glslTechnicalProseCache, source, () => renderGlslTechnicalProseUncached(source));
};

const buildGlslCompilerRoleTextUncached = buildGlslCompilerRoleText;
buildGlslCompilerRoleText = function buildGlslCompilerRoleTextCached(item) {
  return readGlslCachedItemText(glslCompilerRoleTextCache, item, buildGlslCompilerRoleTextUncached);
};

const buildGlslTranslationReadTextUncached = buildGlslTranslationReadText;
buildGlslTranslationReadText = function buildGlslTranslationReadTextCached(item) {
  return readGlslCachedItemText(glslTranslationReadCache, item, buildGlslTranslationReadTextUncached);
};

const buildGlslCompilationEffectTextUncached = buildGlslCompilationEffectText;
buildGlslCompilationEffectText = function buildGlslCompilationEffectTextCached(item) {
  return readGlslCachedItemText(glslCompilationEffectCache, item, buildGlslCompilationEffectTextUncached);
};

const buildGlslVulkanBridgeTextUncached = buildGlslVulkanBridgeText;
buildGlslVulkanBridgeText = function buildGlslVulkanBridgeTextCached(item) {
  return readGlslCachedItemText(glslVulkanBridgeCache, item, buildGlslVulkanBridgeTextUncached);
};

const buildGlslReferenceExampleUncached = buildGlslReferenceExample;
buildGlslReferenceExample = function buildGlslReferenceExampleCached(item) {
  return readGlslCachedItemText(glslReferenceExampleCache, item, buildGlslReferenceExampleUncached);
};

function renderGlslCompilerRoleSection(item) {
  const paragraphs = [
    buildGlslCompilerRoleText(item)
  ].filter(Boolean);
  const examples = buildGlslCompilerRoleExamples(item);

  return `
    ${paragraphs.map((text) => `<p>${renderGlslTechnicalProse(text)}</p>`).join('')}
    ${examples.length ? `
      <div class="glsl-compiler-role-examples">
        <p><strong>أمثلة ربط صريحة:</strong></p>
        ${renderGlslCodeSnippetGroup(examples, 'ربط GLSL')}
      </div>
    ` : ''}
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
  ffmpeg: 'FFmpeg',
  imgui: 'Dear ImGui',
  glslang: 'GLSLang',
  'sdl3-core': 'SDL3',
  'sdl3-audio': 'SDL3Audio',
  'sdl3-image': 'SDL3_image',
  'sdl3-mixer': 'SDL3_mixer',
  'sdl3-ttf': 'SDL3_ttf'
});

const CANONICAL_REFERENCE_LIBRARY_ICON_TYPES = Object.freeze({
  cmake: 'file',
  vulkan: 'file',
  ffmpeg: 'file',
  imgui: 'imgui',
  glslang: 'glsl',
  'sdl3-core': 'sdl3',
  'sdl3-audio': 'sdl3',
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

function getCppHomeConfig() {
  return cppHomeRuntime?.getCppHomeConfig?.() || {};
}

function getCppHomeSections() {
  return cppHomeRuntime?.getCppHomeSections?.() || [];
}

function buildCppSectionSidebarTooltip(section = {}) {
  return cppHomeRuntime?.buildCppSectionSidebarTooltip?.(section) || section.description || 'قسم من مرجع C++ المحلي.';
}

function renderCppSidebarTokenItems(tokens = [], fallbackIconType = 'cpp') {
  return (tokens || []).map((token) => {
    const item = buildCppReferenceItem(token);
    const tooltip = buildCppReferenceTooltip(item) || token;
    return `
      <div class="nav-item" data-nav-type="cpp" data-nav-name="${escapeAttribute(token)}" data-tooltip="${escapeAttribute(tooltip)}" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
        <span>${renderEntityIcon(token.startsWith('std::') ? 'structure' : fallbackIconType, 'ui-codicon nav-icon', token)}</span>
        <span>${escapeHtml(token)}</span>
      </div>
    `;
  }).join('');
}

function normalizeCppSidebarGroups(section = {}) {
  const subsections = Array.isArray(section?.subsections) ? section.subsections : [];
  if (!subsections.length) {
    return [];
  }

  return subsections.flatMap((subsection) => {
    const nested = Array.isArray(subsection?.subsections) ? subsection.subsections : [];
    if (nested.length) {
      return nested.map((entry) => ({
        key: `${subsection.key || 'group'}-${entry.key || 'items'}`,
        title: entry.title || subsection.title || 'تصنيف C++',
        iconType: entry.iconType || subsection.iconType || section.iconType || 'cpp',
        tokens: Array.isArray(entry.tokens) ? entry.tokens : [],
        description: entry.description || subsection.description || section.description || ''
      }));
    }

    return [{
      key: subsection.key || 'group',
      title: subsection.title || 'تصنيف C++',
      iconType: subsection.iconType || section.iconType || 'cpp',
      tokens: Array.isArray(subsection.tokens) ? subsection.tokens : [],
      description: subsection.description || section.description || ''
    }];
  }).filter((group) => group.title && Array.isArray(group.tokens) && group.tokens.length);
}

function renderCppSidebarSubsections(section = {}) {
  const groups = normalizeCppSidebarGroups(section);
  if (!groups.length) {
    return renderCppSidebarTokenItems(section.tokens || [], section.iconType || 'cpp');
  }

  return groups.map((group) => `
    <div class="nav-constant-group file-nav-group cpp-subsection-nav-group collapsed" data-cpp-group="${escapeAttribute(section.key)}-${escapeAttribute(group.key)}">
      <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
        <span class="nav-constant-group-title-wrap">
          <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
          <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
        </span>
        <span class="nav-constant-group-count">${group.tokens.length}</span>
      </div>
      <div class="nav-constant-group-items">
        ${group.description ? `<div class="nav-group-description">${escapeHtml(group.description)}</div>` : ''}
        ${renderCppSidebarTokenItems(group.tokens || [], group.iconType || section.iconType || 'cpp')}
      </div>
    </div>
  `).join('');
}

function populateCppList() {
  const container = document.getElementById('cpp-list');
  if (!container) {
    return;
  }

  const config = getCppHomeConfig();
  const sections = getCppHomeSections();
  const totalCount = sections.reduce((total, section) => total + (Number(section.count) || 0), 0);
  const countEl = document.getElementById('cpp-cluster-count');
  if (countEl) {
    countEl.textContent = String(totalCount || 0);
  }

  container.innerHTML = `
    <div class="nav-item" data-nav-type="cpp-index" data-nav-name="cpp" data-tooltip="${escapeAttribute(config?.meta?.description || 'يفتح مدخل C++ المحلي بنفس أسلوب بقية المكتبات.')}" tabindex="0" role="button">
      <span>${renderEntityIcon('cpp', 'ui-codicon nav-icon', 'C++')}</span>
      <span>مدخل C++</span>
    </div>
    <div class="nav-item" data-nav-type="cpp" data-nav-name="cpp-language-guide" data-tooltip="يفتح صفحة شرح تقنية شاملة تبني فهم C++ من داخل اللغة نفسها: المتغيرات، الدوال، النطاق، العمر الزمني، الثابتية، والأصناف." tabindex="0" role="button">
      <span>${renderEntityIcon('tutorial', 'ui-codicon nav-icon', 'دليل')}</span>
      <span>دليل فهم C++</span>
    </div>
    ${sections.map((section) => `
      <div class="nav-section cpp-reference-kind-section collapsed">
        <div class="nav-section-header" onclick="toggleSection('cpp-${escapeAttribute(section.key)}-list')">
          <h3>${renderEntityIcon(section.iconType || 'cpp', 'ui-codicon nav-icon', section.title)} ${escapeHtml(section.title)} <span class="nav-section-inline-count">${Number(section.count) || 0}</span></h3>
          <span class="icon">▼</span>
        </div>
        <div id="cpp-${escapeAttribute(section.key)}-list" class="nav-items">
          <div class="nav-item" data-nav-type="cpp-index" data-nav-name="${escapeAttribute(section.key)}" data-tooltip="${escapeAttribute(buildCppSectionSidebarTooltip(section))}" tabindex="0" role="button">
            <span>${renderEntityIcon(section.iconType || 'cpp', 'ui-codicon nav-icon', section.title)}</span>
            <span>فهرس ${escapeHtml(section.title)}</span>
          </div>
          ${renderCppSidebarSubsections(section)}
        </div>
      </div>
    `).join('')}
  `;
}

async function showCppIndex(sectionKey = '', options = {}) {
  const content = document.getElementById('mainContent');
  if (!content) {
    return;
  }

  if (typeof ensureUiSegment === 'function') {
    await ensureUiSegment('cppReferenceData');
    await ensureUiSegment('cppHome');
  }

  populateCppList();

  const config = getCppHomeConfig();
  const allSections = getCppHomeSections();
  const activeSectionKey = String(sectionKey || '').trim();
  const sections = activeSectionKey
    ? allSections.filter((section) => section.key === activeSectionKey)
    : allSections;
  const totalCount = allSections.reduce((total, section) => total + (Number(section.count) || 0), 0);

  content.innerHTML = `
    <div class="page-header">
      <nav class="breadcrumb">
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <span>مرجع C++</span>
      </nav>
      <h1>${renderEntityIcon('cpp', 'ui-codicon page-icon', 'C++')} ${escapeHtml(config?.meta?.title || 'C++')}</h1>
      <p>${escapeHtml(config?.meta?.description || 'مدخل عربي عملي إلى عناصر C++ الأساسية داخل المشروع.')}</p>
    </div>

    <section class="info-section">
      ${renderTutorialInfoGrid([
        {
          label: 'فلسفة القسم',
          value: '<strong>شرح دلالي + روابط داخلية</strong>',
          note: escapeHtml(config?.meta?.summaryNote || 'يبني هذا المسار نواة C++ بنفس أسلوب بقية المكتبات المحلية.')
        },
        {
          label: 'العناصر الأولية',
          value: `<strong>${escapeHtml(String(totalCount || 0))}</strong>`,
          note: 'هذه دفعة أولى خفيفة لتثبيت القوائم والروابط والشرح قبل التوسع الكبير.'
        },
        {
          label: 'حالة المرحلة',
          value: '<strong>تأسيس C++ Home</strong>',
          note: escapeHtml(config?.meta?.statusNote || 'هذه بداية المسار، وسيُبنى فوقها لاحقًا مرجع ودروس وأمثلة أوسع.')
        }
      ])}
    </section>

    ${sections.map((section) => `
      <section class="category-section">
        <h2>${renderEntityIcon(section.iconType || 'cpp', 'ui-codicon section-icon', section.title)} ${escapeHtml(section.title)}</h2>
        <p class="page-description">${escapeHtml(section.description || '')}</p>
        <div class="items-grid">
          ${(section.tokens || []).map((token) => {
            const item = buildCppReferenceItem(token);
            return `
              <div class="item-card" onclick="showCppReference('${escapeAttribute(token)}')">
                <span class="item-icon">${renderEntityIcon(token.startsWith('std::') ? 'structure' : (section.iconType || 'cpp'), 'ui-codicon card-icon', token)}</span>
                <span class="item-name">${escapeHtml(token)}</span>
                <span class="item-category">${escapeHtml(item.type || 'مرجع C++')}</span>
                <p>${escapeHtml(item.description || '')}</p>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `).join('')}

    <section class="home-section">
      <h2>🔗 أهم المراجع</h2>
      <ul class="useful-links">
        ${(config?.meta?.references || []).map((reference) => `
          <li><a href="${escapeAttribute(reference.href)}" target="_blank" rel="noopener noreferrer">${renderEntityIcon('file', 'ui-codicon list-icon', reference.label)} ${escapeHtml(reference.label)}</a></li>
        `).join('')}
      </ul>
    </section>
  `;

  document.title = `مرجع C++ - ${APP_BRAND_TITLE}`;
  syncRouteHistory(activeSectionKey ? `cpp-index/${encodeURIComponent(activeSectionKey)}` : 'cpp-index', options);
  scrollMainContentToTop();
  setActiveSidebarItemBySelector(
    'cpp-list',
    activeSectionKey
      ? `.nav-item[data-nav-type="cpp-index"][data-nav-name="${escapeSelectorValue(activeSectionKey)}"]`
      : `.nav-item[data-nav-type="cpp-index"][data-nav-name="cpp"]`
  );
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

function showSiteUsageGuide(options = {}) {
  const run = async () => {
    await ensureUiSegment('homePageRuntime');
    return getHomePageRuntime()?.showSiteUsageGuide?.(options);
  };
  return run();
}
