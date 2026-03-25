const fs = require('fs');
const path = require('path');

const guidesDir = path.join(__dirname, '..', 'data', 'ui', 'cpp');
const guideIndex = JSON.parse(fs.readFileSync(path.join(guidesDir, 'reference-guides-index.json'), 'utf8'));

const stdlibFilePath = path.join(guidesDir, 'reference-guides-stdlib.json');
const stdlibData = JSON.parse(fs.readFileSync(stdlibFilePath, 'utf-8'));

const newElements = {
  "std::unordered_set": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::unordered_set تمنع تكرار العناصر مثل std::set لكنها لا تحافظ على ترتيبها. فائدتها أن الإدراج والبحث أسرع في المتوسط لأنها تعتمد على جدول تجزئة لا على شجرة مرتبة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج uniqueness ولا يهمك ترتيب العناصر.",
      "تذكر أن الترتيب غير مضمون وقد يختلف بين عمليات التشغيل.",
      "إذا كان الترتيب المنطقي مهمًا فstd::set أنسب."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إزالة التكرار بدون ترتيب",
        code: "#include <unordered_set>\n\nint main() {\n    std::unordered_set<int> values{3, 1, 3, 2, 1};\n    return static_cast<int>(values.size());\n}",
        explanationArabic: "العناصر المكررة لا تُضاف. النتيجة 3 عناصر فريدة لكن ترتيبها غير مضمون.",
        relatedTokens: ["std::unordered_set"]
      },
      {
        titleArabic: "البحث السريع عن وجود عنصر",
        code: "#include <unordered_set>\n\nint main() {\n    std::unordered_set<int> values{10, 20, 30};\n    return values.count(20) ? 1 : 0;\n}",
        explanationArabic: "count تعيد 1 إذا وُجدت القيمة و0 إذا لم تُوجد. البحث أسرع من البحث الخطي.",
        relatedTokens: ["std::unordered_set", "bool"]
      },
      {
        titleArabic: "إدراج وحذف عناصر",
        code: "#include <unordered_set>\n\nint main() {\n    std::unordered_set<int> values{1, 2, 3};\n    values.insert(4);\n    values.erase(2);\n    return static_cast<int>(values.size());\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن unordered_set ليست للقراءة فقط؛ بل تدعم الإدراج والحذف مع الحفاظ على التفرد.",
        relatedTokens: ["std::unordered_set"]
      }
    ],
    followUps: ["std::set", "std::unordered_map", "std::vector"]
  },
  "std::multimap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::multimap تسمح بمفاتيح مكررة مثل std::map لكنها لا تمنع تكرار المفتاح نفسه. فائدتها تظهر عندما يكون لكل مفتاح أكثر من قيمة مرتبطة به مثل عدة نتائج لنفس فئة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج ربط مفتاح واحد بعدة قيم ولا تريد منع التكرار.",
      "استخدم equal_range للحصول على مجال كل القيم المرتبطة بمفتاح واحد.",
      "إذا كان كل مفتاح يرتبط بقيمة واحدة فstd::map أوضح."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "مفتاح واحد يرتبط بعدة قيم",
        code: "#include <map>\n#include <string>\n\nint main() {\n    std::multimap<std::string, int> data;\n    data.insert({\"fruit\", 1});\n    data.insert({\"fruit\", 2});\n    data.insert({\"veg\", 3});\n    return static_cast<int>(data.count(\"fruit\"));\n}",
        explanationArabic: "multimap تسمح بإدراج عدة قيم لنفس المفتاح. count تعيد عدد القيم المرتبطة به.",
        relatedTokens: ["std::multimap", "std::string"]
      },
      {
        titleArabic: "استخراج كل القيم لمفتاح واحد",
        code: "#include <map>\n#include <string>\n\nint main() {\n    std::multimap<std::string, int> data;\n    data.insert({\"x\", 10});\n    data.insert({\"x\", 20});\n    auto [first, last] = data.equal_range(\"x\");\n    int sum = 0;\n    for (auto it = first; it != last; ++it) {\n        sum += it->second;\n    }\n    return sum;\n}",
        explanationArabic: "equal_range تعيد مجالًا يحتوي كل الأزواج المرتبطة بالمفتاح. هذا أنظح من البحث اليدوي.",
        relatedTokens: ["std::multimap", "std::string", "auto"]
      },
      {
        titleArabic: "لا تستخدم [] للقراءة",
        code: "#include <map>\n#include <string>\n\nint main() {\n    std::multimap<std::string, int> data;\n    data.insert({\"key\", 5});\n    // data[\"key\"] = 10; // خطأ: operator[] غير متوفرة في multimap\n    auto it = data.find(\"key\");\n    return (it != data.end()) ? it->second : 0;\n}",
        explanationArabic: "هذا مثال ذكي تحذيري: multimap لا توفر operator[] لأن المفتاح قد يرتبط بأكثر من قيمة. استخدم find أو equal_range بدلًا منها.",
        relatedTokens: ["std::multimap", "std::string", "std::map"]
      }
    ],
    followUps: ["std::map", "std::unordered_map", "std::set"]
  },
  "std::multiset": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::multiset تحافظ على ترتيب العناصر لكنها تسمح بتكرارها. فائدتها تظهر عندما تحتاج ترتيبًا منطقيًا مع السماح بتكرار القيم مثل تسجيل أحداث مرتبة زمنيًا.",
    projectStepsArabic: [
      "استخدمها عندما يكون الترتيب مهمًا والتكرار مسموح به.",
      "استخدم equal_range للحصول على مجال كل القيم المكررة لعنصر واحد.",
      "إذا كنت تريد منع التكرار فstd::set أنسب."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "ترتيب مع تكرار مسموح",
        code: "#include <set>\n\nint main() {\n    std::multiset<int> values{3, 1, 3, 2};\n    return *values.begin();\n}",
        explanationArabic: "multiset تحتفظ بكل القيم بما فيها المكررة وترتبها منطقيًا. هنا أصغر عنصر هو 1.",
        relatedTokens: ["std::multiset"]
      },
      {
        titleArabic: "عدّاد التكرارات لعنصر واحد",
        code: "#include <set>\n\nint main() {\n    std::multiset<int> values{1, 3, 3, 3, 5};\n    return static_cast<int>(values.count(3));\n}",
        explanationArabic: "count تعيد عدد مرات وجود القيمة. هذا يختلف عن set التي تعيد دائمًا 0 أو 1.",
        relatedTokens: ["std::multiset"]
      },
      {
        titleArabic: "استخراج مجال القيم المكررة",
        code: "#include <set>\n\nint main() {\n    std::multiset<int> values{1, 2, 2, 2, 3};\n    auto [first, last] = values.equal_range(2);\n    int count = 0;\n    for (auto it = first; it != last; ++it) {\n        ++count;\n    }\n    return count;\n}",
        explanationArabic: "هذا مثال ذكي يوضح equal_range التي تعيد مجالًا يحتوي كل نسخ القيمة المكررة. هذا أنظح من المرور اليدوي.",
        relatedTokens: ["std::multiset", "auto"]
      }
    ],
    followUps: ["std::set", "std::multimap", "std::unordered_set"]
  },
  "std::deque": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::deque حاوية تسلسلية تدعم الإضافة والحذف السريع من كلا الطرفين. فائدتها تظهر عندما تحتاج إضافة أو حذفًا متكررًا من المقدمة والمؤخرة مع الحفاظ على الوصول العشوائي السريع.",
    projectStepsArabic: [
      "استخدمها عندما يكون الإضافة والحذف من كلا الطرفين جزءًا أساسيًا من التصميم.",
      "لا تستخدمها بديلًا عن vector إذا كانت العمليات كلها من طرف واحد.",
      "تذكر أن الوصول العشوائي سريع لكن أبطأ قليلًا من vector بسبب تخطيط الذاكرة المقطعي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إضافة من الطرفين",
        code: "#include <deque>\n\nint main() {\n    std::deque<int> values;\n    values.push_back(10);\n    values.push_front(5);\n    return values.front();\n}",
        explanationArabic: "push_front وpush_back كلاهما سريع في deque. هذا يختلف عن vector حيث push_front بطيئة.",
        relatedTokens: ["std::deque"]
      },
      {
        titleArabic: "حذف من الطرفين",
        code: "#include <deque>\n\nint main() {\n    std::deque<int> values{1, 2, 3, 4, 5};\n    values.pop_front();\n    values.pop_back();\n    return values.size();\n}",
        explanationArabic: "pop_front وpop_back كلاهما سريع. هذا يجعل deque مناسبة كطابور ثنائي الاتجاه.",
        relatedTokens: ["std::deque", "size_t"]
      },
      {
        titleArabic: "الوصول العشوائي مثل المصفوفة",
        code: "#include <deque>\n\nint main() {\n    std::deque<int> values{10, 20, 30, 40};\n    return values[2];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن deque ليست مثل list؛ بل تدعم الوصول العشوائي بالفهرس مباشرة رغم تخطيطها المقطعي.",
        relatedTokens: ["std::deque"]
      }
    ],
    followUps: ["std::vector", "std::list", "std::queue"]
  },
  "std::list": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::list قائمة مرتبطة مزدوجة. فائدتها أن الإدراج والحذف في أي موضع ثابت الوقت. لكن الوصول العشوائي بطيء لأنه يتطلب المرور عبر العناصر واحدًا واحدًا.",
    projectStepsArabic: [
      "استخدمها عندما يكون الإدراج والحذف في المنتصف هو العملية الأساسية.",
      "لا تستخدمها إذا كان الوصول العشوائي أو المرور التسلسلي السريع هو الأهم.",
      "تذكر أن ذاكرة التخزين ليست متجاورة لذلك التخزين المؤقت لا يفيد كثيرًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج وحذف في المنتصف",
        code: "#include <list>\n\nint main() {\n    std::list<int> values{1, 3, 4};\n    auto it = values.begin();\n    ++it;\n    values.insert(it, 2);\n    return values.size();\n}",
        explanationArabic: "الإدراج في المنتصف ثابت الوقت في list بينما في vector يتطلب إزاحة العناصر.",
        relatedTokens: ["std::list", "size_t"]
      },
      {
        titleArabic: "المرور على العناصر",
        code: "#include <list>\n\nint main() {\n    std::list<int> values{10, 20, 30};\n    int sum = 0;\n    for (int v : values) {\n        sum += v;\n    }\n    return sum;\n}",
        explanationArabic: "رغم أن الوصول العشوائي بطيء، المرور التسلسلي يعمل بشكل طبيعي مع الحلقات.",
        relatedTokens: ["std::list", "for"]
      },
      {
        titleArabic: "لا تدعم الوصول بالفهرس",
        code: "#include <list>\n\nint main() {\n    std::list<int> values{10, 20, 30};\n    // values[1]; // خطأ: list لا تدعم operator[]\n    auto it = values.begin();\n    ++it;\n    return *it;\n}",
        explanationArabic: "هذا مثال ذكي تحذيري: list لا تدعم الوصول المباشر بالفهرس. يجب استخدام المكرر للوصول إلى عنصر محدد.",
        relatedTokens: ["std::list", "std::vector", "auto"]
      }
    ],
    followUps: ["std::vector", "std::deque", "std::forward_list"]
  },
  "std::forward_list": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::forward_list قائمة مرتبطة أحادية الاتجاه. هي أخف من std::list لأن كل عنصر يحتاج مؤشرًا واحدًا فقط بدل اثنين. لكنها لا تدعم المرور للخلف ولا sizeof أكبر من list.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج قائمة مرتبطة خفيفة والمرور للخلف غير مطلوب.",
      "تذكر أن insert_after وerase_after هما العمليات الأساسية لا insert وerase العاديتين.",
      "إذا احتجت المرور للخلف أو الحذف من المؤخرة فstd::list أنسب."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج بعد عنصر محدد",
        code: "#include <forward_list>\n\nint main() {\n    std::forward_list<int> values{1, 3};\n    auto it = values.begin();\n    values.insert_after(it, 2);\n    return values.front();\n}",
        explanationArabic: "insert_after تُدرج بعد المكرر لا قبله. هذا لأن القائمة أحادية الاتجاه فلا يمكن الرجوع للخلف.",
        relatedTokens: ["std::forward_list"]
      },
      {
        titleArabic: "المرور على العناصر للأمام فقط",
        code: "#include <forward_list>\n\nint main() {\n    std::forward_list<int> values{10, 20, 30};\n    int sum = 0;\n    for (int v : values) {\n        sum += v;\n    }\n    return sum;\n}",
        explanationArabic: "الحلقات تعمل بشكل طبيعي للمرور للأمام. لكن لا يوجد rbegin أو rend للمرور العكسي.",
        relatedTokens: ["std::forward_list", "for"]
      },
      {
        titleArabic: "حذف بعد عنصر محدد",
        code: "#include <forward_list>\n\nint main() {\n    std::forward_list<int> values{1, 2, 3, 4};\n    auto it = values.begin();\n    ++it;\n    values.erase_after(it);\n    int sum = 0;\n    for (int v : values) { sum += v; }\n    return sum;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن erase_after تحذف العنصر الذي يلي المكرر لا العنصر نفسه. النتيجة هنا {1, 2, 4}.",
        relatedTokens: ["std::forward_list", "for"]
      }
    ],
    followUps: ["std::list", "std::vector", "std::deque"]
  },
  "std::stack": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::stack حاوية محول تقدم واجهة LIFO: الإدراج والحذف من طرف واحد فقط. فائدتها أنها تفرض قاعدة الوصول الأولى في الأخيرة عن طريق إخفاء العمليات الأخرى.",
    projectStepsArabic: [
      "استخدمها عندما يكون معنى البيانات هو الأهم: آخر ما دخل أول ما يخرج.",
      "لا تستخدمها إذا احتجت الوصول إلى عنصر في المنتصف أو المرور على كل العناصر.",
      "الحاوية الأساسية الافتراضية هي deque لكن يمكنك اختيار vector أو list."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج وسحب من أعلى المكدس",
        code: "#include <stack>\n\nint main() {\n    std::stack<int> s;\n    s.push(10);\n    s.push(20);\n    s.push(30);\n    int top = s.top();\n    s.pop();\n    return top;\n}",
        explanationArabic: "push تضيف للأعلى وtop تقرأ الأعلى وpop تحذف الأعلى. آخر ما دخل هو 30 وهو أول ما يُقرأ.",
        relatedTokens: ["std::stack"]
      },
      {
        titleArabic: "التحقق من فراغ المكدس",
        code: "#include <stack>\n\nint main() {\n    std::stack<int> s;\n    s.push(5);\n    s.pop();\n    return s.empty() ? 1 : 0;\n}",
        explanationArabic: "empty تفحص هل المكدس فارغ. هذا مهم قبل استدعاء top أو pop لتجنب سلوك غير معرّف.",
        relatedTokens: ["std::stack", "bool"]
      },
      {
        titleArabic: "اختيار الحاوية الأساسية",
        code: "#include <stack>\n#include <vector>\n\nint main() {\n    std::stack<int, std::vector<int>> s;\n    s.push(1);\n    s.push(2);\n    return s.top();\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن stack محول لا حاوية مستقلة. يمكنك اختيار vector أو deque أو list كحاوية أساسية.",
        relatedTokens: ["std::stack", "std::vector"]
      }
    ],
    followUps: ["std::queue", "std::deque", "std::vector"]
  },
  "std::queue": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::queue حاوية محول تقدم واجهة FIFO: الإدراج من الخلف والحذف من الأمام. فائدتها أنها تفرض قاعدة الوارد أولًا خارجًا أولًا.",
    projectStepsArabic: [
      "استخدمها عندما يكون معنى البيانات هو طابور: أول ما دخل أول ما يخرج.",
      "لا تستخدمها إذا احتجت الوصول العشوائي أو الإدراج في المنتصف.",
      "الحاوية الأساسية الافتراضية هي deque."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج في المؤخرة وسحب من المقدمة",
        code: "#include <queue>\n\nint main() {\n    std::queue<int> q;\n    q.push(10);\n    q.push(20);\n    q.push(30);\n    int front = q.front();\n    q.pop();\n    return front;\n}",
        explanationArabic: "push تضيف في المؤخرة وfront تقرأ المقدمة وpop تحذف المقدمة. أول ما دخل هو 10.",
        relatedTokens: ["std::queue"]
      },
      {
        titleArabic: "معالجة طابور بالترتيب",
        code: "#include <queue>\n\nint main() {\n    std::queue<int> q;\n    q.push(1);\n    q.push(2);\n    q.push(3);\n    int sum = 0;\n    while (!q.empty()) {\n        sum += q.front();\n        q.pop();\n    }\n    return sum;\n}",
        explanationArabic: "هذا يوضح النمط الشائع: معالجة كل عنصر بالترتيب الذي دخل فيه ثم إزالته.",
        relatedTokens: ["std::queue", "while", "bool"]
      },
      {
        titleArabic: "الفرق عن stack",
        code: "#include <queue>\n#include <stack>\n\nint main() {\n    std::queue<int> q;\n    q.push(1); q.push(2);\n    std::stack<int> s;\n    s.push(1); s.push(2);\n    return q.front() + s.top();\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: queue.front() تعيد أول ما دخل بينما stack.top() تعيد آخر ما دخل.",
        relatedTokens: ["std::queue", "std::stack"]
      }
    ],
    followUps: ["std::stack", "std::priority_queue", "std::deque"]
  },
  "std::priority_queue": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::priority_queue حاوية محول تعطي دائمًا الأولوية لأكبر عنصر عند القراءة. فائدتها تظهر عندما تحتاج معالجة العناصر بحسب أهميتها لا بترتيب الدخول.",
    projectStepsArabic: [
      "استخدمها عندما يكون ترتيب المعالجة بحسب الأولوية لا بحسب وقت الدخول.",
      "تذكر أن الافتراضي هو أكبر عنصر أولًا. استخدم مقارنة مخصصة للأصغر أولًا.",
      "لا تستخدمها إذا احتجت المرور على كل العناصر بالترتيب."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أكبر عنصر يخرج أولًا",
        code: "#include <queue>\n\nint main() {\n    std::priority_queue<int> pq;\n    pq.push(3);\n    pq.push(1);\n    pq.push(5);\n    return pq.top();\n}",
        explanationArabic: "top تعيد دائمًا أكبر عنصر. هنا 5 هو الأكبر رغم أنه لم يكن آخر من دخل.",
        relatedTokens: ["std::priority_queue"]
      },
      {
        titleArabic: "أصغر عنصر يخرج أولًا",
        code: "#include <queue>\n\nint main() {\n    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;\n    pq.push(3);\n    pq.push(1);\n    pq.push(5);\n    return pq.top();\n}",
        explanationArabic: "std::greater كمعامل ثالث يعكس الترتيب فيصبح الأصغر هو الأول. هذا نمط شائع في خوارزميات مثل Dijkstra.",
        relatedTokens: ["std::priority_queue", "std::vector"]
      },
      {
        titleArabic: "معالجة بالأولوية ثم الحذف",
        code: "#include <queue>\n\nint main() {\n    std::priority_queue<int> pq;\n    pq.push(10); pq.push(30); pq.push(20);\n    int first = pq.top(); pq.pop();\n    int second = pq.top(); pq.pop();\n    return first + second;\n}",
        explanationArabic: "هذا مثال ذكي يوضح النمط العملي: اقرأ الأعلى أولوية ثم احذفه وتابع. الأولى 30 ثم 20.",
        relatedTokens: ["std::priority_queue"]
      }
    ],
    followUps: ["std::queue", "std::stack", "std::make_heap"]
  },
  "std::regex": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::regex تسمح بمطابقة الأنماط النصية والبحث والاستبدال باستخدام التعبيرات النمطية. فائدتها تظهر عند تحليل النصوص المعقدة أو التحقق من صياغة المدخلات.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج مطابقة نمط نصي لا يمكن تحقيقه بسهولة عبر string::find.",
      "انتبه أن std::regex قد تكون بطيئة مقارنة ببدائل أخرى في بعض المترجمات.",
      "تجنب استخدامها في المسارات الساخنة إذا كان الأداء حرجًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "التحقق من مطابقة نمط",
        code: "#include <regex>\n#include <string>\n\nint main() {\n    std::regex pattern(\"\\\\d+\");\n    return std::regex_match(\"123\", pattern) ? 1 : 0;\n}",
        explanationArabic: "regex_match تتحقق أن النص كاملًا يطابق النمط. هنا النمط يطلب أرقامًا فقط.",
        relatedTokens: ["std::regex", "std::string", "bool"]
      },
      {
        titleArabic: "البحث عن نمط داخل نص",
        code: "#include <regex>\n#include <string>\n\nint main() {\n    std::regex pattern(\"\\\\d+\");\n    std::string text = \"abc 42 def\";\n    return std::regex_search(text, pattern) ? 1 : 0;\n}",
        explanationArabic: "regex_search تبحث عن النمط في أي جزء من النص لا أن يطابقه كاملًا.",
        relatedTokens: ["std::regex", "std::string", "bool"]
      },
      {
        titleArabic: "استخراج مجموعة مطابقة",
        code: "#include <regex>\n#include <string>\n\nint main() {\n    std::regex pattern(\"(\\\\d+)\");\n    std::smatch matches;\n    std::string text = \"value: 42\";\n    if (std::regex_search(text, matches, pattern)) {\n        return static_cast<int>(matches[1].str().size());\n    }\n    return 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح استخراج الجزء المطابق عبر الأقواس في النمط. matches[1] تحمل الرقم الموجود.",
        relatedTokens: ["std::regex", "std::string"]
      }
    ],
    followUps: ["std::string", "std::string_view", "std::stringstream"]
  },
  "std::chrono": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::chrono هي مكتبة للتعامل مع الزمن بطريقة أنواع آمنة. فائدتها أنها تجعل وحدات الزمن جزءًا من النوع نفسه بدل أعداد خام، فيمنع الخلط بين المللي ثانية والثواني.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج قياس زمن أو تمثيل فترات زمنية بدقة.",
      "استخدم الأنواع المحددة مثل milliseconds وseconds بدل الأعداد الخام.",
      "انتبه أن التحويل بين الوحدات يتم صراحة عبر duration_cast."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تمثيل فترة زمنية",
        code: "#include <chrono>\n\nint main() {\n    using namespace std::chrono_literals;\n    auto duration = 500ms;\n    return static_cast<int>(duration.count());\n}",
        explanationArabic: "الوحدة جزء من النوع: 500ms من النوع milliseconds. count تعيد القيمة العددية.",
        relatedTokens: ["std::chrono"]
      },
      {
        titleArabic: "تحويل بين وحدات الزمن",
        code: "#include <chrono>\n\nint main() {\n    using namespace std::chrono_literals;\n    auto duration = 1500ms;\n    auto seconds = std::chrono::duration_cast<std::chrono::seconds>(duration);\n    return static_cast<int>(seconds.count());\n}",
        explanationArabic: "duration_cast تحول بين الوحدات صراحة. هنا 1500 مللي ثانية تصبح 1 ثانية مع فقدان الجزء الباقي.",
        relatedTokens: ["std::chrono"]
      },
      {
        titleArabic: "قياس وقت تنفيذ",
        code: "#include <chrono>\n\nint main() {\n    auto start = std::chrono::steady_clock::now();\n    volatile int sum = 0;\n    for (int i = 0; i < 1000; ++i) { sum += i; }\n    auto end = std::chrono::steady_clock::now();\n    auto elapsed = end - start;\n    return elapsed.count() > 0 ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الاستخدام العملي الأشهر: قياس مدة عملية. steady_clock مناسبة لأنها لا تتأثر بتغيير ساعة النظام.",
        relatedTokens: ["std::chrono", "for"]
      }
    ],
    followUps: ["std::string", "constexpr", "int64_t"]
  },
  "std::filesystem": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::filesystem تقدم واجهة معيارية للتعامل مع المسارات والملفات والمجلدات. فائدتها أنها تجعل عمليات مثل فحص وجود ملف أو إنشاء مجلد أو تكرار محتويات دليل أنيقة وقابلة للنقل بين المنصات.",
    projectStepsArabic: [
      "استخدمها بدل التعامل المباشر مع سلاسل المسارات التي تختلف بين الأنظمة.",
      "استخدم std::filesystem::path لتمثيل المسارات بدل std::string الخام.",
      "تأكد من ربط المكتبة عند البناء لأنها قد تحتاج ربطًا إضافيًا في بعض المترجمات."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "فحص وجود ملف",
        code: "#include <filesystem>\n\nint main() {\n    std::filesystem::path p(\"notes.txt\");\n    return std::filesystem::exists(p) ? 1 : 0;\n}",
        explanationArabic: "exists تفحص وجود الملف أو المجلد. path يتعامل مع الفروقات بين الأنظمة في فاصل المسارات.",
        relatedTokens: ["std::filesystem"]
      },
      {
        titleArabic: "بناء مسار بأمان",
        code: "#include <filesystem>\n\nint main() {\n    std::filesystem::path dir(\"data\");\n    std::filesystem::path file(\"notes.txt\");\n    auto full = dir / file;\n    return static_cast<int>(full.string().size());\n}",
        explanationArabic: "العامل / يبني المسار مع الفاصل الصحيح تلقائيًا. هذا أنظح من جمع السلاسل يدويًا.",
        relatedTokens: ["std::filesystem"]
      },
      {
        titleArabic: "استخراج اسم الملف والامتداد",
        code: "#include <filesystem>\n\nint main() {\n    std::filesystem::path p(\"/home/user/document.txt\");\n    auto name = p.stem().string();\n    auto ext = p.extension().string();\n    return static_cast<int>(name.size() + ext.size());\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن path لا تمثل مسارًا فقط بل تفككه إلى أجزاء: stem تعطي الاسم بدون امتداد وextension تعطي الامتداد.",
        relatedTokens: ["std::filesystem", "std::string"]
      }
    ],
    followUps: ["std::ifstream", "std::string", "std::filesystem::path"]
  },
  "std::forward": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::forward تحافظ على فئة القيمة الأصلية عند التمرير: إذا كان الوسيط قيمة مؤقتة تبقى كذلك، وإذا كان اسمًا يبقى مرجعًا. فائدتها داخل القوالب عند تمرير المعاملات بدل std::move التي تفترض دائمًا أنك لن تحتاج القيمة مرة أخرى.",
    projectStepsArabic: [
      "استخدمها داخل القوالب عند تمرير المعاملات بدل std::move.",
      "لا تستخدمها خارج القوالب لأن المعنى واضح هناك بدونها.",
      "افهم الفرق بين std::forward التي تحافظ على الفئة وبين std::move التي تحول دائمًا إلى rvalue."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تمرير مع الحفاظ على فئة القيمة",
        code: "#include <utility>\n#include <string>\n\nvoid consume(std::string&& s) {\n    (void)s;\n}\n\nint main() {\n    std::string temp = \"hello\";\n    consume(std::forward<std::string>(temp));\n    return 0;\n}",
        explanationArabic: "std::forward تحول temp إلى مرجع rvalue لأن النوع المحدد هو std::string. الفرق عن move يظهر داخل القوالب.",
        relatedTokens: ["std::forward", "std::move", "std::string"]
      },
      {
        titleArabic: "الاستخدام داخل قالب",
        code: "#include <utility>\n#include <string>\n\ntemplate <typename T>\nvoid wrapper(T&& arg) {\n    consume(std::forward<T>(arg));\n}\n\nvoid consume(std::string&& s) { (void)s; }\n\nint main() {\n    wrapper(std::string(\"temp\"));\n    return 0;\n}",
        explanationArabic: "داخل القالب T&& قد تكون مرجعًا لقيمة مؤقتة أو مرجعًا عاديًا. std::forward تحافظ على التمييز.",
        relatedTokens: ["std::forward", "typename", "template", "std::string"]
      },
      {
        titleArabic: "الفرق الذهني عن std::move",
        code: "#include <utility>\n#include <string>\n\nint main() {\n    std::string a = \"first\";\n    std::string b = \"second\";\n    // std::move يحول دائمًا إلى rvalue بلا تمييز\n    // std::forward تحافظ على الفئة الأصلية\n    auto moved = std::move(a);\n    return static_cast<int>(b.size());\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفكرة الذهنية: move تقول لن أنتظر هذا الكائن بعد الآن. forward تقول حافظ على طبيعته الأصلية.",
        relatedTokens: ["std::forward", "std::move", "std::string", "auto"]
      }
    ],
    followUps: ["std::move", "typename", "template"]
  },
  "std::expected": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::expected تمثل نتيجة قد تكون قيمة صحيحة أو خطأ. فائدتها أنها تجعل التعامل مع الأخطاء جزءًا من النوع بدل الاستثناءات أو القيم الخاصة. أضيفت في C++23.",
    projectStepsArabic: [
      "استخدمها عندما يكون الفشل احتمالًا متوقعًا وتريد تجنب الاستثناءات.",
      "استخدم has_value أو if (exp) للفحص وvalue وerror للوصول.",
      "لا تستخدمها بديلًا عن optional إذا لم يكن هناك نوع خطأ محدد."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "نتيجة ناجحة أو خطأ",
        code: "#include <expected>\n\nstd::expected<int, int> divide(int a, int b) {\n    if (b == 0) {\n        return std::unexpected(-1);\n    }\n    return a / b;\n}\n\nint main() {\n    auto result = divide(10, 2);\n    return result.has_value() ? result.value() : 0;\n}",
        explanationArabic: "expected تعلن أن النتيجة إما int صحيح أو int يمثل الخطأ. std::unexpected يحمل قيمة الخطأ.",
        relatedTokens: ["std::expected", "bool"]
      },
      {
        titleArabic: "value_or للقيمة البديلة",
        code: "#include <expected>\n\nstd::expected<int, const char*> find_value(bool ok) {\n    if (ok) return 42;\n    return std::unexpected(\"not found\");\n}\n\nint main() {\n    auto result = find_value(false);\n    return result.value_or(0);\n}",
        explanationArabic: "value_or تعيد القيمة إذا نجحت أو البديل إذا فشلت. هذا أنظح من فحص has_value يدويًا عند وجود بديل معقول.",
        relatedTokens: ["std::expected"]
      },
      {
        titleArabic: "الفرق عن optional",
        code: "#include <expected>\n#include <optional>\n\nstd::optional<int> maybe_value(bool ok) {\n    if (ok) return 42;\n    return std::nullopt;\n}\n\nstd::expected<int, int> expected_value(bool ok) {\n    if (ok) return 42;\n    return std::unexpected(-1);\n}\n\nint main() {\n    auto a = maybe_value(false);\n    auto b = expected_value(false);\n    return a.has_value() && b.has_value() ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: optional تخبرك أن القيمة غائبة فقط. expected تخبرك لماذا غابت عبر نوع الخطأ.",
        relatedTokens: ["std::expected", "std::optional", "bool"]
      }
    ],
    followUps: ["std::optional", "std::variant", "std::exception"]
  },
  "std::format": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::format طريقة حديثة لتنسيق النصوص بأماكن محجوزة مسماة أو مرقمة. فائدتها أنها أوضح وأأمن من printf التقليدية لأنها تتحقق من الأنواع وقت الترجمة. أضيفت في C++20.",
    projectStepsArabic: [
      "استخدمها بدل printf أو stringstream عند بناء نصوص منسقة.",
      "استخدم {} للأماكن المحجوزة البسيطة أو {0} {1} للمرقمة.",
      "تأكد من دعم المترجم لـ C++20 قبل استخدامها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تنسيق بسيط بأماكن محجوزة",
        code: "#include <format>\n#include <string>\n\nint main() {\n    std::string text = std::format(\"Hello, {}!\", \"World\");\n    return static_cast<int>(text.size());\n}",
        explanationArabic: "{} مكان محجوز يُستبدل بالقيمة التالية. هذا أنظح وأأمن من printf.",
        relatedTokens: ["std::format", "std::string"]
      },
      {
        titleArabic: "تنسيق عدة قيم",
        code: "#include <format>\n#include <string>\n\nint main() {\n    std::string text = std::format(\"{} + {} = {}\", 2, 3, 5);\n    return static_cast<int>(text.size());\n}",
        explanationArabic: "كل {} يأخذ القيمة التالية بالترتيب. لا حاجة لتحديد النوع لأنه يُستنتج تلقائيًا.",
        relatedTokens: ["std::format", "std::string"]
      },
      {
        titleArabic: "تحكم في التنسيق",
        code: "#include <format>\n#include <string>\n\nint main() {\n    std::string text = std::format(\"{:05d}\", 42);\n    return text == \"00042\" ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح التحكم في التنسيق: :05d تعني عدد صحيح بعرض 5 أرقام مع صفر أمامي. هذا يوفر كثيرًا من التعليمات اليدوية.",
        relatedTokens: ["std::format", "std::string"]
      }
    ],
    followUps: ["std::print", "std::stringstream", "std::string"]
  },
  "std::print": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::print طريقة حديثة للطباعة إلى الطرفية تستخدم نفس صياغة std::format. فائدتها أنها تجمع بين وضوح التنسيق وسهولة الطباعة المباشرة. أضيفت في C++23.",
    projectStepsArabic: [
      "استخدمها بدل std::cout عند الحاجة لتنسيق واضح.",
      "تأكد من دعم المترجم لـ C++23 قبل استخدامها.",
      "استخدم std::println لإضافة سطر جديد تلقائيًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "طباعة بسيطة",
        code: "#include <print>\n\nint main() {\n    std::print(\"Hello, {}!\\n\", \"World\");\n    return 0;\n}",
        explanationArabic: "std::print تستخدم نفس صياغة format لكن تطبع مباشرة إلى stdout. هذا أنظح من سلسلة << المتعددة.",
        relatedTokens: ["std::print"]
      },
      {
        titleArabic: "طباعة مع تنسيق",
        code: "#include <print>\n\nint main() {\n    std::print(\"Score: {}\\n\", 42);\n    return 0;\n}",
        explanationArabic: "المتغيرات تُدرج مباشرة في النص المنسق بدل سلسلة << التي قد تكون طويلة.",
        relatedTokens: ["std::print", "std::cout"]
      },
      {
        titleArabic: "println لسطر جديد تلقائي",
        code: "#include <print>\n\nint main() {\n    std::println(\"Line 1\");\n    std::println(\"Line 2\");\n    return 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن println تضيف سطرًا جديدًا تلقائيًا بدل كتابة \\n يدويًا في كل مرة.",
        relatedTokens: ["std::print", "std::endl"]
      }
    ],
    followUps: ["std::format", "std::cout", "std::endl"]
  },
  "std::ranges::sort": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::ranges::sort هي نسخة ranges من std::sort توفر صياغة أنظف لأنها تأخذ الحاوية مباشرة بدل زوج المكررات.",
    projectStepsArabic: [
      "استخدمها عندما تريد ترتيب حاوية كاملة بصياغة أنظف من std::sort.",
      "مرر مقارنة مخصصة عند الحاجة مثل std::sort.",
      "تأكد من دعم المترجم لـ C++20."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "ترتيب تصاعدي مباشر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{4, 1, 3, 2};\n    std::ranges::sort(values);\n    return values.front();\n}",
        explanationArabic: "الحاوية تُمرر مباشرة بدل begin/end. الصياغة أنظح خاصة مع الحاويات المسماة.",
        relatedTokens: ["std::ranges::sort", "std::vector"]
      },
      {
        titleArabic: "ترتيب تنازلي بمقارنة",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> values{4, 1, 3, 2};\n    std::ranges::sort(values, std::greater{});\n    return values.front();\n}",
        explanationArabic: "المقارنة تُمرر كمعامل ثاني مباشرة. std::greater{} يقلب الترتيب.",
        relatedTokens: ["std::ranges::sort", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع std::sort",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 2};\n    std::ranges::sort(values);\n    // مقابل:\n    // std::sort(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: ranges::sort تأخذ الحاوية مباشرة بينما std::sort تحتاج زوج مكررات. المعنى نفسه والصياغة أنظح.",
        relatedTokens: ["std::ranges::sort", "std::sort", "std::vector"]
      }
    ],
    followUps: ["std::sort", "std::ranges::find", "std::vector"]
  },
  "std::ranges::find": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::ranges::find هي نسخة ranges من std::find توفر صياغة أنظف بأخذ الحاوية مباشرة.",
    projectStepsArabic: [
      "استخدمها عندما تريد البحث في حاوية كاملة بصياغة أنظف.",
      "قارن النتيجة بـ end لمعرفة هل وُجدت القيمة.",
      "تأكد من دعم المترجم لـ C++20."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "البحث في vector مباشرة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{4, 2, 7, 1};\n    auto it = std::ranges::find(values, 7);\n    return (it != values.end()) ? *it : 0;\n}",
        explanationArabic: "الحاوية تُمرر مباشرة مع القيمة المطلوبة. الصياغة أنظح من begin/end.",
        relatedTokens: ["std::ranges::find", "std::vector", "auto"]
      },
      {
        titleArabic: "فحص وجود فقط",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    bool found = std::ranges::find(values, 5) != values.end();\n    return found ? 0 : 1;\n}",
        explanationArabic: "أحيانًا المطلوب معرفة الوجود لا القيمة نفسها.",
        relatedTokens: ["std::ranges::find", "std::vector", "bool"]
      },
      {
        titleArabic: "المقارنة مع std::find",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{10, 20, 30};\n    auto r_it = std::ranges::find(values, 20);\n    auto s_it = std::find(values.begin(), values.end(), 20);\n    return *r_it + *s_it;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن كلاهما يعطيان نفس النتيجة لكن ranges::find أنظح صياغة.",
        relatedTokens: ["std::ranges::find", "std::find", "std::vector", "auto"]
      }
    ],
    followUps: ["std::find", "std::ranges::sort", "std::vector"]
  },
  "std::iota": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::iota تملأ مجالًا بقيم متزايدة تبدأ من قيمة أولية. فائدتها أنشاء تسلسل أعداد مرتبة بسهولة بدل كتابة حلقة يدوية.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج ملء مجال بأعداد متتالية.",
      "تذكر أن القيمة تزداد بواحد بعد كل عنصر.",
      "لا تستخدمها إذا كانت القيم تحتاج زيادة مختلفة عن 1."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "ملء vector بأعداد متتالية",
        code: "#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> values(5);\n    std::iota(values.begin(), values.end(), 1);\n    return values[4];\n}",
        explanationArabic: "iota تملأ المصفوفة بـ 1, 2, 3, 4, 5. القيمة الأولية هي 1 وتزداد تلقائيًا.",
        relatedTokens: ["std::iota", "std::vector"]
      },
      {
        titleArabic: "بدء من صفر",
        code: "#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> values(4);\n    std::iota(values.begin(), values.end(), 0);\n    return values[0];\n}",
        explanationArabic: "عند البدء من 0 نحصل على فهارس تبدأ من الصفر مثل 0, 1, 2, 3.",
        relatedTokens: ["std::iota", "std::vector"]
      },
      {
        titleArabic: "ملء جزء من الحاوية",
        code: "#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> values(6, 0);\n    std::iota(values.begin() + 2, values.end(), 10);\n    return values[3];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن iota لا تملأ كل الحاوية بالضرورة؛ بل المجال الذي تحدده أنت بالمكررات.",
        relatedTokens: ["std::iota", "std::vector"]
      }
    ],
    followUps: ["std::fill", "std::generate", "std::vector"]
  },
  "std::transform": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::transform تطبق دالة على كل عنصر في مجال وتكتب النتيجة في مجال آخر. فائدتها تحويل البيانات من شكل إلى آخر بوضوح دون حلقة يدوية.",
    projectStepsArabic: [
      "استخدمها عند تحويل كل عنصر من نوع إلى آخر أو تطبيق عملية على كل عنصر.",
      "انتبه أن المجال الهدف يجب أن يكون كبيرًا كافيًا.",
      "يمكن تطبيقها في المكان بنفس المجال كمدخل ومخرج."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "مضاعفة كل عنصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    std::vector<int> result(values.size());\n    std::transform(values.begin(), values.end(), result.begin(), [](int x) { return x * 2; });\n    return result[2];\n}",
        explanationArabic: "كل عنصر يُمرر عبر lambda ويُكتب الناتج في result. هذا أنظح من حلقة يدوية.",
        relatedTokens: ["std::transform", "std::vector", "size_t"]
      },
      {
        titleArabic: "تحويل في المكان",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    std::transform(values.begin(), values.end(), values.begin(), [](int x) { return x + 10; });\n    return values[0];\n}",
        explanationArabic: "عند استخدام نفس المجال كمدخل ومخرج يتم التعديل في المكان مباشرة.",
        relatedTokens: ["std::transform", "std::vector"]
      },
      {
        titleArabic: "تحويل أنواع مختلفة",
        code: "#include <algorithm>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    std::vector<std::string> result(values.size());\n    std::transform(values.begin(), values.end(), result.begin(), [](int x) { return std::to_string(x); });\n    return static_cast<int>(result[2].size());\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن transform يمكنها تحويل أنواع مختلفة: من int إلى string هنا.",
        relatedTokens: ["std::transform", "std::vector", "std::string"]
      }
    ],
    followUps: ["std::accumulate", "std::for_each", "std::vector"]
  },
  "std::accumulate": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::accumulate تجمع عناصر مجال باستخدام عملية تجميعية. فائدتها أنها تعبّر عن فكرة الجمع أو التجميع بشكل أوضح من حلقة يدوية.",
    projectStepsArabic: [
      "استخدمها عند تجميع عناصر مجال إلى قيمة واحدة مثل المجموع أو الضرب.",
      "القيمة الأولية تحدد نوع البداية ونوع الناتج.",
      "يمكن تمرير عملية مخصصة بدل الجمع الافتراضي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "مجموع عناصر vector",
        code: "#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4};\n    int sum = std::accumulate(values.begin(), values.end(), 0);\n    return sum;\n}",
        explanationArabic: "0 هي القيمة الأولية وتحدد أن الناتج int. كل عنصر يُجمع مع المجموع التراكمي.",
        relatedTokens: ["std::accumulate", "std::vector"]
      },
      {
        titleArabic: "ضرب العناصر",
        code: "#include <numeric>\n#include <vector>\n\nint main() {\n    std::vector<int> values{2, 3, 4};\n    int product = std::accumulate(values.begin(), values.end(), 1, [](int acc, int x) { return acc * x; });\n    return product;\n}",
        explanationArabic: "القيمة الأولية 1 لأن الضرب يحتاج وحدة محايدة. lambda تحدد عملية الضرب بدل الجمع الافتراضي.",
        relatedTokens: ["std::accumulate", "std::vector"]
      },
      {
        titleArabic: "تجميع سلاسل نصية",
        code: "#include <numeric>\n#include <string>\n#include <vector>\n\nint main() {\n    std::vector<std::string> parts{\"Hello\", \", \", \"World\"};\n    std::string result = std::accumulate(parts.begin(), parts.end(), std::string{});\n    return static_cast<int>(result.size());\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن accumulate لا تخص الأرقام فقط؛ بل يمكن تجميع أي نوع ي يدعم عملية +.",
        relatedTokens: ["std::accumulate", "std::vector", "std::string"]
      }
    ],
    followUps: ["std::transform", "std::count_if", "std::vector"]
  },
  "std::count_if": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::count_if تعدّ العناصر التي تحقق شرطًا محددًا. فائدتها أنها تعبّر عن فكرة العد المشروط بشكل أوضح من حلقة يدوية مع if.",
    projectStepsArabic: [
      "استخدمها عند عدّ العناصر التي تحقق شرطًا معينًا.",
      "الشرط يكون lambda أو دالة تعيد bool.",
      "لا تستخدمها إذا كان المطلوب مجرد عدد العناصر الكلي؛ استخدم size بدلها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "عدّ الأعداد الزوجية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4, 5, 6};\n    auto count = std::count_if(values.begin(), values.end(), [](int x) { return x % 2 == 0; });\n    return static_cast<int>(count);\n}",
        explanationArabic: "count_if تمر على كل عنصر وتعدّ فقط من يحقق الشرط. هنا 3 أعداد زوجية.",
        relatedTokens: ["std::count_if", "std::vector", "auto"]
      },
      {
        titleArabic: "عدّ القيم الأكبر من حد",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{10, 5, 20, 3, 15};\n    auto count = std::count_if(values.begin(), values.end(), [](int x) { return x > 10; });\n    return static_cast<int>(count);\n}",
        explanationArabic: "الشرط هنا مختلف: القيم الأكبر من 10 فقط. count_if تنفصل عن نوع الشرط وتعمل مع أي شرط منطقي.",
        relatedTokens: ["std::count_if", "std::vector", "auto"]
      },
      {
        titleArabic: "الفرق عن حلقة يدوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4};\n    // بدل:\n    // int count = 0;\n    // for (int v : values) if (v > 2) ++count;\n    auto count = std::count_if(values.begin(), values.end(), [](int x) { return x > 2; });\n    return static_cast<int>(count);\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن count_if تعبّر عن النية بشكل أوضح: عدّ العناصر التي تحقق شرطًا. القارئ يفهم المعنى من السطر نفسه.",
        relatedTokens: ["std::count_if", "std::vector", "for", "auto"]
      }
    ],
    followUps: ["std::find", "std::remove_if", "std::vector"]
  },
  "std::remove_if": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::remove_if تنقل العناصر التي تحقق شرطًا إلى نهاية المجال وتُعيد مكررًا إلى البداية الجديدة. فائدتها أنها تفصل العناصر المرفوضة عن المقبولة. يجب استدعاء erase بعد للحذف الفعلي.",
    projectStepsArabic: [
      "استخدم erase-remove idiom لحذف العناصر فعليًا: container.erase(remove_if(...), container.end()).",
      "تذكر أن remove_if لا تغيّر حجم الحاوية بل تنقل العناصر فقط.",
      "لا تنسَ استدعاء erase بعد remove_if وإلا ستبقى العناصر المحذوفة منطقيًا في الحاوية."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "حذف الأعداد الزوجية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4, 5, 6};\n    values.erase(std::remove_if(values.begin(), values.end(), [](int x) { return x % 2 == 0; }), values.end());\n    return static_cast<int>(values.size());\n}",
        explanationArabic: "remove_if تنقل الزوجية للنهاية وتُعيد مكررًا. erase تحذف فعليًا من المكرر إلى النهاية.",
        relatedTokens: ["std::remove_if", "std::vector"]
      },
      {
        titleArabic: "حذف القيم السالبة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{-1, 2, -3, 4, 5};\n    values.erase(std::remove_if(values.begin(), values.end(), [](int x) { return x < 0; }), values.end());\n    return values[0];\n}",
        explanationArabic: "erase-remove idiom يعمل مع أي شرط. هنا تبقى القيم الموجبة فقط.",
        relatedTokens: ["std::remove_if", "std::vector"]
      },
      {
        titleArabic: "remove_if بدون erase لا تحذف فعليًا",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4};\n    auto new_end = std::remove_if(values.begin(), values.end(), [](int x) { return x > 2; });\n    // الحجم لا يزال 4 لكن العناصر الصالحة هي 3 فقط\n    return static_cast<int>(new_end - values.begin());\n}",
        explanationArabic: "هذا مثال ذكي تحذيري: بدون erase الحجم لا يتغير. new_end يوضح أين تنتهي العناصر الصالحة فعليًا.",
        relatedTokens: ["std::remove_if", "std::vector", "auto"]
      }
    ],
    followUps: ["std::count_if", "std::unique", "std::vector"]
  },
  "std::unique": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::unique تنقل العناصر المكررة المتجاورة إلى نهاية المجال. فائدتها إزالة التكرار المتجاوز من مجال مرتب. مثل remove_if تحتاج erase للحذف الفعلي.",
    projectStepsArabic: [
      "استخدم erase-unique idiom لحذف التكرارات الفعلية.",
      "تذكر أنها تعمل على التكرارات المتجاورة فقط لذلك يجب ترتيب المجال أولًا.",
      "لا تستخدمها لإزالة كل التكرارات غير المتجاورة؛ استخدم set أو unordered_set بدلها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إزالة التكرارات المتجاورة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 1, 2, 2, 3};\n    values.erase(std::unique(values.begin(), values.end()), values.end());\n    return static_cast<int>(values.size());\n}",
        explanationArabic: "بعد الترتيب، unique تنقل المكررات المتجاورة للنهاية. erase تحذفها فعليًا.",
        relatedTokens: ["std::unique", "std::vector"]
      },
      {
        titleArabic: "ترتيب ثم إزالة التكرار",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 2, 1, 3};\n    std::sort(values.begin(), values.end());\n    values.erase(std::unique(values.begin(), values.end()), values.end());\n    return static_cast<int>(values.size());\n}",
        explanationArabic: "يجب الترتيب أولًا لأن unique تعمل على المتجاورة فقط. بعدها تصبح {1, 2, 3}.",
        relatedTokens: ["std::unique", "std::sort", "std::vector"]
      },
      {
        titleArabic: "unique لا تزيل التكرار غير المتجاوز",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 1, 3};\n    auto new_end = std::unique(values.begin(), values.end());\n    // بدون sort: النتيجة {1, 2, 1, 3} لا تتغير لأن 1s غير متجاورة\n    return static_cast<int>(new_end - values.begin());\n}",
        explanationArabic: "هذا مثال ذكي تحذيري: بدون ترتيب مسبق unique لا تفعل شيئًا لأن التكرارات ليست متجاورة.",
        relatedTokens: ["std::unique", "std::sort", "std::vector", "auto"]
      }
    ],
    followUps: ["std::sort", "std::remove_if", "std::set"]
  },
  "std::reverse": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::reverse تعكس ترتيب العناصر في المجال. فائدتها أن عكس الترتيب يعبر عن نية واضحة بدل كتابة حلقة يدوية.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج عكس ترتيب عناصر مجال.",
      "تعمل في المكان ولا تحتاج مجالًا آخر.",
      "لا تستخدمها إذا كنت تحتاج ترتيبًا منطقيًا؛ استخدم sort بدلها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "عكس ترتيب vector",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4};\n    std::reverse(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "بعد reverse تصبح {4, 3, 2, 1}. العملية تتم في المكان مباشرة.",
        relatedTokens: ["std::reverse", "std::vector"]
      },
      {
        titleArabic: "عكس جزء من الحاوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3, 4, 5};\n    std::reverse(values.begin() + 1, values.begin() + 4);\n    return values[1];\n}",
        explanationArabic: "يمكن عكس جزء فقط. هنا الجزء {2, 3, 4} يصبح {4, 3, 2} والنتيجة {1, 4, 3, 2, 5}.",
        relatedTokens: ["std::reverse", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع حلقة يدوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    // بدل:\n    // for (int i = 0; i < values.size()/2; ++i) std::swap(values[i], values[values.size()-1-i]);\n    std::reverse(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن reverse تعبّر عن النية بوضوح بدل حلقة يدوية مع حساب الفهارس.",
        relatedTokens: ["std::reverse", "std::swap", "std::vector"]
      }
    ],
    followUps: ["std::sort", "std::swap", "std::vector"]
  },
  "std::fill": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::fill تملأ مجالًا بنفس القيمة. فائدتها أنها أوضح من حلقة يدوية عند تعيين كل العناصر لقيمة واحدة.",
    projectStepsArabic: [
      "استخدمها عند ملء مجال بقيمة واحدة.",
      "تأكد أن المجال يغطي كل العناصر المطلوبة.",
      "لا تستخدمها إذا كانت القيم مختلفة؛ استخدم generate أو iota بدلها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "ملء vector بقيمة واحدة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values(5);\n    std::fill(values.begin(), values.end(), 7);\n    return values[2];\n}",
        explanationArabic: "كل العناصر تصبح 7. هذا أنظح من حلقة for يدوية.",
        relatedTokens: ["std::fill", "std::vector"]
      },
      {
        titleArabic: "ملء جزء من الحاوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{0, 0, 0, 0, 0};\n    std::fill(values.begin() + 1, values.begin() + 4, 9);\n    return values[2];\n}",
        explanationArabic: "fill تعمل على أي مجال محدد. هنا فقط العناصر من الفهرس 1 إلى 3 تُملأ.",
        relatedTokens: ["std::fill", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع تهيئة الحاوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a(3, 5);\n    std::vector<int> b(3);\n    std::fill(b.begin(), b.end(), 5);\n    return a[0] + b[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: التهيئة بالقيمة عند الإنشاء أنظح إذا كانت القيمة معروفة مسبقًا. fill أنسب عند التغيير اللاحق.",
        relatedTokens: ["std::fill", "std::vector"]
      }
    ],
    followUps: ["std::generate", "std::iota", "std::vector"]
  },
  "std::generate": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::generate تملأ مجالًا باستدعاء دالة لكل عنصر. فائدتها أنها تفصل منطق توليد القيم عن حلقة الملء.",
    projectStepsArabic: [
      "استخدمها عندما تكون قيم العناصر ناتجة من دالة أو lambda.",
      "الدالة لا تأخذ معاملات وتُستدعى لكل عنصر.",
      "لا تستخدمها إذا كانت كل القيم نفسها؛ استخدم fill بدلها."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "توليد أعداد عشوائية",
        code: "#include <algorithm>\n#include <vector>\n\nint counter = 0;\nint next_value() { return ++counter; }\n\nint main() {\n    std::vector<int> values(4);\n    std::generate(values.begin(), values.end(), next_value);\n    return values[3];\n}",
        explanationArabic: "generate تستدعي next_value لكل عنصر. كل استدعاء يُنتج قيمة جديدة.",
        relatedTokens: ["std::generate", "std::vector"]
      },
      {
        titleArabic: "استخدام lambda للتوليد",
        explanationArabic: "lambda تلتقط n بالمرجع وتعدّلها في كل استدعاء. النتيجة {15, 20, 25}.",
        relatedTokens: ["std::generate", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع fill",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a(3);\n    std::fill(a.begin(), a.end(), 5);\n    std::vector<int> b(3);\n    int n = 0;\n    std::generate(b.begin(), b.end(), [&n]() { return ++n; });\n    return a[0] + b[2];\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: fill تضع نفس القيمة في كل مكان. generate تستدعي دالة لكل عنصر فيمكن أن تنتج قيمًا مختلفة.",
        relatedTokens: ["std::generate", "std::fill", "std::vector"]
      }
    ],
    followUps: ["std::fill", "std::iota", "std::transform"]
  },
  "std::min": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::min تعيد أصغر قيمتين أو مجموعة قيم. فائدتها أنها تعبّر عن المقارنة بشكل أوضح من كتابة if يدوي.",
    projectStepsArabic: [
      "استخدمها عند مقارنة قيمتين أو أكثر واختيار الأصغر.",
      "مع initializer_list يمكن مقارنة أكثر من قيمتين.",
      "انتبه أن القيمتين يجب أن يكونا من نفس النوع."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أصغر قيمتين",
        code: "#include <algorithm>\n\nint main() {\n    int a = 10;\n    int b = 7;\n    return std::min(a, b);\n}",
        explanationArabic: "min تعيد الأصغر مباشرة. هذا أنظح من كتابة if (a < b) return a; else return b;.",
        relatedTokens: ["std::min"]
      },
      {
        titleArabic: "أصغر مجموعة قيم",
        code: "#include <algorithm>\n\nint main() {\n    return std::min({5, 2, 8, 1, 9});\n}",
        explanationArabic: "مع initializer_list يمكن مقارنة عدة قيم في استدعاء واحد.",
        relatedTokens: ["std::min", "std::initializer_list"]
      },
      {
        titleArabic: "استخدام مع مقارنة مخصصة",
        code: "#include <algorithm>\n\nint main() {\n    int a = 5;\n    int b = 10;\n    return std::min(a, b, [](int x, int y) { return x > y; });\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن min يمكن أن تعمل بعكس الاتجاه إذا مررت مقارنة مخصصة. هنا تعيد الأكبر بدل الأصغر.",
        relatedTokens: ["std::min", "std::max"]
      }
    ],
    followUps: ["std::max", "std::clamp", "std::minmax"]
  },
  "std::max": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::max تعيد أكبر قيمتين أو مجموعة قيم. فائدتها أنها تعبّر عن المقارنة بشكل أوضح من كتابة if يدوي.",
    projectStepsArabic: [
      "استخدمها عند مقارنة قيمتين أو أكثر واختيار الأكبر.",
      "مع initializer_list يمكن مقارنة أكثر من قيمتين.",
      "انتبه أن القيمتين يجب أن يكونا من نفس النوع."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أكبر قيمتين",
        code: "#include <algorithm>\n\nint main() {\n    int a = 3;\n    int b = 8;\n    return std::max(a, b);\n}",
        explanationArabic: "max تعيد الأكبر مباشرة. هذا أنظح من كتابة if (a > b) return a; else return b;.",
        relatedTokens: ["std::max"]
      },
      {
        titleArabic: "أكبر مجموعة قيم",
        code: "#include <algorithm>\n\nint main() {\n    return std::max({3, 7, 1, 9, 4});\n}",
        explanationArabic: "مع initializer_list يمكن مقارنة عدة قيم في استدعاء واحد.",
        relatedTokens: ["std::max", "std::initializer_list"]
      },
      {
        titleArabic: "استخدام مع مقارنة مخصصة",
        code: "#include <algorithm>\n\nint main() {\n    int a = 5;\n    int b = 10;\n    return std::max(a, b, [](int x, int y) { return x < y; });\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن المقارنة المخصصة تعطيك مرونة. مع مقارنة عادية تعيد الأكبر كما هو متوقع.",
        relatedTokens: ["std::max", "std::min"]
      }
    ],
    followUps: ["std::min", "std::clamp", "std::minmax"]
  },
  "std::minmax": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::minmax تعيد الأصغر والأكبر معًا في زوج واحد. فائدتها أنها تجنب مقارنتين منفصلتين عند الحاجة لكلا القيمتين.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج الأصغر والأكبر في نفس الوقت.",
      "النتيجة زوج حيث first هو الأصغر وsecond هو الأكبر.",
      "لا تستخدمها إذا كنت تحتاج قيمة واحدة فقط؛ استخدم min أو max."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أصغر وأكبر قيمتين",
        code: "#include <algorithm>\n#include <utility>\n\nint main() {\n    auto [lo, hi] = std::minmax(3, 8);\n    return lo + hi;\n}",
        explanationArabic: "minmax تعيد زوجًا: lo = 3 وhi = 8. structured binding تفكك الزوج إلى متغيرين.",
        relatedTokens: ["std::minmax", "auto"]
      },
      {
        titleArabic: "أصغر وأكبر مجموعة",
        code: "#include <algorithm>\n\nint main() {\n    auto [lo, hi] = std::minmax({5, 1, 9, 3});\n    return lo + hi;\n}",
        explanationArabic: "مع initializer_list تفحص كل القيم وتعيد الأصغر والأكبر.",
        relatedTokens: ["std::minmax", "std::initializer_list", "auto"]
      },
      {
        titleArabic: "الفرق عن استدعاء min وmax منفصلين",
        code: "#include <algorithm>\n\nint main() {\n    auto [lo, hi] = std::minmax(5, 10);\n    // مقابل:\n    // int lo = std::min(5, 10);\n    // int hi = std::max(5, 10);\n    return lo + hi;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفائدة: minmax تفحص مرة واحدة بدل مرتين. الفرق يظهر مع المجموعات الكبيرة.",
        relatedTokens: ["std::minmax", "std::min", "std::max", "auto"]
      }
    ],
    followUps: ["std::min", "std::max", "std::clamp"]
  },
  "std::clamp": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::clamp تقيد القيمة بين حد أدنى وأعلى. فائدتها أنها تعبّر عن فكرة التقييد بشكل أوضح من كتابة if متعددة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج تقييد قيمة ضمن نطاق معين.",
      "المعاملات بالترتيب: القيمة، الحد الأدنى، الحد الأعلى.",
      "تأكد أن الحد الأدنى لا يتجاوز الحد الأعلى وإلا السلوك غير معرّف."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تقييد قيمة ضمن نطاق",
        code: "#include <algorithm>\n\nint main() {\n    int value = 15;\n    int result = std::clamp(value, 0, 10);\n    return result;\n}",
        explanationArabic: "15 أكبر من 10 لذلك النتيجة 10. clamp تضمن أن القيمة تبقى داخل النطاق.",
        relatedTokens: ["std::clamp"]
      },
      {
        titleArabic: "قيمة أصغر من الحد الأدنى",
        code: "#include <algorithm>\n\nint main() {\n    int value = -5;\n    int result = std::clamp(value, 0, 100);\n    return result;\n}",
        explanationArabic: "-5 أصغر من 0 لذلك النتيجة 0. clamp تضبط القيمة إلى أقرب حد.",
        relatedTokens: ["std::clamp"]
      },
      {
        titleArabic: "المقارنة مع if يدوية",
        code: "#include <algorithm>\n\nint main() {\n    int value = 50;\n    // بدل:\n    // int result = value < 0 ? 0 : (value > 100 ? 100 : value);\n    int result = std::clamp(value, 0, 100);\n    return result;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن clamp تعبّر عن النية بوضوح بدل ternary متداخل قد يربك القراءة.",
        relatedTokens: ["std::clamp", "std::min", "std::max"]
      }
    ],
    followUps: ["std::min", "std::max", "std::minmax"]
  },
  "std::swap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::swap تتبادل قيمتين. فائدتها أنها تعبّر عن النية بوضوح وتستخدم النقل الفعال عند دعمه.",
    projectStepsArabic: [
      "استخدمها عند الحاجة لتبادل قيمتين بدل المتغير المؤقت اليدوي.",
      "مع C++11 تستخدم النقل الفعال عندما يدعمه النوع.",
      "لا تكتب التبادل يدويًا باستخدام متغير مؤقت؛ استخدم swap بدلًا منه."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تبادل قيمتين",
        code: "#include <utility>\n\nint main() {\n    int a = 10;\n    int b = 20;\n    std::swap(a, b);\n    return a;\n}",
        explanationArabic: "بعد swap تصبح a = 20 وb = 10. هذا أنظح من كتابة المتغير المؤقت يدويًا.",
        relatedTokens: ["std::swap"]
      },
      {
        titleArabic: "تبادل سلاسل نصية",
        code: "#include <string>\n#include <utility>\n\nint main() {\n    std::string a = \"first\";\n    std::string b = \"second\";\n    std::swap(a, b);\n    return static_cast<int>(a.size());\n}",
        explanationArabic: "مع الأنواع التي تدعم النقل مثل string يكون التبادل فعّالًا لأنه يتبادل المؤشرات الداخلية لا ينسخ المحتوى.",
        relatedTokens: ["std::swap", "std::string"]
      },
      {
        titleArabic: "المقارنة مع التبادل اليدوي",
        code: "#include <utility>\n\nint main() {\n    int a = 1;\n    int b = 2;\n    // بدل:\n    // int temp = a; a = b; b = temp;\n    std::swap(a, b);\n    return a;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن swap تعبّر عن النية بشكل أوضح وتستخدم أفضل آلية متاحة للنوع.",
        relatedTokens: ["std::swap", "std::move"]
      }
    ],
    followUps: ["std::move", "std::reverse", "std::iter_swap"]
  },
  "std::lower_bound": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::lower_bound تبحث عن أول موضع يمكن إدراج قيمة فيه مع الحفاظ على الترتيب. فائدتها أنها تستخدم البحث الثنائي فتكون أسرع من البحث الخطي في المجالات المرتبة.",
    projectStepsArabic: [
      "استخدمها في مجالات مرتبة فقط. السلوك غير معرّف إذا لم يكن المرتب.",
      "تُعيد مكررًا إلى أول عنصر لا يقل عن القيمة المطلوبة.",
      "قارن النتيجة مع end لمعرفة هل وُجدت القيمة أو لا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "البحث عن موضع الإدراج",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    auto it = std::lower_bound(values.begin(), values.end(), 5);\n    return *it;\n}",
        explanationArabic: "lower_bound تُعيد مكررًا إلى 5 لأنها موجودة. البحث ثنائي فأسرع من البحث الخطي.",
        relatedTokens: ["std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "قيمة غير موجودة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7};\n    auto it = std::lower_bound(values.begin(), values.end(), 4);\n    return *it;\n}",
        explanationArabic: "4 غير موجودة لكن lower_bound تُعيد موضع 5 لأنه أول عنصر لا يقل عن 4. هذا يوضح معنى \"أول موضع صالح للإدراج\".",
        relatedTokens: ["std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "الفرق عن find",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    auto lb = std::lower_bound(values.begin(), values.end(), 6);\n    auto fi = std::find(values.begin(), values.end(), 6);\n    return (*lb == 7 && fi == values.end()) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: lower_bound أسرع لكنها تتطلب ترتيبًا وتُعيد موضعًا منطقيًا. find أبطأ لكنها لا تحتاج ترتيبًا وتُعيد التطابق الدقيق فقط.",
        relatedTokens: ["std::lower_bound", "std::find", "std::vector", "auto"]
      }
    ],
    followUps: ["std::upper_bound", "std::binary_search", "std::equal_range"]
  },
  "std::upper_bound": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::upper_bound تبحث عن أول موضع بعد آخر عنصر يساوي القيمة. فائدتها أنها مع lower_bound تحددان مجال كل العناصر المساوية للقيمة المطلوبة.",
    projectStepsArabic: [
      "استخدمها في مجالات مرتبة فقط.",
      "تُعيد مكررًا إلى أول عنصر أكبر من القيمة المطلوبة.",
      "الفرق عن lower_bound أنها تتجاوز كل العناصر المساوية."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أول عنصر أكبر من القيمة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 3, 3, 5};\n    auto it = std::upper_bound(values.begin(), values.end(), 3);\n    return *it;\n}",
        explanationArabic: "upper_bound تتجاوز كل 3s وتُعيد مكررًا إلى 5. هذا يختلف عن lower_bound التي تُعيد أول 3.",
        relatedTokens: ["std::upper_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "عدّ التكرارات مع lower_bound",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 2, 3};\n    auto lo = std::lower_bound(values.begin(), values.end(), 2);\n    auto hi = std::upper_bound(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "الفرق بين upper_bound وlower_bound يعطي عدد التكرارات. هنا 3 نسخ من 2.",
        relatedTokens: ["std::upper_bound", "std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "قيمة أكبر من كل العناصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5};\n    auto it = std::upper_bound(values.begin(), values.end(), 10);\n    return (it == values.end()) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن upper_bound قد تُعيد end إذا كانت القيمة أكبر من كل العناصر.",
        relatedTokens: ["std::upper_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::equal_range", "std::binary_search"]
  },
  "std::binary_search": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::binary_search تفحص وجود قيمة في مجال مرتب باستخدام البحث الثنائي. فائدتها أنها أسرع من البحث الخطي لكنها تعيد bool فقط لا الموضع.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج معرفة الوجود فقط في مجال مرتب.",
      "تُعيد bool لا مكررًا لذلك لا تستخدمها إذا كنت تحتاج الموضع.",
      "السلوك غير معرّف إذا لم يكن المجال مرتبًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "فحص وجود قيمة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    bool found = std::binary_search(values.begin(), values.end(), 5);\n    return found ? 1 : 0;\n}",
        explanationArabic: "binary_search تعيد true لأن 5 موجودة. البحث ثنائي فأسرع من find في المجالات الكبيرة.",
        relatedTokens: ["std::binary_search", "std::vector", "bool"]
      },
      {
        titleArabic: "قيمة غير موجودة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7};\n    bool found = std::binary_search(values.begin(), values.end(), 4);\n    return found ? 1 : 0;\n}",
        explanationArabic: "4 غير موجودة فتعيد false. لا تُوجد طريقة لمعرفة أين كانت ستكون عبر binary_search.",
        relatedTokens: ["std::binary_search", "std::vector", "bool"]
      },
      {
        titleArabic: "متى تحتاج lower_bound بدلها",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    bool exists = std::binary_search(values.begin(), values.end(), 5);\n    auto pos = std::lower_bound(values.begin(), values.end(), 5);\n    return exists && (*pos == 5) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الحد: binary_search تعطيك الوجود فقط. إذا احتجت الموضع فاستخدم lower_bound.",
        relatedTokens: ["std::binary_search", "std::lower_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::upper_bound", "std::find"]
  },
  "std::equal_range": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::equal_range تجمع lower_bound وupper_bound في استدعاء واحد. فائدتها أنها تعيد مجالًا يحتوي كل العناصر المساوية للقيمة المطلوبة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج مجال كل التكرارات لعنصر في مجال مرتب.",
      "تُعيد زوج مكررات: الأول هو lower_bound والثاني هو upper_bound.",
      "الفرق بينهما يعطي عدد التكرارات."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "مجال التكرارات لعنصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 2, 3};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "equal_range تعيد مجالًا يحتوي كل 2s. الفرق بين hi وlo يعطي 3 تكرارات.",
        relatedTokens: ["std::equal_range", "std::vector", "auto"]
      },
      {
        titleArabic: "عنصر غير موجود",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 4);\n    return (lo == hi) ? 1 : 0;\n}",
        explanationArabic: "إذا لم تكن القيمة موجودة يكون lo == hi والمجال فارغًا.",
        relatedTokens: ["std::equal_range", "std::vector", "auto"]
      },
      {
        titleArabic: "المقارنة مع lower_bound + upper_bound منفصلين",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 3};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 2);\n    // مقابل:\n    // auto lo = std::lower_bound(values.begin(), values.end(), 2);\n    // auto hi = std::upper_bound(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن equal_range توفر استدعاءين منفصلين وتجعل النية أوضح: أريد مجال كل التكرارات.",
        relatedTokens: ["std::equal_range", "std::lower_bound", "std::upper_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::upper_bound", "std::binary_search"]
  },
  "std::merge": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::merge تدمج مجالين مرتبين في مجال ثالث مرتب. فائدتها أنها أسرع من دمج ثم ترتيب لأنها تستغل أن المجالين مرتبين أصلًا.",
    projectStepsArabic: [
      "استخدمها عند دمج مجالين مرتبين مع الحفاظ على الترتيب.",
      "تأكد أن المجال الهدف كبير كافي لاستيعاب كل العناصر.",
      "لا تستخدمها إذا لم يكن المجالان مرتبين؛ رتبهما أولًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "دمج مصفوفتين مرتبتين",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 3, 5};\n    std::vector<int> b{2, 4, 6};\n    std::vector<int> result(a.size() + b.size());\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return result[3];\n}",
        explanationArabic: "النتيجة مرتبة {1, 2, 3, 4, 5, 6}. merge أسرع من دمج يدوي ثم sort.",
        relatedTokens: ["std::merge", "std::vector", "size_t"]
      },
      {
        titleArabic: "دمج مع مقارنة مخصصة",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> a{5, 3, 1};\n    std::vector<int> b{6, 4, 2};\n    std::vector<int> result(6);\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin(), std::greater{});\n    return result[0];\n}",
        explanationArabic: "مع std::greater يتم الدمج بترتيب تنازلي. النتيجة {6, 5, 4, 3, 2, 1}.",
        relatedTokens: ["std::merge", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع دمج يدوي ثم sort",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 4};\n    std::vector<int> b{2, 3};\n    std::vector<int> result(a.size() + b.size());\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    // مقابل:\n    // std::vector<int> result2 = a;\n    // result2.insert(result2.end(), b.begin(), b.end());\n    // std::sort(result2.begin(), result2.end());\n    return result[2];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن merge تستغل الترتيب الموجود فتكون O(n+m) بينما الدمج ثم الترتيب O((n+m)log(n+m)).",
        relatedTokens: ["std::merge", "std::sort", "std::vector"]
      }
    ],
    followUps: ["std::sort", "std::set_union", "std::vector"]
  },
  "std::set_difference": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::set_difference تكتب العناصر الموجودة في المجال الأول وغير الموجودة في المجال الثاني. فائدتها في عمليات المجموعات مثل إزالة عناصر مجموعة من أخرى.",
    projectStepsArabic: [
      "استخدمها عند حساب الفرق بين مجموعتين مرتبتين.",
      "تأكد أن المجالين مرتبان بنفس المقارنة.",
      "تأكد أن المجال الهدف كبير كافي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "عناصر في الأولى وليست في الثانية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2, 3, 4};\n    std::vector<int> b{2, 4};\n    std::vector<int> result(a.size());\n    auto it = std::set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return static_cast<int>(it - result.begin());\n}",
        explanationArabic: "النتيجة {1, 3} لأنها موجودة في a وليست في b. الناتج مرتب تلقائيًا.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      },
      {
        titleArabic: "فرق فارغ",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2};\n    std::vector<int> b{1, 2};\n    std::vector<int> result(a.size());\n    auto it = std::set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return (it == result.begin()) ? 1 : 0;\n}",
        explanationArabic: "إذا كانت كل عناصر a موجودة في b يكون الفرق فارغًا.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      },
      {
        titleArabic: "استخدام مع مجموعات حقيقية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> all_ids{1, 2, 3, 4, 5};\n    std::vector<int> removed_ids{2, 5};\n    std::vector<int> active(all_ids.size());\n    auto it = std::set_difference(all_ids.begin(), all_ids.end(), removed_ids.begin(), removed_ids.end(), active.begin());\n    return static_cast<int>(it - active.begin());\n}",
        explanationArabic: "هذا مثال ذكي يوضح استخدامًا عمليًا: معرفة العناصر النشطة بعد إزالة المحذوفة. النتيجة {1, 3, 4}.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      }
    ],
    followUps: ["std::set_intersection", "std::merge", "std::set_symmetric_difference"]
  },
  "std::set_intersection": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::set_intersection تكتب العناصر الموجودة في كلا المجالين. فائدتها في عمليات المجموعات مثل إيجاد العناصر المشتركة.",
    projectStepsArabic: [
      "استخدمها عند حساب تقاطع مجموعتين مرتبتين.",
      "تأكد أن المجالين مرتبان بنفس المقارنة.",
      "تأكد أن المجال الهدف كبير كافي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "العناصر المشتركة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2, 3, 4};\n    std::vector<int> b{2, 4, 6};\n    std::vector<int> result(a.size() + b.size());\n    auto it = std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return static_cast<int>(it - result.begin());\n}",
        explanationArabic: "التقاطع هو {2, 4} لأنها موجودة في كلا المجموعتين.",
        relatedTokens: ["std::set_intersection", "std::vector", "auto"]
      },
      {
        titleArabic: "تقاطع فارغ",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 3};\n    std::vector<int> b{2, 4};\n    std::vector<int> result(4);\n    auto it = std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return (it == result.begin()) ? 1 : 0;\n}",
        explanationArabic: "لا توجد عناصر مشتركة فيكون التقاطع فارغًا.",
        relatedTokens: ["std::set_intersection", "std::vector", "auto"]
      },
      {
        titleArabic: "استخدام عملي: فلاتر الأذونات",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> required{1, 2, 3};\n    std::vector<int> user_has{2, 3, 4};\n    std::vector<int> granted(required.size());\n    auto it = std::set_intersection(required.begin(), required.end(), user_has.begin(), user_has.end(), granted.begin());\n    return static_cast<int>(it - granted.begin());\n}",
        explanationArabic: "هذا مثال ذكي يوضح استخدامًا عمليًا: إيجاد الأذونات المطلوبة التي يملكها المستخدم فعلاً. النتيجة {2, 3}.",
        relatedTokens: ["std::set_intersection", "std::set_difference", "std::vector", "auto"]
      }
    ],
    followUps: ["std::set_difference", "std::merge", "std::set_union"]
  },
  "std::next_permutation": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::next_permutation تحول المجال إلى التبديل التالي بترتيب معجمي. فائدةها الأشهر توليد كل التباديل الممكنة لمجموعة عناصر.",
    projectStepsArabic: [
      "استخدمها في حلقة لتوليد كل التباديل الممكنة.",
      "تُعيد false عندما تكون في آخر تبديل وتعود إلى الأول.",
      "يجب ترتيب المجال أولًا قبل البدء لضمان شمول كل التباديل."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "التالي في الترتيب المعجمي",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    std::next_permutation(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "بعد next_permutation تصبح {1, 3, 2}. الترتيب المعجمي التالي بعد {1, 2, 3}.",
        relatedTokens: ["std::next_permutation", "std::vector"]
      },
      {
        titleArabic: "توليد كل التباديل",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    int count = 0;\n    do {\n        ++count;\n    } while (std::next_permutation(values.begin(), values.end()));\n    return count;\n}",
        explanationArabic: "الحلقة تولّد كل التباديل الستة. next_permutation تعيد false عند العودة إلى الأول.",
        relatedTokens: ["std::next_permutation", "std::vector", "do"]
      },
      {
        titleArabic: "العودة إلى التبديل الأول",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 2, 1};\n    bool more = std::next_permutation(values.begin(), values.end());\n    return more ? 0 : values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن next_permutation تعيد false عندما تكون في آخر تبديل {3,2,1} وتُعيد المجال إلى الأول {1,2,3}.",
        relatedTokens: ["std::next_permutation", "std::vector", "bool"]
      }
    ],
    followUps: ["std::sort", "std::prev_permutation", "std::vector"]
  },
  "std::make_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::make_heap تحول مجالًا إلى كومة ثنائية. فائدتها أنها تُعد المجال لعمليات الكومة مثل إدراج وحذف العنصر الأكبر بكفاءة.",
    projectStepsArabic: [
      "استخدمها لتحضير مجال لعمليات الكومة.",
      "بعد make_heap يكون العنصر الأكبر في المقدمة.",
      "تأكد من استدعاء make_heap قبل push_heap أو pop_heap."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "بناء كومة من vector",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "بعد make_heap العنصر الأكبر (5) يكون في المقدمة. البنية الداخلية كومة ثنائية.",
        relatedTokens: ["std::make_heap", "std::vector"]
      },
      {
        titleArabic: "كومة عكسية لأصغر عنصر أولًا",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end(), std::greater{});\n    return values.front();\n}",
        explanationArabic: "مع std::greater تصبح كومة عكسية حيث الأصغر في المقدمة.",
        relatedTokens: ["std::make_heap", "std::vector"]
      },
      {
        titleArabic: "بناء ثم فرز الكومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    std::sort_heap(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن sort_heap تحول الكومة إلى مصفوفة مرتبة. هذا أسلوب فرز كامل: make_heap ثم sort_heap.",
        relatedTokens: ["std::make_heap", "std::sort_heap", "std::vector"]
      }
    ],
    followUps: ["std::push_heap", "std::pop_heap", "std::sort_heap", "std::priority_queue"]
  },
  "std::push_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::push_heap تُدرج العنصر الأخير في الكومة الموجودة. فائدتها أنها تحافظ على خاصية الكومة بعد إضافة عنصر جديد.",
    projectStepsArabic: [
      "أضف العنصر الجديد في نهاية المجال أولًا ثم استدعِ push_heap.",
      "تأكد أن المجال قبل العنصر الأخير هو كومة صالحة.",
      "لا تستخدمها وحدها بدون make_heap أولًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج عنصر في كومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3, 4};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(10);\n    std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "push_back تضيف العنصر ثم push_heap تعيد بناء خاصية الكومة. الأكبر يصبح 10.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "إدراج عدة عناصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(1); std::push_heap(values.begin(), values.end());\n    values.push_back(7); std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "كل إدراج يحافظ على خاصية الكومة. بعد إضافة 1 و7 يكون الأكبر هو 7.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "الترتيب مهم: push_back قبل push_heap",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(4);\n    // push_heap قبل push_back خطأ!\n    std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "هذا مثال ذكي يوضح الترتيب الصحيح: العنصر يجب أن يكون في نهاية المجال أولًا ثم push_heap تعيد ترتيب الكومة لتحتويه.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::pop_heap", "std::priority_queue"]
  },
  "std::pop_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::pop_heap تنقل العنصر الأكبر من المقدمة إلى نهاية المجال وتُعيد بناء الكومة. فائددةها في استخراج العنصر الأكبر مع الحفاظ على خاصية الكومة.",
    projectStepsArabic: [
      "استخدمها لاستخراج العنصر الأكبر من الكومة.",
      "بعد pop_heap العنصر الأكبر يكون في آخر المجال. استخدم pop_back للحذف الفعلي.",
      "تأكد أن المجال كومة صالحة قبل الاستدعاء."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "استخراج الأكبر من الكومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3, 1, 4};\n    std::make_heap(values.begin(), values.end());\n    std::pop_heap(values.begin(), values.end());\n    int max_val = values.back();\n    values.pop_back();\n    return max_val;\n}",
        explanationArabic: "pop_heap تنقل الأكبر (5) للنهاية. pop_back تحذفه. الكومة تبقى صالحة بدون 5.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "استخراج مرتب بالأولوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end());\n    int first = 0;\n    std::pop_heap(values.begin(), values.end()); first = values.back(); values.pop_back();\n    std::pop_heap(values.begin(), values.end()); values.pop_back();\n    return first;\n}",
        explanationArabic: "كل pop_heap تستخرج الأكبر بالترتيب: 5 ثم 4 ثم 3. هذا هو أساس priority_queue.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::vector", "std::priority_queue"]
      },
      {
        titleArabic: "فرز كامل عبر pop_heap متكرر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    for (int i = static_cast<int>(values.size()) - 1; i > 0; --i) {\n        std::pop_heap(values.begin(), values.begin() + i + 1);\n    }\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن تكرار pop_heap يفرز المجال تصاعديًا. هذا بالضبط ما تفعله sort_heap داخليًا.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::sort_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::push_heap", "std::sort_heap", "std::priority_queue"]
  },
  "std::sort_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::sort_heap تحول كومة إلى مصفوفة مرتبة تصاعديًا. فائدتها أنها تكمل سلسلة عمليات الكومة بتحويلها إلى نتيجة مرتبة نهائية.",
    projectStepsArabic: [
      "استخدمها بعد make_heap لتحويل الكومة إلى مصفوفة مرتبة.",
      "تعمل في المكان ولا تحتاج مجالًا آخر.",
      "بعد التنفيذ لا يكون المجال كومة صالحة بل مصفوفة مرتبة."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "فرز كومة إلى مصفوفة مرتبة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    std::sort_heap(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "بعد sort_heap تصبح {1, 2, 3, 4, 5}. الكومة تتحول إلى ترتيب تصاعدي.",
        relatedTokens: ["std::sort_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "كومة عكسية ثم فرز عكسي",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end(), std::greater{});\n    std::sort_heap(values.begin(), values.end(), std::greater{});\n    return values[0];\n}",
        explanationArabic: "مع std::greater يصبح الفرز تنازليًا. النتيجة {5, 4, 3, 2, 1}.",
        relatedTokens: ["std::sort_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع std::sort",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{5, 2, 4, 1, 3};\n    std::make_heap(a.begin(), a.end());\n    std::sort_heap(a.begin(), a.end());\n    std::vector<int> b{5, 2, 4, 1, 3};\n    std::sort(b.begin(), b.end());\n    return a[0] + b[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن كلاهما يُنتجان نفس النتيجة. std::sort عادة أسرع لكن سلسلة الكومة مفيدة إذا كانت البيانات كومة أصلًا.",
        relatedTokens: ["std::sort_heap", "std::sort", "std::make_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::pop_heap", "std::sort", "std::priority_queue"]
  }
};

// Add new elements
for (const [key, value] of Object.entries(newElements)) {
  if (!stdlibData.referenceGuides[key]) {
    stdlibData.referenceGuides[key] = value;
  }
}

fs.writeFileSync(stdlibFilePath, JSON.stringify(data, null, 2), 'utf-8');

// Count what was added
const existingBefore = Object.keys(newElements).filter(k => k in stdlibData.referenceGuides);
console.log(`Total elements in referenceGuides: ${Object.keys(stdlibData.referenceGuides).length}`);
console.log(`New elements added: ${Object.keys(newElements).length}`);        explanationArabic: "lambda تلتقط n بالمرجع وتعدّلها في كل استدعاء. النتيجة {15, 20, 25}.",
        relatedTokens: ["std::generate", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع fill",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a(3);\n    std::fill(a.begin(), a.end(), 5);\n    std::vector<int> b(3);\n    int n = 0;\n    std::generate(b.begin(), b.end(), [&n]() { return ++n; });\n    return a[0] + b[2];\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: fill تضع نفس القيمة في كل مكان. generate تستدعي دالة لكل عنصر فيمكن أن تنتج قيمًا مختلفة.",
        relatedTokens: ["std::generate", "std::fill", "std::vector"]
      }
    ],
    followUps: ["std::fill", "std::iota", "std::transform"]
  },
  "std::min": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::min تعيد أصغر قيمتين أو مجموعة قيم. فائدتها أنها تعبّر عن المقارنة بشكل أوضح من كتابة if يدوي.",
    projectStepsArabic: [
      "استخدمها عند مقارنة قيمتين أو أكثر واختيار الأصغر.",
      "مع initializer_list يمكن مقارنة أكثر من قيمتين.",
      "انتبه أن القيمتين يجب أن يكونا من نفس النوع."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أصغر قيمتين",
        code: "#include <algorithm>\n\nint main() {\n    int a = 10;\n    int b = 7;\n    return std::min(a, b);\n}",
        explanationArabic: "min تعيد الأصغر مباشرة. هذا أنظح من كتابة if (a < b) return a; else return b;.",
        relatedTokens: ["std::min"]
      },
      {
        titleArabic: "أصغر مجموعة قيم",
        code: "#include <algorithm>\n\nint main() {\n    return std::min({5, 2, 8, 1, 9});\n}",
        explanationArabic: "مع initializer_list يمكن مقارنة عدة قيم في استدعاء واحد.",
        relatedTokens: ["std::min", "std::initializer_list"]
      },
      {
        titleArabic: "استخدام مع مقارنة مخصصة",
        code: "#include <algorithm>\n\nint main() {\n    int a = 5;\n    int b = 10;\n    return std::min(a, b, [](int x, int y) { return x > y; });\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن min يمكن أن تعمل بعكس الاتجاه إذا مررت مقارنة مخصصة. هنا تعيد الأكبر بدل الأصغر.",
        relatedTokens: ["std::min", "std::max"]
      }
    ],
    followUps: ["std::max", "std::clamp", "std::minmax"]
  },
  "std::max": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::max تعيد أكبر قيمتين أو مجموعة قيم. فائدتها أنها تعبّر عن المقارنة بشكل أوضح من كتابة if يدوي.",
    projectStepsArabic: [
      "استخدمها عند مقارنة قيمتين أو أكثر واختيار الأكبر.",
      "مع initializer_list يمكن مقارنة أكثر من قيمتين.",
      "انتبه أن القيمتين يجب أن يكونا من نفس النوع."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أكبر قيمتين",
        code: "#include <algorithm>\n\nint main() {\n    int a = 3;\n    int b = 8;\n    return std::max(a, b);\n}",
        explanationArabic: "max تعيد الأكبر مباشرة. هذا أنظح من كتابة if (a > b) return a; else return b;.",
        relatedTokens: ["std::max"]
      },
      {
        titleArabic: "أكبر مجموعة قيم",
        code: "#include <algorithm>\n\nint main() {\n    return std::max({3, 7, 1, 9, 4});\n}",
        explanationArabic: "مع initializer_list يمكن مقارنة عدة قيم في استدعاء واحد.",
        relatedTokens: ["std::max", "std::initializer_list"]
      },
      {
        titleArabic: "استخدام مع مقارنة مخصصة",
        code: "#include <algorithm>\n\nint main() {\n    int a = 5;\n    int b = 10;\n    return std::max(a, b, [](int x, int y) { return x < y; });\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن المقارنة المخصصة تعطيك مرونة. مع مقارنة عادية تعيد الأكبر كما هو متوقع.",
        relatedTokens: ["std::max", "std::min"]
      }
    ],
    followUps: ["std::min", "std::clamp", "std::minmax"]
  },
  "std::minmax": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::minmax تعيد الأصغر والأكبر معًا في زوج واحد. فائدتها أنها تجنب مقارنتين منفصلتين عند الحاجة لكلا القيمتين.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج الأصغر والأكبر في نفس الوقت.",
      "النتيجة زوج حيث first هو الأصغر وsecond هو الأكبر.",
      "لا تستخدمها إذا كنت تحتاج قيمة واحدة فقط؛ استخدم min أو max."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أصغر وأكبر قيمتين",
        code: "#include <algorithm>\n#include <utility>\n\nint main() {\n    auto [lo, hi] = std::minmax(3, 8);\n    return lo + hi;\n}",
        explanationArabic: "minmax تعيد زوجًا: lo = 3 وhi = 8. structured binding تفكك الزوج إلى متغيرين.",
        relatedTokens: ["std::minmax", "auto"]
      },
      {
        titleArabic: "أصغر وأكبر مجموعة",
        code: "#include <algorithm>\n\nint main() {\n    auto [lo, hi] = std::minmax({5, 1, 9, 3});\n    return lo + hi;\n}",
        explanationArabic: "مع initializer_list تفحص كل القيم وتعيد الأصغر والأكبر.",
        relatedTokens: ["std::minmax", "std::initializer_list", "auto"]
      },
      {
        titleArabic: "الفرق عن استدعاء min وmax منفصلين",
        code: "#include <algorithm>\n\nint main() {\n    auto [lo, hi] = std::minmax(5, 10);\n    // مقابل:\n    // int lo = std::min(5, 10);\n    // int hi = std::max(5, 10);\n    return lo + hi;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفائدة: minmax تفحص مرة واحدة بدل مرتين. الفرق يظهر مع المجموعات الكبيرة.",
        relatedTokens: ["std::minmax", "std::min", "std::max", "auto"]
      }
    ],
    followUps: ["std::min", "std::max", "std::clamp"]
  },
  "std::clamp": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::clamp تقيد القيمة بين حد أدنى وأعلى. فائدتها أنها تعبّر عن فكرة التقييد بشكل أوضح من كتابة if متعددة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج تقييد قيمة ضمن نطاق معين.",
      "المعاملات بالترتيب: القيمة، الحد الأدنى، الحد الأعلى.",
      "تأكد أن الحد الأدنى لا يتجاوز الحد الأعلى وإلا السلوك غير معرّف."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تقييد قيمة ضمن نطاق",
        code: "#include <algorithm>\n\nint main() {\n    int value = 15;\n    int result = std::clamp(value, 0, 10);\n    return result;\n}",
        explanationArabic: "15 أكبر من 10 لذلك النتيجة 10. clamp تضمن أن القيمة تبقى داخل النطاق.",
        relatedTokens: ["std::clamp"]
      },
      {
        titleArabic: "قيمة أصغر من الحد الأدنى",
        code: "#include <algorithm>\n\nint main() {\n    int value = -5;\n    int result = std::clamp(value, 0, 100);\n    return result;\n}",
        explanationArabic: "-5 أصغر من 0 لذلك النتيجة 0. clamp تضبط القيمة إلى أقرب حد.",
        relatedTokens: ["std::clamp"]
      },
      {
        titleArabic: "المقارنة مع if يدوية",
        code: "#include <algorithm>\n\nint main() {\n    int value = 50;\n    // بدل:\n    // int result = value < 0 ? 0 : (value > 100 ? 100 : value);\n    int result = std::clamp(value, 0, 100);\n    return result;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن clamp تعبّر عن النية بوضوح بدل ternary متداخل قد يربك القراءة.",
        relatedTokens: ["std::clamp", "std::min", "std::max"]
      }
    ],
    followUps: ["std::min", "std::max", "std::minmax"]
  },
  "std::swap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::swap تتبادل قيمتين. فائدتها أنها تعبّر عن النية بوضوح وتستخدم النقل الفعال عند دعمه.",
    projectStepsArabic: [
      "استخدمها عند الحاجة لتبادل قيمتين بدل المتغير المؤقت اليدوي.",
      "مع C++11 تستخدم النقل الفعال عندما يدعمه النوع.",
      "لا تكتب التبادل يدويًا باستخدام متغير مؤقت؛ استخدم swap بدلًا منه."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "تبادل قيمتين",
        code: "#include <utility>\n\nint main() {\n    int a = 10;\n    int b = 20;\n    std::swap(a, b);\n    return a;\n}",
        explanationArabic: "بعد swap تصبح a = 20 وb = 10. هذا أنظح من كتابة المتغير المؤقت يدويًا.",
        relatedTokens: ["std::swap"]
      },
      {
        titleArabic: "تبادل سلاسل نصية",
        code: "#include <string>\n#include <utility>\n\nint main() {\n    std::string a = \"first\";\n    std::string b = \"second\";\n    std::swap(a, b);\n    return static_cast<int>(a.size());\n}",
        explanationArabic: "مع الأنواع التي تدعم النقل مثل string يكون التبادل فعّالًا لأنه يتبادل المؤشرات الداخلية لا ينسخ المحتوى.",
        relatedTokens: ["std::swap", "std::string"]
      },
      {
        titleArabic: "المقارنة مع التبادل اليدوي",
        code: "#include <utility>\n\nint main() {\n    int a = 1;\n    int b = 2;\n    // بدل:\n    // int temp = a; a = b; b = temp;\n    std::swap(a, b);\n    return a;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن swap تعبّر عن النية بشكل أوضح وتستخدم أفضل آلية متاحة للنوع.",
        relatedTokens: ["std::swap", "std::move"]
      }
    ],
    followUps: ["std::move", "std::reverse", "std::iter_swap"]
  },
  "std::lower_bound": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::lower_bound تبحث عن أول موضع يمكن إدراج قيمة فيه مع الحفاظ على الترتيب. فائدتها أنها تستخدم البحث الثنائي فتكون أسرع من البحث الخطي في المجالات المرتبة.",
    projectStepsArabic: [
      "استخدمها في مجالات مرتبة فقط. السلوك غير معرّف إذا لم يكن المرتب.",
      "تُعيد مكررًا إلى أول عنصر لا يقل عن القيمة المطلوبة.",
      "قارن النتيجة مع end لمعرفة هل وُجدت القيمة أو لا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "البحث عن موضع الإدراج",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    auto it = std::lower_bound(values.begin(), values.end(), 5);\n    return *it;\n}",
        explanationArabic: "lower_bound تُعيد مكررًا إلى 5 لأنها موجودة. البحث ثنائي فأسرع من البحث الخطي.",
        relatedTokens: ["std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "قيمة غير موجودة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7};\n    auto it = std::lower_bound(values.begin(), values.end(), 4);\n    return *it;\n}",
        explanationArabic: "4 غير موجودة لكن lower_bound تُعيد موضع 5 لأنه أول عنصر لا يقل عن 4. هذا يوضح معنى \"أول موضع صالح للإدراج\".",
        relatedTokens: ["std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "الفرق عن find",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    auto lb = std::lower_bound(values.begin(), values.end(), 6);\n    auto fi = std::find(values.begin(), values.end(), 6);\n    return (*lb == 7 && fi == values.end()) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الفرق: lower_bound أسرع لكنها تتطلب ترتيبًا وتُعيد موضعًا منطقيًا. find أبطأ لكنها لا تحتاج ترتيبًا وتُعيد التطابق الدقيق فقط.",
        relatedTokens: ["std::lower_bound", "std::find", "std::vector", "auto"]
      }
    ],
    followUps: ["std::upper_bound", "std::binary_search", "std::equal_range"]
  },
  "std::upper_bound": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::upper_bound تبحث عن أول موضع بعد آخر عنصر يساوي القيمة. فائدتها أنها مع lower_bound تحددان مجال كل العناصر المساوية للقيمة المطلوبة.",
    projectStepsArabic: [
      "استخدمها في مجالات مرتبة فقط.",
      "تُعيد مكررًا إلى أول عنصر أكبر من القيمة المطلوبة.",
      "الفرق عن lower_bound أنها تتجاوز كل العناصر المساوية."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "أول عنصر أكبر من القيمة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 3, 3, 5};\n    auto it = std::upper_bound(values.begin(), values.end(), 3);\n    return *it;\n}",
        explanationArabic: "upper_bound تتجاوز كل 3s وتُعيد مكررًا إلى 5. هذا يختلف عن lower_bound التي تُعيد أول 3.",
        relatedTokens: ["std::upper_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "عدّ التكرارات مع lower_bound",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 2, 3};\n    auto lo = std::lower_bound(values.begin(), values.end(), 2);\n    auto hi = std::upper_bound(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "الفرق بين upper_bound وlower_bound يعطي عدد التكرارات. هنا 3 نسخ من 2.",
        relatedTokens: ["std::upper_bound", "std::lower_bound", "std::vector", "auto"]
      },
      {
        titleArabic: "قيمة أكبر من كل العناصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5};\n    auto it = std::upper_bound(values.begin(), values.end(), 10);\n    return (it == values.end()) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن upper_bound قد تُعيد end إذا كانت القيمة أكبر من كل العناصر.",
        relatedTokens: ["std::upper_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::equal_range", "std::binary_search"]
  },
  "std::binary_search": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::binary_search تفحص وجود قيمة في مجال مرتب باستخدام البحث الثنائي. فائدتها أنها أسرع من البحث الخطي لكنها تعيد bool فقط لا الموضع.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج معرفة الوجود فقط في مجال مرتب.",
      "تُعيد bool لا مكررًا لذلك لا تستخدمها إذا كنت تحتاج الموضع.",
      "السلوك غير معرّف إذا لم يكن المجال مرتبًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "فحص وجود قيمة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    bool found = std::binary_search(values.begin(), values.end(), 5);\n    return found ? 1 : 0;\n}",
        explanationArabic: "binary_search تعيد true لأن 5 موجودة. البحث ثنائي فأسرع من find في المجالات الكبيرة.",
        relatedTokens: ["std::binary_search", "std::vector", "bool"]
      },
      {
        titleArabic: "قيمة غير موجودة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7};\n    bool found = std::binary_search(values.begin(), values.end(), 4);\n    return found ? 1 : 0;\n}",
        explanationArabic: "4 غير موجودة فتعيد false. لا تُوجد طريقة لمعرفة أين كانت ستكون عبر binary_search.",
        relatedTokens: ["std::binary_search", "std::vector", "bool"]
      },
      {
        titleArabic: "متى تحتاج lower_bound بدلها",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5, 7, 9};\n    bool exists = std::binary_search(values.begin(), values.end(), 5);\n    auto pos = std::lower_bound(values.begin(), values.end(), 5);\n    return exists && (*pos == 5) ? 1 : 0;\n}",
        explanationArabic: "هذا مثال ذكي يوضح الحد: binary_search تعطيك الوجود فقط. إذا احتجت الموضع فاستخدم lower_bound.",
        relatedTokens: ["std::binary_search", "std::lower_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::upper_bound", "std::find"]
  },
  "std::equal_range": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::equal_range تجمع lower_bound وupper_bound في استدعاء واحد. فائدتها أنها تعيد مجالًا يحتوي كل العناصر المساوية للقيمة المطلوبة.",
    projectStepsArabic: [
      "استخدمها عندما تحتاج مجال كل التكرارات لعنصر في مجال مرتب.",
      "تُعيد زوج مكررات: الأول هو lower_bound والثاني هو upper_bound.",
      "الفرق بينهما يعطي عدد التكرارات."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "مجال التكرارات لعنصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 2, 3};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "equal_range تعيد مجالًا يحتوي كل 2s. الفرق بين hi وlo يعطي 3 تكرارات.",
        relatedTokens: ["std::equal_range", "std::vector", "auto"]
      },
      {
        titleArabic: "عنصر غير موجود",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 3, 5};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 4);\n    return (lo == hi) ? 1 : 0;\n}",
        explanationArabic: "إذا لم تكن القيمة موجودة يكون lo == hi والمجال فارغًا.",
        relatedTokens: ["std::equal_range", "std::vector", "auto"]
      },
      {
        titleArabic: "المقارنة مع lower_bound + upper_bound منفصلين",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 2, 3};\n    auto [lo, hi] = std::equal_range(values.begin(), values.end(), 2);\n    // مقابل:\n    // auto lo = std::lower_bound(values.begin(), values.end(), 2);\n    // auto hi = std::upper_bound(values.begin(), values.end(), 2);\n    return static_cast<int>(hi - lo);\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن equal_range توفر استدعاءين منفصلين وتجعل النية أوضح: أريد مجال كل التكرارات.",
        relatedTokens: ["std::equal_range", "std::lower_bound", "std::upper_bound", "std::vector", "auto"]
      }
    ],
    followUps: ["std::lower_bound", "std::upper_bound", "std::binary_search"]
  },
  "std::merge": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::merge تدمج مجالين مرتبين في مجال ثالث مرتب. فائدتها أنها أسرع من دمج ثم ترتيب لأنها تستغل أن المجالين مرتبين أصلًا.",
    projectStepsArabic: [
      "استخدمها عند دمج مجالين مرتبين مع الحفاظ على الترتيب.",
      "تأكد أن المجال الهدف كبير كافي لاستيعاب كل العناصر.",
      "لا تستخدمها إذا لم يكن المجالان مرتبين؛ رتبهما أولًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "دمج مصفوفتين مرتبتين",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 3, 5};\n    std::vector<int> b{2, 4, 6};\n    std::vector<int> result(a.size() + b.size());\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return result[3];\n}",
        explanationArabic: "النتيجة مرتبة {1, 2, 3, 4, 5, 6}. merge أسرع من دمج يدوي ثم sort.",
        relatedTokens: ["std::merge", "std::vector", "size_t"]
      },
      {
        titleArabic: "دمج مع مقارنة مخصصة",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> a{5, 3, 1};\n    std::vector<int> b{6, 4, 2};\n    std::vector<int> result(6);\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin(), std::greater{});\n    return result[0];\n}",
        explanationArabic: "مع std::greater يتم الدمج بترتيب تنازلي. النتيجة {6, 5, 4, 3, 2, 1}.",
        relatedTokens: ["std::merge", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع دمج يدوي ثم sort",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 4};\n    std::vector<int> b{2, 3};\n    std::vector<int> result(a.size() + b.size());\n    std::merge(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    // مقابل:\n    // std::vector<int> result2 = a;\n    // result2.insert(result2.end(), b.begin(), b.end());\n    // std::sort(result2.begin(), result2.end());\n    return result[2];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن merge تستغل الترتيب الموجود فتكون O(n+m) بينما الدمج ثم الترتيب O((n+m)log(n+m)).",
        relatedTokens: ["std::merge", "std::sort", "std::vector"]
      }
    ],
    followUps: ["std::sort", "std::set_union", "std::vector"]
  },
  "std::set_difference": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::set_difference تكتب العناصر الموجودة في المجال الأول وغير الموجودة في المجال الثاني. فائدتها في عمليات المجموعات مثل إزالة عناصر مجموعة من أخرى.",
    projectStepsArabic: [
      "استخدمها عند حساب الفرق بين مجموعتين مرتبتين.",
      "تأكد أن المجالين مرتبان بنفس المقارنة.",
      "تأكد أن المجال الهدف كبير كافي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "عناصر في الأولى وليست في الثانية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2, 3, 4};\n    std::vector<int> b{2, 4};\n    std::vector<int> result(a.size());\n    auto it = std::set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return static_cast<int>(it - result.begin());\n}",
        explanationArabic: "النتيجة {1, 3} لأنها موجودة في a وليست في b. الناتج مرتب تلقائيًا.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      },
      {
        titleArabic: "فرق فارغ",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2};\n    std::vector<int> b{1, 2};\n    std::vector<int> result(a.size());\n    auto it = std::set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return (it == result.begin()) ? 1 : 0;\n}",
        explanationArabic: "إذا كانت كل عناصر a موجودة في b يكون الفرق فارغًا.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      },
      {
        titleArabic: "استخدام مع مجموعات حقيقية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> all_ids{1, 2, 3, 4, 5};\n    std::vector<int> removed_ids{2, 5};\n    std::vector<int> active(all_ids.size());\n    auto it = std::set_difference(all_ids.begin(), all_ids.end(), removed_ids.begin(), removed_ids.end(), active.begin());\n    return static_cast<int>(it - active.begin());\n}",
        explanationArabic: "هذا مثال ذكي يوضح استخدامًا عمليًا: معرفة العناصر النشطة بعد إزالة المحذوفة. النتيجة {1, 3, 4}.",
        relatedTokens: ["std::set_difference", "std::vector", "auto"]
      }
    ],
    followUps: ["std::set_intersection", "std::merge", "std::set_symmetric_difference"]
  },
  "std::set_intersection": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::set_intersection تكتب العناصر الموجودة في كلا المجالين. فائدتها في عمليات المجموعات مثل إيجاد العناصر المشتركة.",
    projectStepsArabic: [
      "استخدمها عند حساب تقاطع مجموعتين مرتبتين.",
      "تأكد أن المجالين مرتبان بنفس المقارنة.",
      "تأكد أن المجال الهدف كبير كافي."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "العناصر المشتركة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 2, 3, 4};\n    std::vector<int> b{2, 4, 6};\n    std::vector<int> result(a.size() + b.size());\n    auto it = std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return static_cast<int>(it - result.begin());\n}",
        explanationArabic: "التقاطع هو {2, 4} لأنها موجودة في كلا المجموعتين.",
        relatedTokens: ["std::set_intersection", "std::vector", "auto"]
      },
      {
        titleArabic: "تقاطع فارغ",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{1, 3};\n    std::vector<int> b{2, 4};\n    std::vector<int> result(4);\n    auto it = std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());\n    return (it == result.begin()) ? 1 : 0;\n}",
        explanationArabic: "لا توجد عناصر مشتركة فيكون التقاطع فارغًا.",
        relatedTokens: ["std::set_intersection", "std::vector", "auto"]
      },
      {
        titleArabic: "استخدام عملي: فلاتر الأذونات",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> required{1, 2, 3};\n    std::vector<int> user_has{2, 3, 4};\n    std::vector<int> granted(required.size());\n    auto it = std::set_intersection(required.begin(), required.end(), user_has.begin(), user_has.end(), granted.begin());\n    return static_cast<int>(it - granted.begin());\n}",
        explanationArabic: "هذا مثال ذكي يوضح استخدامًا عمليًا: إيجاد الأذونات المطلوبة التي يملكها المستخدم فعلاً. النتيجة {2, 3}.",
        relatedTokens: ["std::set_intersection", "std::set_difference", "std::vector", "auto"]
      }
    ],
    followUps: ["std::set_difference", "std::merge", "std::set_union"]
  },
  "std::next_permutation": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::next_permutation تحول المجال إلى التبديل التالي بترتيب معجمي. فائدةها الأشهر توليد كل التباديل الممكنة لمجموعة عناصر.",
    projectStepsArabic: [
      "استخدمها في حلقة لتوليد كل التباديل الممكنة.",
      "تُعيد false عندما تكون في آخر تبديل وتعود إلى الأول.",
      "يجب ترتيب المجال أولًا قبل البدء لضمان شمول كل التباديل."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "التالي في الترتيب المعجمي",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    std::next_permutation(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "بعد next_permutation تصبح {1, 3, 2}. الترتيب المعجمي التالي بعد {1, 2, 3}.",
        relatedTokens: ["std::next_permutation", "std::vector"]
      },
      {
        titleArabic: "توليد كل التباديل",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{1, 2, 3};\n    int count = 0;\n    do {\n        ++count;\n    } while (std::next_permutation(values.begin(), values.end()));\n    return count;\n}",
        explanationArabic: "الحلقة تولّد كل التباديل الستة. next_permutation تعيد false عند العودة إلى الأول.",
        relatedTokens: ["std::next_permutation", "std::vector", "do"]
      },
      {
        titleArabic: "العودة إلى التبديل الأول",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 2, 1};\n    bool more = std::next_permutation(values.begin(), values.end());\n    return more ? 0 : values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن next_permutation تعيد false عندما تكون في آخر تبديل {3,2,1} وتُعيد المجال إلى الأول {1,2,3}.",
        relatedTokens: ["std::next_permutation", "std::vector", "bool"]
      }
    ],
    followUps: ["std::sort", "std::prev_permutation", "std::vector"]
  },
  "std::make_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::make_heap تحول مجالًا إلى كومة ثنائية. فائدتها أنها تُعد المجال لعمليات الكومة مثل إدراج وحذف العنصر الأكبر بكفاءة.",
    projectStepsArabic: [
      "استخدمها لتحضير مجال لعمليات الكومة.",
      "بعد make_heap يكون العنصر الأكبر في المقدمة.",
      "تأكد من استدعاء make_heap قبل push_heap أو pop_heap."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "بناء كومة من vector",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "بعد make_heap العنصر الأكبر (5) يكون في المقدمة. البنية الداخلية كومة ثنائية.",
        relatedTokens: ["std::make_heap", "std::vector"]
      },
      {
        titleArabic: "كومة عكسية لأصغر عنصر أولًا",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end(), std::greater{});\n    return values.front();\n}",
        explanationArabic: "مع std::greater تصبح كومة عكسية حيث الأصغر في المقدمة.",
        relatedTokens: ["std::make_heap", "std::vector"]
      },
      {
        titleArabic: "بناء ثم فرز الكومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    std::sort_heap(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن sort_heap تحول الكومة إلى مصفوفة مرتبة. هذا أسلوب فرز كامل: make_heap ثم sort_heap.",
        relatedTokens: ["std::make_heap", "std::sort_heap", "std::vector"]
      }
    ],
    followUps: ["std::push_heap", "std::pop_heap", "std::sort_heap", "std::priority_queue"]
  },
  "std::push_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::push_heap تُدرج العنصر الأخير في الكومة الموجودة. فائدتها أنها تحافظ على خاصية الكومة بعد إضافة عنصر جديد.",
    projectStepsArabic: [
      "أضف العنصر الجديد في نهاية المجال أولًا ثم استدعِ push_heap.",
      "تأكد أن المجال قبل العنصر الأخير هو كومة صالحة.",
      "لا تستخدمها وحدها بدون make_heap أولًا."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "إدراج عنصر في كومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3, 4};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(10);\n    std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "push_back تضيف العنصر ثم push_heap تعيد بناء خاصية الكومة. الأكبر يصبح 10.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "إدراج عدة عناصر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(1); std::push_heap(values.begin(), values.end());\n    values.push_back(7); std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "كل إدراج يحافظ على خاصية الكومة. بعد إضافة 1 و7 يكون الأكبر هو 7.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "الترتيب مهم: push_back قبل push_heap",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3};\n    std::make_heap(values.begin(), values.end());\n    values.push_back(4);\n    // push_heap قبل push_back خطأ!\n    std::push_heap(values.begin(), values.end());\n    return values.front();\n}",
        explanationArabic: "هذا مثال ذكي يوضح الترتيب الصحيح: العنصر يجب أن يكون في نهاية المجال أولًا ثم push_heap تعيد ترتيب الكومة لتحتويه.",
        relatedTokens: ["std::push_heap", "std::make_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::pop_heap", "std::priority_queue"]
  },
  "std::pop_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::pop_heap تنقل العنصر الأكبر من المقدمة إلى نهاية المجال وتُعيد بناء الكومة. فائددةها في استخراج العنصر الأكبر مع الحفاظ على خاصية الكومة.",
    projectStepsArabic: [
      "استخدمها لاستخراج العنصر الأكبر من الكومة.",
      "بعد pop_heap العنصر الأكبر يكون في آخر المجال. استخدم pop_back للحذف الفعلي.",
      "تأكد أن المجال كومة صالحة قبل الاستدعاء."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "استخراج الأكبر من الكومة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 3, 1, 4};\n    std::make_heap(values.begin(), values.end());\n    std::pop_heap(values.begin(), values.end());\n    int max_val = values.back();\n    values.pop_back();\n    return max_val;\n}",
        explanationArabic: "pop_heap تنقل الأكبر (5) للنهاية. pop_back تحذفه. الكومة تبقى صالحة بدون 5.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "استخراج مرتب بالأولوية",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{3, 1, 4, 1, 5};\n    std::make_heap(values.begin(), values.end());\n    int first = 0;\n    std::pop_heap(values.begin(), values.end()); first = values.back(); values.pop_back();\n    std::pop_heap(values.begin(), values.end()); values.pop_back();\n    return first;\n}",
        explanationArabic: "كل pop_heap تستخرج الأكبر بالترتيب: 5 ثم 4 ثم 3. هذا هو أساس priority_queue.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::vector", "std::priority_queue"]
      },
      {
        titleArabic: "فرز كامل عبر pop_heap متكرر",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    for (int i = static_cast<int>(values.size()) - 1; i > 0; --i) {\n        std::pop_heap(values.begin(), values.begin() + i + 1);\n    }\n    return values[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن تكرار pop_heap يفرز المجال تصاعديًا. هذا بالضبط ما تفعله sort_heap داخليًا.",
        relatedTokens: ["std::pop_heap", "std::make_heap", "std::sort_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::push_heap", "std::sort_heap", "std::priority_queue"]
  },
  "std::sort_heap": {
    fullProjectNoteArabic: "في برنامج C++ مستقل، std::sort_heap تحول كومة إلى مصفوفة مرتبة تصاعديًا. فائدتها أنها تكمل سلسلة عمليات الكومة بتحويلها إلى نتيجة مرتبة نهائية.",
    projectStepsArabic: [
      "استخدمها بعد make_heap لتحويل الكومة إلى مصفوفة مرتبة.",
      "تعمل في المكان ولا تحتاج مجالًا آخر.",
      "بعد التنفيذ لا يكون المجال كومة صالحة بل مصفوفة مرتبة."
    ],
    standaloneExamplesArabic: [
      {
        titleArabic: "فرز كومة إلى مصفوفة مرتبة",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end());\n    std::sort_heap(values.begin(), values.end());\n    return values[0];\n}",
        explanationArabic: "بعد sort_heap تصبح {1, 2, 3, 4, 5}. الكومة تتحول إلى ترتيب تصاعدي.",
        relatedTokens: ["std::sort_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "كومة عكسية ثم فرز عكسي",
        code: "#include <algorithm>\n#include <vector>\n#include <functional>\n\nint main() {\n    std::vector<int> values{5, 2, 4, 1, 3};\n    std::make_heap(values.begin(), values.end(), std::greater{});\n    std::sort_heap(values.begin(), values.end(), std::greater{});\n    return values[0];\n}",
        explanationArabic: "مع std::greater يصبح الفرز تنازليًا. النتيجة {5, 4, 3, 2, 1}.",
        relatedTokens: ["std::sort_heap", "std::make_heap", "std::vector"]
      },
      {
        titleArabic: "المقارنة مع std::sort",
        code: "#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> a{5, 2, 4, 1, 3};\n    std::make_heap(a.begin(), a.end());\n    std::sort_heap(a.begin(), a.end());\n    std::vector<int> b{5, 2, 4, 1, 3};\n    std::sort(b.begin(), b.end());\n    return a[0] + b[0];\n}",
        explanationArabic: "هذا مثال ذكي يوضح أن كلاهما يُنتجان نفس النتيجة. std::sort عادة أسرع لكن سلسلة الكومة مفيدة إذا كانت البيانات كومة أصلًا.",
        relatedTokens: ["std::sort_heap", "std::sort", "std::make_heap", "std::vector"]
      }
    ],
    followUps: ["std::make_heap", "std::pop_heap", "std::sort", "std::priority_queue"]
  }
};

// Add new elements
for (const [key, value] of Object.entries(newElements)) {
  if (!stdlibData.referenceGuides[key]) {
    stdlibData.referenceGuides[key] = value;
  }
}

fs.writeFileSync(stdlibFilePath, JSON.stringify(data, null, 2), 'utf-8');

// Count what was added
const existingBefore = Object.keys(newElements).filter(k => k in stdlibData.referenceGuides);
console.log(`Total elements in referenceGuides: ${Object.keys(stdlibData.referenceGuides).length}`);
