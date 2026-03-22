(function(global) {
  'use strict';

  function createSdl3PackageDataRuntime(options = {}) {
    const SDL3_ENTITY_BASE_DATA_KEYS = options.SDL3_ENTITY_BASE_DATA_KEYS || [];
    const sdl3PackageSegmentSources = options.sdl3PackageSegmentSources || {};
    const sdl3PackageKindSegmentSources = options.sdl3PackageKindSegmentSources || {};
    const sdl3PackageSegmentLoaded = options.sdl3PackageSegmentLoaded || {};
    const sdl3PackageKindSegmentLoaded = options.sdl3PackageKindSegmentLoaded || {};
    const sdl3PackageSegmentPromises = options.sdl3PackageSegmentPromises || {};
    const sdl3PackageKindSegmentPromises = options.sdl3PackageKindSegmentPromises || {};
    const getSdl3EntityBaseDataKey = typeof options.getSdl3EntityBaseDataKey === 'function'
      ? options.getSdl3EntityBaseDataKey
      : (dataKey = '') => dataKey || 'functions';
    const ensureUiSegment = typeof options.ensureUiSegment === 'function'
      ? options.ensureUiSegment
      : async () => {};
    const fetchJsonData = typeof options.fetchJsonData === 'function'
      ? options.fetchJsonData
      : async () => ({});
    const mergeSdl3EntityPayload = typeof options.mergeSdl3EntityPayload === 'function'
      ? options.mergeSdl3EntityPayload
      : () => {};
    const getSdl3VisiblePackageKeys = typeof options.getSdl3VisiblePackageKeys === 'function'
      ? options.getSdl3VisiblePackageKeys
      : () => [];

    function isSdl3PackageDataLoaded(packageKey = 'core') {
      const normalized = String(packageKey || 'core').trim().toLowerCase() || 'core';
      return !!sdl3PackageSegmentLoaded[normalized];
    }

    function markSdl3PackageKindLoaded(packageKey = 'core', dataKey = 'functions') {
      const normalizedPackageKey = String(packageKey || 'core').trim().toLowerCase() || 'core';
      const normalizedDataKey = getSdl3EntityBaseDataKey(dataKey);
      if (!sdl3PackageKindSegmentLoaded[normalizedPackageKey]) {
        sdl3PackageKindSegmentLoaded[normalizedPackageKey] = {};
      }
      sdl3PackageKindSegmentLoaded[normalizedPackageKey][normalizedDataKey] = true;
    }

    function markAllSdl3PackageKindsLoaded(packageKey = 'core') {
      SDL3_ENTITY_BASE_DATA_KEYS.forEach((dataKey) => {
        markSdl3PackageKindLoaded(packageKey, dataKey);
      });
    }

    function isSdl3PackageKindDataLoaded(packageKey = 'core', dataKey = 'functions') {
      const normalizedPackageKey = String(packageKey || 'core').trim().toLowerCase() || 'core';
      const normalizedDataKey = getSdl3EntityBaseDataKey(dataKey);
      if (sdl3PackageSegmentLoaded[normalizedPackageKey]) {
        return true;
      }
      return !!sdl3PackageKindSegmentLoaded[normalizedPackageKey]?.[normalizedDataKey];
    }

    async function ensureSdl3PackageData(packageKey = 'core') {
      await ensureUiSegment('sdl3');

      const normalized = String(packageKey || 'core').trim().toLowerCase() || 'core';
      const sourcePath = sdl3PackageSegmentSources[normalized];
      if (!sourcePath) {
        return;
      }

      if (sdl3PackageSegmentLoaded[normalized]) {
        return;
      }

      if (sdl3PackageSegmentPromises[normalized]) {
        await sdl3PackageSegmentPromises[normalized];
        return;
      }

      sdl3PackageSegmentPromises[normalized] = fetchJsonData(sourcePath)
        .then((payload) => {
          if (!payload?.sdl3EntityData) {
            throw new Error(`تم تحميل SDL3 package ${normalized} بدون بيانات قابلة للاستخدام`);
          }
          mergeSdl3EntityPayload(payload.sdl3EntityData);
          sdl3PackageSegmentLoaded[normalized] = true;
          markAllSdl3PackageKindsLoaded(normalized);
        })
        .finally(() => {
          delete sdl3PackageSegmentPromises[normalized];
        });

      await sdl3PackageSegmentPromises[normalized];
    }

    async function ensureSdl3PackageKindData(packageKey = 'core', dataKey = 'functions') {
      await ensureUiSegment('sdl3');

      const normalizedPackageKey = String(packageKey || 'core').trim().toLowerCase() || 'core';
      const normalizedDataKey = getSdl3EntityBaseDataKey(dataKey);
      if (isSdl3PackageKindDataLoaded(normalizedPackageKey, normalizedDataKey)) {
        return;
      }

      const sourcePath = sdl3PackageKindSegmentSources[normalizedPackageKey]?.[normalizedDataKey];
      if (!sourcePath) {
        await ensureSdl3PackageData(normalizedPackageKey);
        return;
      }

      const promiseKey = `${normalizedPackageKey}:${normalizedDataKey}`;
      if (sdl3PackageKindSegmentPromises[promiseKey]) {
        await sdl3PackageKindSegmentPromises[promiseKey];
        return;
      }

      sdl3PackageKindSegmentPromises[promiseKey] = fetchJsonData(sourcePath)
        .then((payload) => {
          if (!payload?.sdl3EntityData) {
            throw new Error(`تم تحميل SDL3 package shard ${promiseKey} بدون بيانات قابلة للاستخدام`);
          }
          mergeSdl3EntityPayload(payload.sdl3EntityData);
          markSdl3PackageKindLoaded(normalizedPackageKey, normalizedDataKey);
        })
        .finally(() => {
          delete sdl3PackageKindSegmentPromises[promiseKey];
        });

      await sdl3PackageKindSegmentPromises[promiseKey];
    }

    async function ensureSdl3SectionData(dataKey = 'functions') {
      await ensureUiSegment('sdl3');
      await Promise.all(getSdl3VisiblePackageKeys().map((packageKey) => ensureSdl3PackageKindData(packageKey, dataKey)));
    }

    async function ensureSdl3PackageSidebarData(packageKey = 'core') {
      await ensureUiSegment('sdl3');
      await Promise.all([
        ensureSdl3PackageKindData(packageKey, 'functions'),
        ensureSdl3PackageKindData(packageKey, 'macros'),
        ensureSdl3PackageKindData(packageKey, 'constants'),
        ensureSdl3PackageKindData(packageKey, 'variables'),
        ensureSdl3PackageKindData(packageKey, 'structures')
      ]);
    }

    async function ensureAllSdl3PackageData() {
      await ensureUiSegment('sdl3');
      await Promise.all(Object.keys(sdl3PackageSegmentSources).map((packageKey) => ensureSdl3PackageData(packageKey)));
    }

    return {
      isSdl3PackageDataLoaded,
      markSdl3PackageKindLoaded,
      markAllSdl3PackageKindsLoaded,
      isSdl3PackageKindDataLoaded,
      ensureSdl3PackageData,
      ensureSdl3PackageKindData,
      ensureSdl3SectionData,
      ensureSdl3PackageSidebarData,
      ensureAllSdl3PackageData
    };
  }

  global.createSdl3PackageDataRuntime = createSdl3PackageDataRuntime;
  global.__ARABIC_VULKAN_SDL3_PACKAGE_DATA_RUNTIME__ = {
    createSdl3PackageDataRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
