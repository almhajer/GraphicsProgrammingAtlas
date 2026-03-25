// ArabicVulkan - extracted heavy global helper functions from js/app.js (phase324)

function buildSyntheticExtensionNameValue(name) {
  const stem = String(name || '').replace(/_EXTENSION_NAME$/g, '');
  const parts = stem.split('_');
  if (parts.length < 3) {
    return '';
  }

  return `"${parts.slice(0, 2).join('_')}_${parts.slice(2).map((part) => part.toLowerCase()).join('_')}"`;
}

function buildSyntheticMacroItem(rawName) {
  const name = String(rawName || '').trim();
  if (
    !/^VK_[A-Z0-9_]+$/.test(name) ||
    !(
      /^VK_USE_PLATFORM_/.test(name) ||
      /^VK_(MAKE_API_VERSION|MAKE_VERSION|API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH|HEADER_VERSION|HEADER_VERSION_COMPLETE|API_VERSION_\d+_\d+)$/.test(name) ||
      /^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name) ||
      /^VK_NULL_HANDLE$/.test(name) ||
      /_EXTENSION_NAME$/.test(name) ||
      /_SPEC_VERSION$/.test(name)
    )
  ) {
    return null;
  }

  let description = `${name} معرّف ثابت من فولكان يُستخدم داخل الكود لتمرير قيمة رسمية أو لاختبار حالة أو لتفعيل مسار محدد.`;
  let usage = [
    `استخدم ${name} كما هو بدل الأرقام أو النصوص الحرفية حتى يبقى الكود متوافقاً مع تعريفات الترويسات الرسمية.`,
    'إذا ظهر هذا الرمز في الأمثلة أو داخل الحقول، فإن فولكان أو التطبيق يتعامل مع قيمته الرسمية لا مع اسمه النصي.'
  ];
  let notes = [
    'هذه صفحة محلية مولدة لأن هذا الرمز لم يكن له شرح منفصل داخل قاعدة البيانات الحالية بعد.',
    'يمكنك دائماً فتح وثائق Vulkan الرسمية من أسفل الصفحة لرؤية التعريف الأصلي في المرجع.'
  ];
  let example = `auto value = ${name};`;
  let value = '';

  if (/_EXTENSION_NAME$/.test(name)) {
    value = buildSyntheticExtensionNameValue(name);
    description = `${name} ماكرو ثابت يتوسع إلى الاسم النصي الرسمي للامتداد المقابل في فولكان، ويُستخدم عند فحص دعم الامتداد أو عند تمريره في قوائم التفعيل داخل المثيل أو الجهاز.`;
    usage = [
      `يُمرَّر ${name} عادة داخل مصفوفات الامتدادات مثل ppEnabledExtensionNames أو عند مقارنة أسماء الامتدادات التي يعيدها فولكان.`,
      'الفائدة العملية هي تجنب كتابة اسم الامتداد كسلسلة نصية حرفية قد تُكتب بشكل خاطئ.'
    ];
    example = `const char* requiredExtensions[] = {\n    ${name}\n};`;
  } else if (/_SPEC_VERSION$/.test(name)) {
    description = `${name} ماكرو ثابت يحمل رقم إصدار مواصفة الامتداد أو الميزة كما عرّفته ترويسة فولكان التي تبني عليها الآن.`;
    usage = [
      `يُستخدم ${name} عندما تحتاج مقارنة نسخة الامتداد التي تتوقعها الترويسات مع النسخة التي يعلنها السائق.`,
      'هذا الرمز مهم في أدوات الفحص أو رسائل التشخيص، لكنه لا يغيّر سلوك وقت التشغيل بذاته ما لم تستخدم قيمته في منطق التطبيق.'
    ];
    example = `uint32_t expectedSpecVersion = ${name};`;
  } else if (/^VK_STRUCTURE_TYPE_/.test(name)) {
    description = `${name} قيمة ثابتة من VkStructureType تُكتب في الحقل sType حتى تعرف دوال فولكان أن البنية الممررة من النوع الصحيح.`;
    usage = [
      `اكتب ${name} في الحقل sType قبل تمرير البنية إلى الدالة المرتبطة بها.`,
      'إذا استُخدمت قيمة sType غير صحيحة، فستفسر فولكان الحقول التالية على أنها بنية مختلفة أو سترفضها طبقات التحقق.'
    ];
    example = `createInfo.sType = ${name};`;
  } else if (/^VK_(SUCCESS|NOT_READY|TIMEOUT|EVENT_SET|EVENT_RESET|INCOMPLETE|ERROR_)/.test(name)) {
    description = `${name} قيمة نتيجة رسمية من VkResult تُستخدم لتمييز نجاح الاستدعاء أو حالته الخاصة أو سبب فشله.`;
    usage = [
      `قارن القيمة المرجعة من الدالة مع ${name} لتحديد مسار المتابعة الصحيح.`,
      'هذه الرموز تغيّر منطق التطبيق بعد الاستدعاء: هل يكمل التنفيذ، أم يعيد المحاولة، أم يعالج خطأً صريحاً.'
    ];
    example = `if (result == ${name}) {\n    // تعامل مع هذه الحالة\n}`;
  } else if (/^VK_USE_PLATFORM_/.test(name)) {
    description = `${name} ماكرو خاص بالمنصة يفعّل الترجمة الشرطية داخل ترويسة فولكان حتى تُدرج الأنواع والدوال المرتبطة بهذه المنصة أثناء الترجمة.`;
    usage = [
      `يُعرَّف ${name} عادة قبل تضمين vulkan.h عندما تريد دعم منصة نافذة محددة مثل Win32 أو Xlib أو Wayland.`,
      'هذا الرمز لا ينفذ شيئاً أثناء وقت التشغيل، لكنه يغيّر ما الذي يعرّفه المعالج المسبق داخل الترويسات.'
    ];
    example = `#define ${name}\n#include <vulkan/vulkan.h>`;
  } else if (/^VK_(TRUE|FALSE|NULL_HANDLE|WHOLE_SIZE)/.test(name)) {
    description = `${name} قيمة ثابتة خاصة من فولكان تُستخدم كقيمة موحدة في الحقول أو المقارنات بدل الاعتماد على أرقام حرفية داخل الكود.`;
    usage = [
      `استخدم ${name} عندما تتوقع الدالة أو البنية هذه القيمة الرسمية تحديداً.`,
      'هذا يحافظ على وضوح الكود ويجعل المعنى البرمجي مطابقاً لما تتوقعه المواصفة.'
    ];
    example = `bufferInfo.range = ${name};`;
  }

  return {
    name,
    description,
    usage,
    notes,
    example,
    value,
    syntax: value ? `#define ${name} ${value}` : `#define ${name} ...`,
    isSynthetic: true,
    syntheticKind: 'macro'
  };
}

function buildSyntheticTypeItem(rawName) {
  const name = normalizeLookupName(rawName);
  if (!/^Vk[A-Za-z0-9_]+$/.test(name)) {
    return null;
  }

  const isScalarType = /^(VkBool32|VkFlags|VkFlags64|VkDeviceSize|VkDeviceAddress|VkSampleMask|VkRemoteAddressNV|VkDeviceMemoryReportFlagsEXT)$/.test(name);
  const isStructureLike = /(Info|CreateInfo|BeginInfo|EndInfo|Properties\d*|Features\d*|State(CreateInfo)?|Callbacks|Requirements\d*|Range|Binding|Description|Region|Extent\d*|Offset\d*|Rect\d*|Viewport|Clear|Submit|Barrier|MemoryRequirements|Limits|Capabilities)/.test(name);
  const syntheticGroup = isScalarType || !isStructureLike ? 'variable' : 'structure';
  const handleLike = syntheticGroup === 'variable' && !isScalarType && !/Flags|Bool32/.test(name);

  let description = `${name} نوع Vulkan محلي التفسير يمثل قيمة أو كائناً أو بنية تستخدمها الدوال لفهم الطلب البرمجي أثناء التنفيذ.`;
  let usage = [
    `يظهر ${name} داخل معاملات الدوال أو الحقول عندما تحتاج Vulkan هذا النوع بالذات لتفسير العملية.`,
    'هذه الصفحة مولدة محلياً لأن النوع لم يكن له شرح منفصل داخل قاعدة البيانات الحالية بعد.'
  ];
  let example = `${name} value = {};`;

  if (name === 'VkDeviceSize') {
    description = 'VkDeviceSize نوع عددي 64-bit يمثل Size أو Offset بوحدة Bytes عند وصف أحجام الذاكرة أو المسافات داخل Buffer أو Image data.';
    usage = [
      'يُستخدم هذا النوع في الحقول التي تصف حجم مورد أو مدى ذاكرة أو Byte Offset داخل Buffer.',
      'عندما تقرأ Vulkan هذه القيمة فهي تتعامل معها كوحدة Bytes، لا كعدد عناصر أو فهرس.'
    ];
    example = 'VkDeviceSize bufferSize = 4096;';
  } else if (name === 'VkDeviceAddress') {
    description = 'VkDeviceAddress نوع عددي 64-bit يمثل عنوان GPU virtual address يشير إلى موضع بيانات داخل ذاكرة الجهاز يمكن لبعض أوامر Vulkan قراءتها مباشرة.';
    usage = [
      'يظهر في مسارات مثل buffer device address وray tracing عندما تحتاج Vulkan عنواناً مباشراً داخل ذاكرة الجهاز.',
      'تغيير هذه القيمة يغيّر الموضع الذي سيقرأ منه الـ GPU البيانات أثناء التنفيذ.'
    ];
    example = 'VkDeviceAddress address = vkGetBufferDeviceAddress(device, &addressInfo);';
  } else if (name === 'VkBool32') {
    description = 'VkBool32 نوع عددي 32-bit تستخدمه Vulkan لحمل القيم المنطقية الرسمية VK_TRUE وVK_FALSE داخل البنى والمعاملات.';
    usage = [
      'يُستخدم بدل bool العادي حتى تبقى ABI والتمثيلات الثنائية متوافقة بين C وC++ والمنصات المختلفة.',
      'عندما تقرأ Vulkan هذا النوع فهي تتوقع قيمة 32-bit من العائلة الرسمية للقيم المنطقية.'
    ];
    example = 'VkBool32 enabled = VK_TRUE;';
  } else if (name === 'VkFlags' || name === 'VkFlags64') {
    description = `${name} نوع عددي عام تستخدمه Vulkan لتخزين Bitmask من الأعلام التي يمكن جمعها معاً باستخدام العامل |.`;
    usage = [
      `يظهر ${name} في الأساس التخزيني للأنواع من نمط Flags أو FlagBits.`,
      'الفكرة الهندسية منه هي تمثيل عدة خيارات تشغيلية داخل قيمة واحدة يمكن للسائق أو الدالة قراءتها كمجموعة Bits.'
    ];
    example = `${name} flags = 0;`;
  } else if (handleLike) {
    description = `${name} مقبض Vulkan opaque يمثل ${inferHandleSubject(name)}. يحتفظ به التطبيق ويمرره لاحقاً إلى الدوال التي تعمل على هذا الكائن نفسه.`;
    usage = [
      `يُنشأ ${name} أو يُستلم من Vulkan ثم يُعاد تمريره في الاستدعاءات اللاحقة التي تحتاج الوصول إلى هذا المورد أو الكائن.`,
      'القيمة نفسها لا تحمل بيانات الكائن، بل هي Handle يربط التطبيق بالكائن الداخلي الذي يديره السائق.'
    ];
    example = `${name} handle = VK_NULL_HANDLE;`;
  } else if (isStructureLike) {
    description = `${name} بنية Vulkan تحمل حقولاً تقرؤها الدالة المرتبطة بها لتحديد الإعداد أو الخصائص أو الحالة أو النطاق الذي يجب أن تبني عليه التنفيذ.`;
    usage = [
      `املأ حقول ${name} بالقيم الفعلية ثم مرر البنية إلى الدالة التي تستقبلها حتى تقرأ Vulkan هذه القيم أثناء التنفيذ أو الإنشاء.`,
      'الفائدة الهندسية من هذا النوع هي تجميع القيم المترابطة في بنية واحدة بدلاً من تمريرها كمعاملات منفصلة كثيرة.'
    ];
    example = `${name} info = {};\ninfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;`;
  }

  return {
    name,
    description,
    usage,
    notes: [
      'هذه الصفحة مولدة محلياً كمرجع داخلي حتى يبقى التنقل داخل المشروع بدلاً من الخروج إلى موقع خارجي عند غياب صفحة مخصصة.',
      'افتح وثائق Vulkan الرسمية من أسفل الصفحة إذا كنت تريد النص المرجعي الأصلي لهذا النوع.'
    ],
    example,
    isSynthetic: true,
    syntheticKind: 'type',
    syntheticGroup
  };
}

function buildSyntheticConstantItem(rawName) {
  const name = String(rawName || '').trim();
  if (!/^(UINT(?:8|16|32|64)_(?:MAX|MIN)|INT(?:8|16|32|64)_(?:MAX|MIN)|SIZE_MAX)$/.test(name)) {
    return null;
  }

  let bits = '';
  let signedness = '';
  if (/^UINT(\d+)_/.test(name)) {
    bits = name.match(/^UINT(\d+)_/)[1];
    signedness = 'غير موقعة';
  } else if (/^INT(\d+)_/.test(name)) {
    bits = name.match(/^INT(\d+)_/)[1];
    signedness = 'موقعة';
  }

  const isMax = /_MAX$/.test(name);
  const description = name === 'SIZE_MAX'
    ? 'SIZE_MAX ثابت عددي من مكتبة C/C++ يمثل أكبر قيمة يمكن تخزينها في النوع size_t، ويظهر عادة عند التعبير عن حد أعلى للأحجام أو كقيمة sentinel خاصة بالأحجام.'
    : `${name} ثابت عددي عام يمثل ${isMax ? 'أكبر' : 'أصغر'} قيمة يمكن تمثيلها في عدد صحيح ${signedness} بعرض ${bits} بت.`;

  const usage = name === 'SIZE_MAX'
    ? [
      'يُستخدم عندما يحتاج الكود إلى حد أعلى مرتبط بالأحجام أو عدد البايتات أو كقيمة خاصة تعني "أقصى حجم ممكن".',
      'هذا الثابت لا ينتمي إلى Vulkan مباشرة، لكنه يظهر في أمثلة Vulkan عندما يحتاج الكود قيمة حدية واضحة ومحمولة بين المنصات.'
    ]
    : [
      `يُستخدم ${name} عندما يحتاج الكود قيمة حدية قصوى أو دنيا من نفس العائلة العددية، مثل مهلة مفتوحة أو Sentinel value أو فحص حدود.`,
      'عندما تقرأ الدالة هذه القيمة فهي تتعامل معها كرقم فعلي كامل، لا كخيار منطقي أو قيمة Enum.'
    ];

  return {
    name,
    description,
    usage,
    notes: [
      'هذه صفحة محلية مولدة لهذا الثابت العددي حتى يبقى التنقل داخل المشروع موحداً.',
      'هذا الثابت من مكتبة C/C++ القياسية، وليس من نواة Vulkan نفسها، لكنه يظهر كثيراً في أمثلة Vulkan.'
    ],
    example: `${name}`,
    value: name,
    isSynthetic: true,
    syntheticKind: 'constant'
  };
}

let variableTypeItemLookupCache = null;

function getVariableTypeItemLookup() {
  if (variableTypeItemLookupCache) {
    return variableTypeItemLookupCache;
  }

  const lookup = new Map();
  const collections = getVariableTypeCollections();
  ['handles', 'function_pointers', 'scalar_types'].forEach((key) => {
    (collections[key]?.items || []).forEach((item) => {
      if (!item?.name) {
        return;
      }
      const rawName = String(item.name).trim();
      const normalizedName = normalizeLookupName(rawName);
      if (!lookup.has(rawName)) {
        lookup.set(rawName, item);
      }
      if (normalizedName && !lookup.has(normalizedName)) {
        lookup.set(normalizedName, item);
      }
    });
  });

  variableTypeItemLookupCache = lookup;
  return lookup;
}

function findVariableTypeItemByName(rawName) {
  const lookupName = normalizeLookupName(rawName);
  const lookup = getVariableTypeItemLookup();
  return lookup.get(String(rawName || '').trim()) || lookup.get(lookupName) || null;
}

function resolveVulkanOpaqueTypeReferenceName(rawType) {
  const typeName = normalizeLookupName(rawType);
  if (!/^Vk[A-Za-z0-9_]+_T$/.test(typeName)) {
    return typeName;
  }

  const publicTypeName = typeName.replace(/_T$/, '');
  if (!/^Vk[A-Za-z0-9_]+$/.test(publicTypeName)) {
    return typeName;
  }

  return publicTypeName;
}

function getReturnValuesArray(item) {
  if (!item || !item.returnValues) return [];
  if (Array.isArray(item.returnValues)) return item.returnValues;
  return Object.entries(item.returnValues).map(([value, description]) => ({value, description}));
}

function getTypeNavigation(rawType) {
  const typeName = resolveVulkanOpaqueTypeReferenceName(rawType);
  if (!typeName.startsWith('Vk')) return null;

  if (findItemInCategories(vulkanData.structures, typeName)) {
    return {action: 'showStructure', name: typeName};
  }

  if (findVariableTypeItemByName(typeName)) {
    return {action: 'showStructure', name: typeName};
  }

  if (findItemInCategories(vulkanData.enums, typeName)) {
    return {action: 'showEnum', name: typeName};
  }

  return null;
}

function renderTypeReference(rawType) {
  const typeName = resolveVulkanOpaqueTypeReferenceName(rawType);
  const navigation = getTypeNavigation(rawType);

  if (!navigation) {
    return `<code>${rawType}</code>`;
  }

  const item = findTypeItemByName(typeName);
  const tooltip = buildTypeReferenceTooltip(rawType, item);
  return `<a href="#" class="type code-token code-link" title="${escapeAttribute(typeName)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${rawType}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${navigation.action}('${navigation.name}'); return false;"><code>${escapeHtml(rawType)}</code></a>`;
}

function inferCountUnitLabel(name) {
  const value = String(name || '');
  if (/vertexCount|firstVertex|maxVertex/i.test(value)) return 'رؤوس';
  if (/instanceCount|firstInstance|maxInstances/i.test(value)) return 'نسخ';
  if (/primitiveCount|maxPrimitive|primitiveCounts/i.test(value)) return 'بدائيات';
  if (/drawCount|maxDrawCount/i.test(value)) return 'أوامر رسم';
  if (/bindingCount|firstBinding/i.test(value)) return 'نقاط ربط';
  if (/descriptorCount/i.test(value)) return 'واصفات';
  if (/queueCount/i.test(value)) return 'طوابير';
  if (/commandBufferCount/i.test(value)) return 'مخازن أوامر';
  if (/attachmentCount/i.test(value)) return 'مرفقات';
  if (/regionCount/i.test(value)) return 'مناطق';
  if (/propertyCount|descriptionCount|count$/i.test(value)) return 'عناصر';
  return 'عناصر';
}

function getValueShapeKindArabicLabel(kind = '') {
  switch (kind) {
    case 'Bitmask':
      return 'قناع أعلام';
    case 'Enum value':
      return 'قيمة تعداد';
    case 'Pointer':
      return 'مؤشر';
    case 'Count':
      return 'عدد';
    case 'Offset':
      return 'إزاحة';
    case 'Size':
      return 'حجم';
    case 'Index':
      return 'فهرس';
    case 'Handle':
      return 'مقبض';
    default:
      return 'قيمة';
  }
}

function normalizeVulkanArabicTechnicalProse(text) {
  let source = decodeBasicHtmlEntities(String(text || ''))
    .replace(/\u00a0/g, ' ')
    .trim();

  if (!source) {
    return source;
  }

  const {masked, tokens} = maskAllowedVulkanNarrativeTokens(source);
  let localized = masked;
  const replacements = [
    [/\barray\/count pairing\b/gi, 'اقتران المصفوفة مع العدّاد'],
    [/\bstruct contract\b/gi, 'عقد البنية'],
    [/\bpNext chains?\b/gi, 'سلاسل pNext'],
    [/\bpipeline state\b/gi, 'حالة خط الأنابيب'],
    [/\bdescriptor layout\b/gi, 'مخطط الواصفات'],
    [/\battachment model\b/gi, 'نموذج المرفقات'],
    [/\bsynchronization scope\b/gi, 'نطاق المزامنة'],
    [/\bcommand recording\b/gi, 'تسجيل الأوامر'],
    [/\bdynamic rendering\b/gi, 'العرض الديناميكي'],
    [/\battachments\b/gi, 'المرفقات'],
    [/\battachment\b/gi, 'المرفق'],
    [/\barrays\b/gi, 'المصفوفات'],
    [/\barray\b/gi, 'المصفوفة'],
    [/\bfields\b/gi, 'الحقول'],
    [/\bfield\b/gi, 'الحقل'],
    [/\bGraphics Pipelines\b/gi, 'خطوط الأنابيب الرسومية'],
    [/\bGraphics Pipeline\b/gi, 'خط الأنابيب الرسومي'],
    [/\bPipeline Layout\b/gi, 'مخطط خط الأنابيب'],
    [/\bDescriptor Set Layout\b/gi, 'مخطط مجموعة الواصفات'],
    [/\bDescriptor Sets\b/gi, 'مجموعات الواصفات'],
    [/\bDescriptor Set\b/gi, 'مجموعة الواصفات'],
    [/\bDescriptor\b/gi, 'الواصف'],
    [/\bCommand Buffers\b/gi, 'مخازن الأوامر'],
    [/\bCommand Buffer\b/gi, 'مخزن الأوامر'],
    [/\bCommand Pool\b/gi, 'مجمع الأوامر'],
    [/\bRender Passes\b/gi, 'ممرات الرسم'],
    [/\bRender Pass\b/gi, 'ممر الرسم'],
    [/\bFramebuffers\b/gi, 'مخازن الإطار'],
    [/\bFramebuffer\b/gi, 'مخزن الإطار'],
    [/\bImage Views\b/gi, 'مناظير الصور'],
    [/\bImage View\b/gi, 'منظور الصورة'],
    [/\bShader Modules\b/gi, 'وحدات المظلّل'],
    [/\bShader Module\b/gi, 'وحدة المظلّل'],
    [/\bVertex Shader\b/gi, 'مظلّل الرؤوس'],
    [/\bFragment Shader\b/gi, 'مظلّل الأجزاء'],
    [/\bGeometry Shader\b/gi, 'مظلّل الهندسة'],
    [/\bCompute Shader\b/gi, 'مظلّل الحوسبة'],
    [/\bShaders\b/gi, 'المظلّلات'],
    [/\bShader\b/gi, 'المظلّل'],
    [/\bPipelines\b/gi, 'خطوط الأنابيب'],
    [/\bPipeline\b/gi, 'خط الأنابيب'],
    [/\bswapchain\b/gi, 'سلسلة التبديل'],
    [/\bBegin\b/gi, 'البدء'],
    [/\bRecord(?:ing)?\b/gi, 'التسجيل'],
    [/\bEnd\b/gi, 'الإنهاء'],
    [/\bBind(?:ing)?\b/gi, 'الربط'],
    [/\bSubmit(?:ting)?\b/gi, 'الإرسال'],
    [/\bPresent(?:ation)?\b/gi, 'العرض'],
    [/\bLayouts\b/gi, 'المخططات'],
    [/\bLayout\b/gi, 'المخطط'],
    [/\bSampler\b/gi, 'السامبلر']
  ];

  replacements.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });

  localized = localized
    .replace(/\s+([،.:;!؟])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim();

  return unmaskAllowedVulkanNarrativeTokens(localized, tokens);
}

function hasResidualVulkanEnglishProse(text) {
  const clean = stripMarkup(text);
  if (!clean) {
    return false;
  }

  const {masked} = maskAllowedVulkanNarrativeTokens(clean);
  return /[A-Za-z]{3,}/.test(masked);
}

function preferStrictArabicVulkanText(rawText, fallback = '') {
  const clean = normalizeVulkanArabicTechnicalProse(stripMarkup(rawText)
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim());
  const fallbackClean = normalizeVulkanArabicTechnicalProse(stripMarkup(fallback)
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim());

  if (!clean) {
    return fallbackClean;
  }

  if (hasResidualVulkanEnglishProse(clean) && fallbackClean) {
    return fallbackClean;
  }

  return clean;
}

function normalizeVulkanEnumNarrativeText(rawText) {
  return stripMarkup(rawText)
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\bAPI\b/gi, 'الواجهة')
    .replace(/الـ\s+الواجهة/g, 'الواجهة')
    .replace(/\btrue\/false\b/gi, 'قيمتين منطقيتين فقط')
    .replace(/\btrue\b/gi, 'قيمة منطقية صحيحة')
    .replace(/\bfalse\b/gi, 'قيمة منطقية خاطئة')
    .replace(/\btimeout\b/gi, 'مهلة الانتظار')
    .replace(/\bPresentation\b/gi, 'التقديم')
    .replace(/\bSwapchain\b/gi, 'VkSwapchainKHR')
    .replace(/\bcommand buffers?\b/gi, 'كائنات VkCommandBuffer')
    .replace(/\bCommand Pool\b/gi, 'VkCommandPool')
    .replace(/\bframebuffers?\b/gi, 'كائنات VkFramebuffer')
    .replace(/\bRender Pass\b/gi, 'VkRenderPass')
    .replace(/\bsubpasses?\b/gi, (match) => (/es$/i.test(match) ? 'الممرات الفرعية' : 'الممر الفرعي'))
    .replace(/\bsemaphores?\b/gi, 'كائنات VkSemaphore')
    .replace(/\bshader modules?\b/gi, 'وحدات المظلّل')
    .replace(/\bfragment shader\b/gi, 'مرحلة المظلّل الجزئي')
    .replace(/\bvertex shader\b/gi, 'مرحلة مظلل الرؤوس')
    .replace(/\bcompute shader\b/gi, 'مرحلة مظلل الحوسبة')
    .replace(/\bshader\b/gi, 'المظلّل')
    .replace(/\bpipeline\b/gi, 'خط الأنابيب')
    .replace(/\bviewport\b/gi, 'منطقة العرض')
    .replace(/\bscissor\b/gi, 'مستطيل القص')
    .replace(/\bGPU\b/g, 'المعالج الرسومي')
    .replace(/\bgraphics\b/gi, 'الرسوميات')
    .replace(/\bcompute\b/gi, 'الحوسبة')
    .replace(/\bmodule\b/gi, 'وحدة')
    .replace(/\bmultisampling\b/gi, 'تعدد العينات')
    .replace(/\bV-?Sync\b/gi, 'التزامن العمودي')
    .replace(/\btearing\b/gi, 'تمزق الصورة')
    .replace(/\bsRGB\b/g, 'إس آر جي بي')
    .replace(/\bBGRA\b/g, 'الترتيب الأزرق ثم الأخضر ثم الأحمر ثم ألفا')
    .replace(/\bFIFO\b/g, 'الطابور المتسلسل')
    .replace(/\bMAILBOX\b/g, 'استبدال أحدث إطار')
    .replace(/\bIMMEDIATE\b/g, 'العرض الفوري')
    .replace(/\bLINE_LIST\b/g, 'قائمة الخطوط')
    .replace(/\bLINE_STRIP\b/g, 'شريط الخطوط')
    .replace(/\bTRIANGLE_LIST\b/g, 'قائمة المثلثات')
    .replace(/\bTRIANGLE_STRIP\b/g, 'شريط المثلثات')
    .replace(/\bTRIANGLE_FAN\b/g, 'مروحة المثلثات')
    .replace(/\bTOP_OF_PIPE\b/g, 'بداية خط الأنابيب')
    .replace(/\bBOTTOM_OF_PIPE\b/g, 'نهاية خط الأنابيب')
    .replace(/\bCOLOR_ATTACHMENT_OUTPUT\b/g, 'إخراج مرفق اللون')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGenericEnumNarrativeText(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) {
    return true;
  }

  return /يستخدم لتحديد|يحدد قيماً رسمية|تحدد مجموعة قيم|تختار(?:\s+\S+){0,4}\s+(?:السلوك|السياسة|الحالة)|الحالة أو السلوك|خيارات تنفيذية يمكن جمعها معاً لتعديل سلوك|المعنى الذي يعبّر عنه الاسم|قيمة من تعداد/.test(clean);
}

function splitVkCamelTokens(name) {
  return String(name || '')
    .replace(/^Vk/, '')
    .replace(/FlagBits/g, ' Flag Bits ')
    .replace(/Flags/g, ' Flags ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.toUpperCase());
}

function getEnumValueCoreTokens(valueName, enumName = '') {
  const valueTokens = String(valueName || '')
    .replace(/^VK_/, '')
    .split('_')
    .filter(Boolean);
  const enumTokens = splitVkCamelTokens(enumName).filter((token) => !/^(FLAG|FLAGS|BIT|BITS)$/.test(token));
  const vendorPattern = getEnumVendorTokenPattern();
  let offset = 0;
  while (offset < valueTokens.length && offset < enumTokens.length && valueTokens[offset] === enumTokens[offset]) {
    offset += 1;
  }

  const filtered = valueTokens
    .slice(offset)
    .filter((token) => !/^(FLAG|FLAGS|BIT|BITS)$/.test(token) && !vendorPattern.test(token));

  if (filtered.length) {
    return filtered;
  }

  return valueTokens.filter((token) => !vendorPattern.test(token) && token !== 'VK');
}

function translateEnumWordToken(token) {
  const map = {
    RESULT: 'النتيجة',
    SUCCESS: 'نجاح كامل',
    SUBOPTIMAL: 'نجاح مع حالة دون المثالية',
    ERROR: 'خطأ',
    OUT: 'فقدان',
    DATE: 'التوافق الحالي',
    NOT: 'عدم',
    READY: 'الجاهزية',
    TIMEOUT: 'انتهاء المهلة',
    INCOMPLETE: 'نتيجة غير مكتملة',
    PRESENT: 'العرض',
    MODE: 'النمط',
    IMMEDIATE: 'الفوري',
    MAILBOX: 'استبدال أحدث إطار',
    FIFO: 'الطابور المتسلسل',
    RELAXED: 'المرن',
    TOP: 'بداية',
    BOTTOM: 'نهاية',
    PIPE: 'الخط',
    OF: '',
    COLOR: 'اللون',
    ATTACHMENT: 'المرفق',
    OUTPUT: 'الإخراج',
    FRAGMENT: 'الأجزاء',
    VERTEX: 'الرؤوس',
    COMPUTE: 'الحوسبة',
    SHADER: 'المظلّل',
    POINT: 'النقطة',
    LINE: 'الخط',
    TRIANGLE: 'المثلث',
    LIST: 'المستقلة',
    STRIP: 'المتصلة',
    FAN: 'المروحة',
    IMAGE: 'الصورة',
    LAYOUT: 'التخطيط',
    GENERAL: 'العام',
    UNDEFINED: 'غير المهيأ',
    TRANSFER: 'النسخ',
    SRC: 'المصدر',
    DST: 'الوجهة',
    OPTIMAL: 'الأمثل',
    FORMAT: 'التنسيق',
    COLORSPACE: 'فضاء اللون',
    COLOR_SPACE: 'فضاء اللون',
    SRGB: 'إس آر جي بي',
    NONLINEAR: 'غير الخطي',
    OPAQUE: 'معتم',
    PRE: 'مسبق',
    POST: 'لاحق',
    MULTIPLIED: 'الضرب',
    INHERIT: 'الوراثة',
    EXCLUSIVE: 'الحصرية',
    CONCURRENT: 'المتزامنة',
    GRAPHICS: 'الرسوميات',
    PRIMARY: 'الأساسي',
    SECONDARY: 'الثانوي',
    SAMPLE: 'العينة',
    COUNT: 'العدد',
    LOAD: 'التحميل',
    STORE: 'الحفظ',
    CLEAR: 'المسح',
    DONT: 'عدم',
    CARE: 'الاهتمام',
    LEVEL: 'المستوى',
    BIND: 'الربط',
    POINTS: 'النقاط',
    B8G8R8A8: 'الترتيب الأزرق ثم الأخضر ثم الأحمر ثم ألفا',
    UNORM: 'التطبيع غير الموقّع',
    SNORM: 'التطبيع الموقّع',
    UINT: 'عدد صحيح غير موقّع',
    SINT: 'عدد صحيح موقّع',
    SFLOAT: 'عدد عائم موقّع',
    FLOAT: 'عدد عائم'
  };

  return map[token] || (/^\d+$/.test(token) ? token : '');
}

function buildEnumTokenPhrase(valueName, enumName = '') {
  const phrase = getEnumValueCoreTokens(valueName, enumName)
    .map((token) => translateEnumWordToken(token))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return phrase;
}

function buildStructureTypeNameFromValue(valueName) {
  const vendorPattern = getEnumVendorTokenPattern();
  const tokens = String(valueName || '')
    .replace(/^VK_STRUCTURE_TYPE_/, '')
    .split('_')
    .filter(Boolean);
  const vendorTokens = [];

  while (tokens.length && vendorPattern.test(tokens[tokens.length - 1])) {
    vendorTokens.unshift(tokens.pop());
  }

  const body = tokens
    .map((token) => token.charAt(0) + token.slice(1).toLowerCase())
    .join('');
  const suffix = vendorTokens.join('');
  return body ? `Vk${body}${suffix}` : 'البنية المطلوبة';
}

function buildEnumUsageContextText(context = {}) {
  const parts = [];
  if (context.fieldName) {
    parts.push(`في الحقل ${context.fieldName}`);
  }
  if (context.ownerType) {
    parts.push(`داخل ${context.ownerType}`);
  }
  if (context.functionName) {
    parts.push(`عند استدعاء ${context.functionName}`);
  }
  return parts.join('، ');
}

function inferTypeExecutionDomain(name) {
  const value = String(name || '');
  if (/AccelerationStructure|RayTracing|Micromap|Aabb|Geometry|BLAS|TLAS|BVH/.test(value)) return 'بناء واستخدام بنى التسارع';
  if (/Swapchain|Present|Display|Surface/.test(value)) return 'العرض والربط مع نظام النوافذ';
  if (/Memory|Allocation|Allocate|BindMemory|Mapped|Sparse/.test(value)) return 'إدارة الذاكرة والربط بالموارد';
  if (/CommandBuffer|CommandPool|Cmd/.test(value)) return 'تسجيل الأوامر وتجهيز أوامر المعالج الرسومي';
  if (/Queue|Submit|Fence|Semaphore|Event|Barrier/.test(value)) return 'المزامنة والإرسال إلى الطوابير';
  if (/RenderPass|Subpass|Attachment|Framebuffer/.test(value)) return 'تنظيم الرسم والمرفقات داخل مسار الرسم';
  if (/Pipeline|Shader|Descriptor|Sampler|PushConstant/.test(value)) return 'خط الأنابيب وربط الموارد مع المظلّلات';
  if (/Image|ImageView/.test(value)) return 'إدارة الصور واستخدامها في الرسم أو النسخ أو العرض';
  if (/Buffer|BufferView/.test(value)) return 'إدارة المخازن والوصول إلى البيانات';
  if (/PhysicalDevice|Device/.test(value)) return 'تهيئة الجهاز وقراءة قدراته أو إنشاء الجهاز المنطقي';
  if (/Video|Session|Coding/.test(value)) return 'مسار الفيديو وترميز الإطارات أو فكها';
  return 'المسار التنفيذي المرتبط بهذا العنصر داخل Vulkan';
}

function buildEnumTypeMeaningFallback(enumName) {
  const name = String(enumName || '');
  const domain = inferTypeExecutionDomain(name);

  if (name === 'VkResult') {
    return 'تعداد نتائج الاستدعاءات في Vulkan. كل قيمة فيه تصف النهاية الفعلية للاستدعاء: نجاح كامل، حالة انتقالية تحتاج متابعة، أو خطأ يوقف هذا المسار.';
  }
  if (name === 'VkStructureType') {
    return 'تعداد الرموز التي تُكتب في الحقل sType حتى تعرف Vulkan أي بنية موجودة في الذاكرة قبل أن تفسر بقية الحقول أو سلسلة pNext.';
  }
  if (/PresentMode/.test(name)) {
    return 'تعداد يحدد كيف تنتقل الصور من VkSwapchainKHR إلى نظام العرض، وبذلك يغيّر التأخير وسلوك الانتظار ومصير الإطارات الأقدم.';
  }
  if (/PipelineStage/.test(name)) {
    return 'أعلام تربط الاعتماد أو الانتظار أو الوصول إلى الموارد بمرحلة محددة من خط تنفيذ GPU، حتى لا يبقى نطاق المزامنة أوسع مما يلزم.';
  }
  if (/ShaderStage/.test(name)) {
    return 'أعلام تربط المورد أو وحدة المظلّل أو الثوابت الفورية بمرحلة مظلّل محددة، فلا تصبح مرئية لكل المراحل من غير حاجة.';
  }
  if (/PrimitiveTopology/.test(name)) {
    return 'تعداد يحدد كيف تجمع مرحلة تجميع الإدخال العناصر المتتابعة لتكوين بدائيات فعلية مثل النقاط أو الخطوط أو المثلثات.';
  }
  if (/ImageLayout/.test(name)) {
    return 'تعداد يصف الحالة الفعلية التي تتوقعها Vulkan للصورة قبل القراءة أو الكتابة أو العرض، لذلك يصبح الانتقال بين التخطيطات جزءاً من صحة التنفيذ.';
  }
  if (/Format/.test(name)) {
    return 'تعداد يحدد كيف تفسر Vulkan البتات المخزنة في الذاكرة: ترتيب القنوات، عرضها، وهل تمثل لوناً أو عمقاً أو نمطاً رقمياً آخر.';
  }
  if (/SharingMode/.test(name)) {
    return 'تعداد يحدد كيف تُملك الموارد بين عائلات الطوابير: إما ملكية حصرية لعائلة واحدة أو وصول متزامن لأكثر من عائلة.';
  }
  if (/LoadOp/.test(name)) {
    return 'تعداد يحدد ما الذي سيحدث لمحتوى المرفق عند بداية المرور الرسومي: إبقاؤه أو مسحه أو اعتباره غير مهم.';
  }
  if (/StoreOp/.test(name)) {
    return 'تعداد يحدد مصير محتوى المرفق بعد انتهاء المرور الرسومي: حفظه لخطوة لاحقة أو السماح بالتخلص منه.';
  }
  if (/CommandBufferLevel/.test(name)) {
    return 'تعداد يحدد هل مخزن الأوامر أساسي يُرسل مباشرة إلى الطابير أم ثانوي يُستدعى من مخزن أوامر آخر.';
  }
  if (/PipelineBindPoint/.test(name)) {
    return 'تعداد يعلن المسار الذي سترتبط به الخطوط والأوامر والموارد داخل Vulkan، مثل مسار الرسوميات أو الحوسبة.';
  }
  if (/SampleCount/.test(name)) {
    return 'أعلام تحدد عدد العينات التي ستستعملها Vulkan لكل بكسل أو لكل مرفق عندما يكون تعدد العينات مفعلاً.';
  }
  if (/FlagBits|Flags/.test(name)) {
    return `نوع أعلام بتّي تقرؤه Vulkan كخيارات مستقلة داخل ${domain}؛ كل بت مفعّل يضيف قيداً أو سلوكاً تنفيذياً واضحاً إلى هذا المسار.`;
  }

  return `تعداد تقرؤه Vulkan داخل الحقول أو الدوال المرتبطة به لتعلن النمط أو الحالة التنفيذية التي سيُبنى عليها ${domain}.`;
}

function buildEnumTypeApiPurposeFallback(enumName) {
  const name = String(enumName || '');

  if (name === 'VkResult') {
    return 'وجود هذا التعداد يمنع اختزال نتيجة الاستدعاء إلى نجاح أو فشل فقط، لأن بعض المسارات تحتاج التمييز بين النجاح الكامل، والحالات المؤقتة، والأخطاء التي تفرض معالجة مختلفة.';
  }
  if (name === 'VkStructureType') {
    return 'وجود هذا التعداد يجعل الحقل sType يعلن نوع البنية صراحة، فتستطيع Vulkan التحقق من البنية الصحيحة وقراءة سلسلة pNext من دون تخمين.';
  }
  if (/PresentMode/.test(name)) {
    return 'تحتاجه الواجهة لأن طريقة تدوير الإطارات والانتظار قبل العرض تؤثر مباشرة في التأخير وتمزق الصورة وسلوك إعادة استخدام الصور.';
  }
  if (/PipelineStage/.test(name)) {
    return 'تحتاجه المزامنة لكي تحصر الاعتماد في المرحلة التي ستقرأ المورد أو تكتب إليه فعلاً، بدلاً من توسيع الانتظار إلى خط الأنابيب كله.';
  }
  if (/ShaderStage/.test(name)) {
    return 'تحتاجه الواجهة حتى تربط الموارد أو وحدات المظلّل أو الثوابت الفورية بالمرحلة التي ستقرأها فعلاً، وليس بكل المراحل دفعة واحدة.';
  }
  if (/ImageLayout/.test(name)) {
    return 'تحتاجه Vulkan لأن صحة الوصول إلى الصورة تعتمد على التخطيط الحالي الذي ستفترضه قبل النسخ أو الرسم أو العرض.';
  }
  if (/FlagBits|Flags/.test(name)) {
    return 'وجود هذا النوع يمنع حشر الخيارات الإضافية داخل أرقام مبهمة؛ كل بت فيه يعلن قيداً أو خاصية تشغيلية مستقلة تقرؤها Vulkan مباشرة.';
  }

  return 'وجود هذا التعداد يجعل الفرع التنفيذي المقصود صريحاً، ويمنع تمرير أرقام صامتة لا توضّح كيف ستفسر Vulkan هذا الموضع.';
}

function buildEnumUsageFallback(enumName) {
  return `${enumName} يظهر عندما يحتاج الحقل أو الاستدعاء إعلان الحالة التنفيذية أو النمط الرسمي الذي ستقرأه Vulkan في هذا الموضع، لا مجرد تمرير رقم بلا دلالة.`;
}

function buildEnumValueMeaningFallback(valueName, enumName, context = {}) {
  const value = String(valueName || '');
  const enumType = String(enumName || '');
  const phrase = buildEnumTokenPhrase(value, enumType);

  if (enumType === 'VkResult') {
    if (value === 'VK_SUCCESS') {
      return 'تعني هذه القيمة أن الاستدعاء أكمل العمل المطلوب من دون خطأ ومن دون حاجة إلى مسار استدراكي إضافي.';
    }
    if (value === 'VK_SUBOPTIMAL_KHR') {
      return 'تعني هذه القيمة أن الاستدعاء نجح، لكن المسار المرتبط بالعرض لم يعد بالحالة المثلى، لذلك يمكن متابعة العمل مؤقتاً مع التحضير لتحديث موارد العرض.';
    }
    if (value === 'VK_ERROR_OUT_OF_DATE_KHR') {
      return 'تعني هذه القيمة أن موارد العرض الحالية فقدت توافقها مع حالة السطح أو النافذة، ولذلك يجب إعادة إنشاء VkSwapchainKHR قبل متابعة هذا المسار.';
    }
    if (value === 'VK_NOT_READY') {
      return 'تعني هذه القيمة أن الشرط المطلوب لم يتحقق بعد، لكنها لا تمثل خطأ نهائياً؛ ما يزال المورد أو الإشارة في طور الجاهزية.';
    }
    if (value === 'VK_TIMEOUT') {
      return 'تعني هذه القيمة أن مهلة الانتظار انتهت قبل تحقق الشرط المطلوب، لذلك توقف الاستدعاء عند حد الانتظار المحدد.';
    }
    if (/^VK_ERROR_/.test(value)) {
      return `تعني هذه القيمة أن الاستدعاء فشل بسبب ${phrase || 'السبب المشار إليه بالاسم'}، ولذلك لا يجوز متابعة المسار كأنه نجح.`;
    }
    return 'تعني هذه القيمة أن الاستدعاء انتهى بحالة خاصة يجب تفسيرها قبل مواصلة التنفيذ.';
  }

  if (enumType === 'VkStructureType') {
    const structureTypeName = buildStructureTypeNameFromValue(value);
    return `تجعل هذه القيمة الحقل sType يعلن أن كتلة الذاكرة الحالية تمثل البنية ${structureTypeName}، لذلك ستفسرها فولكان وفق تخطيط هذه البنية بالضبط.`;
  }

  if (/PresentMode/.test(enumType)) {
    if (/IMMEDIATE/.test(value)) {
      return 'تجعل هذه القيمة نظام العرض يسحب الإطار فور جاهزيته من دون انتظار دورة التزامن العمودي، لذلك ينخفض التأخير وقد يظهر تمزق في الصورة.';
    }
    if (/MAILBOX/.test(value)) {
      return 'تجعل هذه القيمة نظام العرض يحتفظ بأحدث إطار جاهز ويستبدل الأقدم قبل العرض، فيحافظ على السلاسة عندما يكون الرسم أسرع من شاشة العرض.';
    }
    if (/FIFO_RELAXED/.test(value)) {
      return 'تجعل هذه القيمة الصور تدخل طابوراً متسلسلاً، لكن النظام يسمح بعرض متأخر إذا فات التطبيق دورة عرض سابقة.';
    }
    if (/FIFO/.test(value)) {
      return 'تجعل هذه القيمة الصور تدخل طابوراً متسلسلاً يستهلكها نظام العرض وفق ترتيبها مع احترام التزامن العمودي.';
    }
  }

  if (/PipelineStage/.test(enumType)) {
    return `تحصر هذه القيمة الاعتماد أو الانتظار في ${phrase || 'المرحلة المشار إليها'} من خط الأنابيب، لذلك لا تُوسّع فولكان نطاق المزامنة إلى مراحل لا تقرأ المورد أو تكتبه فعلاً.`;
  }

  if (/ShaderStage/.test(enumType)) {
    return `تربط هذه القيمة المورد أو الوحدة أو الثابت الفوري بمرحلة ${phrase || 'المظلّل المشار إليه'} فقط، فلا يصبح مرئياً لبقية المراحل بلا حاجة.`;
  }

  if (/PrimitiveTopology/.test(enumType)) {
    return `تجعل هذه القيمة مرحلة تجميع الإدخال تفسر العناصر المتتابعة على أنها ${phrase || 'البدائيات المشار إليها'} قبل بدء الرسم.`;
  }

  if (/ImageLayout/.test(enumType)) {
    if (/UNDEFINED/.test(value)) {
      return 'تعني هذه القيمة أن المحتوى السابق للصورة غير مطلوب، لذلك تستطيع فولكان تجاهله والانتقال مباشرة إلى أول استخدام لاحق من دون الحفاظ على البيانات القديمة.';
    }
    if (/GENERAL/.test(value)) {
      return 'تعني هذه القيمة أن الصورة في تخطيط عام يسمح بعدة أنماط وصول، لكنه أقل تخصصاً من التخطيطات المصممة لمسار واحد محدد.';
    }
    if (/COLOR_ATTACHMENT_OPTIMAL/.test(value)) {
      return 'تعني هذه القيمة أن الصورة في التخطيط الأنسب للكتابة إليها كمرفق لون أثناء الرسم.';
    }
    if (/TRANSFER_DST_OPTIMAL/.test(value)) {
      return 'تعني هذه القيمة أن الصورة جاهزة لتكون وجهة لعمليات النسخ، لذلك ستتعامل فولكان معها على هذا الأساس قبل تنفيذ أمر النسخ.';
    }
    if (/TRANSFER_SRC_OPTIMAL/.test(value)) {
      return 'تعني هذه القيمة أن الصورة جاهزة لتكون مصدراً لعمليات النسخ، لذلك ستقرأ فولكان محتواها بهذا النمط من الوصول.';
    }
    if (/PRESENT_SRC/.test(value)) {
      return 'تعني هذه القيمة أن الصورة خرجت إلى الحالة التي يتوقعها نظام العرض قبل التقديم.';
    }
    return `تعني هذه القيمة أن الصورة يجب أن تكون في تخطيط ${phrase || 'الحالة المشار إليها'} قبل أن ينفذ المسار التالي وصوله إليها.`;
  }

  if (/SharingMode/.test(enumType)) {
    if (/EXCLUSIVE/.test(value)) {
      return 'تعني هذه القيمة أن المورد يبقى مملوكاً لعائلة طابير واحدة في كل لحظة، لذلك يكون تتبع الملكية أوضح وكلفته أقل.';
    }
    if (/CONCURRENT/.test(value)) {
      return 'تعني هذه القيمة أن المورد يمكن الوصول إليه من أكثر من عائلة طوابير من دون نقل ملكية صريح بين هذه العائلات.';
    }
  }

  if (/PipelineBindPoint/.test(enumType)) {
    return `تربط هذه القيمة الأوامر والموارد بمسار ${phrase || 'التنفيذ المشار إليه'}، لذلك ستتحقق فولكان من التوافق مع هذا المسار لا مع مسار آخر.`;
  }

  if (/SampleCount/.test(enumType)) {
    const sampleMatch = value.match(/_(\d+)_BIT/);
    if (sampleMatch) {
      return `تجعل هذه القيمة عدد العينات لكل بكسل يساوي ${sampleMatch[1]}، ولذلك تبني فولكان هذا المرفق أو هذا المسار على هذا العدد من العينات.`;
    }
  }

  if (/AttachmentLoadOp/.test(enumType)) {
    if (/LOAD/.test(value)) {
      return 'تعني هذه القيمة أن فولكان ستقرأ محتوى المرفق الموجود مسبقاً وتبقيه نقطة البداية لهذا المرور.';
    }
    if (/CLEAR/.test(value)) {
      return 'تعني هذه القيمة أن فولكان ستستبدل محتوى المرفق بقيمة المسح عند بداية المرور قبل تنفيذ أي كتابة جديدة.';
    }
    if (/DONT_CARE/.test(value)) {
      return 'تعني هذه القيمة أن المحتوى السابق للمرفق غير مطلوب، لذلك لا تحتاج فولكان إلى الحفاظ عليه قبل بدء المرور.';
    }
  }

  if (/AttachmentStoreOp/.test(enumType)) {
    if (/STORE/.test(value)) {
      return 'تعني هذه القيمة أن فولكان ستحتفظ بالمحتوى النهائي للمرفق بعد انتهاء المرور حتى يصبح متاحاً للعرض أو للقراءة اللاحقة.';
    }
    if (/DONT_CARE/.test(value)) {
      return 'تعني هذه القيمة أن المحتوى النهائي للمرفق غير مطلوب بعد انتهاء المرور، لذلك يمكن التخلص منه.';
    }
  }

  if (/ColorSpace/.test(enumType)) {
    return `تعني هذه القيمة أن نظام العرض سيفسر القيم اللونية وفق فضاء ${phrase || 'الألوان المشار إليه'} عند تقديم الصورة.`;
  }

  if (/Format/.test(enumType)) {
    return `تعني هذه القيمة أن فولكان ستفسر الذاكرة وفق تنسيق ${phrase || 'البيانات المشار إليه'}، أي وفق ترتيب القنوات وعرضها وتمثيلها العددي.`;
  }

  if (/FlagBits|Flags/.test(enumType)) {
    return `يفعّل هذا البت الخيار المرتبط بـ ${phrase || value} داخل ${enumType}، لذلك تضيفه فولكان إلى مجموعة القيود أو الخصائص التنفيذية المقروءة في هذا المسار.`;
  }

  const contextText = buildEnumUsageContextText(context);
  return `هذه القيمة هي الفرع الرسمي داخل ${enumType}${contextText ? ` ${contextText}` : ''}. عند تمريرها ستفسر فولكان هذا الموضع وفق هذا الاختيار الصريح، لا كرقم مجرد بلا معنى دلالي.`;
}

function buildEnumValueUsageFallback(valueName, enumName, context = {}) {
  const contextText = buildEnumUsageContextText(context);

  if (enumName === 'VkStructureType') {
    return `تُكتب هذه القيمة عادة في الحقل sType${contextText ? ` ${contextText}` : ''} حتى تتعرف Vulkan على نوع البنية قبل قراءة بقية الحقول.`;
  }
  if (enumName === 'VkResult') {
    return context.functionName
      ? `تظهر هذه القيمة في النتيجة المرجعة من ${context.functionName} عندما ينتهي الاستدعاء بهذه الحالة تحديداً.`
      : 'تظهر هذه القيمة في النتيجة المرجعة عندما ينتهي الاستدعاء بهذه الحالة تحديداً.';
  }
  if (/FlagBits|Flags/.test(enumName)) {
    return `تُفعَّل هذه القيمة مع بقية الأعلام${contextText ? ` ${contextText}` : ''} عندما تريد إضافة هذا القيد أو هذا الخيار التنفيذي تحديداً.`;
  }
  return `تُمرَّر هذه القيمة${contextText ? ` ${contextText}` : ''} عندما يكون هذا الفرع هو الحالة الفعلية التي يجب أن تقرأها Vulkan من ${enumName}.`;
}

function buildEnumValueBenefitFallback(valueName, enumName) {
  if (enumName === 'VkResult') {
    return 'تفصل هذه القيمة بين النجاح الكامل والحالات المؤقتة والأخطاء القاتلة، فتجعل مسار المعالجة اللاحق صريحاً.';
  }
  if (/FlagBits|Flags/.test(enumName)) {
    return 'يجعل هذا البت الخيار المفعّل واضحاً وقابلاً للدمج مع الأعلام الأخرى من دون اللجوء إلى أرقام مبهمة.';
  }
  return 'تجعل هذه القيمة الفرع التنفيذي المقصود واضحاً، وتمنع استبداله برقم عديم الدلالة أو بافتراض ضمني يصعب تتبعه.';
}

function sanitizeEnumNarrativeText(rawText, fallback = '') {
  const clean = normalizeVulkanEnumNarrativeText(rawText);
  const fallbackClean = normalizeVulkanEnumNarrativeText(fallback);

  if (!clean) {
    return fallbackClean;
  }

  if (hasCorruptedLocalizedText(clean) || hasResidualVulkanEnglishProse(clean) || isGenericEnumNarrativeText(clean)) {
    return fallbackClean || clean;
  }

  return clean;
}

function inferValueShapeDetails(name, type = '', context = {}) {
  const cleanName = String(name || '');
  const normalizedType = normalizeLookupName(type);
  const haystack = [cleanName, normalizedType, context.functionName || '', context.ownerType || ''].join(' ');
  const enumItem = normalizedType ? findItemInCategories(vulkanData.enums, normalizedType) : null;
  const structureItem = normalizedType ? findItemInCategories(vulkanData.structures, normalizedType) : null;
  let kind = 'Value';
  let unit = '';
  let location = '';
  let relationship = '';

  if (/Flags?$/.test(normalizedType) || /flags/i.test(cleanName)) {
    kind = 'Bitmask';
  } else if (enumItem) {
    kind = 'Enum value';
  } else if (/\*/.test(type)) {
    kind = 'Pointer';
  } else if (/Count$/.test(cleanName)) {
    kind = 'Count';
  } else if (/Offset|Address/i.test(cleanName) || normalizedType === 'VkDeviceAddress') {
    kind = 'Offset';
  } else if (/Size|Stride|Pitch|Range|alignment|capacity/i.test(cleanName) || normalizedType === 'VkDeviceSize') {
    kind = 'Size';
  } else if (/Index|first[A-Z]|binding$|location$|familyIndex/i.test(cleanName)) {
    kind = 'Index';
  } else if (/^Vk/.test(normalizedType) && !/Flags?$/.test(normalizedType) && !structureItem) {
    kind = 'Handle';
  }

  if (kind === 'Offset' || kind === 'Size') {
    unit = /timeout/i.test(cleanName) ? 'نانوثانية' : 'بايت';
  } else if (kind === 'Count') {
    unit = inferCountUnitLabel(cleanName);
  } else if (/width|height|depth/i.test(cleanName)) {
    unit = 'تكسلات';
  }

  if (/offset/i.test(cleanName) && /(buffer|srcBuffer|dstBuffer|memory)/i.test(haystack)) {
    location = 'داخل المخزن أو الذاكرة المرتبطة بهذا الاستدعاء';
  } else if (/vertex/i.test(cleanName)) {
    location = 'داخل بيانات الرؤوس المقروءة من مخزن الرؤوس';
  } else if (/index/i.test(cleanName) && !/image/i.test(cleanName)) {
    location = 'داخل بيانات الفهرسة أو داخل مصفوفة عناصر مترابطة';
  } else if (/primitive/i.test(cleanName)) {
    location = 'داخل بيانات الهندسة أو أوصاف البدائيات';
  } else if (/instance/i.test(cleanName)) {
    location = 'داخل بيانات النسخ أو ضمن عدد النسخ المطلوب';
  } else if (/buffer/i.test(cleanName) || normalizedType === 'VkBuffer') {
    location = 'يشير إلى مخزن ستقرأ منه Vulkan أو تكتب فيه';
  } else if (/image/i.test(cleanName) || normalizedType === 'VkImage') {
    location = 'يشير إلى صورة أو إلى بيانات صورة ستدخل في التنفيذ';
  }

  if (kind === 'Count' && /^p/.test(cleanName)) {
    relationship = 'يرتبط عادة بمصفوفة أو مؤشر آخر يحدد موضع البيانات وعدد العناصر التي ستقرأها Vulkan فعليًا';
  } else if (kind === 'Count') {
    relationship = 'يجب أن يطابق طول المصفوفة أو عدد العناصر التي ستعالجها Vulkan فعليًا';
  } else if (kind === 'Offset') {
    relationship = 'لا يمثل عدد عناصر، بل إزاحة بايتية تستخدمها Vulkan للوصول إلى بداية البيانات الصحيحة';
  } else if (kind === 'Index') {
    relationship = 'لا يمثل إزاحة بايتية، بل فهرس عنصر داخل مجموعة أو مصفوفة أو عائلة طوابير';
  } else if (kind === 'Size') {
    relationship = /Stride/i.test(cleanName)
      ? 'يعمل مع مؤشر أو مخزن ليحدد المسافة بين عنصرين متتاليين أثناء القراءة'
      : 'يعمل مع مخزن أو ذاكرة ليحدد السعة المطلوبة أو المدى الذي ستقرأه Vulkan';
  } else if (kind === 'Pointer') {
    relationship = /^p/.test(cleanName)
      ? 'يشير إلى بيانات تقرأها Vulkan أو تكتب فيها، وغالبًا يرتبط مع قيمة عدد أو حجم أو بنية مالكة'
      : 'يشير إلى عنوان بيانات يجب أن يبقى صالحاً طوال مدة الاستدعاء';
  } else if (kind === 'Handle') {
    relationship = 'يمثل الكائن الذي ستعمل عليه Vulkan، وتُفسَّر بقية القيم بالنسبة إليه';
  } else if (kind === 'Bitmask') {
    relationship = 'يجمع الأعلام التي تغيّر سلوك الاستدعاء أو الحقل عند التنفيذ';
  }

  return {kind, unit, location, relationship};
}

function renderValueShapeSummary(name, type = '', context = {}) {
  const details = inferValueShapeDetails(name, type, context);
  const parts = [`طبيعة القيمة: ${getValueShapeKindArabicLabel(details.kind)}`];
  if (details.unit) parts.push(`الوحدة: ${details.unit}`);
  if (details.location) parts.push(`موضع التأثير: ${details.location}`);
  if (details.relationship) parts.push(`العلاقة التنفيذية: ${details.relationship}`);
  return parts.join('، ');
}

function inferFieldShapeMeaning(fieldName, ownerType = '', fieldType = '') {
  const details = inferValueShapeDetails(fieldName, fieldType, {ownerType});
  const normalizedType = normalizeLookupName(fieldType);

  switch (details.kind) {
    case 'Count':
      return `يمثل عددًا يحدد كم ${details.unit || 'عنصر'} ستقرأه Vulkan من البيانات أو المصفوفة المرتبطة بهذا الحقل.`;
    case 'Offset':
      if (/Address/i.test(String(fieldName || '')) || normalizedType === 'VkDeviceAddress') {
        return `يمثل عنوانًا أو إزاحة صريحة على الجهاز تستخدمها Vulkan للوصول إلى موضع البيانات الصحيح${details.location ? ` ${details.location}` : ''}.`;
      }
      return `يمثل إزاحة بايتية تحدد موضع بداية القراءة أو الكتابة${details.location ? ` ${details.location}` : ''}.`;
    case 'Size':
      if (/Stride/i.test(String(fieldName || ''))) {
        return 'يمثل حجمًا بايتيًا يحدد المسافة بين عنصرين متتاليين عندما تقرأ Vulkan البيانات المتسلسلة من الذاكرة.';
      }
      return 'يمثل حجمًا أو مدى بايتيًا تعتمد عليه Vulkan لتخصيص الذاكرة أو لتحديد كمية البيانات التي ستتعامل معها.';
    case 'Index':
      return 'يمثل فهرس عنصر أو موضعًا منطقيًا داخل مصفوفة أو عائلة طوابير أو مجموعة نقاط ربط، وليس إزاحة بايتية داخل الذاكرة.';
    case 'Pointer':
      return `يمثل مؤشرًا إلى بيانات أو بنية أو مصفوفة ستقرأها Vulkan أو ستكتب فيها نتيجة أثناء الاستدعاء${details.location ? `، و${details.location}` : ''}.`;
    case 'Handle':
      return `يمثل مقبضًا إلى كائن Vulkan من النوع ${normalizedType || 'المتوقع'}؛ أي المرجع الذي ستعمل عليه العملية أو الذي ستفسر بقية الحقول بالنسبة إليه.`;
    case 'Bitmask':
      return 'يمثل مجموعة أعلام تجمع خيارات تنفيذية أو سياسات إضافية تغيّر سلوك البنية أو الاستدعاء.';
    case 'Enum value':
      return `يمثل رمزًا من التعداد الرسمي ${normalizedType} تقرؤه Vulkan لتفسير هذا الموضع على أنه الفرع التنفيذي أو الحالة الفعلية المقصودة داخل هذا المسار.`;
    default:
      return `يمثل قيمة تشغيلية من النوع ${normalizedType || 'المتوقع'} تستخدمها Vulkan ضمن تفسير هذه البنية أثناء التنفيذ.`;
  }
}

function inferFieldShapeUsage(fieldName, ownerType = '', fieldType = '') {
  const details = inferValueShapeDetails(fieldName, fieldType, {ownerType});
  const ownerSummary = getOwnerStructureSummary(ownerType);
  const ownerIntent = ownerSummary?.intent || ownerSummary?.lead || 'العملية التي تصفها هذه البنية';

  switch (details.kind) {
    case 'Count':
      return `اجعله مطابقًا تمامًا لعدد العناصر الفعلية التي تريد أن تعالجها Vulkan في ${ownerIntent}.`;
    case 'Offset':
      return 'اضبطه بحيث يشير إلى موضع البداية الصحيح داخل الذاكرة أو داخل المخزن المرتبط قبل أن تبدأ Vulkan القراءة أو الكتابة.';
    case 'Size':
      return `اضبطه بالقيمة الحقيقية المطلوبة لهذا المسار حتى تملك Vulkan السعة أو المدى الصحيحين أثناء ${ownerIntent}.`;
    case 'Index':
      return `استخدمه لاختيار العنصر أو العائلة أو نقطة الربط الصحيحة التي يجب أن تعتمد عليها Vulkan في ${ownerIntent}.`;
    case 'Pointer':
      return `مرر فيه عنوان بيانات صالحًا يبقى متاحًا طوال الاستدعاء، لأن Vulkan ستقرأ منه أو تكتب فيه مباشرة عند تنفيذ ${ownerIntent}.`;
    case 'Handle':
      return `ضع فيه مقبضًا صالحًا إلى الكائن الذي تريد أن تعمل عليه Vulkan أو أن تبني عليه بقية القيم في ${ownerIntent}.`;
    case 'Bitmask':
      return `فعّل فيه فقط الأعلام التي تحتاجها فعلاً، لأن كل بت مفعّل قد يغير سلوك ${ownerIntent}.`;
    case 'Enum value':
      return `اختر فيه القيمة التي تطابق السياسة أو الحالة الفعلية المطلوبة، لأن Vulkan ستفسر بقية التنفيذ على أساس هذا الاختيار.`;
    default:
      return `اضبط هذا الحقل بالقيمة التي تطابق متطلبات ${ownerIntent} قبل تمرير البنية إلى Vulkan.`;
  }
}

function inferFieldShapePossibleValues(fieldName, ownerType = '', fieldType = '') {
  const details = inferValueShapeDetails(fieldName, fieldType, {ownerType});
  const normalizedType = normalizeLookupName(fieldType);

  switch (details.kind) {
    case 'Count':
      return `عدد صحيح${details.unit ? ` بوحدة ${details.unit}` : ''} يطابق البيانات الفعلية المرتبطة بهذا الحقل.`;
    case 'Offset':
      return details.unit
        ? `قيمة صحيحة${details.unit ? ` بوحدة ${details.unit}` : ''} ومحاذاة وفق متطلبات Vulkan لهذا المسار.`
        : 'قيمة صريحة تشير إلى الموضع الصحيح الذي ستبدأ منه القراءة أو الكتابة.';
    case 'Size':
      return `قيمة صحيحة${details.unit ? ` بوحدة ${details.unit}` : ''} تكفي للسعة أو المدى الذي تتطلبه العملية.`;
    case 'Index':
      return 'فهرس صحيح يقع ضمن الحدود الصالحة للعناصر أو العائلات أو نقاط الربط المرتبطة.';
    case 'Pointer':
      return `عنوان صالح إلى بيانات من النوع ${normalizedType || 'المتوقع'} أو القيمة \`nullptr\` فقط إذا سمحت المواصفة بذلك.`;
    case 'Handle':
      return `مقبض صالح من النوع ${normalizedType} يشير إلى كائن أُنشئ أو استُعلم عنه سابقًا.`;
    case 'Bitmask':
      return `مزيج صالح من الأعلام المعرفة في ${normalizedType || 'التعداد المرتبط'} أو القيمة صفر إذا سمحت المواصفة.`;
    case 'Enum value':
      return `قيمة معرفة رسميًا داخل ${normalizedType}.`;
    default:
      return 'قيمة تتوافق مع تعريف الحقل ومتطلبات الدالة أو البنية التي ستقرأه.';
  }
}

function inferFieldShapeInvalid(fieldName, ownerType = '', fieldType = '') {
  const details = inferValueShapeDetails(fieldName, fieldType, {ownerType});

  switch (details.kind) {
    case 'Count':
      return 'إذا لم يطابق العدد المصفوفة أو البيانات الفعلية فستقرأ Vulkan عناصر ناقصة أو زائدة أو تكتب عدداً غير صحيح من النتائج.';
    case 'Offset':
      return 'الإزاحة أو العنوان الخاطئ يوجّه Vulkan إلى موضع بيانات غير صحيح، وقد يؤدي إلى قراءة محتوى خاطئ أو إلى خطأ تحقق.';
    case 'Size':
      return 'إذا كانت السعة أو المدى أصغر من المطلوب فلن تكفي الذاكرة أو سيصبح نطاق القراءة والكتابة غير صحيح.';
    case 'Index':
      return 'الفهرس خارج الحدود أو غير المطابق للمجموعة الصحيحة يجعل Vulkan تشير إلى عنصر غير صحيح أو غير موجود.';
    case 'Pointer':
      return 'المؤشر غير الصالح أو الذي لا يشير إلى النوع أو السعة الصحيحة يجعل Vulkan تقرأ أو تكتب في ذاكرة غير صحيحة.';
    case 'Handle':
      return 'المقبض غير الصالح أو غير المتوافق مع هذا المسار يجعل الاستدعاء يعمل على كائن غير مناسب أو يفشل التحقق.';
    case 'Bitmask':
      return 'تفعيل أعلام غير مدعومة أو غير متوافقة مع بقية الحقول قد يغير المسار التنفيذي بطريقة غير صالحة.';
    case 'Enum value':
      return 'اختيار قيمة تعداد لا تطابق هذا السياق يوجّه Vulkan إلى سياسة أو حالة تنفيذ غير مناسبة لهذا الحقل.';
    default:
      return 'القيمة غير الصحيحة تغيّر تفسير البنية أو العملية بطريقة تخالف متطلبات Vulkan لهذا المسار.';
  }
}

function getVulkanParameterOverride(param, item) {
  const functionName = String(item?.name || '').trim();
  const parameterName = String(param?.name || '').trim();
  if (!functionName || !parameterName) {
    return null;
  }

  return VULKAN_PARAMETER_OVERRIDES?.[functionName]?.[parameterName] || null;
}

function inferParameterUsage(param, item) {
  const override = getVulkanParameterOverride(param, item);
  if (override?.usage) {
    return override.usage;
  }

  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const shape = inferValueShapeDetails(name, type, {functionName: item?.name || ''});

  if (name === 'device') {
    return 'يُمرر لأن الدالة تحتاج إلى معرفة أي جهاز منطقي يملك الموارد أو الحالة التي ستتعامل معها في هذا الاستدعاء.';
  }

  if (name === 'physicalDevice') {
    return 'يُمرر لأن الدالة تعتمد على الجهاز الفيزيائي كمصدر للقدرات أو الخصائص أو صيغ الذاكرة أو دعم الطوابير والامتدادات.';
  }

  if (name === 'pInfo') {
    return 'يُمرر لأن إعدادات هذا الاستدعاء مجمعة داخل بنية واحدة، وVulkan تقرأ حقولها كوحدة مترابطة لتحديد السلوك المطلوب.';
  }

  if (name === 'pCreateInfo') {
    return 'يُمرر لأن كل مواصفات الإنشاء والرايات والعلاقات مع الموارد الأخرى يجب أن تصل إلى الدالة ضمن بنية إنشاء رسمية واحدة.';
  }

  if (name === 'pAllocator') {
    return 'يُمرر فقط عندما يريد التطبيق التحكم في تخصيص ذاكرة المضيف وتحريرها بدل الاعتماد على آلية التخصيص الافتراضية.';
  }

  if (name === 'pNext') {
    return 'يُمرر عندما يحتاج الاستدعاء إلى بنى امتداد إضافية لا تتسع لها البنية الأساسية نفسها، فتقرأها Vulkan عبر سلسلة الامتدادات.';
  }

  if (/^pp/.test(name)) {
    return 'يُمرر لأن الدالة تحتاج إلى الوصول إلى عدة عناوين أو أسماء أو كائنات دفعة واحدة، لا إلى قيمة مفردة فقط.';
  }

  if (/^p/.test(name) && /\*/.test(type)) {
    return 'يُمرر لأن الدالة تحتاج إلى قراءة بيانات خارجية أو كتابة نتائج في ذاكرة يملكها التطبيق، وليس إلى نسخ القيمة داخل التوقيع مباشرة.';
  }

  switch (shape.kind) {
    case 'Count':
      return 'يُمرر لأن Vulkan تحتاج إلى معرفة عدد العناصر الحقيقي الذي ستقرأه أو تكتبه أو تنشئه في هذا المسار.';
    case 'Offset':
      return 'يُمرر لأن Vulkan تحتاج إلى موضع البداية الدقيق داخل المخزن أو الذاكرة أو نطاق العناوين قبل تنفيذ العملية.';
    case 'Size':
      return 'يُمرر لأن Vulkan تحتاج إلى معرفة الحجم أو المدى الفعلي الذي ستعالجه، سواء عند القراءة أو الكتابة أو التخصيص أو النسخ.';
    case 'Index':
      return 'يُمرر لأن الدالة تحتاج إلى تحديد العنصر أو العائلة أو نقطة الربط الصحيحة داخل مجموعة أكبر من الموارد.';
    case 'Handle':
      return 'يُمرر لأن الدالة لا يمكنها تنفيذ العملية من دون معرفة الكائن الرسمي الذي ستعمل عليه أو تفسر بقية المعاملات بالنسبة إليه.';
    case 'Bitmask':
      return 'يُمرر لأن هذا الموضع يجمع الأعلام التي تفعّل السلوكيات الاختيارية أو القيود الإضافية لهذا الاستدعاء.';
    case 'Enum value':
      return 'يُمرر لأن الدالة تحتاج إلى اختيار سياسة أو وضع تنفيذي واحد من تعداد رسمي يحدد طريقة العمل.';
    default:
      return 'يُمرر لأن الدالة تعتمد عليه لتحديد المورد المستهدف أو السلوك المطلوب أو البيانات التي ستتعامل معها أثناء التنفيذ.';
  }
}

function inferParameterActualUsage(param, item) {
  const override = getVulkanParameterOverride(param, item);
  if (override?.actualUsage) {
    return override.actualUsage;
  }

  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const normalizedType = normalizeLookupName(type);
  const vkTypeLabel = /^Vk/.test(normalizedType) ? ` من النوع ${normalizedType}` : '';
  const functionName = String(item?.name || '');
  const isConstPointer = /\bconst\b/.test(type) && /\*/.test(type);
  const isPointer = /\*/.test(type);
  const shape = inferValueShapeDetails(name, type, {functionName});

  if (name === 'device') {
    return 'يُمرر عادة كمقبض جهاز منطقي أُنشئ مسبقًا ويملك الموارد المشار إليها في بقية المعاملات.';
  }

  if (name === 'physicalDevice') {
    return 'يُمرر عادة كمقبض جهاز فيزيائي حصلت عليه من تعداد العتاد المتاح قبل اختيار الجهاز المنطقي المناسب.';
  }

  if (name === 'queue') {
    return 'يُمرر عادة كطابور حصلت عليه من الجهاز المنطقي بعد الإنشاء، ثم تستخدمه للإرسال أو العرض أو المزامنة بحسب نوع الدالة.';
  }

  if (name === 'commandBuffer') {
    return 'يُمرر عادة كمخزن أوامر صالح في حالة تسجيل مناسبة، لأن الدالة ستضيف إليه أوامر جديدة أو تغيّر حالته الحالية.';
  }

  if (name === 'pCreateInfo') {
    return 'يُجهّز عادة بإنشاء البنية المناسبة وتعبئة حقولها الإلزامية والاختيارية، ثم تمرير عنوانها إلى الدالة دون تعديل ترتيب حقولها أثناء الاستدعاء.';
  }

  if (name === 'pInfo') {
    return 'يُستخدم عادة كعنوان إلى بنية إعداد رئيسية يملؤها التطبيق قبل الاستدعاء مباشرة بالقيم التي تعكس الحالة المطلوبة فعليًا.';
  }

  if (name === 'pAllocator') {
    return 'في أغلب التطبيقات يُمرر بالقيمة `nullptr`، ولا يُملأ إلا عندما يوفّر التطبيق بنية تخصيص مخصصة من النوع VkAllocationCallbacks.';
  }

  if (name === 'pNext') {
    return 'يُمرر غالبًا بالقيمة `nullptr`، أو كسلسلة بنى امتدادية مترابطة تبدأ ببنية داعمة لميزة أو امتداد إضافي.';
  }

  if (/Count$/.test(name) && !isPointer) {
    return `يُمرر كعدد صحيح يطابق طول المصفوفة أو عدد العناصر الفعلية التي سيتعامل معها ${functionName || 'الاستدعاء'}.`;
  }

  if (/Count$/.test(name) && isPointer) {
    return 'يُمرر كعنوان إلى متغير عددي عندما تريد الدالة قراءة العدد الحالي أو كتابة العدد المطلوب أو العدد الفعلي للنتائج.';
  }

  if (/^pp/.test(name)) {
    return 'يُمرر كعنوان إلى مصفوفة مؤشرات أو عناوين، مع التأكد من أن العدد المرافق يطابق عدد العناصر الموجودة فعلاً.';
  }

  if (/^p/.test(name) && isConstPointer) {
    return `يُمرر كعنوان إلى بيانات إدخال أو بنية${vkTypeLabel} جهزها التطبيق مسبقًا، ويجب أن تبقى صالحة حتى تنتهي الدالة من قراءتها.`;
  }

  if (/^p/.test(name) && isPointer) {
    return `يُمرر كعنوان إلى متغير أو بنية أو مصفوفة${vkTypeLabel} تسمح للدالة بكتابة النتائج أو تحديث البيانات في مكانها.`;
  }

  switch (shape.kind) {
    case 'Offset':
      return 'يُمرر كإزاحة بايتية محسوبة بالنسبة إلى بداية المخزن أو الذاكرة أو العنوان الأساسي المرتبط بالعملية.';
    case 'Size':
      return 'يُمرر كحجم أو مدى بايتي حقيقي يطابق البيانات أو السعة المطلوبة، لا كتقدير تقريبي.';
    case 'Index':
      return 'يُمرر كفهرس صحيح ضمن الحدود النظامية للمجموعة المستهدفة، مثل رقم عائلة طوابير أو موضع نقطة ربط.';
    case 'Handle':
      return `يُمرر كمقبض صالح من النوع ${normalizedType || 'المطلوب'} أُنشئ أو استُعلم عنه مسبقًا وبقي حيًا طوال مدة الاستدعاء.`;
    case 'Bitmask':
      return `يُمرر عادة كمزيج بتّي من أعلام ${normalizedType || 'النوع المرتبط'} باستخدام عملية OR عند الحاجة إلى أكثر من خيار.`;
    case 'Enum value':
      return `يُمرر كقيمة واحدة من تعداد ${normalizedType || 'رسمي'} تحدد الوضع أو السياسة المراد تطبيقها.`;
    default:
      return 'يُمرر بالقيمة الدقيقة التي تطابق الموارد أو الشروط الفعلية لهذا الاستدعاء، لا بوصف عام أو قيمة افتراضية غير مدروسة.';
  }
}

function inferParameterEffect(param, item) {
  const override = getVulkanParameterOverride(param, item);
  if (override?.effect) {
    return override.effect;
  }

  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const functionName = String(item?.name || '');
  const shape = inferValueShapeDetails(name, type, {functionName});

  if (name === 'commandBuffer') {
    return 'تغيير هذا المعامل يغيّر مخزن الأوامر الذي سيستقبل الأمر الجديد، وبالتالي يتغير موضع تسجيل العمل الذي سينفذه المعالج الرسومي لاحقًا.';
  }

  if (name === 'queue') {
    return 'تغيير هذا المعامل يغيّر الطابور الذي سيُرسل إليه العمل أو التقديم أو المزامنة، وبالتالي يتغير المسار التنفيذي الذي سيتلقى الطلب.';
  }

  if (name === 'device' || name === 'physicalDevice') {
    return 'تغيير هذا المعامل يغيّر الكائن الجذري الذي ستعمل عليه الدالة، وبالتالي قد تتغير الموارد أو القدرات أو النتائج المرتبطة بالاستدعاء كله.';
  }

  switch (shape.kind) {
    case 'Count':
      return 'تغيير هذه القيمة يغيّر عدد العناصر التي ستقرأها Vulkan أو تكتبها فعليًا ضمن هذا الاستدعاء.';
    case 'Offset':
      return 'تغيير هذه القيمة يغيّر موضع البداية داخل الذاكرة أو داخل المخزن، وبالتالي يغيّر البيانات الفعلية التي ستصل إليها Vulkan.';
    case 'Size':
      return 'تغيير هذه القيمة يغيّر السعة أو المدى الذي ستقرأه Vulkan أو تعتمد عليه أثناء التنفيذ.';
    case 'Index':
      return 'تغيير هذه القيمة يبدل العنصر أو نقطة الربط أو العائلة التي ستستخدمها Vulkan في هذا المسار.';
    case 'Pointer':
      return 'تغيير المؤشر أو البيانات التي يشير إليها يغيّر مدخلات الدالة أو المخرجات التي ستكتبها مباشرة.';
    case 'Handle':
      return 'تغيير هذا المقبض يبدل الكائن الذي ستعمل عليه الدالة، فتتغير الموارد أو الحالة التنفيذية المستهدفة.';
    case 'Bitmask':
      return 'تغيير الأعلام يفعّل أو يعطّل سلوكيات اختيارية داخل هذا الاستدعاء.';
    case 'Enum value':
      return 'تغيير قيمة التعداد يبدل السياسة أو النمط الذي ستتبعه Vulkan أثناء هذا الاستدعاء.';
    default:
      return `تغيير هذا المعامل يغيّر كيفية تفسير ${functionName || 'الدالة'} للقيم الممررة أو المورد المستهدف أو النتيجة المتوقعة.`;
  }
}

function inferParameterMeaning(param, item) {
  const override = getVulkanParameterOverride(param, item);
  if (override?.meaning) {
    return override.meaning;
  }

  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const normalizedType = normalizeLookupName(type);
  const vkTypeLabel = /^Vk/.test(normalizedType) ? ` من النوع ${normalizedType}` : '';
  const functionName = String(item?.name || '');
  const isConstPointer = /\bconst\b/.test(type) && /\*/.test(type);
  const isPointer = /\*/.test(type);

  if (name === 'device') {
    return `يمثل VkDevice الذي ستُنفذ عليه ${functionName}؛ أي الجهاز المنطقي الذي تعود إليه الموارد أو الحالة التي ستتعامل معها الدالة.`;
  }

  if (name === 'physicalDevice') {
    return `يمثل VkPhysicalDevice الذي تريد أن تستعلم عن قدراته أو تتحقق من دعمه أو تستخرج منه مورداً مرتبطاً بهذا الاستدعاء.`;
  }

  if (name === 'queue') {
    return `يمثل VkQueue الذي سترسل إليه العمل أو التقديم أو المزامنة في هذا الاستدعاء.`;
  }

  if (name === 'commandBuffer') {
    return `يمثل VkCommandBuffer الذي ستسجل فيه الدالة أمراً جديداً أو تغيّر حالته الحالية أثناء التنفيذ.`;
  }

  if (name === 'pipelineCache') {
    return 'يمثل VkPipelineCache الذي تستخدمه الدالة لإعادة الاستفادة من بيانات سابقة عند إنشاء خطوط الأنابيب بدل البدء من الصفر.';
  }

  if (name === 'pCreateInfo') {
    return 'يمثل بنية الإنشاء الرسمية التي تحمل الوصف الكامل للكائن المطلوب إنشاؤه: نوعه، راياته، موارده المرتبطة، والقيود التي ستبني عليها الدالة عملية الإنشاء.';
  }

  if (name === 'pInfo') {
    return 'يمثل بنية الإعداد الرئيسية لهذا الاستدعاء، وهي الوعاء الذي يجمع القيم التي تغيّر سلوك الدالة أو تحدد شروط التنفيذ والموارد المشاركة فيه.';
  }

  if (name === 'pAllocator') {
    return 'يمثل بنية تخصيص اختيارية لذاكرة المضيف. في أغلب البرامج يمرر بالقيمة `nullptr`، أما إذا كان التطبيق يدير التخصيص بنفسه فيمرر بنية ردود نداء التخصيص هنا.';
  }

  if (name === 'pNext') {
    return `يمثل سلسلة امتدادات إضافية مرتبطة بالبنية الحالية. يستخدمه المبرمج عندما يحتاج تمرير بنى إضافية توسّع السلوك الافتراضي لهذا الاستدعاء.`;
  }

  if (name === 'flags') {
    return 'يمثل أعلامًا اختيارية تغيّر سلوك الدالة أو البنية. هذا الموضع هو المكان الذي تُفعَّل فيه الخيارات الإضافية غير المفعلة افتراضيًا.';
  }

  if (/Count$/.test(name) && !isPointer) {
    return 'يمثل عدد العناصر التي ستقرأها الدالة من مصفوفة مرافقة أو عدد الكائنات التي تريد معالجتها في هذا الاستدعاء.';
  }

  if (/Count$/.test(name) && isPointer) {
    return 'يمثل مؤشراً إلى عدد العناصر. تستخدمه Vulkan عادة إما لكتابة الحجم المطلوب، أو لقراءة/كتابة عدد النتائج الفعلية المرتبطة بمصفوفة أخرى.';
  }

  if (/^pp/.test(name)) {
    return 'يمثل مؤشرًا إلى مصفوفة مؤشرات أو أسماء. في هذا الموضع تمرر قائمة العناصر أو العناوين التي ستقرأها الدالة دفعة واحدة.';
  }

  if (/^p/.test(name) && isConstPointer) {
    return `يمثل عنوان بيانات إدخال${vkTypeLabel}. هنا يمرر التطبيق الكائن أو البنية التي جهزها مسبقًا لتقرأها الدالة دون تعديلها مباشرة.`;
  }

  if (/^p/.test(name) && isPointer) {
    return `يمثل عنوان قيمة أو نتيجة${vkTypeLabel}. هذا هو الموضع الذي ستكتب فيه الدالة المخرجات أو تحدّث البيانات المطلوبة أثناء الاستدعاء.`;
  }

  if (/^Vk/.test(normalizedType)) {
    return `يمثل قيمة أو مورداً من النوع ${normalizedType} تحتاجه الدالة لتعرف على أي كائن ستعمل أو أي إعداد ستقرأه في هذا الموضع.`;
  }

  return 'يمثل القيمة التي تعتمد عليها الدالة في هذا الموضع لتحديد ما الذي ستنفذه أو على أي بيانات ستعمل.';
}

function renderFunctionParameterDescription(param, item) {
  const official = preferStrictArabicVulkanText(
    preferArabicTooltipText(param?.description || '', inferParameterMeaning(param, item)),
    inferParameterMeaning(param, item)
  );
  const meaning = inferParameterMeaning(param, item);
  const usage = inferParameterUsage(param, item);
  const actualUsage = inferParameterActualUsage(param, item);
  const effect = inferParameterEffect(param, item);
  const shape = renderValueShapeSummary(param?.name || '', param?.type || '', {functionName: item?.name || ''});
  const officialHtml = official ? `<p><strong>الوصف الرسمي بالعربي:</strong> ${linkUsageBridgeText(official)}</p>` : '';
  const meaningHtml = meaning ? `<p><strong>المعنى الحقيقي:</strong> ${linkUsageBridgeText(meaning)}</p>` : '';
  const usageHtml = usage ? `<p><strong>لماذا يُمرر:</strong> ${linkUsageBridgeText(usage)}</p>` : '';
  const actualUsageHtml = actualUsage ? `<p><strong>كيف يظهر في الاستخدام الفعلي:</strong> ${linkUsageBridgeText(actualUsage)}</p>` : '';
  const effectHtml = effect ? `<p><strong>تنبيه أو أثر تغييره:</strong> ${linkUsageBridgeText(effect)}</p>` : '';
  const shapeHtml = shape ? `<p><strong>طبيعته التنفيذية:</strong> ${linkUsageBridgeText(shape)}</p>` : '';
  return `${officialHtml}${meaningHtml}${usageHtml}${actualUsageHtml}${effectHtml}${shapeHtml}`;
}

function sanitizeShortVulkanTooltipText(text) {
  return sanitizeTooltipText(text)
    .replace(/\bVulkan\b/g, 'فولكان')
    .replace(/\bGPU\b/g, 'المعالج الرسومي')
    .replace(/\bCPU\b/g, 'المعالج المركزي')
    .replace(/\bcallbacks?\b/gi, 'ردود النداء')
    .replace(/\bpipelines?\b/gi, 'خطوط الأنابيب')
    .replace(/\bdescriptors?\b/gi, 'الواصفات')
    .replace(/\bbuffers?\b/gi, 'المخازن')
    .replace(/\bshaders?\b/gi, 'الشادرات')
    .replace(/\bframebuffers?\b/gi, 'إطارات المرفقات')
    .replace(/\btessellation\b/gi, 'التقسيم')
    .replace(/\buniform\b/gi, 'الموحّد')
    .replace(/\bstorage\b/gi, 'التخزيني')
    .replace(/\btexel\b/gi, 'العنصر المنسق')
    .replace(/\bsparse\b/gi, 'المتناثر')
    .replace(/\bprotected\b/gi, 'المحمي')
    .replace(/\bswapchain\b/gi, 'سلسلة التبديل')
    .replace(/\bsurface\b/gi, 'سطح العرض')
    .replace(/\brender pass\b/gi, 'مسار الرسم')
    .replace(/^الوصف الرسمي(?: بالعربي)?:\s*/g, '')
    .replace(/^المعنى(?: البرمجي)?:\s*/g, '')
    .replace(/^الدور الحقيقي:\s*/g, '')
    .replace(/^الاستخدام(?: الفعلي)?:\s*/g, '')
    .replace(/^الفائدة(?: العملية)?:\s*/g, '')
    .replace(/^التأثير:\s*/g, '')
    .replace(/^النوع:\s*/g, '')
    .replace(/^المالك:\s*/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTooltipLeadSentence(text) {
  const clean = sanitizeShortVulkanTooltipText(text);
  if (!clean) {
    return '';
  }

  return clean
    .split(/\n+/)[0]
    .split(/(?<=[.؟!])\s+/)[0]
    .replace(/[.؟!،؛:\s]+$/g, '')
    .trim();
}

function extractVulkanTooltipBody(text) {
  return extractTooltipLeadSentence(text)
    .replace(/^تعني هذه القيمة أن\s*/g, '')
    .replace(/^تعني هذه القيمة\s*/g, '')
    .replace(/^تجعل هذه القيمة\s*/g, '')
    .replace(/^هذه القيمة هي\s*/g, '')
    .replace(/^يفعّل هذا البت\s*/g, '')
    .replace(/^يفعل هذا البت\s*/g, '')
    .replace(/^هذا البت\s*/g, '')
    .replace(/^هذا التعداد\s*/g, '')
    .replace(/^نوع أعلام(?: بتّي)?\s*/g, '')
    .replace(/^تعداد\s*/g, '')
    .replace(/^بنية\s*/g, '')
    .replace(/^مقبض\s*/g, '')
    .replace(/^ثابت\s*/g, '')
    .replace(/^ماكرو\s*/g, '')
    .replace(/^يمثل\s*/g, '')
    .replace(/^يشير إلى\s*/g, '')
    .replace(/^يصف\s*/g, '')
    .replace(/^يحدد\s*/g, '')
    .replace(/^أن\s*/g, '')
    .trim();
}

function finalizeShortVulkanTooltip(text, fallback = 'عنصر من Vulkan.') {
  let clean = extractTooltipLeadSentence(text || fallback) || extractTooltipLeadSentence(fallback) || 'عنصر رسمي من فولكان';
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 15) {
    clean = words.slice(0, 15).join(' ');
  }
  clean = clean.replace(/[،؛:\s]+$/g, '').trim();
  return /[.؟!]$/.test(clean) ? clean : `${clean}.`;
}

function buildRepresentationalTooltip(prefix, body, fallback = '') {
  const cleanBody = extractVulkanTooltipBody(body);
  if (!cleanBody) {
    return finalizeShortVulkanTooltip(fallback || prefix, fallback || prefix);
  }
  return finalizeShortVulkanTooltip(`${prefix} ${cleanBody}`, fallback || `${prefix} عنصر رسمي في Vulkan.`);
}

function buildIndicativeTooltip(prefix, body, fallback = '') {
  const cleanBody = extractVulkanTooltipBody(body);
  if (!cleanBody) {
    return finalizeShortVulkanTooltip(fallback || prefix, fallback || prefix);
  }
  const clause = /^أن\b/.test(cleanBody) ? cleanBody : `أن ${cleanBody}`;
  return finalizeShortVulkanTooltip(`${prefix} ${clause}`, fallback || `${prefix} عنصر رسمي في Vulkan.`);
}

function isClauseLikeTooltipBody(body) {
  const clean = extractVulkanTooltipBody(body);
  if (!clean) {
    return false;
  }

  return /^(?:أن|إن)\b/.test(clean)
    || /\b(?:نجح|فشل|أكمل|فقد|انتهت|تدخل|تبقى|تكون|يمكن|يعيد|تعيد|يتحول|تتحول)\b/.test(clean);
}

function inferShortHandleTooltipSubject(name) {
  if (/PipelineCache/.test(name)) return 'مخبأ خطوط الأنابيب';
  if (/PipelineLayout/.test(name)) return 'تخطيط مجموعات الواصفات والثوابت الفورية';
  if (/Pipeline(?!Cache|Binary|Executable)/.test(name)) return 'خط أنابيب رسم أو حوسبة';
  if (/PipelineBinary/.test(name)) return 'تمثيل ثنائي لخط أنابيب';
  if (/CommandBuffer/.test(name)) return 'مخزن أوامر';
  if (/CommandPool/.test(name)) return 'مجمع مخازن أوامر';
  if (/DescriptorSetLayout/.test(name)) return 'تخطيط مجموعة واصفات';
  if (/DescriptorPool/.test(name)) return 'مجمع مجموعات واصفات';
  if (/DescriptorSet/.test(name)) return 'مجموعة واصفات';
  if (/RenderPass/.test(name)) return 'مسار رسم';
  if (/Framebuffer/.test(name)) return 'إطار مرفقات';
  if (/ImageView/.test(name)) return 'منظور صورة';
  if (/Image/.test(name)) return 'صورة';
  if (/Buffer/.test(name)) return 'مخزن بيانات';
  if (/Sampler/.test(name)) return 'مأخذ عينات';
  if (/ShaderModule|ShaderEXT/.test(name)) return 'وحدة شادر';
  if (/Surface/.test(name)) return 'سطح عرض';
  if (/Swapchain/.test(name)) return 'سلسلة تبديل';
  if (/Semaphore/.test(name)) return 'كائن مزامنة';
  if (/Fence/.test(name)) return 'سياج مزامنة';
  if (/Queue/.test(name)) return 'طابور تنفيذ';
  if (/PhysicalDevice/.test(name)) return 'جهاز فيزيائي';
  if (/DeviceMemory/.test(name)) return 'ذاكرة جهاز';
  if (/Device(?!Address|Memory)/.test(name)) return 'جهاز منطقي';
  if (/Instance/.test(name)) return 'مثيل واجهة فولكان';
  if (/QueryPool/.test(name)) return 'مجمع استعلامات';
  if (/Event/.test(name)) return 'حدث مزامنة';
  if (/AccelerationStructure/.test(name)) return 'بنية تسارع';
  if (/Display/.test(name)) return 'شاشة أو مخرج عرض';
  if (/PrivateDataSlot/.test(name)) return 'فتحة بيانات خاصة';
  return 'كائن رسمي';
}

function inferShortStructureTooltipSubject(name) {
  if (/ApplicationInfo$/.test(name)) return 'معلومات تعريف التطبيق والمحرك';
  if (/InstanceCreateInfo$/.test(name)) return 'إعدادات إنشاء VkInstance';
  if (/DeviceCreateInfo$/.test(name)) return 'إعدادات إنشاء VkDevice';
  if (/AllocateInfo$/.test(name)) return 'معلومات تخصيص مورد أو ذاكرة';
  if (/CreateInfo$/.test(name)) return 'إعدادات إنشاء كائن أو مورد';
  if (/BeginInfo$/.test(name)) return 'معلومات بدء عملية أو تسجيل';
  if (/EndInfo$/.test(name)) return 'معلومات إنهاء عملية أو تسجيل';
  if (/SubmitInfo/.test(name)) return 'معلومات إرسال عمل إلى VkQueue';
  if (/PresentInfo/.test(name)) return 'معلومات تقديم صورة إلى سطح عرض';
  if (/BindSparseInfo$/.test(name)) return 'معلومات ربط ذاكرة متناثرة';
  if (/Properties/.test(name)) return 'خصائص مورد أو قدرة رسمية';
  if (/Features/.test(name)) return 'ميزات رسمية مدعومة أو مطلوبة';
  if (/Requirements/.test(name)) return 'متطلبات مورد أو ذاكرة';
  if (/Capabilities/.test(name)) return 'قدرات مسار أو امتداد';
  if (/Callbacks/.test(name)) return 'دوال رد نداء';
  if (/Range/.test(name)) return 'نطاق قيم أو موارد';
  if (/State/.test(name)) return 'حالة رسمية';
  if (/MemoryBarrier/.test(name)) return 'حاجز ذاكرة';
  if (/ImageMemoryBarrier/.test(name)) return 'حاجز ذاكرة لصورة';
  if (/BufferMemoryBarrier/.test(name)) return 'حاجز ذاكرة لمخزن';
  if (/SubresourceRange/.test(name)) return 'نطاق مورد فرعي';
  if (/SubresourceLayers/.test(name)) return 'طبقات مورد فرعي';
  if (/Extent3D/.test(name)) return 'أبعادًا ثلاثية';
  if (/Extent2D/.test(name)) return 'أبعادًا ثنائية';
  if (/Offset3D/.test(name)) return 'إزاحة ثلاثية';
  if (/Offset2D/.test(name)) return 'إزاحة ثنائية';
  if (/Rect2D/.test(name)) return 'مستطيلاً ثنائي الأبعاد';
  if (/Viewport/.test(name)) return 'إعدادات منفذ عرض';
  if (/ClearValue/.test(name)) return 'قيمة مسح';
  if (/Attachment/.test(name)) return 'بيانات مرفق';
  if (/Descriptor/.test(name)) return 'بيانات واصف';
  return 'مجموعة حقول رسمية';
}

function inferShortEnumCategory(name) {
  if (name === 'VkResult') return 'نتائج الاستدعاءات';
  if (name === 'VkStructureType') return 'أنواع البنى في الحقل sType';
  if (/ImageUsage/.test(name)) return 'استخدامات الصور';
  if (/BufferUsage/.test(name)) return 'استخدامات المخازن';
  if (/ImageLayout/.test(name)) return 'تخطيطات الصور';
  if (/Format/.test(name)) return 'صيغ البيانات أو الصور';
  if (/PresentMode/.test(name)) return 'أنماط العرض';
  if (/ColorSpace/.test(name)) return 'فضاءات اللون';
  if (/DescriptorType/.test(name)) return 'أنواع الواصفات';
  if (/ShaderStage/.test(name)) return 'مراحل الشادر';
  if (/PipelineStage/.test(name)) return 'مراحل التنفيذ';
  if (/Access/.test(name)) return 'أنواع الوصول';
  if (/ObjectType/.test(name)) return 'أنواع الكائنات';
  if (/QueueFlagBits/.test(name)) return 'قدرات الطوابير';
  if (/MemoryProperty/.test(name)) return 'خصائص الذاكرة';
  if (/MemoryHeap/.test(name)) return 'خصائص أكوام الذاكرة';
  if (/SampleCount/.test(name)) return 'أعداد العينات';
  if (/Mode/.test(name)) return 'أنماطًا رسمية';
  if (/Type/.test(name)) return 'أنواعًا رسمية';
  if (/State/.test(name)) return 'حالات رسمية';
  if (/Layout/.test(name)) return 'تخطيطات رسمية';
  if (/Usage/.test(name)) return 'استخدامات رسمية';
  if (/Operation/.test(name)) return 'عمليات رسمية';
  return 'قيمًا رسمية';
}

function describePrimitiveTooltipType(rawType) {
  const raw = String(rawType || '').trim().replace(/\bconst\b/g, '').replace(/\s+/g, ' ').trim();
  if (!raw) {
    return '';
  }

  const simple = raw.replace(/\s*\*+\s*$/g, '').trim();
  const map = {
    char: 'محرف',
    float: 'عدد عشري',
    double: 'عدد عشري مضاعف الدقة',
    size_t: 'حجم أو عدد غير موقّع',
    uint8_t: 'عدد صحيح غير موقّع بعرض 8 بت',
    uint16_t: 'عدد صحيح غير موقّع بعرض 16 بت',
    uint32_t: 'عدد صحيح غير موقّع بعرض 32 بت',
    uint64_t: 'عدد صحيح غير موقّع بعرض 64 بت',
    int8_t: 'عدد صحيح موقّع بعرض 8 بت',
    int16_t: 'عدد صحيح موقّع بعرض 16 بت',
    int32_t: 'عدد صحيح موقّع بعرض 32 بت',
    int64_t: 'عدد صحيح موقّع بعرض 64 بت',
    void: 'نوع فراغي'
  };

  if (map[simple]) {
    return map[simple];
  }
  if (/^PFN_/.test(simple)) {
    return 'مؤشر إلى دالة رد نداء';
  }
  if (/^(?:AHardwareBuffer|HANDLE|HINSTANCE|HWND|Display|Window|RROutput|VisualID|wl_display|wl_surface|xcb_connection_t|xcb_window_t|zx_handle_t|SECNativeWindowType)$/.test(simple)) {
    return 'نوع منصة خارجي';
  }
  return '';
}

function buildFunctionEntityTooltip(item) {
  const name = String(item?.name || '');
  const resolveTargetType = (prefix) => {
    const suffix = name.replace(prefix, '');
    if (!suffix) {
      return '';
    }
    const direct = `Vk${suffix}`;
    if (findTypeItemByName(direct) && !findTypeItemByName(direct)?.isSynthetic) {
      return direct;
    }
    const singular = `Vk${suffix.replace(/s$/, '')}`;
    if (findTypeItemByName(singular) && !findTypeItemByName(singular)?.isSynthetic) {
      return singular;
    }
    return '';
  };

  const explicit = [
    [/^vkCreate/, () => `دالة لإنشاء ${resolveTargetType('vkCreate') || 'كائن رسمي'}`],
    [/^vkDestroy/, () => `دالة لتحرير ${resolveTargetType('vkDestroy') || 'كائن رسمي'}`],
    [/^vkAllocate/, () => 'دالة لتخصيص مورد أو ذاكرة'],
    [/^vkFree/, () => 'دالة لتحرير مورد أو ذاكرة'],
    [/^vkEnumerate/, () => 'دالة لتعداد عناصر أو قدرات متاحة'],
    [/^vkGet/, () => 'دالة لاسترجاع بيانات أو خصائص'],
    [/^vkSet/, () => 'دالة لضبط قيمة أو خاصية'],
    [/^vkAcquire/, () => 'دالة لاكتساب مورد أو حالة'],
    [/^vkRelease/, () => 'دالة لتحرير مورد أو حالة'],
    [/^vkWait/, () => 'دالة لانتظار حالة أو مزامنة'],
    [/^vkReset/, () => 'دالة لإعادة ضبط حالة أو مورد'],
    [/^vkBind/, () => 'دالة لربط مورد بذاكرة أو كائن'],
    [/^vkMap/, () => 'دالة لربط ذاكرة مضيف بذاكرة جهاز'],
    [/^vkUnmap/, () => 'دالة لفك ربط ذاكرة مضيف'],
    [/^vkCopy/, () => 'دالة لنسخ بيانات أو موارد'],
    [/^vkBlit/, () => 'دالة لنسخ صورة مع تحويل'],
    [/^vkResolve/, () => 'دالة لفض تعدد العينات'],
    [/^vkBuild/, () => 'دالة لبناء بنية أو مورد مشتق'],
    [/^vkWrite/, () => 'دالة لكتابة بيانات أو أوصاف'],
    [/^vkUpdate/, () => 'دالة لتحديث بيانات أو حالة'],
    [/^vkMerge/, () => 'دالة لدمج بيانات أو كائنات'],
    [/^vkImport/, () => 'دالة لاستيراد مورد أو مقبض'],
    [/^vkExport/, () => 'دالة لتصدير مورد أو مقبض'],
    [/^vkBegin/, () => 'دالة لبدء عملية أو تسجيل'],
    [/^vkEnd/, () => 'دالة لإنهاء عملية أو تسجيل'],
    [/^vkQueue/, () => 'دالة لمعالجة عمل مرتبط بـ VkQueue'],
    [/^vkCmd/, () => 'دالة لتسجيل أمر داخل VkCommandBuffer'],
    [/^vkFlush/, () => 'دالة لدفع بيانات مخزنة'],
    [/^vkInvalidate/, () => 'دالة لإبطال بيانات مخزنة'],
    [/^vkTrim/, () => 'دالة لتقليص موارد داخلية'],
    [/^vkSubmit/, () => 'دالة لإرسال عمل إلى VkQueue'],
    [/^vkPresent/, () => 'دالة لتقديم صورة إلى سطح عرض']
  ];

  for (const [pattern, buildText] of explicit) {
    if (pattern.test(name)) {
      return composeSemanticTooltip({
        title: name,
        kindLabel: 'دالة Vulkan',
        typeLabel: item?.category || 'استدعاء API صريح',
        library: 'Vulkan',
        meaning: inferFunctionIntentSummary(item) || buildText(),
        whyExists: `وُجد ${name} لأن Vulkan تجعل هذا الانتقال أو الإنشاء أو الربط أو الإرسال خطوة صريحة يقررها التطبيق بنفسه بدل أن تحدث ضمنياً.`,
        whyUse: inferFunctionBenefitSummary(item) || buildText(),
        actualUsage: (getFunctionSemanticUsageItems(item)[0] || buildText()),
        warning: item?.returnType && /VkResult/.test(String(item.returnType || ''))
          ? 'افحص VkResult مباشرة بعد الاستدعاء لأن نجاح الخطوة أو فشلها يغيّر المسار التالي كله.'
          : ''
      });
    }
  }

  return composeSemanticTooltip({
    title: name,
    kindLabel: 'دالة Vulkan',
    typeLabel: item?.category || 'استدعاء API صريح',
    library: 'Vulkan',
    meaning: inferFunctionIntentSummary(item) || 'تنفذ خطوة رسمية داخل Vulkan على مورد أو حالة أو مسار تنفيذ محدد.',
    whyExists: `وُجد ${name} لأن Vulkan API صريحة وتفصل كل خطوة مؤثرة في الموارد أو التسجيل أو الإرسال أو المزامنة إلى استدعاء مستقل.`,
    whyUse: inferFunctionBenefitSummary(item),
    actualUsage: getFunctionSemanticUsageItems(item)[0] || 'يظهر داخل تدفق تهيئة أو تسجيل أو إرسال أو مزامنة حسب موقعه من المسار البرمجي.',
    warning: item?.returnType && /VkResult/.test(String(item.returnType || ''))
      ? 'تحقق من النتيجة المرجعة قبل متابعة الخطوات التالية.'
      : ''
  });
}

function buildMacroEntityTooltip(item) {
  const name = String(item?.name || '');
  let meaning = 'ماكرو من ترويسات Vulkan يغيّر المعنى قبل الترجمة أو يثبت قيمة رسمية مشتركة.';
  let whyExists = 'وُجد لأن طبقة الترويسات تحتاج ثوابت وصيغاً موحدة تبقى متاحة وقت الترجمة في كل المنصات.';
  let whyUse = 'يستخدمه المبرمج عندما يحتاج نفس التعريف الرسمي الذي تعتمد عليه الترويسات والامتدادات والنسخ.';
  let actualUsage = 'يظهر في تعريفات الترويسات أو شروط الترجمة أو في مقارنة القيم الثابتة داخل الكود.';

  if (/^VK_NULL_HANDLE$/.test(name)) {
    meaning = 'يمثل غياب مقبض Vulkan صالح، لا صفراً عشوائياً بلا دلالة.';
    whyExists = 'وُجد حتى يميز الكود بين مورد منشأ فعلاً وبين عدم امتلاك أي مقبض لهذا المورد.';
    whyUse = 'يستخدمه المبرمج في التهيئة والمقارنات والحراسة قبل التدمير أو قبل تمرير المقبض إلى استدعاء آخر.';
    actualUsage = 'يظهر في تهيئة المقابض وفي الشروط التي تتحقق من أن المورد أُنشئ بنجاح قبل استخدامه أو تحريره.';
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    meaning = 'مفتاح ترجمة شرطي يعلن أن بناء المشروع يريد تفعيل تكامل منصة محددة داخل ترويسات Vulkan.';
    whyExists = 'وُجد لأن امتدادات النوافذ والمنصات لا يجب أن تُفتح كلها في كل بناء.';
    whyUse = 'يستخدمه المبرمج عندما يحتاج أنواع ودوال منصة بعينها مثل Win32 أو Xlib أو Wayland.';
    actualUsage = 'يظهر في إعدادات البناء أو قبل تضمين `vulkan.h` حتى تكشف الترويسات تعريفات المنصة المطلوبة.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    meaning = 'ماكرو داخلي يبني شكل نوع المقبض الرسمي في الترويسات مع المحافظة على ABI المتوقع.';
    whyExists = 'وُجد لأن أنواع المقابض تحتاج تمثيلاً موحداً عبر المترجمات والمنصات.';
    whyUse = 'يستخدمه مؤلفو الترويسات أو الربطات لا كاستدعاء تشغيلي داخل التطبيق العادي.';
    actualUsage = 'يظهر داخل تعريفات Vulkan نفسها عند إنشاء typedefs الخاصة بالمقابض القابلة أو غير القابلة للإرسال.';
  }
  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION|API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH|HEADER_VERSION|HEADER_VERSION_COMPLETE|API_VERSION_\d+_\d+)$/.test(name)) {
    meaning = 'يبني أو يفكك رقم نسخة Vulkan إلى حقولها الرسمية حتى تقارن الإصدارات أو تصرح بالحد الأدنى المطلوب بدقة.';
    whyExists = 'وُجد لأن النسخة ليست رقماً واحداً عشوائياً؛ بل تركيب من variant وmajor وminor وpatch.';
    whyUse = 'يستخدمه المبرمج عند ملء `apiVersion` أو عند تحليل نسخة مدعومة ومقارنتها بما يحتاجه التطبيق.';
    actualUsage = 'يظهر في `VkApplicationInfo` أو في شروط التوافق أو في سجلات التشخيص المتعلقة بالإصدار.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    meaning = 'يمثل الاسم النصي الرسمي للامتداد كما تتوقعه دوال التعداد والتفعيل.';
    whyExists = 'وُجد حتى لا يكتب التطبيق اسم الامتداد كسلسلة حرفية قد تخطئ أو تختلف بين المواضع.';
    whyUse = 'يستخدمه المبرمج عند بناء قوائم الامتدادات المطلوبة للمثيل أو للجهاز.';
    actualUsage = 'يظهر في مصفوفات أسماء الامتدادات التي تمرر إلى create info أو في التحقق من الدعم المتاح.';
  }
  if (/_SPEC_VERSION$/.test(name)) {
    meaning = 'يمثل نسخة المواصفة الخاصة بامتداد معين، لا اسمه ولا تفعيله بحد ذاته.';
    whyExists = 'وُجد حتى تستطيع الترويسات والربطات مقارنة سلوك الامتداد عبر الإصدارات.';
    whyUse = 'يستخدمه المبرمج أو طبقات التغليف عندما تحتاج منطقاً يختلف حسب نسخة الامتداد المدعوم.';
    actualUsage = 'يظهر في فحوص التوافق أو في طبقات الربط التي تحتاج قراءة نسخة امتداد معلنة.';
  }
  if (/\w+\s*\(/.test(String(item?.syntax || ''))) {
    meaning = 'ماكرو شبيه بالدالة يوسّع إلى صيغة ترجمة أو ثابت مركب بدل تنفيذ دالة وقت التشغيل.';
    whyExists = 'وُجد لأن بعض القيم أو التركيبات يجب أن تُبنى بالكامل وقت الترجمة.';
    whyUse = 'يستخدمه المبرمج عندما يحتاج ناتج التوسيع الرسمي نفسه الذي تعتمد عليه بقية الترويسات.';
    actualUsage = 'يظهر في التعبيرات الثابتة أو في الحقول التي تتوقع قيمة مركبة من عدة أجزاء.';
  }
  return composeSemanticTooltip({
    title: name,
    kindLabel: 'ماكرو Vulkan',
    typeLabel: 'عنصر ترجمة من الترويسات',
    library: 'Vulkan',
    meaning,
    whyExists,
    whyUse,
    actualUsage
  });
}

function buildConstantEntityTooltip(item) {
  const name = String(item?.name || '');
  let meaning = 'يمثل قيمة ثابتة تقرأها Vulkan أو الكود المحيط بها كخيار أو حد أو قيمة sentinel رسمية.';
  let whyExists = 'وُجد حتى تبقى القيم الخاصة والمتكررة صريحة وموحدة بدل استخدام أرقام حرفية مبهمة.';
  let whyUse = 'يستخدمه المبرمج عندما يحتاج التعبير عن حالة رسمية ثابتة أو حد أو قيمة محجوزة تقرأها الواجهة كما هي.';
  let actualUsage = 'يظهر في التهيئة والشروط والمقارنات وفي بعض حقول البنى التي تتوقع هذه القيمة مباشرة.';

  if (/^VK_TRUE$/.test(name)) {
    meaning = 'القيمة المنطقية الرسمية الصحيحة في ABI الخاص بـ Vulkan C.';
    whyExists = 'وُجد لأن بعض الحقول تستخدم تمثيلاً ثابت العرض مثل VkBool32 بدل bool الخاص بـ C++.';
    whyUse = 'يستخدمه المبرمج عند ملء حقول Vulkan التي تتوقع قيمة منطقية رسمية من واجهة C.';
    actualUsage = 'يظهر في حقول الميزات والخصائص وخيارات الإنشاء التي تُفعَّل صراحة.';
  }
  if (/^VK_FALSE$/.test(name)) {
    meaning = 'القيمة المنطقية الرسمية الخاطئة في ABI الخاص بـ Vulkan C.';
    whyExists = 'وُجد للسبب نفسه الذي يوجد به VK_TRUE: تمثيل منطقي ثابت على حدود API.';
    whyUse = 'يستخدمه المبرمج لتعطيل خيار أو إعلان غياب دعم أو إبقاء سلوك افتراضي داخل حقل Vulkan.';
    actualUsage = 'يظهر في حقول الميزات والخصائص والخيارات التي لا تريد تفعيلها.';
  }
  if (/^VK_(?:API_)?VERSION_/.test(name)) {
    meaning = 'يمثل إصداراً محدداً من المواصفة بصيغة جاهزة للمقارنة أو للتصريح عن الاستهداف.';
    whyExists = 'وُجد حتى لا يبني التطبيق أرقام الإصدارات يدوياً في كل مرة.';
    whyUse = 'يستخدمه المبرمج عند طلب حد أدنى من API أو عند مقارنة الدعم المعلن من السائق.';
    actualUsage = 'يظهر في `apiVersion` أو في فحوص التوافق والإتاحة.';
  }
  if (/_SIZE$/.test(name)) {
    meaning = 'يمثل حجماً ثابتاً تتوقعه الواجهة لبنية أو معرف أو كتلة بيانات بعينها.';
    whyExists = 'وُجد لأن بعض المصفوفات أو المعرفات لها طول رسمي يجب احترامه في التخزين والنسخ.';
    whyUse = 'يستخدمه المبرمج عند تخصيص مصفوفة محلية أو عند قراءة بيانات تتوقع هذا الطول بالضبط.';
    actualUsage = 'يظهر في تعريف مصفوفات UUID أو LUID أو أسماء تشخيصية مشابهة.';
  }
  if (/_UUID_/.test(name) || /_LUID_/.test(name)) {
    meaning = 'يمثل طول معرّف ثنائي رسمي يجب احترامه عند قراءة أو تخزين هذا النوع من المعرفات.';
    whyExists = 'وُجد لأن طول هذه المعرفات جزء من العقد البرمجي وليس رقماً اختيارياً.';
    whyUse = 'يستخدمه المبرمج لتخصيص المصفوفة الصحيحة ونسخ العدد الصحيح من البايتات بلا زيادة أو نقص.';
    actualUsage = 'يظهر مع UUIDs وLUIDs في الاستعلامات والخصائص وربط الأجهزة.';
  }
  if (/_MAX_|_MIN_/.test(name)) {
    meaning = 'يمثل حداً رقمياً ثابتاً تستخدمه المواصفة كأقصى أو أدنى قيمة خاصة في سياق معين.';
    whyExists = 'وُجد لأن بعض القيم المحجوزة أو الحدود الخاصة يجب أن تكون موحدة في كل تنفيذ.';
    whyUse = 'يستخدمه المبرمج عند المقارنة أو الحماية من تجاوز حد تقرره المواصفة.';
    actualUsage = 'يظهر في فحوص النطاق أو عند ملء حقول تقبل قيماً خاصة مثل عدم التحديد أو الباقي.';
  }
  if (/_NONE$|_UNUSED$|_REMAINING_/.test(name)) {
    meaning = 'يمثل قيمة sentinel خاصة لا تعني رقماً عادياً، بل معنى مثل غير مستخدم أو المتبقي أو الغياب المتعمد.';
    whyExists = 'وُجد لأن بعض الحقول تحتاج طريقة صريحة للتعبير عن سلوك خاص من دون حجز حقل جديد له.';
    whyUse = 'يستخدمه المبرمج عندما يريد من Vulkan تفسير الحقل كتوجيه خاص لا كقيمة حرفية عادية.';
    actualUsage = 'يظهر في الحقول التي تسمح بتمرير قيمة محجوزة لتفعيل سلوك مثل استخدام الباقي أو عدم الاستعمال.';
  }
  return composeSemanticTooltip({
    title: name,
    kindLabel: 'ثابت Vulkan',
    typeLabel: 'قيمة ثابتة رسمية',
    library: 'Vulkan',
    meaning,
    whyExists,
    whyUse,
    actualUsage
  });
}

function buildTypeEntityTooltip(item) {
  const typeName = String(item?.name || '');
  if (!typeName) {
    return composeSemanticTooltip({
      title: 'VkType',
      kindLabel: 'نوع Vulkan',
      typeLabel: 'نوع رسمي',
      library: 'Vulkan',
      meaning: 'يمثل نوعاً رسمياً تستعمله الواجهة لتعريف مورد أو بنية أو تعداد أو رد نداء.',
      whyExists: 'وُجد لأن Vulkan تجعل العقود البرمجية صريحة عبر أنواع منفصلة بدل الاعتماد على أرقام خام.',
      whyUse: 'يستخدمه المبرمج لربط الحقول والدوال بالمورد أو الوصف أو الحالة الصحيحة.',
      actualUsage: 'يظهر في التواقيع والبنى والنتائج وفي الروابط بين خطوات التهيئة والتنفيذ.'
    });
  }

  if (findItemInCategories(vulkanData.enums, typeName)) {
    return buildEnumItemTooltip(item);
  }

  if (/^PFN_/.test(typeName)) {
    return composeSemanticTooltip({
      title: typeName,
      kindLabel: 'رد نداء Vulkan',
      typeLabel: 'مؤشر إلى دالة',
      library: 'Vulkan',
      meaning: 'يمثل نوع توقيع رد نداء تستدعيه Vulkan أو الطبقة المرتبطة بها لاحقاً عند حدوث الحدث المقصود.',
      whyExists: 'وُجد لأن الواجهة تحتاج طريقة موحدة لتعريف التواقيع القابلة للتمرير بين التطبيق والسائق أو الطبقات.',
      whyUse: 'يستخدمه المبرمج عند تسجيل callback أو عند بناء دوال تحميل ديناميكي أو طبقات تغليف.',
      actualUsage: 'يظهر في typedefs الخاصة بالردود أو في واجهات تحميل الرموز من الامتدادات.'
    });
  }

  if (/مقبض/.test(String(item?.description || ''))) {
    return composeSemanticTooltip({
      title: typeName,
      kindLabel: 'مقبض Vulkan',
      typeLabel: 'Opaque Handle',
      library: 'Vulkan',
      meaning: `يمثل فعلياً ${inferShortHandleTooltipSubject(typeName)} الذي تنشئه الواجهة وتستهلكه الدوال اللاحقة عبر هذا المقبض.`,
      whyExists: 'وُجد لأن Vulkan تفصل ملكية المورد وعمره عن تفاصيل تمثيله الداخلي داخل السائق.',
      whyUse: 'يستخدمه المبرمج للاحتفاظ بالمورد وتمريره بين الإنشاء والربط والاستخدام ثم التدمير.',
      actualUsage: 'يظهر كقيمة تعاد من دوال الإنشاء ثم تنتقل إلى دوال التهيئة أو الإرسال أو التحرير المرتبطة بالمورد نفسه.'
    });
  }

  if (findItemInCategories(vulkanData.structures, typeName)) {
    return composeSemanticTooltip({
      title: typeName,
      kindLabel: 'بنية Vulkan',
      typeLabel: 'Struct',
      library: 'Vulkan',
      meaning: `يمثل بنية تصف ${inferShortStructureTooltipSubject(typeName)} ضمن عقد واضح بين التطبيق وVulkan.`,
      whyExists: 'وُجد لأن الواجهة تجمع الإعدادات أو النتائج أو نطاقات المزامنة في بنى صريحة بدل توزيعها على بارامترات كثيرة متفرقة.',
      whyUse: 'يستخدمه المبرمج لتجهيز وصف متكامل قبل استدعاء الدالة أو لقراءة نتيجة مجمعة بعد الاستعلام.',
      actualUsage: 'يظهر عادة كـ create info أو begin info أو barrier أو وصف مورد يملأ حقوله ثم يمرر عنوانه إلى الاستدعاء المناسب.'
    });
  }

  return composeSemanticTooltip({
    title: typeName,
    kindLabel: 'نوع Vulkan',
    typeLabel: 'نوع رسمي',
    library: 'Vulkan',
    meaning: `يمثل نوعاً رسمياً باسم ${typeName} تستخدمه الواجهة لتثبيت معنى معين في التواقيع أو البنى.`,
    whyExists: 'وُجد لأن Vulkan تعتمد أنواعاً مسماة لتجعل العقد البرمجية صريحة وقابلة للتحقق.',
    whyUse: 'يستخدمه المبرمج عندما يحتاج تمرير القيمة الصحيحة أو تفسير حقل أو نتيجة وفق هذا النوع بعينه.',
    actualUsage: 'يظهر داخل التواقيع والبنى أو كناتج استعلام يربط خطوة بأخرى في المسار العملي.'
  });
}

function buildEnumEntityTooltip(item) {
  const enumName = String(item?.name || '');
  const subject = inferShortEnumCategory(enumName);
  const isFlags = /FlagBits|Flags/.test(enumName);
  let meaning = isFlags
    ? `يمثل بتاتاً قابلة للدمج تحدد ${subject} التي تقرؤها Vulkan لتفعيل أكثر من سلوك أو قدرة في الموضع نفسه.`
    : `يمثل قراراً صريحاً يحدد ${subject} التي ستقرأها Vulkan في الحقل أو النتيجة أو الاستدعاء المرتبط.`;
  let whyExists = isFlags
    ? 'وُجد لأن بعض المواضع تحتاج جمع أكثر من خيار رسمي في قيمة واحدة بدلاً من الاكتفاء بحالة منفردة.'
    : 'وُجد لأن الواجهة تحتاج اختياراً صريحاً قابل القراءة والتحقق بدل أرقام حرفية مبهمة.';
  let whyUse = isFlags
    ? 'يستخدمه المبرمج لدمج القدرات أو الاستخدامات أو المراحل أو أنواع الوصول التي يجب أن تعمل معاً.'
    : 'يستخدمه المبرمج لاختيار الفرع التنفيذي أو التفسير الصحيح الذي ستتبعه الواجهة في هذا الموضع.';
  let actualUsage = isFlags
    ? 'يظهر عادة في حقول create info أو barriers أو أوصاف الموارد، وتُدمج قيمه بعملية OR قبل تمريرها.'
    : 'يظهر في الحقول أو النتائج التي تتوقع قيمة واحدة من مجموعة بدائل رسمية معروفة.';

  if (enumName === 'VkResult') {
    meaning = 'يمثل نتيجة الاستدعاء التي تحدد هل اكتملت الخطوة بنجاح أم يجب على الكود أن يعالج فشلاً أو حالة خاصة قبل المتابعة.';
    whyExists = 'وُجد لأن Vulkan لا تخفي النجاح أو الفشل داخل استثناءات ضمنية؛ بل تعيده صراحة إلى التطبيق.';
    whyUse = 'يستخدمه المبرمج لاتخاذ القرار التالي: متابعة المسار، إعادة المحاولة، أو تنظيف الموارد ومعالجة الخطأ.';
    actualUsage = 'يظهر كقيمة مرجعة من معظم الاستدعاءات المهمة، ويجب فحصه مباشرة بعد النداء.';
  } else if (enumName === 'VkStructureType') {
    meaning = 'يمثل هوية البنية التي توضع في `sType` حتى تفسر Vulkan الذاكرة التي وصلتها على أنها هذا النوع بالضبط.';
    whyExists = 'وُجد لأن سلاسل `pNext` والبنى الممررة عبر المؤشرات تحتاج تمييزاً صريحاً وقت القراءة.';
    whyUse = 'يستخدمه المبرمج عند تعبئة كل بنية تقريباً قبل تمريرها إلى الواجهة.';
    actualUsage = 'يظهر في الحقل `sType` ويجب أن يطابق اسم البنية الفعلي لكي تقرأ بقية الحقول بشكل صحيح.';
  } else if (/^VkImageLayout/.test(enumName)) {
    meaning = 'يمثل التخطيط الحالي أو المطلوب للصورة، أي الحالة التي تجعل نوع الوصول التالي إليها صحيحاً عند التنفيذ.';
    whyExists = 'وُجد لأن Vulkan API صريحة في انتقالات الصور ولا تفترض الحالة المناسبة تلقائياً.';
    whyUse = 'يستخدمه المبرمج عند barriers والنسخ والرسم والتقديم لضبط تفسير الوصول إلى الصورة.';
    actualUsage = 'يظهر في الحقول `oldLayout/newLayout` أو في أوصاف الاستخدام التي تسبق القراءة أو الكتابة أو العرض.';
  } else if (/^VkPipelineStageFlagBits|^VkPipelineStageFlags/.test(enumName)) {
    meaning = 'يمثل مراحل التنفيذ التي يربط بها التطبيق الحواجز والتبعيات، أي أين يجب أن يتوقف التنفيذ أو يبدأ الاعتماد فعلياً.';
    whyExists = 'وُجد لأن المزامنة في Vulkan لا تعمل على مستوى عام فقط؛ بل على مراحل pipeline محددة.';
    whyUse = 'يستخدمه المبرمج لتقييد المزامنة على المراحل التي تهمه فعلاً بدل إيقاف مسار التنفيذ كله دون حاجة.';
    actualUsage = 'يظهر مع barriers وsubmissions وevents لتحديد طرفي الاعتماد الزمني بين إنتاج البيانات واستهلاكها.';
  } else if (/^VkAccessFlagBits|^VkAccessFlags/.test(enumName)) {
    meaning = 'يمثل أنواع القراءة أو الكتابة التي يغطيها الاعتماد، لا المراحل الزمنية نفسها.';
    whyExists = 'وُجد لأن معرفة المرحلة وحدها لا تكفي؛ يجب أيضاً تحديد نوع الوصول الذي يجب أن يكتمل أو يصبح مرئياً.';
    whyUse = 'يستخدمه المبرمج لربط المزامنة بنوع الوصول الحقيقي مثل shader read أو transfer write أو color attachment write.';
    actualUsage = 'يظهر مع barriers وsubpass dependencies حيث يقرن مع pipeline stages لضبط الرؤية والترتيب بشكل صحيح.';
  }

  return composeSemanticTooltip({
    title: enumName,
    kindLabel: isFlags ? 'أعلام Vulkan' : 'تعداد Vulkan',
    typeLabel: isFlags ? 'Bitmask / Flags' : 'Enum',
    library: 'Vulkan',
    meaning,
    whyExists,
    whyUse,
    actualUsage
  });
}

function finalizeEnumValueTooltip(text, fallback = 'قيمة رسمية من فولكان.') {
  let clean = sanitizeShortVulkanTooltipText(text || fallback)
    .replace(/\s+/g, ' ')
    .replace(/[،؛:\s]+$/g, '')
    .trim();
  if (!clean) {
    clean = sanitizeShortVulkanTooltipText(fallback || 'قيمة رسمية من فولكان.')
      .replace(/[.؟!]+$/g, '')
      .trim();
  }

  let words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 30) {
    clean = words.slice(0, 30).join(' ').replace(/[،؛:\s]+$/g, '').trim();
    words = clean.split(/\s+/).filter(Boolean);
  }

  if (words.length < 5) {
    clean = sanitizeShortVulkanTooltipText(fallback || 'قيمة رسمية من فولكان.')
      .replace(/[.؟!]+$/g, '')
      .trim();
  }

  return /[.؟!]$/.test(clean) ? clean : `${clean}.`;
}

function compactEnumTooltipMeaning(text) {
  return sanitizeEnumNarrativeText(text || '', '')
    .replace(/^تعني هذه القيمة أن\s*/g, '')
    .replace(/^تجعل هذه القيمة\s*/g, '')
    .replace(/^يفعّل هذا البت\s*/g, '')
    .replace(/^يفعل هذا البت\s*/g, '')
    .replace(/^تربط هذه القيمة\s*/g, '')
    .replace(/^تحصر هذه القيمة\s*/g, '')
    .replace(/^هذه القيمة هي\s*/g, '')
    .replace(/^قيمة تعداد تمثل\s*/g, '')
    .replace(/^علم يحدد أن\s*/g, '')
    .replace(/^علم يشير إلى أن\s*/g, '')
    .replace(/^قيمة تشير إلى أن\s*/g, '')
    .replace(/^أن\s+/g, '')
    .replace(/[.؟!]+$/g, '')
    .trim();
}

function compactEnumTooltipUsage(text) {
  return sanitizeEnumNarrativeText(text || '', '')
    .replace(/^تُكتب هذه القيمة عادة\s*/g, '')
    .replace(/^تظهر هذه القيمة في\s*/g, 'في ')
    .replace(/^تظهر هذه القيمة عندما\s*/g, 'عندما ')
    .replace(/^تظهر هذه القيمة\s*/g, '')
    .replace(/^تُمرَّر هذه القيمة\s*/g, '')
    .replace(/^تُفعَّل هذه القيمة مع بقية الأعلام\s*/g, 'مع بقية الأعلام ')
    .replace(/^تُفعَّل هذه القيمة\s*/g, '')
    .replace(/^تُستخدم هذه القيمة\s*/g, '')
    .replace(/^تُستخدم\s*/g, '')
    .replace(/[.؟!]+$/g, '')
    .trim();
}

function compactEnumTooltipBenefit(text) {
  return sanitizeEnumNarrativeText(text || '', '')
    .replace(/^يجعل هذا البت\s*/g, '')
    .replace(/^يجعل هذا الخيار\s*/g, '')
    .replace(/^تجعل هذه القيمة\s*/g, '')
    .replace(/^هذه القيمة\s*/g, '')
    .replace(/[.؟!]+$/g, '')
    .trim();
}

function buildSpecificEnumValueTooltip(ownerName, valueName) {
  if (ownerName === 'VkStructureType') {
    return `قيمة تشير إلى أن الحقل sType يمثل البنية ${buildStructureTypeNameFromValue(valueName)}، حتى تفسر فولكان بقية الحقول وسلسلة pNext وفق هذا النوع الصحيح.`;
  }

  if (/^VkImageUsageFlagBits/.test(ownerName) || /^VkImageUsageFlags/.test(ownerName)) {
    if (/TRANSFER_SRC/.test(valueName)) return 'علم يحدد أن الصورة يمكن استخدامها كمصدر لعمليات نقل البيانات مثل نسخ الصورة إلى مخزن أو صورة أخرى.';
    if (/TRANSFER_DST/.test(valueName)) return 'علم يحدد أن الصورة يمكن استخدامها كوجهة لعمليات نقل البيانات مثل النسخ إليها من مخزن أو صورة أخرى.';
    if (/SAMPLED/.test(valueName)) return 'علم يحدد أن الصورة يمكن ربطها كمورد مقروء لأخذ العينات داخل المظللات بدل الاقتصار على النسخ أو الكتابة المباشرة.';
    if (/STORAGE/.test(valueName)) return 'علم يحدد أن الصورة يمكن ربطها كصورة تخزينية تقرأها المظللات أو تكتب إليها مباشرة أثناء التنفيذ.';
    if (/COLOR_ATTACHMENT/.test(valueName)) return 'علم يحدد أن الصورة تصلح كمرفق لوني تُكتب إليه نتائج الرسم داخل الممرات أو العرض الديناميكي.';
    if (/DEPTH_STENCIL_ATTACHMENT/.test(valueName)) return 'علم يحدد أن الصورة تصلح كمرفق عمق أو استنسل لتخزين اختبارات العمق أو الاستنسل أثناء الرسم.';
    if (/TRANSIENT_ATTACHMENT/.test(valueName)) return 'علم يحدد أن الصورة مخصصة كمرفق مؤقت قصير العمر، مما يسمح باختيار ذاكرة أنسب عندما لا يلزم الاحتفاظ بالمحتوى طويلًا.';
    if (/INPUT_ATTACHMENT/.test(valueName)) return 'علم يحدد أن الصورة يمكن قراءتها كمرفق إدخال داخل ممر فرعي لاحق بدل معاملتها كصورة عامة في المظلّل.';
  }

  if (/^VkBufferUsageFlagBits/.test(ownerName) || /^VkBufferUsageFlags/.test(ownerName)) {
    if (/TRANSFER_SRC/.test(valueName)) return 'علم يحدد أن المخزن يمكن استخدامه كمصدر لعمليات نقل البيانات مثل نسخه إلى مخزن آخر أو إلى صورة.';
    if (/TRANSFER_DST/.test(valueName)) return 'علم يحدد أن المخزن يمكن استخدامه كوجهة لعمليات نقل البيانات مثل تعبئته من مخزن آخر أو من صورة.';
    if (/UNIFORM_TEXEL_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن عرضه كواصف عناصر منسقة موحّد تقرأه المظللات وفق التنسيق المرتبط به.';
    if (/STORAGE_TEXEL_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن عرضه كواصف عناصر منسقة تخزيني يسمح للمظللات بقراءة العناصر أو الكتابة إليها.';
    if (/UNIFORM_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن ربطه كمخزن موحّد لتغذية المظللات بالثوابت والبيانات المشتركة بين الاستدعاءات.';
    if (/STORAGE_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن ربطه كمخزن تخزيني للبيانات الكبيرة القابلة للقراءة أو الكتابة داخل المظللات.';
    if (/INDEX_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن استخدامه كمصدر لبيانات الفهارس التي تحدد ترتيب الرؤوس أثناء أوامر الرسم المفهرس.';
    if (/VERTEX_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن استخدامه كمصدر لبيانات الرؤوس التي تقرؤها مرحلة الإدخال قبل تنفيذ أوامر الرسم.';
    if (/INDIRECT_BUFFER/.test(valueName)) return 'علم يحدد أن المخزن يمكن أن يحمل أوامر الرسم أو الإرسال غير المباشر التي تقرؤها فولكان مباشرة وقت التنفيذ.';
  }

  if (/^VkQueueFlagBits/.test(ownerName) || /^VkQueueFlags/.test(ownerName)) {
    if (/GRAPHICS/.test(valueName)) return 'علم يشير إلى أن الطابور يدعم تنفيذ أوامر الرسوميات مثل الرسم ومعالجة المظللات وعمليات الإخراج إلى المرفقات.';
    if (/COMPUTE/.test(valueName)) return 'علم يشير إلى أن الطابور يدعم أوامر الحوسبة، لذلك يمكن إرسال أعمال خطوط أنابيب الحوسبة إليه دون الحاجة إلى طابور رسوميات.';
    if (/TRANSFER/.test(valueName)) return 'علم يشير إلى أن الطابور يدعم أوامر النقل مثل نسخ المخازن والصور وتنفيذ عمليات الملء أو التحديث.';
    if (/SPARSE_BINDING/.test(valueName)) return 'علم يشير إلى أن الطابور يدعم ربط الذاكرة المتناثر، وهو ضروري للمسارات التي تدير موارد متناثرة بصورة صريحة.';
    if (/PROTECTED/.test(valueName)) return 'علم يشير إلى أن الطابور يستطيع تنفيذ أعمال محمية على موارد محمية عندما يفرض المسار عزلاً إضافياً للبيانات.';
  }

  if (/^VkShaderStageFlagBits/.test(ownerName) || /^VkShaderStageFlags/.test(ownerName)) {
    if (/VERTEX_BIT/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمرحلة مظلل الرؤوس، فلا يُتاح لبقية المراحل بلا حاجة.';
    if (/TESSELLATION_CONTROL/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمرحلة تحكم التقسيم عند تجهيز الرقع قبل التقييم.';
    if (/TESSELLATION_EVALUATION/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمرحلة تقييم التقسيم عند حساب المواقع النهائية للعناصر.';
    if (/GEOMETRY/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمرحلة المظلّل الهندسي عندما يكون هذا المسار مفعلاً.';
    if (/FRAGMENT/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمرحلة المظلّل الجزئي التي تنتج اللون النهائي أو تختبره.';
    if (/COMPUTE/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لمسار الحوسبة فقط، لذلك لا يرتبط بمراحل الرسم الأخرى.';
    if (/ALL_GRAPHICS/.test(valueName)) return 'علم يحدد أن المورد أو الثابت الفوري مرئي لكل مراحل الرسوميات معًا عندما لا تريد تقييده بمرحلة واحدة.';
  }

  if (/^VkPipelineStageFlagBits/.test(ownerName) || /^VkPipelineStageFlags/.test(ownerName)) {
    if (/TOP_OF_PIPE/.test(valueName)) return 'علم يربط المزامنة ببداية خط الأنابيب قبل المراحل الفعلية، لذلك يستخدم كنقطة مبكرة لا تعني تنفيذ عمل رسومي بحد ذاته.';
    if (/DRAW_INDIRECT/.test(valueName)) return 'علم يربط المزامنة بمرحلة قراءة أوامر الرسم غير المباشر من المخازن قبل تنفيذ أوامر الرسم أو الإرسال.';
    if (/VERTEX_INPUT/.test(valueName)) return 'علم يربط المزامنة بمرحلة قراءة الرؤوس والفهارس من المخازن قبل بدء تنفيذ مراحل المظللات الرسومية.';
    if (/VERTEX_SHADER/.test(valueName)) return 'علم يربط المزامنة بمرحلة مظلل الرؤوس عندما يكون المورد سيُقرأ أو يُكتب فعليًا في هذه المرحلة.';
    if (/FRAGMENT_SHADER/.test(valueName)) return 'علم يربط المزامنة بمرحلة المظلّل الجزئي حتى يقتصر الانتظار على الموضع الذي سيقرأ المورد أثناء إنتاج اللون.';
    if (/COLOR_ATTACHMENT_OUTPUT/.test(valueName)) return 'علم يربط المزامنة بمرحلة إخراج مرفقات اللون، وهو شائع عندما تنتظر صورة العرض قبل الكتابة إليها فعليًا.';
    if (/COMPUTE_SHADER/.test(valueName)) return 'علم يربط المزامنة بمرحلة مظلل الحوسبة عندما يكون الوصول إلى المورد محصورًا بأعمال خطوط أنابيب الحوسبة.';
    if (/TRANSFER/.test(valueName)) return 'علم يربط المزامنة بمرحلة النقل مثل النسخ والملء، حتى لا يمتد الانتظار إلى مراحل لا تستخدم المورد.';
    if (/BOTTOM_OF_PIPE/.test(valueName)) return 'علم يربط المزامنة بنهاية خط الأنابيب بعد اكتمال المراحل السابقة، ويستخدم كنقطة متأخرة لا تنفذ عملاً جديدًا.';
  }

  if (/^VkAccessFlagBits/.test(ownerName) || /^VkAccessFlags/.test(ownerName)) {
    if (/INDIRECT_COMMAND_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة أوامر غير مباشرة من مخزن، لذلك يجب أن تغطيه الحواجز قبل التنفيذ.';
    if (/INDEX_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة بيانات الفهارس، حتى تعرف فولكان أن مخزن الفهارس جزء من نطاق المزامنة.';
    if (/VERTEX_ATTRIBUTE_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة صفات الرؤوس من المخازن قبل تمريرها إلى مراحل الرسم.';
    if (/UNIFORM_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة بيانات المخزن الموحّد، لذلك يجب أن ترى المظللات آخر كتابة صحيحة قبل التنفيذ.';
    if (/INPUT_ATTACHMENT_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة مرفق إدخال داخل الممر الفرعي، فيدخل هذا المسار ضمن نطاق التبعية أو الحاجز.';
    if (/SHADER_READ/.test(valueName)) return 'علم يحدد أن المورد سيُقرأ من المظللات، لذلك يجب مزامنة آخر كتابة سابقة قبل بدء هذا الوصول.';
    if (/SHADER_WRITE/.test(valueName)) return 'علم يحدد أن المورد سيُكتب من المظللات، لذلك يجب أن تغطي المزامنة هذا المسار قبل أي قراءة أو كتابة لاحقة.';
    if (/COLOR_ATTACHMENT_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة مرفق لون أثناء الاختبارات أو المزج داخل مسار الرسم.';
    if (/COLOR_ATTACHMENT_WRITE/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو كتابة مرفق لون، لذلك يجب أن تكون التبعية محصورة بمرحلة إخراج مرفقات اللون.';
    if (/DEPTH_STENCIL_ATTACHMENT_READ/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو قراءة مرفق العمق أو الاستنسل أثناء الاختبارات المرتبطة بمسار الرسم.';
    if (/DEPTH_STENCIL_ATTACHMENT_WRITE/.test(valueName)) return 'علم يحدد أن الوصول المقصود هو كتابة مرفق العمق أو الاستنسل، لذلك يجب مزامنته قبل الاستخدامات اللاحقة.';
    if (/TRANSFER_READ/.test(valueName)) return 'علم يحدد أن المورد سيُقرأ ضمن عمليات النقل مثل النسخ، فيصبح هذا الوصول جزءًا صريحًا من نطاق الحاجز.';
    if (/TRANSFER_WRITE/.test(valueName)) return 'علم يحدد أن المورد سيُكتب ضمن عمليات النقل مثل النسخ أو الملء، لذلك يجب مزامنته قبل أي استخدام لاحق.';
    if (/HOST_READ/.test(valueName)) return 'علم يحدد أن المضيف سيقرأ المورد من الذاكرة المرئية له، لذلك يجب أن تسبق ذلك مزامنة تجعل البيانات مرئية للمعالج.';
    if (/HOST_WRITE/.test(valueName)) return 'علم يحدد أن المضيف سيكتب المورد من جهة المعالج، لذلك يجب أن ترى فولكان هذه الكتابة قبل الاستخدام التالي.';
    if (/MEMORY_READ/.test(valueName)) return 'علم يحدد قراءة ذاكرة عامة غير محصورة بنوع وصول أدق، ويستعمل عندما تريد توسيع نطاق القراءة في الحاجز.';
    if (/MEMORY_WRITE/.test(valueName)) return 'علم يحدد كتابة ذاكرة عامة غير محصورة بنوع وصول أدق، ويستعمل عندما تريد توسيع نطاق الكتابة في الحاجز.';
  }

  if (ownerName === 'VkResult') {
    if (/SUCCESS$/.test(valueName)) return 'قيمة تشير إلى أن الاستدعاء اكتمل بنجاح كامل، لذلك يستطيع الكود متابعة المسار التالي دون معالجة استثنائية.';
    if (/NOT_READY$/.test(valueName)) return 'قيمة تشير إلى أن الشرط المطلوب لم يصبح جاهزًا بعد، لذلك يعود الاستدعاء بلا خطأ نهائي ولكن من دون النتيجة المطلوبة.';
    if (/TIMEOUT$/.test(valueName)) return 'قيمة تشير إلى أن مهلة الانتظار انتهت قبل تحقق الشرط المطلوب، فيتوقف الاستدعاء عند حد الزمن المحدد.';
    if (/EVENT_SET$/.test(valueName)) return 'قيمة تشير إلى أن الحدث أصبح مضبوطًا، ولذلك يستطيع الكود اعتبار الشرط المرتبط به متحققًا والمتابعة.';
    if (/EVENT_RESET$/.test(valueName)) return 'قيمة تشير إلى أن الحدث غير مضبوط حاليًا، لذلك لا يجوز متابعة المسار الذي ينتظر تحقق هذا الشرط.';
    if (/INCOMPLETE$/.test(valueName)) return 'قيمة تشير إلى أن البيانات الراجعة لم تكتمل كلها، لذلك يحتاج الكود إلى إعادة المحاولة أو توسيع مساحة النتائج.';
    if (/SUBOPTIMAL/.test(valueName)) return 'قيمة تشير إلى أن العملية نجحت لكن مسار العرض لم يعد مثاليًا، لذلك يمكن المتابعة مؤقتًا مع التحضير لإعادة التهيئة.';
    if (/OUT_OF_DATE/.test(valueName)) return 'قيمة تشير إلى أن مورد العرض الحالي فقد توافقه مع السطح أو النافذة، لذلك يجب إعادة إنشاء VkSwapchainKHR قبل المتابعة.';
    if (/^VK_ERROR_/.test(valueName)) return 'قيمة تشير إلى أن الاستدعاء فشل بخطأ فعلي، لذلك يجب إيقاف هذا المسار أو معالجته قبل أي متابعة.';
  }

  if (ownerName === 'VkImageLayout') {
    if (/UNDEFINED$/.test(valueName)) return 'قيمة تشير إلى أن محتوى الصورة السابق غير مطلوب، مما يسمح لفولكان بتجاهله قبل أول استخدام لاحق لها.';
    if (/GENERAL$/.test(valueName)) return 'قيمة تشير إلى تخطيط عام يسمح بعدة أنماط وصول إلى الصورة، لكنه أقل تخصصًا وكفاءة من التخطيطات الموجهة لمسار واحد.';
    if (/COLOR_ATTACHMENT_OPTIMAL$/.test(valueName)) return 'قيمة تشير إلى أن الصورة في التخطيط الأنسب للكتابة إليها كمرفق لون أثناء الرسم داخل الممرات أو العرض الديناميكي.';
    if (/DEPTH_STENCIL_ATTACHMENT_OPTIMAL$/.test(valueName)) return 'قيمة تشير إلى أن الصورة جاهزة لتعمل كمرفق عمق أو استنسل أثناء اختبارات الرسم والكتابة المرتبطة بها.';
    if (/SHADER_READ_ONLY_OPTIMAL$/.test(valueName)) return 'قيمة تشير إلى أن الصورة جاهزة للقراءة فقط من المظللات أو مرفقات الإدخال دون توقع كتابة في هذا التخطيط.';
    if (/TRANSFER_SRC_OPTIMAL$/.test(valueName)) return 'قيمة تشير إلى أن الصورة جاهزة لتكون مصدرًا لعمليات النقل مثل نسخها إلى مخزن أو صورة أخرى.';
    if (/TRANSFER_DST_OPTIMAL$/.test(valueName)) return 'قيمة تشير إلى أن الصورة جاهزة لتكون وجهة لعمليات النقل مثل تعبئتها من مخزن أو من صورة أخرى.';
    if (/PRESENT_SRC/.test(valueName)) return 'قيمة تشير إلى أن الصورة أصبحت في الحالة التي يتوقعها نظام العرض قبل تقديمها عبر VkSwapchainKHR.';
  }

  return '';
}

function buildGenericEnumValueTooltip(ownerItem, row) {
  const ownerName = String(ownerItem?.name || '');
  const valueName = String(row?.name || '');
  const isFlag = /FlagBits|Flags/.test(ownerName);
  const meaning = compactEnumTooltipMeaning(row?.meaning || buildEnumValueMeaningFallback(valueName, ownerName));
  const usage = compactEnumTooltipUsage(row?.usage || buildEnumValueUsageFallback(valueName, ownerName, {enumName: ownerName}));
  const benefit = compactEnumTooltipBenefit(row?.benefit || buildEnumValueBenefitFallback(valueName, ownerName));

  const prefix = isFlag ? 'علم يحدد أن' : 'قيمة تشير إلى أن';
  let text = `${prefix} ${meaning || `هذه القيمة تغير الفرع التنفيذي داخل ${ownerName || 'هذا التعداد'}`}`;
  if (usage && !/^(?:هذا|هذه)\b/.test(usage)) {
    text += isFlag ? `، ويُفعَّل ${usage}` : `، وتُستخدم ${usage}`;
  } else if (benefit) {
    text += `، ${benefit}`;
  } else {
    text += isFlag
      ? `، حتى تقرأه فولكان كخيار فعلي داخل ${ownerName || 'هذا النوع'}`
      : `، لتختار فولكان هذا المسار بدل قيمة أخرى داخل ${ownerName || 'هذا التعداد'}`;
  }
  return finalizeEnumValueTooltip(text, isFlag ? `علم يحدد خيارًا فعليًا داخل ${ownerName || 'هذا النوع'}.` : `قيمة تشير إلى فرع تنفيذي فعلي داخل ${ownerName || 'هذا التعداد'}.`);
}

function buildEnumValueEntityTooltip(ownerItem, row) {
  const ownerName = String(ownerItem?.name || '');
  const valueName = String(row?.name || '');
  const specific = buildSpecificEnumValueTooltip(ownerName, valueName);
  const meaning = specific || compactEnumTooltipMeaning(row?.meaning || buildEnumValueMeaningFallback(valueName, ownerName));
  const usage = compactEnumTooltipUsage(row?.usage || buildEnumValueUsageFallback(valueName, ownerName, {enumName: ownerName}));
  const benefit = compactEnumTooltipBenefit(row?.benefit || buildEnumValueBenefitFallback(valueName, ownerName));
  return composeSemanticTooltip({
    title: valueName,
    kindLabel: /FlagBits|Flags/.test(ownerName) ? 'قيمة بتية' : 'قيمة تعداد',
    typeLabel: ownerName || 'Enum Value',
    library: 'Vulkan',
    meaning,
    whyExists: /FlagBits|Flags/.test(ownerName)
      ? `وُجدت هذه القيمة حتى تفعّل سلوكاً محدداً داخل ${ownerName} عند دمجها مع بقية البتات أو استخدامها منفردة.`
      : `وُجدت هذه القيمة حتى تختار فرعاً تنفيذياً أو حالة محددة داخل ${ownerName} بدل أي بديل آخر.`,
    whyUse: benefit || usage,
    actualUsage: usage || benefit
  });
}

function buildParameterEntityTooltip(param, item = null) {
  const override = getVulkanParameterOverride(param, item);
  const name = String(param?.name || '');
  const rawType = String(param?.type || '').trim();
  const typeName = normalizeLookupName(rawType);
  const primitiveType = describePrimitiveTooltipType(rawType);
  const meaning = override?.meaning || inferParameterMeaning(param, item);
  const whyPassed = override?.usage || inferParameterUsage(param, item);
  const actualUsage = override?.actualUsage || inferParameterActualUsage(param, item);
  const effect = override?.effect || inferParameterEffect(param, item);

  if (meaning || whyPassed || actualUsage || effect) {
    return [
      `المعامل: ${name || 'غير مسمى'}`,
      rawType ? `النوع: ${rawType}` : '',
      override?.tooltip || '',
      meaning ? `المعنى الحقيقي: ${meaning}` : '',
      whyPassed ? `لماذا يُمرر: ${whyPassed}` : '',
      actualUsage ? `كيف يظهر في الاستخدام الفعلي: ${actualUsage}` : '',
      effect ? `تنبيه أو أثر تغييره: ${effect}` : '',
      item?.name ? `ضمن: ${item.name}` : ''
    ].filter(Boolean).join('\n');
  }

  if (name === 'device') return 'معامل يمثل VkDevice الهدف لهذا الاستدعاء.';
  if (name === 'physicalDevice') return 'معامل يمثل VkPhysicalDevice لهذا الاستدعاء.';
  if (name === 'queue') return 'معامل يمثل VkQueue المرتبط بهذا الاستدعاء.';
  if (name === 'commandBuffer') return 'معامل يمثل VkCommandBuffer الهدف لهذا الاستدعاء.';
  if (name === 'pAllocator') return 'معامل يمثل VkAllocationCallbacks اختياريًا.';
  if (name === 'pNext') return 'معامل يمثل سلسلة البنى الامتدادية عبر pNext.';
  if (/Count$/.test(name) && !/\*/.test(rawType)) return 'معامل يمثل عدد العناصر المرتبطة بهذا الاستدعاء.';
  if (/^pp/.test(name)) return 'معامل يمثل مؤشراً إلى مؤشرات.';
  if (/^p/.test(name) && /\*/.test(rawType)) {
    if (typeName.startsWith('Vk')) {
      return /^\s*const\b/.test(rawType)
        ? `معامل يمثل مؤشراً ثابتًا إلى ${typeName}.`
        : `معامل يمثل مؤشراً إلى ${typeName}.`;
    }
    if (primitiveType) {
      return /^\s*const\b/.test(rawType)
        ? `معامل يمثل مؤشراً ثابتًا إلى ${primitiveType}.`
        : `معامل يمثل مؤشراً إلى ${primitiveType}.`;
    }
    return /^\s*const\b/.test(rawType)
      ? 'معامل يمثل مؤشراً ثابتًا إلى بيانات إدخال.'
      : 'معامل يمثل مؤشراً إلى بيانات أو نتائج.';
  }
  if (findItemInCategories(vulkanData.enums, typeName)) return `معامل يمثل قيمة من التعداد ${typeName}.`;
  if (/Flags?$/.test(typeName)) return `معامل يمثل أعلامًا من النوع ${typeName}.`;
  if (/^Vk/.test(typeName)) return `معامل يمثل ${typeName} في هذا الاستدعاء.`;
  if (primitiveType) return `معامل يمثل ${primitiveType}.`;
  return 'معامل رسمي في هذا الاستدعاء.';
}

function buildFieldEntityTooltip(fieldName, ownerType = '', fieldType = '') {
  const rawFieldType = String(fieldType || '').trim();
  const normalizedType = normalizeLookupName(rawFieldType);
  const ownerLabel = ownerType || 'هذه البنية';
  const primitiveType = describePrimitiveTooltipType(rawFieldType);

  if (fieldName === 'sType') return 'الحقل: sType\nالمعنى الحقيقي: يثبت نوع البنية الرسمي الذي ستقرأه Vulkan من هذا العنوان.\nلماذا وُجد: حتى تستطيع Vulkan تمييز هذه البنية عن غيرها داخل الذاكرة أو داخل سلاسل pNext.\nكيف يظهر في الاستخدام الفعلي: يملأ قبل الاستدعاء بقيمة VK_STRUCTURE_TYPE المناسبة ثم تعتمد عليه Vulkan فور قراءة البنية.';
  if (fieldName === 'pNext') return 'الحقل: pNext\nالمعنى الحقيقي: يشير إلى أول بنية امتدادية مرتبطة بهذه البنية حتى تستطيع Vulkan متابعة قراءة سلسلة الامتدادات بعد البنية الأساسية.\nلماذا وُجد: لأن Vulkan توسّع السلوك عبر سلاسل بنى اختيارية بدل كسر شكل البنى الأساسية كل مرة.\nكيف يظهر في الاستخدام الفعلي: يكون nullptr في المسار الأساسي، أو يحمل عنوان بنية إضافية عندما تحتاج امتدادًا أو سلوكًا غير افتراضي.';
  if (/Count$/.test(fieldName) && !/\*/.test(rawFieldType)) return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل عدد العناصر الحقيقي الذي ستقرأه Vulkan من المصفوفة أو المؤشر المرافق لهذا الحقل.\nلماذا وُجد: لأن الواجهة لا تستطيع تخمين طول المصفوفات أو عدد الموارد من المؤشر وحده، لذلك يجب أن يبقى هذا العدّاد مقترنًا بالبيانات الفعلية.\nكيف يظهر في الاستخدام الفعلي: يملأ قبل الاستدعاء بعدد العناصر الفعلي، ثم تعتمد عليه Vulkan لتفسير المصفوفة أو البيانات المرتبطة من دون تخمين.`;
  if (/^p/.test(fieldName) && /\*/.test(rawFieldType)) {
    const targetLabel = normalizedType.startsWith('Vk')
      ? normalizedType
      : (primitiveType || 'بيانات مرتبطة');
    return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل مؤشراً إلى ${targetLabel} داخل ${ownerLabel}، لا القيمة نفسها.\nلماذا وُجد: لأن البيانات الفعلية تعيش خارج هذه البنية، وهذه البنية تحتفظ فقط بعنوانها حتى تقرأها Vulkan عند الحاجة.\nكيف يظهر في الاستخدام الفعلي: يربط التطبيق هذا الحقل بعنوان بنية أو مصفوفة أو نتيجة، ثم تعتمد عليه Vulkan أثناء الإنشاء أو الاستعلام أو التنفيذ.`;
  }
  if (findItemInCategories(vulkanData.enums, normalizedType)) return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل قيمة من التعداد ${normalizedType} لتحديد الفرع التنفيذي أو الحالة التي ستقرأها Vulkan من ${ownerLabel}.\nلماذا وُجد: حتى يبقى الاختيار صريحًا ومقروءًا بدل الاعتماد على رقم حرفي بلا معنى.\nكيف يظهر في الاستخدام الفعلي: يملأ بقيمة تعداد مناسبة قبل الاستدعاء ثم يغير تفسير Vulkan لهذه البنية مباشرة.`;
  if (/Flags?$/.test(normalizedType)) return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل قناع بتات من النوع ${normalizedType} يفعّل أكثر من خيار رسمي داخل ${ownerLabel}.\nلماذا وُجد: لأن هذا الموضع يسمح بجمع خيارات متعددة بدل الاكتفاء بحالة واحدة فقط.\nكيف يظهر في الاستخدام الفعلي: يملأ عادة بدمج عدة أعلام بعملية OR ثم تقرأه Vulkan عند تفسير البنية.`;
  if (/^Vk/.test(normalizedType)) return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل كائنًا أو بنية من النوع ${normalizedType} داخل ${ownerLabel}.\nلماذا وُجد: لأن هذه البنية تحتاج ربط مورد أو وصف رسمي آخر حتى تكتمل دلالتها التنفيذية.\nكيف يظهر في الاستخدام الفعلي: يملأ بمقبض أو بنية سبق تجهيزها ثم تعتمد عليه Vulkan في الخطوة التالية.`;
  if (primitiveType) return `الحقل: ${fieldName}\nالمعنى الحقيقي: يحمل ${primitiveType} داخل ${ownerLabel}.\nلماذا وُجد: لأن هذا الجزء من البنية يحتاج قيمة مباشرة مثل عدد أو طول أو فهرس أو مهلة أو حجم.\nكيف يظهر في الاستخدام الفعلي: يملأ قبل الاستدعاء بالقيمة التي تصف هذا الجزء من السلوك أو المورد.`;
  return `الحقل: ${fieldName}\nالمعنى الحقيقي: جزء رسمي من ${ownerLabel} يشارك في تحديد ما الذي ستقرأه Vulkan من هذه البنية.\nكيف يظهر في الاستخدام الفعلي: يملأ أو يقرأ ضمن مسار تجهيز البنية قبل تمريرها إلى الدالة المرتبطة.`;
}

function buildAnalysisVariableEntityTooltip(variable, currentItem = null) {
  if (!variable) {
    return 'متغير محلي داخل المثال الحالي.';
  }
  const typeName = normalizeLookupName(variable.type || '');
  const role = explainVariableRole(variable, currentItem);
  const actualValue = explainVariableInitialization(variable);
  return [
    `المتغير: ${variable.name || 'محلي'}`,
    variable.type ? `النوع: ${variable.type}` : '',
    role ? `المعنى الحقيقي: ${role}` : '',
    actualValue ? `كيف يظهر في الاستخدام الفعلي: يبدأ عادة بالقيمة ${actualValue}` : '',
    typeName.startsWith('Vk')
      ? `لماذا يستخدمه المبرمج: يحتفظ بالمقبض أو البنية أو النتيجة الرسمية حتى تنتقل بها الخطوات التالية من المثال.`
      : 'لماذا يستخدمه المبرمج: يحتفظ بقيمة أو حالة أو نتيجة مرحلية يحتاجها المسار التالي داخل المثال.'
  ].filter(Boolean).join('\n');
}

function buildRawTypeTooltip(rawType, item) {
  const raw = String(rawType || '').trim();
  const typeName = normalizeLookupName(raw);
  const resolvedTypeName = resolveVulkanOpaqueTypeReferenceName(typeName);
  const primitiveType = describePrimitiveTooltipType(raw);

  if (/^\s*const\s+Vk[A-Za-z0-9_]+\s*\*$/.test(raw)) {
    return finalizeShortVulkanTooltip(`مؤشر ثابت إلى ${typeName}`, `مؤشر ثابت إلى ${typeName || 'نوع Vulkan'}.`);
  }
  if (/Vk[A-Za-z0-9_]+\s*\*$/.test(raw)) {
    return finalizeShortVulkanTooltip(`مؤشر إلى ${typeName}`, `مؤشر إلى ${typeName || 'نوع Vulkan'}.`);
  }
  if (/char\s*\*/.test(raw)) {
    return 'مؤشر إلى سلسلة نصية.';
  }
  if (primitiveType) {
    return finalizeShortVulkanTooltip(`نوع يمثل ${primitiveType}`, `نوع يمثل ${primitiveType}.`);
  }
  if (findItemInCategories(vulkanData.enums, resolvedTypeName)) {
    return buildEnumItemTooltip(findItemInCategories(vulkanData.enums, resolvedTypeName));
  }
  const typeItem = resolvedTypeName ? findTypeItemByName(resolvedTypeName) : null;
  if (typeItem && resolvedTypeName !== typeName) {
    const publicTooltip = typeItem.isSynthetic
      ? finalizeShortVulkanTooltip(
        `${typeName} هو الاسم البنيوي الداخلي للمقبض ${resolvedTypeName}`,
        `${typeName} هو اسم البنية الداخلية المعتمة التي تُعرّف الترويسة عبرها المقبض ${resolvedTypeName}.`
      )
      : buildTypeEntityTooltip(typeItem);
    return `${typeName} هو اسم البنية الداخلية المعتمة التي تُعرّف الترويسة عبرها المقبض ${resolvedTypeName}.\n${publicTooltip}`;
  }
  if (typeItem && !typeItem.isSynthetic) {
    return buildTypeEntityTooltip(typeItem);
  }
  return finalizeShortVulkanTooltip(`نوع ${raw || typeName || 'برمجي'}`, 'نوع من Vulkan.');
}

function buildParameterTooltip(param, item) {
  return buildParameterEntityTooltip(param, item);
}

function getFunctionParameterAnchorId(functionName = '', paramName = '') {
  return makeAnchorId('function-param', `${functionName || 'function'}-${paramName || 'param'}`);
}

function buildFunctionParameterIndex(item = null) {
  const index = {};
  (item?.parameters || []).forEach((param) => {
    if (param?.name) {
      index[param.name] = param;
    }
  });
  return index;
}

function renderFunctionParameterReferenceToken(param, item, label = '', options = {}) {
  const tokenLabel = String(label || param?.name || '').trim();
  if (!tokenLabel) {
    return '';
  }

  const tooltip = buildParameterTooltip(param, item);
  const aria = escapeAttribute(`${tokenLabel}: ${tooltip.replace(/\n/g, ' - ')}`);
  const content = safeRenderEntityLabel(tokenLabel, 'variable', {code: true});
  const functionName = String(item?.name || '').trim();
  const paramName = String(param?.name || tokenLabel).trim();
  const inlineNarrative = Boolean(options.inlineNarrative);
  const baseClassName = inlineNarrative
    ? 'inline-code-reference code-token usage-bridge-inline-link param-name entity-link-with-icon'
    : 'param-name code-token entity-link-with-icon';

  if (!functionName || !paramName) {
    const staticClassName = inlineNarrative
      ? `${baseClassName} inline-code-reference-static`
      : baseClassName;
    return `<span class="${staticClassName}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${content}</span>`;
  }

  const anchorId = getFunctionParameterAnchorId(functionName, paramName);
  const linkClassName = inlineNarrative
    ? `${baseClassName} doc-link`
    : 'param-name code-token doc-link entity-link-with-icon';
  return `<a href="#${escapeAttribute(anchorId)}" class="${linkClassName}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="scrollToAnchor('${escapeAttribute(anchorId)}'); return false;">${content}</a>`;
}

function renderFunctionParameterName(param, item) {
  return renderFunctionParameterReferenceToken(param, item, param?.name || '');
}

function resolveReferenceNavigation(name) {
  if (!name) {
    return null;
  }

  const cmakeAlias = getCmakeReferenceAlias(name);
  if (cmakeAlias) {
    const aliasedEntry = findCmakeSearchEntryByName(cmakeAlias.targetName);
    if (aliasedEntry) {
      const anchorCommand = cmakeAlias.anchorId
        ? `showCmakeEntity('${escapeAttribute(aliasedEntry.kind)}', '${escapeAttribute(aliasedEntry.slug)}'); setTimeout(() => scrollToAnchor('${escapeAttribute(cmakeAlias.anchorId)}'), 30)`
        : `showCmakeEntity('${escapeAttribute(aliasedEntry.kind)}', '${escapeAttribute(aliasedEntry.slug)}')`;
      return {
        type: 'cmake',
        kind: aliasedEntry.kind,
        slug: aliasedEntry.slug,
        anchorId: cmakeAlias.anchorId || '',
        semanticAlias: cmakeAlias,
        command: anchorCommand
      };
    }
  }

  const cmakeEntry = findCmakeSearchEntryByName(name);
  if (cmakeEntry) {
    return {
      type: 'cmake',
      kind: cmakeEntry.kind,
      slug: cmakeEntry.slug,
      command: `showCmakeEntity('${escapeAttribute(cmakeEntry.kind)}', '${escapeAttribute(cmakeEntry.slug)}')`
    };
  }

  if (findCommandItemByName(name)) {
    return {
      type: 'command',
      command: buildShowCommandCall(name)
    };
  }

  if (findMacroItemByName(name)) {
    return {
      type: 'macro',
      command: `showMacro('${escapeHtml(name)}')`
    };
  }

  if (findConstantItemByName(name)) {
    return {
      type: 'constant',
      command: `showConstant('${escapeHtml(name)}')`
    };
  }

  const typeNavigation = getTypeNavigation(name);
  if (typeNavigation) {
    return {
      type: 'type',
      command: `${typeNavigation.action}('${escapeHtml(typeNavigation.name)}')`
    };
  }

  if (getCppReferenceItem(name)) {
    return {
      type: 'cpp',
      command: `showCppReference('${escapeHtml(name)}')`
    };
  }

  return null;
}

function getEnumValueAnchorId(enumName, valueName) {
  return makeAnchorId('enum-value', `${enumName}-${valueName}`);
}

function findEnumOwnerOfValue(valueName, preferredEnumName = '') {
  const raw = String(valueName || '').trim();
  if (!raw) {
    return null;
  }

  const tryEnum = (enumName) => {
    const enumItem = findItemInCategories(vulkanData.enums, enumName);
    if (!enumItem) {
      return null;
    }
    const row = getEnumValueRows(enumItem).find((entry) => entry.name === raw);
    return row ? {enumItem, row} : null;
  };

  if (preferredEnumName) {
    const preferredMatch = tryEnum(preferredEnumName);
    if (preferredMatch) {
      return preferredMatch;
    }
  }

  for (const enumItem of Object.values(vulkanData.enums || {})) {
    const categoryItems = Array.isArray(enumItem?.items) ? enumItem.items : [];
    for (const candidate of categoryItems) {
      const row = getEnumValueRows(candidate).find((entry) => entry.name === raw);
      if (row) {
        return {enumItem: candidate, row};
      }
    }
  }

  return null;
}

function buildEnumValueTooltip(ownerItem, row) {
  if (!ownerItem || !row) {
    return '';
  }
  return buildEnumValueEntityTooltip(ownerItem, row);
}

function buildEnumItemTooltip(item) {
  if (!item) {
    return '';
  }
  return buildEnumEntityTooltip(item);
}

function normalizeNoteText(note) {
  return String(note || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeNotes(notes) {
  const unique = [];
  const seen = new Set();

  (notes || []).forEach((note) => {
    const raw = String(note || '').trim();
    const normalized = normalizeNoteText(raw);
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    unique.push(raw);
  });

  return unique;
}

function hasRealExample(example) {
  if (!example) {
    return false;
  }

  return !String(example).includes('مثال توليدي');
}

function getUsageItems(item) {
  if (!item) {
    return [];
  }

  if (Array.isArray(item.usage)) {
    return item.usage.filter(Boolean);
  }

  return item.usage ? [item.usage] : [];
}

function isMarginalUsageText(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return true;
  }

  return [
    /^قبل الاستخدام\b/,
    /^الخلاصة:/,
    /^قد يظهر\b/,
    /^إذا لم تظهر\b/,
    /^لم تُوثّق\b/,
    /^لم تُحمّل\b/,
    /^هذا لا يلغي\b/,
    /^لا تتوفر\b/,
    /محلياً/,
    /غير موثق/,
    /يجب اختيار قيمة معرفة رسمياً/,
    /بدلاً من أرقام حرفية أو cast غامض/,
    /^بعد الاستدعاء افحص القيمة المرجعة/,
    /^تعيد الدالة قيمة من النوع/,
    /^لا تعيد هذه الدالة قيمة مباشرة/
  ].some((pattern) => pattern.test(normalized));
}

function renderUsageSection(item, title = '📘 شرح الاستخدام') {
  let usageItems = getUsageItems(item).filter((text) => !isMarginalUsageText(text));
  const isFunctionItem = /^vk[A-Za-z0-9_]+$/.test(String(item?.name || ''));

  if (isFunctionItem) {
    usageItems = usageItems.filter(isReadableLocalizedParagraph);
    if (!usageItems.length) {
      usageItems = [
        `${inferFunctionIntentSummary(item)}.`,
        `${inferFunctionBenefitSummary(item)}.`
      ];
    }
  }

  if (!usageItems.length) {
    return '';
  }

  return `
    <section class="usage-section">
      <h2>${title}</h2>
      <div class="content-card prose-card">
        ${usageItems.map(text => `<p>${text}</p>`).join('')}
      </div>
    </section>
  `;
}

function isReadableLocalizedParagraph(text) {
  const stripped = stripVulkanTechnicalIdentifiers(text, {includeDrm: true})
    .replace(/\s+/g, ' ');
  const englishWords = stripped.match(/[A-Za-z]{3,}/g) || [];
  return englishWords.length <= 4 && !hasCorruptedLocalizedText(text);
}

function hasCorruptedLocalizedText(text) {
  return /[ء-ي][A-Za-z]|[A-Za-z][ء-ي]|\b(?:within|potentially|combined|color|set|binding|presentation|server|passes|ray tracing|video coding|Command Buffer)\b|مخزنs|رأس المخزنs/i.test(String(text || ''));
}

function isOperationalFunctionParagraph(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return true;
  }

  return [
    /^قبل الاستدعاء\b/,
    /^قد تكتب الدالة\b/,
    /^بعد الاستدعاء افحص القيمة المرجعة\b/,
    /^تعيد الدالة\b/,
    /^لا تعيد هذه الدالة\b/,
    /^إذا كان\s+p[A-Z]/,
    /^وإلا فيجب أن يشير\s+p[A-Z]/,
    /^وإذا كانت قيمة\s+p[A-Z]/,
    /^إذا كانت قيمة\s+p[A-Z]/,
    /ستُعاد القيمة\s+VK_[A-Z0-9_]+\s+بدلاً من\s+VK_[A-Z0-9_]+/
  ].some((pattern) => pattern.test(normalized));
}

function getFunctionSemanticUsageItems(item) {
  return getUsageItems(item)
    .filter((text) => isReadableLocalizedParagraph(text) && !isMarginalUsageText(text))
    .map((text) => cleanFunctionUsageSummary(text))
    .filter(Boolean);
}


function isGenericFunctionMeaningText(text) {
  const body = String(text || '').replace(/^الوصف الرسمي:\s*/g, '').trim();
  if (!body) {
    return true;
  }

  return [
    /دالة مرجعية من Vulkan/i,
    /الشرح التفصيلي الكامل غير متوفر/i,
    /دالة لاكتساب مورد أو قفل أو صورة أو حالة تشغيل مطلوبة قبل المتابعة في التنفيذ/i,
    /دالة استعلام تُستخدم لاسترجاع خصائص أو مؤشرات أو بيانات من واجهة Vulkan/i,
    /دالة لإنشاء كائن أو مورد جديد داخل Vulkan وإرجاع مقبض صالح لاستخدامه لاحقاً/i,
    /دالة لتحرير الموارد وتدمير الكائن المرتبط بها عند انتهاء الاستخدام/i,
    /دالة تعداد تُستخدم لاكتشاف العناصر المدعومة/i,
    /أمر يُسجّل داخل مخزن أوامر لتنفيذ عمل على المعالج الرسومي أثناء الإرسال للطابور/i
  ].some((pattern) => pattern.test(body));
}

function cleanFunctionUsageSummary(text) {
  return String(text || '')
    .replace(/^تُستخدم هذه الدالة من أجل:\s*/g, '')
    .replace(/^تُستخدم الدالة\s+vk[A-Za-z0-9_]+\s+من أجل\s*/g, '')
    .replace(/[.،\s]+$/g, '')
    .trim();
}

function normalizeFunctionIntentPhrase(text) {
  let body = String(text || '').trim();
  if (!body) {
    return '';
  }

  const replacements = [
    [/^دالة\s+لل/,'ال'],
    [/^دالة\s+ل/,''],
    [/^أمر\s+يُسجّل\s+داخل\s+مخزن\s+أوامر\s+ل/,''],
    [/^أمر\s+يُسجّل\s+داخل\s+مخزن\s+أوامر\s+/,''],
    [/^أمر\s+/,'']
  ];

  replacements.forEach(([pattern, replacement]) => {
    body = body.replace(pattern, replacement);
  });

  return body.trim();
}

function cleanFunctionMeaningSeed(text) {
  return String(text || '')
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/^المعنى الأساسي لهذه الدالة:\s*/g, '')
    .replace(/^تُستخدم هذه الدالة من أجل:\s*/g, '')
    .replace(/^تُستخدم الدالة\s+vk[A-Za-z0-9_]+\s+من أجل\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeFunctionExplanationText(text) {
  let body = cleanFunctionMeaningSeed(text);
  if (!body) {
    return '';
  }

  const replacements = [
    ['Custom resolve', 'تسوية مخصّصة'],
    ['debug marker', 'علامة تصحيح'],
    ['mesh shaders', 'شيدرات الشبكة'],
    ['mesh shader', 'شيدر الشبكة'],
    ['mesh tasks', 'مهام الشبكة'],
    ['mesh task', 'مهمة شبكة'],
    ['execution graph', 'مخطط التنفيذ'],
    ['data graph', 'مخطط البيانات'],
    ['tensor', 'موتر'],
    ['micromap', 'ميكروماب'],
    ['layout', 'تخطيط'],
    ['template', 'قالب'],
    ['descriptor set', 'مجموعة الواصفات'],
    ['descriptor sets', 'مجموعات الواصفات'],
    ['query pool', 'مجموعة الاستعلامات'],
    ['swapchain', 'سلسلة التبديل'],
    ['fences', 'الأسِيجة'],
    ['fence', 'سياج'],
    ['semaphores', 'الإشارات'],
    ['semaphore', 'إشارة'],
    ['pipeline', 'خط الأنابيب'],
    ['resolve', 'التسوية']
  ];

  replacements.forEach(([from, to]) => {
    body = body.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
  });

  return body.replace(/\s+/g, ' ').trim();
}

function localizeFunctionMeaningSeed(text) {
  let body = normalizeFunctionExplanationText(text);
  if (!body) {
    return '';
  }

  const replacements = [
    ['Begins a shader resolve operation', 'بدء عملية resolve للشيدر'],
    ['Begins shader resolve operation', 'بدء عملية resolve للشيدر'],
    ['shader resolve operation', 'عملية resolve للشيدر'],
    ['ray tracing', 'تتبع الأشعة'],
    ['video coding', 'ترميز الفيديو'],
    ['Command Buffer', 'مخزن الأوامر'],
    ['transform feedback buffers', 'مخازن التغذية الراجعة للتحويل'],
    ['vertex buffers', 'مخازن الرؤوس'],
    ['buffer regions', 'مناطق المخازن'],
    ['buffers', 'المخازن'],
    ['attachments', 'المرفقات'],
    ['color image', 'صورة اللون'],
    ['combined depth/stencil image', 'صورة العمق/الاستنسل'],
    ['within bound framebuffer attachments', 'ضمن المرفقات المرتبطة حاليًا بمخزن الإطارات'],
    ['potentially performing format conversion', 'مع إمكانية إجراء تحويل في التنسيق'],
    ['debug label region', 'منطقة تسمية تصحيحية'],
    ['debug utils label region', 'منطقة تسمية تصحيحية Debug Utils'],
    ['command buffer', 'مخزن الأوامر'],
    ['render pass', 'تمرير الرسم'],
    ['dynamic rendering', 'الرسم الديناميكي'],
    ['conditional rendering block', 'كتلة الرسم الشرطي'],
    ['conditional rendering', 'الرسم الشرطي'],
    ['descriptor buffers', 'مخازن الواصفات'],
    ['descriptor buffer', 'مخزن الواصفات'],
    ['shader objects', 'كائنات الشيدر'],
    ['transform feedback buffers', 'مخازن التغذية الراجعة للتحويل'],
    ['vertex buffers', 'مخازن الرؤوس'],
    ['line width', 'عرض الخط'],
    ['beginning', 'بداية'],
    ['begin', 'بدء'],
    ['begins', 'بدء'],
    ['bind', 'ربط'],
    ['set', 'ضبط'],
    ['shader', 'الشيدر'],
    ['resolve', 'resolve'],
    ['region', 'منطقة'],
    ['new', 'جديد'],
    ['dynamic', 'ديناميكي']
  ];

  replacements.forEach(([from, to]) => {
    body = body.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), to);
  });

  return normalizeFunctionExplanationText(body);
}

function stripLeadingMeaningVerb(text) {
  return String(text || '')
    .replace(/^(بدء|بداية|يبدأ|بدءُ)\s+/g, '')
    .replace(/^(إنهاء|نهاية|ينهي)\s+/g, '')
    .replace(/^(ضبط|يُضبط|يضبط)\s+/g, '')
    .replace(/^(ربط|يربط)\s+/g, '')
    .replace(/^(نسخ|ينسخ)\s+/g, '')
    .replace(/^(استرجاع|يسترجع)\s+/g, '')
    .replace(/^(استعلام عن|يستعلم عن)\s+/g, '')
    .replace(/^(إنشاء|ينشئ)\s+/g, '')
    .replace(/^(تدمير|يدمر|تحرير|يحرر)\s+/g, '')
    .trim();
}

function refineIntentByFunctionName(name, basis) {
  const cleanedBasis = localizeFunctionMeaningSeed(basis);
  const nounPhrase = stripLeadingMeaningVerb(cleanedBasis);

  if (!cleanedBasis) {
    return '';
  }

  if (name.startsWith('vkCmdBegin')) {
    return `يسجل بداية ${nounPhrase || cleanedBasis} داخل مخزن الأوامر حتى تنفذ الأوامر اللاحقة ضمن هذا النطاق الصحيح`;
  }
  if (name.startsWith('vkCmdEnd')) {
    return `يسجل نهاية ${nounPhrase || cleanedBasis} داخل مخزن الأوامر حتى يُغلق هذا النطاق أو الطور بشكل صحيح`;
  }
  if (name.startsWith('vkCmdSet')) {
    return `يسجل ضبط ${nounPhrase || cleanedBasis} داخل مخزن الأوامر ليؤثر في الأوامر اللاحقة`;
  }
  if (name.startsWith('vkCmdBind')) {
    return `يسجل ربط ${nounPhrase || cleanedBasis} داخل مخزن الأوامر قبل تنفيذ الأوامر التي تعتمد عليها`;
  }
  if (name.startsWith('vkCmdCopy') || name.startsWith('vkCmdBlit') || /Resolve/.test(name)) {
    return `يسجل أمراً ينفذ ${nounPhrase || cleanedBasis} على المعالج الرسومي ضمن مخزن الأوامر`;
  }
  if (name.startsWith('vkCmd')) {
    return `يسجل أمراً يتعلق بـ ${nounPhrase || cleanedBasis} داخل مخزن الأوامر لتنفيذه لاحقاً على المعالج الرسومي`;
  }
  if (name.startsWith('vkCreate')) {
    return cleanedBasis;
  }
  if (name.startsWith('vkDestroy') || name.startsWith('vkFree')) {
    return cleanedBasis;
  }
  if (name.startsWith('vkGet') || name.startsWith('vkEnumerate') || name.startsWith('vkAcquire') || name.startsWith('vkAllocate') || name.startsWith('vkBind') || name.startsWith('vkWait') || name.startsWith('vkReset') || name.startsWith('vkMap') || name.startsWith('vkUnmap') || name.startsWith('vkUpdate')) {
    return cleanedBasis;
  }

  return normalizeFunctionIntentPhrase(cleanedBasis).replace(/[.،\s]+$/g, '');
}

function inferGenericFunctionBenefitFromName(name, meaning) {
  if (name.startsWith('vkCmdBegin')) {
    return 'تفيد لتحديد بداية هذا النطاق أو الطور داخل مخزن الأوامر، بحيث تُفسَّر الأوامر والحالة اللاحقة ضمن السياق الصحيح.';
  }
  if (name.startsWith('vkCmdEnd')) {
    return 'تفيد لإغلاق هذا النطاق أو الطور في الوقت الصحيح، ومنع استمرار تأثيره على أوامر لاحقة لا يفترض أن تنتمي إليه.';
  }
  if (name.startsWith('vkCmdSet')) {
    return 'تفيد لتغيير الحالة الديناميكية قبل الأوامر اللاحقة من دون الحاجة إلى إعادة إنشاء خط أنابيب أو مورد جديد كل مرة.';
  }
  if (name.startsWith('vkCmdBind')) {
    return 'تفيد لربط الموارد أو الحالة المطلوبة قبل التنفيذ اللاحق، بحيث تستخدمها أوامر الرسم أو الحساب التي تأتي بعدها فعلياً.';
  }
  if (name.startsWith('vkCmdCopy') || name.startsWith('vkCmdBlit') || /Resolve/.test(name)) {
    return 'تفيد لتنفيذ عمليات النسخ أو التحويل أو resolve على المعالج الرسومي نفسه، بدلاً من نقل العمل إلى المضيف أو إعادة بناء البيانات يدوياً.';
  }
  if (name.startsWith('vkCmd')) {
    return 'تفيد لتسجيل العمل داخل مخزن الأوامر أولاً، ثم إرساله لاحقاً إلى الطابور بالتسلسل الصحيح الذي يريده التطبيق.';
  }
  if (name.startsWith('vkCreate')) {
    return 'تفيد لأن هذا الاستدعاء ينشئ الكائن أو المورد الذي تعتمد عليه الخطوات اللاحقة، ولا يمكن متابعة المسار العملي قبل الحصول عليه.';
  }
  if (name.startsWith('vkDestroy') || name.startsWith('vkFree')) {
    return 'تفيد لتحرير المورد في الوقت المناسب ومنع تسرب الذاكرة أو بقاء الكائنات حية بعد انتهاء الحاجة إليها.';
  }
  if (name.startsWith('vkGet')) {
    return 'تفيد عندما تحتاج قراءة خصائص أو حالة أو مقبض قبل اتخاذ قرار لاحق في الكود أو قبل تهيئة خطوة تعتمد على هذه النتيجة.';
  }
  if (name.startsWith('vkEnumerate')) {
    return 'تفيد لمعرفة العناصر أو القدرات المدعومة أولاً، ثم اختيار ما يناسب التطبيق من نتائج الاستعلام بدل الاعتماد على افتراضات مسبقة.';
  }
  if (name.startsWith('vkAcquire')) {
    return 'تفيد للحصول على مورد أو حالة أو حق وصول يجب امتلاكه قبل متابعة المسار التالي بشكل صحيح.';
  }
  if (name.startsWith('vkAllocate')) {
    return 'تفيد لحجز الذاكرة أو الموارد المطلوبة قبل الاستخدام الفعلي، بدلاً من محاولة العمل على كائن غير مخصص أو غير جاهز.';
  }
  if (name.startsWith('vkBind')) {
    return 'تفيد لجعل المورد قابلاً للاستخدام الفعلي من قبل الكائن الهدف بعد ربطه، لأن الإنشاء وحده لا يكفي غالباً.';
  }
  if (name.startsWith('vkWait')) {
    return 'تفيد لبناء مزامنة صحيحة، بحيث لا تتابع خطوة لاحقة قبل أن يكتمل العمل الذي تعتمد عليه فعلاً.';
  }
  if (name.startsWith('vkReset')) {
    return 'تفيد لإعادة المورد أو الحالة إلى وضع يمكن استخدامه من جديد بدلاً من إنشاء كائن جديد في كل مرة.';
  }
  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) {
    return 'تفيد للتحكم بوصول المضيف إلى الذاكرة في الوقت الذي تحتاج فيه قراءة البيانات أو كتابتها من جهة CPU.';
  }
  if (name.startsWith('vkUpdate')) {
    return 'تفيد لتعديل بيانات أو إعدادات موجودة مسبقاً من دون إعادة إنشاء الكائن المرتبط بها من الصفر.';
  }

  return meaning ? `تفيد لأن ${meaning.replace(/[.،\s]+$/g, '')} هو جزء مباشر من المسار العملي الذي ينفذه التطبيق داخل Vulkan.` : '';
}

function inferFunctionIntentSummary(item) {
  const specific = inferSpecificFunctionSummary(item);
  const description = cleanFunctionMeaningSeed(item?.description || '');
  const usageItems = getFunctionSemanticUsageItems(item);
  const firstUsage = usageItems.find((text) => !isGenericFunctionMeaningText(text) && !isOperationalFunctionParagraph(text)) || '';
  const basis = firstUsage || (isGenericFunctionMeaningText(description) ? '' : description);

  if (specific?.intent) {
    return specific.intent;
  }

  if (basis && !/^دالة تعداد تُستخدم لاكتشاف العناصر المدعومة/.test(basis)) {
    return refineIntentByFunctionName(String(item?.name || ''), basis).replace(/[.،\s]+$/g, '');
  }

  const name = String(item?.name || '');
  if (name.startsWith('vkCreate')) return 'إنشاء كائن Vulkan جديد وإرجاع مقبض يمكن العمل عليه';
  if (name.startsWith('vkDestroy')) return 'تحرير كائن Vulkan وإنهاء صلاحيته';
  if (name.startsWith('vkGet')) return 'استعلام عن بيانات أو خصائص أو مقبض من الواجهة';
  if (name.startsWith('vkEnumerate')) return 'تعداد العناصر أو الإمكانات المدعومة من الواجهة';
  if (name.startsWith('vkAllocate')) return 'حجز مورد أو ذاكرة أو مجموعة عناصر لاستخدامها لاحقاً';
  if (name.startsWith('vkFree')) return 'تحرير مورد أو ذاكرة تم تخصيصها مسبقاً';
  if (name.startsWith('vkAcquire')) return 'اكتساب مورد أو حالة مطلوبة قبل متابعة التنفيذ';
  if (name.startsWith('vkQueue')) return 'تنفيذ أو مزامنة أو تقديم العمل عبر طابور Vulkan';
  if (name.startsWith('vkCmd')) return 'تسجيل أمر داخل Command Buffer ليُنفذ لاحقاً على المعالج الرسومي';
  if (name.startsWith('vkBind')) return 'ربط مورد بمورد أو حالة أخرى داخل Vulkan';
  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) return 'ربط الذاكرة مع المضيف أو إنهاء هذا الربط';
  return item?.category || 'وظيفة برمجية داخل واجهة Vulkan';
}

function inferFunctionBenefitSummary(item) {
  const specific = inferSpecificFunctionSummary(item);
  const usageItems = getFunctionSemanticUsageItems(item)
    .filter((text) => !isOperationalFunctionParagraph(text))
    .filter(Boolean);

  if (specific?.benefit) {
    return specific.benefit;
  }

  const functionMeaning = inferFunctionIntentSummary(item);
  const parameterNames = new Set((item?.parameters || []).map((param) => param.name));
  const hasCountOutput = [...parameterNames].some((name) => /^p.*Count$/.test(name));
  const hasOutputArray = (item?.parameters || []).some((param) => /^p[A-Z]/.test(param.name) && /\*/.test(param.type || '') && !/\bconst\b/.test(param.type || '') && !/Count$/.test(param.name));

  if (/يعدّد|تعدّد|استرجع|يسترجع|استعلام/.test(functionMeaning) && hasCountOutput && hasOutputArray) {
    return 'تفيد لمعرفة العناصر أو الخصائص المدعومة أولاً، ثم تحديد حجم المصفوفة المطلوب قبل قراءة النتائج التفصيلية أو اختيار ما سيعتمد عليه التطبيق';
  }

  if (/خصائص تصف|المدعومة|المتاحة/.test(functionMeaning) && hasOutputArray) {
    return 'تفيد لأنها تكشف لك ما الذي يدعمه الجهاز أو السياق الحالي فعلياً، فلا تطلب ميزات أو عناصر قبل التحقق من توفرها وقراءة أوصافها';
  }

  const usageHint = usageItems.find((text) => text !== functionMeaning && /تفيد|تساعد|لمعرفة|لاختيار|حتى|قبل/.test(text));
  if (usageHint) {
    return usageHint.replace(/[.،\s]+$/g, '');
  }

  const name = String(item?.name || '');
  const genericBenefit = inferGenericFunctionBenefitFromName(name, functionMeaning);
  if (genericBenefit) {
    return genericBenefit;
  }

  if (name.startsWith('vkCreate')) return 'تفيد عندما تحتاج إنشاء الكائن المطلوب مرة واحدة ثم تمرير مقبضه إلى بقية مسار العمل';
  if (name.startsWith('vkDestroy')) return 'تفيد في تحرير المورد في الوقت الصحيح ومنع تسرب الموارد أو بقاء الكائنات بعد انتهاء استخدامها';
  if (name.startsWith('vkGet')) return 'تفيد عندما تحتاج قراءة خصائص أو حالة أو مقبض قبل اتخاذ قرار لاحق في الكود';
  if (name.startsWith('vkEnumerate')) return 'تفيد عندما تحتاج معرفة العناصر أو القدرات المدعومة قبل اختيار أحدها';
  if (name.startsWith('vkAllocate')) return 'تفيد لحجز المورد المطلوب قبل بدء استخدامه في الرسم أو النقل أو التنفيذ';
  if (name.startsWith('vkAcquire')) return 'تفيد للحصول على حالة أو مورد يجب امتلاكه أو معرفته قبل متابعة المسار اللاحق';
  if (name.startsWith('vkQueue')) return 'تفيد لإرسال العمل الفعلي إلى الطوابير أو مزامنته أو تقديمه';
  if (name.startsWith('vkCmd')) return 'تفيد لتسجيل أوامر GPU داخل Command Buffer قبل الإرسال إلى الطابور';
  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) return 'تفيد عندما تحتاج وصول المضيف إلى الذاكرة لكتابة البيانات أو إنهاء هذا الوصول';
  return 'تفيد عندما تحتاج تنفيذ هذه العملية الرسمية في Vulkan بدلاً من الاعتماد على منطق غير مباشر أو قيم حرفية';
}

function sanitizeFunctionOfficialDescription(item) {
  const rawDescription = String(item?.description || '').replace(/^الوصف الرسمي:\s*/g, '').trim();
  const intentSummary = String(inferFunctionIntentSummary(item) || '').trim();

  if (!rawDescription) {
    return intentSummary
      ? formatArabicOfficialDescription(intentSummary, {ensureSentence: true})
      : missingFunctionOfficialDescription;
  }

  const cleaned = normalizeFunctionExplanationText(rawDescription
    .replace(/^المعنى الأساسي لهذه الدالة:\s*/g, '')
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim());

  const strippedForEnglishCheck = stripVulkanTechnicalIdentifiers(cleaned);
  const hasMixedEnglish = /[A-Za-z]{3,}/.test(strippedForEnglishCheck);

  if (!isReadableLocalizedParagraph(cleaned) || hasMixedEnglish || hasCorruptedLocalizedText(cleaned)) {
    return intentSummary
      ? formatArabicOfficialDescription(intentSummary, {ensureSentence: true})
      : formatArabicOfficialDescription(cleaned);
  }

  return formatArabicOfficialDescription(cleaned.replace(/[.؟!]+$/g, ''), {ensureSentence: true});
}

function renderFunctionMeaningSection(item) {
return `
    <section class="info-section">
      <h2>🧠 معنى الدالة وفائدتها</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">معنى الدالة</div>
          <p>${linkUsageBridgeText(inferFunctionIntentSummary(item), {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">فائدة استخدامها</div>
          <p>${linkUsageBridgeText(inferFunctionBenefitSummary(item), {currentItem: item})}</p>
        </div>
      </div>
    </section>
  `;
}

function getCommandSummaryText(item) {
  return inferFunctionIntentSummary(item) || stripArabicOfficialDescriptionPrefix(sanitizeFunctionOfficialDescription(item));
}

function renderVulkanHighlightedInlineCode(source, language = 'cpp') {
  const rawCode = String(source || '').trim();
  if (!rawCode) {
    return '<code dir="ltr"></code>';
  }

  return `<code dir="ltr" class="language-${escapeAttribute(language)} sdl3-inline-code vulkan-inline-code vulkan-signature-code" data-raw-code="${escapeAttribute(rawCode)}">${renderHighlightedCode(rawCode, {language})}</code>`;
}

function renderVulkanHighlightedCodeBlock(source, language = 'cpp', options = {}) {
  const rawCode = String(source || '');
  const attributes = [
    `class="language-${escapeAttribute(language)} vulkan-signature-code"`,
    `data-raw-code="${escapeAttribute(rawCode)}"`
  ];
  const functionName = String(options.functionItem?.name || '').trim();
  if (functionName) {
    attributes.push(`data-function-name="${escapeAttribute(functionName)}"`);
  }
  if (options.codeContext) {
    attributes.push(`data-code-context="${escapeAttribute(options.codeContext)}"`);
  }
  return `<pre class="code-block"><code ${attributes.join(' ')}>${escapeHtml(rawCode)}</code></pre>`;
}

function renderLearningCodeBlock(title, code, language = 'cpp') {
  return `
    <div class="code-container">
      <div class="code-header"><span>${title}</span></div>
      ${renderVulkanHighlightedCodeBlock(code, language)}
    </div>
  `;
}

function inferFunctionGeneralSteps(item) {
  const name = String(item?.name || '');
  const typeReferences = {
    physicalDevice: renderAnalysisReference('VkPhysicalDevice', item),
    device: renderAnalysisReference('VkDevice', item),
    createInfo: renderAnalysisReference('VkDeviceCreateInfo', item),
    queueInfo: renderAnalysisReference('VkDeviceQueueCreateInfo', item)
  };

  if (/^vkCmdBindTransformFeedbackBuffersEXT$/.test(name)) {
    return [
      'تستقبل مخزن الأوامر الذي تسجل فيه أوامر هذا الممر أو هذه الدفعة.',
      'تحدد أول نقطة ربط وعدد نقاط الربط التي ستحدثها في حالة transform feedback الحالية.',
      'تربط المصفوفات التي تحتوي على المخازن والإزاحات والأحجام بهذه النقاط داخل الحالة المسجلة في مخزن الأوامر.',
      'تجعل أوامر الرسم اللاحقة التي تكتب إلى transform feedback تستخدم هذه المخازن عند التنفيذ على المعالج الرسومي.'
    ];
  }

  if (/^vkCmdBindVertexBuffers2/.test(name)) {
    return [
      'تستقبل مخزن الأوامر الذي تسجل فيه أوامر الرسم.',
      'تحدد أول نقطة ربط وعدد المخازن التي ستصبح مصادر لبيانات الرؤوس.',
      'تربط مخازن الرؤوس مع الإزاحات وقيم التباعد الخاصة بكل ربط.',
      'تجعل أوامر الرسم اللاحقة تقرأ بيانات الرؤوس من هذه المخازن وفق التباعد والإزاحات المحددة.'
    ];
  }

  if (/^vkCmdBlitImage/.test(name)) {
    return [
      'تستقبل الصورة المصدر والصورة الوجهة مع التخطيطات المناسبة لكل منهما.',
      'تقرأ المناطق التي تحدد أي أجزاء ستنسخ من المصدر وإلى أين ستكتب في الوجهة.',
      'تسجل عملية نسخ قد تتضمن تحجيماً أو تحويل تنسيق وفق المرشح والمناطق المحددة.',
      'تنفذ هذه العملية لاحقاً على المعالج الرسومي عند إرسال مخزن الأوامر إلى الطابور.'
    ];
  }

  if (/^vkCmdClearAttachments$/.test(name)) {
    return [
      'تعمل داخل نطاق رسم أو تمرير نشط يملك مرفقات مرتبطة حالياً بمخزن الإطارات.',
      'تحدد المرفقات التي تريد مسحها والقيم التي ستكتب فيها.',
      'تحدد المستطيلات أو المناطق التي سيطبق عليها المسح فقط.',
      'تسجل أمراً يمسح هذه المرفقات ضمن تلك المناطق عند تنفيذ مخزن الأوامر.'
    ];
  }

  if (/^vkCmdClearColorImage$/.test(name)) {
    return [
      'تستقبل صورة لونية وتخطيطاً مناسباً يسمح بعملية المسح.',
      'تحدد قيمة اللون التي ستكتب في الصورة.',
      'تحدد نطاقات الموارد الفرعية أو المناطق التي سيطبق عليها هذا اللون.',
      'تسجل أمراً يجعل الصورة في تلك النطاقات تبدأ أو تعود إلى قيمة لونية معروفة.'
    ];
  }

  if (/^vkCmdClearDepthStencilImage$/.test(name)) {
    return [
      'تستقبل صورة عمق/استنسل مع التخطيط المناسب لهذه العملية.',
      'تحدد قيم العمق والاستنسل التي تريد كتابتها.',
      'تحدد النطاقات أو الموارد الفرعية التي سيطبق عليها المسح.',
      'تسجل أمراً يهيئ هذه الصورة إلى قيم معروفة قبل الرسم أو قبل إعادة استخدامها.'
    ];
  }

  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return [
      'تعمل داخل مخزن أوامر يستخدم أوامر الفيديو الخاصة بالترميز أو فك الترميز.',
      'تقرأ البنية الممررة لتعرف الجلسة أو الحالة أو الإعدادات التي يجب تطبيقها على نطاق الفيديو الحالي.',
      'تحدد بداية هذا النطاق أو تغير حالته أو تنهيه بحسب نوع الدالة.',
      'تجعل أوامر الفيديو اللاحقة تُفسر ضمن هذا السياق الصحيح عند التنفيذ.'
    ];
  }

  if (/^vkCmdCopyBuffer/.test(name)) {
    return [
      'تستقبل المخزن المصدر والمخزن الوجهة مع مخزن الأوامر الذي ستسجل فيه العملية.',
      'تقرأ المصفوفة التي تصف المناطق أو الأجزاء التي ستنسخ بين المخزنين.',
      'تسجل عملية نسخ البيانات بين هذه المناطق من دون تدخل المضيف.',
      'تنفذ العملية لاحقاً على المعالج الرسومي عند إرسال مخزن الأوامر إلى الطابور.'
    ];
  }

  if (/AccelerationStructure/.test(name)) {
    return [
      'تستقبل معلومات البناء أو النسخ أو الاستعلام الخاصة ببنية التسارع المستهدفة.',
      'تقرأ الهندسة أو الموارد أو الأوصاف التي تحدد شكل البنية وطريقة تجهيزها.',
      'تنشئ أو تبني أو تحدث أو تنسخ البنية بحسب نوع الاستدعاء.',
      'تجعل هذه البنية قابلة للاستخدام لاحقاً في عمليات تتبع الأشعة أو الاستعلامات المرتبطة بها.'
    ];
  }

  if (name === 'vkCreateDevice') {
    return [
      `تستقبل ${typeReferences.physicalDevice} الذي اخترته مسبقاً من بين الأجهزة المادية المتاحة.`,
      `تقرأ إعدادات الإنشاء من ${typeReferences.createInfo}، بما في ذلك معلومات الطوابير والامتدادات والميزات المطلوبة.`,
      `تتحقق من أن عائلات الطوابير والميزات والامتدادات المطلوبة مدعومة على الجهاز المحدد.`,
      `تنشئ ${typeReferences.device} المنطقي والطوابير المعرفة عبر ${typeReferences.queueInfo} ثم تكتب المقبض الناتج في <code>pDevice</code>.`
    ];
  }

  if (name.startsWith('vkCreate')) {
    return [
      'تستقبل المقابض أو الموارد الأساسية التي سيُبنى فوقها الكائن الجديد.',
      'تقرأ بنية الإنشاء أو الإعداد لتفهم الخصائص المطلوبة بالتفصيل.',
      'تتحقق من التوافق والموارد المطلوبة وصحة القيم قبل الإتمام.',
      'تنشئ الكائن الجديد وتعيد المقبض أو النتيجة عبر القيمة المرجعة أو بارامترات الإخراج.'
    ];
  }

  if (name.startsWith('vkDestroy')) {
    return [
      'تستقبل المقبض الذي تريد إنهاء صلاحيته.',
      'تتحقق من أن المورد أو الكائن لم يعد مطلوباً في عمل جارٍ على الجهاز أو الطابور.',
      'تحرر الموارد الداخلية المرتبطة به وتزيل صلاحيته من منظور التطبيق.'
    ];
  }

  if (name.startsWith('vkGet')) {
    return [
      'تستقبل الكائن أو الجهاز الذي تريد القراءة منه.',
      'تقرأ المعاملات أو الهياكل المساعدة لتحديد نوع المعلومات المطلوبة.',
      'تكتب النتائج في البارامترات أو البنى التي مررتها لهذا الغرض.'
    ];
  }

  if (name.startsWith('vkEnumerate')) {
    return [
      'تتصل بالمصدر الذي تريده، مثل مثيل أو جهاز أو طبقة أو امتداد.',
      'تحدد عدد العناصر المتاحة أو تكتبها في المصفوفة التي وفرتها.',
      'تعيد العدد الفعلي أو الحالة التي توضح إن كانت هناك عناصر إضافية أو حاجة لإعادة الاستدعاء.'
    ];
  }

  if (name.startsWith('vkCmd')) {
    return [
      'تسجل أمراً جديداً داخل مخزن أوامر صالح للتسجيل.',
      'تقرأ البارامترات أو البنى التي تحدد الموارد أو الإعدادات أو النطاق الذي سيطبَّق عليه الأمر.',
      'تؤثر في ما سيُنفذ لاحقاً على المعالج الرسومي بعد إرسال مخزن الأوامر إلى الطابور.'
    ];
  }

  return [
    inferFunctionIntentSummary(item),
    inferFunctionBenefitSummary(item)
  ];
}

function inferFunctionWhenUsedLines(item) {
  const name = String(item?.name || '');

  if (name === 'vkCreateDevice') {
    return [
      `بعد ${renderRelatedReferenceLink('vkCreateInstance')}.`,
      `بعد اكتشاف الأجهزة المادية عبر ${renderRelatedReferenceLink('vkEnumeratePhysicalDevices')}.`,
      `بعد اختيار ${renderAnalysisReference('VkPhysicalDevice', item)} مناسب وفحص عائلات الطوابير عبر ${renderRelatedReferenceLink('vkGetPhysicalDeviceQueueFamilyProperties')}.`,
      `بعد تحديد الامتدادات والميزات المطلوبة والتأكد من دعمها عبر ${renderRelatedReferenceLink('vkEnumerateDeviceExtensionProperties')} و${renderRelatedReferenceLink('vkGetPhysicalDeviceFeatures')}.`
    ];
  }

  if (name.startsWith('vkCreate')) {
    return [
      'تُستخدم بعد تجهيز جميع المعاملات والبنى والموارد التي يعتمد عليها إنشاء الكائن.',
      'وتسبق عادةً أي استدعاء يحاول استخدام المقبض الناتج أو تمريره إلى كائنات أخرى.'
    ];
  }

  if (name.startsWith('vkDestroy')) {
    return [
      'تُستخدم بعد التأكد من أنك لم تعد تحتاج الكائن.',
      `وغالباً بعد ${renderRelatedReferenceLink('vkDeviceWaitIdle')} أو بعد التحقق من انتهاء العمل الذي يعتمد عليه.`
    ];
  }

  if (name.startsWith('vkGetDeviceQueue')) {
    return [
      `بعد نجاح ${renderRelatedReferenceLink('vkCreateDevice')}.`,
      'وبعد معرفة فهرس عائلة الطابير والفهرس الداخلي للطابور الذي تريد الوصول إليه.'
    ];
  }

  if (/^vkCmdBindTransformFeedbackBuffersEXT$/.test(name)) {
    return [
      'قبل أوامر الرسم التي ستكتب بياناتها إلى transform feedback.',
      'بعد تجهيز مخازن النتائج والإزاحات والأحجام التي تريد ربطها.',
      'داخل مخزن أوامر ما زال في وضع التسجيل وقبل الإرسال إلى الطابور.'
    ];
  }

  if (/^vkCmdBindVertexBuffers2/.test(name)) {
    return [
      'قبل أوامر الرسم التي ستقرأ بيانات الرؤوس من هذه المخازن.',
      'بعد تجهيز مخازن الرؤوس والإزاحات وقيم التباعد التي تطابق تنسيق الإدخال.',
      'عندما تحتاج تغيير هذه الربوط ديناميكياً من دفعة رسم إلى أخرى.'
    ];
  }

  if (/^vkCmdBlitImage/.test(name)) {
    return [
      'عندما تحتاج نسخ صورة إلى أخرى مع تحجيم أو تحويل تنسيق.',
      'بعد تهيئة الصورتين إلى التخطيطات المناسبة لعملية النقل أو النسخ.',
      'عندما يكون تنفيذ العملية على المعالج الرسومي أنسب من معالجتها على المضيف.'
    ];
  }

  if (/^vkCmdClearAttachments$/.test(name)) {
    return [
      'أثناء وجود تمرير رسم أو نطاق رسم نشط يملك مرفقات مرتبطة حالياً.',
      'عندما تحتاج مسح جزء محدد من المرفقات الحالية بدل مسح الصورة كاملة.',
      'قبل أوامر الرسم التي تعتمد على كون تلك المناطق في حالة معروفة.'
    ];
  }

  if (/^vkCmdClear(Color|DepthStencil)Image$/.test(name)) {
    return [
      'عندما تريد تهيئة صورة إلى قيم معروفة قبل استخدامها في الرسم أو النسخ أو القراءة.',
      'بعد نقل الصورة إلى التخطيط المناسب لعملية المسح.',
      'قبل الخطوات اللاحقة التي تفترض أن محتوى الصورة أصبح مضبوطاً إلى قيم محددة.'
    ];
  }

  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return [
      'عند العمل على جلسة فيديو تستخدم أوامر الترميز أو فك الترميز في Vulkan.',
      'قبل أو أثناء أو بعد أوامر الفيديو بحسب ما إذا كانت الدالة تبدأ النطاق أو تتحكم فيه أو تنهيه.',
      'بعد تجهيز الجلسة والمعاملات والبنى التي تصف نطاق الفيديو المطلوب.'
    ];
  }

  if (/^vkCmdCopyBuffer/.test(name)) {
    return [
      'عندما تحتاج نقل البيانات بين مخزنين على المعالج الرسومي.',
      'بعد تجهيز المخزن المصدر والمخزن الوجهة ومناطق النسخ المطلوبة.',
      'قبل الخطوات التي ستقرأ البيانات من المخزن الوجهة أو تعتمد على اكتمال النقل.'
    ];
  }

  if (/AccelerationStructure/.test(name)) {
    return [
      'عندما تبني مسار تتبع الأشعة أو تحدث بناه أو تستعلم عنها.',
      'بعد تجهيز أوصاف الهندسة والموارد والبنى المساعدة التي يعتمد عليها هذا الاستدعاء.',
      'قبل إنشاء أو استخدام مسارات تتبع الأشعة أو قبل تنفيذ أوامر تعتمد على هذه البنى.'
    ];
  }

  return [
    `تُستخدم عندما تحتاج إلى ${inferFunctionIntentSummary(item)}.`,
    `وتفيد في اللحظة التي يصبح فيها لديك كل الإدخالات المطلوبة لهذا الاستدعاء بشكل صالح.`
  ];
}

function inferFunctionLearningIntro(item) {
  const name = String(item?.name || '');
  const intent = inferFunctionIntentSummary(item);
  const benefit = inferFunctionBenefitSummary(item);

  if (/^vkCmdBindTransformFeedbackBuffersEXT$/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لربط مخازن التغذية الراجعة للتحويل داخل مخزن الأوامر، بحيث تصبح أوامر الرسم اللاحقة قادرة على كتابة نتائجها إلى هذه المخازن.`,
      'هذا الاستدعاء لا ينفذ الكتابة بنفسه، بل يحدد أين ستذهب البيانات عندما يعمل مسار transform feedback لاحقاً على المعالج الرسومي.',
      benefit
    ];
  }

  if (/^vkCmdBindVertexBuffers2/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لربط مخازن الرؤوس وتحديد كيفية قراءة بياناتها داخل أوامر الرسم اللاحقة.`,
      'هي لا ترسم بحد ذاتها، لكنها تحدد مصدر بيانات الرؤوس والإزاحات وقيم التباعد التي سيعتمد عليها خط الأنابيب عند تنفيذ الرسم.',
      benefit
    ];
  }

  if (/^vkCmdBlitImage/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لتسجيل عملية نقل من صورة إلى أخرى، مع السماح أيضاً بالتحجيم أو تغيير طريقة القراءة والكتابة أثناء العملية.`,
      'هذا يجعلها مناسبة لعمليات مثل تصغير صورة أو نسخها إلى مورد آخر أو إعداد نسخة جديدة بحجم أو تنسيق مختلف.',
      benefit
    ];
  }

  if (/^vkCmdClearAttachments$/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لمسح مرفقات محددة ضمن نطاق الرسم الحالي فقط، من دون الحاجة إلى إعادة مسح الصورة كاملة.`,
      'هذا مفيد عندما تريد تنظيف جزء من الهدف الحالي أو إعادة ضبط مرفق معين داخل التمرير النشط.',
      benefit
    ];
  }

  if (/^vkCmdClearColorImage$/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لملء صورة لونية بقيمة لون محددة في نطاقات تختارها أنت.`,
      'غالباً تُستعمل لتهيئة الصورة إلى حالة معروفة قبل بدء مرحلة جديدة من العمل أو قبل إعادة استخدامها.',
      benefit
    ];
  }

  if (/^vkCmdClearDepthStencilImage$/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لملء صورة العمق والاستنسل بقيم محددة تجعلها جاهزة لمرحلة رسم أو استخدام لاحق.`,
      'بدلاً من ترك القيم السابقة في الصورة، يضمن هذا الاستدعاء أن يبدأ اختبار العمق أو الاستنسل من حالة واضحة ومقصودة.',
      benefit
    ];
  }

  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} للتحكم في نطاق ترميز الفيديو داخل مخزن الأوامر.`,
      'هي تحدد متى يبدأ هذا النطاق أو كيف تتغير حالته أو متى ينتهي، بحيث تبقى أوامر الفيديو اللاحقة مرتبطة بالسياق الصحيح.',
      benefit
    ];
  }

  if (/^vkCmdCopyBuffer/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} لنسخ البيانات بين مخزن مصدر ومخزن وجهة على المعالج الرسومي.`,
      'هذا يجعلها من الدوال الأساسية عند تجهيز الموارد، أو رفع البيانات، أو إعادة تنظيمها بين مخازن العمل المختلفة.',
      benefit
    ];
  }

  if (/AccelerationStructure/.test(name)) {
    return [
      `تُستخدم الدالة ${renderAnalysisReference(name, item)} للتعامل مع بنى التسارع التي يعتمد عليها تتبع الأشعة في تنظيم المشهد واختبار التقاطعات بسرعة.`,
      'بنية التسارع ليست رسماً بحد ذاتها، لكنها البنية التي تجعل أوامر تتبع الأشعة قادرة على الوصول إلى عناصر المشهد بكفاءة عملية.',
      benefit
    ];
  }

  return [
    `تُستخدم الدالة ${renderAnalysisReference(name, item)} من أجل ${intent}.`,
    benefit
  ];
}

function renderFunctionParameterDeepGuide(item) {
  const parameters = item?.parameters || [];
  if (!parameters.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>📌 شرح المعاملات</h2>
      <div class="info-grid">
        ${parameters.map((param, index) => `
          <div class="content-card prose-card">
            <div class="info-label">${index + 1}) ${renderFunctionParameterName(param, item)}</div>
            <p><strong>النوع:</strong> ${renderTypeReference(param.type || 'غير موثق محلياً')}</p>
            ${param.description ? `<p><strong>الوصف الرسمي بالعربي:</strong> ${linkUsageBridgeText(preferStrictArabicVulkanText(preferArabicTooltipText(param.description, inferParameterMeaning(param, item)), inferParameterMeaning(param, item)))}</p>` : ''}
            <p><strong>المعنى الحقيقي:</strong> ${linkUsageBridgeText(inferParameterMeaning(param, item))}</p>
            <p><strong>لماذا يُمرر:</strong> ${linkUsageBridgeText(inferParameterUsage(param, item))}</p>
            <p><strong>كيف يظهر في الاستخدام الفعلي:</strong> ${linkUsageBridgeText(inferParameterActualUsage(param, item))}</p>
            <p><strong>تنبيه أو أثر تغييره:</strong> ${linkUsageBridgeText(inferParameterEffect(param, item))}</p>
            <p><strong>طبيعته التنفيذية:</strong> ${linkUsageBridgeText(renderValueShapeSummary(param.name || '', param.type || '', {functionName: item.name || ''}))}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderGenericFunctionGuide(item) {
  const steps = inferFunctionGeneralSteps(item);
  const whenUsed = inferFunctionWhenUsedLines(item);
  const returnValues = getReturnValuesArray(item);
  const relatedBefore = getRelatedFunctionNames(item, 6).filter((name) => /^vk(Enumerate|Get|Create|Allocate)/.test(name));
  const relatedAfter = getRelatedFunctionNames(item, 6).filter((name) => !relatedBefore.includes(name));
  const introLines = inferFunctionLearningIntro(item).filter(Boolean);

  return `
    <section class="info-section">
      <h2 data-tooltip="${escapeAttribute('يشرح هذا القسم وظيفة الدالة ومعناها وتسلسل استخدامها العملي داخل Vulkan.')}" tabindex="0" aria-label="${escapeAttribute('شرح الدالة')}">${renderCodicon('book', 'ui-codicon list-icon', 'شرح')} شرح الدالة</h2>
      <div class="content-card prose-card">
        ${introLines.map((line) => `<p>${line.replace(/[.؟!]+$/g, '')}.</p>`).join('')}
      </div>
      ${item.signature ? renderLearningCodeBlock('التصريح بالدالة', item.signature) : ''}
    </section>

    <section class="info-section">
      <h2>🧭 المعنى العام للدالة</h2>
      <div class="content-card prose-card">
        <ol class="flow-list">
          ${steps.map((step) => `<li>${step}</li>`).join('')}
        </ol>
      </div>
    </section>

    <section class="info-section">
      <h2>⏱️ متى تُستخدم؟</h2>
      <div class="content-card prose-card">
        <ul class="best-practices-list">
          ${whenUsed.map((step) => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    </section>

    ${renderFunctionParameterDeepGuide(item)}

    ${returnValues.length ? `
      <section class="info-section">
        <h2>↩️ القيمة المعادة</h2>
        <div class="content-card prose-card">
          <p>نوع القيمة المعادة هنا هو ${item.returnType ? renderTypeReference(item.returnType) : '<code>غير موثق محلياً</code>'}.</p>
          <ul class="best-practices-list">
            ${returnValues.slice(0, 8).map((entry) => `<li>${renderRelatedReferenceLink(entry.value)}: ${entry.description || 'راجع التوثيق التفصيلي لهذه القيمة.'}</li>`).join('')}
          </ul>
        </div>
      </section>
    ` : ''}

    ${(relatedBefore.length || relatedAfter.length) ? `
      <section class="info-section">
        <h2>🔗 الدوال المرتبطة</h2>
        <div class="info-grid">
          ${relatedBefore.length ? `
            <div class="content-card prose-card">
              <div class="info-label">غالباً قبلها</div>
              <p>${relatedBefore.map((name) => renderRelatedReferenceLink(name)).join('، ')}</p>
            </div>
          ` : ''}
          ${relatedAfter.length ? `
            <div class="content-card prose-card">
              <div class="info-label">غالباً بعدها أو معها</div>
              <p>${relatedAfter.map((name) => renderRelatedReferenceLink(name)).join('، ')}</p>
            </div>
          ` : ''}
        </div>
      </section>
    ` : ''}
  `;
}

function renderVkCreateDeviceGuide(item) {
  const exampleCode = `VkPhysicalDevice physicalDevice = ...;
VkDevice device;

float queuePriority = 1.0f;

VkDeviceQueueCreateInfo queueCreateInfo = {};
queueCreateInfo.sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
queueCreateInfo.queueFamilyIndex = graphicsQueueFamilyIndex;
queueCreateInfo.queueCount = 1;
queueCreateInfo.pQueuePriorities = &queuePriority;

VkPhysicalDeviceFeatures deviceFeatures = {};
deviceFeatures.samplerAnisotropy = VK_TRUE;

const char* deviceExtensions[] = {
    VK_KHR_SWAPCHAIN_EXTENSION_NAME
};

VkDeviceCreateInfo createInfo = {};
createInfo.sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
createInfo.queueCreateInfoCount = 1;
createInfo.pQueueCreateInfos = &queueCreateInfo;
createInfo.enabledExtensionCount = 1;
createInfo.ppEnabledExtensionNames = deviceExtensions;
createInfo.pEnabledFeatures = &deviceFeatures;
createInfo.enabledLayerCount = 0;

VkResult result = vkCreateDevice(
    physicalDevice,
    &createInfo,
    NULL,
    &device
);`;

  return `
    <section class="info-section">
      <h2 data-tooltip="${escapeAttribute('يشرح هذا القسم الدالة خطوة بخطوة: ما الذي تفعله، متى تُستخدم، وكيف ترتبط بالبنى والدوال المحيطة بها.')}" tabindex="0" aria-label="${escapeAttribute('شرح الدالة')}">${renderCodicon('book', 'ui-codicon list-icon', 'شرح')} شرح الدالة</h2>
      <div class="content-card prose-card">
        <p>تُستخدم الدالة ${renderAnalysisReference('vkCreateDevice', item)} لإنشاء جهاز منطقي ${renderAnalysisReference('VkDevice', item)} انطلاقاً من جهاز مادي ${renderAnalysisReference('VkPhysicalDevice', item)} تم اختياره مسبقاً.</p>
        <p>في Vulkan لا تتعامل مباشرة مع ${renderAnalysisReference('VkPhysicalDevice', item)} لتنفيذ الأوامر. يجب أولاً إنشاء ${renderAnalysisReference('VkDevice', item)}، لأن الجهاز المنطقي هو الكائن الذي يمثل الاتصال البرمجي الفعلي الذي يستخدمه التطبيق مع العتاد.</p>
        <p><strong>بمعنى آخر:</strong> ${renderAnalysisReference('VkPhysicalDevice', item)} يمثل العتاد الحقيقي، بينما ${renderAnalysisReference('VkDevice', item)} يمثل الواجهة البرمجية التي ينشئها التطبيق ليتعامل مع هذا العتاد بشكل فعلي.</p>
      </div>
      ${item.signature ? renderLearningCodeBlock('التصريح بالدالة', item.signature) : ''}
    </section>

    <section class="info-section">
      <h2>🧭 المعنى العام للدالة</h2>
      <div class="content-card prose-card">
        <ol class="flow-list">
          <li>تستقبل ${renderAnalysisReference('VkPhysicalDevice', item)} تم اختياره مسبقاً.</li>
          <li>تقرأ إعدادات الإنشاء من ${renderAnalysisReference('VkDeviceCreateInfo', item)}.</li>
          <li>تتحقق من أن الميزات المطلوبة مدعومة عبر ${renderRelatedReferenceLink('vkGetPhysicalDeviceFeatures')} أو ما يكافئه.</li>
          <li>تتحقق من أن الامتدادات المطلوبة مدعومة عبر ${renderRelatedReferenceLink('vkEnumerateDeviceExtensionProperties')}.</li>
          <li>تنشئ ${renderAnalysisReference('VkDevice', item)} المنطقي.</li>
          <li>تنشئ الطوابير المطلوبة وفق ${renderAnalysisReference('VkDeviceQueueCreateInfo', item)}.</li>
          <li>تعيد المقبض الناتج في <code>pDevice</code>.</li>
        </ol>
      </div>
    </section>

    <section class="info-section">
      <h2>⏱️ متى تُستخدم هذه الدالة؟</h2>
      <div class="content-card prose-card">
        <ul class="best-practices-list">
          <li>بعد ${renderRelatedReferenceLink('vkCreateInstance')}.</li>
          <li>بعد البحث عن الأجهزة المادية عبر ${renderRelatedReferenceLink('vkEnumeratePhysicalDevices')}.</li>
          <li>بعد اختيار ${renderAnalysisReference('VkPhysicalDevice', item)} مناسب.</li>
          <li>بعد فحص عائلات الطوابير عبر ${renderRelatedReferenceLink('vkGetPhysicalDeviceQueueFamilyProperties')}.</li>
          <li>بعد تحديد الامتدادات والميزات المطلوبة والتأكد من دعمها.</li>
        </ul>
      </div>
    </section>

    ${renderFunctionParameterDeepGuide(item)}

    <section class="info-section">
      <h2>${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} ما هو ${renderAnalysisReference('VkDeviceCreateInfo', item)}؟</h2>
      <div class="content-card prose-card">
        <p>هذه البنية هي قلب عملية إنشاء الجهاز المنطقي. هي التي تجمع كل ما تريد تفعيله داخل ${renderAnalysisReference('VkDevice', item)}: الطوابير، الامتدادات، والميزات.</p>
      </div>
      ${renderLearningCodeBlock('شكل مفاهيمي للبنية', `typedef struct VkDeviceCreateInfo {
    VkStructureType sType;
    const void* pNext;
    VkDeviceCreateFlags flags;
    uint32_t queueCreateInfoCount;
    const VkDeviceQueueCreateInfo* pQueueCreateInfos;
    uint32_t enabledLayerCount;
    const char* const* ppEnabledLayerNames;
    uint32_t enabledExtensionCount;
    const char* const* ppEnabledExtensionNames;
    const VkPhysicalDeviceFeatures* pEnabledFeatures;
} VkDeviceCreateInfo;`)}
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">sType</div>
          <p>يجب أن يكون ${renderRelatedReferenceLink('VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO')} حتى تعرف Vulkan نوع البنية المرسلة.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">pNext</div>
          <p>يكون <code>NULL</code> أو مؤشراً إلى بنى إضافية عندما تريد تمرير ميزات حديثة أو امتدادات عبر سلاسل <code>pNext</code>.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">queueCreateInfoCount / pQueueCreateInfos</div>
          <p>يحددان عدد بنيات ${renderAnalysisReference('VkDeviceQueueCreateInfo', item)} ومكانها، وهي التي تصف الطوابير المطلوبة داخل الجهاز.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">enabledExtensionCount / ppEnabledExtensionNames</div>
          <p>يحددان عدد امتدادات الجهاز المطلوبة مثل ${renderRelatedReferenceLink('VK_KHR_SWAPCHAIN_EXTENSION_NAME')} وأسمائها الفعلية.</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">pEnabledFeatures</div>
          <p>يشير إلى ${renderAnalysisReference('VkPhysicalDeviceFeatures', item)} ويحمل الميزات التي تريد تفعيلها مثل <code>samplerAnisotropy</code> أو <code>geometryShader</code>.</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2>🚦 ما هي Queue Families وما علاقتها بالدالة؟</h2>
      <div class="content-card prose-card">
        <p>بطاقة الرسوميات لا توفّر طابوراً واحداً فقط، بل توفّر عائلات طوابير قد تدعم الرسم أو الحوسبة أو النقل أو العرض. قبل ${renderAnalysisReference('vkCreateDevice', item)} يجب أن تحدد أي عائلة طوابير تريد استخدامها، ثم تمرر هذه المعلومات عبر ${renderAnalysisReference('VkDeviceQueueCreateInfo', item)}.</p>
        <p>بعد نجاح إنشاء الجهاز تستخدم ${renderRelatedReferenceLink('vkGetDeviceQueue')} للحصول على مقبض الطابور الفعلي.</p>
      </div>
      ${renderLearningCodeBlock('شكل مفاهيمي لـ VkDeviceQueueCreateInfo', `typedef struct VkDeviceQueueCreateInfo {
    VkStructureType sType;
    const void* pNext;
    VkDeviceQueueCreateFlags flags;
    uint32_t queueFamilyIndex;
    uint32_t queueCount;
    const float* pQueuePriorities;
} VkDeviceQueueCreateInfo;`)}
    </section>

    <section class="info-section">
      <h2>✅ ماذا تتحقق منه ${renderAnalysisReference('vkCreateDevice', item)}؟</h2>
      <div class="content-card prose-card">
        <ul class="best-practices-list">
          <li>هل الامتدادات المطلوبة مدعومة؟ إذا لم تكن مدعومة فقد ترى ${renderRelatedReferenceLink('VK_ERROR_EXTENSION_NOT_PRESENT')}.</li>
          <li>هل الميزات المطلوبة مدعومة؟ إذا لم تكن كذلك فقد ترى ${renderRelatedReferenceLink('VK_ERROR_FEATURE_NOT_PRESENT')}.</li>
          <li>هل الموارد المتاحة كافية؟ في بعض الحالات قد ترى ${renderRelatedReferenceLink('VK_ERROR_TOO_MANY_OBJECTS')} أو أخطاء ذاكرة مثل ${renderRelatedReferenceLink('VK_ERROR_OUT_OF_HOST_MEMORY')} و${renderRelatedReferenceLink('VK_ERROR_OUT_OF_DEVICE_MEMORY')}.</li>
        </ul>
      </div>
    </section>

    <section class="info-section">
      <h2>🚀 ماذا يحدث بعد النجاح؟</h2>
      <div class="content-card prose-card">
        <p>بعد نجاح ${renderAnalysisReference('vkCreateDevice', item)} يصبح ${renderAnalysisReference('VkDevice', item)} هو الأساس العملي لكل العمل الحقيقي داخل Vulkan. عندها يمكنك استخدامه للحصول على الطوابير عبر ${renderRelatedReferenceLink('vkGetDeviceQueue')}، وإنشاء الموارد مثل buffers وimages وcommand pools وpipelines وswapchain.</p>
      </div>
    </section>

    <section class="info-section">
      <h2>🔗 الدوال المرتبطة</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">قبلها</div>
          <p>${[
            'vkCreateInstance',
            'vkEnumeratePhysicalDevices',
            'vkGetPhysicalDeviceFeatures',
            'vkEnumerateDeviceExtensionProperties',
            'vkGetPhysicalDeviceQueueFamilyProperties'
          ].map((name) => renderRelatedReferenceLink(name)).join('، ')}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">بعدها</div>
          <p>${[
            'vkGetDeviceQueue',
            'vkDestroyDevice',
            'vkDeviceWaitIdle'
          ].map((name) => renderRelatedReferenceLink(name)).join('، ')}</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2>💻 مثال عملي مفهوم</h2>
      ${renderLearningCodeBlock('مثال كامل مبسط', exampleCode)}
      <div class="content-card prose-card">
        <ol class="flow-list">
          <li>لدينا ${renderAnalysisReference('VkPhysicalDevice', item)} تم اختياره مسبقاً.</li>
          <li>حددنا أولوية الطابور في <code>queuePriority</code>.</li>
          <li>جهزنا ${renderAnalysisReference('VkDeviceQueueCreateInfo', item)} وطلبنا طابوراً واحداً من عائلة الرسوميات.</li>
          <li>فعّلنا ميزة <code>samplerAnisotropy</code> داخل ${renderAnalysisReference('VkPhysicalDeviceFeatures', item)}.</li>
          <li>طلبنا امتداد ${renderRelatedReferenceLink('VK_KHR_SWAPCHAIN_EXTENSION_NAME')} لأنه مهم عادة للرسم على نافذة.</li>
          <li>ملأنا ${renderAnalysisReference('VkDeviceCreateInfo', item)} بكل البيانات المطلوبة ثم استدعينا الدالة.</li>
          <li>إذا عادت ${renderRelatedReferenceLink('VK_SUCCESS')} يصبح المتغير <code>device</code> صالحاً للاستخدام.</li>
        </ol>
      </div>
    </section>

    <section class="info-section">
      <h2>🧾 خلاصة مختصرة</h2>
      <div class="content-card prose-card">
        <p>${renderAnalysisReference('vkCreateDevice', item)} هي الدالة التي تنقل التطبيق من مرحلة التعرف على العتاد إلى مرحلة الاستخدام الفعلي له. هي لا تنشئ البطاقة الرسومية نفسها، بل تنشئ ${renderAnalysisReference('VkDevice', item)} فوق ${renderAnalysisReference('VkPhysicalDevice', item)} وتفعّل من خلاله الطوابير والامتدادات والميزات المطلوبة.</p>
      </div>
    </section>
  `;
}

function renderFunctionLearningGuide(item) {
  if (item?.name === 'vkCreateDevice') {
    return renderVkCreateDeviceGuide(item);
  }

  return renderGenericFunctionGuide(item);
}

function getStructureRelatedFunctionLinks(structureName, currentItem = null, limit = 4) {
  return findFunctionsUsingStructure(structureName, limit).map((entry) => renderAnalysisReference(entry.name, currentItem));
}

function inferHandleSubject(name) {
  if (/PipelineCache/.test(name)) return 'بيانات تساعد على تسريع إنشاء الـ pipelines وإعادة استخدامها';
  if (/PipelineLayout/.test(name)) return 'ترتيب descriptor sets و push constants الذي تعتمد عليه الـ pipelines';
  if (/Pipeline(?!Cache|Binary|Executable)/.test(name)) return 'خط التنفيذ الجاهز للرسم أو الحوسبة';
  if (/PipelineBinary/.test(name)) return 'بيانات pipeline ثنائية قابلة للحفظ أو إعادة الاستخدام';
  if (/CommandBuffer/.test(name)) return 'الأوامر المسجلة التي سترسل لاحقاً إلى الـ GPU';
  if (/CommandPool/.test(name)) return 'المخزن الذي تُخصص منه command buffers';
  if (/DescriptorSetLayout/.test(name)) return 'شكل الموارد الذي تتوقعه الـ shaders عند الربط';
  if (/DescriptorPool/.test(name)) return 'المخزن الذي تُخصص منه descriptor sets';
  if (/DescriptorSet/.test(name)) return 'ربط الموارد الفعلي الذي يمرر buffers والصور إلى الـ shaders';
  if (/RenderPass/.test(name)) return 'تنظيم المرفقات ومراحل استخدامها أثناء الرسم';
  if (/Framebuffer/.test(name)) return 'المرفقات الفعلية التي سيرسم إليها الـ render pass';
  if (/ImageView/.test(name)) return 'طريقة عرض صورة Vulkan واختيار الجزء المرئي منها';
  if (/Image/.test(name)) return 'مورد صورة في الذاكرة الرسومية';
  if (/Buffer/.test(name)) return 'مورد buffer في الذاكرة الرسومية';
  if (/Sampler/.test(name)) return 'إعدادات قراءة الخامة وأخذ العينات منها';
  if (/ShaderModule|ShaderEXT/.test(name)) return 'كود shader الجاهز للربط داخل pipeline';
  if (/Surface/.test(name)) return 'سطح العرض المرتبط بنظام النوافذ';
  if (/Swapchain/.test(name)) return 'صور العرض التي ستُعرض على الشاشة';
  if (/Semaphore/.test(name)) return 'مزامنة ترتيب التنفيذ بين الطوابير أو بين الاستحواذ والتقديم';
  if (/Fence/.test(name)) return 'مزامنة بين الـ CPU والـ GPU';
  if (/Queue/.test(name)) return 'الطابور الذي تُرسل إليه الأوامر';
  if (/PhysicalDevice/.test(name)) return 'البطاقة الرسومية الفعلية وقدراتها';
  if (/DeviceMemory/.test(name)) return 'كتلة ذاكرة جهاز تُربط بها الموارد';
  if (/Device(?!Address|Memory)/.test(name)) return 'الجهاز المنطقي الذي تنفذ عليه معظم دوال Vulkan';
  if (/Instance/.test(name)) return 'مدخل التطبيق إلى واجهة Vulkan على مستوى المثيل';
  if (/QueryPool/.test(name)) return 'نتائج الاستعلامات مثل الزمن أو الإحصاءات';
  if (/Event/.test(name)) return 'إشارة مزامنة بسيطة داخل GPU';
  if (/AccelerationStructure/.test(name)) return 'بنية التسارع المستخدمة في ray tracing';
  if (/Display/.test(name)) return 'شاشة عرض أو مخرج Display على مستوى المنصة';
  if (/PrivateDataSlot/.test(name)) return 'فتحة بيانات خاصة تربطها التطبيق بكائنات Vulkan';
  return 'مورد أو كائن Vulkan يعمل عليه التطبيق عبر دوال الواجهة';
}

function inferMacroCategory(item) {
  const name = String(item?.name || '');
  const syntax = String(item?.syntax || '');
  const isFunctionLike = /\w+\s*\(/.test(syntax);

  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'Platform Macro / Conditional Compilation Macro';
  }
  if (/_EXTENSION_NAME$/.test(name) || /_SPEC_VERSION$/.test(name)) {
    return 'Extension-related Macro';
  }
  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION|API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH|HEADER_VERSION|HEADER_VERSION_COMPLETE|API_VERSION_\d+_\d+)$/.test(name)) {
    return isFunctionLike ? 'Version Macro / Function-like Macro' : 'Version Macro / Constant Macro';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'Utility Macro / Function-like Macro';
  }
  if (/^VK_NULL_HANDLE$/.test(name)) {
    return 'Constant Macro';
  }
  return isFunctionLike ? 'Function-like Macro' : 'Constant Macro';
}

function localizeMacroCategory(category) {
  const text = String(category || '').trim();
  if (!text) {
    return 'ماكرو';
  }

  return text
    .replace(/Platform Macro/gi, 'ماكرو منصة')
    .replace(/Conditional Compilation Macro/gi, 'ماكرو ترجمة شرطية')
    .replace(/Extension-related Macro/gi, 'ماكرو مرتبط بامتداد')
    .replace(/Version Macro/gi, 'ماكرو إصدار')
    .replace(/Utility Macro/gi, 'ماكرو مساعد')
    .replace(/Function-like Macro/gi, 'ماكرو شبيه بالدالة')
    .replace(/Constant Macro/gi, 'ماكرو ثابت')
    .replace(/\s*\/\s*/g, ' / ');
}

function inferMacroExpansionExpression(item) {
  const name = String(item?.name || '');

  if (name === 'VK_MAKE_API_VERSION') {
    return '((((uint32_t)(variant)) << 29U) | (((uint32_t)(major)) << 22U) | (((uint32_t)(minor)) << 12U) | ((uint32_t)(patch)))';
  }
  if (name === 'VK_MAKE_VERSION') {
    return '((((uint32_t)(major)) << 22U) | (((uint32_t)(minor)) << 12U) | ((uint32_t)(patch)))';
  }
  if (name === 'VK_VERSION_MAJOR') {
    return '((uint32_t)(version) >> 22U)';
  }
  if (name === 'VK_VERSION_MINOR') {
    return '(((uint32_t)(version) >> 12U) & 0x3FFU)';
  }
  if (name === 'VK_VERSION_PATCH') {
    return '((uint32_t)(version) & 0xFFFU)';
  }
  if (name === 'VK_API_VERSION_VARIANT') {
    return '((uint32_t)(version) >> 29U)';
  }
  if (name === 'VK_API_VERSION_MAJOR') {
    return '(((uint32_t)(version) >> 22U) & 0x7FU)';
  }
  if (name === 'VK_API_VERSION_MINOR') {
    return '(((uint32_t)(version) >> 12U) & 0x3FFU)';
  }
  if (name === 'VK_API_VERSION_PATCH') {
    return '((uint32_t)(version) & 0xFFFU)';
  }
  if (name === 'VK_DEFINE_HANDLE') {
    return 'typedef struct object##_T* object;';
  }
  if (name === 'VK_DEFINE_NON_DISPATCHABLE_HANDLE') {
    return '#if (VK_USE_64_BIT_PTR_DEFINES==1)\n#define VK_DEFINE_NON_DISPATCHABLE_HANDLE(object) typedef struct object##_T *object;\n#else\n#define VK_DEFINE_NON_DISPATCHABLE_HANDLE(object) typedef uint64_t object;\n#endif';
  }
  if (name === 'VK_NULL_HANDLE') {
    return '#if C++11 مع مقابض غير قابلة للإرسال بعرض 64 بت\nnullptr\n#elif C\n((void*)0) أو 0ULL أو 0 بحسب الشروط في الترويسة';
  }
  if (name === 'VK_HEADER_VERSION_COMPLETE') {
    return 'VK_MAKE_API_VERSION(0, 1, 4, VK_HEADER_VERSION)';
  }
  if (/^VK_API_VERSION_(\d+)_(\d+)$/.test(name)) {
    const match = name.match(/^VK_API_VERSION_(\d+)_(\d+)$/);
    return `VK_MAKE_API_VERSION(0, ${match[1]}, ${match[2]}, 0)`;
  }
  if (/^VK_HEADER_VERSION$/.test(name) && item?.value) {
    return String(item.value);
  }
  if (/_EXTENSION_NAME$/.test(name) && item?.value) {
    return String(item.value);
  }
  if (/_SPEC_VERSION$/.test(name) && item?.value) {
    return String(item.value);
  }

  return String(item?.value || '').trim();
}

function inferMacroRole(item) {
  const name = String(item?.name || '');

  if (/^VK_MAKE_API_VERSION$/.test(name)) {
    return 'يبني عدداً صحيحاً واحداً يشفّر حقول متغير الإصدار والإصدار الرئيسي والفرعي ورقم التصحيح في الصيغة التي تتوقعها فولكان داخل حقول مثل apiVersion.';
  }
  if (/^VK_MAKE_VERSION$/.test(name)) {
    return 'يبني رقم إصدار فولكان القديم من الإصدار الرئيسي والفرعي ورقم التصحيح قبل إدخاله في الحقول أو المقارنات التي تستخدم الصيغة القديمة.';
  }
  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT)$/.test(name)) {
    return 'يفكك رقم إصدار الواجهة الحديث إلى أحد حقوله حتى تستطيع قراءة الجزء المطلوب من العدد المدمج بدل التعامل معه كرقم غامض.';
  }
  if (/^VK_VERSION_(MAJOR|MINOR|PATCH)$/.test(name)) {
    return 'يفكك رقم الإصدار القديم إلى الإصدار الرئيسي أو الفرعي أو رقم التصحيح بعد أن يكون الإصدار قد شُفِّر داخل uint32_t واحد.';
  }
  if (/^VK_DEFINE_HANDLE$/.test(name)) {
    return 'يولد تعريف نوع لمقبض قابل للإرسال بحيث تعرف ترويسة فولكان نوع المقبض كمؤشر إلى بنية غير مكشوفة.';
  }
  if (/^VK_DEFINE_NON_DISPATCHABLE_HANDLE$/.test(name)) {
    return 'يولد تعريف نوع لمقبض غير قابل للإرسال بالشكل الذي تختاره الترويسة بحسب المنصة وعرض المؤشرات، إما مؤشراً معتماً أو uint64_t.';
  }
  if (/^VK_NULL_HANDLE$/.test(name)) {
    return 'يعطي قيمة ثابتة موحدة للتعبير عن غياب مقبض صالح، بحيث يمكن تهيئة المقابض أو إعادة ضبطها أو اختبارها من دون أرقام حرفية.';
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'يفعّل فروع الترجمة الشرطية داخل ترويسة فولكان حتى تُدرج التعريفات والدوال والأنواع الخاصة بالمنصة المحددة أثناء الترجمة.';
  }
  if (/^VK_HEADER_VERSION(_COMPLETE)?$/.test(name)) {
    return 'يعطي قيمة ثابتة تعبّر عن نسخة ترويسات فولكان التي يبني المشروع ضدها، لا عن سلوك وقت التشغيل داخل السائق.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    return 'يعطي السلسلة النصية الرسمية لاسم الامتداد كما يجب أن تُمرر إلى فولكان عند فحص الدعم أو عند التفعيل.';
  }
  if (/_SPEC_VERSION$/.test(name)) {
    return 'يعطي رقماً ثابتاً يمثل نسخة مواصفة الامتداد داخل الترويسة حتى تقارنها مع النسخة التي يعيدها السائق أو تسجلها.';
  }
  if (/^VK_API_VERSION_\d+_\d+$/.test(name)) {
    return 'يعطي قيمة إصدار واجهة ثابتة جاهزة حتى يضعها التطبيق مباشرة داخل apiVersion أو يقارن بها النسخ المدعومة.';
  }

  return 'يعطي قيمة أو تعريفاً يوسعه المعالج المسبق نصياً داخل الكود قبل الترجمة، بحيث ترى فولكان أو المترجم الناتج النهائي لا اسم الماكرو نفسه.';
}

function inferMacroWhereUsed(item) {
  const name = String(item?.name || '');
  const usageItems = getUsageItems(item);

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
    return `يستخدم عادة في تهيئة ${renderProjectReferenceChip('VkApplicationInfo')} أو في المقارنات التي تبني رقم إصدار واحداً من حقول منفصلة قبل تمريره إلى فولكان.`;
  }
  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
    return 'يستخدم عادة بعد استدعاءات الاستعلام عن الإصدارات مثل قراءة apiVersion من الخصائص، أو عند طباعة الإصدار أو اختيار مسار توافق معين.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'يستخدم داخل ترويسة فولكان نفسها وفي الشيفرات التي تعيد تعريف مقابض متوافقة مع فولكان، وليس في منطق التطبيق اليومي أثناء وقت التشغيل.';
  }
  if (/^VK_NULL_HANDLE$/.test(name)) {
    return 'يستخدم في تهيئة متغيرات المقابض قبل الإنشاء، وفي اختبارات الصلاحية، وبعد التدمير لإرجاع المتغير إلى حالة واضحة.';
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'يستخدم قبل تضمين vulkan.h أو vulkan_core.h حتى يفعّل تعريفات المنصة مثل Surface والدوال المرتبطة بها أثناء الترجمة.';
  }
  if (/^VK_HEADER_VERSION(_COMPLETE)?$/.test(name)) {
    return 'يستخدم في فروع البناء أو التسجيل أو التشخيص التي تحتاج معرفة نسخة الترويسة التي بُني ضدها المشروع.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    return 'يستخدم داخل مصفوفات أسماء الامتدادات مثل ppEnabledExtensionNames أو في المقارنات مع extensionName عند فحص الدعم.';
  }
  if (/_SPEC_VERSION$/.test(name)) {
    return 'يستخدم في المقارنات مع specVersion التي يعيدها السائق أو في توثيق الامتداد الذي يعتمد عليه التطبيق.';
  }

  return usageItems[0] || `يستخدم ${name} في المواضع التي تحتاج فيها إلى الناتج الرسمي الذي تعرفه ترويسة فولكان لهذا الرمز بعينه.`;
}

function inferMacroRuntimeNote(item) {
  const name = String(item?.name || '');
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'هذا الرمز لا ينفذ أي شيء أثناء وقت التشغيل. تأثيره كله يحدث قبل الترجمة لأنه يفتح أو يغلق أجزاء من الترويسة عبر الترجمة الشرطية.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'هذا الماكرو لا ينفذ أثناء وقت التشغيل إطلاقاً. نتيجته تعريف نوع يدخل في واجهة الأنواع وقت الترجمة فقط.';
  }
  return 'هذا الماكرو لا يعمل كدالة أثناء وقت التشغيل. المعالج المسبق يستبدل اسمه نصياً أولاً، ثم يترجم المترجم الناتج النهائي كجزء عادي من الكود.';
}

function inferMacroExpansionSummary(item) {
  const name = String(item?.name || '');
  const expansion = inferMacroExpansionExpression(item);

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
    return `المعالج المسبق لا يحسب الإصدار بنفسه، بل يستبدل اسم الماكرو بالتعبير التالي: ${expansion}. بعد ذلك يحسب المترجم هذا التعبير العددي العادي.`;
  }
  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
    return `عند التوسيع يتحول ${name} إلى تعبير استخراج بتات مباشر: ${expansion}. أي أن القراءة تتم من خلال الإزاحات وأقنعة البتات على العدد نفسه.`;
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return `عند التوسيع لا ينتج استدعاء دالة، بل ينتج تعريف نوع مباشرة في الترويسة. الصيغة الأساسية هي: ${expansion}`;
  }
  if (/^VK_NULL_HANDLE$/.test(name)) {
    return `عند التوسيع ينتج قيمة ثابتة فارغة تحددها الترويسة بحسب شروط المنصة واللغة. الصيغة الممكنة في الترويسة الحالية هي:\n${expansion}`;
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'هذا الماكرو لا يوسّع إلى تعبير حسابي عادة، بل وجوده نفسه يغيّر مسار الترجمة الشرطية داخل الترويسة ويجعل تعريفات المنصة تظهر أو تختفي.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    return `عند التوسيع يتحول مباشرة إلى سلسلة نصية حرفية هي ${expansion || 'اسم الامتداد الرسمي'}.`;
  }
  if (/_SPEC_VERSION$/.test(name)) {
    return `عند التوسيع يتحول إلى ثابت عددي يمثل نسخة مواصفة الامتداد في هذه الترويسة${expansion ? `: ${expansion}` : ''}.`;
  }
  if (expansion) {
    return `عند التوسيع يتحول ${name} إلى: ${expansion}`;
  }
  return 'المعالج المسبق يستبدل هذا الرمز بالنص أو القيمة المعرفة له داخل الترويسة قبل أن يبدأ المترجم تحليل الكود.';
}

function renderMacroInlineFragment(value = '') {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }
  return `<code class="macro-inline-fragment" dir="ltr">${escapeHtml(text)}</code>`;
}

function renderMacroExpansionNarrative(item) {
  const name = String(item?.name || '').trim();
  const selfRef = renderAnalysisReference(name, item);
  const objectTypedef = renderMacroInlineFragment('typedef struct object##_T* object;');
  const objectUint64Typedef = renderMacroInlineFragment('typedef uint64_t object;');
  const nullptrValue = renderMacroInlineFragment('nullptr');
  const zeroUllValue = renderMacroInlineFragment('0ULL');
  const versionToken = renderMacroInlineFragment('version');
  const majorToken = renderMacroInlineFragment('major');
  const minorToken = renderMacroInlineFragment('minor');
  const patchToken = renderMacroInlineFragment('patch');
  const variantToken = renderMacroInlineFragment('variant');

  if (!name) {
    return '';
  }

  if (name === 'VK_DEFINE_HANDLE') {
    return `${selfRef} لا ينتج استدعاء دالة، بل يوسّع إلى تعريف نوع لمقبض معتم مثل ${objectTypedef}. الصيغة الكاملة معروضة أيضاً في قسم "النص الذي يراه المترجم بعد التوسيع".`;
  }

  if (name === 'VK_DEFINE_NON_DISPATCHABLE_HANDLE') {
    return `${selfRef} لا ينتج استدعاء دالة، بل يوسّع إلى تعريف نوع لمقبض غير قابل للإرسال، ويعتمد الشكل النهائي على ${renderAnalysisReference('VK_USE_64_BIT_PTR_DEFINES', item)} بين ${objectTypedef} أو ${objectUint64Typedef}. الصيغة الكاملة معروضة أيضاً في قسم "النص الذي يراه المترجم بعد التوسيع".`;
  }

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
    return `${selfRef} يوسّع إلى تعبير حسابي يبني رقم إصدار واحدًا من الحقول ${variantToken} و${majorToken} و${minorToken} و${patchToken}. الصيغة الكاملة معروضة في القسم التالي بدلاً من ضغطها داخل هذا السطر.`;
  }

  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
    return `${selfRef} يوسّع إلى تعبير استخراج بتات من القيمة ${versionToken}، وليس إلى منطق وقت تشغيل مستقل. الصيغة الكاملة معروضة في القسم التالي.`;
  }

  if (name === 'VK_NULL_HANDLE') {
    return `${selfRef} يوسّع إلى قيمة فارغة مناسبة للغة والمنصة الحالية مثل ${nullptrValue} أو ${zeroUllValue}، لا إلى كائن Vulkan حقيقي. الصيغة الكاملة معروضة في القسم التالي.`;
  }

  if (/^VK_USE_PLATFORM_/.test(name)) {
    return `${selfRef} لا يوسّع عادة إلى تعبير حسابي، بل يفتح مسار ترجمة شرطية داخل الترويسة حتى تظهر تعريفات المنصة المرتبطة به.`;
  }

  if (/_EXTENSION_NAME$/.test(name) && item?.value) {
    return `${selfRef} يوسّع إلى سلسلة نصية حرفية لاسم الامتداد الرسمي: ${renderMacroInlineFragment(String(item.value || ''))}.`;
  }

  if (/_SPEC_VERSION$/.test(name) && item?.value) {
    return `${selfRef} يوسّع إلى ثابت عددي يمثل نسخة مواصفة الامتداد في هذه الترويسة: ${renderMacroInlineFragment(String(item.value || ''))}.`;
  }

  if (/^VK_API_VERSION_\d+_\d+$/.test(name)) {
    return `${selfRef} يوسّع إلى قيمة إصدار واجهة جاهزة مبنية مسبقًا، وتظهر الصيغة الكاملة في القسم التالي.`;
  }

  if (item?.value) {
    return `${selfRef} يوسّع إلى القيمة التالية: ${renderMacroInlineFragment(String(item.value || ''))}.`;
  }

  return `${selfRef} يوسّع إلى النص أو القيمة المعرفة له داخل الترويسة قبل أن يبدأ المترجم تحليل الكود.`;
}

function inferMacroParameterNotes(item) {
  const name = String(item?.name || '');
  const parameters = item?.parameters || [];
  if (!parameters.length) {
    return '';
  }

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
    return 'كل معامل يدخل مرة واحدة داخل تعبير البتات النهائي. هذه الماكرو محاطة بأقواس وتستخدم تحويلات إلى uint32_t، لذلك خطر أسبقية العمليات منخفض، ولا يوجد تقييم متكرر للمعامل نفسه أكثر من مرة في التعريف الحالي.';
  }
  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
    return 'المعامل الوحيد version يُدرج مرة واحدة داخل تعبير إزاحات وأقنعة بتات مع أقواس واضحة، لذلك لا يوجد تقييم متكرر في التعريف الحالي.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'المعامل object لا يمثل قيمة وقت تشغيل، بل رمزاً يدخل في تعريف النوع عبر لصق الرموز مثل object##_T. لهذا السبب يجب أن يكون معرّفاً صالحاً لا تعبيراً حسابياً.';
  }

  return 'تعامل مع معاملات هذا الماكرو على أنها جزء من النص النهائي الذي سيولده المعالج المسبق، لا كوسائط دالة وقت تشغيل.';
}

function buildMacroBeforeAfterExample(item) {
  const name = String(item?.name || '');

  if (name === 'VK_MAKE_API_VERSION') {
    return {
      before: 'uint32_t apiVersion = VK_MAKE_API_VERSION(0, 1, 3, 0);',
      after: 'uint32_t apiVersion = ((((uint32_t)(0)) << 29U) | (((uint32_t)(1)) << 22U) | (((uint32_t)(3)) << 12U) | ((uint32_t)(0)));'
    };
  }
  if (name === 'VK_MAKE_VERSION') {
    return {
      before: 'uint32_t version = VK_MAKE_VERSION(1, 2, 3);',
      after: 'uint32_t version = ((((uint32_t)(1)) << 22U) | (((uint32_t)(2)) << 12U) | ((uint32_t)(3)));'
    };
  }
  if (name === 'VK_API_VERSION_MAJOR') {
    return {
      before: 'uint32_t major = VK_API_VERSION_MAJOR(props.apiVersion);',
      after: 'uint32_t major = (((uint32_t)(props.apiVersion) >> 22U) & 0x7FU);'
    };
  }
  if (name === 'VK_VERSION_MAJOR') {
    return {
      before: 'uint32_t major = VK_VERSION_MAJOR(version);',
      after: 'uint32_t major = ((uint32_t)(version) >> 22U);'
    };
  }
  if (name === 'VK_DEFINE_HANDLE') {
    return {
      before: 'VK_DEFINE_HANDLE(VkDevice)',
      after: 'typedef struct VkDevice_T* VkDevice;'
    };
  }
  if (name === 'VK_DEFINE_NON_DISPATCHABLE_HANDLE') {
    return {
      before: 'VK_DEFINE_NON_DISPATCHABLE_HANDLE(VkBuffer)',
      after: 'typedef struct VkBuffer_T* VkBuffer;  // أو typedef uint64_t VkBuffer; بحسب VK_USE_64_BIT_PTR_DEFINES'
    };
  }
  if (name === 'VK_NULL_HANDLE') {
    return {
      before: 'VkBuffer buffer = VK_NULL_HANDLE;',
      after: 'VkBuffer buffer = nullptr;  // أو 0ULL / 0 بحسب شروط الهيدر والمنصة'
    };
  }
  if (/_EXTENSION_NAME$/.test(name) && item?.value) {
    return {
      before: `const char* exts[] = { ${name} };`,
      after: `const char* exts[] = { ${item.value} };`
    };
  }
  if (/^VK_API_VERSION_(\d+)_(\d+)$/.test(name)) {
    const expansion = inferMacroExpansionExpression(item);
    return {
      before: `appInfo.apiVersion = ${name};`,
      after: `appInfo.apiVersion = ${expansion};`
    };
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return {
      before: '#define VK_USE_PLATFORM_WIN32_KHR\n#include <vulkan/vulkan.h>',
      after: '// بعد preprocessing تصبح تعريفات Win32 KHR مرئية داخل الهيدر، مثل الأنواع والدوال الخاصة بـ Win32 Surface'
    };
  }

  return null;
}

function inferMacroPracticalMeaning(item) {
  const name = String(item?.name || '');
  return `${name} هو ${localizeMacroCategory(inferMacroCategory(item))} في ترويسات فولكان، ووظيفته الحقيقية هي أن يوسّع إلى ${inferMacroRole(item)}`;
}

function inferMacroPracticalUsage(item) {
  return inferMacroWhereUsed(item);
}

function inferMacroPracticalEffect(item) {
  return inferMacroExpansionSummary(item);
}

function inferMacroPracticalBenefit(item) {
  const name = String(item?.name || '');

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
    return 'الفائدة العملية هي منع بناء أرقام الإصدارات يدوياً بشكل خاطئ، لأن تخطيط البتات يأتي مباشرة من تعريف الترويسة الرسمية.';
  }
  if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
    return 'الفائدة العملية هي قراءة الحقول الصحيحة من رقم الإصدار من دون كتابة إزاحات وأقنعة بتات يدوية قد تكون خاطئة أو غير متوافقة مع صيغة فولكان.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'الفائدة العملية هي أن جميع المقابض تُعرّف بطريقة موحّدة عبر المترجمات والمنصات، لذلك تبقى الواجهة الثنائية والترويسات متوافقة مع ما تتوقعه فولكان.';
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'الفائدة العملية هي أن التطبيق أو المكتبة يفعّل فقط تعريفات المنصة التي يحتاجها أثناء الترجمة، بدلاً من سحب كل فروع المنصات داخل الترويسة.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    return 'الفائدة العملية هي تمرير الاسم النصي الرسمي للامتداد كما هو في المواصفة، بدلاً من كتابة سلسلة نصية حرفية يدوياً قد تحتوي خطأً إملائياً يمنع التفعيل.';
  }
  if (/_SPEC_VERSION$/.test(name)) {
    return 'الفائدة العملية هي مقارنة نسخة الامتداد بقيمة رسمية من الهيدر بدل الاعتماد على رقم صلب غير موثق داخل التطبيق.';
  }
  if (/^VK_NULL_HANDLE$/.test(name)) {
    return 'الفائدة العملية من هذا الثابت هي توفير قيمة موحدة وواضحة لتمثيل غياب مقبض صالح، مما يسمح بتهيئة المقابض بطريقة آمنة قبل إنشاء الكائنات الفعلية في فولكان.';
  }
  return 'الفائدة العملية هي أن الكود يستخدم التعريف الرسمي الموجود في ترويسة فولكان نفسها، لذلك يقل خطر الأخطاء اليدوية في القيم أو التعريفات أو المسارات الشرطية.';
}

function inferMacroPracticalSummary(item) {
  const name = String(item?.name || '');

  if (/^VK_(MAKE_API_VERSION|MAKE_VERSION|API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH|API_VERSION_\d+_\d+)$/.test(name)) {
    return 'الخلاصة: هذا الماكرو جزء من نظام الإصدارات في فولكان، وهو موجود لبناء رقم الإصدار أو تفكيكه بنفس تنسيق البتات الذي تفرضه الترويسة الرسمية.';
  }
  if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
    return 'الخلاصة: هذا الماكرو لا يمثل عملية وقت تشغيل، بل يولد تعريف نوع يحدد شكل نوع المقبض نفسه داخل واجهة فولكان.';
  }
  if (/^VK_USE_PLATFORM_/.test(name)) {
    return 'الخلاصة: هذا الماكرو مفتاح ترجمة لمنصة معينة؛ وجوده يغيّر ما الذي يراه المترجم داخل الترويسة، لا ما الذي يحدث داخل المعالج الرسومي أثناء التشغيل.';
  }
  if (/_EXTENSION_NAME$/.test(name)) {
    return 'الخلاصة: هذا الماكرو يوسع إلى الاسم النصي الرسمي للامتداد، لذلك يستخدم عند فحص الدعم أو تفعيل الامتداد لا كرمز تجميلي فقط.';
  }
  if (/_SPEC_VERSION$/.test(name)) {
    return 'الخلاصة: هذا الماكرو يوسع إلى رقم ثابت يصف نسخة الامتداد في الترويسة، ويستخدم في المقارنة والتشخيص وليس كعملية وقت تشغيل.';
  }
  return 'الخلاصة: هذا الماكرو يغيّر النص البرمجي أثناء المعالجة المسبقة بإنتاج قيمة أو تعريف رسمي تحتاجه فولكان أو ترويستها في موضع محدد.';
}

function renderMacroPreprocessorSection(item) {
  const expansion = inferMacroExpansionExpression(item);
  const beforeAfter = buildMacroBeforeAfterExample(item);
  const parameterNotes = inferMacroParameterNotes(item);
  const localizedCategory = localizeMacroCategory(inferMacroCategory(item));

  return `
    <section class="info-section">
      <h2>🧩 تحليل الماكرو</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="${escapeAttribute('يوضح أن هذا العنصر ماكرو داخل ترويسات فولكان، وأن أثره الحقيقي يحدث أثناء المعالجة المسبقة قبل الترجمة وليس كدالة وقت تشغيل.')}" tabindex="0" aria-label="1. نوع الكيان">1. نوع الكيان</div>
          <p>${linkUsageBridgeText('ماكرو داخل ترويسات فولكان، ويعالجه المعالج المسبق قبل الترجمة.')}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="${escapeAttribute('يوضح فئة هذا الماكرو: هل هو ثابت، شبيه بالدالة، مرتبط بإصدار، بامتداد، أو بشرط ترجمة خاص بالمنصة.')}" tabindex="0" aria-label="2. نوع الماكرو">2. نوع الماكرو</div>
          <p>${linkUsageBridgeText(localizedCategory)}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">3. ما الذي يوسعه أو يعرّفه</div>
          <p>${renderMacroExpansionNarrative(item)}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">4. وظيفته الحقيقية داخل Vulkan</div>
          <p>${linkUsageBridgeText(inferMacroRole(item))}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">5. أين يستخدم</div>
          <p>${linkUsageBridgeText(inferMacroWhereUsed(item))}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">6. ملاحظة وقت التشغيل</div>
          <p>${linkUsageBridgeText(inferMacroRuntimeNote(item))}</p>
        </div>
      </div>
      ${expansion ? `
      <div class="content-card prose-card">
        <div class="info-label">النص الذي يراه المترجم بعد التوسيع</div>
        ${renderVulkanHighlightedCodeBlock(expansion, 'cpp')}
      </div>
      ` : ''}
      ${beforeAfter ? `
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">قبل توسعة الماكرو</div>
          ${renderVulkanHighlightedCodeBlock(beforeAfter.before, 'cpp')}
        </div>
        <div class="content-card prose-card">
          <div class="info-label">بعد توسعة الماكرو</div>
          ${renderVulkanHighlightedCodeBlock(beforeAfter.after, 'cpp')}
        </div>
      </div>
      ` : ''}
      ${parameterNotes ? `
      <div class="content-card prose-card">
        <div class="info-label">ملاحظات عن المعاملات والتوسيع</div>
        <p>${linkUsageBridgeText(parameterNotes)}</p>
      </div>
      ` : ''}
    </section>
  `;
}

function inferReferenceProfile(item, kind) {
  const name = item?.name || '';
  const description = item?.description || '';
  const usageItems = getUsageItems(item);
  const relatedFunctions = getRelatedFunctionNames(item);

  if (kind === 'structure') {
    const isHandle = description.includes('مقبض') || (!item?.members?.length && /^Vk[A-Z]/.test(name));
    if (isHandle) {
      const relatedLinks = getStructureRelatedFunctionLinks(name, item, 4);
      if (name === 'VkPipelineCache') {
        return {
          what: 'مقبض لكائن Pipeline Cache في Vulkan.',
          meaning: 'يمثل مخزناً تحتفظ فيه Vulkan ببيانات تساعد على تسريع إنشاء الـ pipelines في الاستدعاءات اللاحقة، بدلاً من إعادة بناء كل شيء من الصفر كل مرة.',
          usage: usageItems[0] || `يُنشأ عادة عبر ${renderAnalysisReference('vkCreatePipelineCache', item)} ثم يُمرر إلى ${renderAnalysisReference('vkCreateGraphicsPipelines', item)} أو ${renderAnalysisReference('vkCreateComputePipelines', item)} حتى تستفيد هذه الدوال من البيانات المخزنة عند بناء pipeline جديد.`,
          exampleRole: `في الكود يظهر ${name} كمتغير handle يُنشأ مرة، ثم يُعاد استخدامه أثناء إنشاء أكثر من pipeline لتقليل كلفة الإنشاء وتحسين زمن الإقلاع أو إعادة البناء.`,
          validity: `يكون ${name} صالحاً بعد إنشائه بنجاح، ويبقى قابلاً للاستخدام ما دام لم يُدمَّر وما دام تابعاً لنفس ${renderAnalysisReference('VkDevice', item)} الذي أُنشئ عليه.`,
          failure: `إذا كان ${name} غير منشأ، أو دُمِّر مسبقاً، أو استُخدم مع جهاز مختلف، فلن تستفيد دوال إنشاء الـ pipelines منه وقد ينتهي الأمر إلى فشل تحقق أو استدعاء غير صحيح.`
        };
      }

      return {
        what: 'مقبض Handle من Vulkan.',
        meaning: `${name} هو الكائن الذي يحتفظ به التطبيق لتمثيل ${inferHandleSubject(name)}، ثم يمرره إلى الدوال التي تنشئه أو تستخدمه أو تحرره.`,
        usage: usageItems[0] || `تحصل على ${name} من دالة إنشاء أو استعلام، ثم تعيد تمريره عند كل عملية تريد تنفيذها على هذا الكائن${relatedLinks.length ? ` مثل ${relatedLinks.join('، ')}` : ''}.`,
        exampleRole: `في الأمثلة يظهر ${name} كمتغير يحتفظ بالكائن الناتج من الاستدعاء، ثم يُستخدم في الخطوات التالية المرتبطة به مباشرة بدلاً من إعادة وصف المورد من جديد في كل مرة.`,
        validity: `يبقى ${name} صالحاً عندما يكون قد أُنشئ أو أُعيد من الدالة الصحيحة، ولم يُدمَّر بعد، ويظل تابعاً للجهاز أو المثيل الذي أنشأه.`,
        failure: `استخدام ${name} قبل الحصول عليه فعلياً، أو بعد تدميره، أو مع دالة لا تستقبل هذا النوع، يؤدي إلى نتائج غير صحيحة أو إلى أخطاء تحقق.`
      };
    }

    const structureFunctionLinks = getStructureRelatedFunctionLinks(name, item, 4);
    const role = inferStructureRole(item);
    const lead = trimLeadingTypeName(getStructureLeadDescription(item) || role.meaning || description, name);
    return {
      what: 'بنية Struct أو نوع بيانات من Vulkan.',
      meaning: lead || `${name} هو البنية التي يضع فيها التطبيق الإعدادات أو البيانات التي تحتاجها الدالة قبل التنفيذ، أو يقرأ منها النتائج التي تعيدها Vulkan بعد الاستدعاء.`,
      usage: usageItems[0] || role.intent || `يُستخدم ${name} عندما تحتاج إلى تمرير مجموعة حقول مترابطة دفعة واحدة إلى دالة Vulkan${structureFunctionLinks.length ? ` مثل ${structureFunctionLinks.join('، ')}` : ''} بدلاً من تمرير كل قيمة منفصلة.`,
      exampleRole: `في الأمثلة يظهر ${name} كبنية تُجهّز أولاً، ثم تُملأ الحقول التي تغيّر المعنى العملي للاستدعاء نفسه: ما الطلب الذي ستقرأه الدالة، وما الحدود أو الخيارات أو الموارد التي ستعتمد عليها أثناء التنفيذ.`,
      validity: role.validity || `تكون البنية صالحة عندما تعبأ الحقول الإلزامية بالقيم المناسبة، وخاصة الحقول التي تعتمد عليها الدالة مثل counts والمؤشرات والرايات.`,
      failure: role.failure || `ترك الحقول الإلزامية بدون تعبئة، أو تمرير مؤشرات غير صالحة، أو وضع قيم غير متوافقة داخل ${name} يؤدي إلى فشل الاستدعاء أو تحذيرات Validation Layers.`
    };
  }

  if (kind === 'enum') {
    return {
      what: 'نوع تعداد Enum أو أعلام من Vulkan.',
      meaning: `${name} يعرّف مجموعة قيم مسماة تختار سلوكاً أو حالةً أو وضع تشغيل بدلاً من الأرقام الحرفية.`,
      usage: usageItems[0] || `تختار من ${name} القيمة التي تطابق المعنى المطلوب ثم تمررها إلى الحقل أو الدالة المناسبة.`,
      exampleRole: `في الأمثلة يظهر ${name} كنوع متغير أو كنوع لحقل داخل بنية يحدد المسار الفعلي للتنفيذ أو الوضع المستخدم.`,
      validity: `يكون الاستخدام صحيحاً عندما تستعمل قيمة معرفة فعلاً داخل ${name} ومتوافقة مع السياق الذي يستقبلها.`,
      failure: `القيم غير المعرفة أو الدمج غير الصحيح بين الأعلام يؤدي إلى سلوك غير صحيح أو إلى أخطاء تحقق واضحة.`
    };
  }

  if (kind === 'constant') {
    if (name === 'VK_NULL_HANDLE') {
      return {
        what: 'ثابت خاص بالمقابض في فولكان.',
        meaning: 'يمثل VK_NULL_HANDLE حالة غياب مقبض صالح، أي أن المتغير لا يشير حالياً إلى أي كائن أنشأته فولكان.',
        usage: 'يُستخدم عند تهيئة مقابض مثل VkInstance وVkDevice وVkBuffer وVkImage قبل الإنشاء، وعند إعادة ضبطها بعد التدمير، وعند اختبار ما إذا كان المتغير يحمل كائناً فعلياً.',
        exampleRole: 'يرتبط هذا الثابت عادة بسطور التهيئة والفحص في الكود، مثل تهيئة متغير إلى VK_NULL_HANDLE قبل استدعاء vkCreateInstance أو فحصه قبل تمريره إلى vkDestroyInstance أو إلى دوال تعمل على المورد نفسه.',
        validity: 'تكون هذه القيمة صحيحة عندما تريد التعبير صراحة عن غياب الكائن. إذا كان المسار يتوقع مورداً منشأً فعلياً فيجب أن يكون المتغير قد استلم مقبضاً حقيقياً من دالة فولكان مناسبة.',
        failure: 'تمرير VK_NULL_HANDLE إلى دالة تتطلب مقبضاً صالحاً يؤدي عادة إلى خطأ تحقق أو فشل مباشر في الاستدعاء.'
      };
    }

    return {
      what: 'ثابت أو قيمة خاصة من Vulkan.',
      meaning: `${name} يمثل قيمة معيارية أو رمزاً خاصاً تستخدمه الواجهة لتعريف حالة أو إصدار أو حد أو قيمة مميزة.`,
      usage: usageItems[0] || `يُستخدم ${name} مباشرة في المقارنات أو الحقول أو الاستدعاءات التي تتوقع هذه القيمة الرسمية.`,
      exampleRole: `يرتبط ${name} عادة بحقول البنى أو المقارنات أو النتائج الرسمية التي تتوقع هذه القيمة تحديداً داخل الكود، بحيث يصبح معنى السطر واضحاً من دون أرقام حرفية غامضة.`,
      validity: `يبقى استخدام ${name} صحيحاً عندما يوضع في الموضع الذي تصفه المواصفة له، مثل نتيجة دالة أو حقل إصدار أو قيمة خاصة.`,
      failure: `استخدام ${name} في سياق غير مناسب أو استبداله بقيمة غير مكافئة يغيّر منطق المثال أو يجعل البنية غير متوافقة مع المواصفة.`
    };
  }

  return {
    what: `ماكرو من فولكان من الفئة ${localizeMacroCategory(inferMacroCategory(item))}.`,
    meaning: inferMacroPracticalMeaning(item),
    usage: inferMacroPracticalUsage(item),
    exampleRole: `يرتبط ${name} بمواضع التهيئة أو المقارنة أو تعريف الأنواع التي تحتاج ناتجاً نصياً أو عددياً ثابتاً بعد المعالجة المسبقة، مثل اسم امتداد أو رقم إصدار أو typedef أو قيمة يجب أن تطابق ترويسات فولكان تماماً.`,
    validity: `يكون صحيحاً عندما يُستخدم في السياق الذي صُمم له ويُفهم على أنه توسعة نصية أو قيمة ثابتة، لا كدالة تعمل وقت التشغيل.`,
    failure: `الخطأ الشائع هو تفسير ${name} من اسمه فقط أو التعامل معه كاستدعاء يجري وقت التشغيل؛ النتيجة الحقيقية هي النص الذي يولده بعد توسعة الماكرو.`
  };
}

function renderReferenceConceptSection(item, kind) {
  const profile = inferReferenceProfile(item, kind);
  const titleMap = {
    structure: '📘 معنى النوع واستخدامه',
    enum: '📘 معنى التعداد واستخدامه',
    constant: '📘 معنى الثابت واستخدامه',
    macro: '📘 معنى الماكرو واستخدامه'
  };
  const relationLabel = kind === 'constant' || kind === 'macro'
    ? 'أين يرتبط بهذا الكيان؟'
    : 'كيف يظهر في الأمثلة؟';

  return `
    <section class="info-section">
      <h2>${titleMap[kind] || '📘 معنى العنصر واستخدامه'}</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">ما هو؟</div>
          <p>${linkUsageBridgeText(profile.what, {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">ما معناه؟</div>
          <p>${linkUsageBridgeText(profile.meaning, {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">كيف يُستخدم؟</div>
          <p>${linkUsageBridgeText(profile.usage, {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">${relationLabel}</div>
          <p>${linkUsageBridgeText(profile.exampleRole, {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">متى يكون صالحاً؟</div>
          <p>${linkUsageBridgeText(profile.validity, {currentItem: item})}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">متى يصبح خاطئاً؟</div>
          <p>${linkUsageBridgeText(profile.failure, {currentItem: item})}</p>
        </div>
      </div>
    </section>
  `;
}

function renderMembersMeaningSection(item) {
  if (!item?.members?.length) {
    return '';
  }

  return `
    <section class="members-section">
      <h2>🧠 معنى الأعضاء وكيف تُقرأ</h2>
      <div class="members-meaning-card-grid">
        ${item.members.map((member, index) => {
          const roleText = member.description || `يمثل الحقل ${member.name} جزءاً من بيانات ${item.name} التي ستقرأها Vulkan أو الدوال المرتبطة بهذه البنية.`;
          const exampleText = /^p[A-Z]/.test(member.name)
            ? 'غالباً يظهر كمؤشر إلى بيانات أو مصفوفة، لذلك يجب أن يتوافق مع نوع البيانات الحقيقي ومع عدد العناصر أو الـ stride المرتبط به.'
            : /Count$/.test(member.name)
              ? 'يظهر عادة مع مصفوفة أو حقل مؤشر آخر، ويجب أن يطابق عدد العناصر الفعلي حتى لا تُقرأ الذاكرة بشكل خاطئ.'
              : 'يظهر كحقل يحدد سلوك البنية أو يحمل قيمة مباشرة تعتمد عليها الدالة أو البنية التالية في السلسلة.';
          return `
            <article class="content-card prose-card parameter-detail-card members-meaning-card">
              <div class="parameter-card-head">
                <div class="parameter-card-order">العضو ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name parameter-card-code"><code>${member.name}</code></h3>
                  <div class="parameter-card-type-row">
                    <span class="parameter-card-type-label">النوع</span>
                    <div class="parameter-card-type">${renderTypeReference(member.type)}</div>
                  </div>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">وظيفته</div>
                  <div class="parameter-card-field-value">${roleText}</div>
                </div>
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">كيف يظهر في الأمثلة</div>
                  <div class="parameter-card-field-value">${exampleText}</div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function simplifyEnumOfficialDescription(item) {
  const name = String(item?.name || '');
  const raw = String(item?.description || '').replace(/^الوصف الرسمي:\s*/g, '').trim();
  const metadata = getEnumMetadata(name);
  const fallbackMeaning = buildEnumTypeMeaningFallback(name);

  const exactMap = {
    VkResult: 'رموز النتيجة التي تعيدها دوال Vulkan لتمييز النجاح، والحالات غير المكتملة، وأسباب الفشل.',
    VkStructureType: 'أنواع البنى التي تُكتب في الحقل sType حتى تتعرف دوال Vulkan على نوع البنية الممررة لها.',
    VkPresentModeKHR: 'أوضاع تقديم الصورة من Swapchain إلى Surface، وهي التي تحدد سلوك الانتظار وتمزق الصورة وزمن العرض.',
    VkAccelerationStructureCreateFlagBitsKHR: 'أعلام إضافية تضبط طريقة إنشاء بنية التسارع والخصائص الخاصة بها أثناء الإنشاء.'
  };

  if (exactMap[name]) {
    return exactMap[name];
  }

  const replacements = [
    ['Vulkan command return codes.', 'رموز النتيجة التي تعيدها أوامر ودوال Vulkan.'],
    ['Vulkan structure types ( sType ).', 'أنواع البنى التي تستخدم في الحقل sType داخل هياكل Vulkan.'],
    ['Presentation mode supported لـ a surface.', 'أوضاع العرض المدعومة على Surface.'],
    ['Presentation mode supported for a surface.', 'أوضاع العرض المدعومة على Surface.'],
    ['قناع أعلام يحدد معلمات إنشاء إضافية لـ بنية التسارع.', 'أعلام تحدد خيارات إضافية عند إنشاء بنية التسارع.'],
    ['Bitmask specifying additional creation parameters for an acceleration structure.', 'أعلام تحدد خيارات إضافية عند إنشاء بنية التسارع.'],
    ['Flag bits specifying additional creation parameters for an acceleration structure.', 'أعلام تحدد خيارات إضافية عند إنشاء بنية التسارع.']
  ];

  for (const [from, to] of replacements) {
    if (raw === from) {
      return to;
    }
  }

  const normalizedRaw = raw
    .replace(/\bdescribing the properties of\b/gi, 'يصف خصائص')
    .replace(/\bdescribing properties of\b/gi, 'يصف خصائص')
    .replace(/\bthat can be queried\b/gi, 'التي يمكن الاستعلام عنها')
    .replace(/\bproperties of\b/gi, 'خصائص')
    .replace(/\bproperty of\b/gi, 'خاصية')
    .replace(/\bdata graph pipeline\b/gi, 'خط أنابيب الرسم البياني للبيانات')
    .replace(/\bdata graph\b/gi, 'الرسم البياني للبيانات')
    .replace(/\bpipeline\b/gi, 'خط الأنابيب')
    .replace(/\bproperties\b/gi, 'خصائص')
    .replace(/\bproperty\b/gi, 'خاصية')
    .replace(/\s+/g, ' ')
    .trim();

  const queryablePropertyMatch = normalizedRaw.match(/^(?:تعداد\s+)?يصف\s+خصائص\s+(.+?)\s+التي يمكن الاستعلام عنها\.?$/);
  if (queryablePropertyMatch) {
    return `هذا التعداد يسمّي الخصائص التي سيطلبها الاستعلام من ${queryablePropertyMatch[1]}، فتقرأ Vulkan القيمة وتعيد الخاصية المطابقة لها.`;
  }

  if (/return codes/i.test(raw)) {
    return 'هذا التعداد يجمع رموز النتيجة التي تبيّن إن كان الاستدعاء نجح أو أعاد حالة خاصة أو فشل بسبب خطأ محدد.';
  }

  if (/structure types|sType/i.test(raw)) {
    return 'هذا التعداد يحدد نوع البنية التي ستقرأها دالة Vulkan من الحقل sType.';
  }

  if (/presentation mode|surface/i.test(raw)) {
    return 'هذا التعداد يحدد طريقة تقديم الصورة إلى Surface، مثل الانتظار مع VSync أو تقليل التأخير أو السماح بالتمزق.';
  }

  if (/flag|bitmask/i.test(raw) && /create|creation/i.test(raw)) {
    return 'هذا النوع من الأعلام يضيف خيارات إنشاء تغير سلوك الكائن أو المورد أثناء إنشائه.';
  }

  const cleanedRaw = raw
    .replace(/\s+/g, ' ')
    .replace(/[.؟!]+$/g, '')
    .trim();

  const strippedForEnglishCheck = stripVulkanTechnicalIdentifiers(cleanedRaw);
  const hasMixedEnglish = /[A-Za-z]{3,}/.test(strippedForEnglishCheck);

  if (!cleanedRaw || hasMixedEnglish || hasCorruptedLocalizedText(cleanedRaw)) {
    return sanitizeEnumNarrativeText(metadata?.meaning || '', fallbackMeaning);
  }

  return sanitizeEnumNarrativeText(cleanedRaw, fallbackMeaning);
}

function simplifyEnumUsageItems(item) {
  const name = String(item?.name || '');
  const values = getEnumValueRows(item);
  const usage = getUsageItems(item).filter((text) => !isMarginalUsageText(text));
  const simplified = [];

  usage.forEach((text) => {
    const clean = String(text || '').replace(/^الوصف الرسمي لهذا التعداد:\s*/g, '').trim();
    if (!clean) {
      return;
    }

    if (/While the core Vulkan API|Each value corresponds|elements of the .* array|توضح القيم المعرفة داخل/i.test(clean)) {
      return;
    }

    if (/createFlags/i.test(clean) && /AccelerationStructure/i.test(clean)) {
      simplified.push('تُستخدم هذه الأعلام داخل الحقل createFlags لاختيار خصائص إضافية عند إنشاء بنية التسارع.');
      return;
    }

    if (/pPresentModes/i.test(clean)) {
      simplified.push('تُعاد قيم هذا التعداد عند الاستعلام عن أوضاع العرض المدعومة، ثم تختار منها القيمة التي تناسب زمن الاستجابة أو جودة العرض المطلوبة.');
      return;
    }

    if (/sType/i.test(clean)) {
      simplified.push('كل قيمة في هذا التعداد تقابل بنية Vulkan محددة، لذلك يجب وضع القيمة المطابقة للبنية في الحقل sType قبل تمريرها إلى الدالة.');
      return;
    }

    if (/return codes/i.test(clean)) {
      simplified.push('تقرأ دوال Vulkan قيمة من هذا التعداد بعد الاستدعاء لمعرفة هل نجح التنفيذ أو أعاد حالة خاصة أو فشل بسبب خطأ.');
      return;
    }

    if (/properties?.+queried|الخصائص.+الاستعلام عنها|Property.+Query/i.test(clean)) {
      simplified.push(`اختر من ${name} الخاصية التي تريد من الدالة أو الاستعلام قراءتها فعلياً، لأن كل قيمة تمثل نوعاً مختلفاً من المعلومات التي يمكن طلبها.`);
      return;
    }

    if (isReadableLocalizedParagraph(clean)) {
      simplified.push(clean);
    }
  });

  if (!simplified.length) {
    if (name === 'VkResult') {
      simplified.push('افحص قيمة هذا التعداد بعد كل استدعاء يعيد VkResult لتقرر هل تتابع التنفيذ أو تعالج الخطأ أو الحالة الخاصة.');
    } else if (name === 'VkStructureType') {
      simplified.push('استخدم القيمة المطابقة لاسم البنية نفسها داخل الحقل sType، لأن دوال Vulkan تعتمد عليها لتفسير البنية بشكل صحيح.');
    } else if (name === 'VkPresentModeKHR') {
      simplified.push('اختر القيمة التي تناسب سلوك العرض المطلوب: تقليل التأخير، الالتزام مع VSync، أو تقليل احتمال تمزق الصورة.');
    } else if (/FlagBits|Flags/.test(name)) {
      simplified.push('اختر العلم أو مجموعة الأعلام التي تضبط السلوك المطلوب في الحقل أو البنية التي تستقبل هذا النوع.');
    } else {
      simplified.push(`اختر من ${name} القيمة التي تطابق السلوك الذي تريد أن تقرأه الدالة أو البنية المرتبطة به.`);
    }
  }

  if (values.length) {
    simplified.push(`يحتوي هذا التعداد على ${values.length} قيمة موثقة محلياً، وكل قيمة تغير السلوك الذي ستقرأه الدالة أو البنية التي تستخدمه.`);
  }

  return [...new Set(simplified)].slice(0, 3);
}

function renderEnumOfficialOverview(item) {
  const metadata = getEnumMetadata(item.name);
  const values = getEnumValueRows(item);
  const sampleValues = values.slice(0, 3).map((entry) => entry.name).join('، ');
  const valueSummary = values.length
    ? `كل قيمة داخل ${item.name} تعلن فرعاً تنفيذياً مختلفاً تقرؤه Vulkan في الحقل أو الاستدعاء المرتبط بهذا التعداد. من أمثلة ذلك ${sampleValues}${values.length > 3 ? ' ...' : ''}.`
    : `عند تمرير قيمة من ${item.name} لا تنظر Vulkan إلى الاسم النصي، بل إلى الرمز الموافق له لتحدد الفرع التنفيذي المطلوب في الحقل أو الدالة المرتبطة.`;

  return `
    <div class="info-grid">
      <div class="content-card prose-card">
        <div class="info-label" data-tooltip="يلخص ما الذي يمثله هذا التعداد برمجيًا داخل Vulkan." tabindex="0" aria-label="معناه البرمجي">معناه البرمجي</div>
        <p>${linkUsageBridgeText(metadata.meaning, {currentItem: item, preferredEnumName: item.name})}</p>
      </div>
      <div class="content-card prose-card">
        <div class="info-label" data-tooltip="يوضح السبب الهندسي أو التصميمي لوجود هذا التعداد في واجهة Vulkan." tabindex="0" aria-label="لماذا يوجد في الـ API؟">لماذا يوجد في الـ API؟</div>
        <p>${linkUsageBridgeText(metadata.apiPurpose, {currentItem: item, preferredEnumName: item.name})}</p>
      </div>
      <div class="content-card prose-card">
        <div class="info-label" data-tooltip="يبين الفائدة العملية من اختيار قيم هذا التعداد بدل أرقام أو حالات ضمنية." tabindex="0" aria-label="ما الفائدة منه؟">ما الفائدة منه؟</div>
        <p>${linkUsageBridgeText(inferReferenceBenefit(item, 'enum'), {currentItem: item, preferredEnumName: item.name})}</p>
      </div>
      <div class="content-card prose-card">
        <div class="info-label" data-tooltip="يشرح كيف تُقرأ قيم هذا التعداد عملياً عند تمريرها إلى الحقول أو الدوال." tabindex="0" aria-label="كيف تُفهم قيمه؟">كيف تُفهم قيمه؟</div>
        <p>${linkUsageBridgeText(valueSummary, {currentItem: item, preferredEnumName: item.name})}</p>
      </div>
    </div>
  `;
}

function renderEnumOfficialDescriptionSection(item, officialDescription, usageItems) {
  const metadata = getEnumMetadata(item.name);
  const primaryUsage = sanitizeEnumNarrativeText(
    usageItems[0] || '',
    `${renderAnalysisReference(item.name, item)} يظهر عندما تحتاج الدالة أو البنية إعلان الحالة التنفيذية أو النمط الرسمي الذي ستقرأه Vulkan في هذا الموضع، لا مجرد تمرير رقم صامت.`
  );

  return `
    <div class="content-card prose-card">
      <p><strong data-tooltip="هذا هو أقرب تلخيص عربي للوصف الرسمي للتعداد في الوثائق." tabindex="0" aria-label="الوصف بالعربي">الوصف بالعربي:</strong> ${linkUsageBridgeText(officialDescription || `لم يُحمّل الوصف الرسمي لـ ${item.name} بعد.`, {currentItem: item, preferredEnumName: item.name})}</p>
      <p><strong data-tooltip="يلخص المعنى البرمجي الحقيقي لهذا التعداد داخل Vulkan." tabindex="0" aria-label="المعنى">المعنى:</strong> ${linkUsageBridgeText(metadata.meaning, {currentItem: item, preferredEnumName: item.name})}</p>
      <p><strong data-tooltip="يبين أين وكيف يُمرر هذا التعداد داخل الدوال أو البنى التي تعتمد عليه." tabindex="0" aria-label="الاستخدام البرمجي">الاستخدام البرمجي:</strong> ${linkUsageBridgeText(primaryUsage, {currentItem: item, preferredEnumName: item.name})}</p>
      <p><strong data-tooltip="يوضح الفائدة العملية لاستخدام هذا التعداد والقيمة التي يضيفها إلى الكود." tabindex="0" aria-label="الفائدة البرمجية">الفائدة البرمجية:</strong> ${linkUsageBridgeText(inferReferenceBenefit(item, 'enum'), {currentItem: item, preferredEnumName: item.name})}</p>
    </div>
  `;
}

function renderEnumMeaningSection(item) {
  const values = getEnumValueRows(item);
  const functionUsage = findFunctionsUsingEnum(item.name);
  const structureUsage = findStructuresUsingEnum(item.name);
  const officialDescription = simplifyEnumOfficialDescription(item);
  const usageItems = simplifyEnumUsageItems(item);

  return `
    <section class="info-section">
      <h2 data-tooltip="${escapeAttribute(`يلخص هذا القسم الوصف الرسمي للتعداد ${item.name} ومعناه البرمجي واستعماله العملي.`)}" tabindex="0" aria-label="${escapeAttribute('الوصف الرسمي')}">📘 الوصف الرسمي</h2>
      ${renderEnumOfficialDescriptionSection(item, officialDescription, usageItems)}
      ${renderEnumOfficialOverview(item)}
      <div class="content-card prose-card">
        ${usageItems.map((text) => `<p>${linkUsageBridgeText(sanitizeEnumNarrativeText(text, buildEnumUsageFallback(item.name)), {currentItem: item, preferredEnumName: item.name})}</p>`).join('')}
      </div>
    </section>
    ${renderPracticalReferenceSection(item, 'enum')}
    ${functionUsage.length ? `
      <section class="info-section">
        <h2 data-tooltip="${escapeAttribute(`يوضح هذا القسم الدوال التي تستقبل ${item.name} فعلياً، وأين يدخل التعداد داخلها، ولماذا تحتاجه في هذا الموضع.`)}" tabindex="0" aria-label="${escapeAttribute(`تستخدم مع أي دالة: يوضح هذا القسم الدوال التي تستقبل ${item.name} فعلياً`)}">🔗 تستخدم مع أي دالة؟</h2>
        <table class="params-table">
          <thead>
            <tr>
              <th>الدالة</th>
              <th data-tooltip="شرح مختصر للعملية التي تنفذها هذه الدالة داخل Vulkan." tabindex="0" aria-label="ماذا تفعل الدالة؟">ماذا تفعل الدالة؟</th>
              <th data-tooltip="يوضح الحقل أو الموضع الذي يمرر فيه هذا التعداد داخل الدالة." tabindex="0" aria-label="أين يدخل التعداد؟">أين يدخل التعداد؟</th>
              <th data-tooltip="يبين لماذا تحتاج هذه الدالة إلى هذا التعداد في هذا الموضع تحديداً." tabindex="0" aria-label="لماذا تحتاجه هنا؟">لماذا تحتاجه هنا؟</th>
              <th data-tooltip="النتيجة العملية لاستخدام هذا التعداد داخل هذا الاستدعاء." tabindex="0" aria-label="الفائدة العملية">الفائدة العملية</th>
            </tr>
          </thead>
          <tbody>
            ${functionUsage.map((entry) => `
              <tr>
                <td>${renderRelatedReferenceLink(entry.name)}</td>
                <td>${renderPracticalText(entry.functionMeaning, `توضح هذه الدالة العملية العامة التي يدخل فيها ${item.name}.`, {currentItem: item, preferredEnumName: item.name})}</td>
                <td>${renderPracticalText(entry.location, `يظهر ${item.name} داخل هذه الدالة كقيمة أو حقل يحدد السلوك المطلوب.`, {currentItem: item, preferredEnumName: item.name})}</td>
                <td>${renderPracticalText(entry.parameterMeaning || entry.description, `يوضح هذا الموضع لماذا تحتاج الدالة إلى ${item.name} تحديداً داخل هذا الاستدعاء.`, {currentItem: item, preferredEnumName: item.name})}</td>
                <td>${renderPracticalText(entry.benefit, `الفائدة هنا أن ${item.name} يجعل اختيار السلوك أو الحالة داخل هذه الدالة صريحاً وقابلاً للفهم.`, {currentItem: item, preferredEnumName: item.name})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    ` : ''}
    ${structureUsage.length ? `
      <section class="info-section">
        <h2 data-tooltip="${escapeAttribute(`يوضح هذا القسم البنى والحقول التي تستقبل ${item.name} كقيمة، وكيف تقرأه Vulkan داخل هذه البنى.`)}" tabindex="0" aria-label="${escapeAttribute(`الحقول والبنى التي تستقبله: يوضح هذا القسم البنى والحقول التي تستقبل ${item.name}`)}">${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} الحقول والبنى التي تستقبله</h2>
        <table class="params-table">
          <thead>
            <tr>
              <th data-tooltip="البنية المالكة التي يظهر داخلها هذا التعداد كحقل أو كقيمة تؤثر في السلوك." tabindex="0" aria-label="البنية">البنية</th>
              <th data-tooltip="اسم الحقل داخل البنية الذي يستقبل هذا التعداد أو يقرأ قيمته." tabindex="0" aria-label="الحقل">الحقل</th>
              <th data-tooltip="يشرح الدور العملي لهذا التعداد داخل هذا الحقل، وما الذي يغيّره في سلوك البنية أو الدالة التي تقرأها." tabindex="0" aria-label="كيف يُستخدم فيها؟">كيف يُستخدم فيها؟</th>
            </tr>
          </thead>
          <tbody>
            ${structureUsage.map((entry) => `
              <tr>
                <td>${renderRelatedReferenceLink(entry.structureName)}</td>
                <td>${renderFieldReference(entry.fieldName, entry.structureName)}</td>
                <td>${renderPracticalText(entry.description, `يوضع ${item.name} في الحقل ${entry.fieldName} داخل ${entry.structureName} لتحديد السلوك العملي الذي ستقرأه Vulkan من هذه البنية.`, {currentItem: item, preferredEnumName: item.name})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    ` : ''}
  `;
}

function getEnumCoreRelationEntries(item) {
  const enumName = String(item?.name || '');
  const entries = [];
  const seen = new Set();
  const addEntry = (name, relation, description) => {
    const key = `${name}|${relation}`;
    if (!name || seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push({name, relation, description});
  };

  getEnumRelatedTypeNames(enumName)
    .filter((name) => name !== enumName && findItemInCategories(vulkanData.enums, name))
    .forEach((name) => {
      const relation = /FlagBits/.test(enumName) && /Flags/.test(name)
        ? 'النوع الجامع'
        : /Flags/.test(enumName) && /FlagBits/.test(name)
          ? 'القيم المفردة'
          : 'تعداد مرتبط';
      const description = relation === 'النوع الجامع'
        ? `يُستخدم ${name} عندما تُجمع عدة قيم من ${enumName} في متغير واحد أو حقل flags.`
        : relation === 'القيم المفردة'
          ? `يعرض ${name} القيم المفردة التي يمكن دمجها لتكوين قيمة من ${enumName}.`
          : `${name} مرتبط بهذا التعداد في نفس عائلة الاستخدام أو نفس الحقول.`;
      addEntry(name, relation, description);
    });

  (item?.seeAlso || [])
    .filter((name) => findItemInCategories(vulkanData.enums, name) || findConstantItemByName(name))
    .forEach((name) => {
      const description = findItemInCategories(vulkanData.enums, name)
        ? `يظهر ${name} مع ${enumName} في نفس السياق أو في دوال وبنى مترابطة.`
        : `القيمة ${name} من العناصر الرسمية التي تُستخدم مع ${enumName} أو تمثل حالة مهمة منه.`;
      addEntry(name, findItemInCategories(vulkanData.enums, name) ? 'تعداد مرتبط' : 'قيمة مرتبطة', description);
    });

  getEnumValueRows(item).slice(0, 8).forEach((valueEntry) => {
    addEntry(
      valueEntry.name,
      'قيمة من هذا التعداد',
      valueEntry.usage || valueEntry.meaning || `استخدم ${valueEntry.name} عندما تريد السلوك الذي تمثله هذه القيمة داخل ${enumName}.`
    );
  });

  return entries;
}

function renderEnumCoreRelationsSection(item) {
  const entries = getEnumCoreRelationEntries(item);
  const relatedStructureBlocks = buildEnumRelatedStructureBlocks(item);
  if (!entries.length) {
    return relatedStructureBlocks;
  }

  return `
    <section class="info-section">
      <h2>🧩 التعدادات والعناصر الأساسية المرتبطة</h2>
      <div class="info-grid">
        ${entries.map((entry) => `
          <div class="content-card prose-card">
            <div class="info-label">${entry.relation}</div>
            <div class="see-also-links">
              ${renderProjectReferenceChip(entry.name, {currentItem: item, preferredEnumName: item.name})}
            </div>
            <p>${linkUsageBridgeText(entry.description, {currentItem: item, preferredEnumName: item.name})}</p>
          </div>
        `).join('')}
      </div>
    </section>
    ${relatedStructureBlocks}
  `;
}

function groupEnumStructureUsage(enumName, limit = Infinity) {
  const grouped = [];
  const seen = new Set();
  findStructuresUsingEnum(enumName, 24).forEach((entry) => {
    if (seen.has(entry.structureName)) {
      return;
    }
    const structure = findItemInCategories(vulkanData.structures, entry.structureName);
    if (!structure) {
      return;
    }
    seen.add(entry.structureName);
    grouped.push({
      structure,
      matchedField: entry.fieldName
    });
  });
  return Number.isFinite(limit) ? grouped.slice(0, limit) : grouped;
}

function buildEnumStructureComment(field, structureName, enumName, matchedField) {
  const metadata = getFieldMetadata(field.name, structureName, field.description || '', field.type || '');
  if (field.name === matchedField) {
    return toInlineArabicComment(metadata.inline)
      || toInlineArabicComment(metadata.usage)
      || toInlineArabicComment(metadata.meaning)
      || field.description
      || `هذا هو الحقل الذي يستخدم ${enumName} داخل ${structureName} لتحديد السلوك أو الحالة المرتبطة بهذا التعداد.`;
  }

  if (field.name === 'sType') {
    return toInlineArabicComment(metadata.inline) || 'يحدد نوع البنية حتى تتعرف دوال Vulkan على أن البيانات الممررة من هذا النوع.';
  }

  if (field.name === 'pNext') {
    return toInlineArabicComment(metadata.inline) || 'يربط أي بنى امتدادية إضافية إذا احتاج هذا المسار حقولاً موسعة خارج البنية الأساسية.';
  }

  return metadata.inline || metadata.usage || metadata.meaning || field.description || `حقل ضمن ${structureName} تحتاجه الدالة لفهم كامل بيانات البنية.`;
}

function buildEnumRelatedStructureSnippet(structure, enumName, matchedField) {
  const fields = getStructureFieldRows(structure);
  if (!fields.length) {
    return '';
  }

  const lines = [`typedef struct ${structure.name} { // ${structure.description || `بنية مرتبطة بـ ${enumName}`}`];
  fields.forEach((field) => {
    const type = field.type || 'void*';
    const comment = buildEnumStructureComment(field, structure.name, enumName, matchedField);
    lines.push(`    ${type.padEnd(32, ' ')} ${field.name}; // ${comment}`);
  });
  lines.push(`} ${structure.name};`);
  return lines.join('\n');
}

function buildEnumRelatedStructureBlocks(item) {
  const groups = groupEnumStructureUsage(item.name, 2);
  if (!groups.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} كيف يظهر داخل البنى المرتبطة</h2>
      ${groups.map(({structure, matchedField}) => `
        <div class="content-card prose-card">
          <div class="info-label">${renderProjectReferenceChip(structure.name)}</div>
          <p>هذا المثال يوضح كيف يظهر ${renderProjectReferenceChip(item.name)} داخل البنية ${renderProjectReferenceChip(structure.name)}، وما وظيفة كل سطر مهم فيها.</p>
        </div>
        <div class="code-container">
          <pre class="code-block"><code class="language-cpp">${formatExampleWithLinks(buildEnumRelatedStructureSnippet(structure, item.name, matchedField))}</code></pre>
        </div>
      `).join('')}
    </section>
  `;
}

function renderValueMeaningSection(item, kind = 'constant') {
  const profile = inferReferenceProfile(item, kind);
  const value = item?.value || item?.syntax || item?.name || '';
  const specialText = item?.name === 'VK_NULL_HANDLE'
    ? 'عندما يظهر هذا الثابت في التعليقات أو التعليمات، فالمقصود ليس مجرد قيمة صفرية، بل حالة رسمية في فولكان تعني أن متغير المقبض لا يشير حالياً إلى أي كائن أنشأته الواجهة.'
    : '';
  const leadText = kind === 'macro'
    ? inferMacroPracticalMeaning(item)
    : (profile.meaning || item.description || `${item.name} عنصر معرف في فولكان.`);
  const valueLine = value
    ? (kind === 'macro'
      ? `إذا ظهر ${item.name} في التعليمات أو الأمثلة، فالمطلوب فهم النص أو القيمة أو التعريف الذي سينتجه بعد المعالجة المسبقة. الصيغة الرسمية التي يراها المترجم هي ${renderVulkanHighlightedInlineCode(value)}.`
      : `إذا ظهر ${item.name} في التعليمات أو التعليقات أو الأمثلة، فالمقصود هو هذه القيمة الرسمية تحديداً: ${renderVulkanHighlightedInlineCode(value)}.`)
    : (kind === 'macro'
      ? `إذا ظهر ${item.name} في التعليمات أو الأمثلة، فالمطلوب فهم النص أو القيمة أو التعريف الذي سينتجه بعد المعالجة المسبقة، لا التعامل معه كدالة تعمل وقت التشغيل.`
      : `إذا ظهر ${item.name} في التعليمات أو التعليقات أو الأمثلة، فالمقصود هو هذا الثابت الرسمي نفسه داخل فولكان.`);
  return `
    <section class="info-section">
      <h2>🧠 معنى القيمة وكيف تُقرأ</h2>
      <div class="content-card prose-card">
        <p>${linkUsageBridgeText(leadText, {currentItem: item})}</p>
        <p>${valueLine}</p>
        ${specialText ? `<p>${linkUsageBridgeText(specialText, {currentItem: item})}</p>` : ''}
      </div>
    </section>
  `;
}

function inferReferenceIntent(item, kind = 'constant') {
  const name = String(item?.name || '');
  const description = String(item?.description || '');
  const usageItems = getUsageItems(item);
  const haystack = [name, description, ...usageItems].join(' ');

  if (kind === 'structure') {
    return inferStructureRole(item).intent;
  }

  if (/PRESENT|Swapchain|swapchain|Display|Surface|عرض|شاشة|تقديم/.test(haystack)) {
    return 'عندما يختار المبرمج هذا العنصر فهو يقصد التحكم في كيفية وصول الصورة إلى الشاشة أو كيف يتعامل Vulkan مع مسار العرض والتقديم.';
  }
  if (/COLOR|Color|FORMAT|Format|SRGB|لون|ألوان|تنسيق/.test(haystack)) {
    return 'عندما يستخدم المبرمج هذا العنصر فهو يحدد كيف تُفسَّر البيانات اللونية أو بأي تنسيق ستُخزن القيم داخل الصورة أو المرفق.';
  }
  if (/LAYOUT|Layout|تخطيط/.test(haystack)) {
    return 'استخدام هذا العنصر يعني أن المبرمج يريد وضع الصورة أو المورد في حالة مناسبة لعملية محددة مثل النسخ أو الرسم أو العرض.';
  }
  if (/STAGE|Stage|ACCESS|Access|Barrier|حاجز|مزامنة/.test(haystack)) {
    return 'اختيار هذا العنصر يعني أن المبرمج يحدد نقطة المزامنة أو نوع الوصول الذي يجب أن يحترمه Vulkan قبل متابعة التنفيذ.';
  }
  if (/SHADER|Shader|تظليل|مظل/.test(haystack)) {
    return 'المبرمج يستخدم هذا العنصر ليحدد مرحلة الشيدر أو كيفية ربط الموارد المرتبطة بالتظليل داخل الـ pipeline.';
  }
  if (/SAMPLE|Multisample|عينات|أخذ العينات/.test(haystack)) {
    return 'استخدام هذا العنصر يعني أن المبرمج يحدد جودة أخذ العينات أو عدد العينات لكل بكسل وما يترتب عليه من جودة وأداء.';
  }
  if (/STRUCTURE_TYPE|sType|بنية|هيكل/.test(haystack)) {
    return 'المقصود البرمجي هنا هو تعريف نوع البنية التي ستقرأها دالة Vulkan، حتى لا تفسر الذاكرة الممررة على أنها بنية مختلفة.';
  }
  if (/VERSION|إصدار/.test(haystack)) {
    return 'المبرمج يستخدم هذا العنصر ليحدد إصدار API أو ليبني رقماً معيارياً يعبر عن الإصدار المطلوب أو المدعوم.';
  }
  if (name === 'VK_NULL_HANDLE') {
    return 'المقصود البرمجي هنا هو التعبير الصريح عن أن المتغير لا يشير حالياً إلى أي كائن Vulkan صالح.';
  }
  if (kind === 'macro') {
    return inferMacroPracticalUsage(item);
  }
  if (kind === 'enum') {
    return 'اختيار هذا التعداد أو إحدى قيمه يعني أن المبرمج يريد ضبط سلوك محدد داخل الحقل أو الدالة التي تستقبله، وليس مجرد وضع اسم رمزي داخل الكود.';
  }

  return 'استخدام هذا العنصر في الكود يعني اختيار معنى برمجي صريح تقرأه واجهة Vulkan لتحديد السلوك أو الحالة أو القيمة الخاصة المطلوبة في هذا الموضع.';
}

function inferReferenceCodeEffect(item, kind = 'constant') {
  const name = String(item?.name || '');
  const usageItems = getUsageItems(item);
  const description = String(item?.description || '');
  const haystack = [name, description, ...usageItems].join(' ');

  if (kind === 'structure') {
    const role = inferStructureRole(item);
    return `تأثير ${name} في الكود أنه يحدد كيف ستُفسِّر الدالة مجموعة الحقول الممررة معها، لذلك أي تغيير في قيمه يغيّر الطلب أو الوصف أو النتيجة التي سيبنى عليها التنفيذ. ${role.failure}`;
  }

  if (/PRESENT|Swapchain|swapchain|Display|Surface|عرض|شاشة|تقديم/.test(haystack)) {
    return 'تأثيره في الكود أنه يغير سلوك العرض: هل الصورة ستُقدَّم للشاشة، كيف تُكتسب من سلسلة التبديل، أو كيف يُفسَّر مسار العرض من النظام.';
  }
  if (/COLOR|Color|FORMAT|Format|SRGB|لون|ألوان|تنسيق/.test(haystack)) {
    return 'تأثيره في الكود أنه يغيّر تفسير البيانات الثنائية كألوان أو قنوات أو تنسيق صورة، وبالتالي ينعكس مباشرة على النتيجة المرئية وجودة التوافق مع الشاشة أو المرفق.';
  }
  if (/LAYOUT|Layout|تخطيط/.test(haystack)) {
    return 'تأثيره في الكود أنه يحدد الحالة التي يجب أن تكون عليها الصورة أو الذاكرة قبل تنفيذ أمر معين، وأي قيمة مختلفة قد تجعل الانتقال أو النسخ أو العرض غير صحيح.';
  }
  if (/STAGE|Stage|ACCESS|Access|Barrier|حاجز|مزامنة/.test(haystack)) {
    return 'تأثيره في الكود أنه يحدد أين يتوقف التنفيذ مؤقتاً وما نوع القراءة أو الكتابة التي يجب أن تكتمل قبل السماح للخطوة التالية بالمتابعة.';
  }
  if (/SHADER|Shader|تظليل|مظل/.test(haystack)) {
    return 'تأثيره في الكود أنه يربط الموارد أو التعليمات بمرحلة شيدر معينة، وبالتالي يحدد أي جزء من الـ pipeline سيستخدم هذا المورد أو الأمر.';
  }
  if (/SAMPLE|Multisample|عينات|أخذ العينات/.test(haystack)) {
    return 'تأثيره في الكود أنه يحدد عدد العينات والجودة البصرية، ويؤثر مباشرة على استهلاك الذاكرة وكلفة الرسم.';
  }
  if (/STRUCTURE_TYPE|sType|بنية|هيكل/.test(haystack)) {
    return 'تأثيره في الكود أنه يجعل دالة Vulkan قادرة على التعرف على نوع البنية الممررة والتحقق من أن الحقول المقروءة تخص هذا النوع فعلاً.';
  }
  if (/VERSION|إصدار/.test(haystack)) {
    return 'تأثيره في الكود أنه يحدد الإصدار الذي ستستهدفه أو تقارنه، وبالتالي قد يفتح أو يغلق ميزات ومزايا معينة داخل API.';
  }
  if (name === 'VK_NULL_HANDLE') {
    return 'تأثيره في الكود أنه يجعل الشرط أو التهيئة يميز بوضوح بين وجود كائن Vulkan صالح وبين عدم وجوده.';
  }
  if (kind === 'macro') {
    return inferMacroPracticalEffect(item);
  }

  return 'تأثيره في الكود أنه يغيّر السلوك الذي ستقرأه Vulkan من السطر أو الحقل الحالي، لذلك استخدام قيمة أخرى قد ينتج مسار تنفيذ مختلفاً.';
}

function inferReferenceBenefit(item, kind = 'constant') {
  const name = String(item?.name || '');
  const usageItems = getUsageItems(item);
  const description = String(item?.description || '');
  const haystack = [name, description, ...usageItems].join(' ');

  if (kind === 'structure') {
    const relatedFunctions = findFunctionsUsingStructure(name, 4);
    return relatedFunctions.length
      ? `الفائدة العملية هي أن ${name} يجمع كل ما تحتاجه الدالة المرتبطة في بنية واحدة واضحة، فتفهم Vulkan الطلب كاملاً من دون توزيع المعلومات على بارامترات كثيرة أو قيم متفرقة.`
      : `الفائدة العملية هي أن ${name} يجعل معنى الطلب أو الوصف أو النتيجة صريحاً ومجمعاً في بنية واحدة يسهل تعبئتها ومراجعتها والتحقق منها.`;
  }

  if (/Property|properties|خصائص|queried|الاستعلام عنها|QueryResult|Query/i.test(haystack)) {
    return 'الفائدة العملية هي أن التطبيق يطلب خاصية محددة بالاسم بدل الاعتماد على ترتيب أو تخمين ضمني، فيعرف بالضبط أي معلومة سيعيدها الاستعلام أو الدالة.';
  }

  if (/PRESENT|Swapchain|swapchain|Display|Surface|عرض|شاشة|تقديم/.test(haystack)) {
    return 'الفائدة العملية هي جعل مسار العرض واضحاً ومتوافقاً مع السطح أو الشاشة، وتجنب سلوك عرض غير متوقع أو الحاجة إلى تخمينات داخل الكود.';
  }
  if (/COLOR|Color|FORMAT|Format|SRGB|لون|ألوان|تنسيق/.test(haystack)) {
    return 'الفائدة العملية هي الحصول على تفسير صحيح للون أو التنسيق، مما يمنع أخطاء مثل الألوان الخاطئة أو التوافق غير الصحيح مع المرفقات والشاشات.';
  }
  if (/LAYOUT|Layout|تخطيط/.test(haystack)) {
    return 'الفائدة العملية هي ضمان أن المورد في الحالة الصحيحة قبل الاستخدام، مما يقلل أخطاء التحقق ويمنع الوصول غير الصحيح إلى الصور.';
  }
  if (/STAGE|Stage|ACCESS|Access|Barrier|حاجز|مزامنة/.test(haystack)) {
    return 'الفائدة العملية هي تحقيق مزامنة دقيقة: لا توقف أكثر من اللازم، ولا تسمح بقراءة أو كتابة مبكرة قد تكسر صحة التنفيذ.';
  }
  if (/SHADER|Shader|تظليل|مظل/.test(haystack)) {
    return 'الفائدة العملية هي توجيه المورد أو الأمر إلى المرحلة الصحيحة من التظليل، وهذا يحسن وضوح الـ pipeline ويمنع ربط الموارد في موضع خاطئ.';
  }
  if (/SAMPLE|Multisample|عينات|أخذ العينات/.test(haystack)) {
    return 'الفائدة العملية هي التحكم بالتوازن بين الجودة البصرية وكلفة الأداء بدلاً من الاعتماد على إعداد غامض أو افتراضي.';
  }
  if (/STRUCTURE_TYPE|sType|بنية|هيكل/.test(haystack)) {
    return 'الفائدة العملية هي أن الاستدعاء يصبح قابلاً للتحقق والفهم من قبل السائق وطبقات التحقق، لأن نوع البنية يصبح صريحاً وغير ملتبس.';
  }
  if (/VERSION|إصدار/.test(haystack)) {
    return 'الفائدة العملية هي كتابة كود صريح بشأن الإصدار المستهدف أو المدعوم، مما يبسط التوافق وفحص الميزات.';
  }
  if (name === 'VK_NULL_HANDLE') {
    return 'الفائدة العملية من هذا الثابت هي توفير قيمة موحدة وواضحة لتمثيل غياب مقبض صالح، مما يسمح بتهيئة المقابض بطريقة آمنة قبل إنشاء الكائنات الفعلية في فولكان.';
  }
  if (kind === 'macro') {
    return inferMacroPracticalBenefit(item);
  }

  return 'الفائدة العملية هي جعل نية المبرمج واضحة، وتقليل الاعتماد على أرقام أو تعابير مبهمة، وربط السلوك مباشرة بعنصر معروف في Vulkan.';
}

function inferReferencePracticalSummary(item, kind = 'constant') {
  const name = String(item?.name || '');
  const usageItems = getUsageItems(item);
  const firstUsage = usageItems[0] || '';
  const description = String(item?.description || '');
  const haystack = [name, description, firstUsage].join(' ');

  if (kind === 'structure') {
    const role = inferStructureRole(item);
    const lead = trimLeadingTypeName(getStructureLeadDescription(item) || role.meaning || description, name);
    return `الخلاصة: ${lead || `${name} بنية Vulkan عملية`}؛ تعبئتها هي التي تحدد ما الذي ستفهمه الدالة من هذا الطلب أو الوصف أو الاستعلام.`;
  }

  if (/PRESENT|Swapchain|swapchain|Display|Surface|عرض|شاشة|تقديم/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تريد التحكم في ما يتصل بالشاشة أو التقديم أو سلسلة التبديل، لأنه يغيّر كيف تصل النتيجة النهائية إلى العرض.';
  }
  if (/COLOR|Color|FORMAT|Format|SRGB|لون|ألوان|تنسيق/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تريد تحديد شكل البيانات اللونية أو التنسيق الذي سيُقرأ أو يُكتب، لأن ذلك يحدد كيف تظهر النتيجة أو كيف تُفسَّر في الذاكرة.';
  }
  if (/LAYOUT|Layout|تخطيط/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تحتاج وضع الصورة في الحالة الصحيحة لعملية نسخ أو رسم أو عرض، لأن القيمة هنا تتحكم في صحة استخدام المورد.';
  }
  if (/STAGE|Stage|ACCESS|Access|Barrier|حاجز|مزامنة/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تريد وصف نقطة المزامنة أو نوع الوصول بوضوح، لأن ذلك يؤثر مباشرة في ترتيب التنفيذ وصحته.';
  }
  if (/SHADER|Shader|تظليل|مظل/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تريد تحديد مرحلة التظليل أو ربط مورد بالشيدر المناسب، لأن اختياره يغيّر أي جزء من الـ pipeline سيستخدمه.';
  }
  if (/SAMPLE|Multisample|عينات|أخذ العينات/.test(haystack)) {
    return 'الخلاصة: استخدمه عندما تريد اختيار مستوى الجودة البصرية أو عدد العينات، لأن القيمة هنا تؤثر في الجودة والأداء معاً.';
  }
  if (name === 'VK_NULL_HANDLE') {
    return 'الخلاصة: استخدمه عندما تريد التعبير صراحة عن أن المقبض غير مرتبط بكائن صالح بعد أو أنه أُعيد إلى حالة الغياب بعد التدمير.';
  }
  if (kind === 'macro') {
    return inferMacroPracticalSummary(item);
  }
  return 'الخلاصة: استخدمه عندما تريد أن تكون نية السطر البرمجي واضحة ومتصلة مباشرة بالمعنى الذي تفهمه واجهة Vulkan.';
}

function renderPracticalReferenceSection(item, kind = 'constant') {
  return `
    <section class="info-section">
      <h2 data-tooltip="${escapeAttribute('يلخص هذا القسم كيف يُستخدم الكيان عملياً داخل الكود: ما المقصود به، ما أثره، وما الفائدة الهندسية من اختياره.')}" tabindex="0" aria-label="${escapeAttribute('الاستخدام العملي')}">🛠️ الاستخدام العملي</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="يوضح النية البرمجية الفعلية وراء اختيار هذا الكيان في هذا الموضع." tabindex="0" aria-label="ماذا يقصد المبرمج؟">ماذا يقصد المبرمج؟</div>
          <p>${renderPracticalText(inferReferenceIntent(item, kind), 'يوضح هذا الحقل المقصود البرمجي من اختيار الكيان.')}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="يبين ما الذي يتغير في السلوك أو في مسار التنفيذ عند استخدام هذا الكيان." tabindex="0" aria-label="ما تأثيره في الكود؟">ما تأثيره في الكود؟</div>
          <p>${renderPracticalText(inferReferenceCodeEffect(item, kind), 'يوضح هذا الحقل أثر الكيان في التنفيذ.')}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="يشرح الفائدة العملية أو الهندسية التي يحصل عليها التطبيق عند استخدام هذا الكيان." tabindex="0" aria-label="ما الفائدة؟">ما الفائدة؟</div>
          <p>${renderPracticalText(inferReferenceBenefit(item, kind), 'يوضح هذا الحقل الفائدة العملية للكيان.')}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label" data-tooltip="يجمع المعنى والفائدة والأثر التنفيذي في خلاصة قصيرة وسريعة." tabindex="0" aria-label="تلخيص سريع">تلخيص سريع</div>
          <p>${renderPracticalText(inferReferencePracticalSummary(item, kind), 'يلخص هذا الحقل الاستخدام العملي للكيان.')}</p>
        </div>
      </div>
    </section>
  `;
}

function isGenericStructureUsageText(text) {
  return /^يُستخدم\s+Vk[A-Za-z0-9_]+\s+كهيكل إعدادات أو بيانات وسيطة/.test(String(text || '').trim())
    || /^غالباً تبدأ طريقة استخدامه بتهيئة الحقول إلى الصفر/.test(String(text || '').trim());
}

function getStructureLeadDescription(item) {
  const description = String(item?.description || '').trim();
  if (
    description &&
    !/^هيكل بيانات من Vulkan يُستخدم لتمرير إعدادات أو استقبال نتائج من الدوال/.test(description)
  ) {
    return description;
  }

  const usageItems = getUsageItems(item).filter((text) => !isMarginalUsageText(text) && !isGenericStructureUsageText(text));
  return usageItems[0] || '';
}

function inferStructureRole(item) {
  const name = String(item?.name || '');
  const usageItems = getUsageItems(item);
  const description = String(item?.description || '');
  const relatedFunctions = getRelatedFunctionNames(item);

  if (/^VkAabbPositions(KHR|NV)?$/.test(name)) {
    return {
      label: 'بنية حدود AABB',
      meaning: `${name} بنية تحمل الإحداثيات الدنيا والعليا لصندوق محاذٍ للمحاور (AABB)، أي أنها تصف الحجم الهندسي الذي سيُستخدم كحدود مكانية داخل مسارات مثل بنى التسارع.`,
      intent: 'المبرمج يملأ قيم min و max على المحاور الثلاثة ليصف حجم الجسم أو المنطقة في الفضاء، بحيث تستطيع Vulkan أو خوارزميات ray tracing التعامل معه كحجم محاط بحدود واضحة.',
      validity: 'تصبح صالحة عندما تكون القيم الدنيا أقل من أو مساوية للقيم العليا على كل محور، وعندما تكون جميع الإحداثيات مكتوبة في نفس الفضاء المرجعي المتوقع.',
      failure: 'إذا كانت الحدود مقلوبة أو مكتوبة في فضاء غير صحيح فسيمثل الصندوق حجماً خاطئاً، وقد تنشأ عنه نتائج تقاطع أو بناء هندسي غير دقيقة.'
    };
  }

  if (/^VkAccelerationStructureBuildSizesInfoKHR$/.test(name)) {
    return {
      label: 'بنية أحجام بنية التسارع',
      meaning: `${name} بنية تستقبل الأحجام المطلوبة لبناء أو تحديث بنية التسارع، أي حجم الكائن نفسه وحجم مساحة scratch المؤقتة اللازمة لكل مسار عمل.`,
      intent: 'المبرمج يمررها إلى دالة حساب الأحجام حتى يعرف مسبقاً كم ذاكرة يجب تخصيصها لبنية التسارع نفسها، وكم ذاكرة مؤقتة يحتاجها البناء أو التحديث قبل تنفيذ العملية.',
      validity: 'تصبح صالحة عندما تكتب الدالة القيم الفعلية فيها بناءً على نوع البنية والهندسة وأسلوب البناء أو التحديث المطلوب.',
      failure: 'إذا فُهمت هذه القيم على أنها اختيارية أو خُمّنت يدوياً فقد يُخصَّص حجم غير كافٍ، مما يؤدي إلى فشل الإنشاء أو البناء أو إلى استخدام غير صحيح للذاكرة المؤقتة.'
    };
  }

  if (/^VkAccelerationStructureBuildGeometryInfoKHR$/.test(name)) {
    return {
      label: 'بنية وصف بناء بنية التسارع',
      meaning: `${name} بنية تصف عملية بناء أو تحديث بنية التسارع نفسها: نوعها، والهندسة التي ستدخل فيها، ومصدر التحديث ووجهته، ومساحة scratch التي ستستخدم أثناء التنفيذ.`,
      intent: 'المبرمج يملأ هذه البنية قبل أوامر build أو update ليحدد للدالة أو الأمر ما الذي سيُبنى، ومن أي هندسة، وهل العملية بناء جديد أم تحديث، وأين توجد مساحة العمل المؤقتة.',
      validity: 'تصبح صالحة عندما تتطابق حقول النوع والهندسة والمصدر والوجهة وscratch مع المسار الذي تريد تنفيذه فعلياً.',
      failure: 'أي عدم تطابق بين وضع البناء والهندسة الممررة أو مساحة scratch أو بنية التسارع الوجهة يجعل البناء أو التحديث يفشل أو ينتج بنية غير صالحة.'
    };
  }

  if (/^VkAccelerationStructureBuildRangeInfoKHR$/.test(name)) {
    return {
      label: 'بنية نطاق بناء بنية التسارع',
      meaning: `${name} تحدد نطاق العناصر الذي سيُبنى من كل هندسة، مثل عدد primitives والإزاحات والفهرس الأول والتحويل المرتبط بها.`,
      intent: 'المبرمج يستخدمها ليحدد للدالة أي جزء من البيانات الهندسية سيدخل فعلياً في بناء بنية التسارع، لا مجرد وصف الهندسة بصورتها الخام.',
      validity: 'تصبح صالحة عندما تطابق العدادات والإزاحات المحتوى الحقيقي للمخازن والبيانات الهندسية المرتبطة بها.',
      failure: 'العدادات أو الإزاحات الخاطئة تجعل البناء يقرأ جزءاً خاطئاً من البيانات أو يتجاوز الحدود الصحيحة للمخزن.'
    };
  }

  if (/^VkAccelerationStructureCreateInfo(KHR|NV)$/.test(name)) {
    return {
      label: 'بنية إنشاء بنية التسارع',
      meaning: `${name} تحدد كيف سيُنشأ كائن بنية التسارع نفسه، مثل المخزن الذي سيحتويه، وحجمه، ونوعه، والخيارات الخاصة بإنشائه.`,
      intent: 'المبرمج يجهزها قبل دالة الإنشاء ليحدد موضع بنية التسارع في الذاكرة وكيف ستُعامل ككائن Vulkan فعلي.',
      validity: 'تصبح صالحة عندما يطابق الحجم والمخزن والنوع والرايات ما تم حسابه مسبقاً وما يتطلبه المسار الذي سيبني بنية التسارع.',
      failure: 'أي خطأ في المخزن أو الحجم أو النوع يجعل كائن بنية التسارع غير قابل للإنشاء أو غير قابل للاستخدام لاحقاً.'
    };
  }

  if (/^VkAccelerationStructureGeometryAabbsDataKHR$/.test(name)) {
    return {
      label: 'بنية بيانات AABB لبنية التسارع',
      meaning: `${name} تحدد مكان بيانات صناديق AABB في الذاكرة والمسافة بين عنصر وآخر، حتى يمكن استخدام هذه الأحجام كمدخلات هندسية لبناء بنية التسارع.`,
      intent: 'المبرمج يربط عبرها مخزن أو عنوان بيانات AABB مع stride الصحيح، بحيث تقرأ Vulkan حدود كل صندوق بالترتيب المناسب أثناء البناء.',
      validity: 'تصبح صالحة عندما يشير data إلى مصفوفة AABB فعلية ويطابق stride المسافة الحقيقية بين عنصرين متتاليين.',
      failure: 'إذا كان العنوان أو stride خاطئاً فستقرأ Vulkan حدوداً غير صحيحة أو بيانات غير متوافقة مع شكل AABB المتوقع.'
    };
  }

  if (/^VkAccelerationStructureGeometryTrianglesDataKHR$/.test(name)) {
    return {
      label: 'بنية بيانات مثلثات لبنية التسارع',
      meaning: `${name} تصف أين توجد رؤوس المثلثات وفهارسها وتحويلها في الذاكرة، وبأي تنسيق ومسافات stride ستُقرأ هذه البيانات أثناء بناء بنية التسارع.`,
      intent: 'المبرمج يستخدمها لربط بيانات المثلثات الفعلية بمسار ray tracing، بحيث تعرف Vulkan كيف تقرأ الرؤوس والفهارس والتحويلات من المخازن أو العناوين الممررة.',
      validity: 'تصبح صالحة عندما تتوافق تنسيقات الرؤوس والفهارس والعناوين والـ stride مع البيانات الفعلية الموجودة في الذاكرة.',
      failure: 'أي عدم تطابق بين التنسيق أو العنوان أو الـ stride وبين البيانات الحقيقية يؤدي إلى قراءة هندسة خاطئة أو بناء غير صحيح.'
    };
  }

  if (/^VkAccelerationStructureGeometryInstancesDataKHR$/.test(name)) {
    return {
      label: 'بنية بيانات instances لبنية التسارع',
      meaning: `${name} تحدد أين توجد بيانات instances في الذاكرة، وهل تُقرأ كمصفوفة هياكل مباشرة أم كمصفوفة مؤشرات إلى instances.`,
      intent: 'المبرمج يحدد عبرها شكل بيانات المثيلات ومكانها حتى تستطيع Vulkan بناء بنية تسارع عليا من مجموعة instances مرتبطة ببنى تسارع أخرى.',
      validity: 'تصبح صالحة عندما يشير data إلى بيانات instances بالشكل الذي يطابق قيمة arrayOfPointers فعلياً.',
      failure: 'إذا لم يطابق شكل البيانات قيمة arrayOfPointers أو كان العنوان غير صحيح فستُفسَّر بيانات instances بشكل خاطئ.'
    };
  }

  if (/^VkAccelerationStructureGeometryKHR$/.test(name)) {
    return {
      label: 'بنية هندسة لبنية التسارع',
      meaning: `${name} تحدد نوع الهندسة التي ستدخل في بنية التسارع، ثم تحمل الوصف المناسب لهذه الهندسة نفسها، سواء كانت مثلثات أو AABB أو instances، مع الرايات التي تؤثر في التعامل معها.`,
      intent: 'المبرمج يستخدمها كغلاف يربط نوع الهندسة بالبيانات الفعلية المقابلة له، بحيث تعرف Vulkan أي فرع من بيانات geometry سيُقرأ فعلياً.',
      validity: 'تصبح صالحة عندما يطابق geometryType محتوى الحقل geometry والرايات المرتبطة به.',
      failure: 'إذا كان نوع الهندسة لا يطابق البيانات الفعلية داخل union geometry فستقرأ Vulkan نوعاً خاطئاً من المدخلات.'
    };
  }

  if (/^VkAccelerationStructure(DeviceAddressInfoKHR|MemoryRequirementsInfoNV|VersionInfoKHR)$/.test(name)) {
    return {
      label: 'بنية استعلام مرتبطة ببنية التسارع',
      meaning: `${name} بنية تُمرر إلى دالة استعلام للحصول على معلومة محددة عن بنية التسارع، مثل عنوانها أو متطلبات الذاكرة أو بيانات الإصدار.`,
      intent: 'المبرمج يملأ الحقول التي تحدد هدف الاستعلام، ثم يمررها إلى الدالة حتى تعيد معلومة تقنية يحتاجها قبل الربط أو التوافق أو الاستخدام اللاحق.',
      validity: 'تصبح صالحة عندما تشير إلى بنية التسارع أو بيانات الإصدار الصحيحة التي تريد الاستعلام عنها فعلياً.',
      failure: 'إذا كان هدف الاستعلام غير صحيح أو غير متوافق فستعيد الدالة معلومات غير مفيدة أو تفشل في الاستعلام.'
    };
  }

  if (/^VkAccelerationStructure(InstanceKHR|InstanceNV|MatrixMotionInstanceNV|SRTMotionInstanceNV|MotionInstanceNV|MotionInstanceDataNV|MotionInfoNV)$/.test(name)) {
    return {
      label: 'بنية instance أو motion لبنية التسارع',
      meaning: `${name} تصف instance واحدة أو حركة instance داخل بنية التسارع، مثل التحويل، والمرجع إلى بنية التسارع السفلية، ونوع الحركة أو بياناتها.`,
      intent: 'المبرمج يستخدمها لتمثيل عنصر واحد داخل AS عليا أو لوصف كيف تتحرك هذه الـ instance عبر الزمن عندما يكون المسار داعماً للحركة.',
      validity: 'تصبح صالحة عندما تكون التحويلات والمراجع والأنواع متوافقة مع بنية التسارع السفلية ومع شكل الحركة الذي تريد تمثيله.',
      failure: 'إذا كانت المراجع أو التحويلات أو نوع الحركة غير صحيحة فسيصبح تمثيل الـ instance أو الحركة داخل بنية التسارع غير صحيح.'
    };
  }

  if (/^VkAccelerationStructure(TrianglesDisplacementMicromapNV|TrianglesOpacityMicromapEXT)$/.test(name)) {
    return {
      label: 'بنية micromap مرتبطة بمثلثات بنية التسارع',
      meaning: `${name} تصف البيانات الإضافية المرتبطة بمثلثات بنية التسارع، مثل micromap الشفافية أو الإزاحة، والعناوين والـ stride والعدّادات اللازمة لقراءتها.`,
      intent: 'المبرمج يربط عبرها بيانات micromap الفعلية بمثلثات الهندسة حتى تدخل هذه التفاصيل في بناء بنية التسارع أو في سلوك ray tracing اللاحق.',
      validity: 'تصبح صالحة عندما تتطابق عناوين البيانات والـ stride والعدّادات والـ micromap نفسه مع بيانات المثلثات المرتبطة بها.',
      failure: 'أي عدم تطابق بين بيانات micromap والهندسة أو العدادات أو العناوين يجعل قراءة هذه التفاصيل غير صحيحة أو غير صالحة.'
    };
  }

  if (name === 'VkAllocationCallbacks') {
    return {
      label: 'بنية تخصيصات مخصصة',
      meaning: `${name} بنية تصف كيف ستتعامل Vulkan مع تخصيص ذاكرة المضيف وتحريرها وإعادة تخصيصها عبر ردود نداء يحددها التطبيق.`,
      intent: `المبرمج يجهز ${name} قبل ${relatedFunctions[0] ? renderAnalysisReference(relatedFunctions[0], item) : 'الدالة المرتبطة'} ليجعل التخصيصات تمر عبر منطق التطبيق بدلاً من المخصص الافتراضي.`,
      validity: 'تصبح صالحة عندما تكون مؤشرات دوال التخصيص والتحرير وإعادة التخصيص صالحة ومتوافقة مع التعاقد الذي تتوقعه Vulkan.',
      failure: 'أي مؤشر رد نداء غير صالح أو منطق تخصيص غير متوافق قد يؤدي إلى تعطل مباشر أو فساد في الذاكرة.'
    };
  }

  if (/^VkPhysicalDevice.+Features/.test(name)) {
    return {
      label: 'بنية ميزات جهاز فيزيائي',
      meaning: `${name} بنية مخصصة لميزات الجهاز الفيزيائي نفسه، وتستخدم لمعرفة ما يدعمه العتاد فعلياً أو لطلب تفعيل ميزات بعينها قبل إنشاء الجهاز المنطقي.`,
      intent: 'المبرمج يقرأ هذه البنية أو يملؤها قبل إنشاء الجهاز ليربط بين قدرات العتاد الحقيقية والميزات التي سيعتمد عليها التطبيق لاحقاً.',
      validity: 'تكون صالحة عندما تُكتب فيها قيم الدعم الفعلية من الاستعلام أو عندما تُطلب منها فقط الميزات المدعومة فعلاً.',
      failure: 'إذا اعتُمدت ميزة غير مدعومة أو فُهمت القيم على نحو خاطئ فسيفشل الإنشاء أو تصبح الافتراضات البرمجية عن قدرات الجهاز غير صحيحة.'
    };
  }

  if (/^VkPhysicalDevice.+Properties/.test(name) || /^VkPhysicalDeviceProperties2?$/.test(name)) {
    return {
      label: 'بنية خصائص جهاز فيزيائي',
      meaning: `${name} بنية تستقبل من السائق خصائص الجهاز الفيزيائي وحدوده وقدراته، مثل الأحجام القصوى والدقة المدعومة والقيود التشغيلية.`,
      intent: 'المبرمج يمررها إلى دالة استعلام حتى تكتب Vulkan القيم الحقيقية التي سيبني عليها قرارات التوافق والتهيئة اللاحقة.',
      validity: 'تصبح هذه البيانات مفيدة فقط بعد أن تكتبها دالة الاستعلام المناسبة في الحقول المرتبطة بها.',
      failure: 'قراءة الحقول قبل الاستعلام أو التعامل مع الخصائص على أنها قيم ثابتة لكل الأجهزة يؤدي إلى قرارات إعداد غير صحيحة.'
    };
  }

  if (/^VkMemory.+AllocateInfo/.test(name) || /^VkExportMemoryAllocateInfo/.test(name) || /^VkImportMemory.+Info/.test(name)) {
    return {
      label: 'بنية معلمات ذاكرة',
      meaning: `${name} بنية تحدد سياسة التعامل مع الذاكرة: كيف ستُخصص، أو كيف ستُربط، أو كيف ستُشارك أو تُستورد أو تُصدَّر بين المسارات المختلفة.`,
      intent: 'المقصود البرمجي منها هو جعل قرار الذاكرة نفسه صريحاً: من أين تأتي، وما نوعها، وما القيود أو الامتدادات المرتبطة بها.',
      validity: 'تصبح صالحة عندما تطابق الحقول نوع الذاكرة المطلوب والمورد الذي ستُربط به والامتدادات ذات الصلة.',
      failure: 'أي تعارض بين حجم الذاكرة أو نوعها أو آلية مشاركتها وبين المورد الحقيقي يؤدي إلى فشل التخصيص أو الربط أو المشاركة.'
    };
  }

  if (/^Vk(Graphics|Compute|RayTracing|ExecutionGraph).*CreateInfo/.test(name)) {
    return {
      label: 'بنية إنشاء خط أنابيب',
      meaning: `${name} بنية تصف كيف سيُبنى خط الأنابيب نفسه: مراحله الشادرية، حالاته الثابتة، التخطيطات التي يعتمد عليها، وربطه ببقية موارد التنفيذ.`,
      intent: 'المبرمج يستخدمها ليحدد السلوك الكامل للمسار الذي سينفذ على الجهاز، سواء كان رسماً أو حساباً أو تتبع أشعة أو مخطط تنفيذ.',
      validity: 'تصبح صالحة عندما تكون المراحل والتخطيطات والحالات متوافقة مع بعضها ومع الموارد التي سيستخدمها خط الأنابيب.',
      failure: 'أي تعارض بين المراحل الشادرية أو التخطيط أو الحالات الثابتة يؤدي إلى فشل الإنشاء أو إلى Pipeline غير صالح للتنفيذ.'
    };
  }

  if (name === 'VkPipelineLayoutCreateInfo') {
    return {
      label: 'بنية إنشاء مخطط خط الأنابيب',
      meaning: `${name} تحدد descriptor set layouts و push constant ranges التي سيعتمد عليها خط الأنابيب أو الأوامر التي تتعامل معه.`,
      intent: 'المقصود منها هو تعريف العقد الذي يربط بين الشيدرات والموارد الفعلية التي ستظهر لها أثناء التنفيذ.',
      validity: 'تصبح صالحة عندما تطابق مجموعات الواصفات ومناطق push constants ما تتوقعه الشيدرات فعلياً.',
      failure: 'أي عدم تطابق بين المخطط وبين ما تتوقعه الشيدرات أو ما يُربط لاحقاً يؤدي إلى أخطاء تحقق أو فشل في الإنشاء.'
    };
  }

  if (name === 'VkPipelineShaderStageCreateInfo') {
    return {
      label: 'بنية مرحلة شادر',
      meaning: `${name} تصف مرحلة شادر واحدة داخل خط الأنابيب، بما في ذلك نوع المرحلة ووحدة الشيدر ونقطة الدخول والخيارات المرتبطة بها.`,
      intent: 'المبرمج يستخدمها لربط الكود الشادري الفعلي بمرحلة محددة من مراحل التنفيذ داخل خط الأنابيب.',
      validity: 'تصبح صالحة عندما تتوافق وحدة الشيدر ونقطة الدخول مع نوع المرحلة ومع بقية تكوين خط الأنابيب.',
      failure: 'أي خطأ في نوع المرحلة أو وحدة الشيدر أو نقطة الدخول يمنع بناء خط الأنابيب أو يجعل المرحلة غير قابلة للاستخدام.'
    };
  }

  if (/^Vk(Buffer|BufferView).*CreateInfo$/.test(name)) {
    return {
      label: 'بنية إنشاء مخزن',
      meaning: `${name} تحدد خصائص المخزن أو عرض المخزن، مثل الحجم والاستخدام وكيفية تفسير البيانات أو الوصول إليها لاحقاً.`,
      intent: 'المقصود منها هو تحديد دور مورد الذاكرة نفسه داخل Vulkan: هل سيُستخدم للرؤوس أو الفهارس أو النسخ أو التخزين أو الوصول من الشيدر.',
      validity: 'تصبح صالحة عندما يطابق الحجم والاستخدام والتنسيق المقصود نوع العمل الذي سينفذه التطبيق على هذا المورد.',
      failure: 'إذا لم توافق معلمات الإنشاء طريقة الاستخدام اللاحقة للمورد فستظهر أخطاء تحقق أو يصبح الوصول إلى المخزن غير صالح.'
    };
  }

  if (/^Vk(Image|ImageView).*CreateInfo$/.test(name)) {
    return {
      label: 'بنية إنشاء صورة',
      meaning: `${name} تحدد خصائص الصورة أو عرضها، مثل الأبعاد والتنسيق والاستخدام ونطاق الطبقات أو المستويات التي ستظهر في العرض.`,
      intent: 'المبرمج يستخدمها ليقرر منذ البداية كيف ستدخل الصورة مسار Vulkan: كهدف رسم أو كمورد عينات أو كصورة نقل أو عرض.',
      validity: 'تصبح صالحة عندما ينسجم التنسيق والأبعاد وأنواع الاستخدام مع العمل الذي ستؤديه الصورة فعلياً في المراحل اللاحقة.',
      failure: 'أي تعارض بين خصائص الصورة الحقيقية وبين طريقة استخدامها أو عرضها يمنع الإنشاء أو يجعل الوصول اللاحق غير صحيح.'
    };
  }

  if (/^VkSampler.+CreateInfo$/.test(name)) {
    return {
      label: 'بنية إنشاء سامبلر',
      meaning: `${name} تصف كيف ستتم عملية أخذ العينات من الصور، مثل أسلوب الترشيح والعنونة والـ mipmapping وخصائص المقارنة.`,
      intent: 'المقصود منها هو تحديد السلوك الرياضي والبصري لقراءة التكسشر داخل الشيدر، لا مجرد إنشاء كائن سامبلر فارغ.',
      validity: 'تصبح صالحة عندما تتوافق إعدادات أخذ العينات مع نوع الصور والمسار الرسومي أو الحوسبي الذي سيستخدمها.',
      failure: 'اختيارات غير متوافقة هنا قد تعطي جودة غير مقصودة أو تؤدي إلى قيود أو أخطاء تحقق مع الموارد المرتبطة.'
    };
  }

  if (/^VkDescriptor(SetLayout|Pool|UpdateTemplate).*CreateInfo$/.test(name)) {
    return {
      label: 'بنية موارد واصفات',
      meaning: `${name} تصف كيفية تنظيم الواصفات أو تخصيصها أو تحديثها، أي كيف سترتبط الموارد التي تراها الشيدرات بالمخططات والتجمعات والقوالب.`,
      intent: 'المبرمج يستخدمها لضبط شكل الربط بين الصور والمخازن والسمبلرات وبين ما ستستطيع الشيدرات الوصول إليه فعلياً.',
      validity: 'تصبح صالحة عندما تطابق أنواع الواصفات وعددها ومراحل الشيدر أو قوالب التحديث المتطلبات الحقيقية للمسار.',
      failure: 'أي عدم تطابق بين تخطيط الواصفات وبين ما تتوقعه الشيدرات أو ما يُخصَّص لاحقاً يؤدي إلى فشل الإنشاء أو أخطاء تحقق.'
    };
  }

  if (/^Vk(CommandPool|CommandBuffer).+Info/.test(name)) {
    return {
      label: 'بنية أوامر GPU',
      meaning: `${name} تصف كيفية إنشاء مخازن الأوامر أو تخصيصها أو بدء التسجيل فيها، أي كيف ستُبنى الحاوية التي تحمل أوامر GPU نفسها.`,
      intent: 'المقصود منها هو التحكم في دورة حياة أوامر التنفيذ: من أي طابور تتبع، وكيف يُعاد استخدامها، وتحت أي شروط يبدأ التسجيل أو التخصيص.',
      validity: 'تصبح صالحة عندما تطابق راياتها وسياسة استخدامها نوع الطابور ونمط التسجيل وإعادة الاستخدام الذي يتبعه التطبيق.',
      failure: 'أي إعداد غير متوافق مع عائلة الطوابير أو نمط العمل يؤدي إلى فشل التخصيص أو إلى استخدام غير صحيح لمخازن الأوامر.'
    };
  }

  if (/^VkRenderPass.+(CreateInfo|BeginInfo)$/.test(name) || /^VkSubpass.+/.test(name)) {
    return {
      label: 'بنية تمرير رسم',
      meaning: `${name} تصف جزءاً من بنية التمرير الرسومي، مثل المرفقات أو المرفقات الفرعية أو كيفية بدء الرسم داخل هذا التمرير.`,
      intent: 'المبرمج يستخدمها ليحدد كيف ستتحرك بيانات الرسم بين المرفقات وما هي حدود التمرير ونقاط الانتقال داخله.',
      validity: 'تصبح صالحة عندما تطابق المرفقات والسياسات والانتقالات الصور الحقيقية والمسار الرسومي الذي سيستخدمها.',
      failure: 'أي عدم توافق بين المرفقات أو التخطيطات أو بداية التمرير وبين الموارد المرتبطة يؤدي إلى فشل الإنشاء أو إلى سلوك رسم غير صحيح.'
    };
  }

  if (name === 'VkDeviceCreateInfo') {
    return {
      label: 'بنية إنشاء جهاز منطقي',
      meaning: `${name} هي البنية التي تصف بالكامل كيف سيُنشأ الجهاز المنطقي: ما الطوابير التي سيملكها، وما الامتدادات التي ستُفعّل، وما الميزات التي ستصبح متاحة عليه.`,
      intent: `المبرمج يجهز ${name} قبل ${relatedFunctions[0] ? renderAnalysisReference(relatedFunctions[0], item) : renderRelatedReferenceLink('vkCreateDevice')} ليحدد ما الذي سيتفعّل داخل VkDevice فعلياً.`,
      validity: 'تصبح صالحة عندما تضبط الحقول الإلزامية مثل sType وتملأ معلومات الطوابير والامتدادات والميزات بما يطابق ما يدعمه الجهاز.',
      failure: 'أي تعارض بين الطوابير أو الامتدادات أو الميزات المطلوبة وبين ما يدعمه الجهاز يجعل إنشاء VkDevice يفشل أو يولد أخطاء تحقق.'
    };
  }

  if (/^VkAttachmentDescription2(KHR)?$/.test(name)) {
    return {
      label: 'وصف مرفق رسم',
      meaning: `${name} يصف كيف سيتعامل Vulkan مع مرفق الرسم نفسه: تنسيقه، وعدد عيناته، وما الذي يحدث لمحتواه عند بداية الممر ونهايته، وإلى أي layout يجب أن ينتقل.`,
      intent: `المبرمج يستخدم ${name} عندما يريد أن يحدد الدور الفعلي للصورة داخل render pass أو dynamic rendering، لا مجرد تمرير صورة بلا سياسة استخدام واضحة.`,
      validity: 'تصبح البنية صالحة عندما تطابق الحقول خصائص الصورة الحقيقية وسياسات التحميل والحفظ والتخطيطات المطلوبة في الممر.',
      failure: 'أي تعارض بين التنسيق أو العينات أو التخطيطات وسياسة الاستخدام الفعلية للصورة يؤدي إلى فشل الإنشاء أو إلى سلوك غير صحيح أثناء الرسم.'
    };
  }

  if (name === 'VkCopyMicromapInfoEXT') {
    return {
      label: 'بنية وصف نسخ micromap',
      meaning: `${name} تصف عملية نسخ micromap كاملة: ما هو المصدر، وما هي الوجهة، وما النمط الذي ستنفذ به عملية النسخ.`,
      intent: `المبرمج يملأ ${name} قبل ${relatedFunctions[0] ? renderAnalysisReference(relatedFunctions[0], item) : 'دالة النسخ المرتبطة'} ليحدد كيف ستتم عملية النسخ نفسها بين الموردين.`,
      validity: 'تصبح البنية صالحة عندما يكون المصدر والوجهة صالحين ويكون mode مناسباً لنوع النسخ الذي تريد تنفيذه.',
      failure: 'أي مقبض غير صالح أو mode غير مناسب يجعل النسخ يفشل أو يجعل النتيجة غير قابلة للاستخدام.'
    };
  }

  if (name === 'VkAcquireProfilingLockInfoKHR') {
    return {
      label: 'بنية معلمات قفل التنميط',
      meaning: `${name} هي البنية التي تحدد معلمات الحصول على قفل التنميط على الجهاز المنطقي، مثل المهلة القصوى وأي رايات إضافية مرتبطة بطلب القفل.`,
      intent: `المبرمج يجهز ${name} قبل ${relatedFunctions[0] ? renderAnalysisReference(relatedFunctions[0], item) : 'vkAcquireProfilingLockKHR'} ليطلب قفل التنميط بالصيغة التي تناسب جلسة قياس الأداء الحالية.`,
      validity: 'تصبح صالحة عندما يُضبط sType بالقيمة الصحيحة، وتُملأ المهلة والرايات بما يطابق سلوك الانتظار المطلوب للحصول على القفل.',
      failure: 'القيم الخاطئة هنا قد تجعل السائق يفسر الطلب بشكل غير صحيح أو تعيد الدالة مهلة أو خطأ قبل بدء جلسة التنميط.'
    };
  }

  if (/CreateInfo$/.test(name)) {
    return {
      label: 'بنية إعداد',
      meaning: `${name} بنية تحتوي على معلمات الإنشاء التي ستقرأها دالة الإنشاء المرتبطة لتحدد شكل الكائن أو المورد الجديد وخصائصه.`,
      intent: `عندما يكتب المبرمج ${name} فهو يجهز وصفاً كاملاً لعملية الإنشاء قبل استدعاء ${relatedFunctions[0] ? renderAnalysisReference(relatedFunctions[0], item) : 'دالة الإنشاء المرتبطة'}.`,
      validity: 'تصبح البنية صالحة عندما تُملأ الحقول الإلزامية مثل sType وpNext والحقول الوظيفية الأخرى بما يطابق متطلبات دالة الإنشاء.',
      failure: 'إذا كانت الحقول ناقصة أو غير متوافقة فسيفشل الاستدعاء أو تعترض Validation Layers على البنية.'
    };
  }

  if (/AllocateInfo$/.test(name)) {
    return {
      label: 'بنية تخصيص',
      meaning: `${name} بنية تحتوي على معلمات التخصيص، مثل ما الذي سيُخصص فعلياً وكمية الموارد أو المصدر الذي ستؤخذ منه.`,
      intent: `المبرمج يستخدم ${name} ليحدد طلب التخصيص بشكل صريح قبل تمريره إلى الدالة التي ستنفذ عملية الحجز.`,
      validity: 'تصبح صالحة عندما تعكس الحقول نوع المورد المطلوب وعدده والمصدر الذي سيُخصص منه.',
      failure: 'الحقول الخاطئة قد تؤدي إلى تخصيص مورد غير مناسب أو إلى فشل التخصيص بالكامل.'
    };
  }

  if (/BeginInfo$/.test(name)) {
    return {
      label: 'بنية بدء',
      meaning: `${name} بنية تحتوي على معلمات بداية العملية أو النطاق الذي ستفتحه الدالة المرتبطة بها.`,
      intent: `المقصود البرمجي منها هو التحكم في شروط بداية العملية وما إذا كانت هناك رايات أو موارد مرتبطة يجب أن تؤخذ في الاعتبار.`,
      validity: 'تصبح صالحة عندما تتوافق قيمها مع المرحلة التي تبدأها فعلاً.',
      failure: 'أي تعارض بين الحقول والمرحلة الحالية قد يجعل البدء غير صحيح أو يسبب خطأ تحقق.'
    };
  }

  if (/Properties/.test(name)) {
    return {
      label: 'بنية خصائص',
      meaning: `${name} بنية تحتوي على خصائص أو حدود أو قدرات يكتبها السائق أو واجهة Vulkan لهذا المسار أو المورد أو الجهاز.`,
      intent: `المبرمج يمرر ${name} إلى دالة استعلام حتى تكتب فيها Vulkan الخصائص الفعلية، ثم يبني عليها قرار التوافق أو الاختيار أو التهيئة اللاحقة.`,
      validity: 'تصبح البيانات مفيدة فقط بعد أن تكتبها دالة الاستعلام المرتبطة بها.',
      failure: 'قراءة الحقول قبل استدعاء الدالة أو مع مؤشر غير صالح يجعل المعلومات غير موثوقة.'
    };
  }

  if (/Features/.test(name)) {
    return {
      label: 'بنية ميزات',
      meaning: `${name} بنية تحتوي على مفاتيح ميزات يمكن استخدامها للاستعلام عن الدعم أو لطلب التفعيل قبل الإنشاء.`,
      intent: `المبرمج يستخدم ${name} إما لقراءة الميزات المدعومة فعلياً، أو لطلب تفعيل الميزات التي سيعتمد عليها الكود قبل إنشاء الجهاز أو المورد.`,
      validity: 'تكون صالحة عندما تكتب فيها قيم الدعم الفعلية أو عندما تطلب منها فقط الميزات المسموح بها.',
      failure: 'طلب ميزة غير مدعومة أو فهم الحقول على أنها مفعلة دون استعلام صحيح يؤدي إلى فشل لاحق في الإنشاء أو الاستخدام.'
    };
  }

  if (/Callbacks$/.test(name)) {
    return {
      label: 'بنية رد نداء',
      meaning: `${name} بنية تحتوي على مؤشرات دوال رد نداء وسياق مستخدم يمكن لـ Vulkan استدعاؤهما عند الحاجة.`,
      intent: 'المقصود منها هو ربط منطق التطبيق مع نقاط نداء داخل Vulkan أو الامتداد المرتبط.',
      validity: 'تصبح صالحة عندما تكون مؤشرات الدوال والسياق المشار إليه صالحين طوال الفترة التي قد تستدعيها فيها الواجهة.',
      failure: 'أي مؤشر دالة غير صالح أو سياق غير حي قد يؤدي إلى تعطل مباشر عند الاستدعاء.'
    };
  }

  if (/Info$/.test(name)) {
    return {
      label: 'بنية معلومات',
      meaning: `${name} تحمل وصفاً منظماً لعملية أو مورد أو حالة تحتاجها الدالة المرتبطة بها أثناء التنفيذ.`,
      intent: `المبرمج يستخدم ${name} لتجميع القيم التي ستقرأها الدالة مباشرة عند التنفيذ، بحيث يصبح معنى الاستدعاء واضحاً ومتركزاً في بنية واحدة.`,
      validity: 'تصبح صالحة عندما تتوافق الحقول مع العملية المقصودة والدالة التي ستقرأها.',
      failure: 'البنية غير المكتملة أو ذات القيم غير المتوافقة تجعل المعنى البرمجي للسطر غامضاً أو غير صالح.'
    };
  }

  return {
    label: 'نوع Vulkan',
    meaning: description || `${name} نوع من أنواع Vulkan يستخدم داخل الهياكل أو الدوال أو المقابض المرتبطة بالواجهة.`,
    intent: usageItems[0] || `المقصود البرمجي من ${name} يعتمد على الدالة أو البنية التي يظهر معها داخل الكود.`,
    validity: 'تكون القيمة أو البنية صالحة عندما تستخدم في الموضع الذي تتوقعه المواصفة.',
    failure: 'أي استخدام في سياق غير مناسب يجعل المعنى البرمجي غير صحيح أو يؤدي إلى أخطاء تحقق.'
  };
}

function stripMarkup(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasArabicScript(text) {
  return /[\u0600-\u06FF]/.test(String(text || ''));
}

function stripTooltipIdentifierNoise(text) {
  return stripSdlTooltipIdentifierNoise(text)
    .replace(/[<>{}()[\]_*#;:=/\\|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function maskSdl3AllowedTechnicalTokens(text) {
  return maskAllowedSdlTechnicalTokens(text);
}

function unmaskSdl3AllowedTechnicalTokens(text, tokens = []) {
  return String(text || '').replace(/@@(\d+)@@/g, (_, index) => tokens[Number(index)] || '');
}

function hasResidualSdl3EnglishProse(text) {
  const clean = stripMarkup(text);
  if (!clean) {
    return false;
  }

  const {masked} = maskSdl3AllowedTechnicalTokens(clean);
  return /[A-Za-z]{3,}/.test(masked);
}

function normalizeSdl3ArabicTechnicalProse(text) {
  let source = String(text || '');
  if (!source) {
    return source;
  }

  const quotedTechnicalTokens = [];
  source = source.replace(/"[A-Za-z0-9_.-]+"/g, (match) => {
    const marker = `%%${quotedTechnicalTokens.length}%%`;
    quotedTechnicalTokens.push(match);
    return marker;
  });

  const replacements = [
    [/\banimation decoder\b/gi, 'مفكك الرسوم المتحركة'],
    [/\banimation encoder\b/gi, 'مشفر الرسوم المتحركة'],
    [/\banimation stream\b/gi, 'مجرى الرسوم المتحركة'],
    [/\bdecoding process\b/gi, 'عملية فك الترميز'],
    [/\bencoding process\b/gi, 'عملية الترميز'],
    [/\bnumber of frames\b/gi, 'عدد الإطارات'],
    [/\bloop count\b/gi, 'عدد مرات التكرار'],
    [/\bunderlying image\b/gi, 'الصورة الأساسية'],
    [/\bcopyright text\b/gi, 'نص حقوق النشر'],
    [/\btimebase\b/gi, 'قاعدة الزمن'],
    [/\bno longer needed\b/gi, 'عند عدم الحاجة إليه'],
    [/\bbasic i\/o errors\b/gi, 'أخطاء الإدخال/الإخراج الأساسية'],
    [/\binput file type\b/gi, 'نوع ملف الإدخال'],
    [/\boutput file type\b/gi, 'نوع ملف الإخراج'],
    [/\bSDL audio\b/gi, 'نظام الصوت في SDL'],
    [/\bshader\b/gi, 'المظلّل'],
    [/\binteger\b/gi, 'عدد صحيح'],
    [/\bIntel\b/gi, 'إنتل'],
    [/\bfallback fonts\b/gi, 'الخطوط الاحتياطية'],
    [/\bfallback font\b/gi, 'الخط الاحتياطي'],
    [/\bfont size\b/gi, 'حجم الخط'],
    [/\bfonts\b/gi, 'الخطوط'],
    [/\bfont\b/gi, 'الخط'],
    [/\bglyphs\b/gi, 'المحارف المرسومة'],
    [/\bglyph\b/gi, 'محرف مرسوم'],
    [/\bcharacters\b/gi, 'المحارف'],
    [/\bcharacter\b/gi, 'محرف'],
    [/\btext rendering\b/gi, 'عرض النص'],
    [/\bstyle\b/gi, 'النمط'],
    [/\bstyles\b/gi, 'الأنماط'],
    [/\bupdate(?:s|d)?\b/gi, (match) => /updates/i.test(match) ? 'يحدّث' : /updated/i.test(match) ? 'محدّث' : 'تحديث'],
    [/\bthread safety\b/gi, 'سلامة الخيوط'],
    [/\bmain thread\b/gi, 'الخيط الرئيسي'],
    [/\bevent loop\b/gi, 'حلقة الأحداث'],
    [/\bdefault value\b/gi, 'القيمة الافتراضية'],
    [/\bdefaults to\b/gi, 'القيمة الافتراضية هي'],
    [/\bfile size\b/gi, 'حجم الملف'],
    [/\bfiles\b/gi, 'الملفات'],
    [/\bfile\b/gi, 'الملف'],
    [/\bnumerator\b/gi, 'البسط'],
    [/\bdenominator\b/gi, 'المقام'],
    [/\bcompression quality\b/gi, 'جودة الضغط'],
    [/\bcompression\b/gi, 'الضغط'],
    [/\bquality\b/gi, 'الجودة'],
    [/\bcompile(?:[ -]?time)\b/gi, 'وقت الترجمة'],
    [/\brun(?:[ -]?time)\b/gi, 'وقت التشغيل'],
    [/\bpreprocessing\b/gi, 'المعالجة المسبقة'],
    [/\bpreprocessor\b/gi, 'المعالج المسبق'],
    [/\bconditional compilation\b/gi, 'الترجمة الشرطية'],
    [/\bmacro expansion\b/gi, 'توسعة الماكرو'],
    [/\btoken pasting\b/gi, 'لصق الرموز'],
    [/\bcallback\b/gi, 'رد النداء'],
    [/\bopaque\b/gi, 'معتم'],
    [/\bpointer\b/gi, 'مؤشر'],
    [/\bdecoder\b/gi, 'مفكك الترميز'],
    [/\bencoder\b/gi, 'مشفر الترميز'],
    [/\bstream\b/gi, 'مجرى'],
    [/\bsurface\b/gi, 'سطح'],
    [/\btexture\b/gi, 'خامة'],
    [/\brenderer\b/gi, 'مصير الرسم'],
    [/\bwindow\b/gi, 'نافذة'],
    [/\bfilters?\b/gi, (match) => /^filters$/i.test(match) ? 'مرشحات' : 'مرشح'],
    [/\bproperties\b/gi, 'الخصائص'],
    [/\bproperty\b/gi, 'الخاصية'],
    [/\bfile dialog\b/gi, 'حوار الملفات'],
    [/\bstatus\b/gi, 'الحالة'],
    [/\blabel\b/gi, 'التسمية'],
    [/\btypedef\b/gi, 'اسم نوع بديل'],
    [/\btoken\b/gi, 'رمز'],
    [/\bidentifier\b/gi, 'معرّف'],
    [/\bmacro\b/gi, 'ماكرو'],
    [/\bopaque type\b/gi, 'نوع معتم'],
    [/\bhandle\b/gi, 'مقبض'],
    [/\bbitmask\b/gi, 'قناع البتات']
  ];

  replacements.forEach(([pattern, replacement]) => {
    source = source.replace(pattern, replacement);
  });

  return source.replace(/%%(\d+)%%/g, (_, index) => quotedTechnicalTokens[Number(index)] || '');
}

function looksEnglishOrMixedTooltipText(text) {
  const clean = stripTooltipIdentifierNoise(stripMarkup(text));
  if (!clean) {
    return false;
  }

  const englishWords = clean.match(/[A-Za-z]{3,}/g) || [];
  const arabicWords = clean.match(/[\u0600-\u06FF]+/g) || [];
  return englishWords.length > 0 && (!arabicWords.length || englishWords.length >= arabicWords.length);
}

function preferArabicTooltipText(rawText, fallback = '') {
  const clean = stripMarkup(rawText)
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const fallbackClean = stripMarkup(fallback)
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return fallbackClean;
  }

  if (looksEnglishOrMixedTooltipText(clean) && fallbackClean) {
    return fallbackClean;
  }

  return clean;
}

function trimLeadingTypeName(text, typeName = '') {
  let clean = stripMarkup(text).replace(/^الوصف الرسمي:\s*/g, '').trim();
  if (!clean) {
    return '';
  }

  if (typeName) {
    const escapedType = typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    clean = clean.replace(new RegExp(`^${escapedType}\\s*[-:،]?\s*`), '').trim();
  }

  return clean.replace(/[.]\s*$/g, '').trim();
}

function getOwnerStructureSummary(ownerType = '') {
  const normalizedOwner = normalizeLookupName(ownerType);
  if (!normalizedOwner) {
    return null;
  }

  const ownerItem = findItemInCategories(vulkanData.structures, normalizedOwner);
  if (!ownerItem) {
    return null;
  }

  const role = inferStructureRole(ownerItem);
  const lead = trimLeadingTypeName(
    getStructureLeadDescription(ownerItem) || ownerItem.description || role.meaning || '',
    normalizedOwner
  );
  const intent = trimLeadingTypeName(
    role.intent || getUsageItems(ownerItem).find((text) => !isMarginalUsageText(text)) || '',
    normalizedOwner
  );

  return {
    item: ownerItem,
    label: stripMarkup(role.label || ''),
    lead,
    intent
  };
}

function toPracticalPurposePhrase(text) {
  let clean = trimLeadingTypeName(text).trim();
  if (!clean) {
    return '';
  }

  clean = clean
    .replace(/^هي\s+البنية\s+التي\s+/g, '')
    .replace(/^هيكل\s+يحدد\s+/g, 'يحدد ')
    .replace(/^بنية\s+تحدد\s+/g, 'تحدد ')
    .replace(/^بنية\s+تصف\s+/g, 'تصف ')
    .replace(/^بنية\s+تحتوي\s+على\s+/g, 'تحتوي على ')
    .replace(/^بنية\s+/g, '')
    .trim();

  if (/^تحدد\s+/.test(clean)) return `مخصصة لتحديد ${clean.replace(/^تحدد\s+/, '')}`;
  if (/^تصف\s+/.test(clean)) return `مخصصة لوصف ${clean.replace(/^تصف\s+/, '')}`;
  if (/^تحمل\s+/.test(clean)) return `مخصصة لحمل ${clean.replace(/^تحمل\s+/, '')}`;
  if (/^تحتوي\s+على\s+/.test(clean)) return `مخصصة لاحتواء ${clean.replace(/^تحتوي\s+على\s+/, '')}`;
  if (/^تستقبل\s+/.test(clean)) return `مخصصة لاستقبال ${clean.replace(/^تستقبل\s+/, '')}`;
  if (/^تنقل\s+/.test(clean)) return `مخصصة لنقل ${clean.replace(/^تنقل\s+/, '')}`;
  if (/^تربط\s+/.test(clean)) return `مخصصة لربط ${clean.replace(/^تربط\s+/, '')}`;

  return clean;
}
