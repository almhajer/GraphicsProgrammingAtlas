(function initVulkanEnumRuntime(global) {
  'use strict';

  function createVulkanEnumRuntime(deps = {}) {
    const {
      inferEnumTypeFromValue,
      getEnumMetadata,
      renderExternalReference,
      buildEnumValueMeaningFallback,
      buildEnumValueUsageFallback,
      buildEnumValueBenefitFallback,
      buildEnumOverviewRows,
      sanitizeEnumNarrativeText
    } = deps;

    const enumValueRowsCache = new Map();

    function getEnumValueMetadata(rawValue, context = {}) {
      const value = String(rawValue || '').trim();
      if (!value) {
        return null;
      }

      const castMatch = value.match(/^\((Vk[A-Za-z0-9_]+)\)\s*(-?\d+)\s*$/);
      const numericValue = castMatch ? castMatch[2] : null;
      const enumName = inferEnumTypeFromValue(value, context);
      if (!enumName) {
        return null;
      }

      const enumMeta = getEnumMetadata(enumName);
      const symbolicName = castMatch
        ? Object.entries(enumMeta.values).find(([, meta]) => String(meta.numeric) === numericValue)?.[0] || ''
        : value;
      const currentMeta = symbolicName ? enumMeta.values[symbolicName] || null : null;
      const currentValueName = symbolicName || value;
      const alternatives = (currentMeta?.alternatives || [])
        .filter((name) => name !== currentValueName)
        .map((name) => ({name, meta: enumMeta.values[name] || null}));

      const dependentEntries = [];
      if (context.fieldName) {
        dependentEntries.push(`الحقل ${renderExternalReference(context.fieldName, {ownerType: context.ownerType || enumName}, context.fieldName)}`);
      }
      if (context.ownerType) {
        dependentEntries.push(`البنية ${renderExternalReference(context.ownerType)}`);
      }
      if (context.functionName) {
        dependentEntries.push(`الدالة ${renderExternalReference(context.functionName)}`);
      }

      return {
        enumName,
        enumMeaning: enumMeta.meaning,
        apiPurpose: enumMeta.apiPurpose,
        valueName: currentValueName,
        symbolicName,
        valueMeaning: currentMeta?.meaning || (castMatch
          ? `القيمة العددية ${numericValue} قُدمت على أنها ${enumName}، ولن تحمل معنى صحيحاً إلا إذا كانت تطابق قيمة معرفة رسميًا داخل هذا التعداد.`
          : buildEnumValueMeaningFallback(currentValueName, enumName, context)),
        numericValue: currentMeta?.numeric || numericValue || 'غير موثق محلياً',
        usage: currentMeta?.usage || buildEnumValueUsageFallback(currentValueName, enumName, context),
        benefit: currentMeta?.benefit || buildEnumValueBenefitFallback(currentValueName, enumName),
        alternatives,
        affectedBy: dependentEntries,
        chosenBecause: currentMeta?.usage
          ? currentMeta.usage
          : castMatch
            ? `استُخدمت كتابة cast لأن السطر يريد تحويل الرقم ${numericValue} إلى ${enumName}، لكن الأسلوب الأفضل هو استعمال الاسم الرمزي المباشر إن كان معروفاً.`
            : buildEnumValueUsageFallback(currentValueName, enumName, context),
        difference: alternatives.length
          ? alternatives.map(({name, meta}) => `${name}${meta?.meaning ? `: ${meta.meaning}` : ''}`).join(' | ')
          : 'لا توجد بدائل محلية مفصلة لهذا العنصر حالياً.',
        invalid: castMatch
          ? `إذا لم يكن الرقم ${numericValue} معرفاً فعلياً داخل ${enumName} فقد يصبح السطر صحيحاً نحوياً لكنه مضلل أو غير صالح منطقياً.`
          : `استخدام قيمة مختلفة قد يغيّر مسار التنفيذ أو التوافق أو الأداء، وقد يؤدي أحياناً إلى فشل التحقق إذا كان الحقل لا يقبل تلك القيمة.`
      };
    }

    function getEnumValueRows(item) {
      const cacheKey = String(item?.name || '');
      if (cacheKey && enumValueRowsCache.has(cacheKey)) {
        return enumValueRowsCache.get(cacheKey);
      }

      const fallbackRows = buildEnumOverviewRows(item?.name || '');
      const fallbackByName = Object.fromEntries(fallbackRows.map((row) => [row.name, row]));
      const localRows = (item?.values || []).map((value) => {
        const fallback = fallbackByName[value.name] || {};
        return {
          name: value.name,
          numeric: value.value || fallback.numeric || 'غير موثق محلياً',
          meaning: sanitizeEnumNarrativeText(value.description || '', fallback.meaning || buildEnumValueMeaningFallback(value.name, item?.name || '')),
          usage: sanitizeEnumNarrativeText(value.usage || '', fallback.usage || buildEnumValueUsageFallback(value.name, item?.name || '', {enumName: item?.name || ''})),
          benefit: sanitizeEnumNarrativeText(value.benefit || '', fallback.benefit || buildEnumValueBenefitFallback(value.name, item?.name || ''))
        };
      });

      if (localRows.length) {
        const present = new Set(localRows.map((row) => row.name));
        fallbackRows.forEach((row) => {
          if (!present.has(row.name)) {
            localRows.push(row);
          }
        });
        if (cacheKey) {
          enumValueRowsCache.set(cacheKey, localRows);
        }
        return localRows;
      }

      if (cacheKey) {
        enumValueRowsCache.set(cacheKey, fallbackRows);
      }
      return fallbackRows;
    }

    return {
      getEnumValueMetadata,
      getEnumValueRows
    };
  }

  global.__ARABIC_VULKAN_VULKAN_ENUM_RUNTIME__ = Object.freeze({
    createVulkanEnumRuntime
  });
})(window);
