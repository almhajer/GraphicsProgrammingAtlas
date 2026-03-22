(function(global) {
  'use strict';

  function createSdl3EntityRenderRuntime(api = {}) {
    const {
      renderSdl3AnnotatedCodeSnippet,
      escapeAttribute,
      escapeHtml,
      renderSdl3PracticalText,
      getSdl3DisplayedParameterType,
      getSdl3DisplayParameters,
      buildSdl3ParameterTooltip,
      getSdl3ParameterAnchorId,
      renderSdl3ParameterDescriptionCell,
      buildSdl3ParameterRole,
      buildSdl3ParameterPurpose,
      buildSdl3ParameterPracticalUsage,
      buildSdl3ParameterInputHint,
      buildSdl3ParameterUsageExampleCode,
      renderSdl3ExampleCodeBlock,
      splitSdl3IdentifierWords,
      humanizeSdl3Words,
      resolveStrictArabicSdl3DocText,
      findSdl3ItemByKind,
      buildSdl3ReferenceTooltip,
      linkSdl3DocText,
      renderSdl3EntityLink,
      renderSdl3RelatedLink,
      buildSdl3RenderedRemarks,
      renderSdl3TypeReference: externalRenderSdl3TypeReference,
      renderSdl3InlineCodeSnippet: externalRenderSdl3InlineCodeSnippet
    } = api;

function renderSdl3TypeReference(rawType) {
  if (typeof externalRenderSdl3TypeReference === 'function') {
    return externalRenderSdl3TypeReference(rawType);
  }
  const source = String(rawType || '').trim();
  if (!source) {
    return '—';
  }

  return `<code dir="ltr" class="sdl3-inline-code">${renderSdl3AnnotatedCodeSnippet(source, null, {
    parameterMap: new Map(),
    fieldMap: new Map()
  })}</code>`;
}

function renderSdl3InlineCodeSnippet(source, item = null, className = '') {
  if (typeof externalRenderSdl3InlineCodeSnippet === 'function') {
    return externalRenderSdl3InlineCodeSnippet(source, item, className);
  }
  const snippet = String(source || '').trim();
  if (!snippet) {
    return '';
  }

  const resolvedClassName = ['sdl3-inline-code', className].filter(Boolean).join(' ');
  return `<code dir="ltr" class="${escapeAttribute(resolvedClassName)}">${renderSdl3AnnotatedCodeSnippet(snippet, item, {
    parameterMap: new Map(),
    fieldMap: new Map()
  })}</code>`;
}

function renderSdl3ParameterTypeCell(param, item) {
  const displayedType = getSdl3DisplayedParameterType(param, item);
  if (!displayedType.text || displayedType.text === '—') {
    return '—';
  }
  if (displayedType.isCode) {
    return renderSdl3TypeReference(displayedType.text);
  }
  return renderSdl3PracticalText(displayedType.text, displayedType.text);
}

function renderSdl3ParameterTable(item) {
  const parameters = getSdl3DisplayParameters(item);
  if (!parameters.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>المعاملات</h2>
      <table class="params-table">
        <thead>
          <tr>
            <th>النوع</th>
            <th>الاسم</th>
            <th>الوصف الرسمي بالعربي</th>
            <th>الدور الحقيقي</th>
            <th>لماذا يُمرر؟</th>
            <th>الاستخدام الفعلي</th>
          </tr>
        </thead>
        <tbody>
          ${parameters.map((param) => {
            const tooltip = buildSdl3ParameterTooltip(param, item);
            const anchorId = getSdl3ParameterAnchorId(item, param);
            return `
            <tr id="${escapeAttribute(anchorId)}">
              <td>${renderSdl3ParameterTypeCell(param, item)}</td>
              <td>${param.name
                ? `<a href="#${escapeAttribute(anchorId)}" class="param-name code-token code-link variable" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${param.name}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="scrollToAnchor('${escapeAttribute(anchorId)}'); return false;"><code dir="ltr">${escapeHtml(param.name || '')}</code></a>`
                : '—'}</td>
              <td class="sdl3-parameter-description-cell">${renderSdl3ParameterDescriptionCell(param, item)}</td>
              <td>${renderSdl3PracticalText(buildSdl3ParameterRole(param, item), 'هذا المعامل ينقل جزءًا أساسيًا من معنى الاستدعاء.')}</td>
              <td>${renderSdl3PracticalText(buildSdl3ParameterPurpose(param, item), 'لأن SDL3 يحتاج هذه القيمة ليحدد السلوك أو المورد المستهدف.')}</td>
              <td>${renderSdl3PracticalText(buildSdl3ParameterPracticalUsage(param, item), buildSdl3ParameterInputHint(param, item))}</td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderSdl3ParameterUsageExample(item) {
  const code = buildSdl3ParameterUsageExampleCode(item);
  if (!code) {
    return '';
  }

  return `
    <section class="example-section">
      <h2>مثال سريع على تمرير المعاملات</h2>
      ${renderSdl3ExampleCodeBlock(item, code)}
    </section>
    <section class="info-section">
      <div class="content-card prose-card">
        <p>هذا المثال يوضح شكل الاستدعاء نفسه بعد تجهيز القيم الأساسية، حتى ترى مباشرة ما الذي تمرره لكل معامل وبأي ترتيب.</p>
      </div>
    </section>
  `;
}

function getSdl3ConstantAnchorId(name) {
  return `sdl3-constant-${String(name || '').replace(/[^A-Za-z0-9_:-]+/g, '-')}`;
}

function getSdl3EnumValueContextLabel(enumName) {
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
  return `التعداد ${name || 'الحالي'}`;
}

function humanizeSdl3EnumValueLabel(valueName, enumName = '') {
  const valueWords = splitSdl3IdentifierWords(valueName);
  const enumWords = new Set(splitSdl3IdentifierWords(enumName).map((word) => String(word || '').toUpperCase()));
  const filtered = valueWords.filter((word) => !enumWords.has(String(word || '').toUpperCase()));
  return humanizeSdl3Words(filtered.length ? filtered : valueWords);
}

function buildSdl3EnumValueDescriptionFallback(enumItem, entry) {
  const enumName = String(enumItem?.name || '');
  const valueName = String(entry?.name || '');
  const context = getSdl3EnumValueContextLabel(enumName);
  const label = humanizeSdl3EnumValueLabel(valueName, enumName) || 'الحالة المطلوبة';
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
    'SDL_AsyncIOTaskType:SDL_ASYNCIO_TASK_CLOSE': 'تشير هذه القيمة إلى أن مهمة SDL_AsyncIO الحالية تنفذ إغلاقًا للمورد أو المجرى المرتبط بعد اكتمال العمل عليه.'
  };
  const exactKey = `${enumName}:${valueName}`;
  if (exact[exactKey]) {
    return exact[exactKey];
  }

  if (enumName === 'SDL_EventType') {
    return `تعاد هذه القيمة في الحقل type من SDL_Event عندما يقع الحدث المرتبط بـ ${valueName}، وعند ظهورها يقرأ التطبيق نوع الحدث ليحدد مسار المعالجة التالي.`;
  }

  if (enumName === 'SDL_EventAction') {
    return `تشير هذه القيمة إلى أسلوب تعامل SDL مع طابور الأحداث في هذا الطلب، وبالتحديد المسار المرتبط بـ ${valueName} عند الإضافة أو الفحص أو السحب.`;
  }

  if (enumName === 'SDL_GLAttr') {
    return `تشير هذه القيمة إلى خاصية من خصائص SDL_GL_SetAttribute يقرأها SDL قبل إنشاء سياق OpenGL لتحديد الإعداد المطلوب لهذا المسار.`;
  }

  if (enumName === 'SDL_SystemCursor') {
    return `تشير هذه القيمة إلى شكل رسمي من أشكال مؤشر النظام تقرؤه SDL عندما تطلب تعيين مؤشر مناسب للسياق الحالي.`;
  }

  const returnLike = /(?:Result|Status|State|PathType|PowerState|IOStatus|ThreadState)$/.test(enumName)
    || enumName === 'IMG_AnimationDecoderStatus';
  return returnLike
    ? `تعاد هذه القيمة عندما تكون ${label} هي الحالة الفعلية في ${context}، وعند ظهورها يعتمد SDL أو التطبيق هذا المسار في المعالجة اللاحقة.`
    : `تشير هذه القيمة إلى ${label}، وتُستخدم داخل ${context} ليعرف SDL هذا الاختيار أو هذه الحالة عند القراءة أو المقارنة.`;
}

function resolveSdl3EnumValueDescriptionText(entry, item) {
  const enumName = String(item?.name || '');
  const directEnums = new Set([
    'SDL_AppResult',
    'SDL_EnumerationResult',
    'IMG_AnimationDecoderStatus',
    'SDL_AssertState',
    'SDL_AsyncIOResult',
    'SDL_AsyncIOTaskType',
    'SDL_EventAction'
  ]);
  const exact = buildSdl3EnumValueDescriptionFallback(item, entry);
  if (directEnums.has(enumName)) {
    return exact;
  }
  return resolveStrictArabicSdl3DocText(entry?.description || '', item, {
    section: 'description',
    fallbackText: exact
  });
}

function renderSdl3EnumValues(item) {
  if (!Array.isArray(item.values) || !item.values.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>قيم التعداد</h2>
      <div class="sdl3-enum-values-card-grid">
        ${item.values.map((entry, index) => {
          const resolvedDescription = resolveSdl3EnumValueDescriptionText(entry, item);
          const tooltipItem = findSdl3ItemByKind('constant', entry.name) || {
            name: entry.name,
            kind: 'constant',
            packageDisplayName: item.packageDisplayName,
            categoryTitle: item.categoryTitle,
            description: resolvedDescription,
            parentEnum: item.name,
            value: entry.value
          };
          return `
            <article class="content-card prose-card parameter-detail-card sdl3-enum-value-card" id="${escapeAttribute(getSdl3ConstantAnchorId(entry.name))}">
              <div class="parameter-card-head">
                <div class="parameter-card-order">القيمة ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name parameter-card-code"><a href="#" class="related-link code-token" data-tooltip="${escapeAttribute(buildSdl3ReferenceTooltip(tooltipItem))}" onclick="showSdl3Constant('${escapeAttribute(entry.name)}'); return false;"><code dir="ltr">${escapeHtml(entry.name)}</code></a></h3>
                  <div class="parameter-card-type-row">
                    <span class="parameter-card-type-label">القيمة</span>
                    <div class="parameter-card-type"><code dir="ltr">${escapeHtml(entry.value || '—')}</code></div>
                  </div>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">الشرح بالعربي</div>
                  <div class="parameter-card-field-value">${linkSdl3DocText(resolvedDescription)}</div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderSdl3ReferenceCallout(item) {
  if (!item.referenceName) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <p>هذه الصفحة تحيلك إلى التعريف أو المرجع الأوسع التالي:</p>
        <p>${renderSdl3EntityLink(item.referenceName)}</p>
      </div>
    </section>
  `;
}

function renderSdl3Remarks(item) {
  const renderedRemarks = buildSdl3RenderedRemarks(item);
  if (!renderedRemarks.length) {
    return '';
  }

  return `
    <section class="best-practices-section">
      <h2>ملاحظات رسمية</h2>
      <ul class="best-practices-list">
        ${renderedRemarks.map((remark) => `<li>${remark}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderSdl3SeeAlso(item) {
  if (!Array.isArray(item.seeAlso) || !item.seeAlso.length) {
    return '';
  }

  const relatedNames = [...new Set(
    item.seeAlso
      .map((name) => String(name || '').trim())
      .filter((name) => name && name !== item.name)
  )];
  if (!relatedNames.length) {
    return '';
  }

  return `
    <section class="see-also-section">
      <h2>العناصر المرتبطة به</h2>
      <div class="see-also-links sdl3-see-also-list">
        ${relatedNames.map((name) => renderSdl3RelatedLink(name)).join('')}
      </div>
    </section>
  `;
}

async function toggleSdl3PackageKindSection(packageKey, dataKey, sectionId = getSdl3PackageSectionId(packageKey, dataKey)) {
  await ensureSdl3PackageKindData(packageKey, dataKey);
  const section = document.getElementById(sectionId);
  const parentSection = section?.closest('.nav-section');
  const packageGroup = document.getElementById(getSdl3PackageBranchId(packageKey));
  const packageCluster = packageGroup?.closest('.nav-cluster');

  if (parentSection && !parentSection.classList.contains('collapsed')) {
    collapseAllSidebarSections();
    collapseAllSidebarNavGroups();
    rememberSdl3PackageSectionState(packageKey, dataKey, false);
    return;
  }

  if (packageCluster) {
    collapseAllSidebarClusters(packageCluster.id || '');
    packageCluster.classList.remove('collapsed');
  }

  if (packageGroup) {
    packageGroup.classList.remove('collapsed');
  }

  if (parentSection) {
    collapseAllSidebarSections(parentSection);
    collapseAllSidebarNavGroups();
    populateSdl3PackageKindNavSection(packageKey, dataKey, sectionId);
    parentSection.classList.remove('collapsed');
    rememberSdl3PackageSectionState(packageKey, dataKey, true);
    hydrateExpandedSdl3NavGroups(section);
  }
}

    return {
      renderSdl3TypeReference,
      renderSdl3InlineCodeSnippet,
      renderSdl3ParameterTypeCell,
      renderSdl3ParameterTable,
      renderSdl3ParameterUsageExample,
      getSdl3ConstantAnchorId,
      getSdl3EnumValueContextLabel,
      humanizeSdl3EnumValueLabel,
      buildSdl3EnumValueDescriptionFallback,
      renderSdl3EnumValues,
      renderSdl3ReferenceCallout,
      renderSdl3Remarks,
      renderSdl3SeeAlso
    };
  }

  global.__ARABIC_VULKAN_SDL3_ENTITY_RENDER_RUNTIME__ = {
    createSdl3EntityRenderRuntime
  };
})(window);
