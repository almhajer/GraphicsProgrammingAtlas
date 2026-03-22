(function(global) {
  'use strict';

  function createSdl3NavRuntime(api = {}) {
    const {
      translateSdl3CategoryLabel,
      joinSdl3CategoryTrail,
      getSdl3PackageItems: externalGetSdl3PackageItems,
      getSdl3EntityItems,
      getSdl3PackageOrder,
      getSdl3CollectionMeta,
      getSdl3KindMeta,
      getSdl3TypeSectionDataKey,
      getSdl3PackageSectionId: externalGetSdl3PackageSectionId,
      getSdl3PackageBranchId: externalGetSdl3PackageBranchId,
      ensureSdl3PackageKindData,
      collapseAllSidebarSections,
      collapseAllSidebarNavGroups,
      collapseAllSidebarClusters,
      getSdl3NavGroupStateKey: externalGetSdl3NavGroupStateKey,
      sdl3ExpandedNavGroups,
      getSdl3PackageKindStateKey,
      readJsonStorage,
      writeJsonStorage,
      sdl3PackageItemsCache,
      sdl3GroupedItemsCache,
      escapeAttribute,
      escapeHtml,
      buildDeferredSdl3TooltipAttrs,
      renderEntityIcon
    } = api;
    const {
      renderSidebarExampleGroup = null
    } = global.__ARABIC_VULKAN_SIDEBAR_BLOCKS__ || {};

function getSdl3CollectionGroupTitle(item, dataKey, options = {}) {
  const packageScoped = !!options.packageScoped;

  if (dataKey === 'functions') {
    if (packageScoped) {
      if (item.packageKey === 'core' && item.categoryTitle) {
        return joinSdl3CategoryTrail(item.categorySectionTitle, item.categoryTitle);
      }
      if (item.categoryTitle && item.categoryTitle !== `${item.packageDisplayName} API`) {
        return translateSdl3CategoryLabel(item.categoryTitle);
      }
      return translateSdl3CategoryLabel(item.packageDisplayName || item.packageName || 'SDL3');
    }

    const packageLabel = item.packageDisplayName || item.packageName || 'SDL3';
    if (item.packageKey === 'core' && item.categoryTitle) {
      return joinSdl3CategoryTrail(packageLabel, item.categorySectionTitle, item.categoryTitle);
    }
    return translateSdl3CategoryLabel(packageLabel);
  }

  if (dataKey === 'macros') {
    if (packageScoped) {
      if (item.packageKey === 'core' && item.categoryTitle) {
        return joinSdl3CategoryTrail(item.categorySectionTitle, item.categoryTitle);
      }
      return translateSdl3CategoryLabel(item.packageDisplayName || item.packageName || 'SDL3');
    }

    if (item.packageKey === 'core' && item.categoryTitle) {
      return joinSdl3CategoryTrail(item.categorySectionTitle, item.categoryTitle);
    }
    return translateSdl3CategoryLabel(item.packageDisplayName || item.packageName || 'SDL3');
  }

  if (dataKey === 'constants') {
    return translateSdl3CategoryLabel(item.parentEnum || item.packageDisplayName || item.packageName || 'SDL3');
  }

  if (packageScoped) {
    if (item.packageKey === 'core' && item.categoryTitle) {
      return joinSdl3CategoryTrail(item.categorySectionTitle, item.categoryTitle);
    }
    if (item.categoryTitle && item.categoryTitle !== `${item.packageDisplayName} API`) {
      return translateSdl3CategoryLabel(item.categoryTitle);
    }
  }

  return translateSdl3CategoryLabel(item.packageDisplayName || item.packageName || 'SDL3');
}

function getSdl3GroupedItems(dataKey, options = {}) {
  const cacheKey = `${options.packageKey || '*'}:${dataKey}`;
  if (sdl3GroupedItemsCache.has(cacheKey)) {
    return sdl3GroupedItemsCache.get(cacheKey);
  }

  const groups = new Map();
  const items = (options.packageKey ? getSdl3PackageItems(options.packageKey, dataKey) : getSdl3EntityItems(dataKey))
    .slice()
    .sort((a, b) => {
    const packageDiff = getSdl3PackageOrder(a.packageKey) - getSdl3PackageOrder(b.packageKey);
    if (packageDiff !== 0) {
      return packageDiff;
    }
    const groupDiff = getSdl3CollectionGroupTitle(a, dataKey, {packageScoped: !!options.packageKey})
      .localeCompare(getSdl3CollectionGroupTitle(b, dataKey, {packageScoped: !!options.packageKey}), 'ar');
    if (groupDiff !== 0) {
      return groupDiff;
    }
    return String(a.name || '').localeCompare(String(b.name || ''), 'en');
  });

  items.forEach((item) => {
    const title = getSdl3CollectionGroupTitle(item, dataKey, {packageScoped: !!options.packageKey});
    const key = `${options.packageKey || item.packageKey}:${title}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        title,
        items: []
      });
    }
    groups.get(key).items.push(item);
  });

  const grouped = Array.from(groups.values());
  sdl3GroupedItemsCache.set(cacheKey, grouped);
  return grouped;
}

function renderSdl3IndexGroupSection(group, options = {}) {
  const eyebrow = options.eyebrow || 'تصنيف فرعي';
  return `
    <section class="category-section sdl3-index-group">
      <div class="sdl3-index-group-header">
        <div class="sdl3-index-group-copy">
          <div class="sdl3-index-group-kicker">${escapeHtml(eyebrow)}</div>
          <h2>${escapeHtml(group.title)}</h2>
        </div>
        <span class="sdl3-index-group-count">${group.items.length} عنصر</span>
      </div>
      <div class="see-also-links sdl3-index-group-links">
        ${group.items.map((item) => renderSdl3EntityLink(item.name)).join('')}
      </div>
    </section>
  `;
}

function renderSdl3NavItem(item) {
  const itemMeta = item.kind === 'type'
    ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item))
    : getSdl3KindMeta(item.kind);

  return `
    <div class="nav-item" data-nav-type="${itemMeta.navType}" data-nav-name="${escapeAttribute(item.name)}"${buildDeferredSdl3TooltipAttrs(item, item.name)} role="button">
      <span>${renderEntityIcon(itemMeta.icon, 'ui-codicon nav-icon', item.name)}</span>
      <span>${escapeHtml(item.name)}</span>
    </div>
  `;
}

function renderSdl3LazyNavGroup(group, dataKey, options = {}) {
  const groupStateKey = getSdl3NavGroupStateKey(options.packageKey || '', dataKey, group.key);
  const isExpanded = sdl3ExpandedNavGroups.has(groupStateKey);
  if (typeof renderSidebarExampleGroup === 'function') {
    return renderSidebarExampleGroup({
      className: '',
      isExpanded,
      onToggle: 'toggleConstantGroup(this)',
      titleHtml: escapeHtml(group.title),
      count: group.items.length,
      itemsHtml: '',
      itemsAttributes: `data-sdl3-lazy="true" data-sdl3-data-key="${escapeAttribute(dataKey)}" data-sdl3-package-key="${escapeAttribute(options.packageKey || '')}" data-sdl3-group-key="${escapeAttribute(group.key)}"`
    });
  }

  return `
    <div class="nav-constant-group file-nav-group${isExpanded ? '' : ' collapsed'}">
      <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
        <span class="nav-constant-group-title-wrap">
          <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
          <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
        </span>
        <span class="nav-constant-group-count">${group.items.length}</span>
      </div>
      <div class="nav-constant-group-items" data-sdl3-lazy="true" data-sdl3-data-key="${escapeAttribute(dataKey)}" data-sdl3-package-key="${escapeAttribute(options.packageKey || '')}" data-sdl3-group-key="${escapeAttribute(group.key)}"></div>
    </div>
  `;
}

function hydrateLazySdl3NavGroup(group) {
  const container = group?.querySelector?.('.nav-constant-group-items[data-sdl3-lazy="true"]');
  if (!container || container.dataset.hydrated === 'true') {
    return;
  }

  const dataKey = String(container.dataset.sdl3DataKey || '').trim();
  const packageKey = String(container.dataset.sdl3PackageKey || '').trim();
  const groupKey = String(container.dataset.sdl3GroupKey || '').trim();
  const groups = getSdl3GroupedItems(dataKey, packageKey ? {packageKey} : {});
  const groupData = groups.find((entry) => entry.key === groupKey);

  container.innerHTML = groupData?.items?.map((item) => renderSdl3NavItem(item)).join('') || '';
  container.dataset.hydrated = 'true';
}

function hydrateExpandedSdl3NavGroups(root) {
  root?.querySelectorAll?.('.nav-constant-group:not(.collapsed)').forEach((group) => {
    hydrateLazySdl3NavGroup(group);
  });
}

function renderSdl3IndexGroupsProgressively(container, groups, options = {}) {
  if (!container) {
    return;
  }

  if (!groups.length) {
    container.innerHTML = `
      <section class="info-section">
        <div class="content-card prose-card">
          <p>لا توجد عناصر محلية في هذا الفرع حالياً.</p>
        </div>
      </section>
    `;
    return;
  }

  container.innerHTML = '';
  const batchSize = Math.max(1, options.batchSize || 4);
  let index = 0;

  const renderBatch = () => {
    const slice = groups.slice(index, index + batchSize);
    if (!slice.length) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = slice.map((group) => renderSdl3IndexGroupSection(group, options)).join('');
    while (wrapper.firstChild) {
      container.appendChild(wrapper.firstChild);
    }

    index += batchSize;
    if (index < groups.length) {
      requestAnimationFrame(renderBatch);
    }
  };

  renderBatch();
}

function getSdl3OverviewTooltip() {
  const counts = getSdl3VisiblePackageKeys()
    .map((packageKey) => {
      const pkg = getSdl3PackageInfo(packageKey);
      const declaredCounts = pkg?.counts || {};
      const functionCount = isSdl3PackageDataLoaded(packageKey) ? getSdl3PackageItems(packageKey, 'functions').length : (declaredCounts.functions || 0);
      const typeCount = isSdl3PackageDataLoaded(packageKey) ? getSdl3PackageItems(packageKey, 'types').length : (declaredCounts.types || 0);
      const macroCount = isSdl3PackageDataLoaded(packageKey) ? getSdl3PackageItems(packageKey, 'macros').length : (declaredCounts.macros || 0);
      return `${pkg.displayName}: ${functionCount} دالة، ${typeCount} نوع/بنية، ${macroCount} ماكرو`;
    })
    .join('\n');
  return `مرجع محلي لـ SDL3 وملحقاته.\n${counts}`;
}

function getSdl3PackageBreakdown(dataKey) {
  return getSdl3VisiblePackageKeys()
    .map((packageKey) => {
      const pkg = getSdl3PackageInfo(packageKey);
      return {
        key: packageKey,
        title: pkg.displayName,
        count: getSdl3PackageItems(packageKey, dataKey).length
      };
    })
    .filter((entry) => entry.count > 0)
    .sort((a, b) => getSdl3PackageOrder(a.key) - getSdl3PackageOrder(b.key));
}

function getSdl3PackageInfo(packageKey) {
  const info = sdl3PackageMeta?.[packageKey] || null;
  if (!info) {
    return null;
  }

  return {
    ...info,
    description: normalizeSdl3ArabicTechnicalProse(info.description || '')
  };
}

function getSdl3PackageBranchId(packageKey) {
  return getSdl3PackageListId(packageKey);
}

function getSdl3PackageSectionId(packageKey, dataKey) {
  return `sdl3-${String(packageKey || 'core')}-${String(dataKey || 'functions')}-list`;
}

function getSdl3PackageSectionStateKey(packageKey, dataKey) {
  return `${String(packageKey || 'core')}::${String(dataKey || 'functions')}`;
}

function getSdl3NavGroupStateKey(packageKey, dataKey, groupKey) {
  return `${getSdl3PackageSectionStateKey(packageKey, dataKey)}::${String(groupKey || '')}`;
}

function parseSdl3PackageSectionId(sectionId) {
  const match = /^sdl3-([a-z0-9_]+)-([a-z0-9_]+)-list$/i.exec(String(sectionId || '').trim());
  if (!match) {
    return null;
  }

  return {
    packageKey: match[1],
    dataKey: match[2]
  };
}

function rememberSdl3PackageSectionState(packageKey, dataKey, isExpanded) {
  const key = getSdl3PackageSectionStateKey(packageKey, dataKey);
  if (isExpanded) {
    sdl3ExpandedPackageSections.add(key);
  } else {
    sdl3ExpandedPackageSections.delete(key);
  }
}

function rememberSdl3PackageSectionStateById(sectionId, isExpanded) {
  const parsed = parseSdl3PackageSectionId(sectionId);
  if (!parsed) {
    return;
  }

  rememberSdl3PackageSectionState(parsed.packageKey, parsed.dataKey, isExpanded);
}

function rememberSdl3NavGroupState(group, isExpanded) {
  const container = group?.querySelector?.('.nav-constant-group-items[data-sdl3-lazy="true"]');
  if (!container) {
    return;
  }

  const key = getSdl3NavGroupStateKey(
    String(container.dataset.sdl3PackageKey || '').trim(),
    String(container.dataset.sdl3DataKey || '').trim(),
    String(container.dataset.sdl3GroupKey || '').trim()
  );

  if (isExpanded) {
    sdl3ExpandedNavGroups.add(key);
  } else {
    sdl3ExpandedNavGroups.delete(key);
  }
}

function getSdl3PackageSectionCompositeName(packageKey, dataKey) {
  return `${String(packageKey || 'core')}::${String(dataKey || 'functions')}`;
}

function parseSdl3PackageSectionCompositeName(value) {
  const [packageKey = '', dataKey = 'functions'] = String(value || '').split('::');
  return {
    packageKey,
    dataKey
  };
}

function getSdl3PackageItems(packageKey, dataKey) {
  const cacheKey = `${packageKey}:${dataKey}`;
  if (sdl3PackageItemsCache.has(cacheKey)) {
    return sdl3PackageItemsCache.get(cacheKey);
  }

  const items = getSdl3EntityItems(dataKey).filter((item) => item.packageKey === packageKey);
  sdl3PackageItemsCache.set(cacheKey, items);
  return items;
}

function getSdl3PackageKindMetaList(packageKey) {
  return ['functions', 'macros', 'constants', 'variables', 'structures']
    .map((dataKey) => getSdl3CollectionMeta(dataKey))
    .filter((meta) => getSdl3PackageItems(packageKey, meta.dataKey).length > 0);
}

function getSdl3PackageTotalCount(packageKey, options = {}) {
  const dataKeys = options.visibleOnly
    ? ['functions', 'macros', 'constants', 'variables', 'structures']
    : ['functions', 'types', 'enums', 'constants', 'macros'];

  return dataKeys
    .map((dataKey) => getSdl3PackageItems(packageKey, dataKey).length)
    .reduce((total, count) => total + count, 0);
}

    return {
      getSdl3CollectionGroupTitle,
      getSdl3GroupedItems,
      getSdl3PackageItems,
      getSdl3PackageKindMetaList,
      getSdl3PackageTotalCount,
      getSdl3PackageInfo,
      getSdl3PackageSectionStateKey,
      getSdl3NavGroupStateKey,
      renderSdl3IndexGroupSection,
      renderSdl3NavItem,
      renderSdl3LazyNavGroup,
      hydrateLazySdl3NavGroup,
      hydrateExpandedSdl3NavGroups,
      renderSdl3IndexGroupsProgressively,
      rememberSdl3PackageSectionState,
      rememberSdl3PackageSectionStateById,
      toggleSdl3PackageKindSection,
      populateSdl3PackageKindNavSection
    };
  }

  global.__ARABIC_VULKAN_SDL3_NAV_RUNTIME__ = {
    createSdl3NavRuntime
  };
})(window);
