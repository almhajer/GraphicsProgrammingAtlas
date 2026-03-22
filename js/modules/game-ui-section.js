window.__ARABIC_VULKAN_GAME_UI_SECTION__ = (() => {
  const {
    renderLibraryExamplePreviewCard
  } = window.__ARABIC_VULKAN_UI_BLOCKS__ || {};
  const {
    renderSidebarExampleGroup,
    renderSidebarNavItem,
    renderSidebarSectionShell
  } = window.__ARABIC_VULKAN_SIDEBAR_BLOCKS__ || {};
  const {
    collapseAllSidebarClusters,
    collapseAllSidebarNavGroups,
    collapseAllSidebarSections,
    gameUiExpandedExampleGroups,
    gameUiExpandedReferenceSections
  } = window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ || {};

  function getGameUiSectionIcon(sectionKey = '') {
    const map = {
      hud: 'constant',
      input: 'command',
      navigation: 'structure',
      feedback: 'glsl',
      tools: 'imgui'
    };
    return map[sectionKey] || 'tutorial';
  }

  function getGameUiKindIcon(kind = '') {
    return kind === 'panel' ? 'structure' : 'command';
  }

  const GAME_UI_ARCHITECTURE_EXAMPLE_NAMES = Object.freeze([
    'Plugin Architecture',
    'Asset Bundle System',
    'Shared Library Pattern',
    'Plugin + Bundle',
    'Plugin + Bundle + Lib'
  ]);

  const GAME_UI_STATIC_PROSE_REFERENCES = Object.freeze({
    'SDL3': {
      label: 'SDL3',
      action: 'showSdl3Index()',
      library: 'SDL3',
      kindLabel: 'مكتبة مرتبطة',
      typeLabel: 'نافذة وأحداث ووقت',
      meaning: 'SDL3 تدير النافذة والأحداث والتوقيت والربط مع أنظمة التشغيل، وهي الطبقة التي تشغّل الحلقة الرئيسية في هذه الأمثلة.',
      whyUse: 'تظهر هنا لأن أمثلة Plugin وBundle وLib تبدأ من نافذة SDL3 وحلقة الأحداث والزمن.',
      actualUsage: 'يفتح مرجع SDL3 المحلي داخل المشروع.'
    },
    'Dear ImGui': {
      label: 'Dear ImGui',
      action: 'showImguiIndex()',
      library: 'Dear ImGui',
      kindLabel: 'مكتبة واجهة فورية',
      typeLabel: 'Immediate Mode UI',
      meaning: 'Dear ImGui ترسم نوافذ الأدوات ولوحات التصحيح مباشرة داخل كل إطار من الإطار الحالي.',
      whyUse: 'تظهر هنا لأن جميع هذه الأمثلة تعرض لوحات أدوات أو نوافذ تطوير مبنية على ImGui.',
      actualUsage: 'يفتح مرجع Dear ImGui المحلي.'
    },
    'ImGui': {
      label: 'ImGui',
      action: 'showImguiIndex()',
      library: 'Dear ImGui',
      kindLabel: 'مكتبة واجهة فورية',
      typeLabel: 'Immediate Mode UI',
      meaning: 'ImGui هو الاسم الشائع لدوال Dear ImGui المستخدمة لرسم النوافذ والعناصر الواجهية داخل الإطار الحالي.',
      whyUse: 'تظهر هنا لأن الكود يعتمد على Begin/Button/Text/Slider وغيرها من واجهات ImGui.',
      actualUsage: 'يفتح مرجع Dear ImGui المحلي.'
    },
    'Vulkan': {
      label: 'Vulkan',
      action: 'showHomePage()',
      library: 'Vulkan',
      kindLabel: 'مكتبة مرتبطة',
      typeLabel: 'واجهة رسوميات',
      meaning: 'Vulkan هي الواجهة الرسومية الأساسية في المشروع وتبقى مرتبطة بهذه الأمثلة حتى عندما يكون تركيزها على واجهات الألعاب نفسها.',
      whyUse: 'تظهر هنا لأن المشروع كله يدور حول التوثيق العملي لـ Vulkan ومكتباته المرتبطة.',
      actualUsage: 'يفتح الصفحة الرئيسية للمشروع.'
    },
    'CMake': {
      label: 'CMake',
      action: 'showCmakeIndex()',
      library: 'CMake',
      kindLabel: 'طبقة بناء',
      typeLabel: 'Build System',
      meaning: 'CMake يبني المشروع ويقسمه إلى ملفات تنفيذية ومكتبات ويجمع ملفات الأمثلة إلى ناتج قابل للتشغيل.',
      whyUse: 'تظهر هنا لأن كل مثال يبدأ من CMakeLists.txt يحدد كيف تُربط SDL3 وImGui وملفات المثال.',
      actualUsage: 'يفتح مرجع CMake المحلي.'
    },
    'CMakeLists.txt': {
      label: 'CMakeLists.txt',
      action: 'showCmakeIndex()',
      library: 'CMake',
      kindLabel: 'ملف بناء',
      typeLabel: 'تعريف مشروع CMake',
      meaning: 'CMakeLists.txt هو الملف الذي يعرّف الهدف التنفيذي والمكتبات والملفات المصدرية المرتبطة بالمثال.',
      whyUse: 'يظهر هنا لأنه أول ملف يوضح بنية المثال وكيف يربط الملفات ببعضها.',
      actualUsage: 'يفتح مرجع CMake المحلي.'
    }
  });

  function getAllGameUiReferenceItems() {
    if (gameUiReferenceItemsCache) {
      return gameUiReferenceItemsCache;
    }

    const items = [];
    Object.entries(gameUiSections || {}).forEach(([sectionKey, section]) => {
      (section.items || []).forEach((item) => {
        items.push({
          ...item,
          sectionKey,
          sectionTitle: item.sectionTitle || section.title || sectionKey
        });
      });
    });

    gameUiReferenceItemsCache = items;
    gameUiReferenceItemLookupCache = new Map();
    items.forEach((item) => {
      gameUiReferenceItemLookupCache.set(item.name, item);
      const arabicName = String(item.nameAr || '').trim();
      if (arabicName && !gameUiReferenceItemLookupCache.has(arabicName)) {
        gameUiReferenceItemLookupCache.set(arabicName, item);
      }
    });

    return items;
  }

  function getGameUiReferenceItem(rawName = '') {
    const name = String(rawName || '').trim();
    if (!name) {
      return null;
    }

    if (!gameUiReferenceItemLookupCache) {
      getAllGameUiReferenceItems();
    }

    return gameUiReferenceItemLookupCache?.get(name) || null;
  }

  function buildGameUiReferenceTooltip(item) {
    if (!item) {
      return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
        ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
          title: 'Game UI',
          kindLabel: 'عنصر واجهات ألعاب',
          typeLabel: 'مرجع محلي',
          library: 'Game UI',
          meaning: 'يمثل عنصراً متكرراً في تصميم واجهات الألعاب داخل المشروع.',
          whyExists: 'وُجد حتى يربط الاسم بالدور الفعلي داخل واجهة اللعب أو أدواتها.',
          whyUse: 'يفيد عندما تريد اختيار النمط الواجهي المناسب قبل فتح الشرح الكامل.',
          actualUsage: 'يظهر في الفهارس والروابط الداخلية الخاصة بمسار واجهات الألعاب.'
        })
        : 'عنصر من عناصر واجهات الألعاب داخل المرجع المحلي.';
    }

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: item.nameAr || item.name || '',
        kindLabel: item.kind === 'panel' ? 'لوحة واجهة' : 'عنصر واجهة',
        typeLabel: item.kind || 'UI Pattern',
        library: 'Game UI',
        meaning: item.description || item.officialArabicDescription || item.shortTooltip || '',
        whyExists: item.officialArabicDescription || 'وُجد هذا العنصر لأن واجهات الألعاب تحتاج نمطاً متكرراً يحل مشكلة تفاعل أو عرض بعينها.',
        whyUse: item.whenToUse || item.shortTooltip || '',
        actualUsage: item.usageExample?.scenario || item.usageExample?.explanation || item.description || ''
      })
      : [
        item.nameAr || item.name || '',
        item.shortTooltip || item.officialArabicDescription || item.description || '',
        item.whenToUse ? `متى يستخدم: ${item.whenToUse}` : ''
      ].filter(Boolean).join('\n');
  }

  function getGameUiExampleItem(rawName = '') {
    const item = getGameUiReferenceItem(rawName);
    return item?.usageExample ? item : null;
  }

  function escapeGameUiRegexText(text = '') {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function slugifyGameUiText(text = '') {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item';
  }

  function getGameUiFileBaseName(filePath = '') {
    const normalized = String(filePath || '').trim();
    if (!normalized) {
      return '';
    }

    const parts = normalized.split('/');
    return parts[parts.length - 1] || normalized;
  }

  function normalizeGameUiFileLookup(value = '') {
    return getGameUiFileBaseName(value).toLowerCase();
  }

  function renderGameUiTechnicalInlineToken(token = '', extraClassName = '') {
    const value = String(token || '').trim();
    if (!value) {
      return '';
    }

    const className = ['game-ui-inline-technical', extraClassName].filter(Boolean).join(' ');
    return `<code dir="ltr" class="${escapeAttribute(className)}">${escapeHtml(value)}</code>`;
  }

  function renderGameUiFileLabel(filePath = '') {
    return renderGameUiTechnicalInlineToken(filePath, 'game-ui-file-label');
  }

  function buildGameUiStaticReferenceTooltip(referenceKey = '') {
    const reference = GAME_UI_STATIC_PROSE_REFERENCES[referenceKey];
    if (!reference) {
      return '';
    }

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: reference.label,
        kindLabel: reference.kindLabel,
        typeLabel: reference.typeLabel,
        library: reference.library,
        meaning: reference.meaning,
        whyExists: '',
        whyUse: reference.whyUse,
        actualUsage: reference.actualUsage
      })
      : [reference.label, reference.meaning, reference.whyUse].filter(Boolean).join('\n');
  }

  function formatGameUiInlineLabel(label = '') {
    const value = String(label || '').trim();
    if (!value) {
      return '';
    }

    if (/[A-Za-z]/.test(value) && !/[\u0600-\u06FF]/.test(value)) {
      return `<code dir="ltr">${escapeHtml(value)}</code>`;
    }

    return escapeHtml(value);
  }

  function getGameUiContextualRelatedNames(item = null) {
    const names = new Set(Array.isArray(item?.related) ? item.related : []);
    const itemName = String(item?.name || '').trim();
    if (GAME_UI_ARCHITECTURE_EXAMPLE_NAMES.includes(itemName)) {
      GAME_UI_ARCHITECTURE_EXAMPLE_NAMES.forEach((candidate) => {
        if (candidate && candidate !== itemName) {
          names.add(candidate);
        }
      });
    }
    return Array.from(names).filter(Boolean);
  }

  function renderGameUiInlineReference(name = '', label = '') {
    const item = getGameUiReferenceItem(name);
    const visibleLabel = String(label || item?.nameAr || item?.name || name).trim();
    if (!item || !visibleLabel) {
      return escapeHtml(visibleLabel || name);
    }

    const tooltip = buildGameUiReferenceTooltip(item);
    const action = item.usageExample ? 'showGameUiExample' : 'showGameUiItem';
    return `<a href="#" class="game-ui-inline-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${visibleLabel}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${action}('${escapeAttribute(item.name)}'); return false;">${formatGameUiInlineLabel(visibleLabel)}</a>`;
  }

  function renderGameUiStaticReference(referenceKey = '', label = '') {
    const reference = GAME_UI_STATIC_PROSE_REFERENCES[referenceKey];
    const visibleLabel = String(label || reference?.label || referenceKey).trim();
    if (!reference || !visibleLabel) {
      return escapeHtml(visibleLabel || referenceKey);
    }

    const tooltip = buildGameUiStaticReferenceTooltip(referenceKey);
    return `<a href="#" class="game-ui-inline-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${visibleLabel}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${reference.action}; return false;">${formatGameUiInlineLabel(visibleLabel)}</a>`;
  }

  function linkifyGameUiText(text = '', options = {}) {
    const source = String(text || '');
    if (!source) {
      return '';
    }

    const contextualNames = getGameUiContextualRelatedNames(options.item);
    const gameUiReferenceMap = new Map();
    contextualNames.forEach((name) => {
      const item = getGameUiReferenceItem(name);
      if (!item) {
        return;
      }
      gameUiReferenceMap.set(item.name, item);
      const arabicName = String(item.nameAr || '').trim();
      if (arabicName) {
        gameUiReferenceMap.set(arabicName, item);
      }
    });

    const tokens = [
      ...Array.from(gameUiReferenceMap.keys()),
      ...Object.keys(GAME_UI_STATIC_PROSE_REFERENCES)
    ].filter(Boolean).sort((a, b) => b.length - a.length);

    if (!tokens.length) {
      return escapeHtml(source);
    }

    const regex = new RegExp(tokens.map((entry) => escapeGameUiRegexText(entry)).join('|'), 'g');
    let lastIndex = 0;
    let rendered = '';

    source.replace(regex, (match, offset) => {
      rendered += escapeHtml(source.slice(lastIndex, offset));
      if (gameUiReferenceMap.has(match)) {
        rendered += renderGameUiInlineReference(gameUiReferenceMap.get(match).name, match);
      } else {
        rendered += renderGameUiStaticReference(match, match);
      }
      lastIndex = offset + match.length;
      return match;
    });

    rendered += escapeHtml(source.slice(lastIndex));
    return rendered;
  }

  function wrapGameUiTechnicalTokensInPlainTextChunk(chunk = '') {
    const source = String(chunk || '');
    if (!source) {
      return '';
    }

    const technicalTokenPattern = /\b(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.(?:hpp|cpp|h|c|txt)\b|\b[A-Za-z_][A-Za-z0-9_:]*\([^)\n<>]*\)|\b[A-Za-z_][A-Za-z0-9_:]*[A-Z_:][A-Za-z0-9_:]*\b/g;
    return source.replace(technicalTokenPattern, (match) => renderGameUiTechnicalInlineToken(match));
  }

  function decorateGameUiRenderedHtmlWithLtrTokens(html = '') {
    const source = String(html || '');
    if (!source) {
      return '';
    }

    const protectedTagNames = new Set(['a', 'code']);
    let protectedDepth = 0;
    let cursor = 0;
    let rendered = '';

    while (cursor < source.length) {
      const tagStart = source.indexOf('<', cursor);
      if (tagStart === -1) {
        const tail = source.slice(cursor);
        rendered += protectedDepth > 0 ? tail : wrapGameUiTechnicalTokensInPlainTextChunk(tail);
        break;
      }

      const textChunk = source.slice(cursor, tagStart);
      rendered += protectedDepth > 0 ? textChunk : wrapGameUiTechnicalTokensInPlainTextChunk(textChunk);

      const tagEnd = source.indexOf('>', tagStart);
      if (tagEnd === -1) {
        rendered += source.slice(tagStart);
        break;
      }

      const tagMarkup = source.slice(tagStart, tagEnd + 1);
      const closeMatch = /^<\s*\/\s*([a-zA-Z0-9:-]+)/.exec(tagMarkup);
      const openMatch = /^<\s*([a-zA-Z0-9:-]+)/.exec(tagMarkup);
      if (closeMatch) {
        const tagName = String(closeMatch[1] || '').toLowerCase();
        if (protectedTagNames.has(tagName) && protectedDepth > 0) {
          protectedDepth -= 1;
        }
      } else if (openMatch) {
        const tagName = String(openMatch[1] || '').toLowerCase();
        const isSelfClosing = /\/\s*>$/.test(tagMarkup);
        if (protectedTagNames.has(tagName) && !isSelfClosing) {
          protectedDepth += 1;
        }
      }

      rendered += tagMarkup;
      cursor = tagEnd + 1;
    }

    return rendered;
  }

  function getGameUiReferenceSectionId(sectionKey) {
    return `game-ui-${String(sectionKey || 'reference')}-list`;
  }

  function parseGameUiReferenceSectionId(sectionId) {
    const match = /^game-ui-([a-z0-9_]+)-list$/i.exec(String(sectionId || '').trim());
    if (!match) {
      return null;
    }

    return {
      sectionKey: match[1]
    };
  }

  function rememberGameUiReferenceSectionState(sectionKey, isExpanded) {
    const key = String(sectionKey || '').trim();
    if (!key) {
      return;
    }

    if (isExpanded) {
      gameUiExpandedReferenceSections.add(key);
    } else {
      gameUiExpandedReferenceSections.delete(key);
    }
  }

  function rememberGameUiReferenceSectionStateById(sectionId, isExpanded) {
    const parsed = parseGameUiReferenceSectionId(sectionId);
    if (!parsed) {
      return;
    }

    rememberGameUiReferenceSectionState(parsed.sectionKey, isExpanded);
  }

  function getGroupedGameUiExampleItems() {
    return Object.entries(gameUiSections || {}).map(([sectionKey, section]) => ({
      key: sectionKey,
      title: section.title || 'قسم واجهات ألعاب',
      note: section.description || section.titleEn || 'يجمع هذا المسار أمثلة متقاربة في الاستخدام داخل واجهات الألعاب.',
      items: (section.items || [])
        .filter((item) => item?.usageExample)
        .map((item) => ({
          ...item,
          sectionKey,
          sectionTitle: item.sectionTitle || section.title || sectionKey
        }))
    })).filter((group) => group.items.length);
  }

  function renderGameUiDocText(text = '', options = {}) {
    return decorateGameUiRenderedHtmlWithLtrTokens(
      linkifyGameUiText(String(text || ''), options)
    ).replace(/\n/g, '<br>');
  }

  function buildGameUiSectionSidebarTooltip(sectionKey, section = {}) {
    const count = Array.isArray(section.items) ? section.items.length : 0;
    const lines = [
      section.title || 'قسم واجهات الألعاب',
      `عدد العناصر: ${count}`,
      section.description || section.titleEn || ''
    ];

    if (sectionKey === 'hud') {
      lines.push('هذا الفرع يركز على عناصر الحالة والمؤشرات التي تبقى مرئية أثناء اللعب.');
    } else if (sectionKey === 'tools') {
      lines.push('هذا الفرع يجمع لوحات المحرر وأدوات الفحص والتحكم التي تخدم المطور أو المصمم.');
    } else if (sectionKey === 'navigation') {
      lines.push('هذا الفرع يشرح عناصر التنقل بين القوائم والمشاهد والواجهات المتفرعة.');
    } else if (sectionKey === 'feedback') {
      lines.push('هذا الفرع يوضح طبقات التغذية الراجعة البصرية مثل الرسائل والتنبيهات والحالات المؤقتة.');
    } else if (sectionKey === 'input') {
      lines.push('هذا الفرع يضم عناصر التفاعل المباشر مثل الحقول والأزرار وأدوات الإدخال.');
    }

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: section.title || 'قسم واجهات الألعاب',
        kindLabel: 'فهرس واجهات ألعاب',
        typeLabel: 'قسم مرجعي',
        library: 'Game UI',
        meaning: section.description || section.titleEn || 'يجمع أنماطاً واجهية متقاربة في الهدف العملي داخل الألعاب.',
        whyExists: sectionKey === 'hud'
          ? 'وُجد هذا القسم لأن عناصر HUD تُقرأ أثناء اللعب المستمر وتختلف دلالياً عن أدوات الإدخال أو التحرير.'
          : sectionKey === 'tools'
            ? 'وُجد هذا القسم لأن لوحات الأدوات تخدم المطور أو المصمم أكثر من اللاعب النهائي.'
            : sectionKey === 'navigation'
              ? 'وُجد هذا القسم لأن عناصر التنقل تنظّم الانتقال بين القوائم والمشاهد لا عرض الحالة داخل اللعب.'
              : sectionKey === 'feedback'
                ? 'وُجد هذا القسم لأن التغذية الراجعة البصرية تخبر اللاعب بما حدث أو تغير أو فشل.'
                : 'وُجد هذا القسم لتجميع عناصر الإدخال والتفاعل المباشر التي تقرأ فعل المستخدم فوراً.',
        whyUse: `يفيد للوصول السريع إلى ${count} عنصرًا من نفس العائلة الوظيفية.`,
        actualUsage: 'يظهر في الشريط الجانبي كمدخل فهرسة قبل فتح كل عنصر على حدة.'
      })
      : lines.filter(Boolean).join('\n');
  }

  function renderGameUiSectionNavItems(sectionKey, section = {}) {
    const sectionTitle = section.title || 'قسم واجهات الألعاب';
    const tooltip = buildGameUiSectionSidebarTooltip(sectionKey, section);
    const indexIcon = renderEntityIcon(getGameUiSectionIcon(sectionKey), 'ui-codicon nav-icon', sectionTitle);
    const sectionIndexHtml = renderSidebarNavItem({
      navType: 'game-ui-section-index',
      navName: sectionKey,
      tooltip,
      ariaLabel: `${sectionTitle}: ${tooltip.replace(/\n/g, ' - ')}`,
      iconHtml: indexIcon,
      label: `فهرس ${sectionTitle}`,
      activation: false
    });
    const itemsHtml = (section.items || []).map((item) => {
      const itemTooltip = buildGameUiReferenceTooltip(item);
      return renderSidebarNavItem({
        navType: 'game-ui',
        navName: item.name,
        tooltip: itemTooltip,
        ariaLabel: `${item.nameAr || item.name}: ${itemTooltip.replace(/\n/g, ' - ')}`,
        iconHtml: renderEntityIcon(getGameUiKindIcon(item.kind), 'ui-codicon nav-icon', item.nameAr || item.name),
        label: item.nameAr || item.name,
        activation: false
      });
    }).join('');

    return `
      ${sectionIndexHtml}
      ${itemsHtml || `<div class="nav-item">لا توجد عناصر في ${escapeHtml(sectionTitle)}</div>`}
    `;
  }

  function toggleGameUiReferenceSection(sectionKey, sectionId = getGameUiReferenceSectionId(sectionKey)) {
    const section = document.getElementById(sectionId);
    const parentSection = section?.closest('.nav-section');
    const cluster = parentSection?.closest('.nav-cluster') || document.getElementById('game-ui-cluster');

    if (!parentSection) {
      return;
    }

    if (!parentSection.classList.contains('collapsed')) {
      collapseAllSidebarSections();
      collapseAllSidebarNavGroups();
      rememberGameUiReferenceSectionState(sectionKey, false);
      return;
    }

    if (cluster) {
      collapseAllSidebarClusters(cluster.id || '');
      cluster.classList.remove('collapsed');
    }

    collapseAllSidebarSections(parentSection);
    collapseAllSidebarNavGroups();
    parentSection.classList.remove('collapsed');
    rememberGameUiReferenceSectionState(sectionKey, true);
  }

  function renderGameUiRelatedLink(name = '') {
    const item = getGameUiReferenceItem(name);
    if (!item) {
      return `<span class="related-link related-link-static">${escapeHtml(name)}</span>`;
    }

    const tooltip = buildGameUiReferenceTooltip(item);
    const label = item.nameAr || item.name || name;
    const action = item.usageExample ? 'showGameUiExample' : 'showGameUiItem';
    return `<a href="#" class="related-link entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${action}('${escapeAttribute(item.name)}'); return false;">${renderEntityIcon(getGameUiKindIcon(item.kind), 'ui-codicon list-icon', label)} ${escapeHtml(label)}</a>`;
  }

  function detectGameUiCodeLanguage(filePath = '') {
    const normalized = String(filePath || '').trim().toLowerCase();
    if (!normalized) {
      return 'cpp';
    }
    if (normalized === 'cmakelists.txt' || normalized.endsWith('.cmake')) {
      return 'cmake';
    }
    if (normalized.endsWith('.sh') || normalized.endsWith('.bash')) {
      return 'bash';
    }
    if (/\.(c|cc|cpp|cxx|h|hh|hpp|hxx)$/i.test(normalized)) {
      return 'cpp';
    }
    return 'cpp';
  }

  function buildGameUiCodeFileTooltip(file = {}) {
    const pathLabel = String(file.filePath || file.header || 'example.cpp').trim();
    const summary = String(file.summary || '').trim();
    const language = detectGameUiCodeLanguage(pathLabel);
    const typeLabel = language === 'cmake'
      ? 'ملف بناء CMake'
      : language === 'bash'
        ? 'ملف أوامر'
        : 'ملف C++';

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: pathLabel,
        kindLabel: 'ملف مثال',
        typeLabel,
        library: 'Game UI',
        meaning: summary || 'يمثل هذا الملف جزءًا مستقلاً من المثال العملي داخل واجهات الألعاب.',
        whyExists: 'فُصل هنا حتى تقرأ مسؤولية كل ملف على حدة بدل كتلة كود واحدة طويلة.',
        whyUse: 'يفيد في تتبع من أين تبدأ البنية: ملف البناء، الواجهات، المدير، الإضافات، ثم نقطة الدخول.',
        actualUsage: 'اضغط للانتقال السريع إلى هذا الملف داخل نفس المثال.'
      })
      : [pathLabel, summary, typeLabel].filter(Boolean).join('\n');
  }

  function buildGameUiLocalCodeSymbolTooltip(symbolName = '', symbolKind = '', file = {}) {
    const resolvedName = String(symbolName || '').trim();
    const resolvedKind = String(symbolKind || '').trim();
    const filePath = String(file.filePath || file.header || 'example.cpp').trim();
    const summary = String(file.summary || '').trim();
    const kindLabel = resolvedKind === 'function'
      ? 'دالة محلية'
      : resolvedKind === 'namespace'
        ? 'نطاق محلي'
        : resolvedKind === 'enum'
          ? 'تعداد محلي'
          : resolvedKind === 'class'
            ? 'صنف محلي'
            : 'نوع محلي';
    const meaning = summary
      ? `يظهر الرمز ${resolvedName} داخل الملف ${filePath} الذي ${summary}.`
      : `يظهر الرمز ${resolvedName} داخل الملف ${filePath} كجزء من بنية المثال الحالية.`;

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: resolvedName,
        kindLabel,
        typeLabel: filePath,
        library: 'Game UI',
        meaning,
        whyExists: 'رُبط هذا الرمز داخل الكود حتى تصل بسرعة إلى الملف الذي يعرّفه أو يطبّقه داخل المثال نفسه.',
        whyUse: 'يفيد عندما تريد تتبع موقع تعريف الدالة أو الصنف بدون مغادرة الصفحة الحالية.',
        actualUsage: `الضغط عليه ينقلك إلى بطاقة الملف ${filePath} داخل المثال.`
      })
      : [resolvedName, kindLabel, filePath, summary].filter(Boolean).join('\n');
  }

  function extractGameUiCodeSymbols(file = {}) {
    const code = String(file.code || '');
    if (!code) {
      return [];
    }

    const symbolMap = new Map();
    const pushSymbol = (name = '', kind = 'type') => {
      const resolvedName = String(name || '').trim();
      if (!resolvedName || symbolMap.has(resolvedName)) {
        return;
      }
      symbolMap.set(resolvedName, {
        anchorId: file.anchorId,
        iconType: kind === 'function' ? 'command' : 'structure',
        tooltip: buildGameUiLocalCodeSymbolTooltip(resolvedName, kind, file)
      });
    };

    const typeRegex = /\b(class|struct|enum(?:\s+class)?)\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;
    let match;
    while ((match = typeRegex.exec(code)) !== null) {
      pushSymbol(match[2], match[1].startsWith('enum') ? 'enum' : 'class');
    }

    const namespaceRegex = /\bnamespace\s+([A-Za-z_][A-Za-z0-9_]*)\b/g;
    while ((match = namespaceRegex.exec(code)) !== null) {
      pushSymbol(match[1], 'namespace');
    }

    const functionRegex = /(?:^|\n)\s*(?:inline\s+)?(?:virtual\s+)?(?:explicit\s+)?(?:static\s+)?(?:constexpr\s+)?(?:friend\s+)?(?:consteval\s+)?(?:constinit\s+)?(?:[A-Za-z_][A-Za-z0-9_:<>\s*&~,]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^;\n{}]*\)\s*(?:const\s*)?(?:override\s*)?(?:=\s*0\s*)?(?:\{|;)/gm;
    const disallowedNames = new Set(['if', 'for', 'while', 'switch', 'return', 'catch']);
    while ((match = functionRegex.exec(code)) !== null) {
      const functionName = String(match[1] || '').trim();
      if (!disallowedNames.has(functionName)) {
        pushSymbol(functionName, 'function');
      }
    }

    return Array.from(symbolMap.entries());
  }

  function buildGameUiCodeLocalSymbolMap(files = []) {
    const localSymbolMap = {};
    files.forEach((file) => {
      extractGameUiCodeSymbols(file).forEach(([symbolName, descriptor]) => {
        if (!localSymbolMap[symbolName]) {
          localSymbolMap[symbolName] = descriptor;
        }
      });
    });
    return localSymbolMap;
  }

  function buildGameUiCodeFiles(rawCode = '', fallbackTitle = '') {
    const source = String(rawCode || '').trim();
    if (!source) {
      return [];
    }

    const files = [];
    const markerRegex = /^\/\/\s*═+\s*\n\/\/\s*📄\s*(.+?)\s*\n\/\/\s*═+\s*\n/gm;
    const markers = [];
    let match;

    while ((match = markerRegex.exec(source)) !== null) {
      markers.push({
        header: String(match[1] || '').trim(),
        contentStart: markerRegex.lastIndex
      });
    }

    markers.forEach((marker, index) => {
      const nextMarkerMatchIndex = index + 1 < markers.length
        ? source.lastIndexOf(`// 📄 ${markers[index + 1].header}`, markers[index + 1].contentStart)
        : source.length;
      const code = String(source.slice(marker.contentStart, nextMarkerMatchIndex)).trim();
      if (!code) {
        return;
      }

      const headerParts = marker.header.split(/\s+—\s+/);
      const filePath = String(headerParts.shift() || '').trim();
      const summary = headerParts.join(' — ').trim();
      files.push({
        header: marker.header,
        filePath,
        summary,
        code,
        language: detectGameUiCodeLanguage(filePath || marker.header),
        anchorId: `game-ui-code-${slugifyGameUiText(filePath || marker.header || fallbackTitle)}-${files.length + 1}`
      });
    });

    if (files.length) {
      return files;
    }

    const fallbackPath = String(fallbackTitle || 'example.cpp').trim();
    return [{
      header: fallbackPath,
      filePath: fallbackPath,
      summary: '',
      code: source,
      language: detectGameUiCodeLanguage(fallbackPath),
      anchorId: `game-ui-code-${slugifyGameUiText(fallbackPath)}-1`
    }];
  }

  function getGameUiCodeFileExplanationMap(item = null) {
    const rawNote = String(item?.usageExample?.importantNote || '').trim();
    if (!rawNote) {
      return new Map();
    }

    const fileExplanationSection = splitGameUiImportantNoteSections(rawNote)
      .find((section) => /شرح الملفات/i.test(String(section?.title || '').trim()));
    if (!fileExplanationSection) {
      return new Map();
    }

    const explanationMap = new Map();
    let current = null;

    (fileExplanationSection.lines || []).forEach((line) => {
      const trimmed = String(line || '').trim();
      if (!trimmed) {
        return;
      }

      const match = /^(\d+)\)\s+(.+?)\s+—\s+(.+?)\s*:?\s*$/.exec(trimmed);
      if (match) {
        if (current?.fileKey) {
          explanationMap.set(current.fileKey, current);
        }

        const fileLabel = String(match[2] || '').trim();
        current = {
          index: String(match[1] || '').trim(),
          fileLabel,
          fileKey: normalizeGameUiFileLookup(fileLabel),
          title: String(match[3] || '').trim(),
          lines: []
        };
        return;
      }

      if (current) {
        current.lines.push(trimmed);
      }
    });

    if (current?.fileKey) {
      explanationMap.set(current.fileKey, current);
    }

    return explanationMap;
  }

  function renderGameUiCodeFileBlock(file = {}, fallbackTitle = '', localSymbolMap = null) {
    const filePath = String(file.filePath || fallbackTitle || file.header || 'example.cpp').trim();
    const summary = String(file.summary || '').trim();
    return renderDocCodeContainer({
      titleHtml: `
        <div id="${escapeAttribute(file.anchorId)}" class="game-ui-code-file-title">
          <span class="game-ui-code-file-path">${renderEntityIcon('file', 'ui-codicon list-icon', filePath)} ${renderGameUiFileLabel(filePath) || escapeHtml(filePath)}</span>
          ${summary ? `<small>${renderGameUiDocText(summary)}</small>` : ''}
        </div>
      `,
      rawCode: file.code,
      renderedCodeHtml: renderHighlightedCode(file.code, {
        language: file.language,
        annotate: true,
        localSymbolMap
      }),
      language: file.language,
      containerClassName: 'example-section tutorial-example-section game-ui-example-code-file',
      preClassName: 'tutorial-example-pre',
      codeClassName: 'vulkan-signature-code',
      allowCopy: true,
      allowToggle: true,
      skipHighlight: true
    });
  }

  function renderGameUiCodeFileExplanation(file = {}, explanation = null, item = null) {
    if (!explanation) {
      return '';
    }

    const fileLabel = explanation.fileLabel || getGameUiFileBaseName(file.filePath || '');
    const bodyHtml = explanation.lines.length
      ? renderGameUiImportantNoteLineContent(explanation.lines, item, {sectionTitle: 'شرح الملفات'})
      : '<div class="game-ui-important-note-empty">لا توجد تفاصيل إضافية لهذا الملف بعد.</div>';

    return `
      <div class="content-card prose-card game-ui-code-file-explanation">
        <div class="game-ui-code-file-explanation-head">
          <div class="info-label">شرح الملف</div>
          <h3>
            ${renderGameUiFileLabel(fileLabel) || escapeHtml(fileLabel)}
            ${explanation.title ? `<span class="game-ui-code-file-explanation-title">${renderGameUiDocText(explanation.title, {item})}</span>` : ''}
          </h3>
          <p>وُضع شرح هذا الملف مباشرة بعد كوده حتى تقرأ المسؤولية والبنية والتنفيذ في نفس الموضع.</p>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function renderGameUiCodeFileEntry(file = {}, options = {}) {
    const explanationMap = options.fileExplanationMap instanceof Map ? options.fileExplanationMap : new Map();
    const explanation = explanationMap.get(normalizeGameUiFileLookup(file.filePath)) || null;

    return `
      <div class="game-ui-code-file-stack">
        ${renderGameUiCodeFileBlock(file, options.fallbackTitle, options.localSymbolMap || null)}
        ${renderGameUiCodeFileExplanation(file, explanation, options.item || null)}
      </div>
    `;
  }

  function renderGameUiCodeBlock(title, code = '', options = {}) {
    const rawCode = String(code || '').trim();
    if (!rawCode) {
      return '';
    }

    const item = options.item || null;
    const fileExplanationMap = options.enableFileExplanations === false
      ? new Map()
      : getGameUiCodeFileExplanationMap(item);
    const files = buildGameUiCodeFiles(rawCode, title);
    const localSymbolMap = buildGameUiCodeLocalSymbolMap(files);
    if (files.length > 1) {
      const navLinks = files.map((file) => {
        const tooltip = buildGameUiCodeFileTooltip(file);
        return `<a href="#" class="related-link entity-link-with-icon game-ui-code-file-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${file.filePath}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="scrollToAnchor('${escapeAttribute(file.anchorId)}'); return false;">${renderEntityIcon('file', 'ui-codicon list-icon', file.filePath)} ${renderGameUiFileLabel(file.filePath) || escapeHtml(file.filePath)}</a>`;
      }).join('');

      return `
        <div class="game-ui-example-code-shell">
          <div class="content-card prose-card game-ui-example-code-intro-card">
            <div class="game-ui-example-code-intro">
              <h2>الكود مقسماً حسب الملفات</h2>
              <p>فُصل المثال هنا إلى ${files.length} ملفات حتى ترى طبقة البناء ثم الواجهات ثم المدير ثم نقطة الدخول بصورة أقرب لبنية مشروع حقيقية، ومع كل ملف يظهر شرحه أسفل الكود مباشرة عندما يكون موصوفًا داخل الصفحة. أسماء الدوال والأنواع المحلية أصبحت أيضًا قابلة للنقر مع tooltip ينقلك إلى الملف الذي يعرّفها.</p>
            </div>
            <div class="see-also-links reference-summary-list game-ui-code-file-nav">${navLinks}</div>
          </div>
          ${files.map((file) => renderGameUiCodeFileEntry(file, {fallbackTitle: title, item, fileExplanationMap, localSymbolMap})).join('')}
        </div>
      `;
    }

    return renderGameUiCodeFileEntry(files[0], {fallbackTitle: title || 'الكود', item, fileExplanationMap, localSymbolMap});
  }

  function populateGameUiList() {
    const container = document.getElementById('game-ui-list');
    if (!container) {
      return;
    }

    const exampleGroups = getGroupedGameUiExampleItems();
    const exampleGroupsHtml = exampleGroups.map((group, index) => renderSidebarExampleGroup({
      className: 'game-ui-example-nav-group',
      dataAttributeName: 'data-game-ui-example-group',
      dataAttributeValue: group.key,
      isExpanded: gameUiExpandedExampleGroups.size
        ? gameUiExpandedExampleGroups.has(group.key)
        : index === 0,
      onToggle: `toggleGameUiExampleGroup('${escapeAttribute(group.key)}')`,
      titleHtml: `${renderEntityIcon(getGameUiSectionIcon(group.key), 'ui-codicon nav-icon', group.title)} ${escapeHtml(group.title)}`,
      count: group.items.length,
      description: group.note,
      itemsHtml: group.items.map((item) => {
        const tooltip = buildGameUiReferenceTooltip(item);
        return renderSidebarNavItem({
          navType: 'game-ui-example',
          navName: item.name,
          tooltip,
          ariaLabel: `${item.nameAr || item.name}: ${tooltip.replace(/\n/g, ' - ')}`,
          iconHtml: renderEntityIcon(getGameUiKindIcon(item.kind), 'ui-codicon nav-icon', item.nameAr || item.name),
          label: item.nameAr || item.name,
          activation: false
        });
      }).join('')
    })).join('');

    let html = renderSidebarNavItem({
      navType: 'game-ui-index',
      navName: 'game-ui-index',
      tooltip: 'يفتح الفهرس المحلي الكامل لعناصر واجهات الألعاب داخل المشروع.',
      iconHtml: renderEntityIcon('gameui', 'ui-codicon nav-icon', 'واجهات الألعاب'),
      label: 'فهرس واجهات الألعاب',
      activation: false
    });

    Object.entries(gameUiSections || {}).forEach(([sectionKey, section]) => {
      const sectionId = getGameUiReferenceSectionId(sectionKey);
      const count = Array.isArray(section.items) ? section.items.length : 0;
      html += renderSidebarSectionShell({
        className: 'sdl3-package-kind-section game-ui-reference-kind-section',
        isExpanded: gameUiExpandedReferenceSections.has(sectionKey),
        onToggle: `toggleGameUiReferenceSection('${escapeAttribute(sectionKey)}', '${escapeAttribute(sectionId)}')`,
        headingHtml: `<h3>${renderEntityIcon(getGameUiSectionIcon(sectionKey), 'ui-codicon nav-icon', section.title || 'قسم واجهات الألعاب')} ${escapeHtml(section.title || 'قسم واجهات الألعاب')} <span class="nav-section-inline-count">${count}</span></h3>`,
        sectionId,
        bodyHtml: renderGameUiSectionNavItems(sectionKey, section)
      });
    });

    const examplesSectionId = getGameUiReferenceSectionId('examples');
    const exampleCount = exampleGroups.reduce((total, group) => total + group.items.length, 0);
    html += renderSidebarSectionShell({
      className: 'sdl3-package-kind-section game-ui-reference-kind-section game-ui-examples-sidebar-section',
      isExpanded: gameUiExpandedReferenceSections.has('examples'),
      onToggle: `toggleGameUiReferenceSection('examples', '${escapeAttribute(examplesSectionId)}')`,
      headingHtml: `<h3>${renderEntityIcon('gameui', 'ui-codicon nav-icon', 'أمثلة واجهات الألعاب')} أمثلة واجهات الألعاب <span class="nav-section-inline-count">${exampleCount}</span></h3>`,
      sectionId: examplesSectionId,
      bodyHtml: `
        ${renderSidebarNavItem({
          navType: 'game-ui-examples-index',
          navName: 'game-ui-examples',
          tooltip: 'يفتح فهرس أمثلة واجهات الألعاب داخل المشروع مع توزيعها بحسب التصنيف العملي.',
          iconHtml: renderEntityIcon('gameui', 'ui-codicon nav-icon', 'أمثلة واجهات الألعاب'),
          label: 'أمثلة واجهات الألعاب',
          activation: false
        })}
        ${exampleGroupsHtml || '<div class="nav-item">لا توجد أمثلة عملية لواجهات الألعاب</div>'}
      `
    });

    container.innerHTML = html || '<div class="nav-item">لا توجد عناصر واجهات ألعاب</div>';
  }

  function toggleGameUiExampleGroup(groupKey) {
    const normalizedGroupKey = String(groupKey || '').trim();
    if (!normalizedGroupKey) {
      return;
    }

    const group = document.querySelector(`.game-ui-example-nav-group[data-game-ui-example-group="${escapeSelectorValue(normalizedGroupKey)}"]`);
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
    gameUiExpandedExampleGroups.add(normalizedGroupKey);
  }

  function getGameUiItemKindLabel(item = {}) {
    return item?.kind === 'panel' ? 'لوحة' : 'عنصر واجهة';
  }

  function renderGameUiHomeHeroPreview() {
    const title = escapeAttribute(gameUiMeta.displayName || 'واجهات الألعاب');

    return `
      <figure class="vulkan-ready-example-shot game-ui-home-hero-shot">
        <svg viewBox="0 0 360 220" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gameUiHeroFocus" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#31597f"/>
              <stop offset="100%" stop-color="#223d57"/>
            </linearGradient>
            <linearGradient id="gameUiHeroPanel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#182a3c"/>
              <stop offset="100%" stop-color="#142434"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="220" rx="24" fill="#09101a"/>
          <rect x="22" y="34" width="316" height="154" rx="28" fill="#101b28"/>
          <rect x="38" y="56" width="84" height="110" rx="18" fill="url(#gameUiHeroPanel)"/>
          <rect x="138" y="44" width="84" height="134" rx="22" fill="url(#gameUiHeroFocus)" stroke="#91d1ff" stroke-width="2.5"/>
          <rect x="238" y="56" width="84" height="110" rx="18" fill="url(#gameUiHeroPanel)"/>
          <circle cx="180" cy="30" r="10" fill="#ffd06f"/>
          <path d="M180 40 V46" stroke="#ffd06f" stroke-width="4" stroke-linecap="round"/>
          <rect x="50" y="78" width="60" height="10" rx="5" fill="#748daa"/>
          <rect x="50" y="108" width="42" height="36" rx="12" fill="#405d7b"/>
          <rect x="152" y="66" width="56" height="12" rx="6" fill="#eef6ff"/>
          <rect x="152" y="106" width="56" height="44" rx="14" fill="#74b6f1"/>
          <rect x="154" y="160" width="52" height="10" rx="5" fill="#ffd06f"/>
          <rect x="250" y="78" width="60" height="10" rx="5" fill="#748daa"/>
          <rect x="250" y="108" width="42" height="36" rx="12" fill="#405d7b"/>
        </svg>
        <figcaption>HUD + UI + أدوات المحرر</figcaption>
      </figure>
    `;
  }

  function renderGameUiItemHeroPreview(item = {}) {
    const title = escapeAttribute(item.nameAr || item.name || 'واجهات الألعاب');
    const representation = item?.guiRepresentation || null;
    const heroBody = representation?.visualHtml
      ? `
        <div class="game-ui-hero-shot-stage">
          ${representation.visualHtml}
        </div>
      `
      : representation?.mockup
        ? `
          <div class="game-ui-hero-shot-stage game-ui-hero-shot-stage-mockup">
            <pre class="game-ui-index-preview-fallback">${escapeHtml(representation.mockup)}</pre>
          </div>
        `
        : `
          <div class="game-ui-hero-shot-stage game-ui-hero-shot-stage-empty">
            <div class="game-ui-index-preview-empty">
              <span>${renderEntityIcon(getGameUiKindIcon(item.kind), 'ui-codicon list-icon', item.nameAr || item.name || 'عنصر واجهة')}</span>
              <strong>${escapeHtml(item.kind === 'panel' ? 'لوحة' : 'عنصر واجهة')}</strong>
              <p>${escapeHtml(item.shortTooltip || item.description || item.nameAr || item.name || '')}</p>
            </div>
          </div>
        `;

    return `
      <figure class="vulkan-ready-example-shot game-ui-hero-shot">
        ${heroBody}
        <figcaption>${escapeHtml(item.nameAr || item.name || 'عنصر واجهة')}</figcaption>
      </figure>
    `;
  }

  function renderGameUiIndexCardPreview(item) {
    if (!item) {
      return '';
    }

    const representation = item.guiRepresentation || null;
    const kindLabel = getGameUiItemKindLabel(item);
    const caption = item.usageExample?.expectedResult
      || item.usageExample?.scenario
      || item.shortTooltip
      || item.description
      || item.nameAr
      || item.name
      || '';
    const mockup = String(representation?.mockup || '').trim();
    const mockupPreview = mockup
      ? mockup.split('\n').slice(0, 7).join('\n')
      : '';
    const visualMarkup = representation?.visualHtml
      ? `<div class="game-ui-index-preview-visual">${representation.visualHtml}</div>`
      : '';
    const fallbackMarkup = mockupPreview
      ? `<pre class="game-ui-index-preview-fallback">${escapeHtml(mockupPreview)}</pre>`
      : `
        <div class="game-ui-index-preview-empty">
          <span>${renderEntityIcon(getGameUiKindIcon(item.kind), 'ui-codicon list-icon', kindLabel)}</span>
          <strong>${escapeHtml(kindLabel)}</strong>
          <p>${escapeHtml(summarizeExamplePreviewText(caption, 16))}</p>
        </div>
      `;

    return `
      <figure class="game-ui-index-preview">
        <div class="game-ui-index-preview-window">
          <div class="game-ui-index-preview-titlebar">
            <span class="game-ui-index-preview-chip">${escapeHtml(item.sectionTitle || '')}</span>
            <span class="game-ui-index-preview-chip muted">${escapeHtml(kindLabel)}</span>
          </div>
          <div class="game-ui-index-preview-body">
            ${visualMarkup || fallbackMarkup}
          </div>
        </div>
        <figcaption>${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }

  function getGameUiPreviewEntries(sectionKey = '') {
    const section = gameUiSections?.[sectionKey];
    if (!section?.items?.length) {
      return [];
    }

    return (section.items || []).map((item) => ({
      id: item.name,
      title: item.nameAr || item.name,
      summary: summarizeExamplePreviewText(
        item.usageExample?.scenario || item.shortTooltip || item.description || '',
        22
      ),
      previewHtml: renderGameUiIndexCardPreview(item),
      openAction: `showGameUiExample('${escapeAttribute(item.name)}')`,
      actionLabel: 'عرض المثال'
    }));
  }

  function getGameUiHomeSections() {
    if (Array.isArray(gameUiMeta.sections) && gameUiMeta.sections.length > 0) {
      return gameUiMeta.sections.slice();
    }

    return Object.entries(gameUiSections || {}).map(([key, section]) => ({
      key,
      title: section.title,
      titleEn: section.titleEn || '',
      itemCount: (section.items || []).length
    }));
  }

  function renderGameUiGroupedIndexSection() {
    const sections = getGameUiHomeSections();
    if (!sections.length) {
      return '';
    }

    return `
      <section class="category-section library-example-preview-section game-ui-groups-section" id="game-ui-index-grid">
        <div class="library-example-preview-header">
          <div class="library-example-preview-heading">
            <h2>كتل واجهات الألعاب</h2>
            <p>جُمعت عناصر HUD و UI وأدوات المحرر هنا إلى مسارات قابلة للفتح والإغلاق حتى تبقى الصفحة أوضح وأسهل في التصفح. افتح الكتلة المناسبة ثم انتقل إلى العنصر الكامل.</p>
          </div>
        </div>
        <div class="vulkan-example-clusters">
          ${sections.map((sectionInfo, index) => {
            const section = gameUiSections?.[sectionInfo.key] || {};
            const title = sectionInfo.title || section.title || 'قسم واجهات ألعاب';
            const items = section.items || [];
            const description = section.description || sectionInfo.titleEn || 'يجمع هذا المسار عناصر متقاربة في الاستخدام داخل واجهات الألعاب.';
            const note = items.length
              ? `يعرض هذا المسار ${items.length} عنصرًا يمكن فتح كل واحد منها كصفحة مستقلة داخل المشروع مع شرح عملي وتمثيل بصري.`
              : 'لا توجد عناصر محلية في هذا المسار حالياً.';

            return `
              <details class="content-card prose-card vulkan-example-cluster game-ui-cluster" id="game-ui-section-${escapeAttribute(sectionInfo.key)}"${index === 0 ? ' open' : ''}>
                <summary class="vulkan-example-cluster-summary">
                  <span class="vulkan-example-cluster-title-wrap">
                    <span class="vulkan-example-cluster-title">${renderEntityIcon(getGameUiSectionIcon(sectionInfo.key), 'ui-codicon list-icon', title)} ${escapeHtml(title)}</span>
                    <span class="vulkan-example-cluster-count">${items.length} عنصر</span>
                  </span>
                  <span class="vulkan-example-cluster-note">${escapeHtml(description)}</span>
                </summary>
                <div class="vulkan-example-cluster-body">
                <p class="vulkan-example-cluster-body-note">${escapeHtml(note)}</p>
                <div class="library-example-preview-grid">
                  ${getGameUiPreviewEntries(sectionInfo.key).map((entry) => renderLibraryExamplePreviewCard(entry)).join('')}
                </div>
              </div>
            </details>
          `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function renderGameUiDetailsList(title, items = [], contextItem = null) {
    if (!items.length) {
      return '';
    }

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>${escapeHtml(title)}</h2>
          <ul class="best-practices-list">
            ${items.map((entry) => `<li>${renderGameUiDocText(entry, {item: contextItem})}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function renderGameUiRelatedSection(item) {
    const relatedLinks = getGameUiContextualRelatedNames(item).map((name) => renderGameUiRelatedLink(name)).join('');
    if (!relatedLinks) {
      return '';
    }

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>العناصر المرتبطة</h2>
          <div class="see-also-links reference-summary-list reference-summary-list-vertical">${relatedLinks}</div>
        </div>
      </section>
    `;
  }

  function renderGameUiParametersTable(item) {
    const parameters = item?.parameters || [];
    if (!parameters.length && !item?.signature) {
      return '';
    }

    const signatureHtml = item?.signature
      ? `
        <div class="content-card prose-card">
          <h3>التوقيع العام</h3>
          ${renderGameUiCodeBlock(item.signature.name || 'Signature', `${item.signature.returnType || 'void'} ${item.signature.name || item.name}(${(item.signature.params || []).map((param) => `${param.type} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ''}`).join(', ')});`, {enableFileExplanations: false})}
        </div>
      `
      : '';

    if (!parameters.length) {
      return `
        <section class="info-section">
          <h2>التوقيع والمعاملات</h2>
          ${signatureHtml}
        </section>
      `;
    }

    return `
      <section class="info-section">
        <h2>التوقيع والمعاملات</h2>
        ${signatureHtml}
        <table class="params-table">
          <thead>
            <tr>
              <th>المعامل</th>
              <th>النوع</th>
              <th>الدور الفعلي</th>
              <th>كيفية الاستخدام</th>
            </tr>
          </thead>
          <tbody>
            ${parameters.map((parameter) => `
              <tr>
                <td><code dir="ltr">${escapeHtml(parameter.name || '')}</code></td>
                <td><code dir="ltr">${escapeHtml(parameter.type || '')}</code></td>
                <td>${renderGameUiDocText(parameter.realRole || parameter.officialArabicDescription || '', {item})}</td>
                <td>${renderGameUiDocText(parameter.actualUsage || parameter.whyPassed || '', {item})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  function renderGameUiExampleSummaryCard(item) {
    const usageExample = item?.usageExample || null;
    if (!usageExample) {
      return '';
    }

    const exampleTitle = escapeHtml(`مثال ${item?.nameAr || item?.displayName || item?.name || 'عملي'}`);
    const introText = String(item?.guiRepresentation?.explanation || usageExample.explanation || item?.shortTooltip || '').trim();
    const summaryEntries = [
      usageExample.scenario ? ['السيناريو', usageExample.scenario] : null,
      usageExample.explanation && String(usageExample.explanation).trim() !== introText
        ? ['الفكرة', usageExample.explanation]
        : null,
      usageExample.expectedResult ? ['النتيجة المتوقعة', usageExample.expectedResult] : null
    ].filter(Boolean);

    return `
      <div class="content-card prose-card game-ui-example-summary-card">
        <h2>المثال العملي</h2>
        <div class="game-ui-example-summary-intro">
          <h3>${exampleTitle}</h3>
          ${introText ? `<p>${renderGameUiDocText(introText, {item})}</p>` : ''}
        </div>
        ${summaryEntries.length ? `
          <div class="game-ui-example-summary-points">
            ${summaryEntries.map(([label, value]) => `
              <div class="game-ui-example-summary-point">
                <strong>${escapeHtml(label)}</strong>
                <p>${renderGameUiDocText(value, {item})}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function splitGameUiImportantNoteSections(rawNote = '') {
    const lines = String(rawNote || '').split('\n');
    const sections = [];
    let current = {
      title: '',
      lines: []
    };

    lines.forEach((line) => {
      const headingMatch = /^===\s*(.+?)\s*===$/.exec(String(line || '').trim());
      if (headingMatch) {
        if (current.title || current.lines.some((entry) => String(entry || '').trim())) {
          sections.push(current);
        }
        current = {
          title: headingMatch[1],
          lines: []
        };
        return;
      }

      current.lines.push(String(line || ''));
    });

    if (current.title || current.lines.some((entry) => String(entry || '').trim())) {
      sections.push(current);
    }

    return sections;
  }

  function buildGameUiImportantNoteStageBlocks(lines = []) {
    const blocks = [];
    let current = null;

    lines.forEach((line) => {
      const trimmed = String(line || '').trim();
      if (!trimmed) {
        return;
      }

      const match = /^(المرحلة\s+\d+)\s*:\s*(.+)$/.exec(trimmed);
      if (match) {
        if (current) {
          blocks.push(current);
        }
        current = {
          badge: match[1],
          title: match[2],
          lines: []
        };
        return;
      }

      if (current) {
        current.lines.push(trimmed);
      }
    });

    if (current) {
      blocks.push(current);
    }

    return blocks;
  }

  function buildGameUiImportantNoteNumberedBlocks(lines = []) {
    const blocks = [];
    let current = null;

    lines.forEach((line) => {
      const trimmed = String(line || '').trim();
      if (!trimmed) {
        return;
      }

      const match = /^(\d+)\)\s*(.+)$/.exec(trimmed);
      if (match) {
        if (current) {
          blocks.push(current);
        }
        current = {
          index: match[1],
          title: match[2],
          lines: []
        };
        return;
      }

      if (current) {
        current.lines.push(trimmed);
      }
    });

    if (current) {
      blocks.push(current);
    }

    return blocks;
  }

  function shouldRenderGameUiImportantNoteAsPre(lines = [], sectionTitle = '') {
    const title = String(sectionTitle || '').trim();
    const normalizedLines = lines.map((line) => String(line || '')).filter((line) => line.trim());
    if (!normalizedLines.length) {
      return false;
    }

    if (/هيكل المشروع|طريقة التصدير|أوامر البناء|أمر البناء|أمر التشغيل|الناتج المتوقع/i.test(title)) {
      return true;
    }

    if (normalizedLines.some((line) => /[├└│]/.test(line))) {
      return true;
    }

    return normalizedLines.every((line) => /^\s*(#|cmake\b|mkdir\b|cp\b|git\b|\.\/|find_package|target_|add_|set\(|project\(|cmake_minimum_required)/i.test(line));
  }

  function getGameUiImportantNoteSectionMeta(title = '') {
    const normalizedTitle = String(title || '').trim();
    if (/^أمر البناء$/i.test(normalizedTitle) || /^أوامر البناء$/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-build',
        badge: 'Build',
        intro: 'هذه البطاقة تعطيك أمر البناء مباشرة حتى تبدأ بدون تشتت.'
      };
    }
    if (/^أمر التشغيل$/i.test(normalizedTitle) || /التشغيل النهائي/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-run',
        badge: 'Run',
        intro: 'بعد اكتمال البناء انتقل إلى هذه البطاقة لتشغيل المثال فعليًا.'
      };
    }
    if (/^الناتج المتوقع$/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-output',
        badge: 'Output',
        intro: 'استخدم هذا الناتج كمرجع سريع للتأكد أن المثال يعمل كما هو متوقع.'
      };
    }
    if (/لماذا.*يمثل.*المفهوم/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-why',
        badge: 'Why',
        intro: 'هذه البطاقة تشرح لك لماذا يرتبط هذا المثال بالمفهوم نفسه، لا بالكود فقط.'
      };
    }
    if (/شرح الملفات/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-files',
        badge: 'Files',
        intro: 'ابدأ من هذه البطاقة إذا أردت فهم مسؤولية كل ملف قبل قراءة الكود.'
      };
    }
    if (/هيكل المشروع/i.test(normalizedTitle)) {
      return {
        cardClassName: 'game-ui-important-note-callout-structure',
        badge: 'Tree',
        intro: 'هذه البطاقة تربطك سريعًا ببنية المجلدات قبل الدخول في الملفات.'
      };
    }
    return {
      cardClassName: '',
      badge: '',
      intro: ''
    };
  }

  function renderGameUiImportantNoteLineContent(lines = [], item, options = {}) {
    const normalizedLines = lines.map((line) => String(line || '')).filter((line) => line.trim());
    if (!normalizedLines.length) {
      return '<div class="game-ui-important-note-empty">لا توجد تفاصيل إضافية داخل هذا الجزء.</div>';
    }

    if (shouldRenderGameUiImportantNoteAsPre(normalizedLines, options.sectionTitle)) {
      return `<pre class="code-block game-ui-important-note-pre"><code>${escapeHtml(normalizedLines.join('\n'))}</code></pre>`;
    }

    const bulletLines = normalizedLines.filter((line) => /^-\s+/.test(line));
    if (bulletLines.length === normalizedLines.length) {
      return `
        <ul class="best-practices-list game-ui-important-note-list">
          ${bulletLines.map((line) => `<li><p>${renderGameUiDocText(line.replace(/^-\s+/, ''), {item})}</p></li>`).join('')}
        </ul>
      `;
    }

    return `
      <div class="game-ui-important-note-paragraphs">
        ${normalizedLines.map((line) => `<p>${renderGameUiDocText(line, {item})}</p>`).join('')}
      </div>
    `;
  }

  function renderGameUiImportantNoteSection(section = {}, item, index = 0, totalSections = 0) {
    const title = String(section?.title || '').trim() || 'تفاصيل إضافية';
    const lines = Array.isArray(section?.lines) ? section.lines : [];
    const meta = getGameUiImportantNoteSectionMeta(title);
    const sectionClasses = ['game-ui-important-note-section'];
    if (meta.cardClassName) {
      sectionClasses.push(meta.cardClassName);
    }
    if (index < totalSections - 1) {
      sectionClasses.push('game-ui-important-note-section-linked');
    }
    const stageBlocks = buildGameUiImportantNoteStageBlocks(lines);
    if (stageBlocks.length >= 2) {
      return `
        <section class="${sectionClasses.join(' ')}">
          <div class="game-ui-important-note-section-head">
            <div class="game-ui-important-note-section-meta">
              <span class="game-ui-important-note-section-step">الخطوة ${index + 1}</span>
              ${meta.badge ? `<span class="game-ui-important-note-section-badge">${escapeHtml(meta.badge)}</span>` : ''}
            </div>
            <h3>${escapeHtml(title)}</h3>
            ${meta.intro ? `<p>${escapeHtml(meta.intro)}</p>` : ''}
          </div>
          <div class="game-ui-important-note-stage-flow">
            ${stageBlocks.map((block, index) => `
              <div class="game-ui-important-note-stage-block">
                <div class="game-ui-important-note-stage-badge">${escapeHtml(block.badge)}</div>
                <div class="game-ui-important-note-stage-card">
                  <h4>${escapeHtml(block.title)}</h4>
                  ${renderGameUiImportantNoteLineContent(block.lines, item, {sectionTitle: title})}
                </div>
              </div>
              ${index < stageBlocks.length - 1 ? '<div class="game-ui-important-note-stage-arrow" aria-hidden="true">↓</div>' : ''}
            `).join('')}
          </div>
        </section>
      `;
    }

    const numberedBlocks = buildGameUiImportantNoteNumberedBlocks(lines);
    if (numberedBlocks.length >= 2) {
      return `
        <section class="${sectionClasses.join(' ')}">
          <div class="game-ui-important-note-section-head">
            <div class="game-ui-important-note-section-meta">
              <span class="game-ui-important-note-section-step">الخطوة ${index + 1}</span>
              ${meta.badge ? `<span class="game-ui-important-note-section-badge">${escapeHtml(meta.badge)}</span>` : ''}
            </div>
            <h3>${escapeHtml(title)}</h3>
            ${meta.intro ? `<p>${escapeHtml(meta.intro)}</p>` : ''}
          </div>
          <div class="game-ui-important-note-block-list">
            ${numberedBlocks.map((block) => `
              <div class="game-ui-important-note-block-card">
                <div class="game-ui-important-note-block-index">${escapeHtml(block.index)}</div>
                <div class="game-ui-important-note-block-body">
                  <h4>${escapeHtml(block.title)}</h4>
                  ${renderGameUiImportantNoteLineContent(block.lines, item, {sectionTitle: title})}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    return `
      <section class="${sectionClasses.join(' ')}">
        <div class="game-ui-important-note-section-head">
          <div class="game-ui-important-note-section-meta">
            <span class="game-ui-important-note-section-step">الخطوة ${index + 1}</span>
            ${meta.badge ? `<span class="game-ui-important-note-section-badge">${escapeHtml(meta.badge)}</span>` : ''}
          </div>
          <h3>${escapeHtml(title)}</h3>
          ${meta.intro ? `<p>${escapeHtml(meta.intro)}</p>` : ''}
        </div>
        ${renderGameUiImportantNoteLineContent(lines, item, {sectionTitle: title})}
      </section>
    `;
  }

  function renderGameUiImportantNoteCard(item) {
    const rawNote = String(item?.usageExample?.importantNote || '').trim();
    if (!rawNote) {
      return '';
    }

    const sections = splitGameUiImportantNoteSections(rawNote);
    const bodyHtml = sections.length
      ? sections.map((section, index) => renderGameUiImportantNoteSection(section, item, index, sections.length)).join('')
      : renderGameUiImportantNoteLineContent(rawNote.split('\n'), item, {sectionTitle: 'ملاحظة مهمة'});

    return `
      <div class="content-card prose-card game-ui-important-note-card">
        <div class="game-ui-important-note-card-head">
          <h2>ملاحظة مهمة</h2>
          <p>حُولت هذه الملاحظة إلى بلوكات أوضح حتى ترى بنية المثال والملفات والمراحل كسلسلة عملية بدل نص طويل متصل.</p>
        </div>
        <div class="game-ui-important-note-stack">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  function renderGameUiRepresentationCard(item) {
    const representation = item?.guiRepresentation;
    if (!representation) {
      return '';
    }

    const mockupTitle = escapeHtml(representation.title || 'المعاينة النصية');
    const visualPanelHtml = representation.visualHtml
      ? `
        <div class="game-ui-representation-card-visual">
          <div class="game-ui-representation-card-visual-stage">
            ${representation.visualHtml}
          </div>
        </div>
      `
      : representation.mockup
        ? `<pre class="code-block game-ui-representation-card-mockup" style="white-space:pre-wrap;"><code>${escapeHtml(representation.mockup)}</code></pre>`
        : `<div class="game-ui-representation-card-empty">لا توجد معاينة مرئية إضافية لهذا العنصر.</div>`;
    const detailsPanelHtml = [
      `<h3>${mockupTitle}</h3>`,
      representation.explanation ? `<p>${renderGameUiDocText(representation.explanation, {item})}</p>` : '',
      representation.mockup && representation.visualHtml
        ? `<pre class="code-block game-ui-representation-card-mockup" style="white-space:pre-wrap;"><code>${escapeHtml(representation.mockup)}</code></pre>`
        : ''
    ].filter(Boolean).join('');

    return `
      <div class="content-card prose-card game-ui-representation-card">
        <h2>التمثيل البصري</h2>
        <div class="game-ui-representation-card-split">
          <div class="game-ui-representation-card-panel game-ui-representation-card-panel-visual">
            ${visualPanelHtml}
          </div>
          <div class="game-ui-representation-card-panel game-ui-representation-card-panel-details">
            ${detailsPanelHtml || '<div class="game-ui-representation-card-empty">لا توجد ملاحظات إضافية لهذا التمثيل.</div>'}
          </div>
        </div>
      </div>
    `;
  }

  function renderGameUiExampleOverviewSection(item) {
    const summaryCard = renderGameUiExampleSummaryCard(item);
    const representationCard = renderGameUiRepresentationCard(item);
    const importantNoteCard = renderGameUiImportantNoteCard(item);

    if (!summaryCard && !representationCard && !importantNoteCard) {
      return '';
    }

    return `
      <section class="info-section">
        ${(summaryCard || representationCard) ? `
          <div class="game-ui-example-overview-grid">
            ${summaryCard}
            ${representationCard}
          </div>
        ` : ''}
        ${importantNoteCard}
      </section>
    `;
  }

  const api = {
    buildGameUiReferenceTooltip,
    getAllGameUiReferenceItems,
    getGameUiExampleItem,
    getGameUiItemKindLabel,
    getGameUiKindIcon,
    getGameUiReferenceItem,
    getGameUiReferenceSectionId,
    getGameUiSectionIcon,
    getGroupedGameUiExampleItems,
    getGameUiHomeSections,
    parseGameUiReferenceSectionId,
    populateGameUiList,
    rememberGameUiReferenceSectionState,
    rememberGameUiReferenceSectionStateById,
    renderGameUiCodeBlock,
    renderGameUiDetailsList,
    renderGameUiDocText,
    renderGameUiExampleOverviewSection,
    renderGameUiExampleSummaryCard,
    renderGameUiGroupedIndexSection,
    renderGameUiHomeHeroPreview,
    renderGameUiIndexCardPreview,
    renderGameUiItemHeroPreview,
    renderGameUiParametersTable,
    renderGameUiRelatedLink,
    renderGameUiRelatedSection,
    renderGameUiRepresentationCard,
    toggleGameUiExampleGroup,
    toggleGameUiReferenceSection
  };

  Object.assign(window, api);
  return Object.freeze(api);
})();
