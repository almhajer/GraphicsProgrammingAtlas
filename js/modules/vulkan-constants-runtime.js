(function(global) {
  'use strict';

  function createVulkanConstantsRuntime(api = {}) {
    const {
      buildSidebarNavItemActivationAttrs,
      collapseAllSidebarNavGroups,
      ensureDataSegment,
      escapeAttribute,
      escapeHtml,
      escapeSelectorValue,
      getEnumValueAnchorId,
      getEnumValueRows,
      getRenderEntityIcon,
      getVulkanData,
      hydrateLazySdl3NavGroup,
      rememberSdl3NavGroupState,
      scrollToAnchor,
      setActiveSidebarItemBySelector,
      showConstant,
      showEnum,
      showMacro
    } = api;

    let constantReferenceEntriesCache = null;
    let constantReferenceEntryLookupCache = null;

    function getConstantReferenceGroupKey(name, sourceType = '') {
      const token = String(name || '').trim();

      if (/^VK_STRUCTURE_TYPE_/.test(token)) return 'أنواع البنى Structure Types';
      if (/^VK_(SUCCESS|NOT_READY|TIMEOUT|EVENT_SET|EVENT_RESET|INCOMPLETE|ERROR_)/.test(token)) return 'النتائج وحالات التنفيذ';
      if (/^VK_(TRUE|FALSE)$/.test(token)) return 'القيم المنطقية';
      if (/^VK_QUEUE_/.test(token)) return 'أنواع الطوابير';
      if (/^VK_API_VERSION_|^VK_VERSION_|^VK_HEADER_VERSION/.test(token)) return 'الإصدارات ورأس المكتبة';
      if (/_EXTENSION_NAME$|_SPEC_VERSION$/.test(token)) return 'الامتدادات وإصداراتها';
      if (/^UINT(?:8|16|32|64)_(?:MAX|MIN)$|^INT(?:8|16|32|64)_(?:MAX|MIN)$|^SIZE_MAX$/.test(token)) return 'حدود رقمية عامة';
      if (/FORMAT|COLOR_SPACE|COMPONENT_SWIZZLE|IMAGE_LAYOUT|IMAGE_TILING|IMAGE_TYPE|IMAGE_VIEW_TYPE|BUFFER_USAGE|IMAGE_USAGE/.test(token)) return 'الصيغ والصور والمخازن';
      if (/PIPELINE|SHADER|PRIMITIVE|CULL|FRONT_FACE|POLYGON|BLEND|COMPARE_OP|STENCIL|LOGIC_OP|DYNAMIC_STATE|VERTEX_INPUT/.test(token)) return 'الرسم والـ Pipeline';
      if (/DESCRIPTOR|SAMPLER|FILTER|BORDER_COLOR/.test(token)) return 'Descriptors والعينات';
      if (/PRESENT|SURFACE|SWAPCHAIN|DISPLAY|COMPOSITE_ALPHA/.test(token)) return 'العرض و Swapchain';
      if (/SEMAPHORE|FENCE|EVENT|ACCESS_|PIPELINE_STAGE|DEPENDENCY|SUBPASS/.test(token)) return 'المزامنة والاعتماديات';
      if (/MEMORY|HEAP|ALLOCATE|SPARSE/.test(token)) return 'الذاكرة والتخصيص';
      if (/COMMAND|QUERY|QUERY_RESULT/.test(token)) return 'الأوامر والاستعلام';
      if (/DEBUG|VALIDATION|OBJECT_TYPE|DEBUG_UTILS|DEBUG_REPORT/.test(token)) return 'التصحيح والتتبع';
      if (/ACCELERATION_STRUCTURE|RAY_TRACING|MICROMAP/.test(token)) return 'التتبع الشعاعي وبنى التسارع';

      if (sourceType === 'enumValue') {
        return 'قيم تعداد مرجعية';
      }
      if (/^VK_/.test(token)) {
        return 'ثوابت Vulkan عامة';
      }

      return 'ثوابت أخرى';
    }

    function resetConstantReferenceCaches() {
      constantReferenceEntriesCache = null;
      constantReferenceEntryLookupCache = null;
    }

    function getAllConstantReferenceEntries() {
      if (constantReferenceEntriesCache) {
        return constantReferenceEntriesCache;
      }

      const vulkanData = typeof getVulkanData === 'function' ? (getVulkanData() || {}) : {};
      const entries = [];
      const seen = new Set();

      const addEntry = (entry) => {
        if (!entry?.name || seen.has(entry.name)) {
          return;
        }
        seen.add(entry.name);
        entries.push(entry);
      };

      Object.values(vulkanData.constants || {}).forEach((category) => {
        (category.items || []).forEach((item) => {
          addEntry({
            name: item.name,
            sourceType: 'constant',
            sourceTitle: category.title,
            item,
            groupKey: getConstantReferenceGroupKey(item.name, 'constant')
          });
        });
      });

      Object.values(vulkanData.macros || {}).forEach((category) => {
        (category.items || []).forEach((item) => {
          if (!item.name || !item.name.startsWith('VK_')) {
            return;
          }
          addEntry({
            name: item.name,
            sourceType: 'macro',
            sourceTitle: category.title,
            item,
            groupKey: getConstantReferenceGroupKey(item.name, 'macro')
          });
        });
      });

      Object.values(vulkanData.enums || {}).forEach((category) => {
        (category.items || []).forEach((enumItem) => {
          getEnumValueRows(enumItem).forEach((row) => {
            if (!row?.name || !row.name.startsWith('VK_')) {
              return;
            }
            addEntry({
              name: row.name,
              sourceType: 'enumValue',
              sourceTitle: enumItem.name,
              item: row,
              enumItem,
              groupKey: getConstantReferenceGroupKey(row.name, 'enumValue')
            });
          });
        });
      });

      constantReferenceEntriesCache = entries.sort((a, b) => a.name.localeCompare(b.name));
      constantReferenceEntryLookupCache = new Map(
        constantReferenceEntriesCache.map((entry) => [entry.name, entry])
      );
      return constantReferenceEntriesCache;
    }

    function getConstantReferenceEntry(name) {
      if (!constantReferenceEntryLookupCache) {
        getAllConstantReferenceEntries();
      }
      return constantReferenceEntryLookupCache?.get(name) || null;
    }

    function toggleConstantGroup(header) {
      const group = header?.closest('.nav-constant-group');
      if (group) {
        const willExpand = group.classList.contains('collapsed');
        if (!willExpand) {
          collapseAllSidebarNavGroups();
          return;
        }

        collapseAllSidebarNavGroups(group);
        hydrateLazySdl3NavGroup(group);
        group.classList.remove('collapsed');
        rememberSdl3NavGroupState(group, true);
      }
    }

    async function openConstantReference(event, name) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      await Promise.all([
        ensureDataSegment('constants'),
        ensureDataSegment('enums'),
        ensureDataSegment('macros')
      ]);

      const entry = getConstantReferenceEntry(name);
      const selector = `.nav-item[data-nav-type="constant-ref"][data-nav-name="${escapeSelectorValue(name)}"]`;

      if (!entry) {
        await showConstant(name);
        setTimeout(() => setActiveSidebarItemBySelector('constants-list', selector), 40);
        return;
      }

      if (entry.sourceType === 'macro') {
        await showMacro(name);
        setTimeout(() => setActiveSidebarItemBySelector('constants-list', selector), 40);
        return;
      }

      if (entry.sourceType === 'enumValue' && entry.enumItem) {
        const anchorId = getEnumValueAnchorId(entry.enumItem.name, name);
        await showEnum(entry.enumItem.name);
        setTimeout(() => {
          setActiveSidebarItemBySelector('constants-list', selector);
          scrollToAnchor(anchorId);
        }, 40);
        return;
      }

      await showConstant(name);
      setTimeout(() => setActiveSidebarItemBySelector('constants-list', selector), 40);
    }

    function populateConstantsList() {
      const container = document.getElementById('constants-list');
      if (!container) return;

      const entries = getAllConstantReferenceEntries();
      if (!entries.length) {
        container.innerHTML = '<div class="nav-item">لا توجد ثوابت</div>';
        return;
      }

      const groups = new Map();
      entries.forEach((entry) => {
        if (!groups.has(entry.groupKey)) {
          groups.set(entry.groupKey, []);
        }
        groups.get(entry.groupKey).push(entry);
      });

      const renderEntityIcon = typeof getRenderEntityIcon === 'function'
        ? getRenderEntityIcon()
        : () => '';

      const html = Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([groupKey, groupEntries]) => `
          <div class="nav-constant-group collapsed">
            <div class="nav-constant-group-header" onclick="toggleConstantGroup(this)">
              <span class="nav-constant-group-title-wrap">
                <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
                <span class="nav-constant-group-title">${escapeHtml(groupKey)}</span>
              </span>
              <span class="nav-constant-group-count">${groupEntries.length}</span>
            </div>
            <div class="nav-constant-group-items">
              ${groupEntries.map((entry) => `
                <div class="nav-item" data-nav-type="constant-ref" data-nav-name="${escapeAttribute(entry.name)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
                  <span>${renderEntityIcon('constant', 'ui-codicon nav-icon', 'ثابت')}</span>
                  <span>${escapeHtml(entry.name)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('');

      container.innerHTML = html;
    }

    async function ensureConstantsListPopulated() {
      const container = document.getElementById('constants-list');
      if (!container || container.children.length > 0) {
        return;
      }
      await Promise.all([
        ensureDataSegment('constants'),
        ensureDataSegment('enums'),
        ensureDataSegment('macros')
      ]);
      populateConstantsList();
    }

    return Object.freeze({
      getConstantReferenceGroupKey,
      resetConstantReferenceCaches,
      getAllConstantReferenceEntries,
      getConstantReferenceEntry,
      toggleConstantGroup,
      openConstantReference,
      populateConstantsList,
      ensureConstantsListPopulated
    });
  }

  global.createVulkanConstantsRuntime = createVulkanConstantsRuntime;
  global.__ARABIC_VULKAN_VULKAN_CONSTANTS_RUNTIME__ = {
    createVulkanConstantsRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
