window.__ARABIC_VULKAN_SDL3_SECTION__ = (() => {
  const {
    collapseAllSidebarClusters = () => {},
    collapseAllSidebarNavGroups = () => {},
    collapseAllSidebarSections = () => {},
    sdl3ExpandedPackageSections = new Set()
  } = window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ || {};

  function configure() {}

  function renderSdl3LocalPracticalExampleFallback(item) {
    if (typeof buildSdl3PracticalExample !== 'function' || typeof renderSdl3ExampleCodeBlock !== 'function') {
      return '';
    }

    const example = buildSdl3PracticalExample(item);
    if (!example?.code) {
      return '';
    }

    return `
      <section class="example-section">
        <h2>مثال عملي</h2>
        ${renderSdl3ExampleCodeBlock(item, example.code)}
      </section>
      <section class="info-section">
        <div class="content-card prose-card">
          <p>${renderSdl3PracticalText(example.purpose, example.purpose)}</p>
          ${example.notes?.length ? `<p>${example.notes.map((note) => renderSdl3PracticalText(note, note)).join(' ')}</p>` : ''}
        </div>
      </section>
    `;
  }

  function renderSdl3EntityPage(item, options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const meta = getSdl3KindMeta(item.kind);
    const sectionMeta = getSdl3CollectionMeta(getSdl3ItemSectionDataKey(item));
    const exactType = getSdl3ExactElementTypeInfo(item);
    const packageInfo = getSdl3PackageInfo(item.packageKey) || {};
    const packageSectionId = getSdl3PackageSectionId(item.packageKey, sectionMeta.dataKey);
    const syntaxBlock = renderSdl3SyntaxCodeBlock(item);
    const profile = buildSdl3OperationalProfile(item);
    const practicalExampleSection = renderSdl3PracticalExampleSection(item) || renderSdl3LocalPracticalExampleFallback(item);

    content.innerHTML = `
      <div class="reference-unified-detail-page">
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
          <a href="#" onclick="showSdl3PackageIndex('${escapeAttribute(item.packageKey)}'); return false;">${escapeHtml(packageInfo.displayName || item.packageDisplayName || item.packageName || 'SDL3')}</a> /
          <a href="#" onclick="showSdl3PackageSectionIndex('${escapeAttribute(item.packageKey)}', '${escapeAttribute(sectionMeta.dataKey)}'); return false;">${sectionMeta.title}</a> /
          <span>${escapeHtml(item.name)}</span>
        </nav>
        <h1 class="page-title">${renderEntityIcon(item.kind === 'type' ? sectionMeta.icon : meta.icon, 'ui-codicon page-icon', item.name)} ${escapeHtml(item.name)}</h1>
        <p class="page-description">${linkSdl3DocText(buildSdl3PrimaryMeaning(item))}</p>
      </div>

      <section class="info-section">
        ${renderSdl3InfoGrid([
          {
            label: 'الحزمة',
            value: `<code dir="ltr">${escapeHtml(item.packageDisplayName || item.packageName || '')}</code>`,
            note: normalizeSdl3ArabicTechnicalProse(packageInfo.description || '')
          },
          {
            label: 'الوصف الرسمي بالعربي',
            value: renderSdl3PracticalText(buildSdl3OfficialDescription(item), buildSdl3PrimaryMeaning(item)),
            note: ''
          },
          {
            label: 'المعنى الحقيقي',
            value: renderSdl3PracticalText(profile?.meaning || buildSdl3PrimaryMeaning(item), buildSdl3PrimaryMeaning(item)),
            note: ''
          },
          {
            label: 'التصنيف',
            value: escapeHtml(translateSdl3CategoryLabel(item.categoryTitle || 'SDL3 API')),
            note: item.categorySectionTitle ? `القسم الأعلى: ${translateSdl3CategoryLabel(item.categorySectionTitle)}` : ''
          },
          {
            label: 'نوع العنصر',
            value: escapeHtml(exactType.display),
            note: item.version ? translateSdl3DocText(item.version, item) : buildSdl3UsageHint(item)
          }
        ])}
      </section>

      ${renderSdl3HeaderFilesSection(item)}
      ${renderSdl3OperationalProfile(item)}
      ${renderSdl3TypeDetails(item)}
      ${renderSdl3LifecycleSection(item)}
      ${renderSdl3FallbackContext(item)}
      ${renderSdl3SeeAlso(item)}

      ${syntaxBlock ? `
        <section class="signature-section">
          <h2>التصريح البرمجي</h2>
          <div class="code-container">
            ${syntaxBlock}
          </div>
          <div class="content-card prose-card">
            <p>${renderSdl3PracticalText(
              item.kind === 'type'
                ? buildSdl3TypeCodeAppearance(item)
                : item.kind === 'macro'
                  ? buildSdl3MacroPracticalUsage(item)
                  : buildSdl3ActualOperation(item),
              buildSdl3PrimaryMeaning(item)
            )}</p>
          </div>
        </section>
      ` : ''}

      ${renderSdl3ParameterTable(item)}
      ${renderSdl3ParameterUsageExample(item)}
      ${item.kind === 'type' ? renderSdl3StructFields(item) : ''}
      ${item.kind === 'macro' ? renderSdl3MacroDetails(item) : ''}

      ${item.returns ? `
        <section class="info-section">
          <div class="content-card prose-card">
            <h2>قيمة الإرجاع</h2>
            <p>${renderSdl3DocText(item.returns, item, {section: 'returns'})}</p>
          </div>
        </section>
      ` : ''}

      ${item.threadSafety ? `
        <section class="info-section">
          <div class="content-card prose-card">
            <h2>سلامة الخيوط</h2>
            <p>${renderSdl3DocText(item.threadSafety, item, {section: 'threadSafety'})}</p>
          </div>
        </section>
      ` : ''}

      ${renderSdl3ReferenceCallout(item)}
      ${item.kind === 'enum' ? renderSdl3EnumValues(item) : ''}
      ${renderSdl3Remarks(item)}
      ${practicalExampleSection}

      <section class="info-section">
        <div class="content-card prose-card">
          <h2>المصدر الرسمي</h2>
          <p><a class="doc-link" href="${escapeAttribute(item.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.officialUrl)}</a></p>
        </div>
      </section>
      </div>
    `;

    document.title = `${item.name} - SDL3 - ArabicVulkan`;
    populateSdl3PackageKindNavSection(item.packageKey, sectionMeta.dataKey, packageSectionId);
    syncRouteHistory(`${meta.routePrefix}/${encodeURIComponent(item.name)}`, options);
    scrollMainContentToTop();
    highlightCode(content);
    expandAllSdl3NavGroupsInSection(packageSectionId);
    setActiveSidebarItemBySelector(
      packageSectionId,
      `.nav-item[data-nav-type="${meta.navType}"][data-nav-name="${escapeSelectorValue(item.name)}"]`
    );
  }

  function populateSdl3PackageKindNavSection(packageKey, dataKey, sectionId = getSdl3PackageSectionId(packageKey, dataKey)) {
    const container = document.getElementById(sectionId);
    if (!container) {
      return;
    }
    container.querySelectorAll('.nav-constant-group:not(.collapsed)').forEach((group) => {
      rememberSdl3NavGroupState(group, true);
    });
    const parentSection = container.closest('.nav-section');
    const packageCluster = container.closest('.nav-cluster.nav-cluster-sdl3');

    const groups = getSdl3GroupedItems(dataKey, {packageKey});
    const kind = getSdl3CollectionMeta(dataKey);
    const packageInfo = getSdl3PackageInfo(packageKey);
    const compositeName = getSdl3PackageSectionCompositeName(packageKey, dataKey);

    container.innerHTML = `
      <div class="nav-item" data-nav-type="sdl3-package-section-index" data-nav-name="${escapeAttribute(compositeName)}" data-tooltip="${escapeAttribute(`يفتح فهرس ${kind.title} الخاص بمكتبة ${packageInfo?.displayName || packageKey} داخل المشروع.`)}" aria-label="${escapeAttribute(`فهرس ${kind.title} في ${packageInfo?.displayName || packageKey}`)}" tabindex="0" role="button">
        <span>${renderEntityIcon(kind.icon, 'ui-codicon nav-icon', kind.title)}</span>
        <span>فهرس ${escapeHtml(kind.title)}</span>
      </div>
      ${groups.map((group) => renderSdl3LazyNavGroup(group, dataKey, {packageKey})).join('') || `<div class="nav-item">لا توجد ${kind.title} في ${escapeHtml(packageInfo?.displayName || packageKey)}</div>`}
    `;
    if (packageCluster) {
      packageCluster.classList.remove('collapsed');
    }
    if (parentSection) {
      parentSection.classList.remove('collapsed');
    }
    hydrateExpandedSdl3NavGroups(container);
  }

  function populateSdl3EntityNavSection(dataKey, sectionId) {
    const container = document.getElementById(sectionId);
    if (!container) {
      return;
    }

    const groups = getSdl3GroupedItems(dataKey);
    const kind = getSdl3CollectionMeta(dataKey);

    container.innerHTML = `
      <div class="nav-item" data-nav-type="sdl3-section-index" data-nav-name="${escapeAttribute(dataKey)}" data-tooltip="${escapeAttribute(`يفتح فهرس ${kind.title} المحلي الكامل داخل المشروع مع الروابط الداخلية والشرح العربي.`)}" aria-label="${escapeAttribute(`فهرس ${kind.title}`)}" tabindex="0" role="button">
        <span>${renderEntityIcon(kind.icon, 'ui-codicon nav-icon', kind.title)}</span>
        <span>فهرس ${escapeHtml(kind.title)}</span>
      </div>
      ${groups.map((group) => renderSdl3LazyNavGroup(group, dataKey)).join('') || `<div class="nav-item">لا توجد ${kind.title}</div>`}
    `;
  }

  function expandAllSdl3NavGroupsInSection(sectionId) {
    const container = document.getElementById(sectionId);
    if (!container) {
      return;
    }

    container.querySelectorAll('.nav-constant-group').forEach((group) => {
      group.classList.remove('collapsed');
      rememberSdl3NavGroupState(group, true);
    });
    hydrateExpandedSdl3NavGroups(container);
  }

  function renderSdl3ExampleSidebarGroups(packageKey = 'core') {
    const groups = getGroupedSdl3ReadyExamples(packageKey);
    if (!groups.length) {
      return '';
    }

    return groups.map((group) => `
      <div class="nav-constant-group file-nav-group sdl3-example-nav-group collapsed">
        <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
          <span class="nav-constant-group-title-wrap">
            <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
            <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
          </span>
          <span class="nav-constant-group-count">${group.examples.length}</span>
        </div>
        <div class="nav-constant-group-items">
          <div class="nav-group-description">${escapeHtml(group.description)}</div>
          ${group.examples.map((example) => {
            const compositeName = buildSdl3ExampleCompositeName(packageKey, example.id);
            const tooltip = [
              example.title,
              example.goal || example.expectedResult || group.description
            ].filter(Boolean).join('\n');
            return `
              <div class="nav-item" data-nav-type="sdl3-example" data-nav-name="${escapeAttribute(compositeName)}" data-tooltip="${escapeAttribute(tooltip)}" aria-label="${escapeAttribute(`${example.title}: ${tooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
                <span>${renderEntityIcon('command', 'ui-codicon nav-icon', example.title)}</span>
                <span>${escapeHtml(example.title)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderSdl3ExamplesSidebarSection(packageKey = 'core', packageInfo = null) {
    const examplesSectionId = getSdl3PackageSectionId(packageKey, 'examples');
    const isExpanded = sdl3ExpandedPackageSections.has(getSdl3PackageSectionStateKey(packageKey, 'examples'));
    const exampleGroups = getGroupedSdl3ReadyExamples(packageKey);
    const exampleCount = exampleGroups.reduce((total, group) => total + (group.examples?.length || 0), 0);
    const examplesTooltip = `يفتح فهرس الأمثلة العملية الخاصة بـ ${packageInfo?.displayName || packageKey} داخل المشروع.`;
    return `
      <div class="nav-section sdl3-package-kind-section sdl3-examples-sidebar-section${isExpanded ? '' : ' collapsed'}">
        <div class="nav-section-header" onclick="toggleSection('${escapeAttribute(examplesSectionId)}')">
          <h3>${renderEntityIcon('command', 'ui-codicon nav-icon', `أمثلة ${packageInfo?.displayName || packageKey}`)} أمثلة ${escapeHtml(packageInfo?.displayName || packageKey)} <span class="nav-section-inline-count">${exampleCount}</span></h3>
          <span class="icon">▼</span>
        </div>
        <div id="${escapeAttribute(examplesSectionId)}" class="nav-items">
          <div class="nav-item" data-nav-type="sdl3-examples-index" data-nav-name="${escapeAttribute(packageKey)}" data-tooltip="${escapeAttribute(examplesTooltip)}" aria-label="${escapeAttribute(`أمثلة ${packageInfo?.displayName || packageKey}: ${examplesTooltip}`)}" tabindex="0" role="button">
            <span>${renderEntityIcon('command', 'ui-codicon nav-icon', `أمثلة ${packageInfo?.displayName || packageKey}`)}</span>
            <span>أمثلة ${escapeHtml(packageInfo?.displayName || packageKey)}</span>
          </div>
          ${renderSdl3ExampleSidebarGroups(packageKey) || '<div class="nav-item">لا توجد أمثلة</div>'}
        </div>
      </div>
    `;
  }

  function renderSdl3AudioGuideSidebarItem(packageKey = 'core') {
    if (packageKey !== 'audio') {
      return '';
    }

    return `
      <div class="nav-item" data-nav-type="sdl3-audio-guide" data-nav-name="audio-channel-layout-guide" data-tooltip="يفتح صفحة مستقلة تشرح اختصارات القنوات الصوتية وترتيبها داخل الذاكرة في SDL3Audio." aria-label="دليل القنوات الصوتية في SDL3Audio" tabindex="0" role="button">
        <span>${renderEntityIcon('file', 'ui-codicon nav-icon', 'دليل القنوات الصوتية')}</span>
        <span>دليل القنوات الصوتية</span>
      </div>
    `;
  }

  function populateSdl3PackageSidebar(packageKey) {
    const container = document.getElementById(getSdl3PackageListId(packageKey));
    if (!container) {
      return;
    }

    const packageInfo = getSdl3PackageInfo(packageKey);
    if (!packageInfo) {
      container.innerHTML = '';
      return;
    }

    const hasLoadedSidebarKinds = ['functions', 'macros', 'constants', 'variables', 'structures']
      .some((dataKey) => window.isSdl3PackageKindDataLoaded?.(packageKey, dataKey));

    if (!window.isSdl3PackageDataLoaded?.(packageKey) && !hasLoadedSidebarKinds) {
      const declaredCounts = packageInfo.counts || {};
      const packageTooltip = [
        packageInfo.displayName,
        packageInfo.description || '',
        `الدوال: ${declaredCounts.functions || 0}`,
        `الأنواع: ${declaredCounts.types || 0}`,
        `الثوابت: ${declaredCounts.constants || 0}`,
        `الماكرو: ${declaredCounts.macros || 0}`,
        declaredCounts.enums ? `التعدادات المرجعية: ${declaredCounts.enums}` : '',
        'تُحمَّل الأقسام التفصيلية عند فتح هذه الحزمة لتخفيف نقل البيانات المؤجلة.'
      ].filter(Boolean).join('\n');

      container.innerHTML = `
        <div class="nav-item" data-nav-type="sdl3-package-index" data-nav-name="${escapeAttribute(packageKey)}" data-tooltip="${escapeAttribute(packageTooltip)}" aria-label="${escapeAttribute(`${packageInfo.displayName}: ${packageTooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
          <span>${renderEntityIcon('sdl3', 'ui-codicon nav-icon', packageInfo.displayName)}</span>
          <span>واجهة ${escapeHtml(packageInfo.displayName)}</span>
        </div>
        ${renderSdl3AudioGuideSidebarItem(packageKey)}
        <div class="nav-item nav-item-static">تُحمَّل أقسام ${escapeHtml(packageInfo.displayName)} عند فتح الحزمة أو أحد عناصرها.</div>
        ${renderSdl3ExamplesSidebarSection(packageKey, packageInfo)}
      `;
      return;
    }

    const declaredCounts = packageInfo.counts || {};
    const getDeclaredFallbackCount = (dataKey) => {
      if (dataKey === 'variables' || dataKey === 'structures') {
        return declaredCounts.types || 0;
      }
      return declaredCounts[dataKey] || 0;
    };

    const hasLoadedPackageData = !!window.isSdl3PackageDataLoaded?.(packageKey);
    const packageKinds = ['functions', 'macros', 'constants', 'variables', 'structures']
      .map((dataKey) => getSdl3CollectionMeta(dataKey))
      .filter((meta) => {
        const runtimeCount = getSdl3PackageItems(packageKey, meta.dataKey).length;
        if (hasLoadedPackageData) {
          return runtimeCount > 0;
        }
        return runtimeCount > 0 || getDeclaredFallbackCount(meta.dataKey) > 0;
      });
    const visibleTotal = getSdl3PackageTotalCount(packageKey, {visibleOnly: true});
    const enumCount = getSdl3PackageItems(packageKey, 'enums').length;
    const packageTooltip = [
      packageInfo.displayName,
      packageInfo.description || '',
      `المجموع الظاهر: ${visibleTotal} عنصر`,
      `الدوال: ${getSdl3PackageItems(packageKey, 'functions').length}`,
      `الماكرو: ${getSdl3PackageItems(packageKey, 'macros').length}`,
      `الثوابت: ${getSdl3PackageItems(packageKey, 'constants').length}`,
      `المتغيرات: ${getSdl3PackageItems(packageKey, 'variables').length}`,
      `البنى: ${getSdl3PackageItems(packageKey, 'structures').length}`,
      enumCount ? `التعدادات المرجعية: ${enumCount}` : ''
    ].filter(Boolean).join('\n');

    const packageSectionsHtml = packageKinds.map((meta) => {
      const sectionId = getSdl3PackageSectionId(packageKey, meta.dataKey);
      const runtimeCount = getSdl3PackageItems(packageKey, meta.dataKey).length;
      const count = hasLoadedPackageData ? runtimeCount : (runtimeCount || getDeclaredFallbackCount(meta.dataKey));
      const isExpanded = sdl3ExpandedPackageSections.has(getSdl3PackageSectionStateKey(packageKey, meta.dataKey));
      return `
        <div class="nav-section${isExpanded ? '' : ' collapsed'} sdl3-package-kind-section">
          <div class="nav-section-header" onclick="toggleSdl3PackageKindSection('${escapeAttribute(packageKey)}', '${escapeAttribute(meta.dataKey)}', '${escapeAttribute(sectionId)}')">
            <h3>${renderEntityIcon(meta.icon, 'ui-codicon nav-icon', meta.title)} ${escapeHtml(meta.title)} <span class="nav-section-inline-count">${count}</span></h3>
            <span class="icon">▼</span>
          </div>
          <div id="${sectionId}" class="nav-items"></div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="nav-item" data-nav-type="sdl3-package-index" data-nav-name="${escapeAttribute(packageKey)}" data-tooltip="${escapeAttribute(packageTooltip)}" aria-label="${escapeAttribute(`${packageInfo.displayName}: ${packageTooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
        <span>${renderEntityIcon('sdl3', 'ui-codicon nav-icon', packageInfo.displayName)}</span>
        <span>واجهة ${escapeHtml(packageInfo.displayName)}</span>
      </div>
      ${renderSdl3AudioGuideSidebarItem(packageKey)}
      ${packageSectionsHtml || `<div class="nav-item">لا توجد عناصر محلية في ${escapeHtml(packageInfo.displayName)}</div>`}
      ${renderSdl3ExamplesSidebarSection(packageKey, packageInfo)}
    `;

    packageKinds.forEach((meta) => {
      if (!sdl3ExpandedPackageSections.has(getSdl3PackageSectionStateKey(packageKey, meta.dataKey))) {
        return;
      }
      populateSdl3PackageKindNavSection(packageKey, meta.dataKey, getSdl3PackageSectionId(packageKey, meta.dataKey));
    });
  }

  function populateSdl3List() {
    getSdl3VisiblePackageKeys().forEach((packageKey) => {
      populateSdl3PackageSidebar(packageKey);
    });
  }

  function expandAllSdl3Clusters() {
    getSdl3VisiblePackageKeys().forEach((packageKey) => {
      document.getElementById(getSdl3PackageClusterId(packageKey))?.classList.remove('collapsed');
    });
  }

  async function showSdl3SectionIndex(dataKey, options = {}) {
    await ensureSdl3SectionData(dataKey);
    populateSdl3List();

    const content = document.getElementById('mainContent');
    const kind = getSdl3CollectionMeta(dataKey);
    const groups = getSdl3GroupedItems(dataKey);
    const total = getSdl3EntityItems(dataKey).length;
    const packageBreakdown = getSdl3PackageBreakdown(dataKey);
    const groupsContainerId = `sdl3-index-groups-${dataKey}`;
    const sectionNote = dataKey === 'variables'
      ? 'هذا المسار يضم typedefs والمعرفات ومؤشرات الدوال والأنواع الخفيفة غير البنائية.'
      : dataKey === 'structures'
        ? 'هذا المسار يضم البنى والهياكل التي تمثل حاويات بيانات أو كائنات SDL3 المهيكلة.'
        : 'كل عنصر هنا يفتح محليًا داخل المشروع مع روابط داخلية وشرح عربي.';

    content.innerHTML = `
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
          <span>${escapeHtml(kind.title)}</span>
        </nav>
        <h1>${renderEntityIcon(kind.icon, 'ui-codicon page-icon', kind.title)} ${escapeHtml(kind.title)}</h1>
        <p>فهرس محلي كامل يضم ${total} عنصرًا من ${kind.title} في SDL3 وملحقاته، مع روابط داخلية وشرح عربي في tooltip.</p>
      </div>
      <section class="info-section">
        ${renderSdl3InfoGrid([
          {
            label: 'عدد العناصر',
            value: `${total} عنصر`,
            note: `مرتبة ضمن ${groups.length} مجموعات بحسب الحزمة أو التعداد الأب أو التصنيف المحلي.`
          },
          {
            label: 'أسلوب العرض',
            value: 'روابط محلية كاملة',
            note: sectionNote
          }
        ])}
      </section>
      ${packageBreakdown.length ? `
        <section class="info-section">
          ${renderSdl3InfoGrid(packageBreakdown.map((pkg) => ({
            label: pkg.title,
            value: renderSdl3PackageSectionLink(pkg.key, dataKey, `${pkg.count} عنصر`),
            note: `يعرض هذا الفرع عناصر ${kind.title} الخاصة بـ ${pkg.title} فقط عبر روابط محلية تحمل أيقونات وtooltip.`
          })))}
        </section>
      ` : ''}
      <section class="info-section">
        <div class="content-card prose-card">
          <p>تُرسم مجموعات هذا الفهرس تدريجيًا حتى يبقى الانتقال داخل SDL3 أسرع، خاصة في الأقسام الكبيرة.</p>
        </div>
      </section>
      <div id="${groupsContainerId}"></div>
    `;

    renderSdl3IndexGroupsProgressively(document.getElementById(groupsContainerId), groups);

    document.title = `${kind.title} - SDL3 - ArabicVulkan`;
    syncRouteHistory(kind.indexRoute, options);
    scrollMainContentToTop();
    clearActiveSidebarItems();
    collapseAllSidebarSections();
    expandAllSdl3Clusters();
  }

  async function showSdl3PackageIndex(packageKey, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3PackageKindData(packageKey, 'types');
    populateSdl3List();

    const packageInfo = getSdl3PackageInfo(packageKey);
    if (!packageInfo) {
      return showSdl3Index(options);
    }

    const content = document.getElementById('mainContent');
    const declaredCounts = packageInfo.counts || {};
    const getPackageCount = (dataKey) => {
      const runtimeCount = getSdl3PackageItems(packageKey, dataKey).length;
      if (runtimeCount > 0) {
        return runtimeCount;
      }
      return Number(declaredCounts?.[dataKey]) || 0;
    };
    const variableCount = getSdl3PackageItems(packageKey, 'variables').length;
    const structureCount = getSdl3PackageItems(packageKey, 'structures').length;
    const kinds = [
      {dataKey: 'functions', title: getSdl3CollectionMeta('functions').title, icon: getSdl3CollectionMeta('functions').icon, count: getPackageCount('functions')},
      {dataKey: 'macros', title: getSdl3CollectionMeta('macros').title, icon: getSdl3CollectionMeta('macros').icon, count: getPackageCount('macros')},
      {dataKey: 'constants', title: getSdl3CollectionMeta('constants').title, icon: getSdl3CollectionMeta('constants').icon, count: getPackageCount('constants')},
      {dataKey: 'variables', title: getSdl3CollectionMeta('variables').title, icon: getSdl3CollectionMeta('variables').icon, count: variableCount},
      {dataKey: 'structures', title: getSdl3CollectionMeta('structures').title, icon: getSdl3CollectionMeta('structures').icon, count: structureCount}
    ].filter((entry) => entry.count > 0);
    const enumCount = declaredCounts.enums || 0;

    content.innerHTML = `
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
          <span>${escapeHtml(packageInfo.displayName)}</span>
        </nav>
        <h1>${renderEntityIcon('sdl3', 'ui-codicon page-icon', packageInfo.displayName)} ${escapeHtml(packageInfo.displayName)}</h1>
        <p>${escapeHtml(packageInfo.description || '')}</p>
      </div>

      <section class="info-section">
        ${renderSdl3InfoGrid(kinds.map((meta) => ({
          label: meta.title,
          value: renderSdl3PackageSectionLink(packageKey, meta.dataKey, `${meta.count} عنصر`),
          note: buildSdl3PackageSectionReason(packageKey, meta.dataKey)
        })))}
      </section>
      ${enumCount ? `
        <section class="info-section">
          <div class="content-card prose-card">
            <h2>التعدادات المرجعية</h2>
            <p>يوجد ${enumCount} تعدادًا في ${escapeHtml(packageInfo.displayName)}. تبقى صفحاتها المحلية فعالة عبر الروابط الداخلية ومن صفحات الثوابت المرتبطة بها.</p>
          </div>
        </section>
      ` : ''}

      <section class="category-section">
        <h2>الأقسام داخل ${escapeHtml(packageInfo.displayName)}</h2>
        <div class="info-grid">
          ${kinds.map((meta) => `
            <div class="content-card prose-card">
              <div class="info-label">${renderEntityIcon(meta.icon, 'ui-codicon nav-icon', meta.title)} ${escapeHtml(meta.title)}</div>
              <div class="info-value">
                ${renderSdl3PackageSectionLink(packageKey, meta.dataKey, `${meta.count} عنصر`)}
              </div>
              <p>${renderSdl3PracticalText(buildSdl3PackageSectionReason(packageKey, meta.dataKey), buildSdl3PackageSectionReason(packageKey, meta.dataKey))}</p>
            </div>
          `).join('')}
        </div>
      </section>

      ${renderSdl3ExamplesPreviewSection(packageKey, {
        limit: 3,
        randomize: true,
        sectionId: `sdl3-package-${escapeAttribute(packageKey)}-examples`
      })}
    `;

    document.title = `${packageInfo.displayName} - SDL3 - ArabicVulkan`;
    syncRouteHistory(`sdl3-package/${encodeURIComponent(packageKey)}`, options);
    scrollMainContentToTop();
    setActiveSidebarItemBySelector(
      getSdl3PackageListId(packageKey),
      `.nav-item[data-nav-type="sdl3-package-index"][data-nav-name="${escapeSelectorValue(packageKey)}"]`
    );
  }

  async function showSdl3PackageSectionIndex(packageKey, dataKey, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3PackageKindData(packageKey, dataKey);
    populateSdl3List();

    const packageInfo = getSdl3PackageInfo(packageKey);
    if (!packageInfo) {
      return showSdl3SectionIndex(dataKey, options);
    }

    const kind = getSdl3CollectionMeta(dataKey);
    const packageItems = getSdl3PackageItems(packageKey, dataKey);
    const fallbackGroups = packageItems.length ? [{
      key: `${packageKey}:${dataKey}:fallback`,
      title: packageInfo.displayName,
      items: packageItems
    }] : [];
    const groups = getSdl3GroupedItems(dataKey, {packageKey}).length
      ? getSdl3GroupedItems(dataKey, {packageKey})
      : fallbackGroups;
    const total = packageItems.length;
    const content = document.getElementById('mainContent');
    const sectionId = getSdl3PackageSectionId(packageKey, dataKey);
    const compositeName = getSdl3PackageSectionCompositeName(packageKey, dataKey);
    const groupsContainerId = `sdl3-package-groups-${packageKey}-${dataKey}`;

    content.innerHTML = `
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
          <a href="#" onclick="showSdl3PackageIndex('${escapeAttribute(packageKey)}'); return false;">${escapeHtml(packageInfo.displayName)}</a> /
          <span>${escapeHtml(kind.title)}</span>
        </nav>
        <h1>${renderEntityIcon(kind.icon, 'ui-codicon page-icon', kind.title)} ${escapeHtml(kind.title)} | ${escapeHtml(packageInfo.displayName)}</h1>
        <p>فهرس محلي مستقل يضم ${total} عنصرًا من ${kind.title} ضمن ${escapeHtml(packageInfo.displayName)} فقط.</p>
      </div>
      <section class="info-section">
        ${renderSdl3InfoGrid([
          {
            label: 'عدد العناصر',
            value: `${total} عنصر`,
            note: `مرتبة ضمن ${groups.length} مجموعات فرعية داخل ${packageInfo.displayName}.`
          },
          {
            label: 'أسلوب الفرز',
            value: 'بحسب المكتبة ثم القسم الفرعي',
            note: 'كل فرع في القائمة الجانبية يعرض عناصر هذه المكتبة فقط.'
          }
        ])}
      </section>
      <section class="info-section">
        <div class="content-card prose-card">
          <p>تُعرض مجموعات هذا الفرع تدريجيًا حتى يبقى فتح أقسام SDL3 الكبيرة أسرع داخل المتصفح.</p>
        </div>
      </section>
      <div id="${groupsContainerId}"></div>
    `;

    renderSdl3IndexGroupsProgressively(document.getElementById(groupsContainerId), groups, {
      eyebrow: `داخل ${packageInfo.displayName}`
    });

    document.title = `${kind.title} - ${packageInfo.displayName} - ArabicVulkan`;
    populateSdl3PackageKindNavSection(packageKey, dataKey, sectionId);
    syncRouteHistory(`sdl3-package-section/${encodeURIComponent(compositeName)}`, options);
    scrollMainContentToTop();
    setActiveSidebarItemBySelector(
      sectionId,
      `.nav-item[data-nav-type="sdl3-package-section-index"][data-nav-name="${escapeSelectorValue(compositeName)}"]`
    );
  }

  async function showSdl3HeaderFile(header, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3PackageData(inferSdl3PackageKeyFromHeader(header));
    populateSdl3List();

    const normalized = normalizeSdl3HeaderFile(header);
    const display = formatSdl3HeaderFileDisplay(header);
    const items = getSdl3HeaderFileItems(header);
    const groups = getSdl3HeaderFileSectionGroups(header);
    const packageKey = items[0]?.packageKey || inferSdl3PackageKeyFromHeader(header);
    const packageInfo = getSdl3PackageInfo(packageKey);
    const content = document.getElementById('mainContent');

    if (!normalized || !content) {
      return;
    }

    content.innerHTML = `
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
          <span>ملفات الترويسة</span> /
          <span>${escapeHtml(display)}</span>
        </nav>
        <h1>${renderEntityIcon('file', 'ui-codicon page-icon', display)} <code dir="ltr">${escapeHtml(display)}</code></h1>
        <p>${escapeHtml(buildSdl3HeaderFileTooltip(header, items[0] || {packageKey, packageDisplayName: packageInfo?.displayName}).split('\n')[1] || 'ملف الترويسة الرسمي المرتبط بهذا الجزء من SDL3.')}</p>
      </div>

      <section class="info-section">
        ${renderSdl3InfoGrid([
          {
            label: 'الحزمة',
            value: packageInfo ? renderSdl3PackageLink(packageKey, packageInfo.displayName) : '—',
            note: packageInfo?.description || 'هذا المسار يتبع الحزمة التي تعرّف هذا الهيدر داخل SDL3 أو إحدى ملحقاته.'
          },
          {
            label: 'عدد العناصر المرتبطة',
            value: `${items.length} عنصر`,
            note: items.length ? 'هذه العناصر تعرّفها أو تصرح بها هذه الترويسة مباشرة في البيانات المحلية الحالية.' : 'لا توجد عناصر محلية مرتبطة بهذا الهيدر في البيانات الحالية.'
          }
        ])}
      </section>

      ${groups.map((group) => renderSdl3IndexGroupSection({
        title: group.meta.title,
        items: group.items
      }, {
        eyebrow: `داخل ${display}`
      })).join('')}
    `;

    document.title = `${display} - SDL3 Header - ArabicVulkan`;
    syncRouteHistory(`sdl3-header/${encodeURIComponent(normalized)}`, options);
    scrollMainContentToTop();
    clearActiveSidebarItems();
    expandAllSdl3Clusters();
  }

  async function showSdl3Function(name, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3EntityDetailData('function', name);
    populateSdl3List();
    let item = findSdl3ItemByKind('function', name);
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3ItemByKind('function', name);
    }
    if (!item) {
      return showSdl3Reference(name, options);
    }
    renderSdl3EntityPage(item, options);
  }

  async function showSdl3Type(name, options = {}) {
    await ensureUiSegment('sdl3');
    const packageKey = inferSdl3PackageKeyFromSymbolName(name);
    if (packageKey === 'core') {
      await ensureSdl3PackageKindData('core', 'types');
    } else {
      await ensureSdl3PackageData(packageKey);
    }
    populateSdl3List();
    let item = findSdl3ItemByKind('type', name);
    if (item?.packageKey === 'core') {
      const extraLoads = [];
      if (isSdl3FlagType(item)) {
        extraLoads.push(
          ensureSdl3PackageKindData('core', 'constants'),
          ensureSdl3PackageKindData('core', 'enums')
        );
      } else {
        extraLoads.push(
          ensureUiSegment('sdl3CoreFunctionRelations'),
          ensureUiSegment('sdl3CoreSymbolIndex')
        );
      }
      if (extraLoads.length) {
        await Promise.all(extraLoads);
      }
    }
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3ItemByKind('type', name);
    }
    if (!item) {
      return showSdl3Reference(name, options);
    }
    renderSdl3EntityPage(item, options);
  }

  async function showSdl3Enum(name, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3EntityDetailData('enum', name);
    populateSdl3List();
    let item = findSdl3ItemByKind('enum', name);
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3ItemByKind('enum', name);
    }
    if (!item) {
      return showSdl3Reference(name, options);
    }
    renderSdl3EntityPage(item, options);
  }

  async function showSdl3Macro(name, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3EntityDetailData('macro', name);
    populateSdl3List();
    let item = findSdl3ItemByKind('macro', name);
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3ItemByKind('macro', name);
    }
    if (!item) {
      return showSdl3Reference(name, options);
    }
    renderSdl3EntityPage(item, options);
  }

  async function showSdl3Constant(name, options = {}) {
    await ensureUiSegment('sdl3');
    await ensureSdl3EntityDetailData('constant', name);
    populateSdl3List();
    let item = findSdl3ItemByKind('constant', name);
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3ItemByKind('constant', name);
    }
    const content = document.getElementById('mainContent');

    if (!item) {
      if (content) {
        content.innerHTML = `
          <div class="page-header">
            <h1>${renderEntityIcon('constant', 'ui-codicon page-icon', 'ثابت')} ${escapeHtml(name)}</h1>
            <p>لا توجد قيمة ثابتة محلية بهذا الاسم داخل مرجع SDL3 الحالي.</p>
          </div>
        `;
      }
      return;
    }

    await showSdl3Enum(item.parentEnum, {...options, skipHistory: true});
    const constantSectionId = getSdl3PackageSectionId(item.packageKey, getSdl3KindMeta('constant').dataKey);
    populateSdl3PackageKindNavSection(item.packageKey, getSdl3KindMeta('constant').dataKey, constantSectionId);
    syncRouteHistory(`sdl3-constant/${encodeURIComponent(item.name)}`, options);
    document.title = `${item.name} - SDL3 Constant - ArabicVulkan`;
    setActiveSidebarItemBySelector(
      constantSectionId,
      `.nav-item[data-nav-type="${getSdl3KindMeta('constant').navType}"][data-nav-name="${escapeSelectorValue(item.name)}"]`
    );
    setTimeout(() => {
      scrollToAnchor(getSdl3ConstantAnchorId(item.name));
    }, 30);
  }

  async function showSdl3Reference(name, options = {}) {
    await ensureUiSegment('sdl3');
    populateSdl3List();

    let item = findSdl3AnyItemByName(name);
    if (!item && inferSdl3PackageKeyFromSymbolName(name) === 'core') {
      await ensureUiSegment('sdl3CoreSymbolIndex');
      item = findSdl3CoreSymbolSeedByName(name);
    }
    if (!item) {
      await ensureSdl3PackageData(inferSdl3PackageKeyFromSymbolName(name));
      item = findSdl3AnyItemByName(name);
    }
    if (!item) {
      await ensureAllSdl3PackageData();
      item = findSdl3AnyItemByName(name);
      if (!item && inferSdl3PackageKeyFromSymbolName(name) === 'core') {
        item = findSdl3CoreSymbolSeedByName(name);
      }
    }
    if (!item) {
      const content = document.getElementById('mainContent');
      if (content) {
        content.innerHTML = `
          <div class="page-header">
            <h1>${renderEntityIcon('sdl3', 'ui-codicon page-icon', 'SDL3')} ${escapeHtml(name)}</h1>
            <p>لا توجد صفحة محلية لهذا العنصر من SDL3 حالياً.</p>
          </div>
        `;
      }
      return;
    }

    switch (item.kind) {
      case 'function':
        return showSdl3Function(item.name, options);
      case 'enum':
        return showSdl3Enum(item.name, options);
      case 'constant':
        return showSdl3Constant(item.name, options);
      case 'macro':
        return showSdl3Macro(item.name, options);
      case 'type':
      default:
        return showSdl3Type(item.name, options);
    }
  }

  async function showSdl3Index(options = {}) {
    await ensureUiSegment('sdl3');
    populateSdl3List();

    const content = document.getElementById('mainContent');
    const packageKeys = getSdl3VisiblePackageKeys();

    content.innerHTML = `
      <div class="page-header">
        <h1>${renderEntityIcon('sdl3', 'ui-codicon page-icon', 'SDL3')} مرجع SDL3</h1>
        <p>مرجع محلي موسع مقسّم إلى أربعة فروع رئيسية مستقلة: SDL3 وSDL3_image وSDL3_mixer وSDL3_ttf، وكل فرع يحمل دواله وماكروه وثوابته ومتغيراته وبناه داخل المشروع.</p>
      </div>

      <section class="category-section">
        <h2>الفروع الرئيسية</h2>
        <div class="info-grid">
          ${packageKeys.map((packageKey) => {
            const pkg = getSdl3PackageInfo(packageKey);
            const declaredCounts = pkg?.counts || {};
            const sections = [
              {dataKey: 'functions', title: 'الدوال', count: declaredCounts.functions || 0},
              {dataKey: 'macros', title: 'الماكرو', count: declaredCounts.macros || 0},
              {dataKey: 'constants', title: 'الثوابت', count: declaredCounts.constants || 0},
              {dataKey: 'types', title: 'الأنواع والتعاريف', count: declaredCounts.types || 0},
              {dataKey: 'enums', title: 'التعدادات المرجعية', count: declaredCounts.enums || 0}
            ].filter((entry) => entry.count > 0);
            const enumCount = declaredCounts.enums || 0;
            return `
              <div class="content-card prose-card">
                <div class="info-label">${renderEntityIcon('sdl3', 'ui-codicon nav-icon', pkg.displayName)} ${escapeHtml(pkg.displayName)}</div>
                <div class="info-value">
                  ${renderSdl3PackageLink(packageKey, `افتح ${pkg.displayName}`)}
                </div>
                <p>${escapeHtml(pkg.description || '')}</p>
                <div class="see-also-links">
                  ${sections.map((entry) => entry.dataKey === 'types'
                    ? renderSdl3PackageLink(packageKey, `${entry.title} (${entry.count})`)
                    : renderSdl3PackageSectionLink(packageKey, entry.dataKey, `${entry.title} (${entry.count})`)
                  ).join('')}
                </div>
                ${enumCount ? `<p>التعدادات المرجعية المتاحة عبر الروابط الداخلية: ${enumCount}</p>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>

      ${renderSdl3ExamplesPreviewSection('core', {
        limit: 3,
        randomize: true,
        sectionId: 'sdl3-core-examples'
      })}
    `;

    document.title = 'مرجع SDL3 - ArabicVulkan';
    syncRouteHistory('sdl3-index', options);
    scrollMainContentToTop();
    clearActiveSidebarItems();
    collapseAllSidebarSections();
    expandAllSdl3Clusters();
  }

  const runtime = {
    configure,
    renderSdl3EntityPage,
    populateSdl3PackageKindNavSection,
    populateSdl3EntityNavSection,
    renderSdl3ExampleSidebarGroups,
    populateSdl3PackageSidebar,
    populateSdl3List,
    expandAllSdl3Clusters,
    showSdl3SectionIndex,
    showSdl3PackageIndex,
    showSdl3PackageSectionIndex,
    showSdl3HeaderFile,
    showSdl3Function,
    showSdl3Type,
    showSdl3Enum,
    showSdl3Macro,
    showSdl3Constant,
    showSdl3Reference,
    showSdl3Index
  };

  Object.assign(window, runtime);
  return Object.freeze(runtime);
})();
