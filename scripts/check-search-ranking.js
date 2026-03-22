const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const searchEnginePath = path.join(projectRoot, 'js', 'modules', 'search-engine.js');
const searchEngineCode = fs.readFileSync(searchEnginePath, 'utf8');

function createSearchSandbox() {
  const elementsById = {};
  const searchContainer = {
    dataset: {},
    classList: {toggle: () => {}},
    addEventListener: () => {},
    contains: () => false
  };

  function createElement(initial = {}) {
    return {
      innerHTML: '',
      style: {},
      dataset: {},
      value: '',
      hidden: false,
      classList: {
        toggle: () => {}
      },
      addEventListener: () => {},
      focus: () => {},
      contains: () => false,
      querySelector: () => null,
      querySelectorAll: () => [],
      ...initial
    };
  }

  elementsById.mainContent = createElement();
  elementsById['search-autocomplete'] = createElement();
  elementsById['search-input'] = createElement();
  elementsById['search-subfilters'] = createElement({style: {display: 'none'}});
  elementsById['search-clear-btn'] = createElement();

  const sandbox = {
    window: {},
    document: {
      activeElement: null,
      querySelector: (selector) => {
        if (selector === '.search-container') {
          return searchContainer;
        }
        return null;
      },
      getElementById: (id) => elementsById[id] || null,
      querySelectorAll: () => []
    },
    console,
    setTimeout,
    clearTimeout,
    escapeHtml: (value) => String(value ?? ''),
    escapeAttribute: (value) => String(value ?? ''),
    renderEntityIcon: () => '',
    getImguiKindMeta: () => ({icon: 'type', label: 'type'}),
    getSdl3KindMeta: () => ({icon: 'command', singular: 'دالة SDL3'}),
    getAllConstantReferenceEntries: () => [],
    getAllGlslReferenceItems: () => [],
    getAllImguiReferenceItems: () => [],
    getOrderedVulkanReadyExamples: () => [],
    getVulkanExampleDisplayTitle: (example) => example?.title || example?.id || '',
    getCommandSummaryText: () => '',
    isVariableStructureItem: () => false,
    showHomePage: () => {},
    showCommand: () => {},
    getCommandCategoryKey: () => '',
    showStructure: () => {},
    showEnum: () => {},
    showConstant: () => {},
    openConstantReference: () => {},
    showMacro: () => {},
    showGlslReference: () => {},
    showImguiReference: () => {},
    showSdl3Reference: () => {},
    showTutorial: () => {},
    showTutorialsIndex: () => {},
    showVulkanExamplesIndex: () => {},
    showVulkanExample: () => {},
    showFile: () => {},
    buildShowCommandCall: () => '',
    globalThis: null
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(searchEngineCode, sandbox);
  sandbox.__elementsById = elementsById;
  return sandbox;
}

function configureSearch(sandbox) {
  const api = sandbox.window.__ARABIC_VULKAN_SEARCH__;
  let currentView = 'home';
  api.configure({
    getSdl3ArabicWordMap: () => ({
      Load: 'تحميل',
      Texture: 'خامة',
      Window: 'نافذة',
      Create: 'إنشاء',
      Renderer: 'مصير'
    }),
    getSdl3SearchEntries: () => sandbox.__sdl3SearchEntries || [],
    getSdl3SearchPreview: (item) => item.preview || '',
    getFileReferenceData: () => ({}),
    getVulkanFileSections: () => ({}),
    getTutorialCatalog: () => [],
    getVulkanData: () => ({
      commands: {},
      structures: {},
      enums: {},
      constants: {},
      macros: {}
    }),
    getCurrentView: () => currentView,
    setCurrentView: (view) => {
      currentView = view;
    }
  });
  return api;
}

function installStubEntries(sandbox, entries) {
  sandbox.__sdl3SearchEntries = entries.map((entry) => ({
    packageName: 'SDL3',
    packageDisplayName: 'SDL3',
    kind: 'function',
    usage: '',
    scope: 'SDL3 API',
    groupTitle: 'SDL3',
    sectionKey: 'functions',
    searchText: [entry.name, entry.description, entry.preview].filter(Boolean).join(' '),
    synonymText: '',
    ...entry
  }));
}

function assertTopResult(results, expectedName, label) {
  const actual = results[0]?.name || '';
  if (actual !== expectedName) {
    throw new Error(`${label}: expected "${expectedName}" first but got "${actual}"`);
  }
}

const sandbox = createSearchSandbox();
installStubEntries(sandbox, [
  {
    name: 'SDL_CreateWindow',
    displayName: 'SDL_CreateWindow',
    description: 'Create a window.',
    preview: 'دالة | SDL3 | تنشئ نافذة تطبيق فعلية على النظام.'
  },
  {
    name: 'SDL_CreateWindowAndRenderer',
    displayName: 'SDL_CreateWindowAndRenderer',
    description: 'Create a window and renderer.',
    preview: 'دالة | SDL3 | تنشئ نافذة ومعها مصير جاهز.'
  },
  {
    name: 'SDL_GetWindowID',
    displayName: 'SDL_GetWindowID',
    description: 'Get the ID of a window.',
    preview: 'دالة | SDL3 | تقرأ معرف النافذة الحالية.'
  },
  {
    name: 'IMG_LoadTexture',
    displayName: 'IMG_LoadTexture',
    packageName: 'SDL3_image',
    packageDisplayName: 'SDL3_image',
    description: 'Load an image as a texture.',
    preview: 'دالة | SDL3_image | تحمل الصورة وتجهزها كخامة قابلة للاستخدام.'
  }
]);

const searchApi = configureSearch(sandbox);

const exactResults = searchApi.getRankedSearchResults('SDL_CreateWindow', {filter: 'sdl3'});
assertTopResult(exactResults, 'SDL_CreateWindow', 'exact match');

const prefixResults = searchApi.getRankedSearchResults('SDL_Create', {filter: 'sdl3'});
assertTopResult(prefixResults, 'SDL_CreateWindow', 'prefix match');

const partialResults = searchApi.getRankedSearchResults('WindowID', {filter: 'sdl3'});
assertTopResult(partialResults, 'SDL_GetWindowID', 'partial match');

const synonymResults = searchApi.getRankedSearchResults('تحميل خامة', {filter: 'sdl3'});
assertTopResult(synonymResults, 'IMG_LoadTexture', 'synonym match');

searchApi.setDynamicSubfilters({
  sdl3: {
    functions: 'الدوال',
    examples: 'الأمثلة'
  }
});

(async () => {
  const elements = sandbox.__elementsById;
  elements['search-input'].value = 'تحميل خامة';
  await sandbox.window.setSearchFilter('sdl3');
  await searchApi.updateSearchSuggestions('تحميل خامة');
  if (!elements['search-autocomplete'].innerHTML.includes('SDL3_image')) {
    throw new Error('autocomplete scope label should surface package identity');
  }

  elements['search-input'].value = 'تحميل خامة';
  await sandbox.window.setSearchFilter('files');
  await searchApi.handleSearch('تحميل خامة');

  if (!elements.mainContent.innerHTML.includes('search-recovery-link')) {
    throw new Error('no-results state should include recovery suggestions');
  }
  if (!elements.mainContent.innerHTML.includes('search-recovery-action')) {
    throw new Error('no-results state should include direct recovery actions');
  }
  if (!elements.mainContent.innerHTML.includes('ابحث في كل الأقسام')) {
    throw new Error('global recovery action label should be rendered');
  }
  if (!elements.mainContent.innerHTML.includes('قد تكون النتيجة موجودة في قسم آخر')) {
    throw new Error('filter-specific guidance should be rendered for no-results state');
  }
  if (!elements.mainContent.innerHTML.includes('IMG_LoadTexture')) {
    throw new Error('no-results recovery should include closest SDL3 result');
  }

  elements['search-input'].value = 'تحميل خامة';
  await sandbox.window.setSearchFilter('sdl3');
  await sandbox.window.setSearchSubFilter('examples');
  await searchApi.handleSearch('تحميل خامة');
  if (!elements.mainContent.innerHTML.includes('وسّع داخل SDL3')) {
    throw new Error('subfilter recovery action should be rendered when a narrow subfilter is active');
  }
  if (!elements.mainContent.innerHTML.includes('خارج المجال الفرعي الحالي')) {
    throw new Error('subfilter-specific guidance should be rendered when a narrow subfilter is active');
  }

  await sandbox.window.retrySearchWithFilters('sdl3', 'all');
  if (!elements.mainContent.innerHTML.includes('search-result-item')) {
    throw new Error('retry action should re-run the search with broader filters');
  }

  console.log('search ranking and ui checks passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
