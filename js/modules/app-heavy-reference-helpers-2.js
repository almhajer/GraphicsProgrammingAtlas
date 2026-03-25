// ArabicVulkan - extracted heavy global helper functions from js/app.js (phase322)

function getAllImguiReferenceItems() {
  if (imguiReferenceItemsCache) {
    return imguiReferenceItemsCache;
  }

  const items = [];
  Object.entries(imguiReferenceSections || {}).forEach(([sectionKey, section]) => {
    (section.items || []).forEach((item) => {
      items.push({
        ...item,
        sectionKey,
        sectionTitle: item.sectionTitle || section.title || sectionKey
      });
    });
  });
  imguiReferenceItemsCache = items.map((item) => enrichImguiReferenceItem(item));
  imguiReferenceItemLookupCache = new Map(items.map((item) => [item.name, item]));
  imguiReferenceItemLookupCache = new Map(imguiReferenceItemsCache.map((item) => [item.name, item]));
  return imguiReferenceItemsCache;
}

function enrichImguiReferenceItem(item) {
  if (!item || typeof item !== 'object') {
    return item;
  }

  const name = String(item.name || '').trim();
  const extra = getImguiReferenceSupplement(name);
  if (!extra) {
    return item;
  }

  return {
    ...extra,
    ...item,
    usageExample: item.usageExample || extra.usageExample,
    notes: Array.isArray(item.notes) && item.notes.length ? item.notes : (extra.notes || []),
    commonMistakes: Array.isArray(item.commonMistakes) && item.commonMistakes.length ? item.commonMistakes : (extra.commonMistakes || []),
    related: Array.isArray(item.related) && item.related.length ? item.related : (extra.related || []),
    parameters: Array.isArray(item.parameters) && item.parameters.length ? item.parameters : (extra.parameters || []),
    returns: item.returns || extra.returns || null,
    signature: item.signature || extra.signature || null,
    header: item.header || extra.header || item.header,
    headerTooltip: item.headerTooltip || extra.headerTooltip || item.headerTooltip,
    officialArabicDescription: item.officialArabicDescription || extra.officialArabicDescription,
    description: item.description || extra.description,
    realMeaning: item.realMeaning || extra.realMeaning,
    whenToUse: item.whenToUse || extra.whenToUse,
    practicalBenefit: item.practicalBenefit || extra.practicalBenefit,
    misuseImpact: item.misuseImpact || extra.misuseImpact
  };
}

function buildImguiGenericFunctionSupplement({
  name,
  signature,
  scenario,
  code,
  explanation,
  expectedResult,
  importantNote,
  realMeaning,
  whenToUse,
  practicalBenefit,
  misuseImpact,
  notes = [],
  commonMistakes = [],
  related = [],
  parameters = [],
  returns = ''
}) {
  return {
    header: 'imgui.h',
    headerTooltip: 'ملف الترويسة العام الذي يعرّف دوال Dear ImGui وأنواعها الأساسية داخل التطبيق.',
    officialArabicDescription: explanation,
    description: explanation,
    realMeaning,
    whenToUse,
    practicalBenefit,
    misuseImpact,
    notes,
    commonMistakes,
    related,
    parameters,
    signature: normalizeImguiSupplementSignature(signature),
    returns: returns ? {meaning: returns} : null,
    usageExample: {
      scenario,
      code,
      explanation,
      expectedResult,
      importantNote
    }
  };
}

function normalizeImguiSupplementSignature(signature) {
  if (!signature) {
    return null;
  }
  if (typeof signature === 'object') {
    return signature;
  }

  const raw = String(signature || '').trim().replace(/;$/, '');
  const match = raw.match(/^(.+?)\s+([A-Za-z_][A-Za-z0-9_:]*)\((.*)\)$/);
  if (!match) {
    return null;
  }

  const returnType = match[1].trim();
  const name = match[2].trim();
  const paramsRaw = match[3].trim();
  const params = !paramsRaw || paramsRaw === 'void'
    ? []
    : splitFunctionSignatureParams(paramsRaw).map((entry, index) => parseFunctionSignatureParam(entry, index));

  return {
    returnType,
    name,
    params
  };
}

function splitFunctionSignatureParams(paramsRaw = '') {
  const parts = [];
  let current = '';
  let depth = 0;
  for (const char of String(paramsRaw || '')) {
    if (char === '<' || char === '(' || char === '[') depth += 1;
    if (char === '>' || char === ')' || char === ']') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    parts.push(current.trim());
  }
  return parts;
}

function parseFunctionSignatureParam(paramText = '', index = 0) {
  const cleaned = String(paramText || '').trim();
  const defaultIndex = cleaned.indexOf('=');
  const withoutDefault = defaultIndex >= 0 ? cleaned.slice(0, defaultIndex).trim() : cleaned;
  const defaultValue = defaultIndex >= 0 ? cleaned.slice(defaultIndex + 1).trim() : '';
  const match = withoutDefault.match(/^(.*\S)\s+([A-Za-z_][A-Za-z0-9_]*)$/);
  const type = match ? match[1].trim() : withoutDefault;
  const name = match ? match[2].trim() : `param${index + 1}`;
  return {
    type,
    name,
    description: '',
    defaultValue
  };
}


function getImguiReferenceItem(rawName) {
  const name = String(rawName || '').trim();
  if (!name) {
    return null;
  }
  if (!imguiReferenceItemLookupCache) {
    getAllImguiReferenceItems();
  }
  return imguiReferenceItemLookupCache?.get(name) || null;
}

function getImguiReferenceSectionId(sectionKey) {
  return `imgui-${String(sectionKey || 'reference')}-list`;
}

function parseImguiReferenceSectionId(sectionId) {
  const match = /^imgui-([a-z0-9_]+)-list$/i.exec(String(sectionId || '').trim());
  if (!match) {
    return null;
  }

  return {
    sectionKey: match[1]
  };
}

function rememberImguiReferenceSectionState(sectionKey, isExpanded) {
  const key = String(sectionKey || '').trim();
  if (!key) {
    return;
  }

  if (isExpanded) {
    imguiExpandedReferenceSections.add(key);
  } else {
    imguiExpandedReferenceSections.delete(key);
  }
}

function rememberImguiReferenceSectionStateById(sectionId, isExpanded) {
  const parsed = parseImguiReferenceSectionId(sectionId);
  if (!parsed) {
    return;
  }

  rememberImguiReferenceSectionState(parsed.sectionKey, isExpanded);
}

function buildImguiStandaloneExampleItemFromSource(sourceLibrary = '', sourcePackageKey = '', sourceExample = null) {
  if (!sourceExample) {
    return null;
  }

  const normalizedSourceLibrary = String(sourceLibrary || '').trim();
  const packageInfo = normalizedSourceLibrary === 'sdl3'
    ? getSdl3PackageInfo(sourcePackageKey || sourceExample.packageKey || 'core')
    : null;
  const originLabel = normalizedSourceLibrary === 'vulkan'
    ? 'أمثلة فولكان'
    : packageInfo?.displayName || 'SDL3';
  const originReason = normalizedSourceLibrary === 'vulkan'
    ? 'نُقل هذا المثال إلى قسم Dear ImGui لأن Dear ImGui هي الواجهة الأساسية التي يبنيها المثال فوق طبقة الرسم الخلفية.'
    : 'نُقل هذا المثال إلى قسم Dear ImGui لأن واجهة Dear ImGui هي محور المثال الحقيقي، بينما تبقى SDL3 أو SDL3_mixer طبقة التشغيل والخدمات المساندة.';
  const importantNote = normalizedSourceLibrary === 'vulkan'
    ? 'يبقى Vulkan هنا طبقة الرسم الخلفية، لكن الفكرة التعليمية الرئيسية في هذا المثال هي بناء أدوات Dear ImGui وتحديثها داخل الإطار.'
    : 'يبقى دور SDL3 أو SDL3_mixer في هذا المثال مهمًا، لكن جوهر الشرح هنا هو واجهة Dear ImGui وكيف تبني اللوحات والعناصر التفاعلية فوق التطبيق.';

  return {
    name: sourceExample.title,
    displayName: sourceExample.title,
    kind: 'example',
    sectionKey: 'integrations',
    sectionTitle: 'التكاملات وBackends',
    sourceLibrary: normalizedSourceLibrary,
    sourcePackageKey: sourcePackageKey || sourceExample.packageKey || '',
    sourceExampleId: sourceExample.id,
    shortTooltip: originReason,
    description: sourceExample.goal || originReason,
    related: sourceExample.related || [],
    usageExample: {
      scenario: `${sourceExample.goal || ''} ${originReason}`.trim(),
      explanation: (sourceExample.highlights || []).join(' '),
      expectedResult: sourceExample.expectedResult || '',
      importantNote,
      fullCode: sourceExample.code || '',
      gui: {
        title: sourceExample.previewTitle || sourceExample.title,
        explanation: sourceExample.expectedResult || originReason,
        mockup: ''
      }
    },
    originLabel,
    originReason
  };
}

function getImguiStandaloneExampleItems() {
  if (imguiStandaloneExampleItemsCache) {
    return imguiStandaloneExampleItemsCache;
  }

  const items = [
    ...VULKAN_TO_IMGUI_EXAMPLE_IDS.map((exampleId) => (
      buildImguiStandaloneExampleItemFromSource('vulkan', '', getRawVulkanCatalogExampleById(exampleId))
    )),
    ...SDL3_TO_IMGUI_EXAMPLE_SPECS.map((entry) => (
      buildImguiStandaloneExampleItemFromSource(
        'sdl3',
        entry.packageKey,
        getRawSdl3CatalogExampleById(entry.packageKey, entry.id)
      )
    ))
  ].filter(Boolean);

  imguiStandaloneExampleItemsCache = items;
  imguiStandaloneExampleItemLookupCache = new Map(items.map((item) => [item.name, item]));
  return items;
}

function getImguiStandaloneExampleItem(rawName = '') {
  const name = String(rawName || '').trim();
  if (!name) {
    return null;
  }

  if (!imguiStandaloneExampleItemLookupCache) {
    getImguiStandaloneExampleItems();
  }

  return imguiStandaloneExampleItemLookupCache?.get(name) || null;
}

function getImguiExampleItem(rawName = '') {
  return getImguiReferenceItem(rawName) || getImguiStandaloneExampleItem(rawName);
}

const getImguiHomeSections = (...args) => imguiSectionRuntime?.getImguiHomeSections?.(...args) || [];

function buildImguiReferenceTooltip(item) {
  if (!item) {
    return composeSemanticTooltip({
      title: 'Dear ImGui',
      kindLabel: 'عنصر Dear ImGui',
      typeLabel: 'مرجع محلي',
      library: 'Dear ImGui',
      meaning: 'يمثل رمزاً أو بنية أو دالة من واجهة Dear ImGui داخل المشروع.',
      whyExists: 'وُجد حتى يربط القراءة السريعة بالمعنى البرمجي الحقيقي للعنصر.',
      whyUse: 'يفيد عندما تحتاج فهم دور العنصر قبل فتح صفحته أو استعماله داخل المثال.',
      actualUsage: 'يظهر في الروابط الجانبية والروابط الداخلية وبطاقات الشرح.'
    });
  }
  const kindMeta = getImguiKindMeta(item.kind);
  return composeSemanticTooltip({
    title: item.name,
    kindLabel: 'عنصر Dear ImGui',
    typeLabel: kindMeta.label || item.kind || 'عنصر واجهة',
    library: 'Dear ImGui',
    meaning: item.description || item.officialArabicDescription || item.shortTooltip || '',
    whyExists: item.officialArabicDescription || `وُجد ${item.name} لأنه يؤدي دوراً عملياً داخل بناء الواجهة الفورية لا يمكن استبداله بوصف اسمي فقط.`,
    whyUse: item.practicalBenefit || item.usageExample?.scenario || item.shortTooltip || '',
    actualUsage: item.usageExample?.explanation || item.usageExample?.scenario || item.description || ''
  });
}

function buildImguiSectionSidebarTooltip(sectionKey, section = {}) {
  const count = Array.isArray(section.items) ? section.items.length : 0;
  const lines = [
    section.title || 'قسم Dear ImGui',
    `عدد العناصر: ${count}`
  ];

  if (sectionKey === 'windows') {
    lines.push('يجمع النوافذ والنطاقات التي يبدأ بها بناء واجهات Dear ImGui داخل الإطار.');
  } else if (sectionKey === 'widgets') {
    lines.push('يركز على العناصر التفاعلية مثل الأزرار وحقول الإدخال والمنزلقات ومكوّنات التحكم المباشرة.');
  } else if (sectionKey === 'layout') {
    lines.push('يوضح عناصر توزيع المسافات والمحاذاة وبناء التخطيط داخل النوافذ.');
  } else if (sectionKey === 'types' || sectionKey === 'flags') {
    lines.push('هذا الفرع يجمع الأنواع والأعلام التي تحدد سلوك Dear ImGui وحالته الداخلية.');
  } else if (sectionKey === 'integrations' || sectionKey === 'headers') {
    lines.push('هذا الفرع يشرح ملفات الترويسة ومسارات التكامل وطبقات الربط الخلفية مع التطبيق.');
  } else {
    lines.push('يفتح هذا المسار قسمًا منظمًا من مرجع Dear ImGui المحلي داخل المشروع.');
  }

  return lines.filter(Boolean).join('\n');
}

function renderImguiSectionNavItems(sectionKey, section = {}) {
  const sectionTitle = section.title || 'قسم Dear ImGui';
  const tooltip = buildImguiSectionSidebarTooltip(sectionKey, section);
  const sectionIcon = getImguiSectionIcon(sectionKey);
  const itemsHtml = (section.items || []).map((item) => {
    const itemTooltip = buildImguiReferenceTooltip(item);
    return `
      <div class="nav-item" data-nav-type="imgui" data-nav-name="${escapeAttribute(item.name)}" data-tooltip="${escapeAttribute(itemTooltip)}" aria-label="${escapeAttribute(`${item.name}: ${itemTooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
        <span>${renderEntityIcon(getImguiKindMeta(item.kind).icon, 'ui-codicon nav-icon', item.name)}</span>
        <span>${escapeHtml(item.name)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="nav-item" data-nav-type="imgui-section-index" data-nav-name="${escapeAttribute(sectionKey)}" data-tooltip="${escapeAttribute(tooltip)}" aria-label="${escapeAttribute(`${sectionTitle}: ${tooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button">
      <span>${renderEntityIcon(sectionIcon, 'ui-codicon nav-icon', sectionTitle)}</span>
      <span>فهرس ${escapeHtml(sectionTitle)}</span>
    </div>
    ${itemsHtml || `<div class="nav-item">لا توجد عناصر في ${escapeHtml(sectionTitle)}</div>`}
  `;
}

function toggleImguiReferenceSection(sectionKey, sectionId = getImguiReferenceSectionId(sectionKey)) {
  const section = document.getElementById(sectionId);
  const parentSection = section?.closest('.nav-section');
  const cluster = parentSection?.closest('.nav-cluster') || document.getElementById('imgui-cluster');

  if (!parentSection) {
    return;
  }

  if (!parentSection.classList.contains('collapsed')) {
    collapseAllSidebarSections();
    collapseAllSidebarNavGroups();
    rememberImguiReferenceSectionState(sectionKey, false);
    return;
  }

  if (cluster) {
    collapseAllSidebarClusters(cluster.id || '');
    cluster.classList.remove('collapsed');
  }

  collapseAllSidebarSections(parentSection);
  collapseAllSidebarNavGroups();
  parentSection.classList.remove('collapsed');
  rememberImguiReferenceSectionState(sectionKey, true);
}

function normalizeImguiTypeLookup(rawType = '') {
  return String(rawType || '')
    .replace(/\bconst\b/g, '')
    .replace(/[&*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getImguiItemIconType(item = null) {
  return item ? getImguiKindMeta(item.kind).icon : '';
}

function getImguiStaticTokenIconType(text = '') {
  const token = String(text || '').trim();
  if (!token) {
    return '';
  }

  if (/^ImGui::[A-Za-z0-9_]+$/.test(token) || /^ImGui_Impl[A-Za-z0-9_]+$/.test(token)) {
    return 'command';
  }

  if (token === 'nullptr' || token === 'true' || token === 'false') {
    return 'constant';
  }

  if (/^(?:const\s+)?(?:char|bool|float|double|int|size_t)[*&\s]*$/.test(token)) {
    return 'variable';
  }

  if (/^ImGui[A-Za-z0-9_]*Flags(?:_[A-Za-z0-9_]+)?$/.test(token)) {
    return token.includes('_') ? 'constant' : 'enum';
  }

  if (/^ImVec[24](?:\s*[(*].*)?$/.test(token) || /^(?:ImDraw(?:Data|List)|ImGui[A-Z][A-Za-z0-9_]+)$/.test(token)) {
    return 'structure';
  }

  if (/^[A-Z][A-Z0-9_]+$/.test(token)) {
    return 'constant';
  }

  return '';
}

function getImguiStaticReferenceHref(name = '') {
  const token = String(name || '').trim();
  if (!token) {
    return '';
  }

  const searchBase = 'https://github.com/ocornut/imgui/search?q=';
  return `${searchBase}${encodeURIComponent(token)}`;
}

function buildImguiStaticReferenceTooltip(name = '', note = '', iconType = '') {
  const token = String(name || '').trim();
  const meaning = String(note || token).trim();
  const resolvedIconType = iconType || getImguiStaticTokenIconType(token);
  const kindLabelByIcon = {
    command: 'استدعاء Dear ImGui',
    structure: 'بنية Dear ImGui',
    enum: 'تعداد Dear ImGui',
    constant: 'ثابت Dear ImGui',
    variable: 'نوع/قيمة مساعدة'
  };
  const typeLabelByIcon = {
    command: 'رمز موثق خارجيًا فقط',
    structure: 'بنية أو نوع من واجهة Dear ImGui',
    enum: 'تعداد أو أعلام واجهة',
    constant: 'قيمة ثابتة أو علم مفرد',
    variable: 'نوع بدائي أو وسيط'
  };

  return composeSemanticTooltip({
    title: token,
    kindLabel: kindLabelByIcon[resolvedIconType] || 'عنصر Dear ImGui',
    typeLabel: typeLabelByIcon[resolvedIconType] || 'مرجع مرتبط',
    library: 'Dear ImGui',
    meaning,
    whyExists: 'يظهر هنا لأن هذا العنصر مرتبط بالعنصر الحالي، لكن المشروع لا يملك له صفحة محلية مستقلة بعد.',
    whyUse: 'يفيد لمعرفة دوره العملي بسرعة ثم الانتقال إلى المرجع الرسمي عند الحاجة.',
    actualUsage: 'يظهر في العناصر المرتبطة والنصوص والكود كوصلة مرجعية احتياطية إلى المصدر الرسمي.'
  });
}

function renderImguiStaticCodeToken(text, tooltip = '', className = 'code-token code-link-static', wrapCode = true, iconType = '') {
  const label = String(text || '').trim();
  const note = String(tooltip || label).trim();
  const aria = `${label}: ${note}`.replace(/\n/g, ' - ');
  const resolvedIconType = iconType || getImguiStaticTokenIconType(label);
  const resolvedClassName = resolvedIconType && !/\bentity-link-with-icon\b/.test(className)
    ? `${className} entity-link-with-icon`
    : className;
  const content = resolvedIconType
    ? safeRenderEntityLabel(label, resolvedIconType, {code: true, wrapInCode: wrapCode})
    : (wrapCode ? `<code dir="ltr">${escapeHtml(label)}</code>` : escapeHtml(label));
  return `<span class="${escapeAttribute(resolvedClassName)}" data-tooltip="${escapeAttribute(note)}" tabindex="0" aria-label="${escapeAttribute(aria)}">${content}</span>`;
}

function renderImguiEntityLink(name, label = '', options = {}) {
  const item = getImguiReferenceItem(name);
  const text = String(label || name || '').trim();
  const staticIconType = getImguiStaticTokenIconType(text) || getImguiStaticTokenIconType(name);
  const resolvedIconType = options.iconType || getImguiItemIconType(item) || staticIconType;
  const baseClassName = options.className || 'related-link code-token';
  const className = resolvedIconType && !/\bentity-link-with-icon\b/.test(baseClassName)
    ? `${baseClassName} entity-link-with-icon`
    : baseClassName;
  const staticTooltip = imguiStaticTooltips[text] || imguiStaticTooltips[name] || '';
  const tooltip = String(options.tooltip || (item
    ? buildImguiReferenceTooltip(item)
    : buildImguiStaticReferenceTooltip(text || name, staticTooltip || text || name, resolvedIconType))).trim();
  const content = resolvedIconType
    ? safeRenderEntityLabel(text, resolvedIconType, {code: true, wrapInCode: options.code !== false})
    : (options.code === false ? escapeHtml(text) : `<code dir="ltr">${escapeHtml(text)}</code>`);
  const aria = `${text}: ${tooltip}`.replace(/\n/g, ' - ');

  if (!item) {
    const href = getImguiStaticReferenceHref(text || name);
    if (href) {
      return `<a href="${escapeAttribute(href)}" class="${escapeAttribute(className)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
    return `<span class="${escapeAttribute(`${className} code-link-static`)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}">${content}</span>`;
  }

  return `<a href="#" class="${escapeAttribute(className)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}" onclick="showImguiReference('${escapeAttribute(item.name)}'); return false;">${content}</a>`;
}

function renderImguiHeaderLink(header = '') {
  return renderImguiEntityLink(header || imguiMeta.defaultHeader || 'imgui.h', `#include <${header || imguiMeta.defaultHeader || 'imgui.h'}>`, {
    className: 'doc-link code-token',
    tooltip: imguiMeta.defaultHeaderTooltip || getAppTextValue('IMGUI_HOME_FALLBACK_META')?.description
  });
}

function renderImguiDocText(text = '') {
  const raw = String(text || '');
  if (!raw) {
    return '';
  }

  let html = escapeHtml(raw);
  const tokenDescriptors = [
    ...getAllImguiReferenceItems().map((item) => ({token: item.name, item})),
    ...Object.entries(imguiStaticTooltips).map(([token, tooltip]) => ({token, tooltip}))
  ].sort((a, b) => b.token.length - a.token.length);

  if (tokenDescriptors.length) {
    const regex = new RegExp(`(${tokenDescriptors.map((entry) => escapeRegexText(entry.token)).join('|')})`, 'g');
    html = html.replace(regex, (match) => {
      const descriptor = tokenDescriptors.find((entry) => entry.token === match);
      if (!descriptor) {
        return match;
      }
      if (descriptor.item) {
        return renderImguiEntityLink(match);
      }
      return renderImguiStaticCodeToken(match, descriptor.tooltip);
    });
  }

  return html.replace(/\n/g, '<br>');
}

function renderImguiTypeToken(rawType = '') {
  const label = String(rawType || '').trim();
  if (!label) {
    return '';
  }

  const lookup = normalizeImguiTypeLookup(label);
  const item = getImguiReferenceItem(lookup);
  if (item) {
    return renderImguiEntityLink(item.name, label, {className: 'code-token code-link', iconType: getImguiItemIconType(item)});
  }

  return renderImguiStaticCodeToken(
    label,
    imguiStaticTooltips[label] || imguiStaticTooltips[lookup] || `نوع يمرر إلى Dear ImGui في هذا الموضع: ${label}.`,
    'code-token code-link-static',
    true,
    getImguiStaticTokenIconType(label) || getImguiStaticTokenIconType(lookup)
  );
}

function buildImguiParameterTooltip(param, item) {
  const resolved = resolveImguiParameterDoc(item, param);
  return composeSemanticTooltip({
    title: resolved.name,
    kindLabel: 'معامل Dear ImGui',
    typeLabel: resolved.type || 'معامل',
    library: 'Dear ImGui',
    meaning: resolved.realRole || resolved.officialArabicDescription || '',
    whyExists: resolved.whyPassed || `وُجد هذا المعامل لأن ${item?.name || 'الاستدعاء'} لا يستطيع استنتاج هذه القيمة ضمنياً.`,
    whyUse: resolved.whenToUse || resolved.whyPassed || '',
    actualUsage: resolved.actualUsage || (item?.name ? `يظهر داخل استدعاء ${item.name} عند بناء أو تحديث سلوك عنصر الواجهة.` : ''),
    warning: resolved.commonMistake || ''
  });
}

function renderImguiParameterName(param, item, options = {}) {
  const resolved = resolveImguiParameterDoc(item, param);
  const tooltip = buildImguiParameterTooltip(resolved, item);
  const label = resolved.name || String(param?.name || '').trim();
  const aria = `${label}: ${tooltip.replace(/\n/g, ' - ')}`;
  const content = safeRenderEntityLabel(label, 'variable', {code: true, wrapInCode: true});

  if (options.linkToDetails && item?.parameters?.some((entry) => String(entry?.name || '').trim() === label)) {
    const anchorId = buildImguiParameterAnchorId(item.name, label);
    return `<a href="#${escapeAttribute(anchorId)}" class="code-token code-link entity-link-with-icon imgui-parameter-jump-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}" onclick="scrollToAnchor('${escapeAttribute(anchorId)}'); return false;">${content}</a>`;
  }

  return `<span class="code-token code-link-static entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}">${content}</span>`;
}

function buildImguiCodeVariableTooltip(meta = {}) {
  const type = String(meta.fullType || meta.type || '').trim();
  const baseType = String(meta.baseType || type || '').trim();
  let meaning = 'متغير محلي يستخدمه المثال لحفظ حالة أو قيمة وسيطة لازمة لبناء الواجهة.';

  if (meta.isArray && /\bchar\b/.test(baseType)) {
    meaning = 'مخزن محارف محلي يحتفظ بالنص الذي يقرأه المثال أو يحرره داخل الواجهة.';
  } else if (meta.isArray && /\bfloat\b/.test(baseType)) {
    meaning = 'مصفوفة قيم عشرية محلية يستخدمها المثال كسلسلة بيانات أو كقنوات لون متجاورة.';
  } else if (/ImVec4/.test(baseType)) {
    meaning = 'متغير محلي يحمل لوناً أو قيمة رباعية تستخدمها أدوات Dear ImGui في هذا المثال.';
  } else if (/ImVec2/.test(baseType)) {
    meaning = 'متغير محلي يحمل حجماً أو موضعاً ثنائياً يستهلكه عنصر واجهة في هذا المثال.';
  } else if (/\bbool\b/.test(baseType)) {
    meaning = 'متغير منطقي محلي يحتفظ بحالة واجهة أو خيار يتغير مع التفاعل.';
  } else if (/\bint\b/.test(baseType)) {
    meaning = 'متغير صحيح محلي يحتفظ بعداد أو فهرس أو اختيار عددي يعتمد عليه المثال.';
  } else if (/\bfloat\b/.test(baseType)) {
    meaning = 'متغير عشري محلي يحتفظ بالقيمة القابلة للتعديل أو العرض في هذا المثال.';
  } else if (/const char\*/.test(type)) {
    meaning = 'مؤشر نصي محلي يحمل تسمية أو قيمة وصفية يستخدمها المثال في العرض الحالي.';
  }

  return composeSemanticTooltip({
    title: meta.name || 'متغير محلي',
    kindLabel: 'متغير مثال ImGui',
    typeLabel: type || 'متغير محلي',
    library: 'Dear ImGui',
    meaning,
    whyExists: 'وُجد حتى يحتفظ المثال بالحالة التي تقرأها عناصر الواجهة أو تعدلها بين أو أثناء الإطارات.',
    whyUse: meta.isStatic
      ? 'يستخدمه المبرمج هنا مع static لأن قيمة الواجهة يجب أن تبقى بين الإطارات لا أن تعاد تهيئتها كل frame.'
      : 'يستخدمه المبرمج للاحتفاظ بالقيمة أو الحالة التي تحتاجها أدوات الواجهة في هذا الموضع.',
    actualUsage: meta.isStatic
      ? 'يظهر كحالة محلية ثابتة تُقرأ وتُحدَّث كل إطار مع بقاء قيمتها السابقة محفوظة.'
      : 'يظهر كمتغير محلي يمر إلى widget أو يقرأ منها خلال رسم الإطار الحالي.'
  });
}

function extractImguiCodeVariableDocs(source = '') {
  const docs = new Map();
  String(source || '').split('\n').forEach((line) => {
    const match = line.match(/^\s*(static\s+)?((?:const\s+)?[A-Za-z_][A-Za-z0-9_:<>]*)(\s*[&*]+)?\s+([A-Za-z_][A-Za-z0-9_]*)\s*(\[[^\]]*\])?/);
    if (!match) {
      return;
    }

    const isStatic = Boolean(match[1]);
    const baseType = String(match[2] || '').trim();
    const suffix = String(match[3] || '').replace(/\s+/g, '');
    const name = String(match[4] || '').trim();
    const arraySuffix = String(match[5] || '').trim();
    if (!name) {
      return;
    }

    const fullType = `${baseType}${suffix}${arraySuffix}`.trim();
    docs.set(name, {
      name,
      baseType,
      type: `${baseType}${suffix}`.trim(),
      fullType,
      isStatic,
      isArray: Boolean(arraySuffix)
    });
  });
  return Array.from(docs.values());
}

function buildImguiCodeHelperFunctionTooltip(name = '') {
  return composeSemanticTooltip({
    title: name,
    kindLabel: 'دالة محلية',
    typeLabel: 'مساعد تطبيق',
    library: 'Dear ImGui + App Code',
    meaning: 'ليست جزءاً من Dear ImGui نفسها، بل دالة منطق محلي يناديها المثال حول الواجهة أو بعدها.',
    whyExists: 'وُجدت لأن مثال الواجهة لا يكتفي برسم widget؛ بل يحتاج منطق التطبيق الذي يقرأ الحالة أو يستجيب لها.',
    whyUse: 'يستخدمها المبرمج لفصل منطق التطبيق عن استدعاءات Dear ImGui المباشرة مع إبقاء المثال قابلاً للفهم.',
    actualUsage: 'تظهر بجوار كود الواجهة عندما يطلق widget فعلاً أو يحدّث حالة تحتاج منطقاً إضافياً.'
  });
}

function shouldRenderGenericImguiCodeReference(token = '') {
  const value = String(token || '').trim();
  if (!value) {
    return false;
  }

  return /^ImGui::[A-Za-z0-9_]+$/.test(value)
    || /^ImGui_Impl[A-Za-z0-9_]+$/.test(value)
    || /^ImDraw(?:List|Data)$/.test(value)
    || /^ImGui[A-Za-z0-9_]*Flags(?:_[A-Za-z0-9_]+)?$/.test(value)
    || /^ImGui[A-Z][A-Za-z0-9_]+$/.test(value)
    || /^ImGui[A-Z][A-Za-z0-9_]*_[A-Za-z0-9_]+$/.test(value);
}

function extractImguiCodeHelperFunctions(source = '') {
  const helperNames = new Set();
  const keywords = new Set(['if', 'for', 'while', 'switch', 'return', 'sizeof']);
  const raw = String(source || '');
  const regex = /\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    const name = String(match[1] || '').trim();
    const index = match.index;
    const prefix = raw.slice(Math.max(0, index - 2), index);
    if (!name || keywords.has(name) || prefix === '::' || getImguiReferenceItem(name) || imguiStaticTooltips[name]) {
      continue;
    }
    helperNames.add(name);
  }

  return Array.from(helperNames);
}

function renderImguiLinkedCode(source = '') {
  const raw = String(source || '');
  let renderedSource = raw;
  const placeholders = [];
  const stashHtml = (html) => {
    const marker = `¤IMGUI${placeholders.length}¤`;
    placeholders.push(html);
    return marker;
  };
  const tokenDescriptors = [
    ...getAllImguiReferenceItems().map((item) => ({token: item.name, item})),
    ...Object.entries(imguiStaticTooltips).map(([token, tooltip]) => ({token, tooltip}))
  ].sort((a, b) => b.token.length - a.token.length);

  if (!tokenDescriptors.length) {
    return escapeHtml(raw);
  }

  const regex = new RegExp(`(${tokenDescriptors.map((entry) => escapeRegexText(entry.token)).join('|')})`, 'g');
  renderedSource = renderedSource.replace(regex, (match) => {
    const descriptor = tokenDescriptors.find((entry) => entry.token === match);
    if (!descriptor) {
      return match;
    }
    if (descriptor.item) {
      return stashHtml(renderImguiEntityLink(descriptor.item.name, match, {
        className: 'code-token code-link entity-link-with-icon',
        code: false,
        iconType: getImguiItemIconType(descriptor.item)
      }));
    }
    return stashHtml(renderImguiStaticCodeToken(
      match,
      descriptor.tooltip,
      'code-token code-link-static',
      false,
      getImguiStaticTokenIconType(match)
    ));
  });

  const variableDocs = extractImguiCodeVariableDocs(raw).sort((a, b) => b.name.length - a.name.length);
  if (variableDocs.length) {
    const variableMap = new Map(variableDocs.map((entry) => [entry.name, entry]));
    const variableRegex = new RegExp(`\\b(${variableDocs.map((entry) => escapeRegexText(entry.name)).join('|')})\\b`, 'g');
    renderedSource = renderedSource.replace(variableRegex, (match) => {
      const descriptor = variableMap.get(match);
      if (!descriptor) {
        return match;
      }
      return stashHtml(renderImguiStaticCodeToken(
        match,
        buildImguiCodeVariableTooltip(descriptor),
        'code-token code-link-static',
        false,
        'variable'
      ));
    });
  }

  const helperFunctions = extractImguiCodeHelperFunctions(raw).sort((a, b) => b.length - a.length);
  if (helperFunctions.length) {
    const helperSet = new Set(helperFunctions);
    const helperRegex = new RegExp(`\\b(${helperFunctions.map((name) => escapeRegexText(name)).join('|')})(?=\\s*\\()`, 'g');
    renderedSource = renderedSource.replace(helperRegex, (match) => helperSet.has(match) ? stashHtml(renderImguiStaticCodeToken(
      match,
      buildImguiCodeHelperFunctionTooltip(match),
      'code-token code-link-static',
      false,
      'command'
    )) : match);
  }

  const genericImguiTokens = Array.from(new Set(
    (raw.match(/\b(?:ImGui::[A-Za-z0-9_]+|ImGui_Impl[A-Za-z0-9_]+|ImDraw(?:List|Data)|ImGui[A-Za-z0-9_]*Flags(?:_[A-Za-z0-9_]+)?|ImGui[A-Z][A-Za-z0-9_]*_[A-Za-z0-9_]+|ImGui[A-Z][A-Za-z0-9_]+)\b/g) || [])
      .filter((token) => shouldRenderGenericImguiCodeReference(token))
  )).sort((a, b) => b.length - a.length);
  if (genericImguiTokens.length) {
    const genericRegex = new RegExp(`\\b(${genericImguiTokens.map((token) => escapeRegexText(token)).join('|')})\\b`, 'g');
    renderedSource = renderedSource.replace(genericRegex, (match) => stashHtml(renderImguiEntityLink(match, match, {
      className: 'code-token code-link entity-link-with-icon',
      code: false,
      iconType: getImguiStaticTokenIconType(match)
    })));
  }

  const imguiCppKeywords = typeof cppKeywordTokens !== 'undefined' && cppKeywordTokens instanceof Set
    ? cppKeywordTokens
    : new Set([
      'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'return',
      'const', 'static', 'auto', 'void', 'bool', 'int', 'float', 'double', 'char',
      'struct', 'class', 'enum', 'namespace', 'using', 'true', 'false', 'nullptr'
    ]);
  const tokenRegex = /(¤IMGUI\d+¤|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b0x[a-fA-F0-9]+\b|\b\d+\.?\d*f?\b|\b[A-Za-z_][A-Za-z0-9_:.]*\b|==|!=|<=|>=|&&|\|\||<<=|>>=|<<|>>|\+\+|--|->|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|::|[+\-*/%&|^~!=<>?:;,.()[\]{}]|\s+|.)/g;
  const tokens = renderedSource.match(tokenRegex) || [];
  return tokens.map((token) => {
    const placeholderMatch = /^¤IMGUI(\d+)¤$/.exec(token);
    if (placeholderMatch) {
      return placeholders[Number(placeholderMatch[1]) || 0] || '';
    }
    if (/^\s+$/.test(token)) {
      return escapeHtml(token);
    }
    if (/^\/\/[^\n]*$/.test(token) || /^\/\*[\s\S]*\*\/$/.test(token)) {
      return `<span class="comment code-token">${escapeHtml(token)}</span>`;
    }
    if (/^"(?:\\.|[^"\\])*"$/.test(token) || /^'(?:\\.|[^'\\])*'$/.test(token)) {
      return `<span class="string code-token">${escapeHtml(token)}</span>`;
    }
    if (/^\b0x[a-fA-F0-9]+\b$/.test(token) || /^\b\d+\.?\d*f?\b$/.test(token)) {
      return `<span class="number code-token">${escapeHtml(token)}</span>`;
    }
    if (imguiCppKeywords.has(token)) {
      return `<span class="keyword code-token">${escapeHtml(token)}</span>`;
    }
    if (/^(==|!=|<=|>=|&&|\|\||<<=|>>=|<<|>>|\+\+|--|->|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|::|[+\-*/%&|^~!=<>?:;,.()[\]{}])$/.test(token)) {
      return `<span class="operator code-token">${escapeHtml(token)}</span>`;
    }
    if (/^[A-Z_][A-Z0-9_]*$/.test(token)) {
      return `<span class="variable code-token">${escapeHtml(token)}</span>`;
    }
    return escapeHtml(token);
  }).join('');
}

function renderImguiCodeBlock(title, source = '', language = 'cpp') {
  return renderDocCodeContainer({
    titleHtml: escapeHtml(title),
    rawCode: source,
    renderedCodeHtml: renderImguiLinkedCode(source),
    language,
    skipHighlight: true
  });
}

function stripImguiNestedCodeTags(html = '') {
  return String(html || '')
    .replaceAll('<code dir="ltr">', '')
    .replaceAll('</code>', '');
}

function buildImguiParameterAnchorId(itemName = '', paramName = '') {
  const normalize = (value) => String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `imgui-param-${normalize(itemName)}-${normalize(paramName)}`;
}

function resolveImguiParameterDoc(item, param = {}) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const detailed = (item?.parameters || []).find((entry) => String(entry?.name || '').trim() === name);
  const override = getImguiParameterOverride(item, name);
  if (!detailed) {
    return {
      ...(override || {}),
      ...param,
      name,
      type
    };
  }
  return {
    ...(override || {}),
    ...detailed,
    ...param,
    name: name || String(detailed.name || '').trim(),
    type: type || String(detailed.type || '').trim()
  };
}

function getImguiParameterOverride(item, parameterName = '') {
  const functionName = String(item?.name || '').trim();
  const normalizedParameterName = String(parameterName || '').trim();
  if (!functionName || !normalizedParameterName) {
    return null;
  }

  return IMGUI_PARAMETER_OVERRIDES?.[functionName]?.[normalizedParameterName] || null;
}


function renderImguiSignature(item) {
  if (item.signature) {
    const paramsHtml = (item.signature.params || []).map((param) => {
      const resolvedParam = resolveImguiParameterDoc(item, param);
      const defaultHtml = param.defaultValue ? ` = ${renderImguiStaticCodeToken(param.defaultValue, 'القيمة الافتراضية التي ستستخدمها Dear ImGui إذا لم تمرر قيمة مختلفة.', 'code-token code-link-static inline-static-token', false)}` : '';
      return `${stripImguiNestedCodeTags(renderImguiTypeToken(resolvedParam.type))} ${stripImguiNestedCodeTags(renderImguiParameterName(resolvedParam, item, {linkToDetails: true}))}${defaultHtml}`;
    }).join(', ');
    const signatureText = `${item.signature.returnType} ${item.signature.name}(${(item.signature.params || []).map((param) => `${param.type} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ''}`).join(', ')});`;
    return renderDocCodeContainer({
      titleHtml: 'التوقيع C / C++',
      rawCode: signatureText,
      renderedCodeHtml: `${stripImguiNestedCodeTags(renderImguiTypeToken(item.signature.returnType))} ${renderImguiEntityLink(item.signature.name, item.signature.name, {className: 'code-token code-link entity-link-with-icon', code: false, iconType: getImguiItemIconType(item)})}(${paramsHtml});`,
      language: 'cpp',
      skipHighlight: true,
      containerClassName: 'imgui-signature-shell'
    });
  }

  if (item.syntax) {
    return renderImguiCodeBlock('التوقيع C / C++', item.syntax);
  }

  return '';
}

function renderImguiHeaderFilesSection(item) {
  const header = item.header || imguiMeta.defaultHeader || 'imgui.h';
  return `
    <section class="info-section imgui-header-files-section">
      <div class="content-card prose-card imgui-header-files-card" dir="rtl">
        <div class="imgui-header-files-heading">
          <div>
            <h2>ملفات الترويسة</h2>
            <p class="imgui-header-files-heading-note" dir="ltr">Header Files</p>
          </div>
        </div>
        <div class="imgui-header-files-include" dir="ltr">
          ${renderImguiHeaderLink(header)}
        </div>
        <p dir="rtl">${renderImguiDocText(item.headerTooltip || imguiMeta.defaultHeaderTooltip || 'هذا هو ملف الترويسة الذي يجب تضمينه لاستخدام هذا العنصر.')}</p>
      </div>
    </section>
  `;
}

function renderImguiIntegrationRolesSection(item) {
  if (!item.integrationRoles?.length) {
    return '';
  }

  return `
    <section class="info-section">
      ${renderSdl3InfoGrid(item.integrationRoles.map((entry) => ({
        label: entry.label,
        value: renderImguiDocText(entry.value || ''),
        note: renderImguiDocText(entry.note || '')
      })))}
    </section>
  `;
}

function renderImguiBackendFilesSection(item) {
  if (!item.backendFiles?.length) {
    return '';
  }

  const links = item.backendFiles.map((entry) => {
    const name = String(entry?.name || '').trim();
    const role = String(entry?.role || '').trim();
    const tooltip = `${name}\n${role}`.trim();
    const content = `<code dir="ltr">${escapeHtml(name)}</code>`;
    const link = entry?.url
      ? `<a class="doc-link code-token" href="${escapeAttribute(entry.url)}" target="_blank" rel="noopener noreferrer" data-tooltip="${escapeAttribute(tooltip)}">${content}</a>`
      : `<span class="doc-link code-token code-link-static" data-tooltip="${escapeAttribute(tooltip)}">${content}</span>`;
    return `
      <li>
        ${link}
        <span class="imgui-inline-note">${renderImguiDocText(role)}</span>
      </li>
    `;
  }).join('');

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>ملفات الـ Backends المرتبطة</h2>
        <ul class="reference-list">
          ${links}
        </ul>
      </div>
    </section>
  `;
}

function renderImguiSetupStepsSection(item) {
  if (!item.setupSteps?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>خطوات التهيئة</h2>
        ${renderTutorialList(item.setupSteps.map((entry) => renderImguiDocText(entry)), true)}
      </div>
    </section>
  `;
}

function renderImguiCommonMistakesSection(item) {
  if (!item.commonMistakes?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>أخطاء شائعة</h2>
        ${renderTutorialList(item.commonMistakes.map((entry) => renderImguiDocText(entry)))}
      </div>
    </section>
  `;
}

function renderImguiCoreMeaningSection(item) {
  return `
    <section class="info-section">
      ${renderSdl3InfoGrid([
        {label: '1. نوع العنصر', value: escapeHtml(getImguiKindMeta(item.kind).label), note: item.kind === 'header' ? 'هذا المسار يوثق ملف الترويسة نفسه لا دالة تشغيلية.' : `هذا العنصر مصنف داخل ${escapeHtml(item.sectionTitle || '')} في مرجع Dear ImGui.`},
        {label: '2. المعنى الحقيقي', value: renderImguiDocText(item.realMeaning), note: ''},
        {label: '3. لماذا يستخدمه المبرمج', value: renderImguiDocText(item.practicalBenefit), note: ''},
        {label: '4. كيف يظهر في الاستخدام الفعلي', value: renderImguiDocText(item.whenToUse), note: ''},
        {label: '5. تنبيه', value: renderImguiDocText(item.misuseImpact), note: ''}
      ])}
    </section>
  `;
}

function renderImguiParametersSection(item) {
  if (!item.parameters?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>المعاملات</h2>
        <div class="params-card-grid imgui-parameters-card-grid">
          ${item.parameters.map((param) => `
            <article class="parameter-detail-card" id="${escapeAttribute(buildImguiParameterAnchorId(item.name, param.name))}">
              <div class="parameter-card-head">
                <div class="parameter-card-copy">
                  <div class="parameter-card-kicker">معامل ImGui</div>
                  <h3 class="parameter-card-name parameter-card-code">${renderImguiParameterName(param, item)}</h3>
                </div>
                <div class="parameter-card-type">${renderImguiTypeToken(param.type)}</div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">الوصف الرسمي بالعربية</div>
                  <div class="parameter-card-field-value">${renderImguiDocText(param.officialArabicDescription)}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">المعنى الحقيقي</div>
                  <div class="parameter-card-field-value">${renderImguiDocText(param.realRole)}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">لماذا يُمرر</div>
                  <div class="parameter-card-field-value">${renderImguiDocText(param.whyPassed)}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">كيف يظهر في الاستخدام الفعلي</div>
                  <div class="parameter-card-field-value">${renderImguiDocText(param.actualUsage)}</div>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderImguiParameterExampleSection(item) {
  if (!item.parameterExample) {
    return '';
  }
  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>مثال سريع داخل قسم المعاملات</h2>
        ${renderImguiCodeBlock('تمرير المعاملات', item.parameterExample)}
      </div>
    </section>
  `;
}

function renderImguiReturnSection(item) {
  if (!item.returns) {
    return '';
  }

  return `
    <section class="info-section">
      ${renderSdl3InfoGrid([
        {label: 'نوع الإرجاع', value: renderImguiTypeToken(item.returns.type || 'void'), note: ''},
        {label: 'المعنى الحقيقي للقيمة المعادة', value: renderImguiDocText(item.returns.meaning || ''), note: ''},
        {label: 'ماذا تعني حالة النجاح أو التفعيل', value: renderImguiDocText(item.returns.trueMeaning || ''), note: ''},
        {label: 'ماذا تعني الحالة الأخرى', value: renderImguiDocText(item.returns.falseMeaning || ''), note: ''}
      ])}
    </section>
  `;
}

function resolveImguiPracticalExample(item) {
  const usage = item?.usageExample || null;
  if (!usage?.code) {
    return null;
  }

  const gui = item?.guiRepresentation || null;
  return {
    scenario: usage.scenario || item?.whenToUse || item?.description || '',
    code: usage.code || '',
    fullCode: buildImguiCompleteExampleCode(item, usage),
    explanation: usage.explanation || item?.description || '',
    expectedResult: usage.expectedResult || item?.returns?.meaning || gui?.explanation || item?.practicalBenefit || '',
    importantNote: usage.importantNote || item?.notes?.[0] || item?.misuseImpact || item?.instructions?.[0] || '',
    gui
  };
}

function buildImguiExamplePlacementText(item) {
  const name = String(item?.name || '').trim();
  const section = String(item?.sectionKey || '').trim();

  if (name === 'ImGui::Begin') {
    return 'يوضع هذا الكود داخل دالة بناء واجهة تستدعى كل إطار بعد ImGui::NewFrame، ويبدأ نافذة Dear ImGui جديدة في الإطار الحالي ثم يبنى المحتوى بينها وبين ImGui::End.';
  }

  if (name === 'ImGui::End') {
    return 'يوضع مباشرة بعد آخر عنصر داخل النافذة نفسها، وفي الإطار نفسه الذي بدأ فيه النطاق عبر ImGui::Begin.';
  }

  if (name === 'ImGui::BeginChild') {
    return 'يوضع داخل نافذة بدأت مسبقًا عبر ImGui::Begin، لأن هذا المثال ينشئ مساحة فرعية داخل نافذة أم قائمة بالفعل.';
  }

  if (section === 'widgets' || section === 'layout') {
    return 'يوضع هذا الكود داخل دالة بناء الواجهة بعد ImGui::NewFrame، وضمن نافذة فعالة بدأت عبر ImGui::Begin وتنتهي عبر ImGui::End في الإطار نفسه.';
  }

  if (['dragdrop', 'interaction', 'movement', 'animation', 'menus', 'colors'].includes(section)) {
    return 'يوضع هذا المثال داخل دالة بناء الواجهة التي تستدعى كل إطار بعد ImGui::NewFrame. ولأن المثال يحدث الحالة بين الإطارات، يجب حفظ القيم مثل الموضع أو الشفافية أو اللون أو payload في متغيرات ثابتة أو في كائن حالة يملكه التطبيق.';
  }

  if (name === 'ImGui::OpenPopup') {
    return 'يوضع عادة داخل نافذة أو لوحة أدوات فعالة، مباشرة بعد حدث مثل ضغط زر، ثم يتبعه في المسار نفسه أو في نفس دورة الإطار استدعاء ImGui::BeginPopup بالمعرف نفسه.';
  }

  if (name === 'ImGui::BeginPopup') {
    return 'يوضع بعد منطق فتح popup مثل ImGui::OpenPopup، وداخل نفس دالة بناء الواجهة التي تستدعى كل إطار حتى تتمكن Dear ImGui من استهلاك حالة الفتح وبناء المحتوى المنبثق.';
  }

  if (name === 'ImGui::EndPopup') {
    return 'يوضع في نهاية كتلة popup نفسها بعد آخر عنصر مرئي داخلها، وفي الإطار نفسه الذي أعادت فيه ImGui::BeginPopup القيمة true.';
  }

  if (section === 'popups') {
    return 'يوضع هذا الكود داخل دالة بناء الواجهة بعد ImGui::NewFrame، وضمن نافذة أم أو سياق تفاعل يسمح ببناء popup وربطها بحدث الفتح المناسب.';
  }

  return 'يوضع هذا المثال داخل دالة بناء Dear ImGui التي تستدعى كل إطار بعد ImGui::NewFrame، ومع وجود السياق والنطاق المناسبين للعنصر الحالي.';
}

function buildImguiExampleRequirementsText(item) {
  const section = String(item?.sectionKey || '').trim();
  const pointerParams = (item?.parameters || [])
    .filter((param) => /\*/.test(String(param?.type || '')))
    .map((param) => String(param?.name || '').trim())
    .filter(Boolean);

  const parts = [
    'يتطلب المثال سياق Dear ImGui مهيأً مسبقًا، ومسار إطار صحيح يبدأ بـ ImGui::NewFrame وينتهي بـ ImGui::Render.'
  ];

  if (section === 'widgets' || section === 'layout') {
    parts.push('كما يحتاج نافذة حالية فعالة حتى يظهر العنصر داخلها بصورة صحيحة.');
  }

  if (section === 'windows') {
    parts.push('يجب موازنة النطاقات بشكل صحيح، لذلك أي Begin في المثال يحتاج End مقابلًا له في الإطار نفسه.');
  }

  if (section === 'popups') {
    parts.push('تحتاج أمثلة popup إلى نافذة أم أو موضع تفاعل مرئي، وإلى تطابق كامل بين معرف الفتح في ImGui::OpenPopup ومعرف البناء في ImGui::BeginPopup.');
  }

  if (['dragdrop', 'interaction', 'movement', 'animation', 'menus', 'colors'].includes(section)) {
    parts.push('وتحتاج هذه الأمثلة أيضاً إلى حالة تبقى صالحة بين الإطارات لأن Dear ImGui لا يقدم نظام حركة أو أنيميشن عالي المستوى، بل تقرأ الواجهة القيم التي يحدثها التطبيق في كل Frame ثم ترسم الناتج مباشرة.');
  }

  if (pointerParams.length) {
    parts.push(`والمتغيرات الممررة بالمؤشر مثل ${pointerParams.join('، ')} يجب أن تبقى صالحة وقابلة للقراءة أو الكتابة طوال الإطار الذي يبنى فيه العنصر.`);
  }

  return parts.join(' ');
}


function escapeImguiSvgText(text = '') {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeImguiMockupLine(line = '') {
  return String(line || '')
    .replace(/[┌┐└┘│─]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildImguiStackedCardRows(lines = [], options = {}) {
  const safeLines = Array.isArray(lines)
    ? lines.map((line) => normalizeImguiMockupLine(line)).filter(Boolean).slice(0, 5)
    : [];

  if (!safeLines.length) {
    return '';
  }

  const startX = options.startX || 190;
  const startY = options.startY || 176;
  const rowWidth = options.rowWidth || 560;
  const rowHeight = options.rowHeight || 46;
  const gap = options.gap || 14;
  const textX = options.textX || (startX + rowWidth - 26);

  return safeLines.map((line, index) => {
    const y = startY + (index * (rowHeight + gap));
    const fill = index === 0 ? '#15314d' : '#0d1726';
    const stroke = index === 0 ? '#5a91c9' : '#40536b';
    return `
        <rect x="${startX}" y="${y}" width="${rowWidth}" height="${rowHeight}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <text x="${textX}" y="${y + 29}" class="${index === 0 ? 'label' : 'small'}" text-anchor="end">${escapeImguiSvgText(line)}</text>
    `;
  }).join('');
}

function buildImguiMockupShotBody(mockup = '') {
  const lines = String(mockup || '')
    .split('\n')
    .map((line) => normalizeImguiMockupLine(line))
    .filter(Boolean)
    .slice(0, 5);

  if (!lines.length) {
    return '';
  }

  return buildImguiStackedCardRows(lines);
}

function normalizeImguiExampleShotSource(previewSrc, item) {
  if (typeof previewSrc === 'string') {
    return previewSrc;
  }

  if (!previewSrc || typeof previewSrc !== 'object') {
    return '';
  }

  const windowTitle = escapeImguiSvgText(String(item?.guiRepresentation?.title || item?.name || '').trim());
  const body = typeof previewSrc.body === 'string'
    ? previewSrc.body
    : buildImguiMockupShotBody(item?.guiRepresentation?.mockup || '');
  const footer = escapeImguiSvgText(String(previewSrc.footer || 'صورة توضيحية للخرج المتوقع من المثال العملي.').trim());

  if (!windowTitle || !body) {
    return '';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 520" role="img" aria-label="${windowTitle}">
      <defs>
        <linearGradient id="imguiShotBgCompat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f1722"/>
          <stop offset="100%" stop-color="#09111b"/>
        </linearGradient>
        <linearGradient id="imguiShotHeaderCompat" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d7e6f5"/>
          <stop offset="100%" stop-color="#f8fbff"/>
        </linearGradient>
      </defs>
      <style>
        .title{font:700 30px "Segoe UI",Tahoma,Arial,sans-serif;fill:#08111c}
        .label{font:600 24px "Segoe UI",Tahoma,Arial,sans-serif;fill:#eef5fc}
        .small{font:500 20px "Segoe UI",Tahoma,Arial,sans-serif;fill:#c8d6e5}
        .footer{font:500 19px "Segoe UI",Tahoma,Arial,sans-serif;fill:#9cb0c5}
        .popup-item{font:600 22px "Segoe UI",Tahoma,Arial,sans-serif;fill:#162234}
      </style>
      <rect width="920" height="520" rx="36" fill="url(#imguiShotBgCompat)"/>
      <rect x="64" y="54" width="792" height="412" rx="30" fill="#101927" stroke="#293649" stroke-width="3"/>
      <rect x="64" y="54" width="792" height="74" rx="30" fill="url(#imguiShotHeaderCompat)"/>
      <circle cx="110" cy="91" r="10" fill="#e06a62"/>
      <circle cx="142" cy="91" r="10" fill="#dca84b"/>
      <circle cx="174" cy="91" r="10" fill="#61c072"/>
      <text x="814" y="101" class="title" text-anchor="end">${windowTitle}</text>
      ${body}
      <text x="820" y="500" class="footer" text-anchor="end">${footer}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}


function renderImguiExampleScreenshot(item, example, options = {}) {
  const src = example?.gui?.screenshot;
  if (!src) {
    return '';
  }

  const alt = `صورة فعلية توضح الخرج النهائي المتوقع للعنصر ${item.name} داخل واجهة Dear ImGui.`;
  const caption = example?.gui?.explanation || 'هذه الصورة تطابق الكود المعروض وتوضح الشكل النهائي المتوقع داخل الواجهة بعد تشغيل المثال.';
  return `
    <figure class="imgui-example-shot">
      <img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" decoding="async">
      <figcaption>${renderImguiDocText(caption)}</figcaption>
    </figure>
  `;
}

function renderImguiUsageExampleSection(item, options = {}) {
  const example = resolveImguiPracticalExample(item);
  if (!example) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>مثال عملي</h2>
        ${renderSdl3InfoGrid([
          {label: 'سيناريو الاستخدام', value: renderImguiDocText(example.scenario || ''), note: 'يوضح هذا الجزء متى ولماذا يظهر هذا العنصر في واجهة Dear ImGui فعلية.'},
          {label: 'أين يوضع الكود', value: renderImguiDocText(buildImguiExamplePlacementText(item)), note: ''},
          {label: 'ما الذي يحتاجه الكود ليعمل', value: renderImguiDocText(buildImguiExampleRequirementsText(item)), note: ''},
          {label: 'شرح مختصر للكود', value: renderImguiDocText(example.explanation || ''), note: ''},
          {label: 'النتيجة المتوقعة', value: renderImguiDocText(example.expectedResult || ''), note: ''},
          {label: 'ملاحظة مهمة', value: renderImguiDocText(example.importantNote || ''), note: ''}
        ])}
        ${renderImguiCodeBlock('الكود العملي المتكامل', example.fullCode || example.code)}
        ${example.gui ? `
          <div class="imgui-gui-preview">
            <div class="imgui-gui-preview-title">${escapeHtml(example.gui.title || 'النتيجة داخل الواجهة')}</div>
            <pre class="imgui-gui-preview-block">${escapeHtml(example.gui.mockup || '')}</pre>
            <p>${renderImguiDocText(example.gui.explanation || '')}</p>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function renderImguiFrameSimulationSection(item) {
  if (!item.frameSimulation?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>محاكاة الإطار</h2>
        <div class="imgui-frame-list">
          ${item.frameSimulation.map((entry) => `
            <div class="imgui-frame-card">
              <strong>${escapeHtml(entry.title || '')}</strong>
              <p>${renderImguiDocText(entry.body || '')}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderImguiExecutionMapSection(item) {
  if (!item.executionMap?.steps?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>خريطة التنفيذ</h2>
        <div class="imgui-execution-map">
          ${item.executionMap.steps.map((step, index) => `
            <div class="imgui-execution-step">${renderImguiDocText(step)}</div>
            ${index < item.executionMap.steps.length - 1 ? '<div class="imgui-execution-arrow">↓</div>' : ''}
          `).join('')}
        </div>
        <p><strong>الفائدة العملية:</strong> ${renderImguiDocText(item.executionMap.benefit || '')}</p>
      </div>
    </section>
  `;
}

function renderImguiLifecycleSection(item) {
  if (!item.lifecycle?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>دورة الحياة</h2>
        ${renderTutorialList(item.lifecycle.map((entry) => renderImguiDocText(entry)), true)}
      </div>
    </section>
  `;
}

function renderImguiInstructionsSection(item) {
  if (!item.instructions?.length) {
    return '';
  }
  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>التعليمات</h2>
        ${renderTutorialList(item.instructions.map((entry) => renderImguiDocText(entry)))}
      </div>
    </section>
  `;
}

function renderImguiThreadSafetySection(item) {
  if (!item.threadSafety) {
    return '';
  }
  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>سلامة الخيوط</h2>
        <p>${renderImguiDocText(item.threadSafety)}</p>
      </div>
    </section>
  `;
}

function renderImguiNotesSection(item) {
  const notes = [...(item.notes || [])].filter(Boolean);

  if (!notes.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>اللواحق</h2>
        ${renderTutorialList(notes.map((entry) => renderImguiDocText(entry)))}
      </div>
    </section>
  `;
}

function renderImguiValuesSection(item) {
  if (!item.values?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>قيم التعداد أو الأعلام</h2>
        <div class="table-wrapper">
          <table class="analysis-table">
            <thead>
              <tr>
                <th>القيمة</th>
                <th>ماذا تمثل</th>
                <th>أين تستخدم</th>
                <th>تأثيرها العملي</th>
              </tr>
            </thead>
            <tbody>
              ${item.values.map((value) => `
                <tr>
                  <td>${getImguiReferenceItem(value.name) ? renderImguiEntityLink(value.name) : renderImguiStaticCodeToken(value.name, value.meaning || value.effect || value.usage || value.name)}</td>
                  <td>${renderImguiDocText(value.meaning || '')}</td>
                  <td>${renderImguiDocText(value.usage || '')}</td>
                  <td>${renderImguiDocText(value.effect || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderImguiContextConstantsSection(item) {
  const constants = (item.related || [])
    .map((name) => getImguiReferenceItem(name))
    .filter((entry) => entry && ['flag', 'enum', 'macro'].includes(entry.kind));

  if (!constants.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>الثوابت المستخدمة في هذا الموضع</h2>
        <ul class="reference-list">
          ${constants.map((entry) => `
            <li>${renderImguiEntityLink(entry.name, entry.name, {className: 'related-link code-token entity-link-with-icon', iconType: getImguiKindMeta(entry.kind).icon})} <span class="imgui-inline-note">${renderImguiDocText(entry.realMeaning || entry.officialArabicDescription || '')}</span></li>
          `).join('')}
        </ul>
      </div>
    </section>
  `;
}

function renderImguiRelatedSection(item) {
  if (!item.related?.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>العناصر المرتبطة</h2>
        <ul class="reference-list imgui-related-list">
          ${item.related.map((name) => `
            <li>${renderImguiEntityLink(name, name, {className: 'related-link code-token entity-link-with-icon', iconType: getImguiKindMeta(getImguiReferenceItem(name)?.kind || 'type').icon})}</li>
          `).join('')}
        </ul>
      </div>
    </section>
  `;
}

function populateImguiList() {
  return imguiSectionRuntime?.populateImguiList?.();
}

function toggleImguiExampleGroup(groupKey) {
  return imguiSectionRuntime?.toggleImguiExampleGroup?.(groupKey);
}

async function showImguiReference(name, options = {}) {
  await ensureUiSegment('imguiParameterOverrides');
  return imguiSectionRuntime?.showImguiReference?.(name, options);
}

async function showImguiIndex(options = {}) {
  return imguiSectionRuntime?.showImguiIndex?.(options);
}

async function showImguiHomeSection(sectionKey = '') {
  return imguiSectionRuntime?.showImguiHomeSection?.(sectionKey);
}

const getImguiHomeRecentItems = (...args) => imguiSectionRuntime?.getImguiHomeRecentItems?.(...args) || [];
const buildImguiHomeLibraryModel = (...args) => imguiSectionRuntime?.buildImguiHomeLibraryModel?.(...args) || {
  key: 'imgui',
  title: 'Dear ImGui',
  iconType: 'imgui',
  kicker: 'واجهة المستخدم الفورية',
  description: '',
  summaryNote: '',
  statusNote: '',
  totalCount: 0,
  headerActions: [],
  cards: [],
  quickLinks: [],
  recentIconType: 'imgui',
  recentItems: [],
  recentEmptyText: '',
  supportLinks: [],
  extraSectionsHtml: ''
};

const getCmakeHomeSections = (...args) => cmakeHomeRuntime?.getCmakeHomeSections?.(...args) || [];
const buildCmakeSectionSidebarTooltip = (...args) => cmakeHomeRuntime?.buildCmakeSectionSidebarTooltip?.(...args) || '';

function showSiteUsageGuide(options = {}) {
  return homePageRuntime?.showSiteUsageGuide?.(options);
}

const DEFAULT_EXAMPLE_PLATFORMS = Object.freeze(['Windows', 'Linux', 'macOS']);
function localizeExamplePlatformLabel(platform = '') {
  const key = String(platform || '').trim();
  return getAppTextValue('EXAMPLE_PLATFORM_ARABIC_LABELS')?.[key] || key;
}

function localizeExamplePlatformText(text = '') {
  return String(text || '')
    .replace(/\bWindows\b/g, getAppTextValue('EXAMPLE_PLATFORM_ARABIC_LABELS')?.Windows || 'Windows')
    .replace(/\bLinux\b/g, getAppTextValue('EXAMPLE_PLATFORM_ARABIC_LABELS')?.Linux || 'Linux')
    .replace(/\bmacOS\b/g, getAppTextValue('EXAMPLE_PLATFORM_ARABIC_LABELS')?.macOS || 'macOS');
}

function getExamplePlatforms(example) {
  const platforms = Array.isArray(example?.platforms) && example.platforms.length
    ? example.platforms
    : DEFAULT_EXAMPLE_PLATFORMS;

  return platforms
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
}

function renderExamplePlatformSection(example, fallbackNote = '') {
  const platforms = getExamplePlatforms(example);
  const note = localizeExamplePlatformText(String(example?.platformNote || fallbackNote || '').trim());
  if (!platforms.length && !note) {
    return '';
  }

  return `
    <div class="example-platform-section">
      <div class="example-platform-label">الأنظمة المدعومة</div>
      <div class="example-platform-chips">
        ${platforms.map((platform) => `<span class="example-platform-chip">${escapeHtml(localizeExamplePlatformLabel(platform))}</span>`).join('')}
      </div>
      ${note ? `<p class="example-platform-note">${escapeHtml(note)}</p>` : ''}
    </div>
  `;
}

function renderStandaloneCodeBlock({titleHtml = '', rawCode = '', language = 'cpp', iconType = 'command', containerClassName = '', preClassName = '', codeClassName = '', annotate = true, glslTooltipMode = ''}) {
  return renderDocCodeContainer({
    titleHtml: titleHtml || `${renderEntityIcon(iconType, 'ui-codicon list-icon', 'Code')} الكود`,
    rawCode,
    renderedCodeHtml: escapeHtml(rawCode || ''),
    language,
    containerClassName,
    preClassName,
    codeClassName
  });
}

function renderGlslReadyShaderCodeBlock(title, code) {
  return renderStandaloneCodeBlock({
    titleHtml: `${renderEntityIcon('glsl', 'ui-codicon list-icon', title || 'لغة التظليل')} ${escapeHtml(title || 'لغة التظليل')}`,
    rawCode: code || '',
    language: 'glsl',
    iconType: 'glsl',
    containerClassName: 'example-section glsl-ready-code-container',
    preClassName: 'glsl-ready-code-pre',
    codeClassName: 'glsl-ready-code',
    annotate: true,
    glslTooltipMode: 'corrected'
  });
}

function renderCommandSnippet(title, code, language = 'bash', iconType = 'command') {
  return renderStandaloneCodeBlock({
    titleHtml: `${renderEntityIcon(iconType, 'ui-codicon list-icon', title || 'Command')} ${escapeHtml(title || 'Command')}`,
    rawCode: code || '',
    language,
    iconType,
    containerClassName: 'example-section example-command-container',
    preClassName: 'example-command-pre',
    codeClassName: 'example-command-code',
    annotate: false
  });
}

function localizeVulkanUiText(text = '') {
  return normalizeVulkanArabicTechnicalProse(
    String(text || '')
      .replace(/Vulkan Examples/g, 'أمثلة فولكان')
      .replace(/Vulkan Example/g, 'مثال فولكان')
      .replace(/\bVulkan\b/g, 'فولكان')
  );
}

function getVulkanExampleDisplayTitle(example) {
  const id = String(example?.id || '').trim();
  return localizeVulkanUiText(getAppTextValue('VULKAN_EXAMPLE_DISPLAY_TITLES')?.[id] || example?.title || 'مثال فولكان');
}

function getVulkanExampleDifficulty(example) {
  const id = String(example?.id || '').trim();
  return example?.difficulty || getAppTextValue('VULKAN_EXAMPLE_DIFFICULTY_BY_ID')?.[id] || 'متوسط';
}

function getVulkanExampleGroupMeta(exampleOrId = '') {
  const id = typeof exampleOrId === 'string'
    ? String(exampleOrId || '').trim()
    : String(exampleOrId?.id || '').trim();
  const groupId = getAppTextValue('VULKAN_EXAMPLE_GROUP_BY_ID')?.[id] || 'postprocess-systems';
  const groups = getAppTextValue('VULKAN_EXAMPLE_GROUPS') || [];
  return groups.find((group) => group.id === groupId) || groups[0];
}

function getOrderedVulkanReadyExamples() {
  const orderIndex = new Map();
  (getAppTextValue('VULKAN_EXAMPLE_ORDER') || []).forEach((id, index) => {
    orderIndex.set(id, index);
  });

  return VULKAN_READY_EXAMPLES
    .filter((example) => !isVulkanExampleMovedOut(example))
    .sort((left, right) => {
    const leftRank = orderIndex.has(left.id) ? orderIndex.get(left.id) : Number.MAX_SAFE_INTEGER;
    const rightRank = orderIndex.has(right.id) ? orderIndex.get(right.id) : Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return getVulkanExampleDisplayTitle(left).localeCompare(getVulkanExampleDisplayTitle(right), 'ar');
    });
}

function getGroupedVulkanReadyExamples() {
  const orderedExamples = getOrderedVulkanReadyExamples();
  return (getAppTextValue('VULKAN_EXAMPLE_GROUPS') || []).map((group) => ({
    ...group,
    examples: orderedExamples.filter((example) => getVulkanExampleGroupMeta(example).id === group.id)
  })).filter((group) => group.examples.length);
}

function localizeVulkanPreviewLabels(svgMarkup = '') {
  let localized = String(svgMarkup || '');
  const replacements = [
    [/Vulkan Example/g, 'مثال فولكان'],
    [/Extensions/g, 'الامتدادات'],
    [/GPU 0/g, 'البطاقة 0'],
    [/GPU 1/g, 'البطاقة 1'],
    [/GPU 2/g, 'البطاقة 2'],
    [/Attachment/g, 'المرفق'],
    [/Subpass/g, 'التمرير الفرعي'],
    [/Acquire/g, 'الاكتساب'],
    [/Record/g, 'التسجيل'],
    [/Submit/g, 'الإرسال'],
    [/Present/g, 'العرض'],
    [/WHOLE/g, 'كامل'],
    [/MIPS/g, 'المستويات'],
    [/LAYERS/g, 'الطبقات'],
    [/IGNORED/g, 'متجاهل'],
    [/EXTERNAL/g, 'خارجي'],
    [/UNUSED/g, 'غير مستخدم'],
    [/Scene/g, 'المشهد'],
    [/Bloom/g, 'التوهج'],
    [/GPU/g, 'الرسوميات'],
    [/VRAM/g, 'ذاكرة الفيديو'],
    [/CPU/g, 'المعالج'],
    [/RAM/g, 'الرام'],
    [/VkSwapchainKHR Images/g, 'صور VkSwapchainKHR'],
    [/>VS</g, '>رؤوس<'],
    [/>IA</g, '>تجميع<'],
    [/>RS</g, '>تنقيط<'],
    [/>FS</g, '>أجزاء<']
  ];

  replacements.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });

  return localized;
}

function buildLocalExampleSymbolAnchorId(name = '') {
  return makeAnchorId('analysis-local', name);
}

function getLocalExampleSymbolMeta(kind = '') {
  switch (String(kind || '').trim()) {
    case 'function':
      return {iconType: 'command', label: 'دالة'};
    case 'struct':
      return {iconType: 'structure', label: 'بنية'};
    case 'enum':
      return {iconType: 'enum', label: 'تعداد'};
    case 'macro':
      return {iconType: 'macro', label: 'ماكرو'};
    default:
      return {iconType: 'variable', label: 'متغير'};
  }
}

function splitExampleIdentifierWords(name = '') {
  return String(name || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function describeLocalExampleSubject(name = '') {
  const raw = String(name || '').trim();
  if (!raw) {
    return 'العنصر المحلي المشار إليه بالاسم';
  }
  if (/Swapchain/i.test(raw)) return 'سلسلة التبديل';
  if (/RenderPass/i.test(raw)) return 'تمرير الرسم';
  if (/Pipeline/i.test(raw)) return 'خط الأنابيب الرسومي';
  if (/Shader/i.test(raw)) return 'الشيدر';
  if (/Sampler/i.test(raw)) return 'السامبلر المسؤول عن أخذ العينات من النسيج';
  if (/Texture|Image/i.test(raw)) return 'الصورة أو النسيج';
  if (/Buffer/i.test(raw)) return 'مخزن البيانات';
  if (/Memory/i.test(raw)) return 'الذاكرة المرتبطة بالمورد';
  if (/Instance/i.test(raw)) return 'مثيل Vulkan';
  if (/PhysicalDevice/i.test(raw)) return 'الجهاز الفيزيائي';
  if (/Device/i.test(raw)) return 'الجهاز المنطقي';
  if (/Queue/i.test(raw)) return 'الطابور';
  if (/Surface/i.test(raw)) return 'سطح العرض';
  if (/Vertex/i.test(raw)) return 'بيانات الرؤوس';
  if (/Index/i.test(raw)) return 'بيانات الفهارس';
  if (/Uniform|PushConstants/i.test(raw)) return 'بيانات الشيدر المتغيرة';
  if (/Model|Mesh|Obj/i.test(raw)) return 'النموذج أو الشبكة';
  if (/Camera/i.test(raw)) return 'حالة الكاميرا';
  if (/Transform|Rotation|Scale/i.test(raw)) return 'التحويلات المكانية';
  if (/Frame|Sync|Semaphore|Fence/i.test(raw)) return 'مزامنة الإطار الحالي';
  if (/Support|Capabilities|Details/i.test(raw)) return 'بيانات الدعم المستعلم عنها';
  if (/Selection/i.test(raw)) return 'نتيجة الاختيار';
  if (/Info|Properties|Features|State|Context|Config|Settings/i.test(raw)) return 'إعدادات أو حالة المثال';
  const words = splitExampleIdentifierWords(raw);
  return words.length ? `العنصر المحلي ${words.join(' ')}` : raw;
}

function describeLocalExampleFunction(name = '', example = {}) {
  const subject = describeLocalExampleSubject(name);
  const raw = String(name || '').trim();

  if (/^Create/i.test(raw)) return `إنشاء ${subject} ثم إرجاعه للمرحلة التالية من المثال.`;
  if (/^(Destroy|Cleanup|Release|Shutdown)/i.test(raw)) return `تحرير ${subject} بالترتيب الصحيح قبل إنهاء المثال.`;
  if (/^(Pick|Choose|Select)/i.test(raw)) return `اختيار ${subject} الأنسب بناءً على شروط المثال الحالية.`;
  if (/^(Query|Get)/i.test(raw)) return `استعلام البيانات المرتبطة بـ ${subject} لاستخدامها في قرار لاحق داخل المثال.`;
  if (/^Find/i.test(raw)) return `البحث عن ${subject} الصحيح بدل استخدام قيمة ثابتة أو افتراض غير مضمون.`;
  if (/^(Load|Read)/i.test(raw)) return `قراءة ${subject} من ملف أو من الذاكرة وتجهيزه لبقية المسار.`;
  if (/^(Upload|Copy|Transfer)/i.test(raw)) return `رفع البيانات أو نسخها إلى ${subject} قبل استخدامها على المعالج الرسومي.`;
  if (/^(Record|Encode)/i.test(raw)) return `تسجيل أوامر GPU الخاصة بـ ${subject} داخل Command Buffer.`;
  if (/^(Draw|Render)/i.test(raw)) return `تنفيذ خطوة الرسم المرتبطة بـ ${subject} داخل الإطار الحالي.`;
  if (/^(Update|Animate|Rotate|Transform)/i.test(raw)) return `تحديث ${subject} بين الإطارات حتى يعكس الحالة الحالية للمشهد.`;
  if (/^(Build|Init|Setup)/i.test(raw)) return `تجهيز ${subject} وجمع الإعدادات المطلوبة قبل الاستخدام الفعلي.`;

  return `دالة مساعدة محلية تنظّم خطوة فرعية مرتبطة بـ ${subject} حتى يبقى التدفق الرئيسي للمثال أوضح.`;
}

function describeLocalExampleType(name = '') {
  const raw = String(name || '').trim();

  if (/Context|State/i.test(raw)) {
    return 'بنية محلية تجمع المقابض والحالة والإعدادات التي يتبادلها المثال بين التهيئة والرسم والتنظيف.';
  }
  if (/Selection/i.test(raw)) {
    return 'بنية محلية تحفظ نتيجة الاختيار مع القيم المرتبطة بها مثل الفهارس والمقابض حتى تستخدم لاحقاً دون إعادة البحث.';
  }
  if (/Support|Capabilities|Details/i.test(raw)) {
    return 'بنية محلية تخزن نتائج الاستعلام قبل اتخاذ قرار الإنشاء أو الاختيار داخل المثال.';
  }
  if (/Vertex/i.test(raw)) {
    return 'بنية محلية تمثل رأساً واحداً بما يحمله من موضع أو لون أو إحداثيات نسيجية قبل رفعه إلى GPU.';
  }
  if (/Uniform|PushConstants/i.test(raw)) {
    return 'بنية محلية تجمع البيانات التي ستصل إلى الشيدر وتتغير بين الإطارات أو بين عمليات الرسم.';
  }
  if (/Camera/i.test(raw)) {
    return 'بنية محلية تمثل حالة الكاميرا أو مصفوفاتها أو مدخلات التحكم المرتبطة بها.';
  }
  if (/Model|Mesh|Obj/i.test(raw)) {
    return 'بنية محلية تجمع بيانات النموذج أو الشبكة قبل تحويلها إلى مخازن رؤوس وفهارس.';
  }
  if (/Info|Properties|Features|Config|Settings/i.test(raw)) {
    return 'بنية محلية تحمل إعدادات أو خصائص وسيطة يقرأها المثال قبل تنفيذ الخطوة التالية.';
  }

  return `بنية أو نوع محلي مساعد يستخدم لتنظيم ${describeLocalExampleSubject(raw)} داخل المثال.`;
}

function buildLocalExampleSymbolTooltip(name = '', kind = '', example = {}, signature = '') {
  if (kind === 'function') {
    return composeSemanticTooltip({
      title: name,
      kindLabel: 'دالة محلية في المثال',
      typeLabel: 'Helper Function',
      library: 'Example Code',
      meaning: describeLocalExampleFunction(name, example),
      whyExists: 'وُجدت لأن المثال يحتاج خطوة محلية تهيئ أو تنظف أو تحسب شيئاً لا توفره Vulkan كاستدعاء جاهز.',
      whyUse: 'يستخدمها المبرمج لفصل منطق المثال عن نداءات API الخام حتى يبقى التسلسل أوضح.',
      actualUsage: signature ? `تظهر في الكود بهذا التوقيع المختصر: ${signature}.` : 'تظهر بين دوال المثال لتخدم خطوة عملية لاحقة.'
    });
  }
  if (kind === 'struct') {
    return composeSemanticTooltip({
      title: name,
      kindLabel: 'نوع محلي في المثال',
      typeLabel: 'Struct / Local Type',
      library: 'Example Code',
      meaning: describeLocalExampleType(name, example),
      whyExists: 'وُجد لأن المثال يحتاج تجميع حالة أو بيانات وسيطة لا تمثلها بنية Vulkan رسمية واحدة.',
      whyUse: 'يستخدمه المبرمج لحمل البيانات التي تنتقل بين التهيئة والرسم والتحديث والتنظيف.',
      actualUsage: signature ? `يظهر في تعريف نوع محلي بهذا التوقيع المختصر: ${signature}.` : 'يظهر كنوع محلي يربط أجزاء متعددة من المثال.'
    });
  }
  if (kind === 'enum') {
    return composeSemanticTooltip({
      title: name,
      kindLabel: 'تعداد محلي',
      typeLabel: 'Enum',
      library: 'Example Code',
      meaning: `يجمع القيم المحتملة المرتبطة بـ ${describeLocalExampleSubject(name)} داخل المثال.`,
      whyExists: 'وُجد لأن المثال يحتاج اختياراً محلياً صريحاً بين حالات متعددة بدل أرقام حرفية.',
      whyUse: 'يستخدمه المبرمج لتنظيم الفروع المحلية أو الأوضاع التي يتحكم بها المثال.',
      actualUsage: 'يظهر في الشروط أو الإعدادات المحلية التي تغيّر سلوك المثال.'
    });
  }
  if (kind === 'macro') {
    return composeSemanticTooltip({
      title: name,
      kindLabel: 'ماكرو محلي',
      typeLabel: 'Compile-time Helper',
      library: 'Example Code',
      meaning: 'يعطي اسماً ثابتاً أو قيمة جاهزة يستخدمها المثال بدل تكرار النص نفسه.',
      whyExists: 'وُجد لأن المثال يحتاج ثابتاً محلياً متكرراً أو اختصاراً وقت الترجمة.',
      whyUse: 'يستخدمه المبرمج لتقليل التكرار أو لتجميع قيمة ثابتة باسم دال.',
      actualUsage: 'يظهر في أعلى الملف أو قرب الإعدادات المحلية التي تتكرر في أكثر من موضع.'
    });
  }
  return composeSemanticTooltip({
    title: name,
    kindLabel: 'عنصر محلي في المثال',
    typeLabel: 'Local Symbol',
    library: 'Example Code',
    meaning: 'يمثل رمزاً محلياً مساعداً داخل المثال الحالي.',
    whyExists: 'وُجد لأن المثال يحتاج وسيطاً أو حالة محلية تربط خطواته ببعضها.',
    whyUse: 'يستخدمه المبرمج للاحتفاظ بالبيانات أو الأسماء أو النتائج المرحلية التي تحتاجها الخطوة التالية.',
    actualUsage: 'يظهر داخل كود المثال لا داخل API نفسها.'
  });
}

function buildLocalExampleSymbolDescription(name = '', kind = '', example = {}, signature = '') {
  const tooltip = buildLocalExampleSymbolTooltip(name, kind, example, signature);
  if (!signature) {
    return tooltip;
  }

  return `${tooltip} التوقيع المختصر لهذا العنصر هو ${renderVulkanHighlightedInlineCode(signature)}.`;
}

function collectVulkanExampleLocalSymbols(example = {}) {
  const code = String(example?.code || '');
  const symbols = [];
  const seen = new Set();

  const addSymbol = (name, kind, signature = '') => {
    const cleanedName = String(name || '').trim();
    if (!cleanedName || seen.has(cleanedName) || cleanedName === 'main') {
      return;
    }
    if (/^(vk|Vk|VK_|SDL_|SDL|ImGui|glfw|std::)/.test(cleanedName)) {
      return;
    }

    seen.add(cleanedName);
    const meta = getLocalExampleSymbolMeta(kind);
    symbols.push({
      name: cleanedName,
      kind,
      kindLabel: meta.label,
      iconType: meta.iconType,
      signature: String(signature || '').trim(),
      anchorId: buildLocalExampleSymbolAnchorId(cleanedName),
      tooltip: buildLocalExampleSymbolTooltip(cleanedName, kind, example, signature),
      description: buildLocalExampleSymbolDescription(cleanedName, kind, example, signature)
    });
  };

  const structRegex = /^\s*struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
  let match = null;
  while ((match = structRegex.exec(code)) !== null) {
    addSymbol(match[1], 'struct', `struct ${match[1]}`);
  }

  const enumRegex = /^\s*enum(?:\s+class)?\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
  while ((match = enumRegex.exec(code)) !== null) {
    addSymbol(match[1], 'enum', `enum ${match[1]}`);
  }

  const macroRegex = /^\s*#define\s+([A-Z_][A-Z0-9_]*)\b/gm;
  while ((match = macroRegex.exec(code)) !== null) {
    addSymbol(match[1], 'macro', `#define ${match[1]}`);
  }

  const functionRegex = /^\s*(?:static\s+)?([A-Za-z_][A-Za-z0-9_:<>\s*&]+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([\s\S]*?)\)\s*\{/gm;
  while ((match = functionRegex.exec(code)) !== null) {
    const returnType = String(match[1] || '').trim();
    const functionName = String(match[2] || '').trim();
    const parameterList = String(match[3] || '').replace(/\s+/g, ' ').trim();
    if (/^(if|for|while|switch|return)$/.test(functionName)) {
      continue;
    }
    addSymbol(functionName, 'function', `${returnType} ${functionName}(${parameterList})`);
  }

  return symbols;
}

function buildVulkanExampleLocalSymbolMap(example = {}) {
  return collectVulkanExampleLocalSymbols(example).reduce((map, symbol) => {
    map[symbol.name] = {
      anchorId: symbol.anchorId,
      tooltip: symbol.tooltip,
      description: symbol.description,
      iconType: symbol.iconType,
      kind: symbol.kind,
      kindLabel: symbol.kindLabel,
      signature: symbol.signature
    };
    return map;
  }, {});
}

function renderLocalExampleSymbolLink(name, descriptor = {}) {
  return renderAnalysisReference(name, null, {
    anchorId: descriptor.anchorId || buildLocalExampleSymbolAnchorId(name),
    tooltip: descriptor.tooltip || descriptor.description || `عنصر محلي مساعد داخل المثال الحالي.`,
    iconType: descriptor.iconType || getLocalExampleSymbolMeta(descriptor.kind || '').iconType || 'variable'
  });
}

function mergeUniqueTeachingItems(...groups) {
  const result = [];
  const seen = new Set();

  groups.flat().forEach((entry) => {
    const text = String(entry || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) {
      return;
    }

    const key = text.replace(/<[^>]+>/g, '').trim();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    result.push(text);
  });

  return result;
}

function getVulkanExampleTeachingProfile(example = {}) {
  const id = String(example?.id || '').trim();

  switch (id) {
    case 'sdl3-window-surface':
      return {
        problem: 'ربط نافذة النظام بواجهة Vulkan وإنشاء VkSurfaceKHR صالح للتقديم بدلاً من الاكتفاء بنافذة عامة لا يعرفها المشغل.',
        importance: 'أي تطبيق يعرض على الشاشة يحتاج هذه الخطوة مبكراً حتى يستطيع لاحقاً فحص دعم التقديم وبناء VkSwapchainKHR.',
        realUse: 'تستخدم في محركات الألعاب والمشاهد ثلاثية الأبعاد وكل تطبيق يبدأ من نافذة سطح مكتب ثم ينتقل إلى الرسم.',
        learning: [
          'فهم كيف تطلب الامتدادات المطلوبة من SDL3 بدلاً من كتابة أسماء المنصة يدوياً.',
          'معرفة الفرق بين إنشاء النافذة وإنشاء VkSurfaceKHR المرتبط بها فعلياً.',
          'تعلم ترتيب التنظيف الصحيح بين السطح والمثيل والنافذة.'
        ],
        flow: [
          'تهيئة SDL3 وإنشاء نافذة تدعم Vulkan.',
          'جمع امتدادات المنصة المطلوبة من SDL_Vulkan_GetInstanceExtensions.',
          'إنشاء VkInstance ثم إنشاء VkSurfaceKHR فوق النافذة.',
          'الإبقاء على حلقة أحداث بسيطة للتأكد من بقاء النافذة فعالة.',
          'تنظيف السطح والمثيل والنافذة بالترتيب الصحيح.'
        ],
        concepts: [
          'VkSurfaceKHR هو جسر التقديم بين Vulkan ونظام النوافذ، وليس بديلاً عن النافذة نفسها.',
          'امتدادات المنصة مطلوبة لأن Vulkan لا يفترض نوع نظام العرض من تلقاء نفسه.'
        ]
      };
    case 'instance-creation':
      return {
        problem: 'تجميع هوية التطبيق والامتدادات والطبقات في نقطة دخول واحدة قبل استعمال أي عنصر آخر من Vulkan.',
        importance: 'من دون VkInstance لا يمكنك تعداد الأجهزة ولا إنشاء الأسطح ولا استعمال بقية واجهة Vulkan الرسمية.',
        realUse: 'هذه الخطوة موجودة في بداية كل برنامج أو محرك يستخدم Vulkan مهما كان حجم المشروع.',
        learning: [
          'تعلم الفرق بين بيانات التطبيق وبيانات إنشاء المثيل.',
          'معرفة متى تضاف طبقات التحقق وامتداد debug utils.',
          'فهم أن الامتدادات المطلوبة تعتمد على المنصة ومكتبة النوافذ المستخدمة.'
        ],
        flow: [
          'قراءة امتدادات المنصة من مكتبة النوافذ.',
          'تجهيز VkApplicationInfo وVkInstanceCreateInfo.',
          'إضافة طبقات التحقق والامتدادات الاختيارية عند التطوير.',
          'استدعاء vkCreateInstance وفحص النتيجة قبل المتابعة.'
        ],
        concepts: [
          'VkApplicationInfo يصف هوية التطبيق والنسخة التي يطلبها من الواجهة.',
          'طبقات التحقق أدوات تشخيص، وليست جزءاً إلزامياً من مسار التشغيل النهائي.'
        ]
      };
    case 'pick-physical-device':
      return {
        problem: 'اختيار GPU يدعم الرسم والتقديم فعلياً بدلاً من افتراض أن أول جهاز معروض مناسب تلقائياً.',
        importance: 'القرار هنا يحدد ما إذا كان التطبيق سيعمل على الجهاز الحالي أم سيتعطل لاحقاً عند بناء الطوابير أو السلسلة.',
        realUse: 'تستخدم هذه الخطوة في جميع المحركات التي تعمل على أكثر من بطاقة أو على أجهزة بقدرات متفاوتة.',
        learning: [
          'تعلم كيف تعدّد الأجهزة الرسومية المتاحة داخل النظام.',
          'معرفة كيف تفحص عائلات الطوابير ودعم التقديم لكل عائلة.',
          'فهم فكرة المفاضلة بين جهاز منفصل وآخر مدمج بعد التأكد من اكتمال المتطلبات.'
        ],
        flow: [
          'تعداد جميع VkPhysicalDevice المتاحة من خلال VkInstance.',
          'قراءة خصائص كل جهاز وعائلات الطوابير الخاصة به.',
          'فحص دعم التقديم على السطح الحالي لكل عائلة طوابير.',
          'اختيار أول جهاز مكتمل أو تفضيل الجهاز المنفصل إذا كان مكتملاً.'
        ],
        concepts: [
          'VkPhysicalDevice يمثل قدرات العتاد كما هي، لكنه لا يسمح بعد بتنفيذ الأوامر.',
          'وجود طابور رسوميات لا يكفي إذا لم يوجد أيضاً دعم للتقديم إلى السطح.'
        ]
      };
    case 'logical-device':
      return {
        problem: 'تحويل الجهاز الفيزيائي المختار إلى جهاز منطقي يملك طوابير قابلة للاستخدام الفعلي.',
        importance: 'بدون VkDevice لا يمكن إنشاء الموارد ولا استرجاع VkQueue ولا تنفيذ أي أوامر رسم أو نقل.',
        realUse: 'أي تطبيق Vulkan يمر بهذه المرحلة بعد اختيار الجهاز الفيزيائي مباشرة.',
        learning: [
          'تعلم لماذا تجمع العائلات الفريدة قبل إنشاء الطوابير.',
          'معرفة الفرق بين VkPhysicalDevice وVkDevice وVkQueue.',
          'فهم دور امتداد VK_KHR_swapchain في السماح بالتقديم إلى الشاشة.'
        ],
        flow: [
          'جمع عائلات الطوابير المطلوبة للرسم والتقديم.',
          'تعبئة VkDeviceQueueCreateInfo لكل عائلة فريدة.',
          'تحديد الامتدادات والميزات المطلوبة على الجهاز المنطقي.',
          'استدعاء vkCreateDevice ثم استرجاع الطوابير عبر vkGetDeviceQueue.'
        ],
        concepts: [
          'الجهاز المنطقي هو نقطة إنشاء الموارد والتعامل مع الطوابير.',
          'الطابور مقبض تنفيذي فعلي ترسل إليه الأعمال بعد تسجيلها في Command Buffer.'
        ]
      };
    case 'buffer-memory-upload':
      return {
        problem: 'إنشاء مخزن بيانات في Vulkan لا يكتمل بمجرد إنشاء VkBuffer، لأن الذاكرة الفعلية يجب اختيارها وربطها وفتحها للكتابة.',
        importance: 'هذا المثال هو أساس تحميل الرؤوس والفهارس والبيانات المرحلية وأي مورد يحتاج نسخاً من CPU إلى GPU.',
        realUse: 'يستخدم في staging buffers وuniform buffers ومسارات الرفع الأولي للبيانات داخل المحركات.',
        learning: [
          'تعلم قراءة متطلبات الذاكرة الفعلية من المشغل بدلاً من التخمين.',
          'معرفة كيف تختار نوع الذاكرة المناسب لاحتياج المضيف أو الجهاز.',
          'فهم متى يستخدم vkMapMemory وvkUnmapMemory لكتابة البيانات.'
        ],
        flow: [
          'إنشاء VkBuffer مع الاستخدام المطلوب.',
          'قراءة VkMemoryRequirements الخاصة به.',
          'اختيار memory type يدعم الخصائص المطلوبة.',
          'حجز VkDeviceMemory وربطها بالمخزن.',
          'فتح الذاكرة ونسخ البيانات ثم إغلاقها.'
        ],
        concepts: [
          'Memory types تحدد مكان الذاكرة وكيف يمكن الوصول إليها من CPU وGPU.',
          'Host visible لا يعني بالضرورة الأداء الأفضل، بل يعني سهولة الكتابة من التطبيق.'
        ]
      };
    case 'swapchain':
      return {
        problem: 'اختيار إعدادات السلسلة من القدرات الحقيقية للسطح حتى تصبح صور التقديم صالحة للعرض ولا تعتمد على افتراضات غير مضمونة.',
        importance: 'VkSwapchainKHR هي المورد المركزي لأي عرض نافذة في Vulkan، وأي خطأ هنا ينعكس على كل مسار التقديم.',
        realUse: 'كل تطبيق مكتبي أو لعبة تعرض على نافذة يحتاج سلسلة تبديل متوافقة مع السطح والجهاز.',
        learning: [
          'تعلم قراءة قدرات السطح والصيغ وأنماط التقديم قبل الإنشاء.',
          'معرفة كيف يحدد التطبيق عدد الصور وأبعادها الفعلية.',
          'فهم الفرق بين المشاركة الحصرية والمشتركة بين عائلات الطوابير.'
        ],
        flow: [
          'استعلام قدرات السطح والصيغ وأنماط التقديم.',
          'اختيار VkSurfaceFormatKHR وVkPresentModeKHR المناسبين.',
          'حساب الامتداد الفعلي للصورة وعدد الصور المطلوب.',
          'تعبئة VkSwapchainCreateInfoKHR وإنشاء السلسلة.',
          'استرجاع صور VkSwapchainKHR لبناء المراحل التالية فوقها.'
        ],
        concepts: [
          'Present mode يحدد سلوك تبديل الصور وزمن التأخير أثناء العرض.',
          'Swapchain images موارد ينشئها المشغل ويعطيك مقابضها لاستخدامها في الرسم.'
        ]
      };
    case 'render-pass':
      return {
        problem: 'تحديد عقدة التقديم التي تشرح كيف تبدأ المرفقات وكيف تنتهي وكيف ترتبط بالـ subpass بدل ترك ذلك ضمنياً.',
        importance: 'Render pass يعرّف الاتفاق الذي تبني عليه framebuffers وpipelines وأوامر الرسم.',
        realUse: 'يظهر في مسارات الرسم التقليدية وكل إعداد يعتمد على مرفقات لونية أو عمق أو أكثر من subpass.',
        learning: [
          'تعلم معنى attachment وsubpass وdependency داخل Vulkan.',
          'معرفة كيف يحدد layout النهائي مسار تقديم الصورة إلى الشاشة.',
          'فهم لماذا تحتاج dependency واضحة حتى مع مثال بسيط.'
        ],
        flow: [
          'وصف المرفق اللوني وحالة التحميل والتخزين.',
          'ربط المرفق داخل subpass رسومي واحد.',
          'إضافة تبعية مزامنة بين الخارج ومرحلة الكتابة اللونية.',
          'إنشاء VkRenderPass ثم تمريره للمراحل اللاحقة.'
        ],
        concepts: [
          'Attachment description يحدد كيف ستعامل الصورة قبل الرسم وبعده.',
          'Layout الانتقالي جزء من معنى المرفق وليس مجرد حقل شكلي.'
        ]
      };
    case 'graphics-pipeline':
      return {
        problem: 'تجميع مراحل الشيدر وحالات الإدخال والرسم في كائن Pipeline واضح يمكن إعادة استخدامه أثناء الرسم.',
        importance: 'من دون VkPipeline لا يعرف GPU كيف يفسر الرؤوس أو كيف يمرر البيانات عبر المراحل الرسومية.',
        realUse: 'كل مشهد مرسوم في Vulkan يمر عبر خط أنابيب واحد أو أكثر حسب المواد والتمريرات المختلفة.',
        learning: [
          'تعلم العلاقة بين shader modules وpipeline layout وgraphics pipeline.',
          'معرفة الحقول الأساسية التي تحدد التجميع والرستر والبلند والتمرير.',
          'فهم لماذا يوضع معظم التهيئة في إنشاء واحد بدلاً من ضبطها سطراً بسطر أثناء الرسم.'
        ],
        flow: [
          'قراءة ملفات الشيدر أو وحدات SPIR-V وإنشاء VkShaderModule.',
          'تعبئة حالات الإدخال والتجميع والرستر وmultisample والبلند.',
          'إنشاء VkPipelineLayout مع descriptor sets أو push constants عند الحاجة.',
          'استدعاء vkCreateGraphicsPipelines للحصول على خط الأنابيب النهائي.'
        ],
        concepts: [
          'Pipeline configuration في Vulkan كائن ثابت نسبياً يجمّع معظم حالة الرسم مسبقاً.',
          'Shader module مجرد غلاف لـ SPIR-V، أما pipeline فهو الذي يربط الوحدات ببقية حالة الرسم.'
        ]
      };
    case 'frame-rendering':
      return {
        problem: 'تنفيذ دورة الإطار الكاملة من اكتساب الصورة حتى تقديمها مع مزامنة صحيحة بين CPU وGPU.',
        importance: 'هذا هو المسار الذي يكرر نفسه كل إطار، وأي خلل فيه يؤدي إلى تجمد العرض أو وميض الصور أو تعارض الموارد.',
        realUse: 'كل تطبيق تفاعلي أو لعبة في Vulkan يكرر هذه الدورة عشرات أو مئات المرات في الثانية.',
        learning: [
          'تعلم الفرق بين acquire وrecord وsubmit وpresent.',
          'معرفة دور fences وsemaphores في ترتيب العمل بين المعالجين.',
          'فهم كيف ترتبط صورة السلسلة الحالية بالأوامر المسجلة لهذا الإطار.'
        ],
        flow: [
          'انتظار مزامنة الإطار السابق إذا لزم الأمر.',
          'اكتساب صورة جديدة من VkSwapchainKHR.',
          'تسجيل أوامر الرسم الخاصة بهذه الصورة.',
          'إرسال العمل إلى الطابور مع كائنات المزامنة.',
          'تقديم الصورة النهائية إلى الشاشة.'
        ],
        concepts: [
          'vkAcquireNextImageKHR لا يرسم شيئاً، بل يحدد فقط أي صورة أصبحت متاحة لهذا الإطار.',
          'التقديم خطوة منفصلة عن الإرسال لأن الرسم يتم أولاً ثم يعرض ناتجه لاحقاً.'
        ]
      };
    case 'imgui-integration':
    case 'imgui-editor-shell-panels':
    case 'imgui-color-picker-live-material':
    case 'imgui-drag-drop-asset-browser':
    case 'imgui-animated-profiler-overlay':
    case 'imgui-frame-updated-values':
      return {
        problem: 'إضافة واجهة أدوات فورية فوق مسار Vulkan من دون خلط منطق الواجهة بمنطق الرسم الأساسي.',
        importance: 'واجهات الأدوات ضرورية للمحررات ولوحات الضبط والتشخيص أثناء التطوير.',
        realUse: 'تستخدم في المحررات وأدوات المطور ولوحات التصحيح وضبط المواد والمشاهد لحظياً.',
        learning: [
          'تعلم كيف يبدأ إطار ImGui ثم تبنى العناصر ثم تتحول إلى draw data ترسم فوق Vulkan.',
          'معرفة كيف تحفظ الحالة بين الإطارات لعرض القيم واللوحات التفاعلية.',
          'فهم أن واجهة Dear ImGui طبقة إضافية فوق مسار الرسم وليست بديلاً عن Vulkan.'
        ],
        flow: [
          'تهيئة سياق ImGui وربطه بـ Vulkan ونافذة المثال.',
          'بدء إطار ImGui جديد في كل دورة رسم.',
          'بناء النوافذ والعناصر والقيم التفاعلية المطلوبة.',
          'تحويل draw data الناتجة إلى أوامر ترسم داخل الإطار الحالي.',
          'تنظيف backends والسياق عند الإغلاق.'
        ],
        concepts: [
          'Dear ImGui يعمل بأسلوب immediate mode، لذلك يعاد بناء عناصر الواجهة كل إطار.',
          'لوحات الخصائص واللون والسحب والإفلات تعتمد على حالة التطبيق التي يحدثها المثال باستمرار.'
        ]
      };
    case 'depth-tested-3d-cube':
      return {
        problem: 'إظهار الفرق بين الرسم ثنائي الأبعاد والرسم ثلاثي الأبعاد الذي يحتاج مرفق عمق يمنع ظهور الأسطح البعيدة فوق القريبة.',
        importance: 'أي مشهد ثلاثي الأبعاد صحيح بصرياً يحتاج depth testing حتى يفرز الأجزاء المرئية من المخفية.',
        realUse: 'يستخدم في جميع الألعاب والمشاهد الهندسية والعارضات ثلاثية الأبعاد.',
        learning: [
          'تعلم لماذا ينشأ depth image منفصل عن المرفق اللوني.',
          'معرفة كيف تضبط pipeline لاستخدام اختبار العمق.',
          'فهم دور مصفوفات الإسقاط والرؤية والنموذج في رسم مجسم ثلاثي الأبعاد.'
        ],
        flow: [
          'إنشاء الموارد اللونية ومرفق العمق.',
          'بناء pipeline يفعّل depth testing والـ viewport المناسب.',
          'تحديث مصفوفات المشهد ثلاثي الأبعاد.',
          'تسجيل أوامر الرسم للمكعب ثم تقديم النتيجة.'
        ],
        concepts: [
          'Depth buffer يخزن عمق كل fragment حتى يقارن المشغل أي جزء يجب أن يبقى مرئياً.',
          'التحويلات المصفوفية أساسية لتحويل المجسم من فضاء النموذج إلى فضاء العرض.'
        ]
      };
    case 'orbit-camera-controller':
      return {
        problem: 'التحكم في كاميرا تدور حول هدف ثابت من دون تغيير بيانات المجسم نفسه.',
        importance: 'يفصل هذا المثال بين حركة المشهد وحركة الكاميرا، وهو أساس أدوات المعاينة والمحررات.',
        realUse: 'يستخدم في عارضات النماذج وأدوات التحرير وكاميرات الاستعراض حول مجسم أو مشهد.',
        learning: [
          'تعلم كيف تحدَّث زوايا الكاميرا والمسافة عن الهدف من المدخلات.',
          'معرفة كيف تعاد حساب view matrix من موضع الكاميرا واتجاهها.',
          'فهم أثر الكاميرا على النتيجة المرئية من دون تغيير بيانات المجسم.'
        ],
        flow: [
          'قراءة إدخال المستخدم وتحديث زاوية المدار أو مستوى التقريب.',
          'حساب موضع الكاميرا والمصفوفات الناتجة.',
          'تمرير المصفوفات الجديدة إلى الشيدر قبل الرسم.',
          'إعادة رسم المشهد من المنظور الجديد في كل إطار.'
        ],
        concepts: [
          'view matrix تمثل الكاميرا نفسها وليست تحويلاً على المجسم.',
          'حركة orbit تبقي الهدف في المركز غالباً وتغيّر موضع الكاميرا حوله.'
        ]
      };
    case 'viewport-ray-picking':
      return {
        problem: 'تحويل نقرة الشاشة إلى شعاع في فضاء العالم ثم اختبار تقاطعه مع مجسمات أو حدود اختيار.',
        importance: 'الالتقاط أساس التفاعل داخل المحررات وأدوات اختيار العناصر داخل المشاهد.',
        realUse: 'يستخدم في برامج التصميم والمحررات واختيار الكائنات داخل الـ viewport.',
        learning: [
          'تعلم كيف تحوَّل إحداثيات الشاشة إلى شعاع ثلاثي الأبعاد.',
          'معرفة لماذا تستخدم AABB كاختبار أولي سريع قبل الفحوص الأدق.',
          'فهم كيف تربط نتيجة الالتقاط بعنصر واجهة أو تمييز بصري داخل المشهد.'
        ],
        flow: [
          'قراءة موضع المؤشر داخل منفذ العرض.',
          'بناء شعاع من الكاميرا عبر مصفوفات الإسقاط والرؤية.',
          'اختبار تقاطع الشعاع مع حدود العناصر أو AABB.',
          'تمييز العنصر المصاب أو تحديث حالة الاختيار.'
        ],
        concepts: [
          'Picking لا يعتمد على الرسم وحده بل على الرياضيات المرتبطة بالكاميرا والمشهد.',
          'AABB حل تقريبي سريع يقلل عدد الاختبارات المكلفة على المجسمات المعقدة.'
        ]
      };
    case 'offscreen-postprocess-bloom':
      return {
        problem: 'رسم المشهد في صورة وسيطة ثم تطبيق معالجة لاحقة بدل رسم كل شيء مباشرة إلى خرج الشاشة.',
        importance: 'هذا هو الأساس لتأثيرات bloom وtone mapping وblur وغيرها من المؤثرات الحديثة.',
        realUse: 'تستخدم هذه الفكرة في المحركات الرسومية وسلاسل المؤثرات البصرية بعد إنهاء الرسم الأساسي.',
        learning: [
          'تعلم الفرق بين المرفق النهائي والمرفق الوسيط خارج الشاشة.',
          'معرفة لماذا يحتاج post-process إلى صورة وسيطة وsampler وpipeline إضافي.',
          'فهم كيف يركب التوهج أو المؤثر النهائي فوق الصورة الأساسية.'
        ],
        flow: [
          'إنشاء render targets خارج الشاشة وصور العينات التابعة لها.',
          'رسم المشهد الأساسي في الصورة الوسيطة.',
          'تمرير الصورة إلى pipeline معالجة لاحقة مثل bloom أو blur.',
          'دمج النتيجة النهائية ثم تقديمها إلى swapchain.'
        ],
        concepts: [
          'Image creation هنا لا يهدف للعرض المباشر بل لتمثيل render target وسيط.',
          'Texture sampling يقرأ الصورة الوسيطة داخل شيدر المؤثر عبر sampler مضبوط بدقة.'
        ]
      };
    case 'version-macros':
      return {
        problem: 'فهم كيف تخزن Vulkan أرقام الإصدارات داخل ماكروز وقيم رقمية مركبة بدلاً من أرقام متناثرة.',
        importance: 'هذا مهم عند فحص النسخ المدعومة أو مقارنة الإصدارات أو عرضها في الأدوات.',
        realUse: 'يستخدم في رسائل البداية وفحص توافق SDK والسائق والميزات الجديدة.',
        learning: [
          'تعلم ما الذي يبنيه VK_MAKE_API_VERSION أو VK_API_VERSION_1_3 فعلياً.',
          'معرفة كيف تقرأ major وminor وpatch من القيمة المركبة.',
          'فهم الفرق بين القيمة النصية والتمثيل العددي الرسمي داخل الواجهة.'
        ],
        flow: [
          'إنشاء أو قراءة قيمة الإصدار الرسمية.',
          'استخراج المكونات الرئيسية والفرعية والرقعة عند الحاجة.',
          'عرض الناتج أو مقارنته مع النسخ المطلوبة داخل التطبيق.'
        ],
        concepts: [
          'الماكرو هنا ينتج قيمة رقمية مركبة وليس مجرد نص.',
          'التعامل مع الإصدارات بهذه الصورة يمنع الأخطاء اليدوية في المقارنات.'
        ]
      };
    case 'handle-basics':
      return {
        problem: 'توضيح معنى الـ handle في Vulkan والفرق بين المقبض الفارغ والمقبض الصالح فعلياً.',
        importance: 'كثير من أخطاء البداية في Vulkan ناتج عن استخدام handle لم يُنشأ بعد أو دُمّر بالفعل.',
        realUse: 'يظهر هذا المفهوم في كل مورد تقريباً من VkInstance حتى VkBuffer وVkImage.',
        learning: [
          'تعلم لماذا يبدأ كثير من المقابض بقيمة VK_NULL_HANDLE.',
          'معرفة متى يختبر الكود قيمة handle ومتى لا يكفي ذلك وحده.',
          'فهم دورة حياة المورد من الإنشاء إلى التدمير.'
        ],
        flow: [
          'تعريف المقابض بحالة ابتدائية آمنة.',
          'تحديث المقبض بعد نجاح دالة الإنشاء المناسبة.',
          'اختبار حالة المقبض قبل استخدامه أو تحريره.',
          'إعادة المقبض إلى حالة فارغة بعد التنظيف عند الحاجة.'
        ],
        concepts: [
          'VK_NULL_HANDLE يدل على غياب المورد، لكنه لا يثبت صلاحية المورد عندما تكون القيمة غير فارغة.',
          'المقبض ليس الكائن نفسه بل مرجعاً تستخدمه الدوال للوصول إلى الكائن الداخلي.'
        ]
      };
    case 'glfw-triangle':
      return {
        problem: 'بناء أول برنامج رسم مكتمل نسبياً في Vulkan يبدأ من نافذة GLFW وينتهي بمثلث مرسوم على الشاشة.',
        importance: 'هذا المثال يجمع أكثر من مرحلة Vulkan في مسار واحد، لذلك يعد مرجعاً تعليمياً ممتازاً لبداية المشروع الحقيقي.',
        realUse: 'يستخدم كنقطة انطلاق لأي محرك أو تطبيق رسوميات قبل الانتقال إلى النماذج والمواد والواجهات.',
        learning: [
          'تعلم التسلسل الكامل من النافذة إلى السطح فالجهاز فالسلسلة فخط الأنابيب.',
          'معرفة كيف تتحول ملفات GLSL إلى SPIR-V ثم إلى shader modules داخل pipeline.',
          'فهم كيف تنتهي الدورة بأوامر رسم وتقديم فعلية على الشاشة.'
        ],
        flow: [
          'إنشاء نافذة GLFW وربط سطح Vulkan بها.',
          'إنشاء المثيل والجهاز والسلسلة الأساسية.',
          'تحميل الشيدرات وبناء render pass وgraphics pipeline.',
          'تسجيل command buffer يرسم مثلثاً واحداً.',
          'إرسال الإطار وتقديمه داخل الحلقة الرئيسية.'
        ],
        concepts: [
          'SPIR-V هو الصيغة الثنائية التي يستهلكها المشغل، لذلك لا يحمَّل GLSL الخام مباشرة داخل VkShaderModule.',
          'Pipeline configuration تحدد كيف يفسر GPU بيانات الرؤوس ويحوّلها إلى مثلث ظاهر.'
        ]
      };
    case 'texture-image':
    case 'multi-image-draw':
    case 'rotating-images':
      return {
        problem: 'تحويل بيانات الصور من ملفات أو ذاكرة إلى VkImage وVkImageView وVkSampler قابلة للعرض داخل الشيدر.',
        importance: 'كل واجهات الألعاب وواجهات المستخدم والمواد المرئية تعتمد على تحميل الصور وأخذ العينات منها بشكل صحيح.',
        realUse: 'يستخدم في sprites والواجهات والمواد والعناصر المرئية التي تحتاج صوراً أو أكثر من صورة.',
        learning: [
          'تعلم مسار تحميل الصورة وإنشاء VkImage وربط الذاكرة الخاصة بها.',
          'معرفة دور VkImageView وVkSampler وdescriptor sets في إيصال الصورة إلى الشيدر.',
          'فهم كيف تطبق التحويلات أو تعدد المواقع أو الدوران على الصور بعد تحميلها.'
        ],
        flow: [
          'قراءة بيانات الصورة أو الصور من الملفات.',
          'إنشاء VkImage ونقل البيانات إليها ثم إعداد image layout المناسب.',
          'إنشاء VkImageView وVkSampler وربطهما في descriptor set أو مسار الرسم.',
          'تحديث الإحداثيات أو المصفوفات ثم رسم الصور على الشاشة.'
        ],
        concepts: [
          'Image creation في Vulkan يتطلب وصفاً صريحاً للاستخدام والامتداد والذاكرة قبل أن تصبح الصورة صالحة للقراءة داخل الشيدر.',
          'Sampler يحدد طريقة أخذ العينات من الصورة مثل linear filtering أو nearest filtering.',
          'Texture sampling هو عملية قراءة texels داخل الشيدر، وليس مجرد الاحتفاظ بملف صورة داخل الذاكرة.'
        ]
      };
    case 'transform-rotation-scale':
      return {
        problem: 'تحريك العنصر وتدويره وتكبيره من خلال مصفوفة تحويل واضحة بدلاً من تعديل الرؤوس يدوياً في كل إطار.',
        importance: 'التحويلات أساس الحركة والتموضع والتدوير لكل العناصر ثنائية وثلاثية الأبعاد.',
        realUse: 'تستخدم في الألعاب والواجهات والمحاكيات وكل مشهد يتغير عبر الزمن.',
        learning: [
          'تعلم معنى Translation وRotation وScale ودور ترتيبها.',
          'معرفة كيف تمرر مصفوفة التحويل إلى الشيدر أو push constants.',
          'فهم أثر كل تحويل على النتيجة النهائية على الشاشة.'
        ],
        flow: [
          'تحديد قيم الموضع والدوران والتكبير الحالية.',
          'بناء مصفوفة التحويل من هذه القيم بالترتيب الصحيح.',
          'إرسال المصفوفة إلى الشيدر قبل الرسم.',
          'إعادة رسم العنصر في موضعه واتجاهه الجديدين.'
        ],
        concepts: [
          'ترتيب المصفوفات يغيّر النتيجة؛ فالدوران قبل الترجمة ليس هو الترجمة قبل الدوران.',
          'Rotation matrix تسمح بتدوير الصورة أو المجسم من دون تغيير بياناته الأصلية.'
        ]
      };
    case 'obj-model-loading':
      return {
        problem: 'قراءة نموذج OBJ وتحويله إلى رؤوس وفهارس يمكن رفعها إلى Vulkan ورسمها داخل pipeline رسومي.',
        importance: 'هذا هو الجسر بين ملفات النماذج الخارجية وموارد الرسم الفعلية داخل التطبيق.',
        realUse: 'يستخدم في العارضات والمحركات وأي برنامج يحتاج تحميل نماذج من أدوات التصميم.',
        learning: [
          'تعلم قراءة بيانات OBJ وفكها إلى رؤوس وفهارس.',
          'معرفة كيف تنشئ vertex buffer وindex buffer لهذه البيانات.',
          'فهم كيف يربط pipeline بين تنسيق الرؤوس وبيانات النموذج.'
        ],
        flow: [
          'قراءة ملف OBJ وتحويله إلى بيانات منظمة.',
          'إنشاء مخازن الرؤوس والفهارس ورفع البيانات إليها.',
          'ضبط pipeline على تنسيق الرؤوس المستخدم.',
          'ربط المخازن ورسم النموذج داخل الحلقة الرئيسية.'
        ],
        concepts: [
          'تنسيق Vertex يحدد كيف يقرأ الشيدر مواقع الرؤوس والخصائص الأخرى من الذاكرة.',
          'Index buffer يسمح بإعادة استخدام الرؤوس وتقليل البيانات المكررة.'
        ]
      };
    case 'glsl-file-pipeline':
      return {
        problem: 'قراءة شيفرات GLSL من ملفات منفصلة ثم تحويلها إلى SPIR-V وربطها بمرحلة إنشاء الـ pipeline بدل تضمينها نصياً.',
        importance: 'هذا الأسلوب هو الأقرب للبناء الاحترافي لأنه يفصل بين كود التطبيق وكود الشيدر ويسهّل إعادة الترجمة والتبديل.',
        realUse: 'تستخدمه المحركات والبرامج التعليمية وأدوات البناء التي تريد الاحتفاظ بالشيدرات في ملفات واضحة مستقلة.',
        learning: [
          'تعلم مسار glslangValidator من ملف GLSL إلى ملف SPIR-V.',
          'معرفة كيف تقرأ ملفات الشيدر الثنائية وتحوّلها إلى VkShaderModule.',
          'فهم كيف ترتبط الملفات الخارجية بإنشاء graphics pipeline أو compute pipeline.'
        ],
        flow: [
          'قراءة ملفات vertex وfragment shader من القرص.',
          'تحويلها إلى SPIR-V باستخدام glslangValidator أو مسار بناء مشابه.',
          'تحميل الملفات الثنائية داخل VkShaderModule.',
          'تمرير الوحدات إلى pipeline وإنهاء الإنشاء.'
        ],
        concepts: [
          'SPIR-V هو الصيغة التنفيذية المتفق عليها بين GLSL والمشغل داخل Vulkan.',
          'Pipeline configuration يستهلك shader stages المترجمة، لذلك نجاح التحويل جزء أساسي من نجاح الإنشاء.'
        ]
      };
    case 'device-info-dashboard':
      return {
        problem: 'جمع خصائص العتاد والذاكرة ومعلومات النظام في لوحة واحدة بدل الاكتفاء بأسماء مبعثرة أو معلومات غير قابلة للمقارنة.',
        importance: 'هذه المعلومات مهمة للتشخيص، واختيار الإعدادات، وعرض حالة الجهاز للمستخدم أو المطور.',
        realUse: 'تستخدم في شاشات الإعدادات وأدوات التشخيص ولوحات معلومات المحركات.',
        learning: [
          'تعلم كيف تقرأ اسم GPU وخصائصه وأنواع الذاكرة في Vulkan.',
          'معرفة كيف تجمع معلومات النظام مثل المعالج والرام ونظام التشغيل في واجهة واحدة.',
          'فهم الفرق بين خصائص VkPhysicalDevice ومعلومات النظام العامة.'
        ],
        flow: [
          'قراءة خصائص الجهاز الفيزيائي والحدود المدعومة.',
          'استعلام أحجام الذاكرة أو VRAM من heaps والخصائص المتعلقة بها.',
          'جمع معلومات المعالج والرام ونظام التشغيل من المنصة أو المكتبة المساندة.',
          'عرض النتيجة في لوحة أو سجل تشخيصي واضح.'
        ],
        concepts: [
          'VRAM لا تستخرج من اسم البطاقة بل من خصائص وheaps الذاكرة التي يكشفها المشغل.',
          'لوحات المعلومات المفيدة تعرض أرقاماً قابلة للفهم بدل الاكتفاء بعناوين عامة.'
        ]
      };
    case 'special-constants':
      return {
        problem: 'إزالة الغموض عن الثوابت الجاهزة والحدود القصوى التي تمر كثيراً في أمثلة Vulkan لكنها تبدو مبهمة من الاسم وحده.',
        importance: 'فهم هذه الثوابت يمنع استخدام أرقام حرفية ويجعل قراءة الكود أكثر دقة واحترافية.',
        realUse: 'تظهر في الذاكرة والمجالات الكاملة والمستويات والطبقات والمرسلات الخاصة بالصور والمزامنة.',
        learning: [
          'تعلم المعنى العملي لثوابت مثل VK_WHOLE_SIZE وVK_REMAINING_MIP_LEVELS ونحوها.',
          'معرفة متى تشير هذه القيم إلى "كل النطاق" أو "القيمة الخاصة" بدلاً من رقم حقيقي.',
          'فهم أين تستخدم عادة داخل الصور والذاكرة وعمليات الانتقال.'
        ],
        flow: [
          'قراءة الثابت أو الماكرو المراد استخدامه.',
          'ربطه بالسياق الصحيح مثل الحجم الكامل أو كل الطبقات أو التعداد الخارجي.',
          'تمريره إلى الحقل المناسب بدلاً من قيمة يدوية.'
        ],
        concepts: [
          'بعض ثوابت Vulkan ليست أرقاماً تنفيذية نهائية بقدر ما هي رموز خاصة ذات معنى اصطلاحي.',
          'اختيار الثابت الصحيح يختصر كثيراً من الكود ويعبّر عن النية بدقة أكبر من الأرقام المباشرة.'
        ]
      };
    case 'instance-cleanup':
      return {
        problem: 'تنظيف الموارد بالترتيب الصحيح قبل تدمير VkInstance حتى لا تبقى موارد حية تعتمد على موارد أعمق دُمّرت بالفعل.',
        importance: 'ترتيب التدمير مهم بقدر ترتيب الإنشاء في Vulkan لأن معظم الكائنات تعتمد على موارد أنشئت قبلها.',
        realUse: 'يظهر هذا المسار في نهاية كل تطبيق أو عند إعادة إنشاء أجزاء كبيرة من النظام مثل swapchain.',
        learning: [
          'تعلم كيف تحدد ترتيب التدمير العكسي اعتماداً على علاقات الاعتماد بين الموارد.',
          'معرفة متى يستخدم vkDeviceWaitIdle أو ما يشبهه قبل التنظيف.',
          'فهم الفرق بين التسرب المنطقي وتسرب الذاكرة أو بقاء موارد مشغولة.'
        ],
        flow: [
          'إيقاف العمل الجاري أو انتظار الخمول عند الحاجة.',
          'تحرير الموارد التابعة مثل الصور والمخازن والخطوط والـ framebuffers.',
          'تدمير الكائنات الأعم مثل device ثم surface أو window bindings.',
          'تدمير VkInstance في النهاية فقط.'
        ],
        concepts: [
          'التنظيف في Vulkan غالباً عكسي بالنسبة لمسار الإنشاء لأن التبعيات بنيت تدريجياً.',
          'ترك مورد حياً بعد تدمير مورده الأب يؤدي إلى أخطاء تحقق أو سلوك غير معرّف.'
        ]
      };
    default:
      return {
        problem: 'تجسيد خطوة حقيقية من خطوات Vulkan داخل مثال قابل للتتبع بدل الاكتفاء بمقطع كود منفصل عن السياق.',
        importance: 'الأمثلة التعليمية في Vulkan تنجح عندما توضح لماذا وضعت هذه الخطوة هنا وكيف تتصل بما قبلها وما بعدها.',
        realUse: 'يستعمل هذا النمط في التطبيقات الرسومية والمحركات وأدوات العرض التي تحتاج خطوات Vulkan واضحة ومرتبة.',
        learning: [
          'فهم المسار العملي الذي ينفذه المثال الحالي.',
          'تمييز العناصر الأساسية من الدوال والأنواع والثوابت داخل الكود.',
          'ربط نتيجة المثال بما سيبنى فوقه في تطبيق واقعي.'
        ],
        flow: buildExecutionFlowFromVariables(extractDeclaredVariables(example.code || ''), getVulkanExampleDisplayTitle(example)),
        concepts: [
          'كل مثال Vulkan في هذا القسم يشرح خطوة عملية قابلة لإعادة الاستخدام داخل مشروع أكبر.',
          'الروابط والـ tooltips تهدف إلى ربط الكود المحلي بصفحات التوثيق المحلية بدل ترك الرموز معزولة.'
        ]
      };
  }
}

function buildVulkanExamplePurposeParagraphs(example = {}) {
  const profile = getVulkanExampleTeachingProfile(example);
  return mergeUniqueTeachingItems(
    [example.goal || `يوضح ${getVulkanExampleDisplayTitle(example)} خطوة عملية من خطوات العمل داخل Vulkan.`],
    [`المشكلة التي يحلها المثال: ${profile.problem}`],
    [`لماذا هذا المثال مهم في Vulkan: ${profile.importance}`],
    [`أين يستخدم في التطبيقات الواقعية: ${profile.realUse}`]
  );
}

function buildVulkanExampleRequirements(example = {}) {
  return mergeUniqueTeachingItems(example.requirements || []);
}

function buildVulkanExampleLearningItems(example = {}) {
  return mergeUniqueTeachingItems(getVulkanExampleTeachingProfile(example).learning || []);
}

function buildVulkanExampleExecutionFlow(example = {}) {
  const profile = getVulkanExampleTeachingProfile(example);
  return mergeUniqueTeachingItems(profile.flow || []);
}

function buildVulkanExampleConcepts(example = {}) {
  const profile = getVulkanExampleTeachingProfile(example);
  const code = String(example?.code || '');
  const autoConcepts = [];

  if (/vkCreateImage|VkImage/.test(code)) {
    autoConcepts.push('Image creation في هذا المثال يعني إنشاء مورد صورة يصف الامتداد والاستعمال والذاكرة قبل أن يصبح صالحاً كـ texture أو render target.');
  }
  if (/VK_FILTER_LINEAR|vkCreateSampler|VkSampler/.test(code)) {
    autoConcepts.push('Linear filtering support مهم عندما تريد تنعيم قراءة النسيج أثناء التكبير أو التصغير بدلاً من أخذ أقرب texel فقط.');
    autoConcepts.push('Sampler يحدد طريقة قراءة texture داخل الشيدر من حيث التصفية والعنوان والمستوى، وليس مجرد مقبض شكلي ملازم للصورة.');
  }
  if (/sampler2D|texture\(/.test(code)) {
    autoConcepts.push('Texture sampling هو عملية قراءة لون أو قيمة من الصورة داخل الشيدر بناءً على إحداثيات UV وقواعد الـ sampler.');
  }
  if (/vkCreateGraphicsPipelines|VkGraphicsPipelineCreateInfo|VkPipeline/.test(code)) {
    autoConcepts.push('Pipeline configuration تجمع معظم حالة الرسم مسبقاً حتى يصبح تنفيذ الإطارات أسرع وأكثر قابلية للتوقع.');
  }
  if (/glslangValidator|SPIR-V/.test(JSON.stringify(example.commandBlocks || [])) || /glsl-file-pipeline/.test(String(example?.id || ''))) {
    autoConcepts.push('SPIR-V هو الصيغة الثنائية الوسطية التي ينتقل عبرها shader من GLSL إلى المشغل داخل Vulkan.');
  }

  return mergeUniqueTeachingItems(profile.concepts || [], autoConcepts);
}

function describeVulkanConstantTypicalUsage(name = '', constantItem = null, enumMeta = null) {
  const raw = String(name || '').trim();

  if (/^VK_STRUCTURE_TYPE_/.test(raw)) return 'يستخدم عادة عند تعبئة الحقل sType داخل البنى قبل تمريرها إلى دوال Vulkan.';
  if (/^VK_PRESENT_MODE_/.test(raw)) return 'يستخدم عادة عند اختيار نمط التقديم داخل VkSwapchainCreateInfoKHR.';
  if (/^VK_FORMAT_/.test(raw)) return 'يستخدم عادة عند اختيار تنسيقات الصور والمرفقات والمخازن وفق ما يدعمه الجهاز والسطح.';
  if (/^VK_IMAGE_LAYOUT_/.test(raw)) return 'يستخدم عادة عند توصيف layout الصور أثناء الانتقالات والـ render passes وعمليات النسخ.';
  if (/^VK_IMAGE_USAGE_/.test(raw)) return 'يستخدم عادة داخل حقول imageUsage عند إنشاء الصور أو render targets أو textures.';
  if (/^VK_BUFFER_USAGE_/.test(raw)) return 'يستخدم عادة داخل حقول usage عند إنشاء VkBuffer لتحديد كيف سيستعمل لاحقاً.';
  if (/^VK_MEMORY_PROPERTY_/.test(raw)) return 'يستخدم عادة أثناء اختيار memory type المناسبة للمورد المطلوب.';
  if (/^VK_FILTER_/.test(raw)) return 'يستخدم عادة عند إنشاء VkSampler لتحديد أسلوب تصفية قراءة texture.';
  if (/^VK_SAMPLER_ADDRESS_MODE_/.test(raw)) return 'يستخدم عادة داخل إعدادات VkSampler لتحديد سلوك العينات خارج حدود الصورة.';
  if (/^VK_PIPELINE_/.test(raw)) return 'يستخدم عادة داخل إعدادات الـ pipeline أو التبعيات أو نقاط الربط المرتبطة بمسار الرسم.';
  if (/^VK_QUEUE_/.test(raw)) return 'يستخدم عادة عند فحص خصائص عائلات الطوابير ومعرفة القدرات التي تدعمها.';
  if (/^VK_ATTACHMENT_/.test(raw)) return 'يستخدم عادة عند تعريف سلوك المرفقات داخل VkAttachmentDescription.';
  if (/^VK_COMPOSITE_ALPHA_/.test(raw)) return 'يستخدم عادة عند إنشاء swapchain لتحديد مزج الشفافية مع سطح النظام.';
  if (/^VK_SHARING_MODE_/.test(raw)) return 'يستخدم عادة عند إنشاء buffers أو images أو swapchain لتحديد مشاركة العائلات.';
  if (/^VK_(TRUE|FALSE)$/.test(raw)) return 'يستخدم عادة عندما تحتاج واجهة Vulkan قيمة منطقية رسمية بدل true وfalse الخاصتين باللغة.';
  if (raw === 'VK_NULL_HANDLE') return 'يستخدم عادة لتهيئة المقابض أو اختبار ما إذا كان المورد لم يُنشأ بعد أو تم تفريغه.';
  if (/_EXTENSION_NAME$/.test(raw)) return 'يستخدم عادة عند تفعيل امتداد رسمي داخل قوائم instance أو device extensions.';
  if (/^VK_REMAINING_/.test(raw) || /^VK_WHOLE_/.test(raw)) return 'يستخدم عادة للتعبير عن كامل النطاق أو بقية المستويات والطبقات بدلاً من حساب العدد يدوياً.';

  return enumMeta?.enumName
    ? `يستخدم عادة في المواضع التي تتطلب قيمة من ${enumMeta.enumName} داخل إعدادات Vulkan الرسمية.`
    : (constantItem?.description ? `يستخدم عادة في المواضع التي يشرحها هذا الثابت داخل API نفسها.` : 'يستخدم عادة داخل الحقول أو المقارنات التي تطلب هذا الرمز الرسمي بالاسم.');
}

function describeVulkanLineWhyUsed(line = '') {
  const trimmed = stripInlineComment(line).trim();
  const functionMatch = trimmed.match(/\b(vk[A-Za-z0-9_]+)\b/);

  if (/\.sType\s*=/.test(trimmed)) {
    return 'لأن Vulkan يعتمد على الحقل sType لمعرفة نوع البنية الفعلي قبل قراءة بقية الحقول.';
  }
  if (/\.pNext\s*=/.test(trimmed)) {
    return 'لأن سلسلة pNext يجب أن تكون واضحة: إما nullptr أو بنية امتدادية محددة بلا التباس.';
  }
  if (/\.format\s*=/.test(trimmed)) {
    return 'لأن التنسيق يحدد كيف ستفسر البتات داخل الصورة أو المرفق أو الهدف الرسومي.';
  }
  if (/\.layout\s*=/.test(trimmed)) {
    return 'لأن layout يحدد الحالة التي ستتعامل بها Vulkan مع الصورة في هذه المرحلة من المسار.';
  }
  if (/\.usage\s*=/.test(trimmed)) {
    return 'لأن حقل usage يعلن مسبقاً كيف سيستخدم المورد حتى يختار المشغل الذاكرة والمسار المناسبين.';
  }
  if (/\.presentMode\s*=/.test(trimmed)) {
    return 'لأن نمط التقديم يؤثر مباشرة في زمن التأخير وطريقة تدوير الصور على الشاشة.';
  }

  if (!functionMatch) {
    if (/^if\s*\(/.test(trimmed)) {
      return 'لأن المثال يحتاج التحقق من شرط تقني أو حالة نجاح قبل تنفيذ الخطوة التالية.';
    }
    if (/^return\b/.test(trimmed)) {
      return 'لأن النتيجة الحالية يجب أن تعاد إلى المستدعي أو لأن هذه نهاية منطقية للمسار الحالي.';
    }
    return 'لأن هذا السطر يجهز قيمة أو حالة ستحتاجها خطوة لاحقة من المثال.';
  }

  const functionName = functionMatch[1];
  if (/^vkCreate/.test(functionName)) return 'لأن هذه هي لحظة إنشاء الكائن الذي يعتمد عليه ما بعده من الموارد أو الخطوات.';
  if (/^vkDestroy/.test(functionName)) return 'لأن التنظيف الصحيح جزء أساسي من دورة حياة موارد Vulkan.';
  if (/^vkEnumerate/.test(functionName)) return 'لأن المثال يحتاج قراءة القائمة المدعومة فعلياً قبل اختيار أحد العناصر.';
  if (/^vkGet/.test(functionName)) return 'لأن القرار التالي يعتمد على خصائص أو بيانات لا يمكن افتراضها مسبقاً.';
  if (/^vkAllocate/.test(functionName)) return 'لأن المورد المنطقي لا يصبح قابلاً للاستخدام قبل حجز الذاكرة أو المساحة المرتبطة به.';
  if (/^vkBind/.test(functionName)) return 'لأن الربط هو الذي يصل بين المورد والمنفذ أو الحالة التي سيستخدم معها أثناء الرسم.';
  if (/^vkMap/.test(functionName)) return 'لأن المثال هنا يحتاج كتابة بيانات من جهة CPU داخل الذاكرة المرتبطة بالمورد.';
  if (/^vkAcquire/.test(functionName)) return 'لأن الإطار أو الصورة الحالية يجب أن تصبح متاحة قبل تسجيل العمل عليها.';
  if (/^vkCmd/.test(functionName)) return 'لأن أوامر GPU تسجل صراحة داخل Command Buffer قبل الإرسال إلى الطابور.';
  if (/^vkQueueSubmit$/.test(functionName)) return 'لأن الأوامر المسجلة لن تنفذ فعلياً حتى ترسل إلى الطابور المناسب.';
  if (/^vkQueuePresentKHR$/.test(functionName)) return 'لأن النتيجة النهائية يجب أن تطلب صراحة عرضها على الشاشة بعد انتهاء الرسم.';

  return 'لأن هذا الاستدعاء يمثل خطوة تنفيذية رسمية يحتاجها المسار الحالي داخل Vulkan.';
}

function describeVulkanLineWithoutEffect(line = '') {
  const trimmed = stripInlineComment(line).trim();
  const functionMatch = trimmed.match(/\b(vk[A-Za-z0-9_]+)\b/);

  if (/\.sType\s*=/.test(trimmed)) {
    return 'قد تفشل طبقات التحقق أو ترفض الدالة قراءة البنية لأن نوعها لم يعلن بوضوح.';
  }
  if (/\.pNext\s*=/.test(trimmed)) {
    return 'قد يبقى المؤشر بحالة غير معروفة أو تضيع البنى الامتدادية المطلوبة للمسار الحالي.';
  }
  if (/\.format\s*=/.test(trimmed)) {
    return 'لن يعرف المشغل كيف يفسر بيانات الصورة أو المرفق وقد يفشل الإنشاء أو يعطي ناتجاً غير صحيح.';
  }
  if (/\.layout\s*=/.test(trimmed)) {
    return 'قد تكتب أو تقرأ الصورة من layout غير مناسب مما يؤدي إلى أخطاء تحقق أو نتائج بصرية خاطئة.';
  }
  if (/\.usage\s*=/.test(trimmed)) {
    return 'قد ينشأ المورد من دون السماح بالاستخدام الذي يحتاجه المثال لاحقاً.';
  }

  if (!functionMatch) {
    if (/^if\s*\(/.test(trimmed)) {
      return 'قد يستمر المثال في مسار غير صالح تقنياً أو يتجاوز حالة فشل كان يجب التعامل معها.';
    }
    if (/^return\b/.test(trimmed)) {
      return 'قد يتابع التنفيذ بقيم غير صالحة أو يفقد المستدعي النتيجة التي ينتظرها من هذه الدالة.';
    }
    return 'ستفقد الخطوة التالية قيمة أو حالة كان يفترض أن تعتمد عليها.';
  }

  const functionName = functionMatch[1];
  if (/^vkCreateInstance$/.test(functionName)) return 'لن يملك التطبيق نقطة الدخول الأساسية إلى Vulkan، وبالتالي سيتوقف المسار كله.';
  if (/^vkEnumeratePhysicalDevices$/.test(functionName)) return 'لن يعرف التطبيق أي GPU متاح ولا يمكنه اختيار جهاز صالح للعمل.';
  if (/^vkCreateDevice$/.test(functionName)) return 'لن يحصل المثال على جهاز منطقي أو طوابير قابلة للاستخدام.';
  if (/^vkGetDeviceQueue$/.test(functionName)) return 'لن يملك المثال مقابض الطوابير التي ترسل إليها أوامر الرسم أو التقديم.';
  if (/^vkCreateBuffer$/.test(functionName)) return 'لن يوجد مخزن بيانات يمكن تعبئته أو ربطه بالذاكرة.';
  if (/^vkAllocateMemory$/.test(functionName)) return 'سيبقى المورد بلا ذاكرة فعلية ولن يصبح قابلاً للاستخدام.';
  if (/^vkBindBufferMemory$/.test(functionName)) return 'سيبقى المخزن موجوداً شكلياً لكنه غير مربوط بذاكرة صالحة.';
  if (/^vkMapMemory$/.test(functionName)) return 'لن يستطيع التطبيق كتابة البيانات من جهة CPU داخل المورد.';
  if (/^vkCreateSwapchainKHR$/.test(functionName)) return 'لن توجد صور قابلة للتقديم على النافذة.';
  if (/^vkGetSwapchainImagesKHR$/.test(functionName)) return 'لن يملك المثال مقابض الصور التي يبني فوقها image views وframebuffers.';
  if (/^vkCreateRenderPass$/.test(functionName)) return 'لن يملك المثال العقدة التي يتفق عبرها pipeline وframebuffer على المرفقات.';
  if (/^vkCreateGraphicsPipelines$/.test(functionName)) return 'لن يعرف GPU كيف يمرر البيانات عبر مراحل الرسم.';
  if (/^vkCreateImage$/.test(functionName)) return 'لن يوجد مورد صورة صالح للنسيج أو العمق أو المعالجة اللاحقة.';
  if (/^vkCreateSampler$/.test(functionName)) return 'لن يعرف الشيدر كيف يقرأ الصورة من حيث التصفية والعنوان.';
  if (/^vkCmdBindPipeline$/.test(functionName)) return 'قد تنفذ أوامر الرسم من دون حالة رسم محددة بوضوح.';
  if (/^vkCmdBindDescriptorSets$/.test(functionName)) return 'لن تصل الموارد مثل textures وuniforms إلى الشيدر كما يتوقع.';
  if (/^vkCmdBindVertexBuffers$/.test(functionName)) return 'لن يملك الرسم بيانات الرؤوس التي يبني منها المجسم أو الصورة.';
  if (/^vkCmdDraw/.test(functionName)) return 'لن يظهر شيء على الشاشة لأن أمر الرسم الفعلي لم يسجل.';
  if (/^vkAcquireNextImageKHR$/.test(functionName)) return 'لن يعرف المثال أي صورة من السلسلة متاحة لهذا الإطار.';
  if (/^vkQueueSubmit$/.test(functionName)) return 'ستظل الأوامر مسجلة فقط من دون تنفيذ فعلي على GPU.';
  if (/^vkQueuePresentKHR$/.test(functionName)) return 'قد ينجز الرسم داخلياً لكن النتيجة لن تعرض للمستخدم.';
  if (/^vkDestroy/.test(functionName)) return 'ستبقى الموارد حية أكثر من اللازم وقد تظهر تسريبات أو أخطاء ترتيب عند الإغلاق.';

  return 'سيغيب جزء تنفيذي أساسي من المسار الحالي، وقد يتعطل المثال أو يعطي نتيجة ناقصة.';
}

function buildVulkanExampleLineExplanationRows(example = {}, analysis = null) {
  const resolvedAnalysis = analysis || buildExampleAnalysis(example.code || '', example);
  return resolvedAnalysis.lineRows
    .filter((row) => /\b(vk|Vk|VK_)/.test(row.line) || /\.[A-Za-z_]\w*\s*=/.test(row.line) || /^if\s*\(/.test(row.line))
    .slice(0, 12)
    .map((row) => ({
      line: row.line,
      what: row.summary || describeCodeLinePrecisely(row.line, {variableIndex: resolvedAnalysis.variableIndex, item: example}),
      why: describeVulkanLineWhyUsed(row.line),
      without: describeVulkanLineWithoutEffect(row.line)
    }));
}

function buildVulkanExampleReferenceNames(example = {}, analysis = null, localSymbols = []) {
  const resolvedAnalysis = analysis || buildExampleAnalysis(example.code || '', example);
  return mergeUniqueTeachingItems(
    example.related || [],
    resolvedAnalysis.references.map(([name]) => name),
    resolvedAnalysis.tokenGroups.functions.map((entry) => entry.name),
    resolvedAnalysis.tokenGroups.types.map((entry) => entry.name),
    resolvedAnalysis.tokenGroups.constants.map((entry) => entry.name),
    resolvedAnalysis.tokenGroups.fields.map((entry) => entry.ownerType).filter(Boolean),
    localSymbols.map((entry) => entry.name)
  );
}

let vulkanReadyExamplePreviewRuntime = null;
function getVulkanReadyExamplePreviewRuntime() {
  if (vulkanReadyExamplePreviewRuntime) {
    return vulkanReadyExamplePreviewRuntime;
  }

  const creator = window.__ARABIC_VULKAN_VULKAN_READY_EXAMPLE_PREVIEW_RUNTIME__?.createVulkanReadyExamplePreviewRuntime;
  if (typeof creator !== 'function') {
    return null;
  }

  vulkanReadyExamplePreviewRuntime = creator({
    escapeAttribute,
    escapeHtml,
    getVulkanExampleDisplayTitle: (...args) => getVulkanExampleDisplayTitle(...args),
    localizeVulkanPreviewLabels,
    localizeVulkanUiText
  });
  return vulkanReadyExamplePreviewRuntime;
}

const renderVulkanReadyExampleFallbackPreview = (...args) => getVulkanReadyExamplePreviewRuntime()?.renderVulkanReadyExampleFallbackPreview?.(...args) || '';
const renderVulkanReadyExamplePreview = (...args) => getVulkanReadyExamplePreviewRuntime()?.renderVulkanReadyExamplePreview?.(...args) || renderVulkanReadyExampleFallbackPreview(...args);

const getGlslHomeSections = (...args) => glslHomeRuntime?.getGlslHomeSections?.(...args) || (getAppTextValue('GLSL_HOME_FALLBACK_META')?.sections || []).slice();
const buildGlslHomeLibraryModel = (...args) => glslHomeRuntime?.buildGlslHomeLibraryModel?.(...args) || ({
  key: 'glsl',
  title: getAppTextValue('GLSL_HOME_FALLBACK_META')?.displayName,
  iconType: 'glsl',
  kicker: 'مرجع الشيدر',
  description: getAppTextValue('GLSL_HOME_FALLBACK_META')?.description,
  totalCount: 0,
  headerActions: [],
  cards: [],
  quickLinks: [],
  recentIconType: 'glsl',
  recentItems: [],
  recentEmptyText: '',
  supportLinks: [],
  extraSectionsHtml: ''
});

function getSdl3KindMeta(kind) {
  const map = {
    function: {
      kind: 'function',
      dataKey: 'functions',
      title: 'الدوال',
      singular: 'دالة SDL3',
      icon: 'command',
      navType: 'sdl3-function',
      sectionId: 'sdl3-functions-list',
      routePrefix: 'sdl3-function',
      indexRoute: 'sdl3-functions'
    },
    type: {
      kind: 'type',
      dataKey: 'types',
      title: 'الأنواع والهياكل',
      singular: 'نوع/هيكل SDL3',
      icon: 'structure',
      navType: 'sdl3-type',
      sectionId: 'sdl3-types-list',
      routePrefix: 'sdl3-type',
      indexRoute: 'sdl3-types'
    },
    enum: {
      kind: 'enum',
      dataKey: 'enums',
      title: 'التعدادات',
      singular: 'تعداد SDL3',
      icon: 'enum',
      navType: 'sdl3-enum',
      sectionId: 'sdl3-enums-list',
      routePrefix: 'sdl3-enum',
      indexRoute: 'sdl3-enums'
    },
    constant: {
      kind: 'constant',
      dataKey: 'constants',
      title: 'الثوابت',
      singular: 'ثابت SDL3',
      icon: 'constant',
      navType: 'sdl3-constant',
      sectionId: 'sdl3-constants-list',
      routePrefix: 'sdl3-constant',
      indexRoute: 'sdl3-constants'
    },
    macro: {
      kind: 'macro',
      dataKey: 'macros',
      title: 'الماكرو',
      singular: 'ماكرو SDL3',
      icon: 'macro',
      navType: 'sdl3-macro',
      sectionId: 'sdl3-macros-list',
      routePrefix: 'sdl3-macro',
      indexRoute: 'sdl3-macros'
    }
  };
  return map[kind] || map.type;
}

function getSdl3EntityItems(dataKey) {
  const cacheKey = String(dataKey || '');
  if (sdl3EntityItemsCache.has(cacheKey)) {
    return sdl3EntityItemsCache.get(cacheKey);
  }

  let items;
  if (dataKey === 'structures' || dataKey === 'variables') {
    const wantStructures = dataKey === 'structures';
    items = (Array.isArray(sdl3EntityData?.types) ? sdl3EntityData.types : [])
      .filter((item) => wantStructures ? isSdl3StructTypeItem(item) : !isSdl3StructTypeItem(item));
  } else {
    items = Array.isArray(sdl3EntityData?.[dataKey]) ? sdl3EntityData[dataKey] : [];
  }

  sdl3EntityItemsCache.set(cacheKey, items);
  return items;
}

function getSdl3PackageOrder(packageKey) {
  const order = {
    core: 0,
    audio: 1,
    image: 2,
    mixer: 3,
    ttf: 4
  };
  return order[packageKey] ?? 99;
}

const SDL3_PACKAGE_KEYS = ['core', 'audio', 'image', 'mixer', 'ttf'];

function getSdl3PackageListId(packageKey) {
  return `sdl3-${String(packageKey || 'core')}-list`;
}

function getSdl3PackageClusterId(packageKey) {
  return `sdl3-${String(packageKey || 'core')}-cluster`;
}

function getSdl3PackageKeyFromClusterId(clusterId) {
  const match = /^sdl3-(core|audio|image|mixer|ttf)-cluster$/.exec(String(clusterId || ''));
  return match ? match[1] : '';
}

function getSdl3VisiblePackageKeys() {
  return SDL3_PACKAGE_KEYS.filter((packageKey) => !!getSdl3PackageInfo(packageKey) || !!SDL3_HOME_FALLBACK_PACKAGE_META[packageKey]);
}

function isSdl3StructTypeItem(item) {
  const cacheKey = String(item?.name || item?.syntax || '');
  if (cacheKey && sdl3StructTypeCache.has(cacheKey)) {
    return sdl3StructTypeCache.get(cacheKey);
  }

  const syntax = String(item?.syntax || '');
  let result = false;
  if ((item?.sourceCategories || []).includes('CategoryAPIStruct')) {
    result = true;
  } else if (/typedef\s+struct\b/i.test(syntax)) {
    result = true;
  } else {
    result = parseSdl3StructFields(syntax).length > 0;
  }

  if (cacheKey) {
    sdl3StructTypeCache.set(cacheKey, result);
  }
  return result;
}

function getSdl3TypeSectionDataKey(item) {
  return isSdl3StructTypeItem(item) ? 'structures' : 'variables';
}

function getSdl3ItemSectionDataKey(item) {
  if (!item) {
    return 'functions';
  }

  if (item.kind === 'type') {
    return getSdl3TypeSectionDataKey(item);
  }

  return getSdl3KindMeta(item.kind).dataKey;
}

function getSdl3CollectionMeta(dataKey) {
  const map = {
    functions: {
      ...getSdl3KindMeta('function')
    },
    structures: {
      kind: 'type',
      dataKey: 'structures',
      sourceDataKey: 'types',
      title: 'البنى',
      singular: 'بنية SDL3',
      icon: 'structure',
      navType: 'sdl3-type',
      routePrefix: 'sdl3-type',
      indexRoute: 'sdl3-structures'
    },
    variables: {
      kind: 'type',
      dataKey: 'variables',
      sourceDataKey: 'types',
      title: 'المتغيرات',
      singular: 'متغير/نوع SDL3',
      icon: 'variable',
      navType: 'sdl3-type',
      routePrefix: 'sdl3-type',
      indexRoute: 'sdl3-variables'
    },
    enums: {
      ...getSdl3KindMeta('enum')
    },
    constants: {
      ...getSdl3KindMeta('constant')
    },
    macros: {
      ...getSdl3KindMeta('macro')
    },
    types: {
      ...getSdl3KindMeta('type')
    }
  };

  return map[dataKey] || map.types;
}

function getSdl3PackagePracticalDomain(packageInfo) {
  const packageKey = String(packageInfo?.key || '').trim();
  if (packageKey === 'core') {
    return 'إدارة النوافذ والأحداث والإدخال والصوت والتكامل مع النظام والمنصات الرسومية';
  }
  if (packageKey === 'audio') {
    return 'فتح أجهزة الصوت، إدارة SDL_AudioStream، تحويل PCM، وتحميل WAV والاستعلام عن خصائص مسار الصوت';
  }
  if (packageKey === 'image') {
    return 'تحميل الصور والرسوم المتحركة وتحويلها إلى بيانات قابلة للاستخدام داخل SDL3';
  }
  if (packageKey === 'mixer') {
    return 'تحميل المؤثرات والمسارات الصوتية وتشغيلها ومزجها';
  }
  if (packageKey === 'ttf') {
    return 'تحميل الخطوط وتشكيل النصوص ورسمها';
  }
  return packageInfo?.description || 'هذا المجال من SDL3';
}

function buildSdl3PackageSectionReason(packageKey, dataKey) {
  const packageInfo = getSdl3PackageInfo(packageKey) || {};
  const displayName = packageInfo.displayName || packageInfo.packageName || 'SDL3';
  const domain = getSdl3PackagePracticalDomain(packageInfo);

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
    case 'enums':
      return `تظهر لأن ${displayName} يستخدم تعدادات رسمية لتحديد الحالات والخيارات والسياسات التي يجب أن تبقى مسماة وواضحة داخل الاستدعاءات.`;
    default:
      return `يظهر هذا الفرع لأنه يجمع العناصر المتشابهة وظيفيًا داخل ${displayName} بدل خلطها مع بقية الأنواع.`;
  }
}

function getAllSdl3ReferenceItems() {
  if (sdl3ReferenceItemsCache) {
    return sdl3ReferenceItemsCache;
  }

  if (sdl3ReferenceItemsBuilding) {
    return [];
  }

  sdl3ReferenceItemsBuilding = true;
  try {
    sdl3ReferenceItemsCache = [
      ...getSdl3EntityItems('functions'),
      ...getSdl3EntityItems('types'),
      ...getSdl3EntityItems('enums'),
      ...getSdl3EntityItems('constants'),
      ...getSdl3EntityItems('macros')
    ].map((item) => ({
      ...item,
      displayName: item.name,
      sectionKey: item.kind,
      sectionTitle: getSdl3KindMeta(item.kind).title,
      usage: item.remarks?.[0] || '',
      scope: item.categoryTitle || '',
      groupTitle: item.packageDisplayName || item.packageName || ''
    }));
    sdl3ReferenceItemLookupCache = new Map();
    sdl3ReferenceItemsCache.forEach((item) => {
      const candidateNames = [
        item?.name,
        item?.displayName,
        item?.referenceName,
        ...(Array.isArray(item?.aliases) ? item.aliases : [])
      ]
        .map((entry) => String(entry || '').trim())
        .filter(Boolean);
      candidateNames.forEach((candidate) => {
        if (!sdl3ReferenceItemLookupCache.has(candidate)) {
          sdl3ReferenceItemLookupCache.set(candidate, item);
        }
      });
    });

    return sdl3ReferenceItemsCache;
  } finally {
    sdl3ReferenceItemsBuilding = false;
  }
}

function findSdl3ItemByKind(kind, name) {
  const meta = getSdl3KindMeta(kind);
  const target = String(name || '').trim();
  if (!target) {
    return null;
  }

  const cacheKey = `${kind}:${meta.dataKey}`;
  if (!sdl3KindItemLookupCache.has(cacheKey)) {
    sdl3KindItemLookupCache.set(
      cacheKey,
      new Map(getSdl3EntityItems(meta.dataKey).map((item) => [item.name, item]))
    );
  }

  return sdl3KindItemLookupCache.get(cacheKey).get(target) || null;
}

function getSdl3CoreSymbolIndexLookup() {
  if (sdl3CoreSymbolIndexLookup) {
    return sdl3CoreSymbolIndexLookup;
  }

  sdl3CoreSymbolIndexLookup = new Map(
    (Array.isArray(sdl3CoreSymbolIndex) ? sdl3CoreSymbolIndex : [])
      .filter((entry) => Array.isArray(entry) && entry[0] && entry[1])
      .map(([name, kind]) => [String(name).trim(), {name: String(name).trim(), kind: String(kind).trim(), packageKey: 'core'}])
  );
  return sdl3CoreSymbolIndexLookup;
}

function findSdl3CoreSymbolSeedByName(name) {
  const target = String(name || '').trim();
  if (!target) {
    return null;
  }
  return getSdl3CoreSymbolIndexLookup().get(target) || null;
}

function getSdl3FunctionRelations() {
  if (Array.isArray(sdl3EntityData?.functions) && sdl3EntityData.functions.length) {
    return sdl3EntityData.functions.map((item) => ({
      name: item.name,
      packageKey: item.packageKey,
      action: getSdl3NameAction(item),
      objectKey: getSdl3ObjectKeyForItem(item),
      returnType: parseSdl3FunctionSignature(item.syntax || '').returnType
    }));
  }
  return Array.isArray(sdl3CoreFunctionRelations) ? sdl3CoreFunctionRelations : [];
}

function getSdl3EntityDetailPreloadDataKeys(kind) {
  switch (String(kind || '').trim()) {
    case 'function':
      return ['functions', 'types', 'enums', 'constants'];
    case 'type':
      return ['types', 'functions'];
    case 'enum':
      return ['enums'];
    case 'constant':
      return ['constants', 'enums'];
    case 'macro':
      return ['macros', 'functions'];
    default:
      return ['functions'];
  }
}

async function ensureSdl3EntityDetailData(kind, name) {
  const packageKey = inferSdl3PackageKeyFromSymbolName(name);
  if (packageKey !== 'core') {
    await ensureSdl3PackageData(packageKey);
    return;
  }

  const dataKeys = getSdl3EntityDetailPreloadDataKeys(kind);
  await Promise.all(dataKeys.map((dataKey) => ensureSdl3PackageKindData('core', dataKey)));
}

let SDL3_SYNTHETIC_REFERENCE_OVERRIDES = Object.freeze({});

function inferSdl3PackageKeyFromSymbolName(name) {
  const token = String(name || '').trim();
  if (/^IMG_/.test(token)) return 'image';
  if (/^MIX_/.test(token)) return 'mixer';
  if (/^TTF_/.test(token)) return 'ttf';
  if (/^SDL_Audio/.test(token) || /^SDL_AUDIO_/.test(token) || /^SDL_LoadWAV(?:_IO)?$/.test(token) || /^SDL_MixAudio$/.test(token)) return 'audio';
  return 'core';
}

function buildSdl3SyntheticReferenceItem(name, overrides = {}, referenceItem = null) {
  const packageKey = overrides.packageKey || referenceItem?.packageKey || inferSdl3PackageKeyFromSymbolName(name);
  const packageInfo = getSdl3PackageInfo(packageKey);
  const kind = overrides.kind || referenceItem?.kind || 'macro';
  return {
    name: String(name || '').trim(),
    displayName: String(name || '').trim(),
    kind,
    packageKey,
    packageName: overrides.packageName || referenceItem?.packageName || packageInfo?.packageName || packageInfo?.displayName || 'SDL3',
    packageDisplayName: overrides.packageDisplayName || referenceItem?.packageDisplayName || packageInfo?.displayName || packageInfo?.packageName || 'SDL3',
    categoryTitle: overrides.categoryTitle || referenceItem?.categoryTitle || '',
    description: overrides.description || '',
    referenceName: overrides.referenceName || referenceItem?.referenceName || referenceItem?.name || '',
    syntheticNavigateKind: overrides.syntheticNavigateKind || referenceItem?.kind || '',
    syntheticNavigateTo: overrides.syntheticNavigateTo || referenceItem?.name || '',
    syntheticTooltip: overrides.syntheticTooltip || '',
    syntheticKind: overrides.syntheticKind || '',
    officialUrl: overrides.officialUrl || referenceItem?.officialUrl || ''
  };
}

function buildSdl3SyntheticPropertyReference(name, referenceItem) {
  return buildSdl3SyntheticReferenceItem(name, {
    kind: 'macro',
    syntheticKind: 'property-macro',
    referenceName: referenceItem?.name || '',
    syntheticNavigateKind: referenceItem?.kind || 'function',
    syntheticNavigateTo: referenceItem?.name || '',
    description: referenceItem?.name ? `Please refer to ${referenceItem.name} for details.` : ''
  }, referenceItem);
}

function getSdl3SyntheticReferenceLookup() {
  if (sdl3SyntheticReferenceLookupCache) {
    return sdl3SyntheticReferenceLookupCache;
  }

  const lookup = new Map();
  const items = getAllSdl3ReferenceItems();
  const realLookup = sdl3ReferenceItemLookupCache || new Map();

  items.forEach((item) => {
    (item?.remarks || []).forEach((remark) => {
      const normalized = normalizeSdl3PropertyRemarkText(remark);
      const propertyMatch = /^((?:SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+)\s*:/.exec(normalized);
      if (!propertyMatch) {
        return;
      }

      const propertyName = propertyMatch[1];
      if (!realLookup.has(propertyName) && !lookup.has(propertyName)) {
        lookup.set(propertyName, buildSdl3SyntheticPropertyReference(propertyName, item));
      }
    });
  });

  items.forEach((item) => {
    const mentionedProperties = new Set();
    [item?.description || '', item?.syntax || '', ...(item?.remarks || [])].forEach((text) => {
      collectSdl3PropertyNames(text).forEach((propertyName) => {
        mentionedProperties.add(propertyName);
      });
    });

    mentionedProperties.forEach((propertyName) => {
      if (!realLookup.has(propertyName) && !lookup.has(propertyName)) {
        lookup.set(propertyName, buildSdl3SyntheticPropertyReference(propertyName, item));
      }
    });
  });

  Object.entries(SDL3_SYNTHETIC_REFERENCE_OVERRIDES).forEach(([name, override]) => {
    if (!realLookup.has(name) && !lookup.has(name)) {
      lookup.set(name, buildSdl3SyntheticReferenceItem(name, override));
    }
  });

  sdl3SyntheticReferenceLookupCache = lookup;
  return lookup;
}

function findSdl3AnyItemByName(name) {
  const target = String(name || '').trim();
  if (!target) {
    return null;
  }

  if (!sdl3ReferenceItemLookupCache) {
    getAllSdl3ReferenceItems();
  }

  return sdl3ReferenceItemLookupCache?.get(target)
    || getSdl3SyntheticReferenceLookup().get(target)
    || null;
}

function getSdl3ReferenceItem(rawName) {
  return findSdl3AnyItemByName(rawName);
}

function splitSdl3IdentifierWords(name) {
  const normalized = String(name || '')
    .replace(/^(SDL|IMG|Mix|MIX|TTF)_?/, '')
    .trim();

  if (!normalized) {
    return [];
  }

  if (normalized.includes('_')) {
    return normalized.split('_').filter(Boolean);
  }

  return normalized.match(/[A-Z]+(?=[A-Z][a-z0-9]|\b)|[A-Z]?[a-z]+|[0-9]+/g) || [normalized];
}

let SDL3_ARABIC_WORD_MAP = Object.freeze({});

let SDL3_CATEGORY_TITLE_MAP = Object.freeze({});

let SDL3_TOOLTIP_CONTENT_OVERRIDES = Object.freeze({});

function normalizeSdl3CategoryLabel(label) {
  return String(label || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateSdl3CategoryLabel(label) {
  const normalized = normalizeSdl3CategoryLabel(label);
  if (!normalized) {
    return '';
  }

  const direct = SDL3_CATEGORY_TITLE_MAP[normalized];
  if (direct) {
    return direct;
  }

  const apiMatch = normalized.match(/^(SDL3(?:_(?:image|mixer|ttf))?) API$/);
  if (apiMatch) {
    return `واجهة ${apiMatch[1]}`;
  }

  if (/^SDL3(?:_(?:image|mixer|ttf))?$/.test(normalized)) {
    return normalized;
  }

  const translated = normalized
    .replace(/\band\b/gi, ' و ')
    .split(/\s+/)
    .map((token) => translateSdl3Word(token))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return translated || normalized;
}

function joinSdl3CategoryTrail(...parts) {
  return parts
    .map((part) => translateSdl3CategoryLabel(part))
    .filter(Boolean)
    .join(' / ');
}

function translateSdl3Word(word) {
  const direct = SDL3_ARABIC_WORD_MAP[word];
  if (direct) {
    return direct;
  }

  const titleCaseWord = /^[a-z]/.test(word)
    ? word.charAt(0).toUpperCase() + word.slice(1)
    : word;
  const titleCaseDirect = SDL3_ARABIC_WORD_MAP[titleCaseWord];
  if (titleCaseDirect) {
    return titleCaseDirect;
  }

  if (/^[A-Z0-9_]+$/.test(word)) {
    return word;
  }

  const singular = word.replace(/s$/, '');
  if (singular !== word && SDL3_ARABIC_WORD_MAP[singular]) {
    return SDL3_ARABIC_WORD_MAP[singular];
  }

  return word;
}

function translateSdl3LoosePhrase(text) {
  return String(text || '')
    .replace(/\b[A-Za-z]{2,}\b/g, (token) => translateSdl3Word(token))
    .replace(/\s+/g, ' ')
    .trim();
}

function humanizeSdl3Words(words = []) {
  return words
    .map((word) => translateSdl3Word(word))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSdl3NameMeaning(item) {
  const words = splitSdl3IdentifierWords(item?.name || '');
  if (!words.length) {
    return 'كيان من SDL3 له شرح محلي داخل المشروع.';
  }

  const [first, ...restWords] = words;
  const objectText = getSdl3ObjectMeaning(restWords, item) || humanizeSdl3Words(words);
  const verbMap = {
    Add: `يضيف ${objectText}`.trim(),
    Close: `يغلق ${objectText}`.trim(),
    Convert: `يحوّل ${objectText}`.trim(),
    Create: `ينشئ ${objectText}`.trim(),
    Destroy: `يحرر ${objectText}`.trim(),
    Free: `يحرر ${objectText}`.trim(),
    Get: `يجلب ${objectText}`.trim(),
    Has: `يتحقق من وجود ${objectText}`.trim(),
    Hide: `يخفي ${objectText}`.trim(),
    Init: `يهيئ ${objectText}`.trim(),
    Is: `يتحقق مما إذا كان ${objectText}`.trim(),
    Load: `يحمّل ${objectText}`.trim(),
    Lock: `يقفل ${objectText}`.trim(),
    Open: `يفتح ${objectText}`.trim(),
    Pause: `يوقف مؤقتًا ${objectText}`.trim(),
    Query: `يستعلم عن ${objectText}`.trim(),
    Remove: `يزيل ${objectText}`.trim(),
    Reset: `يعيد ضبط ${objectText}`.trim(),
    Save: `يحفظ ${objectText}`.trim(),
    Set: `يضبط ${objectText}`.trim(),
    Show: `يعرض ${objectText}`.trim(),
    Start: `يبدأ ${objectText}`.trim(),
    Stop: `يوقف ${objectText}`.trim(),
    Unlock: `يفك قفل ${objectText}`.trim(),
    Update: `يحدّث ${objectText}`.trim(),
    Wait: `ينتظر ${objectText}`.trim()
  };

  if (verbMap[first]) {
    return `${verbMap[first]}.`;
  }

  if (item?.kind === 'enum') {
    return `تعداد يحدد حالات أو خيارات ${objectText || item.name}.`;
  }
  if (item?.kind === 'constant') {
    return `قيمة ثابتة تمثل ${objectText || item.name}.`;
  }
  if (item?.kind === 'macro') {
    if (/_PROP_/.test(item?.name || '')) {
      return `اسم خاصية يُستخدم مع نظام الخصائص في SDL3 لتمرير إعداد مرتبط بـ ${objectText || item.name}.`;
    }
    return `ماكرو يعرّف ${objectText || item.name}.`;
  }
  if (item?.kind === 'type') {
    return `نوع أو هيكل يمثل ${objectText || item.name}.`;
  }

  return `كيان من SDL3 مرتبط بـ ${objectText || item.name}.`;
}

function normalizeSdl3DocValue(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function translateSdl3DocFragment(text) {
  return normalizeSdl3DocValue(text)
    .replace(/\bboth fonts\b/gi, 'الخطين')
    .replace(/\bfallback fonts\b/gi, 'الخطوط الاحتياطية')
    .replace(/\bfallback font\b/gi, 'الخط الاحتياطي')
    .replace(/\bfont size\b/gi, 'حجم الخط')
    .replace(/\bglyphs\b/gi, 'المحارف المرسومة')
    .replace(/\bglyph\b/gi, 'محرف مرسوم')
    .replace(/\bcharacters\b/gi, 'المحارف')
    .replace(/\bcharacter\b/gi, 'محرف')
    .replace(/\bfonts\b/gi, 'الخطوط')
    .replace(/\bfont\b/gi, 'الخط')
    .replace(/\bstyle\b/gi, 'النمط')
    .replace(/\btext rendering\b/gi, 'عرض النص')
    .replace(/\bmixer\b/gi, 'المِكسر')
    .replace(/\baudio decoder\b/gi, 'مفكك الترميز الصوتي')
    .replace(/\baudio format\b/gi, 'تنسيق الصوت')
    .replace(/\bduration\b/gi, 'المدة')
    .replace(/\bgain\b/gi, 'الكسب')
    .replace(/\bratio\b/gi, 'النسبة')
    .replace(/\bremaining\b/gi, 'المتبقي')
    .replace(/\bsample rate\b/gi, 'معدل العينات')
    .replace(/\bsample frames\b/gi, 'إطارات العينات')
    .replace(/\bsample frame\b/gi, 'إطار عينة')
    .replace(/\bsamples\b/gi, 'العينات')
    .replace(/\bsample\b/gi, 'العينة')
    .replace(/\bgiven decoder is invalid\b/gi, 'كان مفكك الترميز المعطى غير صالح')
    .replace(/\bif there is no metadata available\b/gi, 'إذا لم تكن البيانات الوصفية متاحة')
    .replace(/\bmetadata\b/gi, 'البيانات الوصفية')
    .replace(/\bcontaining\b/gi, 'الذي يحتوي')
    .replace(/\breceiving\b/gi, 'الذي يستقبل')
    .replace(/\brepresents?\b/gi, 'يمثل')
    .replace(/\bseries of images\b/gi, 'سلسلة من الصور')
    .replace(/\bnext frame in the animation\b/gi, 'الإطار التالي في الرسوم المتحركة')
    .replace(/\bduration of the frame\b/gi, 'مدة الإطار')
    .replace(/\bleave it open\b/gi, 'اتركه مفتوحًا')
    .replace(/\bwhen done\b/gi, 'عند الانتهاء')
    .replace(/\btwo threads should not attempt to close the same object\b/gi, 'لا يجوز لخيطين محاولة إغلاق الكائن نفسه')
    .replace(/\bautomatically detect file types\b/gi, 'التعرف على أنواع الملفات تلقائيًا')
    .replace(/\bbefore returning\b/gi, 'قبل العودة')
    .replace(/\banimation decoder\b/gi, 'مفكك الرسوم المتحركة')
    .replace(/\banimation encoder\b/gi, 'مشفر الرسوم المتحركة')
    .replace(/\banimation stream\b/gi, 'مجرى الرسوم المتحركة')
    .replace(/^the\s+/i, '')
    .replace(/\bon success\b/gi, 'عند النجاح')
    .replace(/\bon failure\b/gi, 'عند الفشل')
    .replace(/\bon error\b/gi, 'عند الخطأ')
    .replace(/\bif this function fails\b/gi, 'إذا فشلت هذه الدالة')
    .replace(/\bif this function succeeds\b/gi, 'إذا نجحت هذه الدالة')
    .replace(/\bif it exists\b/gi, 'إن كان موجودًا')
    .replace(/\bif available\b/gi, 'إن كان متاحًا')
    .replace(/\bfrom another thread\b/gi, 'من خيط آخر')
    .replace(/\bfrom any thread\b/gi, 'من أي خيط')
    .replace(/\bmain thread\b/gi, 'الخيط الرئيسي')
    .replace(/\bthread-safe\b/gi, 'آمن بين الخيوط')
    .replace(/\bthread safe\b/gi, 'آمن بين الخيوط')
    .replace(/\bnot thread safe\b/gi, 'غير آمن بين الخيوط')
    .replace(/\bmutex\b/gi, 'mutex')
    .replace(/\blocked\b/gi, 'مقفلة')
    .replace(/\blocking\b/gi, 'حاجبة')
    .replace(/\bnon-blocking\b/gi, 'غير حاجبة')
    .replace(/\breturned\b/gi, 'المعادة')
    .replace(/\breturn(?:ed|ing)?\b/gi, 'إرجاع')
    .replace(/\bproperty set\b/gi, 'مجموعة الخصائص')
    .replace(/\bproperty\b/gi, 'خاصية')
    .replace(/\bproperties\b/gi, 'خصائص')
    .replace(/\bpointer\b/gi, 'مؤشر')
    .replace(/\barray\b/gi, 'مصفوفة')
    .replace(/\barrays\b/gi, 'مصفوفات')
    .replace(/\blinked list\b/gi, 'قائمة مترابطة')
    .replace(/\bstring\b/gi, 'سلسلة نصية')
    .replace(/\bstrings\b/gi, 'سلاسل نصية')
    .replace(/\bsurface\b/gi, 'سطح')
    .replace(/\bsurfaces\b/gi, 'أسطح')
    .replace(/\btexture\b/gi, 'خامة')
    .replace(/\btextures\b/gi, 'خامات')
    .replace(/\bcursor\b/gi, 'مؤشر')
    .replace(/\bcursors\b/gi, 'مؤشرات')
    .replace(/\bobject\b/gi, 'كائن')
    .replace(/\bobjects\b/gi, 'كائنات')
    .replace(/\bframe\b/gi, 'إطار')
    .replace(/\bframes\b/gi, 'إطارات')
    .replace(/\bstream\b/gi, 'مجرى')
    .replace(/\btracks\b/gi, 'المسارات')
    .replace(/\btrack\b/gi, 'المسار')
    .replace(/\bpalette\b/gi, 'لوحة ألوان')
    .replace(/\bdevice\b/gi, 'الجهاز')
    .replace(/\bdevices\b/gi, 'الأجهزة')
    .replace(/\bqueue\b/gi, 'الطابور')
    .replace(/\bcallback\b/gi, 'رد النداء')
    .replace(/\bdata\b/gi, 'البيانات')
    .replace(/\bfiles\b/gi, 'الملفات')
    .replace(/\bfile\b/gi, 'الملف')
    .replace(/\bmemory\b/gi, 'الذاكرة')
    .replace(/\ballocation\b/gi, 'التخصيص')
    .replace(/\bfile extension\b/gi, 'امتداد الملف')
    .replace(/\bfile extensions\b/gi, 'امتدادات الملفات')
    .replace(/\bfile type\b/gi, 'نوع الملف')
    .replace(/\bcurrent working directory\b/gi, 'مجلد العمل الحالي')
    .replace(/\buser directory\b/gi, 'مجلد المستخدم')
    .replace(/\bmilliseconds\b/gi, 'مللي ثانية')
    .replace(/\bnanoseconds\b/gi, 'نانوثانية')
    .replace(/\bmicroseconds\b/gi, 'ميكروثانية')
    .replace(/\bseconds\b/gi, 'ثوانٍ')
    .replace(/\bbytes\b/gi, 'بايتات')
    .replace(/\bbyte\b/gi, 'بايت')
    .replace(/\bpath separator\b/gi, 'فاصل المسار')
    .replace(/\bclosed\b/gi, 'مغلق')
    .replace(/\bopen\b/gi, 'مفتوح')
    .replace(/\bfreed\b/gi, 'محرر')
    .replace(/\bfree\b/gi, 'تحرير')
    .replace(/\bfailure\b/gi, 'فشل')
    .replace(/\bsuccess\b/gi, 'نجاح')
    .replace(/\berror code\b/gi, 'رمز خطأ')
    .replace(/\berror\b/gi, 'خطأ')
    .replace(/\bvalid\b/gi, 'صالح')
    .replace(/\binvalid\b/gi, 'غير صالح')
    .replace(/\bdefault\b/gi, 'الافتراضي')
    .replace(/\bowned by\b/gi, 'مملوك من')
    .replace(/\bowned internally by\b/gi, 'مملوك داخليًا من')
    .replace(/\bcaller\b/gi, 'المستدعي')
    .replace(/\bconst memory\b/gi, 'ذاكرة ثابتة')
    .replace(/\bdo not free it\b/gi, 'ولا يجوز تحريره يدويًا')
    .replace(/\bshould be freed\b/gi, 'يجب تحريره')
    .replace(/\bshould be closed\b/gi, 'يجب إغلاقه')
    .replace(/\bshould be paired with\b/gi, 'يجب أن يقترن مع')
    .replace(/\bshould be called\b/gi, 'يجب استدعاؤه')
    .replace(/\bshould not be called\b/gi, 'لا يجوز استدعاؤه')
    .replace(/\bmust be\b/gi, 'يجب أن يكون')
    .replace(/\bcan be\b/gi, 'يمكن أن يكون')
    .replace(/\bcan\b/gi, 'يمكنه')
    .replace(/\bwill be\b/gi, 'سيكون')
    .replace(/\bwill\b/gi, 'سيقوم')
    .replace(/\busing\b/gi, 'باستخدام')
    .replace(/\bwith\b/gi, 'مع')
    .replace(/\band\b/gi, 'و')
    .replace(/\bor\b/gi, 'أو')
    .replace(/\bwhen\b/gi, 'عند')
    .replace(/\bto\b/gi, 'إلى')
    .replace(/\bfor\b/gi, 'لـ')
    .replace(/\bof\b/gi, 'لـ')
    .replace(/\bin\b/gi, 'في')
    .replace(/\b(?:a|an|the)\b(?=\s+[\u0600-\u06FF])/gi, '')
    .replace(/\sat the same time\b/gi, 'في الوقت نفسه')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSdl3ReturnFallback(item) {
  let raw = normalizeSdl3DocValue(item?.returns || '');
  if (!raw) {
    return '';
  }

  let match = /^\(([^)]+)\)\s*Returns\s+(.+)$/i.exec(raw);
  if (match) {
    raw = normalizeSdl3DocValue(match[2]);
  } else {
    raw = raw.replace(/^Returns\s+/i, '');
  }

  match = /^true on success or false on failure(?:;\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for more information)?\.?$/i.exec(raw);
  if (match) {
    return `تعيد true عند النجاح وfalse عند الفشل${match[1] ? `، ويمكن استدعاء ${match[1]}() لمعرفة سبب الفشل` : ''}.`;
  }

  match = /^0 on success(?:,|\s+or)\s*-1 on (?:error|failure)\.?$/i.exec(raw);
  if (match) {
    return 'تعيد 0 عند النجاح و-1 عند الفشل.';
  }

  match = /^0 on success or a negative error code on failure(?:;\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for more information)?\.?$/i.exec(raw);
  if (match) {
    return `تعيد 0 عند النجاح أو رمز خطأ سالبًا عند الفشل${match[1] ? `، ويمكن استخدام ${match[1]}() لمعرفة السبب` : ''}.`;
  }

  match = /^(?:the new|a new|a valid)\s+([A-Za-z0-9_ *]+?)\s+(?:on success|,)\s+or NULL on (?:failure|error)(?:;\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for more information)?\.?$/i.exec(raw);
  if (match) {
    return `تعيد ${translateSdl3DocFragment(match[1])} صالحًا أو جديدًا عند النجاح، أو NULL عند الفشل${match[2] ? `، ويمكن استدعاء ${match[2]}() لمعرفة السبب` : ''}.`;
  }

  match = /^SDL surface,\s*or NULL on error\.?$/i.exec(raw);
  if (match) {
    return 'تعيد SDL_Surface صالحًا عند النجاح، أو NULL عند الخطأ.';
  }

  match = /^a new SDL surface,\s*or NULL if no supported/i.exec(raw);
  if (match) {
    return 'تعيد SDL_Surface جديدًا عند نجاح القراءة أو الفك، أو NULL إذا لم يوجد تنسيق أو مفكك مدعوم.';
  }

  match = /^a new SDL_Surface containing the decoded frame,\s+or NULL/i.exec(raw);
  if (match) {
    return 'تعيد SDL_Surface جديدًا يحتوي الإطار المفكوك، أو NULL عند الفشل.';
  }

  match = /^true if this is\s+(.+?)\s+data,\s*false otherwise\.?$/i.exec(raw);
  if (match) {
    return `تعيد true إذا كانت البيانات من نوع ${match[1].trim()}، وfalse إذا لم تكن كذلك.`;
  }

  match = /^a SDL_PropertiesID containing the\s+(.+?),\s+or 0 if there is no\s+(.+?)\s+available\.?$/i.exec(raw);
  if (match) {
    return `تعيد SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}، أو 0 إذا لم تكن ${translateSdl3DocFragment(match[2])} متاحة.`;
  }

  match = /^a SDL_PropertiesID containing the\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تعيد SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^the properties ID of the\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تعيد معرّف الخصائص الخاص بـ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^the presentation timestamp in milliseconds\.?$/i.exec(raw);
  if (match) {
    return 'تعيد ختم العرض الزمني للإطار بوحدة المللي ثانية.';
  }

  match = /^the status of the underlying decoder,\s+or\s+([A-Z0-9_]+)\s+if\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    if (/^given decoder is invalid$/i.test(String(match[2] || '').trim())) {
      return `تعيد حالة مفكك الترميز الداخلي، أو ${match[1]} إذا كان مفكك الترميز المعطى غير صالح.`;
    }
    return `تعيد حالة مفكك الترميز الداخلي، أو ${match[1]} إذا ${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^a valid property ID on success or 0 on failure\.?$/i.exec(raw);
  if (match) {
    return 'تعيد معرّف خصائص صالحًا عند النجاح، أو 0 عند الفشل.';
  }

  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  if (!signature.returnType || signature.returnType === 'void') {
    return 'لا تعيد قيمة مباشرة، بل يظهر أثرها في المورد أو الحالة التي تعدلها.';
  }
  if (/\*/.test(signature.returnType)) {
    return `تعيد مؤشرًا من النوع ${signature.returnType}، ويجب التحقق من أنه ليس NULL قبل استخدامه.`;
  }
  if (/\bbool\b/i.test(signature.returnType)) {
    return 'تعيد true عند النجاح وfalse عند الفشل.';
  }
  if (/\b(?:int|Sint\d+|Uint\d+|size_t)\b/.test(signature.returnType)) {
    return `تعيد قيمة من النوع ${signature.returnType} تمثل نتيجة العملية أو حالتها، ويجب تفسيرها وفق هذا الاستدعاء.`;
  }
  return `تعيد قيمة من النوع ${signature.returnType} تمثل نتيجة هذا الاستدعاء.`;
}




function joinUniqueSdl3ArabicTexts(parts = [], limit = parts.length) {
  const unique = [];
  const seen = new Set();

  parts.forEach((entry) => {
    const normalized = normalizeSdl3ArabicTechnicalProse(String(entry || '')).trim();
    if (!normalized || hasResidualSdl3EnglishProse(normalized)) {
      return;
    }

    const key = sanitizeTooltipText(normalized).replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) {
      return;
    }

    seen.add(key);
    unique.push(normalized);
  });

  return unique.slice(0, Math.max(0, limit));
}

function buildSdl3DescriptionFallback(item) {
  if (!item) {
    return '';
  }

  if (item.kind === 'type') {
    return joinUniqueSdl3ArabicTexts([
      buildSdl3TypeMeaning(item),
      buildSdl3TypePracticalUsage(item)
    ], 2).join(' ');
  }

  if (item.kind === 'constant') {
    const valueNote = item.value ? `قيمته الرمزية أو الرقمية هي ${item.value}.` : '';
    return joinUniqueSdl3ArabicTexts([
      buildSdl3ActualOperation(item),
      valueNote || ''
    ], 2).join(' ');
  }

  if (item.kind === 'macro') {
    return joinUniqueSdl3ArabicTexts([
      buildSdl3MacroMeaning(item),
      buildSdl3MacroPracticalUsage(item)
    ], 2).join(' ');
  }

  if (item.kind === 'enum') {
    return buildSdl3ActualOperation(item);
  }

  if (item.kind === 'function') {
    return buildSdl3FunctionMeaning(item);
  }

  return buildSdl3NameMeaning(item);
}

function buildSdl3DerivedRemarkFallback(item, noteIndex = 0, rawText = '') {
  if (!item) {
    return normalizeSdl3ArabicTechnicalProse(buildSdl3StrictArabicRemarkFallback(rawText, item));
  }

  const exactType = getSdl3ExactElementTypeInfo(item);
  let candidates = [];

  if (item.kind === 'type') {
    candidates = [
      buildSdl3TypeMeaning(item),
      buildSdl3TypePracticalUsage(item),
      exactType.key === 'callback'
        ? 'يجب أن يطابق هذا النوع توقيع الدالة المحلية بالكامل، لأن SDL ستستدعيه بالمعاملات والترتيب نفسيهما المحددين هنا.'
        : exactType.key === 'handle'
          ? 'لا يُنشأ هذا المقبض يدويًا داخل التطبيق، بل تحصل عليه من دالة الإنشاء أو الفتح المناسبة ثم تمرره إلى الدوال التي تعمل على المورد نفسه.'
          : buildSdl3TypePurpose(item),
      buildSdl3MissingOrMisuseImpact(item)
    ];
  } else if (item.kind === 'constant') {
    candidates = [
      buildSdl3ActualOperation(item),
      buildSdl3PracticalBenefitDetailed(item),
      buildSdl3MissingOrMisuseImpact(item)
    ];
  } else if (item.kind === 'macro') {
    candidates = [
      buildSdl3MacroMeaning(item),
      buildSdl3MacroPracticalUsage(item),
      buildSdl3PracticalBenefitDetailed(item)
    ];
  } else {
    candidates = [
      buildSdl3ActualOperation(item),
      buildSdl3PracticalBenefitDetailed(item),
      buildSdl3MissingOrMisuseImpact(item)
    ];
  }

  const uniqueCandidates = joinUniqueSdl3ArabicTexts(candidates, candidates.length);
  if (!uniqueCandidates.length) {
    return normalizeSdl3ArabicTechnicalProse(buildSdl3StrictArabicRemarkFallback(rawText, item));
  }

  return uniqueCandidates[Math.min(Math.max(0, noteIndex), uniqueCandidates.length - 1)] || uniqueCandidates[0];
}

function resolveStrictArabicSdl3DocText(rawText, item = null, options = {}) {
  const resolved = normalizeSdl3ArabicTechnicalProse(preferArabicSdl3DocText(rawText, item, options));
  if (resolved && !hasResidualSdl3EnglishProse(resolved)) {
    return resolved;
  }

  let fallback = normalizeSdl3ArabicTechnicalProse(String(options.fallbackText || ''));
  if (!fallback || hasResidualSdl3EnglishProse(fallback)) {
    if (options.section === 'remarks') {
      fallback = buildSdl3DerivedRemarkFallback(item, Number(options.noteIndex || 0), rawText);
    } else if (options.section === 'description') {
      fallback = buildSdl3DescriptionFallback(item);
    } else if (options.fallbackToItemMeaning && item) {
      fallback = buildSdl3NameMeaning(item);
    }
  }

  fallback = normalizeSdl3ArabicTechnicalProse(fallback);
  if (fallback && !hasResidualSdl3EnglishProse(fallback)) {
    return fallback;
  }

  if (options.section === 'remarks') {
    return normalizeSdl3ArabicTechnicalProse(buildSdl3StrictArabicRemarkFallback(rawText, item));
  }

  return fallback || resolved;
}

function normalizeSdl3RemarkSemanticKey(text) {
  return sanitizeTooltipText(normalizeSdl3ArabicTechnicalProse(text))
    .replace(/[.,:;!?،؛()[\]{}"'`]/g, ' ')
    .replace(/\b(?:هذا|هذه|لهذا|لهذه|من|في|على|إلى|عن|ثم|قد|فقط|أيضًا|ايضا|الذي|التي|هو|هي|تم|يتم|مع|عند|إذا)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isLowValueSdl3Remark(text, item = null) {
  const clean = sanitizeTooltipText(normalizeSdl3ArabicTechnicalProse(text)).replace(/\s+/g, ' ').trim();
  if (!clean) {
    return true;
  }

  const blockedPatterns = [
    /تنفذ العملية المشار إليها في اسمها/,
    /تقوم بما يدل عليه اسمها/,
    /تنفذ الوظيفة التي يوضحها الاسم/,
    /تستخدم لتنفيذ العملية/,
    /تساعد المكتبة على التعامل مع البيانات/,
    /توفر طريقة للتعامل مع المورد/,
    /تستخدم عند الحاجة/
  ];
  if (blockedPatterns.some((pattern) => pattern.test(clean))) {
    return true;
  }

  if (/^تعيد(?: هذه الدالة)? قيمة من النوع\b/.test(clean)) {
    return true;
  }
  if (/^تستقبل هذه الدالة\b/.test(clean) && /معامل/.test(clean)) {
    return true;
  }

  const cautionSignals = /(يجب|لا يجوز|إذا|عند|قبل|بعد|يبقى|مملوك|تحرير|يغلق|يتجاهل|يفشل|NULL|0|خيط|منصة|صالح|غير صالح|خارج النطاق|ثابتة|مؤقت|يبقى صالحًا|لا تحرره|لا تفرغه|يعاد ضبطه|مغلق|مفتوح)/;
  if (/^هذه الدالة\b/.test(clean) && !cautionSignals.test(clean)) {
    return true;
  }

  if (item) {
    const semanticKey = normalizeSdl3RemarkSemanticKey(clean);
    const repeatedKeys = [
      buildSdl3PrimaryMeaning(item),
      buildSdl3ActualOperation(item),
      buildSdl3UsageHint(item),
      item.kind === 'function' ? buildSdl3ReturnMeaning(item) : ''
    ]
      .map((entry) => normalizeSdl3RemarkSemanticKey(entry))
      .filter(Boolean);
    if (repeatedKeys.includes(semanticKey)) {
      return true;
    }
  }

  return false;
}

function buildSdl3RenderedRemarks(item) {
  const remarks = Array.isArray(item?.remarks) ? item.remarks : [];
  if (!remarks.length) {
    return [];
  }

  const rendered = [];
  const seen = new Set();

  remarks.forEach((remark) => {
    const source = String(remark || '').trim();
    if (!source) {
      return;
    }

    const propertyMatch = /^([A-Z0-9_]+)\s*:\s*(.+)$/.exec(source);
    if (propertyMatch) {
      const translated = resolveStrictArabicSdl3DocText(propertyMatch[2], item, {
        section: 'remarks',
        noteIndex: rendered.length
      });
      const plain = `${propertyMatch[1]}: ${sanitizeTooltipText(translated)}`;
      const key = normalizeSdl3RemarkSemanticKey(plain);
      if (!key || seen.has(key) || isLowValueSdl3Remark(translated, item)) {
        return;
      }
      seen.add(key);
      rendered.push(`${renderSdl3InlineReference(propertyMatch[1])}: ${linkSdl3DocText(translated)}`);
      return;
    }

    const translated = resolveStrictArabicSdl3DocText(source, item, {
      section: 'remarks',
      noteIndex: rendered.length
    });
    const plain = sanitizeTooltipText(translated);
    const key = normalizeSdl3RemarkSemanticKey(plain);
    if (!key || seen.has(key) || isLowValueSdl3Remark(translated, item)) {
      return;
    }
    seen.add(key);
    rendered.push(linkSdl3DocText(translated));
  });

  return rendered;
}


function preferArabicSdl3DocText(rawText, item = null, options = {}) {
  const translated = normalizeSdl3ArabicTechnicalProse(translateSdl3DocText(rawText, item, options));
  const requiresStrictArabic = ['returns', 'threadSafety', 'remarks', 'parameter-description', 'description'].includes(options.section);
  const hasResidualEnglish = hasResidualSdl3EnglishProse(translated);
  if (!translated || !(requiresStrictArabic ? hasResidualEnglish : looksEnglishOrMixedTooltipText(translated))) {
    return translated;
  }

  let fallback = String(options.fallbackText || '');
  if (!fallback && options.section === 'returns') {
    fallback = buildSdl3ReturnFallback(item);
  } else if (!fallback && options.section === 'threadSafety') {
    fallback = buildSdl3ThreadSafetyFallback(rawText);
  } else if (!fallback && options.section === 'remarks') {
    fallback = buildSdl3RemarkFallback(rawText, item);
  }

  let resolved = normalizeSdl3ArabicTechnicalProse(fallback || translated);
  if (options.section === 'remarks' && hasResidualSdl3EnglishProse(resolved)) {
    resolved = normalizeSdl3ArabicTechnicalProse(buildSdl3StrictArabicRemarkFallback(rawText, item));
  }

  return resolved;
}

function buildSdl3PrimaryMeaning(item) {
  if (item?.kind === 'function') {
    return buildSdl3FunctionMeaning(item);
  }
  if (item?.kind === 'type') {
    return buildSdl3TypeMeaning(item);
  }
  if (item?.kind === 'macro') {
    return buildSdl3MacroMeaning(item);
  }

  const translated = resolveStrictArabicSdl3DocText(item?.description || '', item, {
    fallbackToItemMeaning: true,
    section: 'description',
    fallbackText: buildSdl3NameMeaning(item)
  });
  if (/[\u0600-\u06FF]/.test(translated)) {
    return translated;
  }
  return buildSdl3NameMeaning(item);
}

function buildSdl3OfficialDescription(item) {
  if (item?.kind === 'macro' && isSdl3PropertyMacro(item)) {
    const propertyProfile = buildSdl3PropertyMacroProfile(item);
    if (propertyProfile?.officialDescription) {
      return propertyProfile.officialDescription;
    }
  }

  const fallback = buildSdl3DescriptionFallback(item)
    || (item?.kind === 'macro' ? buildSdl3MacroMeaning(item) : buildSdl3PrimaryMeaning(item));
  return resolveStrictArabicSdl3DocText(item?.description || '', item, {
    fallbackToItemMeaning: true,
    section: 'description',
    fallbackText: fallback
  }) || fallback;
}

function buildSdl3UsageHint(item) {
  if (!item) {
    return '';
  }

  if (item.kind === 'constant' && item.parentEnum) {
    const valueNote = item.value ? ` وقيمتها ${item.value}` : '';
    return `هذه قيمة ثابتة من التعداد ${item.parentEnum}${valueNote}.`;
  }

  if (item.referenceName && /_PROP_/.test(item.name || '')) {
    return buildSdl3PropertyMacroProfile(item)?.when || `تُمرَّر هذه الخاصية داخل SDL_PropertiesID عند استخدام ${item.referenceName}.`;
  }

  if (item.referenceName) {
    return `يفتح هذا العنصر عادة مع ${item.referenceName} لأن صفحته تحيله إليه مباشرة.`;
  }

  if (item.kind === 'enum') {
    return 'اختر إحدى قيم هذا التعداد بحسب الحالة أو النمط الذي تريد من SDL3 أن يعتمده.';
  }

  if (item.kind === 'macro') {
    return 'هذا ماكرو يُستخدم أثناء الترجمة أو كاسم ثابت رمزي داخل الواجهة.';
  }

  if (item.kind === 'type') {
    return 'يظهر هذا النوع كمعامل أو قيمة إرجاع أو كحقل داخل دوال SDL3 المرتبطة به.';
  }

  if (item.kind === 'function' && Array.isArray(item.parameters) && item.parameters.length) {
    return `تستقبل هذه الدالة ${item.parameters.length} معامل${item.parameters.length === 1 ? '' : 'ات'} وتنفذ العملية المشار إليها في اسمها.`;
  }

  return 'له صفحة محلية وروابط داخلية ضمن المرجع الحالي.';
}

function hasRealSdl3Description(item) {
  const description = String(item?.description || '').trim();
  return !!description && !/^Please refer to\b/i.test(description);
}

function joinSdl3NaturalList(values = []) {
  const cleaned = values.filter(Boolean);
  if (!cleaned.length) {
    return '';
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  if (cleaned.length === 2) {
    return `${cleaned[0]} و${cleaned[1]}`;
  }
  return `${cleaned.slice(0, -1).join('، ')}، و${cleaned[cleaned.length - 1]}`;
}

function isSdl3FunctionLikeMacro(item) {
  return /^\s*#define\s+[A-Za-z_][A-Za-z0-9_]*\s*\(/m.test(String(item?.syntax || ''));
}

function isSdl3ConditionalMacro(item) {
  return /^\s*#(?:if|ifdef|ifndef)\b/m.test(String(item?.syntax || ''));
}

function isSdl3BitmaskLiteral(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) {
    return false;
  }

  if (/<<|BITMASK|MASK/i.test(value)) {
    return true;
  }

  let numeric = NaN;
  if (/^0x[0-9a-f]+$/i.test(value)) {
    numeric = parseInt(value, 16);
  } else if (/^[0-9]+$/.test(value)) {
    numeric = Number(value);
  }

  if (!Number.isFinite(numeric)) {
    return false;
  }

  return numeric === 0 || (numeric & (numeric - 1)) === 0;
}

function isSdl3FlagEnum(item) {
  if (!item) {
    return false;
  }

  if (/Flags?\b|Mask\b/i.test(item.name || '')) {
    return true;
  }

  const remarksText = (item.remarks || []).join(' ');
  if (/OR[' ]?d together|bitmask|mask of bits|combine/i.test(remarksText)) {
    return true;
  }

  const values = Array.isArray(item.values) ? item.values : [];
  const nonEmptyValues = values.filter((entry) => String(entry?.value || '').trim());
  return nonEmptyValues.length >= 2 && nonEmptyValues.every((entry) => isSdl3BitmaskLiteral(entry.value));
}

function isSdl3FlagConstant(item) {
  if (!item) {
    return false;
  }

  if (/FLAG|MASK|BIT/i.test(item.name || '')) {
    return true;
  }

  if (item.parentEnum) {
    return isSdl3FlagEnum(findSdl3ItemByKind('enum', item.parentEnum));
  }

  return false;
}

function isSdl3CallbackType(item) {
  const syntax = String(item?.syntax || '');
  return /Callback|_func\b/.test(item?.name || '')
    || /^typedef\s+.*\(\s*(?:SDLCALL\s*)?\*+\s*[A-Za-z_][A-Za-z0-9_]*\s*\)\s*\(/.test(syntax);
}

function isSdl3OpaqueHandleType(item) {
  const syntax = String(item?.syntax || '').trim();
  const remarksText = [item?.description || '', ...(item?.remarks || [])].join(' ');
  return /^typedef\s+struct\s+[A-Za-z_][A-Za-z0-9_]*\s+[A-Za-z_][A-Za-z0-9_]*\s*;?$/.test(syntax)
    || (/^struct\s+[A-Za-z_][A-Za-z0-9_]*\s*;?$/.test(syntax) && !/\{/.test(syntax))
    || /opaque handle|opaque data/i.test(remarksText);
}

function isSdl3FlagType(item) {
  if (!item) {
    return false;
  }

  const remarksText = [item.description || '', ...(item.remarks || [])].join(' ');
  return /Flags?\b|Mask\b/i.test(item.name || '')
    || /flags?|bitmask|OR[' ]?d together/i.test(remarksText);
}

function getSdl3ExactElementTypeInfo(item) {
  if (!item) {
      return {
        key: 'entity',
        english: 'Entity',
        arabic: 'عنصر',
        display: 'عنصر'
      };
  }

  if (item.kind === 'function') {
      return {
        key: 'function',
        english: 'Function',
        arabic: 'دالة',
        display: 'دالة'
      };
  }

  if (item.kind === 'macro') {
    if (/^SDL_PROP_|^IMG_PROP_|^MIX_PROP_|^TTF_PROP_/.test(item.name || '')) {
        return {
          key: 'property-macro',
          english: 'Macro',
          arabic: 'ماكرو مفتاح خاصية',
          display: 'ماكرو مفتاح خاصية'
        };
    }
    if (isSdl3FunctionLikeMacro(item)) {
        return {
          key: 'function-like-macro',
          english: 'Function-like Macro',
          arabic: 'ماكرو شبيه بالدالة',
          display: 'ماكرو شبيه بالدالة'
        };
    }
    if (isSdl3ConditionalMacro(item)) {
        return {
          key: 'conditional-macro',
          english: 'Conditional Macro',
          arabic: 'ماكرو شرطي',
          display: 'ماكرو شرطي'
        };
    }
      return {
        key: 'macro',
        english: 'Macro',
        arabic: 'ماكرو قيمة ثابتة',
        display: 'ماكرو قيمة ثابتة'
      };
  }

  if (item.kind === 'constant') {
    if (isSdl3FlagConstant(item)) {
      return {
        key: 'flag-value',
        english: 'Flag Value',
        arabic: 'قيمة راية',
        display: 'قيمة راية'
      };
    }
      return {
        key: 'constant',
        english: 'Constant',
        arabic: 'ثابت',
        display: 'ثابت'
      };
  }

  if (item.kind === 'enum') {
    if (isSdl3FlagEnum(item)) {
        return {
          key: 'flag',
          english: 'Flag',
          arabic: 'راية قابلة للدمج',
          display: 'راية قابلة للدمج'
        };
    }
      return {
        key: 'enum',
        english: 'Enum',
        arabic: 'تعداد',
        display: 'تعداد'
      };
  }

  if (isSdl3CallbackType(item)) {
    return {
      key: 'callback',
      english: 'Callback',
      arabic: 'رد نداء',
      display: 'رد نداء'
    };
  }

  if (isSdl3OpaqueHandleType(item)) {
    return {
      key: 'handle',
      english: 'Handle / Opaque Type',
      arabic: 'مقبض / نوع معتم',
      display: 'مقبض / نوع معتم'
    };
  }

  if (isSdl3StructTypeItem(item)) {
    return {
      key: 'struct',
      english: 'Struct',
      arabic: 'بنية',
      display: 'بنية'
    };
  }

  if (isSdl3FlagType(item)) {
    return {
      key: 'flag-typedef',
      english: 'Flag Typedef',
      arabic: 'نوع رايات',
      display: 'نوع رايات'
    };
  }

  if (/^typedef\b/i.test(String(item.syntax || ''))) {
    return {
      key: 'typedef',
      english: 'Typedef',
      arabic: 'اسم نوع بديل',
      display: 'اسم نوع بديل'
    };
  }

  return {
    key: 'type',
    english: 'Type',
    arabic: 'نوع',
    display: 'نوع'
  };
}

function getSdl3BaseTypeName(typeText = '') {
  const cleaned = String(typeText || '')
    .replace(/\bconst\b/g, ' ')
    .replace(/\bstruct\b/g, ' ')
    .replace(/[*&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = cleaned.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  return tokens[tokens.length - 1] || cleaned;
}

function getSdl3ObjectKeyFromNameWords(words = []) {
  return words
    .map((word) => String(word || '').toLowerCase())
    .join('');
}

function getSdl3ObjectKeyForItem(item) {
  const words = splitSdl3IdentifierWords(item?.name || '');
  return getSdl3ObjectKeyFromNameWords(item?.kind === 'function' ? words.slice(1) : words);
}

function getSdl3ObjectKeyForTypeName(typeText) {
  return getSdl3ObjectKeyFromNameWords(splitSdl3IdentifierWords(getSdl3BaseTypeName(typeText)));
}

function findSdl3LifecycleCandidates(item) {
  const functionItems = getSdl3FunctionRelations();
  const localFunctions = functionItems.filter((entry) => {
    return entry.packageKey === item?.packageKey || ['core', item?.packageKey].includes(entry.packageKey);
  });
  const itemKey = getSdl3ObjectKeyForItem(item);
  const typeKey = getSdl3ObjectKeyForTypeName(parseSdl3FunctionSignature(item?.syntax || '').returnType);
  const targetKey = typeKey || itemKey;
  if (!targetKey) {
    return {creators: [], destroyers: []};
  }

  const creators = localFunctions.filter((entry) => {
    return ['Create', 'Open', 'Load'].includes(entry.action)
      && String(entry.objectKey || '').includes(targetKey);
  }).slice(0, 4);

  const destroyers = localFunctions.filter((entry) => {
    return ['Destroy', 'Close', 'Free'].includes(entry.action)
      && String(entry.objectKey || '').includes(targetKey);
  }).slice(0, 4);

  return {creators, destroyers};
}

function buildSdl3RelatedNames(item) {
  const names = [];
  const pushName = (name) => {
    if (!name || names.includes(name)) {
      return;
    }
    names.push(name);
  };

  pushName(item?.referenceName);
  (item?.seeAlso || []).forEach(pushName);

  if (item?.kind === 'constant' && item?.parentEnum) {
    pushName(item.parentEnum);
  }

  if (item?.kind === 'enum') {
    (item.values || []).slice(0, 4).forEach((entry) => pushName(entry.name));
  }

  const lifecycle = findSdl3LifecycleCandidates(item);
  lifecycle.creators.forEach((entry) => pushName(entry.name));
  lifecycle.destroyers.forEach((entry) => pushName(entry.name));

  if (item?.kind === 'function') {
    const signature = parseSdl3FunctionSignature(item.syntax || '');
    const returnedTypeName = getSdl3BaseTypeName(signature.returnType);
    if (returnedTypeName && findSdl3AnyItemByName(returnedTypeName)) {
      pushName(returnedTypeName);
    }
  }

  return names.slice(0, 8);
}

function buildSdl3RelatedLinksSummary(item) {
  const names = buildSdl3RelatedNames(item);
  if (!names.length) {
    return 'لا توجد عناصر مرتبطة واضحة أكثر من المصدر الحالي.';
  }
  return names.map((name) => renderSdl3EntityLink(name)).join(' ');
}

function buildSdl3ReturnMeaning(item) {
  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const translated = preferArabicSdl3DocText(item?.returns || '', item, {section: 'returns'});
  if (translated) {
    return translated.replace(/\.$/, '');
  }

  if (!signature.returnType || signature.returnType === 'void') {
    return 'لا تعيد قيمة مباشرة، ويظهر أثرها بتعديل المورد أو النظام المستهدف';
  }
  if (/\*/.test(signature.returnType)) {
    return `تعيد مؤشرًا من النوع ${signature.returnType}، ويجب التحقق من أنه ليس NULL قبل استخدامه`;
  }
  if (/\bbool\b/i.test(signature.returnType)) {
    return 'تعيد true عند النجاح و false عند الفشل';
  }
  if (/\bint\b/i.test(signature.returnType)) {
    return `تعيد قيمة من النوع ${signature.returnType} يجب تفسيرها وفق توثيق الدالة قبل متابعة التنفيذ`;
  }
  return `تعيد قيمة من النوع ${signature.returnType} تمثل نتيجة العملية`;
}

function buildSdl3ReturnHandlingHint(item) {
  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const returnType = String(signature.returnType || '').trim();

  if (!returnType || returnType === 'void') {
    return 'لا توجد قيمة راجعة تفحصها مباشرة؛ راقب أثر الاستدعاء على المورد أو على الذاكرة أو على الحالة التي طلبت تعديلها.';
  }

  if (/\*/.test(returnType)) {
    return 'افحص أن المؤشر المعاد ليس NULL قبل استخدامه، ثم مرره إلى الدوال المرتبطة بالمورد نفسه، وحرره لاحقًا بالدالة المقابلة إذا كانت دورة الحياة تتطلب ذلك.';
  }

  if (/\bbool\b/i.test(returnType)) {
    return 'استخدم شرطًا مباشرًا مثل if (!call) لمعرفة الفشل، ثم اقرأ SDL_GetError() إذا احتجت سبب الخطأ قبل متابعة التنفيذ.';
  }

  if (/\bint\b/i.test(returnType)) {
    return 'افحص القيمة المعادة مباشرة وقارنها بالدلالات أو الحدود التي يحددها هذا المسار قبل أن تبني عليها منطقك اللاحق.';
  }

  return 'خزن النتيجة في متغير واضح المعنى، ثم فسرها وفق هذا التوقيع قبل أن تبني عليها أي خطوة لاحقة في الكود.';
}

function buildSdl3ActualOperation(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const objectText = getSdl3ObjectMeaning(splitSdl3IdentifierWords(item?.name || '').slice(item?.kind === 'function' ? 1 : 0), item) || item?.name || 'العنصر';

  if (item?.kind === 'function') {
    const specialProfile = getSdl3SpecialFunctionProfile(item);
    if (specialProfile?.operation) {
      return specialProfile.operation;
    }

    const action = getSdl3NameAction(item);
    const returnMeaning = buildSdl3ReturnMeaning(item);
    const returnClause = returnMeaning ? ` بعد ذلك ${linkSdl3DocText(returnMeaning)}.` : '';

    if (item.name === 'SDL_PollEvent') {
      return 'تفحص طابور الأحداث الداخلي الذي تديره SDL، وتسحب حدثًا واحدًا إن وجد لتضعه في البنية التي مررتها، أو تكتفي بإخبارك بوجود حدث إذا مررت NULL.';
    }

    if (['Create', 'Open', 'Load'].includes(action)) {
      const sourceArgs = (item.parameters || []).map((param) => param.name).slice(0, 3);
      return `تقرأ ${joinSdl3NaturalList(sourceArgs.map((name) => `<code dir="ltr">${escapeHtml(name)}</code>`)) || 'المعاملات المطلوبة'} ثم تطلب من ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')} إنشاء أو فتح أو تحميل ${escapeHtml(objectText)} بصيغة صالحة للاستخدام.${returnClause}`;
    }

    if (['Destroy', 'Close', 'Free'].includes(action)) {
      return `تستقبل المورد الحالي من ${escapeHtml(objectText)} ثم تحرره داخل ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')}. بعد هذا الاستدعاء لا يجوز متابعة استخدام نفس المقبض أو المؤشر لأنه يصبح غير صالح.`;
    }

    if (['Get', 'Query', 'Read'].includes(action)) {
      return `تقرأ الحالة الحالية أو البيانات المرتبطة بـ ${escapeHtml(objectText)} من SDL بدون إنشاء مورد جديد.${returnClause}`;
    }

    if (['Set', 'Update'].includes(action)) {
      return `تكتب القيم التي تمررها داخل ${escapeHtml(objectText)} أو تعدل حالته الحالية بحيث تعتمد الاستدعاءات التالية هذا الإعداد أو هذا التحديث.`;
    }

    if (['Add', 'Remove'].includes(action)) {
      return `تغير محتوى ${escapeHtml(objectText)} نفسه بإضافة عنصر جديد أو إزالة عنصر موجود، لذلك يظهر الأثر لاحقًا في الاستدعاءات التي تستخدم نفس المورد أو نفس المسار.`;
    }

    return `تنفذ العملية المركزية الخاصة بـ ${escapeHtml(objectText)} داخل ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')}.${returnClause}`;
  }

  if (item?.kind === 'type') {
    if (exactType.key === 'callback') {
      return 'يحدد الشكل الثابت للدالة التي ستستدعيها SDL لاحقًا، بما في ذلك أنواع المعاملات ومعنى كل قيمة تستقبلها داخل رد النداء.';
    }
    if (exactType.key === 'handle') {
      return 'يمثل موردًا داخليًا تديره SDL أو إحدى ملحقاتها. التطبيق لا يقرأ حقوله مباشرة، بل يمرر هذا المقبض إلى الدوال المرتبطة به لكي تعمل على المورد نفسه.';
    }
    if (exactType.key === 'struct') {
      const fields = parseSdl3StructFields(item.syntax || '');
      return `يصف حزمة بيانات مهيكلة${fields.length ? ` تحتوي ${fields.length} حقول${fields.length === 1 ? 'اً' : 'اً'}` : ''} تقرؤها SDL عند الاستدعاء أو تكتبها لك عند الإرجاع.`;
    }
    if (exactType.key === 'flag-typedef') {
      return 'يعطي اسمًا رسميًا لنوع قناع البتات الذي تستقبل فيه الدوال مجموعة رايات قابلة للدمج بعملية OR بدل تمرير رقم غير معرّف المعنى.';
    }
    return 'يعطي اسمًا نوعيًا واضحًا لتوقيع أو معرّف أو قيمة تستخدمها SDL في المعاملات والبنى والنتائج.';
  }

  if (item?.kind === 'enum') {
    return isSdl3FlagEnum(item)
      ? 'يجمع الرايات المسموح بها لهذا السياق، ويمكن دمج عدة قيم منه معًا بعملية OR عندما تسمح الدالة بذلك.'
      : 'يجمع القيم الرسمية التي يجب الاختيار من بينها عند تمرير هذا النوع إلى دالة أو عند تفسير حالة أعادتها SDL.';
  }

  if (item?.kind === 'constant') {
    return isSdl3FlagConstant(item)
      ? `يمثل بتًا أو راية محددة من ${item.parentEnum || 'التعداد الأب'}، وعند تمريره فأنت تفعّل هذا الخيار تحديدًا داخل الدالة أو البنية المستهدفة.`
      : `يمثل قيمة واحدة محددة من ${item.parentEnum || 'التعداد الأب'}، وتستخدمه للمقارنة أو لاختيار هذا الفرع من السلوك بدل كتابة رقم مباشر.`;
  }

  if (item?.kind === 'macro') {
    if (exactType.key === 'property-macro') {
      const propertyProfile = buildSdl3PropertyMacroProfile(item);
      return propertyProfile?.meaning
        ? `${propertyProfile.meaning} يثبَّت اسم المفتاح أثناء المعالجة المسبقة، ثم تستخدمه SDL وقت التشغيل لقراءة القيمة الصحيحة أو كتابتها داخل SDL_PropertiesID.`
        : 'يعرّف اسم الخاصية الذي يمر إلى نظام الخصائص في SDL أثناء preprocessing، ثم يستخدم الاسم الناتج وقت التشغيل لقراءة القيمة الصحيحة أو كتابتها داخل SDL_PropertiesID.';
    }
    if (exactType.key === 'function-like-macro') {
      return 'يتوسع في مرحلة preprocessing إلى تعبير أو نداء بديل قبل الترجمة، لذلك لا يملك وجودًا مستقلًا كدالة وقت التشغيل.';
    }
    return 'يعرّف قيمة أو اسمًا رمزيًا ثابتًا في مرحلة preprocessing، ثم تعتمد الدوال عليه وقت التشغيل عندما تمرره أو عندما تختبره داخل الشروط.';
  }

  return `هذا ${exactType.arabic} جزء من ${item?.packageDisplayName || item?.packageName || 'SDL3'} وله دور تنفيذي محدد داخل واجهة المكتبة.`;
}

function buildSdl3PracticalBenefitDetailed(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const objectText = getSdl3ObjectMeaning(splitSdl3IdentifierWords(item?.name || '').slice(item?.kind === 'function' ? 1 : 0), item) || item?.name || 'العنصر';

  if (item?.kind === 'function') {
    const specialProfile = getSdl3SpecialFunctionProfile(item);
    if (specialProfile?.benefit) {
      return specialProfile.benefit;
    }

    const action = getSdl3NameAction(item);
    if (item.name === 'SDL_PollEvent') {
      return 'يبقي الحلقة الرئيسية مستجيبة ويمنع تراكم أحداث الإدخال والنظام دون الحاجة إلى استدعاءات نظام تشغيل خاصة بكل منصة.';
    }
    if (['Create', 'Open', 'Load'].includes(action)) {
      return `يعطيك ${escapeHtml(objectText)} بصيغة تدعمها بقية دوال ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')} مباشرة، بدل كتابة طبقة تحميل أو إنشاء خاصة بك لكل منصة أو لكل صيغة.`;
    }
    if (['Destroy', 'Close', 'Free'].includes(action)) {
      return `ينهي دورة حياة ${escapeHtml(objectText)} بشكل صحيح حتى لا يبقى الذاكرة أو المقبض أو الملف محجوزًا بعد انتهاء الحاجة إليه.`;
    }
    if (['Get', 'Query', 'Read'].includes(action)) {
      return `يمكّنك من قراءة الحالة الفعلية للمورد أو النظام في اللحظة الحالية بدل تخمينها أو حفظ نسخة قديمة غير مضمونة.`;
    }
    return `يحل خطوة تشغيلية محددة مرتبطة بـ ${escapeHtml(objectText)} داخل ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')} دون الحاجة إلى بناء هذه الخطوة يدويًا فوق واجهات أقل مستوى.`;
  }

  if (item?.kind === 'type') {
    if (exactType.key === 'callback') {
      return 'يعطيك عقدًا واضحًا لكيفية كتابة callback بحيث تستطيع SDL استدعاء كودك بأمان وبالمعطيات المتوقعة.';
    }
    if (exactType.key === 'handle') {
      return 'يفصل بين تطبيقك وتمثيل SDL الداخلي للمورد، فيسمح للمكتبة بتغيير التنفيذ داخليًا دون أن يكسر الكود الذي يستخدم المقبض.';
    }
    if (exactType.key === 'struct') {
      return 'يجمع الإعدادات أو النتائج في صيغة ثابتة تتفق عليها كل الدوال المرتبطة بها، فيقلل عدد المعاملات ويحافظ على ترتيب الحقول المتوقع.';
    }
    if (exactType.key === 'flag-typedef') {
      return 'يجعل الرايات قابلة للقراءة والدمج والتحقق من النوع بدل تمرير أرقام عشوائية تفقد المعنى.';
    }
    return 'يعطي اسمًا رسميًا لنوع يظهر في الواجهة البرمجية ويجعل التوقيع والمقروئية أوضح من استخدام النوع الخام مباشرة.';
  }

  if (item?.kind === 'enum' || item?.kind === 'constant') {
    return isSdl3FlagEnum(item) || isSdl3FlagConstant(item)
      ? 'يجعلك تفعّل الخيارات الصحيحة بوضوح، ويمنع تمرير بتات رقمية غامضة قد لا تكون مدعومة أو قد تخلط بين أوضاع مختلفة.'
      : 'يوضح الحالة أو النمط المطلوب بشكل صريح، ويمنع اعتماد الأرقام السحرية التي يصعب مراجعتها وصيانتها.';
  }

  if (item?.kind === 'macro') {
    return isSdl3PropertyMacro(item)
      ? buildSdl3PropertyMacroProfile(item)?.benefit || 'يضمن أن اسم الخاصية ونوعها المتوقع متوافقان مع ما تقرؤه SDL فعلًا، بدل تمرير مفاتيح نصية يدوية معرضة للأخطاء.'
      : 'يوفر اسمًا ثابتًا معتمدًا من الهيدر الرسمي بدل أرقام أو نصوص مبهمة داخل الشيفرة.';
  }

  return `يفيدك لأنه يربط التطبيق مباشرة بعقد ${item?.packageDisplayName || item?.packageName || 'SDL3'} الرسمي لهذا المسار.`;
}

function buildSdl3MissingOrMisuseImpact(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);

  if (item?.kind === 'function') {
    const action = getSdl3NameAction(item);
    if (item.name === 'TTF_AddFallbackFont') {
      return 'إذا لم تضف خطًا احتياطيًا فستفشل بعض المحارف في الظهور عندما لا تكون موجودة في الخط الأساسي. وإذا ربطت خطًا بحجم أو نمط مختلفين فقد يظهر النص بمظهر غير متسق أو قد تنتج مطابقة غير صحيحة للمحارف.';
    }
    if (item.name === 'SDL_PollEvent') {
      return 'إذا لم تسحب الأحداث بانتظام فسيتأخر التعامل مع الإدخال وقد يبدو التطبيق متجمّدًا لأن طابور الأحداث سيبقى ممتلئًا برسائل لم تُعالج.';
    }
    if (['Create', 'Open', 'Load'].includes(action)) {
      return 'إذا لم تستدعها فلن تحصل على المورد أصلًا. وإذا تجاهلت الفشل وتابعت استخدام NULL أو النتيجة غير الصالحة فستفشل الاستدعاءات اللاحقة أو ستعمل على مورد غير موجود.';
    }
    if (['Destroy', 'Close', 'Free'].includes(action)) {
      return 'إذا أهملتها سيبقى المورد محجوزًا في الذاكرة أو لدى النظام. وإذا استدعيتها ثم تابعت استخدام نفس المقبض فسيصبح الكود يعمل على مورد انتهت صلاحيته.';
    }
    if (['Set', 'Update'].includes(action)) {
      return 'إذا مررت قيمًا خاطئة أو تركت هذه الخطوة خارج التسلسل فلن يأخذ المورد الإعداد المقصود، وستظهر النتيجة بسلوك مختلف عمّا تتوقع.';
    }
    return `الاستخدام الخاطئ هنا يعني غالبًا أن SDL سيقرأ معاملات غير مناسبة لهذا المسار أو أن النتيجة ستفشل ويجب فحصها قبل مواصلة التنفيذ.`;
  }

  if (item?.kind === 'type') {
    if (exactType.key === 'callback') {
      return 'إذا كان توقيع رد النداء غير مطابق فسيمرر SDL معاملات لا يطابقها تعريفك، وهذا قد يقود إلى سلوك غير صحيح أو انهيار عند الاستدعاء.';
    }
    if (exactType.key === 'handle') {
      return 'لا يصبح هذا المقبض صالحًا إلا بعد إنشائه أو استرجاعه من الدالة المناسبة، ويصبح غير صالح بعد إغلاقه أو تدميره. استخدامه خارج هذه الدورة يعني وصولًا إلى مورد غير مضمون.';
    }
    if (exactType.key === 'struct') {
      return 'إذا تُركت الحقول الأساسية دون تهيئة أو مُلئت بقيم لا تناسب السياق، فستقرأ SDL وصفًا ناقصًا أو خاطئًا وقد ترفض العملية أو تنفذها بإعدادات غير مقصودة.';
    }
    return 'إذا استُخدم هذا النوع في موضع لا يطابق التوقيع الفعلي فستفقد الدوال القدرة على تفسير القيمة أو المؤشر بالشكل الصحيح.';
  }

  if (item?.kind === 'enum' || item?.kind === 'constant') {
    return isSdl3FlagEnum(item) || isSdl3FlagConstant(item)
      ? 'إذا جمعت رايات غير منطقية أو غير مدعومة فسيتغير السلوك الفعلي للدالة وقد تُرفض العملية أو تعمل بوضع غير مقصود.'
      : 'إذا استبدلت هذه القيمة برقم مباشر أو بقيمة من تعداد مختلف فستصبح المقارنة أو الاختيار غير صحيحين وقد ينتقل التنفيذ إلى فرع خاطئ.';
  }

  if (item?.kind === 'macro') {
    return isSdl3PropertyMacro(item)
      ? 'إذا خزنت لهذه الخاصية نوع قيمة لا يطابق المفتاح نفسه، أو استعملتها مع مرجع لا يقرأها، فقد تتجاهلها SDL أو تفسرها بطريقة مختلفة عن التي تقصدها.'
      : 'استخدام قيمة رقمية يدوية بدل هذا الماكرو يجعل الكود أقل وضوحًا ويزيد احتمال تمرير قيمة لا تطابق ما يتوقعه الهيدر الرسمي.';
  }

  return `إساءة استخدام هذا ${exactType.arabic} تعني فقدان العقد الرسمي الذي تبني عليه SDL هذا المسار.`;
}

function buildSdl3LifecycleSummary(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const lifecycle = findSdl3LifecycleCandidates(item);
  const creatorLinks = lifecycle.creators.map((entry) => renderSdl3EntityLink(entry.name));
  const destroyerLinks = lifecycle.destroyers.map((entry) => renderSdl3EntityLink(entry.name));

  if (!creatorLinks.length && !destroyerLinks.length) {
    if (item?.kind === 'function' && ['Destroy', 'Close', 'Free'].includes(getSdl3NameAction(item))) {
      return 'هذا الاستدعاء يقع عند نهاية دورة حياة المورد ويجعل المورد غير صالح بعده مباشرة.';
    }
    if (exactType.key === 'handle') {
      return 'هذا مقبض مورد معتم. يبدأ صالحًا بعد الاستدعاء الذي أنشأه، وينتهي عند الاستدعاء الذي يغلقه أو يحرره.';
    }
    return '';
  }

  const pieces = [];
  if (creatorLinks.length) {
    pieces.push(`يبدأ المورد عادة عند ${joinSdl3NaturalList(creatorLinks)}.`);
  }
  if (destroyerLinks.length) {
    pieces.push(`وينتهي عند ${joinSdl3NaturalList(destroyerLinks)}، وبعدها لا يجوز متابعة استخدامه.`);
  }
  return pieces.join(' ');
}

function inferSdl3ExampleVariableNameFromType(typeText = '', fallback = 'value') {
  const baseType = getSdl3BaseTypeName(typeText);
  const words = splitSdl3IdentifierWords(baseType);
  if (!words.length) {
    return fallback;
  }

  const [first, ...rest] = words;
  const joined = [String(first || '').toLowerCase(), ...rest].join('');
  return joined.replace(/[^A-Za-z0-9_]/g, '') || fallback;
}

function inferSdl3FlagExampleValue(typeText = '', item = null) {
  const baseType = getSdl3BaseTypeName(typeText);
  if (baseType === 'SDL_WindowFlags') return 'SDL_WINDOW_RESIZABLE';
  if (baseType === 'SDL_InitFlags') return 'SDL_INIT_VIDEO';

  const constants = getSdl3EntityItems('constants')
    .filter((entry) => entry.parentEnum === baseType)
    .slice(0, 2)
    .map((entry) => entry.name);

  if (constants.length === 1) {
    return constants[0];
  }
  if (constants.length >= 2 && isSdl3FlagEnum(findSdl3ItemByKind('enum', baseType))) {
    return `${constants[0]} | ${constants[1]}`;
  }

  if (/flags/i.test(item?.description || '')) {
    return '0';
  }

  return '0';
}

function inferSdl3ExampleArgument(param, item, declarations, seenDeclarations) {
  const addDeclaration = (line) => {
    if (!line || seenDeclarations.has(line)) {
      return;
    }
    seenDeclarations.add(line);
    declarations.push(line);
  };

  const name = String(param?.name || 'value').trim();
  const type = String(param?.type || '').trim();
  const baseType = getSdl3BaseTypeName(type);

  if (name === 'props' || /PropertiesID/.test(type)) {
    addDeclaration('SDL_PropertiesID props = SDL_CreateProperties();');
    return 'props';
  }

  if (/callback/i.test(name) || /Callback/.test(type)) {
    addDeclaration(`/* وفّر callback يطابق ${baseType || type || name} هنا */`);
    return 'my_callback';
  }

  if (/userdata/i.test(name)) {
    addDeclaration('void *userdata = NULL;');
    return 'userdata';
  }

  if (/\bchar\s*\*/.test(type)) {
    if (/title/i.test(name)) return '"SDL3 Demo"';
    if (/file|font|path|filename|location/i.test(name)) return '"assets/sample.dat"';
    if (/type/i.test(name)) return '"png"';
    if (/message/i.test(name)) return '"text"';
    return '"value"';
  }

  if (/\bfloat\b/.test(type)) {
    return /size|ptsize|dpi/i.test(name) ? '18.0f' : '1.0f';
  }

  if (/\bdouble\b/.test(type)) {
    return '1.0';
  }

  if (/\bbool\b/i.test(type)) {
    return /close|enable|allow|many/i.test(name) ? 'true' : 'false';
  }

  if (/Flags?\b|Mask\b/.test(type) || /flags/i.test(name)) {
    return inferSdl3FlagExampleValue(type, item);
  }

  if (/\b(Uint|Sint|uint|int)\d*\b/.test(type) || /\bint\b/.test(type)) {
    if (/^w$|width/i.test(name)) return '1280';
    if (/^h$|height/i.test(name)) return '720';
    if (/^x$/i.test(name)) return '100';
    if (/^y$/i.test(name)) return '100';
    if (/size|count|index|filter|channel|face|offset/i.test(name)) return '0';
    return '0';
  }

  if (/\*/.test(type)) {
    if (baseType === 'SDL_Event') {
      addDeclaration('SDL_Event event = {0};');
      return '&event';
    }
    if (baseType === 'SDL_AudioSpec') {
      addDeclaration('SDL_AudioSpec spec = {0};');
      return '&spec';
    }
    if (baseType === 'SDL_Rect') {
      addDeclaration('SDL_Rect rect = {0};');
      return '&rect';
    }
    if (baseType === 'SDL_FRect') {
      addDeclaration('SDL_FRect rect = {0};');
      return '&rect';
    }

    const variableName = inferSdl3ExampleVariableNameFromType(baseType, name);
    addDeclaration(`${baseType || 'void'} *${variableName} = NULL;`);
    return variableName;
  }

  if (baseType && baseType !== type) {
    return inferSdl3ExampleVariableNameFromType(baseType, name);
  }

  return name || 'value';
}

function parseSdl3CallbackSignature(syntax) {
  const source = String(syntax || '').replace(/\s+/g, ' ').trim();
  const match = /^typedef\s+(.*?)\(\s*(?:SDLCALL\s*)?\*+\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)\s*\((.*)\)\s*;?$/.exec(source);
  if (!match) {
    return {returnType: 'void', name: '', params: []};
  }

  const rawParams = String(match[3] || '').trim();
  return {
    returnType: String(match[1] || 'void').trim(),
    name: String(match[2] || '').trim(),
    params: rawParams && rawParams !== 'void' ? rawParams.split(/\s*,\s*/) : []
  };
}

function buildSdl3FunctionExampleCode(item) {
  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const declarations = [];
  const seenDeclarations = new Set();
  const args = (item?.parameters || []).map((param) => inferSdl3ExampleArgument(param, item, declarations, seenDeclarations));
  const call = `${item?.name || 'SDL_Call'}(${args.join(', ')})`;
  const lines = [];

  if (declarations.length) {
    lines.push(...declarations, '');
  }

  const cleanup = findSdl3LifecycleCandidates(item).destroyers.find((entry) => entry.name !== item?.name);
  const variableName = inferSdl3ExampleResultVariableName(signature.returnType || '', 'result');

  if (!signature.returnType || signature.returnType === 'void') {
    lines.push(`${call};`);
  } else if (/\*/.test(signature.returnType)) {
    lines.push(`${signature.returnType} ${variableName} = ${call};`);
    lines.push(`if (!${variableName}) {`);
    lines.push(`    SDL_Log("فشل ${item?.name}: %s", SDL_GetError());`);
    lines.push('    return false;');
    lines.push('}');
    lines.push('');
    lines.push(`/* استخدم ${variableName} هنا */`);
    if (cleanup) {
      lines.push(`${cleanup.name}(${variableName});`);
    }
  } else if (/\bbool\b/i.test(signature.returnType)) {
    lines.push(`if (!${call}) {`);
    lines.push(`    SDL_Log("فشل ${item?.name}: %s", SDL_GetError());`);
    lines.push('    return false;');
    lines.push('}');
  } else {
    lines.push(`${signature.returnType} ${variableName} = ${call};`);
    lines.push(`(void)${variableName};`);
  }

  return lines.join('\n');
}

function inferSdl3ExampleResultVariableName(typeText = '', fallback = 'result') {
  const baseType = getSdl3BaseTypeName(typeText);
  if (!baseType) {
    return fallback;
  }
  if (/^bool$/i.test(baseType)) {
    return 'ok';
  }
  if (/^char$/i.test(baseType)) {
    return 'text';
  }
  if (/^(?:int|size_t|Sint\d*|Uint\d*)$/i.test(baseType)) {
    return 'result';
  }
  return inferSdl3ExampleVariableNameFromType(typeText, fallback);
}

function buildSdl3ParameterUsageExampleCode(item) {
  if (!item || item.kind !== 'function') {
    return '';
  }

  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const declarations = [];
  const seenDeclarations = new Set();
  const args = getSdl3DisplayParameters(item).map((param) => inferSdl3ExampleArgument(param, item, declarations, seenDeclarations));
  const call = `${item?.name || 'SDL_Call'}(${args.join(', ')})`;
  const lines = [];
  const returnType = String(signature.returnType || '').trim();

  if (declarations.length) {
    lines.push(...declarations, '');
  }

  if (!returnType || returnType === 'void') {
    lines.push(`${call};`);
  } else if (/\bbool\b/i.test(returnType)) {
    lines.push(`bool ok = ${call};`);
  } else {
    const variableName = inferSdl3ExampleResultVariableName(returnType, 'result');
    lines.push(`${returnType} ${variableName} = ${call};`);
  }

  return lines.join('\n');
}

function buildSdl3TypeExampleCode(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const lifecycle = findSdl3LifecycleCandidates(item);
  const creator = lifecycle.creators[0];
  const destroyer = lifecycle.destroyers[0];

  if (exactType.key === 'callback') {
    const signature = parseSdl3CallbackSignature(item.syntax || '');
    const params = signature.params.length ? signature.params.join(', ') : 'void';
    const bodyLines = signature.params
      .map((param) => {
        const nameMatch = /([A-Za-z_][A-Za-z0-9_]*)\s*(?:\[[^\]]+\])?\s*$/.exec(param);
        return nameMatch ? `    (void)${nameMatch[1]};` : '';
      })
      .filter(Boolean);
    if (!bodyLines.length) {
      bodyLines.push('    /* عالج الإشعار أو النتيجة هنا */');
    }
    return `static ${signature.returnType} SDLCALL my_callback(${params})\n{\n${bodyLines.join('\n')}\n}`;
  }

  if (exactType.key === 'handle' && creator) {
    let code = buildSdl3FunctionExampleCode(creator);
    if (destroyer && destroyer.name !== creator.name && !code.includes(`${destroyer.name}(`)) {
      const variableName = inferSdl3ExampleVariableNameFromType(parseSdl3FunctionSignature(creator.syntax || '').returnType || item.name, 'resource');
      code += `\n${destroyer.name}(${variableName});`;
    }
    return code;
  }

  if (exactType.key === 'struct') {
    const fields = parseSdl3StructFields(item.syntax || '');
    const lines = [`${item.name} value = {0};`];
    fields.slice(0, 2).forEach((field) => {
      const fakeParam = {name: field.name, type: field.type};
      const declarations = [];
      const value = inferSdl3ExampleArgument(fakeParam, item, declarations, new Set());
      lines.push(...declarations);
      lines.push(`value.${field.name} = ${value};`);
    });
    return lines.join('\n');
  }

  if (exactType.key === 'flag-typedef') {
    return `${item.name} flags = ${inferSdl3FlagExampleValue(item.name, item)};`;
  }

  return `${item.name} value = {0};`;
}

function buildSdl3EnumExampleCode(item) {
  const firstValue = (item?.values || [])[0]?.name || item?.name;
  if (isSdl3FlagEnum(item)) {
    const values = (item?.values || []).slice(0, 2).map((entry) => entry.name).filter(Boolean);
    const expression = values.length >= 2 ? values.join(' | ') : firstValue;
    return `${item.name} flags = ${expression};`;
  }
  return `${item.name} value = ${firstValue};`;
}

function buildSdl3ConstantExampleCode(item) {
  if (isSdl3FlagConstant(item)) {
    return `${item.parentEnum || 'Uint32'} flags = 0;\nflags |= ${item.name};`;
  }
  if (item.parentEnum) {
    return `${item.parentEnum} value = ${item.name};`;
  }
  return `int value = ${item.name};`;
}

function buildSdl3MacroExampleCode(item) {
  if (/^SDL_PROP_|^IMG_PROP_|^MIX_PROP_|^TTF_PROP_/.test(item?.name || '')) {
    if (/_STRING$/.test(item.name || '')) {
      return `SDL_PropertiesID props = SDL_CreateProperties();\nSDL_SetStringProperty(props, ${item.name}, "value");`;
    }
    if (/_NUMBER$/.test(item.name || '')) {
      return `SDL_PropertiesID props = SDL_CreateProperties();\nSDL_SetNumberProperty(props, ${item.name}, 1);`;
    }
    if (/_BOOLEAN$/.test(item.name || '')) {
      return `SDL_PropertiesID props = SDL_CreateProperties();\nSDL_SetBooleanProperty(props, ${item.name}, true);`;
    }
    if (/_POINTER$/.test(item.name || '')) {
      return `SDL_PropertiesID props = SDL_CreateProperties();\nvoid *userdata = NULL;\nSDL_SetPointerProperty(props, ${item.name}, userdata);`;
    }
    return `SDL_PropertiesID props = SDL_CreateProperties();\n/* استخدم ${item.name} مع واجهة الخصائص المناسبة */`;
  }

  if (/INIT/i.test(item.name || '')) {
    return `if (!SDL_Init(${item.name})) {\n    SDL_Log("%s", SDL_GetError());\n}`;
  }

  if (/WINDOW_/i.test(item.name || '')) {
    return `SDL_Window *window = SDL_CreateWindow("SDL3 Demo", 1280, 720, ${item.name});\nif (!window) {\n    SDL_Log("%s", SDL_GetError());\n}`;
  }

  return `int value = ${item.name};`;
}

function buildSdl3PracticalExample(item) {
  if (!item) {
    return {code: '', purpose: '', notes: []};
  }

  if (item.kind === 'function') {
    return {
      code: buildSdl3FunctionExampleCode(item),
      purpose: `يوضح المثال المسار العملي لاستدعاء ${item.name} وفحص النتيجة قبل متابعة التنفيذ.`,
      notes: [buildSdl3ReturnMeaning(item)]
    };
  }

  if (item.kind === 'type') {
    return {
      code: buildSdl3TypeExampleCode(item),
      purpose: `يوضح المثال كيف يظهر النوع ${item.name} داخل كود فعلي بدل الاكتفاء بتعريفه المجرد في الهيدر.`,
      notes: [buildSdl3LifecycleSummary(item)].filter(Boolean)
    };
  }

  if (item.kind === 'enum') {
    return {
      code: buildSdl3EnumExampleCode(item),
      purpose: `يوضح المثال كيف تختار قيمة من ${item.name} عند تمريرها إلى كود SDL أو عند تخزين الحالة الحالية.`,
      notes: [isSdl3FlagEnum(item) ? 'هذا النوع يقبل دمج أكثر من راية بعملية OR إذا سمحت الدالة المستهلكة بذلك.' : 'اختر قيمة واحدة فقط من هذا التعداد بحسب الحالة المطلوبة.']
    };
  }

  if (item.kind === 'constant') {
    return {
      code: buildSdl3ConstantExampleCode(item),
      purpose: `يوضح المثال موضع استخدام ${item.name} بدل رقم حرفي داخل الكود.`,
      notes: [item.parentEnum ? `القيمة تنتمي إلى ${item.parentEnum}.` : 'استخدم الاسم الرمزي نفسه بدل القيمة الرقمية المباشرة.']
    };
  }

  if (item.kind === 'macro') {
    return {
      code: buildSdl3MacroExampleCode(item),
      purpose: `يوضح المثال كيف يتسرب أثر ${item.name} من preprocessing إلى السلوك العملي الذي ينفذه الكود عند التشغيل.`,
      notes: [/^SDL_PROP_|^IMG_PROP_|^MIX_PROP_|^TTF_PROP_/.test(item.name || '') ? 'المفتاح ثابت وقت الترجمة، لكن القراءة والكتابة الفعلية تتمان وقت التشغيل.' : 'القيمة أو الاسم يثبت أثناء preprocessing ثم يعتمد عليه الكود اللاحق.']
    };
  }

  return {code: '', purpose: '', notes: []};
}

function collectSdl3ExampleReferencedItems(source, item) {
  const matches = String(source || '').match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  const seen = new Set();
  const items = [];

  matches.forEach((token) => {
    const refItem = findSdl3AnyItemByName(token);
    if (!refItem || refItem.name === item?.name) {
      return;
    }

    const key = `${refItem.kind}:${refItem.name}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    items.push(refItem);
  });

  return items.slice(0, 12);
}

function getSdl3CKeywordSet() {
  return getSdl3ParameterRenderRuntimeInstance()?.SDL3_C_KEYWORDS || new Set();
}

function parseSdl3ExampleLocalVariables(source) {
  const lines = String(source || '').split('\n');
  const variables = [];
  const seen = new Set();
  const sdl3CKeywords = getSdl3CKeywordSet();

  lines.forEach((line) => {
    const normalized = String(line || '').replace(/\s+/g, ' ').trim();
    if (!normalized || /^\/[/*]/.test(normalized) || /^\(void\)/.test(normalized)) {
      return;
    }

    const match = /^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;]+);$/.exec(normalized);
    if (!match) {
      return;
    }

    const type = String(match[1] || '').trim();
    const name = String(match[2] || '').trim();
    const initializer = String(match[3] || '').trim();

    if (!name || seen.has(name) || sdl3CKeywords.has(name)) {
      return;
    }

    seen.add(name);
    variables.push({type, name, initializer});
  });

  return variables.slice(0, 8);
}

function buildSdl3ExampleReferencePurpose(refItem, item, source) {
  if (refItem.name === 'SDL_Log') {
    return 'يستخدم هنا لتسجيل فشل الاستدعاء مباشرة بدل تجاهل الخطأ بصمت أثناء التجربة أو التطوير.';
  }
  if (refItem.name === 'SDL_GetError') {
    return 'يستخدم هنا مباشرة بعد الفشل لقراءة الرسالة التي خزنتها SDL لآخر خطأ حدث في هذا المسار.';
  }

  const action = refItem.kind === 'function' ? getSdl3NameAction(refItem) : '';
  if (['Destroy', 'Close', 'Free'].includes(action)) {
    return 'يستخدم هنا لإنهاء المورد الذي أنشأه المثال حتى لا تبقى الذاكرة أو المقبض أو الملف مفتوحًا بعد انتهاء الاستخدام.';
  }
  if (['Create', 'Open', 'Load'].includes(action)) {
    return `يستخدم هنا لتجهيز المورد الذي يعتمد عليه المثال قبل الوصول إلى ${item?.name || 'العنصر الحالي'}.`;
  }
  if (refItem.kind === 'constant' || refItem.kind === 'macro') {
    return 'يستخدم هنا لضبط خيار أو قيمة صريحة داخل المثال بدل تمرير رقم أو نص غامض لا يوضح المقصود.';
  }
  if (refItem.kind === 'type') {
    return 'يستخدم هنا لأن المثال يعمل على بيانات من هذا النوع أو يستقبل نتيجة ترجع بهذا النوع.';
  }
  if (String(source || '').includes(`${refItem.name}(`)) {
    return `يستخدم هنا كجزء من التسلسل العملي المحيط بـ ${item?.name || 'هذا العنصر'} داخل المثال.`;
  }
  return 'يظهر هنا لأن المثال يعتمد عليه فعليًا ضمن هذا المسار التطبيقي.';
}

function buildSdl3ExampleReferenceBenefit(refItem) {
  if (refItem.name === 'SDL_Log') {
    return 'يجعل فشل المثال مرئيًا فورًا أثناء التطوير بدل أن يمر الخطأ بصمت وتضيع سببه.';
  }
  if (refItem.name === 'SDL_GetError') {
    return 'يعطيك سبب الفشل النصي الذي تحتاجه لتصحيح القيم أو معرفة المورد الذي رفضته SDL.';
  }
  return buildSdl3PracticalBenefitDetailed(refItem);
}

function buildSdl3ExampleVariableMeaning(entry, item) {
  const baseType = getSdl3BaseTypeName(entry?.type || '');
  const initializer = String(entry?.initializer || '');
  const name = String(entry?.name || '');

  if (initializer.includes(`${item?.name || ''}(`)) {
    return `هذا المتغير يحتفظ بالقيمة التي تعيدها ${item?.name || 'الدالة'} حتى يستطيع المثال فحصها أو استخدامها في السطر التالي.`;
  }
  if (name === 'props' || baseType === 'SDL_PropertiesID') {
    return 'هذا المتغير يحمل وعاء الخصائص الذي توضع فيه الإعدادات الاختيارية قبل تمريرها إلى SDL.';
  }
  if (/userdata/i.test(name)) {
    return 'هذا المتغير يحمل سياق التطبيق الذي تريد استعادته كما هو لاحقًا داخل callback.';
  }
  if (/\{0\}/.test(initializer)) {
    return `هذا المتغير يهيئ ${baseType || 'بنية'} بحالة ابتدائية معروفة قبل ملء حقوله المطلوبة.`;
  }
  if (/NULL\b/.test(initializer) && /\*/.test(entry?.type || '')) {
    return 'هذا المتغير يبدأ كمؤشر فارغ ثم يمرر كمكان لحمل مورد أو سياق اختياري أثناء تنفيذ المثال.';
  }
  if (/".*"/.test(initializer)) {
    return 'هذا المتغير يحمل قيمة نصية فعلية يقرأها الاستدعاء كما هي، مثل اسم أو مسار أو رسالة.';
  }
  if (/\btrue\b|\bfalse\b/.test(initializer)) {
    return 'هذا المتغير يحمل خيارًا منطقيًا يغير سلوك التنفيذ في هذا المسار.';
  }
  if (findSdl3AnyItemByName(baseType)) {
    return `هذا المتغير يحمل قيمة من النوع ${renderSdl3InlineReference(baseType)} كي يستخدمها المثال في الاستدعاء أو بعده.`;
  }
  return 'هذا المتغير يحتفظ بقيمة وسيطة يحتاجها المثال أثناء تجهيز الاستدعاء أو التعامل مع نتيجته.';
}

function buildSdl3ExampleVariablePurpose(entry, item) {
  const baseType = getSdl3BaseTypeName(entry?.type || '');
  const initializer = String(entry?.initializer || '');
  const name = String(entry?.name || '');

  if (initializer.includes(`${item?.name || ''}(`)) {
    return 'لأن المثال يحتاج الاحتفاظ بنتيجة الاستدعاء في متغير واضح قبل فحصها أو تمريرها إلى خطوة لاحقة.';
  }
  if (name === 'props' || baseType === 'SDL_PropertiesID') {
    return 'لأن SDL تجمع الإعدادات الاختيارية في وعاء واحد بدل تمريرها كمعاملات إضافية كثيرة.';
  }
  if (/userdata/i.test(name)) {
    return 'لربط callback بسياق التطبيق الصحيح عند رجوع النتيجة أو وقوع الحدث.';
  }
  if (/\{0\}/.test(initializer)) {
    return 'لأن هذا المسار يتطلب بنية مهيأة من الصفر ثم يقرأ الحقول التي يملؤها المثال يدويًا.';
  }
  if (/".*"/.test(initializer)) {
    return 'لأن المثال يحتاج قيمة نصية حقيقية توضح للمبرمج شكل البيانات التي تمرر في هذا الموضع.';
  }
  return `لأن المثال يحتاج ${name || 'هذه القيمة'} في موضع واضح قبل الاستدعاء أو بعده كي يبقى التسلسل مقروءًا ومباشرًا.`;
}

function buildSdl3ExampleVariableBenefit(entry, item) {
  const baseType = getSdl3BaseTypeName(entry?.type || '');
  const initializer = String(entry?.initializer || '');
  const name = String(entry?.name || '');

  if (initializer.includes(`${item?.name || ''}(`)) {
    return 'يبقي النتيجة متاحة للفحص وإعادة الاستخدام بدل ضياعها داخل تعبير واحد يصعب تتبعه.';
  }
  if (name === 'props' || baseType === 'SDL_PropertiesID') {
    return 'يجعل إضافة خصائص جديدة أو تعديلها أسهل دون تغيير شكل التوقيع نفسه.';
  }
  if (/userdata/i.test(name)) {
    return 'يحافظ على ربط رد النداء بالكائن أو الحالة الصحيحة بدل الاعتماد على متغيرات عامة مبعثرة.';
  }
  if (/\{0\}/.test(initializer)) {
    return 'يمنع قراءة حقول غير مهيأة ويجعل المثال يبدأ من حالة يمكن توقعها ومراجعتها بسهولة.';
  }
  return `يفيد المثال لأنه يحفظ ${name || 'القيمة'} في موضع صريح يمكن قراءته وفهم دوره مباشرة.`;
}

function renderSdl3ExampleRelatedElements(item, example) {
  const code = String(example?.code || '').trim();
  if (!code) {
    return '';
  }

  const referencedItems = collectSdl3ExampleReferencedItems(code, item);
  const localVariables = parseSdl3ExampleLocalVariables(code);
  if (!referencedItems.length && !localVariables.length) {
    return '';
  }

  if (typeof renderUnifiedExampleSupportCard === 'function') {
    const referencedItemsCard = referencedItems.length
      ? `
        <article class="content-card prose-card parameter-detail-card sdl3-example-detail-card">
          <div class="parameter-card-head">
            <div class="parameter-card-order">العناصر المرتبطة</div>
            <div class="parameter-card-title-wrap">
              <h3 class="parameter-card-name">العناصر البرمجية المرتبطة</h3>
            </div>
          </div>
          <div class="parameter-card-fields">
            ${referencedItems.map((refItem) => `
              <div class="parameter-card-field parameter-card-field-wide">
                <div class="parameter-card-field-label">${renderSdl3EntityLink(refItem.name)}</div>
                <div class="parameter-card-field-value">
                  <p><strong>المعنى الحقيقي:</strong> ${renderSdl3PracticalText(buildSdl3PrimaryMeaning(refItem), buildSdl3PrimaryMeaning(refItem))}</p>
                  <p><strong>لماذا يستخدم هنا؟</strong> ${renderSdl3PracticalText(buildSdl3ExampleReferencePurpose(refItem, item, code), buildSdl3ExampleReferencePurpose(refItem, item, code))}</p>
                  <p><strong>فائدته العملية:</strong> ${renderSdl3PracticalText(buildSdl3ExampleReferenceBenefit(refItem), buildSdl3ExampleReferenceBenefit(refItem))}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </article>
      `
      : '';

    const localVariablesCard = localVariables.length
      ? `
        <article class="content-card prose-card parameter-detail-card sdl3-example-detail-card">
          <div class="parameter-card-head">
            <div class="parameter-card-order">المتغيرات</div>
            <div class="parameter-card-title-wrap">
              <h3 class="parameter-card-name">المتغيرات المحلية في المثال</h3>
            </div>
          </div>
          <div class="parameter-card-fields">
            ${localVariables.map((entry) => `
              <div class="parameter-card-field parameter-card-field-wide">
                <div class="parameter-card-field-label"><code dir="ltr">${escapeHtml(entry.name)}</code> من النوع ${renderSdl3TypeReference(entry.type || '')}</div>
                <div class="parameter-card-field-value">
                  <p><strong>المعنى الحقيقي:</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariableMeaning(entry, item), buildSdl3ExampleVariableMeaning(entry, item))}</p>
                  <p><strong>لماذا يستخدم هنا؟</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariablePurpose(entry, item), buildSdl3ExampleVariablePurpose(entry, item))}</p>
                  <p><strong>فائدته العملية:</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariableBenefit(entry, item), buildSdl3ExampleVariableBenefit(entry, item))}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </article>
      `
      : '';

    return `
      <section class="info-section">
        <h2>شرح العناصر الظاهرة في المثال</h2>
        <div class="sdl3-example-detail-grid">
          ${referencedItemsCard}
          ${localVariablesCard}
        </div>
      </section>
    `;
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>شرح العناصر الظاهرة في المثال</h2>
        ${referencedItems.length ? `
          <h3>العناصر البرمجية المرتبطة</h3>
          <ul class="best-practices-list">
            ${referencedItems.map((refItem) => `
              <li>
                <p>${renderSdl3EntityLink(refItem.name)}</p>
                <p><strong>المعنى الحقيقي:</strong> ${renderSdl3PracticalText(buildSdl3PrimaryMeaning(refItem), buildSdl3PrimaryMeaning(refItem))}</p>
                <p><strong>لماذا يستخدم هنا؟</strong> ${renderSdl3PracticalText(buildSdl3ExampleReferencePurpose(refItem, item, code), buildSdl3ExampleReferencePurpose(refItem, item, code))}</p>
                <p><strong>فائدته العملية:</strong> ${renderSdl3PracticalText(buildSdl3ExampleReferenceBenefit(refItem), buildSdl3ExampleReferenceBenefit(refItem))}</p>
              </li>
            `).join('')}
          </ul>
        ` : ''}
        ${localVariables.length ? `
          <h3>المتغيرات المحلية في المثال</h3>
          <ul class="best-practices-list">
            ${localVariables.map((entry) => `
              <li>
                <p><code dir="ltr">${escapeHtml(entry.name)}</code> من النوع ${renderSdl3TypeReference(entry.type || '')}</p>
                <p><strong>المعنى الحقيقي:</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariableMeaning(entry, item), buildSdl3ExampleVariableMeaning(entry, item))}</p>
                <p><strong>لماذا يستخدم هنا؟</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariablePurpose(entry, item), buildSdl3ExampleVariablePurpose(entry, item))}</p>
                <p><strong>فائدته العملية:</strong> ${renderSdl3PracticalText(buildSdl3ExampleVariableBenefit(entry, item), buildSdl3ExampleVariableBenefit(entry, item))}</p>
              </li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    </section>
  `;
}

function renderSdl3FallbackContext(item) {
  if (hasRealSdl3Description(item)) {
    return '';
  }

  const relatedLinks = buildSdl3RelatedLinksSummary(item);
  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>روابط محلية بديلة</h2>
        <p>هذه الصفحة لا تملك وصفًا رسميًا مفصلًا من المصدر، لذلك نربطها بالعناصر المحلية الأقرب لها داخل المشروع حتى لا تبقى الصفحة فارغة أو معزولة.</p>
        <p>${relatedLinks}</p>
      </div>
    </section>
  `;
}

function renderSdl3LifecycleSection(item) {
  const text = buildSdl3LifecycleSummary(item);
  if (!text) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>دورة حياة المورد</h2>
        <p>${renderSdl3PracticalText(text, text)}</p>
      </div>
    </section>
  `;
}

function renderSdl3PracticalExampleSection(item) {
  const example = buildSdl3PracticalExample(item);
  if (!example.code) {
    return '';
  }

  const summaryCards = typeof renderUnifiedExampleSupportCard === 'function'
    ? `
      <section class="info-section">
        <div class="sdl3-example-detail-grid">
          <article class="content-card prose-card parameter-detail-card sdl3-example-detail-card">
            <div class="parameter-card-head">
              <div class="parameter-card-order">الهدف</div>
              <div class="parameter-card-title-wrap">
                <h3 class="parameter-card-name">هدف المثال</h3>
              </div>
            </div>
            <div class="parameter-card-fields">
              <div class="parameter-card-field parameter-card-field-wide">
                <div class="parameter-card-field-label">المعنى العملي</div>
                <div class="parameter-card-field-value"><p>${renderSdl3PracticalText(example.purpose, example.purpose)}</p></div>
              </div>
            </div>
          </article>
          ${example.notes?.length ? `
            <article class="content-card prose-card parameter-detail-card sdl3-example-detail-card">
              <div class="parameter-card-head">
                <div class="parameter-card-order">ملاحظات</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name">ملاحظات التنفيذ</h3>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">ما الذي يجب الانتباه له</div>
                  <div class="parameter-card-field-value">
                    <ul class="best-practices-list">
                      ${example.notes.map((note) => `<li><p>${renderSdl3PracticalText(note, note)}</p></li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ` : ''}
        </div>
      </section>
    `
    : `
      <section class="info-section">
        <div class="content-card prose-card">
          <p>${renderSdl3PracticalText(example.purpose, example.purpose)}</p>
          ${example.notes?.length ? `<p>${example.notes.map((note) => renderSdl3PracticalText(note, note)).join(' ')}</p>` : ''}
        </div>
      </section>
    `;

  return `
    <section class="example-section">
      <h2>مثال عملي</h2>
      ${renderSdl3ExampleCodeBlock(item, example.code)}
    </section>
    ${summaryCards}
    ${renderSdl3ExampleRelatedElements(item, example)}
  `;
}

function renderSdl3InlineReference(name, label = '') {
  const item = findSdl3AnyItemByName(name);
  const text = label || name;
  if (!item) {
    return `<code dir="ltr">${escapeHtml(text)}</code>`;
  }

  const iconType = item.kind === 'type'
    ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item)).icon
    : getSdl3KindMeta(item.kind).icon;
  const content = safeRenderEntityLabel(text, iconType, {code: true});
  return `<a href="#" class="related-link code-token entity-link-with-icon"${buildDeferredSdl3TooltipAttrs(item, text)} onclick="${buildShowSdl3Call(item.kind, item.name)}; return false;">${content}</a>`;
}

function linkSdl3DocText(text) {
  const source = String(text || '');
  const tokenRegex = /\b[A-Za-z_][A-Za-z0-9_]*\b(?:\s*\(\s*\))?/g;
  let lastIndex = 0;
  let rendered = '';

  source.replace(tokenRegex, (match, offset) => {
    rendered += escapeHtml(source.slice(lastIndex, offset));
    const nameMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\b/.exec(match);
    const tokenName = nameMatch ? nameMatch[1] : '';
    const hasCallSuffix = /\(\s*\)\s*$/.test(match);
    rendered += findSdl3AnyItemByName(tokenName)
      ? renderSdl3InlineReference(tokenName, hasCallSuffix ? `${tokenName}()` : tokenName)
      : escapeHtml(match);
    lastIndex = offset + match.length;
    return match;
  });

  rendered += escapeHtml(source.slice(lastIndex));
  return rendered.replace(/\n/g, '<br>');
}

function renderSdl3DocText(text, item = null, options = {}) {
  return linkSdl3DocText(resolveStrictArabicSdl3DocText(text, item, options));
}

function renderSdl3PracticalText(text, fallback = '') {
  let raw = String(text || '').trim();
  const normalizedFallback = normalizeSdl3ArabicTechnicalProse(String(fallback || '').trim());
  if (!raw || hasResidualSdl3EnglishProse(raw)) {
    raw = normalizedFallback || raw;
  }
  raw = normalizeSdl3ArabicTechnicalProse(raw || normalizedFallback);
  if (hasResidualSdl3EnglishProse(raw) && normalizedFallback && !hasResidualSdl3EnglishProse(normalizedFallback)) {
    raw = normalizedFallback;
  }
  if (/<\/?(?:a|code|span|strong)\b/i.test(raw)) {
    return raw;
  }
  return linkSdl3DocText(raw || normalizedFallback);
}

const buildSdl3ReadyExamplePageModel = (...args) => sdl3ReadyExamplePageRuntime?.buildSdl3ReadyExamplePageModel(...args) || null;
const renderSdl3ReadyExamplePageOverviewCard = (...args) => sdl3ReadyExamplePageRuntime?.renderSdl3ReadyExamplePageOverviewCard(...args) || '';
const renderSdl3ReadyExamplePageCodeSection = (...args) => sdl3ReadyExamplePageRuntime?.renderSdl3ReadyExamplePageCodeSection(...args) || '';
const renderSdl3ReadyExamplePageSupportGrid = (...args) => sdl3ReadyExamplePageRuntime?.renderSdl3ReadyExamplePageSupportGrid(...args) || '';
const renderSdl3ReadyExampleCard = (...args) => sdl3ReadyExamplePageRuntime?.renderSdl3ReadyExampleCard(...args) || '';
const renderSdl3ReadyExamplesSection = (...args) => sdl3ReadyExamplePageRuntime?.renderSdl3ReadyExamplesSection(...args) || '';

const summarizeExamplePreviewText = (...args) => vulkanExamplePreviewRuntime?.summarizeExamplePreviewText(...args) || '';
const getVulkanReadyExampleById = (...args) => vulkanExamplePreviewRuntime?.getVulkanReadyExampleById(...args) || null;
const getVulkanExampleGuide = (...args) => vulkanExamplePreviewRuntime?.getVulkanExampleGuide(...args) || null;
const renderVulkanExampleGuideEntry = (...args) => vulkanExamplePreviewRuntime?.renderVulkanExampleGuideEntry(...args) || '';
const renderVulkanExampleOfficialGuidance = (...args) => vulkanExamplePreviewRuntime?.renderVulkanExampleOfficialGuidance(...args) || '';
const renderVulkanExampleProjectExpansion = (...args) => vulkanExamplePreviewRuntime?.renderVulkanExampleProjectExpansion(...args) || '';
const getVulkanExamplePreviewEntries = (...args) => vulkanExamplePreviewRuntime?.getVulkanExamplePreviewEntries(...args) || [];
const renderVulkanExamplesGroupedIndexSection = (...args) => vulkanExamplePreviewRuntime?.renderVulkanExamplesGroupedIndexSection(...args) || '';
const renderVulkanExamplesPreviewSection = (...args) => vulkanExamplePreviewRuntime?.renderVulkanExamplesPreviewSection(...args) || '';
const renderVulkanReadyExampleCodeBlock = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExampleCodeBlock(...args) || '';
const renderVulkanReadyExampleExplanation = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExampleExplanation(...args) || '';
const renderVulkanReadyExamplePageOverviewCard = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExamplePageOverviewCard(...args) || '';
const renderVulkanReadyExamplePageCodeSection = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExamplePageCodeSection(...args) || '';
const renderVulkanReadyExamplePageCommandsSection = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExamplePageCommandsSection(...args) || '';
const renderVulkanReadyExamplePageSupportGrid = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExamplePageSupportGrid(...args) || '';
const renderVulkanReadyExampleCard = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExampleCard(...args) || '';
const renderVulkanReadyExamplesSection = (...args) => vulkanReadyExamplePageRuntime?.renderVulkanReadyExamplesSection(...args) || '';
const getVulkanHomeRecentItems = (...args) => vulkanHomeRuntime?.getVulkanHomeRecentItems(...args) || [];
const buildVulkanHomeLibraryModel = (...args) => vulkanHomeRuntime?.buildVulkanHomeLibraryModel(...args) || null;
const buildCppHomeLibraryModel = (...args) => cppHomeRuntime?.buildCppHomeLibraryModel(...args) || null;
const buildFfmpegHomeLibraryModelLegacy = (...args) => ffmpegHomeRuntime?.buildFfmpegHomeLibraryModel(...args) || null;
const getCmakeHomeRecentItems = (...args) => cmakeHomeRuntime?.getCmakeHomeRecentItems(...args) || [];
const buildCmakeHomeLibraryModel = (...args) => cmakeHomeRuntime?.buildCmakeHomeLibraryModel(...args) || null;
const getHomeSdl3PackageKeys = (...args) => sdl3HomeRuntime?.getHomeSdl3PackageKeys(...args) || [];
const getSdl3HomePackageMeta = (...args) => sdl3HomeRuntime?.getSdl3HomePackageMeta(...args) || null;
const buildSdl3PackageSectionReasonFromMeta = (...args) => sdl3HomeRuntime?.buildSdl3PackageSectionReasonFromMeta(...args) || '';
const getSdl3HomePackageCount = (...args) => sdl3HomeRuntime?.getSdl3HomePackageCount(...args) || 0;
const getSdl3HomeRecentItems = (...args) => sdl3HomeRuntime?.getSdl3HomeRecentItems(...args) || [];
const buildSdl3HomeLibraryModel = (...args) => sdl3HomeRuntime?.buildSdl3HomeLibraryModel(...args) || null;
const buildHomeLibraryModels = (...args) => homeShellRuntime?.buildHomeLibraryModels(...args) || [];
const buildHomeHeroStats = (...args) => homeShellRuntime?.buildHomeHeroStats(...args) || [];
const generateTreeHTML = (...args) => treeRuntime?.generateTreeHTML(...args) || '';
const countItems = (...args) => treeRuntime?.countItems(...args) || 0;
const normalizeLookupName = (...args) => categoryLookupRuntime?.normalizeLookupName(...args) || '';
const buildCategoryLookupMaps = (...args) => categoryLookupRuntime?.buildCategoryLookupMaps(...args) || {directMap: new Map(), metaMap: new Map()};
const getCategoryLookupMap = (...args) => categoryLookupRuntime?.getCategoryLookupMap(...args) || new Map();
const getCategoryLookupMetaMap = (...args) => categoryLookupRuntime?.getCategoryLookupMetaMap(...args) || new Map();
const findItemInCategories = (...args) => categoryLookupRuntime?.findItemInCategories(...args) || null;
const findItemInCategoriesWithMeta = (...args) => categoryLookupRuntime?.findItemInCategoriesWithMeta(...args) || null;

function getGlslReadyExampleById(exampleId = '') {
  return (glslReadyExamples || []).find((example) => example.id === exampleId) || null;
}

function getGlslExampleGuide(example = {}) {
  const exampleId = String(example?.id || '').trim();
  if (!exampleId) {
    return null;
  }

  return GLSL_EXAMPLE_GUIDES[exampleId] || null;
}

function renderGlslExampleGuideEntry(entry = {}) {
  if (!entry || typeof entry !== 'object') {
    return '';
  }

  if (entry.type === 'entity' && entry.name) {
    return renderGlslReferenceChip(entry.name) || '';
  }

  if (entry.type === 'imgui' && entry.name) {
    return renderImguiEntityLink(entry.name, entry.name, {
      className: 'related-link code-token entity-link-with-icon',
      iconType: 'imgui'
    }) || '';
  }

  if (entry.name) {
    return renderRelatedReferenceLink(entry.name, {tooltipContext: 'reference-summary'}) || '';
  }

  if (entry.type === 'example' && entry.id) {
    const targetExample = getGlslReadyExampleById(entry.id);
    const label = entry.label || getGlslExampleDisplayTitle(targetExample || {id: entry.id});
    const tooltip = `يفتح المثال التالي المقترح: ${label}`;
    return `<a href="#" class="related-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(label)}" onclick="showGlslExample('${escapeAttribute(entry.id)}'); return false;">${escapeHtml(label)}</a>`;
  }

  if (entry.href) {
    const label = entry.label || entry.href;
    return `<a href="${escapeAttribute(entry.href)}" class="related-link" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }

  return '';
}

function renderGlslExampleOfficialGuidance(guide = null) {
  if (!guide) {
    return '';
  }

  const referenceLinks = (guide.officialReferences || [])
    .map((entry) => renderGlslExampleGuideEntry(entry))
    .filter(Boolean)
    .join('');

  if (!guide.officialSummaryArabic && !referenceLinks) {
    return '';
  }

  return `
    ${guide.officialSummaryArabic ? `<p><strong>لماذا يفيد هذا المرجع:</strong> ${renderGlslTechnicalProse(guide.officialSummaryArabic)}</p>` : ''}
    ${referenceLinks ? `<div class="see-also-links">${referenceLinks}</div>` : ''}
  `;
}

function renderGlslExampleProjectExpansion(guide = null) {
  if (!guide) {
    return '';
  }

  const steps = Array.isArray(guide.projectStepsArabic) ? guide.projectStepsArabic : [];
  const followUpLinks = (guide.followUpExamples || [])
    .map((entry) => renderGlslExampleGuideEntry(entry))
    .filter(Boolean)
    .join('');

  if (!guide.fullProjectNoteArabic && !steps.length && !followUpLinks) {
    return '';
  }

  return `
    ${guide.fullProjectNoteArabic ? `<p><strong>المعنى الحقيقي داخل المثال:</strong> ${renderGlslTechnicalProse(guide.fullProjectNoteArabic)}</p>` : ''}
    ${steps.length ? `
      <ul class="best-practices-list">
        ${steps.map((entry) => `<li><p>${renderGlslTechnicalProse(entry)}</p></li>`).join('')}
      </ul>
    ` : ''}
    ${followUpLinks ? `
      <p><strong>أمثلة متابعة مفيدة:</strong></p>
      <div class="see-also-links">${followUpLinks}</div>
    ` : ''}
  `;
}

const buildSdl3ExampleCompositeName = (...args) => sdl3ExamplePreviewRuntime?.buildSdl3ExampleCompositeName(...args) || '';
const parseSdl3ExampleCompositeName = (...args) => sdl3ExamplePreviewRuntime?.parseSdl3ExampleCompositeName(...args) || { packageKey: 'core', exampleId: '' };
const getSdl3ReadyExampleById = (...args) => sdl3ExamplePreviewRuntime?.getSdl3ReadyExampleById(...args) || null;
const buildSdl3ExampleGuideKey = (...args) => sdl3ExamplePreviewRuntime?.buildSdl3ExampleGuideKey(...args) || '';
function getSdl3ExampleGuide(...args) {
  return sdl3ExamplePreviewRuntime?.getSdl3ExampleGuide(...args) || null;
}
const renderSdl3ExampleGuideEntry = (...args) => sdl3ExamplePreviewRuntime?.renderSdl3ExampleGuideEntry(...args) || '';
function renderSdl3ExampleOfficialGuidance(...args) {
  return sdl3ExamplePreviewRuntime?.renderSdl3ExampleOfficialGuidance(...args) || '';
}
function renderSdl3ExampleProjectExpansion(...args) {
  return sdl3ExamplePreviewRuntime?.renderSdl3ExampleProjectExpansion(...args) || '';
}
const getSdl3ExamplePreviewEntries = (...args) => sdl3ExamplePreviewRuntime?.getSdl3ExamplePreviewEntries(...args) || [];
const renderSdl3ExamplesPreviewSection = (...args) => sdl3ExamplePreviewRuntime?.renderSdl3ExamplesPreviewSection(...args) || '';
const renderSdl3ExamplesGroupedIndexSection = (...args) => sdl3ExamplePreviewRuntime?.renderSdl3ExamplesGroupedIndexSection(...args) || '';
const renderSdl3AudioChannelLayoutGuidePage = (...args) => sdl3ExamplePreviewRuntime?.renderSdl3AudioChannelLayoutGuidePage(...args) || '';

const renderImguiExampleShot = (...args) => imguiExamplePreviewRuntime?.renderImguiExampleShot(...args) || '';
const renderImguiExamplePreviewMedia = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplePreviewMedia(...args) || '';
const buildImguiExamplePageModel = (...args) => imguiExamplePreviewRuntime?.buildImguiExamplePageModel(...args) || null;
const getImguiExampleGuide = (...args) => imguiExamplePreviewRuntime?.getImguiExampleGuide(...args) || null;
const renderImguiExampleGuideEntry = (...args) => imguiExamplePreviewRuntime?.renderImguiExampleGuideEntry(...args) || '';
const renderImguiExampleOfficialGuidance = (...args) => imguiExamplePreviewRuntime?.renderImguiExampleOfficialGuidance(...args) || '';
const renderImguiExampleProjectExpansion = (...args) => imguiExamplePreviewRuntime?.renderImguiExampleProjectExpansion(...args) || '';
const renderImguiExamplePageOverviewCard = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplePageOverviewCard(...args) || '';
const renderImguiExamplePageCodeSection = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplePageCodeSection(...args) || '';
const renderImguiExamplePageSupportGrid = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplePageSupportGrid(...args) || '';
const getImguiExampleEntries = (...args) => imguiExamplePreviewRuntime?.getImguiExampleEntries(...args) || [];
const getGroupedImguiExampleItems = (...args) => imguiExamplePreviewRuntime?.getGroupedImguiExampleItems(...args) || [];
const renderImguiExamplesGroupedIndexSection = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplesGroupedIndexSection(...args) || '';
const renderImguiExamplesPreviewSection = (...args) => imguiExamplePreviewRuntime?.renderImguiExamplesPreviewSection(...args) || '';
let SDL3_NATIVE_SYMBOL_INFO = Object.freeze({});
function getSdl3ParameterRenderRuntimeInstance() {
  return typeof sdl3ParameterRenderRuntime !== 'undefined' ? sdl3ParameterRenderRuntime : null;
}
const getSdl3DisplayParameters = (...args) => sdl3ParameterRenderRuntime?.getSdl3DisplayParameters(...args) || [];
const getSdl3DisplayedParameterType = (...args) => sdl3ParameterRenderRuntime?.getSdl3DisplayedParameterType(...args) || {text: '—', isCode: false};
const buildSdl3ParameterDescriptionFallback = (...args) => sdl3ParameterRenderRuntime?.buildSdl3ParameterDescriptionFallback(...args) || '';
const looksLikeSdl3CodeExpression = (...args) => sdl3ParameterRenderRuntime?.looksLikeSdl3CodeExpression(...args) || false;
const formatSdl3CodeExpressionText = (...args) => sdl3ParameterRenderRuntime?.formatSdl3CodeExpressionText(...args) || '';
const renderSdl3ParameterDescriptionCell = (...args) => sdl3ParameterRenderRuntime?.renderSdl3ParameterDescriptionCell(...args) || '';
const renderSdl3ParameterDescriptionText = (...args) => sdl3ParameterRenderRuntime?.renderSdl3ParameterDescriptionText(...args) || '';
const buildSdl3ParameterTooltip = (...args) => sdl3ParameterRenderRuntime?.buildSdl3ParameterTooltip(...args) || '';
const getSdl3ParameterAnchorId = (...args) => sdl3ParameterRenderRuntime?.getSdl3ParameterAnchorId(...args) || '';
const inferSdl3ParameterDirectionLabel = (...args) => sdl3ParameterRenderRuntime?.inferSdl3ParameterDirectionLabel(...args) || 'دخل مباشر';
const buildSdl3FieldTooltip = (...args) => sdl3ParameterRenderRuntime?.buildSdl3FieldTooltip(...args) || '';

let sdl3CodeRuntime = null;
function getSdl3CodeRuntime() {
  if (sdl3CodeRuntime) {
    return sdl3CodeRuntime;
  }

  const creator = window.__ARABIC_VULKAN_SDL3_CODE_RUNTIME__?.createSdl3CodeRuntime;
  const parameterRuntime = getSdl3ParameterRenderRuntimeInstance();
  if (typeof creator !== 'function' || !parameterRuntime) {
    return null;
  }

  const nativeSymbolInfo = Object.keys(SDL3_NATIVE_SYMBOL_INFO || {}).length
    ? SDL3_NATIVE_SYMBOL_INFO
    : (parameterRuntime.SDL3_NATIVE_SYMBOL_INFO || SDL3_NATIVE_SYMBOL_INFO);
  const sdl3CKeywords = parameterRuntime.SDL3_C_KEYWORDS || new Set();
  const sdl3CTypeKeywords = parameterRuntime.SDL3_C_TYPE_KEYWORDS || new Set();
  sdl3CodeRuntime = creator({
    SDL3_NATIVE_SYMBOL_INFO: nativeSymbolInfo,
    SDL3_C_KEYWORDS: sdl3CKeywords,
    SDL3_C_TYPE_KEYWORDS: sdl3CTypeKeywords,
    composeSemanticTooltip,
    sanitizeTooltipText,
    safeRenderEntityLabel,
    escapeHtml,
    escapeAttribute,
    buildDeferredSdl3TooltipAttrsByName: (...args) => buildDeferredSdl3TooltipAttrsByName(...args),
    findSdl3AnyItemByName: (...args) => findSdl3AnyItemByName(...args),
    findSdl3CoreSymbolSeedByName: (...args) => findSdl3CoreSymbolSeedByName(...args),
    getCachedSdl3ReferenceTooltip: (...args) => getCachedSdl3ReferenceTooltip(...args),
    buildShowSdl3Call: (...args) => buildShowSdl3Call(...args),
    getSdl3CollectionMeta: (...args) => getSdl3CollectionMeta(...args),
    getSdl3TypeSectionDataKey: (...args) => getSdl3TypeSectionDataKey(...args),
    parseSdl3CallbackSignature: (...args) => parseSdl3CallbackSignature(...args),
    parseSdl3FunctionSignature: (...args) => parseSdl3FunctionSignature(...args),
    buildSdl3ReturnMeaning: (...args) => buildSdl3ReturnMeaning(...args),
    buildSdl3ReturnHandlingHint: (...args) => buildSdl3ReturnHandlingHint(...args),
    getSdl3ExactElementTypeInfo: (...args) => getSdl3ExactElementTypeInfo(...args),
    normalizeSdl3DocValue: (...args) => normalizeSdl3DocValue(...args),
    preferArabicSdl3DocText: (...args) => preferArabicSdl3DocText(...args),
    normalizeSdl3ArabicTechnicalProse: (...args) => normalizeSdl3ArabicTechnicalProse(...args),
    getSdl3DisplayParameters: (...args) => getSdl3DisplayParameters(...args),
    parseSdl3StructFields: (...args) => parseSdl3StructFields(...args),
    buildSdl3ParameterTooltip: (...args) => buildSdl3ParameterTooltip(...args),
    getSdl3ParameterAnchorId: (...args) => getSdl3ParameterAnchorId(...args),
    buildSdl3FieldTooltip: (...args) => buildSdl3FieldTooltip(...args),
    buildSdl3ReferenceTooltip: (...args) => buildSdl3ReferenceTooltip(...args),
    buildSdl3ShortReferenceTooltip: (...args) => buildSdl3ShortReferenceTooltip(...args),
    renderEntityIcon,
    getSdl3KindMeta: (...args) => getSdl3KindMeta(...args),
    renderDocCodeContainer: (...args) => renderDocCodeContainer(...args)
  });
  return sdl3CodeRuntime;
}

const getSdl3CodeClassForKind = (...args) => getSdl3CodeRuntime()?.getSdl3CodeClassForKind(...args) || 'type';
const buildSdl3GenericNativeTooltip = (...args) => getSdl3CodeRuntime()?.buildSdl3GenericNativeTooltip(...args) || '';
const getSdl3NativeSymbolInfo = (...args) => getSdl3CodeRuntime()?.getSdl3NativeSymbolInfo(...args) || null;
const renderSdl3InteractiveCodeToken = (...args) => getSdl3CodeRuntime()?.renderSdl3InteractiveCodeToken(...args) || escapeHtml(String(args[0] || ''));
const resolveSdl3CodeReferenceToken = (...args) => getSdl3CodeRuntime()?.resolveSdl3CodeReferenceToken(...args) || null;
const getSdl3ReturnTypeTokens = (...args) => getSdl3CodeRuntime()?.getSdl3ReturnTypeTokens(...args) || new Set();
const buildSdl3ReturnTypeTooltip = (...args) => getSdl3CodeRuntime()?.buildSdl3ReturnTypeTooltip(...args) || '';
const renderSdl3CodeCommentToken = (...args) => getSdl3CodeRuntime()?.renderSdl3CodeCommentToken(...args) || '';
const renderSdl3AnnotatedCodeSegment = (...args) => getSdl3CodeRuntime()?.renderSdl3AnnotatedCodeSegment(...args) || escapeHtml(String(args[0] || ''));
const renderSdl3AnnotatedCodeSnippet = (...args) => getSdl3CodeRuntime()?.renderSdl3AnnotatedCodeSnippet(...args) || escapeHtml(String(args[0] || ''));
const renderSdl3SyntaxCodeBlock = (...args) => getSdl3CodeRuntime()?.renderSdl3SyntaxCodeBlock(...args) || '';
function renderSdl3ExampleCodeBlock(...args) {
  return getSdl3CodeRuntime()?.renderSdl3ExampleCodeBlock(...args) || '';
}

function parseSdl3FunctionSignature(syntax) {
  const source = String(syntax || '').replace(/\s+/g, ' ').trim();
  const match = /^(.*?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*;?$/.exec(source);
  if (!match) {
    return {returnType: '', name: '', params: []};
  }

  const rawParams = String(match[3] || '').trim();
  return {
    returnType: String(match[1] || '').trim(),
    name: String(match[2] || '').trim(),
    params: rawParams && rawParams !== 'void' ? rawParams.split(/\s*,\s*/) : []
  };
}

function parseSdl3StructFields(syntax) {
  const match = /typedef\s+struct(?:\s+[A-Za-z_][A-Za-z0-9_]*)?\s*\{([\s\S]*?)\}\s*[A-Za-z_][A-Za-z0-9_]*\s*;?/m.exec(String(syntax || ''));
  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^(?:\/\*|\*\/|\/\/)/.test(line))
    .map((line) => line.replace(/\/\*.*?\*\//g, '').trim())
    .map((line) => {
      const fieldMatch = /^(.*?)([A-Za-z_][A-Za-z0-9_]*)(\[[^\]]+\])?\s*;$/.exec(line);
      if (!fieldMatch) {
        return null;
      }
      return {
        type: `${String(fieldMatch[1] || '').trim()}${fieldMatch[3] || ''}`.trim(),
        name: String(fieldMatch[2] || '').trim()
      };
    })
    .filter(Boolean);
}

function parseSdl3MacroDefinition(syntax) {
  const match = /^\s*#define\s+([A-Za-z_][A-Za-z0-9_]*)\s+(.+)$/m.exec(String(syntax || ''));
  if (!match) {
    return {value: '', rawValue: '', trailingComment: ''};
  }

  const rawValue = String(match[2] || '').trim();
  const commentMatch = /\s+(\/\*\*?<[\s\S]*?\*\/|\/\*[\s\S]*?\*\/|\/\/[^\n]*)\s*$/.exec(rawValue);
  const trailingComment = commentMatch ? String(commentMatch[1] || '').trim() : '';

  return {
    value: trailingComment ? rawValue.slice(0, commentMatch.index).trim() : rawValue,
    rawValue,
    trailingComment
  };
}

function getSdl3FieldRemarkMap(item) {
  const map = {};
  (item?.remarks || []).forEach((remark) => {
    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s+is\s+(.+)$/i.exec(String(remark || '').replace(/\s+/g, ' ').trim());
    if (match) {
      map[match[1]] = match[2];
    }
  });
  return map;
}

function getSdl3NameAction(item) {
  const words = splitSdl3IdentifierWords(item?.name || '');
  return words[0] || '';
}

function buildSdl3MixerQueryParameterProfile(name, label) {
  return {
    parameterRoles: {
      [name]: `هذا هو ${label} الذي ستقرأ الدالة حالته الحالية أو خصائصه الفعلية دون إنشاء مورد جديد.`
    },
    parameterPurposes: {
      [name]: `لأن SDL3_mixer يحتاج معرفة أي ${label} يجب أن يستعلم عنه داخل هذا الاستدعاء.`
    },
    parameterUsage: {
      [name]: `مرر ${name === 'mixer' ? 'MIX_Mixer' : name === 'track' ? 'MIX_Track' : name === 'group' ? 'MIX_Group' : name === 'audiodecoder' ? 'MIX_AudioDecoder' : 'MIX_Audio'} صالحًا يمثل ${label} الذي تريد قراءة هذه المعلومة منه فعليًا.`
    }
  };
}



function getSdl3ObjectMeaning(words = [], item = null) {
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  if (specialProfile?.objectMeaning) {
    return specialProfile.objectMeaning;
  }

  const joined = words.join(' ');
  const phraseMap = [
    [/Audio Duration/gi, 'مدة الصوت بوحدة إطارات العينات'],
    [/Audio Decoder Format/gi, 'تنسيق مفكك الترميز الصوتي'],
    [/Audio Decoder Properties/gi, 'خصائص مفكك الترميز الصوتي'],
    [/Audio Format/gi, 'تنسيق الصوت الابتدائي'],
    [/Audio Properties/gi, 'خصائص الصوت'],
    [/Tagged Tracks/gi, 'المسارات المرتبطة بالوسم المطلوب'],
    [/Track 3D Position/gi, 'موضع المسار في الفضاء ثلاثي الأبعاد'],
    [/Track Audio Stream/gi, 'مجرى الصوت المرتبط بالمسار'],
    [/Track Audio/gi, 'المورد الصوتي المرتبط بالمسار'],
    [/Track Fade Frames/gi, 'حالة التلاشي الحالية للمسار'],
    [/Track Frequency Ratio/gi, 'نسبة تردد المسار'],
    [/Track Playback Position/gi, 'موضع القراءة الحالي للمسار'],
    [/Track Remaining/gi, 'إطارات العينات المتبقية في المسار'],
    [/Track Tags/gi, 'أوسمة المسار الحالية'],
    [/Track Loops/gi, 'عدد التكرارات المتبقية للمسار'],
    [/Track Gain/gi, 'كسب المسار الحالي'],
    [/Track Mixer/gi, 'المِكسر المالك للمسار'],
    [/Group Mixer/gi, 'المِكسر المالك للمجموعة'],
    [/Group Properties/gi, 'خصائص مجموعة المزج'],
    [/Mixer Frequency Ratio/gi, 'نسبة التردد الرئيسية للمِكسر'],
    [/Mixer Gain/gi, 'الكسب الرئيسي للمِكسر'],
    [/Mixer Format/gi, 'تنسيق خرج المِكسر'],
    [/Mixer Properties/gi, 'خصائص المِكسر'],
    [/Num Audio Decoders/gi, 'عدد مفككات الترميز الصوتية'],
    [/Touch Devices/gi, 'أجهزة اللمس'],
    [/Touch Device Name/gi, 'اسم جهاز اللمس'],
    [/Touch Device Type/gi, 'نوع جهاز اللمس'],
    [/Touch Device/gi, 'جهاز اللمس'],
    [/Touchpad Finger/gi, 'إصبع لوحة اللمس'],
    [/Touchpad/gi, 'لوحة اللمس'],
    [/Sensor Non Portable Type For ID/gi, 'النوع المنصي الخام للحساس المحدد بمعرّفه'],
    [/Sensor Type For ID/gi, 'النوع العام للحساس المحدد بمعرّفه'],
    [/Sensor Name For ID/gi, 'اسم الحساس المحدد بمعرّفه'],
    [/File Dialog/gi, 'مربع حوار الملفات'],
    [/Dialog File Filter/gi, 'فلتر حوار الملفات'],
    [/File Filter/gi, 'فلتر الملفات'],
    [/Group Post Mix Callback/gi, 'رد نداء المزج اللاحق للمجموعة'],
    [/Post Mix Callback/gi, 'رد نداء المزج اللاحق'],
    [/Pre Mix Callback/gi, 'رد نداء المزج المسبق'],
    [/Animation Encoder/gi, 'مرمّز الرسوم المتحركة'],
    [/Animation Decoder/gi, 'مفكك ترميز الرسوم المتحركة'],
    [/Animation Stream/gi, 'مجرى الرسوم المتحركة'],
    [/Text Engine/gi, 'محرك النص'],
    [/GPU Device/gi, 'جهاز الرسوميات'],
    [/IOStream/gi, 'مجرى الإدخال/الإخراج'],
    [/Render Driver/gi, 'مشغل التصيير'],
    [/Window Surface/gi, 'سطح النافذة'],
    [/Audio Stream/gi, 'مجرى الصوت'],
    [/Gamepad/gi, 'ذراع التحكم'],
    [/Mouse Cursor/gi, 'مؤشر الفأرة']
  ];

  let translated = joined;
  phraseMap.forEach(([pattern, replacement]) => {
    translated = translated.replace(pattern, replacement);
  });

  if (translated !== joined) {
    return translateSdl3LoosePhrase(translated);
  }

  if (/File Dialogs/i.test(item?.categoryTitle || '')) {
    return 'مربع حوار الملفات';
  }

  return humanizeSdl3Words(words);
}

const buildSdl3FunctionMeaning = (...args) => sdl3DetailRuntime?.buildSdl3FunctionMeaning(...args) || '';
const buildSdl3FunctionPurpose = (...args) => sdl3DetailRuntime?.buildSdl3FunctionPurpose(...args) || '';
const buildSdl3EffectHint = (...args) => sdl3DetailRuntime?.buildSdl3EffectHint(...args) || '';
const buildSdl3WhenToUseHint = (...args) => sdl3DetailRuntime?.buildSdl3WhenToUseHint(...args) || '';
const buildSdl3TypeMeaning = (...args) => sdl3DetailRuntime?.buildSdl3TypeMeaning(...args) || '';
const buildSdl3TypePurpose = (...args) => sdl3DetailRuntime?.buildSdl3TypePurpose(...args) || '';
const buildSdl3TypePracticalUsage = (...args) => sdl3DetailRuntime?.buildSdl3TypePracticalUsage(...args) || '';
const buildSdl3TypeCodeAppearance = (...args) => sdl3DetailRuntime?.buildSdl3TypeCodeAppearance(...args) || '';
const buildSdl3MacroKind = (...args) => sdl3DetailRuntime?.buildSdl3MacroKind(...args) || '';
const buildSdl3PropertyFallbackDescription = (...args) => sdl3DetailRuntime?.buildSdl3PropertyFallbackDescription(...args) || '';
const buildSdl3PropertyOfficialDescription = (...args) => sdl3DetailRuntime?.buildSdl3PropertyOfficialDescription(...args) || '';
const buildSdl3PropertyMeaning = (...args) => sdl3DetailRuntime?.buildSdl3PropertyMeaning(...args) || '';
const buildSdl3PropertyWhenToUse = (...args) => sdl3DetailRuntime?.buildSdl3PropertyWhenToUse(...args) || '';
const buildSdl3PropertyBenefit = (...args) => sdl3DetailRuntime?.buildSdl3PropertyBenefit(...args) || '';
const buildSdl3PropertyRequirementText = (...args) => sdl3DetailRuntime?.buildSdl3PropertyRequirementText(...args) || '';
const buildSdl3PropertyDefaultText = (...args) => sdl3DetailRuntime?.buildSdl3PropertyDefaultText(...args) || '';
const buildSdl3PropertyConstraints = (...args) => sdl3DetailRuntime?.buildSdl3PropertyConstraints(...args) || '';
const buildSdl3PropertyMacroProfile = (...args) => sdl3DetailRuntime?.buildSdl3PropertyMacroProfile(...args) || null;
const buildSdl3MacroMeaning = (...args) => sdl3DetailRuntime?.buildSdl3MacroMeaning(...args) || '';
const buildSdl3MacroPurpose = (...args) => sdl3DetailRuntime?.buildSdl3MacroPurpose(...args) || '';
const buildSdl3MacroPracticalUsage = (...args) => sdl3DetailRuntime?.buildSdl3MacroPracticalUsage(...args) || '';
const buildSdl3ParameterRole = (...args) => sdl3DetailRuntime?.buildSdl3ParameterRole(...args) || '';
const buildSdl3ParameterPurpose = (...args) => sdl3DetailRuntime?.buildSdl3ParameterPurpose(...args) || '';
const buildSdl3ParameterInputHint = (...args) => sdl3DetailRuntime?.buildSdl3ParameterInputHint(...args) || '';
const buildSdl3ParameterPracticalUsage = (...args) => sdl3DetailRuntime?.buildSdl3ParameterPracticalUsage(...args) || '';
const buildSdl3ParameterMisuseImpact = (...args) => sdl3DetailRuntime?.buildSdl3ParameterMisuseImpact(...args) || '';
const buildSdl3FieldMeaning = (...args) => sdl3DetailRuntime?.buildSdl3FieldMeaning(...args) || '';
const buildSdl3FieldOfficialDescription = (...args) => sdl3DetailRuntime?.buildSdl3FieldOfficialDescription(...args) || '';
const buildSdl3FieldPurpose = (...args) => sdl3DetailRuntime?.buildSdl3FieldPurpose(...args) || '';
const buildSdl3FieldPracticalUsage = (...args) => sdl3DetailRuntime?.buildSdl3FieldPracticalUsage(...args) || '';
const buildSdl3OperationalProfile = (...args) => sdl3DetailRuntime?.buildSdl3OperationalProfile(...args) || null;
const renderSdl3OperationalProfile = (...args) => sdl3DetailRuntime?.renderSdl3OperationalProfile(...args) || '';
const renderSdl3StructFields = (...args) => sdl3DetailRuntime?.renderSdl3StructFields(...args) || '';
const renderSdl3MacroDetails = (...args) => sdl3DetailRuntime?.renderSdl3MacroDetails(...args) || '';
const renderSdl3TypeDetails = (...args) => sdl3DetailRuntime?.renderSdl3TypeDetails(...args) || '';
const buildSdl3ReferenceTooltip = (...args) => sdl3DetailRuntime?.buildSdl3ReferenceTooltip(...args) || '';
const compactSdl3SearchPreviewText = (...args) => sdl3DetailRuntime?.compactSdl3SearchPreviewText(...args) || '';
const buildSdl3SearchPreview = (...args) => sdl3DetailRuntime?.buildSdl3SearchPreview(...args) || '';

function getCachedSdl3ReferenceTooltip(item) {
  return buildSdl3ReferenceTooltip(item);
}

function buildDeferredSdl3TooltipAttrs(item, label = '') {
  const text = String(label || item?.displayName || item?.name || '').trim();
  const refName = String(item?.name || '').trim();
  if (!refName) {
    return ` tabindex="0" aria-label="${escapeAttribute(text)}"`;
  }

  return ` data-tooltip-ref="sdl3:${escapeAttribute(refName)}" data-tooltip-label="${escapeAttribute(text)}" tabindex="0" aria-label="${escapeAttribute(text)}"`;
}

function buildDeferredSdl3TooltipAttrsByName(name = '', label = '') {
  const refName = String(name || '').trim();
  const text = String(label || refName).trim();
  if (!refName) {
    return ` tabindex="0" aria-label="${escapeAttribute(text)}"`;
  }

  return ` data-tooltip-ref="sdl3:${escapeAttribute(refName)}" data-tooltip-label="${escapeAttribute(text)}" tabindex="0" aria-label="${escapeAttribute(text)}"`;
}

const getSdl3CollectionGroupTitle = (...args) => sdl3NavRuntime?.getSdl3CollectionGroupTitle(...args) || '';
const getSdl3GroupedItems = (...args) => sdl3NavRuntime?.getSdl3GroupedItems(...args) || [];
function getSdl3PackageItems(...args) {
  if (typeof sdl3NavRuntime?.getSdl3PackageItems === 'function') {
    return sdl3NavRuntime.getSdl3PackageItems(...args);
  }
  const [packageKey, dataKey] = args;
  return getSdl3EntityItems(dataKey).filter((item) => String(item?.packageKey || 'core') === String(packageKey || 'core'));
}
function getSdl3PackageTotalCount(...args) {
  if (typeof sdl3NavRuntime?.getSdl3PackageTotalCount === 'function') {
    return sdl3NavRuntime.getSdl3PackageTotalCount(...args);
  }
  const [packageKey, options = {}] = args;
  const dataKeys = options.visibleOnly
    ? ['functions', 'macros', 'constants', 'variables', 'structures']
    : ['functions', 'types', 'enums', 'constants', 'macros'];
  return dataKeys
    .map((dataKey) => getSdl3PackageItems(packageKey, dataKey).length)
    .reduce((total, count) => total + count, 0);
}
function getSdl3PackageInfo(...args) {
  return sdl3NavRuntime?.getSdl3PackageInfo(...args) || null;
}
function getSdl3PackageSectionId(packageKey, dataKey) {
  return `sdl3-${String(packageKey || 'core')}-${String(dataKey || '').trim()}-list`;
}
function getSdl3PackageBranchId(packageKey) {
  return `sdl3-${String(packageKey || 'core')}-branch`;
}
function getSdl3PackageSectionCompositeName(packageKey, dataKey) {
  return `${String(packageKey || 'core')}::${String(dataKey || 'functions')}`;
}
function getSdl3PackageSectionStateKey(packageKey, dataKey) {
  return `${String(packageKey || 'core')}::${String(dataKey || 'functions')}`;
}
function parseSdl3PackageSectionCompositeName(value) {
  const [packageKey = '', dataKey = 'functions'] = String(value || '').split('::');
  return {
    packageKey,
    dataKey
  };
}
function rememberSdl3NavGroupState(...args) {
  return sdl3NavRuntime?.rememberSdl3NavGroupState?.(...args);
}

function buildShowSdl3Call(_kind, name) {
  return `showSdl3Reference('${escapeAttribute(String(name || '').trim())}')`;
}

const renderSdl3IndexGroupSection = (...args) => sdl3NavRuntime?.renderSdl3IndexGroupSection(...args) || '';
const renderSdl3NavItem = (...args) => sdl3NavRuntime?.renderSdl3NavItem(...args) || '';
const renderSdl3LazyNavGroup = (...args) => sdl3NavRuntime?.renderSdl3LazyNavGroup(...args) || '';
const hydrateLazySdl3NavGroup = (...args) => sdl3NavRuntime?.hydrateLazySdl3NavGroup?.(...args);
const hydrateExpandedSdl3NavGroups = (...args) => sdl3NavRuntime?.hydrateExpandedSdl3NavGroups(...args);
const renderSdl3IndexGroupsProgressively = (...args) => sdl3NavRuntime?.renderSdl3IndexGroupsProgressively(...args) || '';
const rememberSdl3PackageSectionState = (...args) => sdl3NavRuntime?.rememberSdl3PackageSectionState(...args);
const rememberSdl3PackageSectionStateById = (...args) => sdl3NavRuntime?.rememberSdl3PackageSectionStateById(...args);

function normalizeSdl3PropertyRemarkText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function collectSdl3PropertyNames(text) {
  return [...new Set(
    (String(text || '').match(/\b(?:SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+\b/g) || [])
      .map((name) => String(name || '').trim())
      .filter(Boolean)
  )];
}
function isSdl3PropertyMacro(item) {
  return /^((SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+)/.test(String(item?.name || '').trim());
}

function getSdl3MacroVersionParameterProfile(param, item) {
  if (item?.kind !== 'macro' || !/VERSION_ATLEAST$/.test(String(item?.name || ''))) {
    return null;
  }

  const name = String(param?.name || '').trim();
  if (!name) {
    return null;
  }

  const axisMap = {
    X: {
      axis: 'الإصدار الرئيسي',
      usage: 'مرر رقم الإصدار الرئيسي الأدنى الذي تريد قبول هذه النسخة ابتداءً منه.',
      invalid: 'إذا مررت قيمة رئيسية أعلى من المطلوب فعليًا فقد ترفض نسخًا صالحة، وإذا خفضتها أكثر من اللازم فقد تقبل نسخة لا توفر الميزات التي تعتمد عليها.'
    },
    Y: {
      axis: 'الإصدار الفرعي',
      usage: 'مرر رقم الإصدار الفرعي الأدنى داخل نفس الإصدار الرئيسي الذي تريد التحقق منه.',
      invalid: 'إذا لم يطابق الرقم الفرعي الحد الأدنى الصحيح فقد تنجح المقارنة مع نسخة لا تملك السلوك أو الإصلاح الذي تنتظره، أو تفشل مع نسخة مناسبة.'
    },
    Z: {
      axis: 'إصدار التصحيح',
      usage: 'مرر رقم التصحيح أو الميكرو الأدنى الذي تمثل منه النسخة المقبولة داخل نفس السلسلة.',
      invalid: 'إذا كان رقم التصحيح غير صحيح فقد تبني القرار على نسخة أقدم من الإصلاح المطلوب أو تستبعد نسخة كافية بلا سبب.'
    }
  };
  const axisInfo = axisMap[name];
  if (!axisInfo) {
    return null;
  }

  return {
    type: `تعبير عددي صحيح يمثل ${axisInfo.axis}`,
    description: `${axisInfo.axis} الذي تريد أن تقارن به الماكرو عند التحقق من الحد الأدنى للإصدار.`,
    role: `يدخل هذا الرقم في المقارنة الشرطية التي يوسعها الماكرو لتقرير هل النسخة المجمَّع معها تساوي هذا الحد الأدنى أو تتجاوزه.`,
    purpose: 'لأن فحص التوافق يعتمد على فصل الإصدار إلى رئيسي وفرعي وتصحيح بدل مقارنة نصية أو رقم واحد غير معبر.',
    usage: axisInfo.usage,
    misuse: axisInfo.invalid
  };
}
window.getSdl3PackageItems = getSdl3PackageItems;
window.getSdl3PackageInfo = getSdl3PackageInfo;
window.getSdl3PackageSectionId = getSdl3PackageSectionId;
window.getSdl3PackageBranchId = getSdl3PackageBranchId;
window.getSdl3PackageSectionCompositeName = getSdl3PackageSectionCompositeName;
window.parseSdl3PackageSectionCompositeName = parseSdl3PackageSectionCompositeName;
window.rememberSdl3NavGroupState = rememberSdl3NavGroupState;
window.rememberSdl3PackageSectionStateById = rememberSdl3PackageSectionStateById;
window.hydrateExpandedSdl3NavGroups = hydrateExpandedSdl3NavGroups;
window.normalizeSdl3PropertyRemarkText = normalizeSdl3PropertyRemarkText;
window.collectSdl3PropertyNames = collectSdl3PropertyNames;
window.isSdl3PropertyMacro = isSdl3PropertyMacro;

function renderSdl3EntityLink(name, label = '', options = {}) {
  const item = findSdl3AnyItemByName(name);
  const seedItem = item || findSdl3CoreSymbolSeedByName(name);
  const text = label || name;
  const classes = options.code
    ? 'type code-token code-link entity-link-with-icon'
    : 'related-link entity-link-with-icon';

  if (!seedItem) {
    return options.code
      ? `<code dir="ltr">${escapeHtml(text)}</code>`
      : `<span class="related-link related-link-static">${escapeHtml(text)}</span>`;
  }

  const resolvedItem = seedItem;
  const tooltip = item
    ? sanitizeTooltipText(buildSdl3ReferenceTooltip(item))
    : sanitizeTooltipText(buildSdl3ShortReferenceTooltip(seedItem));
  const meta = resolvedItem.kind === 'type'
    ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(resolvedItem))
    : getSdl3KindMeta(resolvedItem.kind);
  const icon = renderEntityIcon(meta.icon, options.code ? 'ui-codicon list-icon' : 'ui-codicon list-icon', resolvedItem.name);
  const content = options.code
    ? `${icon} <code dir="ltr">${escapeHtml(text)}</code>`
    : `${icon} ${escapeHtml(text)}`;

  const eagerTooltip = item && options.eagerTooltip ? getCachedSdl3ReferenceTooltip(item) : '';
  const tooltipAttrs = item && options.eagerTooltip
    ? ` data-tooltip="${escapeAttribute(eagerTooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${eagerTooltip.replace(/\n/g, ' - ')}`)}"`
    : item
      ? buildDeferredSdl3TooltipAttrs(item, text)
      : ` data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`)}"`;

  return `<a href="#" class="${classes}"${tooltipAttrs} onclick="${buildShowSdl3Call(resolvedItem.kind, resolvedItem.name)}; return false;">${content}</a>`;
}

let sdl3RelatedRuntime = null;
function getSdl3RelatedRuntime() {
  if (sdl3RelatedRuntime) {
    return sdl3RelatedRuntime;
  }

  const creator = window.__ARABIC_VULKAN_SDL3_RELATED_RUNTIME__?.createSdl3RelatedRuntime;
  if (typeof creator !== 'function') {
    return null;
  }

  sdl3RelatedRuntime = creator({
    getSdl3PackageInfo,
    composeSemanticTooltip,
    getSdl3PackageItems: (packageKey, dataKey) => getSdl3EntityItems(dataKey).filter((item) => String(item?.packageKey || 'core') === String(packageKey || 'core')),
    getSdl3CollectionMeta: (...args) => getSdl3CollectionMeta(...args),
    buildSdl3PackageSectionReason: (...args) => buildSdl3PackageSectionReason(...args),
    escapeHtml,
    escapeAttribute,
    renderEntityIcon,
    findSdl3AnyItemByName: (...args) => findSdl3AnyItemByName(...args),
    findSdl3CoreSymbolSeedByName: (...args) => findSdl3CoreSymbolSeedByName(...args),
    getSdl3VisiblePackageKeys: (...args) => getSdl3VisiblePackageKeys(...args),
    renderRelatedReferenceLink: (...args) => renderRelatedReferenceLink(...args),
    inferSdl3PackageKeyFromSymbolName: (...args) => inferSdl3PackageKeyFromSymbolName(...args),
    getAllSdl3ReferenceItems: (...args) => getAllSdl3ReferenceItems(...args),
    getSdl3TypeSectionDataKey: (...args) => getSdl3TypeSectionDataKey(...args),
    getSdl3KindMeta: (...args) => getSdl3KindMeta(...args),
    renderSdl3EntityLink: (...args) => renderSdl3EntityLink(...args),
    buildShowSdl3PackageIndexCall: (packageKey) => `showSdl3PackageIndex('${escapeAttribute(packageKey)}')`,
    buildShowSdl3PackageSectionIndexCall: (packageKey, dataKey) => `showSdl3PackageSectionIndex('${escapeAttribute(packageKey)}', '${escapeAttribute(dataKey)}')`,
    buildShowSdl3HeaderFileCall: (normalized) => `showSdl3HeaderFile('${escapeAttribute(normalized)}')`
  });
  return sdl3RelatedRuntime;
}

const buildSdl3PackageTooltip = (...args) => getSdl3RelatedRuntime()?.buildSdl3PackageTooltip(...args) || '';
const buildSdl3PackageSectionTooltip = (...args) => getSdl3RelatedRuntime()?.buildSdl3PackageSectionTooltip(...args) || '';
const renderSdl3PackageLink = (...args) => getSdl3RelatedRuntime()?.renderSdl3PackageLink(...args) || `<span class="related-link related-link-static">${escapeHtml(String(args[1] || args[0] || ''))}</span>`;
const renderSdl3PackageSectionLink = (...args) => getSdl3RelatedRuntime()?.renderSdl3PackageSectionLink(...args) || `<span class="related-link related-link-static">${escapeHtml(String(args[2] || args[1] || ''))}</span>`;
function renderSdl3RelatedLink(...args) {
  return getSdl3RelatedRuntime()?.renderSdl3RelatedLink(...args) || '';
}
const normalizeSdl3HeaderFile = (...args) => getSdl3RelatedRuntime()?.normalizeSdl3HeaderFile(...args) || String(args[0] || '').replace(/[<>]/g, '').trim();
function formatSdl3HeaderFileDisplay(...args) {
  return getSdl3RelatedRuntime()?.formatSdl3HeaderFileDisplay(...args) || '';
}
const inferSdl3PackageKeyFromHeader = (...args) => sdl3RelatedRuntime?.inferSdl3PackageKeyFromHeader(...args) || 'core';
const buildSdl3HeaderFileTooltip = (...args) => sdl3RelatedRuntime?.buildSdl3HeaderFileTooltip(...args) || '';
function renderSdl3HeaderFileLink(...args) {
  return sdl3RelatedRuntime?.renderSdl3HeaderFileLink(...args) || '—';
}
const getSdl3HeaderFileItems = (...args) => sdl3RelatedRuntime?.getSdl3HeaderFileItems(...args) || [];
const getSdl3HeaderFileDataKey = (...args) => sdl3RelatedRuntime?.getSdl3HeaderFileDataKey(...args) || '';
const getSdl3HeaderFileSectionGroups = (...args) => sdl3RelatedRuntime?.getSdl3HeaderFileSectionGroups(...args) || [];
const renderSdl3HeaderFilesSection = (...args) => sdl3RelatedRuntime?.renderSdl3HeaderFilesSection(...args) || '';

function getSdl3ReferenceFromType(rawType) {
  const tokens = String(rawType || '').match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];
  for (const token of tokens) {
    const item = findSdl3AnyItemByName(token);
    if (item) {
      return item;
    }
  }
  return null;
}

const renderSdl3TypeReference = (...args) => sdl3EntityRenderRuntime?.renderSdl3TypeReference(...args) || '—';
const renderSdl3InlineCodeSnippet = (...args) => sdl3EntityRenderRuntime?.renderSdl3InlineCodeSnippet(...args) || '';
const renderSdl3ParameterTypeCell = (...args) => sdl3EntityRenderRuntime?.renderSdl3ParameterTypeCell(...args) || '—';
const renderSdl3ParameterTable = (...args) => sdl3EntityRenderRuntime?.renderSdl3ParameterTable(...args) || '';
const renderSdl3ParameterUsageExample = (...args) => sdl3EntityRenderRuntime?.renderSdl3ParameterUsageExample(...args) || '';
const getSdl3ConstantAnchorId = (...args) => sdl3EntityRenderRuntime?.getSdl3ConstantAnchorId(...args) || `sdl3-constant-${String(args[0] || '').replace(/[^A-Za-z0-9_:-]+/g, '-')}`;
const getSdl3EnumValueContextLabel = (...args) => sdl3EntityRenderRuntime?.getSdl3EnumValueContextLabel(...args) || `التعداد ${String(args[0] || 'الحالي')}`;
const humanizeSdl3EnumValueLabel = (...args) => sdl3EntityRenderRuntime?.humanizeSdl3EnumValueLabel(...args) || '';
const buildSdl3EnumValueDescriptionFallback = (...args) => sdl3EntityRenderRuntime?.buildSdl3EnumValueDescriptionFallback(...args) || '';
const renderSdl3EnumValues = (...args) => sdl3EntityRenderRuntime?.renderSdl3EnumValues(...args) || '';
const renderSdl3ReferenceCallout = (...args) => sdl3EntityRenderRuntime?.renderSdl3ReferenceCallout(...args) || '';
const renderSdl3Remarks = (...args) => sdl3EntityRenderRuntime?.renderSdl3Remarks(...args) || '';
const renderSdl3SeeAlso = (...args) => sdl3EntityRenderRuntime?.renderSdl3SeeAlso(...args) || '';

async function toggleSdl3PackageKindSection(packageKey, dataKey, sectionId = getSdl3PackageSectionId(packageKey, dataKey)) {
  await ensureSdl3PackageKindData(packageKey, dataKey);
  const section = document.getElementById(sectionId);
  const parentSection = section?.closest('.nav-section');
  const packageGroup = document.getElementById(getSdl3PackageBranchId(packageKey));
  const packageCluster = packageGroup?.closest('.nav-cluster');

  if (parentSection && !parentSection.classList.contains('collapsed')) {
    parentSection.classList.add('collapsed');
    rememberSdl3PackageSectionState(packageKey, dataKey, false);
    return;
  }

  if (packageCluster) {
    collapseAllSidebarClusters(packageCluster.id || '');
    packageCluster.classList.remove('collapsed');
  }

  if (packageGroup) {
    packageGroup.classList.remove('collapsed');
  }

  if (parentSection) {
    populateSdl3PackageKindNavSection(packageKey, dataKey, sectionId);
    parentSection.classList.remove('collapsed');
    rememberSdl3PackageSectionState(packageKey, dataKey, true);
    hydrateExpandedSdl3NavGroups(section);
  }
}

function renderSdl3EntityPage(item, options = {}) {
  return sdl3SectionRuntime?.renderSdl3EntityPage?.(item, options);
}

function populateSdl3PackageKindNavSection(packageKey, dataKey, sectionId = getSdl3PackageSectionId(packageKey, dataKey)) {
  return sdl3SectionRuntime?.populateSdl3PackageKindNavSection?.(packageKey, dataKey, sectionId);
}

function populateSdl3EntityNavSection(dataKey, sectionId) {
  return sdl3SectionRuntime?.populateSdl3EntityNavSection?.(dataKey, sectionId);
}

function renderSdl3ExampleSidebarGroups(packageKey = 'core') {
  return sdl3SectionRuntime?.renderSdl3ExampleSidebarGroups?.(packageKey) || '';
}

function populateSdl3PackageSidebar(packageKey) {
  return sdl3SectionRuntime?.populateSdl3PackageSidebar?.(packageKey);
}

function populateSdl3List() {
  return sdl3SectionRuntime?.populateSdl3List?.();
}

function expandAllSdl3Clusters() {
  return sdl3SectionRuntime?.expandAllSdl3Clusters?.();
}

Object.assign(window, {
  populateSdl3PackageKindNavSection,
  populateSdl3EntityNavSection,
  renderSdl3ExampleSidebarGroups,
  populateSdl3PackageSidebar,
  populateSdl3List,
  expandAllSdl3Clusters,
  ensureSdl3PackageSidebarData: (...args) => typeof ensureSdl3PackageSidebarData === 'function'
    ? ensureSdl3PackageSidebarData(...args)
    : Promise.resolve()
});

async function showSdl3SectionIndex(dataKey, options = {}) {
  return sdl3SectionRuntime?.showSdl3SectionIndex?.(dataKey, options);
}

async function showSdl3PackageIndex(packageKey, options = {}) {
  return sdl3SectionRuntime?.showSdl3PackageIndex?.(packageKey, options);
}

async function showSdl3PackageSectionIndex(packageKey, dataKey, options = {}) {
  return sdl3SectionRuntime?.showSdl3PackageSectionIndex?.(packageKey, dataKey, options);
}

async function showSdl3HeaderFile(header, options = {}) {
  return sdl3SectionRuntime?.showSdl3HeaderFile?.(header, options);
}

async function showSdl3Function(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Function?.(name, options);
}

async function showSdl3Type(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Type?.(name, options);
}

async function showSdl3Enum(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Enum?.(name, options);
}

async function showSdl3Macro(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Macro?.(name, options);
}

async function showSdl3Constant(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Constant?.(name, options);
}

async function showSdl3Reference(name, options = {}) {
  return sdl3SectionRuntime?.showSdl3Reference?.(name, options);
}

async function showSdl3Index(options = {}) {
  return sdl3SectionRuntime?.showSdl3Index?.(options);
}

async function showGlslReference(name, options = {}) {
  return glslPageRuntime?.showGlslReference?.(name, options);
}

async function showGlslIndex(options = {}) {
  return glslPageRuntime?.showGlslIndex?.(options);
}

// ==================== فهارس ====================
