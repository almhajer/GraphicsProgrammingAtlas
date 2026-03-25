(function (global) {
  function createDefaultSiteUsageGuide() {
    return Object.freeze({
      title: '',
      excerpt: '',
      summaryCards: [],
      sections: []
    });
  }

  function createDefaultGlslHomeFallbackMeta() {
    return Object.freeze({
      displayName: '',
      description: '',
      officialUrl: '',
      sections: []
    });
  }

  function createDefaultImguiHomeFallbackMeta() {
    return Object.freeze({
      displayName: '',
      description: '',
      officialUrl: '',
      sourceUrl: '',
      sections: []
    });
  }

  function normalizeAppTextData(data = {}) {
    return Object.freeze({
      SITE_USAGE_GUIDE: Object.freeze(data.SITE_USAGE_GUIDE || createDefaultSiteUsageGuide()),
      cppReferenceData: Object.freeze(data.cppReferenceData || {}),
      glfwReferenceData: Object.freeze(data.glfwReferenceData || {}),
      GLSL_HOME_FALLBACK_META: Object.freeze(data.GLSL_HOME_FALLBACK_META || createDefaultGlslHomeFallbackMeta()),
      IMGUI_HOME_FALLBACK_META: Object.freeze(data.IMGUI_HOME_FALLBACK_META || createDefaultImguiHomeFallbackMeta()),
      SDL3_SEARCH_SUBFILTERS: Object.freeze(data.SDL3_SEARCH_SUBFILTERS || {}),
      EXAMPLE_PLATFORM_ARABIC_LABELS: Object.freeze(data.EXAMPLE_PLATFORM_ARABIC_LABELS || {}),
      VULKAN_EXAMPLE_DISPLAY_TITLES: Object.freeze(data.VULKAN_EXAMPLE_DISPLAY_TITLES || {}),
      VULKAN_EXAMPLE_DIFFICULTY_BY_ID: Object.freeze(data.VULKAN_EXAMPLE_DIFFICULTY_BY_ID || {}),
      VULKAN_EXAMPLE_ORDER: Object.freeze(data.VULKAN_EXAMPLE_ORDER || []),
      VULKAN_EXAMPLE_GROUPS: Object.freeze(data.VULKAN_EXAMPLE_GROUPS || []),
      VULKAN_EXAMPLE_GROUP_BY_ID: Object.freeze(data.VULKAN_EXAMPLE_GROUP_BY_ID || {}),
      SDL3_EXAMPLE_GROUP_META: Object.freeze(data.SDL3_EXAMPLE_GROUP_META || {})
    });
  }

  function createAppTextLoader(options = {}) {
    const fetchJsonData = typeof options.fetchJsonData === 'function'
      ? options.fetchJsonData
      : async () => ({});
    const sourcePath = String(options.sourcePath || '');
    const getEmbeddedData = typeof options.getEmbeddedData === 'function'
      ? options.getEmbeddedData
      : () => null;

    let loaded = false;
    let promise = null;
    let state = normalizeAppTextData();

    function applyData(data = {}) {
      state = normalizeAppTextData(data);
      loaded = true;
      return state;
    }

    async function ensureLoaded() {
      if (loaded) {
        return state;
      }

      const embeddedData = getEmbeddedData();
      if (embeddedData) {
        return applyData(embeddedData);
      }

      if (!promise) {
        promise = fetchJsonData(sourcePath)
          .then((data) => applyData(data))
          .finally(() => {
            promise = null;
          });
      }

      await promise;
      return state;
    }

    function getValue(key) {
      return state?.[key];
    }

    function getState() {
      return state;
    }

    return {
      ensureLoaded,
      applyData,
      getValue,
      getState
    };
  }

  global.__ARABIC_VULKAN_APP_TEXT_LOADER__ = {
    createAppTextLoader,
    normalizeAppTextData
  };
})(window);
