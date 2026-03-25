# مراحل إضافة مكتبة C++ إلى المشروع

> مستند تسجيل لكل مرحلة مرّت بها إضافة مسار C++، مرتبة زمنيًا مع ملخص لكل مرحلة والملفات المتأثرة.

---

## المرحلة ٠ — البنية التحتية الأولية (قبل phase31)

لم تُسجَّل تفاصيل هذه المراحل في نقاط الرجوع، لكنها شملت:

- إنشاء ملفات JSON الأساسية لبيانات C++ داخل `data/ui/cpp/`
- إعداد `reference-index.json` و`reference-enrichment.json` و`reference-guides.json` و`reference-keywords.json` و`reference-official-links.json` و`reference-tooltip-overrides.json` و`reference-language-types.json` و`reference-standard-library-core.json`
- ربط C++ في القائمة الرئيسية والصفحة الرئيسية

---

## المرحلة ١ — إثراء البيانات والروابط (17 مارس — phase31–34)

| المرحلة | الوصف | الملفات الرئيسية |
|---------|-------|-----------------|
| **phase31** — cpp-json-enrichment | إثراء بيانات JSON لعناصر C++ بوصف أعمق | ملفات JSON داخل `data/ui/cpp/` |
| **phase32** — cpp-official-references | إضافة روابط المراجع الرسمية (cppreference) | `reference-official-links.json` |
| **phase33** — cpp-example-guides | بناء أدلة الأمثلة التعليمية لكل عنصر | `reference-guides.json` |
| **phase34** — cpp-tooltip-overrides | كتابة tooltips عربية دقيقة للمبتدئين | `reference-tooltip-overrides.json` |

---

## المرحلة ٢ — التغطية العامة (17 مارس — phase59–60)

| المرحلة | الوصف |
|---------|-------|
| **phase59** — cpp-breadth | توسيع تغطية العناصر بعدد أكبر من الرموز |
| **phase60** — cpp-breadth-closure | إغلاق الفجوات المتبقية في التغطية |

---

## المرحلة ٣ — مشاريع C++ الكاملة (21 مارس — phase341–346)

| المرحلة | الوصف | الملاحظات |
|---------|-------|-----------|
| **phase341** — std-cpp-bundle-plugin-package-projects | إنشاء مشاريع C++ كاملة: Plugin وBundle وPlugin+Bundle+Lib | ملفات داخل `docs/examples/std-cpp-systems/` |
| **phase342** — std-cpp-site-integration | ربط المشاريع بالواجهة | ملفات `main.cpp` و`config.cfg` و`plugin_api.hpp` |
| **phase344** — std-cpp-macos-commands | إضافة أوامر البناء والتشغيل لـ macOS | `game-ui-section.js` |

---

## المرحلة ٤ — تمهيد البنية الجانبية (21–22 مارس — phase211, 374, 381, 427)

| المرحلة | الوصف |
|---------|-------|
| **phase211** — app-js-cpp-glfw-runtime-extraction | فصل runtime خاص بـ C++ GLFW من `app.js` |
| **phase374** — helper4-cpp-bridge-revert-eager | تراجع عن تحميل مسبق لجسور C++ |
| **phase381** — helper6-canonical-cpp-bridges | بناء جسور C++ وفق المرجع المعياري |
| **phase427** — cpp-reference-route-hardening | تقوية مسارات التنقل في مرجع C++ |

---

## المرحلة ٥ — البناء الأساسي لصفحات C++ (23 مارس — phase486–492)

| المرحلة | الوصف | الملفات الرئيسية |
|---------|-------|-----------------|
| **phase486** — cpp-home-foundation | تأسيس صفحة C++ الرئيسية وربطها في `index.html` | `cpp-home.json`, `cpp-home-runtime.js`, `app-data-runtime.js`, `app-heavy-reference-helpers-{2,5,6,7}.js`, `app-segment-registry.js` |
| **phase487** — cpp-home-visibility-fix | إصلاح ظهور C++ في القائمة الرئيسية | نفس الملفات السابقة |
| **phase489** — cpp-standalone-examples | بناء أمثلة C++ مستقلة غير مرتبطة بالمكتبات الخارجية | `app-heavy-reference-helpers-{6,7}.js` |
| **phase490** — cpp-concepts-and-related-polish | صقل المفاهيم والروابط الداخلية وعناصر مرتبطة | `cpp-reference-guides.json`, `cpp-reference-utils.js`, `general-detail-pages.js` |
| **phase491** — cpp-color-and-example-polish | إرجاع ألوان البطاقات لهوية المشروع وتوسيع الأمثلة | `main.css`, `cpp-reference-guides.json` |
| **phase492** — cpp-copy-buttons-and-guide-fill | إضافة أزرار نسخ وتوسيع الأمثلة للعناصر الناقصة | `main.css`, `cpp-reference-guides.json` |

---

## المرحلة ٦ — المرجعية والعمق (23 مارس — phase493–496)

| المرحلة | الوصف |
|---------|-------|
| **phase493** — cpp-language-root-reference | إضافة رابط صفحة اللغة الأساسية في أسفل صفحات C++ |
| **phase494** — cpp-language-only-meaning | تنظيف العبارات التي تربط C++ بالمكتبات الخارجية |
| **phase495** — cpp-deep-guide-foundation | بناء دليل عميق موسّع لصفحة C++ مع أقسام متعددة |
| **phase496** — cpp-guide-polish-and-header-info | صقل الدليل وإضافة حقول ملف الترويسة (`#include`) |

---

## المرحلة ٧ — صقل البطاقات والواجهة (23 مارس — phase497–502)

| المرحلة | الوصف |
|---------|-------|
| **phase497** — cpp-related-cards | تحويل العناصر المرتبطة إلى بطاقات خفيفة |
| **phase498** — cpp-code-shell-and-examples | توحيد بطاقات الكود مع القالب المرجعي العام |
| **phase499** — cpp-include-and-namespace-polish | صقل عرض `#include` و`std::` و`using` |
| **phase500** — cpp-sidebar-and-active-state | بناء الشريط الجانبي لـ C++ مع حالة التفعيل |
| **phase501** — cpp-scroll-top-and-data-check | التمرير لأعلى وفحص سلامة البيانات |
| **phase502** — cpp-recent-visit-immediate | تسجيل الزيارة الفوري والتحديد الجانبي |

---

## المرحلة ٨ — توسيع الصفحات التفصيلية (23 مارس — phase503–511)

| المرحلة | الوصف |
|---------|-------|
| **phase503** — cpp-missing-pages-and-array-examples | إنشاء صفحات ناقصة وإضافة أمثلة `std::array` |
| **phase504** — cpp-std-exception-page | بناء صفحة `std::exception` كاملة |
| **phase505** — cpp-std-optional-guide | بناء دليل `std::optional` عميق |
| **phase506** — cpp-member-operations | إضافة قسم "الدوال والخصائص المهمة" للأنواع |
| **phase507** — cpp-type-member-operations | تعميم قسم العمليات على أنواع إضافية |
| **phase508** — cpp-operation-toolbar-and-cost | إضافة حقول الفائدة الفعلية والكلفة/السرعة للعمليات |
| **phase509** — cpp-member-operations-vertical | تحويل عرض العمليات إلى تخطيط طولي عمودي |
| **phase510** — cpp-member-operation-field-label-polish | صقل تسميات حقول العمليات بصريًا |
| **phase511** — cpp-related-single-block | تجميع العناصر المرتبطة في بطاقة واحدة متماسكة |

---

## المرحلة ٩ — البحث والتنظيم (23 مارس — phase513–517)

| المرحلة | الوصف |
|---------|-------|
| **phase513** — cpp-search-index | بناء فهرس بحث خاص بـ C++ وربطه بمحرك البحث |
| **phase514** — home-collapses-cpp-cluster | طي عنقود C++ عند العودة للصفحة الرئيسية |
| **phase515** — cpp-keywords-core-batch | أول دفعة كلمات مفتاحية أساسية (`if`, `else`, `while`, `for`, `return`, `auto`, `const`, `static_cast`) |
| **phase516** — cpp-segmented-folder-layout | نقل ملفات C++ إلى `data/ui/cpp/` وتقسيمها تصنيفيًا |
| **phase517** — cpp-home-menu-completion | إكمال قائمة C++ الرئيسية في `home.json` |

---

## المرحلة ١٠ — دفعات الكلمات المفتاحية (23 مارس — phase518–525)

كل دفعة تضيف كلمات مفتاحية بـ 3 أمثلة متدرجة + مرجع رسمي + ربط في القائمة:

| المرحلة | الكلمات المضافة |
|---------|----------------|
| **phase518** — cpp-using-multiple-examples | `using` (مع أمثلة متعددة) |
| **phase519** — cpp-keywords-control-flow-batch | `switch`, `case`, `break`, `continue`, `default` |
| **phase520** — cpp-keywords-exceptions-and-access | `try`, `catch`, `throw`, `public`, `private`, `protected` |
| **phase521** — cpp-keywords-declarations-batch | `typedef`, `typename`, `template`, `static`, `inline`, `do` |
| **phase522** — cpp-keywords-oop-and-linkage-batch | `extern`, `new`, `this`, `friend`, `virtual`, `override`, `final` |
| **phase523** — cpp-keywords-advanced-language-batch | `mutable`, `noexcept`, `union`, `delete`, `operator` |
| **phase524** — cpp-keywords-layout-and-type-batch | `goto`, `sizeof`, `alignas`, `alignof`, `decltype` |
| **phase525** — cpp-keywords-modern-constraints-batch | `consteval`, `constinit`, `requires`, `concept` |

---

## المرحلة التالية (مخططة)

| الدفعة | الكلمات المتوقعة |
|--------|-----------------|
| **التالية** | `export`, `explicit`, `thread_local`, `volatile` |
| **لاحقًا** | `register`, `asm`, `constexpr` (تعميق), `co_await`, `co_return`, `co_yield` |

---

## الملفات المعنية بمسار C++

### بيانات
- `data/ui/cpp/home.json` — صفحة C++ الرئيسية
- `data/ui/cpp/reference-index.json` — فهرس العناصر
- `data/ui/cpp/reference-keywords.json` — بيانات الكلمات المفتاحية
- `data/ui/cpp/reference-enrichment.json` — إثراء الوصف
- `data/ui/cpp/reference-guides.json` — أدلة الأمثلة
- `data/ui/cpp/reference-official-links.json` — الروابط الرسمية
- `data/ui/cpp/reference-tooltip-overrides.json` — تجاوزات الـ tooltip
- `data/ui/cpp/reference-language-types.json` — أنواع اللغة
- `data/ui/cpp/reference-standard-library-core.json` — عناصر المكتبة المعيارية الأساسية

### سلوك
- `js/modules/cpp-home-runtime.js` — تشغيل صفحة C++ الرئيسية
- `js/modules/cpp-reference-utils.js` — أدوات مرجع C++ (tooltips، روابط، أوصاف)
- `js/modules/general-detail-pages.js` — صفحات التفاصيل العامة بما فيها C++
- `js/modules/app-heavy-reference-helpers-7.js` — المساعدات الثقيلة لعرض C++
- `js/modules/app-heavy-reference-helpers-{2,5,6}.js` — مساعدات إضافية
- `js/modules/cpp-glfw-runtime.js` — runtime خاص بـ C++ GLFW
- `js/modules/search-engine.js` — محرك البحث (يشمل فهرس C++)
- `js/modules/app-bootstrap-config.js` — إعدادات التحميل الأولية

### مشاريع كاملة
- `docs/examples/std-cpp-systems/` — مشاريع Plugin/Bundle/Lib

---

## نقطة الرجوع الآمنة الحالية

`.codex/checkpoints/2026-03-23-cpp-keywords-modern-constraints-batch-phase525.json`