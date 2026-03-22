(function initHeavyHelper4Stub(global) {
  'use strict';

  const RUNTIME_PATH = 'js/modules/app-heavy-reference-helpers-4-runtime.js';
  const RUNTIME_VERSION_SUFFIX = getVersionSuffixFromCurrentScript();
  let manualLoadPromise = null;

  function getVersionSuffixFromCurrentScript() {
    const currentSrc = String(document.currentScript?.src || '');
    const queryIndex = currentSrc.indexOf('?');
    return queryIndex >= 0 ? currentSrc.slice(queryIndex) : '';
  }

  function buildRuntimeSrc() {
    return `${RUNTIME_PATH}${RUNTIME_VERSION_SUFFIX}`;
  }

  function loadRuntimeManually() {
    if (global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__) {
      return Promise.resolve(global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__);
    }
    if (manualLoadPromise) {
      return manualLoadPromise;
    }

    manualLoadPromise = new Promise((resolve, reject) => {
      const runtimeSrc = buildRuntimeSrc();
      const existing = document.querySelector(`script[data-helper4-runtime="true"][src="${runtimeSrc}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true' || global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__) {
          resolve(global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__ || null);
          return;
        }
        existing.addEventListener('load', () => resolve(global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__ || null), {once: true});
        existing.addEventListener('error', () => reject(new Error(`تعذر تحميل ${runtimeSrc}`)), {once: true});
        return;
      }

      const script = document.createElement('script');
      script.src = runtimeSrc;
      script.async = true;
      script.dataset.helper4Runtime = 'true';
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve(global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__ || null);
      };
      script.onerror = () => reject(new Error(`تعذر تحميل ${runtimeSrc}`));
      document.body.appendChild(script);
    });

    return manualLoadPromise;
  }

  async function ensureHeavyHelper4RuntimeLoaded() {
    if (global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__) {
      return global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__;
    }
    return loadRuntimeManually();
  }

  function requestHeavyHelper4Runtime() {
    if (global.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__) {
      return;
    }
    void ensureHeavyHelper4RuntimeLoaded().catch(() => {});
  }

  global.__ARABIC_VULKAN_HEAVY_HELPER4_LOADER__ = Object.freeze({
    runtimePath: RUNTIME_PATH,
    ensureLoaded: ensureHeavyHelper4RuntimeLoaded,
    request: requestHeavyHelper4Runtime
  });
})(window);

function getHeavyHelper4Runtime() {
  return window.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__ || null;
}

function requestHeavyHelper4Runtime() {
  return window.__ARABIC_VULKAN_HEAVY_HELPER4_LOADER__?.request?.();
}

async function ensureHeavyHelper4RuntimeLoaded() {
  return window.__ARABIC_VULKAN_HEAVY_HELPER4_LOADER__?.ensureLoaded?.() || null;
}

function invokeHeavyHelper4Runtime(name, args = [], fallbackValue) {
  const runtime = getHeavyHelper4Runtime();
  const runtimeFn = runtime?.[name];
  if (typeof runtimeFn === 'function') {
    return runtimeFn(...args);
  }
  void ensureHeavyHelper4RuntimeLoaded()
    .then((loadedRuntime) => loadedRuntime?.[name]?.(...args))
    .catch(() => {});
  return typeof fallbackValue === 'function'
    ? fallbackValue()
    : fallbackValue;
}

function escapeHeavyHelper4FallbackHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtml(text) {
  return escapeHeavyHelper4FallbackHtml(text);
}

function escapeAttribute(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const heavyHelper4StubEntityCodiconMap = {
  command: 'command',
  macro: 'macro',
  constant: 'constant',
  'constant-ref': 'constant',
  structure: 'structure',
  enum: 'enum',
  variable: 'variable',
  handle: 'variable',
  function_pointer: 'command',
  glsl: 'glsl',
  imgui: 'imgui',
  cpp: 'structure',
  gameui: 'tutorial',
  sdl3: 'sdl3',
  tutorial: 'tutorial',
  headers: 'file',
  file: 'file'
};

function getGlslSectionCodicon(sectionKey) {
  const map = {
    directives: 'macro',
    constants: 'constant',
    qualifiers: 'variable',
    control_flow: 'command',
    types: 'structure',
    builtins: 'variable',
    functions: 'command',
    blocks: 'structure'
  };
  return map[sectionKey] || 'glsl';
}

function renderCodicon(iconName, className = '', label = '') {
  const classes = ['codicon', iconName ? `codicon-${iconName}` : '', className].filter(Boolean).join(' ');
  const ariaLabel = label ? ` aria-label="${escapeAttribute(label)}"` : '';
  const ariaHidden = label ? '' : ' aria-hidden="true"';
  return `<span class="${escapeAttribute(classes)}"${ariaHidden}${ariaLabel}></span>`;
}

function renderEntityIcon(type, className = 'ui-codicon', label = '') {
  const iconName = heavyHelper4StubEntityCodiconMap[String(type || '').trim()] || 'symbol-misc';
  return renderCodicon(iconName, className, label || type || iconName);
}

function safeRenderEntityLabel(text, type = '', options = {}) {
  const label = String(text || '').trim();
  const iconHtml = renderEntityIcon(type || 'file', options.iconClassName || 'ui-codicon inline-entity-icon', label);
  const wrapperClasses = ['entity-inline-label'];
  if (options.code) wrapperClasses.push('entity-inline-label-code');
  if (options.className) wrapperClasses.push(options.className);
  const textHtml = options.wrapInCode === false
    ? `<span class="entity-label-text">${escapeHtml(label)}</span>`
    : `<code class="entity-label-code">${escapeHtml(label)}</code>`;
  return `<span class="${escapeAttribute(wrapperClasses.join(' '))}">${iconHtml}${textHtml}</span>`;
}

function renderHighlightedCode(rawCode, options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.renderHighlightedCode) {
    return runtime.renderHighlightedCode(rawCode, options);
  }
  requestHeavyHelper4Runtime();
  return escapeHeavyHelper4FallbackHtml(rawCode || '');
}

function getCodeBlockLanguage(block) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.getCodeBlockLanguage) {
    return runtime.getCodeBlockLanguage(block);
  }
  const className = String(block?.className || '');
  const match = className.match(/\blanguage-([a-z0-9_+-]+)/i);
  return match ? match[1].toLowerCase() : 'cpp';
}

function highlightSingleCodeBlock(block, options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.highlightSingleCodeBlock) {
    return runtime.highlightSingleCodeBlock(block, options);
  }
  requestHeavyHelper4Runtime();
}

function highlightCodeNow(root = document, options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.highlightCodeNow) {
    return runtime.highlightCodeNow(root, options);
  }
  requestHeavyHelper4Runtime();
}

function highlightCode(root = document, options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.highlightCode) {
    return runtime.highlightCode(root, options);
  }
  requestHeavyHelper4Runtime();
}

function scheduleProseCardReferenceLinking(root = document.getElementById('mainContent')) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.scheduleProseCardReferenceLinking) {
    return runtime.scheduleProseCardReferenceLinking(root);
  }
  requestHeavyHelper4Runtime();
}

function initProseCardReferenceLinking(root = document.getElementById('mainContent')) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.initProseCardReferenceLinking) {
    return runtime.initProseCardReferenceLinking(root);
  }
  requestHeavyHelper4Runtime();
}

function initTutorialCodeLazyHighlighting(root = document) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.initTutorialCodeLazyHighlighting) {
    return runtime.initTutorialCodeLazyHighlighting(root);
  }
  requestHeavyHelper4Runtime();
}

function renderRecentVisits() {
  return invokeHeavyHelper4Runtime('renderRecentVisits');
}

function scheduleRecentVisitCapture(route = '') {
  return invokeHeavyHelper4Runtime('scheduleRecentVisitCapture', [route]);
}

function toggleTree(element) {
  return invokeHeavyHelper4Runtime('toggleTree', [element]);
}

function copyCode(button) {
  return invokeHeavyHelper4Runtime('copyCode', [button]);
}

function initTooltipSystem() {
  return invokeHeavyHelper4Runtime('initTooltipSystem');
}

function initSidebarResizer() {
  return invokeHeavyHelper4Runtime('initSidebarResizer');
}

function initSidebarNavigation() {
  return invokeHeavyHelper4Runtime('initSidebarNavigation');
}

function initMobileSidebarToggle() {
  return invokeHeavyHelper4Runtime('initMobileSidebarToggle');
}

function applyMobileSidebarFallbackState(open) {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.querySelector('.menu-toggle');
  if (!sidebar || !toggle) {
    return false;
  }

  const isMobileViewport = window.innerWidth <= 900;
  const shouldOpen = isMobileViewport && Boolean(open);
  sidebar.classList.toggle('open', shouldOpen);
  document.body.classList.toggle('sidebar-mobile-open', shouldOpen);
  toggle.setAttribute('aria-expanded', String(shouldOpen));
  toggle.setAttribute('aria-label', shouldOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  toggle.setAttribute('aria-controls', 'sidebar');
  return shouldOpen;
}

function toggleMobileSidebarMenu(event) {
  if (event) {
    event.__mobileSidebarHandled = true;
    event.preventDefault?.();
    event.stopPropagation?.();
  }

  if (window.innerWidth > 900) {
    return false;
  }

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    return false;
  }

  applyMobileSidebarFallbackState(!sidebar.classList.contains('open'));
  return false;
}

function getKnownFunctionNames() {
  return invokeHeavyHelper4Runtime('getKnownFunctionNames', [], () => []);
}

function getKnownConstantNames() {
  return invokeHeavyHelper4Runtime('getKnownConstantNames', [], () => []);
}

function getKnownMacroNames() {
  return invokeHeavyHelper4Runtime('getKnownMacroNames', [], () => []);
}

function clearRecentVisits() {
  return invokeHeavyHelper4Runtime('clearRecentVisits');
}

function removeRecentVisit(index) {
  return invokeHeavyHelper4Runtime('removeRecentVisit', [index]);
}

function openRecentVisit(index) {
  return invokeHeavyHelper4Runtime('openRecentVisit', [index]);
}

function toggleSidebarSmartScroll() {
  return invokeHeavyHelper4Runtime('toggleSidebarSmartScroll');
}

function toggleSidebarJumpMenu(event) {
  return invokeHeavyHelper4Runtime('toggleSidebarJumpMenu', [event]);
}

function jumpToSidebarCluster(clusterId = '') {
  return invokeHeavyHelper4Runtime('jumpToSidebarCluster', [clusterId]);
}

function togglePageSmartScroll() {
  return invokeHeavyHelper4Runtime('togglePageSmartScroll');
}

async function showReferenceLibraryIndex(libraryId = '', options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showReferenceLibraryIndex?.(libraryId, options);
}

async function showReferenceKindIndex(libraryId = '', kindId = '', options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showReferenceKindIndex?.(libraryId, kindId, options);
}

async function showReferenceEntity(libraryId = '', kindId = '', slug = '', options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showReferenceEntity?.(libraryId, kindId, slug, options);
}

async function showCommand(name, categoryKey, options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showCommand?.(name, categoryKey, options);
}

async function showStructure(name, options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showStructure?.(name, options);
}

async function showEnum(name, options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showEnum?.(name, options);
}

async function showConstant(name, options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showConstant?.(name, options);
}

async function showMacro(name, options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showMacro?.(name, options);
}

async function showCommandsIndex(options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showCommandsIndex?.(options);
}

async function showStructuresIndex(options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showStructuresIndex?.(options);
}

async function showEnumsIndex(options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showEnumsIndex?.(options);
}

async function showVariablesIndex(options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showVariablesIndex?.(options);
}

async function showConstantsIndex(options = {}) {
  const runtime = await ensureHeavyHelper4RuntimeLoaded();
  return runtime?.showConstantsIndex?.(options);
}

function buildExampleAnalysis(example, item) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.buildExampleAnalysis) {
    return runtime.buildExampleAnalysis(example, item);
  }
  requestHeavyHelper4Runtime();
  return {
    variables: [],
    variableIndex: {},
    tokenGroups: {
      functions: [],
      types: [],
      constants: [],
      cpp: [],
      fields: []
    },
    commentIssues: [],
    lineRows: [],
    rewrittenCode: String(example || ''),
    references: []
  };
}

function resetSdl3DerivedCaches() {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.resetSdl3DerivedCaches) {
    return runtime.resetSdl3DerivedCaches();
  }
  requestHeavyHelper4Runtime();
}

function renderGenericExampleExplanation(item, options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.renderGenericExampleExplanation) {
    return runtime.renderGenericExampleExplanation(item, options);
  }
  requestHeavyHelper4Runtime();
  const summary = String(
    options.purpose
    || item?.description
    || item?.officialArabicDescription
    || item?.goal
    || ''
  ).trim();
  return summary ? `<p>${escapeHtml(summary)}</p>` : '';
}

function scrollToAnchor(anchorId) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.scrollToAnchor) {
    return runtime.scrollToAnchor(anchorId);
  }
  requestHeavyHelper4Runtime();
  const target = document.getElementById(String(anchorId || '').trim());
  if (target) {
    target.scrollIntoView({behavior: 'auto', block: 'start'});
  }
}

function syncRouteHistory(route = '', options = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.syncRouteHistory) {
    return runtime.syncRouteHistory(route, options);
  }
  requestHeavyHelper4Runtime();
  if (options?.skipHistory) {
    return;
  }
  const normalizedRoute = String(route || '').replace(/^#/, '');
  const targetHash = normalizedRoute ? `#${normalizedRoute}` : '';
  if ((window.location.hash || '') === targetHash) {
    return;
  }
  const method = options?.replaceHistory ? 'replaceState' : 'pushState';
  history[method](null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
}

function scrollMainContentToTop() {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.scrollMainContentToTop) {
    return runtime.scrollMainContentToTop();
  }
  requestHeavyHelper4Runtime();
  const main = document.getElementById('mainContent');
  if (main?.scrollTo) {
    main.scrollTo({top: 0, behavior: 'auto'});
  }
  window.scrollTo({top: 0, behavior: 'auto'});
}

function getCanonicalReferenceDetailAnchorId(sectionName = '', detailName = '') {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.getCanonicalReferenceDetailAnchorId) {
    return runtime.getCanonicalReferenceDetailAnchorId(sectionName, detailName);
  }
  requestHeavyHelper4Runtime();
  const normalize = (value) => String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `ref-detail-${normalize(sectionName)}-${normalize(detailName)}`;
}

function getNavigationEntityIconType(navigation, name = '') {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.getNavigationEntityIconType) {
    return runtime.getNavigationEntityIconType(navigation, name);
  }
  requestHeavyHelper4Runtime();
  if (!navigation) {
    return '';
  }
  if (navigation.type === 'command') return 'command';
  if (navigation.type === 'macro') return 'macro';
  if (navigation.type === 'constant') return 'constant';
  if (navigation.type === 'cpp') return 'cpp';
  if (navigation.type === 'cmake') return navigation.semanticAlias?.iconType || 'file';
  if (navigation.type === 'type') {
    const raw = String(name || '').trim();
    if (/Flags\b/.test(raw) || /^ImGui.+Flags/.test(raw)) return 'enum';
    if (/^Vk/.test(raw) && /CreateInfo$|State$|Properties$|Features$|Info$|Region$|Description$|Requirements$/.test(raw)) return 'structure';
    if (/^Vk/.test(raw) && /FlagBits$|Bits$|Mode$|Type$|Layout$|Count$|Usage$|Stage$|Rate$/.test(raw)) return 'enum';
    return 'structure';
  }
  return '';
}

function buildTooltipText(kind, item) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.buildTooltipText) {
    return runtime.buildTooltipText(kind, item);
  }
  requestHeavyHelper4Runtime();
  if (!item) {
    return '';
  }
  const name = String(item?.name || '').trim();
  const description = String(item?.description || item?.officialArabicDescription || '').trim();
  const kindLabelMap = {
    function: 'دالة',
    macro: 'ماكرو',
    constant: 'ثابت',
    type: 'نوع'
  };
  const kindLabel = kindLabelMap[String(kind || '').trim()] || 'عنصر';
  if (description) {
    return `${kindLabel} من Vulkan: ${description}`;
  }
  return name ? `${kindLabel} من Vulkan: ${name}` : `${kindLabel} من Vulkan.`;
}

function findCommandItemByName(name) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.findCommandItemByName) {
    return runtime.findCommandItemByName(name);
  }
  requestHeavyHelper4Runtime();
  return null;
}

function findConstantItemByName(name) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.findConstantItemByName) {
    return runtime.findConstantItemByName(name);
  }
  requestHeavyHelper4Runtime();
  return null;
}

function findMacroItemByName(name) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.findMacroItemByName) {
    return runtime.findMacroItemByName(name);
  }
  requestHeavyHelper4Runtime();
  return null;
}

function findTypeItemByName(name) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.findTypeItemByName) {
    return runtime.findTypeItemByName(name);
  }
  requestHeavyHelper4Runtime();
  return null;
}

function getCppReferenceItem(name) {
  const runtime = window.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ || null;
  if (runtime?.getCppReferenceItem) {
    return runtime.getCppReferenceItem(name);
  }
  if (runtime?.buildCppReferenceItem) {
    return runtime.buildCppReferenceItem(name);
  }
  return null;
}

function buildExternalReferenceTooltip(name) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.buildExternalReferenceTooltip) {
    return runtime.buildExternalReferenceTooltip(name);
  }
  requestHeavyHelper4Runtime();
  const label = String(name || '').trim();
  return label ? `مرجع خارجي مرتبط: ${label}` : 'مرجع خارجي مرتبط.';
}

function getExternalReferenceUrl(name, context = {}) {
  const runtime = getHeavyHelper4Runtime();
  if (runtime?.getExternalReferenceUrl) {
    return runtime.getExternalReferenceUrl(name, context);
  }
  requestHeavyHelper4Runtime();
  return '';
}
