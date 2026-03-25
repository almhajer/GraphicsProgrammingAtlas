(function (global) {
  function configureBootstrapModules(context = {}) {
    global.__ARABIC_VULKAN_BOOTSTRAP_CONTEXT__ = context;
    const getSiteUsageGuide = typeof context.getSiteUsageGuide === 'function'
      ? context.getSiteUsageGuide
      : () => ({title: 'استخدام الموقع', excerpt: '', summaryCards: [], sections: []});
    const getTutorialCatalog = typeof context.getTutorialCatalog === 'function'
      ? context.getTutorialCatalog
      : () => [];
    const buildHomeLibraryModels = typeof context.buildHomeLibraryModels === 'function'
      ? context.buildHomeLibraryModels
      : () => [];
    const buildHomeHeroStats = typeof context.buildHomeHeroStats === 'function'
      ? context.buildHomeHeroStats
      : () => [];

    global.__ARABIC_VULKAN_HOME_PAGE__?.configure?.({
      getAppBrandTitle: () => context.appBrandTitle,
      getSiteUsageGuide: () => getSiteUsageGuide(),
      getTutorialCatalog: () => getTutorialCatalog(),
      buildHomeLibraryModels,
      buildHomeHeroStats,
      setCurrentView: context.setCurrentView,
      syncRouteHistory: context.syncRouteHistory,
      scrollMainContentToTop: context.scrollMainContentToTop,
      clearActiveSidebarItems: context.clearActiveSidebarItems,
      collapseAllSidebarClusters: context.collapseAllSidebarClusters,
      collapseAllSidebarSections: context.collapseAllSidebarSections,
      renderEntityIcon: context.renderEntityIcon,
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute
    });

    global.__ARABIC_VULKAN_REFERENCE_RUNTIME__?.configure?.({
      fetchJsonData: context.fetchJsonData,
      ensureUiSegment: context.ensureUiSegment,
      setCurrentView: context.setCurrentView,
      syncRouteHistory: context.syncRouteHistory,
      scheduleProseCardReferenceLinking: context.scheduleProseCardReferenceLinking,
      highlightCode: context.highlightCode,
      prepareTutorialCodeContainers: context.prepareTutorialCodeContainers,
      activateTutorialLazyCodeBlocks: context.activateTutorialLazyCodeBlocks,
      enhanceTutorialExamples: context.enhanceTutorialExamples,
      refreshTutorialCodePresentation: context.refreshTutorialCodePresentation,
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute,
      renderEntityIcon: context.renderEntityIcon,
      renderTutorialInfoGrid: context.renderTutorialInfoGrid,
      renderDocCodeContainer: context.renderDocCodeContainer,
      renderCanonicalReferenceRichText: context.renderCanonicalReferenceRichText,
      buildCanonicalReferenceExample: context.buildCanonicalReferenceExample,
      getCanonicalReferenceKindMeta: context.getCanonicalReferenceKindMeta,
      resolveCanonicalReferenceRoute: context.resolveCanonicalReferenceRoute
    });

    global.__ARABIC_VULKAN_INDEX_PAGES__?.configure?.({
      getVulkanData: () => context.getVulkanData(),
      getVulkanFileSections: () => context.getVulkanFileSections(),
      getFileReferenceData: () => context.getFileReferenceData(),
      getTutorialCatalog: () => context.getTutorialCatalog(),
      getVariableTypeCollections: context.getVariableTypeCollections,
      getAllConstantReferenceEntries: context.getAllConstantReferenceEntries,
      getCommandSummaryText: context.getCommandSummaryText,
      ensureConstantsListPopulated: context.ensureConstantsListPopulated,
      ensureUiSegment: context.ensureUiSegment,
      populateTutorialsList: context.populateTutorialsList,
      populateFilesList: context.populateFilesList,
      syncRouteHistory: context.syncRouteHistory,
      scrollMainContentToTop: context.scrollMainContentToTop,
      setActiveSidebarItemBySelector: context.setActiveSidebarItemBySelector,
      renderEntityIcon: context.renderEntityIcon,
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute
    });

    global.__ARABIC_VULKAN_VALUE_PAGES__?.configure?.({
      ensureDataSegment: context.ensureDataSegment,
      findItemInCategoriesWithMeta: context.findItemInCategoriesWithMeta,
      getVulkanData: () => context.getVulkanData(),
      findConstantItemByName: context.findConstantItemByName,
      findMacroItemByName: context.findMacroItemByName,
      renderEntityIcon: context.renderEntityIcon,
      renderVulkanHighlightedCodeBlock: context.renderVulkanHighlightedCodeBlock,
      linkUsageBridgeText: context.linkUsageBridgeText,
      inferReferenceProfile: context.inferReferenceProfile,
      renderReferenceConceptSection: context.renderReferenceConceptSection,
      renderExecutionProfileSection: context.renderExecutionProfileSection,
      renderSystemContextSection: context.renderSystemContextSection,
      renderValueMeaningSection: context.renderValueMeaningSection,
      renderPracticalReferenceSection: context.renderPracticalReferenceSection,
      renderUsageSection: context.renderUsageSection,
      renderEntityRelatedConstantsSection: context.renderEntityRelatedConstantsSection,
      renderLinkedVulkanExampleSection: context.renderLinkedVulkanExampleSection,
      formatExampleWithLinks: context.formatExampleWithLinks,
      renderGenericExampleExplanation: context.renderGenericExampleExplanation,
      renderLinkedNotesSection: context.renderLinkedNotesSection,
      renderOfficialDocsFooter: context.renderOfficialDocsFooter,
      inferMacroPracticalMeaning: context.inferMacroPracticalMeaning,
      renderMacroPreprocessorSection: context.renderMacroPreprocessorSection,
      highlightCode: context.highlightCode,
      syncSidebarWithHash: context.syncSidebarWithHash,
      focusPageMeaningAnchor: context.focusPageMeaningAnchor,
      syncRouteHistory: context.syncRouteHistory,
      scrollMainContentToTop: context.scrollMainContentToTop,
      escapeAttribute: context.escapeAttribute
    });

    global.__ARABIC_VULKAN_REFERENCE_PAGES__?.configure?.({
      getVulkanData: () => context.getVulkanData(),
      ensureDataSegment: context.ensureDataSegment,
      findCommandItemByName: context.findCommandItemByName,
      getTypeNavigation: context.getTypeNavigation,
      findMacroItemByName: context.findMacroItemByName,
      findConstantItemByName: context.findConstantItemByName,
      getUsageItems: context.getUsageItems,
      isReadableLocalizedParagraph: context.isReadableLocalizedParagraph,
      isMarginalUsageText: context.isMarginalUsageText,
      inferFunctionIntentSummary: context.inferFunctionIntentSummary,
      getDisplayedExample: context.getDisplayedExample,
      renderEntityIcon: context.renderEntityIcon,
      renderVulkanHighlightedCodeBlock: context.renderVulkanHighlightedCodeBlock,
      renderFunctionMeaningSection: context.renderFunctionMeaningSection,
      renderExecutionProfileSection: context.renderExecutionProfileSection,
      renderFunctionLearningGuide: context.renderFunctionLearningGuide,
      linkUsageBridgeText: context.linkUsageBridgeText,
      sanitizeFunctionOfficialDescription: context.sanitizeFunctionOfficialDescription,
      renderExternalReference: context.renderExternalReference,
      renderTypeReference: context.renderTypeReference,
      renderUsageSection: context.renderUsageSection,
      renderEntityRelatedConstantsSection: context.renderEntityRelatedConstantsSection,
      renderLinkedVulkanExampleSection: context.renderLinkedVulkanExampleSection,
      renderFunctionParameterName: context.renderFunctionParameterName,
      renderFunctionParameterDescription: context.renderFunctionParameterDescription,
      getReturnValuesArray: context.getReturnValuesArray,
      renderSystemContextSection: context.renderSystemContextSection,
      hasRealExample: context.hasRealExample,
      formatExampleWithLinks: context.formatExampleWithLinks,
      renderFunctionExplanation: context.renderFunctionExplanation,
      renderLinkedNotesSection: context.renderLinkedNotesSection,
      renderOfficialDocsFooter: context.renderOfficialDocsFooter,
      scrollMainContentToTop: context.scrollMainContentToTop,
      highlightCode: context.highlightCode,
      syncSidebarWithHash: context.syncSidebarWithHash,
      syncRouteHistory: context.syncRouteHistory,
      escapeAttribute: context.escapeAttribute,
      renderRelatedReferenceLink: context.renderRelatedReferenceLink,
      findItemInCategoriesWithMeta: context.findItemInCategoriesWithMeta,
      findTypeItemByName: context.findTypeItemByName,
      findFunctionsUsingStructure: context.findFunctionsUsingStructure,
      getStructureLeadDescription: context.getStructureLeadDescription,
      inferStructureRole: context.inferStructureRole,
      trimLeadingTypeName: context.trimLeadingTypeName,
      isVariableStructureItem: context.isVariableStructureItem,
      renderStructureIntentSection: context.renderStructureIntentSection,
      renderPracticalReferenceSection: context.renderPracticalReferenceSection,
      renderDeferredStructureSectionShell: context.renderDeferredStructureSectionShell,
      renderGenericExampleExplanation: context.renderGenericExampleExplanation,
      initDeferredStructureSections: context.initDeferredStructureSections,
      findItemInCategories: context.findItemInCategories,
      dedupeNotes: context.dedupeNotes,
      simplifyEnumOfficialDescription: context.simplifyEnumOfficialDescription,
      renderEnumMeaningSection: context.renderEnumMeaningSection,
      renderEnumValueTagsSection: context.renderEnumValueTagsSection,
      getEnumValueRows: context.getEnumValueRows,
      getEnumValueMetadata: context.getEnumValueMetadata,
      buildEnumValueMeaningFallback: context.buildEnumValueMeaningFallback,
      buildEnumValueUsageFallback: context.buildEnumValueUsageFallback,
      buildEnumValueBenefitFallback: context.buildEnumValueBenefitFallback,
      getEnumValueAnchorId: context.getEnumValueAnchorId,
      renderProjectReferenceChip: context.renderProjectReferenceChip,
      escapeHtml: context.escapeHtml,
      renderEnumCoreRelationsSection: context.renderEnumCoreRelationsSection
    });

    global.__ARABIC_VULKAN_TUTORIAL_SUPPORT__?.configure?.({
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute,
      splitCodeIntoLineChunks: context.splitCodeIntoLineChunks,
      getCodeBlockLanguage: context.getCodeBlockLanguage,
      highlightSingleCodeBlock: context.highlightSingleCodeBlock,
      renderGenericExampleExplanation: context.renderGenericExampleExplanation
    });

    global.__ARABIC_VULKAN_FILE_SOURCE_VIEWER__?.configure?.({
      getFileReferenceData: () => context.getFileReferenceData(),
      splitCodeIntoLineChunks: context.splitCodeIntoLineChunks,
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute,
      highlightCode: context.highlightCode
    });

    global.__ARABIC_VULKAN_IMGUI_SECTION__?.configure?.({
      getImguiReferenceSections: () => context.getImguiReferenceSections(),
      getImguiMeta: () => context.getImguiMeta(),
      getImguiFallbackMeta: () => context.getImguiFallbackMeta(),
      isImguiLoaded: context.isImguiLoaded
    });

    global.__ARABIC_VULKAN_SDL3_SECTION__?.configure?.({});

    global.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__?.configure?.({
      ensureUiSegment: context.ensureUiSegment,
      populateTutorialsList: context.populateTutorialsList,
      closeActiveSectionVideoModal: context.closeActiveSectionVideoModal,
      getTutorialContent: () => context.getTutorialContent(),
      renderEntityIcon: context.renderEntityIcon,
      renderTutorialLeadMedia: context.renderTutorialLeadMedia,
      normalizeTutorialLessonSections: context.normalizeTutorialLessonSections,
      prepareTutorialCodeContainers: context.prepareTutorialCodeContainers,
      highlightCode: context.highlightCode,
      activateTutorialLazyCodeBlocks: context.activateTutorialLazyCodeBlocks,
      enhanceTutorialExamples: context.enhanceTutorialExamples,
      refreshTutorialCodePresentation: context.refreshTutorialCodePresentation,
      syncRouteHistory: context.syncRouteHistory,
      scheduleRecentVisitCapture: context.scheduleRecentVisitCapture,
      setActiveSidebarItemBySelector: context.setActiveSidebarItemBySelector,
      escapeSelectorValue: context.escapeSelectorValue,
      populateFilesList: context.populateFilesList,
      getStaticFilePageUrl: context.getStaticFilePageUrl,
      getServedFileRelativePath: context.getServedFileRelativePath,
      getFileReferenceData: () => context.getFileReferenceData(),
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute,
      renderLazyFileSourceSection: context.renderLazyFileSourceSection,
      scrollMainContentToTop: context.scrollMainContentToTop,
      initLazyFileSourceViewers: context.initLazyFileSourceViewers,
      syncSidebarWithHash: context.syncSidebarWithHash,
      getCppReferenceItem: context.getCppReferenceItem,
      getCppReferenceIconType: context.getCppReferenceIconType,
      getCppDeepGuides: () => context.getCppDeepGuides(),
      renderTutorialInfoGrid: context.renderTutorialInfoGrid,
      renderDocCodeContainer: context.renderDocCodeContainer,
      renderPracticalText: context.renderPracticalText,
      renderExternalReference: context.renderExternalReference,
      renderCppReferenceRelatedLinks: context.renderCppReferenceRelatedLinks,
      renderCppReferenceOfficialSection: context.renderCppReferenceOfficialSection,
      renderCppReferenceProjectGuidance: context.renderCppReferenceProjectGuidance
    });

    global.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__?.configure?.({
      getCppReferenceData: () => context.getCppReferenceData(),
      getCppReferenceEnrichmentData: () => context.getCppReferenceEnrichmentData(),
      getCppReferenceOfficialLinks: () => context.getCppReferenceOfficialLinks(),
      getCppReferenceGuides: () => context.getCppReferenceGuides(),
      getCppReferenceTooltipOverrides: () => context.getCppReferenceTooltipOverrides(),
      getCppKeywordTokens: context.getCppKeywordTokens,
      getExternalReferenceUrl: context.getExternalReferenceUrl,
      renderProjectReferenceLink: context.renderProjectReferenceLink,
      renderExternalReference: context.renderExternalReference,
      escapeHtml: context.escapeHtml,
      escapeAttribute: context.escapeAttribute
    });

    global.__ARABIC_VULKAN_SEARCH__?.configure?.({
      getVulkanData: () => context.getVulkanData(),
      getCppReferenceData: () => context.getCppReferenceData(),
      getCppReferenceEnrichmentData: () => context.getCppReferenceEnrichmentData(),
      getCppReferenceOfficialLinks: () => context.getCppReferenceOfficialLinks(),
      getCppReferenceGuides: () => context.getCppReferenceGuides(),
      getCppHomeConfig: () => context.getCppHomeConfig(),
      getTutorialCatalog: () => context.getTutorialCatalog(),
      getVulkanFileSections: () => context.getVulkanFileSections(),
      getFileReferenceData: () => context.getFileReferenceData(),
      getSdl3ArabicWordMap: () => context.getSdl3ArabicWordMap(),
      getSdl3SearchPreview: context.getSdl3SearchPreview,
      getSdl3SearchEntries: () => context.getSdl3SearchEntries(),
      getCmakeSearchEntries: () => context.getCmakeSearchEntries(),
      getFfmpegSearchEntries: () => context.getFfmpegSearchEntries(),
      getCurrentView: () => context.getCurrentView(),
      setCurrentView: context.setCurrentView,
      ensureUiSegment: context.ensureUiSegment,
      ensureAllSdl3PackageData: context.ensureAllSdl3PackageData
    });
  }

  global.__ARABIC_VULKAN_APP_BOOTSTRAP_CONFIG__ = {
    configureBootstrapModules
  };
})(window);
