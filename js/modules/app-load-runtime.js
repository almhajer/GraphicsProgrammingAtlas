(function(global) {
  'use strict';

  function buildFallbackVulkanData() {
    return {
      commands: {
        fallback: {
          title: 'مرجع أساسي',
          items: [
            {
              name: 'vkCreateInstance',
              category: 'instance',
              description: 'إنشاء مثيل Vulkan كبداية لأي تطبيق.',
              signature: 'VkResult vkCreateInstance(...);',
              returnType: 'VkResult',
              usage: ['ابدأ بها لإنشاء VkInstance قبل التعامل مع بقية الموارد.']
            },
            {
              name: 'vkCreateDevice',
              category: 'device',
              description: 'إنشاء الجهاز المنطقي والطوابير المرتبطة به.',
              signature: 'VkResult vkCreateDevice(...);',
              returnType: 'VkResult',
              usage: ['تأتي بعد اختيار الجهاز الفيزيائي والطوابير المطلوبة.']
            },
            {
              name: 'vkCmdDraw',
              category: 'drawing',
              description: 'تسجيل أمر رسم بدائيات غير مفهرسة داخل مخزن الأوامر.',
              signature: 'void vkCmdDraw(...);',
              returnType: 'void'
            },
            {
              name: 'vkQueuePresentKHR',
              category: 'swapchain',
              description: 'تقديم الصورة الحالية إلى محرك العرض.',
              signature: 'VkResult vkQueuePresentKHR(...);',
              returnType: 'VkResult'
            }
          ]
        }
      },
      structures: {
        structures: {
          title: 'الهياكل الأساسية',
          items: [
            {name: 'VkApplicationInfo', type: 'struct', description: 'بنية تعريف التطبيق والإصدار المستهدف.'},
            {name: 'VkInstanceCreateInfo', type: 'struct', description: 'بنية إعداد إنشاء المثيل.'},
            {name: 'VkDeviceCreateInfo', type: 'struct', description: 'بنية إعداد إنشاء الجهاز المنطقي.'}
          ]
        },
        scalar_types: {
          title: 'الأنواع الأساسية',
          items: [
            {name: 'VkBool32', type: 'scalar', description: 'قيمة منطقية بصيغة Vulkan.'},
            {name: 'VkDeviceSize', type: 'scalar', description: 'حجم أو إزاحة بالبايت داخل موارد Vulkan.'}
          ]
        }
      },
      enums: {
        core: {
          title: 'التعدادات الأساسية',
          items: [
            {name: 'VkResult', type: 'enum', description: 'قيم نجاح وفشل وحالات خاصة للدوال.'},
            {name: 'VkFormat', type: 'enum', description: 'تعداد صيغ البيانات والصور.'},
            {name: 'VkImageLayout', type: 'enum', description: 'تعداد أوضاع استخدام الصورة داخل GPU.'}
          ]
        }
      },
      constants: {
        core: {
          title: 'الثوابت الأساسية',
          items: [
            {name: 'VK_NULL_HANDLE', value: '0', description: 'مقبض Vulkan فارغ.'},
            {name: 'VK_TRUE', value: '1', description: 'قيمة منطقية صحيحة بصيغة Vulkan.'},
            {name: 'VK_FALSE', value: '0', description: 'قيمة منطقية خاطئة بصيغة Vulkan.'}
          ]
        }
      },
      macros: {
        core: {
          title: 'ماكرو أساسية',
          items: [
            {name: 'VK_MAKE_API_VERSION', description: 'تكوين رقم إصدار API من مكوناته.', syntax: 'VK_MAKE_API_VERSION(...)'}
          ]
        }
      }
    };
  }

  function createAppLoadRuntime(options = {}) {
    const uiSegmentSources = options.uiSegmentSources || {};
    const dataSegmentSources = options.dataSegmentSources || {};
    const getVulkanData = typeof options.getVulkanData === 'function'
      ? options.getVulkanData
      : () => ({});
    const replaceVulkanData = typeof options.replaceVulkanData === 'function'
      ? options.replaceVulkanData
      : () => {};
    const setVulkanMeta = typeof options.setVulkanMeta === 'function'
      ? options.setVulkanMeta
      : () => {};
    const getTutorialCatalog = typeof options.getTutorialCatalog === 'function'
      ? options.getTutorialCatalog
      : () => [];
    const getGroupedVulkanReadyExamples = typeof options.getGroupedVulkanReadyExamples === 'function'
      ? options.getGroupedVulkanReadyExamples
      : () => [];
    const getVariableTypeCollections = typeof options.getVariableTypeCollections === 'function'
      ? options.getVariableTypeCollections
      : () => ({});
    const getAllConstantReferenceEntries = typeof options.getAllConstantReferenceEntries === 'function'
      ? options.getAllConstantReferenceEntries
      : () => [];
    const getFileReferenceData = typeof options.getFileReferenceData === 'function'
      ? options.getFileReferenceData
      : () => ({});
    const fetchJsonData = typeof options.fetchJsonData === 'function'
      ? options.fetchJsonData
      : async () => ({});
    const applyLoadedData = typeof options.applyLoadedData === 'function'
      ? options.applyLoadedData
      : () => {};
    const markDataSegmentLoaded = typeof options.markDataSegmentLoaded === 'function'
      ? options.markDataSegmentLoaded
      : () => {};
    const markCurrentDataChunksLoaded = typeof options.markCurrentDataChunksLoaded === 'function'
      ? options.markCurrentDataChunksLoaded
      : () => {};
    const populateSidebar = typeof options.populateSidebar === 'function'
      ? options.populateSidebar
      : () => {};
    const showHomePage = typeof options.showHomePage === 'function'
      ? options.showHomePage
      : () => {};
    const ensureSearchIndex = typeof options.ensureSearchIndex === 'function'
      ? options.ensureSearchIndex
      : () => {};
    const log = typeof options.log === 'function'
      ? options.log
      : (...args) => global.console?.log?.(...args);
    const warn = typeof options.warn === 'function'
      ? options.warn
      : (...args) => global.console?.warn?.(...args);
    const error = typeof options.error === 'function'
      ? options.error
      : (...args) => global.console?.error?.(...args);

    function scheduleIdleWarmup(task, fallbackDelay = 180) {
      if (typeof task !== 'function') {
        return;
      }

      if (typeof global.requestIdleCallback === 'function') {
        global.requestIdleCallback(() => {
          try {
            task();
          } catch (runtimeError) {
            warn('تعذر تنفيذ warmup مؤجل:', runtimeError);
          }
        }, {timeout: 1500});
        return;
      }

      global.setTimeout(() => {
        try {
          task();
        } catch (runtimeError) {
          warn('تعذر تنفيذ warmup مؤجل:', runtimeError);
        }
      }, fallbackDelay);
    }

    function warmupSidebarDataInBackground() {
      // تبقى أقسام GLSL والدروس والملفات محملة عند الطلب فقط لتقليل الحمل الأولي.
    }

    function warmupSearchIndex() {
      scheduleIdleWarmup(() => {
        try {
          ensureSearchIndex();
        } catch (runtimeError) {
          warn('تعذر بناء فهرس البحث المسبق:', runtimeError);
        }
      }, 260);
    }

    function setSidebarClusterCount(clusterId = '', count = 0) {
      const badge = global.document?.getElementById?.(`${clusterId}-count`);
      if (!badge) {
        return;
      }

      const normalizedCount = Math.max(0, Number(count) || 0);
      badge.textContent = String(normalizedCount);
      badge.setAttribute('aria-label', `عدد العناصر: ${normalizedCount}`);
      badge.title = `عدد العناصر: ${normalizedCount}`;
    }

    function setSidebarSectionCount(sectionId = '', count = 0) {
      const badge = global.document?.getElementById?.(sectionId);
      if (!badge) {
        return;
      }

      const normalizedCount = Math.max(0, Number(count) || 0);
      badge.textContent = String(normalizedCount);
      badge.setAttribute('aria-label', `عدد العناصر: ${normalizedCount}`);
      badge.title = `عدد العناصر: ${normalizedCount}`;
    }

    function getGroupedExampleTotal() {
      return getGroupedVulkanReadyExamples().reduce((total, group) => total + (group.examples?.length || 0), 0);
    }

    function computeVulkanSidebarClusterCount() {
      const uniqueNames = new Set();
      const addItems = (collection = {}) => {
        Object.values(collection).forEach((category) => {
          (category?.items || []).forEach((item) => {
            const name = String(item?.name || '').trim();
            if (name) {
              uniqueNames.add(name);
            }
          });
        });
      };

      const vulkanData = getVulkanData();
      addItems(vulkanData.commands);
      addItems(vulkanData.macros);
      addItems(vulkanData.constants);
      addItems(vulkanData.enums);
      addItems(vulkanData.structures);

      return uniqueNames.size + getTutorialCatalog().length + getGroupedExampleTotal();
    }

    function updateVulkanSidebarSectionCounts(options = {}) {
      const tutorialCatalog = getTutorialCatalog();
      const tutorialCount = Number(options.tutorialCount) || tutorialCatalog.length;
      const fileCount = Number(options.fileCount) || Object.values(getFileReferenceData() || {}).length;
      const exampleCount = Number(options.exampleCount) || getGroupedExampleTotal();
      const vulkanData = getVulkanData();
      const functionCount = Object.values(vulkanData.commands || {}).reduce((total, category) => total + ((category?.items || []).length), 0);
      const macroCount = Object.values(vulkanData.macros || {}).reduce((total, category) => total + ((category?.items || []).length), 0);
      const enumCount = Object.values(vulkanData.enums || {}).reduce((total, category) => total + ((category?.items || []).length), 0);
      const structureCount = Object.values(vulkanData.structures || {}).reduce((total, category) => total + ((category?.items || []).length), 0);
      const variableCount = Object.values(getVariableTypeCollections()).reduce((total, category) => total + ((category?.items || []).length), 0);
      const constantCount = getAllConstantReferenceEntries().length;

      setSidebarSectionCount('vulkan-functions-count', functionCount);
      setSidebarSectionCount('vulkan-macros-count', macroCount);
      setSidebarSectionCount('vulkan-constants-count', constantCount);
      setSidebarSectionCount('vulkan-structures-count', structureCount);
      setSidebarSectionCount('vulkan-enums-count', enumCount);
      setSidebarSectionCount('vulkan-variables-count', variableCount);
      setSidebarSectionCount('vulkan-tutorials-count', tutorialCount);
      setSidebarSectionCount('vulkan-files-count', fileCount);
      setSidebarSectionCount('vulkan-examples-count', exampleCount);
    }

    async function warmupSidebarClusterCounts() {
      setSidebarClusterCount('vulkan-cluster', computeVulkanSidebarClusterCount());
      updateVulkanSidebarSectionCounts();

      try {
        const [cmakeManifest, glslManifest, imguiManifest, gameUiManifest, sdl3Meta, tutorialManifest, fileManifest] = await Promise.all([
          fetchJsonData(uiSegmentSources.cmakeSearch.path),
          fetchJsonData(uiSegmentSources.glsl.path),
          fetchJsonData(uiSegmentSources.imgui.path),
          fetchJsonData(uiSegmentSources.gameui.path),
          fetchJsonData(uiSegmentSources.sdl3.path),
          fetchJsonData(uiSegmentSources.tutorials.path),
          fetchJsonData(uiSegmentSources.files.path)
        ]);

        const tutorialCatalog = getTutorialCatalog();
        const tutorialTotal = Array.isArray(tutorialManifest?.tutorialCatalog) ? tutorialManifest.tutorialCatalog.length : tutorialCatalog.length;
        const fileTotal = Object.values(fileManifest?.vulkanFileSections || {}).reduce((total, section) => total + ((section?.files || []).length), 0);
        const exampleTotal = getGroupedExampleTotal();
        const vulkanTotal = computeVulkanSidebarClusterCount() - tutorialCatalog.length + tutorialTotal + fileTotal;
        setSidebarClusterCount('vulkan-cluster', vulkanTotal);
        updateVulkanSidebarSectionCounts({
          tutorialCount: tutorialTotal,
          fileCount: fileTotal,
          exampleCount: exampleTotal
        });

        const cmakeTotal = (cmakeManifest?.meta?.sections || []).reduce((total, section) => total + (Number(section.count) || 0), 0);
        setSidebarClusterCount('cmake-cluster', cmakeTotal);

        const glslReferenceSections = Array.isArray(glslManifest?.reference?.sections) ? glslManifest.reference.sections : [];
        const glslReferencePayloads = await Promise.all(glslReferenceSections.map((section) => fetchJsonData(section.path)));
        const glslReferenceTotal = glslReferencePayloads.reduce((total, payload) => total + ((payload?.items || []).length), 0);
        const glslExamplesTotal = Number(glslManifest?.examples?.count) || 0;
        setSidebarClusterCount('glsl-cluster', glslReferenceTotal + glslExamplesTotal);

        const imguiTotal = (imguiManifest?.sections || []).reduce((total, section) => total + (Number(section.count) || 0), 0);
        setSidebarClusterCount('imgui-cluster', imguiTotal);

        const gameUiTotal = (gameUiManifest?.sections || []).reduce((total, section) => total + (Number(section.itemCount) || 0), 0);
        setSidebarClusterCount('game-ui-cluster', gameUiTotal);

        const sdl3Counts = sdl3Meta?.sdl3PackageMeta || {};
        const sumSdl3PackageCounts = (packageKey = '') => Object.values(sdl3Counts?.[packageKey]?.counts || {}).reduce((total, value) => total + (Number(value) || 0), 0);
        setSidebarClusterCount('sdl3-core-cluster', sumSdl3PackageCounts('core'));
        setSidebarClusterCount('sdl3-image-cluster', sumSdl3PackageCounts('image'));
        setSidebarClusterCount('sdl3-mixer-cluster', sumSdl3PackageCounts('mixer'));
        setSidebarClusterCount('sdl3-ttf-cluster', sumSdl3PackageCounts('ttf'));
      } catch (runtimeError) {
        warn('تعذر تهيئة بعض عدادات القائمة الرئيسية:', runtimeError);
      }
    }

    function finalizeInitialLoad() {
      populateSidebar();
      showHomePage({skipHistory: true});
      warmupSidebarDataInBackground();
      scheduleIdleWarmup(() => {
        void warmupSidebarClusterCounts();
      }, 420);
      warmupSearchIndex();
    }

    function loadFallbackData() {
      replaceVulkanData(buildFallbackVulkanData());
      setVulkanMeta({});
      populateSidebar();
      showHomePage({skipHistory: true});
    }

    async function loadData() {
      try {
        if (global.__ARABIC_VULKAN_CORE__) {
          applyLoadedData(global.__ARABIC_VULKAN_CORE__, {replace: true});
          markDataSegmentLoaded('core');
          log('تم تحميل بيانات core المضمّنة بنجاح');
          finalizeInitialLoad();
          return;
        }

        const data = await fetchJsonData(dataSegmentSources.core);
        applyLoadedData(data, {replace: true});
        markDataSegmentLoaded('core');

        log('تم تحميل بيانات core بنجاح');
        finalizeInitialLoad();
      } catch (coreError) {
        error('خطأ في تحميل بيانات core:', coreError);

        try {
          const legacyData = await fetchJsonData('data/vulkan_site_data.json');
          applyLoadedData(legacyData, {replace: true});
          markDataSegmentLoaded('core');
          markCurrentDataChunksLoaded();

          log('تم تحميل البيانات الكاملة الاحتياطية بنجاح');
          finalizeInitialLoad();
        } catch (legacyError) {
          error('خطأ في تحميل البيانات الاحتياطية:', legacyError);
          loadFallbackData();
        }
      }
    }

    return {
      warmupSidebarDataInBackground,
      warmupSearchIndex,
      setSidebarClusterCount,
      setSidebarSectionCount,
      computeVulkanSidebarClusterCount,
      updateVulkanSidebarSectionCounts,
      warmupSidebarClusterCounts,
      loadFallbackData,
      loadData
    };
  }

  global.createAppLoadRuntime = createAppLoadRuntime;
  global.__ARABIC_VULKAN_APP_LOAD_RUNTIME__ = {
    createAppLoadRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
