(function (global) {
function extractTutorialConstantContexts({summary = '', goals = [], sections = [], checkpoints = [], nextStep = ''}) {
  const tokenRegex = /\b(?:VK_[A-Z0-9_]+|UINT(?:8|16|32|64)_(?:MAX|MIN)|INT(?:8|16|32|64)_(?:MAX|MIN)|SIZE_MAX)\b/g;
  const contextMap = new Map();

  const addToken = (token, contextLabel) => {
    if (!token) {
      return;
    }

    const normalized = String(token).trim();
    if (!normalized) {
      return;
    }

    if (!contextMap.has(normalized)) {
      contextMap.set(normalized, new Set());
    }

    if (contextLabel) {
      contextMap.get(normalized).add(contextLabel);
    }
  };

  const scanText = (text, contextLabel) => {
    const source = String(text || '');
    if (!source) {
      return;
    }

    const matches = source.match(tokenRegex) || [];
    matches.forEach((token) => addToken(token, contextLabel));
  };

  scanText(summary, 'مقدمة الدرس');
  goals.forEach((goal) => {
    scanText(goal?.value, `أهداف الدرس: ${goal?.label || 'قيمة'}`);
    scanText(goal?.note, `أهداف الدرس: ${goal?.label || 'ملاحظة'}`);
  });
  sections.forEach((section) => {
    scanText(section?.title, section?.title || 'قسم من الدرس');
    scanText(section?.body, section?.title || 'قسم من الدرس');
  });
  checkpoints.forEach((entry) => scanText(entry, 'نقاط التحقق'));
  scanText(nextStep, 'الانتقال إلى الدرس التالي');

  return Array.from(contextMap.entries()).map(([name, contexts]) => ({
    name,
    contexts: Array.from(contexts)
  }));
}

function inferTutorialConstantKind(name, resolved) {
  if (resolved.enumValueMatch) {
    if (resolved.enumValueMatch.enumItem?.name === 'VkResult') {
      return `Result Constant من ${renderProjectReferenceChip('VkResult')}`;
    }
    if (name === 'VK_TRUE' || name === 'VK_FALSE') {
      return `ثابت منطقي من ${renderProjectReferenceChip(resolved.enumValueMatch.enumItem.name, {preferredEnumName: resolved.enumValueMatch.enumItem.name})}`;
    }
    if (name.startsWith('VK_STRUCTURE_TYPE_')) {
      return `ثابت نوع بنية من ${renderProjectReferenceChip('VkStructureType')}`;
    }
    if (/(FlagBits|Flags)/.test(resolved.enumValueMatch.enumItem?.name || '') || /_BIT/.test(name)) {
      return `علم بتّي من ${renderProjectReferenceChip(resolved.enumValueMatch.enumItem.name, {preferredEnumName: resolved.enumValueMatch.enumItem.name})}`;
    }
    return `قيمة تعداد من ${renderProjectReferenceChip(resolved.enumValueMatch.enumItem.name, {preferredEnumName: resolved.enumValueMatch.enumItem.name})}`;
  }

  if (resolved.macroItem) {
    if (/^VK_API_VERSION_/.test(name)) {
      return 'ماكرو إصدار';
    }
    if (/_EXTENSION_NAME$/.test(name)) {
      return 'ماكرو اسم امتداد';
    }
    return localizeMacroCategory('Constant Macro');
  }

  if (/^(UINT|INT)\d+_(MAX|MIN)$|^SIZE_MAX$/.test(name)) {
    return 'ثابت عددي';
  }

  return 'ثابت رسمي';
}

function inferTutorialConstantMeaning(name, resolved) {
  if (resolved.enumValueMatch) {
    const enumName = resolved.enumValueMatch.enumItem.name;
    const row = resolved.enumValueMatch.row;

    if (enumName === 'VkResult') {
      return `${name} قيمة من ${renderProjectReferenceChip('VkResult')} تعني أن الدالة أعادت هذه النتيجة تحديداً بعد التنفيذ، ويُبنى عليها قرار المتابعة أو معالجة الخطأ في الكود. ${row.meaning || row.description || ''}`.trim();
    }

    if (name === 'VK_TRUE' || name === 'VK_FALSE') {
      return `${name} قيمة منطقية بصيغة فولكان تُستخدم داخل الحقول أو النتائج التي تتوقع ${renderProjectReferenceChip(enumName, {preferredEnumName: enumName})} أو نوعاً مناظراً له، بحيث تقرأ فولكان الاختيار بصيغة الواجهة الثنائية الرسمية.`;
    }

    if (name.startsWith('VK_STRUCTURE_TYPE_')) {
      return `${name} قيمة من ${renderProjectReferenceChip('VkStructureType')} توضع في الحقل <code>sType</code> حتى تعرف فولكان أن البنية المقروءة من هذا الموضع هي البنية المطابقة لهذا النوع عند تفسيرها داخل الدالة.`;
    }

    if (/(FlagBits|Flags)/.test(enumName) || /_BIT/.test(name)) {
      return `${name} قيمة علم بتّي من ${renderProjectReferenceChip(enumName, {preferredEnumName: enumName})} تمثل قدرة أو خياراً واحداً يمكن فحصه أو دمجه مع قيم أخرى لتحديد السلوك الذي ستعتمده فولكان في هذا السياق. ${row.meaning || row.description || ''}`.trim();
    }

    return `${name} قيمة من ${renderProjectReferenceChip(enumName, {preferredEnumName: enumName})} تختار حالة أو سلوكاً محدداً تقرؤه فولكان في الموضع الذي ظهرت فيه داخل هذا الدرس. ${row.meaning || row.description || ''}`.trim();
  }

  if (resolved.macroItem) {
    return inferMacroPracticalMeaning(resolved.macroItem);
  }

  if (resolved.constantItem) {
    return inferReferenceProfile(resolved.constantItem, 'constant').meaning
      || resolved.constantItem.description
      || `${name} ثابت عددي أو رمزي تقرؤه الواجهة أو الكود كما هو في هذا الموضع.`;
  }

  return `${name} ثابت مستخدم داخل هذا الدرس ويجب التعامل معه كقيمة ذات معنى تنفيذي محدد لا كاسم عام فقط.`;
}

function inferTutorialConstantReason(name, resolved, contexts = []) {
  if (name.startsWith('VK_STRUCTURE_TYPE_')) {
    return 'استُخدم هنا لأن المثال يهيئ بنى فولكان قبل تمريرها إلى الدوال، وتعتمد الواجهة على قيمة <code>sType</code> لتمييز نوع كل بنية أثناء القراءة.';
  }

  if (name === 'VK_SUCCESS') {
    return 'استُخدم هنا لفحص أن الاستدعاء انتهى بنجاح قبل متابعة الخطوات التالية في الدرس.';
  }

  if (name === 'VK_TRUE' || name === 'VK_FALSE') {
    return 'استُخدم هنا لضبط أو فحص خيار منطقي بصيغة فولكان الرسمية بدل الاعتماد على <code>true</code>/<code>false</code> مباشرة.';
  }

  if (/^VK_API_VERSION_/.test(name)) {
    return 'استُخدم هنا لتحديد إصدار فولكان الذي يعلنه التطبيق أو يستهدفه المثال، بحيث تقرأ الواجهة مستوى البرمجة المطلوب من هذه التهيئة.';
  }

  if (/_EXTENSION_NAME$/.test(name)) {
    return 'استُخدم هنا لأن الدرس يمرر الاسم الرسمي للامتداد إلى قوائم الفحص أو التفعيل بدل كتابة سلسلة نصية حرفية.';
  }

  if (/^VK_QUEUE_.*_BIT$/.test(name)) {
    return 'استُخدم هنا لفحص هل العائلة أو الحقل يدعم القدرة المحددة بهذا العلم البتّي، لا لمجرد مقارنة اسمية.';
  }

  if (/^(UINT|INT)\d+_(MAX|MIN)$|^SIZE_MAX$/.test(name)) {
    return 'استُخدم هنا كقيمة حدية أو قيمة فاصلة تحدد الحد الأقصى أو الأدنى الذي سيبني عليه الكود القرار أو المهلة أو المقارنة.';
  }

  if (resolved.macroItem) {
    return inferMacroPracticalBenefit(resolved.macroItem);
  }

  if (resolved.constantItem) {
    return inferReferenceBenefit(resolved.constantItem, 'constant');
  }

  return 'استُخدم هذا الثابت لأن المثال يحتاج هذه القيمة الرسمية تحديداً في هذا الموضع من الشرح أو الكود.';
}

function renderTutorialConstantsSection(lessonData) {
  const entries = extractTutorialConstantContexts(lessonData)
    .map((entry) => {
      const macroItem = findMacroItemByName(entry.name);
      const constantItem = findConstantItemByName(entry.name);
      const enumValueMatch = findEnumOwnerOfValue(entry.name);
      const resolved = {macroItem, constantItem, enumValueMatch};

      if (!macroItem && !constantItem && !enumValueMatch) {
        return null;
      }

      return {
        ...entry,
        resolved
      };
    })
    .filter(Boolean);

  if (!entries.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h3>الثوابت المستخدمة في هذا الدرس</h3>
      <div class="tutorial-constants-card-grid">
        ${entries.map((entry, index) => `
          <article class="content-card prose-card parameter-detail-card tutorial-constant-card">
            <div class="parameter-card-head">
              <div class="parameter-card-order">الثابت ${index + 1}</div>
              <div class="parameter-card-title-wrap">
                <h4 class="parameter-card-name parameter-card-code">${renderProjectReferenceChip(entry.name)}</h4>
                <div class="parameter-card-type-row">
                  <span class="parameter-card-type-label">النوع</span>
                  <div class="parameter-card-type">${inferTutorialConstantKind(entry.name, entry.resolved)}</div>
                </div>
              </div>
            </div>
            <div class="parameter-card-fields">
              <div class="parameter-card-field">
                <div class="parameter-card-field-label">المعنى الحقيقي</div>
                <div class="parameter-card-field-value">${inferTutorialConstantMeaning(entry.name, entry.resolved)}</div>
              </div>
              <div class="parameter-card-field">
                <div class="parameter-card-field-label">أين استُخدم</div>
                <div class="parameter-card-field-value">${entry.contexts.map((context) => `<div>${escapeHtml(context)}</div>`).join('')}</div>
              </div>
              <div class="parameter-card-field parameter-card-field-wide">
                <div class="parameter-card-field-label">سبب استخدامه في هذا الدرس</div>
                <div class="parameter-card-field-value">${inferTutorialConstantReason(entry.name, entry.resolved, entry.contexts)}</div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function getConstantTokenRegex() {
  return /\b(?:VK_[A-Z0-9_]+|UINT(?:8|16|32|64)_(?:MAX|MIN)|INT(?:8|16|32|64)_(?:MAX|MIN)|SIZE_MAX)\b/g;
}

function deriveStructureTypeConstantName(structureName) {
  const raw = String(structureName || '').trim();
  if (!/^Vk[A-Za-z0-9_]+$/.test(raw)) {
    return '';
  }

  const suffix = raw.slice(2)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toUpperCase();

  return `VK_STRUCTURE_TYPE_${suffix}`;
}

function extractEntityRelatedConstantContexts(item, kind = 'entity') {
  const tokenRegex = getConstantTokenRegex();
  const contextMap = new Map();

  const ensureEntry = (token, preferredEnumName = '') => {
    const normalized = String(token || '').trim();
    if (!normalized) {
      return null;
    }

    if (!contextMap.has(normalized)) {
      contextMap.set(normalized, {
        name: normalized,
        contexts: new Set(),
        preferredEnumName: preferredEnumName || ''
      });
    }

    const entry = contextMap.get(normalized);
    if (preferredEnumName && !entry.preferredEnumName) {
      entry.preferredEnumName = preferredEnumName;
    }
    return entry;
  };

  const addToken = (token, contextLabel, preferredEnumName = '') => {
    const entry = ensureEntry(token, preferredEnumName);
    if (!entry) {
      return;
    }
    if (contextLabel) {
      entry.contexts.add(contextLabel);
    }
  };

  const scanText = (text, contextLabel, preferredEnumName = '') => {
    const source = String(text || '');
    if (!source) {
      return;
    }

    const matches = source.match(tokenRegex) || [];
    matches.forEach((token) => addToken(token, contextLabel, preferredEnumName));
  };

  const usageItems = getUsageItems(item);

  scanText(item?.description, 'الوصف الافتتاحي', kind === 'enum' ? item.name : '');
  usageItems.forEach((text, index) => scanText(text, `الوصف التفصيلي ${index + 1}`, kind === 'enum' ? item.name : ''));
  (item?.notes || []).forEach((note, index) => scanText(note, `ملاحظة ${index + 1}`, kind === 'enum' ? item.name : ''));
  scanText(item?.example, 'المثال البرمجي', kind === 'enum' ? item.name : '');

  if (kind === 'function') {
    scanText(item?.signature, 'التصريح البرمجي');
    (item?.parameters || []).forEach((param) => {
      scanText(param?.description, `المعامل ${param?.name || 'غير مسمى'}`);
      scanText(param?.type, `نوع المعامل ${param?.name || 'غير مسمى'}`);
    });
    getReturnValuesArray(item).forEach(({value, description}) => {
      addToken(value, 'القيم الراجعة');
      scanText(description, `وصف القيمة الراجعة ${value || ''}`.trim());
    });
  }

  if (kind === 'structure') {
    const structureTypeConstant = deriveStructureTypeConstantName(item?.name);
    if (structureTypeConstant && findEnumOwnerOfValue(structureTypeConstant, 'VkStructureType')) {
      addToken(structureTypeConstant, 'حقل sType لهذه البنية', 'VkStructureType');
    }

    getStructureFieldRows(item).forEach((field) => {
      scanText(field?.description, `الحقل ${field?.name || 'غير مسمى'}`);
      scanText(field?.type, `نوع الحقل ${field?.name || 'غير مسمى'}`);
    });
  }

  if (kind === 'enum') {
    getEnumValueRows(item).forEach((row) => {
      addToken(row?.name, 'قيمة معرفة داخل هذا التعداد', item.name);
      scanText(row?.description, `وصف ${row?.name || 'قيمة'}`, item.name);
      scanText(row?.meaning, `المعنى العملي لـ ${row?.name || 'قيمة'}`, item.name);
      scanText(row?.usage, `استخدام ${row?.name || 'قيمة'}`, item.name);
      scanText(row?.benefit, `فائدة ${row?.name || 'قيمة'}`, item.name);
    });
  }

  if (kind === 'macro' || kind === 'constant') {
    scanText(item?.syntax, 'الصياغة');
    scanText(item?.value, 'القيمة أو الناتج');
  }

  return Array.from(contextMap.values())
    .filter((entry) => entry.name !== item?.name)
    .map((entry) => ({
      ...entry,
      contexts: Array.from(entry.contexts)
    }));
}

function inferEntityConstantReason(name, resolved, item, kind, contexts = []) {
  const enumMatch = resolved?.enumValueMatch || null;

  if (kind === 'structure' && name.startsWith('VK_STRUCTURE_TYPE_')) {
    return `ظهر هنا لأنه القيمة التي يجب وضعها في <code>sType</code> داخل ${renderProjectReferenceChip(item.name)} حتى تتعرف فولكان على نوع البنية عند قراءتها داخل الدالة.`;
  }

  if (kind === 'enum' && enumMatch && enumMatch.enumItem?.name === item?.name) {
    return `هذه إحدى القيم الرسمية التي يعرّفها ${renderProjectReferenceChip(item.name)} نفسه. اختيارها داخل حقل أو دالة يغيّر السلوك الذي ستعتمده فولكان وفق هذه الحالة تحديداً.`;
  }

  if (kind === 'function' && name === 'VK_SUCCESS') {
    return `ظهر هنا لأن ${renderProjectReferenceChip(item.name)} تعيد عادةً قيمة من ${renderProjectReferenceChip('VkResult')}، ويجب فحص نجاح الاستدعاء قبل متابعة بقية المسار.`;
  }

  if (kind === 'function' && /^VK_STRUCTURE_TYPE_/.test(name)) {
    return `ظهر هنا لأن الدالة ${renderProjectReferenceChip(item.name)} تعتمد على بنى تُمرَّر عبر المعاملات، وتقرأ فولكان <code>sType</code> داخل هذه البنى لتمييز نوع كل بنية قبل استخدام حقولها.`;
  }

  if (kind === 'macro' && /_EXTENSION_NAME$/.test(name)) {
    return 'ظهر هنا لأن هذا الماكرو يوفّر الاسم النصي الرسمي للامتداد الذي يستخدمه الكود عند فحص الدعم أو طلب التفعيل، بدلاً من كتابة سلسلة نصية حرفية.';
  }

  if (kind === 'constant' && enumMatch) {
    return `ظهر هنا لأنه مرتبط بالقيمة ${renderProjectReferenceChip(name, {preferredEnumName: enumMatch.enumItem.name})} التي يقرأها فولكان في هذا السياق لتحديد السلوك أو النتيجة أو النوع المطلوب.`;
  }

  return inferTutorialConstantReason(name, resolved, contexts);
}

function describeEntityRelatedConstantContext(context, entry, item, kind = 'entity') {
  const currentLink = item?.name
    ? renderProjectReferenceChip(item.name, {
      currentItem: item,
      preferredEnumName: kind === 'enum' ? item.name : ''
    })
    : 'هذا الكيان';
  const elementLabel = entry?.resolved?.macroItem
    ? 'الماكرو'
    : entry?.resolved?.enumValueMatch
      ? 'القيمة'
      : 'الثابت';
  const codeToken = (value) => `<code dir="ltr">${escapeHtml(String(value || '').trim())}</code>`;
  const parameterMatch = /^المعامل\s+(.+)$/.exec(context);
  const parameterTypeMatch = /^نوع المعامل\s+(.+)$/.exec(context);
  const fieldMatch = /^الحقل\s+(.+)$/.exec(context);
  const fieldTypeMatch = /^نوع الحقل\s+(.+)$/.exec(context);
  const returnValueMatch = /^وصف القيمة الراجعة\s+(.+)$/.exec(context);
  const valueDescriptionMatch = /^وصف\s+(.+)$/.exec(context);
  const valueMeaningMatch = /^المعنى العملي لـ\s+(.+)$/.exec(context);
  const valueUsageMatch = /^استخدام\s+(.+)$/.exec(context);
  const valueBenefitMatch = /^فائدة\s+(.+)$/.exec(context);

  if (context === 'المثال البرمجي') {
    return `يظهر استخدام هذا ${elementLabel} في المثال البرمجي التالي المرتبط بـ ${currentLink}.`;
  }
  if (context === 'الوصف الافتتاحي') {
    return `يرد هذا ${elementLabel} في الوصف الافتتاحي للكيان ${currentLink}.`;
  }
  if (/^الوصف التفصيلي\s+\d+$/.test(context)) {
    return `يرتبط هذا ${elementLabel} بأحد مقاطع الشرح التفصيلي الخاصة بالكيان ${currentLink}.`;
  }
  if (context === 'التصريح البرمجي') {
    return `يرد هذا ${elementLabel} في التوقيع العام للكيان ${currentLink}.`;
  }
  if (context === 'القيم الراجعة') {
    return `يظهر هذا ${elementLabel} ضمن القيم الراجعة الخاصة بالكيان ${currentLink}.`;
  }
  if (context === 'الصياغة') {
    return `يرد هذا ${elementLabel} في الصياغة الرسمية للكيان ${currentLink}.`;
  }
  if (context === 'القيمة أو الناتج') {
    return `يظهر هذا ${elementLabel} في القيمة أو الناتج الرسمي للكيان ${currentLink}.`;
  }
  if (context === 'حقل sType لهذه البنية') {
    return `يرتبط هذا ${elementLabel} بحقل <code>sType</code> في ${currentLink}.`;
  }
  if (context === 'قيمة معرفة داخل هذا التعداد') {
    return `هذه القيمة معرفة داخل ${currentLink} نفسه وتحدد أحد فروعه الرسمية.`;
  }
  if (parameterMatch) {
    return `يرتبط هذا ${elementLabel} بشرح المعامل ${codeToken(parameterMatch[1])} في ${currentLink}.`;
  }
  if (parameterTypeMatch) {
    return `يرد هذا ${elementLabel} داخل نوع المعامل ${codeToken(parameterTypeMatch[1])} في ${currentLink}.`;
  }
  if (fieldMatch) {
    return `يرتبط هذا ${elementLabel} بالحقل ${codeToken(fieldMatch[1])} في ${currentLink}.`;
  }
  if (fieldTypeMatch) {
    return `يرد هذا ${elementLabel} داخل نوع الحقل ${codeToken(fieldTypeMatch[1])} في ${currentLink}.`;
  }
  if (returnValueMatch) {
    return `يرتبط هذا ${elementLabel} بوصف القيمة الراجعة ${codeToken(returnValueMatch[1])} في ${currentLink}.`;
  }
  if (valueDescriptionMatch) {
    return `يرد هذا ${elementLabel} في الوصف العربي للقيمة ${codeToken(valueDescriptionMatch[1])} ضمن ${currentLink}.`;
  }
  if (valueMeaningMatch) {
    return `يرتبط هذا ${elementLabel} بشرح المعنى الحقيقي للقيمة ${codeToken(valueMeaningMatch[1])} ضمن ${currentLink}.`;
  }
  if (valueUsageMatch) {
    return `يرتبط هذا ${elementLabel} بشرح الاستخدام العملي للقيمة ${codeToken(valueUsageMatch[1])} ضمن ${currentLink}.`;
  }
  if (valueBenefitMatch) {
    return `يرتبط هذا ${elementLabel} بشرح الفائدة العملية للقيمة ${codeToken(valueBenefitMatch[1])} ضمن ${currentLink}.`;
  }

  return `يرتبط هذا ${elementLabel} بالسياق ${escapeHtml(context)} ضمن ${currentLink}.`;
}

function getEntityRelatedConstantsSubjectLabel(item, kind = 'entity') {
  if (kind === 'function') {
    return 'الدالة';
  }
  if (kind === 'enum') {
    return 'التعداد';
  }
  if (kind === 'constant') {
    return 'الثابت';
  }
  if (kind === 'macro') {
    return 'الماكرو';
  }
  if (item?.syntheticGroup === 'variable') {
    return 'النوع أو المتغير';
  }
  return 'الكيان';
}

function renderEntityRelatedConstantsSection(item, kind = 'entity') {
  const entries = extractEntityRelatedConstantContexts(item, kind)
    .map((entry) => {
      const macroItem = findMacroItemByName(entry.name);
      const constantItem = findConstantItemByName(entry.name);
      const enumValueMatch = findEnumOwnerOfValue(entry.name, entry.preferredEnumName || (kind === 'enum' ? item?.name : ''));
      const resolved = {macroItem, constantItem, enumValueMatch};

      if (!macroItem && !constantItem && !enumValueMatch) {
        return null;
      }

      return {
        ...entry,
        resolved
      };
    })
    .filter(Boolean);

  if (!entries.length) {
    return '';
  }

  const maxEntries = kind === 'enum' ? 24 : 16;
  const visibleEntries = entries.slice(0, maxEntries);
  const hiddenCount = Math.max(0, entries.length - visibleEntries.length);
  const itemName = String(item?.name || '').trim();
  const preferredEnumName = kind === 'enum' ? itemName : '';
  const subjectLabel = getEntityRelatedConstantsSubjectLabel(item, kind);

  return `
    <section class="info-section params-section entity-related-constants-section">
      <h2 data-tooltip="${escapeAttribute(`يجمع هذا القسم الثوابت وقيم التعداد والماكرو التي ظهرت مع ${item?.name || 'هذا الكيان'}، ويشرح سبب ارتباطها به.`)}" tabindex="0" aria-label="${escapeAttribute('الثوابت المرتبطة بهذا الكيان')}">🧷 الثوابت المرتبطة بهذا الكيان</h2>
      <div class="content-card prose-card params-section-intro">
        <div class="params-section-intro-kicker">قراءة سريعة</div>
        <p>هذه البطاقات تجمع ${visibleEntries.length} من الثوابت وقيم التعداد والماكرو التي ظهرت مع ${itemName ? renderProjectReferenceChip(itemName, {currentItem: item, preferredEnumName}) : `هذا ${subjectLabel}`}، وتشرح معناها العملي ولماذا ارتبطت بهذا الموضع تحديدًا.</p>
      </div>
      <div class="params-card-grid entity-related-constants-card-grid">
        ${visibleEntries.map((entry, index) => `
          <article class="content-card prose-card parameter-detail-card">
            <div class="parameter-card-head">
              <div class="parameter-card-order">الارتباط ${index + 1}</div>
              <div class="parameter-card-title-wrap">
                <h3 class="parameter-card-name parameter-card-code">${renderProjectReferenceChip(entry.name, {currentItem: item, preferredEnumName: entry.preferredEnumName || preferredEnumName})}</h3>
                <div class="parameter-card-type-row">
                  <span class="parameter-card-type-label">النوع</span>
                  <div class="parameter-card-type">${renderPracticalText(inferTutorialConstantKind(entry.name, entry.resolved), 'يوضح هذا الحقل نوع العنصر المرجعي الحالي.')}</div>
                </div>
              </div>
            </div>
            <div class="parameter-card-fields">
              <div class="parameter-card-field">
                <div class="parameter-card-field-label">المعنى الحقيقي</div>
                <div class="parameter-card-field-value">${renderPracticalText(inferTutorialConstantMeaning(entry.name, entry.resolved), `يوضح هذا الحقل المعنى العملي للعنصر ${entry.name}.`)}</div>
              </div>
              <div class="parameter-card-field">
                <div class="parameter-card-field-label">أين يرتبط بهذا الكيان</div>
                <div class="parameter-card-field-value">${entry.contexts.length ? entry.contexts.map((context) => `<div class="entity-related-constant-context">${describeEntityRelatedConstantContext(context, entry, item, kind)}</div>`).join('') : '<span>يرتبط هذا العنصر بسياق الكيان الحالي مباشرة.</span>'}</div>
              </div>
              <div class="parameter-card-field">
                <div class="parameter-card-field-label">لماذا هو مهم هنا</div>
                <div class="parameter-card-field-value">${renderPracticalText(inferEntityConstantReason(entry.name, entry.resolved, item, kind, entry.contexts), `يبين هذا الحقل لماذا يعد ${entry.name} مهماً في سياق ${item?.name || 'الكيان الحالي'}.`)}</div>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
      ${hiddenCount > 0 ? `<div class="content-card prose-card"><p>عُرض أول ${visibleEntries.length} ثابتاً فقط هنا حتى تبقى الصفحة خفيفة، وما تبقى وعدده ${hiddenCount} ثابتات يمكن الوصول إليه من صفحاتها أو من قسم الثوابت العام.</p></div>` : ''}
    </section>
  `;
}

  const registry = global.__ARABIC_VULKAN_RUNTIME_AGENTS__ || (global.__ARABIC_VULKAN_RUNTIME_AGENTS__ = {});
  registry.referenceInsights = {
    renderTutorialConstantsSection,
    renderEntityRelatedConstantsSection
  };
})(window);
