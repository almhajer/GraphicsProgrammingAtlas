(function(global) {
  'use strict';

  function createSdl3ParameterRenderRuntime(api = {}) {
    const {
      composeSemanticTooltip,
      decodeBasicHtmlEntities: externalDecodeBasicHtmlEntities,
      formatSdlCodeExpressionText,
      getSdl3DisplayedParameterType: externalGetSdl3DisplayedParameterType,
      getSdl3ReferenceFromType,
      normalizeSdl3ArabicTechnicalProse,
      preferArabicSdl3DocText,
      renderSdl3AnnotatedCodeSnippet,
      renderSdl3DocText,
      renderSdl3ParameterRole,
      renderSdl3ParameterPracticalUsage,
      renderSdl3ParameterPurpose,
      renderSdl3ParameterMisuseImpact,
      buildSdl3ParameterDescriptionFallback: externalBuildSdl3ParameterDescriptionFallback,
      buildSdl3FieldMeaning,
      buildSdl3FieldOfficialDescription,
      buildSdl3FieldPurpose,
      buildSdl3FieldPracticalUsage,
      sanitizeTooltipText: externalSanitizeTooltipText,
      looksLikeSdlCodeExpression,
      stripMarkup,
      stripTooltipIdentifierNoise
    } = api;

    function looksLikeSdl3CodeExpression(text) {
      const source = sanitizeTooltipText(text);
      return looksLikeSdlCodeExpression(source);
    }

    function formatSdl3CodeExpressionText(text) {
      return formatSdlCodeExpressionText(decodeBasicHtmlEntities(String(text || '')));
    }

    function renderSdl3ParameterDescriptionCell(param, item) {
      const description = renderSdl3ParameterDescriptionText(param, item);
      if (!looksLikeSdl3CodeExpression(description)) {
        return renderSdl3DocText(description, item, {section: 'parameter-description'});
      }

      const formattedExpression = formatSdl3CodeExpressionText(description);
      return `
        <div class="sdl3-parameter-code-shell">
          <pre class="sdl3-parameter-code-block"><code dir="ltr" class="sdl3-syntax-code">${renderSdl3AnnotatedCodeSnippet(formattedExpression, item)}</code></pre>
        </div>
      `;
    }

    function decodeBasicHtmlEntities(text) {
      if (typeof externalDecodeBasicHtmlEntities === 'function') {
        return externalDecodeBasicHtmlEntities(text);
      }
      return String(text || '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    function sanitizeTooltipText(text) {
      if (typeof externalSanitizeTooltipText === 'function') {
        return externalSanitizeTooltipText(text);
      }
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

    const SDL3_C_KEYWORDS = new Set([
      'typedef', 'struct', 'enum', 'const', 'volatile', 'unsigned', 'signed',
      'short', 'long', 'static', 'extern', 'inline', 'return', 'if', 'else',
      'switch', 'case', 'default', 'true', 'false', 'define', 'ifdef', 'ifndef',
      'endif', 'elif', 'include'
    ]);

    const SDL3_C_TYPE_KEYWORDS = new Set([
      'void', 'bool', 'char', 'int', 'float', 'double', 'size_t',
      'Uint8', 'Uint16', 'Uint32', 'Uint64', 'Sint8', 'Sint16', 'Sint32', 'Sint64'
    ]);

    let SDL3_NATIVE_SYMBOL_INFO = Object.freeze({});

    function parseSdl3SignatureParameter(rawParam) {
      const source = String(rawParam || '').replace(/\s+/g, ' ').trim();
      if (!source || source === 'void') {
        return null;
      }

      if (source === '...') {
        return {type: '...', name: '...'};
      }

      const callbackMatch = /^(.*?\(\s*\*+\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*\).*)$/.exec(source);
      if (callbackMatch) {
        return {
          type: `${String(callbackMatch[1] || '').trim()} ${String(callbackMatch[3] || '').trim()}`.replace(/\s+/g, ' ').trim(),
          name: String(callbackMatch[2] || '').trim()
        };
      }

      const namedMatch = /^(.*?)([A-Za-z_][A-Za-z0-9_]*)(\s*(?:\[[^\]]+\])?)$/.exec(source);
      if (!namedMatch) {
        return {type: source, name: ''};
      }

      const head = String(namedMatch[1] || '').trim();
      const tail = String(namedMatch[3] || '').trim();
      const typeCandidate = `${head}${tail ? ` ${tail}` : ''}`.trim();
      const looksLikeNamedParameter = /[*\[\]()]/.test(typeCandidate)
        || /\b(?:const|volatile|unsigned|signed|short|long|struct|enum|void|bool|char|int|float|double|size_t|Uint\d+|Sint\d+)\b/.test(typeCandidate)
        || /^[A-Z]/.test(head);

      if (!looksLikeNamedParameter) {
        return {type: source, name: ''};
      }

      return {
        type: typeCandidate,
        name: String(namedMatch[2] || '').trim()
      };
    }

    function parseSdl3MacroSignature(syntax) {
      const match = /^\s*#define\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)/m.exec(String(syntax || ''));
      if (!match) {
        return {name: '', params: []};
      }

      return {
        name: String(match[1] || '').trim(),
        params: String(match[2] || '')
          .split(/\s*,\s*/)
          .map((entry) => String(entry || '').trim())
          .filter(Boolean)
      };
    }

    function parseSdl3MacroExpansion(syntax) {
      const match = /^\s*#define\s+[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)\s*([\s\S]+)$/m.exec(String(syntax || ''));
      return match ? String(match[1] || '').trim() : '';
    }

    function escapeSdl3RegexFragment(value = '') {
      return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function getSdl3DisplayParameters(item) {
      if (Array.isArray(item?.parameters) && item.parameters.length) {
        return item.parameters;
      }

      if (item?.kind === 'macro') {
        const macroSignature = parseSdl3MacroSignature(item?.syntax || '');
        if (macroSignature.params.length) {
          return macroSignature.params.map((name) => ({type: '', name}));
        }
      }

      const callbackSignature = parseSdl3CallbackSignature(item?.syntax || '');
      if (callbackSignature.params.length) {
        return callbackSignature.params
          .map((param) => parseSdl3SignatureParameter(param))
          .filter(Boolean);
      }

      const signature = parseSdl3FunctionSignature(item?.syntax || '');
      if (signature.params.length) {
        return signature.params
          .map((param) => parseSdl3SignatureParameter(param))
          .filter(Boolean);
      }

      return [];
    }

    function getSdl3MacroVersionParameterProfile(param, item) {
      if (item?.kind !== 'macro' || !/VERSION_ATLEAST$/.test(String(item?.name || ''))) {
        return null;
      }

      const name = String(param?.name || '').trim();
      if (!name) {
        return null;
      }

      const axisMap = {
        X: {
          axis: 'الإصدار الرئيسي',
          usage: 'مرر رقم الإصدار الرئيسي الأدنى الذي تريد قبول هذه النسخة ابتداءً منه.',
          invalid: 'إذا مررت قيمة رئيسية أعلى من المطلوب فعليًا فقد ترفض نسخًا صالحة، وإذا خفضتها أكثر من اللازم فقد تقبل نسخة لا توفر الميزات التي تعتمد عليها.'
        },
        Y: {
          axis: 'الإصدار الفرعي',
          usage: 'مرر رقم الإصدار الفرعي الأدنى داخل نفس الإصدار الرئيسي الذي تريد التحقق منه.',
          invalid: 'إذا لم يطابق الرقم الفرعي الحد الأدنى الصحيح فقد تنجح المقارنة مع نسخة لا تملك السلوك أو الإصلاح الذي تنتظره، أو تفشل مع نسخة مناسبة.'
        },
        Z: {
          axis: 'إصدار التصحيح',
          usage: 'مرر رقم التصحيح أو الميكرو الأدنى الذي تمثل منه النسخة المقبولة داخل نفس السلسلة.',
          invalid: 'إذا كان رقم التصحيح غير صحيح فقد تبني القرار على نسخة أقدم من الإصلاح المطلوب أو تستبعد نسخة كافية بلا سبب.'
        }
      };
      const axisInfo = axisMap[name];
      if (!axisInfo) {
        return null;
      }

      return {
        type: `تعبير عددي صحيح يمثل ${axisInfo.axis}`,
        description: `${axisInfo.axis} الذي تريد أن تقارن به الماكرو عند التحقق من الحد الأدنى للإصدار.`,
        role: `يدخل هذا الرقم في المقارنة الشرطية التي يوسعها الماكرو لتقرير هل النسخة المجمَّع معها تساوي هذا الحد الأدنى أو تتجاوزه.`,
        purpose: 'لأن فحص التوافق يعتمد على فصل الإصدار إلى رئيسي وفرعي وتصحيح بدل مقارنة نصية أو رقم واحد غير معبر.',
        usage: axisInfo.usage,
        misuse: axisInfo.invalid
      };
    }

    function inferSdl3MacroParameterFunctionalType(param, item) {
      const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);
      if (versionMacroProfile?.type) {
        return versionMacroProfile.type;
      }

      const name = String(param?.name || '').trim();
      if (!name || item?.kind !== 'macro') {
        return '';
      }

      const expansion = parseSdl3MacroExpansion(item?.syntax || '');
      const escapedName = escapeSdl3RegexFragment(name);
      const comparisonRegex = new RegExp(`(?:\\b${escapedName}\\b\\s*(?:>=|<=|==|!=|>|<)|(?:>=|<=|==|!=|>|<)\\s*\\b${escapedName}\\b)`);
      const bitwiseRegex = new RegExp(`(?:\\b${escapedName}\\b\\s*(?:\\||&|\\^)|(?:\\||&|\\^|~)\\s*\\b${escapedName}\\b)`);
      const booleanRegex = new RegExp(`(?:\\b${escapedName}\\b\\s*(?:&&|\\|\\|)|(?:&&|\\|\\||!)\\s*\\b${escapedName}\\b)`);
      const indexRegex = new RegExp(`\\[\\s*\\b${escapedName}\\b\\s*\\]`);
      const stringifyRegex = new RegExp(`#\\s*${escapedName}\\b`);
      const tokenPasteRegex = new RegExp(`(?:##\\s*${escapedName}\\b|\\b${escapedName}\\s*##)`);
      const pointerRegex = new RegExp(`(?:\\*\\s*\\b${escapedName}\\b|\\b${escapedName}\\b\\s*->)`);
      const arithmeticRegex = new RegExp(`(?:\\b${escapedName}\\b\\s*[+\\-*/%]|[+\\-*/%]\\s*\\b${escapedName}\\b)`);
      const normalizedName = name.toLowerCase();

      if (stringifyRegex.test(expansion)) {
        return 'اسم رمزي يتحول إلى سلسلة نصية داخل التوسعة';
      }
      if (tokenPasteRegex.test(expansion)) {
        return 'معرّف رمزي يدمج داخل اسم مركب في التوسعة';
      }
      if (bitwiseRegex.test(expansion) || /flag|flags|mask|bits?/.test(normalizedName)) {
        return /flag|flags|mask|bits?/.test(normalizedName) ? 'قناع بتات' : 'تعبير عددي بتّي';
      }
      if (comparisonRegex.test(expansion) || indexRegex.test(expansion) || arithmeticRegex.test(expansion)) {
        if (/major|minor|micro|patch/.test(normalizedName)) {
          if (/major/.test(normalizedName)) return 'تعبير عددي صحيح يمثل الإصدار الرئيسي';
          if (/minor/.test(normalizedName)) return 'تعبير عددي صحيح يمثل الإصدار الفرعي';
          return 'تعبير عددي صحيح يمثل إصدار التصحيح';
        }
        if (/count|size|length|len|index|idx|offset|width|height|rate|channels|num|seconds|ms|hz|x|y|z/.test(normalizedName)) {
          return /index|idx|offset/.test(normalizedName)
            ? 'تعبير عددي صحيح يمثل فهرسًا أو إزاحة'
            : 'تعبير عددي صحيح';
        }
        return 'تعبير عددي صحيح';
      }
      if (booleanRegex.test(expansion) || /enabled|enable|disabled|disable|bool|ok|valid/.test(normalizedName)) {
        return 'تعبير منطقي';
      }
      if (pointerRegex.test(expansion) || /ptr|pointer|data|userdata|ctx|context/.test(normalizedName)) {
        if (/ctx|context/.test(normalizedName)) {
          return 'مؤشر إلى سياق';
        }
        if (/data|userdata/.test(normalizedName)) {
          return 'مؤشر بيانات';
        }
        return 'مؤشر';
      }
      if (/name|title|text|string|path|file|filename|extension|ext|suffix|prefix/.test(normalizedName)) {
        return 'سلسلة نصية';
      }
      if (/key|property|prop/.test(normalizedName)) {
        return 'مفتاح نصي';
      }
      if (/type|format|mode|kind|operation|op/.test(normalizedName)) {
        return 'قيمة ثابتة رمزية';
      }
      if (/symbol|token|id|identifier/.test(normalizedName)) {
        return 'معرّف رمزي';
      }

      return 'تعبير برمجي من الفئة التي تستهلكها التوسعة';
    }

    function getSdl3DisplayedParameterType(param, item) {
      if (typeof externalGetSdl3DisplayedParameterType === 'function') {
        return externalGetSdl3DisplayedParameterType(param, item);
      }
      const explicitType = String(param?.type || '').trim();
      if (explicitType) {
        return {
          text: explicitType,
          isCode: true
        };
      }

      if (item?.kind === 'macro') {
        const inferredType = inferSdl3MacroParameterFunctionalType(param, item);
        if (inferredType) {
          return {
            text: inferredType,
            isCode: false
          };
        }
      }

      return {
        text: '—',
        isCode: false
      };
    }

    function buildSdl3ParameterDescriptionFallback(param, item) {
      if (typeof externalBuildSdl3ParameterDescriptionFallback === 'function') {
        return externalBuildSdl3ParameterDescriptionFallback(param, item);
      }
      const name = String(param?.name || '').trim();
      const type = String(param?.type || '').trim();
      const key = `${name} ${type}`.toLowerCase();
      const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

      if (versionMacroProfile?.description) {
        return versionMacroProfile.description;
      }

      if (/mix_audiodecoder|audiodecoder/.test(key)) {
        return 'مفكك الترميز الصوتي الذي تحمل الدالة حالته الحالية أو تستخرج منه مواصفات الصوت أو خصائصه.';
      }
      if (/decoder/.test(key)) {
        return 'مفكك الترميز الذي يحمل حالة القراءة الحالية ويُستخرج منه الإطار أو الخصائص أو البيانات المطلوبة.';
      }
      if (/encoder/.test(key)) {
        return 'مشفر الترميز الذي تستقبل الدالة عبره الإطارات أو تنهي عليه عملية الكتابة الحالية.';
      }
      if (/mix_audio|\baudio\b/.test(key)) {
        return 'المورد الصوتي الذي ستقرأ الدالة مدته أو خصائصه أو تنسيقه أو أي معلومة مرتبطة به.';
      }
      if (/mix_track|\btrack\b/.test(key)) {
        return 'المسار الذي ستقرأ الدالة حالته الحالية أو موضعه أو المورد المرتبط به.';
      }
      if (/mix_group|\bgroup\b/.test(key)) {
        return 'مجموعة المزج التي ستقرأ الدالة خصائصها أو المِكسر المالك لها.';
      }
      if (/stream|iostream|io/.test(key)) {
        return 'مجرى الإدخال/الإخراج الذي تُقرأ منه البيانات أو تُكتب إليه ضمن هذا الاستدعاء.';
      }
      if (/callback/.test(key)) {
        return 'رد النداء الذي تستدعيه SDL لاحقًا لإرجاع النتيجة أو الإشعار المرتبط بهذه العملية.';
      }
      if (/userdata/.test(key)) {
        return 'مرجع خاص بالتطبيق تعيده SDL كما هو إلى رد النداء حتى تربط النتيجة بسياقك الداخلي.';
      }
      if (/closeio/.test(key)) {
        return 'قيمة منطقية تحدد هل يُغلق مجرى الإدخال/الإخراج تلقائيًا عند انتهاء العملية أم يبقى مفتوحًا.';
      }
      if (/type/.test(key)) {
        return 'النوع أو الامتداد أو الفئة التي تحدد كيف تُفسَّر البيانات أو كيف يُنفَّذ هذا المسار.';
      }
      if (/file|filename|path|location/.test(key)) {
        return 'الملف أو المسار الذي تقرأ منه الدالة أو تكتب إليه أو تبدأ منه العملية.';
      }
      if (/duration/.test(key)) {
        return 'المدة الزمنية المرتبطة بهذا الإطار أو بهذه البيانات أثناء الترميز أو العرض.';
      }
      if (/audiospec|\bspec\b/.test(key)) {
        return 'بنية SDL_AudioSpec التي ستكتب الدالة فيها مواصفات الصوت أو تقرؤها منها بحسب هذا الاستدعاء.';
      }
      if (/point3d|\bposition\b/.test(key)) {
        return 'البنية التي تحمل الموضع المكاني الحالي وتملؤها الدالة عند النجاح.';
      }
      if (/\btag\b/.test(key)) {
        return 'الوسم النصي الذي تبحث به الدالة عن المسارات أو المجموعات المطابقة.';
      }
      if (/\bcount\b/.test(key) && /\*/.test(type)) {
        return 'مؤشر خرج اختياري تكتب الدالة فيه عدد العناصر التي أعادتها فعليًا.';
      }
      if (/pts/.test(key)) {
        return 'ختم العرض الزمني الذي يحدد توقيت هذا الإطار داخل التسلسل المرئي أو الزمني.';
      }
      if (/surface/.test(key)) {
        return 'السطح الذي يحمل بيانات الصورة أو الإطار الذي ستقرأه الدالة أو تضيفه أو تعدله.';
      }
      if (/props|propertiesid/.test(key)) {
        return 'وعاء الخصائص الذي يحدد الإعدادات الاختيارية التي يعتمد عليها هذا الاستدعاء.';
      }
      if (/mix_mixer|\bmixer\b/.test(key)) {
        return 'المِكسر الذي صُمم هذا المورد أو هذا المسار الصوتي ليعمل معه، ويمكن أن تكون القيمة NULL إذا لم يكن الربط بمِكسر محدد مطلوبًا.';
      }
      if (name === 'hz' || /\bhz\b|frequency/.test(key)) {
        return 'التردد الذي يحدد طبقة الصوت للموجة أو الإشارة الصوتية الناتجة، بوحدة هرتز.';
      }
      if (/amplitude/.test(key)) {
        return 'سعة الإشارة الصوتية التي تحدد شدة الصوت بين 0.0f و1.0f.';
      }
      if (name === 'ms' || /milliseconds/.test(key)) {
        return 'المدة القصوى للصوت المولد بالمللي ثانية، والقيمة السالبة تعني توليدًا مستمرًا بلا نهاية محددة.';
      }

      return buildSdl3ParameterRole(param, item);
    }

    function renderSdl3ParameterDescriptionText(param, item) {
      const fallback = buildSdl3ParameterDescriptionFallback(param, item);
      const translated = preferArabicSdl3DocText(param?.description || '', item, {
        section: 'parameter-description',
        fallbackText: fallback
      });
      if (!translated) {
        return fallback;
      }
      const normalized = normalizeSdl3ArabicTechnicalProse(translated);
      return /[A-Za-z]{3,}/.test(stripTooltipIdentifierNoise(stripMarkup(normalized))) ? fallback : normalized;
    }

    function buildSdl3ParameterTooltip(param, item) {
      const name = String(param?.name || '').trim() || 'parameter';
      const displayedType = getSdl3DisplayedParameterType(param, item);
      const type = String(displayedType.text || '').trim();
      const linkedType = getSdl3ReferenceFromType(type);
      const direction = inferSdl3ParameterDirectionLabel(param, item);
      return composeSemanticTooltip({
        title: name,
        kindLabel: 'معامل SDL3',
        typeLabel: type ? `${type}${direction ? ` | ${direction}` : ''}` : 'معامل',
        library: item?.packageDisplayName || item?.packageName || 'SDL3',
        meaning: sanitizeTooltipText(buildSdl3ParameterRole(param, item)) || sanitizeTooltipText(renderSdl3ParameterDescriptionText(param, item)),
        whyExists: sanitizeTooltipText(buildSdl3ParameterPurpose(param, item)),
        whyUse: linkedType ? `يمرر المبرمج هذا المعامل لأنه يربط الاستدعاء بالنوع ${linkedType.name} أو بالبيانات التي يقرأها هذا النوع.` : sanitizeTooltipText(buildSdl3ParameterPurpose(param, item)),
        actualUsage: sanitizeTooltipText(buildSdl3ParameterPracticalUsage(param, item)),
        warning: sanitizeTooltipText(buildSdl3ParameterMisuseImpact(param, item))
      });
    }

    function getSdl3ParameterAnchorId(item, param) {
      const itemName = String(item?.name || 'sdl3-item').replace(/[^A-Za-z0-9_:-]+/g, '-');
      const paramName = String(param?.name || 'parameter').replace(/[^A-Za-z0-9_:-]+/g, '-');
      return `sdl3-param-${itemName}-${paramName}`;
    }

    function inferSdl3ParameterDirectionLabel(param, item) {
      const name = String(param?.name || '').trim();
      const type = String(param?.type || '').trim();
      const combined = `${name} ${type}`;

      if (/\bconst\b/.test(type) && /\*/.test(type)) {
        return 'دخل للقراءة';
      }
      if (/\*/.test(type) && /\b(?:out|count|spec|position|result|status|output|value)\b/i.test(combined)) {
        return 'خرج تكتب الدالة فيه';
      }
      if (/\b(?:callback|userdata|props)\b/i.test(combined)) {
        return 'دخل يوجّه السلوك أو يربط السياق';
      }
      if (/\*/.test(type) && item?.kind === 'function') {
        return 'قد يكون دخلًا أو خرجًا حسب هذا الاستدعاء';
      }
      return 'دخل مباشر';
    }

    function buildSdl3FieldTooltip(field, item) {
      const name = String(field?.name || '').trim() || 'field';
      const type = String(field?.type || '').trim();
      return composeSemanticTooltip({
        title: name,
        kindLabel: 'حقل SDL3',
        typeLabel: type || 'حقل بنية',
        library: item?.packageDisplayName || item?.packageName || 'SDL3',
        meaning: sanitizeTooltipText(buildSdl3FieldMeaning(field, item)) || sanitizeTooltipText(buildSdl3FieldOfficialDescription(field, item)),
        whyExists: sanitizeTooltipText(buildSdl3FieldPurpose(field, item)),
        whyUse: sanitizeTooltipText(buildSdl3FieldPurpose(field, item)),
        actualUsage: sanitizeTooltipText(buildSdl3FieldPracticalUsage(field, item))
      });
    }

    return {
      SDL3_NATIVE_SYMBOL_INFO,
      SDL3_C_KEYWORDS,
      SDL3_C_TYPE_KEYWORDS,
      getSdl3DisplayParameters,
      getSdl3DisplayedParameterType,
      buildSdl3ParameterDescriptionFallback,
      looksLikeSdl3CodeExpression,
      formatSdl3CodeExpressionText,
      renderSdl3ParameterDescriptionCell,
      renderSdl3ParameterDescriptionText,
      buildSdl3ParameterTooltip,
      getSdl3ParameterAnchorId,
      inferSdl3ParameterDirectionLabel,
      buildSdl3FieldTooltip
    };
  }

  global.__ARABIC_VULKAN_SDL3_PARAMETER_RENDER_RUNTIME__ = {
    createSdl3ParameterRenderRuntime
  };
})(window);
