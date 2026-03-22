// وحدة البحث المفصولة عن app.js مع واجهة تكامل صريحة.
(function (global) {
  const searchFilterLabels = {
    all: 'كل الأقسام',
    vulkan: 'فولكان',
    sdl3: 'SDL3',
    cmake: 'CMake',
    imgui: 'Dear ImGui',
    glsl: 'GLSL',
    tutorials: 'الدروس',
    files: 'الملفات'
  };

  let searchSubFilterConfig = {
    vulkan: {
      command: 'الدوال',
      macro: 'الماكرو',
      'constant-ref': 'الثوابت',
      structure: 'الهياكل',
      enum: 'التعدادات',
      variable: 'المتغيرات',
      example: 'الأمثلة'
    },
    imgui: {},
    cmake: {},
    glsl: {},
    sdl3: {},
    tutorials: {
      fundamentals: 'الأساسيات',
      setup: 'الإعداد',
      graphics: 'الرسم',
      compute: 'الحوسبة'
    },
    files: {}
  };

  const appApi = {
    getVulkanData: () => ({
      commands: {},
      structures: {},
      enums: {},
      constants: {},
      macros: {}
    }),
    getTutorialCatalog: () => [],
    getVulkanFileSections: () => ({}),
    getFileReferenceData: () => ({}),
    getSdl3ArabicWordMap: () => ({}),
    getSdl3SearchEntries: () => [],
    getCmakeSearchEntries: () => [],
    getSdl3SearchPreview: () => '',
    getCurrentView: () => 'home',
    setCurrentView: () => {},
    ensureUiSegment: async () => {}
  };

  let searchQuery = '';
  let activeSearchFilter = 'all';
  let activeSearchSubFilter = 'all';
  let searchDebounceTimer = null;
  let currentSearchSuggestions = [];
  let currentNoResultsSuggestions = [];
  let isSearchUiActive = false;
  let searchIndexCache = null;
  let searchIndexSectionCache = {};

  function configure(api = {}) {
    Object.assign(appApi, api);
  }

  function invalidateSearchIndex() {
    searchIndexCache = null;
    searchIndexSectionCache = {};
  }

  function getSearchIndexSectionKeys(filter = 'all') {
    if (filter && filter !== 'all') {
      return [filter];
    }

    return Object.keys(searchFilterLabels).filter((key) => key !== 'all');
  }

  function setDynamicSubfilters(nextConfig = {}) {
    searchSubFilterConfig = {
      ...searchSubFilterConfig,
      ...nextConfig
    };
  }

  function getVulkanData() {
    return appApi.getVulkanData() || {
      commands: {},
      structures: {},
      enums: {},
      constants: {},
      macros: {}
    };
  }

  function getTutorialCatalog() {
    return appApi.getTutorialCatalog() || [];
  }

  function getVulkanFileSections() {
    return appApi.getVulkanFileSections() || {};
  }

  function getFileReferenceData() {
    return appApi.getFileReferenceData() || {};
  }

  function getSdl3ArabicWordMap() {
    return appApi.getSdl3ArabicWordMap() || {};
  }

  function getSdl3SearchEntries() {
    return appApi.getSdl3SearchEntries() || [];
  }

  function getCmakeSearchEntries() {
    return appApi.getCmakeSearchEntries() || [];
  }

  function getSdl3SearchPreview(item) {
    return appApi.getSdl3SearchPreview(item) || '';
  }

  function getCurrentView() {
    return appApi.getCurrentView() || 'home';
  }

  function setCurrentView(view) {
    appApi.setCurrentView(view);
  }

  async function ensureUiSegment(segment) {
    return appApi.ensureUiSegment(segment);
  }

  function getTutorialSearchSubsection(tutorialId) {
    if (['introduction', 'overview', 'environment'].includes(tutorialId)) return 'fundamentals';
    if (['triangle', 'setup', 'instance', 'validation', 'physical_device', 'logical_device', 'swapchain'].includes(tutorialId)) return 'setup';
    if (['pipeline', 'shaders', 'vertex_input', 'descriptors', 'texture_image', 'texture_sampling', 'depth_buffering', 'model_loading', 'mipmaps', 'multisampling'].includes(tutorialId)) return 'graphics';
    if (tutorialId === 'compute') return 'compute';
    return 'fundamentals';
  }

  function normalizeSearchText(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFKC')
      .replace(/[^\p{L}\p{N}_#]+/gu, ' ')
      .trim();
  }

  function tokenizeSearchText(text) {
    return normalizeSearchText(text).split(/\s+/).filter(Boolean);
  }

  function splitIdentifierSearchTerms(text) {
    return String(text || '')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_/\\-]+/g, ' ')
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function buildSdl3SearchSynonymText(item) {
    const arabicWordMap = getSdl3ArabicWordMap();
    if (!item || !arabicWordMap || typeof arabicWordMap !== 'object') {
      return '';
    }

    const sourceTerms = [
      ...(splitIdentifierSearchTerms(item.name)),
      ...(splitIdentifierSearchTerms(item.displayName)),
      ...(splitIdentifierSearchTerms(item.packageDisplayName)),
      ...(splitIdentifierSearchTerms(item.packageName)),
      ...(splitIdentifierSearchTerms(item.packageKey)),
      ...(splitIdentifierSearchTerms(item.header)),
      ...(splitIdentifierSearchTerms(item.categoryTitle)),
      ...(splitIdentifierSearchTerms(item.groupTitle))
    ];

    const translatedTerms = [];
    const seen = new Set();

    sourceTerms.forEach((term) => {
      const mapped = arabicWordMap[term] || arabicWordMap[term.toLowerCase()] || arabicWordMap[term.toUpperCase()];
      const normalized = String(mapped || '').trim();
      if (!normalized || seen.has(normalized)) {
        return;
      }
      seen.add(normalized);
      translatedTerms.push(normalized);
    });

    return translatedTerms.join(' ');
  }

  function buildVulkanSearchIndexSection() {
    const entries = [];
    const vulkanData = getVulkanData();

    Object.entries(vulkanData.commands || {}).forEach(([key, category]) => {
      (category.items || []).forEach((item) => {
        entries.push({
          type: 'command',
          section: 'vulkan',
          subsection: 'command',
          name: item.name,
          description: getCommandSummaryText(item) || item.description || '',
          searchText: [item.name, item.description, item.summary, item.usage, key].filter(Boolean).join(' '),
          item
        });
      });
    });

    Object.values(vulkanData.structures || {}).forEach((category) => {
      (category.items || []).forEach((item) => {
        const isVariable = isVariableStructureItem(item.name);
        entries.push({
          type: isVariable ? 'variable' : 'structure',
          section: 'vulkan',
          subsection: isVariable ? 'variable' : 'structure',
          name: item.name,
          description: item.description || item.usage || '',
          searchText: [item.name, item.description, item.usage, category.title].filter(Boolean).join(' '),
          item
        });
      });
    });

    Object.values(vulkanData.enums || {}).forEach((category) => {
      (category.items || []).forEach((item) => {
        entries.push({
          type: 'enum',
          section: 'vulkan',
          subsection: 'enum',
          name: item.name,
          description: item.description || item.meaning || '',
          searchText: [item.name, item.description, item.meaning, item.usage, category.title].filter(Boolean).join(' '),
          item
        });
      });
    });

    getAllConstantReferenceEntries().forEach((entry) => {
      const description = entry.sourceType === 'enumValue'
        ? `${entry.enumItem?.name || ''} ${entry.item?.description || entry.item?.meaning || entry.item?.usage || ''}`
        : `${entry.item?.description || ''} ${Array.isArray(entry.item?.usage) ? entry.item.usage.join(' ') : (entry.item?.usage || '')}`;
      entries.push({
        type: 'constant-ref',
        section: 'vulkan',
        subsection: 'constant-ref',
        name: entry.name,
        description,
        searchText: [entry.name, description, entry.enumItem?.name, entry.sourceType].filter(Boolean).join(' '),
        item: entry
      });
    });

    Object.values(vulkanData.macros || {}).forEach((category) => {
      (category.items || []).forEach((item) => {
        entries.push({
          type: 'macro',
          section: 'vulkan',
          subsection: 'macro',
          name: item.name,
          description: item.description || item.usage || '',
          searchText: [item.name, item.description, item.usage, category.title].filter(Boolean).join(' '),
          item
        });
      });
    });

    return entries;
  }

  function buildGlslSearchIndexSection() {
    const entries = [];

    getAllGlslReferenceItems().forEach((item) => {
      entries.push({
        type: 'glsl',
        section: 'glsl',
        subsection: item.sectionKey || 'directives',
        name: item.name,
        description: item.description || '',
        searchText: [item.name, item.displayName, item.kind, item.description, item.usage, item.execution, item.effect, item.sectionTitle].filter(Boolean).join(' '),
        item
      });
    });

    return entries;
  }

  function buildImguiSearchIndexSection() {
    const entries = [];

    getAllImguiReferenceItems().forEach((item) => {
      entries.push({
        type: 'imgui',
        section: 'imgui',
        subsection: item.sectionKey || 'widgets',
        name: item.name,
        description: item.shortTooltip || item.description || '',
        searchText: [
          item.name,
          item.kind,
          item.description,
          item.officialArabicDescription,
          item.realMeaning,
          item.whenToUse,
          item.practicalBenefit,
          item.sectionTitle
        ].filter(Boolean).join(' '),
        item
      });
    });

    return entries;
  }

  function buildSdl3SearchIndexSection() {
    const entries = [];

    getSdl3SearchEntries().forEach((item) => {
      const previewText = item.description || getSdl3SearchPreview(item);
      const packageLabel = item.packageDisplayName || item.packageName || item.packageKey || '';
      entries.push({
        type: 'sdl3',
        section: 'sdl3',
        subsection: item.sectionKey || item.name,
        name: item.displayName || item.name,
        description: previewText || item.description || '',
        synonymText: item.synonymText || buildSdl3SearchSynonymText(item),
        searchText: [
          item.name,
          item.displayName || item.name,
          packageLabel,
          item.kind,
          previewText,
          item.description,
          item.usage,
          item.scope,
          item.groupTitle
        ].filter(Boolean).join(' '),
        item
      });
    });

    return entries;
  }

  function buildCmakeSearchIndexSection() {
    const entries = [];

    getCmakeSearchEntries().forEach((item) => {
      entries.push({
        type: 'cmake',
        section: 'cmake',
        subsection: item.sectionKey || item.kind || 'commands',
        name: item.displayName || item.name,
        description: item.description || item.meaning || '',
        searchText: [
          item.name,
          item.displayName || item.name,
          item.kind,
          item.kindLabelArabic,
          item.sectionTitle,
          item.titleArabic,
          item.description,
          item.meaning,
          item.purpose,
          item.whyUse,
          item.carriedValue,
          ...(item.aliases || [])
        ].filter(Boolean).join(' '),
        item
      });
    });

    return entries;
  }

  function buildTutorialSearchIndexSection() {
    const entries = [];
    const tutorialCatalog = getTutorialCatalog();

    tutorialCatalog.forEach((tutorial) => {
      entries.push({
        type: 'tutorial',
        section: 'tutorials',
        subsection: getTutorialSearchSubsection(tutorial.id),
        name: tutorial.title,
        description: tutorial.brief || '',
        searchText: [tutorial.id, tutorial.title, tutorial.brief].filter(Boolean).join(' '),
        item: tutorial
      });
    });

    entries.push({
      type: 'tutorials-index',
      section: 'tutorials',
      subsection: 'fundamentals',
      name: 'فهرس الدروس',
      description: 'الصفحة الرئيسة للمسار التعليمي في Vulkan داخل المشروع.',
      searchText: ['فهرس الدروس', 'الدروس التعليمية', 'تعلم Vulkan خطوة بخطوة'].join(' '),
      item: {id: 'tutorials', title: 'فهرس الدروس'}
    });

    return entries;
  }

  function buildVulkanExampleSearchEntries() {
    const entries = [];

    entries.push({
      type: 'vulkan-examples-index',
      section: 'vulkan',
      subsection: 'example',
      name: 'أمثلة فولكان',
      description: 'فهرس الأمثلة العملية المستقل داخل قسم فولكان في المشروع.',
      searchText: [
        'أمثلة فولكان',
        'فهرس أمثلة فولكان',
        'أمثلة Vulkan',
        'أمثلة تعليمية',
        ...getOrderedVulkanReadyExamples().map((example) => getVulkanExampleDisplayTitle(example))
      ].filter(Boolean).join(' '),
      item: {id: 'vulkan-examples', title: 'أمثلة فولكان'}
    });

    getOrderedVulkanReadyExamples().forEach((example) => {
      entries.push({
        type: 'vulkan-example',
        section: 'vulkan',
        subsection: 'example',
        name: getVulkanExampleDisplayTitle(example),
        description: example.goal || example.expectedResult || '',
        searchText: [
          example.id,
          ...(example.aliases || []),
          getVulkanExampleDisplayTitle(example),
          example.goal,
          example.expectedResult,
          ...(example.requirements || []),
          ...(example.highlights || []),
          ...(example.related || [])
        ].filter(Boolean).join(' '),
        item: example
      });
    });

    return entries;
  }

  function buildFileSearchIndexSection() {
    const entries = [];
    const vulkanFileSections = getVulkanFileSections();
    const fileReferenceData = getFileReferenceData();

    Object.entries(vulkanFileSections || {}).forEach(([sectionKey, section]) => {
      (section.files || []).forEach((fileName) => {
        const file = fileReferenceData[fileName] || {};
        entries.push({
          type: 'file',
          section: 'files',
          subsection: sectionKey,
          name: fileName,
          description: file.category || section.title || '',
          searchText: [fileName, file.category, section.title, sectionKey].filter(Boolean).join(' '),
          item: {name: fileName, sectionTitle: section.title}
        });
      });
    });

    return entries;
  }

  function buildSearchIndexSection(sectionKey = 'all') {
    switch (sectionKey) {
      case 'vulkan':
        return [
          ...buildVulkanSearchIndexSection(),
          ...buildVulkanExampleSearchEntries()
        ];
      case 'glsl':
        return buildGlslSearchIndexSection();
      case 'imgui':
        return buildImguiSearchIndexSection();
      case 'sdl3':
        return buildSdl3SearchIndexSection();
      case 'cmake':
        return buildCmakeSearchIndexSection();
      case 'tutorials':
        return buildTutorialSearchIndexSection();
      case 'files':
        return buildFileSearchIndexSection();
      default:
        return [];
    }
  }

  function ensureSearchIndexSection(sectionKey = 'all') {
    if (!searchIndexSectionCache[sectionKey]) {
      searchIndexSectionCache[sectionKey] = buildSearchIndexSection(sectionKey);
    }

    return searchIndexSectionCache[sectionKey];
  }

  function ensureSearchIndex(filter = 'all') {
    if (filter === 'all' && searchIndexCache) {
      return searchIndexCache;
    }

    const sectionKeys = getSearchIndexSectionKeys(filter);
    const entries = sectionKeys.flatMap((sectionKey) => ensureSearchIndexSection(sectionKey));

    if (filter === 'all') {
      searchIndexCache = entries;
    }

    return entries;
  }

  function getSearchSectionLabel(section) {
    return searchFilterLabels[section] || section;
  }

  function getSearchSubFilterLabel(section, subFilter) {
    if (!subFilter || subFilter === 'all') {
      return 'الكل';
    }
    return searchSubFilterConfig[section]?.[subFilter] || subFilter;
  }

  function getSearchScopeLabel(result) {
    if (!result) {
      return '';
    }

    if (result.type === 'sdl3') {
      return result.item?.packageDisplayName || result.item?.packageName || getSearchSectionLabel(result.section);
    }

    return getSearchSectionLabel(result.section);
  }

  function getSearchUiElements() {
    return {
      container: document.querySelector('.search-container'),
      input: document.getElementById('search-input'),
      clearButton: document.getElementById('search-clear-btn')
    };
  }

  function updateSearchClearButtonVisibility() {
    const {container, input, clearButton} = getSearchUiElements();
    if (!container || !input || !clearButton) {
      return;
    }

    const hasValue = Boolean(String(input.value || '').trim());
    clearButton.hidden = !hasValue;
    container.classList.toggle('has-value', hasValue);
  }

  function setSearchUiActive(active) {
    const {container} = getSearchUiElements();
    if (!container) {
      return;
    }

    isSearchUiActive = Boolean(active);
    container.classList.toggle('is-active', isSearchUiActive);
  }

  function clearSearchInput(options = {}) {
    const {input} = getSearchUiElements();
    if (!input) {
      return;
    }

    clearTimeout(searchDebounceTimer);
    input.value = '';
    searchQuery = '';
    hideSearchSuggestions();
    updateSearchClearButtonVisibility();

    if (getCurrentView() === 'search') {
      showHomePage();
    }

    if (options.keepFocus !== false) {
      input.focus();
    }
  }

  function getRankedSearchResults(query, options = {}) {
    const {
      limit = null,
      filter = activeSearchFilter,
      subFilter = activeSearchSubFilter
    } = options;

    const results = ensureSearchIndex(filter)
      .filter((entry) => filter === 'all' || entry.section === filter)
      .filter((entry) => subFilter === 'all' || entry.subsection === subFilter)
      .map((entry) => ({
        ...entry,
        score: computeSearchScore(entry, query)
      }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const aName = normalizeSearchText(a.name);
        const bName = normalizeSearchText(b.name);
        const normalizedQuery = normalizeSearchText(query);
        if (aName === normalizedQuery && bName !== normalizedQuery) return -1;
        if (bName === normalizedQuery && aName !== normalizedQuery) return 1;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ar');
      });

    return typeof limit === 'number' ? results.slice(0, limit) : results;
  }

  function computeSearchScore(entry, query) {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return -1;
    }

    const tokens = tokenizeSearchText(normalizedQuery);
    const name = normalizeSearchText(entry.name);
    const description = normalizeSearchText(entry.description);
    const searchText = normalizeSearchText(entry.searchText);
    const synonymText = normalizeSearchText(entry.synonymText);

    let score = -1;

    if (name === normalizedQuery) {
      score = Math.max(score, 10000);
    }

    if (name.startsWith(normalizedQuery)) {
      score = Math.max(score, 9200 - Math.min(name.length - normalizedQuery.length, 120));
    }

    const nameIndex = name.indexOf(normalizedQuery);
    if (nameIndex !== -1) {
      score = Math.max(score, 8400 - (nameIndex * 20));
      if (nameIndex === 0 || name[nameIndex - 1] === ' ') {
        score += 220;
      }
    }

    const descriptionIndex = description.indexOf(normalizedQuery);
    if (descriptionIndex !== -1) {
      score = Math.max(score, 4200 - (descriptionIndex * 6));
    }

    const searchIndex = searchText.indexOf(normalizedQuery);
    if (searchIndex !== -1) {
      score = Math.max(score, 2400 - searchIndex);
    }

    const synonymIndex = synonymText.indexOf(normalizedQuery);
    if (synonymIndex !== -1) {
      score = Math.max(score, 1500 - synonymIndex);
    }

    if (tokens.length) {
      const allTokensMatch = tokens.every((token) => searchText.includes(token));
      if (allTokensMatch) {
        score = Math.max(score, 2600 + (tokens.length * 40));
      }

      const allSynonymTokensMatch = synonymText && tokens.every((token) => synonymText.includes(token));
      if (allSynonymTokensMatch) {
        score = Math.max(score, 1450 + (tokens.length * 20));
      }

      tokens.forEach((token) => {
        if (name === token) {
          score = Math.max(score, 9800);
        } else if (name.startsWith(token)) {
          score = Math.max(score, 7000 - Math.min(name.length - token.length, 90));
        } else if (name.includes(token)) {
          score = Math.max(score, 6200 - (name.indexOf(token) * 14));
        } else if (description.includes(token)) {
          score = Math.max(score, 3400 - (description.indexOf(token) * 5));
        } else if (synonymText.includes(token)) {
          score = Math.max(score, 1320 - (synonymText.indexOf(token) * 3));
        }
      });
    }

    if (score >= 0) {
      score -= Math.min(name.length, 140) * 0.2;
    }

    return score;
  }

  function updateSearchFilterButtons() {
    document.querySelectorAll('.filter-btn[data-filter]').forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-filter') === activeSearchFilter);
    });
  }

  function renderSearchSubFilters() {
    const container = document.getElementById('search-subfilters');
    if (!container) return;

    const subFilters = searchSubFilterConfig[activeSearchFilter];
    if (!subFilters) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <button type="button" class="filter-btn ${activeSearchSubFilter === 'all' ? 'active' : ''}" data-subfilter="all" onclick="setSearchSubFilter('all')">الكل</button>
      ${Object.entries(subFilters).map(([key, label]) => `
        <button type="button" class="filter-btn ${activeSearchSubFilter === key ? 'active' : ''}" data-subfilter="${escapeAttribute(key)}" onclick="setSearchSubFilter('${escapeAttribute(key)}')">${escapeHtml(label)}</button>
      `).join('')}
    `;
    container.style.display = 'flex';
  }

  async function ensureSegmentsForActiveFilter() {
    if (activeSearchFilter === 'all') {
      await Promise.all([
        ensureUiSegment('glsl'),
        ensureUiSegment('imgui'),
        ensureUiSegment('cmakeSearch'),
        ensureUiSegment('sdl3Search'),
        ensureUiSegment('tutorials'),
        ensureUiSegment('files')
      ]);
      return;
    }

    if (activeSearchFilter === 'sdl3') {
      await ensureUiSegment('sdl3Search');
      return;
    }

    if (activeSearchFilter === 'cmake') {
      await ensureUiSegment('cmakeSearch');
      return;
    }

    if (['glsl', 'imgui', 'tutorials', 'files'].includes(activeSearchFilter)) {
      await ensureUiSegment(activeSearchFilter);
    }
  }

  async function setSearchFilter(filterKey) {
    activeSearchFilter = searchFilterLabels[filterKey] ? filterKey : 'all';
    activeSearchSubFilter = 'all';
    await ensureSegmentsForActiveFilter();
    updateSearchFilterButtons();
    renderSearchSubFilters();

    const searchInput = document.getElementById('search-input');
    const query = searchInput?.value || '';
    if (query.trim().length >= 2) {
      await updateSearchSuggestions(query);
      if (getCurrentView() === 'search') {
        await handleSearch(query);
      }
    }
  }

  async function setSearchSubFilter(subFilterKey) {
    activeSearchSubFilter = subFilterKey || 'all';
    renderSearchSubFilters();

    const searchInput = document.getElementById('search-input');
    const query = searchInput?.value || '';
    if (query.trim().length >= 2) {
      await updateSearchSuggestions(query);
      if (getCurrentView() === 'search') {
        await handleSearch(query);
      }
    }
  }

  function hideSearchSuggestions() {
    currentSearchSuggestions = [];
    const container = document.getElementById('search-autocomplete');
    if (!container) return;
    container.innerHTML = '';
    container.style.display = 'none';
  }

  function getSearchResultIconType(result) {
    if (!result) {
      return 'file';
    }

    switch (result.type) {
      case 'constant-ref':
        return 'constant';
      case 'tutorials-index':
        return 'tutorial';
      case 'vulkan-examples-index':
      case 'vulkan-example':
        return 'command';
      case 'imgui':
        return getImguiKindMeta(result.item?.kind || 'type').icon;
      case 'cmake':
        return getCmakeKindMeta(result.item?.kind || 'commands').icon;
      case 'sdl3':
        return getSdl3KindMeta(result.item?.kind || 'type').icon;
      default:
        return result.type;
    }
  }

  function displaySearchSuggestions(results, query) {
    const container = document.getElementById('search-autocomplete');
    if (!container) {
      return;
    }

    if (!results.length || query.trim().length < 2) {
      hideSearchSuggestions();
      return;
    }

    currentSearchSuggestions = results;
    container.innerHTML = `
      <div class="search-autocomplete-header">اقتراحات سريعة لـ "${escapeHtml(query)}"</div>
      ${results.map((result, index) => `
        <button type="button" class="search-autocomplete-item" onclick="openSearchSuggestion(${index})">
          <span class="result-icon">${renderEntityIcon(getSearchResultIconType(result), 'ui-codicon result-icon', result.type)}</span>
          <span class="search-autocomplete-meta">
            <span class="search-autocomplete-name">${escapeHtml(result.name || result.item?.name || result.item?.title || '')}</span>
            <span class="search-autocomplete-desc">${escapeHtml(result.description || result.item?.brief || result.item?.description || '')}</span>
          </span>
          <span class="search-autocomplete-section">${escapeHtml(getSearchScopeLabel(result))}</span>
        </button>
      `).join('')}
    `;
    container.style.display = 'block';
  }

  function openSearchEntry(result) {
    if (!result) {
      return;
    }

    hideSearchSuggestions();

    switch (result.type) {
      case 'command':
        showCommand(result.item.name, getCommandCategoryKey(result.item.name));
        break;
      case 'structure':
      case 'variable':
        showStructure(result.item.name);
        break;
      case 'enum':
        showEnum(result.item.name, {detailBucket: result.item?.detailBucket || ''});
        break;
      case 'constant':
        showConstant(result.item.name);
        break;
      case 'constant-ref':
        openConstantReference(null, result.item.name);
        break;
      case 'macro':
        showMacro(result.item.name);
        break;
      case 'glsl':
        showGlslReference(result.item.name);
        break;
      case 'imgui':
        showImguiReference(result.item.name);
        break;
      case 'sdl3':
        showSdl3Reference(result.item.name);
        break;
      case 'cmake':
        showCmakeEntity(result.item.kind, result.item.slug);
        break;
      case 'tutorial':
        showTutorial(result.item.id);
        break;
      case 'tutorials-index':
        showTutorialsIndex();
        break;
      case 'vulkan-examples-index':
        showVulkanExamplesIndex();
        break;
      case 'vulkan-example':
        showVulkanExample(result.item.id);
        break;
      case 'file':
        showFile(result.item.name);
        break;
      default:
        break;
    }
  }

  function openSearchSuggestion(index) {
    openSearchEntry(currentSearchSuggestions[index]);
  }

  function getNoResultsRecoveryActions() {
    const actions = [];

    if (activeSearchSubFilter !== 'all') {
      actions.push({
        label: `وسّع داخل ${getSearchSectionLabel(activeSearchFilter)}`,
        meta: `إلغاء المجال الفرعي: ${getSearchSubFilterLabel(activeSearchFilter, activeSearchSubFilter)}`,
        filter: activeSearchFilter,
        subFilter: 'all'
      });
    }

    if (activeSearchFilter !== 'all') {
      actions.push({
        label: 'ابحث في كل الأقسام',
        meta: 'أزل تقييد القسم الحالي واعرض أقرب النتائج من كامل الموقع',
        filter: 'all',
        subFilter: 'all'
      });
    }

    return actions;
  }

  function getNoResultsGuidance() {
    if (activeSearchFilter !== 'all' && activeSearchSubFilter !== 'all') {
      return `قد تكون النتيجة موجودة داخل ${getSearchSectionLabel(activeSearchFilter)} ولكن خارج المجال الفرعي الحالي، أو في قسم آخر من الموقع.`;
    }

    if (activeSearchFilter !== 'all') {
      return `قد تكون النتيجة موجودة في قسم آخر، لذلك يفيد توسيع البحث إلى كل الأقسام قبل تغيير صياغة الاستعلام.`;
    }

    return 'إذا لم تعرف الاسم الدقيق بعد، جرّب اسم الدالة أو النوع بالإنجليزية، أو افتح أحد الاقتراحات القريبة ثم انتقل منه داخليًا.';
  }

  function getNoResultsSuggestions(query) {
    const attempts = [];

    if (activeSearchSubFilter !== 'all') {
      attempts.push({filter: activeSearchFilter, subFilter: 'all'});
    }

    if (activeSearchFilter !== 'all') {
      attempts.push({filter: 'all', subFilter: 'all'});
    }

    attempts.push({filter: activeSearchFilter, subFilter: activeSearchSubFilter});

    const seen = new Set();
    const suggestions = [];

    attempts.forEach((options) => {
      getRankedSearchResults(query, {...options, limit: 6}).forEach((entry) => {
        const key = `${entry.type}:${entry.name}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        suggestions.push(entry);
      });
    });

    return suggestions.slice(0, 3);
  }

  function openNoResultsSuggestion(index) {
    openSearchEntry(currentNoResultsSuggestions[index]);
  }

  async function retrySearchWithFilters(filterKey = 'all', subFilterKey = 'all') {
    const nextFilter = searchFilterLabels[filterKey] ? filterKey : 'all';
    const nextSubFilter = subFilterKey || 'all';
    const query = (document.getElementById('search-input')?.value || searchQuery || '').trim();

    if (nextFilter !== activeSearchFilter) {
      await setSearchFilter(nextFilter);
    } else if (nextSubFilter !== activeSearchSubFilter) {
      await setSearchSubFilter(nextSubFilter);
    }

    if (query.length >= 2 && getCurrentView() !== 'search') {
      await handleSearch(query);
    }
  }

  async function updateSearchSuggestions(query) {
    searchQuery = query.trim();
    if (searchQuery.length < 2) {
      hideSearchSuggestions();
      return;
    }

    await ensureSegmentsForActiveFilter();
    const suggestions = getRankedSearchResults(searchQuery, {limit: 8});
    displaySearchSuggestions(suggestions, searchQuery);
  }

  async function handleSearch(query) {
    searchQuery = query.trim();

    if (searchQuery.length < 2) {
      hideSearchSuggestions();
      if (getCurrentView() === 'search') {
        showHomePage();
      }
      return;
    }

    hideSearchSuggestions();
    await ensureSegmentsForActiveFilter();

    const results = getRankedSearchResults(searchQuery);
    displaySearchResults(results);
    setCurrentView('search');
  }

  function matchesSearch(text) {
    return text && normalizeSearchText(text).includes(normalizeSearchText(searchQuery));
  }

  function displaySearchResults(results) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    if (results.length === 0) {
      currentNoResultsSuggestions = getNoResultsSuggestions(searchQuery);
      const recoveryActions = getNoResultsRecoveryActions();
      const guidance = getNoResultsGuidance();
      content.innerHTML = `
        <div class="no-results">
          <h2>🔍 لا توجد نتائج</h2>
          <p>لم يتم العثور على نتائج لـ "${searchQuery}" ضمن ${getSearchSectionLabel(activeSearchFilter)}</p>
          <p class="no-results-guidance">${escapeHtml(guidance)}</p>
          ${recoveryActions.length ? `
            <div class="search-recovery-actions">
              ${recoveryActions.map((action) => `
                <button
                  type="button"
                  class="search-recovery-action"
                  onclick="retrySearchWithFilters('${escapeAttribute(action.filter)}', '${escapeAttribute(action.subFilter)}')">
                  <span class="search-recovery-action-label">${escapeHtml(action.label)}</span>
                  <span class="search-recovery-meta">${escapeHtml(action.meta)}</span>
                </button>
              `).join('')}
            </div>
          ` : ''}
          ${currentNoResultsSuggestions.length ? `
            <div class="search-recovery">
              <p>أقرب اقتراحات يمكن تجربتها الآن:</p>
              <div class="search-recovery-links">
                ${currentNoResultsSuggestions.map((result, index) => `
                  <button type="button" class="search-recovery-link" onclick="openNoResultsSuggestion(${index})">
                    <span>${renderEntityIcon(getSearchResultIconType(result), 'ui-codicon list-icon', result.type)}</span>
                    <span>${escapeHtml(result.name || result.item?.name || result.item?.title || '')}</span>
                    <span class="search-recovery-meta">${escapeHtml(getSearchScopeLabel(result))}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      return;
    }

    currentNoResultsSuggestions = [];
    let html = `
      <div class="search-results-header">
        <h2>🔍 نتائج البحث (${results.length})</h2>
        <p>البحث عن: "${searchQuery}"</p>
        <div class="search-results-filter">القسم النشط: ${getSearchSectionLabel(activeSearchFilter)}${activeSearchSubFilter !== 'all' ? ` / ${getSearchSubFilterLabel(activeSearchFilter, activeSearchSubFilter)}` : ''}</div>
      </div>
      <div class="search-results">
    `;

    const labels = {
      command: 'دالة',
      structure: 'هيكل/نوع',
      enum: 'تعداد',
      constant: 'ثابت',
      'constant-ref': 'ثابت',
      macro: 'ماكرو',
      imgui: 'مرجع Dear ImGui',
      glsl: 'GLSLang',
      sdl3: 'مرجع SDL3',
      cmake: 'مرجع CMake',
      tutorial: 'درس',
      'tutorials-index': 'فهرس',
      'vulkan-examples-index': 'قسم أمثلة',
      'vulkan-example': 'مثال فولكان',
      file: 'ملف',
      variable: 'متغير/نوع'
    };

    results.forEach((result) => {
      const icons = {
        command: renderEntityIcon('command', 'ui-codicon result-icon', 'دالة'),
        structure: renderEntityIcon('structure', 'ui-codicon result-icon', 'هيكل'),
        enum: renderEntityIcon('enum', 'ui-codicon result-icon', 'تعداد'),
        constant: renderEntityIcon('constant', 'ui-codicon result-icon', 'ثابت'),
        'constant-ref': renderEntityIcon('constant', 'ui-codicon result-icon', 'ثابت'),
        macro: renderEntityIcon('macro', 'ui-codicon result-icon', 'ماكرو'),
        imgui: renderEntityIcon(getImguiKindMeta(result.item?.kind || 'type').icon, 'ui-codicon result-icon', 'Dear ImGui'),
        cmake: renderEntityIcon(getCmakeKindMeta(result.item?.kind || 'commands').icon, 'ui-codicon result-icon', 'CMake'),
        glsl: renderEntityIcon('glsl', 'ui-codicon result-icon', 'GLSLang'),
        sdl3: renderEntityIcon(getSdl3KindMeta(result.item?.kind || 'type').icon, 'ui-codicon result-icon', 'SDL3'),
        tutorial: renderEntityIcon('tutorial', 'ui-codicon result-icon', 'درس'),
        'tutorials-index': renderEntityIcon('tutorial', 'ui-codicon result-icon', 'فهرس الدروس'),
        'vulkan-examples-index': renderEntityIcon('command', 'ui-codicon result-icon', 'أمثلة فولكان'),
        'vulkan-example': renderEntityIcon('command', 'ui-codicon result-icon', 'مثال فولكان'),
        file: renderEntityIcon('file', 'ui-codicon result-icon', 'ملف'),
        variable: renderEntityIcon('variable', 'ui-codicon result-icon', 'متغير')
      };
      const onclick = {
        command: buildShowCommandCall(result.item.name),
        structure: `showStructure('${result.item.name}')`,
        variable: `showStructure('${result.item.name}')`,
        enum: `showEnum('${result.item.name}', {detailBucket: '${escapeAttribute(result.item?.detailBucket || '')}'})`,
        constant: `showConstant('${result.item.name}')`,
        'constant-ref': `openConstantReference(event, '${result.item.name}')`,
        macro: `showMacro('${result.item.name}')`,
        imgui: `showImguiReference('${escapeAttribute(result.item.name)}')`,
        cmake: `showCmakeEntity('${escapeAttribute(result.item.kind)}', '${escapeAttribute(result.item.slug)}')`,
        glsl: `showGlslReference('${result.item.name}')`,
        sdl3: `showSdl3Reference('${result.item.name}')`,
        tutorial: `showTutorial('${result.item.id}')`,
        'tutorials-index': 'showTutorialsIndex()',
        'vulkan-examples-index': 'showVulkanExamplesIndex()',
        'vulkan-example': `showVulkanExample('${escapeAttribute(result.item.id)}')`,
        file: `showFile('${result.item.name}')`
      };

      html += `
        <div class="search-result-item" onclick="${onclick[result.type]}">
          <span class="result-icon">${icons[result.type]}</span>
          <span class="result-type">${result.type === 'sdl3'
            ? escapeHtml(getSdl3KindMeta(result.item?.kind || 'type').singular)
            : result.type === 'imgui'
              ? escapeHtml(getImguiKindMeta(result.item?.kind || 'type').label)
              : result.type === 'cmake'
                ? escapeHtml(getCmakeKindMeta(result.item?.kind || 'commands').label)
              : (labels[result.type] || result.type)}</span>
          <span class="result-section">${escapeHtml(getSearchScopeLabel(result))}</span>
          <span class="result-name">${escapeHtml(result.name || result.item.name || result.item.title || '')}</span>
          <span class="result-desc">${result.type === 'command'
            ? getCommandSummaryText(result.item)
            : result.type === 'constant-ref'
              ? escapeHtml(result.item.sourceType === 'enumValue'
                ? `${result.item.enumItem?.name || ''}: ${result.item.item?.meaning || result.item.item?.description || ''}`
                : (result.item.item?.description || ''))
              : result.type === 'tutorial'
                ? escapeHtml(result.item.brief || '')
              : result.type === 'tutorials-index'
                ? escapeHtml(result.description || '')
              : result.type === 'vulkan-examples-index'
                ? escapeHtml(result.description || '')
              : result.type === 'vulkan-example'
                ? escapeHtml(result.item.goal || result.item.expectedResult || '')
              : result.type === 'file'
                ? escapeHtml(result.description || '')
              : result.type === 'imgui'
                ? escapeHtml(result.item.shortTooltip || result.item.description || '')
              : result.type === 'glsl'
                ? escapeHtml(result.item.description || '')
              : result.type === 'sdl3'
                ? escapeHtml(result.item.description || '')
              : escapeHtml(result.description || result.item.description || '')}</span>
        </div>
      `;
    });

    html += '</div>';
    content.innerHTML = html;
  }

  function initializeSearchUi() {
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');

    if (searchContainer?.dataset.searchBound === 'true') {
      updateSearchClearButtonVisibility();
      updateSearchFilterButtons();
      renderSearchSubFilters();
      return;
    }

    if (searchContainer) {
      searchContainer.dataset.searchBound = 'true';
    }

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        updateSearchClearButtonVisibility();
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          void updateSearchSuggestions(event.target.value);
        }, 90);
      });

      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          void handleSearch(searchInput.value);
        } else if (event.key === 'Escape') {
          hideSearchSuggestions();
          if (!searchInput.value.trim()) {
            setSearchUiActive(false);
          }
        }
      });

      searchInput.addEventListener('focus', () => {
        setSearchUiActive(true);
      });
    }

    if (searchContainer) {
      searchContainer.addEventListener('focusin', () => {
        setSearchUiActive(true);
      });

      searchContainer.addEventListener('focusout', () => {
        setTimeout(() => {
          if (!searchContainer.contains(document.activeElement)) {
            setSearchUiActive(false);
            hideSearchSuggestions();
          }
        }, 0);
      });
    }

    updateSearchClearButtonVisibility();
    updateSearchFilterButtons();
    renderSearchSubFilters();
  }

  global.__ARABIC_VULKAN_SEARCH__ = {
    configure,
    invalidateSearchIndex,
    setDynamicSubfilters,
    initializeSearchUi,
    ensureSearchIndex,
    getRankedSearchResults,
    updateSearchSuggestions,
    handleSearch,
    hideSearchSuggestions,
    setSearchUiActive,
    matchesSearch
  };

  global.setSearchFilter = setSearchFilter;
  global.setSearchSubFilter = setSearchSubFilter;
  global.clearSearchInput = clearSearchInput;
  global.openSearchSuggestion = openSearchSuggestion;
  global.openNoResultsSuggestion = openNoResultsSuggestion;
  global.retrySearchWithFilters = retrySearchWithFilters;
  global.hideSearchSuggestions = hideSearchSuggestions;
  global.setSearchUiActive = setSearchUiActive;
})(window);
