(function(global) {
  'use strict';

  function createGlslPageRuntime(api = {}) {
    const {
      ensureUiSegment,
      populateGlslList,
      getGlslReferenceItem,
      getGlslRelatedEntries,
      renderGlslReferenceChip,
      inferGlslExecutionStageLabel,
      buildGlslPracticalRole,
      renderCodicon,
      getGlslSectionCodicon,
      getGlslKindIcon,
      escapeHtml,
      normalizeGlslExplanationText,
      renderEntityIcon,
      renderTutorialInfoGrid,
      localizeGlslKind,
      buildGlslEntityKindNote,
      buildGlslSectionMeaningNote,
      buildGlslExecutionStageNote,
      escapeAttribute,
      renderGlslCompilerRoleSection,
      renderGlslTechnicalProse,
      buildGlslTranslationReadText,
      buildGlslCompilationEffectText,
      buildGlslVulkanBridgeText,
      buildGlslReferenceExample,
      renderTutorialCodeBlock,
      fallbackRenderTutorialCodeBlock,
      renderGenericExampleExplanation,
      safeRenderEntityLabel,
      showHomePage,
      showGlslIndex: externalShowGlslIndex,
      scrollToAnchor,
      renderGlslVulkanWorkflowSection,
      renderGlslExamplesPreviewSection,
      glslReferenceSections,
      renderGlslReferenceIndexSection,
      syncRouteHistory,
      scrollMainContentToTop,
      setActiveSidebarItemBySelector,
      getGlslReferenceSectionId,
      escapeSelectorValue,
      highlightCode
    } = api;

    const resolveGlslSectionMeaningNote = typeof buildGlslSectionMeaningNote === 'function'
      ? buildGlslSectionMeaningNote
      : (item = {}) => {
          const sectionTitle = String(item?.sectionTitle || '').trim() || 'هذه المجموعة';
          return `${sectionTitle} تشرح عناصر تؤدي وظيفة متقاربة داخل GLSL، لكن المعنى التفصيلي لهذه المجموعة يعتمد على نوع العنصر نفسه وطريقة ترجمة glslang له.`;
        };

    const resolveGlslExecutionStageNote = typeof buildGlslExecutionStageNote === 'function'
      ? buildGlslExecutionStageNote
      : () => 'هذا الحقل يوضح أين يترك العنصر أثره أثناء تحليل الشيدر أو ترجمته داخل glslang قبل أن يتحول إلى SPIR-V.';
    const renderGlslExampleCodeBlock = typeof fallbackRenderTutorialCodeBlock === 'function'
      ? fallbackRenderTutorialCodeBlock
      : renderTutorialCodeBlock;

async function showGlslReference(name, options = {}) {
  await ensureUiSegment('glsl');
  populateGlslList();

  const content = document.getElementById('mainContent');
  const item = getGlslReferenceItem(name);

  if (!item) {
    content.innerHTML = `
      <div class="page-header">
        <h1>${renderEntityIcon('glsl', 'ui-codicon page-icon', 'GLSLang')} ${escapeHtml(name)}</h1>
        <p>لا توجد صفحة محلية لهذا العنصر من GLSLang حالياً.</p>
      </div>
    `;
    return;
  }

  const relatedEntries = getGlslRelatedEntries(item, 10);
  const relatedGlsl = relatedEntries
    .map((entry) => renderGlslReferenceChip(entry.name, entry.label))
    .join(' ');
  const executionStage = inferGlslExecutionStageLabel(item);
  const practicalRole = buildGlslPracticalRole(item);
  const sectionIcon = renderCodicon(getGlslSectionCodicon(item.sectionKey), 'ui-codicon list-icon', item.sectionTitle || 'GLSLang');
  const kindIcon = getGlslKindIcon(item.kind);
  const exampleCode = typeof buildGlslReferenceExample === 'function'
    ? buildGlslReferenceExample(item)
    : (item.example || item.name);
  const translationReadText = normalizeGlslExplanationText(item.execution || buildGlslTranslationReadText(item));
  const compilationEffectText = normalizeGlslExplanationText(item.effect || buildGlslCompilationEffectText(item));
  const vulkanBridgeText = normalizeGlslExplanationText(item.vulkanBridge || buildGlslVulkanBridgeText(item));

  content.innerHTML = `
    <div class="reference-unified-detail-page">
    <div class="page-header">
      <nav class="breadcrumb">
        <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
        <a href="#" onclick="showGlslIndex(); return false;">مرجع GLSLang</a> /
        <span>${escapeHtml(item.displayName || item.name)}</span>
      </nav>
      <h1 class="page-title">${sectionIcon} ${escapeHtml(item.displayName || item.name)}</h1>
      <p class="page-description">${escapeHtml(normalizeGlslExplanationText(item.description || ''))}</p>
    </div>

    <section class="info-section">
      ${renderTutorialInfoGrid([
        {label: 'نوع الكيان', value: `<span class="glsl-kind-badge inline">${escapeHtml(kindIcon)}</span> ${escapeHtml(localizeGlslKind(item.kind) || 'عنصر GLSL')}`, note: buildGlslEntityKindNote(item)},
        {label: 'المجموعة', value: `${sectionIcon} ${escapeHtml(item.sectionTitle || 'مرجع GLSLang')}`, note: resolveGlslSectionMeaningNote(item)},
        {label: 'مرحلة التأثير', value: escapeHtml(executionStage), note: resolveGlslExecutionStageNote(item)},
        {label: 'المصدر الرسمي', value: item.sourceUrl ? `<a class="doc-link" href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">مواصفة Khronos</a>` : '—', note: 'الرابط يعود إلى مواصفة GLSLang الرسمية من Khronos.'}
      ])}
    </section>

    <section class="card">
      <div class="card-header"><h2>وظيفة العنصر داخل GLSLang</h2></div>
      ${renderGlslCompilerRoleSection(item)}
    </section>

    <section class="card">
      <div class="card-header"><h2>كيف يقرأه مترجم glslang أثناء الترجمة؟</h2></div>
      <p>${renderGlslTechnicalProse(translationReadText)}</p>
    </section>

    <section class="card">
      <div class="card-header"><h2>ما الذي يغيّره في الترجمة أو الواجهة؟</h2></div>
      <p>${renderGlslTechnicalProse(compilationEffectText)}</p>
    </section>

    <section class="card">
      <div class="card-header"><h2>الربط مع Vulkan</h2></div>
      <p>${renderGlslTechnicalProse(vulkanBridgeText)}</p>
    </section>

    <section class="example-section">
      <h2>💻 مثال</h2>
      ${renderGlslExampleCodeBlock('GLSL', exampleCode, 'glsl')}
    </section>
    ${renderGenericExampleExplanation({
      name: item.displayName || item.name,
      description: normalizeGlslExplanationText(item.description),
      usage: [translationReadText, vulkanBridgeText].filter(Boolean),
      notes: [localizeGlslKind(item.kind), item.sectionTitle, compilationEffectText].filter(Boolean),
      example: exampleCode
    }, {
      kindLabel: localizeGlslKind(item.kind) || 'عنصر GLSL',
      language: 'glsl',
      purpose: `يوضح المثال كيف يظهر ${item.displayName || item.name} داخل نص الشيدر، وما الذي يقرأه مترجم glslang من هذا الموضع قبل أن ينتقل أثره إلى SPIR-V الذي يستهلكه Vulkan.`,
      concepts: [
        'لا يشرح هذا المثال معنى الاسم فقط، بل يوضح أثر العنصر في الواجهة أو في ترجمة الشيدر وما الذي ينتج عنه داخل SPIR-V.',
        'عندما يكون لهذا العنصر أثر على ربط الموارد أو الواجهات بين المراحل، يجب أن يطابق توصيفات Vulkan المقابلة.'
      ]
    })}

    <section class="card">
      <div class="card-header"><h2>روابط سريعة</h2></div>
      <p>
        <a href="#" class="doc-link entity-link-with-icon" onclick="showGlslIndex(); return false;">${safeRenderEntityLabel('العودة إلى فهرس GLSLang', 'glsl')}</a>
        /
        <a href="#" class="doc-link entity-link-with-icon" onclick="showGlslIndex(); setTimeout(() => scrollToAnchor('glsl-section-${escapeAttribute(item.sectionKey)}'), 30); return false;">${safeRenderEntityLabel(`العودة إلى مجموعة ${item.sectionTitle || ''}`, 'glsl')}</a>
      </p>
      ${relatedGlsl ? `<p><strong>عناصر مرتبطة من نفس المسار:</strong> ${relatedGlsl}</p>` : ''}
    </section>
    </div>
  `;

  document.title = `${item.displayName || item.name} - GLSLang - ArabicVulkan`;
  syncRouteHistory(`glsl/${encodeURIComponent(item.name)}`, options);
  setActiveSidebarItemBySelector(
    getGlslReferenceSectionId(item.sectionKey),
    `.nav-item[data-nav-type="glsl"][data-nav-name="${escapeSelectorValue(item.name)}"]`
  );
  highlightCode(content);
}

async function showGlslIndex(options = {}) {
  await ensureUiSegment('glsl');
  populateGlslList();

  const content = document.getElementById('mainContent');

  let html = `
    <div class="page-header">
      <h1>${renderEntityIcon('glsl', 'ui-codicon page-icon', 'GLSLang')} مرجع GLSLang</h1>
      <p>تعليمات اللغة، المتغيرات، الدوال المدمجة، محددات النوع، والكتل البنيوية بصياغة عربية عملية تربط GLSLang مباشرة بما يستهلكه Vulkan داخل SPIR-V (التمثيل الوسيط للشيدر) ووحدات الشيدر ومراحل الشيدر.</p>
    </div>
    ${renderGlslVulkanWorkflowSection()}
    ${renderGlslExamplesPreviewSection({
      limit: 3,
      randomize: true,
      sectionId: 'glsl-examples'
    })}
  `;

  Object.entries(glslReferenceSections).forEach(([sectionKey, section]) => {
    html += renderGlslReferenceIndexSection(sectionKey, section);
  });

  content.innerHTML = html;
  document.title = 'مرجع GLSLang - ArabicVulkan';
  syncRouteHistory('glsl-index', options);
  scrollMainContentToTop();
  setActiveSidebarItemBySelector('glsl-list', `.nav-item[data-nav-type="glsl-index"][data-nav-name="glsl-index"]`);
  highlightCode(content);
}

    return {
      showGlslReference,
      showGlslIndex
    };
  }

  global.__ARABIC_VULKAN_GLSL_PAGE_RUNTIME__ = {
    createGlslPageRuntime
  };
})(window);
