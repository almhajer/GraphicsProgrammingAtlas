/* eslint-disable no-unused-vars */
(function (global) {
  'use strict';

  /* ── API proxy (defaults, overwritten by configure) ── */
  const api = {
    getAppBrandTitle: () => 'المرجع العربي للبرمجة',
    getSiteUsageGuide: () => ({ title: 'استخدام الموقع', excerpt: '', summaryCards: [], sections: [] }),
    getTutorialCatalog: () => [],
    buildHomeLibraryModels: () => [],
    buildHomeHeroStats: () => [],
    setCurrentView: () => {},
    syncRouteHistory: () => {},
    scrollMainContentToTop: () => {},
    clearActiveSidebarItems: () => {},
    collapseAllSidebarClusters: () => {},
    collapseAllSidebarSections: () => {},
    renderEntityIcon: () => '',
    escapeHtml: (v) => String(v || ''),
    escapeAttribute: (v) => String(v || '')
  };

  /* ── Cached hot-path references (set once after configure) ── */
  let _esc = api.escapeHtml;
  let _escA = api.escapeAttribute;
  let _icon = api.renderEntityIcon;

  /* ── Cached formatter (avoid recreating per call) ── */
  const _arNum = new Intl.NumberFormat('ar-SA');

  /* ── Pending lazy library models (for force-render on scroll) ── */
  let _lazyModels = null;

  function resolveEscaper(candidate, fallback) {
    return typeof candidate === 'function' ? candidate : fallback;
  }

  function configure(nextApi = {}) {
    const previousEsc = typeof _esc === 'function' ? _esc : ((v) => String(v || ''));
    const previousEscA = typeof _escA === 'function' ? _escA : previousEsc;
    const previousIcon = typeof _icon === 'function' ? _icon : (() => '');
    Object.assign(api, nextApi);
    if (typeof api.escapeHtml !== 'function') {
      api.escapeHtml = previousEsc;
    }
    if (typeof api.escapeAttribute !== 'function') {
      api.escapeAttribute = previousEscA;
    }
    if (typeof api.renderEntityIcon !== 'function') {
      api.renderEntityIcon = previousIcon;
    }
    _esc = api.escapeHtml;
    _escA = api.escapeAttribute;
    _icon = api.renderEntityIcon;
  }

  /* ── Helpers ── */

  function formatHomeCount(value) {
    const n = Number(value);
    return Number.isFinite(n) ? _arNum.format(n) : '—';
  }

  function getHomeLibrarySectionId(key) {
    return 'home-library-' + (key || '');
  }

  function scrollToHomeLibrarySection(key) {
    const el = document.getElementById(getHomeLibrarySectionId(key));
    if (!el) return;

    /* Force-render if still a lazy placeholder */
    if (el.classList.contains('home-library-lazy') && _lazyModels) {
      const idx = el.dataset.li | 0;
      const model = _lazyModels[idx];
      if (model) {
        el.classList.remove('home-library-lazy');
        el.removeAttribute('data-li');
        el.innerHTML = _renderLibrarySection(model);
      }
    }

    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  /* ── Render: stat cards ── */

  function renderHomeStatCards(cards) {
    if (!cards || !cards.length) return '';
    let h = '<div class="stats-grid">';
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const ico = c.icon || _icon(c.iconType || 'file', 'ui-codicon card-icon', c.title || '');
      h += '<div class="stat-card stat-card-rich"'
        + (c.action ? ' onclick="' + c.action + '"' : '')
        + '><div class="stat-card-top">'
        + '<span class="stat-card-icon">' + ico + '</span>'
        + '<span class="stat-number">' + formatHomeCount(c.count) + '</span>'
        + '</div><div class="stat-card-body">'
        + '<div class="stat-title">' + _esc(c.title || '') + '</div>'
        + '<div class="stat-label">' + _esc(c.note || '') + '</div>'
        + '</div></div>';
    }
    return h + '</div>';
  }

  /* ── Render: action buttons ── */

  function renderHomeActionButtons(items) {
    if (!items || !items.length) return '';
    let h = '';
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const ico = it.icon || _icon(it.iconType || 'file', 'ui-codicon list-icon', it.label || '');
      h += '<button onclick="' + it.action + '" class="quick-btn'
        + (it.primary ? ' primary' : '') + '">'
        + ico + ' ' + _esc(it.label || '') + '</button>';
    }
    return h;
  }

  /* ── Render: recent items ── */

  function renderHomeRecentItems(items, emptyText) {
    if (!items || !items.length) {
      return '<div class="content-card prose-card home-library-empty-card"><p>'
        + _esc(emptyText || 'لا توجد عناصر محلية في هذا القسم حالياً.') + '</p></div>';
    }
    let h = '<div class="recent-items">';
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const tip = (it.tooltip || it.note || it.label || '').trim();
      const aria = (it.label || '') + ': ' + (tip || it.label || '');
      const ico = it.icon || _icon(it.iconType || 'file', 'ui-codicon card-icon', it.label || '');
      h += '<div class="recent-item" tabindex="0"'
        + (tip ? ' data-tooltip="' + _escA(tip) + '"' : '')
        + ' aria-label="' + _escA(aria.replace(/\n/g, ' - ')) + '"'
        + ' onclick="' + it.action + '"'
        + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();' + it.action + ';}">'
        + '<span class="item-icon">' + ico + '</span>'
        + '<span class="item-name">' + _esc(it.label || '') + '</span></div>';
    }
    return h + '</div>';
  }

  /* ── Render: support links ── */

  function renderHomeSupportLinks(links) {
    if (!links || !links.length) {
      return '<div class="content-card prose-card home-library-empty-card"><p>لا توجد روابط مرجعية إضافية في هذا القسم حالياً.</p></div>';
    }
    let h = '<ul class="useful-links">';
    for (let i = 0; i < links.length; i++) {
      const lk = links[i];
      const ico = lk.icon || _icon(lk.iconType || 'file', 'ui-codicon list-icon', lk.label || '');
      if (lk.href) {
        h += '<li><a href="' + _escA(lk.href) + '" target="_blank" rel="noopener noreferrer">'
          + ico + ' ' + _esc(lk.label || '') + '</a></li>';
      } else {
        h += '<li><a href="#" onclick="' + lk.action + '; return false;">'
          + ico + ' ' + _esc(lk.label || '') + '</a></li>';
      }
    }
    return h + '</ul>';
  }

  /* ── Render: tutorial spotlight ── */

  function renderHomeTutorialSpotlightSection() {
    const catalog = api.getTutorialCatalog();
    const intro = catalog.find((t) => t.id === 'introduction')
      || { id: 'introduction', title: 'مقدمة إلى Vulkan', brief: 'تعرف على Vulkan ومميزاته الأساسية' };
    const overview = catalog.find((t) => t.id === 'overview')
      || { id: 'overview', title: 'نظرة عامة', brief: 'خريطة المكونات الرئيسية ومسار التطبيق' };

    const summary = 'قسم الدروس في المشروع يجمع المسار التعليمي العملي من الفكرة الأولى حتى الأمثلة التطبيقية، ويشرح لماذا نستخدم كل كائن ومتى نحتاجه وكيف نربطه ببقية أجزاء التطبيق.';
    const cont = 'إذا أنهيت المقدمة، فاكمل من فهرس الدروس أو انتقل مباشرة إلى النظرة العامة ثم بيئة التطوير حتى تدخل أمثلة Vulkan وأنت تملك صورة واضحة عن المسار كله.';

    return '<section class="home-section">'
      + '<h2>' + _icon('tutorial', 'ui-codicon page-icon', 'التعليمات') + ' التعليمات</h2>'
      + '<div class="info-grid">'
      + '<div class="content-card prose-card"><div class="info-label">نبذة عن القسم</div>'
      + '<div class="info-value">مسار الدروس التعليمية</div><p>' + _esc(summary) + '</p></div>'
      + '<div class="content-card prose-card"><div class="info-label">ابدأ من هنا</div>'
      + '<div class="info-value">' + _esc(intro.title) + '</div>'
      + '<p>' + _esc(intro.brief || 'ابدأ من الدرس الأول لفهم صورة Vulkan العامة قبل التوسع في الكود.') + '</p></div>'
      + '<div class="content-card prose-card"><div class="info-label">رابط الاستكمال</div>'
      + '<div class="info-value">متابعة بقية الدروس</div><p>' + _esc(cont) + '</p></div>'
      + '</div><div class="quick-links-grid">'
      + renderHomeActionButtons([
        { label: 'ابدأ: ' + intro.title, iconType: 'tutorial', action: "showTutorial('" + _escA(intro.id) + "')", primary: true },
        { label: 'التالي: ' + overview.title, iconType: 'tutorial', action: "showTutorial('" + _escA(overview.id) + "')" },
        { label: 'استكمل من فهرس الدروس', iconType: 'tutorial', action: 'showTutorialsIndex()' }
      ])
      + '</div></section>';
  }

  /* ── Render: single library section (used by lazy filler) ── */

  function _renderLibrarySection(model) {
    let h = '<div class="home-library-header"><div class="home-library-copy">'
      + '<span class="home-library-kicker">' + _esc(model.kicker || 'مرجع محلي') + '</span>'
      + '<h2>' + _icon(model.iconType || 'file', 'ui-codicon page-icon', model.title || '') + ' ' + _esc(model.title || '') + '</h2>'
      + '<p>' + _esc(model.description || '') + '</p>'
      + (model.statusNote ? '<p class="home-library-note">' + _esc(model.statusNote) + '</p>' : '')
      + '</div>';

    if (model.headerActions && model.headerActions.length) {
      h += '<div class="home-library-actions">' + renderHomeActionButtons(model.headerActions) + '</div>';
    }
    h += '</div>';
    h += renderHomeStatCards(model.cards);
    h += '<div class="home-sections">'
      + '<div class="home-section"><h2>🚀 مسار البداية</h2><div class="quick-links-grid">'
      + renderHomeActionButtons(model.quickLinks) + '</div></div>'
      + '<div class="home-section"><h2>' + _icon(model.recentIconType || model.iconType || 'file', 'ui-codicon page-icon', 'عناصر') + ' نقاط دخول سريعة</h2>'
      + renderHomeRecentItems(model.recentItems, model.recentEmptyText || '') + '</div>'
      + '<div class="home-section"><h2>🔗 مراجع مساندة</h2>'
      + renderHomeSupportLinks(model.supportLinks) + '</div>'
      + '</div>';
    h += model.extraSectionsHtml || '';
    return h;
  }

  /* ── Site usage inline HTML (with fast-path for plain text) ── */

  function _decodeEntities(v) {
    return String(v || '')
      .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&amp;/gi, '&');
  }

  function normalizeSiteUsageInlineHtmlSource(value) {
    let src = String(value || '');
    if (!src || !/&(lt|gt|quot|apos|#39|amp);/i.test(src)) return src;

    const encPat = /&(amp;)?lt;\s*\/?\s*(?:a|b|br|code|em|kbd|mark|small|span|strong)\b/i;
    for (let step = 0; step < 2; step++) {
      if (!encPat.test(src)) break;
      const dec = _decodeEntities(src);
      if (dec === src) break;
      src = dec;
    }

    const decPat = /<\s*\/?\s*(?:a|b|br|code|em|kbd|mark|small|span|strong)\b/i;
    return decPat.test(src) ? src : String(value || '');
  }

  const _allowedTags = new Set(['A', 'B', 'BR', 'CODE', 'EM', 'IMG', 'KBD', 'MARK', 'SMALL', 'SPAN', 'STRONG']);
  const _allowedAttrs = {
    A: new Set(['href', 'rel', 'target']),
    IMG: new Set(['src', 'alt', 'class', 'loading', 'decoding'])
  };

  function renderSiteUsageInlineHtml(value) {
    const src = String(value || '').trim();
    if (!src) return '';

    /* Fast-path: no HTML tags → escape and return (avoids DOM creation) */
    if (src.indexOf('<') === -1 && src.indexOf('>') === -1) return _esc(src);

    const clean = normalizeSiteUsageInlineHtmlSource(src);
    if (!clean || (clean.indexOf('<') === -1 && clean.indexOf('>') === -1)) return _esc(clean);

    const tpl = document.createElement('template');
    tpl.innerHTML = clean;

    const nodes = tpl.content.querySelectorAll('*');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const tag = node.tagName;
      if (!_allowedTags.has(tag)) {
        node.replaceWith(document.createTextNode(node.textContent || ''));
        continue;
      }
      const attrs = node.attributes;
      for (let j = attrs.length - 1; j >= 0; j--) {
        if (!_allowedAttrs[tag] || !_allowedAttrs[tag].has(attrs[j].name)) {
          node.removeAttribute(attrs[j].name);
        }
      }
      if (tag === 'A') {
        const href = (node.getAttribute('href') || '').trim();
        if (!/^https?:\/\//i.test(href)) {
          node.replaceWith(document.createTextNode(node.textContent || ''));
        } else {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer');
        }
      } else if (tag === 'IMG') {
        const src = (node.getAttribute('src') || '').trim();
        if (!/^assets\/material-icon-theme\/[a-z0-9_-]+\.svg$/i.test(src)) {
          node.replaceWith(document.createTextNode(node.getAttribute('alt') || ''));
        } else {
          node.setAttribute('loading', 'lazy');
          node.setAttribute('decoding', 'async');
        }
      }
    }

    return tpl.innerHTML;
  }

  function renderTutorialListFallback(items, ordered) {
    if (!items || !items.length) return '';
    const tag = ordered ? 'ol' : 'ul';
    const className = ordered ? 'site-usage-guide-list site-usage-guide-list-ordered' : 'site-usage-guide-list';
    let h = '<' + tag + ' class="' + className + '">';
    for (let i = 0; i < items.length; i++) {
      h += '<li>' + renderSiteUsageInlineHtml(items[i]) + '</li>';
    }
    return h + '</' + tag + '>';
  }

  function getSiteUsageSectionClass(title) {
    const key = String(title || '').trim();
    if (key === 'لماذا نستخدم زر نسخ الكود؟') return 'site-usage-section-copy';
    if (key === 'عند طلب فكرة أو تعديل') return 'site-usage-section-request';
    if (key === 'روابط الدعم في المستودع') return 'site-usage-section-support';
    if (key === 'إضافات من حساب Arabic-language') return 'site-usage-section-extensions';
    if (key === 'كلمة أخيرة') return 'site-usage-section-final';
    return '';
  }

  function renderSiteUsageGuideSection(section) {
    const extraClass = getSiteUsageSectionClass(section.title);
    return '<section class="home-section' + (extraClass ? ' ' + extraClass : '') + '">'
      + '<h2>' + renderSiteUsageInlineHtml(section.title) + '</h2>'
      + '<div class="content-card prose-card">'
      + renderTutorialListFallback(section.bullets, !!section.ordered)
      + '</div></section>';
  }

  /* ── Show: site usage guide ── */

  function showSiteUsageGuide(options) {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const guide = api.getSiteUsageGuide();
    const cards = guide.summaryCards || [];
    const sections = guide.sections || [];

    let cardsHtml = '';
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      cardsHtml += '<div class="content-card prose-card">'
        + '<div class="info-label">' + renderSiteUsageInlineHtml(c.label) + '</div>'
        + '<div class="info-value">' + renderSiteUsageInlineHtml(c.value) + '</div>'
        + '<p>' + renderSiteUsageInlineHtml(c.note) + '</p></div>';
    }

    let sectionsHtml = '';
    for (let i = 0; i < sections.length; i++) {
      sectionsHtml += renderSiteUsageGuideSection(sections[i]);
    }

    content.innerHTML = '<div class="site-usage-guide-page">'
      + '<div class="page-header">'
      + '<nav class="breadcrumb"><a href="#" onclick="showHomePage(); return false;">الرئيسية</a> / '
      + '<span>' + _esc(guide.title) + '</span></nav>'
      + '<h1>' + _icon('file', 'ui-codicon page-icon', guide.title) + ' ' + _esc(guide.title) + '</h1>'
      + '<p>' + renderSiteUsageInlineHtml(guide.excerpt) + '</p></div>'
      + '<section class="home-section site-usage-section-summary"><h2>ملخص سريع</h2><div class="info-grid">'
      + cardsHtml + '</div></section>'
      + sectionsHtml
      + '</div>';

    api.setCurrentView('site-usage');
    document.title = guide.title + ' - ' + api.getAppBrandTitle();
    api.syncRouteHistory('site-usage', options);
    api.scrollMainContentToTop();
    api.clearActiveSidebarItems();
    api.collapseAllSidebarClusters();
    api.collapseAllSidebarSections();
  }

  /* ── Show: home page (with lazy library sections) ── */

  function showHomePage(options) {
    const content = document.getElementById('mainContent');
    if (!content) return;
    const esc = resolveEscaper(_esc, (v) => String(v || ''));
    const escA = resolveEscaper(_escA, esc);
    const icon = resolveEscaper(_icon, () => '');

    const libraryModels = api.buildHomeLibraryModels();
    const heroStats = api.buildHomeHeroStats(libraryModels);

    /* Build library cards (above-fold, always visible) */
    let cardsHtml = '';
    for (let i = 0; i < libraryModels.length; i++) {
      const m = libraryModels[i];
      cardsHtml += '<div class="stat-card stat-card-rich" onclick="scrollToHomeLibrarySection(\''
        + escA(m.key) + '\')"><div class="stat-card-top">'
        + '<span class="stat-card-icon">' + icon(m.iconType || 'file', 'ui-codicon card-icon', m.title || '') + '</span>'
        + '<span class="stat-number">' + formatHomeCount(m.totalCount) + '</span>'
        + '</div><div class="stat-card-body">'
        + '<div class="stat-title">' + esc(m.title || '') + '</div>'
        + '<div class="stat-label">' + esc(m.summaryNote || m.description || '') + '</div>'
        + '</div></div>';
    }

    /* Build hero stats */
    let statsHtml = '';
    for (let i = 0; i < heroStats.length; i++) {
      statsHtml += '<div class="hero-stat">'
        + '<span class="hero-stat-value">' + formatHomeCount(heroStats[i].value) + '</span>'
        + '<span class="hero-stat-label">' + esc(heroStats[i].label) + '</span></div>';
    }

    /* Build lazy placeholders for library sections (below-fold) */
    let lazyShells = '';
    const eagerLibraryCount = 3;
    for (let i = 0; i < libraryModels.length; i++) {
      if (i < eagerLibraryCount) {
        lazyShells += '<section class="home-library-shell" id="'
          + escA(getHomeLibrarySectionId(libraryModels[i].key))
          + '">' + _renderLibrarySection(libraryModels[i]) + '</section>';
      } else {
        lazyShells += '<section class="home-library-shell home-library-lazy" id="'
          + escA(getHomeLibrarySectionId(libraryModels[i].key))
          + '" data-li="' + i + '"></section>';
      }
    }

    /* Store models for force-render on scroll-to */
    _lazyModels = libraryModels;

    /* Render above-fold content immediately */
    content.innerHTML = '<section class="home-hero"><div class="home-hero-main">'
      + '<span class="home-eyebrow">مرجع عربي موحد للمكتبات</span>'
      + '<h1>' + esc(api.getAppBrandTitle()) + '</h1>'
      + '<p class="home-hero-lead">الصفحة الرئيسية تعرض الآن كل مكتبات المشروع بنفس قالب Vulkan الحالي: بطاقات أقسام، مسار بداية، نقاط دخول سريعة، وروابط مرجعية، مع بقاء الفروق محصورة في بيانات كل مكتبة فقط.</p>'
      + '<div class="home-hero-actions">'
      + '<button onclick="showSiteUsageGuide()" class="quick-btn">' + icon('file', 'ui-codicon list-icon', 'استخدام الموقع') + ' استخدام الموقع</button>'
      + '<button onclick="showTutorial(\'introduction\')" class="quick-btn primary">' + icon('tutorial', 'ui-codicon list-icon', 'درس') + ' ابدأ من المقدمة</button>'
      + '<button onclick="showCppIndex()" class="quick-btn">' + icon('cpp', 'ui-codicon list-icon', 'C++') + ' افتح C++</button>'
      + '<button onclick="showReferenceLibraryIndex(\'ffmpeg\')" class="quick-btn">' + icon('file', 'ui-codicon list-icon', 'FFmpeg') + ' افتح FFmpeg</button>'
      + '<button onclick="showCommandsIndex()" class="quick-btn">' + icon('command', 'ui-codicon list-icon', 'دالة') + ' تصفح Vulkan</button>'
      + '<button onclick="showSdl3Index()" class="quick-btn">' + icon('sdl3', 'ui-codicon list-icon', 'SDL3') + ' افتح SDL3</button>'
      + '<button onclick="showSdl3PackageIndex(\'audio\')" class="quick-btn">' + icon('sdl3', 'ui-codicon list-icon', 'SDL3Audio') + ' افتح SDL3Audio</button>'
      + '<button onclick="showImguiIndex()" class="quick-btn">' + icon('imgui', 'ui-codicon list-icon', 'Dear ImGui') + ' افتح Dear ImGui</button>'
      + '<button onclick="showGlslIndex()" class="quick-btn">' + icon('glsl', 'ui-codicon list-icon', 'GLSL') + ' افتح GLSLang</button>'
      + '</div>'
      + '<div class="home-highlight-row">'
      + '<span class="home-highlight-chip">قالب موحد لكل المكتبات</span>'
      + '<span class="home-highlight-chip">تحميل كسول للأقسام الثقيلة</span>'
      + '<span class="home-highlight-chip">روابط داخلية وواجهات متناسقة</span>'
      + '</div></div>'
      + '<aside class="home-hero-panel"><div class="home-hero-panel-head">'
      + '<span class="home-hero-panel-kicker">نظرة سريعة</span><strong>ما المتاح الآن؟</strong></div>'
      + '<div class="hero-stats-grid">' + statsHtml + '</div>'
      + '<div class="home-hero-note">انتقل من بطاقات المكتبات إلى القسم المطلوب مباشرة، وستبقى المراجع الثقيلة مثل SDL3 وDear ImGui وGLSLang محمّلة عند الطلب حتى لا تتغير سرعة الإقلاع الحالية.</div>'
      + '</aside></section>'
      + renderHomeTutorialSpotlightSection()
      + '<section class="home-section"><h2>📚 مكتبات المشروع</h2>'
      + '<div class="stats-grid">' + cardsHtml + '</div></section>'
      + '<div class="home-library-stack">' + lazyShells + '</div>';

    /* Lazy-fill library sections via IntersectionObserver */
    if (libraryModels.length > 0) {
      requestAnimationFrame(function () {
        const shells = content.querySelectorAll('.home-library-lazy');
        if (!shells.length) return;

        const observer = new IntersectionObserver(function (entries) {
          for (let i = 0; i < entries.length; i++) {
            if (!entries[i].isIntersecting) continue;
            const el = entries[i].target;
            const idx = el.dataset.li | 0;
            const model = libraryModels[idx];
            if (model) {
              el.classList.remove('home-library-lazy');
              el.removeAttribute('data-li');
              el.innerHTML = _renderLibrarySection(model);
            }
            observer.unobserve(el);
          }
        }, { rootMargin: '200px' });

        for (let i = 0; i < shells.length; i++) {
          observer.observe(shells[i]);
        }
      });
    }

    api.setCurrentView('home');
    document.title = api.getAppBrandTitle();
    api.syncRouteHistory('', options);
    api.scrollMainContentToTop();
    api.clearActiveSidebarItems();
    api.collapseAllSidebarClusters();
    api.collapseAllSidebarSections();
  }

  /* ── Public API ── */

  global.__ARABIC_VULKAN_HOME_PAGE__ = {
    configure,
    formatHomeCount,
    getHomeLibrarySectionId,
    normalizeSiteUsageInlineHtmlSource,
    scrollToHomeLibrarySection,
    showSiteUsageGuide,
    showHomePage
  };
})(window);
