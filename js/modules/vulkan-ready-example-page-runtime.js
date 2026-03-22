(function(global) {
  'use strict';

  function createVulkanReadyExamplePageRuntime(api = {}) {
    const {
      escapeHtml,
      getOrderedVulkanReadyExamples,
      getVulkanExampleDisplayTitle,
      linkUsageBridgeText,
      renderCommandSnippet,
      renderDetailedExampleExplanation,
      renderHighlightedCode,
      renderRelatedReferenceLink,
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanExampleOfficialGuidance,
      renderVulkanExampleProjectExpansion,
      renderVulkanReadyExamplePreview,
      renderDocCodeContainer,
      renderEntityIcon,
      buildExampleAnalysis,
      buildVulkanExampleConcepts,
      buildVulkanExampleExecutionFlow,
      buildVulkanExampleLearningItems,
      buildVulkanExampleLineExplanationRows,
      buildVulkanExampleLocalSymbolMap,
      buildVulkanExamplePurposeParagraphs,
      buildVulkanExampleReferenceNames,
      buildVulkanExampleRequirements,
      collectVulkanExampleLocalSymbols,
      mergeUniqueTeachingItems
    } = api;

    function renderVulkanReadyExampleCodeBlock(example) {
      const displayTitle = getVulkanExampleDisplayTitle(example);
      const localSymbolMap = buildVulkanExampleLocalSymbolMap(example);
      return renderDocCodeContainer({
        titleHtml: `${renderEntityIcon('command', 'ui-codicon list-icon', displayTitle || 'Vulkan')} الكود التطبيقي للمثال`,
        rawCode: example.code || '',
        renderedCodeHtml: renderHighlightedCode(example.code || '', {
          language: 'cpp',
          annotate: true,
          localSymbolMap
        }),
        language: 'cpp',
        containerClassName: 'example-section tutorial-example-section vulkan-ready-example-code',
        preClassName: 'vulkan-ready-example-pre',
        codeClassName: 'vulkan-signature-code',
        allowCopy: true,
        allowToggle: true,
        skipHighlight: true
      });
    }

    function renderVulkanReadyExampleExplanation(example) {
      const displayTitle = getVulkanExampleDisplayTitle(example);
      const analysisItem = {
        ...example,
        name: displayTitle,
        description: example.goal || '',
        notes: mergeUniqueTeachingItems(example.highlights || [], [example.expectedResult ? `النتيجة العملية للمثال: ${example.expectedResult}` : ''])
      };
      const analysis = buildExampleAnalysis(example.code || '', analysisItem);
      const localSymbols = collectVulkanExampleLocalSymbols(example);
      const localSymbolMap = buildVulkanExampleLocalSymbolMap(example);

      return renderDetailedExampleExplanation(analysisItem, {
        kindLabel: 'مثال فولكان',
        example: example.code || '',
        anchorPrefix: example.id || displayTitle,
        sectionedCards: true,
        purpose: example.goal || '',
        purposeParagraphs: buildVulkanExamplePurposeParagraphs(example),
        requirements: buildVulkanExampleRequirements(example),
        learningItems: buildVulkanExampleLearningItems(example),
        concepts: buildVulkanExampleConcepts(example),
        flowSteps: buildVulkanExampleExecutionFlow(example),
        lineExplanationRows: buildVulkanExampleLineExplanationRows(example, analysis),
        referenceNames: buildVulkanExampleReferenceNames(example, analysis, localSymbols),
        undocumentedSymbols: localSymbols,
        localSymbolMap,
        notes: mergeUniqueTeachingItems(
          example.highlights || [],
          [example.expectedResult ? `النتيجة الواضحة من تنفيذ المثال: ${example.expectedResult}` : '']
        ),
        usageItems: [],
        sectionTitles: {
          header: '🧩 الشرح التعليمي للمثال',
          constants: 'الثوابت المستخدمة في هذا الدرس',
          concepts: 'شرح الموضوعات التقنية المرتبطة بالمثال',
          notes: 'ملاحظات إضافية'
        },
        visibleSections: {
          usageBridge: false
        }
      });
    }

    function renderVulkanReadyExamplePageOverviewCard(example, options = {}) {
      return renderUnifiedExampleOverviewCard({
        goalHtml: `<p>${linkUsageBridgeText(example.goal || '')}</p>`,
        previewHtml: renderVulkanReadyExamplePreview(example),
        showPreview: options.showPreview
      });
    }

    function renderVulkanReadyExamplePageCodeSection(example) {
      const codeInteractionNote = 'العناصر البرمجية المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة توضّح نوع الكيان.';
      return renderUnifiedExampleSectionCard(
        'الكود الكامل أو شبه الكامل القابل للفهم',
        `
          <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
          ${renderVulkanReadyExampleCodeBlock(example)}
        `,
        'example-unified-code-card'
      );
    }

    function renderVulkanReadyExamplePageCommandsSection(example) {
      const commandBlocks = Array.isArray(example.commandBlocks) ? example.commandBlocks : [];
      if (!commandBlocks.length) {
        return '';
      }

      return renderUnifiedExampleSectionCard(
        'أوامر أو خطوات مساندة',
        `
          <div class="example-command-grid">
            ${commandBlocks.map((block) => renderCommandSnippet(
              block.title || 'Command',
              block.code || '',
              block.language || 'bash',
              block.iconType || 'command'
            )).join('')}
          </div>
        `
      );
    }

    function renderVulkanReadyExamplePageSupportGrid(example) {
      const guide = api.getVulkanExampleGuide(example);
      const relatedLinks = (example.related || [])
        .map((name) => renderRelatedReferenceLink(name, {tooltipContext: 'reference-summary'}))
        .join('');

      return `
        <div class="vulkan-ready-example-support-grid">
          ${(example.highlights || []).length ? renderUnifiedExampleSupportCard(
            'شرح الأجزاء المهمة',
            `
              <ul class="best-practices-list">
                ${(example.highlights || []).map((entry) => `<li>${linkUsageBridgeText(entry)}</li>`).join('')}
              </ul>
            `
          ) : ''}

          ${renderUnifiedExampleSupportCard(
            'النتيجة المتوقعة',
            `<p>${linkUsageBridgeText(example.expectedResult || '')}</p>`
          )}

          ${renderUnifiedExampleSupportCard(
            'مراجع رسمية للمثال',
            renderVulkanExampleOfficialGuidance(guide)
          )}

          ${renderUnifiedExampleSupportCard(
            'كيف تطوره إلى مشروع كامل',
            renderVulkanExampleProjectExpansion(guide)
          )}

          ${renderUnifiedExampleSupportCard(
            'العناصر المرتبطة',
            renderUnifiedExampleRelatedLinks(relatedLinks),
            'vulkan-ready-example-related-card'
          )}
        </div>
      `;
    }

    function renderVulkanReadyExampleCard(example, options = {}) {
      const relatedLinks = (example.related || [])
        .map((name) => renderRelatedReferenceLink(name, {tooltipContext: 'reference-summary'}))
        .join('');
      const commandBlocks = Array.isArray(example.commandBlocks) ? example.commandBlocks : [];
      const showPreview = options.showPreview !== false;
      const standalone = options.standalone === true;
      const wrapperClassName = standalone
        ? 'vulkan-ready-example-card vulkan-ready-example-card-plain'
        : 'content-card prose-card vulkan-ready-example-card';
      const overviewMarkup = `
        <div class="content-card prose-card vulkan-ready-example-overview-card">
          <h4>نظرة سريعة</h4>
          <p>${linkUsageBridgeText(example.goal || '')}</p>
        </div>
      `;
      const explanationHtml = renderVulkanReadyExampleExplanation(example);

      return `
        <article class="${wrapperClassName}">
          ${showPreview ? `
          <div class="vulkan-ready-example-body">
            ${overviewMarkup}
            ${renderVulkanReadyExamplePreview(example)}
          </div>
          ` : overviewMarkup}

          <div class="vulkan-ready-example-code-wrap">
            ${renderVulkanReadyExampleCodeBlock(example)}
          </div>

          ${commandBlocks.length ? `
            <h4>أوامر أو خطوات مساندة</h4>
            <div class="example-command-grid">
              ${commandBlocks.map((block) => renderCommandSnippet(
                block.title || 'Command',
                block.code || '',
                block.language || 'bash',
                block.iconType || 'command'
              )).join('')}
            </div>
          ` : ''}

          <div class="vulkan-ready-example-support-grid">
            <div class="content-card prose-card vulkan-ready-example-support-card">
              <h4>النتيجة المتوقعة</h4>
              <p>${linkUsageBridgeText(example.expectedResult || '')}</p>
            </div>

            ${(example.highlights || []).length ? `
            <div class="content-card prose-card vulkan-ready-example-support-card">
              <h4>نقاط مهمة قبل الدخول في الشرح</h4>
              <ul class="best-practices-list">
                ${(example.highlights || []).map((entry) => `<li>${linkUsageBridgeText(entry)}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div class="content-card prose-card vulkan-ready-example-support-card vulkan-ready-example-related-card">
              <h4>العناصر المرتبطة</h4>
              <div class="see-also-links">${relatedLinks || '<span class="related-link related-link-static">لا توجد عناصر مرتبطة إضافية.</span>'}</div>
            </div>
          </div>

          ${explanationHtml}
        </article>
      `;
    }

    function renderVulkanReadyExamplesSection() {
      const orderedExamples = getOrderedVulkanReadyExamples();
      return `
        <section class="home-section vulkan-ready-examples-section" id="vulkan-ready-examples">
          <h2>🧪 أمثلة فولكان الجاهزة</h2>
          <div class="content-card prose-card vulkan-ready-examples-intro">
            <p>${linkUsageBridgeText('يجمع هذا القسم الآن أمثلة فولكان نفسها بشكل أوضح: إنشاء VkInstance، ثم اختيار VkPhysicalDevice، ثم بناء VkDevice وVkSwapchainKHR وVkRenderPass وVkPipeline، وصولًا إلى تسجيل الأوامر والرسم والتقديم.')}</p>
            <p>${linkUsageBridgeText('أما أمثلة التكامل التي يكون فيها SDL3 أو Dear ImGui هو محور المثال، فقد نُقلت إلى أقسامها الأصلية حتى يبقى هذا المسار مخصصًا لفولكان نفسه قدر الإمكان.')}</p>
          </div>
          <div class="vulkan-ready-examples-grid">
            ${orderedExamples.map((example) => renderVulkanReadyExampleCard(example)).join('')}
          </div>
        </section>
      `;
    }

    return {
      renderVulkanReadyExampleCodeBlock,
      renderVulkanReadyExampleExplanation,
      renderVulkanReadyExamplePageOverviewCard,
      renderVulkanReadyExamplePageCodeSection,
      renderVulkanReadyExamplePageCommandsSection,
      renderVulkanReadyExamplePageSupportGrid,
      renderVulkanReadyExampleCard,
      renderVulkanReadyExamplesSection
    };
  }

  global.createVulkanReadyExamplePageRuntime = createVulkanReadyExamplePageRuntime;
  global.__ARABIC_VULKAN_VULKAN_READY_EXAMPLE_PAGE_RUNTIME__ = {
    createVulkanReadyExamplePageRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
