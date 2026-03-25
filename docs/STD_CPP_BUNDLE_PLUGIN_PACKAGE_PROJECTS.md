# مشاريع C++ مستقلة: Bundle / Plugin / Package

هذا الملف يجمع 3 مشاريع مستقلة بلغة ++C، بدون أي مكتبات خارجية، وباستخدام `standard library` فقط مع أدوات النظام القياسية عند الحاجة في مثال `plugin`.

## القسم الأول: Bundle

### 1) تعريف سريع بالمفهوم
`bundle` يعني أن البرنامج يعتمد على ملفات موارد مرافقة له مثل الإعدادات وملفات اللغة والصور والبيانات، ويقرأها وقت التشغيل بدل وضعها داخل الكود.

### 2) هيكل المجلدات
```text
docs/examples/std-cpp-systems/bundle-project/
├── src/
│   └── main.cpp
└── resources/
    └── bundles/
        ├── core/
        │   ├── config.cfg
        │   └── lang/
        │       └── ar.txt
        └── menu/
            └── menu.txt
```

### 3) محتوى كل ملف
- `src/main.cpp`: يفحص `resources/bundles/` ويجمع أكثر من bundle في تشغيل واحد.
- `resources/bundles/core/config.cfg`: إعدادات التطبيق الأساسية.
- `resources/bundles/core/lang/ar.txt`: رسائل اللغة العربية الأساسية.
- `resources/bundles/menu/menu.txt`: عناصر قائمة مستقلة قادمة من bundle آخر.

### 4) الكود الكامل
الملفات موجودة هنا:
[main.cpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/bundle-project/src/main.cpp)
[config.cfg](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/bundle-project/resources/bundles/core/config.cfg)
[ar.txt](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/bundle-project/resources/bundles/core/lang/ar.txt)
[menu.txt](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/bundle-project/resources/bundles/menu/menu.txt)

### 5) أمر البناء
Linux:
```bash
cd docs/examples/std-cpp-systems/bundle-project
g++ -std=c++17 src/main.cpp -o bundle_demo
```

macOS:
```bash
cd docs/examples/std-cpp-systems/bundle-project
clang++ -std=c++17 src/main.cpp -o bundle_demo
```

Windows:
```powershell
cd docs/examples/std-cpp-systems/bundle-project
g++ -std=c++17 src/main.cpp -o bundle_demo.exe
```

### 6) أمر التشغيل
Linux:
```bash
./bundle_demo
```

macOS:
```bash
./bundle_demo
```

Windows:
```powershell
.\bundle_demo.exe
```

### 7) الناتج المتوقع
```text
=== Bundle Example ===
تم تحميل الحزم من المجلد resources/bundles/: core, menu
اسم التطبيق: BundleDemo
الثيم: forest
اللغة الحالية: ar

أهلاً بك في مثال Bundle المحمّل من عدة مجلدات
- ابدأ الاستخدام
- الإعدادات
- خروج
```

### 8) شرح لماذا هذا المثال يمثل هذا المفهوم
لأن البرنامج لا يحمل الإعدادات أو القائمة من الكود نفسه، بل يجمعها من عدة مجلدات داخل `resources/bundles/`. يمكن إضافة bundle جديد أو حذف واحد موجود بدون إعادة ترجمة البرنامج.

## القسم الثاني: Plugin

### 1) تعريف سريع بالمفهوم
`plugin` يعني أن البرنامج الرئيسي يحمّل سلوكًا إضافيًا وقت التشغيل من مكتبة منفصلة، بدل أن يكون كل شيء مضمّنًا في التنفيذي الأساسي.

### 2) هيكل المجلدات
```text
docs/examples/std-cpp-systems/plugin-project/
├── src/
│   ├── main.cpp
│   └── plugin_api.hpp
└── plugins/
    ├── sample_plugin.cpp
    └── logger_plugin.cpp
```

### 3) محتوى كل ملف
- `src/plugin_api.hpp`: الواجهة المشتركة بين التطبيق والإضافة.
- `src/main.cpp`: البرنامج الرئيسي الذي يفحص مجلد `plugins/` ويحمّل كل إضافة صالحة بداخله.
- `plugins/sample_plugin.cpp`: إضافة ترحيب بسيطة.
- `plugins/logger_plugin.cpp`: إضافة ثانية مستقلة لإيضاح التحميل الجماعي.

### 4) الكود الكامل
الملفات موجودة هنا:
[main.cpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/plugin-project/src/main.cpp)
[plugin_api.hpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/plugin-project/src/plugin_api.hpp)
[sample_plugin.cpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/plugin-project/plugins/sample_plugin.cpp)
[logger_plugin.cpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/plugin-project/plugins/logger_plugin.cpp)

### 5) أمر البناء
Linux:
```bash
cd docs/examples/std-cpp-systems/plugin-project
mkdir -p plugins
g++ -std=c++17 -fPIC -shared plugins/sample_plugin.cpp -o plugins/libsample_plugin.so
g++ -std=c++17 -fPIC -shared plugins/logger_plugin.cpp -o plugins/liblogger_plugin.so
g++ -std=c++17 src/main.cpp -ldl -o plugin_demo
```

macOS:
```bash
cd docs/examples/std-cpp-systems/plugin-project
mkdir -p plugins
clang++ -std=c++17 -dynamiclib plugins/sample_plugin.cpp -o plugins/libsample_plugin.dylib
clang++ -std=c++17 -dynamiclib plugins/logger_plugin.cpp -o plugins/liblogger_plugin.dylib
clang++ -std=c++17 src/main.cpp -o plugin_demo
```

Windows:
```powershell
cd docs/examples/std-cpp-systems/plugin-project
g++ -std=c++17 -shared plugins/sample_plugin.cpp -o plugins/sample_plugin.dll
g++ -std=c++17 -shared plugins/logger_plugin.cpp -o plugins/logger_plugin.dll
g++ -std=c++17 src/main.cpp -o plugin_demo.exe
```

### 6) أمر التشغيل
Linux:
```bash
./plugin_demo
```

macOS:
```bash
./plugin_demo
```

Windows:
```powershell
.\plugin_demo.exe
```

### 7) الناتج المتوقع
```text
=== Plugin Example ===
البحث عن الإضافات داخل: ./plugins
عدد الإضافات المحمّلة: 2
تم تحميل Plugin من الملف: liblogger_plugin.dylib باسم: LoggerPlugin
LoggerPlugin: يسجل رسالة تنفيذ تجريبية من إضافة مستقلة.
تم تحميل Plugin من الملف: libsample_plugin.dylib باسم: SamplePlugin
SamplePlugin: يضيف رسالة ترحيب قادمة من مكتبة مستقلة.
```

### 8) شرح لماذا هذا المثال يمثل هذا المفهوم
لأن التطبيق الرئيسي لا يعرف تنفيذ الإضافات داخليًا، بل يفتح كل مكتبة يجدها داخل `plugins/` وقت التشغيل ويستدعي دوالها. هذا يوضح إضافة أكثر من plugin عبر مجلد واحد بدون إعادة بناء البرنامج الرئيسي.

## القسم الثالث: Package

### 1) تعريف سريع بالمفهوم
`package` هنا يعني مجلد توزيع نهائي جاهز للتشغيل يحتوي التنفيذي مع ملفاته المرافقة في نفس المكان.

### 2) هيكل المجلدات
```text
docs/examples/std-cpp-systems/package-project/
├── src/
│   └── main.cpp
├── data/
│   ├── app.cfg
│   └── banner.txt
└── scripts/
    └── package.sh
```

### 3) محتوى كل ملف
- `src/main.cpp`: يقرأ ملفات التوزيع من `data/`.
- `data/app.cfg`: إعداد بسيط.
- `data/banner.txt`: نص يظهر عند التشغيل.
- `scripts/package.sh`: يبني مجلد التوزيع الجاهز.

### 4) الكود الكامل
الملفات موجودة هنا:
[main.cpp](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/package-project/src/main.cpp)
[app.cfg](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/package-project/data/app.cfg)
[banner.txt](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/package-project/data/banner.txt)
[package.sh](/Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/package-project/scripts/package.sh)

### 5) أمر البناء
Linux:
```bash
cd docs/examples/std-cpp-systems/package-project
sh scripts/package.sh
```

macOS:
```bash
cd docs/examples/std-cpp-systems/package-project
mkdir -p dist/package-demo/data
clang++ -std=c++17 src/main.cpp -o dist/package-demo/package_demo
cp data/app.cfg dist/package-demo/data/app.cfg
cp data/banner.txt dist/package-demo/data/banner.txt
```

Windows:
```powershell
cd docs/examples/std-cpp-systems/package-project
g++ -std=c++17 src/main.cpp -o dist/package-demo/package_demo.exe
copy data\\app.cfg dist\\package-demo\\data\\app.cfg
copy data\\banner.txt dist\\package-demo\\data\\banner.txt
```

### 6) أمر التشغيل
Linux:
```bash
cd dist/package-demo
./package_demo
```

macOS:
```bash
cd dist/package-demo
./package_demo
```

Windows:
```powershell
cd dist\package-demo
.\package_demo.exe
```

### 7) الناتج المتوقع
```text
=== Package Example ===
تم العثور على ملفات package داخل مجلد التوزيع الجاهز.

Package Demo
============
هذا الملف جزء من حزمة التوزيع النهائية.
```

### 8) شرح لماذا هذا المثال يمثل هذا المفهوم
لأن الهدف هنا ليس تحميل كود خارجي مثل `plugin`، ولا قراءة موارد مفهومية فقط مثل `bundle`، بل تجهيز مجلد توزيع نهائي يحوي التنفيذي وملفاته اللازمة معًا.

## مقارنة مختصرة جدًا

- `bundle`: يجمع الموارد والبيانات المرافقة للبرنامج.
- `plugin`: يضيف سلوكًا جديدًا وقت التشغيل من مكتبة مستقلة.
- `package`: يجمع التنفيذي وملفاته في مجلد توزيع جاهز للتشغيل.

## أوامر تشغيل الأمثلة

```bash
cd /Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/bundle-project && ./bundle_demo
cd /Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/plugin-project && ./plugin_demo
cd /Users/abdulkafi/Downloads/GraphicsProgrammingAtlas/docs/examples/std-cpp-systems/package-project/dist/package-demo && ./package_demo
```
