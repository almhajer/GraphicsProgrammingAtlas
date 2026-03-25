(function (global) {
  const api = {
    getVulkanData: () => ({commands: {}, structures: {}, enums: {}}),
    getVulkanFileSections: () => ({}),
    getFileReferenceData: () => ({}),
    getTutorialCatalog: () => [],
    getVariableTypeCollections: () => ({}),
    getAllConstantReferenceEntries: () => [],
    getCommandSummaryText: () => '',
    ensureConstantsListPopulated: async () => {},
    ensureUiSegment: async () => {},
    populateTutorialsList: () => {},
    populateFilesList: () => {},
    syncRouteHistory: () => {},
    scrollMainContentToTop: () => {},
    setActiveSidebarItemBySelector: () => {},
    renderEntityIcon: () => '',
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || '')
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function renderEntityIcon(type, className, label) {
    return api.renderEntityIcon(type, className, label);
  }

  function escapeHtml(value = '') {
    return api.escapeHtml(value);
  }

  function escapeAttribute(value = '') {
    return api.escapeAttribute(value);
  }

  async function showCommandsIndex(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('command', 'ui-codicon page-icon', 'دالة')} فهرس الدوال</h1>
        <p>جميع دوال Vulkan مصنفة أبجدياً</p>
      </div>
    `;

    Object.entries(api.getVulkanData().commands || {}).forEach(([key, category]) => {
      html += `
        <section class="category-section">
          <h2>${category.title}</h2>
          <div class="items-grid">
      `;

      (category.items || []).forEach((item) => {
        html += `
          <div class="item-card" onclick="showCommand('${item.name}', '${key}')">
            <span class="item-icon">${renderEntityIcon('command', 'ui-codicon card-icon', 'دالة')}</span>
            <span class="item-name">${item.name}</span>
            <span class="item-category">${item.category || ''}</span>
            <p>${api.getCommandSummaryText(item)}</p>
          </div>
        `;
      });

      html += '</div></section>';
    });

    content.innerHTML = html;
    document.title = 'فهرس الدوال - ArabicVulkan';
    api.syncRouteHistory('commands', options);
    api.scrollMainContentToTop();
  }

  async function showStructuresIndex(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('structure', 'ui-codicon page-icon', 'هيكل')} فهرس الهياكل</h1>
      </div>
    `;

    Object.entries(api.getVulkanData().structures || {}).forEach(([key, category]) => {
      if (key !== 'structures') {
        return;
      }

      html += `<section class="category-section"><h2>${category.title}</h2><div class="items-grid">`;
      (category.items || []).forEach((item) => {
        html += `
          <div class="item-card" onclick="showStructure('${item.name}')">
            <span class="item-icon">${renderEntityIcon('structure', 'ui-codicon card-icon', 'هيكل')}</span>
            <span class="item-name">${item.name}</span>
          </div>
        `;
      });
      html += '</div></section>';
    });

    content.innerHTML = html;
    document.title = 'فهرس الهياكل - ArabicVulkan';
    api.syncRouteHistory('structures', options);
    api.scrollMainContentToTop();
  }

  async function showEnumsIndex(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('enum', 'ui-codicon page-icon', 'تعداد')} فهرس التعدادات</h1>
      </div>
    `;

    Object.values(api.getVulkanData().enums || {}).forEach((category) => {
      html += `<section class="category-section"><h2>${category.title}</h2><div class="items-grid">`;
      (category.items || []).forEach((item) => {
        html += `
          <div class="item-card" onclick="showEnum('${item.name}', {detailBucket: '${escapeAttribute(item.detailBucket || '')}'})">
            <span class="item-icon">${renderEntityIcon('enum', 'ui-codicon card-icon', 'تعداد')}</span>
            <span class="item-name">${item.name}</span>
          </div>
        `;
      });
      html += '</div></section>';
    });

    content.innerHTML = html;
    document.title = 'فهرس التعدادات - ArabicVulkan';
    api.syncRouteHistory('enums', options);
    api.scrollMainContentToTop();
  }

  function showVariablesIndex(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('variable', 'ui-codicon page-icon', 'متغير')} فهرس المتغيرات والأنواع الخاصة</h1>
        <p>المقابض، الأنواع الأساسية، ومؤشرات الدوال التي تُستخدم مباشرة داخل أمثلة Vulkan والبنى والدوال.</p>
      </div>
    `;

    Object.values(api.getVariableTypeCollections()).forEach((category) => {
      html += `<section class="category-section"><h2>${category.title}</h2><div class="items-grid">`;
      (category.items || []).forEach((item) => {
        html += `
          <div class="item-card" onclick="showStructure('${item.name}')">
            <span class="item-icon">${renderEntityIcon('variable', 'ui-codicon card-icon', 'متغير')}</span>
            <span class="item-name">${item.name}</span>
          </div>
        `;
      });
      html += '</div></section>';
    });

    content.innerHTML = html;
    document.title = 'فهرس المتغيرات والأنواع الخاصة - ArabicVulkan';
    api.syncRouteHistory('variables', options);
    api.scrollMainContentToTop();
  }

  async function showConstantsIndex(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    await api.ensureConstantsListPopulated();
    const grouped = new Map();
    api.getAllConstantReferenceEntries().forEach((entry) => {
      if (!grouped.has(entry.groupKey)) {
        grouped.set(entry.groupKey, []);
      }
      grouped.get(entry.groupKey).push(entry);
    });

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('constant', 'ui-codicon page-icon', 'ثابت')} فهرس الثوابت</h1>
        <p>كل الثوابت القابلة للربط داخل المشروع: ثوابت مستقلة، قيم Enum، وماكرو ثابتة من وثائق Vulkan المحلية.</p>
      </div>
    `;

    Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([groupKey, groupEntries]) => {
      html += `<section class="category-section"><h2>${escapeHtml(groupKey)}</h2><div class="items-grid">`;

      groupEntries.forEach((entry) => {
        const sourceLabel = entry.sourceType === 'enumValue'
          ? `قيمة من ${entry.enumItem?.name || entry.sourceTitle}`
          : entry.sourceType === 'macro'
            ? 'ماكرو ثابت'
            : 'ثابت';
        html += `
          <div class="item-card" onclick="openConstantReference(event, '${escapeAttribute(entry.name)}')">
            <span class="item-icon">${renderEntityIcon('constant', 'ui-codicon card-icon', 'ثابت')}</span>
            <span class="item-name">${escapeHtml(entry.name)}</span>
            <span class="item-category">${escapeHtml(sourceLabel)}</span>
          </div>
        `;
      });

      html += '</div></section>';
    });

    content.innerHTML = html;
    document.title = 'فهرس الثوابت - ArabicVulkan';
    api.syncRouteHistory('constants', options);
    api.scrollMainContentToTop();
  }

  async function showTutorialsIndex(options = {}) {
    await api.ensureUiSegment('tutorials');
    api.populateTutorialsList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const cards = api.getTutorialCatalog().map((tutorial, index) => `
        <div class="tutorial-card" onclick="showTutorial('${tutorial.id}')">
          <span class="tutorial-num">${String(index + 1).padStart(2, '0')}</span>
          <h3>${tutorial.title}</h3>
          <p>${tutorial.brief}</p>
        </div>
    `).join('');

    content.innerHTML = `
      <div class="page-header">
        <h1>${renderEntityIcon('tutorial', 'ui-codicon page-icon', 'درس')} فهرس الدروس التعليمية</h1>
        <p>تعلم Vulkan خطوة بخطوة عبر مسار متدرج من المفاهيم الأولى حتى البناء العملي.</p>
      </div>

      <div class="tutorials-grid">
        ${cards}
      </div>
    `;

    document.title = 'فهرس الدروس - ArabicVulkan';
    api.syncRouteHistory('tutorials', options);
    api.scrollMainContentToTop();
    api.setActiveSidebarItemBySelector(
      'tutorials-list',
      '.nav-item[data-nav-type="tutorials-index"][data-nav-name="tutorials"]'
    );
  }

  async function showFilesIndex(options = {}) {
    await api.ensureUiSegment('files');
    api.populateFilesList();

    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    let html = `
      <div class="page-header">
        <h1>${renderEntityIcon('file', 'ui-codicon page-icon', 'ملف')} فهرس الملفات</h1>
        <p>كل ملفات <span dir="ltr">include/vulkan</span> و<span dir="ltr">include/vulkan/utility</span></p>
      </div>
    `;

    Object.entries(api.getVulkanFileSections()).forEach(([sectionKey, section]) => {
      const categories = Array.from(new Set(section.files.map((fileName) => api.getFileReferenceData()[fileName]?.category).filter(Boolean))).slice(0, 6);
      html += `
        <section class="category-section file-index-group">
          <div class="content-card prose-card">
            <h2>${section.title}</h2>
            <p>يضم هذا القسم <strong>${section.files.length}</strong> ملفًا من المسار <code dir="ltr">${escapeHtml(section.path)}</code>.</p>
            ${categories.length ? `<p>أكثر الأنواع حضورًا هنا: ${categories.map((category) => `<span class="related-chip">${escapeHtml(category)}</span>`).join(' ')}</p>` : ''}
          </div>
          <details class="file-index-details" ${sectionKey === 'headers' ? 'open' : ''}>
            <summary>${renderEntityIcon('file', 'ui-codicon list-icon', 'ملف')} عرض ملفات ${section.title}</summary>
            <div class="items-grid">
              ${section.files.map((fileName) => {
                const file = api.getFileReferenceData()[fileName];
                return `
                  <div class="item-card" onclick="showFile('${fileName}')">
                    <span class="item-icon">${renderEntityIcon('file', 'ui-codicon card-icon', 'ملف')}</span>
                    <span class="item-name">${fileName}</span>
                    <span class="item-category">${file?.category || ''}</span>
                    <p>${escapeHtml(file?.description || '')}</p>
                  </div>
                `;
              }).join('')}
            </div>
          </details>
        </section>
      `;
    });

    content.innerHTML = html;
    document.title = 'فهرس الملفات - ArabicVulkan';
    api.syncRouteHistory('files', options);
    api.scrollMainContentToTop();
  }

  global.__ARABIC_VULKAN_INDEX_PAGES__ = {
    configure,
    showCommandsIndex,
    showStructuresIndex,
    showEnumsIndex,
    showVariablesIndex,
    showConstantsIndex,
    showTutorialsIndex,
    showFilesIndex
  };
})(window);
