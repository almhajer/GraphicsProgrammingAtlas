#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const defaultSourceRoot = '/tmp/sdlwiki_offline/sdlwiki';
const sourceRoot = path.resolve(process.env.SDLWIKI_ROOT || defaultSourceRoot);
const outputPath = path.join(projectRoot, 'data', 'ui', 'sdl3.json');

const PACKAGE_META = {
  core: {
    key: 'core',
    displayName: 'SDL3 API',
    packageName: 'SDL3',
    title: 'SDL3',
    wikiPath: 'SDL3',
    overviewUrl: 'https://wiki.libsdl.org/SDL3/APIByCategory',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3/FrontPage',
    description: 'النواة الأساسية لـ SDL3 وتشمل إدارة النافذة والإدخال والأحداث والصوت والربط مع واجهات الرسوميات مثل Vulkan.'
  },
  image: {
    key: 'image',
    displayName: 'SDL3_image',
    packageName: 'SDL3_image',
    title: 'SDL3_image',
    wikiPath: 'SDL3_image',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_image/CategoryAPI',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_image/FrontPage',
    description: 'ملحق الصور الرسمي لتحميل الصور والرسوم المتحركة وتحويلها إلى بيانات قابلة للاستهلاك داخل SDL3.'
  },
  mixer: {
    key: 'mixer',
    displayName: 'SDL3_mixer',
    packageName: 'SDL3_mixer',
    title: 'SDL3_mixer',
    wikiPath: 'SDL3_mixer',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_mixer/CategorySDLMixer',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_mixer/FrontPage',
    description: 'ملحق الصوت الرسمي لتحميل وتشغيل ومزج الملفات والمسارات الصوتية فوق SDL3.'
  },
  ttf: {
    key: 'ttf',
    displayName: 'SDL3_ttf',
    packageName: 'SDL3_ttf',
    title: 'SDL3_ttf',
    wikiPath: 'SDL3_ttf',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_ttf/CategoryAPI',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_ttf/FrontPage',
    description: 'ملحق الخطوط والنصوص الرسمي في SDL3 لتحميل الخطوط ورسم النصوص وإدارة محركات text rendering.'
  }
};

const ENTITY_KIND_MAP = {
  CategoryAPIFunction: 'function',
  CategoryAPIDatatype: 'type',
  CategoryAPIStruct: 'type',
  CategoryAPIEnum: 'enum',
  CategoryAPIMacro: 'macro',
  CategoryAPIEnumerators: 'constant'
};

const OUTPUT_KIND_KEYS = ['functions', 'types', 'enums', 'constants', 'macros'];

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function stripTags(html) {
  const withBreaks = String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n');
  return normalizeWhitespace(decodeHtml(withBreaks.replace(/<[^>]+>/g, ' ')));
}

function sanitizePageName(value) {
  return String(value || '')
    .replace(/^\.?\//, '')
    .replace(/\.html$/, '')
    .trim();
}

function pageFile(packageKey, pageName) {
  return path.join(sourceRoot, PACKAGE_META[packageKey].wikiPath, `${pageName}.html`);
}

function readPage(packageKey, pageName) {
  const file = pageFile(packageKey, pageName);
  if (!fs.existsSync(file)) {
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function extractSectionHtml(html, sectionIds) {
  for (const sectionId of sectionIds) {
    const pattern = new RegExp(
      `<h2[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?<\\/h2>([\\s\\S]*?)(?=<h2\\b|<hr\\b|<div class="viewtoolbar")`,
      'i'
    );
    const match = pattern.exec(html);
    if (match) {
      return match[1];
    }
  }
  return '';
}

function extractParagraphs(sectionHtml) {
  if (!sectionHtml) {
    return [];
  }
  const texts = [];
  const paragraphMatches = sectionHtml.match(/<(p|li)[^>]*>[\s\S]*?<\/\1>/gi) || [];
  paragraphMatches.forEach((chunk) => {
    const text = stripTags(chunk);
    if (text && text !== '(none.)') {
      texts.push(text);
    }
  });
  return texts;
}

function extractLinks(sectionHtml) {
  const links = [];
  if (!sectionHtml) {
    return links;
  }

  const linkMatches = sectionHtml.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of linkMatches) {
    const href = sanitizePageName(match[1]);
    const label = stripTags(match[2]);
    if (!href || !label) {
      continue;
    }
    links.push({href, label});
  }
  return links;
}

function extractFirstParagraphAfterH1(html) {
  const afterH1 = /<\/h1>([\s\S]*?)(?=<h2\b|<hr\b)/i.exec(html);
  if (!afterH1) {
    return '';
  }

  const paragraphs = afterH1[1].match(/<p>[\s\S]*?<\/p>/gi) || [];
  for (const paragraph of paragraphs) {
    const text = stripTags(paragraph);
    if (!text || /^Defined in\b/i.test(text)) {
      continue;
    }
    return text;
  }
  return '';
}

function extractHeaderInfo(html) {
  const section = extractSectionHtml(html, ['header-file']);
  const text = stripTags(section);
  const linkMatch = section.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  if (!text) {
    return {header: '', headerUrl: ''};
  }

  return {
    header: linkMatch ? stripTags(linkMatch[2]) : text.replace(/^Defined in\s+/i, ''),
    headerUrl: linkMatch ? decodeHtml(linkMatch[1]) : ''
  };
}

function extractCodeBlock(sectionHtml) {
  if (!sectionHtml) {
    return '';
  }
  const codeMatch = sectionHtml.match(/<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/i);
  if (!codeMatch) {
    return '';
  }
  return normalizeWhitespace(decodeHtml(codeMatch[1].replace(/<[^>]+>/g, '')));
}

function extractParameters(html) {
  const section = extractSectionHtml(html, ['function-parameters', 'parameters']);
  if (!section) {
    return [];
  }

  const rows = [];
  const rowMatches = section.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  for (const match of rowMatches) {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((entry) => stripTags(entry[1]));
    if (cells.length < 3) {
      continue;
    }
    rows.push({
      type: cells[0],
      name: cells[1],
      description: cells[2]
    });
  }
  return rows;
}

function extractFooterCategories(html) {
  const footerMatch = /<hr\s*\/?>\s*<p>([\s\S]*?)<\/p>\s*(?:<div class="viewtoolbar">|<\/body>)/i.exec(html);
  if (!footerMatch) {
    return [];
  }
  const categoryMatches = footerMatch[1].matchAll(/<a[^>]+>([\s\S]*?)<\/a>/gi);
  return Array.from(categoryMatches, (match) => stripTags(match[1])).filter(Boolean);
}

function parseEnumValues(syntax) {
  const values = [];
  if (!syntax) {
    return values;
  }

  const lines = syntax.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^typedef\b/i.test(line) || line === '{' || /^}\s*/.test(line)) {
      continue;
    }
    const match = /^([A-Z0-9_]+)\s*(?:=\s*([^,\/]+))?\s*,?\s*(?:\/\*\*<\s*(.*?)\s*\*\/)?\s*$/.exec(line);
    if (!match) {
      continue;
    }
    values.push({
      name: match[1],
      value: normalizeWhitespace(match[2] || ''),
      description: normalizeWhitespace(match[3] || '')
    });
  }

  return values;
}

function ensureArabicSentence(text) {
  const clean = normalizeWhitespace(text).replace(/[.؟!]+$/g, '').trim();
  return clean ? `${clean}.` : '';
}

function splitSdl3IdentifierWords(name) {
  const normalized = String(name || '')
    .replace(/^(SDL|IMG|TTF|MIX)_?/, '')
    .trim();

  if (!normalized) {
    return [];
  }

  if (normalized.includes('_')) {
    return normalized.split('_').filter(Boolean);
  }

  return normalized.match(/[A-Z]+(?=[A-Z][a-z0-9]|\b)|[A-Z]?[a-z]+|[0-9]+/g) || [normalized];
}

const SDL3_ENUM_WORD_MAP = {
  Abort: 'الإيقاف النهائي',
  Add: 'الإضافة',
  Added: 'الإضافة',
  Always: 'الدائم',
  App: 'التطبيق',
  Arrow: 'السهم',
  Audio: 'الصوت',
  Auto: 'التلقائي',
  Back: 'الخلفي',
  Break: 'نقطة توقف',
  Button: 'زر',
  Canceled: 'الإلغاء',
  Center: 'الوسط',
  Changed: 'التغيير',
  Close: 'الإغلاق',
  Color: 'اللون',
  Complete: 'الاكتمال',
  Continue: 'الاستمرار',
  Cursor: 'المؤشر',
  Current: 'الحالي',
  Date: 'التاريخ',
  Day: 'اليوم',
  Default: 'الافتراضي',
  Desktop: 'سطح المكتب',
  Display: 'الشاشة',
  Down: 'الهبوط',
  Error: 'الخطأ',
  Event: 'الحدث',
  Failure: 'الفشل',
  Filter: 'الترشيح',
  First: 'الأول',
  Focus: 'التركيز',
  Format: 'التنسيق',
  Full: 'الكامل',
  Fullscreen: 'ملء الشاشة',
  Get: 'السحب',
  Gained: 'الاكتساب',
  Hidden: 'الإخفاء',
  Hour: 'الساعة',
  Ignore: 'التجاهل',
  Invalid: 'غير صالح',
  IO: 'الإدخال والإخراج',
  Keyboard: 'لوحة المفاتيح',
  Landscape: 'الأفقي',
  Leave: 'المغادرة',
  Left: 'الأيسر',
  Letters: 'الحروف',
  Limited: 'المحدود',
  Locale: 'الإعدادات المحلية',
  Lost: 'الفقدان',
  Maximum: 'الأقصى',
  Metal: 'Metal',
  Minimized: 'التصغير',
  Mode: 'الوضع',
  Month: 'الشهر',
  Mouse: 'الفأرة',
  Moved: 'النقل',
  None: 'عدم التفعيل',
  Normal: 'العادي',
  Ok: 'الجاهزية',
  Orientation: 'الاتجاه',
  Peek: 'الفحص',
  Pixel: 'البكسل',
  Portrait: 'العمودي',
  Power: 'الطاقة',
  Progress: 'التقدم',
  Quit: 'الخروج',
  Read: 'القراءة',
  Requested: 'الطلب',
  Resized: 'تغيير الحجم',
  Restored: 'الاستعادة',
  Retry: 'إعادة المحاولة',
  Right: 'الأيمن',
  Safe: 'الآمن',
  Scale: 'المقياس',
  Screen: 'الشاشة',
  Shown: 'الإظهار',
  Size: 'الحجم',
  Success: 'النجاح',
  System: 'النظام',
  Task: 'المهمة',
  Text: 'النص',
  Theme: 'السمة',
  Thread: 'الخيط',
  Time: 'الوقت',
  Type: 'النوع',
  Unknown: 'غير المعروف',
  Usable: 'القابلة للاستخدام',
  Value: 'القيمة',
  Window: 'النافذة',
  Words: 'الكلمات',
  Write: 'الكتابة',
  Year: 'السنة',
  Fullscreen: 'ملء الشاشة',
  Flipped: 'المقلوب',
  U8: 'عينات 8 بت غير موقعة',
  S8: 'عينات 8 بت موقعة',
  S16LE: 'عينات 16 بت موقعة بترتيب بايتات صغير الطرفية',
  S16BE: 'عينات 16 بت موقعة بترتيب بايتات كبير الطرفية',
  S32LE: 'عينات 32 بت صحيحة بترتيب بايتات صغير الطرفية',
  S32BE: 'عينات 32 بت صحيحة بترتيب بايتات كبير الطرفية',
  F32LE: 'عينات 32 بت عائمة بترتيب بايتات صغير الطرفية',
  F32BE: 'عينات 32 بت عائمة بترتيب بايتات كبير الطرفية',
  RGB: 'RGB',
  YUV: 'YUV',
  SRGB: 'sRGB',
  HDR10: 'HDR10',
  JPEG: 'JPEG',
  BT601: 'BT.601',
  BT709: 'BT.709',
  BT2020: 'BT.2020'
};

function translateSdl3EnumWord(word) {
  const raw = String(word || '').trim();
  if (!raw) {
    return '';
  }

  const direct = SDL3_ENUM_WORD_MAP[raw];
  if (direct) {
    return direct;
  }

  const titleCase = /^[a-z]/.test(raw)
    ? raw.charAt(0).toUpperCase() + raw.slice(1)
    : raw;
  if (SDL3_ENUM_WORD_MAP[titleCase]) {
    return SDL3_ENUM_WORD_MAP[titleCase];
  }

  return raw;
}

function humanizeSdl3EnumValueName(valueName, enumName = '') {
  const valueWords = splitSdl3IdentifierWords(valueName);
  const enumWords = new Set(splitSdl3IdentifierWords(enumName).map((word) => word.toUpperCase()));
  const filtered = valueWords.filter((word) => !enumWords.has(String(word || '').toUpperCase()));
  const chosen = filtered.length ? filtered : valueWords;
  return chosen
    .map((word) => translateSdl3EnumWord(word))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSdl3EnumValueContext(enumName) {
  const name = String(enumName || '');
  if (name === 'SDL_AppResult') return 'دوال callback في نظام main callbacks';
  if (name === 'SDL_EnumerationResult') return 'ردود نداء التعداد في SDL';
  if (name === 'SDL_AsyncIOResult') return 'نتائج طلبات SDL_AsyncIO';
  if (name === 'SDL_AsyncIOTaskType') return 'مهام SDL_AsyncIO';
  if (name === 'IMG_AnimationDecoderStatus') return 'دورة فك الرسوم المتحركة في SDL3_image';
  if (name === 'SDL_AssertState') return 'معالجة assert داخل SDL';
  if (name === 'SDL_EventType') return 'الحقل type داخل SDL_Event';
  if (name === 'SDL_EventAction') return 'دوال إدارة طابور الأحداث';
  if (name === 'SDL_AudioFormat') return 'الحقل format في SDL_AudioSpec ومسارات الصوت';
  if (name === 'SDL_DateFormat') return 'تنسيق التاريخ في SDL';
  if (name === 'SDL_TimeFormat') return 'تنسيق الوقت في SDL';
  if (name === 'SDL_DisplayOrientation') return 'وصف اتجاه الشاشات';
  if (name === 'SDL_Capitalization') return 'سياسات الرسملة التلقائية للنص';
  if (name === 'SDL_SystemCursor') return 'اختيار مؤشر النظام';
  if (name === 'SDL_GLAttr') return 'خصائص سياق OpenGL قبل الإنشاء';
  if (name === 'SDL_ColorPrimaries') return 'وصف primaries اللونية في SDL';
  if (name === 'SDL_ColorRange') return 'وصف مدى الإشارة اللونية في SDL';
  if (name === 'SDL_Colorspace') return 'تعريف فضاءات الألوان في SDL';
  if (name === 'SDL_ChromaLocation') return 'وصف موقع عينات chroma في SDL';
  if (name === 'SDL_TransferCharacteristics') return 'خصائص تحويل الإشارة اللونية في SDL';
  if (name === 'SDL_MatrixCoefficients') return 'مصفوفات تحويل اللون في SDL';
  if (name === 'SDL_BlendFactor' || name === 'SDL_GPUBlendFactor') return 'بناء أوضاع المزج في SDL';
  if (name === 'SDL_BlendOperation' || name === 'SDL_GPUBlendOp') return 'بناء عمليات المزج في SDL';
  if (/^SDL_GPU/.test(name)) return 'بنى وإعدادات SDL_GPU';
  if (name === 'SDL_TextInputType') return 'تهيئة الإدخال النصي في SDL';
  if (name === 'SDL_TextureAccess') return 'إنشاء الخامات في SDL';
  if (name === 'SDL_TextureAddressMode') return 'عنونة الخامات في SDL';
  if (name === 'SDL_RendererLogicalPresentation') return 'العرض المنطقي في المصيّر';
  if (name === 'SDL_ScaleMode' || name === 'SDL_GPUFilter' || name === 'SDL_GPUSamplerMipmapMode') return 'ترشيح الخامات وأخذ العينات منها';
  if (name === 'SDL_IOWhence') return 'عمليات تغيير موضع القراءة على مجاري SDL';
  if (name === 'SDL_ProcessIO') return 'توصيل مجاري العملية الفرعية';
  if (name === 'SDL_Folder') return 'استدعاءات مجلدات النظام في SDL';
  if (name === 'SDL_PathType') return 'فحص نوع المسار';
  if (name === 'SDL_PowerState') return 'الاستعلام عن حالة الطاقة';
  if (name === 'SDL_IOStatus') return 'حالة مجرى SDL_IO';
  if (name === 'SDL_ProgressState') return 'حالة عمليات التقدم في SDL';
  if (name === 'SDL_ThreadState') return 'حالة الخيوط في SDL';
  if (name === 'SDL_SystemTheme') return 'وصف سمة النظام';
  return `التعداد ${name || 'الحالي'}`;
}

function buildSdl3EnumValueGenericDescription(enumItem, value) {
  const enumName = String(enumItem?.name || '');
  const label = humanizeSdl3EnumValueName(value?.name || '', enumName) || 'الحالة أو الخيار المقصود';
  const context = getSdl3EnumValueContext(enumName);
  const returnLike = /(?:Result|Status|State|PathType|PowerState|IOStatus|ThreadState)$/.test(enumName)
    || enumName === 'IMG_AnimationDecoderStatus';

  return ensureArabicSentence(returnLike
    ? `تعاد هذه القيمة عندما تكون ${label} هي الحالة الفعلية في ${context}، وعند ظهورها يعتمد SDL أو التطبيق هذا المسار في المعالجة اللاحقة`
    : `تشير هذه القيمة إلى ${label}، وتُستخدم داخل ${context} ليعرف SDL هذا الاختيار أو هذه الحالة عند القراءة أو المقارنة`
  );
}

function localizeSdl3EventTypeValue(raw) {
  if (!raw) {
    return '';
  }

  if (/^Unused \(do not remove\)$/i.test(raw)) {
    return 'تشير هذه القيمة إلى رمز حدث محجوز داخل SDL_EventType للمحافظة على التوافق، ولا يفترض بالتطبيق التعامل معه كحدث فعلي.';
  }
  if (/^User-requested quit$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يطلب المستخدم إنهاء التطبيق، وعند ظهورها يبدأ مسار الإغلاق المعتاد.';
  }
  if (/^The user's locale preferences have changed\.?$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تتغير تفضيلات اللغة أو الإعدادات المحلية للمستخدم، وعندها يستطيع التطبيق تحديث النصوص أو التنسيق المعتمد.';
  }
  if (/^The system theme changed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تتغير سمة النظام، وعند ظهورها يستطيع التطبيق تحديث الألوان أو الأصول المتوافقة مع السمة الجديدة.';
  }
  if (/^Display orientation has changed to data1$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير اتجاه الشاشة، وتضع SDL الاتجاه الجديد في data1 حتى يتمكن التطبيق من تعديل العرض وفق الوضع الفعلي.';
  }
  if (/^Display has been added to the system$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تكتشف SDL إضافة شاشة جديدة إلى النظام، وعند ظهورها يستطيع التطبيق إعادة تعداد الشاشات المتاحة.';
  }
  if (/^Display has been removed from the system$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تختفي شاشة من النظام، وعند ظهورها يجب تحديث الموارد أو القوائم المرتبطة بهذه الشاشة.';
  }
  if (/^Display has changed position$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير موضع الشاشة داخل ترتيب الشاشات، وعند ظهورها يستطيع التطبيق إعادة حساب المواضع المعتمدة على الشاشات.';
  }
  if (/^Display has changed desktop mode$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير وضع سطح المكتب للشاشة، وعند ظهورها يمكن للتطبيق إعادة قراءة خصائص العرض الحالية.';
  }
  if (/^Display has changed current mode$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير وضع العرض الحالي للشاشة، وعند ظهورها يجب على التطبيق تحديث ما يعتمد على الدقة أو التردد.';
  }
  if (/^Display has changed content scale$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير مقياس المحتوى للشاشة، وعند ظهورها يستطيع التطبيق تعديل التحجيم أو حسابات الواجهة.';
  }
  if (/^Display has changed usable bounds$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تتغير الحدود القابلة للاستخدام للشاشة، وعند ظهورها يمكن للتطبيق تحديث مناطق العرض المسموح بها.';
  }
  if (/^Window has been shown$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تصبح النافذة معروضة، وعند ظهورها يفهم التطبيق أن النافذة دخلت حالة الإظهار.';
  }
  if (/^Window has been hidden$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تُخفى النافذة، وعند ظهورها يفهم التطبيق أن حالة الإظهار تغيرت إلى الإخفاء.';
  }
  if (/^Window has been moved to data1,\s*data2$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تنتقل النافذة إلى الموضع الجديد المحدد في data1 وdata2، وعند ظهورها يستطيع التطبيق تحديث ما يعتمد على الإحداثيات.';
  }
  if (/^Window has been resized to data1xdata2$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير حجم النافذة إلى الأبعاد الموجودة في data1 وdata2، وعند ظهورها يجب تحديث ما يعتمد على مساحة الرسم.';
  }
  if (/^The pixel size of the window has changed to data1xdata2$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير الحجم البكسلي الفعلي للنافذة إلى data1 وdata2، وعند ظهورها يجب إعادة ضبط الموارد الحساسة للكثافة البكسلية.';
  }
  if (/^The pixel size of a Metal view associated with the window has changed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير الحجم البكسلي لعرض Metal المرتبط بالنافذة، وعند ظهورها يجب تحديث الموارد التي تعتمد على أبعاد هذا العرض.';
  }
  if (/^Window has been minimized$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تدخل النافذة حالة التصغير، وعند ظهورها يستطيع التطبيق تقليل العمل الرسومي أو إيقافه مؤقتًا.';
  }
  if (/^Window has been maximized$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تدخل النافذة حالة التكبير، وعند ظهورها يمكن للتطبيق إعادة حساب التخطيط أو مساحة الرسم.';
  }
  if (/^Window has been restored to normal size and position$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تعود النافذة إلى حجمها وموضعها الطبيعيين، وعند ظهورها يستطيع التطبيق استئناف التخطيط المعتاد.';
  }
  if (/^Window has gained mouse focus$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تكتسب النافذة تركيز الفأرة، وعند ظهورها يفهم التطبيق أن إدخال الفأرة أصبح موجَّهًا إليها.';
  }
  if (/^Window has lost mouse focus$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تفقد النافذة تركيز الفأرة، وعند ظهورها يستطيع التطبيق إيقاف التفاعلات المعتمدة على هذا التركيز.';
  }
  if (/^Window has gained keyboard focus$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تكتسب النافذة تركيز لوحة المفاتيح، وعند ظهورها تصبح مدخلات المفاتيح موجَّهة إليها.';
  }
  if (/^Window has lost keyboard focus$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تفقد النافذة تركيز لوحة المفاتيح، وعند ظهورها يجب ألا يفترض التطبيق استمرار استقبال المفاتيح منها.';
  }
  if (/^The window manager requests that the window be closed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يطلب مدير النوافذ إغلاق النافذة، وعند ظهورها يبدأ التطبيق عادة مسار الإنهاء أو طلب التأكيد.';
  }
  if (/^Window had a hit test that wasn't SDL_HITTEST_NORMAL$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يعيد اختبار مناطق النافذة قيمة غير SDL_HITTEST_NORMAL، وعند ظهورها يفهم التطبيق أن التفاعل أصاب منطقة خاصة مثل الحواف أو منطقة السحب.';
  }
  if (/^The ICC profile of the window's display has changed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير ملف ICC الخاص بالشاشة التي تعرض النافذة، وعند ظهورها يمكن للتطبيق تحديث إدارة الألوان.';
  }
  if (/^Window has been moved to display data1$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تنتقل النافذة إلى شاشة أخرى يحددها data1، وعند ظهورها يستطيع التطبيق تحديث ما يعتمد على الشاشة الحالية.';
  }
  if (/^Window display scale has been changed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما يتغير مقياس عرض النافذة، وعند ظهورها يجب تحديث التحجيم أو الأصول الرسومية عند الحاجة.';
  }
  if (/^The window safe area has been changed$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تتغير المنطقة الآمنة للنافذة، وعند ظهورها يستطيع التطبيق إعادة ضبط عناصر الواجهة لتفادي المناطق المحجوبة.';
  }
  if (/^The window has been occluded$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تصبح النافذة محجوبة عن الرؤية، وعند ظهورها قد يختار التطبيق تقليل العمل غير الضروري.';
  }
  if (/^The window has entered fullscreen mode$/i.test(raw)) {
    return 'تعاد هذه القيمة في الحقل type من SDL_Event عندما تدخل النافذة وضع ملء الشاشة، وعند ظهورها يستطيع التطبيق تحديث التخطيط أو الموارد المرتبطة بهذا الوضع.';
  }
  return '';
}

function localizeSdl3AudioFormatValue(valueName) {
  const name = String(valueName || '');
  if (name === 'SDL_AUDIO_UNKNOWN') {
    return 'تشير هذه القيمة إلى أن تنسيق الصوت غير محدد بعد، وتستخدمها SDL عندما لا تملك صيغة عينات صالحة يمكن الاعتماد عليها في هذا الموضع.';
  }
  const formatMap = {
    SDL_AUDIO_U8: 'عينات صوتية غير موقعة بعرض 8 بت',
    SDL_AUDIO_S8: 'عينات صوتية موقعة بعرض 8 بت',
    SDL_AUDIO_S16LE: 'عينات صوتية موقعة بعرض 16 بت وبترتيب بايتات صغير الطرفية',
    SDL_AUDIO_S16BE: 'عينات صوتية موقعة بعرض 16 بت وبترتيب بايتات كبير الطرفية',
    SDL_AUDIO_S32LE: 'عينات صوتية صحيحة بعرض 32 بت وبترتيب بايتات صغير الطرفية',
    SDL_AUDIO_S32BE: 'عينات صوتية صحيحة بعرض 32 بت وبترتيب بايتات كبير الطرفية',
    SDL_AUDIO_F32LE: 'عينات صوتية عائمة بعرض 32 بت وبترتيب بايتات صغير الطرفية',
    SDL_AUDIO_F32BE: 'عينات صوتية عائمة بعرض 32 بت وبترتيب بايتات كبير الطرفية'
  };
  const meaning = formatMap[name];
  if (!meaning) {
    return '';
  }
  return `تشير هذه القيمة إلى أن SDL يفسر البيانات الصوتية على أنها ${meaning}، وتُستخدم عادة في الحقل format من SDL_AudioSpec وعند التحقق من توافق مسار الصوت.`;
}

function localizeSdl3ColorStandardReference(raw) {
  return normalizeWhitespace(String(raw || ''))
    .replace(/^The default colorspace for RGB surfaces if no colorspace is specified\.?$/i, 'فضاء اللون الافتراضي لأسطح RGB عندما لا يحدد التطبيق فضاء لون صريحًا')
    .replace(/^The default colorspace for YUV surfaces if no colorspace is specified\.?$/i, 'فضاء اللون الافتراضي لأسطح YUV عندما لا يحدد التطبيق فضاء لون صريحًا')
    .replace(/^Equivalent to\s+/i, 'يعادل ')
    .replace(/\bfunctionally the same as\b/gi, 'وهو مطابق وظيفيًا لـ')
    .replace(/\bGeneric film\b/gi, 'فيلم عام')
    .replace(/\bcolor filters using Illuminant C\b/gi, 'مرشحات لونية تستخدم الإضاءة المرجعية Illuminant C')
    .replace(/\bRec\.\s*/g, 'المرجع ')
    .replace(/\bExtended Colour Gamut\b/gi, 'نطاق لوني موسع')
    .replace(/known as\s+"?hybrid log-gamma"?\s+\(HLG\)/gi, 'المعروف باسم جاما لوغاريتمي هجين (HLG)')
    .replace(/\bfor 10-bit system\b/gi, 'لنظام 10 بت')
    .replace(/\bfor 12-bit system\b/gi, 'لنظام 12 بت')
    .replace(/\bfor 10-, 12-, 14- and 16-bit systems\b/gi, 'لأنظمة 10 و12 و14 و16 بت')
    .replace(/\bor\b/gi, 'أو')
    .replace(/\bnon-constant luminance\b/gi, 'إضاءة غير ثابتة')
    .replace(/\bconstant luminance\b/gi, 'إضاءة ثابتة')
    .replace(/\bSystem M\b/g, 'النظام M')
    .replace(/\bSystem B,\s*G\b/g, 'النظام B وG')
    .replace(/\bTech\./g, 'المعيار')
    .replace(/\bTitle\b/g, 'العنوان')
    .trim();
}

function localizeSdl3SystemCursorValue(valueName) {
  const mapping = {
    SDL_SYSTEM_CURSOR_DEFAULT: 'تشير هذه القيمة إلى مؤشر النظام الافتراضي، ويظهر عادة كسهم عادي عندما لا يطلب السياق شكلًا متخصصًا.',
    SDL_SYSTEM_CURSOR_TEXT: 'تشير هذه القيمة إلى مؤشر تحرير النص، ويظهر عادة بشكل عمود نصي عندما يكون الإدخال النصي هو التفاعل الأساسي.',
    SDL_SYSTEM_CURSOR_WAIT: 'تشير هذه القيمة إلى مؤشر انتظار يبين أن التطبيق أو العملية الحالية مشغولة ولا تزال قيد التنفيذ.',
    SDL_SYSTEM_CURSOR_CROSSHAIR: 'تشير هذه القيمة إلى مؤشر تقاطع دقيق يُستخدم عادة في المواضع التي تحتاج تحديد نقطة أو موضع بدقة.',
    SDL_SYSTEM_CURSOR_PROGRESS: 'تشير هذه القيمة إلى مؤشر انشغال مع بقاء التفاعل ممكنًا، فيفهم المستخدم أن التطبيق يعمل لكنه لم يتوقف.',
    SDL_SYSTEM_CURSOR_NWSE_RESIZE: 'تشير هذه القيمة إلى مؤشر تغيير الحجم على المحور القطري الشمالي الغربي/الجنوبي الشرقي.',
    SDL_SYSTEM_CURSOR_NESW_RESIZE: 'تشير هذه القيمة إلى مؤشر تغيير الحجم على المحور القطري الشمالي الشرقي/الجنوبي الغربي.',
    SDL_SYSTEM_CURSOR_EW_RESIZE: 'تشير هذه القيمة إلى مؤشر تغيير الحجم الأفقي بين الغرب والشرق.',
    SDL_SYSTEM_CURSOR_NS_RESIZE: 'تشير هذه القيمة إلى مؤشر تغيير الحجم العمودي بين الشمال والجنوب.',
    SDL_SYSTEM_CURSOR_MOVE: 'تشير هذه القيمة إلى مؤشر حركة رباعي الاتجاهات يدل على أن العنصر أو النافذة يمكن نقلها.',
    SDL_SYSTEM_CURSOR_NOT_ALLOWED: 'تشير هذه القيمة إلى مؤشر المنع الذي يوضح أن هذا التفاعل غير مسموح في الموضع الحالي.',
    SDL_SYSTEM_CURSOR_POINTER: 'تشير هذه القيمة إلى مؤشر يشير عادة إلى رابط أو عنصر قابل للنقر المباشر.'
  };
  return mapping[String(valueName || '')] || '';
}

function getSdl3GlAttrChannelLabel(rawChannel) {
  const map = {
    red: 'الحمراء',
    green: 'الخضراء',
    blue: 'الزرقاء',
    alpha: 'ألفا'
  };
  return map[String(rawChannel || '').toLowerCase()] || rawChannel;
}

function localizeSdl3GlAttrValue(raw, valueName) {
  const description = normalizeWhitespace(String(raw || ''));
  const label = humanizeSdl3EnumValueName(valueName, 'SDL_GLAttr') || 'هذه الخاصية';
  let match = /^the minimum number of bits for the (red|green|blue|alpha) channel of the color buffer; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تضبط الحد الأدنى لعدد البتات في القناة ${getSdl3GlAttrChannelLabel(match[1])} من مخزن اللون قبل إنشاء سياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[2]}.`;
  }

  match = /^the minimum number of bits for the (red|green|blue|alpha) channel of the accumulation buffer; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تضبط الحد الأدنى لعدد البتات في القناة ${getSdl3GlAttrChannelLabel(match[1])} من مخزن التجميع قبل إنشاء سياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[2]}.`;
  }

  match = /^the minimum number of bits for frame buffer size; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تطلب من SDL حدًا أدنى لحجم مخزن الإطار قبل إنشاء سياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  match = /^the minimum number of bits in the (depth|stencil) buffer; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تطلب من SDL حدًا أدنى لعدد البتات في مخزن ${match[1] === 'depth' ? 'العمق' : 'الاستنسل'} قبل إنشاء سياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[2]}.`;
  }

  if (/^whether the output is single or double buffered; defaults to double buffering on\.?$/i.test(description)) {
    return 'تشير هذه القيمة إلى الخاصية التي تحدد ما إذا كان سياق OpenGL سيستخدم مخزنًا واحدًا أم مخزنين للتبديل، والقيمة الافتراضية هي تفعيل التخزين المزدوج.';
  }

  match = /^whether to set the state of debug flag for the context; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تطلب من SDL إنشاء سياق OpenGL مع علم التصحيح بالحالة المطلوبة. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  match = /^OpenGL context major version; default is ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تحدد رقم الإصدار الرئيسي المطلوب لسياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  match = /^OpenGL context minor version; default is ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تحدد رقم الإصدار الفرعي المطلوب لسياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  match = /^some combination of 0 or more of elements of the SDL_GLContextFlag enumeration; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تجمع رايات SDL_GLContextFlag المطلوب تطبيقها على سياق OpenGL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  if (/^type of GL context \(core, compatibility, ES\)\. See SDL_GLProfile; default value depends on platform\.?$/i.test(description)) {
    return 'تشير هذه القيمة إلى الخاصية التي تحدد ملف تعريف سياق OpenGL المطلوب، مثل الملف المركزي أو التوافقي أو ES، بينما تعتمد القيمة الافتراضية على المنصة.';
  }

  match = /^OpenGL context sharing; defaults to ([^.;]+)\.?$/i.exec(description);
  if (match) {
    return `تشير هذه القيمة إلى الخاصية التي تضبط مشاركة الموارد بين سياقات OpenGL داخل SDL. وإذا لم تضبطها يدويًا فالقيمة الافتراضية هي ${match[1]}.`;
  }

  return ensureArabicSentence(`تشير هذه القيمة إلى خاصية من خصائص SDL_GL_SetAttribute تتعلق بـ ${label}، وتقرأها SDL قبل إنشاء سياق OpenGL لتحديد الإعداد المناسب لهذا المسار`);
}

function localizeSdl3EnumValueDescription(enumItem, value) {
  const enumName = String(enumItem?.name || '');
  const valueName = String(value?.name || '');
  const raw = normalizeWhitespace(value?.description || '');
  const context = getSdl3EnumValueContext(enumName);

  const exact = {
    'SDL_AppResult:SDL_APP_CONTINUE': 'تعاد هذه القيمة من دالة رد نداء في نظام main callbacks للإشارة إلى أن SDL يجب أن تتابع تشغيل التطبيق وأن تستمر في استدعاء دورة التنفيذ التالية.',
    'SDL_AppResult:SDL_APP_SUCCESS': 'تعاد هذه القيمة من دالة رد نداء في نظام main callbacks للإشارة إلى أن التطبيق أنهى التنفيذ بنجاح، فتُنهي SDL حلقة main callbacks وتغلق التطبيق بحالة نجاح.',
    'SDL_AppResult:SDL_APP_FAILURE': 'تعاد هذه القيمة من دالة رد نداء في نظام main callbacks للإشارة إلى أن التطبيق أنهى التنفيذ بحالة فشل، فتُنهي SDL حلقة main callbacks وتغلق التطبيق بحالة خطأ.',
    'SDL_EnumerationResult:SDL_ENUM_CONTINUE': 'تعاد هذه القيمة من دالة رد نداء أثناء التعداد لكي تواصل SDL المرور على بقية العناصر المتاحة في هذا المسار.',
    'SDL_EnumerationResult:SDL_ENUM_SUCCESS': 'تعاد هذه القيمة من دالة رد نداء أثناء التعداد لكي توقف SDL عملية التعداد وتعتبرها منتهية بنجاح.',
    'SDL_EnumerationResult:SDL_ENUM_FAILURE': 'تعاد هذه القيمة من دالة رد نداء أثناء التعداد لكي توقف SDL عملية التعداد وتعتبرها منتهية بفشل.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_INVALID': 'تعاد هذه القيمة عندما يكون مفكك الرسوم المتحركة غير صالح، فلا تتابع SDL3_image فك الإطار التالي من هذا المورد.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_OK': 'تعاد هذه القيمة عندما يكون مفكك الرسوم المتحركة جاهزًا لفك الإطار التالي، ويمكن متابعة دورة القراءة المعتادة.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_FAILED': 'تعاد هذه القيمة عندما يفشل مفكك الرسوم المتحركة في فك إطار جديد، وعندها يجب فحص SDL_GetError() لمعرفة سبب الفشل.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_COMPLETE': 'تعاد هذه القيمة عندما لا تبقى إطارات إضافية داخل مفكك الرسوم المتحركة، فتفهم SDL3_image أو التطبيق أن التسلسل انتهى.',
    'SDL_AssertState:SDL_ASSERTION_RETRY': 'تشير هذه القيمة إلى أن SDL تعيد تنفيذ عبارة التأكيد الحالية فورًا بدل متابعة التنفيذ أو إنهاء البرنامج.',
    'SDL_AssertState:SDL_ASSERTION_BREAK': 'تشير هذه القيمة إلى أن SDL تطلب من المصحح التوقف عند عبارة التأكيد الحالية عبر نقطة توقف.',
    'SDL_AssertState:SDL_ASSERTION_ABORT': 'تشير هذه القيمة إلى أن SDL تنهي البرنامج عند معالجة عبارة التأكيد الحالية.',
    'SDL_AssertState:SDL_ASSERTION_IGNORE': 'تشير هذه القيمة إلى أن SDL تتجاهل عبارة التأكيد الحالية مرة واحدة ثم تتابع التنفيذ.',
    'SDL_AssertState:SDL_ASSERTION_ALWAYS_IGNORE': 'تشير هذه القيمة إلى أن SDL تتجاهل عبارة التأكيد الحالية في المرات اللاحقة أيضًا ولا تعيد طرحها من جديد.',
    'SDL_AsyncIOResult:SDL_ASYNCIO_COMPLETE': 'تعاد هذه القيمة عندما يكتمل طلب SDL_AsyncIO بنجاح، وعند ظهورها يفهم التطبيق أن العملية انتهت من دون خطأ إضافي.',
    'SDL_AsyncIOResult:SDL_ASYNCIO_FAILURE': 'تعاد هذه القيمة عندما يفشل طلب SDL_AsyncIO، وعند ظهورها يجب فحص SDL_GetError() لمعرفة سبب الفشل قبل متابعة المعالجة.',
    'SDL_AsyncIOResult:SDL_ASYNCIO_CANCELED': 'تعاد هذه القيمة عندما يُلغى طلب SDL_AsyncIO قبل اكتماله، وعند ظهورها لا تكون العملية قد وصلت إلى نتيجتها الطبيعية.',
    'SDL_AsyncIOTaskType:SDL_ASYNCIO_TASK_READ': 'تشير هذه القيمة إلى أن مهمة SDL_AsyncIO الحالية تنفذ قراءة من المصدر المرتبط، لذلك يعاملها النظام كعملية إدخال بيانات.',
    'SDL_AsyncIOTaskType:SDL_ASYNCIO_TASK_WRITE': 'تشير هذه القيمة إلى أن مهمة SDL_AsyncIO الحالية تنفذ كتابة إلى الوجهة المرتبطة، لذلك يعاملها النظام كعملية إخراج بيانات.',
    'SDL_AsyncIOTaskType:SDL_ASYNCIO_TASK_CLOSE': 'تشير هذه القيمة إلى أن مهمة SDL_AsyncIO الحالية تنفذ إغلاقًا للمورد أو المجرى المرتبط بعد اكتمال العمل عليه.',
    'SDL_EventAction:SDL_ADDEVENT': 'تشير هذه القيمة إلى أن SDL تضيف الأحداث الجديدة إلى نهاية طابور الأحداث عند تنفيذ هذا الطلب.',
    'SDL_EventAction:SDL_PEEKEVENT': 'تشير هذه القيمة إلى أن SDL تفحص الأحداث من مقدمة الطابور من دون سحبها أو إزالتها منه.',
    'SDL_EventAction:SDL_GETEVENT': 'تشير هذه القيمة إلى أن SDL تسحب الأحداث من مقدمة الطابور وتزيلها منه أثناء القراءة.',
    'SDL_Capitalization:SDL_CAPITALIZE_NONE': 'تشير هذه القيمة إلى أن SDL لا تطبق أي رسملة تلقائية على النص المدخل في هذا المسار.',
    'SDL_Capitalization:SDL_CAPITALIZE_SENTENCES': 'تشير هذه القيمة إلى أن SDL ترسمل أول حرف من كل جملة عند تطبيق سياسة الرسملة التلقائية.',
    'SDL_Capitalization:SDL_CAPITALIZE_WORDS': 'تشير هذه القيمة إلى أن SDL ترسمل أول حرف من كل كلمة عند تطبيق سياسة الرسملة التلقائية.',
    'SDL_Capitalization:SDL_CAPITALIZE_LETTERS': 'تشير هذه القيمة إلى أن SDL ترسمل جميع الحروف عند تطبيق سياسة الرسملة التلقائية.',
    'SDL_DateFormat:SDL_DATE_FORMAT_YYYYMMDD': 'تشير هذه القيمة إلى أن SDL ترتب مكونات التاريخ بصيغة سنة/شهر/يوم عند عرض التاريخ أو تفسيره في هذا السياق.',
    'SDL_DateFormat:SDL_DATE_FORMAT_DDMMYYYY': 'تشير هذه القيمة إلى أن SDL ترتب مكونات التاريخ بصيغة يوم/شهر/سنة عند عرض التاريخ أو تفسيره في هذا السياق.',
    'SDL_DateFormat:SDL_DATE_FORMAT_MMDDYYYY': 'تشير هذه القيمة إلى أن SDL ترتب مكونات التاريخ بصيغة شهر/يوم/سنة عند عرض التاريخ أو تفسيره في هذا السياق.',
    'SDL_TimeFormat:SDL_TIME_FORMAT_24HR': 'تشير هذه القيمة إلى أن SDL تعرض الوقت أو تفسره وفق نظام 24 ساعة في هذا السياق.',
    'SDL_TimeFormat:SDL_TIME_FORMAT_12HR': 'تشير هذه القيمة إلى أن SDL تعرض الوقت أو تفسره وفق نظام 12 ساعة في هذا السياق.'
  };

  const exactKey = `${enumName}:${valueName}`;
  if (exact[exactKey]) {
    return exact[exactKey];
  }

  if (enumName === 'SDL_EventType') {
    const localized = localizeSdl3EventTypeValue(raw);
    if (localized) {
      return localized;
    }
  }

  if (enumName === 'SDL_AudioFormat') {
    const localized = localizeSdl3AudioFormatValue(valueName);
    if (localized) {
      return localized;
    }
  }

  if (enumName === 'SDL_SystemCursor') {
    const localized = localizeSdl3SystemCursorValue(valueName);
    if (localized) {
      return localized;
    }
  }

  if (enumName === 'SDL_GLAttr') {
    const localized = localizeSdl3GlAttrValue(raw, valueName);
    if (localized) {
      return localized;
    }
  }

  if (enumName === 'SDL_DisplayOrientation') {
    if (valueName === 'SDL_ORIENTATION_UNKNOWN') {
      return 'تشير هذه القيمة إلى أن SDL لم تستطع تحديد اتجاه الشاشة الحالي، لذلك لا يجوز افتراض وضع عرض محدد من خلالها.';
    }
    if (valueName === 'SDL_ORIENTATION_LANDSCAPE') {
      return 'تشير هذه القيمة إلى أن SDL تصف الشاشة على أنها في الوضع الأفقي القياسي بالنسبة إلى الوضع العمودي المرجعي.';
    }
    if (valueName === 'SDL_ORIENTATION_LANDSCAPE_FLIPPED') {
      return 'تشير هذه القيمة إلى أن SDL تصف الشاشة على أنها في وضع أفقي مقلوب بالنسبة إلى الاتجاه المرجعي.';
    }
    if (valueName === 'SDL_ORIENTATION_PORTRAIT') {
      return 'تشير هذه القيمة إلى أن SDL تصف الشاشة على أنها في الوضع العمودي القياسي.';
    }
    if (valueName === 'SDL_ORIENTATION_PORTRAIT_FLIPPED') {
      return 'تشير هذه القيمة إلى أن SDL تصف الشاشة على أنها في وضع عمودي مقلوب.';
    }
  }

  if (enumName === 'SDL_ColorRange') {
    if (valueName === 'SDL_COLOR_RANGE_LIMITED') {
      return 'تشير هذه القيمة إلى أن SDL يتعامل مع الإشارة اللونية على أنها ضمن مدى محدود، لذلك لا تستخدم القنوات كامل المجال العددي المتاح.';
    }
    if (valueName === 'SDL_COLOR_RANGE_FULL') {
      return 'تشير هذه القيمة إلى أن SDL يتعامل مع الإشارة اللونية على أنها ضمن مدى كامل، لذلك تستفيد القنوات من المجال العددي الكامل المتاح.';
    }
  }

  if (enumName === 'SDL_Colorspace') {
    const label = humanizeSdl3EnumValueName(valueName, enumName) || valueName;
    const reference = localizeSdl3ColorStandardReference(raw);
    const referenceNote = reference ? ` والمرجع القياسي المذكور لها هو ${reference}` : '';
    return ensureArabicSentence(`تشير هذه القيمة إلى فضاء لون أو وصفًا لونيًا باسم ${label}، وتستخدمه SDL لتفسير نوع اللون ونطاقه ومنحنى النقل ومصفوفة التحويل في هذا السياق${referenceNote}`);
  }

  if (enumName === 'SDL_ColorPrimaries') {
    if (valueName === 'SDL_COLOR_PRIMARIES_UNKNOWN') {
      return 'تشير هذه القيمة إلى أن SDL لا يملك تعريفًا معروفًا للألوان الأساسية في هذا الوصف اللوني.';
    }
    if (valueName === 'SDL_COLOR_PRIMARIES_UNSPECIFIED') {
      return 'تشير هذه القيمة إلى أن وصف الألوان الأساسية تُرك غير محدد، لذلك لا تعتمد SDL معيارًا صريحًا لهذا الجزء من الوصف اللوني.';
    }
    const label = humanizeSdl3EnumValueName(valueName, enumName) || valueName;
    const reference = localizeSdl3ColorStandardReference(raw);
    const referenceNote = reference ? ` والمرجع القياسي المذكور لها هو ${reference}` : '';
    return ensureArabicSentence(`تشير هذه القيمة إلى مجموعة ألوان أساسية باسم ${label}، وتعتمدها SDL لتفسير مواضع الألوان الأساسية في هذا الوصف اللوني${referenceNote}`);
  }

  if (enumName === 'SDL_TransferCharacteristics') {
    if (valueName === 'SDL_TRANSFER_CHARACTERISTICS_UNKNOWN') {
      return 'تشير هذه القيمة إلى أن SDL لا يملك منحنى نقل معروفًا لهذا الوصف اللوني.';
    }
    if (valueName === 'SDL_TRANSFER_CHARACTERISTICS_UNSPECIFIED') {
      return 'تشير هذه القيمة إلى أن منحنى النقل تُرك غير محدد، لذلك لا تعتمد SDL سلوك تحويل صريحًا لهذا الجزء من الوصف اللوني.';
    }
    const label = humanizeSdl3EnumValueName(valueName, enumName) || valueName;
    const reference = localizeSdl3ColorStandardReference(raw);
    const referenceNote = reference ? ` والمرجع القياسي المذكور لها هو ${reference}` : '';
    return ensureArabicSentence(`تشير هذه القيمة إلى منحنى نقل باسم ${label}، وتستخدمه SDL لتفسير العلاقة بين القيم المخزنة والإضاءة الفعلية عند قراءة هذا الوصف اللوني${referenceNote}`);
  }

  if (enumName === 'SDL_MatrixCoefficients') {
    if (valueName === 'SDL_MATRIX_COEFFICIENTS_UNSPECIFIED') {
      return 'تشير هذه القيمة إلى أن معاملات التحويل تُركت غير محددة، لذلك لا تعتمد SDL مصفوفة تحويل صريحة لهذا الوصف.';
    }
    const label = humanizeSdl3EnumValueName(valueName, enumName) || valueName;
    const reference = localizeSdl3ColorStandardReference(raw);
    const referenceNote = reference ? ` والمرجع القياسي المذكور لها هو ${reference}` : '';
    return ensureArabicSentence(`تشير هذه القيمة إلى معاملات تحويل باسم ${label}، وتستخدمها SDL لفهم كيفية تحويل مكونات اللون بين التمثيلات المرتبطة بهذا الوصف${referenceNote}`);
  }

  if (enumName === 'SDL_ChromaLocation') {
    const mapping = {
      SDL_CHROMA_LOCATION_NONE: 'تشير هذه القيمة إلى أن SDL يتعامل مع البيانات على أنها RGB من دون عينات لون فرعي منفصلة.',
      SDL_CHROMA_LOCATION_LEFT: 'تشير هذه القيمة إلى أن SDL يقرأ عينات اللون الفرعي على أنها مزاحة نحو الجهة اليسرى وفق التموضع القياسي لهذا النمط.',
      SDL_CHROMA_LOCATION_CENTER: 'تشير هذه القيمة إلى أن SDL يقرأ عينات اللون الفرعي من مركز المربع المرجعي المرتبط بها.',
      SDL_CHROMA_LOCATION_TOPLEFT: 'تشير هذه القيمة إلى أن SDL يقرأ عينات اللون الفرعي من موضع الزاوية العليا اليسرى للمجموعة المرجعية.'
    };
    if (mapping[valueName]) {
      return mapping[valueName];
    }
  }

  if (enumName === 'SDL_BlendFactor') {
    const mapping = {
      SDL_BLENDFACTOR_ZERO: 'تشير هذه القيمة إلى أن SDL يستخدم العامل الصفري في هذا الموضع من عملية المزج، فلا يضيف مساهمة من هذا الطرف.',
      SDL_BLENDFACTOR_ONE: 'تشير هذه القيمة إلى أن SDL يستخدم العامل الواحد الكامل في هذا الموضع من عملية المزج، فتنتقل المساهمة كما هي دون تخفيض.',
      SDL_BLENDFACTOR_SRC_COLOR: 'تشير هذه القيمة إلى أن SDL يستخدم مكونات لون المصدر نفسها كعامل مزج عند حساب اللون الناتج.',
      SDL_BLENDFACTOR_ONE_MINUS_SRC_COLOR: 'تشير هذه القيمة إلى أن SDL يستخدم متممة لون المصدر كعامل مزج عند حساب اللون الناتج.',
      SDL_BLENDFACTOR_SRC_ALPHA: 'تشير هذه القيمة إلى أن SDL يستخدم قيمة ألفا الخاصة بالمصدر كعامل مزج لكل القنوات.',
      SDL_BLENDFACTOR_ONE_MINUS_SRC_ALPHA: 'تشير هذه القيمة إلى أن SDL يستخدم متممة ألفا المصدر كعامل مزج لكل القنوات.',
      SDL_BLENDFACTOR_DST_COLOR: 'تشير هذه القيمة إلى أن SDL يستخدم مكونات لون الوجهة الحالية كعامل مزج في هذه العملية.',
      SDL_BLENDFACTOR_ONE_MINUS_DST_COLOR: 'تشير هذه القيمة إلى أن SDL يستخدم متممة لون الوجهة الحالية كعامل مزج في هذه العملية.',
      SDL_BLENDFACTOR_DST_ALPHA: 'تشير هذه القيمة إلى أن SDL يستخدم ألفا الوجهة الحالية كعامل مزج لكل القنوات.',
      SDL_BLENDFACTOR_ONE_MINUS_DST_ALPHA: 'تشير هذه القيمة إلى أن SDL يستخدم متممة ألفا الوجهة الحالية كعامل مزج لكل القنوات.'
    };
    if (mapping[valueName]) {
      return mapping[valueName];
    }
  }

  if (enumName === 'SDL_BlendOperation') {
    const mapping = {
      SDL_BLENDOPERATION_ADD: 'تشير هذه القيمة إلى أن SDL يجمع مساهمتي المصدر والوجهة عند تنفيذ عملية المزج.',
      SDL_BLENDOPERATION_SUBTRACT: 'تشير هذه القيمة إلى أن SDL يطرح مساهمة الوجهة من مساهمة المصدر عند تنفيذ عملية المزج.',
      SDL_BLENDOPERATION_REV_SUBTRACT: 'تشير هذه القيمة إلى أن SDL يطرح مساهمة المصدر من مساهمة الوجهة عند تنفيذ عملية المزج.',
      SDL_BLENDOPERATION_MINIMUM: 'تشير هذه القيمة إلى أن SDL يختار القيمة الدنيا بين المصدر والوجهة عند تنفيذ عملية المزج.',
      SDL_BLENDOPERATION_MAXIMUM: 'تشير هذه القيمة إلى أن SDL يختار القيمة العليا بين المصدر والوجهة عند تنفيذ عملية المزج.'
    };
    if (mapping[valueName]) {
      return mapping[valueName];
    }
  }

  if (raw && /^reserved$/i.test(raw)) {
    return 'تشير هذه القيمة إلى خانة محجوزة داخل هذا التعداد، وتبقيها SDL للمحافظة على التوافق مع بقية القيم.';
  }

  if (raw && /^Default cursor\. Usually an arrow\.?$/i.test(raw)) {
    return 'تشير هذه القيمة إلى مؤشر النظام الافتراضي، والذي يظهر عادةً بشكل سهم عند تفعيله.';
  }

  if (raw && /^Point filtering\.?$/i.test(raw)) {
    return ensureArabicSentence(`تشير هذه القيمة إلى استخدام أخذ عينات نقطي داخل ${context}، لذلك يعتمد SDL أقرب قيمة مباشرة عند القراءة أو التكبير`);
  }

  if (raw && /^Linear filtering\.?$/i.test(raw)) {
    return ensureArabicSentence(`تشير هذه القيمة إلى استخدام أخذ عينات خطي داخل ${context}، لذلك يعتمد SDL الاستيفاء بين القيم المجاورة عند القراءة أو التكبير`);
  }

  return buildSdl3EnumValueGenericDescription(enumItem, value);
}

function countSdl3ArabicWords(text) {
  return normalizeWhitespace(String(text || ''))
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function buildSdl3EnumValueCodeComment(enumItem, value) {
  const enumName = String(enumItem?.name || '');
  const valueName = String(value?.name || '');
  const localizedDescription = ensureArabicSentence(normalizeWhitespace(value?.description || ''));
  const label = humanizeSdl3EnumValueName(valueName, enumName) || 'الحالة المطلوبة';
  const context = getSdl3EnumValueContext(enumName);

  const exact = {
    'SDL_AppResult:SDL_APP_CONTINUE': 'تعاد هذه القيمة من رد نداء في نظام main callbacks لتطلب من SDL متابعة تشغيل التطبيق واستمرار الحلقة الرئيسية.',
    'SDL_AppResult:SDL_APP_SUCCESS': 'تعاد هذه القيمة من رد نداء في نظام main callbacks لتطلب من SDL إنهاء الحلقة وإغلاق التطبيق بحالة نجاح.',
    'SDL_AppResult:SDL_APP_FAILURE': 'تعاد هذه القيمة من رد نداء في نظام main callbacks لتطلب من SDL إنهاء الحلقة وإغلاق التطبيق بحالة فشل.',
    'SDL_EnumerationResult:SDL_ENUM_CONTINUE': 'تعاد هذه القيمة من رد نداء التعداد لتطلب من SDL متابعة المرور على بقية العناصر المتاحة في هذا المسار.',
    'SDL_EnumerationResult:SDL_ENUM_SUCCESS': 'تعاد هذه القيمة من رد نداء التعداد لتطلب من SDL إيقاف التعداد واعتباره منتهيًا بنجاح.',
    'SDL_EnumerationResult:SDL_ENUM_FAILURE': 'تعاد هذه القيمة من رد نداء التعداد لتطلب من SDL إيقاف التعداد واعتباره منتهيًا بفشل.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_INVALID': 'تعاد هذه القيمة عندما يكون مفكك الرسوم المتحركة غير صالح، فتوقف SDL3_image محاولة متابعة فك الإطارات.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_OK': 'تعاد هذه القيمة عندما يصبح مفكك الرسوم المتحركة جاهزًا، فتستطيع SDL3_image متابعة فك الإطار التالي.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_FAILED': 'تعاد هذه القيمة عندما يفشل فك إطار جديد، فتتوقف SDL3_image عن هذا المسار حتى يعالج التطبيق الخطأ.',
    'IMG_AnimationDecoderStatus:IMG_DECODER_STATUS_COMPLETE': 'تعاد هذه القيمة عندما تنتهي الإطارات المتاحة، فتفهم SDL3_image أن تسلسل الرسوم المتحركة اكتمل.',
    'SDL_EventAction:SDL_ADDEVENT': 'تشير هذه القيمة إلى أن SDL يضيف الأحداث الجديدة إلى نهاية الطابور عند تنفيذ هذا الطلب.',
    'SDL_EventAction:SDL_PEEKEVENT': 'تشير هذه القيمة إلى أن SDL يفحص مقدمة الطابور دون إزالة الأحداث منه أثناء هذا الطلب.',
    'SDL_EventAction:SDL_GETEVENT': 'تشير هذه القيمة إلى أن SDL يسحب الأحداث من مقدمة الطابور ويزيلها أثناء هذا الطلب.'
  };
  const exactKey = `${enumName}:${valueName}`;
  if (exact[exactKey]) {
    return exact[exactKey];
  }

  if (localizedDescription && countSdl3ArabicWords(localizedDescription) <= 25) {
    return localizedDescription;
  }

  const returnLike = /(?:Result|Status|State|PathType|PowerState|IOStatus|ThreadState)$/.test(enumName)
    || enumName === 'IMG_AnimationDecoderStatus';
  return ensureArabicSentence(returnLike
    ? `تعاد هذه القيمة عندما تكون ${label} هي الحالة الفعلية في ${context}، فيعتمد SDL هذا المسار بعدها`
    : `تشير هذه القيمة إلى ${label} داخل ${context}، ويقرأها SDL لاختيار هذا السلوك أو هذه الحالة`
  );
}

function localizeSdl3EnumSyntax(syntax, enumItem, values) {
  const source = String(syntax || '');
  if (!source || !Array.isArray(values) || !values.length) {
    return source;
  }

  const commentMap = new Map(
    values
      .filter((value) => value?.name)
      .map((value) => [value.name, buildSdl3EnumValueCodeComment(enumItem, value)])
  );

  return source
    .split('\n')
    .map((rawLine) => {
      const line = String(rawLine || '');
      const match = /^(\s*)([A-Z0-9_]+)(\s*(?:=\s*[^,\/]+)?\s*,?)(?:\s*\/\*\*<[\s\S]*?\*\/)?\s*$/.exec(line);
      if (!match) {
        return line;
      }
      const comment = commentMap.get(match[2]);
      if (!comment) {
        return line;
      }
      return `${match[1]}${match[2]}${match[3]} /**< ${comment} */`;
    })
    .join('\n');
}

function inferKind(categories, syntax) {
  if (/^\s*#define\b/i.test(syntax || '')) {
    return 'macro';
  }

  for (const category of categories) {
    if (ENTITY_KIND_MAP[category]) {
      return ENTITY_KIND_MAP[category];
    }
  }

  if (/^typedef\s+enum\b/i.test(syntax || '')) {
    return 'enum';
  }
  if (/\b[A-Z0-9_]+\s*\(/.test(syntax || '') && !/^typedef\b/i.test(syntax || '')) {
    return 'function';
  }
  return 'type';
}

function extractReferenceName(summaryText) {
  const match = /Please refer to\s+([A-Za-z0-9_]+)/i.exec(summaryText || '');
  return match ? match[1] : '';
}

function parseItemPage(packageKey, pageName, context) {
  const html = readPage(packageKey, pageName);
  if (!html) {
    return null;
  }

  const nameMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!nameMatch) {
    return null;
  }

  const name = stripTags(nameMatch[1]);
  const summary = extractFirstParagraphAfterH1(html);
  const headerInfo = extractHeaderInfo(html);
  const syntax = extractCodeBlock(extractSectionHtml(html, ['syntax']));
  const parameters = extractParameters(html);
  const returnValue = extractParagraphs(extractSectionHtml(html, ['return-value']))[0] || '';
  const remarks = extractParagraphs(extractSectionHtml(html, ['remarks']));
  const threadSafety = extractParagraphs(extractSectionHtml(html, ['thread-safety'])).join(' ');
  const version = extractParagraphs(extractSectionHtml(html, ['version']))[0] || '';
  const seeAlsoLinks = extractLinks(extractSectionHtml(html, ['see-also']));
  const categories = extractFooterCategories(html);
  const referenceName = extractReferenceName(summary);
  const kind = inferKind(categories, syntax);

  return {
    name,
    packageKey,
    packageName: PACKAGE_META[packageKey].packageName,
    packageDisplayName: PACKAGE_META[packageKey].displayName,
    packageDescription: PACKAGE_META[packageKey].description,
    categoryKey: context.categoryKey || '',
    categoryTitle: context.categoryTitle || PACKAGE_META[packageKey].displayName,
    categorySectionTitle: context.categorySectionTitle || '',
    kind,
    sourceCategories: categories,
    description: summary,
    header: headerInfo.header,
    headerUrl: headerInfo.headerUrl,
    syntax,
    parameters,
    returns: returnValue,
    remarks,
    threadSafety,
    version,
    seeAlso: seeAlsoLinks.map((entry) => sanitizePageName(entry.href)).filter(Boolean),
    seeAlsoLabels: seeAlsoLinks,
    referenceName,
    officialUrl: `${PACKAGE_META[packageKey].frontPageUrl.replace(/\/FrontPage$/, '')}/${encodeURIComponent(name)}`
  };
}

function parseCategoryPageItems(packageKey, pageName) {
  const html = readPage(packageKey, pageName);
  if (!html) {
    return {};
  }

  const result = {
    functions: [],
    datatypes: [],
    structs: [],
    enums: [],
    macros: []
  };

  const sectionMap = {
    functions: ['functions'],
    datatypes: ['datatypes'],
    structs: ['structs'],
    enums: ['enums'],
    macros: ['macros']
  };

  Object.entries(sectionMap).forEach(([key, ids]) => {
    const section = extractSectionHtml(html, ids);
    const links = extractLinks(section)
      .map((entry) => sanitizePageName(entry.href))
      .filter((entry) => entry && !entry.startsWith('Category') && !entry.startsWith('README'));
    result[key] = Array.from(new Set(links));
  });

  return result;
}

function parseCoreCategoryMeta() {
  const html = readPage('core', 'APIByCategory');
  if (!html) {
    throw new Error(`Missing SDL3/APIByCategory under ${sourceRoot}`);
  }

  const categories = [];
  const sectionMatches = html.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|<\/body>)/gi);
  for (const match of sectionMatches) {
    const sectionTitle = stripTags(match[2]);
    const body = match[3];
    const rowMatches = body.matchAll(/<tr[^>]*>\s*<td><a href="([^"]+)">([\s\S]*?)<\/a><\/td>\s*<td><a href="([^"]+)">([\s\S]*?)<\/a><\/td>\s*<\/tr>/gi);
    for (const row of rowMatches) {
      const categoryKey = sanitizePageName(row[1]);
      if (!categoryKey || !categoryKey.startsWith('Category')) {
        continue;
      }
      categories.push({
        categoryKey,
        categoryTitle: stripTags(row[2]),
        categorySectionTitle: sectionTitle,
        headerUrl: decodeHtml(row[3]),
        header: stripTags(row[4])
      });
    }
  }

  return categories;
}

function parseCategoryApiList(packageKey, pageName) {
  const html = readPage(packageKey, pageName);
  if (!html) {
    return [];
  }

  const listMatch = /<!-- BEGIN CATEGORY LIST[\s\S]*?-->([\s\S]*?)<!-- END CATEGORY LIST -->/i.exec(html);
  const scope = listMatch ? listMatch[1] : html;
  return extractLinks(scope)
    .map((entry) => sanitizePageName(entry.href))
    .filter((entry) => entry && !entry.startsWith('Category') && !entry.startsWith('QuickReference') && !entry.startsWith('README'));
}

function collectRequestedPages() {
  const pages = [];
  const seen = new Set();

  const pushPage = (packageKey, pageName, context) => {
    const normalized = sanitizePageName(pageName);
    if (!normalized || normalized.startsWith('Category') || normalized.startsWith('README')) {
      return;
    }
    const uniqueKey = `${packageKey}:${normalized}`;
    if (seen.has(uniqueKey)) {
      return;
    }
    seen.add(uniqueKey);
    pages.push({packageKey, pageName: normalized, context});
  };

  const coreCategories = parseCoreCategoryMeta();
  coreCategories.forEach((category) => {
    const items = parseCategoryPageItems('core', category.categoryKey);
    ['functions', 'datatypes', 'structs', 'enums', 'macros'].forEach((groupKey) => {
      items[groupKey].forEach((pageName) => {
        pushPage('core', pageName, category);
      });
    });
  });

  [
    ['CategoryAPIFunction', 'Core Functions'],
    ['CategoryAPIDatatype', 'Core Datatypes'],
    ['CategoryAPIStruct', 'Core Structs'],
    ['CategoryAPIEnum', 'Core Enums'],
    ['CategoryAPIMacro', 'Core Macros']
  ].forEach(([pageName, categoryTitle]) => {
    parseCategoryApiList('core', pageName).forEach((entry) => {
      pushPage('core', entry, {
        categoryKey: pageName,
        categoryTitle,
        categorySectionTitle: 'SDL3 API'
      });
    });
  });

  const imageItems = parseCategoryApiList('image', 'CategoryAPI');
  imageItems.forEach((pageName) => {
    pushPage('image', pageName, {
      categoryKey: 'CategoryAPI',
      categoryTitle: 'SDL3_image API',
      categorySectionTitle: 'SDL3_image'
    });
  });

  const mixerItems = parseCategoryPageItems('mixer', 'CategorySDLMixer');
  ['functions', 'datatypes', 'structs', 'enums', 'macros'].forEach((groupKey) => {
    mixerItems[groupKey].forEach((pageName) => {
      pushPage('mixer', pageName, {
        categoryKey: 'CategorySDLMixer',
        categoryTitle: 'SDL3_mixer API',
        categorySectionTitle: 'SDL3_mixer'
      });
    });
  });

  const ttfItems = parseCategoryApiList('ttf', 'CategoryAPI');
  ttfItems.forEach((pageName) => {
    pushPage('ttf', pageName, {
      categoryKey: 'CategoryAPI',
      categoryTitle: 'SDL3_ttf API',
      categorySectionTitle: 'SDL3_ttf'
    });
  });

  return pages;
}

function buildDerivedConstants(enumItems) {
  const constants = [];
  enumItems.forEach((item) => {
    (item.values || []).forEach((value) => {
      if (!value.name) {
        return;
      }
      constants.push({
        name: value.name,
        packageKey: item.packageKey,
        packageName: item.packageName,
        packageDisplayName: item.packageDisplayName,
        categoryKey: item.categoryKey,
        categoryTitle: item.categoryTitle,
        categorySectionTitle: item.categorySectionTitle,
        kind: 'constant',
        description: value.description || `Value of ${item.name}.`,
        value: value.value,
        parentEnum: item.name,
        officialUrl: `${PACKAGE_META[item.packageKey].frontPageUrl.replace(/\/FrontPage$/, '')}/${encodeURIComponent(value.name)}`,
        referenceName: item.name
      });
    });
  });
  return constants;
}

function sortByName(items) {
  return items.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'en'));
}

function buildData() {
  const requestedPages = collectRequestedPages();
  const entityData = {
    functions: [],
    types: [],
    enums: [],
    constants: [],
    macros: []
  };

  requestedPages.forEach(({packageKey, pageName, context}) => {
    const item = parseItemPage(packageKey, pageName, context);
    if (!item || !item.name) {
      return;
    }

    if (item.kind === 'constant') {
      return;
    }

    if (item.kind === 'function') {
      entityData.functions.push(item);
      return;
    }

    if (item.kind === 'enum') {
      item.values = parseEnumValues(item.syntax).map((value) => ({
        ...value,
        description: localizeSdl3EnumValueDescription(item, value)
      }));
      item.syntax = localizeSdl3EnumSyntax(item.syntax, item, item.values);
      entityData.enums.push(item);
      return;
    }

    if (item.kind === 'macro') {
      entityData.macros.push(item);
      return;
    }

    entityData.types.push(item);
  });

  entityData.constants = buildDerivedConstants(entityData.enums);

  OUTPUT_KIND_KEYS.forEach((key) => sortByName(entityData[key]));

  const packageMeta = {};
  Object.values(PACKAGE_META).forEach((pkg) => {
    const counts = {};
    OUTPUT_KIND_KEYS.forEach((key) => {
      counts[key] = entityData[key].filter((item) => item.packageKey === pkg.key).length;
    });
    packageMeta[pkg.key] = {
      ...pkg,
      counts
    };
  });

  return {
    sdl3PackageMeta: packageMeta,
    sdl3EntityData: entityData
  };
}

function ensureSourceRoot() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`SDL wiki source root not found: ${sourceRoot}`);
  }
}

function writeOutput(payload) {
  fs.writeFileSync(outputPath, JSON.stringify(payload), 'utf8');
}

function copyLexicon() {
  const sourceLexiconPath = path.join(projectRoot, 'content', 'reference', 'sdl3-lexicon.json');
  const targetLexiconPath = path.join(projectRoot, 'data', 'ui', 'sdl3-lexicon.json');
  if (!fs.existsSync(sourceLexiconPath)) {
    console.warn(`SDL3 lexicon source not found: ${sourceLexiconPath}`);
    return;
  }
  fs.copyFileSync(sourceLexiconPath, targetLexiconPath);
}

function main() {
  ensureSourceRoot();
  const payload = buildData();
  writeOutput(payload);
  copyLexicon();

  const summary = OUTPUT_KIND_KEYS.map((key) => `${key}:${payload.sdl3EntityData[key].length}`).join(' ');
  process.stdout.write(`${summary}\n${path.relative(projectRoot, outputPath)}\n`);
}

main();
