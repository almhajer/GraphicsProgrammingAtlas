(function(global) {
  'use strict';

  function createCategoryLookupRuntime() {
    const categoryLookupCache = new WeakMap();
    const categoryLookupMetaCache = new WeakMap();
    const normalizeCache = new Map();

    function clearCategoryLookupCaches() {
      normalizeCache.clear();
    }

    function normalizeLookupName(name) {
      if (!name) return '';

      const raw = String(name);
      if (normalizeCache.has(raw)) {
        return normalizeCache.get(raw);
      }

      const normalized = raw
        .replace(/\bconst\b/g, '')
        .replace(/\bstruct\b/g, '')
        .replace(/\s*\*+\s*/g, '')
        .replace(/\s*\[[^\]]*\]\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (normalizeCache.size > 12000) {
        normalizeCache.clear();
      }
      normalizeCache.set(raw, normalized);
      return normalized;
    }

    function buildCategoryLookupMaps(collection) {
      const directMap = new Map();
      const metaMap = new Map();

      Object.entries(collection || {}).forEach(([key, category]) => {
        (category.items || []).forEach((item) => {
          if (!item?.name) {
            return;
          }
          const rawName = String(item.name).trim();
          const normalizedName = normalizeLookupName(rawName);
          if (!directMap.has(rawName)) {
            directMap.set(rawName, item);
            metaMap.set(rawName, {item, key, category});
          }
          if (normalizedName && !directMap.has(normalizedName)) {
            directMap.set(normalizedName, item);
            metaMap.set(normalizedName, {item, key, category});
          }
        });
      });

      categoryLookupCache.set(collection, directMap);
      categoryLookupMetaCache.set(collection, metaMap);
      return {directMap, metaMap};
    }

    function getCategoryLookupMap(collection) {
      if (!collection || typeof collection !== 'object') {
        return new Map();
      }
      if (!categoryLookupCache.has(collection)) {
        return buildCategoryLookupMaps(collection).directMap;
      }
      return categoryLookupCache.get(collection);
    }

    function getCategoryLookupMetaMap(collection) {
      if (!collection || typeof collection !== 'object') {
        return new Map();
      }
      if (!categoryLookupMetaCache.has(collection)) {
        return buildCategoryLookupMaps(collection).metaMap;
      }
      return categoryLookupMetaCache.get(collection);
    }

    function findItemInCategories(collection, rawName) {
      const lookupName = normalizeLookupName(rawName);
      const directMap = getCategoryLookupMap(collection);
      return directMap.get(String(rawName || '').trim()) || directMap.get(lookupName) || null;
    }

    function findItemInCategoriesWithMeta(collection, rawName) {
      const lookupName = normalizeLookupName(rawName);
      const metaMap = getCategoryLookupMetaMap(collection);
      return metaMap.get(String(rawName || '').trim()) || metaMap.get(lookupName) || null;
    }

    return {
      clearCategoryLookupCaches,
      normalizeLookupName,
      buildCategoryLookupMaps,
      getCategoryLookupMap,
      getCategoryLookupMetaMap,
      findItemInCategories,
      findItemInCategoriesWithMeta
    };
  }

  global.createCategoryLookupRuntime = createCategoryLookupRuntime;
  global.__ARABIC_VULKAN_CATEGORY_LOOKUP_RUNTIME__ = {
    createCategoryLookupRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
