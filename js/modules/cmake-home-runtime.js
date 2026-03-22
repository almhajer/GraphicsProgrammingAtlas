(function(global) {
  'use strict';

  function createCmakeHomeRuntime(api = {}) {
    const {
      buildCmakeEntryTooltip,
      cmakeSearchEntries,
      cmakeSearchMeta,
      escapeAttribute,
      getCmakeKindMeta,
      renderCodicon,
      uiSegmentLoaded
    } = api;

    function getCmakeHomeSections() {
      const sections = Array.isArray(cmakeSearchMeta?.sections) ? cmakeSearchMeta.sections : [];
      return sections.map((section) => ({
        key: section.key,
        title: section.title || section.titleEn || section.key,
        count: Number(section.count) || 0,
        iconType: section.iconType || getCmakeKindMeta(section.key).icon
      }));
    }

    function getCmakeHomeRecentItems(limit = 6) {
      if (!uiSegmentLoaded.cmakeSearch) {
        return [];
      }

      return cmakeSearchEntries.slice(0, limit).map((entry) => ({
        label: entry.displayName || entry.name,
        iconType: getCmakeKindMeta(entry.kind).icon,
        action: `showCmakeEntity('${escapeAttribute(entry.kind)}', '${escapeAttribute(entry.slug)}')`,
        tooltip: buildCmakeEntryTooltip(entry)
      }));
    }

    function buildCmakeSectionSidebarTooltip(section = {}) {
      return [
        section.title || 'قسم CMake',
        `عدد العناصر: ${Number(section.count) || 0}`,
        `يفتح هذا القسم عناصر ${section.title || 'CMake'} المحلية مع روابط داخلية إلى صفحات المرجع المعياري.`
      ].filter(Boolean).join('\n');
    }

    function buildCmakeHomeLibraryModel() {
      const sections = getCmakeHomeSections();
      const totalCount = sections.reduce((total, section) => total + section.count, 0);

      return {
        key: 'cmake',
        title: 'CMake',
        iconType: 'file',
        kicker: 'نظام البناء',
        description: cmakeSearchMeta?.description || 'مرجع عربي عملي لبناء المشاريع وتوصيف الأهداف والاعتماديات والتثبيت في CMake.',
        summaryNote: 'يبني هذا المسار صفحاته من CMake Tutorial الرسمي ثم صفحات CMake الرسمية لكل أمر أو متغير أو خاصية عند الحاجة.',
        statusNote: uiSegmentLoaded.cmakeSearch
          ? 'بيانات CMake المحلية جاهزة الآن داخل البحث والشريط الجانبي والمرجع.'
          : 'يبقى مرجع CMake محمّلاً عند الطلب مثل بقية الأقسام المؤجلة للحفاظ على خفة البداية.',
        totalCount,
        headerActions: [
          {label: 'افتح مرجع CMake', iconType: 'file', action: 'showCmakeIndex()', primary: true},
          {label: 'الأوامر', iconType: 'command', action: `showCmakeKindIndex('commands')`},
          {label: 'المفاهيم', iconType: 'tutorial', action: `showCmakeKindIndex('concepts')`},
          {label: 'الأمثلة', iconType: 'tutorial', action: `showCmakeKindIndex('examples')`}
        ],
        cards: sections.map((section) => ({
          count: section.count,
          iconType: section.iconType,
          title: section.title,
          note: `يفتح ${section.title} من مرجع CMake المحلي مع شرح عربي عملي يربط العنصر بملف CMakeLists.txt وتدفق configure/generate/build.`,
          action: `showCmakeKindIndex('${escapeAttribute(section.key)}')`
        })),
        quickLinks: [
          {label: 'ابدأ من الفهرس', iconType: 'file', action: 'showCmakeIndex()', primary: true},
          {label: 'CMake Tutorial', iconType: 'tutorial', href: cmakeSearchMeta?.tutorialUrl},
          {label: 'الأوامر الأساسية', iconType: 'command', action: `showCmakeKindIndex('commands')`},
          {label: 'المتغيرات والـ cache', iconType: 'variable', action: `showCmakeKindIndex('variables')`},
          {label: 'الأمثلة الأولى', iconType: 'tutorial', action: `showCmakeKindIndex('examples')`}
        ],
        recentIconType: 'file',
        recentItems: getCmakeHomeRecentItems(),
        recentEmptyText: uiSegmentLoaded.cmakeSearch
          ? 'لا توجد عناصر CMake بارزة في هذه اللحظة.'
          : 'تظهر هنا أول عناصر CMake بعد تحميل مرجعها المحلي عند فتحه لأول مرة.',
        supportLinks: [
          {label: 'المرجع المحلي', action: 'showCmakeIndex()', iconType: 'file'},
          {label: 'CMake Tutorial الرسمي', href: cmakeSearchMeta?.tutorialUrl, icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')},
          {label: 'مرجع CMake الرسمي', href: cmakeSearchMeta?.officialUrl, icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')}
        ],
        extraSectionsHtml: ''
      };
    }

    return {
      buildCmakeSectionSidebarTooltip,
      getCmakeHomeSections,
      getCmakeHomeRecentItems,
      buildCmakeHomeLibraryModel
    };
  }

  global.createCmakeHomeRuntime = createCmakeHomeRuntime;
  global.__ARABIC_VULKAN_CMAKE_HOME_RUNTIME__ = {
    createCmakeHomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
