(function(global) {
  'use strict';

  const FALLBACK_CPP_HOME_CONFIG = Object.freeze({
    meta: Object.freeze({
      title: 'C++',
      kicker: 'اللغة والمكتبة المعيارية',
      description: 'مدخل عربي خفيف إلى C++ بنفس روح فهارس المشروع الحالية.',
      summaryNote: 'يبني هذا المسار فهرس C++ محليًا مع روابط داخلية وصفحات تفصيلية موجودة مسبقًا.',
      statusNote: 'هذه بداية عملية خفيفة قابلة للتوسع لاحقًا.',
      references: Object.freeze([
        Object.freeze({label: 'cppreference: C++', href: 'https://en.cppreference.com/'}),
        Object.freeze({label: 'cppreference: C', href: 'https://cppreference.com/w/c/index.html'}),
        Object.freeze({label: 'CppCoreGuidelines', href: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines'})
      ])
    }),
    featuredTokens: Object.freeze([
      'auto',
      'const',
      'constexpr',
      'nullptr',
      'std::string',
      'std::vector',
      'std::unique_ptr'
    ]),
    sections: Object.freeze([
      Object.freeze({
        key: 'keywords',
        title: 'الكلمات المفتاحية',
        description: 'عناصر اللغة الأساسية التي تضبط معنى الكود.',
        iconType: 'macro',
        tokens: Object.freeze(['auto', 'const', 'constexpr', 'nullptr', 'void', 'struct', 'class', 'using', 'if', 'else', 'for', 'switch', 'case', 'default', 'while', 'break', 'continue', 'try', 'catch', 'return', 'enum', 'throw', 'namespace', 'typedef', 'typename', 'template', 'static', 'inline', 'do', 'extern', 'new', 'this', 'friend', 'virtual', 'override', 'final', 'mutable', 'noexcept', 'union', 'delete', 'operator', 'goto', 'sizeof', 'alignas', 'alignof', 'decltype', 'consteval', 'constinit', 'requires', 'concept', 'public', 'private', 'protected'])
      }),
      Object.freeze({
        key: 'types',
        title: 'الأنواع والبنى',
        description: 'أنواع عملية يراها المبتدئ في الكود الحديث.',
        iconType: 'structure',
        tokens: Object.freeze(['bool', 'uint32_t', 'uint64_t', 'int32_t', 'size_t', 'std::string', 'std::string_view', 'std::span', 'std::optional'])
      }),
      Object.freeze({
        key: 'standard-library',
        title: 'المكتبة المعيارية',
        description: 'رموز أساسية من STL والخوارزميات.',
        iconType: 'function',
        tokens: Object.freeze(['std::vector', 'std::array', 'std::set', 'std::sort', 'std::move', 'std::numeric_limits', 'std::memcpy'])
      }),
      Object.freeze({
        key: 'io-and-errors',
        title: 'الإدخال والأخطاء',
        description: 'عناصر أولية للتعامل مع الإخراج والأخطاء.',
        iconType: 'variable',
        tokens: Object.freeze(['std::cout', 'std::cerr', 'std::endl', 'std::exception', 'std::runtime_error', 'std::ifstream', 'std::stringstream'])
      }),
      Object.freeze({
        key: 'memory-and-helpers',
        title: 'الذاكرة والمساعدات',
        description: 'عناصر الإدارة الحديثة للملكية والعمر.',
        iconType: 'constant',
        tokens: Object.freeze(['std::unique_ptr', 'std::shared_ptr', 'std::make_unique', 'std::move'])
      })
    ])
  });

  function freezeSections(sections = []) {
    return Object.freeze((Array.isArray(sections) ? sections : []).map((section) => Object.freeze({
      key: String(section?.key || '').trim(),
      title: String(section?.title || '').trim(),
      description: String(section?.description || '').trim(),
      iconType: String(section?.iconType || 'cpp').trim(),
      tokens: Object.freeze((Array.isArray(section?.tokens) ? section.tokens : [])
        .map((token) => String(token || '').trim())
        .filter(Boolean)),
      subsections: freezeSections(Array.isArray(section?.subsections) ? section.subsections : []),
      count: Number(section?.count) || (Array.isArray(section?.tokens) ? section.tokens.length : 0)
    })).filter((section) => section.key && section.title));
  }

  function createCppHomeRuntime(api = {}) {
    const {
      buildCppReferenceItem,
      buildCppReferenceTooltip,
      cppHomeConfig,
      renderCodicon
    } = api;

    function getCppHomeConfig() {
      const loadedConfig = typeof cppHomeConfig === 'function' ? cppHomeConfig() : null;
      const sections = freezeSections(loadedConfig?.sections || FALLBACK_CPP_HOME_CONFIG.sections);
      const references = Array.isArray(loadedConfig?.meta?.references)
        ? loadedConfig.meta.references
        : FALLBACK_CPP_HOME_CONFIG.meta.references;
      return Object.freeze({
        meta: Object.freeze({
          ...FALLBACK_CPP_HOME_CONFIG.meta,
          ...(loadedConfig?.meta || {}),
          references: Object.freeze((references || []).map((reference) => Object.freeze({
            label: String(reference?.label || '').trim(),
            href: String(reference?.href || '').trim()
          })).filter((reference) => reference.label && reference.href))
        }),
        featuredTokens: Object.freeze((Array.isArray(loadedConfig?.featuredTokens)
          ? loadedConfig.featuredTokens
          : FALLBACK_CPP_HOME_CONFIG.featuredTokens).map((token) => String(token || '').trim()).filter(Boolean)),
        sections
      });
    }

    function getCppHomeSections() {
      return getCppHomeConfig().sections.map((section) => Object.freeze({
        ...section,
        count: Number(section.count) || section.tokens.length
      }));
    }

    function getCppHomeRecentItems(limit = 6) {
      return getCppHomeConfig().featuredTokens.slice(0, Math.max(1, Number(limit) || 6)).map((token) => {
        const item = typeof buildCppReferenceItem === 'function'
          ? buildCppReferenceItem(token)
          : {name: token, type: 'مرجع C++', description: ''};
        return Object.freeze({
          token,
          item,
          tooltip: typeof buildCppReferenceTooltip === 'function' ? buildCppReferenceTooltip(item) : token
        });
      });
    }

    function buildCppSectionSidebarTooltip(section = {}) {
      const count = Number(section?.count) || (Array.isArray(section?.tokens) ? section.tokens.length : 0);
      const description = String(section?.description || '').trim();
      const subsectionCount = Array.isArray(section?.subsections) ? section.subsections.length : 0;
      const subsectionLine = subsectionCount ? `\nعدد القوائم الفرعية: ${subsectionCount}` : '';
      return `${section?.title || 'قسم C++'}\n${description || 'مدخل فرعي في مرجع C++ المحلي.'}\nعدد العناصر: ${count}${subsectionLine}`;
    }

    function buildCppHomeLibraryModel() {
      const config = getCppHomeConfig();
      const sections = getCppHomeSections();
      const totalCount = sections.reduce((total, section) => total + (Number(section.count) || 0), 0);
      const recentItems = getCppHomeRecentItems(6).map((entry) => ({
        label: entry.token,
        iconType: entry.token.startsWith('std::') ? 'structure' : 'cpp',
        action: `showCppReference('${entry.token.replace(/'/g, "\\'")}')`,
        tooltip: entry.tooltip
      }));

      return {
        key: 'cpp',
        title: config.meta.title || 'C++',
        iconType: 'cpp',
        kicker: config.meta.kicker || 'اللغة والمكتبة المعيارية',
        description: config.meta.description || '',
        summaryNote: config.meta.summaryNote || 'مدخل محلي خفيف لعناصر C++ الأساسية مع نفس أسلوب الشرح والروابط الداخلية في بقية المكتبات.',
        statusNote: config.meta.statusNote || 'هذه مرحلة تأسيسية خفيفة تبني نواة C++ داخل الواجهة الحالية.',
        totalCount,
        headerActions: [
          {label: 'افتح مرجع C++', iconType: 'cpp', action: 'showCppIndex()', primary: true},
          {label: 'الدليل التقني', iconType: 'tutorial', action: `showCppReference('cpp-language-guide')`},
          {label: 'الكلمات المفتاحية', iconType: 'macro', action: `showCppIndex('keywords')`},
          {label: 'المكتبة المعيارية', iconType: 'structure', action: `showCppIndex('standard-library')`}
        ],
        cards: sections.map((section) => ({
          count: Number(section.count) || 0,
          iconType: section.iconType || 'cpp',
          title: section.title,
          note: section.description || `يفتح هذا المسار ${section.title} داخل مرجع C++ المحلي بنفس القالب المعتمد في المشروع.`,
          action: `showCppIndex('${String(section.key || '').replace(/'/g, "\\'")}')`
        })),
        quickLinks: [
          {label: 'مدخل C++', iconType: 'cpp', action: 'showCppIndex()', primary: true},
          {label: 'دليل فهم C++', iconType: 'tutorial', action: `showCppReference('cpp-language-guide')`},
          {label: 'auto و const', iconType: 'macro', action: `showCppIndex('keywords')`},
          {label: 'std::vector', iconType: 'structure', action: `showCppReference('std::vector')`},
          {label: 'std::unique_ptr', iconType: 'structure', action: `showCppReference('std::unique_ptr')`},
          {label: 'أهم المراجع', iconType: 'file', action: `showCppIndex('standard-library')`}
        ],
        recentIconType: 'cpp',
        recentItems,
        recentEmptyText: 'لا توجد عناصر C++ بارزة في هذه اللحظة.',
        supportLinks: [
          {label: 'المرجع المحلي', action: 'showCppIndex()', iconType: 'cpp'},
          {
            label: 'cppreference: C++',
            href: 'https://en.cppreference.com/',
            icon: typeof renderCodicon === 'function' ? renderCodicon('book', 'ui-codicon list-icon', 'مرجع') : ''
          },
          {
            label: 'cppreference: C',
            href: 'https://cppreference.com/w/c/index.html',
            icon: typeof renderCodicon === 'function' ? renderCodicon('book', 'ui-codicon list-icon', 'مرجع') : ''
          },
          {
            label: 'CppCoreGuidelines',
            href: 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines',
            icon: typeof renderCodicon === 'function' ? renderCodicon('book', 'ui-codicon list-icon', 'مرجع') : ''
          }
        ],
        extraSectionsHtml: ''
      };
    }

    return {
      getCppHomeConfig,
      getCppHomeSections,
      getCppHomeRecentItems,
      buildCppSectionSidebarTooltip,
      buildCppHomeLibraryModel
    };
  }

  global.createCppHomeRuntime = createCppHomeRuntime;
  global.__ARABIC_VULKAN_CPP_HOME_RUNTIME__ = {
    createCppHomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
