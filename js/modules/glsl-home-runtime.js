(function(global) {
  'use strict';

  function createGlslHomeRuntime(api = {}) {
    const {
      buildGlslReferenceTooltip,
      escapeAttribute,
      getAppTextValue,
      renderCodicon,
      renderGlslExamplesPreviewSection,
      uiSegmentLoaded,
      glslReferenceSections
    } = api;

    function getGlslHomeSections() {
      if (uiSegmentLoaded.glsl && Object.keys(glslReferenceSections || {}).length > 0) {
        return Object.entries(glslReferenceSections).map(([sectionKey, section]) => ({
          key: sectionKey,
          title: section.title,
          count: (section.items || []).length
        }));
      }

      return (getAppTextValue('GLSL_HOME_FALLBACK_META')?.sections || []).slice();
    }

    function getGlslHomeRecentItems(limit = 6) {
      if (!uiSegmentLoaded.glsl) {
        return [];
      }

      const items = [];
      Object.values(glslReferenceSections || {}).forEach((section) => {
        if (items.length >= limit) {
          return;
        }

        (section.items || []).forEach((item) => {
          if (items.length >= limit) {
            return;
          }

          items.push({
            label: item.displayName || item.name,
            iconType: 'glsl',
            action: `showGlslReference('${escapeAttribute(item.name)}')`,
            tooltip: buildGlslReferenceTooltip(item)
          });
        });
      });

      return items;
    }

    function buildGlslHomeLibraryModel() {
      const sections = getGlslHomeSections();
      const totalCount = sections.reduce((total, section) => total + section.count, 0);

      return {
        key: 'glsl',
        title: getAppTextValue('GLSL_HOME_FALLBACK_META')?.displayName,
        iconType: 'glsl',
        kicker: 'مرجع الشيدر',
        description: getAppTextValue('GLSL_HOME_FALLBACK_META')?.description,
        summaryNote: 'يعرض التوجيهات والأنواع والدوال المضمنة والواجهات بنفس قالب البطاقات والروابط المحلية المستخدم في الصفحة الرئيسية.',
        statusNote: uiSegmentLoaded.glsl
          ? 'بيانات GLSLang المحلية جاهزة الآن داخل الواجهة.'
          : 'يبقى هذا المرجع محمّلاً عند الطلب حتى يحافظ الموقع على سرعة العرض الأول.',
        totalCount,
        headerActions: [
          {
            label: 'افتح مرجع GLSLang',
            iconType: 'glsl',
            action: 'showGlslIndex()',
            primary: true
          },
          {
            label: 'أمثلة',
            iconType: 'glsl',
            action: 'showGlslExamplesIndex()'
          },
          {
            label: 'الدوال المضمنة',
            iconType: 'glsl',
            action: `showGlslHomeSection('functions')`
          }
        ],
        cards: sections.map((section) => ({
          count: section.count,
          iconType: 'glsl',
          title: section.title,
          note: `يفتح هذا المسار مجموعة ${section.title} داخل مرجع GLSLang المحلي بنفس أسلوب الفهارس المرتبطة في المشروع.`,
          action: `showGlslHomeSection('${escapeAttribute(section.key)}')`
        })),
        quickLinks: [
          {
            label: 'مرجع GLSLang الكامل',
            iconType: 'glsl',
            action: 'showGlslIndex()',
            primary: true
          },
          {
            label: 'أمثلة لغة التظليل',
            iconType: 'glsl',
            action: 'showGlslExamplesIndex()'
          },
          {
            label: 'التوجيهات',
            iconType: 'glsl',
            action: `showGlslHomeSection('directives')`
          },
          {
            label: 'الدوال المضمنة',
            iconType: 'glsl',
            action: `showGlslHomeSection('functions')`
          },
          {
            label: 'الأنواع والبنى',
            iconType: 'glsl',
            action: `showGlslHomeSection('types')`
          }
        ],
        recentIconType: 'glsl',
        recentItems: getGlslHomeRecentItems(),
        recentEmptyText: uiSegmentLoaded.glsl
          ? 'لا توجد عناصر GLSLang محلية بارزة في هذه اللحظة.'
          : 'تظهر هنا أول العناصر المميزة من GLSLang بعد تحميل المرجع المحلي عند فتحه أول مرة.',
        supportLinks: [
          {
            label: 'المرجع المحلي',
            action: 'showGlslIndex()',
            iconType: 'glsl'
          },
          {
            label: 'مواصفة GLSLang الرسمية',
            href: getAppTextValue('GLSL_HOME_FALLBACK_META')?.officialUrl,
            icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')
          }
        ],
        extraSectionsHtml: renderGlslExamplesPreviewSection({
          limit: 3,
          randomize: true,
          sectionId: 'glsl-home-examples'
        })
      };
    }

    return {
      getGlslHomeSections,
      getGlslHomeRecentItems,
      buildGlslHomeLibraryModel
    };
  }

  global.createGlslHomeRuntime = createGlslHomeRuntime;
  global.__ARABIC_VULKAN_GLSL_HOME_RUNTIME__ = {
    createGlslHomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
