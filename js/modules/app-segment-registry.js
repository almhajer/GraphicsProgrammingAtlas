(function (global) {
  const DATA_SEGMENT_SOURCES = Object.freeze({
    core: 'data/split/core.json',
    functions: 'data/split/functions',
    structures: 'data/split/structures',
    enums: 'data/split/enums',
    constants: 'data/split/constants',
    macros: 'data/split/macros'
  });

  const UI_SEGMENT_SOURCES = Object.freeze({
    homePageRuntime: {path: 'js/modules/home-page.js', format: 'script'},
    referenceTemplatesRuntime: {path: 'js/modules/reference-templates.js', format: 'script'},
    referenceRuntimePage: {path: 'js/modules/reference-runtime.js', format: 'script'},
    indexPagesRuntime: {path: 'js/modules/index-pages.js', format: 'script'},
    vulkanValuePagesRuntime: {path: 'js/modules/vulkan-value-pages.js', format: 'script'},
    vulkanReferencePagesRuntime: {path: 'js/modules/vulkan-reference-pages.js', format: 'script'},
    generalDetailPagesRuntime: {path: 'js/modules/general-detail-pages.js', format: 'script'},
    cppReferenceUtilsRuntime: {path: 'js/modules/cpp-reference-utils.js', format: 'script'},
    tutorialSupportRuntime: {path: 'js/modules/tutorial-support.js?v=0.0.1', format: 'script'},
    fileSourceViewerRuntime: {path: 'js/modules/file-source-viewer.js', format: 'script'},
    heavyHelper4Runtime: {path: 'js/modules/app-heavy-reference-helpers-4-runtime.js?v=20260326phase577a', format: 'script'},
    tutorials: {path: 'data/ui/tutorials/index.json', format: 'json', countHint: 22},
    glsl: {path: 'data/ui/glsl/index.json', format: 'json'},
    files: {path: 'data/ui/files.json', format: 'json', countHint: 48},
    sdl3: {path: 'data/ui/sdl3/meta.json', format: 'json'},
    sdl3CoreFunctionRelations: {path: 'data/ui/sdl3/core-function-relations.json', format: 'json'},
    sdl3CoreSymbolIndex: {path: 'data/ui/sdl3/core-symbol-index.json', format: 'json'},
    sdl3Search: {path: 'data/ui/sdl3-search.json', format: 'json'},
    ffmpegSearch: {path: 'data/ui/ffmpeg/search.json', format: 'json'},
    sdl3Lexicon: {path: 'data/ui/sdl3-lexicon.json', format: 'json'},
    sdl3Tooltip: {path: 'data/ui/sdl3-tooltip-overrides.json', format: 'json'},
    sdl3ExampleGuides: {path: 'data/ui/sdl3-example-guides.json', format: 'json'},
    cmakeSearch: {path: 'data/ui/cmake-search.json', format: 'json'},
    vulkanExampleGuides: {path: 'data/ui/vulkan-example-guides.json', format: 'json'},
    vulkanParameterOverrides: {path: 'data/ui/vulkan-parameter-overrides.json', format: 'json'},
    imguiExampleGuides: {path: 'data/ui/imgui-example-guides.json', format: 'json'},
    imguiParameterOverrides: {path: 'data/ui/imgui-parameter-overrides.json', format: 'json'},
    glslExampleGuides: {path: 'data/ui/glsl-example-guides.json', format: 'json'},
    glslExampleTooltips: {path: 'data/ui/glsl-example-tooltip-overrides.json', format: 'json'},
    cppReferenceData: {path: 'data/ui/cpp/reference-index.json', format: 'json'},
    cppReferenceEnrichment: {path: 'data/ui/cpp/reference-enrichment-index.json', format: 'json'},
    cppReferenceOfficialLinks: {path: 'data/ui/cpp/reference-official-links.json', format: 'json'},
    cppReferenceGuides: {path: 'data/ui/cpp/reference-guides-index.json', format: 'json'},
    cppReferenceTooltips: {path: 'data/ui/cpp/reference-tooltip-overrides.json', format: 'json'},
    cppHome: {path: 'data/ui/cpp/home.json', format: 'json'},
    imgui: {path: 'data/ui/imgui/index.json', format: 'json', countHint: 75},
    gameui: {path: 'data/ui/game-ui/index.json', format: 'json', countHint: 34},
    vulkanSearch: {path: 'data/ui/vulkan-search-tables.json', format: 'json'}
  });

  const SDL3_ENTITY_BASE_DATA_KEYS = Object.freeze(['functions', 'types', 'enums', 'constants', 'macros']);

  const SDL3_PACKAGE_SEGMENT_SOURCES = Object.freeze({
    core: 'data/ui/sdl3/core.json',
    audio: 'data/ui/sdl3/audio.json',
    image: 'data/ui/sdl3/image.json',
    mixer: 'data/ui/sdl3/mixer.json',
    ttf: 'data/ui/sdl3/ttf.json'
  });

  const SDL3_PACKAGE_KIND_SEGMENT_SOURCES = Object.freeze({
    core: Object.freeze({
      functions: 'data/ui/sdl3/core-functions.json',
      types: 'data/ui/sdl3/core-types.json',
      enums: 'data/ui/sdl3/core-enums.json',
      constants: 'data/ui/sdl3/core-constants.json',
      macros: 'data/ui/sdl3/core-macros.json'
    })
  });

  function createDataSegmentLoadedState() {
    return {
      core: false,
      functions: {},
      structures: {},
      enums: {},
      constants: {},
      macros: {}
    };
  }

  function createDataSegmentPromiseState() {
    return {
      functions: {},
      structures: {},
      enums: {},
      constants: {},
      macros: {}
    };
  }

  function createUiSegmentLoadedState() {
    return Object.keys(UI_SEGMENT_SOURCES).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
  }

  function createUiSegmentPromiseState() {
    return {};
  }

  function createSdl3PackageSegmentLoadedState() {
    return {
      core: false,
      audio: false,
      image: false,
      mixer: false,
      ttf: false
    };
  }

  function createSdl3PackageKindLoadedState() {
    return {};
  }

  function createSdl3PackagePromiseState() {
    return {};
  }

  function getSdl3EntityBaseDataKey(dataKey = '') {
    if (dataKey === 'structures' || dataKey === 'variables') {
      return 'types';
    }
    return SDL3_ENTITY_BASE_DATA_KEYS.includes(dataKey) ? dataKey : 'functions';
  }

  function getAvailableSegmentChunkKeys(vulkanMeta = {}, vulkanData = {}, segment = '') {
    const metaKeys = Array.isArray(vulkanMeta?.detailBuckets?.[segment]) ? vulkanMeta.detailBuckets[segment] : null;
    if (metaKeys && metaKeys.length > 0) {
      return metaKeys;
    }

    const collectionKeyBySegment = {
      functions: 'commands',
      structures: 'structures',
      enums: 'enums',
      constants: 'constants',
      macros: 'macros'
    };

    const collectionKey = collectionKeyBySegment[segment];
    if (!collectionKey) {
      return [];
    }

    return Array.from(new Set(
      Object.values(vulkanData?.[collectionKey] || {}).flatMap((category) =>
        (category.items || []).map((item) => item.detailBucket).filter(Boolean)
      )
    )).sort();
  }

  function getDataSegmentChunkSource(segmentSources = DATA_SEGMENT_SOURCES, segment = '', chunkKey = '') {
    if (segment === 'core') {
      return segmentSources.core;
    }
    const basePath = segmentSources[segment];
    if (!basePath || !chunkKey) {
      return '';
    }
    return `${basePath}/${chunkKey}.json`;
  }

  function isDataSegmentLoaded(loadedState = {}, vulkanMeta = {}, vulkanData = {}, segment = '', chunkKey = '') {
    if (segment === 'core') {
      return !!loadedState.core;
    }
    if (!loadedState[segment]) {
      return false;
    }
    if (chunkKey) {
      return !!loadedState[segment][chunkKey];
    }
    const chunkKeys = getAvailableSegmentChunkKeys(vulkanMeta, vulkanData, segment);
    return chunkKeys.length > 0 && chunkKeys.every((key) => loadedState[segment][key]);
  }

  function markDataSegmentLoaded(loadedState = {}, segment = '', chunkKey = '') {
    if (segment === 'core') {
      loadedState.core = true;
      return;
    }
    if (!loadedState[segment] || !chunkKey) {
      return;
    }
    loadedState[segment][chunkKey] = true;
  }

  global.__ARABIC_VULKAN_APP_SEGMENT_REGISTRY__ = {
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
    getAvailableSegmentChunkKeys,
    getDataSegmentChunkSource,
    isDataSegmentLoaded,
    markDataSegmentLoaded
  };
})(window);
