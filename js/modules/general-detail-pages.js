(function (global) {
  const api = {
    ensureUiSegment: async () => {},
    populateTutorialsList: () => {},
    closeActiveSectionVideoModal: () => {},
    getTutorialContent: () => ({}),
    renderEntityIcon: () => '',
    renderTutorialLeadMedia: () => '',
    normalizeTutorialLessonSections: () => {},
    prepareTutorialCodeContainers: () => {},
    highlightCode: () => {},
    activateTutorialLazyCodeBlocks: () => {},
    enhanceTutorialExamples: () => {},
    refreshTutorialCodePresentation: () => {},
    syncRouteHistory: () => {},
    setActiveSidebarItemBySelector: () => {},
    escapeSelectorValue: (value) => String(value || ''),
    populateFilesList: () => {},
    getStaticFilePageUrl: () => '',
    getServedFileRelativePath: () => '',
    getFileReferenceData: () => ({}),
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || ''),
    renderLazyFileSourceSection: () => '',
    scrollMainContentToTop: () => {},
    initLazyFileSourceViewers: () => {},
    syncSidebarWithHash: () => {},
    getCppReferenceItem: () => null,
    getCppReferenceIconType: () => '',
    renderTutorialInfoGrid: () => '',
    renderPracticalText: (value) => String(value || ''),
    renderExternalReference: () => '',
    renderCppReferenceRelatedLinks: () => '',
    renderCppReferenceOfficialSection: () => '',
    renderCppReferenceProjectGuidance: () => ''
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function getCppReferenceUtilsRuntime() {
    return global.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  }

  function getBootstrapContext() {
    return global.__ARABIC_VULKAN_BOOTSTRAP_CONTEXT__ || {};
  }

  function getBootstrapValue(getterName, fallbackValue) {
    const getter = getBootstrapContext()?.[getterName];
    if (typeof getter !== 'function') {
      return fallbackValue;
    }

    try {
      const value = getter();
      return value ?? fallbackValue;
    } catch (_error) {
      return fallbackValue;
    }
  }

  function resolveCppReferenceItem(name) {
    const token = String(name || '').trim();
    if (!token) {
      return null;
    }

    const directItem = api.getCppReferenceItem(token);
    if (directItem) {
      return directItem;
    }

    const cppUtils = getCppReferenceUtilsRuntime();
    if (cppUtils?.getCppReferenceItem) {
      const runtimeItem = cppUtils.getCppReferenceItem(token);
      if (runtimeItem) {
        return runtimeItem;
      }
    }

    if (!cppUtils?.buildCppReferenceItem) {
      return null;
    }

    const cppReferenceData = getBootstrapValue('getCppReferenceData', {});
    const cppReferenceEnrichment = getBootstrapValue('getCppReferenceEnrichmentData', {});
    const cppReferenceOfficialLinks = getBootstrapValue('getCppReferenceOfficialLinks', {});
    const cppKeywordTokens = getBootstrapValue('getCppKeywordTokens', new Set());
    const externalReferenceUrlGetter = getBootstrapContext()?.getExternalReferenceUrl;

    const mergedItem = {
      ...(cppReferenceEnrichment?.[token] || {}),
      ...(cppReferenceData?.[token] || {})
    };
    const hasMergedItem = Object.keys(mergedItem).length > 0;
    const isKnownKeyword = typeof cppKeywordTokens?.has === 'function' && cppKeywordTokens.has(token);

    if (!hasMergedItem && !isKnownKeyword) {
      return null;
    }

    const item = cppUtils.buildCppReferenceItem(
      token,
      hasMergedItem ? mergedItem : {title: token, ...(cppReferenceEnrichment?.[token] || {})}
    );
    const officialHref = cppReferenceOfficialLinks?.[token]?.references?.[0]?.href || '';
    const externalHref = typeof externalReferenceUrlGetter === 'function'
      ? String(externalReferenceUrlGetter(token) || '')
      : '';
    item.referenceUrl = item.referenceUrl || item.officialUrl || officialHref || externalHref || '';
    return item;
  }

  function resolveCppReferenceIconType(name, item) {
    const iconType = api.getCppReferenceIconType(name, item);
    if (iconType) {
      return iconType;
    }
    return getCppReferenceUtilsRuntime()?.getCppReferenceIconType?.(name, item) || '';
  }

  function renderCppReferenceRelatedLinksSafe(item) {
    return api.renderCppReferenceRelatedLinks(item)
      || getCppReferenceUtilsRuntime()?.renderCppReferenceRelatedLinks?.(item)
      || '';
  }

  function renderCppReferenceOfficialSectionSafe(item) {
    return api.renderCppReferenceOfficialSection(item)
      || getCppReferenceUtilsRuntime()?.renderCppReferenceOfficialSection?.(item)
      || '';
  }

  function renderCppReferenceProjectGuidanceSafe(item) {
    return api.renderCppReferenceProjectGuidance(item)
      || getCppReferenceUtilsRuntime()?.renderCppReferenceProjectGuidance?.(item)
      || '';
  }

  async function showTutorial(tutorialId, options = {}) {
    await api.ensureUiSegment('tutorials');
    api.populateTutorialsList();
    api.closeActiveSectionVideoModal();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const tutorial = api.getTutorialContent()[tutorialId];
    if (!tutorial) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${api.renderEntityIcon('tutorial', 'ui-codicon page-icon', 'درس')} درس غير موجود</h1>
          <p>الدرس المطلوب غير متوفر حالياً.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="reference-unified-detail-page">
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showTutorialsIndex(); return false;">الدروس</a> /
          <span>${tutorial.title}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('tutorial', 'ui-codicon page-icon', 'درس')} ${tutorial.title}</h1>
      </div>

      ${api.renderTutorialLeadMedia(tutorialId, tutorial)}

      <div class="tutorial-content">
        ${tutorial.content}
      </div>

      <div class="tutorial-nav-buttons">
        <button class="nav-btn prev" onclick="showTutorialPrev('${tutorialId}')">→ الدرس السابق</button>
        <button class="nav-btn next" onclick="showTutorialNext('${tutorialId}')">الدرس التالي ←</button>
      </div>
    `;

    api.normalizeTutorialLessonSections(content);
    api.prepareTutorialCodeContainers(content);
    api.highlightCode(content);
    api.activateTutorialLazyCodeBlocks(content);
    try {
      api.enhanceTutorialExamples(content);
    } catch (error) {
      console.error('Failed to enhance tutorial examples:', error);
    }
    api.refreshTutorialCodePresentation(content);
    global.requestAnimationFrame(() => api.refreshTutorialCodePresentation(content));
    global.setTimeout(() => api.refreshTutorialCodePresentation(content), 120);
    global.setTimeout(() => api.refreshTutorialCodePresentation(content), 360);
    document.title = `${tutorial.title} - ArabicVulkan`;
    api.syncRouteHistory(`tutorial/${tutorialId}`, options);
    api.setActiveSidebarItemBySelector(
      'tutorials-list',
      `.nav-item[data-nav-type="tutorial"][data-nav-name="${api.escapeSelectorValue(tutorialId)}"]`
    );
  }

  async function showFile(fileName, options = {}) {
    await api.ensureUiSegment('files');
    api.populateFilesList();

    const staticPageUrl = api.getStaticFilePageUrl(fileName);
    const sourcePath = api.getServedFileRelativePath(fileName);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const file = api.getFileReferenceData()[fileName];
    if (!file) {
      content.innerHTML = `<div class="page-header"><h1>${api.renderEntityIcon('file', 'ui-codicon page-icon', 'ملف')} ${fileName}</h1><p>الملف غير موجود.</p></div>`;
      return;
    }

    content.innerHTML = `
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showFilesIndex(); return false;">الملفات</a> /
          <span>${api.escapeHtml(fileName)}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('file', 'ui-codicon page-icon', 'ملف')} ${api.escapeHtml(fileName)}</h1>
        <p class="page-description">${api.escapeHtml(file.description || '')}</p>
      </div>

      <section class="info-section">
        <div class="content-card prose-card">
          <p><strong>المسار:</strong> <code dir="ltr">${api.escapeHtml(file.path)}</code></p>
          <p><strong>التصنيف:</strong> ${api.escapeHtml(file.category || file.sectionTitle || 'ملف Vulkan')}</p>
          <p><strong>الاستخدام:</strong> ${api.escapeHtml(file.usage || '')}</p>
          ${sourcePath ? `<p><strong>الملف الأصلي:</strong> <a class="doc-link" href="${api.escapeAttribute(sourcePath)}" target="_blank" rel="noopener noreferrer">فتح المصدر الخام</a></p>` : ''}
          <p><strong>الصفحة المستقلة:</strong> <a class="doc-link" href="${api.escapeAttribute(staticPageUrl)}" target="_blank" rel="noopener noreferrer">فتح العرض الثابت</a></p>
        </div>
      </section>

      ${api.renderLazyFileSourceSection(fileName)}
      </div>
    `;

    document.title = `${fileName} - ArabicVulkan`;
    api.syncRouteHistory(`file/${encodeURIComponent(fileName)}`, options);
    api.scrollMainContentToTop();
    api.initLazyFileSourceViewers(content);
    api.syncSidebarWithHash('file', fileName);
  }

  function showCppReference(name, options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const itemName = String(name || '').trim();
    const item = resolveCppReferenceItem(itemName);
    if (!item) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${api.renderEntityIcon('variable', 'ui-codicon page-icon', 'متغير')} ${itemName}</h1>
          <p>لا يوجد شرح محلي لهذا العنصر من C++ حالياً.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="reference-unified-detail-page">
      <div class="page-header">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <span>مرجع C++</span> /
          <span>${item.title}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon(resolveCppReferenceIconType(item.title, item) || 'cpp', 'ui-codicon page-icon', item.type)} ${item.title}</h1>
        <p class="page-description">${item.description}</p>
      </div>

      <section class="info-section">
        ${api.renderTutorialInfoGrid([
          {
            label: 'نوع العنصر',
            value: `<strong>${api.escapeHtml(item.type)}</strong>`,
            note: 'هذا توصيف لغوي/قياسي داخل C++، وليس كيانًا من Vulkan بحد ذاته.'
          },
          {
            label: 'المعنى الحقيقي',
            value: api.renderPracticalText(item.practicalMeaning || item.description, item.description),
            note: ''
          },
          {
            label: 'لماذا وُجد',
            value: api.renderPracticalText(item.usage || item.actualBehavior, item.actualBehavior || item.usage),
            note: ''
          },
          {
            label: 'لماذا يستخدمه المبرمج',
            value: api.renderPracticalText(item.benefit || item.usage, item.usage),
            note: ''
          },
          {
            label: 'كيف يظهر في الاستخدام الفعلي',
            value: api.renderPracticalText(item.projectContext || item.actualBehavior || item.usage, item.usage),
            note: item.referenceUrl ? api.renderExternalReference(item.title, {}, 'مرجع C++ الخارجي') : 'هذا الشرح محلي داخل المشروع.'
          }
        ])}
      </section>

      <section class="example-section">
        <h2>مثال C++</h2>
        <div class="code-container">
          <pre class="code-block"><code class="language-cpp">${api.escapeHtml(item.example || item.title)}</code></pre>
        </div>
      </section>

      <section class="info-section">
        <div class="content-card prose-card">
          <h2>الفائدة العملية</h2>
          <p>${api.renderPracticalText(item.benefit || item.usage, item.usage)}</p>
        </div>
      </section>

      ${item.misuse ? `
        <section class="info-section">
          <div class="content-card prose-card">
            <h2>تنبيه</h2>
            <p>${api.renderPracticalText(item.misuse, item.misuse)}</p>
          </div>
        </section>
      ` : ''}

      ${renderCppReferenceProjectGuidanceSafe(item)}
      ${renderCppReferenceRelatedLinksSafe(item)}
      ${renderCppReferenceOfficialSectionSafe(item)}
      </div>
    `;

    document.title = `${item.title} - ArabicVulkan`;
    api.syncRouteHistory(`cpp/${encodeURIComponent(itemName)}`, options);
    api.highlightCode();
  }

  global.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__ = {
    configure,
    showTutorial,
    showFile,
    showCppReference
  };
})(window);
