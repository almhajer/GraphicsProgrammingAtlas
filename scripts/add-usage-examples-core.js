#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'ui', 'cpp', 'reference-standard-library-core.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const examples = {
  "std::vector": [
    {
      "titleArabic": "إنشاء وإضافة عناصر",
      "code": `#include <vector>\n#include <iostream>\n\nint main() {\n    // إنشاء مصفوفة ديناميكية وتهيئتها بثلاث قيم\n    std::vector<int> v = {10, 20, 30};\n\n    v.push_back(40);  // إضافة عنصر في النهاية — يزيد الحجم تلقائيًا\n    v.push_back(50);\n\n    for (size_t i = 0; i < v.size(); ++i) {\n        std::cout << v[i] << ' ';  // وصول عشوائي بفهرس\n    }\n    // المخرج: 10 20 30 40 50\n}`,
      "explanationArabic": "std::vector يدير الذاكرة تلقائيًا: عند استدعاء push_back يتحقق إن كان هناك مكان كافٍ، وإلا يُخصّص ذاكرة جديدة أكبر وينسخ العناصر. الوصول بـ operator[] سريع كصفيف C العادي لأن العناصر مخزنة بترتيب متجاوز في الذاكرة."
    },
    {
      "titleArabic": "حذف عناصر مع الحفاظ على الترتيب",
      "code": `#include <vector>\n#include <algorithm>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {1, 2, 3, 4, 5, 2, 6};\n\n    // erase-remove idiom: إزالة كل القيم 2 مع ضغط العناصر المتبقية\n    auto new_end = std::remove(v.begin(), v.end(), 2);\n    v.erase(new_end, v.end());\n\n    for (int x : v) std::cout << x << ' ';\n    // المخرج: 1 3 4 5 6\n}`,
      "explanationArabic": "std::remove لا يُغيّر حجم المصفوفة فعليًا، بل يُزيح العناصر المطلوبة للأمام ويُرجع مكررًا يشير لنهاية النطاق الصالح. erase بعده يحذف الفائض فعليًا. هذا النمط (erase-remove idiom) هو الطريقة المعيارية لحذف قيم من vector."
    },
    {
      "titleArabic": "reserve لتجنّب إعادة التخصيص المتكرر",
      "code": `#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<float> vertices;\n\n    // reserve يحجز الذاكرة مسبقًا دون إنشاء عناصر\n    // يمنع إعادة التخصيص عند كل push_back\n    vertices.reserve(1000);\n\n    std::cout << "capacity: " << vertices.capacity() << '\\n';  // 1000\n    std::cout << "size: " << vertices.size() << '\\n';          // 0\n\n    for (int i = 0; i < 1000; ++i) {\n        vertices.push_back(static_cast<float>(i));\n    }\n    // لم تحدث أي إعادة تخصيص لأن capacity كافية\n}`,
      "explanationArabic": "reserve يُغيّر السعة (capacity) دون تغيير الحجم (size). الفرق جوهري: العناصر بين size وcapacity غير مُهيأة ولا يمكن الوصول إليها بأمان. استخدم reserve عندما تعرف العدد التقريبي مسبقًا لتجنب نسخ العناصر عند كل توسع."
    }
  ],

  "std::string": [
    {
      "titleArabic": "إنشاء وربط وتقطيع",
      "code": `#include <string>\n#include <iostream>\n\nint main() {\n    std::string name = \"Graphics\";\n    name += \" Programming\";   // ربط سلسلة أخرى\n\n    // substr(بداية، طول) — يُرجع سلسلة فرعية جديدة\n    std::string sub = name.substr(0, 8);\n    std::cout << sub << '\\n';  // Graphics\n\n    // find تُرجع الموضع أو string::npos إن لم تُجد\n    auto pos = name.find(\"Programming\");\n    if (pos != std::string::npos) {\n        std::cout << \"وجدت عند: \" << pos << '\\n';\n    }\n}`,
      "explanationArabic": "std::string يملك الذاكرة التي يحملها ويتعامل معها ككتلة متجاوزة من محارف. operator+= قد يُسبب إعادة تخصيص إذا لم يكن هناك مكان كافٍ. substr يُنشئ سلسلة جديدة منسوخة، لذلك استخدم string_view عند الحاجة لقراءة فقط دون نسخ."
    },
    {
      "titleArabic": "التحويل بين الأنواع باستخدام stringstream",
      "code": `#include <string>\n#include <sstream>\n#include <iostream>\n\nint main() {\n    // تحويل عدد إلى سلسلة\n    std::ostringstream oss;\n    oss << 3.14159;\n    std::string str = oss.str();\n\n    // تحويل سلسلة إلى عدد\n    std::istringstream iss(\"42\");\n    int value = 0;\n    iss >> value;\n\n    std::cout << str << '\\n';   // 3.14159\n    std::cout << value << '\\n';  // 42\n}`,
      "explanationArabic": " stringstream يحوّل بين الأنواع عبر عامل التدفق << و>>. هذا أسلوب آمن نوعيًا لأن المترجم يتحقق من التوافق. البديل الحديث هو std::to_string للتحويل من عدد إلى سلسلة و std::stoi/stof للتحويل العكسي، لكن stringstream أكثر مرونة مع الصيغ المخصصة."
    },
    {
      "titleArabic": "البحث والاستبدال",
      "code": `#include <string>\n#include <iostream>\n\nint main() {\n    std::string text = \"Hello, World! Hello, C++!\";\n\n    // استبدال كل تكرارات \"Hello\" بـ \"Hi\"\n    std::string from = \"Hello\";\n    std::string to = \"Hi\";\n    size_t pos = 0;\n    while ((pos = text.find(from, pos)) != std::string::npos) {\n        text.replace(pos, from.length(), to);\n        pos += to.length();  // تخطي الجزء المُستبدَل لمنع حلقة لا نهائية\n    }\n\n    std::cout << text << '\\n';\n    // المخرج: Hi, World! Hi, C++!\n}`,
      "explanationArabic": "find مع المعامل الثاني pos يبدأ البحث من موضع محدد. replace تستبدل عددًا محددًا من المحارف. التحذير المهم: بعد الاستبدال يجب تحريك pos بخ طول النص الجديد وإلا سيعثر find على نفس الموضع مرة أخرى مما يُسبب حلقة لا نهائية إن كان النص الجديد يحتوي على نص البحث."
    }
  ],

  "std::string_view": [
    {
      "titleArabic": "تمرير نص لقراءة فقط بدون نسخ",
      "code": `#include <string>\n#include <string_view>\n#include <iostream>\n\n// string_view لا يملك الذاكرة — مجرد نافذة قراءة\nvoid print_length(std::string_view sv) {\n    std::cout << sv.length() << \": \" << sv << '\\n';\n}\n\nint main() {\n    std::string s = \"Atlas Guide\";\n    print_length(s);           // يعمل مع std::string\n    print_length(\"Literal\");  // يعمل مع نص حرفي\n    print_length(s.substr(0, 5));  // يعمل مع النتيجة المؤقتة\n}`,
      "explanationArabic": "string_view يُنشئ كائنًا خفيفًا يحمل مؤشرًا وطولًا فقط (16 بايت عادةً). لا ينسخ المحارف. يقبل أي شيء يشبه سلسلة: string حقيقي، نص حرفي، أو نتيجة substr. التحذير: لا تُخزّن string_view إذا قد يُدمَّر المصدر الأصلي قبل استخدامه."
    },
    {
      "titleArabic": "تجزئة نص بدون تخصيص ذاكرة",
      "code": `#include <string_view>\n#include <iostream>\n#include <vector>\n\n// يُرجع أجزاءً كـ string_view — لا نسخة فعلية\nstd::vector<std::string_view> split(std::string_view sv, char delim) {\n    std::vector<std::string_view> parts;\n    size_t start = 0;\n    while (start < sv.size()) {\n        auto pos = sv.find(delim, start);\n        if (pos == std::string_view::npos) pos = sv.size();\n        parts.push_back(sv.substr(start, pos - start));\n        start = pos + 1;\n    }\n    return parts;\n}\n\nint main() {\n    std::string data = \"red,green,blue\";\n    for (auto part : split(data, ',')) {\n        std::cout << '[' << part << '] ';\n    }\n    // المخرج: [red] [green] [blue]\n}`,
      "explanationArabic": "كل عنصر في النتيجة هو string_view يشير إلى جزء من السلسلة الأصلية. لا يحدث أي تخصيص ذاكرة جديد للمحارف. هذا أسرع بكثير من إرجاع vector<string> لأنه يتجنب نسخ كل جزء. الشرط: السلسلة الأصلية data يجب أن تبقى حية طوال استخدام الأجزاء."
    },
    {
      "titleArabic": "خطأ شائع: تخزين string_view يشير لبيانات مؤقتة",
      "code": `#include <string_view>\n#include <string>\n#include <iostream>\n\n// ❌ خطأ: sv يشير إلى كائن مؤقت دُمّر عند نهاية السطر\nstd::string_view bad_view() {\n    std::string temp = \"temporary\";\n    return temp;  // temp يُدمَّر هنا، sv يصبح مُعلّقًا\n}\n\n// ✅ صحيح: المصدر يعيش فترة كافية\nstd::string_view safe_view(const std::string& s) {\n    return s;  // s مرجع لكائن حي في المُستدعِي\n}\n\nint main() {\n    std::string permanent = \"safe data\";\n    std::cout << safe_view(permanent) << '\\n';  // يعمل بأمان\n    // std::cout << bad_view() << '\\n';  // سلوك غير معرّف — لا تفعل هذا\n}`,
      "explanationArabic": "string_view لا يملك البيانات ولا يُطيل عمرها. إذا أشار إلى كائن محلي دُمّر عند خروج الدالة، يصبح string_view مُعلّقًا (dangling) والوصول إليه سلوك غير معرّف. القاعدة: تأكد أن عمر المصدر أطول من عمر string_view."
    }
  ],

  "std::array": [
    {
      "titleArabic": "إنشاء ثابت الحجم والوصول العشوائي",
      "code": `#include <array>\n#include <iostream>\n\nint main() {\n    // الحجم جزء من النوع — يُثبت وقت الترجمة\n    std::array<float, 3> position = {1.0f, 2.0f, 3.0f};\n\n    // at() يفحص الحدود ويرمي out_of_range عند تجاوزها\n    position.at(0) = 0.0f;\n\n    for (size_t i = 0; i < position.size(); ++i) {\n        std::cout << position[i] << ' ';\n    }\n    // المخرج: 0 2 3\n}`,
      "explanationArabic": "std::array يضيف واجهة حاوية قياسية فوق صفيف C الخام: size()، at() مع فحص الحدود، وbegin()/end() للمرور. الحجم ثابت وقت الترجمة ولا يمكن تغييره. لا يُخصّص ذاكرة على الكومة — البيانات مخزنة مباشرة داخل الكائن كصفيف C عادي."
    },
    {
      "titleArabic": "تهيئة مجمّعة وتمرير كمعامل",
      "code": `#include <array>\n#include <iostream>\n#include <algorithm>\n\n// تمرير بالمرجع const — لا نسخ لأن std::array خفيف\nvoid print(const std::array<int, 4>& arr) {\n    for (int x : arr) std::cout << x << ' ';\n    std::cout << '\\n';\n}\n\nint main() {\n    std::array<int, 4> data = {5, 2, 8, 1};\n    print(data);\n\n    std::sort(data.begin(), data.end());\n    print(data);\n    // المخرج:\n    // 5 2 8 1\n    // 1 2 5 8\n}`,
      "explanationArabic": "تمرير std::array بالمرجع يمنع النسخ رغم أن النسخ رخيصة لأن البيانات على المكدس. std::sort يعمل مباشرة على std::array لأنه يوفر مكررات begin()/end(). الفرق عن صفيف C: يمكنك معرفة حجمه عبر size() بدل تمرير الحجم منفصلًا."
    },
    {
      "titleArabic": "استخدامه كبديل آمن لصفيف C في البُنى",
      "code": `#include <array>\n#include <iostream>\n#include <cstring>\n\nstruct Vertex {\n    std::array<float, 3> position;  // بديل آمن لـ float position[3]\n    std::array<float, 4> color;     // بديل آمن لـ float color[4]\n};\n\nint main() {\n    Vertex v = {\n        {0.0f, 1.0f, 0.0f},  // position\n        {1.0f, 0.0f, 0.0f, 1.0f}  // color (RGBA)\n    };\n\n    // memcpy آمن: نعرف الحجم الدقيق عبر sizeof\n    std::array<float, 3> copy;\n    std::memcpy(copy.data(), v.position.data(), sizeof(float) * 3);\n\n    std::cout << copy[0] << ' ' << copy[1] << ' ' << copy[2] << '\\n';\n    // المخرج: 0 1 0\n}`,
      "explanationArabic": "داخل البُنى، std::array أفضل من صفيف C لأنه يوفر size() وdata() ومكررات. data() يُرجع مؤشرًا خامًا للتوافق مع واجهات C مثل memcpy. sizeof(Vertex) لا يتغير — لا يوجد مؤشر إضافي لأن البيانات مضمّنة مباشرة في البنية."
    }
  ],

  "std::deque": [
    {
      "titleArabic": "إدراج من كلا الطرفين",
      "code": `#include <deque>\n#include <iostream>\n\nint main() {\n    std::deque<int> dq;\n\n    dq.push_back(10);   // إضافة في النهاية\n    dq.push_front(5);   // إضافة في البداية\n    dq.push_back(20);\n    dq.push_front(1);\n\n    for (int x : dq) std::cout << x << ' ';\n    // المخرج: 1 5 10 20\n}`,
      "explanationArabic": "deque يُنظّم البيانات في كتل صغيرة متصلة، لذلك push_front وpush_back كلاهما سريع (O(1) متوسط). بعكس vector لا يمكنه الإدراج في البداية بكفاءة. الترجمة: Double-Ended Queue = طابور مزدوج الطرف."
    },
    {
      "titleArabic": "الوصول العشوائي وقائمة انتظار المهام",
      "code": `#include <deque>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::deque<std::string> tasks;\n\n    tasks.push_back(\"معالجة إدخال\");\n    tasks.push_back(\"تحديث فيزياء\");\n    tasks.push_front(\"طوارئ: خطأ شبكة\");  // مهمة عاجلة في البداية\n\n    // الوصول العشوائي ممكن لكن أبطأ قليلًا من vector\n    std::cout << \"الأولى: \" << tasks.front() << '\\n';\n    std::cout << \"الثانية: \" << tasks[1] << '\\n';\n\n    tasks.pop_front();  // إزالة المهلة العاجلة\n    std::cout << \"التالية: \" << tasks.front() << '\\n';\n}`,
      "explanationArabic": "deque يوفر وصولًا عشوائيًا عبر operator[] لكنه أبطأ قليلًا من vector لأن البيانات ليست في كتلة واحدة متجاوزة. القوة الحقيقية في الإدراج والحذف السريع من كلا الطرفين. std::queue تستخدم deque كحاوية أساسية افتراضيًا."
    },
    {
      "titleArabic": "متى تختار deque بدل vector",
      "code": `#include <deque>\n#include <vector>\n#include <iostream>\n\nint main() {\n    // ❌ vector: push_front غير موجود — يجب إزاحة كل العناصر\n    std::vector<int> vec = {2, 3, 4};\n    // vec.push_front(1);  // خطأ ترجمة\n\n    // ✅ deque: push_front سريع — لا إزاحة\n    std::deque<int> dq = {2, 3, 4};\n    dq.push_front(1);\n\n    // اختر vector عندما:\n    //   - تحتاج وصول عشوائي سريع فقط\n    //   - لا تدرج في البداية\n    // اختر deque عندما:\n    //   - تدرج في البداية أو كلا الطرفين بكثرة\n    //   - لا تحتاج ضمان التجاوز في الذاكرة (مثل تمريرها لـ C API)\n\n    std::cout << \"deque: \";\n    for (int x : dq) std::cout << x << ' ';\n    // المخرج: 1 2 3 4\n}`,
      "explanationArabic": "vector يضمن تجاوز العناصر في الذاكرة (contiguous) مما يجعله مناسبًا لـ C API وmemcpy. deque لا يضمن ذلك. اختر vector افتراضيًا لأنه أسرع في الوصول العشوائي وله كاش أفضل. انتقل لـ deque فقط عند الحاجة الفعلية للإدراج في البداية."
    }
  ],

  "std::list": [
    {
      "titleArabic": "إدراج وحذف في الوسط",
      "code": `#include <list>\n#include <iostream>\n\nint main() {\n    std::list<int> lst = {10, 30, 40};\n\n    // إدراج قبل العنصر 30\n    auto it = std::next(lst.begin());  // يشير لـ 30\n    lst.insert(it, 20);  // O(1) — لا إزاحة\n\n    for (int x : lst) std::cout << x << ' ';\n    // المخرج: 10 20 30 40\n}`,
      "explanationArabic": "في vector، الإدراج في الوسط يتطلب إزاحة كل العناصر بعد موضع الإدراج (O(n)). في list، الإدراج عند مكرر هو O(1) لأنه مجرد تعديل مؤشرات الروابط. لكن الوصول إلى الموضع نفسه يحتاج المرور خطوة بخطوة لأنه لا يوجد وصول عشوائي."
    },
    {
      "titleArabic": "حذف عناصر بشرط",
      "code": `#include <list>\n#include <iostream>\n\nint main() {\n    std::list<int> lst = {1, -2, 3, -4, 5, -6};\n\n    // remove_if يُزيح العناصر المطابقة ويرميها\n    lst.remove_if([](int x) { return x < 0; });\n\n    for (int x : lst) std::cout << x << ' ';\n    // المخرج: 1 3 5\n}`,
      "explanationArabic": "remove_if على list أقوى من erase-remove على vector لأنه يُزيل العناصر فعليًا في عملية واحدة O(n) بدون حاجة لخطوة erase منفصلة. هذا لأن list تتحكم بروابطها مباشرة. لاحظ أن remove_if على list تأخذ دالة لا مكررين."
    },
    {
      "titleArabic": "دمج قائمتين مرتبتين",
      "code": `#include <list>\n#include <iostream>\n\nint main() {\n    std::list<int> a = {1, 3, 5};\n    std::list<int> b = {2, 4, 6};\n\n    // merge تنقل عناصر b إلى a — b تصبح فارغة بعد الدمج\n    // يجب أن تكون كلتا القائمتين مرتبتين مسبقًا\n    a.merge(b);\n\n    std::cout << \"a: \";\n    for (int x : a) std::cout << x << ' ';\n    std::cout << \"\\nb size: \" << b.size() << '\\n';\n    // المخرج:\n    // a: 1 2 3 4 5 6\n    // b size: 0\n}`,
      "explanationArabic": "merge تنقل العقد من القائمة الثانية إلى الأولى بناءً على الترتيب. تعقيدها O(n) لأنها تمر على كل عنصر مرة واحدة فقط. بعد الدمج، b فارغة لأن العقد انتقلت ملكيتها لـ a. هذا أسرع من دمج vectorين لأنه لا نسخ بيانات — مجرد تعديل مؤشرات."
    }
  ],

  "std::forward_list": [
    {
      "titleArabic": "إدراج في البداية",
      "code": `#include <forward_list>\n#include <iostream>\n\nint main() {\n    std::forward_list<int> fl;\n\n    fl.push_front(3);\n    fl.push_front(2);\n    fl.push_front(1);\n\n    for (int x : fl) std::cout << x << ' ';\n    // المخرج: 1 2 3\n}`,
      "explanationArabic": "forward_list قائمة مرتبطة أحادية الارتباط: كل عقدة تشير للتي تليها فقط. هذا يوفر ذاكرة أقل من list (مؤشر واحد بدل اثنين لكل عقدة) لكنه يمنع المرور للوراء. لا يوجد push_back لأن الوصول للنهاية يحتاج مرورًا كاملًا O(n)."
    },
    {
      "titleArabic": "إدراج بعد موضع محدد",
      "code": `#include <forward_list>\n#include <iostream>\n\nint main() {\n    std::forward_list<int> fl = {10, 30, 40};\n\n    // insert_after يدرج بعد المكرر — ليس قبله كـ list\n    auto it = fl.begin();  // يشير لـ 10\n    fl.insert_after(it, 20);\n\n    for (int x : fl) std::cout << x << ' ';\n    // المخرج: 10 20 30 40\n}`,
      "explanationArabic": "بعكس list التي تُدرج قبل المكرر، forward_list تُدرج بعد المكرر لأنه لا يوجد رابط للوراء. هذا يعني أنه لا يمكنك الإدراج قبل begin() مباشرةً — يجب أن تبدأ من قبلها. insert_after_after أو إدراج في البداية يتم عبر push_front."
    },
    {
      "titleArabic": "حذف بعد موضع — نمط البحث والحذف",
      "code": `#include <forward_list>\n#include <iostream>\n\nint main() {\n    std::forward_list<int> fl = {1, 2, 3, 4, 5};\n\n    // حذف العنصر بعد 2 (أي 3)\n    auto prev = fl.before_begin();\n    auto curr = fl.begin();\n    while (curr != fl.end()) {\n        if (*curr == 2) {\n            fl.erase_after(prev);  // يحذف العنصر بعد prev\n            break;\n        }\n        prev = curr;\n        ++curr;\n    }\n\n    for (int x : fl) std::cout << x << ' ';\n    // المخرج: 1 2 4 5\n}`,
      "explanationArabic": "erase_after يحذف العنصر الذي يلي المكرر. هذا يعني أنك تحتاج تتبع العقدة السابقة دائمًا (prev pattern). before_begin() يُرجع مكررًا خاصًا قبل العنصر الأول يُستخدم لحذف العنصر الأول. هذا النمط أكثر تعقيدًا من list لكنه يوفّر ذاكرة."
    }
  ],

  "std::map": [
    {
      "titleArabic": "إدراج والبحث بمفتاح",
      "code": `#include <map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::map<std::string, int> ages;\n\n    // إدراج — لا يسمح بمفاتيح مكررة\n    ages[\"Ali\"] = 25;\n    ages[\"Sara\"] = 30;\n    ages[\"Omar\"] = 22;\n\n    // البحث بـ find — يُرجع مكررًا لا قيمة مباشرة\n    auto it = ages.find(\"Sara\");\n    if (it != ages.end()) {\n        std::cout << it->first << \": \" << it->second << '\\n';\n    }\n    // المخرج: Sara: 30\n}`,
      "explanationArabic": "map يخزن الأزواج مرتبة حسب المفتاح داخليًا (شجرة حمراء-سوداء). operator[] يُنشئ عنصرًا بقيمة افتراضية إن لم يكن المفتاح موجودًا — لذلك استخدم find للبحث بدون إدراج عرضي. it->first هو المفتاح وit->second هي القيمة."
    },
    {
      "titleArabic": "المرور مرتبًا حسب المفتاح",
      "code": `#include <map>\n#include <iostream>\n\nint main() {\n    std::map<std::string, int> scores;\n    scores[\"Zain\"] = 88;\n    scores[\"Ali\"] = 95;\n    scores[\"Lina\"] = 92;\n\n    // المرور يكون تلقائيًا مرتبًا أبجديًا حسب المفتاح\n    for (const auto& [name, score] : scores) {\n        std::cout << name << \": \" << score << '\\n';\n    }\n    // المخرج (مرتب أبجديًا):\n    // Ali: 95\n    // Lina: 92\n    // Zain: 88\n}`,
      "explanationArabic": "map يحافظ على الترتيب دائمًا — الإدراج لا يُخلّه. هذا يعني أن المرور بـ for يُخرج العناصر مرتبة حسب المفتاح دون استدعاء sort. structured binding (auto& [key, value]) يُبسّط الوصول للزوج. إذا لم تحتاج الترتيب، استخدم unordered_map لأنه أسرع."
    },
    {
      "titleArabic": "خطأ شائع: operator[] يُدرج عنصرًا جديدًا",
      "code": `#include <map>\n#include <iostream>\n\nint main() {\n    std::map<std::string, int> data;\n    data[\"existing\"] = 10;\n\n    // ❌ خطأ: لو لم يكن \"missing\" موجودًا سيُدرج بقيمة 0\n    int val = data[\"missing\"];  // الآن data تحتوي \"missing\": 0\n    std::cout << data.size() << '\\n';  // 2 — عنصر جديد ظهر!\n\n    // ✅ صحيح: find لا يُدرج شيئًا\n    auto it = data.find(\"another\");\n    if (it != data.end()) {\n        val = it->second;  // آمن — لا إدراج عرضي\n    } else {\n        std::cout << \"غير موجود\\n\";\n    }\n}`,
      "explanationArabic": "operator[] على map يُرجع مرجعًا للقيمة، وإن لم يكن المفتاح موجودًا يُنشئه بقيمة افتراضية (0 للأعداد، فارغ للسلاسل). هذا يعني أن قراءة data[\"key\"] قد تُغيّر حجم map! استخدم at() لرمي استثناء أو find() للتحقق الآمن."
    }
  ],

  "std::set": [
    {
      "titleArabic": "إدراج وفحص العضوية",
      "code": `#include <set>\n#include <iostream>\n\nint main() {\n    std::set<int> s;\n\n    s.insert(30);\n    s.insert(10);\n    s.insert(20);\n    s.insert(10);  // مكرر — لن يُضاف\n\n    std::cout << \"الحجم: \" << s.size() << '\\n';  // 3\n\n    // count تُرجع 1 أو 0 — مفيدة لفحص العضوية\n    if (s.count(20)) {\n        std::cout << \"20 موجود\\n\";\n    }\n}`,
      "explanationArabic": "set يرفض التكرار تلقائيًا — insert تُرجع زوجًا (مكرر، bool) يُخبر إن كان الإدراج تم فعلًا. count() على set تُرجع إما 0 أو 1 فقط (بعكس multiset). استخدم count بدل find عند الحاجة لفحص وجود فقط لأنها أبسط."
    },
    {
      "titleArabic": "إزالة تكرارات من مصفوفة",
      "code": `#include <set>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};\n\n    // نسخ إلى set لإزالة التكرار\n    std::set<int> unique(v.begin(), v.end());\n\n    std::cout << \"فريد: \";\n    for (int x : unique) std::cout << x << ' ';\n    // المخرج: 1 2 3 4 5 6 9 (مرتب)\n}`,
      "explanationArabic": "مُنشئ set يقبل مكررات فيُدخل كل عنصر ويرفض المكرر تلقائيًا. النتيجة مرتبة وفريدة. هذا أبسط من erase-remove idiom على vector لكنه لا يحافظ على الترتيب الأصلي. للحفاظ على الترتيب الأصلي، استخدم unordered_set مع التحقق اليدوي أو خوارزمية أخرى."
    },
    {
      "titleArabic": "البحث عن أقرب عنصر",
      "code": `#include <set>\n#include <iostream>\n\nint main() {\n    std::set<int> s = {10, 20, 30, 40, 50};\n\n    int target = 33;\n\n    // lower_bound يُرجع أول عنصر >= القيمة\n    auto it = s.lower_bound(target);\n    if (it != s.end()) {\n        std::cout << \"الأول >= \" << target << \": \" << *it << '\\n';\n        // المخرج: الأول >= 33: 40\n    }\n\n    // upper_bound يُرجع أول عنصر > القيمة\n    auto above = s.upper_bound(target);\n    if (above != s.begin()) {\n        auto below = std::prev(above);\n        std::cout << \"الأخير <= \" << target << \": \" << *below << '\\n';\n        // المخرج: الأخير <= 33: 30\n    }\n}`,
      "explanationArabic": "lower_bound وupper_bound يستغلان ترتيب الشجرة الداخلي لتنفيذ البحث بـ O(log n). هذا مفيد في التطبيقات مثل إيجاد أقرب نقطة أو نطاق زمني. lower_bound >= بينما upper_bound > — الفرق مهم عند وجود العنصر نفسه في المجموعة."
    }
  ],

  "std::multimap": [
    {
      "titleArabic": "تخزين عدة قيم لنفس المفتاح",
      "code": `#include <map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::multimap<std::string, int> scores;\n\n    // نفس المفتاح يمكن أن يظهر عدة مرات\n    scores.insert({\"Ali\", 90});\n    scores.insert({\"Sara\", 85});\n    scores.insert({\"Ali\", 78});  // Ali مرة أخرى\n\n    // count تُرجع عدد التكرارات\n    std::cout << \"Ali: \" << scores.count(\"Ali\") << \" درجات\\n\";\n\n    for (const auto& [name, score] : scores) {\n        std::cout << name << \": \" << score << '\\n';\n    }\n}`,
      "explanationArabic": "multimap لا يدعم operator[] لأن المفتاح ليس فريدًا فلا يُرجع قيمة واحدة. استخدم insert مع زوج {key, value}. العناصر مرتبة حسب المفتاح والقيم بنفس المفتاح تظهر متتالية. count() تُرجع عدد العناصر بنفس المفتاح."
    },
    {
      "titleArabic": "البحث عن كل قيم مفتاح محدد",
      "code": `#include <map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::multimap<std::string, std::string> dict;\n    dict.insert({\"run\", \"يركض\"});\n    dict.insert({\"run\", \"يُشغّل\"});\n    dict.insert({\"run\", \"يرشح\"});\n    dict.insert({\"go\", \"يذهب\"});\n\n    // equal_range يُرجع نطاقًا يحتوي كل العناصر بالمفتاح\n    auto [first, last] = dict.equal_range(\"run\");\n    std::cout << \"معاني run:\\n\";\n    for (auto it = first; it != last; ++it) {\n        std::cout << \"  - \" << it->second << '\\n';\n    }\n}`,
      "explanationArabic": "equal_range يُرجع زوج مكررات يُحددان النطاق الذي يحتوي كل العناصر بالمفتاح المطلوب. هذا أنسب من find لأن find يُرجع أول تكرار فقط. النطاق يمكن المرور عليه كأي مكرر. التعقيد O(log n) للبحث + O(k) للمرور حيث k عدد التكرارات."
    },
    {
      "titleArabic": "حذف كل تكرارات مفتاح",
      "code": `#include <map>\n#include <iostream>\n\nint main() {\n    std::multimap<int, char> mm;\n    mm.insert({1, 'a'});\n    mm.insert({2, 'b'});\n    mm.insert({1, 'c'});\n    mm.insert({1, 'd'});\n    mm.insert({3, 'e'});\n\n    // erase بمفتاح يُزيل كل التكرارات دفعة واحدة\n    size_t removed = mm.erase(1);\n    std::cout << \"أُزيلت: \" << removed << \" عناصر\\n\";\n\n    for (const auto& [k, v] : mm) {\n        std::cout << k << \": \" << v << ' ';\n    }\n    // المخرج: أُزيلت: 3 عناصر\n    //         2: b 3: e\n}`,
      "explanationArabic": "erase على multimap بمفتاح يُزيل كل العناصر المطابقة ويُرجع عددها. هذا أسرع من حذف كل تكرار على حدة عبر مكرر. إن أردت حذف تكرار واحد فقط، استخدم erase مع مكرر من find أو equal_range."
    }
  ],

  "std::multiset": [
    {
      "titleArabic": "تخزين قيم مكررة مرتبة",
      "code": `#include <set>\n#include <iostream>\n\nint main() {\n    std::multiset<int> ms;\n\n    ms.insert(5);\n    ms.insert(1);\n    ms.insert(5);  // مسموح — ليس فريدًا\n    ms.insert(3);\n    ms.insert(5);\n\n    std::cout << \"عدد 5: \" << ms.count(5) << '\\n';  // 3\n\n    for (int x : ms) std::cout << x << ' ';\n    // المخرج: 1 3 5 5 5\n}`,
      "explanationArabic": "multiset يحافظ على الترتيب لكنه يسمح بالتكرار. كل insert O(log n). count() تُرجع العدد الفعلي وليس 0 أو 1 فقط كما في set. مفيد عندما تحتاج ترتيبًا مع إحصاء التكرارات مثل حساب التكرارات في نص."
    },
    {
      "titleArabic": "حذف تكرار واحد فقط",
      "code": `#include <set>\n#include <iostream>\n\nint main() {\n    std::multiset<int> ms = {1, 5, 5, 5, 9};\n\n    // find يُرجع أول تكرار فقط\n    auto it = ms.find(5);\n    if (it != ms.end()) {\n        ms.erase(it);  // يُزيل هذا التكرار فقط، لا كل الـ 5\n    }\n\n    std::cout << \"بعد الحذف: \";\n    for (int x : ms) std::cout << x << ' ';\n    // المخرج: 1 5 5 9\n}`,
      "explanationArabic": "erase بمكرر يُزيل العنصر الذي يشير إليه فقط. erase بقيمة تُزيل كل التكرارات! هذا فرق خطير: ms.erase(5) يُزيل كل الـ 5 بينما ms.erase(ms.find(5)) يُزيل الأول فقط. انتبه لهذا عند الحاجة لحذف عنصر واحد."
    },
    {
      "titleArabic": "حساب التكرارات في نص",
      "code": `#include <set>\n#include <string>\n#include <iostream>\n#include <cctype>\n\nint main() {\n    std::string text = \"hello world hello\";\n    std::multiset<std::string> words;\n\n    size_t start = 0;\n    for (size_t i = 0; i <= text.size(); ++i) {\n        if (i == text.size() || text[i] == ' ') {\n            if (i > start) {\n                words.insert(text.substr(start, i - start));\n            }\n            start = i + 1;\n        }\n    }\n\n    // معرفة تكرار كل كلمة\n    for (auto it = words.begin(); it != words.end(); ) {\n        const auto& word = *it;\n        size_t cnt = words.count(word);\n        std::cout << word << \": \" << cnt << '\\n';\n        std::advance(it, cnt);  // تخطي كل تكرارات هذه الكلمة\n    }\n    // المخرج:\n    // hello: 2\n    // world: 1\n}`,
      "explanationArabic": "بما أن multiset مرتب، التكرارات متجاورة. لذلك بعد count يمكن تخطيها بـ advance. هذا أنسب من unordered_map عند الحاجة لنتائج مرتبة أبجديًا. لكل كلمة مرور واحد فقط لأننا نتخطى التكرارات."
    }
  ],

  "std::unordered_map": [
    {
      "titleArabic": "إدراج وبحث سريع",
      "code": `#include <unordered_map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::unordered_map<std::string, int> cache;\n\n    cache[\"texture_1\"] = 100;\n    cache[\"texture_2\"] = 200;\n    cache[\"texture_3\"] = 150;\n\n    // find — بحث متوسط O(1)\n    auto it = cache.find(\"texture_2\");\n    if (it != cache.end()) {\n        std::cout << it->first << \": \" << it->second << '\\n';\n    }\n}`,
      "explanationArabic": "unordered_map يستخدم جدول تجزئة (hash table) داخليًا. البحث والإدراج والحذف متوسط O(1) لكن أسوأ حالة O(n) عند تجزئة سيئة. لا يحافظ على الترتيب. يتطلب أن يكون نوع المفتاح قابلاً للتجزئة (has std::hash). الأنواع القياسية مثل string وint تدعم ذلك افتراضيًا."
    },
    {
      "titleArabic": "ذاكرة تخزين مؤقت (cache) بسيطة",
      "code": `#include <unordered_map>\n#include <string>\n#include <iostream>\n\n// محاكاة دالة مكلفة\nint expensive_compute(const std::string& key) {\n    return static_cast<int>(key.length() * 7);\n}\n\nint main() {\n    std::unordered_map<std::string, int> cache;\n\n    std::string keys[] = {\"alpha\", \"beta\", \"alpha\", \"gamma\", \"alpha\"};\n    for (const auto& key : keys) {\n        auto it = cache.find(key);\n        if (it != cache.end()) {\n            std::cout << key << \" (من الكاش): \" << it->second << '\\n';\n        } else {\n            int result = expensive_compute(key);\n            cache[key] = result;\n            std::cout << key << \" (حُسب): \" << result << '\\n';\n        }\n    }\n    // alpha يُحسب مرة واحدة فقط ثم يُقرأ من الكاش\n}`,
      "explanationArabic": "النمط: ابحث في الكاش أولًا، إن لم تجد فاحسب وأضف للكاش. هذا يُقلل العمليات المكلفة بشكل كبير عند تكرار المدخلات. unordered_map مناسب هنا لأن البحث السريع هو الأولوية وليس الترتيب. انتبه: لا كاش بلا حدود — في التطبيقات الحقيقية أضف حدًا للحجم."
    },
    {
      "titleArabic": "استخدام contains بدل find (C++20)",
      "code": `#include <unordered_map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::unordered_map<std::string, int> m;\n    m[\"exists\"] = 42;\n\n    // C++20: contains أبسط من find عند الحاجة لفحص وجود فقط\n    if (m.contains(\"exists\")) {\n        std::cout << \"موجود\\n\";\n    }\n    if (!m.contains(\"missing\")) {\n        std::cout << \"غير موجود\\n\";\n    }\n\n    // قبل C++20 كنت تكتب:\n    // if (m.find(\"missing\") != m.end()) { ... }\n}`,
      "explanationArabic": "contains (C++20) تُرجع bool مباشرة بدل مقارنة المكرر بـ end(). أقرأ وأقل عرضة للخطأ. إذا كنت تحتاج القيمة فاستخدم find. إذا كنت تحتاج وجود فقط فcontains أنسب. تأكد من دعم المترجم لـ C++20 قبل استخدامها."
    }
  ],

  "std::unordered_set": [
    {
      "titleArabic": "فحص عضوية سريع",
      "code": `#include <unordered_set>\n#include <iostream>\n\nint main() {\n    std::unordered_set<int> seen;\n    int numbers[] = {1, 2, 3, 2, 4, 1, 5};\n\n    for (int n : numbers) {\n        if (seen.insert(n).second) {  // .second = true إن كان جديدًا\n            std::cout << n << \" (جديد) \";\n        } else {\n            std::cout << n << \" (مكرر) \";\n        }\n    }\n    // المخرج: 1 (جديد) 2 (جديد) 3 (جديد) 2 (مكرر) 4 (جديد) 1 (مكرر) 5 (جديد)\n}`,
      "explanationArabic": "insert تُرجع زوجًا (مكرر، bool). القيمة المنطقية تُخبر إن كان الإدراج تم فعلًا (لم يكن موجودًا). هذا أنسب من count ثم insert لأنه عملية واحدة بدل اثنتين. مفيد جدًا في خوارزميات إزالة التكرار وتتبع الحالات."
    },
    {
      "titleArabic": "إزالة تكرارات مع الحفاظ على الترتيب الأصلي",
      "code": `#include <unordered_set>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};\n    std::vector<int> result;\n    std::unordered_set<int> seen;\n\n    for (int x : v) {\n        if (seen.insert(x).second) {  // جديد فقط\n            result.push_back(x);\n        }\n    }\n\n    for (int x : result) std::cout << x << ' ';\n    // المخرج: 3 1 4 5 9 2 6 (الترتيب الأصلي محفوظ)\n}`,
      "explanationArabic": "بعكس نسخ vector لـ set (الذي يُرتب أبجديًا)، هذا النمط يحافظ على ترتيب الظهور الأول. unordered_set تُستخدم فقط كمساعد للفحص السريع O(1). النتيجة في result تحافظ على ترتيب الإدراج الأصلي."
    },
    {
      "titleArabic": "مقارنة مع set — متى تستخدم أيهما",
      "code": `#include <set>\n#include <unordered_set>\n#include <iostream>\n\nint main() {\n    const int N = 100000;\n\n    // unordered_set: بحث O(1) متوسط — لا ترتيب\n    std::unordered_set<int> us;\n    for (int i = 0; i < N; ++i) us.insert(i);\n    auto t1 = us.find(N - 1);  // سريع جدًا\n\n    // set: بحث O(log n) — مرتب\n    std::set<int> s;\n    for (int i = 0; i < N; ++i) s.insert(i);\n    auto t2 = s.find(N - 1);  // أبطأ قليلًا\n\n    // القاعدة:\n    // - تحتاج ترتيب؟ → set\n    // - تحتاج أقرب عنصر (lower_bound)؟ → set\n    // - تحتاج أسرع عضوية فقط؟ → unordered_set\n    // - المفتاح مخصص بدون hash؟ → set\n\n    std::cout << \"كلاهما يعمل لكن unordered_set أسرع في البحث\\n\";\n}`,
      "explanationArabic": "اختر unordered_set عندما تحتاج فحص عضوية فقط بدون ترتيب. اختر set عندما تحتاج الترتيب أو عمليات مثل lower_bound. unordered_set يستهلك ذاكرة أكثر قليلًا بسبب جدول التجزئة. الأنواع المخصصة تحتاج تخصيص std::hash وoperator== لـ unordered_set."
    }
  ],

  "std::queue": [
    {
      "titleArabic": "قائمة انتظار أساسية FIFO",
      "code": `#include <queue>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::queue<std::string> tasks;\n\n    tasks.push(\"تحميل نسيج\");\n    tasks.push(\"بناء شادر\");\n    tasks.push(\"تقديم إطار\");\n\n    while (!tasks.empty()) {\n        std::cout << \"معالجة: \" << tasks.front() << '\\n';\n        tasks.pop();  // pop يُزيل العنصر من المقدمة\n    }\n    // المخرج بالترتيب الذي دخل به\n}`,
      "explanationArabic": "queue حاوية محولة (adapter) تبني على deque افتراضيًا. ت暴露 فقط push (في النهاية)، pop (من المقدمة)، front، وback. لا يوجد وصول عشوائي ولا مكررات. pop لا يُرجع قيمة — يجب قراءة front أولًا ثم pop."
    },
    {
      "titleArabic": "معالجة أحداث بالترتيب",
      "code": `#include <queue>\n#include <string>\n#include <iostream>\n\nenum class EventType { Input, Render, Network };\n\nstruct Event {\n    EventType type;\n    std::string data;\n};\n\nint main() {\n    std::queue<Event> event_queue;\n\n    event_queue.push({EventType::Input, \"نقر فأرة\"});\n    event_queue.push({EventType::Network, \"بيانات مستقبلة\"});\n    event_queue.push({EventType::Render, \"إطار جديد\"});\n\n    while (!event_queue.empty()) {\n        Event e = event_queue.front();\n        event_queue.pop();\n\n        switch (e.type) {\n            case EventType::Input:   std::cout << \"[إدخال] \" << e.data << '\\n'; break;\n            case EventType::Render:  std::cout << \"[عرض] \" << e.data << '\\n'; break;\n            case EventType::Network: std::cout << \"[شبكة] \" << e.data << '\\n'; break;\n        }\n    }\n}`,
      "explanationArabic": "queue مثالية لنمط الإنتاج-الاستهلاك البسيط: خيط يُنتج أحداثًا وآخر يستهلكها بالترتيب. لا يوجد تزامن مدمج — للخيوط المتعددة أضف mutex. FIFO يضمن معالجة الأحداث بترتيب وصولها، وهو مهم في معالجة الإدخال وأحداث الشبكة."
    },
    {
      "titleArabic": "لا تفعل: الوصول لعناصر داخلية",
      "code": `#include <queue>\n#include <deque>\n#include <iostream>\n\nint main() {\n    std::queue<int> q;\n    q.push(1); q.push(2); q.push(3);\n\n    // ❌ لا يوجد operator[] أو مكررات على queue\n    // std::cout << q[0];  // خطأ ترجمة\n\n    // ✅ إن احتجت الوصول الداخلي، استخدم الحاوية الأساسية مباشرة\n    std::deque<int>& underlying = q._Get_container();  // غير معياري — لا تفعل\n\n    // ✅ الأفضل: لا تستخدم queue إن احتجت وصول داخلي\n    // استخدم deque مباشرة بدلًا من ذلك\n    std::deque<int> dq;\n    dq.push_back(1); dq.push_back(2); dq.push_back(3);\n    std::cout << dq[1] << '\\n';  // 2 — وصول عشوائي مباشر\n}`,
      "explanationArabic": "queue تُخفي الحاوية الأساسية عمدًا لتفرض نموذج FIFO. إن احتجت وصول عشوائي أو مكررات فأنت لا تحتاج queue — استخدم deque مباشرة. _Get_container() خاص بـ MSVC وليس معياريًا. القاعدة: إذا قيّدتك الواجهة فاختر الحاوية المناسبة من البداية."
    }
  ],

  "std::stack": [
    {
      "titleArabic": "مكدس أساسي LIFO",
      "code": `#include <stack>\n#include <iostream>\n\nint main() {\n    std::stack<int> frames;\n\n    frames.push(1);  // إطار أساسي\n    frames.push(2);  // إطار فرعي\n    frames.push(3);  // إطار فرعي أعمق\n\n    while (!frames.empty()) {\n        std::cout << \"خروج: \" << frames.top() << '\\n';\n        frames.pop();  // يُزيل الأعلى\n    }\n    // المخرج: 3، 2، 1 (عكس الترتيب)\n}`,
      "explanationArabic": "stack حاوية محولة تبني على deque أو vector افتراضيًا. يكشف فقط push، pop، top. pop لا يُرجع قيمة — اقرأ top أولًا. LIFO يعني أن آخر عنصر دخل هو أول من يخرج، تمامًا مثل مكدس استدعاءات الدوال."
    },
    {
      "titleArabic": "فحص أقواس متوازنة",
      "code": `#include <stack>\n#include <string>\n#include <iostream>\n\nbool is_balanced(const std::string& expr) {\n    std::stack<char> st;\n    for (char c : expr) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push(c);\n        } else if (c == ')' || c == ']' || c == '}') {\n            if (st.empty()) return false;\n            char open = st.top();\n            st.pop();\n            if (c == ')' && open != '(') return false;\n            if (c == ']' && open != '[') return false;\n            if (c == '}' && open != '{') return false;\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    std::cout << std::boolalpha;\n    std::cout << is_balanced(\"(a + [b * {c}])\") << '\\n';   // true\n    std::cout << is_balanced(\"(a + [b * {c)])\") << '\\n';   // false\n}`,
      "explanationArabic": "كل قوس مفتوح يُدفع للمكدس. عند مواجهة قوس مغلق، يُطابق مع أعلى المكدس. إن لم يتطابق أو كان المكدس فارغًا فالتوازن مُخلّ. في النهاية يجب أن يكون المكدس فارغًا (كل فتح أُغلق). هذا نمط كلاسيكي لمكدس stack."
    },
    {
      "titleArabic": "التراجع (undo) باستخدام مكدسين",
      "code": `#include <stack>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::stack<std::string> undo_stack;\n    std::stack<std::string> redo_stack;\n\n    // محاكاة عمليات تحرير\n    undo_stack.push(\"كتبت: مرحبا\");\n    undo_stack.push(\"كتبت: مرحبا بالعالم\");\n    undo_stack.push(\"حذفت: العالم\");\n\n    // تراجع\n    if (!undo_stack.empty()) {\n        std::string action = undo_stack.top();\n        undo_stack.pop();\n        redo_stack.push(action);\n        std::cout << \"تراجع: \" << action << '\\n';\n    }\n\n    // إعادة\n    if (!redo_stack.empty()) {\n        std::string action = redo_stack.top();\n        redo_stack.pop();\n        undo_stack.push(action);\n        std::cout << \"إعادة: \" << action << '\\n';\n    }\n}`,
      "explanationArabic": "نمط undo/redo يستخدم مكدسين: undo_stack يحفظ العمليات، وعند التراجع يُنقل العنصر لـ redo_stack. كل عملية جديدة تُفرّغ redo_stack لأن سلسلة الإعادة تنقطع. هذا النمط شائع في محررات النصوص وتطبيقات الرسم."
    }
  ],

  "std::span": [
    {
      "titleArabic": "تمرير جزء من مصفوفة بدون نسخ",
      "code": `#include <span>\n#include <vector>\n#include <iostream>\n\n// يقبل أي حاوية أو صفيف — لا نسخ\nvoid print_slice(std::span<const int> data) {\n    for (int x : data) std::cout << x << ' ';\n    std::cout << '\\n';\n}\n\nint main() {\n    std::vector<int> v = {0, 1, 2, 3, 4, 5};\n\n    print_slice(v);                    // كل العناصر\n    print_slice(std::span{v}.subspan(2, 3));  // العناصر 2,3,4\n    // المخرج: 0 1 2 3 4 5\n    //         2 3 4\n}`,
      "explanationArabic": "span يحمل مؤشرًا وحجمًا فقط — لا يملك البيانات. subspan(offset, count) يُنشئ span جديد يشير لجزء من البيانات الأصلية. const int يعني القراءة فقط. مفيد جدًا في واجهات الدوال التي تقبل أجزاءً من حاويات مختلفة (vector، array، صفيف C) بنفس التوقيع."
    },
    {
      "titleArabic": "تعديل عناصر عبر span غير ثابت",
      "code": `#include <span>\n#include <array>\n#include <iostream>\n\n// span بدون const يسمح بالتعديل\nvoid scale(std::span<float> data, float factor) {\n    for (auto& v : data) {\n        v *= factor;  // يُعدّل الأصل مباشرة\n    }\n}\n\nint main() {\n    std::array<float, 4> colors = {0.2f, 0.4f, 0.6f, 1.0f};\n\n    scale(colors, 2.0f);  // تمرير array مباشرة — يتحول ضمنيًا لـ span\n\n    for (float c : colors) std::cout << c << ' ';\n    // المخرج: 0.4 0.8 1.2 2\n}`,
      "explanationArabic": "std::array يتحول ضمنيًا لـ span عند التمرير. span<float> بدون const يسمح بتعديل العناصر الأصلية عبر المرجع. هذا أنسب من تمرير vector& لأنه يقبل array وصفائف C أيضًا بنفس الدالة."
    },
    {
      "titleArabic": "استخدام span مع صفائف C الخام",
      "code": `#include <span>\n#include <iostream>\n\n// تقبل صفيف C وvector وarray بنفس التوقيع\nvoid process(std::span<const double> values) {\n    double sum = 0.0;\n    for (double v : values) sum += v;\n    std::cout << \"المعدل: \" << sum / values.size() << '\\n';\n}\n\nint main() {\n    double arr[] = {10.0, 20.0, 30.0, 40.0, 50.0};\n    process(arr);  // صفيف C — يتحول ضمنيًا\n\n    // يمكن تحديد الحجم يدويًا لو أردت جزءًا فقط\n    process(std::span<double>{arr, 3});  // أول 3 عناصر فقط\n    // المخرج: المعدل: 30\n    //         المعدل: 20\n}`,
      "explanationArabic": "صفيف C يتضائل ضمنيًا لـ span عند التمرير كمعامل. span يلتقط الحجم عبر قالب المُنشئ. عند الحاجة لجزء فقط، مرر span مع مؤشر وحجم. هذا يحل مشكلة قديمة في C++ حيث كان يجب تمرير صفيف C مع حجم منفصل."
    }
  ],

  "std::unique_ptr": [
    {
      "titleArabic": "إنشاء ونقل الملكية",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    // make_unique أنسب من new مباشرة\n    auto ptr = std::make_unique<int>(42);\n    std::cout << *ptr << '\\n';  // 42\n\n    // نقل الملكية — ptr يصبح فارغًا بعد النقل\n    auto ptr2 = std::move(ptr);\n\n    // std::cout << *ptr;  // ❌ خطأ: ptr فارغ الآن\n    std::cout << *ptr2 << '\\n';  // 42\n    // ptr2 يُحرر تلقائيًا عند خروج main\n}`,
      "explanationArabic": "unique_ptr يمتلك كائنًا حصريًا: لا يمكن وجود نسختين تشيران لنفس الكائن. std::move ينقل الملكية من ptr لـ ptr2 ويترك ptr فارغًا (nullptr). عند انتهاء عمر ptr2، يُستدعى delete تلقائيًا. لا كلفة إضافية مقارنة new/delete اليدوي."
    },
    {
      "titleArabic": "unique_ptr مع مصفوفة",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    // [] في القالب تعني أن delete[] سيُستدعى لا delete\n    auto arr = std::make_unique<int[]>(5);\n\n    for (int i = 0; i < 5; ++i) {\n        arr[i] = i * 10;\n    }\n\n    for (int i = 0; i < 5; ++i) {\n        std::cout << arr[i] << ' ';\n    }\n    // المخرج: 0 10 20 30 40\n\n    // لا يوجد operator* — الوصول بفهرس فقط\n    // arr.get() يُرجع المؤشر الخام عند الحاجة\n}`,
      "explanationArabic": "make_unique<int[]>(n) يُخصّص مصفوفة ديناميكية. الفرق عن make_unique<int>(n): الأول يُنشئ n عنصرًا مهيأة بصفر، والثاني يُنشئ عنصرًا واحدًا بقيمة n. التدمير يستدعي delete[] تلقائيًا. استخدم vector بدلًا من ذلك عادةً لأنه أكثر مرونة."
    },
    {
      "titleArabic": "استخدامه في البُنى كملكية حصرية",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Device {\n    std::string name;\n    Device(const std::string& n) : name(n) {\n        std::cout << \"إنشاء: \" << name << '\\n';\n    }\n    ~Device() {\n        std::cout << \"تدمير: \" << name << '\\n';\n    }\n};\n\nstruct Application {\n    std::unique_ptr<Device> gpu;  // يملك GPU حصريًا\n\n    Application() : gpu(std::make_unique<Device>(\"Vulkan GPU\")) {}\n};\n\nint main() {\n    Application app;\n    // app.gpu يُحرر تلقائيًا عند تدمير app\n    // المخرج:\n    // إنشاء: Vulkan GPU\n    // تدمير: Vulkan GPU\n}`,
      "explanationArabic": "في البُنى، unique_ptr يُصرّح عن ملكية حصرية: التطبيق يملك الجهاز ولا يشاركه. عند تدمير Application، يُدمّر gpu تلقائيًا (RAII). هذا يمنع النسيان وضمان التحرير حتى عند استثناءات. استخدم مؤشر خام فقط عند عدم وجود ملكية واضحة."
    }
  ],

  "std::shared_ptr": [
    {
      "titleArabic": "ملكية مشتركة عبر عداد مرجعي",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    auto ptr1 = std::make_shared<int>(100);\n    std::cout << \"عدد المراجع: \" << ptr1.use_count() << '\\n';  // 1\n\n    {\n        auto ptr2 = ptr1;  // نسخ — يزيد العداد\n        std::cout << \"عدد المراجع: \" << ptr1.use_count() << '\\n';  // 2\n    }\n    // ptr2 دُمّر — العداد ينقص\n    std::cout << \"عدد المراجع: \" << ptr1.use_count() << '\\n';  // 1\n    // الكائن يُحرر عند انتهاء ptr1\n}`,
      "explanationArabic": "shared_ptr يستخدم عدادًا مرجعيًا: كل نسخة تزيده، وكل تدمير ينقصه. عندما يصل للصفر يُحرر الكائن. make_shared أنسب من shared_ptr(new ...) لأنه يُخصّص الكائن والعداد في تخصيص واحد. استخدم unique_ptr افتراضيًا وshared_ptr فقط عند الحاجة الفعلية للملكية المشتركة."
    },
    {
      "titleArabic": "كائن مشترك بين عدة وحدات",
      "code": `#include <memory>\n#include <string>\n#include <iostream>\n\nstruct Texture {\n    std::string name;\n    Texture(const std::string& n) : name(n) {\n        std::cout << \"تحميل: \" << name << '\\n';\n    }\n    ~Texture() {\n        std::cout << \"تحرير: \" << name << '\\n';\n    }\n};\n\nvoid use_texture(std::shared_ptr<Texture> tex) {\n    std::cout << \"استخدام: \" << tex->name\n              << \" (مراجع: \" << tex.use_count() << \")\\n\";\n}\n\nint main() {\n    auto tex = std::make_shared<Texture>(\"أرضية\");\n    use_texture(tex);\n    use_texture(tex);\n    // التحميل مرة واحدة فقط رغم الاستخدام المتعدد\n    // المخرج:\n    // تحميل: أرضية\n    // استخدام: أرضية (مراجع: 2)\n    // استخدام: أرضية (مراجع: 2)\n    // تحرير: أرضية\n}`,
      "explanationArabic": "كل استدعاء use_texture يُنشئ نسخة shared_ptr مؤقتة (العداد يزداد ثم ينقص عند العودة). الكائن يبقى حيًا طالما هناك مرجع واحد على الأقل. هذا مفيد للموارد المكلفة مثل النسيج الذي تستخدمه عدة كائنات ولا تريد تحميله عدة مرات."
    },
    {
      "titleArabic": "خطأ شائع: حلقة مرجعية",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Node;\n\nstruct Node {\n    std::shared_ptr<Node> next;  // ملكية للعقدة التالية\n    // std::shared_ptr<Node> prev;  // ❌ لو أضفت هذا ستحدث حلقة!\n    ~Node() { std::cout << \"تدمير عقدة\\n\"; }\n};\n\nint main() {\n    auto a = std::make_shared<Node>();\n    auto b = std::make_shared<Node>();\n    a->next = b;\n    // b->next = a;  // ❌ حلقة مرجعية — لن يُدمَّر أي شيء!\n\n    // ✅ الحل: استخدم weak_ptr للرابط الخلفي\n    // std::weak_ptr<Node> prev;\n\n    std::cout << \"مراجع a: \" << a.use_count() << '\\n';\n    std::cout << \"مراجع b: \" << b.use_count() << '\\n';\n    // عند الخروج: كلاهما يُدمَّر لأنه لا حلقة\n}\n// المخرج: تدمير عقدة (مرتين)`,
      "explanationArabic": "الحلقة المرجعية تحدث عندما يشير A لـ B بش shared_ptr وB يشير لـ A بش shared_ptr. العداد لا يصل للصفر أبدًا فلا يُحرر أي شيء — تسريب ذاكرة. الحل: استخدم weak_ptr في أحد الاتجاهين (عادة الخلفي). weak_ptr لا يزيد العداد."
    }
  ],

  "std::weak_ptr": [
    {
      "titleArabic": "مراقبة كائن بدون إطالة عمره",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    std::weak_ptr<int> observer;  // فارغ — لا يشير لشيء\n\n    {\n        auto sp = std::make_shared<int>(99);\n        observer = sp;  // يشير لنفس الكائن لكن لا يزيد العداد\n        std::cout << \"use_count: \" << sp.use_count() << '\\n';  // 1 (ليس 2!)\n    }\n    // sp دُمّر — الكائن تحرر لأن weak_ptr لا يُطيل العمر\n\n    if (observer.expired()) {\n        std::cout << \"الكائن لم يعد حيًا\\n\";\n    }\n}`,
      "explanationArabic": "weak_ptr مراقب فقط: لا يزيد العداد المرجعي ولا يمنع التحرير. expired() تُخبر إن كان الكائن لا يزال حيًا. إن حاولت الوصول عبر *observer مباشرة ستحصل على خطأ — يجب استخدام lock() أولًا."
    },
    {
      "titleArabic": "lock للحصول على shared_ptr مؤقت",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    auto shared = std::make_shared<int>(42);\n    std::weak_ptr<int> weak = shared;\n\n    // lock() يُنشئ shared_ptr مؤقت إن كان الكائن حيًا\n    if (auto locked = weak.lock()) {\n        std::cout << \"القيمة: \" << *locked << '\\n';\n        std::cout << \"مراجع: \" << locked.use_count() << '\\n';  // 2 مؤقتًا\n    }\n    // locked دُمّر — العداد يعود لـ 1\n\n    shared.reset();  // تحرير الكائن\n\n    if (auto locked = weak.lock()) {\n        std::cout << \"لن يصل هنا\\n\";\n    } else {\n        std::cout << \"الكائن تحرر\\n\";\n    }\n}`,
      "explanationArabic": "lock() يُرجع shared_ptr فارغ إن كان الكائن قد تحرر. هذا أنمط الاستخدام الأساسي: lock ثم فحص ثم استخدام. lock يزيد العداد مؤقتًا فقط — عند خروج locked من النطاق يعود للوضع السابق. هذا يضمن أن الكائن لن يُحرر أثناء استخدامك."
    },
    {
      "titleArabic": "كسر الحلقة المرجعية في بنية شجرة",
      "code": `#include <memory>\n#include <string>\n#include <iostream>\n#include <vector>\n\nstruct TreeNode {\n    std::string name;\n    std::vector<std::shared_ptr<TreeNode>> children;\n    std::weak_ptr<TreeNode> parent;  // weak_ptr يكسر الحلقة\n\n    TreeNode(const std::string& n) : name(n) {\n        std::cout << \"إنشاء: \" << name << '\\n';\n    }\n    ~TreeNode() {\n        std::cout << \"تدمير: \" << name << '\\n';\n    }\n};\n\nint main() {\n    auto root = std::make_shared<TreeNode>(\"جذر\");\n    auto child = std::make_shared<TreeNode>(\"فرع\");\n\n    child->parent = root;    // weak_ptr — لا يزيد العداد\n    root->children.push_back(child);\n\n    // لا حلقة مرجعية: كل شيء يُدمَّر عند الخروج\n}\n// المخرج: تدمير: فرع ثم تدمير: جذر`,
      "explanationArabic": "في بنية شجرة، الأبناء يملكونهم الآباء عبر shared_ptr (لأن عمر الأب أطول). الآباء لا يملكون الأبناء بل يشيرون لهم عبر weak_ptr. هذا يمنع الحلقة لأن weak_ptr لا يزيد العداد. عند تدمير root، يت破坏 children فيُحرر child، ثم root نفسه يُحرر."
    }
  ],

  "std::enable_shared_from_this": [
    {
      "titleArabic": "الحاجة الأساسية: إرجاع shared_ptr للكائن نفسه",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Node : public std::enable_shared_from_this<Node> {\n    std::string name;\n\n    Node(const std::string& n) : name(n) {}\n\n    // إرجاع shared_ptr يشير لنفس الكائن بأمان\n    std::shared_ptr<Node> get_self() {\n        return shared_from_this();\n    }\n};\n\nint main() {\n    auto node = std::make_shared<Node>(\"عقدة\");\n    auto self = node->get_self();\n    std::cout << \"نفس الكائن: \" << (node.get() == self.get()) << '\\n';\n    std::cout << \"مراجع: \" << node.use_count() << '\\n';  // 2\n}`,
      "explanationArabic": "بدون enable_shared_from_this، إن كتبت return std::shared_ptr<Node>(this) ستُنشئ عدادًا مرجعيًا ثانيًا مستقلًا مما يُسبب تحريرًا مزدوجًا. shared_from_this() يُرجع shared_ptr يشارك نفس العداد الأصلي. الشرط: يجب إنشاء الكائن عبر make_shared لا new."
    },
    {
      "titleArabic": "تسجيل الكائن نفسه في حاوية خارجية",
      "code": `#include <memory>\n#include <vector>\n#include <string>\n#include <iostream>\n\nstruct Widget : public std::enable_shared_from_this<Widget> {\n    std::string id;\n    Widget(const std::string& i) : id(i) {}\n\n    void register_self(std::vector<std::shared_ptr<Widget>>& registry) {\n        // shared_from_this() يُنشئ shared_ptr يشترك نفس العداد\n        registry.push_back(shared_from_this());\n    }\n};\n\nint main() {\n    std::vector<std::shared_ptr<Widget>> widgets;\n\n    auto w = std::make_shared<Widget>(\"W001\");\n    w->register_self(widgets);\n\n    std::cout << \"مراجع: \" << w.use_count() << '\\n';  // 2\n    std::cout << \"في السجل: \" << widgets[0]->id << '\\n';  // W001\n}`,
      "explanationArabic": "عندما يحتاج الكائن إضافة نفسه لحاوية خارجية، shared_from_this() يضمن أن كل shared_ptr يشترك نفس العداد. هذا يمنع التحرير المبكر والتحرير المزدوج. السجل widgets والكائن w يشيران لنفس الكائن بنفس العداد."
    },
    {
      "titleArabic": "خطأ شائع: استخدامه مع كائن ليس على الكومة",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Bad : public std::enable_shared_from_this<Bad> {\n    void try_self() {\n        // ❌ خطأ فادح: shared_from_this() يفترض أن الكائن مُدار بـ shared_ptr\n        // auto p = shared_from_this();  // std::bad_weak_ptr!\n    }\n};\n\nint main() {\n    Bad obj;  // على المكدس — ليس مُدارًا بـ shared_ptr\n    // obj.try_self();  // سيلقي bad_weak_ptr\n\n    // ✅ الصحيح: يجب إنشاؤه عبر make_shared\n    auto good = std::make_shared<Bad>();\n    auto p = good->shared_from_this();  // يعمل\n    std::cout << \"آمن\\n\";\n}`,
      "explanationArabic": "enable_shared_from_this يفحص داخليًا أن الكائن مُدار بـ shared_ptr عبر weak_ptr مخفي. إن لم يكن كذلك (كائن على المكدس أو أنشئ بـ new مباشرة)، يُرمى bad_weak_ptr. القاعدة: إن ورّثت enable_shared_from_this فأنشئ الكائن دائمًا عبر make_shared."
    }
  ],

  "std::make_unique": [
    {
      "titleArabic": "إنشاء مؤشر فريد لنوع بسيط",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    // أنسب من: auto ptr = unique_ptr<int>(new int(42));\n    auto ptr = std::make_unique<int>(42);\n    std::cout << *ptr << '\\n';  // 42\n\n    // لنوع بدون معاملات: make_unique<T>()\n    auto ptr2 = std::make_unique<double>();\n    std::cout << *ptr2 << '\\n';  // 0 (تهيئة افتراضية)\n}`,
      "explanationArabic": "make_unique أفضل من new لسببين: يضع التخصيص في تعبير واحد (لا خطر تسريب إذا حدث استثناء بين new والمُنشئ)، وهو أوضح لأنه يصرح بالنية. متوفر من C++14. لا يوجد make_unique مع مصفوفة بتهيئة مخصصة — استخدم vector بدلًا من ذلك."
    },
    {
      "titleArabic": "إنشاء كائن بمعاملات مُنشئ",
      "code": `#include <memory>\n#include <string>\n#include <iostream>\n\nstruct Config {\n    std::string name;\n    int width;\n    int height;\n    Config(const std::string& n, int w, int h)\n        : name(n), width(w), height(h) {}\n};\n\nint main() {\n    // المعاملات تُمرر مباشرة لمُنشئ Config\n    auto cfg = std::make_unique<Config>(\"نافذة\", 800, 600);\n\n    std::cout << cfg->name << \": \"\n              << cfg->width << \"x\" << cfg->height << '\\n';\n    // المخرج: نافذة: 800x600\n}`,
      "explanationArabic": "make_unique يُمرر المعاملات للمُنشئ بنفس طريقة emplace_back في vector. هذا يعني أن الأنواع التي لا تملك مُنشئ نسخ يمكن إنشاؤها مباشرة. لا حاجة لتحديد النوع بشكل كامل — المترجم يستنتجه من المعاملات."
    },
    {
      "titleArabic": "لماذا make_unique أفضل من new",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Resource {\n    Resource() { std::cout << \"تخصيص\\n\"; }\n    ~Resource() { std::cout << \"تحرير\\n\"; }\n};\n\n// ❌ خطر تسريب: لو رمى foo استثناءً قبل المُنشئ\n// void bad() {\n//     auto p = std::unique_ptr<Resource>(new Resource());  // تخصيص\n//     throw std::runtime_error(\"خطأ\");  // تسريب! unique_ptr لم يُبنَ بعد\n// }\n\n// ✅ آمن: make_unique تخصيص وبناء في خطوة واحدة\nvoid good() {\n    auto p = std::make_unique<Resource>();  // لا تسريب حتى مع استثناء\n}\n\nint main() {\n    good();\n    // المخرج: تخصيص ثم تحرير\n}`,
      "explanationArabic": "new Resource() يُخصّص الذاكرة فورًا. إن حدث استثناء قبل بناء unique_ptr (مثلاً في معامل آخر لنفس السطر)، تُسرّب الذاكرة. make_unique يجمع التخصيص والبناء في تعبير واحد مستثنى، فلا فجوة للتسريب. هذا هو السبب التقني الرئيسي لتفضيل make_unique."
    }
  ],

  "std::make_shared": [
    {
      "titleArabic": "إنشاء shared_ptr بكفاءة",
      "code": `#include <memory>\n#include <string>\n#include <iostream>\n\nint main() {\n    // تخصيص واحد للكائن والعداد المرجعي معًا\n    auto ptr = std::make_shared<std::string>(\"Atlas Guide\");\n\n    std::cout << *ptr << '\\n';\n    std::cout << \"مراجع: \" << ptr.use_count() << '\\n';  // 1\n}`,
      "explanationArabic": "make_shared يُخصّص الكائن وكتلة التحكم (العداد المرجعي والweak_ptr counter) في تخصيص واحد. هذا أسرع من shared_ptr(new T(...)) الذي يحتاج تخصيصين منفصلين. كما أنه أوضح ويمنع نفس مشكلة التسريب الموجودة مع new."
    },
    {
      "titleArabic": "مشاركة بين عدة مُلاك",
      "code": `#include <memory>\n#include <vector>\n#include <string>\n#include <iostream>\n\nstruct Image {\n    std::string path;\n    Image(const std::string& p) : path(p) {\n        std::cout << \"تحميل: \" << path << '\\n';\n    }\n    ~Image() { std::cout << \"تحرير: \" << path << '\\n'; }\n};\n\nint main() {\n    auto img = std::make_shared<Image>(\"texture.png\");\n\n    std::vector<std::shared_ptr<Image>> users;\n    users.push_back(img);  // نسخة 1\n    users.push_back(img);  // نسخة 2\n\n    std::cout << \"مراجع: \" << img.use_count() << '\\n';  // 3\n    // التحميل مرة واحدة رغم 3 مراجع\n}\n// المخرج: تحميل ثم تحرير (مرة واحدة)\n`,
      "explanationArabic": "كل نسخة shared_ptr تزيد العداد لكن لا تُنشئ كائنًا جديدًا. الكائن يبقى في الذاكرة مرة واحدة ويُحرر عند وصول العداد للصفر. هذا نمط شائع للموارد المكلفة: حمّل مرة واحدة وشارك عبر shared_ptr."
    },
    {
      "titleArabic": "عيب make_shared: تأخير التحرير",
      "code": `#include <memory>\n#include <iostream>\n\nstruct Large {\n    char data[1024];\n    Large() { std::cout << \"تخصيص كبير\\n\"; }\n    ~Large() { std::cout << \"تحرير كبير\\n\"; }\n};\n\nint main() {\n    std::weak_ptr<Large> weak;\n\n    {\n        auto sp = std::make_shared<Large>();\n        weak = sp;\n    }\n    // sp دُمّر لكن الذاكرة لم تُحرر بعد!\n    // لأن كتلة التحكم والكائن في نفس التخصيص\n    // و weak_ptr لا يزال يحتاج كتلة التحكم\n\n    std::cout << \"قبل إعادة weak_ptr\\n\";\n    weak.reset();  // الآن فقط تُحرر الذاكرة كلها\n    std::cout << \"بعد إعادة weak_ptr\\n\";\n}`,
      "explanationArabic": "make_shared يضع الكائن وكتلة التحكم في تخصيص واحد متجاوز. حتى لو لم يبقَ أي shared_ptr، الذاكرة لا تُحرر طالما وجود weak_ptr لأن كتلة التحكم لا يمكن فصلها عن الكائن. مع كائن كبير، هذا يعني تأخير تحرير كمية كبيرة من الذاكرة. الحل: استخدم shared_ptr(new Large(...)) إن كانت هذه مشكلة حقيقية."
    }
  ],

  "std::function": [
    {
      "titleArabic": "تخزين دالة lambda",
      "code": `#include <functional>\n#include <iostream>\n\nint main() {\n    // std::function يخزن أي شيء قابل للاستدعاء بهذا التوقيع\n    std::function<int(int, int)> add = [](int a, int b) { return a + b; };\n    std::cout << add(3, 4) << '\\n';  // 7\n\n    // يمكن إعادة تعيينه لدالة أخرى\n    add = [](int a, int b) { return a * b; };\n    std::cout << add(3, 4) << '\\n';  // 12\n}`,
      "explanationArabic": "std::function يتغلف أي كائن قابل للاستدعاء (lambda، دالة عادية، دالة عضو، كائن به operator()) بنفس التوقيع. يمكن إعادة تعيينه في وقت التشغيل. الكلفة: قد يُخصص ذاكرة على الكومة للتخزين الداخلي، لذلك لا تستخدمه في الأماكن الحرجة إن أمكن استخدام template بدلًا من ذلك."
    },
    {
      "titleArabic": "رد اتصال (callback) في واجهة برمجية",
      "code": `#include <functional>\n#include <string>\n#include <iostream>\n\nstruct Button {\n    std::function<void()> on_click;  // رد اتصال — يمكن أن يكون أي شيء\n};\n\nint main() {\n    Button save_btn;\n    save_btn.on_click = [] { std::cout << \"تم الحفظ\\n\"; };\n\n    Button load_btn;\n    std::string filename = \"data.bin\";\n    load_btn.on_click = [&filename] {\n        std::cout << \"تحميل: \" << filename << '\\n';\n    };\n\n    // محاكاة النقر\n    save_btn.on_click();  // تم الحفظ\n    load_btn.on_click();  // تحميل: data.bin\n}`,
      "explanationArabic": "std::function كحقل في بنية يسمح بتغيير السلوك ديناميكيًا. كل زر يمكنه حمل رد اتصال مختلف. Lambda الذي يلتقط filename بالمرجع (&filename) يتذكر المتغير المحلي. تأكد أن المتغيرات الملتققة بالمرجع تبقى حية عند استدعاء رد الاتصال."
    },
    {
      "titleArabic": "مقارنة مع template — متى تستخدم أيهما",
      "code": `#include <functional>\n#include <iostream>\n\n// template: لا كلفة، لكن يجب أن يكون في Header\ntemplate<typename Func>\nvoid apply_template(int x, Func f) {\n    f(x);\n}\n\n// std::function: كلفة صغيرة، لكن يمكن أن يكون في ملف .cpp\nvoid apply_function(int x, std::function<void(int)> f) {\n    f(x);\n}\n\nint main() {\n    int counter = 0;\n    auto lambda = [&counter](int x) { counter += x; };\n\n    apply_template(5, lambda);\n    apply_function(5, lambda);\n\n    std::cout << counter << '\\n';  // 10\n\n    // القاعدة: استخدم template للأداء، std::function عند الحاجة\n    // لتخزين الدالة أو تمريرها عبر حدود واجهة غير قالبية\n}`,
      "explanationArabic": "template يُنسخ لكل نوع استدعاء — لا كلفة وقت التشغيل لكن يزيد حجم الكود ويجبر الدالة في header. std::function يُخفي النوع خلف غلاف — كلفة صغيرة (تخصيص محتمل + استدعاء غير مباشر) لكنه أكثر مرونة. استخدم template افتراضيًا وstd::function عند الحاجة لتخزين الدالة أو تمريرها عبر واجهة غير قالبية."
    }
  ],

  "std::move": [
    {
      "titleArabic": "نقل ملكية حاوية",
      "code": `#include <utility>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> a = {1, 2, 3, 4, 5};\n\n    // std::move يحوّل a إلى rval — النقل يسرق مواردها\n    std::vector<int> b = std::move(a);\n\n    std::cout << \"b size: \" << b.size() << '\\n';  // 5\n    std::cout << \"a size: \" << a.size() << '\\n';  // 0 — أُفرغت\n    // a في حالة صالحة لكن غير محددة — لا تعتمد على محتواها\n}`,
      "explanationArabic": "std::move لا ينقل شيئًا بنفسه — هو مجرد static_cast<T&&>. النقل الفعلي يتم في مُنشئ النقل أو عامل الإسناد بالنقل الذي يستقبل rval reference. بعد النقل، المصدر في حالة صالحة لكن غير محددة (يمكن تدميره أو إسناد قيمة جديدة له لكن لا تقرأ قيمته)."
    },
    {
      "titleArabic": "نقل unique_ptr",
      "code": `#include <memory>\n#include <utility>\n#include <iostream>\n\nint main() {\n    auto ptr = std::make_unique<int>(100);\n\n    // unique_ptr لا يُنسخ — يجب النقل\n    // auto copy = ptr;           // ❌ خطأ ترجمة\n    auto owned = std::move(ptr);  // ✅ نقل الملكية\n\n    // ptr الآن فارغ\n    if (!ptr) std::cout << \"ptr فارغ\\n\";\n    std::cout << *owned << '\\n';  // 100\n}`,
      "explanationArabic": "unique_ptr يحذف مُنشئ النسخ لفرض الملكية الحصرية. std::move يحوّل ptr إلى rval reference فيستدعي مُنشئ النقل. بعد النقل ptr فارغ (nullptr). هذا الأنموذج الأساسي لاستخدام std::move: نقل ملكية كائن لا يدعم النسخ."
    },
    {
      "titleArabic": "خطأ شائع: النقل عندما لا تحتاج",
      "code": `#include <utility>\n#include <string>\n#include <iostream>\n\nvoid take_string(std::string s) {  // نقل بالقيمة\n    std::cout << s << '\\n';\n}\n\nint main() {\n    std::string msg = \"مرحبا\";\n\n    // ❌ لا داعي لـ move هنا: s يأخذ نسخة ثم النقل لا يفيد\n    // take_string(std::move(msg));  // msg تُفرغ بلا فائدة\n\n    // ✅ الأفضل: نسخة عادية أو مرجع\n    take_string(msg);  // msg تبقى كما هي\n    std::cout << msg << '\\n';  // مرحبا — لا تزال صالحة\n\n    // ✅ استخدم move فقط عند الحاجة الفعلية: لنقل ملكية أو تجنب نسخ كبيرة\n    std::string big(10000, 'x');\n    take_string(std::move(big));  // هنا النقل مفيد — يتجنب نسخ 10000 محرف\n}`,
      "explanationArabic": "لا تضف std::move في كل مكان. استخدمها فقط عند: نقل ملكية (unique_ptr)، تمرير كائن كبير لدالة تأخذ بالقيمة ولن تحتاجه بعد ذلك، أو إرجاع متغير محلي من دالة (لكن المترجم يقوم بـ RVO تلقائيًا غالبًا). النقل غير الضروري يُفرغ متغيرًا قد تحتاجه لاحقًا."
    }
  ],

  "std::forward": [
    {
      "titleArabic": "Perfect forwarding في قالب غلاف",
      "code": `#include <utility>\n#include <string>\n#include <iostream>\n\nvoid process(std::string& s) { std::cout << \"lval: \" << s << '\\n'; }\nvoid process(std::string&& s) { std::cout << \"rval: \" << s << '\\n'; }\n\ntemplate<typename T>\nvoid wrapper(T&& arg) {\n    // std::forward يُمرر arg بنوعه الأصلي (lval أو rval)\n    process(std::forward<T>(arg));\n}\n\nint main() {\n    std::string lval = \"مرحبا\";\n    wrapper(lval);             // lval: مرحبا\n    wrapper(std::string(\"أهلا\"));  // rval: أهلا\n}`,
      "explanationArabic": "T&& مع template هو forwarding reference (ليس rval reference عاديًا). عندما تمرر lval، يستنتج T كـ std::string& فتصبح T&& = std::string& (مرجع lval). std::forward يُعيد تحويله لنوعه الأصلي. عندما تمرر rval، T = std::string وstd::forward يُمرره كـ rval."
    },
    {
      "titleArabic": "Forwarding في مُنشئ",
      "code": `#include <utility>\n#include <string>\n#include <iostream>\n\nstruct Wrapper {\n    std::string data;\n\n    // يُمرر المعامل لـ string بنفس نوعه الأصلي\n    template<typename T>\n    Wrapper(T&& arg) : data(std::forward<T>(arg)) {}\n};\n\nint main() {\n    std::string s = \"نقل\";\n    Wrapper w1(s);               // نسخ — لأن s lval\n    std::cout << s << '\\n';      // نقل — لا تزال صالحة\n\n    Wrapper w2(std::string(\"نقل حقيقي\"));  // نقل — لأنه rval\n    // لا يوجد متغير آخر يشير للنص الأصلي\n}`,
      "explanationArabic": "المُنشئ القالب يُمرر المعامل لـ data بنفس نوعه: إن كان lval فيُنسخ، وإن كان rval فيُنقل. هذا يوفر أقصى كفاءة: لا نسخ عند عدم الحاجة. معظم الحاويات القياسية تستخدم هذا النمط في مُنشئاتها وemplace_back."
    },
    {
      "titleArabic": "الفرق بين std::forward و std::move",
      "code": `#include <utility>\n#include <string>\n#include <iostream>\n\nvoid take_rval(std::string&& s) {\n    std::cout << \"rval: \" << s << '\\n';\n}\n\nint main() {\n    std::string lval = \"test\";\n\n    // std::move يحوّل دائمًا لـ rval — حتى lval\n    // take_rval(std::move(lval));  // يعمل لكن يُفرغ lval\n\n    // std::forward يُمرر بنوعه الأصلي في سياق القالب فقط\n    // خارجه، std::forward<T>(x) ≈ std::move(x)\n\n    // القاعدة:\n    // std::move → استخدمها عندما تعرف أنك تريد نقل (لا في قالب عام)\n    // std::forward → استخدمها في القوالب لتمرير بنوعه الأصلي\n\n    std::cout << \"استخدم move للنقل الواضح، forward في القوالب\\n\";\n}`,
      "explanationArabic": "std::move دائمًا rval reference. std::forward مشروط: يُمرر lval كـ lval وrval كـ rval لكن فقط داخل قالب مع forwarding reference. خارج القالب، std::forward لا يختلف عن std::move عمليًا. لا تستبدل std::move بـ std::forward في الكود العادي."
    }
  ],

  "std::atomic": [
    {
      "titleArabic": "عداد ذري بسيط",
      "code": `#include <atomic>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::atomic<int> counter{0};\n\n    std::thread t1([&]() {\n        for (int i = 0; i < 100000; ++i) counter.fetch_add(1);\n    });\n    std::thread t2([&]() {\n        for (int i = 0; i < 100000; ++i) counter.fetch_add(1);\n    });\n\n    t1.join();\n    t2.join();\n    std::cout << counter.load() << '\\n';  // دائمًا 200000\n}`,
      "explanationArabic": "بدون atomic، ++counter بين خيطين يسبب حالة سباق (race condition) لأن القراءة والكتابة والزيادة ليست ذرية. fetch_add يجعل الزيادة ذرية: خيط واحد فقط يُنفذها في لحظة معينة. النتيجة دائمًا صحيحة. لكن atomic أبطأ من المتغير العادي بسبب حواجز الذاكرة."
    },
    {
      "titleArabic": "علم (flag) للتوقف النظيف",
      "code": `#include <atomic>\n#include <iostream>\n#include <thread>\n#include <chrono>\n\nint main() {\n    std::atomic<bool> running{true};\n\n    std::thread worker([&]() {\n        int count = 0;\n        while (running.load()) {  // قراءة ذرية\n            ++count;\n            if (count % 1000000 == 0) {\n                std::cout << \"يعمل...\\n\";\n            }\n        }\n        std::cout << \"توقف بعد: \" << count << '\\n';\n    });\n\n    std::this_thread::sleep_for(std::chrono::milliseconds(10));\n    running.store(false);  // كتابة ذرية\n    worker.join();\n}`,
      "explanationArabic": "atomic<bool> يضمن أن التغيير من خيط يُرى فورًا في خيط آخر بفضل حاجز الذاكرة. bool عادي قد يُخزَّن في مسجل المعالج ولا يُرى في الخيط الآخر. هذا النمط شائع لإيقاف خيوط العمل بشكل نظيف. load() وstore() هما القراءة والكتابة الذريتان."
    },
    {
      "titleArabic": "compare_exchange_weak للتحديث المشروط",
      "code": `#include <atomic>\n#include <iostream>\n\nint main() {\n    std::atomic<int> value{10};\n\n    int expected = 10;\n    // يُغيّر القيمة لـ 20 فقط إذا كانت تساوي expected (10)\n    // إن نجح يُحدّث expected للقيمة القديمة\n    bool changed = value.compare_exchange_weak(expected, 20);\n    std::cout << std::boolalpha;\n    std::cout << \"نجح: \" << changed << '\\n';       // true\n    std::cout << \"القيمة: \" << value.load() << '\\n';  // 20\n\n    // المحاولة الثانية: expected الآن 20 لكن القيمة 20\n    changed = value.compare_exchange_weak(expected, 30);\n    std::cout << \"نجح: \" << changed << '\\n';       // true\n    std::cout << \"القيمة: \" << value.load() << '\\n';  // 30\n}`,
      "explanationArabic": "compare_exchange_weak يُنفذ عملية ذرية: \"إن كانت القيمة تساوي expected، غيّرها لـ new_value\". إن فشلت (قيمة مختلفة)، يُحدّث expected للقيمة الفعلية. هذا أساس خوارزميات التزامن الخالية من القفل (lock-free). weak قد يفشل وهميًا (spurious failure) لذلك يُستخدم في حلقة."
    }
  ],

  "std::thread": [
    {
      "titleArabic": "تشغيل دالة في خيط منفصل",
      "code": `#include <thread>\n#include <iostream>\n\nvoid work(int id) {\n    std::cout << \"خيط \" << id << \" يبدأ\\n\";\n    // محاكاة عمل\n    for (volatile int i = 0; i < 10000000; ++i) {}\n    std::cout << \"خيط \" << id << \" ينتهي\\n\";\n}\n\nint main() {\n    std::thread t1(work, 1);\n    std::thread t2(work, 2);\n\n    t1.join();  // انتظر انتهاء t1\n    t2.join();  // انتظر انتهاء t2\n\n    std::cout << \"الكل انتهى\\n\";\n}`,
      "explanationArabic": "std::thread يُنشئ خيط تنفيذ حقيقي لنظام التشغيل. المعاملات تُمرر لـ work بعد المعرف. join() يحجب الخيط الرئيسي حتى ينتهي الخيط الفرعي. إن نسيت join() أو detach()، المُدمّر سيستدعي std::terminate. انتبه: المرور بمرجع يتطلب std::ref."
    },
    {
      "titleArabic": "استخدام lambda مع الالتقاط",
      "code": `#include <thread>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::string message = \"مرحبا من الخيط\";\n    int result = 0;\n\n    // lambda يلتقط بالمرجع — يجب أن تبقى المتغيرات حية!\n    std::thread t([&message, &result]() {\n        std::cout << message << '\\n';\n        result = 42;\n    });\n\n    t.join();\n    std::cout << \"النتيجة: \" << result << '\\n';\n    // المخرج: مرحبا من الخيط ثم النتيجة: 42\n}`,
      "explanationArabic": "Lambda يلتقط message وresult بالمرجع (&). هذا يعني أن الخيط يقرأ ويكتب المتغيرات الأصلية مباشرة. التحذير: إن انتهى عمر المتغير قبل انتهاء الخيط، سلوك غير معرّف. join() يضمن أن المتغيرات المحلية تبقى حية حتى ينتهي الخيط."
    },
    {
      "titleArabic": "خطأ شائع: مرجع لمتغير محلي مؤقت",
      "code": `#include <thread>\n#include <iostream>\n\nvoid bad_ref(int& val) {\n    val = 99;\n}\n\nint main() {\n    // ❌ خطأ: المرجع يمرر بدون std::ref\n    // std::thread t(bad_ref, 42);  // خطأ ترجمة — لا يمكن ربط rval بمرجع\n\n    int x = 0;\n    // ❌ خطر: إن انتهت x قبل انتهاء الخيط\n    // {\n    //     int local = 0;\n    //     std::thread t(bad_ref, std::ref(local));\n    //     t.detach();  // local ستنتهي والخيط لا يزال يعمل!\n    // }\n\n    // ✅ صحيح: مرجع لمتغير حي مع join\n    std::thread t(bad_ref, std::ref(x));\n    t.join();\n    std::cout << x << '\\n';  // 99\n}`,
      "explanationArabic": "تمرير مرجع لـ std::thread يتطلب std::ref() لأن الخيط ينسخ المعاملات افتراضيًا. الأخطر: detach() مع مرجع لمتغير محلي يعني أن الخيط قد يصل لمتغير مُدمَّر. القاعدة: لا تستخدم detach() مع مراجع لمتغيرات محلية. استخدم join() أو التقط بالقيمة."
    }
  ],

  "std::mutex": [
    {
      "titleArabic": "حماية قسم حرج",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n#include <vector>\n\nint main() {\n    int counter = 0;\n    std::mutex m;\n\n    std::vector<std::thread> threads;\n    for (int i = 0; i < 10; ++i) {\n        threads.emplace_back([&]() {\n            for (int j = 0; j < 10000; ++j) {\n                std::lock_guard<std::mutex> lock(m);  // قفل تلقائي\n                ++counter;  // قسم حرج — خيط واحد فقط في كل لحظة\n            }  // فتح تلقائي عند خروج النطاق\n        });\n    }\n\n    for (auto& t : threads) t.join();\n    std::cout << counter << '\\n';  // دائمًا 100000\n}`,
      "explanationArabic": "بدون mutex، ++counter بين خيوط متعددة يسبب حالة سباق. lock_guard يأخذ القفل عند البناء ويحرره عند الخروج (RAII). هذا يضمن أن قسمًا واحدًا فقط ينفذ في كل لحظة. لا تنسَ أن lock_guard يحمي فقط الكود داخل نطاقه — أي وصول لـ counter خارجه غير محمي."
    },
    {
      "titleArabic": "خطأ شائع: قفل غير كافٍ",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\nint main() {\n    int value = 0;\n    std::mutex m;\n\n    std::thread t1([&]() {\n        std::lock_guard<std::mutex> lock(m);\n        value = 10;  // محمي\n    });  // القفل يُفتح هنا\n\n    // ❌ خطأ: القراءة خارج القفل — حالة سباق محتملة\n    // if (t1.joinable()) t1.join();\n    // std::cout << value;  // قد لا يرى التغيير\n\n    t1.join();  // join يضمن أن t1 انتهى\n    // بعد join: لا حاجة لقفل لأن t1 لم يعد موجودًا\n    std::cout << value << '\\n';  // 10 — آمن بعد join\n}`,
      "explanationArabic": "القاعدة: تحتاج mutex فقط عندما يكون هناك وصول متزامن فعلي. بعد join()، الخيط الآخر انتهى فلا حاجة لقفل. الخطأ الشائع هو حماية الكتابة فقط دون القراءة، أو حماية جزء من العملية دون كلها. كل وصول متزامن لنفس البيانات يجب أن يكون محميًا بنفس القفل."
    },
    {
      "titleArabic": "تجنب القفل عند القراءة فقط إن أمكن",
      "code": `#include <mutex>\n#include <vector>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::vector<int> data = {1, 2, 3, 4, 5};\n    std::mutex m;\n    bool ready = false;\n\n    // الكاتب\n    std::thread writer([&]() {\n        std::lock_guard<std::mutex> lock(m);\n        data.push_back(6);\n        ready = true;\n    });\n\n    writer.join();\n    // بعد join: خيط واحد فقط — لا حاجة لقفل\n    for (int x : data) std::cout << x << ' ';\n    // المخرج: 1 2 3 4 5 6\n}`,
      "explanationArabic": "إذا كان يمكن هيكلة الكود بحيث يكون الوصول المتزامن محدودًا، فلن تحتاج mutex في كل مكان. الانضمام (join) يحول الوصول المتزامن إلى متسلسل. للقراءة المتعددة مع كتابة نادرة، استخدم shared_mutex مع shared_lock للقراءة وunique_lock للكتابة."
    }
  ],

  "std::recursive_mutex": [
    {
      "titleArabic": "قفل متداخل من نفس الخيط",
      "code": `#include <mutex>\n#include <iostream>\n\nstd::recursive_mutex rm;\n\nvoid inner() {\n    std::lock_guard<std::recursive_mutex> lock(rm);  // نفس الخيط يأخذ القفل مرة أخرى\n    std::cout << \"inner: القفل مأخوذ\\n\";\n}\n\nvoid outer() {\n    std::lock_guard<std::recursive_mutex> lock(rm);\n    std::cout << \"outer: القفل مأخوذ\\n\";\n    inner();  // لا توقف — نفس الخيط\n}\n\nint main() {\n    outer();\n    // المخرج:\n    // outer: القفل مأخوذ\n    // inner: القفل مأخوذ\n}`,
      "explanationArabic": "مع mutex عادي، نفس الخيط الذي يأخذ القفل ثم يحاول أخذه مرة أخرى سيتوقف (deadlock مع نفسه!). recursive_mutex يسمح بذلك: يُسجّل عدد مرات الأخذ ويحتاج نفس عدد مرات الإفلات. هذا مفيد عندما تستدعي دالة محمية دالة أخرى محمية بنفس القفل."
    },
    {
      "titleArabic": "عدد مرات القفل يجب أن يتطابق",
      "code": `#include <mutex>\n#include <iostream>\n\nint main() {\n    std::recursive_mutex rm;\n\n    rm.lock();   // المرة 1\n    rm.lock();   // المرة 2\n    std::cout << \"مأخوذ مرتين\\n\";\n\n    rm.unlock(); // المرة 1\n    rm.unlock(); // المرة 2 — الآن يُفتح فعليًا\n    std::cout << \"مفتوح\\n\";\n\n    // ❌ لو نسيت unlock واحدة، القفل لن يُفتح أبدًا\n}`,
      "explanationArabic": "recursive_mutex يتتبع عدادًا داخليًا: lock() يزيده وunlock() ينقصه. القفل يُفتح فعليًا فقط عند الوصول للصفر. لهذا السبب يُفضّل دائمًا lock_guard لأنه يضمن التطابق تلقائيًا عند خروج النطاق. لا تستخدم lock()/unlock() يدويًا إلا عند حاجة قوية."
    },
    {
      "titleArabic": "متى تحتاجه فعلاً — إعادة هيكلة الدوال",
      "code": `#include <mutex>\n#include <iostream>\n\nstruct Database {\n    std::recursive_mutex m;\n\n    void query(const std::string& sql) {\n        std::lock_guard<std::recursive_mutex> lock(m);\n        std::cout << \"استعلام: \" << sql << '\\n';\n        log_access();  // تستدعي دالة محمية أخرى — تحتاج recursive_mutex\n    }\n\n    void log_access() {\n        std::lock_guard<std::recursive_mutex> lock(m);\n        std::cout << \"تسجيل وصول\\n\";\n    }\n};\n\nint main() {\n    Database db;\n    db.query(\"SELECT * FROM users\");\n    // ✅ يعمل لأن recursive_mutex يسمح بالقفل المتداخل\n\n    // ⚠️ الأفضل: افصل log_access لعدم حاجته للقفل\n    // أو اجعلها دالة داخلية بدون قفل\n}`,
      "explanationArabic": "recursive_mutex حل سريع لكنه ليس الأفضل دائمًا. البديل: أعد هيكلة الكود بحيث لا تتداخل الأقفال. فصل log_access لطبقة خارجية أو جعلها دالة داخلية بدون قفل أنظف وأسرع. recursive_mutex أبطأ قليلًا من mutex العادي بسبب العداد الإضافي."
    }
  ],

  "std::shared_mutex": [
    {
      "titleArabic": "قراءة متوازية مع كتابة حصرية",
      "code": `#include <shared_mutex>\n#include <vector>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::vector<int> data = {1, 2, 3};\n    std::shared_mutex rw;\n\n    // عدة قراءات متوازية\n    auto read = [&](int id) {\n        std::shared_lock lock(rw);  // قفل مشترك — يسمح بقراءات أخرى\n        std::cout << \"قارئ \" << id << \": \";\n        for (int x : data) std::cout << x << ' ';\n        std::cout << '\\n';\n    };\n\n    // كتابة حصرية\n    auto write = [&]() {\n        std::unique_lock lock(rw);  // قفل حصري — ينتظر كل القراءات\n        data.push_back(4);\n        std::cout << \"كُتبت قيمة جديدة\\n\";\n    };\n\n    std::thread r1(read, 1);\n    std::thread r2(read, 2);\n    r1.join(); r2.join();\n    write();\n}`,
      "explanationArabic": "shared_lock يسمح لعدة خيوط بالقراءة في نفس الوقت. unique_lock ينتظر حتى تنتهي كل القراءات ثم يأخذ قفلًا حصريًا. هذا أفضل من mutex عادي عندما القراءات أكثر بكثير من الكتابات لأن القراءات لا تعطل بعضها."
    },
    {
      "titleArabic": "تحسين الأداء مع القراءات الكثيرة",
      "code": `#include <shared_mutex>\n#include <string>\n#include <iostream>\n#include <thread>\n#include <chrono>\n\nstruct Cache {\n    std::string value;\n    std::shared_mutex m;\n\n    std::string read() const {\n        std::shared_lock lock(m);  // قراءة متوازية ممكنة\n        return value;\n    }\n\n    void write(const std::string& new_val) {\n        std::unique_lock lock(m);  // كتابة حصرية\n        value = new_val;\n    }\n};\n\nint main() {\n    Cache cache;\n    cache.write(\"بيانات أولية\");\n\n    // 5 قراءات متوازية — لا تعطل بعضها\n    std::vector<std::thread> readers;\n    for (int i = 0; i < 5; ++i) {\n        readers.emplace_back([&]() {\n            std::cout << cache.read() << '\\n';\n        });\n    }\n    for (auto& t : readers) t.join();\n}`,
      "explanationArabic": "مع mutex عادي، الخيوط الخمسة تنتظر بالدور. مع shared_mutex، القراءات الخمس يمكن أن تحدث فعليًا بالتوازي. الكلفة: shared_mutex أكبر حجمًا وأبطأ قليلًا من mutex العادي. استخدمه فقط عندما القراءات المتوازية تُحدث فرقًا فعليًا في الأداء."
    },
    {
      "titleArabic": "خطأ: كتابة بقفل مشترك",
      "code": `#include <shared_mutex>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> data = {1, 2, 3};\n    std::shared_mutex rw;\n\n    // ❌ خطأ: shared_lock للقراءة فقط — لا تكتب!\n    // {\n    //     std::shared_lock lock(rw);\n    //     data.push_back(4);  // سلوك غير معرّف — تعديل بدون قفل حصري\n    // }\n\n    // ✅ صحيح: الكتابة تحت unique_lock\n    {\n        std::unique_lock lock(rw);\n        data.push_back(4);\n    }\n\n    // ✅ صحيح: القراءة تحت shared_lock\n    {\n        std::shared_lock lock(rw);\n        for (int x : data) std::cout << x << ' ';\n    }\n    // المخرج: 1 2 3 4\n}`,
      "explanationArabic": "shared_lock يضمن أن لا كاتب موجود لكنه لا يمنع قراءات أخرى. التعديل تحت shared_lock يعني أن عدة خيوط قد تُعدّل في نفس الوقت — ما يُلغي فائدة القفل. القاعدة: اقرأ تحت shared_lock، اكتب تحت unique_lock، ولا تخلط أبدًا."
    }
  ],

  "std::future": [
    {
      "titleArabic": "استقبال نتيجة غير متزامنة",
      "code": `#include <future>\n#include <iostream>\n\nint compute(int x) {\n    // محاكاة عمل مكلف\n    for (volatile int i = 0; i < 10000000; ++i) {}\n    return x * x;\n}\n\nint main() {\n    // async يُشغل compute في خيط ويعيد future لنتيجته\n    std::future<int> result = std::async(std::launch::async, compute, 5);\n\n    std::cout << \"ينفذ شيء آخر أثناء الانتظار...\\n\";\n\n    int value = result.get();  // يحجب حتى الجاهزية\n    std::cout << \"النتيجة: \" << value << '\\n';  // 25\n    // get() يُرجع بالتحريك — لا يمكن استدعاؤه مرتين\n}`,
      "explanationArabic": "future يمثل قيمة ستكون متاحة لاحقًا. get() يحجب (blocks) حتى تكتمل المهمة. std::launch::async يُجبر التنفيذ في خيط جديد (الافتراضي قد يؤخر التنفيذ). get() يُرجع بالتحريك — لا يمكن استدعاؤه أكثر من مرة على نفس future."
    },
    {
      "titleArabic": "wait_for للانتظار بمدة محددة",
      "code": `#include <future>\n#include <iostream>\n#include <chrono>\n\nint main() {\n    std::future<int> f = std::async(std::launch::async, []() {\n        std::this_thread::sleep_for(std::chrono::seconds(2));\n        return 42;\n    });\n\n    // انتظر ثانية واحدة فقط\n    auto status = f.wait_for(std::chrono::seconds(1));\n    if (status == std::future_status::timeout) {\n        std::cout << \"لم تنتهِ بعد — أفعل شيئًا آخر\\n\";\n    }\n\n    // انتظر الباقي\n    status = f.wait_for(std::chrono::seconds(2));\n    if (status == std::future_status::ready) {\n        std::cout << \"النتيجة: \" << f.get() << '\\n';\n    }\n}`,
      "explanationArabic": "wait_for ينتظر لمدة محددة ويُرجع الحالة: ready (انتهت)، timeout (لم تنتهِ بعد)، أو deferred (لم تبدأ بعد). مفيد لتنفيذ مهام أخرى أثناء الانتظار بدل الحجب الكامل. wait_until مشابه لكنه يأخذ نقطة زمنية بدل مدة."
    },
    {
      "titleArabic": "استقبال استثناء من المهمة",
      "code": `#include <future>\n#include <iostream>\n#include <stdexcept>\n\nint main() {\n    std::future<int> f = std::async(std::launch::async, []() {\n        throw std::runtime_error(\"خطأ في المهمة\");\n        return 0;  // لن يُنفذ\n    });\n\n    try {\n        int value = f.get();  // يُرمي الاستثناء هنا\n    } catch (const std::runtime_error& e) {\n        std::cout << \"مُلتقط: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "إن رمت المهمة استثناءً، يُخزّن في future ويُعاد رميه عند استدعاء get(). هذا يعني أن الأخطاء في الخيط الفرعي لا تضيع بل تُمرر للخيط الرئيسي. هذا أحد فوائد future/promise مقارنة بالخيوط الخام."
    }
  ],

  "std::promise": [
    {
      "titleArabic": "إرسال قيمة من خيط لآخر",
      "code": `#include <future>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::promise<int> prom;\n    std::future<int> fut = prom.get_future();  // ربط future بـ promise\n\n    std::thread producer([&]() {\n        // محاكاة عمل\n        for (volatile int i = 0; i < 10000000; ++i) {}\n        prom.set_value(42);  // إرسال القيمة\n    });\n\n    int value = fut.get();  // يحجب حتى set_value\n    std::cout << \"استلمت: \" << value << '\\n';\n\n    producer.join();\n}`,
      "explanationArabic": "promise وfuture يشكلان قناة اتصال ذات اتجاه واحد: promise يُرسل وfuture يستقبل. get_future() يُنشئ الربط. set_value() يُرسل القيمة ويُوقظ get() إن كان حاجبًا. كل promise يرتبط بـ future واحد فقط."
    },
    {
      "titleArabic": "إرسال استثناء",
      "code": `#include <future>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::promise<void> prom;\n    std::future<void> fut = prom.get_future();\n\n    std::thread worker([&]() {\n        try {\n            // محاكاة فشل\n            throw std::runtime_error(\"فشل الاتصال بقاعدة البيانات\");\n        } catch (...) {\n            prom.set_exception(std::current_exception());  // تمرير الاستثناء\n        }\n    });\n\n    try {\n        fut.get();  // يُرمي الاستثناء هنا\n    } catch (const std::runtime_error& e) {\n        std::cout << \"الخطأ: \" << e.what() << '\\n';\n    }\n\n    worker.join();\n}`,
      "explanationArabic": "set_exception يُرسل استثناء عبر القناة. std::current_exception() يلتقط الاستثناء الحالي في catch block. الطرف المستقبل يرى الاستثناء عند get() كأنه رُمي مباشرة فيه. هذا أنظف من تمرير أكواد خطأ يدويًا."
    },
    {
      "titleArabic": "متى تستخدم promise بدل async",
      "code": `#include <future>\n#include <iostream>\n#include <thread>\n\nint main() {\n    // std::async: بسيط لكن تحكم محدود\n    // std::promise: تحكم كامل — يمكنك set_value من أي مكان\n\n    // حالة: إرسال قيمة من داخل نظام معقد\n    std::promise<int> prom;\n    std::future<int> fut = prom.get_future();\n\n    std::thread t([&]() {\n        // منطق معقد...\n        bool success = true;\n        if (success) {\n            prom.set_value(100);\n        } else {\n            prom.set_value(-1);\n        }\n    });\n\n    std::cout << fut.get() << '\\n';\n    t.join();\n\n    // القاعدة: استخدم async للبساطة، promise للتحكم\n}`,
      "explanationArabic": "async يُشغل دالة ويُرجع future — بسيط لكن لا يمكنك التحكم بمتى تُرسل القيمة. promise يُعطيك التحكم الكامل: يمكنك set_value من أي نقطة في الكود، حتى من داخل نظام معقد أو رد اتصال. الفرق الرئيسي: مع async المهمة مرتبطة بدالة واحدة، مع promise يمكنك الإرسال من أي مكان."
    }
  ],

  "std::condition_variable": [
    {
      "titleArabic": "انتظار حتى يتحقق شرط",
      "code": `#include <condition_variable>\n#include <mutex>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::mutex m;\n    std::condition_variable cv;\n    bool ready = false;\n\n    std::thread waiter([&]() {\n        std::unique_lock lock(m);\n        cv.wait(lock, [&]() { return ready; });  // يحجب حتى ready == true\n        std::cout << \"استيقظ! البيانات جاهزة\\n\";\n    });\n\n    std::thread notifier([&]() {\n        std::this_thread::sleep_for(std::chrono::milliseconds(100));\n        {\n            std::lock_guard lock(m);\n            ready = true;\n        }\n        cv.notify_one();  // إيقاظ خيط واحد\n    });\n\n    waiter.join();\n    notifier.join();\n}`,
      "explanationArabic": "cv.wait(lock, predicate) يُحرر القفل، ينام، ثم عند الإيقاظ يعيد أخذ القفل ويفحص الشرط. إن كان false ينام مرة أخرى (حماية من إيقاظ وهمي). notify_one يُوقظ خيطًا واحدًا. يجب تعديل الشرط تحت القفل ثم الإيقاظ."
    },
    {
      "titleArabic": "نمط الإنتاج-الاستهلاك",
      "code": `#include <condition_variable>\n#include <mutex>\n#include <queue>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::queue<int> q;\n    std::mutex m;\n    std::condition_variable cv;\n    bool done = false;\n\n    std::thread consumer([&]() {\n        std::unique_lock lock(m);\n        while (!done || !q.empty()) {\n            cv.wait(lock, [&]() { return !q.empty() || done; });\n            while (!q.empty()) {\n                std::cout << \"استهلك: \" << q.front() << '\\n';\n                q.pop();\n            }\n        }\n    });\n\n    std::thread producer([&]() {\n        for (int i = 0; i < 5; ++i) {\n            {\n                std::lock_guard lock(m);\n                q.push(i);\n            }\n            cv.notify_one();\n        }\n        {\n            std::lock_guard lock(m);\n            done = true;\n        }\n        cv.notify_one();\n    });\n\n    producer.join();\n    consumer.join();\n}`,
      "explanationArabic": "المستهلك ينام عندما تكون القائمة فارغة ويستيقظ عند الإنتاج. done يُخبر المستهلك بأن المنتج انتهى حتى لا ينام للأبد. الشرط مركب: (!q.empty() || done) يضمن الخروج عند الانتهاء حتى لو كانت القائمة فارغة. إيقاظ وهمي ممكن لذلك نستخدم while داخل الحلقة."
    },
    {
      "titleArabic": "خطأ شائع: إيقاظ بدون تعديل تحت القفل",
      "code": `#include <condition_variable>\n#include <mutex>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::mutex m;\n    std::condition_variable cv;\n    bool ready = false;\n\n    // ❌ خطأ: تعديل المتغير خارج القفل ثم الإيقاظ\n    // {\n    //     ready = true;  // بدون قفل!\n    //     cv.notify_one();\n    // }\n    // المشكلة: المستهلك قد يفحص الشرط ويراه false قبل الكتابة\n\n    // ✅ صحيح: تعديل تحت القفل ثم إيقاظ\n    std::thread t([&]() {\n        std::unique_lock lock(m);\n        cv.wait(lock, [&]() { return ready; });\n        std::cout << \"جاهز\\n\";\n    });\n\n    {\n        std::lock_guard lock(m);\n        ready = true;\n    }  // حرر القفل قبل الإيقاظ — أفضل أداءً\n    cv.notify_one();\n\n    t.join();\n}`,
      "explanationArabic": "التعديل تحت القفل يضمن أن المستهلك لا يرى حالة وسطية. تحرير القفل قبل notify_one أفضل أداءً لأن المستهلك يستيقظ ويأخذ القفل فورًا بدل الانتظار حتى نهاية النطاق. الترتيب الصحيح: قفل ← تعديل ← فتح ← إيقاظ."
    }
  ],

  "std::lock_guard": [
    {
      "titleArabic": "حماية بسيطة بقسم حرج",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\nint main() {\n    int shared = 0;\n    std::mutex m;\n\n    std::thread t([&]() {\n        std::lock_guard<std::mutex> lock(m);  // يأخذ القفل\n        shared = 42;  // محمي\n    });  // القفل يُفتح تلقائيًا هنا\n\n    t.join();\n    std::cout << shared << '\\n';  // 42\n}`,
      "explanationArabic": "lock_guard هو أبسط أشكال RAII للقفل: يأخذ القفل في المُنشئ ويحرره في المُدمّر. لا يمكن فتحه مبكرًا أو نقله. استخدمه عندما تحتاج قفلًا لبقية النطاق الحالي. هو الخيار الافتراضي الأول لمعظم حالات القفل."
    },
    {
      "titleArabic": "حماية دالة عضو كاملة",
      "code": `#include <mutex>\n#include <vector>\n#include <iostream>\n\nstruct SafeList {\n    std::vector<int> data;\n    std::mutex m;\n\n    void add(int value) {\n        std::lock_guard<std::mutex> lock(m);  // يحمي كل الدالة\n        data.push_back(value);\n    }\n\n    void print() const {\n        // const mutex لا يمكن قفله — لذلك نستخدم mutable\n        // أو نستخدم lock_guard على mutex غير const\n    }\n};\n\nint main() {\n    SafeList sl;\n    sl.add(10);\n    sl.add(20);\n    // كل استدعاء add محمي بقفل خاص\n}`,
      "explanationArabic": "lock_guard في بداية الدالة يحمي كل جسمها. مشكلة شائعة: mutex داخل بنية const لا يمكن قفله. الحل: اعلن mutex كـ mutable. لكن انتبه: هذا يعني أن دالة const قد تُغيّر الحالة الداخلية (القفل نفسه)، وهو مقبول لأن القفل ليس بيانات منطقية."
    },
    {
      "titleArabic": "متى لا يكفي lock_guard",
      "code": `#include <mutex>\n#include <condition_variable>\n#include <iostream>\n\nint main() {\n    std::mutex m;\n    std::condition_variable cv;\n    bool ready = false;\n\n    // ❌ lock_guard لا يعمل مع condition_variable\n    // {\n    //     std::lock_guard<std::mutex> lock(m);\n    //     cv.wait(lock, [&]{ return ready; });  // خطأ: لا يمكن فتح lock_guard\n    // }\n\n    // ✅ unique_lock يسمح بتحرير مؤقت لـ wait\n    {\n        std::unique_lock<std::mutex> lock(m);\n        cv.wait(lock, [&]{ return ready; });  // wait يُحرر ويُعيد القفل\n    }\n\n    std::cout << \"استخدم unique_lock مع condition_variable\\n\";\n}`,
      "explanationArabic": "lock_guard لا يوفر تحكمًا في القفل: لا يمكن فتحه مبكرًا أو نقله. condition_variable::wait يحتاج أن يُحرر القفل ويعيد أخذه — وهذا يتطلب unique_lock. القاعدة: استخدم lock_guard افتراضيًا، unique_lock فقط عند الحاجة لتحكم إضافي."
    }
  ],

  "std::unique_lock": [
    {
      "titleArabic": "استخدامه مع condition_variable",
      "code": `#include <mutex>\n#include <condition_variable>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::mutex m;\n    std::condition_variable cv;\n    bool ready = false;\n\n    std::thread t([&]() {\n        std::unique_lock<std::mutex> lock(m);\n        // wait يُحرر القفل وينام، ثم عند الإيقاظ يُعيد أخذه\n        cv.wait(lock, [&]() { return ready; });\n        std::cout << \"استيقظ وقفل مأخوذ\\n\";\n    });\n\n    {\n        std::lock_guard<std::mutex> lock(m);\n        ready = true;\n    }\n    cv.notify_one();\n    t.join();\n}`,
      "explanationArabic": "wait يحتاج unique_lock لأنه يُحرر القفل مؤقتًا (لو حجبت القفل لن يستطيع أحد الإيقاظ). عند الإيقاظ، wait يعيد أخذ القفل قبل العودة. هذا مستحيل مع lock_guard الذي لا يُحرر القفل إلا عند الخروج من النطاق."
    },
    {
      "titleArabic": "تأخير القفل",
      "code": `#include <mutex>\n#include <iostream>\n\nint main() {\n    std::mutex m;\n\n    // defer_lock: يبني unique_lock دون أخذ القفل\n    std::unique_lock<std::mutex> lock(m, std::defer_lock);\n\n    std::cout << \"قبل القفل\\n\";\n    lock.lock();  // أخذ القفل يدويًا\n    std::cout << \"بعد القفل\\n\";\n    lock.unlock();  // تحرير يدوي\n    std::cout << \"بعد الفتح\\n\";\n    // يُفتح تلقائيًا عند الخروج إن كان مأخوذًا\n}`,
      "explanationArabic": "defer_lock يسمح ببناء unique_lock دون أخذ القفل فورًا. مفيد عندما تحتاج التحكم في توقيت القفل. يمكنك lock() وunlock() يدويًا عدة مرات. لكن لا تنسَ: إن كان القفل مأخوذًا عند الخروج، يُفتح تلقائيًا."
    },
    {
      "titleArabic": "نقل القفل بين نطاقات",
      "code": `#include <mutex>\n#include <iostream>\n\nstd::mutex m;\n\nvoid process() {\n    // لا يمكن تمرير lock_guard — لكن unique_lock قابل للنقل\n    std::unique_lock<std::mutex> lock(m);\n    std::cout << \"محمي\\n\";\n}  // يُفتح هنا\n\nint main() {\n    // ✅ unique_lock قابل للنقل — يمكن إرجاعه من دالة\n    auto get_lock = []() -> std::unique_lock<std::mutex> {\n        return std::unique_lock<std::mutex>(m);  // نقل\n    };\n\n    auto lock = get_lock();\n    std::cout << \"القفل مُنتقل\\n\";\n}  // يُفتح هنا\n`,
      "explanationArabic": "unique_lock قابل للنقل (movable) بينما lock_guard غير قابل. هذا يسمح بإرجاعه من دوال أو تخزينه في حاويات. مفيد في الأنماط المعقدة حيث يُأخذ القفل في مكان ويُحرر في مكان آخر، مع ضمان التحرير عبر RAII."
    }
  ],

  "std::scoped_lock": [
    {
      "titleArabic": "قفل عدة mutexes بأمان",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\nint main() {\n    std::mutex m_a, m_b;\n    int a = 0, b = 0;\n\n    std::thread t1([&]() {\n        // يأخذ القفلين معًا بأمان — يمنع deadlock\n        std::scoped_lock lock(m_a, m_b);\n        a += 1;\n        b += 1;\n    });\n\n    std::thread t2([&]() {\n        // حتى لو كان الترتيب مختلفًا — scoped_lock يتولى الأمر\n        std::scoped_lock lock(m_b, m_a);\n        a += 10;\n        b += 10;\n    });\n\n    t1.join(); t2.join();\n    std::cout << a << ' ' << b << '\\n';  // 11 11\n}`,
      "explanationArabic": "لو استخدمت lock_guard على m_a ثم m_b في خيط، وm_b ثم m_a في خيط آخر، تحدث حالة جمود (deadlock). scoped_lock يستخدم خوارزمية تمنع ذلك بتحديد ترتيب أخذ الأقفال بشكل ديناميكي. مع mutexين فقط، يمكنك أيضًا استخدام std::lock(m_a, m_b) ثم lock_guard مع adopt_lock."
    },
    {
      "titleArabic": "مقارنة مع lock_guard",
      "code": `#include <mutex>\n#include <iostream>\n\nint main() {\n    std::mutex m1, m2;\n\n    // lock_guard: mutex واحد فقط\n    std::lock_guard<std::mutex> g1(m1);\n\n    // scoped_lock: mutex واحد أو أكثر\n    std::scoped_lock g2(m1, m2);\n\n    // مع mutex واحد: scoped_lock ≡ lock_guard\n    // مع عدة mutexes: scoped_lock يمنع deadlock تلقائيًا\n\n    std::cout << \"scoped_lock هو الخيار الأفضل دائمًا (C++17)\\n\";\n}`,
      "explanationArabic": "scoped_lock (C++17) يُلغي عمليًا الحاجة لـ lock_guard لأنه يعمل مع mutex واحد أو أكثر. الفرق الوحيد: lock_guard يدعم adopt_lock وscoped_lock يدعم أي استراتيجية. في كود C++17، فضّل scoped_lock دائمًا."
    },
    {
      "titleArabic": "استخدام adopt_lock مع scoped_lock",
      "code": `#include <mutex>\n#include <iostream>\n\nint main() {\n    std::mutex m1, m2;\n\n    // std::lock يأخذ القفلين بأمان (بدون deadlock)\n    std::lock(m1, m2);\n\n    // adopt_lock: يفترض أن القفلين مأخوذان بالفعل — لا يأخذهما مرة أخرى\n    std::scoped_lock lock(m1, m2, std::adopt_lock);\n\n    // القسم الحرج\n    std::cout << \"محمي بالقفلين\\n\";\n}  // كلا القفلين يُفتحان هنا\n`,
      "explanationArabic": "std::lock يأخذ عدة أقفال بأمان لكنه لا يوفر RAII — لو حدث استثناء بين lock ونهاية النطاق، القفل لا يُفتح. adopt_lock يربط scoped_lock بأقفال مأخوذة مسبقًا ليوفر RAII. هذا النمط: lock ثم scoped_lock مع adopt_lock هو البديل الآمن."
    }
  ],

  "std::async": [
    {
      "titleArabic": "تشغيل مهمة غير متزامنة",
      "code": `#include <future>\n#include <iostream>\n\nint main() {\n    // std::launch::async يُجبر التشغيل في خيط جديد\n    auto fut = std::async(std::launch::async, []() {\n        return 42;\n    });\n\n    std::cout << \"النتيجة: \" << fut.get() << '\\n';  // 42\n}`,
      "explanationArabic": "std::async أبسط طريقة لتنفيذ مهمة غير متزامنة. يُرجع future تنتظر النتيجة. بدون std::launch::async، المترجم قد يؤخر التنفيذ حتى get() (lazy evaluation). مع async، يبدأ فورًا في خيط جديد. أبسط من إنشاء thread يدويًا."
    },
    {
      "titleArabic": "تشغيل عدة مهام بالتوازي",
      "code": `#include <future>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<std::future<int>> futures;\n\n    for (int i = 0; i < 4; ++i) {\n        futures.push_back(std::async(std::launch::async, [i]() {\n            return i * i;\n        }));\n    }\n\n    // جمع النتائج — كل get() يحجب حتى تكتمل تلك المهمة\n    int total = 0;\n    for (auto& f : futures) {\n        total += f.get();\n    }\n    std::cout << \"المجموع: \" << total << '\\n';  // 0+1+4+9 = 14\n}`,
      "explanationArabic": "كل async يُشغل خيطًا مستقلًا. get() على كل future يحجب حتى تكتمل تلك المهمة تحديدًا. المهام الأربع تعمل بالتوازي (إن كان هناك معالجات كافية). هذا أبسط من إنشاء 4 خيوط يدويًا وإدارة النتائج."
    },
    {
      "titleArabic": "خطر التقييد الكسول (lazy)",
      "code": `#include <future>\n#include <iostream>\n\nint main() {\n    // بدون std::launch::async — قد لا يُنفذ حتى get()\n    auto fut = std::async([]() {\n        std::cout << \"تنفيذ\\n\";\n        return 1;\n    });\n\n    // قد لا يطبع \"تنفيذ\" بعد الآن — يعتمد على المترجم\n    // عند get() يُنفذ إن لم يُنفذ بعد\n    std::cout << \"النتيجة: \" << fut.get() << '\\n';\n\n    // ✅ دائمًا حدد السياسة لتجنب المفاجآت\n    auto fut2 = std::async(std::launch::async, []() {\n        std::cout << \"تنفيذ فوري\\n\";\n        return 2;\n    });\n    std::cout << fut2.get() << '\\n';\n}`,
      "explanationArabic": "السياسة الافتراضية هي std::launch::async | std::launch::deferred — أي قد يكون أيًا منهما. هذا يعني أن السلوك غير محدد: قد يُنفذ في خيط جديد أو قد يؤجل حتى get(). دائمًا حدد std::launch::async صراحةً إن أردت تنفيذًا فوريًا في خيط."
    }
  ],

  "std::once_flag": [
    {
      "titleArabic": "تهيئة مرة واحدة فقط",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\nstd::once_flag init_flag;\n\nvoid init() {\n    std::cout << \"تهيئة...\\n\";\n}\n\nint main() {\n    std::thread t1([&]() { std::call_once(init_flag, init); });\n    std::thread t2([&]() { std::call_once(init_flag, init); });\n    std::thread t3([&]() { std::call_once(init_flag, init); });\n\n    t1.join(); t2.join(); t3.join();\n    // \"تهيئة...\" يُطبع مرة واحدة فقط رغم 3 خيوط\n}`,
      "explanationArabic": "std::call_once يضمن أن الدالة تُنفذ مرة واحدة فقط حتى مع خيوط متعددة. الخيوط الأخرى تنتظر حتى تنتهي التهيئة ثم تتابع. هذا أنظف من static متغير محلي في بعض الحالات لأنه يتحكم في التوقيت بدل التهيئة عند أول استخدام."
    },
    {
      "titleArabic": "بديل لمتغير static المحلي",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\n// الطريقة 1: static محلي — مضمون في C++11\nLogger& get_logger_static() {\n    static Logger instance;  // تهيئة آمنة بخيوط — مرة واحدة\n    return instance;\n}\n\n// الطريقة 2: once_flag — تحكم أكبر\nstd::once_flag logger_flag;\nLogger* logger_instance = nullptr;\n\nLogger& get_logger_once() {\n    std::call_once(logger_flag, []() {\n        logger_instance = new Logger();\n    });\n    return *logger_instance;\n}\n\nint main() {\n    // الطريقة 1 أنظف عادةً\n    // الطريقة 2 مفيدة عندما تحتاج تحكمًا في التوقيت أو التهيئة المعقدة\n    std::cout << \"استخدم static محلي عادةً، once_flag عند الحاجة\\n\";\n}`,
      "explanationArabic": "في C++11، تهيئة المتغير static المحلي آمنة بخيوط مضمونًا. once_flag مفيد عندما: التهيئة معقدة وتحتاج معاملات، أو تريد التحكم في توقيت التهيئة، أو لا تريد تهيئة كسولة (lazy). معظم الحالات البسيطة: static محلي أنظف."
    },
    {
      "titleArabic": "استخدام مع بنية lazy initialization",
      "code": `#include <mutex>\n#include <iostream>\n#include <thread>\n\nstruct Resource {\n    void use() { std::cout << \"استخدام المورد\\n\"; }\n};\n\nstd::once_flag res_flag;\nResource* global_res = nullptr;\n\nResource& get_resource() {\n    std::call_once(res_flag, []() {\n        global_res = new Resource();\n        std::cout << \"المورد أُنشئ\\n\";\n    });\n    return *global_res;\n}\n\nint main() {\n    std::thread t1([&]() { get_resource().use(); });\n    std::thread t2([&]() { get_resource().use(); });\n    t1.join(); t2.join();\n    // \"المورد أُنشئ\" مرة واحدة فقط\n}`,
      "explanationArabic": "call_once يضمن أن new Resource() يُنفذ مرة واحدة. الخيط الذي يصل أولًا يُنفذ التهيئة والباقي ينتظر. التحذير: هذا النمط لا يُحرر المورد أبدًا (تسريب عند خروج البرنامج). في التطبيقات الحقيقية، استخدم static محلي أو unique_ptr."
    }
  ],

  "std::exception": [
    {
      "titleArabic": "الالتقاط كنوع أساسي",
      "code": `#include <exception>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::exception();  // استثناء عام\n    } catch (const std::exception& e) {\n        // what() يُرجع رسالة توضيحية\n        std::cout << \"استثناء: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "std::exception هو أساس كل الاستثناءات القياسية. what() يُرجع نصًا توضيحيًا (قد يكون فارغًا لـ exception العادية). التقط بالمرجع const& لمنع النسخ وللتوافق مع الأنواع المشتقة. لا ترمِ std::exception مباشرة عادةً — استخدم نوعًا مشتقًا أكثر تحديدًا."
    },
    {
      "titleArabic": "التسلسل الهرمي للاستثناءات",
      "code": `#include <exception>\n#include <stdexcept>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::runtime_error(\"خطأ وقت تشغيل\");\n    } catch (const std::runtime_error& e) {\n        // الأكثر تحديدًا أولًا\n        std::cout << \"runtime_error: \" << e.what() << '\\n';\n    } catch (const std::exception& e) {\n        // أكثر عمومية — يلتقط ما فات\n        std::cout << \"exception: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "التسلسل: exception ← logic_error/runtime_error ← invalid_argument/out_of_range/... التقط الأكثر تحديدًا أولًا لأن catch يتحقق بالترتيب. لو وضعت exception أولًا سيبتلع كل شيء. هذا نمط أساسي في معالجة الاستثناءات."
    },
    {
      "titleArabic": "إنشاء استثناء مخصص",
      "code": `#include <exception>\n#include <string>\n#include <iostream>\n\nclass VulkanError : public std::exception {\n    std::string msg;\npublic:\n    explicit VulkanError(const std::string& m) : msg(m) {}\n    const char* what() const noexcept override {\n        return msg.c_str();\n    }\n};\n\nint main() {\n    try {\n        throw VulkanError(\"فشل إنشاء الجهاز\");\n    } catch (const std::exception& e) {\n        // يُلتقط هنا لأن VulkanError مشتق من exception\n        std::cout << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "اشتق من std::exception و_override ما يُعيد const char*. noexcept على what() مطلوب لأن الإصدار الأساسي noexcept. تخزين الرسالة في string يسهل البناء لكن انتبه: what() يُرجع مؤشرًا يجب أن يبقى صالحًا. c_str() آمن لأن string لا يزال حيًا."
    }
  ],

  "std::runtime_error": [
    {
      "titleArabic": "رمي خطأ وقت تشغيل",
      "code": `#include <stdexcept>\n#include <iostream>\n\nint main() {\n    try {\n        int age = -5;\n        if (age < 0) {\n            throw std::runtime_error(\"العمر لا يمكن أن يكون سالبًا\");\n        }\n    } catch (const std::runtime_error& e) {\n        std::cout << \"خطأ: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "runtime_error يشير لخطأ لا يمكن اكتشافه وقت الترجمة — يظهر فقط أثناء التنفيذ. الفرق عن logic_error: runtime_error لا يمكن توقعه بفحص الشروط المسبقة بينما logic_error يمكن اكتشافه بالمراجعة. كلاهما مشتق من std::exception."
    },
    {
      "titleArabic": "استخدامه مع واجهات النظام",
      "code": `#include <stdexcept>\n#include <iostream>\n#include <fstream>\n\nint main() {\n    std::ifstream file(\"nonexistent.txt\");\n    if (!file.is_open()) {\n        throw std::runtime_error(\"فشل فتح الملف: nonexistent.txt\");\n    }\n    // في التطبيقات الحقيقية: قد تُحوّل لـ system_error مع error_code\n}`,
      "explanationArabic": "runtime_error مناسب للأخطاء التي تظهر فقط أثناء التنفيذ مثل فشل فتح ملف أو فشل اتصال. البديل الأفضل أحيانًا: std::system_error مع error_code لأنه يحمل معلومات أكثر دقة عن سبب الفشل من النظام."
    },
    {
      "titleArabic": "الفرق بين runtime_error و logic_error",
      "code": `#include <stdexcept>\n#include <iostream>\n\nint main() {\n    // logic_error: خطأ في منطق البرنامج — يمكن اكتشافه قبل التشغيل\n    try {\n        int arr[3];\n        int index = 5;\n        if (index >= 3) throw std::logic_error(\"فهرس خارج الحدود — خطأ منطقي\");\n    } catch (const std::logic_error& e) {\n        std::cout << \"منطقي: \" << e.what() << '\\n';\n    }\n\n    // runtime_error: خطأ لا يمكن توقعه — يحدث أثناء التنفيذ فقط\n    try {\n        throw std::runtime_error(\"نفدت الذاكرة — خطأ وقت تشغيل\");\n    } catch (const std::runtime_error& e) {\n        std::cout << \"تشغيل: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "التمييز مفيد للمستقبل: logic_error يعني \"أصلح الكود\"، runtime_error يعني \"تعامل مع الموقف\". في الممارسة، هذا التمييز غير دقيق دائمًا والكثير يستخدم runtime_error لكل شيء. المهم: اختر الأنسب سياقيًا وكن متسقًا."
    }
  ],

  "std::logic_error": [
    {
      "titleArabic": "الإشارة لانتهاك شرط مسبق",
      "code": `#include <stdexcept>\n#include <iostream>\n\ndouble divide(double a, double b) {\n    if (b == 0.0) {\n        throw std::logic_error(\"القسمة على صفر — شرط مسبق مُخالف\");\n    }\n    return a / b;\n}\n\nint main() {\n    try {\n        divide(10.0, 0.0);\n    } catch (const std::logic_error& e) {\n        std::cout << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "logic_error يعني أن الشيفرة استُدعيت بطريقة خاطئة — المُستدعي هو المسؤول. القسمة على صفر يمكن فحصها قبل الاستدعاء لذلك هي خطأ منطقي. هذا يختلف عن فشل فتح ملف الذي لا يمكن توقعه دائمًا (runtime_error)."
    },
    {
      "titleArabic": "الأنواع المشتقة الأكثر تحديدًا",
      "code": `#include <stdexcept>\n#include <iostream>\n\nint main() {\n    // invalid_argument: معامل غير صالح\n    try { throw std::invalid_argument(\"معامل سالب\"); }\n    catch (const std::invalid_argument& e) {\n        std::cout << \"معامل: \" << e.what() << '\\n';\n    }\n\n    // out_of_range: فهرس خارج الحدود\n    try { throw std::out_of_range(\"فهرس 5 خارج النطاق 0-2\"); }\n    catch (const std::out_of_range& e) {\n        std::cout << \"نطاق: \" << e.what() << '\\n';\n    }\n\n    // domain_error: قيمة خارج مجال الدالة الرياضية\n    try { throw std::domain_error(\"اللوغاريتم لعدد سالب\"); }\n    catch (const std::domain_error& e) {\n        std::cout << \"مجال: \" << e.what() << '\\n';\n    }\n\n    // كلها مشتقة من logic_error\n}`,
      "explanationArabic": "logic_error له عدة أنواع مشتقة أكثر تحديدًا: invalid_argument للمعاملات، out_of_range للفهارس، domain_error للقيم الرياضية. استخدم الأكثر تحديدًا لتمكين الالتقاط الانتقائي. كلها تلتقط بـ catch (const std::logic_error&) أيضًا."
    },
    {
      "titleArabic": "assert مقابل logic_error",
      "code": `#include <stdexcept>\n#include <cassert>\n#include <iostream>\n\nint main() {\n    // assert: للفحص أثناء التطوير فقط — يُزال في Release\n    assert(1 > 0 && \"يجب أن يكون 1 أكبر من 0\");\n\n    // logic_error: يبقى في كل الأوضاع — للشروط المسبقة العامة\n    void process(int value);\n    auto safe_process = [](int v) {\n        if (v < 0) throw std::logic_error(\"قيمة سالبة غير مقبولة\");\n        // معالجة...\n    };\n\n    // القاعدة:\n    // assert للفحوصات الداخلية أثناء التطوير\n    // logic_error لشروط مسبقة واجهة عامة تبقى في الإنتاج\n    std::cout << \"assert للتطوير، logic_error للواجهة\\n\";\n}`,
      "explanationArabic": "assert يُزال في الإصدار النهائي (NDEBUG) لذلك لا يعتمد عليه لفحص مدخلات المستخدم. logic_error يبقى دائمًا ويمكن للمستدعي التقاطه. استخدم assert للتحقق من صحة الافتراضات الداخلية، وlogic_error لشروط الواجهة العامة."
    }
  ],

  "std::invalid_argument": [
    {
      "titleArabic": "التحقق من صحة المدخلات",
      "code": `#include <stdexcept>\n#include <string>\n#include <iostream>\n\nint parse_positive(const std::string& s) {\n    int value = std::stoi(s);\n    if (value <= 0) {\n        throw std::invalid_argument(\"يجب أن تكون القيمة موجبة: \" + s);\n    }\n    return value;\n}\n\nint main() {\n    try {\n        parse_positive(\"-5\");\n    } catch (const std::invalid_argument& e) {\n        std::cout << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "invalid_argument مشتق من logic_error ويُستخدم عندما المعامل صيغيًا صالح (نوعه صحيح) لكن قيمته غير مقبولة منطقيًا. std::stoi نفسه يرمي invalid_argument عند نص غير رقمي. هنا نضيف فحصًا إضافيًا: القيمة يجب أن تكون موجبة."
    },
    {
      "titleArabic": "فحص معاملات مُنشئ",
      "code": `#include <stdexcept>\n#include <iostream>\n\nstruct Rectangle {\n    double width, height;\n\n    Rectangle(double w, double h) : width(w), height(h) {\n        if (w <= 0 || h <= 0) {\n            throw std::invalid_argument(\"الأبعاد يجب أن تكون موجبة\");\n        }\n    }\n};\n\nint main() {\n    try {\n        Rectangle r(-1, 5);  // عرض سالب\n    } catch (const std::invalid_argument& e) {\n        std::cout << \"خطأ بناء: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "فحص الشروط المسبقة في المُنشئ نمط شائع. إن فشلت الشروط، لا يُبنى الكائن ويُرمى الاستثناء. هذا أفضل من بناء كائن في حالة غير صالحة ثم محاولة استخدامه. المُستدعي يعرف فورًا سبب الفشل."
    },
    {
      "titleArabic": "الالتقاط الانتقائي",
      "code": `#include <stdexcept>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::invalid_argument(\"معامل خاطئ\");\n    } catch (const std::invalid_argument& e) {\n        std::cout << \"معامل: \" << e.what() << '\\n';\n    } catch (const std::logic_error& e) {\n        // لن يصل هنا لأن invalid_argument يُلتقط أولًا\n        std::cout << \"منطقي: \" << e.what() << '\\n';\n    } catch (const std::exception& e) {\n        std::cout << \"عام: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "بما أن invalid_argument مشتق من logic_error المشتق من exception، يجب وضعه أولًا في ترتيب catch. لو وضعت logic_error أولًا سيلتقط invalid_argument ولن يصل catch الخاص به. هذا ينطبق على كل التسلسل الهرمي للاستثناءات."
    }
  ],

  "std::out_of_range": [
    {
      "titleArabic": "at() يرمي عند فهرس خارج الحدود",
      "code": `#include <vector>\n#include <stdexcept>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {10, 20, 30};\n\n    try {\n        v.at(5);  // فهرس 5 خارج النطاق 0-2\n    } catch (const std::out_of_range& e) {\n        std::cout << e.what() << '\\n';\n    }\n\n    // operator[] لا يفحص الحدود — سلوك غير معرّف\n    // v[5];  // ❌ خطأ صامت — قد يعمل أو ينفجر\n}`,
      "explanationArabic": "at() يفحص الفهرس ويرمي out_of_range عند تجاوزه. operator[] لا يفحص — الوصول خارج الحدود سلوك غير معرّف. استخدم at() عند الحاجة لفحص آمن، و[] عندما تكون متأكدًا من الفهرس (مثل المرور بـ for مع size())."
    },
    {
      "titleArabic": "استخدامه في دالة وصول آمن",
      "code": `#include <vector>\n#include <stdexcept>\n#include <iostream>\n\nint safe_get(const std::vector<int>& v, size_t index) {\n    // at() ترمي out_of_range تلقائيًا عند تجاوز الحدود\n    return v.at(index);\n}\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n\n    try {\n        std::cout << safe_get(v, 1) << '\\n';  // 2\n        std::cout << safe_get(v, 10) << '\\n'; // يرمي\n    } catch (const std::out_of_range& e) {\n        std::cout << \"خارج النطاق\\n\";\n    }\n}`,
      "explanationArabic": "at() مفيد في الدوال التي تأخذ فهرسًا من المستخدم أو من مصدر خارجي. بدل فحص يدوي (if index >= size())، at() يفحص ويُرمي. هذا أنظف ويمنع نسيان الفحص. العيب: استثناء أبطأ من فحص يدوي في الحلقات المحكمة."
    },
    {
      "titleArabic": "out_of_range مع string::at",
      "code": `#include <string>\n#include <stdexcept>\n#include <iostream>\n\nint main() {\n    std::string s = \"hello\";\n\n    try {\n        char c = s.at(10);  // خارج نطاق السلسلة\n    } catch (const std::out_of_range& e) {\n        std::cout << \"خارج نطاق السلسلة\\n\";\n    }\n\n    // s[10] سلوك غير معرّف — قد يعمل أو ينفجر\n}`,
      "explanationArabic": "string::at() يفحص الحدود مثل vector::at(). مع النصوص UTF-8، تذكر أن at() تعمل على المحارف (bytes) لا على الرموز (code points). فهرس 10 قد يكون في منتصف رمز UTF-8 متعدد البايت. لمعالجة UTF-8 الحقيقية تحتاج مكتبة مخصصة."
    }
  ],

  "std::bad_alloc": [
    {
      "titleArabic": "الالتقاط عند فشل تخصيص الذاكرة",
      "code": `#include <new>\n#include <iostream>\n\nint main() {\n    try {\n        // محاولة تخصيص ذاكرة كبيرة جدًا\n        size_t huge = static_cast<size_t>(1e15);\n        int* p = new int[huge];\n        delete[] p;\n    } catch (const std::bad_alloc& e) {\n        std::cout << \"فشل تخصيص الذاكرة: \" << e.what() << '\\n';\n    }\n}`,
      "explanationArabic": "bad_alloc يُرمى عندما يفشل new في تخصيص الذاكرة. هذا يحدث عند طلب كمية أكبر من المتاحة. unlike C، C++ لا تُرجع nullptr من new عند الفشل — بل ترمي استثناء. لاحظ: #include <new> لا <exception> لأن bad_alloc معرّف في <new>."
    },
    {
      "titleArabic": "nothrow new كبديل",
      "code": `#include <new>\n#include <iostream>\n\nint main() {\n    // nothrow: يُرجع nullptr بدل رمي استثناء\n    int* p = new(std::nothrow) int[static_cast<size_t>(1e15)];\n\n    if (p == nullptr) {\n        std::cout << \"فشل التخصيص — nullptr مُرجع\\n\";\n    } else {\n        delete[] p;\n    }\n\n    // القاعدة: استخدم new العادي والالتقاط في معظم الحالات\n    // nothrow فقط في السياقات التي لا تدعم الاستثناءات\n}`,
      "explanationArabic": "new(std::nothrow) يُرجع nullptr عند الفشل بدل رمي bad_alloc. مفيد في الأنظمة المضمّنة أو السياقات التي لا يمكن فيها استخدام الاستثناءات. لكن في كود C++ العادي، new مع try/catch أنظف لأنه يضمن عدم نسيان الفحص."
    },
    {
      "titleArabic": "حاويات STL ترمي bad_alloc",
      "code": `#include <vector>\n#include <new>\n#include <iostream>\n\nint main() {\n    try {\n        std::vector<int> v(static_cast<size_t>(1e15));\n    } catch (const std::bad_alloc& e) {\n        std::cout << \"vector فشل: \" << e.what() << '\\n';\n    }\n\n    // كل عمليات التخصيص في STL ترمي bad_alloc:\n    // vector::push_back, string::resize, make_shared, ...\n}`,
      "explanationArabic": "كل حاويات STL تستخدم new داخليًا لذلك تُرمي bad_alloc عند نفاد الذاكرة. هذا يشمل push_back (عند التوسع)، resize، والمُنشئات. لا تحتاج التقاط bad_alloc في كل مكان — غالبًا تلتقطه في مستوى عالٍ وتُنهي البرنامج بأمان."
    }
  ],

  "std::system_error": [
    {
      "titleArabic": "حمل error_code من النظام",
      "code": `#include <system_error>\n#include <iostream>\n\nint main() {\n    // إنشاء system_error برمز خطأ من النظام\n    std::error_code ec(2, std::system_category());\n    throw std::system_error(ec, \"فشلت العملية\");\n}\n// يحتاج try/catch في التطبيق الحقيقي`,
      "explanationArabic": "system_error يحمل error_code الذي يحتوي رقم الخطأ وفئته. هذا أنفع من runtime_error لأنه يربط الخطأ بنظام التشغيل. std::system_category() تعني أن الرقم من errno/GetLastError. يمكنك فحص الرمز لاتخاذ إجراء محدد."
    },
    {
      "titleArabic": "الالتقاط وفحص الرمز",
      "code": `#include <system_error>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::system_error(\n            std::make_error_code(std::errc::no_such_file_or_directory),\n            \"الملف غير موجود\"\n        );\n    } catch (const std::system_error& e) {\n        std::cout << \"الرسالة: \" << e.what() << '\\n';\n        std::cout << \"الرمز: \" << e.code().value() << '\\n';\n        std::cout << \"الفئة: \" << e.code().category().name() << '\\n';\n\n        if (e.code() == std::errc::no_such_file_or_directory) {\n            std::cout << \"السبب: الملف غير موجود\\n\";\n        }\n    }\n}`,
      "explanationArabic": "system_error::code() يُرجع error_code يمكن مقارنته مع std::errc. هذا يسمح بالتعامل البرمجي مع الأخطاء بدل تحليل نص الرسالة. std::errc يوفر أسماء واضحة لرموز errno الشائعة. ما يُطبعه what() يعتمد على المترجم."
    },
    {
      "titleArabic": "std::filesystem ترمي system_error",
      "code": `#include <filesystem>\n#include <system_error>\n#include <iostream>\n\nnamespace fs = std::filesystem;\n\nint main() {\n    try {\n        fs::copy(\"nonexistent.txt\", \"backup.txt\");\n    } catch (const std::system_error& e) {\n        // filesystem يستخدم system_error مع error_code مفصل\n        std::cout << \"خطأ نسخ: \" << e.what() << '\\n';\n        if (e.code() == std::errc::no_such_file_or_directory) {\n            std::cout << \"الملف المصدر غير موجود\\n\";\n        }\n    }\n}`,
      "explanationArabic": "كل دوال filesystem ترمي system_error عند الفشل. هذا أفضل من رمي runtime_error لأنه يحمل error_code يمكن فحصه برمجيًا. البديل: استخدم النسخة التي تأخذ error_code كمعامل لتفادي الاستثناءات."
    }
  ],

  "std::error_code": [
    {
      "titleArabic": "بديل للاستثناءات عند الفشل",
      "code": `#include <system_error>\n#include <filesystem>\n#include <iostream>\n\nnamespace fs = std::filesystem;\n\nint main() {\n    std::error_code ec;\n\n    // النسخة التي تأخذ error_code لا ترمي استثناء\n    fs::copy(\"nonexistent.txt\", \"backup.txt\", ec);\n\n    if (ec) {\n        std::cout << \"خطأ: \" << ec.message() << '\\n';\n        std::cout << \"القيمة: \" << ec.value() << '\\n';\n    } else {\n        std::cout << \"نجح\\n\";\n    }\n}`,
      "explanationArabic": "error_code بديل خفيف للاستثناءات: يُمرر كمعامل وتُفحص قيمته. لا كلفة stack unwinding. مفيد في الكود الحرج أدائيًا أو في الأنظمة التي تُعطّل الاستثناءات. filesystem توفر نسختين من كل دالة: واحدة ترمي وأخرى تأخذ error_code."
    },
    {
      "titleArabic": "مقارنة مع شروط خطأ عامة",
      "code": `#include <system_error>\n#include <iostream>\n\nint main() {\n    std::error_code ec = std::make_error_code(std::errc::permission_denied);\n\n    // مقارنة مع std::errc — تعمل عبر الفئات\n    if (ec == std::errc::permission_denied) {\n        std::cout << \"إذن مرفوض\\n\";\n    }\n\n    if (ec == std::errc::no_such_file_or_directory) {\n        std::cout << \"لن يصل هنا\\n\";\n    }\n}`,
      "explanationArabic": "error_code يمكن مقارنته مع std::errc حتى لو كانت فئته مختلفة. هذا يعني أنك لا تحتاج معرفة الفئة الدقيقة — قارن بالمعنى المطلوب. std::errc يوفر أسماء مقروءة لأخطاء POSIX الشائعة."
    },
    {
      "titleArabic": "إنشاء error_code مخصص",
      "code": `#include <system_error>\n#include <iostream>\n\nenum class AppError { NetworkFail, Timeout, ParseError };\n\nstruct AppErrorCategory : std::error_category {\n    const char* name() const noexcept override { return \"app\"; }\n    std::string message(int ev) const override {\n        switch (static_cast<AppError>(ev)) {\n            case AppError::NetworkFail: return \"فشل شبكة\";\n            case AppError::Timeout: return \"انتهت المهلة\";\n            case AppError::ParseError: return \"خطأ تحليل\";\n            default: return \"مجهول\";\n        }\n    }\n};\n\nconst AppErrorCategory& app_category() {\n    static AppErrorCategory c;\n    return c;\n}\n\nstd::error_code make_error(AppError e) {\n    return {static_cast<int>(e), app_category()};\n}\n\nint main() {\n    auto ec = make_error(AppError::Timeout);\n    std::cout << ec.message() << '\\n';  // انتهت المهلة\n}`,
      "explanationArabic": "لإنشاء error_code مخصص تحتاج فئة مشتقة من error_category توفر name() وmessage(). هذا يسمح لأخطاء تطبيقك بالتعامل بنفس طريقة أخطاء النظام. مفيد في المكتبات التي تريد واجهة خطأ موحدة."
    }
  ],

  "std::error_condition": [
    {
      "titleArabic": "مقارنة error_code مع شروط عامة",
      "code": `#include <system_error>\n#include <iostream>\n\nint main() {\n    // error_code من نظام مختلف قد يحمل رقمًا مختلفًا لنفس المعنى\n    std::error_code ec(2, std::system_category());\n\n    // error_condition يمثل المعنى العام — يعمل عبر الأنظمة\n    std::error_condition not_found = std::errc::no_such_file_or_directory;\n\n    if (ec == not_found) {\n        std::cout << \"الملف غير موجود (عبر error_condition)\\n\";\n    }\n}`,
      "explanationArabic": "error_condition يمثل المعنى العام لخطأ بينما error_code يمثل الرمز الفعلي من نظام معين. المقارنة error_code == error_condition تستخدم equivalent() داخليًا لتحويل الرمز الفعلي للمعنى العام. هذا يسمح بكتابة كود يعمل عبر أنظمة مختلفة."
    },
    {
      "titleArabic": "استخدامه في معالجة الأخطاء الموحدة",
      "code": `#include <system_error>\n#include <iostream>\n\nvoid handle_error(std::error_code ec) {\n    // لا تقارن بالقيمة الرقمية — استخدم error_condition\n    if (ec == std::errc::permission_denied) {\n        std::cout << \"إذن مرفوض\\n\";\n    } else if (ec == std::errc::no_such_file_or_directory) {\n        std::cout << \"غير موجود\\n\";\n    } else if (ec == std::errc::device_no_space) {\n        std::cout << \"لا مساحة\\n\";\n    } else {\n        std::cout << \"خطأ آخر: \" << ec.message() << '\\n';\n    }\n}\n\nint main() {\n    handle_error(std::make_error_code(std::errc::permission_denied));\n}`,
      "explanationArabic": "error_condition مع std::errc يوفر أسماء واضحة للمقارنة بدل أرقام errno. هذا أنظف وأكثر قابلية للنقل من مقارنة الأرقام مباشرة. في معظم الحالات البسيطة، مقارنة error_code مع std::errc مباشرة تعمل أيضًا."
    }
  ],

  "std::cout": [
    {
      "titleArabic": "طباعة أنواع مختلفة",
      "code": `#include <iostream>\n#include <string>\n\nint main() {\n    int x = 42;\n    double pi = 3.14159;\n    std::string name = \"Atlas\";\n    bool flag = true;\n\n    std::cout << \"عدد: \" << x << '\\n';\n    std::cout << \"عائم: \" << pi << '\\n';\n    std::cout << \"نص: \" << name << '\\n';\n    std::cout << std::boolalpha << \"منطقي: \" << flag << '\\n';\n    // المخرج:\n    // عدد: 42\n    // عائم: 3.14159\n    // نص: Atlas\n    // منطقي: true\n}`,
      "explanationArabic": "cout يستخدم operator<< (إدراج تدفق) لكل نوع. boolalpha يطبع true/false بدل 1/0. << يُرجع مرجعًا لنفس التدفق لذلك يمكنك تسلسل عدة إدراجات. لا يضيف مسافات تلقائيًا — يجب إضافتها يدويًا."
    },
    {
      "titleArabic": "التحكم في الدقة والعرض",
      "code": `#include <iostream>\n#include <iomanip>\n\nint main() {\n    double pi = 3.14159265358979;\n\n    // تحديد الدقة (عدد الأرقام بعد الفاصلة)\n    std::cout << std::fixed << std::setprecision(2) << pi << '\\n';  // 3.14\n    std::cout << std::setprecision(6) << pi << '\\n';                 // 3.141593\n\n    // عرض ثابت مع محاذاة\n    std::cout << std::setw(10) << std::right << 42 << '\\n';  //         42\n    std::cout << std::setw(10) << std::left << 42 << '\\n';   // 42\n\n    // hex و oct\n    std::cout << std::hex << 255 << '\\n';  // ff\n    std::cout << std::oct << 8 << '\\n';    // 10\n}`,
      "explanationArabic": "fixed يضع التنسيق العشري الثابت. setprecision يحدد عدد الأرقام بعد الفاصلة مع fixed. setw يحدد العرض الأدنى للحقلة التالية فقط (يُعادة للافتراضي بعد كل طباعة). hex/oct تغير قاعدة العرض. هذه المُعدِّلات تُطبق على التدفق وتبقى حتى تُغيَّر."
    },
    {
      "titleArabic": "endl مقابل '\\n'",
      "code": `#include <iostream>\n\nint main() {\n    // '\\n': سطر جديد فقط — أسرع\n    std::cout << \"سطر 1\\n\";\n    std::cout << \"سطر 2\\n\";\n\n    // endl: سطر جديد + تفريغ المخزن المؤقت — أبطأ\n    std::cout << \"سطر 3\" << std::endl;\n\n    // القاعدة: استخدم '\\n' عادةً، endl فقط عند الحاجة للتفريغ الفوري\n    // مثل: تصحيح أخطاء أو كتابة ملف يتطلب تحديثًا فوريًا\n}`,
      "explanationArabic": "endl يُفرغ المخزن المؤقت (flush) مما يضمن ظهور المخرج فورًا. لكن هذا أبطأ لأنه يُجبر كتابة فعلية لكل سطر. '\\n' يضيف سطرًا جديدًا فقط ويترك التفريغ للنظام. في الحلقات الكبيرة، الفرق في الأداء ملحوظ. استخدم '\\n' افتراضيًا."
    }
  ],

  "std::cerr": [
    {
      "titleArabic": "كتابة رسائل خطأ",
      "code": `#include <iostream>\n\nint main() {\n    std::cerr << \"خطأ: فشل تحميل الملف\\n\";\n    std::cerr << \"المستوى: حرج\\n\";\n    // يكتب على stderr — يظهر فورًا حتى مع إعادة التوجيه\n}`,
      "explanationArabic": "cerr مُرتبط بـ stderr. الفرق عن cout: stderr غير مُخزَّن مؤقتًا (unbuffered) لذلك يظهر فورًا حتى عند توجيه stdout لملف. هذا مهم لرسائل الخطأ التي يجب أن تظهر حتى لو تم توجيه المخرج العادي. يمكن فصل المخرجين: ./program > output.txt 2> errors.txt"
    },
    {
      "titleArabic": "فصل الأخطاء عن المخرج العادي",
      "code": `#include <iostream>\n\nint main() {\n    // هذه تذهب لـ stdout (يمكن توجيهها لملف)\n    std::cout << \"بيانات عادية\\n\";\n\n    // هذه تذهب لـ stderr (تبقى على الشاشة حتى مع التوجيه)\n    std::cerr << \"خطأ: شيء ما حدث\\n\";\n\n    // في الطرفية:\n    // ./program > out.txt\n    // \"بيانات عادية\" تذهب لـ out.txt\n    // \"خطأ: شيء ما حدث\" تظهر على الشاشة\n}`,
      "explanationArabic": "الفصل بين stdout وstderr مفيد في السكربتات والأتمتة. stdout للمخرج العادي (بيانات، نتائج)، stderr للأخطاء والتنبيهات. هذا يسمح بحفظ المخرج في ملف ورؤية الأخطاء على الشاشة في نفس الوقت."
    },
    {
      "titleArabic": "cerr مع clog",
      "code": `#include <iostream>\n\nint main() {\n    // cerr: غير مُخزَّن — يظهر فورًا (للأخطاء الحرجة)\n    std::cerr << \"خطأ فوري\\n\";\n\n    // clog: مُخزَّن — أسرع (للسجلات)\n    std::clog << \"سجل: بدء التشغيل\\n\";\n\n    // القاعدة:\n    // cerr للأخطاء التي يجب رؤيتها فورًا\n    // clog للسجلات التي لا تحتاج ظهورًا فوريًا\n}`,
      "explanationArabic": "clog مُرتبط بـ stderr مثل cerr لكنه مُخزَّن مؤقتًا (buffered) مثل cout. هذا يعني أنه أسرع لكن قد لا يظهر فورًا عند الأزمات. استخدم cerr للأخطاء الحرجة وclog للسجلات العادية. كلاهما يكتبان على stderr."
    }
  ],

  "std::endl": [
    {
      "titleArabic": "الفرق عن '\\n'",
      "code": `#include <iostream>\n\nint main() {\n    // '\\n': حرف سطر جديد فقط\n    std::cout << 'a' << '\\n' << 'b' << '\\n';\n\n    // endl: سطر جديد + flush\n    std::cout << 'c' << std::endl << 'd' << std::endl;\n\n    // كلاهما يُخرج سطرًا جديدًا، لكن endl أبطأ بسبب flush\n}`,
      "explanationArabic": "endl يُفرغ المخزن المؤقت بعد إضافة السطر الجديد. هذا يضمن أن كل شيء مكتوب فعليًا على الجهاز. لكن flush عملية مكلفة تتطلب استدعاء نظام. في الممارسة، استخدم '\\n' للإخراج العادي وendl فقط عند الحاجة لتحديث فوري."
    },
    {
      "titleArabic": "متى تحتاج endl فعلًا",
      "code": `#include <iostream>\n#include <thread>\n#include <chrono>\n\nint main() {\n    // بدون endl أو flush: قد لا يظهر شيء حتى يمتلئ المخزن\n    for (int i = 0; i < 5; ++i) {\n        std::cout << \"خطوة \" << i << std::endl;  // flush لضمان الظهور فورًا\n        std::this_thread::sleep_for(std::chrono::milliseconds(500));\n    }\n\n    // مع '\\n': قد تظهر كل الخطوات دفعة واحدة في النهاية\n    // مع endl: تظهر كل خطوة في وقتها\n}`,
      "explanationArabic": "في سيناريوهات مثل شريط تقدم أو مخرج متزامن مع خيوط، تحتاج ظهورًا فوريًا. endl يضمن ذلك. البديل: cout.flush() بعد '\\n' يفعل نفس الشيء لكن endl أوضح في النية. flush أيضاً مفيد عند الكتابة لملف تُقرأه عملية أخرى في نفس الوقت."
    },
    {
      "titleArabic": "لا تستخدم endl في الحلقات الكبيرة",
      "code": `#include <iostream>\n\nint main() {\n    // ❌ بطيء: flush بعد كل سطر\n    // for (int i = 0; i < 100000; ++i) {\n    //     std::cout << i << std::endl;\n    // }\n\n    // ✅ أسرع: '\n' فقط — flush مرة واحدة في النهاية\n    for (int i = 0; i < 100000; ++i) {\n        std::cout << i << '\\n';\n    }\n    std::cout << std::flush;  // flush واحد في النهاية إن احتجت\n}`,
      "explanationArabic": "في الحلقات الكبيرة، فرق الأداء بين endl و'\\n' يمكن أن يكون كبيرًا لأن flush يُجبر كتابة فعلية لكل سطر. استخدم '\\n' في الحلقات وflush يدويًا عند الحاجة. المخزن المؤقت موجود لسبب — دعه يعمل."
    }
  ],

  "std::ifstream": [
    {
      "titleArabic": "قراءة ملف سطرًا بسطر",
      "code": `#include <fstream>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::ifstream file(\"data.txt\");\n\n    if (!file.is_open()) {\n        std::cerr << \"فشل فتح الملف\\n\";\n        return 1;\n    }\n\n    std::string line;\n    while (std::getline(file, line)) {\n        std::cout << line << '\\n';\n    }\n    // يُغلق تلقائيًا عند خروج النطاق\n}`,
      "explanationArabic": "ifstream يفتح ملفًا للقراءة. is_open() يفحص نجاح الفتح. getline يقرأ سطرًا كاملًا (حتى '\\n'). الحلقة while (getline(...)) تتوقف عند نهاية الملف أو خطأ. الملف يُغلق تلقائيًا عند خروج ifstream من النطاق (RAII)."
    },
    {
      "titleArabic": "قراءة قيم مفصولة بفواصل (CSV بسيط)",
      "code": `#include <fstream>\n#include <string>\n#include <sstream>\n#include <iostream>\n\nint main() {\n    std::ifstream file(\"data.csv\");\n    std::string line;\n\n    while (std::getline(file, line)) {\n        std::stringstream ss(line);\n        std::string name;\n        int score;\n\n        if (std::getline(ss, name, ',') && ss >> score) {\n            std::cout << name << \": \" << score << '\\n';\n        }\n    }\n}`,
      "explanationArabic": "getline مع المُعامل الثالث (الفاصل) يقرأ حتى الفاصل المحدد بدل سطر جديد. stringstream يُستخدم لتحليل السطر: getline للأسماء و>> للأعداد. هذا نمط أساسي لقراءة ملفات CSV البسيطة. للملفات المعقدة استخدم مكتبة مخصصة."
    },
    {
      "titleArabic": "التحقق من الأخطاء أثناء القراءة",
      "code": `#include <fstream>\n#include <iostream>\n\nint main() {\n    std::ifstream file(\"numbers.txt\");\n    if (!file) {\n        std::cerr << \"فشل الفتح\\n\";\n        return 1;\n    }\n\n    int sum = 0;\n    int value;\n    while (file >> value) {  // يتوقف عند خطأ أو نهاية الملف\n        sum += value;\n    }\n\n    if (file.bad()) {\n        std::cerr << \"خطأ قراءة فادح\\n\";\n    } else if (!file.eof()) {\n        std::cerr << \"خطأ تحليل: بيانات غير صالحة\\n\";\n    } else {\n        std::cout << \"المجموع: \" << sum << '\\n';\n    }\n}`,
      "explanationArabic": "while (file >> value) يتوقف عند أي فشل. بعد الحلقة، يجب فحص السبب: bad() لخطأ فادح (فشل القراءة نفسها)، eof() لنهاية الملف الطبيعية، أو حالة وسيطة تعني بيانات غير صالحة (مثل نص بدل عدد). هذا أنمط أساسي لمعالجة الأخطاء عند القراءة."
    }
  ],

  "std::ofstream": [
    {
      "titleArabic": "كتابة ملف نصي",
      "code": `#include <fstream>\n#include <iostream>\n\nint main() {\n    std::ofstream file(\"output.txt\");\n\n    if (!file.is_open()) {\n        std::cerr << \"فشل إنشاء الملف\\n\";\n        return 1;\n    }\n\n    file << \"السطر الأول\\n\";\n    file << \"السطر الثاني\\n\";\n    file << 42 << '\\n';\n    // يُغلق ويُفرغ تلقائيًا عند الخروج\n}`,
      "explanationArabic": "ofstream يُنشئ ملفًا للكتابة (يُفرغ الملف إن وُجد). is_open() يفحص النجاح. الكتابة مثل cout عبر operator<<. الملف يُغلق ويُفرغ تلقائيًا عند خروج النطاق. إن احتجت إلحاقًا بدل فراغ: ofstream file(\"out.txt\", ios::app)."
    },
    {
      "titleArabic": "إلحاق بدل فراغ",
      "code": `#include <fstream>\n#include <iostream>\n\nint main() {\n    // ios::app: إلحاق في النهاية — لا يُفرغ الملف\n    std::ofstream log(\"log.txt\", std::ios::app);\n\n    log << \"[سجل] بدء التشغيل\\n\";\n    log << \"[سجل] تحميل الموارد\\n\";\n    // كل تشغيل يضيف دون حذف المحتوى السابق\n}`,
      "explanationArabic": "بدون ios::app، ofstream يُفرغ الملف عند الفتح. مع ios::app، الكتابة تذهب لنهاية الملف الحالي. مفيد لملفات السجل. البدائل: ios::trunc (الافتراضي — يفرغ)، ios::in (للقراءة مع fstream). يمكن دمجها: ios::out | ios::app."
    },
    {
      "titleArabic": "كتابة ثنائية",
      "code": `#include <fstream>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<float> vertices = {0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f};\n\n    // ios::binary: لا تحويلات نصية — كتابة خام\n    std::ofstream file(\"mesh.bin\", std::ios::binary);\n    if (!file) return 1;\n\n    // كتابة البايتات مباشرة\n    file.write(reinterpret_cast<const char*>(vertices.data()),\n               vertices.size() * sizeof(float));\n\n    std::cout << \"كُتبت \" << vertices.size() * sizeof(float) << \" بايت\\n\";\n}`,
      "explanationArabic": "ios::binary يمنع تحويلات النظام (مثل تحويل \\n لـ \\r\\n على Windows). write يكتب بايتات خام مباشرة. reinterpret_cast يحول مؤشر float لـ const char* لأن write يعمل على محارف. هذا النمط شائع لكتابة بيانات الشبكات والملفات الثنائية."
    }
  ],

  "std::fstream": [
    {
      "titleArabic": "قراءة وكتابة في نفس الملف",
      "code": `#include <fstream>\n#include <iostream>\n\nint main() {\n    // فتح للقراءة والكتابة\n    std::fstream file(\"config.txt\",\n        std::ios::in | std::ios::out);\n\n    if (!file.is_open()) {\n        // إنشاء إن لم يكن موجودًا\n        file.open(\"config.txt\", std::ios::in | std::ios::out | std::ios::trunc);\n        file << \"volume=80\\n\";\n    }\n\n    // القراءة والكتابة على نفس الكائن\n    file.seekg(0);  // العودة للبداية\n    std::string line;\n    while (std::getline(file, line)) {\n        std::cout << line << '\\n';\n    }\n}`,
      "explanationArabic": "fstream يجمع القراءة والكتابة. ios::in | ios::out يفتح للاثنين. seekg يُحرّك مؤشر القراءة وseekp يُحرّك مؤشر الكتابة. التحذير: التبديل بين القراءة والكتابة يتطلب seek أو flush في بعض المترجمات."
    },
    {
      "titleArabic": "تعديل قيمة في ملف",
      "code": `#include <fstream>\n#include <string>\n#include <iostream>\n\nint main() {\n    // إنشاء ملف تجريبي\n    {\n        std::ofstream f(\"data.txt\");\n        f << \"count=5\\nname=test\\n\";\n    }\n\n    std::fstream file(\"data.txt\", std::ios::in | std::ios::out);\n    std::string line;\n    std::streampos pos = 0;\n\n    while (std::getline(file, line)) {\n        if (line.find(\"count=\") == 0) {\n            // العودة لموضع بداية السطر\n            file.seekp(pos);\n            file << \"count=10\\n\";  // تعديل القيمة\n            break;\n        }\n        pos = file.tellg();\n    }\n\n    file.close();\n    // اقرأ الملف للتحقق\n    std::ifstream check(\"data.txt\");\n    std::cout << check.rdbuf();  // count=10 ثم name=test\n}`,
      "explanationArabic": "tellg() يُرجع موضع القراءة الحالي. seekp يُحرّك مؤشر الكتابة لهذا الموضع. التعديل يعمل فقط إذا كان النص الجديد بنفس طول القديم أو أقصر. للتعديلات التي تغير الطول، اكتب ملفًا جديدًا كاملًا ثم أعد تسميته."
    },
    {
      "titleArabic": "التحذير: seekg بين القراءة والكتابة",
      "code": `#include <fstream>\n#include <iostream>\n\nint main() {\n    std::fstream file(\"test.txt\", std::ios::in | std::ios::out | std::ios::trunc);\n    file << \"ABCDE\\n\";\n\n    file.seekg(0);  // مؤشر القراءة في البداية\n    char c;\n    file >> c;  // يقرأ 'A'\n\n    // ⚠️ على بعض المترجمات: يجب seek قبل الكتابة بعد القراءة\n    file.seekp(file.tellg());\n    file << 'X';  // يكتب 'X' بدل 'B'\n\n    file.seekg(0);\n    std::cout << static_cast<char>(file.get())  // X\n              << static_cast<char>(file.get())  // C\n              << '\\n';\n}`,
      "explanationArabic": "بعض المترجمات تتطلب seekp بين القراءة والكتابة على نفس fstream. هذا لأن القراءة والكتابة قد يستخدمان مخازن مؤقتة مختلفة. القاعدة الآمنة: دائمًا استخدم seek بعد التبديل بين القراءة والكتابة. للملفات البسيطة، اقرأ كل شيء في الذاكرة، عدّل، ثم اكتب."
    }
  ],

  "std::stringstream": [
    {
      "titleArabic": "تحويل بين الأنواع",
      "code": `#include <sstream>\n#include <string>\n#include <iostream>\n\nint main() {\n    // عدد إلى سلسلة\n    std::ostringstream out;\n    out << 3.14159 << \" rad\";\n    std::string result = out.str();\n    std::cout << result << '\\n';  // 3.14159 rad\n\n    // سلسلة إلى عدد\n    std::istringstream in(\"42\");\n    int value;\n    in >> value;\n    std::cout << value * 2 << '\\n';  // 84\n}`,
      "explanationArabic": "ostringstream يكتب في سلسلة (مثل cout). str() يُرجع السلسلة المبنية. istringstream يقرأ من سلسلة (مثل cin). >> يستخرج القيم حسب النوع. stringstream يجمع الاثنين. البديل الحديث: std::to_string وstd::stoi لكن stringstream أقوى مع الصيغ المخصصة."
    },
    {
      "titleArabic": "بناء سلسلة ديناميكية",
      "code": `#include <sstream>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::stringstream ss;\n\n    ss << \"الإصدار: \" << 2 << \".\" << 1 << \".\" << 0 << '\\n';\n    ss << \"الأبعاد: \" << 800 << \"x\" << 600 << '\\n';\n\n    std::string info = ss.str();\n    std::cout << info;\n    // المخرج:\n    // الإصدار: 2.1.0\n    // الأبعاد: 800x600\n}`,
      "explanationArabic": "stringstream يبني سلسلة خطوة بخطوة مثل cout لكن في الذاكرة. أنظف من سلسلة + operator+ لأنه لا يُنشئ سلاسل مؤقتة. لكن std::format (C++20) أنظف وأسرع إن كان متاحًا. stringstream مفيد في الكود الذي يحتاج توافق مع C++17 وأقدم."
    },
    {
      "titleArabic": "تحليل سلسلة معقدة",
      "code": `#include <sstream>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::string data = \"red=255,green=128,blue=64\";\n    std::stringstream ss(data);\n    std::string token;\n\n    while (std::getline(ss, token, ',')) {\n        std::stringstream pair(token);\n        std::string name;\n        char eq;\n        int value;\n\n        if (pair >> name >> eq >> value && eq == '=') {\n            std::cout << name << \": \" << value << '\\n';\n        }\n    }\n    // المخرج:\n    // red: 255\n    // green: 128\n    // blue: 64\n}`,
      "explanationArabic": "getline مع فاصل يُجزئ السلسلة. كل جزء يُحلل بدوره بـ stringstream. pair >> name يقرأ كلمة و>> eq يقرأ حرفًا واحدًا. هذا أنموذج تحليل مرن لكنه هش مع المدخلات غير الصالحة. للتحليل المعقد، استخدم مكتبة مخصصة."
    }
  ],

  "std::sort": [
    {
      "titleArabic": "ترتيب تصاعدي",
      "code": `#include <algorithm>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {5, 2, 8, 1, 9, 3};\n\n    std::sort(v.begin(), v.end());\n\n    for (int x : v) std::cout << x << ' ';\n    // المخرج: 1 2 3 5 8 9\n}`,
      "explanationArabic": "std::sort يرتب العناصر في النطاق [begin, end) بتعقيد O(n log n) متوسط. يستخدم Introsort (مزيج من quicksort، heapsort، وinsertion sort). لا يحتاج حاوية — يعمل على أي مكرر عشوائي (vector، array، صفيف C). الترتيب الافتراضي تصاعدي عبر operator<."
    },
    {
      "titleArabic": "ترتيب تنازلي أو مخصص",
      "code": `#include <algorithm>\n#include <vector>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n\n    // تنازلي عبر std::greater\n    std::sort(v.begin(), v.end(), std::greater<int>());\n    for (int x : v) std::cout << x << ' ';\n    // المخرج: 5 4 3 1 1\n\n    // ترتيب مخصص: حسب طول السلسلة\n    std::vector<std::string> words = {\"hi\", \"hello\", \"hey\", \"yo\"};\n    std::sort(words.begin(), words.end(),\n        [](const std::string& a, const std::string& b) {\n            return a.length() < b.length();\n        });\n    for (const auto& w : words) std::cout << w << ' ';\n    // المخرج: hi yo hey hello\n}`,
      "explanationArabic": "المعامل الثالث هو دالة مقارنة تُرجع true إن كان a يجب أن يكون قبل b. std::greater يجعل الترتيب تنازليًا. Lambda يسمح بأي معيار ترتيب. المقارنة يجب أن تكون strict weak ordering: لا ترجع true عند a == a."
    },
    {
      "titleArabic": "ترتيب جزء من المصفوفة",
      "code": `#include <algorithm>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {9, 3, 7, 1, 5, 2, 8, 4, 6};\n\n    // ترتيب العناصر من الفهرس 2 إلى 6 فقط\n    std::sort(v.begin() + 2, v.begin() + 7);\n\n    for (int x : v) std::cout << x << ' ';\n    // المخرج: 9 3 1 2 5 7 8 4 6\n    //              ^^^^^^^^^ مرتبة\n}`,
      "explanationArabic": "std::sort يعمل على أي نطاق محدد بمكررين. begin() + n يُرجع مكررًا عند الفهرس n. هذا يسمح بترتيب جزء فقط من المصفوفة. النطاق [begin+2, begin+7) يشمل الفهارس 2,3,4,5,6 فقط."
    }
  ],

  "std::memcpy": [
    {
      "titleArabic": "نسخ بيانات خام بين المصفوفات",
      "code": `#include <cstring>\n#include <iostream>\n\nint main() {\n    float src[4] = {1.0f, 2.0f, 3.0f, 4.0f};\n    float dst[4];\n\n    // نسخ 4 عناصر float (16 بايت)\n    std::memcpy(dst, src, 4 * sizeof(float));\n\n    for (int i = 0; i < 4; ++i) {\n        std::cout << dst[i] << ' ';\n    }\n    // المخرج: 1 2 3 4\n}`,
      "explanationArabic": "memcpy ينسخ بايتات من src لـ dst مباشرة دون اعتبار النوع. أسرع من نسخ عنصر بعنصر لأنه قد يستخدم تعليمات معالج مُحسّنة. يجب حساب الحجم بالبايت: عدد العناصر × sizeof(النوع). لا يستخدم مُنشئات النسخ — نسخ بت لبت."
    },
    {
      "titleArabic": "نسخ بيانات حاوية لصفيف C",
      "code": `#include <cstring>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<float> vertices = {0.0f, 1.0f, 0.0f, 1.0f, 0.0f, 0.0f};\n\n    // data() يُرجع مؤشرًا خامًا للبيانات\n    float* raw = new float[vertices.size()];\n    std::memcpy(raw, vertices.data(), vertices.size() * sizeof(float));\n\n    for (size_t i = 0; i < vertices.size(); ++i) {\n        std::cout << raw[i] << ' ';\n    }\n    delete[] raw;\n}`,
      "explanationArabic": "data() على vector يُرجع مؤشرًا خامًا للبيانات المتجاوزة. هذا يسمح باستخدام memcpy لنسخ البيانات لصفيف C أو تمريرها لواجهة C. هذا النمط شائع عند التفاعل مع واجهات برمجة تطبيقات (APIs) تتوقع صفائف C."
    },
    {
      "titleArabic": "خطأ شائع: memcpy مع كائنات غير trivially copyable",
      "code": `#include <cstring>\n#include <string>\n#include <iostream>\n\nint main() {\n    // ❌ خطأ: std::string ليس trivially copyable\n    // std::string src = \"hello\";\n    // std::string dst;\n    // std::memcpy(&dst, &src, sizeof(std::string));\n    // قد ينسخ المؤشر الداخلي فقط — عند تدمير كلاهما يحرر نفس الذاكرة مرتين!\n\n    // ✅ صحيح: استخدم النسخ العادي\n    std::string src = \"hello\";\n    std::string dst = src;  // نسخة صحيحة عبر مُنشئ النسخ\n\n    std::cout << dst << '\\n';  // hello\n\n    // القاعدة: memcpy فقط للأنواع البسيطة (int, float, POD)\n    // لا تستخدمه مع أنواع تمتلك موارد (string, vector, unique_ptr)\n}`,
      "explanationArabic": "memcpy ينسخ البايتات فقط دون استدعاء مُنشئ نسخ. مع std::string، هذا ينسخ المؤشر الداخلي للبيانات لا البيانات نفسها. عند تدمير النسختين، يُحرر نفس الذاكرة مرتين (double free). استخدم memcpy فقط مع الأنواع البسيطة (trivially copyable): أعداد، صفائف، بنيات POD."
    }
  ],

  "std::filesystem::path": [
    {
      "titleArabic": "بناء مسارات بشكل محمول",
      "code": `#include <filesystem>\n#include <iostream>\n\nnamespace fs = std::filesystem;\n\nint main() {\n    // operator/ يضيف فاصل مسار صحيح للنظام\n    fs::path p = \"assets\" / \"textures\" / \"img.png\";\n\n    std::cout << p.string() << '\\n';\n    // على Linux: assets/textures/img.png\n    // على Windows: assets\\textures\\img.png\n}`,
      "explanationArabic": "operator/ يضيف الفاصل الصحيح تلقائيًا (/ على Linux، \\ على Windows). هذا يحل مشكلة كتابة المسارات يدويًا. path يخزن المسار كتسلسل من المكونات لا كسلسلة واحدة، لذلك يمكن التعامل معه بشكل مجرد."
    },
    {
      "titleArabic": "تحليل مكونات المسار",
      "code": `#include <filesystem>\n#include <iostream>\n\nnamespace fs = std::filesystem;\n\nint main() {\n    fs::path p = \"/home/user/docs/report.txt\";\n\n    std::cout << \"اسم الملف: \" << p.filename() << '\\n';     // report.txt\n    std::cout << \"الامتداد: \" << p.extension() << '\\n';     // .txt\n    std::cout << \"الجذر: \" << p.stem() << '\\n';              // report\n    std::cout << \"الأصل: \" << p.parent_path() << '\\n';       // /home/user/docs\n    std::cout << \"الجذر المطلق: \" << p.root_name() << '\\n'; // (فارغ على Linux)\n}`,
      "explanationArabic": "path يوفر طرقًا لتحليل مكونات المسار: filename() اسم الملف، extension() الامتداد، stem() الاسم بدون امتداد، parent_path() الدليل الأب. هذه تعمل بشكل صحيح عبر الأنظمة المختلفة بدل تحليل السلسلة يدويًا."
    },
    {
      "titleArabic": "عمليات على الملفات",
      "code": `#include <filesystem>\n#include <iostream>\n\nnamespace fs = std::filesystem;\n\nint main() {\n    fs::path file = \"test.txt\";\n\n    // إنشاء ملف فارغ\n    std::ofstream(file.string()).close();\n\n    std::cout << \"موجود: \" << fs::exists(file) << '\\n';       // true\n    std::cout << \"حجم: \" << fs::file_size(file) << '\\n';       // 0\n    std::cout << \"مسار مطلق: \" << fs::absolute(file) << '\\n';\n\n    // إعادة تسمية\n    fs::rename(file, \"renamed.txt\");\n    std::cout << \"بعد إعادة التسمية: \" << fs::exists(\"renamed.txt\") << '\\n';\n\n    // حذف\n    fs::remove(\"renamed.txt\");\n}`,
      "explanationArabic": "filesystem يوفر عمليات ملفات محمولة: exists، file_size، absolute، rename، remove. كلها تأخذ path كمعامل. البديل مع error_code: fs::remove(file, ec) لا ترمي استثناء. هذه الواجهة أنظف بكثير من استدعاءات النظام المباشرة."
    }
  ],

  "std::chrono::duration": [
    {
      "titleArabic": "تمثيل فترة زمنية",
      "code": `#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono;\n\n    duration<int, std::milli> timeout(100);  // 100 ميلي ثانية\n    duration<double> seconds(1.5);            // 1.5 ثانية\n    duration<long, std::ratio<60>> minute(2); // دقيقتان\n\n    std::cout << timeout.count() << \" ميلي ثانية\\n\";\n    std::cout << seconds.count() << \" ثانية\\n\";\n\n    // التحويل بين الوحدات\n    auto ms = duration_cast<milliseconds>(seconds);\n    std::cout << ms.count() << \" ميلي ثانية\\n\";  // 1500\n}`,
      "explanationArabic": "duration هو قالب: المعامل الأول نوع العدد، الثاني نسبة الوحدة لثانية. milliseconds وseconds اختصارات جاهزة. count() يُرجع القيمة بالوحدة المحددة. duration_cast يحول بين الوحدات (قد يفقد دقة). النوع يمنع خلط الوحدات خطأً وقت الترجمة."
    },
    {
      "titleArabic": "عمليات حسابية على المدد",
      "code": `#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono;\n\n    auto frame_time = milliseconds(16);  // ~60 FPS\n    auto total = frame_time * 60;        // إطار واحد لكل 60 إطار\n\n    std::cout << \"دقيقة واحدة: \" << total.count() << \" ميلي ثانية\\n\";  // 960\n\n    auto delta = seconds(2) - milliseconds(500);\n    std::cout << \"الفرق: \" << delta.count() << \" ثانية\\n\";  // 1.5\n\n    // مقارنة\n    if (frame_time < milliseconds(20)) {\n        std::cout << \"أسرع من 50 FPS\\n\";\n    }\n}`,
      "explanationArabic": "يمكن ضرب وقسمة duration بأعداد. الطرح يعمل تلقائيًا عند توافق الوحدات. المقارنة تعمل عبر الوحدات المختلفة لأن التحويل يتم ضمنيًا عند الأمان. هذا يمنع أخطاء مثل مقارنة ميلي ثانية بثانية عن طريق الخطأ."
    },
    {
      "titleArabic": "استخدام literals (C++14)",
      "code": `#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono_literals;\n\n    auto timeout = 100ms;    // milliseconds\n    auto delay = 2.5s;       // seconds (double)\n    auto interval = 30min;   // minutes\n\n    std::cout << timeout.count() << \" ميلي ثانية\\n\";\n    std::cout << delay.count() << \" ثانية\\n\";\n\n    auto total = timeout + duration_cast<std::chrono::milliseconds>(delay);\n    std::cout << \"المجموع: \" << total.count() << \" ميلي ثانية\\n\";\n}`,
      "explanationArabic": "chrono_literals توفر وحدات مكتوبة: ms،s،min،h. أنظف من كتابة duration<int, std::milli>(100). التحويل بين الوحدات يحتاج duration_cast عند فقدان الدقة. هذه الـ literals متوفرة من C++14."
    }
  ],

  "std::chrono::time_point": [
    {
      "titleArabic": "حساب مدة عملية",
      "code": `#include <chrono>\n#include <iostream>\n#include <thread>\n\nint main() {\n    auto start = std::chrono::steady_clock::now();\n\n    // محاكاة عمل\n    std::this_thread::sleep_for(std::chrono::milliseconds(100));\n\n    auto end = std::chrono::steady_clock::now();\n\n    // الطرح بين نقطتين زمنيتين يُنتج duration\n    auto elapsed = end - start;\n    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(elapsed);\n    std::cout << \"المدة: \" << ms.count() << \" ميلي ثانية\\n\";\n}`,
      "explanationArabic": "time_point يمثل لحظة زمنية مرتبطة بساعة. الطرح بين نقطتين يُنتج duration. steady_clock مناسب لقياس المدد لأنه لا يمكن ضبطه للوراء. duration_cast يحول النتيجة للوحدة المطلوبة."
    },
    {
      "titleArabic": "تحويل time_point لمدة منذ بداية البرنامج",
      "code": `#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono;\n\n    auto now = steady_clock::now();\n    // time_since_epoch يُرجع المدة منذ نقطة البداية للساعة\n    auto since_start = now.time_since_epoch();\n    auto secs = duration_cast<seconds>(since_start);\n\n    std::cout << \"منذ بداية الساعة: \" << secs.count() << \" ثانية\\n\";\n}`,
      "explanationArabic": "time_since_epoch() يُرجع المدة منذ نقطة الصفر للساعة (epoch). لـ steady_clock، Epoch عادةً لحظة بدء البرنامج أو النظام. القيمة الفعلية ليست مفيدة مباشرة — الفرق بين نقطتين هو المفيد."
    }
  ],

  "std::chrono::steady_clock": [
    {
      "titleArabic": "قياس deltaTime في حلقة لعبة",
      "code": `#include <chrono>\n#include <iostream>\n#include <thread>\n\nint main() {\n    using namespace std::chrono;\n    using Clock = steady_clock;\n\n    auto last_time = Clock::now();\n    float accumulated = 0.0f;\n\n    for (int frame = 0; frame < 5; ++frame) {\n        auto now = Clock::now();\n        auto dt = duration<float>(now - last_time).count();  // بالثواني\n        last_time = now;\n        accumulated += dt;\n\n        std::cout << \"إطار \" << frame << \": dt=\" << dt\n                  << \"s مجموع=\" << accumulated << \"s\\n\";\n\n        std::this_thread::sleep_for(milliseconds(100));\n    }\n}`,
      "explanationArabic": "steady_clock لا يمكن ضبطه للوراء — مثالي لقياس الفروق. duration<float> يُحوّل المدة لثواني عشرية. هذا النمط أساسي في حلقات الألعاب: حساب الوقت بين كل إطار لتحديث الحركة والفيزياء بشكل مستقل عن سرعة الإطارات."
    },
    {
      "titleArabic": "لماذا لا system_clock",
      "code": `#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono;\n\n    // steady_clock: لا يُضبط للوراء — آمن لقياس المدد\n    auto t1 = steady_clock::now();\n    // ... عمل ...\n    auto t2 = steady_clock::now();\n    auto diff = t2 - t1;  // دائمًا >= 0\n\n    // system_clock: قد يُضبط للوراء (مثل تحديث الساعة)\n    // auto s1 = system_clock::now();\n    // // قد يتغير الوقت هنا بسبب تحديث NTP!\n    // auto s2 = system_clock::now();\n    // auto sdiff = s2 - s1;  // قد يكون سالبًا!\n\n    std::cout << \"استخدم steady_clock لقياس المدد\\n\";\n    std::cout << \"استخدم system_clock للتواريخ والساعات الحقيقية\\n\";\n}`,
      "explanationArabic": "system_clock يمثل ساعة الجدار (wall clock) ويمكن ضبطه للوراء أو الأمام بواسطة المستخدم أو NTP. هذا يجعله غير آمن لقياس المدد. steady_clock مضمون أنه يزداد فقط. استخدم system_clock فقط عند الحاجة للتاريخ والوقت الحقيقي."
    }
  ],

  "std::less": [
    {
      "titleArabic": "المقارنة الافتراضية في الحاويات",
      "code": `#include <map>\n#include <set>\n#include <iostream>\n\nint main() {\n    // std::less هو الافتراضي — لا حاجة لذكره\n    std::map<std::string, int, std::less<>> m1;\n    std::map<std::string, int> m2;  // نفس الشيء\n\n    // std::less<> (بدون نوع) يسمح بالمقارنة المختلطة\n    m1[\"hello\"] = 1;\n    // m1[std::string_view("hello")] = 2;  // يعمل مع less<> لا مع less<string>\n\n    std::cout << \"std::less هو المعيار في كل الحاويات المرتبة\\n\";\n}`,
      "explanationArabic": "std::less هو كائن المقارنة الافتراضي في map، set، priority_queue، وsort. std::less<> (بدون معامل قالب) يسمح بمقارنة أنواع مختلفة طالما يمكن تحويل أحدهما للآخر. هذا مفيد مع string_view وstring."
    },
    {
      "titleArabic": "استخدامه مع أنواع مخصصة",
      "code": `#include <set>\n#include <iostream>\n\nstruct Point {\n    int x, y;\n    bool operator<(const Point& o) const {\n        if (x != o.x) return x < o.x;\n        return y < o.y;\n    }\n};\n\nint main() {\n    // std::less<Point> يستدعي operator< تلقائيًا\n    std::set<Point> points;\n    points.insert({1, 2});\n    points.insert({1, 3});\n    points.insert({0, 5});\n\n    for (const auto& p : points) {\n        std::cout << p.x << ',' << p.y << ' ';\n    }\n    // المخرج: 0,5 1,2 1,3 (مرتب حسب x ثم y)\n}`,
      "explanationArabic": "std::less<T> يستدعي operator< على النوع T. إن لم يوفر النوع operator<، لن يعمل مع الحاويات المرتبة. بدل توفير operator<، يمكنك تمرير كائن مقارنة مخصص كمعامل ثالث. لكن operator< أنظم عادةً."
    }
  ],

  "std::greater": [
    {
      "titleArabic": "عكس ترتيب map",
      "code": `#include <map>\n#include <iostream>\n\nint main() {\n    // std::greater يقلب الترتيب — الأكبر أولًا\n    std::map<std::string, int, std::greater<std::string>> desc;\n\n    desc[\"zebra\"] = 1;\n    desc[\"apple\"] = 2;\n    desc[\"mango\"] = 3;\n\n    for (const auto& [k, v] : desc) {\n        std::cout << k << ' ';\n    }\n    // المخرج: zebra mango apple (تنازلي أبجديًا)\n}`,
      "explanationArabic": "std::greater<T> يستدعي operator> بدل operator<. هذا يعكس ترتيب الحاوية بالكامل. المفاتيح لا تزال فريدة ومرتبة لكن بالاتجاه المعاكس. مفيد عند الحاجة لعرض بيانات مرتبة تنازليًا."
    },
    {
      "titleArabic": "min-heap مع priority_queue",
      "code": `#include <queue>\n#include <vector>\n#include <functional>\n#include <iostream>\n\nint main() {\n    // الافتراضي: max-heap (الأكبر في القمة)\n    // std::greater: min-heap (الأصغر في القمة)\n    std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;\n\n    min_pq.push(5);\n    min_pq.push(1);\n    min_pq.push(3);\n\n    while (!min_pq.empty()) {\n        std::cout << min_pq.top() << ' ';\n        min_pq.pop();\n    }\n    // المخرج: 1 3 5\n}`,
      "explanationArabic": "std::greater يقلب الكومة من max-heap لـ min-heap. عند تغيير المقارنة، يجب تحديد الحاوية الداخلية (المعامل الثاني) لأن المترجم لا يستطيع استنتاجها. هذا الأنموذج الأكثر شيوعًا لاستخدام std::greater."
    }
  ],

  "std::hash": [
    {
      "titleArabic": "حساب تجزئة لسلسلة",
      "code": `#include <functional>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::hash<std::string> hasher;\n\n    size_t h1 = hasher(\"hello\");\n    size_t h2 = hasher(\"hello\");\n    size_t h3 = hasher(\"world\");\n\n    std::cout << \"hello: \" << h1 << '\\n';\n    std::cout << \"hello: \" << h2 << \" (نفس القيمة)\\n\";\n    std::cout << \"world: \" << h3 << \" (مختلفة غالبًا)\\n\";\n}`,
      "explanationArabic": "std::hash<T> يوفر دالة تجزئة للأنواع القياسية. نفس المدخل يُعطي نفس الناتج دائمًا. القيمة من نوع size_t. لا يوجد ضمان أن مدخلات مختلفة تُعطي قيمًا مختلفة (تصادم ممكن). تستخدم داخليًا في unordered_map وunordered_set."
    },
    {
      "titleArabic": "تخصيص التجزئة لنوع مخصص",
      "code": `#include <functional>\n#include <string>\n#include <iostream>\n\nstruct Person {\n    std::string name;\n    int age;\n\n    bool operator==(const Person& o) const {\n        return name == o.name && age == o.age;\n    }\n};\n\n// تخصيص std::hash في نطاق std\ntemplate<>\nstruct std::hash<Person> {\n    size_t operator()(const Person& p) const noexcept {\n        size_t h1 = std::hash<std::string>{}(p.name);\n        size_t h2 = std::hash<int>{}(p.age);\n        return h1 ^ (h2 << 1);  // دمج بسيط\n    }\n};\n\nint main() {\n    std::hash<Person> hasher;\n    Person p{\"Ali\", 25};\n    std::cout << hasher(p) << '\\n';\n\n    // الآن يمكن استخدام Person مع unordered_map/set\n}`,
      "explanationArabic": "لتخصيص التجزئة، خصّص std::hash<T> في نطاق std. يجب أيضًا توفير operator== لأن الحاويات غير المرتبة تحتاج كلاهما. دمج التجزئة يمكن أن يكون بسيطًا (XOR) أو أفضل (boost::hash_combine). التخصص في نطاق std سلوك معرّف للأنواع المخصصة فقط."
    }
  ],

  "std::allocator": [
    {
      "titleArabic": "المعامل الافتراضي في الحاويات",
      "code": `#include <memory>\n#include <vector>\n#include <iostream>\n\nint main() {\n    // هذان متكافئان — allocator هو المعامل الأخير الافتراضي\n    std::vector<int> v1;\n    std::vector<int, std::allocator<int>> v2;\n\n    v1.push_back(42);\n    v2.push_back(42);\n\n    std::cout << v1[0] << ' ' << v2[0] << '\\n';\n}`,
      "explanationArabic": "std::allocator هو المعامل الأخير الافتراضي لكل حاويات STL. نادرًا ما تحتاج ذكره صراحةً. يوفر allocate/deallocate وconstruct/destroy. في C++20، construct/destroy أصبحتا اختياريتين. استخدمه فقط عند بناء حاوية مخصصة أو تخصيص استراتيجية التخصيص."
    },
    {
      "titleArabic": "تخصيص ذاكرة مباشرة",
      "code": `#include <memory>\n#include <iostream>\n\nint main() {\n    std::allocator<int> alloc;\n\n    // تخصيص ذاكرة خام — لا تُهيأ\n    int* p = alloc.allocate(5);\n\n    // بناء الأ objects في الذاكرة المخصصة\n    for (int i = 0; i < 5; ++i) {\n        alloc.construct(p + i, i * 10);  // C++17\n    }\n\n    for (int i = 0; i < 5; ++i) {\n        std::cout << p[i] << ' ';\n    }\n\n    // تدمير ثم تحرير\n    for (int i = 0; i < 5; ++i) {\n        alloc.destroy(p + i);  // C++17\n    }\n    alloc.deallocate(p, 5);\n}`,
      "explanationArabic": "allocate يخصص ذاكرة خام بدون بناء كائنات. construct يبني كائنًا في مكان محدد. destroy يدمر والتحرير بـ deallocate. هذا فصل بين التخصيص والبناء — أساس كيف تعمل الحاويات داخليًا. في C++20، construct/destroy أصبحتا no-op افتراضيًا."
    }
  ],

  "std::numeric_limits": [
    {
      "titleArabic": "معرفة حدود الأنواع العددية",
      "code": `#include <limits>\n#include <iostream>\n\nint main() {\n    std::cout << \"int max: \" << std::numeric_limits<int>::max() << '\\n';\n    std::cout << \"int min: \" << std::numeric_limits<int>::min() << '\\n';\n    std::cout << \"float max: \" << std::numeric_limits<float>::max() << '\\n';\n    std::cout << \"float epsilon: \" << std::numeric_limits<float>::epsilon() << '\\n';\n    std::cout << \"double digits: \" << std::numeric_limits<double>::digits10 << '\\n';\n    std::cout << \"int is signed: \" << std::numeric_limits<int>::is_signed << '\\n';\n}`,
      "explanationArabic": "numeric_limits يوفر معلومات ثابتة وقت الترجمة عن كل نوع عددي. max/min أعلى وأدنى قيمة. epsilon أصغر فرق يمكن تمييزه عن 1.0. digits10 عدد الأرقام العشرية الضامنة. is_signed هل النوع موقع. مفيد جدًا في الكود الحساسي عدديًا."
    },
    {
      "titleArabic": "استخدامه لتجنب الـ overflow",
      "code": `#include <limits>\n#include <iostream>\n\nint main() {\n    int a = std::numeric_limits<int>::max();\n    int b = 1;\n\n    // فحص قبل الإضافة لتجنب overflow\n    if (a > std::numeric_limits<int>::max() - b) {\n        std::cout << \"سيحدث overflow!\\n\";\n    } else {\n        std::cout << a + b << '\\n';\n    }\n\n    // بدون فحص: a + b = overflow — سلوك غير معرّف لـ int الموقع\n}`,
      "explanationArabic": "overflow على int موقع سلوك غير معرّف في C++. الفحص: إن كان a > MAX - b فالإضافة ستفيض. هذا النمط أساسي في الكود الذي يتعامل مع أعداد قد تتجاوز الحدود. البديل في C++20: std::in_range أو std::add_overflow."
    },
    {
      "titleArabic": "قيم خاصة: infinity و quiet_NaN",
      "code": `#include <limits>\n#include <iostream>\n\nint main() {\n    float inf = std::numeric_limits<float>::infinity();\n    float nan = std::numeric_limits<float>::quiet_NaN();\n\n    std::cout << \"inf: \" << inf << '\\n';\n    std::cout << \"nan: \" << nan << '\\n';\n\n    // فحص NaN — لا تستخدم == لأن NaN != NaN!\n    if (nan != nan) {\n        std::cout << \"هذا NaN\\n\";\n    }\n\n    // الطريقة الأفضل\n    if (std::isnan(nan)) {\n        std::cout << \"NaN مؤكد\\n\";\n    }\n\n    // infinity يفحص بـ isinf\n    if (std::isinf(inf)) {\n        std::cout << \"قيمة لا نهائية\\n\";\n    }\n}`,
      "explanationArabic": "infinity وquiet_NaN قيم خاصة لأعداد الفاصلة العائمة. NaN لا يساوي نفسه لذلك لا تستخدم == للفحص. isnan وisinf الدوال الصحيحة. NaN ينتج من عمليات مثل 0.0/0.0 أو sqrt(-1). infinity من قسمة على صفر أو تجاوز."
    }
  ],

  "std::type_info": [
    {
      "titleArabic": "فحص النوع وقت التشغيل",
      "code": `#include <typeinfo>\n#include <iostream>\n\nstruct Base { virtual ~Base() = default; };\nstruct Derived : Base {};\n\nint main() {\n    Derived d;\n    Base& ref = d;\n\n    // typeid مع مرجع لأساس يُرجع النوع الفعلي (الديناميكي)\n    const std::type_info& t = typeid(ref);\n    std::cout << t.name() << '\\n';  // اسم مشوه — يختلف حسب المترجم\n\n    if (t == typeid(Derived)) {\n        std::cout << \"الفعلية هي Derived\\n\";\n    }\n}`,
      "explanationArabic": "typeid يُرجع type_info يصف النوع. مع نوع متعدد الأشكال (له virtual)، typeid على مرجع أساسي يُرجع النوع الفعلي لا الأساسي. name() يُرجع نصًا مشوهًا يختلف حسب المترجم — لا تعتمد عليه. == يعمل بشكل صحيح عبر المترجمات."
    },
    {
      "titleArabic": "مقارنة الأنواع",
      "code": `#include <typeinfo>\n#include <iostream>\n\nint main() {\n    int a = 5;\n    double b = 3.14;\n\n    if (typeid(a) == typeid(b)) {\n        std::cout << \"نفس النوع\\n\";\n    } else {\n        std::cout << \"مختلف: \" << typeid(a).name()\n                  << \" vs \" << typeid(b).name() << '\\n';\n    }\n\n    // typeid مع نوع مباشر — معلومات وقت الترجمة\n    if (typeid(int) == typeid(a)) {\n        std::cout << \"a هو int\\n\";\n    }\n}`,
      "explanationArabic": "typeid يمكن تطبيقه على قيمة أو نوع. على نوع (typeid(int)) يكون وقت الترجمة. على قيمة قد يكون ديناميكيًا مع الأنواع متعددة الأشكال. == يقارن الأنواع لا النصوص لذلك يعمل عبر المترجمات. hash_code() متاح أيضًا للمقارنة السريعة."
    }
  ],

  "std::pair": [
    {
      "titleArabic": "إنشاء واستخدام زوج",
      "code": `#include <utility>\n#include <string>\n#include <iostream>\n\nint main() {\n    // عدة طرق للإنشاء\n    std::pair<std::string, int> p1{\"Atlas\", 2024};\n    auto p2 = std::make_pair(\"Guide\", 2025);\n\n    // الوصول عبر first وsecond\n    std::cout << p1.first << \": \" << p1.second << '\\n';\n    std::cout << p2.first << \": \" << p2.second << '\\n';\n\n    // C++17: structured binding\n    auto [name, year] = p1;\n    std::cout << name << \" - \" << year << '\\n';\n}`,
      "explanationArabic": "pair يجمع قيمتين: first وsecond. make_pair يستنتج الأنواع تلقائيًا. C++17 structured binding يفك الزوج مباشرة. pair هو أساس map وunordered_map — كل عنصر فيهما هو pair<const Key, Value>."
    },
    {
      "titleArabic": "إرجاع قيمتين من دالة",
      "code": `#include <utility>\n#include <tuple>\n#include <iostream>\n\nstd::pair<int, int> divide_remainder(int a, int b) {\n    return {a / b, a % b};  // C++17: لا حاجة لـ make_pair\n}\n\nint main() {\n    auto [quotient, remainder] = divide_remainder(17, 5);\n    std::cout << \"القسمة: \" << quotient << \" الباقي: \" << remainder << '\\n';\n    // المخرج: القسمة: 3 الباقي: 2\n}`,
      "explanationArabic": "pair بديل خفيف لـ tuple عند الحاجة لقيمتين فقط. مع structured binding، لا تحتاج first/second. البديل في C++17: يمكن إرجاع tuple أيضًا لكن pair أبسط ومفهوم أكثر عند قيمتين."
    },
    {
      "titleArabic": "المقارنة بين الأزواج",
      "code": `#include <utility>\n#include <iostream>\n\nint main() {\n    std::pair<int, int> a{1, 5};\n    std::pair<int, int> b{1, 3};\n    std::pair<int, int> c{2, 0};\n\n    // المقارنة: first أولًا، ثم second\n    std::cout << (a > b) << '\\n';  // true (5 > 3، first متساوي)\n    std::cout << (a < c) << '\\n';  // true (1 < 2)\n\n    // مفيد في الترتيب: حسب first ثم second\n    // هذا يُستخدم داخليًا في map للترتيب حسب المفتاح\n}`,
      "explanationArabic": "operator< على pair يقارن first أولًا، إن تساوى يقارن second. هذا يجعل pair قابلاً للترتيب تلقائيًا وهو أساس ترتيب map (map يرتب أزواج المفتاح-القيمة حسب المفتاح عبر هذا السلوك)."
    }
  ],

  "std::tuple": [
    {
      "titleArabic": "إنشاء وتفكيك tuple",
      "code": `#include <tuple>\n#include <string>\n#include <iostream>\n\nint main() {\n    // إنشاء\n    auto t = std::make_tuple(1, \"hello\", 3.14);\n\n    // الوصول بالفهرس (وقت الترجمة فقط)\n    std::cout << std::get<0>(t) << '\\n';  // 1\n    std::cout << std::get<1>(t) << '\\n';  // hello\n    std::cout << std::get<2>(t) << '\\n';  // 3.14\n\n    // C++17: structured binding — أنظف\n    auto [i, s, d] = t;\n    std::cout << i << ' ' << s << ' ' << d << '\\n';\n}`,
      "explanationArabic": "tuple يجمع أي عدد من القيم بأنواع مختلفة. std::get<N> يأخذ فهرسًا وقت الترجمة (لا متغيرًا). structured binding (C++17) يفكه لمتغيرات منفصلة — أنظم بكثير. tuple هو امتداد عام لـ pair."
    },
    {
      "titleArabic": "إرجاع عدة قيم من دالة",
      "code": `#include <tuple>\n#include <string>\n#include <iostream>\n\nstd::tuple<bool, std::string, int> parse_config(const std::string& line) {\n    // محاكاة تحليل: تعيد (نجاح، رسالة، قيمة)\n    return {true, \"تم\", 42};\n}\n\nint main() {\n    auto [success, message, value] = parse_config(\"key=42\");\n\n    if (success) {\n        std::cout << message << \": \" << value << '\\n';\n    } else {\n        std::cout << \"فشل: \" << message << '\\n';\n    }\n}`,
      "explanationArabic": "tuple كبديل لمعاملات إخراج (output parameters). أنظف من تمرير مراجع لأن النية واضحة: كل القيم مُرجعة. مع structured binding، الاستقبال سهل. في C++17، يمكنك أيضًا إرجاع بنية مجهولة الاسم في بعض الحالات."
    },
    {
      "titleArabic": "tuple_cat لدمج عدة tuples",
      "code": `#include <tuple>\n#include <iostream>\n\nint main() {\n    auto t1 = std::make_tuple(1, 2);\n    auto t2 = std::make_tuple(3.0, \"hello\");\n    auto t3 = std::make_tuple(true);\n\n    // دمج كل الأنواع في tuple واحد\n    auto merged = std::tuple_cat(t1, t2, t3);\n\n    std::cout << std::tuple_size<decltype(merged)>::value << '\\n';  // 5\n    std::cout << std::get<0>(merged) << '\\n';  // 1\n    std::cout << std::get<3>(merged) << '\\n';  // hello\n}`,
      "explanationArabic": "tuple_cat يدمج عدة tuples في واحد يحتوي كل العناصر بالترتيب. النوع الناتج هو tuple<الأنواع كلها>. مفيد في البرمجة العامة (metaprogramming) وعند بناء tuples ديناميكيًا من أجزاء."
    }
  ],

  "std::optional": [
    {
      "titleArabic": "قيمة قد لا تكون موجودة",
      "code": `#include <optional>\n#include <iostream>\n\nstd::optional<int> find_index(const std::string& s, char c) {\n    auto pos = s.find(c);\n    if (pos != std::string::npos) {\n        return static_cast<int>(pos);\n    }\n    return std::nullopt;  // لا قيمة\n}\n\nint main() {\n    auto result = find_index(\"hello\", 'l');\n    if (result.has_value()) {\n        std::cout << \"وجدت عند: \" << result.value() << '\\n';  // 2\n    } else {\n        std::cout << \"غير موجود\\n\";\n    }\n\n    // *result يعمل لكن خطر إن لم تتحقق\n}`,
      "explanationArabic": "optional يحمل قيمة أو لا يحمل شيئًا. has_value() أو التحويل لـ bool يفحصان. value() يُرجع القيمة أو يرمي bad_optional_access إن لم تكن موجودة. *opt مثل value() لكن سلوك غير معرّف إن فارغ. أنظف من إرجاع -1 أو nullptr كقيمة خاصة."
    },
    {
      "titleArabic": "value_or للقيمة الافتراضية",
      "code": `#include <optional>\n#include <string>\n#include <iostream>\n\nstd::optional<std::string> get_username(int id) {\n    if (id == 1) return \"Ali\";\n    return std::nullopt;\n}\n\nint main() {\n    std::string name = get_username(1).value_or(\"مجهول\");\n    std::cout << name << '\\n';  // Ali\n\n    std::string name2 = get_username(99).value_or(\"مجهول\");\n    std::cout << name2 << '\\n';  // مجهول\n\n    // value_or أنظم من: result ? *result : default\n}`,
      "explanationArabic": "value_or تُرجع القيمة إن وجدت أو البديل إن لم تكن. هذا أنظم من فحص has_value ثم value. البديل يُقيَّم دائمًا حتى لو لم يُحتاج — value_or يُقيَّم فقط عند الحاجة. مفيد في السلاسل والتعابير."
    },
    {
      "titleArabic": "بديل للمؤشرات الفارغة",
      "code": `#include <optional>\n#include <iostream>\n\nstruct Config {\n    int timeout;\n    int retries;\n};\n\n// ❌ مؤشر فارغ — لا يوضح أن الفرضية هي \"قد لا يكون\"\n// Config* get_config();  // هل nullptr يعني \"غير موجود\" أم خطأ؟\n\n// ✅ optional — النية واضحة\nstd::optional<Config> get_config() {\n    if (/* ملف موجود */) {\n        return Config{30, 3};\n    }\n    return std::nullopt;  // بوضوح: لا إعدادات\n}\n\nint main() {\n    auto cfg = get_config();\n    if (cfg) {\n        std::cout << \"timeout: \" << cfg->timeout << '\\n';\n    }\n}`,
      "explanationArabic": "optional أوضح من المؤشر الفارغ: المؤشر قد يعني \"غير موجود\" أو \"خطأ\" أو \"لم يُهيأ بعد\". optional يعني شيئًا واحدًا: \"قد لا تكون هناك قيمة\". لا يحتاج تخصيص ذاكرة (يخزن القيمة مباشرة مع بت علم). لا يدعم مراجع — لذلك لا تستخدم optional<T&>."
    }
  ],

  "std::variant": [
    {
      "titleArabic": "قيمة من أحد أنواع محددة",
      "code": `#include <variant>\n#include <string>\n#include <iostream>\n\nint main() {\n    // يمكن أن يكون int أو string أو double\n    std::variant<int, std::string, double> v = \"hello\";\n\n    v = 42;  // الآن int\n    v = 3.14;  // الآن double\n\n    // index() يُرجع فهرس النوع الحالي\n    std::cout << \"الفهرس: \" << v.index() << '\\n';  // 2 (double)\n\n    // get<N> يُرجع القيمة بالفهرس أو يرمي\n    std::cout << std::get<2>(v) << '\\n';  // 3.14\n    // std::get<0>(v);  // يرمي bad_variant_access\n}`,
      "explanationArabic": "variant يحمل قيمة واحدة من عدة أنواع محددة وقت الترجمة. آمن نوعيًا: لا يمكن الوصول للنوع الخطأ بدون استثناء. index() يُخبر بالنوع الحالي. get<N> يُرجع بالفهرس وget<T> بالنوع. البديل غير الآمن: union."
    },
    {
      "titleArabic": "std::visit لمعالجة كل الأنواع",
      "code": `#include <variant>\n#include <string>\n#include <iostream>\n\nstruct PrintVisitor {\n    void operator()(int v) const { std::cout << \"int: \" << v << '\\n'; }\n    void operator()(const std::string& v) const { std::cout << \"string: \" << v << '\\n'; }\n    void operator()(double v) const { std::cout << \"double: \" << v << '\\n'; }\n};\n\nint main() {\n    std::variant<int, std::string, double> v = \"world\";\n\n    // visit يستدعي operator() المناسب للنوع الحالي\n    std::visit(PrintVisitor{}, v);  // string: world\n\n    // مع generic lambda (C++20):\n    std::visit([](auto&& arg) {\n        std::cout << arg << '\\n';\n    }, v);\n}`,
      "explanationArabic": "visit يستدعي الزائر (visitor) المناسب للنوع الفعلي المخزن. الزائر يجب أن يوفر operator() لكل نوع ممكن. generic lambda يعمل لكنه لا يفرق بين الأنواع. visit هو الطريقة الأساسية لمعالجة variant بأمان."
    },
    {
      "titleArabic": "std::holds_alternative للفحص",
      "code": `#include <variant>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::variant<int, std::string> v = \"test\";\n\n    if (std::holds_alternative<std::string>(v)) {\n        std::cout << std::get<std::string>(v) << '\\n';\n    }\n\n    if (std::holds_alternative<int>(v)) {\n        std::cout << std::get<int>(v) << '\\n';  // لن يُنفذ\n    }\n\n    // get_if يُرجع مؤشرًا أو nullptr بدل رمي استثناء\n    if (auto* p = std::get_if<int>(&v)) {\n        std::cout << *p << '\\n';\n    } else {\n        std::cout << \"ليس int\\n\";\n    }\n}`,
      "explanationArabic": "holds_alternative<T> يفحص النوع بدون استثناء. get_if<T> يُرجع مؤشرًا للقيمة إن كان النوع صحيحًا أو nullptr إن لم يكن. هذا أنمط C التقليدي لكنه مفيد عندما لا تريد try/catch. القاعدة: استخدم visit إن أمكن، holds_alternative/get_if للحالات البسيطة."
    }
  ],

  "std::any": [
    {
      "titleArabic": "تخزين أي نوع",
      "code": `#include <any>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::any value = 42;\n    value = std::string(\"hello\");\n    value = 3.14;\n\n    // type() يُرجع type_info\n    std::cout << value.type().name() << '\\n';\n\n    // any_cast للوصول — يرمي bad_any_cast إن كان النوع خطأ\n    std::cout << std::any_cast<double>(value) << '\\n';  // 3.14\n    // std::any_cast<int>(value);  // يرمي!\n}`,
      "explanationArabic": "any يحمل قيمة من أي نوع مع نسخ نوعي آمن. type() يُخبر بالنوع المخزن. any_cast<T> يستخرج القيمة أو يرمي إن كان النوع خطأ. يُخصص ذاكرة على الكومة داخليًا. أبطأ من variant لأنه لا يعرف الأنواع الممكنة مسبقًا."
    },
    {
      "titleArabic": "فحص النوع قبل الوصول",
      "code": `#include <any>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::any data = std::string(\"Atlas\");\n\n    // فحص النوع قبل any_cast\n    if (data.type() == typeid(std::string)) {\n        auto& s = std::any_cast<std::string&>(data);\n        std::cout << s << '\\n';\n    }\n\n    // any_cast بمؤشر — يُرجع nullptr بدل رمي\n    if (auto* p = std::any_cast<std::string>(&data)) {\n        std::cout << *p << '\\n';\n    }\n}`,
      "explanationArabic": "any_cast بمؤشر يُرجع nullptr عند النوع الخطأ بدل رمي استثناء. هذا أنمط أنفس في بعض الحالات. type() == typeid(T) فحص نوعي صريح. انتبه: any_cast<std::string> يُرجع نسخة، any_cast<std::string&> يُرجع مرجعًا."
    },
    {
      "titleArabic": "متى تستخدم variant بدل any",
      "code": `#include <variant>\n#include <any>\n#include <iostream>\n\nint main() {\n    // ✅ variant: أنواع معروفة مسبقًا — أسرع وأكثر أمانًا\n    std::variant<int, double, std::string> v = 42;\n    std::cout << std::get<int>(v) << '\\n';\n\n    // ❌ any: أي نوع — أبطأ وأقل أمانًا\n    std::any a = 42;\n    std::cout << std::any_cast<int>(a) << '\\n';\n\n    // القاعدة:\n    // - أنواع محددة ومعروفة مسبقًا → variant\n    // - أنواع غير معروفة أو قادمة من خارج → any\n    // - لا تحتاج أيهما عادةً → صمم واجهة أوضح\n}`,
      "explanationArabic": "variant أسرع لأنه يعرف الأنواع الممكنة ويمكنه تخزين القيمة مباشرة (بدون كومة). any يحتاج كومة ونوع-محوا (type erasure). استخدم variant عندما تعرف الأنواع مسبقًا. أيهما أفضل من void* أو union غير الآمن. في كثير من الحالات، تصميم واجهة أفضل يغني عنهما."
    }
  ],

  "std::nullopt": [
    {
      "titleArabic": "إنشاء optional فارغ",
      "code": `#include <optional>\n#include <iostream>\n\nint main() {\n    std::optional<int> empty = std::nullopt;\n    std::optional<int> has_value = 42;\n\n    std::cout << std::boolalpha;\n    std::cout << empty.has_value() << '\\n';   // false\n    std::cout << has_value.has_value() << '\\n'; // true\n\n    // reset() يفعل نفس الشيء\n    has_value.reset();\n    std::cout << has_value.has_value() << '\\n';  // false\n}`,
      "explanationArabic": "nullopt ثابت خاص يمثل \"لا قيمة\". يُستخدم لتهيئة optional فارغ أو كقيمة إرجاع. reset() على optional يُفرغه أيضًا. nullopt أنظم من التهيئة الافتراضية لأنه يصرح بالنية صراحةً."
    },
    {
      "titleArabic": "استخدامه كقيمة إرجاع",
      "code": `#include <optional>\n#include <string>\n#include <iostream>\n\nstd::optional<std::string> lookup(int key) {\n    if (key == 1) return \"found\";\n    return std::nullopt;  // أوضح من return {};\n}\n\nint main() {\n    auto result = lookup(1);\n    if (result != std::nullopt) {\n        std::cout << *result << '\\n';\n    }\n\n    auto missing = lookup(99);\n    if (missing == std::nullopt) {\n        std::cout << \"غير موجود\\n\";\n    }\n}`,
      "explanationArabic": "nullopt يمكن مقارنته مع optional مباشرة. هذا أنظم من !result.has_value() في بعض الحالات. لكن has_value() أوضح عادةً. return std::nullopt أوضح من return {} لأن {} قد تعني أشياء مختلفة حسب السياق."
    }
  ],

  "std::monostate": [
    {
      "titleArabic": "حالة \"لا قيمة\" في variant",
      "code": `#include <variant>\n#include <string>\n#include <iostream>\n\nint main() {\n    // monostate كبديل أول — يمثل \"لا شيء\"\n    std::variant<std::monostate, int, std::string> v;\n\n    // الافتراضي هو monostate (أول بديل)\n    std::cout << (v.index() == 0) << '\\n';  // true\n\n    v = 42;\n    std::cout << v.index() << '\\n';  // 1\n\n    v = std::monostate{};  // إعادة لـ \"لا قيمة\"\n    std::cout << v.index() << '\\n';  // 0\n}`,
      "explanationArabic": "monostate نوع فارغ يمكن أن يكون البديل الأول في variant. يسمح بـ variant يبدأ \"فارغًا\" دون الحاجة لoptional. مفيد عندما تريد variant قابل للتهيئة الافتراضية لكن البدائل الأخرى كلها تحتاج معاملات."
    },
    {
      "titleArabic": "استخدامه مع visit",
      "code": `#include <variant>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::variant<std::monostate, int, std::string> v;\n\n    std::visit([](auto&& arg) {\n        using T = std::decay_t<decltype(arg)>;\n        if constexpr (std::is_same_v<T, std::monostate>) {\n            std::cout << \"لا قيمة\\n\";\n        } else if constexpr (std::is_same_v<T, int>) {\n            std::cout << \"عدد: \" << arg << '\\n';\n        } else {\n            std::cout << \"نص: \" << arg << '\\n';\n        }\n    }, v);\n}`,
      "explanationArabic": "مع monostate، تحتاج if constexpr داخل generic lambda للتمييز بين الحالات. هذا لأن monostate لا يحمل بيانات لمعالجتها. البديل: استخدم holds_alternative قبل visit أو استخدم زائر بعدة operator()."
    }
  ],

  "std::bitset": [
    {
      "titleArabic": "تعيين وفحص البتات",
      "code": `#include <bitset>\n#include <iostream>\n\nint main() {\n    std::bitset<8> flags;\n\n    flags.set(0);    // تعيين البت 0 = 1\n    flags.set(3);    // تعيين البت 3 = 1\n    flags.set(7);    // تعيين البت 7 = 1\n\n    std::cout << flags << '\\n';  // 10001001\n    std::cout << flags.test(3) << '\\n';  // 1 (صحيح)\n    std::cout << flags.test(1) << '\\n';  // 0 (خاطئ)\n}`,
      "explanationArabic": "bitset<N> يُنشئ N بت. set(pos) يُفعّل البت، reset(pos) يُلغيه، test(pos) يفحصه. العرض يطبع من الأعلى للأدنى (بت 7 أولًا). الحجم ثابت وقت الترجمة. مفيد للأعلام والخيارات الثنائية."
    },
    {
      "titleArabic": "عمليات منطقية على البتات",
      "code": `#include <bitset>\n#include <iostream>\n\nint main() {\n    std::bitset<8> a(\"11001010\");\n    std::bitset<8> b(\"10110101\");\n\n    std::cout << \"AND: \" << (a & b) << '\\n';  // 10000000\n    std::cout << \"OR:  \" << (a | b) << '\\n';  // 11111111\n    std::cout << \"XOR: \" << (a ^ b) << '\\n';  // 01111111\n    std::cout << \"NOT: \" << (~a) << '\\n';    // 00110101\n\n    std::cout << \"count: \" << a.count() << '\\n';  // 4 (عدد البتات المفعّلة)\n}`,
      "explanationArabic": "bitset يدعم العمليات المنطقية: & (AND)، | (OR)، ^ (XOR)، ~ (NOT). count() يُرجع عدد البتات المفعّلة (population count). هذه العمليات أسرح من الأعداد العادية لأنها تعمل على كل البتات دفعة واحدة."
    },
    {
      "titleArabic": "تمثيل أعلام الخيارات",
      "code": `#include <bitset>\n#include <iostream>\n\nint main() {\n    // أعلام خيارات لعبة\n    enum Flags { Fullscreen = 0, VSync = 1, AntiAlias = 2, Debug = 3 };\n    std::bitset<4> options;\n\n    options.set(Fullscreen);\n    options.set(AntiAlias);\n\n    // فحص علم\n    if (options.test(VSync)) {\n        std::cout << \"VSync مفعّل\\n\";\n    } else {\n        std::cout << \"VSync معطّل\\n\";\n    }\n\n    // تبديل علم\n    options.flip(Debug);\n    std::cout << options << '\\n';  // 0101\n}`,
      "explanationArabic": "bitset مع enum يعطي أسماء واضحة للبتات. test() يفحص، flip() يبدّل. هذا أنظف من استخدام أعداد ثنائية يدوية (flags |= 1 << 2) لأنه يوفر فحص الحدود والأسماء الواضحة. الحجم ثابت — إن احتجت حجمًا ديناميكيًا استخدم vector<bool> (رغم مشاكله)."
    }
  ],

  "std::initializer_list": [
    {
      "titleArabic": "التهيئة بقائمة قيم",
      "code": `#include <initializer_list>\n#include <vector>\n#include <iostream>\n\nint main() {\n    // initializer_list يتيح التهيئة بـ {}\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    std::vector<int> v2{10, 20, 30};\n\n    for (int x : v) std::cout << x << ' ';\n    // المخرج: 1 2 3 4 5\n}`,
      "explanationArabic": "initializer_list<T> هو وكيل خفيف لصفيف ثوابت من نوع T. يُنشأ ضمنيًا عند استخدام {1, 2, 3}. الحاويات لها مُنشئ يأخذ initializer_list. لا يملك البيانات — يشير لمصفوفة مؤقتة. لا يمكن تعديل العناصر."
    },
    {
      "titleArabic": "كتابة دالة تقبل قائمة تهيئة",
      "code": `#include <initializer_list>\n#include <iostream>\n\nint sum(std::initializer_list<int> values) {\n    int total = 0;\n    for (int v : values) total += v;\n    return total;\n}\n\nint main() {\n    std::cout << sum({1, 2, 3, 4, 5}) << '\\n';  // 15\n    std::cout << sum({10, 20}) << '\\n';           // 30\n}`,
      "explanationArabic": "دالة تأخذ initializer_list يمكن استدعاؤها بـ {قيم}. begin()/end() يعملان للمرور. هذا أنظم من vector<int> كمعامل لأنه لا يُنشئ حاوية — مجرد وكيل للمصفوفة المؤقتة. انتبه: لا يمكنك استدعاء sum(v) حيث v هو vector — يجب sum({v.begin(), v.end()}) أو توفير حمل زائد."
    },
    {
      "titleArabic": "مُنشئ initializer_list في بنية مخصصة",
      "code": `#include <initializer_list>\n#include <vector>\n#include <iostream>\n\nstruct Polygon {\n    std::vector<std::pair<double, double>> points;\n\n    // مُنشئ يقبل قائمة تهيئة\n    Polygon(std::initializer_list<std::pair<double, double>> pts)\n        : points(pts) {}\n\n    void print() const {\n        for (const auto& [x, y] : points) {\n            std::cout << '(' << x << ',' << y << ") \";\n        }\n        std::cout << '\\n';\n    }\n};\n\nint main() {\n    Polygon tri = {{0, 0}, {1, 0}, {0.5, 0.866}};\n    tri.print();\n    // المخرج: (0,0) (1,0) (0.5,0.866)\n}`,
      "explanationArabic": "إضافة مُنشئ initializer_list يسمح بتهيئة البنية بـ {}. المُنشئ يتلقى initializer_list ويمرره للحاوية الداخلية. هذا يُعطي واجهة أنظف من push_back المتعدد. انتباه: initializer_list له أولوية عالية في حل التحميل الزائد — قد يتفوق على مُنشئات أخرى."
    }
  ],

  "std::reference_wrapper": [
    {
      "titleArabic": "تخزين مراجع في حاوية",
      "code": `#include <functional>\n#include <vector>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::string a = \"Atlas\";\n    std::string b = \"Guide\";\n    std::string c = \"C++\";\n\n    // لا يمكن تخزين مراجع مباشرة في vector\n    // vector<std::string&> — خطأ ترجمة\n\n    // reference_wrapper يسمح بذلك\n    std::vector<std::reference_wrapper<std::string>> refs;\n    refs.push_back(a);\n    refs.push_back(b);\n    refs.push_back(c);\n\n    for (auto& ref : refs) {\n        std::cout << ref.get() << ' ';  // get() يُرجع المرجع\n    }\n    // المخرج: Atlas Guide C++\n}`,
      "explanationArabic": "vector<T&> غير صالح لأن المراجع لا تُنسخ ولا تُعاد تعيينها. reference_wrapper<T> يحل ذلك: قابل للنسخ لكنه يشير للكائن الأصلي. get() يُرجع المرجع. التعديل عبر ref يُعدّل الأصل. std::ref وstd::cref يُنشئان reference_wrapper."
    },
    {
      "titleArabic": "تعديل الأصل عبر reference_wrapper",
      "code": `#include <functional>\n#include <vector>\n#include <iostream>\n\nint main() {\n    int x = 10, y = 20, z = 30;\n\n    std::vector<std::reference_wrapper<int>> refs = {x, y, z};\n\n    // التعديل عبر reference_wrapper يُعدّل الأصل\n    for (auto& ref : refs) {\n        ref.get() *= 2;\n    }\n\n    std::cout << x << ' ' << y << ' ' << z << '\\n';\n    // المخرج: 20 40 60 — الأصل تغيّر!\n}`,
      "explanationArabic": "reference_wrapper يحمل مرجعًا حقيقيًا. get() يُرجع T& لذلك التعديل يؤثر على الأصل. هذا يسمح بتطبيق خوارزميات على متغيرات متفرقة دون نسخها. التحذير: يجب أن تبقى المتغيرات الأصلية حية طوال عمر reference_wrapper."
    },
    {
      "titleArabic": "std::ref و std::cref",
      "code": `#include <functional>\n#include <iostream>\n\nvoid process(std::reference_wrapper<int> rw) {\n    rw.get() = 99;\n}\n\nint main() {\n    int value = 0;\n\n    // std::ref يُنشئ reference_wrapper قابل للتعديل\n    process(std::ref(value));\n    std::cout << value << '\\n';  // 99\n\n    // std::cref يُنشئ reference_wrapper للقراءة فقط\n    // process(std::cref(value));  // خطأ: const int& لا يمكن تعديلها\n\n    // الفرق: ref يُنشئ reference_wrapper<T>\n    //         cref يُنشئ reference_wrapper<const T>\n}`,
      "explanationArabic": "std::ref وstd::cref أدوات مساعدة لإنشاء reference_wrapper. ref يسمح التعديل، cref يمنعه. تُستخدم كثيرًا مع std::bind وstd::thread لتمرير مراجع بدل نسخ. مع thread، std::ref ضروري لأن thread ينسخ المعاملات افتراضيًا."
    }
  ]
};

// Add usageExamples to each item that doesn't have it
let added = 0;
let skipped = 0;

for (const [key, item] of Object.entries(data.referenceData)) {
  if (Array.isArray(item.usageExamples) && item.usageExamples.length > 0) {
    skipped++;
    continue;
  }
  if (!examples[key]) {
    console.error(`Missing examples for: ${key}`);
    continue;
  }
  item.usageExamples = examples[key];
  added++;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`Added: ${added}, Skipped: ${skipped}`);