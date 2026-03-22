(function(global) {
  'use strict';

  function createSdl3ExamplePreviewRuntime(api = {}) {
    const {
      SDL3_EXAMPLE_GUIDES = {},
      escapeAttribute,
      escapeHtml,
      getExamplePreviewIntro,
      getGroupedSdl3ReadyExamples,
      getSdl3PackageInfo,
      getSdl3ReadyExamples,
      pickRandomExampleEntries,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderSdl3EntityLink,
      renderSdl3ReadyExamplePreview,
      summarizeExamplePreviewText
    } = api;

    function buildSdl3ExampleCompositeName(packageKey = 'core', exampleId = '') {
      return `${String(packageKey || 'core')}::${String(exampleId || '').trim()}`;
    }

    function parseSdl3ExampleCompositeName(value = '') {
      const [packageKey = 'core', exampleId = ''] = String(value || '').split('::');
      return {
        packageKey: packageKey || 'core',
        exampleId
      };
    }

    function getSdl3ReadyExampleById(packageKey = 'core', exampleId = '') {
      return getSdl3ReadyExamples(packageKey).find((example) => example.id === exampleId) || null;
    }

    function buildSdl3ExampleGuideKey(packageKey = 'core', exampleId = '') {
      return `${String(packageKey || 'core').trim() || 'core'}::${String(exampleId || '').trim()}`;
    }

    function getSdl3ExampleGuide(example = {}) {
      const packageKey = String(example?.packageKey || 'core').trim() || 'core';
      const exampleId = String(example?.id || '').trim();
      if (!exampleId) {
        return null;
      }

      return SDL3_EXAMPLE_GUIDES[buildSdl3ExampleGuideKey(packageKey, exampleId)] || null;
    }

    function renderSdl3ExampleGuideEntry(entry = {}) {
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      if (entry.type === 'entity' && entry.name) {
        return renderSdl3EntityLink(entry.name) || '';
      }

      if (entry.packageKey && entry.exampleId) {
        const packageKey = String(entry.packageKey || 'core').trim() || 'core';
        const exampleId = String(entry.exampleId || '').trim();
        const targetExample = getSdl3ReadyExampleById(packageKey, exampleId);
        const label = entry.label || targetExample?.title || exampleId;
        const tooltip = `يفتح المثال التالي المقترح: ${label}`;
        return `<a href="#" class="related-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(label)}" onclick="showSdl3Example('${escapeAttribute(packageKey)}', '${escapeAttribute(exampleId)}'); return false;">${escapeHtml(label)}</a>`;
      }

      if (entry.href) {
        const label = entry.label || entry.href;
        return `<a href="${escapeAttribute(entry.href)}" class="related-link" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      }

      return '';
    }

    function renderSdl3ExampleOfficialGuidance(guide = null) {
      if (!guide) {
        return '';
      }

      const referenceLinks = (guide.officialReferences || [])
        .map((entry) => renderSdl3ExampleGuideEntry(entry))
        .filter(Boolean)
        .join('');
      const notes = (guide.officialReferences || [])
        .map((entry) => String(entry.noteArabic || '').trim())
        .filter(Boolean);

      if (!referenceLinks && !guide.officialSummaryArabic && !notes.length) {
        return '';
      }

      return `
        ${guide.officialSummaryArabic ? `<p><strong>لماذا يفيد هذا المرجع:</strong> ${escapeHtml(guide.officialSummaryArabic)}</p>` : ''}
        ${referenceLinks ? `<div class="see-also-links sdl3-see-also-list">${referenceLinks}</div>` : ''}
        ${notes.length ? `
          <ul class="best-practices-list">
            ${notes.map((entry) => `<li><p>${escapeHtml(entry)}</p></li>`).join('')}
          </ul>
        ` : ''}
      `;
    }

    function renderSdl3ExampleProjectExpansion(guide = null) {
      if (!guide) {
        return '';
      }

      const steps = Array.isArray(guide.projectStepsArabic) ? guide.projectStepsArabic : [];
      const followUpLinks = (guide.followUpExamples || [])
        .map((entry) => renderSdl3ExampleGuideEntry(entry))
        .filter(Boolean)
        .join('');

      if (!guide.fullProjectNoteArabic && !steps.length && !followUpLinks) {
        return '';
      }

      return `
        ${guide.fullProjectNoteArabic ? `<p><strong>المعنى الحقيقي داخل المثال:</strong> ${escapeHtml(guide.fullProjectNoteArabic)}</p>` : ''}
        ${steps.length ? `
          <ul class="best-practices-list">
            ${steps.map((entry) => `<li><p>${escapeHtml(entry)}</p></li>`).join('')}
          </ul>
        ` : ''}
        ${followUpLinks ? `
          <p><strong>أمثلة متابعة مفيدة:</strong></p>
          <div class="see-also-links sdl3-see-also-list">${followUpLinks}</div>
        ` : ''}
      `;
    }

    function getSdl3ExamplePreviewEntries(packageKey = 'core', options = {}) {
      const entries = getSdl3ReadyExamples(packageKey).map((example) => ({
        id: buildSdl3ExampleCompositeName(packageKey, example.id),
        title: example.title,
        summary: summarizeExamplePreviewText(example.goal || example.expectedResult || '', 22),
        previewHtml: renderSdl3ReadyExamplePreview(example),
        openAction: `showSdl3Example('${escapeAttribute(packageKey)}', '${escapeAttribute(example.id)}')`
      }));

      if (options.randomize) {
        return pickRandomExampleEntries(entries, options.limit || entries.length);
      }

      return typeof options.limit === 'number' && options.limit > 0
        ? entries.slice(0, options.limit)
        : entries;
    }

    function renderSdl3ExamplesPreviewSection(packageKey = 'core', options = {}) {
      const packageInfo = getSdl3PackageInfo(packageKey);
      const title = options.title || 'أمثلة';
      const intro = options.intro || getExamplePreviewIntro('sdl3-default', {
        displayName: packageInfo?.displayName || 'SDL3'
      });
      const resolvedIntro = packageKey === 'core'
        ? getExamplePreviewIntro('sdl3Core')
        : intro;

      return renderLibraryExamplePreviewSection({
        sectionId: options.sectionId || `sdl3-${packageKey}-examples`,
        title,
        intro: resolvedIntro,
        browseAction: options.browseAction || `showSdl3ExamplesIndex('${escapeAttribute(packageKey)}')`,
        browseLabel: options.browseLabel || `كل أمثلة ${packageInfo?.displayName || 'SDL3'}`,
        examples: getSdl3ExamplePreviewEntries(packageKey, {
          limit: options.limit,
          randomize: options.randomize
        })
      });
    }

    function renderSdl3ExamplesGroupedIndexSection(packageKey = 'core') {
      const packageInfo = getSdl3PackageInfo(packageKey);
      const groups = getGroupedSdl3ReadyExamples(packageKey);
      if (!groups.length) {
        return '';
      }

      return `
        <section class="category-section library-example-preview-section sdl3-example-groups-section" id="sdl3-${escapeAttribute(packageKey)}-examples-index-grid">
          <div class="library-example-preview-header">
            <div class="library-example-preview-heading">
              <h2>كتل أمثلة ${escapeHtml(packageInfo?.displayName || 'SDL3')}</h2>
              <p>أعيد توزيع أمثلة هذا الفرع إلى مسارات تعليمية قابلة للفتح والإغلاق حتى تبقى الصفحة أوضح من قائمة واحدة طويلة، مع الحفاظ على بطاقات المعاينة نفسها.</p>
            </div>
          </div>
          <div class="vulkan-example-clusters">
            ${groups.map((group, index) => `
              <details class="content-card prose-card vulkan-example-cluster sdl3-example-cluster"${index === 0 ? ' open' : ''}>
                <summary class="vulkan-example-cluster-summary">
                  <span class="vulkan-example-cluster-title-wrap">
                    <span class="vulkan-example-cluster-title">${escapeHtml(group.title)}</span>
                    <span class="vulkan-example-cluster-count">${group.examples.length} مثال</span>
                  </span>
                  <span class="vulkan-example-cluster-note">${escapeHtml(group.description)}</span>
                </summary>
                <div class="vulkan-example-cluster-body">
                  <p class="vulkan-example-cluster-body-note">يعرض هذا المسار أمثلة ${escapeHtml(packageInfo?.displayName || 'SDL3')} التي تتقاطع في نفس الفكرة التعليمية أو النمط العملي.</p>
                  <div class="library-example-preview-grid">
                    ${group.examples.map((example) => renderLibraryExamplePreviewCard({
                      id: buildSdl3ExampleCompositeName(packageKey, example.id),
                      title: example.title,
                      summary: summarizeExamplePreviewText(example.goal || example.expectedResult || '', 24),
                      previewHtml: renderSdl3ReadyExamplePreview(example),
                      openAction: `showSdl3Example('${escapeAttribute(packageKey)}', '${escapeAttribute(example.id)}')`
                    })).join('')}
                  </div>
                </div>
              </details>
            `).join('')}
          </div>
        </section>
      `;
    }

    return {
      buildSdl3ExampleCompositeName,
      parseSdl3ExampleCompositeName,
      getSdl3ReadyExampleById,
      buildSdl3ExampleGuideKey,
      getSdl3ExampleGuide,
      renderSdl3ExampleGuideEntry,
      renderSdl3ExampleOfficialGuidance,
      renderSdl3ExampleProjectExpansion,
      getSdl3ExamplePreviewEntries,
      renderSdl3ExamplesPreviewSection,
      renderSdl3ExamplesGroupedIndexSection
    };
  }

  global.__ARABIC_VULKAN_SDL3_EXAMPLE_PREVIEW_RUNTIME__ = {
    createSdl3ExamplePreviewRuntime
  };
})(window);
