window.__ARABIC_VULKAN_SHARED_PATTERNS__ = (() => {
  const SDL_TOOLTIP_IDENTIFIER_NOISE_REGEX = /\b(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|SDL_[A-Za-z0-9_]+|IMG_[A-Za-z0-9_]+|TTF_[A-Za-z0-9_]+|MIX_[A-Za-z0-9_]+|Mix_[A-Za-z0-9_]+|GL_[A-Z0-9_]+)\b/g;
  const SDL_ALLOWED_TECHNICAL_TOKENS_REGEX = /\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|SDL(?:3)?_(?:image|mixer|ttf)|SDL_[A-Za-z0-9_]+(?:\(\))?|IMG_[A-Za-z0-9_]+(?:\(\))?|TTF_[A-Za-z0-9_]+(?:\(\))?|MIX_[A-Za-z0-9_]+(?:\(\))?|GL_[A-Z0-9_]+|[A-Z]{2,}[A-Z0-9_]*|true|false|NULL|src|dst|pts|props|closeio|app|x|y)\b|0x[0-9A-Fa-f]+|"[A-Za-z0-9_.-]+"|https?:\/\/\S+/g;
  const SDL_CODE_EXPRESSION_OPERATOR_REGEX = /(?:#define|&&|\|\||>=|<=|==|!=|<<|>>|\\)/;
  const SDL_CODE_EXPRESSION_CONSTANT_REGEX = /[A-Z_]{4,}/;
  const SDL_CODE_EXPRESSION_CALL_REGEX = /[()]/;
  const SDL_CODE_EXPRESSION_RELATION_REGEX = /[<>=|&]/;

  const EXAMPLE_PREVIEW_INTROS = Object.freeze({
    vulkan: 'يعرض هذا القسم معاينات سريعة لأمثلة فولكان التطبيقية. افتح صفحة المثال الكاملة لرؤية الكود والتسلسل الكامل.',
    glsl: 'يعرض هذا القسم أمثلة عملية مختصرة للغة التظليل. افتح المثال الكامل لرؤية الشيدر الكامل والشرح والنتيجة المتوقعة.',
    glslReadyIndex: 'يعرض هذا الفهرس جميع أمثلة لغة التظليل الجاهزة داخل المشروع بدل تحميل الكود الكامل في صفحة المرجع نفسها.',
    imgui: 'يعرض هذا القسم أمثلة Dear ImGui العملية بشكل مختصر، بما في ذلك الأمثلة المنقولة من Vulkan وSDL3 عندما تكون الواجهة التفاعلية هي محور المثال الحقيقي.',
    sdl3Core: 'يعرض هذا القسم أمثلة SDL3 العملية، ويضم أيضًا أمثلة التكامل مع Vulkan عندما تكون SDL3 هي طبقة النافذة أو السطح أو الأحداث الأساسية. أمثلة Dear ImGui نُقلت إلى قسم Dear ImGui.'
  });

  const SHARED_COPY = Object.freeze({
    arabicOfficialDescriptionPrefix: 'الوصف بالعربي:',
    missingFunctionOfficialDescription: 'لا يتوفر وصف رسمي محلياً لهذه الدالة حالياً.'
  });

  function stripSdlTooltipIdentifierNoise(text = '') {
    return String(text || '').replace(SDL_TOOLTIP_IDENTIFIER_NOISE_REGEX, ' ');
  }

  function decodeBasicHtmlEntities(text = '') {
    return String(text || '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function sanitizeTooltipText(text = '') {
    return decodeBasicHtmlEntities(
      String(text || '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(?:p|li|div|tr|h[1-6])>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
    )
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  function maskAllowedSdlTechnicalTokens(text = '') {
    const tokens = [];
    const masked = String(text || '').replace(SDL_ALLOWED_TECHNICAL_TOKENS_REGEX, (match) => {
      const marker = `@@${tokens.length}@@`;
      tokens.push(match);
      return marker;
    });

    return {masked, tokens};
  }

  function looksLikeSdlCodeExpression(text = '') {
    const source = String(text || '').trim();
    if (!source || /[\u0600-\u06FF]/.test(source)) {
      return false;
    }

    return SDL_CODE_EXPRESSION_OPERATOR_REGEX.test(source)
      || (
        SDL_CODE_EXPRESSION_CONSTANT_REGEX.test(source)
        && SDL_CODE_EXPRESSION_CALL_REGEX.test(source)
        && SDL_CODE_EXPRESSION_RELATION_REGEX.test(source)
      );
  }

  function formatSdlCodeExpressionText(text = '') {
    let formatted = String(text || '')
      .replace(/\r/g, '')
      .trim();

    if (!formatted) {
      return '';
    }

    formatted = formatted
      .replace(/\s*\\\s*/g, ' \\\n')
      .replace(/\s*&&\s*/g, '\n&& ')
      .replace(/\s*\|\|\s*/g, '\n|| ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .trim();

    return formatted;
  }

  function getExamplePreviewIntro(key = '', options = {}) {
    if (key === 'sdl3-default') {
      return `يعرض هذا القسم أمثلة ${options.displayName || 'SDL3'} العملية بشكل مختصر. افتح المثال الكامل لرؤية الكود والنتيجة المتوقعة والعناصر المرتبطة.`;
    }

    return EXAMPLE_PREVIEW_INTROS[key] || options.fallback || '';
  }

  function formatArabicOfficialDescription(text = '', options = {}) {
    const body = String(text || '').trim();
    if (!body) {
      return SHARED_COPY.missingFunctionOfficialDescription;
    }

    const normalizedBody = options.ensureSentence
      ? `${body.replace(/[.؟!]+$/g, '').trim()}.`
      : body;

    return `${SHARED_COPY.arabicOfficialDescriptionPrefix} ${normalizedBody}`;
  }

  function stripArabicOfficialDescriptionPrefix(text = '') {
    return String(text || '').replace(/^الوصف بالعربي:\s*/g, '');
  }

  return Object.freeze({
    decodeBasicHtmlEntities,
    formatArabicOfficialDescription,
    formatSdlCodeExpressionText,
    getExamplePreviewIntro,
    looksLikeSdlCodeExpression,
    maskAllowedSdlTechnicalTokens,
    missingFunctionOfficialDescription: SHARED_COPY.missingFunctionOfficialDescription,
    sanitizeTooltipText,
    stripArabicOfficialDescriptionPrefix,
    stripSdlTooltipIdentifierNoise
  });
})();
