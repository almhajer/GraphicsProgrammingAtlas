(function(global) {
  'use strict';

  function createHomeShellRuntime(api = {}) {
    const {
      buildCmakeHomeLibraryModel,
      buildCppHomeLibraryModel,
      buildFfmpegHomeLibraryModel,
      buildGlslHomeLibraryModel,
      buildImguiHomeLibraryModel,
      buildSdl3HomeLibraryModel,
      buildVulkanHomeLibraryModel,
      getHomeSdl3PackageKeys,
      getVulkanHomeMetrics
    } = api;

    function buildHomeLibraryModels() {
      return [
        buildCmakeHomeLibraryModel(),
        buildCppHomeLibraryModel(),
        buildFfmpegHomeLibraryModel(),
        buildVulkanHomeLibraryModel(),
        ...getHomeSdl3PackageKeys().map((packageKey) => buildSdl3HomeLibraryModel(packageKey)),
        buildImguiHomeLibraryModel(),
        buildGlslHomeLibraryModel()
      ].filter(Boolean);
    }

    function buildHomeHeroStats(models) {
      const metrics = getVulkanHomeMetrics();
      const totalItems = models.reduce((total, model) => total + (Number(model.totalCount) || 0), 0);
      return [
        {label: 'المكتبات', value: models.length},
        {label: 'العناصر المحلية', value: totalItems},
        {label: 'الدروس والملفات', value: metrics.tutorialCount + metrics.fileCount}
      ];
    }

    return {
      buildHomeLibraryModels,
      buildHomeHeroStats
    };
  }

  global.createHomeShellRuntime = createHomeShellRuntime;
  global.__ARABIC_VULKAN_HOME_SHELL_RUNTIME__ = {
    createHomeShellRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
