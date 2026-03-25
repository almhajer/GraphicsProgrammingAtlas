(function(global) {
  'use strict';

  function createVulkanSidebarRuntime(api = {}) {
    const {
      collapseAllSidebarNavGroups,
      escapeAttribute,
      escapeHtml,
      escapeSelectorValue,
      getCommandCategoryKey,
      getGroupedVulkanReadyExamples,
      getVariableTypeCollections,
      getVulkanExampleDisplayTitle,
      getVulkanFileSections,
      getTutorialCatalog,
      populateConstantsList,
      populateGlslList,
      populateSdl3List,
      renderEntityIcon,
      showCommand,
      showStructure,
      toggleConstantGroup,
      uiSegmentLoaded,
      updateVulkanSidebarSectionCounts,
      vulkanData,
      vulkanExpandedExampleGroups
    } = api;

    function buildSidebarNavItemActivationAttrs() {
      return 'onclick="event.stopPropagation(); handleSidebarNavActivation(event, this); return false;"';
    }

    function ensureVulkanSidebarSections() {
      const cluster = document.getElementById('vulkan-cluster');
      if (!cluster) {
        return;
      }

      const ensureSection = ({sectionId, countId, title, icon, onToggle}) => {
        if (document.getElementById(sectionId)) {
          return;
        }

        const shell = document.createElement('div');
        shell.className = 'nav-section vulkan-sidebar-kind-section collapsed';
        shell.innerHTML = `
          <div class="nav-section-header" onclick="${onToggle}">
            <h3><img src="assets/material-icon-theme/${icon}" alt="" class="sidebar-kind-icon ui-codicon nav-icon"> ${title} <span id="${countId}" class="nav-section-inline-count">0</span></h3>
            <span class="icon">▼</span>
          </div>
          <div id="${sectionId}" class="nav-items"></div>
        `;

        const insertBeforeNode = cluster.querySelector('#tutorials-list')?.closest('.nav-section')
          || cluster.querySelector('#files-list')?.closest('.nav-section')
          || cluster.querySelector('#examples-list')?.closest('.nav-section')
          || null;
        cluster.insertBefore(shell, insertBeforeNode);
      };

      ensureSection({sectionId: 'functions-list', countId: 'vulkan-functions-count', title: 'الدوال', icon: 'function.svg', onToggle: "toggleSection('functions-list')"});
      ensureSection({sectionId: 'macros-list', countId: 'vulkan-macros-count', title: 'الماكرو', icon: 'macro.svg', onToggle: "toggleSection('macros-list')"});
      ensureSection({sectionId: 'constants-list', countId: 'vulkan-constants-count', title: 'الثوابت', icon: 'constant.svg', onToggle: "toggleSection('constants-list')"});
      ensureSection({sectionId: 'structures-list', countId: 'vulkan-structures-count', title: 'البنى', icon: 'structure.svg', onToggle: "toggleSection('structures-list')"});
      ensureSection({sectionId: 'variables-list', countId: 'vulkan-variables-count', title: 'المتغيرات', icon: 'variable.svg', onToggle: "toggleSection('variables-list')"});
    }

    function bindFunctionNavItems(container) {
      if (!container || container.dataset.bound === 'true') {
        return;
      }

      container.dataset.bound = 'true';

      container.addEventListener('click', (event) => {
        const item = event.target.closest('.nav-item[data-nav-type="command"]');
        if (!item || !container.contains(item)) {
          return;
        }
        openFunctionNavItem(event, item);
      });

      container.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        const item = event.target.closest('.nav-item[data-nav-type="command"]');
        if (!item || !container.contains(item)) {
          return;
        }
        openFunctionNavItem(event, item);
      });
    }

    async function openFunctionNavItem(elementOrEvent, maybeElement = null) {
      const element = maybeElement || elementOrEvent;
      const event = maybeElement ? elementOrEvent : (global.event || null);

      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }

      const itemName = element?.getAttribute?.('data-nav-name') || '';
      const categoryKey = element?.getAttribute?.('data-command-category') || (typeof getCommandCategoryKey === 'function' ? getCommandCategoryKey(itemName) : '');
      if (!itemName) {
        return false;
      }

      await showCommand(itemName, categoryKey);
      return false;
    }

    function classifyVulkanCommand(name = '') {
      const value = String(name || '').trim();
      if (!value) {
        return {key: 'other', title: 'مسارات عامة'};
      }

      if (/^vkCmd/.test(value)) {
        return {key: 'cmd', title: 'أوامر الرسم والتسجيل'};
      }
      if (/Present|Swapchain|Surface|Display|AcquireNextImage/.test(value)) {
        return {key: 'presentation', title: 'العرض و Swapchain'};
      }
      if (/Semaphore|Fence|Event|Barrier|Wait|Signal|Submit|QueueSubmit|QueueWaitIdle/.test(value)) {
        return {key: 'sync', title: 'المزامنة والإرسال'};
      }
      if (/AllocateMemory|FreeMemory|MapMemory|UnmapMemory|FlushMappedMemoryRanges|InvalidateMappedMemoryRanges|BindBufferMemory|BindImageMemory|Buffer|Image|ImageView|Sampler|AccelerationStructure|Micromap/.test(value)) {
        return {key: 'memory', title: 'الذاكرة والموارد'};
      }
      if (/Create|Destroy/.test(value)) {
        return {key: 'lifecycle', title: 'الإنشاء والتدمير'};
      }
      if (/Enumerate|GetPhysicalDevice|GetDevice|GetInstance|GetQueryPool|GetPipeline|GetRenderArea|GetSemaphore|GetFence|GetEvent|GetBuffer|GetImage|GetAccelerationStructure/.test(value)) {
        return {key: 'query', title: 'الاستعلام والقدرات'};
      }
      if (/Debug|Marker|Utils|Report/.test(value)) {
        return {key: 'debug', title: 'التصحيح والأدوات'};
      }
      if (/Instance|PhysicalDevice|Device|Queue/.test(value)) {
        return {key: 'setup', title: 'التهيئة والأجهزة والطوابير'};
      }
      return {key: 'other', title: 'مسارات عامة'};
    }

    function classifyVulkanStructure(name = '') {
      const value = String(name || '').trim();
      if (!value) {
        return {key: 'other', title: 'بنى عامة'};
      }
      if (/CreateInfo|AllocateInfo|BeginInfo|SubmitInfo|PresentInfo/.test(value)) {
        return {key: 'setup', title: 'بنى الإنشاء والتهيئة'};
      }
      if (/Features|Properties|Requirements|Capabilities/.test(value)) {
        return {key: 'capabilities', title: 'القدرات والخصائص'};
      }
      if (/Memory|Buffer|Image|ImageView|Sampler/.test(value)) {
        return {key: 'memory', title: 'الذاكرة والصور والمخازن'};
      }
      if (/Pipeline|Shader|RenderPass|Framebuffer|Attachment|Subpass/.test(value)) {
        return {key: 'render', title: 'الرسم والـ Pipeline'};
      }
      if (/Descriptor|PushConstant|SetLayout/.test(value)) {
        return {key: 'descriptor', title: 'الربط والـ Descriptors'};
      }
      if (/Command|Queue/.test(value)) {
        return {key: 'commands', title: 'الأوامر والطوابير'};
      }
      if (/Semaphore|Fence|Event|Barrier/.test(value)) {
        return {key: 'sync', title: 'المزامنة'};
      }
      if (/Surface|Swapchain|Present|Display/.test(value)) {
        return {key: 'presentation', title: 'العرض و Swapchain'};
      }
      return {key: 'other', title: 'بنى عامة'};
    }

    function classifyVulkanEnum(name = '') {
      const value = String(name || '').trim();
      if (!value) {
        return {key: 'other', title: 'تعدادات عامة'};
      }
      if (/FlagBits|Flags/.test(value)) {
        return {key: 'flags', title: 'الأعلام والبتات'};
      }
      if (/StructureType|ObjectType|Result/.test(value)) {
        return {key: 'core', title: 'أنواع النظام والنتائج'};
      }
      if (/Format|Color|SampleCount|ImageLayout|ImageType|ImageUsage|BufferUsage/.test(value)) {
        return {key: 'resources', title: 'الموارد والصيغ'};
      }
      if (/Shader|Pipeline|Primitive|Blend|Cull|Polygon|Compare|Stencil|LogicOp|DynamicState/.test(value)) {
        return {key: 'render', title: 'الرسم والـ Pipeline'};
      }
      if (/Descriptor|Sampler|Filter|BorderColor/.test(value)) {
        return {key: 'descriptor', title: 'الربط والعينات'};
      }
      if (/Present|Surface|Swapchain|ColorSpace|CompositeAlpha/.test(value)) {
        return {key: 'presentation', title: 'العرض و Swapchain'};
      }
      if (/Queue|Command|Semaphore|Fence|Event|Access|Dependency|PipelineStage/.test(value)) {
        return {key: 'sync', title: 'الأوامر والمزامنة'};
      }
      return {key: 'other', title: 'تعدادات عامة'};
    }

    function getVulkanVariableGroupMeta(key = '') {
      switch (String(key || '').trim()) {
        case 'handles':
          return {key: 'handles', title: 'المقابض Handles', iconType: 'handle'};
        case 'function_pointers':
          return {key: 'function-pointers', title: 'مؤشرات الدوال', iconType: 'function_pointer'};
        case 'basetypes':
          return {key: 'base-types', title: 'الأنواع الأساسية', iconType: 'variable'};
        case 'defines':
          return {key: 'defines', title: 'تعريفات عامة', iconType: 'variable'};
        default:
          return {key: String(key || 'other').trim() || 'other', title: 'أنواع ومتغيرات عامة', iconType: 'variable'};
      }
    }

    function renderVulkanNavGroups(groups = [], options = {}) {
      const {
        emptyText = 'لا توجد عناصر',
        indexNavType = '',
        indexNavName = '',
        indexLabel = '',
        indexIconType = 'variable',
        itemNavType = '',
        itemIconType = 'variable',
        itemExtraAttrs = null
      } = options;

      const indexItem = indexNavType ? `
        <div class="nav-item" data-nav-type="${escapeAttribute(indexNavType)}" data-nav-name="${escapeAttribute(indexNavName)}" tabindex="0" role="button">
          <span>${renderEntityIcon(indexIconType, 'ui-codicon nav-icon', indexLabel)}</span>
          <span>${escapeHtml(indexLabel)}</span>
        </div>
      ` : '';

      const groupsHtml = groups.map((group) => `
        <div class="nav-constant-group file-nav-group vulkan-classified-nav-group collapsed" data-vulkan-nav-group="${escapeAttribute(group.key)}">
          <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
            <span class="nav-constant-group-title-wrap">
              <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
              <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
            </span>
            <span class="nav-constant-group-count">${group.items.length}</span>
          </div>
          <div class="nav-constant-group-items">
            ${group.items.map((item) => `
              <div class="nav-item" data-nav-type="${escapeAttribute(itemNavType)}" data-nav-name="${escapeAttribute(item.name)}" ${itemExtraAttrs ? itemExtraAttrs(item) : ''} tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                <span>${renderEntityIcon(item.iconType || itemIconType, 'ui-codicon nav-icon', item.label || item.name)}</span>
                <span>${escapeHtml(item.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      return indexItem + (groupsHtml || `<div class="nav-item">${escapeHtml(emptyText)}</div>`);
    }

    function populateFunctionsList() {
      const container = document.getElementById('functions-list');
      if (!container) return;

      const groupsMap = new Map();
      const addedFunctions = new Set();

      Object.entries(vulkanData.commands || {}).forEach(([, category]) => {
        const items = (category.items || []).filter((item) => {
          if (!item?.name || addedFunctions.has(item.name)) {
            return false;
          }
          addedFunctions.add(item.name);
          return true;
        });

        items.forEach((item) => {
          const bucket = classifyVulkanCommand(item.name);
          if (!groupsMap.has(bucket.key)) {
            groupsMap.set(bucket.key, {
              key: bucket.key,
              title: bucket.title,
              items: []
            });
          }
          groupsMap.get(bucket.key).items.push(item);
        });
      });

      const groups = Array.from(groupsMap.values()).filter((group) => group.items.length);

      const indexItem = `
        <div class="nav-item" data-nav-type="functions-index" data-nav-name="functions" tabindex="0" role="button">
          <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'فهرس الدوال')}</span>
          <span>فهرس الدوال</span>
        </div>
      `;

      const groupsHtml = groups.map((group) => `
        <div class="nav-constant-group file-nav-group vulkan-function-nav-group collapsed" data-vulkan-function-group="${escapeAttribute(group.key)}">
          <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
            <span class="nav-constant-group-title-wrap">
              <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
              <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
            </span>
            <span class="nav-constant-group-count">${group.items.length}</span>
          </div>
          <div class="nav-constant-group-items">
            ${group.items.map((item) => `
              <div class="nav-item" data-nav-type="command" data-nav-name="${escapeAttribute(item.name)}" data-command-category="${escapeAttribute(typeof getCommandCategoryKey === 'function' ? getCommandCategoryKey(item.name) : '')}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'دالة')}</span>
                <span>${escapeHtml(item.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      container.innerHTML = indexItem + (groupsHtml || '<div class="nav-item">لا توجد دوال</div>');
      bindFunctionNavItems(container);
    }

    function populateMacrosList() {
      const container = document.getElementById('macros-list');
      if (!container) return;

      let html = '';

      Object.entries(vulkanData.macros || {}).forEach(([, category]) => {
        (category.items || []).forEach((item) => {
          if (item.name) {
            html += `
              <div class="nav-item" data-nav-type="macro" data-nav-name="${escapeAttribute(item.name)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                <span>${renderEntityIcon('macro', 'ui-codicon nav-icon', 'ماكرو')}</span>
                <span>${item.name}</span>
              </div>
            `;
          }
        });
      });

      if (!html) {
        Object.entries(vulkanData.constants || {}).forEach(([, category]) => {
          (category.items || []).forEach((item) => {
            if (item.name && item.name.startsWith('VK_')) {
              html += `
                <div class="nav-item" data-nav-type="constant" data-nav-name="${escapeAttribute(item.name)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                  <span>${renderEntityIcon('macro', 'ui-codicon nav-icon', 'ماكرو')}</span>
                  <span>${item.name}</span>
                </div>
              `;
            }
          });
        });
      }

      container.innerHTML = html || '<div class="nav-item">لا توجد ماكرو</div>';
    }

    function populateVariablesList() {
      const container = document.getElementById('variables-list');
      if (!container) return;

      const groups = Object.entries(getVariableTypeCollections()).map(([key, category]) => {
        const meta = getVulkanVariableGroupMeta(key);
        return {
          key: meta.key,
          title: String(category?.title || meta.title).trim(),
          items: (category.items || []).map((item) => ({
            ...item,
            iconType: meta.iconType
          }))
        };
      }).filter((group) => group.items.length);

      container.innerHTML = renderVulkanNavGroups(groups, {
        emptyText: 'لا توجد متغيرات',
        indexNavType: 'variables-index',
        indexNavName: 'variables',
        indexLabel: 'فهرس المتغيرات',
        indexIconType: 'variable',
        itemNavType: 'variable',
        itemIconType: 'variable'
      });
      bindStructureNavItems(container);
    }

    function populateStructuresList() {
      const container = document.getElementById('structures-list');
      if (!container) return;

      const groupsMap = new Map();
      Object.entries(vulkanData.structures || {}).forEach(([key, category]) => {
        if (key !== 'structures') {
          return;
        }
        (category.items || []).forEach((item) => {
          const bucket = classifyVulkanStructure(item.name);
          if (!groupsMap.has(bucket.key)) {
            groupsMap.set(bucket.key, {key: bucket.key, title: bucket.title, items: []});
          }
          groupsMap.get(bucket.key).items.push(item);
        });
      });

      container.innerHTML = renderVulkanNavGroups(Array.from(groupsMap.values()), {
        emptyText: 'لا توجد هياكل',
        indexNavType: 'structures-index',
        indexNavName: 'structures',
        indexLabel: 'فهرس الهياكل',
        indexIconType: 'structure',
        itemNavType: 'structure',
        itemIconType: 'structure'
      });
      bindStructureNavItems(container);
    }

    function bindStructureNavItems() {
      return;
    }

    async function openStructureNavItem(elementOrEvent, maybeElement = null) {
      const element = maybeElement || elementOrEvent;
      const event = maybeElement ? elementOrEvent : (global.event || null);

      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }

      const itemName = element?.getAttribute?.('data-nav-name') || '';
      if (!itemName) {
        return false;
      }

      await showStructure(itemName);
      return false;
    }

    function populateEnumsList() {
      const container = document.getElementById('enums-list');
      if (!container) return;

      const groupsMap = new Map();
      Object.entries(vulkanData.enums || {}).forEach(([, category]) => {
        (category.items || []).forEach((item) => {
          const bucket = classifyVulkanEnum(item.name);
          if (!groupsMap.has(bucket.key)) {
            groupsMap.set(bucket.key, {key: bucket.key, title: bucket.title, items: []});
          }
          groupsMap.get(bucket.key).items.push(item);
        });
      });

      container.innerHTML = renderVulkanNavGroups(Array.from(groupsMap.values()), {
        emptyText: 'لا توجد تعدادات',
        indexNavType: 'enums-index',
        indexNavName: 'enums',
        indexLabel: 'فهرس التعدادات',
        indexIconType: 'enum',
        itemNavType: 'enum',
        itemIconType: 'enum',
        itemExtraAttrs: (item) => `data-nav-bucket="${escapeAttribute(item.detailBucket || '')}"`
      });
    }

    function populateTutorialsList() {
      const container = document.getElementById('tutorials-list');
      if (!container) return;

      const tutorialCatalog = typeof getTutorialCatalog === 'function' ? (getTutorialCatalog() || []) : [];
      const tutorialItemsHtml = tutorialCatalog.map((tutorial, index) => `
        <div class="nav-item" data-nav-type="tutorial" data-nav-name="${escapeAttribute(tutorial.id)}" tabindex="0" role="button">
          <span>${index + 1}.</span>
          <span>${tutorial.title}</span>
        </div>
      `).join('');

      const html = `
        <div class="nav-item" data-nav-type="tutorials-index" data-nav-name="tutorials" tabindex="0" role="button">
          <span>${renderEntityIcon('tutorial', 'ui-codicon nav-icon', 'فهرس الدروس')}</span>
          <span>فهرس الدروس</span>
        </div>
        ${tutorialItemsHtml || '<div class="nav-item">لا توجد دروس</div>'}
      `;

      container.innerHTML = html || '<div class="nav-item">لا توجد دروس</div>';
    }

    function populateVulkanExamplesList() {
      const container = document.getElementById('examples-list');
      if (!container) return;

      const groupedExamples = getGroupedVulkanReadyExamples();
      const exampleGroupsHtml = groupedExamples.map((group) => {
        const isExpanded = vulkanExpandedExampleGroups.has(group.id);
        return `
          <div class="nav-constant-group file-nav-group vulkan-example-nav-group${isExpanded ? '' : ' collapsed'}" data-vulkan-example-group="${escapeAttribute(group.id)}">
            <div class="nav-constant-group-header" onclick="toggleVulkanExampleGroup('${escapeAttribute(group.id)}')">
              <span class="nav-constant-group-title-wrap">
                <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
                <span class="nav-constant-group-title">${escapeHtml(group.title)}</span>
              </span>
              <span class="nav-constant-group-count">${group.examples.length}</span>
            </div>
            <div class="nav-constant-group-items">
              <div class="nav-group-description">${escapeHtml(group.description)}</div>
              ${group.examples.map((example, index) => `
                <div class="nav-item" data-nav-type="vulkan-example" data-nav-name="${escapeAttribute(example.id)}" tabindex="0" role="button" data-tooltip="${escapeAttribute(example.goal || example.expectedResult || group.description)}">
                  <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'مثال فولكان')}</span>
                  <span>${escapeHtml(getVulkanExampleDisplayTitle(example) || `مثال ${index + 1}`)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

      const html = `
        <div class="nav-item" data-nav-type="vulkan-examples-index" data-nav-name="vulkan-examples" tabindex="0" role="button">
          <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'فهرس أمثلة فولكان')}</span>
          <span>فهرس أمثلة فولكان</span>
        </div>
        ${exampleGroupsHtml || '<div class="nav-item">لا توجد أمثلة</div>'}
      `;

      container.innerHTML = html || '<div class="nav-item">لا توجد أمثلة</div>';
    }

    function toggleVulkanExampleGroup(groupId) {
      const normalizedGroupId = String(groupId || '').trim();
      if (!normalizedGroupId) {
        return;
      }

      const group = document.querySelector(`.vulkan-example-nav-group[data-vulkan-example-group="${escapeSelectorValue(normalizedGroupId)}"]`);
      if (!group) {
        return;
      }

      const willExpand = group.classList.contains('collapsed');
      if (!willExpand) {
        collapseAllSidebarNavGroups();
        return;
      }

      collapseAllSidebarNavGroups(group);
      group.classList.remove('collapsed');
      vulkanExpandedExampleGroups.add(normalizedGroupId);
    }

    function populateFilesList() {
      const container = document.getElementById('files-list');
      if (!container) return;

      const vulkanFileSections = typeof getVulkanFileSections === 'function' ? (getVulkanFileSections() || {}) : {};
      let html = '';
      Object.entries(vulkanFileSections).forEach(([, section]) => {
        html += `
          <div class="nav-constant-group file-nav-group collapsed">
            <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
              <span class="nav-constant-group-title-wrap">
                <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
                <span class="nav-constant-group-title">${escapeHtml(section.title)}</span>
              </span>
              <span class="nav-constant-group-count">${section.files.length}</span>
            </div>
            <div class="nav-constant-group-items">
              ${section.files.map((fileName) => `
                <div class="nav-item" data-nav-type="file" data-nav-name="${escapeAttribute(fileName)}" tabindex="0" role="button">
                  <span>${renderEntityIcon('file', 'ui-codicon nav-icon', 'ملف')}</span>
                  <span>${fileName}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });

      container.innerHTML = html || '<div class="nav-item">لا توجد ملفات</div>';
    }

    function populateSidebar() {
      ensureVulkanSidebarSections();
      if (typeof updateVulkanSidebarSectionCounts === 'function') {
        updateVulkanSidebarSectionCounts();
      }
    }

    return Object.freeze({
      buildSidebarNavItemActivationAttrs,
      ensureVulkanSidebarSections,
      populateSidebar,
      populateFunctionsList,
      bindFunctionNavItems,
      openFunctionNavItem,
      populateMacrosList,
      populateVariablesList,
      populateStructuresList,
      bindStructureNavItems,
      openStructureNavItem,
      populateEnumsList,
      populateTutorialsList,
      populateVulkanExamplesList,
      toggleVulkanExampleGroup,
      populateFilesList
    });
  }

  global.createVulkanSidebarRuntime = createVulkanSidebarRuntime;
  global.__ARABIC_VULKAN_VULKAN_SIDEBAR_RUNTIME__ = {
    createVulkanSidebarRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
