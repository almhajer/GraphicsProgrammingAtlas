(function (global) {
  const api = {
    ensureDataSegment: async () => {},
    findItemInCategoriesWithMeta: () => null,
    getVulkanData: () => ({constants: {}, macros: {}}),
    findConstantItemByName: () => null,
    findMacroItemByName: () => null,
    renderEntityIcon: () => '',
    renderVulkanHighlightedCodeBlock: () => '',
    linkUsageBridgeText: (value) => String(value || ''),
    inferReferenceProfile: () => ({meaning: ''}),
    renderReferenceConceptSection: () => '',
    renderExecutionProfileSection: () => '',
    renderSystemContextSection: () => '',
    renderValueMeaningSection: () => '',
    renderPracticalReferenceSection: () => '',
    renderUsageSection: () => '',
    renderEntityRelatedConstantsSection: () => '',
    renderLinkedVulkanExampleSection: () => '',
    formatExampleWithLinks: (value) => String(value || ''),
    renderGenericExampleExplanation: () => '',
    renderLinkedNotesSection: () => '',
    renderOfficialDocsFooter: () => '',
    inferMacroPracticalMeaning: () => '',
    renderMacroPreprocessorSection: () => '',
    highlightCode: () => {},
    syncSidebarWithHash: () => {},
    focusPageMeaningAnchor: () => {},
    syncRouteHistory: () => {},
    scrollMainContentToTop: () => {},
    escapeAttribute: (value) => String(value || '')
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function renderMacroParameterCards(item) {
    const parameters = Array.isArray(item?.parameters) ? item.parameters : [];
    if (!parameters.length) {
      return '';
    }

    return `
      <section class="params-section params-section-vulkan-macro">
        <h2>📊 المعاملات</h2>
        <div class="content-card prose-card params-section-intro">
          <div class="params-section-intro-kicker">قراءة سريعة</div>
          <p>هذه البطاقات توضّح كيف يدخل كل معامل في توسعة الماكرو ${item.name}، وما الذي يضيفه فعليًا داخل الصياغة النهائية قبل الترجمة.</p>
        </div>
        <div class="params-card-grid">
          ${parameters.map((param, index) => `
            <article class="content-card prose-card parameter-detail-card">
              <div class="parameter-card-head">
                <div class="parameter-card-order">المعامل ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name parameter-card-code"><code class="param-name">${param.name}</code></h3>
                  <div class="parameter-card-type-row">
                    <span class="parameter-card-type-label">النوع النصي</span>
                    <div class="parameter-card-type parameter-card-code"><code>${param.type || ''}</code></div>
                  </div>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">كيف يدخل في التوسيع</div>
                  <div class="parameter-card-field-value">${/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(item.name)
                    ? 'هذا المعامل يمثل رمزاً يدخل في التعريف الناتج، وليس قيمة وقت تشغيل.'
                    : 'يُدرج نصياً داخل التعبير النهائي الذي يولده الماكرو بعد المعالجة المسبقة.'}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">الوصف</div>
                  <div class="parameter-card-field-value">${api.linkUsageBridgeText(param.description || '', {currentItem: item})}</div>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  async function showConstant(name, options = {}) {
    const constantEntry = api.findItemInCategoriesWithMeta(api.getVulkanData().constants, name);
    await Promise.all([
      api.ensureDataSegment('constants', constantEntry?.item?.detailBucket || ''),
      api.ensureDataSegment('enums'),
      api.ensureDataSegment('macros')
    ]);

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const item = api.findConstantItemByName(name);
    if (!item) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${api.renderEntityIcon('constant', 'ui-codicon page-icon', 'ثابت')} ${name}</h1>
          <p>الثابت غير موجود.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="reference-unified-detail-page">
      <div class="page-header" id="page-meaning-anchor">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showConstantsIndex(); return false;">الثوابت</a> /
          <span>${item.name}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('constant', 'ui-codicon page-icon', 'ثابت')} ${item.name}</h1>
      </div>

      <section class="constant-section">
        <h2>📋 القيمة</h2>
        <div class="code-container">
          ${api.renderVulkanHighlightedCodeBlock(item.value || item.syntax || '', 'cpp')}
        </div>
      </section>

      <section class="description-section">
        <h2>📖 الوصف</h2>
        <p>${api.linkUsageBridgeText(item.description || api.inferReferenceProfile(item, 'constant').meaning, {currentItem: item})}</p>
      </section>
      ${api.renderReferenceConceptSection(item, 'constant')}
      ${api.renderExecutionProfileSection(item, 'constant')}
      ${api.renderSystemContextSection(item)}
      ${api.renderValueMeaningSection(item, 'constant')}
      ${api.renderPracticalReferenceSection(item, 'constant')}
      ${api.renderUsageSection(item, '📘 الاستخدام التفصيلي')}
      ${api.renderEntityRelatedConstantsSection(item, 'constant')}
      ${api.renderLinkedVulkanExampleSection(item)}
      ${item.example ? `
      <section class="example-section">
        <h2>💻 مثال</h2>
        <div class="code-container">
          <div class="code-header">
            <span>C / C++</span>
            <button onclick="copyCode(this)" class="copy-btn">📋 نسخ</button>
          </div>
          <pre class="code-block"><code class="language-cpp">${api.formatExampleWithLinks(item.example)}</code></pre>
        </div>
      </section>
      ${api.renderGenericExampleExplanation(item, {
        sectionedCards: true,
        sectionTitles: {
          header: '🧩 شرح تفصيلي للمثال',
          usageBridge: 'كيف يربط المثال بالاستخدام الحقيقي',
          flow: 'مخطط التنفيذ المبسط',
          concepts: 'مفاهيم مرتبطة',
          notes: 'ملاحظات مهمة',
          references: 'القسم 8: قائمة روابط مرجعية مجمعة لكل العناصر المذكورة'
        },
        independentCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes', 'references'],
        summaryCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes'],
        visibleSections: {
          requirements: false,
          learning: false,
          commentIssues: false,
          lineByLine: false,
          functions: false,
          constants: false,
          variables: false,
          rewrittenCode: false,
          undocumented: false,
          usageBridge: true,
          flow: true,
          concepts: true,
          notes: true,
          references: true
        },
        headerDescription: `هذا القسم يربط المثال المرتبط بالثابت ${item.name} بالاستخدام الحقيقي داخل Vulkan، ثم يحوله إلى بطاقات سريعة توضّح الهدف والخطوات والمفاهيم والروابط المرجعية المرتبطة به.`,
        kindLabel: 'ثابت Vulkan',
        purpose: `يوضح المثال كيف يمكن استخدام الثابت ${item.name} ضمن تهيئة القيم أو المقارنات داخل التطبيق.`,
        concepts: [
          'الثوابت تجعل الكود أوضح من الاعتماد على أرقام حرفية مباشرة.',
          'كثير من ثوابت Vulkan تمثل حدوداً قياسية أو قيماً خاصة تستخدمها الواجهة في الاستدعاءات.'
        ],
        notes: item.notes || []
      })}
      ` : ''}
      ${item.notes && item.notes.length > 0 ? api.renderLinkedNotesSection(item.notes, '🧠 ملاحظات', {currentItem: item}) : ''}
      ${api.renderOfficialDocsFooter(item, 'فتح هذا الثابت في وثائق Vulkan الرسمية')}
      </div>
    `;

    document.title = `${item.name} - ArabicVulkan`;
    api.syncRouteHistory(`constant/${item.name}`, options);
    api.highlightCode();
    api.syncSidebarWithHash('constant', item.name);
    api.focusPageMeaningAnchor({smooth: false, flash: true, delay: 0});
  }

  async function showMacro(name, options = {}) {
    const macroEntry = api.findItemInCategoriesWithMeta(api.getVulkanData().macros, name);
    await api.ensureDataSegment('macros', macroEntry?.item?.detailBucket || '');

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const item = api.findMacroItemByName(name);
    if (!item) {
      await showConstant(name, options);
      return;
    }

    let html = `
      <div class="page-header" id="page-meaning-anchor">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <span>الماكرو</span> /
          <span>${item.name}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('macro', 'ui-codicon page-icon', 'ماكرو')} ${item.name}</h1>
        <p class="page-description">${api.linkUsageBridgeText(api.inferMacroPracticalMeaning(item))}</p>
      </div>
    `;

    html += api.renderMacroPreprocessorSection(item);
    html += api.renderReferenceConceptSection(item, 'macro');
    html += api.renderExecutionProfileSection(item, 'macro');
    html += api.renderSystemContextSection(item);
    html += api.renderValueMeaningSection(item, 'macro');
    html += api.renderPracticalReferenceSection(item, 'macro');
    html += api.renderUsageSection(item, '📘 الاستخدام التفصيلي');
    html += api.renderEntityRelatedConstantsSection(item, 'macro');
    html += api.renderLinkedVulkanExampleSection(item);

    if (item.syntax) {
      html += `
        <section class="signature-section">
          <h2>📝 الصياغة</h2>
          <div class="code-container">
            ${api.renderVulkanHighlightedCodeBlock(item.syntax, 'cpp')}
          </div>
        </section>
      `;
    }

    html += renderMacroParameterCards(item);

    if (item.value) {
      html += `
        <section class="constant-section">
          <h2>📋 القيمة أو الناتج</h2>
          <div class="code-container">
            ${api.renderVulkanHighlightedCodeBlock(item.value, 'cpp')}
          </div>
        </section>
      `;
    }

    if (item.example) {
      html += `
        <section class="example-section">
          <h2>💻 مثال</h2>
          <div class="code-container">
            <div class="code-header">
              <span>C / C++</span>
              <button onclick="copyCode(this)" class="copy-btn">📋 نسخ</button>
            </div>
            <pre class="code-block"><code class="language-cpp">${api.formatExampleWithLinks(item.example)}</code></pre>
          </div>
        </section>
      `;

      html += api.renderGenericExampleExplanation(item, {
        sectionedCards: true,
        sectionTitles: {
          header: '🧩 شرح تفصيلي للمثال',
          usageBridge: 'كيف يربط المثال بالاستخدام الحقيقي',
          flow: 'مخطط التنفيذ المبسط',
          concepts: 'مفاهيم مرتبطة',
          notes: 'ملاحظات مهمة',
          references: 'القسم 8: قائمة روابط مرجعية مجمعة لكل العناصر المذكورة'
        },
        independentCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes', 'references'],
        summaryCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes'],
        visibleSections: {
          requirements: false,
          learning: false,
          commentIssues: false,
          lineByLine: false,
          functions: false,
          constants: false,
          variables: false,
          rewrittenCode: false,
          undocumented: false,
          usageBridge: true,
          flow: true,
          concepts: true,
          notes: true,
          references: true
        },
        headerDescription: `هذا القسم يربط مثال الماكرو ${item.name} بالمعنى البرمجي الحقيقي داخل Vulkan، ثم يجمع خطوات القراءة والمفاهيم والروابط التي تحتاجها لفهمه بسرعة.`,
        kindLabel: 'ماكرو Vulkan',
        purpose: `يوضح المثال كيف يُستخدم الماكرو ${item.name} لبناء قيمة أو استخراج جزء من قيمة أو تعريف عنصر مرتبط بـ Vulkan.`,
        concepts: [
          'الماكرو في Vulkan غالباً يختصر عملية ثابتة مثل تركيب رقم إصدار أو استخراج جزء منه.',
          'الماكرو يُقيّم وقت الترجمة أو قبلها، لذلك لا يملك سلوكاً ديناميكياً مثل الدوال.'
        ]
      });
    }

    if (item.notes && item.notes.length > 0) {
      html += api.renderLinkedNotesSection(item.notes, '🧠 ملاحظات', {currentItem: item});
    }

    html += api.renderOfficialDocsFooter(item, 'فتح هذا الماكرو في وثائق Vulkan الرسمية');

    content.innerHTML = `<div class="reference-unified-detail-page vulkan-macro-detail-page">${html}</div>`;
    document.title = `${item.name} - ArabicVulkan`;
    api.syncRouteHistory(`macro/${item.name}`, options);
    api.scrollMainContentToTop();
    api.highlightCode();
    api.syncSidebarWithHash('macro', item.name);
  }

  global.__ARABIC_VULKAN_VALUE_PAGES__ = {
    configure,
    showConstant,
    showMacro
  };
})(window);
