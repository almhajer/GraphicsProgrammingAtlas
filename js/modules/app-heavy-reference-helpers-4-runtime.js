// ArabicVulkan - extracted heavy global helper functions from js/app.js (phase325)

function resetSdl3DerivedCaches() {
  sdl3ReferenceItemsCache = null;
  sdl3ReferenceItemsBuilding = false;
  sdl3ReferenceItemLookupCache = null;
  sdl3SyntheticReferenceLookupCache = null;
  sdl3EntityItemsCache.clear();
  sdl3PackageItemsCache.clear();
  sdl3GroupedItemsCache.clear();
  sdl3KindItemLookupCache.clear();
  sdl3StructTypeCache.clear();
  sdl3PropertyReferenceProfileCache.clear();
  sdl3ReferenceTooltipCache.clear();
}

function findFunctionsUsingStructure(structureName, limit = 12) {
  const cacheKey = String(structureName || '');
  if (cacheKey && functionsUsingStructureCache.has(cacheKey)) {
    return functionsUsingStructureCache.get(cacheKey).slice(0, limit);
  }

  const entries = [];
  const normalized = normalizeLookupName(structureName);

  collectAllCommandItems().forEach((command) => {
    (command.parameters || []).forEach((parameter) => {
      const parameterType = normalizeLookupName(parameter.type || '');
      if (parameterType !== normalized) {
        return;
      }

      entries.push({
        name: command.name,
        parameterName: parameter.name,
        description: parameter.description || `تقرأ الدالة ${command.name} هذه البنية عبر البارامتر ${parameter.name} لتفهم الإعدادات أو البيانات التي تحملها.`
      });
    });
  });

  if (cacheKey) {
    functionsUsingStructureCache.set(cacheKey, entries);
  }

  return entries.slice(0, limit);
}

function getStructureFieldRows(item) {
  const cacheKey = String(item?.name || '');
  if (cacheKey && structureFieldRowsCache.has(cacheKey)) {
    return structureFieldRowsCache.get(cacheKey);
  }

  if (cacheKey && structureFieldRowsInProgress.has(cacheKey)) {
    return (item?.members || []).map((member) => ({
      name: member.name,
      type: member.type,
      description: member.description || '',
      source: 'members'
    }));
  }

  if (item?.members?.length) {
    const rows = item.members.map((member) => ({
      name: member.name,
      type: member.type,
      description: member.description || '',
      source: 'members'
    }));
    if (cacheKey) {
      structureFieldRowsCache.set(cacheKey, rows);
    }
    return rows;
  }

  if (!item?.example) {
    return [];
  }

  structureFieldRowsInProgress.add(cacheKey);
  try {
    const analysis = buildExampleAnalysis(item.example, item);
    const seen = new Set();
    const rows = analysis.tokenGroups.fields
      .filter((field) => normalizeLookupName(field.ownerType || '') === item.name)
      .filter((field) => {
        const key = `${field.name}|${field.type || ''}|${field.value || ''}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .map((field) => ({
        name: field.name,
        type: field.type || inferFieldTypeFromValue(field.value),
        description: field.value || '',
        source: 'example'
      }));

    if (cacheKey) {
      structureFieldRowsCache.set(cacheKey, rows);
    }

    return rows;
  } finally {
    structureFieldRowsInProgress.delete(cacheKey);
  }
}

function inferFieldTypeFromValue(value) {
  const text = String(value || '').trim();
  if (text === 'nullptr') return 'void*';
  if (text === '0') return 'uint32_t';
  const enumMeta = getEnumValueMetadata(text);
  if (enumMeta) {
    return enumMeta.enumName;
  }
  return '';
}

function renderStructureIntentSection(item) {
  const role = inferStructureRole(item);
  const relatedFunctions = findFunctionsUsingStructure(item.name, 8);
  const usageItems = getUsageItems(item).filter((text) => !isMarginalUsageText(text) && !isGenericStructureUsageText(text));
  const practicalUsage = usageItems[0] || (
    relatedFunctions.length
      ? `يُجهَّز ${item.name} ثم يُمرَّر عادةً إلى ${relatedFunctions.slice(0, 3).map((entry) => renderRelatedReferenceLink(entry.name)).join('، ')} حتى تقرأ الدالة الحقول التي تحدد الإعداد أو الطلب أو الخصائص المرتبطة بالاستدعاء.`
      : role.intent
  );
  const practicalBenefit = relatedFunctions.length
    ? `فائدة ${item.name} أنه يجمع القيم التي تحتاجها الدالة في بنية واحدة واضحة، بدلاً من نشر الإعدادات في بارامترات كثيرة أو قيم متفرقة يصعب ضبطها.`
    : `فائدة ${item.name} أنه يجعل الإعداد أو البيانات المرتبطة بالاستدعاء صريحة ومجمعة في موضع واحد يسهل تعبئته ومراجعته.`;

  return `
    <section class="info-section">
      <h2>🧠 استخدام الهيكل وفائدته</h2>
      <div class="info-grid">
        <div class="content-card prose-card">
          <div class="info-label">كيف تستخدمه؟</div>
          <p>${practicalUsage}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">ما فائدته في الكود؟</div>
          <p>${practicalBenefit}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">متى يكون جاهزاً للاستخدام؟</div>
          <p>${role.validity}</p>
        </div>
        <div class="content-card prose-card">
          <div class="info-label">متى يصبح استخدامه خاطئاً؟</div>
          <p>${role.failure}</p>
        </div>
      </div>
      ${relatedFunctions.length ? `
        <div class="content-card prose-card">
          <div class="info-label">مع أي دوال يظهر؟</div>
          <p>يظهر ${item.name} مع دوال مثل ${relatedFunctions.map((entry) => renderRelatedReferenceLink(entry.name)).join('، ')} لأن هذه الدوال تقرأ الحقول الموجودة داخله لتحديد الطلب أو الوصف أو الحالة المطلوبة قبل تنفيذ العملية.</p>
        </div>
      ` : ''}
    </section>
  `;
}

function renderStructureFieldsSection(item) {
  const fields = getStructureFieldRows(item);
  if (!fields.length) {
    return `
      <section class="members-section">
        <h2>${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} عناصر البنية</h2>
        <div class="content-card prose-card">
          <p>لم تتوفر حقول هذه البنية في البيانات الحالية بعد. عند وجود مثال مرتبط بها ستظهر الحقول المستخدمة وشرحها في تحليل الكود أسفل الصفحة.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="members-section">
      <h2>${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')} عناصر البنية</h2>
      <div class="structure-fields-card-grid">
        ${fields.map((field, index) => {
          const metadata = getFieldMetadata(field.name, item.name, field.description, field.type || '');
          const shapeSummary = renderValueShapeSummary(field.name, field.type || '', {ownerType: item.name});
          const anchorId = makeAnchorId('structure-field', `${item.name}-${field.name}`);
          return `
            <article class="content-card prose-card parameter-detail-card structure-field-card" id="${escapeAttribute(anchorId)}">
              <div class="parameter-card-head">
                <div class="parameter-card-order">الحقل ${index + 1}</div>
                <div class="parameter-card-title-wrap">
                  <h3 class="parameter-card-name parameter-card-code">${renderFieldReference(field.name, item.name, field.type || '', field.description || '')}</h3>
                  <div class="parameter-card-type-row">
                    <span class="parameter-card-type-label">النوع</span>
                    <div class="parameter-card-type">${field.type ? renderTypeReference(field.type) : '<code>غير موثق محلياً</code>'}</div>
                  </div>
                </div>
              </div>
              <div class="parameter-card-fields">
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">نوع القيمة والسياق</div>
                  <div class="parameter-card-field-value">${shapeSummary}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">معناه الحقيقي</div>
                  <div class="parameter-card-field-value">${renderPracticalText(metadata.meaning, `هذا الحقل جزء من ${item.name} ويحدد المعنى الأساسي الذي ستقرأه Vulkan من هذه البنية.`)}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">فائدته</div>
                  <div class="parameter-card-field-value">${renderPracticalText(metadata.benefit, `فائدة هذا الحقل أنه يوضح نية الاستخدام داخل ${item.name} بدل ترك السلوك ضمنياً.`)}</div>
                </div>
                <div class="parameter-card-field">
                  <div class="parameter-card-field-label">ماذا يغيّر؟</div>
                  <div class="parameter-card-field-value">${renderPracticalText(metadata.effect, `تغيير هذا الحقل يغيّر الطريقة التي تفسر بها Vulkan بيانات ${item.name} أو تنفذ العملية المرتبطة بها.`)}</div>
                </div>
                <div class="parameter-card-field parameter-card-field-wide">
                  <div class="parameter-card-field-label">كيف يُستخدم؟</div>
                  <div class="parameter-card-field-value">${renderPracticalText(metadata.usage, `يُستخدم هذا الحقل عندما تحتاج البنية ${item.name} إلى هذه القيمة أو المؤشر أثناء التنفيذ.`)}</div>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function toInlineArabicComment(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[؛:]+$/g, '')
    .replace(/\.$/g, '');
}

function buildStructureFieldInlineComment(field, ownerType) {
  const metadata = getFieldMetadata(field.name, ownerType, field.description || '', field.type || '');
  const preferred = toInlineArabicComment(metadata.inline)
    || toInlineArabicComment(metadata.meaning)
    || toInlineArabicComment(metadata.benefit)
    || toInlineArabicComment(field.description)
    || toInlineArabicComment(metadata.usage)
    || `حقل من ${ownerType}`;

  return preferred;
}

function buildFieldTooltip(fieldName, ownerType = '', fieldType = '', assignedValue = '') {
  return buildFieldEntityTooltip(fieldName, ownerType, fieldType, assignedValue);
}

async function openStructureField(event, ownerType, fieldName) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!ownerType || !fieldName) {
    return false;
  }

  await showStructure(ownerType);

  const anchorId = makeAnchorId('structure-field', `${ownerType}-${fieldName}`);
  const deferredSection = document.querySelector(`.deferred-structure-section[data-structure-name="${escapeSelectorValue(ownerType)}"][data-structure-section="fields"]`);
  if (deferredSection) {
    await loadDeferredStructureSection(deferredSection);
  }

  setTimeout(() => {
    scrollToAnchor(anchorId);
  }, 30);

  return false;
}

function renderFieldReference(fieldName, ownerType = '', fieldType = '', assignedValue = '') {
  const text = fieldName || '';
  const url = getExternalReferenceUrl(text, {ownerType});
  const tooltip = buildFieldTooltip(text, ownerType, fieldType, assignedValue);
  const aria = escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`);
  const anchorId = makeAnchorId('structure-field', `${ownerType || 'structure'}-${text || 'field'}`);

  if (ownerType) {
    return `<a href="#${escapeAttribute(anchorId)}" class="doc-link code-token" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="openStructureField(event, '${escapeAttribute(ownerType)}', '${escapeAttribute(text)}'); return false;">${escapeHtml(text)}</a>`;
  }

  if (!url) {
    return `<code class="code-token" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${escapeHtml(text)}</code>`;
  }

  return `<a href="${escapeAttribute(url)}" class="doc-link code-token" target="_blank" rel="noopener noreferrer" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${escapeHtml(text)}</a>`;
}

function buildStructureDefinitionSnippet(item) {
  const fields = getStructureFieldRows(item);
  if (!fields.length) {
    return '';
  }

  const normalizedFields = fields.map((field) => {
    const type = String(field.type || 'void*').trim() || 'void*';
    const name = String(field.name || '').trim();
    const declaration = `    ${type} ${name};`;
    const comment = buildStructureFieldInlineComment(field, item.name);
    return {declaration, comment};
  });

  const declarationWidth = normalizedFields.reduce((max, field) => Math.max(max, field.declaration.length), 0);
  const lines = [`typedef struct ${item.name} {`];

  normalizedFields.forEach((field) => {
    lines.push(`${field.declaration.padEnd(declarationWidth + 1, ' ')}// ${field.comment}`);
  });

  lines.push(`} ${item.name};`);
  return lines.join('\n');
}

function renderStructureDefinitionSection(item) {
  const snippet = buildStructureDefinitionSnippet(item);
  if (!snippet) {
    return '';
  }

  const lead = trimLeadingTypeName(getStructureLeadDescription(item) || inferStructureRole(item).meaning || item.description || '', item.name);

  return `
    <section class="info-section">
      <h2>🧾 تعريف البنية الكامل</h2>
      <div class="content-card prose-card">
        <p>هذا هو شكل البنية كما يستخدمها المبرمج داخل الكود. التعليق المرافق لكل عضو يشرح دوره العملي داخل ${lead || 'العملية التي تتحكم بها هذه البنية'}، لا مجرد نوع البيانات.</p>
      </div>
      <div class="code-container">
        <pre class="code-block"><code class="language-cpp">${formatExampleWithLinks(snippet)}</code></pre>
      </div>
    </section>
  `;
}

function renderStructureFunctionUsageSection(item) {
  const relatedFunctions = findFunctionsUsingStructure(item.name);
  if (!relatedFunctions.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>🔗 الدوال التي تستقبل هذه البنية</h2>
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
            <th>البارامتر</th>
            <th>كيف تستخدم البنية؟</th>
          </tr>
        </thead>
        <tbody>
          ${relatedFunctions.map((entry) => `
            <tr>
              <td>${renderRelatedReferenceLink(entry.name)}</td>
              <td><code>${entry.parameterName}</code></td>
              <td>${entry.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderDeferredStructureSectionShell(itemName, sectionKey, title, message) {
  return `
    <section class="info-section deferred-structure-section" data-structure-name="${escapeAttribute(itemName)}" data-structure-section="${escapeAttribute(sectionKey)}">
      <h2>${title}</h2>
      <div class="content-card prose-card deferred-structure-placeholder">
        <p>${escapeHtml(message)}</p>
        <p class="deferred-structure-autoload-note">سيُحمَّل هذا القسم تلقائياً عند الاقتراب منه أثناء التمرير.</p>
        <button type="button" class="deferred-structure-load-btn" onclick="loadDeferredStructureSection(this)">
          تحميل هذا القسم
        </button>
      </div>
    </section>
  `;
}

function renderStructureDeferredSection(sectionKey, item) {
  const cacheKey = `${item?.name || 'structure'}::${sectionKey}`;
  if (structureDeferredSectionCache.has(cacheKey)) {
    return structureDeferredSectionCache.get(cacheKey);
  }

  let html = '';
  if (sectionKey === 'fields') {
    html = renderStructureFieldsSection(item);
  } else if (sectionKey === 'function-usage') {
    html = renderStructureFunctionUsageSection(item);
  } else if (sectionKey === 'members-meaning') {
    html = renderMembersMeaningSection(item);
  } else if (sectionKey === 'definition') {
    html = renderStructureDefinitionSection(item);
  }

  structureDeferredSectionCache.set(cacheKey, html);
  return html;
}

async function loadDeferredStructureSection(trigger) {
  const section = trigger?.closest?.('.deferred-structure-section') || trigger;
  if (!section) {
    return;
  }

  if (section.dataset.loaded === 'true' || section.dataset.loading === 'true') {
    return;
  }

  const sectionKey = section.getAttribute('data-structure-section') || '';
  const itemName = section.getAttribute('data-structure-name') || '';
  if (!sectionKey || !itemName) {
    return;
  }

  const button = section.querySelector('.deferred-structure-load-btn');
  if (button) {
    button.disabled = true;
    button.textContent = 'جارٍ التحميل...';
  }
  section.dataset.loading = 'true';

  try {
    const structureEntry = findItemInCategoriesWithMeta(vulkanData.structures, itemName);
    if (structureEntry?.item?.detailBucket) {
      await ensureDataSegment('structures', structureEntry.item.detailBucket);
    }
    const item = findTypeItemByName(itemName);
    if (!item) {
      section.remove();
      return;
    }

    const html = renderStructureDeferredSection(sectionKey, item);
    if (!html) {
      section.remove();
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const renderedSection = wrapper.firstElementChild;
    if (!renderedSection) {
      section.remove();
      return;
    }

    section.replaceWith(renderedSection);
    renderedSection.dataset.loaded = 'true';
    highlightCode(renderedSection);
  } catch (error) {
    console.error(`Failed to load deferred structure section: ${sectionKey}`, error);
    if (button) {
      button.disabled = false;
      button.textContent = 'إعادة المحاولة';
    }
    delete section.dataset.loading;
  }
}

function initDeferredStructureSections(root = document) {
  const sections = Array.from(root.querySelectorAll('.deferred-structure-section'));
  if (!sections.length) {
    return;
  }

  const loadIfNearViewport = async () => {
    let remaining = 0;

    for (const section of sections) {
      if (section.dataset.loaded === 'true') {
        continue;
      }

      remaining += 1;
      const rect = section.getBoundingClientRect();
      const withinReach = rect.top < window.innerHeight + 280 && rect.bottom > -180;
      if (withinReach) {
        await loadDeferredStructureSection(section);
      }
    }

    return remaining;
  };

  if (typeof IntersectionObserver !== 'function') {
    const lazyPass = async () => {
      const remaining = await loadIfNearViewport();
      if (!remaining) {
        window.removeEventListener('scroll', lazyPass, true);
        window.removeEventListener('resize', lazyPass, true);
      }
    };

    window.addEventListener('scroll', lazyPass, PASSIVE_SCROLL_CAPTURE_OPTIONS);
    window.addEventListener('resize', lazyPass, true);
    lazyPass();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const section = entry.target;
      loadDeferredStructureSection(section).finally(() => {
        obs.unobserve(section);
      });
    });
  }, {
    rootMargin: '280px 0px'
  });

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function getRelatedFunctionNames(item, limit = 4) {
  return (item?.seeAlso || [])
    .filter((entry) => /^vk[A-Za-z0-9_]+$/.test(entry))
    .slice(0, limit);
}

function buildSystemContextEntries(item) {
  const haystack = [
    item?.name || '',
    item?.description || '',
    ...(item?.usage || []),
    ...(item?.notes || []),
    ...(item?.seeAlso || []),
    ...((item?.parameters || []).flatMap((param) => [param.name || '', param.type || '', param.description || '']))
  ].join(' ');

  const entries = [];
  const seen = new Set();
  const addEntry = (title, text) => {
    if (!seen.has(title)) {
      seen.add(title);
      entries.push({title, text});
    }
  };

  if (/drm|Drm|DRM|drmFd/.test(haystack)) {
    addEntry(
      'سياق DRM على Linux',
      'هذا العنصر لا يعمل داخل Vulkan فقط، بل يتقاطع مع vkGetDrmDisplayEXT أو vkAcquireDrmDisplayEXT ومع طبقة DRM في نواة Linux. قيمة drmFd تمثل واصف ملف إلى جهاز العرض أو بطاقة الرسوميات، ولذلك فصحة الاستدعاء لا تعتمد على Vulkan وحده، بل أيضاً على كون اتصال DRM والموارد النظامية المرتبطة به صحيحة ومملوكة للتطبيق.'
    );
  }

  if (/Display|VkDisplayKHR|display/.test(haystack)) {
    addEntry(
      'سياق Display المباشر',
      'العناصر المرتبطة بـ VkDisplayKHR تتعامل مع شاشة عرض أو مخرج Display على مستوى المنصة، لا مع نافذة application window فقط. هذا يعني أن الكائن يمثل مخرج عرض حقيقياً يمكن لبعض الامتدادات أن تتحكم فيه مباشرة عبر دوال مثل vkCreateDisplayModeKHR أو vkDisplayPowerControlEXT.'
    );
  }

  if (/Surface|Win32|Xlib|Wayland|AndroidSurface|MetalSurface|ScreenSurface|DirectFB|HeadlessSurface/.test(haystack)) {
    addEntry(
      'سياق Surface ونظام النوافذ',
      'العناصر المرتبطة بـ Surface تربط Vulkan بنظام النوافذ الأصلي مثل Win32 أو X11/Xlib أو Wayland أو Android. في هذا المستوى لا تتعامل فقط مع كائنات Vulkan، بل مع نافذة أو طبقة عرض أصلية يُنشأ لها VkSurfaceKHR ثم تُستخدم لاحقاً في استعلامات الدعم وإنشاء VkSwapchainKHR.'
    );
  }

  if (/Swapchain|swapchain|Present|present/.test(haystack)) {
    addEntry(
      'سياق Presentation Engine وSwapchain',
      'العناصر المرتبطة بـ VkSwapchainKHR تقع عند نقطة الربط بين Vulkan ومحرك العرض في النظام. صور Swapchain ليست مجرد VkImage عادية تنشئها بنفسك، بل صور يديرها مسار العرض والتقديم، وتُستخدم عبر vkAcquireNextImageKHR وvkQueuePresentKHR مع مراعاة حالات مثل إعادة إنشاء Swapchain عند تغيّر السطح أو أبعاده.'
    );
  }

  if (/PhysicalDevice|VkPhysicalDevice|queue family|QueueFamily|presentation support/.test(haystack)) {
    addEntry(
      'سياق العتاد الفعلي ودعم العرض',
      'إذا ظهر VkPhysicalDevice في هذا العنصر، فالمسألة لا تتعلق بوصف GPU فقط، بل أيضاً بقدرة هذا العتاد على دعم Queues والعرض على Surface أو Display محدد. لذلك كثير من الدوال المرتبطة به تجمع بين فحص العتاد وفحص دعم المنصة في الوقت نفسه.'
    );
  }

  if (/EXT|KHR|NV|AMD|QNX|FUCHSIA|GGP|SEC|MVK|HUAWEI/.test(item?.name || '')) {
    addEntry(
      'سياق الامتداد والمنصة',
      'اسم العنصر يشير إلى امتداد منصة أو بائع. هذا يعني أن توفره يعتمد على دعم الامتداد المقابل في برنامج التشغيل والنظام. وجود النوع أو الدالة في التوثيق لا يكفي وحده؛ يجب أيضاً أن يكون الامتداد معلناً ومفعلاً في VkInstance أو VkDevice بحسب نوع العنصر.'
    );
  }

  return entries;
}

function summarizeNarrativeShapeSamples(entries = []) {
  const labels = Array.from(new Set(
    entries
      .map((shape) => {
        if (!shape) {
          return '';
        }
        return shape.unit
          ? `${getValueShapeKindArabicLabel(shape.kind)} (${shape.unit})`
          : getValueShapeKindArabicLabel(shape.kind);
      })
      .filter(Boolean)
  ));

  return labels.slice(0, 4).join('، ');
}

function summarizeEntityDataRole(item, kind = 'entity') {
  if (kind === 'function') {
    const parameters = item?.parameters || [];
    if (!parameters.length) {
      return 'هذه الدالة لا تحمل حالة داخلية، لكن Vulkan تعتمد على المعاملات التي تمررها لتحديد الموارد والسلوك المطلوبين عند الاستدعاء.';
    }

    const sample = summarizeNarrativeShapeSamples(
      parameters.slice(0, 4).map((param) => inferValueShapeDetails(param.name, param.type || '', {functionName: item?.name || ''}))
    );
    return `المعاملات هي البيانات التي تغيّر التنفيذ هنا. تقرأ Vulkan ${sample || 'المقابض والمؤشرات والأعداد والإزاحات'} ثم تفسر علاقتها معًا لتحدد ما الذي ستقرأه أو تكتبه أو تسجله.`;
  }

  if (kind === 'structure') {
    const members = getStructureFieldRows(item);
    if (!members.length) {
      return 'هذه البنية لا تظهر حقولها محليًا بعد، لكن Vulkan تقرأ عناصرها كوحدة مترابطة وليس كقيم منفصلة مستقلة.';
    }

    const sample = summarizeNarrativeShapeSamples(
      members.slice(0, 4).map((member) => inferValueShapeDetails(member.name, member.type || '', {ownerType: item?.name || ''}))
    );
    return `حقول هذه البنية هي البيانات التي تحدد التنفيذ فعليًا. عند تمرير ${item?.name || 'هذه البنية'} تقرأ Vulkan ${sample || 'المقابض والمؤشرات والأعداد والأحجام'} ثم تبني القرار التنفيذي من العلاقة بين الأعداد والمؤشرات والمقابض والأعلام.`;
  }

  if (kind === 'enum') {
    const values = getEnumValueRows(item);
    if (!values.length) {
      return 'هذا التعداد لا يحمل بيانات متغيرة، بل مجموعة قيم ثابتة تختار منها قيمة واحدة تغيّر السلوك التنفيذي.';
    }

    const sample = values.slice(0, 3).map((entry) => entry.name).join('، ');
    return `القيم المعرفة داخل ${item?.name || 'هذا التعداد'} هي البيانات التي تختار منها التطبيق ما ستقرأه Vulkan كسلوك أو حالة. أمثلة: ${sample}${values.length > 3 ? ' ...' : ''}.`;
  }

  if (kind === 'macro') {
    return 'الماكرو لا يحمل حالة تنفيذية بحد ذاته، لكن ناتجه هو القيمة أو التعريف الذي سيدخل لاحقاً في حقول Vulkan أو منطق البناء أو المقارنات.';
  }

  return 'البيانات المرتبطة بهذا العنصر هي التي تجعل سلوك التنفيذ صريحاً بدلاً من الاعتماد على افتراضات ضمنية.';
}

function inferEntityDataEffect(item, kind = 'entity') {
  const name = String(item?.name || '');
  if (kind === 'function') {
    if (/^vkCmd/.test(name)) {
      return 'تغيير المعاملات يغيّر ما يُسجَّل داخل مخزن الأوامر: أي مورد سيُقرأ، وما العدد أو الإزاحة أو النطاق الذي سيستخدمه المعالج الرسومي عند التنفيذ.';
    }
    return 'تغيير المعاملات يغيّر ما ستفعله Vulkan فعليًا عند الاستدعاء: المورد المستهدف، أو السلوك المفعّل، أو البيانات التي ستقرأها أو تكتبها.';
  }

  if (kind === 'structure') {
    return 'تغيير حقول البنية يغيّر العملية نفسها التي ستنفذها Vulkan أو الموارد التي ستقرأها أو الأحجام والإزاحات والعدادات التي ستبني عليها التنفيذ، وليس مجرد وصف شكلي للبيانات.';
  }

  if (kind === 'enum') {
    return 'تغيير قيمة التعداد يبدل السياسة أو الحالة أو المسار الذي تختاره Vulkan أثناء التنفيذ، لذلك كل قيمة هنا تقود إلى سلوك فعلي مختلف.';
  }

  if (kind === 'macro') {
    return 'تغيير ناتج الماكرو أو موضع استخدامه يغيّر القيمة النهائية التي ستصل إلى الحقول أو المقارنات أو الترويسات، وبالتالي قد يتغير السلوك البرمجي أو التوافق.';
  }

  return 'تغيير هذا العنصر يغيّر الطريقة التي تفسر بها Vulkan الطلب أو المورد أو الحالة أثناء التنفيذ.';
}

function inferExecutionProfile(item, kind = 'entity') {
  const name = String(item?.name || '');
  const profileKey = `${kind}:${name}`;
  if (executionProfileInProgress.has(profileKey)) {
    return {
      entityType: kind === 'function' ? 'دالة' : kind === 'structure' ? 'بنية' : kind === 'enum' ? 'تعداد' : kind === 'macro' ? 'ماكرو' : kind === 'constant' ? 'ثابت' : 'كيان',
      role: preferStrictArabicVulkanText(item?.description || '', `${name || 'هذا العنصر'} عنصر من عناصر Vulkan.`),
      operation: preferStrictArabicVulkanText(item?.description || '', 'يحدد السلوك أو العملية المرتبطة بهذا العنصر.'),
      usedBy: 'يعتمد استخدامه على الدوال أو البنى المرتبطة به في السياق الحالي.',
      stage: 'استخدام عام داخل الواجهة',
      dataRole: 'تُقرأ البيانات المرتبطة بهذا العنصر لتحديد السلوك المطلوب دون الدخول في تحليل متداخل.',
      dataEffect: 'تغيير هذا العنصر يغير تفسير الطلب أو الحالة التنفيذية.',
      execution: 'تقرأ Vulkan هذا العنصر ضمن المسار الحالي لتحديد القرار أو السلوك التنفيذي.',
      engineeringGoal: 'الهدف الهندسي هو إبقاء المعنى البرمجي صريحًا وقابلًا للتحقق.'
    };
  }

  executionProfileInProgress.add(profileKey);
  try {
  const description = [item?.description || '', ...(item?.usage || []), ...(item?.notes || [])].join(' ');
  const haystack = `${name} ${description}`;
  const entityTypeMap = {
    function: 'دالة',
    structure: 'بنية',
    enum: /FlagBits|Flags/.test(name) ? 'علم' : 'تعداد',
    macro: 'ماكرو',
    constant: 'ثابت'
  };
  const entityType = entityTypeMap[kind] || 'كيان';

  let stage = 'استخدام عام داخل الواجهة';
  if (/^vkCreateInstance|^vkEnumerateInstance|VkApplicationInfo|VkInstanceCreateInfo/.test(haystack)) stage = 'التهيئة';
  else if (/^vkCreateDevice|VkDeviceCreateInfo|VkDeviceQueueCreateInfo/.test(haystack)) stage = 'إنشاء الجهاز';
  else if (/^vkCmd/.test(name)) stage = 'تسجيل الأوامر ثم التنفيذ على المعالج الرسومي';
  else if (/^vkQueue/.test(name)) stage = 'إرسال العمل إلى الطوابير ثم التنفيذ على المعالج الرسومي';
  else if (/Memory|Allocate|Bind|Map|Unmap|Barrier/.test(haystack)) stage = 'إدارة الذاكرة والتزامن';
  else if (/AccelerationStructure|RayTracing|Micromap|BLAS|TLAS|BVH/.test(haystack)) stage = 'بناء بنى التسارع';
  else if (/Swapchain|Present|Display|Surface/.test(haystack)) stage = 'العرض والتقديم';

  let role = 'عنصر من عناصر Vulkan يحدد كيف تُفسِّر الواجهة البيانات أو العمل المطلوب في هذا الموضع.';
  if (kind === 'function') {
    role = `${name} ${inferFunctionIntentSummary(item)}.`;
  } else if (kind === 'structure') {
    role = `${name} ${trimLeadingTypeName(getStructureLeadDescription(item) || inferStructureRole(item).meaning || item?.description || '', name)}.`;
  } else if (kind === 'enum') {
    role = `${name} ${getEnumMetadata(name).meaning || item?.description || 'يحدد مجموعة قيم تغيّر السلوك التنفيذي.'}`;
  } else if (kind === 'macro') {
    role = inferMacroPracticalMeaning(item);
  } else if (kind === 'constant') {
    role = item?.description || `${name} قيمة ثابتة تستخدمها Vulkan في سياق محدد.`;
  }

  let operation = 'يتحكم في العملية الدقيقة التي ستنفذها Vulkan أو في الطريقة التي ستفسر بها القيم المرتبطة بهذا المسار.';
  if (kind === 'function') {
    operation = inferFunctionIntentSummary(item);
  } else if (kind === 'structure') {
    operation = inferStructureRole(item).intent || role;
  } else if (kind === 'enum') {
    operation = getEnumMetadata(name).apiPurpose || role;
  } else if (kind === 'macro') {
    operation = inferMacroPracticalUsage(item);
  } else if (kind === 'constant') {
    operation = inferReferenceIntent(item, 'constant');
  }

  let usedBy = 'يظهر هذا العنصر في المواضع التي تحتاج فيها Vulkan قراءة هذا النوع من المعلومات.';
  if (kind === 'function') {
    usedBy = 'يستدعيه التطبيق مباشرة، ثم تقرأ Vulkan المعاملات الحالية وتنفذ العملية أو تسجلها بحسب نوع الدالة.';
  } else if (kind === 'structure') {
    const related = findFunctionsUsingStructure(name, 4).map((entry) => entry.name);
    if (related.length) {
      usedBy = `تستخدمه دوال مثل ${related.join('، ')} لأن هذه الدوال تقرأ حقوله لتحديد العملية أو الموارد أو الإعدادات التي ستبني عليها التنفيذ.`;
    }
  } else if (kind === 'enum') {
    const relatedFunctions = findFunctionsUsingEnum(name, 2).map((entry) => entry.name);
    const relatedStructures = findStructuresUsingEnum(name, 2).map((entry) => `${entry.structureName} → ${entry.fieldName}`);
    const related = [...relatedFunctions, ...relatedStructures].filter(Boolean);
    if (related.length) {
      usedBy = `تُقرأ قيمه في مواضع مثل ${related.join('، ')} لأن هذه المواضع تحتاج إعلان الفرع التنفيذي أو الحالة الرسمية التي ستفسر Vulkan بقية العمل على أساسها.`;
    }
  }

  let execution = 'تقرأ Vulkan هذه القيمة أو البنية أو الأمر لتعرف أي مورد أو فرع تنفيذي أو حالة وصول يجب أن تبني عليها التنفيذ الفعلي.';
  if (kind === 'function' && /^vkCmd/.test(name)) {
    execution = 'عند الاستدعاء لا يُنفذ العمل فورًا غالبًا، بل يُسجَّل في مخزن الأوامر. لاحقًا يقرأ المعالج الرسومي هذا التسجيل ويطبق القيم المرتبطة به أثناء التنفيذ الفعلي على الجهاز.';
  } else if (kind === 'structure' && /AccelerationStructure/.test(name)) {
    execution = 'تقرأ Vulkan الحقول معًا لتعرف أين توجد بيانات الهندسة، وما عدد البدائيات، وأين يقع مخزن العمل المؤقت، ثم تبني الهيكل الهرمي للتسارع أو تحدّثه على الجهاز وفق هذه القيم.';
  } else if (kind === 'structure') {
    execution = 'عند تمرير هذه البنية تقرأ Vulkan حقولها كوحدة واحدة؛ لذلك المعنى الحقيقي لا يأتي من كل حقل منفردًا فقط، بل من العلاقة بين الأعداد والمؤشرات والأعلام والمقابض داخلها.';
  } else if (kind === 'enum') {
    execution = 'لا تقرأ Vulkan الاسم النصي للتعداد، بل تقرأ الرمز الموافق له لتحدد أي فرع تنفيذي أو حالة وصول أو نمط تشغيل يجب أن يُفعّل داخل المشغل أو على المعالج الرسومي.';
  } else if (kind === 'macro') {
    execution = 'لا يقرأ المعالج الرسومي الماكرو نفسه، لكن ناتجه يحدد القيمة أو الاسم أو التعريف الذي ستستخدمه الواجهة أو الترويسات أو حقول الإعداد أثناء البناء أو التشغيل.';
  }

  let engineeringGoal = 'الهدف الهندسي هو جعل المعنى البرمجي صريحًا بحيث تتجنب Vulkan التخمين وتستطيع طبقات التحقق والمشغل تفسير الطلب بدقة.';
  if (/AccelerationStructure|RayTracing|BLAS|TLAS|BVH/.test(haystack)) {
    engineeringGoal = 'الهدف الهندسي هنا هو تمثيل بيانات الهندسة وأحجامها ومواردها بطريقة تسمح ببناء الهيكل الهرمي للتسارع بكفاءة، مع فصل الذاكرة الدائمة عن مخازن العمل المؤقتة وتقليل كلفة تتبع الأشعة.';
  } else if (/Memory|Allocate|Bind|Map|Unmap/.test(haystack)) {
    engineeringGoal = 'الهدف الهندسي هنا هو إعطاء التطبيق تحكمًا صريحًا في الذاكرة والأحجام والإزاحات بدل إخفاء الكلفة أو فرض قرارات تخصيص ضمنية.';
  } else if (/Swapchain|Present|Display|Surface/.test(haystack)) {
    engineeringGoal = 'الهدف الهندسي هنا هو فصل منطق العرض والتزامنه عن الرسم نفسه، بحيث يعرف التطبيق متى يكتسب صورة العرض ومتى يقدمها ومتى يعيد إنشاء الموارد المرتبطة بالسطح.';
  }

  return {
    entityType,
    role: preferStrictArabicVulkanText(role, `${name || 'هذا العنصر'} يحدد ما الذي يفعله داخل Vulkan.`),
    operation: preferStrictArabicVulkanText(operation, 'يتحكم في العملية التنفيذية المرتبطة بهذا العنصر.'),
    usedBy: preferStrictArabicVulkanText(usedBy, 'يعتمد استخدامه على الدوال أو البنى المرتبطة به في السياق الحالي.'),
    stage: preferStrictArabicVulkanText(stage, 'استخدام عام داخل الواجهة'),
    dataRole: preferStrictArabicVulkanText(summarizeEntityDataRole(item, kind), 'تُقرأ البيانات المرتبطة بهذا العنصر لتحديد السلوك المطلوب.'),
    dataEffect: preferStrictArabicVulkanText(inferEntityDataEffect(item, kind), 'تغيير هذا العنصر يغيّر تفسير الطلب أو الحالة التنفيذية.'),
    execution: preferStrictArabicVulkanText(execution, 'تقرأ Vulkan هذا العنصر ضمن المسار الحالي لتحديد القرار أو السلوك التنفيذي.'),
    engineeringGoal: preferStrictArabicVulkanText(engineeringGoal, 'الهدف الهندسي هو إبقاء المعنى البرمجي صريحًا وقابلًا للتحقق.')
  };
  } finally {
    executionProfileInProgress.delete(profileKey);
  }
}

function renderExecutionProfileSection(item, kind = 'entity') {
  const profile = inferExecutionProfile(item, kind);
  const renderProfileLabel = (index, title, note) => `
    <div class="info-label vulkan-execution-profile-title" data-tooltip="${escapeAttribute(note)}" tabindex="0" aria-label="${escapeAttribute(`${title}: ${note}`)}">
      <span class="vulkan-execution-profile-index">${index}</span>
      <span class="vulkan-execution-profile-title-text">${title}</span>
    </div>
  `;
  const renderEntityTypeProfileValue = () => {
    const entityTypeConfig = {
      function: {
        label: 'دالة',
        iconType: 'command',
        action: 'showCommandsIndex()',
        tooltip: 'هذا الكيان دالة من Vulkan. الضغط عليه يفتح فهرس الدوال حتى ترى بقية الدوال من النوع نفسه.'
      },
      structure: {
        label: 'بنية',
        iconType: 'structure',
        action: 'showStructuresIndex()',
        tooltip: 'هذا الكيان بنية Vulkan. الضغط عليه يفتح فهرس الهياكل والبنى المرتبطة.'
      },
      enum: {
        label: /FlagBits|Flags/.test(item?.name || '') ? 'علم' : 'تعداد',
        iconType: 'enum',
        action: 'showEnumsIndex()',
        tooltip: /FlagBits|Flags/.test(item?.name || '')
          ? 'هذا الكيان مجموعة أعلام أو بتات أعلام. الضغط عليه يفتح فهرس التعدادات والأعلام.'
          : 'هذا الكيان تعداد من Vulkan. الضغط عليه يفتح فهرس التعدادات.'
      },
      constant: {
        label: 'ثابت',
        iconType: 'constant',
        action: 'showConstantsIndex()',
        tooltip: 'هذا الكيان ثابت من Vulkan. الضغط عليه يفتح فهرس الثوابت.'
      },
      variable: {
        label: 'متغير',
        iconType: 'variable',
        action: 'showVariablesIndex()',
        tooltip: 'هذا الكيان متغير أو نوع خاص ضمن المشروع. الضغط عليه يفتح فهرس المتغيرات والأنواع الخاصة.'
      },
      glsl: {
        label: 'GLSL',
        iconType: 'glsl',
        action: 'showGlslIndex()',
        tooltip: 'هذا الكيان عنصر من مرجع GLSLang. الضغط عليه يفتح فهرس GLSL.'
      },
      macro: {
        label: 'ماكرو',
        iconType: 'macro',
        action: "showHomePage(); setTimeout(() => expandSidebarSectionById('macros-list'), 30);",
        tooltip: 'هذا الكيان ماكرو. الضغط عليه يفتح قسم الماكرو داخل فهرس Vulkan.'
      }
    };

    const config = entityTypeConfig[kind] || null;
    const tooltip = config?.tooltip || profile.entityType || 'يوضح هذا الحقل نوع الكيان الحالي داخل Vulkan.';
    const label = config?.label || profile.entityType;
    const iconType = config?.iconType || (kind && kind !== 'entity' ? (kind === 'function' ? 'command' : kind) : '');
    const content = iconType
      ? safeRenderEntityLabel(label, iconType)
      : escapeHtml(label);
    const action = config?.action || '';
    if (!action) {
      return `<span class="related-link related-link-static entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`)}">${content}</span>`;
    }

    return `<a href="#" class="related-link entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${action}; return false;">${content}</a>`;
  };
  return `
    <section class="info-section vulkan-execution-profile-section">
      <h2 data-tooltip="${escapeAttribute('يعرض هذا القسم الدور الحقيقي للكيان داخل Vulkan: ماذا يفعل، أين يستخدم، وكيف تقرأه الواجهة أثناء التنفيذ.')}" tabindex="0" aria-label="${escapeAttribute('الدور التنفيذي داخل Vulkan')}">🎯 الدور التنفيذي داخل Vulkan</h2>
      <div class="info-grid vulkan-execution-profile-grid">
        <div class="content-card prose-card">
          ${renderProfileLabel('1', 'نوع الكيان', 'يوضح هل العنصر دالة أو بنية أو تعداد أو ثابت أو ماكرو، لأن تفسيره يعتمد أولاً على فئته داخل Vulkan.')}
          <p>${renderEntityTypeProfileValue()}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('2', 'وظيفة الكيان في Vulkan', 'يشرح الدور الفعلي لهذا الكيان داخل واجهة Vulkan، لا مجرد وصف شكله أو اسمه.')}
          <p>${linkUsageBridgeText(profile.role)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('3', 'العملية التي يتحكم بها', 'يحدد العملية التنفيذية التي يشارك فيها هذا الكيان مثل الإنشاء أو العرض أو المزامنة أو بناء الموارد.')}
          <p>${linkUsageBridgeText(profile.operation)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('4', 'أين يُستخدم وما الدوال المرتبطة', 'يبين موضع استخدام الكيان داخل الواجهة البرمجية وما الدوال أو البنى التي تعتمد عليه أو تعيده.')}
          <p>${linkUsageBridgeText(profile.usedBy)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('5', 'ما البيانات أو القيم التي يحملها', 'يشرح نوع القيم أو الحقول التي يجمعها هذا الكيان وما الذي تمثله عمليًا في التنفيذ.')}
          <p>${linkUsageBridgeText(profile.dataRole)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('6', 'كيف تغيّر هذه البيانات التنفيذ', 'يوضح كيف يبدل تغيير القيم أو الحقول سلوك Vulkan أو الموارد أو نتائج التنفيذ.')}
          <p>${linkUsageBridgeText(profile.dataEffect)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('7', 'كيف يقرأها Vulkan أثناء التنفيذ', 'يشرح ما الذي تفعله Vulkan بهذه البيانات عند تفسيرها في المشغل أو أثناء تنفيذ العمل على المعالج الرسومي.')}
          <p>${linkUsageBridgeText(profile.execution)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('8', 'المجال ومرحلة التنفيذ', 'يحدد السياق الأكبر للكيان مثل التهيئة أو إدارة الذاكرة أو تسجيل الأوامر أو التنفيذ على المعالج الرسومي أو العرض.')}
          <p>${linkUsageBridgeText(profile.stage)}</p>
        </div>
        <div class="content-card prose-card">
          ${renderProfileLabel('9', 'الهدف الهندسي', 'يوضح لماذا صُمم هذا الكيان بهذا الشكل وما المشكلة الهندسية أو القيود التي يحلها داخل Vulkan.')}
          <p>${linkUsageBridgeText(profile.engineeringGoal)}</p>
        </div>
      </div>
    </section>
  `;
}

function renderSystemContextSection(item) {
  const entries = buildSystemContextEntries(item);
  if (!entries.length) {
    return '';
  }

  return `
    <section class="info-section">
      <h2>🧭 سياق المنصة والـ API النظامي</h2>
      <div class="info-grid">
        ${entries.map((entry) => `
          <div class="content-card prose-card">
            <div class="info-label">${entry.title}</div>
            <p>${linkUsageBridgeText(entry.text)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

const externalCppReferenceUrls = {
  bool: 'https://en.cppreference.com/w/cpp/language/types',
  char: 'https://en.cppreference.com/w/cpp/language/types',
  short: 'https://en.cppreference.com/w/cpp/language/types',
  int: 'https://en.cppreference.com/w/cpp/language/types',
  long: 'https://en.cppreference.com/w/cpp/language/types',
  float: 'https://en.cppreference.com/w/cpp/language/types',
  double: 'https://en.cppreference.com/w/cpp/language/types',
  signed: 'https://en.cppreference.com/w/cpp/language/types',
  unsigned: 'https://en.cppreference.com/w/cpp/language/types',
  true: 'https://en.cppreference.com/w/cpp/language/bool_literal',
  false: 'https://en.cppreference.com/w/cpp/language/bool_literal',
  auto: 'https://en.cppreference.com/w/cpp/language/auto',
  const: 'https://en.cppreference.com/w/cpp/language/cv',
  if: 'https://en.cppreference.com/w/cpp/language/if',
  else: 'https://en.cppreference.com/w/cpp/language/if',
  for: 'https://en.cppreference.com/w/cpp/language/for',
  while: 'https://en.cppreference.com/w/cpp/language/while',
  return: 'https://en.cppreference.com/w/cpp/language/return',
  throw: 'https://en.cppreference.com/w/cpp/language/throw',
  struct: 'https://en.cppreference.com/w/cpp/language/classes',
  class: 'https://en.cppreference.com/w/cpp/language/classes',
  void: 'https://en.cppreference.com/w/cpp/language/types',
  nullptr: 'https://en.cppreference.com/w/cpp/language/nullptr',
  'std::vector': 'https://en.cppreference.com/w/cpp/container/vector',
  'std::string': 'https://en.cppreference.com/w/cpp/string/basic_string',
  'std::array': 'https://en.cppreference.com/w/cpp/container/array',
  'std::optional': 'https://en.cppreference.com/w/cpp/utility/optional',
  'std::set': 'https://en.cppreference.com/w/cpp/container/set',
  'std::runtime_error': 'https://en.cppreference.com/w/cpp/error/runtime_error',
  'std::cout': 'https://en.cppreference.com/w/cpp/io/cout',
  'std::endl': 'https://en.cppreference.com/w/cpp/io/manip/endl',
  'uint32_t': 'https://en.cppreference.com/w/cpp/types/integer',
  'uint64_t': 'https://en.cppreference.com/w/cpp/types/integer',
  'int32_t': 'https://en.cppreference.com/w/cpp/types/integer',
  size_t: 'https://en.cppreference.com/w/cpp/types/size_t'
};

let enumReferenceMetadata = Object.freeze({});

const enumFieldTypeHints = {
  sType: 'VkStructureType',
  stage: 'VkShaderStageFlagBits',
  stageFlags: 'VkShaderStageFlagBits',
  presentMode: 'VkPresentModeKHR',
  imageLayout: 'VkImageLayout',
  initialLayout: 'VkImageLayout',
  finalLayout: 'VkImageLayout',
  layout: 'VkImageLayout',
  colorSpace: 'VkColorSpaceKHR',
  imageColorSpace: 'VkColorSpaceKHR',
  imageFormat: 'VkFormat',
  format: 'VkFormat',
  imageSharingMode: 'VkSharingMode',
  pipelineBindPoint: 'VkPipelineBindPoint',
  topology: 'VkPrimitiveTopology',
  samples: 'VkSampleCountFlagBits',
  rasterizationSamples: 'VkSampleCountFlagBits',
  loadOp: 'VkAttachmentLoadOp',
  storeOp: 'VkAttachmentStoreOp',
  stencilLoadOp: 'VkAttachmentLoadOp',
  stencilStoreOp: 'VkAttachmentStoreOp',
  level: 'VkCommandBufferLevel',
  compositeAlpha: 'VkCompositeAlphaFlagBitsKHR',
  srcStageMask: 'VkPipelineStageFlagBits',
  dstStageMask: 'VkPipelineStageFlagBits',
  pWaitDstStageMask: 'VkPipelineStageFlagBits'
};

const enumValuePrefixHints = [
  ['VK_STRUCTURE_TYPE_', 'VkStructureType'],
  ['VK_PRESENT_MODE_', 'VkPresentModeKHR'],
  ['VK_PIPELINE_STAGE_', 'VkPipelineStageFlagBits'],
  ['VK_SHADER_STAGE_', 'VkShaderStageFlagBits'],
  ['VK_PRIMITIVE_TOPOLOGY_', 'VkPrimitiveTopology'],
  ['VK_IMAGE_LAYOUT_', 'VkImageLayout'],
  ['VK_COLOR_SPACE_', 'VkColorSpaceKHR'],
  ['VK_FORMAT_', 'VkFormat'],
  ['VK_COMPOSITE_ALPHA_', 'VkCompositeAlphaFlagBitsKHR'],
  ['VK_SHARING_MODE_', 'VkSharingMode'],
  ['VK_PIPELINE_BIND_POINT_', 'VkPipelineBindPoint'],
  ['VK_SAMPLE_COUNT_', 'VkSampleCountFlagBits'],
  ['VK_ATTACHMENT_LOAD_OP_', 'VkAttachmentLoadOp'],
  ['VK_ATTACHMENT_STORE_OP_', 'VkAttachmentStoreOp'],
  ['VK_COMMAND_BUFFER_LEVEL_', 'VkCommandBufferLevel']
];

function findEnumItemByName(name) {
  return findItemInCategories(vulkanData.enums, name);
}

function getEnumMetadata(enumName) {
  const local = enumReferenceMetadata[enumName] || null;
  const item = findEnumItemByName(enumName);
  const meaningFallback = buildEnumTypeMeaningFallback(enumName);
  const apiPurposeFallback = buildEnumTypeApiPurposeFallback(enumName);
  const values = Object.fromEntries(
    Object.entries(local?.values || {}).map(([valueName, meta]) => [
      valueName,
      {
        ...meta,
        meaning: sanitizeEnumNarrativeText(meta?.meaning || '', buildEnumValueMeaningFallback(valueName, enumName, {enumName})),
        usage: sanitizeEnumNarrativeText(meta?.usage || '', buildEnumValueUsageFallback(valueName, enumName, {enumName})),
        benefit: sanitizeEnumNarrativeText(meta?.benefit || '', buildEnumValueBenefitFallback(valueName, enumName))
      }
    ])
  );
  return {
    name: enumName,
    item,
    meaning: sanitizeEnumNarrativeText(local?.meaning || item?.description || '', meaningFallback),
    apiPurpose: sanitizeEnumNarrativeText(local?.apiPurpose || '', apiPurposeFallback),
    values
  };
}

function inferEnumTypeFromValue(rawValue, context = {}) {
  const value = String(rawValue || '').trim();
  if (!value) {
    return '';
  }

  const castMatch = value.match(/^\((Vk[A-Za-z0-9_]+)\)\s*(-?\d+)\s*$/);
  if (castMatch) {
    return castMatch[1];
  }

  if (context.enumName) {
    return context.enumName;
  }

  if (context.typeName && findEnumItemByName(context.typeName)) {
    return context.typeName;
  }

  const fieldHint = enumFieldTypeHints[context.fieldName || ''];
  if (fieldHint) {
    if (context.ownerType === 'VkSubmitInfo' && context.fieldName === 'stage') {
      return 'VkPipelineStageFlagBits';
    }
    if (context.ownerType === 'VkPipelineShaderStageCreateInfo' && (context.fieldName === 'stage' || context.fieldName === 'stageFlags')) {
      return 'VkShaderStageFlagBits';
    }
    if (context.ownerType === 'VkAttachmentReference' && context.fieldName === 'layout') {
      return 'VkImageLayout';
    }
    return fieldHint;
  }

  if (value === 'VK_TRUE' || value === 'VK_FALSE') {
    return 'VkBool32';
  }

  for (const [prefix, enumName] of enumValuePrefixHints) {
    if (value.startsWith(prefix)) {
      return enumName;
    }
  }

  if (/^VK_SUCCESS$|^VK_SUBOPTIMAL_KHR$|^VK_ERROR_|^VK_TIMEOUT$|^VK_NOT_READY$|^VK_INCOMPLETE$/.test(value)) {
    return 'VkResult';
  }

  return '';
}

const getEnumValueMetadata = (...args) => vulkanEnumRuntime?.getEnumValueMetadata(...args) || null;

function renderEnumValueDetails(value, context = {}) {
  const metadata = getEnumValueMetadata(value, context);
  if (!metadata) {
    return '';
  }

  const valueLabel = metadata.symbolicName
    ? renderExternalReference(metadata.symbolicName)
    : `<code>${escapeHtml(value)}</code>`;
  const alternativesText = metadata.alternatives.length
    ? metadata.alternatives.map(({name, meta}) => `${renderExternalReference(name)}${meta?.meaning ? `: ${meta.meaning}` : ''}`).join('، ')
    : 'راجع صفحة التعداد الكاملة أو المواصفة إذا كنت تريد بدائل إضافية غير موثقة محلياً.';

  return `
    <li>
      ${valueLabel}:
      اسم التعداد: ${renderExternalReference(metadata.enumName)}.
      ما معناه؟ ${metadata.enumMeaning}
      لماذا يوجد في الـ API؟ ${metadata.apiPurpose}
      القيمة الحالية المستخدمة: ${metadata.symbolicName ? renderExternalReference(metadata.symbolicName) : `<code>${escapeHtml(value)}</code>`}
      المعنى الدقيق لهذه القيمة: ${metadata.valueMeaning}
      القيمة العددية: <code>${escapeHtml(metadata.numericValue)}</code>
      أين تُستخدم؟ ${metadata.usage}
      ما الدوال أو الحقول التي تعتمد عليها؟ ${metadata.affectedBy.length ? metadata.affectedBy.join('، ') : 'يعتمد عليها الحقل أو الاستدعاء الذي تظهر فيه داخل المثال.'}
      لماذا استُخدمت هنا؟ ${metadata.chosenBecause}
      الفائدة العملية منها: ${metadata.benefit}
      البدائل الأخرى: ${alternativesText}
      الفرق بينها وبين البدائل: ${metadata.difference}
      ماذا يحدث لو استخدمت قيمة خاطئة أو مختلفة؟ ${metadata.invalid}
    </li>
  `;
}

function buildEnumOverviewRows(enumName) {
  const metadata = getEnumMetadata(enumName);
  return Object.entries(metadata.values).map(([name, valueMeta]) => ({
    name,
    numeric: valueMeta.numeric || 'غير موثق محلياً',
    meaning: valueMeta.meaning || '',
    usage: valueMeta.usage || '',
    benefit: valueMeta.benefit || ''
  }));
}

const commandItemsCache = {value: null};
const functionsUsingEnumCache = new Map();
const structuresUsingEnumCache = new Map();

function getEnumRelatedTypeNames(enumName) {
  const names = new Set([normalizeLookupName(enumName)]);
  const flagBitsMatch = String(enumName || '').match(/^(Vk.+?)FlagBits(.*)$/);
  if (flagBitsMatch) {
    names.add(`${flagBitsMatch[1]}Flags${flagBitsMatch[2]}`);
  }
  const flagsMatch = String(enumName || '').match(/^(Vk.+?)Flags(.*)$/);
  if (flagsMatch) {
    names.add(`${flagsMatch[1]}FlagBits${flagsMatch[2]}`);
  }
  return [...names];
}

const getEnumValueRows = (...args) => vulkanEnumRuntime?.getEnumValueRows(...args) || [];

function inferCommandReturnType(item) {
  if (item?.returnType) {
    return normalizeLookupName(item.returnType);
  }

  const signature = String(item?.signature || '').trim();
  const match = signature.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+[A-Za-z_][A-Za-z0-9_]*\s*\(/);
  return match ? normalizeLookupName(match[1]) : '';
}

function collectAllCommandItems() {
  if (commandItemsCache.value) {
    return commandItemsCache.value;
  }
  const items = [];
  Object.entries(vulkanData.commands || {}).forEach(([categoryKey, category]) => {
    (category.items || []).forEach((item) => {
      items.push({
        ...item,
        categoryKey,
        categoryTitle: category.title || categoryKey
      });
    });
  });
  commandItemsCache.value = items;
  return items;
}

function findFunctionsUsingEnum(enumName, limit = 12) {
  const cacheKey = String(enumName || '');
  if (cacheKey && functionsUsingEnumCache.has(cacheKey)) {
    return functionsUsingEnumCache.get(cacheKey).slice(0, limit);
  }

  const typeNames = new Set(getEnumRelatedTypeNames(enumName));
  const entries = [];
  const seen = new Set();
  const getParameterMeaning = (parameter, command) => {
    if (parameter?.description) {
      return parameter.description;
    }

    const name = parameter?.name || 'هذا البارامتر';
    const type = normalizeLookupName(parameter?.type || '');
    if (/^p[A-Z]/.test(name)) {
      return `يمرر عنوان بيانات أو بنية تقرؤها الدالة ${command.name} لتحديد الإعدادات أو لاستلام النتائج.`;
    }
    if (type.startsWith('Vk')) {
      return `هذا البارامتر يستقبل قيمة من النوع ${renderAnalysisReference(type, command)}، وتقرأ الدالة ${renderRelatedReferenceLink(command.name)} هذه القيمة لتحديد السلوك أو المورد الذي ستعمل عليه.`;
    }
    return `يمرر القيمة التي تستخدمها الدالة ${command.name} في هذا الموضع من الاستدعاء.`;
  };
  const buildFunctionMeaning = (command) => {
    const intent = inferFunctionIntentSummary(command);
    const benefit = inferFunctionBenefitSummary(command);
    return benefit && benefit !== intent ? `${intent}. ${benefit}.` : `${intent}.`;
  };
  const pushEntry = (entry) => {
    const key = `${entry.name}|${entry.location}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push(entry);
  };

  collectAllCommandItems().forEach((command) => {
    const matches = [];
    const returnType = inferCommandReturnType(command);
    if (typeNames.has(returnType)) {
      matches.push({
        location: 'القيمة المرجعة',
        functionMeaning: buildFunctionMeaning(command),
        parameterMeaning: 'هذا التعداد لا يدخل كإعداد، بل تعيده الدالة كنتيجة يجب فحصها بعد الاستدعاء.',
        description: `تعيد الدالة قيمة من ${renderAnalysisReference(enumName, command)} مباشرة، لذلك يحدد هذا التعداد هل نجح الاستدعاء أو أعاد حالة خاصة أو خطأ.`,
        benefit: 'يفيدك ذلك في تحديد الخطوة التالية في الكود: المتابعة، إعادة المحاولة، أو معالجة الفشل.'
      });
    }

    (command.parameters || []).forEach((parameter) => {
      const parameterType = normalizeLookupName(parameter.type || '');
      if (!typeNames.has(parameterType)) {
        return;
      }

      matches.push({
        location: `البارامتر ${renderExternalReference(parameter.name, {ownerType: command.name}, parameter.name)}`,
        functionMeaning: buildFunctionMeaning(command),
        parameterMeaning: getParameterMeaning(parameter, command),
        description: `تستقبل الدالة القيمة عبر البارامتر ${renderExternalReference(parameter.name, {ownerType: command.name}, parameter.name)} من النوع ${renderAnalysisReference(parameterType, command)}. ${parameter.description || `اختيار قيمة ${renderAnalysisReference(enumName, command)} هنا يحدد السلوك الفعلي الذي ستنفذه الدالة في هذا الموضع.`}`,
        benefit: `الفائدة من تمرير ${renderAnalysisReference(enumName, command)} هنا هي تحديد سلوك الاستدعاء بشكل صريح ومقروء بدلاً من الاعتماد على أرقام أو منطق ضمني.`
      });
    });

    if (matches.length) {
      matches.forEach((match) => {
        pushEntry({
          name: command.name,
          functionMeaning: match.functionMeaning,
          location: match.location,
          parameterMeaning: match.parameterMeaning,
          description: match.description,
          benefit: match.benefit
        });
      });
    }
  });

  const structureUsage = findStructuresUsingEnum(enumName, 100);
  structureUsage.forEach((structureEntry) => {
    collectAllCommandItems().forEach((command) => {
      (command.parameters || []).forEach((parameter) => {
        const parameterType = normalizeLookupName(parameter.type || '');
        if (parameterType !== structureEntry.structureName) {
          return;
        }

        pushEntry({
          name: command.name,
          functionMeaning: buildFunctionMeaning(command),
          location: `عبر البنية ${renderRelatedReferenceLink(structureEntry.structureName)} والحقل ${renderExternalReference(structureEntry.fieldName, {ownerType: structureEntry.structureName}, structureEntry.fieldName)}`,
          parameterMeaning: parameter.description || `هذا البارامتر يستقبل البنية ${renderRelatedReferenceLink(structureEntry.structureName)} التي تحتوي على الحقل ${renderExternalReference(structureEntry.fieldName, {ownerType: structureEntry.structureName}, structureEntry.fieldName)} المرتبط بهذا التعداد.`,
          description: `تستقبل الدالة ${renderRelatedReferenceLink(command.name)} هذا التعداد بصورة غير مباشرة داخل البارامتر ${renderExternalReference(parameter.name, {ownerType: command.name}, parameter.name)} من النوع ${renderRelatedReferenceLink(structureEntry.structureName)}، ثم تقرأ الحقل ${renderExternalReference(structureEntry.fieldName, {ownerType: structureEntry.structureName}, structureEntry.fieldName)} لتحديد الطريقة التي ستنفذ بها العملية.`,
          benefit: `الفائدة العملية هنا أن قيمة ${renderAnalysisReference(enumName, command)} تغيّر تنفيذ الدالة عبر إعداد داخل البنية، مثل اختيار نمط العمل أو الحالة أو السياسة المطلوبة.`
        });
      });
    });
  });

  if (cacheKey) {
    functionsUsingEnumCache.set(cacheKey, entries);
  }
  return entries.slice(0, limit);
}

function findStructuresUsingEnum(enumName, limit = 12) {
  const cacheKey = String(enumName || '');
  if (cacheKey && structuresUsingEnumCache.has(cacheKey)) {
    return structuresUsingEnumCache.get(cacheKey).slice(0, limit);
  }

  const typeNames = new Set(getEnumRelatedTypeNames(enumName));
  const rows = [];

  Object.values(vulkanData.structures || {}).forEach((category) => {
    (category.items || []).forEach((structure) => {
      (structure.members || []).forEach((member) => {
        const memberType = normalizeLookupName(member.type || '');
        if (!typeNames.has(memberType)) {
          return;
        }

        rows.push({
          structureName: structure.name,
          fieldName: member.name,
          description: member.description || `الحقل ${member.name} داخل ${structure.name} يستقبل قيمة من ${enumName} لتحديد السلوك الذي ستقرأه الدالة من هذه البنية.`
        });
      });
    });
  });

  if (cacheKey) {
    structuresUsingEnumCache.set(cacheKey, rows);
  }
  return rows.slice(0, limit);
}

let knownFieldMetadata = Object.freeze({});

function makeAnchorId(prefix, name) {
  return `${prefix}-${String(name || '').replace(/[^a-zA-Z0-9_]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}`;
}

function getCanonicalReferenceDetailAnchorId(sectionName = '', detailName = '') {
  return makeAnchorId(`reference-${String(sectionName || 'detail').trim() || 'detail'}`, detailName);
}

function buildAppUrlForRoute(route = '') {
  const normalizedRoute = String(route || '').replace(/^#/, '');
  const baseUrl = `${window.location.pathname}${window.location.search}`;
  return normalizedRoute ? `#${normalizedRoute}` : baseUrl;
}

async function showReferenceHub(options = {}) {
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');
  return getReferenceRuntime()?.showReferenceHub?.(options);
}

async function showReferenceLibraryIndex(libraryId = '', options = {}) {
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');
  return getReferenceRuntime()?.showReferenceLibraryIndex?.(libraryId, options);
}

async function showReferenceKindIndex(libraryId = '', kindId = '', options = {}) {
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');
  return getReferenceRuntime()?.showReferenceKindIndex?.(libraryId, kindId, options);
}

async function showReferenceEntity(libraryId = '', kindId = '', slug = '', options = {}) {
  await ensureUiSegment('referenceTemplatesRuntime');
  await ensureUiSegment('referenceRuntimePage');
  return getReferenceRuntime()?.showReferenceEntity?.(libraryId, kindId, slug, options);
}

function syncRouteHistory(route = '', options = {}) {
  if (options?.skipHistory) {
    return;
  }

  const normalizedRoute = String(route || '').replace(/^#/, '');
  const targetHash = normalizedRoute ? `#${normalizedRoute}` : '';
  if ((window.location.hash || '') === targetHash) {
    return;
  }

  const method = options?.replaceHistory ? 'replaceState' : 'pushState';
  history[method](null, '', buildAppUrlForRoute(normalizedRoute));
  if (!options?.deferRecentVisitCapture) {
    scheduleRecentVisitCapture(normalizedRoute);
  }
}

const RECENT_VISITS_STORAGE_KEY = 'arabicvulkan.recentVisits';
const RECENT_VISITS_LIMIT = 8;
let recentVisitCaptureTimer = null;
let sidebarSmartScrollDirection = 'down';
let lastSidebarScrollTop = 0;
let sidebarJumpMenuOpen = false;
let sidebarSmartScrollIgnoreClickUntil = 0;
let sidebarCloseOpenIgnoreClickUntil = 0;
let pageSmartScrollDirection = 'down';
let lastPageScrollTop = 0;
let pageScrollUiFrame = 0;
let sidebarScrollUiFrame = 0;
let tooltipScrollFrame = 0;

function scheduleSidebarCloseOpenVisibilitySync() {
  [0, 90, 220].forEach((delay) => {
    window.setTimeout(() => updateSidebarCloseOpenButtonVisibility(), delay);
  });
}

function schedulePageScrollUiUpdate() {
  if (pageScrollUiFrame) {
    return;
  }

  pageScrollUiFrame = window.requestAnimationFrame(() => {
    pageScrollUiFrame = 0;
    updatePageSmartScrollButton();
  });
}

function scheduleSidebarScrollUiUpdate() {
  if (sidebarScrollUiFrame) {
    return;
  }

  sidebarScrollUiFrame = window.requestAnimationFrame(() => {
    sidebarScrollUiFrame = 0;
    if (sidebarJumpMenuOpen) {
      setSidebarJumpMenuOpen(false);
    }
    updateSidebarSmartScrollButton();
  });
}

function scheduleTooltipPositionUpdate() {
  if (tooltipScrollFrame) {
    return;
  }

  tooltipScrollFrame = window.requestAnimationFrame(() => {
    tooltipScrollFrame = 0;
    if (activeTooltipTarget) {
      positionTooltip(activeTooltipTarget);
    }
  });
}

function getSidebarClusterShortLabel(label = '', index = 0) {
  const compactLabel = String(label || '').replace(/\s+/g, ' ').trim();
  if (!compactLabel) {
    return String(index + 1);
  }

  const normalizedUpper = compactLabel.replace(/[^A-Za-z0-9_]+/g, '');
  if (normalizedUpper) {
    const knownShortcuts = [
      ['CMake', 'C'],
      ['Vulkan', 'V'],
      ['SDL3_image', 'SI'],
      ['SDL3_mixer', 'SM'],
      ['SDL3_ttf', 'ST'],
      ['SDL3', 'S'],
      ['GLSLang', 'G'],
      ['Dear ImGui', 'I']
    ];
    const knownShortcut = knownShortcuts.find(([name]) => compactLabel.includes(name));
    if (knownShortcut) {
      return knownShortcut[1];
    }

    if (/^[A-Za-z0-9_]+$/.test(compactLabel)) {
      return compactLabel.slice(0, 2).toUpperCase();
    }
  }

  const arabicWords = compactLabel.split(/\s+/).filter(Boolean);
  if (arabicWords.length >= 2) {
    return `${arabicWords[0][0] || ''}${arabicWords[1][0] || ''}`.trim();
  }

  return compactLabel.slice(0, 2);
}

function collectSidebarJumpTargets() {
  return Array.from(document.querySelectorAll('#sidebar .nav-cluster[id]'))
    .map((cluster, index) => {
      const titleElement = cluster.querySelector('.nav-super-header-title span');
      const label = titleElement?.textContent?.trim() || cluster.getAttribute('aria-label') || cluster.id;
      return {
        id: cluster.id,
        label,
        shortLabel: getSidebarClusterShortLabel(label, index)
      };
    });
}

function renderSidebarJumpMenu() {
  const menu = document.getElementById('sidebarJumpMenu');
  if (!menu) {
    return;
  }

  const targets = collectSidebarJumpTargets();
  menu.innerHTML = targets.map((target) => `
    <button
      type="button"
      class="sidebar-jump-chip"
      data-target="${escapeHtml(target.id)}"
      title="${escapeHtml(target.label)}"
      aria-label="اذهب إلى ${escapeHtml(target.label)}">
      ${escapeHtml(target.shortLabel)}
    </button>
  `).join('');
}

function updatePageSmartScrollButton() {
  const button = document.getElementById('pageSmartScrollButton');
  if (!button) {
    return;
  }

  const icon = button.querySelector('.page-smart-scroll-icon');
  const doc = document.documentElement;
  const maxScrollTop = Math.max((doc.scrollHeight || 0) - window.innerHeight, 0);
  const currentScrollTop = Math.max(window.scrollY || doc.scrollTop || 0, 0);
  const delta = currentScrollTop - lastPageScrollTop;
  const nearTop = currentScrollTop <= 24;
  const nearBottom = maxScrollTop > 0 && currentScrollTop >= Math.max(maxScrollTop - 24, 0);

  if (nearTop) {
    pageSmartScrollDirection = 'down';
  } else if (nearBottom) {
    pageSmartScrollDirection = 'up';
  } else if (Math.abs(delta) >= 2) {
    pageSmartScrollDirection = delta > 0 ? 'down' : 'up';
  }

  if (icon) {
    icon.textContent = pageSmartScrollDirection === 'up' ? '↑' : '↓';
    icon.style.transform = pageSmartScrollDirection === 'up' ? 'translateY(-1px)' : 'translateY(1px)';
  }

  button.setAttribute('aria-label', pageSmartScrollDirection === 'up' ? 'اصعد إلى أعلى الصفحة' : 'انزل إلى أسفل الصفحة');
  button.setAttribute('title', pageSmartScrollDirection === 'up' ? 'إلى أعلى الصفحة' : 'إلى أسفل الصفحة');
  button.style.display = 'inline-flex';
  lastPageScrollTop = currentScrollTop;
}

function togglePageSmartScroll() {
  const doc = document.documentElement;
  const maxScrollTop = Math.max((doc.scrollHeight || 0) - window.innerHeight, 0);
  const targetTop = pageSmartScrollDirection === 'up' ? 0 : maxScrollTop;
  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });
}

function initPageSmartScrollButton() {
  const button = document.getElementById('pageSmartScrollButton');
  if (!button) {
    return;
  }

  if (button.dataset.bound !== 'true') {
    button.dataset.bound = 'true';
    button.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      button.classList.add('is-active');
    });
    button.addEventListener('touchstart', () => {
      button.classList.add('is-active');
    }, {passive: true});
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePageSmartScroll();
    });
    ['pointerup', 'pointerleave', 'touchend', 'blur'].forEach((eventName) => {
      button.addEventListener(eventName, () => {
        button.classList.remove('is-active');
      }, {passive: true});
    });
    window.addEventListener('scroll', schedulePageScrollUiUpdate, {passive: true});
    window.addEventListener('resize', updatePageSmartScrollButton);
  }

  window.setTimeout(updatePageSmartScrollButton, 0);
}

function normalizeRecentVisitRoute(route = '') {
  return String(route || '').replace(/^#/, '').trim() || 'home';
}

function getRecentVisitSectionLabel(route = '') {
  const normalized = normalizeRecentVisitRoute(route);
  const [type] = normalized.split('/');
  if (normalized === 'home') return 'الرئيسية';
  if (normalized.startsWith('ref/cmake')) return 'CMake';

  const sectionMap = {
    command: 'Vulkan',
    structure: 'Vulkan',
    enum: 'Vulkan',
    constant: 'Vulkan',
    macro: 'Vulkan',
    commands: 'Vulkan',
    structures: 'Vulkan',
    variables: 'Vulkan',
    enums: 'Vulkan',
    constants: 'Vulkan',
    tutorials: 'الدروس',
    tutorial: 'الدروس',
    files: 'الملفات',
    file: 'الملفات',
    sdl3: 'SDL3',
    'sdl3-function': 'SDL3',
    'sdl3-type': 'SDL3',
    'sdl3-enum': 'SDL3',
    'sdl3-constant': 'SDL3',
    'sdl3-macro': 'SDL3',
    'sdl3-index': 'SDL3',
    'sdl3-package': 'SDL3',
    'sdl3-examples': 'SDL3',
    'sdl3-example': 'SDL3',
    'sdl3-package-section': 'SDL3',
    'sdl3-header': 'SDL3',
    imgui: 'Dear ImGui',
    'imgui-index': 'Dear ImGui',
    'imgui-examples': 'Dear ImGui',
    'imgui-example': 'Dear ImGui',
    glsl: 'GLSL',
    'glsl-index': 'GLSL',
    'glsl-examples': 'GLSL',
    'glsl-example': 'GLSL',
    'game-ui': 'واجهات الألعاب',
    'game-ui-index': 'واجهات الألعاب',
    'game-ui-example': 'واجهات الألعاب',
    'game-ui-examples': 'واجهات الألعاب',
    'vulkan-examples': 'Vulkan',
    'vulkan-example': 'Vulkan',
    cpp: 'C++',
    'site-usage': 'الدليل'
  };

  return sectionMap[type] || 'الموقع';
}

function getRecentVisitIconType(route = '') {
  const normalized = normalizeRecentVisitRoute(route);
  const [type] = normalized.split('/');
  if (normalized === 'home') return 'home';
  if (normalized.startsWith('ref/cmake')) return 'file';

  const iconMap = {
    command: 'command',
    structure: 'structure',
    enum: 'enum',
    constant: 'constant',
    macro: 'macro',
    tutorials: 'tutorial',
    tutorial: 'tutorial',
    files: 'file',
    file: 'file',
    sdl3: 'sdl3',
    'sdl3-function': 'command',
    'sdl3-type': 'structure',
    'sdl3-enum': 'enum',
    'sdl3-constant': 'constant',
    'sdl3-macro': 'macro',
    'sdl3-index': 'sdl3',
    'sdl3-package': 'sdl3',
    'sdl3-examples': 'command',
    'sdl3-example': 'command',
    'sdl3-package-section': 'file',
    'sdl3-header': 'file',
    imgui: 'imgui',
    'imgui-index': 'imgui',
    'imgui-examples': 'command',
    'imgui-example': 'command',
    glsl: 'glsl',
    'glsl-index': 'glsl',
    'glsl-examples': 'command',
    'glsl-example': 'command',
    'game-ui': 'tutorial',
    'game-ui-index': 'tutorial',
    'game-ui-example': 'command',
    'game-ui-examples': 'command',
    'vulkan-examples': 'command',
    'vulkan-example': 'command',
    cpp: 'file',
    'site-usage': 'tutorial'
  };

  return iconMap[type] || 'file';
}

function extractCurrentPageTitle() {
  const titleElement = document.querySelector('#mainContent h1, #mainContent .page-header h1, #mainContent h2');
  const text = String(titleElement?.textContent || '').replace(/\s+/g, ' ').trim();
  return text || 'صفحة بدون عنوان';
}

function readRecentVisits() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_VISITS_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeRecentVisits(items) {
  try {
    window.localStorage.setItem(RECENT_VISITS_STORAGE_KEY, JSON.stringify((items || []).slice(0, RECENT_VISITS_LIMIT)));
  } catch (error) {
    // تجاهل فشل التخزين.
  }
}

function renderRecentVisits() {
  const list = document.getElementById('recentVisitedList');
  const clearButton = document.getElementById('recentVisitedClearBtn');
  if (!list || !clearButton) {
    return;
  }

  const items = readRecentVisits();
  clearButton.hidden = items.length === 0;
  if (!items.length) {
    list.innerHTML = '<div class="recent-visited-empty">ستظهر هنا آخر الصفحات والعناصر التي فتحتها لتعود إليها بسرعة.</div>';
    return;
  }

  list.innerHTML = items.map((item, index) => `
    <div class="recent-visited-item">
      <button type="button" class="recent-visited-open-btn" onclick="openRecentVisit(${index})">
        <span class="result-icon">${renderEntityIcon(item.iconType || 'file', 'ui-codicon result-icon', item.title || item.section || 'زيارة حديثة')}</span>
        <span class="recent-visited-meta">
          <span class="recent-visited-name">${escapeHtml(item.title || 'عنصر')}</span>
          <span class="recent-visited-section">${escapeHtml(item.section || 'الموقع')}</span>
        </span>
      </button>
      <button type="button" class="recent-visited-remove-btn" aria-label="حذف هذا العنصر من الزيارات الأخيرة" onclick="removeRecentVisit(${index})">×</button>
    </div>
  `).join('');
}

function captureRecentVisit(route = '') {
  const normalizedRoute = normalizeRecentVisitRoute(route || window.location.hash.substring(1));
  if (normalizedRoute === 'home') {
    renderRecentVisits();
    return;
  }

  const title = extractCurrentPageTitle();
  if (!title) {
    return;
  }

  const nextItems = [
    {
      route: normalizedRoute,
      title,
      section: getRecentVisitSectionLabel(normalizedRoute),
      iconType: getRecentVisitIconType(normalizedRoute),
      visitedAt: Date.now()
    },
    ...readRecentVisits().filter((entry) => entry?.route !== normalizedRoute)
  ].slice(0, RECENT_VISITS_LIMIT);

  writeRecentVisits(nextItems);
  renderRecentVisits();
}

function scheduleRecentVisitCapture(route = '') {
  clearTimeout(recentVisitCaptureTimer);
  recentVisitCaptureTimer = window.setTimeout(() => captureRecentVisit(route), 90);
}

function clearRecentVisits() {
  try {
    window.localStorage.removeItem(RECENT_VISITS_STORAGE_KEY);
  } catch (error) {
    // تجاهل الخطأ.
  }
  renderRecentVisits();
}

function removeRecentVisit(index) {
  const items = readRecentVisits();
  items.splice(index, 1);
  writeRecentVisits(items);
  renderRecentVisits();
}

function openRecentVisit(index) {
  const item = readRecentVisits()[index];
  if (!item) {
    return;
  }

  const normalizedRoute = normalizeRecentVisitRoute(item.route);
  if (normalizedRoute === 'home') {
    showHomePage();
    return;
  }

  const targetHash = `#${normalizedRoute}`;
  if ((window.location.hash || '') === targetHash) {
    handleHashChange();
    return;
  }

  window.location.hash = normalizedRoute;
}

function updateSidebarSmartScrollButton() {
  const sidebar = document.getElementById('sidebar');
  const button = document.getElementById('sidebarSmartScrollButton');
  if (!sidebar || !button) {
    return;
  }

  const icon = button.querySelector('.sidebar-smart-scroll-icon');
  const maxScrollTop = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const currentScrollTop = Math.max(sidebar.scrollTop, 0);
  const delta = currentScrollTop - lastSidebarScrollTop;
  const nearTop = currentScrollTop <= 24;
  const nearBottom = maxScrollTop > 0 && currentScrollTop >= Math.max(maxScrollTop - 24, 0);

  if (nearTop) {
    sidebarSmartScrollDirection = 'down';
  } else if (nearBottom) {
    sidebarSmartScrollDirection = 'up';
  } else if (Math.abs(delta) >= 2) {
    sidebarSmartScrollDirection = delta > 0 ? 'down' : 'up';
  }

  if (icon) {
    icon.textContent = sidebarSmartScrollDirection === 'up' ? '↑' : '↓';
    icon.style.transform = sidebarSmartScrollDirection === 'up' ? 'translateY(-1px)' : 'translateY(1px)';
  }

  button.setAttribute('aria-label', sidebarSmartScrollDirection === 'up' ? 'اصعد إلى أعلى القائمة' : 'انزل إلى أسفل القائمة');
  button.setAttribute('title', sidebarSmartScrollDirection === 'up' ? 'إلى الأعلى' : 'إلى الأسفل');
  lastSidebarScrollTop = currentScrollTop;
}

function toggleSidebarSmartScroll() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) {
    return;
  }

  setSidebarJumpMenuOpen(false);
  const maxScrollTop = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const targetTop = sidebarSmartScrollDirection === 'up' ? 0 : maxScrollTop;

  sidebar.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });
}

function setSidebarJumpMenuOpen(open) {
  const menu = document.getElementById('sidebarJumpMenu');
  const button = document.getElementById('sidebarSmartScrollButton');
  if (!menu || !button) {
    return;
  }

  sidebarJumpMenuOpen = Boolean(open);
  menu.classList.toggle('is-open', sidebarJumpMenuOpen);
  button.classList.toggle('is-active', sidebarJumpMenuOpen);
}

function toggleSidebarJumpMenu(event) {
  event?.stopPropagation?.();
  setSidebarJumpMenuOpen(!sidebarJumpMenuOpen);
}

function jumpToSidebarCluster(clusterId = '') {
  const sidebar = document.getElementById('sidebar');
  const target = document.getElementById(clusterId);
  if (!sidebar || !target) {
    return;
  }

  setSidebarJumpMenuOpen(false);
  const sidebarRect = sidebar.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetTop = Math.max(sidebar.scrollTop + (targetRect.top - sidebarRect.top) - 12, 0);
  sidebar.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });
}

function updateSidebarCloseOpenButtonVisibility(forceVisible = false) {
  const button = document.getElementById('sidebarCloseOpenButton');
  if (!button) {
    return;
  }

  const hasOpenClusters = document.querySelector('#sidebar .nav-cluster:not(.collapsed), #sidebar .nav-section:not(.collapsed), #sidebar .nav-constant-group:not(.collapsed)');
  const shouldShow = forceVisible || Boolean(hasOpenClusters);
  button.classList.toggle('is-visible', shouldShow);
}

function closeSidebarOpenBranches() {
  document.querySelectorAll('#sidebar .nav-cluster:not(.collapsed)').forEach((element) => {
    element.classList.add('collapsed');
  });
  document.querySelectorAll('#sidebar .nav-section:not(.collapsed)').forEach((element) => {
    element.classList.add('collapsed');
  });
  document.querySelectorAll('#sidebar .nav-constant-group:not(.collapsed)').forEach((element) => {
    element.classList.add('collapsed');
  });
  setSidebarJumpMenuOpen(false);
  updateSidebarCloseOpenButtonVisibility(false);
}

function initSidebarSmartScrollButton() {
  const sidebar = document.getElementById('sidebar');
  const button = document.getElementById('sidebarSmartScrollButton');
  const menu = document.getElementById('sidebarJumpMenu');
  const closeButton = document.getElementById('sidebarCloseOpenButton');
  renderSidebarJumpMenu();
  if (!sidebar || !button || button.dataset.bound === 'true') {
    updateSidebarSmartScrollButton();
    updateSidebarCloseOpenButtonVisibility();
    return;
  }

  button.dataset.bound = 'true';
  lastSidebarScrollTop = Math.max(sidebar.scrollTop, 0);
  ['pointerdown', 'touchstart'].forEach((eventName) => {
    button.addEventListener(eventName, (event) => {
      event.stopPropagation();
      if (eventName === 'pointerdown' || eventName === 'touchstart') {
        event.preventDefault();
      }
    }, {passive: eventName === 'touchstart'});
  });
  button.addEventListener('touchstart', () => {
    sidebarSmartScrollIgnoreClickUntil = Date.now() + 700;
    sidebarCloseOpenIgnoreClickUntil = Date.now() + 700;
    if (!sidebarJumpMenuOpen) {
      setSidebarJumpMenuOpen(true);
      updateSidebarCloseOpenButtonVisibility(true);
      return;
    }

    toggleSidebarSmartScroll();
  }, {passive: false});
  ['mouseenter', 'focus'].forEach((eventName) => {
    button.addEventListener(eventName, () => {
      setSidebarJumpMenuOpen(true);
    });
  });
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (Date.now() < sidebarSmartScrollIgnoreClickUntil) {
      return;
    }

    toggleSidebarSmartScroll();
  });
  ['pointerdown', 'touchstart'].forEach((eventName) => {
    menu?.addEventListener(eventName, (event) => {
      event.stopPropagation();
    }, {passive: true});
  });
  menu?.addEventListener('click', (event) => {
    const chip = event.target instanceof Element ? event.target.closest('.sidebar-jump-chip') : null;
    if (!chip) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    jumpToSidebarCluster(chip.dataset.target || '');
  });
  closeButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (Date.now() < sidebarCloseOpenIgnoreClickUntil) {
      return;
    }
    closeSidebarOpenBranches();
  });
  closeButton?.addEventListener('touchend', (event) => {
    sidebarCloseOpenIgnoreClickUntil = Date.now() + 500;
    event.preventDefault();
    event.stopPropagation();
    closeSidebarOpenBranches();
  }, {passive: false});
  ['pointerdown', 'touchstart', 'mouseenter', 'focus'].forEach((eventName) => {
    button.addEventListener(eventName, () => {
      button.classList.add('is-active');
    }, {passive: eventName === 'touchstart'});
  });
  ['pointerup', 'pointerleave', 'touchend', 'blur'].forEach((eventName) => {
    button.addEventListener(eventName, () => {
      button.classList.remove('is-active');
    }, {passive: eventName === 'touchend'});
  });
  sidebar.addEventListener('scroll', scheduleSidebarScrollUiUpdate, {passive: true});
  sidebar.addEventListener('click', () => {
    window.setTimeout(() => updateSidebarCloseOpenButtonVisibility(), 0);
  }, {passive: true});
  window.addEventListener('resize', () => {
    updateSidebarSmartScrollButton();
    updateSidebarCloseOpenButtonVisibility();
  });
  document.addEventListener('click', (event) => {
    if (!sidebarJumpMenuOpen) {
      updateSidebarCloseOpenButtonVisibility();
      return;
    }
    if (button.contains(event.target) || menu?.contains(event.target)) {
      return;
    }
    setSidebarJumpMenuOpen(false);
    updateSidebarCloseOpenButtonVisibility();
  });
  window.setTimeout(updateSidebarSmartScrollButton, 0);
  window.setTimeout(() => updateSidebarCloseOpenButtonVisibility(), 0);
}

function getExternalReferenceUrl(name, context = {}) {
  if (!name) {
    return '';
  }

  if (externalCppReferenceUrls[name]) {
    return externalCppReferenceUrls[name];
  }

  if (name.startsWith('std::') && externalCppReferenceUrls[name]) {
    return externalCppReferenceUrls[name];
  }

  const base = 'https://docs.vulkan.org/refpages/latest/refpages/source/';

  if (name.startsWith('vk') || name.startsWith('Vk')) {
    return `${base}${name}.html`;
  }

  if (name.startsWith('VK_STRUCTURE_TYPE_')) {
    return `${base}VkStructureType.html`;
  }

  if (name.startsWith('VK_PIPELINE_STAGE_')) {
    return `${base}VkPipelineStageFlagBits.html`;
  }

  if (name.startsWith('VK_ACCESS_2_') || name.startsWith('VK_ACCESS_')) {
    return `${base}VkAccessFlagBits.html`;
  }

  if (name.startsWith('VK_IMAGE_USAGE_')) {
    return `${base}VkImageUsageFlagBits.html`;
  }

  if (name.startsWith('VK_QUEUE_')) {
    return `${base}VkQueueFlagBits.html`;
  }

  if (name.startsWith('VK_PRESENT_MODE_')) {
    return `${base}VkPresentModeKHR.html`;
  }

  if (name.startsWith('VK_COLOR_SPACE_')) {
    return `${base}VkColorSpaceKHR.html`;
  }

  if (name.startsWith('VK_COMPOSITE_ALPHA_')) {
    return `${base}VkCompositeAlphaFlagBitsKHR.html`;
  }

  if (name.startsWith('VK_IMAGE_LAYOUT_')) {
    return `${base}VkImageLayout.html`;
  }

  if (name.startsWith('VK_FORMAT_')) {
    return `${base}VkFormat.html`;
  }

  if (name.startsWith('VK_')) {
    return `${base}${name}.html`;
  }

  if (context.ownerType && /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !name.startsWith('vk') && !name.startsWith('Vk') && !name.startsWith('VK_')) {
    return `${base}${context.ownerType}.html`;
  }

  if ((name === 'nullptr' || name === 'NULL') && externalCppReferenceUrls.nullptr) {
    return externalCppReferenceUrls.nullptr;
  }

  return '';
}

function renderExternalReference(name, context = {}, label = '') {
  const text = label || name;
  const alias = resolveProjectReferenceAlias(name, context);
  if (alias) {
    const aliasNavigation = resolveReferenceNavigation(alias.targetName);
    const baseTooltip = alias.tooltip || buildNavigationTooltipForName(alias.targetName, aliasNavigation) || alias.label || text;
    return buildProjectAliasLink(alias, {
      className: 'doc-link',
      currentItem: context.currentItem || null,
      tooltipOverride: buildContextualReferenceTooltip(alias.label || text, baseTooltip, context)
    });
  }

  const navigation = resolveReferenceNavigation(name);
  if (navigation) {
    const tooltip = buildContextualReferenceTooltip(text, buildNavigationTooltipForName(name, navigation) || text, context);
    return `<a href="#" class="doc-link" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${navigation.command}; return false;">${escapeHtml(text)}</a>`;
  }

  return `<code>${escapeHtml(text)}</code>`;
}


function getFieldMetadata(fieldName, ownerType = '', assignedValue = '', fieldType = '') {
  const contextual = getContextualFieldMetadata(fieldName, ownerType, fieldType, assignedValue);
  const enrich = (metadata) => {
    const normalizedOwner = normalizeLookupName(ownerType);
    const normalizedType = normalizeLookupName(fieldType);
    const ownerSummary = getOwnerStructureSummary(normalizedOwner);
    const ownerLead = ownerSummary?.lead || ownerSummary?.intent || '';
    const ownerPurpose = toPracticalPurposePhrase(ownerLead);
    const benefit = metadata.benefit || (() => {
      if (fieldName === 'sType' && ownerLead) return `فائدته هنا أن Vulkan يفهم أن هذه البنية مخصصة لـ ${ownerLead}، لذلك يقرأ بقية الحقول على هذا الأساس الصحيح.`;
      if (fieldName === 'sType') return 'فائدته أن Vulkan يميز نوع البنية بدقة، فلا يقرأ الحقول على أنها تنتمي إلى بنية أخرى.';
      if (fieldName === 'pNext' && ownerLead) return `فائدته هنا أنه يفتح لهذه البنية مسار امتداد صريحًا، بحيث تستطيع عملية ${ownerLead} قراءة بنى إضافية من سلسلة pNext بدل حشر معلمات جديدة داخل ${normalizedOwner}.`;
      if (fieldName === 'pNext') return 'فائدته أنه يسمح بتمرير بنى امتدادية وميزات إضافية من دون تغيير شكل البنية الأساسية.';
      if (fieldName === 'flags') return 'فائدته أنه يجمع الخيارات الاختيارية التي تعدل سلوك البنية أو الاستدعاء في مكان واحد واضح.';
      if (/Count$/.test(fieldName)) return 'فائدته أنه يثبت العدد الحقيقي للعناصر المرتبطة بالمؤشر أو المصفوفة المرافقة، فيحافظ على اقتران العدد مع البيانات الفعلية التي ستقرأها Vulkan.';
      if (/^p[A-Z]/.test(fieldName) && ownerLead) return `فائدته هنا أنه يحمل البيانات الفعلية التي تحتاجها ${ownerLead} بدلاً من الاكتفاء بعدّاد أو راية عامة.`;
      if (/^p[A-Z]/.test(fieldName)) return 'فائدته أنه يحمل البيانات الفعلية أو المصفوفة التي تعتمد عليها الدالة بدل الاكتفاء بعدّاد أو راية عامة.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && fieldName === 'pEnabledFeatures') return 'فائدته أنه يحدد الميزات التي سيصبح الجهاز المنطقي قادراً على استخدامها فعلياً بعد الإنشاء.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && (fieldName === 'ppEnabledExtensionNames' || fieldName === 'enabledExtensionCount')) return 'فائدته أنه يحدد امتدادات الجهاز التي ستتوافر فعلياً على VkDevice الناتج.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && (fieldName === 'pQueueCreateInfos' || fieldName === 'queueCreateInfoCount')) return 'فائدته أنه يحدد الطوابير التي سيملكها الجهاز المنطقي منذ لحظة إنشائه.';
      if (normalizedType === 'VkImageLayout' || /Layout$/.test(fieldName)) return 'فائدته أنه يجعل انتقالات الصورة واستخدامها اللاحقين واضحين ومتوافقين مع ما تتوقعه Vulkan.';
      if (normalizedType === 'VkFormat' || fieldName === 'format') return 'فائدته أنه يحدد كيف تُفسَّر البيانات الثنائية فعلياً عند القراءة أو الكتابة.';
      return 'فائدته أنه يجعل نية هذا الحقل صريحة داخل البنية، فلا يبقى سلوك الاستدعاء معتمداً على افتراضات ضمنية.';
    })();
    const effect = metadata.effect || (() => {
      if (fieldName === 'sType' && ownerLead) return `تغيير قيمته يغيّر نوع المعلمات التي تتوقعها Vulkan هنا، وبالتالي يتبدل معنى ${normalizedOwner} كله بالنسبة إلى ${ownerLead}.`;
      if (fieldName === 'sType') return 'تغيير قيمته يغيّر هوية البنية نفسها بالنسبة إلى Vulkan، لذلك لا يجوز أن يحمل قيمة تخص بنية أخرى.';
      if (fieldName === 'pNext' && ownerLead) return `ربط بنية امتدادية هنا يمد ${normalizedOwner} بسلسلة معلومات إضافية، فيتغير ما ستقرأه الدالة فعليًا عند تنفيذ ${ownerLead}.`;
      if (fieldName === 'pNext') return 'ربط بنية امتدادية هنا يضيف ميزات أو حقولاً إضافية ويغيّر ما ستقرأه الدالة من السلسلة.';
      if (fieldName === 'flags') return 'تغيير الرايات هنا يفعّل أو يعطّل سلوكيات اختيارية في الإنشاء أو التنفيذ أو التفسير.';
      if (/Count$/.test(fieldName)) return 'تغيير هذا الحقل يغيّر عدد العناصر التي ستقرأها الدالة أو تكتبها فعلياً من المصفوفة أو المؤشر المرافق، لذلك يجب أن يبقى مطابقًا للبيانات الفعلية.';
      if (/^p[A-Z]/.test(fieldName) && ownerLead) return `تغيير المؤشر أو البيانات التي يشير إليها يغيّر المعلومات الفعلية التي ستعتمد عليها الدالة عند تنفيذ ${ownerLead}.`;
      if (/^p[A-Z]/.test(fieldName)) return 'تغيير المؤشر أو البيانات التي يشير إليها يغيّر المصدر الفعلي الذي تعتمد عليه الدالة أو النتيجة التي ستكتبها.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && fieldName === 'pEnabledFeatures') return 'تغيير هذا الحقل يغيّر الميزات التي ستعمل فعلياً على الجهاز المنطقي بعد إنشائه.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && (fieldName === 'ppEnabledExtensionNames' || fieldName === 'enabledExtensionCount')) return 'تغيير هذه القيم يغيّر قائمة امتدادات الجهاز المتاحة فعلياً بعد الإنشاء.';
      if (normalizedOwner === 'VkDeviceCreateInfo' && (fieldName === 'pQueueCreateInfos' || fieldName === 'queueCreateInfoCount')) return 'تغيير هذه القيم يغيّر عدد الطوابير المعرّفة وعائلاتها وأولوياتها داخل الجهاز المنطقي.';
      if (normalizedType === 'VkImageLayout' || /Layout$/.test(fieldName)) return 'تغيير layout هنا يغيّر الحالة التي تتوقعها Vulkan للصورة قبل الاستخدام أو بعده، وبالتالي يغيّر صحة الوصول التالي إليها.';
      if (normalizedType === 'VkFormat' || fieldName === 'format') return 'تغيير التنسيق يغيّر الطريقة التي تُفسَّر أو تُكتب بها البيانات، وقد يغيّر توافق المورد كله مع باقي المسار.';
      return 'تغيير هذا الحقل يغيّر المعنى العملي للبنية أو الطريقة التي ستقرأ بها الدالة بياناتها عند التنفيذ.';
    })();
    const inline = metadata.inline || (() => {
      if (fieldName === 'sType' && normalizedOwner) {
        return `يحدد أن هذه البنية هي ${normalizedOwner}`;
      }
      if (fieldName === 'pNext') {
        return 'يكون NULL أو يشير إلى بنية توسع هذه البنية عند الحاجة';
      }
      if (fieldName === 'flags' && ownerPurpose) {
        return `يحمل الرايات التي تضبط كيفية عمل البنية لأنها ${ownerPurpose}`;
      }
      if (/Count$/.test(fieldName) && ownerPurpose) {
        return `يحدد عدد العناصر التي ستستخدمها البنية لأنها ${ownerPurpose}`;
      }
      return '';
    })();

    return {
      ...metadata,
      benefit,
      effect,
      inline
    };
  };

  if (contextual) {
    return enrich(contextual);
  }

  const direct = knownFieldMetadata[fieldName];
  if (direct) {
    return enrich(direct);
  }

  if (/^p[A-Z]/.test(fieldName)) {
    return enrich({
      what: `حقل مؤشر داخل ${ownerType || 'البنية الحالية'}.`,
      meaning: inferFieldShapeMeaning(fieldName, ownerType, fieldType),
      usage: inferFieldShapeUsage(fieldName, ownerType, fieldType),
      possibleValues: inferFieldShapePossibleValues(fieldName, ownerType, fieldType),
      invalid: inferFieldShapeInvalid(fieldName, ownerType, fieldType)
    });
  }

  if (/Count$/.test(fieldName)) {
    return enrich({
      what: `حقل عددي داخل ${ownerType || 'البنية الحالية'}.`,
      meaning: inferFieldShapeMeaning(fieldName, ownerType, fieldType),
      usage: inferFieldShapeUsage(fieldName, ownerType, fieldType),
      possibleValues: inferFieldShapePossibleValues(fieldName, ownerType, fieldType),
      invalid: inferFieldShapeInvalid(fieldName, ownerType, fieldType)
    });
  }

  return enrich({
    what: `عضو داخل ${ownerType || 'البنية الحالية'}.`,
    meaning: inferFieldShapeMeaning(fieldName, ownerType, fieldType),
    usage: inferFieldShapeUsage(fieldName, ownerType, fieldType),
    possibleValues: assignedValue ? `في هذا السطر أُسندت له القيمة ${assignedValue}. ${inferFieldShapePossibleValues(fieldName, ownerType, fieldType)}` : inferFieldShapePossibleValues(fieldName, ownerType, fieldType),
    invalid: inferFieldShapeInvalid(fieldName, ownerType, fieldType),
    inline: ''
  });
}

function stripInlineComment(line) {
  const commentIndex = line.indexOf('//');
  if (commentIndex === -1) {
    return line;
  }

  return line.slice(0, commentIndex).trimEnd();
}

function buildVariableIndex(variables) {
  const index = {};
  variables.forEach((variable) => {
    index[variable.name] = variable;
  });
  return index;
}

function collectFieldAssignments(example, variableIndex) {
  const fields = [];
  const seen = new Set();

  String(example || '').split('\n').forEach((line) => {
    const clean = stripInlineComment(line).trim();
    const match = clean.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*=\s*(.+);$/);
    if (!match) {
      return;
    }

    const owner = match[1];
    const name = match[2];
    const value = match[3].trim();
    const ownerType = variableIndex[owner]?.type || '';
    const ownerItem = ownerType ? findItemInCategories(vulkanData.structures, ownerType) : null;
    const ownerFields = ownerItem ? getStructureFieldRows(ownerItem) : [];
    const fieldType = ownerFields.find((entry) => entry.name === name)?.type || '';
    const key = `${owner}:${name}:${value}`;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    fields.push({owner, name, value, ownerType, fieldType});
  });

  return fields;
}

function collectUsedTokens(example, variableIndex) {
  const unique = extractUniqueVulkanCodeTokens(example);

  const functions = unique
    .filter((token) => token.startsWith('vk'))
    .map((name) => ({name, item: findCommandItemByName(name)}));

  const types = unique
    .filter((token) => token.startsWith('Vk'))
    .map((name) => ({name, item: findTypeItemByName(name)}));

  const constants = unique
    .filter((token) => token.startsWith('VK_'))
    .map((name) => ({
      name,
      item: findMacroItemByName(name) || findConstantItemByName(name),
      kind: findMacroItemByName(name) ? 'macro' : 'constant'
    }));

  const cpp = unique
    .filter((token) => token === 'nullptr' || token.startsWith('std::'))
    .map((name) => ({name, item: getCppReferenceItem(name)}));

  return {
    functions,
    types,
    constants,
    cpp,
    fields: collectFieldAssignments(example, variableIndex)
  };
}

function describeValueMeaning(value, ownerType = '') {
  const normalized = String(value || '').trim();
  const enumMeta = getEnumValueMetadata(normalized, {typeName: normalizeLookupName(ownerType)});
  const macroItem = /^VK_/.test(normalized) ? findMacroItemByName(normalized) : null;

  if (enumMeta) {
    const enumSentence = `${enumMeta.valueName} قيمة من ${enumMeta.enumName}${enumMeta.numericValue ? ` (رقمها ${enumMeta.numericValue})` : ''}.`;
    if (/^\(Vk[A-Za-z0-9_]+\)\s*-?\d+$/.test(normalized)) {
      return `${enumSentence} هذه الكتابة تستخدم cast عددي؛ هي صالحة نحوياً إذا كان الرقم يطابق قيمة معرفة رسمياً، لكن الاسم الرمزي أوضح وأقل عرضة لسوء الفهم.`;
    }
    return `${enumSentence} ${enumMeta.valueMeaning} ${enumMeta.benefit}`;
  }

  if (normalized === 'VK_NULL_HANDLE') {
    return 'ثابت Vulkan خاص يدل على أن متغير الـ handle لا يشير حالياً إلى أي كائن Vulkan مرتبط فعلياً؛ يختلف هذا عن handle تمت كتابته بقيمة حقيقية من دالة إنشاء أو استعلام.';
  }

  if (normalized === 'nullptr') {
    return 'قيمة C++ خاصة تعني أن المؤشر لا يشير إلى أي عنوان فعلي.';
  }

  if (normalized === '0') {
    return 'القيمة العددية صفر، وتستخدم هنا كقيمة ابتدائية أو كقيمة تعداد/راية عندما تسمح المواصفة بذلك.';
  }

  if (normalized === '{}') {
    return `تهيئة صفرية لجميع أعضاء ${ownerType || 'هذا الكائن'} بحيث تبدأ القيم العددية من 0 وتبدأ المؤشرات من null.`;
  }

  if (/^VK_/.test(normalized)) {
    if (macroItem) {
      return `${inferMacroPracticalMeaning(macroItem)} ${inferMacroPracticalBenefit(macroItem)}`;
    }
    return `قيمة معرفة في Vulkan باسم ${normalized} وتستخدم هنا لتحديد سلوك صريح بدلاً من رقم حرفي.`;
  }

  if (/^&[A-Za-z_]\w*$/.test(normalized)) {
    return `مؤشر إلى المتغير ${normalized.slice(1)} حتى تقرأ الدالة منه أو تكتب فيه نتيجة.`;
  }

  if (/^".*"$/.test(normalized)) {
    return 'سلسلة نصية ثابتة تُمرر كما هي، وغالباً تمثل اسماً أو نقطة دخول أو معرفاً نصياً.';
  }

  if (/^vk[A-Za-z0-9_]+\(/.test(normalized)) {
    const match = normalized.match(/^(vk[A-Za-z0-9_]+)/);
    return match ? `هذه القيمة ناتجة من استدعاء الدالة ${match[1]}.` : 'ناتج استدعاء دالة يُخزن في هذا الموضع.';
  }

  return `القيمة المعينة هنا هي ${normalized}، ومعناها الدقيق يعتمد على نوع الحقل أو المتغير الذي تستقر فيه.`;
}

function describeCodeLinePrecisely(line, context = {}) {
  const trimmed = stripInlineComment(line).trim();
  const variableIndex = context.variableIndex || {};

  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
    return '';
  }

  if (trimmed === '{' || trimmed === '}' || trimmed === '};' || trimmed === ');' || trimmed === ')' || trimmed === '},') {
    return '';
  }

  if (trimmed.startsWith('#include')) {
    return 'تضمين الترويسة التي تعرّف الأنواع والدوال والمقابض المستخدمة في هذا المثال.';
  }

  if (/^return\b/.test(trimmed)) {
    return `إنهاء الدالة الحالية وإرجاع ${trimmed.replace(/^return\s+/, '').replace(/;$/, '')} إلى المستدعي.`;
  }

  const fieldMatch = trimmed.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*=\s*(.+);$/);
  if (fieldMatch) {
    const owner = fieldMatch[1];
    const field = fieldMatch[2];
    const value = fieldMatch[3].trim();
    const ownerType = variableIndex[owner]?.type || 'هذه البنية';
    const enumValueMeta = getEnumValueMetadata(value, {ownerType, fieldName: field, functionName: context.item?.name || ''});

    if (field === 'sType') {
      return `إسناد الحقل sType داخل ${owner} من النوع ${ownerType} إلى ${value} حتى تتعرف دوال Vulkan على نوع البنية الفعلي عند تمريرها.`;
    }

    if (field === 'pNext') {
      return value === 'nullptr'
        ? `ترك سلسلة pNext داخل ${owner} فارغة بعدم تمرير أي بنى امتدادية إضافية مع ${ownerType}.`
        : `ربط الحقل pNext داخل ${owner} ببنية امتدادية إضافية عبر ${value}.`;
    }

    if (enumValueMeta) {
      return `إسناد الحقل ${field} داخل ${owner} من النوع ${ownerType} إلى القيمة ${enumValueMeta.valueName} من التعداد ${enumValueMeta.enumName}، لأن هذا الاختيار هو الذي يحدد السلوك الفعلي لهذا الحقل في هذا الاستدعاء.`;
    }

    return `إسناد الحقل ${field} داخل ${owner} من النوع ${ownerType} إلى ${value} لأن هذا الحقل يحدد جزءاً من سلوك البنية أو البيانات التي ستقرأها الدالة لاحقاً.`;
  }

  const callAssignMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(vk[A-Za-z0-9_]+)\s*\(([\s\S]*)\);?$/);
  if (callAssignMatch) {
    return `تعريف المتغير ${callAssignMatch[2]} من النوع ${callAssignMatch[1].trim()} ثم تخزين القيمة المرجعة من ${callAssignMatch[3]} فيه حتى يمكن فحص النجاح أو استخدام الناتج مباشرة.`;
  }

  const zeroInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>]*)\s+([A-Za-z_]\w*)\s*=\s*\{\s*\};?$/);
  if (zeroInitMatch) {
    return `تعريف ${zeroInitMatch[2]} من النوع ${zeroInitMatch[1]} مع تهيئة صفرية لجميع أعضائه حتى تبدأ الحقول العددية والمؤشرات بحالة معروفة قبل تعبئتها بالقيم المطلوبة.`;
  }

  const handleInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>]*)\s+([A-Za-z_]\w*)\s*=\s*VK_NULL_HANDLE;$/);
  if (handleInitMatch) {
    const typeName = normalizeLookupName(handleInitMatch[1]);
    const typeItem = findTypeItemByName(typeName);
    const related = getRelatedFunctionNames(typeItem).join('، ');
    return `تعريف المتغير ${handleInitMatch[2]} من النوع ${typeName}، وهو handle من Vulkan، ثم تهيئته إلى VK_NULL_HANDLE للدلالة على أنه لا يرتبط بعد بكائن فعلي. ${related ? `هذا النوع يُستخدم مثلاً مع الدوال: ${related}.` : ''}`;
  }

  const pointerInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*nullptr;$/);
  if (pointerInitMatch) {
    return `تعريف المؤشر ${pointerInitMatch[2]} من النوع ${pointerInitMatch[1].trim()} وتهيئته إلى nullptr لأنه لا يشير بعد إلى ذاكرة أو كائن صالح.`;
  }

  const numericInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(0|1);$/);
  if (numericInitMatch) {
    const enumValueMeta = getEnumValueMetadata(numericInitMatch[3], {typeName: normalizeLookupName(numericInitMatch[1].trim())});
    if (enumValueMeta) {
      return `تعريف ${numericInitMatch[2]} من النوع ${numericInitMatch[1].trim()} وإعطاؤه القيمة ${numericInitMatch[3]} التي تمثل ${enumValueMeta.valueName} من ${enumValueMeta.enumName}.`;
    }
    return `تعريف ${numericInitMatch[2]} من النوع ${numericInitMatch[1].trim()} وإعطاؤه القيمة الابتدائية ${numericInitMatch[3]} حتى تبدأ المقارنة أو العد أو التعبئة من حالة معلومة.`;
  }

  const genericAssignMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(.+);$/);
  if (genericAssignMatch) {
    const enumValueMeta = getEnumValueMetadata(genericAssignMatch[3].trim(), {
      typeName: normalizeLookupName(genericAssignMatch[1].trim()),
      functionName: context.item?.name || ''
    });
    if (enumValueMeta) {
      return `تعريف ${genericAssignMatch[2]} من النوع ${genericAssignMatch[1].trim()} وإسناد القيمة ${enumValueMeta.valueName} من التعداد ${enumValueMeta.enumName} إليه، لأن هذه القيمة هي الفرع التنفيذي الذي سيقرأه هذا الموضع صراحة.`;
    }
    return `تعريف ${genericAssignMatch[2]} من النوع ${genericAssignMatch[1].trim()} وإسناد القيمة ${genericAssignMatch[3].trim()} إليه لأن هذا الموضع يحتاج قيمة جاهزة أو نتيجة سيتم الاعتماد عليها داخل المثال.`;
  }

  const directCallMatch = trimmed.match(/^(vk[A-Za-z0-9_]+)\s*\(/);
  if (directCallMatch) {
    return `استدعاء الدالة ${directCallMatch[1]} لتنفيذ العملية الفعلية المطلوبة في هذا الموضع من تسلسل Vulkan.`;
  }

  const handleConditionMatch = trimmed.match(/^if\s*\(\s*([A-Za-z_]\w*)\s*(!=|==)\s*VK_NULL_HANDLE\s*\)\s*\{?$/);
  if (handleConditionMatch) {
    const variableName = handleConditionMatch[1];
    const comparison = handleConditionMatch[2];
    const variable = variableIndex[variableName];
    const typeName = normalizeLookupName(variable?.type || '');
    const typeItem = typeName ? findTypeItemByName(typeName) : null;
    const related = getRelatedFunctionNames(typeItem).join('، ');
    if (comparison === '!=') {
      return `فحص ما إذا كان ${variableName}${typeName ? ` من النوع ${typeName}` : ''} لا يساوي VK_NULL_HANDLE، أي أنه يحمل قيمة handle غير فارغة قبل تمريره إلى دوال تتطلب كائناً فعلياً${related ? ` مثل ${related}` : ''}. هذا الفحص يثبت فقط أن المتغير ليس فارغاً، لكنه لا يثبت وحده أن الكائن ما زال حياً أو متوافقاً مع هذا السياق.`;
    }
    return `فحص ما إذا كان ${variableName}${typeName ? ` من النوع ${typeName}` : ''} يساوي VK_NULL_HANDLE، أي أنه لا يرتبط حالياً بأي كائن Vulkan فعلي. يُستخدم هذا عادة قبل الإنشاء أو قبل محاولة استخدام مورد لم يُسترجع بعد${related ? ` من دوال مثل ${related}` : ''}.`;
  }

  if (/^if\s*\(/.test(trimmed)) {
    const enumTokens = findUniqueVulkanConstantTokens(trimmed);
    if (enumTokens.length) {
      const detailed = enumTokens
        .map((token) => getEnumValueMetadata(token, {functionName: context.item?.name || ''}))
        .filter(Boolean);
      if (detailed.length) {
        return `تقييم شرط يعتمد على ${detailed.map((entry) => `${entry.valueName} من ${entry.enumName}`).join('، ')} لتحديد ما إذا كان التنفيذ سيستمر في المسار المناسب لهذه الحالة.`;
      }
    }
    return `تقييم الشرط ${trimmed.slice(0, -1)} لاختيار ما إذا كانت القيم الحالية تستوفي المتطلبات التقنية قبل تنفيذ الكتلة التالية.`;
  }

  if (/^else\b/.test(trimmed)) {
    return 'الدخول إلى المسار البديل الذي يعمل عندما لا يتحقق الشرط السابق.';
  }

  if (/^for\s*\(/.test(trimmed)) {
    return 'بدء حلقة تكرار تمر على أكثر من عنصر أو قيمة ضمن هذا المثال.';
  }

  if (/^while\s*\(/.test(trimmed)) {
    return 'بدء حلقة تستمر ما دام الشرط المنطقي صحيحاً.';
  }

  return '';
}

function extractDeclaredVariables(example) {
  const variables = [];
  const seen = new Set();

  String(example || '').split('\n').forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(.+);$/);
    if (!match) {
      return;
    }

    const type = match[1].trim();
    const name = match[2].trim();
    const value = match[3].trim();
    const key = `${type}:${name}`;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    variables.push({type, name, value});
  });

  return variables;
}

function explainVariableInitialization(variable) {
  return describeValueMeaning(variable.value, variable.type);
}

function explainVariableRole(variable, item) {
  if (variable.name === 'result') {
    return 'متغير إخراج محلي من النوع VkResult يخزن حالة نجاح أو فشل آخر استدعاء حتى تتم مقارنته مع VK_SUCCESS أو مع رموز الخطأ الأخرى.';
  }

  const parameter = (item.parameters || []).find((param) => {
    return param.name === variable.name || param.name.replace(/^p/, '').toLowerCase() === variable.name.toLowerCase();
  });

  if (parameter) {
    return parameter.description || `يمثل القيمة المحلية التي ستغذي البارامتر ${parameter.name} عند استدعاء الدالة.`;
  }

  const typeItem = /^Vk/.test(variable.type || '') ? findTypeItemByName(normalizeLookupName(variable.type)) : null;
  if (typeItem && findItemInCategories(vulkanData.structures, normalizeLookupName(variable.type))) {
    const role = inferStructureRole(typeItem);
    const lead = trimLeadingTypeName(
      getStructureLeadDescription(typeItem) || role.meaning || '',
      normalizeLookupName(variable.type)
    );
    if (lead) {
      return `يمثل هذا المتغير البنية ${renderAnalysisReference(variable.type, item)} التي ${lead}، أي أنه الحاوية التي سيضع فيها التطبيق القيم التي ستقرأها الدالة لتفهم الطلب أو الإعداد الفعلي.`;
    }
  }

  const macroItem = /^VK_/.test(String(variable.value || '').trim()) ? findMacroItemByName(String(variable.value || '').trim()) : null;
  if (macroItem) {
    return `هذا المتغير يخزن ناتج ${renderAnalysisReference(macroItem.name, item)} حتى يعاد استخدامه لاحقاً كقيمة رسمية جاهزة بدلاً من إعادة كتابة الماكرو أو الاعتماد على قيمة حرفية.`;
  }

  if (/Count$/.test(variable.name) || /(count|size|index|timeout)/i.test(variable.name)) {
    return 'يمثل هذا المتغير قيمة تشغيلية تتحكم في عدد العناصر أو المهلة أو الفهرس أو الحجم الذي ستعتمد عليه الخطوة التالية من المثال.';
  }

  if (/Info|CreateInfo|State|Range|Properties|Features/.test(variable.type)) {
    return 'بنية Vulkan وسيطة تجمع الإعدادات العملية التي ستقرأها الدالة لاحقاً لتحديد ماذا تنشئ أو ماذا تستعلم أو كيف تنفذ العملية.';
  }

  if (/^Vk/.test(variable.type)) {
    return 'مقبض أو نوع Vulkan محلي يحتفظ بمرجع إلى المورد أو النتيجة التي ستبني عليها بقية خطوات المثال.';
  }

  return 'متغير محلي مساعد يحمل قيمة إدخال أو نتيجة مرحلية داخل المثال.';
}

function buildAnalysisVariableTooltip(variable, currentItem = null) {
  return buildAnalysisVariableEntityTooltip(variable, currentItem);
}

function renderVariableReference(name, tooltip = '') {
  const resolvedTooltip = String(tooltip || `متغير محلي أو حقل مساعد داخل المثال الحالي. الضغط عليه ينقلك إلى موضع تعريف ${name} أو شرحه داخل نفس الصفحة.`).trim();
  const tooltipAttr = resolvedTooltip
    ? ` data-tooltip="${escapeAttribute(resolvedTooltip)}" tabindex="0" aria-label="${escapeAttribute(`${name}: ${resolvedTooltip.replace(/\n/g, ' - ')}`)}"`
    : '';
  return `<a href="#${makeAnchorId('analysis-var', name)}" class="doc-link entity-link-with-icon"${tooltipAttr} onclick="scrollToAnchor('${makeAnchorId('analysis-var', name)}'); return false;">${safeRenderEntityLabel(name, 'variable')}</a>`;
}

function flashAnchorTarget(element) {
  if (!element) {
    return;
  }

  document.querySelectorAll('.anchor-target-active').forEach((activeElement) => {
    if (activeElement !== element) {
      activeElement.classList.remove('anchor-target-active');
    }
  });

  clearInterval(element.__anchorFlashInterval);
  clearTimeout(element.__anchorFlashTimer);
  let pulseCount = 0;
  const totalPulses = 3;
  const restartPulse = () => {
    element.classList.remove('anchor-target-flash');
    void element.offsetWidth;
    element.classList.add('anchor-target-flash');
    pulseCount += 1;
  };

  restartPulse();

  element.__anchorFlashInterval = setInterval(() => {
    if (pulseCount >= totalPulses) {
      clearInterval(element.__anchorFlashInterval);
      return;
    }
    restartPulse();
  }, 420);

  element.__anchorFlashTimer = setTimeout(() => {
    clearInterval(element.__anchorFlashInterval);
    element.classList.remove('anchor-target-flash');
    element.classList.add('anchor-target-active');
  }, 1850);
}

function scrollToAnchor(anchorId) {
  const element = document.getElementById(anchorId);
  if (element) {
    element.scrollIntoView({behavior: 'auto', block: 'start'});
    flashAnchorTarget(element);
  }
}

function scrollMainContentToTop() {
  requestAnimationFrame(() => {
    const content = document.getElementById('mainContent');
    const anchor = document.getElementById('page-meaning-anchor');

    if (content) {
      content.scrollTo({top: 0, left: 0, behavior: 'auto'});
    }

    window.scrollTo({top: 0, left: 0, behavior: 'auto'});

    if (anchor) {
      anchor.scrollIntoView({behavior: 'auto', block: 'start'});
    }
  });
}

function focusPageMeaningAnchor(options = {}) {
  const {
    smooth = false,
    flash = true,
    delay = 0
  } = options;

  setTimeout(() => {
    const anchor = document.getElementById('page-meaning-anchor');
    if (!anchor) {
      return;
    }

    anchor.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    });

    if (flash) {
      flashAnchorTarget(anchor);
    }
  }, delay);
}

function renderReferenceSummaryList(entries) {
  if (!entries.length) {
    return '<p>لا توجد عناصر مرجعية إضافية داخل هذا المثال.</p>';
  }

  return `
    <ul class="reference-list reference-summary-list">
      ${entries.map((entry) => `<li class="reference-list-item">${entry}</li>`).join('')}
    </ul>
  `;
}

function classifyReferenceSummaryKind(name, options = {}) {
  const alias = resolveProjectReferenceAlias(name, options);
  if (!alias) {
    return {order: 99, kind: 'unknown', label: 'غير مصنف', targetName: name};
  }

  const targetName = alias.targetName || name;
  if (alias.relationKind === 'enumValue') {
    return {order: 50, kind: 'enum-value', label: 'الثوابت والقيم', targetName};
  }

  const navigation = resolveReferenceNavigation(targetName);
  if (!navigation) {
    return {order: 99, kind: 'unknown', label: 'غير مصنف', targetName};
  }

  if (navigation.type === 'command') {
    return {order: 10, kind: 'command', label: 'الدوال', targetName};
  }

  if (navigation.type === 'type') {
    if (findVariableTypeItemByName(targetName)) {
      return {order: 20, kind: 'variable-type', label: 'الأنواع', targetName};
    }
    if (findItemInCategories(vulkanData.structures, targetName)) {
      return {order: 30, kind: 'structure', label: 'البنى', targetName};
    }
    if (findItemInCategories(vulkanData.enums, targetName)) {
      return {order: 40, kind: 'enum', label: 'التعدادات', targetName};
    }
    return {order: 25, kind: 'type', label: 'الأنواع', targetName};
  }

  if (navigation.type === 'constant') {
    return {order: 50, kind: 'constant', label: 'الثوابت والقيم', targetName};
  }

  if (navigation.type === 'macro') {
    return {order: 60, kind: 'macro', label: 'الماكرو', targetName};
  }

  return {order: 90, kind: navigation.type, label: 'عناصر أخرى', targetName};
}

function buildOrderedReferenceSummaryLinks(referenceNames, options = {}) {
  return [...new Set((referenceNames || []).map((name) => String(name || '').trim()).filter(Boolean))]
    .map((name) => {
      const classification = classifyReferenceSummaryKind(name, options);
      return {
        name,
        ...classification,
        html: renderProjectReferenceLink(name, options)
      };
    })
    .filter((entry) => entry.html)
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }
      return left.name.localeCompare(right.name, 'en', {numeric: true, sensitivity: 'base'});
    })
    .map((entry) => entry.html);
}

const buildReferenceTooltip = (...args) => projectReferenceRuntime?.buildReferenceTooltip(...args) || '';
const renderProjectReferenceLink = (...args) => projectReferenceRuntime?.renderProjectReferenceLink(...args) || '';

function resolvePracticalText(text, fallback = 'لم يُوثق هذا الجزء محلياً بعد، لكن السياق الحالي يوضح دوره العملي العام.') {
  const normalized = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized || fallback;
}

function renderPracticalText(text, fallback, options = {}) {
  const raw = String(text || '').trim();
  if (/<\/?(?:a|code|span|strong)\b/i.test(raw)) {
    return raw;
  }
  return linkUsageBridgeText(resolvePracticalText(text, fallback), options);
}

const renderAnalysisReference = (...args) => projectReferenceRuntime?.renderAnalysisReference(...args) || '';
const renderUsageBridgeToken = (...args) => projectReferenceRuntime?.renderUsageBridgeToken(...args) || '';

function getUsageBridgeFieldOwners(fieldName) {
  const normalizedFieldName = String(fieldName || '').trim();
  if (!normalizedFieldName) {
    return [];
  }

  if (!usageBridgeFieldOwnersCache) {
    usageBridgeFieldOwnersCache = new Map();
    Object.values(vulkanData.structures || {}).forEach((category) => {
      (category.items || []).forEach((item) => {
        getStructureFieldRows(item).forEach((field) => {
          const key = String(field.name || '').trim();
          if (!key) {
            return;
          }
          if (!usageBridgeFieldOwnersCache.has(key)) {
            usageBridgeFieldOwnersCache.set(key, []);
          }
          const owners = usageBridgeFieldOwnersCache.get(key);
          if (!owners.includes(item.name)) {
            owners.push(item.name);
          }
        });
      });
    });
  }

  return usageBridgeFieldOwnersCache.get(normalizedFieldName) || [];
}

function resolveUsageBridgeCurrentOwnerType(currentItem = null) {
  const typeName = normalizeLookupName(currentItem?.name || '');
  if (!typeName) {
    return '';
  }

  if (findItemInCategories(vulkanData.structures, typeName) || findVariableTypeItemByName(typeName)) {
    return typeName;
  }

  return '';
}

function getUsageBridgeExampleVariableIndex(currentItem = null) {
  const currentName = String(currentItem?.name || '').trim();
  if (!currentName) {
    return {};
  }

  const rawExample = getDisplayedExample(currentItem) || currentItem?.example || currentItem?.code || '';
  const cacheKey = `${currentName}::${String(currentItem?.id || '').trim()}::${String(rawExample).length}`;
  if (usageBridgeExampleVariableIndexCache.has(cacheKey)) {
    return usageBridgeExampleVariableIndexCache.get(cacheKey);
  }

  const variableIndex = buildVariableIndex(extractDeclaredVariables(rawExample));
  usageBridgeExampleVariableIndexCache.set(cacheKey, variableIndex);
  return variableIndex;
}

function resolveUsageBridgeFieldDescriptor(token, options = {}) {
  const text = String(token || '').trim();
  if (!text) {
    return null;
  }

  const currentOwnerType = normalizeLookupName(options.ownerType || resolveUsageBridgeCurrentOwnerType(options.currentItem));
  const buildDescriptor = (fieldName, ownerType = '', label = text) => {
    const info = ownerType ? findStructureFieldInfo(ownerType, fieldName) : null;
    if (!info && !ownerType && !knownFieldMetadata[fieldName] && !/^(sType|pNext)$/.test(fieldName) && !/Count$/.test(fieldName) && !/^p[A-Z]/.test(fieldName)) {
      return null;
    }

    return {
      label,
      fieldName,
      ownerType,
      fieldType: info?.type || '',
      assignedValue: ''
    };
  };

  if (text.includes('.')) {
    const segments = text.split('.').map((segment) => segment.trim()).filter(Boolean);
    if (segments.length < 2) {
      return null;
    }

    const variableIndex = options.variableIndex || getUsageBridgeExampleVariableIndex(options.currentItem);
    const rootInfo = variableIndex[segments[0]] || tutorialVariableHints[segments[0]];
    let ownerType = normalizeLookupName(rootInfo?.type || '');
    if (!ownerType) {
      return null;
    }

    for (let index = 1; index < segments.length - 1; index += 1) {
      const nestedField = findStructureFieldInfo(ownerType, segments[index]);
      if (!nestedField) {
        return null;
      }
      ownerType = normalizeLookupName(nestedField.type || '');
      if (!ownerType) {
        return null;
      }
    }

    return buildDescriptor(segments[segments.length - 1], ownerType, text);
  }

  if (currentOwnerType) {
    const contextualDescriptor = buildDescriptor(text, currentOwnerType, text);
    if (contextualDescriptor) {
      return contextualDescriptor;
    }
  }

  const owners = getUsageBridgeFieldOwners(text);
  if (owners.length === 1) {
    return buildDescriptor(text, owners[0], text);
  }

  if (knownFieldMetadata[text] || /^(sType|pNext)$/.test(text) || /Count$/.test(text) || /^p[A-Z]/.test(text)) {
    return buildDescriptor(text, currentOwnerType, text);
  }

  return null;
}

function renderUsageBridgeFieldToken(descriptor, options = {}) {
  if (!descriptor?.fieldName) {
    return escapeHtml(descriptor?.label || '');
  }

  const label = descriptor.label || descriptor.fieldName;
  const baseTooltip = buildFieldTooltip(descriptor.fieldName, descriptor.ownerType, descriptor.fieldType, descriptor.assignedValue || '');
  const tooltip = buildContextualReferenceTooltip(label, baseTooltip, options);
  const aria = escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`);
  const content = safeRenderEntityLabel(label, 'variable', {code: true});
  const className = options.inlineNarrative
    ? 'inline-code-reference code-token usage-bridge-link usage-bridge-inline-link entity-link-with-icon'
    : 'related-link code-token usage-bridge-link entity-link-with-icon';

  if (descriptor.ownerType) {
    const anchorId = makeAnchorId('structure-field', `${descriptor.ownerType}-${descriptor.fieldName}`);
    return `<a href="#${escapeAttribute(anchorId)}" class="${className}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="openStructureField(event, '${escapeAttribute(descriptor.ownerType)}', '${escapeAttribute(descriptor.fieldName)}'); return false;">${content}</a>`;
  }

  const staticClassName = options.inlineNarrative
    ? `${className} inline-code-reference-static`
    : `${className} related-link-static`;
  return `<span class="${staticClassName}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${content}</span>`;
}

function resolveUsageBridgeParameterDescriptor(token, options = {}) {
  const text = String(token || '').trim();
  const currentItem = options.currentItem || null;
  if (!text || !currentItem?.parameters?.length) {
    return null;
  }

  const param = currentItem.parameters.find((entry) => entry?.name === text);
  if (!param) {
    return null;
  }

  return {
    label: text,
    param,
    item: currentItem
  };
}

function renderUsageBridgeParameterToken(descriptor, options = {}) {
  if (!descriptor?.param) {
    return escapeHtml(descriptor?.label || '');
  }

  return renderFunctionParameterReferenceToken(
    descriptor.param,
    descriptor.item,
    descriptor.label || descriptor.param.name || '',
    {inlineNarrative: Boolean(options.inlineNarrative)}
  );
}

function renderUsageBridgeCandidateToken(token, options = {}) {
  const parameterDescriptor = resolveUsageBridgeParameterDescriptor(token, options);
  if (parameterDescriptor) {
    return renderUsageBridgeParameterToken(parameterDescriptor, options);
  }

  const fieldDescriptor = resolveUsageBridgeFieldDescriptor(token, options);
  if (fieldDescriptor) {
    return renderUsageBridgeFieldToken(fieldDescriptor, options);
  }
  return renderUsageBridgeToken(token, options);
}

function linkUsageBridgeText(text, options = {}) {
  const tokenRegex = /(\b[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*\b|\bnullptr\b)/g;
  let lastIndex = 0;
  let rendered = '';
  const raw = String(text || '');
  const source = /<\/?(?:a|code|span|strong|em|br)\b/i.test(raw)
    ? raw
    : normalizeVulkanArabicTechnicalProse(raw);

  source.replace(tokenRegex, (match, _group, offset) => {
    rendered += escapeHtml(source.slice(lastIndex, offset));
    rendered += renderUsageBridgeCandidateToken(match, {
      ...options,
      inlineNarrative: options.inlineNarrative !== false
    });
    lastIndex = offset + match.length;
    return match;
  });

  rendered += escapeHtml(source.slice(lastIndex));
  return rendered;
}

const PROSE_CARD_PROGRAMMING_TOKEN_REGEX = /\b[A-Za-z_][A-Za-z0-9_:]*\b/g;
const PROSE_CARD_TECHNICAL_TERMS = [
  {regex: /\bthread safety\b/gi, english: 'thread safety', arabic: 'سلامة الخيوط'},
  {regex: /\bcompile(?:[ -]?time)\b/gi, english: 'compile time', arabic: 'وقت الترجمة'},
  {regex: /\brun(?:[ -]?time)\b/gi, english: 'runtime', arabic: 'وقت التشغيل'},
  {regex: /\bpreprocessing\b/gi, english: 'preprocessing', arabic: 'المعالجة المسبقة'},
  {regex: /\bpreprocessor\b/gi, english: 'preprocessor', arabic: 'المعالج المسبق'},
  {regex: /\bconditional compilation\b/gi, english: 'conditional compilation', arabic: 'الترجمة الشرطية'},
  {regex: /\bmacro expansion\b/gi, english: 'macro expansion', arabic: 'توسعة الماكرو'},
  {regex: /\btoken pasting\b/gi, english: 'token pasting', arabic: 'لصق الرموز'},
  {regex: /\bbitmask\b/gi, english: 'bitmask', arabic: 'قناع البتات'},
  {regex: /\bcallback\b/gi, english: 'callback', arabic: 'رد النداء'},
  {regex: /\bopaque type\b/gi, english: 'opaque type', arabic: 'نوع معتم'},
  {regex: /\bhandle\b/gi, english: 'handle', arabic: 'مقبض'}
];
let proseCardReferenceObserver = null;
let proseCardReferenceLinkingScheduled = false;
let proseCardReferenceLinkingInProgress = false;

function buildProseCardReferenceTooltip(baseTooltip = '') {
  const contextLine = 'لماذا يظهر هنا: ذُكر داخل هذه الفقرة لأنه عنصر برمجي مرتبط بالمسار أو المثال الجاري شرحه.';
  const normalized = sanitizeTooltipText(baseTooltip);
  if (!normalized) {
    return contextLine;
  }
  if (normalized.includes('لماذا يظهر هنا')) {
    return normalized;
  }
  return `${normalized}\n${contextLine}`;
}

function normalizeProseCardTechnicalTerms(text) {
  let source = String(text || '');
  if (!source) {
    return source;
  }

  PROSE_CARD_TECHNICAL_TERMS.forEach(({regex, english, arabic}) => {
    source = source.replace(regex, (match, offset, fullText) => {
      const before = fullText.slice(Math.max(0, offset - (arabic.length + 4)), offset);
      const after = fullText.slice(offset + match.length, offset + match.length + 2);
      if (before.endsWith(`${arabic} (`) && after.startsWith(')')) {
        return match;
      }
      return `${arabic} (${english})`;
    });
  });

  return source;
}

function buildProseCardReferenceDescriptor(token) {
  const text = String(token || '').trim();
  if (!text || text.length < 2) {
    return null;
  }

  const cmakeItem = findCmakeSearchEntryByName(text);
  if (cmakeItem) {
    const kindMeta = getCmakeKindMeta(cmakeItem.kind);
    return {
      tooltip: buildProseCardReferenceTooltip(buildCmakeEntryTooltip(cmakeItem)),
      action: `showCmakeEntity('${escapeAttribute(cmakeItem.kind)}', '${escapeAttribute(cmakeItem.slug)}'); return false;`,
      iconType: kindMeta.icon
    };
  }

  const sdl3Item = findSdl3AnyItemByName(text);
  if (sdl3Item) {
    const meta = sdl3Item.kind === 'type'
      ? getSdl3CollectionMeta(getSdl3TypeSectionDataKey(sdl3Item))
      : getSdl3KindMeta(sdl3Item.kind);
    return {
      tooltip: buildProseCardReferenceTooltip(buildSdl3ReferenceTooltip(sdl3Item)),
      action: `${buildShowSdl3Call(sdl3Item.kind, sdl3Item.name)}; return false;`,
      iconType: meta.icon
    };
  }

  const glslItem = getGlslReferenceItem(text);
  if (glslItem) {
    return {
      tooltip: buildProseCardReferenceTooltip(buildGlslReferenceTooltip(glslItem)),
      action: `showGlslReference('${escapeAttribute(glslItem.name)}'); return false;`,
      iconType: 'glsl'
    };
  }

  const navigation = resolveReferenceNavigation(text);
  if (navigation) {
    const cppItem = navigation.type === 'cpp' ? getCppReferenceItem(text) : null;
    const iconType = navigation.type === 'cpp'
      ? (getCppReferenceIconType(text, cppItem) || 'cpp')
      : getNavigationEntityIconType(navigation, text);
    return {
      tooltip: buildProseCardReferenceTooltip(buildNavigationTooltipForName(text, navigation)),
      action: `${navigation.command}; return false;`,
      iconType
    };
  }

  return null;
}

function renderProseCardReferenceLink(token) {
  const descriptor = buildProseCardReferenceDescriptor(token);
  if (!descriptor) {
    return '';
  }

  const tooltip = descriptor.tooltip || String(token || '');
  const iconType = descriptor.iconType || '';
  const content = iconType
    ? safeRenderEntityLabel(token, iconType, {code: true})
    : `<code dir="ltr">${escapeHtml(token)}</code>`;
  const className = iconType
    ? 'related-link code-token prose-card-reference-link entity-link-with-icon'
    : 'related-link code-token prose-card-reference-link';
  return `<a href="#" class="${className}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${descriptor.action}">${content}</a>`;
}

function normalizeCanonicalReferenceNarrativeText(text = '', options = {}) {
  const libraryId = String(options.libraryId || '').trim();
  let source = String(text || '');
  if (!source || libraryId !== 'cmake') {
    return source;
  }

  const replacements = [
    [/\binclude paths\b/gi, 'مسارات الترويسات'],
    [/\binclude directories\b/gi, 'مجلدات الترويسات'],
    [/\blibs\b/gi, 'المكتبات'],
    [/\busage requirements\b/gi, 'متطلبات الاستعمال'],
    [/\bsource directory\b/gi, 'مجلد المصدر'],
    [/\bbinary directory\b/gi, 'مجلد البناء'],
    [/\bdirectory scope\b/gi, 'نطاق الدليل'],
    [/\bsource tree\b/gi, 'شجرة المصدر'],
    [/\bbuild tree\b/gi, 'شجرة البناء'],
    [/\bbuild graph\b/gi, 'رسم البناء'],
    [/\btop-level source directory\b/gi, 'مجلد المصدر الأعلى للمشروع'],
    [/\bsource files\b/gi, 'ملفات المصدر'],
    [/\bsource file\b/gi, 'ملف مصدر'],
    [/\bheader files\b/gi, 'ملفات الترويسة'],
    [/\bheaders\b/gi, 'الترويسات'],
    [/\bheader\b/gi, 'ترويسة'],
    [/\binterface libraries\b/gi, 'مكتبات واجهية'],
    [/\binterface library\b/gi, 'مكتبة واجهية'],
    [/\bobject libraries\b/gi, 'مكتبات كائنات'],
    [/\bobject library\b/gi, 'مكتبة كائنات'],
    [/\bnormal variables\b/gi, 'متغيرات عادية'],
    [/\bnormal variable\b/gi, 'متغير عادي'],
    [/\bcache variables\b/gi, 'متغيرات التخزين المؤقت'],
    [/\bcache variable\b/gi, 'متغير تخزين مؤقت'],
    [/\bbuilt-in\b/gi, 'مدمج'],
    [/\bimported targets\b/gi, 'أهداف مستوردة'],
    [/\bimplementation-only\b/gi, 'خاص بالتنفيذ فقط'],
    [/\btransitively\b/gi, 'بصورة مترابطة عابرة للاعتماديات'],
    [/\btransitive\b/gi, 'عابر للاعتماديات'],
    [/\blinker\b/gi, 'أداة الربط'],
    [/\bcompiler\b/gi, 'المصرّف'],
    [/\bcompile options\b/gi, 'خيارات الترجمة'],
    [/\blink options\b/gi, 'خيارات الربط'],
    [/\bcode generator\b/gi, 'مولّد شيفرة'],
    [/\bside effects\b/gi, 'آثار جانبية'],
    [/\bexport sets\b/gi, 'مجموعات التصدير'],
    [/\bhard-coded paths?\b/gi, 'مسارات مكتوبة يدويًا'],
    [/\bmodule mode\b/gi, 'وضع الوحدة'],
    [/\bconfig mode\b/gi, 'وضع ملف الإعداد'],
    [/\bmulti-config\b/gi, 'بناء متعدد الإعدادات'],
    [/\bsingle-config\b/gi, 'بناء أحادي الإعداد'],
    [/\binstall tree\b/gi, 'شجرة التثبيت'],
    [/\bpreset\b/gi, 'ضبط مسبق'],
    [/\bpresets\b/gi, 'ضبطات مسبقة'],
    [/\bctest\b/gi, 'أداة CTest'],
    [/\bci\b/gi, 'بيئة التكامل المستمر'],
    [/\bdependencies\b/gi, 'الاعتماديات'],
    [/\bdependency\b/gi, 'اعتمادية'],
    [/\bpackages\b/gi, 'الحزم'],
    [/\bpackage\b/gi, 'حزمة'],
    [/\bdefinitions\b/gi, 'تعريفات الترجمة'],
    [/\bdefinition\b/gi, 'تعريف ترجمة'],
    [/\btargets\b/gi, 'أهداف'],
    [/\btarget\b/gi, 'هدف'],
    [/\bdownstream\b/gi, 'في الجهة المستهلكة اللاحقة'],
    [/\bconfigure\b/gi, 'التهيئة'],
    [/\bgenerate\b/gi, 'التوليد'],
    [/\bbuild\b/gi, 'البناء'],
    [/\bscope\b/gi, 'نطاق']
  ];

  replacements.forEach(([pattern, replacement]) => {
    source = source.replace(pattern, replacement);
  });

  return source;
}

function tokenizeCmakeCodeLikeSource(rawCode = '') {
  const source = String(rawCode || '');
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (/\s/.test(char)) {
      let end = index + 1;
      while (end < source.length && /\s/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (char === '#') {
      let end = index + 1;
      while (end < source.length && source[end] !== '\n') {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (char === '"' || char === '\'') {
      const quote = char;
      let end = index + 1;
      while (end < source.length) {
        if (source[end] === '\\') {
          end += 2;
          continue;
        }
        if (source[end] === quote) {
          end += 1;
          break;
        }
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (source.startsWith('$ENV{', index)) {
      let end = index + 5;
      while (end < source.length && source[end] !== '}') {
        end += 1;
      }
      end = Math.min(source.length, end + 1);
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (source.startsWith('${', index)) {
      let end = index + 2;
      while (end < source.length && source[end] !== '}') {
        end += 1;
      }
      end = Math.min(source.length, end + 1);
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (source.startsWith('$<', index)) {
      let end = index + 2;
      let depth = 1;
      while (end < source.length && depth > 0) {
        if (source.startsWith('$<', end)) {
          depth += 1;
          end += 2;
          continue;
        }
        if (source[end] === '>') {
          depth -= 1;
        }
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (char === '[') {
      const closingIndex = source.indexOf(']', index + 1);
      if (closingIndex > index + 1) {
        const inner = source.slice(index + 1, closingIndex);
        if (!inner.includes('[')) {
          tokens.push(source.slice(index, closingIndex + 1));
          index = closingIndex + 1;
          continue;
        }
      }
    }

    if (char === '<') {
      let end = index + 1;
      while (end < source.length && source[end] !== '>') {
        end += 1;
      }
      end = Math.min(source.length, end + 1);
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (source.startsWith('...', index)) {
      tokens.push('...');
      index += 3;
      continue;
    }

    const artifactMatch = source.slice(index).match(/^(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+\.(?:cmake|json)\b|^[A-Za-z0-9_.+-]+Config(?:Version)?\.cmake\b|^CMake(?:User)?Presets\.json\b|^[A-Za-z0-9_.+-]+\.(?:cmake|json)\b/);
    if (artifactMatch?.[0]) {
      tokens.push(artifactMatch[0]);
      index += artifactMatch[0].length;
      continue;
    }

    if (source.startsWith('--', index) && /[A-Za-z0-9]/.test(source[index + 2] || '')) {
      let end = index + 2;
      while (end < source.length && /[A-Za-z0-9_-]/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (source.startsWith('-D', index) && /[A-Za-z_]/.test(source[index + 2] || '')) {
      let end = index + 2;
      while (end < source.length && /[A-Za-z0-9_]/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (char === '-' && /[A-Za-z]/.test(source[index + 1] || '')) {
      let end = index + 1;
      while (end < source.length && /[A-Za-z0-9_:+./=-]/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (/\d/.test(char)) {
      let end = index + 1;
      while (end < source.length && /[\d.]/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if (/[A-Za-z_@]/.test(char)) {
      let end = index + 1;
      while (end < source.length && /[A-Za-z0-9_-]/.test(source[end])) {
        end += 1;
      }
      tokens.push(source.slice(index, end));
      index = end;
      continue;
    }

    if ((char === '&' && source[index + 1] === '&') || (char === '|' && source[index + 1] === '|') || (char === '=' && source[index + 1] === '=') || (char === '!' && source[index + 1] === '=') || (char === '<' && source[index + 1] === '=') || (char === '>' && source[index + 1] === '=')) {
      tokens.push(source.slice(index, index + 2));
      index += 2;
      continue;
    }

    tokens.push(char);
    index += 1;
  }

  return tokens;
}

function renderCmakeEmbeddedTokenSequence(text = '', options = {}) {
  const tokens = tokenizeCmakeCodeLikeSource(text);
  let rendered = '';

  tokens.forEach((token) => {
    if (/^\s+$/.test(token)) {
      rendered += token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }

    const semanticToken = renderCmakeSemanticToken(token, options);
    if (semanticToken) {
      rendered += semanticToken;
      return;
    }

    if (options.wrapPlainAsString) {
      rendered += `<span class="string code-token">${escapeHtml(token)}</span>`;
      return;
    }

    rendered += escapeHtml(token);
  });

  return rendered;
}

function renderCmakeQuotedStringToken(token = '', options = {}) {
  const raw = String(token || '');
  if (raw.length < 2) {
    return `<span class="string code-token">${escapeHtml(raw)}</span>`;
  }

  const quote = raw[0];
  const inner = raw.slice(1, -1);
  return `<span class="string code-token">${escapeHtml(quote)}</span>${renderCmakeEmbeddedTokenSequence(inner, {
    ...options,
    contextLabel: options.contextLabel || 'نص داخل سلسلة CMake',
    wrapPlainAsString: true
  })}<span class="string code-token">${escapeHtml(quote)}</span>`;
}

function renderCmakeNarrativeSegment(text = '', options = {}) {
  const tokens = tokenizeCmakeCodeLikeSource(normalizeCanonicalReferenceNarrativeText(text, options));
  let rendered = '';

  tokens.forEach((token) => {
    if (/^\s+$/.test(token)) {
      rendered += token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }

    if (/^#[^\n]*$/.test(token)) {
      rendered += escapeHtml(token);
      return;
    }

    if (/^"(?:\\.|[^"\\])*"$/.test(token) || /^'(?:\\.|[^'\\])*'$/.test(token)) {
      rendered += renderCmakeQuotedStringToken(token, options);
      return;
    }

    const semanticToken = renderCmakeSemanticToken(token, {...options, contextLabel: 'النص الحالي'});
    if (semanticToken) {
      rendered += semanticToken;
      return;
    }

    rendered += escapeHtml(token);
  });

  return rendered;
}

function getCanonicalReferencePhraseEntries(options = {}) {
  const libraryId = String(options.libraryId || '').trim();
  if (libraryId !== 'cmake' || !cmakeSearchEntries.length) {
    return [];
  }

  const entries = cmakeSearchEntries
    .flatMap((entry) => [entry.name, ...(Array.isArray(entry.aliases) ? entry.aliases : [])])
    .map((name) => String(name || '').trim())
    .filter((name) => /[^A-Za-z0-9_]/.test(name))
    .map((name) => ({name}));
  const aliasNames = [
    'cache variables',
    'Cache Variables',
    'generator expressions',
    'Generator expressions',
    'directory scope',
    'Directory scope',
    'Config mode',
    'module mode',
    'imported targets'
  ].map((name) => ({name}));

  return [...entries, ...aliasNames]
    .filter((entry, index, list) => entry.name && list.findIndex((item) => item.name === entry.name) === index)
    .sort((left, right) => String(right.name || '').length - String(left.name || '').length);
}

function renderCanonicalReferencePlainSegment(text = '', options = {}) {
  if (String(options.libraryId || '').trim() === 'cmake') {
    return renderCmakeNarrativeSegment(text, options);
  }

  const source = normalizeCanonicalReferenceNarrativeText(text, options);
  let lastIndex = 0;
  let rendered = '';
  let found = false;

  source.replace(PROSE_CARD_PROGRAMMING_TOKEN_REGEX, (match, offset) => {
    const html = renderProseCardReferenceLink(match);
    if (!html) {
      return match;
    }

    found = true;
    rendered += escapeHtml(source.slice(lastIndex, offset));
    rendered += html;
    lastIndex = offset + match.length;
    return match;
  });

  rendered += escapeHtml(source.slice(lastIndex));
  return found ? rendered : escapeHtml(source);
}

function renderCanonicalReferenceRichText(text = '', options = {}) {
  const originalSource = String(text || '').trim();
  if (!originalSource) {
    return '';
  }

  const source = normalizeProseCardTechnicalTerms(originalSource);
  const phraseEntries = getCanonicalReferencePhraseEntries(options);
  if (!phraseEntries.length) {
    return renderCanonicalReferencePlainSegment(source, options);
  }

  let cursor = 0;
  let rendered = '';

  while (cursor < source.length) {
    let nearestMatch = null;

    phraseEntries.forEach((entry) => {
      const name = String(entry.name || '').trim();
      if (!name) {
        return;
      }

      const regex = new RegExp(escapeRegexText(name), 'i');
      const slice = source.slice(cursor);
      const match = regex.exec(slice);
      if (!match) {
        return;
      }

      const absoluteIndex = cursor + match.index;
      if (!nearestMatch || absoluteIndex < nearestMatch.index || (absoluteIndex === nearestMatch.index && name.length > nearestMatch.name.length)) {
        nearestMatch = {
          index: absoluteIndex,
          text: match[0],
          name
        };
      }
    });

    if (!nearestMatch) {
      rendered += renderCanonicalReferencePlainSegment(source.slice(cursor), options);
      break;
    }

    rendered += renderCanonicalReferencePlainSegment(source.slice(cursor, nearestMatch.index), options);
    rendered += renderProseCardReferenceLink(nearestMatch.text) || escapeHtml(nearestMatch.text);
    cursor = nearestMatch.index + nearestMatch.text.length;
  }

  return rendered;
}

function shouldSkipProseCardTextNode(node) {
  if (!node || node.nodeType !== 3 || !String(node.textContent || '').trim()) {
    return true;
  }

  let element = node.parentElement;
  while (element) {
    const tagName = String(element.tagName || '').toUpperCase();
    if (['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'].includes(tagName)) {
      return true;
    }
    if (
      element.classList?.contains('code-container')
      || element.classList?.contains('code-block')
      || element.classList?.contains('analysis-line-code')
      || element.classList?.contains('entity-inline-label')
      || element.classList?.contains('glsl-kind-badge')
    ) {
      return true;
    }
    element = element.parentElement;
  }

  return false;
}

function collectProseCardTextNodes(root, bucket = []) {
  if (!root || !root.childNodes) {
    return bucket;
  }

  root.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      if (!shouldSkipProseCardTextNode(node)) {
        bucket.push(node);
      }
      return;
    }

    if (node.nodeType !== 1) {
      return;
    }

    const tagName = String(node.tagName || '').toUpperCase();
    if (['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'].includes(tagName)) {
      return;
    }

    if (
      node.classList?.contains('code-container')
      || node.classList?.contains('code-block')
      || node.classList?.contains('analysis-line-code')
      || node.classList?.contains('entity-inline-label')
      || node.classList?.contains('glsl-kind-badge')
    ) {
      return;
    }

    collectProseCardTextNodes(node, bucket);
  });

  return bucket;
}

function linkifyProseCardTextNode(node) {
  if (shouldSkipProseCardTextNode(node)) {
    return false;
  }

  const originalSource = String(node.textContent || '');
  const source = normalizeProseCardTechnicalTerms(originalSource);
  let lastIndex = 0;
  let rendered = '';
  let found = false;

  source.replace(PROSE_CARD_PROGRAMMING_TOKEN_REGEX, (match, offset) => {
    const html = renderProseCardReferenceLink(match);
    if (!html) {
      return match;
    }

    found = true;
    rendered += escapeHtml(source.slice(lastIndex, offset));
    rendered += html;
    lastIndex = offset + match.length;
    return match;
  });

  if (!found) {
    if (source !== originalSource) {
      node.textContent = source;
      return true;
    }
    return false;
  }

  rendered += escapeHtml(source.slice(lastIndex));

  const wrapper = document.createElement('span');
  wrapper.innerHTML = rendered;
  const fragment = document.createDocumentFragment();
  while (wrapper.firstChild) {
    fragment.appendChild(wrapper.firstChild);
  }
  node.parentNode?.replaceChild(fragment, node);
  return true;
}

function linkifyProgrammingReferencesInProseCards(root = document.getElementById('mainContent')) {
  if (!root || proseCardReferenceLinkingInProgress) {
    return;
  }

  proseCardReferenceLinkingInProgress = true;
  try {
    const containers = new Set([
      ...root.querySelectorAll('.content-card.prose-card'),
      ...root.querySelectorAll('.reference-summary-card'),
      ...root.querySelectorAll('.reference-list li'),
      ...root.querySelectorAll('.reference-table td'),
      ...root.querySelectorAll('.info-section > p')
    ]);

    containers.forEach((card) => {
      collectProseCardTextNodes(card).forEach((node) => {
        linkifyProseCardTextNode(node);
      });
    });
  } finally {
    proseCardReferenceLinkingInProgress = false;
  }
}

function scheduleProseCardReferenceLinking(root = document.getElementById('mainContent')) {
  if (!root || proseCardReferenceLinkingScheduled) {
    return;
  }

  proseCardReferenceLinkingScheduled = true;
  requestAnimationFrame(() => {
    proseCardReferenceLinkingScheduled = false;
    linkifyProgrammingReferencesInProseCards(root);
  });
}

function initProseCardReferenceLinking() {
  const root = document.getElementById('mainContent');
  if (!root || root.dataset.proseReferenceLinkingBound === 'true') {
    return;
  }

  root.dataset.proseReferenceLinkingBound = 'true';
  scheduleProseCardReferenceLinking(root);

  proseCardReferenceObserver = new MutationObserver(() => {
    if (proseCardReferenceLinkingInProgress) {
      return;
    }
    scheduleProseCardReferenceLinking(root);
  });

  proseCardReferenceObserver.observe(root, {
    childList: true,
    subtree: true
  });
}

function renderUsageBridgeSection(usageItems) {
  const normalized = usageItems
    .map((text) => cleanFunctionUsageSummary(text))
    .filter((text) => !isOperationalFunctionParagraph(text))
    .filter(Boolean);

  if (!normalized.length) {
    return '';
  }

  return `
    <div class="usage-bridge-list">
      ${normalized.map((text) => {
        const tokens = [...new Set(text.match(/\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Za-z0-9_]+)\b/g) || [])]
          .filter((token) => resolveReferenceNavigation(token));
        return `
          <div class="usage-bridge-line">
            ${tokens.length ? `<div class="usage-bridge-targets">${tokens.map((token) => renderUsageBridgeToken(token)).join('')}</div>` : ''}
            <div class="usage-bridge-text">${linkUsageBridgeText(text)}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderLinkedNotesSection(notes, title = '🧠 ملاحظات مهمة', options = {}) {
  const normalizedNotes = dedupeNotes(notes);

  if (!normalizedNotes.length) {
    return '';
  }

  return `
    <section class="best-practices-section linked-notes-section">
      <h2>${title}</h2>
      <ul class="linked-notes-list">
        ${normalizedNotes.map((note) => {
          return `
            <li class="linked-notes-item">
              <div class="content-card prose-card">
                <p>${linkUsageBridgeText(note, {...options, tooltipContext: 'note'})}</p>
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    </section>
  `;
}

function renderEnumValueTagsSection(item) {
  const values = getEnumValueRows(item);
  if (!values.length) {
    return '';
  }

  return `
    <section class="see-also-section">
      <h2 data-tooltip="${escapeAttribute(`يسمح هذا القسم بالقفز مباشرة إلى قيم ${item.name} داخل الصفحة نفسها مع إبقاء الشرح قريباً من كل قيمة.`)}" tabindex="0" aria-label="${escapeAttribute(`وصول سريع إلى قيم التعداد وشرحها: ${item.name}`)}">🏷️ وصول سريع إلى قيم التعداد وشرحها</h2>
      <div class="see-also-links">
        ${values.map((entry) => renderProjectReferenceChip(entry.name, {currentItem: item, preferredEnumName: item.name})).join('')}
      </div>
    </section>
  `;
}

function getFunctionUsageSummary(functionItem) {
  const usage = getFunctionSemanticUsageItems(functionItem)
    .filter((text) => !isOperationalFunctionParagraph(text))
    .find(Boolean);

  return usage || '';
}

function buildCompactFunctionRowsFromLine(line, fallbackItem) {
  const names = [...new Set((String(line || '').match(/\bvk[A-Za-z0-9_]+\b/g) || []))];
  return names.map((name) => {
    const functionItem = findCommandItemByName(name) || (fallbackItem?.name === name ? fallbackItem : null);
    const meaning = inferFunctionIntentSummary(functionItem || {name, description: ''});
    const usage = getFunctionUsageSummary(functionItem);
    return {
      name,
      meaning,
      benefit: usage || `تفيد هذه الدالة عندما تحتاج إلى ${meaning.replace(/[.،\s]+$/g, '')}.`,
      effect: functionItem?.returnType
        ? `تأثيرها هنا أنها تنفذ هذه العملية ثم تعيد ${functionItem.returnType}، لذلك يجب فحص النتيجة قبل متابعة التنفيذ.`
        : 'تأثيرها هنا أنها تغيّر سلوك التنفيذ مباشرة وفق البارامترات الممررة لها.'
    };
  });
}

function buildElementRowsForLine(line, item, variableIndex) {
  const clean = stripInlineComment(line).trim();
  if (!clean || clean.startsWith('//') || clean === '{' || clean === '}' || clean === '};') {
    return [];
  }

  const rows = [];
  const seen = new Set();
  const pushRow = (key, html) => {
    if (!seen.has(key)) {
      seen.add(key);
      rows.push(html);
    }
  };

  const declarationMatch = clean.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(.+);$/);
  if (declarationMatch) {
    const type = declarationMatch[1].trim();
    const name = declarationMatch[2].trim();
    const value = declarationMatch[3].trim();
    const typeName = normalizeLookupName(type);
    const typeItem = findTypeItemByName(typeName);
    const relatedFunctions = getRelatedFunctionNames(typeItem);
    const enumTypeMeta = findEnumItemByName(typeName) ? getEnumMetadata(typeName) : null;

    pushRow(`type:${typeName}`, `
      <li>
        ${renderExternalReference(typeName)}:
        ما هو؟ نوع البيانات المستخدم في تعريف المتغير.
        ما معناه؟ ${enumTypeMeta ? enumTypeMeta.meaning : (typeItem?.description || `نوع ${typeName} من Vulkan أو من C++ يحدد شكل القيمة أو المورد.`)}
        لماذا يُستخدم هنا؟ لأنه يحدد كيف ستفسر الدالة أو الكود هذه القيمة.
        ما علاقته بالسطر الحالي؟ السطر يعرّف ${renderVariableReference(name)} على هذا النوع.
        ما القيم الممكنة له؟ ${enumTypeMeta ? `بما أنه تعداد، فالقيم المتوقعة له هي عناصر مسماة من ${renderExternalReference(typeName)} مثل ${Object.keys(enumTypeMeta.values).slice(0, 3).map((entry) => renderExternalReference(entry)).join('، ') || 'القيم الرسمية الموثقة في المواصفة'}.` : `تعتمد على تعريف ${renderExternalReference(typeName)} في المواصفة أو المرجع الرسمي.`}
        ما الدوال التي تستخدمه أو تعيده؟ ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : 'راجع الدوال المرتبطة بهذا النوع في صفحة المرجع الخاصة به.'}
        ماذا يحدث إذا كان خاطئاً؟ سيصبح تفسير الذاكرة أو التوافق مع الدوال غير صحيح.
      </li>
    `);

    pushRow(`var:${name}`, `
      <li>
        ${renderVariableReference(name)}:
        ما هو؟ متغير محلي معرّف داخل المثال.
        ما معناه؟ ${explainVariableRole({type, name, value}, item)}
        لماذا يُستخدم هنا؟ لأن هذا السطر هو نقطة تعريفه وإعطائه القيمة الأولى.
        ما علاقته بالسطر الحالي؟ السطر يحدد نوعه واسمه وقيمته الابتدائية.
        ما القيم الممكنة له؟ ${describeValueMeaning(value, type)}
        ما الدوال التي تستخدمه أو تستقبله أو تعيده؟ ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : 'تعتمد على نوعه والسياق الذي سيُمرر فيه.'}
        ماذا يحدث إذا كانت قيمته خاطئة أو غير مهيأة؟ قد تمرر الدوال قيمة غير صالحة أو تقرأ حالة غير متوقعة.
      </li>
    `);

    const enumValueDetails = renderEnumValueDetails(value, {typeName, functionName: item?.name || ''});
    if (enumValueDetails) {
      pushRow(`value:${value}`, enumValueDetails);
    } else if (value === 'nullptr' || value === 'VK_NULL_HANDLE' || value === '0' || /^VK_/.test(value) || /^vk/.test(value)) {
      const label = value === '0' ? '<code>0</code>' : renderExternalReference(value);
      pushRow(`value:${value}`, `
        <li>
          ${label}:
          ما هو؟ القيمة المسندة إلى ${renderVariableReference(name)}.
          ما معناه؟ ${describeValueMeaning(value, type)}
          لماذا يُستخدم هنا؟ لتحديد الحالة الابتدائية أو الناتج المخزن في المتغير.
          ما علاقته بالسطر الحالي؟ هو الطرف الأيمن لعملية الإسناد.
          ما القيم الممكنة له؟ تعتمد على النوع ${renderExternalReference(typeName)} وعلى سياق المثال.
          ماذا يحدث إذا كانت القيمة خاطئة؟ قد يفشل الاستدعاء اللاحق أو تنتج مقارنة أو مسار تنفيذ غير صحيح.
        </li>
      `);
    }
  }

  const handleConditionMatch = clean.match(/^if\s*\(\s*([A-Za-z_]\w*)\s*(!=|==)\s*VK_NULL_HANDLE\s*\)\s*\{?$/);
  if (handleConditionMatch) {
    const variableName = handleConditionMatch[1];
    const operator = handleConditionMatch[2];
    const variable = variableIndex[variableName];
    const typeName = normalizeLookupName(variable?.type || '');
    const typeItem = typeName ? findTypeItemByName(typeName) : null;
    const relatedFunctions = getRelatedFunctionNames(typeItem);

    pushRow(`cond-var:${variableName}`, `
      <li>
        ${renderVariableReference(variableName)}:
        ما هو؟ المتغير الذي يحمل قيمة المقبض الجاري اختبارها.
        ما معناه الرسمي؟ ${typeName ? `${renderExternalReference(typeName)} يمثل ${typeItem?.description || 'نوعاً أو مقبضاً من فولكان.'}` : 'متغير محلي يحتفظ بقيمة ستُقارن داخل الشرط.'}
        لماذا استُخدم هنا تحديداً؟ لأن الشرط يريد معرفة هل يحمل هذا المتغير مرجع كائن فعلياً أم أنه ما زال غير مرتبط بأي كائن.
        ما القيم أو الحالات الممكنة له؟ قد يكون ${renderExternalReference('VK_NULL_HANDLE')} أو قد يحمل قيمة مقبض حقيقية أعادتها إحدى دوال فولكان.
        ما الذي يدل عليه في هذا الموضع؟ ${operator === '!=' ? 'أنه يجب ألا يكون المتغير فارغاً قبل متابعة الكتلة التالية.' : 'أنه ما زال فارغاً ولم يرتبط بكائن فعلي.'}
        ما الدوال التي تستخدمه أو تعيده؟ ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : 'تعتمد على نوع المقبض نفسه.'}
        ما الذي يحدث لو كانت قيمته غير صحيحة؟ قد يمر الشرط رغم أن الكائن لم يعد صالحاً، لأن عدم مساواته لـ VK_NULL_HANDLE لا يثبت وحده صلاحية العمر الزمني للكائن.
      </li>
    `);

    pushRow('cond-null-handle', `
      <li>
        ${renderExternalReference('VK_NULL_HANDLE')}:
        ما هو؟ ثابت فولكان خاص بالمقابض.
        ما معناه الرسمي؟ يدل على أن متغير المقبض لا يشير إلى أي كائن فولكان صالح حالياً.
        لماذا استُخدم هنا تحديداً؟ لأن فولكان يعتمد عليه كقيمة معيارية لاختبار حالة "لا يوجد كائن مرتبط".
        ما القيم أو الحالات الممكنة له؟ هو حالة الغياب، بينما الحالة الأخرى هي قيمة مقبض حقيقية صادرة من دالة فولكان.
        ما الذي يدل عليه في هذا الموضع؟ هو القيمة المرجعية التي تتم المقارنة معها لمعرفة هل المتغير فارغ أم لا.
        ما الدوال التي تستخدمه أو تعيده؟ يظهر كثيراً مع تعريف المقابض قبل الإنشاء ومع دوال مثل ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : renderExternalReference('vkCreateInstance')}.
        ما الذي يحدث لو كانت قيمته غير صحيحة؟ إذا استُخدمت بدلاً من مقبض فعلي مع دالة تتطلب مورداً موجوداً فغالباً ستفشل طبقات التحقق أو الاستدعاء نفسه.
      </li>
    `);

    pushRow(`cond-op:${operator}`, `
      <li>
        <code>${escapeHtml(operator)}</code>:
        ما هو؟ عامل مقارنة منطقي في C/C++.
        ما معناه الرسمي؟ ${operator === '!=' ? 'يتحقق من أن الطرفين غير متساويين.' : 'يتحقق من أن الطرفين متساويان.'}
        لماذا استُخدم هنا تحديداً؟ لأنه يقارن قيمة الـ handle الحالية مع القيمة المرجعية VK_NULL_HANDLE.
        ما القيم أو الحالات الممكنة له؟ نتيجة الشرط النهائية تكون true أو false.
        ما الذي يدل عليه في هذا الموضع؟ ${operator === '!=' ? 'إذا كانت النتيجة true فهذا يعني فقط أن المتغير ليس فارغاً.' : 'إذا كانت النتيجة true فهذا يعني أن المتغير ما زال بلا كائن مرتبط.'}
        ما الدوال التي تستخدمه أو تعيده؟ ليس عنصراً من Vulkan بل جزء من لغة C/C++ يستخدم قبل استدعاء دوال Vulkan التي تتطلب handle صالحاً.
        ما الذي يحدث لو كانت المقارنة غير كافية؟ قد تحتاج أيضاً إلى معرفة كيف تم الحصول على الـ handle وهل ما زال الكائن حياً ولم يُدمّر.'
      </li>
    `);
  }

  const fieldMatch = clean.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*=\s*(.+);$/);
  if (fieldMatch) {
    const owner = fieldMatch[1];
    const field = fieldMatch[2];
    const value = fieldMatch[3].trim();
    const ownerType = variableIndex[owner]?.type || '';
    const fieldMeta = getFieldMetadata(field, ownerType, value);

    pushRow(`field:${owner}.${field}`, `
      <li>
        ${renderExternalReference(field, {ownerType}, field)}:
        ما هو؟ ${fieldMeta.what}
        ما معناه؟ ${fieldMeta.meaning}
        لماذا يُستخدم هنا؟ ${fieldMeta.usage}
        ما علاقته بالسطر الحالي؟ السطر يسند هذا الحقل داخل ${renderVariableReference(owner)} من النوع ${renderExternalReference(ownerType || 'VkBaseInStructure')}.
        ما القيم الممكنة له؟ ${fieldMeta.possibleValues}
        ماذا يحدث إذا كانت قيمته خاطئة أو غير مهيأة؟ ${fieldMeta.invalid}
      </li>
    `);

    const enumValueDetails = renderEnumValueDetails(value, {
      ownerType,
      fieldName: field,
      functionName: item?.name || ''
    });
    if (enumValueDetails) {
      pushRow(`field-value:${field}:${value}`, enumValueDetails);
    } else if (value === 'nullptr' || value === 'VK_NULL_HANDLE' || value === '0' || /^VK_/.test(value)) {
      pushRow(`field-value:${field}:${value}`, `
        <li>
          ${value === '0' ? '<code>0</code>' : renderExternalReference(value)}:
          ما هو؟ القيمة الممررة إلى الحقل ${renderExternalReference(field, {ownerType}, field)}.
          ما معناه؟ ${describeValueMeaning(value, ownerType)}
          لماذا يُستخدم هنا؟ لأنه يحدد السلوك الفعلي للحقل داخل ${renderVariableReference(owner)}.
          ما علاقته بالسطر الحالي؟ هو القيمة المسندة مباشرة إلى الحقل.
          ما القيم الممكنة له؟ تعتمد على تعريف الحقل في ${renderExternalReference(ownerType || 'VkBaseInStructure')}.
          ماذا يحدث إذا كانت القيمة خاطئة؟ قد تصبح البنية غير صالحة لهذا الاستدعاء.
        </li>
      `);
    }
  }

  const functionMatches = findUniqueVulkanFunctionTokens(clean);
  functionMatches.forEach((name) => {
    const functionItem = findCommandItemByName(name);
    const returnLabel = functionItem?.returnType || 'يعتمد على التوقيع المعروض';
    pushRow(`fn:${name}`, `
      <li>
        ${renderExternalReference(name)}:
        ما هو؟ دالة من Vulkan API.
        ما معناه؟ ${functionItem?.description || 'تنفذ عملية معرفة في المواصفة الرسمية.'}
        لماذا تُستخدم هنا؟ لأن هذا السطر هو موضع الاستدعاء الفعلي للعملية المطلوبة في المثال.
        ما علاقته بالسطر الحالي؟ يستدعيها السطر مباشرة مع بارامترات محددة.
        ما القيم الممكنة له؟ توقيعه العام هو ${renderVulkanHighlightedInlineCode(functionItem?.signature || name + '(...)')} ويعيد ${returnLabel}.
        ماذا يحدث إذا كان استخدامها خاطئاً؟ قد تعيد رمز خطأ، أو تنتج Validation Layers رسالة تحقق، أو يصبح المورد الناتج غير صالح.
      </li>
    `);
  });

  const typeMatches = findUniqueVulkanTypeTokens(clean);
  typeMatches.forEach((name) => {
    const typeItem = findTypeItemByName(name);
    const relatedFunctions = getRelatedFunctionNames(typeItem);
    const enumMeta = findEnumItemByName(name) ? getEnumMetadata(name) : null;
    pushRow(`type-token:${name}`, `
      <li>
        ${renderExternalReference(name)}:
        ما هو؟ نوع Vulkan يظهر في هذا السطر.
        ما معناه؟ ${enumMeta ? enumMeta.meaning : (typeItem?.description || `نوع أو بنية أو تعداد باسم ${name}.`)}
        لماذا يُستخدم هنا؟ لأنه يحدد شكل البيانات أو المورد أو القيمة المارة في السطر.
        ما علاقته بالسطر الحالي؟ يظهر كتوقيع نوع، أو نوع متغير، أو نوع إرجاع.
        ما القيم الممكنة له؟ ${enumMeta ? `هذا النوع تعداد، لذلك يجب اختيار قيم مسماة منه مثل ${Object.keys(enumMeta.values).slice(0, 3).map((entry) => renderExternalReference(entry)).join('، ') || 'القيم الرسمية الموثقة'}.` : `تعتمد على تعريف ${renderExternalReference(name)} في المرجع الرسمي.`}
        ما الدوال التي تستخدمه أو تعيده؟ ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : 'تختلف باختلاف النوع والسياق؛ راجع المراجع المرتبطة به.'}
        ماذا يحدث إذا كان غير مناسب لهذا الموضع؟ لن يتوافق السطر مع الدالة أو مع الحقول المطلوبة.
      </li>
    `);
  });

  const constantMatches = findUniqueVulkanConstantTokens(clean);
  constantMatches.forEach((name) => {
    const enumDetails = renderEnumValueDetails(name, {functionName: item?.name || ''});
    if (enumDetails) {
      pushRow(`enum-const:${name}`, enumDetails);
    }
    const constantItem = findMacroItemByName(name) || findConstantItemByName(name);
    const relatedFunctions = getRelatedFunctionNames(constantItem);
    pushRow(`const:${name}`, `
      <li>
        ${renderExternalReference(name)}:
        ما هو؟ ${findMacroItemByName(name) ? 'ماكرو' : 'ثابت أو قيمة تعداد'} من Vulkan.
        ما معناه؟ ${constantItem?.description || describeValueMeaning(name)}
        لماذا يُستخدم هنا؟ لأن السطر يحتاج قيمة صريحة معرفة في المواصفة بدل رقم أو نص حرفي.
        ما علاقته بالسطر الحالي؟ يظهر كقيمة إسناد أو مقارنة أو راية أو رمز نجاح/فشل.
        ما القيم الممكنة له؟ ${constantItem?.value ? `قيمته أو ناتجه هو ${escapeHtml(constantItem.value)}.` : 'هو قيمة معرفة في المواصفة حسب الصفحة المرجعية المرتبطة به.'}
        ما الدوال التي تستخدمه أو تعيده؟ ${relatedFunctions.length ? relatedFunctions.map((fn) => renderExternalReference(fn)).join('، ') : 'قد يظهر في شروط، أو في حقول بنى، أو في نتائج دوال Vulkan بحسب تعريفه.'}
        ماذا يحدث إذا استُبدل بقيمة خاطئة؟ قد يتغير سلوك الدالة أو تفشل المطابقة مع متطلبات المواصفة.
      </li>
    `);
  });

  if (containsCppNullptrToken(clean)) {
    pushRow('cpp:nullptr', `
      <li>
        ${renderExternalReference('nullptr')}:
        ما هو؟ ثابت لغوي في C++ يشير إلى مؤشر فارغ.
        ما معناه؟ عدم وجود عنوان ذاكرة فعلي.
        لماذا يُستخدم هنا؟ لتمثيل أن هذا البارامتر أو الحقل لا يمرر بنية إضافية أو مخصصاً أو مؤشراً فعلياً.
        ما علاقته بالسطر الحالي؟ يظهر كقيمة إسناد أو كوسيط استدعاء.
        ما القيم الممكنة له؟ nullptr فقط بوصفه قيمة فارغة للمؤشرات.
        ماذا يحدث إذا استُبدل بمؤشر غير صالح؟ قد تقرأ الدالة عنواناً غير صحيح أو تفشل.
      </li>
    `);
  }

  return rows;
}

function buildCommentIssues(example, item, variableIndex) {
  const issues = [];
  let pendingComment = '';

  String(example || '').split('\n').forEach((line) => {
    const rawTrimmed = line.trim();
    if (!rawTrimmed) {
      return;
    }

    if (rawTrimmed.startsWith('//')) {
      const commentText = rawTrimmed.replace(/^\/\/\s*/, '').trim();
      if (commentText) {
        pendingComment = commentText;
      }
      return;
    }

    const trimmed = stripInlineComment(line).trim();
    const previous = pendingComment || describeCodeLineLegacy(trimmed);
    const improved = describeCodeLinePrecisely(trimmed, {variableIndex, item});
    pendingComment = '';

    if (!previous || !improved || previous === improved) {
      return;
    }

    if (/تهيئة|ضبط نوع الهيكل|استخدامه لاحقاً|تنفيذ خطوة برمجية|الخطوات التالية|قيمة أولية|أصبح المقبض صالحاً|مسار النجاح|المعالجة البديلة|يمكن تمريره/.test(previous)) {
      issues.push({
        line: trimmed,
        previous,
        reason: 'لأنه يصف السطر بعبارة عامة ولا يوضح العناصر البرمجية الفعلية الموجودة فيه مثل النوع أو الحقل أو الثابت أو الدالة.',
        missing: improved,
        relatedElements: buildCommentIssueRelatedElements(trimmed, item)
      });
    }
  });

  return issues;
}

function buildCommentIssueRelatedElements(line, item) {
  const rows = [];
  const seen = new Set();
  const clean = stripInlineComment(line).trim();

  const pushRow = (row) => {
    const key = `${row.kind}:${row.name}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    rows.push(row);
  };

  findUniqueVulkanFunctionTokens(clean).forEach((name) => {
    const functionItem = findCommandItemByName(name);
    pushRow({
      name,
      kind: 'function',
      kindLabel: 'دالة Vulkan',
      meaning: inferFunctionIntentSummary(functionItem || {name, description: ''}),
      usage: inferFunctionBenefitSummary(functionItem || {name, description: ''})
    });
  });

  findUniqueVulkanTypeTokens(clean).forEach((name) => {
    const structureItem = findItemInCategories(vulkanData.structures, name);
    const enumItem = findItemInCategories(vulkanData.enums, name);
    const typeItem = findTypeItemByName(name);
    const enumMeta = enumItem ? getEnumMetadata(name) : null;

    pushRow({
      name,
      kind: 'type',
      kindLabel: structureItem ? 'بنية Vulkan' : (enumItem ? 'تعداد Vulkan' : 'نوع Vulkan'),
      meaning: enumMeta?.meaning || typeItem?.description || `يحدد شكل البيانات أو المورد الذي يعمل عليه هذا السطر عبر النوع ${name}.`,
      usage: structureItem
        ? `ظهرت هذه البنية في السطر لأنها تحمل البيانات التي ستقرأها Vulkan أو ستملأها قبل الانتقال إلى الخطوة التالية.`
        : `ظهر هذا النوع في السطر لأنه يحدد الفئة الرسمية للبيانات أو القيمة التي يعتمد عليها التنفيذ في هذا الموضع.`
    });
  });

  return rows;
}

function inferLessonConstantKindLabel(name, constantItem, enumMeta) {
  if (constantItem && findMacroItemByName(name)) {
    return 'ثابت ماكرو';
  }
  if (/FlagBits|Flags/.test(enumMeta?.enumName || '') || /_BIT\b/.test(name)) {
    return 'علم بتّي (Bitmask)';
  }
  return 'ثابت تعداد (Enum)';
}

function buildLessonConstantTooltip(name, constantItem, enumMeta, item) {
  const kindLabel = inferLessonConstantKindLabel(name, constantItem, enumMeta);
  const numericValue = enumMeta?.numericValue || constantItem?.value || constantItem?.syntax || 'راجع التوثيق الرسمي';
  const meaning = enumMeta?.valueMeaning || constantItem?.description || describeValueMeaning(name);
  const chosenBecause = enumMeta?.chosenBecause || 'استُخدم لأن السطر يحتاج القيمة الرسمية نفسها بدل رقم أو نص حرفي.';
  const usualUsage = describeVulkanConstantTypicalUsage(name, constantItem, enumMeta);
  const notes = /FlagBits|Flags/.test(enumMeta?.enumName || '') || /_BIT\b/.test(name)
    ? 'يمكن جمع هذه القيمة مع أعلام أخرى إذا كان الحقل أو البارامتر يسمح بالأقنعة البتّية.'
    : 'يجب أن تطابق هذه القيمة الحقل أو البارامتر الذي يقرأها حتى لا تفسرها Vulkan بشكل خاطئ.';
  return [
    `الاسم: ${name}`,
    `النوع: ${kindLabel}`,
    `المعنى الحقيقي: ${preferStrictArabicVulkanText(meaning, meaning)}`,
    `سبب الاستخدام: ${preferStrictArabicVulkanText(chosenBecause, chosenBecause)}`,
    `القيمة العددية: ${numericValue}`,
    `أين يستخدم عادة: ${preferStrictArabicVulkanText(usualUsage, usualUsage)}`,
    `ملاحظات مهمة: ${notes}`
  ].join('\n');
}

function buildRewrittenCode(example) {
  const variables = extractDeclaredVariables(example);
  const variableIndex = buildVariableIndex(variables);
  const lines = [];

  String(example || '').split('\n').forEach((line) => {
    const clean = stripInlineComment(line);
    const trimmed = clean.trim();
    if (!trimmed) {
      lines.push('');
      return;
    }

    if (trimmed.startsWith('//')) {
      return;
    }

    const explanation = describeCodeLinePrecisely(clean, {variableIndex});
    const indentation = (line.match(/^\s*/) || [''])[0];
    if (explanation) {
      lines.push(`${indentation}// ${explanation}`);
    }
    lines.push(clean);
  });

  return lines.join('\n');
}

function buildExampleAnalysis(example, item) {
  const variables = extractDeclaredVariables(example);
  const variableIndex = buildVariableIndex(variables);
  const tokenGroups = collectUsedTokens(example, variableIndex);
  const commentIssues = buildCommentIssues(example, item, variableIndex);
  const rewrittenCode = buildRewrittenCode(example);

  const lineRows = String(example || '').split('\n').map((line) => {
    const trimmed = stripInlineComment(line).trim();
    if (!trimmed || trimmed.startsWith('//')) {
      return null;
    }

    const elements = buildElementRowsForLine(line, item, variableIndex);
    if (!elements.length) {
      return null;
    }

    return {
      line: trimmed,
      summary: describeCodeLinePrecisely(line, {variableIndex, item}),
      elements
    };
  }).filter(Boolean);

  const referenceMap = new Map();
  [...tokenGroups.functions, ...tokenGroups.types, ...tokenGroups.constants, ...tokenGroups.cpp, ...tokenGroups.fields].forEach((entry) => {
    const name = entry.name || entry.value || entry.ownerType;
    const url = getExternalReferenceUrl(entry.name || entry.name, entry.ownerType ? {ownerType: entry.ownerType} : {});
    if (name && url && !referenceMap.has(name)) {
      referenceMap.set(name, url);
    }
  });

  variables.forEach((variable) => {
    const typeName = normalizeLookupName(variable.type);
    const url = getExternalReferenceUrl(typeName);
    if (url && !referenceMap.has(typeName)) {
      referenceMap.set(typeName, url);
    }
  });

  return {
    variables,
    variableIndex,
    tokenGroups,
    commentIssues,
    lineRows,
    rewrittenCode,
    references: Array.from(referenceMap.entries())
  };
}

function renderExampleReferenceList(example) {
  const references = extractUniqueVulkanReferenceTokens(example)
    .map((token) => renderRelatedReferenceLink(token))
    .filter(Boolean)
    .slice(0, 12);

  if (!references.length) {
    return '';
  }

  return `
    <h3>العناصر البرمجية الظاهرة في المثال</h3>
    <div class="see-also-links">
      ${references.join('')}
    </div>
  `;
}

function getVulkanReadyExampleMatches(item = {}) {
  const legacyExampleId = String(item?.example || '').trim();
  const itemName = String(item?.name || '').trim();

  return VULKAN_READY_EXAMPLES
    .map((example) => {
      const aliases = Array.isArray(example.aliases) ? example.aliases : [];
      const related = Array.isArray(example.related) ? example.related : [];
      let score = 0;

      if (legacyExampleId && aliases.includes(legacyExampleId)) {
        score += 3;
      }
      if (itemName && related.includes(itemName)) {
        score += 1;
      }

      return score > 0 ? {example, score} : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.example);
}

function buildCrossSectionExampleAction(example) {
  const exampleId = String(example?.id || '').trim();
  if (!exampleId) {
    return '';
  }

  if (VULKAN_TO_SDL3_EXAMPLE_ID_SET.has(exampleId)) {
    return `showSdl3Example('core', '${escapeAttribute(exampleId)}')`;
  }

  if (VULKAN_TO_IMGUI_EXAMPLE_ID_SET.has(exampleId)) {
    const imguiExample = getImguiStandaloneExampleItems().find((item) =>
      item.sourceLibrary === 'vulkan' && item.sourceExampleId === exampleId
    );
    if (imguiExample) {
      return `showImguiExample('${escapeAttribute(imguiExample.name)}')`;
    }
  }

  return `showVulkanExample('${escapeAttribute(exampleId)}')`;
}

function getCrossSectionExampleLabel(example) {
  const exampleId = String(example?.id || '').trim();
  if (VULKAN_TO_SDL3_EXAMPLE_ID_SET.has(exampleId)) {
    return 'مثال SDL3';
  }
  if (VULKAN_TO_IMGUI_EXAMPLE_ID_SET.has(exampleId)) {
    return 'مثال Dear ImGui';
  }
  return 'مثال فولكان';
}

function renderLinkedVulkanExampleSection(item) {
  const matches = getVulkanReadyExampleMatches(item).slice(0, 4);
  if (!matches.length) {
    return '';
  }

  return `
    <section class="info-section">
      <div class="content-card prose-card">
        <h2>🔗 أمثلة القسم المستقل</h2>
        <p>يوجد لهذا العنصر أمثلة عملية مرتبطة داخل أقسام الأمثلة المستقلة في المشروع، وقد تظهر في Vulkan أو SDL3 أو Dear ImGui بحسب المكتبة المحورية في المثال.</p>
        <div class="see-also-links">
          ${matches.map((example) => `
            <a href="#" class="related-link code-token entity-link-with-icon" onclick="${buildCrossSectionExampleAction(example)}; return false;">
              ${renderEntityIcon('command', 'ui-codicon nav-icon', getCrossSectionExampleLabel(example))}
              ${escapeHtml(getVulkanExampleDisplayTitle(example) || example.id)}
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function buildExecutionFlowFromVariables(variables, subjectName) {
  const steps = [];

  if (variables.length > 0) {
    steps.push('تجهيز المتغيرات والقيم الأولية اللازمة قبل تنفيذ الفكرة الأساسية في المثال.');
  }

  steps.push(`تنفيذ الجزء الرئيسي المرتبط بالعنصر ${subjectName}.`);
  steps.push('فحص النتيجة أو متابعة استخدام القيمة الناتجة في السياق المناسب.');
  steps.push('الانتقال إلى خطوة التحقق أو الاستخدام التالي داخل التطبيق.');

  return steps;
}


function getFunctionExampleOverride(item) {
  if (item?.name !== 'vkAcquireProfilingLockKHR') {
    return null;
  }

  return {
    example: `VkAcquireProfilingLockInfoKHR info = {};
info.sType = VK_STRUCTURE_TYPE_ACQUIRE_PROFILING_LOCK_INFO_KHR;
info.pNext = nullptr;
info.flags = 0;
info.timeout = 1000000000ULL;

VkResult result = vkAcquireProfilingLockKHR(
    device,
    &info
);

if (result == VK_SUCCESS) {
    // أصبح قفل التحليل محجوزاً لهذا الجهاز ويمكن بدء جمع بيانات الأداء.
} else if (result == VK_TIMEOUT) {
    // لم يتوفر القفل قبل انتهاء المهلة، لذلك أعد المحاولة أو ألغِ جلسة التحليل.
} else {
    // فشل الاستدعاء بسبب خطأ آخر ويجب التعامل معه قبل المتابعة.
}`,
    purpose: 'يوضح المثال كيف يجهز التطبيق بنية طلب قفل التحليل، ثم يحاول حجز profiling lock على الجهاز المنطقي قبل بدء جمع عدادات الأداء.',
    usageItems: [
      'تُستخدم هذه الدالة قبل البدء باستعلامات الأداء عندما يتطلب السائق حجز profiling lock حتى لا تتداخل جلسة التحليل مع عميل آخر.',
      'الحقل timeout يحدد مدة الانتظار القصوى للحصول على القفل؛ إذا انتهت المهلة تعيد الدالة VK_TIMEOUT بدلاً من النجاح.'
    ],
    concepts: [
      'profiling lock ليس مورداً رسوميًا عادياً، بل آلية مزامنة على مستوى السائق لحماية جلسات قياس الأداء.',
      'نجاح الاستدعاء لا يعني بدء القياس تلقائياً، بل فقط أن التطبيق صار قادراً على استخدام مسار الاستعلامات المرتبط بالأداء.'
    ],
    notes: [
      'تأكد من تفعيل الامتداد VK_KHR_performance_query قبل استدعاء هذه الدالة.',
      'إذا حصلت على VK_TIMEOUT فهذا يعني أن المهلة انتهت دون منح القفل، وليس أن الجهاز أو التطبيق تعطّل.'
    ],
    visibleSections: {
      commentIssues: false,
      usageBridge: false,
      flow: false,
      concepts: false,
      notes: false,
      references: false
    }
  };
}

function getDisplayedExample(item) {
  return getFunctionExampleOverride(item)?.example || item?.example || '';
}

function renderFunctionExplanation(item, exampleOverride = '') {
  const override = getFunctionExampleOverride(item) || {};
  return renderDetailedExampleExplanation(item, {
    sectionedCards: true,
    headerKicker: 'قالب موحّد',
    headerDescription: `هذا القسم يوحّد قراءة مثال ${item.name} في بطاقات من نفس عائلة الماكرو والثوابت والبنى، ثم يربط الدوال والثوابت والأنواع والخطوات بالاستخدام الحقيقي داخل Vulkan.`,
    sectionTitles: {
      header: '🧩 شرح تفصيلي للمثال',
      usageBridge: 'كيف يربط المثال بالاستخدام الحقيقي',
      flow: 'مخطط التنفيذ المبسط',
      concepts: 'مفاهيم مرتبطة',
      notes: 'ملاحظات مهمة',
      references: 'القسم 8: قائمة روابط مرجعية مجمعة لكل العناصر المذكورة'
    },
    independentCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes', 'references'],
    summaryCardKeys: ['goal', 'usage-bridge', 'flow', 'concepts', 'notes'],
    kindLabel: 'دالة Vulkan',
    example: exampleOverride || override.example || item.example,
    purpose: override.purpose || item.description || `يوضح المثال كيفية استدعاء ${item.name} داخل تطبيق Vulkan.`,
    usageItems: override.usageItems || getUsageItems(item),
    concepts: [
      `الدالة ${item.name} جزء من واجهة Vulkan وتعمل وفق التوقيع الرسمي ${renderVulkanHighlightedInlineCode(item.signature || `${item.name}(...)`)}.`,
      item.returnType ? `نوع الإعادة هنا هو ${item.returnType}، لذلك يجب فحص القيمة المرجعة قبل استخدام أي ناتج كتبته الدالة.` : 'تحقق من ناتج الدالة أو من المقابض التي كتبتها قبل متابعة التنفيذ.',
      item.extension ? `هذه الدالة مرتبطة بالامتداد ${item.extension} ويجب التأكد من تفعيله قبل الاستدعاء.` : 'تأكد من أن جميع المقابض والبنى الممررة مهيأة وفق ما تتطلبه المواصفة.'
    ].concat(override.concepts || []),
    notes: (override.notes || []).concat(
      item.notes || [],
      getReturnValuesArray(item).slice(0, 4).map((entry) => `${entry.value}: ${entry.description}`)
    ),
    visibleSections: override.visibleSections || {}
  });
}

function renderGenericExampleExplanation(item, options = {}) {
  return renderDetailedExampleExplanation(item, options);
}

function enhanceTutorialExamples(root = document) {
  getTutorialSupportRuntime()?.enhanceTutorialExamples?.(root);
}

function normalizeTutorialLessonSections(root = document) {
  getTutorialSupportRuntime()?.normalizeTutorialLessonSections?.(root);
}

function toggleTree(element) {
  const items = element.nextElementSibling;
  if (items) {
    items.classList.toggle('collapsed');
    element.classList.toggle('collapsed');
  }
}

// ==================== عرض صفحة دالة ====================
async function showCommand(name, categoryKey, options = {}) {
  await ensureUiSegment('vulkanReferencePagesRuntime');
  await ensureUiSegment('vulkanParameterOverrides');
  return getVulkanReferencePagesRuntime()?.showCommand?.(name, categoryKey, options);
}

// ==================== عرض الهياكل ====================
async function showStructure(name, options = {}) {
  await ensureUiSegment('vulkanReferencePagesRuntime');
  return getVulkanReferencePagesRuntime()?.showStructure?.(name, options);
}

// ==================== عرض التعدادات ====================
async function showEnum(name, options = {}) {
  await ensureUiSegment('vulkanReferencePagesRuntime');
  return getVulkanReferencePagesRuntime()?.showEnum?.(name, options);
}

// ==================== عرض الثوابت ====================
async function showConstant(name, options = {}) {
  await ensureUiSegment('vulkanValuePagesRuntime');
  return getVulkanValuePagesRuntime()?.showConstant?.(name, options);
}

async function showMacro(name, options = {}) {
  await ensureUiSegment('vulkanValuePagesRuntime');
  return getVulkanValuePagesRuntime()?.showMacro?.(name, options);
}

function getCppReferenceItem(name) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.getCppReferenceItem
    ? runtime.getCppReferenceItem(name)
    : null;
}

function renderCppReferenceRelatedLinks(item) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.renderCppReferenceRelatedLinks
    ? runtime.renderCppReferenceRelatedLinks(item)
    : '';
}

function renderCppReferenceOfficialSection(item) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.renderCppReferenceOfficialSection
    ? runtime.renderCppReferenceOfficialSection(item)
    : '';
}

async function showCppReference(name, options = {}) {
  await ensureUiSegment('cppReferenceUtilsRuntime');
  await ensureUiSegment('generalDetailPagesRuntime');
  await ensureUiSegment('cppReferenceEnrichment');
  await ensureUiSegment('cppReferenceOfficialLinks');
  await ensureUiSegment('cppReferenceGuides');
  await ensureUiSegment('cppReferenceTooltips');
  return getGeneralDetailPagesRuntime()?.showCppReference?.(name, options);
}

async function showCommandsIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showCommandsIndex?.(options);
}

async function showStructuresIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showStructuresIndex?.(options);
}

async function showEnumsIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showEnumsIndex?.(options);
}

function showVariablesIndex(options = {}) {
  const run = async () => {
    await ensureUiSegment('indexPagesRuntime');
    return getIndexPagesRuntime()?.showVariablesIndex?.(options);
  };
  return run();
}

async function showConstantsIndex(options = {}) {
  await ensureUiSegment('indexPagesRuntime');
  return getIndexPagesRuntime()?.showConstantsIndex?.(options);
}


// ==================== وظائف مساعدة ====================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttribute(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const entityCodiconMap = {
  command: 'command',
  macro: 'macro',
  constant: 'constant',
  'constant-ref': 'constant',
  structure: 'structure',
  enum: 'enum',
  variable: 'variable',
  handle: 'variable',
  function_pointer: 'command',
  glsl: 'glsl',
  imgui: 'imgui',
  cpp: 'structure',
  gameui: 'tutorial',
  sdl3: 'sdl3',
  tutorial: 'tutorial',
  headers: 'file',
  file: 'file'
};

function getGlslSectionCodicon(sectionKey) {
  const map = {
    directives: 'macro',
    constants: 'constant',
    qualifiers: 'variable',
    control_flow: 'command',
    types: 'structure',
    builtins: 'variable',
    functions: 'command',
    blocks: 'structure'
  };
  return map[sectionKey] || 'glsl';
}

const semanticThemeIconMap = {
  command: 'command',
  macro: 'macro',
  constant: 'constant',
  structure: 'structure',
  enum: 'enum',
  variable: 'variable',
  glsl: 'glsl',
  imgui: 'imgui',
  cpp: 'structure',
  gameui: 'tutorial',
  sdl3: 'sdl3',
  tutorial: 'tutorial',
  file: 'file',
  'symbol-function': 'command',
  'symbol-keyword': 'macro',
  'symbol-constant': 'constant',
  'symbol-struct': 'structure',
  'symbol-enum': 'enum',
  'symbol-variable': 'variable',
  'symbol-interface': 'variable',
  'symbol-property': 'variable',
  'symbol-class': 'structure',
  'code': 'glsl',
  'mortar-board': 'tutorial',
  'files': 'file',
  'book': 'tutorial'
};

const localizedThemeIconAliases = {
  'دالة': 'command',
  'أمر': 'command',
  'أوامر': 'command',
  'ماكرو': 'macro',
  'الثابت': 'constant',
  'ثابت': 'constant',
  'ثوابت': 'constant',
  'هيكل': 'structure',
  'هياكل': 'structure',
  'تعداد': 'enum',
  'تعدادات': 'enum',
  'متغير': 'variable',
  'متغيرات': 'variable',
  'ملف': 'file',
  'ملفات': 'file',
  'درس': 'tutorial',
  'دروس': 'tutorial',
  'تعليمي': 'tutorial',
  'واجهة': 'imgui',
  'imgui': 'imgui',
  'glsl': 'glsl',
  'sdl3': 'sdl3',
  'cpp': 'cpp',
  'c++': 'cpp'
};

const themeIconPaths = {
  command: 'assets/material-icon-theme/function.svg',
  macro: 'assets/material-icon-theme/macro.svg',
  constant: 'assets/material-icon-theme/constant.svg',
  structure: 'assets/material-icon-theme/structure.svg',
  enum: 'assets/material-icon-theme/enum.svg',
  variable: 'assets/material-icon-theme/variable.svg',
  glsl: 'assets/material-icon-theme/glsl.svg',
  imgui: 'assets/material-icon-theme/imgui.svg',
  cpp: 'assets/material-icon-theme/cpp.svg',
  sdl3: 'assets/material-icon-theme/sdl3.svg',
  tutorial: 'assets/material-icon-theme/tutorial.svg',
  file: 'assets/material-icon-theme/file.svg'
};

function renderCodicon(iconName, className = 'ui-codicon', label = '') {
  const normalizedIconName = String(iconName || '').trim();
  const themeKey = semanticThemeIconMap[normalizedIconName]
    || localizedThemeIconAliases[normalizedIconName]
    || normalizedIconName
    || 'file';
  const src = themeIconPaths[themeKey] || themeIconPaths.file;
  return `<img src="${escapeAttribute(src)}" alt="" class="${escapeAttribute(className)}" title="${escapeAttribute(label)}" decoding="async" loading="lazy">`;
}

function renderEntityIcon(type, className = 'ui-codicon', label = '') {
  return renderCodicon(entityCodiconMap[type] || 'symbol-misc', className, label);
}

function getTypeEntityIconType(rawType) {
  const typeName = typeof resolveVulkanOpaqueTypeReferenceName === 'function'
    ? resolveVulkanOpaqueTypeReferenceName(rawType)
    : normalizeLookupName(rawType);
  if (!typeName.startsWith('Vk')) {
    return '';
  }

  try {
    if (findItemInCategories(vulkanData.enums, typeName)) {
      return 'enum';
    }

    if (findVariableTypeItemByName(typeName)) {
      return 'variable';
    }

    if (findItemInCategories(vulkanData.structures, typeName)) {
      return 'structure';
    }
  } catch (_error) {
    return 'structure';
  }

  return 'structure';
}

function getNavigationEntityIconType(navigation, name = '') {
  if (!navigation) {
    return '';
  }

  if (navigation.type === 'command') return 'command';
  if (navigation.type === 'macro') return 'macro';
  if (navigation.type === 'constant') return 'constant';
  if (navigation.type === 'type') return getTypeEntityIconType(name);
  if (navigation.type === 'cpp') return 'cpp';
  if (navigation.type === 'cmake') return navigation.semanticAlias?.iconType || getCmakeKindMeta(navigation.kind || '').icon;
  return '';
}

function resolveReferenceIconType(name, options = {}) {
  const raw = normalizeLookupName(name);
  if (!raw) {
    return '';
  }

  if (options.iconType) {
    return String(options.iconType).trim();
  }

  if (options.relationKind === 'enumValue') {
    return 'constant';
  }

  if (getGlslReferenceItem(raw)) {
    return 'glsl';
  }

  const navigation = resolveReferenceNavigation(raw);
  if (navigation) {
    return getNavigationEntityIconType(navigation, raw);
  }

  if (raw.startsWith('VK_')) {
    return findMacroItemByName(raw) ? 'macro' : 'constant';
  }

  if (raw.startsWith('Vk')) {
    return getTypeEntityIconType(raw);
  }

  if (raw.startsWith('vk')) {
    return 'command';
  }

  return '';
}

function safeRenderEntityLabel(text, type = '', options = {}) {
  const fallback = escapeHtml(String(text || ''));
  if (!type) {
    return fallback;
  }

  try {
    return renderEntityLabel(text, type, options);
  } catch (_error) {
    return fallback;
  }
}

function renderEntityLabel(text, type = '', options = {}) {
  const wrapperClasses = ['entity-inline-label'];
  if (options.code) wrapperClasses.push('entity-inline-label-code');
  if (options.wrapperClass) wrapperClasses.push(options.wrapperClass);

  const iconClass = options.iconClass
    || (options.code ? 'ui-codicon inline-entity-icon inline-entity-icon-code' : 'ui-codicon inline-entity-icon');
  const iconHtml = type ? renderEntityIcon(type, iconClass, text) : '';
  const textHtml = options.wrapInCode
    ? `<code class="entity-label-code">${escapeHtml(text)}</code>`
    : `<span class="entity-label-text">${escapeHtml(text)}</span>`;
  return `<span class="${escapeAttribute(wrapperClasses.join(' '))}">${iconHtml}${textHtml}</span>`;
}

// تهريب الأمثلة البرمجية، وسيُطبَّق عليها التلوين والروابط لاحقاً داخل highlightCode
function formatExampleWithLinks(example) {
  return escapeHtml(String(example || ''));
}

// الحصول على قائمة أسماء الدوال المعروفة
function getKnownFunctionNames() {
  const functions = [];
  Object.values(vulkanData.commands || {}).forEach(category => {
    (category.items || []).forEach(item => {
      if (item.name && !functions.includes(item.name)) {
        functions.push(item.name);
      }
    });
  });
  return functions;
}

function findCommandItemByName(name) {
  for (const category of Object.values(vulkanData.commands || {})) {
    const item = (category.items || []).find((entry) => entry.name === name);
    if (item) {
      return item;
    }
  }

  return null;
}

function getCommandCategoryKey(name) {
  for (const [key, category] of Object.entries(vulkanData.commands || {})) {
    const item = (category.items || []).find((entry) => entry.name === name);
    if (item) {
      return key;
    }
  }

  return '';
}

function getKnownConstantNames() {
  const constants = [];
  Object.values(vulkanData.constants || {}).forEach(category => {
    (category.items || []).forEach(item => {
      if (item.name && item.name.startsWith('VK_') && !constants.includes(item.name)) {
        constants.push(item.name);
      }
    });
  });
  return constants;
}

function findConstantItemByName(name) {
  return findItemInCategories(vulkanData.constants, name)
    || buildSyntheticConstantItem(name);
}

// الحصول على قائمة أسماء الماكرو المعروفة
function getKnownMacroNames() {
  const macros = [];
  Object.values(vulkanData.macros || {}).forEach(category => {
    (category.items || []).forEach(item => {
      if (item.name && !macros.includes(item.name)) {
        macros.push(item.name);
      }
    });
  });
  return macros;
}

function findMacroItemByName(name) {
  return findItemInCategories(vulkanData.macros, name)
    || (!findItemInCategories(vulkanData.constants, name) ? buildSyntheticMacroItem(name) : null);
}

function findTypeItemByName(name) {
  const resolvedName = typeof resolveVulkanOpaqueTypeReferenceName === 'function'
    ? resolveVulkanOpaqueTypeReferenceName(name)
    : normalizeLookupName(name);
  return (
    findItemInCategories(vulkanData.structures, resolvedName) ||
    findVariableTypeItemByName(resolvedName) ||
    findItemInCategories(vulkanData.enums, resolvedName) ||
    buildSyntheticTypeItem(resolvedName)
  );
}

function copyCode(button) {
  const container = button?.closest?.('.code-container');
  const codeBlock = container?.querySelector?.('code');
  const rawCode = String(codeBlock?.dataset?.rawCode || codeBlock?.textContent || '');
  const defaultLabel = button.dataset.defaultLabel || button.textContent || 'نسخ الكود';
  button.dataset.defaultLabel = defaultLabel;
  if (!rawCode.trim()) {
    return Promise.resolve(false);
  }

  const writeViaFallback = () => {
    const textarea = document.createElement('textarea');
    textarea.value = rawCode;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }
    textarea.remove();
    return copied;
  };

  const copyPromise = navigator.clipboard?.writeText
    ? navigator.clipboard.writeText(rawCode).then(() => true).catch(() => writeViaFallback())
    : Promise.resolve(writeViaFallback());

  return copyPromise.then((copied) => {
    button.textContent = copied ? 'تم نسخ الكود' : 'تعذر النسخ';
    button.classList.toggle('is-copied', Boolean(copied));
    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove('is-copied');
    }, copied ? 1500 : 2000);
    return copied;
  });
}

function toggleCodeBlock(button) {
  const container = button?.closest?.('.code-container');
  const pre = container?.querySelector?.('pre.code-block');
  if (!container || !pre) {
    return false;
  }

  const willCollapse = !container.classList.contains('is-collapsed');
  container.classList.toggle('is-collapsed', willCollapse);
  button.textContent = willCollapse
    ? (button.dataset.collapsedLabel || 'إظهار الكود')
    : (button.dataset.expandedLabel || 'طي الكود');
  button.setAttribute('aria-expanded', willCollapse ? 'false' : 'true');
  return false;
}

function renderCppReferenceToken(token) {
  const ref = getCppReferenceItem(token);
  if (!ref) return '';
  const tooltip = buildCppReferenceTooltip(ref);
  const iconType = getCppReferenceIconType(token, ref);
  const content = iconType
    ? safeRenderEntityLabel(token, iconType, {code: true})
    : escapeHtml(token);
  const className = iconType
    ? 'keyword code-token code-link entity-link-with-icon'
    : 'keyword code-token code-link';
  return `<a href="#" class="${className}" title="${escapeAttribute(ref.type)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="showCppReference('${escapeHtml(token)}'); return false;">${content}</a>`;
}

function getCppReferenceIconType(token, ref) {
  const runtime = getCppReferenceUtilsRuntime();
  return runtime?.getCppReferenceIconType
    ? runtime.getCppReferenceIconType(token, ref)
    : '';
}

function getTypeTooltipMeaning(typeName, item) {
  if (item?.isSynthetic && item?.description) {
    return item.description;
  }

  if (typeName === 'VkDisplayKHR') {
    return 'مقبض Vulkan opaque يمثل شاشة عرض أو مخرج Display فعلي على مستوى المنصة عبر امتدادات العرض، وليس نافذة تطبيق عادية.';
  }

  if (findItemInCategories(vulkanData.enums, typeName)) {
    return `${typeName} تعداد يحدد قيمة رسمية تقرؤها الدالة أو الحقل لتحديد الحالة أو النتيجة أو السلوك.`;
  }

  if (findItemInCategories(vulkanData.structures, typeName)) {
    const lead = trimLeadingTypeName(
      getStructureLeadDescription(item) || inferStructureRole(item).meaning || item?.description || '',
      typeName
    );
    const practical = stripMarkup(inferStructureRole(item).intent || '');
    return [lead, practical].filter(Boolean).join('\n');
  }

  if (/^Vk.*(Info|CreateInfo|BeginInfo|Properties|Features|State)$/.test(typeName)) {
    return `${typeName} بنية تضع فيها القيم التي ستقرأها دالة Vulkan لتحديد الإعداد أو الخصائص أو الحالة المطلوبة.`;
  }

  if (/^Vk/.test(typeName) && /مقبض/.test(String(item?.description || ''))) {
    return `${typeName} هو الكائن الذي تحتفظ به في التطبيق لتمثيل ${inferHandleSubject(typeName)}، ثم تمرره إلى الدوال التي تعمل عليه.`;
  }

  if (/^Vk/.test(typeName)) {
    return `${typeName} نوع Vulkan يستخدم لتمثيل بنية أو مورد أو قيمة تقرؤها الدوال لتحديد السلوك أو إعادة النتيجة.`;
  }

  return '';
}

function getTooltipRelatedReferences(item, limit = 4) {
  return [...new Set((item?.seeAlso || []).filter((name) => resolveReferenceNavigation(name)).slice(0, limit))];
}

function buildTypeReferenceTooltip(rawType, item) {
  return buildRawTypeTooltip(rawType, item);
}

function buildExternalReferenceTooltip(name) {
  const token = String(name || '').trim();
  const cppItem = getCppReferenceItem(token);
  if (cppItem) {
    return buildCppReferenceTooltip(cppItem);
  }

  if (/^VK_(KHR|EXT|NV|AMD|ARM|QCOM|HUAWEI|INTEL|LUNARG|GOOGLE|VALVE|SEC|QNX|OHOS|FUCHSIA|ANDROID|GGP|IMG|NN|AMDX)_/.test(token)) {
    return composeSemanticTooltip({
      title: token,
      kindLabel: 'امتداد Vulkan',
      typeLabel: 'Extension Identifier',
      library: 'Vulkan',
      meaning: 'يمثل امتداداً رسمياً يفتح مجموعة سلوك أو أنواع أو استدعاءات إضافية فوق النواة الأساسية.',
      whyExists: 'وُجد لأن Vulkan توسع الميزات عبر الامتدادات بدل إدخال كل شيء في النواة مباشرة.',
      whyUse: 'يستخدمه المبرمج عند التحقق من الدعم أو عند تفعيل الامتداد داخل instance/device create info.',
      actualUsage: 'يظهر كاسم امتداد في قوائم التعداد أو التفعيل قبل استخدام الأنواع أو الدوال التابعة له.'
    });
  }

  if (token.startsWith('VK_')) {
    return /_BIT(?:S)?(?:_|$)/.test(token)
      ? composeSemanticTooltip({
        title: token,
        kindLabel: 'قيمة بتية Vulkan',
        typeLabel: 'Flag Bit',
        library: 'Vulkan',
        meaning: 'يمثل بتاً رسمياً يفعّل خياراً محدداً عند دمجه مع قيم أخرى من النوع نفسه.',
        whyExists: 'وُجد لأن كثيراً من مواضع Vulkan تقبل عدة خيارات قابلة للدمج في حقل واحد.',
        whyUse: 'يستخدمه المبرمج مع OR لتفعيل القدرات أو الاستخدامات أو المراحل أو القيود المطلوبة.',
        actualUsage: 'يظهر في حقول flags أو في مقارنة البتات داخل الكود.'
      })
      : composeSemanticTooltip({
        title: token,
        kindLabel: 'ثابت Vulkan',
        typeLabel: 'Constant Identifier',
        library: 'Vulkan',
        meaning: 'يمثل ثابتاً أو معرفاً رسمياً ذا دلالة خاصة داخل الترويسات أو الحقول أو النتائج.',
        whyExists: 'وُجد حتى تبقى القيمة الخاصة صريحة بدلاً من رقم حرفي بلا معنى.',
        whyUse: 'يستخدمه المبرمج للتصريح عن حالة أو حد أو قيمة محجوزة تتوقعها الواجهة.',
        actualUsage: 'يظهر في التهيئة أو المقارنات أو سلاسل الامتدادات أو حقول البنى.'
      });
  }

  if (token.startsWith('Vk')) {
    return composeSemanticTooltip({
      title: token,
      kindLabel: 'نوع Vulkan',
      typeLabel: 'Official Type',
      library: 'Vulkan',
      meaning: 'يمثل نوعاً رسمياً من أنواع الواجهة مثل بنية أو مقبض أو تعداد أو callback.',
      whyExists: 'وُجد لأن العقد البرمجي في Vulkan مبني على أنواع مسماة وصريحة لا على أرقام خام.',
      whyUse: 'يستخدمه المبرمج في التواقيع والحقول والمقابض وربط الخطوات ببعضها.',
      actualUsage: 'يظهر في تعريفات المتغيرات والبنى والمعاملات والنتائج داخل الكود.'
    });
  }

  if (token.startsWith('vk')) {
    return composeSemanticTooltip({
      title: token,
      kindLabel: 'دالة Vulkan',
      typeLabel: 'API Command',
      library: 'Vulkan',
      meaning: 'يمثل استدعاءً رسمياً ينفذ خطوة صريحة داخل واجهة Vulkan.',
      whyExists: 'وُجد لأن Vulkan تجعل كل خطوة مؤثرة في الإنشاء أو التسجيل أو المزامنة أو الإرسال نداءً مستقلاً.',
      whyUse: 'يستخدمه المبرمج عندما يريد تنفيذ هذه الخطوة بعينها على المورد أو الحالة الصحيحة.',
      actualUsage: 'يظهر في تدفقات التهيئة والرسم والمزامنة والتعامل مع الموارد.'
    });
  }

  return token;
}

function renderOfficialDocsFooter(item, label = 'فتح هذه الصفحة في وثائق Vulkan الرسمية') {
  return `
    <section class="info-section">
      <h2>🌐 وثائق Vulkan الرسمية</h2>
      <div class="content-card prose-card">
        <p>${renderExternalReference(item.name, {}, label)}</p>
      </div>
    </section>
  `;
}

function buildTooltipText(kind, item) {
  if (!item) {
    return '';
  }

  const tooltipKey = `${kind}:${String(item?.name || '')}`;
  if (tooltipBuildInProgress.has(tooltipKey)) {
    return finalizeShortVulkanTooltip(item?.description || item?.name || 'عنصر من Vulkan.', 'عنصر من Vulkan.');
  }

  tooltipBuildInProgress.add(tooltipKey);
  try {
    if (kind === 'function') {
      return buildFunctionEntityTooltip(item);
    }
    if (kind === 'macro') {
      return buildMacroEntityTooltip(item);
    }
    if (kind === 'constant') {
      return buildConstantEntityTooltip(item);
    }
    if (kind === 'type') {
      return buildTypeEntityTooltip(item);
    }

    return finalizeShortVulkanTooltip(item?.description || item?.name || 'عنصر من Vulkan.', 'عنصر من Vulkan.');
  } finally {
    tooltipBuildInProgress.delete(tooltipKey);
  }
}

function renderCommentWithLinks(comment) {
  const tokenRegex = /(\b[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*\b|\bnullptr\b)/g;
  let lastIndex = 0;
  let rendered = '';

  String(comment || '').replace(tokenRegex, (match, _group, offset) => {
    rendered += escapeHtml(comment.slice(lastIndex, offset));
    rendered += renderUsageBridgeCandidateToken(match);
    lastIndex = offset + match.length;
    return match;
  });

  rendered += escapeHtml(String(comment || '').slice(lastIndex));
  return `<span class="comment code-token">${rendered}</span>`;
}

function ensureTooltipElement() {
  if (tooltipElement) {
    return tooltipElement;
  }

  tooltipElement = document.createElement('div');
  tooltipElement.className = 'app-tooltip';
  tooltipElement.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tooltipElement);
  return tooltipElement;
}

function splitTooltipLines(text = '') {
  return String(text || '')
    .split(/\n+/)
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
}

function parseTooltipFieldLine(line = '') {
  const source = String(line || '').trim();
  if (!source) {
    return null;
  }

  const separatorIndex = source.indexOf(':');
  if (separatorIndex <= 0 || separatorIndex > 32) {
    return null;
  }

  const label = source.slice(0, separatorIndex).trim();
  const value = source.slice(separatorIndex + 1).trim();
  if (!label || !value || /^https?:\/\//i.test(source)) {
    return null;
  }

  return {label, value};
}

function buildTooltipMarkup(text = '') {
  const lines = splitTooltipLines(text);
  if (!lines.length) {
    return '';
  }

  const workingLines = [...lines];
  const firstLineField = parseTooltipFieldLine(workingLines[0]);
  const hasStructuredBody = workingLines.slice(1).some((line) => parseTooltipFieldLine(line));

  let title = '';
  if (!firstLineField || hasStructuredBody) {
    title = workingLines.shift() || '';
  }

  const fields = [];
  const notes = [];
  workingLines.forEach((line) => {
    const field = parseTooltipFieldLine(line);
    if (field) {
      fields.push(field);
      return;
    }
    notes.push(line);
  });

  const titleHtml = title ? `<div class="app-tooltip-title">${escapeHtml(title)}</div>` : '';
  const fieldsHtml = fields.length
    ? `<div class="app-tooltip-fields">${fields.map((field) => `
      <div class="app-tooltip-field">
        <span class="app-tooltip-field-label">${escapeHtml(field.label)}</span>
        <span class="app-tooltip-field-value">${escapeHtml(field.value)}</span>
      </div>
    `).join('')}</div>`
    : '';
  const notesHtml = notes.length
    ? `<div class="app-tooltip-notes">${notes.map((note) => `<p>${escapeHtml(note)}</p>`).join('')}</div>`
    : '';

  return `${titleHtml}${fieldsHtml}${notesHtml}` || `<div class="app-tooltip-notes"><p>${escapeHtml(lines.join(' '))}</p></div>`;
}

function positionTooltip(target) {
  if (!tooltipElement || !target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const margin = 10;
  const offset = 12;

  tooltipElement.style.left = '0px';
  tooltipElement.style.top = '0px';
  tooltipElement.style.maxWidth = `${Math.min(360, Math.floor(window.innerWidth * 0.84))}px`;

  const tooltipRect = tooltipElement.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));

  let top = rect.top - tooltipRect.height - offset;
  let placement = 'top';
  if (top < margin) {
    top = rect.bottom + offset;
    placement = 'bottom';
  }

  tooltipElement.dataset.placement = placement;
  tooltipElement.style.left = `${left}px`;
  tooltipElement.style.top = `${top}px`;
}

function resolveDeferredTooltip(target) {
  const directText = sanitizeTooltipText(target?.getAttribute('data-tooltip'));
  if (directText) {
    return directText;
  }

  const ref = String(target?.getAttribute('data-tooltip-ref') || '').trim();
  if (!ref) {
    return '';
  }

  let tooltip = '';
  if (ref.startsWith('sdl3:')) {
    const item = findSdl3AnyItemByName(ref.slice(5));
    tooltip = item ? getCachedSdl3ReferenceTooltip(item) : '';
  }

  const normalized = sanitizeTooltipText(tooltip);
  if (normalized) {
    target.setAttribute('data-tooltip', normalized);
    const label = String(target.getAttribute('data-tooltip-label') || '').trim();
    if (label) {
      target.setAttribute('aria-label', `${label}: ${normalized.replace(/\n/g, ' - ')}`);
    }
  }

  return normalized;
}

function showFloatingTooltip(target) {
  const text = resolveDeferredTooltip(target);
  if (!text) {
    return;
  }

  const rewrittenText = rewriteTooltipForDisplay(target, text);
  const el = ensureTooltipElement();
  activeTooltipTarget = target;
  el.innerHTML = buildTooltipMarkup(rewrittenText);
  el.classList.add('visible');
  el.setAttribute('aria-hidden', 'false');
  positionTooltip(target);
}

function hideFloatingTooltip() {
  if (!tooltipElement) {
    return;
  }

  activeTooltipTarget = null;
  tooltipElement.classList.remove('visible');
  tooltipElement.setAttribute('aria-hidden', 'true');
}

function initTooltipSystem() {
  if (tooltipSystemInitialized) {
    return;
  }

  tooltipSystemInitialized = true;
  ensureTooltipElement();
  const findTooltipTarget = (node) => node?.closest ? node.closest('[data-tooltip], [data-tooltip-ref]') : null;

  document.addEventListener('mouseover', (event) => {
    const target = findTooltipTarget(event.target);
    if (!target) {
      return;
    }

    if (target !== activeTooltipTarget) {
      showFloatingTooltip(target);
    }
  });

  document.addEventListener('mousemove', (event) => {
    const target = findTooltipTarget(event.target);
    if (target && target === activeTooltipTarget) {
      positionTooltip(target);
      return;
    }

    if (!target && activeTooltipTarget) {
      hideFloatingTooltip();
    }
  });

  document.addEventListener('mouseout', (event) => {
    if (!activeTooltipTarget) {
      return;
    }

    const related = event.relatedTarget;
    if (related && activeTooltipTarget.contains(related)) {
      return;
    }

    const stillInside = findTooltipTarget(related) === activeTooltipTarget;
    if (!stillInside) {
      hideFloatingTooltip();
    }
  });

  document.addEventListener('focusin', (event) => {
    const target = findTooltipTarget(event.target);
    if (target) {
      showFloatingTooltip(target);
    }
  });

  document.addEventListener('focusout', (event) => {
    const nextTarget = event.relatedTarget;
    if (findTooltipTarget(nextTarget) !== activeTooltipTarget) {
      hideFloatingTooltip();
    }
  });

  window.addEventListener('scroll', scheduleTooltipPositionUpdate, PASSIVE_SCROLL_CAPTURE_OPTIONS);

  window.addEventListener('resize', () => {
    if (activeTooltipTarget) {
      positionTooltip(activeTooltipTarget);
    }
  });
}

function buildShowCommandCall(name) {
  const categoryKey = getCommandCategoryKey(name);
  const encodedName = escapeHtml(name);
  return `showCommand('${encodedName}', '${escapeHtml(categoryKey)}')`;
}

function renderIdentifierToken(token) {
  const knownFunctions = new Set(getKnownFunctionNames());
  const knownConstants = new Set(getKnownConstantNames());
  const knownMacros = new Set(getKnownMacroNames());
  const constantItem = findConstantItemByName(token);
  const enumValueMatch = findEnumOwnerOfValue(token);
  const macroItem = findMacroItemByName(token);
  const hasImguiStaticTooltip = typeof imguiStaticTooltips !== 'undefined'
    && imguiStaticTooltips
    && typeof imguiStaticTooltips === 'object'
    && Boolean(imguiStaticTooltips[token]);
  const imguiReferenceItem = typeof getImguiReferenceItem === 'function'
    ? getImguiReferenceItem(token)
    : null;
  const isImguiLikeToken = /^ImGui::[A-Za-z0-9_]+$/.test(token)
    || /^ImGui_Impl[A-Za-z0-9_]+$/.test(token)
    || /^ImDraw(?:List|Data)$/.test(token)
    || /^ImGui[A-Za-z0-9_]*Flags(?:_[A-Za-z0-9_]+)?$/.test(token)
    || /^ImGui[A-Z][A-Za-z0-9_]*_[A-Za-z0-9_]+$/.test(token)
    || /^ImGui[A-Z][A-Za-z0-9_]+$/.test(token);

  if (knownFunctions.has(token)) {
    const item = findCommandItemByName(token);
    const tooltip = buildTooltipText('function', item) || 'دالة Vulkan';
    return `<a href="#" class="function code-token code-link entity-link-with-icon" title="${escapeAttribute(item?.name || 'دالة Vulkan')}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${buildShowCommandCall(token)}; return false;">${safeRenderEntityLabel(token, 'command', {code: true})}</a>`;
  }

  if (constantItem && (knownConstants.has(token) || constantItem.isSynthetic)) {
    const tooltip = buildTooltipText('constant', constantItem) || 'ثابت Vulkan';
    return `<a href="#" class="constant code-token code-link entity-link-with-icon" title="${escapeAttribute(constantItem?.name || 'ثابت Vulkan')}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="showConstant('${escapeHtml(token)}'); return false;">${safeRenderEntityLabel(token, 'constant', {code: true})}</a>`;
  }

  if (enumValueMatch) {
    const tooltip = buildEnumValueTooltip(enumValueMatch.enumItem, enumValueMatch.row) || token;
    const anchorId = getEnumValueAnchorId(enumValueMatch.enumItem.name, token);
    return `<a href="#${escapeAttribute(anchorId)}" class="constant code-token code-link entity-link-with-icon" title="${escapeAttribute(token)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="showEnum('${escapeHtml(enumValueMatch.enumItem.name)}'); setTimeout(() => scrollToAnchor('${escapeHtml(anchorId)}'), 30); return false;">${safeRenderEntityLabel(token, 'constant', {code: true})}</a>`;
  }

  if (macroItem && (knownMacros.has(token) || macroItem.isSynthetic)) {
    const tooltip = buildTooltipText('macro', macroItem) || 'ماكرو Vulkan';
    return `<a href="#" class="constant code-token code-link entity-link-with-icon" title="${escapeAttribute(macroItem?.name || 'ماكرو Vulkan')}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="showMacro('${escapeHtml(token)}'); return false;">${safeRenderEntityLabel(token, 'macro', {code: true})}</a>`;
  }

  const typeNav = getTypeNavigation(token);
  if (typeNav) {
    const item = findTypeItemByName(typeNav.name);
    const tooltip = buildTooltipText('type', item) || 'نوع Vulkan';
    const typeIconType = getTypeEntityIconType(typeNav.name);
    const content = typeIconType
      ? safeRenderEntityLabel(token, typeIconType, {code: true})
      : escapeHtml(token);
    const className = typeIconType
      ? 'type code-token code-link entity-link-with-icon'
      : 'type code-token code-link';
    return `<a href="#" class="${className}" title="${escapeAttribute(typeNav.name)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${typeNav.action}('${typeNav.name}'); return false;">${content}</a>`;
  }

  if (getCppReferenceItem(token)) {
    return renderCppReferenceToken(token);
  }

  if ((imguiReferenceItem || hasImguiStaticTooltip || isImguiLikeToken) && typeof renderImguiEntityLink === 'function') {
    return renderImguiEntityLink(token, token, {
      className: 'code-token code-link entity-link-with-icon',
      code: true
    });
  }

  const genericNavigation = resolveReferenceNavigation(token);
  if (genericNavigation?.type === 'cmake') {
    const tooltip = buildNavigationTooltipForName(token, genericNavigation) || token;
    const iconType = getNavigationEntityIconType(genericNavigation, token);
    const content = iconType
      ? safeRenderEntityLabel(token, iconType, {code: true})
      : escapeHtml(token);
    const className = iconType
      ? 'type code-token code-link entity-link-with-icon'
      : 'type code-token code-link';
    return `<a href="#" class="${className}" title="${escapeAttribute(token)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="${genericNavigation.command}; return false;">${content}</a>`;
  }

  const externalUrl = getExternalReferenceUrl(token);
  if (externalUrl && /^(vk|Vk|VK_)/.test(token)) {
    const tooltip = buildExternalReferenceTooltip(token);
    return `<span class="code-token code-link-static" title="${escapeAttribute(token)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`)}">${escapeHtml(token)}</span>`;
  }

  return escapeHtml(token);
}

function resolveGlslDirectiveName(tokens, currentIndex) {
  const previous = getPreviousSignificantToken(tokens, currentIndex - 1);
  if (previous?.token === '#') {
    return `#${tokens[currentIndex]}`;
  }
  return tokens[currentIndex];
}

function renderGlslReferenceToken(token, options = {}) {
  const item = getGlslReferenceItem(token);
  if (!item) {
    return escapeHtml(options.label || token);
  }

  const label = options.label || token;
  const tooltip = String(options.tooltip || buildGlslReferenceTooltip(item) || label).trim();
  const content = renderGlslKindLabel(label, item.kind, {code: true});
  return `<a href="#" class="type code-token code-link entity-link-with-icon" title="${escapeAttribute(item.displayName || item.name)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${escapeAttribute(`${label}: ${tooltip.replace(/\n/g, ' - ')}`)}" onclick="showGlslReference('${escapeAttribute(item.name)}'); return false;">${content}</a>`;
}

function renderCodeTokenWithTooltip(text, className, tooltip) {
  const classes = String(className || 'code-token').trim() || 'code-token';
  const resolvedTooltip = String(tooltip || '').trim();
  if (!resolvedTooltip) {
    return `<span class="${escapeAttribute(classes)}">${escapeHtml(text)}</span>`;
  }

  const aria = escapeAttribute(`${text}: ${resolvedTooltip.replace(/\n/g, ' - ')}`);
  return `<span class="${escapeAttribute(classes)}" data-tooltip="${escapeAttribute(resolvedTooltip)}" tabindex="0" aria-label="${aria}">${escapeHtml(text)}</span>`;
}

function renderLocalExampleCodeToken(token, descriptor = {}) {
  const anchorId = String(descriptor.anchorId || makeAnchorId('analysis-local', token)).trim();
  const tooltip = String(
    descriptor.tooltip
    || descriptor.description
    || `عنصر محلي مساعد داخل المثال الحالي. الضغط عليه ينقلك إلى شرحه داخل الصفحة نفسها.`
  ).trim();
  const iconType = descriptor.iconType || 'variable';
  const className = `code-token code-link entity-link-with-icon local-example-code-link local-example-code-link-${escapeAttribute(iconType)}`;
  const aria = escapeAttribute(`${token}: ${tooltip.replace(/\n/g, ' - ')}`);

  return `<a href="#${escapeAttribute(anchorId)}" class="${className}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="scrollToAnchor('${escapeAttribute(anchorId)}'); return false;">${safeRenderEntityLabel(token, iconType, {code: true})}</a>`;
}

function findMatchingDelimitedTokenIndex(tokens, openIndex, openToken = '(', closeToken = ')') {
  let depth = 0;

  for (let index = openIndex; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === openToken) {
      depth += 1;
      continue;
    }
    if (token === closeToken) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findEnclosingGlslLayoutClause(tokens, currentIndex) {
  let layoutIndex = -1;

  for (let index = currentIndex; index >= 0; index -= 1) {
    const token = tokens[index];
    if (/^\s+$/.test(token)) {
      continue;
    }
    if (token === 'layout') {
      layoutIndex = index;
      break;
    }
    if (/^[;{}]$/.test(token)) {
      break;
    }
  }

  if (layoutIndex < 0) {
    return null;
  }

  const open = getNextSignificantToken(tokens, layoutIndex + 1);
  if (!open || open.token !== '(') {
    return null;
  }

  const closeIndex = findMatchingDelimitedTokenIndex(tokens, open.index, '(', ')');
  if (closeIndex < 0 || currentIndex > closeIndex) {
    return null;
  }

  return {
    layoutIndex,
    openIndex: open.index,
    closeIndex,
    raw: normalizeGlslInlineCodeText(tokens.slice(layoutIndex, closeIndex + 1).join(''))
  };
}

function extractGlslLayoutAssignmentValue(layoutText, key) {
  const match = String(layoutText || '').match(new RegExp(`${key}\\s*=\\s*(\\d+)`, 'i'));
  return match?.[1] || '';
}

function buildGlslCorrectedLayoutTooltip(layoutText) {
  const normalized = normalizeGlslInlineCodeText(layoutText);
  if (!normalized) {
    return '';
  }

  const locationValue = extractGlslLayoutAssignmentValue(normalized, 'location');
  const setValue = extractGlslLayoutAssignmentValue(normalized, 'set');
  const bindingValue = extractGlslLayoutAssignmentValue(normalized, 'binding');
  const localSizeX = extractGlslLayoutAssignmentValue(normalized, 'local_size_x');
  const localSizeY = extractGlslLayoutAssignmentValue(normalized, 'local_size_y');
  const localSizeZ = extractGlslLayoutAssignmentValue(normalized, 'local_size_z');

  if (/^layout\(location\s*=/i.test(normalized) && locationValue) {
    return `صيغة تحدد موضع الواجهة الصريح لهذا المتغير بالقيمة ${locationValue} لضمان تطابق الربط بين المراحل أو مع التطبيق.`;
  }

  if (/^layout\(set\s*=/i.test(normalized) && bindingValue) {
    return `صيغة تفصل مجموعة الواصفات عن رقم الربط داخلها، بحيث يعيّن set المجموعة ${setValue || 'المطلوبة'} ويعيّن binding المورد عند الفتحة ${bindingValue}.`;
  }

  if (/^layout\(binding\s*=/i.test(normalized) && bindingValue) {
    return `صيغة تعلن رقم الربط الصريح للمورد بالقيمة ${bindingValue} بحيث يمكن مطابقة هذا المورد مع الواصفات عند الربط.`;
  }

  if (/^layout\(push_constant\)$/i.test(normalized)) {
    return 'صيغة تعلن أن هذه الكتلة تستخدم مساحة push constants لتمرير بيانات صغيرة مباشرة إلى الشيدر دون واصفات عادية.';
  }

  if (/^layout\(local_size_[xyz]\s*=/i.test(normalized)) {
    const dimensions = [
      localSizeX ? `x = ${localSizeX}` : '',
      localSizeY ? `y = ${localSizeY}` : '',
      localSizeZ ? `z = ${localSizeZ}` : ''
    ].filter(Boolean).join('، ');
    return `صيغة تثبت أبعاد مجموعة العمل ${dimensions ? `بالقيم ${dimensions}` : 'محليًا'}، وقد كتبت داخل layout بالشكل الذي تتطلبه صياغة Compute Shader.`;
  }

  return 'صيغة تعلن معلومات ربط أو تموضع صريحة، وقد كتبت داخل layout بالشكل الذي يقبله glslang أثناء الترجمة والتحقق.';
}

function buildGlslCorrectedCodeTokenTooltip(tokens, currentIndex) {
  const token = String(tokens?.[currentIndex] || '').trim();
  if (!token) {
    return '';
  }

  const layoutInfo = findEnclosingGlslLayoutClause(tokens, currentIndex);
  const layoutText = layoutInfo?.raw || '';

  if (token === 'layout') {
    return buildGlslCorrectedLayoutTooltip(layoutText);
  }

  if (token === 'location') {
    const value = extractGlslLayoutAssignmentValue(layoutText, 'location');
    return value
      ? `يحدد موضع الواجهة الصريح لهذا المتغير بالقيمة ${value} لضمان تطابق الربط بين المراحل أو مع التطبيق.`
      : 'يحدد موضع الواجهة الصريح لهذا المتغير، ووجوده داخل layout يمنع الاعتماد على موضع ضمني غير مقصود.';
  }

  if (token === 'binding') {
    const value = extractGlslLayoutAssignmentValue(layoutText, 'binding');
    return value
      ? `يحدد فتحة الربط الصريحة للمورد بالقيمة ${value} داخل مجموعة الواصفات المختارة، لذلك يعرف Vulkan موضع هذا المورد عند الربط.`
      : 'يحدد فتحة الربط الصريحة للمورد داخل مجموعة الواصفات المختارة بحيث يمكن مطابقته مع الواصفات عند الربط.';
  }

  if (token === 'set') {
    const value = extractGlslLayoutAssignmentValue(layoutText, 'set');
    return value
      ? `يحدد رقم مجموعة الواصفات بالقيمة ${value}، وبذلك يفصل بين رقم المجموعة ورقم الربط الداخلي للمورد.`
      : 'يحدد رقم مجموعة الواصفات التي ينتمي إليها المورد، وبذلك يفصل بين رقم المجموعة ورقم الربط الداخلي له.';
  }

  if (token === 'push_constant') {
    return 'يعلن أن هذه الكتلة تستخدم مساحة push constants لتمرير بيانات صغيرة مباشرة إلى الشيدر دون واصفات عادية.';
  }

  if (token === 'uniform') {
    return 'كلمة مفتاحية تعلن موردًا أو متغيرًا تقرؤه الشيدر من التطبيق دون أن تعدله، وبذلك يوضع في مساحة القراءة الثابتة.';
  }

  if (token === 'in') {
    return 'كلمة مفتاحية تعلن متغير دخل تقرؤه هذه المرحلة من واجهة المرحلة السابقة أو من التطبيق بحسب نوع الشيدر.';
  }

  if (token === 'out') {
    return 'كلمة مفتاحية تعلن متغير خرج تكتبه هذه المرحلة ليصبح جزءًا من الواجهة المرسلة إلى المرحلة التالية أو إلى التطبيق.';
  }

  if (token === 'buffer') {
    return 'كلمة مفتاحية تعلن كتلة موارد مرتبطة بالذاكرة، بحيث تقرأ الشيدر بياناتها أو تكتب فيها عبر مورد ربط صريح.';
  }

  if (token === 'readonly') {
    return 'محدد يصرح بأن هذا المورد يقرأ فقط داخل الشيدر، مما يمنع الكتابة عليه أثناء الترجمة والتحقق.';
  }

  if (token === 'writeonly') {
    return 'محدد يصرح بأن هذا المورد يكتب فقط داخل الشيدر، مما يمنع قراءته في هذا السياق.';
  }

  return '';
}

function buildGlslCorrectedNumericTooltip(tokens, currentIndex) {
  const value = String(tokens?.[currentIndex] || '').trim();
  if (!/^\d+\.?\d*f?$/i.test(value)) {
    return '';
  }

  const previous = getPreviousSignificantToken(tokens, currentIndex - 1);
  if (!previous || previous.token !== '=') {
    return '';
  }

  const keyToken = getPreviousSignificantToken(tokens, previous.index - 1)?.token || '';
  if (keyToken === 'location') {
    return `القيمة ${value} تمثل موضع الواجهة الصريح الذي سيستخدمه هذا المتغير في الربط بين المراحل أو مع التطبيق.`;
  }

  if (keyToken === 'set') {
    return `القيمة ${value} تعني أن المورد ينتمي إلى مجموعة الواصفات رقم ${value} المعرفة في VkPipelineLayout.`;
  }

  if (keyToken === 'binding') {
    return `القيمة ${value} تعني أن المورد مرتبط بفتحة الربط رقم ${value} داخل مجموعة الواصفات المحددة.`;
  }

  if (keyToken === 'local_size_x') {
    return `القيمة ${value} تثبت عدد الاستدعاءات المحلية في البعد x داخل كل مجموعة عمل لهذا الشيدر.`;
  }

  if (keyToken === 'local_size_y') {
    return `القيمة ${value} تثبت عدد الاستدعاءات المحلية في البعد y داخل كل مجموعة عمل لهذا الشيدر.`;
  }

  if (keyToken === 'local_size_z') {
    return `القيمة ${value} تثبت عدد الاستدعاءات المحلية في البعد z داخل كل مجموعة عمل لهذا الشيدر.`;
  }

  return '';
}

function describeCodeLineLegacy(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
    return '';
  }

  if (
    trimmed === '{' ||
    trimmed === '}' ||
    trimmed === '};' ||
    trimmed === ');' ||
    trimmed === ')' ||
    trimmed === '},' ||
    /^[,&]?[A-Za-z_][A-Za-z0-9_]*,?$/.test(trimmed) ||
    /^&[A-Za-z_][A-Za-z0-9_]*,?$/.test(trimmed) ||
    /^VK_[A-Z0-9_]+,?$/.test(trimmed)
  ) {
    return '';
  }

  if (trimmed.startsWith('#include')) {
    return 'تضمين الترويسة المطلوبة لاستخدام الأنواع والدوال المذكورة.';
  }

  if (/^if\s*\(/.test(trimmed)) {
    return 'التحقق من شرط منطقي قبل متابعة التنفيذ.';
  }

  if (/^else\b/.test(trimmed)) {
    return 'المسار البديل عندما لا يتحقق الشرط السابق.';
  }

  if (/^for\s*\(/.test(trimmed)) {
    return 'بدء حلقة تكرار لمعالجة أكثر من عنصر أو تكرار نفس العمل.';
  }

  if (/^while\s*\(/.test(trimmed)) {
    return 'متابعة التنفيذ داخل حلقة طالما بقي الشرط صحيحاً.';
  }

  if (/^switch\s*\(/.test(trimmed)) {
    return 'اختيار مسار تنفيذ بحسب قيمة متغيرة أو تعداد.';
  }

  if (/^return\b/.test(trimmed)) {
    return 'إرجاع قيمة من الدالة الحالية أو إنهاء التنفيذ داخلها.';
  }

  if (/^\w+\s*=\s*&\w+;?$/.test(trimmed)) {
    return 'ربط هذا المتغير بعنوان كائن آخر لاستخدامه كمؤشر إدخال أو إخراج.';
  }

  if (/\.sType\s*=/.test(trimmed)) {
    return 'ضبط نوع هيكل Vulkan قبل تمريره إلى الواجهة.';
  }

  if (/\.pNext\s*=/.test(trimmed)) {
    return 'ضبط سلسلة الامتدادات الإضافية أو تركها فارغة.';
  }

  const assignmentCallMatch = trimmed.match(/^(?:[A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(vk[A-Za-z0-9_]+)\s*\(/);
  if (assignmentCallMatch) {
    return `استدعاء الدالة ${assignmentCallMatch[2]} وتخزين النتيجة في ${assignmentCallMatch[1]}.`;
  }

  const directCallMatch = trimmed.match(/^(vk[A-Za-z0-9_]+)\s*\(/);
  if (directCallMatch) {
    return `استدعاء الدالة ${directCallMatch[1]} لتنفيذ العملية المطلوبة.`;
  }

  const macroAssignMatch = trimmed.match(/^(?:auto|[A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(VK_[A-Z0-9_]+)/);
  if (macroAssignMatch) {
    return `تخزين قيمة ${macroAssignMatch[2]} في المتغير ${macroAssignMatch[1]} لاستخدامها لاحقاً.`;
  }

  const zeroInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>]*)\s+([A-Za-z_]\w*)\s*=\s*\{\s*\};?$/);
  if (zeroInitMatch) {
    return `تهيئة ${zeroInitMatch[2]} من النوع ${zeroInitMatch[1]} بقيم افتراضية آمنة.`;
  }

  const handleInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>]*)\s+([A-Za-z_]\w*)\s*=\s*VK_NULL_HANDLE;$/);
  if (handleInitMatch) {
    return `تهيئة المقبض ${handleInitMatch[2]} بقيمة فارغة إلى أن يتم إنشاؤه أو استلامه.`;
  }

  const pointerInitMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*nullptr;$/);
  if (pointerInitMatch) {
    return `تهيئة المؤشر ${pointerInitMatch[2]} بقيمة فارغة قبل ربطه ببيانات فعلية.`;
  }

  const genericAssignMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_:<>\s\*]+)\s+([A-Za-z_]\w*)\s*=\s*(.+);$/);
  if (genericAssignMatch) {
    return `تجهيز ${genericAssignMatch[2]} بقيمة أولية لاستخدامه في الخطوات التالية.`;
  }

  if (/^\(void\)/.test(trimmed)) {
    return 'تجاهل النتيجة مؤقتاً لتوضيح أن المتغير استُخدم عمداً.';
  }

  return 'تنفيذ خطوة برمجية ضمن هذا المثال.';
}

function annotateExampleCode(rawCode) {
  const normalizedCode = String(rawCode || '')
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) {
        return '';
      }
      return stripInlineComment(line);
    })
    .filter((line, index, array) => !(line === '' && array[index - 1] === ''))
    .join('\n');

  const variables = extractDeclaredVariables(normalizedCode);
  const variableIndex = buildVariableIndex(variables);
  const lines = normalizedCode.split('\n');
  const annotated = [];

  lines.forEach((line) => {
    const explanation = describeCodeLinePrecisely(line, {variableIndex});
    const indentation = (line.match(/^\s*/) || [''])[0];

    if (explanation) {
      annotated.push(`${indentation}// ${explanation}`);
    }

    annotated.push(line);
  });

  return annotated.join('\n');
}

function getCodeBlockLanguage(block) {
  const match = Array.from(block.classList)
    .map((className) => className.match(/^language-([A-Za-z0-9_+-]+)$/))
    .find(Boolean);

  return (match?.[1] || 'cpp').toLowerCase();
}

function findStructureFieldInfo(ownerType, fieldName) {
  const normalizedOwner = normalizeLookupName(ownerType);
  if (!normalizedOwner || !fieldName) {
    return null;
  }

  const ownerItem = findTypeItemByName(normalizedOwner) || findItemInCategories(vulkanData.structures, normalizedOwner);
  if (!ownerItem) {
    return null;
  }

  return getStructureFieldRows(ownerItem).find((entry) => entry.name === fieldName) || null;
}

function buildTutorialVariableTooltip(name, variableInfo) {
  const typeName = normalizeLookupName(variableInfo?.type || '');
  const typeItem = typeName ? findTypeItemByName(typeName) : null;
  const linkedMeaning = typeName ? getTypeTooltipMeaning(typeName, typeItem) : '';
  return composeSemanticTooltip({
    title: name,
    kindLabel: 'متغير درس',
    typeLabel: typeName || 'متغير محلي',
    library: 'Tutorial',
    meaning: variableInfo?.description || linkedMeaning || 'يمثل حالة أو مورداً أو نتيجة مرحلية يحتاجها الشرح العملي داخل الدرس.',
    whyExists: 'وُجد لأن الدرس يربط المفهوم النظري بمتغيرات حقيقية تحمل الحالة أو الموارد أثناء التنفيذ.',
    whyUse: linkedMeaning ? `يستخدمه المبرمج هنا لأنه يحمل قيمة من النوع ${typeName} بما يربط الشرح النظري بتأثيره العملي.` : 'يستخدمه المبرمج للاحتفاظ بالقيمة التي تعتمد عليها الخطوة التالية من الشرح.',
    actualUsage: typeName ? `يظهر في الكود كمتغير من النوع ${typeName} يمر بين خطوات الدرس أو يقرأه استدعاء لاحق.` : 'يظهر داخل كود الدرس كقيمة محلية تشرح تدفق التنفيذ.'
  });
}

function renderTutorialVariableToken(name, variableInfo) {
  const tooltip = buildTutorialVariableTooltip(name, variableInfo);
  const typeName = normalizeLookupName(variableInfo?.type || '');
  const typeNav = typeName ? getTypeNavigation(typeName) : null;
  const aria = escapeAttribute(`${name}: ${tooltip.replace(/\n/g, ' - ')}`);

  if (typeNav) {
    return `<a href="#" class="variable code-token code-link entity-link-with-icon" title="${escapeAttribute(name)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="${typeNav.action}('${typeNav.name}'); return false;">${safeRenderEntityLabel(name, 'variable', {code: true})}</a>`;
  }

  return `<span class="variable code-token entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${safeRenderEntityLabel(name, 'variable', {code: true})}</span>`;
}

function getPreviousSignificantToken(tokens, startIndex) {
  for (let index = startIndex; index >= 0; index -= 1) {
    const token = tokens[index];
    if (!/^\s+$/.test(token)) {
      return {token, index};
    }
  }
  return null;
}

function getNextSignificantToken(tokens, startIndex) {
  for (let index = startIndex; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!/^\s+$/.test(token)) {
      return {token, index};
    }
  }
  return null;
}

function resolveFieldAccessContext(tokens, currentIndex, variableIndex) {
  const currentToken = tokens[currentIndex];
  if (!/^[A-Za-z_][A-Za-z0-9_:]*$/.test(currentToken)) {
    return null;
  }

  const previous = getPreviousSignificantToken(tokens, currentIndex - 1);
  if (!previous || previous.token !== '.') {
    return null;
  }

  const segments = [currentToken];
  let cursor = previous.index - 1;

  while (cursor >= 0) {
    const ownerToken = getPreviousSignificantToken(tokens, cursor);
    if (!ownerToken || !/^[A-Za-z_][A-Za-z0-9_:]*$/.test(ownerToken.token)) {
      break;
    }

    segments.unshift(ownerToken.token);
    const dotToken = getPreviousSignificantToken(tokens, ownerToken.index - 1);
    if (!dotToken || dotToken.token !== '.') {
      break;
    }
    cursor = dotToken.index - 1;
  }

  if (segments.length < 2) {
    return null;
  }

  const rootName = segments[0];
  const rootInfo = variableIndex[rootName] || tutorialVariableHints[rootName];
  let ownerType = normalizeLookupName(rootInfo?.type || '');
  if (!ownerType) {
    return null;
  }

  for (let i = 1; i < segments.length - 1; i += 1) {
    const nestedField = findStructureFieldInfo(ownerType, segments[i]);
    if (!nestedField) {
      return null;
    }
    ownerType = normalizeLookupName(nestedField.type || '');
    if (!ownerType) {
      return null;
    }
  }

  const fieldName = segments[segments.length - 1];
  const fieldInfo = findStructureFieldInfo(ownerType, fieldName);
  if (!fieldInfo) {
    return null;
  }

  return {
    rootName,
    ownerType,
    fieldName,
    fieldType: fieldInfo.type || ''
  };
}

function renderTutorialFieldToken(fieldName, ownerType, fieldType = '') {
  const tooltip = buildFieldTooltip(fieldName, ownerType, fieldType, '');
  const ownerNav = getTypeNavigation(ownerType);
  const aria = escapeAttribute(`${fieldName}: ${tooltip.replace(/\n/g, ' - ')}`);

  if (ownerNav) {
    return `<a href="#" class="field code-token code-link entity-link-with-icon" title="${escapeAttribute(fieldName)}" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}" onclick="${ownerNav.action}('${ownerNav.name}'); return false;">${safeRenderEntityLabel(fieldName, 'variable', {code: true})}</a>`;
  }

  return `<span class="field code-token entity-link-with-icon" data-tooltip="${escapeAttribute(tooltip)}" tabindex="0" aria-label="${aria}">${safeRenderEntityLabel(fieldName, 'variable', {code: true})}</span>`;
}

function renderGenericScriptIdentifier(token, language, options = {}) {
  const normalized = token.toLowerCase();

  if (language === 'cmake') {
    const cmakeSemanticToken = renderCmakeSemanticToken(token, {...options, contextLabel: 'الكود الحالي'});
    if (cmakeSemanticToken) {
      return cmakeSemanticToken;
    }
  }

  if (language === 'bash' && bashKeywordTokens.has(normalized)) {
    return `<span class="keyword code-token">${escapeHtml(token)}</span>`;
  }

  if (language === 'cmake' && cmakeKeywordTokens.has(normalized)) {
    return `<span class="keyword code-token">${escapeHtml(token)}</span>`;
  }

  if (/^(vk|Vk|VK_)/.test(token)) {
    return renderIdentifierToken(token);
  }

  if (/^[A-Z_][A-Z0-9_]*$/.test(token)) {
    return `<span class="variable code-token">${escapeHtml(token)}</span>`;
  }

  return escapeHtml(token);
}

function highlightNonCppCode(rawCode, language, options = {}) {
  const tokenRegex = /(\$\{[A-Za-z_][A-Za-z0-9_]*\}|\$[A-Za-z_][A-Za-z0-9_]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+\.?\d*\b|\b[A-Za-z_][A-Za-z0-9_]*\b|==|!=|<=|>=|&&|\|\||[+\-*/%&|^~!=<>?:;,.()[\]{}\\]|\s+|.)/g;
  let rendered = '';
  const tokens = language === 'cmake'
    ? tokenizeCmakeCodeLikeSource(rawCode)
    : (String(rawCode || '').match(tokenRegex) || []);

  tokens.forEach((token) => {
    if (/^\s+$/.test(token)) {
      rendered += token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }

    if (/^#[^\n]*$/.test(token)) {
      rendered += `<span class="comment code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(token) || /^\$[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      if (language === 'cmake') {
        const semanticToken = renderCmakeSemanticToken(token, {...options, contextLabel: 'الكود الحالي'});
        if (semanticToken) {
          rendered += semanticToken;
          return;
        }
      }
      rendered += `<span class="variable code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^"(?:\\.|[^"\\])*"$/.test(token) || /^'(?:\\.|[^'\\])*'$/.test(token)) {
      if (language === 'cmake') {
        rendered += renderCmakeQuotedStringToken(token, {...options, contextLabel: 'سلسلة داخل كود CMake'});
        return;
      }
      rendered += `<span class="string code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^\b\d+\.?\d*\b$/.test(token)) {
      rendered += `<span class="number code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (language === 'cmake') {
      const semanticToken = renderCmakeSemanticToken(token, {...options, contextLabel: 'الكود الحالي'});
      if (semanticToken) {
        rendered += semanticToken;
        return;
      }
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      rendered += renderGenericScriptIdentifier(token, language, options);
      return;
    }

    if (/^(==|!=|<=|>=|&&|\|\||[+\-*/%&|^~!=<>?:;,.()[\]{}\\])$/.test(token)) {
      rendered += `<span class="operator code-token">${escapeHtml(token)}</span>`;
      return;
    }

    rendered += escapeHtml(token);
  });

  return rendered;
}

function renderHighlightedCode(rawCode, options = {}) {
  const language = String(options.language || 'cpp').toLowerCase();
  const annotate = Boolean(options.annotate);
  const glslTooltipMode = String(options.glslTooltipMode || '').trim().toLowerCase();
  const localSymbolMap = options.localSymbolMap || null;
  const functionItem = options.functionItem || null;
  const functionParameterIndex = buildFunctionParameterIndex(functionItem);
  const variableIndex = buildVariableIndex(extractDeclaredVariables(rawCode));

  if (language === 'bash' || language === 'cmake' || language === 'shell') {
    return highlightNonCppCode(rawCode, language === 'shell' ? 'bash' : language, options);
  }

  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b0x[a-fA-F0-9]+\b|\b\d+\.?\d*f?\b|\b[A-Za-z_][A-Za-z0-9_:]*\b|==|!=|<=|>=|&&|\|\||<<=|>>=|<<|>>|\+\+|--|->|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|::|[+\-*/%&|^~!=<>?:;,.()[\]{}]|\s+|.)/g;
  const codeForRender = annotate ? annotateExampleCode(rawCode) : String(rawCode || '');
  let rendered = '';
  const tokens = codeForRender.match(tokenRegex) || [];
  const consumedTokenIndexes = new Set();

  tokens.forEach((token, index) => {
    if (consumedTokenIndexes.has(index)) {
      return;
    }

    if (/^\s+$/.test(token)) {
      rendered += token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return;
    }

    if (/^\/\/[^\n]*$/.test(token)) {
      try {
        rendered += renderCommentWithLinks(token);
      } catch (error) {
        console.error('Failed to render code comment token:', error, token);
        rendered += `<span class="comment code-token">${escapeHtml(token)}</span>`;
      }
      return;
    }

    if (/^\/\*[\s\S]*\*\/$/.test(token)) {
      try {
        rendered += renderCommentWithLinks(token);
      } catch (error) {
        console.error('Failed to render block comment token:', error, token);
        rendered += `<span class="comment code-token">${escapeHtml(token)}</span>`;
      }
      return;
    }

    if (/^"(?:\\.|[^"\\])*"$/.test(token) || /^'(?:\\.|[^'\\])*'$/.test(token)) {
      rendered += `<span class="string code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^\b0x[a-fA-F0-9]+\b$/.test(token) || /^\b\d+\.?\d*f?\b$/.test(token)) {
      if (language === 'glsl' && glslTooltipMode === 'corrected') {
        const tooltip = buildGlslCorrectedNumericTooltip(tokens, index);
        if (tooltip) {
          rendered += renderCodeTokenWithTooltip(token, 'number code-token', tooltip);
          return;
        }
      }

      rendered += `<span class="number code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (token === '#') {
      if (language === 'glsl') {
        const next = getNextSignificantToken(tokens, index + 1);
        if (next && /^[A-Za-z_][A-Za-z0-9_]*$/.test(next.token)) {
          const directiveName = `#${next.token}`;
          const glslDirectiveItem = getGlslReferenceItem(directiveName);
          if (glslDirectiveItem) {
            consumedTokenIndexes.add(next.index);
            rendered += renderGlslReferenceToken(glslDirectiveItem.name, {label: directiveName});
            return;
          }
        }
      }

      rendered += `<span class="keyword code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^(==|!=|<=|>=|&&|\|\||<<=|>>=|<<|>>|\+\+|--|->|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|::|[+\-*/%&|^~!=<>?:;,.()[\]{}])$/.test(token)) {
      rendered += `<span class="operator code-token">${escapeHtml(token)}</span>`;
      return;
    }

    if (/^[A-Za-z_][A-Za-z0-9_:]*$/.test(token)) {
      if (language === 'glsl') {
        const directiveName = resolveGlslDirectiveName(tokens, index);
        const correctedTooltip = glslTooltipMode === 'corrected'
          ? buildGlslCorrectedCodeTokenTooltip(tokens, index)
          : '';
        const glslItem = getGlslReferenceItem(directiveName) || getGlslReferenceItem(token);
        if (glslItem) {
          rendered += renderGlslReferenceToken(glslItem.name, {
            label: token,
            tooltip: correctedTooltip
          });
          return;
        }
        if (correctedTooltip) {
          rendered += renderCodeTokenWithTooltip(token, 'keyword code-token', correctedTooltip);
          return;
        }
      }

      if (getGlfwReferenceProfile(token)) {
        rendered += renderGlfwReferenceToken(token);
        return;
      }

      if (cppKeywordTokens.has(token)) {
        try {
          rendered += renderCppReferenceToken(token);
        } catch (error) {
          console.error('Failed to render C++ reference token:', error, token);
          rendered += `<span class="keyword code-token">${escapeHtml(token)}</span>`;
        }
        return;
      }

      const fieldContext = resolveFieldAccessContext(tokens, index, variableIndex);
      if (fieldContext && fieldContext.fieldName === token) {
        rendered += renderTutorialFieldToken(fieldContext.fieldName, fieldContext.ownerType, fieldContext.fieldType);
        return;
      }

      const functionParameter = functionParameterIndex[token];
      if (functionParameter) {
        rendered += renderFunctionParameterReferenceToken(functionParameter, functionItem, token);
        return;
      }

      const variableInfo = variableIndex[token] || tutorialVariableHints[token];
      if (variableInfo && !token.startsWith('vk') && !token.startsWith('Vk') && !token.startsWith('VK_')) {
        rendered += renderTutorialVariableToken(token, variableInfo);
        return;
      }

      if (localSymbolMap && localSymbolMap[token]) {
        rendered += renderLocalExampleCodeToken(token, localSymbolMap[token]);
        return;
      }

      let linkedToken = escapeHtml(token);
      try {
        linkedToken = renderIdentifierToken(token);
      } catch (error) {
        console.error('Failed to render identifier token:', error, token);
      }
      if (linkedToken !== escapeHtml(token)) {
        rendered += linkedToken;
        return;
      }

      if (/^[A-Z_][A-Z0-9_]*$/.test(token)) {
        rendered += `<span class="variable code-token">${escapeHtml(token)}</span>`;
        return;
      }

      rendered += linkedToken;
      return;
    }

    rendered += escapeHtml(token);
  });

  return rendered;
}

function highlightSingleCodeBlock(block, options = {}) {
  if (!block) {
    return;
  }

  if (block.dataset.skipHighlight === 'true') {
    return;
  }

  const rawCode = block.dataset.rawCode || block.textContent;
  block.dataset.rawCode = rawCode;

  const deferred = block.dataset.deferHighlight === 'true';
  if (deferred && !options.force) {
    return;
  }

  const language = getCodeBlockLanguage(block);
  const annotate = Boolean(block.closest('.example-section')) && !block.closest('.tutorial-example-section');
  const glslTooltipMode = String(block.dataset.glslTooltipMode || '').trim().toLowerCase();
  const functionName = String(block.dataset.functionName || '').trim();
  const functionItem = functionName ? findCommandItemByName(functionName) : null;
  const referenceLibrary = String(block.dataset.referenceLibrary || '').trim();
  const referenceKind = String(block.dataset.referenceKind || '').trim();
  const referenceName = String(block.dataset.referenceName || '').trim();
  let referenceParameters = [];
  if (block.dataset.referenceParameters) {
    try {
      const parsed = JSON.parse(block.dataset.referenceParameters);
      referenceParameters = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse reference parameters from code block:', error);
    }
  }
  const referenceEntity = referenceLibrary === 'cmake'
    ? {
      library: {id: referenceLibrary},
      kind: {id: referenceKind},
      identity: {name: referenceName},
      details: {parameters: referenceParameters}
    }
    : null;
  const renderKey = `${language}::${annotate ? '1' : '0'}::${glslTooltipMode}::${functionName}::${referenceLibrary}::${referenceKind}::${referenceName}::${block.dataset.referenceParameters || ''}::${rawCode}`;
  if (block.dataset.renderKey === renderKey && !options.force) {
    return;
  }

  try {
    block.innerHTML = renderHighlightedCode(rawCode, {
      language,
      annotate,
      glslTooltipMode,
      functionItem,
      referenceEntity
    });
  } catch (error) {
    console.error('Failed to highlight code block:', error, block);
    block.innerHTML = renderHighlightedCode(rawCode, {
      language,
      annotate: false,
      glslTooltipMode,
      functionItem,
      referenceEntity
    });
  }
  block.dataset.renderKey = renderKey;
  if (deferred) {
    delete block.dataset.deferHighlight;
  }
}

function highlightCodeNow(root = document, options = {}) {
  root.querySelectorAll('code[class^="language-"]').forEach((block) => {
    highlightSingleCodeBlock(block, options);
  });
}

const pendingHighlightFrames = new WeakMap();

function highlightCode(root = document, options = {}) {
  if (options.immediate) {
    highlightCodeNow(root, options);
    return;
  }

  const targetRoot = root && typeof root.querySelectorAll === 'function' ? root : document;
  const frameId = pendingHighlightFrames.get(targetRoot);
  if (frameId) {
    window.cancelAnimationFrame(frameId);
  }

  pendingHighlightFrames.set(targetRoot, window.requestAnimationFrame(() => {
    pendingHighlightFrames.delete(targetRoot);
    if (targetRoot !== document && !targetRoot.isConnected) {
      return;
    }
    highlightCodeNow(targetRoot, options);
  }));
}

function initTutorialCodeLazyHighlighting() {
  const preload = () => {
    runtimeAgentController.preloadRuntimeAgent(REFERENCE_INSIGHTS_RUNTIME_KEY);
    runtimeAgentController.preloadRuntimeAgent(TUTORIAL_UI_RUNTIME_KEY);
  };
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(preload, {timeout: 1200});
  } else {
    setTimeout(preload, 250);
  }
}

const SIDEBAR_WIDTH_STORAGE_KEY = 'arabicvulkan.sidebarWidth';
const DEFAULT_SIDEBAR_WIDTH = 320;

function clampSidebarWidthValue(width = DEFAULT_SIDEBAR_WIDTH) {
  const numericWidth = Number(width);
  const resolvedWidth = Number.isFinite(numericWidth) ? numericWidth : DEFAULT_SIDEBAR_WIDTH;
  const minWidth = 260;
  const maxWidth = Math.max(minWidth, Math.min(620, Math.floor(window.innerWidth * 0.58)));
  return Math.round(Math.min(maxWidth, Math.max(minWidth, resolvedWidth)));
}

function readStoredSidebarWidth() {
  try {
    const storedValue = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }
    const parsed = Number(storedValue);
    return Number.isFinite(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function applySidebarWidth(width = DEFAULT_SIDEBAR_WIDTH, options = {}) {
  const normalizedWidth = clampSidebarWidthValue(width);
  document.documentElement.style.setProperty('--sidebar-width', `${normalizedWidth}px`);

  if (options.persist !== false) {
    try {
      window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(normalizedWidth));
    } catch (error) {
      // ignore persistence failures in restricted contexts
    }
  }

  return normalizedWidth;
}

function initSidebarResizer() {
  const sidebar = document.getElementById('sidebar');
  const resizer = document.getElementById('sidebarResizer');
  if (!sidebar || !resizer || resizer.dataset.bound === 'true') {
    return;
  }

  resizer.dataset.bound = 'true';
  applySidebarWidth(readStoredSidebarWidth() || DEFAULT_SIDEBAR_WIDTH, {persist: false});

  let dragging = false;

  const handlePointerMove = (event) => {
    if (!dragging || window.innerWidth <= 900) {
      return;
    }

    const targetWidth = window.innerWidth - event.clientX;
    applySidebarWidth(targetWidth, {persist: false});
  };

  const stopDragging = () => {
    if (!dragging) {
      return;
    }

    dragging = false;
    document.body.classList.remove('sidebar-resizing');
    const currentWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || DEFAULT_SIDEBAR_WIDTH;
    applySidebarWidth(currentWidth, {persist: true});
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
  };

  resizer.addEventListener('pointerdown', (event) => {
    if (window.innerWidth <= 900) {
      return;
    }

    dragging = true;
    document.body.classList.add('sidebar-resizing');
    resizer.setPointerCapture?.(event.pointerId);
    handlePointerMove(event);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);
    event.preventDefault();
  });

  resizer.addEventListener('dblclick', () => {
    applySidebarWidth(DEFAULT_SIDEBAR_WIDTH, {persist: true});
  });

  window.addEventListener('resize', () => {
    if (dragging) {
      return;
    }

    const preferredWidth = readStoredSidebarWidth()
      || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'))
      || DEFAULT_SIDEBAR_WIDTH;
    applySidebarWidth(preferredWidth, {persist: false});
  });
}

function initSidebarNavigation() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar || sidebar.dataset.navBound === 'true') {
    return;
  }

  sidebar.dataset.navBound = 'true';
  window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__?.syncSidebarInteractionSemantics?.(sidebar);

  sidebar.addEventListener('click', (event) => {
    const header = event.target.closest('.nav-super-header, .nav-section-header, .nav-constant-group-header');
    const item = event.target.closest('.nav-item[data-nav-type]');
    if (header && sidebar.contains(header)) {
      window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__?.syncSidebarInteractionSemantics?.(sidebar);
    }
    if (!item || !sidebar.contains(item)) {
      return;
    }
    void handleSidebarNavActivation(event, item);
  });

  sidebar.addEventListener('keydown', (event) => {
    const header = event.target.closest('.nav-super-header, .nav-section-header, .nav-constant-group-header');
    if (header && sidebar.contains(header) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      header.click();
      window.__ARABIC_VULKAN_SIDEBAR_NAVIGATION__?.syncSidebarInteractionSemantics?.(sidebar);
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    const item = event.target.closest('.nav-item[data-nav-type]');
    if (!item || !sidebar.contains(item)) {
      return;
    }
    void handleSidebarNavActivation(event, item);
  });
}

window.__ARABIC_VULKAN_HEAVY_HELPER4_RUNTIME__ = Object.freeze({
  renderHighlightedCode,
  highlightSingleCodeBlock,
  highlightCodeNow,
  highlightCode,
  scheduleProseCardReferenceLinking,
  initProseCardReferenceLinking,
  initTutorialCodeLazyHighlighting,
  initTooltipSystem,
  initSidebarResizer,
  initSidebarNavigation,
  getCodeBlockLanguage,
  renderRecentVisits,
  scheduleRecentVisitCapture,
  toggleTree,
  copyCode,
  getKnownFunctionNames,
  getKnownConstantNames,
  getKnownMacroNames,
  clearRecentVisits,
  removeRecentVisit,
  openRecentVisit,
  toggleSidebarSmartScroll,
  toggleSidebarJumpMenu,
  jumpToSidebarCluster,
  togglePageSmartScroll,
  openStructureField,
  loadDeferredStructureSection,
  showReferenceLibraryIndex,
  showReferenceKindIndex,
  showReferenceEntity,
  showCommand,
  showStructure,
  showEnum,
  showConstant,
  showMacro,
  showCommandsIndex,
  showStructuresIndex,
  showEnumsIndex,
  showVariablesIndex,
  showConstantsIndex
});
