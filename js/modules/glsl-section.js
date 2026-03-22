window.__ARABIC_VULKAN_GLSL_SECTION__ = (() => {
  const {
    pickRandomEntries: pickRandomExampleEntries,
    renderLibraryExamplePreviewCard,
    renderLibraryExamplePreviewSection
  } = window.__ARABIC_VULKAN_UI_BLOCKS__ || {};
  const {
    renderSidebarExampleGroup,
    renderSidebarNavItem,
    renderSidebarSectionShell
  } = window.__ARABIC_VULKAN_SIDEBAR_BLOCKS__ || {};
  const {
    collapseAllSidebarClusters,
    collapseAllSidebarNavGroups,
    collapseAllSidebarSections,
    glslExpandedExampleGroups,
    glslExpandedReferenceSections
  } = window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__ || {};

  function getGlslExamplePreviewEntries(options = {}) {
    const entries = (glslReadyExamples || []).map((example) => ({
      id: example.id,
      title: localizeGlslStageLabels(example.title),
      summary: summarizeExamplePreviewText(localizeGlslStageLabels(example.goal || example.expectedResult || ''), 22),
      previewHtml: renderGlslReadyExamplePreview(example),
      openAction: `showGlslExample('${escapeAttribute(example.id)}')`
    }));

    if (options.randomize) {
      return pickRandomExampleEntries(entries, options.limit || entries.length);
    }

    return typeof options.limit === 'number' && options.limit > 0
      ? entries.slice(0, options.limit)
      : entries;
  }

  function renderGlslExamplesPreviewSection(options = {}) {
    return renderLibraryExamplePreviewSection({
      sectionId: options.sectionId || 'glsl-examples',
      title: options.title || 'أمثلة',
      intro: options.intro || getExamplePreviewIntro('glsl'),
      browseAction: options.browseAction || 'showGlslExamplesIndex()',
      browseLabel: options.browseLabel || 'كل أمثلة لغة التظليل',
      examples: getGlslExamplePreviewEntries({
        limit: options.limit,
        randomize: options.randomize
      })
    });
  }

  function renderGlslReadyExamplesIndexSection(options = {}) {
    const examples = getGlslExamplePreviewEntries({
      limit: options.limit,
      randomize: options.randomize
    });
    if (!examples.length) {
      return '';
    }

    return `
      <section class="category-section"${options.sectionId ? ` id="${escapeAttribute(options.sectionId)}"` : ''}>
        <h2>أمثلة جاهزة</h2>
        <div class="content-card prose-card sdl3-ready-examples-intro">
          <p>${escapeHtml(options.intro || getExamplePreviewIntro('glslReadyIndex'))}</p>
        </div>
        <div class="sdl3-ready-examples-grid">
          ${examples.map((entry) => renderLibraryExamplePreviewCard(entry)).join('')}
        </div>
      </section>
    `;
  }

  const GLSL_EXAMPLE_SECTIONS = Object.freeze([
    {
      id: 'fundamentals',
      icon: '🧠',
      title: 'أمثلة تعليمية أساسية',
      englishTitle: 'Shader Fundamentals',
      description: 'هذا القسم يجمع الأمثلة التي تشرح بداية الشيدر: كيف يدخل الموضع، وكيف يمر إلى `gl_Position`، وكيف يخرج اللون أو التدرج من المراحل الأساسية.',
      educationalGoal: 'بناء فهم ثابت للمراحل الأولى قبل الانتقال إلى المواد والمؤثرات والواجهات التفاعلية.',
      exampleKinds: 'أمثلة رؤوس بسيطة، ألوان ثابتة، تدرجات، وقيم موحدة.',
      distinction: 'يمتاز عن بقية الأقسام بأنه لا يفترض معرفة مسبقة بالمواد أو الـ post processing أو التكامل مع Dear ImGui.',
      prerequisites: ['فهم أولي لمعنى `vertex shader` و`fragment shader`.', 'معرفة بسيطة بفكرة المداخل والمخارج بين المراحل.'],
      introVisual: 'صورة تمهيدية لقيم تمر من دخل الرؤوس إلى الخرج اللوني عبر مثلث واضح بتدرج مبسط يشرح أين تبدأ البيانات وأين تنتهي.',
      internalLinkLabel: 'قسم الأمثلة التعليمية الأساسية',
      docLink: 'doc://examples/fundamentals'
    },
    {
      id: 'glsl-vulkan-integration',
      icon: '🧩',
      title: 'أمثلة الدمج بين GLSL وVulkan',
      englishTitle: 'GLSL + Vulkan Integration',
      description: 'يشرح هذا القسم كيف تتحول ملفات الشيدر النصية إلى إس بي آي آر-في، وكيف ترتبط `layout(set, binding)` و`location` بخط الأنابيب الفعلي داخل التطبيق.',
      educationalGoal: 'ربط لغة التظليل بالبنية الحقيقية للمشروع بدل إبقائها كملفات معزولة.',
      exampleKinds: 'ترجمة الشيدر، ربط الواصفات، بناء الواجهات الصريحة بين الشيدر والتطبيق.',
      distinction: 'هذا القسم يختلف عن بقية الأقسام لأنه يشرح العلاقة مع `CPU Side` ونظام البناء وخط الأنابيب لا الناتج البصري فقط.',
      prerequisites: ['فهم الأساسيات العامة للغة التظليل.', 'معرفة أولية بمفهوم `descriptor set` و`pipeline`.'],
      introVisual: 'مخطط ثلاثي يوضح: ملف الشيدر النصي ← إس بي آي آر-في ← ربط داخل `VkShaderModule` وخط الأنابيب.',
      internalLinkLabel: 'قسم أمثلة الدمج بين GLSL وVulkan',
      docLink: 'doc://examples/integration/glsl-vulkan'
    },
    {
      id: 'materials-surface',
      icon: '🎨',
      title: 'أمثلة المواد والخامات',
      englishTitle: 'Materials & Surface Appearance',
      description: 'يركز هذا القسم على شكل المادة النهائي: اللون الأساسي، الخامة، الخصائص السطحية، وكيف تُقرأ الموارد لتكوين مظهر المادة.',
      educationalGoal: 'تعليم القارئ كيف ينتقل من لون ثابت إلى مادة كاملة قابلة للفحص والضبط.',
      exampleKinds: 'Texture sampling، PBR، محررات المواد، ومعاينات الخامات.',
      distinction: 'التركيز هنا على هوية السطح نفسه، لا على المؤثرات اللاحقة أو المؤثرات الحجمية.',
      prerequisites: ['معرفة `sampler2D` و`uniform` و`UV`.', 'فهم أولي للفرق بين اللون المنتشر والانعكاس.'],
      introVisual: 'لقطة لسطح أو كرة مادة مع لوحة Inspector توضح كيف تؤثر الخامات وخصائص المادة على النتيجة.',
      internalLinkLabel: 'قسم أمثلة المواد والخامات',
      docLink: 'doc://examples/materials'
    },
    {
      id: 'surface-detail',
      icon: '🪨',
      title: 'أمثلة تفاصيل السطح',
      englishTitle: 'Surface Detail',
      description: 'يعالج هذا القسم كيف نضيف تفاصيل بصرية دقيقة إلى السطح من دون زيادة عدد المضلعات، مثل normal mapping وأوضاع فحص اتجاهات السطح.',
      educationalGoal: 'شرح الفرق بين هندسة النموذج الحقيقية وبين التفاصيل المحاكاة داخل الشيدر.',
      exampleKinds: 'Normal Mapping، Debug للنورمالز، وفحص texture slots.',
      distinction: 'يختلف عن قسم المواد لأن التركيز هنا على إدراك السطح واتجاهاته الدقيقة لا على خامة اللون وحدها.',
      prerequisites: ['فهم `normal` واتجاه الضوء.', 'معرفة أولية بـ tangent space أو على الأقل سبب الحاجة إلى normal map.'],
      introVisual: 'مقارنة قبل/بعد بين سطح مسطح وآخر يملك تفاصيل بصرية من normal map مع نافذة Debug للنورمالز.',
      internalLinkLabel: 'قسم أمثلة تفاصيل السطح',
      docLink: 'doc://examples/surface-detail'
    },
    {
      id: 'lighting-shading',
      icon: '💡',
      title: 'أمثلة الإضاءة والتظليل',
      englishTitle: 'Lighting & Shading',
      description: 'يضم هذا القسم النماذج التي تغيّر كيف يستجيب السطح للضوء، من التظليل المرسوم فنيًا إلى المقارنات التعليمية في توزيع الظلال والحواف.',
      educationalGoal: 'فهم كيف تؤثر معادلات الإضاءة وأوضاع التظليل على طابع المشهد النهائي.',
      exampleKinds: 'Stylized / Toon Shading، مقارنة الانحياز في الظلال، ولوحات تحكم الإضاءة.',
      distinction: 'هذا القسم يهتم بنموذج الإضاءة نفسه، لا بإدارة الخامات أو بتأثيرات الشاشة الشاملة.',
      prerequisites: ['معرفة الاتجاهات `normal` و`light direction`.', 'فهم أولي لمفهوم الظل أو التظليل المرحلي.'],
      introVisual: 'صورة تقارن بين تظليل ناعم وآخر stylized مع لقطات تبين أثر تغيير إعدادات الضوء أو bias.',
      internalLinkLabel: 'قسم أمثلة الإضاءة والتظليل',
      docLink: 'doc://examples/lighting'
    },
    {
      id: 'post-processing',
      icon: '🖥️',
      title: 'أمثلة المؤثرات اللاحقة',
      englishTitle: 'Post Processing',
      description: 'يعرض هذا القسم المؤثرات التي تعمل على الصورة النهائية أو على full-screen pass بعد اكتمال الرسم الأساسي.',
      educationalGoal: 'تعليم القارئ كيف تتحول الصورة الخام إلى خرج مرئي معدل بالسطوع أو التدرج الرمادي أو bloom أو مقارنة قبل/بعد.',
      exampleKinds: 'Bloom، grayscale، catalog للمؤثرات اللاحقة، مقارنات split view.',
      distinction: 'يعالج الصورة الناتجة كصورة واحدة قابلة للمعالجة، لا كمواد منفردة أو كائنات منفصلة.',
      prerequisites: ['فهم basic fullscreen pass.', 'معرفة أولية بالخامات الناتجة من passes سابقة.'],
      introVisual: 'شبكة Before/After أو split view توضح الفرق بين المشهد الخام والمشهد بعد المؤثر اللاحق.',
      internalLinkLabel: 'قسم أمثلة المؤثرات اللاحقة',
      docLink: 'doc://examples/postprocess'
    },
    {
      id: 'atmospheric-volumetric',
      icon: '🌫️',
      title: 'أمثلة التأثيرات الجوية',
      englishTitle: 'Atmospheric & Volumetric Effects',
      description: 'يتعامل هذا القسم مع الظواهر التي تملأ الوسط بين الكاميرا والمشهد، مثل الضباب وتدرجه مع المسافة.',
      educationalGoal: 'ربط العوامل الجوية بالمشهد وبالإحساس بالعمق والبعد.',
      exampleKinds: 'Fog، تحرير الكثافة، مقارنة linear وexponential.',
      distinction: 'هذا القسم يغيّر قراءة المشهد بحسب المسافة والوسط، لا بحسب خصائص المادة نفسها.',
      prerequisites: ['معرفة المسافة أو العمق في المشهد.', 'فهم أولي للفروق بين near/far influence.'],
      introVisual: 'لقطة طريق أو أجسام بعيدة تتلاشى تدريجيًا مع مقارنة كثافات أو أنماط fog متعددة.',
      internalLinkLabel: 'قسم أمثلة التأثيرات الجوية',
      docLink: 'doc://examples/atmosphere'
    },
    {
      id: 'procedural-effects',
      icon: '🧬',
      title: 'أمثلة التأثيرات الإجرائية',
      englishTitle: 'Procedural Effects',
      description: 'يضم هذا القسم الأمثلة التي تولد النمط أو الخامة أو الإشارة رياضيًا بدل الاعتماد على صورة جاهزة من القرص.',
      educationalGoal: 'تعليم القارئ كيف يولد مؤثرًا أو خامة من الدوال والضوضاء والطبقات الرياضية.',
      exampleKinds: 'Procedural Noise، مقارنة الطبقات، وأدوات ضبط scale وoctaves وcontrast.',
      distinction: 'لا يعتمد على texture ثابتة بقدر ما يعتمد على توليد القيم داخل الشيدر نفسه.',
      prerequisites: ['فهم الدوال الرياضية الأساسية.', 'معرفة أولية بالـ UV أو بالإحداثيات المستخدمة لتغذية الضوضاء.'],
      introVisual: 'صورة شبكة مقارنة لأنماط noise متعددة مع لقطات توضح أثر تغيير عدد الطبقات والحجم والتباين.',
      internalLinkLabel: 'قسم أمثلة التأثيرات الإجرائية',
      docLink: 'doc://examples/procedural'
    },
    {
      id: 'water-fluid',
      icon: '🌊',
      title: 'أمثلة الماء والسوائل',
      englishTitle: 'Water & Fluid Effects',
      description: 'يعرض هذا القسم المواد المتحركة التي تمثل الماء أو السطوح السائلة مع موج ورغوة ولون وانعكاس بصري.',
      educationalGoal: 'فهم كيف يرتبط الزمن والموج واللون والرغوة داخل مادة واحدة قابلة للتحكم.',
      exampleKinds: 'Water Shader، Wave controls، Foam controls، وأسطح متحركة.',
      distinction: 'هذا القسم يركز على مادة سائلة متحركة، لذلك يجمع بين الوقت، التشوه، واللون في سياق واحد.',
      prerequisites: ['فهم بسيط للزمن داخل الشيدر.', 'معرفة أولية بالتشوه الموجي أو الإحداثيات المتحركة.'],
      introVisual: 'معاينة لسطح ماء متحرك مع واجهة تحكم توضح الموج والرغوة واللون في الوقت نفسه.',
      internalLinkLabel: 'قسم أمثلة الماء والسوائل',
      docLink: 'doc://examples/water'
    },
    {
      id: 'raymarch-sdf',
      icon: '🧭',
      title: 'أمثلة Ray Marching',
      englishTitle: 'Ray Marching & SDF',
      description: 'يشرح هذا القسم كيف نبني الشكل من مسافات موقعة وخطوات شعاعية بدل الاعتماد على mesh تقليدية.',
      educationalGoal: 'تقديم نموذج ذهني مختلف للرسم، يعتمد على التتبع التدريجي للمسافة لا على الرؤوس والمضلعات فقط.',
      exampleKinds: 'Ray Marching، SDF Debug، عدد الخطوات، ومتوسط المسافة.',
      distinction: 'هذا القسم يختلف جذريًا عن بقية الأقسام لأنه يولد الشكل داخل الشيدر من دوال المسافة نفسها.',
      prerequisites: ['فهم بسيط للأشعة والاتجاهات.', 'القدرة على قراءة حلقات تكرار وحسابات مسافة داخل fragment shader.'],
      introVisual: 'صورة sphere SDF مع heatmap لعدد الخطوات ونافذة Debug تشرح لماذا نجح أو فشل التقارب.',
      internalLinkLabel: 'قسم أمثلة Ray Marching',
      docLink: 'doc://examples/raymarching'
    },
    {
      id: 'screen-space-effects',
      icon: '🔍',
      title: 'أمثلة تأثيرات الشاشة',
      englishTitle: 'Screen Space Effects',
      description: 'يتعامل هذا القسم مع المؤثرات التي تقرأ عمق الشاشة أو القنوات الوسيطة أو الصورة النهائية لتبني قناعًا أو نتيجة على مستوى الشاشة.',
      educationalGoal: 'شرح المؤثرات التي لا تنظر إلى المادة مباشرة، بل إلى ناتج المشهد أو قنواته المساعدة.',
      exampleKinds: 'Edge visualization، Depth/Normal viewers، وواجهات GBuffer مبسطة.',
      distinction: 'القيم هنا تأتي من buffers وسيطة على مستوى الشاشة، لا من مادة مفردة أو نموذج واحد.',
      prerequisites: ['فهم depth وnormal textures.', 'معرفة basic fullscreen pass.'],
      introVisual: 'ثلاثية depth/normal/edge output مع خطوط توضح كيف تُشتق الحواف من القنوات الوسيطة.',
      internalLinkLabel: 'قسم أمثلة تأثيرات الشاشة',
      docLink: 'doc://examples/screen-space'
    },
    {
      id: 'animation-time',
      icon: '⏱️',
      title: 'أمثلة التحريك والمؤثرات الزمنية',
      englishTitle: 'Animation & Time-Based Effects',
      description: 'يجمع هذا القسم الأمثلة التي تجعل الزمن جزءًا من الحساب البصري، سواء في التحويل أو التشوه أو الحركة المستمرة.',
      educationalGoal: 'ربط القارئ بمفهوم `u_Time` أو الزمن التراكمي وكيف ينتقل من التطبيق إلى الشيدر ويؤثر في النتيجة.',
      exampleKinds: 'Transform motion، wave distortion، animated materials.',
      distinction: 'ما يميز هذا القسم أن النتيجة لا تُفهم من لقطة واحدة فقط، بل من تغيرها بين الإطارات.',
      prerequisites: ['معرفة `uniform` و`sin` أو الدوال الزمنية الأساسية.', 'فهم كيف يحدّث التطبيق قيمة الزمن بين الإطارات.'],
      introVisual: 'صورة متسلسلة أو مقارنة إطارات توضح كيف تتحرك المادة أو الشكل مع الزمن بدل ثباته.',
      internalLinkLabel: 'قسم أمثلة التحريك والمؤثرات الزمنية',
      docLink: 'doc://examples/animation'
    },
    {
      id: 'educational-comparisons',
      icon: '🧠',
      title: 'أمثلة Debug والتشخيص',
      englishTitle: 'Educational Comparisons',
      description: 'يركز هذا القسم على الأمثلة التي تشرح الفكرة عبر مقارنة قبل/بعد أو صحيح/خاطئ أو وضعين متقابلين داخل الواجهة نفسها.',
      educationalGoal: 'جعل الخطأ البصري والنتيجة الصحيحة قابلين للمقارنة المباشرة بدل الشرح النظري المجرد.',
      exampleKinds: 'Shadow Bias Comparison، split views، before/after panels.',
      distinction: 'يتميز عن الأقسام الأخرى بأن القيمة التعليمية تأتي من المقارنة نفسها لا من النتيجة النهائية وحدها.',
      prerequisites: ['معرفة أولية بالمفهوم الذي تتم مقارنته.', 'القدرة على قراءة before/after أو وضع split view.'],
      introVisual: 'لوحتان متجاورتان تعرضان artifact شائعًا مقابل النتيجة الصحيحة مع عنوان واضح فوق كل حالة.',
      internalLinkLabel: 'قسم أمثلة Debug والتشخيص',
      docLink: 'doc://examples/debug'
    },
    {
      id: 'scene-performance',
      icon: '📈',
      title: 'أمثلة تنظيم المشهد والأداء',
      englishTitle: 'Scene Organization & Performance',
      description: 'يعرض هذا القسم الأمثلة التي تربط قرار الرسم ببنية البيانات والأداء، مثل instancing وتوزيع النسخ وكثافة المشهد.',
      educationalGoal: 'شرح العلاقة بين قرار الرسم وعدد الكائنات والكلفة البصرية والتنظيم العملي للمشهد.',
      exampleKinds: 'Instancing، لوحات عداد النسخ، ومختبرات Debug للكثافة والألوان.',
      distinction: 'القسم يركز على الكلفة والتنظيم وعدد النسخ، لا على شكل مادة واحدة أو مؤثر شاشة واحد.',
      prerequisites: ['فهم basic draw call أو instancing.', 'معرفة أولية بالفرق بين mesh واحدة ونسخ متعددة.'],
      introVisual: 'صورة مقارنة لعدة كثافات instancing مع لوحة تعرض عدد النسخ وdraw count.',
      internalLinkLabel: 'قسم أمثلة تنظيم المشهد والأداء',
      docLink: 'doc://examples/scene-performance'
    }
  ]);

  const GLSL_EXAMPLE_SECTION_BY_ID = Object.freeze({
    'glsl-basic-vertex': 'fundamentals',
    'glsl-basic-fragment': 'fundamentals',
    'glsl-uniform-color': 'fundamentals',
    'glsl-gradient-color': 'fundamentals',
    'glsl-vulkan-layout-bindings': 'glsl-vulkan-integration',
    'glsl-spirv-file-workflow': 'glsl-vulkan-integration',
    'glsl-uv-texture': 'materials-surface',
    'glsl-pbr-material-inspector': 'materials-surface',
    'glsl-normal-mapping-debug-view': 'surface-detail',
    'glsl-stylized-toon-shading-lab': 'lighting-shading',
    'glsl-grayscale-texture': 'post-processing',
    'glsl-bloom-threshold-panel': 'post-processing',
    'glsl-post-processing-comparison': 'post-processing',
    'glsl-fog-density-editor': 'atmospheric-volumetric',
    'glsl-procedural-noise-workbench': 'procedural-effects',
    'glsl-water-shader-controls': 'water-fluid',
    'glsl-ray-marching-debug-inspector': 'raymarch-sdf',
    'glsl-screen-space-edge-visualizer': 'screen-space-effects',
    'glsl-transform-motion': 'animation-time',
    'glsl-wave-distortion': 'animation-time',
    'glsl-shadow-bias-control-panel': 'educational-comparisons',
    'glsl-instancing-debug-lab': 'scene-performance'
  });

  const GLSL_EXAMPLE_DISPLAY_META = Object.freeze({
    'glsl-basic-vertex': {arabicTitle: 'تمرير مواضع الرؤوس مباشرة إلى خرج الإسقاط', englishTitle: 'Basic Vertex Pass-through', docLink: 'doc://examples/fundamentals/basic-vertex-pass-through'},
    'glsl-basic-fragment': {arabicTitle: 'إخراج لون ثابت من مظلّل الأجزاء', englishTitle: 'Constant Fragment Color', docLink: 'doc://examples/fundamentals/constant-fragment-color'},
    'glsl-uniform-color': {arabicTitle: 'تغيير اللون عبر متغير موحّد', englishTitle: 'Uniform-driven Color', docLink: 'doc://examples/fundamentals/uniform-driven-color'},
    'glsl-gradient-color': {arabicTitle: 'بناء تدرج لوني من الإحداثيات', englishTitle: 'Gradient from Coordinates', docLink: 'doc://examples/fundamentals/gradient-from-coordinates'},
    'glsl-vulkan-layout-bindings': {arabicTitle: 'الربط الصريح بين الشيدر وموارد فولكان', englishTitle: 'Explicit Vulkan Layout Bindings', docLink: 'doc://examples/integration/explicit-vulkan-layout-bindings'},
    'glsl-spirv-file-workflow': {arabicTitle: 'تحويل ملفات الشيدر إلى SPIR-V', englishTitle: 'GLSL to SPIR-V File Workflow', docLink: 'doc://examples/integration/glsl-to-spirv-file-workflow'},
    'glsl-uv-texture': {arabicTitle: 'قراءة الخامة عبر إحداثيات UV', englishTitle: 'UV Texture Sampling', docLink: 'doc://examples/materials/uv-texture-sampling'},
    'glsl-pbr-material-inspector': {arabicTitle: 'تظليل المواد الفيزيائي مع مفتش الخامة', englishTitle: 'PBR Material Inspector', docLink: 'doc://examples/materials/pbr-material-inspector'},
    'glsl-normal-mapping-debug-view': {arabicTitle: 'إضافة تفاصيل السطح باستخدام خرائط الاتجاهات', englishTitle: 'Normal Mapping Debug View', docLink: 'doc://examples/surface-detail/normal-mapping-debug-view'},
    'glsl-stylized-toon-shading-lab': {arabicTitle: 'التظليل الكرتوني بأسلوب درجات حادة', englishTitle: 'Stylized Toon Shading Lab', docLink: 'doc://examples/lighting/stylized-toon-shading-lab'},
    'glsl-grayscale-texture': {arabicTitle: 'تحويل الخامة إلى تدرج رمادي', englishTitle: 'Grayscale Texture Effect', docLink: 'doc://examples/postprocess/grayscale-texture-effect'},
    'glsl-bloom-threshold-panel': {arabicTitle: 'إبراز Bloom عبر العتبة واللمعان', englishTitle: 'Bloom Threshold Panel', docLink: 'doc://examples/postprocess/bloom-threshold-panel'},
    'glsl-post-processing-comparison': {arabicTitle: 'مقارنة المؤثرات اللاحقة قبل وبعد', englishTitle: 'Post Processing Comparison', docLink: 'doc://examples/postprocess/post-processing-comparison'},
    'glsl-fog-density-editor': {arabicTitle: 'التحكم في كثافة الضباب', englishTitle: 'Fog Density Editor', docLink: 'doc://examples/atmosphere/fog-density-editor'},
    'glsl-procedural-noise-workbench': {arabicTitle: 'توليد الضوضاء الإجرائية وضبطها', englishTitle: 'Procedural Noise Workbench', docLink: 'doc://examples/procedural/procedural-noise-workbench'},
    'glsl-water-shader-controls': {arabicTitle: 'محاكاة سطح ماء متحرك', englishTitle: 'Water Shader Controls', docLink: 'doc://examples/water/water-shader-controls'},
    'glsl-ray-marching-debug-inspector': {arabicTitle: 'استكشاف Ray Marching مع التشخيص', englishTitle: 'Ray Marching Debug Inspector', docLink: 'doc://examples/raymarching/ray-marching-debug-inspector'},
    'glsl-screen-space-edge-visualizer': {arabicTitle: 'استخراج حواف المشهد على مستوى الشاشة', englishTitle: 'Screen Space Edge Visualizer', docLink: 'doc://examples/screen-space/edge-visualizer'},
    'glsl-transform-motion': {arabicTitle: 'تحريك الشكل عبر الزمن والمصفوفة', englishTitle: 'Transform and Time Motion', docLink: 'doc://examples/animation/transform-and-time-motion'},
    'glsl-wave-distortion': {arabicTitle: 'تشويه الخامة بموجة زمنية', englishTitle: 'Wave Distortion', docLink: 'doc://examples/animation/wave-distortion'},
    'glsl-shadow-bias-control-panel': {arabicTitle: 'ضبط انحياز الظل ومقارنة العيوب', englishTitle: 'Shadow Bias Control Panel', docLink: 'doc://examples/debug/shadow-bias-control-panel'},
    'glsl-instancing-debug-lab': {arabicTitle: 'فحص الرسم المتكرر Instancing', englishTitle: 'Instancing Debug Lab', docLink: 'doc://examples/scene-performance/instancing-debug-lab'}
  });

  function getGlslExampleSectionMeta(exampleOrId = '') {
    const id = typeof exampleOrId === 'string'
      ? String(exampleOrId || '').trim()
      : String(exampleOrId?.id || '').trim();
    const sectionId = GLSL_EXAMPLE_SECTION_BY_ID[id] || 'fundamentals';
    return GLSL_EXAMPLE_SECTIONS.find((section) => section.id === sectionId) || GLSL_EXAMPLE_SECTIONS[0];
  }

  function getGlslExampleDisplayMeta(exampleOrId = '') {
    const example = typeof exampleOrId === 'string'
      ? (getGlslReadyExampleById(String(exampleOrId || '').trim()) || {id: String(exampleOrId || '').trim()})
      : (exampleOrId || {});
    const id = String(example.id || '').trim();
    const meta = GLSL_EXAMPLE_DISPLAY_META[id] || {};
    const section = getGlslExampleSectionMeta(example);
    const sectionDocLink = String(section?.docLink || 'doc://examples').replace(/\/+$/, '');
    const fallbackDocLink = `${sectionDocLink}/${id.replace(/^glsl-/, '')}`;
    return {
      ...meta,
      id,
      section,
      docLink: meta.docLink || fallbackDocLink
    };
  }

  function getGlslExampleDisplayTitle(exampleOrId = '') {
    const example = typeof exampleOrId === 'string'
      ? (getGlslReadyExampleById(String(exampleOrId || '').trim()) || {id: String(exampleOrId || '').trim()})
      : (exampleOrId || {});
    const meta = getGlslExampleDisplayMeta(example);
    const arabicTitle = String(meta.arabicTitle || localizeGlslStageLabels(example.title || example.id || 'مثال لغة التظليل')).trim();
    const englishTitle = String(meta.englishTitle || '').trim();
    return englishTitle ? `${arabicTitle} (${englishTitle})` : arabicTitle;
  }

  function getGlslExampleInternalDocLink(exampleOrId = '') {
    return String(getGlslExampleDisplayMeta(exampleOrId).docLink || '').trim();
  }

  function buildGlslExampleNavTooltip(exampleOrId = '') {
    const example = typeof exampleOrId === 'string'
      ? (getGlslReadyExampleById(String(exampleOrId || '').trim()) || {id: String(exampleOrId || '').trim()})
      : (exampleOrId || {});
    const section = getGlslExampleSectionMeta(example);
    const displayTitle = getGlslExampleDisplayTitle(example);
    const summary = summarizeExamplePreviewText(localizeGlslStageLabels(example.goal || example.expectedResult || section.description || ''), 30);
    const learns = summarizeExamplePreviewText(localizeGlslStageLabels(example.highlights?.[0] || section.educationalGoal || example.goal || ''), 26);
    const prerequisiteList = (Array.isArray(example.prerequisites) && example.prerequisites.length
      ? example.prerequisites
      : (section.prerequisites || [])
    ).slice(0, 2);
    const prerequisitesText = prerequisiteList.length ? prerequisiteList.join('، ') : 'لا توجد متطلبات خاصة.';

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: displayTitle,
        kindLabel: 'مثال GLSL',
        typeLabel: section.title || 'مثال شيدر',
        library: 'GLSL',
        meaning: summary,
        whyExists: buildGlslExampleSectionReason(example, section),
        whyUse: learns,
        actualUsage: `يفتح مثالاً عملياً يربط الفكرة بالشيدر وبمتطلبات مثل ${prerequisitesText}.`
      })
      : [
        displayTitle,
        summary,
        `ما الذي يتعلمه المستخدم: ${learns}`,
        `المتطلبات السابقة: ${prerequisitesText}`
      ].filter(Boolean).join('\n');
  }

  function getGlslGroupedReadyExamples() {
    return GLSL_EXAMPLE_SECTIONS.map((section) => ({
      ...section,
      examples: (glslReadyExamples || []).filter((example) => getGlslExampleSectionMeta(example).id === section.id)
    })).filter((section) => section.examples.length);
  }

  function buildGlslExampleSectionReason(example = {}, section = null) {
    const meta = section || getGlslExampleSectionMeta(example);
    switch (meta.id) {
      case 'glsl-vulkan-integration':
        return 'وُضع هذا المثال هنا لأن جوهره الحقيقي ليس اللون أو المادة، بل كيفية ربط ملفات الشيدر مع `Vulkan` ونظام البناء والـ `pipeline`.';
      case 'materials-surface':
        return 'ينتمي لهذا القسم لأن الناتج النهائي يعتمد على هوية المادة والخامة واستجابة السطح، لا على مؤثر شاشة لاحق أو وسط جوي.';
      case 'surface-detail':
        return 'ينتمي لهذا القسم لأن الفكرة المركزية فيه هي إضافة تفاصيل إدراكية إلى السطح نفسه عبر normal map أو قنوات تشخيص السطح.';
      case 'lighting-shading':
        return 'وُضع هذا المثال هنا لأن تغيير معادلة الإضاءة أو أسلوب التظليل هو السبب المباشر في تغير النتيجة البصرية.';
      case 'post-processing':
        return 'ينتمي لهذا القسم لأن الشيدر يعالج صورة أو نتيجة نهائية بعد اكتمال الرسم الأساسي، ويقارن بين الأوضاع على مستوى الشاشة أو الـ fullscreen pass.';
      case 'atmospheric-volumetric':
        return 'وُضع هذا المثال هنا لأن التأثير يأتي من الوسط بين الكاميرا والمشهد، مثل الضباب وكثافته مع المسافة.';
      case 'procedural-effects':
        return 'ينتمي لهذا القسم لأن النمط أو الخامة يولَّد رياضيًا داخل الشيدر بدل أن يأتي من ملف صورة جاهز.';
      case 'water-fluid':
        return 'وُضع هذا المثال هنا لأن التموج والرغوة واللون السائل هي محور المثال، وهي خصائص مرتبطة بمواد الماء لا بمادة جامدة عامة.';
      case 'raymarch-sdf':
        return 'ينتمي لهذا القسم لأن الشكل ينتج من marching و`Signed Distance Fields` بدل المرور عبر mesh تقليدية.';
      case 'screen-space-effects':
        return 'وُضع هذا المثال هنا لأن قراءة depth/normal أو الصورة النهائية تتم على مستوى الشاشة كلها، لا على مستوى مادة منفردة.';
      case 'animation-time':
        return 'ينتمي لهذا القسم لأن الزمن هو المحرك الرئيسي للتأثير أو الحركة أو التشوه الظاهر داخل المثال.';
      case 'educational-comparisons':
        return 'وُضع هذا المثال هنا لأن المقارنة بين الصحيح والخاطئ أو بين حالتين متقابلتين هي قلب التجربة التعليمية فيه.';
      case 'scene-performance':
        return 'ينتمي لهذا القسم لأن الفكرة الأساسية فيه تربط عدد النسخ والكثافة البصرية وقرار الرسم بالأداء والتنظيم داخل المشهد.';
      default:
        return 'وُضع هذا المثال هنا لأنه يشرح المبادئ الأساسية للشيدر وتدفق البيانات بين المراحل قبل الدخول في المواد والمؤثرات المتقدمة.';
    }
  }

  function getGlslExampleSupplementaryTracks(example = {}) {
    const tracks = [];
    if (String(example.imguiCode || '').trim()) {
      tracks.push('دمج GLSL + Dear ImGui');
      tracks.push('واجهات تعليمية تفاعلية');
    }
    if (Array.isArray(example.imguiComponents) && example.imguiComponents.length) {
      tracks.push('أدوات Dear ImGui');
    }
    return [...new Set(tracks)];
  }

  function buildGlslReferenceSectionIntro(section = {}) {
    const count = Array.isArray(section.items) ? section.items.length : 0;
    return `يعرض هذا القسم ${count} عنصرًا من ${section.title || 'مرجع GLSLang'} ضمن بطاقات معاينة سريعة تقودك مباشرة إلى الشرح الكامل والربط العملي مع Vulkan.`;
  }

  function getGlslReferenceSectionId(sectionKey) {
    return `glsl-${String(sectionKey || 'reference')}-list`;
  }

  function parseGlslReferenceSectionId(sectionId) {
    const match = /^glsl-([a-z0-9_]+)-list$/i.exec(String(sectionId || '').trim());
    if (!match) {
      return null;
    }

    return {
      sectionKey: match[1]
    };
  }

  function rememberGlslReferenceSectionState(sectionKey, isExpanded) {
    const key = String(sectionKey || '').trim();
    if (!key) {
      return;
    }

    if (isExpanded) {
      glslExpandedReferenceSections.add(key);
    } else {
      glslExpandedReferenceSections.delete(key);
    }
  }

  function rememberGlslReferenceSectionStateById(sectionId, isExpanded) {
    const parsed = parseGlslReferenceSectionId(sectionId);
    if (!parsed) {
      return;
    }

    rememberGlslReferenceSectionState(parsed.sectionKey, isExpanded);
  }

  function buildGlslSectionSidebarTooltip(sectionKey, section = {}) {
    const count = Array.isArray(section.items) ? section.items.length : 0;
    const lines = [
      section.title || 'قسم GLSLang',
      `عدد العناصر: ${count}`,
      buildGlslReferenceSectionIntro(section)
    ];

    if (sectionKey === 'functions') {
      lines.push('هذا الفرع يجمع الدوال المضمنة التي يحولها glslang إلى تعليمات SPIR-V أثناء الترجمة.');
    } else if (sectionKey === 'types') {
      lines.push('هذا الفرع يركز على الأنواع والبنى التي تحدد شكل القيم والموارد داخل الشيدر.');
    } else if (sectionKey === 'directives') {
      lines.push('هذا الفرع يضم التوجيهات التي تضبط قواعد الترجمة والمعالجة المسبقة قبل إنتاج SPIR-V.');
    }

    return window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__?.composeSemanticTooltip
      ? window.__ARABIC_VULKAN_TOOLTIP_SEMANTICS__.composeSemanticTooltip({
        title: section.title || 'قسم GLSLang',
        kindLabel: 'فهرس GLSL',
        typeLabel: 'قسم مرجعي',
        library: 'GLSL',
        meaning: buildGlslReferenceSectionIntro(section),
        whyExists: sectionKey === 'functions'
          ? 'وُجد هذا القسم لأن الدوال المضمنة تغيّر ما يمكن للشيدر حسابه فعلياً داخل الترجمة والتنفيذ.'
          : sectionKey === 'types'
            ? 'وُجد هذا القسم لأن الأنواع والبنى تحدد شكل القيم والموارد وواجهات الربط داخل الشيدر.'
            : sectionKey === 'directives'
              ? 'وُجد هذا القسم لأن التوجيهات تضبط الترجمة والمعالجة المسبقة قبل أن يصبح الشيدر SPIR-V صالحاً.'
              : 'وُجد هذا القسم لتجميع العناصر المتقاربة دلالياً داخل مرجع GLSL المحلي.',
        whyUse: `يفيد للوصول السريع إلى ${count} عنصرًا من نفس المسار المفاهيمي بدل البحث العشوائي بينها.`,
        actualUsage: 'يظهر في الشريط الجانبي كمدخل فهرسة قبل فتح العنصر نفسه.'
      })
      : lines.filter(Boolean).join('\n');
  }

  function renderGlslSectionNavItems(sectionKey, section = {}) {
    const sectionTitle = section.title || 'قسم GLSLang';
    const sectionTooltip = buildGlslSectionSidebarTooltip(sectionKey, section);
    const sectionIcon = getGlslSectionCodicon(sectionKey);
    const indexHtml = renderSidebarNavItem({
      navType: 'glsl-section-index',
      navName: sectionKey,
      tooltip: sectionTooltip,
      ariaLabel: `${sectionTitle}: ${sectionTooltip.replace(/\n/g, ' - ')}`,
      iconHtml: renderEntityIcon(sectionIcon, 'ui-codicon nav-icon', sectionTitle),
      label: `فهرس ${sectionTitle}`
    });
    const itemsHtml = (section.items || []).map((item) => {
      const displayName = item.displayName || item.name;
      const tooltip = buildGlslReferenceTooltip(item);
      return `
        <div class="nav-item" data-nav-type="glsl" data-nav-name="${escapeAttribute(item.name)}" data-tooltip="${escapeAttribute(tooltip)}" aria-label="${escapeAttribute(`${displayName}: ${tooltip.replace(/\n/g, ' - ')}`)}" tabindex="0" role="button" ${buildSidebarNavItemActivationAttrs()}>
          <span class="glsl-kind-badge">${escapeHtml(getGlslKindIcon(item.kind))}</span>
          <span>${escapeHtml(displayName)}</span>
        </div>
      `;
    }).join('');

    return `
      ${indexHtml}
      ${itemsHtml || `<div class="nav-item">لا توجد عناصر في ${escapeHtml(sectionTitle)}</div>`}
    `;
  }

  function toggleGlslReferenceSection(sectionKey, sectionId = getGlslReferenceSectionId(sectionKey)) {
    const section = document.getElementById(sectionId);
    const parentSection = section?.closest('.nav-section');
    const cluster = parentSection?.closest('.nav-cluster') || document.getElementById('glsl-cluster');

    if (!parentSection) {
      return;
    }

    if (!parentSection.classList.contains('collapsed')) {
      collapseAllSidebarSections();
      collapseAllSidebarNavGroups();
      rememberGlslReferenceSectionState(sectionKey, false);
      return;
    }

    if (cluster) {
      collapseAllSidebarClusters(cluster.id || '');
      cluster.classList.remove('collapsed');
    }

    collapseAllSidebarSections(parentSection);
    collapseAllSidebarNavGroups();
    parentSection.classList.remove('collapsed');
    rememberGlslReferenceSectionState(sectionKey, true);
  }

  function populateGlslList() {
    const container = document.getElementById('glsl-list');
    if (!container) return;

    let html = renderSidebarNavItem({
      navType: 'glsl-index',
      navName: 'glsl-index',
      tooltip: 'يفتح الفهرس المحلي الكامل لقسم GLSLang داخل المشروع.',
      iconHtml: renderEntityIcon('glsl', 'ui-codicon nav-icon', 'GLSLang'),
      label: 'فهرس GLSLang'
    });

    Object.entries(glslReferenceSections).forEach(([sectionKey, section]) => {
      const sectionId = getGlslReferenceSectionId(sectionKey);
      const count = Array.isArray(section.items) ? section.items.length : 0;
      html += renderSidebarSectionShell({
        className: 'sdl3-package-kind-section glsl-reference-kind-section',
        isExpanded: glslExpandedReferenceSections.has(sectionKey),
        onToggle: `toggleGlslReferenceSection('${escapeAttribute(sectionKey)}', '${escapeAttribute(sectionId)}')`,
        headingHtml: `<h3>${renderEntityIcon(getGlslSectionCodicon(sectionKey), 'ui-codicon nav-icon', section.title || 'قسم GLSLang')} ${escapeHtml(section.title || 'قسم GLSLang')} <span class="nav-section-inline-count">${count}</span></h3>`,
        sectionId,
        bodyHtml: renderGlslSectionNavItems(sectionKey, section)
      });
    });

    const groupedExamples = getGlslGroupedReadyExamples();
    const examplesSectionId = getGlslReferenceSectionId('examples');
    const groupedExamplesHtml = groupedExamples.map((group) => renderSidebarExampleGroup({
      className: 'glsl-example-nav-group',
      dataAttributeName: 'data-glsl-example-group',
      dataAttributeValue: group.id,
      isExpanded: glslExpandedExampleGroups.has(group.id),
      onToggle: `toggleGlslExampleGroup('${escapeAttribute(group.id)}')`,
      titleHtml: `${escapeHtml(group.icon)} ${escapeHtml(group.title)}`,
      count: group.examples.length,
      description: group.description,
      itemsHtml: group.examples.map((example) => {
        const displayTitle = getGlslExampleDisplayTitle(example);
        const tooltip = buildGlslExampleNavTooltip(example);
        const docLink = getGlslExampleInternalDocLink(example);
        return renderSidebarNavItem({
          navType: 'glsl-example',
          navName: example.id,
          tooltip,
          ariaLabel: `${displayTitle}: ${tooltip.replace(/\n/g, ' - ')}`,
          iconHtml: renderEntityIcon('glsl', 'ui-codicon nav-icon', displayTitle),
          label: displayTitle,
          extraAttributes: `data-doc-link="${escapeAttribute(docLink)}"`
        });
      }).join('')
    })).join('');

    const exampleCount = groupedExamples.reduce((total, group) => total + group.examples.length, 0);
    html += renderSidebarSectionShell({
      className: 'sdl3-package-kind-section glsl-reference-kind-section glsl-examples-sidebar-section',
      isExpanded: glslExpandedReferenceSections.has('examples'),
      onToggle: `toggleGlslReferenceSection('examples', '${escapeAttribute(examplesSectionId)}')`,
      headingHtml: `<h3>${renderEntityIcon('glsl', 'ui-codicon nav-icon', 'أمثلة لغة التظليل')} أمثلة لغة التظليل <span class="nav-section-inline-count">${exampleCount}</span></h3>`,
      sectionId: examplesSectionId,
      bodyHtml: `
        ${renderSidebarNavItem({
          navType: 'glsl-examples-index',
          navName: 'glsl-examples',
          tooltip: 'يفتح فهرس أمثلة لغة التظليل مع توزيعها بحسب التصنيف داخل المشروع.',
          iconHtml: renderEntityIcon('glsl', 'ui-codicon nav-icon', 'فهرس أمثلة لغة التظليل'),
          label: 'فهرس أمثلة لغة التظليل'
        })}
        ${groupedExamplesHtml || '<div class="nav-item">لا توجد أمثلة</div>'}
      `
    });

    container.innerHTML = html || '<div class="nav-item">لا توجد عناصر GLSLang</div>';
  }

  function toggleGlslExampleGroup(groupId) {
    const normalizedGroupId = String(groupId || '').trim();
    if (!normalizedGroupId) {
      return;
    }

    const group = document.querySelector(`.glsl-example-nav-group[data-glsl-example-group="${escapeSelectorValue(normalizedGroupId)}"]`);
    if (!group) {
      return;
    }

    const willExpand = group.classList.contains('collapsed');
    if (!willExpand) {
      collapseAllSidebarNavGroups();
      return;
    }

    collapseAllSidebarNavGroups(group);
    group.classList.remove('collapsed');
    glslExpandedExampleGroups.add(normalizedGroupId);
  }

  function renderGlslReadyExamplesSection() {
    if (!Array.isArray(glslReadyExamples) || !glslReadyExamples.length) {
      return '';
    }

    return `
      <section class="category-section" id="glsl-ready-examples">
        <h2>${renderEntityIcon('glsl', 'ui-codicon page-icon', 'أمثلة لغة التظليل')} أمثلة جاهزة</h2>
        <div class="content-card prose-card glsl-ready-examples-intro">
          <p>يجمع هذا القسم أمثلة عملية جاهزة للغة التظليل تبدأ من <code>${GLSL_VERTEX_STAGE_ARABIC_LABEL}</code> و<code>${GLSL_FRAGMENT_STAGE_ARABIC_LABEL}</code> البسيطين، ثم تنتقل إلى الألوان و<code>uniform</code> و<code>إحداثيات يو في</code> و<code>الخامات</code> والتحويلات والحركة والمؤثرات البصرية. الهدف هنا أن ترى الشيدر كسيناريو كامل قابل للبناء عليه، لا كسطر لغوي معزول.</p>
          <p>الرموز المهمة داخل الشيدر قابلة للنقر، وتعرض وصفًا توضيحيًا عربيًا مختصرًا مع شارة توضّح نوع العنصر حتى يسهل الانتقال من المثال إلى الشرح المرجعي.</p>
        </div>
        <div class="glsl-ready-examples-grid">
          ${(glslReadyExamples || []).map((example) => renderGlslReadyExampleCard(example)).join('')}
        </div>
      </section>
    `;
  }

  function renderGlslSectionOverviewCard(section) {
    const sectionLinks = section.examples.map((example) => `
      <a href="#" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(buildGlslExampleNavTooltip(example))}" onclick="showGlslExample('${escapeAttribute(example.id)}'); return false;">
        ${safeRenderEntityLabel(getGlslExampleDisplayTitle(example), 'glsl', {code: false})}
      </a>
    `).join(' ');

    return `
      <div class="content-card prose-card glsl-section-overview-card">
        <div class="glsl-section-overview-head">
          <div>
            <div class="info-label">${escapeHtml(section.englishTitle)}</div>
            <h3>${escapeHtml(section.icon)} ${escapeHtml(section.title)}</h3>
          </div>
          <span class="glsl-ready-example-type">${section.examples.length} مثال</span>
        </div>
        <p>${escapeHtml(section.description)}</p>
        <div class="glsl-section-overview-grid">
          <div>
            <strong>الهدف التعليمي</strong>
            <p>${escapeHtml(section.educationalGoal)}</p>
          </div>
          <div>
            <strong>نوع الأمثلة</strong>
            <p>${escapeHtml(section.exampleKinds)}</p>
          </div>
          <div>
            <strong>ما الذي يميزه عن غيره</strong>
            <p>${escapeHtml(section.distinction)}</p>
          </div>
          <div>
            <strong>المتطلبات المعرفية</strong>
            ${renderTutorialList((section.prerequisites || []).map((entry) => `<p>${escapeHtml(entry)}</p>`))}
          </div>
          <div>
            <strong>الوصف البصري التمهيدي</strong>
            <p>${escapeHtml(section.introVisual)}</p>
          </div>
          <div>
            <strong>الروابط الداخلية الخاصة بالقسم</strong>
            <div class="see-also-links">${sectionLinks}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderGlslExamplesGroupedIndexSection() {
    const groups = getGlslGroupedReadyExamples();
    if (!groups.length) {
      return '';
    }

    return `
      <section class="category-section library-example-preview-section glsl-example-groups-section" id="glsl-examples-index-grid">
        <div class="library-example-preview-header">
          <div class="library-example-preview-heading">
            <h2>فهرس أقسام أمثلة لغة التظليل</h2>
            <p>أعيد توزيع أمثلة الشيدر هنا إلى أقسام تعليمية فعلية بدل تجميعها في قائمة واحدة. افتح القسم الذي يطابق الموضوع الذي تريد تعلمه ثم انتقل إلى المثال الكامل.</p>
          </div>
        </div>
        <div class="glsl-example-section-clusters">
          ${groups.map((section, index) => `
            <details class="content-card prose-card glsl-example-section-cluster"${index < 2 ? ' open' : ''}>
              <summary class="glsl-example-section-summary">
                <span class="glsl-example-section-title-wrap">
                  <span class="glsl-example-section-title">${escapeHtml(section.icon)} ${escapeHtml(section.title)}</span>
                  <span class="glsl-example-section-count">${section.examples.length} مثال</span>
                </span>
                <span class="glsl-example-section-note">${escapeHtml(section.englishTitle)}</span>
              </summary>
              <div class="glsl-example-section-body">
                ${renderGlslSectionOverviewCard(section)}
                <div class="library-example-preview-grid">
                  ${section.examples.map((example) => renderLibraryExamplePreviewCard({
                    id: example.id,
                    title: getGlslExampleDisplayTitle(example),
                    summary: summarizeExamplePreviewText(localizeGlslStageLabels(example.goal || example.expectedResult || ''), 26),
                    previewHtml: renderGlslReadyExamplePreview(example),
                    openAction: `showGlslExample('${escapeAttribute(example.id)}')`
                  })).join('')}
                </div>
              </div>
            </details>
          `).join('')}
        </div>
      </section>
    `;
  }

  function getGlslIndexPreviewSnippet(item = {}) {
    const raw = String(item.example || item.name || '').trim();
    if (!raw) {
      return '';
    }

    const lines = raw
      .split('\n')
      .map((line) => line.replace(/\t/g, '  ').trimEnd())
      .filter((line) => line.trim());

    if (!lines.length) {
      return raw;
    }

    const snippetLines = lines.slice(0, 3);
    if (lines.length > snippetLines.length) {
      snippetLines[snippetLines.length - 1] = `${snippetLines[snippetLines.length - 1]} ...`;
    }

    return snippetLines.join('\n');
  }

  function renderGlslIndexCardPreview(item = {}) {
    const displayName = String(item.displayName || item.name || '').trim();
    if (!displayName) {
      return '';
    }

    const snippet = getGlslIndexPreviewSnippet(item);
    const kindLabel = localizeGlslKind(item.kind) || 'عنصر GLSL';
    const executionStage = summarizeExamplePreviewText(
      normalizeGlslExplanationText(inferGlslExecutionStageLabel(item) || ''),
      12
    );
    const note = summarizeExamplePreviewText(
      normalizeGlslExplanationText(item.usage || item.execution || item.effect || item.description || ''),
      18
    );

    return `
      <div class="glsl-index-preview" aria-hidden="true">
        <div class="glsl-index-preview-window">
          <div class="glsl-index-preview-titlebar">
            <span class="glsl-index-preview-kind">
              <span class="glsl-kind-badge inline">${escapeHtml(getGlslKindIcon(item.kind))}</span>
              <span>${escapeHtml(kindLabel)}</span>
            </span>
          </div>
          <div class="glsl-index-preview-body">
            <div class="glsl-index-preview-head">
              <code class="glsl-index-preview-name">${escapeHtml(displayName)}</code>
              ${executionStage ? `<span class="glsl-index-preview-stage">${escapeHtml(executionStage)}</span>` : ''}
            </div>
            ${snippet ? `<pre class="glsl-index-preview-code">${escapeHtml(snippet)}</pre>` : ''}
            ${note ? `<p class="glsl-index-preview-note">${escapeHtml(note)}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function getGlslReferencePreviewEntries(sectionKey = '') {
    const section = glslReferenceSections?.[sectionKey];
    if (!section?.items?.length) {
      return [];
    }

    return (section.items || []).map((item) => ({
      id: item.name,
      title: item.displayName || item.name,
      summary: summarizeExamplePreviewText(
        normalizeGlslExplanationText(item.description || item.usage || ''),
        22
      ),
      previewHtml: renderGlslIndexCardPreview(item),
      openAction: `showGlslReference('${escapeAttribute(item.name)}')`,
      actionLabel: 'عرض العنصر'
    }));
  }

  function renderGlslReferenceIndexSection(sectionKey = '', section = {}) {
    return renderLibraryExamplePreviewSection({
      sectionId: `glsl-section-${sectionKey}`,
      title: section.title || 'قسم GLSLang',
      intro: buildGlslReferenceSectionIntro(section),
      browseAction: '',
      examples: getGlslReferencePreviewEntries(sectionKey)
    });
  }

  const api = {
    GLSL_EXAMPLE_DISPLAY_META,
    GLSL_EXAMPLE_SECTION_BY_ID,
    GLSL_EXAMPLE_SECTIONS,
    buildGlslExampleNavTooltip,
    buildGlslExampleSectionReason,
    buildGlslReferenceSectionIntro,
    buildGlslSectionSidebarTooltip,
    getGlslExampleDisplayMeta,
    getGlslExampleDisplayTitle,
    getGlslExampleInternalDocLink,
    getGlslExamplePreviewEntries,
    getGlslExampleSectionMeta,
    getGlslExampleSupplementaryTracks,
    getGlslIndexPreviewSnippet,
    getGlslGroupedReadyExamples,
    getGlslReferenceSectionId,
    parseGlslReferenceSectionId,
    populateGlslList,
    rememberGlslReferenceSectionState,
    rememberGlslReferenceSectionStateById,
    renderGlslExamplesGroupedIndexSection,
    renderGlslExamplesPreviewSection,
    renderGlslIndexCardPreview,
    renderGlslReadyExamplesIndexSection,
    renderGlslReadyExamplesSection,
    renderGlslReferenceIndexSection,
    renderGlslSectionNavItems,
    renderGlslSectionOverviewCard,
    toggleGlslExampleGroup,
    toggleGlslReferenceSection
  };

  Object.assign(window, api);
  return Object.freeze(api);
})();
