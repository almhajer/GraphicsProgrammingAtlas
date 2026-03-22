(function(global) {
  'use strict';

  function createSdl3HomeRuntime(api = {}) {
    const {
      SDL3_HOME_FALLBACK_PACKAGE_META,
      buildSdl3PackageSectionReason,
      buildSdl3ReferenceTooltip,
      buildShowSdl3Call,
      escapeAttribute,
      getSdl3CollectionMeta,
      getSdl3KindMeta,
      getSdl3PackageInfo,
      getSdl3PackageItems,
      getSdl3PackagePracticalDomain,
      getSdl3VisiblePackageKeys,
      renderCodicon,
      renderSdl3ExamplesPreviewSection,
      uiSegmentLoaded
    } = api;

    function getHomeSdl3PackageKeys() {
      const visibleKeys = getSdl3VisiblePackageKeys();
      return visibleKeys.length ? visibleKeys : Object.keys(SDL3_HOME_FALLBACK_PACKAGE_META);
    }

    function getSdl3HomePackageMeta(packageKey) {
      const fallback = SDL3_HOME_FALLBACK_PACKAGE_META[packageKey] || null;
      const loaded = getSdl3PackageInfo(packageKey) || null;
      if (!fallback && !loaded) {
        return null;
      }

      return {
        ...(loaded || {}),
        ...(fallback || {}),
        key: packageKey,
        displayName: fallback?.displayName || loaded?.displayName || packageKey,
        packageName: fallback?.packageName || loaded?.packageName || packageKey,
        description: fallback?.description || loaded?.description || '',
        overviewUrl: loaded?.overviewUrl || fallback?.overviewUrl || '',
        frontPageUrl: loaded?.frontPageUrl || fallback?.frontPageUrl || '',
        visibleCounts: {
          ...(fallback?.visibleCounts || {})
        }
      };
    }

    function buildSdl3PackageSectionReasonFromMeta(packageMeta, dataKey) {
      const displayName = packageMeta?.displayName || packageMeta?.packageName || 'SDL3';
      const domain = getSdl3PackagePracticalDomain(packageMeta || {});

      switch (dataKey) {
        case 'functions':
          return `تظهر لأن ${displayName} يقدّم نقاط الدخول التنفيذية التي تستدعيها مباشرة لتنفيذ العمل الفعلي في مسار ${domain}.`;
        case 'macros':
          return `تظهر لأن ${displayName} يعتمد على ماكرو تعرّف القيم الرمزية ومفاتيح الخصائص وتعليمات preprocessing التي تضبط السلوك أو تكمل التواقيع.`;
        case 'constants':
          return `تظهر لأن كثيرًا من استدعاءات ${displayName} تتوقع قيمًا رسمية جاهزة تمثل خيارًا أو حالة أو نمطًا محددًا بدل كتابة أرقام خام داخل الكود.`;
        case 'variables':
          return `تظهر لأن هذا الفرع يجمع typedefs والمعرفات ومؤشرات الدوال والأنواع الخفيفة التي تكمل تواقيع ${displayName} وتحدد شكل البيانات المتبادلة.`;
        case 'structures':
          return `تظهر لأن ${displayName} يمرر الإعدادات والنتائج ووصفات الموارد عبر بنى منظمة تقرؤها الدوال كوحدة بيانات واحدة بدل عشرات المعاملات المنفصلة.`;
        default:
          return `يظهر هذا الفرع لأنه يجمع العناصر المتشابهة وظيفيًا داخل ${displayName} بدل خلطها مع بقية الأنواع.`;
      }
    }

    function getSdl3HomePackageCount(packageKey, dataKey, packageMeta) {
      if (uiSegmentLoaded.sdl3) {
        return getSdl3PackageItems(packageKey, dataKey).length;
      }
      return Number(packageMeta?.visibleCounts?.[dataKey] || 0);
    }

    function getSdl3HomeRecentItems(packageKey, limit = 6) {
      if (!uiSegmentLoaded.sdl3) {
        return [];
      }

      const items = [];
      ['functions', 'structures', 'constants', 'macros', 'variables'].forEach((dataKey) => {
        if (items.length >= limit) {
          return;
        }

        getSdl3PackageItems(packageKey, dataKey).forEach((item) => {
          if (items.length >= limit) {
            return;
          }

          items.push({
            label: item.name,
            iconType: item.kind === 'type' ? getSdl3CollectionMeta(dataKey).icon : getSdl3KindMeta(item.kind).icon,
            action: buildShowSdl3Call(item.kind, item.name),
            tooltip: buildSdl3ReferenceTooltip(item)
          });
        });
      });

      return items;
    }

    function buildSdl3HomeLibraryModel(packageKey) {
      const packageMeta = getSdl3HomePackageMeta(packageKey);
      if (!packageMeta) {
        return null;
      }

      const dataKeys = ['functions', 'macros', 'constants', 'variables', 'structures'];
      const counts = dataKeys.reduce((result, dataKey) => {
        result[dataKey] = getSdl3HomePackageCount(packageKey, dataKey, packageMeta);
        return result;
      }, {});

      const cards = dataKeys
        .filter((dataKey) => counts[dataKey] > 0)
        .map((dataKey) => {
          const meta = getSdl3CollectionMeta(dataKey);
          const note = uiSegmentLoaded.sdl3
            ? buildSdl3PackageSectionReason(packageKey, dataKey)
            : buildSdl3PackageSectionReasonFromMeta(packageMeta, dataKey);
          return {
            count: counts[dataKey],
            iconType: meta.icon,
            title: meta.title,
            note,
            action: `showSdl3PackageSectionIndex('${escapeAttribute(packageKey)}', '${escapeAttribute(dataKey)}')`
          };
        });

      const quickLinks = [
        {
          label: `افتح ${packageMeta.displayName}`,
          iconType: 'sdl3',
          action: `showSdl3PackageIndex('${escapeAttribute(packageKey)}')`,
          primary: true
        },
        {
          label: 'أمثلة',
          iconType: 'command',
          action: `showSdl3ExamplesIndex('${escapeAttribute(packageKey)}')`
        },
        ...dataKeys
          .filter((dataKey) => counts[dataKey] > 0)
          .slice(0, 4)
          .map((dataKey) => {
            const meta = getSdl3CollectionMeta(dataKey);
            return {
              label: meta.title,
              iconType: meta.icon,
              action: `showSdl3PackageSectionIndex('${escapeAttribute(packageKey)}', '${escapeAttribute(dataKey)}')`
            };
          })
      ];

      const totalCount = Object.values(counts).reduce((total, count) => total + count, 0);

      return {
        key: `sdl3-${packageKey}`,
        title: packageMeta.displayName,
        iconType: 'sdl3',
        kicker: 'فرع مستقل',
        description: packageMeta.description,
        summaryNote: `يعرض ${packageMeta.displayName} في المشروع بنفس بنية البطاقات والفهارس والروابط المحلية المعتمدة في قسم Vulkan.`,
        statusNote: uiSegmentLoaded.sdl3
          ? 'البيانات المحلية لهذا الفرع جاهزة الآن داخل الواجهة.'
          : 'يبقى هذا المرجع محمّلاً عند الطلب حتى لا يزيد الحمل الأولي للصفحة.',
        totalCount,
        headerActions: [
          {
            label: `افتح ${packageMeta.displayName}`,
            iconType: 'sdl3',
            action: `showSdl3PackageIndex('${escapeAttribute(packageKey)}')`,
            primary: true
          },
          {
            label: 'أمثلة',
            iconType: 'command',
            action: `showSdl3ExamplesIndex('${escapeAttribute(packageKey)}')`
          },
          counts.functions > 0
            ? {
                label: 'الدوال',
                iconType: 'command',
                action: `showSdl3PackageSectionIndex('${escapeAttribute(packageKey)}', 'functions')`
              }
            : null
        ].filter(Boolean),
        cards,
        quickLinks,
        recentIconType: 'sdl3',
        recentItems: getSdl3HomeRecentItems(packageKey),
        recentEmptyText: uiSegmentLoaded.sdl3
          ? `لا توجد عناصر محلية بارزة في ${packageMeta.displayName} حالياً.`
          : `يظهر هنا أول سطر من عناصر ${packageMeta.displayName} بعد تحميل المرجع المحلي عند أول فتح له.`,
        supportLinks: [
          {
            label: `المرجع المحلي لـ ${packageMeta.displayName}`,
            action: `showSdl3PackageIndex('${escapeAttribute(packageKey)}')`,
            iconType: 'sdl3'
          },
          packageMeta.overviewUrl
            ? {
                label: 'التصنيف الرسمي',
                href: packageMeta.overviewUrl,
                icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')
              }
            : null,
          packageMeta.frontPageUrl
            ? {
                label: 'الصفحة الأم',
                href: packageMeta.frontPageUrl,
                icon: renderCodicon('book', 'ui-codicon list-icon', 'مرجع')
              }
            : null
        ].filter(Boolean),
        extraSectionsHtml: renderSdl3ExamplesPreviewSection(packageKey, {
          limit: 3,
          randomize: true,
          sectionId: `sdl3-home-${escapeAttribute(packageKey)}-examples`
        })
      };
    }

    return {
      getHomeSdl3PackageKeys,
      getSdl3HomePackageMeta,
      buildSdl3PackageSectionReasonFromMeta,
      getSdl3HomePackageCount,
      getSdl3HomeRecentItems,
      buildSdl3HomeLibraryModel
    };
  }

  global.createSdl3HomeRuntime = createSdl3HomeRuntime;
  global.__ARABIC_VULKAN_SDL3_HOME_RUNTIME__ = {
    createSdl3HomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
