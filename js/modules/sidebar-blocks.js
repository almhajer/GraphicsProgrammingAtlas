window.__ARABIC_VULKAN_SIDEBAR_BLOCKS__ = (() => {
  function getActivationAttrs(enabled = true) {
    if (!enabled || typeof window.buildSidebarNavItemActivationAttrs !== 'function') {
      return '';
    }

    return window.buildSidebarNavItemActivationAttrs();
  }

  function renderSidebarNavItem({
    navType = '',
    navName = '',
    label = '',
    iconHtml = '',
    tooltip = '',
    ariaLabel = '',
    className = 'nav-item',
    extraAttributes = '',
    activation = true
  } = {}) {
    const attrs = [
      `class="${window.escapeAttribute(className)}"`,
      `data-nav-type="${window.escapeAttribute(navType)}"`,
      `data-nav-name="${window.escapeAttribute(navName)}"`,
      tooltip ? `data-tooltip="${window.escapeAttribute(tooltip)}"` : '',
      ariaLabel ? `aria-label="${window.escapeAttribute(ariaLabel)}"` : '',
      'tabindex="0"',
      'role="button"',
      getActivationAttrs(activation),
      String(extraAttributes || '').trim()
    ].filter(Boolean).join(' ');

    return `
      <div ${attrs}>
        <span>${iconHtml}</span>
        <span>${window.escapeHtml(label)}</span>
      </div>
    `;
  }

  function renderSidebarSectionShell({
    className = '',
    isExpanded = false,
    onToggle = '',
    headingHtml = '',
    sectionId = '',
    bodyHtml = ''
  } = {}) {
    const sectionClasses = ['nav-section'];
    if (className) {
      sectionClasses.push(className);
    }
    if (!isExpanded) {
      sectionClasses.push('collapsed');
    }

    return `
      <div class="${window.escapeAttribute(sectionClasses.join(' '))}">
        <div class="nav-section-header" onclick="${onToggle}">
          ${headingHtml}
          <span class="icon">▼</span>
        </div>
        <div id="${window.escapeAttribute(sectionId)}" class="nav-items">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  function renderSidebarExampleGroup({
    className = '',
    dataAttributeName = '',
    dataAttributeValue = '',
    isExpanded = false,
    onToggle = '',
    titleHtml = '',
    count = 0,
    description = '',
    itemsHtml = '',
    itemsAttributes = ''
  } = {}) {
    const classes = ['nav-constant-group', 'file-nav-group'];
    if (className) {
      classes.push(className);
    }
    if (!isExpanded) {
      classes.push('collapsed');
    }

    const dataAttribute = dataAttributeName && dataAttributeValue
      ? ` ${dataAttributeName}="${window.escapeAttribute(dataAttributeValue)}"`
      : '';

    return `
      <div class="${window.escapeAttribute(classes.join(' '))}"${dataAttribute}>
        <div class="nav-constant-group-header" onclick="${onToggle}">
          <span class="nav-constant-group-title-wrap">
            <span class="nav-constant-group-caret" aria-hidden="true">▸</span>
            <span class="nav-constant-group-title">${titleHtml}</span>
          </span>
          <span class="nav-constant-group-count">${count}</span>
        </div>
        <div class="nav-constant-group-items"${itemsAttributes ? ` ${itemsAttributes}` : ''}>
          ${description ? `<div class="nav-group-description">${window.escapeHtml(description)}</div>` : ''}
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  return Object.freeze({
    renderSidebarExampleGroup,
    renderSidebarNavItem,
    renderSidebarSectionShell
  });
})();
