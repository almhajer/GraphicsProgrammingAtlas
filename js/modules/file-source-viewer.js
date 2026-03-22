(function (global) {
  const PASSIVE_SCROLL_CAPTURE_OPTIONS = {capture: true, passive: true};
  const fileContentCache = new Map();
  const fileSourceManifestCache = new Map();
  const fileSourceChunkCache = new Map();

  const api = {
    getFileReferenceData: () => ({}),
    splitCodeIntoLineChunks: null,
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || ''),
    highlightCode: () => {}
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

  function getStaticFilePageUrl(fileName) {
    return `pages/files/${encodeURIComponent(fileName)}.html`;
  }

  function getFileSourceManifestUrl(fileName) {
    return `pages/files/${encodeURIComponent(fileName)}.manifest.json`;
  }

  function getFileSourceChunkUrl(fileName, chunkIndex) {
    return `pages/files/${encodeURIComponent(fileName)}--section-${chunkIndex + 1}.json`;
  }

  function inferFileSourceLanguage(fileName) {
    const normalized = String(fileName || '').toLowerCase();
    if (normalized.endsWith('.cmake') || normalized === 'cmakelists.txt') {
      return 'cmake';
    }
    if (normalized.endsWith('.sh') || normalized.endsWith('.bash')) {
      return 'bash';
    }
    return 'cpp';
  }

  function getServedFileRelativePath(fileName) {
    const file = api.getFileReferenceData()[fileName];
    if (!file) {
      return '';
    }

    return file.sectionKey === 'utility'
      ? `sdk_include/vulkan/utility/${fileName}`
      : `sdk_include/vulkan/${fileName}`;
  }

  async function loadFileSource(fileName) {
    if (fileContentCache.has(fileName)) {
      return fileContentCache.get(fileName);
    }

    const sourcePath = getServedFileRelativePath(fileName);
    if (!sourcePath) {
      throw new Error('تعذر تحديد مسار الملف.');
    }

    const response = await global.fetch(sourcePath);
    if (!response.ok) {
      throw new Error(`فشل تحميل محتوى الملف: ${response.status}`);
    }

    const text = await response.text();
    fileContentCache.set(fileName, text);
    return text;
  }

  async function loadFileSourceManifest(fileName) {
    if (fileSourceManifestCache.has(fileName)) {
      return fileSourceManifestCache.get(fileName);
    }

    try {
      const response = await global.fetch(getFileSourceManifestUrl(fileName));
      if (!response.ok) {
        throw new Error(`فشل تحميل فهرس الملف: ${response.status}`);
      }

      const manifest = await response.json();
      fileSourceManifestCache.set(fileName, manifest);
      return manifest;
    } catch (error) {
      const sourceText = await loadFileSource(fileName);
      const chunks = splitCodeIntoLineChunks(sourceText, 180).map((chunk, index) => {
        fileSourceChunkCache.set(`${fileName}::${index}`, chunk.code);
        return {
          index,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          lineCount: chunk.endLine - chunk.startLine + 1
        };
      });

      const totalBytes = global.TextEncoder
        ? new global.TextEncoder().encode(sourceText).length
        : sourceText.length;
      const manifest = {
        fileName,
        lineCount: sourceText.split(/\r?\n/).length,
        totalBytes,
        chunks
      };

      fileSourceManifestCache.set(fileName, manifest);
      return manifest;
    }
  }

  async function loadFileSourceChunk(fileName, chunkIndex) {
    const cacheKey = `${fileName}::${chunkIndex}`;
    if (fileSourceChunkCache.has(cacheKey)) {
      return fileSourceChunkCache.get(cacheKey);
    }

    try {
      const response = await global.fetch(getFileSourceChunkUrl(fileName, chunkIndex));
      if (!response.ok) {
        throw new Error(`فشل تحميل مقطع الملف: ${response.status}`);
      }

      const payload = await response.json();
      const content = String(payload?.content || '');
      fileSourceChunkCache.set(cacheKey, content);
      return content;
    } catch (error) {
      const sourceText = await loadFileSource(fileName);
      const chunks = splitCodeIntoLineChunks(sourceText, 180);
      const fallbackChunk = chunks[chunkIndex]?.code || '';
      fileSourceChunkCache.set(cacheKey, fallbackChunk);
      return fallbackChunk;
    }
  }

  function renderLazyFileSourceSection(fileName) {
    return `
      <section class="info-section lazy-file-source-viewer" data-file-name="${api.escapeAttribute(fileName)}">
        <h2>💻 الكود الحقيقي للملف</h2>
        <div class="content-card prose-card">
          <p>يعرض هذا القسم المصدر الفعلي للملف مع تلوين نحوي وروابط داخلية للعناصر المعروفة.</p>
          <p>يُحمَّل الكود تدريجياً أثناء التمرير مع ترقيم أسطر تلقائي على الحافة اليسرى.</p>
        </div>
        <div class="file-source-viewer-body">
          <div class="file-chunk-placeholder">
            <p>سيُجهَّز عارض الكود عند الوصول إلى هذا القسم.</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderFileSourceManifestHtml(fileName, manifest) {
    const chunks = Array.isArray(manifest?.chunks) ? manifest.chunks : [];

    return `
      <div class="file-source-chunk-list">
        ${chunks.map((chunk, index) => `
          <section
            class="file-source-chunk"
            data-file-name="${api.escapeAttribute(fileName)}"
            data-chunk-index="${index}"
            data-start-line="${chunk.startLine}">
            <div class="file-source-chunk-body">
              <div class="file-chunk-placeholder">
                <p>${index === 0 ? 'جاري تجهيز بداية الملف...' : 'سيظهر مزيد من الكود تلقائياً أثناء التمرير.'}</p>
              </div>
            </div>
          </section>
        `).join('')}
      </div>
    `;
  }

  function buildFileSourceLineNumberRows(startLine, lineCount) {
    const safeStartLine = Math.max(1, Number(startLine) || 1);
    const safeLineCount = Math.max(1, Number(lineCount) || 1);

    return `
      <div class="file-source-line-numbers" aria-hidden="true" style="counter-reset: file-line ${safeStartLine - 1};">
        ${Array.from({length: safeLineCount}, () => '<span></span>').join('')}
      </div>
    `;
  }

  async function renderFileSourceChunk(chunkElement) {
    if (!chunkElement || chunkElement.dataset.rendered === 'true') {
      return;
    }

    const fileName = chunkElement.dataset.fileName;
    const chunkIndex = Number(chunkElement.dataset.chunkIndex);
    const body = chunkElement.querySelector('.file-source-chunk-body');

    if (!fileName || Number.isNaN(chunkIndex) || !body) {
      return;
    }

    if (chunkElement.dataset.loading === 'true') {
      return;
    }

    chunkElement.dataset.loading = 'true';
    body.innerHTML = `
      <div class="file-chunk-placeholder">
        <p>جاري تحميل الكود وتطبيق التلوين...</p>
      </div>
    `;

    try {
      const code = await loadFileSourceChunk(fileName, chunkIndex);
      const language = inferFileSourceLanguage(fileName);
      const startLine = Math.max(1, Number(chunkElement.dataset.startLine) || 1);
      const lineCount = Math.max(1, String(code || '').split(/\r?\n/).length);

      body.innerHTML = `
        <div class="code-container file-source-code-container">
          <div class="file-source-code-shell">
            ${buildFileSourceLineNumberRows(startLine, lineCount)}
            <pre class="code-block"><code class="language-${language}" data-raw-code="${api.escapeAttribute(code)}">${api.escapeHtml(code)}</code></pre>
          </div>
        </div>
      `;

      chunkElement.dataset.rendered = 'true';
      api.highlightCode(body);
    } catch (error) {
      console.error('Failed to render file source chunk:', fileName, chunkIndex, error);
      body.innerHTML = `
        <div class="file-chunk-placeholder">
          <p>تعذر تحميل هذا المقطع حالياً.</p>
        </div>
      `;
    } finally {
      delete chunkElement.dataset.loading;
    }
  }

  function initFileSourceChunkRendering(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    const chunkElements = Array.from(root.querySelectorAll('.file-source-chunk'));
    if (!chunkElements.length) {
      return;
    }

    const loadVisibleChunks = async () => {
      let remaining = 0;

      for (const chunkElement of chunkElements) {
        if (chunkElement.dataset.rendered === 'true') {
          continue;
        }

        remaining += 1;
        const rect = chunkElement.getBoundingClientRect();
        const withinReach = rect.top < global.innerHeight + 340 && rect.bottom > -220;
        if (withinReach) {
          await renderFileSourceChunk(chunkElement);
        }
      }

      return remaining;
    };

    chunkElements.slice(0, 2).forEach((chunkElement) => {
      void renderFileSourceChunk(chunkElement);
    });

    if (typeof global.IntersectionObserver !== 'function') {
      const lazyPass = async () => {
        const remaining = await loadVisibleChunks();
        if (!remaining) {
          global.removeEventListener('scroll', lazyPass, true);
          global.removeEventListener('resize', lazyPass, true);
        }
      };

      global.addEventListener('scroll', lazyPass, PASSIVE_SCROLL_CAPTURE_OPTIONS);
      global.addEventListener('resize', lazyPass, true);
      void lazyPass();
      return;
    }

    const observer = new global.IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const chunkElement = entry.target;
        void renderFileSourceChunk(chunkElement).finally(() => {
          obs.unobserve(chunkElement);
        });
      });
    }, {
      rootMargin: '320px 0px'
    });

    chunkElements.forEach((chunkElement, index) => {
      if (index >= 2) {
        observer.observe(chunkElement);
      }
    });

    const fallbackScan = async () => {
      const remaining = await loadVisibleChunks();
      if (!remaining) {
        global.removeEventListener('scroll', fallbackScan, true);
        global.removeEventListener('resize', fallbackScan, true);
        observer.disconnect();
      }
    };

    global.addEventListener('scroll', fallbackScan, PASSIVE_SCROLL_CAPTURE_OPTIONS);
    global.addEventListener('resize', fallbackScan, true);
    global.requestAnimationFrame(() => {
      void fallbackScan();
    });
  }

  async function loadLazyFileSourceViewer(section) {
    if (!section || section.dataset.loaded === 'true' || section.dataset.loading === 'true') {
      return;
    }

    const fileName = section.dataset.fileName;
    const body = section.querySelector('.file-source-viewer-body');
    if (!fileName || !body) {
      return;
    }

    section.dataset.loading = 'true';
    body.innerHTML = `
      <div class="file-chunk-placeholder">
        <p>جاري تجهيز فهرس المقاطع وتحميل وصف العرض...</p>
      </div>
    `;

    try {
      const manifest = await loadFileSourceManifest(fileName);
      body.innerHTML = renderFileSourceManifestHtml(fileName, manifest);
      section.dataset.loaded = 'true';
      initFileSourceChunkRendering(section);
    } catch (error) {
      console.error('Failed to load file source viewer:', fileName, error);
      body.innerHTML = `
        <div class="file-chunk-placeholder">
          <p>تعذر تحميل عارض الكود لهذا الملف.</p>
        </div>
      `;
    } finally {
      delete section.dataset.loading;
    }
  }

  function initLazyFileSourceViewers(root = global.document) {
    if (!root?.querySelectorAll) {
      return;
    }

    const sections = Array.from(root.querySelectorAll('.lazy-file-source-viewer'));
    if (!sections.length) {
      return;
    }

    const loadIfNearViewport = async () => {
      let remaining = 0;

      for (const section of sections) {
        if (section.dataset.loaded === 'true') {
          continue;
        }

        remaining += 1;
        const rect = section.getBoundingClientRect();
        const withinReach = rect.top < global.innerHeight + 280 && rect.bottom > -180;
        if (withinReach) {
          await loadLazyFileSourceViewer(section);
        }
      }

      return remaining;
    };

    if (typeof global.IntersectionObserver !== 'function') {
      const lazyPass = async () => {
        const remaining = await loadIfNearViewport();
        if (!remaining) {
          global.removeEventListener('scroll', lazyPass, true);
          global.removeEventListener('resize', lazyPass, true);
        }
      };

      global.addEventListener('scroll', lazyPass, PASSIVE_SCROLL_CAPTURE_OPTIONS);
      global.addEventListener('resize', lazyPass, true);
      void lazyPass();
      return;
    }

    const observer = new global.IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const section = entry.target;
        void loadLazyFileSourceViewer(section).finally(() => {
          obs.unobserve(section);
        });
      });
    }, {
      rootMargin: '240px 0px'
    });

    sections.forEach((section) => {
      if (section.dataset.loaded !== 'true') {
        observer.observe(section);
      }
    });

    const fallbackScan = async () => {
      const remaining = await loadIfNearViewport();
      if (!remaining) {
        global.removeEventListener('scroll', fallbackScan, true);
        global.removeEventListener('resize', fallbackScan, true);
        observer.disconnect();
      }
    };

    global.addEventListener('scroll', fallbackScan, PASSIVE_SCROLL_CAPTURE_OPTIONS);
    global.addEventListener('resize', fallbackScan, true);
    global.requestAnimationFrame(() => {
      void fallbackScan();
    });
  }

  global.__ARABIC_VULKAN_FILE_SOURCE_VIEWER__ = {
    configure,
    getStaticFilePageUrl,
    getServedFileRelativePath,
    renderLazyFileSourceSection,
    initLazyFileSourceViewers
  };
})(window);
