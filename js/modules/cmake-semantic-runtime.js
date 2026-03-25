(function initCmakeSemanticRuntime(global) {
  'use strict';

  function createCmakeSemanticRuntime(deps = {}) {
    const {
      getCanonicalReferenceDetailAnchorId,
      composeSemanticTooltip,
      buildContextualReferenceTooltip,
      renderContextualTokenLink,
      escapeHtml,
      resolveReferenceNavigation,
      getNavigationEntityIconType,
      buildNavigationTooltipForName,
      parseCmakeDefineToken,
      buildCmakeVariableReferenceInfo,
      buildCmakeEnvironmentReferenceInfo,
      getCmakeReferenceEntityContext,
      CMAKE_INLINE_SEMANTIC_TOKENS,
      CMAKE_INLINE_PLACEHOLDERS,
      CMAKE_INLINE_VARIABLE_REFERENCE_HELP
    } = deps;

    function getCmakeDetailSemanticIconType(row = null, fallbackName = '') {
      const semanticKind = String(row?.semanticKind || '').trim();
      const name = String(row?.name || fallbackName || '').trim();
      if (semanticKind === 'placeholder' || /^</.test(name) || name.startsWith('${') || name.startsWith('$ENV{')) return 'variable';
      if (semanticKind === 'group' || semanticKind === 'argument') return 'variable';
      if (semanticKind === 'property' || semanticKind === 'variable') return 'variable';
      if (semanticKind === 'expression' || name.startsWith('$<')) return 'macro';
      if (semanticKind === 'environment') return 'variable';
      if (semanticKind === 'flag') return 'constant';
      return 'command';
    }

    function normalizeCmakeSemanticLookupToken(rawToken = '') {
      return String(rawToken || '')
        .trim()
        .replace(/^\[|\]$/g, '')
        .replace(/^\(|\)$/g, '')
        .replace(/\.\.\.$/, '')
        .trim();
    }

    function findCmakeDetailRowByToken(rawToken = '', options = {}) {
      const token = normalizeCmakeSemanticLookupToken(rawToken);
      const entity = getCmakeReferenceEntityContext(options);
      const rows = Array.isArray(entity?.details?.parameters) ? entity.details.parameters : [];
      if (!token || !rows.length) return null;
      return rows.find((row) => normalizeCmakeSemanticLookupToken(row?.name || '') === token) || null;
    }

    function buildCmakeDetailRowTooltip(row = null, entity = null) {
      const name = String(row?.name || '').trim();
      const meaning = String(row?.descriptionArabic || row?.description || '').trim();
      const itemName = String(entity?.identity?.name || entity?.name || '').trim();
      if (!name) return '';

      return composeSemanticTooltip({
        title: name,
        kindLabel: 'معامل أو صياغة CMake',
        typeLabel: row?.type || 'جزء من الصياغة',
        library: 'CMake',
        meaning: meaning || 'هذا الجزء يحدد ما الذي يكتبه المبرمج أو أي سلوك فرعي يفعّله داخل هذا الاستدعاء.',
        whyExists: itemName
          ? `وُجد داخل صياغة ${itemName} لأنه يغيّر معنى هذا الاستدعاء أو يحدد البيانات التي يمررها المبرمج.`
          : 'وُجد داخل الصياغة لأنه يغيّر معنى الاستدعاء أو يحدد البيانات التي يمررها المبرمج.',
        whyUse: meaning || 'يفيدك فهمه لأن نفس الأمر يغيّر سلوكه بحسب وجود هذا الجزء أو القيمة الممررة فيه.',
        actualUsage: itemName
          ? `اضغط للانتقال إلى شرح هذا الجزء داخل صفحة ${itemName} نفسها.`
          : 'يظهر هنا كجزء من التوقيع أو المثال أو الشرح المرتبط بالأمر الحالي.'
      });
    }

    function renderCmakeDetailReferenceToken(rawToken = '', row = null, options = {}) {
      const entity = getCmakeReferenceEntityContext(options);
      const token = String(rawToken || row?.name || '').trim();
      if (!token || !row) return escapeHtml(token);

      const anchorId = getCanonicalReferenceDetailAnchorId('parameters', row.name || token);
      const tooltip = buildContextualReferenceTooltip(token, buildCmakeDetailRowTooltip(row, entity), options);
      const iconType = getCmakeDetailSemanticIconType(row, token);
      return renderContextualTokenLink(token, {
        href: `#${anchorId}`,
        onclick: `scrollToAnchor('${anchorId}')`,
        tooltip,
        iconType,
        className: 'related-link code-token usage-bridge-link entity-link-with-icon'
      });
    }

    function buildCmakeSemanticTooltip(token = '', info = {}, options = {}) {
      const text = String(token || '').trim();
      if (!text) return '';
      return composeSemanticTooltip({
        title: text,
        kindLabel: info.kindLabel || 'رمز CMake',
        typeLabel: info.typeLabel || 'صياغة أو كلمة مفتاحية',
        library: 'CMake',
        meaning: info.meaning || 'هذا الرمز جزء من صياغة CMake أو من تدفق configure/generate/build.',
        whyExists: info.whyExists || `وُجد لأن CMake تستخدم هذا الرمز لتحديد معنى أدق من مجرد اسم خام داخل ${String(options.contextLabel || 'السياق الحالي')}.`,
        whyUse: info.whyUse || 'يفيد فهمه لأن CMake تغيّر السلوك الفعلي بحسب وجود هذا الرمز أو القيمة المرتبطة به.',
        actualUsage: info.actualUsage || 'يظهر في التوقيع أو المثال أو النص المحيط ليشرح السلوك العملي لهذا الجزء.'
      });
    }

    function getCmakeSemanticTokenInfo(rawToken = '', options = {}) {
      const token = String(rawToken || '').trim();
      if (!token) return null;

      if (CMAKE_INLINE_SEMANTIC_TOKENS[token]) return CMAKE_INLINE_SEMANTIC_TOKENS[token];

      const normalized = normalizeCmakeSemanticLookupToken(token);
      if (CMAKE_INLINE_SEMANTIC_TOKENS[normalized]) return CMAKE_INLINE_SEMANTIC_TOKENS[normalized];

      if (CMAKE_INLINE_PLACEHOLDERS[normalized]) {
        return {
          kindLabel: 'Placeholder في CMake',
          typeLabel: 'قيمة يكتبها المبرمج',
          meaning: CMAKE_INLINE_PLACEHOLDERS[normalized],
          whyUse: 'يفيد لأن التوقيع هنا يوضح نوع القيمة المتوقعة لا القيمة الحرفية نفسها.',
          actualUsage: 'اكتب في هذا الموضع قيمة حقيقية من نوع placeholder الموضح داخل الأقواس الزاوية.'
        };
      }

      if (token === '...') {
        return {
          kindLabel: 'علامة CMake',
          typeLabel: 'تكرار أو قائمة مفتوحة',
          meaning: 'تعني أن هذا الموضع يمكن أن يتكرر أكثر من مرة، أو أن الأمر يقبل قائمة مفتوحة من العناصر التالية.',
          whyUse: 'تفيد لأنها توضح أن الصياغة لا تتوقف عند عنصر واحد فقط، بل يمكن تمرير عدد أكبر بحسب الحاجة.',
          actualUsage: 'تظهر كثيرًا بعد placeholders مثل <item> أو <targets> أو داخل المجموعات الاختيارية.'
        };
      }

      if (/^\[[^\[\]]+]$/.test(token)) {
        const inner = token.slice(1, -1);
        const innerInfo = getCmakeSemanticTokenInfo(inner, options);
        return {
          kindLabel: innerInfo?.kindLabel || 'جزء اختياري في الصياغة',
          typeLabel: 'مكوّن اختياري',
          meaning: innerInfo?.meaning
            ? `${innerInfo.meaning} وجود هذا الجزء هنا اختياري لأن CMake تضعه بين أقواس مربعة في التوقيع.`
            : 'هذا الجزء اختياري في الصياغة، أي أن المبرمج يمرره فقط عندما يحتاج السلوك الذي يفعّله.',
          whyUse: innerInfo?.whyUse || 'يفيد لأن الصياغة هنا تميز بين الجزء المطلوب والجزء الاختياري.',
          actualUsage: innerInfo?.actualUsage || 'يمكنك حذف هذا الجزء أو تمريره بحسب الحاجة العملية لهذا الأمر.'
        };
      }

      if (/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(token)) return buildCmakeVariableReferenceInfo(token.slice(2, -1));
      if (/^\$ENV\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(token)) return buildCmakeEnvironmentReferenceInfo(token.slice(5, -1));
      if (/^CMAKE_<[A-Z]+>_STANDARD$/.test(token)) return buildCmakeVariableReferenceInfo(token);
      if (normalized === 'CXX_STANDARD') return CMAKE_INLINE_VARIABLE_REFERENCE_HELP.CXX_STANDARD;
      if (/^CMAKE_[A-Z0-9_]+$/.test(normalized)) return buildCmakeVariableReferenceInfo(normalized);

      if (/^\$<.+>$/.test(token)) {
        const configMatch = token.match(/\$<CONFIG:([^>]+)>/);
        return {
          kindLabel: 'Generator Expression',
          typeLabel: 'تقييم متأخر',
          meaning: configMatch
            ? `هذه Generator Expression تختبر ما إذا كان الإعداد الحالي هو ${configMatch[1]} قبل أن تمرر القيمة اللاحقة.`
            : 'هذه Generator Expression لا تُحسم لحظة قراءة الملف، بل تقيَّم في سياق لاحق مثل خصائص الأهداف أو أوامر التثبيت أو build configuration.',
          whyUse: 'تستخدم عندما تريد تغيير التعريفات أو المسارات أو الخصائص بحسب الإعداد أو الهدف أو المنصة دون نسخ الأوامر كلها.',
          actualUsage: 'أثرها يظهر غالبًا في generate/build/install flow لا في النص اللحظي وحده.'
        };
      }

      const defineToken = parseCmakeDefineToken(token);
      if (defineToken) {
        return {
          kindLabel: 'خيار سطر أوامر CMake',
          typeLabel: 'تعريف Cache مسبق',
          meaning: `يمرر قيمة أولية للمتغير ${defineToken.variableName} من سطر الأوامر قبل بدء configure.`,
          whyUse: 'يستخدمه المبرمج لتغيير سلوك البناء دون تعديل ملفات المشروع نفسها.',
          actualUsage: defineToken.assignedValue
            ? 'يؤثر مباشرة في cache وفي القرارات التي ستُتخذ أثناء configure، لأن القيمة تمر من الطرفية قبل قراءة CMakeLists.txt.'
            : 'يؤثر مباشرة في cache وفي القرارات التي ستُتخذ أثناء configure.'
        };
      }

      const quickTokens = {
        cmake: ['أداة CMake', 'استدعاء طرفية', 'هذا هو الأمر التنفيذي الرئيسي لـ CMake من الطرفية، ومن خلاله تبدأ التهيئة أو التوليد أو البناء أو التثبيت أو تشغيل preset.', 'يفيد عندما تريد تشغيل مسار CMake من CLI بدل الاكتفاء بالمحرر أو IDE.', 'غالبًا يظهر في أمثلة مثل cmake -S . -B build أو cmake --build build أو cmake --install build.'],
        '-D': ['خيار سطر أوامر CMake', 'تعريف Cache', 'هذا الخيار يعرّف قيمة cache من الطرفية قبل أن يبدأ configure.', 'يستخدم لتغيير إعدادات المشروع من CLI أو CI دون تعديل الملفات المصدرية.', 'يظهر عادة بالشكل cmake -DNAME=value أو ضمن أوامر أطول مثل cmake -S . -B build -D...'],
        '-S': ['خيار سطر أوامر CMake', 'Source Directory', 'يحدد مجلد المصدر الذي سيقرأ منه CMakeLists.txt.', 'يفصل بين مكان ملفات المشروع ومكان مجلد البناء.', 'يستخدم غالبًا مع -B لبناء خارج شجرة المصدر.'],
        '-B': ['خيار سطر أوامر CMake', 'Build Directory', 'يحدد مجلد البناء الذي ستكتب فيه ملفات التهيئة والنواتج المؤقتة.', 'يفيد للبناء خارج source tree.', 'تظهر قيمته أثناء configure ثم تتجمع فيها ملفات cache والمولدات.'],
        '--build': ['خيار سطر أوامر CMake', 'تشغيل البناء', 'يطلب من CMake تشغيل أداة البناء على build directory مهيأ مسبقًا بدل إعادة التهيئة.', 'يفيد عندما تريد أن يبقى استدعاء البناء موحدًا بغض النظر عن المولد المستخدم.', 'يظهر عادة بالشكل cmake --build build أو مع --config في المولدات متعددة الإعدادات.'],
        '--install': ['خيار سطر أوامر CMake', 'تشغيل التثبيت', 'يطلب من CMake تنفيذ قواعد install المولدة على build directory مهيأ ومبني.', 'يفيد عندما تريد تطبيق install step من CLI بصورة قياسية بدل معرفة أداة التثبيت الخاصة بكل مولد.', 'يظهر غالبًا بالشكل cmake --install build وقد يتأثر مباشرة بـ CMAKE_INSTALL_PREFIX.'],
        '--preset': ['خيار سطر أوامر CMake', 'اختيار preset', 'يطلب من CMake قراءة إعدادات محفوظة من CMakePresets.json أو CMakeUserPresets.json وتشغيل الاسم المحدد منها.', 'يفيد لتوحيد الاستدعاءات بين المطورين وCI والمحررات من دون إعادة كتابة generator وcacheVariables في كل مرة.', 'يظهر عادة بالشكل cmake --preset debug أو مع أوامر build/test الموافقة حسب نوع الـ preset.']
      };
      if (quickTokens[token]) {
        const [kindLabel, typeLabel, meaning, whyUse, actualUsage] = quickTokens[token];
        return {kindLabel, typeLabel, meaning, whyUse, actualUsage};
      }

      if (/^[A-Za-z0-9_.+-]+Config(?:Version)?\.cmake$/i.test(token)) {
        return {
          kindLabel: 'ملف Package Config في CMake',
          typeLabel: /Version/i.test(token) ? 'ملف تحقق إصدار' : 'ملف إعداد حزمة',
          meaning: /Version/i.test(token)
            ? 'هذا الملف يقرر هل الإصدار المطلوب من الحزمة متوافق مع الإصدار المثبت قبل أن يعتبر find_package النتيجة ناجحة.'
            : 'هذا الملف يحمّل targets والواجهة المصدَّرة للحزمة حتى يستهلكها find_package في المشروع الآخر.',
          whyUse: 'يفيد لأن هذا الاسم ليس artefact عابرًا؛ بل جزء من مسار package/config الذي يربط التثبيت بالاستهلاك downstream.',
          actualUsage: 'يُولَّد أو يُثبَّت عادةً مع CMakePackageConfigHelpers ثم يقرأه find_package لاحقًا في Config mode.'
        };
      }

      if (/^(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+\.(?:cmake|json)$/i.test(token) || /^[A-Za-z0-9_.+-]+\.(?:cmake|json)$/i.test(token)) {
        return {
          kindLabel: 'ملف أو artefact مرتبط بـ CMake',
          typeLabel: /\.json$/i.test(token) ? 'ملف JSON' : 'ملف CMake',
          meaning: /\.json$/i.test(token)
            ? 'هذا ملف إعداد أو بيانات يقرأه CMake أو الأدوات المرتبطة به ضمن مسار presets أو التكوين.'
            : 'هذا اسم ملف CMake أو مسار ملف مساعد يقرأه المشروع أو يولده أثناء configure أو package step.',
          whyUse: 'يفيد لأن أسماء الملفات هنا ليست نصوصًا عائمة، بل artefacts تدخل فعليًا في include أو package config أو presets.',
          actualUsage: /helpers\.cmake$/i.test(token)
            ? 'في هذا السياق يمثل ملفًا مساعدًا تقرؤه include() أثناء configure داخل نفس المشروع.'
            : 'يظهر هنا كملف يقرأه CMake أو يولده ضمن مسار configure/package/preset.'
        };
      }

      if (/^-W[A-Za-z0-9_+-]+$/.test(token)) {
        return {
          kindLabel: 'علم ترجمة',
          typeLabel: 'Compiler Warning Flag',
          meaning: 'هذا علم يمرَّر إلى المصرّف لضبط التحذيرات أو السلوك التحليلي وقت الترجمة.',
          whyUse: 'يفيد لرفع جودة التحذيرات أو تشديدها في الأهداف التعليمية أو الإنتاجية.',
          actualUsage: 'لا تفسره CMake بذاته كمتغير، بل تمرره إلى المصرّف عبر target_compile_options أو ما شابه.'
        };
      }

      if (/^--[A-Za-z0-9][A-Za-z0-9-]*$/.test(token)) {
        return {
          kindLabel: 'خيار سطر أوامر',
          typeLabel: 'وسيط طويل',
          meaning: 'هذا وسيط طويل يمرَّر إلى البرنامج أو أداة الاختبار كما هو، وليس كلمة خاصة داخل لغة CMake نفسها.',
          whyUse: 'يفيد عندما تريد أن يمرر CMake خيارًا معينًا إلى البرنامج أو الاختبار الذي تشغله.',
          actualUsage: 'يظهر عادة داخل add_test أو custom commands عندما يستدعي CMake أمرًا خارجيًا.'
        };
      }

      if (/^-[A-Za-z0-9][A-Za-z0-9-]*$/.test(token)) {
        return {
          kindLabel: 'خيار أو جزء من اسم تقني',
          typeLabel: 'وسيط شرطي أو لاحقة اسم',
          meaning: 'هذا الجزء يمثل خيارًا أو لاحقة مرتبطة باسم أو مسار أو وسيط يمرره المبرمج داخل الصياغة أو المثال.',
          whyUse: 'يفيد لأن الشرطات في هذا الموضع ليست زخرفية، بل تغيّر معنى الاسم أو الوسيط الذي تقرؤه الأداة.',
          actualUsage: 'قد يظهر كخيار سطر أوامر أو كجزء من اسم مجلد/ملف داخل المثال.'
        };
      }

      if (/^(?:build|configure|generate|install)$/i.test(token)) {
        const map = {
          build: 'مرحلة البناء الفعلي التي تنفذ فيها أداة المولد الأوامر على الملفات المهيأة.',
          configure: 'مرحلة التهيئة التي يفسر فيها CMakeLists.txt ويقرر القيم والمتغيرات والاعتماديات.',
          generate: 'مرحلة التوليد التي يكتب فيها CMake ملفات build للنظام أو الأداة المستهدفة.',
          install: 'مرحلة التثبيت التي تنسخ فيها النواتج إلى شجرة التثبيت أو الحزمة.'
        };
        return {
          kindLabel: 'مرحلة CMake',
          typeLabel: 'مرحلة تنفيذ',
          meaning: map[token.toLowerCase()] || '',
          whyUse: 'يفيد فهم المرحلة لأن كثيرًا من رموز CMake يتغير أثرها بحسب وقت تقييمها.',
          actualUsage: 'هذا المصطلح يحدد أين يظهر الأثر العملي: في configure أو generate أو build أو install.'
        };
      }

      if (/^[A-Z@][A-Z0-9_@]*$/.test(normalized)) {
        return {
          kindLabel: 'رمز CMake',
          typeLabel: 'كلمة مفتاحية أو قيمة ثابتة',
          meaning: 'هذا الرمز يدخل في صياغة CMake الحالية ليحدد خيارًا أو تعريفًا أو قيمة ثابتة لها أثر سلوكي مباشر.',
          whyUse: 'يفيد فهمه لأن CMake لا تقرأ هذه الكلمات كزينة شكلية، بل كعناصر تغيّر التفسير الفعلي للسطر.',
          actualUsage: 'ابحث عن معناه من السياق الحالي: قد يكون keyword أو تعريف compile أو اسم خاصية أو اسم مكوّن.'
        };
      }

      if (/^[A-Za-z0-9_]+(?:-[A-Za-z0-9_]+)+$/.test(normalized)) {
        return {
          kindLabel: 'اسم تقني داخل المثال',
          typeLabel: 'اسم موصول بشرطات',
          meaning: 'هذا الاسم الموصول بشرطات يمثل عادة اسم مجلد أو مشروع أو أداة أو وسيطًا يمر كما هو داخل المثال الحالي.',
          whyUse: 'يفيد فهمه لأن هذه الصيغة ليست جملة عربية أو شرحًا، بل قيمة عملية تستخدمها الأداة أو المسار كما هي.',
          actualUsage: 'يظهر كثيرًا في أسماء المشاريع والمجلدات الفرعية وخيارات الاختبارات.'
        };
      }

      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(normalized) && /[_]/.test(normalized)) {
        return {
          kindLabel: 'رمز CMake أو اسم برمجي',
          typeLabel: 'اسم تقني داخل المثال',
          meaning: 'هذا الاسم يمثل رمزًا تقنيًا يمر في السياق الحالي مثل تعريف ترجمة أو متغير أو مساعد module.',
          whyUse: 'يفيدك فهمه لأن CMake أو الأداة المرتبطة ستقرأه كاسم له وظيفة عملية لا كنص عادي.',
          actualUsage: 'قد يكون تعريف compile أو اسم متغير cache أو اسم حزمة أو مساعدًا تابعًا لوحدة CMake.'
        };
      }

      return null;
    }

    function renderCmakeSemanticSpan(token = '', info = null, options = {}) {
      const tooltip = buildContextualReferenceTooltip(token, buildCmakeSemanticTooltip(token, info || {}, options), options);
      const iconType = info?.iconType || (/^</.test(token) || token.startsWith('${') || token.startsWith('$ENV{') ? 'variable' : (token.startsWith('$<') ? 'macro' : 'command'));
      return renderContextualTokenLink(token, {
        tooltip,
        iconType,
        className: 'related-link related-link-static code-token usage-bridge-link entity-link-with-icon',
        staticElement: true
      });
    }

    function renderCmakeNavigationTokenLink(token = '', navigation = null, tooltip = '', options = {}) {
      if (!navigation?.type) return '';
      const referenceName = String(options.referenceName || token).trim();
      const iconType = getNavigationEntityIconType(navigation, referenceName);
      const classNamePrefix = String(options.classNamePrefix || 'keyword').trim();
      const className = iconType ? `${classNamePrefix} code-token code-link entity-link-with-icon` : `${classNamePrefix} code-token code-link`;
      return renderContextualTokenLink(token, {
        tooltip,
        iconType,
        className,
        onclick: navigation.command,
        title: options.title || referenceName
      });
    }

    function renderCmakeSemanticToken(rawToken = '', options = {}) {
      const token = String(rawToken || '').trim();
      if (!token) return '';

      const detailRow = findCmakeDetailRowByToken(token, options);
      if (detailRow) return renderCmakeDetailReferenceToken(token, detailRow, options);

      if (/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(token)) {
        const variableName = token.slice(2, -1);
        const cmakeNavigation = resolveReferenceNavigation(variableName);
        if (cmakeNavigation?.type === 'cmake') {
          const semanticInfo = getCmakeSemanticTokenInfo(token, options);
          const tooltip = buildContextualReferenceTooltip(
            token,
            semanticInfo ? buildCmakeSemanticTooltip(token, semanticInfo, options) : (buildNavigationTooltipForName(variableName, cmakeNavigation) || variableName),
            options
          );
          return renderCmakeNavigationTokenLink(token, cmakeNavigation, tooltip, {classNamePrefix: 'variable', referenceName: variableName, title: variableName});
        }
      }

      const defineToken = parseCmakeDefineToken(token);
      if (defineToken) {
        const variableName = defineToken.variableName;
        const cmakeNavigation = resolveReferenceNavigation(variableName);
        if (cmakeNavigation?.type === 'cmake') {
          const tooltip = buildContextualReferenceTooltip(token, buildNavigationTooltipForName(variableName, cmakeNavigation) || variableName, options);
          return renderCmakeNavigationTokenLink(token, cmakeNavigation, tooltip, {classNamePrefix: 'variable', referenceName: variableName, title: variableName});
        }
      }

      const navigation = resolveReferenceNavigation(token);
      if (navigation?.type === 'cmake') {
        const tooltip = buildContextualReferenceTooltip(token, buildNavigationTooltipForName(token, navigation) || token, options);
        return renderCmakeNavigationTokenLink(token, navigation, tooltip, {classNamePrefix: 'keyword', referenceName: token, title: token});
      }

      const semanticInfo = getCmakeSemanticTokenInfo(token, options);
      if (semanticInfo) return renderCmakeSemanticSpan(token, semanticInfo, options);
      return '';
    }

    return {
      getCmakeDetailSemanticIconType,
      normalizeCmakeSemanticLookupToken,
      findCmakeDetailRowByToken,
      buildCmakeDetailRowTooltip,
      renderCmakeDetailReferenceToken,
      buildCmakeSemanticTooltip,
      getCmakeSemanticTokenInfo,
      renderCmakeSemanticSpan,
      renderCmakeNavigationTokenLink,
      renderCmakeSemanticToken
    };
  }

  global.__ARABIC_VULKAN_CMAKE_SEMANTIC_RUNTIME__ = Object.freeze({
    createCmakeSemanticRuntime
  });
})(window);
