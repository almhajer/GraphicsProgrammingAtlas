const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, '..', 'data', 'ui', 'cpp');

const keywordSet = new Set(['auto','const','nullptr','if','else','for','while','return','throw','namespace','using','typedef','typename','template','static','inline','do','extern','new','this','friend','virtual','override','final','mutable','noexcept','union','delete','operator','goto','sizeof','alignas','alignof','decltype','consteval','constinit','requires','concept','switch','case','default','break','continue','try','catch','enum','public','private','explicit','export','thread_local','volatile','protected','class','register','bool','int','true','false','static_cast','dynamic_cast','const_cast','reinterpret_cast','import','module','char','float','double','unsigned','long','short','signed','co_await','co_return','co_yield','asm','static_assert','struct','constexpr']);

const typeSet = new Set(['int64_t','char8_t','char16_t','char32_t','int8_t','uint8_t','int16_t','uint16_t','wchar_t','ptrdiff_t','size_t']);

function loadGuidesFile(fileName) {
  return JSON.parse(fs.readFileSync(path.join(guidesDir, fileName), 'utf8'));
}

function saveGuidesFile(fileName, data) {
  fs.writeFileSync(path.join(guidesDir, fileName), JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function getTargetFile(key) {
  if (keywordSet.has(key)) return 'reference-guides-kw-a.json';
  if (typeSet.has(key)) return 'reference-guides-stdlib.json';
  return 'reference-guides-stdlib.json';
}

const newGuides = {
"void": {
  meaning: "نوع يعني «لا قيمة مرجعة». لا يُستخدم لتعريف متغيرات، بل يُعلن أن الدالة لا تُرجع شيئًا. يوجد أيضًا كنوع مؤشر `void*` يشير إلى بيانات غير معروفة النوع.",
  usage: "كقيمة مرجعة للدوال التي تنفذ أمرًا دون إرجاع نتيجة، أو كمعامل في قالب لتمثيل «عدم وجود نوع».",
  commonMistake: "محاولة تعريف متغير من نوع `void` مباشرةً: `void x;` هذا خطأ ترجمة.",
  examples: [
    {title: "دالة بسيطة لا تُرجع قيمة", code: "#include <iostream>\n\nvoid greet(const char* name) {\n    std::cout << \"مرحبًا \" << name << \"\\n\";\n}\n\nint main() {\n    greet(\"أحمد\");\n    return 0;\n}"},
    {title: "void* كمؤشر عام النوع", code: "#include <iostream>\n\nint main() {\n    int x = 42;\n    void* ptr = &x;\n    int* intPtr = static_cast<int*>(ptr);\n    std::cout << *intPtr << \"\\n\";\n    return 0;\n}"},
    {title: "خطأ شائع: محاولة استخدام void كمتغير", code: "#include <iostream>\n\nint main() {\n    // void x = 5;  // خطأ: لا يمكن تعريف متغير void\n    void* p = nullptr; // صحيح - مؤشر void مسموح\n    if (p == nullptr) {\n        std::cout << \"المؤشر فارغ\\n\";\n    }\n    return 0;\n}"}
  ]
},
"size_t": {
  meaning: "نوع صحيح بدون إشارة يُستخدم لتمثيل الأحجام والعدادات. حجمه يعتمد على المنصة (عادةً 64-bit على الأنظمة الحديثة). مُعرَّف في `<cstddef>`.",
  usage: "كل دالة تُرجع حجمًا أو عددًا عناصر تُرجع `size_t`: `sizeof`، `std::vector::size()`، `strlen()` وغيرها.",
  commonMistake: "استخدام `int` بدل `size_t` للمقارنة مع القيم المرجعة من `.size()` مما قد يسبب تحذيرات أو سلوكًا خاطئًا.",
  examples: [
    {title: "استخدامه مع حجم المصفوفة", code: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {10, 20, 30};\n    size_t count = nums.size();\n    std::cout << \"عدد العناصر: \" << count << \"\\n\";\n    return 0;\n}"},
    {title: "خطأ شائع: مقارنة int مع size_t", code: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n    for (size_t i = 0; i < v.size(); ++i) {\n        std::cout << v[i] << \" \";\n    }\n    return 0;\n}"},
    {title: "استخدامه مع sizeof", code: "#include <iostream>\n\nint main() {\n    double arr[] = {1.1, 2.2, 3.3};\n    size_t bytes = sizeof(arr);\n    size_t elemSize = sizeof(arr[0]);\n    size_t count = bytes / elemSize;\n    std::cout << \"عناصر: \" << count << \"\\n\";\n    return 0;\n}"}
  ]
},
"uint32_t": {
  meaning: "نوع صحيح بدون إشارة بحجم 32 بت بالضبط. يخزن قيمًا من `0` إلى `4294967295`. مُعرَّف في `<cstdint>`.",
  usage: "عند الحاجة لحجم ثابت ومضمون: بروتوكولات الشبكة، تنسيقات الملفات، معالجة الصور.",
  commonMistake: "استخدام `unsigned int` بدلًا منه عندما تحتاج حجمًا مضمونًا؛ `unsigned int` قد يكون 16 أو 32 بت حسب المنصة.",
  examples: [
    {title: "تعريف واستخدام أساسي", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint32_t pixel = 0xFF00FF00;\n    std::cout << \"القيمة: \" << pixel << \"\\n\";\n    std::cout << \"الحد الأقصى: \" << UINT32_MAX << \"\\n\";\n    return 0;\n}"},
    {title: "تمثيل ألوان RGBA", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint32_t color = 0;\n    uint8_t r = 255, g = 128, b = 0, a = 255;\n    color = (a << 24) | (b << 16) | (g << 8) | r;\n    std::cout << \"لون: 0x\" << std::hex << color << \"\\n\";\n    return 0;\n}"},
    {title: "الانقلاب عند التجاوز", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint32_t max = UINT32_MAX;\n    uint32_t overflow = max + 1;\n    std::cout << \"بعد التجاوز: \" << overflow << \"\\n\";\n    return 0;\n}"}
  ]
},
"uint64_t": {
  meaning: "نوع صحيح بدون إشارة بحجم 64 بت بالضبط. يخزن قيمًا من `0` إلى `18446744073709551615`. مُعرَّف في `<cstdint>`.",
  usage: "أرقام كبيرة جدًا: حجم ملفات ضخمة، طوابع زمنية، معرّفات فريدة، عمليات تشفير.",
  commonMistake: "نسيان لاحقة `ULL` عند كتابة أرقام حرفية كبيرة.",
  examples: [
    {title: "تعريف مع لاحقة ULL", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint64_t big = 18446744073709551615ULL;\n    std::cout << \"الحد الأقصى: \" << UINT64_MAX << \"\\n\";\n    return 0;\n}"},
    {title: "حساب حجم ملف ضخم", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint64_t fileSize = 15ULL * 1024 * 1024 * 1024;\n    std::cout << \"حجم الملف: \" << fileSize << \" بايت\\n\";\n    return 0;\n}"},
    {title: "طابع زمني يونيكس", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint64_t timestampMs = 1700000000000ULL;\n    uint64_t seconds = timestampMs / 1000;\n    std::cout << \"الثواني: \" << seconds << \"\\n\";\n    return 0;\n}"}
  ]
},
"int32_t": {
  meaning: "نوع صحيح بإشارة بحجم 32 بت بالضبط. يخزن قيمًا من `-2147483648` إلى `2147483647`. مُعرَّف في `<cstdint>`.",
  usage: "حجم مضمون ومستقل عن المنصة: بيانات صوتية، إحداثيات، بروتوكولات ثنائية.",
  commonMistake: "افتراض أن `int` دائمًا 32 بت؛ هذا صحيح على أغلب الأنظمة لكن ليس مضمونًا من المعيار.",
  examples: [
    {title: "تعريف واستخدام أساسي", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int32_t x = 100000;\n    int32_t y = -200000;\n    std::cout << \"المجموع: \" << x + y << \"\\n\";\n    std::cout << \"الحد الأدنى: \" << INT32_MIN << \"\\n\";\n    return 0;\n}"},
    {title: "تمثيل إحداثيات", code: "#include <iostream>\n#include <cstdint>\n\nstruct Point { int32_t x; int32_t y; };\n\nint main() {\n    Point p{-400, 300};\n    std::cout << \"(\" << p.x << \", \" << p.y << \")\\n\";\n    return 0;\n}"},
    {title: "تجاوز الحد (UB)", code: "#include <iostream>\n#include <cstdint>\n#include <climits>\n\nint main() {\n    int32_t a = INT32_MAX;\n    int32_t b = a + 1; // سلوك غير معرّف!\n    std::cout << \"تجاوز: \" << b << \"\\n\";\n    return 0;\n}"}
  ]
},
"int64_t": {
  meaning: "نوع صحيح بإشارة بحجم 64 بت بالضبط. يخزن قيمًا من `-9223372036854775808` إلى `9223372036854775807`. مُعرَّف في `<cstdint>`.",
  usage: "أرقام كبيرة تتجاوز 32 بت: حسابات مالية دقيقة، وقت بالنانو ثانية.",
  commonMistake: "نسيان لاحقة `LL` عند كتابة أرقام حرفية سالبة كبيرة.",
  examples: [
    {title: "تعريف مع لاحقة LL", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int64_t big = -9223372036854775807LL;\n    std::cout << \"الحد الأقصى: \" << INT64_MAX << \"\\n\";\n    return 0;\n}"},
    {title: "حساب وقت بالنانو ثانية", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int64_t ns = 2500000000LL;\n    double sec = ns / 1e9;\n    std::cout << sec << \" ثانية\\n\";\n    return 0;\n}"},
    {title: "حسابات مالية آمنة", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int64_t p1 = 999999999LL;\n    int64_t p2 = 999999999LL;\n    int64_t total = p1 + p2;\n    std::cout << \"المجموع: \" << total << \" سنت\\n\";\n    return 0;\n}"}
  ]
},
"std::shared_ptr": {
  meaning: "مؤشر ذكي يملك الكائن بشكل مشترك. يحذف الكائن عند اختفاء آخر `shared_ptr` يشير إليه عبر عداد مرجعي داخلي.",
  usage: "عندما تحتاج عدة أجزاء مشاركة ملكية نفس الكائن مع ضمان الحذف التلقائي.",
  commonMistake: "حلقات مرجعية تمنع الحذف. الحل: `std::weak_ptr` لكسر الحلقة.",
  examples: [
    {title: "ملكية مشتركة أساسية", code: "#include <iostream>\n#include <memory>\n\nint main() {\n    auto p1 = std::make_shared<int>(42);\n    std::cout << \"مراجع: \" << p1.use_count() << \"\\n\";\n    auto p2 = p1;\n    std::cout << \"مراجع: \" << p1.use_count() << \"\\n\";\n    p2.reset();\n    std::cout << \"مراجع: \" << p1.use_count() << \"\\n\";\n    return 0;\n}"},
    {title: "مع كائن مخصص", code: "#include <iostream>\n#include <memory>\n#include <string>\n\nstruct Node {\n    std::string name;\n    Node(const std::string& n) : name(n) { std::cout << \"إنشاء: \" << name << \"\\n\"; }\n    ~Node() { std::cout << \"حذف: \" << name << \"\\n\"; }\n};\n\nvoid process(std::shared_ptr<Node> node) {\n    std::cout << \"معالجة: \" << node->name << \"\\n\";\n}\n\nint main() {\n    auto n = std::make_shared<Node>(\"عقدة\");\n    process(n);\n    return 0;\n}"},
    {title: "حلقة مرجعية والحل", code: "#include <iostream>\n#include <memory>\n\nstruct B;\nstruct A { std::shared_ptr<B> bPtr; ~A() { std::cout << \"حذف A\\n\"; } };\nstruct B { std::weak_ptr<A> aPtr; ~B() { std::cout << \"حذف B\\n\"; } };\n\nint main() {\n    auto a = std::make_shared<A>();\n    auto b = std::make_shared<B>();\n    a->bPtr = b;\n    b->aPtr = a;\n    return 0;\n}"}
  ]
},
"std::make_unique": {
  meaning: "دالة مصنعية تُنشئ `std::unique_ptr` مع تخصيص الذاكرة في خطوة واحدة. أكثر أمانًا من `new` المباشر.",
  usage: "الطريقة المفضلة دائمًا لإنشاء `unique_ptr`.",
  commonMistake: "استخدام `std::unique_ptr<T>(new T(...))` بدلًا من `std::make_unique<T>(...)`.",
  examples: [
    {title: "إنشاء أساسي", code: "#include <iostream>\n#include <memory>\n\nint main() {\n    auto ptr = std::make_unique<int>(100);\n    std::cout << *ptr << \"\\n\";\n    return 0;\n}"},
    {title: "مع كائن ومعاملات", code: "#include <iostream>\n#include <memory>\n#include <string>\n\nstruct Widget {\n    std::string name;\n    int value;\n    Widget(const std::string& n, int v) : name(n), value(v) {}\n};\n\nint main() {\n    auto w = std::make_unique<Widget>(\"أداة\", 42);\n    std::cout << w->name << \": \" << w->value << \"\\n\";\n    return 0;\n}"},
    {title: "لماذا أفضل من new", code: "#include <iostream>\n#include <memory>\n\nint main() {\n    // خطر: std::unique_ptr<int>(new int(5))\n    // آمن: make_unique يمنع التسرب حتى مع الاستثناءات\n    auto ptr = std::make_unique<int>(5);\n    std::cout << *ptr << \"\\n\";\n    return 0;\n}"}
  ]
},
"std::make_shared": {
  meaning: "دالة مصنعية تُنشئ `std::shared_ptr` مع تخصيص الكائن والعداد المرجعي في تخصيص واحد.",
  usage: "الطريقة المفضلة لإنشاء `shared_ptr`.",
  commonMistake: "استخدام `new` مباشرة مع `shared_ptr` يخصص الذاكرة مرتين.",
  examples: [
    {title: "إنشاء أساسي", code: "#include <iostream>\n#include <memory>\n\nint main() {\n    auto p = std::make_shared<double>(3.14);\n    std::cout << *p << \"\\n\";\n    std::cout << \"مراجع: \" << p.use_count() << \"\\n\";\n    return 0;\n}"},
    {title: "مشاركة بين دوال", code: "#include <iostream>\n#include <memory>\n\nstruct Config { int timeout = 30; bool debug = false; };\n\nvoid worker(std::shared_ptr<Config> cfg) {\n    std::cout << \"مهلة: \" << cfg->timeout << \"\\n\";\n}\n\nint main() {\n    auto cfg = std::make_shared<Config>();\n    cfg->debug = true;\n    worker(cfg);\n    return 0;\n}"},
    {title: "مقارنة الأداء", code: "#include <iostream>\n#include <memory>\n\nstruct Big { int data[1000]; };\n\nint main() {\n    auto p1 = std::make_shared<Big>(); // تخصيص واحد\n    auto p2 = std::shared_ptr<Big>(new Big()); // تخصيصان\n    std::cout << \"make_shared أسرع\\n\";\n    return 0;\n}"}
  ]
},
"std::runtime_error": {
  meaning: "استثناء يُستخدم للأخطاء المكتشفة أثناء التنفيذ. يرث من `std::exception` ويخزن رسالة نصية.",
  usage: "أخطاء لا يمكن التنبؤ بها وقت الترجمة: فشل ملف، اتصال شبكة، قيمة غير صالحة.",
  commonMistake: "رميه بدلًا من نوع استثناء أكثر تحديدًا عند وجود فئة مناسبة.",
  examples: [
    {title: "رمي والتهام أساسي", code: "#include <iostream>\n#include <stdexcept>\n\nint divide(int a, int b) {\n    if (b == 0) throw std::runtime_error(\"القسمة على صفر!\");\n    return a / b;\n}\n\nint main() {\n    try { divide(10, 0); }\n    catch (const std::runtime_error& e) { std::cout << e.what() << \"\\n\"; }\n    return 0;\n}"},
    {title: "التحقق من مدخلات", code: "#include <iostream>\n#include <stdexcept>\n#include <string>\n\nvoid setAge(int age) {\n    if (age < 0 || age > 150) throw std::runtime_error(\"عمر غير صالح: \" + std::to_string(age));\n    std::cout << \"العمر: \" << age << \"\\n\";\n}\n\nint main() {\n    try { setAge(-5); }\n    catch (const std::runtime_error& e) { std::cout << e.what() << \"\\n\"; }\n    return 0;\n}"},
    {title: "التهام كـ exception عام", code: "#include <iostream>\n#include <stdexcept>\n\nint main() {\n    try { throw std::runtime_error(\"خطر!\"); }\n    catch (const std::exception& e) { std::cout << e.what() << \"\\n\"; }\n    return 0;\n}"}
  ]
},
"std::map": {
  meaning: "حاوية ترابطية تُخزن أزواج مفتاح-قيمة مرتبة حسب المفتاح. البحث بتعقيد O(log n).",
  usage: "ربط قيم بمفاتيح فريدة مع ترتيب: قواميس، جداول رموز، إعدادات.",
  commonMistake: "استخدام `[]` للبحث عن مفتاح غير موجود يُنشئ عنصرًا جديدًا. استخدم `find()`.",
  examples: [
    {title: "إضافة وبحث أساسي", code: "#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> ages;\n    ages[\"أحمد\"] = 25;\n    ages.insert({\"سارة\", 30});\n    std::cout << \"أحمد: \" << ages[\"أحمد\"] << \"\\n\";\n    return 0;\n}"},
    {title: "البحث الآمن بـ find()", code: "#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"رياضيات\"] = 90;\n    auto it = scores.find(\"كيمياء\");\n    if (it != scores.end()) std::cout << it->second << \"\\n\";\n    else std::cout << \"غير موجودة\\n\";\n    return 0;\n}"},
    {title: "المرور على العناصر", code: "#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, int> fruits;\n    fruits[\"موز\"] = 5;\n    fruits[\"تفاح\"] = 3;\n    for (const auto& [name, count] : fruits) {\n        std::cout << name << \": \" << count << \"\\n\";\n    }\n    return 0;\n}"}
  ]
},
"std::pair": {
  meaning: "بنية تُخزن زوجًا من قيمتين. الوصول عبر `.first` و`.second`. مُعرَّف في `<utility>`.",
  usage: "إرجاع قيمتين من دالة، أو كعنصر في `std::map`.",
  commonMistake: "نسيان أن `std::map::value_type` هو `std::pair`.",
  examples: [
    {title: "إنشاء واستخدام", code: "#include <iostream>\n#include <utility>\n#include <string>\n\nint main() {\n    std::pair<std::string, int> person{\"أحمد\", 25};\n    std::cout << person.first << \": \" << person.second << \"\\n\";\n    return 0;\n}"},
    {title: "إرجاع قيمتين", code: "#include <iostream>\n#include <utility>\n\nstd::pair<int, int> divRem(int a, int b) { return {a / b, a % b}; }\n\nint main() {\n    auto [q, r] = divRem(17, 5);\n    std::cout << \"قسمة: \" << q << \" باقي: \" << r << \"\\n\";\n    return 0;\n}"},
    {title: "مع std::map", code: "#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<std::string, double> prices;\n    prices[\"حليب\"] = 5.5;\n    for (const auto& [k, v] : prices) {\n        std::cout << k << \": \" << v << \"\\n\";\n    }\n    return 0;\n}"}
  ]
},
"std::function": {
  meaning: "غلاف عام لأي كائن قابل للاستدعاء. يخزن النوع ويوفر واجهة موحدة.",
  usage: "تخزين أو تمرير دوال من أنواع مختلفة: ردادات، جداول دوال، أنماط استراتيجية.",
  commonMistake: "استخدامه عندما يكون `template` كافيًا؛ له كلفة تخصيص كومة محتمل.",
  examples: [
    {title: "تخزين لامدا ودالة", code: "#include <iostream>\n#include <functional>\n\nint add(int a, int b) { return a + b; }\n\nint main() {\n    std::function<int(int,int)> op = add;\n    std::cout << op(3,4) << \"\\n\";\n    op = [](int a, int b) { return a * b; };\n    std::cout << op(3,4) << \"\\n\";\n    return 0;\n}"},
    {title: "نظام ردادات", code: "#include <iostream>\n#include <functional>\n#include <vector>\n#include <string>\n\nclass EventBus {\n    std::vector<std::function<void(const std::string&)>> listeners;\npublic:\n    void on(std::function<void(const std::string&)> cb) { listeners.push_back(std::move(cb)); }\n    void emit(const std::string& e) { for (auto& cb : listeners) cb(e); }\n};\n\nint main() {\n    EventBus bus;\n    bus.on([](const std::string& e) { std::cout << \"1: \" << e << \"\\n\"; });\n    bus.emit(\"نقر\");\n    return 0;\n}"},
    {title: "مقارنة مع القالب", code: "#include <iostream>\n#include <functional>\n\ntemplate<typename F> void callFast(F f) { f(); }\nvoid callFlex(std::function<void()> f) { f(); }\n\nint main() {\n    callFast([]{ std::cout << \"سريع\\n\"; });\n    callFlex([]{ std::cout << \"مرن\\n\"; });\n    return 0;\n}"}
  ]
},
"std::atomic": {
  meaning: "قالب يوفر عمليات ذرية لا تُقاطع: إما تتم بالكامل أو لا تتم.",
  usage: "حماية متغيرات مشتركة بين خيوط دون `std::mutex`: عدادات، أعلام.",
  commonMistake: "استخدامه مع أنواع معقدة كـ `std::string`؛ يعمل مع الأنواع البسيطة فقط.",
  examples: [
    {title: "عداد ذري", code: "#include <iostream>\n#include <atomic>\n#include <thread>\n#include <vector>\n\nint main() {\n    std::atomic<int> counter{0};\n    std::vector<std::thread> threads;\n    for (int i = 0; i < 10; ++i)\n        threads.emplace_back([&]() { for (int j = 0; j < 1000; ++j) counter.fetch_add(1, std::memory_order_relaxed); });\n    for (auto& t : threads) t.join();\n    std::cout << counter.load() << \"\\n\";\n    return 0;\n}"},
    {title: "علم توقف", code: "#include <iostream>\n#include <atomic>\n#include <thread>\n\nint main() {\n    std::atomic<bool> running{true};\n    std::thread worker([&]() { while (running.load()) {} std::cout << \"توقف\\n\"; });\n    running.store(false);\n    worker.join();\n    return 0;\n}"},
    {title: "مع وبدون atomic", code: "#include <iostream>\n#include <atomic>\n#include <thread>\n\nint main() {\n    int unsafe = 0;\n    std::atomic<int> safe{0};\n    std::thread t1([&]() { for(int i=0;i<100000;++i) { unsafe++; safe++; } });\n    std::thread t2([&]() { for(int i=0;i<100000;++i) { unsafe++; safe++; } });\n    t1.join(); t2.join();\n    std::cout << \"غير آمن: \" << unsafe << \" آمن: \" << safe.load() << \"\\n\";\n    return 0;\n}"}
  ]
},
"std::thread": {
  meaning: "كائن يمثل خيط تنفيذ مستقل ينفذ دالة بالتوازي مع الخيط الرئيسي.",
  usage: "مهام بالتوازي: معالجة بيانات، إدخال/إخراج متزامن، حوسبة متوازية.",
  commonMistake: "نسيان `join()` أو `detach()` قبل تدمير الكائن يُسبب `std::terminate`.",
  examples: [
    {title: "إنشاء خيط أساسي", code: "#include <iostream>\n#include <thread>\n\nvoid task(const std::string& msg) { std::cout << msg << \"\\n\"; }\n\nint main() {\n    std::thread t(task, \"مرحبًا من الخيط!\");\n    t.join();\n    return 0;\n}"},
    {title: "خيوط متعددة", code: "#include <iostream>\n#include <thread>\n#include <vector>\n\nint main() {\n    std::vector<std::thread> threads;\n    for (int i = 0; i < 4; ++i)\n        threads.emplace_back([i]() { std::cout << \"خيط \" << i << \"\\n\"; });\n    for (auto& t : threads) t.join();\n    return 0;\n}"},
    {title: "حماية بـ RAII", code: "#include <iostream>\n#include <thread>\n\nclass ThreadGuard {\n    std::thread& th;\npublic:\n    ThreadGuard(std::thread& t) : th(t) {}\n    ~ThreadGuard() { if (th.joinable()) th.join(); }\n};\n\nint main() {\n    std::thread t([](){ std::cout << \"آمن\\n\"; });\n    ThreadGuard g(t);\n    return 0;\n}"}
  ]
},
"std::mutex": {
  meaning: "آلية قفل تضمن أن خيطًا واحدًا فقط يدخل قسمًا حاسمًا في نفس اللحظة.",
  usage: "حماية بيانات مشتركة عند الحاجة لعمليات معقدة لا يمكن أن تكون ذرية.",
  commonMistake: "قفل الموت (deadlock): اقفل دائمًا بنفس الترتيب.",
  examples: [
    {title: "قفل مع lock_guard", code: "#include <iostream>\n#include <mutex>\n#include <thread>\n\nstd::mutex mtx;\nint shared = 0;\nvoid inc(int id) { std::lock_guard<std::mutex> lk(mtx); shared++; std::cout << id << \": \" << shared << \"\\n\"; }\n\nint main() {\n    std::thread t1(inc, 1); std::thread t2(inc, 2);\n    t1.join(); t2.join();\n    return 0;\n}"},
    {title: "unique_lock للتحكم اليدوي", code: "#include <iostream>\n#include <mutex>\n#include <thread>\n\nstd::mutex mtx;\nvoid flex(int id) {\n    std::unique_lock<std::mutex> lk(mtx);\n    std::cout << id << \" بدأ\\n\";\n    lk.unlock();\n    lk.lock();\n    std::cout << id << \" انتهى\\n\";\n}\n\nint main() {\n    std::thread t1(flex, 1); std::thread t2(flex, 2);\n    t1.join(); t2.join();\n    return 0;\n}"},
    {title: "تجنب deadlock", code: "#include <iostream>\n#include <mutex>\n#include <thread>\n\nstd::mutex a, b;\nvoid safe(int id) {\n    std::lock(a, b);\n    std::lock_guard<std::mutex> l1(a, std::adopt_lock);\n    std::lock_guard<std::mutex> l2(b, std::adopt_lock);\n    std::cout << id << \" آمن\\n\";\n}\n\nint main() {\n    std::thread t1(safe, 1); std::thread t2(safe, 2);\n    t1.join(); t2.join();\n    return 0;\n}"}
  ]
},
"static_assert": {
  meaning: "تأكيد يُفحص وقت الترجمة. شرط `false` يُنتج خطأ ترجمة. لا يُنتج كود تنفيذي.",
  usage: "التحقق من شروط الترجمة: أحجام الأنواع، توافق القوالب.",
  commonMistake: "استخدامه مع شرط يعتمد على قيمة وقت التنفيذ.",
  examples: [
    {title: "التحقق من حجم نوع", code: "#include <iostream>\n#include <cstdint>\n\nstatic_assert(sizeof(int) == 4, \"int يجب أن يكون 4 بايت\");\nint main() { std::cout << \"OK\\n\"; return 0; }"},
    {title: "مع القوالب", code: "#include <iostream>\n\ntemplate<typename T>\nvoid process() {\n    static_assert(sizeof(T) <= 8, \"النوع كبير جدًا\");\n    std::cout << \"حجم: \" << sizeof(T) << \"\\n\";\n}\n\nint main() { process<int>(); process<double>(); return 0; }"},
    {title: "بدون رسالة C++17", code: "#include <iostream>\n#include <type_traits>\n\nint main() {\n    static_assert(std::is_integral_v<int>);\n    std::cout << \"OK\\n\";\n    return 0;\n}"}
  ]
},
"char8_t": {
  meaning: "نوع حرف 8 بت لـ UTF-8. أُضيف في C++20 لفصل UTF-8 عن `char`.",
  usage: "نصوص UTF-8 صريحة مع التمييز عن `char` العادي.",
  commonMistake: "الخلط بين `char8_t` و`char`؛ نوعان مختلفان رغم نفس الحجم.",
  examples: [
    {title: "سلسلة UTF-8", code: "#include <iostream>\n\nint main() {\n    const char8_t* utf8 = u8\"مرحبًا\";\n    std::cout << \"عنوان: \" << (const void*)utf8 << \"\\n\";\n    return 0;\n}"},
    {title: "الفرق عن char", code: "#include <iostream>\n#include <type_traits>\n\nint main() {\n    static_assert(!std::is_same_v<char, char8_t>);\n    static_assert(sizeof(char) == sizeof(char8_t));\n    return 0;\n}"},
    {title: "مع std::string", code: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s = u8\"نص عربي\";\n    std::cout << s << \"\\n\";\n    return 0;\n}"}
  ]
},
"char16_t": {
  meaning: "نوع حرف 16 بت لـ UTF-16. سلاسل `u\"...\"` تستخدمه.",
  usage: "واجهات تتطلب UTF-16 مثل Windows API.",
  commonMistake: "استخدامه لنصوص UTF-8 أو UTF-32.",
  examples: [
    {title: "سلسلة UTF-16", code: "#include <iostream>\n\nint main() {\n    const char16_t* str = u\"Hello\";\n    std::cout << \"حجم: \" << sizeof(char16_t) << \"\\n\";\n    return 0;\n}"},
    {title: "التحقق من الحجم", code: "#include <iostream>\n#include <type_traits>\n\nint main() {\n    static_assert(sizeof(char16_t) == 2);\n    static_assert(!std::is_same_v<char16_t, wchar_t>);\n    return 0;\n}"},
    {title: "أنواع السلاسل المختلفة", code: "#include <iostream>\n\nint main() {\n    auto a = \"ANSI\";    // const char*\n    auto c = u\"UTF-16\"; // const char16_t*\n    auto d = U\"UTF-32\"; // const char32_t*\n    std::cout << \"أنواع مختلفة لترميزات مختلفة\\n\";\n    return 0;\n}"}
  ]
},
"char32_t": {
  meaning: "نوع حرف 32 بت لتمثيل أي رمز Unicode واحد مباشرةً.",
  usage: "معالجة رموز Unicode فردية بضمان أن كل عنصر رمز كامل.",
  commonMistake: "افتراض كفاءته للنصوص الطويلة؛ 4 بايت لكل رمز مكلف.",
  examples: [
    {title: "رمز Unicode واحد", code: "#include <iostream>\n\nint main() {\n    char32_t emoji = U'😊';\n    std::cout << \"حجم: \" << sizeof(char32_t) << \" قيمة: \" << (int)emoji << \"\\n\";\n    return 0;\n}"},
    {title: "سلسلة UTF-32", code: "#include <iostream>\n\nint main() {\n    const char32_t* str = U\"AB😊\";\n    std::cout << \"حجم: \" << sizeof(char32_t) << \"\\n\";\n    return 0;\n}"},
    {title: "مقارنة أحجام الأحرف", code: "#include <iostream>\n\nint main() {\n    std::cout << \"char: \" << sizeof(char) << \" char8: \" << sizeof(char8_t) << \" char16: \" << sizeof(char16_t) << \" char32: \" << sizeof(char32_t) << \" wchar: \" << sizeof(wchar_t) << \"\\n\";\n    return 0;\n}"}
  ]
},
"co_await": {
  meaning: "عامل يُعلّق التنفيذ حتى يكتمل كائن awaitable. يُستخدم داخل coroutine. C++20.",
  usage: "كتابة غير متزامنة تشبه المتزامن: شبكة، ملفات، عمليات بطيئة.",
  commonMistake: "استخدامه خارج دالة coroutine؛ هذا خطأ ترجمة.",
  examples: [
    {title: "نمط coroutine أساسي", code: "#include <iostream>\n#include <coroutine>\n\nstruct Awaitable {\n    bool await_ready() const { return false; }\n    void await_suspend(std::coroutine_handle<>) const { std::cout << \"تعليق\\n\"; }\n    int await_resume() const { return 42; }\n};\nstruct Task { struct promise_type { Task get_return_object() { return {}; } std::suspend_never initial_suspend() { return {}; } std::suspend_never final_suspend() noexcept { return {}; } void return_void() {} void unhandled_exception() {} }; };\n\nTask demo() { int r = co_await Awaitable{}; std::cout << \"نتيجة: \" << r << \"\\n\"; }\nint main() { demo(); return 0; }"},
    {title: "متى لا تستخدمه", code: "#include <iostream>\n\nvoid normal() { int r = 42; std::cout << r << \"\\n\"; }\n\nint main() {\n    normal();\n    std::cout << \"لا تستخدم co_await للعمليات السريعة أو بدون مكتبة coroutine\\n\";\n    return 0;\n}"},
    {title: "المتطلبات", code: "#include <iostream>\n\nint main() {\n    std::cout << \"co_await يتطلب:\\n\";\n    std::cout << \"1. دالة coroutine (نوع يُرجع Task/Future)\\n\";\n    std::cout << \"2. كائن awaitable (await_ready/suspend/resume)\\n\";\n    std::cout << \"3. مكتبة coroutine أو تعريف يدوي\\n\";\n    return 0;\n}"}
  ]
},
"co_return": {
  meaning: "عامل يُرجع قيمة من coroutine ويُنهيه بشكل صحيح عبر الوعد (promise).",
  usage: "بديل `return` داخل أي دالة coroutine.",
  commonMistake: "استخدام `return` بدل `co_return` داخل coroutine؛ خطأ ترجمة.",
  examples: [
    {title: "إرجاع قيمة", code: "#include <iostream>\n#include <coroutine>\n\nstruct Task { struct promise_type { int val; Task get_return_object() { return {}; } std::suspend_never initial_suspend() { return {}; } std::suspend_never final_suspend() noexcept { return {}; } void return_value(int v) { val = v; } void unhandled_exception() {} }; };\n\nTask compute() { co_return 30; }\nint main() { compute(); std::cout << \"تم\\n\"; return 0; }"},
    {title: "بدون قيمة", code: "#include <iostream>\n#include <coroutine>\n\nstruct VTask { struct promise_type { VTask get_return_object() { return {}; } std::suspend_never initial_suspend() { return {}; } std::suspend_never final_suspend() noexcept { return {}; } void return_void() {} void unhandled_exception() {} }; };\n\nVTask log() { std::cout << \"رسالة\\n\"; co_return; }\nint main() { log(); return 0; }"},
    {title: "الفرق عن return", code: "#include <iostream>\n\nint normal() { return 42; } // صحيح في دالة عادية\n\nint main() {\n    std::cout << \"return → دالة عادية\\n\";\n    std::cout << \"co_return → coroutine فقط\\n\";\n    return 0;\n}"}
  ]
},
"co_yield": {
  meaning: "عامل يُعلّق coroutine ويُرسل قيمة للمتصل مع حفظ الحالة للاستئناف.",
  usage: "مولدات قيم كسولة: تسلسلات أرقام، قراءة ملف سطرًا بسطر.",
  commonMistake: "استخدامه مع promise لا يدعم `yield_value`.",
  examples: [
    {title: "مولد أرقام", code: "#include <iostream>\n#include <coroutine>\n\nstruct Gen { struct promise_type { int val; Gen get_return_object() { return {}; } std::suspend_always initial_suspend() { return {}; } std::suspend_always final_suspend() noexcept { return {}; } std::suspend_always yield_value(int v) { val = v; return {}; } void return_void() {} void unhandled_exception() {} }; };\n\nGen range(int s, int e) { for (int i = s; i <= e; ++i) co_yield i; }\nint main() { auto g = range(1, 5); std::cout << \"مولد\\n\"; return 0; }"},
    {title: "المفهوم", code: "#include <iostream>\n\nint main() {\n    std::cout << \"co_yield = إرسال + تعليق\\n\";\n    std::cout << \"عند الاستئناف يكمل من السطر التالي\\n\";\n    return 0;\n}"},
    {title: "الفرق عن co_return", code: "#include <iostream>\n\nint main() {\n    std::cout << \"co_yield = تعليق مؤقت (يمكن الاستمرار)\\n\";\n    std::cout << \"co_return = إنهاء نهائي\\n\";\n    return 0;\n}"}
  ]
},
"std::variant": {
  meaning: "حاوية تخزن قيمة من عدة أنواع محتملة. آمنة نوعيًا وبديل حديث لـ `union`.",
  usage: "متغير قد يحمل أنواعًا مختلفة: إعدادات، رسائل، قيم اختيارية.",
  commonMistake: "الوصول بالنوع الخاطئ بـ `std::get` يُلقي استثناء. استخدم `std::visit`.",
  examples: [
    {title: "تعريف واستخدام", code: "#include <iostream>\n#include <variant>\n#include <string>\n\nint main() {\n    std::variant<int, double, std::string> v = \"نص\"s;\n    std::cout << std::get<std::string>(v) << \"\\n\";\n    return 0;\n}"},
    {title: "std::visit", code: "#include <iostream>\n#include <variant>\n#include <string>\n\nstruct Vis { void operator()(int i) const { std::cout << \"int: \" << i << \"\\n\"; } void operator()(double d) const { std::cout << \"dbl: \" << d << \"\\n\"; } void operator()(const std::string& s) const { std::cout << \"str: \" << s << \"\\n\"; } };\n\nint main() {\n    std::variant<int, double, std::string> v = 100;\n    std::visit(Vis{}, v);\n    return 0;\n}"},
    {title: "الوصول الآمن", code: "#include <iostream>\n#include <variant>\n#include <string>\n\nint main() {\n    std::variant<int, std::string> v = \"نص\";\n    if (auto* p = std::get_if<std::string>(&v)) std::cout << *p << \"\\n\";\n    if (std::holds_alternative<std::string>(v)) std::cout << \"يحمل string\\n\";\n    return 0;\n}"}
  ]
},
"std::forward": {
  meaning: "يُمرر المعامل مع الحفاظ على فئته القيمية (lvalue/rvalue). للتمرير المثالي في القوالب.",
  usage: "قوالب دوال بمرجع عالمي `T&&` تمرر لدوال أخرى دون فقدان rvalue.",
  commonMistake: "استخدامه خارج قوالب أو مع نوع محدد؛ فائدته فقط مع `T&&`.",
  examples: [
    {title: "تمرير مثالي", code: "#include <iostream>\n#include <utility>\n#include <string>\n\nvoid process(std::string& s) { std::cout << \"lvalue: \" << s << \"\\n\"; }\nvoid process(std::string&& s) { std::cout << \"rvalue: \" << s << \"\\n\"; }\ntemplate<typename T> void wrap(T&& arg) { process(std::forward<T>(arg)); }\n\nint main() {\n    std::string n = \"عالم\";\n    wrap(n);              // lvalue\n    wrap(std::string(\"مؤقت\")); // rvalue\n    return 0;\n}"},
    {title: "الفرق عن move", code: "#include <iostream>\n#include <utility>\n\nint main() {\n    std::cout << \"move: دائمًا rvalue\\n\";\n    std::cout << \"forward: حسب النوع الأصلي\\n\";\n    return 0;\n}"},
    {title: "متى لا تستخدمه", code: "#include <iostream>\n#include <utility>\n#include <string>\n\nvoid bad(std::string&& s) { std::cout << s << \"\\n\"; }\n\nint main() {\n    std::cout << \"فقط في القوالب مع T&&\\n\";\n    return 0;\n}"}
  ]
},
"std::cerr": {
  meaning: "تيار خرج قياسي للأخطاء (`stderr`). غير مُخزَّن مؤقتًا فتظهر الرسائل فورًا.",
  usage: "رسائل خطأ وتنبيهات فورية حتى لو `std::cout` مُخزَّن.",
  commonMistake: "استخدام `std::cout` لرسائل الخطأ؛ قد لا تظهر فورًا عند التعطل.",
  examples: [
    {title: "رسالة خطأ فورية", code: "#include <iostream>\n\nint main() {\n    std::cerr << \"خطأ: قيمة غير صالحة!\\n\";\n    return 1;\n}"},
    {title: "الفرق عن cout", code: "#include <iostream>\n\nint main() {\n    std::cout << \"عادية\\n\";\n    std::cerr << \"خطأ فوري\\n\";\n    // program > out.txt → cerr يظهر في الطرفية\n    return 0;\n}"},
    {title: "مع استثناءات", code: "#include <iostream>\n#include <stdexcept>\n\nint main() {\n    try { throw std::runtime_error(\"فشل\"); }\n    catch (const std::exception& e) { std::cerr << e.what() << \"\\n\"; return 1; }\n}"}
  ]
},
"int8_t": {
  meaning: "نوع صحيح بإشارة 8 بت. من `-128` إلى `127`. مُعرَّف في `<cstdint>`.",
  usage: "بيانات بايت واحد بإشارة: صوت موقّع، بكسلات، بروتوكولات.",
  commonMistake: "طباعته تُطبع كحرف لا كرقم؛ استخدم `static_cast<int>`.",
  examples: [
    {title: "تعريف واستخدام", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int8_t x = 100;\n    std::cout << static_cast<int>(x) << \"\\n\";\n    return 0;\n}"},
    {title: "التجاوز (UB)", code: "#include <iostream>\n#include <cstdint>\n#include <climits>\n\nint main() {\n    int8_t max = INT8_MAX;\n    int8_t ovf = max + 1; // UB!\n    std::cout << static_cast<int>(ovf) << \"\\n\";\n    return 0;\n}"},
    {title: "الفرق عن char", code: "#include <iostream>\n#include <cstdint>\n#include <type_traits>\n\nint main() {\n    std::cout << \"int8_t == char: \" << std::is_same_v<int8_t, char> << \"\\n\";\n    int8_t num = 65;\n    std::cout << \"كرقم: \" << static_cast<int>(num) << \"\\n\";\n    return 0;\n}"}
  ]
},
"uint8_t": {
  meaning: "نوع صحيح بدون إشارة 8 بت. من `0` إلى `255`. مُعرَّف في `<cstdint>`.",
  usage: "بيانات بايت خام: بكسلات، شبكة، بروتوكولات ثنائية.",
  commonMistake: "نسيان `static_cast<int>` عند الطباعة.",
  examples: [
    {title: "تعريف واستخدام", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint8_t pixel = 200;\n    std::cout << \"بكسل: \" << static_cast<int>(pixel) << \"\\n\";\n    return 0;\n}"},
    {title: "ألوان RGB", code: "#include <iostream>\n#include <cstdint>\n\nstruct Color { uint8_t r, g, b; };\n\nint main() {\n    Color red{255, 0, 0};\n    std::cout << (int)red.r << \",\" << (int)red.g << \",\" << (int)red.b << \"\\n\";\n    return 0;\n}"},
    {title: "انقلاب آمن", code: "#include <iostream>\n#include <cstdint>\n#include <climits>\n\nint main() {\n    uint8_t max = UINT8_MAX;\n    uint8_t w = max + 1; // 0 - سلوك معرّف\n    std::cout << static_cast<int>(w) << \"\\n\";\n    return 0;\n}"}
  ]
},
"int16_t": {
  meaning: "نوع صحيح بإشارة 16 بت. من `-32768` إلى `32767`. مُعرَّف في `<cstdint>`.",
  usage: "صوت 16-bit موقّع، إحداثيات صغيرة، بروتوكولات.",
  commonMistake: "افتراض أن `short` دائمًا 16 بت.",
  examples: [
    {title: "تعريف واستخدام", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int16_t a = 16000;\n    std::cout << a << \" \" << INT16_MAX << \"\\n\";\n    return 0;\n}"},
    {title: "بيانات صوتية", code: "#include <iostream>\n#include <cstdint>\n#include <vector>\n\nint main() {\n    std::vector<int16_t> samples = {-32768, 0, 32767};\n    for (auto s : samples) std::cout << s / 32768.0 << \" \";\n    std::cout << \"\\n\";\n    return 0;\n}"},
    {title: "تحويل أنواع", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    int16_t s = 1000;\n    int32_t b = s; // آمن\n    int8_t t = static_cast<int8_t>(s); // فقدان!\n    std::cout << b << \" \" << static_cast<int>(t) << \"\\n\";\n    return 0;\n}"}
  ]
},
"uint16_t": {
  meaning: "نوع صحيح بدون إشارة 16 بت. من `0` إلى `65535`. مُعرَّف في `<cstdint>`.",
  usage: "منافذ شبكة، أحرف Unicode BMP، بيانات ثنائية.",
  examples: [
    {title: "منافذ شبكة", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint16_t http = 80;\n    uint16_t https = 443;\n    std::cout << http << \" \" << https << \" \" << UINT16_MAX << \"\\n\";\n    return 0;\n}"},
    {title: "عداد دائري", code: "#include <iostream>\n#include <cstdint>\n#include <climits>\n\nint main() {\n    uint16_t c = UINT16_MAX;\n    ++c; // 0\n    std::cout << c << \"\\n\";\n    return 0;\n}"},
    {title: "تعريف أساسي", code: "#include <iostream>\n#include <cstdint>\n\nint main() {\n    uint16_t port = 8080;\n    std::cout << \"المنفذ: \" << port << \"\\n\";\n    return 0;\n}"}
  ]
},
"wchar_t": {
  meaning: "نوع حرف واسع، حجمه يعتمد على المنصة (2 بايت Windows، 4 بايت Linux/macOS).",
  usage: "توافق مع واجهات تستخدم أحرفًا واسعة، خاصة Windows API.",
  commonMistake: "افتراض حجمه ثابت؛ لا يُنصح به في كود جديد متعدد المنصات.",
  examples: [
    {title: "سلسلة واسعة", code: "#include <iostream>\n\nint main() {\n    const wchar_t* s = L\"مرحبًا\";\n    std::wcout << s << \"\\n\";\n    std::cout << \"حجم: \" << sizeof(wchar_t) << \"\\n\";\n    return 0;\n}"},
    {title: "حجمه يختلف", code: "#include <iostream>\n\nint main() {\n    std::cout << \"wchar_t: \" << sizeof(wchar_t) << \" بايت (يختلف بالمنصة)\\n\";\n    return 0;\n}"},
    {title: "البديل الحديث", code: "#include <iostream>\n\nint main() {\n    std::cout << \"استخدم char16_t أو char32_t بدل wchar_t\\n\";\n    std::cout << \"أحجام مضمونة عبر المنصات\\n\";\n    return 0;\n}"}
  ]
},
"std::tuple": {
  meaning: "حاوية ثابتة الحجم لعدد محدد من قيم可能 مختلفة الأنواع. امتداد لـ `std::pair`.",
  usage: "إرجاع عدة قيم، تجميع بيانات، structured bindings.",
  commonMistake: "الوصول بفهرس خاطئ بـ `std::get<N>`؛ يُفحص وقت الترجمة.",
  examples: [
    {title: "إنشاء وتفكيك", code: "#include <iostream>\n#include <tuple>\n#include <string>\n\nint main() {\n    auto t = std::make_tuple(1, \"نص\", 3.14);\n    std::cout << std::get<0>(t) << \" \" << std::get<2>(t) << \"\\n\";\n    auto [a, b, c] = t;\n    return 0;\n}"},
    {title: "إرجاع عدة قيم", code: "#include <iostream>\n#include <tuple>\n#include <string>\n\nstd::tuple<std::string, int, double> getStudent() { return {\"أحمد\", 20, 85.5}; }\n\nint main() {\n    auto [name, age, grade] = getStudent();\n    std::cout << name << \" \" << age << \" \" << grade << \"\\n\";\n    return 0;\n}"},
    {title: "مقارنة مع pair", code: "#include <iostream>\n#include <tuple>\n#include <utility>\n\nint main() {\n    auto p = std::make_pair(1, 2);\n    auto t = std::make_tuple(1, 2, 3, 4);\n    std::cout << \"pair: 2 عنصر\\n\";\n    std::cout << \"tuple: \" << std::tuple_size_v<decltype(t)> << \" عناصر\\n\";\n    return 0;\n}"}
  ]
},
"std::any": {
  meaning: "حاوية نوعية تخزن قيمة من أي نوع مع حفظ معلومات النوع. C++17. بديل آمن لـ `void*`.",
  usage: "تخزين قيم من أنواع مختلفة في نفس الحاوية.",
  commonMistake: "الوصول بالنوع الخاطئ بـ `std::any_cast` يُلقي استثناء.",
  examples: [
    {title: "تخزين واسترجاع", code: "#include <iostream>\n#include <any>\n#include <string>\n\nint main() {\n    std::any v = 3.14;\n    std::cout << std::any_cast<double>(v) << \"\\n\";\n    return 0;\n}"},
    {title: "فحص النوع", code: "#include <iostream>\n#include <any>\n#include <string>\n#include <typeinfo>\n\nint main() {\n    std::any d = std::string(\"مرحبًا\");\n    if (d.type() == typeid(std::string)) std::cout << std::any_cast<std::string>(d) << \"\\n\";\n    return 0;\n}"},
    {title: "مقارنة مع variant", code: "#include <iostream>\n#include <any>\n#include <variant>\n\nint main() {\n    std::any a = 42;\n    std::variant<int, double> v = 42;\n    std::cout << \"variant: آمن في الترجمة\\nany: مرن لكن فحص في التنفيذ\\n\";\n    return 0;\n}"}
  ]
},
"std::bitset": {
  meaning: "حاوية ثابتة الحجم لسلسلة بتات. حجمها يُحدد وقت الترجمة.",
  usage: "أعلام خيارات، جداول بت، عمليات bitwise، تمثيل حالات.",
  commonMistake: "استخدامه ديناميكيًا؛ حجمه ثابت. للحجم الديناميكي استخدم `vector<bool>`.",
  examples: [
    {title: "تعيين وقراءة", code: "#include <iostream>\n#include <bitset>\n\nint main() {\n    std::bitset<8> f;\n    f[0] = 1; f[3] = 1;\n    std::cout << f << \" \" << f.count() << \"\\n\";\n    return 0;\n}"},
    {title: "عمليات bitwise", code: "#include <iostream>\n#include <bitset>\n\nint main() {\n    std::bitset<8> a(\"11001010\"), b(\"10110101\");\n    std::cout << (a & b) << \" \" << (a | b) << \" \" << (a ^ b) << \"\\n\";\n    return 0;\n}"},
    {title: "تحويل من وإلى عدد", code: "#include <iostream>\n#include <bitset>\n\nint main() {\n    std::bitset<16> bits(0xABCD);\n    std::cout << bits << \" \" << bits.to_ulong() << \"\\n\";\n    return 0;\n}"}
  ]
},
"std::initializer_list": {
  meaning: "كائن خفيف يُمثل قائمة قيم ثابتة للتهيئة بـ `{...}`. مُعرَّف في `<initializer_list>`.",
  usage: "تهيئة حاويات وكائنات: `std::vector<int> v = {1, 2, 3};`.",
  commonMistake: "احتفاظ به كعضو في كلاس؛ البيانات مؤقتة وقد تُحذف.",
  examples: [
    {title: "مع حاويات STL", code: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    for (auto n : nums) std::cout << n << \" \";\n    return 0;\n}"},
    {title: "كمعامل دالة", code: "#include <iostream>\n#include <initializer_list>\n\nint sum(std::initializer_list<int> v) { int t = 0; for (auto x : v) t += x; return t; }\n\nint main() {\n    std::cout << sum({1, 2, 3}) << \" \" << sum({10, 20, 30, 40}) << \"\\n\";\n    return 0;\n}"},
    {title: "لا تخزّنه كعضو!", code: "#include <iostream>\n#include <initializer_list>\n#include <vector>\n\nstruct Good { std::vector<int> data; Good(std::initializer_list<int> init) : data(init) {} };\n\nint main() {\n    Good g = {1, 2, 3};\n    for (auto n : g.data) std::cout << n << \" \";\n    return 0;\n}"}
  ]
},
"ptrdiff_t": {
  meaning: "نوع صحيح بإشارة لتمثيل الفرق بين مؤشرين. مُعرَّف في `<cstddef>`.",
  usage: "فرق بين مؤشرين أو مكررات.",
  commonMistake: "استخدام `int` قد لا يكفي على أنظمة 64-bit.",
  examples: [
    {title: "فرق مؤشرين", code: "#include <iostream>\n#include <cstddef>\n\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    ptrdiff_t d = arr + 5 - arr;\n    std::cout << d << \"\\n\";\n    return 0;\n}"},
    {title: "مع مكررات", code: "#include <iostream>\n#include <vector>\n#include <cstddef>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    ptrdiff_t d = v.begin() + 4 - (v.begin() + 1);\n    std::cout << d << \"\\n\";\n    return 0;\n}"},
    {title: "مقارنة مع size_t", code: "#include <iostream>\n#include <cstddef>\n\nint main() {\n    std::cout << \"size_t: بدون إشارة (أحجام)\\n\";\n    std::cout << \"ptrdiff_t: بإشارة (فروق مؤشرات)\\n\";\n    return 0;\n}"}
  ]
}
};

let added = 0;
const fileGroups = {};
for (const [key, guide] of Object.entries(newGuides)) {
  const targetFile = getTargetFile(key);
  if (!fileGroups[targetFile]) fileGroups[targetFile] = loadGuidesFile(targetFile);
  if (!fileGroups[targetFile].referenceGuides[key]) {
    fileGroups[targetFile].referenceGuides[key] = guide;
    added++;
  }
}

for (const [fileName, fileData] of Object.entries(fileGroups)) {
  saveGuidesFile(fileName, fileData);
}
console.log(`Added ${added} guides`);