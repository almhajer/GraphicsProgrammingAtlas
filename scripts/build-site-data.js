const fs = require('fs');
const https = require('https');
const path = require('path');
const {execFileSync} = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'data', 'vulkan_site_data.json');
const splitOutputDir = path.join(rootDir, 'data', 'split');
const splitCoreJsonPath = path.join(splitOutputDir, 'core.json');
const splitCoreScriptPath = path.join(splitOutputDir, 'core.js');
const sourcePath = path.join(rootDir, 'data', 'ref-source.txt');
const officialDocsCacheDir = path.join(rootDir, 'data', 'official_refpages', 'functions');
const officialTypeDocsCacheDir = path.join(rootDir, 'data', 'official_refpages', 'types');
const vulkanIncludeCandidates = [
  process.env.VULKAN_INCLUDE_DIR,
  path.join(process.env.HOME || '', 'VulkanSDK', 'macOS', 'include', 'vulkan'),
  '/Users/abdulkafi/VulkanSDK/macOS/include/vulkan'
].filter(Boolean);

const SECTION_INDENT = 8;
const LETTER_INDENT = 12;
const ITEM_INDENT = 16;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function serializeCompact(data) {
  return JSON.stringify(data);
}

function writeJsonAndScript(jsonPath, scriptPath, globalName, data) {
  const serialized = serializeCompact(data);
  fs.writeFileSync(jsonPath, serialized);
  fs.writeFileSync(scriptPath, `window.${globalName} = ${serialized};\n`);
}

function findExistingDir(candidates) {
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  return '';
}

function walkFiles(dirPath, predicate) {
  const results = [];
  if (!dirPath || !fs.existsSync(dirPath)) {
    return results;
  }

  fs.readdirSync(dirPath, {withFileTypes: true}).forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, predicate));
      return;
    }
    if (!predicate || predicate(fullPath, entry)) {
      results.push(fullPath);
    }
  });

  return results;
}

function parseReferenceSections(sourceText) {
  const sections = {};
  let currentSection = null;
  let currentLetter = null;

  for (const rawLine of sourceText.split(/\r?\n/)) {
    if (!rawLine.trim()) {
      continue;
    }

    const indent = (rawLine.match(/^ */) || [''])[0].length;
    const value = rawLine.trim();

    if (indent === SECTION_INDENT) {
      currentSection = value;
      currentLetter = null;
      sections[currentSection] = sections[currentSection] || {};
      continue;
    }

    if (!currentSection) {
      continue;
    }

    if (indent === LETTER_INDENT) {
      currentLetter = value;
      sections[currentSection][currentLetter] = sections[currentSection][currentLetter] || [];
      continue;
    }

    if (indent === ITEM_INDENT && currentLetter) {
      sections[currentSection][currentLetter].push(value);
    }
  }

  return sections;
}

function normalizeType(type) {
  if (!type) return '';

  return String(type)
    .replace(/\bconst\b/g, '')
    .replace(/\bstruct\b/g, '')
    .replace(/\s*\*+\s*/g, '')
    .replace(/\s*\[[^\]]*\]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function flattenSection(section) {
  return Object.values(section || {}).flat();
}

function firstLetterKey(name) {
  return (name && name[0] ? name[0].toUpperCase() : '#');
}

function inferExtension(name) {
  const match = String(name || '').match(
    /(KHR|EXT|AMD|NVX|NV|INTEL|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX)$/
  );

  return match ? match[1] : '';
}

function toReturnValueList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => ({
      value: item.value || item.name || '',
      description: item.description || ''
    }));
  }

  if (typeof value === 'object') {
    return Object.entries(value).map(([name, description]) => ({
      value: name,
      description: description || ''
    }));
  }

  return [];
}

function mergeDocs(baseDoc, nextDoc) {
  if (!baseDoc) return nextDoc;

  return {
    ...baseDoc,
    ...nextDoc,
    description:
      (nextDoc.description || '').length >= (baseDoc.description || '').length
        ? nextDoc.description
        : baseDoc.description,
    signature: nextDoc.signature || baseDoc.signature,
    parameters: nextDoc.parameters?.length ? nextDoc.parameters : baseDoc.parameters,
    returnValues: nextDoc.returnValues?.length ? nextDoc.returnValues : baseDoc.returnValues,
    usage: nextDoc.usage?.length ? nextDoc.usage : baseDoc.usage,
    notes: nextDoc.notes?.length ? nextDoc.notes : baseDoc.notes,
    example: nextDoc.example || baseDoc.example,
    returnType: nextDoc.returnType || baseDoc.returnType,
    category: nextDoc.category || baseDoc.category,
    seeAlso: nextDoc.seeAlso?.length ? nextDoc.seeAlso : baseDoc.seeAlso,
    syntax: nextDoc.syntax || baseDoc.syntax,
    returnValue: nextDoc.returnValue || baseDoc.returnValue
  };
}

function buildSignature(name, returnType, parameters) {
  if (!returnType || !parameters?.length) {
    return '';
  }

  const signatureParams = parameters
    .map((param) => `${param.type || 'void'} ${param.name || 'value'}`)
    .join(', ');

  return `${returnType} ${name}(${signatureParams})`;
}

function normalizeFunctionDoc(item) {
  const returnType =
    typeof item.returnType === 'string' ? item.returnType : item.returnType?.name || '';
  const parameters = Array.isArray(item.parameters) ? item.parameters : [];
  const notes = Array.isArray(item.notes)
    ? item.notes
    : item.remarks
      ? [item.remarks]
      : [];

  return {
    name: item.name,
    category: item.category || '',
    returnType,
    signature: item.signature || buildSignature(item.name, returnType, parameters),
    description: item.description || '',
    parameters,
    returnValues: toReturnValueList(item.returnValues),
    usage: Array.isArray(item.usage) ? item.usage : item.usage ? [item.usage] : [],
    notes,
    example: item.example || '',
    seeAlso: Array.isArray(item.seeAlso) ? item.seeAlso : []
  };
}

function normalizeMacroDoc(item) {
  return {
    name: item.name,
    syntax: item.syntax || item.name,
    description: item.description || '',
    parameters: Array.isArray(item.parameters) ? item.parameters : [],
    usage: Array.isArray(item.usage) ? item.usage : item.usage ? [item.usage] : [],
    returnValue: item.returnValue || '',
    notes: Array.isArray(item.notes) ? item.notes : [],
    example: item.example || ''
  };
}

function loadFunctionDocs() {
  const docs = new Map();
  const functionsJson = readJson(path.join('data', 'vulkan_functions.json'));
  const fullJson = readJson(path.join('data', 'vulkan_full_data.json'));

  if (functionsJson?.functions) {
    functionsJson.functions.forEach((item) => {
      docs.set(item.name, mergeDocs(docs.get(item.name), normalizeFunctionDoc(item)));
    });
  }

  if (fullJson?.functions) {
    Object.values(fullJson.functions).forEach((group) => {
      (group.items || []).forEach((item) => {
        docs.set(item.name, mergeDocs(docs.get(item.name), normalizeFunctionDoc(item)));
      });
    });
  }

  return docs;
}

function loadMacroDocs() {
  const docs = new Map();
  const macrosJson = readJson(path.join('data', 'vulkan_macros.json'));

  (macrosJson?.macros || []).forEach((item) => {
    docs.set(item.name, normalizeMacroDoc(item));
  });

  return docs;
}

function hasLatinText(value) {
  return /[A-Za-z]{3,}/.test(
    String(value || '').replace(
      /\b(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|KHR|EXT|AMD|NVX|NV|INTEL|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX|DRM)\b/g,
      ''
    )
  );
}

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .trim();
}

function repairCorruptedTechnicalText(value) {
  const repaired = String(value || '')
    .replace(/VkالشاشةKHR/g, 'VkDisplayKHR')
    .replace(/vkالشاشةKHR/g, 'vkDisplayKHR')
    .replace(/pالشاشة/g, 'pDisplay')
    .replace(/الشاشةTarget/g, 'displayTarget')
    .replace(/VK_EXT_acquire_xlib_الشاشة/g, 'VK_EXT_acquire_xlib_display')
    .replace(/VK_EXT_acquire_drm_الشاشة/g, 'VK_EXT_acquire_drm_display')
    .replace(/VK_NV_acquire_winrt_الشاشة/g, 'VK_NV_acquire_winrt_display')
    .replace(/VK_KHR_الشاشة_سلسلة التبديل/g, 'VK_KHR_display_swapchain')
    .replace(/VK_EXT_الشاشة_السطح_counter/g, 'VK_EXT_display_surface_counter')
    .replace(/VK_KHR_get_الشاشة_properties2/g, 'VK_KHR_get_display_properties2')
    .replace(/VK_EXT_direct_mode_الشاشة/g, 'VK_EXT_direct_mode_display')
    .replace(/VK_GOOGLE_الشاشة_timing/g, 'VK_GOOGLE_display_timing')
    .replace(/VK_EXT_الشاشة_control/g, 'VK_EXT_display_control')
    .replace(/VK_AMD_الشاشة_native_hdr/g, 'VK_AMD_display_native_hdr')
    .replace(/VK_KHR_الشاشة/g, 'VK_KHR_display')
    .replace(/\baccess to a VkDisplayKHR\b/gi, 'access to VkDisplayKHR')
    .replace(/\bmast⁠er\b/g, 'master');

  const vkTokenWordMap = new Map([
    ['الشاشة', 'display'],
    ['السطح', 'surface'],
    ['الذاكرة', 'memory'],
    ['الإشارة', 'semaphore'],
    ['السياج', 'fence'],
    ['المخزن', 'buffer'],
    ['الواصف', 'descriptor'],
    ['الصورة', 'image'],
    ['الطابور', 'queue']
  ]);

  return repaired.replace(/VK_[A-Za-z0-9_ء-ي]+/g, (token) => {
    return token
      .split('_')
      .map((part) => vkTokenWordMap.get(part) || part)
      .join('_');
  });
}

function protectTechnicalIdentifiers(text) {
  const identifiers = [];
  const protectedText = repairCorruptedTechnicalText(text).replace(
    /\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Za-z0-9_]+|NULL|DRM|Xlib|Winrt|X11|Display|HANDLE|POSIX|Metal|Zircon)\b/g,
    (match) => {
      const placeholder = `%%TECH${identifiers.length}%%`;
      identifiers.push(match);
      return placeholder;
    }
  );

  return {
    text: protectedText,
    restore(value) {
      return String(value || '').replace(/%%TECH(\d+)%%/g, (_, index) => identifiers[Number(index)] || '');
    }
  };
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceStandaloneTechnicalPhrase(text, english, arabic) {
  const source = String(text || '');
  const phrase = String(english || '');
  if (!phrase) {
    return source;
  }

  const pattern = /[A-Za-z0-9_]/.test(phrase)
    ? new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi')
    : new RegExp(escapeRegex(phrase), 'gi');
  return source.replace(pattern, arabic);
}

function normalizeSentence(value) {
  const text = cleanText(value).replace(/\s+([،.])/g, '$1');
  if (!text) {
    return '';
  }

  return /[.؟!]$/.test(text) ? text : `${text}.`;
}

function descriptionBody(description) {
  return cleanText(String(description || '').replace(/^الوصف الرسمي:\s*/g, '')).replace(/[.؟!]$/, '');
}

function normalizeFunctionExplanationText(text) {
  const source = cleanText(String(text || ''));
  if (!source) {
    return '';
  }

  const protectedText = protectTechnicalIdentifiers(repairCorruptedTechnicalText(source));
  let normalized = protectedText.text;
  const replacements = [
    ['Custom resolve', 'تسوية مخصّصة'],
    ['debug marker', 'علامة تصحيح'],
    ['Debug Marker', 'علامة تصحيح'],
    ['mesh shaders', 'شيدرات الشبكة'],
    ['mesh shader', 'شيدر الشبكة'],
    ['mesh tasks', 'مهام الشبكة'],
    ['mesh task', 'مهمة شبكة'],
    ['execution graph', 'مخطط التنفيذ'],
    ['data graph', 'مخطط البيانات'],
    ['tensor', 'موتر'],
    ['micromap', 'ميكروماب'],
    ['Acceleration Structures', 'بنى التسارع'],
    ['Acceleration Structure', 'بنية التسارع'],
    ['layout', 'تخطيط'],
    ['template', 'قالب'],
    ['descriptor sets', 'مجموعات الواصفات'],
    ['descriptor set', 'مجموعة الواصفات'],
    ['query pool', 'مجموعة الاستعلامات'],
    ['swapchain', 'سلسلة التبديل'],
    ['fences', 'الأسِيجة'],
    ['fence', 'سياج'],
    ['semaphores', 'الإشارات'],
    ['semaphore', 'إشارة'],
    ['pipeline', 'خط الأنابيب'],
    ['resolve', 'التسوية']
  ];

  replacements.forEach(([english, arabic]) => {
    normalized = replaceStandaloneTechnicalPhrase(normalized, english, arabic);
  });

  return cleanText(protectedText.restore(normalized)).replace(/\s+([،.])/g, '$1');
}

function normalizeTypeReferenceFormatting(text) {
  return cleanText(String(text || '').replace(/\s*::\s*/g, '::'));
}

function stripFunctionUsageLead(text) {
  return cleanText(
    String(text || '')
      .replace(/^تُستخدم هذه الدالة من أجل:\s*/g, '')
      .replace(/^تُستخدم الدالة\s+vk[A-Za-z0-9_]+\s+من أجل\s*/g, '')
  ).replace(/[.؟!]+$/g, '');
}

function toFunctionIntentPhrase(text) {
  let body = descriptionBody(text);
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

  return cleanText(body);
}

function isGenericFunctionPlaceholder(text) {
  const body = cleanText(String(text || '').replace(/^الوصف الرسمي:\s*/g, ''));
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

function localizeFunctionNameLine(text) {
  let localized = repairCorruptedTechnicalText(
    stripFunctionUsageLead(
      String(text || '')
        .replace(/^الوصف الرسمي:\s*/g, '')
        .replace(/^المعنى الأساسي لهذه الدالة:\s*/g, '')
    )
  );
  if (!localized) {
    return '';
  }

  const returnsPropertiesMatch = localized.match(/Returns properties describing what\s+(.+?)\s+are supported\.*$/i);
  if (returnsPropertiesMatch) {
    return normalizeSentence(`إرجاع خصائص تصف ${returnsPropertiesMatch[1]} المدعومة`);
  }

  if (!hasLatinText(localized)) {
    return normalizeSentence(localized);
  }

  const directReplacements = [
    [/^Acquire the profiling lock$/i, 'اكتساب قفل التحليل الأدائي قبل بدء القياس أو الاستعلامات الأدائية'],
    [/^Acquire access to VkDisplayKHR$/i, 'اكتساب الوصول إلى VkDisplayKHR'],
    [/^Acquire access to VkDisplayKHR using Xlib$/i, 'اكتساب الوصول إلى VkDisplayKHR باستخدام Xlib'],
    [/^Acquire access to VkDisplayKHR using Winrt$/i, 'اكتساب الوصول إلى VkDisplayKHR باستخدام Winrt'],
    [/^اكتساب access to VkDisplayKHR باستخدام Xlib$/i, 'اكتساب الوصول إلى VkDisplayKHR باستخدام Xlib'],
    [/^اكتساب access to VkDisplayKHR باستخدام Winrt$/i, 'اكتساب الوصول إلى VkDisplayKHR باستخدام Winrt'],
    [/^الحصول على إمكانية الوصول إلى VkDisplayKHR باستخدام DRM$/i, 'اكتساب الوصول إلى VkDisplayKHR باستخدام DRM'],
    [/^Query calibrated timestamps$/i, 'استعلام عن الطوابع الزمنية المُعايرة'],
    [/^Query performance query capability$/i, 'استعلام عن قدرة استعلامات الأداء'],
    [/^Define beginning for conditional rendering block$/i, 'تحديد بداية كتلة الرسم الشرطي'],
    [/^Begins shader resolve operation$/i, 'بدء عملية resolve للشيدر'],
    [/^Open command buffer debug label region$/i, 'فتح نطاق تسمية تصحيحية داخل مخزن الأوامر'],
    [/^Begin per-tile execution mode$/i, 'بدء وضع التنفيذ لكل بلاطة'],
    [/^Begin query$/i, 'بدء استعلام'],
    [/^Begin indexed query$/i, 'بدء استعلام مفهرس'],
    [/^Begin dynamic rendering$/i, 'بدء الرسم الديناميكي'],
    [/^Begin a render pass$/i, 'بدء تمرير رسم'],
    [/^Bind descriptor buffers to a command buffer$/i, 'ربط مخازن الواصفات بمخزن الأوامر'],
    [/^Bind embedded immutable sampler offsets in a command buffer$/i, 'ربط إزاحات السامبلرات المضمّنة غير القابلة للتغيير داخل مخزن الأوامر'],
    [/^Bind shader objects to a command buffer$/i, 'ربط كائنات الشيدر بمخزن الأوامر'],
    [/^Bind transform feedback buffers to a command buffer$/i, 'ربط مخازن التغذية الراجعة للتحويل بمخزن الأوامر'],
    [/^Bind vertex buffers to a command buffer and dynamically set strides$/i, 'ربط مخازن الرؤوس بمخزن الأوامر مع ضبط stride ديناميكياً'],
    [/^Blit image regions, potentially performing format conversion$/i, 'نسخ مناطق من صورة إلى أخرى مع إمكانية إجراء تحويل في التنسيق'],
    [/^Clear regions within bound framebuffer attachments$/i, 'تصفير مناطق ضمن المرفقات المرتبطة حالياً بمخزن الإطارات'],
    [/^Clear color المناطق within an image$/i, 'تصفير مناطق اللون داخل صورة'],
    [/^Fill depth\/stencil regions within an image$/i, 'ملء مناطق العمق والاستنسل داخل صورة'],
    [/^Begin video coding scope$/i, 'بدء نطاق ترميز الفيديو'],
    [/^Copy data between buffer regions$/i, 'نسخ البيانات بين مناطق المخازن'],
    [/^Insert a marker label into a command buffer$/i, 'إدراج علامة marker داخل مخزن الأوامر'],
    [/^Decompress data between memory regions$/i, 'فك ضغط البيانات بين مناطق الذاكرة'],
    [/^Indirect decompress data between memory regions$/i, 'فك ضغط البيانات بين مناطق الذاكرة بطريقة غير مباشرة'],
    [/^Decompress memory containing compressed data$/i, 'فك ضغط الذاكرة التي تحتوي على بيانات مضغوطة'],
    [/^Dispatch compute work items with non-zero base values for workgroup IDs$/i, 'إطلاق مجموعات عمل الحوسبة مع قيم أساس غير صفرية لمعرفات مجموعات العمل'],
    [/^Dispatch compute work items using indirect parameters$/i, 'إطلاق مجموعات عمل الحوسبة باستخدام معاملات غير مباشرة'],
    [/^Dispatch compute work items with indirect parameters$/i, 'إطلاق مجموعات عمل الحوسبة باستخدام معاملات غير مباشرة'],
    [/^Dispatch per-tile work items$/i, 'إطلاق عمل حوسبي لكل بلاطة'],
    [/^Dispatch a data graph pipeline within a session$/i, 'إطلاق خط أنابيب data graph داخل جلسة'],
    [/^Dispatch an execution graph$/i, 'إطلاق execution graph'],
    [/^Dispatch an execution graph with node and payload parameters read on the device$/i, 'إطلاق execution graph مع قراءة معاملات العقدة والحمولة من الجهاز'],
    [/^Dispatch an execution graph with node and payload parameters read from the device$/i, 'إطلاق execution graph مع قراءة معاملات العقدة والحمولة من الجهاز'],
    [/^Dispatch an execution graph with all parameters read on the device$/i, 'إطلاق execution graph مع قراءة جميع المعاملات من الجهاز'],
    [/^Launch CUDA kernel work on the device$/i, 'إطلاق نواة CUDA على الجهاز'],
    [/^Build a micromap$/i, 'بناء ميكروماب'],
    [/^Build or move cluster acceleration structures$/i, 'بناء أو نقل بنى تسارع عنقودية'],
    [/^Acquires the profiling lock$/i, 'اكتساب قفل التحليل الأدائي قبل بدء القياس أو الاستعلامات الأدائية'],
    [/^Deferred compilation of shaders$/i, 'تنفيذ الترجمة المؤجلة للشيدر داخل خط الأنابيب المحدد'],
    [/^Set line width dynamically for a command buffer$/i, 'ضبط عرض الخط ديناميكياً داخل مخزن الأوامر ليتأثر به الرسم اللاحق'],
    [/^Build an acceleration structure on the host$/i, 'بناء بنية تسارع على المضيف'],
    [/^Build a micromap on the host$/i, 'بناء ميكروماب على المضيف'],
    [/^Clear shader instrumentation metrics to zero$/i, 'تصفير مقاييس تتبع الشيدر المجمعة سابقاً'],
    [/^Convert a cooperative vector matrix from one layout and type to another$/i, 'تحويل مصفوفة متجهات تعاونية من تخطيط ونوع إلى تخطيط ونوع آخر'],
    [/^Copy an acceleration structure on the host$/i, 'نسخ بنية تسارع على المضيف'],
    [/^Serialize an acceleration structure on the host$/i, 'تسلسل بنية تسارع على المضيف لتصبح قابلة للحفظ أو النقل'],
    [/^Deserialize an acceleration structure on the host$/i, 'إعادة بناء بنية تسارع على المضيف من بيانات متسلسلة'],
    [/^Copy image data using the host$/i, 'نسخ بيانات الصورة باستخدام المضيف'],
    [/^Copy image data into host memory$/i, 'نسخ بيانات الصورة إلى ذاكرة المضيف'],
    [/^Copy data from host memory into an image$/i, 'نسخ بيانات من ذاكرة المضيف إلى صورة'],
    [/^Deserialize a micromap on the host$/i, 'إعادة بناء ميكروماب على المضيف من بيانات متسلسلة'],
    [/^Copy a micromap on the host$/i, 'نسخ ميكروماب على المضيف'],
    [/^Serialize a micromap on the host$/i, 'تسلسل ميكروماب على المضيف لتصبح بياناته قابلة للحفظ أو النقل'],
    [/^Give an application-defined name to an object$/i, 'إسناد اسم يحدده التطبيق إلى كائن Vulkan لتسهيل التتبع والتصحيح'],
    [/^Attach arbitrary data to an object$/i, 'إرفاق بيانات يحددها التطبيق بكائن Vulkan لأغراض التتبع أو التصحيح'],
    [/^Inject a message into a debug stream$/i, 'حقن رسالة داخل تدفق التصحيح'],
    [/^Assign a thread to a deferred operation$/i, 'إسناد خيط تنفيذ إلى عملية مؤجلة للمساهمة في إكمالها'],
    [/^Set the power state of a display$/i, 'ضبط حالة طاقة الشاشة'],
    [/^Export Metal objects from the corresponding Vulkan objects$/i, 'تصدير كائنات Metal المقابلة لكائنات Vulkan الحالية'],
    [/^Import a fence from a POSIX file descriptor$/i, 'استيراد سياج من واصف ملف POSIX'],
    [/^Import a fence from a Windows HANDLE$/i, 'استيراد سياج من مقبض Windows HANDLE'],
    [/^Import a semaphore from a POSIX file descriptor$/i, 'استيراد إشارة من واصف ملف POSIX'],
    [/^Import a semaphore from a Windows HANDLE$/i, 'استيراد إشارة من مقبض Windows HANDLE'],
    [/^Import a semaphore from a Zircon event handle$/i, 'استيراد إشارة من مقبض حدث Zircon'],
    [/^Initialize a device for performance queries$/i, 'تهيئة الجهاز لاستخدام استعلامات الأداء'],
    [/^Invalidate ranges of mapped memory objects$/i, 'إبطال نطاقات من الذاكرة المربوطة بالمضيف لتحديث البيانات المقروءة منها'],
    [/^Trigger low latency mode Sleep$/i, 'تشغيل مرحلة الانتظار الخاصة بوضع الكمون المنخفض'],
    [/^Combine the data stores of pipeline caches$/i, 'دمج مخازن البيانات التابعة لمخابئ خطوط الأنابيب'],
    [/^Combine the data stores of validation caches$/i, 'دمج مخازن البيانات التابعة لمخابئ التحقق'],
    [/^Register a custom border color$/i, 'تسجيل لون حدود مخصص يمكن استخدامه مع السامبلرات'],
    [/^Signal a fence when a device event occurs$/i, 'تفعيل السياج عند حدوث حدث على مستوى الجهاز'],
    [/^Signal a fence when a display event occurs$/i, 'تفعيل السياج عند حدوث حدث متعلق بالشاشة'],
    [/^Release captured pipeline binary data$/i, 'تحرير البيانات الثنائية الملتقطة لخط الأنابيب بعد انتهاء الحاجة إليها'],
    [/^Release access to an acquired VkDisplayKHR$/i, 'تحرير الوصول إلى VkDisplayKHR سبق اكتسابه'],
    [/^Release full-screen exclusive mode from a swapchain$/i, 'تحرير وضع ملء الشاشة الحصري من سلسلة التبديل'],
    [/^Provide information to reduce latency$/i, 'تمرير معلومات تساعد التنفيذ على تقليل الكمون']
  ];

  for (const [pattern, replacement] of directReplacements) {
    if (pattern.test(localized)) {
      return normalizeSentence(replacement);
    }
  }

  const phraseMap = [
    ['access to VkDisplayKHR', 'الوصول إلى VkDisplayKHR'],
    ['access to', 'الوصول إلى'],
    ['access', 'وصول'],
    ['dynamic rendering instance', 'مثيل الرسم الديناميكي'],
    ['render pass instance', 'مثيل تمرير الرسم'],
    ['new render pass', 'تمرير رسم جديد'],
    ['beginning for', 'بداية'],
    ['debug utils label region', 'نطاق تسمية تصحيحية Debug Utils'],
    ['resolve operation', 'عملية resolve'],
    ['offsets', 'الإزاحات'],
    ['offset', 'الإزاحة'],
    ['active in', 'فعّالة داخل'],
    ['object', 'كائن'],
    ['objects', 'كائنات'],
    ['shading rate', 'معدل التظليل'],
    ['tile', 'بلاطة'],
    ['vertex', 'رأس'],
    ['strides', 'قيم stride'],
    ['stride', 'قيمة stride'],
    ['regions', 'مناطق'],
    ['region', 'منطقة'],
    ['format conversion', 'تحويل في التنسيق'],
    ['color image', 'صورة اللون'],
    ['combined depth/stencil image', 'صورة depth/stencil مشتركة'],
    ['depth/stencil image', 'صورة depth/stencil'],
    ['within bound framebuffer attachments', 'داخل المرفقات المرتبطة بمخزن الإطارات'],
    ['video coding parameters', 'معلمات ترميز الفيديو'],
    ['data between buffer regions', 'بيانات بين مناطق المخازن'],
    ['some parameters provided on device', 'مع تمرير بعض المعاملات من ذاكرة الجهاز'],
    ['command for building', 'أمر لبناء'],
    ['binding', 'ربط'],
    ['setting', 'ضبط'],
    ['open', 'فتح'],
    ['begin', 'بدء'],
    ['begins', 'بدء'],
    ['define', 'تحديد'],
    ['make', 'جعل'],
    ['fill', 'ملء'],
    ['calibrated timestamps', 'الطوابع الزمنية المُعايرة'],
    ['calibrated timestamp values', 'قيم الطوابع الزمنية المُعايرة'],
    ['timestamp calibration', 'معايرة الطوابع الزمنية'],
    ['timestamp values', 'قيم الطوابع الزمنية'],
    ['time domains', 'نطاقات الزمن'],
    ['maximum deviation', 'الانحراف الأقصى'],
    ['returned maximum deviation', 'الانحراف الأقصى المُعاد'],
    ['performance query capability', 'قدرة استعلامات الأداء'],
    ['conditional rendering block', 'كتلة الرسم الشرطي'],
    ['conditional rendering', 'الرسم الشرطي'],
    ['shader resolve operation', 'عملية resolve للشيدر'],
    ['debug label region', 'نطاق تسمية تصحيحية'],
    ['per-tile execution mode', 'وضع التنفيذ لكل بلاطة'],
    ['per-tile execution', 'التنفيذ لكل بلاطة'],
    ['transform feedback', 'التغذية الراجعة للتحويل'],
    ['transform feedback buffers', 'مخازن التغذية الراجعة للتحويل'],
    ['shader instrumentation', 'تتبع الشيدر'],
    ['video coding scope', 'نطاق ترميز الفيديو'],
    ['video coding', 'ترميز الفيديو'],
    ['embedded immutable samplers', 'السامبلرات المضمّنة غير القابلة للتغيير'],
    ['immutable samplers', 'سامبلرات غير قابلة للتغيير'],
    ['descriptor buffers', 'مخازن الواصفات'],
    ['descriptor buffer', 'مخزن الواصفات'],
    ['invocation mask', 'قناع الاستدعاء'],
    ['resource heap', 'كومة الموارد'],
    ['sampler heap', 'كومة السامبلرات'],
    ['shader objects', 'كائنات الشيدر'],
    ['shading rate image', 'صورة معدل التظليل'],
    ['tile memory', 'ذاكرة البلاطات'],
    ['vertex buffers', 'مخازن الرؤوس'],
    ['vertex buffer', 'مخزن الرؤوس'],
    ['buffers', 'المخازن'],
    ['buffer', 'المخزن'],
    ['bindings', 'نقاط الربط'],
    ['binding', 'نقطة الربط'],
    ['attachments', 'المرفقات'],
    ['attachment', 'المرفق'],
    ['image regions', 'مناطق الصورة'],
    ['images', 'الصور'],
    ['image', 'الصورة'],
    ['command buffer', 'مخزن الأوامر'],
    ['query capability', 'قدرة الاستعلام'],
    ['query pool', 'مجموعة الاستعلامات'],
    ['query', 'استعلام'],
    ['queries', 'استعلامات'],
    ['shader instrumentation metrics', 'مقاييس تتبع الشيدر'],
    ['profiling lock', 'قفل التحليل الأدائي'],
    ['line width', 'عرض الخط'],
    ['cooperative vector matrix', 'مصفوفة المتجهات التعاونية'],
    ['acceleration structures', 'بنى التسارع'],
    ['acceleration structure', 'بنية التسارع'],
    ['ray tracing', 'تتبع الأشعة'],
    ['host memory', 'ذاكرة المضيف'],
    ['on the host', 'على المضيف'],
    ['using the host', 'باستخدام المضيف'],
    ['debug stream', 'تدفق التصحيح'],
    ['pipeline caches', 'مخابئ خطوط الأنابيب'],
    ['validation caches', 'مخابئ التحقق'],
    ['custom border color', 'لون حدود مخصص'],
    ['full-screen exclusive mode', 'وضع ملء الشاشة الحصري'],
    ['device event', 'حدث على مستوى الجهاز'],
    ['display event', 'حدث متعلق بالشاشة'],
    ['reduce latency', 'تقليل الكمون'],
    ['low latency mode', 'وضع الكمون المنخفض'],
    ['captured pipeline binary data', 'البيانات الثنائية الملتقطة لخط الأنابيب']
  ];

  phraseMap.forEach(([english, arabic]) => {
    localized = replaceStandaloneTechnicalPhrase(localized, english, arabic);
  });

  const protectedLocalized = protectTechnicalIdentifiers(localized);
  localized = protectedLocalized.text;

  const genericVerbReplacements = [
    [/^Open (.+)$/i, 'فتح $1'],
    [/^Begin (.+)$/i, 'بدء $1'],
    [/^Begins (.+)$/i, 'بدء $1'],
    [/^Define (.+)$/i, 'تحديد $1'],
    [/^Make (.+) active in (.+)$/i, 'جعل $1 فعّالة داخل $2'],
    [/^Setting (.+)$/i, 'ضبط $1'],
    [/^Binding (.+)$/i, 'ربط $1'],
    [/^Fill (.+)$/i, 'ملء $1'],
    [/^Command for building (.+)$/i, 'أمر لبناء $1'],
    [/^Set (.+)$/i, 'ضبط $1'],
    [/^Sets (.+)$/i, 'ضبط $1'],
    [/^Acquire (.+)$/i, 'اكتساب $1'],
    [/^Acquires (.+)$/i, 'اكتساب $1'],
    [/^Create (.+)$/i, 'إنشاء $1'],
    [/^Creates (.+)$/i, 'إنشاء $1'],
    [/^Destroy (.+)$/i, 'تدمير $1'],
    [/^Destroys (.+)$/i, 'تدمير $1'],
    [/^Copy (.+)$/i, 'نسخ $1'],
    [/^Copies (.+)$/i, 'نسخ $1'],
    [/^Serialize (.+)$/i, 'تسلسل $1'],
    [/^Deserialize (.+)$/i, 'إعادة بناء $1 من بيانات متسلسلة'],
    [/^Import (.+)$/i, 'استيراد $1'],
    [/^Export (.+)$/i, 'تصدير $1'],
    [/^Build (.+)$/i, 'بناء $1'],
    [/^Clear (.+)$/i, 'تصفير $1'],
    [/^Initialize (.+)$/i, 'تهيئة $1'],
    [/^Invalidate (.+)$/i, 'إبطال $1'],
    [/^Query (.+)$/i, 'استعلام عن $1'],
    [/^Retrieve (.+)$/i, 'استرجاع $1'],
    [/^Report (.+)$/i, 'الإبلاغ عن $1'],
    [/^Reports (.+)$/i, 'الإبلاغ عن $1'],
    [/^Return (.+)$/i, 'إرجاع $1'],
    [/^Returns (.+)$/i, 'إرجاع $1'],
    [/^Provide (.+)$/i, 'توفير $1'],
    [/^Assign (.+)$/i, 'إسناد $1'],
    [/^Trigger (.+)$/i, 'تشغيل $1'],
    [/^Register (.+)$/i, 'تسجيل $1'],
    [/^Release (.+)$/i, 'تحرير $1'],
    [/^Update (.+)$/i, 'تحديث $1'],
    [/^Write (.+)$/i, 'كتابة $1'],
    [/^Wait (.+)$/i, 'الانتظار حتى $1'],
    [/^Reset (.+)$/i, 'إعادة تعيين $1'],
    [/^Begin (.+)$/i, 'بدء $1'],
    [/^End (.+)$/i, 'إنهاء $1'],
    [/^Push(?:es)? (.+)$/i, 'دفع $1'],
    [/^Dispatch(?:es)? (.+)$/i, 'إطلاق $1'],
    [/^Draw(?:s)? (.+)$/i, 'تنفيذ رسم لـ $1'],
    [/^Bind(?:s)? (.+)$/i, 'ربط $1'],
    [/^Control (.+)$/i, 'التحكم في $1'],
    [/^Issue (.+)$/i, 'إصدار $1'],
    [/^Execute (.+)$/i, 'تنفيذ $1'],
    [/^Generate (.+)$/i, 'توليد $1']
  ];

  for (const [pattern, replacement] of genericVerbReplacements) {
    if (pattern.test(localized)) {
      localized = localized.replace(pattern, replacement);
      break;
    }
  }

  const connectorMap = [
    [/\bthe\b/gi, ''],
    [/\ban\b/gi, ''],
    [/\ba\b/gi, ''],
    [/\bfrom\b/gi, 'من'],
    [/\bto\b/gi, 'إلى'],
    [/\binto\b/gi, 'إلى'],
    [/\bof\b/gi, 'لـ'],
    [/\bon\b/gi, 'على'],
    [/\bfor\b/gi, 'لـ'],
    [/\bwith\b/gi, 'مع'],
    [/\busing\b/gi, 'باستخدام'],
    [/\bdynamically\b/gi, 'ديناميكياً'],
    [/\band\b/gi, 'و']
  ];

  connectorMap.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });

  localized = protectedLocalized.restore(localized);
  const translated = translateTechnicalText(localized);
  if (translated && !hasLatinText(translated)) {
    return normalizeSentence(translated);
  }

  return normalizeSentence(localized);
}

function localizeFunctionUsageEntry(entry, functionName = '') {
  const text = cleanText(entry);
  if (!text) {
    return '';
  }

  if (/^تُستخدم هذه الدالة من أجل:/.test(text) || /^تُستخدم الدالة\s+vk[A-Za-z0-9_]+\s+من أجل/.test(text)) {
    const localizedNameLine = localizeFunctionNameLine(text);
    if (localizedNameLine && !isGenericFunctionPlaceholder(localizedNameLine)) {
      return `تُستخدم هذه الدالة من أجل: ${descriptionBody(localizedNameLine)}.`;
    }
  }

  if (isGenericFunctionPlaceholder(text) && functionName) {
    return `تُستخدم هذه الدالة من أجل: ${normalizeFunctionExplanationText(toFunctionIntentPhrase(inferFunctionDescription(functionName)) || descriptionBody(inferFunctionDescription(functionName)))}.`;
  }

  if (!hasLatinText(text)) {
    return normalizeSentence(normalizeFunctionExplanationText(text));
  }

  return normalizeSentence(normalizeFunctionExplanationText(translateTechnicalText(text)));
}

function hasResidualEnglishProse(text) {
  const cleaned = cleanText(String(text || ''))
    .replace(/\b(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+)\b/g, ' ')
    .replace(/\b(pp?[A-Z][A-Za-z0-9_]*)\b/g, ' ')
    .replace(/\b[a-z]+(?:[A-Z][A-Za-z0-9_]*)+\b/g, ' ')
    .replace(/\b(?:NULL|void|DRM|Xlib|Winrt|POSIX|HANDLE|Metal|Windows|Zircon|X11)\b/g, ' ');

  return /\b(?:the|this|that|these|those|when|where|with|from|into|before|after|during|until|again|created|drawing|granted|associated|acquired|released|terminated|application|applications|graphics|pipeline|display|memory|objects|query|queries|device|image|images|command|commands|buffer|buffers|must|should|will|used|use|value|values|not|affected|supported|permissions|exclusive|control|return|returns|signal|record|submitted|submit|presentation|present)\b/i.test(cleaned);
}

function isGenericGeneratedUsageLine(text) {
  const body = cleanText(text);
  return [
    /^تُستخدم هذه الدالة من أجل:/,
    /^تُستخدم الدالة\s+vk[A-Za-z0-9_]+\s+من أجل/,
    /^المعنى الأساسي لهذه الدالة:/,
    /^قبل الاستدعاء جهّز المعاملات الأساسية/,
    /^قد تكتب الدالة نواتجها في معاملات الإخراج/,
    /^هذه الدالة مرتبطة بالامتداد/,
    /^بعد الاستدعاء افحص القيمة المرجعة/,
    /^تعيد الدالة VkResult/,
    /^تعيد الدالة قيمة من النوع/,
    /^لا تعيد هذه الدالة قيمة مباشرة/,
    /^لا تعيد الدالة قيمة/
  ].some((pattern) => pattern.test(body));
}

function buildFunctionMeaningLine(description) {
  const body = normalizeFunctionExplanationText(descriptionBody(description));
  if (!body) {
    return '';
  }
  return `المعنى الأساسي لهذه الدالة: ${normalizeSentence(body)}`;
}

function buildSpecificFunctionUsage(name, description, returnType, extension) {
  const usage = [];
  const meaningLine = buildFunctionMeaningLine(description);
  if (meaningLine) {
    usage.push(meaningLine);
  }

  if (/^vkCmdDraw$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر الرسم الأساسي غير المفهرس، بحيث يقرأ خط الأنابيب الرؤوس بالتسلسل من مخازن الرؤوس المرتبطة ويولّد منها المجسمات أو البدائيات المطلوبة.');
    usage.push('هذا يفيد عندما تكون بيانات الرؤوس مرتبة مباشرة من دون الحاجة إلى مخزن فهارس، أو عندما تريد رسم مجموعة بسيطة من الرؤوس كما هي بالترتيب المحدد.');
  }

  if (/^vkCmdDrawIndexed$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم مفهرس، بحيث تُعاد الاستفادة من الرؤوس عبر مخزن الفهارس بدلاً من تكرار بياناتها داخل مخزن الرؤوس.');
    usage.push('هذا يفيد عندما تشترك عدة مثلثات أو بدائيات في الرؤوس نفسها، لأن الرسم المفهرس يقلل تكرار البيانات ويجعل استخدام الذاكرة وتمرير الرؤوس أكثر كفاءة.');
  }

  if (/^vkCmdDrawIndirect$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم تُقرأ معلماتُه من مخزن في الذاكرة بدلاً من تمرير عدد الرؤوس والنسخ مباشرة من التطبيق.');
    usage.push('هذا يفيد عندما تكون معلمات الرسم تُكتب أو تُحسب مسبقاً على الجهاز أو في مرحلة سابقة، لأن التطبيق لا يحتاج إلى استخراجها وإرسالها مرة أخرى من جهة المضيف.');
  }

  if (/^vkCmdDrawIndexedIndirect$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم مفهرس تُقرأ معلماتُه من مخزن في الذاكرة، مع الاعتماد على مخزن الفهارس لإعادة استخدام الرؤوس.');
    usage.push('هذا يفيد عندما تريد الجمع بين مزايا الرسم المفهرس ومزايا الرسم غير المباشر، خصوصاً إذا كانت معلمات الرسم تنتج ديناميكياً على الجهاز نفسه.');
  }

  if (/^vkCmdDrawMultiEXT$/.test(name)) {
    usage.push('تُستخدم لتسجيل عدة أوامر رسم غير مفهرسة دفعة واحدة ضمن استدعاء واحد، بدلاً من استدعاء أمر رسم منفصل لكل عنصر.');
    usage.push('هذا يفيد عندما تملك عدداً كبيراً من الرسومات الصغيرة أو المتشابهة، لأن جمعها في استدعاء واحد يقلل كلفة تسجيل الأوامر وعدد نداءات الواجهة من جهة التطبيق.');
  }

  if (/^vkCmdDrawMultiIndexedEXT$/.test(name)) {
    usage.push('تُستخدم لتسجيل عدة أوامر رسم مفهرسة دفعة واحدة ضمن استدعاء واحد، مع الاعتماد على مخازن الفهارس لإعادة استخدام الرؤوس.');
    usage.push('هذا يفيد عندما تحتاج إلى تنفيذ عدة رسومات مفهرسة متتالية بكلفة تسجيل أقل، لأن التطبيق يمرر مجموعة أوصاف الرسم مرة واحدة بدلاً من إصدار أمر مستقل لكل رسم.');
  }

  if (/^vkCmdDrawIndirectCount(?:KHR|AMD)?$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن مستقل في الذاكرة، بدلاً من تثبيت هذا العدد مباشرة من التطبيق.');
    usage.push('هذا يفيد عندما يكون عدد الرسومات المطلوب تنفيذه يُحسب أو يُنتج على الجهاز نفسه، لأن المعالج الرسومي يستطيع قراءة العدد والمعلمات من الذاكرة وتنفيذ ما يلزم من دون تدخل المضيف.');
  }

  if (/^vkCmdDrawIndexedIndirectCount(?:KHR|AMD)?$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم مفهرس غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن مستقل في الذاكرة، مع الاعتماد على الفهارس لإعادة استخدام الرؤوس.');
    usage.push('هذا يفيد عندما تكون معلمات الرسم وعدد الأوامر الناتجة ديناميكياً أو مولدة على الجهاز نفسه، لأن التنفيذ يستطيع قراءة العدد والمعلمات مباشرة من الذاكرة مع الاستفادة من الرسم المفهرس.');
  }

  if (/^vkCmdDrawIndirectByteCountEXT$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم يُشتق فيه عدد الرؤوس الفعلي من قيمة عداد بايتات مخزنة في `counterBuffer` بدلاً من تمرير `vertexCount` مباشرة.');
    usage.push('هذا يفيد مع مسارات `transform feedback` أو أي مسار ينتج كمية بيانات رؤوس متغيرة، لأن التطبيق يستطيع الرسم اعتماداً على عدد البايتات المكتوبة فعلياً من مرحلة سابقة على الجهاز.');
  }

  if (/^vkCmdDrawMeshTasks(?:EXT|NV)?$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم يعتمد على mesh shaders، بحيث يُطلق التنفيذ على شكل مجموعات عمل لمهام mesh بدلاً من الاعتماد على خط الأنابيب الرسومي التقليدي المبني على الرؤوس والبدائيات فقط.');
    usage.push('هذا يفيد عندما يستخدم التطبيق مسار mesh shading، لأن تقسيم العمل إلى مجموعات mesh tasks يمنحك مرونة أكبر في توليد الهندسة وتوزيع العمل على الجهاز.');
  }

  if (/^vkCmdDrawMeshTasksIndirect(?:EXT|NV)?$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم mesh shaders مع قراءة معلمات الإطلاق من مخزن في الذاكرة بدلاً من تمريرها مباشرة من التطبيق.');
    usage.push('هذا يفيد عندما تكون معلمات إطلاق mesh tasks تُنتج أو تُحسب على الجهاز نفسه أو في مرحلة سابقة، لأن التنفيذ يستطيع قراءتها مباشرة من الذاكرة.');
  }

  if (/^vkCmdDrawMeshTasksIndirectCount(?:EXT|NV)?$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم mesh shaders غير مباشر مع قراءة عدد أوامر الإطلاق الفعلي من مخزن مستقل في الذاكرة.');
    usage.push('هذا يفيد عندما يكون عدد أوامر mesh tasks المطلوب تنفيذها ديناميكياً أو مولداً على الجهاز، لأن المعالج الرسومي يقرأ العدد والمعلمات مباشرة وينفذ ما يلزم من دون تدخل المضيف.');
  }

  if (/^vkCmdBeginDebugUtilsLabelEXT$/.test(name)) {
    usage.push('تُستخدم لبدء نطاق تسمية تصحيحية داخل مخزن الأوامر، بحيث تستطيع أدوات التحليل والتصحيح إظهار مجموعة الأوامر اللاحقة تحت هذا الاسم أو الوسم.');
    usage.push('هذا يفيد عند تحليل الإطار أو تتبع التنفيذ، لأنك تقسّم تسلسل الأوامر إلى مقاطع معنونة يسهل التعرف عليها داخل أدوات التطوير.');
  }

  if (/^vkCmdInsertDebugUtilsLabelEXT$/.test(name)) {
    usage.push('تُستخدم لإدراج وسم تصحيحي في الموضع الحالي داخل مخزن الأوامر من دون فتح نطاق جديد.');
    usage.push('هذا يفيد لإضافة نقطة مرجعية سريعة داخل تسلسل الأوامر، بحيث تظهر في أدوات التصحيح كعلامة على حدث أو مرحلة محددة.');
  }

  if (/^vkCmdEndDebugUtilsLabelEXT$/.test(name)) {
    usage.push('تُستخدم لإنهاء نطاق التسمية التصحيحية المفتوح حالياً داخل مخزن الأوامر.');
    usage.push('هذا يفيد لإغلاق النطاق التصحيحي بشكل صحيح حتى تعرف أدوات التحليل أين ينتهي المقطع المسمى وتفصل بينه وبين المقاطع التالية.');
  }

  if (/^vkCmdBeginPerTileExecutionQCOM$/.test(name)) {
    usage.push('تُستخدم لبدء نطاق التنفيذ لكل بلاطة داخل مخزن الأوامر، بحيث تُنفذ الأوامر اللاحقة وفق نمط معالجة يعتمد على البلاطات بدلاً من النمط العام.');
    usage.push('هذا يفيد على العتاد الذي يدعم المعالجة لكل بلاطة، لأنك تحدد بداية هذا النطاق بوضوح حتى تستفيد الأوامر اللاحقة من سلوك التنفيذ المحلي المرتبط بالبلاطات.');
  }

  if (/^vkCmdEndPerTileExecutionQCOM$/.test(name)) {
    usage.push('تُستخدم لإنهاء نطاق التنفيذ لكل بلاطة المفتوح حالياً داخل مخزن الأوامر.');
    usage.push('هذا يفيد لإغلاق هذا النطاق بشكل صحيح حتى لا تستمر الأوامر اللاحقة في العمل وفق وضع التنفيذ لكل بلاطة عندما لا يكون ذلك مقصوداً.');
  }

  if (/^vkCmdBeginConditionalRenderingEXT$/.test(name)) {
    usage.push('تُستخدم لبدء نطاق الرسم الشرطي داخل مخزن الأوامر، بحيث تعتمد أوامر الرسم اللاحقة على قيمة شرط مخزنة في مورد أو Buffer مرتبط.');
    usage.push('هذا يفيد عندما تريد أن يقرر الـ GPU نفسه ما إذا كان الرسم التالي سينفذ أم لا، بدلاً من إعادة القرار إلى المضيف بين كل دفعة وأخرى.');
  }

  if (/^vkCmdEndConditionalRenderingEXT$/.test(name)) {
    usage.push('تُستخدم لإنهاء نطاق الرسم الشرطي المفتوح حالياً داخل مخزن الأوامر.');
    usage.push('هذا يفيد لإيقاف تأثير الشرط في الموضع الصحيح حتى لا تستمر أوامر الرسم اللاحقة في الاعتماد على شرط لم يعد مقصوداً.');
  }

  if (/^vkCmdDrawClusterHUAWEI$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم يعتمد على cluster culling، بحيث تُعالج عناقيد الهندسة وتُستبعد العناقيد غير المرئية قبل مرحلة الرسم الفعلية.');
    usage.push('هذا يفيد عندما يكون المشهد كبيراً أو كثيف التفاصيل، لأن استبعاد العناقيد غير المرئية مبكراً يقلل كمية العمل الرسومي والبيانات التي تصل إلى المراحل اللاحقة من خط الأنابيب.');
  }

  if (/^vkCmdDrawClusterIndirectHUAWEI$/.test(name)) {
    usage.push('تُستخدم لتسجيل أمر رسم يعتمد على cluster culling مع قراءة معلمات التنفيذ بشكل غير مباشر من الذاكرة بدلاً من تمريرها مباشرة من التطبيق.');
    usage.push('هذا يفيد عندما تُنتج معلمات الرسم أو عدد العناقيد المطلوب معالجتها على الجهاز نفسه، لأن التنفيذ يستطيع قراءتها مباشرة من الذاكرة من دون تدخل المضيف.');
  }

  if (/^vkCmdDispatchIndirect$/.test(name)) {
    usage.push('تُستخدم عندما تكون أبعاد الإطلاق الخاصة بعمل الحوسبة مكتوبة مسبقاً في مخزن، بحيث يقرأها المعالج الرسومي من الذاكرة عند التنفيذ بدلاً من تمريرها مباشرة من التطبيق.');
    usage.push('هذا يفيد في المسارات التي تُحسب فيها قيم الإطلاق على الجهاز نفسه أو تنتجها مرحلة سابقة، لأن التطبيق لا يحتاج إلى إعادة قراءة القيم ثم إرسالها من جديد من جهة المضيف.');
  }

  if (/^vkCmdDispatchTileQCOM$/.test(name)) {
    usage.push('تُستخدم عندما يكون العمل مقسماً على مستوى بلاطات الشاشة أو بلاطات المعالج الرسومي، بحيث تُنفذ المعالجة لكل بلاطة ضمن سياقها المحلي.');
    usage.push('هذا يفيد على العتاد الذي يعتمد معمارية المعالجة لكل بلاطة، لأنك تستطيع تنفيذ العمل بالقرب من بيانات البلاطة نفسها وتقليل الكلفة المرتبطة بالمعالجة العامة أو بإعادة تمرير البيانات.');
  }

  if (/^vkAcquireNextImageKHR$/.test(name)) {
    usage.push('تُستخدم للحصول على فهرس الصورة التالية الجاهزة من سلسلة التبديل قبل بدء الرسم للإطار الجديد أو قبل تقديم الصورة التالية.');
    usage.push('هذا يفيد لأن التطبيق لا يستطيع الرسم على صورة من صور سلسلة التبديل عشوائياً، بل يجب أولاً أن يطلب من Vulkan أي صورة أصبحت متاحة فعلاً لهذا الإطار.');
  }

  if (/^vkAcquireNextImage2KHR$/.test(name)) {
    usage.push('تُستخدم للحصول على فهرس الصورة التالية الجاهزة من سلسلة التبديل، لكن عبر بنية VkAcquireNextImageInfoKHR التي تسمح بتمرير إعدادات الاكتساب بطريقة أوضح وأكثر قابلية للتوسع.');
    usage.push('هذا يفيد عندما تحتاج صيغة أكثر مرونة من vkAcquireNextImageKHR، لأن معلومات الاكتساب كلها تُجمع في بنية واحدة يمكن توسيعها لاحقاً عبر pNext.');
  }

  if (/^vkBuildAccelerationStructuresKHR$/.test(name)) {
    usage.push('تُستخدم لبناء أو تحديث Acceleration Structures من جهة المضيف مباشرة، مع تمرير أوصاف Geometry ونطاقات الـ Primitives التي ستقرأها Vulkan لتوليد أو تحديث BVH.');
    usage.push('هذا يفيد عندما تريد تشغيل مسار البناء من المضيف بدلاً من تسجيل أمر build داخل Command Buffer، مع بقاء الحاجة إلى Scratch Buffers وأحجام Geometry صحيحة كما في المسار المسجل على الطابور.');
  }

  if (usage.length <= (meaningLine ? 1 : 0) && String(name || '').startsWith('vkCmd')) {
    usage.push(inferGenericCommandBenefit(name));
  }

  if (usage.length <= (meaningLine ? 1 : 0)) {
    return [];
  }

  if (extension) {
    usage.push(`هذه الدالة مرتبطة بالامتداد ${extension} أو إحدى صيغ الامتداد الخاصة به، لذلك يجب التأكد من دعم الامتداد وتفعيله قبل الاستخدام.`);
  }

  if (returnType === 'VkResult') {
    usage.push('تعيد الدالة VkResult لتوضح هل اكتملت العملية بنجاح أو أعادت نتائج جزئية أو فشلت، لذلك تعتمد عليها في تحديد الخطوة التالية في الكود.');
  } else if (returnType && returnType !== 'void') {
    usage.push(`تعيد الدالة قيمة من النوع ${returnType}، لذا ينبغي استخدام النتيجة المرجعة مباشرة أو التحقق منها قبل المتابعة.`);
  } else {
    usage.push('لا تعيد هذه الدالة قيمة مباشرة، ويظهر أثرها على الحالة أو المورد الذي تمرره إليها.');
  }

  return [...new Set(
    usage
      .filter(Boolean)
      .map((entry) => normalizeSentence(normalizeFunctionExplanationText(String(entry).replace(/[.؟!]+$/g, ''))))
  )];
}

function buildLocalizedOfficialFunctionUsage(name, description, parameters, returnType, extension, officialUsage = []) {
  const specificUsage = buildSpecificFunctionUsage(name, description, returnType, extension);
  if (specificUsage.length) {
    return specificUsage;
  }

  const usage = [];
  const meaningLine = buildFunctionMeaningLine(description);
  if (meaningLine) {
    usage.push(meaningLine);
  }

  officialUsage
    .map((entry) => localizeFunctionUsageEntry(entry, name))
    .filter(Boolean)
    .forEach((entry) => {
      if (isGenericGeneratedUsageLine(entry)) {
        return;
      }
      if (hasResidualEnglishProse(entry)) {
        return;
      }
      usage.push(entry);
    });

  if (parameters?.length) {
    const parameterSummary = parameters
      .slice(0, 4)
      .map((param) => `${param.name}: ${descriptionBody(param.description)}`)
      .filter(Boolean)
      .join('، ');

    if (parameterSummary) {
      usage.push(`قبل الاستدعاء جهّز المعاملات الأساسية بالشكل الصحيح، وأهمها: ${parameterSummary}.`);
    }
  }

  const outParameters = (parameters || []).filter(
    (param) => /^p[A-Z]/.test(param.name) && /\*/.test(param.type || '') && !/\bconst\b/.test(param.type || '')
  );
  if (outParameters.length > 0) {
    usage.push(`قد تكتب الدالة نواتجها في معاملات الإخراج مثل ${outParameters.map((param) => param.name).join(' و ')}، لذلك تأكد من تمرير مؤشرات صالحة وقابلة للكتابة.`);
  }

  if (extension) {
    usage.push(`هذه الدالة مرتبطة بالامتداد ${extension} أو إحدى صيغ الامتداد الخاصة به، لذلك يجب التأكد من دعم الامتداد وتفعيله قبل الاستخدام.`);
  }

  if (returnType === 'VkResult') {
    usage.push('تعيد الدالة VkResult لتوضح هل اكتملت العملية بنجاح أو أعادت نتائج جزئية أو فشلت، لذلك تعتمد عليها في تحديد الخطوة التالية في الكود.');
  } else if (returnType && returnType !== 'void') {
    usage.push(`تعيد الدالة قيمة من النوع ${returnType}، لذا ينبغي استخدام النتيجة المرجعة مباشرة أو التحقق منها قبل المتابعة.`);
  } else {
    usage.push('لا تعيد هذه الدالة قيمة مباشرة، ويظهر أثرها على الحالة أو المورد الذي تمرره إليها.');
  }

  return [...new Set(usage.filter(Boolean))];
}

function translateTechnicalText(text) {
  let localized = cleanText(repairCorruptedTechnicalText(text));
  if (!localized || !hasLatinText(localized)) {
    return normalizeSentence(localized);
  }

  const directParagraphReplacements = [
    [
      /^The maximum deviation may vary between calls to (vk[A-Za-z0-9_]+) even for the same set of time domains due to implementation and platform specific reasons\. It is the application’s responsibility to assess whether the returned maximum deviation makes the timestamp values suitable for any particular purpose and can choose to re-issue the timestamp calibration call pursuing a lower deviation value\.?$/i,
      'قد يختلف الانحراف الأقصى بين استدعاء وآخر للدالة $1 حتى مع نفس مجموعة نطاقات الزمن، وذلك لأسباب تتعلق بالتنفيذ والمنصة. تقع على التطبيق مسؤولية تقييم ما إذا كان الانحراف الأقصى المُعاد يجعل قيم الطوابع الزمنية مناسبة للغرض المطلوب، ويمكنه إعادة استدعاء معايرة الطوابع الزمنية إذا أراد الحصول على انحراف أقل'
    ],
    [
      /^Calibrated timestamp values can be extrapolated to estimate future coinciding timestamp values, however, depending on the nature of the time domains and other properties of the platform extrapolating values over a sufficiently long period of time may no longer be accurate enough to fit any particular purpose, so applications are expected to re-calibrate the timestamps on a regular basis\.?$/i,
      'يمكن استقراء قيم الطوابع الزمنية المُعايرة لتقدير قيم طوابع زمنية مستقبلية متزامنة، لكن دقة هذا الاستقراء قد تنخفض مع مرور فترة زمنية طويلة بحسب طبيعة نطاقات الزمن وخصائص المنصة، لذلك يُتوقع من التطبيقات أن تعيد معايرة الطوابع الزمنية بشكل دوري'
    ],
    [
      /^This command fulfills the same task as (vk[A-Za-z0-9_]+) but is executed by the host\.?$/i,
      'ينفذ هذا الاستدعاء المهمة نفسها التي تنفذها الدالة $1، لكنه يُنفذ من جهة المضيف بدلاً من أمر مسجل على الطابور'
    ],
    [
      /^On some implementations, it may be more efficient to batch memory bindings into a single command\.?$/i,
      'في بعض التطبيقات التنفيذية قد يكون من الأكثر كفاءة تجميع عمليات ربط الذاكرة في استدعاء واحد'
    ],
    [
      /^Implementations may allow multiple actors to hold the profiling lock concurrently\.?$/i,
      'قد تسمح بعض التطبيقات التنفيذية لأكثر من جهة بالاحتفاظ بقفل التحليل الأدائي في الوقت نفسه'
    ]
  ];

  for (const [pattern, replacement] of directParagraphReplacements) {
    if (pattern.test(localized)) {
      return normalizeSentence(localized.replace(pattern, replacement));
    }
  }

  const mixedEnumerateMatch = localized.match(
    /^If\s+([A-Za-z0-9_]+)\s+is\s+NULL\s*,?\s*then\s+the\s+number\s+of\s+(.+?)\s+available\s+is\s+returned\s+in\s+([A-Za-z0-9_]+)\.\s*Otherwise\s*,?\s*([A-Za-z0-9_]+)\s+must\s+point\s+to\s+a\s+variable\s+set\s+by\s+the\s+application\s+to\s+the\s+number\s+of\s+elements\s+in\s+the\s+([A-Za-z0-9_]+)\s+array\s*,?\s*and\s+on\s+(?:return|يعيد)\s+the\s+variable\s+is\s+overwritten\s+(?:with|مع)\s+the\s+number\s+of\s+structures\s+actually\s+written\s+to\s+([A-Za-z0-9_]+)\.\s*If\s+([A-Za-z0-9_]+)\s+is\s+less\s+than\s+the\s+number(?:\s+of)?\s+(.+?)\s+available\s*,?\s*at\s+most\s+([A-Za-z0-9_]+)\s+structures\s+will\s+be\s+written\s*,?\s*and\s+(VK_[A-Z0-9_]+)\s+will\s+be\s+returned\s+instead\s+of\s+(VK_[A-Z0-9_]+)\s*,?\s*to\s+indicate\s+that\s+not\s+all\s+the\s+available\s+(.+?)\s+were\s+returned\.?$/i
  );
  if (mixedEnumerateMatch) {
    const [, nullPointer, availableItems, countOut, countParam, arrayName, outputArray, comparedCount, availableItemsAgain, maxCount, incompleteCode, successCode, availableItemsFinal] = mixedEnumerateMatch;
    return normalizeSentence(
      `إذا كان ${nullPointer} يساوي NULL، فسيُعاد عدد ${availableItems} المتاحة في ${countOut}. وإلا فيجب أن يشير ${countParam} إلى متغير يضبطه التطبيق على عدد العناصر الموجودة في المصفوفة ${arrayName}، وعند عودة الدالة تُستبدل قيمة هذا المتغير بعدد البنى التي كُتبت فعلياً إلى ${outputArray}. وإذا كانت قيمة ${comparedCount} أقل من عدد ${availableItemsAgain} المتاحة، فسيُكتب بحد أقصى ${maxCount} بنية، وستُعاد القيمة ${incompleteCode} بدلاً من ${successCode} للدلالة على أن الدالة لم تُعد كل ${availableItemsFinal} المتاحة`
    );
  }

  const replacements = [
    [/^Returns properties describing what (.+?) are supported\.?$/i, 'تعيد خصائص تصف $1 المدعومة'],
    [/^If\s+([A-Za-z0-9_]+)\s+is\s+NULL\s*,?\s*then\s+the\s+number\s+of\s+(.+?)\s+available\s+is\s+returned\s+in\s+([A-Za-z0-9_]+)\.\s*Otherwise\s*,?\s*([A-Za-z0-9_]+)\s+must\s+point\s+to\s+a\s+variable\s+set\s+by\s+the\s+application\s+to\s+the\s+number\s+of\s+elements\s+in\s+the\s+([A-Za-z0-9_]+)\s+array\s*,?\s*and\s+on\s+return\s+the\s+variable\s+is\s+overwritten\s+with\s+the\s+number\s+of\s+structures\s+actually\s+written\s+to\s+([A-Za-z0-9_]+)\.\s*If\s+([A-Za-z0-9_]+)\s+is\s+less\s+than\s+the\s+number(?:\s+of)?\s+(.+?)\s+available\s*,?\s*at\s+most\s+([A-Za-z0-9_]+)\s+structures\s+will\s+be\s+written\s*,?\s*and\s+(VK_[A-Z0-9_]+)\s+will\s+be\s+returned\s+instead\s+of\s+(VK_[A-Z0-9_]+)\s*,?\s*to\s+indicate\s+that\s+not\s+all\s+the\s+available\s+(.+?)\s+were\s+returned\.?$/i, 'إذا كان $1 يساوي NULL، فسيُعاد عدد $2 المتاحة في $3. وإلا فيجب أن يشير $4 إلى متغير يضبطه التطبيق على عدد العناصر الموجودة في المصفوفة $5، وعند عودة الدالة تُستبدل قيمة هذا المتغير بعدد البنى التي كُتبت فعلياً إلى $6. وإذا كانت قيمة $7 أقل من عدد $8 المتاحة، فسيُكتب بحد أقصى $9 بنية، وستُعاد القيمة $10 بدلاً من $11 للدلالة على أن الدالة لم تُعد كل $12 المتاحة'],
    [/^If ([A-Za-z0-9_]+) is NULL, then the number of (.+) available is returned in ([A-Za-z0-9_]+)\.?$/i, 'إذا كان $1 يساوي NULL، فسيُعاد عدد $2 المتاحة في $3'],
    [/^Otherwise, ([A-Za-z0-9_]+) must point to a variable set by the application to the number of elements in the ([A-Za-z0-9_]+) array, and on return the variable is overwritten with the number of structures actually written to ([A-Za-z0-9_]+)\.?$/i, 'وإلا فيجب أن يشير $1 إلى متغير يضبطه التطبيق على عدد العناصر الموجودة في المصفوفة $2، وعند عودة الدالة تُستبدل قيمة المتغير بعدد البنى التي كُتبت فعلياً إلى $3'],
    [/^If ([A-Za-z0-9_]+) is less than the number of (.+) available, at most ([A-Za-z0-9_]+) structures will be written, and (VK_[A-Z0-9_]+) will be returned instead of (VK_[A-Z0-9_]+), to indicate that not all the available (.+) were returned\.?$/i, 'إذا كانت قيمة $1 أقل من عدد $2 المتاحة، فسيُكتب بحد أقصى $1 بنية، وستُعاد القيمة $3 بدلاً من $4 للدلالة على أن الدالة لم تُعد كل $5 المتاحة'],
    [/^Retrieve the index of the next available presentable image\.?$/i, 'استرجاع فهرس صورة العرض التالية المتاحة للتقديم'],
    [/^Reports properties of the performance query counters available on a queue family of a physical device\.?$/i, 'استعراض خصائص عدادات الأداء المتاحة لعائلة طوابير محددة على جهاز فيزيائي'],
    [/^Query the (Vk[A-Za-z0-9_]+) corresponding to a DRM connector ID\.?$/i, 'استعلام عن $1 المطابق لمعرف موصل DRM'],
    [/^Query the (.+)\.?$/i, 'استعلام عن $1'],
    [/^Acquire access to a VkDisplayKHR using DRM\.?$/i, 'الحصول على إمكانية الوصول إلى VkDisplayKHR باستخدام DRM'],
    [/^Acquire full-screen exclusive mode for a swapchain\.?$/i, 'اكتساب وضع ملء الشاشة الحصري لسلسلة تبديل'],
    [/^The physical device the display is on\.?$/i, 'الجهاز الفيزيائي الذي تتصل به الشاشة'],
    [/^DRM primary file descriptor\.?$/i, 'واصف الملف الأساسي الخاص بـ DRM'],
    [/^Identifier of the specified DRM connector\.?$/i, 'معرّف موصل DRM المحدد'],
    [/^The corresponding (Vk[A-Za-z0-9_]+) handle will be returned here\.?$/i, 'سيُعاد هنا المقبض المطابق من النوع $1'],
    [/^The display the caller wishes Vulkan to control\.?$/i, 'الشاشة التي يريد المستدعي أن تتولى Vulkan التحكم بها'],
    [/^The swapchain to acquire the image from\.?$/i, 'سلسلة التبديل التي سيتم اكتساب الصورة منها'],
    [/^The index of the image acquired\.?$/i, 'فهرس الصورة التي تم اكتسابها'],
    [/^The queue to submit to\.?$/i, 'الطابور الذي سيتم الإرسال إليه'],
    [/^The command buffer to record commands into\.?$/i, 'مخزن الأوامر الذي ستُسجل فيه الأوامر'],
    [/^The logical device that owns the resource\.?$/i, 'الجهاز المنطقي الذي يملك المورد'],
    [/^The physical device associated with the call\.?$/i, 'الجهاز الفيزيائي المرتبط بهذا الاستدعاء'],
    [/^The semaphore to signal\.?$/i, 'الإشارة التي ستنتقل إلى حالة الإشارة عند اكتمال العملية'],
    [/^The fence to signal\.?$/i, 'السياج الذي سيُفعَّل عند اكتمال العملية'],
    [/^If the swapchain has been created with the (VK_[A-Z0-9_]+) flag, the image whose index is returned in pImageIndex will be fully backed by memory before this call returns to the application\.?$/i, 'إذا أُنشئت سلسلة التبديل باستخدام العلم $1، فستكون الصورة التي يُعاد فهرسها في pImageIndex مدعومة بالكامل بالذاكرة قبل عودة الاستدعاء إلى التطبيق'],
    [/^All permissions necessary to control the display are granted to the Vulkan instance associated with the provided physicalDevice until the display is either released or the connector is unplugged\.?$/i, 'تُمنح كل الصلاحيات اللازمة للتحكم بالشاشة إلى مثيل Vulkan المرتبط بالمعامل physicalDevice إلى أن يتم تحرير الشاشة أو فصل الموصل'],
    [/^The provided drmFd must correspond to the one owned by the physicalDevice\.?$/i, 'يجب أن يطابق drmFd الممرر واصف الملف المملوك للجهاز الفيزيائي physicalDevice'],
    [/^If not, the error code (VK_[A-Z0-9_]+) must be returned\.?$/i, 'خلاف ذلك يجب إعادة رمز الخطأ $1'],
    [/^The DRM FD must have DRM master permissions\.?$/i, 'يجب أن يمتلك واصف DRM صلاحيات DRM master'],
    [/^If any error is encountered during the acquisition of the display, the call must return the error code (VK_[A-Z0-9_]+)\.?$/i, 'إذا حدث أي خطأ أثناء اكتساب الشاشة، فيجب أن يعيد الاستدعاء رمز الخطأ $1'],
    [/^The provided DRM fd should not be closed before the display is released, attempting to do it may result in undefined behavior\.?$/i, 'لا ينبغي إغلاق واصف DRM الممرر قبل تحرير الشاشة لأن ذلك قد يؤدي إلى سلوك غير معرّف']
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(localized)) {
      return normalizeSentence(localized.replace(pattern, replacement));
    }
  }

  const nounMap = [
    ['sufficiently long period of time', 'فترة زمنية طويلة بما يكفي'],
    ['any particular purpose', 'غرض محدد'],
    ['implementation and platform specific reasons', 'أسباب خاصة بالتنفيذ والمنصة'],
    ['coinciding timestamp values', 'قيم طوابع زمنية متزامنة'],
    ['future coinciding timestamp values', 'قيم طوابع زمنية مستقبلية متزامنة'],
    ['host', 'المضيف'],
    ['performed by the host', 'المنفذة من جهة المضيف'],
    ['executed by the host', 'المنفذة من جهة المضيف'],
    ['application’s responsibility', 'مسؤولية التطبيق'],
    ['regular basis', 'أساس دوري'],
    ['platform specific reasons', 'أسباب خاصة بالمنصة'],
    ['properties of the platform', 'خصائص المنصة'],
    ['more efficient', 'أكثر كفاءة'],
    ['single command', 'استدعاء واحد'],
    ['memory bindings', 'عمليات ربط الذاكرة'],
    ['batch', 'تجميع'],
    ['shader instrumentation metrics', 'مقاييس تتبع الشيدر'],
    ['shader instrumentation metric descriptions', 'أوصاف مقاييس تتبع الشيدر'],
    ['properties describing', 'خصائص تصف'],
    ['number of elements', 'عدد العناصر'],
    ['elements in the', 'العناصر الموجودة في'],
    ['available', 'المتاحة'],
    ['supported', 'المدعومة'],
    ['actually written', 'المكتوبة فعلياً'],
    ['written to', 'المكتوبة إلى'],
    ['structures', 'البنى'],
    ['structure', 'بنية'],
    ['array', 'مصفوفة'],
    ['variable', 'متغير'],
    ['presentable image', 'صورة عرض قابلة للتقديم'],
    ['presentable images', 'صور عرض قابلة للتقديم'],
    ['physical device', 'الجهاز الفيزيائي'],
    ['logical device', 'الجهاز المنطقي'],
    ['swapchain', 'سلسلة التبديل'],
    ['command buffer', 'مخزن الأوامر'],
    ['command pool', 'مستودع الأوامر'],
    ['queue family', 'عائلة الطوابير'],
    ['queue', 'الطابور'],
    ['pipeline', 'خط الأنابيب'],
    ['render pass', 'تمرير الرسم'],
    ['dynamic rendering', 'الرسم الديناميكي'],
    ['framebuffer', 'مخزن الإطارات'],
    ['descriptor set', 'مجموعة الواصفات'],
    ['descriptor', 'الواصف'],
    ['buffer', 'المخزن'],
    ['image', 'الصورة'],
    ['semaphore', 'الإشارة'],
    ['fence', 'السياج'],
    ['file descriptor', 'واصف الملف'],
    ['allocator', 'مخصّص الذاكرة'],
    ['instance', 'المثيل'],
    ['surface', 'السطح'],
    ['display', 'الشاشة'],
    ['memory', 'الذاكرة'],
    ['flags', 'الأعلام'],
    ['flag', 'العلم'],
    ['index', 'الفهرس']
  ];

  nounMap.forEach(([en, ar]) => {
    localized = replaceStandaloneTechnicalPhrase(localized, en, ar);
  });

  const protectedLocalized = protectTechnicalIdentifiers(localized);
  localized = protectedLocalized.text;

  const verbMap = [
    ['Otherwise', 'وإلا'],
    ['assess', 'تقييم'],
    ['vary', 'يختلف'],
    ['re-issue', 'إعادة الاستدعاء'],
    ['re-calibrate', 'إعادة المعايرة'],
    ['extrapolated', 'استقراؤها'],
    ['estimate', 'تقدير'],
    ['pursuing', 'للحصول على'],
    ['fit', 'تلائم'],
    ['expected', 'يُتوقع'],
    ['indicate', 'الدلالة على'],
    ['supported', 'مدعومة'],
    ['overwritten', 'تُستبدل قيمته'],
    ['written', 'تُكتب'],
    ['returned instead of', 'تُعاد بدل'],
    ['returned in', 'تُعاد في'],
    ['returned', 'تُعاد'],
    ['must point to', 'يجب أن يشير إلى'],
    ['point to', 'يشير إلى'],
    ['Retrieve', 'استرجاع'],
    ['Query', 'استعلام عن'],
    ['Acquire', 'اكتساب'],
    ['Create', 'إنشاء'],
    ['Destroy', 'تدمير'],
    ['Get', 'الحصول على'],
    ['Enumerate', 'تعداد'],
    ['Release', 'تحرير'],
    ['Return', 'إرجاع'],
    ['returns', 'يعيد'],
    ['return', 'يعيد'],
    ['using', 'باستخدام'],
    ['with', 'مع'],
    ['before', 'قبل'],
    ['after', 'بعد']
  ];

  verbMap.forEach(([en, ar]) => {
    localized = localized.replace(new RegExp(`\\b${en}\\b`, 'g'), ar);
  });

  const proseReplacements = [
    [/\bIf\s+([A-Za-z0-9_]+)\s+is\s+NULL\b/gi, 'إذا كان $1 يساوي NULL'],
    [/\bthen\b/gi, 'فإن'],
    [/\bOtherwise,\s*/gi, 'وإلا، '],
    [/\ba variable set by the application to\b/gi, 'متغير يضبطه التطبيق على'],
    [/\bset by the application to\b/gi, 'يضبطه التطبيق على'],
    [/\bthe number of elements in the ([A-Za-z0-9_]+) array\b/gi, 'عدد العناصر الموجودة في المصفوفة $1'],
    [/\bmust point to a variable set by the application to\b/gi, 'يجب أن يشير إلى متغير يضبطه التطبيق على'],
    [/\band on return\b/gi, 'وعند عودة الدالة'],
    [/\bon return\b/gi, 'وعند عودة الدالة'],
    [/\bthe variable is overwritten with\b/gi, 'تُستبدل قيمة هذا المتغير بـ'],
    [/\bis overwritten with\b/gi, 'تُستبدل قيمته بـ'],
    [/\bthe number of structures actually written to ([A-Za-z0-9_]+)\b/gi, 'عدد البنى التي كُتبت فعلياً إلى $1'],
    [/\bis less than\b/gi, 'أقل من'],
    [/\bat most\b/gi, 'بحد أقصى'],
    [/\bwill be written\b/gi, 'ستُكتب'],
    [/\bwill be returned instead of\b/gi, 'ستُعاد بدل'],
    [/\bto indicate that\b/gi, 'للدلالة على أن'],
    [/\bnot all the available ([A-Za-z0-9_ ]+?) were returned\b/gi, 'الدالة لم تُعد كل $1 المتاحة'],
    [/\bnot all the available\b/gi, 'ليست كل العناصر المتاحة'],
    [/\bthe number of\b/gi, 'عدد'],
    [/\bnumber of\b/gi, 'عدد'],
    [/\bwhat\b/gi, 'ما هي'],
    [/\bare supported\b/gi, 'مدعومة'],
    [/\bare\b/gi, 'هي'],
    [/\bis\b/gi, 'هو'],
    [/\bwere\b/gi, 'تمت'],
    [/\bthat\b/gi, 'أن']
  ];

  proseReplacements.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });

  return normalizeSentence(protectedLocalized.restore(localized));
}

function inferCountUnit(name) {
  const value = String(name || '');
  if (/vertexCount|firstVertex|vertexOffset|maxVertex/i.test(value)) return 'رؤوس';
  if (/instanceCount|firstInstance|maxInstances/i.test(value)) return 'نسخ';
  if (/primitiveCount|maxPrimitive|primitiveCounts/i.test(value)) return 'بدائيات';
  if (/drawCount|maxDrawCount/i.test(value)) return 'أوامر رسم';
  if (/bindingCount|firstBinding/i.test(value)) return 'نقاط ربط';
  if (/descriptorCount/i.test(value)) return 'واصفات';
  if (/queueCount/i.test(value)) return 'طوابير';
  if (/commandBufferCount/i.test(value)) return 'مخازن أوامر';
  if (/attachmentCount/i.test(value)) return 'مرفقات';
  if (/regionCount/i.test(value)) return 'مناطق';
  if (/infoCount/i.test(value)) return 'بنى';
  if (/propertyCount|descriptionCount|count$/i.test(value)) return 'عناصر';
  return 'عناصر';
}

function getSemanticValueKindArabicLabel(kind = '') {
  switch (kind) {
    case 'Bitmask':
      return 'قناع أعلام';
    case 'Pointer':
      return 'مؤشر';
    case 'Count':
      return 'عدد';
    case 'Size':
      return 'حجم';
    case 'Offset':
      return 'إزاحة';
    case 'Index':
      return 'فهرس';
    case 'Handle':
      return 'مقبض';
    default:
      return 'قيمة';
  }
}

function maskAllowedVulkanNarrativeTokens(text) {
  const tokens = [];
  const masked = cleanText(String(text || '')).replace(
    /\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|pp?[A-Z][A-Za-z0-9_]*|[a-z]+(?:[A-Z][A-Za-z0-9_]*)+|nullptr|NULL|Vulkan|DRM|Xlib|X11|Wayland|Win32|Metal|Android|Display)\b|0x[0-9A-Fa-f]+/g,
    (match) => {
      const marker = `%%VKNARR${tokens.length}%%`;
      tokens.push(match);
      return marker;
    }
  );

  return {masked, tokens};
}

function hasResidualVulkanNarrativeEnglish(text) {
  const clean = cleanText(String(text || ''));
  if (!clean) {
    return false;
  }

  const {masked} = maskAllowedVulkanNarrativeTokens(clean);
  return /[A-Za-z]{3,}/.test(masked);
}

function preferStrictArabicVulkanText(rawText, fallback = '') {
  const clean = cleanText(String(rawText || '').replace(/^الوصف الرسمي:\s*/g, ''));
  const fallbackClean = cleanText(String(fallback || '').replace(/^الوصف الرسمي:\s*/g, ''));

  if (!clean) {
    return fallbackClean;
  }

  if (hasResidualVulkanNarrativeEnglish(clean) && fallbackClean) {
    return fallbackClean;
  }

  return clean;
}

function inferSemanticValueKind(name, type = '') {
  const cleanName = String(name || '');
  const cleanType = String(type || '');
  const baseType = getBaseType(type);

  if (/Flags?$/.test(baseType) || /flags/i.test(cleanName)) return 'Bitmask';
  if (/\*/.test(cleanType)) return 'Pointer';
  if (/Count$/.test(cleanName)) return 'Count';
  if (/Size|Stride|Pitch|Range|alignment|capacity/i.test(cleanName) || baseType === 'VkDeviceSize') return 'Size';
  if (/Offset|Address/i.test(cleanName) || baseType === 'VkDeviceAddress') return 'Offset';
  if (/Index|first[A-Z]|binding$|location$|familyIndex/i.test(cleanName)) return 'Index';
  if (/^Vk/.test(baseType) && !/Flags?$/.test(baseType)) return 'Handle';
  return 'Value';
}

function inferSemanticUnit(name, type = '') {
  const cleanName = String(name || '');
  const cleanType = String(type || '');
  const baseType = getBaseType(type);
  if (/timeout/i.test(cleanName)) return 'نانوثانية';
  if (/Offset|Size|Stride|Pitch|Address|Range/i.test(cleanName) || baseType === 'VkDeviceSize' || baseType === 'VkDeviceAddress') return 'بايت';
  if (/Count$/i.test(cleanName)) return inferCountUnit(cleanName);
  if (/width|height|depth/i.test(cleanName)) return 'تكسلات';
  return '';
}

function inferSemanticLocation(name, type = '', functionName = '') {
  const cleanName = String(name || '');
  const cleanType = String(type || '');
  const baseType = getBaseType(type);
  const fn = String(functionName || '');

  if (/offset/i.test(cleanName) && /(buffer|srcBuffer|dstBuffer)/i.test(fn + ' ' + cleanName)) {
    return 'داخل مخزن مرتبط بهذا الاستدعاء';
  }
  if (/offset/i.test(cleanName) && /memory/i.test(cleanName + ' ' + cleanType)) {
    return 'داخل الذاكرة المرتبطة بالكائن أو المورد';
  }
  if (/vertex/i.test(cleanName)) {
    return 'داخل بيانات الرؤوس المقروءة من مخزن الرؤوس';
  }
  if (/index/i.test(cleanName) && !/image/i.test(cleanName)) {
    return 'داخل بيانات الفهرسة أو داخل مصفوفة عناصر مرتبطة';
  }
  if (/primitive/i.test(cleanName)) {
    return 'داخل بيانات الهندسة التي ستُبنى أو تُرسم';
  }
  if (/instance/i.test(cleanName)) {
    return 'داخل بيانات النسخ أو ضمن عدد النسخ المطلوب';
  }
  if (/buffer/i.test(cleanName) || baseType === 'VkBuffer') {
    return 'يشير إلى مخزن تقرأ منه Vulkan أو تكتب فيه';
  }
  if (/image/i.test(cleanName) || baseType === 'VkImage') {
    return 'يشير إلى صورة أو إلى بيانات ستدخل مسار الصور';
  }
  return '';
}

function buildSemanticParameterSentence(param, functionName = '') {
  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const baseType = getBaseType(type);
  const vkTypeLabel = /^Vk/.test(baseType || '') ? ` من النوع ${baseType}` : '';
  const valueKind = inferSemanticValueKind(name, type);
  const unit = inferSemanticUnit(name, type);
  const location = inferSemanticLocation(name, type, functionName);

  if (name === 'device') {
    return 'يمثل المقبض VkDevice الذي يحدد الجهاز المنطقي الذي سينفذ عليه الاستدعاء وتُفسَّر بالنسبة إليه بقية الموارد والمعاملات.';
  }
  if (name === 'physicalDevice') {
    return 'يمثل المقبض VkPhysicalDevice الذي يحدد العتاد الذي ستقرأ منه الدالة الخصائص أو الدعم أو الموارد المرتبطة بهذا المسار.';
  }
  if (name === 'queue') {
    return 'يمثل المقبض VkQueue الذي يحدد الطابور الذي سيستقبل هذا العمل أو هذه المزامنة عند التنفيذ.';
  }
  if (name === 'commandBuffer') {
    return 'يمثل المقبض VkCommandBuffer الذي يحدد مخزن الأوامر الذي ستُسجَّل داخله الأوامر قبل أن يقرأها المعالج الرسومي لاحقًا.';
  }
  if (name === 'pAllocator') {
    return 'يمثل عنوانًا إلى VkAllocationCallbacks يحدد ردود نداء تخصيص ذاكرة المضيف إذا أراد التطبيق تجاوز آلية التخصيص الافتراضية؛ وإلا تُمرر القيمة NULL.';
  }
  if (name === 'pNext') {
    return 'يمثل عنوانًا إلى بنية امتدادية توسّع سلسلة البيانات التي ستقرأها Vulkan مع هذا الاستدعاء عند الحاجة إلى ميزات إضافية.';
  }

  if (valueKind === 'Pointer' && /^pp/.test(name)) {
    return `يمثل عنوانًا إلى مصفوفة مؤشرات أو عناوين${vkTypeLabel}. يجب أن يطابق عدد العناصر الفعلي القيم المرافقة مثل العداد المرتبط.`;
  }

  if (valueKind === 'Pointer' && /^p/.test(name) && /\bconst\b/.test(type)) {
    const locationSuffix = location ? ` ${location}.` : '';
    return `يمثل عنوان بيانات إدخال${vkTypeLabel} تقرأها Vulkan أثناء تنفيذ ${functionName || 'هذا الاستدعاء'}${locationSuffix}`;
  }

  if (valueKind === 'Pointer' && /^p/.test(name)) {
    const locationSuffix = location ? ` ${location}.` : '';
    return `يمثل عنوان خرج أو بيانات قابلة للكتابة${vkTypeLabel} ستكتب فيها Vulkan النتيجة أو تحدّثها أثناء الاستدعاء${locationSuffix}`;
  }

  if (valueKind === 'Count') {
    return `يمثل عددًا يحدد كم ${unit || 'عنصر'} ستقرأه Vulkan أو تكتبه، ويجب أن يطابق طول المصفوفة أو عدد الأوصاف المرتبطة به فعليًا.`;
  }

  if (valueKind === 'Offset') {
    return `يمثل إزاحة${vkTypeLabel} تحدد موضع القراءة أو الكتابة بوحدة ${unit || 'بايت'}${location ? ` ${location}` : ''}. هذه القيمة لا تمثل عدد عناصر بل موضعًا فعليًا داخل الذاكرة.`;
  }

  if (valueKind === 'Size') {
    return `يمثل حجمًا${vkTypeLabel} يحدد ${/Stride/i.test(name) ? 'المسافة بين عنصرين متتاليين' : 'الحجم أو السعة المطلوبة'} بوحدة ${unit || 'بايت'}${location ? ` ${location}` : ''}.`;
  }

  if (valueKind === 'Index') {
    return `يمثل فهرسًا${vkTypeLabel} يحدد موضع عنصر داخل مجموعة أو عائلة أو مصفوفة، وليس إزاحة بايتية داخل الذاكرة${location ? ` ${location}` : ''}.`;
  }

  if (valueKind === 'Bitmask') {
    return `يمثل قناع أعلام${vkTypeLabel} يجمع الأعلام التي تغيّر سلوك الاستدعاء أو الموارد التي ستقرأها Vulkan أثناء التنفيذ.`;
  }

  if (valueKind === 'Handle') {
    return `يمثل مقبضًا من النوع ${baseType} يحدد الكائن الذي ستعمل عليه Vulkan أو المورد الذي ستقرأه أو تكتبه في هذا الموضع.`;
  }

  if (unit) {
    return `قيمة${vkTypeLabel} تُقرأ على أنها ${getSemanticValueKindArabicLabel(valueKind)} بوحدة ${unit}${location ? ` ${location}` : ''}.`;
  }

  return `قيمة${vkTypeLabel} تعتمد عليها Vulkan لتحديد معنى هذا الاستدعاء أو المورد الذي سيعمل عليه.`;
}

function inferArabicParameterDescription(param, functionName = '') {
  const name = String(param?.name || '');
  const type = String(param?.type || '');
  const cleanType = stripTypeQualifiers(type);
  const baseType = getBaseType(type);

  const semanticSentence = buildSemanticParameterSentence(param, functionName);
  if (semanticSentence) {
    return semanticSentence;
  }

  if (name === 'instance') return 'المثيل المرتبط بهذا الاستدعاء أو المورد الجاري العمل عليه.';
  if (name === 'physicalDevice') return 'الجهاز الفيزيائي المرتبط بعملية الاستعلام أو التنفيذ.';
  if (name === 'device') return 'الجهاز المنطقي الذي ستُنفذ عليه هذه العملية.';
  if (name === 'queue') return 'الطابور الذي ستُرسل إليه الأوامر أو النتائج.';
  if (name === 'swapchain') return 'سلسلة التبديل التي تعمل عليها الدالة أو تستخرج منها الصور.';
  if (name === 'commandBuffer') return 'مخزن الأوامر الذي ستُسجل فيه هذه الأوامر قبل إرسالها لاحقاً إلى الطابور.';
  if (name === 'commandPool') return 'مستودع الأوامر الذي تُدار ضمنه مخازن الأوامر.';
  if (name === 'semaphore') return 'الإشارة المستخدمة لمزامنة هذه العملية مع بقية التنفيذ.';
  if (name === 'fence') return 'السياج المستخدم لمعرفة وقت اكتمال العملية.';
  if (name === 'timeout') return 'مهلة الانتظار الخاصة بهذا الاستدعاء، وغالباً تكون بالنانوثانية.';
  if (name === 'dpy' || baseType === 'Display') return 'مؤشر إلى اتصال Xlib من النوع Display* تستخدمه الدالة للوصول إلى خادم X11 أو شاشة العرض المرتبطة به.';
  if (name === 'firstBinding') return 'أول نقطة ربط ستبدأ الدالة الكتابة أو الربط منها داخل المدى المستهدف.';
  if (name === 'bindingCount') return 'عدد نقاط الربط أو عدد العناصر التي ستتعامل معها الدالة بدءاً من firstBinding.';
  if (name === 'drmFd') return 'واصف الملف الأساسي الخاص بـ DRM والمستخدم للوصول إلى الشاشة.';
  if (name === 'display') return 'الشاشة أو جهاز العرض الذي تتعامل معه هذه العملية.';
  if (name === 'pBuffers') return 'مؤشر إلى مصفوفة المخازن التي ستُربط أو تُستخدم في هذه العملية.';
  if (name === 'pOffsets') return 'مؤشر إلى مصفوفة الإزاحات داخل كل مخزن عند بدء التعامل مع البيانات.';
  if (name === 'pSizes') return 'مؤشر إلى مصفوفة الأحجام أو المديات التي ستغطيها العملية داخل كل مخزن.';
  if (name === 'pStrides') return 'مؤشر إلى مصفوفة قيم التباعد بين العناصر المتتالية في كل مخزن.';
  if (name === 'srcBuffer') return 'المخزن المصدر الذي ستُقرأ منه البيانات.';
  if (name === 'dstBuffer') return 'المخزن الوجهة الذي ستُكتب فيه البيانات الناتجة.';
  if (name === 'srcImage') return 'الصورة المصدر التي ستُقرأ منها البيانات أو المناطق المطلوب نقلها.';
  if (name === 'dstImage') return 'الصورة الوجهة التي ستُكتب فيها البيانات أو المناطق المنسوخة.';
  if (name === 'image') return 'الصورة التي ستُطبَّق عليها عملية المسح أو الملء أو النقل وفق نوع الدالة.';
  if (name === 'pRegions') return 'مؤشر إلى مصفوفة المناطق التي تحدد الأجزاء المصدر والوجهة التي ستغطيها العملية.';
  if (name === 'pAttachments') return 'مؤشر إلى المرفقات التي تريد تصفيرها أو تعديلها داخل مخزن الإطارات الحالي.';
  if (name === 'pColor') return 'مؤشر إلى قيمة اللون التي ستُكتب في المناطق المستهدفة من الصورة.';
  if (name === 'pDepthStencil') return 'مؤشر إلى قيم العمق والاستنسل التي ستُستخدم عند تعبئة الصورة المستهدفة.';
  if (name === 'imageLayout' || name === 'srcImageLayout' || name === 'dstImageLayout') return 'تخطيط الصورة المطلوب أن تكون عليه الصورة أثناء تنفيذ هذه العملية.';
  if (name === 'pAllocator') return 'مؤشر إلى مخصّص ذاكرة مخصص؛ استخدم nullptr للاعتماد على المخصّص الافتراضي.';
  if (name === 'pNext') return 'مؤشر إلى سلسلة امتدادات إضافية أو nullptr إذا لم تكن هناك بيانات امتداد.';
  if (/^p.*Count$/.test(name)) return 'مؤشر إلى عدد العناصر المطلوب إدخاله أو العدد الذي ستعيده الدالة.';
  if (name === 'pImageIndex') return 'مؤشر إلى متغير ستكتب فيه الدالة فهرس الصورة الناتجة.';
  if (/^p[A-Z]/.test(name) && /\*/.test(type) && /\bconst\b/.test(type)) {
    return /^Vk/.test(baseType) ? `مؤشر إلى بيانات إدخال من النوع ${baseType} يجب تجهيزها قبل الاستدعاء.` : 'مؤشر إلى بيانات إدخال يجب تجهيزها قبل الاستدعاء.';
  }
  if (/^p[A-Z]/.test(name) && /\*/.test(type)) {
    return /^Vk/.test(baseType) ? `مؤشر إلى متغير أو بنية من النوع ${baseType} ستكتب فيه الدالة النتيجة أو تحدّثه.` : 'مؤشر إلى متغير أو بنية ستكتب فيه الدالة النتيجة أو تحدّثه.';
  }
  if (/Flags?$/.test(baseType) || /flags/i.test(name)) {
    return 'أعلام تتحكم في سلوك الاستدعاء والخيارات المفعلة أثناء التنفيذ.';
  }
  if (/Bool32$/.test(baseType) || /\bbool\b/i.test(cleanType)) {
    return 'قيمة منطقية تحدد تفعيل خيار معين أو تعطيله.';
  }
  if (/uint32_t|uint64_t|int32_t|size_t/.test(cleanType)) {
    return 'قيمة عددية تستخدمها الدالة ضمن هذا الاستدعاء.';
  }
  if (/^Vk/.test(baseType)) {
    return `معامل من النوع ${baseType} تستخدمه الدالة ضمن هذه العملية.`;
  }

  return 'معامل تحتاجه الدالة لإتمام العمل المطلوب.';
}

function localizeParameterDescription(param, functionName = '') {
  const english = cleanText(param?.description || '');
  const baseType = getBaseType(param?.type || '');
  const inferredFallback = inferArabicParameterDescription(param, functionName);
  const fallback = preferStrictArabicVulkanText(inferredFallback, inferredFallback);
  const preferredContextualNames = new Set([
    'device',
    'physicalDevice',
    'queue',
    'buffer',
    'srcBuffer',
    'dstBuffer',
    'countBuffer',
    'image',
    'srcImage',
    'dstImage',
    'display',
    'commandBuffer',
    'offset',
    'srcOffset',
    'dstOffset',
    'countBufferOffset',
    'memoryOffset',
    'stride',
    'drawCount',
    'maxDrawCount',
    'instanceCount',
    'vertexCount',
    'primitiveCount',
    'commandBuffer',
    'firstBinding',
    'bindingCount',
    'pBuffers',
    'pOffsets',
    'pSizes',
    'pStrides',
    'srcBuffer',
    'dstBuffer',
    'srcImage',
    'dstImage',
    'image',
    'imageLayout',
    'srcImageLayout',
    'dstImageLayout',
    'pRegions',
    'pAttachments',
    'pColor',
    'pDepthStencil',
    'dpy'
  ]);
  if (!english) {
    return fallback;
  }

  if (preferredContextualNames.has(String(param?.name || '')) || baseType === 'Display') {
    return fallback;
  }

  if (!hasLatinText(english)) {
    if (/^معامل من النوع|^قيمة عددية من النوع|^مؤشر إلى بيانات إدخال من النوع|^مؤشر إلى متغير أو بنية من النوع/.test(english)) {
      return fallback;
    }
    return preferStrictArabicVulkanText(normalizeSentence(english), fallback);
  }

  const translated = translateTechnicalText(english);
  if (hasLatinText(translated) || hasResidualVulkanNarrativeEnglish(translated)) {
    return fallback;
  }

  return preferStrictArabicVulkanText(translated, fallback);
}

function localizeFunctionDescription(name, description, usageLine = '') {
  if (/^vkAcquireDrmDisplayEXT$/.test(name)) {
    return 'الوصف الرسمي: دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر طبقة DRM.';
  }
  if (/^vkAcquireXlibDisplayEXT$/.test(name)) {
    return 'الوصف الرسمي: دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر Xlib/X11.';
  }
  if (/^vkAcquireWinrtDisplayNV$/.test(name)) {
    return 'الوصف الرسمي: دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر WinRT.';
  }
  if (/^vkAcquireNextImage2KHR$/.test(name)) {
    return 'الوصف الرسمي: دالة للحصول على فهرس صورة العرض التالية الجاهزة من سلسلة التبديل باستخدام بنية إعدادات أكثر تفصيلاً.';
  }
  if (/^vkAcquireNextImageKHR$/.test(name)) {
    return 'الوصف الرسمي: دالة للحصول على فهرس صورة العرض التالية الجاهزة من سلسلة التبديل قبل الرسم عليها أو تقديمها.';
  }
  if (/^vkBuildAccelerationStructuresKHR$/.test(name)) {
    return 'الوصف الرسمي: دالة تبني أو تحدّث Acceleration Structures من جهة المضيف مباشرة مع قراءة أوصاف Geometry ونطاقات الـ Primitives اللازمة لبناء BVH.';
  }

  const body = descriptionBody(description);
  const usageFallback = localizeFunctionNameLine(usageLine);
  const inferredDescription = normalizeFunctionExplanationText(inferFunctionDescription(name));
  const preferInferredDescription = /^(vkCmdDraw|vkCmdDrawIndexed|vkCmdDrawIndirect|vkCmdDrawIndexedIndirect|vkCmdDrawIndirectCount(?:KHR|AMD)?|vkCmdDrawIndexedIndirectCount(?:KHR|AMD)?|vkCmdDrawIndirectByteCountEXT|vkCmdDrawMeshTasks(?:EXT|NV)?|vkCmdDrawMeshTasksIndirect(?:EXT|NV)?|vkCmdDrawMeshTasksIndirectCount(?:EXT|NV)?|vkCmdDrawMultiEXT|vkCmdDrawMultiIndexedEXT|vkCmdDrawClusterHUAWEI|vkCmdDrawClusterIndirectHUAWEI|vkCmdBeginDebugUtilsLabelEXT|vkCmdInsertDebugUtilsLabelEXT|vkCmdEndDebugUtilsLabelEXT|vkCmdBeginPerTileExecutionQCOM|vkCmdEndPerTileExecutionQCOM)$/.test(name);
  if (!body) {
    return usageFallback
      ? `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(usageFallback))}`
      : inferredDescription;
  }

  if (preferInferredDescription && inferredDescription && !isGenericFunctionPlaceholder(inferredDescription)) {
    return `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(inferredDescription))}`;
  }

  if (!hasLatinText(body) && !isGenericFunctionPlaceholder(body) && !/[ء-ي][A-Za-z]|[A-Za-z][ء-ي]|\b(?:set|within|potentially|color|combined|passes|presentation|server)\b/i.test(body)) {
    return description.startsWith('الوصف الرسمي:')
      ? `الوصف الرسمي: ${normalizeSentence(normalizeFunctionExplanationText(body))}`
      : normalizeSentence(normalizeFunctionExplanationText(body));
  }

  const localizedNameLine = localizeFunctionNameLine(body);
  if (localizedNameLine && !hasLatinText(localizedNameLine) && !isGenericFunctionPlaceholder(localizedNameLine) && !/[ء-ي][A-Za-z]|[A-Za-z][ء-ي]|\b(?:set|within|potentially|color|combined|passes|presentation|server)\b/i.test(localizedNameLine)) {
    return `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(localizedNameLine))}`;
  }

  if (
    usageFallback &&
    !isGenericFunctionPlaceholder(usageFallback) &&
    !hasLatinText(descriptionBody(usageFallback)) &&
    !/[ء-ي][A-Za-z]|[A-Za-z][ء-ي]|\b(?:set|within|potentially|color|combined|passes|presentation|server)\b/i.test(descriptionBody(usageFallback))
  ) {
    return `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(usageFallback))}`;
  }

  if (/[ء-ي]/.test(body) && hasLatinText(body) && inferredDescription && !isGenericFunctionPlaceholder(inferredDescription)) {
    return `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(inferredDescription))}`;
  }

  const translated = normalizeFunctionExplanationText(translateTechnicalText(body));
  if (!translated || hasLatinText(translated) || isGenericFunctionPlaceholder(translated)) {
    return `الوصف الرسمي: ${inferredDescription}`;
  }

  return `الوصف الرسمي: ${descriptionBody(normalizeFunctionExplanationText(translated))}`;
}

function localizeTypeReferenceText(text) {
  const body = normalizeTypeReferenceFormatting(
    String(text || '')
      .replace(/^الوصف الرسمي:\s*/g, '')
      .replace(/^C Specification\s*/i, '')
  );
  if (!body) {
    return '';
  }

  const arabicCleanupPatterns = [
    [/^تحديد لون الحدود المستخدم لـ عمليات أخذ العينات من النسيج\.?$/i, 'يحدد لون الحدود المستخدم في عمليات أخذ العينات من النسيج'],
    [/^تحديد المرشحات المستخدم لـ عمليات أخذ العينات من النسيج\.?$/i, 'يحدد نوع المرشح المستخدم في عمليات أخذ العينات من النسيج'],
    [/^نمط العرض المدعوم لـ السطح\.?$/i, 'يحدد نمط العرض المدعوم على السطح'],
    [/^تخطيط الصورة ومواردها الفرعية\.?$/i, 'يحدد تخطيط الصورة ومواردها الفرعية'],
    [/^بنية التسارع memory requirement type\.?$/i, 'نوع متطلبات ذاكرة بنية التسارع'],
    [/^بنية التسارع compatibility\.?$/i, 'توافق بنية التسارع'],
    [/^قناع أعلام يحدد address copy parameters\.?$/i, 'قناع أعلام يحدد معلمات نسخ العناوين'],
    [/^قناع أعلام يحدد additional copy parameters\.?$/i, 'قناع أعلام يحدد معلمات نسخ إضافية'],
    [/^أعلام تحدد address copy parameters\.?$/i, 'أعلام تحدد معلمات نسخ العناوين'],
    [/^أعلام تحدد additional copy parameters\.?$/i, 'أعلام تحدد معلمات نسخ إضافية'],
    [/^requests memory requirement لـ scratch space during update\.?$/i, 'يطلب متطلبات الذاكرة لمساحة scratch أثناء التحديث'],
    [/^يحدد no accesses\.?$/i, 'يحدد عدم وجود أي وصول للذاكرة'],
    [/^تعداد يحدد نوع بيانات motion instance في بنية التسارع المستخدمة داخل هندسة بنية التسارع\.?$/i, 'تعداد يحدد نوع بيانات الحركة الخاصة بالمثيل داخل هندسة بنية التسارع']
  ];

  for (const [pattern, replacement] of arabicCleanupPatterns) {
    if (pattern.test(body)) {
      return normalizeSentence(body.replace(pattern, replacement));
    }
  }

  if (!hasLatinText(body)) {
    return normalizeSentence(body);
  }

  const replacements = [
    [/^تحديد border color used لـ texture lookups\.?$/i, 'يحدد لون الحدود المستخدم في عمليات أخذ العينات من النسيج'],
    [/^تحديد filters used لـ texture lookups\.?$/i, 'يحدد نوع المرشح المستخدم في عمليات أخذ العينات من النسيج'],
    [/^Presentation mode supported لـ a surface\.?$/i, 'يحدد نمط العرض المدعوم على السطح'],
    [/^Specify border color used for texture lookups\.?$/i, 'يحدد لون الحدود المستخدم في عمليات أخذ العينات من النسيج'],
    [/^Specify filters used for texture lookups\.?$/i, 'يحدد نوع المرشح المستخدم في عمليات أخذ العينات من النسيج'],
    [/^Presentation mode supported for a surface\.?$/i, 'يحدد نمط العرض المدعوم على السطح'],
    [/^Layout of image and image subresources\.?$/i, 'يحدد تخطيط الصورة ومواردها الفرعية'],
    [/^Acceleration structure memory requirement type\.?$/i, 'نوع متطلبات ذاكرة بنية التسارع'],
    [/^Acceleration structure compatibility\.?$/i, 'توافق بنية التسارع'],
    [/^Requests memory requirement for scratch space during update\.?$/i, 'يطلب متطلبات الذاكرة لمساحة scratch أثناء التحديث'],
    [/^No accesses\.?$/i, 'عدم وجود أي وصول للذاكرة'],
    [/^Bitmask specifying address copy parameters\.?$/i, 'قناع أعلام يحدد معلمات نسخ العناوين'],
    [/^Flag bits specifying address copy parameters\.?$/i, 'أعلام تحدد معلمات نسخ العناوين'],
    [/^Bitmask specifying additional copy parameters\.?$/i, 'قناع أعلام يحدد معلمات نسخ إضافية'],
    [/^Flag bits specifying additional copy parameters\.?$/i, 'أعلام تحدد معلمات نسخ إضافية'],
    [/^Enum specifying a type of acceleration structure motion instance data for building into an acceleration structure geometry\.?$/i, 'تعداد يحدد نوع بيانات الحركة الخاصة بالمثيل داخل هندسة بنية التسارع'],
    [/^Enum specifying a type of acceleration structure motion instance data for building into acceleration structure geometry\.?$/i, 'تعداد يحدد نوع بيانات الحركة الخاصة بالمثيل داخل هندسة بنية التسارع'],
    [/^Layout of (.+?)\.?$/i, 'تخطيط $1'],
    [/^Bitmask specifying (.+)$/i, 'قناع أعلام يحدد $1'],
    [/^Bitmask of (.+)$/i, 'قناع أعلام خاص بـ $1'],
    [/^Enum specifying (.+)$/i, 'تعداد يحدد $1'],
    [/^Enumeration specifying (.+)$/i, 'تعداد يحدد $1'],
    [/^Flag bits specifying (.+)$/i, 'أعلام تحدد $1'],
    [/^Flag bits for (.+)$/i, 'أعلام خاصة بـ $1'],
    [/^Possible values of (.+?), specifying (.+?), are:?$/i, 'القيم الممكنة لـ $1 التي تحدد $2 هي'],
    [/^Possible values for (.+?), specifying (.+?), are:?$/i, 'القيم الممكنة لـ $1 التي تحدد $2 هي'],
    [/^Possible values of (.+?) are:?$/i, 'القيم الممكنة لـ $1 هي'],
    [/^Possible values for (.+?) are:?$/i, 'القيم الممكنة لـ $1 هي'],
    [/^Bits which can be set in (.+?), specifying (.+?), are:?$/i, 'الأعلام التي يمكن ضبطها في $1 لتحديد $2 هي'],
    [/^Bits which can be set in (.+?) are:?$/i, 'الأعلام التي يمكن ضبطها في $1 هي'],
    [/^Values which can be set in (.+?) are:?$/i, 'القيم التي يمكن ضبطها في $1 هي'],
    [/^Values which can be be set in (.+?) are:?$/i, 'القيم التي يمكن ضبطها في $1 هي'],
    [/^Specify (.+?) used for (.+)$/i, 'يحدد $1 المستخدم في $2'],
    [/^Specify (.+?) used by (.+)$/i, 'يحدد $1 الذي يستخدمه $2'],
    [/^Specify (.+?) for (.+)$/i, 'يحدد $1 الخاص بـ $2'],
    [/^specifies that (.+)$/i, 'يحدد أن $1'],
    [/^specifies (.+)$/i, 'يحدد $1'],
    [/^Specify (.+)$/i, 'تحديد $1']
  ];

  let localized = body;
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(localized)) {
      localized = localized.replace(pattern, replacement);
      break;
    }
  }

  const typePhraseMap = [
    ['border color', 'لون الحدود'],
    ['border colors', 'ألوان الحدود'],
    ['texture lookup', 'أخذ العينات من النسيج'],
    ['texture lookups', 'عمليات أخذ العينات من النسيج'],
    ['presentation mode', 'نمط العرض'],
    ['presentation modes', 'أنماط العرض'],
    ['address copy parameters', 'معلمات نسخ العناوين'],
    ['additional copy parameters', 'معلمات نسخ إضافية'],
    ['copy parameters', 'معلمات النسخ'],
    ['address copy', 'نسخ العناوين'],
    ['acceleration structure motion instance data', 'بيانات الحركة الخاصة بمثيل بنية التسارع'],
    ['motion instance data', 'بيانات الحركة الخاصة بالمثيل'],
    ['building into an acceleration structure geometry', 'المستخدمة داخل هندسة بنية التسارع'],
    ['building into acceleration structure geometry', 'المستخدمة داخل هندسة بنية التسارع'],
    ['acceleration structure geometry', 'هندسة بنية التسارع'],
    ['presentation', 'العرض'],
    ['surface', 'السطح'],
    ['sampler', 'السامبلر'],
    ['samplers', 'السامبلرات'],
    ['floating-point format', 'تنسيق الفاصلة العائمة'],
    ['floating point format', 'تنسيق الفاصلة العائمة'],
    ['integer format', 'تنسيق صحيح'],
    ['opaque', 'معتم'],
    ['transparent', 'شفاف'],
    ['black color', 'لون أسود'],
    ['white color', 'لون أبيض'],
    ['custom color data', 'بيانات لون مخصص'],
    ['color data', 'بيانات اللون'],
    ['color space', 'فضاء اللون'],
    ['color model', 'نموذج اللون'],
    ['layout of', 'تخطيط'],
    ['layout', 'تخطيط'],
    ['image', 'الصورة'],
    ['image layout', 'تخطيط الصورة'],
    ['image layouts', 'تخطيطات الصور'],
    ['image type', 'نوع الصورة'],
    ['image view type', 'نوع منظور الصورة'],
    ['image subresources', 'الموارد الفرعية للصورة'],
    ['image subresource', 'المورد الفرعي للصورة'],
    ['subresources', 'الموارد الفرعية'],
    ['subresource', 'المورد الفرعي'],
    ['format feature', 'ميزة التنسيق'],
    ['format features', 'ميزات التنسيق'],
    ['present mode', 'نمط العرض'],
    ['present modes', 'أنماط العرض'],
    ['blend factor', 'عامل المزج'],
    ['blend operation', 'عملية المزج'],
    ['compare operation', 'عملية المقارنة'],
    ['stencil operation', 'عملية الاستنسل'],
    ['logic operation', 'العملية المنطقية'],
    ['primitive topology', 'طوبولوجيا البدائيات'],
    ['polygon mode', 'نمط المضلع'],
    ['front face', 'الواجهة الأمامية'],
    ['cull mode', 'نمط الاستبعاد'],
    ['sample count', 'عدد العينات'],
    ['sample counts', 'أعداد العينات'],
    ['attachment load operation', 'عملية تحميل المرفق'],
    ['attachment store operation', 'عملية تخزين المرفق'],
    ['descriptor type', 'نوع الواصف'],
    ['descriptor types', 'أنواع الواصفات'],
    ['dynamic state', 'الحالة الديناميكية'],
    ['dynamic states', 'الحالات الديناميكية'],
    ['object type', 'نوع الكائن'],
    ['object types', 'أنواع الكائنات'],
    ['pipeline bind point', 'نقطة ربط خط الأنابيب'],
    ['pipeline stage', 'مرحلة خط الأنابيب'],
    ['pipeline stages', 'مراحل خط الأنابيب'],
    ['queue family', 'عائلة الطوابير'],
    ['queue families', 'عائلات الطوابير'],
    ['result code', 'رمز النتيجة'],
    ['result codes', 'رموز النتيجة'],
    ['memory property', 'خاصية الذاكرة'],
    ['memory properties', 'خصائص الذاكرة'],
    ['sharing mode', 'نمط المشاركة'],
    ['filter', 'المرشح'],
    ['filters', 'المرشحات'],
    ['component swizzle', 'إعادة ترتيب المكونات'],
    ['component swizzles', 'إعادات ترتيب المكونات'],
    ['vertex input rate', 'معدل إدخال الرؤوس'],
    ['build type', 'نوع البناء'],
    ['build types', 'أنواع البناء'],
    ['usage flags', 'أعلام الاستخدام'],
    ['usage flag bits', 'أعلام الاستخدام'],
    ['create flags', 'أعلام الإنشاء'],
    ['create flag bits', 'أعلام الإنشاء'],
    ['feature flags', 'أعلام الميزات'],
    ['mode flags', 'أعلام الأنماط'],
    ['mode', 'نمط'],
    ['property flags', 'أعلام الخصائص'],
    ['properties', 'خصائص'],
    ['calibrated timestamps', 'الطوابع الزمنية المُعايرة'],
    ['shader instrumentation', 'تتبع الشيدر'],
    ['performance query counters', 'عدادات استعلامات الأداء'],
    ['performance queries', 'استعلامات الأداء'],
    ['time domains', 'نطاقات الزمن'],
    ['maximum deviation', 'الانحراف الأقصى'],
    ['descriptor buffers', 'مخازن الواصفات'],
    ['descriptor buffer', 'مخزن الواصفات'],
    ['conditional rendering', 'الرسم الشرطي'],
    ['dynamic rendering', 'الرسم الديناميكي'],
    ['render pass', 'تمرير الرسم'],
    ['pipeline', 'خط الأنابيب'],
    ['shader objects', 'كائنات الشيدر'],
    ['query pool', 'مجموعة الاستعلامات'],
    ['query', 'استعلام'],
    ['queries', 'استعلامات'],
    ['flags', 'أعلام'],
    ['flag bits', 'أعلام'],
    ['flag bit', 'علم'],
    ['bitmask', 'قناع أعلام'],
    ['enumeration', 'تعداد'],
    ['enum', 'تعداد']
  ];

  typePhraseMap.forEach(([english, arabic]) => {
    localized = replaceStandaloneTechnicalPhrase(localized, english, arabic);
  });

  const safeReplacements = [
    [/\bbitmask\b/gi, 'قناع أعلام'],
    [/\benum(?:eration)?\b/gi, 'تعداد'],
    [/\bflag bits\b/gi, 'أعلام'],
    [/\bsupported for\b/gi, 'المدعوم لـ'],
    [/\bsupported on\b/gi, 'المدعوم على'],
    [/\bsupported\b/gi, 'المدعوم'],
    [/\bused for\b/gi, 'المستخدم في'],
    [/\bused by\b/gi, 'الذي يستخدمه'],
    [/\bused with\b/gi, 'المستخدم مع'],
    [/\bused\b/gi, 'المستخدم'],
    [/\band\b/gi, 'و'],
    [/\ban\b/gi, ''],
    [/\ba\b/gi, ''],
    [/\bthe\b/gi, ''],
    [/\bspecifies that\b/gi, 'يحدد أن'],
    [/\bspecifies\b/gi, 'يحدد'],
    [/\bcan be set in\b/gi, 'يمكن ضبطها في'],
    [/\bcan be set\b/gi, 'يمكن ضبطها'],
    [/\bcan be saved and reused on a subsequent run\b/gi, 'يمكن حفظه وإعادة استخدامه في تشغيل لاحق'],
    [/\bwill be used with\b/gi, 'سيُستخدم مع'],
    [/\bfor more detail\b/gi, 'لمزيد من التفاصيل'],
    [/\bwhen capturing and replaying\b/gi, 'عند الالتقاط وإعادة التشغيل'],
    [/\badditional creation parameters\b/gi, 'معلمات إنشاء إضافية'],
    [/\bacceleration structure\b/gi, 'بنية التسارع'],
    [/\bacceleration structures\b/gi, 'بنى التسارع'],
    [/\bdescriptor buffers\b/gi, 'مخازن الواصفات'],
    [/\bmotion information\b/gi, 'معلومات الحركة'],
    [/\bsubsequent run\b/gi, 'تشغيل لاحق'],
    [/\btype of\b/gi, 'نوع'],
    [/\bfor\b/gi, 'لـ'],
    [/\bare\b/gi, 'هي'],
    [/\bis\b/gi, 'هو']
  ];

  safeReplacements.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });

  if (hasLatinText(localized)) {
    const translated = translateTechnicalText(localized);
    if (translated && !hasLatinText(translated)) {
      return normalizeSentence(translated);
    }
  }

  return normalizeSentence(localized);
}

function localizeTypeDescription(description) {
  const localized = localizeTypeReferenceText(description);
  return localized ? `الوصف الرسمي: ${localized}` : '';
}

function stripTypeResidualEnglish(text) {
  return cleanText(String(text || ''))
    .replace(/^الوصف الرسمي:\s*/g, '')
    .replace(/\b(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+)\b/g, ' ')
    .replace(/\b(pp?[A-Z][A-Za-z0-9_]*)\b/g, ' ')
    .replace(/\b[a-z]+(?:[A-Z][A-Za-z0-9_]*)+\b/g, ' ')
    .replace(/\b(?:NULL|DRM|Xlib|Winrt|POSIX|HANDLE|Metal|Windows|Zircon|FUCHSIA|X11|SPIR-V|SPIRV|API|UUID|LUID|RGB|RGBA|YCbCr|sRGB|HDR|ASTC|ETC2|AV1|H\.264|H\.265|BVH|MSFT|MESA|MVK|APPLE)\b/gi, ' ');
}

function hasResidualTypeEnglishProse(text) {
  const cleaned = stripTypeResidualEnglish(text);
  return /[ء-ي][A-Za-z]|[A-Za-z][ء-ي]/.test(cleaned) || /\b[a-z]{3,}(?:-[a-z]{2,})?\b/i.test(cleaned);
}

function toTypeMeaningBody(text) {
  let body = descriptionBody(localizeTypeReferenceText(text));
  if (!body) {
    return '';
  }

  const replacements = [
    [/^تعداد يحدد\s+/,''],
    [/^قناع أعلام يحدد\s+/,''],
    [/^أعلام تحدد\s+/,''],
    [/^أعلام خاصة بـ\s+/,''],
    [/^قناع أعلام خاص بـ\s+/,''],
    [/^القيم الممكنة لـ\s+(.+?)\s+التي تحدد\s+/,''],
    [/^القيم الممكنة لـ\s+(.+?)\s+هي\s*/,''],
    [/^الأعلام التي يمكن ضبطها في\s+(.+?)\s+لتحديد\s+/,''],
    [/^الأعلام التي يمكن ضبطها في\s+(.+?)\s+هي\s*/,''],
    [/^القيم التي يمكن ضبطها في\s+(.+?)\s+هي\s*/,''],
    [/^يحدد أن\s+/,'أن '],
    [/^يحدد\s+/,''],
    [/^تحديد\s+/,'']
  ];

  replacements.forEach(([pattern, replacement]) => {
    body = body.replace(pattern, replacement);
  });

  return cleanText(body).replace(/[.؟!]$/, '');
}

function buildTypeUsageFromSpecIntro(specIntro, kind) {
  const intro = normalizeTypeReferenceFormatting(specIntro);
  if (!intro) {
    return '';
  }

  const kindLabel = kind === 'flag' ? 'هذا النوع من الأعلام' : 'هذا التعداد';

  const possibleValuesMatch = intro.match(/^Possible values (?:of|for) (.+?), specifying (.+?), are:?$/i);
  if (possibleValuesMatch) {
    const target = normalizeTypeReferenceFormatting(possibleValuesMatch[1]);
    const meaning = toTypeMeaningBody(possibleValuesMatch[2]) || descriptionBody(localizeTypeReferenceText(possibleValuesMatch[2]));
    return normalizeSentence(`يُستخدم ${kindLabel} عادة مع ${target} لتحديد ${meaning}`);
  }

  const possibleValuesInMatch = intro.match(/^Possible values (?:of|for) (.+?) in (.+?) are:?$/i);
  if (possibleValuesInMatch) {
    const fieldName = normalizeTypeReferenceFormatting(possibleValuesInMatch[1]);
    const ownerName = normalizeTypeReferenceFormatting(possibleValuesInMatch[2]);
    return normalizeSentence(`يُستخدم ${kindLabel} مع الحقل ${fieldName} في ${ownerName} لاختيار القيمة المناسبة للسلوك المطلوب`);
  }

  const bitsMatch = intro.match(/^Bits which can be set in (.+?), specifying (.+?), are:?$/i);
  if (bitsMatch) {
    const target = normalizeTypeReferenceFormatting(bitsMatch[1]);
    const meaning = toTypeMeaningBody(bitsMatch[2]) || descriptionBody(localizeTypeReferenceText(bitsMatch[2]));
    return normalizeSentence(`تُضبط قيم ${kindLabel} في ${target} لتحديد ${meaning}`);
  }

  const valuesInMatch = intro.match(/^Values which can be set in (.+?) are:?$/i);
  if (valuesInMatch) {
    const target = normalizeTypeReferenceFormatting(valuesInMatch[1]);
    return normalizeSentence(`يُستخدم ${kindLabel} مع ${target} لاختيار القيمة المناسبة للسلوك المطلوب`);
  }

  return localizeTypeReferenceText(intro);
}

function extractTypeSpecIntroFromOfficialDoc(officialDoc) {
  return (officialDoc?.usage || []).find((entry) => (
    /^(Possible values|Bits which can be set|Values which can be set)\b/i.test(String(entry || '').replace(/^الوصف الرسمي لهذا .*?:\s*/i, ''))
  )) || '';
}

function localizeNotes(notes) {
  return (notes || []).map((note) => {
    const protectedNote = protectTechnicalIdentifiers(repairCorruptedTechnicalText(note));
    const hasArabicText = /[\u0600-\u06FF]/.test(protectedNote.text);
    const looksAlreadyLocalized =
      hasArabicText
      && (
        /^تتطلب هذه الدالة توفر الامتداد أو الميزة:/u.test(protectedNote.text)
        || /^هذه الدالة مرتبطة بامتداد/u.test(protectedNote.text)
        || /^تظهر بعض القيم في هذا (?:التعداد|النوع من الأعلام) عبر الامتدادات التالية:/u.test(protectedNote.text)
        || /^تحقق من صحة/u.test(protectedNote.text)
        || /^استخدم طبقات التحقق/u.test(protectedNote.text)
      );

    if (looksAlreadyLocalized) {
      return normalizeSentence(protectedNote.restore(protectedNote.text));
    }

    if (!hasLatinText(protectedNote.text)) {
      return normalizeSentence(protectedNote.restore(protectedNote.text));
    }

    return normalizeSentence(protectedNote.restore(translateTechnicalText(protectedNote.text)));
  });
}

function buildArabicFunctionUsage(name, description, parameters, returnType, extension, existingUsage) {
  const specificUsage = buildSpecificFunctionUsage(name, description, returnType, extension);
  if (specificUsage.length) {
    return specificUsage;
  }

  const usage = [];
  const meaningLine = buildFunctionMeaningLine(description);
  if (meaningLine) {
    usage.push(meaningLine);
  }

  if (parameters?.length) {
    const parameterSummary = parameters
      .slice(0, 4)
      .map((param) => `${param.name}: ${descriptionBody(param.description)}`)
      .filter(Boolean)
      .join('، ');

    if (parameterSummary) {
      usage.push(`قبل الاستدعاء جهّز المعاملات الأساسية بالشكل الصحيح، وأهمها: ${parameterSummary}.`);
    }
  }

  const outParameters = (parameters || []).filter(
    (param) => /^p[A-Z]/.test(param.name) && /\*/.test(param.type || '') && !/\bconst\b/.test(param.type || '')
  );
  if (outParameters.length > 0) {
    usage.push(`قد تكتب الدالة نواتجها في معاملات الإخراج مثل ${outParameters.map((param) => param.name).join(' و ')}، لذلك تأكد من تمرير مؤشرات صالحة وقابلة للكتابة.`);
  }

  if (extension) {
    usage.push(`هذه الدالة مرتبطة بالامتداد ${extension} أو إحدى صيغ الامتداد الخاصة به، لذلك يجب التأكد من دعم الامتداد وتفعيله قبل الاستخدام.`);
  }

  if (returnType === 'VkResult') {
    usage.push('تعيد الدالة VkResult لتوضح هل اكتملت العملية بنجاح أو أعادت نتائج جزئية أو فشلت، لذلك تعتمد عليها في تحديد الخطوة التالية في الكود.');
  } else if (returnType && returnType !== 'void') {
    usage.push(`تعيد الدالة قيمة من النوع ${returnType}، لذا ينبغي استخدام النتيجة المرجعة مباشرة أو التحقق منها قبل المتابعة.`);
  } else {
    usage.push('لا تعيد هذه الدالة قيمة مباشرة، ويظهر أثرها على الحالة أو المورد الذي تمرره إليها.');
  }

  return [...new Set(usage)];
}

function sanitizeOfficialDoc(name, doc) {
  if (!doc) {
    return null;
  }

  const extension = inferExtension(name);
  let notes = localizeNotes((doc.notes || []).map((note) =>
    String(note).replace(/VK_[A-Z]+_\./g, extension ? `${extension}.` : 'الامتداد المطلوب.')
  ));
  if (name === 'vkAcquireNextImage2KHR') {
    notes = notes.map((note) => note.includes('VK_سلسلة التبديل_CREATE_DEFERRED_الذاكرة_ALLOCATION_BIT_KHR')
      ? 'إذا أُنشئت سلسلة التبديل باستخدام العلم VK_SWAPCHAIN_CREATE_DEFERRED_MEMORY_ALLOCATION_BIT_KHR، فستكون الصورة التي يُعاد فهرسها في pImageIndex مدعومة بالكامل بالذاكرة قبل عودة الاستدعاء إلى التطبيق.'
      : note
    );
  }
  const parameters = (doc.parameters || []).map((param) => ({
    ...param,
    description: localizeParameterDescription(param, name)
  }));
  const description = localizeFunctionDescription(name, doc.description || '', (doc.usage || [])[0] || '');
  const usage = buildLocalizedOfficialFunctionUsage(
    name,
    description,
    parameters,
    doc.returnType,
    extension,
    doc.usage || []
  );

  return {
    ...doc,
    parserVersion: 3,
    description,
    parameters,
    usage,
    notes
  };
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/dt>/gi, '\n')
      .replace(/<\/dd>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function getSectionBlock(html, id) {
  const marker = `<h2 id="${id}"`;
  const headingIndex = html.indexOf(marker);
  if (headingIndex === -1) {
    return '';
  }

  const sectionStart = html.lastIndexOf('<div class="sect1">', headingIndex);
  const nextSection = html.indexOf('<div class="sect1">', headingIndex + marker.length);
  return html.slice(sectionStart === -1 ? headingIndex : sectionStart, nextSection === -1 ? html.length : nextSection);
}

function parseSignatureParameters(name, signature) {
  const flattened = String(signature || '').replace(/\s+/g, ' ').trim();
  const match = flattened.match(new RegExp(`^(.*?)\\s+${name}\\s*\\((.*)\\)\\s*;?$`));

  if (!match) {
    return {returnType: '', parameters: []};
  }

  const returnType = match[1].trim();
  const paramsSource = match[2].trim();

  if (!paramsSource || paramsSource === 'void') {
    return {returnType, parameters: []};
  }

  const parameters = paramsSource.split(/\s*,\s*/).map((param, index) => {
    const cleaned = param.trim();
    const paramMatch = cleaned.match(/^(.*\S)\s+([A-Za-z_]\w*(?:\[[^\]]*\])?)$/);
    if (!paramMatch) {
      return {
        name: `param${index + 1}`,
        type: cleaned,
        description: ''
      };
    }

    return {
      name: paramMatch[2].trim(),
      type: paramMatch[1].trim(),
      description: ''
    };
  });

  return {returnType, parameters};
}

const vkResultDescriptionMap = {
  VK_SUCCESS: 'تم تنفيذ العملية بنجاح.',
  VK_NOT_READY: 'العملية لم تكتمل بعد والنتيجة ليست جاهزة حالياً.',
  VK_TIMEOUT: 'انتهت المهلة المحددة قبل اكتمال العملية.',
  VK_EVENT_SET: 'الحدث في حالة مفعلة.',
  VK_EVENT_RESET: 'الحدث في حالة غير مفعلة.',
  VK_INCOMPLETE: 'تمت إعادة جزء من النتائج فقط، وتوجد بيانات إضافية يمكن طلبها.',
  VK_SUBOPTIMAL_KHR: 'نجحت العملية لكن النتيجة ليست بالحالة المثالية الحالية.',
  VK_ERROR_OUT_OF_HOST_MEMORY: 'فشل بسبب نفاد ذاكرة المضيف.',
  VK_ERROR_OUT_OF_DEVICE_MEMORY: 'فشل بسبب نفاد ذاكرة الجهاز.',
  VK_ERROR_INITIALIZATION_FAILED: 'فشل التهيئة المطلوبة للعملية.',
  VK_ERROR_DEVICE_LOST: 'فُقد الاتصال بالجهاز المنطقي أو أصبح غير صالح.',
  VK_ERROR_MEMORY_MAP_FAILED: 'فشل ربط الذاكرة في مساحة عنوان المضيف.',
  VK_ERROR_LAYER_NOT_PRESENT: 'إحدى الطبقات المطلوبة غير متوفرة.',
  VK_ERROR_EXTENSION_NOT_PRESENT: 'أحد الامتدادات المطلوبة غير متوفر.',
  VK_ERROR_FEATURE_NOT_PRESENT: 'الميزة المطلوبة غير مدعومة.',
  VK_ERROR_INCOMPATIBLE_DRIVER: 'برنامج التشغيل غير متوافق مع الطلب.',
  VK_ERROR_TOO_MANY_OBJECTS: 'تم تجاوز الحد المسموح من الكائنات.',
  VK_ERROR_FORMAT_NOT_SUPPORTED: 'التنسيق المطلوب غير مدعوم.',
  VK_ERROR_FRAGMENTED_POOL: 'فشل التخصيص بسبب تجزئة المجمّع.',
  VK_ERROR_OUT_OF_POOL_MEMORY: 'لا توجد ذاكرة كافية داخل المجمّع المطلوب.',
  VK_ERROR_INVALID_EXTERNAL_HANDLE: 'المقبض الخارجي الممرر غير صالح.',
  VK_ERROR_SURFACE_LOST_KHR: 'فُقد سطح العرض المرتبط بالعملية.',
  VK_ERROR_NATIVE_WINDOW_IN_USE_KHR: 'النافذة الأصلية مستخدمة بالفعل من سطح آخر.',
  VK_ERROR_OUT_OF_DATE_KHR: 'المورد المرتبط بالعرض أصبح قديماً ويحتاج إعادة إنشاء.',
  VK_ERROR_INCOMPATIBLE_DISPLAY_KHR: 'العرض الحالي غير متوافق مع الطلب.',
  VK_ERROR_VALIDATION_FAILED: 'فشلت التحققّات القياسية الخاصة بصحة الاستخدام.',
  VK_ERROR_UNKNOWN: 'حدث خطأ غير محدد من تعريف Vulkan أو المنصة.'
};

function describeVkResult(code) {
  if (vkResultDescriptionMap[code]) {
    return vkResultDescriptionMap[code];
  }

  if (code.startsWith('VK_ERROR_')) {
    return 'رمز فشل من Vulkan. راجع المواصفة لمعنى هذه الحالة بدقة.';
  }

  if (code.startsWith('VK_')) {
    return 'رمز نتيجة من Vulkan مرتبط بهذه الدالة.';
  }

  return '';
}

function buildOfficialUsage(shortDescription, descriptionParagraphs, returnType) {
  const usage = [];

  if (shortDescription) {
    const localizedShortDescription = localizeFunctionNameLine(shortDescription) || translateTechnicalText(shortDescription);
    usage.push(`تُستخدم هذه الدالة من أجل: ${descriptionBody(localizedShortDescription)}.`);
  }

  descriptionParagraphs.slice(0, 2).forEach((paragraph) => {
    if (paragraph) {
      usage.push(translateTechnicalText(paragraph));
    }
  });

  if (returnType === 'VkResult') {
    usage.push('تعيد الدالة VkResult لتوضح هل اكتملت العملية بنجاح أو أعادت نتائج جزئية أو فشلت، لذلك تستخدم النتيجة لتحديد المتابعة أو إعادة الطلب أو معالجة الخطأ.');
  } else if (returnType && returnType !== 'void') {
    usage.push(`تعيد الدالة قيمة من النوع ${returnType}، لذلك يجب التعامل مع النتيجة المرجعة مباشرة.`);
  } else if (returnType === 'void') {
    usage.push('لا تعيد الدالة قيمة، وتأثيرها يظهر على الموارد أو الحالة التي تمررها إليها.');
  }

  return [...new Set(usage)];
}

function buildOfficialTypeUsage(name, kind, shortDescription, specIntro, valueCount) {
  const usage = [];
  const kindLabel = kind === 'flag' ? 'الأعلام' : 'التعداد';

  if (shortDescription) {
    const meaning = toTypeMeaningBody(shortDescription) || descriptionBody(localizeTypeReferenceText(shortDescription));
    if (meaning) {
      if (kind === 'flag') {
        usage.push(`يمثل هذا النوع من الأعلام القيم أو البتات التي تُستخدم لتحديد ${meaning}.`);
      } else {
        usage.push(`يمثل هذا التعداد القيم التي تحدد ${meaning}.`);
      }
    }
  }

  if (specIntro) {
    usage.push(buildTypeUsageFromSpecIntro(specIntro, kind));
  }

  if (valueCount > 0) {
    usage.push(`توضح القيم المعرفة داخل ${name} السلوك الفعلي الذي سيُقرأ من الحقل أو البنية أو الدالة التي تستقبل هذا ${kindLabel}.`);
  }

  return [...new Set(usage.filter(Boolean))];
}

function parseOfficialFunctionDoc(name, html) {
  const nameSection = getSectionBlock(html, '_name');
  const shortDescriptionMatch = nameSection.match(new RegExp(`<p>${name}\\s*-\\s*([\\s\\S]*?)<\\/p>`, 'i'));
  const shortDescription = stripHtml(shortDescriptionMatch?.[1] || '');

  const cSpecSection = getSectionBlock(html, '_c_specification');
  const signatureMatch = cSpecSection.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i);
  const rawSignature = stripHtml(signatureMatch?.[1] || '')
    .replace(/^\s*\/\/[^\n]*\n?/gm, '')
    .trim();
  const signature = rawSignature.replace(/\n{3,}/g, '\n\n');
  const signatureInfo = parseSignatureParameters(name, signature);

  const providedByMatch = signatureMatch?.[1]?.match(/\/\/\s*Provided by\s+([A-Za-z0-9_]+)/);

  const parametersSection = getSectionBlock(html, '_parameters');
  const parameterDescriptions = new Map();
  for (const match of parametersSection.matchAll(/<li>\s*<p><code>([^<]+)<\/code>\s*([\s\S]*?)<\/p>\s*<\/li>/gi)) {
    parameterDescriptions.set(match[1].trim(), stripHtml(match[2]));
  }

  const parameters = signatureInfo.parameters.map((param) => ({
    ...param,
    description: parameterDescriptions.get(param.name) || ''
  }));

  const descriptionSection = getSectionBlock(html, '_description');
  const descriptionParagraphs = [...descriptionSection.matchAll(/<div class="paragraph">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);

  const returnCodesBlock = descriptionSection.match(/<div class="title">Return Codes<\/div>([\s\S]*?)<\/dl>/i)?.[1] || '';
  const returnValues = [...returnCodesBlock.matchAll(/>(VK_[A-Z0-9_]+)</g)]
    .map((match) => match[1])
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((value) => ({
      value,
      description: describeVkResult(value)
    }));

  const seeAlsoSection = getSectionBlock(html, '_see_also');
  const seeAlso = [...seeAlsoSection.matchAll(/>(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+)</g)]
    .map((match) => match[1])
    .filter((value, index, array) => array.indexOf(value) === index);

  const notes = [];
  if (providedByMatch?.[1]) {
    notes.push(`تتطلب هذه الدالة توفر الامتداد أو الميزة: ${providedByMatch[1]}.`);
  }

  return {
    name,
    returnType: signatureInfo.returnType,
    signature,
    description: shortDescription ? `الوصف الرسمي: ${shortDescription}.` : '',
    usage: buildOfficialUsage(shortDescription, descriptionParagraphs, signatureInfo.returnType),
    parameters,
    returnValues,
    notes,
    example: '',
    seeAlso
  };
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'ArabicVulkan/4.0'
          }
        },
        (response) => {
          if (
            response.statusCode &&
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            response.resume();
            const redirectedUrl = new URL(response.headers.location, url).toString();
            fetchText(redirectedUrl).then(resolve, reject);
            return;
          }

          if (response.statusCode === 404) {
            response.resume();
            resolve(null);
            return;
          }

          if (response.statusCode !== 200) {
            response.resume();
            reject(new Error(`HTTP ${response.statusCode} for ${url}`));
            return;
          }

          response.setEncoding('utf8');
          let body = '';
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () => resolve(body));
        }
      )
      .on('error', reject);
  });
}

async function loadOfficialFunctionDoc(name) {
  ensureDir(officialDocsCacheDir);
  const cachePath = path.join(officialDocsCacheDir, `${name}.json`);

  if (fs.existsSync(cachePath)) {
    const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (cached?.parserVersion === 3) {
      return sanitizeOfficialDoc(name, cached);
    }
  }

  const url = `https://docs.vulkan.org/refpages/latest/refpages/source/${name}.html`;
  const html = await fetchText(url);

  if (!html) {
    return null;
  }

  const doc = parseOfficialFunctionDoc(name, html);
  const sanitizedDoc = sanitizeOfficialDoc(name, doc);
  fs.writeFileSync(cachePath, JSON.stringify(sanitizedDoc, null, 2));
  return sanitizedDoc;
}

function parseOfficialEnumValuesFromSignature(signatureBlock) {
  const values = [];
  const bodyMatch = String(signatureBlock || '').match(/typedef\s+enum\s+[A-Za-z_]\w*\s*\{([\s\S]*?)\}\s*[A-Za-z_]\w*\s*;/);
  if (!bodyMatch) {
    return values;
  }

  const lines = bodyMatch[1].split('\n');
  for (const line of lines) {
    const cleaned = line.trim();
    if (!cleaned || cleaned.startsWith('//')) {
      continue;
    }

    const match = cleaned.match(/^(VK_[A-Z0-9_]+)\s*=\s*([^,\s]+)\s*,?/);
    if (!match) {
      continue;
    }

    values.push({
      name: match[1],
      value: match[2]
    });
  }

  return values;
}

function parseOfficialEnumDoc(targetName, pageName, html, kind) {
  const nameSection = getSectionBlock(html, '_name');
  const shortDescriptionMatch = nameSection.match(new RegExp(`<p>${pageName}\\s*-\\s*([\\s\\S]*?)<\\/p>`, 'i'));
  const shortDescription = stripHtml(shortDescriptionMatch?.[1] || '');

  const cSpecSection = getSectionBlock(html, '_c_specification');
  const signatureMatch = cSpecSection.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i);
  const rawSignature = stripHtml(signatureMatch?.[1] || '');
  const specIntro = [...String(cSpecSection || '').matchAll(/<div class="paragraph">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/gi)]
    .map((match) => stripHtml(match[1]))
    .find(Boolean) || '';
  const valuesFromSignature = parseOfficialEnumValuesFromSignature(rawSignature);

  const descriptionSection = getSectionBlock(html, '_description');
  const valueDescriptionMap = new Map();
  for (const match of descriptionSection.matchAll(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/gi)) {
    const text = stripHtml(match[1]);
    const valueMatch = text.match(/^(VK_[A-Z0-9_]+)\s+(.*)$/);
    if (!valueMatch) {
      continue;
    }
    valueDescriptionMap.set(valueMatch[1], localizeTypeReferenceText(valueMatch[2]));
  }
  for (const match of descriptionSection.matchAll(/<dt[^>]*>[\s\S]*?<code>(VK_[A-Z0-9_]+)<\/code>[\s\S]*?<\/dt>\s*<dd>\s*<p>([\s\S]*?)<\/p>/gi)) {
    valueDescriptionMap.set(match[1], localizeTypeReferenceText(stripHtml(match[2])));
  }

  const values = valuesFromSignature.map((value) => ({
    name: value.name,
    value: value.value,
    description: valueDescriptionMap.get(value.name) || ''
  }));

  const seeAlsoSection = getSectionBlock(html, '_see_also');
  const seeAlso = [...seeAlsoSection.matchAll(/>(vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+)</g)]
    .map((match) => match[1])
    .filter((value, index, array) => array.indexOf(value) === index);

  const providedBy = [...String(signatureMatch?.[1] || '').matchAll(/\/\/\s*Provided by\s+([A-Za-z0-9_]+)/g)]
    .map((match) => String(match[1] || '').trim())
    .filter((name) => /^VK_[A-Za-z0-9_]+$/.test(name))
    .filter((name, index, array) => array.indexOf(name) === index);

  const notes = [];
  if (providedBy.length > 0) {
    notes.push(`تظهر بعض القيم في هذا ${kind === 'flag' ? 'النوع من الأعلام' : 'التعداد'} عبر الامتدادات التالية: ${providedBy.join('، ')}.`);
  }

  return {
    parserVersion: 2,
    name: targetName,
    description: localizeTypeDescription(shortDescription || specIntro || ''),
    usage: buildOfficialTypeUsage(targetName, kind, shortDescription, specIntro, values.length),
    values,
    notes,
    seeAlso
  };
}

function isMeaningfulTypeDoc(doc) {
  return Boolean(
    doc &&
    doc.parserVersion === 2 &&
    (
      String(doc.description || '').trim() ||
      (Array.isArray(doc.values) && doc.values.length > 0) ||
      (Array.isArray(doc.usage) && doc.usage.length > 0)
    )
  );
}

function resolveOfficialTypeDocCandidates(name) {
  const candidates = [name];
  const suffixes = ['KHR', 'EXT', 'NVX', 'NV', 'AMD', 'ARM', 'QCOM', 'HUAWEI', 'FUCHSIA', 'ANDROID', 'GOOGLE', 'VALVE', 'LUNARG', 'SEC', 'NN', 'IMG', 'GGP', 'QNX', 'OHOS', 'AMDX'];
  const suffixMatch = String(name || '').match(/^(Vk.+?)(KHR|EXT|NVX|NV|AMD|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX)$/);

  if (suffixMatch) {
    const base = suffixMatch[1];
    candidates.push(base);
    suffixes.forEach((suffix) => {
      if (`${base}${suffix}` !== name) {
        candidates.push(`${base}${suffix}`);
      }
    });
  }

  return [...new Set(candidates)];
}

async function loadOfficialTypeDoc(name, kind) {
  ensureDir(officialTypeDocsCacheDir);
  const cachePath = path.join(officialTypeDocsCacheDir, `${name}.json`);

  if (fs.existsSync(cachePath)) {
    const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    if (isMeaningfulTypeDoc(cached)) {
      return cached;
    }
  }

  for (const candidate of resolveOfficialTypeDocCandidates(name)) {
    const url = `https://docs.vulkan.org/refpages/latest/refpages/source/${candidate}.html`;
    const html = await fetchText(url);
    if (!html) {
      continue;
    }

    const doc = parseOfficialEnumDoc(name, candidate, html, kind);
    if (isMeaningfulTypeDoc(doc)) {
      fs.writeFileSync(cachePath, JSON.stringify(doc, null, 2));
      return doc;
    }
  }

  const emptyDoc = {name, description: '', usage: [], values: [], notes: [], seeAlso: []};
  fs.writeFileSync(cachePath, JSON.stringify(emptyDoc, null, 2));
  return emptyDoc;
}

function needsOfficialTypeDoc(item, kind) {
  if (!item) {
    return true;
  }

  const genericText = kind === 'flag'
    ? 'نوع أعلام bitmask'
    : 'نوع تعداد يعرّف مجموعة قيم';
  const hasGenericDescription = String(item.description || '').includes(genericText);
  const hasValues = Array.isArray(item.values) && item.values.length > 0;

  return hasGenericDescription || !hasValues;
}

async function enrichTypeDocs(typeDocs, typeNames, kind) {
  const missingNames = typeNames.filter((name) => needsOfficialTypeDoc(typeDocs.get(name), kind));
  if (!missingNames.length) {
    return;
  }

  let completed = 0;
  await mapWithConcurrency(missingNames, 8, async (name) => {
    try {
      const officialDoc = await loadOfficialTypeDoc(name, kind);
      if (officialDoc) {
        typeDocs.set(name, officialDoc);
      }
    } finally {
      completed += 1;
      if (completed % 50 === 0 || completed === missingNames.length) {
        console.error(`official-type-docs-${kind}: ${completed}/${missingNames.length}`);
      }
    }
  });
}

function needsOfficialFunctionDoc(doc) {
  if (!doc) {
    return true;
  }

  const hasSignature = doc.signature && !doc.signature.includes('/* المعاملات */');
  const hasParameters = Array.isArray(doc.parameters) && doc.parameters.length > 0;
  const hasMeaningfulDescription =
    !!doc.description && !doc.description.includes('الشرح التفصيلي الكامل غير متوفر');

  return !(hasSignature && hasParameters && hasMeaningfulDescription);
}

function resolveFunctionAliasCandidates(name) {
  const candidates = [];
  const suffixMatch = String(name || '').match(/^(vk.+?)(KHR|EXT|NVX|NV|AMD|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX)$/);
  if (!suffixMatch) {
    return candidates;
  }

  const base = suffixMatch[1];
  const suffix = suffixMatch[2];
  candidates.push(base);

  const suffixAliases = {
    EXT: ['KHR'],
    KHR: ['EXT'],
    NV: ['KHR'],
    NVX: ['NV', 'KHR']
  };

  (suffixAliases[suffix] || []).forEach((aliasSuffix) => {
    candidates.push(`${base}${aliasSuffix}`);
  });

  return [...new Set(candidates)];
}

function renameFunctionInSignature(signature, fromName, toName) {
  return String(signature || '').replace(new RegExp(`\\b${escapeRegex(fromName)}\\b`, 'g'), toName);
}

function cloneFunctionDocForAlias(baseDoc, aliasName, baseName) {
  if (!baseDoc) {
    return null;
  }

  return {
    ...baseDoc,
    name: aliasName,
    signature: renameFunctionInSignature(baseDoc.signature || '', baseName, aliasName),
    example: String(baseDoc.example || '').replace(new RegExp(`\\b${escapeRegex(baseName)}\\b`, 'g'), aliasName),
    seeAlso: [...new Set([...(baseDoc.seeAlso || []), baseName])]
  };
}

function hydrateAliasFunctionDocs(functionDocs) {
  for (const [name, doc] of functionDocs.entries()) {
    const hasSignature = doc?.signature && !String(doc.signature).includes('/* المعاملات */');
    const hasParameters = Array.isArray(doc?.parameters) && doc.parameters.length > 0;
    if (hasSignature && hasParameters) {
      continue;
    }

    for (const candidate of resolveFunctionAliasCandidates(name)) {
      const baseDoc = functionDocs.get(candidate);
      if (!baseDoc) {
        continue;
      }

      const aliasDoc = cloneFunctionDocForAlias(baseDoc, name, candidate);
      functionDocs.set(name, mergeDocs(aliasDoc, doc));
      break;
    }
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const queue = [...items];
  const workers = Array.from({length: Math.min(limit, items.length)}, async () => {
    while (queue.length) {
      const item = queue.shift();
      await mapper(item);
    }
  });

  await Promise.all(workers);
}

async function enrichFunctionDocs(functionDocs, functionNames) {
  const missingNames = functionNames.filter((name) => needsOfficialFunctionDoc(functionDocs.get(name)));

  if (!missingNames.length) {
    return;
  }

  let completed = 0;
  await mapWithConcurrency(missingNames, 8, async (name) => {
    try {
      const officialDoc = await loadOfficialFunctionDoc(name);
      if (officialDoc) {
        functionDocs.set(name, mergeDocs(functionDocs.get(name), officialDoc));
      }
    } finally {
      completed += 1;
      if (completed % 50 === 0 || completed === missingNames.length) {
        console.error(`official-docs: ${completed}/${missingNames.length}`);
      }
    }
  });
}

function inferFunctionCategoryKey(name, existingCategory) {
  if (existingCategory) return existingCategory;
  if (name.startsWith('vkCmd')) return 'command_buffer';
  if (name.startsWith('vkCreate')) return 'create';
  if (name.startsWith('vkDestroy')) return 'destroy';
  if (name.startsWith('vkGet')) return 'query';
  if (name.startsWith('vkEnumerate')) return 'enumerate';
  if (name.startsWith('vkAllocate')) return 'allocate';
  if (name.startsWith('vkFree')) return 'free';
  if (name.startsWith('vkQueue')) return 'queue';
  if (name.startsWith('vkAcquire')) return 'acquire';
  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) return 'memory';
  if (name.startsWith('vkBind')) return 'binding';
  return 'general';
}

function getDetailBucketKey(rawName) {
  const normalized = String(rawName || '')
    .replace(/^vk/, '')
    .replace(/^Vk/, '')
    .replace(/^VK_/, '')
    .replace(/^[^A-Za-z0-9]+/, '');
  const compact = normalized.replace(/[^A-Za-z0-9]+/g, '').toUpperCase();
  if (!compact) {
    return '_';
  }
  const bucket = compact.slice(0, 2);
  return /^[A-Z0-9]{1,2}$/.test(bucket) ? bucket : '_';
}

function toLiteFunctionItem(item) {
  return {
    name: item.name,
    category: item.category || '',
    description: item.description || '',
    returnType: item.returnType || '',
    extension: item.extension || '',
    detailBucket: getDetailBucketKey(item.name),
    __lite: true
  };
}

function toLiteTypeItem(item) {
  return {
    name: item.name,
    description: item.description || '',
    extension: item.extension || '',
    syntheticGroup: item.syntheticGroup || '',
    isSynthetic: !!item.isSynthetic,
    detailBucket: getDetailBucketKey(item.name),
    __lite: true
  };
}

function toLiteEnumItem(item) {
  return {
    name: item.name,
    description: item.description || '',
    extension: item.extension || '',
    detailBucket: getDetailBucketKey(item.name),
    __lite: true
  };
}

function toLiteConstantItem(item) {
  return {
    name: item.name,
    description: item.description || '',
    extension: item.extension || '',
    detailBucket: getDetailBucketKey(item.name),
    __lite: true
  };
}

function toLiteMacroItem(item) {
  return {
    name: item.name,
    description: item.description || '',
    extension: item.extension || '',
    detailBucket: getDetailBucketKey(item.name),
    __lite: true
  };
}

function mapSectionItems(sectionObject, mapper) {
  return Object.fromEntries(
    Object.entries(sectionObject || {}).map(([key, section]) => [
      key,
      {
        ...section,
        items: (section.items || []).map(mapper)
      }
    ])
  );
}

function collectSectionDetailBuckets(sectionObject) {
  const keys = new Set();

  Object.values(sectionObject || {}).forEach((section) => {
    (section.items || []).forEach((item) => {
      keys.add(getDetailBucketKey(item.name));
    });
  });

  return Array.from(keys).sort();
}

function writeChunkedSectionFiles(rootDir, segmentName, exportKey, sectionObject) {
  const segmentDir = path.join(splitOutputDir, segmentName);
  ensureDir(segmentDir);
  fs.readdirSync(segmentDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .forEach((fileName) => {
      fs.unlinkSync(path.join(segmentDir, fileName));
    });

  const bucketMap = new Map();

  Object.entries(sectionObject || {}).forEach(([sectionKey, section]) => {
    (section.items || []).forEach((item) => {
      const bucketKey = getDetailBucketKey(item.name);
      if (!bucketMap.has(bucketKey)) {
        bucketMap.set(bucketKey, {});
      }
      const bucketSections = bucketMap.get(bucketKey);
      if (!bucketSections[sectionKey]) {
        bucketSections[sectionKey] = {
          ...section,
          items: []
        };
      }
      bucketSections[sectionKey].items.push(item);
    });
  });

  bucketMap.forEach((bucketSections, bucketKey) => {
    const payload = {
      [exportKey]: bucketSections
    };
    fs.writeFileSync(path.join(segmentDir, `${bucketKey}.json`), serializeCompact(payload));
  });
}

function formatFunctionCategory(categoryKey, name) {
  const labels = {
    instance: 'المثيل',
    device: 'الجهاز المنطقي',
    physical_device: 'الجهاز الفيزيائي',
    queue: 'الطوابير',
    swapchain: 'سلسلة التبديل',
    command_buffer: 'مخزن الأوامر',
    command_pool: 'مستودع الأوامر',
    synchronization: 'المزامنة',
    memory: 'الذاكرة',
    buffer: 'المخازن',
    image: 'الصور',
    descriptor: 'الواصفات',
    render_pass: 'تمرير الرسم',
    pipeline: 'خط الأنابيب',
    shader: 'المظللات',
    create: 'الإنشاء',
    destroy: 'التدمير',
    query: 'الاستعلام',
    enumerate: 'الاستعراض',
    allocate: 'الحجز',
    free: 'التحرير',
    acquire: 'الاكتساب',
    binding: 'الربط',
    general: 'دوال Vulkan'
  };

  return labels[categoryKey] || labels[inferFunctionCategoryKey(name)] || 'دوال Vulkan';
}

function inferFunctionReturnType(name) {
  if (
    name.startsWith('vkCmd') ||
    name.startsWith('vkDestroy') ||
    name.startsWith('vkFree') ||
    name.startsWith('vkGetPhysicalDevice') ||
    name.startsWith('vkGetDeviceQueue') ||
    name.startsWith('vkGetInstanceProcAddr') ||
    name.startsWith('vkGetDeviceProcAddr') ||
    name.startsWith('vkUnmap')
  ) {
    return 'void';
  }

  if (name.startsWith('vkGet') && !name.startsWith('vkGetPhysicalDevice')) {
    return 'VkResult';
  }

  if (
    name.startsWith('vkCreate') ||
    name.startsWith('vkAllocate') ||
    name.startsWith('vkAcquire') ||
    name.startsWith('vkBegin') ||
    name.startsWith('vkEnd') ||
    name.startsWith('vkQueue') ||
    name.startsWith('vkBind') ||
    name.startsWith('vkMap') ||
    name.startsWith('vkEnumerate')
  ) {
    return 'VkResult';
  }

  return '';
}

function stripVendorSuffix(name) {
  return String(name || '').replace(/(KHR|EXT|NVX|NV|AMD|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX)$/,'');
}

function splitCamelTokens(value) {
  return String(value || '').match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) || [];
}

function localizeCommandSubject(rawSubject) {
  let subject = stripVendorSuffix(rawSubject);
  const phraseMap = [
    ['DebugUtilsLabel', 'نطاق التسمية التصحيحية'],
    ['DebugMarker', 'نطاق debug marker'],
    ['ConditionalRendering', 'الرسم الشرطي'],
    ['PerTileExecution', 'التنفيذ لكل بلاطة'],
    ['TransformFeedback', 'التغذية الراجعة للتحويل'],
    ['RenderPass', 'تمرير الرسم'],
    ['Subpass', 'الممر الفرعي'],
    ['VideoCoding', 'ترميز الفيديو'],
    ['ShaderInstrumentation', 'تتبع الشيدر'],
    ['DescriptorSets', 'مجموعات الواصفات'],
    ['DescriptorSet', 'مجموعة الواصفات'],
    ['DescriptorBuffers', 'مخازن الواصفات'],
    ['DescriptorBuffer', 'مخزن الواصفات'],
    ['DescriptorBufferEmbeddedSamplers', 'السامبلرات المضمّنة في مخزن الواصفات'],
    ['IndexBuffer', 'مخزن الفهارس'],
    ['VertexBuffers', 'مخازن الرؤوس'],
    ['VertexBuffer', 'مخزن الرؤوس'],
    ['InvocationMask', 'قناع الاستدعاء'],
    ['ShadingRateImage', 'صورة معدل التظليل'],
    ['TileMemory', 'ذاكرة البلاطات'],
    ['PipelineBarrier', 'حاجز خط الأنابيب'],
    ['PushConstants', 'الثوابت الفورية'],
    ['PushDescriptorSetWithTemplate', 'مجموعة الواصفات باستخدام قالب'],
    ['PushDescriptorSet', 'مجموعة الواصفات'],
    ['MeshTasks', 'مهام mesh'],
    ['ColorBlendEquation', 'معادلة مزج اللون'],
    ['ColorBlendEnable', 'تفعيل مزج اللون'],
    ['ColorWriteMask', 'قناع كتابة اللون'],
    ['ColorWriteEnable', 'تفعيل كتابة اللون'],
    ['BlendConstants', 'ثوابت المزج'],
    ['DepthBiasEnable', 'تفعيل انحياز العمق'],
    ['DepthBias', 'انحياز العمق'],
    ['DepthBoundsTestEnable', 'تفعيل اختبار حدود العمق'],
    ['DepthBounds', 'حدود العمق'],
    ['DepthCompareOp', 'عملية مقارنة العمق'],
    ['DepthTestEnable', 'تفعيل اختبار العمق'],
    ['DepthWriteEnable', 'تفعيل كتابة العمق'],
    ['DepthClipEnable', 'تفعيل قص العمق'],
    ['DepthClipNegativeOneToOne', 'نمط قص العمق من سالب واحد إلى واحد'],
    ['DepthClampEnable', 'تفعيل تثبيت العمق'],
    ['DepthClampRange', 'مدى تثبيت العمق'],
    ['StencilTestEnable', 'تفعيل اختبار الاستنسل'],
    ['StencilCompareMask', 'قناع مقارنة الاستنسل'],
    ['StencilWriteMask', 'قناع كتابة الاستنسل'],
    ['StencilReference', 'القيمة المرجعية للاستنسل'],
    ['StencilOp', 'عملية الاستنسل'],
    ['CullMode', 'نمط الاستبعاد'],
    ['FrontFace', 'اتجاه الوجه الأمامي'],
    ['PrimitiveTopology', 'طوبولوجيا البدائيات'],
    ['PrimitiveRestartEnable', 'تفعيل إعادة بدء البدائيات'],
    ['PrimitiveRestart', 'إعادة بدء البدائيات'],
    ['RasterizerDiscardEnable', 'تفعيل تجاهل خرج الراسترة'],
    ['RasterizationSamples', 'عدد عينات الراسترة'],
    ['RasterizationStream', 'تيار الراسترة'],
    ['ViewportWScaling', 'تحجيم W لمنفذ العرض'],
    ['Viewport', 'منفذ العرض'],
    ['Scissor', 'منطقة القص'],
    ['LineWidth', 'عرض الخط'],
    ['LineStipple', 'تنقيط الخط'],
    ['PolygonMode', 'نمط المضلع'],
    ['LogicOp', 'العملية المنطقية'],
    ['PatchControlPoints', 'نقاط تحكم الرقعة'],
    ['SampleMask', 'قناع العينات'],
    ['SampleLocations', 'مواقع العينات'],
    ['AlphaToCoverageEnable', 'تفعيل alpha-to-coverage'],
    ['AlphaToOneEnable', 'تفعيل alpha-to-one'],
    ['CoverageToColorEnable', 'تفعيل coverage-to-color'],
    ['CoverageToColorLocation', 'موضع coverage-to-color'],
    ['CoverageModulationMode', 'نمط تضمين التغطية'],
    ['CoverageModulationTableEnable', 'تفعيل جدول تضمين التغطية'],
    ['CoverageModulationTable', 'جدول تضمين التغطية'],
    ['CoverageReductionMode', 'نمط تقليل التغطية'],
    ['ConservativeRasterizationMode', 'وضع الراسترة المحافظة'],
    ['ExtraPrimitiveOverestimationSize', 'حجم المبالغة الإضافية للبدائيات'],
    ['RepresentativeFragmentTestEnable', 'تفعيل اختبار المقطع التمثيلي'],
    ['FragmentShadingRate', 'معدل تظليل المقطع'],
    ['FragmentShadingRateEnum', 'تعداد معدل تظليل المقطع'],
    ['FragmentDensityMapOffsets', 'إزاحات خريطة كثافة المقطع'],
    ['AttachmentFeedbackLoopEnable', 'تفعيل حلقة التغذية الراجعة للمرفق'],
    ['ExclusiveScissor', 'القص الحصري'],
    ['TessellationDomainOrigin', 'أصل مجال tessellation'],
    ['ProvokingVertexMode', 'نمط الرأس المسبِّب'],
    ['DiscardRectangle', 'مستطيل التجاهل'],
    ['Checkpoint', 'نقطة التحقق'],
    ['Event2', 'الحدث'],
    ['Event', 'الحدث'],
    ['QueryIndexed', 'الاستعلام المفهرس'],
    ['Query', 'الاستعلام'],
    ['Rendering', 'الرسم الديناميكي'],
    ['Shader', 'الشيدر'],
    ['Shaders', 'الشيدرات'],
    ['Pipeline', 'خط الأنابيب'],
    ['Buffer', 'المخزن'],
    ['Image', 'الصورة'],
    ['Images', 'الصور']
  ];

  phraseMap.forEach(([source, target]) => {
    subject = subject.replace(new RegExp(source, 'g'), target);
  });

  const tokenMap = new Map([
    ['Begin', 'بداية'],
    ['End', 'نهاية'],
    ['Insert', 'إدراج'],
    ['Bind', 'ربط'],
    ['Set', 'ضبط'],
    ['Push', 'دفع'],
    ['Copy', 'نسخ'],
    ['Clear', 'تصفير'],
    ['Resolve', 'resolve'],
    ['Dispatch', 'إطلاق'],
    ['Draw', 'رسم'],
    ['Execute', 'تنفيذ'],
    ['Fill', 'ملء'],
    ['Reset', 'إعادة تعيين'],
    ['Wait', 'انتظار'],
    ['Next', 'الانتقال إلى التالي'],
    ['Build', 'بناء'],
    ['Update', 'تحديث'],
    ['Blit', 'نسخ مع تحجيم'],
    ['Indirect', 'غير المباشر'],
    ['Indexed', 'المفهرس'],
    ['Count', 'العدد'],
    ['Byte', 'البايت'],
    ['Tasks', 'المهام'],
    ['Mesh', 'mesh'],
    ['Graphics', 'الرسوميات'],
    ['Compute', 'الحوسبة'],
    ['Color', 'اللون'],
    ['Depth', 'العمق'],
    ['Stencil', 'الاستنسل'],
    ['Memory', 'الذاكرة'],
    ['Constants', 'الثوابت'],
    ['Label', 'الوسم'],
    ['Utils', 'الأدوات'],
    ['Debug', 'التصحيح'],
    ['Marker', 'العلامة'],
    ['Per', 'لكل'],
    ['Tile', 'بلاطة'],
    ['Execution', 'التنفيذ'],
    ['Conditional', 'الشرطي'],
    ['Rendering', 'الرسم'],
    ['Video', 'الفيديو']
  ]);

  const localized = splitCamelTokens(subject)
    .map((token) => tokenMap.get(token) || token)
    .join(' ');

  return cleanText(localized.replace(/\bال غير المباشر\b/g, 'غير المباشر'));
}

function inferGenericCommandDescription(name) {
  if (!String(name || '').startsWith('vkCmd')) {
    return '';
  }

  const stem = stripVendorSuffix(String(name || '').replace(/^vkCmd/, ''));
  const matchers = [
    [/^Begin(.+)$/, (subject) => `أمر يُسجَّل لبدء ${subject} داخل مخزن الأوامر.`],
    [/^End(.+)$/, (subject) => `أمر يُسجَّل لإنهاء ${subject} داخل مخزن الأوامر.`],
    [/^Insert(.+)$/, (subject) => `أمر يُسجَّل لإدراج ${subject} داخل مخزن الأوامر.`],
    [/^Bind(.+)$/, (subject) => `أمر يُسجَّل لربط ${subject} داخل مخزن الأوامر.`],
    [/^Set(.+)$/, (subject) => `أمر يُسجَّل لضبط ${subject} ديناميكياً داخل مخزن الأوامر.`],
    [/^Push(.+)$/, (subject) => `أمر يُسجَّل لدفع ${subject} داخل مخزن الأوامر.`],
    [/^Copy(.+)$/, (subject) => `أمر يُسجَّل لنسخ ${subject} داخل مخزن الأوامر.`],
    [/^Clear(.+)$/, (subject) => `أمر يُسجَّل لتصفير ${subject} داخل مخزن الأوامر.`],
    [/^Resolve(.+)$/, (subject) => `أمر يُسجَّل لتنفيذ resolve لـ ${subject} داخل مخزن الأوامر.`],
    [/^Dispatch(.+)$/, (subject) => `أمر يُسجَّل لإطلاق ${subject} داخل مخزن الأوامر.`],
    [/^Draw(.+)$/, (subject) => `أمر يُسجَّل لتنفيذ رسم ${subject} داخل مخزن الأوامر.`],
    [/^Execute(.+)$/, (subject) => `أمر يُسجَّل لتنفيذ ${subject} داخل مخزن الأوامر.`],
    [/^Fill(.+)$/, (subject) => `أمر يُسجَّل لملء ${subject} داخل مخزن الأوامر.`],
    [/^Reset(.+)$/, (subject) => `أمر يُسجَّل لإعادة تعيين ${subject} داخل مخزن الأوامر.`],
    [/^Wait(.+)$/, (subject) => `أمر يُسجَّل للانتظار على ${subject} داخل مخزن الأوامر.`],
    [/^Next(.+)$/, (subject) => `أمر يُسجَّل للانتقال إلى ${subject} داخل مخزن الأوامر.`],
    [/^Blit(.+)$/, (subject) => `أمر يُسجَّل لنسخ ${subject} مع السماح بالتحجيم أو التحويل داخل مخزن الأوامر.`],
    [/^PipelineBarrier2?$/, () => 'أمر يُسجَّل لإدراج حاجز خط الأنابيب داخل مخزن الأوامر.']
  ];

  for (const [pattern, builder] of matchers) {
    const match = stem.match(pattern);
    if (match) {
      const subject = localizeCommandSubject(match[1] || stem);
      return builder(subject);
    }
  }

  return 'أمر يُسجَّل داخل مخزن الأوامر لتنفيذه لاحقاً على المعالج الرسومي.';
}

function inferGenericCommandBenefit(name) {
  const stem = stripVendorSuffix(String(name || '').replace(/^vkCmd/, ''));
  if (/^Begin/.test(stem)) {
    return 'يفيد لتحديد بداية هذا النطاق أو هذه المرحلة بوضوح حتى تعمل الأوامر اللاحقة ضمنه بالشكل المقصود.';
  }
  if (/^End/.test(stem)) {
    return 'يفيد لإغلاق هذا النطاق أو هذه المرحلة بشكل صحيح حتى لا تستمر الأوامر اللاحقة في العمل ضمنها من غير قصد.';
  }
  if (/^Bind/.test(stem)) {
    return 'يفيد لأن الأوامر اللاحقة تعتمد على هذا الربط فعلياً، سواء كان ربط موارد أو حالة أو مخازن أو خطوط أنابيب.';
  }
  if (/^Set/.test(stem)) {
    return 'يفيد لتغيير هذه الحالة ديناميكياً قبل الأوامر اللاحقة من دون الحاجة إلى إعادة إنشاء الكائنات أو خطوط الأنابيب من الصفر.';
  }
  if (/^Push/.test(stem)) {
    return 'يفيد لتمرير قيم أو بيانات صغيرة مباشرة إلى الحالة أو الشيدر في الموضع المطلوب داخل تسلسل الأوامر.';
  }
  if (/^(Copy|Clear|Resolve|Blit|Fill)/.test(stem)) {
    return 'يفيد لتنفيذ هذه العملية على الموارد مباشرة على المعالج الرسومي، بدلاً من نقلها إلى المضيف أو إعادة بناء البيانات يدوياً.';
  }
  if (/^Dispatch/.test(stem)) {
    return 'يفيد لتنفيذ عمل حوسبي أو إطلاق مهمة على الجهاز ضمن التسلسل المطلوب داخل مخزن الأوامر.';
  }
  if (/^Draw/.test(stem)) {
    return 'يفيد لتنفيذ الرسم أو إطلاق العمل الرسومي ضمن مخزن الأوامر، بحيث تُنفذ العملية لاحقاً على الجهاز وفق الحالة والموارد المرتبطة.';
  }
  if (/^Execute/.test(stem)) {
    return 'يفيد لتنفيذ العمل أو الأوامر المقصودة ضمن التسلسل الحالي داخل مخزن الأوامر.';
  }
  if (/^Reset/.test(stem)) {
    return 'يفيد لإعادة المورد أو الحالة إلى وضع يمكن استخدامه من جديد داخل مسار التنفيذ الحالي.';
  }
  if (/^Wait/.test(stem)) {
    return 'يفيد لبناء مزامنة صحيحة داخل التسلسل الحالي حتى لا تتقدم الأوامر قبل تحقق الشرط المطلوب.';
  }
  return 'يفيد لتسجيل هذا الأمر داخل مخزن الأوامر أولاً، ثم إرساله لاحقاً إلى الطابور بالتسلسل الصحيح الذي يريده التطبيق.';
}

function inferFunctionDescription(name) {
  if (/^vkCmdDraw$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم غير مفهرس اعتماداً على الرؤوس المرتبطة حالياً في مخزن الأوامر.';
  }
  if (/^vkCmdDrawIndexed$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم مفهرس باستخدام مخزن الفهارس لإعادة استخدام الرؤوس المرتبطة.';
  }
  if (/^vkCmdDrawIndirect$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم غير مباشر مع قراءة معلمات الرسم من مخزن في الذاكرة بدلاً من تمريرها مباشرة.';
  }
  if (/^vkCmdDrawIndexedIndirect$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم مفهرس غير مباشر مع قراءة معلمات الرسم من مخزن في الذاكرة.';
  }
  if (/^vkCmdDrawIndirectCount(?:KHR|AMD)?$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن في الذاكرة.';
  }
  if (/^vkCmdDrawIndexedIndirectCount(?:KHR|AMD)?$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم مفهرس غير مباشر مع قراءة عدد أوامر الرسم الفعلي من مخزن في الذاكرة.';
  }
  if (/^vkCmdDrawIndirectByteCountEXT$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم غير مباشر مع اشتقاق عدد الرؤوس من قيمة عداد بايتات مخزنة في `counterBuffer`.';
  }
  if (/^vkCmdDrawMeshTasks(?:EXT|NV)?$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم يعتمد على mesh shaders عبر إطلاق مجموعات عمل لمهام mesh.';
  }
  if (/^vkCmdDrawMeshTasksIndirect(?:EXT|NV)?$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم mesh shaders مع قراءة معلمات الإطلاق من مخزن في الذاكرة.';
  }
  if (/^vkCmdDrawMeshTasksIndirectCount(?:EXT|NV)?$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم mesh shaders غير مباشر مع قراءة عدد أوامر الإطلاق الفعلي من مخزن في الذاكرة.';
  }
  if (/^vkCmdBeginDebugUtilsLabelEXT$/.test(name)) {
    return 'أمر يُسجَّل لبدء نطاق تسمية تصحيحية داخل مخزن الأوامر.';
  }
  if (/^vkCmdInsertDebugUtilsLabelEXT$/.test(name)) {
    return 'أمر يُسجَّل لإدراج وسم تصحيحي في الموضع الحالي داخل مخزن الأوامر.';
  }
  if (/^vkCmdEndDebugUtilsLabelEXT$/.test(name)) {
    return 'أمر يُسجَّل لإنهاء نطاق التسمية التصحيحية المفتوح حالياً داخل مخزن الأوامر.';
  }
  if (/^vkCmdBeginPerTileExecutionQCOM$/.test(name)) {
    return 'أمر يُسجَّل لبدء نطاق التنفيذ لكل بلاطة داخل مخزن الأوامر.';
  }
  if (/^vkCmdEndPerTileExecutionQCOM$/.test(name)) {
    return 'أمر يُسجَّل لإنهاء نطاق التنفيذ لكل بلاطة المفتوح حالياً داخل مخزن الأوامر.';
  }
  if (/^vkCmdBeginConditionalRenderingEXT$/.test(name)) {
    return 'أمر يُسجَّل لبدء نطاق الرسم الشرطي داخل مخزن الأوامر بحيث تنفذ أوامر الرسم اللاحقة فقط عندما يتحقق الشرط المحدد.';
  }
  if (/^vkCmdEndConditionalRenderingEXT$/.test(name)) {
    return 'أمر يُسجَّل لإنهاء نطاق الرسم الشرطي داخل مخزن الأوامر بحيث تتوقف الأوامر اللاحقة عن الاعتماد على هذا الشرط.';
  }
  if (/^vkCmdDrawMultiEXT$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ عدة رسومات غير مفهرسة دفعة واحدة ضمن استدعاء واحد داخل مخزن الأوامر.';
  }
  if (/^vkCmdDrawMultiIndexedEXT$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ عدة رسومات مفهرسة دفعة واحدة ضمن استدعاء واحد داخل مخزن الأوامر.';
  }
  if (/^vkCmdDrawClusterHUAWEI$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم يعتمد على cluster culling، بحيث تُعالج عناقيد الهندسة وتُستبعد العناقيد غير المرئية قبل الرسم الفعلي.';
  }
  if (/^vkCmdDrawClusterIndirectHUAWEI$/.test(name)) {
    return 'أمر يُسجَّل لتنفيذ رسم يعتمد على cluster culling مع قراءة معلمات التنفيذ من الذاكرة بشكل غير مباشر.';
  }
  if (/^vkCmdDispatchIndirect$/.test(name)) {
    return 'أمر يُسجَّل لإطلاق عمل حوسبي مع قراءة أبعاد الإطلاق من مخزن في الذاكرة بدلاً من تمريرها مباشرة كقيم ثابتة.';
  }
  if (/^vkCmdDispatchTileQCOM$/.test(name)) {
    return 'أمر يُسجَّل لإطلاق عمل حوسبي لكل بلاطة، بحيث تُنفذ المعالجة على مستوى البلاطات بدلاً من توزيع العمل بالنمط الحوسبي العام.';
  }
  if (/^vkCmdDispatchGraphIndirectCountAMDX$/.test(name)) {
    return 'أمر يُسجَّل لإطلاق execution graph مع قراءة جميع معلمات الإطلاق من الجهاز، بما في ذلك عدد العمليات المطلوب تنفيذها.';
  }
  if (/^vkCmdBindDescriptorBufferEmbeddedSamplers2?EXT$/.test(name)) {
    return 'أمر يُسجَّل لربط السامبلرات المضمّنة غير القابلة للتغيير المرتبطة بمخازن الواصفات داخل مخزن الأوامر.';
  }
  if (/^vkCmdBindDescriptorBuffersEXT$/.test(name)) {
    return 'أمر يُسجَّل لربط مخازن الواصفات داخل مخزن الأوامر حتى تستخدمها الأوامر اللاحقة عند الوصول إلى الواصفات.';
  }
  if (/^vkCmdCopyMemoryIndirect(KHR|NV)$/.test(name)) {
    return 'أمر يُسجَّل لنسخ البيانات بين مناطق ذاكرة موصوفة بشكل غير مباشر داخل مخزن الأوامر.';
  }
  if (/^vkCmdCopyTensorARM$/.test(name)) {
    return 'أمر يُسجَّل لنسخ البيانات بين tensor مصدر وtensor وجهة داخل مخزن الأوامر.';
  }
  if (/^vkCmdCudaLaunchKernelNV$/.test(name)) {
    return 'أمر يُسجَّل لإطلاق نواة CUDA على الجهاز ضمن مخزن الأوامر باستخدام معلومات الإطلاق الممررة.';
  }
  if (/^vkCmdCuLaunchKernelNVX$/.test(name)) {
    return 'أمر يُسجَّل لإطلاق نواة CUDA وفق امتداد NVX الأقدم داخل مخزن الأوامر.';
  }
  if (/^vkCmdDebugMarkerBeginEXT$/.test(name)) {
    return 'أمر يُسجَّل لبدء نطاق debug marker داخل مخزن الأوامر لتسهيل التتبع والتصحيح.';
  }
  if (/^vkCmdDebugMarkerEndEXT$/.test(name)) {
    return 'أمر يُسجَّل لإنهاء نطاق debug marker المفتوح حالياً داخل مخزن الأوامر.';
  }
  if (/^vkCmdBindTransformFeedbackBuffersEXT$/.test(name)) {
    return 'أمر يُسجَّل لربط مخازن التغذية الراجعة للتحويل في نقاط الربط المطلوبة داخل مخزن الأوامر قبل أوامر الرسم التي ستكتب فيها النتائج.';
  }
  if (/^vkCmdBindVertexBuffers2/.test(name)) {
    return 'أمر يُسجَّل لربط مخازن الرؤوس داخل مخزن الأوامر مع تحديد الإزاحات وقيم التباعد لكل ربط.';
  }
  if (/^vkCmdBlitImage/.test(name)) {
    return 'أمر يُسجَّل لنسخ مناطق من صورة إلى أخرى مع إمكان التحجيم أو تحويل التنسيق أثناء العملية.';
  }
  if (/^vkCmdClearAttachments$/.test(name)) {
    return 'أمر يُسجَّل لتصفير مرفقات محددة ضمن مخزن الإطارات المرتبط حالياً وفي مناطق معينة فقط.';
  }
  if (/^vkCmdClearColorImage$/.test(name)) {
    return 'أمر يُسجَّل لكتابة قيمة لون محددة في مناطق معينة من صورة لونية.';
  }
  if (/^vkCmdClearDepthStencilImage$/.test(name)) {
    return 'أمر يُسجَّل لملء مناطق من صورة العمق والاستنسل بقيم عمق واستنسل محددة.';
  }
  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return 'أمر يُسجَّل للتحكم في بداية أو حالة أو نهاية نطاق ترميز الفيديو داخل مخزن الأوامر.';
  }
  if (/^vkCmdCopyBuffer/.test(name)) {
    return 'أمر يُسجَّل لنسخ البيانات بين مناطق محددة من مخزن مصدر إلى مخزن وجهة.';
  }
  if (/^vkBuildAccelerationStructuresKHR$/.test(name)) {
    return 'دالة تبني Acceleration Structures من جهة المضيف مباشرة، مع قراءة أوصاف الهندسة ونطاقات الـ Primitives ثم إنشاء أو تحديث BVH من دون تسجيل أمر داخل Command Buffer.';
  }
  if (/^vk(Create|Destroy|Get|Copy|Write|Build).*AccelerationStructure.*(KHR|NV)$/.test(name) || /^vkCmd(Build|Copy|Write).*AccelerationStructure.*(KHR|NV)$/.test(name)) {
    return 'دالة أو أمر للتعامل مع بنى التسارع التي يستخدمها تتبع الأشعة لتسريع اختبار تقاطعات الأشعة مع عناصر المشهد.';
  }
  if (/^vkAcquireProfilingLockKHR$/.test(name)) {
    return 'دالة لاكتساب قفل التحليل الأدائي قبل تسجيل أو إرسال أوامر تستخدم استعلامات الأداء، حتى يضمن التنفيذ أن جلسة القياس مسموح بها.';
  }
  if (/^vkAcquireDrmDisplayEXT$/.test(name)) {
    return 'دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر طبقة DRM من خلال امتدادات العرض في Vulkan.';
  }
  if (/^vkAcquireXlibDisplayEXT$/.test(name)) {
    return 'دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر Xlib/X11 من خلال امتدادات العرض في Vulkan.';
  }
  if (/^vkAcquireWinrtDisplayNV$/.test(name)) {
    return 'دالة تمكّن التطبيق من امتلاك مخرج العرض VkDisplayKHR مباشرة عبر WinRT من خلال امتداد المنصة المناسب.';
  }
  if (/^vkEnumeratePhysicalDeviceQueueFamilyPerformanceQueryCountersKHR$/.test(name)) {
    return 'دالة تعدّد عدادات الأداء المتاحة لعائلة طوابير محددة على جهاز فيزيائي، وتعيد خصائصها وأوصافها لاختيار ما ستقيسه فعلياً.';
  }
  if (/^vkGetPhysicalDeviceQueueFamilyPerformanceQueryPassesKHR$/.test(name)) {
    return 'دالة تحسب عدد passes المطلوبة لجمع عدادات الأداء المحددة من عائلة الطوابير على الجهاز الفيزيائي.';
  }
  if (/^vkCreateVideoSessionKHR$/.test(name)) {
    return 'دالة لإنشاء جلسة فيديو تمثل الكائن الأساسي الذي يعمل عليه مسار الترميز أو فك الترميز في Vulkan.';
  }
  if (/^vkBindVideoSessionMemoryKHR$/.test(name)) {
    return 'دالة لربط الذاكرة المطلوبة بجلسة الفيديو حتى تصبح الجلسة قابلة للتشغيل الفعلي.';
  }
  if (/^vkCmd(Begin|Control|End)VideoCodingKHR$/.test(name)) {
    return 'أمر يُسجّل داخل مخزن الأوامر للتحكم في بداية أو حالة أو نهاية مرحلة video coding.';
  }
  if (/^vkCmd(Decode|Encode)VideoKHR$/.test(name)) {
    return 'أمر يُسجّل لتنفيذ التشفير أو فك التشفير نفسه على موارد الفيديو المجهزة مسبقاً.';
  }
  if (/^vk(Create|Destroy|Get).*VideoSession.*KHR$/.test(name) || /^vkUpdateVideoSessionParametersKHR$/.test(name)) {
    return 'دالة لإدارة جلسات الفيديو أو معاملاتها أو استعلاماتها اللازمة لمسار الفيديو داخل Vulkan.';
  }
  if (/^vk(Create|Destroy|Get|Copy|Write|Build).*AccelerationStructure.*(KHR|NV)$/.test(name) || /^vkCmd(Build|Copy|Write).*AccelerationStructure.*(KHR|NV)$/.test(name)) {
    return 'دالة لإنشاء أو بناء أو نسخ أو استعلام بنى التسارع التي يعتمد عليها مسار تتبع الأشعة.';
  }
  if (/^vkCreateRayTracingPipelines(KHR|NV)$/.test(name) || /^vkGetRayTracing.*(KHR|NV)$/.test(name) || /^vkCmdSetRayTracingPipelineStackSizeKHR$/.test(name)) {
    return 'دالة لإعداد أو استعلام مكونات pipeline الخاصة بتتبع الأشعة مثل مجموعات الشيدر أو المقابض أو حجم المكدس.';
  }
  if (/MicromapEXT/.test(name)) {
    return 'دالة لإنشاء أو بناء أو نسخ أو استعلام micromap تستخدم لتحسين تمثيل التفاصيل الدقيقة في مسار تتبع الأشعة.';
  }
  if (/^vkCopyImageToImage(EXT)?$/.test(name)) {
    return 'دالة لنسخ بيانات صورة إلى صورة أخرى، بحيث يقرأ التنفيذ الصورة المصدر ويكتب الناتج في الصورة الهدف.';
  }
  if (/^vkCopyImageToMemory(EXT)?$/.test(name)) {
    return 'دالة لنسخ بيانات صورة إلى ذاكرة المضيف أو الذاكرة الهدف التي تستقبل محتواها.';
  }
  if (/^vkCopyMemoryToImage(EXT)?$/.test(name)) {
    return 'دالة لنسخ بيانات من الذاكرة إلى صورة، بحيث تصبح البيانات المصدر محتوى الصورة الهدف.';
  }
  if (/^vkReleaseSwapchainImagesEXT$/.test(name)) {
    return 'دالة لتحرير صور سلسلة التبديل التي سبق حجزها أو الاحتفاظ بها، حتى تعود قابلة للإدارة من قبل swapchain.';
  }
  if (/^vkResetQueryPool(EXT)?$/.test(name)) {
    return 'دالة لإعادة تعيين query pool أو جزء منه حتى تصبح الاستعلامات المحددة جاهزة لإعادة الاستخدام من جديد.';
  }
  if (/^vkSetPrivateData(EXT)?$/.test(name)) {
    return 'دالة لربط قيمة بيانات خاصة يحددها التطبيق بكائن Vulkan حتى يمكن استرجاعها لاحقاً مع هذا الكائن.';
  }
  if (/^vkSignalSemaphore(KHR)?$/.test(name)) {
    return 'دالة لتفعيل semaphore من جهة الجهاز وفق معلومات الإشارة الممررة، بحيث تتم مزامنة العمل اللاحق على هذه الحالة.';
  }
  if (/^vkTransitionImageLayoutEXT$/.test(name)) {
    return 'دالة لتنفيذ انتقال تخطيط الصورة إلى layout جديد حتى تصبح الصورة في الحالة الصحيحة للاستخدام التالي.';
  }
  if (/^vkTrimCommandPool(KHR)?$/.test(name)) {
    return 'دالة لتقليص الذاكرة الداخلية غير المستخدمة في command pool وتحرير ما يمكن الاستغناء عنه منها.';
  }
  if (/^vkUpdateDescriptorSetWithTemplate(KHR)?$/.test(name)) {
    return 'دالة لتحديث descriptor set باستخدام قالب template يحدد شكل الكتابة في الواصفات وترتيب البيانات المصدر.';
  }
  if (/^vkWaitForFences$/.test(name)) {
    return 'دالة للانتظار حتى تدخل fences المحددة في حالة الإشارة أو حتى تنتهي المهلة المحددة.';
  }
  if (/^vkWaitSemaphores(KHR)?$/.test(name)) {
    return 'دالة للانتظار حتى تصل semaphores المحددة إلى الشروط أو القيم المطلوبة قبل متابعة التنفيذ.';
  }

  if (name.startsWith('vkCmd')) {
    return inferGenericCommandDescription(name);
  }
  if (name.startsWith('vkCreate')) {
    return 'دالة لإنشاء كائن أو مورد جديد داخل Vulkan وإرجاع مقبض صالح لاستخدامه لاحقاً.';
  }
  if (name.startsWith('vkDestroy')) {
    return 'دالة لتحرير الموارد وتدمير الكائن المرتبط بها عند انتهاء الاستخدام.';
  }
  if (name.startsWith('vkGet')) {
    return 'دالة استعلام تُستخدم لاسترجاع خصائص أو مؤشرات أو بيانات من واجهة Vulkan.';
  }
  if (name.startsWith('vkEnumerate')) {
    return 'دالة تعداد تُستخدم لاكتشاف العناصر المدعومة مثل الأجهزة أو الطبقات أو الامتدادات.';
  }
  if (name.startsWith('vkAllocate')) {
    return 'دالة لحجز ذاكرة أو مجموعة كائنات أو مخازن أوامر لاستخدامها داخل التطبيق.';
  }
  if (name.startsWith('vkFree')) {
    return 'دالة لتحرير الذاكرة أو الكائنات التي تم تخصيصها مسبقاً.';
  }
  if (name.startsWith('vkAcquire')) {
    return 'دالة لاكتساب مورد أو قفل أو صورة أو حالة تشغيل مطلوبة قبل المتابعة في التنفيذ.';
  }
  if (name.startsWith('vkBind')) {
    return 'دالة لربط مورد بمورد آخر، مثل ربط الذاكرة أو الواصفات أو خط الأنابيب.';
  }
  if (name.startsWith('vkQueue')) {
    return 'دالة مرتبطة بإرسال الأوامر أو انتظارها أو تقديم النتائج عبر طوابير Vulkan.';
  }
  if (name.startsWith('vkMap') || name.startsWith('vkUnmap')) {
    return 'دالة مرتبطة بإتاحة الوصول إلى ذاكرة الجهاز من جهة المعالج أو إنهاء هذا الوصول.';
  }

  return 'دالة مرجعية من Vulkan. الشرح التفصيلي الكامل غير متوفر محلياً بعد، لذا أُضيف لها وصف عملي مختصر.';
}

function inferFunctionSignature(name, returnType) {
  if (!returnType) {
    return `/* لم يتوفر التوقيع التفصيلي محلياً بعد */\n${name}(/* المعاملات */);`;
  }

  return `${returnType} ${name}(/* المعاملات */)`;
}

function upperSnakeCase(value) {
  return String(value || '')
    .replace(/^Vk/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase();
}

function stripTypeQualifiers(type) {
  return String(type || '')
    .replace(/\bconst\b/g, '')
    .replace(/\bstruct\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getBaseType(type) {
  return stripTypeQualifiers(type).replace(/\s*\*+\s*$/, '').trim();
}

function toExampleVarName(name) {
  const raw = String(name || 'value').replace(/\[[^\]]*\]/g, '');
  if (/^p[A-Z]/.test(raw)) {
    return raw.charAt(1).toLowerCase() + raw.slice(2);
  }

  return raw;
}

function inferPlaceholderValue(type, name) {
  const cleanType = stripTypeQualifiers(type);
  const baseType = getBaseType(type);
  const varName = toExampleVarName(name);

  if (cleanType.includes('*')) {
    return 'nullptr';
  }

  if (/^Vk[A-Za-z0-9_]+$/.test(baseType)) {
    if (/Flags?$/.test(baseType)) return '0';
    if (/Bool32$/.test(baseType)) return 'VK_FALSE';
    return 'VK_NULL_HANDLE';
  }

  if (/(^| )bool$/.test(cleanType)) return 'false';
  if (/(u?int(8|16|32|64)_t|size_t|uint64_t|uint32_t|int32_t)/.test(cleanType)) {
    if (/timeout/i.test(varName)) return 'UINT64_MAX';
    return '0';
  }
  if (/float|double/.test(cleanType)) return '0.0f';
  if (/char\s*\*$/.test(cleanType)) return "\"\"";

  return '{}';
}

function buildParameterPreparation(param) {
  const type = stripTypeQualifiers(param.type || '');
  const baseType = getBaseType(type);
  const pointerLevel = (type.match(/\*/g) || []).length;
  const variableName = toExampleVarName(param.name);
  const description = param.description || `تجهيز ${param.name}`;

  if (pointerLevel > 0) {
    if (/^p[A-Z]/.test(param.name) && !/\bconst\b/.test(param.type || '')) {
      const targetName = variableName;
      const targetValue = inferPlaceholderValue(baseType, targetName);
      const lines = [];

      if (/^Vk[A-Za-z0-9_]+$/.test(baseType) && /Info|CreateInfo|Features|Properties|State|Region|Range|Description|Callbacks/.test(baseType)) {
        lines.push(`${baseType} ${targetName} = {};`);
        if (!/Callbacks$/.test(baseType)) {
          lines.push(`${targetName}.sType = VK_STRUCTURE_TYPE_${upperSnakeCase(baseType)};`);
        }
      } else {
        lines.push(`${baseType} ${targetName} = ${targetValue};`);
      }

      return {
        lines,
        argument: `&${targetName}`,
        notes: [`${description}.`]
      };
    }

    if (/\bconst\b/.test(param.type || '') && /^Vk[A-Za-z0-9_]+$/.test(baseType) && /Info|CreateInfo|Features|Properties|State|Region|Range|Description|Callbacks/.test(baseType)) {
      const targetName = variableName;
      const lines = [`${baseType} ${targetName} = {};`];
      if (!/Callbacks$/.test(baseType)) {
        lines.push(`${targetName}.sType = VK_STRUCTURE_TYPE_${upperSnakeCase(baseType)};`);
      }

      return {
        lines,
        argument: `&${targetName}`,
        notes: [`${description}.`]
      };
    }

    return {
      lines: [`${type} ${variableName} = nullptr;`],
      argument: variableName,
      notes: [`${description}.`]
    };
  }

  return {
    lines: [`${type} ${variableName} = ${inferPlaceholderValue(type, variableName)};`],
    argument: variableName,
    notes: [`${description}.`]
  };
}

function generateFunctionExample(name, returnType, parameters) {
  const introLines = [];
  const callArgs = [];

  (parameters || []).forEach((param) => {
    const prep = buildParameterPreparation(param);
    introLines.push(...prep.lines);
    callArgs.push(prep.argument);
  });

  const callExpression =
    callArgs.length > 0
      ? `${name}(\n    ${callArgs.join(',\n    ')}\n)`
      : `${name}()`;

  const lines = [...introLines];

  if (lines.length > 0) {
    lines.push('');
  }

  if (returnType === 'VkResult') {
    lines.push(`VkResult result = ${callExpression};`);
    lines.push('');
    lines.push('if (result == VK_SUCCESS) {');
    lines.push(`    // تمت العملية بنجاح ويمكن متابعة العمل بعد ${name}`);
    lines.push('} else {');
    lines.push('    // عالج رمز الخطأ أو أعد تهيئة الموارد المطلوبة');
    lines.push('}');
    return lines.join('\n');
  }

  if (returnType && returnType !== 'void') {
    lines.push(`${returnType} result = ${callExpression};`);
    lines.push('(void)result;');
    return lines.join('\n');
  }

  lines.push(`${callExpression};`);
  return lines.join('\n');
}

function generateFunctionNotes(name, extension) {
  const notes = [
    'تحقق من صحة المقابض والمعاملات قبل الاستدعاء.',
    'استخدم طبقات التحقق أثناء التطوير لاكتشاف الاستخدام غير الصحيح.'
  ];

  if (extension) {
    notes.push(`هذه الدالة مرتبطة بامتداد ${extension}، لذا تأكد من تفعيله قبل الاستخدام.`);
  }

  if (name.startsWith('vkCmd')) {
    notes.push('يجب تسجيل هذا الأمر داخل Command Buffer في الحالة الصحيحة.');
  }

  if (name.startsWith('vkCreate') || name.startsWith('vkAllocate')) {
    notes.push('تذكّر تحرير المورد المقابل عند الانتهاء من استخدامه.');
  }

  return notes;
}

function inferRelatedFunctions(name, allNames) {
  const family = name.match(/^(vk(?:Cmd|Create|Destroy|Get|Enumerate|Allocate|Free|Queue|Bind|Acquire|Map|Unmap))/)?.[1];
  if (!family) return [];

  return allNames.filter((item) => item !== name && item.startsWith(family)).slice(0, 4);
}

function isGenericTypePlaceholder(text) {
  const body = cleanText(String(text || '').replace(/^الوصف الرسمي:\s*/g, ''));
  return !body || [
    /هيكل بيانات من Vulkan/i,
    /مقبض لكائن من كائنات Vulkan/i,
    /نوع تعداد يعرّف مجموعة قيم مسماة/i,
    /نوع أعلام bitmask/i,
    /نوع مؤشر دالة أو callback/i,
    /نوع أساسي أو نوع خاص بمنصة معينة/i,
    /ثابت مرجعي في Vulkan/i,
    /ماكرو مرجعي في Vulkan/i
  ].some((pattern) => pattern.test(body));
}

function isGenericStructureUsageLine(text) {
  const body = cleanText(String(text || ''));
  return [
    /^يُستخدم\s+Vk[A-Za-z0-9_]+\s+كهيكل إعدادات أو بيانات وسيطة يتم تمريره إلى دوال Vulkan أو تعبئته بنتائج الاستعلام\.?$/,
    /^غالباً تبدأ طريقة استخدامه بتهيئة الحقول إلى الصفر.*$/,
    /^يُستخدم\s+Vk[A-Za-z0-9_]+\s+كهيكل إعدادات.*$/,
    /^هذا النوع من الهياكل يستخدم داخل دوال Vulkan.*$/
  ].some((pattern) => pattern.test(body));
}

function localizeTypeSubjectName(name) {
  const raw = String(name || '').replace(/^PFN_vk/, '').replace(/^Vk/, '');
  const replacements = [
    ['AccelerationStructure', 'بنية التسارع'],
    ['BufferCollection', 'مجموعة المخازن'],
    ['BufferView', 'عرض المخزن'],
    ['Buffer', 'المخزن'],
    ['CommandBuffer', 'مخزن الأوامر'],
    ['CommandPool', 'تجمع مخازن الأوامر'],
    ['DescriptorPool', 'تجمع الواصفات'],
    ['DescriptorSetLayout', 'مخطط مجموعة الواصفات'],
    ['DescriptorSet', 'مجموعة الواصفات'],
    ['DescriptorUpdateTemplate', 'قالب تحديث الواصفات'],
    ['DeviceMemory', 'ذاكرة الجهاز'],
    ['Device', 'الجهاز المنطقي'],
    ['DisplayKHR', 'مخرج العرض'],
    ['Event', 'الحدث'],
    ['Fence', 'السياج'],
    ['Framebuffer', 'مخزن الإطارات'],
    ['ImageView', 'عرض الصورة'],
    ['Image', 'الصورة'],
    ['Instance', 'المثيل'],
    ['Micromap', 'الميكروماب'],
    ['PhysicalDevice', 'الجهاز الفيزيائي'],
    ['PipelineCache', 'مخبأ خط الأنابيب'],
    ['PipelineLayout', 'مخطط خط الأنابيب'],
    ['Pipeline', 'خط الأنابيب'],
    ['QueryPool', 'مجموعة الاستعلامات'],
    ['Queue', 'الطابور'],
    ['RenderPass', 'تمرير الرسم'],
    ['SamplerYcbcrConversion', 'تحويل YCbCr للسامبلر'],
    ['Sampler', 'السامبلر'],
    ['Semaphore', 'الإشارة'],
    ['ShaderEXT', 'كائن الشيدر'],
    ['ShaderModule', 'وحدة الشيدر'],
    ['SurfaceKHR', 'سطح العرض'],
    ['SwapchainKHR', 'سلسلة التبديل'],
    ['ValidationCache', 'مخبأ التحقق'],
    ['VideoSessionParametersKHR', 'معلمات جلسة الفيديو'],
    ['VideoSessionKHR', 'جلسة الفيديو'],
    ['CudaModule', 'وحدة CUDA'],
    ['CudaFunction', 'دالة CUDA'],
    ['CuModule', 'وحدة CUDA'],
    ['CuFunction', 'دالة CUDA'],
    ['DataGraphPipelineSession', 'جلسة خط أنابيب مخطط البيانات'],
    ['TensorView', 'عرض موتر'],
    ['Tensor', 'موتر'],
    ['DebugUtilsMessenger', 'مرسال Debug Utils'],
    ['DebugReportCallback', 'رد نداء Debug Report'],
    ['DeferredOperation', 'العملية المؤجلة']
  ];

  for (const [from, to] of replacements) {
    if (raw.includes(from)) {
      return to;
    }
  }

  return raw
    ? splitCamelTokens(raw)
        .map((token) => ({
          API: 'الواجهة',
          View: 'عرض',
          Image: 'صورة',
          Buffer: 'مخزن',
          Device: 'جهاز',
          Physical: 'فيزيائي',
          Command: 'أوامر',
          Pool: 'تجمع',
          Queue: 'طابور',
          Descriptor: 'واصفات',
          Set: 'مجموعة',
          Layout: 'تخطيط',
          Pipeline: 'خط',
          Render: 'رسم',
          Pass: 'تمرير',
          Surface: 'سطح',
          Swapchain: 'سلسلة',
          Sampler: 'سامبلر',
          Memory: 'ذاكرة',
          Query: 'استعلام',
          Acceleration: 'تسارع',
          Structure: 'بنية',
          Shader: 'شيدر',
          Video: 'فيديو',
          Session: 'جلسة',
          Semaphore: 'إشارة',
          Fence: 'سياج'
        }[token] || token))
        .join(' ')
    : 'هذا الكائن';
}

function inferSpecificTypeDescription(name, kind) {
  if (kind === 'structure') {
    if (name === 'VkAllocationCallbacks') {
      return 'بنية تحتوي على مؤشرات دوال رد نداء لتخصيص الذاكرة وإعادة تخصيصها وتحريرها داخل Vulkan.';
    }
    if (/^VkApplicationInfo$/.test(name)) {
      return 'بنية تحدد هوية التطبيق والمحرك وإصدار API المطلوب عندما يمررها التطبيق إلى VkInstanceCreateInfo قبل استدعاء vkCreateInstance.';
    }
    if (/^VkInstanceCreateInfo$/.test(name)) {
      return 'بنية تحدد معلمات إنشاء VkInstance نفسها، مثل معلومات التطبيق والامتدادات والطبقات التي يجب أن يفعّلها اللودر والسائق.';
    }
    if (/^VkPresentInfoKHR$/.test(name)) {
      return 'بنية تحدد عملية تقديم صور Swapchain إلى نظام العرض عند استدعاء vkQueuePresentKHR، بما في ذلك الإشارات التي يجب انتظارها والصور التي ستُقدَّم فعلياً.';
    }
    if (/^VkAcquireNextImageInfoKHR$/.test(name)) {
      return 'بنية تحدد معلمات الحصول على الصورة التالية من Swapchain، مثل مهلة الانتظار والمزامنة التي ستُبلَّغ عند جاهزية الصورة.';
    }
    if (/^VkAcquireProfilingLockInfoKHR$/.test(name)) {
      return 'بنية تحدد معلمات الحصول على profiling lock من الجهاز، مثل الرايات ومدة الانتظار، عند استدعائها عبر vkAcquireProfilingLockKHR.';
    }
    if (/^VkSubmitInfo2?(KHR)?$/.test(name)) {
      return 'بنية تحدد ما الذي سيُرسل إلى Queue عند الاستدعاء، مثل Command Buffers والإشارات التي سيُنتظر عليها والإشارات التي ستُطلق بعد التنفيذ.';
    }
    if (/^Vk(CommandBuffer|Semaphore)SubmitInfo(KHR)?$/.test(name)) {
      return 'بنية تصف عنصراً واحداً يدخل في عملية الإرسال إلى Queue، مثل Command Buffer أو Semaphore مع مرحلة التنفيذ المرتبطة به.';
    }
    if (/^VkWriteDescriptorSet/.test(name)) {
      return 'بنية تحدد عملية كتابة أو تحديث Descriptor فعلي داخل مجموعة descriptors، بما في ذلك المورد الهدف ونوعه وموقعه داخل المجموعة.';
    }
    if (/^VkAttachmentDescription2?(KHR)?$/.test(name)) {
      return 'بنية تحدد كيف سيُستخدم المرفق داخل render pass: كيف يبدأ محتواه، وكيف يُخزَّن، وما layout الذي سيدخل به ويخرج منه.';
    }
    if (/^VkAttachmentReference2?(KHR)?$/.test(name)) {
      return 'بنية تربط مرفقاً معيناً بموضعه داخل subpass وتحدد layout الذي ستقرأه أو تكتبه به مراحل الرسم.';
    }
    if (/^VkAabbPositions(KHR|NV)?$/.test(name)) {
      return 'بنية تحدد إحداثيات الحدين الأدنى والأعلى لصندوق AABB الذي تقرأه مسارات بناء Acceleration Structure كحجم هندسي محاط بالمحاور.';
    }
    if (/^VkAccelerationStructureBuildSizesInfoKHR$/.test(name)) {
      return 'بنية خرج تكتب فيها Vulkan أحجام الذاكرة المطلوبة لبنية التسارع نفسها ولـ Scratch Buffers اللازمة للبناء أو التحديث.';
    }
    if (/^VkAccelerationStructureBuildGeometryInfoKHR$/.test(name)) {
      return 'بنية تحدد وصف عملية بناء أو تحديث Acceleration Structure نفسها: النوع، والـ Geometry، والوجهة، ومكان Scratch Buffer المستخدم أثناء التنفيذ.';
    }
    if (/^VkAccelerationStructureBuildRangeInfoKHR$/.test(name)) {
      return 'بنية تحدد عدد الـ Primitives والإزاحات والفهارس التي ستقرأها Vulkan من بيانات الهندسة عند بناء Acceleration Structure.';
    }
    if (/^VkAccelerationStructureGeometryTrianglesDataKHR$/.test(name)) {
      return 'بنية تحدد أين توجد بيانات المثلثات في الذاكرة وكيف ستقرأ Vulkan الرؤوس والفهارس والتحويلات لبناء Acceleration Structure.';
    }
    if (/^VkAccelerationStructureGeometryAabbsDataKHR$/.test(name)) {
      return 'بنية تحدد موقع بيانات AABB وStride القراءة بينها حتى تستخدمها Vulkan كـ Geometry أثناء بناء Acceleration Structure.';
    }
    if (/^VkAccelerationStructureGeometryInstancesDataKHR$/.test(name)) {
      return 'بنية تحدد موقع بيانات Instances التي ستكوّن TLAS وكيف ستُفسَّر هذه البيانات أثناء بناء BVH على الجهاز.';
    }
    if (/^VkAccelerationStructureGeometryKHR$/.test(name)) {
      return 'بنية تغلف نوع الـ Geometry وبياناته الفعلية التي ستدخل في بناء Acceleration Structure، سواء كانت Triangles أو AABBs أو Instances.';
    }
    if (/^VkAccelerationStructureCreateInfo(KHR|NV)$/.test(name)) {
      return 'بنية تحدد كيفية إنشاء كائن Acceleration Structure نفسه داخل Buffer والذاكرة المرتبطة به قبل البناء الفعلي.';
    }
    if (/^VkAccelerationStructure/.test(name)) {
      return 'بنية مرتبطة بمسار Acceleration Structure في Vulkan وتصف كيف ستقرأ Vulkan الهندسة أو الأحجام أو العناوين أو الموارد المرتبطة ببناء BVH أو استخدامه.';
    }
    if (/^VkDeviceCreateInfo$/.test(name)) {
      return 'بنية تحدد كل ما يحتاجه Vulkan لإنشاء VkDevice، بما في ذلك الطوابير والامتدادات والميزات التي سيفعّلها الجهاز المنطقي.';
    }
    if (/^VkDeviceQueueCreateInfo$/.test(name)) {
      return 'بنية تحدد من أي Queue Family ستُنشأ الطوابير وكم Queue سيطلبها التطبيق وما أولوياتها داخل VkDevice.';
    }
    if (/^Vk.+SurfaceCreateInfo/.test(name)) {
      return 'بنية تحدد معلمات إنشاء Surface وربطه بكائن المنصة الأصلي مثل النافذة أو الطبقة أو مخرج العرض الذي سيتعامل معه Vulkan.';
    }
    if (/^VkPhysicalDevice.+Features/.test(name)) {
      return 'بنية تحتوي على مفاتيح ميزات خاصة بالجهاز الفيزيائي يمكن الاستعلام عنها أو طلب تفعيلها قبل إنشاء الجهاز المنطقي.';
    }
    if (/^VkPhysicalDevice.+Properties/.test(name) || /^VkPhysicalDeviceProperties2?$/.test(name)) {
      return 'بنية تحتوي على خصائص وحدود وقدرات يعلنها الجهاز الفيزيائي ويكتبها السائق عند الاستعلام.';
    }
    if (/^VkMemory.+AllocateInfo/.test(name) || /^VkExportMemoryAllocateInfo/.test(name) || /^VkImportMemory.+Info/.test(name)) {
      return 'بنية تحتوي على معلمات تخصيص الذاكرة أو تصديرها أو استيرادها في Vulkan.';
    }
    if (/^Vk(Graphics|Compute|RayTracing|ExecutionGraph|PipelineShaderStage).*CreateInfo/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء خط الأنابيب أو مراحله الشادرية داخل Vulkan.';
    }
    if (/^VkPipelineLayoutCreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء مخطط خط الأنابيب، بما في ذلك descriptor sets و push constants.';
    }
    if (/^VkPipeline.+CreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء جزء من Pipeline أو حالته الثابتة أو بنيته التنفيذية التي ستقرأها Vulkan أثناء تكوين خط الأنابيب.';
    }
    if (/^Vk(Buffer|BufferView).*CreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء مخزن أو عرض مخزن، مثل الحجم والاستخدام وطريقة الوصول المتوقعة.';
    }
    if (/^Vk(Image|ImageView).*CreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء الصورة أو عرض الصورة، مثل الأبعاد والتنسيق والاستخدام ونوع العرض.';
    }
    if (/^Vk(Image|Buffer)MemoryBarrier/.test(name)) {
      return 'بنية تحدد كيف تنتقل الذاكرة أو الصورة بين مراحل الوصول المختلفة، وما نوع القراءة أو الكتابة التي يجب أن تكتمل قبل السماح بالوصول التالي.';
    }
    if (/^VkSampler.+CreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء السامبلر، مثل أسلوب الترشيح والعنونة وخصائص أخذ العينات.';
    }
    if (/^VkDescriptor(SetLayout|Pool|UpdateTemplate).*CreateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات إنشاء كائنات الواصفات، مثل التخطيط أو التجمع أو قالب التحديث.';
    }
    if (/^Vk(CommandPool|CommandBuffer).+Info/.test(name)) {
      return 'بنية تحتوي على معلمات مرتبطة بمخازن الأوامر أو تجمعاتها، سواء للإنشاء أو البدء أو التخصيص.';
    }
    if (/^VkRenderPass.+(CreateInfo|BeginInfo)$/.test(name) || /^VkSubpass.+/.test(name)) {
      return 'بنية تحتوي على معلمات مرتبطة بتمرير الرسم أو المرفقات الفرعية أو بداية التنفيذ داخل مسار الرسم.';
    }
    if (/Callbacks$/.test(name)) {
      return 'بنية تحتوي على مؤشرات دوال رد نداء وسياق مستخدم تسمح لـ Vulkan باستدعاء منطق يحدده التطبيق عند الحاجة.';
    }
    if (/CreateInfo$/.test(name)) {
      return 'بنية تحتوي على المعلمات اللازمة لإنشاء الكائن أو المورد المرتبط بها.';
    }
    if (/AllocateInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات التخصيص مثل الحجم أو العدد أو المصدر الذي ستُحجز منه الموارد.';
    }
    if (/BeginInfo$/.test(name)) {
      return 'بنية تحتوي على معلمات بدء العملية أو النطاق الذي ستبدأه الدالة المرتبطة بها.';
    }
    if (/Properties/.test(name)) {
      return 'بنية تحتوي على خصائص أو حدود أو قدرات يكتبها السائق أو تعلنها المواصفة لهذا المسار.';
    }
    if (/Features/.test(name)) {
      return 'بنية تحتوي على مفاتيح ميزات يمكن الاستعلام عنها أو طلب تفعيلها بحسب الجهاز أو الامتداد المرتبط.';
    }
    if (/Info$/.test(name)) {
      return 'بنية تحمل المعلومات التي ستقرأها Vulkan مباشرة لتحديد العملية أو المورد أو الحالة التنفيذية في هذا الموضع.';
    }
  }

  if (kind === 'macro') {
    const macroDescriptions = {
      VK_MAKE_VERSION: 'ماكرو دالي يبني رقماً واحداً يشفّر الحقول major وminor وpatch وفق صيغة الإصدار القديمة في فولكان.',
      VK_MAKE_API_VERSION: 'ماكرو دالي يبني رقماً واحداً يشفّر الحقول variant وmajor وminor وpatch وفق صيغة الواجهة الحديثة في فولكان.',
      VK_API_VERSION: 'ماكرو دالي يبني رقم إصدار واجهة برمجة التطبيقات القياسي الذي تتوقعه فولكان داخل حقول apiVersion.',
      VK_API_VERSION_MAJOR: 'ماكرو دالي يستخرج الحقل major من رقم إصدار واجهة برمجة تطبيقات مدمج عبر إزاحات وأقنعة البتات.',
      VK_API_VERSION_MINOR: 'ماكرو دالي يستخرج الحقل minor من رقم إصدار واجهة برمجة تطبيقات مدمج عبر إزاحات وأقنعة البتات.',
      VK_API_VERSION_PATCH: 'ماكرو دالي يستخرج الحقل patch من رقم إصدار واجهة برمجة تطبيقات مدمج عبر إزاحات وأقنعة البتات.',
      VK_API_VERSION_VARIANT: 'ماكرو دالي يستخرج الحقل variant من رقم إصدار واجهة برمجة تطبيقات مدمج عبر إزاحات وأقنعة البتات.',
      VK_VERSION_MAJOR: 'ماكرو دالي يستخرج الحقل major من رقم الإصدار القديم المخزن في قيمة uint32_t واحدة.',
      VK_VERSION_MINOR: 'ماكرو دالي يستخرج الحقل minor من رقم الإصدار القديم المخزن في قيمة uint32_t واحدة.',
      VK_VERSION_PATCH: 'ماكرو دالي يستخرج الحقل patch من رقم الإصدار القديم المخزن في قيمة uint32_t واحدة.',
      VK_HEADER_VERSION: 'ماكرو ثابت يعطي رقم patch الخاص بترويسة فولكان الحالية وقت الترجمة.',
      VK_HEADER_VERSION_COMPLETE: 'ماكرو إصدار ثابت يعطي رقم إصدار الترويسة كاملاً كما تراه الترويسات أثناء الترجمة.',
      VK_DEFINE_HANDLE: 'ماكرو مساعد دالي يولد تعريف typedef لمقبض قابل للإرسال داخل ترويسة فولكان.',
      VK_DEFINE_NON_DISPATCHABLE_HANDLE: 'ماكرو مساعد دالي يولد تعريف typedef لمقبض غير قابل للإرسال بحسب شروط المنصة وتعريفات الترويسة.',
      VK_NULL_HANDLE: 'ماكرو ثابت يعطي القيمة الرسمية التي تمثل غياب مقبض صالح في فولكان.',
      VK_USE_64_BIT_PTR_DEFINES: 'ماكرو ترجمة شرطية يحدد في الترويسة ما إذا كانت بعض المقابض غير القابلة للإرسال ستمثل بعرض 64 بت.'
    };
    if (macroDescriptions[name]) {
      return macroDescriptions[name];
    }
    const versionMatch = name.match(/^VK_API_VERSION_(\d+)_(\d+)$/);
    if (versionMatch) {
      return `ماكرو إصدار ثابت يعرّف قيمة إصدار الواجهة الجاهزة لـ Vulkan ${versionMatch[1]}.${versionMatch[2]} بحيث يمكن إدراجها مباشرة في الكود من دون بناء يدوي.`;
    }
  }

  if (kind === 'constant') {
    if (/^VK_(TRUE|FALSE)$/.test(name)) {
      return `ثابت منطقي يمثل القيمة ${name === 'VK_TRUE' ? 'الصحيحة' : 'الخاطئة'} في Vulkan.`;
    }
    if (/^VK_WHOLE_SIZE$/.test(name)) {
      return 'ثابت يعني استخدام كل الحجم المتبقي من الإزاحة المحددة حتى نهاية المورد.';
    }
    if (/^VK_REMAINING_MIP_LEVELS$/.test(name)) {
      return 'ثابت يعني استخدام جميع مستويات mip المتبقية ابتداءً من المستوى المحدد.';
    }
    if (/^VK_REMAINING_ARRAY_LAYERS$/.test(name)) {
      return 'ثابت يعني استخدام جميع طبقات المصفوفة المتبقية ابتداءً من الطبقة المحددة.';
    }
    if (/^VK_REMAINING_3D_SLICES_EXT$/.test(name)) {
      return 'ثابت يعني استخدام جميع المقاطع ثلاثية الأبعاد المتبقية ابتداءً من المقطع المحدد.';
    }
    if (/^VK_ATTACHMENT_UNUSED$/.test(name)) {
      return 'ثابت يدل على أن هذا المرفق غير مستخدم في الوصف الحالي للتمرير أو المرفق الفرعي.';
    }
    if (/^VK_SUBPASS_EXTERNAL$/.test(name)) {
      return 'ثابت يمثل مرفقاً فرعياً خارجياً يُستخدم للتعبير عن الاعتماد قبل التمرير أو بعده.';
    }
    if (/^VK_QUEUE_FAMILY_(IGNORED|EXTERNAL|FOREIGN)/.test(name)) {
      return 'ثابت خاص بعائلات الطوابير يُستخدم للدلالة على تجاهل عائلة معينة أو الإشارة إلى عائلة خارجية.';
    }
    if (/_SIZE(?:_|$)/.test(name)) {
      return 'ثابت يحدد حجماً أو طولاً أقصى أو عدداً ثابتاً تعتمده الواجهة في هذا السياق.';
    }
    if (/^VK_MAX_/.test(name)) {
      return 'ثابت يحدد حداً أقصى ثابتاً أو طولاً أقصى معروفاً في هذا الجزء من الواجهة.';
    }
    if (/^VK_VERSION_\d+_\d+$/.test(name)) {
      return `ثابت يعرّف قيمة إصدار Vulkan الجاهزة المقابلة لـ ${name.replace(/^VK_VERSION_/, '').replace('_', '.')}.`;
    }
    if (/^VK_(SHADER|PARTITIONED_ACCELERATION_STRUCTURE|COMPUTE_OCCUPANCY_PRIORITY|DATA_GRAPH_MODEL_TOOLCHAIN_VERSION_LENGTH)/.test(name)) {
      return 'ثابت خاص بامتداد أو ميزة محددة يحدد قيمة جاهزة تستخدمها الدوال أو البنى المرتبطة بهذا المسار.';
    }
  }

  if (kind === 'handle') {
    return `مقبض يمثل ${localizeTypeSubjectName(name)} تديره Vulkan داخلياً ويُمرَّر إلى الدوال التي تعمل على هذا الكائن.`;
  }

  if (kind === 'function_pointer') {
    if (/AllocationFunction/.test(name)) {
      return 'نوع مؤشر دالة callback يوفّره التطبيق لتخصيص ذاكرة المضيف ضمن آليات التخصيص المخصصة في Vulkan.';
    }
    if (/FreeFunction/.test(name)) {
      return 'نوع مؤشر دالة callback يوفّره التطبيق لتحرير ذاكرة المضيف ضمن آليات التخصيص المخصصة في Vulkan.';
    }
    if (/ReallocationFunction/.test(name)) {
      return 'نوع مؤشر دالة callback يوفّره التطبيق لإعادة تخصيص ذاكرة المضيف ضمن آليات التخصيص المخصصة.';
    }
    if (/InternalAllocationNotification/.test(name) || /InternalFreeNotification/.test(name)) {
      return 'نوع مؤشر دالة callback يُستخدم لإخطار التطبيق بعمليات التخصيص أو التحرير الداخلية التي تنفذها الواجهة.';
    }
    if (/DebugUtilsMessengerCallback/.test(name) || /DebugReportCallback/.test(name) || /DeviceMemoryReportCallback/.test(name)) {
      return 'نوع مؤشر دالة callback تستدعيه Vulkan لإرسال رسائل التصحيح أو تقارير الذاكرة إلى التطبيق.';
    }
    if (/GetInstanceProcAddr/.test(name)) {
      return 'نوع مؤشر دالة يُستخدم للحصول على مؤشرات دوال Vulkan ديناميكياً من المثيل أو اللودر.';
    }
    if (/VoidFunction/.test(name)) {
      return 'نوع مؤشر دالة عام غير محدد التوقيع تستخدمه الواجهة كأساس لمؤشرات الدوال المحمّلة ديناميكياً.';
    }
  }

  if (kind === 'scalar') {
    const scalarDescriptions = {
      VkBool32: 'نوع عددي بعرض 32 بت تستخدمه Vulkan لتمثيل القيم المنطقية داخل البنى وتواقيع الدوال.',
      VkDeviceSize: 'نوع عددي غير موقّع يمثل الأحجام والإزاحات المرتبطة بذاكرة الجهاز والموارد.',
      VkDeviceAddress: 'نوع عددي يمثل عنواناً على الجهاز يمكن للشيدر أو بعض الامتدادات استخدامه للوصول إلى الذاكرة.',
      VkFlags: 'نوع عددي يمثل حاوية عامة لأعلام bitmask بعرض 32 بت في Vulkan.',
      VkFlags64: 'نوع عددي يمثل حاوية عامة لأعلام bitmask بعرض 64 بت في Vulkan.',
      AHardwareBuffer: 'نوع منصة Android يمثل مخزناً تشارك الذاكرة عبره بين Vulkan ومكوّنات النظام الأخرى.',
      ANativeWindow: 'نوع منصة Android يمثل نافذة أصلية يمكن ربطها بسطح عرض Vulkan.',
      CAMetalLayer: 'نوع من منصة Apple يمثل طبقة Metal يمكن لـ Vulkan الربط معها عبر امتدادات السطوح.',
      IOSurfaceRef: 'نوع من منصة Apple يمثل سطح ذاكرة قابل للمشاركة بين الواجهات الرسومية.',
      OHNativeWindow: 'نوع منصة OpenHarmony يمثل نافذة أصلية يمكن إنشاء سطح Vulkan فوقها.'
    };
    if (scalarDescriptions[name]) {
      return scalarDescriptions[name];
    }
    if (/^MTL.+_id$/.test(name)) {
      return 'نوع من واجهة Metal يمثل مقبض كائن Metal تُمرره بعض امتدادات Vulkan للتكامل مع منصة Apple.';
    }
  }

  return '';
}

function inferSpecificTypeUsage(name, kind) {
  if (kind === 'structure') {
    if (name === 'VkAllocationCallbacks') {
      return [
        'تُستخدم هذه البنية عندما يريد التطبيق تمرير مخصصات ذاكرة مخصصة إلى دوال Vulkan بدل الاعتماد على آلية التخصيص الافتراضية.',
        'تفيد لأنها تسمح للمحرك أو التطبيق بالتحكم الكامل في طريقة تخصيص ذاكرة المضيف وتحريرها وتتبعها أثناء إنشاء الموارد وتدميرها.'
      ];
    }
    if (/^VkApplicationInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية في مرحلة Initialization لوصف اسم التطبيق والمحرك وإصدار API المطلوب قبل إنشاء VkInstance.',
        'تفيد لأنها تعطي اللودر والسائق سياقاً واضحاً عن نسخة Vulkan التي يتوقعها التطبيق، وقد تؤثر في سلوك التوافق أو التقارير أو التحقق.'
      ];
    }
    if (/^VkInstanceCreateInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية مباشرة مع vkCreateInstance لتحديد الامتدادات والطبقات ومعلومات التطبيق التي سيُنشأ على أساسها VkInstance.',
        'تفيد لأنها تجمع كل ما يحتاجه اللودر والسائق لفتح نقطة دخول التطبيق إلى Vulkan وتفعيل ما يلزم من مسارات منصة أو تحقق منذ البداية.'
      ];
    }
    if (/^VkPresentInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية عند استدعاء vkQueuePresentKHR لتحديد أي صور Swapchain ستُقدَّم إلى Presentation Engine وأي semaphores يجب انتظارها قبل التقديم.',
        'تفيد لأنها تربط نهاية عمل الـ GPU بعملية العرض نفسها: لا تُقدَّم الصورة إلا بعد اكتمال الإشارات المطلوبة وبالفهارس الصحيحة لصور Swapchain.'
      ];
    }
    if (/^VkAcquireNextImageInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية مع vkAcquireNextImage2KHR لتحديد كيف سيحصل التطبيق على الصورة التالية الجاهزة للرسم من Swapchain.',
        'تفيد لأنها تحدد مهلة الانتظار وآلية المزامنة التي ستجعل التطبيق يعرف متى تصبح صورة العرض صالحة للاستخدام من جديد.'
      ];
    }
    if (/^VkAcquireProfilingLockInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية مع vkAcquireProfilingLockKHR لتحديد طلب profiling lock نفسه: هل توجد Flags إضافية، وكم nanoseconds يجوز للاستدعاء أن ينتظرها قبل الفشل أو المتابعة.',
        'تفيد لأنها تعطي التطبيق تحكماً صريحاً في كيفية حجز قفل التنميط الذي يحتاجه بعض مسارات تحليل الأداء على الجهاز.'
      ];
    }
    if (/^VkSubmitInfo2?(KHR)?$/.test(name)) {
      return [
        'تُستخدم هذه البنية عند الإرسال إلى Queue لتحديد Command Buffers التي ستنفذ، والـ semaphores التي سيُنتظر عليها، والـ semaphores التي ستُطلق بعد اكتمال التنفيذ.',
        'تفيد لأنها تمثل عقدة الربط بين Command Recording وGPU Execution: هي التي تحدد ما العمل الذي سيدخل الطابور وما شروط بدء التنفيذ وانتهائه.'
      ];
    }
    if (/^Vk(CommandBuffer|Semaphore)SubmitInfo(KHR)?$/.test(name)) {
      return [
        `تُستخدم ${name} كعنصر فرعي داخل بنى submit الحديثة لوصف Command Buffer واحد أو Semaphore واحد ضمن عملية الإرسال إلى Queue.`,
        'تفيد لأنها تفصل كل جزء من عملية الإرسال إلى عناصر صريحة: أي Command Buffer سينفذ، وأي stage ينتظر أو يطلق الإشارة، وكيف ترتبط المزامنة بالعمل الفعلي.'
      ];
    }
    if (/^VkWriteDescriptorSet/.test(name)) {
      return [
        `تُستخدم ${name} عند تحديث descriptors لتحديد أي binding وarray element سيُكتب، وما المورد الفعلي الذي سيصبح مرئياً للشيدر في ذلك الموضع.`,
        'تفيد لأنها تجعل ربط الموارد مع Pipeline Layout والشيدرات صريحاً وقابلاً للتحديث من دون إعادة إنشاء الكائنات الرسومية نفسها.'
      ];
    }
    if (/^VkAttachmentDescription2?(KHR)?$/.test(name)) {
      return [
        `تُستخدم ${name} داخل render pass لتحديد دورة حياة المرفق نفسه: ماذا يحدث لمحتواه عند البداية، وهل سيُخزَّن بعد النهاية، وما layout الذي سيتحول إليه.`,
        'تفيد لأنها تحدد كيف ستتعامل Vulkan مع ذاكرة الصورة المرتبطة بالمرفق أثناء الرسم، وهو ما يؤثر مباشرة في الصحة والأداء والتزامن.'
      ];
    }
    if (/^VkAttachmentReference2?(KHR)?$/.test(name)) {
      return [
        `تُستخدم ${name} داخل subpass لربط مرفق فعلي بموضع استخدامه، مثل color attachment أو depth/stencil، مع تحديد layout المطلوب أثناء القراءة أو الكتابة.`,
        'تفيد لأنها تجعل علاقة أوامر الرسم بالمرفقات صريحة: أي صورة سيقرأ أو يكتب إليها الـ Pipeline، وبأي حالة layout يجب أن تكون.'
      ];
    }
    if (/^VkAabbPositions(KHR|NV)?$/.test(name)) {
      return [
        'تُستخدم هذه البنية عندما تريد وصف حجم هندسي بصندوق AABB عبر إحداثيات min وmax على المحاور الثلاثة، بحيث تقرأها Vulkan كحدود مكانية فعلية.',
        'تفيد في مسارات Ray Tracing لأن Vulkan لا تحتاج كل Vertex هنا، بل تحتاج حدوداً مكانية واضحة يمكن إدخالها في بناء BVH أو اختبارات التقاطع.'
      ];
    }
    if (/^VkAccelerationStructureBuildSizesInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية كبنية خرج بعد استدعاءات حساب الأحجام، حتى يعرف التطبيق كم Bytes يجب أن يخصصها لكائن Acceleration Structure نفسه وكم Bytes يحتاجها Scratch Buffer للبناء أو التحديث.',
        'تفيد لأنها تمنع التخمين اليدوي لأحجام الذاكرة في مسار Ray Tracing، وتفصل بين الذاكرة الدائمة للبنية والذاكرة المؤقتة التي يحتاجها بناء BVH على الجهاز.'
      ];
    }
    if (/^VkAccelerationStructureBuildGeometryInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية قبل أوامر build أو update لتجميع كل ما تحتاجه Vulkan كي تبني BVH: نوع البنية، والـ Geometry، ووجهة الكتابة، وموقع Scratch Buffer المؤقت.',
        'تفيد لأنها تجعل وصف عملية بناء Acceleration Structure صريحاً ومركزاً في بنية واحدة، بحيث تقرأ Vulkan الحقول معاً أثناء التنفيذ على الجهاز.'
      ];
    }
    if (/^VkAccelerationStructureBuildRangeInfoKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية لتحديد عدد الـ Primitives والإزاحات والفهارس التي ستدخل فعلياً من كل Geometry في عملية البناء.',
        'تفيد لأنها تفصل بين وصف مصدر البيانات نفسه وبين النطاق الذي ستقرأه Vulkan من هذا المصدر عند بناء BVH.'
      ];
    }
    if (/^VkAccelerationStructureGeometryTrianglesDataKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية لتحديد أماكن Vertex وIndex وTransform Buffers أو عناوينها، وكيف ستقرأ Vulkan المثلثات لبناء BLAS.',
        'تفيد لأنها تشرح لـ Vulkan شكل الـ Geometry الفعلية في الذاكرة: ما هو Format الرؤوس، وما هو Stride، وأين تبدأ البيانات، وكيف تُحوَّل قبل البناء.'
      ];
    }
    if (/^VkAccelerationStructureGeometryAabbsDataKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية عندما يكون الـ Geometry عبارة عن AABBs لا مثلثات، فتحدد لـ Vulkan مكان البيانات والمسافة بالـ Bytes بين صندوق وآخر.',
        'تفيد لأنها تسمح بإدخال حدود مكانية بسيطة إلى مسار البناء بدلاً من هندسة مثلثية كاملة، وهو ما يقلل تعقيد البيانات في بعض السيناريوهات.'
      ];
    }
    if (/^VkAccelerationStructureGeometryInstancesDataKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية في بناء TLAS لتحديد مكان بيانات الـ Instances وكيف ستقرأ Vulkan كل مرجع إلى BLAS والتحويل المرتبط به.',
        'تفيد لأنها تجعل بناء TLAS قائماً على Instances قابلة لإعادة الاستخدام، بدلاً من تكرار الهندسة الكاملة لكل جسم في المشهد.'
      ];
    }
    if (/^VkAccelerationStructureGeometryKHR$/.test(name)) {
      return [
        'تُستخدم هذه البنية كغلاف يربط نوع الـ Geometry ببياناته الفعلية، حتى تعرف Vulkan هل ستقرأ Triangles أم AABBs أم Instances عند البناء.',
        'تفيد لأنها تمنع الخلط بين أشكال الهندسة المختلفة في مسار واحد، وتسمح للدالة نفسها بقراءة Union مناسب بحسب geometryType.'
      ];
    }
    if (/^VkAccelerationStructureCreateInfo(KHR|NV)$/.test(name)) {
      return [
        'تُستخدم هذه البنية قبل إنشاء Acceleration Structure لتحديد الـ Buffer والحجم والنوع والخواص اللازمة للكائن نفسه.',
        'تفيد لأنها تفصل بين مرحلة إنشاء الكائن والذاكرة المرتبطة به وبين مرحلة بناء BVH داخله لاحقاً.'
      ];
    }
    if (/^VkAccelerationStructure/.test(name)) {
      return [
        `تُستخدم ${name} داخل مسار Ray Tracing عندما تحتاج Vulkan إلى وصف الهندسة أو الأحجام أو الموارد أو عناوين الذاكرة التي ستدخل في بناء BLAS أو TLAS.`,
        'تفيد لأن بناء BVH يعتمد على وصف دقيق لمكان البيانات وعدد الـ Primitives ونوع الـ Geometry وScratch Buffer المستخدم، وليس على معنى لغوي عام لاسم الحقل.'
      ];
    }
    if (/^VkDeviceCreateInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية قبل vkCreateDevice لتحديد Queue Families والامتدادات والميزات التي سيحملها VkDevice الناتج.',
        'تفيد لأنها تمثل العقد الفعلي بين التطبيق والعتاد: ما الذي سيفعَّل على الجهاز المنطقي وما الموارد التنفيذية التي ستصبح متاحة بعد الإنشاء.'
      ];
    }
    if (/^VkDeviceQueueCreateInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية لتحديد من أي Queue Family سيأخذ VkDevice الطوابير، وكم Queue سيُنشأ، وما أولوية كل Queue.',
        'تفيد لأنها تربط مرحلة Device Creation مباشرة بمرحلة التنفيذ اللاحقة على Queues، فلا يمكن استخدام Queue قبل وصفها هنا.'
      ];
    }
    if (/^Vk.+SurfaceCreateInfo/.test(name)) {
      return [
        `تُستخدم ${name} عند إنشاء Surface لربط Vulkan بكائن المنصة الأصلي الذي سيمثل واجهة العرض، مثل نافذة Win32 أو Xlib أو Wayland أو طبقة Metal.`,
        'تفيد لأنها تنقل معلومات نظام النوافذ إلى Vulkan بشكل صريح، حتى يعرف السائق أي سطح عرض فعلي سيرتبط لاحقاً بالـ Swapchain وعمليات التقديم.'
      ];
    }
    if (/^VkPhysicalDevice.+Features/.test(name)) {
      return [
        `تُستخدم ${name} لقراءة الميزات التي يدعمها الجهاز الفيزيائي فعلياً أو لطلب تفعيل بعضها قبل إنشاء VkDevice.`,
        'تفيد لأنها تربط بين ما يعلنه العتاد فعلاً وبين الميزات التي سيعتمد عليها التطبيق في الكود أو في الشيدرات.'
      ];
    }
    if (/^VkPhysicalDevice.+Properties/.test(name) || /^VkPhysicalDeviceProperties2?$/.test(name)) {
      return [
        `تُستخدم ${name} كبنية خرج تكتب فيها Vulkan خصائص الجهاز الفيزيائي وحدوده وقدراته عند الاستعلام.`,
        'تفيد لأن التطبيق يعتمد عليها لمعرفة ما يستطيع العتاد فعله فعلياً قبل اختيار التنسيقات أو الأحجام أو المسارات البرمجية المناسبة.'
      ];
    }
    if (/^VkMemory.+AllocateInfo/.test(name) || /^VkExportMemoryAllocateInfo/.test(name) || /^VkImportMemory.+Info/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد كيفية حجز الذاكرة أو ربطها أو مشاركتها أو استيرادها وتصديرها بحسب مسار الذاكرة المطلوب.`,
        'تفيد لأنها تجعل سياسة الذاكرة صريحة: ما الحجم المطلوب، وما نوع الذاكرة أو آلية المشاركة أو الربط التي يجب أن تعتمدها Vulkan.'
      ];
    }
    if (/^Vk(Graphics|Compute|RayTracing|ExecutionGraph).*CreateInfo/.test(name)) {
      return [
        `تُستخدم ${name} لتجميع معلمات إنشاء خط الأنابيب نفسه، مثل المراحل الشادرية والحالة الثابتة والتخطيطات والربط مع بقية موارد الرسم أو الحساب.`,
        'تفيد لأنها تحدد السلوك الكامل لخط الأنابيب الذي سينفذ العمل على الجهاز، لا مجرد راية أو خيار واحد معزول.'
      ];
    }
    if (/^VkPipelineLayoutCreateInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية لتحديد descriptor set layouts و push constant ranges التي سيعتمد عليها خط الأنابيب أو أوامر الدفع.',
        'تفيد لأنها تحدد عقد الربط بين الشيدرات والموارد التي سيراها خط الأنابيب فعلياً عند التنفيذ.'
      ];
    }
    if (/^VkPipeline.+CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} أثناء إنشاء Pipeline لتحديد الحالة الثابتة أو الجزء البنيوي الذي سيدخل في تكوين خط الأنابيب النهائي.`,
        'تفيد لأنها تجعل سلوك الـ Pipeline صريحاً منذ مرحلة الإنشاء: كيف سيقرأ البيانات، وكيف سيجري المزج أو الاختبار أو الكتابة أو غير ذلك من حالات التنفيذ.'
      ];
    }
    if (/^VkPipelineShaderStageCreateInfo$/.test(name)) {
      return [
        'تُستخدم هذه البنية لوصف مرحلة شادر واحدة داخل خط الأنابيب، مثل نوع المرحلة والوحدة الشادرية ونقطة الدخول.',
        'تفيد لأنها تربط المرحلة البرمجية نفسها بخط الأنابيب وتحدد كيف ستدخل الشيدرات في عملية الإنشاء.'
      ];
    }
    if (/^Vk(Buffer|BufferView).*CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد شكل المخزن أو عرض المخزن وكيف سيُستخدم لاحقاً في النسخ أو الرسم أو الحساب أو القراءة من الشيدر.`,
        'تفيد لأنها تجعل نوع الاستخدام وحجم المورد وطريقة تفسيره واضحة قبل الإنشاء، وهو ما يؤثر مباشرة في صلاحية الوصول إليه لاحقاً.'
      ];
    }
    if (/^Vk(Image|ImageView).*CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد خصائص الصورة أو عرض الصورة، مثل الأبعاد والتنسيق والاستخدام ونطاق المورد الذي سيُعرض أو يُستخدم.`,
        'تفيد لأنها تحدد منذ الإنشاء كيف ستدخل الصورة مسار Vulkan: كهدف رسم أو مصدر عينات أو مورد نقل أو عرض.'
      ];
    }
    if (/^VkSampler.+CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد كيفية أخذ العينات من الصور، مثل الترشيح والعنونة والمستويات والخصائص المرتبطة بالـ anisotropy أو المقارنة.`,
        'تفيد لأنها تحدد السلوك البصري والرياضي لعملية القراءة من الصور داخل الشيدر، لا مجرد وجود السامبلر نفسه.'
      ];
    }
    if (/^VkDescriptor(SetLayout|Pool|UpdateTemplate).*CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد كيف ستُنظَّم الواصفات أو تُخصَّص أو تُحدَّث داخل المسار المرتبط بالموارد والشيدرات.`,
        'تفيد لأنها تتحكم في شكل الربط بين الموارد البرمجية مثل الصور والمخازن وبين ما ستراه الشيدرات فعلياً عند التنفيذ.'
      ];
    }
    if (/^Vk(CommandPool|CommandBuffer).+Info/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد سياسة العمل مع مخازن الأوامر أو تجمعاتها، مثل كيفية الإنشاء أو التخصيص أو بدء التسجيل.`,
        'تفيد لأنها تحدد دورة حياة أوامر GPU نفسها: أين تُخزَّن، وكيف تُعاد تهيئتها، وتحت أي شروط يبدأ التسجيل أو التخصيص.'
      ];
    }
    if (/^VkRenderPass.+(CreateInfo|BeginInfo)$/.test(name) || /^VkSubpass.+/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد كيفية تنظيم التمرير الرسومي والمرفقات والسياسات المرتبطة ببداية الرسم أو انتقاله بين المرفقات الفرعية.`,
        'تفيد لأنها تضبط البنية الفعلية لعمل الرسم نفسه: ما المرفقات المستخدمة، ومتى يبدأ التنفيذ، وكيف تنتقل البيانات داخل التمرير.'
      ];
    }
    if (/Callbacks$/.test(name)) {
      return [
        `تُستخدم ${name} عندما تريد تزويد Vulkan بدوال رد نداء أو بسياق مستخدم مخصص يرتبط بالعملية أو الكائن المعني.`,
        'تفيد لأن الواجهة تستطيع عندها استدعاء منطق التطبيق نفسه في التخصيص أو التتبع أو التبليغ بدلاً من الاكتفاء بسلوك افتراضي ثابت.'
      ];
    }
    if (/CreateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتجميع معلمات الإنشاء في بنية واحدة قبل تمريرها إلى دالة الإنشاء المرتبطة بها.`,
        'تفيد لأنها تجعل وصف الكائن المطلوب إنشاؤه صريحاً وقابلاً للتوسعة عبر pNext بدل توزيع الإعدادات على بارامترات متفرقة.'
      ];
    }
    if (/AllocateInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد ما الذي سيُخصص فعلياً: كمية الموارد المطلوبة، ومصدرها، وأي معلومات إضافية تتحكم في أسلوب التخصيص.`,
        'تفيد لأنها تجعل طلب التخصيص واضحاً وصريحاً قبل تمريره إلى الدالة التي ستنشئ الموارد أو تحجز الذاكرة فعلياً.'
      ];
    }
    if (/BeginInfo$/.test(name)) {
      return [
        `تُستخدم ${name} لتحديد ظروف ومعلمات بداية العملية أو النطاق الذي ستفتحه الدالة المرتبطة بها.`,
        'تفيد لأنها تضبط من البداية كيف يجب أن تدخل العملية حالتها الأولى، مثل رايات البدء أو الموارد أو النطاقات المرتبطة بها.'
      ];
    }
    if (/Properties/.test(name)) {
      return [
        `تُستخدم ${name} كبنية خرج تكتب فيها Vulkan الخصائص أو الحدود أو القدرات الفعلية التي يدعمها الجهاز أو المورد أو المسار المرتبط.`,
        'تفيد لأن التطبيق يبني قراراته اللاحقة على القيم والقدرات الحقيقية التي أعادها السائق، لا على افتراضات مسبقة.'
      ];
    }
    if (/Features/.test(name)) {
      return [
        `تُستخدم ${name} لقراءة الميزات المدعومة فعلياً أو لطلب تفعيل ميزات معينة قبل إنشاء الجهاز أو المورد المرتبط.`,
        'تفيد لأنك لا تستطيع الاعتماد على ميزة في Vulkan قبل التأكد من دعمها أو تفعيلها صراحة ضمن مسار الإنشاء الصحيح.'
      ];
    }
  }

  if (kind === 'macro') {
    if (/^VK_(MAKE_API_VERSION|API_VERSION)$/.test(name)) {
      return [
        `يُستخدم ${name} لبناء تعبير عددي واحد يشفّر حقول الإصدار داخل integer واحد قبل تمريره إلى Vulkan، مثل الحقل apiVersion داخل VkApplicationInfo.`,
        'تفيد هذه الماكرو لأنها تمنع المطور من كتابة إزاحات وأقنعة البتات يدوياً، وتجعل القيمة النهائية مطابقة تماماً لصيغة الإصدار التي تفرضها ترويسة فولكان أثناء الترجمة.'
      ];
    }
    if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
      return [
        `يُستخدم ${name} لاستخراج أحد الحقول من رقم إصدار مدمج بعد توسعة الماكرو إلى إزاحات وأقنعة بتات مباشرة على العدد.`,
        'يفيد عندما يحتاج التطبيق إلى قراءة الحقل major أو minor أو patch الحقيقي من apiVersion أو من رقم إصدار مخزن، من دون كتابة عمليات البتات يدوياً داخل الكود.'
      ];
    }
    if (/^VK_(DEFINE_HANDLE|DEFINE_NON_DISPATCHABLE_HANDLE)$/.test(name)) {
      return [
        `يُستخدم ${name} داخل ترويسة فولكان لتوليد تعريف typedef لنوع مقبض جديد أثناء المعالجة المسبقة، وليس لاستدعاء دالة أثناء وقت التشغيل.`,
        'يفيد في طبقة التعريفات نفسها، لأن شكل المقابض يجب أن يبقى موحداً ومتوافقاً مع المنصة ومع نوع المقبض القابل للإرسال أو غير القابل للإرسال.'
      ];
    }
    if (/^VK_NULL_HANDLE$/.test(name)) {
      return [
        'يُستخدم هذا الماكرو لتهيئة المقابض إلى حالة غياب أو لإعادة ضبطها أو لمقارنتها بقيمة تعني عدم وجود مقبض صالح.',
        'يفيد لأنه يعطي قيمة موحدة تحددها الترويسة بحسب المنصة واللغة، بدلاً من افتراض أن الصفر أو nullptr هو الشكل الصحيح دائماً لكل المقابض.'
      ];
    }
    if (/^VK_HEADER_VERSION(?:_COMPLETE)?$/.test(name) || /^VK_API_VERSION_\d+_\d+$/.test(name)) {
      return [
        `يُستخدم ${name} كقيمة ثابتة جاهزة داخل الكود أو شروط البناء عندما تحتاج رقم إصدار معروفاً من الترويسة أو من نسخة الواجهة الأساسية.`,
        'يفيد في التوثيق والمقارنات وشروط التوافق، لأن القيمة تأتي مباشرة من ترويسة فولكان نفسها لا من رقم صلب يكتبه المطور يدوياً.'
      ];
    }
    if (/_EXTENSION_NAME$/.test(name)) {
      return [
        `يُستخدم ${name} كماكرو ثابت يتوسع إلى سلسلة نصية حرفية تحمل الاسم الرسمي للامتداد كما ستقارنه أو تمرره فولكان.`,
        'يفيد عند فحص دعم الامتداد أو تفعيله داخل قوائم أسماء الامتدادات، لأن الخطأ في السلسلة النصية الحرفية المكتوبة يدوياً يمنع العثور على الامتداد أو تفعيله.'
      ];
    }
    if (/_SPEC_VERSION$/.test(name)) {
      return [
        `يُستخدم ${name} كماكرو ثابت يتوسع إلى ثابت عددي يمثل نسخة مواصفة الامتداد في الترويسة الحالية.`,
        'يفيد عندما تقارن specVersion الذي يعيده السائق بالقيمة التي يتوقعها الكود أو عندما تسجل معلومات الامتداد المعتمد.'
      ];
    }
    if (/^VK_USE_PLATFORM_/.test(name)) {
      return [
        `يُستخدم ${name} قبل تضمين ترويسة فولكان لفتح فروع الترجمة الشرطية الخاصة بمنصة معينة، بحيث تظهر الأنواع والدوال الخاصة بهذه المنصة في الترجمة.`,
        'يفيد لأنه يقيّد ما يُولَّد من تعريفات داخل الترويسة بالمنصات المطلوبة فعلاً، ولا يضيف أي سلوك وقت تشغيل بحد ذاته.'
      ];
    }
  }

  if (kind === 'constant') {
    if (/^VK_(TRUE|FALSE)$/.test(name)) {
      return [
        `يُستخدم ${name} في الحقول أو النتائج التي تتبع اصطلاح القيم المنطقية في Vulkan.`,
        'يفيد لأنه يعبّر صراحة عن القيمة المنطقية المتوقعة من الواجهة بدلاً من تمرير 0 أو 1 مباشرة.'
      ];
    }
    if (/^VK_WHOLE_SIZE$/.test(name) || /^VK_REMAINING_/.test(name)) {
      return [
        `يُستخدم ${name} عندما تريد أن تفهم الواجهة أن النطاق يمتد تلقائياً حتى بقية المورد أو بقية الأجزاء المتبقية.`,
        'يفيد لأنه يمنع الحسابات اليدوية المتكررة للأحجام أو عدد الطبقات أو مستويات mip المتبقية.'
      ];
    }
    if (/^VK_ATTACHMENT_UNUSED$/.test(name) || /^VK_SUBPASS_EXTERNAL$/.test(name) || /^VK_QUEUE_FAMILY_/.test(name)) {
      return [
        `يُستخدم ${name} كقيمة خاصة ذات معنى اصطلاحي داخل البنى أو الاعتماديات المرتبطة بالرسم أو الطوابير.`,
        'يفيد لأنه يعبّر عن حالة خاصة تعرفها المواصفة مباشرة، مثل التجاهل أو الربط بعنصر خارجي، من دون الحاجة إلى أرقام سحرية.'
      ];
    }
    if (/^VK_MAX_|_SIZE(?:_|$)/.test(name)) {
      return [
        `يُستخدم ${name} عندما تحتاج الحد الأقصى أو الطول الثابت الذي تفترضه المواصفة في هذا السياق.`,
        'يفيد لتحديد أحجام المصفوفات أو النصوص أو المفاتيح أو البنى المرتبطة من دون استخدام أرقام حرفية داخل التطبيق.'
      ];
    }
  }

  if (kind === 'handle') {
    return [
      `يمثل ${name} مقبضاً إلى ${localizeTypeSubjectName(name)}؛ تحصل عليه من دالة إنشاء أو استعلام ثم تمرره إلى الدوال التي تعمل على هذا الكائن.`,
      'يفيد لأن Vulkan لا تنسخ الكائن نفسه إلى التطبيق، بل تعطيك مقبضاً تستخدمه كمرجع ثابت إلى المورد أو الحالة الداخلية.'
    ];
  }

  if (kind === 'function_pointer') {
    return [
      `يمثل ${name} نوع مؤشر دالة يجب أن يطابق التوقيع الذي تتوقعه Vulkan عند التحميل الديناميكي أو عند تمرير callback.`,
      'يفيد لأنك تستخدمه لتعريف دوال الاستدعاء العكسي أو لتخزين مؤشرات دوال Vulkan المحمّلة في وقت التشغيل بصيغة صحيحة.'
    ];
  }

  if (kind === 'scalar') {
    return [
      `يمثل ${name} نوعاً أساسياً أو نوع منصة تستخدمه Vulkan داخل البنى وتواقيع الدوال لتمثيل قيمة أو مقبض نظامي معيّن.`,
      'يفيد لأن اختيار هذا النوع يحدد بالضبط حجم القيمة أو معناها المنصاتي، مثل حجم ذاكرة أو قيمة منطقية أو كائن منصة خارجي.'
    ];
  }

  return [];
}

function inferTypeExecutionDomain(name) {
  const value = String(name || '');
  if (/AccelerationStructure|RayTracing|Micromap|Aabb|Geometry|BLAS|TLAS|BVH/.test(value)) return 'بناء واستخدام بنى التسارع';
  if (/Swapchain|Present|Display|Surface/.test(value)) return 'العرض والربط مع نظام النوافذ';
  if (/Memory|Allocation|Allocate|BindMemory|Mapped|Sparse/.test(value)) return 'إدارة الذاكرة والربط بالموارد';
  if (/CommandBuffer|CommandPool|Cmd/.test(value)) return 'تسجيل الأوامر وتجهيز أوامر المعالج الرسومي';
  if (/Queue|Submit|Fence|Semaphore|Event|Barrier/.test(value)) return 'المزامنة والإرسال إلى الطوابير';
  if (/RenderPass|Subpass|Attachment|Framebuffer/.test(value)) return 'تنظيم الرسم والمرفقات داخل مسار الرسم';
  if (/Pipeline|Shader|Descriptor|Sampler|PushConstant/.test(value)) return 'خط الأنابيب وربط الموارد مع الشيدرات';
  if (/Image|ImageView/.test(value)) return 'إدارة الصور واستخدامها في الرسم أو النسخ أو العرض';
  if (/Buffer|BufferView/.test(value)) return 'إدارة المخازن والوصول إلى البيانات';
  if (/PhysicalDevice|Device/.test(value)) return 'تهيئة الجهاز وقراءة قدراته أو إنشاء الجهاز المنطقي';
  if (/Video|Session|Coding/.test(value)) return 'مسار الفيديو وترميز الإطارات أو فكها';
  return 'المسار التنفيذي المرتبط بهذا العنصر داخل Vulkan';
}

function inferTypeDescription(name, kind) {
  const specific = inferSpecificTypeDescription(name, kind);
  if (specific) {
    const extension = inferExtension(name);
    return extension ? `${specific} هذا العنصر مرتبط بامتداد ${extension}.` : specific;
  }

  const domain = inferTypeExecutionDomain(name);
  const labels = {
    structure: `بنية تقرأها Vulkan كوحدة واحدة لتحديد كيف ستنفذ ${domain}.`,
    handle: `مقبض يمثل كائناً تديره Vulkan داخلياً ضمن ${domain} ويُستخدم كمرجع ثابت لهذا الكائن.`,
    enum: `تعداد تقرؤه Vulkan في الحقول أو الدوال المرتبطة به لإعلان النمط أو الحالة التنفيذية التي سيُبنى عليها ${domain}.`,
    flag: `نوع أعلام بتّي تقرؤه Vulkan كبتات مستقلة؛ كل بت مفعّل يضيف قيداً أو سلوكاً تنفيذياً واضحاً إلى ${domain}.`,
    function_pointer: `نوع مؤشر دالة أو استدعاء عكسي تستخدمه Vulkan أو التطبيق للتحميل الديناميكي أو لتمرير منطق مخصص داخل ${domain}.`,
    scalar: `نوع أساسي أو نوع منصة تستخدمه Vulkan لتمثيل قيمة تشغيلية مرتبطة بـ ${domain}.`,
    constant: `ثابت مرجعي يعطي قيمة خاصة أو حداً معروفاً تستخدمه Vulkan ضمن ${domain}.`,
    macro: `ماكرو مرجعي يولد قيمة أو تعريفاً ثابتاً تستخدمه الترويسات أو البنى أو المقارنات المرتبطة بـ ${domain}.`
  };

  const extension = inferExtension(name);
  const base = labels[kind] || 'عنصر مرجعي ضمن توثيق Vulkan.';
  return extension ? `${base} هذا العنصر مرتبط بامتداد ${extension}.` : base;
}

function generateTypeExample(name, kind) {
  switch (kind) {
    case 'handle':
      return `${name} handle = VK_NULL_HANDLE;\n\nif (handle != VK_NULL_HANDLE) {\n    // أصبح المقبض صالحاً ويمكن تمريره إلى دوال Vulkan المرتبطة به\n}`;
    case 'structure':
      return `${name} info = {};\n${/Callbacks$/.test(name) ? '' : `info.sType = VK_STRUCTURE_TYPE_${upperSnakeCase(name)};\n`}info.pNext = nullptr;\n\n// اضبط بقية الحقول المطلوبة قبل تمرير الهيكل إلى دالة Vulkan المناسبة`.replace(/\n\n\n/g, '\n\n');
    case 'enum':
      return `${name} value = (${name})0;\n\nswitch (value) {\n    default:\n        // اختر إحدى القيم المعرفة في هذا التعداد قبل الاستخدام\n        break;\n}`;
    case 'flag':
      return `${name} flags = 0;\n\n// اجمع القيم المناسبة باستخدام العامل |\nflags |= (${name})0;`;
    case 'function_pointer':
      return `${name} callback = nullptr;\n\nif (callback) {\n    // يمكن استدعاء مؤشر الدالة بعد التأكد من تحميله بنجاح\n}`;
    case 'scalar':
      return `${name} value = 0;\n\n// مرر القيمة إلى الدالة المناسبة أو حدّثها حسب سيناريو الاستخدام`;
    case 'constant':
      return `auto value = ${name};\n\nif (value == ${name}) {\n    // يمكن استخدام هذا الثابت في المقارنة أو في تهيئة الحقول المناسبة\n}`;
    case 'macro':
      if (/^VK_(MAKE_API_VERSION|MAKE_VERSION)$/.test(name)) {
        return `uint32_t version = ${name}(1, 2, 3${name === 'VK_MAKE_API_VERSION' ? ', 0' : ''});\n\n// بعد توسعة الماكرو يصبح السطر تعبير تجميع بتات عادي يستخدم الإزاحات وأقنعة البتات`;
      }
      if (/^VK_(API_VERSION_MAJOR|API_VERSION_MINOR|API_VERSION_PATCH|API_VERSION_VARIANT|VERSION_MAJOR|VERSION_MINOR|VERSION_PATCH)$/.test(name)) {
        return `uint32_t part = ${name}(version);\n\n// بعد توسعة الماكرو يصبح السطر تعبير استخراج مباشر بإزاحات وأقنعة البتات على version`;
      }
      if (/^VK_DEFINE_(HANDLE|NON_DISPATCHABLE_HANDLE)$/.test(name)) {
        return `${name}(VkCustomHandle)\n\n// بعد توسعة الماكرو ينتج تعريف typedef لنوع مقبض جديد داخل الترويسة`;
      }
      if (/^VK_NULL_HANDLE$/.test(name)) {
        return `VkBuffer buffer = ${name};\n\nif (buffer == ${name}) {\n    // لا يوجد مقبض صالح بعد\n}`;
      }
      if (/_EXTENSION_NAME$/.test(name)) {
        return `const char* extensions[] = { ${name} };\n\n// بعد توسعة الماكرو يصبح العنصر سلسلة نصية حرفية باسم الامتداد الرسمي`;
      }
      return `auto value = ${name};\n\n// هذا السطر يستخدم ناتج الماكرو بعد أن يوسعه المعالج المسبق داخل الكود`;
    default:
      return `${name};`;
  }
}

function generateTypeUsage(name, kind) {
  const specific = inferSpecificTypeUsage(name, kind);
  if (specific.length) {
    return specific;
  }

  switch (kind) {
    case 'structure':
      return [
        `تُستخدم ${name} عندما تحتاج Vulkan إلى وصف صريح للعملية أو المورد أو نتيجة الاستعلام في مسار ${inferTypeExecutionDomain(name)}، بحيث تُقرأ الحقول معاً داخل الدالة المرتبطة بها.`,
        'الفائدة العملية هي أن كل حقل لا يفسَّر منفرداً فقط؛ بل تقرأ Vulkan العلاقة بين counts والمؤشرات والمقابض والرايات معاً لتقرر ما الذي ستنشئه أو تقرأه أو تنفذه فعلياً.'
      ];
    case 'handle':
      return [
        `يمثل ${name} مقبضاً لكائن تديره Vulkan داخلياً، لذلك تتعامل معه كتعرّف لمورد قائم وليس كبيانات مباشرة.`,
        'يُنشأ هذا المقبض أو يُعاد من دالة مناسبة، ثم يُمرر لاحقاً إلى الدوال التي تعمل على ذلك المورد.'
      ];
    case 'enum':
      return [
        `${name} لا يحمل أرقاماً رمزية فقط؛ كل قيمة فيه تعلن فرعاً تنفيذياً تقرؤه Vulkan داخل الحقل أو الدالة التي تستقبل هذا النوع.`,
        'اختر القيمة التي تطابق الحالة الفعلية للموارد أو لمسار التنفيذ، لأن تبديلها يغير ما ستنتظره Vulkan أو تقرؤه أو تفعله لاحقاً.'
      ];
    case 'flag':
      return [
        `${name} يجمع بتات مستقلة؛ كل بت مفعّل يضيف خياراً تنفيذياً محدداً تقرأه Vulkan إلى هذا المسار.`,
        'ركّب فقط الأعلام التي تحتاج أثرها فعلاً باستخدام العامل |، لأن كل بت إضافي يغيّر القيود أو الخصائص التي ستبني عليها Vulkan التنفيذ.'
      ];
    case 'function_pointer':
      return [
        `يمثل ${name} مؤشراً لدالة يتم تحميله أو تمريره كاستدعاء عكسي أثناء عمل التطبيق.`,
        'يجب التأكد من أن المؤشر صالح قبل الاستدعاء لتفادي الوصول إلى عنوان غير مهيأ.'
      ];
    case 'scalar':
      return [
        `يعد ${name} نوعاً أساسياً أو مساعداً يستخدم داخل تواقيع Vulkan والهياكل المرتبطة بها.`,
        'قيمة هذا النوع غالباً تنتقل كعدّاد أو حجم أو فهرس أو معرف خاص بسيناريو معين.'
      ];
    case 'constant':
      return [
        `الثابت ${name} يمثل قيمة معرفة مسبقاً داخل فولكان تستخدم في المقارنة أو التهيئة أو تحديد حدود معينة.`,
        'استعن بهذا الثابت بدلاً من الأرقام المباشرة عندما تريد كتابة كود أوضح وأسهل صيانة.'
      ];
    case 'macro':
      return [
        `الماكرو ${name} يولد قيمة أو تعريفاً تتوقعه فولكان أو الترويسات المرتبطة بها بصيغة رسمية محددة.`,
        'الفائدة العملية هي تجنب بناء القيم أو أسماء الامتدادات أو تعريفات الأنواع يدوياً، مما يقلل أخطاء الدمج أو التسمية ويجعل الكود متوافقاً مع ما تقرؤه الواجهة فعلياً.'
      ];
    default:
      return [`${name} عنصر مرجعي ضمن فولكان ويظهر عادة في تواقيع الدوال أو إعدادات الموارد.`];
  }
}

function createCoreVersionItem(name) {
  const versionMatch = name.match(/^VK_VERSION_(\d+)_(\d+)$/);
  const major = versionMatch ? versionMatch[1] : '1';
  const minor = versionMatch ? versionMatch[2] : '0';

  return {
    name,
    description: `ثابت يمثل إصدار Vulkan ${major}.${minor} على مستوى المواصفة الأساسية.`,
    value: name,
    syntax: name,
    usage: [
      `يُستخدم ${name} للإشارة إلى إصدار المواصفة الأساسية Vulkan ${major}.${minor}.`,
      'يفيد هذا الثابت في المقارنات والتوثيق وربط الإصدارات المدعومة بالمزايا الأساسية للواجهة.'
    ],
    notes: [
      `يشير هذا الثابت إلى إصدار Vulkan ${major}.${minor} الأساسي.`,
      'يمكن استخدامه في الشروحات أو المقارنات أو عند تتبع الإصدارات المدعومة داخل التطبيق أو التوثيق.'
    ],
    example: `uint32_t apiVersion = ${name};\n\nif (apiVersion >= ${name}) {\n    // الإصدار الحالي يساوي هذا الإصدار أو أحدث منه\n}`,
    seeAlso: [`VK_API_VERSION_${major}_${minor}`, 'VK_MAKE_VERSION', 'VK_VERSION_MAJOR', 'VK_VERSION_MINOR'],
    extension: ''
  };
}

function generateTypeNotes(name, kind) {
  const notes = [];

  if (kind === 'structure') {
    notes.push('غالباً يجب ضبط الحقل sType عند استخدام هذا الهيكل إذا كان من هياكل CreateInfo أو Info.');
    notes.push('صفر الحقول غير المستخدمة أو هيّئها بقيم افتراضية آمنة قبل التمرير.');
  } else if (kind === 'handle') {
    notes.push('هيّئ المقابض غير المنشأة إلى VK_NULL_HANDLE كلما كان ذلك مناسباً.');
  } else if (kind === 'enum' || kind === 'flag') {
    notes.push('راجع القيم المسموح بها عند استخدام هذا النوع داخل دوال Vulkan المختلفة.');
  } else if (kind === 'macro') {
    notes.push('الماكرو لا يُستدعى كدالة أثناء وقت التشغيل؛ المعالج المسبق يستبدله نصياً قبل الترجمة.');
    if (/\(/.test(name)) {
      notes.push('افهم شكل توسعة الماكرو قبل استخدامه في تعبيرات معقدة، لأن ما يراه المترجم هو النص الناتج لا اسم الماكرو.');
    }
    if (/^VK_USE_PLATFORM_/.test(name)) {
      notes.push('يجب تعريف ماكرو المنصة قبل تضمين ترويسات فولكان حتى تظهر التعريفات الخاصة بهذه المنصة.');
    }
  }

  if (inferExtension(name)) {
    notes.push(`هذا العنصر يتطلب دعم الامتداد ${inferExtension(name)} عند الحاجة.`);
  }

  return notes;
}

function groupItemsByLetter(items, titlePrefix) {
  const groups = {};

  items.forEach((item) => {
    const letter = firstLetterKey(item.name);
    groups[letter] = groups[letter] || { title: `${titlePrefix} ${letter}`, items: [] };
    groups[letter].items.push(item);
  });

  Object.values(groups).forEach((group) => {
    group.items.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  });

  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0], 'en'))
  );
}

function mapSectionByLetters(section, titlePrefix, mapper) {
  const grouped = {};

  Object.entries(section || {}).forEach(([letter, items]) => {
    grouped[letter] = {
      title: `${titlePrefix} ${letter}`,
      items: items.map((name) => mapper(name, letter))
    };
  });

  return Object.fromEntries(
    Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], 'en'))
  );
}

function sanitizeHeaderText(text) {
  return String(text || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function splitStructStatements(body) {
  const statements = [];
  let current = '';

  String(body || '')
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }

      current += `${current ? ' ' : ''}${trimmed}`;
      if (trimmed.endsWith(';')) {
        statements.push(current.trim());
        current = '';
      }
    });

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}

function parseStructMember(statement) {
  const clean = String(statement || '')
    .replace(/;$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean || clean.startsWith('typedef ') || clean.startsWith('struct ') || clean === '{' || clean === '}') {
    return null;
  }

  const match = clean.match(/^(.*?)\s+([A-Za-z_]\w*)(\s*\[[^\]]+\])?$/);
  if (!match) {
    return null;
  }

  const type = `${match[1].trim()}${match[3] ? match[3].trim() : ''}`.trim();
  const name = match[2].trim();
  if (!type || !name) {
    return null;
  }

  return {
    name,
    type,
    description: ''
  };
}

function extractStructMembersFromHeaderFile(filePath, structMap) {
  const content = sanitizeHeaderText(fs.readFileSync(filePath, 'utf8'));
  const structRegex = /typedef\s+struct\s+([A-Za-z_]\w*)\s*\{([\s\S]*?)\}\s*([A-Za-z_]\w*)\s*;/g;
  let match;

  while ((match = structRegex.exec(content)) !== null) {
    const headerName = match[1];
    const aliasName = match[3];
    const structName = aliasName || headerName;
    if (!structName || !structName.startsWith('Vk')) {
      continue;
    }

    const members = splitStructStatements(match[2])
      .map((statement) => parseStructMember(statement))
      .filter(Boolean);

    if (members.length) {
      structMap.set(structName, members);
    }
  }
}

function loadHeaderStructMembers() {
  const includeDir = findExistingDir(vulkanIncludeCandidates);
  const structMap = new Map();

  if (!includeDir) {
    return structMap;
  }

  const headerFiles = walkFiles(includeDir, (fullPath) => fullPath.endsWith('.h'));
  headerFiles.forEach((filePath) => extractStructMembersFromHeaderFile(filePath, structMap));
  return structMap;
}

function createTypeItem(name, kind, typeToFunctions, officialTypeDocs = new Map(), structMembers = new Map()) {
  const officialDoc = officialTypeDocs.get(name) || null;
  const fallbackSeeAlso = (typeToFunctions.get(name) || []).slice(0, 6);
  const inferredDescription = inferTypeDescription(name, kind);
  const localizedDescription = officialDoc?.description
    ? localizeTypeDescription(officialDoc.description) || officialDoc.description
    : inferredDescription;
  const sanitizedDescription = localizedDescription && !hasResidualTypeEnglishProse(localizedDescription)
    ? localizedDescription
    : inferredDescription;
  const finalDescription = isGenericTypePlaceholder(sanitizedDescription) ? inferredDescription : sanitizedDescription;
  const generatedUsage = generateTypeUsage(name, kind);
  const localizedUsage = (kind === 'enum' || kind === 'flag') && officialDoc
    ? buildOfficialTypeUsage(
        name,
        kind,
        descriptionBody(officialDoc.description || ''),
        extractTypeSpecIntroFromOfficialDoc(officialDoc),
        (officialDoc.values || []).length
      )
    : officialDoc?.usage?.length
      ? officialDoc.usage.map((entry) => {
          if (!hasLatinText(entry)) {
            return normalizeSentence(entry);
          }
          const localizedEntry = localizeTypeReferenceText(entry);
          return localizedEntry || translateTechnicalText(entry);
        })
      : generatedUsage;
  const sanitizedUsage = localizedUsage
    .map((entry) => normalizeSentence(String(entry || '')))
    .filter(Boolean)
    .filter((entry) => !hasResidualTypeEnglishProse(entry));
  const finalUsage = sanitizedUsage.length
    && !localizedUsage.every((entry) => (
      /^الثابت\s+|^الماكرو\s+|^يمثل\s+.+كتعرّف|^يمثل\s+.+callback|^يعد\s+.+نوعاً أساسياً/.test(String(entry || ''))
      || (kind === 'structure' && isGenericStructureUsageLine(entry))
    ))
    ? sanitizedUsage
    : generatedUsage;
  const localizedValues = (officialDoc?.values || []).map((value) => ({
    ...value,
    description: value.description
      ? (() => {
          const localizedValueDescription = localizeTypeReferenceText(value.description) || value.description;
          return hasResidualTypeEnglishProse(localizedValueDescription) ? '' : localizedValueDescription;
        })()
      : value.description
  }));
  const officialNotes = officialDoc?.notes?.length
    ? localizeNotes(officialDoc.notes).filter((note) => !hasResidualTypeEnglishProse(note))
    : [];
  const localizedNotes = officialNotes.length ? officialNotes : generateTypeNotes(name, kind);

  return {
    name,
    description: finalDescription,
    members: structMembers.get(name) || [],
    values: localizedValues,
    usage: finalUsage,
    notes: localizedNotes,
    example: generateTypeExample(name, kind),
    seeAlso: officialDoc?.seeAlso?.length ? officialDoc.seeAlso : fallbackSeeAlso,
    extension: inferExtension(name)
  };
}

function copyVulkanSearchTables() {
  const sourceSearchPath = path.join(rootDir, 'content', 'reference', 'vulkan', 'search-tables.json');
  const targetSearchPath = path.join(rootDir, 'data', 'ui', 'vulkan-search-tables.json');
  if (!fs.existsSync(sourceSearchPath)) {
    console.warn(`Vulkan search tables source not found: ${sourceSearchPath}`);
    return;
  }
  fs.copyFileSync(sourceSearchPath, targetSearchPath);
}

async function main() {
  const sections = parseReferenceSections(fs.readFileSync(sourcePath, 'utf8'));
  const functionDocs = loadFunctionDocs();
  const macroDocs = loadMacroDocs();
  const typeDocs = new Map();
  const structMembers = loadHeaderStructMembers();

  const allFunctionNames = flattenSection(sections.Commands);
  await enrichFunctionDocs(functionDocs, allFunctionNames);
  hydrateAliasFunctionDocs(functionDocs);
  await enrichTypeDocs(typeDocs, flattenSection(sections.Enumerations), 'enum');
  await enrichTypeDocs(typeDocs, flattenSection(sections.Flags), 'flag');
  const allTypeNames = [
    ...flattenSection(sections.Structures),
    ...flattenSection(sections['Object Handles']),
    ...flattenSection(sections['Function Pointer Types']),
    ...flattenSection(sections['Scalar Types']),
    ...flattenSection(sections.Enumerations),
    ...flattenSection(sections.Flags)
  ];

  const typeToFunctions = new Map();
  functionDocs.forEach((doc) => {
    const relatedTypes = new Set();

    if (normalizeType(doc.returnType).startsWith('Vk')) {
      relatedTypes.add(normalizeType(doc.returnType));
    }

    (doc.parameters || []).forEach((param) => {
      const paramType = normalizeType(param.type);
      if (paramType.startsWith('Vk')) {
        relatedTypes.add(paramType);
      }
    });

    relatedTypes.forEach((typeName) => {
      const list = typeToFunctions.get(typeName) || [];
      if (!list.includes(doc.name)) {
        list.push(doc.name);
      }
      typeToFunctions.set(typeName, list);
    });
  });

  const buildFunctionItem = (name) => {
    const doc = functionDocs.get(name) || {};
    const categoryKey = inferFunctionCategoryKey(name, doc.category);
    const returnType = doc.returnType || inferFunctionReturnType(name);
    const extension = inferExtension(name);
    const rawUsage = doc.usage || [];
    const parameters = (doc.parameters || []).map((param) => ({
      ...param,
      description: localizeParameterDescription(param)
    }));
    const description = doc.description
      ? localizeFunctionDescription(name, doc.description, rawUsage[0] || '')
      : localizeFunctionDescription(name, inferFunctionDescription(name), rawUsage[0] || '');
    const usage = rawUsage.length
      ? rawUsage.map((entry) => localizeFunctionUsageEntry(entry, name)).filter(Boolean)
      : buildArabicFunctionUsage(name, description, parameters, returnType, extension, rawUsage);
    const notes = doc.notes?.length ? localizeNotes(doc.notes) : generateFunctionNotes(name, extension);

    return {
      name,
      category: formatFunctionCategory(categoryKey, name),
      description,
      signature: doc.signature || inferFunctionSignature(name, returnType),
      parameters,
      returnType,
      usage,
      returnValues: doc.returnValues?.length
        ? doc.returnValues
        : returnType === 'VkResult'
          ? [{value: 'VK_SUCCESS', description: 'تم الاستدعاء بنجاح أو يمكن استخدامه كنقطة بداية لمعالجة النتائج.'}]
          : [],
      notes,
      example: doc.example || generateFunctionExample(name, returnType, doc.parameters || []),
      seeAlso: doc.seeAlso?.length ? doc.seeAlso : inferRelatedFunctions(name, allFunctionNames),
      extension
    };
  };

  const structures = flattenSection(sections.Structures).map((name) =>
    createTypeItem(name, 'structure', typeToFunctions, typeDocs, structMembers)
  );
  const handles = flattenSection(sections['Object Handles']).map((name) =>
    createTypeItem(name, 'handle', typeToFunctions, typeDocs, structMembers)
  );
  const functionPointers = flattenSection(sections['Function Pointer Types']).map((name) =>
    createTypeItem(name, 'function_pointer', typeToFunctions, typeDocs, structMembers)
  );
  const scalarTypes = flattenSection(sections['Scalar Types']).map((name) =>
    createTypeItem(name, 'scalar', typeToFunctions, typeDocs, structMembers)
  );
  const enums = flattenSection(sections.Enumerations).map((name) =>
    createTypeItem(name, 'enum', typeToFunctions, typeDocs, structMembers)
  );
  const flags = flattenSection(sections.Flags).map((name) =>
    createTypeItem(name, 'flag', typeToFunctions, typeDocs, structMembers)
  );

  const constants = flattenSection(sections.Constants).map((name) => {
    const doc = macroDocs.get(name) || {};
    const inferredDescription = inferTypeDescription(name, 'constant');
    const inferredUsage = generateTypeUsage(name, 'constant');
    const description = doc.description && !isGenericTypePlaceholder(doc.description) ? doc.description : inferredDescription;
    const usage = doc.usage?.length && !doc.usage.every((entry) => /^الثابت\s+/.test(String(entry || ''))) ? doc.usage : inferredUsage;
    return {
      name,
      description,
      value: doc.returnValue || doc.syntax || name,
      syntax: doc.syntax || name,
      usage,
      notes: doc.notes?.length ? doc.notes : generateTypeNotes(name, 'constant'),
      example: doc.example || generateTypeExample(name, 'constant'),
      seeAlso: inferRelatedFunctions(name.replace(/^VK_/, 'vk'), allFunctionNames),
      extension: inferExtension(name)
    };
  });

  const coreVersions = flattenSection(sections['API Core Versions']).map((name) => createCoreVersionItem(name));

  const macros = flattenSection(sections['C Macro Definitions']).map((name) => {
    const doc = macroDocs.get(name) || {};
    const inferredDescription = inferTypeDescription(name, 'macro');
    const inferredUsage = generateTypeUsage(name, 'macro');
    const forceInferredDescription = /^(VK_DEFINE_HANDLE|VK_DEFINE_NON_DISPATCHABLE_HANDLE|VK_MAKE_API_VERSION|VK_API_VERSION|VK_API_VERSION_MAJOR|VK_API_VERSION_MINOR|VK_API_VERSION_PATCH|VK_API_VERSION_VARIANT|VK_HEADER_VERSION|VK_HEADER_VERSION_COMPLETE|VK_NULL_HANDLE)$/.test(name);
    const description = !forceInferredDescription && doc.description && !isGenericTypePlaceholder(doc.description) ? doc.description : inferredDescription;
    const usage = doc.usage?.length && !doc.usage.every((entry) => /^الماكرو\s+/.test(String(entry || ''))) ? doc.usage : inferredUsage;
    return {
      name,
      description,
      syntax: doc.syntax || name,
      value: doc.returnValue || '',
      parameters: doc.parameters || [],
      usage,
      notes: doc.notes?.length ? doc.notes : generateTypeNotes(name, 'macro'),
      example: doc.example || generateTypeExample(name, 'macro'),
      seeAlso: [],
      extension: inferExtension(name)
    };
  });

  const siteData = {
    meta: {
      version: '4.0',
      lastUpdated: new Date().toISOString().slice(0, 10),
      language: 'ar',
      description: 'بيانات الموقع الرئيسية مبنية من ملفات التعريب المحلية مع استكمال توليدي للعناصر غير الموثقة بعد'
    },
    functions: mapSectionByLetters(sections.Commands, 'الدوال', (name) => buildFunctionItem(name)),
    structures: {
      structures: { title: 'الهياكل', items: structures },
      handles: { title: 'المقابض', items: handles },
      function_pointers: { title: 'مؤشرات الدوال', items: functionPointers },
      scalar_types: { title: 'الأنواع الأساسية', items: scalarTypes }
    },
    enums: {
      enums: { title: 'التعدادات', items: enums },
      flags: { title: 'الأعلام', items: flags }
    },
    constants: {
      constants: { title: 'الثوابت', items: [...constants, ...coreVersions] }
    },
    macros: {
      definitions: { title: 'الماكرو', items: macros }
    }
  };

  const coreData = {
    meta: {
      ...siteData.meta,
      split: true,
      segments: ['functions', 'structures', 'enums', 'constants', 'macros'],
      detailBuckets: {
        functions: collectSectionDetailBuckets(siteData.functions),
        structures: collectSectionDetailBuckets(siteData.structures),
        enums: collectSectionDetailBuckets(siteData.enums),
        constants: collectSectionDetailBuckets(siteData.constants),
        macros: collectSectionDetailBuckets(siteData.macros)
      }
    },
    functions: mapSectionItems(siteData.functions, toLiteFunctionItem),
    structures: mapSectionItems(siteData.structures, toLiteTypeItem),
    enums: mapSectionItems(siteData.enums, toLiteEnumItem),
    constants: mapSectionItems(siteData.constants, toLiteConstantItem),
    macros: mapSectionItems(siteData.macros, toLiteMacroItem)
  };

  const serialized = serializeCompact(siteData);
  fs.writeFileSync(outputPath, serialized);
  ensureDir(splitOutputDir);
  writeJsonAndScript(splitCoreJsonPath, splitCoreScriptPath, '__ARABIC_VULKAN_CORE__', coreData);
  writeChunkedSectionFiles(rootDir, 'functions', 'functions', siteData.functions);
  writeChunkedSectionFiles(rootDir, 'structures', 'structures', siteData.structures);
  writeChunkedSectionFiles(rootDir, 'enums', 'enums', siteData.enums);
  writeChunkedSectionFiles(rootDir, 'constants', 'constants', siteData.constants);
  writeChunkedSectionFiles(rootDir, 'macros', 'macros', siteData.macros);
  execFileSync(process.execPath, [path.join(rootDir, 'scripts', 'build-file-pages.js')], {stdio: 'ignore'});
  copyVulkanSearchTables();

  const countItems = (obj) =>
    Object.values(obj || {}).reduce((total, category) => total + ((category.items || []).length), 0);

  const staticPagesDir = path.join(rootDir, 'pages', 'files');
  const staticFilePages = fs.existsSync(staticPagesDir)
    ? fs.readdirSync(staticPagesDir).filter((fileName) => fileName.endsWith('.html')).length
    : 0;

  console.log(
    JSON.stringify(
      {
        output: path.relative(rootDir, outputPath),
        counts: {
          functions: countItems(siteData.functions),
          structures: countItems(siteData.structures),
          enums: countItems(siteData.enums),
          constants: countItems(siteData.constants),
          macros: countItems(siteData.macros),
          structureMembersLoaded: [...structMembers.values()].reduce((total, members) => total + members.length, 0),
          staticFilePages
        }
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
