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
    scheduleRecentVisitCapture: () => {},
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
    getCppDeepGuides: () => ({}),
    renderTutorialInfoGrid: () => '',
    renderDocCodeContainer: null,
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

  function renderCppIncludeValue(item) {
    const includeLabel = String(item?.includeHeader || '').trim();
    if (!includeLabel) {
      return '';
    }
    if (includeLabel.startsWith('#include ')) {
      return `
        <div class="cpp-reference-inline-shell cpp-reference-include-shell">
          <span class="cpp-reference-inline-kicker">أضف هذا السطر قبل الاستخدام</span>
          <code dir="ltr" class="cpp-reference-inline-code">${api.escapeHtml(includeLabel)}</code>
        </div>
      `;
    }
    return `
      <div class="cpp-reference-inline-shell cpp-reference-include-shell cpp-reference-inline-shell-soft">
        <span class="cpp-reference-inline-kicker">حالة التضمين</span>
        <div class="cpp-reference-inline-text">${api.escapeHtml(includeLabel)}</div>
      </div>
    `;
  }

  function renderCppNamespaceValue(item) {
    const namespaceLabel = String(item?.namespaceQualifier || '').trim();
    if (!namespaceLabel) {
      return '';
    }

    const looksLikeCode = /::|using\b|[<>#;]/.test(namespaceLabel);
    return `
      <div class="cpp-reference-inline-shell cpp-reference-namespace-shell">
        <span class="cpp-reference-inline-kicker">الصيغة الأوضح داخل الكود</span>
        ${looksLikeCode
          ? `<code dir="ltr" class="cpp-reference-inline-code">${api.escapeHtml(namespaceLabel)}</code>`
          : `<div class="cpp-reference-inline-text">${api.escapeHtml(namespaceLabel)}</div>`}
      </div>
    `;
  }

  function renderCppReferenceTokenListSafe(names = []) {
    return getCppReferenceUtilsRuntime()?.renderCppReferenceTokenList?.(names) || '';
  }

  function normalizeCppExampleCode(rawCode = '', item = null) {
    const code = String(rawCode || '').trim();
    if (!code) {
      return '';
    }

    const includeLabel = String(item?.includeHeader || '').trim();
    if (!includeLabel || !includeLabel.startsWith('#include ') || /#include\s+</.test(code)) {
      return code;
    }

    return `${includeLabel}\n\n${code}`;
  }

  function renderCppDocCodeContainer(title = '', rawCode = '', extraClassName = '') {
    const code = String(rawCode || '').trim();
    if (!code) {
      return '';
    }

    if (typeof api.renderDocCodeContainer === 'function') {
      return api.renderDocCodeContainer({
        titleHtml: api.escapeHtml(title || 'الكود'),
        rawCode: code,
        language: 'cpp',
        containerClassName: ['reference-code-shell', extraClassName].filter(Boolean).join(' '),
        allowCopy: true,
        allowToggle: true
      });
    }

    return `
      <div class="code-container ${api.escapeAttribute(extraClassName)}">
        <div class="code-header"><span>${api.escapeHtml(title || 'الكود')}</span></div>
        <pre class="code-block"><code class="language-cpp">${api.escapeHtml(code)}</code></pre>
      </div>
    `;
  }

  function renderCppReferenceExamplesSection(item) {
    const usageExamples = Array.isArray(item?.usageExamples) ? item.usageExamples.filter((entry) => entry?.code) : [];
    if (!usageExamples.length) {
      return `
        <section class="example-section">
          <h2>مثال C++ مستقل</h2>
          ${renderCppDocCodeContainer('مثال مستقل', normalizeCppExampleCode(item?.example || item?.title || '', item), 'cpp-reference-example-shell')}
        </section>
      `;
    }

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>أمثلة مستقلة</h2>
          ${item?.standaloneSummary ? `<p>${api.renderPracticalText(item.standaloneSummary, item.standaloneSummary)}</p>` : ''}
          ${Array.isArray(item?.standaloneSteps) && item.standaloneSteps.length ? `
            <ul class="best-practices-list">
              ${item.standaloneSteps.map((entry) => `<li><p>${api.renderPracticalText(entry, entry)}</p></li>`).join('')}
            </ul>
          ` : ''}
        </div>
        ${usageExamples.map((example, index) => `
          <section class="example-section cpp-reference-example-card">
            <h2>${api.escapeHtml(example.titleArabic || `مثال ${index + 1}`)}</h2>
            ${example.explanationArabic ? `
              <div class="content-card prose-card cpp-reference-example-note">
                <p>${api.renderPracticalText(example.explanationArabic, example.explanationArabic)}</p>
              </div>
            ` : ''}
            ${renderCppDocCodeContainer(example.titleArabic || `مثال ${index + 1}`, normalizeCppExampleCode(example.code || '', item), 'cpp-reference-example-shell')}
            ${Array.isArray(example.relatedTokens) && example.relatedTokens.length ? `
              <div class="cpp-reference-example-links">
                <strong>روابط داخلية مرتبطة بالمثال:</strong>
                <div class="see-also-links cpp-related-inline-links">
                  ${renderCppReferenceTokenListSafe(example.relatedTokens)}
                </div>
              </div>
            ` : ''}
          </section>
        `).join('')}
      </section>
    `;
  }

  function renderCppMemberOperationsSection(item) {
    const operations = (Array.isArray(item?.memberOperations) ? item.memberOperations : [])
      .map((entry) => ({
        name: String(entry?.name || '').trim(),
        role: String(entry?.role || '').trim(),
        summary: String(entry?.summary || '').trim(),
        whyUse: String(entry?.whyUse || '').trim(),
        practicalBenefit: String(entry?.practicalBenefit || '').trim(),
        complexity: String(entry?.complexity || '').trim(),
        code: String(entry?.code || '').trim()
      }))
      .filter((entry) => entry.name && (entry.summary || entry.whyUse || entry.practicalBenefit || entry.complexity || entry.code));

    if (!operations.length) {
      return '';
    }

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>الدوال والخصائص المهمة</h2>
          <div class="cpp-member-operations-stack">
            ${operations.map((entry) => `
              <article class="parameter-detail-card cpp-member-operation-card">
                <div class="parameter-header">
                  <span class="param-name"><code dir="ltr">${api.escapeHtml(entry.name)}</code></span>
                  ${entry.role ? `<span class="parameter-type">${api.escapeHtml(entry.role)}</span>` : ''}
                </div>
                ${entry.summary ? `
                  <div class="parameter-field">
                    <label>ما الذي تفعله؟</label>
                    <div class="fieldValue">${api.renderPracticalText(entry.summary, entry.summary)}</div>
                  </div>
                ` : ''}
                ${entry.whyUse ? `
                  <div class="parameter-field">
                    <label>متى تفيد؟</label>
                    <div class="fieldValue">${api.renderPracticalText(entry.whyUse, entry.whyUse)}</div>
                  </div>
                ` : ''}
                ${entry.practicalBenefit ? `
                  <div class="parameter-field">
                    <label>الفائدة الفعلية</label>
                    <div class="fieldValue">${api.renderPracticalText(entry.practicalBenefit, entry.practicalBenefit)}</div>
                  </div>
                ` : ''}
                ${entry.complexity ? `
                  <div class="parameter-field">
                    <label>الكلفة أو السرعة</label>
                    <div class="fieldValue">${api.renderPracticalText(entry.complexity, entry.complexity)}</div>
                  </div>
                ` : ''}
                ${entry.code ? renderCppDocCodeContainer(entry.name, normalizeCppExampleCode(entry.code, item), 'cpp-member-operation-code') : ''}
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderCppConceptsSection(item) {
    const conceptCards = [
      {
        title: 'المعنى الحقيقي',
        body: api.renderPracticalText(item.practicalMeaning || item.description, item.description)
      },
      {
        title: 'ما الذي يغيّره في الكود؟',
        body: api.renderPracticalText(item.actualBehavior || item.usage, item.usage)
      },
      {
        title: 'أين يفيد فعليًا؟',
        body: api.renderPracticalText(item.benefit || item.projectContext || item.usage, item.usage)
      }
    ].filter((entry) => entry.body);

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>المفاهيم الأساسية</h2>
          <div class="cpp-concepts-grid">
            ${conceptCards.map((entry) => `
              <article class="cpp-concept-card">
                <h3>${api.escapeHtml(entry.title)}</h3>
                <div class="cpp-concept-card-body">${entry.body}</div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function resolveCppDeepGuide(name) {
    const token = String(name || '').trim();
    if (!token) {
      return null;
    }
    const guides = typeof api.getCppDeepGuides === 'function' ? api.getCppDeepGuides() : {};
    return guides?.[token] || null;
  }

  function renderCppGuideTermHints(termHints = []) {
    const entries = (Array.isArray(termHints) ? termHints : [])
      .map((entry) => ({
        label: String(entry?.label || '').trim(),
        tooltip: String(entry?.tooltip || '').trim()
      }))
      .filter((entry) => entry.label && entry.tooltip);

    if (!entries.length) {
      return '';
    }

    return `
      <div class="cpp-guide-term-hints">
        ${entries.map((entry) => `
          <span class="related-link related-link-static cpp-guide-term-chip" data-tooltip="${api.escapeAttribute(entry.tooltip)}" tabindex="0">
            ${api.escapeHtml(entry.label)}
          </span>
        `).join('')}
      </div>
    `;
  }

  function renderCppGuideSectionLinks(links = [], kind = 'section') {
    const entries = (Array.isArray(links) ? links : [])
      .map((entry) => ({
        id: String(entry?.id || '').trim(),
        label: String(entry?.label || '').trim()
      }))
      .filter((entry) => entry.id && entry.label);

    if (!entries.length) {
      return '';
    }

    return `
      <div class="see-also-links cpp-guide-inline-links cpp-guide-${api.escapeAttribute(kind)}-links">
        ${entries.map((entry) => `
          <a
            href="#"
            class="related-link"
            onclick="document.getElementById('${api.escapeAttribute(entry.id)}')?.scrollIntoView({behavior: 'smooth', block: 'start'}); return false;"
          >
            ${api.escapeHtml(entry.label)}
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderCppGuideTokenLinks(names = []) {
    const html = renderCppReferenceTokenListSafe(names);
    if (!html) {
      return '';
    }
    return `<div class="see-also-links cpp-guide-inline-links">${html}</div>`;
  }

  function renderCppGuideExample(example = {}, index = 0) {
    const fallbackLevelLabels = ['مثال بسيط', 'مثال عادي', 'مثال ذكي'];
    const title = String(example?.title || '').trim() || `مثال ${index + 1}`;
    const explanation = String(example?.explanation || '').trim();
    const code = String(example?.code || '').trim();
    const walkthrough = (Array.isArray(example?.walkthrough) ? example.walkthrough : [])
      .map((entry) => ({
        label: String(entry?.label || '').trim(),
        explanation: String(entry?.explanation || '').trim()
      }))
      .filter((entry) => entry.label && entry.explanation);
    const whyThisExample = String(example?.whyThisExample || '').trim();
    const relatedTokens = Array.isArray(example?.relatedTokens) ? example.relatedTokens : [];
    const termHints = Array.isArray(example?.termHints) ? example.termHints : [];

    return `
      <article class="parameter-detail-card cpp-guide-example-card">
        <div class="parameter-header">
          <span class="param-name">${api.escapeHtml(title)}</span>
          <span class="parameter-type">${api.escapeHtml(example?.level || fallbackLevelLabels[index] || `مثال ${index + 1}`)}</span>
        </div>
        ${explanation ? `<div class="fieldDescription cpp-guide-example-intro">${api.renderPracticalText(explanation, explanation)}</div>` : ''}
        ${whyThisExample ? `
          <div class="parameter-field cpp-guide-example-why">
            <label>لماذا هذا المثال؟</label>
            <div class="fieldValue">${api.renderPracticalText(whyThisExample, whyThisExample)}</div>
          </div>
        ` : ''}
        ${renderCppGuideTermHints(termHints)}
        ${renderCppDocCodeContainer(example?.codeTitle || 'الكود', code, 'cpp-guide-code-container')}
        ${walkthrough.length ? `
          <div class="cpp-guide-walkthrough">
            ${walkthrough.map((entry) => `
              <article class="cpp-guide-walkthrough-step">
                <h4>${api.escapeHtml(entry.label)}</h4>
                <p>${api.renderPracticalText(entry.explanation, entry.explanation)}</p>
              </article>
            `).join('')}
          </div>
        ` : ''}
        ${relatedTokens.length ? `
          <div class="parameter-field">
            <label>عناصر مرتبطة بالمثال</label>
            <div class="fieldValue">
              ${renderCppGuideTokenLinks(relatedTokens)}
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }

  function renderCppGuideConceptCard(concept = {}) {
    const relatedTokens = Array.isArray(concept?.relatedTokens) ? concept.relatedTokens : [];
    const relatedSections = Array.isArray(concept?.relatedSections) ? concept.relatedSections : [];
    const termHints = Array.isArray(concept?.termHints) ? concept.termHints : [];
    return `
      <article class="parameter-detail-card cpp-guide-concept-card">
        <div class="parameter-header">
          <span class="param-name">${api.escapeHtml(concept?.name || '')}</span>
          ${concept?.kind ? `<span class="parameter-type">${api.escapeHtml(concept.kind)}</span>` : ''}
        </div>
        ${concept?.whyNamed ? `
          <div class="parameter-field">
            <label>لماذا سُمّي هكذا؟</label>
            <div class="fieldValue">${api.renderPracticalText(concept.whyNamed, concept.whyNamed)}</div>
          </div>
        ` : ''}
        ${concept?.realMeaning ? `
          <div class="parameter-field">
            <label>المعنى الحقيقي</label>
            <div class="fieldValue">${api.renderPracticalText(concept.realMeaning, concept.realMeaning)}</div>
          </div>
        ` : ''}
        ${concept?.languageMeaning ? `
          <div class="parameter-field">
            <label>ماذا يقصد به داخل اللغة؟</label>
            <div class="fieldValue">${api.renderPracticalText(concept.languageMeaning, concept.languageMeaning)}</div>
          </div>
        ` : ''}
        ${concept?.whyUse ? `
          <div class="parameter-field">
            <label>لماذا نستخدمه؟</label>
            <div class="fieldValue">${api.renderPracticalText(concept.whyUse, concept.whyUse)}</div>
          </div>
        ` : ''}
        ${concept?.mentalModel ? `
          <div class="parameter-field">
            <label>كيف تفكر فيه ذهنيًا؟</label>
            <div class="fieldValue">${api.renderPracticalText(concept.mentalModel, concept.mentalModel)}</div>
          </div>
        ` : ''}
        ${renderCppGuideTermHints(termHints)}
        ${relatedTokens.length ? `
          <div class="parameter-field">
            <label>روابط داخلية مرتبطة</label>
            <div class="fieldValue">${renderCppGuideTokenLinks(relatedTokens)}</div>
          </div>
        ` : ''}
        ${relatedSections.length ? `
          <div class="parameter-field">
            <label>انتقل إلى موضوع قريب</label>
            <div class="fieldValue">${renderCppGuideSectionLinks(relatedSections, 'cross')}</div>
          </div>
        ` : ''}
      </article>
    `;
  }

  function renderCppDeepGuideSection(section = {}) {
    const concepts = Array.isArray(section?.concepts) ? section.concepts : [];
    const examples = Array.isArray(section?.examples) ? section.examples : [];
    const commonMistakes = Array.isArray(section?.commonMistakes) ? section.commonMistakes.filter(Boolean) : [];
    const useWhen = Array.isArray(section?.useWhen) ? section.useWhen.filter(Boolean) : [];
    const avoidWhen = Array.isArray(section?.avoidWhen) ? section.avoidWhen.filter(Boolean) : [];
    const relatedTokens = Array.isArray(section?.relatedTokens) ? section.relatedTokens : [];
    const relatedSections = Array.isArray(section?.relatedSections) ? section.relatedSections : [];
    const termHints = Array.isArray(section?.termHints) ? section.termHints : [];

    return `
      <section id="${api.escapeAttribute(section.id || '')}" class="info-section cpp-guide-section">
        <div class="content-card prose-card cpp-guide-section-shell">
          <div class="params-section-intro">
            <h2>${api.escapeHtml(section.title || '')}</h2>
            ${section?.summary ? `<p>${api.renderPracticalText(section.summary, section.summary)}</p>` : ''}
          </div>
          ${renderCppGuideTermHints(termHints)}
          ${concepts.length ? `
            <div class="cpp-guide-concept-grid">
              ${concepts.map((concept) => renderCppGuideConceptCard(concept)).join('')}
            </div>
          ` : ''}
          ${examples.length ? `
            <div class="cpp-guide-example-grid">
              ${examples.map((example, index) => renderCppGuideExample(example, index)).join('')}
            </div>
          ` : ''}
          ${commonMistakes.length ? `
            <section class="parameter-detail-card cpp-guide-list-card">
              <div class="parameter-header">
                <span class="param-name">أخطاء شائعة</span>
                <span class="parameter-type">انتبه هنا</span>
              </div>
              <ul class="best-practices-list">
                ${commonMistakes.map((entry) => `<li><p>${api.renderPracticalText(entry, entry)}</p></li>`).join('')}
              </ul>
            </section>
          ` : ''}
          ${(useWhen.length || avoidWhen.length) ? `
            <div class="cpp-guide-usage-split">
              ${useWhen.length ? `
                <section class="parameter-detail-card cpp-guide-list-card">
                  <div class="parameter-header">
                    <span class="param-name">متى نستخدمه؟</span>
                    <span class="parameter-type">استخدام مناسب</span>
                  </div>
                  <ul class="best-practices-list">
                    ${useWhen.map((entry) => `<li><p>${api.renderPracticalText(entry, entry)}</p></li>`).join('')}
                  </ul>
                </section>
              ` : ''}
              ${avoidWhen.length ? `
                <section class="parameter-detail-card cpp-guide-list-card">
                  <div class="parameter-header">
                    <span class="param-name">متى لا نستخدمه؟</span>
                    <span class="parameter-type">تجنب هذا</span>
                  </div>
                  <ul class="best-practices-list">
                    ${avoidWhen.map((entry) => `<li><p>${api.renderPracticalText(entry, entry)}</p></li>`).join('')}
                  </ul>
                </section>
              ` : ''}
            </div>
          ` : ''}
          ${(relatedTokens.length || relatedSections.length) ? `
            <section class="parameter-detail-card cpp-guide-links-card">
              <div class="parameter-header">
                <span class="param-name">روابط داخلية مرتبطة</span>
                <span class="parameter-type">تنقل سريع</span>
              </div>
              ${relatedTokens.length ? `
                <div class="parameter-field">
                  <label>عناصر لغوية قريبة</label>
                  <div class="fieldValue">${renderCppGuideTokenLinks(relatedTokens)}</div>
                </div>
              ` : ''}
              ${relatedSections.length ? `
                <div class="parameter-field">
                  <label>مواضيع أخرى داخل الصفحة</label>
                  <div class="fieldValue">${renderCppGuideSectionLinks(relatedSections)}</div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </div>
      </section>
    `;
  }

  function renderCppDeepGuidePage(guide = {}, options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const sections = Array.isArray(guide?.sections) ? guide.sections : [];
    const references = Array.isArray(guide?.officialReferences) ? guide.officialReferences : [];
    const summaryCards = Array.isArray(guide?.summaryCards) ? guide.summaryCards : [];
    const topicGroups = Array.isArray(guide?.topicGroups) ? guide.topicGroups : [];

    content.innerHTML = `
      <div class="reference-unified-detail-page cpp-deep-guide-page">
        <div class="page-header">
          <nav class="breadcrumb">
            <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
            <a href="#" onclick="showCppIndex(); return false;">مرجع C++</a> /
            <span>${api.escapeHtml(guide.title || 'دليل C++')}</span>
          </nav>
          <h1 class="page-title">${api.renderEntityIcon('cpp', 'ui-codicon page-icon', 'C++')} ${api.escapeHtml(guide.title || 'دليل C++')}</h1>
          <p class="page-description">${api.escapeHtml(guide.description || '')}</p>
        </div>

        <section class="info-section">
          ${api.renderTutorialInfoGrid([
            {
              label: 'نوع الصفحة',
              value: `<strong>${api.escapeHtml(guide.kindLabel || 'دليل تقني')}</strong>`,
              note: api.escapeHtml(guide.kindNote || 'يبني الفهم من داخل اللغة نفسها: الاسم، المعنى، الدور، وحدود الاستخدام.')
            },
            {
              label: 'منهج الشرح',
              value: api.renderPracticalText(guide.approach || '', guide.approach || ''),
              note: ''
            },
            {
              label: 'كيف تقرأ الصفحة',
              value: api.renderPracticalText(guide.readingHint || '', guide.readingHint || ''),
              note: ''
            }
          ])}
        </section>

        ${summaryCards.length ? `
          <section class="info-section">
            <div class="cpp-guide-summary-grid">
              ${summaryCards.map((entry) => `
                <article class="cpp-concept-card cpp-guide-summary-card">
                  <h3>${api.escapeHtml(entry.title || '')}</h3>
                  <div class="cpp-concept-card-body">${api.renderPracticalText(entry.body || '', entry.body || '')}</div>
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="info-section">
          <div class="content-card prose-card cpp-guide-toc-card">
            <h2>جدول المحتويات</h2>
            <div class="cpp-guide-toc-grid">
              ${sections.map((section, index) => `
                <button
                  type="button"
                  class="cpp-guide-toc-link"
                  onclick="document.getElementById('${api.escapeAttribute(section.id || '')}')?.scrollIntoView({behavior: 'smooth', block: 'start'})"
                >
                  <span class="cpp-guide-toc-index">${index + 1}</span>
                  <span>${api.escapeHtml(section.title || '')}</span>
                </button>
              `).join('')}
            </div>
            ${topicGroups.length ? `
              <div class="cpp-guide-topic-groups">
                ${topicGroups.map((group) => `
                  <section class="parameter-detail-card cpp-guide-topic-card">
                    <div class="parameter-header">
                      <span class="param-name">${api.escapeHtml(group.title || '')}</span>
                    </div>
                    ${renderCppGuideSectionLinks(group.links || [], 'topic')}
                  </section>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </section>

        ${sections.map((section) => renderCppDeepGuideSection(section)).join('')}

        ${references.length ? `
          <section class="info-section">
            <div class="content-card prose-card">
              <h2>المراجع الرسمية والمعتمدة</h2>
              <div class="cpp-guide-reference-list">
                ${references.map((entry) => `
                  <a href="${api.escapeAttribute(entry.href || '')}" class="related-link" target="_blank" rel="noopener noreferrer">
                    ${api.escapeHtml(entry.label || entry.href || '')}
                  </a>
                `).join('')}
              </div>
              ${guide.referencesNote ? `<p>${api.renderPracticalText(guide.referencesNote, guide.referencesNote)}</p>` : ''}
            </div>
          </section>
        ` : ''}
      </div>
    `;

    document.title = `${guide.title || 'دليل C++'} - ArabicVulkan`;
    const guideRoute = `cpp/${encodeURIComponent(String(guide.slug || 'cpp-language-guide'))}`;
    api.syncRouteHistory(guideRoute, {...options, deferRecentVisitCapture: true});
    api.scrollMainContentToTop();
    api.setActiveSidebarItemBySelector(
      'cpp-list',
      `.nav-item[data-nav-type="cpp"][data-nav-name="${api.escapeSelectorValue(String(guide.slug || 'cpp-language-guide'))}"]`
    );
    api.scheduleRecentVisitCapture(guideRoute);
    api.highlightCode();
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
    const deepGuide = resolveCppDeepGuide(itemName);
    if (deepGuide) {
      renderCppDeepGuidePage({
        slug: itemName,
        ...deepGuide
      }, options);
      return;
    }
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
            value: `<strong>${api.escapeHtml(item.type)}</strong>${item.typeMeaning ? `<p>${api.escapeHtml(item.typeMeaning)}</p>` : ''}`,
            note: ''
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
            label: 'ملف التضمين المعياري',
            value: renderCppIncludeValue(item),
            note: api.escapeHtml(item.includeHeaderNote || '')
          },
          {
            label: 'طريقة كتابة الاسم',
            value: renderCppNamespaceValue(item),
            note: api.escapeHtml(item.namespaceQualifierNote || '')
          },
          {
            label: 'كيف يظهر في الاستخدام الفعلي',
            value: api.renderPracticalText(item.projectContext || item.actualBehavior || item.usage, item.usage),
            note: item.referenceUrl ? api.renderExternalReference(item.title, {}, 'مرجع C++ الخارجي') : 'هذا الشرح محلي داخل المشروع.'
          }
        ].filter((entry) => String(entry?.value || '').trim()))}
      </section>

      ${renderCppConceptsSection(item)}

      ${renderCppMemberOperationsSection(item)}

      ${renderCppReferenceExamplesSection(item)}

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
    const itemRoute = `cpp/${encodeURIComponent(itemName)}`;
    api.syncRouteHistory(itemRoute, {...options, deferRecentVisitCapture: true});
    api.scrollMainContentToTop();
    api.setActiveSidebarItemBySelector(
      'cpp-list',
      `.nav-item[data-nav-type="cpp"][data-nav-name="${api.escapeSelectorValue(itemName)}"]`
    );
    api.scheduleRecentVisitCapture(itemRoute);
    api.highlightCode();
  }

  global.__ARABIC_VULKAN_GENERAL_DETAIL_PAGES__ = {
    configure,
    showTutorial,
    showFile,
    showCppReference
  };
})(window);
