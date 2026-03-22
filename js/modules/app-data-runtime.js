(function (global) {
  'use strict';

  function createAppDataRuntime(options = {}) {
    const appAssetVersion = String(options.appAssetVersion || '');
    const dataSegmentSources = options.dataSegmentSources || {};
    const dataSegmentLoaded = options.dataSegmentLoaded || {};
    const dataSegmentPromises = options.dataSegmentPromises || {};
    const uiSegmentSources = options.uiSegmentSources || {};
    const uiSegmentLoaded = options.uiSegmentLoaded || {};
    const uiSegmentPromises = options.uiSegmentPromises || {};
    const getAvailableSegmentChunkKeysFromRegistry = typeof options.getAvailableSegmentChunkKeysFromRegistry === 'function'
      ? options.getAvailableSegmentChunkKeysFromRegistry
      : () => [];
    const getDataSegmentChunkSourceFromRegistry = typeof options.getDataSegmentChunkSourceFromRegistry === 'function'
      ? options.getDataSegmentChunkSourceFromRegistry
      : () => '';
    const isDataSegmentLoadedFromRegistry = typeof options.isDataSegmentLoadedFromRegistry === 'function'
      ? options.isDataSegmentLoadedFromRegistry
      : () => false;
    const markDataSegmentLoadedFromRegistry = typeof options.markDataSegmentLoadedFromRegistry === 'function'
      ? options.markDataSegmentLoadedFromRegistry
      : () => {};
    const getVulkanMeta = typeof options.getVulkanMeta === 'function'
      ? options.getVulkanMeta
      : () => ({});
    const setVulkanMeta = typeof options.setVulkanMeta === 'function'
      ? options.setVulkanMeta
      : () => {};
    const getVulkanData = typeof options.getVulkanData === 'function'
      ? options.getVulkanData
      : () => ({});
    const invalidateSearchIndex = typeof options.invalidateSearchIndex === 'function'
      ? options.invalidateSearchIndex
      : () => {};
    const resetClickNavigationDerivedCaches = typeof options.resetClickNavigationDerivedCaches === 'function'
      ? options.resetClickNavigationDerivedCaches
      : () => {};
    const getDynamicSearchSubfilters = typeof options.getDynamicSearchSubfilters === 'function'
      ? options.getDynamicSearchSubfilters
      : () => ({});
    const setSearchDynamicSubfilters = typeof options.setSearchDynamicSubfilters === 'function'
      ? options.setSearchDynamicSubfilters
      : () => {};
    const buildTutorialContentFromLayouts = typeof options.buildTutorialContentFromLayouts === 'function'
      ? options.buildTutorialContentFromLayouts
      : (layouts = {}) => layouts;
    const ensureTutorialUiRuntime = typeof options.ensureTutorialUiRuntime === 'function'
      ? options.ensureTutorialUiRuntime
      : async () => {};
    const mergeSdl3EntityPayload = typeof options.mergeSdl3EntityPayload === 'function'
      ? options.mergeSdl3EntityPayload
      : () => {};
    const applySdl3LexiconData = typeof options.applySdl3LexiconData === 'function'
      ? options.applySdl3LexiconData
      : () => {};
    const applySdl3TooltipOverrideData = typeof options.applySdl3TooltipOverrideData === 'function'
      ? options.applySdl3TooltipOverrideData
      : () => {};
    const applySdl3ExampleGuideData = typeof options.applySdl3ExampleGuideData === 'function'
      ? options.applySdl3ExampleGuideData
      : () => {};
    const applyVulkanExampleGuideData = typeof options.applyVulkanExampleGuideData === 'function'
      ? options.applyVulkanExampleGuideData
      : () => {};
    const applyVulkanParameterOverrideData = typeof options.applyVulkanParameterOverrideData === 'function'
      ? options.applyVulkanParameterOverrideData
      : () => {};
    const applyImguiExampleGuideData = typeof options.applyImguiExampleGuideData === 'function'
      ? options.applyImguiExampleGuideData
      : () => {};
    const applyImguiParameterOverrideData = typeof options.applyImguiParameterOverrideData === 'function'
      ? options.applyImguiParameterOverrideData
      : () => {};
    const applyGlslExampleGuideData = typeof options.applyGlslExampleGuideData === 'function'
      ? options.applyGlslExampleGuideData
      : () => {};
    const applyGlslExampleTooltipOverrideData = typeof options.applyGlslExampleTooltipOverrideData === 'function'
      ? options.applyGlslExampleTooltipOverrideData
      : () => {};
    const applyCppReferenceEnrichmentData = typeof options.applyCppReferenceEnrichmentData === 'function'
      ? options.applyCppReferenceEnrichmentData
      : () => {};
    const applyCppReferenceOfficialLinksData = typeof options.applyCppReferenceOfficialLinksData === 'function'
      ? options.applyCppReferenceOfficialLinksData
      : () => {};
    const applyCppReferenceGuideData = typeof options.applyCppReferenceGuideData === 'function'
      ? options.applyCppReferenceGuideData
      : () => {};
    const applyCppReferenceTooltipOverrideData = typeof options.applyCppReferenceTooltipOverrideData === 'function'
      ? options.applyCppReferenceTooltipOverrideData
      : () => {};
    const applyVulkanSearchTables = typeof options.applyVulkanSearchTables === 'function'
      ? options.applyVulkanSearchTables
      : () => {};
    const buildFileReferenceData = typeof options.buildFileReferenceData === 'function'
      ? options.buildFileReferenceData
      : () => ({});
    const applyImguiStaticData = typeof options.applyImguiStaticData === 'function'
      ? options.applyImguiStaticData
      : () => {};
    const getTutorialCatalog = typeof options.getTutorialCatalog === 'function'
      ? options.getTutorialCatalog
      : () => [];
    const setTutorialCatalog = typeof options.setTutorialCatalog === 'function'
      ? options.setTutorialCatalog
      : () => {};
    const setTutorialVariableHints = typeof options.setTutorialVariableHints === 'function'
      ? options.setTutorialVariableHints
      : () => {};
    const setTutorialConceptReferenceData = typeof options.setTutorialConceptReferenceData === 'function'
      ? options.setTutorialConceptReferenceData
      : () => {};
    const setTutorialContent = typeof options.setTutorialContent === 'function'
      ? options.setTutorialContent
      : () => {};
    const getGlslReferenceSections = typeof options.getGlslReferenceSections === 'function'
      ? options.getGlslReferenceSections
      : () => ({});
    const setGlslReferenceSections = typeof options.setGlslReferenceSections === 'function'
      ? options.setGlslReferenceSections
      : () => {};
    const setGlslReadyExamples = typeof options.setGlslReadyExamples === 'function'
      ? options.setGlslReadyExamples
      : () => {};
    const resetGlslCaches = typeof options.resetGlslCaches === 'function'
      ? options.resetGlslCaches
      : () => {};
    const getImguiReferenceSections = typeof options.getImguiReferenceSections === 'function'
      ? options.getImguiReferenceSections
      : () => ({});
    const setImguiMeta = typeof options.setImguiMeta === 'function'
      ? options.setImguiMeta
      : () => {};
    const setImguiReferenceSections = typeof options.setImguiReferenceSections === 'function'
      ? options.setImguiReferenceSections
      : () => {};
    const resetImguiCaches = typeof options.resetImguiCaches === 'function'
      ? options.resetImguiCaches
      : () => {};
    const getGameUiMeta = typeof options.getGameUiMeta === 'function'
      ? options.getGameUiMeta
      : () => ({});
    const setGameUiMeta = typeof options.setGameUiMeta === 'function'
      ? options.setGameUiMeta
      : () => {};
    const getGameUiSections = typeof options.getGameUiSections === 'function'
      ? options.getGameUiSections
      : () => ({});
    const setGameUiSections = typeof options.setGameUiSections === 'function'
      ? options.setGameUiSections
      : () => {};
    const setGameUiSectionManifest = typeof options.setGameUiSectionManifest === 'function'
      ? options.setGameUiSectionManifest
      : () => {};
    const resetGameUiCaches = typeof options.resetGameUiCaches === 'function'
      ? options.resetGameUiCaches
      : () => {};
    const setVulkanFileSections = typeof options.setVulkanFileSections === 'function'
      ? options.setVulkanFileSections
      : () => {};
    const setFileReferenceOverrides = typeof options.setFileReferenceOverrides === 'function'
      ? options.setFileReferenceOverrides
      : () => {};
    const setFileReferenceData = typeof options.setFileReferenceData === 'function'
      ? options.setFileReferenceData
      : () => {};
    const getSdl3ReferenceSections = typeof options.getSdl3ReferenceSections === 'function'
      ? options.getSdl3ReferenceSections
      : () => ({});
    const setSdl3ReferenceSections = typeof options.setSdl3ReferenceSections === 'function'
      ? options.setSdl3ReferenceSections
      : () => {};
    const getSdl3PackageMeta = typeof options.getSdl3PackageMeta === 'function'
      ? options.getSdl3PackageMeta
      : () => ({});
    const setSdl3PackageMeta = typeof options.setSdl3PackageMeta === 'function'
      ? options.setSdl3PackageMeta
      : () => {};
    const setSdl3CoreFunctionRelations = typeof options.setSdl3CoreFunctionRelations === 'function'
      ? options.setSdl3CoreFunctionRelations
      : () => {};
    const setSdl3CoreSymbolIndex = typeof options.setSdl3CoreSymbolIndex === 'function'
      ? options.setSdl3CoreSymbolIndex
      : () => {};
    const resetSdl3CoreSymbolIndexLookup = typeof options.resetSdl3CoreSymbolIndexLookup === 'function'
      ? options.resetSdl3CoreSymbolIndexLookup
      : () => {};
    const setSdl3SearchEntries = typeof options.setSdl3SearchEntries === 'function'
      ? options.setSdl3SearchEntries
      : () => {};
    const getCmakeSearchMeta = typeof options.getCmakeSearchMeta === 'function'
      ? options.getCmakeSearchMeta
      : () => ({});
    const setCmakeSearchMeta = typeof options.setCmakeSearchMeta === 'function'
      ? options.setCmakeSearchMeta
      : () => {};
    const setCmakeSearchEntries = typeof options.setCmakeSearchEntries === 'function'
      ? options.setCmakeSearchEntries
      : () => {};

    function getAvailableSegmentChunkKeys(segment) {
      return getAvailableSegmentChunkKeysFromRegistry(getVulkanMeta(), getVulkanData(), segment);
    }

    function getDataSegmentChunkSource(segment, chunkKey) {
      return getDataSegmentChunkSourceFromRegistry(dataSegmentSources, segment, chunkKey);
    }

    function isDataSegmentLoaded(segment, chunkKey = '') {
      return isDataSegmentLoadedFromRegistry(dataSegmentLoaded, getVulkanMeta(), getVulkanData(), segment, chunkKey);
    }

    function markDataSegmentLoaded(segment, chunkKey = '') {
      markDataSegmentLoadedFromRegistry(dataSegmentLoaded, segment, chunkKey);
    }

    function markCurrentDataChunksLoaded() {
      ['functions', 'structures', 'enums', 'constants', 'macros'].forEach((segment) => {
        getAvailableSegmentChunkKeys(segment).forEach((chunkKey) => {
          markDataSegmentLoaded(segment, chunkKey);
        });
      });
    }

    function mergeCategoryCollections(existingCollection, nextCollection) {
      const merged = {...(existingCollection || {})};

      Object.entries(nextCollection || {}).forEach(([key, section]) => {
        const currentSection = merged[key];
        if (!currentSection) {
          merged[key] = section;
          return;
        }

        const itemMap = new Map((currentSection.items || []).map((item) => [item.name, item]));
        (section.items || []).forEach((item) => {
          const currentItem = itemMap.get(item.name) || {};
          itemMap.set(item.name, {
            ...currentItem,
            ...item
          });
        });

        merged[key] = {
          ...currentSection,
          ...section,
          items: Array.from(itemMap.values())
        };
      });

      return merged;
    }

    function applyLoadedData(data, options = {}) {
      const {replace = true} = options;
      const nextMeta = data.meta
        ? {
            ...getVulkanMeta(),
            ...data.meta
          }
        : getVulkanMeta();
      const currentData = getVulkanData();
      const nextData = {...currentData};

      if (data.functions || data.commands) {
        nextData.commands = replace
          ? (data.functions || data.commands || {})
          : mergeCategoryCollections(currentData.commands, data.functions || data.commands || {});
      }
      if (data.structures) {
        nextData.structures = replace
          ? data.structures
          : mergeCategoryCollections(currentData.structures, data.structures);
      }
      if (data.enums) {
        nextData.enums = replace
          ? data.enums
          : mergeCategoryCollections(currentData.enums, data.enums);
      }
      if (data.constants) {
        nextData.constants = replace
          ? data.constants
          : mergeCategoryCollections(currentData.constants, data.constants);
      }
      if (data.macros) {
        nextData.macros = replace
          ? data.macros
          : mergeCategoryCollections(currentData.macros, data.macros);
      }

      setVulkanMeta(nextMeta);
      Object.assign(currentData, nextData);
      invalidateSearchIndex();
      resetClickNavigationDerivedCaches();
    }

    async function fetchJsonData(sourcePath) {
      const separator = sourcePath.includes('?') ? '&' : '?';
      const response = await fetch(`${sourcePath}${separator}v=${appAssetVersion}`);
      if (!response.ok) {
        throw new Error(`فشل تحميل ${sourcePath}: ${response.status}`);
      }
      return response.json();
    }

    async function ensureDataSegment(segment, chunkKey = '') {
      if (isDataSegmentLoaded(segment, chunkKey)) {
        return;
      }

      if (segment !== 'core' && !chunkKey) {
        const chunkKeys = getAvailableSegmentChunkKeys(segment);
        for (const key of chunkKeys) {
          await ensureDataSegment(segment, key);
        }
        return;
      }

      if (segment === 'core') {
        if (dataSegmentLoaded.core) {
          return;
        }
        const sourcePath = getDataSegmentChunkSource('core');
        const data = await fetchJsonData(sourcePath);
        applyLoadedData(data, {replace: true});
        markDataSegmentLoaded('core');
        return;
      }

      if (!dataSegmentPromises[segment]) {
        dataSegmentPromises[segment] = {};
      }
      if (dataSegmentPromises[segment][chunkKey]) {
        await dataSegmentPromises[segment][chunkKey];
        return;
      }

      const sourcePath = getDataSegmentChunkSource(segment, chunkKey);
      if (!sourcePath) {
        return;
      }

      dataSegmentPromises[segment][chunkKey] = fetchJsonData(sourcePath)
        .then((data) => {
          applyLoadedData(data, {replace: false});
          markDataSegmentLoaded(segment, chunkKey);
        })
        .finally(() => {
          delete dataSegmentPromises[segment][chunkKey];
        });

      await dataSegmentPromises[segment][chunkKey];
    }

    function refreshDynamicSearchSubFilterConfig() {
      setSearchDynamicSubfilters(getDynamicSearchSubfilters());
    }

    function loadDeferredScript(sourcePath, segment) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-ui-segment="${segment}"]`);
        if (existing) {
          if (existing.dataset.loaded === 'true') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve(), {once: true});
          existing.addEventListener('error', () => reject(new Error(`تعذر تحميل ${sourcePath}`)), {once: true});
          return;
        }

        const script = document.createElement('script');
        script.src = `${sourcePath}?v=${appAssetVersion}`;
        script.async = true;
        script.dataset.uiSegment = segment;
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve();
        };
        script.onerror = () => reject(new Error(`تعذر تحميل ${sourcePath}`));
        document.body.appendChild(script);
      });
    }

    function applyUiSegmentData(segment) {
      if (segment === 'homePageRuntime'
        || segment === 'referenceTemplatesRuntime'
        || segment === 'referenceRuntimePage'
        || segment === 'indexPagesRuntime'
        || segment === 'heavyHelper4Runtime'
        || segment === 'vulkanValuePagesRuntime'
        || segment === 'vulkanReferencePagesRuntime'
        || segment === 'generalDetailPagesRuntime'
        || segment === 'cppReferenceUtilsRuntime'
        || segment === 'tutorialSupportRuntime'
        || segment === 'fileSourceViewerRuntime') {
        global.__ARABIC_VULKAN_APP_BOOTSTRAP_CONFIG__?.configureBootstrapModules?.(
          global.__ARABIC_VULKAN_BOOTSTRAP_CONTEXT__ || {}
        );
      } else if (segment === 'tutorials') {
        setTutorialCatalog(global.__ARABIC_VULKAN_TUTORIALS__?.tutorialCatalog || getTutorialCatalog() || []);
        setTutorialVariableHints(global.__ARABIC_VULKAN_TUTORIALS__?.tutorialVariableHints || {});
        setTutorialConceptReferenceData(global.__ARABIC_VULKAN_TUTORIALS__?.tutorialConceptReferenceData || {});
        setTutorialContent(global.__ARABIC_VULKAN_TUTORIALS__?.tutorialContent || {});
      } else if (segment === 'glsl') {
        setGlslReferenceSections(global.__ARABIC_VULKAN_GLSL__?.glslReferenceSections || getGlslReferenceSections() || {});
        setGlslReadyExamples(global.__ARABIC_VULKAN_GLSL__?.glslReadyExamples || []);
        resetGlslCaches();
      } else if (segment === 'imgui') {
        setImguiMeta(global.__ARABIC_VULKAN_IMGUI__?.imguiMeta || {});
        setImguiReferenceSections(global.__ARABIC_VULKAN_IMGUI__?.imguiReferenceSections || getImguiReferenceSections() || {});
        resetImguiCaches();
        applyImguiStaticData(global.__ARABIC_VULKAN_IMGUI__?.staticData || {});
      } else if (segment === 'gameui') {
        setGameUiMeta(global.__ARABIC_VULKAN_GAME_UI__?.meta || getGameUiMeta() || {});
        setGameUiSections(global.__ARABIC_VULKAN_GAME_UI__?.data || getGameUiSections() || {});
        setGameUiSectionManifest({
          meta: global.__ARABIC_VULKAN_GAME_UI__?.meta || getGameUiMeta() || {},
          sections: global.__ARABIC_VULKAN_GAME_UI__?.sections || []
        });
        resetGameUiCaches();
      }

      refreshDynamicSearchSubFilterConfig();
      invalidateSearchIndex();
    }

    async function loadImguiJsonManifest(manifest = {}) {
      const sections = manifest.sections || [];
      const sectionEntries = await Promise.all(sections.map(async (section) => {
        const data = await fetchJsonData(section.path);
        const key = section.key || data.key;
        return [key, {
          ...data,
          key,
          title: data.title || section.title || '',
          icon: data.icon ?? section.icon ?? null,
          description: data.description || section.description || ''
        }];
      }));

      setImguiMeta(manifest.meta || {});
      setImguiReferenceSections(sectionEntries.reduce((acc, [key, data]) => {
        acc[key] = data;
        return acc;
      }, {}));
      resetImguiCaches();
      if (manifest.tooltipsPath) {
        const staticData = await fetchJsonData(manifest.tooltipsPath);
        applyImguiStaticData(staticData);
      } else if (manifest.tooltips || manifest.kindMeta || manifest.sectionIcons) {
        applyImguiStaticData({
          tooltips: manifest.tooltips,
          kindMeta: manifest.kindMeta,
          sectionIcons: manifest.sectionIcons
        });
      }
      refreshDynamicSearchSubFilterConfig();
      invalidateSearchIndex();
    }

    async function loadGlslJsonManifest(manifest = {}) {
      const sections = manifest.reference?.sections || [];
      const sectionEntries = await Promise.all(sections.map(async (section) => {
        const data = await fetchJsonData(section.path);
        const key = section.key || data.key;
        return [key, {
          ...data,
          key,
          title: data.title || section.title || '',
          icon: data.icon ?? section.icon ?? null,
          description: data.description || section.description || ''
        }];
      }));

      setGlslReferenceSections(sectionEntries.reduce((acc, [key, data]) => {
        acc[key] = data;
        return acc;
      }, {}));
      if (manifest.examples?.path) {
        setGlslReadyExamples(await fetchJsonData(manifest.examples.path));
      }
      resetGlslCaches();
      refreshDynamicSearchSubFilterConfig();
      invalidateSearchIndex();
    }

    async function loadGameUiJsonManifest(manifest = {}) {
      const manifestSections = Array.isArray(manifest.sections) ? manifest.sections : [];
      const sectionEntries = await Promise.all(manifestSections.map(async (section) => {
        if (!section?.path) {
          return null;
        }
        const data = await fetchJsonData(section.path);
        const key = section.key || data.key || section.path;
        return [key, {
          ...data,
          key,
          title: data.title || section.title || '',
          titleEn: data.titleEn || section.titleEn || '',
          description: data.description || section.description || '',
          icon: data.icon ?? section.icon ?? null,
          items: Array.isArray(data.items) ? data.items : []
        }];
      }));

      const normalizedSectionEntries = sectionEntries.filter(Boolean);
      const nextGameUiMeta = manifest.meta ? {...manifest.meta} : {};
      if (normalizedSectionEntries.length) {
        const manifestSectionMeta = manifestSections.map((section) => {
          const entry = normalizedSectionEntries.find(([key]) => key === section.key) || null;
          const entryData = entry ? entry[1] : null;
          const key = section.key || entry?.[0] || '';
          return {
            key,
            title: section.title || entryData?.title || key,
            titleEn: section.titleEn || entryData?.titleEn || '',
            itemCount: section.itemCount ?? (entryData?.items?.length || 0),
            icon: section.icon ?? entryData?.icon ?? null,
            path: section.path || ''
          };
        });
        if (manifestSectionMeta.length) {
          nextGameUiMeta.sections = manifestSectionMeta;
        } else if (!Array.isArray(nextGameUiMeta.sections) && normalizedSectionEntries.length) {
          nextGameUiMeta.sections = normalizedSectionEntries.map(([key, entry]) => ({
            key,
            title: entry.title || key,
            titleEn: entry.titleEn || '',
            itemCount: Array.isArray(entry.items) ? entry.items.length : 0,
            icon: entry.icon || null
          }));
        }
      }

      const nextGameUiSections = normalizedSectionEntries.reduce((acc, [key, data]) => {
        const normalizedItems = (data.items || []).map((item) => ({
          ...item,
          sectionKey: item.sectionKey || key,
          sectionTitle: item.sectionTitle || data.title || key,
          header: item.header || manifest.meta?.defaultHeader || '',
          headerTooltip: item.headerTooltip || manifest.meta?.defaultHeaderTooltip || '',
          threadSafety: item.threadSafety || manifest.meta?.defaultThreadSafety || ''
        }));
        acc[key] = {
          ...data,
          items: normalizedItems
        };
        return acc;
      }, {});

      setGameUiMeta(nextGameUiMeta);
      setGameUiSections(nextGameUiSections);
      setGameUiSectionManifest(manifest);
      global.__ARABIC_VULKAN_GAME_UI__ = {
        meta: nextGameUiMeta,
        sections: nextGameUiMeta.sections || manifest.sections || [],
        data: nextGameUiSections
      };
      resetGameUiCaches();
      refreshDynamicSearchSubFilterConfig();
      invalidateSearchIndex();
    }

    async function applyUiSegmentJsonData(segment, payload = {}) {
      if (segment === 'tutorials') {
        await ensureTutorialUiRuntime();
        setTutorialCatalog(payload.tutorialCatalog || []);
        setTutorialVariableHints(payload.tutorialVariableHints || {});
        setTutorialConceptReferenceData(payload.tutorialConceptReferenceData || {});
        setTutorialContent(buildTutorialContentFromLayouts(payload.tutorialContent || {}));
        return;
      }

      if (segment === 'files') {
        setVulkanFileSections(payload.vulkanFileSections || {});
        setFileReferenceOverrides(payload.fileReferenceOverrides || {});
        setFileReferenceData(buildFileReferenceData());
        return;
      }

      if (segment === 'sdl3') {
        setSdl3ReferenceSections(payload.sdl3ReferenceSections || getSdl3ReferenceSections() || {});
        setSdl3PackageMeta(payload.sdl3PackageMeta || getSdl3PackageMeta() || {});
        if (payload?.sdl3EntityData) {
          mergeSdl3EntityPayload(payload.sdl3EntityData);
        }
        return;
      }

      if (segment === 'sdl3Lexicon') {
        applySdl3LexiconData(payload || {});
        return;
      }

      if (segment === 'sdl3CoreFunctionRelations') {
        setSdl3CoreFunctionRelations(Array.isArray(payload.sdl3CoreFunctionRelations) ? payload.sdl3CoreFunctionRelations : []);
        return;
      }

      if (segment === 'sdl3CoreSymbolIndex') {
        setSdl3CoreSymbolIndex(Array.isArray(payload.sdl3CoreSymbolIndex) ? payload.sdl3CoreSymbolIndex : []);
        resetSdl3CoreSymbolIndexLookup();
        return;
      }

      if (segment === 'sdl3Search') {
        setSdl3SearchEntries(Array.isArray(payload.entries) ? payload.entries : []);
        invalidateSearchIndex();
        return;
      }

      if (segment === 'cmakeSearch') {
        setCmakeSearchMeta(payload?.meta ? {...getCmakeSearchMeta(), ...payload.meta} : getCmakeSearchMeta());
        setCmakeSearchEntries(Array.isArray(payload?.entries) ? payload.entries : []);
        refreshDynamicSearchSubFilterConfig();
        invalidateSearchIndex();
        return;
      }

      if (segment === 'sdl3Tooltip') {
        applySdl3TooltipOverrideData(payload || {});
        return;
      }

      if (segment === 'sdl3ExampleGuides') {
        applySdl3ExampleGuideData(payload || {});
        return;
      }

      if (segment === 'vulkanExampleGuides') {
        applyVulkanExampleGuideData(payload || {});
        return;
      }

      if (segment === 'vulkanParameterOverrides') {
        applyVulkanParameterOverrideData(payload || {});
        return;
      }

      if (segment === 'imguiExampleGuides') {
        applyImguiExampleGuideData(payload || {});
        return;
      }

      if (segment === 'imguiParameterOverrides') {
        applyImguiParameterOverrideData(payload || {});
        return;
      }

      if (segment === 'glslExampleGuides') {
        applyGlslExampleGuideData(payload || {});
        return;
      }

      if (segment === 'glslExampleTooltips') {
        applyGlslExampleTooltipOverrideData(payload || {});
        return;
      }

      if (segment === 'cppReferenceEnrichment') {
        applyCppReferenceEnrichmentData(payload || {});
        return;
      }

      if (segment === 'cppReferenceOfficialLinks') {
        applyCppReferenceOfficialLinksData(payload || {});
        return;
      }

      if (segment === 'cppReferenceGuides') {
        applyCppReferenceGuideData(payload || {});
        return;
      }

      if (segment === 'cppReferenceTooltips') {
        applyCppReferenceTooltipOverrideData(payload || {});
        return;
      }

      if (segment === 'imgui') {
        await loadImguiJsonManifest(payload);
        return;
      }

      if (segment === 'glsl') {
        await loadGlslJsonManifest(payload);
        return;
      }

      if (segment === 'gameui') {
        await loadGameUiJsonManifest(payload);
        return;
      }

      if (segment === 'vulkanSearch') {
        applyVulkanSearchTables(payload || {});
      }
    }

    function hasUiSegmentPayload(segment, payload = null) {
      if (segment === 'homePageRuntime') {
        return !!global.__ARABIC_VULKAN_HOME_PAGE__;
      }
      if (segment === 'referenceTemplatesRuntime') {
        return !!global.__ARABIC_VULKAN_REFERENCE_TEMPLATES__;
      }
      if (segment === 'referenceRuntimePage') {
        return !!global.__ARABIC_VULKAN_REFERENCE_RUNTIME__;
      }
      if (segment === 'indexPagesRuntime') {
        return !!global.__ARABIC_VULKAN_INDEX_PAGES__;
      }
      if (segment === 'heavyHelper4Runtime') {
        return !!global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__;
      }
      if (segment === 'vulkanValuePagesRuntime') {
        return !!global.__ARABIC_VULKAN_VALUE_PAGES__;
      }
      if (segment === 'vulkanReferencePagesRuntime') {
        return !!global.__ARABIC_VULKAN_REFERENCE_PAGES__;
      }
      if (segment === 'generalDetailPagesRuntime') {
        return !!global.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__;
      }
      if (segment === 'cppReferenceUtilsRuntime') {
        return !!global.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__;
      }
      if (segment === 'tutorialSupportRuntime') {
        return !!global.__ARABIC_VULKAN_TUTORIAL_SUPPORT__;
      }
      if (segment === 'fileSourceViewerRuntime') {
        return !!global.__ARABIC_VULKAN_FILE_SOURCE_VIEWER__;
      }
      if (segment === 'tutorials') {
        if (uiSegmentSources.tutorials?.format === 'json') {
          return Array.isArray(payload?.tutorialCatalog) && payload.tutorialCatalog.length > 0;
        }
        return Array.isArray(global.__ARABIC_VULKAN_TUTORIALS__?.tutorialCatalog);
      }
      if (segment === 'glsl') {
        if (uiSegmentSources.glsl?.format === 'json') {
          return Array.isArray(payload?.reference?.sections) && payload.reference.sections.length > 0;
        }
        return !!global.__ARABIC_VULKAN_GLSL__?.glslReferenceSections
          && Object.keys(global.__ARABIC_VULKAN_GLSL__.glslReferenceSections).length > 0;
      }
      if (segment === 'imgui') {
        if (uiSegmentSources.imgui?.format === 'json') {
          return Array.isArray(payload?.sections) && payload.sections.length > 0;
        }
        return !!global.__ARABIC_VULKAN_IMGUI__?.imguiReferenceSections
          && Object.keys(global.__ARABIC_VULKAN_IMGUI__.imguiReferenceSections).length > 0;
      }
      if (segment === 'gameui') {
        if (uiSegmentSources.gameui?.format === 'json') {
          return Array.isArray(payload?.sections) && payload.sections.length > 0;
        }
        return !!global.__ARABIC_VULKAN_GAME_UI__?.data
          && Object.keys(global.__ARABIC_VULKAN_GAME_UI__.data).length > 0;
      }
      if (segment === 'files') {
        return !!payload?.vulkanFileSections
          && Object.keys(payload.vulkanFileSections).length > 0;
      }
      if (segment === 'sdl3') {
        return !!payload && (
          (payload?.sdl3PackageMeta && Object.keys(payload.sdl3PackageMeta).length > 0)
          || (payload?.sdl3EntityData && Array.isArray(payload.sdl3EntityData.functions))
        );
      }
      if (segment === 'sdl3Lexicon') {
        return !!payload && typeof payload === 'object';
      }
      if (segment === 'sdl3Search') {
        return Array.isArray(payload?.entries);
      }
      if (segment === 'cmakeSearch') {
        return Array.isArray(payload?.entries) && payload.entries.length > 0;
      }
      if (segment === 'sdl3ExampleGuides'
        || segment === 'vulkanExampleGuides'
        || segment === 'vulkanParameterOverrides'
        || segment === 'imguiExampleGuides'
        || segment === 'imguiParameterOverrides'
        || segment === 'glslExampleGuides'
        || segment === 'glslExampleTooltips'
        || segment === 'cppReferenceEnrichment'
        || segment === 'cppReferenceOfficialLinks'
        || segment === 'cppReferenceGuides'
        || segment === 'cppReferenceTooltips'
        || segment === 'vulkanSearch'
        || segment === 'sdl3Tooltip') {
        return !!payload && typeof payload === 'object';
      }
      return true;
    }

    async function ensureUiSegment(segment) {
      if (uiSegmentLoaded[segment]) {
        return;
      }

      if (uiSegmentPromises[segment]) {
        await uiSegmentPromises[segment];
        return;
      }

      const sourceConfig = uiSegmentSources[segment];
      if (!sourceConfig?.path) {
        return;
      }

      uiSegmentPromises[segment] = (sourceConfig.format === 'json'
        ? fetchJsonData(sourceConfig.path).then((payload) => {
          if (!hasUiSegmentPayload(segment, payload)) {
            throw new Error(`تم تحميل ${segment} بدون بيانات قابلة للاستخدام`);
          }
          return applyUiSegmentJsonData(segment, payload);
        }).then(() => {
          uiSegmentLoaded[segment] = true;
        })
        : loadDeferredScript(sourceConfig.path, segment).then(() => {
          if (!hasUiSegmentPayload(segment)) {
            throw new Error(`تم تحميل ${segment} بدون بيانات قابلة للاستخدام`);
          }
          applyUiSegmentData(segment);
          uiSegmentLoaded[segment] = true;
        }))
        .finally(() => {
          delete uiSegmentPromises[segment];
        });

      await uiSegmentPromises[segment];
    }

    return {
      getAvailableSegmentChunkKeys,
      getDataSegmentChunkSource,
      isDataSegmentLoaded,
      markDataSegmentLoaded,
      markCurrentDataChunksLoaded,
      mergeCategoryCollections,
      applyLoadedData,
      fetchJsonData,
      ensureDataSegment,
      refreshDynamicSearchSubFilterConfig,
      loadDeferredScript,
      applyUiSegmentData,
      loadImguiJsonManifest,
      loadGlslJsonManifest,
      loadGameUiJsonManifest,
      applyUiSegmentJsonData,
      hasUiSegmentPayload,
      ensureUiSegment
    };
  }

  global.createAppDataRuntime = createAppDataRuntime;
  global.__ARABIC_VULKAN_APP_DATA_RUNTIME__ = {
    createAppDataRuntime
  };
})(window);
