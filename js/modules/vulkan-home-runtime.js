(function(global) {
  'use strict';

  function createVulkanHomeRuntime(api = {}) {
    const {
      escapeAttribute,
      buildNavigationTooltipForName,
      buildShowCommandCall,
      countVariableItems,
      getAllConstantReferenceEntries,
      getCommandSummaryText,
      getGroupedVulkanReadyExamples,
      getTutorialCatalog,
      getVulkanFileSections,
      renderCodicon,
      renderVulkanExamplesPreviewSection,
      vulkanData,
    } = api;

    function getVulkanHomeMetrics() {
      let totalCommands = 0;
      let totalStructures = 0;
      let totalEnums = 0;
      let totalMacros = 0;

      Object.values(vulkanData.commands || {}).forEach((category) => {
        totalCommands += (category.items || []).length;
      });

      Object.values(vulkanData.macros || {}).forEach((category) => {
        totalMacros += (category.items || []).length;
      });

      Object.entries(vulkanData.structures || {}).forEach(([key, category]) => {
        if (key === 'handles' || key === 'function_pointers' || key === 'scalar_types') {
          return;
        }
        totalStructures += (category.items || []).length;
      });

      Object.values(vulkanData.enums || {}).forEach((category) => {
        totalEnums += (category.items || []).length;
      });

      const totalConstants = getAllConstantReferenceEntries().length;
      const totalVariables = countVariableItems();
      const tutorialCatalog = typeof getTutorialCatalog === 'function' ? (getTutorialCatalog() || []) : [];
      const vulkanFileSections = typeof getVulkanFileSections === 'function' ? (getVulkanFileSections() || {}) : {};
      const groupedExamples = typeof getGroupedVulkanReadyExamples === 'function' ? (getGroupedVulkanReadyExamples() || []) : [];
      const exampleCount = groupedExamples.reduce((total, group) => {
        return total + (((group && group.examples) || []).length);
      }, 0);
      const tutorialCount = tutorialCatalog.length || 21;
      const fileCount = Object.values(vulkanFileSections || {}).reduce((total, section) => {
        return total + ((section.files || []).length);
      }, 0) || 48;

      return {
        totalCommands,
        totalMacros,
        totalStructures,
        totalEnums,
        totalConstants,
        totalVariables,
        exampleCount,
        tutorialCount,
        fileCount
      };
    }

    function getVulkanHomeRecentItems(limit = 6) {
      const items = [];

      Object.entries(vulkanData.commands || {}).forEach(([key, category]) => {
        if (items.length >= limit) {
          return;
        }

        (category.items || []).forEach((item) => {
          if (items.length >= limit) {
            return;
          }

          const tooltip = buildNavigationTooltipForName(item.name, {
            type: 'command',
            command: buildShowCommandCall(item.name)
          }) || getCommandSummaryText(item) || item.description || item.name;

          items.push({
            label: item.name,
            iconType: 'command',
            action: `showCommand('${escapeAttribute(item.name)}', '${escapeAttribute(key)}')`,
            tooltip
          });
        });
      });

      return items;
    }

    function buildVulkanHomeLibraryModel() {
      const metrics = getVulkanHomeMetrics();

      return {
        key: 'vulkan',
        title: 'واجهة API Vulkan',
        iconType: 'command',
        kicker: 'الواجهة الرسومية الأساسية',
        description: 'مرجع واجهة Vulkan منخفضة المستوى لإنشاء الموارد والرسوميات والمزامنة، مع بطاقات مباشرة لكل أقسام الواجهة بنفس نمط عرض CMake داخل الصفحة الرئيسية.',
        summaryNote: 'يعرض هذا القسم الآن أقسام Vulkan كلها كبطاقات مباشرة مثل CMake، من دون فرض فهرس عام منفصل فوقها.',
        statusNote: 'هذا المرجع متاح مباشرة منذ التحميل الأول، وبقية البيانات الثقيلة في المشروع تبقى عند الطلب.',
        totalCount: metrics.totalCommands + metrics.totalStructures + metrics.totalEnums + metrics.totalConstants + metrics.totalVariables + metrics.exampleCount + metrics.tutorialCount + metrics.fileCount,
        headerActions: [
          {label: 'الدوال', iconType: 'command', action: 'showCommandsIndex()', primary: true},
          {label: 'الثوابت', iconType: 'constant', action: 'showConstantsIndex()'},
          {label: 'أمثلة فولكان', iconType: 'command', action: 'showVulkanExamplesIndex()'},
          {label: 'الدروس', iconType: 'tutorial', action: 'showTutorialsIndex()'},
          {label: 'الملفات', iconType: 'file', action: 'showFilesIndex()'}
        ],
        cards: [
          {
            count: metrics.totalCommands,
            iconType: 'command',
            title: 'الدوال',
            note: 'استدعاءات واجهة Vulkan الأساسية مع مدخل مباشر إلى شرح كل دالة.',
            action: 'showCommandsIndex()'
          },
          {
            count: metrics.totalMacros,
            iconType: 'macro',
            title: 'الماكرو',
            note: 'يبقي هذا القسم الماكرو داخل واجهة Vulkan الحالية ويفتح فرعها الجانبي بدل إنشاء صفحة فهرس مستقلة.',
            action: "showHomePage(); setTimeout(() => expandSidebarSectionById('macros-list'), 30);"
          },
          {
            count: metrics.totalConstants,
            iconType: 'constant',
            title: 'الثوابت',
            note: 'يفتح الثوابت والقيم المرجعية التي تغيّر السلوك التنفيذي أو تصف حالات التشغيل.',
            action: 'showConstantsIndex()'
          },
          {
            count: metrics.totalStructures,
            iconType: 'structure',
            title: 'الهياكل',
            note: 'بنى الإعدادات والخصائص والمخرجات التي تمررها الدوال أو تعيدها.',
            action: 'showStructuresIndex()'
          },
          {
            count: metrics.totalEnums,
            iconType: 'enum',
            title: 'التعدادات',
            note: 'قيم التشغيل والحالات الرسمية التي تحدد المسار التنفيذي في واجهة Vulkan.',
            action: 'showEnumsIndex()'
          },
          {
            count: metrics.totalVariables,
            iconType: 'variable',
            title: 'المتغيرات',
            note: 'مقابض وأنواع أساسية ومؤشرات دوال متكررة في الأمثلة والعقود الرسمية.',
            action: 'showVariablesIndex()'
          },
          {
            count: metrics.tutorialCount,
            iconType: 'tutorial',
            title: 'الدروس',
            note: 'مسار تدريجي من المفاهيم الأولى حتى البناء العملي.',
            action: 'showTutorialsIndex()'
          },
          {
            count: metrics.fileCount,
            iconType: 'file',
            title: 'الملفات',
            note: 'عرض منظم لملفات SDK والترويسات والمحتوى المرتبط بها.',
            action: 'showFilesIndex()'
          },
          {
            count: metrics.exampleCount,
            iconType: 'command',
            title: 'أمثلة فولكان',
            note: 'يفتح الأمثلة الجاهزة الموزعة بحسب الفكرة العملية بدل الاكتفاء بعرضها كرابط جانبي فقط.',
            action: 'showVulkanExamplesIndex()'
          }
        ],
        quickLinks: [
          {label: 'المفاهيم الأساسية', iconType: 'tutorial', action: `showTutorial('introduction')`, primary: true},
          {label: 'GLFW3 + Vulkan', iconType: 'tutorial', action: `showTutorial('glfw3')`},
          {label: 'الدوال', iconType: 'command', action: 'showCommandsIndex()'},
          {label: 'الماكرو', iconType: 'macro', action: "showHomePage(); setTimeout(() => expandSidebarSectionById('macros-list'), 30);"},
          {label: 'أول مثلث', iconType: 'tutorial', action: `showTutorial('triangle')`},
          {label: 'أمثلة فولكان', iconType: 'command', action: 'showVulkanExamplesIndex()'},
          {label: 'الثوابت الشائعة', iconType: 'constant', action: 'showConstantsIndex()'},
          {label: 'كل الدروس', iconType: 'tutorial', action: 'showTutorialsIndex()'},
          {label: 'ملفات SDK', iconType: 'file', action: 'showFilesIndex()'}
        ],
        recentIconType: 'command',
        recentItems: getVulkanHomeRecentItems(),
        recentEmptyText: 'لا توجد دوال محلية في هذا المرجع حالياً.',
        supportLinks: [
          {label: 'دليل GLFW3 + Vulkan', action: `showTutorial('glfw3')`, iconType: 'tutorial'},
          {label: 'المواصفات الرسمية', href: 'https://www.khronos.org/registry/vulkan/specs/1.3/html/', icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')},
          {label: 'Vulkan Tutorial', href: 'https://vulkan-tutorial.com/', icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')},
          {label: 'Vulkan C++ API', href: 'https://github.com/KhronosGroup/Vulkan-Hpp', icon: renderCodicon('code', 'ui-codicon list-icon', 'مرجع')}
        ],
        extraSectionsHtml: renderVulkanExamplesPreviewSection({
          limit: 3,
          randomize: true,
          sectionId: 'vulkan-home-examples'
        })
      };
    }

    return {
      getVulkanHomeMetrics,
      getVulkanHomeRecentItems,
      buildVulkanHomeLibraryModel
    };
  }

  global.createVulkanHomeRuntime = createVulkanHomeRuntime;
  global.__ARABIC_VULKAN_VULKAN_HOME_RUNTIME__ = {
    createVulkanHomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
