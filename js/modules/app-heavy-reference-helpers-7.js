// ArabicVulkan - extracted final app.js bootstrap/import layer (phase328)

// ArabicVulkan - موقع توثيق وتعليم Vulkan باللغة العربية

const APP_ASSET_VERSION = '20260322phase442a';
const APP_BRAND_TITLE = 'ا. المرجع العربي للبرمجة';
const APP_TEXT_SOURCE = 'data/ui/app-text.json';
const PASSIVE_SCROLL_CAPTURE_OPTIONS = {capture: true, passive: true};
const {
  containsCppNullptrToken,
  extractUniqueVulkanCodeTokens,
  extractUniqueVulkanReferenceTokens,
  findUniqueVulkanConstantTokens,
  findUniqueVulkanFunctionTokens,
  findUniqueVulkanTypeTokens,
  getEnumVendorTokenPattern,
  maskAllowedVulkanNarrativeTokens,
  stripVulkanTechnicalIdentifiers,
  unmaskAllowedVulkanNarrativeTokens
} = window.__ARABIC_VULKAN_VULKAN_PATTERNS__ || {};
const {
  decodeBasicHtmlEntities: sharedDecodeBasicHtmlEntities,
  sanitizeTooltipText: sharedSanitizeTooltipText,
  formatArabicOfficialDescription,
  formatSdlCodeExpressionText,
  getExamplePreviewIntro,
  looksLikeSdlCodeExpression,
  maskAllowedSdlTechnicalTokens,
  missingFunctionOfficialDescription,
  stripArabicOfficialDescriptionPrefix,
  stripSdlTooltipIdentifierNoise
} = window.__ARABIC_VULKAN_SHARED_PATTERNS__ || {};
const decodeBasicHtmlEntities = typeof sharedDecodeBasicHtmlEntities === 'function'
  ? sharedDecodeBasicHtmlEntities
  : (text = '') => String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const sanitizeTooltipText = typeof sharedSanitizeTooltipText === 'function'
  ? sharedSanitizeTooltipText
  : (text = '') => decodeBasicHtmlEntities(
    String(text || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|li|div|tr|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
const {
  pickRandomEntries: pickRandomExampleEntries,
  renderExampleHeroSection,
  renderExampleIndexLayout,
  renderExamplePageLayout,
  renderLibraryExamplePreviewCard,
  renderLibraryExamplePreviewSection,
  renderUnifiedExampleOverviewCard,
  renderUnifiedExampleRelatedLinks,
  renderUnifiedExampleSectionCard,
  renderUnifiedExampleSupportCard
} = window.__ARABIC_VULKAN_UI_BLOCKS__ || {};
const {
  showGameUiExample,
  showGameUiExamplesIndex,
  showGameUiHomeSection,
  showGameUiIndex,
  showGameUiItem,
  showGlslExample,
  showGlslExamplesIndex,
  showImguiExample,
  showImguiExamplesIndex,
  showSdl3Example,
  showSdl3ExamplesIndex,
  showVulkanExample,
  showVulkanExamplesIndex
} = window.__ARABIC_VULKAN_EXAMPLE_ROUTES__ || {};
const {
  clearActiveSidebarItems,
  collapseAllSidebarClusters,
  collapseAllSidebarNavGroups,
  collapseAllSidebarSections,
  expandSidebarSectionById,
  gameUiExpandedExampleGroups,
  gameUiExpandedReferenceSections,
  glslExpandedExampleGroups,
  glslExpandedReferenceSections,
  handleSidebarNavActivation,
  imguiExpandedExampleGroups,
  imguiExpandedReferenceSections,
  sdl3ExpandedNavGroups,
  sdl3ExpandedPackageSections,
  setActiveSidebarItemBySelector,
  syncSidebarWithHash,
  toggleSection,
  toggleSidebarCluster,
  vulkanExpandedExampleGroups
} = window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ || {};
const {
  GLSL_EXAMPLE_DISPLAY_META,
  GLSL_EXAMPLE_SECTION_BY_ID,
  GLSL_EXAMPLE_SECTIONS,
  buildGlslExampleNavTooltip,
  buildGlslExampleSectionReason,
  buildGlslReferenceSectionIntro,
  buildGlslSectionSidebarTooltip,
  getGlslExampleDisplayMeta,
  getGlslExampleDisplayTitle,
  getGlslExampleInternalDocLink,
  getGlslExamplePreviewEntries,
  getGlslExampleSectionMeta,
  getGlslExampleSupplementaryTracks,
  getGlslGroupedReadyExamples,
  getGlslIndexPreviewSnippet,
  getGlslReferenceSectionId,
  parseGlslReferenceSectionId,
  populateGlslList,
  rememberGlslReferenceSectionState,
  rememberGlslReferenceSectionStateById,
  renderGlslExamplesGroupedIndexSection,
  renderGlslExamplesPreviewSection,
  renderGlslIndexCardPreview,
  renderGlslReadyExamplesIndexSection,
  renderGlslReadyExamplesSection,
  renderGlslReferenceIndexSection,
  renderGlslSectionNavItems,
  renderGlslSectionOverviewCard,
  toggleGlslExampleGroup,
  toggleGlslReferenceSection
} = window.__ARABIC_VULKAN_GLSL_SECTION__ || {};
const {
  buildGameUiReferenceTooltip,
  getAllGameUiReferenceItems,
  getGameUiExampleItem,
  getGameUiHomeSections,
  getGameUiItemKindLabel,
  getGameUiKindIcon,
  getGameUiReferenceItem,
  getGameUiReferenceSectionId,
  getGameUiSectionIcon,
  getGroupedGameUiExampleItems,
  parseGameUiReferenceSectionId,
  populateGameUiList,
  rememberGameUiReferenceSectionState,
  rememberGameUiReferenceSectionStateById,
  renderGameUiCodeBlock,
  renderGameUiDetailsList,
  renderGameUiDocText,
  renderGameUiExampleOverviewSection,
  renderGameUiExampleSummaryCard,
  renderGameUiGroupedIndexSection,
  renderGameUiHomeHeroPreview,
  renderGameUiIndexCardPreview,
  renderGameUiItemHeroPreview,
  renderGameUiParametersTable,
  renderGameUiRelatedLink,
  renderGameUiRelatedSection,
  renderGameUiRepresentationCard,
  toggleGameUiExampleGroup,
  toggleGameUiReferenceSection
} = window.__ARABIC_VULKAN_GAME_UI_SECTION__ || {};
const {
  configureBootstrapModules
} = window.__ARABIC_VULKAN_APP_BOOTSTRAP_CONFIG__ || {};
const {
  createRuntimeAgentController
} = window.__ARABIC_VULKAN_APP_RUNTIME_AGENTS__ || {};
const {
  createAppTextLoader
} = window.__ARABIC_VULKAN_APP_TEXT_LOADER__ || {};
const {
  createProjectReferenceRuntime
} = window.__ARABIC_VULKAN_PROJECT_REFERENCE_RUNTIME__ || {};
const {
  createCmakeSemanticRuntime
} = window.__ARABIC_VULKAN_CMAKE_SEMANTIC_RUNTIME__ || {};
const {
  createTooltipRuntime
} = window.__ARABIC_VULKAN_TOOLTIP_RUNTIME__ || {};
const {
  createCppGlfwRuntime
} = window.__ARABIC_VULKAN_CPP_GLFW_RUNTIME__ || {};
const {
  createVulkanEnumRuntime
} = window.__ARABIC_VULKAN_VULKAN_ENUM_RUNTIME__ || {};
const {
  createSdl3CodeRuntime
} = window.__ARABIC_VULKAN_SDL3_CODE_RUNTIME__ || {};
const {
  createSdl3RelatedRuntime
} = window.__ARABIC_VULKAN_SDL3_RELATED_RUNTIME__ || {};
const {
  createTutorialFallbackRuntime
} = window.__ARABIC_VULKAN_TUTORIAL_FALLBACK_RUNTIME__ || {};
const {
  createSdl3ExampleGroupsRuntime
} = window.__ARABIC_VULKAN_SDL3_EXAMPLE_GROUPS_RUNTIME__ || {};
const {
  createSdl3ReadyExamplePreviewRuntime
} = window.__ARABIC_VULKAN_SDL3_READY_EXAMPLE_PREVIEW_RUNTIME__ || {};
const {
  createSdl3ReadyExamplePageRuntime
} = window.__ARABIC_VULKAN_SDL3_READY_EXAMPLE_PAGE_RUNTIME__ || {};
const {
  createVulkanExamplePreviewRuntime
} = window.__ARABIC_VULKAN_VULKAN_EXAMPLE_PREVIEW_RUNTIME__ || {};
const {
  createVulkanReadyExamplePageRuntime
} = window.__ARABIC_VULKAN_VULKAN_READY_EXAMPLE_PAGE_RUNTIME__ || {};
const {
  createVulkanReadyExamplePreviewRuntime
} = window.__ARABIC_VULKAN_VULKAN_READY_EXAMPLE_PREVIEW_RUNTIME__ || {};
const {
  createSdl3ExamplePreviewRuntime
} = window.__ARABIC_VULKAN_SDL3_EXAMPLE_PREVIEW_RUNTIME__ || {};
const {
  createImguiExamplePreviewRuntime
} = window.__ARABIC_VULKAN_IMGUI_EXAMPLE_PREVIEW_RUNTIME__ || {};
const {
  createSdl3ParameterRenderRuntime
} = window.__ARABIC_VULKAN_SDL3_PARAMETER_RENDER_RUNTIME__ || {};
const {
  createSdl3EntityRenderRuntime
} = window.__ARABIC_VULKAN_SDL3_ENTITY_RENDER_RUNTIME__ || {};
const {
  createSdl3DetailRuntime
} = window.__ARABIC_VULKAN_SDL3_DETAIL_RUNTIME__ || {};
const {
  createSdl3NavRuntime
} = window.__ARABIC_VULKAN_SDL3_NAV_RUNTIME__ || {};
const {
  createGlslPageRuntime
} = window.__ARABIC_VULKAN_GLSL_PAGE_RUNTIME__ || {};
const {
  createVulkanHomeRuntime
} = window.__ARABIC_VULKAN_VULKAN_HOME_RUNTIME__ || {};
const {
  createCmakeHomeRuntime
} = window.__ARABIC_VULKAN_CMAKE_HOME_RUNTIME__ || {};
const {
  createGlslHomeRuntime
} = window.__ARABIC_VULKAN_GLSL_HOME_RUNTIME__ || {};
const {
  createGlslExampleRuntime
} = window.__ARABIC_VULKAN_GLSL_EXAMPLE_RUNTIME__ || {};
const {
  createSdl3HomeRuntime
} = window.__ARABIC_VULKAN_SDL3_HOME_RUNTIME__ || {};
const {
  createHomeShellRuntime
} = window.__ARABIC_VULKAN_HOME_SHELL_RUNTIME__ || {};
const {
  createTreeRuntime
} = window.__ARABIC_VULKAN_TREE_RUNTIME__ || {};
const {
  createCategoryLookupRuntime
} = window.__ARABIC_VULKAN_CATEGORY_LOOKUP_RUNTIME__ || {};
const {
  createVulkanSidebarRuntime
} = window.__ARABIC_VULKAN_VULKAN_SIDEBAR_RUNTIME__ || {};
const {
  createVulkanConstantsRuntime
} = window.__ARABIC_VULKAN_VULKAN_CONSTANTS_RUNTIME__ || {};
const {
  createAppDataRuntime
} = window.__ARABIC_VULKAN_APP_DATA_RUNTIME__ || {};
const {
  createSdl3PackageDataRuntime
} = window.__ARABIC_VULKAN_SDL3_PACKAGE_DATA_RUNTIME__ || {};
const {
  createAppLoadRuntime
} = window.__ARABIC_VULKAN_APP_LOAD_RUNTIME__ || {};
const {
  DATA_SEGMENT_SOURCES,
  UI_SEGMENT_SOURCES,
  SDL3_ENTITY_BASE_DATA_KEYS,
  SDL3_PACKAGE_SEGMENT_SOURCES,
  SDL3_PACKAGE_KIND_SEGMENT_SOURCES,
  createDataSegmentLoadedState,
  createDataSegmentPromiseState,
  createUiSegmentLoadedState,
  createUiSegmentPromiseState,
  createSdl3PackageSegmentLoadedState,
  createSdl3PackageKindLoadedState,
  createSdl3PackagePromiseState,
  getSdl3EntityBaseDataKey,
  getAvailableSegmentChunkKeys: getAvailableSegmentChunkKeysFromRegistry,
  getDataSegmentChunkSource: getDataSegmentChunkSourceFromRegistry,
  isDataSegmentLoaded: isDataSegmentLoadedFromRegistry,
  markDataSegmentLoaded: markDataSegmentLoadedFromRegistry
} = window.__ARABIC_VULKAN_APP_SEGMENT_REGISTRY__ || {};
