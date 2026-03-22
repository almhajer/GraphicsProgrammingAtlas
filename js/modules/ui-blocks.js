window.__ARABIC_VULKAN_UI_BLOCKS__ = (() => {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function toTrimmedHtml(value) {
    return String(value ?? '').trim();
  }

  function wrapUnifiedDetailPage(html = '') {
    const normalized = toTrimmedHtml(html);
    if (!normalized) {
      return '';
    }

    return /reference-unified-detail-page/.test(normalized)
      ? normalized
      : `<div class="reference-unified-detail-page">${normalized}</div>`;
  }

  function renderInfoSection(contentHtml = '', options = {}) {
    const html = toTrimmedHtml(contentHtml);
    if (!html) {
      return '';
    }

    const className = ['info-section', options.className].filter(Boolean).join(' ');
    const idAttribute = options.id ? ` id="${escapeAttribute(options.id)}"` : '';
    const extraAttributes = toTrimmedHtml(options.attributes);

    return `
      <section class="${className}"${idAttribute}${extraAttributes ? ` ${extraAttributes}` : ''}>
        ${html}
      </section>
    `;
  }

  function renderSectionCollection(sections = []) {
    if (!Array.isArray(sections) || !sections.length) {
      return '';
    }

    return sections.map((section) => {
      if (!section) {
        return '';
      }

      if (typeof section === 'string') {
        return renderInfoSection(section);
      }

      const html = toTrimmedHtml(section.html ?? section.contentHtml ?? '');
      if (!html) {
        return '';
      }

      return section.wrap === false
        ? html
        : renderInfoSection(html, section);
    }).join('');
  }

  function renderPageHeaderBlock({breadcrumbHtml = '', headingHtml = '', descriptionHtml = '', className = 'page-header'} = {}) {
    const heading = toTrimmedHtml(headingHtml);
    const description = toTrimmedHtml(descriptionHtml);
    const breadcrumb = toTrimmedHtml(breadcrumbHtml);
    if (!heading && !description && !breadcrumb) {
      return '';
    }

    return `
      <div class="${escapeAttribute(className)}">
        ${breadcrumb ? `<nav class="breadcrumb">${breadcrumb}</nav>` : ''}
        ${heading ? `<h1>${heading}</h1>` : ''}
        ${description ? `<p>${description}</p>` : ''}
      </div>
    `;
  }

  function renderExampleIndexLayout({breadcrumbHtml = '', headingHtml = '', descriptionHtml = '', bodyHtml = '', className = 'page-header'} = {}) {
    return wrapUnifiedDetailPage(`
      ${renderPageHeaderBlock({breadcrumbHtml, headingHtml, descriptionHtml, className})}
      ${toTrimmedHtml(bodyHtml)}
    `);
  }

  function renderExampleHeroSection({previewHtml = '', headingHtml = '', descriptionHtml = '', breadcrumbHtml = '', className = ''} = {}) {
    const sectionClassName = ['vulkan-example-hero', className].filter(Boolean).join(' ');

    return `
      <section class="${escapeAttribute(sectionClassName)}">
        <div class="vulkan-example-page-header-preview">
          ${toTrimmedHtml(previewHtml)}
        </div>
        <div class="page-header vulkan-example-page-header">
          ${breadcrumbHtml ? `<nav class="breadcrumb">${toTrimmedHtml(breadcrumbHtml)}</nav>` : ''}
          <div class="vulkan-example-page-header-copy">
            <h1>${toTrimmedHtml(headingHtml)}</h1>
            <p>${toTrimmedHtml(descriptionHtml)}</p>
          </div>
        </div>
      </section>
    `;
  }

  function renderExamplePageLayout({hero = null, heroHtml = '', sections = []} = {}) {
    const resolvedHeroHtml = toTrimmedHtml(heroHtml) || (hero ? renderExampleHeroSection(hero) : '');

    return wrapUnifiedDetailPage(`
      ${resolvedHeroHtml}
      ${renderSectionCollection(sections)}
    `);
  }

  function renderUnifiedExampleOverviewCard({goalHtml = '', extraHtml = '', previewHtml = '', showPreview = true} = {}) {
    const hasPreview = showPreview !== false && toTrimmedHtml(previewHtml);
    const bodyClassName = hasPreview
      ? 'glsl-ready-example-body'
      : 'glsl-ready-example-body glsl-ready-example-body-no-preview';

    return `
      <article class="content-card prose-card glsl-ready-example-card example-unified-overview-card">
        <div class="${bodyClassName}">
          <div class="glsl-ready-example-copy">
            <h4>الهدف منه</h4>
            ${goalHtml || '<p>لا توجد تفاصيل إضافية لهذا المثال حالياً.</p>'}
            ${extraHtml || ''}
          </div>

          ${hasPreview ? previewHtml : ''}
        </div>
      </article>
    `;
  }

  function renderUnifiedExampleSectionCard(title, bodyHtml, className = '') {
    const contentHtml = toTrimmedHtml(bodyHtml);
    if (!contentHtml) {
      return '';
    }

    return `
      <div class="content-card prose-card example-unified-section-card${className ? ` ${escapeAttribute(className)}` : ''}">
        ${title ? `<h4>${escapeHtml(title)}</h4>` : ''}
        ${contentHtml}
      </div>
    `;
  }

  function renderUnifiedExampleSupportCard(title, bodyHtml, className = '') {
    const contentHtml = toTrimmedHtml(bodyHtml);
    if (!contentHtml) {
      return '';
    }

    return `
      <div class="content-card prose-card vulkan-ready-example-support-card example-unified-support-card${className ? ` ${escapeAttribute(className)}` : ''}">
        ${title ? `<h4>${escapeHtml(title)}</h4>` : ''}
        ${contentHtml}
      </div>
    `;
  }

  function renderUnifiedExampleRelatedLinks(linksHtml = '', emptyText = 'لا توجد عناصر مرتبطة إضافية.') {
    return `
      <div class="see-also-links glsl-ready-example-links reference-summary-list reference-summary-list-vertical example-unified-related-links">
        ${toTrimmedHtml(linksHtml) || `<span class="related-link related-link-static">${escapeHtml(emptyText)}</span>`}
      </div>
    `;
  }

  function pickRandomEntries(entries = [], limit = 3) {
    const items = Array.isArray(entries) ? entries.slice() : [];
    if (!limit || items.length <= limit) {
      return items;
    }

    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }

    return items.slice(0, limit);
  }

  function renderLibraryExamplePreviewCard(entry) {
    if (!entry) {
      return '';
    }

    return `
      <article class="content-card prose-card library-example-preview-card">
        <div class="library-example-preview-media">
          ${entry.previewHtml || ''}
        </div>
        <div class="library-example-preview-copy">
          <h3>${escapeHtml(entry.title || '')}</h3>
          <p>${escapeHtml(entry.summary || '')}</p>
          <div class="library-example-preview-actions">
            <a href="#" class="doc-link" onclick="${entry.openAction}; return false;">${escapeHtml(entry.actionLabel || 'عرض المثال')}</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderLibraryExamplePreviewSection(options = {}) {
    const examples = Array.isArray(options.examples) ? options.examples : [];
    if (!examples.length) {
      return '';
    }

    return `
      <section class="category-section library-example-preview-section"${options.sectionId ? ` id="${escapeAttribute(options.sectionId)}"` : ''}>
        <div class="library-example-preview-header">
          <div class="library-example-preview-heading">
            <h2>${escapeHtml(options.title || 'أمثلة')}</h2>
            ${options.intro ? `<p>${escapeHtml(options.intro)}</p>` : ''}
          </div>
          ${options.browseAction ? `<button onclick="${options.browseAction}" class="quick-btn">${escapeHtml(options.browseLabel || 'عرض كل الأمثلة')}</button>` : ''}
        </div>
        <div class="library-example-preview-grid">
          ${examples.map((entry) => renderLibraryExamplePreviewCard(entry)).join('')}
        </div>
      </section>
    `;
  }

  return Object.freeze({
    pickRandomEntries,
    renderExampleHeroSection,
    renderExampleIndexLayout,
    renderExamplePageLayout,
    renderInfoSection,
    renderLibraryExamplePreviewCard,
    renderLibraryExamplePreviewSection,
    renderPageHeaderBlock,
    renderSectionCollection,
    renderUnifiedExampleOverviewCard,
    renderUnifiedExampleRelatedLinks,
    renderUnifiedExampleSectionCard,
    renderUnifiedExampleSupportCard
  });
})();
