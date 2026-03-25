window.__ARABIC_VULKAN_EXAMPLE_ROUTES__ = (() => {
  const uiBlocks = window.__ARABIC_VULKAN_UI_BLOCKS__ || {};

  function renderFallbackPage(icon, title, description) {
    return `
      <div class="reference-unified-detail-page">
      <div class="page-header">
        <h1>${window.renderEntityIcon(icon, 'ui-codicon page-icon', title)} ${window.escapeHtml(title || '')}</h1>
        <p>${window.escapeHtml(description || '')}</p>
      </div>
      </div>
    `;
  }

  function getGameUiMetaRecord() {
    return typeof gameUiMeta !== 'undefined' ? gameUiMeta : {};
  }

  function finalizeImguiPageContent(content) {
    if (!content) {
      return;
    }

    window.scheduleProseCardReferenceLinking?.(content);
    window.highlightCode?.(content, {immediate: true});
  }

  async function showVulkanExamplesIndex(options = {}) {
    window.populateVulkanExamplesList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    content.innerHTML = uiBlocks.renderExampleIndexLayout({
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <span>أمثلة فولكان</span>
      `,
      headingHtml: `${window.renderEntityIcon('command', 'ui-codicon page-icon', 'أمثلة فولكان')} أمثلة فولكان`,
      descriptionHtml: 'قسم مستقل للأمثلة التطبيقية في فولكان نفسها. أمثلة التكامل التي تعتمد على SDL3 أو Dear ImGui نُقلت إلى أقسامها الأصلية حتى يبقى هذا الفهرس أوضح.',
      bodyHtml: window.renderVulkanExamplesGroupedIndexSection()
    });

    document.title = 'أمثلة فولكان - ArabicVulkan';
    window.syncRouteHistory('vulkan-examples', options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      'examples-list',
      '.nav-item[data-nav-type="vulkan-examples-index"][data-nav-name="vulkan-examples"]'
    );
  }

  async function showVulkanExample(exampleId, options = {}) {
    await window.ensureUiSegment('vulkanExampleGuides');
    window.populateVulkanExamplesList();

    const normalizedId = String(exampleId || '').trim();
    const example = window.getVulkanReadyExampleById(normalizedId);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!example) {
      content.innerHTML = renderFallbackPage('command', `مثال فولكان ${normalizedId}`, 'لا توجد صفحة مثال محلية بهذا المعرف داخل قسم أمثلة فولكان.');
      return;
    }

    const displayTitle = window.getVulkanExampleDisplayTitle(example);
    const codeSectionHtml = window.renderVulkanReadyExamplePageCodeSection(example);
    const commandsSectionHtml = window.renderVulkanReadyExamplePageCommandsSection(example);
    const supportSectionHtml = window.renderVulkanReadyExamplePageSupportGrid(example);
    const explanationHtml = window.renderVulkanReadyExampleExplanation(example);

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      hero: {
        previewHtml: window.renderVulkanReadyExamplePreview(example),
        headingHtml: `${window.renderEntityIcon('command', 'ui-codicon page-icon', displayTitle)} ${window.escapeHtml(displayTitle)}`,
        descriptionHtml: window.escapeHtml(example.goal || '')
      },
      sections: [
        window.renderVulkanReadyExamplePageOverviewCard(example, {showPreview: false}),
        codeSectionHtml,
        commandsSectionHtml,
        supportSectionHtml,
        {html: explanationHtml, wrap: false}
      ]
    });

    document.title = `${displayTitle} - مثال فولكان - ArabicVulkan`;
    window.syncRouteHistory(`vulkan-example/${encodeURIComponent(example.id)}`, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      'examples-list',
      `.nav-item[data-nav-type="vulkan-example"][data-nav-name="${window.escapeSelectorValue(example.id)}"]`
    );
    window.highlightCode(content);
  }

  async function showGlslExamplesIndex(options = {}) {
    await window.ensureUiSegment('glsl');
    window.populateGlslList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    content.innerHTML = uiBlocks.renderExampleIndexLayout({
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showGlslIndex(); return false;">مرجع GLSLang</a> /
        <span>أمثلة</span>
      `,
      headingHtml: `${window.renderEntityIcon('glsl', 'ui-codicon page-icon', 'أمثلة لغة التظليل')} أمثلة لغة التظليل`,
      descriptionHtml: 'فهرس مستقل لأمثلة الشيدر داخل لغة التظليل. أُعيد توزيع الأمثلة هنا بحسب الموضوع والتصنيف التعليمي حتى تنتقل بين الأساسيات والمواد والمؤثرات والربط مع Vulkan مثل أسلوب أمثلة فولكان.',
      bodyHtml: window.renderGlslExamplesGroupedIndexSection()
    });

    document.title = 'أمثلة لغة التظليل - ArabicVulkan';
    window.syncRouteHistory('glsl-examples', options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      'glsl-examples-list',
      '.nav-item[data-nav-type="glsl-examples-index"][data-nav-name="glsl-examples"]'
    );
    window.highlightCode(content);
  }

  async function showGlslExample(exampleId, options = {}) {
    await window.ensureUiSegment('glsl');
    await window.ensureUiSegment('glslExampleGuides');
    await window.ensureUiSegment('glslExampleTooltips');
    window.populateGlslList();

    const normalizedId = String(exampleId || '').trim();
    const example = window.getGlslReadyExampleById(normalizedId);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!example) {
      content.innerHTML = renderFallbackPage('glsl', `مثال لغة التظليل ${normalizedId}`, 'لا توجد صفحة مثال محلية بهذا المعرّف داخل أمثلة لغة التظليل.');
      return;
    }

    const localizedTitle = window.localizeGlslStageLabels(example.title || '');
    const localizedGoal = window.localizeGlslStageLabels(example.goal || '');
    const shaderSectionHtml = window.renderGlslReadyExampleShaderSection(example);
    const commandsSectionHtml = window.renderGlslReadyExampleCommandsSection(example);
    const vulkanUsageSectionHtml = window.renderGlslReadyExampleVulkanUsageSection(example);
    const supportSectionHtml = window.renderGlslReadyExampleSupportGrid(example);

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      hero: {
        previewHtml: window.renderGlslReadyExamplePreview(example),
        headingHtml: `${window.renderEntityIcon('glsl', 'ui-codicon page-icon', localizedTitle)} ${window.escapeHtml(localizedTitle)}`,
        descriptionHtml: window.escapeHtml(localizedGoal)
      },
      sections: [
        window.renderGlslReadyExampleOverviewCard(example, {showPreview: false}),
        shaderSectionHtml,
        commandsSectionHtml,
        vulkanUsageSectionHtml,
        supportSectionHtml
      ]
    });

    document.title = `${localizedTitle} - مثال لغة التظليل - ArabicVulkan`;
    window.syncRouteHistory(`glsl-example/${encodeURIComponent(example.id)}`, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      'glsl-examples-list',
      `.nav-item[data-nav-type="glsl-example"][data-nav-name="${window.escapeSelectorValue(example.id)}"]`
    );
    window.highlightCode(content);
  }

  async function showSdl3ExamplesIndex(packageKey = 'core', options = {}) {
    await window.ensureUiSegment('sdl3');
    window.populateSdl3List();

    const normalizedPackageKey = String(packageKey || 'core').trim() || 'core';
    const examples = window.getSdl3ReadyExamples(normalizedPackageKey);
    const packageInfo = window.getSdl3PackageInfo(normalizedPackageKey);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!examples.length) {
      content.innerHTML = renderFallbackPage('sdl3', `SDL3 Examples ${packageInfo?.displayName || normalizedPackageKey}`, `لا توجد أمثلة محلية جاهزة لهذا الفرع من ${packageInfo?.displayName || normalizedPackageKey} حالياً.`);
      return;
    }

    const parentCrumb = normalizedPackageKey === 'core'
      ? `<a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a>`
      : `<a href="#" onclick="showSdl3PackageIndex('${window.escapeAttribute(normalizedPackageKey)}'); return false;">${window.escapeHtml(packageInfo?.displayName || normalizedPackageKey)}</a>`;

    content.innerHTML = uiBlocks.renderExampleIndexLayout({
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        ${parentCrumb} /
        <span>أمثلة</span>
      `,
      headingHtml: `${window.renderEntityIcon('sdl3', 'ui-codicon page-icon', packageInfo?.displayName || normalizedPackageKey)} أمثلة ${window.escapeHtml(packageInfo?.displayName || 'SDL3')}`,
      descriptionHtml: `فهرس مستقل لأمثلة ${window.escapeHtml(packageInfo?.displayName || 'SDL3')} داخل المشروع. أُعيد توزيع الأمثلة هنا بحسب الفكرة العملية والمسار التعليمي حتى يصبح الانتقال بينها أقرب إلى أسلوب أمثلة فولكان.`,
      bodyHtml: window.renderSdl3ExamplesGroupedIndexSection(normalizedPackageKey)
    });

    document.title = `أمثلة ${packageInfo?.displayName || 'SDL3'} - ArabicVulkan`;
    window.syncRouteHistory(`sdl3-examples/${encodeURIComponent(normalizedPackageKey)}`, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      window.getSdl3PackageListId(normalizedPackageKey),
      `.nav-item[data-nav-type="sdl3-examples-index"][data-nav-name="${window.escapeSelectorValue(normalizedPackageKey)}"]`
    );
  }

  async function showSdl3AudioGuide(options = {}) {
    await window.ensureUiSegment('sdl3');
    window.populateSdl3List();

    const packageInfo = window.getSdl3PackageInfo('audio');
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    content.innerHTML = uiBlocks.renderExampleIndexLayout({
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a> /
        <a href="#" onclick="showSdl3PackageIndex('audio'); return false;">${window.escapeHtml(packageInfo?.displayName || 'SDL3Audio')}</a> /
        <span>دليل القنوات الصوتية</span>
      `,
      headingHtml: `${window.renderEntityIcon('sdl3', 'ui-codicon page-icon', 'دليل القنوات الصوتية')} دليل القنوات الصوتية`,
      descriptionHtml: 'صفحة مستقلة تشرح اختصارات القنوات في SDL3Audio وترتيبها الفعلي داخل الذاكرة، بحيث تصبح أمثلة PCM وStereo وSurround أوضح قبل قراءة الكود.',
      bodyHtml: window.renderSdl3AudioChannelLayoutGuidePage()
    });

    document.title = 'دليل القنوات الصوتية - SDL3Audio - ArabicVulkan';
    window.syncRouteHistory('sdl3-audio-guide', options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      window.getSdl3PackageListId('audio'),
      '.nav-item[data-nav-type="sdl3-audio-guide"][data-nav-name="audio-channel-layout-guide"]'
    );
  }

  async function showSdl3Example(packageKey = 'core', exampleId = '', options = {}) {
    await window.ensureUiSegment('sdl3');
    await window.ensureSdl3PackageData(packageKey);
    await window.ensureUiSegment('sdl3ExampleGuides');
    window.populateSdl3List();

    const normalizedPackageKey = String(packageKey || 'core').trim() || 'core';
    const normalizedExampleId = String(exampleId || '').trim();
    const example = window.getSdl3ReadyExampleById(normalizedPackageKey, normalizedExampleId);
    const packageInfo = window.getSdl3PackageInfo(normalizedPackageKey);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!example) {
      content.innerHTML = renderFallbackPage('sdl3', `SDL3 Example ${normalizedExampleId}`, `لا توجد صفحة مثال محلية بهذا المعرف داخل ${packageInfo?.displayName || normalizedPackageKey}.`);
      return;
    }

    const parentCrumb = normalizedPackageKey === 'core'
      ? '<a href="#" onclick="showSdl3Index(); return false;">مرجع SDL3</a>'
      : `<a href="#" onclick="showSdl3PackageIndex('${window.escapeAttribute(normalizedPackageKey)}'); return false;">${window.escapeHtml(packageInfo?.displayName || normalizedPackageKey)}</a>`;
    const pageModel = window.buildSdl3ReadyExamplePageModel(example);
    const overviewSectionHtml = window.renderSdl3ReadyExamplePageOverviewCard(example, {showPreview: false});
    const codeSectionHtml = window.renderSdl3ReadyExamplePageCodeSection(example);
    const supportSectionHtml = window.renderSdl3ReadyExamplePageSupportGrid(example);

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      hero: {
        previewHtml: pageModel.previewHtml,
        breadcrumbHtml: `
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          ${parentCrumb} /
          <a href="#" onclick="showSdl3ExamplesIndex('${window.escapeAttribute(normalizedPackageKey)}'); return false;">أمثلة</a> /
          <span>${window.escapeHtml(pageModel.pageTitle || example.title)}</span>
        `,
        headingHtml: `${window.renderEntityIcon('sdl3', 'ui-codicon page-icon', pageModel.pageTitle || example.title)} ${window.escapeHtml(pageModel.pageTitle || example.title)}`,
        descriptionHtml: pageModel.pageGoalHtml
      },
      sections: [
        overviewSectionHtml,
        codeSectionHtml,
        supportSectionHtml
      ]
    });

    document.title = `${pageModel.pageTitle || example.title} - ${packageInfo?.displayName || 'SDL3'} Example - ArabicVulkan`;
    window.syncRouteHistory(`sdl3-example/${encodeURIComponent(window.buildSdl3ExampleCompositeName(normalizedPackageKey, example.id))}`, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      window.getSdl3PackageListId(normalizedPackageKey),
      `.nav-item[data-nav-type="sdl3-example"][data-nav-name="${window.escapeSelectorValue(window.buildSdl3ExampleCompositeName(normalizedPackageKey, example.id))}"]`
    );
    window.highlightCode(content);
  }

  async function showImguiExamplesIndex(options = {}) {
    await window.ensureUiSegment('imgui');
    window.populateImguiList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    content.innerHTML = uiBlocks.renderExampleIndexLayout({
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showImguiIndex(); return false;">مرجع Dear ImGui</a> /
        <span>أمثلة</span>
      `,
      headingHtml: `${window.renderEntityIcon('imgui', 'ui-codicon page-icon', 'ImGui Examples')} أمثلة Dear ImGui`,
      descriptionHtml: 'فهرس مستقل للأمثلة العملية في Dear ImGui. أُعيد توزيع الأمثلة هنا بحسب النوافذ والعناصر والتخطيط والتكاملات حتى يصبح الانتقال بينها أقرب إلى أسلوب أمثلة فولكان.',
      bodyHtml: window.renderImguiExamplesGroupedIndexSection()
    });

    document.title = 'أمثلة Dear ImGui - ArabicVulkan';
    window.syncRouteHistory('imgui-examples', options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      window.getImguiReferenceSectionId('examples'),
      '.nav-item[data-nav-type="imgui-examples-index"][data-nav-name="imgui-examples"]'
    );
    window.highlightCode(content);
  }

  async function showImguiExample(name, options = {}) {
    await window.ensureUiSegment('imgui');
    await window.ensureUiSegment('imguiExampleGuides');
    window.populateImguiList();

    const item = window.getImguiExampleItem(name);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!item || !item.usageExample) {
      content.innerHTML = renderFallbackPage('imgui', `ImGui Example ${name || ''}`, 'لا توجد صفحة مثال عملية مستقلة لهذا العنصر من Dear ImGui حالياً.');
      return;
    }

    const pageModel = window.buildImguiExamplePageModel(item);

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      hero: {
        previewHtml: pageModel.previewHtml,
        breadcrumbHtml: `
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showImguiIndex(); return false;">مرجع Dear ImGui</a> /
          <a href="#" onclick="showImguiExamplesIndex(); return false;">أمثلة</a> /
          <span>${window.escapeHtml(item.name)}</span>
        `,
        headingHtml: `${window.renderEntityIcon(window.getImguiKindMeta(item.kind).icon, 'ui-codicon page-icon', item.name)} مثال ${window.escapeHtml(item.name)}`,
        descriptionHtml: window.renderImguiDocText(pageModel.pageGoalText)
      },
      sections: [
        window.renderImguiExamplePageOverviewCard(item, {showPreview: false}),
        window.renderImguiExamplePageCodeSection(item),
        window.renderImguiExamplePageSupportGrid(item)
      ]
    });

    document.title = `مثال ${item.name} - Dear ImGui - ArabicVulkan`;
    window.syncRouteHistory(`imgui-example/${encodeURIComponent(item.name)}`, options);
    window.scrollMainContentToTop();
    finalizeImguiPageContent(content);
    window.setActiveSidebarItemBySelector(
      window.getImguiReferenceSectionId('examples'),
      `.nav-item[data-nav-type="imgui-example"][data-nav-name="${window.escapeSelectorValue(item.name)}"]`
    );
  }

  async function showGameUiItem(rawName, options = {}) {
    await window.ensureUiSegment('gameui');
    window.populateGameUiList();

    const item = window.getGameUiReferenceItem(decodeURIComponent(rawName || ''));
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (!item) {
      content.innerHTML = renderFallbackPage('gameui', 'واجهات الألعاب عنصر غير موجود', 'العنصر المطلوب غير متوفر في مرجع واجهات الألعاب المحلي.');
      return;
    }

    const isExampleView = options.viewMode === 'example';
    const routePath = options.routePath || `${isExampleView ? 'game-ui-example' : 'game-ui'}/${encodeURIComponent(item.name)}`;
    const activeNavType = options.activeNavType || (isExampleView ? 'game-ui-example' : 'game-ui');
    const usageExample = item.usageExample || null;
    const usageCode = usageExample?.fullCode || usageExample?.code || '';
    const itemTitle = item.nameAr || item.name || '';
    const itemDescription = item.shortTooltip || item.officialArabicDescription || item.description || '';
    const itemHeaderHtml = uiBlocks.renderExampleHeroSection({
      previewHtml: window.renderGameUiItemHeroPreview(item),
      breadcrumbHtml: `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showGameUiIndex(); return false;">واجهات الألعاب</a> /
        ${isExampleView ? '<a href="#" onclick="showGameUiExamplesIndex(); return false;">أمثلة</a> /' : ''}
        <span>${window.escapeHtml(itemTitle)}</span>
      `,
      headingHtml: `${window.renderEntityIcon('gameui', 'ui-codicon page-icon', itemTitle)} ${window.escapeHtml(itemTitle)}`,
      descriptionHtml: window.renderGameUiDocText(itemDescription, {item}),
      className: 'game-ui-item-hero'
    });
    const meaningCardsHtml = `
      <div class="info-grid">
        <div class="info-card">
          <h3>المعنى الحقيقي</h3>
          <p>${window.renderGameUiDocText(item.realMeaning || item.description || '', {item})}</p>
        </div>
        <div class="info-card">
          <h3>متى يستخدم</h3>
          <p>${window.renderGameUiDocText(item.whenToUse || '', {item})}</p>
        </div>
        <div class="info-card">
          <h3>الفائدة العملية</h3>
          <p>${window.renderGameUiDocText(item.practicalBenefit || '', {item})}</p>
        </div>
        <div class="info-card">
          <h3>أثر سوء الاستخدام</h3>
          <p>${window.renderGameUiDocText(item.misuseImpact || '', {item})}</p>
        </div>
      </div>
    `;

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      heroHtml: itemHeaderHtml,
      sections: [
        meaningCardsHtml,
        {html: window.renderGameUiParametersTable(item), wrap: false},
        {html: window.renderGameUiExampleOverviewSection(item), wrap: false},
        usageExample ? window.renderGameUiCodeBlock(item.nameAr || item.name || 'Game UI Example', usageCode, {item}) : '',
        {html: window.renderGameUiDetailsList('دورة الحياة والتحديث', item.lifecycle || [], item), wrap: false},
        {html: window.renderGameUiDetailsList('إرشادات الاستخدام', item.instructions || [], item), wrap: false},
        {html: window.renderGameUiDetailsList('ملاحظات إضافية', item.notes || [], item), wrap: false},
        {html: window.renderGameUiRelatedSection(item), wrap: false}
      ]
    });

    window.highlightCode(content);
    document.title = `${isExampleView ? 'مثال ' : ''}${item.nameAr || item.name} - واجهات الألعاب - ArabicVulkan`;
    window.syncRouteHistory(routePath, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      isExampleView ? window.getGameUiReferenceSectionId('examples') : window.getGameUiReferenceSectionId(item.sectionKey),
      `.nav-item[data-nav-type="${window.escapeSelectorValue(activeNavType)}"][data-nav-name="${window.escapeSelectorValue(item.name)}"]`
    );
  }

  async function showGameUiIndex(options = {}) {
    await window.ensureUiSegment('gameui');
    window.populateGameUiList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const isExamplesView = options.viewMode === 'examples';
    const routePath = options.routePath || (isExamplesView ? 'game-ui-examples' : 'game-ui-index');
    const activeNavType = options.activeNavType || (isExamplesView ? 'game-ui-examples-index' : 'game-ui-index');
    const activeNavName = isExamplesView ? 'game-ui-examples' : 'game-ui-index';
    const gameUiMetaRecord = getGameUiMetaRecord();
    const heroDescription = isExamplesView
      ? 'فهرس مستقل للأمثلة العملية في واجهات الألعاب. أُعيد توزيع الأمثلة هنا بحسب HUD وعناصر التفاعل والتنقل والتغذية البصرية وأدوات المحرر حتى يصبح الانتقال بينها أقرب إلى أسلوب أمثلة فولكان.'
      : 'قسم مستقل لعناصر HUD و UI وأدوات المحرر داخل الألعاب. بُني هذا الفهرس بنفس أسلوب عرض أمثلة فولكان حتى تنتقل بين المجموعات والعناصر بسرعة ثم تفتح الشرح الكامل لكل عنصر.';
    const heroTitle = isExamplesView ? 'أمثلة واجهات الألعاب' : (gameUiMetaRecord.displayName || 'واجهات الألعاب');
    const breadcrumbHtml = isExamplesView
      ? `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showGameUiIndex(); return false;">واجهات الألعاب</a> /
        <span>أمثلة</span>
      `
      : `
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <span>واجهات الألعاب</span>
      `;
    const indexHeaderHtml = uiBlocks.renderExampleHeroSection({
      previewHtml: window.renderGameUiHomeHeroPreview(),
      breadcrumbHtml,
      headingHtml: `${window.renderEntityIcon('gameui', 'ui-codicon page-icon', heroTitle)} ${window.escapeHtml(heroTitle)}`,
      descriptionHtml: window.escapeHtml(heroDescription),
      className: 'game-ui-home-hero'
    });

    content.innerHTML = uiBlocks.renderExamplePageLayout({
      heroHtml: indexHeaderHtml,
      sections: [
        {html: window.renderGameUiGroupedIndexSection(), wrap: false}
      ]
    });

    document.title = `${isExamplesView ? 'أمثلة واجهات الألعاب' : (gameUiMetaRecord.displayName || 'واجهات الألعاب')} - ArabicVulkan`;
    window.syncRouteHistory(routePath, options);
    window.scrollMainContentToTop();
    window.setActiveSidebarItemBySelector(
      isExamplesView ? window.getGameUiReferenceSectionId('examples') : 'game-ui-list',
      `.nav-item[data-nav-type="${window.escapeSelectorValue(activeNavType)}"][data-nav-name="${window.escapeSelectorValue(activeNavName)}"]`
    );
  }

  async function showGameUiHomeSection(sectionKey = '') {
    await showGameUiIndex();
    if (!sectionKey) {
      return;
    }

    setTimeout(() => {
      const section = document.getElementById(`game-ui-section-${sectionKey}`);
      if (section?.tagName === 'DETAILS') {
        section.open = true;
      }
      window.scrollToAnchor(`game-ui-section-${sectionKey}`);
    }, 40);
  }

  async function showGameUiExamplesIndex(options = {}) {
    await showGameUiIndex({
      ...options,
      viewMode: 'examples',
      activeNavType: 'game-ui-examples-index',
      routePath: 'game-ui-examples'
    });
  }

  async function showGameUiExample(name, options = {}) {
    await showGameUiItem(name, {
      ...options,
      viewMode: 'example',
      activeNavType: 'game-ui-example',
      routePath: `game-ui-example/${encodeURIComponent(String(name || ''))}`
    });
  }

  return Object.freeze({
    showGameUiExample,
    showGameUiExamplesIndex,
    showGameUiHomeSection,
    showGameUiIndex,
    showGameUiItem,
    showGlslExample,
    showGlslExamplesIndex,
    showImguiExample,
    showImguiExamplesIndex,
    showSdl3AudioGuide,
    showSdl3Example,
    showSdl3ExamplesIndex,
    showVulkanExample,
    showVulkanExamplesIndex
  });
})();
