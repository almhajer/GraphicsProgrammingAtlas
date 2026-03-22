(function(global) {
  'use strict';

  function createImguiExamplePreviewRuntime(api = {}) {
    const {
      IMGUI_EXAMPLE_GUIDES = {},
      escapeAttribute,
      escapeHtml,
      getAllImguiReferenceItems,
      getExamplePreviewIntro,
      getImguiKindMeta,
      getImguiReferenceItem,
      getImguiSectionIcon,
      getImguiStandaloneExampleItems,
      imguiReferenceSections = {},
      getRawSdl3CatalogExampleById,
      getRawVulkanCatalogExampleById,
      pickRandomExampleEntries,
      renderEntityIcon,
      renderImguiCodeBlock,
      renderImguiDocText,
      renderImguiEntityLink,
      renderImguiIndexCardPreview,
      renderLibraryExamplePreviewCard,
      renderLibraryExamplePreviewSection,
      renderRelatedReferenceLink,
      renderSdl3EntityLink,
      renderSdl3ReadyExamplePreview,
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanReadyExampleCodeBlock,
      summarizeExamplePreviewText,
      normalizeImguiExampleShotSource,
      buildImguiExampleShotDataUri
    } = api;

    function renderImguiExampleShot(item, example) {
      if (!example || !example.code) {
        return '';
      }
      const previewSrc = normalizeImguiExampleShotSource(buildImguiExampleShotDataUri(item), item);
      if (!previewSrc) {
        return '';
      }
      const caption = example.explanation || example.scenario || item.shortTooltip || '';
      return `
        <figure class="imgui-example-shot">
          <img src="${escapeAttribute(previewSrc)}" alt="${escapeAttribute(`معاينة ${item.name || 'المثال'}`)}" loading="lazy">
          ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
        </figure>
      `;
    }

    function getImguiExampleGuide(item = {}) {
      const name = String(item?.name || '').trim();
      if (!name) {
        return null;
      }

      return IMGUI_EXAMPLE_GUIDES[name] || null;
    }

    function renderImguiExamplePreviewMedia(item) {
      const example = item?.usageExample || null;
      if (!item || !example) {
        return '';
      }

      if (item?.sourceLibrary === 'vulkan' && item?.sourceExampleId) {
        const sourceExample = getRawVulkanCatalogExampleById(item.sourceExampleId);
        if (sourceExample) {
          return renderVulkanReadyExampleCodeBlock ? renderVulkanReadyExamplePreview(sourceExample) : '';
        }
      }

      if (item?.sourceLibrary === 'sdl3' && item?.sourcePackageKey && item?.sourceExampleId) {
        const sourceExample = getRawSdl3CatalogExampleById(item.sourcePackageKey, item.sourceExampleId);
        if (sourceExample) {
          return renderSdl3ReadyExamplePreview(sourceExample);
        }
      }

      const fullShot = renderImguiExampleShot(item, example);
      if (fullShot) {
        return fullShot;
      }

      const previewSrc = normalizeImguiExampleShotSource(buildImguiExampleShotDataUri(item), item);
      if (previewSrc) {
        return `
          <figure class="imgui-example-shot">
            <img src="${escapeAttribute(previewSrc)}" alt="${escapeAttribute(`معاينة ${item.name}`)}" loading="lazy">
            <figcaption>${escapeHtml(example.expectedResult || example.explanation || item.shortTooltip || item.name)}</figcaption>
          </figure>
        `;
      }

      return renderImguiIndexCardPreview(item, item.sectionKey || '');
    }

    function renderImguiExampleGuideEntry(entry = {}) {
      if (!entry || typeof entry !== 'object') {
        return '';
      }

      if ((entry.type === 'entity' || entry.type === 'reference') && entry.name) {
        return renderRelatedReferenceLink(entry.name, {tooltipContext: 'reference-summary'})
          || renderSdl3EntityLink(entry.name)
          || renderImguiEntityLink(entry.name, entry.name, {
            className: 'related-link code-token entity-link-with-icon',
            iconType: getImguiKindMeta(getImguiReferenceItem(entry.name)?.kind || 'type').icon
          })
          || '';
      }

      if (entry.type === 'example' && entry.name) {
        const label = entry.label || entry.name;
        const tooltip = `يفتح المثال التالي المقترح: ${label}`;
        return `<a href="#" class="related-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(label)}" onclick="showImguiExample('${escapeAttribute(entry.name)}'); return false;">${escapeHtml(label)}</a>`;
      }

      if (entry.href) {
        const label = entry.label || entry.href;
        return `<a href="${escapeAttribute(entry.href)}" class="related-link" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      }

      return '';
    }

    function renderImguiExampleOfficialGuidance(guide = null) {
      if (!guide) {
        return '';
      }

      const referenceLinks = (guide.officialReferences || [])
        .map((entry) => renderImguiExampleGuideEntry(entry))
        .filter(Boolean)
        .join('');

      if (!guide.officialSummaryArabic && !referenceLinks) {
        return '';
      }

      return `
        ${guide.officialSummaryArabic ? `<p><strong>لماذا يفيد هذا المرجع:</strong> ${renderImguiDocText(guide.officialSummaryArabic)}</p>` : ''}
        ${referenceLinks ? `<div class="see-also-links">${referenceLinks}</div>` : ''}
      `;
    }

    function renderImguiExampleProjectExpansion(guide = null) {
      if (!guide) {
        return '';
      }

      const steps = Array.isArray(guide.projectStepsArabic) ? guide.projectStepsArabic : [];
      const followUpLinks = (guide.followUpExamples || [])
        .map((entry) => renderImguiExampleGuideEntry(entry))
        .filter(Boolean)
        .join('');

      if (!guide.fullProjectNoteArabic && !steps.length && !followUpLinks) {
        return '';
      }

      return `
        ${guide.fullProjectNoteArabic ? `<p><strong>المعنى الحقيقي داخل المثال:</strong> ${renderImguiDocText(guide.fullProjectNoteArabic)}</p>` : ''}
        ${steps.length ? `
          <ul class="best-practices-list">
            ${steps.map((entry) => `<li><p>${renderImguiDocText(entry)}</p></li>`).join('')}
          </ul>
        ` : ''}
        ${followUpLinks ? `
          <p><strong>أمثلة متابعة مفيدة:</strong></p>
          <div class="see-also-links">${followUpLinks}</div>
        ` : ''}
      `;
    }

    function buildImguiExamplePageModel(item) {
      const example = item?.usageExample || null;
      const guide = getImguiExampleGuide(item);
      const sourceVulkanExample = item?.sourceLibrary === 'vulkan'
        ? getRawVulkanCatalogExampleById(item.sourceExampleId)
        : null;
      const sourceSdl3Example = item?.sourceLibrary === 'sdl3' && item?.sourcePackageKey && item?.sourceExampleId
        ? getRawSdl3CatalogExampleById(item.sourcePackageKey, item.sourceExampleId)
        : null;
      const isStandaloneExample = !!item?.sourceLibrary;
      const relatedLinks = (item?.related || [])
        .map((entryName) => {
          if (isStandaloneExample) {
            return renderRelatedReferenceLink(entryName, {tooltipContext: 'reference-summary'})
              || renderSdl3EntityLink(entryName)
              || renderImguiEntityLink(entryName, entryName, {
                className: 'related-link code-token entity-link-with-icon',
                iconType: getImguiKindMeta(getImguiReferenceItem(entryName)?.kind || 'type').icon
              });
          }

          return renderImguiEntityLink(entryName, entryName, {
            className: 'related-link code-token entity-link-with-icon',
            iconType: getImguiKindMeta(getImguiReferenceItem(entryName)?.kind || 'type').icon
          });
        })
        .filter(Boolean)
        .join('');
      const originValue = isStandaloneExample
        ? `<span class="related-link related-link-static">${renderEntityIcon(item.sourceLibrary === 'vulkan' ? 'command' : 'sdl3', 'ui-codicon list-icon', item.originLabel || 'الأصل')} ${escapeHtml(item.originLabel || 'مثال منقول')}</span>`
        : renderImguiEntityLink(item.name);
      const originNote = isStandaloneExample
        ? renderImguiDocText(item.originReason || '')
        : 'يمكنك العودة إلى صفحة العنصر الأصلية لرؤية الشرح الكامل للواجهة والمعاملات.';
      const codeHtml = sourceVulkanExample
        ? renderVulkanReadyExampleCodeBlock(sourceVulkanExample)
        : sourceSdl3Example
          ? renderVulkanReadyExampleCodeBlock(sourceSdl3Example)
          : renderImguiCodeBlock('الكود العملي المتكامل', example?.fullCode || example?.code);
      const pageGoalText = example?.scenario || item?.shortTooltip || item?.description || '';

      return {
        previewHtml: renderImguiExamplePreviewMedia(item),
        pageGoalText,
        goalMarkup: `<p>${renderImguiDocText(pageGoalText)}</p>`,
        codeHtml,
        explanationMarkup: example?.explanation ? `<h4>شرح مختصر للكود</h4><p>${renderImguiDocText(example.explanation)}</p>` : '',
        importantNoteMarkup: example?.importantNote ? `<h4>ملاحظة مهمة</h4><p>${renderImguiDocText(example.importantNote)}</p>` : '',
        expectedMarkup: `<p>${renderImguiDocText(example?.expectedResult || '')}</p>`,
        officialReferencesMarkup: renderImguiExampleOfficialGuidance(guide),
        projectExpansionMarkup: renderImguiExampleProjectExpansion(guide),
        originMarkup: `
          <p>${originValue}</p>
          ${originNote ? `<p>${originNote}</p>` : ''}
        `,
        relatedLinks
      };
    }

    function renderImguiExamplePageOverviewCard(item, options = {}) {
      const model = buildImguiExamplePageModel(item);
      return renderUnifiedExampleOverviewCard({
        goalHtml: model.goalMarkup,
        previewHtml: model.previewHtml,
        showPreview: options.showPreview
      });
    }

    function renderImguiExamplePageCodeSection(item) {
      const model = buildImguiExamplePageModel(item);
      const codeInteractionNote = 'العناصر البرمجية المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة توضّح نوع الكيان.';

      return renderUnifiedExampleSectionCard(
        'الكود الكامل أو شبه الكامل القابل للفهم',
        `
          <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
          ${model.codeHtml}
          ${model.explanationMarkup}
          ${model.importantNoteMarkup}
        `,
        'example-unified-code-card'
      );
    }

    function renderImguiExamplePageSupportGrid(item) {
      const model = buildImguiExamplePageModel(item);

      return `
        <div class="vulkan-ready-example-support-grid">
          ${renderUnifiedExampleSupportCard('العنصر الأصلي', model.originMarkup)}
          ${renderUnifiedExampleSupportCard('النتيجة المتوقعة', model.expectedMarkup)}
          ${model.officialReferencesMarkup ? renderUnifiedExampleSupportCard('مراجع رسمية للمثال', model.officialReferencesMarkup) : ''}
          ${model.projectExpansionMarkup ? renderUnifiedExampleSupportCard('كيف تطوره إلى مشروع كامل', model.projectExpansionMarkup) : ''}
          ${renderUnifiedExampleSupportCard(
            'العناصر المرتبطة',
            renderUnifiedExampleRelatedLinks(model.relatedLinks),
            'vulkan-ready-example-related-card'
          )}
        </div>
      `;
    }

    function getImguiExampleEntries(options = {}) {
      const referenceEntries = getAllImguiReferenceItems()
        .filter((item) => item?.usageExample)
        .map((item) => ({
          id: item.name,
          title: `مثال ${item.name}`,
          summary: summarizeExamplePreviewText(item.usageExample.scenario || item.shortTooltip || item.usageExample.explanation || '', 22),
          previewHtml: renderImguiExamplePreviewMedia(item),
          openAction: `showImguiExample('${escapeAttribute(item.name)}')`
        }));
      const standaloneEntries = getImguiStandaloneExampleItems().map((item) => ({
        id: item.name,
        title: item.name,
        summary: summarizeExamplePreviewText(item.usageExample?.scenario || item.shortTooltip || item.description || '', 22),
        previewHtml: renderImguiExamplePreviewMedia(item),
        openAction: `showImguiExample('${escapeAttribute(item.name)}')`
      }));
      const entries = [...referenceEntries, ...standaloneEntries];

      if (options.randomize) {
        return pickRandomExampleEntries(entries, options.limit || entries.length);
      }

      return typeof options.limit === 'number' && options.limit > 0
        ? entries.slice(0, options.limit)
        : entries;
    }

    function getGroupedImguiExampleItems() {
      const referenceItems = getAllImguiReferenceItems().filter((item) => item?.usageExample);
      const standaloneItems = getImguiStandaloneExampleItems();
      const allItems = [...referenceItems, ...standaloneItems];
      const groups = [];
      const orderedSectionKeys = [...new Set([
        ...Object.keys(imguiReferenceSections || {}),
        'integrations'
      ])];

      orderedSectionKeys.forEach((sectionKey) => {
        const items = allItems.filter((item) => String(item.sectionKey || '').trim() === sectionKey);
        if (!items.length) {
          return;
        }

        const section = imguiReferenceSections?.[sectionKey] || {};
        groups.push({
          key: sectionKey,
          title: section.title || items[0]?.sectionTitle || 'قسم أمثلة Dear ImGui',
          note: sectionKey === 'integrations'
            ? 'يجمع الأمثلة التي يكون فيها Dear ImGui هو جوهر الفكرة حتى لو جاءت من SDL3 أو Vulkan.'
            : `أمثلة عملية تشرح ${section.title || items[0]?.sectionTitle || 'هذا القسم'} داخل Dear ImGui عبر صفحات مستقلة.`,
          items
        });
      });

      return groups;
    }

    function renderImguiExamplesGroupedIndexSection() {
      const groups = getGroupedImguiExampleItems();
      if (!groups.length) {
        return '';
      }

      return `
        <section class="category-section library-example-preview-section imgui-example-groups-section" id="imgui-examples-index-grid">
          <div class="library-example-preview-header">
            <div class="library-example-preview-heading">
              <h2>كتل أمثلة Dear ImGui</h2>
              <p>أعيد توزيع أمثلة Dear ImGui إلى مجموعات تعليمية بحسب النوافذ والعناصر والتخطيط والتكاملات، حتى تصبح أقرب في التصفح إلى أمثلة فولكان.</p>
            </div>
          </div>
          <div class="vulkan-example-clusters">
            ${groups.map((group, index) => `
              <details class="content-card prose-card vulkan-example-cluster imgui-example-cluster"${index === 0 ? ' open' : ''}>
                <summary class="vulkan-example-cluster-summary">
                  <span class="vulkan-example-cluster-title-wrap">
                    <span class="vulkan-example-cluster-title">${renderEntityIcon(getImguiSectionIcon(group.key), 'ui-codicon list-icon', group.title)} ${escapeHtml(group.title)}</span>
                    <span class="vulkan-example-cluster-count">${group.items.length} مثال</span>
                  </span>
                  <span class="vulkan-example-cluster-note">${escapeHtml(group.note)}</span>
                </summary>
                <div class="vulkan-example-cluster-body">
                  <p class="vulkan-example-cluster-body-note">اختر المثال الذي يطابق العنصر أو الواجهة أو التكامل الذي تريد فهمه عمليًا.</p>
                  <div class="library-example-preview-grid">
                    ${group.items.map((item) => renderLibraryExamplePreviewCard({
                      id: item.name,
                      title: item.name,
                      summary: summarizeExamplePreviewText(item.usageExample?.scenario || item.shortTooltip || item.description || '', 24),
                      previewHtml: renderImguiExamplePreviewMedia(item),
                      openAction: `showImguiExample('${escapeAttribute(item.name)}')`
                    })).join('')}
                  </div>
                </div>
              </details>
            `).join('')}
          </div>
        </section>
      `;
    }

    function renderImguiExamplesPreviewSection(options = {}) {
      return renderLibraryExamplePreviewSection({
        sectionId: options.sectionId || 'imgui-examples',
        title: options.title || 'أمثلة',
        intro: options.intro || getExamplePreviewIntro('imgui'),
        browseAction: options.browseAction || 'showImguiExamplesIndex()',
        browseLabel: options.browseLabel || 'كل أمثلة Dear ImGui',
        examples: getImguiExampleEntries({
          limit: options.limit,
          randomize: options.randomize
        })
      });
    }

    return {
      renderImguiExampleShot,
      renderImguiExamplePreviewMedia,
      buildImguiExamplePageModel,
      getImguiExampleGuide,
      renderImguiExampleGuideEntry,
      renderImguiExampleOfficialGuidance,
      renderImguiExampleProjectExpansion,
      renderImguiExamplePageOverviewCard,
      renderImguiExamplePageCodeSection,
      renderImguiExamplePageSupportGrid,
      getImguiExampleEntries,
      getGroupedImguiExampleItems,
      renderImguiExamplesGroupedIndexSection,
      renderImguiExamplesPreviewSection
    };
  }

  global.__ARABIC_VULKAN_IMGUI_EXAMPLE_PREVIEW_RUNTIME__ = {
    createImguiExamplePreviewRuntime
  };
})(window);
