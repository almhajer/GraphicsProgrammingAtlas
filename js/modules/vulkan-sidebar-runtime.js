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

    function populateFunctionsList() {
      const container = document.getElementById('functions-list');
      if (!container) return;

      let html = '';
      const addedFunctions = new Set();

      Object.entries(vulkanData.commands || {}).forEach(([key, category]) => {
        (category.items || []).forEach((item) => {
          if (!addedFunctions.has(item.name)) {
            html += `
              <div class="nav-item" data-nav-type="command" data-nav-name="${escapeAttribute(item.name)}" data-command-category="${escapeAttribute(key)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                <span>${renderEntityIcon('command', 'ui-codicon nav-icon', 'دالة')}</span>
                <span>${item.name}</span>
              </div>
            `;
            addedFunctions.add(item.name);
          }
        });
      });

      container.innerHTML = html || '<div class="nav-item">لا توجد دوال</div>';
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

      let html = '';

      Object.entries(getVariableTypeCollections()).forEach(([key, category]) => {
        (category.items || []).forEach((item) => {
          html += `
            <div class="nav-item" data-nav-type="variable" data-nav-name="${escapeAttribute(item.name)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
              <span>${renderEntityIcon(key === 'handles' ? 'handle' : key === 'function_pointers' ? 'function_pointer' : 'variable', 'ui-codicon nav-icon', 'نوع أو متغير')}</span>
              <span>${item.name}</span>
            </div>
          `;
        });
      });

      container.innerHTML = html || '<div class="nav-item">لا توجد متغيرات</div>';
      bindStructureNavItems(container);
    }

    function populateStructuresList() {
      const container = document.getElementById('structures-list');
      if (!container) return;

      let html = '';

      Object.entries(vulkanData.structures || {}).forEach(([key, category]) => {
        if (key !== 'structures') {
          return;
        }
        (category.items || []).forEach((item) => {
          html += `
            <div class="nav-item" data-nav-type="structure" data-nav-name="${escapeAttribute(item.name)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
              <span>${renderEntityIcon('structure', 'ui-codicon nav-icon', 'هيكل')}</span>
              <span>${item.name}</span>
            </div>
          `;
        });
      });

      container.innerHTML = html || '<div class="nav-item">لا توجد هياكل</div>';
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

      let html = '';

      Object.entries(vulkanData.enums || {}).forEach(([, category]) => {
        (category.items || []).forEach((item) => {
          html += `
            <div class="nav-item" data-nav-type="enum" data-nav-name="${escapeAttribute(item.name)}" data-nav-bucket="${escapeAttribute(item.detailBucket || '')}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
              <span>${renderEntityIcon('enum', 'ui-codicon nav-icon', 'تعداد')}</span>
              <span>${item.name}</span>
            </div>
          `;
        });
      });

      container.innerHTML = html || '<div class="nav-item">لا توجد تعدادات</div>';
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
      if (Object.keys(vulkanData.commands || {}).length > 0) {
        populateFunctionsList();
      }
      if (Object.keys(vulkanData.macros || {}).length > 0) {
        populateMacrosList();
      }
      populateConstantsList();
      if (Object.keys(vulkanData.structures || {}).length > 0) {
        populateStructuresList();
      }
      populateVariablesList();
      if (Object.keys(vulkanData.enums || {}).length > 0) {
        populateEnumsList();
      }
      if (uiSegmentLoaded.glsl) {
        populateGlslList();
      }
      if (uiSegmentLoaded.sdl3) {
        populateSdl3List();
      }
      if (uiSegmentLoaded.tutorials) {
        populateTutorialsList();
      }
      if (uiSegmentLoaded.files) {
        populateFilesList();
      }
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
