(function (global) {
  const PASSIVE_SCROLL_CAPTURE_OPTIONS = {capture: true, passive: true};
  const SECTION_VIDEO_SHOWCASES = new Map();

  let activeSectionVideoScopeId = null;

  const api = {
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || ''),
    splitCodeIntoLineChunks: null,
    getCodeBlockLanguage: () => 'cpp',
    highlightSingleCodeBlock: () => {},
    renderGenericExampleExplanation: () => ''
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function fallbackSplitCodeIntoLineChunks(rawCode, maxLinesPerChunk = 70) {
    const lines = String(rawCode || '').split('\n');
    const chunks = [];

    for (let start = 0; start < lines.length; start += maxLinesPerChunk) {
      const slice = lines.slice(start, start + maxLinesPerChunk);
      chunks.push({
        startLine: start + 1,
        endLine: start + slice.length,
        code: slice.join('\n')
      });
    }

    return chunks;
  }

  function splitCodeIntoLineChunks(rawCode, maxLinesPerChunk = 70) {
    const split = typeof api.splitCodeIntoLineChunks === 'function'
      ? api.splitCodeIntoLineChunks
      : fallbackSplitCodeIntoLineChunks;

    return split(rawCode, maxLinesPerChunk);
  }

  function isLargeTutorialExample(codeText) {
    const text = String(codeText || '');
    const lineCount = text.split('\n').length;
    return lineCount > 90 || text.length > 5000;
  }

  function isHighlightableCodeBlock(block) {
    return Boolean(block && Array.from(block.classList || []).some((className) => /^language-/.test(className)));
  }

  function prepareTutorialCodeContainers(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    root.querySelectorAll('.tutorial-content .code-container').forEach((container) => {
      if (container.dataset.tutorialChunked === 'true') {
        return;
      }

      const block = Array.from(container.querySelectorAll('code')).find((node) => isHighlightableCodeBlock(node));
      if (!block) {
        return;
      }

      const rawCode = block.dataset.rawCode || block.textContent || '';
      if (!isLargeTutorialExample(rawCode)) {
        return;
      }

      const language = api.getCodeBlockLanguage(block);
      const chunks = splitCodeIntoLineChunks(rawCode, 70);
      if (chunks.length <= 1) {
        return;
      }

      const headerText = container.querySelector('.code-header span')?.textContent || 'الكود';
      const chunkHtml = chunks.map((chunk, index) => `
        <section class="tutorial-code-chunk-card example-section tutorial-example-section">
          <div class="tutorial-code-chunk-label">${api.escapeHtml(headerText)} - الجزء ${index + 1} (${chunk.startLine} - ${chunk.endLine})</div>
          <pre class="code-block"><code class="language-${language}" data-raw-code="${api.escapeAttribute(chunk.code)}" ${index > 0 ? 'data-defer-highlight="true"' : ''}>${api.escapeHtml(chunk.code)}</code></pre>
        </section>
      `).join('');

      container.dataset.tutorialChunked = 'true';
      container.innerHTML = `
        <div class="code-header"><span>${api.escapeHtml(headerText)}</span></div>
        <div class="content-card prose-card">
          <p>هذا المقطع كبير، لذلك عُرض كسلسلة أجزاء متتابعة. كل جزء يُحمَّل ويُلوَّن تدريجياً أثناء التمرير حتى تبقى الروابط وTooltip سريعة داخل المتصفح.</p>
        </div>
        <div class="tutorial-code-chunks">
          ${chunkHtml}
        </div>
      `;
    });
  }

  function activateTutorialLazyCodeBlocks(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    const blocks = Array.from(root.querySelectorAll('.tutorial-code-chunks code')).filter((block) => isHighlightableCodeBlock(block));
    if (!blocks.length) {
      return;
    }

    const isUnhighlighted = (block) => block.dataset.deferHighlight === 'true' || !block.dataset.renderKey;
    const highlightVisibleBlocks = () => {
      let remaining = 0;

      blocks.forEach((block) => {
        if (!isUnhighlighted(block)) {
          return;
        }

        remaining += 1;
        const rect = block.getBoundingClientRect();
        const withinReach = rect.top < global.innerHeight + 320 && rect.bottom > -320;
        if (withinReach) {
          api.highlightSingleCodeBlock(block, {force: true});
        }
      });

      return remaining;
    };

    blocks.forEach((block, index) => {
      if (index < 2) {
        api.highlightSingleCodeBlock(block, {force: true});
      }
    });

    highlightVisibleBlocks();

    if (typeof global.IntersectionObserver !== 'function') {
      const lazyPass = () => {
        const remaining = highlightVisibleBlocks();
        if (!remaining) {
          global.removeEventListener('scroll', lazyPass, true);
          global.removeEventListener('resize', lazyPass, true);
        }
      };

      global.addEventListener('scroll', lazyPass, PASSIVE_SCROLL_CAPTURE_OPTIONS);
      global.addEventListener('resize', lazyPass, true);
      lazyPass();
      return;
    }

    const observer = new global.IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const block = entry.target;
        api.highlightSingleCodeBlock(block, {force: true});
        obs.unobserve(block);
      });
    }, {
      rootMargin: '240px 0px'
    });

    blocks.forEach((block, index) => {
      if (index >= 2) {
        observer.observe(block);
      }
    });

    const fallbackScan = () => {
      const remaining = highlightVisibleBlocks();
      if (!remaining) {
        global.removeEventListener('scroll', fallbackScan, true);
        global.removeEventListener('resize', fallbackScan, true);
        observer.disconnect();
      }
    };

    global.addEventListener('scroll', fallbackScan, PASSIVE_SCROLL_CAPTURE_OPTIONS);
    global.addEventListener('resize', fallbackScan, true);
    global.requestAnimationFrame(fallbackScan);
  }

  function refreshTutorialCodePresentation(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    const blocks = Array.from(root.querySelectorAll('.tutorial-content code')).filter((block) => isHighlightableCodeBlock(block));
    if (!blocks.length) {
      return;
    }

    blocks.forEach((block) => {
      if (!block.closest('.tutorial-code-chunks')) {
        api.highlightSingleCodeBlock(block, {force: true});
      }
    });

    const visibleLazyBlocks = Array.from(root.querySelectorAll('.tutorial-code-chunks code')).filter((block) => {
      if (!isHighlightableCodeBlock(block)) {
        return false;
      }
      const rect = block.getBoundingClientRect();
      return rect.top < global.innerHeight + 320 && rect.bottom > -320;
    });

    visibleLazyBlocks.forEach((block) => {
      api.highlightSingleCodeBlock(block, {force: true});
    });
  }

  function renderTutorialInfoGrid(items) {
    return `
      <div class="info-grid">
        ${(Array.isArray(items) ? items : []).map((item) => `
          <div class="content-card prose-card">
            <div class="info-label">${item.label}</div>
            <div class="info-value">${item.value}</div>
            ${item.note ? `<p>${item.note}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function normalizeSectionVideoScopeId(scopeId) {
    return String(scopeId || 'section-video')
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      || 'section-video';
  }

  function getSectionVideoUiIds(scopeId) {
    const safeScopeId = normalizeSectionVideoScopeId(scopeId);
    const baseId = `section-video-${safeScopeId}`;
    return {
      modalId: `${baseId}-modal`,
      frameId: `${baseId}-frame`,
      previewButtonId: `${baseId}-preview`,
      overlayActionsId: `${baseId}-overlay-actions`
    };
  }

  function registerSectionVideoShowcase(config = {}) {
    const normalizedConfig = {
      scopeId: normalizeSectionVideoScopeId(config.scopeId),
      title: String(config.title || 'فيديو توضيحي').trim(),
      videoId: String(config.videoId || '').trim(),
      watchUrl: String(config.watchUrl || '').trim(),
      previewUrl: String(config.previewUrl || '').trim(),
      summaryHeading: String(config.summaryHeading || '').trim(),
      summaryText: String(config.summaryText || '').trim(),
      badgeText: String(config.badgeText || 'معاينة مصغّرة').trim()
    };

    if (!normalizedConfig.videoId || !normalizedConfig.watchUrl) {
      return null;
    }

    SECTION_VIDEO_SHOWCASES.set(normalizedConfig.scopeId, normalizedConfig);
    return normalizedConfig;
  }

  function buildSectionVideoEmbedUrl(videoId) {
    const params = new global.URLSearchParams({
      rel: '0',
      autoplay: '1',
      playsinline: '1',
      enablejsapi: '1',
      vq: 'highres'
    });
    const origin = global.location && global.location.origin;
    if (origin && origin !== 'null') {
      params.set('origin', origin);
    }
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  }

  function renderSectionVideoShowcase(config = {}) {
    const videoConfig = registerSectionVideoShowcase(config);
    if (!videoConfig) {
      return '';
    }

    const ids = getSectionVideoUiIds(videoConfig.scopeId);
    const embedUrl = buildSectionVideoEmbedUrl(videoConfig.videoId);
    return `
      <section class="tutorial-video-card tutorial-lead-media" data-video-showcase="${api.escapeAttribute(videoConfig.scopeId)}">
        <div class="content-card prose-card tutorial-video-copy">
          <div class="tutorial-video-layout">
            <div class="tutorial-video-media-column">
              <div class="tutorial-video-preview-shell">
                <button
                  type="button"
                  id="${ids.previewButtonId}"
                  class="tutorial-video-preview-button"
                  onclick="openSectionVideoModal('${videoConfig.scopeId}')"
                  aria-label="${api.escapeAttribute(`تشغيل فيديو ${videoConfig.title}`)}">
                  <img
                    class="tutorial-video-preview-image"
                    src="${videoConfig.previewUrl}"
                    alt="${api.escapeAttribute(`معاينة فيديو ${videoConfig.title}`)}"
                    loading="lazy"
                    referrerpolicy="no-referrer">
                  <span class="tutorial-video-preview-overlay"></span>
                  <span class="tutorial-video-zoom-badge">${api.escapeHtml(videoConfig.badgeText)}</span>
                </button>
                <div id="${ids.overlayActionsId}" class="tutorial-video-overlay-actions">
                  <button
                    type="button"
                    class="quick-btn tutorial-video-overlay-btn tutorial-video-overlay-btn-play"
                    onclick="openSectionVideoModal('${videoConfig.scopeId}')">
                    تشغيل الفيديو
                  </button>
                  <button
                    type="button"
                    class="quick-btn tutorial-video-overlay-btn tutorial-video-overlay-btn-youtube"
                    onclick="openSectionVideoExternal('${videoConfig.scopeId}')">
                    فتح عبر يوتيوب
                  </button>
                </div>
              </div>
            </div>
            <div class="tutorial-video-text-column">
              <div class="tutorial-video-heading">${api.escapeHtml(videoConfig.summaryHeading)}</div>
              <div class="tutorial-video-text-panel">
                <p class="tutorial-video-intro-text">${api.escapeHtml(videoConfig.summaryText)}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="${ids.modalId}"
          class="tutorial-video-modal"
          onclick="handleSectionVideoModalBackdrop(event, '${videoConfig.scopeId}')"
          hidden>
          <div class="tutorial-video-modal-dialog" role="dialog" aria-modal="true" aria-label="${api.escapeAttribute(`تشغيل فيديو ${videoConfig.title}`)}">
            <button
              type="button"
              class="tutorial-video-modal-close"
              onclick="closeSectionVideoModal('${videoConfig.scopeId}')"
              aria-label="إغلاق الفيديو">×</button>
            <div class="tutorial-video-modal-frame-shell">
              <iframe
                id="${ids.frameId}"
                class="tutorial-video-modal-frame"
                data-src="${embedUrl}"
                src=""
                title="${api.escapeAttribute(videoConfig.title)}"
                loading="eager"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTutorialLeadMedia(tutorialId, tutorial = null) {
    const title = String(tutorial?.title || 'مقدمة إلى Vulkan').trim();
    if (tutorialId === 'introduction') {
      const introSummary = String(
        tutorial?.summary
        || 'هذا الدرس يضع الأساس الذهني قبل الدخول في التفاصيل البرمجية: ما الذي يميّز Vulkan، وما المسؤوليات التي ينقلها إليك، ولماذا يبدأ أغلب المطورين بمثال مثلث قبل الانتقال إلى المشاهد الكاملة.'
      ).trim();

      return renderSectionVideoShowcase({
        scopeId: 'tutorial-introduction',
        title,
        videoId: 'QT2XBf7IUgA',
        watchUrl: 'https://www.youtube.com/watch?v=QT2XBf7IUgA',
        previewUrl: 'https://i.ytimg.com/vi/QT2XBf7IUgA/hqdefault.jpg',
        summaryHeading: 'نص المقدمة',
        summaryText: introSummary,
        badgeText: 'معاينة مصغّرة'
      });
    }

    if (tutorialId === 'glfw3') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-glfw3',
        title,
        videoId: 'zw83-5cwCKw',
        watchUrl: 'https://www.youtube.com/watch?v=zw83-5cwCKw',
        previewUrl: 'https://i.ytimg.com/vi/zw83-5cwCKw/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'هذا الدرس يجمع المسار العملي لتثبيت Vulkan SDK على Windows وLinux وmacOS، ثم التحقق من الأدوات، ثم ربط GLFW3 مع Vulkan لإنشاء نافذة وسطح عرض صالحين قبل الانتقال إلى أمثلة الرسم.',
        badgeText: 'فيديو الدرس'
      });
    }

    if (tutorialId === 'instance') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-instance',
        title,
        videoId: '7sOsFKebAI4',
        watchUrl: 'https://www.youtube.com/watch?v=7sOsFKebAI4',
        previewUrl: 'https://i.ytimg.com/vi/7sOsFKebAI4/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'يركز هذا الدرس على إنشاء VkInstance بشكل صحيح، وفهم دور VkApplicationInfo وVkInstanceCreateInfo، وكيفية تمرير الامتدادات المطلوبة من GLFW أو من نظام النافذة قبل بناء بقية كائنات Vulkan.',
        badgeText: 'فيديو الدرس'
      });
    }

    if (tutorialId === 'validation') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-validation',
        title,
        videoId: 'dTElcERrshA',
        watchUrl: 'https://www.youtube.com/watch?v=dTElcERrshA',
        previewUrl: 'https://i.ytimg.com/vi/dTElcERrshA/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'يوضح هذا الدرس كيف تفعّل طبقات التحقق ورسائل التشخيص في Vulkan، ولماذا تعد أفضل وسيلة لاكتشاف الأخطاء مبكرًا قبل أن تتحول الشاشة السوداء أو الأعطال الصامتة إلى مشكلة يصعب تتبعها.',
        badgeText: 'فيديو الدرس'
      });
    }

    if (tutorialId === 'physical_device') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-physical-device',
        title,
        videoId: 'mhgn8BrTCfA',
        watchUrl: 'https://www.youtube.com/watch?v=mhgn8BrTCfA',
        previewUrl: 'https://i.ytimg.com/vi/mhgn8BrTCfA/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'يركز هذا الدرس على كيفية استعراض البطاقات الرسومية المتاحة، وفحص دعم الطوابير والامتدادات والميزات المطلوبة، ثم اختيار الجهاز الفيزيائي الأنسب قبل الانتقال إلى إنشاء الجهاز المنطقي.',
        badgeText: 'فيديو الدرس'
      });
    }

    if (tutorialId === 'logical_device') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-logical-device',
        title,
        videoId: 'wiKGm6uEEQ4',
        watchUrl: 'https://www.youtube.com/watch?v=wiKGm6uEEQ4',
        previewUrl: 'https://i.ytimg.com/vi/wiKGm6uEEQ4/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'يركز هذا الدرس على إنشاء Logical Device بعد اختيار الجهاز الفيزيائي، وكيفية طلب عائلات الطوابير المناسبة وربط Queue Handles التي سيستخدمها التطبيق لاحقًا للرسم والتقديم.',
        badgeText: 'فيديو الدرس'
      });
    }

    if (tutorialId === 'swapchain') {
      return renderSectionVideoShowcase({
        scopeId: 'tutorial-swapchain',
        title,
        videoId: 'UVl10XaBTuY',
        watchUrl: 'https://www.youtube.com/watch?v=UVl10XaBTuY',
        previewUrl: 'https://i.ytimg.com/vi/UVl10XaBTuY/hqdefault.jpg',
        summaryHeading: 'ملخص الدرس',
        summaryText: 'يركز هذا الدرس على إنشاء Swapchain واختيار تنسيق الصور ونمط العرض والأبعاد المناسبة، ثم فهم كيف تصبح صور العرض الجسر العملي بين الرسم داخل Vulkan وظهور النتيجة النهائية على الشاشة.',
        badgeText: 'فيديو الدرس'
      });
    }

    return '';
  }

  function requestTutorialVideoHighestQuality(frame) {
    if (!frame || !frame.contentWindow) {
      return false;
    }

    const sendQualityCommand = () => {
      if (!frame.contentWindow) {
        return;
      }
      frame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setPlaybackQuality',
        args: ['highres']
      }), '*');
    };

    sendQualityCommand();
    global.setTimeout(sendQualityCommand, 250);
    global.setTimeout(sendQualityCommand, 900);
    return true;
  }

  function closeSectionVideoModal(scopeId) {
    const safeScopeId = normalizeSectionVideoScopeId(scopeId);
    const ids = getSectionVideoUiIds(safeScopeId);
    const modal = global.document.getElementById(ids.modalId);
    const frame = global.document.getElementById(ids.frameId);
    if (!modal) {
      if (activeSectionVideoScopeId === safeScopeId) {
        activeSectionVideoScopeId = null;
      }
      if (!activeSectionVideoScopeId) {
        global.document.body?.classList.remove('tutorial-video-modal-open');
      }
      return false;
    }

    modal.hidden = true;
    if (frame) {
      frame.onload = null;
      frame.src = '';
    }
    if (activeSectionVideoScopeId === safeScopeId) {
      activeSectionVideoScopeId = null;
    }
    if (!activeSectionVideoScopeId) {
      global.document.body?.classList.remove('tutorial-video-modal-open');
    }
    return true;
  }

  function closeActiveSectionVideoModal() {
    if (!activeSectionVideoScopeId) {
      global.document.body?.classList.remove('tutorial-video-modal-open');
      return false;
    }
    return closeSectionVideoModal(activeSectionVideoScopeId);
  }

  function openSectionVideoModal(scopeId) {
    const safeScopeId = normalizeSectionVideoScopeId(scopeId);
    const ids = getSectionVideoUiIds(safeScopeId);
    const modal = global.document.getElementById(ids.modalId);
    const frame = global.document.getElementById(ids.frameId);
    if (!modal || !frame) {
      return false;
    }

    closeActiveSectionVideoModal();
    activeSectionVideoScopeId = safeScopeId;
    frame.onload = () => {
      requestTutorialVideoHighestQuality(frame);
    };
    frame.src = frame.dataset.src || '';

    modal.hidden = false;
    global.document.body?.classList.add('tutorial-video-modal-open');
    return true;
  }

  function handleSectionVideoModalBackdrop(event, scopeId) {
    if (event.target && event.target === event.currentTarget) {
      closeSectionVideoModal(scopeId);
    }
    return true;
  }

  function openSectionVideoExternal(scopeId) {
    const safeScopeId = normalizeSectionVideoScopeId(scopeId);
    const videoConfig = SECTION_VIDEO_SHOWCASES.get(safeScopeId);
    if (!videoConfig?.watchUrl) {
      return false;
    }
    global.open(videoConfig.watchUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  function closeTutorialVideoModal() {
    return closeActiveSectionVideoModal();
  }

  function getNearestTutorialHeading(codeContainer) {
    let cursor = codeContainer.previousElementSibling;
    while (cursor) {
      if (/^H[1-6]$/.test(cursor.tagName)) {
        return cursor.textContent.trim();
      }
      cursor = cursor.previousElementSibling;
    }

    const tutorialBody = codeContainer.closest('.tutorial-body');
    if (!tutorialBody) {
      return 'مثال من الدرس';
    }

    const headings = Array.from(tutorialBody.querySelectorAll('h3'));
    const candidate = headings.reverse().find((heading) => {
      return heading.compareDocumentPosition(codeContainer) & global.Node.DOCUMENT_POSITION_FOLLOWING;
    });

    return candidate ? candidate.textContent.trim() : 'مثال من الدرس';
  }

  function renderLargeTutorialExampleSummary(title, codeText) {
    const lineCount = String(codeText || '').split('\n').length;

    return `
      <section class="explanation-section">
        <h2>🧩 ملخص المثال</h2>
        <div class="content-card prose-card">
          <p>هذا المثال كبير نسبيًا (${lineCount} سطرًا)، لذلك لا نولّد له التحليل التفصيلي الكامل داخل صفحة الدرس حتى لا يثقل المتصفح.</p>
          <p>الغرض من هذا المقطع هو شرح فكرة <strong>${api.escapeHtml(title)}</strong> على مستوى البنية العامة. إذا كنت تريد تحليل الرموز والأنواع والدوال بالتفصيل، استخدم الروابط المرجعية داخل الشرح أو افتح عناصر Vulkan المرتبطة بها من الفهرس.</p>
        </div>
      </section>
    `;
  }

  const UNIFIED_TUTORIAL_SECTION_TITLES = new Set([
    'المكوّنات الأساسية',
    'تدفق التنفيذ في إطار واحد',
    'هيكل تطبيقي مبسّط',
    'ما يجب تثبيته قبل الانتقال',
    'الانتقال إلى الدرس التالي'
  ]);

  function slugifyTutorialSectionTitle(title = '') {
    return String(title || '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9_-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      || 'section';
  }

  function createTutorialFieldValue(html = '') {
    const value = global.document.createElement('div');
    value.className = 'tutorial-table-field-value';
    value.innerHTML = html;
    return value;
  }

  function convertTutorialTableToCards(table) {
    if (!table || table.dataset.tutorialCardified === 'true') {
      return;
    }

    const headerCells = Array.from(table.querySelectorAll('thead th'));
    const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
    const fallbackRows = Array.from(table.querySelectorAll(':scope > tr'));
    const headers = headerCells.length
      ? headerCells.map((header) => header.textContent.trim())
      : Array.from((bodyRows[0] || fallbackRows[0])?.querySelectorAll('th') || []).map((header) => header.textContent.trim());
    const rows = bodyRows.length
      ? bodyRows.slice(headers.length ? 1 : 0)
      : fallbackRows.slice(headers.length ? 1 : 0);
    if (!rows.length || headers.length < 2) {
      return;
    }

    const grid = global.document.createElement('div');
    grid.className = 'tutorial-table-card-grid';

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (!cells.length) {
        return;
      }

      const card = global.document.createElement('article');
      card.className = 'tutorial-table-item-card parameter-detail-card';

      const header = global.document.createElement('div');
      header.className = 'tutorial-table-item-header';

      const title = global.document.createElement('h4');
      title.className = 'tutorial-table-item-title';
      title.innerHTML = cells[0]?.innerHTML || '';

      header.appendChild(title);
      card.appendChild(header);

      const fields = global.document.createElement('div');
      fields.className = 'tutorial-table-item-fields';

      cells.slice(1).forEach((cell, index) => {
        const field = global.document.createElement('div');
        field.className = 'tutorial-table-field';

        const label = global.document.createElement('div');
        label.className = 'tutorial-table-field-label';
        label.textContent = headers[index + 1] || `تفصيل ${index + 1}`;

        field.appendChild(label);
        field.appendChild(createTutorialFieldValue(cell.innerHTML || ''));
        fields.appendChild(field);
      });

      card.appendChild(fields);
      grid.appendChild(card);
    });

    table.dataset.tutorialCardified = 'true';
    table.replaceWith(grid);
  }

  function convertTutorialListToCards(list, title = '') {
    if (!list || list.dataset.tutorialCardified === 'true') {
      return;
    }

    const items = Array.from(list.querySelectorAll(':scope > li'));
    if (!items.length) {
      return;
    }

    const grid = global.document.createElement('div');
    const isFlowSection = title === 'تدفق التنفيذ في إطار واحد';
    grid.className = isFlowSection
      ? 'tutorial-list-card-grid tutorial-list-card-grid-flow'
      : 'tutorial-list-card-grid';

    items.forEach((item, index) => {
      const card = global.document.createElement('article');
      card.className = 'tutorial-list-card';

      const badge = global.document.createElement('div');
      badge.className = 'tutorial-list-card-badge';
      badge.textContent = isFlowSection ? `الخطوة ${index + 1}` : `${index + 1}`;

      const body = global.document.createElement('div');
      body.className = 'tutorial-list-card-body';
      body.innerHTML = item.innerHTML || '';

      card.appendChild(badge);
      card.appendChild(body);
      grid.appendChild(card);
    });

    list.dataset.tutorialCardified = 'true';
    list.replaceWith(grid);
  }

  function normalizeTutorialSectionContent(section, title = '') {
    const body = section?.querySelector('.tutorial-section-card-body');
    if (!body) {
      return;
    }

    Array.from(body.children).forEach((child) => {
      if (child.matches?.('table.params-table')) {
        convertTutorialTableToCards(child);
      }

      if (child.matches?.('ul.best-practices-list, ol.best-practices-list')) {
        convertTutorialListToCards(child, title);
      }
    });

    if (title === 'هيكل تطبيقي مبسّط') {
      body.classList.add('tutorial-section-card-body-code');
    }

    if (title === 'الانتقال إلى الدرس التالي') {
      section.classList.add('tutorial-section-card-next-step');
      const firstParagraph = body.querySelector(':scope > p');
      if (firstParagraph) {
        firstParagraph.classList.add('tutorial-next-step-text');
      }
    }
  }

  function normalizeTutorialLessonSections(root = global.document) {
    if (!root?.querySelector) {
      return;
    }

    const tutorialBody = root.querySelector('.tutorial-content .tutorial-body');
    if (!tutorialBody || tutorialBody.dataset.sectionCardsApplied === 'true') {
      return;
    }

    const children = Array.from(tutorialBody.children);
    children.forEach((child) => {
      if (child.tagName !== 'H3') {
        return;
      }

      const title = child.textContent.trim();
      if (!UNIFIED_TUTORIAL_SECTION_TITLES.has(title)) {
        return;
      }

      const section = global.document.createElement('section');
      section.className = `tutorial-section-card parameter-detail-card tutorial-section-${slugifyTutorialSectionTitle(title)}`;
      section.dataset.sectionTitle = title;

      const header = global.document.createElement('div');
      header.className = 'tutorial-section-card-header';

      const heading = global.document.createElement('h3');
      heading.textContent = title;
      header.appendChild(heading);

      const body = global.document.createElement('div');
      body.className = 'tutorial-section-card-body';

      const nodesToMove = [];
      let cursor = child.nextSibling;
      while (cursor) {
        const next = cursor.nextSibling;
        if (cursor.nodeType === global.Node.ELEMENT_NODE && /^H[1-3]$/.test(cursor.tagName)) {
          break;
        }
        nodesToMove.push(cursor);
        cursor = next;
      }

      section.appendChild(header);
      section.appendChild(body);
      child.replaceWith(section);

      nodesToMove.forEach((node) => {
        body.appendChild(node);
      });

      normalizeTutorialSectionContent(section, title);
    });

    tutorialBody.dataset.sectionCardsApplied = 'true';
  }

  function enhanceTutorialExamples(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    root.querySelectorAll('.tutorial-content .code-container').forEach((container) => {
      if (container.dataset.tutorialChunked === 'true') {
        return;
      }

      if (container.nextElementSibling && container.nextElementSibling.classList.contains('explanation-section')) {
        return;
      }

      const code = Array.from(container.querySelectorAll('code')).find((node) => isHighlightableCodeBlock(node));
      if (!code) {
        return;
      }

      const heading = getNearestTutorialHeading(container);
      const rawCode = code.dataset.rawCode || code.textContent || '';
      if (isLargeTutorialExample(rawCode)) {
        const summaryWrapper = global.document.createElement('div');
        summaryWrapper.innerHTML = renderLargeTutorialExampleSummary(heading, rawCode);
        const summarySection = summaryWrapper.firstElementChild;
        if (summarySection) {
          container.insertAdjacentElement('afterend', summarySection);
        }
        return;
      }

      const explanationWrapper = global.document.createElement('div');
      explanationWrapper.innerHTML = api.renderGenericExampleExplanation({
        name: heading,
        description: 'مثال تعليمي من الدرس الحالي لتوضيح الفكرة البرمجية المعروضة.',
        usage: ['هذا المثال جزء من التسلسل التعليمي داخل الدرس، لذلك يُفهم مع الشرح النصي المحيط به.'],
        notes: ['قد يحتاج المثال إلى أجزاء إضافية من الدرس أو من المشروع حتى يعمل داخل برنامج كامل.'],
        example: rawCode
      }, {
        kindLabel: 'مثال تعليمي',
        purpose: `يوضح هذا المثال التعليمي الفكرة المرتبطة بالعنوان: ${heading}.`,
        concepts: [
          'الأمثلة التعليمية في المشروع تركّز على توضيح الفكرة الأساسية تدريجياً، وليس دائماً على تقديم برنامج جاهز بالكامل.',
          'يمكن استخدام الروابط داخل الكود للانتقال إلى شرح الدوال والأنواع والثوابت الظاهرة في المثال.'
        ]
      });

      const section = explanationWrapper.firstElementChild;
      if (section) {
        container.insertAdjacentElement('afterend', section);
      }
    });
  }

  global.__ARABIC_VULKAN_TUTORIAL_SUPPORT__ = {
    configure,
    normalizeTutorialLessonSections,
    prepareTutorialCodeContainers,
    activateTutorialLazyCodeBlocks,
    refreshTutorialCodePresentation,
    renderTutorialInfoGrid,
    renderTutorialLeadMedia,
    openSectionVideoModal,
    closeSectionVideoModal,
    openSectionVideoExternal,
    closeActiveSectionVideoModal,
    closeTutorialVideoModal,
    handleSectionVideoModalBackdrop,
    enhanceTutorialExamples
  };
})(window);
