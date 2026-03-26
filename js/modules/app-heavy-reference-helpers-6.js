// ArabicVulkan - extracted post-app heavy bootstrap/runtime block from js/app.js (phase327)

let VULKAN_EXAMPLE_GUIDES = Object.freeze({});
let VULKAN_PARAMETER_OVERRIDES = Object.freeze({});
let SDL3_EXAMPLE_GUIDES = Object.freeze({});
let IMGUI_EXAMPLE_GUIDES = Object.freeze({});
let IMGUI_PARAMETER_OVERRIDES = Object.freeze({});
let GLSL_EXAMPLE_GUIDES = Object.freeze({});
let GLSL_EXAMPLE_TOOLTIP_OVERRIDES = Object.freeze({});
let CPP_REFERENCE_DATA = Object.freeze({});
let CPP_REFERENCE_ENRICHMENT = Object.freeze({});
let CPP_REFERENCE_OFFICIAL_LINKS = Object.freeze({});
let CPP_REFERENCE_GUIDES = Object.freeze({});
let CPP_DEEP_GUIDES = Object.freeze({});
let CPP_REFERENCE_TOOLTIP_OVERRIDES = Object.freeze({});
let CPP_HOME_DATA = Object.freeze({});
let appDataRuntime = null;
let sdl3PackageDataRuntime = null;
let appLoadRuntime = null;
const getAvailableSegmentChunkKeys = (...args) => appDataRuntime?.getAvailableSegmentChunkKeys?.(...args) || [];
const getDataSegmentChunkSource = (...args) => appDataRuntime?.getDataSegmentChunkSource?.(...args) || '';
const isDataSegmentLoaded = (...args) => appDataRuntime?.isDataSegmentLoaded?.(...args) || false;
const markDataSegmentLoaded = (...args) => appDataRuntime?.markDataSegmentLoaded?.(...args);
const markCurrentDataChunksLoaded = (...args) => appDataRuntime?.markCurrentDataChunksLoaded?.(...args);
const mergeCategoryCollections = (...args) => appDataRuntime?.mergeCategoryCollections?.(...args) || {};
const applyLoadedData = (...args) => appDataRuntime?.applyLoadedData?.(...args);
const fetchJsonData = (...args) => appDataRuntime?.fetchJsonData?.(...args) || Promise.reject(new Error('تعذر الوصول إلى fetchJsonData runtime'));
const ensureDataSegment = (...args) => appDataRuntime?.ensureDataSegment?.(...args) || Promise.resolve();
const refreshDynamicSearchSubFilterConfig = (...args) => appDataRuntime?.refreshDynamicSearchSubFilterConfig?.(...args);
const loadDeferredScript = (...args) => appDataRuntime?.loadDeferredScript?.(...args) || Promise.reject(new Error('تعذر الوصول إلى loadDeferredScript runtime'));
const applyUiSegmentData = (...args) => appDataRuntime?.applyUiSegmentData?.(...args);
const loadImguiJsonManifest = (...args) => appDataRuntime?.loadImguiJsonManifest?.(...args) || Promise.resolve();
const loadGlslJsonManifest = (...args) => appDataRuntime?.loadGlslJsonManifest?.(...args) || Promise.resolve();
const loadGameUiJsonManifest = (...args) => appDataRuntime?.loadGameUiJsonManifest?.(...args) || Promise.resolve();
const applyUiSegmentJsonData = (...args) => appDataRuntime?.applyUiSegmentJsonData?.(...args) || Promise.resolve();
const hasUiSegmentPayload = (...args) => appDataRuntime?.hasUiSegmentPayload?.(...args) || true;
const ensureUiSegment = (...args) => appDataRuntime?.ensureUiSegment?.(...args) || Promise.resolve();
function linkUsageBridgeText(text, options = {}) {
  const globalFn = typeof window.linkUsageBridgeText === 'function'
    ? window.linkUsageBridgeText
    : null;
  if (globalFn) {
    return globalFn(text, options);
  }
  const runtimeFn = window.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__?.linkUsageBridgeText;
  if (typeof runtimeFn === 'function') {
    return runtimeFn(text, options);
  }
  return String(text || '');
}
const isSdl3PackageDataLoaded = (...args) => sdl3PackageDataRuntime?.isSdl3PackageDataLoaded?.(...args) || false;
const markSdl3PackageKindLoaded = (...args) => sdl3PackageDataRuntime?.markSdl3PackageKindLoaded?.(...args);
const markAllSdl3PackageKindsLoaded = (...args) => sdl3PackageDataRuntime?.markAllSdl3PackageKindsLoaded?.(...args);
const isSdl3PackageKindDataLoaded = (...args) => sdl3PackageDataRuntime?.isSdl3PackageKindDataLoaded?.(...args) || false;
const ensureSdl3PackageData = (...args) => sdl3PackageDataRuntime?.ensureSdl3PackageData?.(...args) || Promise.resolve();
const ensureSdl3PackageKindData = (...args) => sdl3PackageDataRuntime?.ensureSdl3PackageKindData?.(...args) || Promise.resolve();
const ensureSdl3SectionData = (...args) => sdl3PackageDataRuntime?.ensureSdl3SectionData?.(...args) || Promise.resolve();
const ensureSdl3PackageSidebarData = (...args) => sdl3PackageDataRuntime?.ensureSdl3PackageSidebarData?.(...args) || Promise.resolve();
const ensureAllSdl3PackageData = (...args) => sdl3PackageDataRuntime?.ensureAllSdl3PackageData?.(...args) || Promise.resolve();
const warmupSidebarDataInBackground = (...args) => appLoadRuntime?.warmupSidebarDataInBackground?.(...args);
const warmupSearchIndex = (...args) => appLoadRuntime?.warmupSearchIndex?.(...args);
const setSidebarClusterCount = (...args) => appLoadRuntime?.setSidebarClusterCount?.(...args);
const setSidebarSectionCount = (...args) => appLoadRuntime?.setSidebarSectionCount?.(...args);
const computeVulkanSidebarClusterCount = (...args) => appLoadRuntime?.computeVulkanSidebarClusterCount?.(...args) || 0;
const updateVulkanSidebarSectionCounts = (...args) => appLoadRuntime?.updateVulkanSidebarSectionCounts?.(...args);
const warmupSidebarClusterCounts = (...args) => appLoadRuntime?.warmupSidebarClusterCounts?.(...args) || Promise.resolve();
const loadFallbackData = (...args) => appLoadRuntime?.loadFallbackData?.(...args);
const loadData = (...args) => appLoadRuntime?.loadData?.(...args) || Promise.resolve();

// تصدير مبكر لتفادي كسر الاستدعاءات العالمية إذا حدث خطأ لاحق أثناء تهيئة app.js.
window.ensureUiSegment = (...args) => ensureUiSegment(...args);

const runtimeAgentController = createRuntimeAgentController({
  loadDeferredScript: (sourcePath, segment) => loadDeferredScript(sourcePath, segment),
  warn: (...args) => console.warn(...args)
});
const appTextLoader = createAppTextLoader({
  sourcePath: APP_TEXT_SOURCE,
  fetchJsonData: (sourcePath) => fetchJsonData(sourcePath),
  getEmbeddedData: () => window.__ARABIC_VULKAN_APP_TEXT__
});


// البيانات المحملة
let vulkanData = {
  commands: {},
  structures: {},
  enums: {},
  constants: {},
  macros: {}
};
let vulkanMeta = {};

// حالة التطبيق
let currentView = 'home';
let tooltipElement = null;
let activeTooltipTarget = null;
let tooltipSystemInitialized = false;
const dataSegmentSources = DATA_SEGMENT_SOURCES;
const dataSegmentLoaded = createDataSegmentLoadedState();
const dataSegmentPromises = createDataSegmentPromiseState();
const uiSegmentSources = UI_SEGMENT_SOURCES;
const uiSegmentLoaded = createUiSegmentLoadedState();
const uiSegmentPromises = createUiSegmentPromiseState();
const sdl3PackageSegmentSources = SDL3_PACKAGE_SEGMENT_SOURCES;
const sdl3PackageKindSegmentSources = SDL3_PACKAGE_KIND_SEGMENT_SOURCES;
const sdl3PackageSegmentLoaded = createSdl3PackageSegmentLoadedState();
const sdl3PackageKindSegmentLoaded = createSdl3PackageKindLoadedState();
const sdl3PackageSegmentPromises = createSdl3PackagePromiseState();
const sdl3PackageKindSegmentPromises = createSdl3PackagePromiseState();


appDataRuntime = createAppDataRuntime
  ? createAppDataRuntime({
      appAssetVersion: APP_ASSET_VERSION,
      dataSegmentSources,
      dataSegmentLoaded,
      dataSegmentPromises,
      uiSegmentSources,
      uiSegmentLoaded,
      uiSegmentPromises,
      getAvailableSegmentChunkKeysFromRegistry,
      getDataSegmentChunkSourceFromRegistry,
      isDataSegmentLoadedFromRegistry,
      markDataSegmentLoadedFromRegistry,
      getVulkanMeta: () => vulkanMeta,
      setVulkanMeta: (nextMeta) => {
        vulkanMeta = nextMeta;
      },
      getVulkanData: () => vulkanData,
      invalidateSearchIndex: () => window.__ARABIC_VULKAN_SEARCH__?.invalidateSearchIndex?.(),
      resetClickNavigationDerivedCaches: () => resetClickNavigationDerivedCaches(),
      getDynamicSearchSubfilters: () => ({
        cpp: Object.fromEntries(
          (CPP_HOME_DATA?.sections || []).map((section) => [section.key, section.title])
        ),
        glsl: Object.fromEntries(
          Object.entries(glslReferenceSections || {}).map(([key, section]) => [key, section.title])
        ),
        imgui: Object.fromEntries(
          Object.entries(imguiReferenceSections || {}).map(([key, section]) => [key, section.title])
        ),
        cmake: Object.fromEntries(
          (cmakeSearchMeta?.sections || []).map((section) => [section.key, section.title])
        ),
        files: Object.fromEntries(
          Object.entries(vulkanFileSections || {}).map(([key, section]) => [key, section.title])
        ),
        sdl3: getAppTextValue('SDL3_SEARCH_SUBFILTERS')
      }),
      setSearchDynamicSubfilters: (config) => window.__ARABIC_VULKAN_SEARCH__?.setDynamicSubfilters?.(config),
      buildTutorialContentFromLayouts: (layouts = {}) => buildTutorialContentFromLayouts(layouts),
      ensureTutorialUiRuntime: async () => runtimeAgentController.ensureRuntimeAgent(TUTORIAL_UI_RUNTIME_KEY),
      mergeSdl3EntityPayload: (nextData = {}) => mergeSdl3EntityPayload(nextData),
      applySdl3LexiconData: (data = {}) => applySdl3LexiconData(data),
      applySdl3TooltipOverrideData: (data = {}) => applySdl3TooltipOverrideData(data),
      applySdl3ExampleGuideData: (data = {}) => applySdl3ExampleGuideData(data),
      applyVulkanExampleGuideData: (data = {}) => applyVulkanExampleGuideData(data),
      applyVulkanParameterOverrideData: (data = {}) => applyVulkanParameterOverrideData(data),
      applyImguiExampleGuideData: (data = {}) => applyImguiExampleGuideData(data),
      applyImguiParameterOverrideData: (data = {}) => applyImguiParameterOverrideData(data),
      applyGlslExampleGuideData: (data = {}) => applyGlslExampleGuideData(data),
      applyGlslExampleTooltipOverrideData: (data = {}) => applyGlslExampleTooltipOverrideData(data),
      applyCppReferenceData: (data = {}) => applyCppReferenceData(data),
      applyCppReferenceEnrichmentData: (data = {}) => applyCppReferenceEnrichmentData(data),
      applyCppReferenceOfficialLinksData: (data = {}) => applyCppReferenceOfficialLinksData(data),
      applyCppReferenceGuideData: (data = {}) => applyCppReferenceGuideData(data),
      applyCppReferenceTooltipOverrideData: (data = {}) => applyCppReferenceTooltipOverrideData(data),
      applyCppHomeData: (data = {}) => applyCppHomeData(data),
      applyVulkanSearchTables: (data = {}) => applyVulkanSearchTables(data),
      buildFileReferenceData: () => buildFileReferenceData(),
      applyImguiStaticData: (staticData = {}) => applyImguiStaticData(staticData),
      getTutorialCatalog: () => tutorialCatalog,
      setTutorialCatalog: (value) => {
        tutorialCatalog = value;
      },
      setTutorialVariableHints: (value) => {
        tutorialVariableHints = value;
      },
      setTutorialConceptReferenceData: (value) => {
        tutorialConceptReferenceData = value;
      },
      setTutorialContent: (value) => {
        tutorialContent = value;
      },
      getGlslReferenceSections: () => glslReferenceSections,
      setGlslReferenceSections: (value) => {
        glslReferenceSections = value;
      },
      setGlslReadyExamples: (value) => {
        glslReadyExamples = value;
      },
      resetGlslCaches: () => {
        glslReferenceItemsCache = null;
        glslReferenceItemLookupCache = null;
        glslReferenceTooltipCache = new WeakMap();
        glslReferenceExampleCache = new WeakMap();
        glslCompilerRoleTextCache = new WeakMap();
        glslTranslationReadCache = new WeakMap();
        glslCompilationEffectCache = new WeakMap();
        glslVulkanBridgeCache = new WeakMap();
        glslTechnicalProseCache = new Map();
      },
      getImguiReferenceSections: () => imguiReferenceSections,
      setImguiMeta: (value) => {
        imguiMeta = value;
      },
      setImguiReferenceSections: (value) => {
        imguiReferenceSections = value;
      },
      resetImguiCaches: () => {
        imguiReferenceItemsCache = null;
        imguiReferenceItemLookupCache = null;
        imguiStandaloneExampleItemsCache = null;
        imguiStandaloneExampleItemLookupCache = null;
      },
      getGameUiMeta: () => gameUiMeta,
      setGameUiMeta: (value) => {
        gameUiMeta = value;
      },
      getGameUiSections: () => gameUiSections,
      setGameUiSections: (value) => {
        gameUiSections = value;
      },
      setGameUiSectionManifest: (value) => {
        gameUiSectionManifest = value;
      },
      resetGameUiCaches: () => {
        gameUiReferenceItemsCache = null;
        gameUiReferenceItemLookupCache = null;
      },
      setVulkanFileSections: (value) => {
        vulkanFileSections = value;
      },
      setFileReferenceOverrides: (value) => {
        fileReferenceOverrides = value;
      },
      setFileReferenceData: (value) => {
        fileReferenceData = value;
      },
      getSdl3ReferenceSections: () => sdl3ReferenceSections,
      setSdl3ReferenceSections: (value) => {
        sdl3ReferenceSections = value;
      },
      getSdl3PackageMeta: () => sdl3PackageMeta,
      setSdl3PackageMeta: (value) => {
        sdl3PackageMeta = value;
      },
      setSdl3CoreFunctionRelations: (value) => {
        sdl3CoreFunctionRelations = value;
      },
      setSdl3CoreSymbolIndex: (value) => {
        sdl3CoreSymbolIndex = value;
      },
      resetSdl3CoreSymbolIndexLookup: () => {
        sdl3CoreSymbolIndexLookup = null;
      },
      setSdl3SearchEntries: (value) => {
        sdl3SearchEntries = value;
      },
      getCmakeSearchMeta: () => cmakeSearchMeta,
      setCmakeSearchMeta: (value) => {
        cmakeSearchMeta = value;
      },
      setCmakeSearchEntries: (value) => {
        cmakeSearchEntries = value;
      },
      setFfmpegSearchEntries: (value) => {
        ffmpegSearchEntries = value;
      }
    })
  : null;

sdl3PackageDataRuntime = createSdl3PackageDataRuntime
  ? createSdl3PackageDataRuntime({
      SDL3_ENTITY_BASE_DATA_KEYS,
      sdl3PackageSegmentSources,
      sdl3PackageKindSegmentSources,
      sdl3PackageSegmentLoaded,
      sdl3PackageKindSegmentLoaded,
      sdl3PackageSegmentPromises,
      sdl3PackageKindSegmentPromises,
      getSdl3EntityBaseDataKey,
      ensureUiSegment: (...args) => ensureUiSegment(...args),
      fetchJsonData: (...args) => fetchJsonData(...args),
      mergeSdl3EntityPayload: (...args) => mergeSdl3EntityPayload(...args),
      getSdl3VisiblePackageKeys: (...args) => getSdl3VisiblePackageKeys(...args)
    })
  : null;

appLoadRuntime = createAppLoadRuntime
  ? createAppLoadRuntime({
      uiSegmentSources: UI_SEGMENT_SOURCES,
      dataSegmentSources,
      getVulkanData: () => vulkanData,
      replaceVulkanData: (nextData = {}) => {
        vulkanData.commands = nextData.commands || {};
        vulkanData.structures = nextData.structures || {};
        vulkanData.enums = nextData.enums || {};
        vulkanData.constants = nextData.constants || {};
        vulkanData.macros = nextData.macros || {};
      },
      setVulkanMeta: (nextMeta) => {
        vulkanMeta = nextMeta || {};
      },
      getTutorialCatalog: () => tutorialCatalog,
      getGroupedVulkanReadyExamples: (...args) => getGroupedVulkanReadyExamples(...args),
      getVariableTypeCollections: (...args) => getVariableTypeCollections(...args),
      getAllConstantReferenceEntries: (...args) => getAllConstantReferenceEntries(...args),
      getFileReferenceData: () => fileReferenceData,
      fetchJsonData: (...args) => fetchJsonData(...args),
      applyLoadedData: (...args) => applyLoadedData(...args),
      markDataSegmentLoaded: (...args) => markDataSegmentLoaded(...args),
      markCurrentDataChunksLoaded: (...args) => markCurrentDataChunksLoaded(...args),
      populateSidebar: (...args) => populateSidebar(...args),
      showHomePage: (...args) => showHomePage(...args),
      ensureSearchIndex: () => window.__ARABIC_VULKAN_SEARCH__?.ensureSearchIndex?.(),
      log: (...args) => console.log(...args),
      warn: (...args) => console.warn(...args),
      error: (...args) => console.error(...args)
    })
  : null;

const tooltipRuntime = createTooltipRuntime
  ? createTooltipRuntime({
      sanitizeTooltipText,
      getCurrentView: () => currentView
    })
  : null;
const compactSemanticTooltipText = (...args) => tooltipRuntime?.compactSemanticTooltipText(...args) || '';
const buildSemanticTooltipTitle = (...args) => tooltipRuntime?.buildSemanticTooltipTitle(...args) || '';
const composeSemanticTooltip = (...args) => tooltipRuntime?.composeSemanticTooltip(...args) || '';
const getTooltipTargetLabel = (...args) => tooltipRuntime?.getTooltipTargetLabel(...args) || 'هذا العنصر';
const inferTooltipLibraryFromTarget = (...args) => tooltipRuntime?.inferTooltipLibraryFromTarget(...args) || 'المشروع';
const inferUiTooltipRoleMeta = (...args) => tooltipRuntime?.inferUiTooltipRoleMeta(...args) || {
  kindLabel: 'مساعدة واجهة',
  typeLabel: 'Tooltip سياقي',
  whyExists: '',
  whyUse: '',
  actualUsage: ''
};
const rewriteTooltipForDisplay = (...args) => tooltipRuntime?.rewriteTooltipForDisplay(...args) || sanitizeTooltipText(args[1] || '');

window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__ = {
  composeSemanticTooltip,
  compactSemanticTooltipText,
  rewriteTooltipForDisplay
};

const cppGlfwRuntime = createCppGlfwRuntime
  ? createCppGlfwRuntime({
      getAppTextValue,
      composeSemanticTooltip,
      escapeAttribute,
      escapeHtml,
      safeRenderEntityLabel
    })
  : null;
const getGlfwReferenceProfile = (...args) => cppGlfwRuntime?.getGlfwReferenceProfile(...args) || null;
const buildGlfwReferenceTooltip = (...args) => cppGlfwRuntime?.buildGlfwReferenceTooltip(...args) || '';
const renderGlfwReferenceToken = (...args) => cppGlfwRuntime?.renderGlfwReferenceToken(...args) || escapeHtml(String(args[0] || ''));
const getCppReferenceProfile = (...args) => cppGlfwRuntime?.getCppReferenceProfile(...args) || null;
const cppKeywordTokens = cppGlfwRuntime?.getCppKeywordTokens?.() || new Set();

function buildCppReferenceItem(name, baseItem = {}) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.buildCppReferenceItem
    ? runtime.buildCppReferenceItem(name, baseItem)
    : {title: String(name || '').trim(), referenceUrl: ''};
}

function buildCppReferenceTooltip(item) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.buildCppReferenceTooltip
    ? runtime.buildCppReferenceTooltip(item)
    : '';
}

const bashKeywordTokens = new Set([
  'if', 'then', 'else', 'fi', 'for', 'in', 'do', 'done', 'while', 'case',
  'esac', 'function', 'export', 'local', 'return'
]);

const cmakeKeywordTokens = new Set([
  'cmake_minimum_required',
  'project',
  'set',
  'unset',
  'message',
  'list',
  'foreach',
  'endforeach',
  'while',
  'endwhile',
  'if',
  'else',
  'elseif',
  'endif',
  'macro',
  'endmacro',
  'function',
  'endfunction',
  'return',
  'break',
  'continue',
  'include',
  'find_package',
  'find_library',
  'find_path',
  'find_file',
  'find_program',
  'add_executable',
  'add_library',
  'add_subdirectory',
  'add_custom_command',
  'add_custom_target',
  'target_link_libraries',
  'target_compile_definitions',
  'target_include_directories',
  'target_compile_options',
  'target_sources',
  'target_link_options',
  'target_precompile_headers',
  'set_target_properties',
  'get_target_property',
  'set_property',
  'get_property',
  'define_property',
  'option',
  'configure_file',
  'file',
  'execute_process',
  'install',
  'enable_testing',
  'add_test',
  'ctest',
  'string',
  'math',
  'separate_arguments',
  'cmake_path',
  'block',
  'endblock'
]);

let tutorialCatalog = window.__ARABIC_VULKAN_TUTORIALS__?.tutorialCatalog || [];

let tutorialVariableHints = window.__ARABIC_VULKAN_TUTORIALS__?.tutorialVariableHints || {};

let tutorialConceptReferenceData = window.__ARABIC_VULKAN_TUTORIALS__?.tutorialConceptReferenceData || {};

let glslReferenceSections = window.__ARABIC_VULKAN_GLSL__?.glslReferenceSections || {};
let glslReadyExamples = window.__ARABIC_VULKAN_GLSL__?.glslReadyExamples || [];
let glslReferenceItemLookupCache = null;

let imguiMeta = window.__ARABIC_VULKAN_IMGUI__?.imguiMeta || {};
let imguiReferenceSections = window.__ARABIC_VULKAN_IMGUI__?.imguiReferenceSections || {};
let imguiReferenceItemsCache = null;
let imguiReferenceItemLookupCache = null;
let imguiStandaloneExampleItemsCache = null;
let imguiStandaloneExampleItemLookupCache = null;
let imguiStaticTooltips = {};
let imguiKindMeta = {};
let imguiSectionIconMap = {};

let gameUiMeta = window.__ARABIC_VULKAN_GAME_UI__?.meta || {};
let gameUiSections = window.__ARABIC_VULKAN_GAME_UI__?.data || {};
let gameUiSectionManifest = {};
let gameUiReferenceItemsCache = null;
let gameUiReferenceItemLookupCache = null;

let sdl3ReferenceSections = {};
let sdl3PackageMeta = {};
let sdl3EntityData = createEmptySdl3EntityData();
let sdl3CoreFunctionRelations = [];
let sdl3CoreSymbolIndex = [];
let sdl3CoreSymbolIndexLookup = null;
let sdl3SearchEntries = [];
let cmakeSearchMeta = {
  displayName: 'CMake',
  displayNameArabic: 'CMake',
  description: 'مرجع عربي عملي لأوامر CMake ومتغيراته وخصائصه ووحداته وسياساته وتدفق configure/generate/build.',
  officialUrl: 'https://cmake.org/cmake/help/latest/',
  tutorialUrl: 'https://cmake.org/cmake/help/latest/guide/tutorial/index.html',
  sections: [
    {key: 'commands', title: 'الأوامر', count: 28, route: '#ref/cmake/commands', iconType: 'command'},
    {key: 'variables', title: 'المتغيرات', count: 10, route: '#ref/cmake/variables', iconType: 'variable'},
    {key: 'properties', title: 'الخصائص', count: 4, route: '#ref/cmake/properties', iconType: 'variable'},
    {key: 'modules', title: 'الوحدات', count: 4, route: '#ref/cmake/modules', iconType: 'file'},
    {key: 'policies', title: 'السياسات', count: 3, route: '#ref/cmake/policies', iconType: 'enum'},
    {key: 'expressions', title: 'التعبيرات', count: 1, route: '#ref/cmake/expressions', iconType: 'macro'},
    {key: 'presets', title: 'الضبطات المسبقة', count: 2, route: '#ref/cmake/presets', iconType: 'file'},
    {key: 'concepts', title: 'المفاهيم', count: 6, route: '#ref/cmake/concepts', iconType: 'tutorial'},
    {key: 'examples', title: 'الأمثلة', count: 9, route: '#ref/cmake/examples', iconType: 'tutorial'}
  ]
};
let cmakeSearchEntries = [];
let ffmpegSearchEntries = [];

const CMAKE_KIND_META = Object.freeze({
  commands: {label: 'أمر CMake', plural: 'أوامر CMake', icon: 'command'},
  variables: {label: 'متغير CMake', plural: 'متغيرات CMake', icon: 'variable'},
  properties: {label: 'خاصية CMake', plural: 'خصائص CMake', icon: 'variable'},
  modules: {label: 'وحدة CMake', plural: 'وحدات CMake', icon: 'file'},
  policies: {label: 'سياسة CMake', plural: 'سياسات CMake', icon: 'enum'},
  expressions: {label: 'تعبير CMake', plural: 'تعبيرات CMake', icon: 'macro'},
  presets: {label: 'Preset', plural: 'Presets', icon: 'file'},
  concepts: {label: 'مفهوم CMake', plural: 'مفاهيم CMake', icon: 'tutorial'},
  examples: {label: 'مثال CMake', plural: 'أمثلة CMake', icon: 'tutorial'}
});

const CMAKE_INLINE_SEMANTIC_TOKENS = Object.freeze({
  APPEND: {
    kindLabel: 'أمر فرعي في CMake',
    typeLabel: 'إلحاق قائمة',
    meaning: 'يعني أن list() سيضيف العناصر التالية إلى نهاية القائمة الحالية بدل استبدالها أو إعادة قراءتها فقط.',
    whyUse: 'يفيد عندما تبني قائمة تدريجيًا من عدة أسطر أو شروط بدل إعادة كتابة القيمة كلها كل مرة.',
    actualUsage: 'أثره العملي أن المتغير الحامل للقائمة يتغير فورًا أثناء configure، فتظهر العناصر الجديدة في أي foreach() أو target يقرأه بعد ذلك.'
  },
  IN: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'تحديد طريقة المرور',
    meaning: 'داخل foreach() تعلن أن العناصر التالية ستقرأ وفق صيغة محددة مثل LISTS أو ITEMS، لا على أنها اسم متغير الحلقة نفسه.',
    whyUse: 'تفصل بين اسم متغير الحلقة وبين الطريقة التي سيجلب بها CMake العناصر التي سيدور عليها.',
    actualUsage: 'أثرها العملي أنها تغيّر تفسير بقية الاستدعاء: بدونها قد يقرأ CMake عناصر مباشرة، ومعها ينتظر نمط المصدر المناسب بعدها.'
  },
  LISTS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'أسماء متغيرات قوائم',
    meaning: 'تعني أن ما يليها داخل foreach() هو أسماء متغيرات تحمل قوائم، وسيقوم CMake بتوسيعها إلى عناصر حقيقية قبل تنفيذ جسم الحلقة.',
    whyUse: 'تستخدم عندما تريد أن تدور على محتوى قائمة موجودة بالفعل بدل كتابة العناصر يدويًا داخل الاستدعاء.',
    actualUsage: 'أثرها العملي أن CMake يقرأ قيمة المتغيرات المشار إليها ثم يمر على عناصرها واحدةً واحدة أثناء configure.'
  },
  VERSION: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'خيار إصدار',
    meaning: 'تعني أن القيم التالية تمثل رقم إصدار أو حد توافق، وليست مجرد أرقام عابرة داخل الصياغة.',
    whyUse: 'يستخدمها المبرمج عندما يريد ربط الأمر بإصدار مشروع أو حزمة أو حد أدنى من CMake بصورة يفهمها CMake دلاليًا.',
    actualUsage: 'أثرها العملي يعتمد على السياق: قد تملأ متغيرات PROJECT_VERSION، أو تفرض حدًا أدنى، أو تدخل في ملفات package/version metadata.'
  },
  FATAL_ERROR: {
    kindLabel: 'خيار CMake',
    typeLabel: 'إيقاف قاتل',
    meaning: 'يجعل الرسالة أو الشرط الحالي فشلًا قاتلًا: أي إن CMake لن يطبع النص فقط، بل سيوقف configure في هذا الموضع.',
    whyUse: 'يستخدمه المبرمج عندما يكون غياب الشرط الحالي مانعًا حقيقيًا من إكمال المشروع أو عندما تصبح المتابعة مضللة.',
    actualUsage: 'يظهر غالبًا مع message() أو بعض صيغ التحقق ليحوّل المشكلة من تشخيص إلى توقف فعلي في التهيئة.'
  },
  LANGUAGES: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'تحديد لغات المشروع',
    meaning: 'تعلن اللغات التي يجب أن يجهز CMake مترجماتها وفحوصها لهذا المشروع، وليست مجرد تسمية توضيحية.',
    whyUse: 'تقلل التهيئة غير اللازمة وتوضح ما إذا كان المشروع يحتاج C أو CXX أو لغات إضافية فعلًا.',
    actualUsage: 'أثرها العملي أن CMake يقرر أي toolchains وفحوص لغة وخصائص افتراضية سيشغّلها أثناء configure.'
  },
  EXCLUDE_FROM_ALL: {
    kindLabel: 'خيار CMake',
    typeLabel: 'استبعاد من البناء الافتراضي',
    meaning: 'يمنع الهدف أو المجلد من الدخول في build الافتراضي الشامل إلا إذا طلبته صراحة.',
    whyUse: 'يستخدم للأمثلة أو الاختبارات أو الأهداف الجانبية التي لا تريد بناءها دائمًا.',
    actualUsage: 'يؤثر في الرسم البنائي الافتراضي لا في تعريف الهدف نفسه فقط.'
  },
  SYSTEM: {
    kindLabel: 'خيار CMake',
    typeLabel: 'مسار/ترويسة نظامية',
    meaning: 'يخبر CMake أو المصرّف أن المسارات التالية تعامل كمسارات نظامية لا كمسارات مشروع عادية.',
    whyUse: 'يفيد لتقليل التحذيرات القادمة من ترويسات خارجية أو لفصلها عن ترويسات المشروع.',
    actualUsage: 'يؤثر عادة في أعلام المصرّف الناتجة لا في النص فقط.'
  },
  PROPERTIES: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'قائمة خصائص',
    meaning: 'تعلن أن الأزواج التالية هي أسماء خصائص وقيمها وستكتب على الهدف أو الكيان المقصود.',
    whyUse: 'تسمح بتجميع أكثر من خاصية في استدعاء واحد بدل أوامر متفرقة.',
    actualUsage: 'يغيّر أثرها خصائص target أو directory أو source file بحسب الأمر الذي يحملها.'
  },
  COMMAND: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'أمر خارجي',
    meaning: 'تبدأ استدعاءً خارجيًا أو خطوة تنفيذ سيدخل في build graph أو في مرحلة الاختبار/التوليد.',
    whyUse: 'يستخدمها المبرمج عندما يريد ربط CMake بأداة خارجية أو توليد ملف أثناء البناء.',
    actualUsage: 'تظهر كثيرًا مع add_custom_command وadd_test.'
  },
  DEPENDS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'اعتماديات',
    meaning: 'تعلن الملفات أو الأهداف أو النواتج التي يعتمد عليها هذا الجزء قبل أن ينفذ.',
    whyUse: 'تمنع CMake من تشغيل خطوة قبل توفر مدخلاتها أو نواتجها السابقة.',
    actualUsage: 'تؤثر مباشرة في الرسم البنائي وعلاقات الترتيب بين الخطوات.'
  },
  ARGS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'وسائط أمر',
    meaning: 'تعني أن القيم التالية ستمرر كوسائط إلى الأمر أو الاختبار أو العملية الخارجية.',
    whyUse: 'تفيد لفصل اسم الأمر عن الوسائط التي تصله.',
    actualUsage: 'تظهر غالبًا مع add_test أو بعض الصيغ القديمة في add_custom_command.'
  },
  OUTPUT: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'ناتج مولد',
    meaning: 'تعلن الملفات التي سيولدها الأمر فعليًا.',
    whyUse: 'بدونها لا يفهم CMake ما هي المخرجات التي ستدخل لاحقًا كاعتماديات.',
    actualUsage: 'تربط الأمر بنواتجه داخل build graph.'
  },
  NAME: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'اسم منطقي',
    meaning: 'تضبط الاسم المنطقي أو المرئي للكيان الذي يبنيه الأمر أو يعرفه.',
    whyUse: 'تستخدم عندما يهمك الاسم الذي ستستدعيه به الأوامر الأخرى أو تعرضه التقارير.',
    actualUsage: 'تغير التسمية لا الجوهر التنفيذي وحده.'
  },
  DESTINATION: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'وجهة تثبيت/نسخ',
    meaning: 'تحدد المجلد النهائي الذي ستوضع فيه الملفات أثناء install أو copy.',
    whyUse: 'تجعل شجرة التثبيت واضحة ومقسمة بحسب نوع النواتج.',
    actualUsage: 'تؤثر في install step وفي المسارات التي سيستخدمها المستهلك لاحقًا.'
  },
  COMPONENTS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'مكونات فرعية',
    meaning: 'تعني أن العناصر التالية تمثل مكونات فرعية محددة، لا أسماء عامة إضافية بلا معنى.',
    whyUse: 'تفيد عندما لا تحتاج الحزمة كلها بل مجموعة أجزاء بعينها مثل وحدات أو backends أو أدوات مساندة محددة.',
    actualUsage: 'أثرها العملي أنها تقيد ما سيبحث عنه CMake أو ما سيعامله كتثبيت/استهلاك ناجح بحسب السياق.'
  },
  REQUIRED: {
    kindLabel: 'خيار CMake',
    typeLabel: 'إلزامي',
    meaning: 'يعني أن هذا الجزء إلزامي لا اختياري: إذا لم يتحقق الشرط أو لم تُكتشف الحزمة فستفشل التهيئة.',
    whyUse: 'يستخدمه المبرمج عندما لا يمكن متابعة البناء أو التصدير أو البحث دون هذه النتيجة.',
    actualUsage: 'يظهر كثيرًا مع find_package() ووحدات البحث ليحوّل النتيجة من محاولة مرنة إلى شرط نجاح صريح.'
  },
  REQUIRED_VARS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'متغيرات يجب توفرها',
    meaning: 'تعني أن المتغيرات التالية هي معيار النجاح الحقيقي لعملية الاكتشاف، لا مجرد بيانات إضافية اختيارية.',
    whyUse: 'تفيد في وحدات Find*.cmake عندما يعتمد النجاح الفعلي على اجتماع أكثر من متغير مكتشف مثل المسار والرأس والمكتبة.',
    actualUsage: 'تظهر بكثرة مع find_package_handle_standard_args() لتقرر هل ستعلن الوحدة الحزمة FOUND أم ستفشل.'
  },
  STATIC: {
    kindLabel: 'نوع هدف CMake',
    typeLabel: 'مكتبة ثابتة',
    meaning: 'يطلب إنشاء مكتبة ثابتة تربط نواتجها داخل الملفات التنفيذية أو المكتبات الأخرى وقت الربط.',
    whyUse: 'يفيد عندما تريد ناتجًا لا يعتمد على تحميل مكتبة مشتركة وقت التشغيل.',
    actualUsage: 'يغير نوع target والناتج النهائي الذي يبنيه add_library.'
  },
  SHARED: {
    kindLabel: 'نوع هدف CMake',
    typeLabel: 'مكتبة مشتركة',
    meaning: 'يطلب إنشاء مكتبة ديناميكية/مشتركة تحمل ملفًا مستقلًا وقت التشغيل.',
    whyUse: 'يستخدم عندما تريد مكتبة قابلة للمشاركة بين عدة برامج أو قابلة للتبديل دون إعادة ربط كاملة.',
    actualUsage: 'يغير نوع target وكيف يتصرف الربط والتثبيت.'
  },
  MODULE: {
    kindLabel: 'نوع هدف CMake',
    typeLabel: 'مكتبة Module',
    meaning: 'يطلب مكتبة تُحمّل كملحق أو plugin بدل أن تربط عادة كمكتبة اعتيادية تابعة.',
    whyUse: 'يفيد لملحقات التحميل الديناميكي أو المكونات الاختيارية.',
    actualUsage: 'تنتج ملف مكتبة لكنه ليس هدف ربط عادي مثل SHARED.'
  },
  OBJECT: {
    kindLabel: 'نوع هدف CMake',
    typeLabel: 'Object Library',
    meaning: 'يطلب هدفًا ينتج ملفات object فقط دون ملف مكتبة نهائي مستقل.',
    whyUse: 'يفيد عندما تريد إعادة استخدام ملفات object في أكثر من هدف.',
    actualUsage: 'يؤثر في build graph دون إنتاج أرشيف مكتبة نهائي.'
  },
  BEFORE: {
    kindLabel: 'خيار CMake',
    typeLabel: 'إدراج قبل القيم السابقة',
    meaning: 'يطلب من CMake وضع الإعداد أو المسار قبل القيم الحالية بدل إلحاقه في النهاية.',
    whyUse: 'يستخدم عندما يكون ترتيب المسارات أو الخيارات مؤثرًا فعليًا.',
    actualUsage: 'يغيّر ترتيب السلاسل الناتجة للمصرّف أو لأداة الربط.'
  },
  '@ONLY': {
    kindLabel: 'خيار configure_file',
    typeLabel: 'استبدال بصيغة @VAR@ فقط',
    meaning: 'يجعل configure_file يستبدل فقط الصيغ المكتوبة على شكل @VAR@.',
    whyUse: 'يفيد عندما لا تريد المساس بصيغ ${...} الموجودة أصلًا في الملف الناتج أو الموجهة لأداة أخرى.',
    actualUsage: 'يؤثر في configure step وقت توليد الملف.'
  },
  COPYONLY: {
    kindLabel: 'خيار configure_file',
    typeLabel: 'نسخ فقط',
    meaning: 'يأمر configure_file بنسخ الملف كما هو دون أي استبدال للمتغيرات.',
    whyUse: 'يفيد عندما تريد فقط إدخال الملف إلى شجرة البناء دون Template substitution.',
    actualUsage: 'يؤثر في configure step على طريقة كتابة الملف الناتج.'
  },
  NEWLINE_STYLE: {
    kindLabel: 'خيار configure_file',
    typeLabel: 'شكل نهايات الأسطر',
    meaning: 'يحدد شكل نهايات الأسطر في الملف الناتج مثل LF أو CRLF.',
    whyUse: 'يستخدم عندما يجب أن يطابق الملف المولد بيئة أو أداة أو نظام تشغيل محدد.',
    actualUsage: 'يؤثر في محتوى الملف الناتج حرفيًا.'
  },
  CACHE: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'قيمة مخزنة في Cache',
    meaning: 'تعني أن القيمة ستكتب في cache وتبقى بين تشغيلات configure.',
    whyUse: 'يستخدمها المبرمج عندما يريد خيارًا قابلاً للتعديل من الواجهة أو من سطر الأوامر.',
    actualUsage: 'تؤثر في سلوك configure اللاحق لأن القيمة تصبح مستقرة وقابلة للإعادة.'
  },
  PATH: {
    kindLabel: 'نوع قيمة Cache',
    typeLabel: 'مسار ملفات',
    meaning: 'يعلن أن قيمة cache هنا تمثل مسارًا لا نصًا عامًا.',
    whyUse: 'يفيد للواجهات والأدوات حتى تتعامل مع القيمة كمسار فعلي.',
    actualUsage: 'يؤثر في طريقة عرض القيمة وتحريرها أكثر من كونه أمرًا تنفيذيًا مستقلًا.'
  },
  STATUS: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'رسالة حالة',
    meaning: 'تطلب رسالة حالة معلوماتية أثناء configure، أي إن النص التالي سيظهر كتشخيص عادي لا كتحذير قاتل أو خطأ يوقف المشروع.',
    whyUse: 'تستخدم لإظهار ما يفعله المشروع أو ما اكتشفه أو أي قيمة يريد المطور تأكيدها دون قلب المسار إلى فشل.',
    actualUsage: 'أثرها العملي أنها تغيّر تصنيف الرسالة في خرج configure فقط، بينما يستمر المشروع في القراءة والبناء.'
  },
  EXPORT: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'مجموعة تصدير',
    meaning: 'تربط الأمر بمجموعة export قابلة لإعادة الاستيراد من مشاريع أخرى.',
    whyUse: 'تفيد عندما تريد أن يصبح target المثبت قابلاً للاستعمال عبر find_package لاحقًا.',
    actualUsage: 'تؤثر في install/export/package flow لا في الترجمة المباشرة وحدها.'
  },
  RUNTIME: {
    kindLabel: 'كلمة مفتاحية في install',
    typeLabel: 'ملفات تنفيذية',
    meaning: 'تشير إلى الملفات التنفيذية أو نواتج runtime عند تحديد مسارات التثبيت.',
    whyUse: 'تساعد على فصل ملفات التنفيذ عن ملفات المكتبات والأرشيفات داخل install tree.',
    actualUsage: 'تظهر غالبًا مع install(TARGETS ...).'
  },
  ARCHIVE: {
    kindLabel: 'كلمة مفتاحية في install',
    typeLabel: 'أرشيف مكتبة',
    meaning: 'تشير إلى ملفات الأرشيف مثل المكتبات الثابتة عند تحديد مسار التثبيت.',
    whyUse: 'تفصل هذا النوع من النواتج عن المكتبات المشتركة والملفات التنفيذية.',
    actualUsage: 'تؤثر في install step ومسارات الحزم المصدرة.'
  },
  LIBRARY: {
    kindLabel: 'كلمة مفتاحية في install',
    typeLabel: 'مكتبات مشتركة',
    meaning: 'تشير إلى ملفات المكتبات المشتركة الناتجة عند التثبيت.',
    whyUse: 'تستخدم لتوجيه هذا النوع إلى مجلد مناسب مثل lib.',
    actualUsage: 'تؤثر في install tree وبنية الحزمة الناتجة.'
  },
  ON: {
    kindLabel: 'قيمة CMake',
    typeLabel: 'صحيح/مفعّل',
    meaning: 'تمثل قيمة منطقية مفعلة داخل اصطلاح CMake، أي أن الشرط أو الخيار الذي يقرأها سيتعامل معها كحالة مفعلة فعليًا.',
    whyUse: 'تستخدم لتفعيل خيار cache أو خاصية هدف أو مسار شرطية بصورة صريحة بدل تركها ضمنية.',
    actualUsage: 'تقرأ أثناء configure ثم تنعكس على الشروط وخصائص الأهداف وسلوك أوامر مثل option() وset_target_properties().'
  },
  OFF: {
    kindLabel: 'قيمة CMake',
    typeLabel: 'خطأ/معطّل',
    meaning: 'تمثل قيمة منطقية معطلة داخل اصطلاح CMake، أي إن الشرط أو الخيار الذي يقرأها سيتعامل معها كحالة متوقفة أو غير مطلوبة.',
    whyUse: 'تستخدم لإيقاف خيار أو لإعطاء قيمة واضحة للشرطيات وcache variables بدل ترك الحذف أو الفراغ يقرر المعنى.',
    actualUsage: 'تؤثر في configure والشرطيات والخصائص التي تقرأها، مثل تعطيل BUILD_TESTING أو تغيير السلوك الافتراضي للمشروع.'
  },
  COMPATIBILITY: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'سياسة توافق حزمة',
    meaning: 'تحدد كيف تقارن ملفات الحزمة أو الإصدار بين الإصدارات المطلوبة والمعلنة.',
    whyUse: 'تستخدم عندما تصدر package config/version file وتريد تعريف معنى التوافق المقبول.',
    actualUsage: 'تؤثر في export/package flow لا في الترجمة المباشرة.'
  },
  if: {
    kindLabel: 'صياغة CMake',
    typeLabel: 'بداية شرط',
    meaning: 'يفتح كتلة شرطية في CMake.',
    whyUse: 'يستخدمه المبرمج لتغيير configure أو properties أو install paths بحسب الحالة الحالية.',
    actualUsage: 'يؤثر في تفسير الأسطر التالية حتى endif.'
  },
  endif: {
    kindLabel: 'صياغة CMake',
    typeLabel: 'نهاية شرط',
    meaning: 'يغلق الكتلة التي بدأتها if أو ما يشبهها.',
    whyUse: 'يحافظ على حدود الشرط واضحة داخل CMakeLists.txt.',
    actualUsage: 'لا يحمل أثرًا مستقلًا، لكنه ينهي مجال الشرط الحالي.'
  },
  CXX: {
    kindLabel: 'قيمة لغة في CMake',
    typeLabel: 'لغة C++',
    meaning: 'تعني أن المشروع أو السياق الحالي يحتاج لغة C++ تحديدًا، لا مجرد لغة عامة يختارها CMake تلقائيًا.',
    whyUse: 'تجعل CMake يجهز مترجم C++ وفحوصه ومتغيراته وخصائصه الافتراضية ذات الصلة بدل إبقاء اللغة ضمنية.',
    actualUsage: 'أثرها العملي يظهر في configure لأن CMake يحمّل دعم C++ ويجعل خصائص مثل CMAKE_CXX_STANDARD وCXX_STANDARD ذات معنى مباشر.'
  },
  Debug: {
    kindLabel: 'اسم إعداد بناء',
    typeLabel: 'وضع Debug',
    meaning: 'يمثل وضع البناء Debug، أي التشكيلة التي تعطي عادة معلومات تصحيحية أوضح وتحسينات أقل عدوانية من أوضاع النشر.',
    whyUse: 'يستخدمه المبرمج للفصل بين إعدادات التطوير اليومية وإعدادات Release أو التوزيع.',
    actualUsage: 'قد يقرأ داخل CMAKE_BUILD_TYPE أو داخل Generator Expressions مثل $<CONFIG:Debug> ليغيّر flags أو تعاريف أو مسارات بحسب التشكيلة.'
  },
  QUIET: {
    kindLabel: 'خيار CMake',
    typeLabel: 'بحث أو تشخيص هادئ',
    meaning: 'يعني أن عملية البحث أو التحقق يجب أن تقلل الضجيج التشخيصي ولا تطبع رسائل النجاح/الفشل المعتادة إلا عند الحاجة.',
    whyUse: 'يفيد عندما تريد تجربة اكتشاف اختيارية أو متكررة من دون إغراق خرج configure برسائل كثيرة.',
    actualUsage: 'أثره العملي يكون في مستوى الرسائل التي تظهر أثناء البحث، لا في جوهر آلية الاكتشاف نفسها.'
  },
  CONFIG: {
    kindLabel: 'كلمة مفتاحية في CMake',
    typeLabel: 'Config mode',
    meaning: 'تعني أن البحث يجب أن يفضل أو يفرض نمط Config packages، أي ملفات الحزمة التي تصدرها المكتبة نفسها.',
    whyUse: 'تستخدم عندما تريد imported targets ومعلومات الاستعمال الرسمية من الحزمة بدل الاعتماد على Find module عام.',
    actualUsage: 'أثرها العملي أن find_package() يغير مسار البحث الذي يسلكه ويقرأ ملفات Config الخاصة بالحزمة إن وجدت.'
  },
  SameMajorVersion: {
    kindLabel: 'قيمة توافق في CMake',
    typeLabel: 'توافق ضمن نفس الإصدار الرئيسي',
    meaning: 'تعني أن التوافق المقبول يكون داخل نفس major version، حتى لو اختلفت الأجزاء الفرعية أو الإصلاحية.',
    whyUse: 'تستخدم في ملفات version/config عندما تريد السماح بالاستهلاك داخل نفس العائلة الرئيسية فقط.',
    actualUsage: 'أثرها العملي يظهر عند مقارنة الإصدارات في package version file الذي يستهلكه find_package لاحقًا.'
  },
  target: {
    kindLabel: 'مفهوم CMake',
    typeLabel: 'Target',
    meaning: 'الـ target هو العقدة العملية التي يبنيها CMake داخل الرسم البنائي: executable أو library أو هدف واجهي أو اختباري.',
    whyUse: 'يستخدمه المبرمج لأن معظم الإعدادات الحديثة في CMake تربط بالهدف نفسه لا بالمشروع كله.',
    actualUsage: 'يظهر في أوامر target_* والخصائص والربط والتثبيت ومتطلبات الاستعمال.'
  }
});

const CMAKE_INLINE_PLACEHOLDERS = Object.freeze({
  '<input>': 'هذا placeholder يعني أن المبرمج يكتب هنا اسم ملف الإدخال أو القالب الذي سيقرأه الأمر.',
  '<output>': 'هذا placeholder يعني أن المبرمج يكتب هنا اسم الملف الناتج أو مساره.',
  '<dir>': 'هذا placeholder يعني أن القيمة المطلوبة هنا مجلد أو مسار وجهة.',
  '<targets>': 'هذا placeholder يعني أن المكان مخصص لأسماء targets معرّفة مسبقًا في المشروع.',
  '<target>': 'هذا placeholder يعني أن المكان مخصص لاسم target واحد موجود مسبقًا.',
  '<PackageName>': 'هذا placeholder يعني اسم الحزمة التي تبحث عنها أو تصدر لها ملفات CMake.',
  '<file|module>': 'هذا placeholder يعني أن المستخدم يكتب هنا اسم ملف CMake أو اسم module فعلي سيقرأه include().',
  '<PRIVATE|PUBLIC|INTERFACE>': 'هذا placeholder يعني أن المستخدم يختار هنا واحدة من كلمات النطاق المعروفة مثل PRIVATE أو PUBLIC أو INTERFACE بحسب معنى النشر المطلوب.',
  '<components>': 'هذا placeholder يعني قائمة مكونات فرعية داخل الحزمة.',
  '<variable>': 'هذا placeholder يعني اسم متغير CMake أو اسم cache entry.',
  '<value>': 'هذا placeholder يعني القيمة التي سيقرأها الأمر أو يسندها.',
  '<depends>': 'هذا placeholder يعني الملفات أو النواتج أو الأهداف التي يعتمد عليها الأمر قبل التنفيذ.',
  '<style>': 'هذا placeholder يعني قيمة فعلية لشكل نهايات الأسطر مثل LF أو CRLF بعد الكلمة NEWLINE_STYLE.',
  '<language>': 'هذا placeholder يعني اسم لغة مثل C أو CXX.',
  '<PROJECT-NAME>': 'هذا placeholder يعني الاسم الرسمي للمشروع كما سيعلن في project().'
});

const CMAKE_INLINE_VARIABLE_REFERENCE_HELP = Object.freeze({
  CMAKE_CURRENT_SOURCE_DIR: {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير مدمج',
    meaning: 'هذه الصيغة تقرأ قيمة CMAKE_CURRENT_SOURCE_DIR الحالية، أي مجلد المصدر الخاص بالدليل الجاري معالجته الآن داخل CMake.',
    whyUse: 'تستخدم عندما تريد بناء مسار قريب من الملف الحالي أو شرح أين يقف CMake فعليًا داخل directory scope الحالي.',
    actualUsage: 'تُقيَّم أثناء configure عندما يفسر CMake وسيط الأمر الحالي، لذلك قد تتغير نتيجتها بين دليل وآخر بعد add_subdirectory().'
  },
  CMAKE_CURRENT_BINARY_DIR: {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير مدمج',
    meaning: 'هذه الصيغة تقرأ قيمة CMAKE_CURRENT_BINARY_DIR الحالية، أي مجلد البناء المقابل للدليل الجاري معالجته.',
    whyUse: 'تفيد عندما تريد كتابة ملف مولد في build tree الصحيح بدل خلطه مع source tree.',
    actualUsage: 'تُقيَّم أثناء configure، ويظهر أثرها العملي في المسار الذي ستكتب فيه الأوامر مثل configure_file() أو المسارات التي ستعلنها للأهداف.'
  },
  PROJECT_SOURCE_DIR: {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير مدمج',
    meaning: 'هذه الصيغة تقرأ PROJECT_SOURCE_DIR، أي جذر المشروع المنطقي المرتبط بآخر project() فعّال في هذا النطاق.',
    whyUse: 'تستخدم عندما تحتاج الجذر المنطقي للمشروع الحالي لا الدليل الفرعي الجاري فقط.',
    actualUsage: 'تُقيَّم أثناء configure داخل السياق الحالي، لذلك تعطي جذر المشروع الفعّال وقت قراءة هذا السطر.'
  },
  PROJECT_BINARY_DIR: {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير مدمج',
    meaning: 'هذه الصيغة تقرأ PROJECT_BINARY_DIR، أي مجلد البناء المنطقي المرتبط بالمشروع الحالي كما عرّفه project().',
    whyUse: 'تفيد عندما تحتاج مسار إخراج مشترك على مستوى المشروع بدل دليل فرعي محلي.',
    actualUsage: 'تُقيَّم أثناء configure، وتؤثر في المسار الذي ستشير إليه الأوامر اللاحقة لقراءة أو كتابة ملفات مرتبطة بالمشروع كله.'
  },
  CMAKE_CXX_STANDARD: {
    kindLabel: 'توسعة متغير CMake',
    typeLabel: 'متغير CMake عام',
    meaning: 'هذه الصيغة تقرأ القيمة الحالية للمتغير CMAKE_CXX_STANDARD، وهو متغير يحدد المعيار الافتراضي الذي سترثه أهداف C++ الجديدة عبر الخاصية CXX_STANDARD.',
    whyUse: 'تفيد عندما تريد فحص أو طباعة أو توثيق المعيار العام النشط للمشروع، أو عندما تبني قرارًا لاحقًا على هذه القيمة المركزية.',
    actualUsage: 'قراءتها هنا لا تغيّر أي target بذاتها؛ الأثر البنيوي الحقيقي يظهر عندما تُنشئ أهداف C++ بعد ضبط هذا المتغير أثناء configure.'
  },
  'CMAKE_<LANG>_STANDARD': {
    kindLabel: 'عائلة متغيرات CMake',
    typeLabel: 'نمط placeholder',
    meaning: 'هذا ليس اسم متغير واحد بعينه، بل نمط عائلة متغيرات مثل CMAKE_C_STANDARD وCMAKE_CXX_STANDARD. الجزء <LANG> placeholder يستبدله المبرمج باسم اللغة الفعلية.',
    whyUse: 'يظهر في الشرح والتوثيق عندما تتكلم الصفحة عن الفكرة العامة لكل لغات CMake بدل الاكتفاء بلغة واحدة فقط.',
    actualUsage: 'أثره العملي لا يظهر حتى تستبدل <LANG> بلغة فعلية. بعد ذلك يصبح متغير CMake عاديًا يضبط default للخاصية المقابلة على الأهداف الجديدة لتلك اللغة.'
  },
  CXX_STANDARD: {
    kindLabel: 'خاصية target في CMake',
    typeLabel: 'خاصية مرتبطة بهدف',
    meaning: 'CXX_STANDARD ليست توسعة متغير، بل اسم خاصية target تحدد معيار C++ المطلوب لهدف بعينه.',
    whyUse: 'تستخدم عندما تحتاج فرض معيار مختلف أو أوضح على target محدد بدل الاكتفاء بمتغير عام على مستوى المشروع.',
    actualUsage: 'أثرها البنيوي يظهر على الهدف الذي تحملها فقط أثناء generate/build، بينما يبقى CMAKE_CXX_STANDARD مجرد default عام للأهداف الجديدة.'
  }
});

const CMAKE_INLINE_ENVIRONMENT_REFERENCE_HELP = Object.freeze({
  HOME: {
    kindLabel: 'مرجع بيئة في CMake',
    typeLabel: 'متغير بيئة النظام',
    meaning: 'هذه الصيغة تقرأ متغير البيئة HOME من العملية التي شغلت CMake، أي مسار منزل المستخدم في البيئة الحالية.',
    whyUse: 'تستخدم عندما تريد قيمة يقدمها النظام أو جلسة المستخدم الحالية، مثل مسار تثبيت محلي أو موقع ملفات شخصية.',
    actualUsage: 'تُقيَّم أثناء configure في البيئة الحالية. إذا خزنت الناتج في متغير أو cache فالمخزن هو القيمة النصية الناتجة الآن، لا وصلة حية تتغير وحدها لاحقًا.'
  }
});

const tutorialFallbackRuntime = createTutorialFallbackRuntime
  ? createTutorialFallbackRuntime({
      escapeAttribute,
      escapeHtml,
      renderSdl3PracticalText
    })
  : null;

const renderFallbackInfoGrid = (...args) => tutorialFallbackRuntime?.renderFallbackInfoGrid(...args) || '';
const renderFallbackDocCodeContainer = (...args) => tutorialFallbackRuntime?.renderFallbackDocCodeContainer(...args) || '';
const fallbackRenderTutorialList = (...args) => tutorialFallbackRuntime?.fallbackRenderTutorialList(...args) || '';
const fallbackRenderTutorialInfoGrid = (...args) => tutorialFallbackRuntime?.fallbackRenderTutorialInfoGrid(...args) || '';
const fallbackRenderTutorialTable = (...args) => tutorialFallbackRuntime?.fallbackRenderTutorialTable(...args) || '';
const fallbackRenderTutorialCodeBlock = (...args) => tutorialFallbackRuntime?.fallbackRenderTutorialCodeBlock(...args) || '';
const fallbackRenderDocCodeContainer = (...args) => tutorialFallbackRuntime?.fallbackRenderDocCodeContainer(...args) || '';
const fallbackSplitCodeIntoLineChunks = (...args) => tutorialFallbackRuntime?.fallbackSplitCodeIntoLineChunks(...args) || [];
const fallbackRenderSdl3InfoGridRichText = (...args) => tutorialFallbackRuntime?.fallbackRenderSdl3InfoGridRichText(...args) || '';
const fallbackRenderSdl3InfoGrid = (...args) => tutorialFallbackRuntime?.fallbackRenderSdl3InfoGrid(...args) || '';
const sdl3ExampleGroupsRuntime = createSdl3ExampleGroupsRuntime
  ? createSdl3ExampleGroupsRuntime({
      getAppTextValue,
      SDL3_READY_EXAMPLES,
      isSdl3ExampleMovedToImgui,
      getSdl3BridgeExamples
    })
  : null;

const renderTutorialList = createTutorialRuntimeInvoker('renderTutorialList', fallbackRenderTutorialList);
const renderTutorialInfoGrid = createTutorialRuntimeInvoker('renderTutorialInfoGrid', fallbackRenderTutorialInfoGrid);
const renderTutorialTable = createTutorialRuntimeInvoker('renderTutorialTable', fallbackRenderTutorialTable);
const renderTutorialCodeBlock = createTutorialRuntimeInvoker('renderTutorialCodeBlock', fallbackRenderTutorialCodeBlock);
const renderDocCodeContainer = createTutorialRuntimeInvoker('renderDocCodeContainer', fallbackRenderDocCodeContainer);
const splitCodeIntoLineChunks = createTutorialRuntimeInvoker('splitCodeIntoLineChunks', fallbackSplitCodeIntoLineChunks);
const renderSdl3InfoGrid = createTutorialRuntimeInvoker('renderSdl3InfoGrid', fallbackRenderSdl3InfoGrid);
const renderSdl3InfoGridRichText = createTutorialRuntimeInvoker('renderSdl3InfoGridRichText', fallbackRenderSdl3InfoGridRichText);
const getSdl3ReadyExamples = (...args) => sdl3ExampleGroupsRuntime?.getSdl3ReadyExamples(...args) || [];
const getSdl3ExampleGroupMetaList = (...args) => sdl3ExampleGroupsRuntime?.getSdl3ExampleGroupMetaList(...args) || [];
const inferSdl3ExampleGroupId = (...args) => sdl3ExampleGroupsRuntime?.inferSdl3ExampleGroupId(...args) || 'general';
const getGroupedSdl3ReadyExamples = (...args) => sdl3ExampleGroupsRuntime?.getGroupedSdl3ReadyExamples(...args) || [];
const sdl3ReadyExamplePreviewRuntime = createSdl3ReadyExamplePreviewRuntime
  ? createSdl3ReadyExamplePreviewRuntime({
      escapeAttribute,
      escapeHtml,
      getRawVulkanCatalogExampleById,
      renderVulkanReadyExamplePreview: (...args) => renderVulkanReadyExamplePreview(...args)
    })
  : null;
const renderSdl3ReadyExampleFallbackPreview = (...args) => sdl3ReadyExamplePreviewRuntime?.renderSdl3ReadyExampleFallbackPreview(...args) || '';
const renderSdl3ReadyExamplePreview = (...args) => sdl3ReadyExamplePreviewRuntime?.renderSdl3ReadyExamplePreview(...args) || '';
function buildCanonicalReferenceExample(entity = null) {
  const libraryId = String(entity?.library?.id || '').trim();
  if (!/^sdl3(?:-|$)/.test(libraryId)) {
    return null;
  }

  const normalizedKind = ({
    functions: 'function',
    types: 'type',
    enums: 'enum',
    constants: 'constant',
    macros: 'macro'
  })[String(entity?.kind?.id || '').trim()] || '';

  if (!normalizedKind) {
    return null;
  }

  return buildSdl3PracticalExample({
    name: entity?.identity?.name || '',
    kind: normalizedKind,
    syntax: entity?.signature?.raw || '',
    parameters: Array.isArray(entity?.details?.parameters) ? entity.details.parameters : [],
    values: Array.isArray(entity?.details?.values) ? entity.details.values : [],
    remarks: Array.isArray(entity?.details?.remarks) ? entity.details.remarks : [],
    categoryTitle: entity?.source?.category || entity?.kind?.displayNameArabic || entity?.kind?.displayName || '',
    description: entity?.summary?.actualMeaningArabic || entity?.summary?.actualTranslationArabic || entity?.summary?.sourceDescription || '',
    sourceDescription: entity?.summary?.sourceDescription || '',
    parentEnum: entity?.relationships?.parentEnum || ''
  });
}

const sdl3ReadyExamplePageRuntime = createSdl3ReadyExamplePageRuntime
  ? createSdl3ReadyExamplePageRuntime({
      escapeHtml,
      getRawVulkanCatalogExampleById,
      getSdl3PackageInfo,
      getSdl3ExampleGuide,
      getSdl3ReadyExamples,
      linkUsageBridgeText: (...args) => linkUsageBridgeText(...args),
      renderExamplePlatformSection: (...args) => renderExamplePlatformSection(...args),
      renderRelatedReferenceLink: (...args) => renderRelatedReferenceLink(...args),
      renderSdl3EntityLink: (...args) => renderSdl3EntityLink(...args),
      renderSdl3ExampleCodeBlock: (...args) => renderSdl3ExampleCodeBlock(...args),
      renderSdl3ExampleOfficialGuidance: (...args) => renderSdl3ExampleOfficialGuidance(...args),
      renderSdl3ExampleProjectExpansion: (...args) => renderSdl3ExampleProjectExpansion(...args),
      renderSdl3HeaderFileLink: (...args) => renderSdl3HeaderFileLink(...args),
      renderSdl3PracticalText: (...args) => renderSdl3PracticalText(...args),
      renderSdl3ReadyExamplePreview,
      renderSdl3RelatedLink: (...args) => renderSdl3RelatedLink(...args),
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanReadyExampleCodeBlock: (...args) => renderVulkanReadyExampleCodeBlock(...args),
      formatSdl3HeaderFileDisplay
    })
  : null;
const vulkanExamplePreviewRuntime = createVulkanExamplePreviewRuntime
  ? createVulkanExamplePreviewRuntime({
      VULKAN_EXAMPLE_GUIDES,
      escapeAttribute,
      escapeHtml,
      getExamplePreviewIntro,
      getGroupedVulkanReadyExamples,
      getOrderedVulkanReadyExamples,
      getVulkanExampleDisplayTitle,
      pickRandomExampleEntries,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderRelatedReferenceLink: (...args) => renderRelatedReferenceLink(...args),
      renderVulkanReadyExamplePreview: (...args) => renderVulkanReadyExamplePreview(...args)
    })
  : null;
const vulkanReadyExamplePageRuntime = createVulkanReadyExamplePageRuntime
  ? createVulkanReadyExamplePageRuntime({
      escapeHtml,
      getOrderedVulkanReadyExamples,
      getVulkanExampleDisplayTitle,
      linkUsageBridgeText: (...args) => linkUsageBridgeText(...args),
      renderCommandSnippet,
      renderDetailedExampleExplanation,
      renderDocCodeContainer,
      renderEntityIcon,
      renderHighlightedCode,
      renderRelatedReferenceLink: (...args) => renderRelatedReferenceLink(...args),
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanExampleOfficialGuidance: (...args) => vulkanExamplePreviewRuntime?.renderVulkanExampleOfficialGuidance(...args) || '',
      renderVulkanExampleProjectExpansion: (...args) => vulkanExamplePreviewRuntime?.renderVulkanExampleProjectExpansion(...args) || '',
      renderVulkanReadyExamplePreview: (...args) => renderVulkanReadyExamplePreview(...args),
      buildExampleAnalysis,
      buildVulkanExampleConcepts,
      buildVulkanExampleExecutionFlow,
      buildVulkanExampleLearningItems,
      buildVulkanExampleLineExplanationRows,
      buildVulkanExampleLocalSymbolMap,
      buildVulkanExamplePurposeParagraphs,
      buildVulkanExampleReferenceNames,
      buildVulkanExampleRequirements,
      collectVulkanExampleLocalSymbols,
      getVulkanExampleGuide: (...args) => vulkanExamplePreviewRuntime?.getVulkanExampleGuide(...args) || null,
      mergeUniqueTeachingItems
    })
  : null;
const sdl3ExamplePreviewRuntime = createSdl3ExamplePreviewRuntime
  ? createSdl3ExamplePreviewRuntime({
      SDL3_EXAMPLE_GUIDES,
      escapeAttribute,
      escapeHtml,
      getExamplePreviewIntro,
      getGroupedSdl3ReadyExamples,
      getSdl3PackageInfo,
      getSdl3ReadyExamples,
      pickRandomExampleEntries,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderSdl3EntityLink: (...args) => renderSdl3EntityLink(...args),
      renderSdl3ReadyExamplePreview,
      summarizeExamplePreviewText: (...args) => summarizeExamplePreviewText(...args)
    })
  : null;
const imguiExamplePreviewRuntime = createImguiExamplePreviewRuntime
  ? createImguiExamplePreviewRuntime({
      IMGUI_EXAMPLE_GUIDES,
      escapeAttribute,
      escapeHtml,
      getAllImguiReferenceItems,
      getExamplePreviewIntro,
      getImguiKindMeta,
      getImguiReferenceItem,
      getImguiSectionIcon,
      getImguiStandaloneExampleItems,
      imguiReferenceSections,
      getRawSdl3CatalogExampleById,
      getRawVulkanCatalogExampleById,
      pickRandomExampleEntries,
      renderEntityIcon,
      renderImguiCodeBlock,
      renderImguiDocText,
      renderImguiEntityLink,
      renderImguiIndexCardPreview,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderRelatedReferenceLink: (...args) => renderRelatedReferenceLink(...args),
      renderSdl3EntityLink: (...args) => renderSdl3EntityLink(...args),
      renderSdl3ReadyExamplePreview,
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanReadyExampleCodeBlock: (...args) => renderVulkanReadyExampleCodeBlock(...args),
      summarizeExamplePreviewText: (...args) => summarizeExamplePreviewText(...args),
      normalizeImguiExampleShotSource,
      buildImguiExampleShotDataUri
    })
  : null;
const vulkanHomeRuntime = createVulkanHomeRuntime
  ? createVulkanHomeRuntime({
      escapeAttribute,
      buildNavigationTooltipForName: (...args) => buildNavigationTooltipForName(...args),
      buildShowCommandCall: (...args) => buildShowCommandCall(...args),
      countVariableItems: (...args) => countVariableItems(...args),
      getAllConstantReferenceEntries: (...args) => getAllConstantReferenceEntries(...args),
      getVulkanHomeMetrics: (...args) => getVulkanHomeMetrics(...args),
      getCommandSummaryText: (...args) => getCommandSummaryText(...args),
      getGroupedVulkanReadyExamples: (...args) => getGroupedVulkanReadyExamples(...args),
      getTutorialCatalog: () => tutorialCatalog,
      getVulkanFileSections: () => vulkanFileSections,
      renderCodicon,
      renderVulkanExamplesPreviewSection: (...args) => vulkanExamplePreviewRuntime?.renderVulkanExamplesPreviewSection(...args) || '',
      vulkanData,
    })
  : null;
const cmakeHomeRuntime = createCmakeHomeRuntime
  ? createCmakeHomeRuntime({
      buildCmakeEntryTooltip,
      cmakeSearchEntries,
      cmakeSearchMeta,
      escapeAttribute,
      getCmakeKindMeta,
      renderCodicon,
      uiSegmentLoaded
    })
  : null;
const glslHomeRuntime = createGlslHomeRuntime
  ? createGlslHomeRuntime({
      buildGlslReferenceTooltip,
      escapeAttribute,
      getAppTextValue,
      renderCodicon,
      renderGlslExamplesPreviewSection,
      uiSegmentLoaded,
      glslReferenceSections
    })
  : null;
const ffmpegHomeRuntime = createFfmpegHomeRuntime
  ? createFfmpegHomeRuntime({
      renderCodicon
    })
  : null;
const cppHomeRuntime = createCppHomeRuntime
  ? createCppHomeRuntime({
      buildCppReferenceItem: (...args) => buildCppReferenceItem(...args),
      buildCppReferenceTooltip: (...args) => buildCppReferenceTooltip(...args),
      cppHomeConfig: () => CPP_HOME_DATA,
      escapeAttribute,
      renderCodicon,
      uiSegmentLoaded
    })
  : null;
const sdl3HomeRuntime = createSdl3HomeRuntime
  ? createSdl3HomeRuntime({
      SDL3_HOME_FALLBACK_PACKAGE_META,
      buildSdl3PackageSectionReason: (...args) => buildSdl3PackageSectionReason(...args),
      buildSdl3ReferenceTooltip: (...args) => buildSdl3ReferenceTooltip(...args),
      buildShowSdl3Call: (...args) => buildShowSdl3Call(...args),
      escapeAttribute,
      getSdl3CollectionMeta: (...args) => getSdl3CollectionMeta(...args),
      getSdl3KindMeta: (...args) => getSdl3KindMeta(...args),
      getSdl3PackageInfo: (...args) => getSdl3PackageInfo(...args),
      getSdl3PackageItems: (...args) => getSdl3PackageItems(...args),
      getSdl3PackagePracticalDomain: (...args) => getSdl3PackagePracticalDomain(...args),
      getSdl3VisiblePackageKeys: (...args) => getSdl3VisiblePackageKeys(...args),
      renderCodicon,
      renderSdl3ExamplesPreviewSection: (...args) => renderSdl3ExamplesPreviewSection(...args),
      uiSegmentLoaded
    })
  : null;
const buildFfmpegHomeLibraryModel = (...args) => ffmpegHomeRuntime?.buildFfmpegHomeLibraryModel(...args) || null;
const homeShellRuntime = createHomeShellRuntime
  ? createHomeShellRuntime({
      buildCmakeHomeLibraryModel: (...args) => buildCmakeHomeLibraryModel(...args),
      buildCppHomeLibraryModel: (...args) => buildCppHomeLibraryModel(...args),
      buildFfmpegHomeLibraryModel: (...args) => buildFfmpegHomeLibraryModel(...args),
      buildGlslHomeLibraryModel: (...args) => buildGlslHomeLibraryModel(...args),
      buildImguiHomeLibraryModel: (...args) => buildImguiHomeLibraryModel(...args),
      buildSdl3HomeLibraryModel: (...args) => buildSdl3HomeLibraryModel(...args),
      buildVulkanHomeLibraryModel: (...args) => buildVulkanHomeLibraryModel(...args),
      getHomeSdl3PackageKeys: (...args) => getHomeSdl3PackageKeys(...args),
      getVulkanHomeMetrics: (...args) => getVulkanHomeMetrics(...args)
    })
  : null;
const treeRuntime = createTreeRuntime
  ? createTreeRuntime({
      renderEntityIcon,
      vulkanData
    })
  : null;
const categoryLookupRuntime = createCategoryLookupRuntime
  ? createCategoryLookupRuntime()
  : null;
const clearCategoryLookupCaches = (...args) => categoryLookupRuntime?.clearCategoryLookupCaches?.(...args);
const sdl3ParameterRenderRuntime = createSdl3ParameterRenderRuntime
  ? createSdl3ParameterRenderRuntime({
      composeSemanticTooltip,
      decodeBasicHtmlEntities,
      formatSdlCodeExpressionText,
      getSdl3ReferenceFromType,
      normalizeSdl3ArabicTechnicalProse,
      preferArabicSdl3DocText,
      renderSdl3AnnotatedCodeSnippet: (...args) => renderSdl3AnnotatedCodeSnippet(...args),
      renderSdl3DocText: (...args) => renderSdl3DocText(...args),
      renderSdl3ParameterRole: (...args) => buildSdl3ParameterRole(...args),
      renderSdl3ParameterPracticalUsage: (...args) => buildSdl3ParameterPracticalUsage(...args),
      renderSdl3ParameterPurpose: (...args) => buildSdl3ParameterPurpose(...args),
      renderSdl3ParameterMisuseImpact: (...args) => buildSdl3ParameterMisuseImpact(...args),
      buildSdl3FieldMeaning: (...args) => buildSdl3FieldMeaning(...args),
      buildSdl3FieldOfficialDescription: (...args) => buildSdl3FieldOfficialDescription(...args),
      buildSdl3FieldPurpose: (...args) => buildSdl3FieldPurpose(...args),
      buildSdl3FieldPracticalUsage: (...args) => buildSdl3FieldPracticalUsage(...args),
      sanitizeTooltipText,
      looksLikeSdlCodeExpression,
      stripMarkup,
      stripTooltipIdentifierNoise
    })
  : null;
const sdl3EntityRenderRuntime = createSdl3EntityRenderRuntime
  ? createSdl3EntityRenderRuntime({
      renderSdl3AnnotatedCodeSnippet: (...args) => renderSdl3AnnotatedCodeSnippet(...args),
      escapeAttribute,
      escapeHtml,
      renderSdl3PracticalText: (...args) => renderSdl3PracticalText(...args),
      getSdl3DisplayedParameterType: (...args) => getSdl3DisplayedParameterType(...args),
      getSdl3DisplayParameters: (...args) => getSdl3DisplayParameters(...args),
      buildSdl3ParameterTooltip: (...args) => buildSdl3ParameterTooltip(...args),
      getSdl3ParameterAnchorId: (...args) => getSdl3ParameterAnchorId(...args),
      renderSdl3ParameterDescriptionCell: (...args) => renderSdl3ParameterDescriptionCell(...args),
      buildSdl3ParameterRole: (...args) => buildSdl3ParameterRole(...args),
      buildSdl3ParameterPurpose: (...args) => buildSdl3ParameterPurpose(...args),
      buildSdl3ParameterPracticalUsage: (...args) => buildSdl3ParameterPracticalUsage(...args),
      buildSdl3ParameterInputHint: (...args) => buildSdl3ParameterInputHint(...args),
      buildSdl3ParameterUsageExampleCode: (...args) => buildSdl3ParameterUsageExampleCode(...args),
      renderSdl3ExampleCodeBlock: (...args) => renderSdl3ExampleCodeBlock(...args),
      splitSdl3IdentifierWords: (...args) => splitSdl3IdentifierWords(...args),
      humanizeSdl3Words: (...args) => humanizeSdl3Words(...args),
      resolveStrictArabicSdl3DocText: (...args) => resolveStrictArabicSdl3DocText(...args),
      findSdl3ItemByKind: (...args) => findSdl3ItemByKind(...args),
      buildSdl3ReferenceTooltip: (...args) => buildSdl3ReferenceTooltip(...args),
      linkSdl3DocText: (...args) => linkSdl3DocText(...args),
      renderSdl3EntityLink: (...args) => renderSdl3EntityLink(...args),
      renderSdl3RelatedLink: (...args) => renderSdl3RelatedLink(...args),
      buildSdl3RenderedRemarks: (...args) => buildSdl3RenderedRemarks(...args)
    })
  : null;
const sdl3DetailRuntime = createSdl3DetailRuntime
  ? createSdl3DetailRuntime({
      buildSdl3PrimaryMeaning,
      buildSdl3OfficialDescription,
      buildSdl3UsageHint,
      buildSdl3ActualOperation,
      buildSdl3PracticalBenefitDetailed,
      buildSdl3MissingOrMisuseImpact,
      buildSdl3ReturnMeaning,
      buildSdl3ReferenceTooltipUncached,
      buildSdl3PropertyLabelsFromName: () => ({}),
      getSdl3ReferenceDescription: (item = {}) => String(item?.description || '').trim(),
      getSdl3ReferenceValueType: (item = {}) => String(item?.type || item?.valueType || '').trim(),
      isSdl3PropertyMacro: (item = {}) => /^((SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+)/.test(String(item?.name || '').trim()),
      isSdl3FunctionLikeMacro,
      parseSdl3MacroDefinition,
      parseSdl3StructFields,
      getSdl3ExactElementTypeInfo,
      getSdl3PropertyLifecycleHint: () => '',
      getSdl3TypeSectionDataKey,
      getSdl3PropertyDisplayCategory: () => '',
      getSdl3PropertyThreadSafetyHint: () => '',
      getSdl3PropertyDefaultLabel: () => '',
      getSdl3PropertyAllowedValuesText: () => '',
      getSdl3PropertyAllowedValuesLabel: () => '',
      getSdl3PropertyRequirementLabel: () => '',
      getSdl3PropertyMacroValidation: () => '',
      renderSdl3PracticalText,
      renderSdl3InlineCodeSnippet: (...args) => renderSdl3InlineCodeSnippet(...args),
      renderSdl3TypeReference: (...args) => renderSdl3TypeReference(...args),
      renderSdl3InfoGrid,
      composeSemanticTooltip,
      sanitizeTooltipText,
      escapeHtml,
      escapeAttribute,
      findSdl3AnyItemByName,
      preferArabicSdl3DocText,
      normalizeSdl3ArabicTechnicalProse,
      normalizeSdl3DocValue,
      splitSdl3IdentifierWords,
      humanizeSdl3Words,
      stripTooltipIdentifierNoise,
      stripMarkup,
      sdl3ReferenceTooltipCache: new Proxy({}, {
        get(_target, prop) {
          const target = sdl3ReferenceTooltipCache;
          const value = target?.[prop];
          return typeof value === 'function' ? value.bind(target) : value;
        }
      }),
      getSdl3SpecialFunctionProfile,
      parseSdl3FunctionSignature,
      getSdl3NameAction,
      getSdl3ObjectMeaning,
      buildSdl3NameMeaning,
      translateSdl3CategoryLabel,
      resolveStrictArabicSdl3DocText,
      getSdl3FieldRemarkMap,
      findSdl3ItemByKind,
      linkSdl3DocText,
      extractSdl3TooltipFieldText
    })
  : null;
const sdl3NavRuntime = createSdl3NavRuntime
  ? createSdl3NavRuntime({
      translateSdl3CategoryLabel,
      joinSdl3CategoryTrail,
      getSdl3PackageItems: (packageKey, dataKey) => getSdl3EntityItems(dataKey).filter((item) => String(item?.packageKey || 'core') === String(packageKey || 'core')),
      getSdl3EntityItems,
      getSdl3PackageOrder,
      getSdl3CollectionMeta,
      getSdl3KindMeta,
      getSdl3TypeSectionDataKey,
      getSdl3PackageSectionId: (packageKey, dataKey) => `sdl3-${String(packageKey || 'core')}-${String(dataKey || '').trim()}-list`,
      getSdl3PackageBranchId: (packageKey) => `sdl3-${String(packageKey || 'core')}-branch`,
      ensureSdl3PackageKindData,
      collapseAllSidebarSections,
      collapseAllSidebarNavGroups,
      collapseAllSidebarClusters,
      getSdl3NavGroupStateKey: (packageKey, dataKey, groupKey) => `sdl3-nav:${String(packageKey || 'core')}:${String(dataKey || '')}:${String(groupKey || '')}`,
      sdl3ExpandedNavGroups,
      getSdl3PackageKindStateKey: (packageKey, dataKey) => `sdl3-kind:${String(packageKey || 'core')}:${String(dataKey || '')}`,
      readJsonStorage: (key, fallback = null) => {
        try {
          const raw = window.localStorage?.getItem?.(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch (_error) {
          return fallback;
        }
      },
      writeJsonStorage: (key, value) => {
        try {
          window.localStorage?.setItem?.(key, JSON.stringify(value));
        } catch (_error) {
          // Ignore storage failures to preserve navigation flow.
        }
      },
      sdl3PackageItemsCache: new Proxy({}, {
        get(_target, prop) {
          const target = sdl3PackageItemsCache;
          const value = target?.[prop];
          return typeof value === 'function' ? value.bind(target) : value;
        }
      }),
      sdl3GroupedItemsCache: new Proxy({}, {
        get(_target, prop) {
          const target = sdl3GroupedItemsCache;
          const value = target?.[prop];
          return typeof value === 'function' ? value.bind(target) : value;
        }
      }),
      escapeAttribute,
      escapeHtml,
      buildDeferredSdl3TooltipAttrs,
      renderEntityIcon
    })
  : null;
const glslPageRuntime = createGlslPageRuntime
  ? createGlslPageRuntime({
      ensureUiSegment,
      populateGlslList,
      getGlslReferenceItem,
      getGlslRelatedEntries,
      renderGlslReferenceChip,
      inferGlslExecutionStageLabel,
      buildGlslPracticalRole,
      renderCodicon,
      getGlslSectionCodicon,
      getGlslKindIcon,
      escapeHtml,
      normalizeGlslExplanationText,
      renderEntityIcon,
      renderTutorialInfoGrid,
      localizeGlslKind,
      buildGlslEntityKindNote,
      buildGlslSectionMeaningNote,
      buildGlslExecutionStageNote,
      escapeAttribute,
      renderGlslCompilerRoleSection,
      renderGlslTechnicalProse,
      buildGlslTranslationReadText,
      buildGlslCompilationEffectText,
      buildGlslVulkanBridgeText,
      buildGlslReferenceExample,
      renderTutorialCodeBlock,
      fallbackRenderTutorialCodeBlock,
      renderGenericExampleExplanation,
      safeRenderEntityLabel,
      showHomePage,
      showGlslIndex: (...args) => glslPageRuntime?.showGlslIndex?.(...args),
      scrollToAnchor,
      renderGlslVulkanWorkflowSection,
      renderGlslExamplesPreviewSection,
      glslReferenceSections,
      renderGlslReferenceIndexSection,
      syncRouteHistory,
      scrollMainContentToTop,
      setActiveSidebarItemBySelector,
      getGlslReferenceSectionId,
      escapeSelectorValue,
      highlightCode
    })
  : null;
const ffmpegPageRuntime = createFfmpegPageRuntime
  ? createFfmpegPageRuntime({
      escapeHtml,
      escapeAttribute,
      renderEntityIcon,
      renderTutorialInfoGrid,
      showHomePage,
      syncRouteHistory,
      scrollMainContentToTop,
      highlightCode,
      safeRenderEntityLabel
    })
  : null;


const glslExampleRuntime = createGlslExampleRuntime ? createGlslExampleRuntime({
  escapeAttribute,
  escapeHtml,
  renderGlslReferenceChip,
  renderGlslTechnicalProse,
  renderGlslReadyShaderCodeBlock,
  renderCommandSnippet,
  getGlslExampleGuide: (...args) => getGlslExampleGuide(...args),
  renderGlslExampleOfficialGuidance,
  renderGlslExampleProjectExpansion,
  renderImguiEntityLink,
  getGlslReferenceItem,
  safeRenderEntityLabel,
  scrollToAnchor,
  renderImguiDocText,
  renderTutorialList,
  renderTutorialInfoGrid,
  renderHighlightedCode,
  renderTutorialTable,
  getGlslExampleSectionMeta: (...args) => getGlslExampleSectionMeta(...args),
  getGlslExampleInternalDocLink: (...args) => getGlslExampleInternalDocLink(...args),
  getGlslReadyExampleById: (...args) => getGlslReadyExampleById(...args),
  getGlslExampleDisplayTitle: (...args) => getGlslExampleDisplayTitle(...args),
  showGlslExample: (...args) => showGlslExample(...args),
  preferArabicTooltipText,
  buildGlslPracticalRole,
  localizeGlslKind,
  buildGlslReferenceTooltip,
  renderEntityIcon,
  getGlslExampleSupplementaryTracks: (...args) => getGlslExampleSupplementaryTracks(...args),
  buildGlslExampleSectionReason: (...args) => buildGlslExampleSectionReason(...args),
  renderImguiCodeBlock,
  renderExampleHeroSection
}) : null;

const localizeGlslStageLabels = (...args) => glslExampleRuntime?.localizeGlslStageLabels?.(...args) || String(args[0] || '');
const renderGlslReadyExamplePreview = (...args) => glslExampleRuntime?.renderGlslReadyExamplePreview?.(...args) || '';
const renderGlslReadyExampleOverviewCard = (...args) => glslExampleRuntime?.renderGlslReadyExampleOverviewCard?.(...args) || '';
const renderGlslReadyExampleShaderSection = (...args) => glslExampleRuntime?.renderGlslReadyExampleShaderSection?.(...args) || '';
const renderGlslReadyExampleCommandsSection = (...args) => glslExampleRuntime?.renderGlslReadyExampleCommandsSection?.(...args) || '';
const renderGlslReadyExampleVulkanUsageSection = (...args) => glslExampleRuntime?.renderGlslReadyExampleVulkanUsageSection?.(...args) || '';
const renderGlslReadyExampleSupportGrid = (...args) => glslExampleRuntime?.renderGlslReadyExampleSupportGrid?.(...args) || '';
const renderGlslReadyExamplePage = (...args) => glslExampleRuntime?.renderGlslReadyExamplePage?.(...args) || '';



// ==================== ملء القائمة الجانبية ====================
const vulkanSidebarRuntime = createVulkanSidebarRuntime
  ? createVulkanSidebarRuntime({
      collapseAllSidebarNavGroups,
      escapeAttribute,
      escapeHtml,
      escapeSelectorValue,
      getCommandCategoryKey: (...args) => getCommandCategoryKey(...args),
      getGroupedVulkanReadyExamples: (...args) => getGroupedVulkanReadyExamples(...args),
      getVariableTypeCollections: (...args) => getVariableTypeCollections(...args),
      getVulkanExampleDisplayTitle: (...args) => getVulkanExampleDisplayTitle(...args),
      getVulkanFileSections: () => vulkanFileSections,
      getTutorialCatalog: () => tutorialCatalog,
      populateConstantsList: (...args) => populateConstantsList(...args),
      populateGlslList: (...args) => populateGlslList(...args),
      populateSdl3List: (...args) => populateSdl3List(...args),
      renderEntityIcon,
      showCommand: (...args) => showCommand(...args),
      showStructure: (...args) => showStructure(...args),
      toggleConstantGroup: (...args) => toggleConstantGroup(...args),
      uiSegmentLoaded,
      updateVulkanSidebarSectionCounts: (...args) => updateVulkanSidebarSectionCounts(...args),
      vulkanData,
      vulkanExpandedExampleGroups
    })
  : null;
const populateSidebar = (...args) => vulkanSidebarRuntime?.populateSidebar?.(...args);
const ensureVulkanSidebarSections = (...args) => vulkanSidebarRuntime?.ensureVulkanSidebarSections?.(...args);
const buildSidebarNavItemActivationAttrs = (...args) => vulkanSidebarRuntime?.buildSidebarNavItemActivationAttrs?.(...args) || '';
const populateFunctionsList = (...args) => vulkanSidebarRuntime?.populateFunctionsList?.(...args);
const bindFunctionNavItems = (...args) => vulkanSidebarRuntime?.bindFunctionNavItems?.(...args);
const openFunctionNavItem = (...args) => vulkanSidebarRuntime?.openFunctionNavItem?.(...args);
const populateMacrosList = (...args) => vulkanSidebarRuntime?.populateMacrosList?.(...args);
const vulkanConstantsRuntime = createVulkanConstantsRuntime
  ? createVulkanConstantsRuntime({
      buildSidebarNavItemActivationAttrs: (...args) => buildSidebarNavItemActivationAttrs(...args),
      collapseAllSidebarNavGroups: (...args) => collapseAllSidebarNavGroups(...args),
      ensureDataSegment: (...args) => ensureDataSegment(...args),
      escapeAttribute,
      escapeHtml,
      escapeSelectorValue: (...args) => escapeSelectorValue(...args),
      getEnumValueAnchorId: (...args) => getEnumValueAnchorId(...args),
      getEnumValueRows: (...args) => getEnumValueRows(...args),
      getRenderEntityIcon: () => renderEntityIcon,
      getVulkanData: () => vulkanData,
      hydrateLazySdl3NavGroup: (...args) => hydrateLazySdl3NavGroup(...args),
      rememberSdl3NavGroupState: (...args) => rememberSdl3NavGroupState(...args),
      scrollToAnchor: (...args) => scrollToAnchor(...args),
      setActiveSidebarItemBySelector: (...args) => setActiveSidebarItemBySelector(...args),
      showConstant: (...args) => showConstant(...args),
      showEnum: (...args) => showEnum(...args),
      showMacro: (...args) => showMacro(...args)
    })
  : null;
const getConstantReferenceGroupKey = (...args) => vulkanConstantsRuntime?.getConstantReferenceGroupKey?.(...args) || 'أخرى';
const getAllConstantReferenceEntries = (...args) => vulkanConstantsRuntime?.getAllConstantReferenceEntries?.(...args) || [];
const getConstantReferenceEntry = (...args) => vulkanConstantsRuntime?.getConstantReferenceEntry?.(...args) || null;
const toggleConstantGroup = (...args) => vulkanConstantsRuntime?.toggleConstantGroup?.(...args);
const openConstantReference = (...args) => vulkanConstantsRuntime?.openConstantReference?.(...args);
const populateConstantsList = (...args) => vulkanConstantsRuntime?.populateConstantsList?.(...args);
const ensureConstantsListPopulated = (...args) => vulkanConstantsRuntime?.ensureConstantsListPopulated?.(...args);
let usageBridgeFieldOwnersCache = null;
const usageBridgeExampleVariableIndexCache = new Map();

const cmakeSemanticRuntime = createCmakeSemanticRuntime
  ? createCmakeSemanticRuntime({
      getCanonicalReferenceDetailAnchorId,
      composeSemanticTooltip,
      buildContextualReferenceTooltip: (...args) => buildContextualReferenceTooltip(...args),
      renderContextualTokenLink: (...args) => renderContextualTokenLink(...args),
      escapeHtml,
      resolveReferenceNavigation,
      getNavigationEntityIconType,
      buildNavigationTooltipForName: (...args) => buildNavigationTooltipForName(...args),
      parseCmakeDefineToken,
      buildCmakeVariableReferenceInfo,
      buildCmakeEnvironmentReferenceInfo,
      getCmakeReferenceEntityContext,
      CMAKE_INLINE_SEMANTIC_TOKENS,
      CMAKE_INLINE_PLACEHOLDERS,
      CMAKE_INLINE_VARIABLE_REFERENCE_HELP
    })
  : null;

const getCmakeDetailSemanticIconType = (...args) => cmakeSemanticRuntime?.getCmakeDetailSemanticIconType(...args) || 'command';
const normalizeCmakeSemanticLookupToken = (...args) => cmakeSemanticRuntime?.normalizeCmakeSemanticLookupToken(...args) || '';
const findCmakeDetailRowByToken = (...args) => cmakeSemanticRuntime?.findCmakeDetailRowByToken(...args) || null;
const buildCmakeDetailRowTooltip = (...args) => cmakeSemanticRuntime?.buildCmakeDetailRowTooltip(...args) || '';
const renderCmakeDetailReferenceToken = (...args) => cmakeSemanticRuntime?.renderCmakeDetailReferenceToken(...args) || '';
const buildCmakeSemanticTooltip = (...args) => cmakeSemanticRuntime?.buildCmakeSemanticTooltip(...args) || '';
const getCmakeSemanticTokenInfo = (...args) => cmakeSemanticRuntime?.getCmakeSemanticTokenInfo(...args) || null;
const renderCmakeSemanticSpan = (...args) => cmakeSemanticRuntime?.renderCmakeSemanticSpan(...args) || '';
const renderCmakeNavigationTokenLink = (...args) => cmakeSemanticRuntime?.renderCmakeNavigationTokenLink(...args) || '';
const renderCmakeSemanticToken = (...args) => cmakeSemanticRuntime?.renderCmakeSemanticToken(...args) || '';
const getGlobalFunction = (name) => (typeof window[name] === 'function' ? window[name] : null);
const callGlobalOrFallback = (name, fallback, ...args) => {
  const fn = getGlobalFunction(name);
  return fn ? fn(...args) : fallback(...args);
};
const createNamedBridge = (name, fallback) => (...args) => callGlobalOrFallback(name, fallback, ...args);
const resolveReferenceNavigationBridge = (...args) => callGlobalOrFallback('resolveReferenceNavigation', () => null, ...args);
const findEnumOwnerOfValueBridge = (...args) => callGlobalOrFallback('findEnumOwnerOfValue', () => null, ...args);
const getEnumValueAnchorIdBridge = (...args) => callGlobalOrFallback('getEnumValueAnchorId', () => '', ...args);
const buildEnumValueTooltipBridge = (...args) => callGlobalOrFallback('buildEnumValueTooltip', () => '', ...args);
const buildTooltipTextBridge = (...args) => callGlobalOrFallback('buildTooltipText', () => '', ...args);
const findCommandItemByNameBridge = (...args) => callGlobalOrFallback('findCommandItemByName', () => null, ...args);
const findMacroItemByNameBridge = (...args) => callGlobalOrFallback('findMacroItemByName', () => null, ...args);
const findConstantItemByNameBridge = (...args) => callGlobalOrFallback('findConstantItemByName', () => null, ...args);
const findTypeItemByNameBridge = (...args) => callGlobalOrFallback('findTypeItemByName', () => null, ...args);
const buildEnumItemTooltipBridge = (...args) => callGlobalOrFallback('buildEnumItemTooltip', () => '', ...args);
const getCppReferenceItemBridge = (...args) => {
  const cppUtils = window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  if (cppUtils?.getCppReferenceItem) {
    return cppUtils.getCppReferenceItem(...args);
  }
  const fn = getGlobalFunction('getCppReferenceItem');
  return fn ? fn(...args) : null;
};
const getCppReferenceIconTypeBridge = (...args) => {
  const cppUtils = window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  if (cppUtils?.getCppReferenceIconType) {
    return cppUtils.getCppReferenceIconType(...args);
  }
  const fn = getGlobalFunction('getCppReferenceIconType');
  return fn ? fn(...args) : '';
};
const renderCppReferenceRelatedLinksBridge = (...args) => {
  const cppUtils = window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  if (cppUtils?.renderCppReferenceRelatedLinks) {
    return cppUtils.renderCppReferenceRelatedLinks(...args);
  }
  const fn = getGlobalFunction('renderCppReferenceRelatedLinks');
  return fn ? fn(...args) : '';
};
const renderCppReferenceOfficialSectionBridge = (...args) => {
  const cppUtils = window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  if (cppUtils?.renderCppReferenceOfficialSection) {
    return cppUtils.renderCppReferenceOfficialSection(...args);
  }
  const fn = getGlobalFunction('renderCppReferenceOfficialSection');
  return fn ? fn(...args) : '';
};
const safeRenderEntityLabelBridge = (...args) => {
  const fallbackLabel = String(args[0] || '').trim();
  return callGlobalOrFallback(
    'safeRenderEntityLabel',
    () => fallbackLabel ? `<code dir="ltr">${fallbackLabel}</code>` : '',
    ...args
  );
};
const escapeAttributeBridge = (...args) => callGlobalOrFallback(
  'escapeAttribute',
  (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;'),
  ...args
);
const escapeHtmlBridge = (...args) => callGlobalOrFallback(
  'escapeHtml',
  (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;'),
  ...args
);
const getNavigationEntityIconTypeBridge = (...args) => callGlobalOrFallback('getNavigationEntityIconType', () => '', ...args);
const getExternalReferenceUrlBridge = (...args) => callGlobalOrFallback('getExternalReferenceUrl', () => '', ...args);
const resolveReferenceIconTypeBridge = (...args) => callGlobalOrFallback('resolveReferenceIconType', () => '', ...args);
const buildExternalReferenceTooltipBridge = (...args) => callGlobalOrFallback(
  'buildExternalReferenceTooltip',
  (name) => {
    const label = String(name || '').trim();
    return label ? `مرجع خارجي مرتبط: ${label}` : 'مرجع خارجي مرتبط.';
  },
  ...args
);
const inferEnumTypeFromValueBridge = (...args) => callGlobalOrFallback('inferEnumTypeFromValue', () => '', ...args);
const getEnumMetadataBridge = (...args) => callGlobalOrFallback(
  'getEnumMetadata',
  () => ({meaning: '', apiPurpose: '', values: {}}),
  ...args
);
const renderExternalReferenceBridge = (...args) => callGlobalOrFallback(
  'renderExternalReference',
  (name, _context = {}, label = '') => {
    const text = String(label || name || '').trim();
    return text ? `<code dir="ltr">${escapeHtmlBridge(text)}</code>` : '';
  },
  ...args
);
const renderProjectReferenceLinkBridge = createNamedBridge('renderProjectReferenceLink', () => '');
const buildEnumValueMeaningFallbackBridge = (...args) => callGlobalOrFallback('buildEnumValueMeaningFallback', () => '', ...args);
const buildEnumValueUsageFallbackBridge = (...args) => callGlobalOrFallback('buildEnumValueUsageFallback', () => '', ...args);
const buildEnumValueBenefitFallbackBridge = (...args) => callGlobalOrFallback('buildEnumValueBenefitFallback', () => '', ...args);
const buildEnumOverviewRowsBridge = (...args) => callGlobalOrFallback('buildEnumOverviewRows', () => [], ...args);
const sanitizeEnumNarrativeTextBridge = (...args) => callGlobalOrFallback(
  'sanitizeEnumNarrativeText',
  (rawText, fallback = '') => String(rawText || fallback || ''),
  ...args
);
const renderCanonicalReferenceRichTextBridge = (...args) => callGlobalOrFallback(
  'renderCanonicalReferenceRichText',
  (value = '') => String(value || ''),
  ...args
);
const inferReferenceProfileBridge = createNamedBridge('inferReferenceProfile', () => ({}));
const renderReferenceConceptSectionBridge = createNamedBridge('renderReferenceConceptSection', () => '');
const renderExecutionProfileSectionBridge = createNamedBridge('renderExecutionProfileSection', () => '');
const renderSystemContextSectionBridge = createNamedBridge('renderSystemContextSection', () => '');
const renderValueMeaningSectionBridge = createNamedBridge('renderValueMeaningSection', () => '');
const renderPracticalReferenceSectionBridge = createNamedBridge('renderPracticalReferenceSection', () => '');
const renderUsageSectionBridge = createNamedBridge('renderUsageSection', () => '');
const renderLinkedVulkanExampleSectionBridge = createNamedBridge('renderLinkedVulkanExampleSection', () => '');
const formatExampleWithLinksBridge = createNamedBridge('formatExampleWithLinks', (value = '') => String(value || ''));
const renderLinkedNotesSectionBridge = createNamedBridge('renderLinkedNotesSection', () => '');
const renderOfficialDocsFooterBridge = createNamedBridge('renderOfficialDocsFooter', () => '');
const renderMacroPreprocessorSectionBridge = createNamedBridge('renderMacroPreprocessorSection', () => '');
const renderProjectReferenceChipBridge = createNamedBridge('renderProjectReferenceChip', () => '');
const helper6BootstrapReferenceBridges = Object.freeze({
  findItemInCategoriesWithMeta: (...args) => findItemInCategoriesWithMeta(...args),
  findConstantItemByName: findConstantItemByNameBridge,
  findMacroItemByName: findMacroItemByNameBridge,
  renderVulkanHighlightedCodeBlock: createNamedBridge('renderVulkanHighlightedCodeBlock', () => ''),
  linkUsageBridgeText,
  inferReferenceProfile: inferReferenceProfileBridge,
  renderReferenceConceptSection: renderReferenceConceptSectionBridge,
  renderExecutionProfileSection: renderExecutionProfileSectionBridge,
  renderSystemContextSection: renderSystemContextSectionBridge,
  renderValueMeaningSection: renderValueMeaningSectionBridge,
  renderPracticalReferenceSection: renderPracticalReferenceSectionBridge,
  renderUsageSection: renderUsageSectionBridge,
  renderEntityRelatedConstantsSection: createNamedBridge('renderEntityRelatedConstantsSection', () => ''),
  renderLinkedVulkanExampleSection: renderLinkedVulkanExampleSectionBridge,
  formatExampleWithLinks: formatExampleWithLinksBridge,
  renderGenericExampleExplanation: createNamedBridge('renderGenericExampleExplanation', () => ''),
  renderLinkedNotesSection: renderLinkedNotesSectionBridge,
  renderOfficialDocsFooter: renderOfficialDocsFooterBridge,
  inferMacroPracticalMeaning: createNamedBridge('inferMacroPracticalMeaning', () => ''),
  renderMacroPreprocessorSection: renderMacroPreprocessorSectionBridge,
  highlightCode: createNamedBridge('highlightCode', () => {}),
  syncSidebarWithHash: createNamedBridge('syncSidebarWithHash', () => {}),
  focusPageMeaningAnchor: createNamedBridge('focusPageMeaningAnchor', () => false),
  findCommandItemByName: findCommandItemByNameBridge,
  getTypeNavigation: createNamedBridge('getTypeNavigation', () => null),
  getUsageItems: createNamedBridge('getUsageItems', () => []),
  isReadableLocalizedParagraph: createNamedBridge('isReadableLocalizedParagraph', () => false),
  isMarginalUsageText: createNamedBridge('isMarginalUsageText', () => false),
  inferFunctionIntentSummary: createNamedBridge('inferFunctionIntentSummary', () => ''),
  getDisplayedExample: createNamedBridge('getDisplayedExample', () => null),
  renderFunctionMeaningSection: createNamedBridge('renderFunctionMeaningSection', () => ''),
  renderFunctionLearningGuide: createNamedBridge('renderFunctionLearningGuide', () => ''),
  sanitizeFunctionOfficialDescription: createNamedBridge('sanitizeFunctionOfficialDescription', (value = '') => String(value || '')),
  renderExternalReference: renderExternalReferenceBridge,
  renderTypeReference: createNamedBridge('renderTypeReference', () => ''),
  getCanonicalReferenceDetailAnchorId: createNamedBridge('getCanonicalReferenceDetailAnchorId', () => ''),
  getFunctionParameterAnchorId: createNamedBridge('getFunctionParameterAnchorId', () => ''),
  renderFunctionParameterName: createNamedBridge('renderFunctionParameterName', (value = '') => String(value || '')),
  renderFunctionParameterDescription: createNamedBridge('renderFunctionParameterDescription', (value = '') => String(value || '')),
  getReturnValuesArray: createNamedBridge('getReturnValuesArray', () => []),
  hasRealExample: createNamedBridge('hasRealExample', () => false),
  renderFunctionExplanation: createNamedBridge('renderFunctionExplanation', () => ''),
  renderRelatedReferenceLink: createNamedBridge('renderRelatedReferenceLink', () => ''),
  findTypeItemByName: findTypeItemByNameBridge,
  findFunctionsUsingStructure: createNamedBridge('findFunctionsUsingStructure', () => []),
  getStructureLeadDescription: createNamedBridge('getStructureLeadDescription', () => ''),
  inferStructureRole: createNamedBridge('inferStructureRole', () => ''),
  trimLeadingTypeName: createNamedBridge('trimLeadingTypeName', (value = '') => String(value || '')),
  isVariableStructureItem: createNamedBridge('isVariableStructureItem', () => false),
  renderStructureIntentSection: createNamedBridge('renderStructureIntentSection', () => ''),
  renderDeferredStructureSectionShell: createNamedBridge('renderDeferredStructureSectionShell', () => ''),
  initDeferredStructureSections: createNamedBridge('initDeferredStructureSections', () => {}),
  findItemInCategories: (...args) => findItemInCategories(...args),
  dedupeNotes: createNamedBridge('dedupeNotes', (notes = []) => Array.isArray(notes) ? notes : []),
  simplifyEnumOfficialDescription: createNamedBridge('simplifyEnumOfficialDescription', (value = '') => String(value || '')),
  renderEnumMeaningSection: createNamedBridge('renderEnumMeaningSection', () => ''),
  renderEnumValueTagsSection: createNamedBridge('renderEnumValueTagsSection', () => ''),
  getEnumValueRows: createNamedBridge('getEnumValueRows', () => []),
  getEnumValueMetadata: createNamedBridge('getEnumValueMetadata', () => null),
  buildEnumValueMeaningFallback: buildEnumValueMeaningFallbackBridge,
  buildEnumValueUsageFallback: buildEnumValueUsageFallbackBridge,
  buildEnumValueBenefitFallback: buildEnumValueBenefitFallbackBridge,
  getEnumValueAnchorId: getEnumValueAnchorIdBridge,
  renderProjectReferenceChip: renderProjectReferenceChipBridge,
  renderEnumCoreRelationsSection: createNamedBridge('renderEnumCoreRelationsSection', () => ''),
  splitCodeIntoLineChunks,
  getCodeBlockLanguage: createNamedBridge('getCodeBlockLanguage', () => 'cpp'),
  highlightSingleCodeBlock: createNamedBridge('highlightSingleCodeBlock', () => {}),
  closeActiveSectionVideoModal: createNamedBridge('closeActiveSectionVideoModal', () => {}),
  renderTutorialLeadMedia: createNamedBridge('renderTutorialLeadMedia', () => ''),
  normalizeTutorialLessonSections: createNamedBridge('normalizeTutorialLessonSections', () => {}),
  prepareTutorialCodeContainers: createNamedBridge('prepareTutorialCodeContainers', () => {}),
  activateTutorialLazyCodeBlocks: createNamedBridge('activateTutorialLazyCodeBlocks', () => {}),
  enhanceTutorialExamples: createNamedBridge('enhanceTutorialExamples', () => {}),
  refreshTutorialCodePresentation: createNamedBridge('refreshTutorialCodePresentation', () => {}),
  escapeSelectorValue: createNamedBridge('escapeSelectorValue', (value = '') => String(value || '')),
  getStaticFilePageUrl: createNamedBridge('getStaticFilePageUrl', () => ''),
  getServedFileRelativePath: createNamedBridge('getServedFileRelativePath', () => ''),
  renderLazyFileSourceSection: createNamedBridge('renderLazyFileSourceSection', () => ''),
  initLazyFileSourceViewers: createNamedBridge('initLazyFileSourceViewers', () => {}),
  getCppReferenceItem: getCppReferenceItemBridge,
  getCppReferenceIconType: getCppReferenceIconTypeBridge,
  renderTutorialInfoGrid,
  renderPracticalText: createNamedBridge('renderPracticalText', (value = '') => String(value || '')),
  renderProjectReferenceLink: renderProjectReferenceLinkBridge,
  renderCppReferenceRelatedLinks: renderCppReferenceRelatedLinksBridge,
  renderCppReferenceOfficialSection: renderCppReferenceOfficialSectionBridge,
  getExternalReferenceUrl: getExternalReferenceUrlBridge
});

// ==================== توليد شجرة المحتويات ====================
const projectReferenceRuntime = createProjectReferenceRuntime
  ? createProjectReferenceRuntime({
      resolveReferenceNavigation: resolveReferenceNavigationBridge,
      findEnumOwnerOfValue: findEnumOwnerOfValueBridge,
      getEnumValueAnchorId: getEnumValueAnchorIdBridge,
      buildEnumValueTooltip: buildEnumValueTooltipBridge,
      getCmakeReferenceAlias,
      buildCmakeEntryTooltip,
      findCmakeSearchEntryByName,
      buildTooltipText: buildTooltipTextBridge,
      findCommandItemByName: findCommandItemByNameBridge,
      findMacroItemByName: findMacroItemByNameBridge,
      findConstantItemByName: findConstantItemByNameBridge,
      findItemInCategories: (...args) => findItemInCategories(...args),
      findTypeItemByName: findTypeItemByNameBridge,
      vulkanData,
      buildEnumItemTooltip: buildEnumItemTooltipBridge,
      getCppReferenceItem: getCppReferenceItemBridge,
      buildCppReferenceTooltip,
      buildExternalReferenceTooltip: buildExternalReferenceTooltipBridge,
      sanitizeTooltipText,
      safeRenderEntityLabel: safeRenderEntityLabelBridge,
      escapeAttribute: escapeAttributeBridge,
      escapeHtml: escapeHtmlBridge,
      getNavigationEntityIconType: getNavigationEntityIconTypeBridge,
      getExternalReferenceUrl: getExternalReferenceUrlBridge,
      resolveReferenceIconType: resolveReferenceIconTypeBridge
    })
  : null;

const resolveProjectReferenceAlias = (...args) => projectReferenceRuntime?.resolveProjectReferenceAlias(...args) || null;
const buildNavigationTooltipForName = (...args) => projectReferenceRuntime?.buildNavigationTooltipForName(...args) || '';
const appendTooltipContext = (...args) => projectReferenceRuntime?.appendTooltipContext(...args) || '';
const buildReferenceTooltipContextLine = (...args) => projectReferenceRuntime?.buildReferenceTooltipContextLine(...args) || '';
const buildContextualReferenceTooltip = (...args) => projectReferenceRuntime?.buildContextualReferenceTooltip(...args) || '';
const renderContextualTokenLink = (...args) => projectReferenceRuntime?.renderContextualTokenLink(...args) || '';
const resolveAliasBaseTooltip = (...args) => projectReferenceRuntime?.resolveAliasBaseTooltip(...args) || '';
const resolveProjectAliasTooltip = (...args) => projectReferenceRuntime?.resolveProjectAliasTooltip(...args) || '';
const buildProjectAliasAnchorOnclick = (...args) => projectReferenceRuntime?.buildProjectAliasAnchorOnclick(...args) || '';
const buildProjectAliasElement = (...args) => projectReferenceRuntime?.buildProjectAliasElement(...args) || '';
const renderRelatedReferenceLink = (...args) => projectReferenceRuntime?.renderRelatedReferenceLink(...args) || '';
const getRelatedReferenceIconType = (...args) => projectReferenceRuntime?.getRelatedReferenceIconType(...args) || '';
const getProjectAliasAnchorIconType = (...args) => projectReferenceRuntime?.getProjectAliasAnchorIconType(...args) || '';
const getProjectAliasLinkIconType = (...args) => projectReferenceRuntime?.getProjectAliasLinkIconType(...args) || '';
const getProjectReferenceIconType = (...args) => projectReferenceRuntime?.getProjectReferenceIconType(...args) || '';
const buildProjectAliasLink = (...args) => projectReferenceRuntime?.buildProjectAliasLink(...args) || '';
const renderProjectReferenceChip = (...args) => projectReferenceRuntime?.renderProjectReferenceChip(...args) || '';
const renderProjectReferenceInline = (...args) => projectReferenceRuntime?.renderProjectReferenceInline(...args) || '';

window.renderProjectReferenceChip = renderProjectReferenceChip;

const structureFieldRowsCache = new Map();
const functionsUsingStructureCache = new Map();
const structureDeferredSectionCache = new Map();
const structureFieldRowsInProgress = new Set();
const executionProfileInProgress = new Set();
const tooltipBuildInProgress = new Set();
let glslReferenceItemsCache = null;
let glslReferenceItemsBuilding = false;
let glslReferenceTooltipCache = new WeakMap();
let glslReferenceExampleCache = new WeakMap();
let glslCompilerRoleTextCache = new WeakMap();
let glslTranslationReadCache = new WeakMap();
let glslCompilationEffectCache = new WeakMap();
let glslVulkanBridgeCache = new WeakMap();
let glslTechnicalProseCache = new Map();
let sdl3ReferenceItemsCache = null;
let sdl3ReferenceItemsBuilding = false;
let sdl3ReferenceItemLookupCache = null;
let sdl3SyntheticReferenceLookupCache = null;
const sdl3EntityItemsCache = new Map();
const sdl3PackageItemsCache = new Map();
const sdl3GroupedItemsCache = new Map();
const sdl3KindItemLookupCache = new Map();
const sdl3StructTypeCache = new Map();
const sdl3PropertyReferenceProfileCache = new Map();
const sdl3ReferenceTooltipCache = new Map();
const vulkanEnumRuntime = createVulkanEnumRuntime
  ? createVulkanEnumRuntime({
      inferEnumTypeFromValue: inferEnumTypeFromValueBridge,
      getEnumMetadata: getEnumMetadataBridge,
      renderExternalReference: renderExternalReferenceBridge,
      buildEnumValueMeaningFallback: buildEnumValueMeaningFallbackBridge,
      buildEnumValueUsageFallback: buildEnumValueUsageFallbackBridge,
      buildEnumValueBenefitFallback: buildEnumValueBenefitFallbackBridge,
      buildEnumOverviewRows: buildEnumOverviewRowsBridge,
      sanitizeEnumNarrativeText: sanitizeEnumNarrativeTextBridge
    })
  : null;
function showBootstrapError(error) {
  const content = document.getElementById('mainContent');
  if (!content) return;

  const message = error?.message || String(error || 'حدث خطأ غير معروف أثناء تحميل التطبيق.');
  content.innerHTML = `
    <div class="page-header">
      <h1>تعذر تحميل التوثيق</h1>
      <p>تعذر إكمال تهيئة الواجهة الحالية، لكن المشكلة غالبًا مؤقتة ويمكن إعادة المحاولة مباشرة.</p>
    </div>
    <section class="info-section">
      <div class="content-card prose-card">
        <p><strong>السبب:</strong> ${escapeHtml(message)}</p>
        <p>جرّب إعادة تحميل الصفحة أولًا. إذا استمر الخطأ، افتح Console وأرسل نص الخطأ الظاهر كما هو.</p>
        <div class="bootstrap-error-actions">
          <button type="button" class="bootstrap-error-button" onclick="window.location.reload()">
            إعادة المحاولة
          </button>
        </div>
      </div>
    </section>
  `;
}

function getGeneralDetailPagesRuntimeBridge() {
  if (typeof getGeneralDetailPagesRuntime === 'function') {
    return getGeneralDetailPagesRuntime() || null;
  }
  return window.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__ || null;
}

function getReferenceRuntimeBridge() {
  if (typeof getReferenceRuntime === 'function') {
    return getReferenceRuntime() || null;
  }
  return window.__ARABIC_VULKAN_REFERENCE_RUNTIME__ || null;
}

async function showCppReference(name, options = {}) {
  await ensureUiSegment('cppReferenceUtilsRuntime');
  await ensureUiSegment('generalDetailPagesRuntime');
  await ensureUiSegment('cppReferenceData');
  await ensureUiSegment('cppReferenceEnrichment');
  await ensureUiSegment('cppReferenceOfficialLinks');
  await ensureUiSegment('cppReferenceGuides');
  await ensureUiSegment('cppReferenceTooltips');
  return getGeneralDetailPagesRuntimeBridge()?.showCppReference?.(name, options);
}

async function showFfmpegReference(name, options = {}) {
  await ensureUiSegment('ffmpegSearch');
  const normalizedName = String(name || '').trim();
  const ffmpegEntry = normalizedName
    ? (ffmpegSearchEntries || []).find((item) => String(item?.name || '').trim() === normalizedName)
    : null;

  if (ffmpegEntry?.kind && ffmpegEntry?.slug) {
    await ensureUiSegment('referenceTemplatesRuntime');
    await ensureUiSegment('referenceRuntimePage');
    return getReferenceRuntimeBridge()?.showReferenceEntity?.('ffmpeg', ffmpegEntry.kind, ffmpegEntry.slug, options);
  }

  return ffmpegPageRuntime?.showFfmpegReference?.(name, options);
}

async function showFfmpegIndex(sectionKey = '', options = {}) {
  const normalizedSectionKey = String(sectionKey || '').trim();
  await ensureUiSegment('ffmpegSearch');
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');

  if (!normalizedSectionKey || normalizedSectionKey === 'ffmpeg') {
    return getReferenceRuntimeBridge()?.showReferenceLibraryIndex?.('ffmpeg', options);
  }

  const allowedKindIds = new Set(['modules', 'functions', 'structures', 'enums', 'constants', 'examples']);
  if (allowedKindIds.has(normalizedSectionKey)) {
    return getReferenceRuntimeBridge()?.showReferenceKindIndex?.('ffmpeg', normalizedSectionKey, options);
  }

  return ffmpegPageRuntime?.showFfmpegIndex?.(sectionKey, options);
}

async function showReferenceHub(options = {}) {
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');
  return getReferenceRuntimeBridge()?.showReferenceHub?.(options);
}

async function openStructureField(event, ownerType, fieldName) {
  await ensureHeavyHelper4RuntimeLoaded();
  const runtimeFn = typeof window.openStructureField === 'function'
    && window.openStructureField !== openStructureField
      ? window.openStructureField
      : window.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__?.openStructureField;
  if (typeof runtimeFn === 'function') {
    return runtimeFn(event, ownerType, fieldName);
  }
  return false;
}

async function loadDeferredStructureSection(trigger) {
  await ensureHeavyHelper4RuntimeLoaded();
  const runtimeFn = typeof window.loadDeferredStructureSection === 'function'
    && window.loadDeferredStructureSection !== loadDeferredStructureSection
      ? window.loadDeferredStructureSection
      : window.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__?.loadDeferredStructureSection;
  if (typeof runtimeFn === 'function') {
    return runtimeFn(trigger);
  }
  return false;
}

let appBooted = false;
async function bootApplication() {
  if (appBooted) return;
  appBooted = true;

  try {
    await ensureAppTextData();
    await Promise.all([
      ensureUiSegment('vulkanSearch'),
      ensureUiSegment('sdl3Lexicon'),
      ensureUiSegment('sdl3Tooltip')
    ]);
    configureBootstrapModules({
      appBrandTitle: APP_BRAND_TITLE,
      getSiteUsageGuide: () => getAppTextValue('SITE_USAGE_GUIDE'),
      getTutorialCatalog: () => tutorialCatalog,
      buildHomeLibraryModels,
      buildHomeHeroStats,
      setCurrentView: (view) => {
        currentView = view;
      },
      syncRouteHistory,
      scheduleRecentVisitCapture,
      scrollMainContentToTop,
      clearActiveSidebarItems,
      collapseAllSidebarClusters,
      collapseAllSidebarSections,
      renderEntityIcon,
      renderDocCodeContainer,
      renderCanonicalReferenceRichText: renderCanonicalReferenceRichTextBridge,
      buildCanonicalReferenceExample,
      escapeHtml,
      escapeAttribute,
      fetchJsonData,
      scheduleProseCardReferenceLinking,
      getCanonicalReferenceKindMeta,
      resolveCanonicalReferenceRoute,
      getVulkanData: () => vulkanData,
      getVulkanFileSections: () => vulkanFileSections,
      getFileReferenceData: () => fileReferenceData,
      getVariableTypeCollections,
      getAllConstantReferenceEntries,
      getCommandSummaryText,
      ensureConstantsListPopulated,
      ensureUiSegment,
      populateTutorialsList,
      populateFilesList,
      setActiveSidebarItemBySelector,
      ensureDataSegment,
      ...helper6BootstrapReferenceBridges,
      getImguiReferenceSections: () => imguiReferenceSections,
      getImguiMeta: () => imguiMeta,
      getImguiFallbackMeta: () => getAppTextValue('IMGUI_HOME_FALLBACK_META'),
      isImguiLoaded: () => Boolean(uiSegmentLoaded.imgui),
      getTutorialContent: () => tutorialContent,
      renderCppReferenceProjectGuidance: (item) => getCppReferenceUtilsRuntime()?.renderCppReferenceProjectGuidance?.(item) || '',
      getCppHomeConfig: () => CPP_HOME_DATA,
      getCppReferenceData: () => CPP_REFERENCE_DATA,
      getCppReferenceEnrichmentData: () => CPP_REFERENCE_ENRICHMENT,
      getCppReferenceOfficialLinks: () => CPP_REFERENCE_OFFICIAL_LINKS,
      getCppReferenceGuides: () => CPP_REFERENCE_GUIDES,
      getCppDeepGuides: () => CPP_DEEP_GUIDES,
      getCppReferenceTooltipOverrides: () => CPP_REFERENCE_TOOLTIP_OVERRIDES,
      getCppKeywordTokens: () => cppKeywordTokens,
      getSdl3ArabicWordMap: () => SDL3_ARABIC_WORD_MAP,
      getSdl3SearchPreview: (item) => buildSdl3SearchPreview(item),
      getSdl3SearchEntries: () => sdl3SearchEntries,
      getCmakeSearchEntries: () => cmakeSearchEntries,
      getFfmpegSearchEntries: () => ffmpegSearchEntries,
      getCurrentView: () => currentView,
      ensureAllSdl3PackageData
    });
    await ensureHeavyHelper4RuntimeLoaded();
    refreshDynamicSearchSubFilterConfig();
    initTooltipSystem();
    initSidebarNavigation();
    initSidebarResizer();
    initMobileSidebarToggle();
    initTutorialCodeLazyHighlighting();
    initProseCardReferenceLinking();
    loadData();

    window.__ARABIC_VULKAN_SEARCH__?.initializeSearchUi?.();
    renderRecentVisits();
    initSidebarSmartScrollButton();
    initPageSmartScrollButton();
    scheduleSidebarCloseOpenVisibilitySync();

    if (window.location.hash) {
      handleHashChange();
    } else {
      scheduleRecentVisitCapture('home');
    }
  } catch (error) {
    console.error('خطأ أثناء تهيئة التطبيق:', error);
    showBootstrapError(error);
  }
}

// ==================== التهيئة ====================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApplication);
} else {
  bootApplication();
}

window.addEventListener('error', (event) => {
  if (appBooted && document.getElementById('mainContent')?.textContent?.includes('جاري تحميل التوثيق')) {
    showBootstrapError(event.error || new Error(event.message || 'فشل تشغيل أحد السكربتات.'));
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (document.getElementById('mainContent')?.textContent?.includes('جاري تحميل التوثيق')) {
    showBootstrapError(event.reason || new Error('حدث خطأ غير معالج أثناء التحميل.'));
  }
});

document.addEventListener('click', (event) => {
  const copyButton = event.target.closest('.copy-code');
  if (copyButton) {
    event.preventDefault();
    copyCode(copyButton);
    return;
  }

  const toggleButton = event.target.closest('.toggle-code');
  if (toggleButton) {
    event.preventDefault();
    toggleCodeBlock(toggleButton);
    return;
  }

  if (!event.target.closest('.search-container')) {
    hideSearchSuggestions();
    setSearchUiActive(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeTutorialVideoModal();
  }
});

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  const segments = hash.split('/').filter((segment) => segment !== '');
  const [type, name, thirdSegment, fourthSegment] = segments;
  const options = {skipHistory: true};

  if (type === 'ref') {
    const libraryId = decodeURIComponent(name || '');
    const kindId = decodeURIComponent(thirdSegment || '');
    const slug = decodeURIComponent(fourthSegment || '');

    if (libraryId === 'cmake') {
      if (!kindId) {
        showCmakeIndex(options);
        return;
      }

      if (!slug) {
        showCmakeKindIndex(kindId, options);
        return;
      }

      showCmakeEntity(kindId, slug, options);
      return;
    }

    if (libraryId === 'vulkan' && !kindId) {
      showVulkanIndex(options);
      return;
    }

    if (!libraryId) {
      showReferenceHub(options);
      return;
    }

    if (!kindId) {
      showReferenceLibraryIndex(libraryId, options);
      return;
    }

    if (!slug) {
      showReferenceKindIndex(libraryId, kindId, options);
      return;
    }

    showReferenceEntity(libraryId, kindId, slug, options);
    return;
  }

  switch(type) {
    case 'command':
      showCommand(name, getCommandCategoryKey(name), options);
      break;
    case 'tutorial':
      showTutorial(decodeURIComponent(name), options);
      break;
    case 'file':
      showFile(decodeURIComponent(name), options);
      break;
    case 'structure':
      showStructure(name, options);
      break;
    case 'enum':
      showEnum(name, options);
      break;
    case 'constant':
      showConstant(name, options);
      break;
    case 'macro':
      showMacro(name, options);
      break;
    case 'commands':
      showCommandsIndex(options);
      break;
    case 'structures':
      showStructuresIndex(options);
      break;
    case 'variables':
      showVariablesIndex(options);
      break;
    case 'enums':
      showEnumsIndex(options);
      break;
    case 'constants':
      showConstantsIndex(options);
      break;
    case 'tutorials':
      showTutorialsIndex(options);
      break;
    case 'files':
      showFilesIndex(options);
      break;
    case 'sdl3':
      showSdl3Reference(decodeURIComponent(name), options);
      break;
    case 'sdl3-function':
      showSdl3Function(decodeURIComponent(name), options);
      break;
    case 'sdl3-type':
      showSdl3Type(decodeURIComponent(name), options);
      break;
    case 'sdl3-enum':
      showSdl3Enum(decodeURIComponent(name), options);
      break;
    case 'sdl3-constant':
      showSdl3Constant(decodeURIComponent(name), options);
      break;
    case 'sdl3-macro':
      showSdl3Macro(decodeURIComponent(name), options);
      break;
    case 'sdl3-index':
      showSdl3Index(options);
      break;
    case 'sdl3-package':
      showSdl3PackageIndex(decodeURIComponent(name), options);
      break;
    case 'sdl3-examples':
      showSdl3ExamplesIndex(decodeURIComponent(name || 'core'), options);
      break;
    case 'sdl3-audio-guide':
      showSdl3AudioGuide(options);
      break;
    case 'sdl3-example': {
      const parsed = parseSdl3ExampleCompositeName(decodeURIComponent(name || 'core::'));
      showSdl3Example(parsed.packageKey, parsed.exampleId, options);
      break;
    }
    case 'sdl3-package-section': {
      const parsed = parseSdl3PackageSectionCompositeName(decodeURIComponent(name));
      showSdl3PackageSectionIndex(parsed.packageKey, parsed.dataKey, options);
      break;
    }
    case 'sdl3-header':
      showSdl3HeaderFile(decodeURIComponent(name), options);
      break;
    case 'sdl3-functions':
      showSdl3SectionIndex('functions', options);
      break;
    case 'sdl3-structures':
      showSdl3SectionIndex('structures', options);
      break;
    case 'sdl3-variables':
      showSdl3SectionIndex('variables', options);
      break;
    case 'sdl3-types':
      showSdl3SectionIndex('types', options);
      break;
    case 'sdl3-enums':
      showSdl3SectionIndex('enums', options);
      break;
    case 'sdl3-constants':
      showSdl3SectionIndex('constants', options);
      break;
    case 'sdl3-macros':
      showSdl3SectionIndex('macros', options);
      break;
    case 'imgui':
      showImguiReference(decodeURIComponent(name), options);
      break;
    case 'imgui-index':
      showImguiIndex(options);
      break;
    case 'imgui-examples':
      showImguiExamplesIndex(options);
      break;
    case 'imgui-example':
      showImguiExample(decodeURIComponent(name), options);
      break;
    case 'game-ui':
      showGameUiItem(decodeURIComponent(name), options);
      break;
    case 'game-ui-example':
      showGameUiExample(decodeURIComponent(name), options);
      break;
    case 'game-ui-index':
      showGameUiIndex(options);
      break;
    case 'game-ui-examples':
      showGameUiExamplesIndex(options);
      break;
    case 'glsl':
      showGlslReference(decodeURIComponent(name), options);
      break;
    case 'glsl-index':
      showGlslIndex(options);
      break;
    case 'glsl-examples':
      showGlslExamplesIndex(options);
      break;
    case 'glsl-example':
      showGlslExample(decodeURIComponent(name), options);
      break;
    case 'ffmpeg':
      showFfmpegReference(decodeURIComponent(name), options);
      break;
    case 'ffmpeg-index':
      showFfmpegIndex(decodeURIComponent(name), options);
      break;
    case 'vulkan-examples':
      showVulkanExamplesIndex(options);
      break;
    case 'vulkan-example':
      showVulkanExample(decodeURIComponent(name), options);
      break;
    case 'cpp':
      showCppReference(decodeURIComponent(name), options);
      break;
    case 'cpp-index':
      showCppIndex(decodeURIComponent(name), options);
      break;
    case 'home':
      showHomePage(options);
      break;
    case 'site-usage':
      showSiteUsageGuide(options);
      break;
    default:
      showHomePage(options);
      break;
  }

  scheduleRecentVisitCapture(hash || 'home');
  window.setTimeout(initPageSmartScrollButton, 0);
  scheduleSidebarCloseOpenVisibilitySync();
}

window.addEventListener('hashchange', handleHashChange);

// تصدير الدوال
window.ensureUiSegment = ensureUiSegment;
window.showHomePage = showHomePage;
window.showSiteUsageGuide = showSiteUsageGuide;
window.showCommand = showCommand;
window.showStructure = showStructure;
window.showEnum = showEnum;
window.showConstant = showConstant;
window.showMacro = showMacro;
window.showTutorialPrev = showTutorialPrev;
window.showTutorialNext = showTutorialNext;
window.showSdl3Reference = showSdl3Reference;
window.showSdl3Index = showSdl3Index;
window.showSdl3PackageIndex = showSdl3PackageIndex;
window.showSdl3PackageSectionIndex = showSdl3PackageSectionIndex;
window.showSdl3HeaderFile = showSdl3HeaderFile;
window.showSdl3SectionIndex = showSdl3SectionIndex;
window.getSdl3PackageSectionStateKey = getSdl3PackageSectionStateKey;
window.showSdl3Function = showSdl3Function;
window.showSdl3Type = showSdl3Type;
window.showSdl3Enum = showSdl3Enum;
window.showSdl3Constant = showSdl3Constant;
window.showSdl3Macro = showSdl3Macro;
window.showSdl3AudioGuide = showSdl3AudioGuide;
window.showSdl3ExamplesIndex = showSdl3ExamplesIndex;
window.showSdl3Example = showSdl3Example;
window.getSdl3PackageTotalCount = getSdl3PackageTotalCount;
window.populateCmakeList = populateCmakeList;
window.showCmakeIndex = showCmakeIndex;
window.showCmakeKindIndex = showCmakeKindIndex;
window.showCmakeEntity = showCmakeEntity;
window.populateCppList = populateCppList;
window.showCppIndex = showCppIndex;
window.showVulkanIndex = showVulkanIndex;
window.toggleSdl3PackageKindSection = toggleSdl3PackageKindSection;
window.isSdl3PackageDataLoaded = isSdl3PackageDataLoaded;
window.isSdl3PackageKindDataLoaded = isSdl3PackageKindDataLoaded;
window.ensureSdl3PackageData = ensureSdl3PackageData;
window.ensureSdl3PackageKindData = ensureSdl3PackageKindData;
window.ensureSdl3SectionData = ensureSdl3SectionData;
window.ensureAllSdl3PackageData = ensureAllSdl3PackageData;
window.showImguiReference = showImguiReference;
window.showImguiIndex = showImguiIndex;
window.showImguiHomeSection = showImguiHomeSection;
window.showImguiExamplesIndex = showImguiExamplesIndex;
window.showImguiExample = showImguiExample;
window.renderImguiExamplesGroupedIndexSection = renderImguiExamplesGroupedIndexSection;
window.buildImguiExamplePageModel = buildImguiExamplePageModel;
window.renderImguiExamplePageOverviewCard = renderImguiExamplePageOverviewCard;
window.renderImguiExamplePageCodeSection = renderImguiExamplePageCodeSection;
window.renderImguiExamplePageSupportGrid = renderImguiExamplePageSupportGrid;
window.toggleImguiReferenceSection = toggleImguiReferenceSection;
window.toggleImguiExampleGroup = toggleImguiExampleGroup;
window.showGameUiIndex = showGameUiIndex;
window.showGameUiHomeSection = showGameUiHomeSection;
window.showGameUiExamplesIndex = showGameUiExamplesIndex;
window.showGameUiItem = showGameUiItem;
window.showGameUiExample = showGameUiExample;
window.toggleGameUiReferenceSection = toggleGameUiReferenceSection;
window.toggleGameUiExampleGroup = toggleGameUiExampleGroup;
window.showFfmpegReference = showFfmpegReference;
window.showFfmpegIndex = showFfmpegIndex;
window.showGlslReference = showGlslReference;
window.showGlslIndex = showGlslIndex;
window.showGlslHomeSection = showGlslHomeSection;
window.showGlslExamplesIndex = showGlslExamplesIndex;
window.showGlslExample = showGlslExample;
window.renderGlslExamplesGroupedIndexSection = renderGlslExamplesGroupedIndexSection;
window.toggleGlslReferenceSection = toggleGlslReferenceSection;
window.showVulkanExamplesIndex = showVulkanExamplesIndex;
window.showVulkanExample = showVulkanExample;
window.getVulkanReadyExampleById = getVulkanReadyExampleById;
window.renderVulkanExamplesGroupedIndexSection = renderVulkanExamplesGroupedIndexSection;
window.hydrateLazySdl3NavGroup = hydrateLazySdl3NavGroup;
window.buildSdl3ExampleCompositeName = buildSdl3ExampleCompositeName;
window.parseSdl3ExampleCompositeName = parseSdl3ExampleCompositeName;
window.getSdl3ReadyExamples = getSdl3ReadyExamples;
window.getSdl3ReadyExampleById = getSdl3ReadyExampleById;
window.renderSdl3ExamplesGroupedIndexSection = renderSdl3ExamplesGroupedIndexSection;
window.renderSdl3ExamplesPreviewSection = renderSdl3ExamplesPreviewSection;
window.renderSdl3AudioChannelLayoutGuidePage = renderSdl3AudioChannelLayoutGuidePage;
window.buildSdl3ReadyExamplePageModel = buildSdl3ReadyExamplePageModel;
window.renderSdl3ReadyExamplePageOverviewCard = renderSdl3ReadyExamplePageOverviewCard;
window.renderSdl3ReadyExamplePageCodeSection = renderSdl3ReadyExamplePageCodeSection;
window.renderSdl3ReadyExamplePageSupportGrid = renderSdl3ReadyExamplePageSupportGrid;
window.renderVulkanReadyExamplePageOverviewCard = renderVulkanReadyExamplePageOverviewCard;
window.renderVulkanReadyExamplePageCodeSection = renderVulkanReadyExamplePageCodeSection;
window.renderVulkanReadyExamplePageCommandsSection = renderVulkanReadyExamplePageCommandsSection;
window.renderVulkanReadyExamplePageSupportGrid = renderVulkanReadyExamplePageSupportGrid;
window.renderVulkanReadyExampleExplanation = renderVulkanReadyExampleExplanation;
window.renderVulkanReadyExamplePreview = renderVulkanReadyExamplePreview;
window.getVulkanExampleDisplayTitle = getVulkanExampleDisplayTitle;
window.localizeGlslStageLabels = localizeGlslStageLabels;
window.renderGlslReadyExamplePreview = renderGlslReadyExamplePreview;
window.renderGlslReadyExampleOverviewCard = renderGlslReadyExampleOverviewCard;
window.renderGlslReadyExampleShaderSection = renderGlslReadyExampleShaderSection;
window.renderGlslReadyExampleCommandsSection = renderGlslReadyExampleCommandsSection;
window.renderGlslReadyExampleVulkanUsageSection = renderGlslReadyExampleVulkanUsageSection;
window.renderGlslReadyExampleSupportGrid = renderGlslReadyExampleSupportGrid;
window.populateSidebar = populateSidebar;
window.populateFunctionsList = populateFunctionsList;
window.populateMacrosList = populateMacrosList;
window.populateStructuresList = populateStructuresList;
window.populateVariablesList = populateVariablesList;
window.populateEnumsList = populateEnumsList;
window.populateTutorialsList = populateTutorialsList;
window.populateVulkanExamplesList = populateVulkanExamplesList;
window.populateFilesList = populateFilesList;
window.toggleGlslExampleGroup = toggleGlslExampleGroup;
window.toggleVulkanExampleGroup = toggleVulkanExampleGroup;
window.showCppReference = showCppReference;
window.showCommandsIndex = showCommandsIndex;
window.showStructuresIndex = showStructuresIndex;
window.showEnumsIndex = showEnumsIndex;
window.showVariablesIndex = showVariablesIndex;
window.showConstantsIndex = showConstantsIndex;
window.showTutorial = showTutorial;
window.showTutorialsIndex = showTutorialsIndex;
window.showReferenceHub = showReferenceHub;
window.showReferenceLibraryIndex = showReferenceLibraryIndex;
window.showReferenceKindIndex = showReferenceKindIndex;
window.showReferenceEntity = showReferenceEntity;
window.showFile = showFile;
window.showFilesIndex = showFilesIndex;
window.openStructureNavItem = openStructureNavItem;
window.openFunctionNavItem = openFunctionNavItem;
window.openConstantReference = openConstantReference;
window.populateConstantsList = populateConstantsList;
window.ensureConstantsListPopulated = ensureConstantsListPopulated;
window.getAllConstantReferenceEntries = getAllConstantReferenceEntries;
window.openStructureField = openStructureField;
window.loadDeferredStructureSection = loadDeferredStructureSection;
window.handleSidebarNavActivation = handleSidebarNavActivation;
window.scrollToAnchor = scrollToAnchor;
window.scrollToHomeLibrarySection = scrollToHomeLibrarySection;
window.toggleConstantGroup = toggleConstantGroup;
window.toggleTree = toggleTree;
window.toggleSection = toggleSection;
window.toggleSidebarCluster = toggleSidebarCluster;
window.openSectionVideoModal = openSectionVideoModal;
window.closeSectionVideoModal = closeSectionVideoModal;
window.openSectionVideoExternal = openSectionVideoExternal;
window.handleSectionVideoModalBackdrop = handleSectionVideoModalBackdrop;
window.copyCode = copyCode;
window.getKnownFunctionNames = getKnownFunctionNames;
window.getKnownConstantNames = getKnownConstantNames;
window.getKnownMacroNames = getKnownMacroNames;
window.clearRecentVisits = clearRecentVisits;
window.removeRecentVisit = removeRecentVisit;
window.openRecentVisit = openRecentVisit;
window.toggleSidebarSmartScroll = toggleSidebarSmartScroll;
window.toggleSidebarJumpMenu = toggleSidebarJumpMenu;
window.jumpToSidebarCluster = jumpToSidebarCluster;
window.togglePageSmartScroll = togglePageSmartScroll;
