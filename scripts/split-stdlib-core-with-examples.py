#!/usr/bin/env python3
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "data/ui/cpp/reference-standard-library-core.json")
OUT_DIR = os.path.join(BASE, "data/ui/cpp")
APP_TEXT = os.path.join(BASE, "data/ui/app-text.json")

CONTAINERS = [
    "std::vector", "std::string", "std::string_view", "std::array",
    "std::deque", "std::list", "std::forward_list",
    "std::map", "std::set", "std::multimap", "std::multiset",
    "std::unordered_map", "std::unordered_set",
    "std::queue", "std::stack", "std::priority_queue", "std::span",
]

SMART_POINTERS = [
    "std::unique_ptr", "std::shared_ptr", "std::weak_ptr",
    "std::enable_shared_from_this", "std::make_unique", "std::make_shared",
    "std::function", "std::move", "std::forward",
    "std::pair", "std::tuple", "std::optional", "std::variant",
    "std::any", "std::nullopt", "std::monostate",
    "std::initializer_list", "std::reference_wrapper", "std::bitset",
]

CONCURRENCY = [
    "std::atomic", "std::thread", "std::mutex", "std::recursive_mutex",
    "std::shared_mutex", "std::future", "std::promise",
    "std::condition_variable", "std::lock_guard", "std::unique_lock",
    "std::scoped_lock", "std::async", "std::once_flag",
]

IO_ALGO = [
    "std::exception", "std::runtime_error", "std::logic_error",
    "std::invalid_argument", "std::out_of_range", "std::bad_alloc",
    "std::system_error", "std::error_code", "std::error_condition",
    "std::cout", "std::cerr", "std::endl",
    "std::ifstream", "std::ofstream", "std::fstream", "std::stringstream",
    "std::sort", "std::memcpy",
    "std::filesystem::path", "std::chrono::duration",
    "std::chrono::time_point", "std::chrono::steady_clock",
    "std::less", "std::greater", "std::hash", "std::allocator",
    "std::numeric_limits", "std::type_info",
]

CATEGORY_MAP = {}
for k in CONTAINERS:
    CATEGORY_MAP[k] = "containers"
for k in SMART_POINTERS:
    CATEGORY_MAP[k] = "smart-pointers"
for k in CONCURRENCY:
    CATEGORY_MAP[k] = "concurrency"
for k in IO_ALGO:
    CATEGORY_MAP[k] = "io-algo"

CATEGORY_FILES = {
    "containers": "reference-stdlib-containers.json",
    "smart-pointers": "reference-stdlib-smart-pointers.json",
    "concurrency": "reference-stdlib-concurrency.json",
    "io-algo": "reference-stdlib-io-algo.json",
}

EXAMPLES = {
    "std::deque": [
        {
            "titleArabic": "إضافة من كلا الطرفين",
            "code": "#include <deque>\n#include <iostream>\n\nint main() {\n    std::deque<int> dq;\n    dq.push_back(10);\n    dq.push_front(5);\n    dq.push_back(20);\n    for (int x : dq) std::cout << x << \" \"; // 5 10 20\n}",
            "explanationArabic": "push_front تضيف في البداية وpush_back في النهاية. deque تدعم الوصول العشوائي مثل vector لكنها أبطأ قليلًا."
        },
        {
            "titleArabic": "الوصول العشوائي والحذف",
            "code": "#include <deque>\n#include <iostream>\n\nint main() {\n    std::deque<int> dq = {1, 2, 3, 4, 5};\n    std::cout << dq[0] << \" \" << dq.at(4); // 1 5\n    dq.pop_front();\n    dq.pop_back();\n    std::cout << dq.size(); // 3\n}",
            "explanationArabic": "operator[] سريع لكنه لا يتحقق من الحدود. at() آمن. pop_front وpop_back يحذفان من الطرفين."
        },
        {
            "titleArabic": "متى تستخدم deque بدل vector",
            "code": "#include <deque>\n#include <vector>\n\n// deque أفضل عند كثرة الإدراج في البداية\nstd::deque<int> dq;\nfor (int i = 0; i < 1000; ++i) dq.push_front(i); // سريع\n\n// vector: push_front غير موجود — يجب إزاحة كل العناصر\n// std::vector<int> v;\n// v.insert(v.begin(), i); // O(n) لكل إدراج!",
            "explanationArabic": "vector أفضل عند الوصول العشوائي الكثيف. deque أفضل عند الإدراج المتكرر في كلا الطرفين. std::queue تستخدم deque داخليًا."
        }
    ],
    "std::list": [
        {
            "titleArabic": "إدراج وحذف في الوسط",
            "code": "#include <list>\n#include <iostream>\n\nint main() {\n    std::list<int> lst = {10, 30, 50};\n    auto it = lst.begin();\n    ++it;\n    lst.insert(it, 20); // {10, 20, 30, 50}\n    lst.erase(it);       // {10, 20, 50}\n    for (int x : lst) std::cout << x << \" \";\n}",
            "explanationArabic": "insert وerase في أي موضع بـ O(1) لأن القائمة مرتبطة. لكن الوصول لعنصر بمؤشر N يتطلب المرور خطوة بخطوة."
        },
        {
            "titleArabic": "إزالة عناصر بالقيمة",
            "code": "#include <list>\n#include <iostream>\n\nint main() {\n    std::list<int> lst = {1, 2, 3, 2, 4};\n    lst.remove(2); // يُزيل كل الـ 2\n    for (int x : lst) std::cout << x << \" \"; // 1 3 4\n}",
            "explanationArabic": "remove يُزيل كل العناصر المساوية للقيمة المعطاة. يُرجع عدد العناصر المُزالة."
        },
        {
            "titleArabic": "لا يوجد وصول عشوائي",
            "code": "#include <list>\n\nstd::list<int> lst = {10, 20, 30};\n// lst[1]; // خطأ ترجمة: لا يوجد operator[]\n// lst.at(1); // خطأ ترجمة: لا يوجد at()\n\n// للوصول لعنصر معين يجب المرور بالمكررات\nauto it = lst.begin();\n++it; // يشير لـ 20\nint val = *it;",
            "explanationArabic": "list لا تدعم الوصول العشوائي لأن العناصر غير متجاورة في الذاكرة. إذا احتجت وصول عشوائي استخدم vector أو deque."
        }
    ],
    "std::forward_list": [
        {
            "titleArabic": "إضافة في البداية",
            "code": "#include <forward_list>\n#include <iostream>\n\nint main() {\n    std::forward_list<int> fl = {3, 4, 5};\n    fl.push_front(2);\n    fl.push_front(1);\n    for (int x : fl) std::cout << x << \" \"; // 1 2 3 4 5\n}",
            "explanationArabic": "push_front هي العملية الأسرع — O(1). لا يوجد push_back لأن القائمة أحادية الارتباط لا تملك مؤشرًا للنهاية."
        },
        {
            "titleArabic": "إدراج بعد عنصر",
            "code": "#include <forward_list>\n#include <iostream>\n\nint main() {\n    std::forward_list<int> fl = {1, 3, 4};\n    auto it = fl.begin();\n    ++it; // يشير لـ 3\n    fl.insert_after(it, 2); // {1, 3, 2, 4}\n    for (int x : fl) std::cout << x << \" \";\n}",
            "explanationArabic": "insert_after تُدرج بعد المكرر وليس قبله لأنه لا يوجد مؤشر للعنصر السابق. هذا الفرق الأساسي عن list."
        },
        {
            "titleArabic": "حذف بعد عنصر",
            "code": "#include <forward_list>\n\nstd::forward_list<int> fl = {1, 2, 3, 4};\nauto it = fl.begin();\n++it; // يشير لـ 2\nfl.erase_after(it); // يُزيل 3 — النتيجة {1, 2, 4}\n\n// لا يوجد erase(it) — فقط erase_after",
            "explanationArabic": "erase_after يحذف العنصر بعد المكرر. لا يمكن حذف العنصر الذي يشير إليه المكرر مباشرةً. هذا قيد بسبب الارتباط الأحادي."
        }
    ],
    "std::multimap": [
        {
            "titleArabic": "إدراج عدة قيم لنفس المفتاح",
            "code": "#include <map>\n#include <iostream>\n\nint main() {\n    std::multimap<std::string, int> scores;\n    scores.insert({\"Ali\", 90});\n    scores.insert({\"Ali\", 85});\n    scores.insert({\"Sara\", 95});\n    for (const auto& [name, score] : scores)\n        std::cout << name << \": \" << score << \"\\n\";\n}",
            "explanationArabic": "multimap تسمح بمفاتيح مكررة. insert لا يُعدّل القيمة الموجودة بل يُضيف عنصرًا جديدًا. العناصر مرتبة حسب المفتاح."
        },
        {
            "titleArabic": "البحث عن كل القيم لمفتاح",
            "code": "#include <map>\n#include <iostream>\n\nint main() {\n    std::multimap<std::string, int> mm;\n    mm.insert({\"x\", 1});\n    mm.insert({\"x\", 2});\n    mm.insert({\"x\", 3});\n    auto [lo, hi] = mm.equal_range(\"x\");\n    for (auto it = lo; it != hi; ++it)\n        std::cout << it->second << \" \"; // 1 2 3\n}",
            "explanationArabic": "equal_range يُرجع نطاقًا يحتوي كل العناصر بالمفتاح المحدد. هذا أنسب من find لأن find يُرجع العنصر الأول فقط."
        },
        {
            "titleArabic": "لا يوجد operator[]",
            "code": "#include <map>\n\nstd::multimap<std::string, int> mm;\n    mm.insert({\"key\", 1});\n    mm.insert({\"key\", 2});\n// mm[\"key\"] = 3; // خطأ ترجمة!\n// لا يوجد [] لأن المفتاح ليس فريدًا\n}",
            "explanationArabic": "operator[] غير موجود لأنه يفترض مفتاحًا فريدًا. استخدم insert للإضافة وfind أو equal_range للبحث."
        }
    ],
    "std::multiset": [
        {
            "titleArabic": "تخزين عناصر مكررة مرتبة",
            "code": "#include <set>\n#include <iostream>\n\nint main() {\n    std::multiset<int> ms = {3, 1, 2, 1, 3};\n    for (int x : ms) std::cout << x << \" \"; // 1 1 2 3 3\n}",
            "explanationArabic": "multiset تحفظ التكرار وترتب العناصر. كل عنصر يُحفظ بشكل مستقل حتى لو تساوت قيمته مع عنصر آخر."
        },
        {
            "titleArabic": "عد التكرارات والحذف",
            "code": "#include <set>\n#include <iostream>\n\nint main() {\n    std::multiset<int> ms = {1, 2, 2, 3, 2};\n    std::cout << ms.count(2); // 3\n    ms.erase(2); // يُزيل كل الـ 2\n    std::cout << ms.count(2); // 0\n}",
            "explanationArabic": "count يُرجع عدد التكرارات الفعلية (ليس 0 أو 1 كـ set). erase بالقيمة يُزيل كل التكرارات."
        },
        {
            "titleArabic": "حذف تكرار واحد فقط",
            "code": "#include <set>\n#include <iostream>\n\nint main() {\n    std::multiset<int> ms = {1, 2, 2, 3};\n    auto it = ms.find(2);\n    if (it != ms.end()) ms.erase(it); // يُزيل تكرارًا واحدًا فقط\n    for (int x : ms) std::cout << x << \" \"; // 1 2 3\n}",
            "explanationArabic": "erase بالمكرر يُزيل عنصرًا واحدًا فقط. هذا يختلف عن erase بالقيمة التي تُزيل كل التكرارات."
        }
    ],
    "std::unordered_set": [
        {
            "titleArabic": "عضوية سريعة بدون ترتيب",
            "code": "#include <unordered_set>\n#include <iostream>\n\nint main() {\n    std::unordered_set<std::string> visited;\n    visited.insert(\"node_a\");\n    visited.insert(\"node_b\");\n    if (visited.contains(\"node_a\"))\n        std::cout << \"موجود\";\n    std::cout << visited.size(); // 2\n}",
            "explanationArabic": "unordered_set توفر بحث O(1) متوسطًا. لا تحافظ على ترتيب العناصر. contains (C++20) أنظف من find."
        },
        {
            "titleArabic": "إزالة عناصر",
            "code": "#include <unordered_set>\n#include <iostream>\n\nint main() {\n    std::unordered_set<int> s = {1, 2, 3, 4, 5};\n    s.erase(3); // يُزيل 3\n    size_t n = s.erase(99); // n = 0 (غير موجود)\n    std::cout << s.size(); // 4\n}",
            "explanationArabic": "erase يُرجع عدد العناصر المُزالة (0 أو 1). لا توجد مشكلة في محاولة حذف عنصر غير موجود."
        },
        {
            "titleArabic": "لا تستخدمها إذا احتجت الترتيب",
            "code": "#include <unordered_set>\n#include <set>\n#include <iostream>\n\n// ❌ لا يوجد ترتيب مضمون\nstd::unordered_set<int> us = {3, 1, 2};\nfor (int x : us) std::cout << x << \" \"; // ترتيب غير مضمون\n\n// ✅ استخدم set للترتيب\nstd::set<int> s = {3, 1, 2};\nfor (int x : s) std::cout << x << \" \"; // 1 2 3 دائمًا",
            "explanationArabic": "unordered_set أسرع في البحث والإضافة لكنها لا تحافظ على ترتيب. إذا احتجت المرور بالترتيب أو lower_bound فاستخدم set."
        }
    ],
    "std::queue": [
        {
            "titleArabic": "طابور FIFO أساسي",
            "code": "#include <queue>\n#include <iostream>\n\nint main() {\n    std::queue<int> q;\n    q.push(10); q.push(20); q.push(30);\n    std::cout << q.front() << \" \"; // 10\n    std::cout << q.back() << \" \";  // 30\n    q.pop();\n    std::cout << q.front(); // 20\n}",
            "explanationArabic": "push تضيف في الخلف، pop تُزيل من الأمام. front تعطي العنصر التالي بدون إزالته. back تعطي آخر عنصر."
        },
        {
            "titleArabic": "معالجة مهام بالترتيب",
            "code": "#include <queue>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::queue<std::string> tasks;\n    tasks.push(\"تحميل\");\n    tasks.push(\"معالجة\");\n    tasks.push(\"عرض\");\n    while (!tasks.empty()) {\n        std::cout << tasks.front() << \"\\n\";\n        tasks.pop();\n    }\n}",
            "explanationArabic": "queue لا تدعم الوصول العشوائي ولا التكرار. pop لا تُرجع العنصر — استخدم front أولًا ثم pop."
        },
        {
            "titleArabic": "التحقق قبل pop",
            "code": "#include <queue>\n\nstd::queue<int> q;\n// q.front(); // UB إذا كانت فارغة!\n// q.pop();   // UB إذا كانت فارغة!\n\nif (!q.empty()) {\n    int val = q.front();\n    q.pop();\n}",
            "explanationArabic": "استدعاء front أو pop على طابور فارغ سلوك غير معرّف. تحقق دائمًا بـ empty قبل الوصول."
        }
    ],
    "std::stack": [
        {
            "titleArabic": "مكدس LIFO أساسي",
            "code": "#include <stack>\n#include <iostream>\n\nint main() {\n    std::stack<int> s;\n    s.push(10); s.push(20); s.push(30);\n    std::cout << s.top() << \" \"; // 30\n    s.pop();\n    std::cout << s.top(); // 20\n}",
            "explanationArabic": "push تضيف في القمة، pop تُزيل من القمة. top تعطي العنصر العلوي بدون إزالته. الآخر يدخل أولًا يخرج."
        },
        {
            "titleArabic": "عكس سلسلة",
            "code": "#include <stack>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::string str = \"hello\";\n    std::stack<char> s;\n    for (char c : str) s.push(c);\n    while (!s.empty()) {\n        std::cout << s.top();\n        s.pop();\n    } // olleh\n}",
            "explanationArabic": "push كل حرف ثم pop يُرجعها بترتيب عكسي. هذا نمط شائع لقلب الترتيب."
        },
        {
            "titleArabic": "التحقق قبل top وpop",
            "code": "#include <stack>\n\nstd::stack<int> s;\n// s.top(); // UB إذا كانت فارغة!\n// s.pop(); // UB إذا كانت فارغة!\n\nif (!s.empty()) {\n    int val = s.top();\n    s.pop();\n}",
            "explanationArabic": "استدعاء top أو pop على مكدس فارغ سلوك غير معرّف. تحقق دائمًا بـ empty."
        }
    ],
    "std::weak_ptr": [
        {
            "titleArabic": "مراقبة كائن بدون إطالة عمره",
            "code": "#include <memory>\n#include <iostream>\n\nint main() {\n    auto sp = std::make_shared<int>(42);\n    std::weak_ptr<int> wp = sp;\n    std::cout << wp.use_count(); // 1 — weak_ptr لا يزيد العداد\n    if (auto locked = wp.lock()) {\n        std::cout << *locked; // 42\n    }\n    sp.reset();\n    std::cout << wp.expired(); // true\n}",
            "explanationArabic": "weak_ptr لا يزيد العداد المرجعي. lock تُنشئ shared_ptr مؤقت إذا كان الكائن حيًا أو nullptr إذا أُلغي. expired تتحقق بدون إنشاء shared_ptr."
        },
        {
            "titleArabic": "كسر حلقة مرجعية",
            "code": "#include <memory>\n#include <iostream>\n\nstruct Node {\n    std::string name;\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev;\n};\n\nauto a = std::make_shared<Node>();\na->name = \"A\";\nauto b = std::make_shared<Node>();\nb->name = \"B\";\na->next = b;\nb->prev = a;\nstd::cout << b->prev.lock()->name; // A\n}",
            "explanationArabic": "prev هو weak_ptr فلا يزيد العداد. عند تدمير a وb يُحرر الكائنان بشكل صحيح. لو كان prev هو shared_ptr لحصل تسرب ذاكرة."
        },
        {
            "titleArabic": "lock يُرجع nullptr إذا انتهى الكائن",
            "code": "#include <memory>\n\nstd::weak_ptr<int> wp;\n{\n    auto sp = std::make_shared<int>(10);\n    wp = sp;\n} // sp يُدمَّر هنا\n\nauto locked = wp.lock();\nif (!locked) {\n    // الكائن لم يعد موجودًا\n}",
            "explanationArabic": "بعد تدمير آخر shared_ptr، lock يُرجع shared_ptr فارغ (nullptr). لا تستخدم wp.lock() بدون التحقق من النتيجة."
        }
    ],
    "std::enable_shared_from_this": [
        {
            "titleArabic": "إرجاع shared_ptr من داخل الكائن",
            "code": "#include <memory>\n#include <iostream>\n\nstruct Node : public std::enable_shared_from_this<Node> {\n    std::shared_ptr<Node> get_self() {\n        return shared_from_this();\n    }\n};\n\nint main() {\n    auto n = std::make_shared<Node>();\n    auto self = n->get_self();\n    std::cout << n.use_count(); // 2\n}",
            "explanationArabic": "shared_from_this يُرجع shared_ptr يشير لنفس الكائن ويزيد العداد. يجب أن يكون الكائن مملوكًا بـ shared_ptr أولًا."
        },
        {
            "titleArabic": "تمرير this لدالة تحتاج shared_ptr",
            "code": "#include <memory>\n\nvoid process(std::shared_ptr<struct Node> node);\n\nstruct Node : public std::enable_shared_from_this<Node> {\n    void register_self() {\n        process(shared_from_this()); // آمن\n    }\n};",
            "explanationArabic": "تمرير this مباشرة يُنشئ shared_ptr منفصل يُسبب حذفًا مزدوجًا. shared_from_this آمن لأنه يُشارك نفس control block."
        },
        {
            "titleArabic": "لا تستخدمه مع unique_ptr",
            "code": "#include <memory>\n\nstruct Bad : public std::enable_shared_from_this<Bad> {};\n\n// auto b = std::make_unique<Bad>();\n// b->shared_from_this(); // يرمي bad_weak_ptr!\n\n// يجب أن يكون الكائن مملوكًا بـ shared_ptr\nauto good = std::make_shared<Bad>();\ngood->shared_from_this(); // يعمل",
            "explanationArabic": "shared_from_this يحتاج control block من shared_ptr. مع unique_ptr لا يوجد control block فيُرمي استثناء. لا تورث enable_shared_from_this إلا إذا كنت ستستخدم shared_ptr."
        }
    ],
    "std::make_unique": [
        {
            "titleArabic": "إنشاء unique_ptr لعدة أنواع",
            "code": "#include <memory>\n#include <string>\n#include <iostream>\n\nint main() {\n    auto p1 = std::make_unique<int>(42);\n    auto p2 = std::make_unique<std::string>(5, 'x');\n    std::cout << *p1 << \" \" << *p2; // 42 xxxxx\n}",
            "explanationArabic": "make_unique تُمرر الحجج لمُنشئ النوع. أنظف من new لأنها تمنع تسرب الذاكرة عند الاستثناءات."
        },
        {
            "titleArabic": "إنشاء مصفوفة ديناميكية",
            "code": "#include <memory>\n#include <iostream>\n\nint main() {\n    auto arr = std::make_unique<int[]>(10);\n    for (int i = 0; i < 10; ++i) arr[i] = i * i;\n    std::cout << arr[4]; // 16\n}",
            "explanationArabic": "make_unique<int[]>(n) تُنشئ مصفوفة بحجم n. الوصول بـ operator[] كالمصفوفة العادية. تُحرر تلقائيًا عند نهاية العمر."
        },
        {
            "titleArabic": "لماذا make_unique أفضل من new",
            "code": "#include <memory>\n\n// ❌ قد يسبب تسربًا عند الاستثناء\n// void bad() {\n//     auto p = new int(42);\n//     throw std::runtime_error(\"oops\"); // تسرب!\n//     delete p; // لن يُنفَّذ\n// }\n\n// ✅ make_unique آمن مع الاستثناءات\nvoid good() {\n    auto p = std::make_unique<int>(42);\n    throw std::runtime_error(\"oops\"); // لا تسرب — unique_ptr يُحرر\n}",
            "explanationArabic": "مع new، أي استثناء قبل delete يُسبب تسربًا. make_unique يُحرر تلقائيًا حتى مع الاستثناءات بفضل RAII."
        }
    ],
    "std::recursive_mutex": [
        {
            "titleArabic": "قفل متداخل من نفس الخيط",
            "code": "#include <mutex>\n\nstd::recursive_mutex rm;\n\nvoid inner() {\n    std::lock_guard<std::recursive_mutex> lock(rm);\n    // يمكن أخذ القفل مرة أخرى لأن نفس الخيط يملكه\n}\n\nvoid outer() {\n    std::lock_guard<std::recursive_mutex> lock(rm);\n    inner(); // لا deadlock — recursive_mutex يسمح بذلك\n}",
            "explanationArabic": "recursive_mutex يسمح لنفس الخيط بأخذ القفل عدة مرات. يجب أن يُحرر بنفس عدد المرات."
        },
        {
            "titleArabic": "عدد مرات القفل",
            "code": "#include <mutex>\n#include <iostream>\n\nint main() {\n    std::recursive_mutex rm;\n    rm.lock();\n    rm.lock();\n    std::cout << \"locked twice\";\n    rm.unlock();\n    rm.unlock(); // يجب تحرير مرتين\n}",
            "explanationArabic": "كل lock يحتاج unlock مقابلًا. مع lock_guard أو scoped_lock يتم هذا تلقائيًا."
        },
        {
            "titleArabic": "تجنب استخدامه إن أمكن",
            "code": "#include <mutex>\n\n// ❌ recursive_mutex أبطأ من mutex العادي\n// استخدمه فقط إذا كانت الدوال تتداخل فعلًا\n\n// ✅ الأفضل: أعد تصميم الكود لتفادي التداخل\nstd::mutex m;\nvoid inner(int& data) { data += 10; }\nvoid outer() {\n    int local = 0;\n    inner(local); // لا يحتاج قفل — local ليس مشتركًا\n    std::lock_guard<std::mutex> lock(m);\n    // استخدم local هنا\n}",
            "explanationArabic": "recursive_mutex أبطأ من mutex العادي بسبب تتبع عدد مرات القفل. إذا استطعت تفادي التداخل بتصميم أفضل فافعل."
        }
    ],
    "std::lock_guard": [
        {
            "titleArabic": "حماية قسم حرج بسيط",
            "code": "#include <mutex>\n#include <iostream>\n\nstd::mutex m;\nint counter = 0;\n\nvoid safe_inc() {\n    std::lock_guard<std::mutex> lock(m);\n    ++counter;\n} // القفل يُحرر تلقائيًا هنا",
            "explanationArabic": "lock_guard يأخذ القفل عند بنائه ويحرره عند تدميره. لا تحتاج unlock يدوي أبدًا."
        },
        {
            "titleArabic": "آمن مع الاستثناءات",
            "code": "#include <mutex>\n\nstd::mutex m;\nvoid may_throw() {\n    std::lock_guard<std::mutex> lock(m);\n    throw std::runtime_error(\"error\");\n    // القفل مضمون الإفلات حتى مع throw\n}",
            "explanationArabic": "lock_guard يضمن تحرير القفل حتى عند رمي استثناء. هذا الفرق الأساسي عن lock/unlock اليدوي."
        },
        {
            "titleArabic": "لا يمكن تحريره مبكرًا",
            "code": "#include <mutex>\n\nstd::mutex m;\nvoid fn() {\n    std::lock_guard<std::mutex> lock(m);\n    // لا يمكن lock.unlock() مبكرًا\n    // القفل يبقى حتى نهاية النطاق\n    // إذا احتجت تحرير مبكر: استخدم unique_lock بدلًا من ذلك\n}",
            "explanationArabic": "lock_guard لا يدعم unlock مبكر. إذا احتجت تحرير القفل قبل نهاية النطاق استخدم unique_lock."
        }
    ],
    "std::unique_lock": [
        {
            "titleArabic": "تحرير القفل مبكرًا",
            "code": "#include <mutex>\n#include <iostream>\n\nstd::mutex m;\nvoid fn() {\n    std::unique_lock<std::mutex> lock(m);\n    // قسم حرج\n    lock.unlock(); // تحرير مبكر\n    // عمل بدون قفل\n    lock.lock(); // إعادة القفل\n}",
            "explanationArabic": "unique_lock يسمح بتحرير وإعادة القفل يدويًا. مفيد لتقليل مدة القفل."
        },
        {
            "titleArabic": "استخدامه مع condition_variable",
            "code": "#include <mutex>\n#include <condition_variable>\n\nstd::mutex m;\nstd::condition_variable cv;\nbool ready = false;\n\nvoid wait_fn() {\n    std::unique_lock<std::mutex> lock(m);\n    cv.wait(lock, [] { return ready; });\n    // lock يُحرر أثناء الانتظار ويُعاود أخذه عند الإيقاظ\n}",
            "explanationArabic": "condition_variable::wait يحتاج unique_lock لأنه يُحرر القفل داخليًا أثناء الانتظار. lock_guard لا يدعم هذا."
        },
        {
            "titleArabic": "تأخير أخذ القفل",
            "code": "#include <mutex>\n\nstd::mutex m;\nvoid fn() {\n    std::unique_lock<std::mutex> lock(m, std::defer_lock);\n    // القفل غير مأخوذ بعد\n    lock.lock(); // أخذ القفل لاحقًا\n}",
            "explanationArabic": "defer_lock يبني unique_lock بدون أخذ القفل. مفيد عندما تريد التحكم في توقيت القفل."
        }
    ],
    "std::scoped_lock": [
        {
            "titleArabic": "قفل عدة mutexes بأمان",
            "code": "#include <mutex>\n\nstd::mutex m1, m2;\n\nvoid transfer() {\n    std::scoped_lock lock(m1, m2);\n    // كلا القفلين مأخوذان بأمان بدون deadlock\n}",
            "explanationArabic": "scoped_lock يقفل عدة mutexes دفعة واحدة باستخدام خوارزمية تتجنب deadlock. أنظف من lock() المنفصل."
        },
        {
            "titleArabic": "مقارنة مع lock_guard",
            "code": "#include <mutex>\n\nstd::mutex m;\n\n// scoped_lock مع mutex واحد يعمل كـ lock_guard\nstd::scoped_lock lock(m); // يقفل m\n// عند نهاية النطاق يُحرر تلقائيًا",
            "explanationArabic": "scoped_lock مع mutex واحد يعادل lock_guard تمامًا. مع عدة mutexes يضيف تجنب deadlock."
        },
        {
            "titleArabic": "تجنب deadlock عند تبادل البيانات",
            "code": "#include <mutex>\n\nstd::mutex mtx_a, mtx_b;\nint data_a = 0, data_b = 0;\n\nvoid swap_safely() {\n    // ❌ بدون scoped_lock: ترتيب القفل الخاطئ يُسبب deadlock\n    // std::lock_guard<std::mutex> l1(mtx_a);\n    // std::lock_guard<std::mutex> l2(mtx_b);\n\n    // ✅ scoped_lock يُحدد الترتيب تلقائيًا\n    std::scoped_lock lock(mtx_a, mtx_b);\n    int tmp = data_a;\n    data_a = data_b;\n    data_b = tmp;\n}",
            "explanationArabic": "إذا أخذ خيط m1 ثم m2 وأخذ خيط آخر m2 ثم m1 يحصل deadlock. scoped_lock يستخدم خوارزمية deadlock-avoidance تُحدد ترتيبًا آمنًا."
        }
    ],
    "std::async": [
        {
            "titleArabic": "تشغيل مهمة غير متزامنة",
            "code": "#include <future>\n#include <iostream>\n\nint compute(int x) { return x * x; }\n\nint main() {\n    auto f = std::async(std::launch::async, compute, 5);\n    std::cout << \"جاري...\\n\";\n    std::cout << f.get(); // 25\n}",
            "explanationArabic": "async مع launch::async يُشغّل الدالة في خيط فعلي. get() يحجب حتى النتيجة."
        },
        {
            "titleArabic": "launch::async مقابل التأجيل",
            "code": "#include <future>\n\n// launch::async: يُشغّل في خيط فورًا\nauto f1 = std::async(std::launch::async, [] { return 1; });\n\n// بدون تحديد: قد يُؤجَّل حتى get()\nauto f2 = std::async([] { return 2; });\n\n// launch::deferred: يُشغّل عند get() فقط\nauto f3 = std::async(std::launch::deferred, [] { return 3; });",
            "explanationArabic": "بدون تحديد السياسة، المُصرِّف يختار. استخدم launch::async دائمًا إذا أردت توازيًا فعليًا."
        },
        {
            "titleArabic": "عدة مهام متوازية",
            "code": "#include <future>\n#include <iostream>\n\nint main() {\n    auto f1 = std::async(std::launch::async, [] { int s=0; for(int i=0;i<100;++i)s+=i; return s; });\n    auto f2 = std::async(std::launch::async, [] { int s=0; for(int i=100;i<200;++i)s+=i; return s; });\n    std::cout << f1.get() + f2.get(); // 19800\n}",
            "explanationArabic": "كل async يُشغّل في خيط منفصل. get يحجب حتى النتيجة. المهام تعمل بالتوازي."
        }
    ],
    "std::once_flag": [
        {
            "titleArabic": "تهيئة مرة واحدة فقط",
            "code": "#include <mutex>\n#include <iostream>\n\nstd::once_flag flag;\n\nvoid init() { std::cout << \"تهيئة\\n\"; }\n\nvoid use() {\n    std::call_once(flag, init);\n    // init تُستدعى مرة واحدة فقط مهما تكرر use()\n}",
            "explanationArabic": "call_once يضمن تنفيذ الدالة مرة واحدة حتى مع خيوط متعددة. أنظف من static داخل دالة في بعض الحالات."
        },
        {
            "titleArabic": "تهيئة آمنة مع خيوط متعددة",
            "code": "#include <mutex>\n#include <thread>\n#include <iostream>\n\nstd::once_flag flag;\nvoid worker(int id) {\n    std::call_once(flag, [] { std::cout << \"init\\n\"; });\n    std::cout << id << \" جاهز\\n\";\n}\n\nint main() {\n    std::thread t1(worker, 1);\n    std::thread t2(worker, 2);\n    t1.join(); t2.join();\n}",
            "explanationArabic": "حتى لو بدأ خيطان call_once في نفس اللحظة، init تُنفَّذ مرة واحدة. الخيوط الأخرى تنتظر ثم تتابع."
        },
        {
            "titleArabic": "لا تنسَ أن once_flag يجب أن يكون مشتركًا",
            "code": "#include <mutex>\n\n// ❌ خطأ: flag محلي — كل استدعاء يُنشئ واحدًا جديدًا\n// void bad() {\n//     std::once_flag flag;\n//     std::call_once(flag, init); // لا فائدة — flag جديدة كل مرة\n// }\n\n// ✅ صحيح: flag عام أو static\nstd::once_flag flag;\nvoid good() {\n    std::call_once(flag, init);\n}",
            "explanationArabic": "once_flag يجب أن يكون مشتركًا بين كل الاستدعاءات. إذا كان محليًا فكل استدعاء يحصل على flag جديد."
        }
    ],
    "std::exception": [
        {
            "titleArabic": "التقاط كل الاستثناءات",
            "code": "#include <exception>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::runtime_error(\"خطأ\");\n    } catch (const std::exception& e) {\n        std::cout << e.what();\n    }\n}",
            "explanationArabic": "std::exception هي الفئة الأساسية لكل الاستثناءات القياسية. التقاطها بمرجع يلتقط كل الأنواع المشتقة."
        },
        {
            "titleArabic": "what() للرسالة التوضيحية",
            "code": "#include <exception>\n#include <iostream>\n\ntry {\n    throw std::exception();\n} catch (const std::exception& e) {\n    std::cout << e.what(); // رسالة تنفيذية\n}",
            "explanationArabic": "what() يُرجع const char* بوصف الخطأ. كل فئة مشتقة تُقدّم رسالتها الخاصة."
        },
        {
            "titleArabic": "الترتيب في catch مهم",
            "code": "#include <exception>\n#include <stdexcept>\n#include <iostream>\n\ntry {\n    throw std::runtime_error(\"خطأ تشغيل\");\n} catch (const std::runtime_error& e) {\n    std::cout << \"runtime: \" << e.what(); // يُلتقط هنا\n} catch (const std::exception& e) {\n    // لن يصل هنا لأن runtime_error التُقط أعلاه\n}",
            "explanationArabic": "ضع الأنواع الأخص أولًا. لو وضعت std::exception أولًا ستلتقط كل شيء ولن تصل للأنواع المشتقة."
        }
    ],
    "std::logic_error": [
        {
            "titleArabic": "رمي عند انتهاك شرط مسبق",
            "code": "#include <stdexcept>\n#include <iostream>\n\nint factorial(int n) {\n    if (n < 0) throw std::logic_error(\"عدد سالب غير مقبول\");\n    int r = 1;\n    for (int i = 2; i <= n; ++i) r *= i;\n    return r;\n}\n\nint main() {\n    try { factorial(-1); }\n    catch (const std::logic_error& e) { std::cout << e.what(); }\n}",
            "explanationArabic": "logic_error يُرمى عند خطأ يمكن اكتشافه قبل التشغيل مثل معامل غير صالح أو شرط مسبق مُخالف."
        },
        {
            "titleArabic": "يرث من std::exception",
            "code": "#include <stdexcept>\n#include <iostream>\n\ntry {\n    throw std::logic_error(\"bug\");\n} catch (const std::exception& e) {\n    std::cout << e.what(); // يُلتقط كـ exception\n}",
            "explanationArabic": "logic_error يرث من exception. يمكن التقاطه بالنوع الأعم."
        },
        {
            "titleArabic": "لا تستخدمه لأخطاء التشغيل",
            "code": "#include <stdexcept>\n\n// ❌ خطأ: فشل فتح ملف ليس logic_error\n// throw std::logic_error(\"الملف غير موجود\");\n\n// ✅ استخدم runtime_error لأخطاء التشغيل\nthrow std::runtime_error(\"الملف غير موجود\");\n\n// ✅ استخدم logic_error فقط للأخطاء المنطقية\nthrow std::logic_error(\"المعامل لا يمكن أن يكون سالبًا\");",
            "explanationArabic": "logic_error لأخطاء يمكن منعها بالتصميم. runtime_error لأخطاء تعتمد على ظروف التشغيل."
        }
    ],
    "std::invalid_argument": [
        {
            "titleArabic": "رمي عند معامل غير صالح",
            "code": "#include <stdexcept>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::invalid_argument(\"العمر لا يمكن أن يكون سالبًا\");\n    } catch (const std::invalid_argument& e) {\n        std::cout << e.what();\n    }\n}",
            "explanationArabic": "invalid_argument يرث من logic_error. يُرمى عند تمرير قيمة غير مقبولة كمعامل."
        },
        {
            "titleArabic": "التحقق من المدخلات",
            "code": "#include <stdexcept>\n#include <string>\n\nvoid set_age(int age) {\n    if (age < 0 || age > 150)\n        throw std::invalid_argument(\"عمر غير صالح\");\n}",
            "explanationArabic": "استخدم invalid_argument عند فشل التحقق من صحة المدخلات في بداية الدالة."
        },
        {
            "titleArabic": "stoi ترميه عند نص غير رقمي",
            "code": "#include <stdexcept>\n#include <string>\n#include <iostream>\n\nint main() {\n    try {\n        int n = std::stoi(\"abc\");\n    } catch (const std::invalid_argument& e) {\n        std::cout << e.what();\n    }\n}",
            "explanationArabic": "stoi وstof ترميان invalid_argument عند نص غير رقمي. التقطه إذا كنت تتعامل مع مدخلات غير موثوقة."
        }
    ],
    "std::out_of_range": [
        {
            "titleArabic": "at() يرميه عند فهرس خارج الحدود",
            "code": "#include <stdexcept>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n    try {\n        v.at(10);\n    } catch (const std::out_of_range& e) {\n        std::cout << e.what();\n    }\n}",
            "explanationArabic": "at() يتحقق من الفهرس ويرمي out_of_range عند تجاوزه. operator[] لا يتحقق."
        },
        {
            "titleArabic": "التحقق يدويًا بدل try/catch",
            "code": "#include <vector>\n\nstd::vector<int> v = {1, 2, 3};\nsize_t idx = 5;\n\n// ✅ أفضل أداءً: تحقق قبل الوصول\nif (idx < v.size()) {\n    int val = v[idx];\n}",
            "explanationArabic": "التحقق المسبق أنسب أداءً من try/catch. استخدم at() فقط عندما يكون تجاوز الحدود حالة طبيعية متوقعة."
        },
        {
            "titleArabic": "يرث من logic_error",
            "code": "#include <stdexcept>\n#include <iostream>\n\ntry {\n    throw std::out_of_range(\"فهرس خارج النطاق\");\n} catch (const std::logic_error& e) {\n    std::cout << e.what(); // يُلتقط كـ logic_error\n}",
            "explanationArabic": "out_of_range يرث من logic_error. يمكن التقاطه بالنوع الأعم أو الأخص."
        }
    ],
    "std::bad_alloc": [
        {
            "titleArabic": "فشل تخصيص ذاكرة",
            "code": "#include <new>\n#include <iostream>\n\nint main() {\n    try {\n        auto huge = new int[1000000000000];\n    } catch (const std::bad_alloc& e) {\n        std::cout << \"فشل تخصيص: \" << e.what();\n    }\n}",
            "explanationArabic": "bad_alloc يُرمى عند فشل new أو عند إنشاء حاوية أكبر من الذاكرة المتاحة."
        },
        {
            "titleArabic": "مع vector كبير",
            "code": "#include <vector>\n#include <new>\n#include <iostream>\n\nint main() {\n    try {\n        std::vector<int> v(1000000000000);\n    } catch (const std::bad_alloc&) {\n        std::cout << \"الذاكرة غير كافية\";\n    }\n}",
            "explanationArabic": "حاويات STL تستخدم new داخليًا. عند فشل التخصيص تُرمي bad_alloc."
        },
        {
            "titleArabic": "nothrow new كبديل",
            "code": "#include <new>\n\nint* p = new(std::nothrow) int[1000000000000];\nif (!p) {\n    // فشل التخصيص — لا استثناء\n}",
            "explanationArabic": "nothrow new يُرجع nullptr بدل رمي استثناء. مفيد في الأنظمة المضمّنة حيث لا تريد استثناءات."
        }
    ],
    "std::system_error": [
        {
            "titleArabic": "رمي مع error_code",
            "code": "#include <system_error>\n#include <iostream>\n\nint main() {\n    try {\n        throw std::system_error(\n            std::make_error_code(std::errc::no_such_file_or_directory),\n            \"الملف غير موجود\");\n    } catch (const std::system_error& e) {\n        std::cout << e.what() << \" code: \" << e.code().value();\n    }\n}",
            "explanationArabic": "system_error يحمل error_code ورسالة. code() يُرجع الرمز الرقمي. what() يُرجع رسالة تفصيلية."
        },
        {
            "titleArabic": "الملفات والمواضيع ترميه",
            "code": "#include <system_error>\n#include <iostream>\n#include <thread>\n\nint main() {\n    try {\n        std::thread().join(); // join على خيط غير صالح\n    } catch (const std::system_error& e) {\n        std::cout << e.what();\n    }\n}",
            "explanationArabic": "العديد من عمليات النظام مثل الملفات والخيوط ترمي system_error عند الفشل."
        },
        {
            "titleArabic": "يرث من runtime_error",
            "code": "#include <system_error>\n#include <iostream>\n\ntry {\n    throw std::system_error(\n        std::make_error_code(std::errc::permission_denied), \"access\");\n} catch (const std::runtime_error& e) {\n    std::cout << e.what(); // يُلتقط كـ runtime_error\n}",
            "explanationArabic": "system_error يرث من runtime_error. يمكن التقاطه بالنوع الأعم."
        }
    ],
    "std::error_code": [
        {
            "titleArabic": "بديل عن الاستثناءات",
            "code": "#include <system_error>\n#include <iostream>\n\nint main() {\n    std::error_code ec;\n    // ec يُملأ تلقائيًا عند الفشل\n    if (ec) {\n        std::cout << ec.message() << \" value: \" << ec.value();\n    }\n}",
            "explanationArabic": "error_code خفيف الوزن — لا يُخصّص ذاكرة. يتحول إلى bool: true إذا كان هناك خطأ."
        },
        {
            "titleArabic": "مقارنة مع شروط خطأ عامة",
            "code": "#include <system_error>\n#include <iostream>\n\nstd::error_code ec = std::make_error_code(std::errc::no_such_file_or_directory);\nif (ec == std::errc::no_such_file_or_directory) {\n    std::cout << \"الملف غير موجود\";\n}",
            "explanationArabic": "std::errc يوفر شروط خطأ عامة محمولة. المقارنة معها أنظف من فحص القيمة الرقمية."
        },
        {
            "titleArabic": "مع filesystem",
            "code": "#include <filesystem>\n#include <system_error>\n#include <iostream>\nnamespace fs = std::filesystem;\n\nint main() {\n    std::error_code ec;\n    fs::copy(\"missing.txt\", \"dest.txt\", ec);\n    if (ec) {\n        std::cout << ec.message();\n    }\n}",
            "explanationArabic": "filesystem توفر حمولات تأخذ error_code بدل رمي استثناءات. هذا أنسب للأكواد التي تتعامل مع أخطاء متوقعة."
        }
    ],
    "std::error_condition": [
        {
            "titleArabic": "مقارنة عبر فئات مختلفة",
            "code": "#include <system_error>\n#include <iostream>\n\nstd::error_code ec = std::make_error_code(std::errc::no_such_file_or_directory);\nstd::error_condition cond = std::errc::no_such_file_or_directory;\nif (ec == cond) {\n    std::cout << \"نفس الخطأ\";\n}",
            "explanationArabic": "error_condition تمثيل عالي المستوى. يمكن مقارنته مع error_code من فئات مختلفة."
        },
        {
            "titleArabic": "الفرق عن error_code",
            "code": "#include <system_error>\n\n// error_code: رمز محدد لمنصة معينة\nstd::error_code ec(2, std::system_category());\n\n// error_condition: تمثيل عام محمول\nstd::error_condition cond = std::errc::no_such_file_or_directory;\n\nbool match = ec == cond; // المقارنة تعمل عبر الفئات",
            "explanationArabic": "error_code مرتبط بمنصة معينة. error_condition عام ومحمول. المقارنة بينهما تعمل عبر الفئات."
        },
        {
            "titleArabic": "استخدامه في معالجة الأخطاء",
            "code": "#include <system_error>\n#include <iostream>\n\nvoid handle(std::error_code ec) {\n    if (ec == std::errc::permission_denied) {\n        std::cout << \"صلاحية مرفوضة\";\n    } else if (ec == std::errc::no_such_file_or_directory) {\n        std::cout << \"ملف غير موجود\";\n    } else {\n        std::cout << \"خطأ: \" << ec.message();\n    }\n}",
            "explanationArabic": "error_condition مع errc يوفر شروطًا عامة محمولة. هذا أنظف من فحص أرقام خطأ نظام تشغيل معينة."
        }
    ],
    "std::cout": [
        {
            "titleArabic": "طباعة نص وأرقام",
            "code": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello\" << \" \" << 42 << \"\\n\";\n}",
            "explanationArabic": "operator<< يُرسل البيانات لتدفق الإخراج. يمكن سلسلة عدة عمليات << معًا."
        },
        {
            "titleArabic": "استخدام '\\n' بدل endl",
            "code": "#include <iostream>\n\nint main() {\n    for (int i = 0; i < 100; ++i) {\n        std::cout << i << \"\\n\"; // أسرع من endl\n    }\n}",
            "explanationArabic": "'\\n' أسرع من endl لأن endl يجبر التفريغ. استخدم endl فقط عندما تحتاج التفريغ الفوري."
        },
        {
            "titleArabic": "boolalpha لطباعة true/false",
            "code": "#include <iostream>\n\nint main() {\n    std::cout << true << \"\\n\"; // 1\n    std::cout << std::boolalpha << true << \"\\n\"; // true\n}",
            "explanationArabic": "بدون boolalpha تطبع 0 أو 1. معه تطبع true أو false كنص."
        }
    ],
    "std::cerr": [
        {
            "titleArabic": "طباعة رسائل خطأ",
            "code": "#include <iostream>\n\nint main() {\n    std::cerr << \"خطأ: فشل التحميل\\n\";\n}",
            "explanationArabic": "cerr يكتب مباشرة بدون تخزين مؤقت. مناسب لرسائل الخطأ التي يجب أن تظهر فورًا."
        },
        {
            "titleArabic": "الفرق عن cout",
            "code": "#include <iostream>\n\nstd::cout << \"معلومة\"; // قد تُخزّن مؤقتًا\nstd::cerr << \"خطأ\";   // تُكتب فورًا",
            "explanationArabic": "cout يُخزّن مؤقتًا للكفاءة. cerr يكتب فورًا لضمان ظهور رسائل الخطأ."
        },
        {
            "titleArabic": "إعادة توجيه stderr في سطر الأوامر",
            "code": "// في سطر الأوامر:\n// ./app 2>errors.txt  // stderr يذهب للملف\n// ./app 2>&1         // stderr يذهب لنفس مكان stdout",
            "explanationArabic": "stderr (cerr) يمكن توجيهه بشكل مستقل عن stdout (cout) في سطر الأوامر. مفيد لفصل السجلات عن الأخطاء."
        }
    ],
    "std::endl": [
        {
            "titleArabic": "سطر جديد مع تفريغ",
            "code": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello\" << std::endl;\n    std::cout << \"World\" << std::endl;\n}",
            "explanationArabic": "endl يضيف '\\n' ويجبر التفريغ. هذا يضمن ظهور النص فورًا على الطرفية."
        },
        {
            "titleArabic": "أبطأ من '\\n'",
            "code": "#include <iostream>\n\n// ❌ بطيء في الحلقات الكبيرة\n// for (int i = 0; i < 100000; ++i)\n//     std::cout << i << std::endl;\n\n// ✅ أسرع: استخدم '\\n'\nfor (int i = 0; i < 100000; ++i)\n    std::cout << i << \"\\n\";",
            "explanationArabic": "endl يجبر التفريغ في كل مرة. في الحلقات الكبيرة هذا يُبطئ البرنامج بشكل ملحوظ."
        },
        {
            "titleArabic": "متى تستخدم endl فعليًا",
            "code": "#include <iostream>\n\n// استخدم endl عند الحاجة لتفريغ فوري:\n// 1. سكريبت تفاعلي ينتظر إدخال المستخدم\n// 2. رسالة خطأ حرجة يجب ظهورها فورًا\n// 3. تصحيح أخطاء أثناء التطوير\n\nstd::cout << \"أدخل اسمك: \" << std::flush; // flush بدون سطر جديد\n// أو\nstd::cout << \"جاري المعالجة...\" << std::endl;",
            "explanationArabic": "flush يجبر التفريغ بدون سطر جديد. endl = '\\n' + flush. استخدم endl فقط عند الحاجة الفعلية للتفريغ الفوري."
        }
    ],
    "std::ofstream": [
        {
            "titleArabic": "كتابة ملف نصي",
            "code": "#include <fstream>\n#include <iostream>\n\nint main() {\n    std::ofstream file(\"output.txt\");\n    if (!file.is_open()) return 1;\n    file << \"Hello World\\n\";\n    file << 42 << \"\\n\";\n}",
            "explanationArabic": "ofstream يفتح ملفًا للكتابة. يُنشئ الملف إذا لم يكن موجودًا. يُغلق تلقائيًا عند نهاية النطاق."
        },
        {
            "titleArabic": "إلحاق في ملف موجود",
            "code": "#include <fstream>\n\nint main() {\n    std::ofstream file(\"log.txt\", std::ios::app);\n    file << \"سطر جديد\\n\";\n}",
            "explanationArabic": "ios::app يفتح للإلحاق. بدونه يُستبدل محتوى الملف. خيارات أخرى: ios::binary للثنائي."
        },
        {
            "titleArabic": "التحقق من نجاح الكتابة",
            "code": "#include <fstream>\n#include <iostream>\n\nint main() {\n    std::ofstream file(\"/readonly/path.txt\");\n    if (!file) {\n        std::cout << \"فشل فتح الملف للكتابة\";\n        return 1;\n    }\n    file << \"data\";\n    if (!file.good()) {\n        std::cout << \"فشلت الكتابة\";\n    }\n}",
            "explanationArabic": "good() وoperator! تتحققان من حالة التدفق. فشل الفتح أو الكتابة يُضعف الحالة."
        }
    ],
    "std::fstream": [
        {
            "titleArabic": "قراءة وكتابة في نفس الملف",
            "code": "#include <fstream>\n#include <iostream>\n\nint main() {\n    std::fstream file(\"data.txt\", std::ios::in | std::ios::out);\n    if (!file) return 1;\n    int val;\n    file >> val;\n    file.seekp(0);\n    file << val + 1;\n}",
            "explanationArabic": "fstream يفتح للقراءة والكتابة. seekp يُغيّر موضع الكتابة. seekg يُغيّر موضع القراءة."
        },
        {
            "titleArabic": "فتح بوضع ثنائي",
            "code": "#include <fstream>\n\nint main() {\n    std::fstream file(\"data.bin\",\n        std::ios::in | std::ios::out | std::ios::binary);\n}",
            "explanationArabic": "ios::binary يفتح في الوضع الثنائي. مهم عند العمل مع بيانات غير نصية."
        },
        {
            "titleArabic": "التحقق قبل القراءة والكتابة",
            "code": "#include <fstream>\n#include <iostream>\n\nint main() {\n    std::fstream file(\"data.txt\", std::ios::in | std::ios::out);\n    if (!file) {\n        std::cout << \"فشل فتح الملف\";\n        return 1;\n    }\n}",
            "explanationArabic": "دائمًا تحقق من نجاح الفتح قبل القراءة أو الكتابة. fstream يتحول إلى false عند الفشل."
        }
    ],
    "std::stringstream": [
        {
            "titleArabic": "بناء نص ديناميكي",
            "code": "#include <sstream>\n#include <iostream>\n\nint main() {\n    std::stringstream ss;\n    ss << \"العرض: \" << 1920 << \" الارتفاع: \" << 1080;\n    std::cout << ss.str();\n}",
            "explanationArabic": "stringstream يبني نصًا باستخدام operator<< مثل cout. str() يُرجع السلسلة الناتجة."
        },
        {
            "titleArabic": "تحويل رقم إلى نص",
            "code": "#include <sstream>\n#include <string>\n\nint main() {\n    std::stringstream ss;\n    ss << 3.14f;\n    std::string s = ss.str();\n}",
            "explanationArabic": "stringstream يحول الأنواع إلى نص عبر operator<<. بديل لـ to_string عند الحاجة لتحكم أكثر في التنسيق."
        },
        {
            "titleArabic": "تحليل نص إلى أرقام",
            "code": "#include <sstream>\n#include <iostream>\n\nint main() {\n    std::stringstream ss(\"42 3.14\");\n    int a; float b;\n    ss >> a >> b;\n    std::cout << a << \" \" << b; // 42 3.14\n}",
            "explanationArabic": "operator>> يقرأ من stringstream مثل cin. يتحول تلقائيًا بين الأنواع."
        }
    ],
    "std::filesystem::path": [
        {
            "titleArabic": "بناء مسار محمول",
            "code": "#include <filesystem>\n#include <iostream>\nnamespace fs = std::filesystem;\n\nint main() {\n    fs::path p = \"assets\" / \"textures\" / \"hero.png\";\n    std::cout << p.string();\n}",
            "explanationArabic": "operator/ يربط أجزاء المسار بالفاصل الصحيح لكل نظام (/ على Linux، \\ على Windows)."
        },
        {
            "titleArabic": "استخراج أجزاء المسار",
            "code": "#include <filesystem>\n#include <iostream>\nnamespace fs = std::filesystem;\n\nint main() {\n    fs::path p = \"/assets/textures/hero.png\";\n    std::cout << p.filename() << \"\\n\"; // hero.png\n    std::cout << p.stem() << \"\\n\";     // hero\n    std::cout << p.extension() << \"\\n\"; // .png\n    std::cout << p.parent_path();        // /assets/textures\n}",
            "explanationArabic": "filename يُرجع اسم الملف مع الامتداد. stem يُرجع الاسم بدون امتداد. extension يُرجع الامتداد فقط."
        },
        {
            "titleArabic": "التحقق من وجود ملف",
            "code": "#include <filesystem>\n#include <iostream>\nnamespace fs = std::filesystem;\n\nint main() {\n    fs::path p = \"config.json\";\n    if (fs::exists(p)) {\n        std::cout << \"الحجم: \" << fs::file_size(p) << \" bytes\";\n    }\n}",
            "explanationArabic": "exists يتحقق من وجود الملف أو المجلد. file_size يُرجع الحجم بالبايتات."
        }
    ],
    "std::chrono::duration": [
        {
            "titleArabic": "تمثيل مدة زمنية",
            "code": "#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono_literals;\n    auto d = 500ms;\n    auto sec = std::chrono::duration_cast<std::chrono::seconds>(d);\n    std::cout << sec.count(); // 0\n}",
            "explanationArabic": "chrono::milliseconds وs وmin وh أنواع مدد زمنية. duration_cast يُحوّل بينها."
        },
        {
            "titleArabic": "العمليات الحسابية على المدد",
            "code": "#include <chrono>\n#include <iostream>\n\nint main() {\n    using namespace std::chrono_literals;\n    auto total = 2min + 30s;\n    std::cout << std::chrono::duration_cast<std::chrono::seconds>(total).count(); // 150\n}",
            "explanationArabic": "يمكن جمع وطرح المدد الزمنية. النتيجة تكون بأدق وحدة بين المعاملات."
        },
        {
            "titleArabic": "استخدامها مع sleep_for",
            "code": "#include <chrono>\n#include <thread>\n\nint main() {\n    using namespace std::chrono_literals;\n    std::this_thread::sleep_for(100ms);\n}",
            "explanationArabic": "sleep_for تأخذ duration. اللاحقات ms وs وmin تجعل الكود أوضح من تمرير الأرقام."
        }
    ],
    "std::chrono::time_point": [
        {
            "titleArabic": "قياس مدة تنفيذ عملية",
            "code": "#include <chrono>\n#include <iostream>\n\nint main() {\n    auto start = std::chrono::steady_clock::now();\n    volatile int x = 0;\n    for (int i = 0; i < 1000000; ++i) ++x;\n    auto end = std::chrono::steady_clock::now();\n    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);\n    std::cout << ms.count() << \" ms\";\n}",
            "explanationArabic": "time_point يمثل لحظة زمنية. الطرح بين نقطتين يُعطي duration. استخدم steady_clock للقياس."
        },
        {
            "titleArabic": "الفرق بين نقطتين زمنيتين",
            "code": "#include <chrono>\n\nauto t1 = std::chrono::steady_clock::now();\nauto t2 = std::chrono::steady_clock::now();\nauto diff = t2 - t1; // نوع duration\nauto us = std::chrono::duration_cast<std::chrono::microseconds>(diff);",
            "explanationArabic": "طرح time_point يُرجع duration. duration_cast يُحوّل للوحدة المطلوبة."
        },
        {
            "titleArabic": "لا تستخدم system_clock للقياس",
            "code": "#include <chrono>\n\n// ❌ system_clock قد تُضبط للوراء\n// auto t = std::chrono::system_clock::now();\n\n// ✅ steady_clock لا تُضبط أبدًا — الأفضل للقياس\nauto t = std::chrono::steady_clock::now();",
            "explanationArabic": "system_clock قد تتأثر بتعديل وقت النظام. steady_clock مضمونة عدم التراجع — أنسب لقياس الأداء."
        }
    ],
    "std::chrono::steady_clock": [
        {
            "titleArabic": "قياس deltaTime في لعبة",
            "code": "#include <chrono>\n#include <iostream>\n\nint main() {\n    auto prev = std::chrono::steady_clock::now();\n    for (int i = 0; i < 3; ++i) {\n        auto now = std::chrono::steady_clock::now();\n        auto dt = std::chrono::duration<float>(now - prev).count();\n        prev = now;\n        std::cout << \"dt: \" << dt << \"s\\n\";\n    }\n}",
            "explanationArabic": "duration<float> يُحوّل المدة لثوانٍ كعدد عشري. count() يُرجع القيمة. هذا النمط أساسي في حلقات الألعاب."
        },
        {
            "titleArabic": "now() يُرجع time_point",
            "code": "#include <chrono>\n\nauto t = std::chrono::steady_clock::now();\n// t من نوع time_point<steady_clock>",
            "explanationArabic": "now() يُرجع اللحظة الحالية كـ time_point. steady_clock مضمونة عدم التراجع."
        },
        {
            "titleArabic": "is_steady دائمًا true",
            "code": "#include <chrono>\n#include <iostream>\n\nint main() {\n    std::cout << std::chrono::steady_clock::is_steady; // 1 (true)\n    std::cout << std::chrono::system_clock::is_steady; // 0 (قد يكون false)\n}",
            "explanationArabic": "is_steady يُخبر إن كانت الساعة لا تتراجع أبدًا. steady_clock دائمًا true."
        }
    ],
    "std::less": [
        {
            "titleArabic": "المقارنة الافتراضية في map",
            "code": "#include <map>\n#include <iostream>\n\nint main() {\n    // std::less هو الافتراضي — لا تحتاج تحديده\n    std::map<std::string, int> m;\n    m[\"z\"] = 1; m[\"a\"] = 2;\n    for (const auto& [k, v] : m)\n        std::cout << k << \" \"; // a z (مرتب تصاعديًا)\n}",
            "explanationArabic": "std::less هو المعامل الافتراضي في map وset. يُرتب تصاعديًا باستخدام operator<."
        },
        {
            "titleArabic": "استخدام صريح",
            "code": "#include <map>\n\nstd::map<int, std::string, std::less<int>> m;\n// مكافئ لـ std::map<int, std::string>",
            "explanationArabic": "تحديد std::less صراحةً لا يُغيّر السلوك الافتراضي. مفيد عند الحاجة لتوضيح النية."
        },
        {
            "titleArabic": "std::less<> مع heterogeneous lookup",
            "code": "#include <map>\n#include <string>\n#include <iostream>\n\nint main() {\n    std::map<std::string, int, std::less<>> m;\n    m[\"hello\"] = 1;\n    // less<> يسمح بالبحث بـ string_view بدون تحويل\n    std::string_view key = \"hello\";\n    if (m.find(key) != m.end())\n        std::cout << m.find(key)->second; // 1\n}",
            "explanationArabic": "std::less<> (بدون نوع) يسمح بالبحث بأنواع مختلفة عن مفتاح الحاوية. هذا يتفادى إنشاء string مؤقت عند البحث بـ string_view."
        }
    ],
    "std::greater": [
        {
            "titleArabic": "عكس ترتيب map",
            "code": "#include <map>\n#include <iostream>\n\nint main() {\n    std::map<int, std::string, std::greater<int>> m;\n    m[1] = \"a\"; m[3] = \"c\"; m[2] = \"b\";\n    for (const auto& [k, v] : m)\n        std::cout << k << \" \"; // 3 2 1 (تنازلي)\n}",
            "explanationArabic": "std::greater يعكس الترتيب. map مرتبة تنازليًا بدل تصاعدي."
        },
        {
            "titleArabic": "min-heap مع priority_queue",
            "code": "#include <queue>\n#include <iostream>\n\nint main() {\n    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;\n    pq.push(3); pq.push(1); pq.push(5);\n    while (!pq.empty()) {\n        std::cout << pq.top() << \" \"; // 1 3 5\n        pq.pop();\n    }\n}",
            "explanationArabic": "std::greater يحول priority_queue من max-heap إلى min-heap. top() يُرجع الأصغر."
        },
        {
            "titleArabic": "ترتيب تنازلي مع sort",
            "code": "#include <algorithm>\n#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {3, 1, 4, 1, 5};\n    std::sort(v.begin(), v.end(), std::greater<int>());\n    for (int x : v) std::cout << x << \" \"; // 5 4 3 1 1\n}",
            "explanationArabic": "std::greater<int>() كائن مقارنة يُمرر لـ sort. أنظف من lambda تعكس الترتيب."
        }
    ],
    "std::hash": [
        {
            "titleArabic": "حساب تجزئة لسلسلة",
            "code": "#include <functional>\n#include <iostream>\n#include <string>\n\nint main() {\n    size_t h = std::hash<std::string>{}(\"hello\");\n    std::cout << h;\n}",
            "explanationArabic": "std::hash<T>{} يُنشئ كائن تجزئة. استدعاؤه يُرجع size_t يمثل التجزئة."
        },
        {
            "titleArabic": "تخصيص hash لنوع مخصص",
            "code": "#include <functional>\n#include <string>\n\nstruct Key { std::string name; int id; };\n\nnamespace std {\ntemplate<>\nstruct hash<Key> {\n    size_t operator()(const Key& k) const noexcept {\n        auto h1 = std::hash<std::string>{}(k.name);\n        auto h2 = std::hash<int>{}(k.id);\n        return h1 ^ (h2 << 1);\n    }\n};\n}\n\n// الآن يمكن استخدام Key في unordered_map",
            "explanationArabic": "unordered_map تحتاج hash للنوع. تخصيصه داخل namespace std يسمح باستخدام النوع مباشرة."
        },
        {
            "titleArabic": "hash مضمون لعدم التغيير ضمن نفس التشغيل",
            "code": "#include <functional>\n#include <string>\n\nstd::hash<std::string> hasher;\nsize_t a = hasher(\"test\");\nsize_t b = hasher(\"test\");\n// a == b دائمًا ضمن نفس التشغيل\n// لكن a قد يختلف بين تشغيلات مختلفة",
            "explanationArabic": "hash مضمون الاتساق ضمن نفس التشغيل لكنه ليس مستقرًا عبر التشغيلات. لا تخزّن hash كمعرف دائم."
        }
    ],
    "std::allocator": [
        {
            "titleArabic": "المعامل الافتراضي للحاويات",
            "code": "#include <memory>\n#include <vector>\n\n// هذان متكافئان:\nstd::vector<int> v1;\nstd::vector<int, std::allocator<int>> v2;",
            "explanationArabic": "allocator هو المعامل الأخير الافتراضي لكل حاوية STL. نادرًا ما تحتاج تحديده صراحةً."
        },
        {
            "titleArabic": "تخصيص وتحرير يدوي",
            "code": "#include <memory>\n\nstd::allocator<int> alloc;\nint* p = alloc.allocate(5); // 5 عناصر بدون تهيئة\nalloc.construct(p, 42);     // تهيئة العنصر الأول\nalloc.destroy(p);            // تدمير العنصر الأول\nalloc.deallocate(p, 5);     // تحرير الذاكرة",
            "explanationArabic": "allocate تُخصّص ذاكرة بدون تهيئة. construct وdestroy تُهيّآن وتُدمّران عنصرًا واحدًا. نادرًا ما تحتاج هذا يدويًا."
        },
        {
            "titleArabic": "لا تحتاجه عادةً",
            "code": "#include <vector>\n\n// ❌ لا تحتاج تحديد allocator في معظم الحالات\n// std::vector<int, std::allocator<int>> v;\n\n// ✅ الافتراضي يكفي دائمًا\nstd::vector<int> v;\n\n// ✅ تحتاجه فقط عند كتابة مُخصّص ذاكرة مخصص\n// أو حاوية مخصصة تعتمد على allocator",
            "explanationArabic": "allocator مفيد عند كتابة مُخصص ذاكرة مخصص أو حاويات خاصة. في الاستخدام العادي الحاويات تتعامل معه تلقائيًا."
        }
    ],
    "std::type_info": [
        {
            "titleArabic": "فحص نوع وقت التشغيل",
            "code": "#include <typeinfo>\n#include <iostream>\n\nint main() {\n    int x = 42;\n    const std::type_info& t = typeid(x);\n    std::cout << t.name(); // i (أو اسم معتمد على المُصرِّف)\n}",
            "explanationArabic": "typeid يُرجع type_info يشير لنوع المتغير. name() يُرجع اسمًا معتمدًا على المُصرِّف وليس قياسيًا."
        },
        {
            "titleArabic": "مقارنة الأنواع",
            "code": "#include <typeinfo>\n#include <iostream>\n\nstruct Base { virtual ~Base() = default; };\nstruct Derived : Base {};\n\nint main() {\n    Base* p = new Derived();\n    if (typeid(*p) == typeid(Derived))\n        std::cout << \"Derived\";\n    delete p;\n}",
            "explanationArabic": "typeid على مؤشر متعدد الأشكال يفحص النوع الفعلي. يحتاج نوعًا لديه virtual function."
        },
        {
            "titleArabic": "لا يعمل بدون virtual",
            "code": "#include <typeinfo>\n\nstruct NoVirtual { int x; };\nstruct Derived : NoVirtual { };\n\nNoVirtual* p = new Derived();\n// typeid(*p) == typeid(NoVirtual) // true! ليس Derived\n// لأنه لا يوجد virtual — النوع الساكن هو NoVirtual",
            "explanationArabic": "typeid يحتاج virtual لمعرفة النوع الفعلي وقت التشغيل. بدون virtual يستخدم النوع الساكن."
        }
    ],
    "std::tuple": [
        {
            "titleArabic": "إرجاع عدة قيم من دالة",
            "code": "#include <tuple>\n#include <iostream>\n\nstd::tuple<int, double, std::string> get_data() {\n    return {42, 3.14, \"hello\"};\n}\n\nint main() {\n    auto [a, b, c] = get_data();\n    std::cout << a << \" \" << b << \" \" << c;\n}",
            "explanationArabic": "tuple يجمع عدة قيم. structured binding (C++17) يفكها إلى متغيرات مستقلة."
        },
        {
            "titleArabic": "make_tuple واستنتاج الأنواع",
            "code": "#include <tuple>\n#include <iostream>\n\nint main() {\n    auto t = std::make_tuple(1, 2.5, \"text\");\n    std::cout << std::get<0>(t) << \" \";\n    std::cout << std::get<1>(t) << \" \";\n    std::cout << std::get<2>(t);\n}",
            "explanationArabic": "make_tuple يستنتج الأنواع. std::get<N> يصل للعنصر بالفهرس وقت الترجمة."
        },
        {
            "titleArabic": "tuple_size و tuple_element",
            "code": "#include <tuple>\n#include <iostream>\n\nusing T = std::tuple<int, double, std::string>;\n\nint main() {\n    std::cout << std::tuple_size_v<T>; // 3\n    using First = std::tuple_element_t<0, T>; // int\n}",
            "explanationArabic": "tuple_size_v يُرجع عدد العناصر. tuple_element_t<N, T> يُرجع نوع العنصر N. مفيد في القوالب."
        }
    ],
    "std::any": [
        {
            "titleArabic": "تخزين أي نوع",
            "code": "#include <any>\n#include <iostream>\n\nint main() {\n    std::any value = 42;\n    value = std::string(\"hello\");\n    value = 3.14;\n    std::cout << std::any_cast<double>(value); // 3.14\n}",
            "explanationArabic": "any يحمل قيمة من أي نوع. any_cast يسترجع القيمة بالنوع الصحيح."
        },
        {
            "titleArabic": "any_cast يرمي عند نوع خاطئ",
            "code": "#include <any>\n#include <iostream>\n\nint main() {\n    std::any value = 42;\n    try {\n        auto s = std::any_cast<std::string>(value);\n    } catch (const std::bad_any_cast& e) {\n        std::cout << \"نوع خاطئ\";\n    }\n}",
            "explanationArabic": "any_cast يرمي bad_any_cast إذا كان النوع خاطئًا. استخدم any_cast مع مؤشر للحصول على nullptr بدل استثناء."
        },
        {
            "titleArabic": "التحقق من النوع قبل الاسترجاع",
            "code": "#include <any>\n#include <iostream>\n\nint main() {\n    std::any value = 42;\n    if (value.type() == typeid(int)) {\n        std::cout << std::any_cast<int>(value);\n    }\n    std::cout << value.has_value(); // true\n}",
            "explanationArabic": "type() يُرجع type_info. has_value() يتحقق من وجود قيمة. reset() يُفرغ."
        }
    ],
    "std::nullopt": [
        {
            "titleArabic": "إنشاء optional فارغ",
            "code": "#include <optional>\n#include <iostream>\n\nint main() {\n    std::optional<int> x = std::nullopt;\n    std::cout << x.has_value(); // false\n}",
            "explanationArabic": "nullopt يُنشئ optional بدون قيمة. هو الثابت الوحيد الصحيح لإنشاء optional فارغ."
        },
        {
            "titleArabic": "استخدامه كقيمة إرجاع",
            "code": "#include <optional>\n\nstd::optional<int> find(int id) {\n    if (id < 0) return std::nullopt;\n    return id * 2;\n}",
            "explanationArabic": "nullopt أنظف من return {} لأنه أوضح نية. القارئ يعرف فورًا أن القيمة غير موجودة."
        },
        {
            "titleArabic": "لا تستخدم {} للفراغ",
            "code": "#include <optional>\n\n// ❌ قد تُفسر كقيمة افتراضية\n// std::optional<int> x = {};\n\n// ✅ nullopt واضح وغير مُبهم\nstd::optional<int> x = std::nullopt;",
            "explanationArabic": "{} قد تُفسر كقيمة افتراضية (0 للأعداد). nullopt لا يُسبب التباسًا."
        }
    ],
    "std::monostate": [
        {
            "titleArabic": "حالة فارغة في variant",
            "code": "#include <variant>\n#include <iostream>\n\nint main() {\n    std::variant<std::monostate, int, std::string> v;\n    std::cout << v.index(); // 0 (monostate)\n}",
            "explanationArabic": "monostate يسمح لـ variant بأن يكون 'فارغًا'. مفيد كحالة ابتدائية."
        },
        {
            "titleArabic": "تمثيل أمر بدون بيانات",
            "code": "#include <variant>\n#include <string>\n\nusing Command = std::variant<std::monostate, int, std::string>;\n\nCommand cmd = std::monostate{}; // لا بيانات\n// cmd = 42; // بيانات عددية\n// cmd = std::string(\"text\"); // بيانات نصية",
            "explanationArabic": "monostate كبديل أول في variant يسمح بحالة 'لا شيء' بدون تحديد نوع حقيقي."
        },
        {
            "titleArabic": "التحقق من monostate",
            "code": "#include <variant>\n#include <iostream>\n\nusing V = std::variant<std::monostate, int>;\n\nint main() {\n    V v;\n    if (std::holds_alternative<std::monostate>(v))\n        std::cout << \"فارغ\";\n}",
            "explanationArabic": "holds_alternative يتحقق من النوع. مع monostate تعني أن variant لا يحمل بيانات حقيقية."
        }
    ],
    "std::bitset": [
        {
            "titleArabic": "تمثيل أعلام ثنائية",
            "code": "#include <bitset>\n#include <iostream>\n\nint main() {\n    std::bitset<8> flags;\n    flags.set(0); // بت 0 = 1\n    flags.set(3); // بت 3 = 1\n    std::cout << flags; // 00001001\n}",
            "explanationArabic": "bitset<N> يُنشئ N بت. set يُفعّل بت. test يتحقق. يطبع كنص ثنائي."
        },
        {
            "titleArabic": "العمليات المنطقية",
            "code": "#include <bitset>\n#include <iostream>\n\nint main() {\n    std::bitset<4> a(\"1010\");\n    std::bitset<4> b(\"1100\");\n    std::cout << (a & b) << \"\\n\"; // 1000\n    std::cout << (a | b) << \"\\n\"; // 1110\n    std::cout << (a ^ b);          // 0110\n}",
            "explanationArabic": "يدعم AND وOR وXOR وNOT. كلها تعمل على كل البتات دفعة واحدة."
        },
        {
            "titleArabic": "عد البتات المفعلة",
            "code": "#include <bitset>\n#include <iostream>\n\nint main() {\n    std::bitset<8> flags(\"10110101\");\n    std::cout << flags.count(); // 5\n    std::cout << flags.size();  // 8\n}",
            "explanationArabic": "count يُرجع عدد البتات المفعلة (1). size يُرجع الحجم الكلي."
        }
    ],
    "std::initializer_list": [
        {
            "titleArabic": "تهيئة حاوية",
            "code": "#include <vector>\n#include <iostream>\n\nint main() {\n    std::vector<int> v = {1, 2, 3};\n    for (int x : v) std::cout << x << \" \";\n}",
            "explanationArabic": "{1, 2, 3} تُنشئ initializer_list يمرر لمُنشئ الحاوية. هذا ما يُمكّن التهيئة بـ {}."
        },
        {
            "titleArabic": "دالة تقبل قائمة تهيئة",
            "code": "#include <initializer_list>\n#include <iostream>\n\nint sum(std::initializer_list<int> list) {\n    int total = 0;\n    for (int x : list) total += x;\n    return total;\n}\n\nint main() {\n    std::cout << sum({1, 2, 3, 4}); // 10\n}",
            "explanationArabic": "initializer_list يسمح بتمرير {1,2,3} كمعامل. مفيد للدوال التي تقبل عددًا متغيرًا من القيم."
        },
        {
            "titleArabic": "لا يمكن تغيير حجمه",
            "code": "#include <initializer_list>\n\nstd::initializer_list<int> list = {1, 2, 3};\n// list.push_back(4); // لا يوجد push_back\n// list.resize(10);    // لا يوجد resize\n// initializer_list للقراءة فقط — لا يُعدّل ولا يُغيّر حجمه",
            "explanationArabic": "initializer_list للقراءة فقط. إذا احتجت تعديل انسخه لحاوية مثل vector."
        }
    ],
    "std::reference_wrapper": [
        {
            "titleArabic": "تخزين مراجع في حاوية",
            "code": "#include <functional>\n#include <vector>\n#include <iostream>\n\nint main() {\n    int a = 10, b = 20, c = 30;\n    std::vector<std::reference_wrapper<int>> refs;\n    refs.push_back(a);\n    refs.push_back(b);\n    refs.push_back(c);\n    refs[0] = 99;\n    std::cout << a; // 99 — التعديل أثر على الأصل\n}",
            "explanationArabic": "reference_wrapper يسمح بتخزين مراجع في حاويات. التعديل عبره يُعدّل المتغير الأصلي."
        },
        {
            "titleArabic": "std::ref و std::cref",
            "code": "#include <functional>\n#include <vector>\n\nint x = 42;\nstd::vector<std::reference_wrapper<int>> v;\nv.push_back(std::ref(x));  // مرجع قابل للتعديل\n// v.push_back(std::cref(x)); // مرجع للقراءة فقط",
            "explanationArabic": "ref يُنشئ reference_wrapper قابل للتعديل. cref يُنشئ reference_wrapper للقراءة فقط."
        },
        {
            "titleArabic": "لا تستخدمه إذا احتجت ملكية",
            "code": "#include <functional>\n\n// ❌ مرجع لـ محلي — يصبح dangling\n// std::reference_wrapper<int> bad() {\n//     int x = 10;\n//     return std::ref(x);\n// }\n\n// ✅ استخدم المؤشرات الذكية أو القيم للملكية\n// أو تأكد أن المرجع يعيش أطول من reference_wrapper",
            "explanationArabic": "reference_wrapper لا يملك — مثل مرجع عادي. تأكد أن المتغير الأصلي يعيش أطول."
        }
    ],
}

with open(SRC, "r", encoding="utf-8") as f:
    data = json.load(f)

ref = data["referenceData"]

categories = {
    "containers": {},
    "smart-pointers": {},
    "concurrency": {},
    "io-algo": {},
}

uncategorized = []

for key, val in ref.items():
    cat = CATEGORY_MAP.get(key)
    if not cat:
        uncategorized.append(key)
        continue
    entry = dict(val)
    if "usageExamples" not in entry or not entry["usageExamples"]:
        if key in EXAMPLES:
            entry["usageExamples"] = EXAMPLES[key]
        else:
            uncategorized.append(key + " (missing examples)")
            continue
    categories[cat][key] = entry

if uncategorized:
    print(f"WARNING: uncategorized or missing examples: {uncategorized}")

for cat_name, cat_data in categories.items():
    out_path = os.path.join(OUT_DIR, CATEGORY_FILES[cat_name])
    out = {"referenceData": cat_data}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    size = os.path.getsize(out_path)
    print(f"{CATEGORY_FILES[cat_name]}: {len(cat_data)} entries, {size} bytes ({size/1024:.1f} KB)")

with open(APP_TEXT, "r", encoding="utf-8") as f:
    app = json.load(f)

app["cppReferenceData"] = {
    "files": [
        {"path": "data/ui/cpp/reference-stdlib-containers.json"},
        {"path": "data/ui/cpp/reference-stdlib-smart-pointers.json"},
        {"path": "data/ui/cpp/reference-stdlib-concurrency.json"},
        {"path": "data/ui/cpp/reference-stdlib-io-algo.json"}
    ]
}

with open(APP_TEXT, "w", encoding="utf-8") as f:
    json.dump(app, f, ensure_ascii=False, indent=2)

print("\napp-text.json updated with cppReferenceData")

missing_examples = []
for cat_name, cat_data in categories.items():
    for key, val in cat_data.items():
        exs = val.get("usageExamples", [])
        if not exs or len(exs) != 3:
            missing_examples.append(key)

if missing_examples:
    print(f"\nWARNING: entries without exactly 3 examples: {missing_examples}")
else:
    print("\nAll entries have exactly 3 usageExamples")
