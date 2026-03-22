(function (global) {
  const api = {
    getVulkanData: () => ({commands: {}, structures: {}, enums: {}}),
    ensureDataSegment: async () => {},
    findCommandItemByName: () => null,
    getTypeNavigation: () => null,
    findMacroItemByName: () => null,
    findConstantItemByName: () => null,
    getUsageItems: () => [],
    isReadableLocalizedParagraph: () => false,
    isMarginalUsageText: () => false,
    inferFunctionIntentSummary: () => '',
    getDisplayedExample: () => '',
    renderEntityIcon: () => '',
    renderVulkanHighlightedCodeBlock: () => '',
    renderFunctionMeaningSection: () => '',
    renderExecutionProfileSection: () => '',
    renderFunctionLearningGuide: () => '',
    linkUsageBridgeText: (value) => String(value || ''),
    sanitizeFunctionOfficialDescription: () => '',
    renderExternalReference: () => '',
    renderTypeReference: () => '',
    getFunctionParameterAnchorId: () => '',
    renderUsageSection: () => '',
    renderEntityRelatedConstantsSection: () => '',
    renderLinkedVulkanExampleSection: () => '',
    renderFunctionParameterName: () => '',
    renderFunctionParameterDescription: () => '',
    getReturnValuesArray: () => [],
    renderSystemContextSection: () => '',
    hasRealExample: () => false,
    formatExampleWithLinks: (value) => String(value || ''),
    renderFunctionExplanation: () => '',
    renderLinkedNotesSection: () => '',
    renderOfficialDocsFooter: () => '',
    scrollMainContentToTop: () => {},
    highlightCode: () => {},
    syncSidebarWithHash: () => {},
    syncRouteHistory: () => {},
    escapeAttribute: (value) => String(value || ''),
    renderRelatedReferenceLink: () => '',
    findItemInCategoriesWithMeta: () => null,
    findTypeItemByName: () => null,
    findFunctionsUsingStructure: () => [],
    getStructureLeadDescription: () => '',
    inferStructureRole: () => ({meaning: '', intent: ''}),
    trimLeadingTypeName: (value) => String(value || ''),
    isVariableStructureItem: () => false,
    renderStructureIntentSection: () => '',
    renderPracticalReferenceSection: () => '',
    renderDeferredStructureSectionShell: () => '',
    renderGenericExampleExplanation: () => '',
    initDeferredStructureSections: () => {},
    findItemInCategories: () => null,
    dedupeNotes: (notes) => notes || [],
    simplifyEnumOfficialDescription: () => '',
    renderEnumMeaningSection: () => '',
    renderEnumValueTagsSection: () => '',
    getEnumValueRows: () => [],
    getEnumValueMetadata: () => null,
    buildEnumValueMeaningFallback: () => '',
    buildEnumValueUsageFallback: () => '',
    buildEnumValueBenefitFallback: () => '',
    getEnumValueAnchorId: () => '',
    renderProjectReferenceChip: () => '',
    escapeHtml: (value) => String(value || ''),
    renderEnumCoreRelationsSection: () => ''
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function renderFunctionParameterCards(item) {
    const parameters = Array.isArray(item?.parameters) ? item.parameters : [];
    if (!parameters.length) {
      return '';
    }

    return `
      <section class="params-section params-section-vulkan-function">
        <h2>📊 المعاملات</h2>
        <div class="content-card prose-card params-section-intro">
          <div class="params-section-intro-kicker">قراءة سريعة</div>
          <p>كل بطاقة هنا تشرح معاملًا واحدًا من ${item.name}: نوعه، ودوره العملي، وما الذي تحتاجه الدالة منه أثناء الاستدعاء الحقيقي.</p>
        </div>
        <div class="params-card-grid">
          ${parameters.map((param, index) => `
            <article class="content-card prose-card parameter-detail-card" id="${api.escapeAttribute(api.getFunctionParameterAnchorId(item.name, param.name))}">
              <div class="parameter-card-head">
                <div class="parameter-card-order">المعامل ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name parameter-card-code">${api.renderFunctionParameterName(param, item)}</h3>
                  <div class="parameter-card-type-row">
                    <span class="parameter-card-type-label">النوع</span>
                    <div class="parameter-card-type parameter-card-code">${api.renderTypeReference(param.type)}</div>
                  </div>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">الدور والسبب والاستخدام</div>
                  <div class="parameter-card-field-value">${api.renderFunctionParameterDescription(param, item)}</div>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function getFallbackStructureExample(item = {}) {
    const name = String(item?.name || '').trim();
    if (!name) {
      return '';
    }

    const structureMembers = Array.isArray(item?.members) ? item.members : [];
    const structureFieldNames = new Set(
      structureMembers
        .map((member) => String(member?.name || '').trim())
        .filter(Boolean)
    );

    const toUpperSnake = (value = '') => String(value || '')
      .replace(/^Vk/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toUpperCase();

    const buildGenericStructureSnippet = () => {
      const variableName = /Properties|Features|Limits|Requirements|State|Info|Description|Config/i.test(name)
        ? 'info'
        : 'value';
      const lines = [`${name} ${variableName} = {};`];

      if (structureFieldNames.has('sType')) {
        lines.push(`${variableName}.sType = VK_STRUCTURE_TYPE_${toUpperSnake(name)};`);
      }
      if (structureFieldNames.has('pNext')) {
        lines.push(`${variableName}.pNext = nullptr;`);
      }

      lines.push('');
      lines.push('// اضبط بقية الحقول المطلوبة قبل تمرير الهيكل إلى دالة Vulkan المناسبة');
      return lines.join('\n');
    };

    const buildGenericHandleSnippet = () => [
      `${name} handle = VK_NULL_HANDLE;`,
      '',
      'if (handle != VK_NULL_HANDLE) {',
      '    // أصبح المقبض صالحاً ويمكن تمريره إلى دوال Vulkan المرتبطة به',
      '}'
    ].join('\n');

    switch (name) {
      case 'VkBool32':
        return [
          'VkBool32 enableValidation = VK_TRUE;',
          '',
          'if (enableValidation == VK_TRUE) {',
          '    createInfo.enabledLayerCount = static_cast<uint32_t>(validationLayers.size());',
          '} else {',
          '    createInfo.enabledLayerCount = 0;',
          '}'
        ].join('\n');
      case 'VkDeviceSize':
        return [
          'VkDeviceSize vertexBufferSize = sizeof(vertices[0]) * vertices.size();',
          'VkDeviceSize stagingOffset = 0;',
          '',
          'copyBuffer(stagingBuffer, vertexBuffer, vertexBufferSize, stagingOffset);'
        ].join('\n');
      case 'VkDeviceAddress':
        return [
          'VkBufferDeviceAddressInfo addressInfo = {};',
          'addressInfo.sType = VK_STRUCTURE_TYPE_BUFFER_DEVICE_ADDRESS_INFO;',
          'addressInfo.buffer = vertexBuffer;',
          '',
          'VkDeviceAddress gpuAddress = vkGetBufferDeviceAddress(device, &addressInfo);'
        ].join('\n');
      case 'VkFlags':
      case 'VkFlags64':
        return [
          `${name} flags = 0;`,
          'flags |= VK_PIPELINE_STAGE_VERTEX_SHADER_BIT;',
          'flags |= VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT;'
        ].join('\n');
      case 'VkSampleMask':
        return [
          'VkSampleMask sampleMask = 0xFFFFFFFF;',
          '',
          'multisampleState.pSampleMask = &sampleMask;'
        ].join('\n');
      default:
        if (api.isVariableStructureItem?.(name) || item.syntheticGroup === 'variable') {
          return `${name} value = {};`;
        }
        if (structureMembers.length > 0) {
          return buildGenericStructureSnippet();
        }
        return buildGenericHandleSnippet();
    }
  }

  function isHandleLikeStructureItem(item = {}) {
    const structureMembers = Array.isArray(item?.members) ? item.members : [];
    if (structureMembers.length > 0) {
      return false;
    }

    const text = [
      item?.description || '',
      ...(Array.isArray(item?.usage) ? item.usage : [])
    ].join(' ');
    return /مقبض|opaque|handle/i.test(text);
  }

  function renderSeeAlsoSection(item, options = {}) {
    const title = String(options.title || '🔗 يستخدم معه');
    const tooltip = String(options.tooltip || '');
    const ariaLabel = String(options.ariaLabel || 'يستخدم معه');
    const renderedLinks = (Array.isArray(item?.seeAlso) ? item.seeAlso : [])
      .map((related) => api.renderRelatedReferenceLink(related))
      .filter((entry) => String(entry || '').trim());

    if (!renderedLinks.length) {
      return '';
    }

    return `
      <section class="see-also-section">
        <h2 data-tooltip="${api.escapeAttribute(tooltip)}" tabindex="0" aria-label="${api.escapeAttribute(ariaLabel)}">${title}</h2>
        <div class="see-also-links">
          ${renderedLinks.join('')}
        </div>
      </section>
    `;
  }

  async function showCommand(name, categoryKey, options = {}) {
    const vulkanData = api.getVulkanData();
    let item = null;
    let foundCategoryKey = categoryKey;

    if (categoryKey && vulkanData.commands?.[categoryKey]) {
      item = vulkanData.commands[categoryKey].items?.find((entry) => entry.name === name);
    }

    if (!item) {
      for (const [key, category] of Object.entries(vulkanData.commands || {})) {
        const found = category.items?.find((entry) => entry.name === name);
        if (found) {
          item = found;
          foundCategoryKey = key;
          break;
        }
      }
    }

    const functionDetailBucket = item?.detailBucket || foundCategoryKey;
    if (functionDetailBucket) {
      await api.ensureDataSegment('functions', functionDetailBucket);
      item = api.findCommandItemByName(name) || item;
    }

    if (!item) {
      const typeNavigation = api.getTypeNavigation(name);
      if (typeNavigation) {
        global[typeNavigation.action](typeNavigation.name, options);
        return;
      }

      if (api.findMacroItemByName(name)) {
        global.showMacro(name, options);
        return;
      }

      if (api.findConstantItemByName(name)) {
        global.showConstant(name, options);
        return;
      }

      global.alert(`لم يتم العثور على الدالة: ${name}`);
      return;
    }

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const functionUsageItems = api.getUsageItems(item);
    const readableFunctionUsage = functionUsageItems.filter((text) => api.isReadableLocalizedParagraph(text) && !api.isMarginalUsageText(text));
    const usageSectionItem = {
      ...item,
      usage: readableFunctionUsage.length ? readableFunctionUsage : functionUsageItems.slice(0, 1)
    };
    const functionIntentSummary = api.inferFunctionIntentSummary(item);
    const displayedExample = api.getDisplayedExample(item);

    let html = `
      <div class="page-header" id="page-meaning-anchor">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showCommandsIndex(); return false;">الدوال</a> /
          <span>${item.name}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('command', 'ui-codicon page-icon', 'دالة')} ${item.name}</h1>
        <p class="page-description">${functionIntentSummary}</p>
      </div>

      <section class="signature-section">
        <h2>📝 التصريح البرمجي</h2>
        <div class="code-container">
          ${api.renderVulkanHighlightedCodeBlock(item.signature || '', 'cpp', {functionItem: item, codeContext: 'function-signature'})}
        </div>
      </section>
    `;

    html += api.renderFunctionMeaningSection(item);
    html += api.renderExecutionProfileSection(item, 'function');
    html += api.renderFunctionLearningGuide(item);

    html += `
      <section class="info-section">
        <h2>📘 الوصف الرسمي</h2>
        <div class="content-card prose-card">
          <p>${api.linkUsageBridgeText(api.sanitizeFunctionOfficialDescription(item), {currentItem: item})}</p>
          <p>${api.renderExternalReference(item.name, {}, 'فتح الصفحة الرسمية في Vulkan Docs')}</p>
        </div>
      </section>

      <section class="info-section">
        <h2>📌 معلومات أساسية</h2>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-label">نوع الإعادة</div>
            <div class="info-value">${item.returnType ? api.renderTypeReference(item.returnType) : '<code>غير محدد</code>'}</div>
          </div>
          <div class="info-card">
            <div class="info-label">المعنى البرمجي</div>
            <div class="info-value">${functionIntentSummary}</div>
          </div>
          <div class="info-card">
            <div class="info-label">الامتداد</div>
            <div class="info-value">${item.extension || 'Core'}</div>
          </div>
        </div>
      </section>
    `;

    html += api.renderUsageSection(usageSectionItem, '📖 الوصف التفصيلي');
    html += api.renderEntityRelatedConstantsSection(item, 'function');
    html += api.renderLinkedVulkanExampleSection(item);

    html += renderFunctionParameterCards(item);

    const returnValues = api.getReturnValuesArray(item);
    if (returnValues.length > 0) {
      html += `
        <section class="return-section">
          <h2>↩️ Return Codes</h2>
          <div class="return-values">
      `;

      returnValues.forEach(({value: code, description: desc}) => {
        const isSuccess = code === 'VK_SUCCESS';
        html += `
          <div class="return-value ${isSuccess ? 'success' : 'error'}">
            <code>${code}</code>
            <span>${desc}</span>
          </div>
        `;
      });

      html += '</div></section>';
    }

    html += api.renderSystemContextSection(item);

    if (api.hasRealExample(displayedExample)) {
      html += `
        <section class="example-section">
          <h2>💻 مثال برمجي</h2>
          <div class="code-container">
            <div class="code-header">
              <span>C++</span>
              <button onclick="copyCode(this)" class="copy-btn">📋 نسخ</button>
            </div>
            <pre class="code-block"><code class="language-cpp" data-function-name="${api.escapeAttribute(item.name)}" data-code-context="function-example">${api.formatExampleWithLinks(displayedExample)}</code></pre>
          </div>
        </section>
      `;

      html += api.renderFunctionExplanation(item, displayedExample);
    }

    if (item.notes && item.notes.length > 0) {
      html += api.renderLinkedNotesSection(item.notes, '🧠 ملاحظات مهمة', {currentItem: item});
    }

    if (item.bestPractices && item.bestPractices.length > 0) {
      html += `
        <section class="best-practices-section">
          <h2>✅ أفضل الممارسات</h2>
          <ul class="best-practices-list">
            ${item.bestPractices.map((practice) => `<li>${practice}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    html += renderSeeAlsoSection(item, {
      title: '🔗 انظر أيضاً',
      tooltip: 'يعرض هذا القسم روابط لكيانات أو دوال أو أنواع مرتبطة مباشرة بهذه الدالة ويُرجع إليها عادةً معها أو بعدها.',
      ariaLabel: 'انظر أيضاً'
    });

    html += api.renderOfficialDocsFooter(item, 'فتح هذه الدالة في وثائق Vulkan الرسمية');

    content.innerHTML = `<div class="reference-unified-detail-page">${html}</div>`;
    document.title = `${item.name} - ArabicVulkan`;
    api.syncRouteHistory(`command/${item.name}`, options);
    api.scrollMainContentToTop();
    api.highlightCode();
    api.syncSidebarWithHash('command', item.name);
  }

  async function showStructure(name, options = {}) {
    const vulkanData = api.getVulkanData();
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const structureEntry = api.findItemInCategoriesWithMeta(vulkanData.structures, name);
    if (structureEntry?.item?.detailBucket) {
      await api.ensureDataSegment('structures', structureEntry.item.detailBucket);
    }
    const item = api.findTypeItemByName(name);

    if (!item) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${api.renderEntityIcon('structure', 'ui-codicon page-icon', 'هيكل')} ${name}</h1>
          <p>الهيكل غير موجود في قاعدة البيانات الحالية.</p>
        </div>
      `;
      return;
    }

    const structureRelatedFunctions = api.findFunctionsUsingStructure(item.name, 3);
    const structureLeadDescription = api.getStructureLeadDescription(item);
    const structureRole = api.inferStructureRole(item);
    const structurePageSummary = structureLeadDescription
      || api.trimLeadingTypeName(structureRole.meaning || '', item.name)
      || (structureRelatedFunctions.length
        ? `يُستخدم ${item.name} عندما تحتاج تمرير إعدادات أو خصائص منظمة إلى ${structureRelatedFunctions.map((entry) => api.renderRelatedReferenceLink(entry.name)).join('، ')} بدلاً من تمرير قيم متفرقة.`
        : structureRole.intent);
    const isVariablePage = api.isVariableStructureItem(item.name) || item.syntheticGroup === 'variable';
    const isHandleLikePage = !isVariablePage && isHandleLikeStructureItem(item);
    const indexTitle = isVariablePage ? 'المتغيرات والأنواع الخاصة' : 'الهياكل';
    const indexAction = isVariablePage ? 'showVariablesIndex()' : 'showStructuresIndex()';

    let html = `
      <div class="page-header" id="page-meaning-anchor">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="${indexAction}; return false;">${indexTitle}</a> /
          <span>${item.name}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('structure', 'ui-codicon page-icon', 'هيكل')} ${item.name}</h1>
        <p class="page-description">${structurePageSummary}</p>
      </div>
    `;

    html += api.renderExecutionProfileSection(item, 'structure');
    html += api.renderStructureIntentSection(item);
    html += api.renderPracticalReferenceSection(item, 'structure');
    html += api.renderSystemContextSection(item);
    if (!item.isSynthetic) {
      html += api.renderDeferredStructureSectionShell(item.name, 'fields', `${api.renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} عناصر البنية`, 'يُحمَّل هذا القسم عند الطلب حتى تفتح صفحة الهيكل بسرعة.');
      html += api.renderDeferredStructureSectionShell(item.name, 'function-usage', '🔗 الدوال التي تستقبل هذه البنية', 'يُحمَّل هذا القسم فقط عندما تحتاج رؤية الدوال والبارامترات المرتبطة بهذه البنية.');
      html += api.renderDeferredStructureSectionShell(item.name, 'members-meaning', '🧠 معنى الأعضاء وكيف تُقرأ', 'يُحمَّل هذا القسم عند الطلب لأنه يحتوي على شرح دلالي مفصل لحقول البنية.');
    }
    html += api.renderEntityRelatedConstantsSection(item, 'structure');
    html += api.renderLinkedVulkanExampleSection(item);

    const displayedStructureExample = item.example || getFallbackStructureExample(item);

    if (displayedStructureExample) {
      html += `
        <section class="example-section">
          <h2>💻 مثال</h2>
          <div class="code-container">
            <pre class="code-block"><code class="language-cpp">${api.formatExampleWithLinks(displayedStructureExample)}</code></pre>
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
        headerDescription: isVariablePage
          ? `هذا القسم يربط المثال البرمجي للنوع ${item.name} بالاستخدام الفعلي داخل Vulkan، ثم يجمع المفاهيم والملاحظات والروابط التي تحتاجها لفهمه بسرعة.`
          : (isHandleLikePage
            ? `هذا القسم يوضح كيف يُقرأ المثال المرتبط بالمقبض ${item.name} عمليًا، ومتى يكون صالحًا للاستخدام، وما العناصر المرجعية التي تظهر معه عادةً.`
            : `هذا القسم يفكك المثال المرتبط بالبنية ${item.name} إلى استخدام حقيقي وخطوات تنفيذ ومفاهيم أساسية وروابط مرجعية مرتبطة.`),
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
        kindLabel: isVariablePage
          ? 'نوع أو متغير خاص في Vulkan'
          : (isHandleLikePage ? 'مقبض Vulkan' : 'بنية Vulkan'),
        purpose: isVariablePage
          ? `يوضح المثال كيف يستخدم المبرمج ${item.name} عملياً داخل التهيئة أو المقارنة أو التمرير إلى عناصر Vulkan المرتبطة به.`
          : (isHandleLikePage
            ? `يوضح المثال كيف يحتفظ المبرمج بالمقبض ${item.name} ويتحقق من صلاحيته قبل تمريره إلى دوال Vulkan المرتبطة به.`
            : `يوضح المثال كيف يجهز المبرمج البنية ${item.name} ويملأ عناصرها قبل تمريرها إلى دوال Vulkan المرتبطة بها.`),
        concepts: [
          isVariablePage
            ? `${item.name} ليس اسماً شكلياً فقط، بل نوع رسمي تتوقعه Vulkan بصيغة وتمثيل محددين أثناء التنفيذ.`
            : (isHandleLikePage
              ? `${item.name} ليس الكائن نفسه، بل مقبض رسمي تشير به إلى مورد أو حالة تديرها Vulkan داخلياً.`
              : 'البنية في Vulkan ليست مجرد تجميع شكلي للحقول؛ كل عنصر فيها يحمل معنى تقرأه الدالة لتفهم الإعداد أو الحالة المطلوبة.'),
          isVariablePage
            ? 'اختيار القيمة الصحيحة أو تهيئة هذا النوع بالشكل المتوقع يمنع اللبس بين تمثيل C/C++ المحلي وبين ما تتوقعه واجهة Vulkan فعلياً.'
            : (isHandleLikePage
              ? 'قيمة VK_NULL_HANDLE تعني أن المقبض غير مرتبط بعد بأي مورد فعلي، لذلك يجب التحقق من صلاحيته قبل استخدامه أو تمريره.'
              : 'ترتيب تعبئة العناصر داخل البنية مهم لأن الحقول الإلزامية مثل sType وpNext والحقول الوظيفية هي التي تحدد معنى الاستدعاء فعلياً.')
        ]
      });
    }

    if (item.notes && item.notes.length > 0) {
      html += api.renderLinkedNotesSection(item.notes, '🧠 ملاحظات', {currentItem: item});
    }

    html += renderSeeAlsoSection(item, {
      title: '🔗 يستخدم معه',
      tooltip: `يعرض هذا القسم الكيانات التي تظهر عادة مع ${item.name} أو تعتمد عليه في نفس المسار البرمجي.`,
      ariaLabel: 'يستخدم معه'
    });

    if (!item.isSynthetic) {
      html += api.renderDeferredStructureSectionShell(item.name, 'definition', '🧾 تعريف البنية الكامل', 'يُحمَّل تعريف البنية الكامل عند الطلب مع التعليقات العملية لكل عضو.');
    }

    html += api.renderOfficialDocsFooter(item, 'فتح هذا النوع في وثائق Vulkan الرسمية');

    content.innerHTML = `<div class="reference-unified-detail-page">${html}</div>`;
    document.title = `${item.name} - ArabicVulkan`;
    api.syncRouteHistory(`structure/${item.name}`, options);
    api.scrollMainContentToTop();
    api.highlightCode();
    api.initDeferredStructureSections(content);
    api.syncSidebarWithHash('structure', item.name);
  }

  async function showEnum(name, options = {}) {
    await api.ensureDataSegment('core');
    const vulkanData = api.getVulkanData();
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    api.syncRouteHistory(`enum/${name}`, options);

    const requestedDetailBucket = String(options?.detailBucket || '').trim();
    const enumEntry = api.findItemInCategoriesWithMeta(vulkanData.enums, name);
    const detailBucket = enumEntry?.item?.detailBucket || requestedDetailBucket;
    if (detailBucket) {
      await api.ensureDataSegment('enums', detailBucket);
    }
    let item = api.findItemInCategories(vulkanData.enums, name) || enumEntry?.item || null;
    if (!item) {
      await api.ensureDataSegment('enums');
      item = api.findItemInCategories(vulkanData.enums, name) || enumEntry?.item || null;
    }

    if (!item) {
      content.innerHTML = `
        <div class="page-header">
          <h1>${api.renderEntityIcon('enum', 'ui-codicon page-icon', 'تعداد')} ${name}</h1>
          <p>التعداد غير موجود.</p>
        </div>
      `;
      return;
    }

    const enumNotes = api.dedupeNotes(item.notes || []);
    const enumHeaderDescription = api.simplifyEnumOfficialDescription(item);

    let html = `
      <div class="page-header" id="page-meaning-anchor">
        <nav class="breadcrumb">
          <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
          <a href="#" onclick="showEnumsIndex(); return false;">التعدادات</a> /
          <span>${item.name}</span>
        </nav>
        <h1 class="page-title">${api.renderEntityIcon('enum', 'ui-codicon page-icon', 'تعداد')} ${item.name}</h1>
        <p class="page-description">${api.linkUsageBridgeText(enumHeaderDescription || item.description || '', {currentItem: item, preferredEnumName: item.name})}</p>
      </div>
    `;

    html += api.renderEnumMeaningSection(item);
    html += api.renderExecutionProfileSection(item, 'enum');
    html += api.renderEnumValueTagsSection(item);

    const enumRows = api.getEnumValueRows(item).map((val) => {
      const valueMeta = api.getEnumValueMetadata(val.name, {preferredEnumName: item.name}) || {};
      return {
        name: val.name,
        numeric: val.numeric || valueMeta.numericValue || 'غير موثق محلياً',
        description: val.meaning || val.description || valueMeta.valueMeaning || api.buildEnumValueMeaningFallback(val.name, item.name, {enumName: item.name}),
        usage: val.usage || valueMeta.usage || api.buildEnumValueUsageFallback(val.name, item.name, {enumName: item.name}),
        benefit: val.benefit || valueMeta.benefit || api.buildEnumValueBenefitFallback(val.name, item.name)
      };
    });

    if (enumRows.length > 0) {
      html += `
        <section class="values-section">
          <h2>🔢 القيم المعرفة في التعداد</h2>
          <table class="params-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>القيمة العددية</th>
                <th>الوصف</th>
                <th>الاستخدام العملي</th>
                <th>الفائدة</th>
              </tr>
            </thead>
            <tbody>
      `;

      enumRows.forEach((val) => {
        html += `
          <tr id="${api.getEnumValueAnchorId(item.name, val.name)}">
            <td>${api.renderProjectReferenceChip(val.name, {currentItem: item, preferredEnumName: item.name})}</td>
            <td><code>${api.escapeHtml(val.numeric || 'غير موثق محلياً')}</code></td>
            <td>${api.linkUsageBridgeText(val.description || '', {currentItem: item, preferredEnumName: item.name})}</td>
            <td>${api.linkUsageBridgeText(val.usage || 'تُستخدم عندما يكون هذا هو السلوك المطلوب من التعداد في الحقل أو الدالة المرتبطة به.', {currentItem: item, preferredEnumName: item.name})}</td>
            <td>${api.linkUsageBridgeText(val.benefit || 'تفيد في جعل اختيار القيمة واضحاً ومربوطاً بهدف برمجي محدد.', {currentItem: item, preferredEnumName: item.name})}</td>
          </tr>
        `;
      });

      html += '</tbody></table></section>';
    }

    html += api.renderEntityRelatedConstantsSection(item, 'enum');
    html += api.renderLinkedVulkanExampleSection(item);

    if (item.example) {
      html += `
        <section class="example-section">
          <h2>💻 مثال</h2>
          <div class="code-container">
            <pre class="code-block"><code class="language-cpp">${api.formatExampleWithLinks(item.example)}</code></pre>
          </div>
        </section>
      `;

      html += api.renderGenericExampleExplanation(item, {
        sectionedCards: true,
        sectionTitles: {
          flow: 'مخطط التنفيذ المبسط',
          concepts: 'مفاهيم مرتبطة',
          references: 'القسم 8: قائمة روابط مرجعية مجمعة لكل العناصر المذكورة'
        },
        independentCardKeys: ['flow', 'concepts', 'references'],
        kindLabel: 'تعداد أو أعلام',
        purpose: `يوضح المثال كيفية إسناد قيمة من ${item.name} أو تجهيزها قبل تمريرها إلى دوال Vulkan.`,
        concepts: [
          'التعدادات والأعلام تتحكم في سلوك الدوال أو تحدد أوضاع تشغيل وخصائص معينة.',
          'في الأعلام bitmask يمكن جمع عدة قيم معاً باستخدام العامل | حسب احتياج الاستدعاء.'
        ],
        notes: [],
        visibleSections: {
          commentIssues: false
        }
      });
    }

    if (enumNotes.length > 0) {
      html += api.renderLinkedNotesSection(enumNotes, '🧠 ملاحظات', {currentItem: item, preferredEnumName: item.name});
    }

    html += renderSeeAlsoSection(item, {
      title: '🔗 يستخدم معه',
      tooltip: `يعرض هذا القسم الكيانات التي تعمل مع ${item.name} أو تستقبله أو تعيده في نفس المسار البرمجي.`,
      ariaLabel: 'يستخدم معه'
    });

    html += api.renderEnumCoreRelationsSection(item);
    html += api.renderOfficialDocsFooter(item, 'فتح هذا التعداد في وثائق Vulkan الرسمية');

    content.innerHTML = `<div class="reference-unified-detail-page">${html}</div>`;
    document.title = `${item.name} - ArabicVulkan`;
    api.scrollMainContentToTop();
    api.highlightCode();
    api.syncSidebarWithHash('enum', item.name);
  }

  global.__ARABIC_VULKAN_REFERENCE_PAGES__ = {
    configure,
    showCommand,
    showStructure,
    showEnum
  };
})(window);
