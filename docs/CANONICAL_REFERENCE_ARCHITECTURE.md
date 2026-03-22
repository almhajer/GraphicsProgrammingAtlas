# الهندسة المرجعية المعيارية

هذه الوثيقة تصف الطبقة الجديدة التي تعيد تنظيم المشروع مرجعياً بحيث يصبح كل عنصر قابلاً للوصول عبر:

- مكتبة
- نوع عنصر
- ملف مستقل
- صفحة موحدة

## الهدف

بدلاً من بقاء الشروح موزعة بين منطق العرض وملفات البيانات، تصبح لدينا طبقة مرجعية مستقلة تحفظ:

- المعنى الحقيقي للعنصر
- الترجمة العربية العملية
- الهدف من الاستخدام
- القيمة التي يحملها
- المعاملات أو الحقول أو القيم التابعة
- الروابط المرتبطة

## المسار القياسي

كل مرجع جديد يكتب أو يولد داخل:

`content/reference/<library>/<kind>/<slug>.json`

أمثلة:

- `content/reference/vulkan/functions/vk-create-instance.json`
- `content/reference/vulkan/structures/vk-application-info.json`
- `content/reference/vulkan/variables/vk-instance.json`
- `content/reference/sdl3-image/functions/img-load.json`
- `content/reference/imgui/functions/im-gui-begin.json`
- `content/reference/glslang/directives/version.json`

## الفهارس

- `content/reference/manifest.json`
  الفهرس العام للمكتبات.
- `content/reference/<library>/index.json`
  فهرس المكتبة الواحدة وأقسامها.
- `content/reference/<library>/<kind>/index.json`
  فهرس نوع العناصر داخل المكتبة.

## القالب الدلالي الموحد

كل ملف عنصر يجب أن يحتوي على هذه الطبقات:

- `identity`
  الاسم الأصلي، الـ slug، والعنوان العربي العملي.
- `summary.actualMeaningArabic`
  ما الذي يمثله العنصر فعلاً، لا مجرد وصف زخرفي.
- `summary.purposeArabic`
  متى ولماذا تستخدمه.
- `summary.whyUseArabic`
  ما الفائدة العملية من وجوده في الكود.
- `summary.carriedValueArabic`
  ما القيمة أو الأثر الحقيقي الذي يحمله.
- `details.parameters`
  معنى كل معامل فعلياً.
- `details.fields`
  معنى كل حقل فعلياً.
- `details.values`
  معنى كل قيمة من قيم التعداد أو الثابت التابع.
- `links.related`
  روابط إلى العناصر ذات العلاقة.

## الأقسام القياسية

الأقسام الأساسية القياسية هي:

- `functions`
- `structures`
- `variables`
- `types`
- `enums`
- `constants`
- `macros`
- `directives`
- `qualifiers`
- `builtins`
- `blocks`
- `control-flow`
- `expressions`
- `misc`

إذا لم يكن النوع موجوداً في مصدر المكتبة بشكل صريح، يوضع تحت القسم الأقرب دلالياً أو تحت `misc`.

## التصفح داخل الموقع

أضيف مسار موحد داخل الموقع:

- `#ref`
- `#ref/<library>`
- `#ref/<library>/<kind>`
- `#ref/<library>/<kind>/<slug>`

بهذا يصبح الوصول إلى أي عنصر قائماً على نفس منطق المجلدات والملفات نفسها.

## أمر البناء

لبناء الطبقة المرجعية الجديدة:

```bash
node scripts/build-canonical-reference.js
```

هذا الأمر يعيد توليد جميع الملفات والفهارس من البيانات الحالية في المشروع.
