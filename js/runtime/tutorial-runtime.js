(function initTutorialRuntime(global) {
function renderTutorialCodeBlock(label, code, language = 'cpp') {
  const normalizedLanguage = String(language || 'cpp').toLowerCase();
  return `
    <div class="code-container example-section tutorial-example-section">
      <div class="code-header"><span>${label}</span></div>
      <pre class="code-block"><code class="language-${normalizedLanguage}" data-raw-code="${escapeAttribute(code)}">${escapeHtml(code)}</code></pre>
    </div>
  `;
}

global.renderTutorialCodeBlock = renderTutorialCodeBlock;

function normalizeCodeLanguageName(language = 'cpp') {
  const normalized = String(language || 'cpp').toLowerCase().trim();
  if (normalized === 'c++') {
    return 'cpp';
  }
  if (normalized === 'shell') {
    return 'bash';
  }
  return normalized || 'cpp';
}

function getCodeLanguageDisplayLabel(language = 'cpp') {
  switch (normalizeCodeLanguageName(language)) {
    case 'c':
      return 'C';
    case 'cpp':
      return 'C++';
    case 'glsl':
      return 'GLSL';
    case 'bash':
      return 'Bash';
    case 'cmake':
      return 'CMake';
    default:
      return String(language || 'Code').toUpperCase();
  }
}

function renderDocCodeContainer({
  titleHtml = '',
  rawCode = '',
  renderedCodeHtml = '',
  language = 'cpp',
  containerClassName = '',
  preClassName = '',
  codeClassName = '',
  codeDataAttributes = null,
  allowCopy = true,
  allowToggle = true,
  skipHighlight = false
} = {}) {
  const normalizedLanguage = normalizeCodeLanguageName(language);
  const languageLabel = getCodeLanguageDisplayLabel(normalizedLanguage);
  const containerClasses = ['code-container', containerClassName].filter(Boolean).join(' ');
  const preClasses = ['code-block', preClassName].filter(Boolean).join(' ');
  const codeClasses = [`language-${normalizedLanguage}`, codeClassName].filter(Boolean).join(' ');
  const codeMarkup = renderedCodeHtml || escapeHtml(rawCode);
  const extraCodeAttributes = Object.entries(codeDataAttributes || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ` data-${escapeAttribute(String(key))}="${escapeAttribute(String(value))}"`)
    .join('');
  const copyButton = allowCopy ? `
    <button type="button" class="code-action-btn copy-code" data-default-label="نسخ الكود">
      نسخ الكود
    </button>
  ` : '';
  const toggleButton = allowToggle ? `
    <button type="button" class="code-action-btn toggle-code" data-expanded-label="طي الكود" data-collapsed-label="إظهار الكود" aria-expanded="true">
      طي الكود
    </button>
  ` : '';

  return `
    <div class="${escapeAttribute(containerClasses)}" data-code-language="${escapeAttribute(normalizedLanguage)}">
      <div class="code-toolbar">
        <div class="code-toolbar-title">${titleHtml}</div>
        <div class="code-actions">
          <span class="code-language">${escapeHtml(languageLabel)}</span>
          ${copyButton}
          ${toggleButton}
        </div>
      </div>
      <pre class="${escapeAttribute(preClasses)}"><code dir="ltr" class="${escapeAttribute(codeClasses)}" data-raw-code="${escapeAttribute(rawCode)}"${skipHighlight ? ' data-skip-highlight="true"' : ''}${extraCodeAttributes}>${codeMarkup}</code></pre>
    </div>
  `;
}

function renderTutorialList(items, ordered = false) {
  const tag = ordered ? 'ol' : 'ul';
  return `
    <${tag} class="best-practices-list">
      ${items.map((item) => `<li>${item}</li>`).join('')}
    </${tag}>
  `;
}

function splitCodeIntoLineChunks(rawCode, maxLinesPerChunk = 70) {
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

function getTutorialSupportRuntime() {
  return global.__ARABIC_VULKAN_TUTORIAL_SUPPORT__ || null;
}

function prepareTutorialCodeContainers(root = document) {
  getTutorialSupportRuntime()?.prepareTutorialCodeContainers?.(root);
}

function activateTutorialLazyCodeBlocks(root = document) {
  getTutorialSupportRuntime()?.activateTutorialLazyCodeBlocks?.(root);
}

function refreshTutorialCodePresentation(root = document) {
  getTutorialSupportRuntime()?.refreshTutorialCodePresentation?.(root);
}

function renderTutorialInfoGrid(items) {
  return getTutorialSupportRuntime()?.renderTutorialInfoGrid?.(items) || '';
}

function renderTutorialTable(headers, rows) {
  return `
    <table class="params-table">
      <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
      ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
    </table>
  `;
}

const tutorialSdkLinks = [
  {
    label: 'Windows',
    value: '<a class="tutorial-download-link" href="https://sdk.lunarg.com/sdk/download/latest/windows/vulkan-sdk.exe" target="_blank" rel="noopener noreferrer">تنزيل Vulkan SDK لـ Windows</a>',
    note: 'دليل التثبيت الرسمي: <a href="https://vulkan.lunarg.com/doc/view/latest/windows/getting_started.html" target="_blank" rel="noopener noreferrer">Windows Getting Started</a>'
  },
  {
    label: 'Linux',
    value: '<a class="tutorial-download-link" href="https://sdk.lunarg.com/sdk/download/latest/linux/vulkansdk-linux-x86_64-1.4.321.1.tar.xz" target="_blank" rel="noopener noreferrer">تنزيل Vulkan SDK لـ Linux</a>',
    note: 'دليل التثبيت الرسمي: <a href="https://vulkan.lunarg.com/doc/view/latest/linux/getting_started.html" target="_blank" rel="noopener noreferrer">Linux Getting Started</a>'
  },
  {
    label: 'macOS',
    value: '<a class="tutorial-download-link" href="https://sdk.lunarg.com/sdk/download/latest/mac/vulkansdk-macos-1.4.321.1.dmg" target="_blank" rel="noopener noreferrer">تنزيل Vulkan SDK لـ macOS</a>',
    note: 'دليل التثبيت الرسمي: <a href="https://vulkan.lunarg.com/doc/view/latest/mac/getting_started.html" target="_blank" rel="noopener noreferrer">macOS Getting Started</a>'
  },
  {
    label: 'الكل',
    value: '<a class="tutorial-download-link" href="https://vulkan.lunarg.com/sdk/home" target="_blank" rel="noopener noreferrer">صفحة جميع تنزيلات Vulkan SDK</a>',
    note: 'استخدمها إذا كنت تريد اختيار إصدار مختلف أو الوصول إلى أدوات Vulkan الرسمية والتوثيق من المصدر.'
  }
];

function renderTutorialDownloadsSection() {
  return `
    <div class="tutorial-downloads">
      <p class="tutorial-downloads-intro">قبل متابعة الدرس، نزّل حزمة Vulkan SDK الرسمية المناسبة لنظامك حتى تتوفر لك الترويسات، المكتبات، مترجم <code>glslc</code>، وطبقات التحقق نفسها التي نعتمد عليها في الأمثلة.</p>
      ${renderTutorialInfoGrid(tutorialSdkLinks)}
    </div>
  `;
}

global.renderTutorialDownloadsSection = renderTutorialDownloadsSection;

function renderTutorialLesson({summary, goals = [], sections = [], checkpoints = [], nextStep = '', showDownloads = false}) {
  return `
    <div class="tutorial-description">
      <p>${summary}</p>
    </div>

    <div class="tutorial-body">
      ${showDownloads ? `
        <h3>تنزيل Vulkan SDK</h3>
        ${renderTutorialDownloadsSection()}
      ` : ''}

      ${goals.length > 0 ? `
        <h3>أهداف الدرس</h3>
        ${renderTutorialInfoGrid(goals)}
      ` : ''}

      ${sections.map((section) => `
        <h3>${section.title}</h3>
        ${section.body}
      `).join('')}

      ${renderTutorialConstantsSection({summary, goals, sections, checkpoints, nextStep})}

      ${checkpoints.length > 0 ? `
        <h3>ما يجب تثبيته قبل الانتقال</h3>
        ${renderTutorialList(checkpoints)}
      ` : ''}

      ${nextStep ? `
        <h3>الانتقال إلى الدرس التالي</h3>
        <p>${nextStep}</p>
      ` : ''}
    </div>
  `;
}

global.renderTutorialLesson = renderTutorialLesson;

function renderSdl3InfoGrid(items) {
  return renderTutorialInfoGrid((Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    value: renderSdl3InfoGridRichText(item?.value),
    note: renderSdl3InfoGridRichText(item?.note)
  })));
}

function renderSdl3InfoGridRichText(text) {
  const raw = String(text || '').trim();
  if (!raw) {
    return '';
  }

  if (/<\/?(?:a|code|span|strong|em|img|br)\b/i.test(raw)) {
    return raw;
  }

  return renderSdl3PracticalText(raw, raw);
}

function buildTutorialConceptTooltip(concept) {
  if (!concept) {
    return '';
  }

  return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
    ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
      title: concept.title,
      kindLabel: 'مفهوم تعليمي',
      typeLabel: concept.kind || 'Concept',
      library: 'Tutorial',
      meaning: concept.description || '',
      whyExists: concept.description || 'وُجد هذا المفهوم لأن الدرس يبني عليه خطوة لاحقة ولا يكفي ذكر الاسم وحده.',
      whyUse: concept.benefit || concept.usage || '',
      actualUsage: concept.usage || 'يظهر داخل الدرس كنقطة مفاهيمية تحكم فهم الخطوة العملية التالية.'
    })
    : [
      concept.title,
      concept.kind ? `النوع: ${concept.kind}` : '',
      concept.description ? `المعنى: ${concept.description}` : '',
      concept.usage ? `الاستخدام: ${concept.usage}` : '',
      concept.benefit ? `الفائدة: ${concept.benefit}` : ''
    ].filter(Boolean).join('\n');
}

function renderTutorialConceptChip(conceptId, label = '') {
  const concept = tutorialConceptReferenceData[conceptId];
  if (!concept) {
    return `<code>${escapeHtml(label || conceptId)}</code>`;
  }

  const text = label || concept.title;
  const anchorId = `tutorial-concept-${conceptId}`;
  const tooltip = buildTutorialConceptTooltip(concept);
  const aria = escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`);

  return `<a href="#${anchorId}" class="related-link code-token" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="scrollToAnchor('${anchorId}'); return false;">${escapeHtml(text)}</a>`;
}

window.renderTutorialConceptChip = renderTutorialConceptChip;

function renderTutorialConceptGlossary(ids = []) {
  const cards = ids
    .map((id) => {
      const concept = tutorialConceptReferenceData[id];
      if (!concept) {
        return '';
      }

      return `
        <div class="content-card prose-card" id="tutorial-concept-${id}">
          <div class="info-label">${escapeHtml(concept.kind || 'مفهوم')}</div>
          <div class="info-value">${escapeHtml(concept.title)}</div>
          <p>${escapeHtml(concept.description || '')}</p>
          ${concept.usage ? `<p><strong>أين يستخدم؟</strong> ${escapeHtml(concept.usage)}</p>` : ''}
          ${concept.benefit ? `<p><strong>لماذا هو مهم؟</strong> ${escapeHtml(concept.benefit)}</p>` : ''}
          ${concept.sourceUrl ? `<p><a class="doc-link" href="${escapeAttribute(concept.sourceUrl)}" target="_blank" rel="noopener noreferrer">المواصفة الرسمية</a></p>` : ''}
        </div>
      `;
    })
    .filter(Boolean)
    .join('');

  if (!cards) {
    return '';
  }

  return `<div class="info-grid">${cards}</div>`;
}



const TUTORIAL_PLACEHOLDER_PREFIX = '__TPL__';
const TUTORIAL_PLACEHOLDER_SUFFIX = '__TPL__END__';
const TUTORIAL_PLACEHOLDER_REGEX = /__TPL__([A-Z_]+)__([\s\S]*?)__TPL__END__/g;

const tutorialPlaceholderRenderers = {
  LIST: (payload = {}) => renderTutorialList(payload.items || [], Boolean(payload.ordered)),
  TABLE: (payload = {}) => renderTutorialTable(payload.headers || [], payload.rows || []),
  CODE_BLOCK: (payload = {}) => renderTutorialCodeBlock(payload.label || '', payload.code || '', payload.language || 'cpp'),
  INFO_GRID: (payload = {}) => renderTutorialInfoGrid(payload.items || []),
  CONCEPT_CHIP: (payload = {}) => renderTutorialConceptChip(payload.conceptId, payload.label),
  PROJECT_REF: (payload = {}) => renderProjectReferenceChip(payload.name, payload.options || {}),
  CONCEPT_GLOSSARY: (payload = {}) => renderTutorialConceptGlossary(payload.ids || []),
  VISUAL_SHOT: (payload = {}) => renderTutorialVisualShot(payload),
  GLFW_GALLERY: () => renderGlfwVulkanInstallGallery(),
  YOUTUBE_EMBED: (payload = {}) => renderTutorialYoutubeEmbed(payload),
  PIPELINE_DIAGRAM: () => renderPipelineStagesDiagram()
};

function decodeTutorialPlaceholderPayload(rawPayload = '') {
  try {
    return JSON.parse(decodeURIComponent(rawPayload));
  } catch (error) {
    console.warn('تعذر فك placeholder للدروس:', error);
    return {};
  }
}

function findTutorialPlaceholderEnd(text = '', payloadStartIndex = 0) {
  let depth = 1;
  let cursor = payloadStartIndex;

  while (cursor < text.length) {
    const nextStart = text.indexOf(TUTORIAL_PLACEHOLDER_PREFIX, cursor);
    const nextEnd = text.indexOf(TUTORIAL_PLACEHOLDER_SUFFIX, cursor);

    if (nextEnd === -1) {
      return -1;
    }

    if (nextStart !== -1 && nextStart < nextEnd) {
      depth += 1;
      cursor = nextStart + TUTORIAL_PLACEHOLDER_PREFIX.length;
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      return nextEnd;
    }
    cursor = nextEnd + TUTORIAL_PLACEHOLDER_SUFFIX.length;
  }

  return -1;
}

function replaceTutorialPlaceholders(text = '') {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  let output = '';
  let cursor = 0;

  while (cursor < text.length) {
    const placeholderStart = text.indexOf(TUTORIAL_PLACEHOLDER_PREFIX, cursor);
    if (placeholderStart === -1) {
      output += text.slice(cursor);
      break;
    }

    output += text.slice(cursor, placeholderStart);

    const typeStart = placeholderStart + TUTORIAL_PLACEHOLDER_PREFIX.length;
    const typeSeparator = text.indexOf('__', typeStart);
    if (typeSeparator === -1) {
      output += text.slice(placeholderStart);
      break;
    }

    const type = text.slice(typeStart, typeSeparator);
    const payloadStart = typeSeparator + 2;
    const payloadEnd = findTutorialPlaceholderEnd(text, payloadStart);
    if (payloadEnd === -1) {
      output += text.slice(placeholderStart);
      break;
    }

    const renderer = tutorialPlaceholderRenderers[type];
    if (!renderer) {
      cursor = payloadEnd + TUTORIAL_PLACEHOLDER_SUFFIX.length;
      continue;
    }

    const encodedPayload = text.slice(payloadStart, payloadEnd);
    const payload = decodeTutorialPlaceholderPayload(encodedPayload);

    try {
      output += renderer(payload);
    } catch (error) {
      console.warn(`تعذر توليد placeholder للدروس من النوع ${type}:`, error);
    }

    cursor = payloadEnd + TUTORIAL_PLACEHOLDER_SUFFIX.length;
  }

  return output;
}

function restoreTutorialPlaceholders(text = '') {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  return replaceTutorialPlaceholders(text);
}

function hydrateTutorialPayload(value) {
  if (typeof value === 'string') {
    return restoreTutorialPlaceholders(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => hydrateTutorialPayload(entry));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, entry]) => {
      acc[key] = hydrateTutorialPayload(entry);
      return acc;
    }, Array.isArray(value) ? [] : {});
  }
  return value;
}

function hydrateTutorialLayout(layout = {}) {
  return hydrateTutorialPayload(layout);
}

function buildTutorialContentFromLayouts(layouts = {}) {
  const content = {};
  Object.entries(layouts || {}).forEach(([tutorialId, entry]) => {
    const hydratedLayout = hydrateTutorialLayout(entry?.content || {});
    content[tutorialId] = {
      ...entry,
      content: renderTutorialLesson(hydratedLayout)
    };
  });
  return content;
}

function renderTutorialVisualShot({title = '', subtitle = '', caption = '', variant = 'generic'}) {
  let svgMarkup = '';

  switch (variant) {
    case 'windows-sdk':
      svgMarkup = `
        <rect x="18" y="18" width="324" height="184" rx="24" fill="#0f1722"/>
        <rect x="18" y="18" width="324" height="28" rx="24" fill="#1f3b62"/>
        <circle cx="42" cy="32" r="5" fill="#ffd36e"/>
        <circle cx="60" cy="32" r="5" fill="#7ec8ff"/>
        <circle cx="78" cy="32" r="5" fill="#8ae0ae"/>
        <rect x="38" y="64" width="124" height="118" rx="18" fill="#17293d"/>
        <rect x="178" y="64" width="144" height="118" rx="18" fill="#1f3450"/>
        <rect x="54" y="84" width="92" height="12" rx="6" fill="#dfe9f8"/>
        <rect x="54" y="108" width="78" height="12" rx="6" fill="#7abfff"/>
        <rect x="54" y="132" width="62" height="12" rx="6" fill="#78d0a0"/>
        <rect x="196" y="82" width="104" height="18" rx="9" fill="#dfe9f8"/>
        <rect x="196" y="116" width="88" height="16" rx="8" fill="#71b8ff"/>
        <rect x="196" y="146" width="74" height="16" rx="8" fill="#ffd574"/>
        <rect x="196" y="170" width="96" height="10" rx="5" fill="#6b819b"/>
      `;
      break;
    case 'linux-sdk':
      svgMarkup = `
        <rect x="18" y="18" width="324" height="184" rx="24" fill="#10151c"/>
        <rect x="18" y="18" width="324" height="28" rx="24" fill="#2d3a4a"/>
        <circle cx="42" cy="32" r="5" fill="#ffd36e"/>
        <circle cx="60" cy="32" r="5" fill="#7ec8ff"/>
        <circle cx="78" cy="32" r="5" fill="#8ae0ae"/>
        <rect x="36" y="62" width="286" height="126" rx="18" fill="#0f1620" stroke="#35506c" stroke-width="2"/>
        <text x="52" y="88" fill="#8bd0ff" font-size="13" font-family="Menlo, Consolas, monospace">$ export VULKAN_SDK=~/VulkanSDK</text>
        <text x="52" y="114" fill="#dfe9f8" font-size="13" font-family="Menlo, Consolas, monospace">$ source setup-env.sh</text>
        <text x="52" y="140" fill="#78d0a0" font-size="13" font-family="Menlo, Consolas, monospace">$ vulkaninfo --summary</text>
        <rect x="48" y="156" width="250" height="16" rx="8" fill="#1b2a39"/>
        <rect x="48" y="156" width="168" height="16" rx="8" fill="#6cb8ff"/>
      `;
      break;
    case 'mac-sdk':
      svgMarkup = `
        <rect x="18" y="18" width="324" height="184" rx="24" fill="#11161f"/>
        <rect x="18" y="18" width="324" height="28" rx="24" fill="#344151"/>
        <circle cx="42" cy="32" r="5" fill="#ff8b82"/>
        <circle cx="60" cy="32" r="5" fill="#ffd36e"/>
        <circle cx="78" cy="32" r="5" fill="#8ae0ae"/>
        <rect x="42" y="62" width="112" height="122" rx="20" fill="#eef3f8"/>
        <rect x="180" y="62" width="138" height="122" rx="20" fill="#172433"/>
        <rect x="60" y="84" width="76" height="12" rx="6" fill="#90a4b8"/>
        <rect x="60" y="110" width="76" height="56" rx="14" fill="#cfd9e4"/>
        <text x="198" y="90" fill="#8bd0ff" font-size="13" font-family="Menlo, Consolas, monospace">% vulkaninfo</text>
        <text x="198" y="116" fill="#dfe9f8" font-size="13" font-family="Menlo, Consolas, monospace">% glslangValidator</text>
        <rect x="198" y="138" width="94" height="14" rx="7" fill="#78d0a0"/>
        <rect x="198" y="162" width="82" height="10" rx="5" fill="#ffd574"/>
      `;
      break;
    default:
      svgMarkup = `
        <rect x="18" y="18" width="324" height="184" rx="24" fill="#111822"/>
        <rect x="42" y="52" width="276" height="116" rx="20" fill="#1e3248"/>
        <rect x="64" y="78" width="180" height="14" rx="7" fill="#dfe9f8"/>
        <rect x="64" y="108" width="150" height="14" rx="7" fill="#7ec8ff"/>
        <rect x="64" y="138" width="116" height="14" rx="7" fill="#ffd574"/>
      `;
      break;
  }

  return `
    <figure class="tutorial-visual-card">
      <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="360" height="220" rx="26" fill="#0b1017"/>
        ${svgMarkup}
        <text x="180" y="204" text-anchor="middle" fill="#edf4ff" font-size="15" font-family="Tahoma, Arial, sans-serif">${escapeHtml(title)}</text>
        ${subtitle ? `<text x="180" y="186" text-anchor="middle" fill="#87a7c5" font-size="12" font-family="Tahoma, Arial, sans-serif">${escapeHtml(subtitle)}</text>` : ''}
      </svg>
      <figcaption>${escapeHtml(caption)}</figcaption>
    </figure>
  `;
}

function renderGlfwVulkanInstallGallery() {
  return `
    <div class="tutorial-visual-grid">
      ${renderTutorialVisualShot({
        title: 'Windows',
        subtitle: 'Vulkan SDK Installer',
        caption: 'صورة توضيحية لواجهة تثبيت Windows مع اختيار أدوات SDK وطبقات التحقق وملفات الأدوات في خطوة واحدة.',
        variant: 'windows-sdk'
      })}
      ${renderTutorialVisualShot({
        title: 'Linux',
        subtitle: 'SDK + setup-env.sh',
        caption: 'صورة توضيحية لمسار Linux: فك الحزمة ثم تفعيل البيئة من الطرفية قبل تشغيل vulkaninfo و glslangValidator.',
        variant: 'linux-sdk'
      })}
      ${renderTutorialVisualShot({
        title: 'macOS',
        subtitle: 'SDK + MoltenVK',
        caption: 'صورة توضيحية لمسار macOS مع تثبيت الحزمة ثم التحقق من الأدوات وبيئة التنفيذ من الطرفية.',
        variant: 'mac-sdk'
      })}
    </div>
  `;
}

function renderTutorialYoutubeEmbed({title = '', embedUrl = '', watchUrl = '', description = ''} = {}) {
  return `
    <div class="tutorial-video-card">
      <div class="content-card prose-card tutorial-video-copy">
        <div class="info-label">فيديو الدرس</div>
        <div class="info-value">${escapeHtml(title)}</div>
        ${description ? `<p>${escapeHtml(description)}</p>` : ''}
        ${watchUrl ? `<p><a class="doc-link" href="${escapeAttribute(watchUrl)}" target="_blank" rel="noopener noreferrer">فتح الفيديو على يوتيوب</a></p>` : ''}
      </div>
      <div class="tutorial-video-embed-shell">
        <iframe
          class="tutorial-video-embed"
          src="${escapeAttribute(embedUrl)}"
          title="${escapeAttribute(title)}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>
    </div>
  `;
}

global.renderTutorialVisualShot = renderTutorialVisualShot;
global.renderGlfwVulkanInstallGallery = renderGlfwVulkanInstallGallery;
global.renderTutorialYoutubeEmbed = renderTutorialYoutubeEmbed;

(function registerTutorialRuntime(global) {
  const registry = global.__ARABIC_VULKAN_RUNTIME_AGENTS__ || (global.__ARABIC_VULKAN_RUNTIME_AGENTS__ = {});
  registry.tutorialUi = {
    renderDocCodeContainer,
    renderTutorialCodeBlock,
    renderTutorialList,
    renderTutorialInfoGrid,
    renderTutorialTable,
    splitCodeIntoLineChunks,
    renderSdl3InfoGrid,
    renderSdl3InfoGridRichText,
    buildTutorialContentFromLayouts
  };
})(global);
})(window);
