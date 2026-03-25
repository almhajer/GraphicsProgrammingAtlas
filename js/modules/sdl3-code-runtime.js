window.__ARABIC_VULKAN_SDL3_CODE_RUNTIME__ = (() => {
  function createSdl3CodeRuntime(api = {}) {
    const {
      SDL3_NATIVE_SYMBOL_INFO,
      SDL3_C_KEYWORDS,
      SDL3_C_TYPE_KEYWORDS,
      composeSemanticTooltip,
      sanitizeTooltipText,
      safeRenderEntityLabel,
      escapeHtml,
      escapeAttribute,
      buildDeferredSdl3TooltipAttrsByName,
      findSdl3AnyItemByName,
      findSdl3CoreSymbolSeedByName,
      getCachedSdl3ReferenceTooltip,
      buildShowSdl3Call,
      getSdl3CollectionMeta,
      getSdl3TypeSectionDataKey,
      parseSdl3CallbackSignature,
      parseSdl3FunctionSignature,
      buildSdl3ReturnMeaning,
      buildSdl3ReturnHandlingHint,
      getSdl3ExactElementTypeInfo,
      normalizeSdl3DocValue,
      preferArabicSdl3DocText,
      normalizeSdl3ArabicTechnicalProse,
      getSdl3DisplayParameters,
      parseSdl3StructFields,
      buildSdl3ParameterTooltip,
      getSdl3ParameterAnchorId,
      buildSdl3FieldTooltip,
      buildSdl3ReferenceTooltip,
      renderEntityIcon,
      getSdl3KindMeta,
      renderDocCodeContainer
    } = api;

    function getSdl3CodeClassForKind(kind) {
      switch (kind) {
        case 'function':
          return 'function';
        case 'macro':
          return 'macro';
        case 'constant':
          return 'constant';
        case 'variable':
          return 'variable';
        case 'enum':
        case 'type':
        default:
          return 'type';
      }
    }

    function buildSdl3GenericNativeTooltip(token) {
      return composeSemanticTooltip({
        title: token,
        kindLabel: 'رمز منصي',
        typeLabel: 'نوع أصلي من النظام',
        library: 'SDL3 + Native API',
        meaning: 'ليس مورداً من SDL بحد ذاته، بل نوع أو مقبض من واجهة النظام الأصلية تكشفه SDL عندما تحتاج الخروج من طبقة التجريد العامة.',
        whyExists: 'لأن SDL تحتاج أحياناً أن تربط نوافذها أو أسطحها أو أحداثها بواجهات النظام الأصلية بدل إعادة بناء كل تكامل منصي داخل SDL وحدها.',
        whyUse: 'يستخدمه المبرمج عندما يريد أخذ مقبض نافذة أصلية أو ربط Vulkan أو Metal أو رسائل النظام مع النافذة التي أنشأتها SDL.',
        actualUsage: 'يظهر في مسارات التكامل المنصي أو في بنى الاستعلام عن معلومات النافذة حول كود يتعامل مع API النظام مباشرة.',
        warning: 'عمره وصلاحيته لا يتبعان SDL وحدها؛ بل يتبعان API المنصة الأصلية التي جاء منها.'
      });
    }

    function getSdl3NativeSymbolInfo(token) {
      if (SDL3_NATIVE_SYMBOL_INFO[token]) {
        return SDL3_NATIVE_SYMBOL_INFO[token];
      }

      if ((/^[A-Z][A-Za-z0-9_]*$/.test(token) || /_t$/.test(token)) && !SDL3_C_TYPE_KEYWORDS.has(token) && !SDL3_C_KEYWORDS.has(token)) {
        return {
          className: 'type',
          tooltip: buildSdl3GenericNativeTooltip(token)
        };
      }

      return null;
    }

    function renderSdl3InteractiveCodeToken(text, options = {}) {
      const label = String(text || '');
      const className = [options.className || '', 'code-token', 'sdl3-inline-code-token']
        .filter(Boolean)
        .join(' ');
      const tooltip = sanitizeTooltipText(options.tooltip || '');
      const aria = tooltip ? `${label}: ${tooltip.replace(/\n/g, ' - ')}` : label;
      const content = options.iconType
        ? safeRenderEntityLabel(label, options.iconType, {code: true})
        : escapeHtml(label);
      const deferredTooltipAttrs = options.tooltipRefName
        ? buildDeferredSdl3TooltipAttrsByName(options.tooltipRefName, options.tooltipLabel || label)
        : '';
      const directTooltipAttrs = tooltip
        ? ` data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}"`
        : '';
      const tooltipAttrs = deferredTooltipAttrs || directTooltipAttrs;

      if (options.action) {
        return `<a href="#" class="${escapeAttribute(`${className} code-link entity-link-with-icon`)}"${tooltipAttrs} onclick="${options.action}; return false;">${content}</a>`;
      }

      if (tooltipAttrs) {
        return `<span class="${escapeAttribute(`${className} code-link-static${options.iconType ? ' entity-link-with-icon' : ''}`)}"${tooltipAttrs}>${content}</span>`;
      }

      return className
        ? `<span class="${escapeAttribute(`${className}${options.iconType ? ' entity-link-with-icon' : ''}`)}">${content}</span>`
        : escapeHtml(label);
    }

    function resolveSdl3CodeReferenceToken(token = '') {
      const target = String(token || '').trim();
      if (!target) {
        return null;
      }

      const item = findSdl3AnyItemByName(target);
      if (item) {
        const directTooltip = sanitizeTooltipText(getCachedSdl3ReferenceTooltip(item));
        return {
          item,
          tooltip: directTooltip,
          tooltipRefName: '',
          action: buildShowSdl3Call(item.kind, item.name),
          className: getSdl3CodeClassForKind(item.kind),
          iconType: item.kind === 'type'
            ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item)).icon
            : item.kind
        };
      }

      const seedItem = findSdl3CoreSymbolSeedByName(target);
      if (!seedItem) {
        return null;
      }

      return {
        item: seedItem,
        tooltip: sanitizeTooltipText(api.buildSdl3ShortReferenceTooltip(seedItem)),
        tooltipRefName: '',
        action: buildShowSdl3Call(seedItem.kind, seedItem.name),
        className: getSdl3CodeClassForKind(seedItem.kind),
        iconType: seedItem.kind === 'type'
          ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(seedItem)).icon
          : seedItem.kind
      };
    }

    function getSdl3ReturnTypeTokens(item) {
      const signature = item?.kind === 'type'
        ? parseSdl3CallbackSignature(item?.syntax || '')
        : parseSdl3FunctionSignature(item?.syntax || '');
      return new Set(String(signature.returnType || '').match(/[A-Za-z_][A-Za-z0-9_]*/g) || []);
    }

    function buildSdl3ReturnTypeTooltip(token, item, refItem = null) {
      const returnMeaning = sanitizeTooltipText(buildSdl3ReturnMeaning(item) || '');
      const returnHandling = sanitizeTooltipText(buildSdl3ReturnHandlingHint(item) || '');
      const typeLabel = refItem
        ? getSdl3ExactElementTypeInfo(refItem).arabic
        : SDL3_C_TYPE_KEYWORDS.has(token)
          ? 'نوع C'
          : 'نوع الإرجاع';

      return sanitizeTooltipText([
        token,
        `النوع: ${typeLabel}`,
        `ما الذي تعيده الدالة هنا: ${returnMeaning}`,
        `كيف يفحص المبرمج النتيجة: ${returnHandling}`
      ].filter(Boolean).join('\n'));
    }

    function renderSdl3CodeCommentToken(token, item = null) {
      const source = String(token || '');
      if (!source) {
        return '';
      }

      const translateCommentBody = (body) => {
        const normalized = normalizeSdl3DocValue(body)
          .replace(/^\*+\s*/gm, '')
          .trim();
        if (!normalized) {
          return '';
        }
        return preferArabicSdl3DocText(normalized, item, {
          section: 'remarks',
          fallbackText: normalizeSdl3ArabicTechnicalProse(normalized)
        }) || normalizeSdl3ArabicTechnicalProse(normalized);
      };

      if (/^\/\//.test(source)) {
        const translated = translateCommentBody(source.replace(/^\/\/\s*/, ''));
        return `<span class="comment code-token">${escapeHtml(`// ${translated || source.replace(/^\/\/\s*/, '').trim()}`)}</span>`;
      }

      const docLineMatch = /^\/\*\*<\s*([\s\S]*?)\s*\*\/$/.exec(source);
      if (docLineMatch) {
        const translated = translateCommentBody(docLineMatch[1]);
        return `<span class="comment code-token">${escapeHtml(`/**< ${translated || docLineMatch[1].trim()} */`)}</span>`;
      }

      const blockMatch = /^\/\*\s*([\s\S]*?)\s*\*\/$/.exec(source);
      if (blockMatch) {
        const translated = translateCommentBody(blockMatch[1]);
        return `<span class="comment code-token">${escapeHtml(`/* ${translated || blockMatch[1].trim()} */`)}</span>`;
      }

      return `<span class="comment code-token">${escapeHtml(source)}</span>`;
    }

    function renderSdl3AnnotatedCodeSegment(source, item, options = {}) {
      const returnTypeTokens = options.returnTypeTokens || getSdl3ReturnTypeTokens(item);
      const parameterMap = options.parameterMap || new Map(
        getSdl3DisplayParameters(item)
          .filter((param) => param?.name)
          .map((param) => [param.name, param])
      );
      const fieldMap = options.fieldMap || new Map(
        parseSdl3StructFields(item?.syntax || '')
          .filter((field) => field?.name)
          .map((field) => [field.name, field])
      );

      let rendered = '';
      let lastIndex = 0;
      const rawSource = String(source || '');
      const tokenRegex = /[A-Za-z_][A-Za-z0-9_]*/g;

      rawSource.replace(tokenRegex, (token, offset) => {
        rendered += escapeHtml(rawSource.slice(lastIndex, offset));

        if (parameterMap.has(token)) {
          const parameter = parameterMap.get(token);
          rendered += renderSdl3InteractiveCodeToken(token, {
            className: 'variable',
            tooltip: buildSdl3ParameterTooltip(parameter, item),
            action: `scrollToAnchor('${escapeAttribute(getSdl3ParameterAnchorId(item, parameter))}')`,
            iconType: 'variable'
          });
        } else if (fieldMap.has(token)) {
          rendered += renderSdl3InteractiveCodeToken(token, {
            className: 'variable',
            tooltip: buildSdl3FieldTooltip(fieldMap.get(token), item),
            iconType: 'variable'
          });
        } else if (returnTypeTokens.has(token)) {
          const refInfo = resolveSdl3CodeReferenceToken(token);
          const refItem = refInfo?.item || null;
          rendered += renderSdl3InteractiveCodeToken(token, {
            className: refInfo?.className || 'type',
            tooltip: buildSdl3ReturnTypeTooltip(token, item, refItem),
            action: refInfo?.action || '',
            iconType: refInfo?.iconType || ''
          });
        } else if (token === item?.name) {
          rendered += renderSdl3InteractiveCodeToken(token, {
            className: getSdl3CodeClassForKind(item.kind),
            tooltip: buildSdl3ReferenceTooltip(item),
            iconType: item.kind === 'type' ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item)).icon : item.kind
          });
        } else {
          const refInfo = resolveSdl3CodeReferenceToken(token);
          if (refInfo) {
            rendered += renderSdl3InteractiveCodeToken(token, {
              className: refInfo.className,
              tooltip: refInfo.tooltip,
              tooltipRefName: refInfo.tooltipRefName,
              action: refInfo.action,
              iconType: refInfo.iconType
            });
          } else {
            const nativeInfo = getSdl3NativeSymbolInfo(token);
            if (nativeInfo) {
              rendered += renderSdl3InteractiveCodeToken(token, {
                className: nativeInfo.className || 'type',
                tooltip: nativeInfo.tooltip,
                iconType: nativeInfo.className === 'macro' ? 'macro' : nativeInfo.className === 'variable' ? 'variable' : 'structure'
              });
            } else if (SDL3_C_KEYWORDS.has(token)) {
              rendered += renderSdl3InteractiveCodeToken(token, {className: 'keyword'});
            } else if (SDL3_C_TYPE_KEYWORDS.has(token)) {
              rendered += renderSdl3InteractiveCodeToken(token, {className: 'type'});
            } else {
              rendered += escapeHtml(token);
            }
          }
        }

        lastIndex = offset + token.length;
        return token;
      });

      rendered += escapeHtml(rawSource.slice(lastIndex));
      return rendered;
    }

    function renderSdl3AnnotatedCodeSnippet(source, item, options = {}) {
      const rawSource = String(source || '');
      if (!rawSource) {
        return '';
      }

      const commentRegex = /(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
      let rendered = '';
      let lastIndex = 0;

      rawSource.replace(commentRegex, (comment, offset) => {
        rendered += renderSdl3AnnotatedCodeSegment(rawSource.slice(lastIndex, offset), item, options);
        rendered += renderSdl3CodeCommentToken(comment, item);
        lastIndex = offset + comment.length;
        return comment;
      });

      rendered += renderSdl3AnnotatedCodeSegment(rawSource.slice(lastIndex), item, options);
      return rendered;
    }

    function renderSdl3SyntaxCodeBlock(item) {
      if (!item?.syntax) {
        return '';
      }

      const headerIconType = item?.kind === 'type'
        ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item)).icon
        : getSdl3KindMeta(item?.kind || 'function').icon;

      return renderDocCodeContainer({
        titleHtml: `${renderEntityIcon(headerIconType, 'ui-codicon list-icon', item?.name || 'SDL3')} كود لغة سي`,
        rawCode: item.syntax,
        renderedCodeHtml: renderSdl3AnnotatedCodeSnippet(item.syntax, item),
        language: 'c',
        containerClassName: 'example-section tutorial-example-section sdl3-syntax-container',
        preClassName: 'sdl3-syntax-block',
        codeClassName: 'sdl3-syntax-code',
        allowCopy: true,
        allowToggle: true,
        skipHighlight: true
      });
    }

    function renderSdl3ExampleCodeBlock(item, code) {
      if (!code) {
        return '';
      }

      const headerIconType = item?.kind === 'type'
        ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(item)).icon
        : getSdl3KindMeta(item?.kind || 'function').icon;

      return renderDocCodeContainer({
        titleHtml: `${renderEntityIcon(headerIconType, 'ui-codicon list-icon', item?.name || 'SDL3')} الكود البرمجي`,
        rawCode: code,
        renderedCodeHtml: renderSdl3AnnotatedCodeSnippet(code, item),
        language: 'c',
        containerClassName: 'example-section tutorial-example-section sdl3-syntax-container sdl3-example-container',
        preClassName: 'sdl3-syntax-block',
        codeClassName: 'sdl3-syntax-code',
        allowCopy: true,
        allowToggle: false,
        skipHighlight: true
      });
    }

    return Object.freeze({
      getSdl3CodeClassForKind,
      buildSdl3GenericNativeTooltip,
      getSdl3NativeSymbolInfo,
      renderSdl3InteractiveCodeToken,
      resolveSdl3CodeReferenceToken,
      getSdl3ReturnTypeTokens,
      buildSdl3ReturnTypeTooltip,
      renderSdl3CodeCommentToken,
      renderSdl3AnnotatedCodeSegment,
      renderSdl3AnnotatedCodeSnippet,
      renderSdl3SyntaxCodeBlock,
      renderSdl3ExampleCodeBlock
    });
  }

  return Object.freeze({
    createSdl3CodeRuntime
  });
})();
