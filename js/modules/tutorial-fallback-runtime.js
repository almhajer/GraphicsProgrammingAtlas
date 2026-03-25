window.__ARABIC_VULKAN_TUTORIAL_FALLBACK_RUNTIME__ = (() => {
  function createTutorialFallbackRuntime(api = {}) {
    const {escapeAttribute, escapeHtml, renderSdl3PracticalText} = api;

    function renderFallbackInfoGrid(items = [], renderValue = (value) => value) {
      if (!Array.isArray(items) || !items.length) {
        return '';
      }
      return `
        <div class="info-grid">
          ${items.map((item) => `
            <div class="content-card prose-card">
              <div class="info-label">${item.label || ''}</div>
              <div class="info-value">${renderValue(item.value)}</div>
              ${item.note ? `<p>${renderValue(item.note)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    function renderFallbackDocCodeContainer({
      titleHtml = '',
      rawCode = '',
      renderedCodeHtml = '',
      language = 'cpp',
      containerClassName = '',
      preClassName = '',
      codeClassName = '',
      codeDataAttributes = null,
      skipHighlight = false
    } = {}) {
      const normalizedLanguage = String(language || 'code').toLowerCase();
      const containerClasses = ['code-container', containerClassName].filter(Boolean).join(' ');
      const preClasses = ['code-block', preClassName].filter(Boolean).join(' ');
      const codeClasses = [`language-${normalizedLanguage}`, codeClassName].filter(Boolean).join(' ');
      const codeMarkup = renderedCodeHtml || escapeHtml(rawCode || '');
      const extraCodeAttributes = Object.entries(codeDataAttributes || {})
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => ` data-${escapeAttribute(String(key))}="${escapeAttribute(String(value))}"`)
        .join('');
      const collapseLabel = 'طي الكود';
      return `
        <div class="${escapeAttribute(containerClasses)}">
          <div class="code-toolbar">
            <div class="code-toolbar-title">${titleHtml}</div>
            <div class="code-actions">
              <span class="code-language">${escapeHtml(String(language || 'code').toUpperCase())}</span>
              <button type="button" onclick="toggleCodeBlock(this)" class="code-action-btn" data-expanded-label="${escapeAttribute(collapseLabel)}" data-collapsed-label="إظهار الكود" aria-expanded="true">طي الكود</button>
              <button type="button" onclick="copyCode(this)" class="code-action-btn" data-default-label="نسخ الكود">نسخ الكود</button>
            </div>
          </div>
          <pre class="${escapeAttribute(preClasses)}"><code dir="ltr" class="${escapeAttribute(codeClasses)}" data-raw-code="${escapeAttribute(rawCode || '')}"${skipHighlight ? ' data-skip-highlight="true"' : ''}${extraCodeAttributes}>${codeMarkup}</code></pre>
        </div>
      `;
    }

    function fallbackRenderTutorialList(items = [], ordered = false) {
      if (!Array.isArray(items) || !items.length) {
        return '';
      }
      const tag = ordered ? 'ol' : 'ul';
      return `
        <${tag} class="best-practices-list">
          ${items.map((item) => `<li>${item}</li>`).join('')}
        </${tag}>
      `;
    }

    function fallbackRenderTutorialInfoGrid(items = []) {
      return renderFallbackInfoGrid(items);
    }

    function fallbackRenderTutorialTable(headers = [], rows = []) {
      return `
        <table class="params-table">
          <thead>
            <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      `;
    }

    function fallbackRenderTutorialCodeBlock(label, code, language = 'cpp') {
      return renderFallbackDocCodeContainer({
        titleHtml: `<span>${label || 'الكود'}</span>`,
        rawCode: code,
        language,
        containerClassName: 'example-section tutorial-example-section'
      });
    }

    function fallbackRenderDocCodeContainer(options = {}) {
      return renderFallbackDocCodeContainer(options);
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

    function fallbackRenderSdl3InfoGridRichText(text) {
      const raw = String(text || '').trim();
      if (!raw) {
        return '';
      }
      return renderSdl3PracticalText(raw, raw);
    }

    function fallbackRenderSdl3InfoGrid(items = []) {
      return renderFallbackInfoGrid(items, fallbackRenderSdl3InfoGridRichText);
    }

    return Object.freeze({
      renderFallbackInfoGrid,
      renderFallbackDocCodeContainer,
      fallbackRenderTutorialList,
      fallbackRenderTutorialInfoGrid,
      fallbackRenderTutorialTable,
      fallbackRenderTutorialCodeBlock,
      fallbackRenderDocCodeContainer,
      fallbackSplitCodeIntoLineChunks,
      fallbackRenderSdl3InfoGridRichText,
      fallbackRenderSdl3InfoGrid
    });
  }

  return Object.freeze({
    createTutorialFallbackRuntime
  });
})();
