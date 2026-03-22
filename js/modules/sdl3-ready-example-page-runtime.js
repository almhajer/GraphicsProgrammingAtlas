(function(global) {
  'use strict';

  function createSdl3ReadyExamplePageRuntime(api = {}) {
    const {
      escapeHtml,
      getRawVulkanCatalogExampleById,
      getSdl3PackageInfo,
      getSdl3ExampleGuide,
      getSdl3ReadyExamples,
      linkUsageBridgeText,
      renderExamplePlatformSection,
      renderRelatedReferenceLink,
      renderSdl3EntityLink,
      renderSdl3ExampleCodeBlock,
      renderSdl3ExampleOfficialGuidance,
      renderSdl3ExampleProjectExpansion,
      renderSdl3HeaderFileLink,
      renderSdl3PracticalText,
      renderSdl3ReadyExamplePreview,
      renderSdl3RelatedLink,
      renderUnifiedExampleOverviewCard,
      renderUnifiedExampleRelatedLinks,
      renderUnifiedExampleSectionCard,
      renderUnifiedExampleSupportCard,
      renderVulkanReadyExampleCodeBlock,
      formatSdl3HeaderFileDisplay
    } = api;

    function buildSdl3ReadyExamplePageModel(example = {}) {
      const sourceExample = example?.sourceLibrary === 'vulkan' && example?.sourceExampleId
        ? getRawVulkanCatalogExampleById(example.sourceExampleId) || example
        : null;
      const isBridgeExample = Boolean(sourceExample && example?.sourceLibrary === 'vulkan');
      const packageInfo = getSdl3PackageInfo(example.packageKey);
      const pageTitle = sourceExample?.title || example.title || '';
      const pageGoalText = sourceExample?.goal || example.goal || '';
      const contextTitle = isBridgeExample ? 'سبب وجوده داخل SDL3' : 'ما الذي يوضحه';
      const contextText = isBridgeExample
        ? String(example.bridgeOriginText || example.shows || '').trim()
        : String(example.shows || '').trim();
      const requirementItems = isBridgeExample
        ? [
          ...(sourceExample?.requirements || []).map((entry) => linkUsageBridgeText(entry)),
          example.bridgeOriginText ? linkUsageBridgeText(example.bridgeOriginText) : ''
        ].filter(Boolean)
        : [
          ...(example.headers || []).map((header) => `ملف الترويسة المطلوب: ${renderSdl3HeaderFileLink(header, {packageKey: example.packageKey, packageDisplayName: packageInfo?.displayName}, {label: formatSdl3HeaderFileDisplay(header)})}`),
          ...(example.requirements || []).map((entry) => renderSdl3PracticalText(entry, entry))
        ].filter(Boolean);
      const highlightItems = (isBridgeExample ? (sourceExample?.highlights || []) : (example.highlights || []))
        .map((entry) => isBridgeExample ? linkUsageBridgeText(entry) : renderSdl3PracticalText(entry, entry))
        .filter(Boolean);
      const relatedLinks = (isBridgeExample ? (sourceExample?.related || []) : (example.related || []))
        .map((name) => isBridgeExample
          ? renderRelatedReferenceLink(name, {tooltipContext: 'reference-summary'}) || renderSdl3EntityLink(name)
          : renderSdl3RelatedLink(name))
        .filter(Boolean)
        .join('');
      const expectedResultText = sourceExample?.expectedResult || example.expectedResult || '';
      const codeHtml = isBridgeExample
        ? renderVulkanReadyExampleCodeBlock(sourceExample)
        : renderSdl3ExampleCodeBlock(null, example.code);
      const pageGoalHtml = isBridgeExample
        ? linkUsageBridgeText(pageGoalText)
        : renderSdl3PracticalText(pageGoalText, pageGoalText);
      const exampleGuide = getSdl3ExampleGuide(example);

      return {
        pageTitle,
        pageGoalText,
        pageGoalHtml,
        goalMarkup: `<p>${pageGoalHtml}</p>`,
        contextTitle,
        contextMarkup: contextText
          ? `<p>${isBridgeExample ? linkUsageBridgeText(contextText) : renderSdl3PracticalText(contextText, contextText)}</p>`
          : '',
        requirementItems,
        highlightItems,
        relatedLinks,
        officialReferencesMarkup: renderSdl3ExampleOfficialGuidance(exampleGuide),
        projectExpansionMarkup: renderSdl3ExampleProjectExpansion(exampleGuide),
        expectedMarkup: `<p>${isBridgeExample ? linkUsageBridgeText(expectedResultText) : renderSdl3PracticalText(expectedResultText, expectedResultText)}</p>`,
        previewHtml: renderSdl3ReadyExamplePreview(example),
        codeHtml
      };
    }

    function renderSdl3ReadyExamplePageOverviewCard(example, options = {}) {
      const model = buildSdl3ReadyExamplePageModel(example);
      return renderUnifiedExampleOverviewCard({
        goalHtml: model.goalMarkup,
        extraHtml: model.contextMarkup ? `<h4>${escapeHtml(model.contextTitle)}</h4>${model.contextMarkup}` : '',
        previewHtml: model.previewHtml,
        showPreview: options.showPreview
      });
    }

    function renderSdl3ReadyExamplePageCodeSection(example) {
      const model = buildSdl3ReadyExamplePageModel(example);
      const codeInteractionNote = 'العناصر البرمجية المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة توضّح نوع الكيان.';
      const fallbackCodeHtml = example?.code
        ? renderSdl3ExampleCodeBlock(null, example.code)
        : '';
      const resolvedCodeHtml = String(model.codeHtml || '').trim() || String(fallbackCodeHtml || '').trim();

      if (!resolvedCodeHtml) {
        return renderUnifiedExampleSectionCard(
          'الكود الكامل أو شبه الكامل القابل للفهم',
          '<p class="example-code-note">لم يُولد كود هذا المثال داخل الصفحة بعد رغم وجود بيانات المثال. يحتاج هذا المسار إلى مراجعة إضافية إذا تكرر على مثال آخر.</p>',
          'example-unified-code-card'
        );
      }

      return renderUnifiedExampleSectionCard(
        'الكود الكامل أو شبه الكامل القابل للفهم',
        `
          <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
          ${resolvedCodeHtml}
        `,
        'example-unified-code-card'
      );
    }

    function renderSdl3ReadyExamplePageSupportGrid(example) {
      const model = buildSdl3ReadyExamplePageModel(example);

      return `
        <div class="vulkan-ready-example-support-grid">
          ${model.requirementItems.length ? renderUnifiedExampleSupportCard(
            'المتطلبات',
            `
              <ul class="best-practices-list">
                ${model.requirementItems.map((entry) => `<li><p>${entry}</p></li>`).join('')}
              </ul>
            `
          ) : ''}

          ${model.highlightItems.length ? renderUnifiedExampleSupportCard(
            'شرح الأجزاء المهمة',
            `
              <ul class="best-practices-list">
                ${model.highlightItems.map((entry) => `<li><p>${entry}</p></li>`).join('')}
              </ul>
            `
          ) : ''}

          ${renderUnifiedExampleSupportCard('النتيجة المتوقعة', model.expectedMarkup)}

          ${renderUnifiedExampleSupportCard(
            'مراجع رسمية للمثال',
            model.officialReferencesMarkup
          )}

          ${renderUnifiedExampleSupportCard(
            'كيف تطوره إلى مشروع كامل',
            model.projectExpansionMarkup
          )}

          ${renderUnifiedExampleSupportCard(
            'العناصر المرتبطة',
            renderUnifiedExampleRelatedLinks(model.relatedLinks),
            'vulkan-ready-example-related-card'
          )}
        </div>
      `;
    }

    function renderSdl3ReadyExampleCard(example) {
      if (example?.sourceLibrary === 'vulkan' && example?.sourceExampleId) {
        const sourceExample = getRawVulkanCatalogExampleById(example.sourceExampleId) || example;
        const requirementItems = [
          ...(sourceExample.requirements || []).map((entry) => linkUsageBridgeText(entry)),
          example.bridgeOriginText ? linkUsageBridgeText(example.bridgeOriginText) : ''
        ].filter(Boolean);
        const relatedLinks = (sourceExample.related || [])
          .map((name) => renderRelatedReferenceLink(name, {tooltipContext: 'reference-summary'}) || renderSdl3EntityLink(name))
          .filter(Boolean)
          .join('');

        return `
          <article class="content-card prose-card sdl3-ready-example-card">
            <div class="sdl3-ready-example-header">
              <div class="sdl3-ready-example-copy">
                <div class="info-label">اسم المثال</div>
                <h3>${escapeHtml(sourceExample.title || example.title || '')}</h3>
              </div>
            </div>

            <div class="sdl3-ready-example-body">
              <div class="sdl3-ready-example-copy">
                <h4>الهدف منه</h4>
                <p>${linkUsageBridgeText(sourceExample.goal || '')}</p>

                <h4>سبب وجوده داخل SDL3</h4>
                <p>${linkUsageBridgeText(example.bridgeOriginText || example.shows || '')}</p>

                <h4>المتطلبات</h4>
                <ul class="best-practices-list">
                  ${requirementItems.map((entry) => `<li><p>${entry}</p></li>`).join('')}
                </ul>

                ${renderExamplePlatformSection(
                  sourceExample,
                  'يوضع المثال داخل SDL3 لأن SDL3 هي المسؤولة عن النافذة أو الأحداث أو السطح المنصي فيه، بينما يبقى Vulkan طبقة الرسم الخلفية.'
                )}
              </div>

              ${renderSdl3ReadyExamplePreview(example)}
            </div>

            <div class="sdl3-ready-example-code">
              <h4>الكود الكامل أو شبه الكامل القابل للفهم</h4>
              ${renderVulkanReadyExampleCodeBlock(sourceExample)}
            </div>

            <h4>شرح الأجزاء المهمة</h4>
            <ul class="best-practices-list">
              ${(sourceExample.highlights || []).map((entry) => `
                <li><p>${linkUsageBridgeText(entry)}</p></li>
              `).join('')}
            </ul>

            <h4>النتيجة المتوقعة</h4>
            <p>${linkUsageBridgeText(sourceExample.expectedResult || '')}</p>

            <h4>العناصر المرتبطة</h4>
            <div class="see-also-links sdl3-see-also-list">${relatedLinks}</div>
          </article>
        `;
      }

      const packageInfo = getSdl3PackageInfo(example.packageKey);
      const requirementItems = [
        ...(example.headers || []).map((header) => `ملف الترويسة المطلوب: ${renderSdl3HeaderFileLink(header, {packageKey: example.packageKey, packageDisplayName: packageInfo?.displayName}, {label: formatSdl3HeaderFileDisplay(header)})}`),
        ...(example.requirements || []).map((entry) => renderSdl3PracticalText(entry, entry))
      ];
      const relatedLinks = (example.related || [])
        .map((name) => renderSdl3RelatedLink(name))
        .join('');
      const codeInteractionNote = 'العناصر البرمجية المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة توضّح نوع الكيان.';
      const showsHtml = example.shows
        ? `
              <h4>ما الذي يوضحه</h4>
              <p>${renderSdl3PracticalText(example.shows, example.shows)}</p>
            `
        : '';

      return `
        <article class="content-card prose-card sdl3-ready-example-card">
          <div class="sdl3-ready-example-header">
            <div class="sdl3-ready-example-copy">
              <div class="info-label">اسم المثال</div>
              <h3>${escapeHtml(example.title)}</h3>
            </div>
          </div>

          <div class="sdl3-ready-example-body">
            <div class="sdl3-ready-example-copy">
              <h4>الهدف منه</h4>
              <p>${renderSdl3PracticalText(example.goal, example.goal)}</p>

    ${showsHtml}

              <h4>المتطلبات</h4>
              <ul class="best-practices-list">
                ${requirementItems.map((entry) => `<li><p>${entry}</p></li>`).join('')}
              </ul>

              ${renderExamplePlatformSection(
                example,
                'واجهة SDL3 المعروضة هنا تعمل بنفس النمط على Windows وLinux وmacOS، بينما يختلف فقط مسار الربط أو الحزم المحلية في مشروعك.'
              )}
            </div>

            ${renderSdl3ReadyExamplePreview(example)}
          </div>

          <div class="sdl3-ready-example-code">
            <h4>الكود الكامل أو شبه الكامل القابل للفهم</h4>
            <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
            ${renderSdl3ExampleCodeBlock(null, example.code)}
          </div>

          <h4>شرح الأجزاء المهمة</h4>
          <ul class="best-practices-list">
            ${(example.highlights || []).map((entry) => `
              <li><p>${renderSdl3PracticalText(entry, entry)}</p></li>
            `).join('')}
          </ul>

          <h4>النتيجة المتوقعة</h4>
          <p>${renderSdl3PracticalText(example.expectedResult, example.expectedResult)}</p>

          <h4>العناصر المرتبطة</h4>
          <div class="see-also-links sdl3-see-also-list">${relatedLinks}</div>
        </article>
      `;
    }

    function renderSdl3ReadyExamplesSection(packageKey = '') {
      const examples = getSdl3ReadyExamples(packageKey);
      if (!examples.length) {
        return '';
      }

      const packageInfo = packageKey ? getSdl3PackageInfo(packageKey) : null;
      const intro = packageKey === 'image'
        ? 'تغطي هذه الأمثلة الجاهزة أشهر سيناريوهات SDL3_image من التحميل الأساسي وتحويل الصورة إلى SDL_Texture، مرورًا بتغيير الموضع والحجم والقص والمعرض والتبديل والسحب، وحتى بناء زر صوري وخلفية بشفافية متغيرة.'
        : packageKey === 'mixer'
        ? 'تغطي هذه الأمثلة الجاهزة أشهر سيناريوهات SDL3_mixer من تشغيل المؤثرات القصيرة والموسيقى الخلفية، إلى الإيقاف المؤقت والاستئناف والتحكم في مستوى الصوت والكتم وربط الصوت بالأزرار وبناء نظام مؤثرات وموسيقى بحسب حالة التطبيق. كما أن العناصر البرمجية المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة نوع الكيان.'
        : packageKey === 'ttf'
        ? 'تغطي هذه الأمثلة الجاهزة أشهر سيناريوهات SDL3_ttf من عرض النص الأساسي والعناوين متعددة الأحجام، إلى القوائم النصية والمحاذاة والتحديث الديناميكي ورسائل الحالة والتفاعل وإدخال النص داخل النافذة.'
        : packageInfo
        ? `تجمع هذه الأمثلة الجاهزة أشهر المسارات العملية داخل ${packageInfo.displayName}، بحيث ترى تهيئة الترويسات، وترتيب الاستدعاءات، والنتيجة المتوقعة من المثال كاملًا لا كسطر معزول.`
        : 'يجمع هذا القسم أمثلة تطبيقية جاهزة تغطي بداية التطبيق، والحلقة الرئيسية، والأحداث، والإدخال، والرسم، والصور، والنصوص، حتى تبدأ من سيناريو عملي واضح بدل مقاطع متفرقة.';

      return `
        <section class="category-section">
          <h2>أمثلة جاهزة</h2>
          <div class="content-card prose-card sdl3-ready-examples-intro">
            <p>${renderSdl3PracticalText(intro, intro)}</p>
          </div>
          <div class="sdl3-ready-examples-grid">
            ${examples.map((example) => renderSdl3ReadyExampleCard(example)).join('')}
          </div>
        </section>
      `;
    }

    return {
      buildSdl3ReadyExamplePageModel,
      renderSdl3ReadyExamplePageOverviewCard,
      renderSdl3ReadyExamplePageCodeSection,
      renderSdl3ReadyExamplePageSupportGrid,
      renderSdl3ReadyExampleCard,
      renderSdl3ReadyExamplesSection
    };
  }

  global.__ARABIC_VULKAN_SDL3_READY_EXAMPLE_PAGE_RUNTIME__ = {
    createSdl3ReadyExamplePageRuntime
  };
})(window);
