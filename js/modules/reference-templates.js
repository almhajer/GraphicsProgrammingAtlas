window.__ARABIC_VULKAN_REFERENCE_TEMPLATES__ = (() => {
  function escapeHtmlWith(api = {}, value) {
    return typeof api.escapeHtml === 'function'
      ? api.escapeHtml(value)
      : String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
  }

  function escapeAttributeWith(api = {}, value) {
    return typeof api.escapeAttribute === 'function'
      ? api.escapeAttribute(value)
      : escapeHtmlWith(api, value);
  }

  function renderEntityIconWith(api = {}, type = 'file', className = 'ui-codicon', label = '') {
    return typeof api.renderEntityIcon === 'function'
      ? api.renderEntityIcon(type, className, label)
      : '';
  }

  function buildRefHash(libraryId = '', kindId = '', slug = '') {
    const parts = ['ref'];
    if (libraryId) parts.push(encodeURIComponent(libraryId));
    if (kindId) parts.push(encodeURIComponent(kindId));
    if (slug) parts.push(encodeURIComponent(slug));
    return `#${parts.join('/')}`;
  }

  function getKindMeta(api = {}, libraryId = '', kindId = '', fallbackLabel = '') {
    const resolved = typeof api.getCanonicalReferenceKindMeta === 'function'
      ? api.getCanonicalReferenceKindMeta(libraryId, kindId)
      : null;
    return resolved || {label: fallbackLabel || 'عنصر مرجعي', plural: 'عناصر مرجعية', icon: 'file'};
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function renderRichText(api = {}, text = '', options = {}) {
    const raw = String(text || '').trim();
    if (!raw) {
      return '';
    }
    return typeof api.renderCanonicalReferenceRichText === 'function'
      ? api.renderCanonicalReferenceRichText(raw, options)
      : escapeHtmlWith(api, raw);
  }

  function resolveRouteDescriptor(api = {}, route = '', label = '') {
    return typeof api.resolveCanonicalReferenceRoute === 'function'
      ? api.resolveCanonicalReferenceRoute(route, label)
      : null;
  }

  function buildRouteInteraction(api = {}, route = '', label = '', fallbackIconType = '') {
    const descriptor = resolveRouteDescriptor(api, route, label);
    const href = descriptor?.href || route || '#';
    const tooltip = String(descriptor?.tooltip || '').trim();
    const tooltipAttr = tooltip
      ? ` data-tooltip="${escapeAttributeWith(api, tooltip)}" tabindex="0" aria-label="${escapeAttributeWith(api, `${label}: ${tooltip.replace(/\n/g, ' - ')}`)}"`
      : '';
    const onclickAttr = descriptor?.action
      ? ` onclick="${descriptor.action}; return false;"`
      : '';

    return {
      href,
      tooltipAttr,
      onclickAttr,
      iconType: descriptor?.iconType || fallbackIconType || 'file'
    };
  }

  function renderReferenceCodeCell(api = {}, value = '', options = {}) {
    const raw = String(value || '').trim();
    if (!raw) {
      return '';
    }

    const rich = renderRichText(api, raw, options);
    if (/<a\b|entity-inline-label|related-link|code-token/.test(rich)) {
      return `<code dir="ltr">${rich}</code>`;
    }

    return `<code dir="ltr">${escapeHtmlWith(api, raw)}</code>`;
  }

  function renderParagraphSection(api = {}, title = '', iconType = 'tutorial', paragraphs = [], options = {}) {
    const normalized = normalizeArray(paragraphs).map((entry) => String(entry || '').trim()).filter(Boolean);
    if (!normalized.length) {
      return '';
    }

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
        <div class="content-card prose-card">
          ${normalized.map((entry) => `<p>${renderRichText(api, entry, options)}</p>`).join('')}
        </div>
      </section>
    `;
  }

  function renderInfoListSection(api = {}, title = '', iconType = 'tutorial', items = [], options = {}) {
    const normalized = normalizeArray(items).map((entry) => String(entry || '').trim()).filter(Boolean);
    if (!normalized.length) {
      return '';
    }

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
        <div class="content-card prose-card reference-section-card">
          <ul class="reference-list">
            ${normalized.map((item) => `<li>${renderRichText(api, item, options)}</li>`).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function renderLinkChip(api = {}, item = {}, options = {}) {
    const label = String(item.name || item.label || item.titleArabic || options.fallbackLabel || '').trim();
    if (!label) {
      return '';
    }

    const descriptor = resolveRouteDescriptor(api, item.route || item.href || '', label);
    const href = descriptor?.href || item.route || item.href || '';
    const tooltip = String(descriptor?.tooltip || item.tooltip || '').trim();
    const tooltipAttr = tooltip
      ? ` data-tooltip="${escapeAttributeWith(api, tooltip)}" tabindex="0" aria-label="${escapeAttributeWith(api, `${label}: ${tooltip.replace(/\n/g, ' - ')}`)}"`
      : '';
    const iconType = descriptor?.iconType || item.iconType || options.iconType || 'file';
    const iconHtml = renderEntityIconWith(api, iconType, 'ui-codicon list-icon', label);
    const content = `${iconHtml}<span>${escapeHtmlWith(api, label)}</span>`;

    if (descriptor?.action) {
      return `<a class="reference-link-chip entity-link-with-icon" href="${escapeAttributeWith(api, href)}"${tooltipAttr} onclick="${descriptor.action}; return false;">${content}</a>`;
    }

    if (href) {
      const isExternal = /^https?:/i.test(href);
      return `<a class="reference-link-chip${isExternal ? '' : ' entity-link-with-icon'}" href="${escapeAttributeWith(api, href)}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}${tooltipAttr}>${content}</a>`;
    }

    return `<span class="reference-link-chip static">${content}</span>`;
  }

  function renderLinkListSection(api = {}, title = '', iconType = 'tutorial', items = []) {
    const normalized = normalizeArray(items);
    if (!normalized.length) {
      return '';
    }

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
        <div class="content-card prose-card reference-section-card">
          <div class="reference-link-grid">
            ${normalized.map((item) => renderLinkChip(api, item)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderKeyValueTable(api = {}, rows = [], title = '', iconType = 'variable', options = {}) {
    const normalized = normalizeArray(rows);
    if (!normalized.length) {
      return '';
    }

    const isCmake = String(options.libraryId || '').trim() === 'cmake';
    const useCmakeParameterCards = isCmake && String(options.detailSection || '').trim() === 'parameters';
    const renderNameCell = (row) => {
      const raw = String(row?.name || '').trim();
      if (!raw) {
        return '';
      }
      if (!isCmake) {
        return renderReferenceCodeCell(api, raw, options);
      }
      return renderRichText(api, raw, options);
    };
    const renderTypeCell = (row) => {
      const raw = String(row?.type || row?.value || '').trim();
      if (!raw) {
        return '';
      }
      if (!isCmake) {
        return renderReferenceCodeCell(api, raw, options);
      }
      return renderRichText(api, raw, options);
    };

    if (useCmakeParameterCards) {
      return `
        <section class="info-section reference-table-card">
          <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
          <div class="reference-detail-card-grid reference-detail-card-grid-cmake-parameters">
            ${normalized.map((row, index) => `
              <article class="content-card prose-card parameter-detail-card reference-detail-card reference-detail-card-cmake-parameter"${typeof api.getCanonicalReferenceDetailAnchorId === 'function' && options.detailSection && row.name ? ` id="${escapeAttributeWith(api, api.getCanonicalReferenceDetailAnchorId(options.detailSection, row.name))}"` : ''}>
                <div class="parameter-card-head">
                  <div class="parameter-card-order">المعامل ${index + 1}</div>
                  <div class="parameter-card-title-wrap">
                    <h3 class="parameter-card-name parameter-card-code">${renderNameCell(row)}</h3>
                    ${String(row?.type || row?.value || '').trim() ? `
                      <div class="parameter-card-type-row">
                        <span class="parameter-card-type-label">النوع / القيمة</span>
                        <div class="parameter-card-type">${renderTypeCell(row)}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
                <div class="parameter-card-fields">
                  <div class="parameter-card-field parameter-card-field-wide">
                    <div class="parameter-card-field-label">المعنى الحقيقي</div>
                    <div class="parameter-card-field-value">${renderRichText(api, row.descriptionArabic || row.description || '', options)}</div>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    return `
      <section class="info-section reference-table-card">
        <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
        <div class="reference-table-shell">
          <table class="reference-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>النوع / القيمة</th>
                <th>المعنى الحقيقي</th>
              </tr>
            </thead>
            <tbody>
              ${normalized.map((row) => `
                <tr${typeof api.getCanonicalReferenceDetailAnchorId === 'function' && options.detailSection && row.name ? ` id="${escapeAttributeWith(api, api.getCanonicalReferenceDetailAnchorId(options.detailSection, row.name))}"` : ''}>
                  <td>${renderNameCell(row)}</td>
                  <td>${renderTypeCell(row)}</td>
                  <td>${renderRichText(api, row.descriptionArabic || row.description || '', options)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function buildOfficialReferenceFallbackSummary(entity = {}) {
    const name = String(entity?.identity?.name || '').trim();
    const libraryId = String(entity?.library?.id || '').trim();
    if (libraryId === 'cmake') {
      const kindId = String(entity?.kind?.id || '').trim();
      if (kindId === 'concepts') {
        return 'ارجع إلى الصفحة الرسمية لهذا المفهوم في CMake عندما تريد ترتيب الشرح الأصلي كما يقدمه الدليل الرسمي، مع العودة إلى هذه الصفحة لفهم المعنى العملي بالعربية.';
      }
      return 'ارجع إلى الصفحة الرسمية لهذا العنصر في CMake عندما تريد الصياغة الأصلية الدقيقة كما تشرحها وثائق CMake ضمن مسار التهيئة أو التوليد أو البناء.';
    }
    return entity?.links?.officialUrl
      ? 'يفيد هذا المرجع عند الحاجة إلى الصياغة الرسمية الكاملة لهذا العنصر خارج الاختصار المحلي للمشروع.'
      : '';
  }

  function renderOfficialReferenceSection(api = {}, entity = {}) {
    const enrichedReferences = normalizeArray(entity.links?.officialReferences)
      .filter((entry) => entry?.href && (entry.label || entry.sourceName));
    const fallbackReferences = [
      entity.links?.officialUrl ? {label: 'المرجع الرسمي', href: entity.links.officialUrl, iconType: 'tutorial'} : null,
      entity.signature?.headerUrl ? {label: 'ملف الترويسة', href: entity.signature.headerUrl, iconType: 'file'} : null
    ].filter(Boolean);
    const references = enrichedReferences.length ? enrichedReferences : fallbackReferences;
    if (!references.length) {
      return '';
    }

    const sourceName = String(entity.links?.officialSourceName || '').trim();
    const sourceLabel = entity.links?.officialSourceLabelArabic || 'المصدر الرسمي';
    const summary = String(entity.links?.officialSummaryArabic || '').trim() || buildOfficialReferenceFallbackSummary(entity);

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, 'tutorial', 'ui-codicon list-icon', 'المرجع الرسمي')} المرجع الرسمي</h2>
        <div class="reference-section-stack">
          ${(summary || sourceName) ? `
            <div class="content-card prose-card reference-section-card">
              ${summary ? `<p>${renderRichText(api, summary, {libraryId: entity.library?.id || '', currentEntity: entity})}</p>` : ''}
              ${sourceName ? `<p><strong>${escapeHtmlWith(api, sourceLabel)}:</strong> ${escapeHtmlWith(api, sourceName)}</p>` : ''}
            </div>
          ` : ''}
          <div class="content-card prose-card reference-section-card">
            <div class="reference-link-grid">
              ${references.map((entry) => renderLinkChip(api, {
                ...entry,
                href: entry.href,
                label: entry.label || entry.sourceName || entry.href,
                iconType: entry.iconType || 'tutorial'
              }, {iconType: entry.iconType || 'tutorial'})).join('')}
            </div>
          </div>
          ${enrichedReferences.length ? `
            <div class="content-card prose-card reference-section-card">
              <ul class="reference-list">
                ${enrichedReferences.map((entry) => `
                  <li>
                    <strong>${escapeHtmlWith(api, entry.label || entry.sourceName || '')}:</strong>
                    ${renderRichText(api, entry.noteArabic || 'رابط رسمي مباشر لهذا العنصر.', {libraryId: entity.library?.id || '', currentEntity: entity})}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }

  function renderSummaryGrid(api = {}, entity = {}) {
    const cards = [
      ['الترجمة الفعلية', entity.summary?.actualTranslationArabic || ''],
      ['المعنى الحقيقي', entity.summary?.actualMeaningArabic || ''],
      ['لماذا وُجد', entity.summary?.purposeArabic || ''],
      ['لماذا يستخدمه المبرمج', entity.summary?.whyUseArabic || ''],
      ['الأثر العملي', entity.summary?.carriedValueArabic || '']
    ].filter((entry) => entry[1]);
    if (!cards.length) {
      return '';
    }

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, 'tutorial', 'ui-codicon list-icon', 'الخلاصة')} الخلاصة الدلالية</h2>
        <div class="reference-summary-grid reference-semantic-summary-grid">
          ${cards.map(([label, value], index) => `
            <article class="content-card prose-card parameter-detail-card reference-summary-card reference-semantic-summary-card">
              <div class="parameter-card-head">
                <div class="parameter-card-order">الخلاصة ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name">${escapeHtmlWith(api, label)}</h3>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">الشرح</div>
                  <div class="parameter-card-field-value">${renderRichText(api, value, {libraryId: entity.library?.id || ''})}</div>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function buildReferenceEntitySubtitle(entity = {}) {
    return String(
      entity.identity?.titleArabic
      || entity.summary?.actualMeaningArabic
      || entity.summary?.actualTranslationArabic
      || entity.identity?.name
      || ''
    ).trim();
  }

  function inferReferenceCodeLanguage(entity = {}) {
    const libraryId = String(entity.library?.id || '').trim();
    if (libraryId === 'cmake') {
      return 'cmake';
    }
    if (libraryId === 'glslang') {
      return 'glsl';
    }
    if (/^sdl3(?:-|$)/.test(libraryId)) {
      return 'c';
    }
    return 'cpp';
  }

  function renderCodeSection(api = {}, title = '', rawCode = '', entity = {}, iconType = 'command') {
    const code = String(rawCode || '').trim();
    if (!code) {
      return '';
    }

    const codeDataAttributes = entity.library?.id === 'cmake'
      ? {
        'reference-library': entity.library?.id || '',
        'reference-kind': entity.kind?.id || '',
        'reference-name': entity.identity?.name || '',
        'reference-parameters': JSON.stringify(entity.details?.parameters || [])
      }
      : null;

    if (typeof api.renderDocCodeContainer === 'function') {
      return `
        <section class="info-section">
          <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
          ${api.renderDocCodeContainer({
            titleHtml: `${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}`,
            rawCode: code,
            language: inferReferenceCodeLanguage(entity),
            containerClassName: 'reference-code-shell',
            codeDataAttributes,
            allowCopy: true,
            allowToggle: true
          })}
        </section>
      `;
    }

    return `
      <section class="info-section">
        <h2>${renderEntityIconWith(api, iconType, 'ui-codicon list-icon', title)} ${escapeHtmlWith(api, title)}</h2>
        <pre class="reference-code-block"><code class="language-${escapeAttributeWith(api, inferReferenceCodeLanguage(entity))}" dir="ltr">${escapeHtmlWith(api, code)}</code></pre>
      </section>
    `;
  }

  function renderPageHeader(api = {}, config = {}) {
    const breadcrumbs = normalizeArray(config.breadcrumbs);
    return `
      <div class="page-header">
        ${breadcrumbs.length ? `
          <nav class="breadcrumb">
            ${breadcrumbs.map((entry, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const label = escapeHtmlWith(api, entry.label || '');
              if (isLast || !entry.href) {
                return `<span>${label}</span>`;
              }
              return `<a href="${escapeAttributeWith(api, entry.href)}">${label}</a>`;
            }).join(' / ')}
          </nav>
        ` : ''}
        ${config.metaHtml ? `<div class="reference-inline-meta">${config.metaHtml}</div>` : ''}
        <h1 class="page-title"${config.dir ? ` dir="${escapeAttributeWith(api, config.dir)}"` : ''}>${config.iconHtml || ''} ${escapeHtmlWith(api, config.title || '')}</h1>
        ${config.description ? `<p class="page-description">${renderRichText(api, config.description, config.richTextOptions || {})}</p>` : ''}
      </div>
    `;
  }

  function renderHub(manifest = {}, api = {}) {
    return `
      ${renderPageHeader(api, {
        title: 'المرجع المعياري',
        description: 'طبقة مرجعية موحدة تعيد استخدام نفس القوالب والأدوات البصرية داخل المشروع بحسب المكتبة ثم النوع ثم العنصر.',
        iconHtml: renderEntityIconWith(api, 'file', 'ui-codicon page-icon', 'المرجع المعياري')
      })}
      <section class="reference-library-grid">
        ${normalizeArray(manifest.libraries).map((library) => {
          const routeInfo = buildRouteInteraction(api, library.route, library.displayNameArabic || library.displayName, 'file');
          return `
            <article class="item-card reference-library-card">
              <h2>${renderEntityIconWith(api, 'file', 'ui-codicon card-icon', library.displayNameArabic || library.displayName)} ${escapeHtmlWith(api, library.displayNameArabic || library.displayName)}</h2>
              <p>${renderRichText(api, library.description || '')}</p>
              <div class="reference-inline-meta">
                <span>العناصر: ${escapeHtmlWith(api, String(library.totalCount || 0))}</span>
                <span>الأقسام: ${escapeHtmlWith(api, String((library.kinds || []).length))}</span>
              </div>
              <a class="quick-btn primary" href="${escapeAttributeWith(api, routeInfo.href)}"${routeInfo.tooltipAttr}${routeInfo.onclickAttr}>فتح المكتبة</a>
            </article>
          `;
        }).join('')}
      </section>
    `;
  }

  function renderLibraryIndex(indexData = {}, api = {}) {
    const libraryLabel = indexData.library?.displayNameArabic || indexData.library?.displayName || '';
    return `
      ${renderPageHeader(api, {
        breadcrumbs: [
          {label: 'المرجع المعياري', href: '#ref'},
          {label: libraryLabel}
        ],
        title: libraryLabel,
        description: indexData.library?.description || '',
        iconHtml: renderEntityIconWith(api, 'file', 'ui-codicon page-icon', libraryLabel)
      })}
      <section class="reference-library-grid">
        ${normalizeArray(indexData.kinds).map((kind) => {
          const kindMeta = getKindMeta(api, indexData.library?.id || '', kind.id || '', kind.displayNameArabic || kind.displayName || '');
          const routeInfo = buildRouteInteraction(api, kind.route, kind.displayNameArabic || kind.displayName || '', kindMeta.icon);
          return `
            <article class="item-card reference-library-card">
              <h2>${renderEntityIconWith(api, kindMeta.icon, 'ui-codicon card-icon', kind.displayNameArabic || kind.displayName)} ${escapeHtmlWith(api, kind.displayNameArabic || kind.displayName || '')}</h2>
              <p>${renderRichText(api, kind.description || '')}</p>
              <div class="reference-inline-meta">
                <span>العناصر: ${escapeHtmlWith(api, String(kind.count || 0))}</span>
              </div>
              <a class="quick-btn primary" href="${escapeAttributeWith(api, routeInfo.href)}"${routeInfo.tooltipAttr}${routeInfo.onclickAttr}>فتح القسم</a>
            </article>
          `;
        }).join('')}
      </section>
    `;
  }

  function renderKindIndex(indexData = {}, api = {}) {
    const libraryId = indexData.library?.id || '';
    const kindId = indexData.kind?.id || '';
    const kindLabel = indexData.kind?.displayNameArabic || indexData.kind?.displayName || '';
    const kindMeta = getKindMeta(api, libraryId, kindId, kindLabel);

    return `
      ${renderPageHeader(api, {
        breadcrumbs: [
          {label: 'المرجع المعياري', href: '#ref'},
          {label: indexData.library?.displayNameArabic || indexData.library?.displayName || '', href: indexData.routes?.library || buildRefHash(libraryId)},
          {label: kindLabel}
        ],
        title: kindLabel,
        description: indexData.kind?.description || '',
        iconHtml: renderEntityIconWith(api, kindMeta.icon, 'ui-codicon page-icon', kindLabel)
      })}
      ${normalizeArray(indexData.groups).map((group) => `
        <section class="info-section">
          <h2>${renderEntityIconWith(api, kindMeta.icon, 'ui-codicon list-icon', group.letter)} ${escapeHtmlWith(api, group.letter)}</h2>
          <div class="reference-item-grid">
            ${normalizeArray(group.items).map((item) => {
              const routeInfo = buildRouteInteraction(api, item.route || '#', item.name || '', kindMeta.icon);
              return `
                <article class="item-card reference-item-card">
                  <h3>
                    ${renderEntityIconWith(api, routeInfo.iconType || kindMeta.icon, 'ui-codicon card-icon', item.name || '')}
                    <a href="${escapeAttributeWith(api, routeInfo.href)}"${routeInfo.tooltipAttr}${routeInfo.onclickAttr}>${escapeHtmlWith(api, item.name || '')}</a>
                  </h3>
                  ${item.titleArabic ? `<p class="reference-ar-title">${escapeHtmlWith(api, item.titleArabic)}</p>` : ''}
                  <p>${renderRichText(api, item.shortDescription || '')}</p>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      `).join('')}
    `;
  }

  function renderEntityPage(entity = {}, api = {}) {
    const libraryId = entity.library?.id || '';
    const kindId = entity.kind?.id || '';
    const kindLabel = entity.kind?.displayNameArabic || entity.kind?.displayName || '';
    const kindMeta = getKindMeta(api, libraryId, kindId, kindLabel);
    const richTextOptions = {libraryId, currentEntity: entity};
    const subtitle = buildReferenceEntitySubtitle(entity);
    const isCmakeConceptPage = libraryId === 'cmake' && kindId === 'concepts';
    const pageTitle = isCmakeConceptPage
      ? (entity.identity?.titleArabic || subtitle || entity.identity?.name || '')
      : (entity.identity?.name || '');
    const pageDescription = isCmakeConceptPage
      ? (entity.identity?.name ? `الاسم المرجعي في CMake: (${entity.identity.name})` : '')
      : subtitle;
    const pageTitleDir = isCmakeConceptPage ? 'rtl' : 'ltr';
    const officialUrl = entity.links?.officialUrl || '';
    const infoCards = [
      {
        label: 'نوع العنصر',
        value: `${renderEntityIconWith(api, kindMeta.icon, 'ui-codicon list-icon', kindMeta.label)} ${escapeHtmlWith(api, kindMeta.label || kindLabel || 'عنصر مرجعي')}`,
        note: 'يُعرض هذا النوع بنفس منطق الأيقونات والتصنيف المستخدم في بقية المشروع.'
      },
      {
        label: 'المكتبة',
        value: `${renderEntityIconWith(api, 'file', 'ui-codicon list-icon', entity.library?.displayNameArabic || entity.library?.displayName || '')} ${escapeHtmlWith(api, entity.library?.displayNameArabic || entity.library?.displayName || '')}`,
        note: 'هذه الصفحة تتبع نفس عائلة العرض العامة، لكن بمحتوى خاص بهذه المكتبة.'
      },
      {
        label: 'الاسم الرسمي',
        value: `<span dir="ltr">${renderRichText(api, entity.identity?.name || '', richTextOptions)}</span>`,
        note: renderRichText(api, subtitle || '', richTextOptions)
      },
      officialUrl ? {
        label: 'المرجع الرسمي',
        value: `<a class="doc-link" href="${escapeAttributeWith(api, officialUrl)}" target="_blank" rel="noopener noreferrer">افتح صفحة CMake الرسمية</a>`,
        note: 'الرابط الخارجي هو المرجع الرسمي المقصود للمراجعة الدقيقة، لا مسار ملفات داخلي من المشروع.'
      } : null
    ].filter(Boolean);

    const behaviorItems = [
      ...(entity.details?.usage || []),
      ...(entity.details?.notes || []),
      ...(entity.details?.remarks || [])
    ];
    const guidanceItems = [
      ...(entity.details?.instructions || []),
      entity.details?.returns ? `العائد أو النتيجة: ${entity.details.returns}` : '',
      entity.details?.threadSafety ? `سلامة الخيوط: ${entity.details.threadSafety}` : ''
    ].filter(Boolean);

    return `
      ${renderPageHeader(api, {
        breadcrumbs: [
          {label: 'المرجع المعياري', href: '#ref'},
          {label: entity.library?.displayNameArabic || entity.library?.displayName || '', href: buildRefHash(libraryId)},
          {label: kindLabel, href: buildRefHash(libraryId, kindId)},
          {label: entity.identity?.name || ''}
        ],
        metaHtml: `
          <span>${escapeHtmlWith(api, entity.library?.displayName || '')}</span>
          <span>${escapeHtmlWith(api, kindLabel)}</span>
        `,
        title: pageTitle,
        dir: pageTitleDir,
        description: pageDescription,
        richTextOptions,
        iconHtml: renderEntityIconWith(api, kindMeta.icon, 'ui-codicon page-icon', entity.identity?.name || '')
      })}
      ${typeof api.renderTutorialInfoGrid === 'function' ? `
        <section class="info-section">
          ${api.renderTutorialInfoGrid(infoCards)}
        </section>
      ` : ''}
      ${renderSummaryGrid(api, entity)}
      ${renderCodeSection(api, 'التوقيع أو الصياغة', entity.signature?.raw || '', entity, kindMeta.icon)}
      ${renderKeyValueTable(api, entity.details?.parameters || [], 'معاملات العنصر', 'variable', {...richTextOptions, detailSection: 'parameters'})}
      ${renderKeyValueTable(api, entity.details?.fields || [], 'الحقول أو الأعضاء', 'structure', {...richTextOptions, detailSection: 'fields'})}
      ${renderKeyValueTable(api, entity.details?.values || [], 'القيم التابعة', 'constant', {...richTextOptions, detailSection: 'values'})}
      ${renderParagraphSection(api, 'شرح المعنى العملي', 'tutorial', [
        entity.summary?.actualMeaningArabic || '',
        entity.summary?.carriedValueArabic || ''
      ], richTextOptions)}
      ${renderInfoListSection(api, 'ملاحظات التنفيذ', 'tutorial', behaviorItems, richTextOptions)}
      ${renderInfoListSection(api, 'إرشادات الاستخدام', 'tutorial', guidanceItems, richTextOptions)}
      ${renderLinkListSection(api, 'عناصر مرتبطة', kindMeta.icon, entity.links?.related || [])}
      ${renderCodeSection(api, 'مثال الاستخدام', entity.details?.example || '', entity, kindMeta.icon)}
      ${renderOfficialReferenceSection(api, entity)}
    `;
  }

  return {
    renderHub,
    renderLibraryIndex,
    renderKindIndex,
    renderEntityPage,
    buildRefHash
  };
})();
