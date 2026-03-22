(function(global) {
  'use strict';

  function createSdl3DetailRuntime(api = {}) {
    const {
      buildSdl3PrimaryMeaning,
      buildSdl3OfficialDescription,
      buildSdl3UsageHint,
      buildSdl3ActualOperation,
      buildSdl3PracticalBenefitDetailed,
      buildSdl3MissingOrMisuseImpact,
      buildSdl3ReturnMeaning,
      buildSdl3SearchPreview: externalBuildSdl3SearchPreview,
      buildSdl3ReferenceTooltipUncached,
      buildSdl3PropertyLabelsFromName,
      getSdl3ReferenceDescription,
      getSdl3ReferenceValueType,
      isSdl3PropertyMacro: externalIsSdl3PropertyMacro,
      isSdl3FunctionLikeMacro,
      parseSdl3MacroDefinition,
      parseSdl3StructFields,
      getSdl3ExactElementTypeInfo,
      getSdl3PropertyLifecycleHint,
      getSdl3TypeSectionDataKey,
      getSdl3PropertyDisplayCategory,
      getSdl3PropertyThreadSafetyHint,
      getSdl3PropertyDefaultLabel,
      getSdl3PropertyAllowedValuesText,
      getSdl3PropertyAllowedValuesLabel,
      getSdl3PropertyRequirementLabel,
      getSdl3PropertyMacroValidation,
      renderSdl3PracticalText,
      renderSdl3InlineCodeSnippet,
      renderSdl3TypeReference,
      renderSdl3InfoGrid,
      composeSemanticTooltip,
      sanitizeTooltipText,
      escapeHtml,
      escapeAttribute,
      findSdl3AnyItemByName,
      preferArabicSdl3DocText,
      normalizeSdl3ArabicTechnicalProse,
      normalizeSdl3DocValue,
      splitSdl3IdentifierWords,
      humanizeSdl3Words,
      stripTooltipIdentifierNoise,
      stripMarkup,
      sdl3ReferenceTooltipCache,
      getSdl3SpecialFunctionProfile,
      parseSdl3FunctionSignature,
      getSdl3NameAction,
      getSdl3ObjectMeaning,
      buildSdl3NameMeaning,
      translateSdl3CategoryLabel,
      resolveStrictArabicSdl3DocText,
      getSdl3FieldRemarkMap,
      findSdl3ItemByKind,
      linkSdl3DocText,
      extractSdl3TooltipFieldText
    } = api;

function buildSdl3FunctionMeaning(item) {
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  if (specialProfile?.meaning) {
    return specialProfile.meaning;
  }

  const words = splitSdl3IdentifierWords(item?.name || '');
  const action = words[0] || '';
  const objectText = getSdl3ObjectMeaning(words.slice(1), item) || 'العنصر المطلوب';
  const hasCallback = (item?.parameters || []).some((param) => /callback/i.test(param.name || '') || /Callback/.test(param.type || ''));

  if (/File Dialogs/i.test(item?.categoryTitle || '') && /Show|Open|Save/i.test(action)) {
    return hasCallback
      ? 'يفتح مربع حوار الملفات الأصلي للنظام ويعيد النتيجة لاحقًا عبر رد نداء بدل قيمة راجعة مباشرة.'
      : 'يفتح مربع حوار الملفات الأصلي للنظام لتنفيذ عملية الاختيار أو الحفظ.';
  }

  const actionMap = {
    Add: `يضيف ${objectText} إلى الكيان أو المسار الجاري التعامل معه.`,
    Close: `يغلق ${objectText} وينهي العمل الجاري عليه.`,
    Convert: `يحوّل ${objectText} من تمثيل إلى آخر مناسب للاستخدام.`,
    Create: `ينشئ ${objectText} جديدًا يمكنك استخدامه لاحقًا داخل SDL3.`,
    Destroy: `يحرر ${objectText} وينهي عمره البرمجي.`,
    Free: `يحرر ${objectText} بعد الانتهاء منه.`,
    Get: `يجلب ${objectText} من SDL3 أو من كائن قائم.`,
    Has: `يتحقق من وجود ${objectText} أو دعمه.`,
    Load: `يحمّل ${objectText} من مصدر خارجي إلى كائن قابل للاستخدام.`,
    Lock: `يقفل ${objectText} حتى تستطيع الوصول الآمن إلى بياناته.`,
    Open: `يفتح ${objectText} ويهيئه للاستخدام.`,
    Query: `يستعلم عن ${objectText} بدون تعديله.`,
    Read: `يقرأ ${objectText} من المصدر المرتبط به.`,
    Remove: `يزيل ${objectText} من الحاوية أو المسار الحالي.`,
    Reset: `يعيد ${objectText} إلى حالته الابتدائية.`,
    Save: `يحفظ ${objectText} إلى الملف أو المجرى المطلوب.`,
    Set: `يضبط ${objectText} على القيمة أو الحالة التي تمررها.`,
    Show: `يعرض ${objectText} على الشاشة أو للمستخدم.`,
    Start: `يبدأ ${objectText} أو يطلق تنفيذه.`,
    Stop: `يوقف ${objectText} بعد أن كان يعمل.`,
    Unlock: `يفك قفل ${objectText} بعد الانتهاء من الوصول إليه.`,
    Update: `يحدّث ${objectText} ليعكس البيانات أو الحالة الجديدة.`,
    Wait: `ينتظر ${objectText} أو اكتمال الحدث المرتبط به.`
  };

  return actionMap[action] || buildSdl3NameMeaning(item);
}

function buildSdl3FunctionPurpose(item) {
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  if (specialProfile?.purpose) {
    return specialProfile.purpose;
  }

  const action = getSdl3NameAction(item);
  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const hasCallback = (item?.parameters || []).some((param) => /callback/i.test(param.name || '') || /Callback/.test(param.type || ''));

  if (/File Dialogs/i.test(item?.categoryTitle || '')) {
    return 'تستخدمها عندما تريد واجهة اختيار ملفات أصلية من النظام بدل بناء واجهة اختيار مخصصة داخل التطبيق.';
  }
  if (hasCallback) {
    return 'تستخدمها عندما تكون النتيجة غير فورية أو تحتاج SDL3 أن يعيدها لك لاحقًا عبر رد نداء.';
  }
  if (/Create|Open|Load/i.test(action)) {
    return 'تستخدمها عندما تحتاج موردًا أو كائنًا جديدًا تبدأ العمل به بعد هذا الاستدعاء.';
  }
  if (/Get|Query|Read/i.test(action)) {
    return 'تستخدمها عندما تريد قراءة حالة أو بيانات من SDL3 بدون تغيير الكائن نفسه.';
  }
  if (/Set|Update/i.test(action)) {
    return 'تستخدمها عندما تملك كائنًا قائمًا وتريد تعديل سلوكه أو خصائصه.';
  }
  if (/Add|Remove/i.test(action)) {
    return 'تستخدمها عندما تبني قائمة أو مسار عمل وتحتاج إدخال عنصر أو إزالته منه.';
  }
  if (/Close|Destroy|Free|Stop/i.test(action)) {
    return 'تستخدمها عندما تنتهي من المورد أو العملية وتحتاج إغلاقها أو تحريرها بشكل صحيح.';
  }
  if (/bool\b/.test(signature.returnType || '')) {
    return 'تستخدمها كخطوة تنفيذية تحتاج بعدَها قرارًا مباشرًا بناءً على النجاح أو الفشل.';
  }
  return buildSdl3UsageHint(item);
}

function buildSdl3EffectHint(item) {
  const signature = parseSdl3FunctionSignature(item?.syntax || '');
  const returnType = signature.returnType || '';
  const hasCallback = (item?.parameters || []).some((param) => /callback/i.test(param.name || '') || /Callback/.test(param.type || ''));

  if (hasCallback) {
    return 'الأثر النهائي لا يعود فورًا من الدالة؛ SDL3 يستدعي رد النداء لاحقًا بالنتيجة أو الإلغاء أو الخطأ.';
  }
  if (/bool\b/.test(returnType)) {
    return 'تعطيك نتيجة نجاح أو فشل مباشرة حتى تكمل المسار أو تعالج الخطأ فورًا.';
  }
  if (/\*/.test(returnType)) {
    return 'تعيد لك موردًا أو مؤشرًا جديدًا يمثل الكائن الناتج عن هذه العملية.';
  }
  if (returnType && returnType !== 'void') {
    return `تعيد قيمة من النوع ${returnType} تمثل نتيجة العملية أو البيانات المطلوبة.`;
  }
  return 'تطبق أثرها مباشرة على SDL3 أو على المورد المستهدف دون قيمة راجعة مباشرة.';
}

function buildSdl3WhenToUseHint(item) {
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  if (specialProfile?.when) {
    return specialProfile.when;
  }

  if (/File Dialogs/i.test(item?.categoryTitle || '')) {
    return 'استخدمها في اللحظة التي تريد فيها من المستخدم اختيار ملف أو مجلد أو مكان حفظ بطريقة أصلية من النظام.';
  }
  if ((item?.parameters || []).some((param) => /callback/i.test(param.name || '') || /Callback/.test(param.type || ''))) {
    return 'استخدمها عندما تكون مستعدًا للتعامل مع النتيجة عبر رد نداء وليس كسطر إرجاع فوري.';
  }
  if (/Create|Open|Load/i.test(getSdl3NameAction(item))) {
    return 'استدعها في بداية دورة حياة المورد قبل أي استخدام لاحق له.';
  }
  if (/Close|Destroy|Free/i.test(getSdl3NameAction(item))) {
    return 'استدعها عند نهاية دورة حياة المورد حتى لا يبقى محجوزًا أو مفتوحًا بلا داع.';
  }
  return `يظهر استخدام هذه الدالة داخل مسار ${translateSdl3CategoryLabel(item?.categoryTitle || 'SDL3 API')} عندما يكون المطلوب عمليًا هو: ${buildSdl3PrimaryMeaning(item)}`;
}

function buildSdl3TypeMeaning(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const fields = parseSdl3StructFields(item?.syntax || '');
  if (item?.name === 'SDL_DialogFileFilter') {
    return 'بنية تمثل مرشحًا واحدًا داخل حوار اختيار الملفات، وتحدد الاسم الذي يراه المستخدم ونمط الامتدادات الذي يسمح به هذا المرشح.';
  }
  if (fields.length) {
    return `بنية تصف ${fields.length} ${fields.length === 1 ? 'حقلًا' : 'حقولاً'} مترابطة تقرؤها SDL كوحدة واحدة بدل توزيعها على معاملات منفصلة.`;
  }
  if (exactType.key === 'callback') {
    return 'نوع رد نداء يحدد التوقيع الذي يجب أن تلتزم به الدالة التي ستستدعيها SDL أو الملحق لاحقًا.';
  }
  if (exactType.key === 'handle') {
    return 'نوع معتم يمثل موردًا داخليًا تحتفظ SDL بتمثيله الفعلي، بينما تتعامل أنت معه عبر المقبض فقط.';
  }
  if (exactType.key === 'flag-typedef') {
    return 'نوع رايات يحدد قناع بتات رسميًا يمكن دمجه بقيم ثابتة مناسبة بدل استخدام أرقام عشوائية.';
  }
  if (exactType.key === 'typedef') {
    return `اسم نوع بديل يمنح ${getSdl3BaseTypeName(item?.syntax || item?.name || '') || item?.name} دورًا واضحًا داخل واجهة SDL بدل عرض النوع الخام وحده.`;
  }
  const translated = translateSdl3DocText(item?.description || '', item, {fallbackToItemMeaning: true});
  return /[\u0600-\u06FF]/.test(translated) ? translated : buildSdl3NameMeaning(item);
}

function buildSdl3TypePurpose(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const fields = parseSdl3StructFields(item?.syntax || '');
  if (item?.name === 'SDL_DialogFileFilter') {
    return 'تستخدمها عندما تريد تقييد الملفات المعروضة للمستخدم داخل حوار الفتح أو الحفظ، مع إبقاء كل مرشح مفهومًا باسمه ونمطه.';
  }
  if (fields.length) {
    return 'تستخدم هذه البنية عندما تريد SDL قراءة مجموعة إعدادات أو كتابة مجموعة نتائج ضمن عقد واحد ثابت الحقول والترتيب.';
  }
  if (exactType.key === 'callback') {
    return 'تستخدمه عندما تطلب منك SDL أو الملحق تمرير دالة رد نداء بتوقيع مطابق تمامًا لهذا النوع.';
  }
  if (exactType.key === 'handle') {
    return 'تستخدم هذا المقبض لتمرير المورد نفسه بين دوال الإنشاء والتعديل والاستخدام والتحرير دون كشف بنيته الداخلية.';
  }
  if (exactType.key === 'flag-typedef') {
    return 'تستخدمه عندما تستقبل الدالة مجموعة خيارات قابلة للدمج بعملية OR ويجب أن يعرف المترجم أن هذه القيمة قناع بتات رسمي.';
  }
  return 'تستخدمه كنوع مرجعي يظهر في المعاملات أو القيم الراجعة أو حقول البنى المرتبطة به.';
}

function buildSdl3TypePracticalUsage(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const fields = parseSdl3StructFields(item?.syntax || '');

  if (fields.length) {
    return 'تملأ هذه البنية قبل الاستدعاء عندما تطلب SDL إعدادات أو قيودًا أو أوصافًا مجمعة، أو تقرأ حقولها بعد الاستدعاء عندما تستخدمها SDL لإرجاع النتائج في كيان واحد مرتب.';
  }
  if (exactType.key === 'callback') {
    return 'تستخدمه عندما تكتب دالة محلية ثم تمرر عنوانها إلى SDL أو إلى الملحق المطابق، بحيث تستدعيها المكتبة لاحقًا عند اكتمال العملية أو عند وقوع الحدث الذي صُمم له هذا الرد.';
  }
  if (exactType.key === 'handle') {
    return 'تحصل عليه من دالة إنشاء أو فتح أو استرجاع مناسبة، ثم تمرره لاحقًا إلى الدوال التي تقرأ المورد نفسه أو تعدله أو تحرره. لا تنشئ هذا المقبض يدويًا ولا تفترض بنية داخلية له.';
  }
  if (exactType.key === 'flag-typedef') {
    return 'تخزن فيه عادة ناتج دمج عدة رايات ثابتة بعملية OR عندما يطلب هذا المسار مجموعة خيارات قابلة للتركيب بدل قيمة مفردة واحدة.';
  }
  if (exactType.key === 'typedef') {
    return 'يظهر عادة في تواقيع الدوال أو في المتغيرات المحلية ليعطي معنى أوضح من النوع الخام، لذلك تمرر قيمته أو تخزنها تحت هذا الاسم عندما تريد أن يكون دورها البرمجي واضحًا في الكود.';
  }
  return 'استخدم هذا النوع عندما يظهر اسمه صراحة في التوقيع أو في البنية أو في القيمة الراجعة، لأن SDL تبني على هذا الاسم النوعي معنى محددًا لا يوفره النوع الخام وحده.';
}

function buildSdl3TypeCodeAppearance(item) {
  const exactType = getSdl3ExactElementTypeInfo(item);
  const fields = parseSdl3StructFields(item?.syntax || '');

  if (fields.length) {
    return `يظهر هذا النوع كبنية تحتوي ${fields.length} ${fields.length === 1 ? 'حقلًا' : 'حقولاً'}، وتقرأ SDL هذه الحقول بحسب ترتيبها وأسمائها الرسمية داخل التوقيع أو عند تعبئة النتيجة.`;
  }
  if (exactType.key === 'callback') {
    return 'يظهر داخل الكود كتوقيع typedef لدالة رد نداء، ثم ينعكس هذا التوقيع على أي دالة محلية أو lambda تحولها إلى مؤشر دالة مطابق.';
  }
  if (exactType.key === 'handle') {
    return 'يظهر في الكود كمقبض يمر بين دوال الإنشاء والاستخدام والتحرير، وعادة تخزنه في متغير ثم تفحص صلاحيته قبل متابعة العمل على المورد المرتبط به.';
  }
  if (exactType.key === 'flag-typedef') {
    return 'يظهر في المعاملات أو المتغيرات المحلية كناتج دمج رايات ثابتة، لا كعدد مجهول المعنى، حتى يبقى واضحًا ما الذي تفعله كل قيمة داخل هذا القناع.';
  }
  return 'يظهر في التواقيع والمتغيرات كاسم نوع رسمي يحدد شكل القيمة أو المورد أو التعاقد الذي تتوقعه SDL في هذا الموضع.';
}

function buildSdl3MacroKind(item) {
  const name = String(item?.name || '');
  if (/^SDL_PROP_/.test(name)) return 'مفتاح خاصية';
  if (/_BOOLEAN$/.test(name)) return 'قيمة منطقية';
  if (/_STRING$/.test(name)) return 'قيمة نصية';
  if (/_NUMBER$/.test(name)) return 'قيمة رقمية';
  if (/_POINTER$/.test(name)) return 'مؤشر';
  if (/STYLE|FLAG/i.test(name)) return 'ثابت نمط/خيار';
  if (/MASK/i.test(name)) return 'قناع بتات';
  return 'ماكرو SDL3';
}

function isSdl3PropertyMacro(item) {
  return /^(?:SDL|IMG|MIX|TTF)_PROP_/.test(String(item?.name || ''));
}

function normalizeSdl3PropertyRemarkText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSdl3PropertyContextHeader(text) {
  return /^(?:On\s+.+:|With\s+.+:)$/.test(String(text || '').trim());
}

function isSdl3PropertyGlobalNote(text) {
  return /^(?:Note that|All properties are|These properties are shared|On POSIX platforms,)/i.test(String(text || '').trim());
}

function translateSdl3PropertyContextHeader(text) {
  const value = normalizeSdl3PropertyRemarkText(text);
  if (!value) {
    return '';
  }

  let match = /^On\s+([A-Za-z0-9_\/+ -]+):$/i.exec(value);
  if (match) {
    return `تنطبق هذه الخاصية على ${match[1].trim()} فقط.`;
  }

  match = /^With\s+the\s+(.+?)\s+renderer(?:\s+\(since\s+(.+?)\))?:$/i.exec(value);
  if (match) {
    return `تُستخدم هذه الخاصية فقط مع المصيّر ${match[1].trim()}${match[2] ? ` ابتداءً من ${match[2].trim()}` : ''}.`;
  }

  match = /^With\s+the\s+(.+?)(?:\s+\(since\s+(.+?)\))?:$/i.exec(value);
  if (match) {
    return `تنتمي هذه الخاصية إلى المسار ${match[1].trim()}${match[2] ? ` ابتداءً من ${match[2].trim()}` : ''}.`;
  }

  return preferArabicSdl3DocText(value, null, {
    section: 'remarks',
    fallbackText: value
  });
}

function collectSdl3PropertyNames(text) {
  return [...new Set(
    (String(text || '').match(/\b(?:SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+\b/g) || [])
      .map((name) => String(name || '').trim())
      .filter(Boolean)
  )];
}

function getSdl3PropertyReferenceProfile(referenceName) {
  const cacheKey = String(referenceName || '').trim();
  if (!cacheKey) {
    return null;
  }

  if (sdl3PropertyReferenceProfileCache.has(cacheKey)) {
    return sdl3PropertyReferenceProfileCache.get(cacheKey);
  }

  const referenceItem = findSdl3AnyItemByName(cacheKey);
  if (!referenceItem) {
    sdl3PropertyReferenceProfileCache.set(cacheKey, null);
    return null;
  }

  const profile = {
    referenceItem,
    entries: new Map(),
    globalNotes: []
  };

  let mode = '';
  let currentContext = '';
  let currentEntry = null;

  const flushCurrentEntry = () => {
    if (!currentEntry?.name) {
      currentEntry = null;
      return;
    }
    profile.entries.set(currentEntry.name, {...currentEntry});
    currentEntry = null;
  };

  const pushGlobalNote = (text) => {
    const normalized = normalizeSdl3PropertyRemarkText(text);
    if (!normalized) {
      return;
    }
    if (!profile.globalNotes.includes(normalized)) {
      profile.globalNotes.push(normalized);
    }
  };

  (referenceItem.remarks || []).forEach((rawRemark) => {
    const remark = normalizeSdl3PropertyRemarkText(rawRemark);
    if (!remark) {
      return;
    }

    if (/^These are the supported properties:?$/i.test(remark)) {
      flushCurrentEntry();
      mode = 'input';
      currentContext = '';
      return;
    }

    if (/^The following read-only properties are provided by SDL:?$/i.test(remark)) {
      flushCurrentEntry();
      mode = 'readonly';
      currentContext = '';
      return;
    }

    if (/^The following read-write properties are provided by SDL:?$/i.test(remark)) {
      flushCurrentEntry();
      mode = 'readwrite';
      currentContext = '';
      return;
    }

    if (/^The following properties are provided by SDL:?$/i.test(remark)) {
      flushCurrentEntry();
      mode = 'provided';
      currentContext = '';
      return;
    }

    const propertyMatch = /^((?:SDL|IMG|MIX|TTF)_PROP_[A-Z0-9_]+)\s*:\s*([\s\S]*)$/.exec(remark);
    if (propertyMatch) {
      flushCurrentEntry();
      currentEntry = {
        name: propertyMatch[1],
        mode,
        contextHeader: currentContext,
        descriptionText: normalizeSdl3PropertyRemarkText(propertyMatch[2]),
        extraNotes: []
      };
      return;
    }

    if (isSdl3PropertyContextHeader(remark)) {
      flushCurrentEntry();
      currentContext = remark;
      return;
    }

    if (isSdl3PropertyGlobalNote(remark)) {
      flushCurrentEntry();
      pushGlobalNote(remark);
      return;
    }

    if (currentEntry) {
      currentEntry.extraNotes.push(remark);
      return;
    }

    pushGlobalNote(remark);
  });

  flushCurrentEntry();
  sdl3PropertyReferenceProfileCache.set(cacheKey, profile);
  return profile;
}

function getSdl3PropertyEntry(item) {
  if (!isSdl3PropertyMacro(item) || !item?.referenceName) {
    return null;
  }

  const profile = getSdl3PropertyReferenceProfile(item.referenceName);
  if (!profile) {
    return null;
  }

  const entry = profile.entries.get(String(item.name || '').trim());
  if (!entry) {
    return {
      name: item.name,
      mode: '',
      contextHeader: '',
      descriptionText: '',
      extraNotes: []
    };
  }

  return entry;
}

function getSdl3PropertyValueTypeLabel(item, entry = null) {
  const name = String(item?.name || '');
  const descriptionText = String(entry?.descriptionText || '');

  if (/_POINTER$/.test(name) || /\bpointer\b/i.test(descriptionText)) return 'مؤشر';
  if (/_STRING$/.test(name) || /\bstring\b/i.test(descriptionText)) return 'سلسلة نصية';
  if (/_BOOLEAN$/.test(name)) return 'قيمة منطقية';
  if (/_FLOAT$/.test(name)) return 'قيمة عشرية';
  if (/_NUMBER$/.test(name)) return 'قيمة رقمية';
  return 'قيمة خاصية';
}

function buildSdl3PropertyFallbackDescription(item, referenceItem = null) {
  const name = String(item?.name || '');
  if (/FILENAME/.test(name)) return 'المسار النصي للملف الذي سيعمل عليه هذا المسار.';
  if (/IOSTREAM_POINTER/.test(name)) return 'مؤشر SDL_IOStream الذي سيقرأ منه هذا المسار أو يكتب إليه.';
  if (/IOSTREAM_AUTOCLOSE/.test(name)) return 'قيمة منطقية تحدد هل يُغلق SDL_IOStream المصاحب تلقائيًا عند انتهاء المورد.';
  if (/_TYPE_STRING/.test(name)) return 'اسم نوع الملف أو الامتداد الذي يوجه SDL إلى الصيغة المقصودة.';
  if (/QUALITY/.test(name)) return 'قيمة الجودة أو مستوى الضغط الذي يؤثر في موازنة الجودة مقابل الحجم.';
  if (/TIMEBASE_NUMERATOR/.test(name)) return 'بسط الكسر الزمني الذي يحول القيم الزمنية إلى ثوانٍ.';
  if (/TIMEBASE_DENOMINATOR/.test(name)) return 'مقام الكسر الزمني الذي يحول القيم الزمنية إلى ثوانٍ.';
  if (/MAX_THREADS/.test(name)) return 'الحد الأعلى لعدد الخيوط الذي يسمح به هذا المسار.';
  if (/ALLOW_INCREMENTAL/.test(name)) return 'قيمة منطقية تحدد هل يسمح هذا المسار بالمعالجة التدريجية.';
  if (/ALLOW_PROGRESSIVE/.test(name)) return 'قيمة منطقية تحدد هل يسمح هذا المسار بالتعامل مع البيانات التقدمية.';
  if (/TRANSPARENT_COLOR_INDEX/.test(name)) return 'فهرس اللون الشفاف الذي سيعتمده هذا المسار عند التعامل مع GIF.';
  if (/NUM_COLORS/.test(name)) return 'عدد الألوان الذي يستخدمه هذا المسار عند التعامل مع لوحة الألوان.';
  if (/OFFSET/.test(name)) return 'الإزاحة الرقمية التي يبدأ منها هذا المسار القراءة داخل المجرى.';
  if (/SIZE_FLOAT/.test(name)) return 'حجم الخط بالنقاط.';
  if (/FACE_NUMBER/.test(name)) return 'فهرس الوجه المطلوب داخل ملف الخط.';
  if (/HORIZONTAL_DPI/.test(name)) return 'دقة العرض الأفقية المستخدمة عند رسم الخط.';
  if (/VERTICAL_DPI/.test(name)) return 'دقة العرض العمودية المستخدمة عند رسم الخط.';
  if (/EXISTING_FONT_POINTER/.test(name)) return 'مؤشر خط موجود سلفًا يُستخدم كمصدر بيانات للخط الجديد.';
  if (/FILTERS_POINTER/.test(name)) return 'مؤشر إلى قائمة المرشحات التي يقرأها حوار الملفات.';
  if (/NFILTERS/.test(name)) return 'عدد المرشحات الموجودة في المصفوفة المشار إليها.';
  if (/WINDOW_POINTER/.test(name)) return 'النافذة المالكة أو المرتبطة بهذا المسار.';
  if (/LOCATION_STRING/.test(name)) return 'المسار أو المجلد أو الملف الذي يبدأ منه هذا المسار.';
  if (/MANY_BOOLEAN/.test(name)) return 'قيمة منطقية تحدد هل يسمح المسار باختيار أكثر من عنصر.';
  if (/TITLE_STRING/.test(name)) return 'العنوان النصي الذي يظهر للمستخدم في هذا المسار.';
  if (/ACCEPT_STRING/.test(name)) return 'النص الذي يظهر على زر القبول.';
  if (/CANCEL_STRING/.test(name)) return 'النص الذي يظهر على زر الإلغاء.';
  if (/ARGS_POINTER/.test(name)) return 'مؤشر إلى مصفوفة النصوص التي تحمل اسم البرنامج ومعاملاته.';
  if (/ENVIRONMENT_POINTER/.test(name)) return 'مؤشر إلى البيئة التي سيعمل بها هذا المسار.';
  if (/WORKING_DIRECTORY_STRING/.test(name)) return 'المجلد الحالي الذي سيبدأ منه هذا المسار.';
  if (/STDIN_NUMBER/.test(name)) return 'قيمة رقمية تحدد مصدر الإدخال القياسي للعملية.';
  if (/STDOUT_NUMBER/.test(name)) return 'قيمة رقمية تحدد وجهة الإخراج القياسي للعملية.';
  if (/STDERR_NUMBER/.test(name)) return 'قيمة رقمية تحدد وجهة الخطأ القياسي للعملية.';
  if (/STDIN_POINTER/.test(name)) return 'مؤشر SDL_IOStream يستخدمه هذا المسار كدخل قياسي للعملية.';
  if (/STDOUT_POINTER/.test(name)) return 'مؤشر SDL_IOStream يستخدمه هذا المسار كمخرج قياسي للعملية.';
  if (/STDERR_POINTER/.test(name)) return 'مؤشر SDL_IOStream يستخدمه هذا المسار كمخرج للخطأ القياسي.';
  if (/STDERR_TO_STDOUT/.test(name)) return 'قيمة منطقية تحدد هل يُدمج خرج الخطأ القياسي في خرج العملية القياسي.';
  if (/BACKGROUND/.test(name)) return 'قيمة منطقية تحدد هل تعمل العملية في الخلفية.';
  if (/CMDLINE_STRING/.test(name)) return 'سلسلة نصية تحمل سطر الأوامر الكامل الذي سيُمرر كما هو إلى النظام.';
  if (/NAME_STRING/.test(name)) return 'اسم نصي يصف هذا المورد أو المسار كما يراه SDL أو برنامج التشغيل.';
  if (/_WIDTH_NUMBER/.test(name)) return 'العرض الرقمي لهذا المورد أو لهذا الموضع من الإعداد.';
  if (/_HEIGHT_NUMBER/.test(name)) return 'الارتفاع الرقمي لهذا المورد أو لهذا الموضع من الإعداد.';
  if (/_X_NUMBER/.test(name)) return 'الموضع الأفقي المرتبط بهذا المورد أو بهذه العملية.';
  if (/_Y_NUMBER/.test(name)) return 'الموضع العمودي المرتبط بهذا المورد أو بهذه العملية.';
  if (/_BOOLEAN$/.test(name)) return `قيمة منطقية تتحكم في خيار محدد يقرؤه ${referenceItem?.name || 'هذا المسار'}.`;
  if (/_NUMBER$/.test(name)) return `قيمة رقمية تضبط إعدادًا يقرؤه ${referenceItem?.name || 'هذا المسار'}.`;
  if (/_STRING$/.test(name)) return `قيمة نصية يقرؤها ${referenceItem?.name || 'هذا المسار'} عند تنفيذ العملية.`;
  if (/_POINTER$/.test(name)) return `مؤشر إلى مورد أو بنية يقرأها ${referenceItem?.name || 'هذا المسار'} مباشرة.`;
  return `هذه الخاصية تحمل ${getSdl3PropertyValueTypeLabel(item)} يقرأه ${referenceItem?.name || 'هذا المسار'} من SDL_PropertiesID.`;
}

function buildSdl3PropertyOfficialDescription(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const referenceItem = item?.referenceName ? findSdl3AnyItemByName(item.referenceName) : null;
  const entry = getSdl3PropertyEntry(item);
  const descriptionText = String(entry?.descriptionText || '').trim();
  const fallback = buildSdl3PropertyFallbackDescription(item, referenceItem);

  if (!descriptionText) {
    return fallback;
  }

  let match = /^the file to save, if an SDL_IOStream isn't being used\.?$/i.exec(descriptionText);
  if (match) return 'ملف الإخراج الذي سيُحفظ فيه المحتوى إذا لم تُمرَّر قيمة SDL_IOStream.';

  match = /^the file to load, if an SDL_IOStream isn't being used\.?$/i.exec(descriptionText);
  if (match) return 'ملف الإدخال الذي سيُحمَّل إذا لم تُمرَّر قيمة SDL_IOStream.';

  match = /^the font file to open, if an SDL_IOStream isn't being used\.?$/i.exec(descriptionText);
  if (match) return 'ملف الخط الذي سيُفتح إذا لم تُمرَّر قيمة SDL_IOStream.';

  match = /^an SDL_IOStream containing a series of images\.?$/i.exec(descriptionText);
  if (match) return 'قيمة SDL_IOStream التي تحتوي سلسلة الصور التي سيقرأها هذا المسار.';

  match = /^an SDL_IOStream that will be used to save the stream\.?$/i.exec(descriptionText);
  if (match) return 'قيمة SDL_IOStream التي ستكتب SDL إليها بيانات المجرى مباشرة.';

  match = /^an SDL_IOStream containing the font to be opened\.?$/i.exec(descriptionText);
  if (match) return 'قيمة SDL_IOStream التي تحتوي بيانات الخط المطلوب فتحه.';

  match = /^true if closing the .+ should also close the associated SDL_IOStream\.?$/i.exec(descriptionText);
  if (match) return 'قيمة منطقية تحدد هل يؤدي إغلاق المورد المرتبط إلى إغلاق SDL_IOStream المصاحب تلقائيًا.';

  match = /^the output file type,\s*e\.g\.\s*"([^"]+)",\s*defaults to the file extension if\s+([A-Z0-9_]+)\s+is set\.?$/i.exec(descriptionText);
  if (match) return `نوع ملف الإخراج المطلوب، مثل "${match[1]}". وإذا ضُبطت ${match[2]} فسيُستنتج النوع افتراضيًا من امتداد الملف.`;

  match = /^the input file type,\s*e\.g\.\s*"([^"]+)",\s*defaults to the file extension if\s+([A-Z0-9_]+)\s+is set\.?$/i.exec(descriptionText);
  if (match) return `نوع ملف الإدخال المتوقع، مثل "${match[1]}". وإذا ضُبطت ${match[2]} فسيُستنتج النوع افتراضيًا من امتداد الملف.`;

  match = /^the compression quality,\s*in the range of\s*0\s*to\s*100\.?$/i.exec(descriptionText);
  if (match) return 'مستوى الجودة والضغط بقيمة عددية بين 0 و100.';

  match = /^the numerator of the fraction used to multiply the pts to convert it to seconds\.?$/i.exec(descriptionText);
  if (match) return 'بسط الكسر الزمني الذي تُضرب به قيمة pts لتحويلها إلى ثوانٍ.';

  match = /^the denominator of the fraction used to multiply the pts to convert it to seconds\.?$/i.exec(descriptionText);
  if (match) return 'مقام الكسر الزمني الذي تُضرب به قيمة pts لتحويلها إلى ثوانٍ.';

  match = /^the offset in the iostream for the beginning of the font,\s*defaults to\s*0\.?$/i.exec(descriptionText);
  if (match) return 'الإزاحة داخل SDL_IOStream التي تبدأ منها بيانات الخط، وقيمتها الافتراضية 0.';

  match = /^the point size of the font(?:\..+)?$/i.exec(descriptionText);
  if (match) return 'حجم الخط بالنقاط.';

  match = /^the face index of the font,\s*if the font contains multiple font faces\.?$/i.exec(descriptionText);
  if (match) return 'فهرس الوجه المطلوب داخل ملف الخط إذا كان الملف يحتوي أكثر من وجه.';

  match = /^the horizontal DPI to use for font rendering,\s*defaults to\s+([A-Z0-9_]+)\s+if set,\s*or\s*72\s+otherwise\.?$/i.exec(descriptionText);
  if (match) return `كثافة العرض الأفقية المستخدمة عند رسم الخط. إذا كانت ${match[1]} مضبوطة فستُستخدم قيمتها افتراضيًا، وإلا فالقيمة الافتراضية هي 72.`;

  match = /^the vertical DPI to use for font rendering,\s*defaults to\s+([A-Z0-9_]+)\s+if set,\s*or\s*72\s+otherwise\.?$/i.exec(descriptionText);
  if (match) return `كثافة العرض العمودية المستخدمة عند رسم الخط. إذا كانت ${match[1]} مضبوطة فستُستخدم قيمتها افتراضيًا، وإلا فالقيمة الافتراضية هي 72.`;

  match = /^an optional TTF_Font that,\s*if set,\s*will be used as the font data source and the initial size and style of the new font\.?$/i.exec(descriptionText);
  if (match) return 'خط TTF_Font اختياري يُستخدم كمصدر بيانات للخط الجديد، وتؤخذ منه القيم الأولية للحجم والنمط.';

  match = /^a pointer to a list of\s+([A-Za-z0-9_]+)\s+structs,\s*which will be used as filters for file-based selections\..*$/i.exec(descriptionText);
  if (match) return `مؤشر إلى قائمة من البنى ${match[1]} تُستخدم كمرشحات داخل اختيار الملفات.`;

  match = /^the number of filters in the array of filters,\s*if it exists\.?$/i.exec(descriptionText);
  if (match) return 'عدد المرشحات الموجودة في مصفوفة المرشحات إن كانت المصفوفة موجودة.';

  match = /^the window that the dialog should be modal for\.?$/i.exec(descriptionText);
  if (match) return 'النافذة التي يجب أن يرتبط بها حوار الملفات كنافذة modal.';

  match = /^the default folder or file to start the dialog at\.?$/i.exec(descriptionText);
  if (match) return 'المجلد أو الملف الذي يبدأ منه حوار الملفات افتراضيًا.';

  match = /^true to allow the user to select more than one entry\.?$/i.exec(descriptionText);
  if (match) return 'قيمة منطقية تسمح للمستخدم باختيار أكثر من عنصر واحد.';

  match = /^the title for the dialog\.?$/i.exec(descriptionText);
  if (match) return 'عنوان الحوار الذي يظهر للمستخدم.';

  match = /^the label that the accept button should have\.?$/i.exec(descriptionText);
  if (match) return 'النص الذي يظهر على زر القبول.';

  match = /^the label that the cancel button should have\.?$/i.exec(descriptionText);
  if (match) return 'النص الذي يظهر على زر الإلغاء.';

  match = /^an array of strings containing the program to run,\s*any arguments,\s*and a NULL pointer.*$/i.exec(descriptionText);
  if (match) return 'مصفوفة نصوص تحتوي اسم البرنامج ثم معاملاته، وتنتهي بمؤشر NULL.';

  match = /^an SDL_Environment pointer\..*otherwise the current environment is used\.?$/i.exec(descriptionText);
  if (match) return 'مؤشر إلى SDL_Environment يحدد بيئة العملية كاملة. وإذا لم يُضبط فستُستخدم بيئة العملية الحالية.';

  match = /^a UTF-8 encoded string representing the working directory for the process,\s*defaults to the current working directory\.?$/i.exec(descriptionText);
  if (match) return 'سلسلة UTF-8 تمثل مجلد العمل للعملية، والقيمة الافتراضية هي مجلد العمل الحالي.';

  match = /^an SDL_ProcessIO value describing where standard input for the process comes from,\s*defaults to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `قيمة من SDL_ProcessIO تحدد مصدر الإدخال القياسي للعملية، والقيمة الافتراضية هي ${match[1]}.`;

  match = /^an SDL_ProcessIO value describing where standard output for the process goes to,\s*defaults to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `قيمة من SDL_ProcessIO تحدد وجهة الإخراج القياسي للعملية، والقيمة الافتراضية هي ${match[1]}.`;

  match = /^an SDL_ProcessIO value describing where standard error for the process goes to,\s*defaults to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `قيمة من SDL_ProcessIO تحدد وجهة الخطأ القياسي للعملية، والقيمة الافتراضية هي ${match[1]}.`;

  match = /^an SDL_IOStream pointer used for standard input when\s+([A-Z0-9_]+)\s+is set to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `مؤشر SDL_IOStream يُستخدم كدخل قياسي عندما تضبط ${match[1]} على ${match[2]}.`;

  match = /^an SDL_IOStream pointer used for standard output when\s+([A-Z0-9_]+)\s+is set to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `مؤشر SDL_IOStream يُستخدم كمخرج قياسي عندما تضبط ${match[1]} على ${match[2]}.`;

  match = /^an SDL_IOStream pointer used for standard error when\s+([A-Z0-9_]+)\s+is set to\s+([A-Z0-9_]+)\s*\.?$/i.exec(descriptionText);
  if (match) return `مؤشر SDL_IOStream يُستخدم كمخرج للخطأ القياسي عندما تضبط ${match[1]} على ${match[2]}.`;

  match = /^true if the error output of the process should be redirected into the standard output of the process\..*$/i.exec(descriptionText);
  if (match) return 'قيمة منطقية تحدد هل يُعاد توجيه خرج الخطأ القياسي إلى خرج العملية القياسي.';

  match = /^true if the process should run in the background\..*$/i.exec(descriptionText);
  if (match) return 'قيمة منطقية تحدد هل تُشغَّل العملية في الخلفية.';

  match = /^a string containing the program to run and any parameters\..*$/i.exec(descriptionText);
  if (match) return 'سلسلة نصية تحمل اسم البرنامج ومعاملاته كما سيُمرَّران إلى النظام.';

  const translated = preferArabicSdl3DocText(descriptionText, item, {
    section: 'description',
    fallbackText: fallback
  });
  if (translated && !/[A-Za-z]{3,}/.test(stripTooltipIdentifierNoise(stripMarkup(translated)))) {
    return translated;
  }
  return fallback;
}

function buildSdl3PropertyMeaning(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const referenceItem = item?.referenceName ? findSdl3AnyItemByName(item.referenceName) : null;
  const entry = getSdl3PropertyEntry(item);
  const official = buildSdl3PropertyOfficialDescription(item);
  const name = String(item?.name || '');

  if (entry?.mode === 'readonly' || entry?.mode === 'provided') {
    if (/NAME_STRING/.test(name)) return `هذه الخاصية تحمل الاسم الفعلي الذي تكتبه SDL أو برنامج التشغيل داخل وعاء الخصائص بعد استدعاء ${referenceItem?.name || 'الدالة المرجعية'}.`;
    if (/VERSION/.test(name)) return `هذه الخاصية تحمل إصدارًا فعليًا تكتبه SDL أو السائق داخل وعاء الخصائص كي تستطيع قراءته لاحقًا من التطبيق.`;
    if (/DRIVER/.test(name)) return `هذه الخاصية تكشف اسم برنامج التشغيل أو معلومات نسخته كما يبلّغ عنها النظام فعليًا، لا كما يعرّفها التطبيق.`;
    return `${official} هذه الخاصية لا تمررها إلى الدالة، بل تكتبها SDL داخل وعاء الخصائص لكي تقرأها من التطبيق لاحقًا.`;
  }

  if (entry?.mode === 'readwrite') {
    return `${official} تظهر هذه الخاصية داخل وعاء خصائص المورد نفسه، ويمكنك قراءتها أو تعديلها بعد الحصول على الوعاء من ${referenceItem?.name || 'الدالة المرجعية'}.`;
  }

  if (/FILENAME/.test(name)) return `${official} وهي تمثل المصدر أو الوجهة المباشرة للملف عندما تريد العمل على مسار ملفات بدل مجرى مخصص.`;
  if (/IOSTREAM_POINTER/.test(name)) return `${official} وهي تمثل المجرى الفعلي الذي تقرأ منه SDL البيانات أو تكتب إليه بدل فتح ملف من المسار.`;
  if (/IOSTREAM_AUTOCLOSE/.test(name)) return `${official} وهي تتحكم في ملكية المجرى عند انتهاء دورة حياة المورد المرتبط.`;
  if (/_TYPE_STRING/.test(name)) return `${official} وهي تجبر SDL على اعتماد صيغة معينة بدل الاعتماد الكامل على امتداد الملف أو الكشف التلقائي.`;
  if (/QUALITY/.test(name)) return `${official} وهي تضبط الموازنة العملية بين الجودة الناتجة وحجم الملف أو كلفة الضغط.`;
  if (/TIMEBASE_NUMERATOR|TIMEBASE_DENOMINATOR/.test(name)) return `${official} وهي جزء من معادلة الزمن التي تفسر القيم الزمنية داخل الإطارات أو المجرى.`;
  if (/FILTERS_POINTER|NFILTERS/.test(name)) return `${official} وهي تحدد كيف يبني حوار الملفات قائمة المرشحات التي يراها المستخدم.`;
  if (/MANY_BOOLEAN/.test(name)) return `${official} وهي تغير سلوك الحوار بين اختيار عنصر واحد واختيار عدة عناصر.`;
  if (/TITLE_STRING|ACCEPT_STRING|CANCEL_STRING/.test(name)) return `${official} وهي تغير النصوص التي تظهر للمستخدم في واجهة الحوار نفسها.`;
  if (/STDIN_|STDOUT_|STDERR_/.test(name)) return `${official} وهي تحدد كيف تربط SDL قنوات الإدخال والإخراج القياسية بالعملية الجديدة.`;
  if (/BACKGROUND/.test(name)) return `${official} وهي تغير طريقة تشغيل العملية وما إذا كانت ستعطيك معلومات خروج كاملة أم لا.`;
  if (/CMDLINE_STRING/.test(name)) return `${official} وهي تمثل سطر الأوامر الكامل كما سيُمرر مباشرة إلى واجهة النظام.`;
  if (/WINDOW_CREATE_|RENDERER_CREATE_|GPU_DEVICE_CREATE_/.test(name)) return `${official} وهي تضبط خيارًا إنشائيًا يقرأه ${referenceItem?.name || 'هذا المسار'} قبل إنشاء المورد النهائي.`;
  return `${official} وتمثل مفتاحًا رسميًا داخل SDL_PropertiesID يقرأه ${referenceItem?.name || 'هذا المسار'} بالنوع الصحيح بدل الاعتماد على أسماء نصية حرة.`;
}

function buildSdl3PropertyWhenToUse(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const entry = getSdl3PropertyEntry(item);
  const referenceItem = item?.referenceName ? findSdl3AnyItemByName(item.referenceName) : null;

  if (entry?.mode === 'readonly' || entry?.mode === 'provided') {
    return `تقرأ هذه الخاصية بعد الحصول على SDL_PropertiesID من ${referenceItem?.name || 'الدالة المرجعية'} ثم تستخرج قيمتها بدالة القراءة المناسبة مثل SDL_GetStringProperty أو SDL_GetNumberProperty بحسب نوعها.`;
  }

  if (entry?.mode === 'readwrite') {
    return `تُستخدم بعد استدعاء ${referenceItem?.name || 'الدالة المرجعية'} والحصول على وعاء الخصائص، ثم تقرأها أو تعدلها قبل أن تعتمد بقية المسارات على قيمتها الحالية.`;
  }

  return `تُستخدم قبل استدعاء ${referenceItem?.name || 'الدالة المرجعية'} أثناء تجهيز SDL_PropertiesID، ثم تمرر الوعاء إلى الدالة لكي تقرأ هذه الخاصية ضمن عملية الإنشاء أو الفتح أو التهيئة.`;
}

function buildSdl3PropertyBenefit(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const name = String(item?.name || '');
  if (/FILENAME/.test(name)) return 'تفيدك عندما تريد أن تجعل SDL تتعامل مباشرة مع ملف محدد دون أن تبني SDL_IOStream بنفسك.';
  if (/IOSTREAM_POINTER/.test(name)) return 'تفيدك عندما تأتي البيانات من ذاكرة أو شبكة أو طبقة إدخال/إخراج خاصة بك، فلا تضطر إلى المرور عبر ملفات على القرص.';
  if (/IOSTREAM_AUTOCLOSE/.test(name)) return 'تفيدك في ضبط ملكية المجرى بوضوح حتى لا تغلقه مبكرًا أو تتركه مفتوحًا بعد انتهاء المورد.';
  if (/_TYPE_STRING/.test(name)) return 'تفيدك عندما لا يكفي الامتداد أو لا يوجد اسم ملف أصلًا، وتحتاج إجبار SDL على استخدام صيغة معينة.';
  if (/QUALITY/.test(name)) return 'تفيدك في التحكم بحجم الملف الناتج وجودته بدل الاكتفاء بالسلوك الافتراضي للمشفر.';
  if (/TIMEBASE_NUMERATOR/.test(name)) return 'تفيدك في تعريف وحدة الزمن التي تعتمد عليها قيم pts حتى لا تُفسَّر التواقيت بشكل خاطئ.';
  if (/TIMEBASE_DENOMINATOR/.test(name)) return 'تفيدك في استكمال معادلة الزمن التي تُحوِّل pts إلى ثوانٍ بالقيمة الصحيحة.';
  if (/FILTERS_POINTER|NFILTERS/.test(name)) return 'تفيدك في حصر الملفات الظاهرة للمستخدم في الصيغ التي يقبلها تطبيقك فعلًا.';
  if (/WINDOW_POINTER/.test(name)) return 'تفيدك في ربط الحوار أو المورد بالنافذة الصحيحة حتى يكون السلوك البصري والتركيزي متوافقًا مع الواجهة.';
  if (/LOCATION_STRING/.test(name)) return 'تفيدك في بدء الحوار أو العملية من المسار المتوقع بدل إجبار المستخدم على التنقل إليه يدويًا كل مرة.';
  if (/MANY_BOOLEAN/.test(name)) return 'تفيدك عندما تحتاج جمع أكثر من عنصر في عملية واحدة بدل تكرار الحوار أو الاستدعاء.';
  if (/TITLE_STRING|ACCEPT_STRING|CANCEL_STRING/.test(name)) return 'تفيدك في جعل النصوص الظاهرة للمستخدم مطابقة لسياق التطبيق بدل النصوص العامة.';
  if (/ARGS_POINTER|CMDLINE_STRING/.test(name)) return 'تفيدك في تحديد ما الذي سيُشغَّل فعليًا وكيف ستصل المعاملات إلى العملية الجديدة.';
  if (/STDIN_|STDOUT_|STDERR_/.test(name)) return 'تفيدك في إعادة توجيه قنوات الإدخال والإخراج القياسية بحيث تدمج العملية الجديدة في مسار I/O يخص تطبيقك.';
  if (/BACKGROUND/.test(name)) return 'تفيدك عندما تريد تشغيل العملية دون ربطها بمسار تفاعلي مباشر أو دون انتظار خرجها الكامل.';
  if (/NAME_STRING/.test(name) && /GPU_DEVICE/.test(name)) return 'تفيدك في عرض اسم الجهاز للمستخدم أو في السجل، لكن من دون الاعتماد عليه كمفتاح منطقي ثابت.';
  if (/VERSION|DRIVER_INFO|DRIVER_NAME/.test(name)) return 'تفيدك في التشخيص وعرض معلومات النظام، لا في اتخاذ قرارات منطقية مبنية على تنسيق نصي غير ثابت.';
  if (/WINDOW_CREATE_|RENDERER_CREATE_|GPU_DEVICE_CREATE_/.test(name)) return 'تفيدك لأن SDL تجمع خيارات الإنشاء الكثيرة داخل وعاء خصائص واحد بدل تضخيم التوقيع بمعاملات كثيرة متخصصة.';
  return 'تفيدك لأن هذا المفتاح يمرر الإعداد أو المعلومة بالاسم الرسمي والنوع الصحيح، ويمنع الاعتماد على نصوص أو أرقام يدوية معرضة للأخطاء.';
}

function buildSdl3PropertyRequirementText(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const entry = getSdl3PropertyEntry(item);
  const descriptionText = String(entry?.descriptionText || '');

  if (entry?.mode === 'readonly' || entry?.mode === 'provided') {
    return 'هذه ليست خاصية تمررها عند الإنشاء؛ SDL توفرها لك للقراءة فقط عندما تكون متاحة في الوعاء المرتبط بهذا المورد أو بهذه المنصة.';
  }

  if (entry?.mode === 'readwrite') {
    return 'خاصية اختيارية قابلة للقراءة والكتابة بعد الحصول على وعاء الخصائص من الدالة المرجعية.';
  }

  let match = /^.+? This is a required property\.?$/i.exec(descriptionText);
  if (match) {
    return 'خاصية إلزامية ويجب ضبطها قبل تنفيذ هذا الاستدعاء.';
  }

  match = /This is required if\s+(.+?)\s+isn't set\.?$/i.exec(descriptionText);
  if (match) {
    const relatedNames = collectSdl3PropertyNames(match[1]);
    if (relatedNames.length) {
      return `خاصية مطلوبة إذا لم تُضبط ${joinSdl3NaturalList(relatedNames)}.`;
    }
    return 'خاصية مطلوبة في حالة عدم وجود البديل الذي تشير إليه الملاحظات الرسمية.';
  }

  match = /This is required if\s+(.+?)\s+aren't set\.?$/i.exec(descriptionText);
  if (match) {
    const relatedNames = collectSdl3PropertyNames(match[1]);
    if (relatedNames.length) {
      return `خاصية مطلوبة إذا لم تُضبط ${joinSdl3NaturalList(relatedNames)} معًا.`;
    }
    return 'خاصية مطلوبة إذا لم تُضبط الخصائص البديلة المذكورة في الملاحظات الرسمية.';
  }

  if (/\boptional\b/i.test(descriptionText)) {
    return 'خاصية اختيارية.';
  }

  return 'خاصية اختيارية ما لم يفرض المرجع استخدامها في حالة خاصة مذكورة في القيود.';
}

function buildSdl3PropertyDefaultText(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const entry = getSdl3PropertyEntry(item);
  const descriptionText = String(entry?.descriptionText || '');

  if (entry?.mode === 'readonly' || entry?.mode === 'provided') {
    return 'لا توجد قيمة افتراضية تضبطها أنت هنا؛ SDL تكتب القيمة الفعلية وقت التشغيل إذا كانت المعلومة متاحة.';
  }

  let match = /defaults to the file extension if\s+([A-Z0-9_]+)\s+is set\.?$/i.exec(descriptionText);
  if (match) {
    return `إذا ضُبطت ${match[1]} فستُستنتج القيمة الافتراضية من امتداد الملف.`;
  }

  match = /defaults to\s+([A-Z0-9_]+)\s+if set,\s+or\s+([^.]*)\s+otherwise\.?$/i.exec(descriptionText);
  if (match) {
    return `القيمة الافتراضية هي ${match[1]} إذا كانت مضبوطة، وإلا ${match[2].trim()}.`;
  }

  match = /This defaults to\s+([^.]*)\.?$/i.exec(descriptionText);
  if (match) {
    return `القيمة الافتراضية هي ${match[1].trim()}.`;
  }

  match = /defaults to\s+([^.]*)\.?$/i.exec(descriptionText);
  if (match) {
    return `القيمة الافتراضية هي ${match[1].trim()}.`;
  }

  match = /\(defaults\s+true\)/i.exec(descriptionText);
  if (match) {
    return 'القيمة الافتراضية هي true.';
  }

  return 'لا توجد قيمة افتراضية موثقة محليًا لهذه الخاصية.';
}

function translateSdl3PropertyConstraintText(text) {
  const value = normalizeSdl3PropertyRemarkText(text);
  if (!value) {
    return '';
  }

  let match = /^This should not be closed until the\s+(.+?)\s+is closed\.?$/i.exec(value);
  if (match) {
    return `يجب إبقاء ${match[1].trim()} صالحًا ومفتوحًا حتى يُغلق المورد المرتبط به.`;
  }

  match = /^Ignored if the dialog is an "([^"]+)" dialog\.?$/i.exec(value);
  if (match) {
    return `تُتجاهل هذه الخاصية إذا كان الحوار من نوع "${match[1]}".`;
  }

  match = /^If non-NULL,\s+the array of filters must remain valid at least until the callback is invoked\.?$/i.exec(value);
  if (match) {
    return 'إذا لم تكن القيمة NULL فيجب أن تبقى مصفوفة المرشحات صالحة على الأقل حتى يُستدعى رد النداء.';
  }

  match = /^The higher the number,\s+the higher the quality and file size\.?$/i.exec(value);
  if (match) {
    return 'كلما ارتفع الرقم ارتفعت الجودة وازداد حجم الملف الناتج.';
  }

  match = /^Some \.fon fonts will have several sizes embedded in the file,\s+so the point size becomes the index of choosing which size\.?$/i.exec(value);
  if (match) {
    return 'بعض خطوط ‎.fon‎ تحتوي عدة أحجام داخل الملف نفسه، لذلك تتحول قيمة الحجم هنا إلى فهرس يحدد أي حجم مضمّن سيُختار.';
  }

  match = /^If the value is too high,\s+the last indexed size will be the default\.?$/i.exec(value);
  if (match) {
    return 'إذا كانت القيمة أكبر من آخر حجم متاح فسيُستخدم آخر حجم مفهرس افتراضيًا.';
  }

  match = /^This property can change dynamically when\s+([A-Za-z0-9_]+)\s+is sent\.?$/i.exec(value);
  if (match) {
    return `قد تتغير هذه الخاصية ديناميكيًا عند وصول الحدث ${match[1]}.`;
  }

  match = /^This property can take any value that is supported by\s+([A-Za-z0-9_]+)\s*\(\)\s+for the renderer\.?$/i.exec(value);
  if (match) {
    return `تقبل هذه الخاصية أي قيمة يدعمها ${match[1]}() لهذا المصيّر.`;
  }

  match = /^This property has no effect if\s+([A-Z0-9_]+)\s+is set\.?$/i.exec(value);
  if (match) {
    return `لا يكون لهذه الخاصية أي أثر إذا ضُبطت ${match[1]}.`;
  }

  match = /^This property is only important if you want to start programs that does non-standard command-line processing,\s+and in most cases using\s+([A-Z0-9_]+)\s+is sufficient\.?$/i.exec(value);
  if (match) {
    return `لا تصبح هذه الخاصية مهمة إلا إذا كنت تحتاج تشغيل برامج تعالج سطر الأوامر بطريقة غير قياسية، وفي أغلب الحالات تكون ${match[1]} كافية.`;
  }

  match = /^All properties are optional and may differ between GPU backends and SDL versions\.?$/i.exec(value);
  if (match) {
    return 'جميع هذه الخصائص اختيارية، وقد تختلف باختلاف باكند GPU وباختلاف إصدار SDL.';
  }

  match = /^These properties are shared with the underlying joystick object\.?$/i.exec(value);
  if (match) {
    return 'هذه الخصائص مشتركة مع كائن joystick الأساسي الذي يقوم عليه هذا العنصر.';
  }

  match = /^Note that each platform may or may not support any of the properties\.?$/i.exec(value);
  if (match) {
    return 'قد تختلف المنصات في دعم هذه الخصائص، لذلك لا تفترض أن جميعها متاح على كل نظام.';
  }

  match = /^On POSIX platforms,\s*wait\(\)\s+and\s+waitpid\(-1,\s*\.\.\.\)\s+should not be called,\s*and\s+SIGCHLD\s+should not be ignored or handled because those would prevent SDL from properly tracking the lifetime of the underlying process\.\s*You should use\s+([A-Za-z0-9_]+)\s*\(\)\s*instead\.?$/i.exec(value);
  if (match) {
    return `على منصات POSIX لا تستدعِ wait() أو waitpid(-1, ...) ولا تتجاهل SIGCHLD ولا تعالجه، لأن ذلك يمنع SDL من تتبع دورة حياة العملية بشكل صحيح. استخدم ${match[1]}() بدلًا من ذلك.`;
  }

  match = /^Contains the name of the underlying device as reported by the system driver\..*$/i.exec(value);
  if (match) {
    return 'هذه القيمة تحمل الاسم الذي يبلّغ عنه برنامج تشغيل النظام للجهاز الفعلي. تنسيق هذا النص غير موحّد، وقد يتغير بين الأجهزة والتعريفات والإصدارات، لذلك لا تعتمد عليه في التحليل البرمجي.';
  }

  match = /^Contains the self-reported name of the underlying system driver\.?$/i.exec(value);
  if (match) {
    return 'هذه القيمة تحمل الاسم الذي يعرّف به برنامج التشغيل نفسه.';
  }

  match = /^Contains the self-reported version of the underlying system driver\..*$/i.exec(value);
  if (match) {
    return 'هذه القيمة تحمل نسخة مختصرة يبلّغ عنها برنامج التشغيل. إذا كانت الخاصية SDL_PROP_GPU_DEVICE_DRIVER_INFO_STRING متاحة فالأفضل قراءتها لأنها تعطي معلومات أوضح عن النسخة الدقيقة.';
  }

  match = /^Contains the detailed version information of the underlying system driver as reported by the driver\..*$/i.exec(value);
  if (match) {
    return 'هذه القيمة تحمل معلومات تفصيلية عن نسخة برنامج التشغيل كما يبلّغ عنها السائق نفسه. تنسيقها غير موحّد وقد تحتوي أسطرًا متعددة، لكنها غالبًا أوضح من الخاصية SDL_PROP_GPU_DEVICE_DRIVER_VERSION_STRING.';
  }

  const translated = preferArabicSdl3DocText(value, null, {
    section: 'remarks',
    fallbackText: ''
  });
  if (translated && !/[A-Za-z]{3,}/.test(stripTooltipIdentifierNoise(stripMarkup(translated)))) {
    return translated;
  }
  return '';
}

function buildSdl3PropertyConstraints(item) {
  if (!isSdl3PropertyMacro(item)) {
    return '';
  }

  const entry = getSdl3PropertyEntry(item);
  const profile = item?.referenceName ? getSdl3PropertyReferenceProfile(item.referenceName) : null;
  const notes = [];

  if (entry?.contextHeader) {
    notes.push(translateSdl3PropertyContextHeader(entry.contextHeader));
  }

  (entry?.extraNotes || []).forEach((note) => {
    if (/^Strings that have been found in the wild include:?$/i.test(note)) {
      return;
    }
    if (/^[A-Za-z0-9 .()\-_:\/]+$/.test(note) && !/\b(?:This|Contains|Ignored|If|All|Note|On|The)\b/.test(note)) {
      return;
    }
    const translated = translateSdl3PropertyConstraintText(note);
    if (translated) {
      notes.push(translated);
    }
  });

  (profile?.globalNotes || []).forEach((note) => {
    const translated = translateSdl3PropertyConstraintText(note);
    if (translated) {
      notes.push(translated);
    }
  });

  return [...new Set(notes.filter(Boolean))].join(' ');
}

function buildSdl3PropertyMacroProfile(item) {
  if (!isSdl3PropertyMacro(item)) {
    return null;
  }

  return {
    name: String(item?.name || '').trim(),
    officialDescription: buildSdl3PropertyOfficialDescription(item),
    meaning: buildSdl3PropertyMeaning(item),
    when: buildSdl3PropertyWhenToUse(item),
    benefit: buildSdl3PropertyBenefit(item),
    requirement: buildSdl3PropertyRequirementText(item),
    defaultValue: buildSdl3PropertyDefaultText(item),
    constraints: buildSdl3PropertyConstraints(item),
    valueType: getSdl3PropertyValueTypeLabel(item, getSdl3PropertyEntry(item))
  };
}

function buildSdl3MacroMeaning(item) {
  const macroKind = buildSdl3MacroKind(item);
  const definition = parseSdl3MacroDefinition(item?.syntax || '');
  if (isSdl3PropertyMacro(item)) {
    return buildSdl3PropertyMacroProfile(item)?.meaning || buildSdl3PropertyFallbackDescription(item);
  }
  if (definition.value) {
    return `هذا الماكرو يثبت القيمة ${definition.value} باسم رمزي واضح يمكن استخدامه داخل الكود.`;
  }
  return buildSdl3NameMeaning(item);
}

function buildSdl3MacroPurpose(item) {
  if (isSdl3PropertyMacro(item)) {
    return buildSdl3PropertyMacroProfile(item)?.benefit
      || (item?.referenceName
        ? `تستخدمه عندما تحتاج ضبط خاصية مع ${item.referenceName} أو قراءة الخاصية نفسها من وعاء الخصائص المناسب.`
        : 'تستخدمه لقراءة أو كتابة خاصية محددة داخل نظام الخصائص في SDL3.');
  }
  if (/STYLE|FLAG/i.test(item?.name || '')) {
    return 'تستخدمه لاختيار نمط أو تفعيل خيار محدد دون اللجوء إلى أرقام صريحة داخل الكود.';
  }
  return 'تستخدمه لأن SDL3 يبني عليه سلوكًا أو إعدادًا متكررًا تحت اسم ثابت وواضح.';
}

function buildSdl3MacroPracticalUsage(item) {
  if (isSdl3PropertyMacro(item)) {
    return buildSdl3PropertyMacroProfile(item)?.when
      || (item?.referenceName
        ? `تستخدمه عادة مع ${item.referenceName} أو مع SDL_PropertiesID عند قراءة الخاصية أو كتابتها، بحيث تمرر المفتاح الرسمي بدل كتابة اسم خاصية يدوي قد لا يطابق ما تتوقعه SDL.`
        : 'تستخدمه مع SDL_PropertiesID أو مع الدوال التي تقرأ الخصائص وتكتبها، بحيث تمرر المفتاح الرسمي للخاصية بدل نص يدوي قد يختلف في الاسم أو النوع.');
  }
  if (isSdl3FunctionLikeMacro(item)) {
    return 'تكتبه في الموضع الذي يحتاج تعبيرًا أو نتيجة ثابتة أو توسعة جاهزة قبل الترجمة، ولا تتعامل معه كدالة لها عنوان أو دورة استدعاء مستقلة وقت التشغيل.';
  }
  if (/STYLE|FLAG|MASK/i.test(item?.name || '')) {
    return 'تمرره عادة كثابت رسمي داخل الحقول أو المعاملات أو الشروط لاختيار نمط أو تفعيل خيار أو اختبار بت معين بدل استخدام أرقام صريحة يصعب فهمها لاحقًا.';
  }
  return 'تستخدمه مباشرة باسمِه الرمزي داخل الموضع الذي تتوقع فيه SDL هذه القيمة أو هذا المفتاح أو هذا التوسيع، حتى يبقى الكود مطابقًا للهيدر الرسمي وواضح المعنى.';
}

function buildSdl3ParameterRole(param, item) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const key = `${name} ${type}`.toLowerCase();
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

  if (specialProfile?.parameterRoles?.[name]) {
    return specialProfile.parameterRoles[name];
  }
  if (versionMacroProfile?.role) {
    return versionMacroProfile.role;
  }

  if (/callback/.test(key)) return 'هذا هو منفذ استلام النتيجة النهائية من SDL3 بعد اكتمال العملية عبر رد نداء.';
  if (/userdata/.test(key)) return 'هذا سياقك الخاص الذي يعود مع رد النداء حتى تربط النتيجة بالكائن أو الحالة الصحيحة في تطبيقك.';
  if (name === 'props' || /propertiesid/i.test(type)) return 'هذا وعاء الإعدادات الاختيارية الذي يغيّر تفاصيل السلوك بدل توسيع توقيع الدالة بعشرات المعاملات.';
  if (name === 'type' || /type|flags|mode/i.test(type)) return 'هذا المعامل يختار النمط أو الفئة أو السياسة التي ستنفذها الدالة.';
  if (/window/.test(key)) return 'هذه هي النافذة المالكة أو المستهدفة التي ستطبق عليها العملية أو ترتبط بها.';
  if (/renderer/.test(key)) return 'هذا هو المصير الذي ستطبق عليه العملية الرسومية.';
  if (/texture/.test(key)) return 'هذا هو مورد الخامة الذي ستقرأه الدالة أو تعدله.';
  if (/surface/.test(key)) return 'هذا هو السطح الذي يحمل بيانات البكسلات التي تعمل عليها الدالة.';
  if (/audiodecoder/.test(key)) return 'هذا هو مفكك الترميز الصوتي الذي ستقرأ الدالة اسمه أو مواصفاته أو خصائصه الحالية.';
  if (/decoder/.test(key)) return 'هذا هو كائن مفكك الترميز الذي تحمل الدالة حالته الحالية أو تستخرج منه البيانات والإطارات.';
  if (/mix_audio|\baudio\b/.test(key)) return 'هذا هو المورد الصوتي الذي ستقرأ الدالة مدته أو خصائصه أو تنسيقه أو حالته الحالية منه.';
  if (/mix_track|\btrack\b/.test(key)) return 'هذا هو المسار الذي ستقرأ الدالة حالته الحالية أو المورد المرتبط به أو أحد مقاديره التشغيلية.';
  if (/mix_group|\bgroup\b/.test(key)) return 'هذه هي مجموعة المزج التي ستقرأ الدالة خصائصها أو المِكسر المرتبط بها.';
  if (/audiospec|\bspec\b/.test(key)) return 'هذه هي بنية SDL_AudioSpec التي ستكتب الدالة داخلها مواصفات الصوت التي استعلمت عنها.';
  if (/point3d|\bposition\b/.test(key)) return 'هذه هي البنية التي تخرج الدالة من خلالها الموضع الحالي للمسار في الفضاء ثلاثي الأبعاد.';
  if (/\btag\b/.test(key)) return 'هذا هو الوسم النصي الذي تستخدمه الدالة لتصفية العناصر المطابقة داخل المِكسر.';
  if (/\bcount\b/.test(key) && /\*/.test(type)) return 'هذا مؤشر خرج اختياري تكتب الدالة فيه عدد العناصر التي أعادتها للمستدعي.';
  if (/encoder/.test(key)) return 'هذا هو كائن الترميز الذي تكتب الدالة إليه أو تغلقه أو تستعلم عن حالته.';
  if (/stream|iostream|io/.test(key)) return 'هذا هو المجرى الذي تُقرأ منه البيانات أو تُكتب إليه.';
  if (/file|filename|path|location/.test(key)) return 'هذا يحدد الملف أو المسار الذي ستتعامل معه الدالة.';
  if (/filter/.test(key)) return 'هذا يحدد المرشح أو قاعدة الانتقاء التي تقيد العناصر المقبولة.';
  if (/count|nfilters|num/.test(key)) return 'هذا يحدد عدد العناصر التي يجب على SDL3 أن يقرأها من المصفوفة أو القائمة المرتبطة.';
  if (/index/.test(key)) return 'هذا يحدد الموضع العددي للعنصر المطلوب داخل مجموعة أو قائمة.';
  if (/(^| )x( |$)|(^| )y( |$)|width|height|size/.test(key)) return 'هذا يحدد موضعًا أو حجمًا أو بعدًا تحتاجه العملية كي تُنفذ بشكل صحيح.';
  if (/name|title/.test(key)) return 'هذا النص يحدد الاسم أو العنوان الذي سيظهر للمستخدم أو يُسجل داخليًا.';
  if (/color|format/.test(key)) return 'هذا يحدد تنسيق البيانات أو مظهرها العملي أثناء التنفيذ.';
  if (/device|driver/.test(key)) return 'هذا يحدد المورد أو المشغل الذي ستعمل عليه العملية.';
  if (/event/.test(key)) return 'هذا ينقل الحدث أو البيانات التي تريد SDL3 أن تقرأها أو تعبئها.';
  return `هذا هو المدخل الذي تعتمد عليه هذه الدالة لتحديد ${name || 'القيمة المطلوبة'} أثناء تنفيذ العملية الفعلية.`;
}

function buildSdl3ParameterPurpose(param, item) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

  if (specialProfile?.parameterPurposes?.[name]) {
    return specialProfile.parameterPurposes[name];
  }
  if (versionMacroProfile?.purpose) {
    return versionMacroProfile.purpose;
  }

  if (/callback/i.test(name) || /Callback/.test(type)) return 'لأن نتيجة هذه العملية لا تكفيها قيمة راجعة واحدة، أو لأنها قد تصل لاحقًا عبر رد نداء.';
  if (/userdata/i.test(name)) return 'لأن رد النداء وحده لا يعرف سياق تطبيقك، فيحتاج مرجعًا تعيده SDL3 لك كما هو.';
  if (name === 'props' || /PropertiesID/.test(type)) return 'لأن هذا الاستدعاء قابل للتوسعة عبر خصائص كثيرة، وSDL3 يجمّعها في وعاء واحد مرن.';
  if (name === 'type' || /Type|Flags|Mode/.test(type)) return 'لأن الدالة عامة وتحتاج منك تحديد أي فرع أو نمط من السلوك المطلوب.';
  if (/audiodecoder/i.test(name) || /MIX_AudioDecoder/.test(type)) return 'لأن هذا الاستدعاء يقرأ أو يصف مفكك ترميز صوتيًا محددًا، وليس بيئة فك الترميز كلها مرة واحدة.';
  if (/decoder/i.test(name) || /Decoder/.test(type)) return 'لأن هذا الاستدعاء يعمل على مفكك ترميز محدد يحتفظ بحالة القراءة الحالية والخصائص المرتبطة بها.';
  if (/mix_audio|\baudio\b/i.test(`${name} ${type}`)) return 'لأن المعلومات أو الخصائص التي تريدها مرتبطة بمورد صوتي محدد يجب تمريره صراحة.';
  if (/mix_track|\btrack\b/i.test(`${name} ${type}`)) return 'لأن هذا الاستدعاء يقرأ حالة أو بيانات مرتبطة بمسار صوتي محدد داخل المِكسر.';
  if (/mix_group|\bgroup\b/i.test(`${name} ${type}`)) return 'لأن هذا الاستدعاء يعمل على مجموعة مزج محددة يجب تحديدها صراحة.';
  if (/audiospec|\bspec\b/i.test(`${name} ${type}`)) return 'لأن نتيجة هذا الاستدعاء تتكون من عدة مواصفات صوتية مترابطة تحتاج بنية تخرج من خلالها.';
  if (/point3d|\bposition\b/i.test(`${name} ${type}`)) return 'لأن الموضع الثلاثي الأبعاد يتكون من عدة مركبات مترابطة تحتاج بنية تكتب الدالة داخلها.';
  if (/\btag\b/i.test(name)) return 'لأن الدالة تحتاج معيارًا نصيًا واضحًا لتصفية المسارات أو العثور على العناصر المطابقة.';
  if (/\bcount\b/i.test(name) && /\*/.test(type)) return 'لأن النتيجة قد تحتوي عدة عناصر، ويحتاج التطبيق أحيانًا عددها الفعلي بجانب المصفوفة المعادة.';
  if (/encoder/i.test(name) || /Encoder/.test(type)) return 'لأن هذا الاستدعاء يعمل على مشفر ترميز محدد يحتفظ بحالة الكتابة والبيانات المضافة إليه.';
  return 'لأن هذا الاستدعاء لا يستطيع تطبيق هذا المسار دون هذه القيمة في موضعها الصحيح من التوقيع.';
}

function buildSdl3ParameterInputHint(param, item) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const key = `${name} ${type}`.toLowerCase();
  const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

  if (versionMacroProfile?.usage) {
    return versionMacroProfile.usage;
  }

  if (/callback/i.test(name) || /Callback/.test(type)) {
    return `مرر callback يطابق التوقيع ${type || name} حتى تستطيع SDL استدعاء كودك بالمعاملات الصحيحة عند اكتمال العملية أو عند وقوع الحدث.`;
  }
  if (/userdata/i.test(name)) {
    return 'مرر مؤشرًا إلى الكائن أو السياق الذي تريد استعادته داخل callback؛ وإذا لم تحتج سياقًا مخصصًا فيمكنك تمرير NULL.';
  }
  if (name === 'props' || /PropertiesID/.test(type)) {
    return 'مرر وعاء خصائص جهزته مسبقًا ويحمل المفاتيح التي تغير إعدادات هذا الاستدعاء؛ وعاء فارغ يعني الاعتماد على السلوك الافتراضي.';
  }
  if (/audiodecoder/i.test(name) || /MIX_AudioDecoder/.test(type)) {
    return 'مرر MIX_AudioDecoder صالحًا سبق إنشاؤه، لأن الدالة ستقرأ منه الاسم أو المواصفات أو الخصائص الحالية.';
  }
  if (/decoder/i.test(name) || /Decoder/.test(type)) {
    return 'مرر مفكك ترميز صالحًا أنشأته من قبل، لأن الدالة ستقرأ منه الحالة الحالية أو تستخرج منه البيانات المطلوبة.';
  }
  if (/mix_audio|\baudio\b/i.test(`${name} ${type}`)) {
    return 'مرر MIX_Audio صالحًا سبق تحميله أو إنشاؤه، لأن الدالة ستقرأ منه المعلومة المطلوبة أو تعدله بحسب هذا الاستدعاء.';
  }
  if (/mix_track|\btrack\b/i.test(`${name} ${type}`)) {
    return 'مرر MIX_Track صالحًا يمثل المسار الذي تريد قراءة حالته أو تغييرها أو استخراج المورد المرتبط به.';
  }
  if (/mix_group|\bgroup\b/i.test(`${name} ${type}`)) {
    return 'مرر MIX_Group صالحًا يمثل مجموعة المزج التي تريد العمل عليها.';
  }
  if (/audiospec|\bspec\b/i.test(`${name} ${type}`)) {
    return 'مرر مؤشرًا صالحًا إلى SDL_AudioSpec لأن الدالة ستكتب داخله المواصفات الصوتية المكتشفة عند النجاح.';
  }
  if (/point3d|\bposition\b/i.test(`${name} ${type}`)) {
    return 'مرر مؤشرًا صالحًا إلى MIX_Point3D لأن الدالة ستملأ داخله الإحداثيات الحالية عند النجاح.';
  }
  if (/\btag\b/i.test(name)) {
    return 'مرر سلسلة نصية تمثل الوسم الذي تبحث عنه أو تعتمد عليه في التصفية داخل هذا الاستدعاء.';
  }
  if (/\bcount\b/i.test(name) && /\*/.test(type)) {
    return 'مرر مؤشرًا إلى int إذا كنت تريد أن تكتب الدالة فيه عدد العناصر المعادة، أو مرر NULL إذا لم تحتج هذا العدد.';
  }
  if (/encoder/i.test(name) || /Encoder/.test(type)) {
    return 'مرر مشفر ترميز صالحًا تضيف إليه البيانات أو تستعلم عن حالته أو تنهيه؛ يجب أن يكون قد أُنشئ من المسار الصحيح.';
  }
  if (/stream|iostream|io/.test(key)) {
    return 'مرر مجرى إدخال/إخراج صالحًا ومفتوحًا بالوضع المناسب للقراءة أو الكتابة بحسب هذه العملية.';
  }
  if (/file|filename|path|location/.test(key)) {
    return 'مرر مسارًا صحيحًا أو اسم ملف صالحًا يشير فعليًا إلى المصدر أو الوجهة التي تريد أن تعمل عليها الدالة.';
  }
  if (/window/.test(key)) {
    return 'مرر SDL_Window صالحًا إذا كانت العملية تعمل على نافذة موجودة بالفعل، لأن SDL ستطبق التغيير أو القراءة على هذه النافذة نفسها.';
  }
  if (/renderer/.test(key)) {
    return 'مرر SDL_Renderer صالحًا أنشأته مسبقًا، لأن الدالة ستنفذ الرسم أو الإعدادات على هذا المصير نفسه.';
  }
  if (/texture/.test(key)) {
    return 'مرر Texture صالحًا تريد قراءته أو تحديثه أو ربطه بهذه العملية.';
  }
  if (/surface/.test(key)) {
    return 'مرر Surface يحمل بيانات البكسلات الفعلية التي ستقرأها الدالة أو تضيفها أو تعدلها.';
  }
  if (/filter/.test(key)) {
    return 'مرر المرشح أو قائمة المرشحات التي تحدد ما العناصر المقبولة أثناء تنفيذ العملية.';
  }
  if (/count|nfilters|num/.test(key)) {
    return 'مرر العدد الحقيقي للعناصر في المصفوفة المرتبطة بهذا المعامل حتى لا تقرأ SDL بيانات ناقصة أو تتجاوز الحدود الصحيحة.';
  }
  if (/index/.test(key)) {
    return 'مرر فهرسًا صالحًا داخل النطاق المتوقع، لأن الفهرس يحدد أي عنصر ستقرأه الدالة أو ستعدله.';
  }
  if (/name|title/.test(key)) {
    return 'مرر النص الذي تريد أن تراه SDL أو المستخدم كما هو، مثل اسم مورد أو عنوان نافذة أو وسم مرئي.';
  }
  if (/flags|mode|type/.test(key)) {
    return 'مرر النوع أو الرايات أو الوضع الذي يحدد الفرع التنفيذي الصحيح لهذا الاستدعاء، لأن هذه القيمة تغير سلوك الدالة نفسه.';
  }

  return `مرر قيمة من النوع ${type || 'المطلوب'} تطابق الدور الذي تؤديه داخل هذا الاستدعاء، لأن SDL ستستخدمها مباشرة لتحديد السلوك أو المورد المستهدف.`;
}

function buildSdl3ParameterPracticalUsage(param, item) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const specialProfile = getSdl3SpecialFunctionProfile(item);
  const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

  if (specialProfile?.parameterUsage?.[name]) {
    return specialProfile.parameterUsage[name];
  }
  if (versionMacroProfile?.usage) {
    return versionMacroProfile.usage;
  }

  if (/callback/i.test(name) || /Callback/.test(type)) {
    return 'مرره كدالة أو lambda متوافقة مع التوقيع الرسمي، ثم ضع داخلها المنطق الذي يستقبل النتيجة أو يتعامل مع الحدث عند استدعاء SDL لها.';
  }
  if (/userdata/i.test(name)) {
    return 'مرر غالبًا مؤشرًا إلى بنية حالة أو كائن في تطبيقك، ثم استعده داخل callback كي تربط النتيجة بالسياق الصحيح.';
  }
  if (name === 'props' || /PropertiesID/.test(type)) {
    return 'يُمرر عادة بعد تجهيز SDL_PropertiesID بالمفاتيح المناسبة مثل SDL_PROP_*، ثم تستعمله الدالة لقراءة الإعدادات الاختيارية دون زيادة عدد المعاملات.';
  }
  if (/decoder/i.test(name) || /Decoder/.test(type)) {
    return 'يُمرر بعد إنشاء مفكك الترميز من دالة التحميل أو الفتح المناسبة، ثم تستخدمه هذه الدالة لقراءة إطار أو حالة أو بيانات وصفية من نفس المورد.';
  }
  if (/encoder/i.test(name) || /Encoder/.test(type)) {
    return 'يُمرر بعد تهيئة المشفر، ثم تستدعي الدالة لإضافة بيانات جديدة إليه أو للاستعلام عن حالته أو لإغلاقه في نهاية المسار.';
  }
  if (/stream|iostream|io/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة كمجرى مفتوح مسبقًا للقراءة أو الكتابة، وتبني قيمته على مصدر البيانات الفعلي الذي يعمل عليه هذا المسار.';
  }
  if (/file|filename|path|location/i.test(`${name} ${type}`)) {
    return 'يُمرر غالبًا كسلسلة نصية لمسار موجود أو وجهة إخراج صحيحة، وتختاره من الملف الذي تريد تحميله أو حفظه أو بدء العملية منه.';
  }
  if (/window/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة بمؤشر SDL_Window أعدته SDL_CreateWindow أو حصلت عليه من مسار آخر صالح، لأن العملية ستطبَّق على هذه النافذة نفسها.';
  }
  if (/renderer/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة بمؤشر SDL_Renderer صالح أنشئ مسبقًا، لأن الاستدعاء سيستخدم نفس واجهة الرسم أو إعداداتها الحالية.';
  }
  if (/texture/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة بخامة SDL_Texture صالحة مرتبطة بنفس مسار العرض، سواء لقراءتها أو تحديثها أو رسمها.';
  }
  if (/surface/i.test(`${name} ${type}`)) {
    return 'يُمرر غالبًا بسطح SDL_Surface يحمل البكسلات الحالية التي تريد قراءتها أو تعديلها أو تحويلها إلى مورد آخر.';
  }
  if (/count|nfilters|num/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة من size أو count فعلي للمصفوفة أو القائمة المرتبطة، حتى تقرأ SDL العدد الصحيح من العناصر دون تجاوز الحدود.';
  }
  if (/flags|mode|type/i.test(`${name} ${type}`)) {
    return 'يُمرر عادة كثابت أو رايات رسمية مثل SDL_* أو MIX_* أو IMG_* أو TTF_*، لأن هذه القيمة تختار النمط التنفيذي الصحيح بدل الأرقام المباشرة.';
  }

  return buildSdl3ParameterInputHint(param, item);
}

function buildSdl3ParameterMisuseImpact(param, item) {
  const name = String(param?.name || '').trim();
  const type = String(param?.type || '').trim();
  const key = `${name} ${type}`.toLowerCase();
  const versionMacroProfile = getSdl3MacroVersionParameterProfile(param, item);

  if (versionMacroProfile?.misuse) {
    return versionMacroProfile.misuse;
  }

  if (/callback/i.test(name) || /Callback/.test(type)) {
    return 'إذا كان التوقيع غير مطابق فقد تستدعي SDL الكود بوسائط لا يطابقها تعريفك، وهذا قد يقود إلى سلوك غير صحيح أو انهيار وقت التنفيذ.';
  }
  if (/userdata/i.test(name)) {
    return 'إذا مررت مؤشرًا غير صالح ثم حاول callback استخدامه فستقرأ بيانات غير مملوكة أو منتهية الصلاحية.';
  }
  if (name === 'props' || /PropertiesID/.test(type)) {
    return 'إذا احتوى وعاء الخصائص مفاتيح خاطئة أو أنواع قيم لا تطابق المتوقع فقد تتجاهل SDL بعضها أو تنفذ الاستدعاء بإعدادات غير مقصودة.';
  }
  if (/decoder|encoder/.test(key)) {
    return 'إذا كان الكائن غير صالح أو لم يُنشأ من المسار الصحيح فستفشل العملية أو ستقرأ SDL حالة لا تخص هذا المورد.';
  }
  if (/stream|iostream|io/.test(key)) {
    return 'إذا كان المجرى مغلقًا أو بالوضع الخاطئ فستفشل القراءة أو الكتابة وقد تتوقف العملية قبل اكتمالها.';
  }
  if (/file|filename|path|location/.test(key)) {
    return 'إذا كان المسار غير صحيح أو لا يشير إلى ملف متاح فستفشل العملية من البداية ولن تحصل على المورد المتوقع.';
  }
  if (/count|nfilters|num/.test(key)) {
    return 'إذا كان العدد لا يطابق حجم المصفوفة الفعلي فقد تقرأ SDL عناصر ناقصة أو تتجاوز حدود البيانات الصحيحة.';
  }
  if (/index/.test(key)) {
    return 'إذا كان الفهرس خارج النطاق فإما أن تفشل العملية أو تحصل على عنصر غير الذي تقصده.';
  }
  if (/flags|mode|type/.test(key)) {
    return 'إذا مررت نوعًا أو رايات لا تطابق هذا المسار فستسلك الدالة فرعًا غير صحيح أو سترفض التنفيذ.';
  }

  return 'إذا كانت القيمة غير صحيحة أو غير صالحة لهذا التوقيع فستفشل العملية أو ستعمل على مورد أو حالة غير مقصودين.';
}

function buildSdl3FieldMeaning(field, item) {
  const remarkMap = getSdl3FieldRemarkMap(item);
  if (remarkMap[field.name]) {
    return translateSdl3DocText(remarkMap[field.name], item);
  }

  if (item?.name === 'SDL_DialogFileFilter') {
    if (field.name === 'name') {
      return 'هذا الحقل هو الاسم الذي يراه المستخدم داخل نافذة اختيار الملفات ليفهم نوع الملفات التي يسمح بها هذا المرشح.';
    }
    if (field.name === 'pattern') {
      return 'هذا الحقل يحدد الامتدادات التي يقبلها المرشح فعليًا عند تصفية الملفات المعروضة داخل الحوار.';
    }
  }

  const key = `${field.name} ${field.type}`.toLowerCase();
  if (/name/.test(key)) return 'يحمل الاسم أو الوسم المقروء الذي يظهر للمستخدم أو يعرّف العنصر.';
  if (/pattern|mask|filter/.test(key)) return 'يحمل قاعدة المطابقة أو التصفية التي تستخدم عند الاختيار أو الفحص.';
  if (/count|size|length/.test(key)) return 'يحمل العدد أو الحجم الذي تعتمد عليه البنية لفهم البيانات المرتبطة بها.';
  if (/pointer|\*/.test(field.type)) return 'يحمل مرجعًا إلى بيانات خارجية أو إلى ذاكرة مملوكة من مكان آخر.';
  return `هذا الحقل جزء من الوصف العملي الذي تعتمد عليه ${item?.name || 'هذه البنية'} أثناء القراءة أو التهيئة أو الإرجاع.`;
}

function buildSdl3FieldOfficialDescription(field, item) {
  const remarkMap = getSdl3FieldRemarkMap(item);
  const fallback = buildSdl3FieldMeaning(field, item);
  if (remarkMap[field.name]) {
    return preferArabicSdl3DocText(remarkMap[field.name], item, {
      section: 'description',
      fallbackText: fallback
    }) || fallback;
  }
  return fallback;
}

function buildSdl3FieldPurpose(field, item) {
  if (item?.name === 'SDL_DialogFileFilter') {
    if (field.name === 'name') {
      return 'حتى يظهر لكل مرشح عنوان واضح يمكن للمستخدم اختياره بدل رؤية الامتدادات الخام فقط.';
    }
    if (field.name === 'pattern') {
      return 'حتى يعرف حوار الملفات أي الامتدادات يجب عرضها أو قبولها عند تفعيل هذا المرشح.';
    }
  }

  const key = `${field.name} ${field.type}`.toLowerCase();
  if (/name/.test(key)) return 'حتى يستطيع المستخدم أو الواجهة تمييز هذا العنصر نصيًا.';
  if (/pattern|filter/.test(key)) return 'حتى يعرف SDL3 أي الملفات أو القيم يجب قبولها أو عرضها.';
  if (/pointer|\*/.test(field.type)) return 'لأن البيانات الفعلية تعيش خارج البنية، والبنية تحتفظ فقط بالمرجع إليها.';
  return `لأن ${item?.name || 'هذه البنية'} لا تكتمل دلالتها التنفيذية دون هذا الحقل أو دون القيمة التي يمررها.`;
}

function buildSdl3FieldPracticalUsage(field, item) {
  if (item?.name === 'SDL_DialogFileFilter') {
    if (field.name === 'name') {
      return 'يُملأ عادة بسلسلة نصية قصيرة ومفهومة للمستخدم مثل اسم صيغة الملف أو فئة المستندات التي يمثلها هذا المرشح.';
    }
    if (field.name === 'pattern') {
      return 'يُملأ عادة بقائمة امتدادات مفصولة بفاصلة منقوطة مثل doc;docx أو بالقيمة "*" إذا كنت تريد مرشحًا عامًا لكل الملفات.';
    }
  }

  const key = `${field.name} ${field.type}`.toLowerCase();
  if (/name/.test(key)) return 'يُملأ عادة بنص يحدد الاسم الذي تحتاجه الواجهة أو السجل أو الدالة المرتبطة لتسمية هذا العنصر بوضوح.';
  if (/pattern|filter|mask/.test(key)) return 'يُملأ عادة بنمط مطابقة أو قاعدة تصفية أو قناع يحدد ما القيم أو الملفات أو البتات المقبولة في هذا السياق.';
  if (/count|size|length/.test(key)) return 'يُملأ عادة بالعدد أو الحجم الفعلي المرتبط بالمصفوفة أو الذاكرة أو البيانات التي تشير إليها بقية الحقول.';
  if (/pointer|\*/.test(field.type)) return 'يُملأ عادة بمؤشر صالح إلى بيانات أو مصفوفة أو بنية أخرى تم تجهيزها خارج هذه البنية، ثم تعتمد SDL على هذا المؤشر للوصول إلى المحتوى الفعلي.';
  return 'يُملأ هذا الحقل قبل الاستدعاء بالقيمة التي تصف هذا الجزء من البنية، أو يُقرأ بعد الاستدعاء إذا كانت SDL تكتب فيه نتيجة أو حالة راجعة.';
}

function buildSdl3OperationalProfile(item) {
  if (!item) {
    return null;
  }

  if (item.kind === 'function') {
    return {
      meaning: buildSdl3FunctionMeaning(item),
      why: buildSdl3FunctionPurpose(item),
      effect: buildSdl3EffectHint(item),
      when: buildSdl3WhenToUseHint(item)
    };
  }

  if (item.kind === 'type') {
    return {
      meaning: buildSdl3TypeMeaning(item),
      why: buildSdl3TypePurpose(item),
      effect: 'يظهر هذا النوع كحاوية بيانات أو كتوقيع رسمي يربط عدة قيم وسياقات داخل كيان واحد مفهوم.',
      when: 'استخدمه عندما يطلب منك SDL3 هذا النوع صراحة في المعاملات أو القيم الراجعة أو عند بناء بنية أكبر.'
    };
  }

  if (item.kind === 'macro') {
    const propertyProfile = isSdl3PropertyMacro(item) ? buildSdl3PropertyMacroProfile(item) : null;
    return {
      meaning: propertyProfile?.meaning || buildSdl3MacroMeaning(item),
      why: propertyProfile?.benefit || buildSdl3MacroPurpose(item),
      effect: isSdl3PropertyMacro(item)
        ? `يمثل مفتاح الخاصية الرسمي الذي يربط ${propertyProfile?.valueType || 'القيمة'} باسم ثابت تقرؤه SDL من SDL_PropertiesID.`
        : 'يعطيك اسمًا رمزيًا ثابتًا بدل الاعتماد على قيمة حرفية داخل الكود.',
      when: propertyProfile?.when || (item.referenceName
        ? `استخدمه عندما تبني المسار المرتبط بـ ${item.referenceName}.`
        : 'استخدمه في الموضع الذي يحتاجه SDL3 كاسم خاصية أو كثابت يضبط السلوك.'
      )
    };
  }

  if (item.kind === 'constant') {
    return {
      meaning: buildSdl3PrimaryMeaning(item),
      why: item.parentEnum ? `تستخدمها لاختيار حالة أو خيار محدد من بين قيم ${item.parentEnum}.` : buildSdl3UsageHint(item),
      effect: item.value ? `عند تمريرها فأنت تختار القيمة ${item.value} بهذا المعنى الرمزي.` : 'تغير المسار بحسب القيمة التي تمثلها.',
      when: 'استخدمها عندما يطلب الحقل أو المعامل قيمة محددة من هذا التعداد.'
    };
  }

  return {
    meaning: buildSdl3PrimaryMeaning(item),
    why: buildSdl3UsageHint(item),
    effect: 'هذا الكيان يضيف معنى أو وصفًا محددًا داخل SDL3.',
    when: 'استخدمه في المسارات التي يظهر فيها كمرجع أو كجزء من التوقيع الرسمي.'
  };
}

function renderSdl3OperationalProfile(item) {
  const profile = buildSdl3OperationalProfile(item);
  if (!profile) {
    return '';
  }

  const exactType = getSdl3ExactElementTypeInfo(item);
  const meaningParts = [
    renderSdl3PracticalText(profile.meaning, buildSdl3PrimaryMeaning(item)),
    renderSdl3PracticalText(buildSdl3ActualOperation(item), buildSdl3EffectHint(item))
  ].filter(Boolean);

  return `
    <section class="info-section">
      <h2>الشرح التحليلي</h2>
      ${renderSdl3InfoGrid([
        {label: '1) نوع العنصر', value: `<strong>${escapeHtml(exactType.display)}</strong>`, note: `ينتمي إلى ${escapeHtml(item.packageDisplayName || item.packageName || 'SDL3')}.`},
        {label: '2) المعنى الحقيقي', value: meaningParts.join('<br><br>'), note: ''},
        {label: '3) لماذا وُجد', value: renderSdl3PracticalText(profile.why, buildSdl3FunctionPurpose(item)), note: ''},
        {label: '4) لماذا يستخدمه المبرمج', value: renderSdl3PracticalText(buildSdl3PracticalBenefitDetailed(item), buildSdl3UsageHint(item)), note: ''},
        {label: '5) كيف يظهر في الاستخدام الفعلي', value: renderSdl3PracticalText(profile.when, buildSdl3WhenToUseHint(item)), note: ''},
        {label: '6) تنبيه', value: renderSdl3PracticalText(buildSdl3MissingOrMisuseImpact(item), buildSdl3EffectHint(item)), note: ''}
      ])}
    </section>
  `;
}

function renderSdl3StructFields(item) {
  const fields = parseSdl3StructFields(item?.syntax || '');
  if (!fields.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>حقول البنية</h2>
      <table class="params-table">
        <thead>
          <tr>
            <th>النوع</th>
            <th>الحقل</th>
            <th>الوصف الرسمي بالعربي</th>
            <th>المعنى الحقيقي</th>
            <th>لماذا يوجد؟</th>
            <th>الاستخدام الفعلي</th>
          </tr>
        </thead>
        <tbody>
          ${fields.map((field) => {
            const tooltip = buildSdl3FieldTooltip(field, item);
            return `
            <tr>
              <td>${renderSdl3TypeReference(field.type || '')}</td>
              <td><span class="field code-token code-link-static variable" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${field.name || ''}: ${tooltip.replace(/\n/g, ' - ')}`)}"><code dir="ltr" class="field">${escapeHtml(field.name || '')}</code></span></td>
              <td>${renderSdl3PracticalText(buildSdl3FieldOfficialDescription(field, item), buildSdl3FieldMeaning(field, item))}</td>
              <td>${renderSdl3PracticalText(buildSdl3FieldMeaning(field, item), 'حقل يشرح جزءًا من معنى هذه البنية.')}</td>
              <td>${renderSdl3PracticalText(buildSdl3FieldPurpose(field, item), 'حتى تكتمل البنية بالمعلومات التي تعتمد عليها SDL3.')}</td>
              <td>${renderSdl3PracticalText(buildSdl3FieldPracticalUsage(field, item), 'تُملأ هذه القيمة أو تُقرأ بحسب العقد الذي تحدده SDL لهذا الحقل.')}</td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderSdl3MacroDetails(item) {
  if (item?.kind !== 'macro') {
    return '';
  }

  if (isSdl3PropertyMacro(item)) {
    const propertyProfile = buildSdl3PropertyMacroProfile(item);
    return `
      <section class="info-section">
        <h2>تفصيل الخاصية</h2>
        ${renderSdl3InfoGrid([
          {label: 'الاسم', value: `<code dir="ltr" class="macro code-token">${escapeHtml(propertyProfile?.name || item.name || '')}</code>`, note: propertyProfile?.valueType ? `نوع القيمة: ${escapeHtml(propertyProfile.valueType)}` : ''},
          {label: 'الوصف الرسمي بالعربية', value: renderSdl3PracticalText(propertyProfile?.officialDescription, buildSdl3PropertyFallbackDescription(item, item?.referenceName ? findSdl3AnyItemByName(item.referenceName) : null)), note: ''},
          {label: 'المعنى الحقيقي', value: renderSdl3PracticalText(propertyProfile?.meaning, buildSdl3MacroMeaning(item)), note: ''},
          {label: 'متى تُستخدم', value: renderSdl3PracticalText(propertyProfile?.when, buildSdl3MacroPracticalUsage(item)), note: ''},
          {label: 'فائدتها العملية', value: renderSdl3PracticalText(propertyProfile?.benefit, buildSdl3MacroPurpose(item)), note: ''},
          {label: 'هل هي إلزامية أم اختيارية', value: renderSdl3PracticalText(propertyProfile?.requirement, 'تعتمد إلزاميتها على الدالة المرجعية والخصائص البديلة المذكورة في هذا القسم.'), note: ''},
          {label: 'القيمة الافتراضية إن وجدت', value: renderSdl3PracticalText(propertyProfile?.defaultValue, 'لا توجد قيمة افتراضية موثقة محليًا لهذه الخاصية.'), note: ''},
          {label: 'القيود أو الملاحظات المهمة', value: renderSdl3PracticalText(propertyProfile?.constraints, 'لا توجد قيود إضافية موثقة محليًا لهذه الخاصية.'), note: item.referenceName ? `المرجع المرتبط: ${escapeHtml(item.referenceName)}` : ''}
        ])}
      </section>
    `;
  }

  const definition = parseSdl3MacroDefinition(item.syntax || '');
  const executionPhase = isSdl3PropertyMacro(item)
    ? 'اسم الخاصية يثبت أثناء preprocessing، لكن القراءة والكتابة الفعلية لهذه الخاصية تحدثان وقت التشغيل.'
    : isSdl3FunctionLikeMacro(item)
      ? 'هذا ماكرو شبيه بالدالة، ويتمدد إلى تعبير C قبل الترجمة ولا يملك استدعاء runtime مستقل.'
      : 'يعرف قيمة ثابتة أو اسمًا رمزيًا أثناء preprocessing، ثم يظهر أثره وقت التشغيل عندما تمرره إلى دالة أو تستخدمه في شرط.';
  return `
    <section class="info-section">
      <h2>تفكيك الماكرو</h2>
      ${renderSdl3InfoGrid([
        {label: 'نوع الماكرو', value: buildSdl3MacroKind(item), note: ''},
        {label: 'الوصف الرسمي بالعربي', value: renderSdl3PracticalText(buildSdl3OfficialDescription(item), buildSdl3MacroMeaning(item)), note: ''},
        {label: 'المعنى الحقيقي', value: renderSdl3PracticalText(buildSdl3MacroMeaning(item), buildSdl3PrimaryMeaning(item)), note: ''},
        {label: 'الاستخدام الفعلي', value: renderSdl3PracticalText(buildSdl3MacroPracticalUsage(item), buildSdl3MacroPurpose(item)), note: ''},
        {label: 'متى يعمل؟', value: executionPhase, note: ''},
        {label: 'القيمة/التوسعة', value: (definition.rawValue || definition.value) ? renderSdl3InlineCodeSnippet(definition.rawValue || definition.value, item, 'macro code-token') : 'غير موثقة محليًا', note: ''}
      ])}
    </section>
  `;
}

function renderSdl3TypeDetails(item) {
  if (item?.kind !== 'type') {
    return '';
  }

  const exactType = getSdl3ExactElementTypeInfo(item);
  return `
    <section class="info-section">
      <h2>تفصيل النوع</h2>
      ${renderSdl3InfoGrid([
        {label: 'الوصف الرسمي بالعربي', value: renderSdl3PracticalText(buildSdl3OfficialDescription(item), buildSdl3PrimaryMeaning(item)), note: ''},
        {label: 'الاستخدام الفعلي', value: renderSdl3PracticalText(buildSdl3TypePracticalUsage(item), buildSdl3TypePurpose(item)), note: ''},
        {label: 'كيف يظهر في الكود', value: renderSdl3PracticalText(buildSdl3TypeCodeAppearance(item), buildSdl3UsageHint(item)), note: ''},
        {label: 'نوعه الدقيق', value: escapeHtml(exactType.display), note: ''}
      ])}
    </section>
  `;
}

function buildSdl3ReferenceTooltip(item) {
  const cacheKey = String(item?.name || '').trim();
  if (!cacheKey) {
    return '';
  }

  if (sdl3ReferenceTooltipCache.has(cacheKey)) {
    return sdl3ReferenceTooltipCache.get(cacheKey);
  }

  const tooltip = sanitizeTooltipText(buildSdl3ReferenceTooltipUncached(item));
  sdl3ReferenceTooltipCache.set(cacheKey, tooltip);
  return tooltip;
}

function compactSdl3SearchPreviewText(text = '', maxLength = 170) {
  const clean = sanitizeTooltipText(text).replace(/\s+/g, ' ').trim();
  if (!clean) {
    return '';
  }

  if (clean.length <= maxLength) {
    return clean;
  }

  const sliced = clean.slice(0, Math.max(0, maxLength - 1));
  const safeBoundary = Math.max(
    sliced.lastIndexOf(' '),
    sliced.lastIndexOf('،'),
    sliced.lastIndexOf('؛'),
    sliced.lastIndexOf('.')
  );
  const output = safeBoundary > 60 ? sliced.slice(0, safeBoundary) : sliced;
  return `${output.trim()}…`;
}

function buildSdl3SearchPreview(item) {
  if (!item) {
    return '';
  }

  const tooltip = buildSdl3ReferenceTooltip(item);
  const meaning = extractSdl3TooltipFieldText(tooltip, 'المعنى');
  const operation = extractSdl3TooltipFieldText(tooltip, 'ما يفعله فعليًا');
  const benefit = extractSdl3TooltipFieldText(tooltip, 'الفائدة العملية') || extractSdl3TooltipFieldText(tooltip, 'الاستخدام');
  const exactType = getSdl3ExactElementTypeInfo(item);
  const packageLabel = item.packageDisplayName || item.packageName || 'SDL3';
  const lead = [exactType?.arabic || '', packageLabel].filter(Boolean).join(' | ');
  const body = compactSdl3SearchPreviewText(meaning || operation || benefit || item.description || '', 180);
  return [lead, body].filter(Boolean).join(' | ');
}

    return {
      buildSdl3FunctionMeaning,
      buildSdl3FunctionPurpose,
      buildSdl3EffectHint,
      buildSdl3WhenToUseHint,
      buildSdl3TypeMeaning,
      buildSdl3TypePurpose,
      buildSdl3TypePracticalUsage,
      buildSdl3TypeCodeAppearance,
      buildSdl3MacroKind,
      buildSdl3PropertyFallbackDescription,
      buildSdl3PropertyOfficialDescription,
      buildSdl3PropertyMeaning,
      buildSdl3PropertyWhenToUse,
      buildSdl3PropertyBenefit,
      buildSdl3PropertyRequirementText,
      buildSdl3PropertyDefaultText,
      buildSdl3PropertyConstraints,
      buildSdl3PropertyMacroProfile,
      buildSdl3MacroMeaning,
      buildSdl3MacroPurpose,
      buildSdl3MacroPracticalUsage,
      buildSdl3ParameterRole,
      buildSdl3ParameterPurpose,
      buildSdl3ParameterInputHint,
      buildSdl3ParameterPracticalUsage,
      buildSdl3ParameterMisuseImpact,
      buildSdl3FieldMeaning,
      buildSdl3FieldOfficialDescription,
      buildSdl3FieldPurpose,
      buildSdl3FieldPracticalUsage,
      buildSdl3OperationalProfile,
      renderSdl3OperationalProfile,
      renderSdl3StructFields,
      renderSdl3MacroDetails,
      renderSdl3TypeDetails,
      buildSdl3ReferenceTooltip,
      compactSdl3SearchPreviewText,
      buildSdl3SearchPreview
    };
  }

  global.__ARABIC_VULKAN_SDL3_DETAIL_RUNTIME__ = {
    createSdl3DetailRuntime
  };
})(window);
