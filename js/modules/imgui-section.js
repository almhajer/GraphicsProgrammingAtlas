window.__ARABIC_VULKAN_IMGUI_SECTION__ = (() => {
  const {
    collapseAllSidebarClusters = () => {},
    collapseAllSidebarNavGroups = () => {},
    collapseAllSidebarSections = () => {},
    imguiExpandedExampleGroups = new Set(),
    imguiExpandedReferenceSections = new Set()
  } = window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ || {};

  const api = {
    getImguiReferenceSections: () => ({}),
    getImguiMeta: () => ({}),
    getImguiFallbackMeta: () => ({}),
    isImguiLoaded: () => false
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function finalizeImguiRenderedContent(content) {
    if (!content) {
      return;
    }

    window.scheduleProseCardReferenceLinking?.(content);
    window.highlightCode?.(content, {immediate: true});
  }

  function populateImguiList() {
    const container = document.getElementById('imgui-list');
    if (!container) {
      return;
    }

    const imguiReferenceSections = api.getImguiReferenceSections() || {};
    const exampleGroups = getGroupedImguiExampleItems();
    const exampleGroupsHtml = exampleGroups.map((group) => {
      const isExpanded = imguiExpandedExampleGroups.has(group.key);
      return `
        <div class="nav-constant-group file-nav-group imgui-example-nav-group${isExpanded ? '' : ' collapsed'}" data-imgui-example-group="${escapeAttribute(group.key)}">
          <div class="nav-constant-group-header" onclick="toggleImguiExampleGroup('${escapeAttribute(group.key)}')">
            <span class="nav-constant-group-title-wrap">
              <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
              <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
            </span>
            <span class="nav-constant-group-count">${group.items.length}</span>
          </div>
          <div class="nav-constant-group-items">
            <div class="nav-group-description">${escapeHtml(group.note)}</div>
            ${group.items.map((item) => {
              const tooltip = window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
                ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
                  title: item.name,
                  kindLabel: 'مثال Dear ImGui',
                  typeLabel: item.kind || 'مثال واجهة',
                  library: 'Dear ImGui',
                  meaning: item.usageExample?.scenario || item.shortTooltip || item.description || '',
                  whyExists: 'وُجد هذا المثال لأنه يبيّن كيف يترجم العنصر أو النمط إلى واجهة تفاعلية فعلية داخل الإطار.',
                  whyUse: item.usageExample?.explanation || item.shortTooltip || '',
                  actualUsage: item.description || item.usageExample?.scenario || ''
                })
                : [
                  item.name,
                  item.usageExample?.scenario || item.shortTooltip || item.description || ''
                ].filter(Boolean).join('\n');
              return `
                <div class="nav-item" data-nav-type="imgui-example" data-nav-name="${escapeAttribute(item.name)}" data-tooltip="${escapeAttribute(tooltip)}" aria-label="${escapeAttribute(`${item.name}: ${tooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
                  <span>${renderEntityIcon(getImguiKindMeta(item.kind || 'type').icon, 'ui-codicon nav-icon', item.name)}</span>
                  <span>${escapeHtml(item.name)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    let html = `
      <div class="nav-item" data-nav-type="imgui-index" data-nav-name="imgui-index" data-tooltip="${escapeAttribute('يفتح الفهرس المحلي الكامل لقسم Dear ImGui داخل المشروع.')}" tabindex="0" role="button">
        <span>${renderEntityIcon('imgui', 'ui-codicon nav-icon', 'Dear ImGui')}</span>
        <span>فهرس Dear ImGui</span>
      </div>
    `;

    Object.entries(imguiReferenceSections).forEach(([sectionKey, section]) => {
      const sectionId = getImguiReferenceSectionId(sectionKey);
      const isExpanded = imguiExpandedReferenceSections.has(sectionKey);
      const count = Array.isArray(section.items) ? section.items.length : 0;
      html += `
        <div class="nav-section sdl3-package-kind-section imgui-reference-kind-section${isExpanded ? '' : ' collapsed'}">
          <div class="nav-section-header" onclick="toggleImguiReferenceSection('${escapeAttribute(sectionKey)}', '${escapeAttribute(sectionId)}')">
            <h3>${renderEntityIcon(getImguiSectionIcon(sectionKey), 'ui-codicon nav-icon', section.title || 'قسم Dear ImGui')} ${escapeHtml(section.title || 'قسم Dear ImGui')} <span class="nav-section-inline-count">${count}</span></h3>
            <span class="icon">▼</span>
          </div>
          <div id="${sectionId}" class="nav-items">
            ${renderImguiSectionNavItems(sectionKey, section)}
          </div>
        </div>
      `;
    });

    const examplesSectionId = getImguiReferenceSectionId('examples');
    const isExamplesExpanded = imguiExpandedReferenceSections.has('examples');
    const exampleCount = exampleGroups.reduce((total, group) => total + group.items.length, 0);
    html += `
      <div class="nav-section sdl3-package-kind-section imgui-reference-kind-section imgui-examples-sidebar-section${isExamplesExpanded ? '' : ' collapsed'}">
        <div class="nav-section-header" onclick="toggleImguiReferenceSection('examples', '${escapeAttribute(examplesSectionId)}')">
          <h3>${renderEntityIcon('command', 'ui-codicon nav-icon', 'أمثلة Dear ImGui')} أمثلة Dear ImGui <span class="nav-section-inline-count">${exampleCount}</span></h3>
          <span class="icon">▼</span>
        </div>
        <div id="${examplesSectionId}" class="nav-items">
          <div class="nav-item" data-nav-type="imgui-examples-index" data-nav-name="imgui-examples" data-tooltip="${escapeAttribute('يفتح فهرس الأمثلة العملية المستقلة الخاصة بـ Dear ImGui داخل المشروع.')}" tabindex="0" role="button">
            <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'ImGui Examples')}</span>
            <span>أمثلة Dear ImGui</span>
          </div>
          ${exampleGroupsHtml || '<div class="nav-item">لا توجد أمثلة</div>'}
        </div>
      </div>
    `;

    container.innerHTML = html || '<div class="nav-item">لا توجد عناصر Dear ImGui</div>';
  }

  function toggleImguiExampleGroup(groupKey) {
    const normalizedGroupKey = String(groupKey || '').trim();
    if (!normalizedGroupKey) {
      return;
    }

    const group = document.querySelector(`.imgui-example-nav-group[data-imgui-example-group="${escapeSelectorValue(normalizedGroupKey)}"]`);
    if (!group) {
      return;
    }

    const willExpand = group.classList.contains('collapsed');
    if (!willExpand) {
      collapseAllSidebarNavGroups();
      return;
    }

    collapseAllSidebarNavGroups(group);
    group.classList.remove('collapsed');
    imguiExpandedExampleGroups.add(normalizedGroupKey);
  }

  async function showImguiReference(name, options = {}) {
    await ensureUiSegment('imgui');
    populateImguiList();

    const imguiMeta = api.getImguiMeta() || {};
    const fallbackMeta = api.getImguiFallbackMeta() || {};
    const item = getImguiReferenceItem(name);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!item) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${renderEntityIcon('imgui', 'ui-codicon page-icon', 'Dear ImGui')} ${escapeHtml(name)}</h1>
          <p>لا توجد صفحة محلية لهذا العنصر من Dear ImGui حالياً.</p>
        </div>
      `;
      return;
    }

    const kindMeta = getImguiKindMeta(item.kind);
    const example = resolveImguiPracticalExample(item);
    const exampleShot = example ? renderImguiExampleShot(item, example) : '';
    const hasExampleShot = Boolean(exampleShot);

    const pageHeaderLayout = hasExampleShot
      ? `<section class="vulkan-example-hero imgui-reference-hero">
          <div class="vulkan-example-page-header-preview">
            ${exampleShot}
          </div>
          <div class="page-header vulkan-example-page-header">
            <nav class="breadcrumb">
              <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
              <a href="#" onclick="showImguiIndex(); return false;">مرجع Dear ImGui</a> /
              <span>${escapeHtml(item.sectionTitle || '')}</span> /
              <span>${escapeHtml(item.name)}</span>
            </nav>
            <div class="vulkan-example-page-header-copy">
              <h1>${renderEntityIcon(kindMeta.icon, 'ui-codicon page-icon', item.name)} ${escapeHtml(item.name)}</h1>
              <p>${renderImguiDocText(item.description || item.officialArabicDescription || '')}</p>
            </div>
          </div>
        </section>`
      : `<div class="page-header">
          <nav class="breadcrumb">
            <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
            <a href="#" onclick="showImguiIndex(); return false;">مرجع Dear ImGui</a> /
            <span>${escapeHtml(item.sectionTitle || '')}</span> /
            <span>${escapeHtml(item.name)}</span>
          </nav>
          <h1>${renderEntityIcon(kindMeta.icon, 'ui-codicon page-icon', item.name)} ${escapeHtml(item.name)}</h1>
          <p>${renderImguiDocText(item.description || item.officialArabicDescription || '')}</p>
        </div>`;

    content.innerHTML = `
      <div class="reference-unified-detail-page imgui-reference-detail-page">
      ${pageHeaderLayout}

      <section class="info-section">
        ${renderSdl3InfoGrid([
          {label: 'الوصف الرسمي بالعربية', value: renderImguiDocText(item.officialArabicDescription || ''), note: ''},
          {label: 'القسم', value: escapeHtml(item.sectionTitle || ''), note: `نوع هذا العنصر: ${kindMeta.label}`},
          {label: 'Tooltip مختصر', value: renderImguiDocText(item.shortTooltip || ''), note: 'هذا هو التعريف السريع الذي يظهر في الروابط الداخلية والقائمة الجانبية.'}
        ])}
      </section>

      ${renderImguiCoreMeaningSection(item)}
      ${renderImguiIntegrationRolesSection(item)}
      ${renderImguiHeaderFilesSection(item)}
      ${renderImguiBackendFilesSection(item)}
      ${renderImguiSetupStepsSection(item)}
      ${renderImguiSignature(item)}
      ${renderImguiParametersSection(item)}
      ${renderImguiParameterExampleSection(item)}
      ${renderImguiReturnSection(item)}
      ${renderImguiUsageExampleSection(item)}
      ${renderImguiFrameSimulationSection(item)}
      ${renderImguiExecutionMapSection(item)}
      ${renderImguiLifecycleSection(item)}
      ${renderImguiContextConstantsSection(item)}
      ${renderImguiValuesSection(item)}
      ${renderImguiRelatedSection(item)}
      ${renderImguiInstructionsSection(item)}
      ${renderImguiThreadSafetySection(item)}
      ${renderImguiCommonMistakesSection(item)}
      ${renderImguiNotesSection(item)}

      <section class="info-section">
        <div class="content-card prose-card">
          <h2>المصدر الرسمي</h2>
          <p><a class="doc-link" href="${escapeAttribute(item.sourceUrl || imguiMeta.sourceUrl || fallbackMeta.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.sourceUrl || imguiMeta.sourceUrl || fallbackMeta.sourceUrl)}</a></p>
        </div>
      </section>
      </div>
    `;

    document.title = `${item.name} - Dear ImGui - ArabicVulkan`;
    syncRouteHistory(`imgui/${encodeURIComponent(item.name)}`, options);
    scrollMainContentToTop();
    finalizeImguiRenderedContent(content);
    setActiveSidebarItemBySelector(
      getImguiReferenceSectionId(item.sectionKey),
      `.nav-item[data-nav-type="imgui"][data-nav-name="${escapeSelectorValue(item.name)}"]`
    );
  }

  async function showImguiIndex(options = {}) {
    await ensureUiSegment('imgui');
    populateImguiList();

    const imguiMeta = api.getImguiMeta() || {};
    const fallbackMeta = api.getImguiFallbackMeta() || {};
    const imguiReferenceSections = api.getImguiReferenceSections() || {};
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    content.innerHTML = `
      <div class="page-header">
        <h1>${renderEntityIcon('imgui', 'ui-codicon page-icon', 'Dear ImGui')} مرجع Dear ImGui</h1>
        <p>${escapeHtml(imguiMeta.description || fallbackMeta.description)}</p>
      </div>

      ${renderImguiExamplesPreviewSection({
        limit: 3,
        randomize: true
      })}

      ${Object.entries(imguiReferenceSections).map(([sectionKey, section]) => `
        <section class="category-section" id="imgui-section-${escapeAttribute(sectionKey)}">
          <h2>${renderEntityIcon(getImguiSectionIcon(sectionKey), 'ui-codicon page-icon', section.title)} ${escapeHtml(section.title)}</h2>
          <div class="items-grid imgui-index-grid imgui-index-grid-${escapeAttribute(sectionKey)}">
            ${(section.items || []).map((item) => `
              <div class="item-card imgui-index-card" onclick="showImguiReference('${escapeAttribute(item.name)}')">
                <span class="item-icon">${renderEntityIcon(getImguiKindMeta(item.kind).icon, 'ui-codicon card-icon', item.name)}</span>
                <span class="item-name">${escapeHtml(item.name)}</span>
                <span class="item-category">${escapeHtml(getImguiKindMeta(item.kind).label)}</span>
                ${renderImguiIndexCardPreview(item, sectionKey)}
                <p>${escapeHtml(item.shortTooltip || item.description || '')}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `).join('')}
    `;

    document.title = 'مرجع Dear ImGui - ArabicVulkan';
    syncRouteHistory('imgui-index', options);
    scrollMainContentToTop();
    finalizeImguiRenderedContent(content);
    setActiveSidebarItemBySelector('imgui-list', '.nav-item[data-nav-type="imgui-index"][data-nav-name="imgui-index"]');
  }

  async function showImguiHomeSection(sectionKey = '') {
    await showImguiIndex();
    if (!sectionKey) {
      return;
    }
    setTimeout(() => {
      scrollToAnchor(`imgui-section-${sectionKey}`);
    }, 40);
  }

  function getImguiHomeRecentItems(limit = 6) {
    const fallback = [
      {name: 'ImGui::Begin', tooltip: 'دالة تبدأ نافذة Dear ImGui وتحدد النطاق الذي ستوضع داخله العناصر التالية.'},
      {name: 'ImGui::Button', tooltip: 'دالة ترسم زرًا وتعيد حدث النقر خلال الإطار الحالي.'},
      {name: 'ImGui::InputText', tooltip: 'دالة تعرض حقل إدخال نص وتكتب التغييرات في مخزن نصي يمرره التطبيق.'},
      {name: 'ImGuiIO', tooltip: 'بنية تجمع حالة الإدخال والزمن والعرض التي يعتمد عليها Dear ImGui.'},
      {name: 'ImGuiWindowFlags', tooltip: 'نوع أعلام يضبط سلوك النوافذ ويمكن دمج قيمه معاً.'},
      {name: 'imgui.h', tooltip: 'ملف الترويسة العام الذي يعلن الواجهة العامة لـ Dear ImGui.'}
    ];

    const source = api.isImguiLoaded() ? getAllImguiReferenceItems().slice(0, limit) : fallback.slice(0, limit);
    return source.map((entry) => {
      const item = entry.name ? getImguiReferenceItem(entry.name) || entry : entry;
      const resolvedName = item.name || entry.name;
      const resolvedTooltip = item.shortTooltip || entry.tooltip || buildImguiReferenceTooltip(item);
      return {
        label: resolvedName,
        iconType: getImguiKindMeta(item.kind || 'type').icon,
        action: `showImguiReference('${escapeAttribute(resolvedName)}')`,
        tooltip: resolvedTooltip
      };
    });
  }

  function getImguiHomeSections() {
    const imguiReferenceSections = api.getImguiReferenceSections() || {};
    if (api.isImguiLoaded() && Object.keys(imguiReferenceSections).length > 0) {
      return Object.entries(imguiReferenceSections).map(([key, section]) => ({
        key,
        title: section.title,
        count: (section.items || []).length
      }));
    }

    return (api.getImguiFallbackMeta()?.sections || []).slice();
  }

  function buildImguiHomeLibraryModel() {
    const fallbackMeta = api.getImguiFallbackMeta() || {};
    const sections = getImguiHomeSections();
    const totalCount = sections.reduce((total, section) => total + section.count, 0);

    return {
      key: 'imgui',
      title: fallbackMeta.displayName,
      iconType: 'imgui',
      kicker: 'واجهة المستخدم الفورية',
      description: fallbackMeta.description,
      summaryNote: 'يعرض عناصر Dear ImGui الأساسية مع شرح تقني لدورة الإطار والربط بين الإدخال والحالة والرسم.',
      statusNote: api.isImguiLoaded()
        ? 'مرجع Dear ImGui المحلي جاهز الآن داخل الواجهة.'
        : 'يبقى هذا المرجع محملاً عند الطلب حتى لا تتأثر سرعة الإقلاع.',
      totalCount,
      headerActions: [
        {label: 'افتح Dear ImGui', iconType: 'imgui', action: 'showImguiIndex()', primary: true},
        {label: 'أمثلة', iconType: 'command', action: 'showImguiExamplesIndex()'},
        {label: 'التكاملات', iconType: 'imgui', action: `showImguiHomeSection('integrations')`},
        {label: 'النوافذ', iconType: 'structure', action: `showImguiHomeSection('windows')`},
        {label: 'العناصر التفاعلية', iconType: 'command', action: `showImguiHomeSection('widgets')`}
      ],
      cards: sections.map((section) => ({
        count: section.count,
        iconType: getImguiSectionIcon(section.key),
        title: section.title,
        note: `يفتح هذا المسار قسم ${section.title} داخل مرجع Dear ImGui المحلي.`,
        action: `showImguiHomeSection('${escapeAttribute(section.key)}')`
      })),
      quickLinks: [
        {label: 'مرجع Dear ImGui الكامل', iconType: 'imgui', action: 'showImguiIndex()', primary: true},
        {label: 'أمثلة Dear ImGui', iconType: 'command', action: 'showImguiExamplesIndex()'},
        {label: 'التكاملات وBackends', iconType: 'imgui', action: `showImguiHomeSection('integrations')`},
        {label: 'النوافذ والنطاقات', iconType: 'structure', action: `showImguiHomeSection('windows')`},
        {label: 'العناصر التفاعلية', iconType: 'command', action: `showImguiHomeSection('widgets')`},
        {label: 'الأنواع والحالة العامة', iconType: 'structure', action: `showImguiHomeSection('types')`}
      ],
      recentIconType: 'imgui',
      recentItems: getImguiHomeRecentItems(),
      recentEmptyText: api.isImguiLoaded()
        ? 'لا توجد عناصر Dear ImGui بارزة إضافية في هذه اللحظة.'
        : 'تظهر هنا نقاط دخول سريعة إلى أكثر عناصر Dear ImGui شيوعاً بعد فتح المرجع.',
      supportLinks: [
        {label: 'المرجع المحلي', action: 'showImguiIndex()', iconType: 'imgui'},
        {label: 'المستودع الرسمي', href: fallbackMeta.officialUrl, icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')},
        {label: 'ملف imgui.h', href: fallbackMeta.sourceUrl, iconType: 'file'}
      ],
      extraSectionsHtml: renderImguiExamplesPreviewSection({
        limit: 3,
        randomize: true,
        sectionId: 'imgui-home-examples'
      })
    };
  }

  const runtime = {
    configure,
    populateImguiList,
    toggleImguiExampleGroup,
    showImguiReference,
    showImguiIndex,
    showImguiHomeSection,
    getImguiHomeSections,
    getImguiHomeRecentItems,
    buildImguiHomeLibraryModel
  };

  Object.assign(window, runtime);
  return Object.freeze(runtime);
})();
