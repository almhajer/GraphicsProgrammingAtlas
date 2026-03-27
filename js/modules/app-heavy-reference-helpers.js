// ArabicVulkan - extracted heavy global helper functions from js/app.js

function renderGlslVulkanWorkflowSection() {
  const sampleVertexShader = `#version 460
layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 inUV;

layout(set = 0, binding = 0) uniform CameraUBO {
    mat4 viewProj;
} camera;

layout(location = 0) out vec2 vUV;

void main()
{
    vUV = inUV;
    gl_Position = camera.viewProj * vec4(inPosition, 1.0);
}`;

  const sampleFragmentShader = `#version 460
layout(location = 0) in vec2 vUV;
layout(location = 0) out vec4 outColor;

layout(set = 0, binding = 1) uniform sampler2D albedoMap;

void main()
{
    outColor = texture(albedoMap, vUV);
}`;

  return `
    <section class="category-section glsl-vulkan-workflow-section" id="glsl-vulkan-workflow">
      <div class="library-example-preview-header">
        <div class="library-example-preview-heading">
          <h2>${renderEntityIcon('glsl', 'ui-codicon page-icon', 'لغة التظليل مع فولكان')} لغة التظليل مع فولكان</h2>
          <p>هذا الجزء يربط كتابة الشيدر النصي بمسار فولكان الحقيقي: ما الفرق بين لغة التظليل العامة والنسخة العملية الخاصة بفولكان، وكيف يتحول الملف إلى إس بي آي آر-في، وكيف يُقرأ لاحقًا داخل <code>VkShaderModule</code> وخط الأنابيب الرسومي.</p>
        </div>
      </div>

      <div class="content-card prose-card glsl-vulkan-hero-card">
        <div class="glsl-vulkan-hero-copy">
          <h3>المسار العملي من الملف النصي إلى خط الأنابيب</h3>
          <p>${renderGlslTechnicalProse('في المسار التقليدي تكتب الشيدر بصيغة لغة التظليل، لكن فولكان لا يستهلك الملف النصي مباشرة. يجب أن يمر عبر `glslangValidator` أو `glslc` لإنتاج إس بي آي آر-في، ثم يقرأ التطبيق الملف الثنائي ويحوّله إلى `VkShaderModule` قبل ربطه داخل خط الأنابيب.')}</p>
          <div class="glsl-vulkan-difference-grid">
            <div class="content-card prose-card">
              <h4>لغة التظليل العامة</h4>
              <p>${renderGlslTechnicalProse('يركز على منطق الشيدر نفسه: المتغيرات، الدوال، الواجهات، والعمليات الرياضية.')}</p>
            </div>
            <div class="content-card prose-card">
              <h4>النسخة العملية الخاصة بفولكان</h4>
              <p>${renderGlslTechnicalProse('تضيف الربط الصريح عبر `layout(location = ...)` و`layout(set = ..., binding = ...)` وتتعامل مع الترجمة إلى إس بي آي آر-في كخطوة إلزامية قبل التشغيل.')}</p>
            </div>
            <div class="content-card prose-card">
              <h4>إس بي آي آر-في</h4>
              <p>${renderGlslTechnicalProse('هو التمثيل الوسيط الذي يستهلكه فولكان فعلًا، لذلك تظهر أخطاء الترجمة أو التوافق غالبًا قبل إنشاء خط الأنابيب لا بعده.')}</p>
            </div>
          </div>
        </div>
        <figure class="glsl-vulkan-hero-shot">
          <svg viewBox="0 0 560 280" role="img" aria-label="تدفق لغة التظليل إلى إس بي آي آر-في ثم وحدة شيدر" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glslFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#57b7ff"/>
                <stop offset="55%" stop-color="#7b8dff"/>
                <stop offset="100%" stop-color="#ffd470"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="560" height="280" rx="26" fill="#0a1017"/>
            <rect x="24" y="42" width="148" height="162" rx="24" fill="#132131"/>
            <rect x="206" y="42" width="148" height="162" rx="24" fill="#16283d"/>
            <rect x="388" y="42" width="148" height="162" rx="24" fill="#1a3148"/>
            <text x="98" y="78" text-anchor="middle" fill="#eef5ff" font-size="18" font-family="Tahoma, Arial, sans-serif">ملفات لغة التظليل</text>
            <text x="280" y="78" text-anchor="middle" fill="#eef5ff" font-size="18" font-family="Tahoma, Arial, sans-serif">إس بي آي آر-في</text>
            <text x="462" y="78" text-anchor="middle" fill="#eef5ff" font-size="18" font-family="Tahoma, Arial, sans-serif">خط أنابيب فولكان</text>
            <rect x="46" y="102" width="104" height="14" rx="7" fill="#cfe1f5"/>
            <rect x="46" y="130" width="92" height="14" rx="7" fill="#6db8ff"/>
            <rect x="46" y="158" width="76" height="14" rx="7" fill="#78d5a5"/>
            <rect x="226" y="108" width="108" height="22" rx="11" fill="url(#glslFlowGradient)"/>
            <rect x="226" y="146" width="82" height="18" rx="9" fill="#9fb3c9"/>
            <rect x="406" y="104" width="112" height="18" rx="9" fill="#dfe9f8"/>
            <rect x="406" y="136" width="100" height="18" rx="9" fill="#6fb8ff"/>
            <rect x="406" y="168" width="88" height="18" rx="9" fill="#ffd470"/>
            <path d="M172 124 H206" stroke="#ffd470" stroke-width="6" stroke-linecap="round"/>
            <path d="M354 124 H388" stroke="#ffd470" stroke-width="6" stroke-linecap="round"/>
            <text x="189" y="112" text-anchor="middle" fill="#90a7bf" font-size="11" font-family="Tahoma, Arial, sans-serif">glslangValidator</text>
            <text x="371" y="112" text-anchor="middle" fill="#90a7bf" font-size="11" font-family="Tahoma, Arial, sans-serif">وحدة شيدر</text>
            <text x="280" y="234" text-anchor="middle" fill="#8ea7c2" font-size="13" font-family="Tahoma, Arial, sans-serif">كتابة شيدر → ترجمة → ربط داخل خط الأنابيب</text>
          </svg>
          <figcaption>صورة توضيحية لمسار لغة التظليل مع فولكان من الملف النصي إلى إس بي آي آر-في ثم <code>وحدة شيدر</code>.</figcaption>
        </figure>
      </div>

      <div class="glsl-vulkan-difference-grid">
        <div class="content-card prose-card">
          <h3>الفرق بين لغة التظليل العامة والنسخة الخاصة بفولكان</h3>
          ${renderTutorialList([
            'في لغة التظليل العامة قد تركز على منطق الشيدر فقط، أما في النسخة الخاصة بفولكان فتصبح الواجهة مع التطبيق صريحة ومقننة.',
            'غالبًا تحتاج إلى `layout(location = ...)` للمداخل والمخارج و`layout(set = ..., binding = ...)` للموارد بدل الاعتماد على ربط ضمني.',
            'التشغيل في فولكان يمر عبر إس بي آي آر-في، لذلك لا يستهلك المشغل ملفات `.vert` و`.frag` النصية مباشرة.'
          ])}
        </div>
        <div class="content-card prose-card">
          <h3>خطوات التحويل</h3>
          ${renderTutorialList([
            'اكتب ملف مظلّل رؤوس وملف مظلّل أجزاء بصيغة لغة التظليل المتوافقة مع فولكان.',
            'حوّل كل ملف إلى إس بي آي آر-في بأداة مثل glslangValidator.',
            'اقرأ الملف الثنائي `.spv` داخل التطبيق ثم أنشئ VkShaderModule لكل مرحلة.',
            'اربط الموديولات في `VkPipelineShaderStageCreateInfo` ثم أنشئ خط الأنابيب الرسومي.'
          ])}
        </div>
      </div>

      <div class="glsl-vulkan-command-grid">
        ${renderCommandSnippet('مظلّل الرؤوس إلى إس بي آي آر-في', 'glslangValidator -V shader.vert -o shader.vert.spv', 'bash', 'glsl')}
        ${renderCommandSnippet('مظلّل الأجزاء إلى إس بي آي آر-في', 'glslangValidator -V shader.frag -o shader.frag.spv', 'bash', 'glsl')}
      </div>

      <div class="glsl-ready-shaders-grid">
        <div class="glsl-ready-shader-card">
          <h3>مظلّل رؤوس عملي مع فولكان</h3>
          ${renderGlslReadyShaderCodeBlock('مظلّل الرؤوس', sampleVertexShader)}
        </div>
        <div class="glsl-ready-shader-card">
          <h3>مظلّل أجزاء عملي مع فولكان</h3>
          ${renderGlslReadyShaderCodeBlock('مظلّل الأجزاء', sampleFragmentShader)}
        </div>
      </div>

      <div class="content-card prose-card glsl-vulkan-usage-card">
        <h3>كيف يقرأ التطبيق هذه الملفات؟</h3>
        <p>${renderGlslTechnicalProse('بعد الترجمة يقرأ التطبيق `shader.vert.spv` و`shader.frag.spv` من القرص، يمرر البايتات إلى `VkShaderModuleCreateInfo`، ثم يبني `VkShaderModule` لكل مرحلة ويستخدمهما داخل `VkPipelineShaderStageCreateInfo`.')}</p>
        <p>${renderGlslTechnicalProse('إذا كانت `layout(set = 0, binding = 1)` موجودة داخل الشيدر، فيجب أن يطابقها `VkDescriptorSetLayoutBinding` داخل التطبيق. وإذا عرّفت `layout(location = 0)` على مدخل أو مخرج، فيجب أن يطابق ذلك وصف Vertex Attributes أو واجهة المرحلة التالية.')}</p>
      </div>
    </section>
  `;
}

function renderPipelineStagesDiagram() {
  const stageItems = [
    {
      key: 'input',
      number: '1',
      title: 'Vertex Input',
      kicker: 'اقرأ البايتات كسمات مفهومة',
      summary: 'هنا لا يجري الرسم بعد. هذه المرحلة تفسر ذاكرة <code>Vertex Buffer</code> وتفك الحقول مثل الموضع واللون والإحداثيات وفق stride وoffset وformat.',
      enters: 'بايتات الرؤوس داخل <code>VkBuffer</code> أو رؤوس مولدة داخل <code>Vertex Shader</code> إذا كان الإدخال فارغًا.',
      leaves: 'قيم منظمة مثل <code>position</code> و<code>color</code> و<code>uv</code> جاهزة لتدخل الشيدر الرأسي.',
      remember: 'احفظها بهذه الجملة: من الذاكرة الخام إلى حقول مفهومة.',
      warning: 'إذا أخطأت في <code>binding</code> أو <code>location</code> أو <code>offset</code> فلن ترى خطأً شكليًا فقط، بل ستقرأ الـ GPU بيانات الرؤوس من المكان الخطأ.',
      chips: `${renderProjectReferenceChip('VkPipelineVertexInputStateCreateInfo')} ${renderProjectReferenceChip('VkVertexInputBindingDescription')} ${renderProjectReferenceChip('VkVertexInputAttributeDescription')}`,
      gif: 'assets/pipeline_gifs/stage_vertex_input.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح بشكل أعمق كيف يقرأ Vertex Input صفوف الرؤوس من الذاكرة ويفكها إلى صفات منفصلة قبل دخول بقية خط الأنابيب.',
      gifSummary: 'تُظهر الحركة أن كل صف من الـ buffer يحتوي حزمة بيانات واحدة، ثم يفكها Vulkan إلى قنوات منفصلة تُمرر لاحقًا إلى الشيدر.',
      memoryHint: 'اسأل نفسك دائمًا: هل ما في الذاكرة يطابق ما ينتظره الشيدر حرفيًا؟'
    },
    {
      key: 'assembly',
      number: '2',
      title: 'Input Assembly',
      kicker: 'حوّل الرؤوس إلى بدائيات',
      summary: 'بعد قراءة الرؤوس يجب تحديد كيف تُفهم كأشكال هندسية: هل كل 3 رؤوس تصنع مثلثًا مستقلاً؟ أم شريطًا؟ أم خطوطًا؟',
      enters: 'رؤوس مرتبة خرجت من مرحلة الإدخال الرأسي.',
      leaves: '<code>Primitive</code> مثل مثلث أو خط وفق <code>topology</code>.',
      remember: 'هذه المرحلة لا تحسب الموضع؛ هي فقط تقرر كيف تُجمع الرؤوس.',
      warning: 'إذا كان ترتيب الرؤوس صحيحًا لكن <code>topology</code> خاطئًا، فالمشكلة لن تكون في الشيدر بل في شكل التجميع نفسه.',
      chips: `${renderProjectReferenceChip('VkPipelineInputAssemblyStateCreateInfo')} ${renderProjectReferenceChip('VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST')}`,
      gif: 'assets/pipeline_gifs/stage_input_assembly.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح كيف تجمع مرحلة Input Assembly الرؤوس إلى بدائية هندسية.',
      gifSummary: 'الهدف هنا ليس التلوين بعد، بل الاتفاق على أي مجموعة رؤوس تمثل مثلثًا واحدًا أو خطًا واحدًا.',
      memoryHint: 'احفظها بكلمة واحدة: تجميع.'
    },
    {
      key: 'vertex',
      number: '3',
      title: 'Vertex Shader',
      kicker: 'عالِج كل رأس على حدة',
      summary: 'كل <code>Vertex</code> يدخل الشيدر منفردًا. هنا تحسب <code>gl_Position</code> وتنقل أي قيم يحتاجها <code>Fragment Shader</code> لاحقًا.',
      enters: 'رأس واحد مع سماته المفكوكة من الذاكرة.',
      leaves: 'موضع في فضاء القص + قيم متغيرة ستُستوفى بين الرؤوس لاحقًا.',
      remember: 'هذه المرحلة تفكر في الرأس الواحد لا في المثلث ككل.',
      warning: 'إذا لم تكتب <code>gl_Position</code> بشكل صحيح فلن تصل البدائية إلى بقية المسار بالشكل المتوقع مهما كانت البيانات صحيحة.',
      chips: `${renderProjectReferenceChip('VkPipelineShaderStageCreateInfo')} ${renderProjectReferenceChip('VkShaderModule')}`,
      gif: 'assets/pipeline_gifs/stage_vertex_shader.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح مرور كل رأس عبر Vertex Shader وحساب موضعه الجديد.',
      gifSummary: 'الرأس هنا لا ينتج لون الشاشة مباشرة، بل ينتج موضعًا وقيمًا ستنتقل إلى المراحل اللاحقة.',
      memoryHint: 'احفظها بهذه الجملة: كل رأس يدخل وحده ويخرج بمكان جديد.'
    },
    {
      key: 'raster',
      number: '4',
      title: 'Viewport + Rasterizer',
      kicker: 'من شكل هندسي إلى شبكة بكسلات',
      summary: 'بعد معرفة مواضع الرؤوس، تُقص البدائية وتُحوَّل من شكل هندسي مستمر إلى وحدات أصغر اسمها <code>Fragments</code> داخل مساحة الرسم الفعلية.',
      enters: 'بدائية هندسية في فضاء القص بعد مرورها من الشيدر الرأسي.',
      leaves: 'سلسلة <code>Fragments</code> موزعة على الشبكة مع إحداثيات وقيم مستوفاة.',
      remember: 'هنا يبدأ الانتقال من الرياضيات الهندسية إلى منطق البكسلات.',
      warning: 'إذا كان <code>Viewport</code> أو <code>Scissor</code> أو اتجاه الوجوه غير مضبوط، فقد تبدو المشكلة وكأن الرسم اختفى، بينما السبب فعليًا في تحويل البدائية أو قصها.',
      chips: `${renderProjectReferenceChip('VkPipelineViewportStateCreateInfo')} ${renderProjectReferenceChip('VkPipelineRasterizationStateCreateInfo')}`,
      gif: 'assets/pipeline_gifs/stage_rasterization.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح تحوّل البدائية إلى Fragments داخل Rasterization.',
      gifSummary: 'المثلث لم يعد شكلاً مجردًا هنا؛ بل صار أجزاء صغيرة مرشحة لتلوين البكسلات.',
      memoryHint: 'احفظها بكلمتين: قص ثم تفكيك.'
    },
    {
      key: 'fragment',
      number: '5',
      title: 'Fragment Shader',
      kicker: 'احسب لون كل جزء مرئي',
      summary: 'كل <code>Fragment</code> يدخل الشيدر مع قيم مستوفاة من الرؤوس، ثم يحسب اللون أو العمق أو قد يقرر تجاهل هذا الجزء تمامًا.',
      enters: 'Fragment واحد + القيم المستوفاة مثل اللون أو الإحداثيات أو نتائج العينات.',
      leaves: 'لون خرج وبيانات عمق/ستنسل محتملة قبل الدمج النهائي.',
      remember: 'هذه المرحلة لا تقرأ الشكل كله مرة واحدة؛ بل تعالج كل fragment لوحده.',
      warning: 'الخلط بين <code>Vertex Shader</code> و<code>Fragment Shader</code> خطأ شائع: الأول يحدد أين يقع الشيء، والثاني يحدد كيف يبدو.',
      chips: `${renderProjectReferenceChip('VkPipelineShaderStageCreateInfo')} ${renderProjectReferenceChip('VkPipelineLayout')}`,
      gif: 'assets/pipeline_gifs/stage_fragment_shader.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح معالجة Fragment Shader لكل Fragment على حدة.',
      gifSummary: 'هنا تبدأ الأسئلة البصرية: ما اللون؟ هل أقبل هذا الجزء؟ هل أستخدم خامة أو عمقًا أو مزجًا؟',
      memoryHint: 'احفظها بهذه الجملة: كل fragment يحسب مظهره بنفسه.'
    },
    {
      key: 'output',
      number: '6',
      title: 'Color Output',
      kicker: 'ادمج اللون ثم اكتبه إلى الهدف',
      summary: 'آخر المسار: خرج <code>Fragment Shader</code> لا يقفز مباشرة إلى الشاشة، بل يمر عبر قواعد المزج ثم يكتب إلى <code>Color Attachment</code> داخل <code>Render Pass</code>.',
      enters: 'لون ناتج لكل fragment مع حالة المزج والكتابة.',
      leaves: 'صورة إطار محدثة داخل المرفق اللوني أو ضمن إحدى صور العرض.',
      remember: 'هذه ليست مرحلة حساب مظهر جديد، بل مرحلة اعتماد النتيجة وكتابتها.',
      warning: 'إذا كان <code>Render Pass</code> أو تنسيق المرفق أو إعدادات المزج غير متوافقة، فقد ينجح الشيدر ومع ذلك تكون النتيجة النهائية خاطئة أو فارغة.',
      chips: `${renderProjectReferenceChip('VkPipelineColorBlendStateCreateInfo')} ${renderProjectReferenceChip('VkRenderPass')}`,
      gif: 'assets/pipeline_gifs/stage_color_output.gif?v=20260327stage3dC',
      gifAlt: 'رسم متحرك يوضح كتابة الألوان النهائية إلى Color Attachment.',
      gifSummary: 'هنا يصبح الناتج قابلاً للعرض فعليًا: اللون النهائي يندمج ويُكتب داخل صورة الإطار.',
      memoryHint: 'احفظها بكلمة واحدة: اكتب.'
    }
  ];

  const memoryCards = [
    {
      title: 'اقرأ',
      body: 'ابدأ من الذاكرة: ما شكل الرؤوس في الـ buffer؟ هذا سؤال Vertex Input.'
    },
    {
      title: 'جمّع',
      body: 'بعد فهم الرؤوس، قرر كيف تتحول إلى مثلثات أو خطوط. هذا دور Input Assembly.'
    },
    {
      title: 'حوّل',
      body: 'حرّك الرؤوس إلى مواضعها الصحيحة ثم حوّل الشكل إلى fragments داخل مساحة الرسم.'
    },
    {
      title: 'لوّن واكتب',
      body: 'احسب لون كل fragment ثم ادمجه مع الهدف النهائي داخل Color Attachment.'
    }
  ];

  const anchorCards = [
    {
      title: 'ما الذي يبقى ثابتًا؟',
      body: 'أغلب اختيارات الخط هنا تصف حالة ثابتة تُجهّز مرة ثم يُعاد استخدامها مع أوامر الرسم. هذا هو سبب أن <code>Graphics Pipeline</code> يبدو ضخمًا: لأنه يجمع الوصف الثابت دفعة واحدة.'
    },
    {
      title: 'ما الذي يتكرر لكل Vertex أو Fragment؟',
      body: 'الذي يتكرر فعليًا هو تنفيذ الشيدر على كل رأس أو fragment. أما توصيف كيف يحدث ذلك فيبقى جزءًا من الـ pipeline نفسه.'
    },
    {
      title: 'أين يضيع المبتدئ غالبًا؟',
      body: 'حين يخلط بين إعدادات “كيف تُقرأ البيانات” وبين “كيف تُحسب الألوان”. لهذا السبب قسّمنا المراحل هنا بحسب نوع السؤال الذي تجيب عنه كل واحدة.'
    }
  ];

  return `
    <div class="pipeline-diagram">
      <div class="pipeline-diagram-intro content-card prose-card">
        <p>هذا القسم يشرح <strong>Graphics Pipeline</strong> كممر تعليمي واضح، لا كقائمة حقول طويلة فقط. الفكرة التي يجب أن تثبت في ذهنك هي أن Vulkan لا يسأل: <em>كيف أرسم الآن؟</em> بل يسأل أولاً: <em>ما الوصف الثابت الكامل للمسار الذي ستسلكه البيانات من الرؤوس حتى اللون النهائي؟</em></p>
        <p>لذلك انظر إلى ${renderProjectReferenceChip('VkGraphicsPipelineCreateInfo')} على أنه <strong>خريطة تنفيذ</strong>: من أين تأتي البيانات، كيف تُفهم، كيف تتحول إلى بدائيات، كيف تمر عبر الشيدر، وكيف تُكتب أخيرًا في المرفق اللوني قبل العرض. إذا حفظت هذا التسلسل، يصبح قراءة بقية هياكل Vulkan أسهل بكثير.</p>
      </div>

      <div class="pipeline-memory-strip" aria-label="طريقة حفظ سريعة لمراحل Graphics Pipeline">
        ${memoryCards.map((card, index) => `
          <article class="pipeline-memory-card">
            <div class="pipeline-memory-card-badge">${index + 1}</div>
            <h3>${card.title}</h3>
            <p>${card.body}</p>
          </article>
        `).join('')}
      </div>

      <div class="pipeline-animated-visual" aria-label="رسم متحرك لتدفق مراحل Graphics Pipeline">
        <div class="pipeline-visual-lane lane-geometry">
          <div class="pipeline-visual-node">Vertex Input</div>
          <div class="pipeline-visual-node">Assembly</div>
          <div class="pipeline-visual-node">Vertex Shader</div>
          <div class="pipeline-visual-pulse pulse-1"></div>
        </div>
        <div class="pipeline-visual-lane lane-raster">
          <div class="pipeline-visual-node">Clip</div>
          <div class="pipeline-visual-node">Viewport</div>
          <div class="pipeline-visual-node">Rasterizer</div>
          <div class="pipeline-visual-pulse pulse-2"></div>
        </div>
        <div class="pipeline-visual-lane lane-fragment">
          <div class="pipeline-visual-node">Fragments</div>
          <div class="pipeline-visual-node">Fragment Shader</div>
          <div class="pipeline-visual-node">Blend</div>
          <div class="pipeline-visual-pulse pulse-3"></div>
        </div>
        <div class="pipeline-visual-sidecar">
          <div class="pipeline-sidecar-card">
            <strong>المدخل</strong>
            <span>Byte data أو رؤوس مولدة داخل الشيدر. قبل أي شيء يجب أن يعرف Vulkan كيف يقرأ هذه البيانات فعلًا.</span>
          </div>
          <div class="pipeline-sidecar-card">
            <strong>التحول الأوسط</strong>
            <span>ما بين المدخل والمخرج توجد مرحلتان ذهنيتان مهمتان: <strong>فهم البيانات</strong> ثم <strong>تحويلها إلى أجزاء قابلة للتلوين</strong>.</span>
          </div>
          <div class="pipeline-sidecar-card">
            <strong>المخرجات</strong>
            <span>لون نهائي يكتب إلى <code>Color Attachment</code> داخل ${renderProjectReferenceChip('VkRenderPass')} ثم يصبح قابلاً للتقديم.</span>
          </div>
        </div>
      </div>

      <div class="pipeline-beginner-grid">
        ${anchorCards.map((card) => `
          <article class="content-card prose-card pipeline-beginner-card">
            <h3>${card.title}</h3>
            <p>${card.body}</p>
          </article>
        `).join('')}
      </div>

      <div class="pipeline-gif-hero">
        <figure class="pipeline-gif-card pipeline-gif-card-hero">
          <img src="assets/pipeline_gifs/pipeline_line.gif?v=20260327pipelineheroD" alt="رسم متحرك يوضح انتقال البيانات عبر خط Graphics Pipeline كاملًا من Vertex Input حتى Color Output" loading="lazy" decoding="async">
          <figcaption>
            <div class="pipeline-gif-kicker">الصورة الكبيرة أولًا</div>
            <strong>الخط الكامل للمراحل</strong>
            <span>اتبع النبضة الصفراء وكأنها “حزمة بيانات”: تبدأ كبيانات رأس، ثم تُجمع إلى بدائية، ثم تُعاد صياغتها هندسيًا، ثم تتحول إلى fragments، ثم تُحسب ألوانها، ثم تُكتب النتيجة النهائية في صورة الإطار.</span>
            <ol class="pipeline-hero-points">
              <li>المراحل الأولى تفهم البيانات والهندسة.</li>
              <li>المراحل الوسطى تحول الشكل إلى fragments داخل مساحة الرسم.</li>
              <li>المراحل الأخيرة تحسب اللون وتكتبه في الهدف النهائي.</li>
            </ol>
          </figcaption>
        </figure>
      </div>

      <div class="pipeline-gif-gallery">
        ${stageItems.map((stage) => `
          <figure class="pipeline-gif-card">
            <img src="${stage.gif}" alt="${stage.gifAlt}" loading="lazy" decoding="async">
            <figcaption>
              <div class="pipeline-gif-kicker">المرحلة ${stage.number}</div>
              <strong>${stage.title}</strong>
              <span>${stage.gifSummary}</span>
              <p class="pipeline-gif-memory">${stage.memoryHint}</p>
            </figcaption>
          </figure>
        `).join('')}
      </div>

      <div class="pipeline-stage-track" aria-label="ترتيب مراحل Graphics Pipeline">
        ${stageItems.map((stage) => `
          <article class="pipeline-stage stage-${stage.key}">
            <div class="pipeline-stage-badge">${stage.number}</div>
            <div class="pipeline-stage-kicker">${stage.kicker}</div>
            <h4>${stage.title}</h4>
            <p>${stage.remember}</p>
            <div class="pipeline-stage-meta">${stage.chips}</div>
          </article>
        `).join('')}
      </div>

      <div class="pipeline-stage-detail-grid">
        ${stageItems.map((stage) => `
          <article class="pipeline-stage-detail-card stage-${stage.key}">
            <div class="pipeline-stage-detail-head">
              <div class="pipeline-stage-badge">${stage.number}</div>
              <div class="pipeline-stage-detail-heading">
                <div class="pipeline-stage-kicker">${stage.kicker}</div>
                <h3>${stage.title}</h3>
              </div>
            </div>

            <p class="pipeline-stage-detail-summary">${stage.summary}</p>

            <div class="pipeline-stage-flow-grid">
              <div class="pipeline-stage-flow-card">
                <span>ماذا يدخل؟</span>
                <p>${stage.enters}</p>
              </div>
              <div class="pipeline-stage-flow-card">
                <span>ماذا يخرج؟</span>
                <p>${stage.leaves}</p>
              </div>
            </div>

            <div class="pipeline-stage-memory">
              <strong>طريقة حفظها</strong>
              <p>${stage.remember}</p>
            </div>

            <div class="pipeline-stage-meta">${stage.chips}</div>

            <div class="pipeline-stage-warning">
              <strong>خطأ شائع</strong>
              <p>${stage.warning}</p>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="pipeline-support-grid">
        <div class="content-card prose-card">
          <div class="info-label">Render Pass</div>
          <p>${renderProjectReferenceChip('VkRenderPass')} يحدد شكل المرفقات التي سيكتب إليها الخط، لذلك يجب أن يطابق ما تتوقعه آخر مراحل الإخراج. إذا لم يتفق مع pipeline، فالمشكلة ليست “لونًا خاطئًا” فقط بل قد يفشل الإنشاء أصلًا.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">Pipeline Layout</div>
          <p>${renderProjectReferenceChip('VkPipelineLayout')} يربط <code>Descriptor Sets</code> و<code>Push Constants</code> التي قد تقرأها مراحل الشيدر أثناء التنفيذ. لا يحدد “شكل الرسم” نفسه، بل يحدد ما الموارد التي سيُسمح للشيدر بقراءتها.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">لماذا يُنشأ مسبقًا؟</div>
          <p>لأن Vulkan يريد أن يعرف مبكرًا كيف سيجري التنفيذ، فيستطيع تهيئة الحالة وتجهيز التحسينات الداخلية بدل تبديلها عشوائيًا قبل كل <code>vkCmdDraw</code>.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">متى تغيّر Pipeline؟</div>
          <p>إذا تغيّر الشيدر، أو <code>topology</code>، أو <code>blend state</code>، أو طريقة قراءة الرؤوس، فغالبًا أنت لا تعدل “سطرًا صغيرًا” فقط، بل تبني pipeline آخر لأن معنى المسار كله تغير.</p>
        </div>
      </div>

      <div class="pipeline-recall-board content-card prose-card">
        <h3>طريقة حفظ سريعة للمراحل الست</h3>
        <ol class="pipeline-recall-list">
          <li><strong>Vertex Input:</strong> افهم البايتات كحقول.</li>
          <li><strong>Input Assembly:</strong> اجمع الرؤوس إلى بدائية.</li>
          <li><strong>Vertex Shader:</strong> احسب موضع كل رأس.</li>
          <li><strong>Viewport + Rasterizer:</strong> حوّل الشكل إلى fragments داخل مساحة الرسم.</li>
          <li><strong>Fragment Shader:</strong> احسب لون كل جزء.</li>
          <li><strong>Color Output:</strong> ادمج اللون واكتبه إلى الهدف النهائي.</li>
        </ol>
        <p class="pipeline-recall-note">إذا حفظت هذا الترتيب كرحلة متتابعة من المدخل إلى المخرج، ستصبح قراءة حقول <code>VkGraphicsPipelineCreateInfo</code> أقرب إلى قراءة قصة تنفيذ كاملة لا قائمة إعدادات متفرقة.</p>
      </div>
    </div>
  `;
}

function getImguiReferenceSupplement(name) {
  const vectorInput = (count) => buildImguiGenericFunctionSupplement({
    name,
    signature: `bool ${name}(const char* label, float v[${count}], const char* format = "%.3f", ImGuiInputTextFlags flags = 0);`,
    scenario: `تريد تحرير ${count} قيم عشرية مترابطة داخل سطر واحد مثل position أو UV أو color channels.`,
    code: `${name}("Value", values);`,
    explanation: `تعرض ${name} ${count} حقول إدخال مترابطة وتكتب القيم الجديدة مباشرة داخل المصفوفة التي يملكها التطبيق.`,
    expectedResult: `تظهر ${count} خانات متجاورة يمكن تعديل كل قيمة منها مباشرة مع بقاءها جزءاً من متجه واحد.`,
    importantNote: 'هذه الدالة تعدل المصفوفة الخارجية مباشرة، لذلك يجب أن تبقى الذاكرة صالحة طوال فترة الاستخدام.',
    realMeaning: `ليست ${name} قيمة مفردة، بل واجهة تحرير سريعة لمجموعة أرقام مترابطة عادة تمثل متجهاً أو لوناً أو إزاحة.`,
    whenToUse: 'استخدمها عندما تكون القيم مرتبطة مفهوماً ويحتاج المستخدم رؤيتها وتعديلها معاً في سطر واحد.',
    practicalBenefit: 'تقلل التفكك البصري مقارنةً بوضع عدة InputFloat منفصلة، وتوضح أن القيم جزء من بنية واحدة.',
    misuseImpact: 'إذا مررت حجماً خاطئاً أو استخدمت الواجهة لقيم غير مترابطة ستصبح القراءة والتحرير مربكين.',
    related: ['ImGui::InputFloat', 'ImGui::DragFloat2', 'ImGui::DragFloat3', 'ImGui::DragFloat4'],
    notes: ['القيم تحفظ في التطبيق لا داخل Dear ImGui.', 'يمكن تغيير format لإظهار عدد منازل أقل أو أكثر.']
  });

  const vectorDrag = (count) => buildImguiGenericFunctionSupplement({
    name,
    signature: `bool ${name}(const char* label, float v[${count}], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", ImGuiSliderFlags flags = 0);`,
    scenario: `تريد تعديل ${count} قيم عشرية مرتبطة عبر السحب السريع بدل الكتابة النصية، مثل transform أو UV أو bounds.`,
    code: `${name}("Position", values, 0.1f);`,
    explanation: `تعرض ${name} مجموعة خانات قابلة للسحب أفقيًا، بحيث يترجم Dear ImGui حركة المؤشر إلى زيادة أو نقصان تدريجي في القيم.`,
    expectedResult: `يمكن للمستخدم سحب كل خانة يميناً أو يساراً لتغيير القيم بسرعة مع بقاء المتجه في سطر واحد.`,
    importantNote: 'سرعة السحب v_speed تؤثر كثيراً في قابلية التحكم، لذلك اضبطها وفق مقياس بياناتك الحقيقي.',
    realMeaning: 'هذه الدالة مناسبة عندما تكون السرعة في التعديل أهم من الدقة النصية، خصوصاً في أدوات التحرير التفاعلية.',
    whenToUse: 'استخدمها في Inspector أو محرر مشهد أو خصائص مادة تحتاج تعديلاً سريعاً ومستمرًا للقيم.',
    practicalBenefit: 'تجعل التعديل أسرع من InputFloat* عند العمل التجريبي المتكرر على القيم.',
    misuseImpact: 'إذا كانت الحدود أو السرعة غير مناسبة فقد تصبح القيم شديدة الحساسية أو بطيئة بشكل مزعج.',
    related: ['ImGui::DragFloat', 'ImGui::InputFloat2', 'ImGui::InputFloat3', 'ImGui::InputFloat4'],
    notes: ['السحب لا يحفظ الحالة داخل المكتبة؛ القيمة النهائية تبقى في متغير التطبيق.', 'يمكن دمجها مع أزرار reset أو snapping حسب الحاجة.']
  });

  const shared = {
    'ImGui::SliderInt': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::SliderInt(const char* label, int* v, int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);',
      scenario: 'تريد ضبط قيمة صحيحة ضمن مجال محدد مثل sample count أو quality level أو عدد iterations.',
      code: 'ImGui::SliderInt("Samples", &samples, 1, 128);',
      explanation: 'ترسم SliderInt منزلقًا يربط موضع المقبض بقيمة صحيحة داخل المجال المحدد ثم يكتبها في متغير التطبيق.',
      expectedResult: 'يتحرك المقبض على الشريط بينما تبقى القيمة النهائية عددًا صحيحًا فقط.',
      importantNote: 'هذه الأداة مناسبة للقيم الصحيحة ذات المجال الواضح، لا للنصوص الحرة أو القيم العشرية.',
      realMeaning: 'هي أداة اختيار عددي مضبوط أكثر من كونها مجرد حقل إدخال، لأن المستخدم يرى المجال كله أمامه.',
      whenToUse: 'استخدمها عندما يعرف المستخدم أن القيمة تقع بين حدين واضحين وتحتاج سحبًا بصريًا مريحًا.',
      practicalBenefit: 'تعطي إحساسًا أوضح بالمجال الكامل من InputInt وتقلل إدخال قيم خارج النطاق.',
      misuseImpact: 'إذا كان المجال واسعًا جداً أو غير منطقي بصريًا فستصبح القراءة والسحب غير مريحين.'
    }),
    'ImGui::DragInt': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::DragInt(const char* label, int* v, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", ImGuiSliderFlags flags = 0);',
      scenario: 'تريد تعديل قيمة صحيحة بسرعة عبر السحب الأفقي بدل الكتابة أو المنزلق التقليدي، مثل level أو index أو tile count.',
      code: 'ImGui::DragInt("Level", &level, 1.0f, 0, 20);',
      explanation: 'ترسم DragInt خانة عددية صحيحة يمكن سحبها أفقيًا لزيادة القيمة أو إنقاصها بخطوات مناسبة يحددها v_speed.',
      expectedResult: 'يستطيع المستخدم سحب القيمة يمينًا أو يسارًا لتغييرها بسرعة مع بقاء الناتج عددًا صحيحًا.',
      importantNote: 'هذه الدالة مناسبة عندما تريد سرعة في التعديل أكثر من تمثيل المجال كاملًا كما في SliderInt.',
      realMeaning: 'هي واجهة تعديل عددي discrete تعتمد على السحب، وتربط حركة المؤشر مباشرة بقيمة int يملكها التطبيق.',
      whenToUse: 'استخدمها في المحررات ولوحات الخصائص التي تحتاج ضبط قيم صحيحة مرارًا أثناء التجريب السريع.',
      practicalBenefit: 'أسرع من InputInt في التعديل المتكرر، وأقل ازدحامًا من SliderInt عندما لا تحتاج شريطًا كاملًا.',
      misuseImpact: 'إذا كانت سرعة السحب أو الحدود غير مناسبة فقد تقفز القيم كثيرًا أو تصبح بطيئة بشكل مزعج.',
      related: ['ImGui::InputInt', 'ImGui::SliderInt', 'ImGui::DragFloat'],
      notes: ['القيمة تعدل مباشرة داخل المتغير الخارجي.', 'يمكن تحديد حدود min/max أو تركها مفتوحة حسب الحالة.']
    }),
    'ImGui::PushStyleColor': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::PushStyleColor(ImGuiCol idx, ImU32 col);',
      scenario: 'تريد تغيير لون عنصر أو مجموعة عناصر مؤقتًا داخل نطاق معين ثم العودة للنمط السابق بعد انتهاء الرسم.',
      code: 'ImGui::PushStyleColor(ImGuiCol_Button, IM_COL32(90, 144, 220, 255));',
      explanation: 'تدفع PushStyleColor قيمة لونية جديدة إلى مكدس الستايل بحيث تستخدمها العناصر اللاحقة إلى أن تستدعي PopStyleColor.',
      expectedResult: 'العناصر التالية داخل النطاق ترسم باللون المؤقت الجديد ثم تعود للوضع السابق بعد PopStyleColor.',
      importantNote: 'كل PushStyleColor يحتاج PopStyleColor متوازناً وإلا ستتسرب أنماط غير مقصودة إلى بقية الواجهة.',
      realMeaning: 'هذه الدالة لا تعدل theme العام دائماً، بل تنشئ override موضعيًا ومؤقتًا في المكدس.',
      whenToUse: 'استخدمها لإبراز حالة تحذير أو نجاح أو تلوين مجموعة عناصر داخل جزء صغير من الواجهة.',
      practicalBenefit: 'تعطيك تخصيصًا مرنًا من دون إعادة بناء theme كامل أو تغيير الألوان العامة للتطبيق.',
      misuseImpact: 'نسيان PopStyleColor سيؤدي إلى ألوان مكسورة أو ممتدة إلى عناصر لا تقصدها.',
      related: ['ImGui::PopStyleColor', 'ImGui::ColorEdit4'],
      notes: ['التأثير يبدأ من العنصر التالي بعد الاستدعاء.', 'يمكن تكديس أكثر من لون مؤقت عند الحاجة.']
    }),
    'ImGui::SliderAngle': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::SliderAngle(const char* label, float* v_rad, float v_degrees_min = -360.0f, float v_degrees_max = +360.0f, const char* format = "%.0f deg");',
      scenario: 'تريد تعديل زاوية محفوظة بالراديان داخل التطبيق لكن عرضها للمستخدم بالدرجات.',
      code: 'ImGui::SliderAngle("Light Angle", &angle_rad, -180.0f, 180.0f);',
      explanation: 'تعرض SliderAngle قيمة زاوية للمستخدم بالدرجات، لكنها تقرأ وتكتب المتغير الداخلي عادة بوحدة الراديان.',
      expectedResult: 'يرى المستخدم زاوية قابلة للسحب بوحدة مألوفة مثل 45deg أو 180deg مع بقاء المتغير الداخلي قابلاً للاستخدام الرياضي.',
      importantNote: 'احسم مبكرًا هل بقية الكود يعمل بالراديان أو بالدرجات حتى لا يحدث خلط أثناء الحسابات.',
      realMeaning: 'هي طبقة تحويل واجهي بين تمثيل برمجي مناسب للحسابات وتمثيل بصري مناسب للبشر.',
      whenToUse: 'استخدمها في الإضاءة والدوران والكاميرا والمؤشرات الاتجاهية.',
      practicalBenefit: 'تمنع الالتباس على المستخدم عندما تكون الحسابات داخل الكود بالراديان لكن الفهم البشري بالدرجات.',
      misuseImpact: 'إذا عاملت القيمة الخارجة كأنها درجات بينما المتغير راديان ستظهر أخطاء دوران واضحة.'
    }),
    'ImGui::Image': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::Image(ImTextureID user_texture_id, const ImVec2& image_size);',
      scenario: 'تريد عرض texture أو thumbnail أو framebuffer preview داخل النافذة الحالية.',
      code: 'ImGui::Image(texture_id, ImVec2(160.0f, 90.0f));',
      explanation: 'تعرض ImGui::Image مورداً رسوميًا جاهزًا عبر ImTextureID داخل التخطيط الحالي من دون سلوك نقر افتراضي.',
      expectedResult: 'تظهر صورة أو thumbnail أو معاينة render target داخل النافذة بالحجم المطلوب.',
      importantNote: 'Dear ImGui لا تنشئ texture لك هنا؛ يجب أن يكون ImTextureID صالحًا وجاهزًا من renderer backend أو المحرك.',
      realMeaning: 'هي عنصر عرض فقط، وليست زرًا أو أداة اختيار إلا إذا أضفت سلوكاً خارجيًا فوقها.',
      whenToUse: 'استخدمها للمعاينات، المصغرات، والمحتوى الرسومي الذي يحتاج رؤية مباشرة داخل الواجهة.',
      practicalBenefit: 'تربط أدواتك بالمحتوى البصري الحقيقي داخل نفس النافذة من دون الانتقال إلى viewport منفصل.',
      misuseImpact: 'إذا كان المعرف الرسومي غير صالح أو انتهى عمر المورد فستظهر صورة مكسورة أو نتائج غير متوقعة.'
    }),
    'ImGui::ImageButton': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::ImageButton(const char* str_id, ImTextureID user_texture_id, const ImVec2& image_size);',
      scenario: 'تريد أن تكون الصورة نفسها زرًا قابلاً للنقر مثل أداة أو thumbnail أو رمز مشهد.',
      code: 'if (ImGui::ImageButton("preview_btn", texture_id, ImVec2(96.0f, 64.0f))) { /* ... */ }',
      explanation: 'ترسم ImGui::ImageButton مورداً رسوميًا كسطح زر وتعيد true عند تفعيله بالنقر.',
      expectedResult: 'تظهر صورة قابلة للتفاعل يمكن النقر عليها مثل أي Button لكن بمظهر texture أو thumbnail.',
      importantNote: 'حدد ID فريدًا إذا تكررت نفس الصورة أكثر من مرة داخل القائمة.',
      realMeaning: 'هي دمج بين العرض البصري والسلوك التفاعلي في عنصر واحد.',
      whenToUse: 'استخدمها في متصفحات الأصول، وأشرطة الأدوات المصورة، والاختيارات المصغرة.',
      practicalBenefit: 'تقلل الحاجة إلى صورة ثم زر منفصل، وتدعم التصفح البصري السريع.',
      misuseImpact: 'إذا أهملت تمييز المعرفات أو لم توضّح حالة التحديد بصريًا فسيصبح التفاعل ملتبسًا.'
    }),
    'ImGui::SetNextWindowPos': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::SetNextWindowPos(const ImVec2& pos, ImGuiCond cond = 0, const ImVec2& pivot = ImVec2(0,0));',
      scenario: 'تريد ضبط موضع النافذة التالية قبل Begin مثل لوحة عائمة أو popup أو نافذة Inspector محفوظة الموضع.',
      code: 'ImGui::SetNextWindowPos(ImVec2(620.0f, 90.0f));',
      explanation: 'تحدد SetNextWindowPos موضع النافذة التالية قبل فتحها عبر Begin أو BeginPopup أو ما شابه.',
      expectedResult: 'تظهر النافذة في الموضع الذي حددته بدل الاعتماد فقط على الموضع المحفوظ أو الافتراضي.',
      importantNote: 'التأثير يخص النافذة التالية فقط، لذلك يجب استدعاؤها قبل Begin مباشرة.',
      realMeaning: 'هي إعداد مسبق للنافذة القادمة وليس تعديلًا مباشرًا لنافذة مفتوحة بالفعل.',
      whenToUse: 'استخدمها للنوافذ العائمة، وشاشات البداية، وtooltips المخصصة، والحالات التي تحتاج تموضعًا حتميًا.',
      practicalBenefit: 'تعطي تحكمًا دقيقًا في التموضع وتساعد في بناء layouts موجهة أو متحركة.',
      misuseImpact: 'إذا استدعيتها في مكان غير منضبط داخل الحلقة فستصبح النافذة تقفز أو تناقض تموضع المستخدم.'
    }),
    'ImGui::SetNextWindowSize': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::SetNextWindowSize(const ImVec2& size, ImGuiCond cond = 0);',
      scenario: 'تريد تحديد حجم النافذة التالية قبل Begin مثل modal أو panel أو نافذة إعدادات أولية.',
      code: 'ImGui::SetNextWindowSize(ImVec2(420.0f, 260.0f));',
      explanation: 'تحدد SetNextWindowSize الأبعاد المطلوبة للنافذة القادمة قبل بنائها في هذا الإطار.',
      expectedResult: 'تظهر النافذة بالحجم المحدد بدل الحجم الافتراضي أو السابق.',
      importantNote: 'مثل SetNextWindowPos، هذه الدالة تعمل على النافذة التالية فقط.',
      realMeaning: 'هي مرحلة تجهيز تخطيطي للنافذة قبل فتح النطاق، لا تعديل لاحق بعد الرسم.',
      whenToUse: 'استخدمها مع الحوارات، واللوحات العائمة، ومساحات العمل التي تحتاج حجمًا ابتدائيًا واضحًا.',
      practicalBenefit: 'تجعل شكل النافذة متوقعًا منذ الفتح الأول وتقلل الاعتماد على القيم الضمنية.',
      misuseImpact: 'إساءة استخدامها في كل إطار قد تمنع المستخدم من إعادة تحجيم النافذة بحرية.'
    }),
    'ImGui::BeginPopupModal': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::BeginPopupModal(const char* name, bool* p_open = NULL, ImGuiWindowFlags flags = 0);',
      scenario: 'تريد حوار تأكيد أو نافذة قرار توقف التفاعل مع الخلفية حتى يختار المستخدم متابعة أو إلغاء.',
      code: 'if (ImGui::BeginPopupModal("Delete Asset")) { /* ... */ ImGui::EndPopup(); }',
      explanation: 'تفتح BeginPopupModal نطاق popup modal يحجب التفاعل مع بقية الواجهة حتى يغلق المستخدم الحوار.',
      expectedResult: 'تظهر نافذة قرار مركزية مع تعتيم أو حجز واضح للسياق الخلفي.',
      importantNote: 'يجب إغلاق النطاق بـ EndPopup، وإغلاق الحوار فعليًا يتم غالبًا عبر CloseCurrentPopup أو تغيير الحالة المرتبطة.',
      realMeaning: 'هي حوار blocking على مستوى الواجهة، لا مجرد popup صغيرة منبثقة.',
      whenToUse: 'استخدمها لتأكيد الحذف، وحوارات الخطأ، والقرارات الحرجة التي لا تريد تفويت الانتباه إليها.',
      practicalBenefit: 'تجعل القرار الحرج واضحًا ومقصودًا للمستخدم بدل أن يضيع داخل نافذة عادية.',
      misuseImpact: 'إذا استخدمتها لأمور بسيطة فستجعل التدفق مزعجًا وثقيلاً على المستخدم.'
    }),
    'ImGui::CloseCurrentPopup': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::CloseCurrentPopup();',
      scenario: 'أنت داخل popup أو modal وانتهيت من تنفيذ القرار وتريد إغلاقها فورًا.',
      code: 'if (ImGui::Button("OK")) { ApplyChanges(); ImGui::CloseCurrentPopup(); }',
      explanation: 'تغلق CloseCurrentPopup النافذة المنبثقة الحالية من داخل نطاقها بعد تنفيذ الإجراء المطلوب.',
      expectedResult: 'تختفي popup الحالية مباشرة وتعود بقية الواجهة إلى سياقها الطبيعي.',
      importantNote: 'يجب أن تُستدعى من داخل popup الحالية حتى يكون السلوك واضحًا ومتسقًا.',
      realMeaning: 'هي أمر تحكم في دورة حياة popup الحالية وليس بناء عنصر بصري جديد.',
      whenToUse: 'استخدمها بعد أزرار OK/Cancel أو عند اكتمال خطوة داخل modal.',
      practicalBenefit: 'تبقي منطق الفتح والإغلاق قريبًا من مكان اتخاذ القرار داخل الواجهة.',
      misuseImpact: 'إذا خلطت بينها وبين تغيير الحالات الخارجية فقط فقد تبقى popup مفتوحة رغم اكتمال الإجراء أو العكس.'
    }),
    'ImGui::GetCursorPos': buildImguiGenericFunctionSupplement({
      name,
      signature: 'ImVec2 ImGui::GetCursorPos();',
      scenario: 'تريد معرفة موضع المؤشر التخطيطي الحالي داخل النافذة قبل رسم عنصر مخصص أو حساب layout داخلي.',
      code: 'ImVec2 cursor = ImGui::GetCursorPos();',
      explanation: 'تعيد GetCursorPos موضع الإدراج الحالي بالنسبة إلى مساحة النافذة أو الحاوية الحالية.',
      expectedResult: 'تحصل على إحداثيات يمكن استخدامها لحساب مواضع عناصر لاحقة أو رسوم مخصصة.',
      importantNote: 'هذه الإحداثيات محلية داخل النافذة، وليست بالضرورة إحداثيات الشاشة الكاملة.',
      realMeaning: 'هي قراءة لحالة التخطيط الحالية، لا قراءة لموضع الماوس أو عنصر مرئي خارجي.',
      whenToUse: 'استخدمها عندما تحتاج حساب تخطيط نسبي أو محاذاة دقيقة لعناصر يدوية.',
      practicalBenefit: 'تساعد في فهم مكان إدراج العنصر التالي داخل layout الحالي.',
      misuseImpact: 'الخلط بينها وبين إحداثيات الشاشة سيؤدي إلى تموضع خاطئ للعناصر المخصصة.'
    }),
    'ImGui::SetCursorPos': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::SetCursorPos(const ImVec2& local_pos);',
      scenario: 'تريد نقل نقطة إدراج العنصر التالي إلى موضع محلي محدد داخل النافذة الحالية.',
      code: 'ImGui::SetCursorPos(ImVec2(24.0f, 84.0f));',
      explanation: 'تنقل SetCursorPos موضع المؤشر التخطيطي المحلي داخل النافذة بحيث يبدأ العنصر التالي من هذه الإحداثيات.',
      expectedResult: 'يظهر العنصر التالي في موضع مخصص داخل نفس النافذة بدل التدفق المعتاد.',
      importantNote: 'الدالة تضبط موضع التخطيط المحلي، لذلك استخدمها بحذر حتى لا تكسر الإيقاع الطبيعي للواجهة.',
      realMeaning: 'هي تعديل مباشر لحالة layout الحالية وليس مجرد تلميح جمالي.',
      whenToUse: 'استخدمها في المكونات المركبة والرسوم المخصصة والمعاينات التي تحتاج محاذاة يدوية.',
      practicalBenefit: 'تعطيك حرية أكبر في بناء layouts خاصة داخل ImGui.',
      misuseImpact: 'الاستخدام المفرط سيجعل الواجهة هشة وصعبة الصيانة إذا كان التخطيط يمكن بناؤه بطريقة أبسط.'
    }),
    'ImGui::BeginTooltip': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::BeginTooltip();',
      scenario: 'تريد بناء tooltip مركبة تحتوي أكثر من سطر أو عناصر إضافية بدل الاعتماد على SetTooltip النصية فقط.',
      code: 'if (ImGui::BeginTooltip()) { ImGui::Text("Name"); ImGui::EndTooltip(); }',
      explanation: 'تبدأ BeginTooltip نافذة شرح عائمة صغيرة يمكن ملؤها بمحتوى مخصص ثم إغلاقها عبر EndTooltip.',
      expectedResult: 'تظهر tooltip غنية عند تحقق شرط التحويم أو التركيز داخل الإطار الحالي.',
      importantNote: 'يجب إغلاق النطاق بـ EndTooltip بعد اكتمال المحتوى.',
      realMeaning: 'هي popup توضيحية خفيفة تبنيها يدويًا داخل الإطار عند الحاجة.',
      whenToUse: 'استخدمها عندما تحتاج أكثر من سطر أو أيقونات أو قيم متعددة داخل tooltip واحدة.',
      practicalBenefit: 'تعطي شروحاً أوضح للمبتدئ من tooltip النصية المختصرة جداً.',
      misuseImpact: 'إذا ملأتها بمحتوى طويل أو ظهرت بلا شرط واضح ستصبح مزعجة وتغطي أجزاء مهمة من الواجهة.'
    }),
    'ImGui::EndTooltip': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::EndTooltip();',
      scenario: 'أنهيت محتوى tooltip الحالية وتريد إغلاق نطاقها بشكل متوازن.',
      code: 'ImGui::EndTooltip();',
      explanation: 'تغلق EndTooltip نافذة tooltip الحالية وتعيد السياق التخطيطي إلى النافذة الأصلية.',
      expectedResult: 'يُغلق محتوى الشرح العائم بنهاية متوازنة ويستمر بناء بقية الواجهة في موضعها الصحيح.',
      importantNote: 'كل BeginTooltip يحتاج EndTooltip مقابلة.',
      realMeaning: 'هي دالة إغلاق نطاق، لا عنصرًا مرئيًا مستقلاً.',
      whenToUse: 'استخدمها دائمًا بعد BeginTooltip داخل نفس الفرع المنطقي.',
      practicalBenefit: 'تحافظ على توازن مكدس النوافذ وتمنع فساد التخطيط.',
      misuseImpact: 'نسيانها سيكسر النطاق الحالي ويؤدي إلى سلوك غير متوقع في بقية الواجهة.'
    }),
    'ImGui::IsMouseDown': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::IsMouseDown(ImGuiMouseButton button);',
      scenario: 'تريد معرفة ما إذا كان زر الفأرة ما زال مضغوطًا في هذه اللحظة لبناء سحب أو تكرار أو تحكم مستمر.',
      code: 'if (ImGui::IsMouseDown(ImGuiMouseButton_Left)) { /* dragging */ }',
      explanation: 'تعيد IsMouseDown حالة الضغط المستمرة الحالية لزر الفأرة المطلوب داخل هذا الإطار.',
      expectedResult: 'يمكنك تفعيل منطق يعتمد على استمرار الضغط لا على حدث النقر مرة واحدة فقط.',
      importantNote: 'هذه ليست IsMouseClicked؛ فهي تقرأ الاستمرار الحالي لا اللحظة الأولى للضغط.',
      realMeaning: 'هي دالة polling لحالة الإدخال المباشرة داخل الإطار.',
      whenToUse: 'استخدمها في السحب، والرسم اليدوي، والتحكم المستمر أثناء الضغط.',
      practicalBenefit: 'تفصل بين الضغط المستمر وبين النقر اللحظي، وهو فرق مهم في أدوات التفاعل.',
      misuseImpact: 'إذا استخدمتها مكان دوال النقر اللحظي فقد يتكرر الإجراء كل إطار بشكل غير مقصود.'
    }),
    'ImGui::IsKeyDown': buildImguiGenericFunctionSupplement({
      name,
      signature: 'bool ImGui::IsKeyDown(ImGuiKey key);',
      scenario: 'تريد معرفة ما إذا كان مفتاح ما ما زال مضغوطًا الآن لبناء حركة مستمرة أو اختصارات تعتمد على الاستمرار.',
      code: 'if (ImGui::IsKeyDown(ImGuiKey_W)) { /* move forward */ }',
      explanation: 'تعيد IsKeyDown حالة الضغط الحالية للمفتاح المحدد داخل الإطار الجاري.',
      expectedResult: 'يمكن للتطبيق تنفيذ منطق مستمر ما دام المفتاح مضغوطًا.',
      importantNote: 'تختلف عن IsKeyPressed التي تلتقط الانتقال الأول للضغط فقط.',
      realMeaning: 'هي قراءة مباشرة لحالة لوحة المفاتيح الحالية بعد أن تغذي backends ImGuiIO.',
      whenToUse: 'استخدمها للحركة المستمرة والتنقل والاختصارات التي تعتمد على استمرار المفتاح.',
      practicalBenefit: 'تمنحك تحكمًا واضحًا في السلوك المستمر بدل تكرار أحداث غير مستقرة يدويًا.',
      misuseImpact: 'إذا استُخدمت مكان IsKeyPressed فقد تُطلق الإجراء عشرات المرات أثناء استمرار الضغط.'
    }),
    'ImGui::EndTable': buildImguiGenericFunctionSupplement({
      name,
      signature: 'void ImGui::EndTable();',
      scenario: 'انتهيت من جميع صفوف وأعمدة الجدول الحالي وتحتاج إغلاق نطاقه قبل متابعة بقية الواجهة.',
      code: 'ImGui::EndTable();',
      explanation: 'تغلق EndTable سياق الجدول الحالي بعد اكتمال بناء الصفوف والأعمدة.',
      expectedResult: 'يُغلق الجدول بشكل متوازن وتعود العناصر اللاحقة إلى تخطيط النافذة العادي.',
      importantNote: 'كل BeginTable ناجحة تحتاج EndTable مقابلة.',
      realMeaning: 'هي نقطة إغلاق لبنية تخطيط كاملة، لا مجرد سطر أخير في الجدول.',
      whenToUse: 'استخدمها دائمًا بعد الفراغ من بناء الجدول في نفس الفرع الذي نجح فيه BeginTable.',
      practicalBenefit: 'تحافظ على سلامة مكدس الجداول وتمنع فساد التخطيط اللاحق.',
      misuseImpact: 'نسيانها سيكسر هيكل الجدول ويؤدي إلى نتائج رسم غير مستقرة.'
    })
  };

  if (shared[name]) {
    return shared[name];
  }

  if (name === 'ImGui::InputFloat2') return vectorInput(2);
  if (name === 'ImGui::InputFloat3') return vectorInput(3);
  if (name === 'ImGui::InputFloat4') return vectorInput(4);
  if (name === 'ImGui::DragFloat2') return vectorDrag(2);
  if (name === 'ImGui::DragFloat3') return vectorDrag(3);
  if (name === 'ImGui::DragFloat4') return vectorDrag(4);

  if (['ImGui::Columns', 'ImGui::NextColumn', 'ImGui::GetColumnWidth'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}(...)`,
      scenario: 'تريد بناء تخطيط أعمدة قديم أو بسيط داخل نافذة واحدة ثم التنقل بين الأعمدة وقراءة عرضها.',
      code: 'ImGui::Columns(3); ImGui::NextColumn(); float w = ImGui::GetColumnWidth();',
      explanation: 'تعمل هذه الدوال معًا على تنظيم التخطيط في أعمدة، والتنقل بين الأعمدة الحالية، وقراءة عرض كل عمود عند الحاجة.',
      expectedResult: 'يمكن عرض المحتوى في عدة أعمدة داخل نفس النافذة مع معرفة متى تنتقل إلى العمود التالي وما عرضه الحالي.',
      importantNote: 'هذه واجهة أقدم من نظام الجداول الحديث، لذلك فضّل BeginTable عندما تحتاج إمكانات أكثر.',
      realMeaning: 'هي أدوات تخطيط أعمدة بسيطة وسريعة أكثر من كونها نظام جدولي غني.',
      whenToUse: 'استخدمها للمخططات البسيطة أو عند صيانة كود قديم يعتمد Columns.',
      practicalBenefit: 'تسمح بتقسيم المحتوى بسرعة من دون بناء Table كاملة في الحالات البسيطة.',
      misuseImpact: 'إذا استخدمتها في جداول معقدة فستصل بسرعة إلى حدودها مقارنةً بـ BeginTable.'
    });
  }

  if (['ImGui::EndTabBar', 'ImGui::EndTabItem'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}();`,
      scenario: 'انتهيت من بناء محتوى التبويب أو حاوية التبويبات وتريد إغلاق النطاق الحالي بشكل متوازن.',
      code: `${name}();`,
      explanation: `تغلق ${name} النطاق المفتوح سابقًا من BeginTabBar أو BeginTabItem حتى يعود التخطيط إلى مستواه الصحيح.`,
      expectedResult: 'ينتهي بناء التبويب الحالي أو الشريط كله ويستمر المحتوى اللاحق خارج هذا النطاق.',
      importantNote: 'يجب استدعاؤها فقط إذا كانت BeginTabBar أو BeginTabItem قد نجحت فعلاً.',
      realMeaning: 'هي جزء من توازن مكدس التبويبات داخل Dear ImGui.',
      whenToUse: 'استخدمها دائمًا بعد إكمال محتوى التبويبات المفتوحة.',
      practicalBenefit: 'تحافظ على هيكل التبويبات سليمًا وقابلًا للفهم والصيانة.',
      misuseImpact: 'نسيانها أو استدعاؤها في مسار منطقي غير متوازن سيؤدي إلى فساد تخطيط الصفحة.'
    });
  }

  if (['ImGui::Separator', 'ImGui::Spacing', 'ImGui::NewLine'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}();`,
      scenario: 'تريد ضبط إيقاع التخطيط الحالي عبر فصل بصري أو فراغ أو الانتقال إلى سطر جديد.',
      code: `${name}();`,
      explanation: `تغير ${name} مسار التخطيط الحالي من دون إنشاء widget بيانات مستقلة؛ فهي أداة تنظيم وقراءة بصرية للمحتوى.`,
      expectedResult: 'يصبح المحتوى أوضح عبر سطر جديد أو فراغ أو خط فاصل بين المجموعات.',
      importantNote: 'هذه الدوال لا تخزن حالة منطقية؛ أثرها يقتصر على layout الحالي.',
      realMeaning: 'هي أدوات micro-layout تساعد في جعل الواجهة أقل تزاحمًا وأكثر ترتيبًا.',
      whenToUse: 'استخدمها عندما يصبح المحتوى مزدحمًا أو تحتاج فصلًا بين مجموعات متجاورة.',
      practicalBenefit: 'تحسن القراءة البصرية من دون بناء حاويات إضافية معقدة.',
      misuseImpact: 'الإفراط في استخدامها سيجعل التخطيط مفككًا وعشوائيًا بدل أن يكون منظمًا.'
    });
  }

  if (['ImGui::PushID', 'ImGui::PopID', 'ImGui::GetID'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}(...)`,
      scenario: 'تعمل داخل حلقات أو قوائم بعناصر متشابهة وتحتاج IDs مستقرة لتجنب التصادم بين widgets.',
      code: 'ImGui::PushID(i); ImGui::Button("Select"); ImGui::PopID();',
      explanation: 'تساعد هذه الدوال على بناء أو قراءة هوية داخلية فريدة للعناصر عندما لا تكفي التسميات الظاهرة وحدها.',
      expectedResult: 'تبقى العناصر المتشابهة قابلة للتفاعل بشكل صحيح من دون تعارض معرفات.',
      importantNote: 'PushID وPopID يجب أن يبقيا متوازنين، وGetID مفيد عندما تحتاج الوصول إلى نفس آلية التوليد يدويًا.',
      realMeaning: 'المعرف الداخلي في Dear ImGui هو أساس ربط التفاعل بالحالة، وليس تفصيلاً ثانويًا.',
      whenToUse: 'استخدمها في القوائم المتكررة، وgrids، والمكونات المتشابهة، والواجهات المبنية بحلقات.',
      practicalBenefit: 'تمنع التصادمات الصامتة التي تجعل عناصر مختلفة تتصرف وكأنها عنصر واحد.',
      misuseImpact: 'إذا كانت المعرفات غير مستقرة أو غير متوازنة ستظهر سلوكيات تفاعل مربكة وصعبة التتبع.'
    });
  }

  if (['ImGui::BeginMenu', 'ImGui::EndMenu', 'ImGui::MenuItem'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}(...)`,
      scenario: 'تبني قائمة علوية أو فرعية داخل محرر أو شريط أوامر وتحتاج تنظيم الأوامر هرميًا.',
      code: 'if (ImGui::BeginMenu("File")) { ImGui::MenuItem("Save"); ImGui::EndMenu(); }',
      explanation: 'تعمل هذه الدوال معًا لبناء فروع القوائم وعناصرها ثم إغلاقها ضمن شريط أو popup أو menu context.',
      expectedResult: 'يحصل المستخدم على قوائم هرمية يمكن فتحها واختيار أوامرها بشكل متوقع.',
      importantNote: 'BeginMenu وEndMenu يحتاجان توازنًا منطقيًا، وMenuItem يجب أن ترتبط بحالة أو إجراء حقيقي.',
      realMeaning: 'هي طبقة تنظيم للأوامر، لا مجرد نصوص متجاورة داخل الواجهة.',
      whenToUse: 'استخدمها في menu bars، وcontext menus، وواجهات المحررات.',
      practicalBenefit: 'تجعل الأوامر الكبيرة قابلة للاكتشاف والتنظيم بدل بعثرتها في الأزرار.',
      misuseImpact: 'القوائم غير المنظمة أو غير المرتبطة بحالات فعلية ستبدو شكلية وغير مفيدة.'
    });
  }

  if (['ImGui::TableNextRow', 'ImGui::TableNextColumn'].includes(name)) {
    return buildImguiGenericFunctionSupplement({
      name,
      signature: `${name}(...)`,
      scenario: 'أنت داخل BeginTable وتريد الانتقال إلى صف جديد أو عمود جديد أثناء ملء الخلايا.',
      code: 'ImGui::TableNextRow(); ImGui::TableNextColumn();',
      explanation: 'تتحكم هذه الدوال في المؤشر الداخلي للجدول، فتحدد متى يبدأ الصف الجديد ومتى تنتقل الخلية إلى العمود التالي.',
      expectedResult: 'يُبنى الجدول بخلايا مرتبة بوضوح بدل الاعتماد على تخطيط خطي عادي.',
      importantNote: 'معناها يظهر فقط داخل نطاق Table صالح بدأته BeginTable.',
      realMeaning: 'هي أدوات تنقل داخل grid الجدول لا widgets مرئية مستقلة.',
      whenToUse: 'استخدمها عند بناء جداول تشخيص أو موارد أو خصائص متعددة الأعمدة.',
      practicalBenefit: 'تجعل ملء الجداول منظمًا وقابلًا للتوقع داخل الكود والواجهة.',
      misuseImpact: 'إذا استدعيتها خارج جدول أو بترتيب غير صحيح فسيكسر ذلك منطق الجدول أو يجعل النتيجة ملتبسة.'
    });
  }

  return null;
}

function renderImguiIndexCardPreview(item, sectionKey = '') {
  if (!item) {
    return '';
  }

  if (sectionKey === 'integrations') {
    const previewSrc = normalizeImguiExampleShotSource(buildImguiExampleShotDataUri(item), item);
    if (previewSrc) {
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <img class="imgui-index-preview-image" src="${escapeAttribute(previewSrc)}" alt="">
          </div>
        </div>
      `;
    }

    return item.guiRepresentation?.mockup
      ? `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <pre class="imgui-index-preview-fallback">${escapeHtml(item.guiRepresentation.mockup)}</pre>
            </div>
          </div>
        </div>
      `
      : '';
  }

  if (sectionKey !== 'widgets') {
    return '';
  }

  switch (item.name) {
    case 'ImGui::Button':
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <div class="imgui-index-control-button">إعادة التحميل</div>
            </div>
          </div>
        </div>
      `;
    case 'ImGui::Checkbox':
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <div class="imgui-index-control-row">
                <span class="imgui-index-control-checkbox is-checked"></span>
                <span class="imgui-index-control-label">إظهار الحدود</span>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'ImGui::InputText':
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <div class="imgui-index-control-stack">
                <span class="imgui-index-control-label">بحث</span>
                <div class="imgui-index-control-input">
                  <span>Cube</span>
                  <span class="imgui-index-control-caret"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'ImGui::SliderFloat':
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <div class="imgui-index-control-stack">
                <div class="imgui-index-control-row imgui-index-control-row-space">
                  <span class="imgui-index-control-label">التعريض</span>
                  <span class="imgui-index-slider-value">1.0</span>
                </div>
                <div class="imgui-index-slider-track">
                  <span class="imgui-index-slider-fill"></span>
                  <span class="imgui-index-slider-knob"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'ImGui::Text':
      return `
        <div class="imgui-index-preview" aria-hidden="true">
          <div class="imgui-index-preview-window">
            <div class="imgui-index-preview-titlebar"></div>
            <div class="imgui-index-preview-body">
              <div class="imgui-index-text-line">عدد الكائنات المرئية: 128</div>
              <div class="imgui-index-text-line is-short">الحالة: جاهز</div>
            </div>
          </div>
        </div>
      `;
    default:
      {
        const previewSrc = normalizeImguiExampleShotSource(buildImguiExampleShotDataUri(item), item);
        if (previewSrc) {
          return `
            <div class="imgui-index-preview" aria-hidden="true">
              <div class="imgui-index-preview-window">
                <img class="imgui-index-preview-image" src="${escapeAttribute(previewSrc)}" alt="">
              </div>
            </div>
          `;
        }
      }
      return item.guiRepresentation?.mockup
        ? `
          <div class="imgui-index-preview" aria-hidden="true">
            <div class="imgui-index-preview-window">
              <div class="imgui-index-preview-titlebar"></div>
              <div class="imgui-index-preview-body">
                <pre class="imgui-index-preview-fallback">${escapeHtml(item.guiRepresentation.mockup)}</pre>
              </div>
            </div>
          </div>
        `
        : '';
  }
}

function buildImguiCompleteExampleCode(item, usage = null) {
  const fallback = String(usage?.code || '').trim();
  const name = String(item?.name || '').trim();
  const section = String(item?.sectionKey || '').trim();

  switch (name) {
    case 'سحب أصل من القائمة إلى منطقة العرض':
      body = `
        <rect x="134" y="150" width="246" height="266" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="350" y="186" class="small" text-anchor="end">Asset Browser</text>
        <rect x="156" y="208" width="202" height="40" rx="12" fill="#15314d"/><text x="332" y="234" class="small" text-anchor="end">Ship.mesh</text>
        <rect x="156" y="258" width="202" height="40" rx="12" fill="#101a29"/><text x="332" y="284" class="small" text-anchor="end">Crate.mesh</text>
        <rect x="156" y="308" width="202" height="40" rx="12" fill="#101a29"/><text x="332" y="334" class="small" text-anchor="end">SunLight.entity</text>
        <path d="M384 278 C440 250, 506 246, 560 264" fill="none" stroke="#7bbcff" stroke-width="4" stroke-dasharray="8 7"/>
        <polygon points="553,252 582,266 550,278" fill="#7bbcff"/>
        <rect x="584" y="176" width="208" height="196" rx="18" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <text x="770" y="208" class="small" text-anchor="end">Viewport Target</text>
        <rect x="612" y="232" width="152" height="96" rx="14" fill="#1a2d45"/>
        <text x="744" y="286" class="small" text-anchor="end">Ship.mesh</text>
        <text x="770" y="350" class="small" text-anchor="end">الأصل النشط بعد الإفلات</text>
      `;
      footer = 'الصورة تعرض المصدر والهدف ومسار السحب بوضوح حتى يفهم القارئ دورة Drag & Drop كاملة بين قائمتين أو نافذتين.';
      break;
    case 'نقل عنصر بين خانات Inventory':
      body = `
        <rect x="170" y="160" width="590" height="240" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="730" y="194" class="small" text-anchor="end">Inventory</text>
        <rect x="202" y="224" width="94" height="94" rx="14" fill="#15314d"/><text x="249" y="277" class="small" text-anchor="middle">Sword</text>
        <rect x="312" y="224" width="94" height="94" rx="14" fill="#101a29"/><text x="359" y="277" class="small" text-anchor="middle">Potion</text>
        <rect x="422" y="224" width="94" height="94" rx="14" fill="#101a29"/><text x="469" y="277" class="small" text-anchor="middle">Shield</text>
        <rect x="532" y="224" width="94" height="94" rx="14" fill="#132131" stroke="#7bbcff" stroke-width="2"/><text x="579" y="277" class="small" text-anchor="middle">[Empty]</text>
        <path d="M250 334 C304 364, 462 364, 576 324" fill="none" stroke="#7bbcff" stroke-width="4" stroke-dasharray="8 7"/>
        <polygon points="567,311 594,324 565,338" fill="#7bbcff"/>
        <text x="730" y="366" class="small" text-anchor="end">النتيجة: نقل أو تبديل العنصر بين الخانات</text>
      `;
      footer = 'اللقطة توضّح أن السحب هنا يعيد ترتيب محتوى شبكة Inventory نفسها، وليس مجرد سحب بصري بلا أثر على البيانات.';
      break;
    case 'سحب لون أو نص وإفلاته في حقل مادة':
      body = `
        <rect x="132" y="158" width="270" height="240" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="372" y="192" class="small" text-anchor="end">Color Sources</text>
        <rect x="158" y="220" width="56" height="56" rx="12" fill="#4f95f5"/><text x="250" y="255" class="small" text-anchor="start">Accent</text>
        <rect x="158" y="300" width="190" height="34" rx="10" fill="#101a29"/><text x="330" y="323" class="small" text-anchor="end">UI Accent</text>
        <path d="M406 274 C462 246, 540 246, 598 276" fill="none" stroke="#7bbcff" stroke-width="4" stroke-dasharray="8 7"/>
        <polygon points="590,263 620,276 590,289" fill="#7bbcff"/>
        <rect x="620" y="174" width="168" height="190" rx="18" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <text x="768" y="206" class="small" text-anchor="end">Material Field</text>
        <rect x="648" y="230" width="112" height="58" rx="12" fill="#4f95f5"/>
        <text x="768" y="320" class="small" text-anchor="end">Tag: UI Accent</text>
      `;
      footer = 'الصورة تشرح أن الـ payload قد تكون لونًا أو نصًا، لكن الهدف الواحد يستطيع استقبال النوعين وتحديث المعاينة أو الوسم.';
      break;
    case 'إعادة ترتيب عقدة داخل شجرة المشهد':
      body = `
        <rect x="160" y="156" width="600" height="248" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="732" y="192" class="small" text-anchor="end">Scene Tree</text>
        <text x="710" y="228" class="label" text-anchor="end">Scene</text>
        <line x1="226" y1="238" x2="226" y2="350" stroke="#4d6783" stroke-width="2"/>
        <line x1="226" y1="270" x2="266" y2="270" stroke="#4d6783" stroke-width="2"/><text x="700" y="276" class="small" text-anchor="end">Lights</text>
        <line x1="226" y1="310" x2="266" y2="310" stroke="#4d6783" stroke-width="2"/><rect x="266" y="290" width="188" height="36" rx="10" fill="#15314d"/><text x="434" y="314" class="small" text-anchor="end">Player</text>
        <line x1="226" y1="350" x2="266" y2="350" stroke="#4d6783" stroke-width="2"/><rect x="514" y="332" width="166" height="36" rx="10" fill="#132131" stroke="#7bbcff" stroke-width="2"/><text x="660" y="356" class="small" text-anchor="end">Meshes</text>
        <path d="M452 308 C500 312, 534 326, 548 340" fill="none" stroke="#7bbcff" stroke-width="4" stroke-dasharray="8 7"/>
      `;
      footer = 'اللقطة تبيّن أن السحب يغير الأب الحالي أو ترتيب العقدة داخل الـ Hierarchy، لا موضعها الفيزيائي في العالم.';
      break;
    case 'Platform Backend و Renderer Backend':
      body = `
        <rect x="120" y="182" width="212" height="140" rx="20" fill="#15314d" stroke="#77a9dc" stroke-width="2"/>
        <text x="304" y="240" class="label" text-anchor="end">Platform Backend</text>
        <text x="304" y="276" class="small" text-anchor="end">SDL3 / GLFW / Win32</text>
        <rect x="354" y="164" width="212" height="176" rx="20" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="538" y="236" class="popup-item" text-anchor="end">Dear ImGui</text>
        <text x="538" y="270" class="popup-item" text-anchor="end">Context + Draw Data</text>
        <rect x="590" y="182" width="212" height="140" rx="20" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <text x="774" y="240" class="label" text-anchor="end">Renderer Backend</text>
        <text x="774" y="276" class="small" text-anchor="end">OpenGL / Vulkan</text>
        <path d="M332 252 L354 252" stroke="#8ac6ff" stroke-width="4"/><path d="M566 252 L590 252" stroke="#8ac6ff" stroke-width="4"/>
      `;
      footer = 'الصورة تختصر الفكرة الأساسية: المنصة تغذي الإدخال والنافذة، وDear ImGui تبني draw data، وbackend الرسم يحولها إلى صورة نهائية.';
      break;
    case 'ImGui + GLFW':
    case 'ImGui + SDL3':
    case 'ImGui + OpenGL':
    case 'ImGui + Vulkan':
    case 'ImGui + SDL3 + Vulkan':
    case 'ImGui + GLFW + OpenGL':
      {
        const left = name.includes('GLFW') ? 'GLFW' : (name.includes('SDL3') ? 'SDL3' : 'Platform');
        const right = name.includes('Vulkan') ? 'Vulkan' : (name.includes('OpenGL') ? 'OpenGL' : 'Renderer');
        body = `
          <rect x="150" y="154" width="620" height="258" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
          <rect x="176" y="186" width="568" height="42" rx="12" fill="#162b42"/>
          <text x="716" y="213" class="small" text-anchor="end">${escapeImguiSvgText(left)} + Dear ImGui + ${escapeImguiSvgText(right)}</text>
          <rect x="198" y="244" width="184" height="128" rx="16" fill="#15314d"/><text x="358" y="286" class="small" text-anchor="end">${escapeImguiSvgText(left)} Window</text>
          <text x="358" y="318" class="small" text-anchor="end">Events / Input</text>
          <rect x="402" y="244" width="146" height="128" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/><text x="528" y="300" class="popup-item" text-anchor="end">ImGui UI</text>
          <rect x="568" y="244" width="154" height="128" rx="16" fill="#132131" stroke="#47627c" stroke-width="2"/><text x="700" y="286" class="small" text-anchor="end">${escapeImguiSvgText(right)}</text><text x="700" y="318" class="small" text-anchor="end">Render</text>
        `;
        footer = `الصورة تعرض التكامل العملي لـ ${left} مع ${right} حول Dear ImGui داخل نافذة أدوات واحدة واضحة.`;
      }
      break;
    case 'Fade وHover وProgress داخل نافذة أدوات':
      body = `
        <rect x="176" y="164" width="568" height="238" rx="20" fill="#15314d" stroke="#7aa8d6" stroke-width="2" opacity="0.88"/>
        <text x="716" y="198" class="small" text-anchor="end">Animated Tools</text>
        <rect x="206" y="224" width="172" height="52" rx="14" fill="#5b8fd0"/><text x="292" y="257" class="label" text-anchor="middle">Fade Out</text>
        <rect x="206" y="304" width="308" height="20" rx="999" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <rect x="206" y="304" width="188" height="20" rx="999" fill="#6cb6ff"/>
        <text x="716" y="260" class="small" text-anchor="end">Hover يغير اللون تدريجياً</text>
        <text x="716" y="336" class="small" text-anchor="end">Progress يتحرك باستمرار</text>
      `;
      footer = 'الصورة تجمع Fade وحالة Hover وشريط Progress في نافذة واحدة حتى يظهر معنى التدرج بين الإطارات بوضوح.';
      break;
    case 'Sidebar متحركة مع Toast notification وتدرج ظهور':
      body = `
        <rect x="142" y="152" width="248" height="260" rx="20" fill="#15314d" stroke="#7aa8d6" stroke-width="2"/>
        <text x="362" y="186" class="small" text-anchor="end">Sidebar</text>
        <rect x="170" y="216" width="150" height="46" rx="12" fill="#5b8fd0"/><text x="245" y="246" class="small" text-anchor="middle">Collapse</text>
        <rect x="170" y="276" width="150" height="46" rx="12" fill="#1b3049"/><text x="245" y="306" class="small" text-anchor="middle">Show Toast</text>
        <rect x="608" y="146" width="170" height="90" rx="18" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2" opacity="0.82"/>
        <text x="758" y="184" class="popup-item" text-anchor="end">Save completed</text>
        <text x="758" y="212" class="popup-item" text-anchor="end">Fade out...</text>
        <path d="M408 284 L560 284" stroke="#8ac6ff" stroke-width="3" stroke-dasharray="8 7"/>
      `;
      footer = 'اللقطة توضّح انتقالين معًا: عرض الشريط الجانبي يتغير تدريجيًا، ونافذة Toast تظهر ثم تتلاشى بمرور الوقت.';
      break;
    case 'محرر انفجار تفاعلي مع نبضة وقطع متناثرة':
      body = `
        <rect x="154" y="154" width="612" height="258" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="738" y="190" class="small" text-anchor="end">Explosion Editor</text>
        <rect x="184" y="220" width="164" height="48" rx="12" fill="#e07d53"/><text x="266" y="251" class="small" text-anchor="middle">Trigger Explosion</text>
        <rect x="418" y="220" width="300" height="154" rx="16" fill="#132131"/>
        <circle cx="568" cy="294" r="28" fill="#ffb06c" opacity="0.7"/>
        <circle cx="568" cy="294" r="54" fill="none" stroke="#ff884d" stroke-width="6" opacity="0.8"/>
        <line x1="568" y1="294" x2="640" y2="260" stroke="#ffcf83" stroke-width="3"/>
        <line x1="568" y1="294" x2="622" y2="340" stroke="#ffcf83" stroke-width="3"/>
        <line x1="568" y1="294" x2="510" y2="240" stroke="#ffcf83" stroke-width="3"/>
      `;
      footer = 'الصورة تجعل قيم الانفجار مفهومة: هناك نبضة مركزية، دوائر صدمة، وشظايا متناثرة بدل وصف نصي مجرد.';
      break;
    case 'محرر وهج Glow مع طبقات سطوع متدرجة':
      body = `
        <rect x="162" y="154" width="596" height="258" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="730" y="190" class="small" text-anchor="end">Glow Editor</text>
        <circle cx="506" cy="286" r="82" fill="#5fc2ff" opacity="0.10"/>
        <circle cx="506" cy="286" r="62" fill="#5fc2ff" opacity="0.18"/>
        <circle cx="506" cy="286" r="44" fill="#5fc2ff" opacity="0.28"/>
        <circle cx="506" cy="286" r="26" fill="#fff1c8"/>
        <rect x="188" y="220" width="214" height="18" rx="999" fill="#132131"/><rect x="188" y="220" width="126" height="18" rx="999" fill="#6cb6ff"/>
        <rect x="188" y="264" width="214" height="18" rx="999" fill="#132131"/><rect x="188" y="264" width="170" height="18" rx="999" fill="#6cb6ff"/>
        <rect x="188" y="304" width="48" height="48" rx="12" fill="#5fc2ff"/>
      `;
      footer = 'الصورة توضح القلب المضيء والهالة الخارجية بطبقات متعددة، وهو ما يشرح معنى Glow intensity وradius مباشرة.';
      break;
    case 'محرر تطاير وجسيمات متناثرة':
      body = `
        <rect x="154" y="154" width="612" height="258" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="738" y="190" class="small" text-anchor="end">Scatter Editor</text>
        <rect x="408" y="220" width="318" height="150" rx="16" fill="#132131"/>
        <circle cx="566" cy="294" r="8" fill="#ffca72"/>
        <circle cx="620" cy="266" r="6" fill="#7fc1ff"/><circle cx="642" cy="312" r="5" fill="#7fc1ff"/><circle cx="590" cy="344" r="4" fill="#7fc1ff"/><circle cx="514" cy="338" r="5" fill="#7fc1ff"/><circle cx="486" cy="284" r="4" fill="#7fc1ff"/><circle cx="522" cy="236" r="6" fill="#7fc1ff"/>
        <path d="M566 294 L620 266 M566 294 L642 312 M566 294 L514 338 M566 294 L486 284" stroke="#6cb6ff" stroke-width="2" opacity="0.45"/>
        <text x="336" y="250" class="small" text-anchor="end">Speed</text><text x="336" y="286" class="small" text-anchor="end">Spread</text><text x="336" y="322" class="small" text-anchor="end">Count</text>
      `;
      footer = 'الصورة تعرض مركز الانبعاث والجسيمات المتناثرة حوله، فيفهم المستخدم أثر السرعة والانتشار والكثافة بصريًا.';
      break;
    case 'لعبة المراحل المتعددة':
      body = `
        <rect x="150" y="150" width="620" height="260" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="176" y="178" width="568" height="34" rx="10" fill="#162b42"/><text x="712" y="201" class="small" text-anchor="end">لعبة الصيد - المرحلة 3</text>
        <rect x="196" y="236" width="524" height="136" rx="14" fill="#132131"/>
        <rect x="232" y="262" width="74" height="38" rx="8" fill="#28a745"/><rect x="360" y="248" width="74" height="38" rx="8" fill="#007bff"/><rect x="514" y="300" width="74" height="38" rx="8" fill="#fd7e14"/>
        <text x="712" y="390" class="small" text-anchor="end">Targets + Score + Timer + Stage Progress</text>
      `;
      footer = 'الصورة تعرض اللعبة كمثال ImGui كامل متعدد المراحل بدل لوحة مبسطة، مع أهداف وشريط معلومات وتقدم واضح.';
      break;
    case 'حركة دائرية - عنصر يدور حول مركز':
    case 'حركة على مسار مرسوم - Path Following':
    case 'تأثير النار المتحركة - Fire Particles':
    case 'تشغيل صورة متحركة - Sprite Animation':
      {
        const kind = name.includes('دائرية') ? 'مسار دائري' : name.includes('Path') ? 'مسار مرسوم' : name.includes('النار') ? 'لهب متحرك' : 'Sprite Frames';
        body = `
          <rect x="156" y="154" width="608" height="258" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
          <text x="736" y="190" class="small" text-anchor="end">${escapeImguiSvgText(kind)}</text>
          <rect x="392" y="220" width="332" height="156" rx="16" fill="#132131"/>
          ${name.includes('دائرية') ? `<circle cx="556" cy="296" r="62" fill="none" stroke="#6c8cab" stroke-width="4"/><circle cx="614" cy="268" r="12" fill="#ffce6c"/>` : ''}
          ${name.includes('Path') ? `<path d="M426 332 C474 250, 560 244, 686 314" fill="none" stroke="#6c8cab" stroke-width="4"/><circle cx="584" cy="278" r="12" fill="#ffce6c"/>` : ''}
          ${name.includes('النار') ? `<circle cx="560" cy="322" r="24" fill="#ffb347"/><circle cx="548" cy="294" r="18" fill="#ff7f50"/><circle cx="576" cy="286" r="16" fill="#ffd27f"/><circle cx="534" cy="270" r="10" fill="#ffcf83" opacity="0.7"/><circle cx="592" cy="262" r="9" fill="#ffcf83" opacity="0.7"/>` : ''}
          ${name.includes('Sprite') ? `<rect x="434" y="246" width="74" height="74" rx="10" fill="#1f3a5a"/><rect x="522" y="246" width="74" height="74" rx="10" fill="#29507c"/><rect x="610" y="246" width="74" height="74" rx="10" fill="#3d74b1"/><text x="684" y="346" class="small" text-anchor="end">Frame 1  Frame 2  Frame 3</text>` : ''}
        `;
        footer = `الصورة تعرض مثال ${kind} كمعاينة فعلية داخل Canvas، بدل الاقتصار على وصف نصي لحالة الأنيميشن.`;
      }
      break;
    case 'MenuBar وقوائم فرعية وقائمة سياقية':
      body = `
        <rect x="150" y="156" width="620" height="250" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="176" y="182" width="568" height="42" rx="12" fill="#162b42"/>
        <text x="716" y="208" class="small" text-anchor="end">File   Edit   View   Developer</text>
        <rect x="228" y="224" width="154" height="146" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="360" y="252" class="popup-item" text-anchor="end">Import</text><text x="360" y="286" class="popup-item" text-anchor="end">Save</text><text x="360" y="320" class="popup-item" text-anchor="end">Save As</text>
        <rect x="398" y="238" width="140" height="100" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="518" y="268" class="popup-item" text-anchor="end">FBX</text><text x="518" y="302" class="popup-item" text-anchor="end">glTF</text>
        <rect x="592" y="274" width="128" height="92" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="702" y="304" class="popup-item" text-anchor="end">Rename</text><text x="702" y="336" class="popup-item" text-anchor="end">Delete</text>
      `;
      footer = 'الصورة تعرض شريط القوائم والقوائم الفرعية والقائمة السياقية ضمن نفس المشهد، وهو ما يشرح المثال فعلاً كمحرر حقيقي.';
      break;
    case 'مساحة عمل Docking مع MenuBar ولوحات Scene وInspector وConsole':
      body = `
        <rect x="122" y="144" width="676" height="278" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="148" y="170" width="624" height="36" rx="10" fill="#162b42"/><text x="742" y="194" class="small" text-anchor="end">File   View   Developer</text>
        <rect x="148" y="220" width="292" height="174" rx="14" fill="#132131"/><text x="414" y="250" class="small" text-anchor="end">Scene</text>
        <rect x="454" y="220" width="144" height="82" rx="14" fill="#15314d"/><text x="578" y="248" class="small" text-anchor="end">Hierarchy</text>
        <rect x="454" y="312" width="144" height="82" rx="14" fill="#15314d"/><text x="578" y="340" class="small" text-anchor="end">Console</text>
        <rect x="612" y="220" width="160" height="174" rx="14" fill="#1a2d45"/><text x="748" y="248" class="small" text-anchor="end">Inspector</text>
      `;
      footer = 'الصورة تشرح Docking كمساحة عمل كاملة فيها لوحات متعددة قابلة للتنظيم، لا مجرد MenuBar وحيدة أعلى نافذة بسيطة.';
      break;
    case 'قوائم متداخلة ثلاثية مع صور مصغرة':
      body = `
        <rect x="150" y="156" width="620" height="250" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="176" y="182" width="568" height="42" rx="12" fill="#162b42"/><text x="716" y="208" class="small" text-anchor="end">Assets</text>
        <rect x="214" y="224" width="138" height="136" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/><text x="334" y="254" class="popup-item" text-anchor="end">Vehicles</text><text x="334" y="288" class="popup-item" text-anchor="end">Themes</text>
        <rect x="366" y="238" width="138" height="118" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/><text x="486" y="268" class="popup-item" text-anchor="end">Sports</text><text x="486" y="302" class="popup-item" text-anchor="end">Utility</text>
        <rect x="518" y="224" width="210" height="146" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <rect x="536" y="244" width="48" height="32" rx="8" fill="#3d74b1"/><text x="706" y="266" class="popup-item" text-anchor="end">Roadster</text>
        <rect x="536" y="296" width="48" height="32" rx="8" fill="#2d557f"/><text x="706" y="318" class="popup-item" text-anchor="end">Coupe</text>
      `;
      footer = 'الصورة تبين التدرج الهرمي للقوائم حتى المستوى الثالث، ثم تضيف thumbnails في النهاية لتوضيح الاختيار البصري داخل المسار.';
      break;
    case 'لوحة أدوات الألوان والثيم':
      body = `
        <rect x="144" y="150" width="632" height="264" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="746" y="188" class="small" text-anchor="end">Color Tools</text>
        <rect x="174" y="216" width="160" height="132" rx="16" fill="#132131"/>
        <rect x="196" y="238" width="116" height="86" rx="10" fill="#4f95f5"/>
        <rect x="360" y="216" width="170" height="132" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <circle cx="444" cy="282" r="46" fill="#4f95f5"/><circle cx="444" cy="282" r="16" fill="#fff1c8"/>
        <rect x="566" y="230" width="46" height="46" rx="10" fill="#4f95f5"/><rect x="626" y="230" width="46" height="46" rx="10" fill="#2f343d"/>
        <text x="742" y="246" class="small" text-anchor="end">RGB / RGBA / HEX</text>
        <text x="742" y="288" class="small" text-anchor="end">Preview Before / After</text>
        <text x="742" y="330" class="small" text-anchor="end">Text + Background Preview</text>
      `;
      footer = 'الصورة توضح أدوات اللون كلوحة عمل فعلية فيها محرر ومعاينة وقيم ومقارنة قبل/بعد، لا كزر لون منفرد فقط.';
      break;
    case 'Theme editor متعدد الحقول مع Palette ومعاينة مشهد':
      body = `
        <rect x="140" y="148" width="640" height="268" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="748" y="186" class="small" text-anchor="end">Theme Editor</text>
        <text x="350" y="234" class="small" text-anchor="end">Accent</text><rect x="180" y="214" width="48" height="32" rx="8" fill="#4f95f5"/>
        <text x="350" y="276" class="small" text-anchor="end">Panel</text><rect x="180" y="256" width="48" height="32" rx="8" fill="#2d3442"/>
        <text x="350" y="318" class="small" text-anchor="end">Background</text><rect x="180" y="298" width="48" height="32" rx="8" fill="#151a24"/>
        <rect x="386" y="214" width="168" height="34" rx="10" fill="#132131"/><rect x="398" y="222" width="28" height="18" rx="6" fill="#4f95f5"/><rect x="436" y="222" width="28" height="18" rx="6" fill="#f29c52"/><rect x="474" y="222" width="28" height="18" rx="6" fill="#5bb58f"/><rect x="512" y="222" width="28" height="18" rx="6" fill="#c47ae6"/>
        <rect x="580" y="224" width="166" height="132" rx="14" fill="#2d3442"/><text x="724" y="252" class="small" text-anchor="end">Scene Preview</text><rect x="602" y="272" width="122" height="64" rx="10" fill="#151a24"/><text x="712" y="306" class="small" text-anchor="end">Accent Title</text>
      `;
      footer = 'الصورة تربط الألوان بأدوار واضحة داخل الثيم مع Palette جاهزة ومعاينة مشهد مباشرة، وهو جوهر هذا المثال.';
      break;
    case 'ImGui::Begin':
      return `#include <imgui.h>

void DrawInspectorFrame() {
    static bool show_inspector = true;
    static bool show_bounds = false;

    ImGui::NewFrame();

    if (show_inspector && ImGui::Begin("المعاين", &show_inspector, ImGuiWindowFlags_NoResize)) {
        ImGui::Text("الكائن الحالي: Cube");
        ImGui::Checkbox("إظهار الحدود", &show_bounds);
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::End':
      return `#include <imgui.h>

void DrawDetailsFrame() {
    static bool show_details = true;

    ImGui::NewFrame();

    if (show_details && ImGui::Begin("التفاصيل", &show_details)) {
        ImGui::Text("المستخدم الحالي: Admin");
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::BeginChild':
      return `#include <imgui.h>

void DrawSceneBrowserFrame() {
    static bool show_browser = true;

    ImGui::NewFrame();

    if (show_browser && ImGui::Begin("المشاهد", &show_browser)) {
        if (ImGui::BeginChild("asset_list", ImVec2(0.0f, 180.0f), true)) {
            ImGui::Text("Cube.mesh");
            ImGui::Text("Skybox.ktx2");
        }
        ImGui::EndChild();
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::Button':
      return `#include <imgui.h>

void DrawToolbarFrame() {
    static bool show_toolbar = true;
    static bool requested_reload = false;

    ImGui::NewFrame();

    if (show_toolbar && ImGui::Begin("أوامر", &show_toolbar)) {
        if (ImGui::Button("إعادة التحميل", ImVec2(140.0f, 0.0f))) {
            requested_reload = true;
        }

        if (requested_reload) {
            ImGui::Text("تم تسجيل طلب إعادة التحميل.");
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::Checkbox':
      return `#include <imgui.h>

void DrawViewOptionsFrame() {
    static bool show_view_options = true;
    static bool show_bounds = false;
    static bool overlay_needs_update = false;

    ImGui::NewFrame();

    if (show_view_options && ImGui::Begin("العرض", &show_view_options)) {
        if (ImGui::Checkbox("إظهار الحدود", &show_bounds)) {
            overlay_needs_update = true;
        }

        if (overlay_needs_update) {
            ImGui::Text("تم تحديث طبقة الحدود وفق الحالة الجديدة.");
            overlay_needs_update = false;
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::InputText':
      return `#include <imgui.h>

void DrawAssetFilterFrame() {
    static bool show_assets = true;
    static char search[64] = "Cube";
    static bool needs_refilter = false;

    ImGui::NewFrame();

    if (show_assets && ImGui::Begin("الأصول", &show_assets)) {
        if (ImGui::InputText("بحث", search, sizeof(search))) {
            needs_refilter = true;
        }

        if (needs_refilter) {
            ImGui::Text("المرشح الحالي: %s", search);
            needs_refilter = false;
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::SliderFloat':
      return `#include <imgui.h>

void DrawLightingFrame() {
    static bool show_lighting = true;
    static float exposure = 1.0f;

    ImGui::NewFrame();

    if (show_lighting && ImGui::Begin("الإضاءة", &show_lighting)) {
        if (ImGui::SliderFloat("التعريض", &exposure, 0.1f, 4.0f)) {
            ImGui::Text("قيمة التعريض الحالية: %.2f", exposure);
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::Text':
      return `#include <imgui.h>

void DrawStatisticsFrame() {
    static bool show_statistics = true;
    static int visible_count = 128;

    ImGui::NewFrame();

    if (show_statistics && ImGui::Begin("إحصاءات", &show_statistics)) {
        ImGui::Text("عدد الكائنات المرئية: %d", visible_count);
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::SameLine':
      return `#include <imgui.h>

void DrawTransportFrame() {
    static bool show_transport = true;
    static int last_command = 0;

    ImGui::NewFrame();

    if (show_transport && ImGui::Begin("أوامر", &show_transport)) {
        if (ImGui::Button("تشغيل")) {
            last_command = 1;
        }
        ImGui::SameLine();
        if (ImGui::Button("إيقاف")) {
            last_command = 2;
        }

        if (last_command == 1) {
            ImGui::Text("آخر أمر: تشغيل");
        } else if (last_command == 2) {
            ImGui::Text("آخر أمر: إيقاف");
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    case 'ImGui::OpenPopup':
    case 'ImGui::BeginPopup':
    case 'ImGui::EndPopup':
      return `#include <imgui.h>

void DrawAssetActionsFrame() {
    static bool show_actions_window = true;
    static int selected_action = 0;

    ImGui::NewFrame();

    if (show_actions_window && ImGui::Begin("إجراءات المورد", &show_actions_window)) {
        if (ImGui::Button("المزيد")) {
            ImGui::OpenPopup("asset_actions");
        }

        if (ImGui::BeginPopup("asset_actions")) {
            if (ImGui::Button("إعادة تسمية")) {
                selected_action = 1;
            }
            if (ImGui::Button("حذف")) {
                selected_action = 2;
            }
            ImGui::EndPopup();
        }

        if (selected_action == 1) {
            ImGui::Text("آخر إجراء مختار: إعادة تسمية");
        } else if (selected_action == 2) {
            ImGui::Text("آخر إجراء مختار: حذف");
        }
    }
    ImGui::End();

    ImGui::Render();
}`;
    default:
      break;
  }

  if (['windows', 'widgets', 'layout', 'popups'].includes(section) && fallback) {
    return `#include <imgui.h>

void DrawExampleFrame() {
    ImGui::NewFrame();

${fallback.split('\n').map((line) => `    ${line}`).join('\n')}

    ImGui::Render();
}`;
  }

  return fallback;
}

function buildImguiExampleShotDataUri(item) {
  const name = String(item?.name || '').trim();
  const titleMap = {
    'ImGui::Begin': 'المعاين',
    'ImGui::End': 'التفاصيل',
    'ImGui::BeginChild': 'المشاهد',
    'ImGui::Button': 'أوامر',
    'ImGui::Checkbox': 'العرض',
    'ImGui::Combo': 'إعدادات الرسم',
    'ImGui::ListBox': 'المشاهد',
    'ImGui::InputText': 'الأصول',
    'ImGui::SliderFloat': 'الإضاءة',
    'ImGui::Text': 'إحصاءات',
    'ImGui::SameLine': 'أوامر',
    'ImGui::Selectable': 'الموارد',
    'ImGui::CollapsingHeader': 'خصائص الإضاءة',
    'ImGui::TreeNode': 'شجرة المشهد',
    'ImGui::BeginTable': 'الموارد',
    'ImGui::BeginTabBar': 'المعاين',
    'ImGui::BeginMenuBar': 'المحرر',
    'ImGui::OpenPopup': 'إجراءات المورد',
    'ImGui::BeginPopup': 'إجراءات المورد',
    'ImGui::EndPopup': 'إجراءات المورد'
  };

  const windowTitle = titleMap[name] || String(item?.guiRepresentation?.title || item?.name || '').trim();
  if (!windowTitle) {
    return '';
  }

  let body = '';
  let footer = 'صورة فعلية مطابقة لشكل الخرج المتوقع من المثال العملي.';

  switch (name) {
    case 'تحريك مؤشر ولوحة بين الإطارات':
      body = `
        <rect x="144" y="164" width="430" height="224" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="540" y="198" class="small" text-anchor="end">نافذة التحكم</text>
        <rect x="174" y="222" width="176" height="52" rx="14" fill="#516984" stroke="#93a6bf" stroke-width="2"/>
        <text x="262" y="255" class="label" text-anchor="middle">إظهار اللوحة</text>
        <text x="540" y="254" class="small" text-anchor="end">marker_x: 132.4</text>
        <text x="540" y="286" class="small" text-anchor="end">panel_x: 648.0</text>
        <rect x="176" y="318" width="330" height="20" rx="999" fill="#132131" stroke="#48607c" stroke-width="2"/>
        <rect x="308" y="311" width="28" height="34" rx="9" fill="#ffce6c" stroke="#ffe4a8" stroke-width="2"/>
        <line x1="336" y1="328" x2="404" y2="328" stroke="#7fc1ff" stroke-width="3" stroke-linecap="round"/>
        <text x="540" y="350" class="small" text-anchor="end">المؤشر يتحرك على المسار كل Frame</text>
        <rect x="612" y="118" width="170" height="156" rx="20" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <rect x="612" y="118" width="170" height="38" rx="20" fill="#dbeafe"/>
        <text x="760" y="143" class="popup-item" text-anchor="end">Sliding Panel</text>
        <text x="760" y="188" class="popup-item" text-anchor="end">هذه اللوحة</text>
        <text x="760" y="216" class="popup-item" text-anchor="end">تتحرك أفقياً</text>
        <text x="760" y="244" class="popup-item" text-anchor="end">بحسب panel_x</text>
        <path d="M586 196 L606 196" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M780 196 L800 196" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M590 186 L576 196 L590 206" fill="none" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M796 186 L810 196 L796 206" fill="none" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      footer = 'الصورة تشرح الحركتين معاً: Marker ينزلق على مسار أفقي داخل النافذة، ولوحة جانبية يتغير موضعها أفقيًا بين الإطارات.';
      break;
    case 'لوحة عائمة وMarker يتحركان باستمرار داخل مساحة أدوات':
      body = `
        <rect x="126" y="146" width="492" height="270" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="586" y="182" class="small" text-anchor="end">Motion Workspace</text>
        <rect x="160" y="212" width="424" height="164" rx="18" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <line x1="190" y1="340" x2="554" y2="340" stroke="#587899" stroke-width="4" stroke-linecap="round"/>
        <circle cx="330" cy="286" r="12" fill="#ffce6c" stroke="#ffe4a8" stroke-width="2"/>
        <circle cx="330" cy="286" r="22" fill="none" stroke="#7bbcff" stroke-width="2"/>
        <path d="M352 270 Q388 244 430 228" fill="none" stroke="#7bbcff" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round"/>
        <text x="554" y="236" class="small" text-anchor="end">Marker داخل Canvas</text>
        <text x="554" y="268" class="small" text-anchor="end">marker_pos = (330, 286)</text>
        <rect x="638" y="126" width="152" height="110" rx="20" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <rect x="638" y="126" width="152" height="34" rx="20" fill="#dbeafe"/>
        <text x="770" y="149" class="popup-item" text-anchor="end">Floating Info</text>
        <text x="770" y="186" class="popup-item" text-anchor="end">panel_pos.x</text>
        <text x="770" y="212" class="popup-item" text-anchor="end">يتحرك ذهاباً</text>
        <path d="M626 180 L638 180" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M790 180 L804 180" stroke="#8ac6ff" stroke-width="4" stroke-linecap="round"/>
      `;
      footer = 'الصورة توضح أن الحركة ليست لعنصر واحد فقط: Canvas فيها Marker متحرك، وبجانبها نافذة معلومات عائمة لها موضع مستقل محفوظ داخل الحالة.';
      break;
    case 'ساعة تناظرية ورقمية داخل نافذة أدوات':
      body = `
        <rect x="164" y="150" width="596" height="268" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="726" y="186" class="small" text-anchor="end">Clock Widget</text>
        <circle cx="360" cy="275" r="88" fill="#122031" stroke="#5b7ea1" stroke-width="4"/>
        <circle cx="360" cy="275" r="6" fill="#edf4fb"/>
        <line x1="360" y1="205" x2="360" y2="222" stroke="#edf4fb" stroke-width="3"/>
        <line x1="430" y1="275" x2="413" y2="275" stroke="#edf4fb" stroke-width="3"/>
        <line x1="360" y1="345" x2="360" y2="328" stroke="#edf4fb" stroke-width="3"/>
        <line x1="290" y1="275" x2="307" y2="275" stroke="#edf4fb" stroke-width="3"/>
        <line x1="360" y1="275" x2="387" y2="238" stroke="#ffd674" stroke-width="5" stroke-linecap="round"/>
        <line x1="360" y1="275" x2="320" y2="246" stroke="#74bfff" stroke-width="4" stroke-linecap="round"/>
        <line x1="360" y1="275" x2="426" y2="286" stroke="#ff8b8b" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="516" y="228" width="190" height="88" rx="18" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <text x="682" y="264" class="label" text-anchor="end">12 : 34 : 56</text>
        <text x="682" y="298" class="small" text-anchor="end">ساعة رقمية أسفل الرسم</text>
        <text x="726" y="360" class="small" text-anchor="end">العقارب تتغير مع الزمن في كل Frame</text>
      `;
      footer = 'الصورة تمثل ساعة كاملة داخل نافذة أدوات: دائرة واضحة، ثلاثة عقارب مميزة، وقراءة رقمية مرتبطة بالوقت الحالي.';
      break;
    case 'سيارة تتحرك على مسار دائري':
      body = `
        <rect x="150" y="152" width="620" height="264" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="736" y="188" class="small" text-anchor="end">Car Path</text>
        <text x="736" y="226" class="small" text-anchor="end">Speed</text>
        <rect x="522" y="240" width="214" height="14" rx="999" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <rect x="522" y="240" width="112" height="14" rx="999" fill="#5da8ff"/>
        <circle cx="634" cy="247" r="13" fill="#edf4fb" stroke="#9cb4cc" stroke-width="2"/>
        <circle cx="354" cy="300" r="82" fill="none" stroke="#6c8cab" stroke-width="4"/>
        <circle cx="354" cy="300" r="98" fill="none" stroke="#2a4259" stroke-width="1.5" stroke-dasharray="8 8"/>
        <rect x="410" y="246" width="40" height="22" rx="8" fill="#ffce6c" stroke="#ffe4a8" stroke-width="2"/>
        <circle cx="420" cy="268" r="5" fill="#1d2025"/>
        <circle cx="440" cy="268" r="5" fill="#1d2025"/>
        <path d="M354 300 L430 257" stroke="#7bbcff" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>
        <text x="736" y="314" class="small" text-anchor="end">Angle: 1.28</text>
        <text x="736" y="346" class="small" text-anchor="end">Car Pos: 430 , 257</text>
      `;
      footer = 'الصورة توضح السرعة والمسار الدائري وموضع السيارة الحالي في لقطة واحدة، لذلك تشرح المثال أفضل من مخطط نصي مختصر.';
      break;
    case 'معاينة مجسم سلكي ثلاثي الأبعاد داخل نافذة ImGui':
      body = `
        <rect x="144" y="146" width="636" height="274" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="744" y="184" class="small" text-anchor="end">Wireframe 3D</text>
        <rect x="176" y="208" width="394" height="180" rx="18" fill="#132131" stroke="#47627c" stroke-width="2"/>
        <path d="M286 318 L362 286 L454 304 L380 338 Z" fill="none" stroke="#74bfff" stroke-width="2.5"/>
        <path d="M306 256 L382 224 L474 242 L400 276 Z" fill="none" stroke="#74bfff" stroke-width="2.5"/>
        <line x1="286" y1="318" x2="306" y2="256" stroke="#74bfff" stroke-width="2.5"/>
        <line x1="362" y1="286" x2="382" y2="224" stroke="#74bfff" stroke-width="2.5"/>
        <line x1="454" y1="304" x2="474" y2="242" stroke="#74bfff" stroke-width="2.5"/>
        <line x1="380" y1="338" x2="400" y2="276" stroke="#74bfff" stroke-width="2.5"/>
        <path d="M474 242 Q500 230 522 246" fill="none" stroke="#5a7693" stroke-width="2" stroke-dasharray="6 6"/>
        <text x="736" y="252" class="small" text-anchor="end">Rotation: 1.20</text>
        <text x="736" y="286" class="small" text-anchor="end">إسقاط منظور لمكعب سلكي</text>
        <text x="736" y="320" class="small" text-anchor="end">الرسم يتحدث كل Frame</text>
      `;
      footer = 'الصورة تعرض مجسمًا سلكيًا فعليًا داخل Canvas، فيفهم القارئ مباشرة أن المثال عن إسقاط 3D مبسط داخل نافذة ImGui.';
      break;
    case 'ImGui::Begin':
      body = `
        <rect x="110" y="150" width="226" height="272" rx="22" fill="#0c1522" stroke="#314256" stroke-width="2"/>
        <text x="306" y="186" class="small" text-anchor="end">Hierarchy</text>
        <rect x="132" y="204" width="182" height="40" rx="12" fill="#16314d"/>
        <text x="292" y="230" class="small" text-anchor="end">Cube</text>
        <rect x="132" y="254" width="182" height="40" rx="12" fill="#101a29"/>
        <text x="292" y="280" class="small" text-anchor="end">Camera</text>
        <rect x="356" y="150" width="414" height="272" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="736" y="188" class="label" text-anchor="end">نافذة الخصائص الأساسية</text>
        <text x="736" y="230" class="small" text-anchor="end">الكائن الحالي: Cube</text>
        <rect x="646" y="254" width="24" height="24" rx="5" fill="#0f172a" stroke="#7f8ea3" stroke-width="2"/>
        <text x="612" y="273" class="small" text-anchor="end">إظهار الحدود</text>
        <rect x="392" y="314" width="160" height="52" rx="14" fill="#516984" stroke="#93a6bf" stroke-width="2"/>
        <text x="472" y="347" class="label" text-anchor="middle">تطبيق</text>
      `;
      footer = 'الصورة تشرح أن ImGui::Begin يفتح نافذة كاملة تستضيف عناصر متعددة، لا مجرد سطر واحد داخل الواجهة.';
      break;
    case 'ImGui::End':
      body = `
        <text x="760" y="195" class="label" text-anchor="end">المستخدم الحالي: Admin</text>
        <rect x="150" y="250" width="640" height="84" rx="14" fill="#0b1320" stroke="#324155" stroke-width="2"/>
        <text x="760" y="300" class="small" text-anchor="end">إغلاق النطاق هنا يعيد التخطيط إلى ما بعد النافذة الحالية</text>
      `;
      footer = 'الصورة توضح شكل النافذة الناتج من المثال الذي يبدأ بـ ImGui::Begin وينتهي بـ ImGui::End.';
      break;
    case 'ImGui::BeginChild':
      body = `
        <rect x="175" y="175" width="560" height="180" rx="18" fill="#0b1320" stroke="#67788f" stroke-width="2"/>
        <text x="700" y="205" class="small" text-anchor="end">asset_list</text>
        <text x="680" y="250" class="label" text-anchor="end">Cube.mesh</text>
        <text x="680" y="292" class="label" text-anchor="end">Skybox.ktx2</text>
      `;
      break;
    case 'ImGui::Button':
      body = `
        <rect x="170" y="168" width="610" height="212" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="742" y="206" class="small" text-anchor="end">شريط أدوات المشروع</text>
        <rect x="208" y="230" width="168" height="58" rx="14" fill="#516984" stroke="#93a6bf" stroke-width="2"/>
        <text x="292" y="266" class="label" text-anchor="middle">إعادة التحميل</text>
        <rect x="394" y="230" width="148" height="58" rx="14" fill="#1a2d45" stroke="#5d7896" stroke-width="2"/>
        <text x="468" y="266" class="small" text-anchor="middle">حفظ</text>
        <rect x="560" y="230" width="182" height="58" rx="14" fill="#1a2d45" stroke="#5d7896" stroke-width="2"/>
        <text x="651" y="266" class="small" text-anchor="middle">بناء المشروع</text>
        <rect x="208" y="312" width="534" height="42" rx="12" fill="#112132"/>
        <text x="712" y="339" class="small" text-anchor="end">الحالة بعد الضغط: أعيد تحميل ملفات المشهد وحدثت المعاينة.</text>
      `;
      footer = 'الزر هنا ظاهر كجزء من شريط أوامر فعلي، مع نتيجة مرئية مباشرة بعد الضغط، وهذا أوضح من زر منفصل بلا سياق.';
      break;
    case 'ImGui::Checkbox':
      body = `
        <rect x="176" y="180" width="608" height="142" rx="18" fill="#0d1726" stroke="#41546d" stroke-width="2"/>
        <text x="748" y="214" class="small" text-anchor="end">خيارات العرض الحالية</text>
        <rect x="690" y="238" width="28" height="28" rx="7" fill="#102132" stroke="#8db2d7" stroke-width="2"/>
        <path d="M696 252 L703 259 L714 245" stroke="#f8fbff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="655" y="259" class="label" text-anchor="end">إظهار الحدود</text>
        <text x="748" y="299" class="small" text-anchor="end">تنعكس حالة المربع فورًا على طبقة الرسم التوضيحي.</text>
      `;
      footer = 'الصورة تعرض Checkbox كعنصر واجهة واضح بحالة اختيار فعلية وسطر شرح داخل نافذة منظمة.';
      break;
    case 'ImGui::Combo':
      body = `
        <text x="760" y="184" class="small" text-anchor="end">جودة الظلال</text>
        <rect x="186" y="200" width="560" height="60" rx="16" fill="#0d1726" stroke="#5c7694" stroke-width="2"/>
        <text x="704" y="238" class="label" text-anchor="end">متوسط</text>
        <path d="M221 224 L236 239 L251 224" fill="none" stroke="#d6e4f2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="430" y="272" width="316" height="168" rx="18" fill="#f8fafc" stroke="#d4dee9" stroke-width="2"/>
        <rect x="446" y="290" width="284" height="40" rx="12" fill="#dbeafe"/>
        <text x="706" y="317" class="popup-item" text-anchor="end">منخفض</text>
        <text x="706" y="362" class="popup-item" text-anchor="end">متوسط</text>
        <line x1="454" y1="374" x2="722" y2="374" stroke="#d4dee9" stroke-width="2"/>
        <text x="706" y="406" class="popup-item" text-anchor="end">عالٍ</text>
      `;
      footer = 'تظهر Combo حقلاً مغلقًا مضغوطًا، ثم قائمة خيارات مرتبة عند الفتح مع إبراز البديل الحالي بوضوح.';
      break;
    case 'ImGui::ListBox':
      body = `
        <text x="760" y="184" class="small" text-anchor="end">قائمة المشاهد المحملة</text>
        <rect x="186" y="198" width="560" height="214" rx="18" fill="#0d1726" stroke="#465a74" stroke-width="2"/>
        <rect x="204" y="216" width="524" height="46" rx="12" fill="#15314d"/>
        <text x="698" y="246" class="label" text-anchor="end">City.scene</text>
        <rect x="204" y="274" width="524" height="46" rx="12" fill="#111b2b"/>
        <text x="698" y="304" class="small" text-anchor="end">Forest.scene</text>
        <rect x="204" y="332" width="524" height="46" rx="12" fill="#111b2b"/>
        <text x="698" y="362" class="small" text-anchor="end">Debug.scene</text>
      `;
      footer = 'تعرض ListBox عدة عناصر مرئية دفعة واحدة، لذلك تبدو أقرب إلى لوحة اختيار مستقرة من قائمة منسدلة.';
      break;
    case 'ImGui::InputText':
      body = `
        <rect x="164" y="170" width="628" height="214" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="206" class="small" text-anchor="end">فلترة قائمة الأصول</text>
        <text x="752" y="246" class="label" text-anchor="end">بحث</text>
        <rect x="200" y="262" width="552" height="58" rx="12" fill="#0d1522" stroke="#71849c" stroke-width="2"/>
        <text x="712" y="298" class="label" text-anchor="end">Cube</text>
        <rect x="698" y="274" width="2" height="32" fill="#f8fafc"/>
        <rect x="200" y="338" width="552" height="30" rx="10" fill="#112132"/>
        <text x="722" y="359" class="small" text-anchor="end">النتائج المطابقة: Cube.mesh , CubeMaterial , CubeCollider</text>
      `;
      footer = 'الصورة توضّح حقل InputText داخل سيناريو بحث فعلي، مع نص مدخل ومؤشر كتابة ونتائج تتأثر بالقيمة الحالية.';
      break;
    case 'ImGui::SliderFloat':
      body = `
        <rect x="164" y="170" width="628" height="224" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="206" class="small" text-anchor="end">لوحة Post Processing</text>
        <text x="752" y="246" class="label" text-anchor="end">التعريض</text>
        <text x="214" y="246" class="small" text-anchor="start">1.0</text>
        <rect x="198" y="280" width="520" height="14" rx="999" fill="#0b1320" stroke="#4f657f" stroke-width="2"/>
        <rect x="198" y="280" width="300" height="14" rx="999" fill="#5da8ff"/>
        <circle cx="498" cy="287" r="14" fill="#f8fbff" stroke="#9cb4cc" stroke-width="2"/>
        <rect x="198" y="322" width="520" height="36" rx="12" fill="#112132"/>
        <text x="690" y="346" class="small" text-anchor="end">المعاينة أصبحت أكثر سطوعًا بعد تحريك المقبض نحو اليمين.</text>
      `;
      footer = 'المنزلق صار ظاهرًا كأداة ضبط حقيقية داخل لوحة إعدادات، مع قيمة ومعاينة أثر بصري مباشر.';
      break;
    case 'ImGui::Text':
      body = `
        <rect x="176" y="178" width="600" height="172" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="738" y="214" class="small" text-anchor="end">لوحة الإحصاءات</text>
        <text x="738" y="258" class="label" text-anchor="end">عدد الكائنات المرئية: 128</text>
        <text x="738" y="302" class="small" text-anchor="end">FPS الحالي: 144</text>
        <text x="738" y="338" class="small" text-anchor="end">هذا النص للعرض فقط ولا يغير الحالة عند النقر.</text>
      `;
      footer = 'الصورة تبيّن Text كسطر معلومات داخل لوحة تشخيص أو إحصاءات، وهو السياق الأوضح لهذا العنصر.';
      break;
    case 'ImGui::SameLine':
      body = `
        <rect x="164" y="176" width="628" height="176" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="214" class="small" text-anchor="end">شريط أوامر على نفس السطر</text>
        <rect x="214" y="238" width="156" height="56" rx="14" fill="#506883" stroke="#93a6bf" stroke-width="2"/>
        <text x="292" y="273" class="label" text-anchor="middle">تشغيل</text>
        <rect x="390" y="238" width="156" height="56" rx="14" fill="#506883" stroke="#93a6bf" stroke-width="2"/>
        <text x="468" y="273" class="label" text-anchor="middle">إيقاف</text>
        <rect x="566" y="238" width="156" height="56" rx="14" fill="#1a2d45" stroke="#5d7896" stroke-width="2"/>
        <text x="644" y="273" class="small" text-anchor="middle">إعادة ضبط</text>
        <text x="752" y="328" class="small" text-anchor="end">SameLine يجعل العناصر تبقى أفقية ضمن السطر نفسه بدل النزول لسطر جديد.</text>
      `;
      footer = 'اللقطة توضّح الفكرة الحقيقية لـ SameLine: محاذاة عناصر متعددة أفقيًا داخل نفس النطاق.';
      break;
    case 'ImGui::Selectable':
      body = `
        <rect x="182" y="178" width="566" height="190" rx="18" fill="#0d1726" stroke="#445974" stroke-width="2"/>
        <rect x="200" y="198" width="530" height="52" rx="14" fill="#163856" stroke="#74a5d6" stroke-width="2"/>
        <text x="702" y="231" class="label" text-anchor="end">Player.mesh</text>
        <rect x="200" y="262" width="530" height="52" rx="14" fill="#101a2a" stroke="#33465d" stroke-width="2"/>
        <text x="702" y="295" class="small" text-anchor="end">Enemy.mesh</text>
        <text x="734" y="344" class="small" text-anchor="end">العنصر النشط: Player.mesh</text>
      `;
      footer = 'يعرض Selectable صفوفًا نصية قابلة للنقر مع تمييز واضح للسطر المحدد بدل مظهر الزر التقليدي.';
      break;
    case 'ImGui::CollapsingHeader':
      body = `
        <rect x="176" y="176" width="606" height="62" rx="18" fill="#12283f" stroke="#6b98c6" stroke-width="2"/>
        <path d="M214 202 L228 216 L214 230" fill="none" stroke="#e5eef7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="738" y="217" class="label" text-anchor="end">الظلال</text>
        <rect x="176" y="248" width="606" height="132" rx="18" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="682" y="274" width="26" height="26" rx="6" fill="#102132" stroke="#8db2d7" stroke-width="2"/>
        <path d="M688 287 L694 293 L705 281" stroke="#f8fbff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="650" y="295" class="small" text-anchor="end">تفعيل الظلال</text>
        <text x="738" y="338" class="small" text-anchor="end">المحتوى الداخلي يظهر فقط عندما يكون الرأس مفتوحًا.</text>
      `;
      footer = 'ترويسة CollapsingHeader تبدو كرأس قسم منظم، ويظهر محتواها الداخلي داخل لوحة فرعية واضحة عند التوسيع.';
      break;
    case 'ImGui::TreeNode':
      body = `
        <rect x="170" y="168" width="614" height="226" rx="20" fill="#0d1726" stroke="#44566f" stroke-width="2"/>
        <path d="M228 204 L242 218 L228 232" fill="none" stroke="#edf4fb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="736" y="220" class="label" text-anchor="end">Scene</text>
        <line x1="246" y1="238" x2="246" y2="352" stroke="#48607c" stroke-width="2"/>
        <line x1="246" y1="276" x2="286" y2="276" stroke="#48607c" stroke-width="2"/>
        <path d="M286 262 L300 276 L286 290" fill="none" stroke="#dfeaf5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="710" y="282" class="small" text-anchor="end">Lights</text>
        <line x1="300" y1="296" x2="300" y2="332" stroke="#48607c" stroke-width="2"/>
        <line x1="300" y1="316" x2="340" y2="316" stroke="#48607c" stroke-width="2"/>
        <rect x="340" y="296" width="348" height="38" rx="12" fill="#11253b" stroke="#39506a" stroke-width="2"/>
        <text x="664" y="321" class="small" text-anchor="end">SunLight</text>
        <line x1="246" y1="336" x2="286" y2="336" stroke="#48607c" stroke-width="2"/>
        <path d="M286 324 L300 336 L286 348" fill="none" stroke="#dfeaf5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="710" y="342" class="small" text-anchor="end">Meshes</text>
      `;
      footer = 'تظهر البنية الهرمية بوضوح عبر التفرعات والمسافات البادئة وعلامات التوسيع، لا عبر أسطر نصية مجردة.';
      break;
    case 'ImGui::BeginTable':
      body = `
        <rect x="170" y="176" width="614" height="210" rx="18" fill="#0d1726" stroke="#465871" stroke-width="2"/>
        <rect x="170" y="176" width="614" height="48" rx="18" fill="#1a2d45"/>
        <line x1="372" y1="176" x2="372" y2="386" stroke="#415671" stroke-width="2"/>
        <line x1="556" y1="176" x2="556" y2="386" stroke="#415671" stroke-width="2"/>
        <text x="342" y="207" class="small" text-anchor="end">الاسم</text>
        <text x="528" y="207" class="small" text-anchor="end">النوع</text>
        <text x="748" y="207" class="small" text-anchor="end">الحالة</text>
        <rect x="184" y="238" width="586" height="52" rx="12" fill="#112338"/>
        <text x="342" y="271" class="small" text-anchor="end">Player.mesh</text>
        <text x="528" y="271" class="small" text-anchor="end">Mesh</text>
        <text x="748" y="271" class="small" text-anchor="end">جاهز</text>
        <rect x="184" y="302" width="586" height="52" rx="12" fill="#0f1a29"/>
        <text x="342" y="335" class="small" text-anchor="end">Sky.dds</text>
        <text x="528" y="335" class="small" text-anchor="end">Texture</text>
        <text x="748" y="335" class="small" text-anchor="end">محمل</text>
      `;
      footer = 'يعرض الجدول بنية أعمدة وصفوف واضحة، لذلك يحتاج صورة منظمة تشبه الواجهة الفعلية أكثر من أي مخطط خطي.';
      break;
    case 'ImGui::BeginTabBar':
      body = `
        <rect x="176" y="178" width="606" height="60" rx="18" fill="#0f1b2b" stroke="#445871" stroke-width="2"/>
        <rect x="196" y="188" width="118" height="40" rx="12" fill="#eff5fb" stroke="#cad8e6" stroke-width="2"/>
        <text x="255" y="214" class="popup-item" text-anchor="middle">عام</text>
        <rect x="324" y="188" width="134" height="40" rx="12" fill="#1a2d45" stroke="#4e6886" stroke-width="2"/>
        <text x="391" y="214" class="small" text-anchor="middle">المواد</text>
        <rect x="468" y="188" width="134" height="40" rx="12" fill="#1a2d45" stroke="#4e6886" stroke-width="2"/>
        <text x="535" y="214" class="small" text-anchor="middle">تشخيص</text>
        <rect x="176" y="250" width="606" height="144" rx="18" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="742" y="294" class="label" text-anchor="end">معلومات أساسية عن الكائن.</text>
        <text x="742" y="338" class="small" text-anchor="end">يظهر محتوى التبويب النشط فقط تحت الشريط.</text>
      `;
      footer = 'شريط التبويبات يحتاج تمثيلًا بصريًا واضحًا يفرق بين اللسان النشط والمحتوى أسفله داخل نفس النافذة.';
      break;
    case 'ImGui::BeginMenuBar':
      body = `
        <rect x="170" y="170" width="620" height="58" rx="18" fill="#162b42" stroke="#617fa2" stroke-width="2"/>
        <text x="736" y="206" class="small" text-anchor="end">ملف</text>
        <text x="654" y="206" class="small" text-anchor="end">عرض</text>
        <text x="560" y="206" class="small" text-anchor="end">أدوات</text>
        <rect x="624" y="226" width="152" height="136" rx="18" fill="#f8fafc" stroke="#d3dde7" stroke-width="2"/>
        <rect x="638" y="242" width="124" height="38" rx="10" fill="#dbeafe"/>
        <text x="738" y="267" class="popup-item" text-anchor="end">فتح</text>
        <text x="738" y="312" class="popup-item" text-anchor="end">حفظ</text>
        <text x="738" y="350" class="popup-item" text-anchor="end">خروج</text>
        <rect x="170" y="246" width="430" height="128" rx="18" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="570" y="318" class="small" text-anchor="end">منطقة العمل الأساسية</text>
      `;
      footer = 'تبدو MenuBar واضحة عندما يظهر الشريط العلوي مع قائمة هرمية مفتوحة بدل الاعتماد على أسماء مفردة في سطر واحد.';
      break;
    case 'ImGui::OpenPopup':
    case 'ImGui::BeginPopup':
    case 'ImGui::EndPopup':
      body = `
        <rect x="566" y="182" width="166" height="52" rx="14" fill="#526b87" stroke="#9ab0c8" stroke-width="2"/>
        <text x="649" y="214" class="label" text-anchor="middle">المزيد</text>
        <path d="M686 244 L700 258 L672 258 Z" fill="#f8fafc"/>
        <rect x="430" y="258" width="308" height="152" rx="18" fill="#f8fafc" stroke="#ced8e3" stroke-width="2"/>
        <rect x="446" y="276" width="276" height="40" rx="12" fill="#dbeafe"/>
        <text x="698" y="302" class="popup-item" text-anchor="end">إعادة تسمية</text>
        <text x="698" y="348" class="popup-item" text-anchor="end">حذف</text>
        <line x1="454" y1="360" x2="722" y2="360" stroke="#d9e2ec" stroke-width="2"/>
        <text x="698" y="394" class="popup-item" text-anchor="end">نسخ المسار</text>
      `;
      footer = 'الصورة تطابق المثال الكامل الذي يفتح popup ثم يبني محتواها داخل النافذة نفسها.';
      break;
    case 'ImGui::RadioButton':
      body = `
        <text x="760" y="185" class="label" text-anchor="end">طريقة العرض</text>
        <circle cx="230" cy="210" r="12" fill="#102132" stroke="#8db2d7" stroke-width="2"/>
        <circle cx="230" cy="210" r="6" fill="#5da8ff"/>
        <text x="260" y="217" class="label" text-anchor="start">مضلل</text>
        <circle cx="380" cy="210" r="12" fill="#102132" stroke="#8db2d7" stroke-width="2"/>
        <text x="410" y="217" class="label" text-anchor="start">سلكي</text>
        <circle cx="530" cy="210" r="12" fill="#102132" stroke="#8db2d7" stroke-width="2"/>
        <text x="560" y="217" class="label" text-anchor="start">نقاط</text>
        <text x="760" y="280" class="small" text-anchor="end">الوضع الحالي: مضلل</text>
      `;
      footer = 'مجموعة Radio Buttons تسمح باختيار خيار واحد فقط، والدائرة الممتلئة تدل على الخيار النشط.';
      break;
    case 'ImGui::InputInt':
      body = `
        <text x="760" y="188" class="label" text-anchor="end">عدد العينات</text>
        <rect x="180" y="205" width="280" height="58" rx="12" fill="#0d1522" stroke="#71849c" stroke-width="2"/>
        <text x="400" y="241" class="label" text-anchor="end">64</text>
        <rect x="470" y="205" width="44" height="28" rx="8" fill="#1a2d45" stroke="#4e6886" stroke-width="1"/>
        <text x="492" y="224" class="small" text-anchor="middle">▲</text>
        <rect x="470" y="235" width="44" height="28" rx="8" fill="#1a2d45" stroke="#4e6886" stroke-width="1"/>
        <text x="492" y="254" class="small" text-anchor="middle">▼</text>
        <text x="760" y="280" class="small" text-anchor="end">القيمة المطبقة: 64</text>
      `;
      footer = 'حقل إدخال صحيح مع أزرار زيادة ونقصان لضبط القيمة بخطوات محددة.';
      break;
    case 'ImGui::InputFloat':
      body = `
        <text x="760" y="188" class="label" text-anchor="end">Gamma</text>
        <rect x="180" y="205" width="280" height="58" rx="12" fill="#0d1522" stroke="#71849c" stroke-width="2"/>
        <text x="400" y="241" class="label" text-anchor="end">2.20</text>
        <rect x="470" y="205" width="44" height="28" rx="8" fill="#1a2d45" stroke="#4e6886" stroke-width="1"/>
        <text x="492" y="224" class="small" text-anchor="middle">▲</text>
        <rect x="470" y="235" width="44" height="28" rx="8" fill="#1a2d45" stroke="#4e6886" stroke-width="1"/>
        <text x="492" y="254" class="small" text-anchor="middle">▼</text>
        <text x="760" y="280" class="small" text-anchor="end">القيمة المطبقة: 2.20</text>
      `;
      footer = 'حقل إدخال عائم مع أزرار زيادة ونقصان لضبط القيمة بدقة.';
      break;
    case 'ImGui::SliderInt':
      body = `
        <rect x="164" y="170" width="628" height="214" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="210" class="label" text-anchor="end">عدد العينات</text>
        <text x="216" y="210" class="small" text-anchor="start">64</text>
        <rect x="198" y="246" width="520" height="16" rx="999" fill="#0b1320" stroke="#4f657f" stroke-width="2"/>
        <rect x="198" y="246" width="278" height="16" rx="999" fill="#5da8ff"/>
        <circle cx="476" cy="254" r="14" fill="#f8fbff" stroke="#9cb4cc" stroke-width="2"/>
        <text x="752" y="320" class="small" text-anchor="end">القيمة الصحيحة الحالية تتغير بخطوات كاملة فقط.</text>
      `;
      footer = 'الصورة توضح أن SliderInt يشبه المنزلق العائم شكليًا، لكنه يربط الموضع بقيمة صحيحة discrete وليست عشرية.';
      break;
    case 'ImGui::InputFloat2':
    case 'ImGui::InputFloat3':
    case 'ImGui::InputFloat4':
      {
        const count = name.endsWith('2') ? 2 : name.endsWith('3') ? 3 : 4;
        const labels = count === 2 ? ['X', 'Y'] : count === 3 ? ['X', 'Y', 'Z'] : ['X', 'Y', 'Z', 'W'];
        body = `
          <rect x="150" y="164" width="640" height="230" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
          <text x="750" y="202" class="small" text-anchor="end">متجه ${count}D</text>
          ${labels.map((label, i) => `
            <text x="736" y="${246 + (i * 42)}" class="small" text-anchor="end">${label}</text>
            <rect x="264" y="${224 + (i * 42)}" width="430" height="34" rx="10" fill="#0d1522" stroke="#71849c" stroke-width="2"/>
            <text x="664" y="${246 + (i * 42)}" class="small" text-anchor="end">${(i + 1) * 1.25}</text>
          `).join('')}
        `;
        footer = `الصورة تشرح ${name.replace('ImGui::', '')} كحقل متعدد الخانات لقيم مترابطة مثل الموضع أو اللون أو الإزاحة، لا كحقل منفرد.`;
      }
      break;
    case 'ImGui::SliderAngle':
      body = `
        <rect x="164" y="168" width="628" height="224" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="206" class="label" text-anchor="end">زاوية الضوء</text>
        <rect x="198" y="238" width="520" height="16" rx="999" fill="#0b1320" stroke="#4f657f" stroke-width="2"/>
        <rect x="198" y="238" width="332" height="16" rx="999" fill="#5da8ff"/>
        <circle cx="530" cy="246" r="14" fill="#f8fbff" stroke="#9cb4cc" stroke-width="2"/>
        <circle cx="330" cy="328" r="50" fill="none" stroke="#6c8cab" stroke-width="3"/>
        <line x1="330" y1="328" x2="368" y2="294" stroke="#ffd674" stroke-width="4" stroke-linecap="round"/>
        <text x="752" y="334" class="small" text-anchor="end">القيمة تعرض بالدرجات بدل الراديان.</text>
      `;
      footer = 'الصورة تربط SliderAngle بمنزلق وقيمة زاوية ومعاينة اتجاهية صغيرة، حتى يكون معنى الزاوية أوضح من رقم مجرد.';
      break;
    case 'ImGui::DragFloat2':
    case 'ImGui::DragFloat3':
    case 'ImGui::DragFloat4':
      {
        const count = name.endsWith('2') ? 2 : name.endsWith('3') ? 3 : 4;
        const labels = count === 2 ? ['X', 'Y'] : count === 3 ? ['X', 'Y', 'Z'] : ['X', 'Y', 'Z', 'W'];
        body = `
          <rect x="150" y="160" width="640" height="236" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
          <text x="750" y="198" class="small" text-anchor="end">سحب قيم متجه ${count}D</text>
          ${labels.map((label, i) => `
            <text x="736" y="${242 + (i * 42)}" class="small" text-anchor="end">${label}</text>
            <rect x="260" y="${220 + (i * 42)}" width="434" height="34" rx="10" fill="#122132" stroke="#6d89a7" stroke-width="2"/>
            <text x="664" y="${242 + (i * 42)}" class="small" text-anchor="end">${(i * 2.0 + 4.0).toFixed(1)}</text>
            <path d="M286 ${237 + (i * 42)} L304 ${237 + (i * 42)}" stroke="#8ac6ff" stroke-width="3" stroke-linecap="round"/>
          `).join('')}
        `;
        footer = `الصورة توضّح أن ${name.replace('ImGui::', '')} يعتمد على السحب الأفقي داخل كل خانة لتعديل عدة قيم مترابطة بسرعة.`;
      }
      break;
    case 'ImGui::Image':
      body = `
        <rect x="170" y="164" width="590" height="234" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="730" y="198" class="small" text-anchor="end">معاينة Texture</text>
        <rect x="238" y="220" width="220" height="132" rx="14" fill="#2d557f"/>
        <rect x="260" y="242" width="76" height="44" rx="8" fill="#4f95f5"/>
        <rect x="348" y="242" width="88" height="44" rx="8" fill="#f29c52"/>
        <rect x="260" y="298" width="176" height="32" rx="8" fill="#5bb58f"/>
        <text x="730" y="286" class="small" text-anchor="end">ImTextureID يعرض الصورة فقط</text>
      `;
      footer = 'الصورة تشرح ImGui::Image كعنصر عرض texture أو thumbnail داخل النافذة، من دون سلوك زر افتراضي.';
      break;
    case 'ImGui::ImageButton':
      body = `
        <rect x="170" y="164" width="590" height="234" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="730" y="198" class="small" text-anchor="end">Image Button</text>
        <rect x="300" y="222" width="150" height="110" rx="14" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <rect x="322" y="242" width="106" height="32" rx="8" fill="#4f95f5"/>
        <rect x="322" y="286" width="80" height="22" rx="8" fill="#5bb58f"/>
        <text x="730" y="318" class="small" text-anchor="end">صورة قابلة للنقر كسلوك زر</text>
      `;
      footer = 'الصورة تبين الفرق عن ImGui::Image: هنا المعاينة نفسها عنصر تفاعلي يُستخدم كزر داخل شريط أو لوحة أدوات.';
      break;
    case 'ImGui::Columns':
    case 'ImGui::NextColumn':
    case 'ImGui::GetColumnWidth':
      body = `
        <rect x="164" y="164" width="628" height="232" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="752" y="198" class="small" text-anchor="end">تخطيط Columns</text>
        <line x1="356" y1="220" x2="356" y2="360" stroke="#597694" stroke-width="2"/>
        <line x1="548" y1="220" x2="548" y2="360" stroke="#597694" stroke-width="2"/>
        <rect x="186" y="236" width="146" height="36" rx="10" fill="#15314d"/><text x="316" y="260" class="small" text-anchor="end">الاسم</text>
        <rect x="378" y="236" width="146" height="36" rx="10" fill="#132131"/><text x="508" y="260" class="small" text-anchor="end">النوع</text>
        <rect x="570" y="236" width="184" height="36" rx="10" fill="#132131"/><text x="734" y="260" class="small" text-anchor="end">الحالة</text>
        <text x="752" y="334" class="small" text-anchor="end">NextColumn ينقل المؤشر للعمود التالي، وGetColumnWidth يقرأ عرضه.</text>
      `;
      footer = 'الصورة تجمع شكل الأعمدة نفسها مع وظيفة التنقل بينها وقراءة العرض، لأن هذه الدوال تعمل ضمن نفس بنية التخطيط.';
      break;
    case 'ImGui::SetNextWindowPos':
    case 'ImGui::SetNextWindowSize':
      body = `
        <rect x="110" y="144" width="700" height="278" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="210" y="198" width="234" height="142" rx="18" fill="#15314d" stroke="#7aa8d6" stroke-width="2"/>
        <text x="426" y="228" class="small" text-anchor="end">نافذة الهدف</text>
        <path d="M160 184 L210 184 L210 198" fill="none" stroke="#8ac6ff" stroke-width="3"/>
        <path d="M444 340 L494 340 L494 390" fill="none" stroke="#8ac6ff" stroke-width="3"/>
        <text x="760" y="240" class="small" text-anchor="end">SetNextWindowPos يحدد موضع النافذة قبل Begin</text>
        <text x="760" y="286" class="small" text-anchor="end">SetNextWindowSize يحدد أبعادها الأولية أو التالية</text>
      `;
      footer = 'الصورة توضح أن الدالتين تضبطان النافذة القادمة قبل فتحها، إما من حيث الموضع أو الحجم، وليس بعد أن تصبح معروضة بالفعل.';
      break;
    case 'ImGui::BeginPopupModal':
    case 'ImGui::CloseCurrentPopup':
      body = `
        <rect x="138" y="150" width="644" height="264" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="138" y="150" width="644" height="264" rx="22" fill="#08101a" opacity="0.55"/>
        <rect x="286" y="190" width="350" height="180" rx="20" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="608" y="226" class="popup-item" text-anchor="end">Delete Asset?</text>
        <text x="608" y="264" class="popup-item" text-anchor="end">هذه نافذة modal توقف التفاعل مع الخلفية.</text>
        <rect x="340" y="306" width="110" height="40" rx="10" fill="#d96a6a"/><text x="395" y="332" class="popup-item" text-anchor="middle">حذف</text>
        <rect x="468" y="306" width="110" height="40" rx="10" fill="#dbeafe"/><text x="523" y="332" class="popup-item" text-anchor="middle">إلغاء</text>
      `;
      footer = 'الصورة تشرح BeginPopupModal كحوار معتم يعلو الواجهة، وCloseCurrentPopup كإغلاق من داخل نفس النطاق بعد تنفيذ قرار أو إلغاء.';
      break;
    case 'ImGui::EndTabBar':
    case 'ImGui::EndTabItem':
      body = `
        <rect x="164" y="166" width="628" height="228" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="188" y="194" width="160" height="40" rx="12" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/><text x="268" y="220" class="popup-item" text-anchor="middle">عام</text>
        <rect x="358" y="194" width="160" height="40" rx="12" fill="#1a2d45" stroke="#5d7896" stroke-width="2"/><text x="438" y="220" class="small" text-anchor="middle">المواد</text>
        <rect x="528" y="194" width="160" height="40" rx="12" fill="#1a2d45" stroke="#5d7896" stroke-width="2"/><text x="608" y="220" class="small" text-anchor="middle">تشخيص</text>
        <rect x="188" y="252" width="500" height="110" rx="16" fill="#132131"/>
        <text x="660" y="316" class="small" text-anchor="end">EndTabItem يغلق محتوى التبويب الحالي وEndTabBar يغلق الحاوية كلها.</text>
      `;
      footer = 'الصورة توضح التبويب والحاوية معًا، لأن هاتين الدالتين هما نقطة الإغلاق المنطقي للمحتوى ولشريط التبويبات.';
      break;
    case 'ImGui::GetCursorPos':
    case 'ImGui::SetCursorPos':
      body = `
        <rect x="164" y="162" width="628" height="236" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="198" y="198" width="500" height="150" rx="16" fill="#132131"/>
        <line x1="258" y1="198" x2="258" y2="348" stroke="#587899" stroke-width="2" stroke-dasharray="6 6"/>
        <line x1="198" y1="270" x2="698" y2="270" stroke="#587899" stroke-width="2" stroke-dasharray="6 6"/>
        <circle cx="258" cy="270" r="7" fill="#ffce6c"/>
        <text x="672" y="226" class="small" text-anchor="end">الموضع الحالي للمؤشر داخل النافذة</text>
        <text x="672" y="322" class="small" text-anchor="end">SetCursorPos ينقل نقطة الإدراج وGetCursorPos يقرأها.</text>
      `;
      footer = 'الصورة تعرض المؤشر التخطيطي داخل مساحة النافذة نفسها، وهو المعنى العملي لـ GetCursorPos وSetCursorPos أثناء ترتيب العناصر.';
      break;
    case 'ImGui::Separator':
    case 'ImGui::Spacing':
    case 'ImGui::NewLine':
      body = `
        <rect x="174" y="166" width="580" height="228" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <text x="724" y="206" class="small" text-anchor="end">عنوان القسم</text>
        <line x1="206" y1="226" x2="722" y2="226" stroke="#6b89a8" stroke-width="3"/>
        <text x="724" y="268" class="small" text-anchor="end">Spacing يضيف فراغًا عموديًا مرئيًا</text>
        <text x="724" y="316" class="small" text-anchor="end">NewLine ينقل المحتوى إلى سطر جديد</text>
      `;
      footer = 'الصورة تجمع الفصل والخط الفاصل والفراغ وكسر السطر، لأن هذه الدوال تتحكم بإيقاع التخطيط أكثر من كونها عناصر مستقلة بحد ذاتها.';
      break;
    case 'ImGui::PushID':
    case 'ImGui::PopID':
    case 'ImGui::GetID':
      body = `
        <rect x="168" y="166" width="592" height="228" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="196" y="214" width="256" height="48" rx="12" fill="#15314d"/><text x="430" y="244" class="small" text-anchor="end">slot[0] -> ID فريد</text>
        <rect x="196" y="278" width="256" height="48" rx="12" fill="#132131"/><text x="430" y="308" class="small" text-anchor="end">slot[1] -> ID فريد</text>
        <text x="730" y="250" class="small" text-anchor="end">PushID يغيّر نطاق المعرفات مؤقتًا</text>
        <text x="730" y="296" class="small" text-anchor="end">GetID يحسب المعرف الحالي وPopID يعيد النطاق السابق</text>
      `;
      footer = 'الصورة توضّح مشكلة العناصر المتشابهة داخل القوائم والحلقات، وكيف يجعلها PushID/GetID/PopID مميزة داخليًا.';
      break;
    case 'ImGui::BeginMenu':
    case 'ImGui::EndMenu':
    case 'ImGui::MenuItem':
      body = `
        <rect x="150" y="160" width="620" height="236" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="176" y="186" width="568" height="40" rx="12" fill="#162b42"/><text x="716" y="212" class="small" text-anchor="end">File   Edit   View</text>
        <rect x="220" y="226" width="156" height="132" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="356" y="256" class="popup-item" text-anchor="end">Open</text><text x="356" y="288" class="popup-item" text-anchor="end">Save</text><text x="356" y="320" class="popup-item" text-anchor="end">Exit</text>
        <text x="720" y="326" class="small" text-anchor="end">BeginMenu يفتح الفرع، MenuItem يمثل الأمر، EndMenu يغلقه.</text>
      `;
      footer = 'الصورة تربط الدوال الثلاث في مشهد واحد، لأنها تعمل معًا لبناء قائمة فرعية وأوامرها ثم إغلاقها بشكل متوازن.';
      break;
    case 'ImGui::BeginTooltip':
    case 'ImGui::EndTooltip':
      body = `
        <rect x="170" y="172" width="588" height="214" rx="20" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="224" y="236" width="160" height="54" rx="14" fill="#5b8fd0"/><text x="304" y="270" class="label" text-anchor="middle">Hover Me</text>
        <rect x="414" y="188" width="250" height="110" rx="16" fill="#f3f7fb" stroke="#d6e1eb" stroke-width="2"/>
        <text x="640" y="222" class="popup-item" text-anchor="end">Tooltip قصيرة</text>
        <text x="640" y="252" class="popup-item" text-anchor="end">الاسم + المعنى + الخطأ الشائع</text>
        <path d="M396 236 L414 228" stroke="#8ac6ff" stroke-width="3"/>
      `;
      footer = 'الصورة توضّح الـ tooltip كنافذة شرح عائمة تظهر عند hover ثم تُغلق بنهاية نطاق BeginTooltip/EndTooltip.';
      break;
    case 'ImGui::IsMouseDown':
    case 'ImGui::IsKeyDown':
      body = `
        <rect x="164" y="168" width="628" height="224" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="204" y="218" width="220" height="110" rx="16" fill="#132131"/>
        <circle cx="252" cy="272" r="18" fill="#5da8ff"/><text x="394" y="278" class="small" text-anchor="end">IsMouseDown = true</text>
        <rect x="470" y="228" width="220" height="94" rx="16" fill="#132131"/>
        <rect x="500" y="254" width="42" height="42" rx="10" fill="#5da8ff"/><text x="668" y="280" class="small" text-anchor="end">IsKeyDown(W) = true</text>
      `;
      footer = 'الصورة تشرح أن الدالتين تقرآن حالة الضغط المستمرة الحالية، لا حدث النقر أو الإفلات لمرة واحدة.';
      break;
    case 'ImGui::TableNextRow':
    case 'ImGui::TableNextColumn':
    case 'ImGui::EndTable':
      body = `
        <rect x="160" y="164" width="632" height="232" rx="22" fill="#0d1726" stroke="#40536b" stroke-width="2"/>
        <rect x="184" y="194" width="584" height="42" rx="12" fill="#1a2d45"/>
        <line x1="372" y1="194" x2="372" y2="364" stroke="#597694" stroke-width="2"/>
        <line x1="556" y1="194" x2="556" y2="364" stroke="#597694" stroke-width="2"/>
        <text x="342" y="220" class="small" text-anchor="end">الاسم</text><text x="528" y="220" class="small" text-anchor="end">النوع</text><text x="742" y="220" class="small" text-anchor="end">الحالة</text>
        <rect x="196" y="248" width="560" height="44" rx="10" fill="#132131"/>
        <rect x="196" y="302" width="560" height="44" rx="10" fill="#101a29"/>
        <text x="742" y="382" class="small" text-anchor="end">TableNextRow يبدأ صفًا جديدًا، TableNextColumn ينقل بين الخلايا، EndTable يغلق الجدول.</text>
      `;
      footer = 'الصورة توضح دورة بناء الجدول من صفوف وأعمدة ثم إغلاق الحاوية، لأن هذه الدوال لا تُفهم جيدًا إلا داخل نفس البنية.';
      break;
    default:
      break;
  }

  if (!body) {
    body = buildImguiMockupShotBody(item?.guiRepresentation?.mockup || '');
  }

  if (!body) {
    return '';
  }

  const safeWindowTitle = escapeImguiSvgText(windowTitle);
  const safeFooter = escapeImguiSvgText(footer);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 520" role="img" aria-label="${safeWindowTitle}">
      <defs>
        <linearGradient id="imguiShotBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f1722"/>
          <stop offset="100%" stop-color="#09111b"/>
        </linearGradient>
        <linearGradient id="imguiShotHeader" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d7e6f5"/>
          <stop offset="100%" stop-color="#f8fbff"/>
        </linearGradient>
      </defs>
      <style>
        .title{font:700 30px "Segoe UI",Tahoma,Arial,sans-serif;fill:#08111c}
        .label{font:600 24px "Segoe UI",Tahoma,Arial,sans-serif;fill:#eef5fc}
        .small{font:500 20px "Segoe UI",Tahoma,Arial,sans-serif;fill:#c8d6e5}
        .footer{font:500 19px "Segoe UI",Tahoma,Arial,sans-serif;fill:#9cb0c5}
        .popup-item{font:600 22px "Segoe UI",Tahoma,Arial,sans-serif;fill:#162234}
      </style>
      <rect width="920" height="520" rx="36" fill="url(#imguiShotBg)"/>
      <rect x="64" y="54" width="792" height="412" rx="30" fill="#101927" stroke="#293649" stroke-width="3"/>
      <rect x="64" y="54" width="792" height="74" rx="30" fill="url(#imguiShotHeader)"/>
      <circle cx="110" cy="91" r="10" fill="#e06a62"/>
      <circle cx="142" cy="91" r="10" fill="#dca84b"/>
      <circle cx="174" cy="91" r="10" fill="#61c072"/>
      <text x="814" y="101" class="title" text-anchor="end">${safeWindowTitle}</text>
      ${body}
      <text x="820" y="500" class="footer" text-anchor="end">${safeFooter}</text>
    </svg>
  `.trim();

  return normalizeImguiExampleShotSource(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, item);
}

function inferSpecificFunctionSummary(item) {
  const name = String(item?.name || '');

  if (/^vkCreateInstance$/.test(name)) {
    return {
      intent: 'ينشئ كائن VkInstance الذي يمثل نقطة البداية لاتصال التطبيق بمكتبة Vulkan والامتدادات والطبقات المطلوبة',
      benefit: 'يفيد لأنه الخطوة الأولى التي لا يمكن قبلها استكشاف الأجهزة أو إنشاء السطوح أو تفعيل طبقات التحقق أو متابعة بقية مسار Vulkan'
    };
  }

  if (/^vkEnumeratePhysicalDevices$/.test(name)) {
    return {
      intent: 'يعدّد الأجهزة الفيزيائية المتاحة المرتبطة بالمثيل ويعيد مقابضها حتى تتمكن من فحصها واختيار الجهاز المناسب',
      benefit: 'يفيد لأنه ينقل التطبيق من مرحلة إنشاء المثيل إلى مرحلة اكتشاف العتاد الفعلي واختيار VkPhysicalDevice الذي سيُبنى عليه إنشاء الجهاز المنطقي'
    };
  }

  if (/^vkCreateDevice$/.test(name)) {
    return {
      intent: 'ينشئ جهازاً منطقياً VkDevice من جهاز فيزيائي محدد وفق الطوابير والامتدادات والميزات المطلوبة',
      benefit: 'يفيد لأنه ينقل التطبيق من مجرد معرفة العتاد إلى امتلاك الواجهة البرمجية الفعلية التي ستنشئ الموارد والطوابير وتنفذ العمل على الـ GPU'
    };
  }

  if (/^vkGetDeviceQueue$/.test(name)) {
    return {
      intent: 'يسترجع مقبض الطابور الفعلي من الجهاز المنطقي لعائلة الطوابير والفهرس المطلوبين',
      benefit: 'يفيد لأن إنشاء VkDevice وحده لا يكفي؛ يجب الحصول على VkQueue الفعلي قبل إرسال أوامر الرسم أو النقل أو الحوسبة'
    };
  }

  if (/^vkEnumeratePhysicalDeviceShaderInstrumentationMetricsARM$/.test(name)) {
    return {
      intent: 'يعدّد مقاييس تتبع الشيدر التي يدعمها الجهاز الفيزيائي ويعيد أوصافها حتى تعرف ما الذي يمكن قياسه فعلياً',
      benefit: 'يفيد قبل الاعتماد على shader instrumentation لأنك تحتاج معرفة المقاييس المدعومة وحجم المصفوفة المطلوب قبل قراءة الأوصاف التفصيلية منها'
    };
  }

  if (/^vkEnumeratePhysicalDeviceQueueFamilyPerformanceQueryCountersKHR$/.test(name)) {
    return {
      intent: 'تعدّد عدادات الأداء التي تدعمها عائلة طوابير محددة على جهاز فيزيائي، وتكتب خصائص كل عداد ووصفه في المصفوفات التي تمررها إلى الدالة',
      benefit: 'تفيد قبل استخدام performance queries حتى تعرف أي counters متاحة فعلاً لهذه العائلة، وتختار منها ما ستقيسه أو تراقبه داخل التطبيق'
    };
  }

  if (/PerformanceQueryCounters/.test(name) && name.startsWith('vkEnumerate')) {
    return {
      intent: 'تعدّد عدادات الأداء المتاحة في هذا السياق وتعيد خصائصها حتى تعرف ما الذي يمكن قياسه فعلياً',
      benefit: 'تفيد لاختيار عدادات الأداء المدعومة قبل إنشاء أو استخدام استعلامات الأداء'
    };
  }

  if (/^vkGetPhysicalDeviceQueueFamilyPerformanceQueryPassesKHR$/.test(name)) {
    return {
      intent: 'تحسب عدد مرات التنفيذ أو passes المطلوبة لجمع عدادات الأداء المحددة من عائلة الطوابير هذه',
      benefit: 'تفيد قبل تسجيل أو إرسال performance queries حتى تعرف كم مرة يجب أن تشغّل القياس لتغطي كل العدادات المطلوبة'
    };
  }

  if (/^vkAcquireDrmDisplayEXT$/.test(name)) {
    return {
      intent: 'تمنح مثيل Vulkan حق التحكم المباشر في VkDisplayKHR عبر DRM حتى يستطيع التطبيق التعامل مع مخرج العرض نفسه على مستوى النظام',
      benefit: 'تفيد عندما يعمل التطبيق في مسار display المباشر على Linux، لأن Vulkan تحتاج امتلاك مخرج العرض نفسه قبل استخدامه في أوضاع العرض غير المعتمدة على نظام نوافذ تقليدي'
    };
  }

  if (/^vkAcquireXlibDisplayEXT$/.test(name)) {
    return {
      intent: 'تمنح مثيل Vulkan حق التحكم المباشر في VkDisplayKHR عبر Xlib/X11',
      benefit: 'تفيد عندما يحتاج التطبيق ربط Vulkan بمخرج عرض معروف على X11 والتعامل معه مباشرة خارج مسار النوافذ التقليدي'
    };
  }

  if (/^vkAcquireWinrtDisplayNV$/.test(name)) {
    return {
      intent: 'تمنح مثيل Vulkan حق التحكم المباشر في VkDisplayKHR عبر WinRT على المنصة المدعومة',
      benefit: 'تفيد عندما يعتمد التطبيق على امتداد العرض المباشر الخاص بالمنصة ويحتاج امتلاك مخرج العرض نفسه قبل استخدامه'
    };
  }

  if (/^vkBuildAccelerationStructuresKHR$/.test(name)) {
    return {
      intent: 'يبني أو يحدّث Acceleration Structures من جهة المضيف مباشرة مع قراءة أوصاف Geometry ونطاقات الـ Primitives ثم إطلاق بناء BVH وفق هذه البيانات',
      benefit: 'يفيد عندما تريد تنفيذ build أو update من المضيف بدلاً من تسجيل أمر vkCmdBuildAccelerationStructuresKHR داخل Command Buffer، مع بقاء الحاجة نفسها إلى أوصاف Geometry وأحجام Scratch Buffers صحيحة'
    };
  }

  if (/^vkCreateVideoSessionKHR$/.test(name)) {
    return {
      intent: 'تنشئ جلسة فيديو تربط الجهاز بإعدادات الترميز أو فك الترميز والملفات التعريفية التي سيعمل عليها مسار الفيديو',
      benefit: 'تفيد لأنها تمثل الكائن الأساسي الذي لا يمكن بدء أوامر الفيديو أو ربط ذاكرته أو تحديث معاملاته قبل إنشائه'
    };
  }

  if (/^vkBindVideoSessionMemoryKHR$/.test(name)) {
    return {
      intent: 'تربط كتل الذاكرة المطلوبة بجلسة الفيديو حتى تصبح الجلسة قابلة للاستخدام الفعلي في أوامر الترميز أو فك الترميز',
      benefit: 'تفيد لأنها تنقل جلسة الفيديو من مجرد كائن منشأ إلى كائن يملك الذاكرة التي يحتاجها التشغيل'
    };
  }

  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return {
      intent: 'يسجل أمراً يبدأ أو يضبط أو ينهي نطاق ترميز الفيديو داخل مخزن الأوامر حتى تنفذ أوامر الفيديو ضمن السياق الصحيح',
      benefit: 'يفيد لأنه يحدد حدود جلسة ترميز الفيديو والحالة التشغيلية المرتبطة بها قبل أو أثناء تنفيذ أوامر الترميز أو فك الترميز'
    };
  }

  if (/^vkAcquireDrmDisplayEXT$/.test(name)) {
    return {
      intent: 'يمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر طبقة DRM',
      benefit: 'يفيد عندما تريد استخدام امتدادات العرض المباشر في Vulkan، لأن التطبيق يحتاج أولاً امتلاك هذا المخرج من طبقة النظام قبل التعامل معه'
    };
  }

  if (/^vkAcquireXlibDisplayEXT$/.test(name)) {
    return {
      intent: 'يمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر Xlib/X11',
      benefit: 'يفيد عندما يعمل التطبيق فوق X11 وتريد أن تجعل Vulkan تتعامل مع مخرج العرض نفسه عبر امتداد المنصة المناسب'
    };
  }

  if (/^vkAcquireWinrtDisplayNV$/.test(name)) {
    return {
      intent: 'يمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر WinRT',
      benefit: 'يفيد عندما تعمل على منصة WinRT وتحتاج أن تجعل Vulkan تتعامل مباشرة مع مخرج العرض المرتبط بهذا المقبض'
    };
  }

  if (/^vkCmdDebugMarkerInsertEXT$/.test(name)) {
    return {
      intent: 'يسجل إدراج علامة debug marker داخل مخزن الأوامر في الموضع الحالي',
      benefit: 'يفيد أثناء التصحيح والتحليل لأن أدوات التطوير تعرض هذه العلامة كنقطة مرجعية داخل تسلسل الأوامر المسجل'
    };
  }

  if (/^vkCmdDecompressMemoryEXT$/.test(name)) {
    return {
      intent: 'يسجل أمراً لفك ضغط البيانات بين مناطق الذاكرة داخل مخزن الأوامر',
      benefit: 'يفيد عندما تكون البيانات مخزنة بشكل مضغوط وتريد فكها على الجهاز مباشرة بدلاً من فك الضغط على المضيف ثم رفعها من جديد'
    };
  }

  if (/^vkCmdDecompressMemoryIndirectCount(EXT|NV)$/.test(name)) {
    return {
      intent: 'يسجل أمراً لفك ضغط البيانات بين مناطق الذاكرة بطريقة غير مباشرة، مع قراءة عدد العمليات من ذاكرة الجهاز',
      benefit: 'يفيد عندما يكون عدد أوصاف فك الضغط نفسه ديناميكياً أو معروفاً فقط على الجهاز، لأن GPU يستطيع قراءة العدد وتنفيذ العمليات مباشرة'
    };
  }

  if (/^vkCmdDecompressMemoryNV$/.test(name)) {
    return {
      intent: 'يسجل أمراً لفك ضغط الذاكرة التي تحتوي على بيانات مضغوطة داخل مخزن الأوامر',
      benefit: 'يفيد عندما تريد تحويل البيانات المضغوطة إلى شكل قابل للاستخدام على الجهاز من دون نقل عبء فك الضغط إلى المضيف'
    };
  }

  if (/^vkCmdDispatchBase$/.test(name)) {
    return {
      intent: 'يسجل إطلاق عمل حوسبي مع قيم أساس غير صفرية لمعرفات مجموعات العمل',
      benefit: 'يفيد عندما تريد أن يبدأ توزيع workgroups من إزاحة محددة بدلاً من الصفر، مثل تقسيم نطاق العمل إلى دفعات أو مناطق مختلفة'
    };
  }

  if (/^vkCmdDraw$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم غير مفهرس اعتماداً على الرؤوس المرتبطة حالياً في مخزن الأوامر',
      benefit: 'يفيد عندما تكون الرؤوس مرتبة مباشرة داخل مخزن الرؤوس ولا تحتاج إلى مخزن فهارس، مثل الرسوم البسيطة أو الحالات التي لا يتكرر فيها استخدام الرؤوس'
    };
  }

  if (/^vkCmdDrawIndexed$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم مفهرس يستخدم مخزن الفهارس لإعادة استخدام الرؤوس المرتبطة',
      benefit: 'يفيد عندما تتشارك البدائيات في الرؤوس نفسها، لأن الفهرسة تقلل تكرار البيانات وتحسن كفاءة الذاكرة وتمرير الرؤوس'
    };
  }

  if (/^vkCmdDrawIndirect$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم غير مباشر مع قراءة معلمات الرسم من مخزن في الذاكرة بدلاً من تمريرها مباشرة',
      benefit: 'يفيد عندما تكون معلمات الرسم تُكتب أو تُحسب مسبقاً في الذاكرة أو على الجهاز نفسه، لأن التنفيذ يستطيع قراءتها مباشرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDrawIndexedIndirect$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم مفهرس غير مباشر مع قراءة معلمات الرسم من مخزن في الذاكرة',
      benefit: 'يفيد عندما تريد مزايا الرسم المفهرس مع مزايا الرسم غير المباشر في الوقت نفسه، خصوصاً إذا كانت معلمات الرسم تنتج ديناميكياً على الجهاز'
    };
  }

  if (/^vkCmdDrawIndirectCount(?:KHR|AMD)?$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن في الذاكرة',
      benefit: 'يفيد عندما يكون عدد الرسومات المطلوب تنفيذه يُحسب أو يُنتج على الجهاز نفسه، لأن التنفيذ يستطيع قراءة العدد والمعلمات من الذاكرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDrawIndexedIndirectCount(?:KHR|AMD)?$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم مفهرس غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن في الذاكرة',
      benefit: 'يفيد عندما تكون معلمات الرسم وعدد الأوامر الناتجة ديناميكياً أو مولدة على الجهاز نفسه، لأن التنفيذ يقرأ العدد والمعلمات مباشرة مع الاستفادة من الفهارس لإعادة استخدام الرؤوس'
    };
  }

  if (/^vkCmdDrawIndirectByteCountEXT$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم غير مباشر مع اشتقاق عدد الرؤوس من قيمة عداد بايتات مخزنة في counterBuffer',
      benefit: 'يفيد عندما تنتج مرحلة سابقة كمية بيانات رؤوس متغيرة، مثل مسار transform feedback، لأن الرسم يعتمد مباشرة على عدد البايتات المكتوبة فعلياً بدلاً من حساب vertexCount يدوياً على المضيف'
    };
  }

  if (/^vkCmdDrawMeshTasks(?:EXT|NV)?$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم يعتمد على mesh shaders عبر إطلاق مجموعات عمل لمهام mesh',
      benefit: 'يفيد عندما يستخدم التطبيق مسار mesh shading، لأن العمل يُقسَّم إلى مجموعات mesh tasks بدل الاعتماد على المسار الرسومي التقليدي المبني على الرؤوس فقط'
    };
  }

  if (/^vkCmdDrawMeshTasksIndirect(?:EXT|NV)?$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم mesh shaders مع قراءة معلمات الإطلاق من مخزن في الذاكرة',
      benefit: 'يفيد عندما تكون معلمات إطلاق mesh tasks تُحسب أو تُنتج على الجهاز نفسه، لأن التنفيذ يستطيع قراءتها مباشرة من الذاكرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDrawMeshTasksIndirectCount(?:EXT|NV)?$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم mesh shaders غير مباشر مع قراءة عدد أوامر الإطلاق الفعلي من مخزن في الذاكرة',
      benefit: 'يفيد عندما يكون عدد أوامر mesh tasks المطلوب تنفيذه ديناميكياً أو مولداً على الجهاز، لأن المعالج الرسومي يقرأ العدد والمعلمات مباشرة وينفذ ما يلزم'
    };
  }

  if (/^vkCmdBeginDebugUtilsLabelEXT$/.test(name)) {
    return {
      intent: 'يسجل بداية نطاق تسمية تصحيحية داخل مخزن الأوامر',
      benefit: 'يفيد عند التحليل والتصحيح لأن أدوات التطوير تعرض الأوامر اللاحقة ضمن مقطع معنَّون يسهل تتبعه'
    };
  }

  if (/^vkCmdInsertDebugUtilsLabelEXT$/.test(name)) {
    return {
      intent: 'يسجل إدراج وسم تصحيحي في الموضع الحالي داخل مخزن الأوامر',
      benefit: 'يفيد لإضافة نقطة مرجعية سريعة داخل تسلسل الأوامر من دون فتح نطاق جديد كامل'
    };
  }

  if (/^vkCmdEndDebugUtilsLabelEXT$/.test(name)) {
    return {
      intent: 'يسجل إنهاء نطاق التسمية التصحيحية المفتوح حالياً داخل مخزن الأوامر',
      benefit: 'يفيد لإغلاق المقطع التصحيحي بشكل واضح حتى تعرف أدوات التحليل أين ينتهي هذا النطاق وتبدأ المقاطع اللاحقة'
    };
  }

  if (/^vkCmdBeginPerTileExecutionQCOM$/.test(name)) {
    return {
      intent: 'يسجل بداية نطاق التنفيذ لكل بلاطة داخل مخزن الأوامر',
      benefit: 'يفيد عندما تريد أن تعمل الأوامر اللاحقة وفق نمط معالجة يعتمد على البلاطات، لأن هذا الاستدعاء يحدد بداية هذا النطاق بوضوح'
    };
  }

  if (/^vkCmdBeginConditionalRenderingEXT$/.test(name)) {
    return {
      intent: 'يسجل بداية نطاق الرسم الشرطي داخل مخزن الأوامر بحيث تُنفَّذ أوامر الرسم اللاحقة فقط إذا تحقق الشرط المخزن في المورد المرتبط',
      benefit: 'يفيد عندما تريد جعل الرسم نفسه مشروطاً بنتيجة تولدت سابقاً على الجهاز، بدلاً من إعادة القرار إلى المضيف قبل كل دفعة رسم'
    };
  }

  if (/^vkCmdEndPerTileExecutionQCOM$/.test(name)) {
    return {
      intent: 'يسجل إنهاء نطاق التنفيذ لكل بلاطة المفتوح حالياً داخل مخزن الأوامر',
      benefit: 'يفيد لإغلاق هذا النطاق بشكل صحيح حتى لا تستمر الأوامر التالية في العمل وفق وضع التنفيذ لكل بلاطة من غير قصد'
    };
  }

  if (/^vkCmdEndConditionalRenderingEXT$/.test(name)) {
    return {
      intent: 'يسجل نهاية نطاق الرسم الشرطي داخل مخزن الأوامر بحيث تعود أوامر الرسم اللاحقة إلى التنفيذ غير المشروط',
      benefit: 'يفيد لإغلاق تأثير الرسم الشرطي في الموضع الصحيح ومنع امتداد الشرط إلى أوامر لاحقة لا ينبغي أن تخضع له'
    };
  }

  if (/^vkCmdDrawMultiEXT$/.test(name)) {
    return {
      intent: 'يسجل عدة أوامر رسم غير مفهرسة دفعة واحدة ضمن استدعاء واحد داخل مخزن الأوامر',
      benefit: 'يفيد عندما يكون لديك عدد كبير من الرسومات الصغيرة أو المتشابهة، لأن جمعها في استدعاء واحد يقلل كلفة تسجيل الأوامر وعدد نداءات الواجهة'
    };
  }

  if (/^vkCmdDrawMultiIndexedEXT$/.test(name)) {
    return {
      intent: 'يسجل عدة أوامر رسم مفهرسة دفعة واحدة ضمن استدعاء واحد داخل مخزن الأوامر',
      benefit: 'يفيد عندما تريد تنفيذ عدة رسومات مفهرسة متتالية بكلفة تسجيل أقل، لأن التطبيق يمرر مجموعة أوصاف الرسم مرة واحدة بدلاً من إصدار أمر مستقل لكل رسم'
    };
  }

  if (/^vkCmdDrawClusterHUAWEI$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم يعتمد على cluster culling بحيث تُعالج عناقيد الهندسة وتُستبعد العناقيد غير المرئية قبل الرسم الفعلي',
      benefit: 'يفيد في المشاهد الكبيرة أو الكثيفة، لأن استبعاد العناقيد غير المرئية مبكراً يقلل كمية العمل الرسومي والبيانات التي تمر إلى المراحل اللاحقة'
    };
  }

  if (/^vkCmdDrawClusterIndirectHUAWEI$/.test(name)) {
    return {
      intent: 'يسجل أمر رسم يعتمد على cluster culling مع قراءة معلمات التنفيذ من الذاكرة بشكل غير مباشر',
      benefit: 'يفيد عندما تكون معلمات الرسم أو عدد العناقيد المطلوب معالجتها تُنتج على الجهاز نفسه، لأن التنفيذ يستطيع قراءتها مباشرة من الذاكرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDispatchIndirect$/.test(name)) {
    return {
      intent: 'يسجل إطلاق عمل حوسبي مع قراءة أبعاد الإطلاق من مخزن في الذاكرة بدلاً من تمريرها مباشرة',
      benefit: 'يفيد عندما تكون أبعاد الإطلاق تُحسب أو تُكتب مسبقاً في مخزن على الجهاز، لأن التنفيذ يستطيع قراءتها مباشرة من الذاكرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDispatchTileQCOM$/.test(name)) {
    return {
      intent: 'يسجل إطلاق عمل حوسبي لكل بلاطة بحيث تنفذ المعالجة على مستوى البلاطات بدلاً من التوزيع الحوسبي العام',
      benefit: 'يفيد على العتاد الذي يعتمد معالجة كل بلاطة على حدة، لأن التنفيذ يستفيد من بيانات البلاطة المحلية ويمكن أن يقلل كلفة المعالجة العامة أو إعادة تمرير البيانات'
    };
  }

  if (/^vkCmdDispatchDataGraphARM$/.test(name)) {
    return {
      intent: 'يسجل إطلاق خط أنابيب data graph داخل جلسة العمل المرتبطة به',
      benefit: 'يفيد عندما يعتمد التنفيذ على data graph pipeline وتريد تشغيله ضمن الجلسة الحالية من داخل مخزن الأوامر'
    };
  }

  if (/^vkCmdDispatchGraphAMDX$/.test(name)) {
    return {
      intent: 'يسجل إطلاق execution graph داخل مخزن الأوامر',
      benefit: 'يفيد عندما يستخدم التطبيق execution graph لتشغيل العمل المعتمد على العقد والعلاقات بينها مباشرة على الجهاز'
    };
  }

  if (/^vkCmdDispatchGraphIndirectAMDX$/.test(name)) {
    return {
      intent: 'يسجل إطلاق execution graph بطريقة غير مباشرة مع قراءة معلمات العقدة والحمولة من الجهاز',
      benefit: 'يفيد عندما تكون معلمات الإطلاق أو الحمولة تُنتج على الجهاز نفسه، فتقرأها العملية مباشرة من الذاكرة من دون تدخل المضيف'
    };
  }

  if (/^vkCmdDispatchGraphIndirectCountAMDX$/.test(name)) {
    return {
      intent: 'يسجل إطلاق execution graph بطريقة غير مباشرة مع قراءة جميع معلمات الإطلاق والعدد المطلوب من الجهاز',
      benefit: 'يفيد عندما يكون عدد عمليات الإطلاق ومعلماتها يُنتج على الجهاز نفسه، لأن المعالج الرسومي يستطيع قراءتها مباشرة وتنفيذ العمل من دون أن يعيد المضيف تجهيز القيم'
    };
  }

  if (/^vkCmd(Decode|Encode)VideoKHR$/.test(name)) {
    return {
      intent: 'يسجل أمر الفيديو الذي ينفذ عملية التشفير أو فك التشفير نفسها على الموارد والمعاملات المجهزة مسبقاً',
      benefit: 'يفيد لتنفيذ عمل الفيديو الفعلي على الـ GPU بعد تجهيز الجلسة والمعاملات ومخازن البت والصور'
    };
  }

  if (/^vk(Create|Destroy|Get).*VideoSession.*KHR$/.test(name) || /^vkUpdateVideoSessionParametersKHR$/.test(name)) {
    return {
      intent: 'تدير كائنات جلسة الفيديو أو معاملاتها أو استعلاماتها اللازمة لمسار الفيديو في Vulkan',
      benefit: 'تفيد لبناء دورة حياة جلسة الفيديو كاملة من الإنشاء إلى الاستعلام والتحديث والتحرير'
    };
  }

  if (/^vk(Create|Destroy|Get|Copy|Write|Build).*AccelerationStructure.*(KHR|NV)$/.test(name) || /^vkCmd(Build|Copy|Write).*AccelerationStructure.*(KHR|NV)$/.test(name)) {
    return {
      intent: 'تنشئ أو تبني أو تنسخ أو تستعلم بنية تسارع تستخدمها خوارزميات تتبع الأشعة لتسريع اختبار تقاطعات الأشعة مع المشهد',
      benefit: 'تفيد لأن بنية التسارع هي الأساس الذي يجعل تتبع الأشعة عملياً وسريعاً، بدلاً من فحص جميع العناصر الهندسية واحداً واحداً'
    };
  }

  if (/^vkCreateRayTracingPipelines(KHR|NV)$/.test(name) || /^vkGetRayTracing.*(KHR|NV)$/.test(name) || /^vkCmdSetRayTracingPipelineStackSizeKHR$/.test(name)) {
    return {
      intent: 'تنشئ أو تستعلم أو تضبط أجزاء خط الأنابيب الخاصة بتتبع الأشعة مثل مجموعات الشيدر والمقابض وحجم المكدس',
      benefit: 'تفيد لتجهيز مسار تتبع الأشعة نفسه وربطه بالشيدرات والموارد التي سيستخدمها أثناء إطلاق الأشعة'
    };
  }

  if (/^vkCmdBindTransformFeedbackBuffersEXT$/.test(name)) {
    return {
      intent: 'يسجل ربط مخازن التغذية الراجعة للتحويل في نقاط الربط المطلوبة داخل مخزن الأوامر',
      benefit: 'يفيد قبل الأوامر التي تكتب نواتج المراحل الرسومية إلى مخازن التغذية الراجعة للتحويل، لأن هذه المخازن يجب أن تكون مربوطة مسبقاً كي تستقبل البيانات'
    };
  }

  if (/^vkCmdBindDescriptorBufferEmbeddedSamplers2?EXT$/.test(name)) {
    return {
      intent: 'يسجل ربط السامبلرات المضمّنة غير القابلة للتغيير المرتبطة بمخازن الواصفات داخل مخزن الأوامر',
      benefit: 'يفيد عندما يعتمد مسار descriptor buffer على سامبلرات مضمّنة جاهزة، لأن ربطها هنا يجعل الأوامر اللاحقة ترى هذه السامبلرات ضمن الحالة الصحيحة'
    };
  }

  if (/^vkCmdBindDescriptorBuffersEXT$/.test(name)) {
    return {
      intent: 'يسجل ربط مخازن الواصفات داخل مخزن الأوامر حتى تستخدمها الأوامر اللاحقة عند الوصول إلى الواصفات',
      benefit: 'يفيد لأنه يربط مصدر بيانات الواصفات نفسه قبل الرسم أو الحساب، بدلاً من الاعتماد على descriptor sets التقليدية وحدها'
    };
  }

  if (/^vkCmdBindVertexBuffers2/.test(name)) {
    return {
      intent: 'يسجل ربط مخازن الرؤوس في مخزن الأوامر مع تحديد قيم التباعد والإزاحات الخاصة بكل ربط',
      benefit: 'يفيد عندما تحتاج تحديد مصادر بيانات الرؤوس وكيفية التقدّم داخلها قبل أوامر الرسم اللاحقة، خصوصاً عند تغيير التباعد أو الإزاحات ديناميكياً'
    };
  }

  if (/^vkCmdBlitImage/.test(name)) {
    return {
      intent: 'يسجل أمراً لنسخ مناطق من صورة مصدر إلى صورة وجهة، مع السماح بالتحجيم أو تحويل التنسيق عند الحاجة',
      benefit: 'يفيد عندما تريد نقل أو تكبير أو تصغير محتوى صورة على المعالج الرسومي نفسه، بدلاً من تنفيذ ذلك يدوياً على المضيف'
    };
  }

  if (/^vkCmdClearAttachments$/.test(name)) {
    return {
      intent: 'يسجل أمراً لتصفير مرفقات محددة ضمن مخزن الإطارات المرتبط حالياً وفي مناطق مستهدفة فقط',
      benefit: 'يفيد عندما تحتاج مسح أجزاء أو مرفقات محددة داخل نطاق الرسم الحالي من دون إعادة تهيئة الصورة أو تمرير الرسم كاملاً'
    };
  }

  if (/^vkCmdClearColorImage$/.test(name)) {
    return {
      intent: 'يسجل أمراً لكتابة قيمة لون واحدة في مناطق محددة من صورة لونية',
      benefit: 'يفيد لتهيئة صورة اللون أو إعادة ضبطها إلى قيمة معروفة قبل استخدامها في الرسم أو النسخ أو أي خطوة لاحقة'
    };
  }

  if (/^vkCmdClearDepthStencilImage$/.test(name)) {
    return {
      intent: 'يسجل أمراً لملء مناطق من صورة العمق والاستنسل بقيم عمق واستنسل محددة',
      benefit: 'يفيد لتهيئة موارد العمق والاستنسل إلى حالة معروفة قبل بدء الرسم أو قبل إعادة استخدامها في تمرير لاحق'
    };
  }

  if (/^vkCmdCopyBuffer/.test(name)) {
    return {
      intent: 'يسجل أمراً لنسخ البيانات بين مناطق محددة من مخزن مصدر إلى مخزن وجهة',
      benefit: 'يفيد لنقل البيانات على المعالج الرسومي بين المخازن مباشرة، من دون الحاجة إلى نسخها على المضيف أو إعادة إنشائها'
    };
  }

  if (/^vkCmdCopyMemoryIndirect(KHR|NV)$/.test(name)) {
    return {
      intent: 'يسجل أمراً لنسخ البيانات بين مناطق ذاكرة موصوفة بشكل غير مباشر داخل مخزن الأوامر',
      benefit: 'يفيد عندما تكون أوصاف النسخ نفسها موجودة في الذاكرة أو تُولَّد ديناميكياً، لأن المعالج الرسومي يستطيع قراءتها وتنفيذ النسخ من دون تدخل المضيف'
    };
  }

  if (/^vkCmdCopyTensorARM$/.test(name)) {
    return {
      intent: 'يسجل أمراً لنسخ البيانات بين tensor مصدر وtensor وجهة داخل مخزن الأوامر',
      benefit: 'يفيد في مسارات التعلم الآلي أو المعالجة العددية عندما تحتاج نقل محتوى tensor بين موردين بطريقة تنفذ على الجهاز مباشرة'
    };
  }

  if (/^vkCmdCudaLaunchKernelNV$/.test(name)) {
    return {
      intent: 'يسجل أمراً لإطلاق نواة CUDA على الجهاز ضمن مخزن الأوامر باستخدام معلومات الإطلاق الممررة',
      benefit: 'يفيد عندما تريد دمج عمل CUDA مباشرة داخل تسلسل أوامر Vulkan بدلاً من إدارة هذا الإطلاق في مسار منفصل خارج مخزن الأوامر'
    };
  }

  if (/^vkCmdCuLaunchKernelNVX$/.test(name)) {
    return {
      intent: 'يسجل أمراً لإطلاق نواة CUDA وفق امتداد NVX الأقدم داخل مخزن الأوامر',
      benefit: 'يفيد عندما يعتمد المشروع على امتداد NVX التاريخي وتحتاج تشغيل نواة CUDA ضمن تسلسل أوامر Vulkan نفسه'
    };
  }

  if (/^vkCmdDebugMarkerBeginEXT$/.test(name)) {
    return {
      intent: 'يسجل بداية نطاق debug marker داخل مخزن الأوامر لتجميع الأوامر التالية تحت علامة تصحيحية واضحة',
      benefit: 'يفيد أثناء التصحيح والتحليل لأن أدوات التطوير تعرض هذا النطاق باسم واضح، فيسهل ربط الأوامر البرمجية بما يظهر على الـ GPU'
    };
  }

  if (/^vkCmdDebugMarkerEndEXT$/.test(name)) {
    return {
      intent: 'يسجل نهاية نطاق debug marker المفتوح حالياً داخل مخزن الأوامر',
      benefit: 'يفيد لإغلاق النطاق التصحيحي في الموضع الصحيح، بحيث تبقى العلامات والحدود الزمنية واضحة داخل أدوات التتبع والتحليل'
    };
  }

  if (/^vk(Build|Copy|Serialize|Deserialize).*Micromap.*EXT$/.test(name) || /^vkCmd(Build|Copy|Write).*Micromap.*EXT$/.test(name) || /Micromap/.test(name)) {
    return {
      intent: 'تنشئ أو تبني أو تنسخ أو تستعلم الميكروماب، وهو تمثيل يستخدم لوصف التفاصيل الدقيقة أو الشفافية المرتبطة بالهندسة داخل مسار تتبع الأشعة',
      benefit: 'تفيد لأن الميكروماب تسمح بتمثيل تفاصيل صغيرة أو حالات شفافية معقدة بكلفة أقل من تمثيلها كهندسة كاملة، وهذا يحسن التوازن بين الدقة والأداء في تتبع الأشعة'
    };
  }

  if (/^vkCopyImageToImage(EXT)?$/.test(name)) {
    return {
      intent: 'تنسخ بيانات صورة إلى صورة أخرى، بحيث تُقرأ الصورة المصدر ويُكتب الناتج في الصورة الهدف',
      benefit: 'تفيد عندما تحتاج نقل أو تكرار محتوى الصور بين موردين من دون إعادة إنشاء البيانات يدوياً'
    };
  }

  if (/^vkCopyImageToMemory(EXT)?$/.test(name)) {
    return {
      intent: 'تنسخ بيانات الصورة إلى ذاكرة الهدف أو إلى ذاكرة المضيف حتى يتمكن التطبيق من قراءتها أو حفظها',
      benefit: 'تفيد عندما تريد إخراج محتوى الصورة من Vulkan إلى ذاكرة يمكن معالجتها أو نقلها خارج الصورة نفسها'
    };
  }

  if (/^vkCopyMemoryToImage(EXT)?$/.test(name)) {
    return {
      intent: 'تنسخ بيانات من الذاكرة إلى صورة حتى يصبح المحتوى المنسوخ هو البيانات الجديدة للصورة الهدف',
      benefit: 'تفيد لرفع البيانات من الذاكرة أو من المضيف إلى صورة ستستخدم لاحقاً في الرسم أو التظليل'
    };
  }

  if (/^vkReleaseSwapchainImagesEXT$/.test(name)) {
    return {
      intent: 'تحرر صور swapchain التي سبق الاحتفاظ بها أو حجزها حتى تعود لإدارة سلسلة التبديل بشكل طبيعي',
      benefit: 'تفيد لإعادة الصور إلى دورة حياة العرض الصحيحة ومنع بقاء صور السلسلة محتجزة بلا حاجة'
    };
  }

  if (/^vkResetQueryPool(EXT)?$/.test(name)) {
    return {
      intent: 'تعيد تعيين query pool أو جزء منه حتى تصبح الاستعلامات المحددة جاهزة للاستخدام من جديد',
      benefit: 'تفيد قبل إعادة استخدام نفس الاستعلامات في قياس أو تتبع جديد بدلاً من إنشاء query pool جديد'
    };
  }

  if (/^vkSetPrivateData(EXT)?$/.test(name)) {
    return {
      intent: 'تربط قيمة بيانات خاصة يحددها التطبيق بكائن Vulkan محدد حتى يمكن استرجاعها لاحقاً',
      benefit: 'تفيد لربط معرفات أو مؤشرات أو سياق داخلي بكائنات Vulkan من دون بناء جداول جانبية معقدة'
    };
  }

  if (/^vkSignalSemaphore(KHR)?$/.test(name)) {
    return {
      intent: 'تفعّل semaphore من جهة الجهاز وفق معلومات الإشارة الممررة بحيث تتم مزامنة العمل اللاحق على هذه الحالة',
      benefit: 'تفيد عندما تحتاج توليد إشارة مزامنة صريحة ليعتمد عليها عمل آخر من دون إرسال طابور تقليدي'
    };
  }

  if (/^vkTransitionImageLayoutEXT$/.test(name)) {
    return {
      intent: 'تنفذ انتقال تخطيط الصورة إلى layout جديد حتى تصبح الصورة في الحالة الصحيحة للنسخ أو الرسم أو الاستخدام التالي',
      benefit: 'تفيد لضمان أن الصورة في التخطيط المناسب فعلاً بدلاً من الاعتماد على حالة سابقة قد لا تناسب العملية التالية'
    };
  }

  if (/^vkTrimCommandPool(KHR)?$/.test(name)) {
    return {
      intent: 'تقلص الذاكرة الداخلية غير المستخدمة داخل command pool وتحرر ما يمكن الاستغناء عنه منها',
      benefit: 'تفيد لتقليل استهلاك الذاكرة بعد الانتهاء من دفعات كبيرة من مخازن الأوامر أو بعد تغيّر نمط الاستخدام'
    };
  }

  if (/^vkUpdateDescriptorSetWithTemplate(KHR)?$/.test(name)) {
    return {
      intent: 'تحدث descriptor set باستخدام قالب template يحدد شكل الكتابة في الواصفات وترتيب البيانات المصدر',
      benefit: 'تفيد لتسريع وتبسيط تحديث الواصفات عندما يتكرر نفس شكل الكتابة مرات كثيرة'
    };
  }

  if (/^vkWaitForFences$/.test(name)) {
    return {
      intent: 'تنتظر حتى تدخل fences المحددة في حالة الإشارة أو حتى تنتهي المهلة المحددة',
      benefit: 'تفيد عندما تحتاج التأكد من اكتمال عمل GPU أو مجموعة أعمال قبل متابعة خطوة تعتمد على تلك النتيجة'
    };
  }

  if (/^vkWaitSemaphores(KHR)?$/.test(name)) {
    return {
      intent: 'تنتظر حتى تصل semaphores المحددة إلى الشروط أو القيم المطلوبة قبل متابعة التنفيذ',
      benefit: 'تفيد لبناء مزامنة دقيقة عندما يعتمد التقدم في التنفيذ على وصول semaphore إلى حالة محددة'
    };
  }

  if (name.startsWith('vkCmdBegin')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لتحديد بداية هذا النطاق أو هذه المرحلة بوضوح حتى تعمل الأوامر اللاحقة ضمنها بالشكل المقصود'
    };
  }

  if (name.startsWith('vkCmdEnd')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لإغلاق هذا النطاق أو هذه المرحلة بشكل صحيح حتى لا تستمر الأوامر اللاحقة في العمل ضمنها من غير قصد'
    };
  }

  if (name.startsWith('vkCmdBind')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لأن الأوامر اللاحقة تعتمد على هذا الربط فعلياً، سواء كان ربط موارد أو حالة أو مخازن أو خطوط أنابيب'
    };
  }

  if (name.startsWith('vkCmdSet')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لتغيير هذه الحالة ديناميكياً قبل الأوامر اللاحقة من دون الحاجة إلى إعادة إنشاء الكائنات أو خطوط الأنابيب من الصفر'
    };
  }

  if (name.startsWith('vkCmdPush')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لتمرير قيم أو بيانات صغيرة مباشرة إلى الحالة أو الشيدر في الموضع المطلوب داخل تسلسل الأوامر'
    };
  }

  if (name.startsWith('vkCmdCopy') || name.startsWith('vkCmdClear') || name.startsWith('vkCmdResolve') || name.startsWith('vkCmdBlit') || name.startsWith('vkCmdFill')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لتنفيذ هذه العملية على الموارد مباشرة على المعالج الرسومي، بدلاً من نقلها إلى المضيف أو إعادة بناء البيانات يدوياً'
    };
  }

  if (name.startsWith('vkCmd')) {
    return {
      intent: refineIntentByFunctionName(name, cleanFunctionMeaningSeed(item?.description || '')),
      benefit: 'يفيد لتسجيل هذا الأمر داخل مخزن الأوامر أولاً، ثم إرساله لاحقاً إلى الطابور بالتسلسل الصحيح الذي يريده التطبيق'
    };
  }

  return null;
}

function getContextualFieldMetadata(fieldName, ownerType = '', fieldType = '', detail = '') {
  const normalizedOwner = normalizeLookupName(ownerType);
  const normalizedType = normalizeLookupName(fieldType);
  const enumMeta = normalizedType && normalizedType.startsWith('Vk') ? getEnumMetadata(normalizedType) : null;
  const ownerIsAttachmentDescription = /^VkAttachmentDescription\d*(KHR|EXT)?$/.test(normalizedOwner);
  const ownerIsAabbPositions = /^VkAabbPositions(KHR|NV)?$/.test(normalizedOwner);
  const ownerIsAccelerationStructureBuildSizesInfo = normalizedOwner === 'VkAccelerationStructureBuildSizesInfoKHR';
  const ownerIsAccelerationStructureFamily = /^VkAccelerationStructure/.test(normalizedOwner);
  const ownerIsDeviceCreateInfo = normalizedOwner === 'VkDeviceCreateInfo';
  const ownerItem = normalizedOwner ? findItemInCategories(vulkanData.structures, normalizedOwner) : null;
  const ownerIntent = ownerItem ? inferStructureRole(ownerItem).intent : '';
  const ownerSummary = getOwnerStructureSummary(normalizedOwner);
  const ownerIsCopyInfo = /^VkCopy[A-Za-z0-9_]*Info(?:KHR|EXT)?$/.test(normalizedOwner);
  const ownerIsCopyMicromapInfo = /^VkCopyMicromapInfoEXT$/.test(normalizedOwner);
  const ownerIsAcquireProfilingLockInfo = normalizedOwner === 'VkAcquireProfilingLockInfoKHR';

  if (ownerIsAabbPositions && /^min[XYZ]$/.test(fieldName)) {
    const axis = fieldName.slice(-1);
    return {
      what: `الحد الأدنى للصندوق على المحور ${axis}.`,
      meaning: `يمثل أصغر إحداثي على المحور ${axis} للحجم الذي يصفه ${normalizedOwner}، أي بداية الصندوق من هذه الجهة.`,
      usage: `اضبطه بحيث يطابق الحد الأدنى الفعلي للمجسم أو المنطقة على المحور ${axis} داخل نفس الفضاء المرجعي لبقية الإحداثيات.`,
      possibleValues: 'قيمة float تمثل الحد الأدنى الصحيح على هذا المحور.',
      invalid: 'إذا كانت هذه القيمة أكبر من الحد الأعلى المقابل أو مكتوبة في فضاء مختلف فسيصبح الصندوق الموصوف غير صحيح.',
      inline: `يمثل الحد الأدنى للصندوق على المحور ${axis}`,
      benefit: 'فائدته أنه يحدد بداية الحجم المكاني على هذا المحور، فلا يبقى الصندوق معرفة تقريبية أو ناقصة.',
      effect: 'تغيير هذه القيمة يحرّك وجه الصندوق الأدنى على هذا المحور، وبالتالي يغيّر الحجم أو موضعه المكاني الفعلي.'
    };
  }

  if (ownerIsAabbPositions && /^max[XYZ]$/.test(fieldName)) {
    const axis = fieldName.slice(-1);
    return {
      what: `الحد الأعلى للصندوق على المحور ${axis}.`,
      meaning: `يمثل أكبر إحداثي على المحور ${axis} للحجم الذي يصفه ${normalizedOwner}، أي نهاية الصندوق من هذه الجهة.`,
      usage: `اضبطه بحيث يطابق الحد الأعلى الفعلي للمجسم أو المنطقة على المحور ${axis} داخل نفس الفضاء المرجعي لبقية الإحداثيات.`,
      possibleValues: 'قيمة float تمثل الحد الأعلى الصحيح على هذا المحور.',
      invalid: 'إذا كانت هذه القيمة أصغر من الحد الأدنى المقابل أو لا تنتمي لنفس الفضاء المرجعي فسيصبح الصندوق أو تقاطعاته غير صحيحة.',
      inline: `يمثل الحد الأعلى للصندوق على المحور ${axis}`,
      benefit: 'فائدته أنه يغلق حدود الحجم على هذا المحور ويجعل الصندوق قابلاً للاستخدام كتمثيل مكاني فعلي.',
      effect: 'تغيير هذه القيمة يحرّك وجه الصندوق الأعلى على هذا المحور، وبالتالي يغيّر اتساع الحجم أو موضعه.'
    };
  }

  if (ownerIsAccelerationStructureBuildSizesInfo && fieldName === 'accelerationStructureSize') {
    return {
      what: 'الحجم المطلوب لبنية التسارع نفسها بالبايت.',
      meaning: 'يمثل عدد البايتات التي يجب أن تتوافر في الذاكرة التي ستحتوي كائن VkAccelerationStructureKHR الناتج عند البناء أو التحديث.',
      usage: 'اقرأ هذه القيمة بعد دالة حساب الأحجام ثم خصص ذاكرة أو مخزناً يكفي لاستيعاب بنية التسارع نفسها قبل إنشاء الكائن أو ربط ذاكرته.',
      possibleValues: 'قيمة VkDeviceSize تكتبها دالة حساب الأحجام بحسب نوع البنية والهندسة وطريقة البناء.',
      invalid: 'إذا خُصصت ذاكرة أصغر من هذه القيمة فلن تكفي لاستيعاب بنية التسارع، وقد يفشل الإنشاء أو البناء أو تظهر أخطاء تحقق.',
      inline: 'يحدد الحجم بالبايت الذي يجب تخصيصه لبنية التسارع نفسها',
      benefit: 'فائدته أنه يعطي التطبيق الرقم الحقيقي للذاكرة الدائمة التي سيشغلها كائن بنية التسارع، فلا يعتمد على تقدير يدوي.',
      effect: 'تغيير هذه القيمة يعني تغيير حجم الذاكرة المطلوب للكائن نفسه؛ وأي تقليل غير صحيح يجعل السعة غير كافية للبنية الناتجة.'
    };
  }

  if (ownerIsAccelerationStructureBuildSizesInfo && fieldName === 'updateScratchSize') {
    return {
      what: 'الحجم المطلوب لذاكرة scratch عند التحديث.',
      meaning: 'يمثل عدد البايتات التي يجب أن تتوافر في scratch buffer المؤقت عندما تريد تحديث بنية التسارع الموجودة بدلاً من بنائها من الصفر.',
      usage: 'استخدمه لتخصيص أو اختيار scratch buffer يكفي لمسار update تحديداً قبل استدعاء أوامر التحديث.',
      possibleValues: 'قيمة VkDeviceSize تكتبها دالة حساب الأحجام لمسار update.',
      invalid: 'إذا كانت مساحة scratch الفعلية أصغر من هذه القيمة فلن ينجح التحديث أو ستصبح العملية غير متوافقة مع متطلبات الدالة.',
      inline: 'يحدد حجم ذاكرة scratch المطلوبة لمسار تحديث بنية التسارع',
      benefit: 'فائدته أنه يفصل احتياج التحديث المؤقت عن حجم البنية نفسها، فتستطيع تجهيز ذاكرة مرحلية مناسبة لهذا المسار فقط.',
      effect: 'تغيير هذه القيمة يغيّر حجم مساحة العمل المؤقتة اللازمة أثناء update؛ وأي نقص فيها يمنع العملية من التنفيذ الصحيح.'
    };
  }

  if (ownerIsAccelerationStructureBuildSizesInfo && fieldName === 'buildScratchSize') {
    return {
      what: 'الحجم المطلوب لذاكرة scratch عند البناء الأولي.',
      meaning: 'يمثل عدد البايتات التي يجب أن تتوافر في scratch buffer المؤقت عندما تُبنى بنية التسارع لأول مرة.',
      usage: 'اقرأ هذه القيمة قبل مسار build وخصص scratch buffer يكفي للبناء الأولي، لأن هذه المساحة تستخدم كمساحة عمل مؤقتة أثناء توليد البنية.',
      possibleValues: 'قيمة VkDeviceSize تكتبها دالة حساب الأحجام لمسار build.',
      invalid: 'إذا كانت مساحة scratch الفعلية أصغر من هذه القيمة فلن يكتمل البناء أو ستفشل أوامر البناء بسبب عدم كفاية مساحة العمل المؤقتة.',
      inline: 'يحدد حجم ذاكرة scratch المطلوبة لبناء بنية التسارع لأول مرة',
      benefit: 'فائدته أنه يوضح الذاكرة المرحلية المطلوبة أثناء البناء نفسه، وهي تختلف عن الذاكرة الدائمة التي ستحتوي بنية التسارع بعد اكتمالها.',
      effect: 'تغيير هذه القيمة يغيّر سعة scratch buffer المطلوبة أثناء build؛ وأي تقليل غير صحيح يجعل مساحة العمل المؤقتة غير كافية.'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'type' && /VkAccelerationStructureType/.test(normalizedType)) {
    return {
      what: 'نوع بنية التسارع.',
      meaning: 'يحدد هل البنية التي ستتعامل معها هذه البيانات من النوع العلوي أو السفلي، أي ما الدور الذي ستؤديه في مسار ray tracing.',
      usage: 'اختر القيمة التي تطابق الاستخدام الفعلي: بنية سفلى للهندسة الخام أو بنية عليا للـ instances.',
      possibleValues: `قيمة صالحة من ${normalizedType}.`,
      invalid: 'اختيار نوع لا يطابق البيانات الهندسية أو مسار البناء يجعل التفسير اللاحق للبنية غير صحيح.',
      inline: 'يحدد نوع بنية التسارع التي تصفها هذه البنية',
      benefit: 'فائدته أنه يربط بقية الحقول بدور واضح: هل تبني هندسة مباشرة أم تبني هيكلاً يجمع instances.',
      effect: 'تغيير هذا الحقل يبدل نوع بنية التسارع المتوقعة، وبالتالي يغيّر تفسير الهندسة والذاكرة والعمليات المرتبطة بها.'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'geometryCount') {
    return {
      what: 'عدد عناصر الهندسة المرتبطة بالبناء.',
      meaning: 'يحدد كم وصفاً هندسياً ستقرأ Vulkan من pGeometries أو ppGeometries عند بناء بنية التسارع.',
      usage: 'اجعله مطابقاً تماماً لعدد عناصر الهندسة الفعلية التي ستمريرها.',
      possibleValues: 'عدد صحيح موجب يطابق طول المصفوفة المستخدمة.',
      invalid: 'إذا لم يطابق هذا العدد المصفوفة الفعلية فستقرأ Vulkan بيانات ناقصة أو زائدة من أوصاف الهندسة.',
      inline: 'يحدد عدد أوصاف الهندسة التي ستدخل في بناء بنية التسارع'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'pGeometries') {
    return {
      what: 'مؤشر إلى مصفوفة أوصاف هندسية.',
      meaning: 'يشير إلى أوصاف الهندسة الفعلية التي ستبنى منها بنية التسارع، مثل المثلثات أو AABB أو instances.',
      usage: 'مرر هنا عنوان مصفوفة VkAccelerationStructureGeometryKHR عندما تريد تمرير الأوصاف مباشرة.',
      possibleValues: 'عنوان مصفوفة صالحة من أوصاف الهندسة.',
      invalid: 'مصفوفة غير صالحة أو لا يطابق طولها geometryCount تجعل البناء يقرأ بيانات هندسية خاطئة.',
      inline: 'يشير إلى أوصاف الهندسة التي ستُبنى منها بنية التسارع'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'ppGeometries') {
    return {
      what: 'مؤشر إلى مصفوفة مؤشرات لأوصاف هندسية.',
      meaning: 'يمثل شكلاً بديلاً لتمرير أوصاف الهندسة، بحيث يكون كل عنصر مؤشراً إلى بنية هندسة مستقلة.',
      usage: 'استخدمه عندما يكون تنظيم بياناتك قائماً على مؤشرات منفصلة لكل وصف هندسي.',
      possibleValues: 'عنوان مصفوفة مؤشرات صالحة.',
      invalid: 'أي مؤشر غير صالح داخل هذه المصفوفة يجعل قراءة وصف الهندسة المقابل غير صحيحة.',
      inline: 'يشير إلى مؤشرات أوصاف الهندسة إذا مررتها بشكل غير مباشر'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'scratchData') {
    return {
      what: 'عنوان مساحة scratch المؤقتة.',
      meaning: 'يشير إلى مساحة العمل المؤقتة التي ستستخدمها Vulkan أثناء بناء أو تحديث بنية التسارع.',
      usage: 'اربطه بعنوان جهاز أو مضيف صالح يملك السعة المطلوبة لمسار build أو update.',
      possibleValues: 'قيمة صالحة من نوع عنوان مناسب مثل VkDeviceOrHostAddressKHR.',
      invalid: 'إذا كان العنوان غير صالح أو لا يملك السعة المطلوبة فلن تنجح عملية البناء أو التحديث.',
      inline: 'يشير إلى مساحة scratch المؤقتة التي ستُستخدم أثناء البناء أو التحديث'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^srcAccelerationStructure$/.test(fieldName)) {
    return {
      what: 'بنية التسارع المصدر في مسار التحديث.',
      meaning: 'تمثل بنية التسارع الحالية التي ستُستخدم كمصدر عندما تكون العملية update لا build من الصفر.',
      usage: 'ضع هنا البنية المصدر فقط عندما يكون mode هو update أو عندما يتطلب المسار القراءة من بنية موجودة مسبقاً.',
      possibleValues: 'مقبض VkAccelerationStructureKHR صالح يشير إلى المصدر.',
      invalid: 'تمرير مصدر غير صالح أو استخدامه في مسار لا يحتاج update يجعل العملية غير متوافقة.',
      inline: 'يشير إلى بنية التسارع المصدر التي سيُقرأ منها أثناء التحديث'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^dstAccelerationStructure$/.test(fieldName)) {
    return {
      what: 'بنية التسارع الوجهة للعملية.',
      meaning: 'تمثل بنية التسارع التي ستُكتب فيها نتيجة البناء أو التحديث.',
      usage: 'ضع هنا الكائن الذي سيتحول إلى النتيجة النهائية لعملية build أو update.',
      possibleValues: 'مقبض VkAccelerationStructureKHR صالح يشير إلى الوجهة.',
      invalid: 'إذا لم تكن الوجهة صالحة أو مهيأة بالحجم والذاكرة المناسبين فلن تنجح العملية.',
      inline: 'يشير إلى بنية التسارع الوجهة التي ستستقبل نتيجة العملية'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'geometryType') {
    return {
      what: 'نوع الهندسة الداخلة في بنية التسارع.',
      meaning: 'يحدد هل البيانات الموصوفة هنا مثلثات أو AABB أو instances، وبالتالي أي فرع من union geometry سيُقرأ فعلياً.',
      usage: 'اجعله مطابقاً تماماً لنوع البيانات الحقيقية الموجودة داخل الحقل geometry.',
      possibleValues: 'قيمة صالحة من تعداد نوع الهندسة المرتبط.',
      invalid: 'إذا خالف نوع الهندسة البيانات الفعلية داخل geometry فستُفسَّر البيانات على أنها نوع آخر.',
      inline: 'يحدد نوع الهندسة التي تحملها هذه البنية'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'geometry') {
    return {
      what: 'وصف البيانات الهندسية الفعلية.',
      meaning: 'يحمل تفاصيل الهندسة نفسها بالصيغة التي تطابق geometryType، مثل بيانات المثلثات أو AABB أو instances.',
      usage: 'املأ الفرع المناسب من هذا الحقل بحسب نوع الهندسة الذي اخترته.',
      possibleValues: 'بيانات هندسية متوافقة مع geometryType.',
      invalid: 'ملء فرع لا يطابق geometryType يجعل البيانات غير صالحة للبناء.',
      inline: 'يحمل الوصف الفعلي للهندسة التي ستدخل في بنية التسارع'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'buffer') {
    return {
      what: 'المخزن الذي ستوجد فيه بنية التسارع أو بياناتها.',
      meaning: 'يشير إلى VkBuffer الذي ستُخزَّن فيه بنية التسارع أو الذي يرتبط بهذه العملية على مستوى الذاكرة.',
      usage: 'مرر هنا المخزن الذي خصصته مسبقاً ليحتوي بيانات بنية التسارع نفسها.',
      possibleValues: 'مقبض VkBuffer صالح بالحجم والاستخدام المناسبين.',
      invalid: 'مخزن غير صالح أو غير مناسب للاستخدام المطلوب يجعل الإنشاء أو الربط غير صحيح.',
      inline: 'يشير إلى المخزن الذي ستستقر فيه بنية التسارع أو بياناتها'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'size') {
    return {
      what: 'حجم الذاكرة أو البيانات بالبايت.',
      meaning: 'يحدد السعة الفعلية التي يجب أن تؤخذ في الحسبان عند إنشاء بنية التسارع أو ربطها بالمخزن.',
      usage: 'اجعله مساوياً للحجم الذي حسبته مسبقاً من دوال الاستعلام عن الأحجام.',
      possibleValues: 'قيمة VkDeviceSize صحيحة لهذا الكائن.',
      invalid: 'إذا كان الحجم أصغر من المطلوب فلن تكفي الذاكرة لاحتواء بنية التسارع بشكل صحيح.',
      inline: 'يحدد الحجم بالبايت الذي يجب أن يتوافر لهذا الكائن أو المورد'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'offset') {
    return {
      what: 'إزاحة داخل المخزن.',
      meaning: 'تحدد الموضع الذي ستبدأ منه بيانات بنية التسارع داخل VkBuffer المرتبط بها.',
      usage: 'استخدمها عندما لا تبدأ بيانات بنية التسارع من أول المخزن بل من إزاحة محددة داخله.',
      possibleValues: 'قيمة VkDeviceSize صالحة ومحاذاة وفق متطلبات Vulkan.',
      invalid: 'إزاحة خاطئة أو غير محاذاة تجعل موقع البيانات داخل المخزن غير صالح.',
      inline: 'يحدد موضع بداية بيانات بنية التسارع داخل المخزن'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'deviceAddress') {
    return {
      what: 'عنوان الجهاز المرتبط ببنية التسارع أو بياناتها.',
      meaning: 'يمثل عنواناً على مستوى الجهاز تستخدمه بعض المسارات عندما يلزم ربط بنية التسارع أو الوصول إليها بعنوان صريح.',
      usage: 'استعمله فقط عندما يتطلب المسار أو الامتداد عنوان جهاز معلوم مسبقاً.',
      possibleValues: 'قيمة VkDeviceAddress صالحة وفق متطلبات المسار.',
      invalid: 'عنوان جهاز غير صالح أو غير متوافق مع الذاكرة الفعلية يجعل الوصول أو الربط غير صحيح.',
      inline: 'يحمل عنوان الجهاز المستخدم لهذا الكائن أو المورد'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'data' && /VkDeviceOrHostAddress/.test(normalizedType)) {
    return {
      what: 'عنوان البيانات الهندسية الفعلية.',
      meaning: 'يشير إلى الموضع الذي توجد فيه البيانات الخام التي ستُقرأ أثناء بناء بنية التسارع، سواء كانت على الجهاز أو على المضيف بحسب النوع.',
      usage: 'مرر هنا عنوان بداية البيانات الفعلية، مثل AABB أو instances أو غيرها، وفق ما تصفه هذه البنية.',
      possibleValues: 'عنوان صالح من النوع المناسب.',
      invalid: 'عنوان غير صالح أو لا يشير إلى البيانات المتوقعة يجعل القراءة الهندسية غير صحيحة.',
      inline: 'يشير إلى البيانات الخام التي ستُقرأ أثناء بناء بنية التسارع'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^(vertexData|indexData|transformData|compressedData|radiusData|indexBuffer|vertexBuffer|displacementVectorBuffer|displacementBiasAndScaleBuffer)$/.test(fieldName)) {
    return {
      what: 'عنوان بيانات هندسية أو مساعدة.',
      meaning: 'يشير إلى موضع البيانات الفعلية في الذاكرة، مثل الرؤوس أو الفهارس أو التحويلات أو البيانات المضغوطة أو بيانات micromap.',
      usage: 'اجعله يشير إلى بداية البيانات الصحيحة التي ستقرأها Vulkan لهذا الجزء من وصف الهندسة.',
      possibleValues: 'عنوان جهاز أو مضيف صالح بالنوع المناسب.',
      invalid: 'إذا أشار إلى بيانات خاطئة أو بترتيب لا يطابق الحقل المقصود فستقرأ Vulkan محتوى غير صحيح.',
      inline: 'يشير إلى البيانات الفعلية التي ستقرأها Vulkan لهذا الحقل الهندسي'
    };
  }

  if (ownerIsAccelerationStructureFamily && /(Stride|stride)$/.test(fieldName)) {
    return {
      what: 'المسافة بالبايت بين عنصرين متتاليين.',
      meaning: 'تحدد كم بايت يجب أن تتجاوز Vulkan بين عنصر وآخر عند قراءة البيانات المتسلسلة من الذاكرة.',
      usage: 'اضبطها بحيث تطابق حجم العنصر الفعلي أو تباعده الحقيقي داخل المخزن.',
      possibleValues: 'قيمة VkDeviceSize صحيحة لخطوة القراءة.',
      invalid: 'Stride خاطئ يجعل القراءة تقفز بمسافة غير صحيحة فتخلط بين العناصر أو تتجاوز مواضعها الحقيقية.',
      inline: 'يحدد التباعد بالبايت بين عنصرين متتاليين في البيانات'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^(primitiveCount|instanceCount|maxInstances|usageCountsCount|maxVertex|numTriangles|numVertices|maxPrimitiveIndex|maxGeometryIndex|baseTriangle)$/.test(fieldName)) {
    return {
      what: 'عداد يحدد حجم البيانات أو حدودها.',
      meaning: 'يحمل العدد الفعلي للعناصر أو الحد الأعلى الذي ستعتمد عليه Vulkan عند قراءة هذه البيانات أو بنائها.',
      usage: 'اجعله مطابقاً تماماً لعدد العناصر الحقيقية التي تريد أن تؤخذ في الحسبان في هذا المسار.',
      possibleValues: 'عدد صحيح غير سالب يطابق البيانات الفعلية.',
      invalid: 'عدد خاطئ يجعل Vulkan تقرأ بيانات أقل من المطلوب أو تتجاوز نهاية البيانات الحقيقية.',
      inline: 'يحدد العدد الفعلي للعناصر أو الحدود التي ستستخدمها العملية'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^(primitiveOffset|firstVertex|transformOffset)$/.test(fieldName)) {
    return {
      what: 'إزاحة أو فهرس بداية لجزء من البيانات.',
      meaning: 'تحدد من أين تبدأ القراءة أو المعالجة داخل البيانات المرتبطة بهذه الهندسة أو النطاق.',
      usage: 'استخدمها عندما لا تريد البدء من أول البيانات بل من موضع أو فهرس محدد داخلها.',
      possibleValues: 'عدد صحيح صحيح بالنسبة لشكل البيانات المرتبطة.',
      invalid: 'قيمة بداية غير صحيحة تجعل القراءة تبدأ من عنصر أو موضع مختلف عن المقصود.',
      inline: 'يحدد موضع البداية الذي ستبدأ منه العملية داخل البيانات'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'arrayOfPointers') {
    return {
      what: 'علم يحدد شكل بيانات instances.',
      meaning: 'يخبر Vulkan هل البيانات المشار إليها في الحقل data هي مصفوفة instances مباشرة أم مصفوفة مؤشرات إلى instances.',
      usage: 'اضبطه بحسب شكل الذاكرة الفعلي الذي خزنت به بيانات instances.',
      possibleValues: 'VkBool32 يطابق شكل البيانات الحقيقي.',
      invalid: 'إذا لم يطابق شكل البيانات الفعلي فستفسر Vulkan الذاكرة بطريقة خاطئة.',
      inline: 'يحدد هل بيانات instances مصفوفة مباشرة أم مصفوفة مؤشرات'
    };
  }

  if (ownerIsAccelerationStructureFamily && /^accelerationStructure(Reference)?$/.test(fieldName)) {
    return {
      what: 'مرجع إلى بنية تسارع أخرى.',
      meaning: 'يحمل المرجع أو المقبض أو العنوان الذي يربط هذه البيانات ببنية التسارع المقصودة فعلياً.',
      usage: 'ضع هنا مرجع بنية التسارع السفلية أو الهدف الذي ستعمل عليه هذه البنية أو الـ instance.',
      possibleValues: 'مرجع أو مقبض صالح إلى بنية تسارع متوافقة.',
      invalid: 'مرجع غير صالح أو لا يشير إلى بنية التسارع المقصودة يجعل الربط أو البناء غير صحيح.',
      inline: 'يحمل المرجع الذي يربط هذه البيانات ببنية التسارع المقصودة'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'pVersionData') {
    return {
      what: 'مؤشر إلى بيانات إصدار بنية التسارع.',
      meaning: 'يشير إلى بيانات الإصدار أو التوافق التي ستستخدمها الدالة للتحقق من إمكانية التعامل مع بنية التسارع أو مطابقة نسختها.',
      usage: 'مرر هنا عنوان بيانات الإصدار التي حصلت عليها أو تريد التحقق منها.',
      possibleValues: 'مؤشر صالح إلى بيانات الإصدار المتوقعة.',
      invalid: 'إذا لم يشر إلى بيانات إصدار صحيحة فلن يكون فحص التوافق أو الإصدار موثوقاً.',
      inline: 'يشير إلى بيانات الإصدار التي سيُبنى عليها فحص التوافق'
    };
  }

  if (ownerIsAccelerationStructureFamily && fieldName === 'info' && /^VkAccelerationStructureInfoNV$/.test(normalizedType)) {
    return {
      what: 'وصف داخلي لبنية التسارع.',
      meaning: 'يحمل الوصف الهندسي والإنشائي الكامل الذي سيعتمد عليه مسار الإنشاء القديم من NV لبناء بنية التسارع.',
      usage: 'املأه بالهندسة والعدادات والرايات الفعلية ثم مرره ضمن بنية الإنشاء أو الاستعلام المرتبطة به.',
      possibleValues: 'بنية VkAccelerationStructureInfoNV مكتملة وصالحة.',
      invalid: 'إذا كانت هذه البنية الداخلية ناقصة أو غير متوافقة فستفشل العملية التي تعتمد عليها.',
      inline: 'يحمل الوصف الهندسي الكامل الذي ستعتمد عليه العملية'
    };
  }

  if (ownerIsAcquireProfilingLockInfo && fieldName === 'sType') {
    return {
      what: 'حقل نوع البنية من VkStructureType.',
      meaning: 'يحمل قيمة من VkStructureType تحدد أن البيانات الممررة هي بنية VkAcquireProfilingLockInfoKHR الخاصة بطلب قفل التنميط.',
      usage: 'عملياً هذا يخبر vkAcquireProfilingLockKHR أن الحقول التالية تمثل معلمات طلب القفل نفسه، مثل المهلة والرايات، لذلك يجب ضبطه إلى VK_STRUCTURE_TYPE_ACQUIRE_PROFILING_LOCK_INFO_KHR.',
      possibleValues: 'VK_STRUCTURE_TYPE_ACQUIRE_PROFILING_LOCK_INFO_KHR.',
      invalid: 'أي قيمة أخرى تجعل الدالة تفسر البنية على أنها نوع مختلف، فلا تقرأ timeout وflags كمعلمات صحيحة لطلب القفل.',
      inline: 'هي قيمة من VkStructureType تحدد أن هذه البنية تحمل معلمات الحصول على قفل التنميط',
      benefit: 'فائدته هنا أن السائق يتعرف إلى هذه البيانات على أنها طلب للحصول على profiling lock، لا مجرد بنية معلومات عامة.',
      effect: 'ضبطه بالقيمة الصحيحة يجعل Vulkan يقرأ بقية الحقول كمعلمات لقفل التنميط؛ أما تغييره فيبدل معنى البنية كلها.'
    };
  }

  if (ownerIsAcquireProfilingLockInfo && fieldName === 'pNext') {
    return {
      what: 'مؤشر إلى بنية امتدادية إضافية أو nullptr.',
      meaning: 'يتيح توسيع طلب قفل التنميط ببنى إضافية إذا أضاف الامتداد أو السائق معلومات مرتبطة بهذه العملية عبر سلسلة pNext.',
      usage: 'في الاستخدام العادي يترك nullptr، لأن طلب القفل غالباً يكتفي بالحقول الأساسية لهذه البنية.',
      possibleValues: 'nullptr أو عنوان أول بنية امتدادية متوافقة.',
      invalid: 'مؤشر غير صالح أو بنية غير متوافقة يجعل الدالة ترفض الطلب أو تتجاهل السلسلة الإضافية.',
      inline: 'يكون NULL أو مؤشراً إلى بنية توسع طلب الحصول على قفل التنميط',
      benefit: 'فائدته أنه يسمح بتوسيع طلب القفل مستقبلاً من دون تغيير شكل البنية الأساسية.',
      effect: 'إذا أُضيفت بنية امتدادية هنا فإن الدالة ستقرأ معلمات إضافية مرتبطة بعملية الحصول على القفل.'
    };
  }

  if (ownerIsAcquireProfilingLockInfo && fieldName === 'flags') {
    return {
      what: 'حقل أعلام من النوع VkAcquireProfilingLockFlagsKHR.',
      meaning: 'يحمل أي رايات إضافية تضبط كيفية تنفيذ طلب الحصول على قفل التنميط إذا كانت المواصفة أو السائق يعرفان خيارات مرتبطة به.',
      usage: 'في كثير من الحالات يبقى صفراً، لكن وجوده يجعل صيغة الطلب قابلة للتوسعة إذا احتاجت عملية الحصول على القفل خيارات إضافية.',
      possibleValues: '0 أو مزيج صالح من VkAcquireProfilingLockFlagsKHR.',
      invalid: 'تمرير أعلام غير مدعومة أو غير صالحة يجعل الطلب غير متوافق مع ما يتوقعه السائق.',
      inline: 'يحدد الرايات الإضافية التي قد تغير طريقة طلب قفل التنميط',
      benefit: 'فائدته أنه يجمع الخيارات الإضافية الخاصة بطلب القفل في موضع واحد بدل توزيعها على حقول منفصلة.',
      effect: 'تغيير هذه القيمة يغيّر أسلوب تنفيذ طلب القفل إذا كانت هناك رايات مدعومة تؤثر في العملية.'
    };
  }

  if (ownerIsAcquireProfilingLockInfo && fieldName === 'timeout') {
    return {
      what: 'مهلة الانتظار القصوى للحصول على قفل التنميط.',
      meaning: 'يحدد كم من الوقت ستنتظر الدالة قبل أن تعتبر الحصول على profiling lock غير متاح حالياً وتعيد حالة مهلة بدلاً من النجاح.',
      usage: 'اضبطه بحسب سياسة التطبيق: مهلة قصيرة إذا كنت تريد عدم تعطيل التنفيذ، أو مهلة أطول إذا كانت جلسة الأداء لا تبدأ إلا بعد الحصول على القفل.',
      possibleValues: 'قيمة uint64_t تمثل مدة الانتظار المطلوبة وفق ما تتوقعه المواصفة والسائق لهذا الاستدعاء.',
      invalid: 'مهلة غير مناسبة قد تجعل التطبيق يتوقف أطول من اللازم أو يفشل سريعاً في الحصول على القفل رغم إمكانية توفره بعد قليل.',
      inline: 'يحدد مدة الانتظار القصوى للحصول على قفل التنميط قبل إرجاع مهلة',
      benefit: 'فائدته أنه يعطي التطبيق تحكماً واضحاً في الموازنة بين انتظار القفل والاستمرار في التنفيذ من دون قياس أداء.',
      effect: 'زيادة المهلة تجعل الاستدعاء يصبر أكثر قبل إرجاع VK_TIMEOUT، وتقليلها يجعل التطبيق يتخلى عن طلب القفل أسرع.'
    };
  }

  if (ownerIsCopyMicromapInfo && fieldName === 'sType') {
    return {
      what: 'حقل نوع البنية من VkStructureType.',
      meaning: 'يحمل قيمة من VkStructureType لتحديد أن هذه البنية هي VkCopyMicromapInfoEXT تحديداً.',
      usage: 'يجب ضبطه إلى VK_STRUCTURE_TYPE_COPY_MICROMAP_INFO_EXT قبل تمرير البنية إلى الدالة.',
      possibleValues: 'VK_STRUCTURE_TYPE_COPY_MICROMAP_INFO_EXT.',
      invalid: 'أي قيمة أخرى تجعل الدالة تفسر البنية بشكل غير صحيح أو ترفضها Validation Layers.',
      inline: 'هي قيمة من VkStructureType تحدد أن هذه البنية هي VkCopyMicromapInfoEXT'
    };
  }

  if (ownerIsCopyMicromapInfo && fieldName === 'pNext') {
    return {
      what: 'مؤشر إلى بنية امتدادية إضافية أو NULL.',
      meaning: 'يكون NULL أو مؤشراً إلى بنية توسع هذه البنية إذا كان الاستدعاء يحتاج بيانات إضافية عبر سلسلة pNext.',
      usage: 'اتركه nullptr إذا لم تحتج امتداداً إضافياً، أو اربطه بأول بنية امتدادية متوافقة.',
      possibleValues: 'nullptr أو عنوان بنية امتدادية صالحة.',
      invalid: 'تمرير بنية غير متوافقة أو مؤشر غير صالح يسبب أخطاء تحقق أو تجاهل الامتداد.',
      inline: 'يكون NULL أو مؤشراً إلى بنية توسع هذه البنية'
    };
  }

  if (ownerIsCopyInfo && fieldName === 'src' && /^Vk/.test(normalizedType)) {
    return {
      what: `المورد المصدر من النوع ${normalizedType}.`,
      meaning: `يمثل الكائن الذي ستقرأ منه عملية النسخ أو النقل أو الاستنساخ داخل ${normalizedOwner}.`,
      usage: `ضع هنا المصدر الفعلي الذي يحتوي البيانات الأصلية قبل تنفيذ العملية.${ownerIntent ? ` ${ownerIntent}` : ''}`,
      possibleValues: `مقبض صالح من النوع ${normalizedType} يشير إلى المصدر المطلوب.`,
      invalid: 'إذا لم يكن المصدر صالحاً أو لم يكن في الحالة المناسبة للعملية فستفشل العملية أو تظهر أخطاء تحقق.',
      inline: 'يمثل المصدر الذي ستقرأ منه هذه العملية البيانات الأصلية'
    };
  }

  if (ownerIsCopyInfo && fieldName === 'dst' && /^Vk/.test(normalizedType)) {
    return {
      what: `المورد الوجهة من النوع ${normalizedType}.`,
      meaning: `يمثل الكائن الذي ستُكتب فيه نتيجة النسخ أو التحويل أو الاستنساخ داخل ${normalizedOwner}.`,
      usage: `ضع هنا الوجهة التي تريد أن تستقبل الناتج النهائي للعملية.${ownerIntent ? ` ${ownerIntent}` : ''}`,
      possibleValues: `مقبض صالح من النوع ${normalizedType} يشير إلى الوجهة المطلوبة.`,
      invalid: 'إذا كانت الوجهة غير صالحة أو غير مهيأة لاستقبال الناتج فقد تفشل العملية أو يصبح الناتج غير صالح.',
      inline: 'يمثل الوجهة التي ستُكتب فيها نتيجة هذه العملية'
    };
  }

  if (ownerIsCopyMicromapInfo && fieldName === 'src') {
    return {
      what: 'الميكروماب المصدر لعملية النسخ.',
      meaning: 'يمثل الـ micromap المصدر الذي ستؤخذ منه البيانات أو البنية الأصلية عند تنفيذ النسخ.',
      usage: 'ضع هنا مقبض الـ micromap الذي تريد نسخه.',
      possibleValues: 'مقبض VkMicromapEXT صالح يشير إلى المصدر.',
      invalid: 'إذا لم يكن مقبض المصدر صالحاً أو لم يكن الميكروماب قابلاً للاستخدام في هذا المسار فستفشل العملية.',
      inline: 'هو الميكروماب المصدر الذي ستُنسخ منه البيانات'
    };
  }

  if (ownerIsCopyMicromapInfo && fieldName === 'dst') {
    return {
      what: 'الميكروماب الهدف لعملية النسخ.',
      meaning: 'يمثل الـ micromap الوجهة الذي ستُكتب فيه نتيجة النسخ، أي الهدف النهائي للعملية.',
      usage: 'ضع هنا مقبض الـ micromap الذي سيستقبل البيانات المنسوخة.',
      possibleValues: 'مقبض VkMicromapEXT صالح يشير إلى الوجهة.',
      invalid: 'إذا لم تكن الوجهة صالحة أو لم تكن مهيأة لاستقبال النسخة فستفشل العملية أو يصبح الناتج غير صالح.',
      inline: 'هو الميكروماب الهدف الذي ستُكتب فيه نتيجة النسخ'
    };
  }

  if (ownerIsCopyMicromapInfo && fieldName === 'mode') {
    return {
      what: 'حقل يحدد نمط النسخ من VkCopyMicromapModeEXT.',
      meaning: 'يحمل قيمة من VkCopyMicromapModeEXT لتحديد العمليات أو السلوك الإضافي الذي يجب تنفيذه أثناء نسخ الميكروماب.',
      usage: 'اختر منه النمط الذي يحدد كيف ستتم عملية النسخ نفسها بين src و dst.',
      possibleValues: 'قيمة صالحة من VkCopyMicromapModeEXT.',
      invalid: 'اختيار نمط غير مدعوم أو غير مناسب للموردين قد يؤدي إلى فشل الاستدعاء أو إلى ناتج غير صحيح.',
      inline: 'هي قيمة من VkCopyMicromapModeEXT تحدد العمليات الإضافية التي ستنفذ أثناء النسخ'
    };
  }

  if (ownerIsDeviceCreateInfo) {
    if (fieldName === 'sType') {
      return {
        what: 'حقل نوع البنية من VkStructureType.',
        meaning: 'يحدد أن هذه البنية هي VkDeviceCreateInfo، لكي تعرف Vulkan أن البيانات الممررة تصف إنشاء جهاز منطقي.',
        usage: 'يجب ضبطه إلى VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO قبل تمرير البنية إلى vkCreateDevice.',
        possibleValues: 'VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO.',
        invalid: 'أي قيمة أخرى تجعل Vulkan تفسر البنية على أنها نوع مختلف أو ترفضها طبقات التحقق.',
        inline: 'هي قيمة من VkStructureType تحدد أن هذه البنية هي VkDeviceCreateInfo'
      };
    }

    if (fieldName === 'pNext') {
      return {
        what: 'مؤشر إلى سلسلة بنى امتدادية إضافية أو nullptr.',
        meaning: 'يتيح لك توسيع VkDeviceCreateInfo بميزات أحدث أو امتدادات لا تتسع لها البنية الأساسية.',
        usage: 'اتركه nullptr في الاستخدام البسيط، أو اربطه ببنى مثل ميزات الإصدارات الحديثة عندما تحتاجها فعلياً.',
        possibleValues: 'nullptr أو عنوان أول بنية امتدادية متوافقة.',
        invalid: 'تمرير بنى غير متوافقة أو سلسلة غير صحيحة يجعل إنشاء الجهاز يفشل أو يهمل الميزات المطلوبة.',
        inline: 'يربط بنى إضافية توسع إنشاء الجهاز عندما تحتاج ميزات أو امتدادات أحدث'
      };
    }

    if (fieldName === 'flags') {
      return {
        what: 'رايات إضافية لإنشاء الجهاز.',
        meaning: 'تحمل خيارات خاصة بإنشاء VkDevice نفسه إذا احتاجت المواصفة أو الامتداد رايات غير افتراضية.',
        usage: 'في أغلب التطبيقات تبقى صفراً، ولا تضبطها إلا عندما تستخدم راية تعرف أثرها جيداً.',
        possibleValues: '0 أو مزيج مسموح من VkDeviceCreateFlags.',
        invalid: 'راية غير صالحة هنا تجعل إنشاء الجهاز غير متوافق مع المواصفة أو مع التنفيذ الحالي.',
        inline: 'يحمل رايات إضافية تغيّر سلوك إنشاء الجهاز إذا كانت مطلوبة'
      };
    }

    if (fieldName === 'queueCreateInfoCount') {
      return {
        what: 'عدد بنيات VkDeviceQueueCreateInfo الموجودة في pQueueCreateInfos.',
        meaning: 'يحدد كم تعريفاً للطوابير سيقرأه Vulkan عند إنشاء الجهاز المنطقي.',
        usage: 'اجعله مساوياً لعدد عناصر مصفوفة pQueueCreateInfos التي تصف عائلات الطوابير المطلوبة.',
        possibleValues: '0 أو عدد صحيح موجب بحسب عدد تعريفات الطوابير التي ستمريرها.',
        invalid: 'إذا لم يطابق هذا العدد طول المصفوفة الفعلي فستقرأ Vulkan بيانات ناقصة أو زائدة وتفشل عملية الإنشاء.',
        inline: 'يحدد عدد تعريفات الطوابير التي سيقرأها Vulkan عند إنشاء الجهاز'
      };
    }

    if (fieldName === 'pQueueCreateInfos') {
      return {
        what: 'مؤشر إلى مصفوفة من VkDeviceQueueCreateInfo.',
        meaning: 'تحمل التعريف الفعلي لعائلات الطوابير التي تريد أن توجد داخل الجهاز المنطقي، وعدد الطوابير المطلوبة من كل عائلة وأولوياتها.',
        usage: 'مرر هنا مصفوفة تصف عائلات الطوابير التي يحتاجها تطبيقك مثل graphics أو compute أو transfer.',
        possibleValues: 'عنوان مصفوفة صالحة من VkDeviceQueueCreateInfo.',
        invalid: 'إذا كانت التعريفات لا تطابق عائلات الطوابير المدعومة أو كانت المصفوفة غير صالحة فسيفشل إنشاء الجهاز.',
        inline: 'يشير إلى تعريفات الطوابير التي ستنشأ داخل الجهاز المنطقي'
      };
    }

    if (fieldName === 'enabledLayerCount') {
      return {
        what: 'عدد أسماء الطبقات في ppEnabledLayerNames.',
        meaning: 'يحدد عدد طبقات الجهاز التي سيحاول الإنشاء تفعيلها، مع أن هذا المسار أصبح نادراً في Vulkan الحديث.',
        usage: 'غالباً يترك صفراً لأن تفعيل الطبقات يتم عملياً على مستوى VkInstance في الاستخدام الحديث.',
        possibleValues: '0 أو عدد أسماء الطبقات الممررة فعلياً.',
        invalid: 'وضع عدد لا يطابق المصفوفة أو الاعتماد على طبقات غير مدعومة يسبب فشل الإنشاء أو تجاهل الطلب.',
        inline: 'يحدد عدد طبقات الجهاز المطلوبة إذا كنت تمرر أسماءها هنا'
      };
    }

    if (fieldName === 'ppEnabledLayerNames') {
      return {
        what: 'مؤشر إلى مصفوفة أسماء الطبقات المطلوب تفعيلها على الجهاز.',
        meaning: 'يحمل أسماء الطبقات التي تريد ربطها بإنشاء الجهاز، إذا كان هذا المسار مستخدماً في السياق الحالي.',
        usage: 'في الاستخدام الحديث غالباً يترك nullptr لأن الطبقات تفعّل على مستوى VkInstance.',
        possibleValues: 'nullptr أو عنوان مصفوفة أسماء طبقات صالحة.',
        invalid: 'أسماء غير مدعومة أو مصفوفة غير صحيحة تجعل الطلب غير صالح أو غير فعّال.',
        inline: 'يشير إلى أسماء طبقات الجهاز إذا كنت تطلب تفعيلها صراحة'
      };
    }

    if (fieldName === 'enabledExtensionCount') {
      return {
        what: 'عدد امتدادات الجهاز المطلوبة في ppEnabledExtensionNames.',
        meaning: 'يحدد كم امتداداً سيحاول Vulkan تفعيله على الجهاز المنطقي أثناء الإنشاء.',
        usage: 'اجعله مساوياً لعدد أسماء الامتدادات التي يحتاجها تطبيقك فعلياً مثل swapchain.',
        possibleValues: '0 أو عدد صحيح موجب يطابق طول المصفوفة.',
        invalid: 'إذا لم يطابق العدد المصفوفة أو طلبت امتدادات غير مدعومة فسيرجع vkCreateDevice خطأ مثل VK_ERROR_EXTENSION_NOT_PRESENT.',
        inline: 'يحدد عدد امتدادات الجهاز التي سيحاول الإنشاء تفعيلها'
      };
    }

    if (fieldName === 'ppEnabledExtensionNames') {
      return {
        what: 'مؤشر إلى مصفوفة أسماء امتدادات الجهاز المطلوبة.',
        meaning: 'يحمل أسماء الامتدادات التي تريد أن تصبح متاحة فعلياً على VkDevice الناتج.',
        usage: 'مرر هنا أسماء الامتدادات التي يعتمد عليها التطبيق، وتأكد مسبقاً من دعمها على الجهاز الفيزيائي.',
        possibleValues: 'nullptr أو عنوان مصفوفة أسماء امتدادات صالحة.',
        invalid: 'طلب امتداد غير مدعوم أو تمرير مصفوفة غير صحيحة يجعل إنشاء الجهاز يفشل.',
        inline: 'يشير إلى أسماء امتدادات الجهاز التي تريد تفعيلها فعلياً'
      };
    }

    if (fieldName === 'pEnabledFeatures') {
      return {
        what: 'مؤشر إلى VkPhysicalDeviceFeatures يحدد الميزات المطلوبة.',
        meaning: 'يحمل الميزات التي تريد أن تصبح مفعلة فعلياً على الجهاز المنطقي مثل samplerAnisotropy أو geometryShader.',
        usage: 'مرر بنية features بعد أن تتحقق مسبقاً من دعم كل ميزة عبر استعلامات الجهاز الفيزيائي.',
        possibleValues: 'nullptr أو عنوان بنية VkPhysicalDeviceFeatures صالحة.',
        invalid: 'طلب ميزة غير مدعومة يجعل إنشاء الجهاز يفشل أو يؤدي إلى سلوك غير صالح إذا افترضت أنها مفعلة.',
        inline: 'يشير إلى الميزات التي تريد أن تصبح مفعلة على الجهاز المنطقي'
      };
    }
  }

  if (fieldName === 'mode' && enumMeta) {
    return {
      what: `حقل وضع/نمط من النوع ${normalizedType}.`,
      meaning: `${enumMeta.meaning} داخل ${normalizedOwner || 'هذه البنية'} لا يصف مجرد حالة شكلية، بل يعلن الفرع التنفيذي الذي ستبني Vulkan عليه هذه العملية نفسها.`,
      usage: ownerIsCopyInfo
        ? `هذا الحقل هو الذي يحدد أسلوب تنفيذ النسخ بين المصدر والوجهة: هل تُنسخ البنية كما هي، أو بأسلوب آخر تسمح به قيم ${normalizedType}.`
        : `${enumMeta.apiPurpose} اضبطه على القيمة التي تطابق المسار الذي تريد أن تقرأه Vulkan في هذا الموضع.`,
      possibleValues: `قيمة من ${normalizedType} بحسب الأسلوب المطلوب للعملية الحالية.`,
      invalid: 'اختيار وضع لا يناسب المورد أو العملية يغيّر المعنى الفعلي للاستدعاء وقد يؤدي إلى فشل أو إلى سلوك غير مدعوم.',
      inline: ownerIsCopyInfo
        ? 'يحدد أسلوب تنفيذ عملية النسخ نفسها بين المصدر والوجهة'
        : `يحدد النمط العملي الذي ستنفذ به هذه البنية المهمة المرتبطة بها`
    };
  }

  if (ownerIsAttachmentDescription) {
    if (fieldName === 'flags') {
      return {
        what: `رايات إضافية داخل ${normalizedOwner}.`,
        meaning: 'تتحكم في خصائص خاصة بالمرفق نفسه داخل وصف الـ render pass، مثل سلوكيات أو حالات لا يغطيها المسار الافتراضي.',
        usage: 'اتركه صفراً عندما لا تحتاج سلوكاً خاصاً، واستخدم الرايات فقط إذا كنت تعرف أثرها على تعريف المرفق.',
        possibleValues: '0 أو مزيج من VkAttachmentDescriptionFlags المسموح بها لهذا الإصدار من البنية.',
        invalid: 'راية غير صحيحة هنا قد تجعل وصف الـ attachment غير صالح أو تولد أخطاء تحقق.',
        inline: 'يحدد خصائص إضافية للمرفق إذا كان هذا الوصف يحتاج سلوكاً غير افتراضي'
      };
    }

    if (fieldName === 'format' || normalizedType === 'VkFormat') {
      return {
        what: `تنسيق الصورة المرتبطة بهذا المرفق داخل ${normalizedOwner}.`,
        meaning: 'يحدد كيف ستُفسَّر بتات الصورة: هل هي لون مثل RGBA، أم عمق، أم stencil، وبأي دقة أو ترتيب قنوات.',
        usage: 'يجب أن يطابق تنسيق صورة الـ attachment الفعلية التي ستربطها لاحقاً في framebuffer أو dynamic rendering.',
        possibleValues: 'أي قيمة VkFormat صالحة ومناسبة لنوع المرفق الذي ستستخدمه فعلياً.',
        invalid: 'إذا لم يطابق التنسيق الصورة الحقيقية أو الاستخدام المطلوب فسيفشل الإنشاء أو تظهر أخطاء تحقق.',
        inline: 'يحدد تنسيق بيانات المرفق نفسه حتى يطابق الصورة التي ستُستخدم عند الرسم'
      };
    }

    if (fieldName === 'samples' || normalizedType === 'VkSampleCountFlagBits') {
      return {
        what: `عدد العينات الخاصة بالمرفق في ${normalizedOwner}.`,
        meaning: 'يحدد هل هذا الـ attachment يعمل بعينة واحدة لكل بكسل أم مع multisampling مثل 4x أو 8x.',
        usage: 'يجب أن يطابق عدد العينات في صورة المرفق وفي الـ pipeline الذي سيكتب إليه.',
        possibleValues: 'قيمة من VkSampleCountFlagBits مثل VK_SAMPLE_COUNT_1_BIT أو VK_SAMPLE_COUNT_4_BIT.',
        invalid: 'عدم تطابق عدد العينات مع الصورة أو مع بقية المرفقات قد يمنع إنشاء الـ render pass أو يسبب أخطاء تحقق.',
        inline: 'يحدد عدد عينات MSAA لهذا المرفق حتى يطابق الصور والـ pipeline المستخدمة معه'
      };
    }

    if (fieldName === 'loadOp') {
      return {
        what: `سياسة التعامل مع محتوى المرفق عند بداية أول استخدام له في ${normalizedOwner}.`,
        meaning: 'تحدد هل يجب الاحتفاظ بمحتوى الصورة السابق، أو مسحها إلى قيمة واضحة، أو تجاهل محتواها السابق لأنك ستكتب فوقه.',
        usage: 'اختر CLEAR عندما تريد بدء الرسم من قيمة معروفة، وLOAD عندما تحتاج متابعة الرسم فوق محتوى موجود، وDONT_CARE عندما لا يهمك السابق.',
        possibleValues: 'قيمة من VkAttachmentLoadOp مثل VK_ATTACHMENT_LOAD_OP_CLEAR أو LOAD أو DONT_CARE.',
        invalid: 'اختيار غير مناسب هنا قد يضيع محتوى تحتاجه أو يفرض عملاً غير ضروري على العتاد في بداية الممر.',
        inline: 'يحدد كيف يُعامل محتوى المرفق عند بداية الـ render pass: تحميله أو مسحه أو تجاهله'
      };
    }

    if (fieldName === 'storeOp') {
      return {
        what: `سياسة حفظ محتوى المرفق بعد انتهاء آخر استخدام له في ${normalizedOwner}.`,
        meaning: 'تقرر هل يجب إبقاء النتيجة النهائية للمرفق لاستخدام لاحق، أم يمكن التخلص منها بعد اكتمال الممر.',
        usage: 'اختر STORE إذا كانت النتيجة ستُعرض أو ستُقرأ لاحقاً، واختر DONT_CARE إذا كانت قيمة المرفق بعد انتهاء الممر غير مهمة.',
        possibleValues: 'قيمة من VkAttachmentStoreOp مثل VK_ATTACHMENT_STORE_OP_STORE أو DONT_CARE.',
        invalid: 'إذا اخترت تجاهل النتيجة بينما تحتاجها لاحقاً فستفقد بيانات المرفق بعد نهاية الممر.',
        inline: 'يحدد هل تُحفظ نتيجة هذا المرفق بعد انتهاء الممر أم يمكن التخلص منها'
      };
    }

    if (fieldName === 'stencilLoadOp') {
      return {
        what: `سياسة تحميل جزء الـ stencil من المرفق عند بداية الاستخدام في ${normalizedOwner}.`,
        meaning: 'تعمل مثل loadOp لكن على جانب الـ stencil فقط عندما يكون المرفق يحتوي على stencil.',
        usage: 'تفيد عندما يكون stencil مهمّاً من محتوى سابق أو عندما تريد تصفيره بقيمة clear في بداية الممر.',
        possibleValues: 'قيمة من VkAttachmentLoadOp.',
        invalid: 'اختيار خاطئ قد يمحو بيانات stencil تحتاجها أو يحمّل بيانات لا معنى لها.',
        inline: 'يحدد ما يحدث لبيانات الـ stencil عند بداية الممر: تحميل أو مسح أو تجاهل'
      };
    }

    if (fieldName === 'stencilStoreOp') {
      return {
        what: `سياسة حفظ جزء الـ stencil من المرفق بعد انتهاء الاستخدام في ${normalizedOwner}.`,
        meaning: 'تعمل مثل storeOp لكن على بيانات الـ stencil فقط.',
        usage: 'استخدم STORE إذا كانت نتائج stencil ستفيد في خطوة لاحقة، وإلا يمكن تجاهلها لتخفيف الكلفة.',
        possibleValues: 'قيمة من VkAttachmentStoreOp.',
        invalid: 'قد تفقد نتائج stencil التي تحتاجها لاحقاً إذا جعلتها DONT_CARE دون قصد.',
        inline: 'يحدد هل تُحفظ نتائج الـ stencil بعد انتهاء الممر أم يمكن تجاهلها'
      };
    }

    if (fieldName === 'initialLayout') {
      return {
        what: `التخطيط المتوقع للصورة قبل أن يبدأ هذا المرفق استخدامه داخل ${normalizedOwner}.`,
        meaning: 'يخبر Vulkan بالحالة التي ستكون عليها الصورة عند دخول الـ render pass حتى يتمكن من تنفيذ الانتقال المطلوب أو التحقق من صحته.',
        usage: 'اضبطه إلى التخطيط الذي توجد عليه الصورة فعلاً قبل الممر، مثل UNDEFINED عند عدم أهمية المحتوى السابق أو PRESENT_SRC_KHR إذا كانت خارجة من العرض.',
        possibleValues: 'قيمة من VkImageLayout.',
        invalid: 'إذا خالفت هذه القيمة الحالة الفعلية للصورة فقد تنتج أخطاء تحقق أو انتقالات غير صحيحة.',
        inline: 'يحدد تخطيط الصورة قبل بدء الممر حتى يعرف Vulkan من أي حالة سينتقل'
      };
    }

    if (fieldName === 'finalLayout') {
      return {
        what: `التخطيط الذي يجب أن تخرج به الصورة بعد انتهاء استخدام هذا المرفق في ${normalizedOwner}.`,
        meaning: 'يحدد الحالة النهائية المطلوبة للصورة لكي تصبح جاهزة للعرض أو للقراءة أو للاستخدام في خطوة لاحقة.',
        usage: 'استخدم PRESENT_SRC_KHR لصور swapchain قبل العرض، أو تخطيطاً مناسباً للقراءة/العينات إذا كانت الصورة ستُستخدم لاحقاً داخل الـ pipeline.',
        possibleValues: 'قيمة من VkImageLayout.',
        invalid: 'اختيار تخطيط نهائي لا يناسب الخطوة التالية قد يجبرك على انتقال إضافي أو يسبب فشل تحقق عند الاستخدام اللاحق.',
        inline: 'يحدد التخطيط النهائي للصورة بعد الممر حتى تصبح جاهزة للعرض أو للاستخدام التالي'
      };
    }
  }

  if (fieldName === 'format' && normalizedType === 'VkFormat') {
    return {
      what: `حقل تنسيق من النوع ${normalizedType}.`,
      meaning: 'يحدد شكل البيانات الثنائية التي سيقرأها هذا الكائن أو يكتبها، مثل ترتيب القنوات أو نوعها أو كونها لوناً أو عمقاً.',
      usage: 'اختر التنسيق الذي يطابق المورد الفعلي الذي تتعامل معه هذه البنية.',
      possibleValues: 'أي VkFormat صالح للسياق الحالي.',
      invalid: 'اختيار تنسيق لا يطابق المورد الفعلي يؤدي إلى عدم توافق أو أخطاء تحقق.',
      inline: 'يحدد تنسيق البيانات الذي يتعامل معه هذا الحقل'
    };
  }

  if ((fieldName === 'initialLayout' || fieldName === 'finalLayout' || fieldName === 'layout') && normalizedType === 'VkImageLayout') {
    const prefix = fieldName === 'initialLayout'
      ? 'يحدد تخطيط الصورة قبل الاستخدام'
      : fieldName === 'finalLayout'
        ? 'يحدد تخطيط الصورة بعد انتهاء الاستخدام'
        : 'يحدد التخطيط المطلوب للصورة في هذا الموضع';
    return {
      what: `حقل تخطيط صورة من النوع ${normalizedType}.`,
      meaning: 'يحدد الحالة التي يجب أن تكون عليها الصورة بالنسبة لطريقة الوصول الحالية: كملحق لوني، عمقي، كمصدر عرض، أو كصورة للقراءة.',
      usage: 'يجب أن ينسجم مع المرحلة السابقة والمرحلة التالية لاستخدام الصورة، لأن layout في Vulkan جزء من صحة الوصول وليس مجرد وصف شكلي.',
      possibleValues: 'قيمة من VkImageLayout تناسب هذا المسار.',
      invalid: 'layout غير صحيح قد ينتج أخطاء تحقق أو سلوكاً غير صالح عند الوصول إلى الصورة.',
      inline: prefix
    };
  }

  if (enumMeta && enumMeta.apiPurpose) {
    return {
      what: `حقل من النوع ${normalizedType}.`,
      meaning: enumMeta.meaning,
      usage: `${enumMeta.apiPurpose} ${detail ? `في هذا الموضع يرتبط بالحقل ${fieldName} داخل ${normalizedOwner || 'البنية الحالية'}.` : ''}`.trim(),
      possibleValues: `قيمة من ${normalizedType} بحسب السلوك المطلوب لهذا الحقل.`,
      invalid: 'اختيار قيمة غير مناسبة قد يغير سلوك البنية أو يجعل الاستدعاء غير صالح منطقياً.',
      inline: `يحمل قيمة من ${normalizedType} تعلن الفرع التنفيذي الذي ستقرأه Vulkan من هذا الحقل`
    };
  }

  return null;
}

function renderDetailedExampleExplanation(item, options = {}) {
  const example = options.example || item.example || '';
  if (!example) {
    return '';
  }

  const inferredLanguage = (() => {
    if (options.language) {
      return String(options.language).toLowerCase();
    }

    if (item?.sectionKey && glslReferenceSections[item.sectionKey]) {
      return 'glsl';
    }

    const sample = String(example || '');
    if (
      /^\s*#version\b/m.test(sample)
      || /\blayout\s*\(/.test(sample)
      || /\b(uniform|buffer|sampler\w+|vec[234]|mat[234]|gl_[A-Za-z0-9_]+)\b/.test(sample)
    ) {
      return 'glsl';
    }

    return 'cpp';
  })();
  const analysis = buildExampleAnalysis(example, item);
  const kindLabel = options.kindLabel || 'العنصر';
  const purpose = options.purpose || item.description || `يوضح هذا المثال طريقة استخدام ${item.name}.`;
  const purposeParagraphs = mergeUniqueTeachingItems(options.purposeParagraphs || [purpose]);
  const requirements = mergeUniqueTeachingItems(options.requirements || []);
  const learningItems = mergeUniqueTeachingItems(options.learningItems || []);
  const usageItems = options.usageItems || (() => {
    if (/^vk[A-Za-z0-9_]+$/.test(String(item?.name || ''))) {
      return [
        inferFunctionIntentSummary(item),
        inferFunctionBenefitSummary(item),
        ...getFunctionSemanticUsageItems(item).filter((text) => {
          const normalized = cleanFunctionUsageSummary(text);
          return normalized
            && !isOperationalFunctionParagraph(normalized)
            && normalized !== inferFunctionIntentSummary(item)
            && normalized !== inferFunctionBenefitSummary(item);
        })
      ].filter(Boolean).slice(0, 3);
    }

    return getUsageItems(item).slice(0, 3);
  })();
  const concepts = mergeUniqueTeachingItems(options.concepts || []);
  const notes = mergeUniqueTeachingItems(options.notes || item.notes || []);
  const flowSteps = mergeUniqueTeachingItems(options.flowSteps || buildExecutionFlowFromVariables(analysis.variables, item.name || kindLabel));
  const lineExplanationRows = Array.isArray(options.lineExplanationRows) ? options.lineExplanationRows : [];
  const localSymbolMap = options.localSymbolMap || null;
  const undocumentedSymbols = Array.isArray(options.undocumentedSymbols) ? options.undocumentedSymbols : [];
  const referenceNames = mergeUniqueTeachingItems(
    options.referenceNames || [],
    analysis.references.map(([name]) => name)
  );
  const referenceEntries = buildOrderedReferenceSummaryLinks(referenceNames, {
    currentItem: item
  });
  const compactLineRows = analysis.lineRows
    .map((row) => ({...row, functions: buildCompactFunctionRowsFromLine(row.line, item)}))
    .filter((row) => row.functions.length > 0);
  const sectionTitles = {
    header: '🧩 شرح تفصيلي للمثال',
    generalGoal: 'الهدف العام من الكود',
    requirements: 'المتطلبات',
    learning: 'المكسب',
    commentIssues: 'ملاحظات على التعليقات الحالية',
    commentIssueElements: 'توثيق الدوال والبنى المرتبطة بالسطر',
    lineByLine: 'شرح السطور المهمة',
    functions: 'الدوال المستخدمة',
    constants: 'الثوابت المستخدمة في هذا الدرس',
    variables: 'القسم 6: شرح المتغيرات والأنواع والحقول',
    rewrittenCode: 'القسم 7: الكود المصحح',
    usageBridge: 'كيف يربط المثال بالاستخدام الحقيقي',
    flow: 'مخطط التنفيذ المبسط',
    concepts: 'مفاهيم مرتبطة',
    notes: 'ملاحظات مهمة',
    references: 'القسم 8: قائمة روابط مرجعية مجمعة لكل العناصر المذكورة',
    undocumented: 'العناصر المحلية المساعدة في المثال',
    ...(options.sectionTitles || {})
  };
  const visibleSections = {
    requirements: requirements.length > 0,
    learning: learningItems.length > 0,
    commentIssues: true,
    lineByLine: true,
    functions: true,
    constants: true,
    variables: true,
    rewrittenCode: true,
    usageBridge: true,
    flow: true,
    concepts: true,
    notes: true,
    references: true,
    undocumented: undocumentedSymbols.length > 0,
    ...(options.visibleSections || {})
  };

  const anchorBase = String(
    options.anchorPrefix
    || item?.id
    || item?.name
    || kindLabel
    || 'example'
  ).trim();
  const buildSectionAnchor = (key) => makeAnchorId('example-section', `${anchorBase}-${key}`);
  const headerKicker = String(options.headerKicker || 'شرح منظم').trim();
  const wrapExampleInsightTable = (tableHtml = '', shellClass = '') => {
    const raw = String(tableHtml || '').trim();
    if (!raw) {
      return '';
    }

    const shellClasses = ['params-table-shell', 'example-explanation-table-shell', shellClass]
      .filter(Boolean)
      .join(' ');
    return `<div class="${escapeAttribute(shellClasses)}">${raw}</div>`;
  };
  const buildExampleInsightRichField = (label = '', value = '') => {
    const raw = String(value || '').trim();
    if (!raw) {
      return '';
    }

    const cleanLabel = String(label || '').trim();
    return `
      <div class="example-explanation-rich-field">
        ${cleanLabel ? `<div class="example-explanation-rich-field-label">${escapeHtml(cleanLabel)}</div>` : ''}
        <div class="example-explanation-rich-field-value">${raw}</div>
      </div>
    `;
  };
  const buildExampleInsightRichCard = ({title = '', titleHtml = '', body = '', fields = [], className = '', id = ''} = {}) => {
    const resolvedBody = String(body || '').trim() || fields
      .map((entry) => String(entry || '').trim())
      .filter(Boolean)
      .join('');
    if (!resolvedBody) {
      return '';
    }

    const cardClasses = ['reference-summary-group', 'example-explanation-rich-card', className]
      .filter(Boolean)
      .join(' ');
    const cleanId = String(id || '').trim();
    return `
      <section class="${escapeAttribute(cardClasses)}"${cleanId ? ` id="${escapeAttribute(cleanId)}"` : ''}>
        <h4>${titleHtml || escapeHtml(title)}</h4>
        <div class="example-explanation-rich-body">${resolvedBody}</div>
      </section>
    `;
  };
  const wrapExampleInsightRichCards = (cards = [], className = '') => {
    const resolvedCards = cards
      .map((entry) => String(entry || '').trim())
      .filter(Boolean);
    if (!resolvedCards.length) {
      return '';
    }

    const classes = ['reference-summary-groups', 'example-explanation-rich-groups', className]
      .filter(Boolean)
      .join(' ');
    return `<div class="${escapeAttribute(classes)}">${resolvedCards.join('')}</div>`;
  };

  const generalGoalHtml = purposeParagraphs.map((entry) => `<p>${renderPracticalText(entry, purpose, {currentItem: item})}</p>`).join('');
  const requirementsHtml = visibleSections.requirements ? `
    <ul class="best-practices-list">
      ${requirements.map((entry) => `<li>${renderPracticalText(entry, 'هذا المتطلب ضروري لتشغيل المثال أو لفهمه بشكل صحيح.', {currentItem: item})}</li>`).join('')}
    </ul>
  ` : '';
  const learningHtml = visibleSections.learning ? `
    <ul class="best-practices-list">
      ${learningItems.map((entry) => `<li>${renderPracticalText(entry, 'يبين هذا البند ما الذي سيتعلمه القارئ بعد تنفيذ المثال.', {currentItem: item})}</li>`).join('')}
    </ul>
  ` : '';
  const renderCommentIssueNarrative = (text, fallback) => renderPracticalText(
    preferStrictArabicVulkanText(text, fallback),
    fallback,
    {currentItem: item, tooltipContext: 'comment-issue'}
  );
  const renderCommentIssueLine = (line) => `
    <code class="language-${inferredLanguage}">${renderHighlightedCode(line || '', {
      language: inferredLanguage,
      annotate: true,
      glslTooltipMode: inferredLanguage === 'glsl' ? 'corrected' : '',
      localSymbolMap
    })}</code>
  `;
  const commentIssueRelatedRows = (() => {
    const seen = new Set();
    return analysis.commentIssues
      .flatMap((issue) => Array.isArray(issue.relatedElements) ? issue.relatedElements : [])
      .filter((entry) => {
        const key = `${entry.kind}:${entry.name}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  })();
  const renderAnalysisRelatedList = (entries, emptyText = 'لا توجد عناصر مرتبطة موثقة لهذا الجزء بعد.', options = {}) => {
    const uniqueEntries = [...new Set((entries || []).filter(Boolean))];
    if (!uniqueEntries.length) {
      return `<span class="inline-code-reference-static analysis-related-empty">${escapeHtml(emptyText)}</span>`;
    }
    const layoutClassName = options?.layout === 'inline'
      ? 'analysis-related-list analysis-related-list-inline'
      : 'analysis-related-list';
    return `
      <ul class="${layoutClassName}">
        ${uniqueEntries.map((entry) => `<li>${entry}</li>`).join('')}
      </ul>
    `;
  };
  const renderFunctionParameterSummaryHtml = (functionItem) => {
    const parameters = functionItem?.parameters || [];
    if (!parameters.length) {
      return '<span class="inline-code-reference-static analysis-related-empty">لا تحتوي هذه الدالة على بارامترات موثقة محليًا.</span>';
    }

    return renderAnalysisRelatedList(parameters.map((param) => {
      const typeName = normalizeLookupName(param.type || '');
      const typeHtml = typeName
        ? renderAnalysisReference(typeName, item)
        : (param.type ? renderTypeReference(param.type) : '<code>غير موثق</code>');
      const expectedValues = renderValueShapeSummary(param.name || '', param.type || '', {functionName: functionItem?.name || item.name || ''});
      return `
        <div class="analysis-related-rich-line">
          <strong>${renderFunctionParameterName(param, functionItem || item)}</strong>
          <span class="analysis-related-separator">:</span>
          ${typeHtml}
          <br>
          <small>${renderPracticalText(
            `${inferParameterMeaning(param, functionItem || item)} ${inferParameterUsage(param, functionItem || item)} القيم المتوقعة: ${expectedValues}.`,
            'يوضح هذا البند معنى البارامتر والقيم التي ينتظرها قبل الاستدعاء.',
            {currentItem: item}
          )}</small>
        </div>
      `;
    }), 'لا تحتوي هذه الدالة على بارامترات موثقة محليًا.');
  };
  const renderFunctionReturnSummaryHtml = (functionItem) => {
    const returnType = inferCommandReturnType(functionItem || {});
    const returnValues = getReturnValuesArray(functionItem).slice(0, 4);

    if (!returnType || returnType === 'void') {
      return renderPracticalText(
        'لا تعيد هذه الدالة قيمة مباشرة، بل تغيّر حالة التنفيذ أو تكتب الناتج عبر البارامترات المؤشرية التي يمررها التطبيق.',
        'لا تعيد هذه الدالة قيمة مباشرة.',
        {currentItem: item}
      );
    }

    const returnTypeHtml = renderAnalysisReference(returnType, item);
    const meaning = returnType === 'VkResult'
      ? `تعيد ${returnTypeHtml} لتحديد نجاح الاستدعاء أو نوع الخطأ الذي يجب التعامل معه قبل متابعة التنفيذ.`
      : `تعيد قيمة من النوع ${returnTypeHtml} تمثل ناتج العملية التي نفذتها الدالة في هذا الموضع.`;

    if (!returnValues.length) {
      return renderPracticalText(meaning, 'يوضح هذا الحقل معنى القيمة المرجعة ونوعها.', {currentItem: item});
    }

    return `
      <div class="analysis-related-rich-block">
        <p>${renderPracticalText(meaning, 'يوضح هذا الحقل معنى القيمة المرجعة ونوعها.', {currentItem: item})}</p>
        ${renderAnalysisRelatedList(returnValues.map((entry) => `
          <div class="analysis-related-rich-line">
            <strong>${renderAnalysisReference(entry.value, item)}</strong>
            <br>
            <small>${renderPracticalText(entry.description || 'راجع التوثيق التفصيلي لهذه القيمة المرجعة.', 'يوضح هذا السطر معنى إحدى القيم المرجعة المحتملة.', {currentItem: item})}</small>
          </div>
        `), 'لا توجد قيم مرجعة موثقة إضافية لهذا الاستدعاء.')}
      </div>
    `;
  };
  const renderFunctionRelatedElementsHtml = (functionItem) => {
    const relatedEntries = [];
    const seen = new Set();
    const pushRelated = (html) => {
      const key = String(html || '').trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      relatedEntries.push(html);
    };

    (functionItem?.parameters || []).forEach((param) => {
      const typeName = normalizeLookupName(param.type || '');
      if (typeName) {
        pushRelated(renderAnalysisReference(typeName, item));
      }
    });

    const returnType = inferCommandReturnType(functionItem || {});
    if (returnType && returnType !== 'void') {
      pushRelated(renderAnalysisReference(returnType, item));
    }

    getRelatedFunctionNames(functionItem, 4).forEach((name) => pushRelated(renderAnalysisReference(name, item)));
    return renderAnalysisRelatedList(relatedEntries, 'لا توجد عناصر مرتبطة إضافية موثقة لهذه الدالة.', {layout: 'inline'});
  };
  const variableSectionRows = (() => {
    const rows = [];
    const seen = new Set();
    const pushRow = (key, row) => {
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      rows.push(row);
    };

    analysis.variables.forEach((variable) => {
      const typeName = normalizeLookupName(variable.type);
      const typeItem = typeName ? findTypeItemByName(typeName) : null;
      const relatedLinks = [];
      if (typeName) {
        relatedLinks.push(renderAnalysisReference(typeName, item));
      }
      getRelatedFunctionNames(typeItem, 4).forEach((name) => relatedLinks.push(renderAnalysisReference(name, item)));
      pushRow(`var:${variable.name}`, {
        id: makeAnchorId('analysis-var', variable.name),
        element: renderVariableReference(variable.name, buildAnalysisVariableTooltip(variable, item)),
        type: typeName ? renderAnalysisReference(typeName, item) : '<code>غير موثق</code>',
        value: renderVulkanHighlightedInlineCode(variable.value),
        meaning: renderPracticalText(explainVariableRole(variable, item), 'يوضح هذا الحقل الدور الحقيقي للمتغير داخل المثال.', {currentItem: item}),
        related: renderAnalysisRelatedList(relatedLinks, 'لا توجد عناصر مرتبطة إضافية موثقة لهذا المتغير.')
      });
    });

    analysis.tokenGroups.fields.forEach((field) => {
      const metadata = getFieldMetadata(field.name, field.ownerType, field.value, field.fieldType || '');
      const relatedLinks = [
        renderVariableReference(field.owner),
        field.ownerType ? renderAnalysisReference(field.ownerType, item) : ''
      ];
      pushRow(`field:${field.owner}.${field.name}`, {
        id: makeAnchorId('analysis-field', `${field.ownerType || item.name}-${field.name}`),
        element: renderAnalysisReference(field.name, item, {
          label: field.name,
          anchorId: makeAnchorId('analysis-field', `${field.ownerType || item.name}-${field.name}`),
          tooltip: buildFieldTooltip(field.name, field.ownerType, field.fieldType || '', field.value)
        }),
        type: field.fieldType ? renderAnalysisReference(normalizeLookupName(field.fieldType), item) : '<code>حقل داخل بنية</code>',
        value: field.value === '0' ? '<code>0</code>' : renderVulkanHighlightedInlineCode(field.value),
        meaning: renderPracticalText(`${metadata.meaning} ${metadata.usage}`, 'يوضح هذا الحقل المعنى الحقيقي لقيمة الحقل داخل البنية.', {currentItem: item}),
        related: renderAnalysisRelatedList(relatedLinks, 'لا توجد عناصر مرتبطة إضافية موثقة لهذا الحقل.')
      });
    });

    analysis.tokenGroups.types.forEach(({name}) => {
      const typeName = normalizeLookupName(name);
      if (!typeName || analysis.variables.some((variable) => normalizeLookupName(variable.type) === typeName)) {
        return;
      }
      const typeItem = findTypeItemByName(typeName);
      const enumMeta = findItemInCategories(vulkanData.enums, typeName) ? getEnumMetadata(typeName) : null;
      const relatedLinks = getRelatedFunctionNames(typeItem, 4).map((entry) => renderAnalysisReference(entry, item));
      pushRow(`type:${typeName}`, {
        id: makeAnchorId('analysis-type', typeName),
        element: renderAnalysisReference(typeName, item, {anchorId: makeAnchorId('analysis-type', typeName)}),
        type: enumMeta ? '<code>نوع تعداد</code>' : '<code>نوع مرجعي</code>',
        value: '<code>يظهر كتوقيع نوع أو مرجع في المثال</code>',
        meaning: renderPracticalText(enumMeta?.meaning || typeItem?.description || `يحدد النوع ${typeName} شكل البيانات أو المورد الذي يمر عبر السطر أو البنية المرتبطة به.`, 'يوضح هذا الحقل معنى النوع داخل المثال.', {currentItem: item}),
        related: renderAnalysisRelatedList(relatedLinks, 'لا توجد دوال مرتبطة موثقة لهذا النوع داخل البيانات الحالية.')
      });
    });

    return rows;
  })();
  const referencesHtml = (() => {
    const groupMap = new Map();
    const pushEntry = (label, html) => {
      if (!html) {
        return;
      }
      if (!groupMap.has(label)) {
        groupMap.set(label, []);
      }
      const list = groupMap.get(label);
      if (!list.includes(html)) {
        list.push(html);
      }
    };

    analysis.tokenGroups.functions.forEach(({name}) => pushEntry('الدوال', renderAnalysisReference(name, item)));
    analysis.tokenGroups.types.forEach(({name}) => {
      const typeName = normalizeLookupName(name);
      if (findItemInCategories(vulkanData.structures, typeName)) {
        pushEntry('البنى', renderAnalysisReference(typeName, item));
      } else if (findVariableTypeItemByName(typeName) || /^[A-Za-z_][A-Za-z0-9_:]*$/.test(typeName)) {
        pushEntry('الأنواع', renderAnalysisReference(typeName, item));
      }
    });
    analysis.tokenGroups.constants.forEach(({name, item: constantItem}) => {
      const enumMeta = getEnumValueMetadata(name, {functionName: item.name || ''});
      pushEntry('الثوابت', renderAnalysisReference(name, item, {tooltip: buildLessonConstantTooltip(name, constantItem, enumMeta, item)}));
    });
    analysis.variables.forEach((variable) => pushEntry('المتغيرات', renderVariableReference(variable.name, buildAnalysisVariableTooltip(variable, item))));
    undocumentedSymbols.forEach((symbol) => pushEntry('العناصر المحلية', renderLocalExampleSymbolLink(symbol.name, symbol)));

    const preferredOrder = ['الدوال', 'البنى', 'الثوابت', 'الأنواع', 'المتغيرات', 'العناصر المحلية'];
    const groups = preferredOrder
      .filter((label) => groupMap.has(label) && groupMap.get(label).length > 0)
      .map((label) => `
        <section class="content-card prose-card reference-summary-group reference-summary-group-${makeAnchorId('group', label)}" data-reference-group="${escapeAttribute(label)}">
          <h4>${label}</h4>
          <ul class="reference-list reference-summary-list reference-summary-list-vertical">
            ${groupMap.get(label).map((entry) => `<li class="reference-list-item">${entry}</li>`).join('')}
          </ul>
        </section>
      `);

    return groups.length
      ? `<div class="reference-summary-groups">${groups.join('')}</div>`
      : '<p>لا توجد عناصر مرجعية إضافية داخل هذا المثال.</p>';
  })();
  const commentIssuesHtml = visibleSections.commentIssues ? (
    analysis.commentIssues.length > 0 ? `
      ${wrapExampleInsightRichCards(
        analysis.commentIssues.map((issue, index) => buildExampleInsightRichCard({
          title: `السطر ${index + 1}`,
          className: 'example-explanation-comment-issue-card',
          body: `
            <div class="analysis-line-code">${renderCommentIssueLine(issue.line)}</div>
            ${buildExampleInsightRichField('التعليق الأصلي', renderCommentIssueNarrative(issue.previous, 'هذا هو التعليق السابق قبل إعادة صياغته بشكل أوضح.'))}
            ${buildExampleInsightRichField('سبب القصور', renderCommentIssueNarrative(issue.reason, 'هذا الحقل يوضح سبب قصور التعليق السابق عن شرح السطر برمجياً.'))}
            ${buildExampleInsightRichField('ما الذي أهمله', renderCommentIssueNarrative(issue.missing, 'هذا الحقل يوضح العناصر أو العلاقات التي كان يجب أن يذكرها التعليق المصحح.'))}
          `
        })).concat(
          commentIssueRelatedRows.map((entry) => buildExampleInsightRichCard({
            titleHtml: renderAnalysisReference(entry.name, item),
            className: 'example-explanation-comment-related-card',
            fields: [
              buildExampleInsightRichField('النوع', escapeHtml(entry.kindLabel)),
              buildExampleInsightRichField('المعنى الحقيقي', renderPracticalText(entry.meaning, 'يوضح هذا الحقل المعنى الحقيقي للعنصر البرمجي داخل السطر الحالي.', {currentItem: item})),
              buildExampleInsightRichField('سبب الاستخدام', renderPracticalText(entry.usage, 'يوضح هذا الحقل سبب ظهور العنصر في هذا السطر تحديداً.', {currentItem: item}))
            ]
          }))
        ),
        'example-explanation-comment-groups'
      )}
    ` : '<p>لا توجد في هذا المثال تعليقات مولدة عامة من النمط الذي كان يسبب الالتباس سابقاً.</p>'
  ) : '';
  const lineByLineHtml = visibleSections.lineByLine ? (
    lineExplanationRows.length > 0 ? wrapExampleInsightRichCards(
      lineExplanationRows.map((row, index) => buildExampleInsightRichCard({
        title: `السطر ${index + 1}`,
        className: 'example-explanation-line-card',
        body: `
          <div class="analysis-line-code"><code class="language-${inferredLanguage}">${renderHighlightedCode(row.line || '', {
            language: inferredLanguage,
            annotate: true,
            glslTooltipMode: inferredLanguage === 'glsl' ? 'corrected' : '',
            localSymbolMap
          })}</code></div>
          ${buildExampleInsightRichField('ماذا يفعل', renderPracticalText(row.what, 'هذا السطر ينفذ خطوة مباشرة من خطوات المثال الحالية.', {currentItem: item}))}
          ${buildExampleInsightRichField('لماذا استُخدم', renderPracticalText(row.why, 'وضع هذا السطر هنا لأن المرحلة التالية تعتمد على أثره أو على الحالة التي يجهزها.', {currentItem: item}))}
          ${buildExampleInsightRichField('ما الذي سيحدث إذا لم يُستخدم', renderPracticalText(row.without, 'غياب هذا السطر سيترك فجوة عملية في المسار الجاري تنفيذه.', {currentItem: item}))}
        `
      })),
      'example-explanation-line-groups'
    ) : compactLineRows.length > 0 ? wrapExampleInsightRichCards(
      compactLineRows.map((row, index) => buildExampleInsightRichCard({
        title: `السطر ${index + 1}`,
        className: 'example-explanation-line-card',
        body: `
          <div class="analysis-line-code">
            <code class="language-${inferredLanguage}" data-raw-code="${escapeAttribute(row.line)}">${escapeHtml(row.line)}</code>
          </div>
          <div class="analysis-function-list">
            ${row.functions.map((entry) => `
              <div class="analysis-function-card">
                <div class="analysis-function-name">${renderRelatedReferenceLink(entry.name)}</div>
                ${buildExampleInsightRichField('المعنى', renderPracticalText(entry.meaning, 'هذه الدالة تمثل العملية التنفيذية الأساسية في هذا السطر.'))}
                ${buildExampleInsightRichField('الفائدة', renderPracticalText(entry.benefit, 'فائدة هذه الدالة هنا أنها تنقل التنفيذ إلى الخطوة التالية المطلوبة في المسار الحالي.'))}
                ${buildExampleInsightRichField('التأثير', renderPracticalText(entry.effect, 'استدعاء هذه الدالة يغيّر حالة التنفيذ أو الموارد وفق ما يتطلبه هذا السطر.'))}
              </div>
            `).join('')}
          </div>
        `
      })),
      'example-explanation-line-groups'
    ) : '<p>لا توجد في المثال الحالي أسطر استدعاء دوال تحتاج إلى شرح مستقل.</p>'
  ) : '';
  const functionsHtml = visibleSections.functions ? (
    analysis.tokenGroups.functions.length > 0 ? wrapExampleInsightRichCards(
      analysis.tokenGroups.functions.map(({name, item: functionItem}) => buildExampleInsightRichCard({
        titleHtml: renderAnalysisReference(name, item),
        className: 'example-explanation-function-card',
        fields: [
          buildExampleInsightRichField('المعنى الحقيقي', renderPracticalText(
            inferFunctionIntentSummary(functionItem || {name, description: functionItem?.description || ''}),
            `يوضح هذا الحقل العملية الحقيقية التي تنفذها الدالة ${name} داخل مسار Vulkan.`,
            {currentItem: item}
          )),
          buildExampleInsightRichField('البارامترات', renderFunctionParameterSummaryHtml(functionItem || {name, parameters: []})),
          buildExampleInsightRichField('القيمة المرجعة', renderFunctionReturnSummaryHtml(functionItem || {name, returnType: ''})),
          buildExampleInsightRichField('العناصر المرتبطة', renderFunctionRelatedElementsHtml(functionItem || {name, parameters: []}))
        ]
      })),
      'example-explanation-function-groups'
    ) : '<p>لا توجد دوال ظاهرة في هذا المثال أو لم يتم التعرف عليها من البيانات الحالية.</p>'
  ) : '';
  const constantsHtml = visibleSections.constants ? (
    analysis.tokenGroups.constants.length > 0 ? wrapExampleInsightRichCards(
      analysis.tokenGroups.constants.map(({name, item: constantItem}) => {
        const enumMeta = getEnumValueMetadata(name, {functionName: item.name || ''});
        const kindLabel = inferLessonConstantKindLabel(name, constantItem, enumMeta);
        const tooltip = buildLessonConstantTooltip(name, constantItem, enumMeta, item);
        return buildExampleInsightRichCard({
          titleHtml: renderAnalysisReference(name, item, {tooltip}),
          className: 'example-explanation-constant-card',
          fields: [
            buildExampleInsightRichField('النوع', renderPracticalText(kindLabel, 'يوضح هذا الحقل نوع الثابت الرسمي داخل Vulkan.', {currentItem: item})),
            buildExampleInsightRichField('القيمة العددية أو الناتج', `<code>${escapeHtml(enumMeta?.numericValue || constantItem?.value || constantItem?.syntax || 'راجع الصفحة المرجعية')}</code>`),
            buildExampleInsightRichField('المعنى الحقيقي', renderPracticalText(enumMeta?.valueMeaning || constantItem?.description || describeValueMeaning(name), 'يوضح هذا الحقل المعنى الحقيقي للثابت داخل السياق الرسومي الحالي.', {currentItem: item})),
            buildExampleInsightRichField('سبب استخدامه هنا', renderPracticalText(enumMeta?.chosenBecause || 'استُخدم لأن السطر يحتاج القيمة الرسمية نفسها بدل رقم أو نص حرفي.', 'اختير هنا لأن الكود يحتاج الرمز الرسمي نفسه لضبط السلوك أو المقارنة أو التهيئة.'))
          ]
        });
      }),
      'example-explanation-constant-groups'
    ) : '<p>لا توجد ماكروز أو ثوابت ظاهرة بوضوح في هذا المثال.</p>'
  ) : '';
  const variablesHtml = visibleSections.variables ? `
    ${variableSectionRows.length > 0 ? `
    ${wrapExampleInsightRichCards(
      variableSectionRows.map((row) => buildExampleInsightRichCard({
        titleHtml: row.element,
        className: 'example-explanation-variable-card',
        id: row.id,
        fields: [
          buildExampleInsightRichField('النوع', row.type),
          buildExampleInsightRichField('القيمة في المثال', row.value),
          buildExampleInsightRichField('المعنى الحقيقي', row.meaning),
          buildExampleInsightRichField('العناصر المرتبطة', row.related)
        ]
      })),
      'example-explanation-variable-groups'
    )}
    ` : '<p>لا توجد متغيرات أو حقول أو أنواع موثقة محليًا داخل هذا المثال بعد.</p>'}
  ` : '';
  const rewrittenCodeHtml = visibleSections.rewrittenCode ? renderDocCodeContainer({
    titleHtml: `${renderEntityIcon('command', 'ui-codicon list-icon', kindLabel)} الكود المصحح`,
    rawCode: analysis.rewrittenCode,
    renderedCodeHtml: renderHighlightedCode(analysis.rewrittenCode, {
      language: inferredLanguage,
      annotate: true,
      glslTooltipMode: inferredLanguage === 'glsl' ? 'corrected' : '',
      localSymbolMap
    }),
    language: inferredLanguage,
    containerClassName: 'example-section tutorial-example-section',
    preClassName: 'vulkan-ready-example-pre',
    codeClassName: 'vulkan-signature-code',
    allowCopy: true,
    allowToggle: true,
    skipHighlight: true
  }) : '';
  const usageBridgeHtml = visibleSections.usageBridge && usageItems.length > 0 ? renderUsageBridgeSection(usageItems) : '';
  const flowHtml = visibleSections.flow ? `
    <ol class="flow-list">
      ${flowSteps.map((step) => `<li>${renderPracticalText(step, 'يلخص هذا البند خطوة عملية من خطوات تنفيذ المثال الحالية.', {currentItem: item})}</li>`).join('')}
    </ol>
  ` : '';
  const conceptsHtml = visibleSections.concepts && concepts.length > 0 ? `
    <ul class="best-practices-list">
      ${concepts.map((entry) => `<li>${renderPracticalText(entry, 'يوضح هذا البند فكرة تقنية مرتبطة بالمثال الحالي.', {currentItem: item})}</li>`).join('')}
    </ul>
  ` : '';
  const notesHtml = visibleSections.notes && notes.length > 0 ? `
    <ul class="best-practices-list">
      ${notes.slice(0, 6).map((entry) => `<li>${linkUsageBridgeText(entry, {currentItem: item, tooltipContext: 'note'})}</li>`).join('')}
    </ul>
  ` : '';
  const undocumentedHtml = visibleSections.undocumented ? `
    ${wrapExampleInsightTable(`
    <table class="params-table example-local-symbols-table">
      <colgroup>
        <col class="example-local-symbols-col-name">
        <col class="example-local-symbols-col-kind">
        <col class="example-local-symbols-col-signature">
        <col class="example-local-symbols-col-purpose">
      </colgroup>
      <thead>
        <tr>
          <th>العنصر</th>
          <th>نوع الكيان</th>
          <th>التوقيع العام</th>
          <th>الغرض داخل المثال</th>
        </tr>
      </thead>
      <tbody>
        ${undocumentedSymbols.map((symbol) => `
          <tr id="${escapeAttribute(symbol.anchorId || buildLocalExampleSymbolAnchorId(symbol.name))}">
            <td>${renderLocalExampleSymbolLink(symbol.name, symbol)}</td>
            <td>${escapeHtml(symbol.kindLabel || getLocalExampleSymbolMeta(symbol.kind || '').label || 'عنصر محلي')}</td>
            <td>${symbol.signature ? renderVulkanHighlightedInlineCode(symbol.signature) : '<code>غير موثق</code>'}</td>
            <td>${renderPracticalText(symbol.description || symbol.tooltip, 'عنصر محلي مساعد نظم جزءاً من الكود حتى يبقى المثال قابلاً للقراءة.', {currentItem: item})}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    `, 'example-explanation-local-shell')}
  ` : '';
  const renderExampleSectionAnchorLink = (label = '', anchorId = '', tooltip = '') => {
    const cleanLabel = String(label || '').trim();
    const cleanAnchorId = String(anchorId || '').trim();
    if (!cleanLabel || !cleanAnchorId) {
      return '';
    }

    const resolvedTooltip = String(tooltip || `ينقلك إلى قسم ${cleanLabel} داخل صفحة المثال الحالية.`).trim();
    const aria = `${cleanLabel}: ${resolvedTooltip}`.replace(/\n/g, ' - ');
    return `<a href="#${escapeAttribute(cleanAnchorId)}" class="related-link code-token entity-link-with-icon" data-tooltip="${escapeAttribute(resolvedTooltip)}" tabindex="0" aria-label="${escapeAttribute(aria)}" onclick="scrollToAnchor('${escapeAttribute(cleanAnchorId)}'); return false;">${safeRenderEntityLabel(cleanLabel, 'structure', {code: false})}</a>`;
  };

  const useSectionedCards = options.sectionedCards !== false;

  if (useSectionedCards) {
    const sectionCards = [
      {
        key: 'goal',
        title: sectionTitles.generalGoal,
        body: generalGoalHtml
      },
      visibleSections.requirements ? {
        key: 'requirements',
        title: sectionTitles.requirements,
        body: requirementsHtml
      } : null,
      visibleSections.learning ? {
        key: 'learning',
        title: sectionTitles.learning,
        body: learningHtml
      } : null,
      visibleSections.flow ? {
        key: 'flow',
        title: sectionTitles.flow,
        body: flowHtml
      } : null,
      visibleSections.concepts && concepts.length > 0 ? {
        key: 'concepts',
        title: sectionTitles.concepts,
        body: conceptsHtml
      } : null,
      visibleSections.notes && notes.length > 0 ? {
        key: 'notes',
        title: sectionTitles.notes,
        body: notesHtml
      } : null,
      visibleSections.usageBridge && usageItems.length > 0 ? {
        key: 'usage-bridge',
        title: sectionTitles.usageBridge,
        body: usageBridgeHtml
      } : null,
      visibleSections.commentIssues ? {
        key: 'comment-issues',
        title: sectionTitles.commentIssues,
        body: commentIssuesHtml,
        wide: true
      } : null,
      visibleSections.lineByLine ? {
        key: 'line-by-line',
        title: sectionTitles.lineByLine,
        body: lineByLineHtml,
        wide: true
      } : null,
      visibleSections.functions ? {
        key: 'functions',
        title: sectionTitles.functions,
        body: functionsHtml,
        wide: true
      } : null,
      visibleSections.constants ? {
        key: 'constants',
        title: sectionTitles.constants,
        body: constantsHtml,
        wide: true
      } : null,
      visibleSections.variables ? {
        key: 'variables',
        title: sectionTitles.variables,
        body: variablesHtml,
        wide: true
      } : null,
      visibleSections.rewrittenCode ? {
        key: 'rewritten-code',
        title: sectionTitles.rewrittenCode,
        body: rewrittenCodeHtml,
        wide: true
      } : null,
      visibleSections.undocumented ? {
        key: 'undocumented',
        title: sectionTitles.undocumented,
        body: undocumentedHtml,
        wide: true
      } : null,
      visibleSections.references ? {
        key: 'references',
        title: sectionTitles.references,
        body: referencesHtml,
        wide: true
      } : null
    ].filter(Boolean).filter((entry) => String(entry.body || '').trim());
    const summaryCardKeys = new Set(
      Array.isArray(options.summaryCardKeys) && options.summaryCardKeys.length
        ? options.summaryCardKeys
        : ['goal', 'requirements', 'learning', 'flow', 'concepts', 'notes']
    );
    const independentCardKeys = new Set(
      Array.isArray(options.independentCardKeys) && options.independentCardKeys.length
        ? options.independentCardKeys
        : []
    );
    const independentCards = sectionCards.filter((entry) => independentCardKeys.has(entry.key));
    const remainingCards = sectionCards.filter((entry) => !independentCardKeys.has(entry.key));
    const summaryCards = remainingCards.filter((entry) => summaryCardKeys.has(entry.key));
    const detailCards = remainingCards.filter((entry) => !summaryCardKeys.has(entry.key));
    const buildExampleCardClassName = (entry, isSummary = false) => {
      const sectionKey = String(entry?.key || '').trim();
      return [
        'content-card',
        'prose-card',
        'parameter-detail-card',
        'example-explanation-block',
        isSummary ? 'example-explanation-summary-card' : '',
        entry?.wide ? 'example-explanation-block-wide' : '',
        sectionKey ? `example-explanation-card-${sectionKey}` : '',
        isSummary ? 'example-explanation-card-compact' : 'example-explanation-card-detail'
      ].filter(Boolean).join(' ');
    };

    const sectionNav = sectionCards
      .map((entry) => renderExampleSectionAnchorLink(
        entry.title,
        buildSectionAnchor(entry.key),
        `ينقلك إلى قسم ${entry.title} داخل شرح المثال الحالي.`
      ))
      .join(' ');

    const headerDescription = String(options.headerDescription || '').trim();

    return `
      <section class="explanation-section params-section example-explanation-sectioned">
        <div class="content-card prose-card params-section-intro example-explanation-head">
          ${headerKicker ? `<div class="params-section-intro-kicker">${escapeHtml(headerKicker)}</div>` : ''}
          <h2>${sectionTitles.header}</h2>
          ${headerDescription ? `<p class="example-explanation-head-description">${renderPracticalText(headerDescription, headerDescription, {currentItem: item})}</p>` : ''}
          <div class="see-also-links example-explanation-anchor-nav">${sectionNav}</div>
        </div>
        ${independentCards.length ? `
        <div class="example-explanation-independent-cards">
          ${independentCards.map((entry) => `
            <section class="${buildExampleCardClassName(entry, true)} example-explanation-standalone-card" data-example-section="${escapeAttribute(entry.key)}" id="${escapeAttribute(buildSectionAnchor(entry.key))}">
              <h3>${entry.title}</h3>
              <div class="example-explanation-card-body">${entry.body}</div>
            </section>
          `).join('')}
        </div>
        ` : ''}
        ${summaryCards.length ? `
        <div class="example-explanation-summary-strip">
          ${summaryCards.map((entry) => `
            <section class="${buildExampleCardClassName(entry, true)}" data-example-section="${escapeAttribute(entry.key)}" id="${escapeAttribute(buildSectionAnchor(entry.key))}">
              <h3>${entry.title}</h3>
              <div class="example-explanation-card-body">${entry.body}</div>
            </section>
          `).join('')}
        </div>
        ` : ''}
        <div class="example-explanation-grid">
          ${detailCards.map((entry) => `
            <section class="${buildExampleCardClassName(entry, false)}" data-example-section="${escapeAttribute(entry.key)}" id="${escapeAttribute(buildSectionAnchor(entry.key))}">
              <h3>${entry.title}</h3>
              <div class="example-explanation-card-body">${entry.body}</div>
            </section>
          `).join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="explanation-section">
      <h2>${sectionTitles.header}</h2>
      <div class="content-card prose-card">
        <h3>${sectionTitles.generalGoal}</h3>
        ${purposeParagraphs.map((entry) => `<p>${renderPracticalText(entry, purpose, {currentItem: item})}</p>`).join('')}

        ${visibleSections.requirements ? `
        <h3>${sectionTitles.requirements}</h3>
        <ul class="best-practices-list">
          ${requirements.map((entry) => `<li>${renderPracticalText(entry, 'هذا المتطلب ضروري لتشغيل المثال أو لفهمه بشكل صحيح.', {currentItem: item})}</li>`).join('')}
        </ul>
        ` : ''}

        ${visibleSections.learning ? `
        <h3>${sectionTitles.learning}</h3>
        <ul class="best-practices-list">
          ${learningItems.map((entry) => `<li>${renderPracticalText(entry, 'يبين هذا البند ما الذي سيتعلمه القارئ بعد تنفيذ المثال.', {currentItem: item})}</li>`).join('')}
        </ul>
        ` : ''}

        ${visibleSections.commentIssues ? `
        <h3>${sectionTitles.commentIssues}</h3>
        ${analysis.commentIssues.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="رقم السطر أو موضع السطر داخل المثال الجاري تحليله." tabindex="0" aria-label="السطر">السطر</th>
              <th data-tooltip="يعرض صياغة التعليق السابقة بعد تطبيع الوصف العربي وإبقاء أسماء الدوال والأنواع والثوابت الرسمية كما هي." tabindex="0" aria-label="التعليق الأصلي">التعليق الأصلي</th>
              <th data-tooltip="يوضح لماذا كان التعليق السابق قاصراً عن شرح السطر برمجياً، وما العناصر أو العلاقات التي لم يبرزها بوضوح." tabindex="0" aria-label="سبب القصور">سبب القصور</th>
              <th data-tooltip="يحدد ما الذي فات الشرح الخام أو السطر نفسه توضيحه من عناصر أو علاقات مهمة." tabindex="0" aria-label="ما الذي أهمله">ما الذي أهمله</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.commentIssues.map((issue) => `
              <tr>
                <td class="analysis-table-code">${renderCommentIssueLine(issue.line)}</td>
                <td>${renderCommentIssueNarrative(issue.previous, 'هذا هو التعليق السابق قبل إعادة صياغته بشكل أوضح.')}</td>
                <td>${renderCommentIssueNarrative(issue.reason, 'هذا الحقل يوضح سبب قصور التعليق السابق عن شرح السطر برمجياً.')}</td>
                <td>${renderCommentIssueNarrative(issue.missing, 'هذا الحقل يوضح العناصر أو العلاقات التي كان يجب أن يذكرها التعليق المصحح.')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${commentIssueRelatedRows.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="العنصر البرمجي الذي ظهر داخل السطر ويحتاج إلى توثيق مستقل حتى لا يبقى التعليق ناقصاً." tabindex="0" aria-label="العنصر">العنصر</th>
              <th data-tooltip="هل هذا العنصر دالة أم بنية أم نوعاً مرجعياً آخر في Vulkan." tabindex="0" aria-label="النوع">النوع</th>
              <th data-tooltip="المعنى العملي الحقيقي للعنصر داخل السطر والمرحلة الحالية من التنفيذ." tabindex="0" aria-label="المعنى الحقيقي">المعنى الحقيقي</th>
              <th data-tooltip="لماذا ظهر هذا العنصر في السطر الحالي، وما الدور الذي يؤديه داخل المثال." tabindex="0" aria-label="سبب الاستخدام">سبب الاستخدام</th>
            </tr>
          </thead>
          <tbody>
            ${commentIssueRelatedRows.map((entry) => `
              <tr>
                <td>${renderAnalysisReference(entry.name, item)}</td>
                <td>${escapeHtml(entry.kindLabel)}</td>
                <td>${renderPracticalText(entry.meaning, 'يوضح هذا الحقل المعنى الحقيقي للعنصر البرمجي داخل السطر الحالي.', {currentItem: item})}</td>
                <td>${renderPracticalText(entry.usage, 'يوضح هذا الحقل سبب ظهور العنصر في هذا السطر تحديداً.', {currentItem: item})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        ` : '<p>لا توجد في هذا المثال تعليقات مولدة عامة من النمط الذي كان يسبب الالتباس سابقاً.</p>'}
        ` : ''}

        ${visibleSections.lineByLine ? `
        <h3>${sectionTitles.lineByLine}</h3>
        ${lineExplanationRows.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th>السطر</th>
              <th>ماذا يفعل</th>
              <th>لماذا استُخدم</th>
              <th>ما الذي سيحدث إذا لم يُستخدم</th>
            </tr>
          </thead>
          <tbody>
            ${lineExplanationRows.map((row) => `
              <tr>
                <td class="analysis-table-code"><code class="language-${inferredLanguage}">${renderHighlightedCode(row.line || '', {
                  language: inferredLanguage,
                  annotate: true,
                  glslTooltipMode: inferredLanguage === 'glsl' ? 'corrected' : '',
                  localSymbolMap
                })}</code></td>
                <td>${renderPracticalText(row.what, 'هذا السطر ينفذ خطوة مباشرة من خطوات المثال الحالية.', {currentItem: item})}</td>
                <td>${renderPracticalText(row.why, 'وضع هذا السطر هنا لأن المرحلة التالية تعتمد على أثره أو على الحالة التي يجهزها.', {currentItem: item})}</td>
                <td>${renderPracticalText(row.without, 'غياب هذا السطر سيترك فجوة عملية في المسار الجاري تنفيذه.', {currentItem: item})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : compactLineRows.length > 0 ? compactLineRows.map((row, index) => `
          <div class="analysis-line-card">
            <div class="analysis-line-header">السطر ${index + 1}</div>
            <div class="analysis-line-code">
              <code class="language-${inferredLanguage}" data-raw-code="${escapeAttribute(row.line)}">${escapeHtml(row.line)}</code>
            </div>
            <div class="analysis-function-list">
              ${row.functions.map((entry) => `
                <div class="analysis-function-card">
                  <div class="analysis-function-name">${renderRelatedReferenceLink(entry.name)}</div>
                  <p><strong>المعنى:</strong> ${renderPracticalText(entry.meaning, 'هذه الدالة تمثل العملية التنفيذية الأساسية في هذا السطر.')}</p>
                  <p><strong>الفائدة:</strong> ${renderPracticalText(entry.benefit, 'فائدة هذه الدالة هنا أنها تنقل التنفيذ إلى الخطوة التالية المطلوبة في المسار الحالي.')}</p>
                  <p><strong>التأثير:</strong> ${renderPracticalText(entry.effect, 'استدعاء هذه الدالة يغيّر حالة التنفيذ أو الموارد وفق ما يتطلبه هذا السطر.')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('') : '<p>لا توجد في المثال الحالي أسطر استدعاء دوال تحتاج إلى شرح مستقل.</p>'}
        ` : ''}

        ${visibleSections.functions ? `
        <h3>${sectionTitles.functions}</h3>
        ${analysis.tokenGroups.functions.length > 0 ? `
        <table class="params-table example-functions-table">
          <colgroup>
            <col class="example-functions-col-name">
            <col class="example-functions-col-signature">
            <col class="example-functions-col-purpose">
            <col class="example-functions-col-usage">
            <col class="example-functions-col-return">
          </colgroup>
          <thead>
            <tr>
              <th>الدالة</th>
              <th>التوقيع العام</th>
              <th>الغرض منها</th>
              <th>متى تستخدم</th>
              <th>القيمة المرجعة</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.tokenGroups.functions.map(({name, item: functionItem}) => `
              <tr>
                <td>${renderAnalysisReference(name, item)}</td>
                <td>${renderVulkanHighlightedInlineCode(functionItem?.signature || `${name}(...)`)}</td>
                <td>${renderPracticalText(inferFunctionIntentSummary(functionItem || {name, description: functionItem?.description || ''}), `تنفيذ العملية المرتبطة بالدالة ${name} داخل المثال.`, {currentItem: item})}</td>
                <td>${renderPracticalText(inferFunctionBenefitSummary(functionItem || {name, description: functionItem?.description || ''}), `تستخدم هذه الدالة عندما يصل المثال إلى هذه المرحلة من مسار Vulkan.`, {currentItem: item})}</td>
                <td>${functionItem?.returnType ? renderExternalReference(functionItem.returnType) : '<code>غير محدد</code>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>لا توجد دوال ظاهرة في هذا المثال أو لم يتم التعرف عليها من البيانات الحالية.</p>'}
        ` : ''}

        ${visibleSections.constants ? `
        <h3 data-tooltip="يفكك هذا القسم الثوابت والماكرو المستخدمة في المثال، ويشرح ما تمثله فعلياً ولماذا استُخدمت في هذا الموضع." tabindex="0" aria-label="${escapeAttribute(sectionTitles.constants)}">${sectionTitles.constants}</h3>
        ${analysis.tokenGroups.constants.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="الاسم المرجعي للثابت أو الماكرو كما يظهر في الكود." tabindex="0" aria-label="العنصر">العنصر</th>
              <th data-tooltip="هل هذا العنصر ماكرو مستقل أم قيمة تعداد أم ثابت رسمي من Vulkan." tabindex="0" aria-label="النوع">النوع</th>
              <th data-tooltip="المعنى العملي الذي تمثله هذه القيمة أو وظيفة هذا الماكرو في التنفيذ." tabindex="0" aria-label="المعنى الحقيقي">المعنى الحقيقي</th>
              <th data-tooltip="القيمة الرقمية أو ناتج التوسيع النصي عندما يكون معروفاً محلياً." tabindex="0" aria-label="القيمة العددية أو الناتج">القيمة العددية أو الناتج</th>
              <th data-tooltip="لماذا استُخدم هذا الثابت أو الماكرو في هذا السطر أو المثال تحديداً." tabindex="0" aria-label="سبب استخدامه هنا">سبب استخدامه هنا</th>
              <th data-tooltip="أكثر المواضع الشائعة التي يظهر فيها هذا الثابت أو الماكرو داخل استخدامات Vulkan الواقعية." tabindex="0" aria-label="أين يستخدم عادة">أين يستخدم عادة</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.tokenGroups.constants.map(({name, item: constantItem, kind}) => {
              const enumMeta = getEnumValueMetadata(name, {functionName: item.name || ''});
              return `
                <tr>
                  <td>${renderAnalysisReference(name, item)}</td>
                  <td>${renderPracticalText(kind === 'macro' ? 'ماكرو يوسّع نصياً أثناء preprocessing.' : 'ثابت أو قيمة تعداد تستخدمها Vulkan مباشرة لتحديد السلوك المطلوب.', 'هذا عنصر مرجعي ثابت داخل المثال.')}</td>
                  <td>${renderPracticalText(enumMeta?.valueMeaning || constantItem?.description || describeValueMeaning(name), `هذا العنصر يحدد المعنى الذي ستقرأه Vulkan أو سيولده الـ preprocessor في هذا الموضع.`)}</td>
                  <td><code>${escapeHtml(enumMeta?.numericValue || constantItem?.value || constantItem?.syntax || 'راجع الصفحة المرجعية')}</code></td>
                  <td>${renderPracticalText(enumMeta?.chosenBecause || 'استُخدم لأن السطر يحتاج القيمة الرسمية نفسها بدل رقم أو نص حرفي.', 'اختير هنا لأن الكود يحتاج الرمز الرسمي نفسه لضبط السلوك أو المقارنة أو التهيئة.')}</td>
                  <td>${renderPracticalText(describeVulkanConstantTypicalUsage(name, constantItem, enumMeta), 'يوضع عادة في المواضع التي تتطلب هذا الرمز الرسمي داخل حقول Vulkan أو مقارناتها.', {currentItem: item})}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ` : '<p>لا توجد ماكروز أو ثوابت ظاهرة بوضوح في هذا المثال.</p>'}
        ` : ''}

        ${visibleSections.variables ? `
        <h3 data-tooltip="يشرح هذا القسم المتغيرات المحلية وأنواعها والحقول التي تملؤها داخل المثال، مع بيان دورها التنفيذي الفعلي." tabindex="0" aria-label="${escapeAttribute(sectionTitles.variables)}">${sectionTitles.variables}</h3>
        ${analysis.variables.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="اسم المتغير المحلي كما يظهر في المثال." tabindex="0" aria-label="المتغير">المتغير</th>
              <th data-tooltip="نوع المتغير أو البنية أو المقبض الذي يمثله." tabindex="0" aria-label="النوع">النوع</th>
              <th data-tooltip="الدور العملي الذي يؤديه هذا المتغير داخل المثال." tabindex="0" aria-label="الغرض">الغرض</th>
              <th data-tooltip="المعنى العملي للقيمة التي يبدأ بها المتغير عند تعريفه لأول مرة." tabindex="0" aria-label="القيمة الابتدائية">القيمة الابتدائية</th>
              <th data-tooltip="النص أو القيمة المستخدمة فعلياً داخل المثال في موضع التعريف أو التهيئة." tabindex="0" aria-label="القيمة في المثال">القيمة في المثال</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.variables.map((variable) => `
              <tr id="${makeAnchorId('analysis-var', variable.name)}">
                <td>${renderVariableReference(variable.name, buildAnalysisVariableTooltip(variable, item))}</td>
                <td>${renderAnalysisReference(normalizeLookupName(variable.type), item)}</td>
                <td>${renderPracticalText(explainVariableRole(variable, item), `هذا المتغير يحمل قيمة أو مورداً يحتاجه المثال في خطوة لاحقة من التنفيذ.`)}</td>
                <td>${renderPracticalText(describeValueMeaning(variable.value, variable.type), `هذه هي القيمة العملية التي يبدأ بها المتغير داخل المثال.`)}</td>
                <td>${renderVulkanHighlightedInlineCode(variable.value)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>لا يحتوي المثال على تعريفات محلية كثيرة للمتغيرات.</p>'}

        ${analysis.tokenGroups.fields.length > 0 ? `
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="اسم الحقل الذي جرى ملؤه داخل البنية أو الكائن المالك." tabindex="0" aria-label="الحقل">الحقل</th>
              <th data-tooltip="المتغير المالك للحقل ونوع البنية التي ينتمي إليها." tabindex="0" aria-label="المالك">المالك</th>
              <th data-tooltip="المعنى العملي الذي تحمله هذه القيمة داخل هذا الحقل." tabindex="0" aria-label="المعنى الحقيقي">المعنى الحقيقي</th>
              <th data-tooltip="ما الفائدة العملية لهذا الحقل، وما الذي يتغير عند تعبئته بهذه القيمة." tabindex="0" aria-label="الفائدة والتأثير">الفائدة والتأثير</th>
              <th data-tooltip="القيمة التي وضعت فعلياً في الحقل داخل المثال." tabindex="0" aria-label="القيمة في المثال">القيمة في المثال</th>
            </tr>
          </thead>
          <tbody>
            ${analysis.tokenGroups.fields.map((field) => {
              const metadata = getFieldMetadata(field.name, field.ownerType, field.value, field.fieldType || '');
              const shapeSummary = renderValueShapeSummary(field.name, field.fieldType || '', {ownerType: field.ownerType});
              return `
                <tr id="${makeAnchorId('analysis-field', `${field.ownerType || item.name}-${field.name}`)}">
                  <td>${renderAnalysisReference(field.name, item, {label: field.name, anchorId: makeAnchorId('analysis-field', `${field.ownerType || item.name}-${field.name}`), tooltip: buildFieldTooltip(field.name, field.ownerType, field.fieldType || '', field.value)})}</td>
                  <td>${renderVariableReference(field.owner)} / ${field.ownerType ? renderAnalysisReference(field.ownerType, item) : '<code>غير معروف</code>'}</td>
                  <td>${renderPracticalText(`${metadata.meaning} ${metadata.usage}`, `هذا الحقل يوضح المعنى العملي للقيمة داخل ${field.ownerType || item.name}.`)} <br><small>${shapeSummary}</small></td>
                  <td>${renderPracticalText(`${metadata.benefit} ${metadata.effect}`, `هذه القيمة تغيّر سلوك الحقل أو أثره التنفيذي داخل المثال الحالي.`)}</td>
                  <td>${field.value === '0' ? '<code>0</code>' : escapeHtml(field.value)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ` : ''}

        ${analysis.tokenGroups.types.length > 0 ? `
        <div class="see-also-links">
          ${analysis.tokenGroups.types.map(({name}) => renderAnalysisReference(name, item)).join('')}
        </div>
        ` : ''}
        ` : ''}

        ${visibleSections.rewrittenCode ? `
        <h3>${sectionTitles.rewrittenCode}</h3>
        ${renderDocCodeContainer({
          titleHtml: `${renderEntityIcon('command', 'ui-codicon list-icon', kindLabel)} الكود المصحح`,
          rawCode: analysis.rewrittenCode,
          renderedCodeHtml: renderHighlightedCode(analysis.rewrittenCode, {
            language: inferredLanguage,
            annotate: true,
            glslTooltipMode: inferredLanguage === 'glsl' ? 'corrected' : '',
            localSymbolMap
          }),
          language: inferredLanguage,
          containerClassName: 'example-section tutorial-example-section',
          preClassName: 'vulkan-ready-example-pre',
          codeClassName: 'vulkan-signature-code',
          allowCopy: true,
          allowToggle: true,
          skipHighlight: true
        })}
        ` : ''}

        ${visibleSections.usageBridge && usageItems.length > 0 ? `
        <h3>${sectionTitles.usageBridge}</h3>
        ${renderUsageBridgeSection(usageItems)}
        ` : ''}

        ${visibleSections.flow ? `
        <h3>${sectionTitles.flow}</h3>
        <ol class="flow-list">
          ${flowSteps.map((step) => `<li>${renderPracticalText(step, 'يلخص هذا البند خطوة عملية من خطوات تنفيذ المثال الحالية.', {currentItem: item})}</li>`).join('')}
        </ol>
        ` : ''}

        ${visibleSections.concepts && concepts.length > 0 ? `
        <h3>${sectionTitles.concepts}</h3>
        <ul class="best-practices-list">
          ${concepts.map((entry) => `<li>${renderPracticalText(entry, 'يوضح هذا البند فكرة تقنية مرتبطة بالمثال الحالي.', {currentItem: item})}</li>`).join('')}
        </ul>
        ` : ''}

        ${visibleSections.notes && notes.length > 0 ? `
        <h3>${sectionTitles.notes}</h3>
        <ul class="best-practices-list">
          ${notes.slice(0, 6).map((entry) => `<li>${linkUsageBridgeText(entry, {currentItem: item, tooltipContext: 'note'})}</li>`).join('')}
        </ul>
        ` : ''}

        ${visibleSections.undocumented ? `
        <h3>${sectionTitles.undocumented}</h3>
        <table class="params-table example-local-symbols-table">
          <colgroup>
            <col class="example-local-symbols-col-name">
            <col class="example-local-symbols-col-kind">
            <col class="example-local-symbols-col-signature">
            <col class="example-local-symbols-col-purpose">
          </colgroup>
          <thead>
            <tr>
              <th>العنصر</th>
              <th>نوع الكيان</th>
              <th>التوقيع العام</th>
              <th>الغرض داخل المثال</th>
            </tr>
          </thead>
          <tbody>
            ${undocumentedSymbols.map((symbol) => `
              <tr id="${escapeAttribute(symbol.anchorId || buildLocalExampleSymbolAnchorId(symbol.name))}">
                <td>${renderLocalExampleSymbolLink(symbol.name, symbol)}</td>
                <td>${escapeHtml(symbol.kindLabel || getLocalExampleSymbolMeta(symbol.kind || '').label || 'عنصر محلي')}</td>
                <td>${symbol.signature ? renderVulkanHighlightedInlineCode(symbol.signature) : '<code>غير موثق</code>'}</td>
                <td>${renderPracticalText(symbol.description || symbol.tooltip, 'عنصر محلي مساعد نظم جزءاً من الكود حتى يبقى المثال قابلاً للقراءة.', {currentItem: item})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        ${visibleSections.references ? `
        <h3 data-tooltip="يجمع هذا القسم كل العناصر المرجعية المذكورة في المثال في قائمة واحدة سريعة الوصول." tabindex="0" aria-label="${escapeAttribute(sectionTitles.references)}">${sectionTitles.references}</h3>
        ${renderReferenceSummaryList(referenceEntries)}
        ` : ''}
      </div>
    </section>
  `;
}

function buildSdl3ThreadSafetyFallback(text) {
  const raw = normalizeSdl3DocValue(text);
  if (!raw) {
    return '';
  }

  let match = /^It is safe to call this (?:function|macro) from any thread\.?$/i.exec(raw);
  if (match) {
    return 'يمكن استدعاء هذا العنصر من أي خيط بأمان.';
  }

  match = /^This function is thread-safe\.?$/i.exec(raw);
  if (match) {
    return 'هذه الدالة آمنة للاستخدام من عدة خيوط.';
  }

  match = /^This function is thread-safe,\s+as long as\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `هذه الدالة آمنة بين الخيوط ما دام ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function is not thread safe(?:,\s*(.+))?\.?$/i.exec(raw);
  if (match) {
    return `هذه الدالة غير آمنة للاستخدام المتزامن بين عدة خيوط${match[1] ? `، و${translateSdl3DocFragment(match[1])}` : ''}.`;
  }

  match = /^You may only call this function from the main thread\.?$/i.exec(raw);
  if (match) {
    return 'لا يجوز استدعاء هذه الدالة إلا من الخيط الرئيسي.';
  }

  match = /^This function should only be called on the main thread\.?$/i.exec(raw);
  if (match) {
    return 'يجب استدعاء هذه الدالة من الخيط الرئيسي فقط.';
  }

  match = /^This function should only be called from the thread that created the window\.?$/i.exec(raw);
  if (match) {
    return 'يجب استدعاء هذه الدالة من الخيط الذي أنشأ النافذة.';
  }

  match = /^This function should be called on the thread that created the\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يجب استدعاء هذه الدالة من الخيط الذي أنشأ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function should not be called while any other thread is using the\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `لا يجوز استدعاء هذه الدالة بينما يستخدم خيط آخر ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function should not be called while these properties are locked or other threads might be setting or getting values from these properties\.?$/i.exec(raw);
  if (match) {
    return 'لا يجوز استدعاء هذه الدالة أثناء قفل هذه الخصائص أو بينما تقوم خيوط أخرى بقراءة قيمها أو تعديلها.';
  }

  match = /^This may only be called \(by SDL\) from the thread handling the\s+(.+?) event loop\.?$/i.exec(raw);
  if (match) {
    return `لا يجوز أن تستدعي SDL هذا الرد إلا من الخيط الذي يدير حلقة أحداث ${match[1]}.`;
  }

  match = /^All calls should be made from a single thread\.?$/i.exec(raw);
  if (match) {
    return 'يجب تنفيذ جميع الاستدعاءات من خيط واحد فقط.';
  }

  match = /^Do not use the same\s+([A-Za-z0-9_]+)\s+from two threads at once\.?$/i.exec(raw);
  if (match) {
    return `لا تستخدم نفس ${match[1]} من خيطين في الوقت نفسه.`;
  }

  match = /^It is NOT safe to call this function from two threads at once\.?$/i.exec(raw);
  if (match) {
    return 'لا يجوز استدعاء هذه الدالة من خيطين في الوقت نفسه.';
  }

  match = /^Only one thread should be using the src and dst surfaces at any given time\.?$/i.exec(raw);
  if (match) {
    return 'يجب أن يكون خيط واحد فقط هو الذي يستخدم سطحي src وdst في أي لحظة.';
  }

  match = /^No other thread should be using the surface when it is freed\.?$/i.exec(raw);
  if (match) {
    return 'لا يجوز لأي خيط آخر استخدام السطح أثناء تحريره.';
  }

  match = /^This call must be paired with a previous\s+(.+?)\s+call on the same thread\.?$/i.exec(raw);
  if (match) {
    return `يجب أن يقترن هذا الاستدعاء مع ${translateSdl3DocFragment(match[1])} سابق على الخيط نفسه.`;
  }

  match = /^You should only call this from the same thread that previously called\s+([A-Za-z0-9_]+)\s*\(\)\s*\.?$/i.exec(raw);
  if (match) {
    return `لا يجوز استدعاء هذا إلا من نفس الخيط الذي استدعى ${match[1]}() سابقًا.`;
  }

  match = /^This should be called from the same thread that called\s+([A-Za-z0-9_]+)\s*\(\)\s*\.?$/i.exec(raw);
  if (match) {
    return `يجب استدعاء هذا من نفس الخيط الذي استدعى ${match[1]}() سابقًا.`;
  }

  match = /^SDL may call this callback at any time from (?:a )?(background thread|any thread);?\s*(.+)?$/i.exec(raw);
  if (match) {
    return `قد تستدعي SDL هذا الرد من ${match[1] === 'background thread' ? 'خيط خلفي' : 'أي خيط'} في أي وقت${match[2] ? `، لذلك ${translateSdl3DocFragment(match[2])}` : ''}.`;
  }

  match = /^This will run from a background thread owned by SDL\.?\s*(.+)?$/i.exec(raw);
  if (match) {
    return `يعمل هذا من خيط خلفي تملكه SDL${match[1] ? `، لذا ${translateSdl3DocFragment(match[1])}` : ''}.`;
  }

  match = /^It is safe to call this function from any thread,\s+as long as\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يمكن استدعاء هذه الدالة من أي خيط ما دام ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this function from any thread,\s+assuming\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يمكن استدعاء هذه الدالة من أي خيط على افتراض أن ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this function from any thread,\s+although\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يمكن استدعاء هذه الدالة من أي خيط، لكن ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this function from any thread,\s+but\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يمكن استدعاء هذه الدالة من أي خيط، لكن ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this function on NULL,\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يمكن استدعاء هذه الدالة مع NULL بأمان، و${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this multiple times;\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `من الآمن استدعاء هذا أكثر من مرة؛ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^It is safe to call this multiple times,\s+as long as\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `من الآمن استدعاء هذا أكثر من مرة ما دام ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^If this is used with a\s+(.+?),\s+then this function should only be called on the main thread\. If this is used with a\s+(.+?),\s+then it is safe to call this function from any thread\.?$/i.exec(raw);
  if (match) {
    return `إذا استُخدم هذا مع ${match[1].trim().replace(/\s+from\s+/i, ' المُنشأ بواسطة ')} فيجب استدعاؤه من الخيط الرئيسي فقط، أما إذا استُخدم مع ${match[2].trim().replace(/\s+from\s+/i, ' المُنشأ بواسطة ')} فيمكن استدعاؤه من أي خيط.`;
  }

  match = /^This function can be called on different threads with different surfaces\.?$/i.exec(raw);
  if (match) {
    return 'يمكن استدعاء هذه الدالة من خيوط مختلفة ما دام كل استدعاء يعمل على سطح مختلف.';
  }

  match = /^This function can be called on different threads with different surfaces\. The locking referred to by this function is making the pixels available for direct access,\s+not thread-safe locking\.?$/i.exec(raw);
  if (match) {
    return 'يمكن استدعاء هذه الدالة من خيوط مختلفة ما دام كل استدعاء يعمل على سطح مختلف. القفل المذكور هنا يهدف فقط إلى إتاحة الوصول المباشر إلى البكسلات، وليس إلى توفير مزامنة آمنة بين الخيوط.';
  }

  match = /^This function is called once by SDL,\s+at startup,\s+on a single thread\.?$/i.exec(raw);
  if (match) {
    return 'تستدعي SDL هذه الدالة مرة واحدة عند بدء التشغيل وعلى خيط واحد فقط.';
  }

  match = /^SDL_AppEvent\s*\(\)\s+may get called concurrently with this function if other threads that push events are still active\.?$/i.exec(raw);
  if (match) {
    return 'قد تُستدعى SDL_AppEvent() بالتزامن مع هذه الدالة إذا كانت هناك خيوط أخرى ما زالت تدفع أحداثًا إلى الطابور.';
  }

  match = /^This function may get called concurrently with SDL_AppEvent\s*\(\)\s+for events not pushed on the main thread\.?$/i.exec(raw);
  if (match) {
    return 'قد تُستدعى هذه الدالة بالتزامن مع SDL_AppEvent() للأحداث التي لم تُدفَع من الخيط الرئيسي.';
  }

  match = /^This function may get called concurrently with SDL_AppIterate\s*\(\)\s+or SDL_AppQuit\s*\(\)\s+for events not pushed from the main thread\.?$/i.exec(raw);
  if (match) {
    return 'قد تُستدعى هذه الدالة بالتزامن مع SDL_AppIterate() أو SDL_AppQuit() للأحداث التي لم تُدفَع من الخيط الرئيسي.';
  }

  if (/main thread/i.test(raw)) {
    return 'يجب استدعاء هذا العنصر من الخيط الرئيسي فقط.';
  }

  return '';
}

function buildSdl3RemarkFallback(text, item = null) {
  const raw = normalizeSdl3DocValue(text);
  if (!raw) {
    return '';
  }

  let match = /^These are the supported properties:\s*(.+)?$/i.exec(raw);
  if (match) {
    return `الخصائص التالية مدعومة لهذا الاستدعاء${match[1] ? `: ${translateSdl3DocFragment(match[1])}` : ':'}`;
  }

  match = /^These animation types are currently supported:\s*(.+)?$/i.exec(raw);
  if (match) {
    return `أنواع الرسوم المتحركة المدعومة حاليًا${match[1] ? `: ${match[1].trim()}` : ':'}`;
  }

  match = /^The file type is determined from the file extension,\s*e\.g\.\s*"([^"]+)"\s+will be\s+(decoded|encoded)\s+using\s+([A-Za-z0-9_]+)\.?$/i.exec(raw);
  if (match) {
    return `يُحدد نوع الملف من امتداده. على سبيل المثال، الملف "${match[1]}" ${match[2] === 'decoded' ? 'سيُفك ترميزه' : 'سيُشفَّر'} باستخدام ${match[3]}.`;
  }

  match = /^If closeio is true,\s+([A-Za-z_]+)\s+will be closed before returning if this function fails,\s+or when the\s+(.+?)\s+is closed if this function succeeds\.?$/i.exec(raw);
  if (match) {
    return `إذا كانت closeio تساوي true فسيُغلق ${match[1]} قبل العودة إذا فشلت الدالة، أو عند إغلاق ${translateSdl3DocFragment(match[2])} إذا نجحت.`;
  }

  match = /^If closeio is true,\s+([A-Za-z_]+)\s+will be closed before returning\.?$/i.exec(raw);
  if (match) {
    return `إذا كانت closeio تساوي true فسيُغلق ${match[1]} قبل العودة من هذه الدالة.`;
  }

  match = /^If closeio is true,\s+then\s+([A-Za-z_]+)\s+will be closed(?:\s+(.+))?$/i.exec(raw);
  if (match) {
    return `إذا كانت closeio تساوي true فسيُغلق ${match[1]}${match[2] ? ` ${translateSdl3DocFragment(match[2])}` : ''}.`;
  }

  match = /^Calling this function frees the animation\s+(decoder|encoder|stream),\s+and returns the final status of the\s+(decoding|encoding)\s+process\.?$/i.exec(raw);
  if (match) {
    const targetMap = {
      decoder: 'مفكك الرسوم المتحركة',
      encoder: 'مشفر الرسوم المتحركة',
      stream: 'مجرى الرسوم المتحركة'
    };
    return `استدعاء هذه الدالة يحرر ${targetMap[String(match[1] || '').toLowerCase()] || 'مورد الرسوم المتحركة'} ثم يعيد الحالة النهائية لعملية ${String(match[2] || '').toLowerCase() === 'decoding' ? 'فك الترميز' : 'الترميز'}.`;
  }

  match = /^When done with the returned\s+(surface|texture|animation),\s+the app should dispose of it with a call to\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    const objectMap = {
      surface: 'السطح المعاد',
      texture: 'الخامة المعادة',
      animation: 'الرسوم المتحركة المعادة'
    };
    return `عند الانتهاء من ${objectMap[String(match[1] || '').toLowerCase()] || 'المورد المعاد'} يجب على التطبيق تحريره باستدعاء ${match[2]}().`;
  }

  match = /^The provided\s+([A-Za-z_]+)\s+pointer is not valid once this call returns\.?$/i.exec(raw);
  if (match) {
    return `المؤشر ${match[1]} الذي مررته لا يبقى صالحًا بعد عودة هذا الاستدعاء.`;
  }

  match = /^the file to\s+(load|save),\s+if an SDL_IOStream isn't being used\.\s+This is required if\s+([A-Z0-9_]+)\s+isn't set\.?$/i.exec(raw);
  if (match) {
    return `الملف الذي سي${String(match[1] || '').toLowerCase() === 'load' ? 'ُحمَّل' : 'ُحفَظ'} إذا لم يكن SDL_IOStream مستخدمًا. ويصبح هذا الحقل مطلوبًا إذا لم تُضبط ${match[2]}.`;
  }

  match = /^an SDL_IOStream containing a series of images\.\s+This should not be closed until the animation decoder is closed\.\s+This is required if\s+([A-Z0-9_]+)\s+isn't set\.?$/i.exec(raw);
  if (match) {
    return `SDL_IOStream يحتوي سلسلة من الصور. لا يجوز إغلاقه حتى يُغلق مفكك الرسوم المتحركة. ويصبح هذا الحقل مطلوبًا إذا لم تُضبط ${match[1]}.`;
  }

  match = /^an SDL_IOStream that will be used to save the stream\.\s+This should not be closed until the animation\s+(encoder|stream)\s+is closed\.\s+This is required if\s+([A-Z0-9_]+)\s+isn't set\.?$/i.exec(raw);
  if (match) {
    return `SDL_IOStream سيُستخدم لحفظ المجرى. لا يجوز إغلاقه حتى يُغلق ${String(match[1] || '').toLowerCase() === 'encoder' ? 'مشفر الرسوم المتحركة' : 'مجرى الرسوم المتحركة'}. ويصبح هذا الحقل مطلوبًا إذا لم تُضبط ${match[2]}.`;
  }

  match = /^true if closing the animation\s+(decoder|encoder|stream)\s+should also close the associated SDL_IOStream\.?$/i.exec(raw);
  if (match) {
    return `اجعل القيمة true إذا كان إغلاق ${String(match[1] || '').toLowerCase() === 'decoder' ? 'مفكك الرسوم المتحركة' : String(match[1] || '').toLowerCase() === 'encoder' ? 'مشفر الرسوم المتحركة' : 'مجرى الرسوم المتحركة'} يجب أن يؤدي أيضًا إلى إغلاق SDL_IOStream المرتبط.`;
  }

  match = /^the\s+(input|output)\s+file type,\s+e\.g\.\s+"([^"]+)",\s+defaults to the file extension if\s+([A-Z0-9_]+)\s+is set\.?$/i.exec(raw);
  if (match) {
    return `نوع ملف ${String(match[1] || '').toLowerCase() === 'input' ? 'الإدخال' : 'الإخراج'}، مثل "${match[2]}". ويُشتق افتراضيًا من امتداد الملف إذا كانت ${match[3]} مضبوطة.`;
  }

  match = /^the compression quality,\s+in the range of\s+0\s+to\s+100\.\s+The higher the number,\s+the higher the quality and file size\.\s+This defaults to a balanced value for compression and quality\.?$/i.exec(raw);
  if (match) {
    return 'جودة الضغط ضمن المجال من 0 إلى 100. وكلما ارتفع الرقم ارتفعت الجودة وازداد حجم الملف. والقيمة الافتراضية مضبوطة على توازن بين الضغط والجودة.';
  }

  match = /^the\s+(numerator|denominator)\s+of the fraction used to multiply the pts to convert it to seconds\.\s+This defaults to\s+([0-9]+)\.?$/i.exec(raw);
  if (match) {
    return `${String(match[1] || '').toLowerCase() === 'numerator' ? 'بسط' : 'مقام'} الكسر الذي يُستخدم لضرب القيمة pts لتحويلها إلى ثوانٍ. والقيمة الافتراضية هنا هي ${match[2]}.`;
  }

  match = /^The returned surface should be freed with\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `السطح المعاد يصبح مملوكًا للمستدعي ويجب تحريره بواسطة ${match[1]}().`;
  }

  match = /^The returned surface should be freed\.?$/i.exec(raw);
  if (match) {
    return 'السطح المعاد يصبح مملوكًا للمستدعي ويجب تحريره بعد الانتهاء منه.';
  }

  match = /^The returned pointer should be freed with\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `المؤشر المعاد يصبح مملوكًا للمستدعي ويجب تحريره بواسطة ${match[1]}().`;
  }

  match = /^The returned string is owned by the caller,\s+and should be passed to\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `السلسلة النصية المعادة تصبح مملوكة للمستدعي، ويجب تمريرها إلى ${match[1]}() لتحريرها.`;
  }

  match = /^The returned pointer is const memory owned by\s+([A-Za-z0-9_]+); do not free it\.?$/i.exec(raw);
  if (match) {
    return `المؤشر المعاد يشير إلى ذاكرة ثابتة تملكها ${match[1]} داخليًا، لذلك لا يجوز تحريره يدويًا.`;
  }

  match = /^There is no distinction made between\s+(.+?)\s+and\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    if (/not the filetype in question/i.test(match[1]) && /basic i\/o errors/i.test(match[2])) {
      return 'لا تميز هذه الدالة بين حالة أن الملف ليس من النوع المطلوب وبين أخطاء الإدخال/الإخراج الأساسية.';
    }
    return `لا يوجد فرق في هذا السياق بين ${translateSdl3DocFragment(match[1])} و${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^This function attempts to determine if a file is a given filetype,\s+reading the least amount possible from the SDL_IOStream\s+\(usually a few bytes\)\.?$/i.exec(raw);
  if (match) {
    return 'تحاول هذه الدالة التحقق من أن الملف من النوع المطلوب، مع قراءة أقل قدر ممكن من البيانات من SDL_IOStream، وغالبًا لا يتجاوز ذلك بضعة بايتات.';
  }

  match = /^This function attempts to determine if a file is a given filetype,\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تحاول هذه الدالة تحديد ما إذا كان الملف من النوع المطلوب، ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function will always attempt to seek src back to where it started when this function was called,\s+but it will not report any errors in doing so,\s+but assuming seeking works,\s+this means you can immediately use this with a different\s+([A-Za-z0-9_]+)\s+function,\s+or load the image without further seeking\.?$/i.exec(raw);
  if (match) {
    return `تحاول هذه الدالة دائمًا إعادة موضع src إلى النقطة التي بدأ منها عند استدعائها، لكنها لا تبلغ عن أي أخطاء تحدث أثناء ذلك. وإذا نجحت إعادة التموضع فيمكنك استخدام المجرى مباشرة مع دالة ${match[1]} أخرى، أو تحميل الصورة دون أي إعادة تموضع إضافية.`;
  }

  match = /^This function will always attempt to seek src back to\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تحاول هذه الدالة دائمًا إعادة موضع src إلى ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^You do not need to call this function to load data;\s+([A-Za-z0-9_]+)\s+can work to determine file type in many cases in its standard load functions\.?$/i.exec(raw);
  if (match) {
    return `لا تحتاج إلى استدعاء هذه الدالة لتحميل البيانات، لأن ${match[1]} يستطيع في كثير من الحالات تحديد نوع الملف داخل دوال التحميل القياسية الخاصة به.`;
  }

  match = /^You do not need to call this function to load data;\s+([A-Za-z0-9_]+)\s+can\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `لا تحتاج إلى استدعاء هذه الدالة لتحميل البيانات، لأن ${match[1]} يستطيع ${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^This function decodes the next frame in the animation decoder,\s+returning it as an SDL_Surface\.\s+The returned surface should be freed with\s+([A-Za-z0-9_]+)\s*\(\)\s+when no longer needed\.?$/i.exec(raw);
  if (match) {
    return `تفك هذه الدالة الإطار التالي داخل مفكك الرسوم المتحركة وتعيده على شكل SDL_Surface. ويجب تحرير السطح المعاد بواسطة ${match[1]}() عند عدم الحاجة إليه.`;
  }

  match = /^This function decodes the next frame in the animation decoder,\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تفك هذه الدالة الإطار التالي داخل مفكك الرسوم المتحركة، ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^If the animation decoder has no more frames or an error occurred while decoding the frame,\s+this function returns false\.\s+In that case,\s+please call\s+([A-Za-z0-9_]+)\s*\(\)\s+for more information\.\s+If\s+\1\(\)\s+returns an empty string,\s+that means there are no more available frames\.\s+If\s+\1\(\)\s+returns a valid string,\s+that means the decoding failed\.?$/i.exec(raw);
  if (match) {
    return `إذا لم يبق في مفكك الرسوم المتحركة أي إطارات إضافية، أو وقع خطأ أثناء فك الإطار، فستعيد هذه الدالة القيمة false. عندها استدعِ ${match[1]}() لمعرفة السبب. فإذا أعادت سلسلة فارغة فهذا يعني عدم وجود إطارات أخرى متاحة، وإذا أعادت سلسلة صالحة فهذا يعني أن فك الترميز قد فشل.`;
  }

  match = /^If the animation decoder has no more frames,\s+this function returns NULL and only sets the error if the decoding has failed\.?$/i.exec(raw);
  if (match) {
    return 'إذا لم يبق في مفكك الرسوم المتحركة أي إطارات إضافية فستعيد هذه الدالة القيمة NULL، ولا تضبط الخطأ إلا إذا كان فشل فك الترميز هو السبب الفعلي.';
  }

  match = /^This function returns the properties of the animation decoder,\s+such as the number of frames and loop count\.?$/i.exec(raw);
  if (match) {
    return 'تعيد هذه الدالة خصائص مفكك الرسوم المتحركة، مثل عدد الإطارات وعدد مرات التكرار.';
  }

  match = /^This function returns the properties of the animation decoder,\s+such as\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تعيد هذه الدالة خصائص مفكك الرسوم المتحركة، مثل ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function returns the properties of the animation decoder,\s+which holds information about the underlying image such as description,\s+copyright text and loop count\.?$/i.exec(raw);
  if (match) {
    return 'تعيد هذه الدالة خصائص مفكك الرسوم المتحركة، وهي تحمل معلومات عن الصورة الأساسية مثل الوصف ونص حقوق النشر وعدد مرات التكرار.';
  }

  match = /^This function returns the properties of the animation decoder,\s+which\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تعيد هذه الدالة خصائص مفكك الرسوم المتحركة، والتي ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function converts a presentation timestamp from the decoder's\s+(.+?)\s+to milliseconds\.?$/i.exec(raw);
  if (match) {
    return `تحول هذه الدالة ختم العرض الزمني من ${translateSdl3DocFragment(match[1])} الخاص بمفكك الترميز إلى مللي ثانية.`;
  }

  match = /^This function loads data from a path on the filesystem\.\s+There is also a\s+([A-Za-z0-9_]+)\s+function for loading from an SDL_IOStream\.?$/i.exec(raw);
  if (match) {
    return `تحمل هذه الدالة البيانات من مسار في نظام الملفات. وإذا كنت تقرأ من SDL_IOStream فالدالة المكافئة هي ${match[1]}.`;
  }

  match = /^This function loads data from an SDL_IOStream\.\s+There is also a\s+([A-Za-z0-9_]+)\s+function for loading from a file path\.?$/i.exec(raw);
  if (match) {
    return `تحمل هذه الدالة البيانات من SDL_IOStream. وإذا كنت تقرأ من مسار ملف مباشر فالدالة المكافئة هي ${match[1]}.`;
  }

  match = /^This function will allocate the buffer to contain the file\.\s+It must be freed with\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `تخصص هذه الدالة مخزنًا يحتوي الملف بالكامل، ويجب تحرير هذا المخزن بواسطة ${match[1]}().`;
  }

  match = /^This function returns NULL on error,\s+including when\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `تعيد هذه الدالة NULL عند الخطأ، بما في ذلك عندما ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This function returns the current version,\s+while\s+([A-Za-z0-9_]+)\s+is the version you compiled against\.?$/i.exec(raw);
  if (match) {
    return `تعيد هذه الدالة الإصدار الحالي وقت التشغيل، بينما ${match[1]} يمثل الإصدار الذي بُني عليه البرنامج أثناء الترجمة.`;
  }

  match = /^This information is also available via the\s+([A-Z0-9_]+)\s+property,\s+but it'?s common enough to provide a simple accessor function\.?$/i.exec(raw);
  if (match) {
    return `هذه المعلومة متاحة أيضًا عبر الخاصية ${match[1]}، لكنها شائعة بما يكفي لتوفير دالة وصول مباشرة لها.`;
  }

  match = /^This reports the length of the data in sample frames\s*,\s*so sample-perfect mixing can be possible\.\s*Sample frames are only meaningful as a measure of time if the sample rate\s*\(\s*frequency\s*\)\s+is also known\.\s*To convert from sample frames to milliseconds,\s+use\s+([A-Za-z0-9_]+)\s*\(\s*\)\.?$/i.exec(raw);
  if (match) {
    return `تعرض هذه الملاحظة طول البيانات بوحدة إطارات العينات، وهذا يسمح بمزج دقيق على مستوى العينة. لكن إطارات العينات لا تصبح مقياسًا زمنيًا مفيدًا إلا إذا كان معدل العينات (التردد) معروفًا أيضًا. ولتحويل إطارات العينات إلى مللي ثانية استخدم ${match[1]}().`;
  }

  match = /^Not all audio file formats can report the complete length of the data they will produce through decoding:\s+some can't calculate it,\s+some might produce infinite audio\.?$/i.exec(raw);
  if (match) {
    return 'ليست كل صيغ الملفات الصوتية قادرة على الإبلاغ عن الطول الكامل للبيانات التي ستنتجها أثناء فك الترميز؛ فبعضها لا يستطيع حسابه أصلًا، وبعضها قد ينتج صوتًا لا نهائيًا.';
  }

  match = /^Also,\s+some file formats can only report duration as a unit of time,\s+which means SDL_mixer might have to estimate sample frames from that information\.\s+With less precision,\s+the reported duration might be off by a few sample frames in either direction\.?$/i.exec(raw);
  if (match) {
    return 'وبعض صيغ الملفات لا تستطيع الإبلاغ عن المدة إلا كوحدة زمنية، لذلك قد يضطر SDL_mixer إلى تقدير عدد إطارات العينات انطلاقًا من تلك المعلومة. وبسبب انخفاض الدقة قد تنحرف المدة المبلَّغ عنها بعدة إطارات عينات زيادةً أو نقصانًا.';
  }

  match = /^This will return a value >= 0 if a duration is known\.\s*It might also return\s+([A-Z0-9_]+)\s+or\s+([A-Z0-9_]+)\s*\.?$/i.exec(raw);
  if (match) {
    return `ستعيد هذه الدالة قيمة أكبر من أو تساوي 0 إذا كانت المدة معروفة. وقد تعيد أيضًا ${match[1]} إذا كانت المدة غير معروفة، أو ${match[2]} إذا كان الصوت غير محدود.`;
  }

  match = /^The returned value is a thread-local string which will remain valid\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `القيمة المعادة عبارة عن سلسلة نصية محلية للخيط وتبقى صالحة ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^The returned value follows the same rules as SDL_snprintf\(\):\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `القيمة المعادة تتبع نفس قواعد SDL_snprintf(): ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^The returned path is guaranteed to end with a path separator/i.exec(raw);
  if (match) {
    return 'المسار المعاد مضمون أن ينتهي بفاصل مسار مناسب للنظام.';
  }

  if (/^The returned /i.test(raw)) {
    return `القيمة المعادة ${translateSdl3DocFragment(raw.replace(/^The returned\s+/i, ''))}.`;
  }

  if (/^This function /i.test(raw)) {
    return '';
  }

  return '';
}

function buildSdl3StrictArabicRemarkFallback(text, item = null) {
  const raw = normalizeSdl3DocValue(text);
  if (!raw) {
    return '';
  }

  let match = /^([A-Z0-9_]+)\s*:\s*(.+)$/.exec(raw);
  if (match) {
    const detail = buildSdl3StrictArabicRemarkFallback(match[2], item) || buildSdl3RemarkFallback(match[2], item);
    return `${match[1]}: ${detail || 'هذه خاصية رسمية مرتبطة بهذا الاستدعاء.'}`;
  }

  if (/^[A-Z]{2,}[A-Z0-9_]*$/.test(raw) || /^"[A-Za-z0-9_.-]+"$/.test(raw)) {
    return raw;
  }

  match = /^The variable can be set to the following values:?$/i.exec(raw);
  if (match) {
    return 'يمكن ضبط هذا المتغير على القيم التالية:';
  }

  match = /^This hint can be set anytime\.?$/i.exec(raw);
  if (match) {
    return 'يمكن ضبط هذه التلميحة في أي وقت.';
  }

  match = /^This hint should be set before\s+(.+?)\s+is initialized\.?$/i.exec(raw);
  if (match) {
    return `يجب ضبط هذه التلميحة قبل تهيئة ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This hint should be set before SDL audio is initialized\.?$/i.exec(raw);
  if (match) {
    return 'يجب ضبط هذه التلميحة قبل تهيئة نظام الصوت في SDL.';
  }

  match = /^This hint should be set before initializing joysticks and gamepads\.?$/i.exec(raw);
  if (match) {
    return 'يجب ضبط هذه التلميحة قبل تهيئة عصي التحكم وأذرع اللعب.';
  }

  match = /^This hint should be set before an audio device is opened\.?$/i.exec(raw);
  if (match) {
    return 'يجب ضبط هذه التلميحة قبل فتح جهاز صوت.';
  }

  match = /^This hint should be set before creating a\s+(window|renderer)\.?$/i.exec(raw);
  if (match) {
    return `يجب ضبط هذه التلميحة قبل إنشاء ${String(match[1] || '').toLowerCase() === 'window' ? 'نافذة' : 'مصير رسم'}.`;
  }

  match = /^This hint should be set before calling\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `يجب ضبط هذه التلميحة قبل استدعاء ${match[1]}().`;
  }

  match = /^The default is the value of\s+([A-Za-z0-9_]+)\s*\.?$/i.exec(raw);
  if (match) {
    return `القيمة الافتراضية هي قيمة ${match[1]}.`;
  }

  match = /^Range:\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `النطاق: ${match[1].trim().replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s+integer\b/gi, '$1 عدد صحيح')}`;
  }

  match = /^Domain:\s*(.+?)\.?$/i.exec(raw);
  if (match) {
    return `المجال: ${match[1].trim().replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s+integer\b/gi, '$1 عدد صحيح')}`;
  }

  match = /^"([^"]+)"\s*:\s*([A-Za-z0-9_ -]+?)\s+driver is not used\.?$/i.exec(raw);
  if (match) {
    return `"${match[1]}": يؤدي هذا الخيار إلى تعطيل استخدام برنامج التشغيل ${match[2].trim()}.`;
  }

  match = /^"([^"]+)"\s*:\s*([A-Za-z0-9_ -]+?)\s+driver is used\.?$/i.exec(raw);
  if (match) {
    return `"${match[1]}": يؤدي هذا الخيار إلى تفعيل استخدام برنامج التشغيل ${match[2].trim()}.`;
  }

  match = /^This function may use a different approximation across different versions,\s+platforms and configurations\.\s*i\.e,\s*it can return a different value given the same input on different machines or operating systems,\s+or if\s+([A-Za-z0-9_]+)\s+is updated\.?$/i.exec(raw);
  if (match) {
    return `قد تستخدم هذه الدالة طريقة تقريب مختلفة باختلاف الإصدارات والمنصات والإعدادات. لذلك قد تعيد قيمة مختلفة للمدخل نفسه على أجهزة أو أنظمة تشغيل مختلفة، أو بعد تحديث ${match[1]}.`;
  }

  match = /^If you know you definitely have a\s+([A-Za-z0-9_]+)\s+image,\s+you can call this function,\s+which will skip\s+([A-Za-z0-9_' -]+)\s+file format detection routines\.\s+Generally it's better to use the abstract interfaces;\s+also,\s+there is only an\s+([A-Za-z0-9_]+)\s+interface available here\.?$/i.exec(raw);
  if (match) {
    return `إذا كنت متأكدًا من أن الصورة من النوع ${match[1]} فيمكنك استدعاء هذه الدالة لتجاوز روتينات كشف التنسيق الخاصة بـ ${match[2].trim()}. ومع ذلك فالأفضل عادة استخدام الواجهات المجردة، كما أن الواجهة المتاحة هنا تقتصر على ${match[3]}.`;
  }

  match = /^If the file already exists,\s+it will be overwritten\.?$/i.exec(raw);
  if (match) {
    return 'إذا كان الملف موجودًا مسبقًا فسيُستبدل محتواه.';
  }

  match = /^Use it like this:?$/i.exec(raw);
  if (match) {
    return 'استخدمه بالشكل التالي:';
  }

  match = /^The following read-only properties are provided by\s+([A-Za-z0-9_]+):?$/i.exec(raw);
  if (match) {
    return `يوفر ${match[1]} الخصائص التالية للقراءة فقط:`;
  }

  match = /^This updates any\s+([A-Za-z0-9_]+)\s+objects using this font(?:,\s+and clears already-generated glyphs,\s+if any,\s+from the cache)?\.?$/i.exec(raw);
  if (match) {
    return `يؤدي هذا إلى تحديث جميع كائنات ${match[1]} التي تستخدم هذا الخط${/cache/i.test(raw) ? '، كما يمسح المحارف المولدة مسبقًا من الذاكرة المخبئية عند وجودها' : ''}.`;
  }

  match = /^This function may cause the internal text representation to be rebuilt\.?$/i.exec(raw);
  if (match) {
    return 'قد يؤدي هذا الاستدعاء إلى إعادة بناء التمثيل النصي الداخلي.';
  }

  match = /^Please see\s+(https?:\/\/\S+)\.?$/i.exec(raw);
  if (match) {
    return `راجع الرابط الرسمي التالي للتفاصيل: ${match[1]}`;
  }

  match = /^This always returns false on CPUs that aren't using Intel instruction sets\.?$/i.exec(raw);
  if (match) {
    return 'تعيد هذه الدالة القيمة false دائمًا على المعالجات التي لا تستخدم مجموعات تعليمات إنتل.';
  }

  match = /^Be sure your shader is set up according to the requirements documented in\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `تأكد من إعداد المظلّل وفق المتطلبات الموثقة في ${match[1]}().`;
  }

  match = /^This value can be changed at any time to adjust the future mix\.?$/i.exec(raw);
  if (match) {
    return 'يمكن تغيير هذه القيمة في أي وقت لضبط المزج اللاحق.';
  }

  match = /^The returned string is owned by the caller,\s+and should be passed to\s+([A-Za-z0-9_]+)\s+when no longer needed\.?$/i.exec(raw);
  if (match) {
    return `السلسلة النصية المعادة تصبح مملوكة للمستدعي ويجب تمريرها إلى ${match[1]} عند عدم الحاجة إليها.`;
  }

  match = /^Note:\s+If you don't know what this function is for,\s+you shouldn't use it!?$/i.exec(raw);
  if (match) {
    return 'ملاحظة: إذا لم تكن تعرف الغرض من هذه الدالة فلا تستخدمها.';
  }

  match = /^Opaque data!?$/i.exec(raw);
  if (match) {
    return 'هذا النوع معتم ولا يكشف SDL تفاصيله الداخلية، لذلك تتعامل معه عبر الدوال المرتبطة به فقط.';
  }

  match = /^This callback is fired when\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `يُستدعى رد النداء هذا عندما ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^This callback will not fire when\s+(.+?)\.?$/i.exec(raw);
  if (match) {
    return `لن يُستدعى رد النداء هذا عندما ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^The audio data passed through here is not const data;\s*the app is permitted to change it in any way it likes,\s*and those changes will\s+(propagate through the mixing pipeline|replace the final mixer pipeline output)\.?$/i.exec(raw);
  if (match) {
    return `البيانات الصوتية الممررة هنا ليست ثابتة، لذلك يمكن للتطبيق تعديل محتوى المخزن مباشرة. وأي تعديل تجريه ${/replace/i.test(match[1]) ? 'يستبدل خرج المزج النهائي نفسه' : 'ينتشر خلال مراحل خط المزج التالية'}.`;
  }

  match = /^An audiospec is provided\..*spec->format will always be\s+([A-Z0-9_]+)\s+and pcm hardcoded to be a float pointer\.?$/i.exec(raw);
  if (match) {
    return `تُمرَّر أيضًا بنية مواصفات صوتية مع هذا الرد. وحتى لو اختلفت صيغ الإدخال أو الخرج، فإن SDL_mixer يسلّم البيانات هنا بصيغة ${match[1]}، لذا يجب تفسير pcm كمصفوفة من قيم float.`;
  }

  match = /^samples is the number of float values pointed to by\s+pcm\s*:\s*samples,\s*not sample frames!.*$/i.exec(raw);
  if (match) {
    return 'القيمة samples تمثل عدد قيم float التي يشير إليها pcm، لا عدد إطارات العينات. كما أن هذا العدد قد يتغير بين استدعاء وآخر بحسب حالة خط المزج والتحميل الجاري.';
  }

  match = /^These are used by\s+([A-Za-z0-9_]+)\s*\.\s*This mechanism operates behind the scenes for apps using the optional main callbacks\.\s*Apps that want to use this should just implement\s+([A-Za-z0-9_]+)\s+directly\.?$/i.exec(raw);
  if (match) {
    return `يُستخدم هذا النوع داخليًا مع ${match[1]} لتفعيل نظام main callbacks الاختياري. وعند اعتماد هذا المسار يكفي أن تنفذ الدالة ${match[2]} بالتوقيع المطابق ثم تترك SDL تتولى الربط والاستدعاء.`;
  }

  match = /^Zero is used to signify an invalid\/null device\.?$/i.exec(raw);
  if (match) {
    return 'القيمة 0 هنا تدل على جهاز غير صالح أو على عدم وجود جهاز فعلي مرتبط بهذا المعرّف.';
  }

  match = /^The value 0 is an invalid ID\.?$/i.exec(raw);
  if (match) {
    return 'القيمة 0 تمثل معرّفًا غير صالح ولا تشير إلى مورد فعلي يمكن استخدامه.';
  }

  match = /^If the device is disconnected and reconnected,\s*it will get a new ID\.?$/i.exec(raw);
  if (match) {
    return 'إذا انفصل الجهاز ثم أُعيد وصله فسيحصل على معرّف جديد، لذلك لا يجوز افتراض بقاء الـ ID القديم صالحًا بعد إعادة التوصيل.';
  }

  match = /^This operates as an opaque handle\.\s*One can then request read or write operations on it\.?$/i.exec(raw);
  if (match) {
    return 'يعمل هذا النوع كمقبض معتم تديره SDL داخليًا. بعد الحصول عليه يمكنك طلب عمليات القراءة أو الكتابة عبر الدوال الرسمية التي تستقبل هذا المقبض.';
  }

  match = /^A buffer must have at least one usage flag\.\s*Note that some usage flag combinations are invalid\.?$/i.exec(raw);
  if (match) {
    return 'يجب أن يحمل هذا المخزن راية استخدام واحدة على الأقل، كما أن بعض تراكيب رايات الاستخدام غير صالحة ولا يجوز جمعها معًا.';
  }

  match = /^A texture must have at least one usage flag\.\s*Note that some usage flag combinations are invalid\.?$/i.exec(raw);
  if (match) {
    return 'يجب أن تحمل هذه الخامة راية استخدام واحدة على الأقل، كما أن بعض تراكيب رايات الاستخدام غير صالحة لهذا المورد.';
  }

  match = /^Each format corresponds to a specific backend that accepts it\.?$/i.exec(raw);
  if (match) {
    return 'كل تنسيق من هذه التنسيقات يرتبط بخلفية تنفيذ محددة هي التي تستطيع استقباله والتعامل معه فعليًا.';
  }

  match = /^Additional values may be obtained from\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(raw);
  if (match) {
    return `يمكن إنشاء قيم إضافية لهذا السياق عبر ${match[1]}() عندما لا تكفي القيم الجاهزة المعرفة مسبقًا.`;
  }

  const direct = buildSdl3RemarkFallback(raw, item);
  if (direct && !hasResidualSdl3EnglishProse(direct)) {
    return direct;
  }

  return 'هذه ملاحظة تشغيلية رسمية مرتبطة بهذا العنصر، وتوضح قيدًا أو سلوكًا خاصًا كما في الرموز المذكورة.';
}

function translateSdl3DocText(text, item = null, options = {}) {
  const value = normalizeSdl3DocValue(text);

  if (!value) {
    return '';
  }

  const exactMap = {
    'An entry for filters for file dialogs.': 'عنصر يصف مرشحًا واحدًا يُستخدم داخل حوارات اختيار الملفات.',
    'Add a fallback font.': 'يضيف خطًا احتياطيًا (fallback font) إلى خط موجود.',
    'Create a MIX_Audio that generates a sinewave.': 'ينشئ موردًا صوتيًا من النوع MIX_Audio يولد موجة جيبية (Sine Wave).',
    'Get the implementation dependent name of a sensor.': 'يجلب الاسم الذي تعيده المنصة أو برنامج التشغيل لهذا الحساس.',
    'Get the type of a sensor.': 'يجلب النوع العام للحساس كما تصنفه SDL.',
    'Get the platform dependent type of a sensor.': 'يجلب النوع المنصي الخام لهذا الحساس كما يعرّفه النظام.',
    'These are the supported properties:': 'الخصائص التالية مدعومة لهذا الاستدعاء:',
    'These animation types are currently supported:': 'صيغ الرسوم المتحركة المدعومة حاليًا:',
    'Note that each platform may or may not support any of the properties.': 'قد تختلف المنصات في دعم هذه الخصائص، لذلك لا تفترض أن جميعها متاح على كل نظام.',
    'This function should be called only from the main thread. The callback may be invoked from the same thread or from a different one, depending on the OS\'s constraints.': 'يجب استدعاء هذه الدالة من الخيط الرئيسي فقط. أما رد النداء فقد يُستدعى من الخيط نفسه أو من خيط مختلف بحسب قيود نظام التشغيل.',
    'Returns true to let event continue on, false to drop it.': 'تعيد true للسماح للحدث بمتابعة المعالجة، وتعطي false لإسقاطه ومنع تمريره للمراحل التالية.',
    'This may only be called (by SDL) from the thread handling the X11 event loop.': 'لا يجوز أن تستدعي SDL هذا الرد إلا من الخيط الذي يدير حلقة أحداث X11.',
    'This callback may modify the event, and should return true if the event should continue to be processed, or false to prevent further processing.': 'يمكن لهذا الرد تعديل الحدث نفسه، ويجب أن يعيد true إذا كان ينبغي أن تستمر معالجته، أو false لمنع أي معالجة لاحقة له.',
    'As this is processing an event directly from the X11 event loop, this callback should do the minimum required work and return quickly.': 'بما أن هذا الرد يعالج حدثًا مباشرًا قادمًا من حلقة أحداث X11، فيجب أن ينفذ أقل قدر ممكن من العمل ثم يعود بسرعة.',
    'This function should be called on the thread that created both fonts.': 'يجب استدعاء هذه الدالة من نفس الخيط الذي أنشأ الخطين.',
    'Add a font that will be used for glyphs that are not in the current font. The fallback font should have the same size and style as the current font.': 'يضيف خطًا احتياطيًا يُستخدم للمحارف المرسومة غير الموجودة في الخط الحالي. ويجب أن يكون الخط الاحتياطي بنفس حجم الخط الحالي ونمطه.',
    'If there are multiple fallback fonts, they are used in the order added.': 'عند وجود عدة خطوط احتياطية، يتم استخدامها وفق ترتيب إضافتها.',
    'This updates any TTF_Text objects using this font.': 'يؤدي هذا إلى تحديث جميع كائنات TTF_Text التي تستخدم هذا الخط.',
    'This copy operation uses an image rather than a glyph, and should not have vertex color applied': 'تستخدم عملية النسخ هذه صورة بدل محرف مرسوم، ولا يجوز تطبيق لون الرؤوس عليها.',
    'This copy operation uses an image rather than a glyph, and should not have vertex color applied.': 'تستخدم عملية النسخ هذه صورة بدل محرف مرسوم، ولا يجوز تطبيق لون الرؤوس عليها.',
    'the sensor instance ID.': 'معرّف الحساس الذي تريد الاستعلام عنه داخل قائمة الحساسات التي اكتشفتها SDL.',
    'the font to modify.': 'الخط الذي سيتم تعديله بإضافة أو تحديث سلسلة الخطوط الاحتياطية التابعة له.',
    'the font to add as a fallback.': 'الخط الذي سيتم إضافته كخط احتياطي (fallback font) ليُستخدم عند غياب المحرف من الخط الأساسي.',
    'a mixer this audio is intended to be used with. May be NULL.': 'المِكسر الذي صُمم هذا المورد الصوتي ليعمل معه. ويمكن أن تكون القيمة NULL إذا لم تكن تريد ربطه بمِكسر محدد.',
    "the sinewave's frequency in Hz.": 'التردد الذي ستولد به الموجة الجيبية، بوحدة هرتز.',
    "the sinewave's amplitude from 0.0f to 1.0f.": 'سعة الموجة الجيبية من 0.0f إلى 1.0f، وهي التي تحدد شدة الصوت الناتج.',
    'the maximum number of milliseconds of audio to generate, or less than zero to generate infinite audio.': 'أقصى مدة صوتية ستولدها الدالة بالمللي ثانية، أو قيمة أقل من الصفر إذا كنت تريد صوتًا مستمرًا بلا نهاية محددة.',
    'an audio object that can be used to make sound on a mixer, or NULL on failure; call SDL_GetError() for more information.': 'تعيد كائنًا صوتيًا يمكن تشغيله على مِكسر من النوع MIX_Mixer، أو NULL عند الفشل. عند الفشل استخدم SDL_GetError() لمعرفة السبب.',
    'the sensor name, or NULL if instance_id is not valid.': 'اسم الحساس، أو NULL إذا كان instance_id غير صالح.',
    'the SDL_SensorType, or SDL_SENSOR_INVALID if instance_id is not valid.': 'قيمة من SDL_SensorType، أو SDL_SENSOR_INVALID إذا كان instance_id غير صالح.',
    'the sensor platform dependent type, or -1 if instance_id is not valid.': 'النوع المنصي الخاص بالحساس، أو -1 إذا كان instance_id غير صالح.',
    'Opaque data!': 'هذا النوع لا يكشف حقوله علنًا، ويُستخدم كمقبض معتم تحتفظ SDL بتمثيله الداخلي.',
    'The specific usage is described in each function.': 'الاستخدام العملي لهذا العنصر يتحدد في كل دالة تستقبله أو تستدعيه على حدة.'
  };

  if (exactMap[value]) {
    return exactMap[value];
  }

  let match = /^An opaque object that represents\s+(?:an?\s+)?(.+?)\.?$/i.exec(value);
  if (match) {
    return `كائن معتم يمثل ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^An object representing\s+(?:an?\s+)?(.+?)\.?$/i.exec(value);
  if (match) {
    return `كائن يمثل ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^A callback that fires when\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `نوع رد نداء يُستدعى عندما ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Function pointer typedef for\s+([A-Za-z0-9_]+)\s*\.?$/i.exec(value);
  if (match) {
    return `اسم نوع لمؤشر دالة يطابق التوقيع المطلوب لـ ${match[1]}.`;
  }

  match = /^3D coordinates for\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(value);
  if (match) {
    return `إحداثيات ثلاثية الأبعاد تُمرَّر إلى ${match[1]}().`;
  }

  match = /^A set of per-channel gains for tracks using\s+([A-Za-z0-9_]+)\s*\(\)\.?$/i.exec(value);
  if (match) {
    return `مجموعة قيم كسب مستقلة لكل قناة للمسارات التي تستخدم ${match[1]}().`;
  }

  match = /^No more frames available\.?$/i.exec(value);
  if (match) {
    return 'لا توجد إطارات إضافية متاحة.';
  }

  match = /^The decoder failed to decode a frame,\s*call\s+([A-Za-z0-9_]+)\s*\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `فشل مفكك الترميز في فك إطار جديد، ويمكن استدعاء ${match[1]}() لمعرفة السبب.`;
  }

  match = /^The decoder is invalid\.?$/i.exec(value);
  if (match) {
    return 'مفكك الترميز غير صالح.';
  }

  match = /^The decoder is ready to decode the next frame\.?$/i.exec(value);
  if (match) {
    return 'مفكك الترميز جاهز لفك الإطار التالي.';
  }

  match = /^Value that requests that the app continue from the main callbacks\.?$/i.exec(value);
  if (match) {
    return 'قيمة تطلب من التطبيق متابعة التنفيذ داخل نظام main callbacks.';
  }

  match = /^Value that requests termination with\s+(success|error)\s+from the main callbacks\.?$/i.exec(value);
  if (match) {
    return `قيمة تطلب إنهاء التطبيق من مسار main callbacks مع حالة ${String(match[1] || '').toLowerCase() === 'success' ? 'نجاح' : 'فشل'}.`;
  }

  match = /^The internal structure containing font information\.?$/i.exec(value);
  if (match) {
    return 'البنية الداخلية التي تحتفظ بمعلومات الخط.';
  }

  match = /^Animated image support\.?$/i.exec(value);
  if (match) {
    return 'دعم الصور المتحركة.';
  }

  match = /^Add events to the back of the queue\.?$/i.exec(value);
  if (match) {
    return 'يطلب إضافة الأحداث إلى نهاية الطابور.';
  }

  match = /^Terminate the program\.?$/i.exec(value);
  if (match) {
    return 'يطلب إنهاء البرنامج.';
  }

  match = /^Ignore the assert from now on\.?$/i.exec(value);
  if (match) {
    return 'يطلب تجاهل assert الحالي من الآن فصاعدًا.';
  }

  match = /^Please refer to\s+([A-Za-z0-9_]+)\s+for details\.?$/i.exec(value);
  if (match) {
    return `ارجع إلى ${match[1]} لأن هذا العنصر تابع له والشرح الكامل موجود في صفحته المحلية.`;
  }

  match = /^Value of\s+([A-Za-z0-9_]+)\.?$/i.exec(value);
  if (match) {
    return `قيمة ثابتة مأخوذة من ${match[1]}.`;
  }

  match = /^This function is available since\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `هذه الدالة متاحة ابتداءً من ${match[1]}.`;
  }

  match = /^This (datatype|callback|macro|enumeration|enum|structure|struct|type) is available since\s+(.+?)\.?$/i.exec(value);
  if (match) {
    const kindMap = {
      datatype: 'هذا النوع البياني',
      callback: 'هذا الرد الندائي',
      macro: 'هذا الماكرو',
      enumeration: 'هذا التعداد',
      enum: 'هذا التعداد',
      structure: 'هذه البنية',
      struct: 'هذه البنية',
      type: 'هذا النوع'
    };
    return `${kindMap[String(match[1] || '').toLowerCase()] || 'هذا العنصر'} متاح ابتداءً من ${match[2]}.`;
  }

  match = /^Calling this function frees the\s+(.+?),\s+and returns the final status of the\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `استدعاء هذه الدالة يحرر ${match[1]} ثم يعيد الحالة النهائية لعملية ${match[2]}.`;
  }

  match = /^Get the length of a\s+([A-Za-z0-9_ *]+?)\s*'s playback in sample frames\.?$/i.exec(value);
  if (match) {
    return `يجلب طول ${translateSdl3DocFragment(match[1])} أثناء التشغيل بوحدة إطارات العينات.`;
  }

  match = /^Query the initial audio format of a\s+([A-Za-z0-9_ *]+?)\s*\.?$/i.exec(value);
  if (match) {
    return `يستعلم عن تنسيق الصوت الابتدائي لـ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Get the properties associated with a(?:n)?\s+([A-Za-z0-9_ *]+?)\s*\.?$/i.exec(value);
  if (match) {
    return `يجلب وعاء الخصائص المرتبط بـ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Get the\s+([A-Za-z0-9_ *]+?)\s+that owns a\s+([A-Za-z0-9_ *]+?)\s*\.?$/i.exec(value);
  if (match) {
    return `يجلب ${translateSdl3DocFragment(match[1])} المالك لـ ${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^Get a mixer's master frequency ratio\.?$/i.exec(value);
  if (match) {
    return 'يجلب نسبة التردد الرئيسية الحالية للمِكسر.';
  }

  match = /^Get a mixer's master gain control\.?$/i.exec(value);
  if (match) {
    return 'يجلب قيمة الكسب الرئيسية الحالية للمِكسر.';
  }

  match = /^Get the audio format a mixer is generating\.?$/i.exec(value);
  if (match) {
    return 'يجلب تنسيق الصوت الذي يولده المِكسر حاليًا.';
  }

  match = /^Get all tracks with a specific tag\.?$/i.exec(value);
  if (match) {
    return 'يجلب جميع المسارات المرتبطة بوسم نصي محدد.';
  }

  match = /^Get a track's current position in 3D space\.?$/i.exec(value);
  if (match) {
    return 'يجلب الموضع الحالي للمسار داخل الفضاء ثلاثي الأبعاد.';
  }

  match = /^Query the\s+([A-Za-z0-9_ *]+?)\s+assigned to a track\.?$/i.exec(value);
  if (match) {
    return `يستعلم عن ${translateSdl3DocFragment(match[1])} المرتبط حاليًا بالمسار.`;
  }

  match = /^Query whether a given track is fading\.?$/i.exec(value);
  if (match) {
    return 'يستعلم عما إذا كان المسار يمر حاليًا بعملية تلاشي صوتي.';
  }

  match = /^Query how many loops remain for a given track\.?$/i.exec(value);
  if (match) {
    return 'يستعلم عن عدد مرات التكرار المتبقية للمسار.';
  }

  match = /^Get a track's gain control\.?$/i.exec(value);
  if (match) {
    return 'يجلب قيمة الكسب الحالية للمسار.';
  }

  match = /^Query the frequency ratio of a track\.?$/i.exec(value);
  if (match) {
    return 'يستعلم عن نسبة التردد الحالية للمسار.';
  }

  match = /^Get the current input position of a playing track\.?$/i.exec(value);
  if (match) {
    return 'يجلب موضع القراءة الحالي للمسار أثناء التشغيل.';
  }

  match = /^Return the number of sample frames remaining to be mixed in a track\.?$/i.exec(value);
  if (match) {
    return 'يعيد عدد إطارات العينات المتبقية التي لم تُمزج بعد داخل المسار.';
  }

  match = /^Get the tags currently associated with a track\.?$/i.exec(value);
  if (match) {
    return 'يجلب الأوسمة المرتبطة حاليًا بالمسار.';
  }

  match = /^Report the name of a specific audio decoders?\.?$/i.exec(value);
  if (match) {
    return 'يعيد اسم مفكك ترميز صوتي محدد بحسب فهرسه.';
  }

  match = /^Report the number of audio decoders available for use\.?$/i.exec(value);
  if (match) {
    return 'يعيد عدد مفككات الترميز الصوتية المتاحة للاستخدام.';
  }

  match = /^\(([^)]+)\)\s*Returns\s+(.+)$/i.exec(value);
  if (match) {
    return `تعيد ${translateSdl3DocText(match[2], item)}`;
  }

  match = /^Returns true on success or false on failure; call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد true عند النجاح و false عند الفشل. عند الفشل استخدم ${match[1]}() لمعرفة السبب.`;
  }

  match = /^Returns a new\s+([A-Za-z0-9_ *]+),\s+or NULL on failure; call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد ${match[1].trim()} جديدًا، أو NULL عند الفشل. عند الفشل استخدم ${match[2]}() لمعرفة السبب.`;
  }

  match = /^Returns the new\s+([A-Za-z0-9_ *]+)\s+on success or NULL on failure;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد ${translateSdl3DocFragment(match[1])} جديدًا عند النجاح، أو NULL عند الفشل. عند الفشل استخدم ${match[2]}() لمعرفة السبب.`;
  }

  match = /^Returns a valid\s+([A-Za-z0-9_ *]+)\s*,\s*or NULL on failure;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد ${translateSdl3DocFragment(match[1])} صالحًا عند النجاح، أو NULL عند الفشل. عند الفشل استخدم ${match[2]}() لمعرفة السبب.`;
  }

  match = /^Returns SDL surface,\s*or NULL on error\.?$/i.exec(value);
  if (match) {
    return 'تعيد SDL_Surface صالحًا، أو NULL عند الخطأ.';
  }

  match = /^Returns a new SDL surface,\s*or NULL on error\.?$/i.exec(value);
  if (match) {
    return 'تعيد SDL_Surface جديدًا، أو NULL عند الخطأ.';
  }

  match = /^Returns a new SDL surface,\s*or NULL if no supported\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `تعيد SDL_Surface جديدًا، أو NULL إذا لم يوجد ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Returns a new SDL_Surface containing the decoded frame,\s+or NULL on failure(?:;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information)?\.?$/i.exec(value);
  if (match) {
    return `تعيد SDL_Surface جديدًا يحتوي الإطار المفكوك، أو NULL عند الفشل${match[1] ? `، ويمكن استدعاء ${match[1]}() لمعرفة السبب` : ''}.`;
  }

  match = /^Returns true if this is\s+(.+?)\s+data,\s*false otherwise\.?$/i.exec(value);
  if (match) {
    return `تعيد true إذا كانت البيانات من نوع ${match[1].trim()}، وfalse خلاف ذلك.`;
  }

  match = /^Returns 0 on success,?\s+or\s+-1 on (?:failure|error)\.?$/i.exec(value);
  if (match) {
    return 'تعيد 0 عند النجاح و-1 عند الفشل.';
  }

  match = /^Returns 0 on success or a negative error code on failure;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد 0 عند النجاح أو رمز خطأ سالبًا عند الفشل. عند الفشل استخدم ${match[1]}() لمعرفة السبب.`;
  }

  match = /^Returns a SDL_PropertiesID containing the\s+(.+?),\s+or 0 if there is no\s+(.+?)\s+available\.?$/i.exec(value);
  if (match) {
    return `تعيد SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}، أو 0 إذا لم تكن ${translateSdl3DocFragment(match[2])} متاحة.`;
  }

  match = /^Returns a SDL_PropertiesID containing the\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `تعيد SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Returns SDL_PropertiesID containing the\s+(.+?),\s+or 0 if there is no\s+(.+?)\s+available\.?$/i.exec(value);
  if (match) {
    return `تعيد SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}، أو 0 إذا لم تكن ${translateSdl3DocFragment(match[2])} متاحة.`;
  }

  match = /^Returns the properties ID of the\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `تعيد معرّف الخصائص الخاص بـ ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^Returns the presentation timestamp in milliseconds\.?$/i.exec(value);
  if (match) {
    return 'تعيد ختم العرض الزمني للإطار بوحدة المللي ثانية.';
  }

  match = /^Returns the status of the underlying decoder,\s+or\s+([A-Z0-9_]+)\s+if\s+(.+?)\.?$/i.exec(value);
  if (match) {
    if (/^given decoder is invalid$/i.test(String(match[2] || '').trim())) {
      return `تعيد حالة مفكك الترميز الداخلي، أو ${match[1]} إذا كان مفكك الترميز المعطى غير صالح.`;
    }
    return `تعيد حالة مفكك الترميز الداخلي، أو ${match[1]} إذا ${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^Returns a valid property ID on success or 0 on failure\.?$/i.exec(value);
  if (match) {
    return 'تعيد معرّف خصائص صالحًا عند النجاح أو 0 عند الفشل.';
  }

  match = /^Returns the length of the audio in sample frames,\s+or\s+([A-Z0-9_]+)\s+or\s+([A-Z0-9_]+)\s*\.?$/i.exec(value);
  if (match) {
    return `تعيد طول الصوت بوحدة إطارات العينات، أو ${match[1]} إذا كانت المدة غير معروفة، أو ${match[2]} إذا كان الصوت غير محدود.`;
  }

  match = /^Returns the mixer's current master frequency ratio\.?$/i.exec(value);
  if (match) {
    return 'تعيد نسبة التردد الرئيسية الحالية للمِكسر.';
  }

  match = /^Returns the mixer's current master gain\.?$/i.exec(value);
  if (match) {
    return 'تعيد قيمة الكسب الرئيسية الحالية للمِكسر.';
  }

  match = /^Returns the current frequency ratio,\s+or\s+0\.0f on failure;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد نسبة التردد الحالية، أو 0.0f عند الفشل. عند الفشل استخدم ${match[1]}() لمعرفة السبب.`;
  }

  match = /^Returns the track's current gain\.?$/i.exec(value);
  if (match) {
    return 'تعيد قيمة الكسب الحالية للمسار.';
  }

  match = /^Returns the number of pending loops,\s+zero if not looping,\s+and -1 if looping infinitely\.?$/i.exec(value);
  if (match) {
    return 'تعيد عدد مرات التكرار المعلقة، أو 0 إذا لم يكن المسار في حالة تكرار، أو -1 إذا كان التكرار لا نهائيًا.';
  }

  match = /^Returns the track's current sample frame position,\s+or -1 on error;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for details\.?$/i.exec(value);
  if (match) {
    return `تعيد موضع إطار العينة الحالي للمسار، أو -1 عند الخطأ. عند الخطأ استخدم ${match[1]}() لمعرفة التفاصيل.`;
  }

  match = /^Returns the total sample frames still to be mixed,\s+or -1 if unknown\.?$/i.exec(value);
  if (match) {
    return 'تعيد إجمالي إطارات العينات المتبقية للمزج، أو -1 إذا كانت القيمة غير معروفة.';
  }

  match = /^Returns less than 0 if the track is fading out,\s+greater than 0 if fading in,\s+zero otherwise\.?$/i.exec(value);
  if (match) {
    return 'تعيد قيمة سالبة إذا كان المسار يتلاشى إلى الخارج، وقيمة موجبة إذا كان يتلاشى إلى الداخل، و0 إذا لم يكن في حالة تلاشي.';
  }

  match = /^Returns an SDL_AudioStream if available,\s+NULL if not\.?$/i.exec(value);
  if (match) {
    return 'تعيد SDL_AudioStream إذا كان مرتبطًا بالمسار، أو NULL إذا لم يوجد.';
  }

  match = /^Returns a MIX_Audio if available,\s+NULL if not\.?$/i.exec(value);
  if (match) {
    return 'تعيد MIX_Audio إذا كان مرتبطًا بالمسار، أو NULL إذا لم يوجد.';
  }

  match = /^Returns the mixer associated with the\s+(group|track),\s+or NULL on error;\s*call\s+([A-Za-z0-9_]+)\(\)\s+for more information\.?$/i.exec(value);
  if (match) {
    return `تعيد المِكسر المرتبط بـ ${match[1] === 'group' ? 'المجموعة' : 'المسار'}، أو NULL عند الخطأ. عند الخطأ استخدم ${match[2]}() لمعرفة السبب.`;
  }

  match = /^Returns the number of decoders available\.?$/i.exec(value);
  if (match) {
    return 'تعيد عدد مفككات الترميز المتاحة.';
  }

  match = /^Returns a UTF-8 \(really,\s*ASCII\) string of the decoder's name,\s+or NULL if index is invalid\.?$/i.exec(value);
  if (match) {
    return 'تعيد سلسلة نصية باسم مفكك الترميز المطلوب، أو NULL إذا كان الفهرس غير صالح.';
  }

  match = /^Returns an audio decoder,\s+ready to decode\.?$/i.exec(value);
  if (match) {
    return 'تعيد مفكك ترميز صوتيًا جاهزًا لبدء فك الترميز.';
  }

  match = /^It is safe to call this (function|macro) from any thread\.?$/i.exec(value);
  if (match) {
    return `يمكن استدعاء هذا ${match[1] === 'macro' ? 'الماكرو' : 'العنصر'} من أي خيط بأمان.`;
  }

  match = /^This function is thread-safe\.?$/i.exec(value);
  if (match) {
    return 'هذه الدالة آمنة للاستخدام من عدة خيوط.';
  }

  match = /^This function is not thread safe\.?$/i.exec(value);
  if (match) {
    return 'هذه الدالة غير آمنة للاستخدام المتزامن بين عدة خيوط.';
  }

  match = /^You may only call this function from the main thread\.?$/i.exec(value);
  if (match) {
    return 'لا يجوز استدعاء هذه الدالة إلا من الخيط الرئيسي.';
  }

  match = /^This function should only be called on the main thread\.?$/i.exec(value);
  if (match) {
    return 'يجب استدعاء هذه الدالة من الخيط الرئيسي فقط.';
  }

  match = /^The returned surface should be freed with\s+([A-Za-z0-9_]+)\(\)\.?$/i.exec(value);
  if (match) {
    return `السطح المعاد يصبح مملوكًا للمستدعي ويجب تحريره بواسطة ${match[1]}().`;
  }

  match = /^The returned surface should be freed\.?$/i.exec(value);
  if (match) {
    return 'السطح المعاد يصبح مملوكًا للمستدعي ويجب تحريره بعد الانتهاء منه.';
  }

  match = /^The returned pointer should be freed with\s+([A-Za-z0-9_]+)\(\)\.?$/i.exec(value);
  if (match) {
    return `المؤشر المعاد يصبح مملوكًا للمستدعي ويجب تحريره بواسطة ${match[1]}().`;
  }

  match = /^The returned string is owned by the caller,\s+and should be passed to\s+([A-Za-z0-9_]+)\(\)\.?$/i.exec(value);
  if (match) {
    return `السلسلة النصية المعادة تصبح مملوكة للمستدعي ويجب تمريرها إلى ${match[1]}() لتحريرها.`;
  }

  match = /^The returned pointer is const memory owned by\s+([A-Za-z0-9_]+); do not free it\.?$/i.exec(value);
  if (match) {
    return `المؤشر المعاد يشير إلى ذاكرة ثابتة تملكها ${match[1]} داخليًا، ولا يجوز تحريره يدويًا.`;
  }

  match = /^There is no distinction made between\s+(.+?)\s+and\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `لا يوجد فرق في هذا السياق بين ${translateSdl3DocFragment(match[1])} و${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^The file type is determined from the file extension,\s*e\.g\.\s*"([^"]+)"\s+will be\s+(decoded|encoded)\s+using\s+([A-Za-z0-9_]+)\.?$/i.exec(value);
  if (match) {
    return `يُحدد نوع الملف من امتداده. على سبيل المثال، الملف "${match[1]}" ${match[2] === 'decoded' ? 'سيُفك ترميزه' : 'سيُشفَّر'} باستخدام ${match[3]}.`;
  }

  match = /^If closeio is true,\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `إذا كانت closeio تساوي true، فـ${translateSdl3DocFragment(match[1])}.`;
  }

  match = /^You do not need to call this function to load data;\s+([A-Za-z0-9_]+)\s+can\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return `لا تحتاج إلى استدعاء هذه الدالة لتحميل البيانات، لأن ${match[1]} يستطيع ${translateSdl3DocFragment(match[2])}.`;
  }

  match = /^This function returns the current version,\s+while\s+([A-Za-z0-9_]+)\s+is the version you compiled against\.?$/i.exec(value);
  if (match) {
    return `تعيد هذه الدالة الإصدار الحالي وقت التشغيل، بينما ${match[1]} يمثل الإصدار الذي بُني عليه البرنامج أثناء الترجمة.`;
  }

  match = /^true to allow the user to select more than one entry\.?$/i.exec(value);
  if (match) {
    return 'اجعل القيمة true للسماح للمستخدم باختيار أكثر من عنصر واحد.';
  }

  match = /^the number of filters in the array of filters,\s*if it exists\.?$/i.exec(value);
  if (match) {
    return 'عدد المرشحات داخل مصفوفة المرشحات إن كانت موجودة.';
  }

  match = /^the window that the dialog should be modal for\.?$/i.exec(value);
  if (match) {
    return 'النافذة التي يجب أن يكون الحوار مقيدًا بها كنافذة modal.';
  }

  match = /^the default folder or file to start the dialog at\.?$/i.exec(value);
  if (match) {
    return 'المجلد أو الملف الافتراضي الذي يبدأ منه الحوار.';
  }

  match = /^the title for the dialog\.?$/i.exec(value);
  if (match) {
    return 'العنوان الذي يظهر أعلى الحوار.';
  }

  match = /^the type of file dialog\.?$/i.exec(value);
  if (match) {
    return 'نوع حوار الملفات.';
  }

  match = /^the properties to use\.?$/i.exec(value);
  if (match) {
    return 'الخصائص التي سيستخدمها هذا الاستدعاء.';
  }

  match = /^an optional pointer to pass extra data to the callback when it will be invoked\.?$/i.exec(value);
  if (match) {
    return 'مؤشر اختياري لتمرير بيانات إضافية إلى رد النداء عند استدعائه.';
  }

  match = /^a function pointer to be invoked when the user selects a file and accepts,\s+or cancels the dialog,\s+or an error occurs\.?$/i.exec(value);
  if (match) {
    return 'مؤشر دالة يُستدعى عندما يختار المستخدم ملفًا ويؤكد الاختيار، أو يلغي الحوار، أو عند حدوث خطأ.';
  }

  match = /^the label that the accept button should have\.?$/i.exec(value);
  if (match) {
    return 'النص الذي يظهر على زر القبول.';
  }

  match = /^the label that the cancel button should have\.?$/i.exec(value);
  if (match) {
    return 'النص الذي يظهر على زر الإلغاء.';
  }

  match = /^name is a user-readable label for the filter \(for example,\s*"([^"]+)"\)\.?$/i.exec(value);
  if (match) {
    return `الحقل name يحمل الاسم المقروء للمستخدم لهذا المرشح، مثل "${match[1]}".`;
  }

  match = /^pattern is a semicolon-separated list of file extensions \(for example,\s*"([^"]+)"\)\.\s*File extensions may only contain alphanumeric characters,\s*hyphens,\s*underscores and periods\.\s*Alternatively,\s*the whole string can be a single asterisk\s*\("\*"\),\s*which serves as an "All files" filter\.?$/i.exec(value);
  if (match) {
    return `الحقل pattern يحمل قائمة امتدادات ملفات مفصولة بفاصلة منقوطة مثل "${match[1]}". الامتدادات المسموح بها لا تحتوي إلا على أحرف وأرقام وشرطات وشرطات سفلية ونقاط. ويمكن أيضًا أن تكون القيمة كلها "*" ليعمل المرشح كخيار "كل الملفات".`;
  }

  match = /^the\s+(.+?)\s+to\s+(modify|add|load|save|open|close|create|destroy|remove|read|write|query|update|set)\.?$/i.exec(value);
  if (match) {
    const subject = translateSdl3DocFragment(match[1]);
    const actionMap = {
      modify: 'الذي سيتم تعديله',
      add: 'الذي سيتم إضافته',
      load: 'الذي سيتم تحميله',
      save: 'الذي سيتم حفظه',
      open: 'الذي سيتم فتحه',
      close: 'الذي سيتم إغلاقه',
      create: 'الذي سيتم إنشاؤه',
      destroy: 'الذي سيتم تحريره',
      remove: 'الذي سيتم إزالته',
      read: 'الذي ستقرأ الدالة منه',
      write: 'الذي ستكتب الدالة إليه',
      query: 'الذي سيتم الاستعلام عنه',
      update: 'الذي سيتم تحديثه',
      set: 'الذي ستضبطه الدالة'
    };
    return `${subject} ${actionMap[String(match[2] || '').toLowerCase()] || 'الذي تتعامل معه الدالة'}.`;
  }

  match = /^a pointer to a list of\s+([A-Za-z0-9_]+)\s+structs,\s+which will be used as filters for file-based selections\.\s+Ignored if the dialog is an "Open Folder" dialog\.\s+If non-NULL,\s+the array of filters must remain valid at least until the callback is invoked\.?$/i.exec(value);
  if (match) {
    return `مؤشر إلى قائمة من هياكل ${match[1]} تُستخدم كمرشحات عند اختيار الملفات. يُتجاهل هذا الخيار إذا كان الحوار من نوع "فتح مجلد". وإذا لم تكن القيمة NULL فيجب أن تبقى مصفوفة المرشحات صالحة على الأقل حتى يُستدعى رد النداء.`;
  }

  match = /^a SDL_PropertiesID containing the\s+(.+?),\s+or 0 if there is no\s+(.+?)\s+available\.?$/i.exec(value);
  if (match) {
    return `SDL_PropertiesID يحتوي ${translateSdl3DocFragment(match[1])}، أو 0 إذا لم تكن ${translateSdl3DocFragment(match[2])} متاحة.`;
  }

  match = /^the status of the underlying decoder,\s+or\s+([A-Z0-9_]+)\s+if given decoder is invalid\.?$/i.exec(value);
  if (match) {
    return `حالة مفكك الترميز الداخلي، أو ${match[1]} إذا كان مفكك الترميز المعطى غير صالح.`;
  }

  match = /^(?:the|a|an)\s+(.+?)\.?$/i.exec(value);
  if (match) {
    return translateSdl3DocFragment(match[1]);
  }

  match = /^([A-Z0-9_]+)\s*:\s*(.+)$/.exec(value);
  if (match) {
    return `${match[1]}: ${translateSdl3DocText(match[2], item)}`;
  }

  if (options.fallbackToItemMeaning && /[A-Za-z]/.test(value) && !/[\u0600-\u06FF]/.test(value)) {
    if (item?.referenceName && /Please refer/i.test(item.description || '')) {
      return `هذا العنصر مرتبط بـ ${item.referenceName} والشرح العملي الكامل موجود في صفحته المحلية.`;
    }
    if (item) {
      return buildSdl3NameMeaning(item);
    }
  }

  return normalizeSdl3ArabicTechnicalProse(value);
}

function buildSdl3MixerFunctionProfile(item, returnMeaning) {
  if (item?.kind !== 'function' || item?.packageKey !== 'mixer') {
    return null;
  }

  const name = String(item?.name || '').trim();

  if (name === 'MIX_GetAudioDuration') {
    return {
      objectMeaning: 'مدة المورد الصوتي بوحدة إطارات العينات',
      meaning: 'تقرأ هذه الدالة طول المورد الصوتي الكامل بوحدة إطارات العينات من بيانات MIX_Audio نفسها، حتى تعرف كم عينة يمكن تشغيلها أو مزجها قبل انتهاء الصوت.',
      purpose: 'تستخدمها عندما تحتاج حساب زمن التشغيل بدقة، أو مزامنة الصوت مع مسار آخر، أو معرفة طول المادة الصوتية قبل ربطها بمسار أو تقطيعها.',
      operation: `تستعلم SDL3_mixer من بيانات MIX_Audio عن عدد إطارات العينات التي ينتجها هذا المورد عند تشغيله. لا تنشئ موردًا جديدًا ولا تغيّر الصوت نفسه، بل ${returnMeaning}.`,
      benefit: 'تفيد في بناء المؤقتات الدقيقة، وتحويل المدة إلى مللي ثانية، وتحديد نهاية التشغيل أو حجم المادة الصوتية قبل المزج.',
      when: 'استخدمها بعد تحميل MIX_Audio أو إنشائه، عندما تحتاج معرفة مدة التشغيل الفعلية قبل تشغيله أو أثناء تجهيز منطق التوقيت.',
      ...buildSdl3MixerQueryParameterProfile('audio', 'المورد الصوتي')
    };
  }

  if (name === 'MIX_GetAudioFormat') {
    return {
      objectMeaning: 'تنسيق الصوت الابتدائي للمورد الصوتي',
      meaning: 'تقرأ هذه الدالة تنسيق الصوت الابتدائي المخزن داخل MIX_Audio وتكتب تفاصيله في SDL_AudioSpec الذي تمرره، مثل التردد وعدد القنوات وصيغة العينات.',
      purpose: 'تستخدمها عندما تحتاج معرفة التنسيق الأصلي للصوت قبل مزجه أو تحويله أو مطابقته مع مِكسر أو جهاز صوت معين.',
      operation: `تستعلم SDL3_mixer من المورد الصوتي عن مواصفاته الابتدائية ثم تكتبها في SDL_AudioSpec الذي مررته. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في التحقق من التوافق بين المورد الصوتي وبقية مسار التشغيل، وفي اتخاذ قرار إن كان التحويل أو إعادة التهيئة مطلوبين.',
      when: 'استخدمها عندما تحتاج مواصفات الصوت الأصلية قبل تشغيله أو قبل تمريره إلى مسار معالجة يعتمد على تنسيق محدد.',
      parameterRoles: {
        audio: 'هذا هو المورد الصوتي الذي ستقرأ الدالة تنسيقه الصوتي الابتدائي منه.',
        spec: 'هذه هي بنية SDL_AudioSpec التي ستكتب الدالة داخلها تفاصيل التنسيق الصوتي عند النجاح.'
      },
      parameterPurposes: {
        audio: 'لأن الدالة تستخرج المواصفات من مورد صوتي محدد، لا من حالة عامة داخل المكتبة.',
        spec: 'لأن النتيجة تتكون من عدة قيم مترابطة، لذلك تحتاج الدالة مكانًا منظمًا تكتب فيه هذه المواصفات.'
      },
      parameterUsage: {
        audio: 'مرر MIX_Audio صالحًا سبق تحميله أو إنشاؤه، لأن الدالة ستقرأ مواصفاته الصوتية من هذا المورد نفسه.',
        spec: 'مرر مؤشرًا صالحًا إلى SDL_AudioSpec مهيأ في الذاكرة، لأن الدالة ستملأ حقوله بالتنسيق المكتشف عند النجاح.'
      }
    };
  }

  if (name === 'MIX_GetAudioProperties') {
    return {
      objectMeaning: 'وعاء الخصائص المرتبط بالمورد الصوتي',
      meaning: 'تجلب هذه الدالة معرّف SDL_PropertiesID المرتبط بمورد MIX_Audio حتى تتمكن من قراءة الخصائص الوصفية أو الموسعة المسجلة على هذا الصوت.',
      purpose: 'تستخدمها عندما تحتاج الوصول إلى خصائص مرتبطة بالصوت نفسه عبر نظام الخصائص بدل انتظار دالة منفصلة لكل معلومة.',
      operation: `تقرأ SDL3_mixer وعاء الخصائص المرتبط بالمورد الصوتي ثم ${returnMeaning}.`,
      benefit: 'تفيد عندما تريد الوصول إلى بيانات وصفية أو خيارات موسعة مرتبطة بالمورد نفسه دون توسيع التوقيع بعدة استدعاءات منفصلة.',
      when: 'استخدمها بعد الحصول على MIX_Audio صالح إذا كنت تحتاج خصائصه الرسمية أو الموسعة.',
      ...buildSdl3MixerQueryParameterProfile('audio', 'المورد الصوتي')
    };
  }

  if (name === 'MIX_GetAudioDecoder') {
    return {
      objectMeaning: 'اسم مفكك الترميز الصوتي في فهرس المفككات المتاحة',
      meaning: 'تعيد هذه الدالة الاسم النصي لمفكك الترميز الصوتي الموجود في الفهرس الذي تمرره، حتى تعرف أي مفككات ترميز توفرها SDL3_mixer على النظام الحالي.',
      purpose: 'تستخدمها عندما تبني قائمة بالمفككات المتاحة أو تعرض معلومات تشخيصية عن صيغ الصوت التي يمكن للمكتبة التعامل معها.',
      operation: `تقرأ SDL3_mixer فهرس مفككات الترميز المتاحة ثم ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وفي عرض الدعم المتاح للصيغ الصوتية على النظام الحالي بدل افتراض وجود مفكك معين.',
      when: 'استخدمها بعد معرفة عدد المفككات المتاحة إذا كنت تريد عرض اسم كل مفكك أو التحقق من وجود مفكك معين.',
      parameterRoles: {
        index: 'هذا هو الفهرس العددي الذي يحدد أي مفكك ترميز صوتي تريد قراءة اسمه من قائمة المفككات المتاحة.'
      },
      parameterPurposes: {
        index: 'لأن الدالة تستعلم عن مفكك واحد داخل قائمة، وتحتاج رقم موضعه داخل هذه القائمة.'
      },
      parameterUsage: {
        index: 'مرر فهرسًا صحيحًا يبدأ عادة من 0 وينتهي قبل عدد المفككات الذي تعيده MIX_GetNumAudioDecoders.'
      }
    };
  }

  if (name === 'MIX_GetNumAudioDecoders') {
    return {
      objectMeaning: 'عدد مفككات الترميز الصوتية المتاحة',
      meaning: 'تعيد هذه الدالة عدد مفككات الترميز الصوتية التي يمكن لـ SDL3_mixer استخدامها على النظام الحالي لفك الملفات أو المجاري الصوتية.',
      purpose: 'تستخدمها عندما تريد تعداد المفككات المتاحة أو بناء حلقة تمر على الأسماء التي تعيدها MIX_GetAudioDecoder.',
      operation: `تفحص SDL3_mixer قائمة مفككات الترميز المسجلة والمفعلة حاليًا ثم ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وفي معرفة ما إذا كانت بيئة التشغيل تدعم الصيغ المطلوبة قبل محاولة فتح ملف صوتي معين.',
      when: 'استخدمها قبل المرور على أسماء المفككات أو عند بناء شاشة تشخيصية لقدرات الصوت المتاحة.'
    };
  }

  const genericMatch = /^MIX_Get(AudioDecoder|Audio|Group|Mixer|Track)(Properties|Format|Mixer|Gain|FrequencyRatio)$/.exec(name);
  if (genericMatch) {
    const subjectKey = genericMatch[1];
    const attributeKey = genericMatch[2];
    const subjectLabelMap = {
      Audio: 'المورد الصوتي',
      AudioDecoder: 'مفكك الترميز الصوتي',
      Group: 'مجموعة المزج',
      Mixer: 'المِكسر',
      Track: 'المسار'
    };
    const queryParamMap = {
      Audio: 'audio',
      AudioDecoder: 'audiodecoder',
      Group: 'group',
      Mixer: 'mixer',
      Track: 'track'
    };
    const subjectLabel = subjectLabelMap[subjectKey];
    const queryParam = queryParamMap[subjectKey];
    const base = buildSdl3MixerQueryParameterProfile(queryParam, subjectLabel);

    if (attributeKey === 'Properties') {
      return {
        objectMeaning: `وعاء الخصائص المرتبط بـ ${subjectLabel}`,
        meaning: `تجلب هذه الدالة معرّف SDL_PropertiesID المرتبط بـ ${subjectLabel} المحدد، حتى تتمكن من قراءة الخصائص الوصفية أو الموسعة المسجلة عليه.`,
        purpose: `تستخدمها عندما تحتاج خصائص مرتبطة بـ ${subjectLabel} نفسه عبر نظام الخصائص بدل دوال مخصصة منفصلة لكل قيمة.`,
        operation: `تقرأ SDL3_mixer وعاء الخصائص المرتبط بـ ${subjectLabel} المحدد ثم ${returnMeaning}.`,
        benefit: 'تفيد عندما تريد الوصول إلى مجموعة خصائص قابلة للتوسع دون زيادة عدد الدوال أو المعاملات الخاصة بكل مورد.',
        when: `استخدمها بعد امتلاك ${subjectLabel} صالح إذا كنت تحتاج خصائصه الرسمية أو الموسعة.`,
        ...base
      };
    }

    if (attributeKey === 'Format') {
      return {
        objectMeaning: `تنسيق الصوت الابتدائي لـ ${subjectLabel}`,
        meaning: `تقرأ هذه الدالة تنسيق الصوت الابتدائي لـ ${subjectLabel} وتكتبه داخل SDL_AudioSpec الذي تمرره، مثل التردد وعدد القنوات وصيغة العينات.`,
        purpose: 'تستخدمها عندما تحتاج معرفة تنسيق الصوت الفعلي قبل المزج أو التحويل أو المطابقة مع مِكسر أو جهاز إخراج.',
        operation: `تستعلم SDL3_mixer من ${subjectLabel} عن مواصفات الصوت الابتدائية ثم تكتبها في SDL_AudioSpec الذي مررته. بعد ذلك ${returnMeaning}.`,
        benefit: 'تفيد في قرارات التوافق والتحويل وفي التحقق من أن المورد أو المفكك أو المِكسر يعمل بالتنسيق المتوقع.',
        when: `استخدمها عندما تحتاج مواصفات الصوت الفعلية المرتبطة بـ ${subjectLabel} قبل بناء خطوة معالجة أو تشغيل لاحقة.`,
        ...base,
        parameterRoles: {
          [queryParam]: `هذا هو ${subjectLabel} الذي ستقرأ الدالة تنسيق الصوت الابتدائي منه.`,
          spec: 'هذه هي بنية SDL_AudioSpec التي ستكتب الدالة داخلها تفاصيل التنسيق عند النجاح.'
        },
        parameterPurposes: {
          [queryParam]: `لأن الدالة تحتاج ${subjectLabel} محددًا تستخرج منه هذه المواصفات.`,
          spec: 'لأن النتيجة تتكون من عدة قيم مترابطة، لذلك تحتاج الدالة مكانًا منظمًا تكتب فيه هذه المواصفات.'
        },
        parameterUsage: {
          [queryParam]: `مرر ${queryParam === 'mixer' ? 'MIX_Mixer' : queryParam === 'track' ? 'MIX_Track' : queryParam === 'group' ? 'MIX_Group' : queryParam === 'audiodecoder' ? 'MIX_AudioDecoder' : 'MIX_Audio'} صالحًا يمثل ${subjectLabel} الذي تريد قراءة التنسيق الصوتي منه.`,
          spec: 'مرر مؤشرًا صالحًا إلى SDL_AudioSpec لأن الدالة ستملأ حقوله بالتنسيق المكتشف عند النجاح.'
        }
      };
    }

    if (attributeKey === 'Mixer') {
      return {
        objectMeaning: `المِكسر المالك لـ ${subjectLabel}`,
        meaning: `تعيد هذه الدالة المِكسر الذي يملك ${subjectLabel} المحدد أو يرتبط به مباشرة داخل بنية المزج الحالية.`,
        purpose: 'تستخدمها عندما تحتاج الرجوع من مورد فرعي إلى المِكسر الأب الذي يدير تشغيله أو مزجه.',
        operation: `تقرأ SDL3_mixer الرابط الداخلي بين ${subjectLabel} والمِكسر الأب ثم ${returnMeaning}.`,
        benefit: 'تفيد عندما تريد الانتقال من المجموعة أو المسار إلى سياق المزج الذي يملكه دون الاحتفاظ بهذا الربط يدويًا في طبقة أخرى.',
        when: `استخدمها عندما تبدأ من ${subjectLabel} قائم وتحتاج الوصول إلى المِكسر الذي يديره.`,
        ...base
      };
    }

    if (attributeKey === 'Gain') {
      return {
        objectMeaning: `قيمة الكسب الحالية لـ ${subjectLabel}`,
        meaning: `تقرأ هذه الدالة قيمة الكسب الحالية المطبقة على ${subjectLabel}، أي مقدار رفع أو خفض مستوى الصوت قبل خروجه إلى مرحلة المزج التالية.`,
        purpose: 'تستخدمها عندما تريد معرفة مستوى الصوت الفعلي الحالي قبل تعديله أو عرضه في واجهة تحكم صوتية.',
        operation: `تستعلم SDL3_mixer من ${subjectLabel} عن قيمة الكسب النشطة حاليًا ثم ${returnMeaning}.`,
        benefit: 'تفيد في بناء واجهات التحكم بالصوت وفي حفظ الحالة الحالية قبل إجراء تعديل مؤقت أو تدريجي.',
        when: `استخدمها عندما تحتاج قراءة مستوى الصوت الحالي المرتبط بـ ${subjectLabel} قبل تغييره أو عرضه.`,
        ...base
      };
    }

    if (attributeKey === 'FrequencyRatio') {
      return {
        objectMeaning: `نسبة التردد الحالية لـ ${subjectLabel}`,
        meaning: `تقرأ هذه الدالة نسبة التردد الحالية المطبقة على ${subjectLabel}، وهي النسبة التي تؤثر في سرعة التشغيل وطبقة الصوت بالنسبة إلى القيمة الأصلية.`,
        purpose: 'تستخدمها عندما تريد معرفة ما إذا كان التشغيل يسير بسرعة أو طبقة معدلتين قبل إجراء تغيير جديد أو عرض القيمة الحالية.',
        operation: `تستعلم SDL3_mixer من ${subjectLabel} عن نسبة التردد النشطة حاليًا ثم ${returnMeaning}.`,
        benefit: 'تفيد في أنظمة تغيير السرعة أو الطبقة وفي مزامنة واجهات التحكم مع الحالة الفعلية للمسار أو المِكسر.',
        when: `استخدمها عندما تحتاج قراءة نسبة التردد الحالية لـ ${subjectLabel} قبل تعديلها أو عرضها للمستخدم.`,
        ...base
      };
    }
  }

  if (name === 'MIX_GetTaggedTracks') {
    return {
      objectMeaning: 'المسارات المرتبطة بوسم نصي محدد',
      meaning: 'تجلب هذه الدالة جميع المسارات التابعة لمِكسر معين والتي تحمل الوسم النصي الذي تمرره، ثم تعيدها في مصفوفة منتهية بـ NULL.',
      purpose: 'تستخدمها عندما تنظم المسارات بالأوسمة وتحتاج الوصول إلى مجموعة فرعية منها دفعة واحدة، مثل كل مسارات المؤثرات أو كل مسارات الحوار.',
      operation: `تفحص SDL3_mixer الأوسمة المرتبطة بمسارات المِكسر المحدد، ثم تجمع المسارات المطابقة للوسم المطلوب وتعيدها مع عددها. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في تنفيذ أوامر جماعية على مسارات متعددة دون إدارة قوائم منفصلة بنفسك خارج المِكسر.',
      when: 'استخدمها عندما تريد العثور على جميع المسارات التي تحمل وسمًا معينًا داخل مِكسر محدد.',
      parameterRoles: {
        mixer: 'هذا هو المِكسر الذي ستبحث الدالة داخل مساراته عن الوسم المطلوب.',
        tag: 'هذا هو الوسم النصي الذي يجب أن تمتلكه المسارات حتى تدخل في النتيجة.',
        count: 'هذا مؤشر خرج اختياري تكتب الدالة فيه عدد المسارات التي أعادتها بالفعل.'
      },
      parameterPurposes: {
        mixer: 'لأن البحث عن الأوسمة يتم داخل مِكسر محدد لا على كل المسارات في التطبيق.',
        tag: 'لأن الدالة تحتاج معيار المطابقة الذي تفرز به المسارات المطلوبة من غيرها.',
        count: 'لأن النتيجة تعاد كمصفوفة، ويحتاج التطبيق أحيانًا إلى العدد الفعلي للعناصر قبل المرور عليها.'
      },
      parameterUsage: {
        mixer: 'مرر MIX_Mixer صالحًا يمثل سياق المزج الذي تريد البحث داخله.',
        tag: 'مرر سلسلة نصية مطابقة للوسم الذي ربطته سابقًا بالمسارات المستهدفة.',
        count: 'مرر مؤشرًا إلى int إذا كنت تريد عدد النتائج، أو مرر NULL إذا كنت لا تحتاج هذا العدد.'
      }
    };
  }

  if (name === 'MIX_GetTrack3DPosition') {
    return {
      objectMeaning: 'الموضع الحالي للمسار في الفضاء ثلاثي الأبعاد',
      meaning: 'تقرأ هذه الدالة موضع المسار الحالي داخل الفضاء ثلاثي الأبعاد وتكتب الإحداثيات في البنية التي تمررها.',
      purpose: 'تستخدمها عندما تريد معرفة مكان المصدر الصوتي الحالي قبل تحديثه أو قبل مزامنته مع كائن ثلاثي الأبعاد في محرك اللعبة.',
      operation: `تقرأ SDL3_mixer الإحداثيات الحالية المرتبطة بالمسار ثم تكتبها في MIX_Point3D الذي مررته. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في مزامنة الصوت المكاني مع المشهد أو في بناء أدوات تشخيص تعرض موضع المصدر الصوتي الفعلي.',
      when: 'استخدمها عندما تحتاج قراءة الإحداثيات الحالية لمسار ثلاثي الأبعاد قبل تعديلها أو عرضها.',
      parameterRoles: {
        track: 'هذا هو المسار الذي ستقرأ الدالة موضعه المكاني الحالي.',
        position: 'هذه هي البنية التي ستكتب الدالة داخلها الإحداثيات الحالية للمسار عند النجاح.'
      },
      parameterPurposes: {
        track: 'لأن الموضع المكاني مرتبط بمسار صوتي محدد داخل المِكسر.',
        position: 'لأن النتيجة تتكون من عدة مركبات مكانية مترابطة تحتاج بنية تكتب الدالة داخلها.'
      },
      parameterUsage: {
        track: 'مرر MIX_Track صالحًا يستخدم الصوت المكاني أو يرتبط بموقع ثلاثي الأبعاد.',
        position: 'مرر مؤشرًا صالحًا إلى MIX_Point3D لأن الدالة ستملأ الإحداثيات الحالية داخله عند النجاح.'
      }
    };
  }

  if (name === 'MIX_GetTrackAudio') {
    return {
      objectMeaning: 'المورد الصوتي المرتبط حاليًا بالمسار',
      meaning: 'تقرأ هذه الدالة مورد MIX_Audio المرتبط بالمسار حاليًا، أي المادة الصوتية التي سيتعامل معها هذا المسار أثناء المزج.',
      purpose: 'تستخدمها عندما تحتاج معرفة أي مورد صوتي أُسند إلى المسار دون الاحتفاظ بهذه العلاقة يدويًا في طبقة خارجية.',
      operation: `تقرأ SDL3_mixer الرابط الحالي بين المسار ومورد الصوت المرتبط به ثم ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وفي مزامنة واجهات التحكم مع المادة الصوتية الفعلية التي يشغلها المسار.',
      when: 'استخدمها عندما تحتاج قراءة المورد الصوتي الحالي المرتبط بمسار قائم.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackAudioStream') {
    return {
      objectMeaning: 'مجرى الصوت المرتبط حاليًا بالمسار',
      meaning: 'تقرأ هذه الدالة SDL_AudioStream المرتبط بالمسار حاليًا، إذا كان هذا المسار مبنيًا على مجرى صوتي مباشر بدل مورد MIX_Audio ثابت.',
      purpose: 'تستخدمها عندما تحتاج معرفة هل المسار يعتمد على SDL_AudioStream وما هو المجرى المرتبط به فعليًا.',
      operation: `تقرأ SDL3_mixer الرابط الحالي بين المسار ومجرى الصوت المرتبط به ثم ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وفي ربط التحكم في المسار بالمجرى الذي يمده بالعينات فعلًا.',
      when: 'استخدمها عندما تحتاج قراءة SDL_AudioStream الحالي المرتبط بمسار قائم.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackFadeFrames') {
    return {
      objectMeaning: 'حالة التلاشي الحالية للمسار',
      meaning: 'تقرأ هذه الدالة ما إذا كان المسار يمر حاليًا بعملية تلاشي صوتي، وتعيد اتجاه التلاشي عبر إشارة القيمة المعادة.',
      purpose: 'تستخدمها عندما تريد معرفة ما إذا كان المسار يزداد ارتفاعًا أو ينخفض تدريجيًا قبل تطبيق تلاشي جديد أو تغيير مباشر في المستوى.',
      operation: `تفحص SDL3_mixer حالة التلاشي المرتبطة بالمسار ثم ${returnMeaning}.`,
      benefit: 'تفيد في تفادي تداخل أوامر التلاشي وفي بناء واجهات تعرض اتجاه الانتقال الصوتي الحالي بدقة.',
      when: 'استخدمها عندما تحتاج معرفة حالة التلاشي الحالية لمسار قبل إصدار أمر جديد عليه.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackLoops') {
    return {
      objectMeaning: 'عدد مرات التكرار المتبقية للمسار',
      meaning: 'تقرأ هذه الدالة عدد مرات التكرار التي ما زالت معلقة للمسار الحالي قبل أن يتوقف أو يستمر بلا نهاية.',
      purpose: 'تستخدمها عندما تحتاج معرفة إن كان المسار في دورة تكرار محددة أو لا نهائية قبل تعديل هذا السلوك أو عرضه.',
      operation: `تقرأ SDL3_mixer عداد التكرار الحالي للمسار ثم ${returnMeaning}.`,
      benefit: 'تفيد في مزامنة واجهات التحكم وفي اتخاذ قرار برمجي حول توقيت إيقاف المسار أو تركه يكرر نفسه.',
      when: 'استخدمها عندما تعتمد الخطوة التالية على عدد مرات التكرار المتبقية للمسار.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackPlaybackPosition') {
    return {
      objectMeaning: 'موضع القراءة الحالي للمسار بوحدة إطارات العينات',
      meaning: 'تقرأ هذه الدالة موضع القراءة الحالي للمسار أثناء التشغيل بوحدة إطارات العينات، أي أين وصل تشغيل المادة الصوتية داخل المصدر المرتبط به.',
      purpose: 'تستخدمها عندما تحتاج مزامنة مؤثرات أو واجهة زمنية مع موضع التشغيل الفعلي للمسار.',
      operation: `تقرأ SDL3_mixer مؤشر القراءة الحالي للمسار أثناء التشغيل ثم ${returnMeaning}.`,
      benefit: 'تفيد في التزامن الدقيق مع الصوت وفي بناء مؤشرات تقدم تعتمد على موقع العينة الحقيقي لا على تقدير زمني تقريبي.',
      when: 'استخدمها عندما تحتاج معرفة الموضع الحالي للمسار داخل المصدر الصوتي أثناء التشغيل.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackRemaining') {
    return {
      objectMeaning: 'عدد إطارات العينات المتبقية للمزج في المسار',
      meaning: 'تقرأ هذه الدالة عدد إطارات العينات التي ما زالت متبقية للمسار قبل أن يستهلك مادته الصوتية الحالية بالكامل أثناء المزج.',
      purpose: 'تستخدمها عندما تريد تقدير ما تبقى من المسار فعليًا قبل نهايته أو قبل إدراج مادة صوتية جديدة عليه.',
      operation: `تقرأ SDL3_mixer كمية العينات التي لم تُمزج بعد داخل المسار ثم ${returnMeaning}.`,
      benefit: 'تفيد في التوقيت الدقيق وفي معرفة قرب انتهاء المسار دون الاعتماد على تقدير تقريبي من الزمن فقط.',
      when: 'استخدمها عندما تحتاج معرفة ما تبقى من مادة المسار قبل نهايته أو قبل اتخاذ قرار زمني مرتبط به.',
      ...buildSdl3MixerQueryParameterProfile('track', 'المسار')
    };
  }

  if (name === 'MIX_GetTrackTags') {
    return {
      objectMeaning: 'الأوسمة المرتبطة حاليًا بالمسار',
      meaning: 'تجلب هذه الدالة جميع الأوسمة النصية المرتبطة بالمسار الحالي في مصفوفة منتهية بـ NULL.',
      purpose: 'تستخدمها عندما تريد معرفة كيف صُنّف المسار حاليًا أو بناء منطق يعتمد على الأوسمة المرتبطة به.',
      operation: `تقرأ SDL3_mixer قائمة الأوسمة المخزنة للمسار ثم ${returnMeaning}.`,
      benefit: 'تفيد في التنظيم والتشخيص وفي تطبيق سياسات تعتمد على الأوسمة دون الحاجة إلى مرجع جانبي منفصل.',
      when: 'استخدمها عندما تحتاج قراءة جميع الأوسمة المرتبطة بمسار قائم.',
      parameterRoles: {
        track: 'هذا هو المسار الذي ستقرأ الدالة أوسمته المرتبطة منه.',
        count: 'هذا مؤشر خرج اختياري تكتب الدالة فيه عدد الأوسمة التي أعادتها.'
      },
      parameterPurposes: {
        track: 'لأن الأوسمة مرتبطة بمسار محدد داخل المِكسر.',
        count: 'لأن النتيجة تعاد كمصفوفة، وقد تحتاج إلى معرفة عدد الأوسمة الفعلي قبل المرور عليها.'
      },
      parameterUsage: {
        track: 'مرر MIX_Track صالحًا تريد قراءة الأوسمة المرتبطة به.',
        count: 'مرر مؤشرًا إلى int إذا كنت تريد عدد الأوسمة، أو NULL إذا لم تكن بحاجة إليه.'
      }
    };
  }

  return null;
}

function getSdl3SpecialFunctionProfile(item) {
  if (item?.kind !== 'function') {
    return null;
  }

  const name = String(item?.name || '').trim();
  const returnMeaning = linkSdl3DocText(buildSdl3ReturnMeaning(item));

  const buildInstanceIdHelp = (deviceLabel) => ({
    parameterRoles: {
      instance_id: `هذا هو المعرّف الذي يحدد أي ${deviceLabel} يجب أن تستعلم عنه SDL داخل قائمة الأجهزة المكتشفة.`
    },
    parameterPurposes: {
      instance_id: `لأن هذه الدالة لا تعمل على كائن ${deviceLabel} مفتوح، بل على جهاز معروف فقط بالمعرّف الذي سجلته SDL مسبقًا.`
    }
  });

  if (name === 'SDL_GetSensorNameForID') {
    return {
      objectMeaning: 'اسم الحساس المحدد بمعرّفه',
      meaning: 'تجلب الاسم الذي تعيده المنصة أو برنامج التشغيل للحساس المشار إليه بهذا المعرّف، حتى تتمكن من عرضه للمستخدم أو تسجيله دون فتح الحساس نفسه.',
      purpose: 'تستخدمها عندما تملك SDL_SensorID فقط وتريد تسمية الحساس في الواجهة أو في السجلات قبل فتحه أو أثناء فرز قائمة الحساسات المكتشفة.',
      operation: `تقرأ المعرّف الذي مررته، ثم تستعلم SDL من سجل الحساسات عن الاسم المقترن بهذا الحساس. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في بناء قوائم الحساسات ورسائل التشخيص، لأن المعرّف العددي وحده لا يكفي لتمييز الجهاز للمستخدم أو للمطور.',
      when: 'استخدمها بعد اكتشاف الحساس والحصول على SDL_SensorID صالح إذا كنت تحتاج اسمًا مفهومًا للعرض أو للتسجيل.',
      ...buildInstanceIdHelp('حساس')
    };
  }

  if (name === 'SDL_GetSensorTypeForID') {
    return {
      objectMeaning: 'النوع العام للحساس المحدد بمعرّفه',
      meaning: 'تجلب التصنيف العام الذي تعتمد عليه SDL لهذا الحساس، حتى تعرف فئته الوظيفية مثل مقياس التسارع أو الجيروسكوب دون فتح الحساس أو تحليل اسمه يدويًا.',
      purpose: 'تستخدمها عندما تريد اتخاذ قرار برمجي بناءً على فئة الحساس نفسها، مثل توجيه القراءة إلى مسار معالجة مناسب لكل نوع من أنواع الحساسات.',
      operation: `تقرأ SDL_SensorID الذي مررته، وتستعلم من سجل الحساسات عن SDL_SensorType المسجل لهذا الحساس، ثم ${returnMeaning}.`,
      benefit: 'تمنحك تصنيفًا محمولًا على كل المنصات تديره SDL، لذلك يمكنك كتابة منطق يعتمد على نوع الحساس بدل مقارنة أسماء أجهزة قد تختلف بين نظام وآخر.',
      when: 'استخدمها بعد اكتشاف الحساس إذا كان التنفيذ التالي يعتمد على نوع الحساس العام الذي تعترف به SDL.',
      ...buildInstanceIdHelp('حساس')
    };
  }

  if (name === 'SDL_GetSensorNonPortableTypeForID') {
    return {
      objectMeaning: 'النوع المنصي الخام للحساس المحدد بمعرّفه',
      meaning: 'تجلب التصنيف المنصي الخام للحساس المشار إليه بهذا المعرّف، حتى تعرف كيف يسميه النظام أو برنامج التشغيل خارج النوع العام المحمول الذي توفره SDL.',
      purpose: 'تستخدمها عندما لا يكفيك SDL_SensorType العام، وتحتاج التفريق بين حساسات تعتمد على تصنيفات خاصة بالمنصة أو تريد ربط الحساس بتعريفات عتادية أدق.',
      operation: `تقرأ SDL_SensorID الذي مررته، ثم تستعلم SDL من طبقة الحساسات عن النوع غير المحمول المسجل لهذا الحساس في النظام، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في التكاملات المنصية والتشخيص المتقدم، لأن النوع العام المحمول قد يجمع عدة أجهزة مختلفة تحت فئة واحدة بينما يكشف النوع المنصي الفارق الحقيقي بينها.',
      when: 'استخدمها بعد اكتشاف الحساس إذا كان منطقك يعتمد على التصنيف الخام للنظام أو على معرفة نوع عتادي أدق من التصنيف العام.',
      ...buildInstanceIdHelp('حساس')
    };
  }

  if (name === 'TTF_AddFallbackFont') {
    return {
      objectMeaning: 'ربط خط احتياطي بخط أساسي موجود',
      meaning: 'تربط خطًا احتياطيًا بالخط الأساسي، بحيث يبحث محرك النص في SDL3_ttf داخل هذا الخط الاحتياطي عندما لا يجد المحرف المطلوب في الخط الحالي.',
      purpose: 'تستخدمها عندما يحتاج التطبيق إلى عرض محارف لا يغطيها الخط الأساسي وحده، مثل الجمع بين العربية واللاتينية والرموز داخل سلسلة نصية واحدة.',
      operation: 'عند استدعاء هذه الدالة يضيف SDL3_ttf الخط الاحتياطي الذي مررته إلى قائمة الخطوط الاحتياطية المرتبطة بالخط الأساسي. بعد ذلك يحاول محرك عرض النص استخدام الخط الأساسي أولًا، ثم ينتقل إلى الخطوط الاحتياطية بالترتيب عند غياب المحرف المطلوب.',
      benefit: 'تسمح بعرض نصوص متعددة اللغات أو نصوص تحتوي رموزًا خاصة دون الحاجة إلى تبديل الخط يدويًا قبل كل عملية رسم أو تقسيم النص إلى أجزاء منفصلة.',
      when: 'استخدمها بعد فتح الخطين وقبل إنشاء النصوص أو رسمها، عندما تعرف أن الخط الأساسي لا يغطي كل المحارف التي قد تظهر في التطبيق.',
      parameterRoles: {
        font: 'هذا هو الخط الأساسي الذي ستُضاف إليه سلسلة الخطوط الاحتياطية، وهو الخط الذي يبدأ منه محرك النص البحث عن المحارف.',
        fallback: 'هذا هو الخط الاحتياطي الذي سيُستخدم فقط إذا غاب المحرف المطلوب عن الخط الأساسي أو عن الخطوط الاحتياطية السابقة في السلسلة.'
      },
      parameterPurposes: {
        font: 'لأن SDL3_ttf يحتاج تحديد أي خط قائم ستُحدَّث قائمة الخطوط الاحتياطية الخاصة به.',
        fallback: 'لأن الدالة لا تنشئ خطًا احتياطيًا من تلقاء نفسها، بل تحتاج خطًا جاهزًا تفتحه مسبقًا وتربطه بالخط الأساسي.'
      },
      parameterUsage: {
        font: 'مرر TTF_Font صالحًا يمثل الخط الذي تستخدمه فعلًا في إنشاء النصوص أو رسمها، لأن SDL3_ttf سيحدّث هذا الخط نفسه بإضافة السلسلة الاحتياطية إليه.',
        fallback: 'مرر TTF_Font صالحًا مفتوحًا بنفس حجم الخط الأساسي ونمطه، لأن هذا الخط سيُفحص لاحقًا عند غياب المحرف من الخط الأساسي.'
      }
    };
  }

  if (name === 'MIX_CreateSineWaveAudio') {
    return {
      objectMeaning: 'مورد صوتي يولد موجة جيبية',
      meaning: 'تنشئ هذه الدالة موردًا صوتيًا من النوع MIX_Audio يولد موجة جيبية (Sine Wave) اعتمادًا على القيم التي تمررها مثل المِكسر والتردد والسعة والمدة.',
      purpose: 'تستخدمها عندما تحتاج نغمة مولدة برمجيًا للاختبار أو للتنبيه أو لتشخيص مسار الصوت دون تحميل ملف صوتي جاهز.',
      operation: 'عند استدعاء هذه الدالة تستخدم SDL3_mixer القيم الممررة لتوليد إشارة صوتية جيبية داخل مورد MIX_Audio جديد، ثم تعيد مؤشرًا إلى هذا المورد كي تتمكن من تشغيله لاحقًا على المِكسر المناسب.',
      benefit: 'تفيد في الاختبارات السريعة وتوليد نغمة بسيطة من داخل الكود نفسه، لذلك لا تحتاج إلى ملفات صوتية خارجية لمجرد التحقق من عمل نظام المزج والتشغيل.',
      when: 'استخدمها عندما تريد صوتًا بسيطًا ومولدًا مباشرة من الكود، مثل نغمة اختبار أو إشارة تنبيه أو مادة صوتية أولية للتجريب.',
      parameterRoles: {
        mixer: 'هذا هو المِكسر الذي سيُستخدم معه المورد الصوتي الناتج عند تشغيله، وبذلك تعرف SDL3_mixer أي سياق مزج صوتي يجب أن ينسجم معه هذا الصوت.',
        hz: 'هذا المعامل يحدد تردد الموجة الجيبية نفسها، أي الطبقة السمعية للنغمة الناتجة وارتفاعها أو انخفاضها.',
        amplitude: 'هذا المعامل يحدد سعة الإشارة الصوتية، أي شدة الصوت أو مستوى ارتفاعه داخل المورد الذي ستولده الدالة.',
        ms: 'هذا المعامل يحدد الحد الأقصى لمدة الصوت المولد بالمللي ثانية، أو يطلب توليد صوت مستمر إذا كانت القيمة سالبة.'
      },
      parameterPurposes: {
        mixer: 'لأن SDL3_mixer يحتاج معرفة أي مِكسر سيتعامل مع هذا المورد الصوتي إذا كنت تريد توافقه مع مِكسر محدد، مع السماح بتمرير NULL عند عدم الحاجة إلى هذا الربط.',
        hz: 'لأن الموجة الجيبية لا تُولد عشوائيًا؛ بل تحتاج ترددًا عدديًا يحدد شكل الإشارة وطبقة النغمة الناتجة.',
        amplitude: 'لأن الدالة تحتاج قيمة عددية تحدد سعة الإشارة حتى تعرف هل الصوت سيكون مرتفعًا أم منخفضًا أم شبه صامت.',
        ms: 'لأن الدالة تحتاج حدًا زمنيًا تقف عنده عملية التوليد، أو إشارة صريحة إلى أن التوليد يجب أن يستمر بلا نهاية محددة.'
      },
      parameterUsage: {
        mixer: 'مرر MIX_Mixer صالحًا إذا كنت تريد أن يُنشأ الصوت متوافقًا مع مِكسر معروف في تطبيقك، أو مرر NULL إذا لم تكن تريد تقييده بمِكسر بعينه.',
        hz: 'مرر قيمة عددية صحيحة تمثل التردد بوحدة هرتز، مثل 440 لنغمة متوسطة مألوفة أو قيمة أعلى أو أقل بحسب الطبقة التي تريدها.',
        amplitude: 'مرر قيمة عائمة بين 0.0f و1.0f؛ القيم القريبة من 0 تجعل الصوت خافتًا جدًا، والقيم القريبة من 1.0f تجعله أعلى شدة.',
        ms: 'مرر عددًا موجبًا إذا كنت تريد صوتًا بطول محدد، مثل 250 أو 1000 مللي ثانية، أو مرر قيمة سالبة إذا كنت تريد أن يظل الصوت قابلًا للتوليد المستمر.'
      }
    };
  }

  const mixerProfile = buildSdl3MixerFunctionProfile(item, returnMeaning);
  if (mixerProfile) {
    return mixerProfile;
  }

  const genericMatch = /^SDL_Get(Gamepad|Joystick|Haptic|Keyboard|Mouse)(Name|GUID|Path|PlayerIndex|ProductVersion|Product|Vendor|Type)ForID$/.exec(name);
  const gamepadMapping = name === 'SDL_GetGamepadMappingForID';
  const realGamepadType = name === 'SDL_GetRealGamepadTypeForID';

  let deviceLabel = '';
  let attribute = '';
  if (genericMatch) {
    const deviceMap = {
      Gamepad: 'يد التحكم',
      Haptic: 'جهاز الارتجاع اللمسي',
      Joystick: 'عصا التحكم',
      Keyboard: 'لوحة المفاتيح',
      Mouse: 'الفأرة'
    };
    deviceLabel = deviceMap[genericMatch[1]] || 'الجهاز';
    attribute = genericMatch[2];
  } else if (gamepadMapping || realGamepadType) {
    deviceLabel = 'يد التحكم';
    attribute = gamepadMapping ? 'Mapping' : 'RealType';
  } else {
    return null;
  }

  const base = buildInstanceIdHelp(deviceLabel);
  const profileByAttribute = {
    Name: {
      objectMeaning: `اسم ${deviceLabel} المحددة بمعرّفها`,
      meaning: `تجلب الاسم الذي تعيده المنصة أو برنامج التشغيل للجهاز المشار إليه بهذا المعرّف (${deviceLabel})، حتى تتمكن من عرضه للمستخدم أو تسجيله دون فتح الجهاز نفسه.`,
      purpose: 'تستخدمها عندما تبني قائمة بالأجهزة المكتشفة أو سجلًا تشخيصيًا وتريد اسمًا قابلًا للقراءة بدل الاعتماد على المعرّف العددي فقط.',
      operation: `تقرأ المعرّف الذي مررته، ثم تستعلم SDL من سجل الأجهزة عن الاسم المقترن بهذا الجهاز. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في واجهات اختيار الأجهزة والرسائل التشخيصية، لأنك تحصل على اسم مفهوم بدل التعامل مع رقم أو معرّف داخلي فقط.',
      when: `استخدمها بعد اكتشاف ${deviceLabel} والحصول على معرّفها إذا كنت بحاجة إلى اسم للعرض أو للتسجيل.`
    },
    GUID: {
      objectMeaning: `بصمة GUID الخاصة بـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: `تجلب بصمة GUID التي تستخدمها SDL لتمييز الجهاز المشار إليه بهذا المعرّف (${deviceLabel}) ومطابقته مع الخرائط أو ملفات التعريف المناسبة.`,
      purpose: 'تستخدمها عندما تحتاج توقيعًا ثابتًا نسبيًا للمطابقة بين الأجهزة المتشابهة أو لاختيار mapping مناسب للجهاز.',
      operation: `تقرأ المعرّف ثم تستعلم من SDL عن GUID المسجل لهذا الجهاز في قاعدة بيانات الإدخال، ثم ${returnMeaning}.`,
      benefit: 'تفيد في المطابقة بين العتاد وملفات التعريف الجاهزة، وتمنحك معرفًا أوثق من الاسم وحده عند التفريق بين أجهزة متشابهة.',
      when: `استخدمها عندما تحتاج التحقق من هوية ${deviceLabel} أو ربطها بملف تعريف أو mapping محدد.`
    },
    Path: {
      objectMeaning: `المسار أو المعرّف النصي لـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: `تجلب المسار أو المعرّف النصي الذي يربط SDL بهذا الجهاز داخل النظام، وهو مفيد للتشخيص أو لتتبع الجهاز على مستوى النظام.`,
      purpose: 'تستخدمها عندما تحتاج معرفة أي مسار نظام أو مرجع نصي يقف خلف الجهاز الذي اكتشفته SDL، وليس فقط اسمه المعروض.',
      operation: `تقرأ المعرّف ثم تستعلم SDL عن المسار النصي المقترن بهذا الجهاز في طبقة النظام، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وربط سجلات SDL مع سجلات النظام أو عند الحاجة إلى تمييز جهازين يحملان الاسم نفسه.',
      when: `استخدمها عندما تحتاج تتبع ${deviceLabel} على مستوى النظام أو تسجيل معلومات تشخيصية أدق من الاسم فقط.`
    },
    PlayerIndex: {
      objectMeaning: `رقم اللاعب المرتبط بـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: 'تجلب رقم اللاعب المرتبط حاليًا بهذا الجهاز، أي أي خانة لاعب تعتبرها SDL أو المنصة مرتبطة بهذا الإدخال.',
      purpose: 'تستخدمها عندما تريد إظهار ربط كل جهاز بلاعب معين أو عند توزيع الأجهزة على اللاعبين داخل اللعبة.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن رقم اللاعب المرتبط بهذا الجهاز إن وجد، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في شاشات الانضمام المحلية وتوزيع أجهزة الإدخال على اللاعبين، بدل حفظ هذا الربط في طبقة منفصلة وحدها.',
      when: 'استخدمها عندما يكون سلوك اللعبة أو الواجهة مرتبطًا بخانة اللاعب التي يتبع لها هذا الجهاز.'
    },
    Product: {
      objectMeaning: `معرّف المنتج العتادي لـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: 'تجلب رقم المنتج العتادي للجهاز المشار إليه بهذا المعرّف، وهو الرقم الذي يميز طراز الجهاز لدى الشركة المصنّعة.',
      purpose: 'تستخدمها عندما تحتاج التمييز بين طرازات متعددة من الشركة نفسها أو عند بناء منطق خاص بجهاز معين.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن Product ID المسجل لهذا الجهاز، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في المطابقة الدقيقة مع العتاد وفي التشخيص، لأن الاسم التجاري قد لا يميز بين مراجعات أو طرازات متقاربة.',
      when: `استخدمها عندما تحتاج قرارًا يعتمد على طراز ${deviceLabel} نفسه لا على اسمه فقط.`
    },
    ProductVersion: {
      objectMeaning: `إصدار المنتج أو مراجعة العتاد لـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: 'تجلب رقم إصدار المنتج أو مراجعة العتاد لهذا الجهاز، حتى تستطيع التفريق بين نسخ مختلفة من الطراز نفسه.',
      purpose: 'تستخدمها عندما يؤثر إصدار العتاد أو مراجعته في التوافق أو في اختيار حلول خاصة بمراجعة معينة.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن Product Version المسجل لهذا الجهاز، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد عندما يكون لطراز واحد أكثر من مراجعة عتادية تختلف في السلوك أو في المشكلات المعروفة.',
      when: 'استخدمها عندما تحتاج تمييز مراجعة الجهاز أو إصدار عتاده بدل الاكتفاء باسم المنتج العام.'
    },
    Vendor: {
      objectMeaning: `معرّف الشركة المصنّعة لـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: 'تجلب رقم الشركة المصنّعة للجهاز المشار إليه بهذا المعرّف، وهو معرّف Vendor ID المستخدم في توصيف العتاد.',
      purpose: 'تستخدمها عندما تريد معرفة الشركة المصنّعة الفعلية للجهاز أو بناء استثناءات خاصة بمورّد معين.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن Vendor ID المسجل لهذا الجهاز، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص والدعم الخاص بالمورّد، لأن الاسم الظاهر للمستخدم قد لا يكشف الشركة المصنّعة بدقة.',
      when: 'استخدمها عندما يكون قرارك البرمجي أو سجلك التشخيصي مرتبطًا بالشركة المصنّعة للجهاز.'
    },
    Type: {
      objectMeaning: `النوع العام لـ ${deviceLabel} المحددة بمعرّفها`,
      meaning: `تجلب التصنيف العام الذي تعتمد عليه SDL للجهاز المشار إليه بهذا المعرّف (${deviceLabel})، حتى تعرف فئته الوظيفية دون فتحه أو تحليل اسمه يدويًا.`,
      purpose: 'تستخدمها عندما تريد اتخاذ قرار برمجي بناءً على فئة الجهاز نفسها، لا على الاسم التجاري أو على خصائص منصة خام.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن النوع العام المسجل لهذا الجهاز في طبقة الإدخال، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في اختيار مسار التعامل الصحيح مع الجهاز اعتمادًا على تصنيف محمول تديره SDL بدل بيانات منصة غير مستقرة.',
      when: `استخدمها عندما يعتمد تنفيذك التالي على نوع ${deviceLabel} أو فئتها العامة كما تصنفها SDL.`
    },
    Mapping: {
      objectMeaning: 'خريطة أزرار يد التحكم المحددة بمعرّفها',
      meaning: 'تجلب سلسلة mapping التي تترجم أزرار ومحاور يد التحكم الخام إلى تخطيط SDL_Gamepad القياسي، حتى تعرف كيف ستفسر SDL هذا الجهاز فعليًا.',
      purpose: 'تستخدمها عندما تحتاج فحص أو عرض أو تسجيل التخطيط الفعلي الذي ستعتمده SDL لهذا الجهاز، أو عند مقارنة mapping حالي بآخر مخصص.',
      operation: `تقرأ المعرّف، ثم تستخرج SDL سلسلة الربط المسجلة ليد التحكم هذه، والتي تربط الإدخال الخام بأزرار ومحاور واجهة SDL_Gamepad القياسية. بعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في التشخيص وتخصيص الدعم للأجهزة، لأنك ترى بوضوح كيف تُحوّل SDL الإدخال الخام إلى تخطيط موحد داخل اللعبة.',
      when: 'استخدمها عندما تحتاج فحص mapping الحالي للجهاز أو عرضه أو مقارنة إعداد SDL الفعلي بإعداد مخصص لديك.'
    },
    RealType: {
      objectMeaning: 'النوع الحقيقي ليد التحكم المحددة بمعرّفها',
      meaning: 'تجلب الفئة الحقيقية ليد التحكم كما استنتجتها SDL من العتاد أو من قواعد المطابقة، لا مجرد تصنيف عام قد ينتج عن تغليف الجهاز أو عن توافقه مع أجهزة أخرى.',
      purpose: 'تستخدمها عندما تحتاج معرفة ما إذا كانت يد التحكم تشبه فعليًا Xbox أو PlayStation أو فئة أخرى لأن هذا قد يؤثر في عرض الأزرار أو في التلميحات البصرية.',
      operation: `تقرأ المعرّف، ثم تستعلم SDL عن نوع يد التحكم الحقيقي الذي انتهت إليه طبقة المطابقة الداخلية، وبعد ذلك ${returnMeaning}.`,
      benefit: 'تفيد في عرض رموز الأزرار الصحيحة وفي تخصيص الخبرة حسب فئة اليد الحقيقية بدل الاعتماد على اسم أو تصنيف عام أقل دقة.',
      when: 'استخدمها عندما تحتاج قرارًا بصريًا أو وظيفيًا يعتمد على فئة يد التحكم الحقيقية لا على مجرد وجودها كجهاز Gamepad.'
    }
  };

  const profile = profileByAttribute[attribute];
  return profile ? {...profile, ...base} : null;
}
