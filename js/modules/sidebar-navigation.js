window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ = (() => {
  const vulkanExpandedExampleGroups = new Set();
  const glslExpandedExampleGroups = new Set();
  const glslExpandedReferenceSections = new Set();
  const imguiExpandedReferenceSections = new Set();
  const imguiExpandedExampleGroups = new Set();
  const gameUiExpandedReferenceSections = new Set();
  const gameUiExpandedExampleGroups = new Set();
  const sdl3ExpandedPackageSections = new Set();
  const sdl3ExpandedNavGroups = new Set();
  let activeSidebarItem = null;
  let activeSidebarTrail = [];
  let expandedSidebarCluster = null;
  let expandedSidebarSection = null;
  let expandedSidebarNavGroup = null;

  function syncSidebarInteractionSemantics(root = document) {
    root.querySelectorAll?.('.nav-cluster').forEach((cluster) => {
      const header = cluster.querySelector('.nav-super-header');
      if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', String(!cluster.classList.contains('collapsed')));
      }
    });

    root.querySelectorAll?.('.nav-section').forEach((section) => {
      const header = section.querySelector('.nav-section-header');
      if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', String(!section.classList.contains('collapsed')));
      }
    });

    root.querySelectorAll?.('.nav-constant-group').forEach((group) => {
      const header = group.querySelector('.nav-constant-group-header');
      if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', String(!group.classList.contains('collapsed')));
      }
    });
  }

  function rememberSidebarSectionState(section, isExpanded) {
    if (section?.classList?.contains('glsl-reference-kind-section')) {
      const glslSectionContainer = section.querySelector('.nav-items[id]');
      if (glslSectionContainer?.id) {
        window.rememberGlslReferenceSectionStateById(glslSectionContainer.id, isExpanded);
      }
      return;
    }

    if (section?.classList?.contains('imgui-reference-kind-section')) {
      const imguiSectionContainer = section.querySelector('.nav-items[id]');
      if (imguiSectionContainer?.id) {
        window.rememberImguiReferenceSectionStateById(imguiSectionContainer.id, isExpanded);
      }
      return;
    }

    if (section?.classList?.contains('game-ui-reference-kind-section')) {
      const gameUiSectionContainer = section.querySelector('.nav-items[id]');
      if (gameUiSectionContainer?.id) {
        window.rememberGameUiReferenceSectionStateById(gameUiSectionContainer.id, isExpanded);
      }
      return;
    }

    const sectionContainer = section.querySelector('.nav-items[id]');
    if (!section?.classList?.contains('sdl3-package-kind-section') || !sectionContainer?.id) {
      return;
    }

    window.rememberSdl3PackageSectionStateById(sectionContainer.id, isExpanded);
  }

  function collapseAllSidebarSections(exceptSection = null) {
    if (expandedSidebarSection?.isConnected && expandedSidebarSection !== exceptSection) {
      expandedSidebarSection.classList.add('collapsed');
      rememberSidebarSectionState(expandedSidebarSection, false);
    } else if (!expandedSidebarSection?.isConnected) {
      document.querySelectorAll('.nav-section').forEach((section) => {
        if (section === exceptSection) {
          return;
        }
        section.classList.add('collapsed');
        rememberSidebarSectionState(section, false);
      });
    }

    if (exceptSection) {
      exceptSection.classList.remove('collapsed');
      rememberSidebarSectionState(exceptSection, true);
    }
    expandedSidebarSection = exceptSection || null;
    syncSidebarInteractionSemantics();
  }

  function collapseAllSidebarClusters(exceptClusterId = '') {
    const exceptCluster = exceptClusterId ? document.getElementById(exceptClusterId) : null;

    if (expandedSidebarCluster?.isConnected && expandedSidebarCluster !== exceptCluster) {
      expandedSidebarCluster.classList.add('collapsed');
    } else if (!expandedSidebarCluster?.isConnected) {
      document.querySelectorAll('.nav-cluster').forEach((cluster) => {
        if (cluster === exceptCluster) {
          return;
        }
        cluster.classList.add('collapsed');
      });
    }

    if (exceptCluster) {
      exceptCluster.classList.remove('collapsed');
    }
    expandedSidebarCluster = exceptCluster || null;
    syncSidebarInteractionSemantics();
  }

  function rememberSidebarNavGroupState(group, isExpanded) {
    const glslGroupId = String(group?.dataset?.glslExampleGroup || '').trim();
    if (glslGroupId) {
      if (isExpanded) {
        glslExpandedExampleGroups.add(glslGroupId);
      } else {
        glslExpandedExampleGroups.delete(glslGroupId);
      }
      return;
    }

    const imguiGroupId = String(group?.dataset?.imguiExampleGroup || '').trim();
    if (imguiGroupId) {
      if (isExpanded) {
        imguiExpandedExampleGroups.add(imguiGroupId);
      } else {
        imguiExpandedExampleGroups.delete(imguiGroupId);
      }
      return;
    }

    const gameUiGroupId = String(group?.dataset?.gameUiExampleGroup || '').trim();
    if (gameUiGroupId) {
      if (isExpanded) {
        gameUiExpandedExampleGroups.add(gameUiGroupId);
      } else {
        gameUiExpandedExampleGroups.delete(gameUiGroupId);
      }
      return;
    }

    const vulkanGroupId = String(group?.dataset?.vulkanExampleGroup || '').trim();
    if (vulkanGroupId) {
      if (isExpanded) {
        vulkanExpandedExampleGroups.add(vulkanGroupId);
      } else {
        vulkanExpandedExampleGroups.delete(vulkanGroupId);
      }
      return;
    }

    window.rememberSdl3NavGroupState(group, isExpanded);
  }

  function collapseAllSidebarNavGroups(exceptGroup = null) {
    if (expandedSidebarNavGroup?.isConnected && expandedSidebarNavGroup !== exceptGroup) {
      expandedSidebarNavGroup.classList.add('collapsed');
      rememberSidebarNavGroupState(expandedSidebarNavGroup, false);
    } else if (!expandedSidebarNavGroup?.isConnected) {
      document.querySelectorAll('.nav-constant-group').forEach((group) => {
        if (group === exceptGroup) {
          return;
        }
        group.classList.add('collapsed');
        rememberSidebarNavGroupState(group, false);
      });
    }

    if (exceptGroup) {
      exceptGroup.classList.remove('collapsed');
      rememberSidebarNavGroupState(exceptGroup, true);
    }
    expandedSidebarNavGroup = exceptGroup || null;
    syncSidebarInteractionSemantics();
  }

  async function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const parentSection = section.closest('.nav-section');
    if (!parentSection) {
      return;
    }

    const wasExpanded = !parentSection.classList.contains('collapsed');
    if (wasExpanded) {
      collapseAllSidebarSections();
      collapseAllSidebarNavGroups();
      return;
    }

    const callWindowFn = (name, ...args) => {
      if (typeof window[name] === 'function') {
        return window[name](...args);
      }
      console.warn(`Sidebar function is not ready yet: ${name}`);
      return undefined;
    };

    if (sectionId === 'functions-list') {
      callWindowFn('populateFunctionsList');
    } else if (sectionId === 'macros-list') {
      callWindowFn('populateMacrosList');
    } else if (sectionId === 'structures-list') {
      callWindowFn('populateStructuresList');
    } else if (sectionId === 'variables-list') {
      callWindowFn('populateVariablesList');
    } else if (sectionId === 'enums-list') {
      callWindowFn('populateEnumsList');
    } else if (sectionId === 'constants-list') {
      await window.ensureConstantsListPopulated();
    } else if (sectionId === 'glsl-list') {
      await window.ensureUiSegment('glsl');
      callWindowFn('populateGlslList');
    } else if (sectionId === 'sdl3-list') {
      await window.ensureUiSegment('sdl3');
      callWindowFn('populateSdl3List');
    } else if (sectionId === 'sdl3-functions-list') {
      await window.ensureSdl3SectionData('functions');
      callWindowFn('populateSdl3EntityNavSection', 'functions', sectionId);
    } else if (sectionId === 'sdl3-types-list') {
      await window.ensureSdl3SectionData('types');
      callWindowFn('populateSdl3EntityNavSection', 'types', sectionId);
    } else if (sectionId === 'sdl3-enums-list') {
      await window.ensureSdl3SectionData('enums');
      callWindowFn('populateSdl3EntityNavSection', 'enums', sectionId);
    } else if (sectionId === 'sdl3-constants-list') {
      await window.ensureSdl3SectionData('constants');
      callWindowFn('populateSdl3EntityNavSection', 'constants', sectionId);
    } else if (sectionId === 'sdl3-macros-list') {
      await window.ensureSdl3SectionData('macros');
      callWindowFn('populateSdl3EntityNavSection', 'macros', sectionId);
    } else if (sectionId === 'tutorials-list') {
      await window.ensureUiSegment('tutorials');
      callWindowFn('populateTutorialsList');
    } else if (sectionId === 'examples-list') {
      callWindowFn('populateVulkanExamplesList');
    } else if (sectionId === 'files-list') {
      await window.ensureUiSegment('files');
      callWindowFn('populateFilesList');
    }

    const cluster = parentSection.closest('.nav-cluster');
    if (cluster) {
      collapseAllSidebarClusters(cluster.id || '');
      cluster.classList.remove('collapsed');
    }

    collapseAllSidebarSections(parentSection);
    collapseAllSidebarNavGroups();
    parentSection.classList.remove('collapsed');
  }

  async function toggleSidebarCluster(clusterId) {
    const cluster = document.getElementById(clusterId);
    if (!cluster) {
      return;
    }

    const wasExpanded = !cluster.classList.contains('collapsed');
    if (wasExpanded) {
      collapseAllSidebarClusters();
      collapseAllSidebarSections();
      collapseAllSidebarNavGroups();
      return;
    }

    if (clusterId === 'glsl-cluster') {
      await window.ensureUiSegment('glsl');
      window.populateGlslList();
    }

    if (clusterId === 'cmake-cluster') {
      await window.ensureUiSegment('cmakeSearch');
      window.populateCmakeList();
    }

    if (clusterId === 'cpp-cluster') {
      await window.ensureUiSegment('cppHome');
      window.populateCppList();
    }

    if (clusterId === 'imgui-cluster') {
      await window.ensureUiSegment('imgui');
      window.populateImguiList();
    }

    if (clusterId === 'game-ui-cluster') {
      await window.ensureUiSegment('gameui');
      window.populateGameUiList();
    }

    const sdl3PackageKey = window.getSdl3PackageKeyFromClusterId(clusterId);
    if (sdl3PackageKey) {
      await window.ensureUiSegment('sdl3');
      await window.ensureSdl3PackageSidebarData?.(sdl3PackageKey);
      window.populateSdl3PackageSidebar(sdl3PackageKey);
    }

    collapseAllSidebarClusters(clusterId);
    collapseAllSidebarSections();
    collapseAllSidebarNavGroups();
    cluster.classList.remove('collapsed');
  }

  function expandSidebarClusterForSection(sectionId) {
    const section = document.getElementById(sectionId);
    const cluster = section?.closest('.nav-cluster');
    if (cluster) {
      collapseAllSidebarClusters(cluster.id || '');
      cluster.classList.remove('collapsed');
    }
  }

  function isSdl3SidebarCluster(element) {
    return !!element?.closest?.('.nav-cluster.nav-cluster-sdl3');
  }

  function expandSidebarSectionById(sectionId) {
    expandSidebarClusterForSection(sectionId);
    const section = document.getElementById(sectionId);
    const parentSection = section?.closest('.nav-section');
    const keepSdl3Expanded = isSdl3SidebarCluster(section);
    if (parentSection) {
      if (!keepSdl3Expanded) {
        collapseAllSidebarSections(parentSection);
        collapseAllSidebarNavGroups();
      }
      parentSection.classList.remove('collapsed');
      window.hydrateExpandedSdl3NavGroups(section);
      return;
    }

    if (!keepSdl3Expanded) {
      collapseAllSidebarSections();
      collapseAllSidebarNavGroups();
    }
  }

  function clearActiveSidebarItems() {
    if (activeSidebarItem?.isConnected) {
      activeSidebarItem.classList.remove('active');
      activeSidebarItem.removeAttribute('aria-current');
    } else {
      document.querySelectorAll('.nav-item.active').forEach((item) => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      });
    }

    if (activeSidebarTrail.length) {
      activeSidebarTrail.forEach((element) => {
        if (element?.isConnected) {
          element.classList.remove('has-active-trail');
        }
      });
    } else {
      document.querySelectorAll('.nav-cluster.has-active-trail, .nav-section.has-active-trail, .nav-constant-group.has-active-trail').forEach((element) => {
        element.classList.remove('has-active-trail');
      });
    }

    activeSidebarItem = null;
    activeSidebarTrail = [];
  }

  function expandSidebarContextForItem(targetItem) {
    if (!targetItem) {
      return;
    }

    const cluster = targetItem.closest('.nav-cluster');
    const keepSdl3Expanded = isSdl3SidebarCluster(targetItem);
    collapseAllSidebarClusters(cluster?.id || '');
    if (cluster) {
      cluster.classList.remove('collapsed');
      cluster.classList.add('has-active-trail');
      expandedSidebarCluster = cluster;
    }

    const parentSection = targetItem.closest('.nav-section');
    if (!keepSdl3Expanded) {
      collapseAllSidebarSections(parentSection);
    }
    if (parentSection) {
      parentSection.classList.remove('collapsed');
      parentSection.classList.add('has-active-trail');
      expandedSidebarSection = parentSection;
    }

    const group = targetItem.closest('.nav-constant-group');
    if (!keepSdl3Expanded) {
      collapseAllSidebarNavGroups(group);
    }
    if (group) {
      group.classList.remove('collapsed');
      group.classList.add('has-active-trail');
      rememberSidebarNavGroupState(group, true);
      window.hydrateLazySdl3NavGroup(group);
      expandedSidebarNavGroup = group;
    }

    activeSidebarTrail = [cluster, parentSection, group].filter(Boolean);

    syncSidebarInteractionSemantics();
  }

  function ensureSidebarItemVisible(targetItem) {
    if (!targetItem || !targetItem.isConnected) {
      return;
    }
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return;
    }
    const itemRect = targetItem.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    if (itemRect.top < sidebarRect.top || itemRect.bottom > sidebarRect.bottom) {
      targetItem.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'auto'});
    }
  }

  function setActiveSidebarItemBySelector(sectionId, selector) {
    clearActiveSidebarItems();
    expandSidebarSectionById(sectionId);

    const targetItem = selector?.nodeType === 1 ? selector : document.querySelector(selector);
    if (targetItem) {
      expandSidebarContextForItem(targetItem);
      targetItem.classList.add('active');
      targetItem.setAttribute('aria-current', 'page');
      activeSidebarItem = targetItem;
      ensureSidebarItemVisible(targetItem);
    }

    syncSidebarInteractionSemantics();
  }

  function showRuntimeActionError(error, contextLabel = 'العنصر المطلوب') {
    console.error(`فشل فتح ${contextLabel}:`, error);
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const message = error?.message || 'حدث خطأ غير متوقع أثناء فتح هذا العنصر.';
    content.innerHTML = `
      <div class="page-header">
        <h1>تعذر فتح ${window.escapeHtml(contextLabel)}</h1>
        <p>حدث خطأ أثناء تحميل هذا القسم من البيانات.</p>
      </div>
      <section class="info-section">
        <div class="content-card prose-card">
          <p><strong>السبب:</strong> ${window.escapeHtml(message)}</p>
          <p>جرّب تحديث الصفحة تحديثًا قسريًا. إذا استمر الخطأ، فالمشكلة على الأرجح من ملف بيانات مجزأ قديم في الكاش.</p>
        </div>
      </section>
    `;
  }

  async function handleSidebarNavActivation(event, item) {
    if (!item) {
      return false;
    }

    const navType = item.getAttribute('data-nav-type') || '';
    const navName = item.getAttribute('data-nav-name') || '';
    if (!navType || !navName) {
      return false;
    }

    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }

    try {
      switch (navType) {
        case 'command':
          await window.openFunctionNavItem(event, item);
          return true;
        case 'structure':
        case 'variable':
          await window.openStructureNavItem(event, item);
          return true;
        case 'enum':
          await window.showEnum(navName, {detailBucket: item?.dataset?.navBucket || ''});
          return true;
        case 'constant':
          await window.showConstant(navName);
          return true;
        case 'constant-ref':
          await window.openConstantReference(event, navName);
          return true;
        case 'macro':
          await window.showMacro(navName);
          return true;
        case 'vulkan-index':
          await window.showVulkanIndex();
          return true;
        case 'tutorial':
          await window.showTutorial(navName);
          return true;
        case 'tutorials-index':
          await window.showTutorialsIndex();
          return true;
        case 'vulkan-examples-index':
          await window.showVulkanExamplesIndex();
          return true;
        case 'vulkan-example':
          await window.showVulkanExample(navName);
          return true;
        case 'file':
          await window.showFile(navName);
          return true;
        case 'glsl':
          await window.showGlslReference(navName);
          return true;
        case 'cmake-index':
          await window.showCmakeIndex();
          return true;
        case 'cmake-kind-index':
          await window.showCmakeKindIndex(navName);
          return true;
        case 'cmake':
          await window.showCmakeEntity(item.getAttribute('data-nav-kind') || '', navName);
          return true;
        case 'cpp-index':
          await window.showCppIndex(navName === 'cpp' ? '' : navName);
          return true;
        case 'cpp':
          await window.showCppReference(navName);
          return true;
        case 'glsl-example':
          await window.showGlslExample(navName);
          return true;
        case 'glsl-index':
          await window.showGlslIndex();
          return true;
        case 'glsl-section-index':
          await window.showGlslHomeSection(navName);
          setActiveSidebarItemBySelector(
            window.getGlslReferenceSectionId(navName),
            `.nav-item[data-nav-type="glsl-section-index"][data-nav-name="${window.escapeSelectorValue(navName)}"]`
          );
          return true;
        case 'imgui-index':
          await window.showImguiIndex();
          return true;
        case 'imgui-section-index':
          await window.showImguiHomeSection(navName);
          setActiveSidebarItemBySelector(
            window.getImguiReferenceSectionId(navName),
            `.nav-item[data-nav-type="imgui-section-index"][data-nav-name="${window.escapeSelectorValue(navName)}"]`
          );
          return true;
        case 'imgui-examples-index':
          await window.showImguiExamplesIndex();
          return true;
        case 'imgui-example':
          await window.showImguiExample(navName);
          return true;
        case 'imgui':
          await window.showImguiReference(navName);
          return true;
        case 'game-ui-index':
          await window.showGameUiIndex();
          return true;
        case 'game-ui-section-index':
          await window.showGameUiHomeSection(navName);
          setActiveSidebarItemBySelector(
            window.getGameUiReferenceSectionId(navName),
            `.nav-item[data-nav-type="game-ui-section-index"][data-nav-name="${window.escapeSelectorValue(navName)}"]`
          );
          return true;
        case 'game-ui-examples-index':
          await window.showGameUiExamplesIndex();
          return true;
        case 'game-ui-example':
          await window.showGameUiExample(navName);
          return true;
        case 'game-ui':
          await window.showGameUiItem(navName);
          return true;
        case 'sdl3-index':
          await window.showSdl3Index();
          return true;
        case 'sdl3-package-index':
          await window.showSdl3PackageIndex(navName);
          return true;
        case 'sdl3-package-section-index': {
          const parsed = window.parseSdl3PackageSectionCompositeName(navName);
          await window.showSdl3PackageSectionIndex(parsed.packageKey, parsed.dataKey);
          return true;
        }
        case 'sdl3-examples-index':
          await window.showSdl3ExamplesIndex(navName);
          return true;
        case 'sdl3-example': {
          const parsed = window.parseSdl3ExampleCompositeName(navName);
          await window.showSdl3Example(parsed.packageKey, parsed.exampleId);
          return true;
        }
        case 'sdl3-section-index':
          await window.showSdl3SectionIndex(navName);
          return true;
        case 'glsl-examples-index':
          await window.showGlslExamplesIndex();
          return true;
        case 'sdl3-function':
          await window.showSdl3Function(navName);
          return true;
        case 'sdl3-type':
          await window.showSdl3Type(navName);
          return true;
        case 'sdl3-enum':
          await window.showSdl3Enum(navName);
          return true;
        case 'sdl3-constant':
          await window.showSdl3Constant(navName);
          return true;
        case 'sdl3-macro':
          await window.showSdl3Macro(navName);
          return true;
        case 'sdl3':
          await window.showSdl3Reference(navName);
          return true;
        default:
          return false;
      }
    } catch (error) {
      showRuntimeActionError(error, navName);
      return false;
    }
  }

  function syncSidebarWithHash(type, rawName = '') {
    clearActiveSidebarItems();

    const name = decodeURIComponent(rawName || '');
    const sectionMap = {
      command: 'functions-list',
      macro: 'macros-list',
      constant: 'constants-list',
      structure: window.isVariableStructureItem(name) ? 'variables-list' : 'structures-list',
      variable: 'variables-list',
      glsl: 'glsl-list',
      'game-ui': 'game-ui-list',
      'game-ui-index': 'game-ui-list',
      'game-ui-example': 'game-ui-list',
      'game-ui-examples-index': 'game-ui-list',
      'vulkan-index': 'vulkan-cluster',
      'cmake-index': 'cmake-list',
      'cmake-kind-index': 'cmake-list',
      cmake: 'cmake-list',
      'cpp-index': 'cpp-list',
      cpp: 'cpp-list',
      enum: 'enums-list',
      tutorial: 'tutorials-list',
      'tutorials-index': 'tutorials-list',
      'vulkan-examples-index': 'examples-list',
      'vulkan-example': 'examples-list',
      file: 'files-list'
    };

    let targetType = type;
    if (type === 'constant' && window.findMacroItemByName(name)) {
      targetType = 'macro';
    }

    let sectionId = sectionMap[targetType];
    let selector = `.nav-item[data-nav-type="${targetType === 'structure' && window.isVariableStructureItem(name)
      ? 'variable'
      : targetType === 'constant'
        ? 'constant-ref'
        : targetType}"][data-nav-name="${window.escapeSelectorValue(name)}"]`;

    if (targetType.startsWith('sdl3')) {
      const item = targetType === 'sdl3'
        ? window.findSdl3AnyItemByName(name)
        : targetType === 'sdl3-function'
          ? window.findSdl3ItemByKind('function', name)
          : targetType === 'sdl3-type'
            ? window.findSdl3ItemByKind('type', name)
            : targetType === 'sdl3-enum'
              ? window.findSdl3ItemByKind('enum', name)
              : targetType === 'sdl3-constant'
                ? window.findSdl3ItemByKind('constant', name)
                : window.findSdl3ItemByKind('macro', name);
      if (!item) {
        return;
      }

      const sectionDataKey = window.getSdl3ItemSectionDataKey(item);
      const itemMeta = item.kind === 'type'
        ? window.getSdl3CollectionMeta(sectionDataKey)
        : window.getSdl3KindMeta(item.kind);
      sectionId = window.getSdl3PackageSectionId(item.packageKey, sectionDataKey);
      selector = `.nav-item[data-nav-type="${itemMeta.navType}"][data-nav-name="${window.escapeSelectorValue(item.name)}"]`;
    }

    if (!sectionId) {
      return;
    }

    if (sectionId === 'vulkan-cluster') {
      const targetItem = document.querySelector(`.nav-item[data-nav-type="vulkan-index"][data-nav-name="${window.escapeSelectorValue(name || 'vulkan')}"]`);
      if (targetItem) {
        expandSidebarContextForItem(targetItem);
        targetItem.classList.add('active');
        targetItem.setAttribute('aria-current', 'page');
        activeSidebarItem = targetItem;
        ensureSidebarItemVisible(targetItem);
      }
      syncSidebarInteractionSemantics();
      return;
    }

    if (sectionId === 'constants-list') {
      window.ensureConstantsListPopulated();
    }

    expandSidebarSectionById(sectionId);
    const targetItem = document.querySelector(selector);
    if (targetItem) {
      expandSidebarContextForItem(targetItem);
      targetItem.classList.add('active');
      targetItem.setAttribute('aria-current', 'page');
      activeSidebarItem = targetItem;
      ensureSidebarItemVisible(targetItem);
    }

    syncSidebarInteractionSemantics();
  }

  const api = {
    clearActiveSidebarItems,
    collapseAllSidebarClusters,
    collapseAllSidebarNavGroups,
    collapseAllSidebarSections,
    expandSidebarSectionById,
    gameUiExpandedExampleGroups,
    gameUiExpandedReferenceSections,
    glslExpandedExampleGroups,
    glslExpandedReferenceSections,
    handleSidebarNavActivation,
    imguiExpandedExampleGroups,
    imguiExpandedReferenceSections,
    sdl3ExpandedNavGroups,
    sdl3ExpandedPackageSections,
    setActiveSidebarItemBySelector,
    syncSidebarInteractionSemantics,
    syncSidebarWithHash,
    toggleSection,
    toggleSidebarCluster,
    vulkanExpandedExampleGroups
  };

  Object.assign(window, api);
  return Object.freeze(api);
})();
