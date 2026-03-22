window.__ARABIC_VULKAN_GLSL_EXAMPLE_RUNTIME__ = (() => {
  function createGlslExampleRuntime(api = {}) {
    const {
      escapeAttribute,
      escapeHtml,
      renderGlslReferenceChip,
      renderGlslTechnicalProse,
      renderGlslReadyShaderCodeBlock,
      renderCommandSnippet,
      getGlslExampleGuide,
      renderGlslExampleOfficialGuidance,
      renderGlslExampleProjectExpansion,
      renderImguiEntityLink,
      getGlslReferenceItem,
      safeRenderEntityLabel,
      scrollToAnchor,
      renderImguiDocText,
      renderTutorialList,
      renderTutorialInfoGrid,
      renderHighlightedCode,
      renderTutorialTable,
      getGlslExampleSectionMeta,
      getGlslExampleInternalDocLink,
      getGlslReadyExampleById,
      getGlslExampleDisplayTitle,
      showGlslExample,
      preferArabicTooltipText,
      buildGlslPracticalRole,
      localizeGlslKind,
      buildGlslReferenceTooltip,
      renderEntityIcon,
      getGlslExampleSupplementaryTracks,
      buildGlslExampleSectionReason,
      renderImguiCodeBlock,
      renderExampleHeroSection
    } = api;

function renderGlslReadyExamplePreview(example) {
  if (!example?.previewKind) {
    return '';
  }

  const title = localizeGlslStageLabels(String(example.previewTitle || `معاينة ${example.title || 'لغة التظليل'}`).trim());
  let svgMarkup = '';

  switch (example.previewKind) {
    case 'triangle':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M180 48 L292 176 L68 176 Z" fill="#f2f6ff"/>
      `;
      break;
    case 'solid-color':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M180 48 L292 176 L68 176 Z" fill="#f06d2d"/>
      `;
      break;
    case 'uniform-color':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M180 48 L292 176 L68 176 Z" fill="#54b4ff"/>
        <rect x="98" y="182" width="164" height="10" rx="5" fill="#ffd46d"/>
      `;
      break;
    case 'gradient':
      svgMarkup = `
        <defs>
          <linearGradient id="glslGradientPreview" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5cb9ff"/>
            <stop offset="55%" stop-color="#b67dff"/>
            <stop offset="100%" stop-color="#ffd36a"/>
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M180 48 L292 176 L68 176 Z" fill="url(#glslGradientPreview)"/>
      `;
      break;
    case 'texture':
      svgMarkup = `
        <defs>
          <pattern id="glslTexturePreview" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill="#26435e"/>
            <rect width="14" height="14" fill="#6fb4ff"/>
            <rect x="14" y="14" width="14" height="14" fill="#ffd77b"/>
          </pattern>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M92 54 H268 C287 54 302 69 302 88 V150 C302 169 287 184 268 184 H92 C73 184 58 169 58 150 V88 C58 69 73 54 92 54 Z" fill="url(#glslTexturePreview)"/>
      `;
      break;
    case 'motion':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M164 54 L278 176 L92 176 Z" fill="#62c0ff"/>
        <path d="M132 54 L246 176 L60 176 Z" fill="none" stroke="#ffd676" stroke-width="6" stroke-dasharray="10 10"/>
      `;
      break;
    case 'grayscale':
      svgMarkup = `
        <defs>
          <linearGradient id="glslGraySource" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4fb4ff"/>
            <stop offset="50%" stop-color="#ff9c6a"/>
            <stop offset="100%" stop-color="#8f7bff"/>
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <rect x="52" y="58" width="112" height="104" rx="16" fill="url(#glslGraySource)"/>
        <rect x="196" y="58" width="112" height="104" rx="16" fill="#9ba2ad"/>
      `;
      break;
    case 'wave':
      svgMarkup = `
        <defs>
          <pattern id="glslWavePattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#34506e"/>
            <path d="M0 12 C6 4 18 20 24 12" fill="none" stroke="#71c3ff" stroke-width="3"/>
          </pattern>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <path d="M58 92 C90 60 120 124 152 92 C184 60 214 124 246 92 C268 70 286 76 302 92 V166 H58 Z" fill="url(#glslWavePattern)"/>
      `;
      break;
    case 'pbr':
      svgMarkup = `
        <defs>
          <radialGradient id="glslPbrSphere" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#f7fbff"/>
            <stop offset="35%" stop-color="#d0dbe7"/>
            <stop offset="70%" stop-color="#7b8fa5"/>
            <stop offset="100%" stop-color="#2b3441"/>
          </radialGradient>
        </defs>
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#111723"/>
        <circle cx="124" cy="110" r="52" fill="url(#glslPbrSphere)"/>
        <circle cx="236" cy="110" r="52" fill="#9b7749"/>
        <circle cx="222" cy="94" r="14" fill="#f9f5e8" opacity="0.82"/>
        <rect x="278" y="56" width="38" height="14" rx="7" fill="#5aaeff"/>
        <rect x="278" y="82" width="38" height="14" rx="7" fill="#ffd06e"/>
        <rect x="278" y="108" width="38" height="14" rx="7" fill="#7ed3b0"/>
        <rect x="278" y="134" width="38" height="14" rx="7" fill="#e6edf8"/>
      `;
      break;
    case 'bloom':
      svgMarkup = `
        <defs>
          <radialGradient id="glslBloomCore" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#fff6d0"/>
            <stop offset="35%" stop-color="#ffd474"/>
            <stop offset="70%" stop-color="#ff9d5f" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#ff9d5f" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <circle cx="180" cy="110" r="68" fill="url(#glslBloomCore)"/>
        <circle cx="180" cy="110" r="26" fill="#fff2c6"/>
        <rect x="54" y="164" width="252" height="10" rx="5" fill="#394a5f"/>
        <rect x="54" y="164" width="144" height="10" rx="5" fill="#ffd06e"/>
      `;
      break;
    case 'normal-map':
      svgMarkup = `
        <defs>
          <linearGradient id="glslNormalPreview" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7ad7ff"/>
            <stop offset="50%" stop-color="#bf87ff"/>
            <stop offset="100%" stop-color="#ffd77a"/>
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <rect x="58" y="56" width="120" height="108" rx="18" fill="url(#glslNormalPreview)"/>
        <rect x="192" y="56" width="110" height="108" rx="18" fill="#dce7f5"/>
        <path d="M212 86 L252 70 L284 96 L266 138 L220 150 L198 118 Z" fill="none" stroke="#67b7ff" stroke-width="4"/>
      `;
      break;
    case 'shadow-map':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101720"/>
        <rect x="70" y="60" width="66" height="66" rx="14" fill="#76b6ff"/>
        <ellipse cx="120" cy="148" rx="78" ry="16" fill="#ffd175" opacity="0.75"/>
        <ellipse cx="214" cy="148" rx="78" ry="16" fill="#2d3744"/>
        <path d="M182 70 L300 50" stroke="#ffe8a8" stroke-width="5" stroke-linecap="round"/>
        <circle cx="302" cy="48" r="11" fill="#fff4cb"/>
      `;
      break;
    case 'noise':
      svgMarkup = `
        <defs>
          <pattern id="glslNoisePattern" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#1d2b3a"/>
            <circle cx="4" cy="5" r="2" fill="#8bcaff"/>
            <circle cx="12" cy="8" r="2.4" fill="#ffd06d"/>
            <circle cx="7" cy="14" r="1.8" fill="#7fd4b1"/>
          </pattern>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111723"/>
        <rect x="54" y="52" width="252" height="116" rx="18" fill="url(#glslNoisePattern)"/>
        <rect x="68" y="178" width="220" height="8" rx="4" fill="#7aa3cf"/>
      `;
      break;
    case 'water':
      svgMarkup = `
        <defs>
          <linearGradient id="glslWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7cd7ff"/>
            <stop offset="100%" stop-color="#22567e"/>
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101a26"/>
        <path d="M56 112 C84 86 108 138 138 108 C168 78 196 136 228 106 C256 82 282 118 306 102 V182 H56 Z" fill="url(#glslWaterGradient)"/>
        <path d="M56 118 C84 96 108 148 138 118 C168 90 196 146 228 118 C256 98 282 126 306 112" fill="none" stroke="#eef9ff" stroke-width="4" opacity="0.68"/>
      `;
      break;
    case 'fog':
      svgMarkup = `
        <defs>
          <linearGradient id="glslFogGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#6fa3ff"/>
            <stop offset="100%" stop-color="#d8e2ef"/>
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101722"/>
        <rect x="52" y="118" width="44" height="44" rx="10" fill="#6baeff"/>
        <rect x="132" y="96" width="54" height="66" rx="12" fill="#89baf7"/>
        <rect x="228" y="72" width="62" height="90" rx="14" fill="url(#glslFogGradient)"/>
        <rect x="52" y="54" width="254" height="26" rx="13" fill="#d8e1ef" opacity="0.55"/>
      `;
      break;
    case 'raymarch':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#0f1620"/>
        <circle cx="194" cy="106" r="42" fill="#dce8f8"/>
        <rect x="56" y="146" width="250" height="18" rx="9" fill="#25384a"/>
        <path d="M78 72 L170 100" stroke="#ffd06e" stroke-width="4" stroke-linecap="round" stroke-dasharray="9 9"/>
        <rect x="58" y="52" width="82" height="12" rx="6" fill="#7ebdff"/>
      `;
      break;
    case 'toon':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#111721"/>
        <circle cx="180" cy="108" r="58" fill="#ffd677" stroke="#20242b" stroke-width="10"/>
        <path d="M140 116 C154 90 206 82 226 118" fill="none" stroke="#20242b" stroke-width="10" stroke-linecap="round"/>
        <path d="M112 164 H248" stroke="#20242b" stroke-width="7" stroke-linecap="round"/>
      `;
      break;
    case 'postprocess':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101722"/>
        <rect x="52" y="56" width="110" height="112" rx="18" fill="#dbe6f3"/>
        <rect x="198" y="56" width="110" height="112" rx="18" fill="#7f95b3"/>
        <rect x="174" y="56" width="8" height="112" rx="4" fill="#ffd06e"/>
        <rect x="90" y="178" width="178" height="8" rx="4" fill="#8fc3ff"/>
      `;
      break;
    case 'instancing':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101722"/>
        <circle cx="96" cy="90" r="14" fill="#6eb7ff"/>
        <circle cx="142" cy="120" r="14" fill="#ffd171"/>
        <circle cx="184" cy="82" r="14" fill="#7fd4af"/>
        <circle cx="230" cy="118" r="14" fill="#c98dff"/>
        <circle cx="274" cy="94" r="14" fill="#dce7f6"/>
        <rect x="72" y="162" width="216" height="10" rx="5" fill="#4d6684"/>
      `;
      break;
    case 'screen-space':
      svgMarkup = `
        <rect x="24" y="24" width="312" height="172" rx="22" fill="#101722"/>
        <rect x="50" y="56" width="76" height="112" rx="16" fill="#4c6c8d"/>
        <rect x="142" y="56" width="76" height="112" rx="16" fill="#92b4d6"/>
        <rect x="234" y="56" width="76" height="112" rx="16" fill="#e7eff9"/>
        <path d="M64 78 L112 150" stroke="#dce7f5" stroke-width="4"/>
        <path d="M156 74 L204 148" stroke="#ffd06d" stroke-width="4"/>
        <path d="M248 72 L298 152" stroke="#101722" stroke-width="5"/>
      `;
      break;
    case 'pipeline-layout':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101822"/>
        <rect x="42" y="46" width="116" height="128" rx="18" fill="#16283a"/>
        <rect x="182" y="46" width="136" height="128" rx="18" fill="#1f3146"/>
        <text x="100" y="74" text-anchor="middle" fill="#eef5ff" font-size="14" font-family="Tahoma, Arial, sans-serif">المجموعة 0</text>
        <text x="250" y="74" text-anchor="middle" fill="#eef5ff" font-size="14" font-family="Tahoma, Arial, sans-serif">واجهة الشيدر</text>
        <rect x="58" y="94" width="82" height="16" rx="8" fill="#6eb8ff"/>
        <rect x="58" y="124" width="82" height="16" rx="8" fill="#ffd36f"/>
        <text x="99" y="106" text-anchor="middle" fill="#0d1520" font-size="11" font-family="Tahoma, Arial, sans-serif">الربط 0</text>
        <text x="99" y="136" text-anchor="middle" fill="#0d1520" font-size="11" font-family="Tahoma, Arial, sans-serif">الربط 1</text>
        <rect x="202" y="92" width="98" height="16" rx="8" fill="#dfe9f8"/>
        <rect x="202" y="124" width="98" height="16" rx="8" fill="#8cd2a8"/>
        <text x="251" y="105" text-anchor="middle" fill="#15202d" font-size="11" font-family="Tahoma, Arial, sans-serif">الموضع 0</text>
        <text x="251" y="137" text-anchor="middle" fill="#15202d" font-size="11" font-family="Tahoma, Arial, sans-serif">outColor</text>
        <path d="M158 102 H182" stroke="#ffd36f" stroke-width="5" stroke-linecap="round"/>
        <path d="M158 132 H182" stroke="#ffd36f" stroke-width="5" stroke-linecap="round"/>
      `;
      break;
    case 'spirv-files':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101721"/>
        <rect x="38" y="54" width="86" height="116" rx="18" fill="#172637"/>
        <rect x="138" y="54" width="86" height="116" rx="18" fill="#22384c"/>
        <rect x="238" y="54" width="84" height="116" rx="18" fill="#1a2d40"/>
        <text x="81" y="84" text-anchor="middle" fill="#eef5ff" font-size="13" font-family="Tahoma, Arial, sans-serif">shader.vert</text>
        <text x="181" y="84" text-anchor="middle" fill="#eef5ff" font-size="13" font-family="Tahoma, Arial, sans-serif">إس بي آي آر-في</text>
        <text x="280" y="84" text-anchor="middle" fill="#eef5ff" font-size="13" font-family="Tahoma, Arial, sans-serif">shader.frag</text>
        <rect x="54" y="106" width="54" height="10" rx="5" fill="#dfe9f8"/>
        <rect x="54" y="130" width="42" height="10" rx="5" fill="#6eb8ff"/>
        <rect x="158" y="112" width="46" height="14" rx="7" fill="#ffd36f"/>
        <rect x="250" y="106" width="54" height="10" rx="5" fill="#dfe9f8"/>
        <rect x="250" y="130" width="42" height="10" rx="5" fill="#8cd2a8"/>
        <path d="M124 116 H138" stroke="#ffd36f" stroke-width="4" stroke-linecap="round"/>
        <path d="M224 116 H238" stroke="#ffd36f" stroke-width="4" stroke-linecap="round"/>
        <rect x="140" y="148" width="82" height="10" rx="5" fill="#6f8196"/>
      `;
      break;
    default:
      return '';
  }

  return `
    <figure class="glsl-ready-example-shot">
      <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="360" height="220" rx="24" fill="#0b1016"/>
        ${svgMarkup}
      </svg>
      <figcaption>${escapeHtml(title)}</figcaption>
    </figure>
  `;
}

const GLSL_VERTEX_STAGE_ARABIC_LABEL = 'مظلّل الرؤوس';
const GLSL_FRAGMENT_STAGE_ARABIC_LABEL = 'مظلّل الأجزاء';
const GLSL_EXAMPLE_UI_TERM_REPLACEMENTS = Object.freeze([
  [/\bGLSL\b/g, 'لغة التظليل'],
  [/\bVulkan\b/g, 'فولكان'],
  [/\bSPIR-V\b/g, 'إس بي آي آر-في'],
  [/\bVkShaderModule\b/g, 'وحدة شيدر'],
  [/\bShader Module\b/gi, 'وحدة شيدر'],
  [/\bUV\b/g, 'يو في'],
  [/\buniform\b/gi, 'متغير موحد'],
  [/\btextures\b/gi, 'الخامات'],
  [/\btexture\b/gi, 'الخامة'],
  [/\bsampler\b/gi, 'سامبلر'],
  [/\bfragments\b/gi, 'أجزاء لونية'],
  [/\bfragment\b/gi, 'جزء لوني'],
  [/\bsin\b/g, 'دالة الجيب'],
  [/\bPipeline\b/gi, 'خط الأنابيب'],
  [/\bWindows\b/g, 'ويندوز'],
  [/\bLinux\b/g, 'لينكس'],
  [/\bmacOS\b/g, 'ماك أو إس']
]);

function applyGlslExampleUiTermReplacements(text = '') {
  let value = String(text || '');
  GLSL_EXAMPLE_UI_TERM_REPLACEMENTS.forEach(([pattern, replacement]) => {
    value = value.replace(pattern, replacement);
  });
  return value;
}

function localizeGlslStageLabels(text = '') {
  const raw = String(text || '');
  if (!raw) {
    return '';
  }

  return raw
    .split(/(`[^`]*`)/g)
    .map((segment) => {
      if (!segment) {
        return '';
      }
      if (segment.startsWith('`') && segment.endsWith('`')) {
        return segment;
      }
      return applyGlslExampleUiTermReplacements(segment)
        .replace(/\bVertex Shader\b/g, GLSL_VERTEX_STAGE_ARABIC_LABEL)
        .replace(/\bFragment Shader\b/g, GLSL_FRAGMENT_STAGE_ARABIC_LABEL);
    })
    .join('');
}

function getGlslReadyExampleSummary(example = {}) {
  return {
    relatedLinks: (example.related || [])
      .map((name) => renderGlslReferenceChip(name))
      .join(' '),
    localizedTitle: localizeGlslStageLabels(example.title || ''),
    localizedShaderType: localizeGlslStageLabels(example.shaderType || 'مثال مظلّل'),
    compileCommand: String(example.compileCommand || '').trim(),
    compileCommandSecondary: String(example.compileCommandSecondary || '').trim(),
    vulkanUsage: String(example.vulkanUsage || '').trim(),
    codeInteractionNote: 'العناصر المهمة داخل الكود قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع أيقونة توضح نوع الكيان.'
  };
}

function renderGlslReadyExampleOverviewCard(example, options = {}) {
  const {localizedTitle, localizedShaderType} = getGlslReadyExampleSummary(example);
  const showPreview = options.showPreview !== false;
  const previewHtml = showPreview ? renderGlslReadyExamplePreview(example) : '';
  const bodyClassName = showPreview
    ? 'glsl-ready-example-body'
    : 'glsl-ready-example-body glsl-ready-example-body-no-preview';

  return `
    <article class="content-card prose-card glsl-ready-example-card">
      <div class="${bodyClassName}">
        <div class="glsl-ready-example-copy">
          ${showPreview ? `<h3>${escapeHtml(localizedTitle)}</h3>` : ''}
          <h4>الهدف منه</h4>
          <p>${renderGlslTechnicalProse(localizeGlslStageLabels(example.goal || ''))}</p>

          <h4>نوع الشيدر</h4>
          <p>${escapeHtml(localizedShaderType)}</p>
        </div>

        ${previewHtml}
      </div>
    </article>
  `;
}

function renderGlslReadyExampleShaderSection(example) {
  const {codeInteractionNote} = getGlslReadyExampleSummary(example);
  return `
    <div class="glsl-ready-shaders-grid">
      <div class="glsl-ready-shader-stack">
        <div class="content-card prose-card glsl-ready-shader-info-card">
          <h4>${GLSL_VERTEX_STAGE_ARABIC_LABEL}</h4>
          <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
        </div>
        ${renderGlslReadyShaderCodeBlock(GLSL_VERTEX_STAGE_ARABIC_LABEL, example.vertexShader || '')}
      </div>
      <div class="glsl-ready-shader-stack">
        <div class="content-card prose-card glsl-ready-shader-info-card">
          <h4>${GLSL_FRAGMENT_STAGE_ARABIC_LABEL}</h4>
          <p class="example-code-note">${escapeHtml(codeInteractionNote)}</p>
        </div>
        ${renderGlslReadyShaderCodeBlock(GLSL_FRAGMENT_STAGE_ARABIC_LABEL, example.fragmentShader || '')}
      </div>
    </div>
  `;
}

function renderGlslReadyExampleCommandsSection(example) {
  const {compileCommand, compileCommandSecondary} = getGlslReadyExampleSummary(example);
  if (!compileCommand) {
    return '';
  }

  return `
    <div class="content-card prose-card">
      <h4>أمر التحويل إلى إس بي آي آر-في</h4>
      <div class="example-command-grid">
        ${renderCommandSnippet('glslangValidator', compileCommand, 'bash', 'glsl')}
        ${compileCommandSecondary ? renderCommandSnippet('ملف الشيدر الثاني', compileCommandSecondary, 'bash', 'glsl') : ''}
      </div>
    </div>
  `;
}

function renderGlslReadyExampleVulkanUsageSection(example) {
  const {vulkanUsage} = getGlslReadyExampleSummary(example);
  if (!vulkanUsage) {
    return '';
  }

  return `
    <div class="content-card prose-card glsl-example-support-card">
      <h4>كيف يستخدم داخل فولكان</h4>
      <p>${renderGlslTechnicalProse(localizeGlslStageLabels(vulkanUsage))}</p>
    </div>
  `;
}

function renderGlslReadyExampleSupportGrid(example) {
  const {relatedLinks} = getGlslReadyExampleSummary(example);
  const guide = getGlslExampleGuide(example);
  return `
    <div class="vulkan-ready-example-support-grid">
      ${(example.highlights || []).length ? `
      <div class="content-card prose-card vulkan-ready-example-support-card">
        <h4>شرح الأجزاء المهمة</h4>
        <ul class="best-practices-list">
          ${(example.highlights || []).map((entry) => `<li><p>${renderGlslTechnicalProse(localizeGlslStageLabels(entry))}</p></li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="content-card prose-card vulkan-ready-example-support-card">
        <h4>النتيجة المتوقعة</h4>
        <p>${renderGlslTechnicalProse(localizeGlslStageLabels(example.expectedResult || ''))}</p>
      </div>

      ${guide ? `
      <div class="content-card prose-card vulkan-ready-example-support-card">
        <h4>مراجع رسمية للمثال</h4>
        ${renderGlslExampleOfficialGuidance(guide)}
      </div>
      ` : ''}

      ${guide ? `
      <div class="content-card prose-card vulkan-ready-example-support-card">
        <h4>كيف تطوره إلى مشروع كامل</h4>
        ${renderGlslExampleProjectExpansion(guide)}
      </div>
      ` : ''}

      <div class="content-card prose-card vulkan-ready-example-support-card vulkan-ready-example-related-card">
        <h4>العناصر المرتبطة</h4>
        <div class="see-also-links glsl-ready-example-links reference-summary-list reference-summary-list-vertical">
          ${relatedLinks || '<span class="related-link related-link-static">لا توجد عناصر مرتبطة إضافية.</span>'}
        </div>
      </div>
    </div>
  `;
}

function renderGlslReadyExampleCard(example, options = {}) {
  return `
    ${renderGlslReadyExampleOverviewCard(example, options)}
    ${renderGlslReadyExampleShaderSection(example)}
    ${renderGlslReadyExampleCommandsSection(example)}
    ${renderGlslReadyExampleVulkanUsageSection(example)}
    ${renderGlslReadyExampleSupportGrid(example)}
  `;
}

function renderGlslExampleEntity(name = '', options = {}) {
  const label = String(options.label || name || '').trim();
  const token = String(name || '').trim();
  if (!label) {
    return '';
  }

  if (/^ImGui::/.test(token)) {
    return renderImguiEntityLink(token, label, {
      className: options.className || 'related-link code-token',
      iconType: options.iconType || 'imgui',
      tooltip: options.tooltip || ''
    });
  }

  const glslItem = getGlslReferenceItem(token);
  if (glslItem) {
    return renderGlslReferenceChip(token, label);
  }

  const tooltip = String(options.tooltip || label).trim();
  const aria = `${label}: ${tooltip}`.replace(/\n/g, ' - ');
  return `<span class="${escapeAttribute((options.className || 'related-link code-token code-link-static') + ' entity-link-with-icon')}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}">${safeRenderEntityLabel(label, options.iconType || 'variable', {code: true})}</span>`;
}

function renderExampleLocalAnchorLink(label = '', anchorId = '', tooltip = '') {
  const cleanLabel = String(label || '').trim();
  const cleanAnchorId = String(anchorId || '').trim();
  if (!cleanLabel || !cleanAnchorId) {
    return '';
  }

  const resolvedTooltip = String(tooltip || `ينقلك إلى قسم ${cleanLabel} داخل صفحة المثال الحالية.`).trim();
  const aria = `${cleanLabel}: ${resolvedTooltip}`.replace(/\n/g, ' - ');
  return `<a href="#${escapeAttribute(cleanAnchorId)}" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(resolvedTooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}" onclick="scrollToAnchor('${escapeAttribute(cleanAnchorId)}'); return false;">${safeRenderEntityLabel(cleanLabel, 'structure', {code: false})}</a>`;
}

function renderGlslExampleLocalAnchorLink(label = '', anchorId = '', tooltip = '') {
  return renderExampleLocalAnchorLink(label, anchorId, tooltip);
}

function getExampleImageTypeArabicLabel(type = '') {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'preview') return 'Preview';
  if (normalized === 'debug visualization') return 'Debug Visualization';
  if (normalized === 'before/after' || normalized === 'comparison' || normalized === 'parameter comparison') return 'Comparison';
  if (normalized === 'pipeline diagram') return 'Pipeline Diagram';
  return String(type || 'Image').trim() || 'Image';
}

function getExampleImageTypeSortRank(type = '') {
  const normalized = String(type || '').trim().toLowerCase();
  if (normalized === 'preview') return 1;
  if (normalized === 'debug visualization') return 2;
  if (normalized === 'before/after' || normalized === 'comparison' || normalized === 'parameter comparison') return 3;
  if (normalized === 'pipeline diagram') return 4;
  return 5;
}

function sanitizeExampleImageFinalText(text = '') {
  return String(text || '')
    .replace(/الصورة التوضيحية المطابقة/g, '')
    .replace(/المعاينة الحالية داخل البطاقة تمثل شكل المثال بصريًا\.?/g, '')
    .replace(/وعند استبدالها بلقطة فعلية داخل المشروع،?\s*/g, '')
    .replace(/يجب أن تطابق نفس النتيجة المقصودة(?:[^.،\n]*)/g, '')
    .replace(/لا أن تكون صورة عامة لا تعكس عنوان المثال\.?/g, '')
    .replace(/الوصف البصري المطلوب:?/g, '')
    .replace(/الصورة هنا يجب أن تكون(?:[^.،\n]*)/g, '')
    .replace(/تقليل النص إلى الحد الأدنى(?:[^.،\n]*)/g, '')
    .replace(/الغرض من هذه الصورة أن تشرح كيف يبدو العطل بصريًا لا أن تضيف لقطة زخرفية\.?/g, '')
    .replace(/هذه الصورة يجب أن تطابق الناتج الصحيح للمثال،?\s*لا مجرد رسم زخرفي عام\.?/g, '')
    .replace(/صورة تعليمية تساعد القارئ على ربط الأسطر الحرجة بمكانها داخل خط التنفيذ\.?/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([،.:;!؟])/g, '$1')
    .trim();
}

function renderGlslExampleNarrative(text = '', mode = 'glsl') {
  const source = String(text || '').trim();
  if (!source) {
    return '';
  }

  if (mode === 'imgui') {
    return renderImguiDocText(source);
  }

  return renderGlslTechnicalProse(localizeGlslStageLabels(source));
}

function renderGlslExampleList(items = [], mode = 'glsl', ordered = false) {
  const entries = (Array.isArray(items) ? items : [])
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .map((entry) => `<p>${renderGlslExampleNarrative(entry, mode)}</p>`);

  if (!entries.length) {
    return '';
  }

  return renderTutorialList(entries, ordered);
}

function renderGlslExampleInfoGrid(items = []) {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .filter((item) => item?.label && item?.value)
    .map((item) => ({
      label: item.label,
      value: item.value,
      note: item.note || ''
    }));

  if (!normalizedItems.length) {
    return '';
  }

  return renderTutorialInfoGrid(normalizedItems);
}

function renderGlslExampleSection(sectionId = '', title = '', bodyHtml = '') {
  const cleanBody = String(bodyHtml || '').trim();
  if (!cleanBody) {
    return '';
  }

  return `
    <section class="info-section glsl-example-detail-section" id="${escapeAttribute(sectionId)}">
      <div class="glsl-example-section-header">
        <h2>${escapeHtml(title)}</h2>
      </div>
      ${cleanBody}
    </section>
  `;
}

function renderGlslExampleSectionCard(innerHtml = '', className = '') {
  return `<div class="content-card prose-card ${escapeAttribute(className)}">${innerHtml}</div>`;
}

function getGlslExampleRelatedNames(example = {}, extraNames = []) {
  const seen = new Set();
  const names = [];
  [...(Array.isArray(example.related) ? example.related : []), ...(Array.isArray(extraNames) ? extraNames : [])]
    .map((entry) => String(entry || '').trim())
    .filter(Boolean)
    .forEach((name) => {
      if (seen.has(name)) {
        return;
      }
      seen.add(name);
      names.push(name);
    });
  return names;
}

function renderGlslExampleRelatedLinksBlock(example = {}, extraNames = [], emptyText = 'لا توجد عناصر مرتبطة إضافية.') {
  const names = getGlslExampleRelatedNames(example, extraNames).slice(0, 12);
  if (!names.length) {
    return `<span class="related-link related-link-static">${escapeHtml(emptyText)}</span>`;
  }

  return names
    .map((name) => renderGlslExampleEntity(name, {
      tooltip: `يفتح المرجع المرتبط بالعنصر ${name} داخل المشروع.`
    }))
    .join(' ');
}

function renderGlslExamplePageBlock(sectionId = '', title = '', bodyHtml = '', options = {}) {
  const cleanBody = String(bodyHtml || '').trim();
  if (!cleanBody) {
    return '';
  }

  const summary = options.summary === true;
  const wide = options.wide === true;
  const className = summary
    ? 'content-card prose-card example-explanation-block example-explanation-summary-card'
    : `content-card prose-card example-explanation-block${wide ? ' example-explanation-block-wide' : ''}`;

  return `
    <section class="${className}" id="${escapeAttribute(sectionId)}">
      <h3>${escapeHtml(title)}</h3>
      ${cleanBody}
    </section>
  `;
}

function renderGlslExamplePhaseGrid(phases = []) {
  const entries = Array.isArray(phases) ? phases : [];
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-phase-grid">
      ${entries.map((phase) => `
        <article class="content-card prose-card glsl-example-phase-card">
          <h3>${escapeHtml(phase.title || '')}</h3>
          <div class="glsl-example-phase-fields">
            <div>
              <strong>ما الذي يحدث</strong>
              <p>${renderGlslExampleNarrative(phase.what || '')}</p>
            </div>
            <div>
              <strong>لماذا يحدث</strong>
              <p>${renderGlslExampleNarrative(phase.why || '')}</p>
            </div>
            <div>
              <strong>المدخلات</strong>
              <p>${renderGlslExampleNarrative(phase.inputs || '')}</p>
            </div>
            <div>
              <strong>المخرجات</strong>
              <p>${renderGlslExampleNarrative(phase.outputs || '')}</p>
            </div>
            <div>
              <strong>المشاكل المحتملة</strong>
              <p>${renderGlslExampleNarrative(phase.problems || '')}</p>
            </div>
            <div>
              <strong>ما الذي يراه المستخدم</strong>
              <p>${renderGlslExampleNarrative(phase.visible || '')}</p>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleDataFlow(flowSteps = []) {
  const entries = Array.isArray(flowSteps) ? flowSteps : [];
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-flow-grid">
      ${entries.map((step, index) => `
        <article class="content-card prose-card glsl-example-flow-card">
          <div class="info-label">الخطوة ${index + 1}</div>
          <h3>${escapeHtml(step.title || `مرحلة ${index + 1}`)}</h3>
          <p>${renderGlslExampleNarrative(step.description || '')}</p>
          ${step.effect ? `<p class="glsl-example-inline-note"><strong>الأثر:</strong> ${renderGlslExampleNarrative(step.effect)}</p>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleShadersSection(example) {
  const compileCommand = String(example.compileCommand || '').trim();
  const compileCommandSecondary = String(example.compileCommandSecondary || '').trim();
  const vulkanUsage = String(example.vulkanUsage || '').trim();

  return `
    <div class="glsl-ready-shaders-grid">
      <div class="glsl-ready-shader-card">
        <h3>${GLSL_VERTEX_STAGE_ARABIC_LABEL}</h3>
        ${renderGlslReadyShaderCodeBlock(GLSL_VERTEX_STAGE_ARABIC_LABEL, example.vertexShader || '')}
      </div>
      <div class="glsl-ready-shader-card">
        <h3>${GLSL_FRAGMENT_STAGE_ARABIC_LABEL}</h3>
        ${renderGlslReadyShaderCodeBlock(GLSL_FRAGMENT_STAGE_ARABIC_LABEL, example.fragmentShader || '')}
      </div>
    </div>
    ${compileCommand ? `
      <div class="example-command-grid">
        ${renderCommandSnippet('أمر التحويل الأول', compileCommand, 'bash', 'glsl')}
        ${compileCommandSecondary ? renderCommandSnippet('أمر التحويل الثاني', compileCommandSecondary, 'bash', 'glsl') : ''}
      </div>
    ` : ''}
    ${vulkanUsage ? renderGlslExampleSectionCard(`
      <h3>كيف يرتبط هذا الشيدر بفولكان؟</h3>
      <p>${renderGlslExampleNarrative(vulkanUsage)}</p>
    `, 'glsl-example-support-card') : ''}
  `;
}

function renderGlslExampleImportantLines(lines = []) {
  const entries = Array.isArray(lines) ? lines : [];
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-line-grid">
      ${entries.map((entry) => {
        const language = entry.source === 'imgui' ? 'cpp' : 'glsl';
        const sourceLabel = entry.source === 'imgui'
          ? 'Dear ImGui'
          : entry.source === 'vertex'
            ? GLSL_VERTEX_STAGE_ARABIC_LABEL
            : entry.source === 'fragment'
              ? GLSL_FRAGMENT_STAGE_ARABIC_LABEL
              : 'المثال';

        return `
          <article class="content-card prose-card glsl-example-line-card">
            <div class="glsl-example-line-meta">
              <span class="glsl-ready-example-type">${escapeHtml(sourceLabel)}</span>
            </div>
            <pre class="glsl-example-line-snippet"><code class="language-${escapeAttribute(language)}">${renderHighlightedCode(entry.code || entry.line || '', {language})}</code></pre>
            <p><strong>ماذا يفعل:</strong> ${renderGlslExampleNarrative(entry.what || '', entry.source === 'imgui' ? 'imgui' : 'glsl')}</p>
            <p><strong>لماذا استُخدم:</strong> ${renderGlslExampleNarrative(entry.why || '', entry.source === 'imgui' ? 'imgui' : 'glsl')}</p>
            <p><strong>إذا أُزيل:</strong> ${renderGlslExampleNarrative(entry.ifMissing || '', entry.source === 'imgui' ? 'imgui' : 'glsl')}</p>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderGlslExampleElementsTable(elements = []) {
  const entries = Array.isArray(elements) ? elements : [];
  if (!entries.length) {
    return '';
  }

  return renderTutorialTable(
    ['العنصر', 'النوع', 'المصدر', 'الدور العملي', 'القيمة أو المجال'],
    entries.map((entry) => [
      renderGlslExampleEntity(entry.name, {
        tooltip: entry.tooltip || entry.role || entry.name,
        iconType: entry.iconType || (/^ImGui::/.test(String(entry.name || '')) ? 'imgui' : 'variable')
      }),
      escapeHtml(entry.type || ''),
      escapeHtml(entry.source || ''),
      renderGlslExampleNarrative(entry.role || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl'),
      renderGlslExampleNarrative(entry.value || '')
    ])
  );
}

function renderGlslExampleTooltipCards(tooltips = []) {
  const entries = Array.isArray(tooltips) ? tooltips : [];
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-tooltip-grid">
      ${entries.map((entry) => `
        <article class="content-card prose-card glsl-example-tooltip-card">
          <h3>${renderGlslExampleEntity(entry.name, {
            tooltip: entry.meaning || entry.name,
            iconType: entry.iconType || (/^ImGui::/.test(String(entry.name || '')) ? 'imgui' : 'variable')
          })}</h3>
          <div class="glsl-example-tooltip-fields">
            <div><strong>النوع:</strong> <span>${escapeHtml(entry.type || '')}</span></div>
            <div><strong>المصدر:</strong> <span>${escapeHtml(entry.source || '')}</span></div>
            <div><strong>المعنى الحقيقي:</strong> <span>${renderGlslExampleNarrative(entry.meaning || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>سبب استخدامه هنا:</strong> <span>${renderGlslExampleNarrative(entry.why || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>أين يظهر أو أين يؤثر:</strong> <span>${renderGlslExampleNarrative(entry.where || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>تأثيره على النتيجة:</strong> <span>${renderGlslExampleNarrative(entry.effect || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>القيم أو المجال المتوقع:</strong> <span>${renderGlslExampleNarrative(entry.range || '')}</span></div>
            <div><strong>الحالات الحساسة:</strong> <span>${renderGlslExampleNarrative(entry.sensitive || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>أخطاء شائعة مرتبطة به:</strong> <span>${renderGlslExampleNarrative(entry.commonErrors || '', /^Dear ImGui/.test(String(entry.source || '')) ? 'imgui' : 'glsl')}</span></div>
            <div><strong>روابط داخلية مرتبطة به:</strong> <span class="see-also-links">${(entry.links || []).map((linkName) => renderGlslExampleEntity(linkName, {
              tooltip: `يفتح مرجع ${linkName} داخل المشروع.`,
              iconType: /^ImGui::/.test(String(linkName || '')) ? 'imgui' : 'variable'
            })).join(' ')}</span></div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleInternalLinks(example) {
  const hasImgui = Boolean(String(example?.imguiCode || '').trim());
  const hasImguiComponents = Array.isArray(example?.imguiComponents) && example.imguiComponents.length;
  const hasLayout = Boolean(example?.layoutDesign);
  const sectionMeta = getGlslExampleSectionMeta(example);
  const exampleDocLink = getGlslExampleInternalDocLink(example);
  const sectionLinks = [
    ['glsl-example-type', 'النوع'],
    ['glsl-example-section', 'القسم'],
    ['glsl-example-prerequisites', 'المتطلبات السابقة'],
    ['glsl-example-phases', 'المراحل التفصيلية'],
    ['glsl-example-data-flow', 'تسلسل مرور البيانات'],
    ['glsl-example-files', 'الملفات المرتبطة'],
    ['glsl-example-glsl-code', 'كود GLSL'],
    hasImgui ? ['glsl-example-imgui-code', 'كود Dear ImGui'] : null,
    ['glsl-example-important-lines', 'شرح السطور المهمة'],
    ['glsl-example-functions', 'شرح الدوال'],
    ['glsl-example-variables', 'شرح المتغيرات'],
    ['glsl-example-constants', 'شرح الثوابت'],
    ['glsl-example-relationships', 'العلاقات بين العناصر'],
    ['glsl-example-tooltips', 'Tooltips'],
    ['glsl-example-images', 'الصور التوضيحية'],
    hasImguiComponents ? ['glsl-example-imgui-components', 'مكونات واجهة Dear ImGui'] : null,
    hasLayout ? ['glsl-example-layout', 'تصميم الواجهة'] : null,
    ['glsl-example-icons', 'الأيقونات'],
    ['glsl-example-integration', 'الدمج']
  ].filter(Boolean).map(([anchorId, label]) => renderGlslExampleLocalAnchorLink(label, anchorId));

  const glslLinks = (example.related || []).map((name) => renderGlslReferenceChip(name));
  const imguiLinks = (example.imguiWidgets || []).map((name) => renderImguiEntityLink(name, name, {
    className: 'related-link code-token',
    iconType: 'imgui'
  }));
  const nextExample = example.nextExampleId
    ? getGlslReadyExampleById(example.nextExampleId)
    : null;
  const nextExampleLink = nextExample
    ? `<a href="#" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(`ينقلك إلى المثال التالي المقترح: ${getGlslExampleDisplayTitle(nextExample)}`)}" onclick="showGlslExample('${escapeAttribute(nextExample.id)}'); return false;">${safeRenderEntityLabel(getGlslExampleDisplayTitle(nextExample), 'glsl', {code: false})}</a>`
    : '';

  return `
    <div class="glsl-example-link-groups">
      <div class="content-card prose-card">
        <h3>روابط التوثيق الداخلية</h3>
        <p><strong>رابط المثال:</strong> <code dir="ltr">${escapeHtml(exampleDocLink)}</code></p>
        <p><strong>رابط القسم:</strong> <code dir="ltr">${escapeHtml(sectionMeta.docLink || '')}</code></p>
        <p><strong>رابط المسار الحالي:</strong> <code dir="ltr">route:/docs/glsl-example/${escapeHtml(String(example.id || '').trim())}</code></p>
      </div>
      <div class="content-card prose-card">
        <h3>روابط أقسام الصفحة</h3>
        <div class="see-also-links">${sectionLinks.join(' ')}</div>
      </div>
      <div class="content-card prose-card">
        <h3>روابط GLSL المرتبطة</h3>
        <div class="see-also-links">${glslLinks.join(' ') || '<span class="related-link related-link-static">لا توجد عناصر إضافية.</span>'}</div>
      </div>
      <div class="content-card prose-card">
        <h3>روابط Dear ImGui المرتبطة</h3>
        <div class="see-also-links">${imguiLinks.join(' ') || '<span class="related-link related-link-static">لا توجد عناصر إضافية.</span>'}</div>
      </div>
      ${nextExampleLink ? `
        <div class="content-card prose-card">
          <h3>رابط المثال التالي</h3>
          <div class="see-also-links">${nextExampleLink}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderGlslExampleImageSpecs(images = []) {
  const entries = (Array.isArray(images) ? images : [])
    .slice()
    .sort((left, right) => {
      const rankDiff = getExampleImageTypeSortRank(left?.type) - getExampleImageTypeSortRank(right?.type);
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return String(left?.name || '').localeCompare(String(right?.name || ''), 'en');
    });
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-image-grid">
      ${entries.map((image) => `
        <article class="content-card prose-card glsl-example-image-card">
          <h3>${escapeHtml(getExampleImageTypeArabicLabel(image.type || ''))}</h3>
          <p><code dir="ltr">${escapeHtml(image.name || '')}</code></p>
          <p><strong>الوصف</strong></p>
          <p>${renderGlslExampleNarrative(sanitizeExampleImageFinalText(image.description || ''))}</p>
          <p><strong>المسار</strong></p>
          <p><code dir="ltr">${escapeHtml(image.path || '')}</code></p>
          <p><strong>Caption</strong></p>
          <p>${renderGlslExampleNarrative(sanitizeExampleImageFinalText(image.caption || ''))}</p>
          <p><strong>Alt</strong></p>
          <p>${escapeHtml(sanitizeExampleImageFinalText(image.alt || ''))}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleImguiComponents(components = []) {
  const entries = Array.isArray(components) ? components : [];
  if (!entries.length) {
    return '';
  }

  return `
    <div class="glsl-example-imgui-grid">
      ${entries.map((entry) => `
        <article class="content-card prose-card glsl-example-imgui-card">
          <h3>${renderImguiEntityLink(entry.name, entry.name, {
            className: 'related-link code-token',
            iconType: 'imgui',
            tooltip: entry.effect || entry.reason || entry.name
          })}</h3>
          <p><strong>النوع:</strong> ${escapeHtml(entry.type || '')}</p>
          <p><strong>لماذا استُخدم:</strong> ${renderImguiDocText(entry.reason || '')}</p>
          <p><strong>ما الذي يتحكم فيه أو يعرضه:</strong> ${renderImguiDocText(entry.controls || '')}</p>
          <p><strong>أثره العملي:</strong> ${renderImguiDocText(entry.effect || '')}</p>
          <p><strong>المصدر:</strong> ${escapeHtml(entry.source || 'Dear ImGui مباشر')}</p>
          <p><strong>أين يظهر:</strong> ${renderImguiDocText(entry.location || '')}</p>
          <p><strong>علاقته بالمثال:</strong> ${renderImguiDocText(entry.relation || '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleLayoutDesign(layoutDesign = null) {
  if (!layoutDesign) {
    return '';
  }

  const summary = String(layoutDesign.summary || '').trim();
  const bullets = Array.isArray(layoutDesign.bullets) ? layoutDesign.bullets : [];
  return renderGlslExampleSectionCard(`
    ${summary ? `<p>${renderImguiDocText(summary)}</p>` : ''}
    ${bullets.length ? renderTutorialList(bullets.map((entry) => `<p>${renderImguiDocText(entry)}</p>`)) : ''}
  `, 'glsl-example-layout-card');
}

function normalizeGlslExampleFileBase(example = {}) {
  const rawBase = String(example.fileBase || example.id || 'glsl_example').trim();
  return rawBase
    .replace(/^glsl-/, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'glsl_example';
}

function getGlslExampleElementEntries(example = {}) {
  const explicitEntries = Array.isArray(example.elements)
    ? example.elements.filter((entry) => entry?.name)
    : [];
  if (explicitEntries.length) {
    return explicitEntries;
  }

  return [...new Set((example.related || []).map((entry) => String(entry || '').trim()).filter(Boolean))]
    .slice(0, 8)
    .map((name) => {
      const referenceItem = /^ImGui::/.test(name)
        ? null
        : getGlslReferenceItem(name);
      const source = /^ImGui::/.test(name)
        ? 'Dear ImGui مباشر'
        : 'GLSL / GPU Side';
      const roleText = referenceItem
        ? preferArabicTooltipText(referenceItem.usage, buildGlslPracticalRole(referenceItem))
        : /^ImGui::/.test(name)
          ? 'يظهر هذا العنصر في واجهة المثال ليمنح المستخدم نقطة تحكم مباشرة أو ليعرض قيمة تفسيرية مرتبطة بالشيدر.'
          : 'يظهر هذا العنصر داخل الشيدر لأنه يحدد ربط القيم أو نوعها أو العملية التي يعتمد عليها المثال.';

      return {
        name,
        type: referenceItem ? localizeGlslKind(referenceItem.kind || 'عنصر GLSL') : (/^ImGui::/.test(name) ? 'Dear ImGui function' : 'عنصر GLSL'),
        source,
        role: roleText,
        value: referenceItem
          ? preferArabicTooltipText(referenceItem.description, 'يرتبط هذا العنصر مباشرة بدور عملي داخل المثال.')
          : 'يراجع القارئ المرجع الداخلي لهذا العنصر لمعرفة تفاصيله الكاملة.',
        iconType: /^ImGui::/.test(name) ? 'imgui' : 'glsl',
        tooltip: referenceItem
          ? buildGlslReferenceTooltip(referenceItem)
          : `يفتح شرح ${name} داخل المشروع إذا كان متاحًا.`
      };
    });
}

function getGlslExampleTooltipEntries(example = {}) {
  const explicitEntries = Array.isArray(example.tooltips)
    ? example.tooltips.filter((entry) => entry?.name)
    : [];
  const baseEntries = explicitEntries.length
    ? explicitEntries
    : getGlslExampleElementEntries(example).map((entry) => {
      const name = String(entry.name || '').trim();
      const referenceItem = /^ImGui::/.test(name)
        ? null
        : getGlslReferenceItem(name);
      const source = entry.source || (/^ImGui::/.test(name) ? 'Dear ImGui مباشر' : 'GLSL / GPU Side');

      return {
        name,
        type: entry.type || (referenceItem ? localizeGlslKind(referenceItem.kind || 'عنصر GLSL') : 'عنصر مرتبط بالمثال'),
        source,
        meaning: referenceItem
          ? preferArabicTooltipText(referenceItem.description, buildGlslPracticalRole(referenceItem))
          : entry.role || 'هذا العنصر جزء من المثال الحالي ويؤثر في تدفق القيم أو في النتيجة البصرية أو في الواجهة المرافقة.',
        why: entry.role || (referenceItem
          ? preferArabicTooltipText(referenceItem.usage, 'يظهر هنا لأن المثال يعتمد عليه لشرح الفكرة أو لتمرير البيانات بين المراحل.')
          : 'استُخدم هنا لأنه يمثل نقطة تعليمية مباشرة يراها القارئ داخل الكود أو داخل الواجهة.'),
        where: /^ImGui::/.test(name)
          ? 'يظهر داخل نافذة Dear ImGui المرافقة لهذا المثال ويؤثر في القيم التي يرسلها التطبيق إلى الشيدر.'
          : 'يظهر داخل كود الشيدر نفسه أو في الربط بين التطبيق والشيدر بحسب طبيعة العنصر.',
        effect: /^ImGui::/.test(name)
          ? 'يغير القيمة أو النمط أو طريقة العرض التي يراها المستخدم أثناء التجربة الحية.'
          : 'يؤثر في بنية الشيدر أو في الحساب أو في شكل القيم التي تصل إلى النتيجة النهائية.',
        range: entry.value || 'يعتمد المجال المتوقع على نوع العنصر والسياق الذي يرد فيه داخل المثال.',
        sensitive: /^ImGui::/.test(name)
          ? 'نسيان ربط هذا العنصر بحالة التطبيق يجعل واجهة المثال تبدو صحيحة بينما لا يتغير الناتج البصري فعلًا.'
          : 'أي عدم تطابق بين هذا العنصر وبين الربط الفعلي أو نوع البيانات قد يقود إلى نتيجة صامتة أو إلى خرج بصري مضلل.',
        commonErrors: /^ImGui::/.test(name)
          ? 'استخدام عنصر واجهة من دون تحديث الحالة المقابلة على CPU side.'
          : 'استخدام العنصر بصيغة لا تطابق السياق أو نسيان ربطه بما يقابله في التطبيق.',
        links: [name, ...(example.related || []).filter((relatedName) => relatedName && relatedName !== name).slice(0, 2)],
        iconType: entry.iconType || (/^ImGui::/.test(name) ? 'imgui' : 'glsl')
      };
    });

  const exampleId = String(example?.id || '').trim();
  const overrideMap = GLSL_EXAMPLE_TOOLTIP_OVERRIDES?.[exampleId] || {};
  const mergedEntries = baseEntries.map((entry) => {
    const name = String(entry.name || '').trim();
    const override = overrideMap[name] || {};
    return {
      ...entry,
      ...override,
      name
    };
  });

  const extraEntries = Object.entries(overrideMap)
    .filter(([name]) => !mergedEntries.some((entry) => String(entry.name || '').trim() === name))
    .map(([name, override]) => ({
      name,
      type: override.type || (/^ImGui::/.test(name) ? 'Dear ImGui widget' : 'عنصر مرتبط بالمثال'),
      source: override.source || (/^ImGui::/.test(name) ? 'Dear ImGui مباشر' : 'GLSL / GPU Side'),
      meaning: override.meaning || 'هذا العنصر أضيف إلى tooltip coverage لأنه مؤثر في فهم المثال الحالي.',
      why: override.why || 'يظهر هنا لأنه جزء مهم من الفكرة التعليمية للمثال.',
      where: override.where || 'يؤثر داخل المثال الحالي أو في واجهته المرافقة.',
      effect: override.effect || 'يؤثر في النتيجة البصرية أو في طريقة تمرير القيم.',
      range: override.range || 'يعتمد المجال المتوقع على السياق الحالي.',
      sensitive: override.sensitive || 'يحتاج تطابقًا صحيحًا مع بقية أجزاء المثال.',
      commonErrors: override.commonErrors || 'سوء فهم دوره أو ربطه يؤدي إلى نتيجة غير واضحة.',
      links: override.links || [name],
      iconType: override.iconType || (/^ImGui::/.test(name) ? 'imgui' : 'glsl')
    }));

  return [...mergedEntries, ...extraEntries];
}

function buildFallbackGlslExamplePhases(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const hasUniform = /\buniform\b/.test(`${example.vertexShader || ''}\n${example.fragmentShader || ''}`);
  const hasTexture = /sampler2D|texture\s*\(/.test(`${example.vertexShader || ''}\n${example.fragmentShader || ''}`);
  const hasTime = /\btime\b|u_Time|uTime|sin\s*\(/i.test(`${example.vertexShader || ''}\n${example.fragmentShader || ''}`);

  return [
    {
      title: 'المرحلة 1: لماذا هذا المثال موجود',
      what: example.goal || `يوجد هذا المثال لشرح جزء أساسي من قسم ${section.title}.`,
      why: `لأنه يقدم لبنة تعليمية مباشرة داخل ${section.title} قبل الانتقال إلى أمثلة أكثر تشعبًا.`,
      inputs: 'فكرة المثال وهدفه التعليمي وبنية الشيدر الأساسية.',
      outputs: 'توقع واضح لما يجب أن يراه القارئ في النتيجة.',
      problems: 'الخلط بين موضوع المثال وبين مفاهيم متقدمة لم يصل إليها القارئ بعد.',
      visible: 'يدرك المستخدم ما الذي يجب مراقبته بصريًا قبل قراءة الكود.'
    },
    {
      title: 'المرحلة 2: تجهيز الملفات والموارد',
      what: `يجهز المثال ملف ${GLSL_VERTEX_STAGE_ARABIC_LABEL} وملف ${GLSL_FRAGMENT_STAGE_ARABIC_LABEL}${hasTexture ? ' مع خامة أو sampler مناسب' : ''}.`,
      why: 'لأن فصل المراحل في ملفات مستقلة يجعل العلاقة بين المدخلات والنتيجة أسهل في التتبع داخل المشروع.',
      inputs: hasTexture ? 'ملفات الشيدر، مورد texture، وبيانات الإدخال.' : 'ملفات الشيدر وبيانات الإدخال القادمة من التطبيق.',
      outputs: 'ملفات جاهزة للترجمة والربط داخل التطبيق.',
      problems: 'أسماء ملفات غير متسقة أو مسارات لا تطابق تسجيل المثال داخل المشروع.',
      visible: 'لا يرى المستخدم تغييرًا بصريًا هنا، لكن يبدأ المثال من ملفات واضحة ومسماة بوضوح.'
    },
    {
      title: 'المرحلة 3: تجهيز مدخلات CPU Side',
      what: hasUniform || hasTexture || hasTime
        ? 'يجهز التطبيق القيم التي ستنتقل إلى الشيدر مثل المواضع أو الـ uniforms أو الخامات قبل تنفيذ الرسم.'
        : 'يجهز التطبيق مواضع الرؤوس والربط الأدنى اللازم لتشغيل الشيدر كما هو.',
      why: 'لأن الشيدر لا يملك هذه القيم من تلقاء نفسه، بل يتسلمها من التطبيق في لحظة الرسم.',
      inputs: hasTime
        ? 'بيانات الرؤوس والزمن التراكمي والقيم المتغيرة بين الإطارات.'
        : hasUniform
          ? 'بيانات الرؤوس والقيم الموحدة التي يرسلها التطبيق.'
          : 'بيانات الرؤوس وربط السمات الأساسية.',
      outputs: 'قناة ربط مستقرة بين CPU side وبين الشيدر.',
      problems: 'نسيان تحديث uniform أو mismatch بين layout والمورد المربوط.',
      visible: 'يبدأ المثال بالاستجابة للقيم القادمة من التطبيق بدل أن يبقى ثابتًا بلا سياق.'
    },
    {
      title: 'المرحلة 4: تنفيذ مظلّل الرؤوس',
      what: 'تعالج مرحلة الرؤوس كل رأس وتقرر إما موضعه النهائي أو القيم التي ستمر إلى المرحلة اللاحقة.',
      why: 'لأن أي خطأ في هذه المرحلة يظهر فورًا في موضع الشكل أو في القيم المتاحة للمرحلة التالية.',
      inputs: 'Vertex attributes مثل الموضع أو UV أو القيم المرسلة من التطبيق.',
      outputs: '`gl_Position` ومخرجات الواجهة المتجهة إلى Rasterization.',
      problems: 'نسيان كتابة `gl_Position` أو استخدام فضاء غير صحيح.',
      visible: 'إما أن يظهر الشكل في المكان الصحيح، أو يختفي/يتشوه إذا انكسر هذا الجزء.'
    },
    {
      title: 'المرحلة 5: تنفيذ مظلّل الأجزاء',
      what: 'تقرأ هذه المرحلة القيم المستلمة بعد interpolation وتحسب اللون النهائي أو المؤثر المرئي لكل جزء لوني.',
      why: 'لأن المعنى البصري الحقيقي للمثال يتجسد هنا، سواء كان لونًا ثابتًا أو خامة أو مؤثرًا زمنيًا.',
      inputs: hasTexture
        ? 'القيم interpolated والخامات أو العينات المرتبطة.'
        : hasUniform
          ? 'القيم interpolated وبيانات uniform المرسلة من التطبيق.'
          : 'القيم interpolated أو القيم الثابتة المعرفة داخل الشيدر.',
      outputs: 'اللون النهائي المكتوب إلى المخرج مثل `outColor`.',
      problems: 'إخراج لون غير صحيح أو العمل في مساحة قيم لا تطابق هدف المثال.',
      visible: 'يرى المستخدم اللون النهائي أو التدرج أو المؤثر الذي يشرح فكرة المثال.'
    },
    {
      title: 'المرحلة 6: التحقق والتشخيص',
      what: 'تراجع النتيجة بصريًا ثم تقارنها بهدف المثال وتفحص الأسطر أو القيم التي تتحكم في الاختلاف.',
      why: 'لأن القيمة التعليمية لا تكتمل بمجرد ظهور الناتج، بل بفهم سبب ظهوره بهذه الصورة وكيفية اكتشاف عطله.',
      inputs: 'النتيجة المرئية الحالية ومقارنة الهدف بالكود والربط.',
      outputs: 'ثقة بأن المثال يعمل كما شُرح أو قائمة تشخيص واضحة إذا ظهر خلل.',
      problems: 'الاكتفاء بمشاهدة لقطة نهائية من دون ربطها بتدفق القيم والسياق.',
      visible: 'يستطيع المستخدم الآن ربط السطر المؤثر بالأثر البصري نفسه.'
    }
  ];
}

function buildFallbackGlslExampleDataFlow(example = {}) {
  const combinedCode = `${example.vertexShader || ''}\n${example.fragmentShader || ''}`;
  const hasTexture = /sampler2D|texture\s*\(/.test(combinedCode);
  const hasUniform = /\buniform\b/.test(combinedCode);

  return [
    {
      title: 'مدخلات التطبيق',
      description: hasUniform || hasTexture
        ? 'يبدأ التدفق من التطبيق الذي يجهز vertex data ويضيف القيم الموحدة أو الموارد التي يتوقع الشيدر قراءتها.'
        : 'يبدأ التدفق من التطبيق الذي يرسل بيانات الرؤوس الأساسية فقط إلى مرحلة الرسم.',
      effect: 'أي نقص أو عدم تطابق هنا سينعكس مباشرة على المراحل التالية حتى لو بدا كود الشيدر صحيحًا.'
    },
    {
      title: GLSL_VERTEX_STAGE_ARABIC_LABEL,
      description: 'تقرأ مرحلة الرؤوس السمات الداخلة، وتحسب `gl_Position`، وقد تمرر قيماً إضافية إلى المرحلة التالية.',
      effect: 'تحدد هذه المرحلة شكل التوزيع الهندسي والقيم الأولية التي ستخضع لـ interpolation.'
    },
    {
      title: 'Rasterization والربط بين المراحل',
      description: 'يحّول النظام المخرجات الهندسية إلى أجزاء لونية وي interpolates القيم بين الرؤوس قبل دخول `مظلّل الأجزاء`.',
      effect: 'هنا تتحول القيم المنفصلة عند الرؤوس إلى قيم مستمرة عبر سطح الشكل.'
    },
    {
      title: GLSL_FRAGMENT_STAGE_ARABIC_LABEL,
      description: hasTexture
        ? 'تقرأ هذه المرحلة القيم interpolated وتعاين الخامة أو الموارد المرتبطة ثم تكتب اللون النهائي.'
        : 'تستخدم هذه المرحلة القيم المستلمة أو القيم الثابتة لحساب اللون النهائي لكل جزء لوني.',
      effect: 'هذه هي المرحلة التي يرى المستخدم أثرها مباشرة في اللون أو المؤثر النهائي.'
    },
    {
      title: 'الخرج النهائي',
      description: 'يكتب اللون إلى الهدف اللوني أو إلى صورة وسيطة ثم يظهر داخل نافذة التطبيق أو داخل pass لاحقة.',
      effect: 'تظهر هنا النتيجة النهائية التي يقارنها القارئ بهدف المثال وبحالة الواجهة إن وجدت.'
    }
  ];
}

function buildFallbackGlslExampleImportantLines(example = {}) {
  const patternEntries = [
    {
      regex: /layout\s*\(\s*location\s*=\s*\d+\s*\)\s*in\b/,
      what: 'يعرّف مدخلًا صريح الموضع داخل واجهة الشيدر.',
      why: 'لأن الموضع الصريح يمنع الالتباس بين ترتيب السمات في التطبيق وبين ما يتوقعه الشيدر.',
      ifMissing: 'قد يعتمد المثال على ربط ضمني أقل وضوحًا، أو قد يفشل التطابق مع التطبيق بالكامل.'
    },
    {
      regex: /layout\s*\(\s*location\s*=\s*\d+\s*\)\s*out\b/,
      what: 'يحدد مخرجًا صريحًا ينتقل إلى المرحلة التالية أو إلى الهدف اللوني.',
      why: 'لأن الربط الصريح يجعل انتقال القيم بين المراحل أو إلى `framebuffer` قابلًا للتتبع.',
      ifMissing: 'يصبح تتبع تدفق القيمة أصعب، وقد يقع mismatch مع المخرجات المتوقعة.'
    },
    {
      regex: /\buniform\b/,
      what: 'يعلن قناة تأتي قيمتها من التطبيق بدل تثبيتها داخل الشيدر نفسه.',
      why: 'لأن المثال يريد تغيير السلوك أو اللون أو الزمن من جهة التطبيق من دون إعادة ترجمة الشيدر.',
      ifMissing: 'سيتحول المثال إلى قيمة ثابتة داخل الكود ولن يشرح الربط الحقيقي مع CPU side.'
    },
    {
      regex: /\bgl_Position\s*=/,
      what: 'يكتب الموضع النهائي للرأس داخل فضاء القص، وهو السطر الذي يقرر أين يظهر الشكل على الشاشة.',
      why: 'لأن خط الأنابيب لا يستطيع متابعة الرأس رسوميًا من دون قيمة `gl_Position` صريحة وصحيحة.',
      ifMissing: 'يختفي الشكل أو يصبح سلوكه غير معرّف لأن مرحلة الرؤوس لم تنتج موضعًا صالحًا.'
    },
    {
      regex: /\boutColor\s*=/,
      what: 'يكتب اللون النهائي الذي ستستقبله الوجهة اللونية من هذه المرحلة.',
      why: 'لأن قيمة المثال البصرية كلها تتجسد في هذا السطر أو في القيم التي يغذيها.',
      ifMissing: 'لن تصل النتيجة المقصودة إلى الهدف اللوني حتى لو نُفذت الحسابات السابقة.'
    },
    {
      regex: /\btexture\s*\(/,
      what: 'يقرأ قيمة من texture مرتبطة بالمثال بدل الاعتماد على لون ثابت.',
      why: 'لأن هذا السطر هو لحظة انتقال المثال من قيم إجرائية بسيطة إلى خامة بصرية حقيقية.',
      ifMissing: 'ستفقد المادة أو المؤثر مصدره البصري الأساسي وتظهر النتيجة فارغة أو ثابتة.'
    },
    {
      regex: /\bnormalize\s*\(/,
      what: 'يوحد طول المتجه قبل استخدامه في حسابات اتجاهية حساسة.',
      why: 'لأن عمليات الإضاءة والاتجاهات تفترض غالبًا متجهات ذات طول موحد حتى تعبر النتيجة عن الاتجاه لا عن مقدار المتجه.',
      ifMissing: 'ستصبح شدة النتيجة متأثرة بطول المتجه نفسه بدل اتجاهه الحقيقي.'
    },
    {
      regex: /\bdot\s*\(/,
      what: 'يقيس التقارب الاتجاهي بين متجهين، وغالبًا ما يستخدم لاشتقاق شدة إضاءة أو عامل مزج.',
      why: 'لأن المثال يحتاج رقمًا واحدًا يختصر العلاقة الزاوية بين قيمتين اتجاهيتين.',
      ifMissing: 'تنهار العلاقة بين الاتجاه والنتيجة البصرية وتفقد المعادلة معناها الفيزيائي أو الفني.'
    },
    {
      regex: /\bmix\s*\(/,
      what: 'يمزج بين قيمتين بنسبة محددة داخل الشيدر.',
      why: 'لأن المثال يريد الانتقال التدريجي بين حالتين بدل القفز الحاد بينهما.',
      ifMissing: 'سيفقد المثال القدرة على بناء انتقالات ناعمة أو قيم مشتقة بين حالتين.'
    },
    {
      regex: /\bsin\s*\(/,
      what: 'يولد تغيرًا دوريًا يستند عادة إلى الزمن أو إلى الإحداثيات.',
      why: 'لأن الحركة الموجية أو التذبذب الزمني في المثال يعتمد على دالة دورية متوقعة ومستمرة.',
      ifMissing: 'سيفقد المثال الجانب الحركي أو الموجي الذي يشرح فكرة الزمن فيه.'
    }
  ];

  const collected = [];
  const seenCodes = new Set();
  const sources = [
    {label: 'vertex', code: String(example.vertexShader || '')},
    {label: 'fragment', code: String(example.fragmentShader || '')}
  ];

  sources.forEach(({label, code}) => {
    code.split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line !== '{' && line !== '}')
      .forEach((line) => {
        if (collected.length >= 6 || seenCodes.has(line)) {
          return;
        }
        const matchedPattern = patternEntries.find((entry) => entry.regex.test(line));
        if (!matchedPattern) {
          return;
        }
        seenCodes.add(line);
        collected.push({
          source: label,
          code: line,
          what: matchedPattern.what,
          why: matchedPattern.why,
          ifMissing: matchedPattern.ifMissing
        });
      });
  });

  return collected;
}

function buildFallbackGlslExampleImageSpecs(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const base = normalizeGlslExampleFileBase(example);
  const sectionSlug = String(section.id || 'general').replace(/[^a-z0-9-]+/gi, '-');

  return [
    {
      name: `${base}-preview-final`,
      type: 'preview',
      purpose: 'إظهار الناتج الصحيح للمثال كما يجب أن يراه القارئ عند تشغيله.',
      description: localizeGlslStageLabels(example.expectedResult || `لقطة نهائية توضح نتيجة مثال ${getGlslExampleDisplayTitle(example) || base} داخل قسم ${section.title}.`),
      path: `assets/example-previews/glsl/${sectionSlug}/${base}-preview.webp`,
      alt: `المعاينة النهائية لمثال ${getGlslExampleDisplayTitle(example) || localizeGlslStageLabels(base)}`,
      caption: `لقطة رئيسية تعرض النتيجة الفعلية لمثال ${getGlslExampleDisplayTitle(example) || localizeGlslStageLabels(base)} داخل نافذة التطبيق.`,
      stage: 'النتيجة النهائية',
      related: (example.related || []).slice(0, 4),
      position: 'تظهر بعد قسم الكود مباشرة حتى يقارن القارئ بين النص والنتيجة المرئية.'
    },
    {
      name: `${base}-pipeline-diagram`,
      type: 'pipeline diagram',
      purpose: 'توضيح المسار الذي تنتقل فيه القيم من التطبيق إلى الشيدر ثم إلى النتيجة النهائية.',
      description: 'مخطط بصري يربط CPU side بمرحلة الرؤوس ثم مرحلة الأجزاء ثم الخرج النهائي، مع إبراز العنصر الأهم في هذا المثال باللون أو بالشرح الجانبي.',
      path: `assets/example-previews/glsl/${sectionSlug}/${base}-pipeline.webp`,
      alt: `مخطط تدفق البيانات لمثال ${getGlslExampleDisplayTitle(example) || localizeGlslStageLabels(base)}`,
      caption: 'مخطط يوضح انتقال البيانات من التطبيق إلى مراحل الشيدر ثم إلى الخرج النهائي.',
      stage: 'تسلسل مرور البيانات',
      related: ['gl_Position', ...(example.related || []).slice(0, 3)],
      position: 'تظهر قرب قسم تسلسل مرور البيانات أو قبله مباشرة.'
    },
    {
      name: `${base}-error-comparison`,
      type: 'before/after',
      purpose: 'بيان الفرق بين الحالة الصحيحة والحالة المعطلة أو بين وضعين مهمين في المثال.',
      description: `صورة مقارنة تعليمية تعرض الناتج الصحيح في جهة، وفي الجهة الأخرى خطأ شائعًا مرتبطًا بقسم ${section.title} مثل mismatch في الربط أو غياب uniform أو قراءة texture غير صحيحة.`,
      path: `assets/example-previews/glsl/${sectionSlug}/${base}-comparison.webp`,
      alt: `مقارنة تعليمية لمثال ${getGlslExampleDisplayTitle(example) || localizeGlslStageLabels(base)}`,
      caption: 'مقارنة بين النتيجة الصحيحة وحالة عطل شائعة مرتبطة بالمثال.',
      stage: 'التشخيص واكتشاف الأخطاء',
      related: (example.related || []).slice(0, 4),
      position: 'توضع داخل قسم أخطاء شائعة ومؤشرات العطل أو بعده مباشرة.'
    }
  ];
}

function buildFallbackGlslExampleIntegration(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const base = normalizeGlslExampleFileBase(example);
  const hasImgui = String(example.imguiCode || '').trim();
  const combinedCode = `${example.vertexShader || ''}\n${example.fragmentShader || ''}`;
  const hasTexture = /sampler2D|texture\s*\(/.test(combinedCode);
  const hasUniform = /\buniform\b/.test(combinedCode);
  const hasTime = /\btime\b|u_Time|uTime|sin\s*\(/i.test(combinedCode);

  return {
    fileName: `examples/glsl/${base}/${base}_example.cpp`,
    location: `قسم GLSL -> ${section.title}`,
    section: `أمثلة لغة التظليل / ${section.title}`,
    imguiWindow: hasImgui ? getGlslExampleDisplayTitle(example) : 'لا توجد نافذة Dear ImGui إلزامية في هذا المثال.',
    registrationSteps: [
      `أضف تعريف المثال تحت القسم ${section.internalLinkLabel || section.title}.`,
      'اربط بطاقة المعاينة بالمعرف الحالي داخل فهرس أمثلة لغة التظليل.',
      'سجل الروابط الداخلية للعناصر المهمة حتى تبقى قابلة للنقر من الكود والشرح.'
    ],
    resources: [
      'ملف مظلّل رؤوس.',
      'ملف مظلّل أجزاء.',
      hasTexture ? 'Texture أو sampler مطابق للربط المستخدم داخل الشيدر.' : '',
      hasUniform ? 'بنية قيم موحدة أو UBO يحمل القيم التي يغيّرها التطبيق.' : '',
      hasImgui ? 'نافذة Dear ImGui أو لوحة جانبية مرتبطة بحالة المثال.' : ''
    ].filter(Boolean),
    cpuSide: [
      'تحميل ملفات الشيدر وربطها مع نظام الترجمة أو التضمين في المشروع.',
      'تحديث السمات الداخلة والربط مع `layout(location)` الوارد في الشيدر.',
      hasUniform ? 'تحديث القيم الموحدة قبل الرسم حتى تتطابق الواجهة مع النتيجة.' : '',
      hasTime ? 'تمرير الزمن التراكمي كل إطار إذا كان المثال يعتمد على الحركة أو التذبذب.' : ''
    ].filter(Boolean),
    gpuSide: [
      'تنفيذ مرحلة الرؤوس لتجهيز `gl_Position` ومخرجات الواجهة.',
      'تنفيذ مرحلة الأجزاء لحساب اللون النهائي أو المؤثر المقصود.',
      hasTexture ? 'قراءة texture أو sampler في لحظة الحساب داخل المرحلة المناسبة.' : ''
    ].filter(Boolean),
    testing: [
      'ابدأ بالنتيجة الأبسط المتوقعة قبل إضافة أي قيمة متغيرة أو مورد خارجي.',
      hasUniform ? 'غيّر قيمة واحدة فقط من التطبيق أو من الواجهة وتأكد أن أثرها يظهر فورًا.' : '',
      hasTexture ? 'اختبر أولًا texture مرجعية واضحة التباين قبل الانتقال إلى خامات أكثر تعقيدًا.' : ''
    ].filter(Boolean),
    validation: [
      'قارن النتيجة بالهدف المذكور أعلى الصفحة وبالصورة التوضيحية الخاصة بالمثال.',
      'افحص أن الروابط الداخلية للعناصر المهمة تعمل من داخل الكود والشرح.',
      'إذا انكسرت النتيجة، ابدأ من `layout(location)` ثم من القيم الموحدة ثم من السطر الذي يكتب الخرج النهائي.'
    ]
  };
}

function buildFallbackGlslExampleCommonErrors(example = {}) {
  const combinedCode = `${example.vertexShader || ''}\n${example.fragmentShader || ''}`;
  const hasTexture = /sampler2D|texture\s*\(/.test(combinedCode);
  const hasUniform = /\buniform\b/.test(combinedCode);
  const hasTime = /\btime\b|u_Time|uTime|sin\s*\(/i.test(combinedCode);

  return [
    'عدم تطابق `layout(location)` بين التطبيق والشيدر يجعل القيم تصل إلى مدخلات خاطئة حتى لو بدا الكود سليمًا.',
    'نسيان كتابة `gl_Position` أو كتابته في فضاء غير صحيح يؤدي غالبًا إلى اختفاء الشكل أو ظهوره خارج الإطار.',
    hasUniform ? 'تغيير قيمة في التطبيق من دون تحديث القناة الموحدة قبل الرسم يجعل واجهة المثال أو منطق التطبيق منفصلًا عن النتيجة البصرية.' : '',
    hasTexture ? 'ربط texture مختلفة عن التي يتوقعها الشيدر أو نسيان sampler الصحيح يجعل المثال يبدو كما لو أن الكود لا يعمل بينما المشكلة في المورد.' : '',
    hasTime ? 'عدم تحديث الزمن التراكمي بين الإطارات يجعل المثال الزمني يبدو متجمّدًا أو غير متسق.' : ''
  ].filter(Boolean);
}

function buildFallbackGlslExampleLearningOutcomes(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  return [
    `فهم موقع هذا المثال داخل خريطة التعلم الخاصة بقسم ${section.title}.`,
    'القدرة على ربط السطر المؤثر في الشيدر بالأثر البصري الذي يظهر على الشاشة.',
    'اكتساب تصور أوضح لتدفق البيانات بين CPU side وGPU side والمراحل الوسيطة داخل المثال.'
  ];
}

function buildGlslExampleFileEntries(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const base = normalizeGlslExampleFileBase(example);
  const fileRoot = `examples/glsl/${base}`;
  const entries = [
    {
      name: `${base}.vert`,
      type: 'GLSL Vertex Shader',
      path: `${fileRoot}/${base}.vert`,
      purpose: 'يحتوي مرحلة الرؤوس التي تستقبل السمات الداخلة وتكتب `gl_Position` أو القيم التي تنتقل إلى المرحلة التالية.',
      relation: 'يرتبط مباشرة بملف الربط على CPU side لأنه يحدد شكل المدخلات المطلوبة من التطبيق.'
    },
    {
      name: `${base}.frag`,
      type: 'GLSL Fragment Shader',
      path: `${fileRoot}/${base}.frag`,
      purpose: 'يحمل الحساب النهائي للون أو للمؤثر المرئي الذي يميز المثال.',
      relation: 'يعتمد على ما يمر من مرحلة الرؤوس وعلى الموارد التي يربطها التطبيق قبل الرسم.'
    },
    {
      name: `${base}_example.cpp`,
      type: 'CPU integration',
      path: `${fileRoot}/${base}_example.cpp`,
      purpose: 'ملف الربط المقترح الذي يحمّل الشيدر، يجهز الموارد، ويغذي القيم القادمة من التطبيق.',
      relation: 'يربط بين ملفات GLSL وبين دورة الرسم الفعلية داخل المشروع الحالي.'
    }
  ];

  if (String(example.imguiCode || '').trim()) {
    entries.push({
      name: `${base}_imgui_panel.cpp`,
      type: 'Dear ImGui panel',
      path: `${fileRoot}/${base}_imgui_panel.cpp`,
      purpose: 'ينظم نافذة Dear ImGui الخاصة بالمثال ويحوّل حالة الواجهة إلى قيم قابلة للربط مع الشيدر.',
      relation: 'يعمل فوق CPU side ليغير الإعدادات التي ترسل لاحقًا إلى GPU side.'
    });
  }

  entries.push({
    name: `${base}_preview.webp`,
    type: 'Preview image',
    path: `assets/example-previews/glsl/${section.id}/${base}-preview.webp`,
    purpose: 'يمثل الناتج البصري الصحيح للمثال أو الصورة التعليمية المرجعية له.',
    relation: 'يستخدم في بطاقة المعاينة وفي صفحة المثال للمقارنة بين الكود والناتج.'
  });

  return entries;
}

function renderGlslExampleFiles(example, sectionMeta = null) {
  const files = buildGlslExampleFileEntries(example, sectionMeta);
  return `
    <div class="glsl-example-file-grid">
      ${files.map((file) => `
        <article class="content-card prose-card glsl-example-file-card">
          <div class="glsl-ready-example-meta">
            <span class="glsl-ready-example-category">${escapeHtml(file.type || 'ملف')}</span>
            <span class="glsl-ready-example-type">${renderEntityIcon('file', 'ui-codicon list-icon', 'ملف')} ملف مقترح</span>
          </div>
          <h3><code dir="ltr">${escapeHtml(file.name || '')}</code></h3>
          <p><strong>المسار المقترح:</strong> <code dir="ltr">${escapeHtml(file.path || '')}</code></p>
          <p><strong>وظيفة الملف:</strong> ${renderGlslExampleNarrative(file.purpose || '')}</p>
          <p><strong>علاقته ببقية الملفات:</strong> ${renderGlslExampleNarrative(file.relation || '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function buildGlslExampleDefinitionGroups(example = {}) {
  const mergedEntries = [];
  const seenNames = new Set();

  [...getGlslExampleTooltipEntries(example), ...getGlslExampleElementEntries(example)].forEach((entry) => {
    const name = String(entry?.name || '').trim();
    if (!name || seenNames.has(name)) {
      return;
    }
    seenNames.add(name);
    mergedEntries.push(entry);
  });

  return mergedEntries.reduce((groups, entry) => {
    const name = String(entry.name || '').trim();
    const type = String(entry.type || '').trim();
    const source = String(entry.source || '').trim();
    const isFunction = /^ImGui::/.test(name) || /function/i.test(type);
    const isConstant = name === name.toUpperCase() || /constant|macro|ثابت|ماكرو/i.test(type);

    if (isFunction) {
      groups.functions.push(entry);
    } else if (isConstant) {
      groups.constants.push(entry);
    } else {
      groups.variables.push(entry);
    }

    if (/Dear ImGui/i.test(source) && !groups.widgets.some((widget) => widget.name === name)) {
      groups.widgets.push(entry);
    }

    return groups;
  }, {
    functions: [],
    variables: [],
    constants: [],
    widgets: []
  });
}

function renderGlslExampleDefinitionCards(entries = [], emptyText = '') {
  if (!entries.length) {
    return renderGlslExampleSectionCard(`<p>${escapeHtml(emptyText)}</p>`, 'glsl-example-support-card');
  }

  return `
    <div class="glsl-example-definition-grid">
      ${entries.map((entry) => `
        <article class="content-card prose-card glsl-example-definition-card">
          <h3>${renderGlslExampleEntity(entry.name, {
            tooltip: entry.meaning || entry.role || entry.tooltip || entry.name,
            iconType: entry.iconType || (/^ImGui::/.test(String(entry.name || '')) ? 'imgui' : /function/i.test(String(entry.type || '')) ? 'command' : 'variable')
          })}</h3>
          <p><strong>النوع:</strong> ${escapeHtml(entry.type || 'عنصر تقني')}</p>
          <p><strong>المصدر:</strong> ${escapeHtml(entry.source || 'GLSL')}</p>
          <p><strong>المعنى الحقيقي:</strong> ${renderGlslExampleNarrative(entry.meaning || entry.role || entry.value || '')}</p>
          <p><strong>لماذا استُخدم هنا:</strong> ${renderGlslExampleNarrative(entry.why || entry.role || '')}</p>
          <p><strong>تأثيره على الناتج:</strong> ${renderGlslExampleNarrative(entry.effect || entry.value || 'يظهر أثره عبر العلاقة بين هذا العنصر وبين بقية أسطر المثال أو واجهته.')}</p>
          <p><strong>العلاقات المرتبطة:</strong> <span class="see-also-links">${(entry.links || []).map((linkName) => renderGlslExampleEntity(linkName, {
            tooltip: `يفتح مرجع ${linkName} داخل المشروع.`,
            iconType: /^ImGui::/.test(String(linkName || '')) ? 'imgui' : 'variable'
          })).join(' ') || '<span class="related-link related-link-static">يراجع القسم ذاته والعناصر المجاورة.</span>'}</span></p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleRelationships(example = {}, integration = null) {
  const resolvedIntegration = integration || buildFallbackGlslExampleIntegration(example);
  const hasImgui = String(example.imguiCode || '').trim();

  return `
    <div class="glsl-example-relationship-grid">
      ${renderGlslExampleSectionCard(`
        <h3>CPU Side → الشيدر</h3>
        ${renderGlslExampleList(resolvedIntegration.cpuSide || [])}
      `, 'glsl-example-relationship-card')}
      ${renderGlslExampleSectionCard(`
        <h3>GPU Side → الناتج</h3>
        ${renderGlslExampleList(resolvedIntegration.gpuSide || [])}
      `, 'glsl-example-relationship-card')}
      ${renderGlslExampleSectionCard(`
        <h3>كيف ترتبط عناصر الواجهة بالقيم؟</h3>
        ${hasImgui
          ? renderGlslExampleList(example.interactionModel || [
            'تكتب واجهة Dear ImGui القيم في بنية حالة على CPU side.',
            'تنتقل هذه الحالة إلى uniforms أو push constants أو مورد مكافئ قبل الرسم.',
            'يعكس الشيدر التغييرات مباشرة في النتيجة المرئية أو في أوضاع Debug.'
          ], 'imgui')
          : '<p>هذا المثال لا يعتمد على نافذة Dear ImGui، لذلك تأتي جميع القيم من الربط المباشر في التطبيق أو من الموارد الثابتة.</p>'}
      `, 'glsl-example-relationship-card')}
      ${renderGlslExampleSectionCard(`
        <h3>من الكود إلى الشاشة</h3>
        <p>${renderGlslExampleNarrative(example.expectedResult || '')}</p>
        <p class="glsl-example-inline-note"><strong>العلاقة المركزية:</strong> ${renderGlslExampleNarrative('أي تغيير في القيم التي تصل من CPU side أو في السطر الذي يكتب الخرج النهائي سيظهر مباشرة في الناتج البصري الذي يقارن به القارئ هذا المثال.')}</p>
      `, 'glsl-example-relationship-card')}
    </div>
  `;
}

function renderGlslExampleIconGuide(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const iconEntries = [
    {
      iconHtml: `<span class="glsl-example-section-icon-symbol">${escapeHtml(section.icon)}</span>`,
      title: `أيقونة القسم: ${section.title}`,
      reason: 'تستعمل لتمييز هوية القسم التعليمي الذي ينتمي إليه المثال داخل الفهرس والصفحة الكاملة.',
      place: 'فهرس أقسام أمثلة لغة التظليل وبطاقة المثال الحالية.'
    },
    {
      iconHtml: renderEntityIcon('glsl', 'ui-codicon list-icon', 'عنصر GLSL'),
      title: 'أيقونة عنصر GLSL',
      reason: 'تظهر مع عناصر الشيدر والدوال والأنواع المرتبطة بلغة التظليل داخل الكود والشرح.',
      place: 'حول الروابط الداخلية، وعناصر الكود، وجداول الشرح.'
    },
    {
      iconHtml: renderEntityIcon('command', 'ui-codicon list-icon', 'دالة أو عملية'),
      title: 'أيقونة دالة أو عملية',
      reason: 'تُستخدم عندما يكون العنصر إجراءً أو استدعاءً أو خطوة تنفيذية يجب إبرازها كفعل مؤثر.',
      place: 'قسم الدوال، أوامر التحويل، والعمليات الحرجة داخل الكود.'
    },
    {
      iconHtml: renderEntityIcon('variable', 'ui-codicon list-icon', 'متغير أو uniform'),
      title: 'أيقونة متغير أو uniform',
      reason: 'توضح أن العنصر قيمة تتغير أو تنتقل بين CPU side وGPU side أو داخل الشيدر نفسه.',
      place: 'قسم المتغيرات والـ Tooltips والعناصر المرتبطة.'
    },
    {
      iconHtml: renderEntityIcon('file', 'ui-codicon list-icon', 'ملف'),
      title: 'أيقونة ملف',
      reason: 'تستخدم لتمييز الملفات المقترحة التي يتكون منها المثال ومساراتها داخل المشروع.',
      place: 'قسم الملفات المرتبطة وبطاقات الدمج داخل المشروع.'
    }
  ];

  if (String(example.imguiCode || '').trim()) {
    iconEntries.push({
      iconHtml: renderEntityIcon('imgui', 'ui-codicon list-icon', 'Dear ImGui'),
      title: 'أيقونة Dear ImGui',
      reason: 'تظهر عندما يكون العنصر جزءًا من نافذة التفاعل أو أداة تعليمية مرتبطة بالمثال.',
      place: 'قسم كود Dear ImGui، قسم المكونات، والروابط الخاصة بعناصر الواجهة.'
    });
  }

  return `
    <div class="glsl-example-icon-grid">
      ${iconEntries.map((entry) => `
        <article class="content-card prose-card glsl-example-icon-card">
          <div class="glsl-example-icon-badge">${entry.iconHtml}</div>
          <h3>${escapeHtml(entry.title)}</h3>
          <p><strong>سبب الاختيار:</strong> ${renderGlslExampleNarrative(entry.reason || '')}</p>
          <p><strong>موضعها داخل المشروع:</strong> ${renderGlslExampleNarrative(entry.place || '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGlslExampleSectionPlacement(example = {}, sectionMeta = null) {
  const section = sectionMeta || getGlslExampleSectionMeta(example);
  const supplementaryTracks = getGlslExampleSupplementaryTracks(example);

  return `
    <div class="glsl-example-relationship-grid">
      ${renderGlslExampleSectionCard(`
        <div class="info-label">${escapeHtml(section.englishTitle || '')}</div>
        <h3>${escapeHtml(section.icon)} ${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.description || '')}</p>
      `, 'glsl-example-section-card')}
      ${renderGlslExampleSectionCard(`
        <h3>لماذا ينتمي لهذا القسم؟</h3>
        <p>${renderGlslExampleNarrative(buildGlslExampleSectionReason(example, section))}</p>
        ${supplementaryTracks.length ? `<p class="glsl-example-inline-note"><strong>مسارات مرافقة:</strong> ${supplementaryTracks.map((track) => `<span class="related-link related-link-static">${escapeHtml(track)}</span>`).join(' ')}</p>` : ''}
      `, 'glsl-example-section-card')}
    </div>
  `;
}

function renderGlslExampleIntegration(example) {
  const integration = example.integration || buildFallbackGlslExampleIntegration(example);

  const infoGrid = renderGlslExampleInfoGrid([
    {label: 'اسم الملف المقترح', value: `<code dir="ltr">${escapeHtml(integration.fileName || '')}</code>`},
    {label: 'مكان الملف', value: `<code dir="ltr">${escapeHtml(integration.location || '')}</code>`},
    {label: 'القسم الأنسب', value: renderGlslExampleNarrative(integration.section || '')},
    {label: 'نافذة Dear ImGui', value: renderImguiDocText(integration.imguiWindow || '')}
  ]);

  return `
    ${infoGrid}
    <div class="glsl-example-integration-grid">
      ${renderGlslExampleSectionCard(`
        <h3>كيف أسجل المثال داخل النظام؟</h3>
        ${renderGlslExampleList(integration.registrationSteps || [])}
      `)}
      ${renderGlslExampleSectionCard(`
        <h3>الموارد المطلوبة</h3>
        ${renderGlslExampleList(integration.resources || [])}
      `)}
      ${renderGlslExampleSectionCard(`
        <h3>ما الذي يجهزه CPU Side؟</h3>
        ${renderGlslExampleList(integration.cpuSide || [])}
      `)}
      ${renderGlslExampleSectionCard(`
        <h3>ما الذي ينفذه GPU Side؟</h3>
        ${renderGlslExampleList(integration.gpuSide || [])}
      `)}
      ${renderGlslExampleSectionCard(`
        <h3>كيف أختبره تدريجيًا؟</h3>
        ${renderGlslExampleList(integration.testing || [], 'glsl', true)}
      `)}
      ${renderGlslExampleSectionCard(`
        <h3>كيف أتحقق من صحة النتيجة؟</h3>
        ${renderGlslExampleList(integration.validation || [])}
      `)}
    </div>
  `;
}

function renderGlslReadyExamplePage(example) {
  const sectionMeta = getGlslExampleSectionMeta(example);
  const hasImgui = Boolean(String(example.imguiCode || '').trim());
  const phases = Array.isArray(example.phases) && example.phases.length
    ? example.phases
    : buildFallbackGlslExamplePhases(example, sectionMeta);
  const dataFlow = Array.isArray(example.dataFlow) && example.dataFlow.length
    ? example.dataFlow
    : buildFallbackGlslExampleDataFlow(example);
  const importantLines = Array.isArray(example.importantLines) && example.importantLines.length
    ? example.importantLines
    : buildFallbackGlslExampleImportantLines(example);
  const elements = getGlslExampleElementEntries(example);
  const tooltipEntries = getGlslExampleTooltipEntries(example);
  const definitionGroups = buildGlslExampleDefinitionGroups(example);
  const imageSpecs = Array.isArray(example.imageSpecs) && example.imageSpecs.length
    ? example.imageSpecs
    : buildFallbackGlslExampleImageSpecs(example, sectionMeta);
  const commonErrors = Array.isArray(example.commonErrors) && example.commonErrors.length
    ? example.commonErrors
    : buildFallbackGlslExampleCommonErrors(example);
  const learningOutcomes = Array.isArray(example.learningOutcomes) && example.learningOutcomes.length
    ? example.learningOutcomes
    : buildFallbackGlslExampleLearningOutcomes(example, sectionMeta);
  const futureImprovements = Array.isArray(example.futureImprovements) && example.futureImprovements.length
    ? example.futureImprovements
    : [
      'إضافة صورة تعليمية حقيقية مطابقة للمثال بدل الاكتفاء بالوصف النصي المقترح.',
      hasImgui ? 'توسيع لوحة Dear ImGui بمقارنات إضافية أو تبويبات Debug أكثر تخصصًا.' : 'إضافة لوحة Dear ImGui اختيارية عندما يصبح المثال مناسبًا للتجريب الحي.',
      `ربط هذا المثال بمثال تالٍ داخل قسم ${sectionMeta.title} ليتحوّل المسار إلى سلسلة تعلم متدرجة.`
    ];
  const prerequisites = Array.isArray(example.prerequisites) && example.prerequisites.length
    ? example.prerequisites
    : sectionMeta.prerequisites || [];
  const integrationExample = example.integration
    ? example
    : {
      ...example,
      integration: buildFallbackGlslExampleIntegration(example, sectionMeta)
    };
  const realIdea = String(example.realIdea || example.goal || `الفكرة الحقيقية هنا هي عزل مفهوم أساسي من قسم ${sectionMeta.title} حتى يراه القارئ في أبسط شكل ممكن.`).trim();
  const smartReason = String(example.smartReason || `هذا المثال ذكي لأنه يعزل عنصرًا واحدًا مؤثرًا من ${sectionMeta.title} ويمنع تداخل التفاصيل غير الضرورية عند أول قراءة.`).trim();
  const whenUsed = String(example.whenUsed || `يستخدم هذا النوع من الشيدر فعليًا عندما يحتاج التطبيق إلى ${sectionMeta.exampleKinds || 'بنية شيدر واضحة'} داخل المشهد أو داخل pass تعليمية مستقلة.`).trim();
  const projectNeed = String(example.projectNeed || `يحتاجه المشروع الحالي لأنه يملأ فجوة تعليمية داخل ${sectionMeta.title} ويحول المفهوم من شرح وصفي إلى مثال عملي قابل للتتبع.`).trim();
  const exampleType = localizeGlslStageLabels(example.exampleType || (hasImgui ? 'مثال GLSL Rendering + Dear ImGui' : 'مثال GLSL تعليمي'));
  const difficulty = localizeGlslStageLabels(example.difficulty || (hasImgui ? 'متوسط' : 'أساسي'));
  const nextExample = example.nextExampleId
    ? getGlslReadyExampleById(example.nextExampleId)
    : null;
  const nextExampleWhy = String(example.nextExampleWhy || (nextExample
    ? `يأتي هذا المثال التالي منطقيًا لأنه يبني فوق الفكرة الحالية ويضيف طبقة جديدة من ${getGlslExampleSectionMeta(nextExample).title || 'التفصيل العملي'}.`
    : `بعد هذا المثال يفضّل الانتقال إلى مثال آخر من قسم ${sectionMeta.title} أو إلى القسم الذي يليه في السلم التعليمي.`)).trim();
  const relatedLinks = renderGlslExampleRelatedLinksBlock(
    example,
    [
      ...elements.map((entry) => entry.name),
      ...tooltipEntries.map((entry) => entry.name)
    ],
    'لا توجد عناصر مرتبطة إضافية.'
  );
  const overviewMarkup = `
    <div class="content-card prose-card vulkan-ready-example-overview-card">
      <h4>نظرة سريعة</h4>
      <p>${renderGlslExampleNarrative(realIdea || example.goal || '')}</p>
      <div class="see-also-links glsl-ready-example-links glsl-ready-example-overview-links">
        <span class="related-link related-link-static">${escapeHtml(sectionMeta.icon)} ${escapeHtml(sectionMeta.title)}</span>
        <span class="related-link related-link-static">${escapeHtml(exampleType)}</span>
        <span class="related-link related-link-static">${escapeHtml(difficulty)}</span>
      </div>
    </div>
  `;

  const summarySections = [
    {
      id: 'glsl-example-goal',
      title: 'الهدف العام من الكود',
      body: `<p>${renderGlslExampleNarrative(example.goal || '')}</p>`
    },
    {
      id: 'glsl-example-real-idea',
      title: 'الفكرة الحقيقية',
      body: `<p>${renderGlslExampleNarrative(realIdea)}</p>`
    },
    {
      id: 'glsl-example-when',
      title: 'متى يستخدم',
      body: `<p>${renderGlslExampleNarrative(whenUsed)}</p>`
    },
    {
      id: 'glsl-example-prerequisites',
      title: 'المتطلبات السابقة',
      body: renderGlslExampleList(prerequisites, 'glsl', true)
    },
    {
      id: 'glsl-example-learning',
      title: 'ماذا أتعلم من المثال؟',
      body: renderGlslExampleList(learningOutcomes)
    }
  ].filter((entry) => String(entry.body || '').trim());

  const detailSections = [
    {
      id: 'glsl-example-phases',
      title: 'المراحل التفصيلية للتنفيذ',
      body: renderGlslExamplePhaseGrid(phases),
      wide: true
    },
    {
      id: 'glsl-example-data-flow',
      title: 'تسلسل مرور البيانات',
      body: renderGlslExampleDataFlow(dataFlow),
      wide: true
    },
    {
      id: 'glsl-example-files',
      title: 'الملفات المرتبطة',
      body: renderGlslExampleFiles(example, sectionMeta)
    },
    {
      id: 'glsl-example-glsl-code',
      title: 'كود GLSL',
      body: renderGlslExampleShadersSection(example),
      wide: true
    },
    hasImgui ? {
      id: 'glsl-example-imgui-code',
      title: 'كود Dear ImGui',
      body: `
        ${renderGlslExampleSectionCard(renderImguiCodeBlock('الواجهة المرتبطة بالمثال', example.imguiCode || ''))}
        ${example.imguiNarrative ? renderGlslExampleSectionCard(`
          <p>${renderImguiDocText(example.imguiNarrative)}</p>
        `, 'glsl-example-support-card') : ''}
      `,
      wide: true
    } : null,
    {
      id: 'glsl-example-important-lines',
      title: 'شرح السطور المهمة',
      body: renderGlslExampleImportantLines(importantLines),
      wide: true
    },
    {
      id: 'glsl-example-elements',
      title: 'العناصر المستخدمة',
      body: renderGlslExampleSectionCard(renderGlslExampleElementsTable(elements))
    },
    {
      id: 'glsl-example-functions',
      title: 'شرح الدوال',
      body: renderGlslExampleDefinitionCards(
        definitionGroups.functions,
        'لا توجد دوال مستقلة إضافية موثقة لهذا المثال خارج ما يظهر في الكود نفسه.'
      )
    },
    {
      id: 'glsl-example-variables',
      title: 'شرح المتغيرات',
      body: renderGlslExampleDefinitionCards(
        definitionGroups.variables,
        'لا توجد متغيرات مستقلة إضافية خارج ما هو ظاهر في الكود والعناصر المستخدمة.'
      )
    },
    {
      id: 'glsl-example-constants',
      title: 'شرح الثوابت',
      body: renderGlslExampleDefinitionCards(
        definitionGroups.constants,
        'لا يعتمد المثال على ثوابت مستقلة كثيرة خارج ما يظهر مباشرة في الشيدر أو الواجهة.'
      )
    },
    {
      id: 'glsl-example-relationships',
      title: 'العلاقات بين العناصر',
      body: renderGlslExampleRelationships(example, integrationExample.integration),
      wide: true
    },
    {
      id: 'glsl-example-tooltips',
      title: 'Tooltips',
      body: renderGlslExampleTooltipCards(tooltipEntries),
      wide: true
    },
    {
      id: 'glsl-example-images',
      title: 'الصور التوضيحية',
      body: renderGlslExampleImageSpecs(imageSpecs),
      wide: true
    },
    Array.isArray(example.imguiComponents) && example.imguiComponents.length ? {
      id: 'glsl-example-imgui-components',
      title: 'مكونات واجهة Dear ImGui',
      body: renderGlslExampleImguiComponents(example.imguiComponents || []),
      wide: true
    } : null,
    example.layoutDesign ? {
      id: 'glsl-example-layout',
      title: 'تصميم الواجهة وتخطيطها',
      body: renderGlslExampleLayoutDesign(example.layoutDesign || null)
    } : null,
    hasImgui && Array.isArray(example.interactionModel) && example.interactionModel.length ? {
      id: 'glsl-example-interaction',
      title: 'كيف تتفاعل الواجهة مع المثال؟',
      body: renderGlslExampleSectionCard(renderGlslExampleList(example.interactionModel || [], 'imgui'))
    } : null,
    {
      id: 'glsl-example-integration',
      title: 'كيف أدمجه داخل المشروع الحالي؟',
      body: renderGlslExampleIntegration(integrationExample),
      wide: true
    },
    {
      id: 'glsl-example-errors',
      title: 'أخطاء شائعة ومؤشرات العطل',
      body: renderGlslExampleSectionCard(renderGlslExampleList(commonErrors))
    },
    {
      id: 'glsl-example-future',
      title: 'تحسينات مستقبلية',
      body: renderGlslExampleSectionCard(renderGlslExampleList(futureImprovements))
    },
    {
      id: 'glsl-example-next',
      title: 'ما المثال التالي المناسب بعده؟',
      body: renderGlslExampleSectionCard(`
        <p>${renderGlslExampleNarrative(nextExampleWhy)}</p>
        ${nextExample ? `<div class="see-also-links"><a href="#" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(`يفتح المثال التالي المقترح: ${getGlslExampleDisplayTitle(nextExample)}`)}" onclick="showGlslExample('${escapeAttribute(nextExample.id)}'); return false;">${safeRenderEntityLabel(getGlslExampleDisplayTitle(nextExample), 'glsl', {code: false})}</a></div>` : ''}
      `)
    }
  ].filter(Boolean).filter((entry) => String(entry.body || '').trim());

  const sectionNav = [...summarySections, ...detailSections]
    .map((entry) => renderGlslExampleLocalAnchorLink(entry.title, entry.id))
    .join(' ');

  return `
    ${renderExampleHeroSection({
      previewHtml: renderGlslReadyExamplePreview(example),
      headingHtml: `${renderEntityIcon('glsl', 'ui-codicon page-icon', getGlslExampleDisplayTitle(example))} ${escapeHtml(getGlslExampleDisplayTitle(example))}`,
      descriptionHtml: renderGlslExampleNarrative(example.goal || '')
    })}

    <article class="vulkan-ready-example-card vulkan-ready-example-card-plain glsl-ready-example-page">
      ${overviewMarkup}

      <div class="vulkan-ready-example-support-grid">
        <div class="content-card prose-card vulkan-ready-example-support-card">
          <h4>النتيجة المتوقعة</h4>
          <p>${renderGlslExampleNarrative(example.expectedResult || '')}</p>
        </div>
        ${(example.highlights || []).length ? `
        <div class="content-card prose-card vulkan-ready-example-support-card">
          <h4>نقاط مهمة قبل الدخول في الشرح</h4>
          <ul class="best-practices-list">
            ${(example.highlights || []).slice(0, 6).map((entry) => `<li>${renderGlslExampleNarrative(entry)}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        <div class="content-card prose-card vulkan-ready-example-support-card vulkan-ready-example-related-card">
          <h4>العناصر المرتبطة</h4>
          <div class="see-also-links glsl-ready-example-links reference-summary-list reference-summary-list-vertical">${relatedLinks}</div>
        </div>
      </div>

      <section class="explanation-section example-explanation-sectioned">
        <div class="content-card prose-card example-explanation-head">
          <h2>🧩 الشرح التعليمي للمثال</h2>
          <div class="see-also-links example-explanation-anchor-nav">${sectionNav}</div>
        </div>
        ${summarySections.length ? `
        <div class="example-explanation-summary-strip">
          ${summarySections.map((entry) => renderGlslExamplePageBlock(entry.id, entry.title, entry.body, {summary: true})).join('')}
        </div>
        ` : ''}
        <div class="example-explanation-grid">
          ${detailSections.map((entry) => renderGlslExamplePageBlock(entry.id, entry.title, entry.body, {wide: entry.wide})).join('')}
        </div>
      </section>
    </article>
  `;
}


    return Object.freeze({
      localizeGlslStageLabels,
      renderGlslReadyExamplePreview,
      renderGlslReadyExampleOverviewCard,
      renderGlslReadyExampleShaderSection,
      renderGlslReadyExampleCommandsSection,
      renderGlslReadyExampleVulkanUsageSection,
      renderGlslReadyExampleSupportGrid,
      renderGlslReadyExamplePage
    });
  }

  return Object.freeze({
    createGlslExampleRuntime
  });
})();
