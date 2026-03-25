window.__ARABIC_VULKAN_SDL3_RELATED_RUNTIME__ = (() => {
  function createSdl3RelatedRuntime(api = {}) {
    const {
      getSdl3PackageInfo,
      composeSemanticTooltip,
      getSdl3PackageItems,
      getSdl3CollectionMeta,
      buildSdl3PackageSectionReason,
      escapeHtml,
      escapeAttribute,
      renderEntityIcon,
      findSdl3AnyItemByName,
      findSdl3CoreSymbolSeedByName,
      getSdl3VisiblePackageKeys,
      renderRelatedReferenceLink,
      inferSdl3PackageKeyFromSymbolName,
      getAllSdl3ReferenceItems,
      getSdl3TypeSectionDataKey,
      getSdl3KindMeta,
      renderSdl3EntityLink,
      buildShowSdl3PackageIndexCall,
      buildShowSdl3PackageSectionIndexCall,
      buildShowSdl3HeaderFileCall
    } = api;

    function buildSdl3PackageTooltip(packageKey) {
      const packageInfo = getSdl3PackageInfo(packageKey);
      if (!packageInfo) {
        return '';
      }

      return composeSemanticTooltip({
        title: packageInfo.displayName,
        kindLabel: 'حزمة SDL3',
        typeLabel: 'Package Index',
        library: 'SDL3',
        meaning: packageInfo.description || `يمثل فهرس الحزمة ${packageInfo.displayName} داخل المشروع.`,
        whyExists: 'وُجد لأن SDL3 موزعة إلى حزم تضيف وظائف متخصصة فوق النواة مثل الصور أو الخطوط أو الصوت.',
        whyUse: 'يستخدمه المبرمج لتضييق البحث والقراءة على الحزمة التي تملك العنصر أو المثال المطلوب فعلاً.',
        actualUsage: `يفتح فهرساً يجمع الدوال والماكرو والثوابت والبنى الخاصة بالحزمة. الدوال ${getSdl3PackageItems(packageKey, 'functions').length}، الماكرو ${getSdl3PackageItems(packageKey, 'macros').length}، الثوابت ${getSdl3PackageItems(packageKey, 'constants').length}.`
      });
    }

    function buildSdl3PackageSectionTooltip(packageKey, dataKey) {
      const packageInfo = getSdl3PackageInfo(packageKey);
      const kind = getSdl3CollectionMeta(dataKey);
      if (!packageInfo || !kind) {
        return '';
      }

      const count = getSdl3PackageItems(packageKey, dataKey).length;
      return composeSemanticTooltip({
        title: `${kind.title} في ${packageInfo.displayName}`,
        kindLabel: 'قسم SDL3',
        typeLabel: 'Package Section',
        library: packageInfo.displayName || 'SDL3',
        meaning: `يجمع ${count} عنصرًا من فئة ${kind.title} داخل هذه الحزمة.`,
        whyExists: buildSdl3PackageSectionReason(packageKey, dataKey),
        whyUse: `يفيد عندما تريد قراءة ${kind.title} فقط بدل بقية أنواع العناصر داخل ${packageInfo.displayName}.`,
        actualUsage: `يفتح فهرس ${kind.title} المحلي الكامل مع الروابط الداخلية والشرح العربي.`
      });
    }

    function renderSdl3PackageLink(packageKey, label = '') {
      const packageInfo = getSdl3PackageInfo(packageKey);
      if (!packageInfo) {
        return `<span class="related-link related-link-static">${escapeHtml(label || packageKey)}</span>`;
      }

      const tooltip = buildSdl3PackageTooltip(packageKey);
      const text = label || packageInfo.displayName;
      return `<a href="#" class="related-link entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${buildShowSdl3PackageIndexCall(packageKey)}; return false;">${renderEntityIcon('sdl3', 'ui-codicon list-icon', packageInfo.displayName)} ${escapeHtml(text)}</a>`;
    }

    function renderSdl3PackageSectionLink(packageKey, dataKey, label = '') {
      const kind = getSdl3CollectionMeta(dataKey);
      const packageInfo = getSdl3PackageInfo(packageKey);
      if (!kind || !packageInfo) {
        return `<span class="related-link related-link-static">${escapeHtml(label || dataKey)}</span>`;
      }

      const tooltip = buildSdl3PackageSectionTooltip(packageKey, dataKey);
      const text = label || kind.title;
      return `<a href="#" class="related-link entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${buildShowSdl3PackageSectionIndexCall(packageKey, dataKey)}; return false;">${renderEntityIcon(kind.icon, 'ui-codicon list-icon', kind.title)} ${escapeHtml(text)}</a>`;
    }

    function normalizeSdl3HeaderFile(header = '') {
      return String(header || '')
        .replace(/[<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function formatSdl3HeaderFileDisplay(header = '') {
      const normalized = normalizeSdl3HeaderFile(header);
      return normalized ? `<${normalized}>` : '';
    }

    function inferSdl3PackageKeyFromHeader(header = '') {
      const normalized = normalizeSdl3HeaderFile(header);
      if (/^SDL3_image\//.test(normalized)) return 'image';
      if (/^SDL3_mixer\//.test(normalized)) return 'mixer';
      if (/^SDL3_ttf\//.test(normalized)) return 'ttf';
      return 'core';
    }

    function buildSdl3HeaderFileTooltip(header = '', item = null) {
      const packageKey = item?.packageKey || inferSdl3PackageKeyFromHeader(header);
      const packageInfo = getSdl3PackageInfo(packageKey);
      const packageLabel = packageInfo?.displayName || item?.packageDisplayName || 'SDL3';
      return composeSemanticTooltip({
        title: formatSdl3HeaderFileDisplay(header),
        kindLabel: 'ترويسة SDL3',
        typeLabel: 'Header File',
        library: packageLabel,
        meaning: `هذا هو ملف الترويسة الذي يعلن الدوال والأنواع والثوابت المرتبطة بهذا الجزء من ${packageLabel}.`,
        whyExists: 'وُجد لأن استخدام العنصر في C/C++ يبدأ من تضمين الترويسة التي تقدم تصريحه الصحيح للمترجم.',
        whyUse: 'يستخدمه المبرمج عندما يحتاج الوصول إلى تعريفات الحزمة الصحيحة من دون تضمين ترويسات غير مرتبطة.',
        actualUsage: 'يظهر كسطر `#include` في أعلى الملف المصدر قبل استخدام الدوال أو الأنواع التابعة لهذه الحزمة.'
      });
    }

    function renderSdl3HeaderFileLink(header = '', item = null, options = {}) {
      const normalized = normalizeSdl3HeaderFile(header);
      const display = formatSdl3HeaderFileDisplay(header);
      if (!normalized || !display) {
        return '—';
      }

      const tooltip = buildSdl3HeaderFileTooltip(header, item);
      const label = options.label || display;
      return `<a href="#" class="related-link entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${buildShowSdl3HeaderFileCall(normalized)}; return false;">${renderEntityIcon('file', 'ui-codicon list-icon', display)} <code dir="ltr">${escapeHtml(display)}</code></a>`;
    }

    function renderSdl3RelatedLink(name, label = '') {
      const normalizedName = String(name || '').trim();
      const normalizedLabel = String(label || '').trim();
      if (!normalizedName) {
        return '';
      }

      const directItem = findSdl3AnyItemByName(normalizedName) || findSdl3CoreSymbolSeedByName(normalizedName);
      if (directItem) {
        return renderSdl3EntityLink(normalizedName, normalizedLabel);
      }

      const packageMatchKey = getSdl3VisiblePackageKeys().find((packageKey) => {
        const info = getSdl3PackageInfo(packageKey);
        const displayName = String(info?.displayName || '').trim();
        return displayName && (
          normalizedName === displayName
          || normalizedName.toLowerCase() === displayName.toLowerCase()
        );
      });
      if (packageMatchKey) {
        return renderSdl3PackageLink(packageMatchKey, normalizedLabel || normalizedName);
      }

      if (/[<>/]/.test(normalizedName) || /^SDL3(?:_(?:image|mixer|ttf))?\//.test(normalizedName)) {
        return renderSdl3HeaderFileLink(normalizedName, null, {label: normalizedLabel || formatSdl3HeaderFileDisplay(normalizedName)});
      }

      const projectReferenceLink = renderRelatedReferenceLink(normalizedName, {tooltipContext: 'reference-summary'});
      if (projectReferenceLink) {
        return projectReferenceLink;
      }

      const fallbackTooltip = composeSemanticTooltip({
        title: normalizedLabel || normalizedName,
        kindLabel: 'عنصر مرتبط',
        typeLabel: 'مرجع نصي',
        library: inferSdl3PackageKeyFromSymbolName(normalizedName) === 'core' ? 'SDL3' : getSdl3PackageInfo(inferSdl3PackageKeyFromSymbolName(normalizedName))?.displayName || 'SDL3',
        meaning: `هذا الاسم مذكور كعنصر مرتبط في الصفحة الحالية، لكن لا توجد له صفحة محلية مباشرة في البيانات المحملة الآن.`,
        whyExists: 'وُجد هنا لأنه مرتبط بالسياق العملي أو بالمفهوم المجاور لهذا العنصر داخل SDL3 أو إحدى حزمها.',
        whyUse: 'يفيدك كإشارة سريعة إلى ما الذي يجدر البحث عنه أو فتحه بعد العنصر الحالي.',
        actualUsage: 'إذا لم يكن له رابط محلي الآن فغالبًا سيظهر لاحقًا بعد تحميل بيانات إضافية أو قد يكون مرجعًا خارجيًا أو ترويسة أو تسمية عامة.'
      });
      return `<span class="related-link related-link-static" data-tooltip="${escapeAttribute(fallbackTooltip)}" tabindex="0" aria-label="${escapeAttribute(`${normalizedLabel || normalizedName}: ${fallbackTooltip.replace(/\n/g, ' - ')}`)}">${escapeHtml(normalizedLabel || normalizedName)}</span>`;
    }

    function getSdl3HeaderFileItems(header = '') {
      const normalized = normalizeSdl3HeaderFile(header);
      if (!normalized) {
        return [];
      }

      return getAllSdl3ReferenceItems().filter((item) => normalizeSdl3HeaderFile(item.header) === normalized);
    }

    function getSdl3HeaderFileDataKey(item) {
      if (!item) {
        return '';
      }
      if (item.kind === 'type') {
        return getSdl3TypeSectionDataKey(item);
      }
      return getSdl3KindMeta(item.kind).dataKey;
    }

    function getSdl3HeaderFileSectionGroups(header = '') {
      const items = getSdl3HeaderFileItems(header);
      const sectionOrder = ['functions', 'structures', 'variables', 'enums', 'constants', 'macros'];

      return sectionOrder.map((dataKey) => {
        const meta = getSdl3CollectionMeta(dataKey);
        const scopedItems = items.filter((item) => getSdl3HeaderFileDataKey(item) === dataKey);
        return scopedItems.length ? {dataKey, meta, items: scopedItems} : null;
      }).filter(Boolean);
    }

    function renderSdl3HeaderFilesSection(item) {
      if (!item?.header) {
        return '';
      }

      return `
        <section class="info-section">
          <div class="content-card prose-card">
            <h2>ملفات الترويسة</h2>
            <p>${renderSdl3HeaderFileLink(item.header, item)}</p>
          </div>
        </section>
      `;
    }

    return Object.freeze({
      buildSdl3PackageTooltip,
      buildSdl3PackageSectionTooltip,
      renderSdl3PackageLink,
      renderSdl3PackageSectionLink,
      renderSdl3RelatedLink,
      normalizeSdl3HeaderFile,
      formatSdl3HeaderFileDisplay,
      inferSdl3PackageKeyFromHeader,
      buildSdl3HeaderFileTooltip,
      renderSdl3HeaderFileLink,
      getSdl3HeaderFileItems,
      getSdl3HeaderFileDataKey,
      getSdl3HeaderFileSectionGroups,
      renderSdl3HeaderFilesSection
    });
  }

  return Object.freeze({
    createSdl3RelatedRuntime
  });
})();
