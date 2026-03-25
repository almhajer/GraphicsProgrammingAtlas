(function (global) {
  const api = {
    fetchJsonData: async () => null,
    ensureUiSegment: async () => {},
    setCurrentView: () => {},
    syncRouteHistory: () => {},
    scheduleProseCardReferenceLinking: () => {},
    highlightCode: () => {},
    prepareTutorialCodeContainers: () => {},
    activateTutorialLazyCodeBlocks: () => {},
    enhanceTutorialExamples: () => {},
    refreshTutorialCodePresentation: () => {},
    escapeHtml: (value) => String(value || ''),
    escapeAttribute: (value) => String(value || ''),
    renderEntityIcon: () => '',
    renderTutorialInfoGrid: () => '',
    renderDocCodeContainer: () => '',
    renderCanonicalReferenceRichText: (value) => String(value || ''),
    buildCanonicalReferenceExample: () => null,
    getCanonicalReferenceKindMeta: () => ({}),
    getCanonicalReferenceDetailAnchorId: () => '',
    resolveCanonicalReferenceRoute: () => null
  };

  let canonicalReferenceManifestPromise = null;
  const canonicalReferenceLibraryIndexPromises = new Map();
  const canonicalReferenceKindIndexPromises = new Map();
  const canonicalReferenceEntityPromises = new Map();
  const canonicalReferenceOfficialLinkPromises = new Map();
  let vulkanSemanticOverridesPromise = null;

  function configure(nextApi = {}) {
    Object.assign(api, nextApi);
  }

  function getReferenceTemplateEngine() {
    return global.__ARABIC_VULKAN_REFERENCE_TEMPLATES__ || {};
  }

  function renderReferenceFallbackPage(title = 'تعذر فتح المرجع', body = 'لم نتمكن من تحميل بيانات هذا المرجع حالياً.') {
    return `
      <div class="page-header">
        <h1>${api.escapeHtml(title)}</h1>
        <p>${api.escapeHtml(body)}</p>
      </div>
    `;
  }

  function setReferencePageContent(html = '') {
    const content = document.getElementById('mainContent');
    if (!content) {
      return false;
    }

    const normalizedHtml = String(html || '').trim();
    content.innerHTML = /reference-unified-detail-page/.test(normalizedHtml)
      ? normalizedHtml
      : `<div class="reference-unified-detail-page tutorial-content canonical-reference-page">${normalizedHtml}</div>`;
    api.scheduleProseCardReferenceLinking(content);
    api.prepareTutorialCodeContainers(content);
    api.highlightCode(content, {immediate: true});
    api.activateTutorialLazyCodeBlocks(content);
    api.enhanceTutorialExamples(content);
    api.refreshTutorialCodePresentation(content);
    global.requestAnimationFrame?.(() => api.refreshTutorialCodePresentation(content));
    global.scrollTo(0, 0);
    return true;
  }

  function captureReferenceRecentVisit(route = '') {
    if (typeof global.scheduleRecentVisitCapture === 'function') {
      global.scheduleRecentVisitCapture(route);
    }
  }

  function buildCanonicalReferenceLibraryIndexSource(libraryId = '') {
    return `content/reference/${String(libraryId || '').trim()}/index.json`;
  }

  function buildCanonicalReferenceKindIndexSource(libraryId = '', kindId = '') {
    return `content/reference/${String(libraryId || '').trim()}/${String(kindId || '').trim()}/index.json`;
  }

  function buildCanonicalReferenceEntitySource(libraryId = '', kindId = '', slug = '') {
    return `content/reference/${String(libraryId || '').trim()}/${String(kindId || '').trim()}/${String(slug || '').trim()}.json`;
  }

  function loadCanonicalReferenceManifest() {
    if (!canonicalReferenceManifestPromise) {
      canonicalReferenceManifestPromise = api.fetchJsonData('content/reference/manifest.json');
    }
    return canonicalReferenceManifestPromise;
  }

  function loadCanonicalReferenceLibraryIndex(libraryId = '') {
    const normalizedLibraryId = String(libraryId || '').trim();
    if (!normalizedLibraryId) {
      return Promise.resolve(null);
    }

    if (!canonicalReferenceLibraryIndexPromises.has(normalizedLibraryId)) {
      canonicalReferenceLibraryIndexPromises.set(
        normalizedLibraryId,
        api.fetchJsonData(buildCanonicalReferenceLibraryIndexSource(normalizedLibraryId))
      );
    }

    return canonicalReferenceLibraryIndexPromises.get(normalizedLibraryId);
  }

  function loadCanonicalReferenceKindIndex(libraryId = '', kindId = '') {
    const normalizedLibraryId = String(libraryId || '').trim();
    const normalizedKindId = String(kindId || '').trim();
    const cacheKey = `${normalizedLibraryId}::${normalizedKindId}`;
    if (!normalizedLibraryId || !normalizedKindId) {
      return Promise.resolve(null);
    }

    if (!canonicalReferenceKindIndexPromises.has(cacheKey)) {
      canonicalReferenceKindIndexPromises.set(
        cacheKey,
        api.fetchJsonData(buildCanonicalReferenceKindIndexSource(normalizedLibraryId, normalizedKindId))
      );
    }

    return canonicalReferenceKindIndexPromises.get(cacheKey);
  }

  function loadCanonicalReferenceEntity(libraryId = '', kindId = '', slug = '') {
    const normalizedLibraryId = String(libraryId || '').trim();
    const normalizedKindId = String(kindId || '').trim();
    const normalizedSlug = String(slug || '').trim();
    const cacheKey = `${normalizedLibraryId}::${normalizedKindId}::${normalizedSlug}`;
    if (!normalizedLibraryId || !normalizedKindId || !normalizedSlug) {
      return Promise.resolve(null);
    }

    if (!canonicalReferenceEntityPromises.has(cacheKey)) {
      canonicalReferenceEntityPromises.set(
        cacheKey,
        api.fetchJsonData(buildCanonicalReferenceEntitySource(normalizedLibraryId, normalizedKindId, normalizedSlug))
          .catch((error) => {
            return null;
          })
      );
    }

    return canonicalReferenceEntityPromises.get(cacheKey);
  }

  function buildCanonicalReferenceOfficialLinksSource(libraryId = '') {
    return `content/reference/${String(libraryId || '').trim()}/official-links.json`;
  }

  function loadCanonicalReferenceOfficialLinks(libraryId = '') {
    const normalizedLibraryId = String(libraryId || '').trim();
    if (!normalizedLibraryId) {
      return Promise.resolve(null);
    }

    if (!canonicalReferenceOfficialLinkPromises.has(normalizedLibraryId)) {
      canonicalReferenceOfficialLinkPromises.set(
        normalizedLibraryId,
        api.fetchJsonData(buildCanonicalReferenceOfficialLinksSource(normalizedLibraryId))
          .catch((error) => {
            console.warn(`No official link enrichment found for ${normalizedLibraryId}:`, error);
            return null;
          })
      );
    }

    return canonicalReferenceOfficialLinkPromises.get(normalizedLibraryId);
  }

  function loadVulkanSemanticOverrides(libraryId = '') {
    const normalizedLibraryId = String(libraryId || '').trim();
    if (normalizedLibraryId !== 'vulkan') {
      return Promise.resolve(null);
    }

    if (!vulkanSemanticOverridesPromise) {
      vulkanSemanticOverridesPromise = api.fetchJsonData('data/ui/vulkan-reference-semantic-overrides.json')
        .catch((error) => {
          console.warn('No Vulkan semantic override bundle found:', error);
          return null;
        });
    }

    return vulkanSemanticOverridesPromise;
  }

  function mergeReferenceEntityEnrichment(entity = null, enrichment = null) {
    if (!entity || !enrichment?.entities) {
      return entity;
    }

    const kindId = String(entity.kind?.id || '').trim();
    const slug = String(entity.identity?.slug || '').trim();
    if (!kindId || !slug) {
      return entity;
    }

    const entry = enrichment.entities[`${kindId}/${slug}`];
    if (!entry) {
      return entity;
    }

    return {
      ...entity,
      links: {
        ...(entity.links || {}),
        officialReferences: Array.isArray(entry.officialReferences)
          ? entry.officialReferences
          : Array.isArray(entity.links?.officialReferences)
            ? entity.links.officialReferences
            : [],
        officialSummaryArabic: entry.summaryArabic || entity.links?.officialSummaryArabic || '',
        officialSourceName: entry.sourceName || enrichment.sourceName || entity.links?.officialSourceName || '',
        officialSourceLabelArabic: entry.sourceLabelArabic || enrichment.sourceLabelArabic || entity.links?.officialSourceLabelArabic || ''
      }
    };
  }

  function mergeNamedDetailOverrides(rows = [], overrides = null) {
    if (!Array.isArray(rows) || !rows.length || !overrides || typeof overrides !== 'object') {
      return rows;
    }

    return rows.map((row) => {
      const rowName = String(row?.name || '').trim();
      const override = rowName ? overrides[rowName] : null;
      if (!override || typeof override !== 'object') {
        return row;
      }
      return {
        ...row,
        ...override,
        descriptionArabic: override.descriptionArabic || row.descriptionArabic || row.description || ''
      };
    });
  }

  function mergeReferenceEntitySemanticOverrides(entity = null, overrides = null) {
    if (!entity || !overrides?.entities) {
      return entity;
    }

    const kindId = String(entity.kind?.id || '').trim();
    const slug = String(entity.identity?.slug || '').trim();
    const entry = overrides.entities[`${kindId}/${slug}`];
    if (!entry) {
      return entity;
    }

    const mergedSummary = {
      ...(entity.summary || {}),
      ...(entry.summary || {})
    };
    const mergedDetails = {
      ...(entity.details || {}),
      ...(entry.details || {})
    };

    mergedDetails.parameters = mergeNamedDetailOverrides(entity.details?.parameters || [], entry.details?.parameters);
    mergedDetails.fields = mergeNamedDetailOverrides(entity.details?.fields || [], entry.details?.fields);
    mergedDetails.values = mergeNamedDetailOverrides(entity.details?.values || [], entry.details?.values);
    mergedDetails.usage = Array.isArray(entry.details?.usage) ? entry.details.usage : (entity.details?.usage || []);
    mergedDetails.notes = Array.isArray(entry.details?.notes) ? entry.details.notes : (entity.details?.notes || []);
    mergedDetails.remarks = Array.isArray(entry.details?.remarks) ? entry.details.remarks : (entity.details?.remarks || []);
    mergedDetails.instructions = Array.isArray(entry.details?.instructions) ? entry.details.instructions : (entity.details?.instructions || []);
    mergedDetails.example = entry.details?.example || entity.details?.example || '';
    mergedDetails.returns = entry.details?.returns || entity.details?.returns || '';

    return {
      ...entity,
      summary: mergedSummary,
      details: mergedDetails
    };
  }

  function normalizeReferenceSummarySentence(text = '') {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/^الوصف الرسمي:\s*/g, '')
      .trim();
  }

  function withSynthesizedReferenceExample(entity = null) {
    if (!entity || String(entity?.details?.example || '').trim()) {
      return entity;
    }

    const builtExample = typeof api.buildCanonicalReferenceExample === 'function'
      ? api.buildCanonicalReferenceExample(entity)
      : null;
    const exampleCode = String(
      typeof builtExample === 'string'
        ? builtExample
        : builtExample?.code || ''
    ).trim();

    if (!exampleCode) {
      return entity;
    }

    return {
      ...entity,
      details: {
        ...(entity.details || {}),
        example: exampleCode
      }
    };
  }

  function countReferenceLatinTokens(text = '') {
    return (String(text || '').match(/[A-Za-z_][A-Za-z0-9_]*/g) || []).length;
  }

  function looksLikeShallowReferenceMeaning(text = '', entity = null) {
    const clean = normalizeReferenceSummarySentence(text);
    if (!clean) {
      return true;
    }

    const kindId = String(entity?.kind?.id || '').trim();
    if (kindId !== 'functions' && kindId !== 'types' && kindId !== 'structures' && kindId !== 'variables') {
      return false;
    }

    if (/^المعنى الأساسي لهذه الدالة:/i.test(clean)) {
      return true;
    }

    if (/^يعيد هذا الاستدعاء whether\b/i.test(clean)) {
      return true;
    }

    if (/^(?:إنشاء|تدمير|ضبط|جلب|حفظ|تحميل|تحويل|فتح|إغلاق|إخفاء|إظهار|إضافة|إزالة|ربط|فك|قراءة|كتابة|تصفير|تحديث)\s+[A-Za-z0-9_]/.test(clean)) {
      return true;
    }

    if (countReferenceLatinTokens(clean) >= 2
      && clean.length < 120
      && !/(?:لأن|حتى|بحيث|يعني|يفحص|يقرأ|يكتب|يربط|يحدد|يقيس|ينشئ|يفتح|يحرر|يعيد|يتحقق|يستعلم|المورد|الحالة|الواجهة|المسار|الذاكرة|التنفيذ)/.test(clean)) {
      return true;
    }

    return false;
  }

  function isLowValueReferenceSummaryText(text = '', field = 'meaning', entity = null) {
    const clean = normalizeReferenceSummarySentence(text);
    if (!clean) {
      return true;
    }

    if (!/[\u0600-\u06FF]/.test(clean)) {
      return true;
    }

    const genericPatterns = [
      /تمثل هذه الدالة عملية تشغيل/,
      /تستخدم هذه الدالة عندما تحتاج إلى تشغيل/,
      /المعنى الأساسي لهذه الدالة:/,
      /تُستخدم هذه الدالة من أجل:/,
      /داخل التطبيق أو داخل مسار التنفيذ المرتبط بها/,
      /القيمة الحقيقية هنا هي الأثر التنفيذي/,
      /دالة استعلام تُستخدم لاسترجاع خصائص أو مؤشرات أو بيانات/,
      /قبل الاستدعاء جهّز المعاملات الأساسية/,
      /الوصف الرسمي/
    ];

    if (genericPatterns.some((pattern) => pattern.test(clean))) {
      return true;
    }

    if (field === 'whyUse' && /(?:device|p[A-Z]|Count):/.test(clean)) {
      return true;
    }

    if (field === 'meaning' && looksLikeShallowReferenceMeaning(clean, entity)) {
      return true;
    }

    return false;
  }

  function getReferenceFunctionAction(name = '') {
    const raw = String(name || '').trim();
    if (/^IMG_is[A-Z]/.test(raw)) return 'detect';
    if (/Create|Open|Load|Begin/i.test(raw)) return 'create';
    if (/Destroy|Close|Free|Quit|End/i.test(raw)) return 'release';
    if (/Enumerate/i.test(raw)) return 'enumerate';
    if (/Get|Query|Metrics|Measure|Is[A-Z]|Supports/i.test(raw)) return 'query';
    if (/Set|Update/i.test(raw)) return 'configure';
    if (/Render|Draw|Present|Submit|Queue/i.test(raw)) return 'execute';
    return 'operate';
  }

  function isVulkanLibraryEntity(entity = null) {
    return String(entity?.library?.id || '').trim() === 'vulkan';
  }

  function isLowValueReferenceDetailText(text = '') {
    const clean = normalizeReferenceSummarySentence(text);
    if (!clean) {
      return true;
    }

    return [
      /^يمثل الحقل .* جزءاً من القيمة التي تحملها هذه البنية أو هذا النوع\.?$/,
      /^تمثل القيمة .* أحد الخيارات التي يقرأها العنصر .* لتحديد سلوك أو حالة محددة\.?$/,
      /^عدد التقديمات\.?$/,
      /^معلومات التقديم\.?$/,
      /^السياج\.?$/,
      /^هيّئ المقابض غير المنشأة إلى VK_NULL_HANDLE/i,
      /^غالباً يجب ضبط الحقل sType/i,
      /^صفر الحقول غير المستخدمة/i,
      /^تُستخدم .* لتحديد .* مثل كيفية الإنشاء أو التخصيص أو بدء التسجيل\.?$/,
      /^يمثل .* مقبضاً إلى .* ثم تمرره إلى الدوال/i
    ].some((pattern) => pattern.test(clean));
  }

  function getVulkanHandleSemanticEntry(name = '') {
    const entries = {
      VkInstance: {
        meaning: '(VkInstance) هو جذر جلسة Vulkan على مستوى التطبيق. من خلاله تعلن الطبقات والامتدادات العامة ثم تبدأ منه استعلام الأجهزة الفيزيائية وإنشاء الأسطح.',
        purpose: 'وُجد حتى يفصل ما يخص التطبيق والمنصة العامة عن ما يخص الجهاز المنطقي والموارد التابعة له.',
        whyUse: 'يستخدمه المبرمج في أول حدود `instance/device boundary`: قبل أي `VkDevice` أو `VkSurfaceKHR` أو استعلام GPU فعلي.'
      },
      VkPhysicalDevice: {
        meaning: '(VkPhysicalDevice) يمثل GPU أو محولًا فعليًا تكشفه Vulkan للقراءة والاستعلام فقط. لا تنشئ عبره الموارد مباشرة، بل تستخرج منه القدرات والعائلات والحدود قبل بناء `VkDevice`.',
        purpose: 'وُجد حتى يبقى اختيار العتاد مرحلة منفصلة عن تشغيله الفعلي.',
        whyUse: 'يستخدمه المبرمج لتقييم `queue families` والميزات وصيغ الصور والامتدادات قبل الالتزام بجهاز منطقي معين.'
      },
      VkDevice: {
        meaning: '(VkDevice) هو الواجهة التشغيلية التي يملكها التطبيق فوق جهاز فيزيائي مختار. معظم الموارد والأوامر والمقابض الطويلة العمر تنشأ منه أو ترتبط بعمره.',
        purpose: 'وُجد حتى ينقل التطبيق من مرحلة الاستعلام إلى مرحلة التنفيذ الفعلي فوق GPU محدد مع queues وfeatures معروفة.',
        whyUse: 'يستخدمه المبرمج لأن إنشاء buffers والصور والـ pipelines والذاكرة والطوابير الفعلية يتم عبره لا عبر `VkPhysicalDevice`.'
      },
      VkQueue: {
        meaning: '(VkQueue) هو مسار إرسال عمل فعلي إلى GPU داخل `queue family` محددة. لا يسجل أوامر بحد ذاته، بل يستقبل batches جاهزة مثل `VkSubmitInfo` ثم يدفعها للتنفيذ.',
        purpose: 'وُجد لأن Vulkan تفصل بين تسجيل العمل في `VkCommandBuffer` وبين إرساله لمسار تنفيذ حقيقي.',
        whyUse: 'يستخدمه المبرمج عند نقطة `submission flow`: بعد التسجيل والمزامنة يختار queue مناسبة للرسوم أو النقل أو الحساب.'
      },
      VkCommandPool: {
        meaning: '(VkCommandPool) هو مالك تخصيص `VkCommandBuffer` ضمن `queue family` واحدة. منه تأتي ملكية الذاكرة الداخلية الخاصة بأوامر التسجيل وإعادة الضبط.',
        purpose: 'وُجد حتى تبقى دورة حياة command buffers مرتبطة بسياق الطابور الذي ستنفذ عليه.',
        whyUse: 'يستخدمه المبرمج لتجميع تخصيص وإعادة تدوير command buffers بدل إنشاء كل buffer ككيان مستقل بلا سياق.'
      },
      VkCommandBuffer: {
        meaning: '(VkCommandBuffer) هو سجل أوامر مؤجل: تكتب فيه نية التنفيذ الآن، لكن GPU لا ينفذ شيئًا حتى يدخل buffer في submit إلى `VkQueue`.',
        purpose: 'وُجد حتى تفصل Vulkan بين `command recording` و`execution` وتسمح بإعادة الاستخدام أو البناء المسبق أو التسجيل الثانوي.',
        whyUse: 'يستخدمه المبرمج لتجميع أوامر الربط والرسم والنسخ والحوائل في وحدة يمكن إرسالها لاحقًا مع مزامنة واضحة.'
      },
      VkFence: {
        meaning: '(VkFence) هو نقطة إشارة تراها CPU بعد أن ينتهي submit أو batch معين على GPU. الغرض منه مزامنة المضيف مع التنفيذ، لا ترتيب أوامر GPU داخل نفسها.',
        purpose: 'وُجد لأن CPU تحتاج أحيانًا معرفة متى صار مورد أو frame معين آمنًا لإعادة الاستخدام.',
        whyUse: 'يستخدمه المبرمج في حلقة الإطارات أو عند teardown أو إعادة بناء الموارد حتى لا تعيد CPU الكتابة فوق عمل لم ينته بعد.'
      },
      VkSemaphore: {
        meaning: '(VkSemaphore) هو إشارة مزامنة بين submits أو بين queue وpresent path. لا تنتظرها CPU عادة، بل تراها نقاط التنفيذ داخل GPU أو مسار العرض.',
        purpose: 'وُجد لتمثيل الاعتمادية بين batches التنفيذية دون اللجوء إلى إيقاف CPU.',
        whyUse: 'يستخدمه المبرمج لترتيب acquire/render/present أو لربط نسخ الموارد بالرسم عبر `pipeline stages` محددة.'
      },
      VkDeviceMemory: {
        meaning: '(VkDeviceMemory) هو تخصيص ذاكرة خام تملكه Vulkan/driver ثم تربط به buffers أو images. ليس مورد رسم مباشرًا، بل الوعاء الذي يمنح الموارد تخزينًا فعليًا.',
        purpose: 'وُجد لأن Vulkan تجعل إدارة الذاكرة صريحة بدل إخفائها خلف كل resource.',
        whyUse: 'يستخدمه المبرمج عندما يحتاج التحكم في `host visibility`, `coherency`, وحجم التخصيص وطريقة ربط عدة موارد بالذاكرة.'
      },
      VkBuffer: {
        meaning: '(VkBuffer) يصف نطاق بيانات خطي في الذاكرة يصلح لقراءات أو كتابات مثل vertex/index/uniform/storage/transfer. لا يملك تخزينه بنفسه حتى تربطه بذاكرة مناسبة.',
        purpose: 'وُجد لتمثيل الموارد الخطية التي لا تحتاج أبعاد صورة أو layouts.',
        whyUse: 'يستخدمه المبرمج عندما يريد موردًا خطيًا واضح الاستخدام داخل الـ pipeline أو النسخ أو الـ descriptors.'
      },
      VkImage: {
        meaning: '(VkImage) يصف موردًا بصريًا ذا أبعاد ونمط تنسيق وmips وlayers، لكنه يبقى مجرد تعريف وصفي حتى يربط بذاكرة ويتحرك عبر `image layouts` المناسبة.',
        purpose: 'وُجد لأن الصور في Vulkan تحتاج وصفًا صريحًا للحجم والاستخدام والعينات وتوافق النقل والعرض والـ shader access.',
        whyUse: 'يستخدمه المبرمج للخامات وdepth targets وattachments وصور النقل، مع الانتباه إلى transitions والـ ownership.'
      },
      VkImageView: {
        meaning: '(VkImageView) هو العدسة التي ترى من خلالها pipeline أو descriptor جزءًا من `VkImage`: نوع العرض، الـ format، ونطاق الـ mips/layers والـ aspects.',
        purpose: 'وُجد لأن الصورة الواحدة قد تُستخدم بطرق متعددة أو بنطاقات جزئية مختلفة.',
        whyUse: 'يستخدمه المبرمج عند ربط image بdescriptor أو framebuffer، لأن Vulkan لا تربط `VkImage` الخام مباشرة في هذه المواضع.'
      },
      VkRenderPass: {
        meaning: '(VkRenderPass) يصف عقد المرور الرسومي التقليدي: ما المرفقات، وكيف تبدأ وتنتهي، وكيف تتوزع subpasses والاعتماديات بينها.',
        purpose: 'وُجد لترميز توافق المرفقات ومسار التحميل/الحفظ والانتقالات الضمنية في render-pass model القديم.',
        whyUse: 'يستخدمه المبرمج عند العمل بـ render pass التقليدي أو عند بناء pipeline يحتاج توافقًا مع pass معين.'
      },
      VkFramebuffer: {
        meaning: '(VkFramebuffer) هو ربط فعلي بين render pass ومجموعة image views بأبعاد محددة ليصبح هناك هدف رسم حقيقي للإطار.',
        purpose: 'وُجد لأن وصف render pass وحده لا يكفي؛ يجب تحديد أي صور فعلية ستستقبل الكتابة في هذا الإطار.',
        whyUse: 'يستخدمه المبرمج عادة لكل صورة swapchain أو لكل مجموعة attachments متوافقة مع pass معين.'
      },
      VkPipeline: {
        meaning: '(VkPipeline) هو الحزمة التنفيذية المسبقة لحالة الرسم أو الحساب: shader stages والـ fixed-function state والروابط التي سيستخدمها التنفيذ.',
        purpose: 'وُجد لأن Vulkan تدفع كثيرًا من قرارات التحقق والربط إلى مرحلة الإنشاء بدل كل draw/dispatch.',
        whyUse: 'يستخدمه المبرمج عند التنفيذ الفعلي عبر `vkCmdBindPipeline` ثم draw/dispatch حتى يبقى state واضحًا وصريحًا.'
      },
      VkPipelineLayout: {
        meaning: '(VkPipelineLayout) يحدد عقد الربط بين الشيدر وباقي الموارد: descriptor set layouts وpush constants. هو الجسر بين pipeline والموارد التي ستُربط وقت التنفيذ.',
        purpose: 'وُجد لتثبيت نموذج `descriptor binding model` وواجهات الشيدر بشكل يمكن التحقق منه مسبقًا.',
        whyUse: 'يستخدمه المبرمج لأن أي bind للـ descriptors أو push constants يجب أن يطابق layout الذي بُنيت عليه الـ pipeline.'
      },
      VkDescriptorSetLayout: {
        meaning: '(VkDescriptorSetLayout) يصف شكل set واحد: أرقام الـ bindings، نوع كل binding، عدد العناصر، والمراحل التي تراها.',
        purpose: 'وُجد حتى يصبح عقد الموارد بين CPU والشيدر معلنًا مسبقًا وقابلًا للتحقق.',
        whyUse: 'يستخدمه المبرمج قبل إنشاء `VkPipelineLayout` وقبل تحديث descriptor sets الفعلية.'
      },
      VkDescriptorPool: {
        meaning: '(VkDescriptorPool) هو مخزن تخصيص descriptor sets من أنواع وكميات محددة مسبقًا.',
        purpose: 'وُجد لأن descriptor sets في Vulkan تخصص من pool يعلن قدرته مسبقًا بدل الإنشاء الحر لكل set.',
        whyUse: 'يستخدمه المبرمج لتجميع إدارة descriptor sets بحسب الإطارات أو المواد أو المشاهد دون خلط التخصيص بالتحديث.'
      },
      VkDescriptorSet: {
        meaning: '(VkDescriptorSet) هو حزمة الربط الفعلية التي تحمل references إلى buffers/images/samplers وفق layout معروف ثم تُربط وقت التسجيل مع pipeline layout متوافق.',
        purpose: 'وُجد ليفصل وصف شكل الربط (`VkDescriptorSetLayout`) عن القيم الفعلية المربوطة لكل draw أو dispatch.',
        whyUse: 'يستخدمه المبرمج عندما يريد تمرير الموارد للشيدر بشكل صريح وقابل لإعادة الاستخدام بين عدة draws أو frames.'
      },
      VkSwapchainKHR: {
        meaning: '(VkSwapchainKHR) هو عقد العرض بين التطبيق والسطح: عدد الصور، تنسيقها، أبعادها، وطريقة تداولها بين acquire/render/present.',
        purpose: 'وُجد لأن العرض على الشاشة ليس مجرد image عادية، بل مورد مرتبط بالمنصة ودورة حياة النافذة.',
        whyUse: 'يستخدمه المبرمج لبناء حلقة الإطار المرئية وربطها بحجم السطح وpresent mode والصور المعروضة فعليًا.'
      }
    };

    return entries[String(name || '').trim()] || null;
  }

  function getVulkanStructSemanticEntry(name = '') {
    const entries = {
      VkSubmitInfo: {
        meaning: '(VkSubmitInfo) هو وصف batch واحدة سترسل إلى queue: ما semaphores التي يجب انتظارها، وفي أي stages يبدأ الانتظار، وأي command buffers ستنفذ، وأي semaphores ستُطلق بعد اكتمال العمل.',
        purpose: 'وُجد لأن submit في Vulkan ليس أمرًا غامضًا؛ بل عقد صريح يربط `recording` بالمزامنة والتنفيذ الفعلي على queue.',
        whyUse: 'يستخدمه المبرمج عندما يريد تحويل command buffers الجاهزة إلى عمل حقيقي على GPU مع شروط البداية والنهاية الواضحة.'
      },
      VkCommandBufferBeginInfo: {
        meaning: '(VkCommandBufferBeginInfo) يحدد كيف سيدخل command buffer في وضع التسجيل: هل سيسجل لمرة واحدة، هل يمكن إعادة استخدامه، وهل هو buffer ثانوي يحتاج inheritance من سياق render pass أو dynamic rendering.',
        purpose: 'وُجد حتى يكون معنى `vkBeginCommandBuffer` صريحًا بدل أن تعتمد الدالة على افتراضات خفية عن نمط الاستخدام.',
        whyUse: 'يستخدمه المبرمج لتثبيت contract التسجيل قبل أول `vkCmd*`، خصوصًا عندما يهم أداء إعادة الاستخدام أو inheritance للـ secondary buffers.'
      },
      VkMemoryAllocateInfo: {
        meaning: '(VkMemoryAllocateInfo) يصف تخصيص ذاكرة خام على مستوى `VkDevice`: الحجم المطلوب ونوع الذاكرة الذي يحدد خصائص مثل `host visible` أو `device local`.',
        purpose: 'وُجد لأن Vulkan تفصل بين إنشاء resource وبين منحها التخزين الفعلي.',
        whyUse: 'يستخدمه المبرمج عندما يقرر كيف ستتفاعل CPU وGPU مع هذا التخصيص: هل سيُmap؟ هل هو staging؟ هل الهدف سرعة GPU فقط؟'
      },
      VkMappedMemoryRange: {
        meaning: '(VkMappedMemoryRange) يحدد أي جزء mapped من `VkDeviceMemory` يدخل في flush أو invalidate حتى تتزامن رؤية CPU مع الذاكرة غير المتماسكة `non-coherent`.',
        purpose: 'وُجد لأن رؤية host وdevice للذاكرة ليست دائمًا تلقائية أو شاملة لكل التخصيص.',
        whyUse: 'يستخدمه المبرمج عندما يكتب CPU إلى memory mapped أو يريد قراءة نتائج GPU منها مع احترام حدود الرؤية والتماسك.'
      },
      VkMemoryBarrier: {
        meaning: '(VkMemoryBarrier) يصف dependency عامة على الذاكرة بدون ربطها بمورد محدد: ما أنواع الوصول السابقة التي يجب إتمامها، وما أنواع الوصول اللاحقة التي يجب ألا تبدأ قبل ذلك.',
        purpose: 'وُجد لتغطية hazards العامة عندما يكفي وصف access scope دون الحاجة إلى buffer/image بعينه.',
        whyUse: 'يستخدمه المبرمج عند تنسيق القراءة والكتابة بين مراحل أو dispatch/draw مختلفة عندما تكون المشكلة في access ordering العام.'
      },
      VkBufferMemoryBarrier: {
        meaning: '(VkBufferMemoryBarrier) يصف dependency تخص buffer محددًا، مع إمكانية نقل الملكية بين queue families أو تقييد الحاجز على range داخل buffer.',
        purpose: 'وُجد لأن مشاكل التزامن أحيانًا تخص buffer بعينه لا كل الذاكرة.',
        whyUse: 'يستخدمه المبرمج عندما يحتاج ترتيب access لbuffer معين أو نقل ownership بين queues.'
      },
      VkImageMemoryBarrier: {
        meaning: '(VkImageMemoryBarrier) يجمع حاجز الوصول مع انتقال `image layout` وربما نقل الملكية بين queue families لصورة محددة ونطاق subresources محدد.',
        purpose: 'وُجد لأن الصور في Vulkan لا تحتاج ترتيب access فقط، بل أيضًا layout مناسبًا للمسار التالي.',
        whyUse: 'يستخدمه المبرمج عند الانتقال بين copy/sample/color-attachment/depth-present paths حتى ترى كل مرحلة الصورة بالشكل المتوقع.'
      },
      VkBufferCreateInfo: {
        meaning: '(VkBufferCreateInfo) هو عقد إنشاء buffer: الحجم، والاستخدامات المسموحة، ونموذج المشاركة بين queue families.',
        purpose: 'وُجد حتى يعلن التطبيق من البداية كيف ينوي استخدام المورد الخطي، لأن هذا يوجه التوافق والتحقق وربما اختيار التخزين.',
        whyUse: 'يستخدمه المبرمج عند إنشاء vertex/index/uniform/storage/staging buffers مع تحديد ما إذا كان buffer سيشارك بين أكثر من queue family.'
      },
      VkImageCreateInfo: {
        meaning: '(VkImageCreateInfo) هو وصف الصورة قبل الذاكرة: الأبعاد، الـ format، عدد الـ mips والطبقات، الاستخدامات، العينات، ونمط المشاركة والـ tiling.',
        purpose: 'وُجد لأن الصورة في Vulkan تحتاج توصيفًا صريحًا يحدد كيف يمكن استعمالها لاحقًا في النقل أو sampling أو attachments.',
        whyUse: 'يستخدمه المبرمج عندما ينشئ texture أو depth image أو render target ويريد أن يحدد مسبقًا الحدود التي سيسمح بها لهذا المورد.'
      },
      VkDescriptorSetLayoutBinding: {
        meaning: '(VkDescriptorSetLayoutBinding) يصف binding واحدًا داخل descriptor set layout: رقمه، نوع المورد، عدد العناصر، والمراحل التي يمكنها قراءته.',
        purpose: 'وُجد لأن descriptor model في Vulkan يحتاج تعريفًا مسبقًا لشكل الربط بين الشيدر والموارد.',
        whyUse: 'يستخدمه المبرمج لبناء contract واضح بين shader stage وdescriptor set قبل أي update أو bind فعلي.'
      },
      VkWriteDescriptorSet: {
        meaning: '(VkWriteDescriptorSet) هو وصف عملية تحديث CPU-side على descriptor set موجود: أي set وأي binding وأي array element وأي buffers/images ستكتب هناك.',
        purpose: 'وُجد لفصل تخصيص descriptor sets عن تعبئة محتواها الفعلي.',
        whyUse: 'يستخدمه المبرمج عندما يربط الموارد بالشيدر فعليًا قبل bind وقت التسجيل.'
      },
      VkPipelineShaderStageCreateInfo: {
        meaning: '(VkPipelineShaderStageCreateInfo) يصف مرحلة shader واحدة داخل pipeline: أي stage، أي module، وما entry point الذي سيبدأ منه التنفيذ.',
        purpose: 'وُجد لأن كل pipeline قد تجمع عدة shader stages يجب وصفها صراحة لا ضمنيًا.',
        whyUse: 'يستخدمه المبرمج عندما يربط ملفات الشيدر الفعلية بالـ pipeline ويحدد تفاعلها مع بقية الحالة.'
      },
      VkGraphicsPipelineCreateInfo: {
        meaning: '(VkGraphicsPipelineCreateInfo) هو عقد تجميع pipeline الرسومية كلها: shader stages، vertex input، rasterization، multisampling، depth/stencil، blending، layout، وrender-pass أو dynamic rendering compatibility.',
        purpose: 'وُجد لأن Vulkan تثبت معظم حالة الرسم مسبقًا وقت الإنشاء بدل كل draw.',
        whyUse: 'يستخدمه المبرمج لبناء حالة رسم قابلة للربط الفوري وقت التسجيل مع وضوح ما هو ثابت وما هو dynamic.'
      },
      VkRenderPassCreateInfo: {
        meaning: '(VkRenderPassCreateInfo) يصف model الـ render pass التقليدي كاملًا: المرفقات، subpasses، والاعتماديات بينها.',
        purpose: 'وُجد لتجميع توافق الكتابة والقراءة والتحميل/الحفظ داخل المرور الرسومي في عقد واحد.',
        whyUse: 'يستخدمه المبرمج عندما يعتمد على render-pass compatibility بدل dynamic rendering.'
      },
      VkRenderingInfo: {
        meaning: '(VkRenderingInfo) يصف attachments المستخدمة في `dynamic rendering` لحظة التسجيل نفسها بدل الرجوع إلى `VkRenderPass`/`VkFramebuffer` تقليديين.',
        purpose: 'وُجد لتقليل اعتماد بعض المسارات الحديثة على render-pass objects الثابتة.',
        whyUse: 'يستخدمه المبرمج عند `vkCmdBeginRendering` لتحديد color/depth/stencil attachments الفعلية ونطاق الرسم الحالي.'
      },
      VkAttachmentDescription: {
        meaning: '(VkAttachmentDescription) يحدد كيف يتعامل render pass مع attachment واحدة: format والعينات، وما يحدث لمحتواها عند البداية والنهاية، وما layout المتوقع قبل pass وبعدها.',
        purpose: 'وُجد لأن attachment ليست مجرد image view؛ بل لها contract واضح للتحميل والحفظ والانتقال.',
        whyUse: 'يستخدمه المبرمج عندما يحدد هل يبدأ من محتوى سابق أو يمسح attachment، وهل سيحفظها للقراءة أو العرض لاحقًا.'
      }
    };

    return entries[String(name || '').trim()] || null;
  }

  function getVulkanEnumSemanticEntry(name = '') {
    const entries = {
      VkPipelineStageFlagBits: {
        meaning: '(VkPipelineStageFlagBits) يحدد أي مراحل التنفيذ على GPU تدخل في نطاق الانتظار أو الحاجز. المقصود هنا ليس نوع مورد، بل أين تقع القراءة أو الكتابة داخل خط التنفيذ.',
        purpose: 'وُجد لأن التزامن في Vulkan يجب أن يحدد `pipeline stages` المعنية لا أن يكتفي بكلمة عامة مثل "زامن هذا المورد".',
        whyUse: 'يستخدمه المبرمج لربط الـ semaphores والحواجز بمراحل التنفيذ الصحيحة حتى لا يكون الحاجز أوسع أو أضيق من اللازم.'
      },
      VkAccessFlagBits: {
        meaning: '(VkAccessFlagBits) يحدد نوع الوصول نفسه: قراءة uniform، كتابة color attachment، قراءة transfer، كتابة shader، وغير ذلك. هو يصف hazard على الذاكرة لا المرحلة التي يحدث فيها.',
        purpose: 'وُجد لأن Vulkan تفصل بين "أين يحدث الوصول" عبر stages و"ما نوع الوصول" عبر access masks.',
        whyUse: 'يستخدمه المبرمج عند بناء حواجز المزامنة حتى يعلن بدقة أي قراءات أو كتابات يجب أن تكتمل قبل السماح بالوصول التالي.'
      },
      VkCommandBufferUsageFlagBits: {
        meaning: '(VkCommandBufferUsageFlagBits) يحدد افتراضات التسجيل وإعادة الاستخدام لـ command buffer، مثل هل سيُsubmit مرة واحدة أو سيُستخدم بالتوازي أو كـ secondary داخل pass.',
        purpose: 'وُجد لأن driver يحتاج معرفة نمط الاستخدام المتوقع عند بداية التسجيل.',
        whyUse: 'يستخدمه المبرمج داخل `VkCommandBufferBeginInfo` لتوضيح دورة الحياة المقصودة للـ command buffer.'
      },
      VkCommandPoolCreateFlagBits: {
        meaning: '(VkCommandPoolCreateFlagBits) يضبط سلوك command pool نفسها: هل buffers منها transient، وهل يمكن reset لكل buffer على حدة، وما القيود الإضافية على الحماية أو الأداء.',
        purpose: 'وُجد لأن استراتيجية إدارة command buffers تؤثر في إعادة التدوير والتكلفة والسلوك المسموح.',
        whyUse: 'يستخدمه المبرمج عندما يقرر كيف سيدير التسجيل عبر الإطارات أو عبر عمليات النسخ المؤقتة.'
      },
      VkImageLayout: {
        meaning: '(VkImageLayout) يحدد التفسير المتوقع لذاكرة الصورة في المسار التالي: عرض، sampling، transfer source، transfer destination، color attachment، depth/stencil، أو استخدام عام.',
        purpose: 'وُجد لأن الصورة الواحدة تحتاج أوضاعًا مختلفة بحسب من سيقرأها أو يكتبها.',
        whyUse: 'يستخدمه المبرمج مع `image layout transitions` حتى يربط الاستخدام الفعلي للصورة بالحالة التي تتوقعها الـ pipeline أو الـ queue.'
      },
      VkBufferUsageFlagBits: {
        meaning: '(VkBufferUsageFlagBits) يعلن مسبقًا كيف سيسمح لهذا buffer أن يُستخدم: مصدر/هدف نقل، vertex/index/uniform/storage، أو غير ذلك.',
        purpose: 'وُجد لأن buffer usage جزء من contract الإنشاء نفسه لا قرارًا متأخرًا وقت التنفيذ.',
        whyUse: 'يستخدمه المبرمج داخل `VkBufferCreateInfo` لتقييد أو تمكين المسارات الفعلية التي سيخدمها buffer.'
      },
      VkImageUsageFlagBits: {
        meaning: '(VkImageUsageFlagBits) يعلن أي أدوار يمكن للصورة أن تلعبها: sampling، storage، color/depth attachment، transfer src/dst، input attachment وغيرها.',
        purpose: 'وُجد لأن صورة render target ليست بالضرورة صورة sampling أو صورة نسخ، ويجب إعلان هذا مبكرًا.',
        whyUse: 'يستخدمه المبرمج داخل `VkImageCreateInfo` حتى تبقى transitions والربط اللاحق متوافقين مع نية الاستخدام الحقيقية.'
      },
      VkDescriptorType: {
        meaning: '(VkDescriptorType) يحدد ما الذي يوجد فعليًا داخل binding: sampler فقط، image مع sampler، buffer موحد، buffer تخزين، image تخزين، input attachment، وغيرها.',
        purpose: 'وُجد لأن الشيدر لا يحتاج فقط رقم binding، بل نوع المورد الذي سيقرأه وكيفية تفسيره.',
        whyUse: 'يستخدمه المبرمج في layouts وupdates حتى يطابق نوع الـ descriptor ما يتوقعه الشيدر وما يمرره التطبيق.'
      },
      VkPipelineBindPoint: {
        meaning: '(VkPipelineBindPoint) يحدد أي نوع pipeline سيتأثر بالربط أو التنفيذ التالي: رسومية، حسابية، أو ray tracing حيث تدعمه الإضافات.',
        purpose: 'وُجد لأن `vkCmdBindPipeline` و`vkCmdBindDescriptorSets` تحتاج معرفة المسار التنفيذي الذي ستربط state له.',
        whyUse: 'يستخدمه المبرمج ليضمن أن الربط يذهب إلى المسار الصحيح داخل command buffer.'
      },
      VkSharingMode: {
        meaning: '(VkSharingMode) يحدد هل المورد يملكه queue family واحدة في كل لحظة (`EXCLUSIVE`) أو يمكن الوصول إليه من عدة عائلات مباشرة (`CONCURRENT`).',
        purpose: 'وُجد لأن ownership بين queue families جزء صريح من نموذج Vulkan.',
        whyUse: 'يستخدمه المبرمج عند إنشاء buffers أو images ليوازن بين الأداء وبساطة النقل بين queues.'
      },
      VkAttachmentLoadOp: {
        meaning: '(VkAttachmentLoadOp) يحدد ماذا يحدث لمحتوى attachment عند بداية render pass أو dynamic rendering: هل يُحمّل المحتوى السابق أم يُمسح أم يصبح المحتوى السابق غير مهم.',
        purpose: 'وُجد لأن بداية المرور الرسومي يجب أن تعلن بوضوح هل تعتمد على البيانات القديمة أم لا.',
        whyUse: 'يستخدمه المبرمج لتجنب قراءات غير لازمة أو لحفظ نتائج الإطار السابق عندما تكون مطلوبة.'
      },
      VkAttachmentStoreOp: {
        meaning: '(VkAttachmentStoreOp) يحدد هل نتيجة الكتابة على attachment في نهاية المرور ستُحفظ لاستخدام لاحق أم يمكن التخلص منها.',
        purpose: 'وُجد لأن نهاية المرور الرسومي يجب أن تصرح إن كان المحتوى سيُستهلك بعد ذلك أم كان مؤقتًا فقط.',
        whyUse: 'يستخدمه المبرمج لتمييز attachments التي ستُعرض أو تُقرأ لاحقًا عن attachments المؤقتة.'
      }
    };

    return entries[String(name || '').trim()] || null;
  }

  function buildVulkanFunctionSemanticEntry(name = '') {
    const raw = String(name || '').trim();
    if (raw === 'vkQueueSubmit') {
      return {
        meaning: '(vkQueueSubmit) ينقل command buffers المسجلة من حالة "جاهزة للتنفيذ" إلى batch فعلية تدخل `VkQueue` مع semaphores وفence اختيارية. هذه هي نقطة العبور من التسجيل إلى التنفيذ الحقيقي على GPU.',
        purpose: 'وُجد لأن Vulkan تفصل صراحة بين كتابة الأوامر وبين إرسالها للتنفيذ مع dependency واضحة.',
        whyUse: 'يستخدمه المبرمج في `submission flow` لكل إطار أو batch عمل عندما يريد ربط command buffers الجاهزة بمزامنة البداية والنهاية المناسبة.'
      };
    }
    if (raw === 'vkBeginCommandBuffer') {
      return {
        meaning: '(vkBeginCommandBuffer) يفتح command buffer للتسجيل ويثبت contract الاستخدام الذي يصفه `VkCommandBufferBeginInfo` قبل أي `vkCmd*`.',
        purpose: 'وُجد لأن command buffer يمر بحالات واضحة ولا يمكن الكتابة فيه دون دخول صريح إلى حالة recording.',
        whyUse: 'يستخدمه المبرمج في بداية كل تسجيل جديد حتى يعرف driver نمط الاستخدام المتوقع ويمنع الخلط بين buffers المسجلة والجاري تسجيلها.'
      };
    }
    if (raw === 'vkEndCommandBuffer') {
      return {
        meaning: '(vkEndCommandBuffer) يغلق مرحلة التسجيل ويحوّل command buffer إلى حالة جاهزة للـ submit. بعده لا تكتب أوامر جديدة قبل reset أو begin جديد حسب الحالة.',
        purpose: 'وُجد لأن نهاية التسجيل يجب أن تكون نقطة تحقق صريحة قبل التنفيذ.',
        whyUse: 'يستخدمه المبرمج عندما يكتمل وصف العمل المطلوب لهذا الـ command buffer ويريد تمريره لاحقًا إلى queue.'
      };
    }
    if (raw === 'vkCmdPipelineBarrier') {
      return {
        meaning: '(vkCmdPipelineBarrier) يسجل حاجزًا داخل command buffer ينسق بين accesses ومراحل تنفيذ محددة، وقد يشمل buffer/image barriers وانتقالات layout ونقل ownership.',
        purpose: 'وُجد لأن Vulkan لا تدرج معظم مزامنة الذاكرة ضمنيًا؛ بل تطلب إعلان dependency صريح عند تغير المنتج أو المستهلك.',
        whyUse: 'يستخدمه المبرمج عندما ينتقل مورد من كتابة إلى قراءة، أو من transfer إلى shader sampling، أو بين queue families أو image layouts مختلفة.'
      };
    }
    if (raw === 'vkMapMemory') {
      return {
        meaning: '(vkMapMemory) يربط CPU بعنوان مضيف يرى range من `VkDeviceMemory` قابلة للـ host access، لكنه لا يلغي الحاجة إلى flush/invalidate عندما تكون الذاكرة غير متماسكة.',
        purpose: 'وُجد لتوفير جسر صريح بين host وdevice memory بدل إخفاء النقل خلف واجهة ضمنية.',
        whyUse: 'يستخدمه المبرمج لكتابة بيانات uniforms أو staging buffers أو لقراءة نتائج تسمح بها خصائص الذاكرة.'
      };
    }
    if (raw === 'vkFlushMappedMemoryRanges') {
      return {
        meaning: '(vkFlushMappedMemoryRanges) يدفع كتابات CPU من ranges محددة إلى الذاكرة التي ستراها GPU عندما تكون memory غير متماسكة `non-coherent`.',
        purpose: 'وُجد لأن host-visible لا يعني دائمًا أن تغييرات CPU تصبح مرئية تلقائيًا للجهاز.',
        whyUse: 'يستخدمه المبرمج بعد الكتابة إلى mapped memory وقبل submit أو قبل أي استخدام device-side يعتمد على البيانات الجديدة.'
      };
    }
    if (raw === 'vkInvalidateMappedMemoryRanges') {
      return {
        meaning: '(vkInvalidateMappedMemoryRanges) يسحب أحدث محتوى device-side إلى رؤية CPU في ranges mapped غير متماسكة قبل أن تقرأها host.',
        purpose: 'وُجد لأن نتائج GPU المكتوبة إلى الذاكرة لا تصبح دائمًا مرئية مباشرة لقراءة CPU.',
        whyUse: 'يستخدمه المبرمج قبل قراءة CPU لبيانات كتبتها GPU في mapped memory غير coherent.'
      };
    }
    if (raw === 'vkBindBufferMemory') {
      return {
        meaning: '(vkBindBufferMemory) يربط buffer بتخصيص `VkDeviceMemory` فعلي وبـ offset محدد داخله، فيصبح للمورد تخزين حقيقي يمكن استخدامه.',
        purpose: 'وُجد لأن إنشاء resource ووضعه في الذاكرة مرحلتان منفصلتان في Vulkan.',
        whyUse: 'يستخدمه المبرمج بعد اختيار memory type مناسب للـ buffer وقبل أول استخدام له في النسخ أو الربط أو descriptors.'
      };
    }
    if (raw === 'vkBindImageMemory') {
      return {
        meaning: '(vkBindImageMemory) يربط image بتخصيص `VkDeviceMemory` فعلي، وبذلك تصبح الصورة قابلة للاستخدام في transitions والنسخ والربط.',
        purpose: 'وُجد لأن الصور أيضًا لا تملك تخزينًا فعليًا بمجرد الإنشاء الوصفي.',
        whyUse: 'يستخدمه المبرمج بعد استعلام متطلبات الصورة واختيار memory type متوافق قبل أي layout transition أو image view أو descriptor.'
      };
    }
    if (raw === 'vkCmdBindPipeline') {
      return {
        meaning: '(vkCmdBindPipeline) يسجل pipeline الفعلية التي ستستخدمها الأوامر التالية من نوع draw/dispatch ضمن `pipeline bind point` المحدد.',
        purpose: 'وُجد لأن state التنفيذية في Vulkan تُربط صراحة داخل command buffer بدل أن تكون حالة عالمية مخفية.',
        whyUse: 'يستخدمه المبرمج قبل أوامر الرسم أو الحساب حتى يعرف التنفيذ أي shaders وأي fixed-function state ستطبّق.'
      };
    }
    if (raw === 'vkCmdBindDescriptorSets') {
      return {
        meaning: '(vkCmdBindDescriptorSets) يسجل descriptor sets الفعلية التي ستراها الـ pipeline layout الحالية عند التنفيذ، مع dynamic offsets إن وجدت.',
        purpose: 'وُجد لأن الموارد التي يقرأها الشيدر يجب ربطها صراحة لكل command buffer أو draw scope مناسب.',
        whyUse: 'يستخدمه المبرمج بعد bind pipeline وقبل draw/dispatch ليعطي الشيدر buffers/images/samplers الصحيحة.'
      };
    }
    if (raw === 'vkCmdBeginRenderPass') {
      return {
        meaning: '(vkCmdBeginRenderPass) يبدأ تسجيل مرور render pass تقليدي على framebuffer محدد، مع تعريف واضح للـ clear values ومسار subpass الأول.',
        purpose: 'وُجد لأن render pass التقليدي له حدود بداية/نهاية واضحة تؤثر في attachments والاعتماديات.',
        whyUse: 'يستخدمه المبرمج عندما يعمل بنموذج render pass التقليدي ويريد بدء الكتابة إلى attachments فعلية.'
      };
    }
    if (raw === 'vkCmdBeginRendering') {
      return {
        meaning: '(vkCmdBeginRendering) يبدأ `dynamic rendering` فوق attachments يحددها `VkRenderingInfo` مباشرة وقت التسجيل بدل المرور عبر `VkRenderPass` و`VkFramebuffer` تقليديين.',
        purpose: 'وُجد لتبسيط بعض مسارات الرسم الحديثة وتقليل الارتباط بالأجسام التقليدية الثابتة.',
        whyUse: 'يستخدمه المبرمج عندما يعتمد على dynamic rendering ويريد بدء pass الرسم من attachments الحالية مباشرة.'
      };
    }
    if (raw === 'vkQueuePresentKHR') {
      return {
        meaning: '(vkQueuePresentKHR) يسلم صورة swapchain المكتملة إلى مسار العرض بعد أن تصبح semaphores المطلوبة محققة، أي أنه ينقل الصورة من نطاق التنفيذ إلى نطاق العرض على السطح.',
        purpose: 'وُجد لأن present خطوة منفصلة عن submit، ولها مزامنة وعقود مرتبطة بالسطح وswapchain.',
        whyUse: 'يستخدمه المبرمج في آخر حلقة الإطار بعد انتهاء الرسم على الصورة المكتسبة.'
      };
    }
    if (raw === 'vkCreateGraphicsPipelines') {
      return {
        meaning: '(vkCreateGraphicsPipelines) يبني pipelines رسومية جاهزة للربط من أوصاف creation-time state والشيدر والـ layout وتوافق render-pass أو dynamic rendering.',
        purpose: 'وُجد لأن Vulkan تنقل كلفة التحقق وتجميع state إلى مرحلة إنشاء صريحة بدل draw time.',
        whyUse: 'يستخدمه المبرمج عندما يريد pipeline مستقرة تربط لاحقًا سريعًا أثناء تسجيل الأوامر.'
      };
    }

    if (/^vkCmd/.test(raw)) {
      return {
        meaning: `(${raw}) يسجل أمرًا داخل command buffer ليُنفذ لاحقًا على GPU، ولا ينفذ العمل فور الاستدعاء من CPU.`,
        purpose: 'وُجد لأن أوامر Vulkan الجوهرية تكتب أولًا في command buffer ضمن تسجيل صريح ثم تدخل submit لاحقًا.',
        whyUse: 'يستخدمه المبرمج لبناء تسلسل التنفيذ المطلوب داخل command buffer مع state ومزامنة وموارد محددة.'
      };
    }
    if (/^vkQueue/.test(raw)) {
      return {
        meaning: `(${raw}) يعمل عند حدود الـ queue: إما إرسال batches أو الانتظار أو العرض، أي أنه يدير انتقال العمل بين command buffers ومسار التنفيذ أو present.`,
        purpose: 'وُجد لأن queues في Vulkan تمثل خط التنفيذ الفعلي الذي يحتاج عقودًا منفصلة عن التسجيل.',
        whyUse: 'يستخدمه المبرمج عند نقطة الربط بين الأوامر المسجلة والتنفيذ أو العرض الفعلي.'
      };
    }

    return null;
  }

  function getVulkanEntitySemanticEntry(entity = null) {
    const kindId = String(entity?.kind?.id || '').trim();
    const name = String(entity?.identity?.name || '').trim();
    if (!name) {
      return null;
    }

    if (kindId === 'variables' || kindId === 'types') {
      return getVulkanHandleSemanticEntry(name);
    }
    if (kindId === 'structures') {
      return getVulkanStructSemanticEntry(name);
    }
    if (kindId === 'enums' || kindId === 'constants' || kindId === 'macros') {
      return getVulkanEnumSemanticEntry(name);
    }
    if (kindId === 'functions') {
      return buildVulkanFunctionSemanticEntry(name);
    }

    return null;
  }

  function buildVulkanEntityCarriedValueFallback(entity = null) {
    const kindId = String(entity?.kind?.id || '').trim();
    const name = String(entity?.identity?.name || '').trim();

    if (kindId === 'variables' || kindId === 'types') {
      if (/^Vk[A-Z]/.test(name)) {
        return `يحمل هذا النوع handle أو قيمة رسمية تدخل في عقد الملكية أو الربط أو الإرسال؛ لذلك معناه يظهر في أين يُنشأ وأين يُمرر وأي عمر يملكه داخل مسار Vulkan.`;
      }
    }

    if (kindId === 'structures') {
      return 'تحمل هذه البنية عقدًا مقروءًا كوحدة واحدة: الحقول معًا تحدد الإنشاء أو المزامنة أو الربط أو حدود التنفيذ، وليس كل حقل قرارًا مستقلاً تمامًا عن البقية.';
    }

    if (kindId === 'enums' || kindId === 'constants' || kindId === 'macros') {
      return 'تحمل هذه القيم قرارًا صريحًا عن stage أو access أو layout أو usage أو binding mode، لذلك تغيير القيمة يغير السلوك أو التوافق أو حدود التنفيذ فعليًا.';
    }

    return '';
  }

  function buildVulkanFunctionParameterDescription(functionName = '', row = {}) {
    const name = String(row?.name || '').trim();
    const functionKey = String(functionName || '').trim();
    const specific = {
      vkQueueSubmit: {
        queue: 'يمثل queue الفعلية التي ستستقبل الـ submit. اختيارها يحدد أي `queue family` ستنفذ العمل وما إذا كان المسار رسوميًا أو حسابيًا أو نقليًا.',
        submitCount: 'عدد عناصر `VkSubmitInfo` التي ستدخل queue بهذا النداء. كل عنصر يمثل batch لها wait/signal semaphores وcommand buffers خاصة بها.',
        pSubmits: 'مصفوفة batches المرسلة. كل عنصر يربط بين command buffers الجاهزة وsemaphores الانتظار/الإشارة ونطاق stages الذي يبدأ عنده العمل.',
        fence: 'Fence اختيارية تُشار عندما تنتهي كل batches في هذا النداء. الغرض منها مزامنة CPU مع اكتمال التنفيذ، لا ترتيب أوامر GPU داخل الـ submit نفسها.'
      },
      vkBeginCommandBuffer: {
        commandBuffer: 'الـ command buffer الذي سيدخل حالة التسجيل. يجب أن يكون في حالة تسمح بالبدء وفق دورة حياته وسياسة الـ pool/reset.',
        pBeginInfo: 'وصف سياسة التسجيل الحالية: flags الخاصة بإعادة الاستخدام أو secondary inheritance وما يلزم قبل أول أمر `vkCmd*`.'
      },
      vkEndCommandBuffer: {
        commandBuffer: 'الـ command buffer الذي سينتقل من recording إلى executable. بعد نجاح هذه الخطوة يصبح صالحًا للـ submit بدل قبول أوامر جديدة.'
      },
      vkCmdPipelineBarrier: {
        commandBuffer: 'يسجل الحاجز داخل هذا command buffer، لذلك أثره لا يظهر حتى يُsubmit buffer نفسه.',
        srcStageMask: 'نطاق المراحل التي يجب أن تعتبرها كمصدر للتبعيات. هو يحدد أين تقع الكتابات أو القراءات التي تريد إكمالها قبل المسار التالي.',
        dstStageMask: 'نطاق المراحل التي سيبدأ عندها الاستهلاك التالي. هو يحدد أين يجب أن يصبح المورد أو الذاكرة آمنين للرؤية أو الكتابة.',
        dependencyFlags: 'أعلام تعدل معنى dependency مثل `by-region` أو غيره. لا تستبدل access masks بل تضبط سلوك نطاق الحاجز.',
        memoryBarrierCount: 'عدد الحواجز العامة `VkMemoryBarrier` التي تصف access ordering دون ربط بمورد بعينه.',
        pMemoryBarriers: 'حواجز عامة على الذاكرة عندما تكون المشكلة في access scope العام لا في buffer أو image محددة.',
        bufferMemoryBarrierCount: 'عدد حواجز buffers المرفقة بهذا النداء.',
        pBufferMemoryBarriers: 'حواجز موارد خطية محددة قد تشمل ranges ونقل ownership بين queue families.',
        imageMemoryBarrierCount: 'عدد حواجز الصور المرفقة بهذا النداء.',
        pImageMemoryBarriers: 'حواجز الصور التي تجمع access dependency مع `image layout transitions` وربما queue ownership transfer.'
      },
      vkMapMemory: {
        device: 'الجهاز المنطقي الذي يملك تخصيص `VkDeviceMemory` المطلوب map له.',
        memory: 'تخصيص الذاكرة الخام الذي ستكشف جزءًا منه لعنوان host. يجب أن يكون من نوع memory يسمح بالوصول من CPU.',
        offset: 'بداية الـ range داخل `VkDeviceMemory` التي ستُmap. يجب أن تراعي القيود والمحاذاة المرتبطة بالتخصيص.',
        size: 'حجم الـ range المطلوب map له. يحدد الجزء الذي ستراه host من التخصيص، وليس بالضرورة كامل الذاكرة.',
        flags: 'محجوز حاليًا ويجب أن يكون صفرًا؛ لا يحمل سلوكًا وظيفيًا جديدًا في هذا الاستدعاء.',
        ppData: 'عنوان خرج يستقبل pointer مضيفًا يبدأ من range mapped. هذا المؤشر يمثل رؤية CPU للذاكرة لا نسخة منفصلة منها.'
      },
      vkFlushMappedMemoryRanges: {
        device: 'الجهاز المنطقي الذي يملك ranges mapped المطلوبة.',
        memoryRangeCount: 'عدد ranges التي ستُflush في هذا النداء.',
        pMemoryRanges: 'مصفوفة ranges تحدد أي أجزاء من الذاكرة غير المتماسكة يجب أن تصبح كتابات CPU فيها مرئية للجهاز.'
      },
      vkInvalidateMappedMemoryRanges: {
        device: 'الجهاز المنطقي الذي يملك ranges mapped المطلوبة.',
        memoryRangeCount: 'عدد ranges التي ستُinvalidate قبل قراءة CPU.',
        pMemoryRanges: 'مصفوفة ranges التي يجب سحب أحدث محتواها من رؤية الجهاز إلى رؤية المضيف عندما تكون الذاكرة non-coherent.'
      },
      vkBindBufferMemory: {
        device: 'الجهاز المنطقي المالك لكل من buffer والذاكرة التي ستربط بها.',
        buffer: 'الـ buffer الوصفي الذي سيكتسب تخزينًا فعليًا بعد هذا الربط.',
        memory: 'تخصيص `VkDeviceMemory` الذي سيوفر التخزين الحقيقي للـ buffer.',
        memoryOffset: 'الـ offset داخل التخصيص الذي سيبدأ منه تخزين هذا الـ buffer، ويجب أن يطابق قيود المحاذاة ومتطلبات المورد.'
      },
      vkBindImageMemory: {
        device: 'الجهاز المنطقي المالك لكل من image والذاكرة التي ستربط بها.',
        image: 'الصورة الوصفية التي ستصبح قابلة للاستخدام الفعلي بعد ربطها بذاكرة مناسبة.',
        memory: 'تخصيص `VkDeviceMemory` الذي سيوفر التخزين الفعلي للصورة.',
        memoryOffset: 'بداية موقع الصورة داخل التخصيص مع احترام متطلبات المحاذاة والالتزامات الخاصة بالصورة.'
      },
      vkCmdBindPipeline: {
        commandBuffer: 'الـ command buffer الذي ستسجل فيه عملية bind هذه.',
        pipelineBindPoint: 'يحدد هل الربط يخص pipeline رسومية أم حسابية أم مسارًا آخر مدعومًا، لأن نفس command buffer قد يحمل أكثر من bind point.',
        pipeline: 'الـ pipeline الفعلية التي ستطبق على أوامر draw/dispatch اللاحقة ضمن bind point المحدد.'
      },
      vkCmdBindDescriptorSets: {
        commandBuffer: 'الـ command buffer الذي ستسجل فيه عملية bind للـ descriptor sets.',
        pipelineBindPoint: 'المسار التنفيذي الذي ستُربط له المجموعات، ويجب أن يطابق ما تتوقعه الـ pipeline الحالية.',
        layout: 'Pipeline layout التي تُفسر أرقام `set` و`binding` والـ push constant ranges. يجب أن تكون متوافقة مع pipeline والـ descriptor sets.',
        firstSet: 'رقم أول descriptor set slot سيبدأ عنده الربط داخل pipeline layout.',
        descriptorSetCount: 'عدد descriptor sets التي ستُربط بدءًا من `firstSet`.',
        pDescriptorSets: 'مصفوفة descriptor sets الفعلية التي ستصبح مرئية للشيدر وفق layout الحالية.',
        dynamicOffsetCount: 'عدد dynamic offsets المرفقة لتلك الـ sets عندما تشمل bindings من نوع dynamic buffer descriptors.',
        pDynamicOffsets: 'القيم التي تُضاف وقت bind إلى offsets الخاصة بالـ dynamic uniform/storage buffers.'
      },
      vkCreateGraphicsPipelines: {
        device: 'الجهاز المنطقي الذي سيبني الـ pipelines ويملك الموارد المرجعية مثل shader modules وpipeline layout.',
        pipelineCache: 'Pipeline cache اختيارية لتقليل كلفة بناء pipelines عبر التشغيلات أو الإنشاءات المتكررة.',
        createInfoCount: 'عدد أوصاف `VkGraphicsPipelineCreateInfo` المراد بناؤها في هذا النداء.',
        pCreateInfos: 'مصفوفة الأوصاف التي تحدد state creation-time كاملة لكل pipeline رسومية مطلوبة.',
        pAllocator: 'Allocator مضيف اختياري يتحكم في تخصيصات host المتعلقة بالإنشاء، لا في state الرسومية نفسها.',
        pPipelines: 'مصفوفة خرج تستقبل مقابض الـ pipelines الناتجة بالترتيب نفسه لأوصاف الإنشاء.'
      }
    };

    const exact = specific[functionKey]?.[name];
    if (exact) {
      return exact;
    }

    if (name === 'device') {
      return 'الجهاز المنطقي الذي يملك هذا المسار أو المورد. في Vulkan أغلب الإنشاءات والربوط التنفيذية تتم عبر `VkDevice` لأن هذه هي حدود الملكية التشغيلية الفعلية.';
    }
    if (name === 'commandBuffer') {
      return 'الـ command buffer الذي سيسجل أو يحمل هذا الأمر. تذكر أن التغيير هنا يسجل نية تنفيذ داخل buffer ولا ينفذ فورًا.';
    }
    if (name === 'pCreateInfo') {
      return 'بنية العقد التي تصف الإنشاء أو البدء أو التهيئة المطلوبة كاملة. قيمها هي التي تحدد السلوك الحقيقي، لا مجرد وجود المؤشر نفسه.';
    }
    if (name === 'pAllocator') {
      return 'Allocator مضيف اختياري يغير طريقة تخصيص host memory المصاحبة للاستدعاء، لا وظيفة المورد أو معناه الرسومي بحد ذاته.';
    }

    return '';
  }

  function buildVulkanStructFieldDescription(entity = null, row = {}) {
    const entityName = String(entity?.identity?.name || '').trim();
    const name = String(row?.name || '').trim();
    const exact = {
      VkSubmitInfo: {
        sType: 'يعرف driver أن هذه العقدة هي `VkSubmitInfo` داخل أي سلاسل `pNext` أو parsing داخلي، فلا يخلطها مع أنواع submit أخرى.',
        pNext: 'امتدادات submit الإضافية تُربط هنا كسلسلة `pNext` عندما تحتاج مزامنة أو معلومات توسعة لا تحملها البنية الأساسية.',
        waitSemaphoreCount: 'عدد semaphores التي يجب أن تتحقق قبل أن يسمح لهذه الـ batch ببدء الاستهلاك في stages المحددة.',
        pWaitSemaphores: 'مصفوفة semaphores التي تمثل الاعتماديات القادمة من acquire أو submit سابقة أو queue أخرى.',
        pWaitDstStageMask: 'لكل semaphore انتظار، تحدد هذه المصفوفة أول stages داخل هذه الـ batch التي يجب أن تنتظر قبل المتابعة.',
        commandBufferCount: 'عدد command buffers التي ستنفذ ضمن هذه الـ batch وبالترتيب المحدد في المصفوفة.',
        pCommandBuffers: 'مصفوفة command buffers الجاهزة للتنفيذ التي ستدخل queue عند هذه الـ submit.',
        signalSemaphoreCount: 'عدد semaphores التي ستُشار بعد اكتمال العمل المسجل في هذه الـ batch.',
        pSignalSemaphores: 'مصفوفة semaphores التي ستصبح إشارات خروج تعتمد عليها submits أو present لاحقة.'
      },
      VkCommandBufferBeginInfo: {
        sType: 'يعرف driver أن هذه العقدة تخص بدء التسجيل لا أي بنية command buffer أخرى.',
        pNext: 'سلسلة امتدادات تضيف سلوكًا أو metadata لبداية التسجيل عند الحاجة.',
        flags: 'تحدد افتراضات التسجيل مثل one-time submit أو simultaneous use أو render-pass continue للـ secondary buffer.',
        pInheritanceInfo: 'تصف السياق الذي سيرثه secondary command buffer من render pass/framebuffer أو الاستعلامات عند التنفيذ داخل primary.'
      },
      VkMemoryAllocateInfo: {
        sType: 'يعرف driver أن هذه العقدة تخص تخصيص ذاكرة خام على مستوى `VkDevice`.',
        pNext: 'هنا تتصل امتدادات التخصيص مثل dedicated allocation أو export/import metadata إن استُخدمت.',
        allocationSize: 'الحجم الفعلي المطلوب للتخصيص، وغالبًا يُشتق من `vkGet*MemoryRequirements` مع مراعاة المحاذاة أو مشاركة عدة موارد.',
        memoryTypeIndex: 'نوع الذاكرة المختار من physical device memory properties، وهو ما يحدد هل الذاكرة `device local`, `host visible`, `host coherent` وغيرها.'
      },
      VkMappedMemoryRange: {
        sType: 'يعرف driver أن هذه العقدة تصف range لعمليات flush/invalidate على ذاكرة mapped.',
        pNext: 'عادة يبقى فارغًا إلا إذا أضافت امتدادات metadata خاصة بعمليات الرؤية أو التخصيص.',
        memory: 'تخصيص `VkDeviceMemory` الذي ستطبَّق عليه عملية flush أو invalidate.',
        offset: 'بداية الـ range داخل التخصيص الذي تريد مزامنة رؤيته بين CPU وGPU.',
        size: 'حجم الـ range المعني. لا يجب افتراض أن العملية تشمل كامل التخصيص إذا لم يكن ذلك مقصودًا.'
      },
      VkMemoryBarrier: {
        sType: 'يعرف driver أن هذه العقدة تمثل barrier عامة على access masks.',
        pNext: 'سلسلة امتدادات إضافية عندما تحتاج semantics مزامنة أوسع من البنية الأساسية.',
        srcAccessMask: 'أنواع accesses السابقة التي يجب أن تكتمل وتصبح متاحة قبل السماح بالنطاق التالي.',
        dstAccessMask: 'أنواع accesses اللاحقة التي لا يجب أن تبدأ قبل أن يصبح ما قبلها مرئيًا وآمنًا.'
      },
      VkBufferMemoryBarrier: {
        sType: 'يعرف driver أن هذه العقدة تخص barrier لbuffer محدد لا barrier عامة.',
        pNext: 'امتدادات إضافية خاصة بحاجز buffer عند الحاجة.',
        srcAccessMask: 'accesses السابقة على هذا الـ buffer التي يجب أن تكتمل.',
        dstAccessMask: 'accesses اللاحقة على هذا الـ buffer التي ستنتظر اكتمال النطاق السابق.',
        srcQueueFamilyIndex: 'queue family المالكة قبل النقل، أو `VK_QUEUE_FAMILY_IGNORED` إذا لم يوجد ownership transfer.',
        dstQueueFamilyIndex: 'queue family التي ستملك المورد بعد الحاجز عند نقل الملكية بين queues.',
        buffer: 'الـ buffer الذي يطبّق عليه هذا الحاجز.',
        offset: 'بداية الـ range داخل الـ buffer التي يشملها الحاجز.',
        size: 'حجم الـ range داخل الـ buffer التي يشملها الحاجز.'
      },
      VkImageMemoryBarrier: {
        sType: 'يعرف driver أن هذه العقدة تخص barrier لصورة وقد تشمل layout transition.',
        pNext: 'امتدادات إضافية للصورة أو التزامن أو queue ownership عندما تتطلب الحالة ذلك.',
        srcAccessMask: 'accesses السابقة على الصورة التي يجب أن تكتمل قبل الانتقال أو الاستهلاك التالي.',
        dstAccessMask: 'accesses اللاحقة التي ستعتمد على اكتمال الصورة وانتقالها الصحيح.',
        oldLayout: 'الـ layout التي توجد عليها الصورة قبل الحاجز، أي التفسير الحالي لذاكرتها في المسار السابق.',
        newLayout: 'الـ layout المطلوبة للمسار التالي، مثل `TRANSFER_DST_OPTIMAL` أو `SHADER_READ_ONLY_OPTIMAL` أو `PRESENT_SRC_KHR`.',
        srcQueueFamilyIndex: 'queue family الحالية المالكة للصورة عند نقل الملكية بين queues.',
        dstQueueFamilyIndex: 'queue family الجديدة المالكة للصورة بعد الحاجز عند وجود ownership transfer.',
        image: 'الصورة المستهدفة بالحاجز والانتقال.',
        subresourceRange: 'أي mip levels وأي array layers وأي aspects من الصورة يشملها هذا الحاجز.'
      },
      VkBufferCreateInfo: {
        sType: 'يعرف driver أن هذه العقدة تخص إنشاء buffer.',
        pNext: 'امتدادات إنشاء إضافية لخصائص buffer أو التصدير أو العناوين أو غير ذلك.',
        flags: 'أعلام تغير semantics الإنشاء مثل sparse binding أو protected أو device address related behavior حسب الامتدادات.',
        size: 'الحجم المنطقي للـ buffer بالبايت قبل أي ربط بذاكرة.',
        usage: 'الاستخدامات المسموح بها لهذا الـ buffer مثل vertex/index/uniform/storage/transfer. هذه القيمة جزء من contract الإنشاء نفسه.',
        sharingMode: 'هل سيبقى الـ buffer تحت ownership عائلة واحدة غالبًا (`EXCLUSIVE`) أم يمكن الوصول إليه مباشرة من عدة عائلات (`CONCURRENT`).',
        queueFamilyIndexCount: 'عندما يكون `sharingMode` متزامنًا، يحدد عدد queue families المشاركة.',
        pQueueFamilyIndices: 'قائمة queue families التي سيسمح لها بالوصول المباشر عندما يكون النمط `CONCURRENT`.'
      },
      VkImageCreateInfo: {
        sType: 'يعرف driver أن هذه العقدة تخص إنشاء image.',
        pNext: 'امتدادات إنشاء إضافية للصورة مثل external memory أو format modifiers أو dedicated metadata.',
        flags: 'أعلام خاصة بصور cube/sparse/mutable format وغيرها مما يغير contract المورد.',
        imageType: 'هل الصورة 1D أو 2D أو 3D، وهذا يحدد شكل المورد الأساسي.',
        format: 'تنسيق العناصر داخل الصورة، وهو ما يحدد كيف ستفسر العينات أو مكونات اللون/العمق.',
        extent: 'الأبعاد الفعلية للصورة بالمستوى الأساسي.',
        mipLevels: 'عدد مستويات الـ mip التي ستملكها الصورة.',
        arrayLayers: 'عدد الطبقات، سواء لصورة array أو cube faces أو استعمالات مماثلة.',
        samples: 'عدد العينات لكل texel/fragment عند استخدام multisampling.',
        tiling: 'طريقة تنظيم الذاكرة داخليًا من منظور Vulkan مثل `OPTIMAL` أو `LINEAR` وما يترتب على ذلك من قيود استخدام.',
        usage: 'الأدوار المسموح بها للصورة مثل sampling أو storage أو color/depth attachment أو transfer.',
        sharingMode: 'نموذج ownership بين queue families للصورة.',
        queueFamilyIndexCount: 'عدد العائلات المشاركة عندما يكون النمط `CONCURRENT`.',
        pQueueFamilyIndices: 'العائلات التي يسمح لها بالوصول المباشر عند المشاركة المتزامنة.',
        initialLayout: 'الـ layout الابتدائية التي سيفترضها المورد بعد الإنشاء؛ غالبًا تبدأ `UNDEFINED` عندما لا يهم المحتوى القديم.'
      },
      VkDescriptorSetLayoutBinding: {
        binding: 'رقم الـ binding داخل set. هذا هو الرقم الذي يطابق layout الشيدر (`set/binding`).',
        descriptorType: 'نوع المورد الذي سيظهر في هذا الـ binding، مثل uniform buffer أو combined image sampler أو storage buffer.',
        descriptorCount: 'عدد العناصر في هذا الـ binding. إذا كان أكبر من 1 فهذا binding يمثل مصفوفة descriptors لا عنصرًا واحدًا.',
        stageFlags: 'shader stages التي يسمح لها برؤية هذا الـ binding، وهو جزء من contract التحقق بين layout والشيدر.',
        pImmutableSamplers: 'Samplers ثابتة تُدمج في layout نفسها، وتلغي الحاجة لتمرير samplers منفصلة في updates لهذا binding عندما يكون ذلك مدعومًا.'
      },
      VkWriteDescriptorSet: {
        sType: 'يعرف driver أن هذه العقدة تصف update لdescriptor set.',
        pNext: 'تمتد هنا أنواع update خاصة مثل acceleration structures أو inline uniform blocks.',
        dstSet: 'الـ descriptor set التي ستُكتب فيها القيم الفعلية.',
        dstBinding: 'رقم الـ binding داخل تلك المجموعة الذي سيبدأ عنده التحديث.',
        dstArrayElement: 'أول عنصر داخل مصفوفة binding سيبدأ عنده التحديث.',
        descriptorCount: 'عدد descriptors المتتالية التي ستكتبها هذه العملية.',
        descriptorType: 'نوع descriptor الذي يجب أن يطابق layout لهذا الـ binding.',
        pImageInfo: 'مصدر معلومات الصور/السماپلرات عندما يكون نوع الـ descriptor يعتمد على image/sampler.',
        pBufferInfo: 'مصدر معلومات buffers عندما يكون نوع الـ descriptor يعتمد على buffer.',
        pTexelBufferView: 'مصدر views الخاصة بالـ texel buffers عندما يكون نوع descriptor مناسبًا لهذا المسار.'
      },
      VkGraphicsPipelineCreateInfo: {
        sType: 'يعرف driver أن هذه العقدة تصف إنشاء pipeline رسومية.',
        pNext: 'امتدادات إنشائية للـ pipeline مثل dynamic rendering أو pipeline libraries أو shader object metadata.',
        flags: 'أعلام تغير semantics البناء أو التحقق أو الاشتقاق للـ pipeline.',
        stageCount: 'عدد shader stages المشاركة في هذه الـ pipeline.',
        pStages: 'مصفوفة أوصاف shader stages التي ستشكّل الجزء البرمجي من الـ pipeline.',
        pVertexInputState: 'وصف كيف ستُقرأ vertex buffers: bindings والـ attributes والتخطيط بينهما.',
        pInputAssemblyState: 'وصف كيف تتحول الرؤوس إلى primitives مثل triangle list أو strip وغيرها.',
        pTessellationState: 'إعدادات الترصيع عندما توجد stages tessellation في الـ pipeline.',
        pViewportState: 'وصف عدد الـ viewports والـ scissors الثابتة أو الديناميكية.',
        pRasterizationState: 'الجزء الذي يحول primitives إلى fragments: culling, polygon mode, front face وغيرها.',
        pMultisampleState: 'إعداد multisampling وsample counts المرتبطة بالـ framebuffer/attachments.',
        pDepthStencilState: 'إعداد اختبارات العمق والستنسل والكتابة عليهما.',
        pColorBlendState: 'وصف blending والكتابة لكل color attachment.',
        pDynamicState: 'الحالات التي لن تثبَّت هنا بالكامل بل ستضبط لاحقًا بأوامر `vkCmdSet*`.',
        layout: 'Pipeline layout التي تحدد descriptor sets وpush constants التي ستفهمها هذه الـ pipeline.',
        renderPass: 'Render pass المتوافقة معها هذه الـ pipeline في النموذج التقليدي.',
        subpass: 'رقم subpass داخل render pass التي ستعمل هذه الـ pipeline ضمنها.',
        basePipelineHandle: 'Pipeline مرجعية للاشتقاق عند استخدام أساليب derivative pipelines.',
        basePipelineIndex: 'فهرس مرجعي بديل داخل نفس نداء الإنشاء لاشتقاق Pipeline من عنصر آخر في المصفوفة.'
      },
      VkRenderPassCreateInfo: {
        sType: 'يعرف driver أن هذه العقدة تصف render pass تقليدية.',
        pNext: 'امتدادات render pass إضافية مثل multiview أو metadata مرتبطة بالمرور.',
        flags: 'أعلام تغير semantics render pass أو التوافق في حالات خاصة.',
        attachmentCount: 'عدد attachments الموصوفة في هذا الـ render pass.',
        pAttachments: 'مصفوفة أوصاف attachments التي تحدد format/load/store/layout لكل attachment.',
        subpassCount: 'عدد subpasses الموصوفة في هذا الـ المرور.',
        pSubpasses: 'الوصف التفصيلي لكل subpass: ما الذي يقرأه أو يكتبه من attachments وبأي شكل.',
        dependencyCount: 'عدد الاعتماديات بين subpasses أو بين subpass والعالم الخارجي.',
        pDependencies: 'مصفوفة dependencies التي تحدد stages/access ordering بين subpasses أو مع `VK_SUBPASS_EXTERNAL`.'
      },
      VkRenderingInfo: {
        sType: 'يعرف driver أن هذه العقدة تصف dynamic rendering الحالية.',
        pNext: 'امتدادات dynamic rendering الإضافية مثل multiview أو fragment shading rate metadata.',
        flags: 'أعلام تغير بعض semantics dynamic rendering الحالية.',
        renderArea: 'المستطيل الذي سيجري فيه الرسم فعليًا داخل attachments الحالية.',
        layerCount: 'عدد الطبقات التي سيغطيها الرسم لهذه العملية.',
        viewMask: 'قناع views المستخدم عند multiview rendering.',
        colorAttachmentCount: 'عدد color attachments المرفقة لهذه العملية.',
        pColorAttachments: 'مصفوفة color attachments الفعلية مع load/store/layout وimage views المرتبطة بها.',
        pDepthAttachment: 'وصف attachment العمق الحالية إن وجدت.',
        pStencilAttachment: 'وصف attachment الستنسل الحالية إن وجدت أو إذا كانت منفصلة عن العمق.'
      },
      VkAttachmentDescription: {
        flags: 'أعلام إضافية خاصة بالـ attachment قد تغير بعض semantics التوافق أو الإنشاء.',
        format: 'تنسيق attachment، وهو ما يجب أن يطابق image view المستخدمة فعليًا لاحقًا.',
        samples: 'عدد العينات لكل pixel في هذه الـ attachment.',
        loadOp: 'ماذا يحدث لمحتوى color/depth عند بداية المرور: load أو clear أو discard.',
        storeOp: 'هل ستُحفظ النتائج بعد نهاية المرور أم يمكن التخلص منها.',
        stencilLoadOp: 'السلوك نفسه لكن لمحتوى stencil عند البداية.',
        stencilStoreOp: 'السلوك نفسه لكن لمحتوى stencil عند النهاية.',
        initialLayout: 'الـ layout التي تتوقعها هذه الـ attachment قبل دخول المرور.',
        finalLayout: 'الـ layout التي ستخرج بها الـ attachment بعد انتهاء المرور.'
      }
    }[entityName]?.[name];

    if (exact) {
      return exact;
    }

    if (name === 'sType') {
      return 'حقل tag صريح تعرف به Vulkan نوع هذه البنية داخل parsing الداخلي وسلاسل `pNext`. من دونه لا تفسر driver بقية الحقول على أنها العقدة الصحيحة.';
    }
    if (name === 'pNext') {
      return 'سلسلة امتدادات اختيارية تربط بهذه البنية معلومات أو سلوكًا إضافيًا لا تحمله البنية الأساسية نفسها.';
    }
    if (name === 'flags') {
      return 'أعلام تغير semantics هذه البنية نفسها: ما الذي يسمح به هذا العقد أو ما السلوك الإضافي الذي يفعله driver عند القراءة.';
    }

    return '';
  }

  function buildVulkanEnumValueDescription(entity = null, row = {}) {
    const entityName = String(entity?.identity?.name || '').trim();
    const name = String(row?.name || '').trim();
    const value = String(row?.value || '').trim();
    const exact = {
      VkPipelineStageFlagBits: {
        VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT: 'يعني بداية نطاق التنفيذ قبل مراحل العمل الفعلي. لا يمثل مرحلة كتابة موارد بحد ذاته، لذلك لا ينبغي استخدامه كبديل كسول لكل الحواجز.',
        VK_PIPELINE_STAGE_DRAW_INDIRECT_BIT: 'يغطي قراءة أوامر draw/dispatch غير المباشرة من buffers قبل أن تتحول إلى أوامر رسم فعلية.',
        VK_PIPELINE_STAGE_VERTEX_INPUT_BIT: 'يغطي قراءات vertex/index buffers قبل دخول بيانات الرؤوس إلى الشيدر.',
        VK_PIPELINE_STAGE_VERTEX_SHADER_BIT: 'يغطي تنفيذ vertex shader وما يتبعه من accesses داخل هذه المرحلة.',
        VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT: 'يغطي تنفيذ fragment shader وقراءات الموارد التي تتم هناك مثل sampled images وuniforms.',
        VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT: 'يغطي اختبارات العمق/الستنسل المبكرة قبل shader output النهائي للـ color attachments.',
        VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT: 'يغطي اختبارات العمق/الستنسل المتأخرة بعد مرحلة fragment shader عند الحاجة.',
        VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT: 'يغطي مرحلة كتابة color attachments وعمليات blending المرتبطة بها.',
        VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT: 'يغطي تنفيذ compute shader وكل accesses التابعة له.',
        VK_PIPELINE_STAGE_TRANSFER_BIT: 'يغطي أوامر النسخ والمسح والـ blit والعمليات النقلية المشابهة.',
        VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT: 'يمثل نهاية نطاق التنفيذ بعد اكتمال المراحل السابقة، لكنه لا يعبّر عن access نوعية مثل القراءة أو الكتابة.',
        VK_PIPELINE_STAGE_HOST_BIT: 'يغطي accesses المضيف `CPU` عندما تدخل ضمن نموذج التزامن مع الجهاز.',
        VK_PIPELINE_STAGE_ALL_GRAPHICS_BIT: 'اختصار لكل مراحل الرسوم التقليدية. يفيد عند الحاجة إلى حاجز واسع، لكنه قد يكون أوسع من المطلوب فعليًا.',
        VK_PIPELINE_STAGE_ALL_COMMANDS_BIT: 'اختصار واسع لكل المراحل والأوامر المدعومة على queue المعنية، ويستخدم عندما لا يمكن تضييق النطاق بدقة.',
        VK_PIPELINE_STAGE_NONE: 'يعني عدم وجود مرحلة ضمن النطاق. يظهر عادة في بعض مسارات synchronization2 أو التهيئة الخاصة التي لا تملك producer/consumer stage فعلية.'
      },
      VkAccessFlagBits: {
        VK_ACCESS_INDIRECT_COMMAND_READ_BIT: 'يصف قراءة buffer تحتوي أوامر غير مباشرة مثل `vkCmdDrawIndirect` قبل تحويلها إلى عمل رسم أو حساب.',
        VK_ACCESS_INDEX_READ_BIT: 'يصف قراءة index buffer أثناء مرحلة vertex input.',
        VK_ACCESS_VERTEX_ATTRIBUTE_READ_BIT: 'يصف قراءة vertex buffer attributes أثناء تغذية بيانات الرؤوس.',
        VK_ACCESS_UNIFORM_READ_BIT: 'يصف قراءة بيانات uniform من buffers أو ما يعادلها داخل مراحل الشيدر.',
        VK_ACCESS_INPUT_ATTACHMENT_READ_BIT: 'يصف قراءة input attachment من fragment shader ضمن render pass أو ما يعادلها.',
        VK_ACCESS_SHADER_READ_BIT: 'يصف أي قراءة shader عامة من storage images/buffers أو sampled paths حسب السياق.',
        VK_ACCESS_SHADER_WRITE_BIT: 'يصف كتابة shader إلى storage images أو storage buffers أو موارد مشابهة قابلة للكتابة.',
        VK_ACCESS_COLOR_ATTACHMENT_READ_BIT: 'يصف قراءة color attachment من منطق المزج أو عمليات مشابهة داخل color attachment output.',
        VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT: 'يصف كتابة color attachment الفعلية إلى render target.',
        VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ_BIT: 'يصف قراءة depth/stencil attachment أثناء الاختبارات أو المسارات التي تحتاج محتواها.',
        VK_ACCESS_DEPTH_STENCIL_ATTACHMENT_WRITE_BIT: 'يصف كتابة depth/stencil attachment أثناء الاختبارات والعمليات التابعة.',
        VK_ACCESS_TRANSFER_READ_BIT: 'يصف قراءة مورد كمصدر عملية نقل أو نسخ.',
        VK_ACCESS_TRANSFER_WRITE_BIT: 'يصف كتابة مورد كهدف عملية نقل أو نسخ أو clear.',
        VK_ACCESS_HOST_READ_BIT: 'يصف قراءة CPU لذاكرة مشتركة أو mapped ضمن نموذج التزامن الصريح.',
        VK_ACCESS_HOST_WRITE_BIT: 'يصف كتابة CPU إلى ذاكرة مشتركة أو mapped قبل أن يراها الجهاز.',
        VK_ACCESS_MEMORY_READ_BIT: 'قناع واسع يعبّر عن أي قراءة ذاكرة عندما لا تريد أو لا تستطيع تحديد access أدق.',
        VK_ACCESS_MEMORY_WRITE_BIT: 'قناع واسع يعبّر عن أي كتابة ذاكرة عندما لا توجد access أدق أو عند الحاجة إلى تغطية عامة.',
        VK_ACCESS_NONE: 'يعني عدم وجود access من هذا الجانب، ويستخدم أحيانًا في حواجز لا تملك producer أو consumer access حقيقية.'
      },
      VkCommandBufferUsageFlagBits: {
        VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT: 'يعني أن الـ command buffer سيسجل ويُsubmit مرة واحدة تقريبًا، ما يسمح للـ driver بافتراضات أداء مناسبة لهذا النمط.',
        VK_COMMAND_BUFFER_USAGE_RENDER_PASS_CONTINUE_BIT: 'يعني أن هذا الـ secondary command buffer سيُنفذ داخل render pass أو rendering context موروث من primary buffer.',
        VK_COMMAND_BUFFER_USAGE_SIMULTANEOUS_USE_BIT: 'يعني أن الـ command buffer قد يُعاد submit له بينما ما زال submit سابق له قيد التنفيذ، وهو قيد أوسع لكنه قد يحد بعض افتراضات الأداء.'
      },
      VkCommandPoolCreateFlagBits: {
        VK_COMMAND_POOL_CREATE_TRANSIENT_BIT: 'يشير إلى أن command buffers من هذه الـ pool قصيرة العمر غالبًا، ما قد يسمح باستراتيجية تخصيص أخف أو أكثر مؤقتية.',
        VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT: 'يسمح بإعادة ضبط command buffers منفردة بدل إعادة ضبط الـ pool كلها دفعة واحدة.',
        VK_COMMAND_POOL_CREATE_PROTECTED_BIT: 'يجعل الـ pool تنتج buffers لمسارات protected execution حيث يدعم العتاد ذلك.'
      },
      VkImageLayout: {
        VK_IMAGE_LAYOUT_UNDEFINED: 'يعني أن المحتوى السابق غير مهم ويمكن تجاهله. تستخدمه عادة قبل أول كتابة أو clear عندما لا تحتاج الحفاظ على البيانات القديمة.',
        VK_IMAGE_LAYOUT_GENERAL: 'layout عامة تسمح بمزيج أوسع من accesses، لكنها ليست دائمًا الأكثر كفاءة لمسار متخصص.',
        VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL: 'layout مخصصة لكتابة color attachment داخل المسار الرسومي.',
        VK_IMAGE_LAYOUT_DEPTH_STENCIL_ATTACHMENT_OPTIMAL: 'layout مخصصة لاستخدام الصورة كـ depth/stencil attachment للقراءة/الكتابة المناسبة للاختبارات.',
        VK_IMAGE_LAYOUT_DEPTH_STENCIL_READ_ONLY_OPTIMAL: 'layout للقراءة فقط من depth/stencil دون الكتابة عليها.',
        VK_IMAGE_LAYOUT_SHADER_READ_ONLY_OPTIMAL: 'layout للموارد التي ستُقرأ من الشيدر مثل textures أو input attachments حسب السياق.',
        VK_IMAGE_LAYOUT_TRANSFER_SRC_OPTIMAL: 'layout تجعل الصورة مصدرًا لعمليات النسخ أو النقل.',
        VK_IMAGE_LAYOUT_TRANSFER_DST_OPTIMAL: 'layout تجعل الصورة هدفًا لعمليات النسخ أو clear أو النقل.',
        VK_IMAGE_LAYOUT_PRESENT_SRC_KHR: 'layout المطلوبة لتسليم صورة swapchain إلى مسار العرض.'
      },
      VkBufferUsageFlagBits: {
        VK_BUFFER_USAGE_TRANSFER_SRC_BIT: 'يعني أن buffer يمكن أن يكون مصدرًا لعمليات copy/transfer.',
        VK_BUFFER_USAGE_TRANSFER_DST_BIT: 'يعني أن buffer يمكن أن يكون هدفًا لعمليات copy/transfer.',
        VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT: 'يعني أن buffer يمكن ربطه كـ uniform buffer يقرأه الشيدر للبيانات الصغيرة أو الثابتة نسبيًا.',
        VK_BUFFER_USAGE_STORAGE_BUFFER_BIT: 'يعني أن buffer يمكن ربطه كـ storage buffer للقراءة أو الكتابة الأوسع من الشيدر.',
        VK_BUFFER_USAGE_INDEX_BUFFER_BIT: 'يعني أن buffer سيغذي مرحلة vertex input كـ index source.',
        VK_BUFFER_USAGE_VERTEX_BUFFER_BIT: 'يعني أن buffer سيغذي vertex attributes أثناء الرسم.',
        VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT: 'يعني أن buffer سيحمل أوامر draw/dispatch غير المباشرة.'
      },
      VkImageUsageFlagBits: {
        VK_IMAGE_USAGE_TRANSFER_SRC_BIT: 'يسمح للصورة أن تُقرأ كمصدر في copy/blit/resolve paths.',
        VK_IMAGE_USAGE_TRANSFER_DST_BIT: 'يسمح للصورة أن تكون هدف copy/clear/blit/resolve paths.',
        VK_IMAGE_USAGE_SAMPLED_BIT: 'يسمح بقراءة الصورة من الشيدر كـ sampled image.',
        VK_IMAGE_USAGE_STORAGE_BIT: 'يسمح للشيدر بقراءة/كتابة الصورة عبر storage image semantics.',
        VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT: 'يسمح باستخدام الصورة كـ color render target.',
        VK_IMAGE_USAGE_DEPTH_STENCIL_ATTACHMENT_BIT: 'يسمح باستخدام الصورة كـ depth/stencil target.',
        VK_IMAGE_USAGE_TRANSIENT_ATTACHMENT_BIT: 'يشير إلى أن attachment مؤقتة غالبًا ولا تحتاج بقاء طويل العمر خارج المرور الحالي أو القريب.',
        VK_IMAGE_USAGE_INPUT_ATTACHMENT_BIT: 'يسمح بقراءة الصورة كـ input attachment داخل fragment shader.'
      },
      VkDescriptorType: {
        VK_DESCRIPTOR_TYPE_SAMPLER: 'binding يحمل sampler فقط دون image view مرتبطة معها.',
        VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER: 'binding يحمل image view مع sampler معًا، وهو الشكل الشائع لقراءة textures.',
        VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE: 'binding يحمل image view مقروءة بالشيدر دون sampler مدمجة.',
        VK_DESCRIPTOR_TYPE_STORAGE_IMAGE: 'binding يحمل image view قابلة للقراءة والكتابة وفق storage image semantics.',
        VK_DESCRIPTOR_TYPE_UNIFORM_TEXEL_BUFFER: 'binding يحمل texel buffer للقراءة المنسقة من الشيدر.',
        VK_DESCRIPTOR_TYPE_STORAGE_TEXEL_BUFFER: 'binding يحمل texel buffer قابلًا للقراءة/الكتابة وفق storage semantics.',
        VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER: 'binding يحمل buffer موحدًا للقراءة فقط غالبًا من الشيدر.',
        VK_DESCRIPTOR_TYPE_STORAGE_BUFFER: 'binding يحمل storage buffer للقراءة أو الكتابة الأوسع من الشيدر.',
        VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER_DYNAMIC: 'مثل uniform buffer لكن الـ offset النهائي يحدد وقت bind عبر dynamic offsets.',
        VK_DESCRIPTOR_TYPE_STORAGE_BUFFER_DYNAMIC: 'مثل storage buffer لكن الـ offset النهائي يحدد وقت bind عبر dynamic offsets.',
        VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT: 'binding يقرأ attachment من نفس render path كـ input attachment.'
      },
      VkPipelineBindPoint: {
        VK_PIPELINE_BIND_POINT_GRAPHICS: 'يربط أو يفسر state على أنها رسومية، أي draw pipeline.',
        VK_PIPELINE_BIND_POINT_COMPUTE: 'يربط أو يفسر state على أنها compute pipeline.',
        VK_PIPELINE_BIND_POINT_RAY_TRACING_KHR: 'يربط أو يفسر state على أنها ray tracing pipeline حيث تدعم الإضافة.'
      },
      VkSharingMode: {
        VK_SHARING_MODE_EXCLUSIVE: 'المورد مملوك لعائلة queue واحدة في كل لحظة. غالبًا هذا أبسط أو أسرع، لكنه قد يحتاج ownership transfer عند الانتقال بين queues.',
        VK_SHARING_MODE_CONCURRENT: 'المورد يعلن مسبقًا إمكانية الوصول من عدة queue families دون ownership transfer صريح لكل انتقال، مقابل عقد أوسع وربما كلفة أعلى.'
      },
      VkAttachmentLoadOp: {
        VK_ATTACHMENT_LOAD_OP_LOAD: 'يحافظ على محتوى attachment السابق ويبدأ المرور من هذه البيانات الحالية.',
        VK_ATTACHMENT_LOAD_OP_CLEAR: 'يمسح attachment عند البداية بقيمة clear value المقدمة.',
        VK_ATTACHMENT_LOAD_OP_DONT_CARE: 'يعلن أن المحتوى السابق غير مهم ويمكن تجاهله عند البداية.'
      },
      VkAttachmentStoreOp: {
        VK_ATTACHMENT_STORE_OP_STORE: 'يحفظ نتائج الكتابة بعد نهاية المرور لاستخدام لاحق مثل العرض أو القراءة.',
        VK_ATTACHMENT_STORE_OP_DONT_CARE: 'يعلن أن المحتوى الناتج بعد نهاية المرور غير مهم ويمكن التخلص منه.'
      }
    }[entityName]?.[name];

    if (exact) {
      return exact;
    }

    if (value === '0' && /FLAG_BITS|FLAGS|ACCESS|STAGE/.test(entityName.toUpperCase())) {
      return 'هذه القيمة تعني غياب أي بتات أو accesses أو stages ضمن هذا الحقل، وتستخدم عندما يكون النطاق المقصود فارغًا عمدًا.';
    }

    return '';
  }

  function buildVulkanDetailDescription(entity = null, row = {}, section = '') {
    if (!isVulkanLibraryEntity(entity)) {
      return '';
    }

    if (section === 'parameters') {
      return buildVulkanFunctionParameterDescription(entity?.identity?.name || '', row);
    }
    if (section === 'fields') {
      return buildVulkanStructFieldDescription(entity, row);
    }
    if (section === 'values') {
      return buildVulkanEnumValueDescription(entity, row);
    }

    return '';
  }

  function normalizeVulkanDetailRows(entity = null, rows = [], section = '') {
    if (!isVulkanLibraryEntity(entity) || !Array.isArray(rows) || !rows.length) {
      return rows;
    }

    return rows.map((row) => {
      const current = String(row?.descriptionArabic || row?.description || '').trim();
      if (!isLowValueReferenceDetailText(current)) {
        return row;
      }

      const replacement = buildVulkanDetailDescription(entity, row, section);
      if (!replacement) {
        return row;
      }

      return {
        ...row,
        descriptionArabic: replacement
      };
    });
  }

  function normalizeVulkanExecutionNotes(entity = null) {
    if (!isVulkanLibraryEntity(entity)) {
      return entity;
    }

    const kindId = String(entity?.kind?.id || '').trim();
    const name = String(entity?.identity?.name || '').trim();
    const details = {...(entity.details || {})};
    const usage = Array.isArray(details.usage) ? details.usage.filter(Boolean) : [];
    const notes = Array.isArray(details.notes) ? details.notes.filter(Boolean) : [];

    if (kindId === 'functions' && name === 'vkQueueSubmit' && usage.every((entry) => isLowValueReferenceDetailText(entry))) {
      details.usage = [
        'هذه الدالة لا تنفذ الأوامر وقت استدعائها من CPU؛ بل تدفع batches جاهزة إلى queue لتبدأ GPU تنفيذها عندما تتحقق اعتماداتها.',
        'المعنى العملي لـ `pSubmits` هو ربط ثلاث طبقات معًا: ما الذي يجب انتظاره، وما command buffers التي ستنفذ، وما الإشارات التي ستعلن اكتمال العمل بعده.',
        'إذا فُهمت `pWaitDstStageMask` فهمًا سطحيًا فقد يصبح الانتظار أوسع من اللازم أو أضيق من الخطر الحقيقي، وهذا ينعكس مباشرة على correctness والأداء.'
      ];
    }

    if (kindId === 'structures' && name === 'VkSubmitInfo' && usage.every((entry) => isLowValueReferenceDetailText(entry))) {
      details.usage = [
        'هذه البنية تمثل batch submit واحدة. إذا غيّرت wait semaphores أو stage masks أو command buffers فأنت تغيّر من سيبدأ متى، وليس مجرد "حقول إدارية".',
        'المصفوفات هنا يجب أن تكون متسقة: عدد wait semaphores يجب أن يطابق عدد stage masks المقابلة، وعدد command buffers يحدد العمل الذي سيدخل queue فعليًا.'
      ];
    }

    if (kindId === 'structures' && name === 'VkImageMemoryBarrier' && notes.every((entry) => isLowValueReferenceDetailText(entry))) {
      details.notes = [
        'هذه البنية لا تعالج التزامن فقط؛ بل غالبًا تمثل أيضًا انتقال layout. لذلك الخطأ هنا قد ينتج artifact بصريًا أو validation error أو قراءة لبيانات قديمة.',
        'ربط `srcAccessMask/dstAccessMask` مع `srcStageMask/dstStageMask` في الأمر الذي يستخدم الحاجز هو الذي يحدد scope الحقيقي، لا هذه الحقول وحدها.'
      ];
    }

    if (kindId === 'variables' && name === 'VkCommandBuffer' && notes.every((entry) => isLowValueReferenceDetailText(entry))) {
      details.notes = [
        'لا تخلط بين command buffer وبين queue: الأول يسجل العمل، والثانية تنفذه بعد submit.',
        'عمر الـ command buffer مرتبط بـ command pool وسياسة reset/recycle الخاصة بها، لا بمجرد انتهاء draw واحدة.'
      ];
    }

    return {
      ...entity,
      details
    };
  }

  function buildReferenceEntityMeaningFallback(entity = null) {
    if (isVulkanLibraryEntity(entity)) {
      const semanticEntry = getVulkanEntitySemanticEntry(entity);
      if (semanticEntry?.meaning) {
        return semanticEntry.meaning;
      }
    }

    const kindId = String(entity?.kind?.id || '').trim();
    const name = String(entity?.identity?.name || '').trim();
    const libraryLabel = entity?.library?.displayNameArabic || entity?.library?.displayName || 'هذه المكتبة';

    if (kindId === 'functions') {
      const action = getReferenceFunctionAction(name);
      if (action === 'detect') {
        return `هذه دالة فحص من ${libraryLabel} تتحقق من نوع البيانات أو من مطابقة المورد قبل أن يختار التطبيق مسار التحميل أو المعالجة المناسب.`;
      }
      if (action === 'create') {
        return `هذه دالة إنشاء أو فتح من ${libraryLabel} تبدأ موردًا أو نطاق عمل جديدًا ثم تعيد ما يحتاجه التطبيق ليبني عليه الخطوة التالية.`;
      }
      if (action === 'release') {
        return `هذه دالة إنهاء أو تحرير من ${libraryLabel} تنهي عمر المورد أو النطاق الحالي حتى لا يبقى مفتوحًا أو محجوزًا بلا داع.`;
      }
      if (action === 'enumerate') {
        return `هذه دالة تعداد من ${libraryLabel} تكشف العناصر أو القدرات المدعومة أولًا قبل أن يختار التطبيق أيها سيستخدم فعليًا.`;
      }
      if (action === 'query') {
        return `هذه دالة استعلام من ${libraryLabel} تقرأ معلومات أو مقاييس أو مقابض أو حالة فعلية بدل التخمين أو الاعتماد على قيم ثابتة.`;
      }
      if (action === 'configure') {
        return `هذه دالة ضبط من ${libraryLabel} تغيّر إعدادًا أو خاصية أو سلوكًا في مورد قائم بدل إنشاء مورد جديد.`;
      }
      if (action === 'execute') {
        return `هذه دالة تنفيذ من ${libraryLabel} تدفع العمل الفعلي إلى خطوة رسم أو عرض أو إرسال أو معالجة داخل المسار الحالي.`;
      }
      return `هذه دالة من ${libraryLabel} تمثل خطوة تشغيلية رسمية داخل الكود، لا مجرد اسم نظري أو تعريف ثابت.`;
    }

    if (kindId === 'types' || kindId === 'structures' || kindId === 'variables') {
      return `هذا العنصر ليس اسمًا شكليًا فقط؛ بل نوعًا أو بنية أو كيانًا رسميًا من ${libraryLabel} يحمل بيانات أو يربط موارد أو يحدد شكل العقد الذي تقرؤه الواجهة أثناء التنفيذ.`;
    }

    if (kindId === 'enums' || kindId === 'constants' || kindId === 'macros') {
      return `هذا العنصر قيمة أو رمز رسمي من ${libraryLabel} يحدد فرعًا تنفيذيًا أو خيارًا أو صياغة ثابتة تحتاجها الواجهة بدل رقم أو نص حرفي.`;
    }

    return `هذا العنصر جزء رسمي من ${libraryLabel} ويملك معنى برمجيًا مباشرًا داخل المسار الذي يظهر فيه.`;
  }

  function buildReferenceEntityPurposeFallback(entity = null) {
    if (isVulkanLibraryEntity(entity)) {
      const semanticEntry = getVulkanEntitySemanticEntry(entity);
      if (semanticEntry?.purpose) {
        return semanticEntry.purpose;
      }
    }

    const kindId = String(entity?.kind?.id || '').trim();
    const action = getReferenceFunctionAction(entity?.identity?.name || '');

    if (kindId === 'functions') {
      if (action === 'detect') return 'وُجدت لأن التطبيق يحتاج التحقق من نوع البيانات أو حالتها قبل أن يقرر هل يحمّلها أو يمررها إلى مسار آخر.';
      if (action === 'create') return 'وُجدت لأن إنشاء الموارد أو فتحها أو بدء النطاقات يحتاج خطوة صريحة تملك عقدًا واضحًا للنجاح والفشل وعمر المورد.';
      if (action === 'release') return 'وُجدت لأن المورد أو النطاق لا ينتهي تلقائيًا دائمًا، ويحتاج التطبيق إلى خطوة صريحة لتحريره أو إغلاقه.';
      if (action === 'enumerate') return 'وُجدت لأن الواجهة لا تفترض ما هو متاح مسبقًا، بل تكشف القدرات أو العناصر المدعومة أولًا ثم تترك التطبيق يختار.';
      if (action === 'query') return 'وُجدت لأن التطبيق يحتاج معلومات دقيقة من الواجهة أو من المورد نفسه بدل تخمينها أو تكرارها يدويًا.';
      if (action === 'configure') return 'وُجدت لأن تعديل السلوك أو الخصائص يجب أن يبقى صريحًا بدل تغييرات ضمنية يصعب تتبعها.';
      return 'وُجدت لأن هذه الخطوة التنفيذية تمثل جزءًا فعليًا من دورة حياة المورد أو من مسار العمل الرسمي داخل المكتبة.';
    }

    if (kindId === 'types' || kindId === 'structures' || kindId === 'variables') {
      return 'وُجد هذا النوع أو الكيان حتى يبقى شكل البيانات والملكية والعلاقة بين القيم واضحة للواجهة وللمبرمج معًا.';
    }

    return 'وُجد هذا الرمز حتى يبقى الاختيار أو الوصف البرمجي صريحًا ومقروءًا بدل الاعتماد على قيم حرفية أو مواضع ضمنية.';
  }

  function buildReferenceEntityWhyUseFallback(entity = null) {
    if (isVulkanLibraryEntity(entity)) {
      const semanticEntry = getVulkanEntitySemanticEntry(entity);
      if (semanticEntry?.whyUse) {
        return semanticEntry.whyUse;
      }
    }

    const kindId = String(entity?.kind?.id || '').trim();
    const action = getReferenceFunctionAction(entity?.identity?.name || '');

    if (kindId === 'functions') {
      if (action === 'detect') return 'يستخدمها المبرمج عندما يريد اتخاذ قرار عملي مبكر: هل هذه البيانات أو هذه الحالة تطابق ما يتوقعه المسار التالي أم لا.';
      if (action === 'create') return 'يستخدمها المبرمج عندما يحتاج موردًا أو نطاق عمل فعليًا قبل أن يستطيع الرسم أو القراءة أو التحديث أو الإرسال.';
      if (action === 'release') return 'يستخدمها المبرمج عند نهاية عمر المورد أو عند إعادة البناء حتى يبقي الموارد والحالة منضبطة.';
      if (action === 'enumerate') return 'يستخدمها المبرمج قبل الاختيار أو التخصيص حتى يعرف عدد العناصر المتاحة أو خصائصها الحقيقية.';
      if (action === 'query') return 'يستخدمها المبرمج عندما يحتاج معلومة صحيحة من المصدر نفسه لأن استمرار الكود يعتمد عليها.';
      if (action === 'configure') return 'يستخدمها المبرمج لتثبيت السلوك المطلوب أو تحديث الخاصية الصحيحة في مورد قائم.';
      return 'يستخدمها المبرمج لأن هذه الدالة تمثل خطوة رسمية لا يمكن استبدالها بوصف نظري أو بقيمة ثابتة فقط.';
    }

    if (kindId === 'types' || kindId === 'structures' || kindId === 'variables') {
      return 'يستخدمه المبرمج عندما يحتاج هذا الشكل الرسمي للبيانات أو هذا الكيان نفسه كي يمرر المورد أو النتيجة أو الإعداد بالطريقة التي تتوقعها الواجهة.';
    }

    return 'يستخدمه المبرمج عندما يحتاج القيمة أو الرمز الرسمي نفسه حتى يحدد السلوك أو الحالة أو الفرع المطلوب بوضوح.';
  }

  function buildReferenceEntityCarriedValueFallback(entity = null) {
    if (isVulkanLibraryEntity(entity)) {
      const semanticCarried = buildVulkanEntityCarriedValueFallback(entity);
      if (semanticCarried) {
        return semanticCarried;
      }
    }

    const returnType = String(entity?.signature?.returnType || '').trim();
    const kindId = String(entity?.kind?.id || '').trim();

    if (kindId !== 'functions') {
      return '';
    }

    if (!returnType || returnType === 'void') {
      return 'أثر هذا الاستدعاء يظهر في المورد أو الحالة التي يغيرها داخل الواجهة، لا في قيمة راجعة مستقلة.';
    }
    if (/bool/i.test(returnType)) {
      return 'يعيد قيمة منطقية توضّح هل الشرط أو الفحص أو الاكتشاف نجح فعلًا أم لا.';
    }
    if (/VkResult/.test(returnType)) {
      return 'يعيد حالة نجاح أو فشل رسمية من Vulkan، لذلك يجب تفسير النتيجة قبل افتراض أن الخطوة التالية آمنة.';
    }
    if (/\*/.test(returnType)) {
      return `يعيد مؤشرًا أو موردًا من النوع ${returnType} يمثل الكائن الناتج أو البيانات التي طلبها التطبيق.`;
    }
    return `يعيد قيمة من النوع ${returnType} تمثل نتيجة هذه الخطوة أو البيانات التي استعلم عنها التطبيق.`;
  }

  function normalizeReferenceEntitySummary(entity = null) {
    if (!entity) {
      return entity;
    }

    const summary = {...(entity.summary || {})};
    if (!/[\u0600-\u06FF]/.test(String(summary.actualTranslationArabic || '').trim())) {
      summary.actualTranslationArabic = '';
    }
    if (isLowValueReferenceSummaryText(summary.actualMeaningArabic, 'meaning', entity)) {
      summary.actualMeaningArabic = buildReferenceEntityMeaningFallback(entity);
    }
    if (isLowValueReferenceSummaryText(summary.purposeArabic, 'purpose', entity)) {
      summary.purposeArabic = buildReferenceEntityPurposeFallback(entity);
    }
    if (isLowValueReferenceSummaryText(summary.whyUseArabic, 'whyUse', entity)) {
      summary.whyUseArabic = buildReferenceEntityWhyUseFallback(entity);
    }
    if (isLowValueReferenceSummaryText(summary.carriedValueArabic, 'carriedValue', entity)) {
      summary.carriedValueArabic = buildReferenceEntityCarriedValueFallback(entity);
    }

    let normalizedEntity = {
      ...entity,
      summary
    };

    if (isVulkanLibraryEntity(normalizedEntity)) {
      normalizedEntity = {
        ...normalizedEntity,
        details: {
          ...(normalizedEntity.details || {}),
          parameters: normalizeVulkanDetailRows(normalizedEntity, normalizedEntity.details?.parameters || [], 'parameters'),
          fields: normalizeVulkanDetailRows(normalizedEntity, normalizedEntity.details?.fields || [], 'fields'),
          values: normalizeVulkanDetailRows(normalizedEntity, normalizedEntity.details?.values || [], 'values')
        }
      };
      normalizedEntity = normalizeVulkanExecutionNotes(normalizedEntity);
    }

    return normalizedEntity;
  }

  async function showReferenceHub(options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const route = 'ref';
    api.setCurrentView('reference-hub');
    api.syncRouteHistory(route, {...options, deferRecentVisitCapture: true});

    try {
      const manifest = await loadCanonicalReferenceManifest();
      const templates = getReferenceTemplateEngine();
      const html = templates.renderHub
        ? templates.renderHub(manifest, api)
        : renderReferenceFallbackPage('المرجع المعياري', 'لم تتوفر قوالب العرض الخاصة بالمرجع الجديد.');
      setReferencePageContent(html);
      document.title = 'المرجع المعياري - ArabicVulkan';
      captureReferenceRecentVisit(route);
    } catch (error) {
      console.error('Failed to load canonical reference manifest:', error);
      setReferencePageContent(renderReferenceFallbackPage('تعذر فتح المرجع المعياري', 'فشل تحميل الفهرس العام للطبقة المرجعية الجديدة.'));
      captureReferenceRecentVisit(route);
    }
  }

  async function showReferenceLibraryIndex(libraryId = '', options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const normalizedLibraryId = String(libraryId || '').trim();
    if (normalizedLibraryId === 'ffmpeg') {
      await api.ensureUiSegment('ffmpegSearch');
    }
    const route = `ref/${encodeURIComponent(normalizedLibraryId)}`;
    api.setCurrentView(`reference-library-${normalizedLibraryId}`);
    api.syncRouteHistory(route, {...options, deferRecentVisitCapture: true});

    try {
      const indexData = await loadCanonicalReferenceLibraryIndex(normalizedLibraryId);
      const templates = getReferenceTemplateEngine();
      const html = templates.renderLibraryIndex
        ? templates.renderLibraryIndex(indexData, api)
        : renderReferenceFallbackPage('فهرس المكتبة', 'لم تتوفر قوالب عرض فهرس المكتبة.');
      setReferencePageContent(html);
      document.title = `${indexData?.library?.displayNameArabic || indexData?.library?.displayName || normalizedLibraryId} - ArabicVulkan`;
      captureReferenceRecentVisit(route);
    } catch (error) {
      console.error(`Failed to load canonical reference library index for ${normalizedLibraryId}:`, error);
      setReferencePageContent(renderReferenceFallbackPage('تعذر فتح فهرس المكتبة', `فشل تحميل مكتبة ${normalizedLibraryId}.`));
      captureReferenceRecentVisit(route);
    }
  }

  async function showReferenceKindIndex(libraryId = '', kindId = '', options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const normalizedLibraryId = String(libraryId || '').trim();
    const normalizedKindId = String(kindId || '').trim();
    if (normalizedLibraryId === 'ffmpeg') {
      await api.ensureUiSegment('ffmpegSearch');
    }
    const route = `ref/${encodeURIComponent(normalizedLibraryId)}/${encodeURIComponent(normalizedKindId)}`;
    api.setCurrentView(`reference-kind-${normalizedLibraryId}-${normalizedKindId}`);
    api.syncRouteHistory(route, {...options, deferRecentVisitCapture: true});

    try {
      const indexData = await loadCanonicalReferenceKindIndex(normalizedLibraryId, normalizedKindId);
      const templates = getReferenceTemplateEngine();
      const html = templates.renderKindIndex
        ? templates.renderKindIndex(indexData, api)
        : renderReferenceFallbackPage('فهرس القسم', 'لم تتوفر قوالب عرض فهرس القسم المرجعي.');
      setReferencePageContent(html);
      document.title = `${indexData?.kind?.displayNameArabic || indexData?.kind?.displayName || normalizedKindId} - ${indexData?.library?.displayNameArabic || indexData?.library?.displayName || normalizedLibraryId} - ArabicVulkan`;
      captureReferenceRecentVisit(route);
    } catch (error) {
      console.error(`Failed to load canonical reference kind index for ${normalizedLibraryId}/${normalizedKindId}:`, error);
      setReferencePageContent(renderReferenceFallbackPage('تعذر فتح فهرس القسم', `فشل تحميل القسم ${normalizedKindId} من المكتبة ${normalizedLibraryId}.`));
      captureReferenceRecentVisit(route);
    }
  }

  async function showReferenceEntity(libraryId = '', kindId = '', slug = '', options = {}) {
    const content = document.getElementById('mainContent');
    if (!content) {
      return;
    }

    const normalizedLibraryId = String(libraryId || '').trim();
    const normalizedKindId = String(kindId || '').trim();
    const normalizedSlug = String(slug || '').trim();
    if (normalizedLibraryId === 'ffmpeg') {
      await api.ensureUiSegment('ffmpegSearch');
    }
    const route = `ref/${encodeURIComponent(normalizedLibraryId)}/${encodeURIComponent(normalizedKindId)}/${encodeURIComponent(normalizedSlug)}`;
    api.setCurrentView(`reference-entity-${normalizedLibraryId}-${normalizedKindId}-${normalizedSlug}`);
    api.syncRouteHistory(route, {...options, deferRecentVisitCapture: true});

    try {
      const [entity, enrichment, semanticOverrides] = await Promise.all([
        loadCanonicalReferenceEntity(normalizedLibraryId, normalizedKindId, normalizedSlug),
        loadCanonicalReferenceOfficialLinks(normalizedLibraryId),
        loadVulkanSemanticOverrides(normalizedLibraryId)
      ]);
      if (!entity) {
        setReferencePageContent(renderReferenceFallbackPage('تعذر فتح صفحة المرجع', `العنصر ${normalizedSlug} غير موجود في القسم ${normalizedKindId}.`));
        captureReferenceRecentVisit(route);
        return;
      }
      const enrichedEntity = normalizeReferenceEntitySummary(
        withSynthesizedReferenceExample(
          mergeReferenceEntitySemanticOverrides(
            mergeReferenceEntityEnrichment(entity, enrichment),
            semanticOverrides
          )
        )
      );
      const templates = getReferenceTemplateEngine();
      const html = templates.renderEntityPage
        ? templates.renderEntityPage(enrichedEntity, api)
        : renderReferenceFallbackPage('صفحة المرجع', 'لم تتوفر قوالب العرض الخاصة بصفحة المرجع.');
      setReferencePageContent(html);
      document.title = `${enrichedEntity?.identity?.name || normalizedSlug} - ${enrichedEntity?.library?.displayNameArabic || enrichedEntity?.library?.displayName || normalizedLibraryId} - ArabicVulkan`;
      captureReferenceRecentVisit(route);
    } catch (error) {
      console.error(`Failed to load canonical reference entity for ${normalizedLibraryId}/${normalizedKindId}/${normalizedSlug}:`, error);
      setReferencePageContent(renderReferenceFallbackPage('تعذر فتح صفحة المرجع', `فشل تحميل العنصر ${normalizedSlug} من القسم ${normalizedKindId}.`));
      captureReferenceRecentVisit(route);
    }
  }

  global.__ARABIC_VULKAN_REFERENCE_RUNTIME__ = {
    configure,
    showReferenceHub,
    showReferenceLibraryIndex,
    showReferenceKindIndex,
    showReferenceEntity
  };
})(window);
