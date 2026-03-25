(function(global) {
  'use strict';

  function createVulkanExamplePreviewRuntime(api = {}) {
    const {
      VULKAN_EXAMPLE_GUIDES = {},
      escapeAttribute,
      escapeHtml,
      getExamplePreviewIntro,
      getGroupedVulkanReadyExamples,
      getOrderedVulkanReadyExamples,
      getVulkanExampleDisplayTitle,
      pickRandomExampleEntries,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderRelatedReferenceLink,
      renderVulkanReadyExamplePreview
    } = api;

    function summarizeExamplePreviewText(text = '', maxWords = 24) {
      const clean = sanitizeTooltipText(text)
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) {
        return '';
      }

      const words = clean.split(/\s+/).filter(Boolean);
      if (words.length <= maxWords) {
        return clean;
      }

      return `${words.slice(0, maxWords).join(' ')}...`;
    }

    function getVulkanReadyExampleById(exampleId = '') {
      const normalizedId = String(exampleId || '').trim();
      if (!normalizedId) {
        return null;
      }

      return getOrderedVulkanReadyExamples().find((example) =>
        example.id === normalizedId
        || ((example.aliases || []).includes(normalizedId))
      ) || null;
    }

    function getVulkanExampleGuide(example = {}) {
      const exampleId = String(example?.id || '').trim();
      if (!exampleId) {
        return null;
      }

      return VULKAN_EXAMPLE_GUIDES[exampleId] || null;
    }

    function renderVulkanExampleGuideEntry(entry = {}) {
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      if (entry.type === 'reference' && entry.name) {
        return renderRelatedReferenceLink(entry.name, {tooltipContext: 'reference-summary'}) || '';
      }

      if (entry.type === 'example' && entry.id) {
        const targetExample = getVulkanReadyExampleById(entry.id);
        const label = entry.label || getVulkanExampleDisplayTitle(targetExample || {id: entry.id, title: entry.id});
        const tooltip = `يفتح المثال التالي المقترح: ${label}`;
        return `<a href="#" class="related-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(label)}" onclick="showVulkanExample('${escapeAttribute(entry.id)}'); return false;">${escapeHtml(label)}</a>`;
      }

      if (entry.href) {
        const label = entry.label || entry.href;
        return `<a href="${escapeAttribute(entry.href)}" class="related-link" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      }

      return '';
    }

    function renderVulkanExampleOfficialGuidance(guide = null) {
      if (!guide) {
        return '';
      }

      const referenceLinks = (guide.officialReferences || [])
        .map((entry) => renderVulkanExampleGuideEntry(entry))
        .filter(Boolean)
        .join('');

      if (!guide.officialSummaryArabic && !referenceLinks) {
        return '';
      }

      return `
        ${guide.officialSummaryArabic ? `<p><strong>لماذا يفيد هذا المرجع:</strong> ${escapeHtml(guide.officialSummaryArabic)}</p>` : ''}
        ${referenceLinks ? `<div class="see-also-links">${referenceLinks}</div>` : ''}
      `;
    }

    function renderVulkanExampleProjectExpansion(guide = null) {
      if (!guide) {
        return '';
      }

      const steps = Array.isArray(guide.projectStepsArabic) ? guide.projectStepsArabic : [];
      const followUpLinks = (guide.followUpExamples || [])
        .map((entry) => renderVulkanExampleGuideEntry(entry))
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
          <div class="see-also-links">${followUpLinks}</div>
        ` : ''}
      `;
    }

    function getVulkanExamplePreviewEntries(options = {}) {
      const entries = getOrderedVulkanReadyExamples().map((example) => ({
        id: example.id,
        title: getVulkanExampleDisplayTitle(example),
        summary: summarizeExamplePreviewText(example.goal || example.expectedResult || '', 22),
        previewHtml: renderVulkanReadyExamplePreview(example),
        openAction: `showVulkanExample('${escapeAttribute(example.id)}')`
      }));

      if (options.randomize) {
        return pickRandomExampleEntries(entries, options.limit || entries.length);
      }

      return typeof options.limit === 'number' && options.limit > 0
        ? entries.slice(0, options.limit)
        : entries;
    }

    function renderVulkanExamplesGroupedIndexSection() {
      const groups = getGroupedVulkanReadyExamples();
      if (!groups.length) {
        return '';
      }

      return `
        <section class="category-section library-example-preview-section vulkan-example-groups-section" id="vulkan-examples-index-grid">
          <div class="library-example-preview-header">
            <div class="library-example-preview-heading">
              <h2>كتل أمثلة فولكان</h2>
              <p>جُمعت الأمثلة هنا إلى مسارات قابلة للفتح والإغلاق حتى تبقى الصفحة أسهل في التصفح من قائمة واحدة طويلة. افتح الكتلة المناسبة ثم انتقل إلى المثال الكامل.</p>
            </div>
          </div>
          <div class="vulkan-example-clusters">
            ${groups.map((group, index) => `
              <details class="content-card prose-card vulkan-example-cluster"${index === 0 ? ' open' : ''}>
                <summary class="vulkan-example-cluster-summary">
                  <span class="vulkan-example-cluster-title-wrap">
                    <span class="vulkan-example-cluster-title">${escapeHtml(group.title)}</span>
                    <span class="vulkan-example-cluster-count">${group.examples.length} مثال</span>
                  </span>
                  <span class="vulkan-example-cluster-note">${escapeHtml(group.description)}</span>
                </summary>
                <div class="vulkan-example-cluster-body">
                  <p class="vulkan-example-cluster-body-note">${escapeHtml(group.note || group.description)}</p>
                  <div class="library-example-preview-grid">
                    ${group.examples.map((example) => renderLibraryExamplePreviewCard({
                      id: example.id,
                      title: getVulkanExampleDisplayTitle(example),
                      summary: summarizeExamplePreviewText(example.goal || example.expectedResult || '', 24),
                      previewHtml: renderVulkanReadyExamplePreview(example),
                      openAction: `showVulkanExample('${escapeAttribute(example.id)}')`
                    })).join('')}
                  </div>
                </div>
              </details>
            `).join('')}
          </div>
        </section>
      `;
    }

    function renderVulkanExamplesPreviewSection(options = {}) {
      return renderLibraryExamplePreviewSection({
        sectionId: options.sectionId || 'vulkan-examples',
        title: options.title || 'أمثلة',
        intro: options.intro || getExamplePreviewIntro('vulkan'),
        browseAction: options.browseAction || 'showVulkanExamplesIndex()',
        browseLabel: options.browseLabel || 'كل أمثلة فولكان',
        examples: getVulkanExamplePreviewEntries({
          limit: options.limit,
          randomize: options.randomize
        })
      });
    }

    return {
      summarizeExamplePreviewText,
      getVulkanReadyExampleById,
      getVulkanExampleGuide,
      renderVulkanExampleGuideEntry,
      renderVulkanExampleOfficialGuidance,
      renderVulkanExampleProjectExpansion,
      getVulkanExamplePreviewEntries,
      renderVulkanExamplesGroupedIndexSection,
      renderVulkanExamplesPreviewSection
    };
  }

  global.__ARABIC_VULKAN_VULKAN_EXAMPLE_PREVIEW_RUNTIME__ = {
    createVulkanExamplePreviewRuntime
  };
})(window);
