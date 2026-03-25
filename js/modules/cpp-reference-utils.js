(function (global) {
  const cppFundamentalTypeTokens = new Set([
    'bool', 'char', 'short', 'int', 'long', 'float', 'double', 'void'
  ]);
  const cppBooleanLiteralTokens = new Set(['true', 'false']);
  const cppFixedWidthTypeTokens = new Set(['uint32_t', 'uint64_t', 'int32_t', 'size_t']);
  const cppLanguageOnlyTokens = new Set([
    'auto', 'bool', 'char', 'class', 'const', 'constexpr', 'double', 'false',
    'float', 'if', 'int', 'long', 'nullptr', 'return', 'short', 'struct',
    'true', 'void'
  ]);
  const cppHeaderMap = Object.freeze({
    'std::array': '<array>',
    'std::cout': '<iostream>',
    'std::cerr': '<iostream>',
    'std::endl': '<iostream>',
    'std::exception': '<exception>',
    'std::ifstream': '<fstream>',
    'std::make_shared': '<memory>',
    'std::make_unique': '<memory>',
    'std::move': '<utility>',
    'std::numeric_limits': '<limits>',
    'std::optional': '<optional>',
    'std::set': '<set>',
    'std::shared_ptr': '<memory>',
    'std::sort': '<algorithm>',
    'std::span': '<span>',
    'std::string': '<string>',
    'std::stringstream': '<sstream>',
    'std::string_view': '<string_view>',
    'std::unique_ptr': '<memory>',
    'std::weak_ptr': '<memory>',
    'std::vector': '<vector>',
    'std::runtime_error': '<stdexcept>',
    'std::memcpy': '<cstring>',
    'int32_t': '<cstdint>',
    'uint32_t': '<cstdint>',
    'uint64_t': '<cstdint>',
    'size_t': '<cstddef>'
  });

  const cppTypeAliases = Object.freeze({
    'std::basic_string': 'std::string',
    'std::basic_string_view': 'std::string_view',
    'std::basic_streambuf': 'std::streambuf',
    'std::basic_istream': 'std::istream',
    'std::basic_ostream': 'std::ostream',
    'std::basic_ifstream': 'std::ifstream',
    'std::basic_ofstream': 'std::ofstream',
    'std::basic_fstream': 'std::fstream',
    'std::basic_ios': 'std::ios',
    'std::ios_base': 'std::ios',
    'std::condition_variable_any': 'std::condition_variable',
    'std::timed_mutex': 'std::mutex'
  });

  const api = {
    getCppReferenceData: () => ({}),
    getCppReferenceEnrichmentData: () => ({}),
    getCppReferenceOfficialLinks: () => ({}),
    getCppReferenceGuides: () => ({}),
    getCppReferenceTooltipOverrides: () => ({}),
    getCppKeywordTokens: () => new Set(),
    getExternalReferenceUrl: () => '',
    renderProjectReferenceLink: () => '',
    renderExternalReference: () => '',
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || '')
  };

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function getCppReferenceGuide(name) {
    return api.getCppReferenceGuides()?.[String(name || '').trim()] || null;
  }

  function getCppReferenceHeaderInfo(name) {
    const token = String(name || '').trim();
    if (!token) {
      return {label: '', note: ''};
    }

    if (cppLanguageOnlyTokens.has(token)) {
      return {
        label: 'لا يحتاج سطر تضمين معياري لأنه جزء من اللغة نفسها.',
        note: 'هذا عنصر لغوي يفسره المترجم مباشرة، وليس اسمًا تستورده من المكتبة القياسية.'
      };
    }

    const header = cppHeaderMap[token];
    if (header) {
      return {
        label: `#include ${header}`,
        note: `أضف هذا السطر قبل أول استخدام لـ ${token} حتى يتعرف المترجم على الاسم من المكتبة القياسية.`
      };
    }

    if (token.startsWith('std::')) {
      return {
        label: 'قد يحتاج سطر تضمين معياري مخصصًا لهذا الاسم.',
        note: 'بعض عناصر std لها ملف تضمين خاص. إذا لم يظهر هنا بعد فارجع إلى المرجع الرسمي أسفل الصفحة.'
      };
    }

    return {
      label: '',
      note: ''
    };
  }

  function getCppReferenceNamespaceInfo(name) {
    const token = String(name || '').trim();
    if (!token) {
      return {label: '', note: ''};
    }

    if (cppLanguageOnlyTokens.has(token)) {
      return {
        label: token,
        note: 'اكتب الاسم كما هو؛ فهو من صميم اللغة نفسها ولا يحتاج std:: ولا using.'
      };
    }

    if (token.startsWith('std::')) {
      return {
        label: token,
        note: `الأوضح عادة أن تكتب ${token} بصيغته الكاملة. إذا تكرر داخل نطاق صغير فيمكنك كتابة using ${token}; بدل using namespace std; حتى لا تفتح أسماء المكتبة كلها بلا حاجة.`
      };
    }

    return {
      label: token,
      note: 'اكتب الاسم بالنطاق الذي يعرّفه فعليًا داخل الكود الحالي.'
    };
  }

  function getCppReferenceTypeMeaning(typeLabel, item = {}) {
    const label = String(typeLabel || '').trim();
    const title = String(item.title || '').trim();
    const normalized = label.toLowerCase();
    const isStd = title.startsWith('std::');

    if (!label) {
      return 'هذا الوصف يحدد موقع العنصر داخل C++ من حيث دوره الفعلي: هل هو اسم من اللغة نفسها، أم نوع بيانات، أم دالة، أم أداة معيارية تبني فوق اللغة.';
    }

    if (/كلمة مفتاحية|محدد نوع|قيمة منطقية/.test(label)) {
      return 'هذا ليس كائنًا من المكتبة القياسية، بل اسم أو قيمة من صميم لغة C++ نفسها يفسرها المترجم مباشرة ويغيّر معنى السطر أو طريقة الترجمة.';
    }

    if (/type trait|سمة نوع/.test(label)) {
      return 'هذا trait يعمل في وقت الترجمة لفحص نوع آخر أو اشتقاق قرار نوعي منه، لذلك دوره الحقيقي ليس تخزين بيانات بل توجيه القوالب ومنع الاستخدام الخاطئ قبل التشغيل.';
    }

    if (/نوع قياسي|نوع أساسي|نوع أساسي C\+\+|نوع معياري C\+\+|نوع محدد العرض|نوع بيانات/.test(label)) {
      return 'هذا نوع بيانات يحدد شكل القيمة نفسها في الذاكرة وما العمليات التي يمكن تنفيذها عليها، لذلك فهمه يبدأ من السؤال: ماذا يخزن فعليًا ولماذا اختير بدل نوع آخر قريب.';
    }

    if (/مؤشر ذكي/.test(label)) {
      return 'هذا كائن من المكتبة القياسية يغلّف مؤشرًا خامًا ويضيف سياسة ملكية وعمر زمني واضحة، لذلك معناه الحقيقي مرتبط بمن يملك المورد ومتى يُحرَّر تلقائيًا.';
    }

    if (/حاوية/.test(label)) {
      return 'هذا نوع حاوية من المكتبة القياسية، أي بنية جاهزة لتنظيم مجموعة قيم وإدارتها مع قواعد محددة للوصول والترتيب والإضافة والحذف وتكلفة الأداء.';
    }

    if (/خوارزمية/.test(label)) {
      return 'هذه دالة خوارزمية عامة لا تملك البيانات بنفسها، بل تعمل على مدى من العناصر عبر iterators لتنفيذ عملية مثل البحث أو النسخ أو الترتيب أو التحويل.';
    }

    if (/استثناء|نوع خطأ/.test(label)) {
      return 'هذا نوع استثناء يُستخدم لنقل حالة فشل أو خطأ من موضع إلى آخر أثناء التنفيذ بدل إرجاع رمز خطأ عادي، ولذلك معناه الحقيقي مرتبط بسبب الفشل والسياق الذي يحمله.';
    }

    if (/تزامن|التزامن|ساعة زمنية|نوع زمني|وحدة زمنية/.test(label)) {
      return 'هذا عنصر مرتبط بالتزامن أو الزمن: إما أنه ينسق عمل عدة خيوط، أو يمثل مدة/لحظة/مصدر توقيت، ولذلك قيمته الحقيقية تظهر في التحكم بالترتيب والانتظار والتوقيت لا في تخزين بيانات عامة فقط.';
    }

    if (/تدفق|تيار|تدفق ملف|تدفق إخراج|تدفق سلسلة|معالج تدفق|مُنظّم تيار/.test(label)) {
      return 'هذا عنصر I/O أو formatting: إما تيار ينقل البيانات إلى ملف أو شاشة أو سلسلة، أو مُنظّم يغير طريقة عرض هذه البيانات أثناء القراءة والكتابة.';
    }

    if (/دالة رياضية|دالة تحويل|دالة ذاكرة|دالة نظام ملفات|دالة تزامن|دالة أداة|دالة معيارية|دالة مصنع|دالة إدخال|دالة/.test(label)) {
      return 'هذا عنصر استدعاء وظيفي: دوره الحقيقي أنه ينفذ عملية محددة عند الطلب، لا أنه يمثل حالة طويلة العمر. لفهمه اسأل: ما العملية التي يجريها على المدخلات، وما الذي يعيده، ومتى يكون اختياره مناسبًا.';
    }

    if (/كائن مقارنة|قالب تجزئة|غلاف استدعاء/.test(label)) {
      return 'هذا كائن وظيفي صغير يُستدعى مثل الدالة ويُمرَّر عادة إلى الحاويات أو الخوارزميات لتخصيص سلوك المقارنة أو التجزئة أو الاستدعاء غير المباشر.';
    }

    if (/معلومات نوع/.test(label)) {
      return 'هذا عنصر RTTI يصف نوعًا في وقت التشغيل، لذلك معناه الحقيقي ليس تمثيل قيمة عمل عادية بل كشف هوية النوع أو مقارنته عندما لا تكفي معرفة النوع وقت الترجمة.';
    }

    if (/عرض/.test(label)) {
      return 'هذا view غير مالك للبيانات غالبًا؛ يعرض طريقة قراءة أو تمرير أو تصفية عناصر موجودة أصلًا دون نسخها، لذلك فهمه يعتمد على علاقته بالبيانات الأصلية وعمرها الزمني.';
    }

    if (/تعبير نمطي/.test(label)) {
      return 'هذا عنصر regex يصف نمط مطابقة نصية يمكن إعادة استخدامه للبحث أو التحقق أو الاستخراج من السلاسل النصية.';
    }

    if (/مولد عشوائي|توزيع عشوائي/.test(label)) {
      return 'هذا عنصر من نظام التوليد العشوائي: إما محرك يولد أعدادًا خامًا بحسب خوارزمية، أو توزيع يحول هذه الأعداد إلى شكل إحصائي مطلوب.';
    }

    if (/نوع مساعد|نوع أداة|عنصر C\+\+/.test(label)) {
      return isStd
        ? 'هذا عنصر مساعد من المكتبة القياسية لا يمثل فئة كبيرة مستقلة مثل الحاويات أو الخوارزميات، لكنه يحل مشكلة بنيوية محددة مثل الربط بين أنواع أو القيم أو الحالات الوسيطة.'
        : 'هذا عنصر مساعد داخل C++ يستخدم لتوضيح البنية أو ربط الأجزاء الأخرى، ومعناه الحقيقي يتحدد من الدور الذي يلعبه في السطر أو القالب الحالي.';
    }

    if (/نوع/.test(label)) {
      return 'هذا الوصف يعني أن العنصر يمثل نوعًا يمكن إنشاء قيم أو كائنات منه أو استخدامه في تواقيع القوالب والدوال، وليس مجرد عملية لحظية تُستدعى مرة واحدة.';
    }

    return isStd
      ? 'هذا عنصر من المكتبة القياسية لـ C++، ومعناه الحقيقي لا يكتمل من التسمية العامة وحدها بل من الدور الذي يؤديه فعليًا في الكود: هل يبني بيانات، أم يجري عملية، أم يضبط سلوك عنصر آخر.'
      : 'هذا عنصر من C++، ويُقصد بنوعه هنا موقعه العملي داخل اللغة أو المكتبة لا مجرد تصنيف شكلي.';
  }

  function getStandaloneExamples(name, baseItem = {}) {
    const guide = getCppReferenceGuide(baseItem.title || name);
    const directExamples = Array.isArray(baseItem.usageExamples) ? baseItem.usageExamples : [];
    const guideExamples = Array.isArray(guide?.standaloneExamplesArabic) ? guide.standaloneExamplesArabic : [];
    const examples = directExamples.length ? directExamples : guideExamples;
    return examples
      .map((entry) => ({
        titleArabic: String(entry?.titleArabic || '').trim(),
        code: String(entry?.code || '').trim(),
        explanationArabic: String(entry?.explanationArabic || '').trim(),
        relatedTokens: Array.isArray(entry?.relatedTokens) ? entry.relatedTokens.map((token) => String(token || '').trim()).filter(Boolean) : []
      }))
      .filter((entry) => entry.code);
  }

  const CPP_RELATED_ALIAS_MAP = Object.freeze({
    'lock_guard': 'std::lock_guard',
    'std::size_t': 'size_t',
    'std::uint8_t': 'uint8_t',
    'std::max': 'std::min / std::max',
    'std::min': 'std::min / std::max',
    'std::numeric': 'std::numeric_limits',
    'std::ranges': 'std::ranges::views',
    'std::begin': 'std::begin / std::end',
    'std::end': 'std::begin / std::end',
    'std::cbegin': 'std::begin / std::end',
    'std::cend': 'std::begin / std::end',
    'std::acos': 'std::cos',
    'std::asin': 'std::sin',
    'std::condition_variable_any': 'std::condition_variable',
    'std::cref': 'std::reference_wrapper',
    'std::current_exception': 'std::exception',
    'std::defaultfloat': 'std::fixed',
    'std::equal_range': 'std::lower_bound',
    'std::exception_ptr': 'std::exception',
    'std::filesystem::absolute': 'std::filesystem',
    'std::front_inserter': 'std::back_inserter',
    'std::future_status': 'std::future',
    'std::inserter': 'std::back_inserter',
    'std::is_enum_v': 'enum',
    'std::iter_swap': 'std::swap',
    'std::partial_sort': 'std::sort',
    'std::ref': 'std::reference_wrapper',
    'std::remove': 'std::remove_if',
    'std::reverse_copy': 'std::reverse',
    'std::search': 'std::binary_search',
    'std::shared_lock': 'std::shared_mutex',
    'std::smatch': 'std::regex',
    'std::stable_partition': 'std::partition',
    'std::uniform_real_distribution': 'std::uniform_int_distribution',
    'std::variant_index': 'std::variant',
    'std::vector<char>': 'std::vector',
    'std::bind': 'std::bind_front',
    'std::reduce': 'std::accumulate',
    'std::lexicographical_compare': 'std::sort',
    'long long': 'long',
    'pointer': 'nullptr',
    'reference': 'const',
    'constructor': 'struct',
    'lambda': 'auto',
    'operator==': 'operator',
    'range-based for': 'for',
    'if constexpr': 'constexpr',
    'assert': 'static_assert',
    '__FILE__': 'constexpr',
    '__LINE__': 'constexpr',
    'std::erase': 'std::remove_if',
    'std::remove_cv_t': 'const',
    'std::remove_pointer_t': 'nullptr',
    'std::result_of': 'auto',
    'std::terminate': 'std::exception',
    'std::hypot': 'std::cos',
    'std::exp': 'std::cos',
    'std::tan': 'std::cos',
    'std::trunc': 'std::cos',
    'std::from_chars': 'std::stoi',
    'std::memset': 'std::memcpy',
    'std::left': 'std::fixed',
    'std::right': 'std::fixed',
    'std::scientific': 'std::fixed',
    'std::normal_distribution': 'std::uniform_int_distribution',
    'std::seed_seq': 'std::uniform_int_distribution',
    'std::shift_left': 'std::reverse',
    'std::shift_right': 'std::reverse',
    'std::errc': 'std::error_code',
    'std::bit_cast': 'static_cast',
    'std::atan2': 'std::cos',
    'std::reserve': 'std::vector',
    'std::coroutine': 'constexpr',
    'std::algorithm': 'std::sort'
    ,
    'std::ios': 'std::fstream',
    'std::equal_to': 'std::unordered_map'
  });

  function cppTokenExists(name) {
    const token = String(name || '').trim();
    if (!token) return false;
    const data = api.getCppReferenceData();
    const enrichment = api.getCppReferenceEnrichmentData();
    const guides = api.getCppReferenceGuides();
    const keywords = api.getCppKeywordTokens();
    if (data[token] || enrichment[token] || guides[token]) return true;
    if (keywords.has(token)) return true;
    if (token === 'cpp-language-guide') return true;
    const alias = CPP_RELATED_ALIAS_MAP[token];
    if (alias) {
      if (data[alias] || enrichment[alias] || guides[alias]) return true;
      if (keywords.has(alias)) return true;
    }
    return false;
  }

  function resolveCppRelatedTarget(name) {
    const token = String(name || '').trim();
    if (!token) return null;
    const data = api.getCppReferenceData();
    const enrichment = api.getCppReferenceEnrichmentData();
    const guides = api.getCppReferenceGuides();
    const keywords = api.getCppKeywordTokens();
    if (data[token] || enrichment[token] || guides[token] || keywords.has(token) || token === 'cpp-language-guide') {
      return token;
    }
    const alias = CPP_RELATED_ALIAS_MAP[token];
    if (alias && (data[alias] || enrichment[alias] || guides[alias] || keywords.has(alias))) {
      return alias;
    }
    return null;
  }

  function renderRelatedToken(name) {
    const displayName = String(name || '').trim();
    const tooltipSource = getCppReferenceItem(displayName);
    const local = api.renderProjectReferenceLink(name);
    if (local) {
      return local;
    }
    const target = resolveCppRelatedTarget(name);
    if (target) {
      const safeTarget = api.escapeAttribute(target);
      const safeHtml = api.escapeHtml(displayName);
      const targetItem = getCppReferenceItem(target) || tooltipSource;
      const tooltip = targetItem ? buildCppReferenceTooltip(targetItem) : `انتقل إلى ${target}`;
      const safeTooltip = api.escapeAttribute(tooltip);
      const aria = api.escapeAttribute(`${displayName}: ${String(tooltip || '').replace(/\n/g, ' - ')}`);
      return `<a href="#cpp/${encodeURIComponent(target)}" class="related-link related-link-internal" onclick="showCppReference('${safeTarget}'); return false;" data-tooltip="${safeTooltip}" tabindex="0" aria-label="${aria}" title="انتقل إلى ${api.escapeAttribute(target)}">${safeHtml}</a>`;
    }
    const url = api.getExternalReferenceUrl(name);
    if (url) {
      return api.renderExternalReference(name);
    }
    if (tooltipSource) {
      const tooltip = buildCppReferenceTooltip(tooltipSource);
      return `<span class="related-link related-link-static" data-tooltip="${api.escapeAttribute(tooltip)}" tabindex="0" aria-label="${api.escapeAttribute(`${displayName}: ${String(tooltip || '').replace(/\n/g, ' - ')}`)}" title="لا يوجد لهذا العنصر مدخل داخلي قابل للتنقل بعد">${api.escapeHtml(displayName)}</span>`;
    }
    return `<span class="related-link related-link-static" title="لا يوجد لهذا العنصر مدخل داخلي قابل للتنقل بعد">${api.escapeHtml(displayName)}</span>`;
  }

  function getCppReferenceProfile(name) {
    const token = String(name || '').trim();

    switch (token) {
      case 'bool':
        return {
          type: 'نوع أساسي C++',
          description: 'نوع منطقي أساسي يمثل حالتين فقط: true أو false.',
          usage: 'يستخدم عندما تكون القيمة المطلوبة حالة ثنائية واضحة: نعم أو لا، نجح أو فشل، موجود أو غير موجود.',
          example: 'bool is_ready = false;\nif (is_valid()) {\n    is_ready = true;\n}',
          practicalMeaning: 'يمثل قرارًا ثنائيًا داخل البرنامج: الحالة صحيحة أو خاطئة، جاهز أو غير جاهز، نجح الفحص أو لم ينجح.',
          actualBehavior: 'المترجم يتعامل معه كقيمة منطقية تُقرأ غالبًا داخل if أو while أو تُسند من نتيجة مقارنة، لذلك يوجّه مسار التنفيذ بدل أن يحمل حالات متعددة كما تفعل الأنواع العددية.',
          benefit: 'يجعل الشيفرة تصرح بأن المطلوب حالة منطقية لا عدادًا ولا قيمة رقمية، فيسهل فهم النية ويمنع تمرير معانٍ متعددة داخل متغير واحد.',
          misuse: 'إذا استُخدم بدل نوع عددي أو بدل تعداد متعدد الحالات فسيخفي الفروق الحقيقية بين السيناريوهات المختلفة.',
          projectContext: 'يظهر في برامج C++ المستقلة داخل شروط التحقق، وحالات الواجهة، ونتائج الفحص السريعة، والقيم التي لا تحتاج أكثر من حالتين.',
          related: ['true', 'false', 'if']
        };
      case 'true':
        return {
          type: 'قيمة منطقية C++',
          description: 'إحدى القيمتين الحرفيتين للنوع bool وتمثل الحالة الصحيحة.',
          usage: 'تُسند عندما تريد تفعيل حالة منطقية أو الإشارة إلى أن الشرط تحقق.',
          example: 'bool enableValidationLayers = true;',
          practicalMeaning: 'تمثل أن الحالة المنطقية المقصودة مفعلة أو ناجحة أو متحققة.',
          actualBehavior: 'عند إسنادها إلى bool أو إرجاعها من دالة، فهي تجعل الشروط التي تعتمد على هذه القيمة تسلك فرع النجاح أو التفعيل.',
          benefit: 'أوضح من استخدام الرقم 1 لأنه يصرح مباشرة أن المعنى منطقي وليس عدديًا.',
          misuse: 'إذا استُخدمت بدل قيمة تعدادية أو عددية متعددة الحالات فستخفي الفروق بين السيناريوهات المختلفة.',
          projectContext: 'تظهر في برامج C++ المستقلة عند تفعيل خيار محلي أو تثبيت نتيجة فحص منطقي قبل اتخاذ القرار التالي.',
          related: ['bool', 'false', 'if']
        };
      case 'false':
        return {
          type: 'قيمة منطقية C++',
          description: 'إحدى القيمتين الحرفيتين للنوع bool وتمثل الحالة الخاطئة.',
          usage: 'تُسند عندما تريد تعطيل حالة منطقية أو الإشارة إلى أن الشرط لم يتحقق بعد.',
          example: 'bool foundGraphicsQueue = false;',
          practicalMeaning: 'تمثل أن الحالة المنطقية المقصودة غير متحققة أو غير مفعلة أو لم تنجح بعد.',
          actualBehavior: 'عند إسنادها إلى bool أو إرجاعها من دالة، فهي تجعل الشروط التي تعتمد على هذه القيمة تسلك فرع الرفض أو الانتظار أو الإكمال.',
          benefit: 'أوضح من استخدام الرقم 0 لأنه يبين أن المتغير يعبر عن حالة منطقية لا عن قيمة عددية.',
          misuse: 'إذا استُخدمت كمخزن لحالات متعددة فستفقد القدرة على التمييز بين السبب الحقيقي لعدم تحقق الشرط.',
          projectContext: 'تظهر في برامج C++ المستقلة كقيمة ابتدائية للحالات التي لا تصبح صحيحة إلا بعد نجاح فحص أو إكمال خطوة إعداد لاحقة.',
          related: ['bool', 'true', 'if']
        };
      case 'auto':
        return {
          type: 'كلمة مفتاحية C++',
          description: 'تجعل المترجم يستنتج النوع الفعلي من قيمة التهيئة وقت الترجمة.',
          usage: 'تستخدم لتقليل التكرار عندما يكون النوع واضحًا من اليمين أو عندما يكون الاسم النوعي طويلًا.',
          example: 'auto extensions = getRequiredExtensions();',
          practicalMeaning: 'لا تجعل النوع ديناميكيًا وقت التشغيل، بل تطلب من المترجم تثبيت النوع الصحيح بدل كتابته يدويًا.',
          actualBehavior: 'المترجم يحلل التعبير على يمين الإسناد، ثم يقرر النوع النهائي للمتغير قبل بناء البرنامج. بعد ذلك يصبح المتغير من ذلك النوع المحدد تمامًا.',
          benefit: 'تقلل الضجيج مع الأنواع الطويلة مثل حاويات المكتبة القياسية أو النتائج المعادة من دوال التغليف الحديثة، وتمنع تكرار الاسم النوعي مرتين.',
          misuse: 'إذا استُخدمت بلا انتباه فقد تخفي نسخًا غير مقصودة أو نوعًا مختلفًا عما تتوقع، خصوصًا مع المراجع وconst.',
          projectContext: 'تظهر في برامج C++ الحديثة عند التقاط نواتج الدوال ومؤشرات المرور على العناصر والكائنات المساعدة عندما يكون النوع طويلًا أو واضحًا من السياق.',
          related: ['const', 'std::vector', 'size_t']
        };
      case 'const':
        return {
          type: 'محدد ثبات C++',
          description: 'يقيد التعديل عبر هذا الاسم أو المرجع أو المؤشر، ولا يعني بالضرورة أن الكائن نفسه صار غير قابل للتغيير من كل المسارات.',
          usage: 'شائع جدًا في تواقيع الدوال، والمعاملات، والمؤشرات إلى بيانات يجب قراءتها فقط.',
          example: 'const std::string& name = value;',
          practicalMeaning: 'يعلن أن هذا المسار مخصص للقراءة فقط، وأن الشيفرة التي تمر عبره يجب ألا تعدل القيمة المستهدفة.',
          actualBehavior: 'المترجم يرفض عمليات الكتابة عبر المتغير أو المؤشر أو المرجع الموسوم بـ const، وبذلك يثبت نية القراءة فقط داخل هذا الجزء من الشيفرة.',
          benefit: 'يوضح نية القراءة فقط، ويسمح للمترجم بكشف أخطاء التعديل غير المقصود مبكرًا، ويجعل تواقيع الدوال أوضح.',
          misuse: 'الخلط بين const على المؤشر وconst على البيانات التي يشير إليها قد يعطي سلوكًا مختلفًا عما تتوقع، لذلك يجب قراءة الموضع بدقة.',
          projectContext: 'يظهر بكثرة في برامج C++ لأن الدوال كثيرًا ما تستقبل مراجع أو مؤشرات أو قيمًا لا يجب أن تعدلها أثناء التنفيذ.',
          related: ['auto', 'void', 'nullptr']
        };
      case 'nullptr':
        return {
          type: 'ثابت لغوي C++',
          description: 'القيمة القياسية للمؤشر الفارغ في C++ الحديث.',
          usage: 'تستخدم عندما تريد تمرير أو تخزين مؤشر لا يشير حاليًا إلى أي كائن.',
          example: 'std::string* text = nullptr;',
          practicalMeaning: 'تعبر صراحة أن القيمة ليست رقمًا، بل مؤشرًا فارغًا لا يشير إلى عنوان صالح.',
          actualBehavior: 'المترجم يعاملها كقيمة null pointer literal من نوع خاص يمكن تحويله إلى أنواع المؤشرات المختلفة دون خلطه بالأعداد العادية.',
          benefit: 'أوضح وأكثر أمانًا من 0 أو NULL لأنه يمنع الالتباس بين القيم العددية والمؤشرات.',
          misuse: 'إذا خلطت بين nullptr والقيم العددية الخاصة أو بين المؤشرات والمقابض/المعرّفات غير المؤشرية فستربك معنى الفراغ في الموضع الحالي.',
          projectContext: 'تظهر في برامج C++ المستقلة مع المؤشرات الاختيارية وروابط الكائنات التي قد لا تكون متصلة بعد أو المعاملات التي يجوز أن تكون غائبة.',
          related: ['void', 'const', 'std::unique_ptr']
        };
      default:
        break;
    }

    if (cppFundamentalTypeTokens.has(token)) {
      return {
        type: 'نوع أساسي C++',
        description: `نوع أساسي من C++ يستخدم لتمثيل القيم ${token === 'float' || token === 'double' ? 'العائمة' : 'الأولية'} في أبسط صورها.`,
        usage: 'يظهر هذا النوع عندما يحتاج المثال قيمة واضحة ومنخفضة المستوى لا تستدعي تغليفًا إضافيًا.',
        example: `${token} value = {};`,
        practicalMeaning: `يمثل ${token} قيمة أولية مباشرة يفهمها المترجم دون طبقة تغليف من المكتبة القياسية أو من أي مكتبة خارجية.`,
        actualBehavior: 'يخزن قيمة أولية بسيطة ويخضع لقواعد التحويل والحساب والمقارنة المباشرة في اللغة.',
        benefit: 'مناسب عندما تريد أقصر تمثيل مباشر للقيمة دون كلفة بنيوية إضافية.',
        misuse: 'إذا استُخدم نوع أولي بينما المعنى الحقيقي للقيمة يحتاج نوعًا أقوى دلالة أو عرضًا ثابتًا فقد يصبح الكود أقل وضوحًا.',
        projectContext: 'يظهر في برامج C++ المستقلة داخل المتغيرات المحلية والحسابات المؤقتة والحقول البسيطة التي لا تحتاج نوعًا أعلى تجريدًا.',
        related: ['bool', 'uint32_t', 'size_t']
      };
    }

    if (cppBooleanLiteralTokens.has(token)) {
      return {
        type: 'قيمة منطقية C++',
        description: 'قيمة حرفية للنوع bool.',
        usage: 'تستخدم لإسناد حالة منطقية صريحة دون المرور عبر مقارنة أو دالة.',
        example: token,
        practicalMeaning: `تمثل أن الحالة المنطقية هي ${token === 'true' ? 'متحققة' : 'غير متحققة'} صراحة.`,
        actualBehavior: 'تتحول مباشرة إلى قيمة bool وتستخدم في الشروط أو الإسناد أو الإرجاع.',
        benefit: 'أوضح من استخدام 1 أو 0 لأن المقصود المنطقي يقرأ مباشرة من السطر.',
        misuse: 'الإفراط في إسنادها يدويًا قد يخفي أن القيمة الحقيقية ينبغي أن تأتي من فحص أو مقارنة.',
        projectContext: 'تظهر في برامج C++ المستقلة كقيم أولية للحالات المحلية أو لتفعيل خيار قبل بدء التنفيذ الفعلي.',
        related: ['bool', 'if']
      };
    }

    if (cppFixedWidthTypeTokens.has(token)) {
      return {
        type: 'نوع عددي قياسي',
        description: 'نوع عددي شائع في C/C++ الحديثة ويظهر كثيرًا مع أحجام الذاكرة والفهارس والبيانات منخفضة المستوى.',
        usage: 'يستخدم عندما يحتاج المثال نوعًا عدديًا واضح العرض أو واضح الغرض.',
        example: `${token} value = 0;`,
        practicalMeaning: 'يمثل قيمة عددية منخفضة المستوى يريد المبرمج أن تكون دلالتها ونطاقها أوضح من الأنواع العامة.',
        actualBehavior: 'يخزن عددًا صحيحًا ويخضع لقواعد التحويل والمقارنة والحساب المناسبة لذلك النوع.',
        benefit: 'يجعل الكود أوضح عند التعامل مع الأعداد والأحجام والفهارس في المسارات المتصلة بالذاكرة والدوال منخفضة المستوى.',
        misuse: 'اختيار النوع الخطأ قد يفرض تحويلات غير ضرورية أو قد يخفي مشكلة في النطاق أو الإشارة.',
        projectContext: 'يظهر في برامج C++ المستقلة لأن كثيرًا من القيم تمثل أحجامًا وفهارس وعدد عناصر أو حدودًا عددية صريحة.',
        related: ['uint32_t', 'uint64_t', 'int32_t', 'size_t']
      };
    }

      if (token.startsWith('std::')) {
        return {
          type: 'عنصر من المكتبة القياسية C++',
          description: 'عنصر من المكتبة القياسية لـ C++ يستخدم لبناء الكود الحديث حول البيانات أو الأخطاء أو الحاويات.',
          usage: 'يظهر عندما تحتاج أمثلة المشروع أدوات C++ الجاهزة بدل بناء بنية مساعدة من الصفر.',
          example: `${token} value;`,
          practicalMeaning: 'هذا اسم من المكتبة القياسية يمثل أداة جاهزة لها عقد سلوكي محدد: قد يكون نوعًا ينظم البيانات، أو دالة تنفذ عملية معروفة، أو كائنًا يضبط سلوك عنصر آخر.',
          actualBehavior: 'سلوكه الفعلي لا يحدده الاسم وحده بل الفئة التي ينتمي إليها: هل ينشئ كائنًا، أم ينقل قيمة، أم يخزن بيانات، أم ينسق الوصول، أم يغير شكل الإخراج.',
          benefit: 'يوفر سلوكًا معياريًا معروفًا ومختبرًا بدل إعادة كتابة نفس الفكرة يدويًا في كل مشروع.',
          misuse: 'استخدام الأداة القياسية الخاطئة أو فهم سلوك النسخ والعمر الزمني بشكل غير دقيق قد يسبب تكلفة أو أخطاء منطقية.',
          projectContext: 'يظهر في برامج C++ الحديثة عندما تحتاج لبنة معيارية واضحة بدل بناء بديل محلي أقل وضوحًا أو أقل أمانًا.',
          related: ['auto', 'size_t']
        };
      }

    return {
      type: 'مرجع C++',
      description: 'عنصر من عناصر لغة C++ يظهر في أمثلة المشروع ويحتاج فهمه عند قراءة الشيفرة.',
      usage: 'يظهر هنا لأنه يغير معنى الشيفرة أو نوع البيانات أو مسار التنفيذ في المثال الذي ضغطت منه.',
      example: token,
      practicalMeaning: 'هذا عنصر لغوي أو مكتبي من C++ يحمل معنى مباشرًا داخل السطر الذي ظهر فيه، وليس مجرد كلمة شكلية.',
      actualBehavior: 'أثره الفعلي يعتمد على موضعه: قد يحدد نوع البيانات، أو يختار مسار التنفيذ، أو يغير طريقة تعامل المترجم مع الكود.',
      benefit: 'فهمه يمنع خلط قواعد اللغة نفسها مع منطق المكتبات التي قد تستخدمه لاحقًا.',
      misuse: 'تجاهل معناه الحقيقي قد يجعلك تفسر السطر خطأ أو تنسب الأثر إلى مكتبة خارجية بينما السبب الحقيقي لغوي داخل C++.',
      projectContext: 'يظهر عادة داخل برامج C++ المستقلة ليحدد نوع البيانات أو أسلوب التهيئة أو مسار التنفيذ أو معنى الملكية.',
      related: []
    };
  }

  function buildCppReferenceItem(name, baseItem = {}) {
    const token = String(name || '').trim();
    const profile = getCppReferenceProfile(token);
    const title = baseItem.title || token;
    const guide = getCppReferenceGuide(title) || getCppReferenceGuide(token);
    const usageExamples = getStandaloneExamples(token, {...baseItem, title});
    return {
      title,
      type: baseItem.type || profile.type || 'مرجع C++',
      typeMeaning: String(baseItem.typeMeaning || profile.typeMeaning || getCppReferenceTypeMeaning(baseItem.type || profile.type || 'مرجع C++', {title, ...baseItem})).trim(),
      description: baseItem.description || profile.description || 'عنصر من عناصر لغة C++ يظهر في أمثلة المشروع.',
      usage: baseItem.usage || profile.usage || 'يظهر لفهم كيفية قراءة الكود المحلي في المشروع.',
      example: baseItem.example || profile.example || title,
      practicalMeaning: baseItem.practicalMeaning || baseItem.description || profile.practicalMeaning || profile.description || '',
      actualBehavior: baseItem.actualBehavior || baseItem.usage || profile.actualBehavior || '',
      benefit: baseItem.benefit || baseItem.usage || profile.benefit || profile.usage || '',
      misuse: baseItem.misuse || profile.misuse || '',
      projectContext: baseItem.projectContext || baseItem.usage || profile.projectContext || profile.usage || '',
      standaloneSummary: String(baseItem.standaloneSummary || guide?.fullProjectNoteArabic || '').trim(),
      standaloneSteps: Array.isArray(baseItem.standaloneSteps)
        ? baseItem.standaloneSteps
        : (Array.isArray(guide?.projectStepsArabic) ? guide.projectStepsArabic : []),
      usageExamples,
      memberOperations: Array.isArray(baseItem.memberOperations) ? baseItem.memberOperations : [],
      related: [...new Set([...(profile.related || []), ...(baseItem.related || [])].filter((entry) => entry && entry !== title))],
      includeHeader: String(baseItem.includeHeader || getCppReferenceHeaderInfo(title).label || getCppReferenceHeaderInfo(token).label || '').trim(),
      includeHeaderNote: String(baseItem.includeHeaderNote || getCppReferenceHeaderInfo(title).note || getCppReferenceHeaderInfo(token).note || '').trim(),
      namespaceQualifier: String(baseItem.namespaceQualifier || getCppReferenceNamespaceInfo(title).label || getCppReferenceNamespaceInfo(token).label || '').trim(),
      namespaceQualifierNote: String(baseItem.namespaceQualifierNote || getCppReferenceNamespaceInfo(title).note || getCppReferenceNamespaceInfo(token).note || '').trim(),
      officialUrl: baseItem.officialUrl || '',
      referenceUrl: ''
    };
  }

  function buildCppReferenceTooltip(item) {
    if (!item) {
      return '';
    }

    const override = api.getCppReferenceTooltipOverrides()?.[item.title] || {};
    const practicalMeaning = override.practicalMeaning || item.practicalMeaning || item.description || '';
    const whyExists = override.whyExists || item.usage || '';
    const whyUse = override.whyUse || item.benefit || '';
    const actualBehavior = override.actualBehavior || item.actualBehavior || '';
    const usageContext = override.usageContext || item.projectContext || '';
    const warning = override.misuse || item.misuse || '';
    const composer = global.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip;
    if (composer) {
      return composer({
        title: item.title,
        kindLabel: 'مرجع C++',
        typeLabel: item.type || 'عنصر لغوي',
        library: 'C++',
        meaning: practicalMeaning,
        whyExists,
        whyUse,
        actualUsage: usageContext || actualBehavior,
        warning
      });
    }
    return [
      item.title,
      item.type ? `النوع: ${item.type}` : '',
      practicalMeaning ? `المعنى الحقيقي: ${practicalMeaning}` : '',
      whyExists ? `لماذا وُجد: ${whyExists}` : '',
      whyUse ? `لماذا يستخدمه المبرمج: ${whyUse}` : '',
      actualBehavior ? `ما يفعله فعليًا: ${actualBehavior}` : '',
      usageContext ? `كيف يظهر في الاستخدام الفعلي: ${usageContext}` : '',
      warning ? `تنبيه: ${warning}` : ''
    ].filter(Boolean).join('\n');
  }

  function isLowValueCppReferenceText(text = '') {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) {
      return true;
    }

    return [
      /مرجع خارجي مباشر لهذا العنصر/,
      /مرجع رسمي مرتبط بهذا العنصر/,
      /الوصف الرسمي/,
      /تمثل هذه الدالة عملية تشغيل/,
      /تستخدم هذه الدالة عندما تحتاج إلى تشغيل/,
      /القيمة الحقيقية هنا هي الأثر التنفيذي/
    ].some((pattern) => pattern.test(clean));
  }

  function buildCppReferenceSummaryFallback(item) {
    return `هذا المرجع يفيد عندما تريد العقد الرسمي لـ ${item.title || 'العنصر الحالي'}: ما الذي يملكه فعليًا، وما القيود التي يفرضها، وكيف يظهر أثره في الكود بدل الاكتفاء بالوصف المختصر داخل المشروع.`;
  }

  function buildCppReferenceNoteFallback(item, entry = {}) {
    const label = String(entry.label || '').trim();
    if (/cppreference|reference/i.test(String(entry.href || '')) || /مرجع/i.test(label)) {
      return `ارجع إلى هذا الرابط عندما تحتاج الصياغة المعيارية أو تفاصيل السلوك الدقيق لـ ${item.title || 'العنصر الحالي'}.`;
    }
    return `هذا الرابط يشرح ${item.title || 'العنصر الحالي'} من مصدر خارجي معتمد عندما تحتاج العقد الكامل خارج الاختصار المحلي للمشروع.`;
  }

  function getCppReferenceItem(name) {
    const token = String(name || '').trim();
    if (!token) {
      return null;
    }

    const cppReferenceData = api.getCppReferenceData();
    const cppReferenceEnrichment = api.getCppReferenceEnrichmentData();
    const mergedItem = {
      ...(cppReferenceEnrichment[token] || {}),
      ...(cppReferenceData[token] || {})
    };
    if (Object.keys(mergedItem).length) {
      const item = buildCppReferenceItem(token, mergedItem);
      item.referenceUrl = item.officialUrl || api.getExternalReferenceUrl(token) || '';
      return item;
    }

    if (api.getCppKeywordTokens().has(token) || cppReferenceEnrichment[token]) {
      const item = buildCppReferenceItem(token, {
        title: token,
        ...(cppReferenceEnrichment[token] || {})
      });
      item.referenceUrl = item.officialUrl || api.getExternalReferenceUrl(token) || '';
      return item;
    }

    if (token.indexOf('::') !== -1) {
      let parentToken = token.substring(0, token.lastIndexOf('::'));
      const aliasTarget = cppTypeAliases[parentToken];
      if (aliasTarget) {
        parentToken = aliasTarget;
      }
      const parentMerged = {
        ...(cppReferenceEnrichment[parentToken] || {}),
        ...(cppReferenceData[parentToken] || {})
      };
      if (Object.keys(parentMerged).length) {
        const memberName = token.substring(token.lastIndexOf('::') + 2);
        const item = buildCppReferenceItem(token, {
          ...parentMerged,
          title: token,
          type: parentMerged.type || 'عضو صنف',
          description: (parentMerged.description || '') + ' — ' + memberName,
          usage: parentMerged.usage || ('عضو من أعضاء ' + parentToken)
        });
        item.referenceUrl = item.officialUrl || api.getExternalReferenceUrl(token) || api.getExternalReferenceUrl(parentToken) || '';
        return item;
      }
    }

    return null;
  }

  function renderCppReferenceRelatedLinks(item) {
    const links = [...new Set(item.related || [])]
      .map((name) => renderRelatedToken(name))
      .filter(Boolean);

    if (!links.length) {
      return '';
    }

    return `
      <section class="see-also-section">
        <h2>عناصر مرتبطة</h2>
        <div class="see-also-links cpp-related-group-card">
          ${links.join('')}
        </div>
      </section>
    `;
  }

  function renderCppReferenceTokenList(names = []) {
    return [...new Set(Array.isArray(names) ? names : [])]
      .map((name) => renderRelatedToken(name))
      .filter(Boolean)
      .join('');
  }

  function renderCppReferenceOfficialSection(item) {
    const officialLinks = api.getCppReferenceOfficialLinks()?.[item.title] || null;
    const languageRootReference = {
      label: 'الصفحة الأساسية للغة C++',
      href: 'https://en.cppreference.com/w/cpp/language',
      noteArabic: 'هذه صفحة اللغة نفسها: القواعد الأساسية، الكلمات المفتاحية، التعابير، والتقييم وقت الترجمة.'
    };
    const references = Array.isArray(officialLinks?.references) && officialLinks.references.length
      ? officialLinks.references
      : (item.referenceUrl || api.getExternalReferenceUrl(item.title)
        ? [{
          label: 'فتح مرجع C++ الخارجي',
          href: item.referenceUrl || api.getExternalReferenceUrl(item.title),
          noteArabic: 'مرجع خارجي مباشر لهذا العنصر.'
        }]
        : []);
    if (!references.length) {
      references.push(languageRootReference);
    } else if (!references.some((entry) => String(entry.href || '').trim() === languageRootReference.href)) {
      references.push(languageRootReference);
    }

    const tooltip = buildCppReferenceTooltip(item);
    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>المرجع</h2>
          ${(officialLinks?.summaryArabic || references.length) ? `<p>${api.escapeHtml(isLowValueCppReferenceText(officialLinks?.summaryArabic || '') ? buildCppReferenceSummaryFallback(item) : officialLinks.summaryArabic)}</p>` : ''}
          ${officialLinks?.sourceName ? `<p><strong>${api.escapeHtml(officialLinks.sourceLabelArabic || 'المصدر')}:</strong> ${api.escapeHtml(officialLinks.sourceName)}</p>` : ''}
          <div class="see-also-links">
            ${references.map((entry) => `<a href="${api.escapeAttribute(entry.href || '')}" class="related-link" target="_blank" rel="noopener noreferrer" data-tooltip="${api.escapeAttribute(tooltip)}" tabindex="0" aria-label="${api.escapeAttribute(`${item.title}: ${tooltip.replace(/\n/g, ' - ')}`)}">${api.escapeHtml(entry.label || entry.href || '')}</a>`).join('')}
          </div>
          ${references.some((entry) => entry.noteArabic) ? `
            <ul class="best-practices-list">
              ${references.filter((entry) => entry.noteArabic).map((entry) => `<li><p>${api.escapeHtml(isLowValueCppReferenceText(entry.noteArabic || '') ? buildCppReferenceNoteFallback(item, entry) : entry.noteArabic)}</p></li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </section>
    `;
  }

  function renderCppReferenceProjectGuidance(item) {
    const guide = api.getCppReferenceGuides()?.[item.title] || null;
    if (!guide) {
      return '';
    }

    const followUpLinks = [...new Set(guide.followUps || [])]
      .map((name) => renderRelatedToken(name))
      .join('');

    return `
      <section class="info-section">
        <div class="content-card prose-card">
          <h2>كيف يُستخدم في برنامج C++ كامل</h2>
          ${guide.fullProjectNoteArabic ? `<p>${api.escapeHtml(guide.fullProjectNoteArabic)}</p>` : ''}
          ${Array.isArray(guide.projectStepsArabic) && guide.projectStepsArabic.length ? `
            <ul class="best-practices-list">
              ${guide.projectStepsArabic.map((entry) => `<li><p>${api.escapeHtml(entry)}</p></li>`).join('')}
            </ul>
          ` : ''}
          ${followUpLinks ? `
            <p><strong>عناصر متابعة مفيدة:</strong></p>
            <div class="see-also-links">${followUpLinks}</div>
          ` : ''}
        </div>
      </section>
    `;
  }

  function getCppReferenceIconType(token, ref) {
    const normalized = String(token || '').trim();
    if (cppFundamentalTypeTokens.has(normalized) || cppBooleanLiteralTokens.has(normalized) || cppFixedWidthTypeTokens.has(normalized) || normalized === 'nullptr') {
      return 'variable';
    }
    if (normalized.startsWith('std::') || normalized === 'struct' || normalized === 'class') {
      return 'structure';
    }
    return '';
  }

  global.__ARABIC_VULKAN_CPP_REFERENCE_UTILS__ = {
    configure,
    buildCppReferenceItem,
    buildCppReferenceTooltip,
    getCppReferenceTypeMeaning,
    getCppReferenceItem,
    renderCppReferenceTokenList,
    renderCppReferenceRelatedLinks,
    renderCppReferenceOfficialSection,
    renderCppReferenceProjectGuidance,
    getCppReferenceIconType,
    getCppReferenceHeaderInfo
  };
})(window);
