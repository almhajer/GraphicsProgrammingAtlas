(function initTooltipRuntime(global) {
  'use strict';

  function createTooltipRuntime(deps = {}) {
    const {
      sanitizeTooltipText,
      getCurrentView
    } = deps;

    function compactSemanticTooltipText(text = '', maxWords = 28) {
      let clean = sanitizeTooltipText(text)
        .replace(/^(?:المعنى الحقيقي|المعنى|الوصف الرسمي(?: بالعربي)?|الوصف|الاستخدام|التنفيذ|الفائدة|تنبيه|متى يستخدم|كيف يستخدم هنا|المسار الداخلي|الوصف الرسمي بالعربي)\s*:\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) {
        return '';
      }

      const leadSentence = clean
        .split(/(?<=[.؟!])\s+/)[0]
        .replace(/[.؟!،؛:\s]+$/g, '')
        .trim();
      const words = leadSentence.split(/\s+/).filter(Boolean);
      if (words.length <= maxWords) {
        return leadSentence;
      }

      return words.slice(0, maxWords).join(' ').replace(/[،؛:\s]+$/g, '').trim();
    }

    function buildSemanticTooltipTitle(title = '', kindLabel = 'العنصر') {
      const cleanTitle = sanitizeTooltipText(title).replace(/\s+/g, ' ').trim();
      const cleanKind = sanitizeTooltipText(kindLabel).replace(/\s+/g, ' ').trim() || 'العنصر';
      if (!cleanTitle) {
        return cleanKind;
      }
      if (cleanTitle.startsWith(`${cleanKind} (`)) {
        return cleanTitle;
      }
      return `${cleanKind} (${cleanTitle})`;
    }

    function composeSemanticTooltip({
      title = '',
      kindLabel = 'العنصر',
      typeLabel = '',
      library = '',
      meaning = '',
      whyExists = '',
      whyUse = '',
      actualUsage = '',
      warning = '',
      extra = []
    } = {}) {
      const lines = [
        buildSemanticTooltipTitle(title, kindLabel),
        typeLabel ? `النوع: ${compactSemanticTooltipText(typeLabel, 18)}` : '',
        library ? `المكتبة: ${compactSemanticTooltipText(library, 10)}` : '',
        meaning ? `المعنى الحقيقي: ${compactSemanticTooltipText(meaning, 34)}` : '',
        whyExists ? `لماذا وُجد: ${compactSemanticTooltipText(whyExists, 34)}` : '',
        whyUse ? `لماذا يستخدمه المبرمج: ${compactSemanticTooltipText(whyUse, 34)}` : '',
        actualUsage ? `كيف يظهر في الاستخدام الفعلي: ${compactSemanticTooltipText(actualUsage, 34)}` : '',
        warning ? `تنبيه: ${compactSemanticTooltipText(warning, 32)}` : '',
        ...(Array.isArray(extra) ? extra.filter(Boolean).map((entry) => compactSemanticTooltipText(entry, 24)).filter(Boolean) : [])
      ].filter(Boolean);

      return sanitizeTooltipText(lines.join('\n'));
    }

    function getTooltipTargetLabel(target, fallbackText = '') {
      const aria = String(target?.getAttribute?.('aria-label') || '').trim();
      if (aria.includes(':')) {
        return aria.split(':')[0].trim();
      }

      const dataLabel = String(target?.getAttribute?.('data-tooltip-label') || '').trim();
      if (dataLabel) {
        return dataLabel;
      }

      const text = sanitizeTooltipText(target?.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) {
        return text.slice(0, 80);
      }

      return compactSemanticTooltipText(fallbackText, 12) || 'هذا العنصر';
    }

    function inferTooltipLibraryFromTarget(target) {
      const navType = String(target?.getAttribute?.('data-nav-type') || '').toLowerCase();
      const name = String(target?.getAttribute?.('data-nav-name') || '').toLowerCase();
      const aria = String(target?.getAttribute?.('aria-label') || '').toLowerCase();
      const current = String(getCurrentView?.() || '').toLowerCase();
      const haystack = [navType, name, aria, current].join(' ');

      if (/sdl3|mixer|ttf|image/.test(haystack)) return 'SDL3';
      if (/imgui/.test(haystack)) return 'Dear ImGui';
      if (/glsl/.test(haystack)) return 'GLSL';
      if (/vulkan|vk/.test(haystack)) return 'Vulkan';
      if (/cpp|std::/.test(haystack)) return 'C++';
      if (/game-ui|واجهة/.test(haystack)) return 'Game UI';
      if (/tutorial|درس/.test(haystack)) return 'Tutorial';
      return 'المشروع';
    }

    function inferUiTooltipRoleMeta(target) {
      const tagName = String(target?.tagName || '').toLowerCase();
      const navType = String(target?.getAttribute?.('data-nav-type') || '').toLowerCase();
      const href = String(target?.getAttribute?.('href') || '').trim();

      if (tagName === 'th') {
        return {
          kindLabel: 'وصف عمود',
          typeLabel: 'مساعدة قراءة جدول',
          whyExists: 'حتى يقرأ المستخدم معنى هذا العمود من زاوية برمجية لا من عنوان مختزل فقط.',
          whyUse: 'يفيد عندما تربط كل عمود بما الذي يشرحه فعلياً داخل الجدول.',
          actualUsage: 'يظهر أثناء الوقوف على عنوان العمود قبل مقارنة الصفوف أو تفسير قيمها.'
        };
      }

      if (/^h[1-6]$/.test(tagName)) {
        return {
          kindLabel: 'شرح قسم',
          typeLabel: 'عنوان قسم تفسيري',
          whyExists: 'حتى يوضح هذا العنوان ما الذي سيجمعه القسم التالي من عناصر أو تحليلات أو أمثلة.',
          whyUse: 'يفيد لتحديد ما الذي ستتعلمه من هذا القسم قبل قراءة تفاصيله.',
          actualUsage: 'يظهر عندما تتنقل بين أقسام الصفحة وتحتاج قراراً سريعاً: هل هذا هو القسم الذي يشرح النقطة المطلوبة.'
        };
      }

      if (navType.includes('example') || /\bexample\b/.test(navType)) {
        return {
          kindLabel: 'مدخل مثال',
          typeLabel: 'عنصر تنقل إلى مثال',
          whyExists: 'حتى يختصر هدف المثال قبل فتح صفحته الكاملة.',
          whyUse: 'يفيد لاختيار المثال الذي يشرح الفكرة العملية الأقرب لما تريد تنفيذه.',
          actualUsage: 'يظهر في القوائم الجانبية والروابط المقترحة قبل الانتقال إلى المثال نفسه.'
        };
      }

      if (navType || target?.classList?.contains('nav-item')) {
        return {
          kindLabel: 'مدخل تنقل',
          typeLabel: 'عنصر تنقل داخلي',
          whyExists: 'حتى يشرح هذا المدخل ما الصفحة أو الفهرس الذي سيفتحه فعلياً.',
          whyUse: 'يفيد عندما تريد الوصول إلى القسم الصحيح من دون فتح صفحات متعددة بالتجربة.',
          actualUsage: 'يظهر في الشريط الجانبي وقوائم الفهارس أثناء التنقل بين مراجع المشروع.'
        };
      }

      if (href.startsWith('#')) {
        return {
          kindLabel: 'رابط داخلي',
          typeLabel: 'قفزة داخل الصفحة',
          whyExists: 'حتى يوضح أن الضغط هنا لا يغادر الصفحة بل ينقلك إلى موضع محدد فيها.',
          whyUse: 'يفيد عند متابعة شرح طويل وتحتاج الوصول مباشرة إلى قسم أو حقل أو تحليل بعينه.',
          actualUsage: 'يظهر على الروابط التي تقفز إلى anchors محلية داخل الصفحة الحالية.'
        };
      }

      if (tagName === 'a') {
        return {
          kindLabel: 'رابط مرجعي',
          typeLabel: 'رابط تفسيري أو تنقلي',
          whyExists: 'حتى يبيّن ما الذي سيفتحه هذا الرابط وما علاقته بالسياق الحالي.',
          whyUse: 'يفيد عندما تريد تقرير ما إذا كان هذا الرابط هو المرجع أو المثال المناسب قبل فتحه.',
          actualUsage: 'يظهر أثناء الوقوف على الروابط الداخلية والخارجية داخل الشرح والأمثلة.'
        };
      }

      return {
        kindLabel: 'مساعدة واجهة',
        typeLabel: 'Tooltip سياقي',
        whyExists: 'حتى يشرح هذا العنصر دوره داخل الصفحة بدل أن يترك الاسم أو العنوان وحده.',
        whyUse: 'يفيد عندما تحتاج فهم وظيفة العنصر بسرعة قبل التفاعل معه.',
        actualUsage: 'يظهر عند التحويم أو التركيز على العنصر داخل واجهة المشروع.'
      };
    }

    function rewriteTooltipForDisplay(target, text = '') {
      const normalized = sanitizeTooltipText(text);
      if (!target) {
        return normalized;
      }

      if (normalized && /المعنى الحقيقي:/.test(normalized) && /كيف يظهر في الاستخدام الفعلي:/.test(normalized)) {
        return normalized;
      }

      const label = getTooltipTargetLabel(target, normalized);
      const library = inferTooltipLibraryFromTarget(target);
      const roleMeta = inferUiTooltipRoleMeta(target);
      const contextHeading = sanitizeTooltipText(
        target?.closest?.('section, .info-section, .content-card, .nav-section, .nav-constant-group')?.querySelector?.('h2, h3, .info-label')?.textContent || ''
      ).replace(/\s+/g, ' ').trim();

      const meaning = contextHeading
        ? `${label} هو ${roleMeta.typeLabel} يظهر داخل ${contextHeading} ليكشف المقصود بهذا الموضع قبل متابعة القراءة أو الضغط.`
        : `${label} هو ${roleMeta.typeLabel} يشرح وظيفة هذا الموضع داخل الواجهة بدل الاكتفاء بعنوان مختزل.`;

      const whyExists = roleMeta.whyExists;
      const whyUse = contextHeading
        ? `${roleMeta.whyUse} وفي هذا السياق يساعدك على ربط ${label} بالقسم ${contextHeading}.`
        : roleMeta.whyUse;
      const actualUsage = contextHeading
        ? `${roleMeta.actualUsage} هنا يرتبط مباشرة بالسياق ${contextHeading}.`
        : roleMeta.actualUsage;

      return composeSemanticTooltip({
        title: label,
        kindLabel: roleMeta.kindLabel,
        typeLabel: roleMeta.typeLabel,
        library,
        meaning,
        whyExists,
        whyUse,
        actualUsage
      });
    }

    return {
      compactSemanticTooltipText,
      buildSemanticTooltipTitle,
      composeSemanticTooltip,
      getTooltipTargetLabel,
      inferTooltipLibraryFromTarget,
      inferUiTooltipRoleMeta,
      rewriteTooltipForDisplay
    };
  }

  global.__ARABIC_VULKAN_TOOLTIP_RUNTIME__ = Object.freeze({
    createTooltipRuntime
  });
})(window);
