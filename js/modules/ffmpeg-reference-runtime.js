(function(global) {
  'use strict';

  const FFMPEG_REFERENCE_DATA = Object.freeze({
    meta: Object.freeze({
      title: 'FFmpeg',
      kicker: 'الصوت والفيديو والمرشحات',
      description: 'مرجع عربي محلي تمهيدي لمكتبات FFmpeg الأساسية بنفس روح فهارس المشروع: تقسيم واضح، معنى عملي، وروابط مباشرة إلى Doxygen الرسمي.',
      summaryNote: 'يركز هذا المسار على النواة العملية الأكثر استخدامًا: القراءة، الترميز، الفلاتر، والهياكل المشتركة.',
      statusNote: 'هذه مرحلة تأسيسية أولى قابلة للتوسيع تدريجيًا من Doxygen الرسمي دون إعادة بناء الواجهة.',
      officialUrl: 'https://www.ffmpeg.org/doxygen/trunk/index.html',
      references: Object.freeze([
        Object.freeze({label: 'FFmpeg Doxygen', href: 'https://www.ffmpeg.org/doxygen/trunk/index.html'}),
        Object.freeze({label: 'libavcodec', href: 'https://ffmpeg.org/doxygen/trunk/group__libavc.html'}),
        Object.freeze({label: 'libavformat', href: 'https://ffmpeg.org/doxygen/trunk/group__libavf.html'}),
        Object.freeze({label: 'libavfilter', href: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html'}),
        Object.freeze({label: 'libavutil', href: 'https://ffmpeg.org/doxygen/trunk/group__lavu.html'})
      ])
    }),
    featuredTokens: Object.freeze([
      'avformat_open_input',
      'av_read_frame',
      'avcodec_send_packet',
      'avcodec_receive_frame',
      'AVFrame'
    ]),
    sections: Object.freeze([
      Object.freeze({
        key: 'libavcodec',
        title: 'libavcodec',
        description: 'مكتبة الترميز وفك الترميز: تهيئة الـ codec context، تغذية الحزم، واستلام الإطارات أو الحزم الناتجة.',
        iconType: 'command',
        sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__libavc.html',
        items: Object.freeze([
          Object.freeze({
            name: 'avcodec_send_packet',
            displayName: 'avcodec_send_packet',
            kind: 'function',
            subsection: 'فك الترميز',
            description: 'تدفع حزمة مضغوطة إلى decoder بعد فتح AVCodecContext المناسب.',
            practicalMeaning: 'هذه هي نقطة دخول بيانات الفيديو أو الصوت المضغوطة إلى libavcodec. أنت لا تفك الترميز هنا مباشرة، بل تضع البيانات في طابور decoder ليعالجها وفق حالته الداخلية.',
            whyUse: 'تستخدم عندما تقرأ AVPacket من demuxer وتريد بدء تحويله إلى AVFrame.',
            actualBehavior: 'قد لا تعيد إطارًا فورًا. أحيانًا تحتاج إلى عدة حزم قبل أن يصبح decoder قادرًا على إخراج frame صالح.',
            benefit: 'تفصل مرحلة إدخال الحزم عن مرحلة استلام الإطارات، وهذا يسهل التعامل مع buffering الداخلي وإطارات B-frame.',
            example: "if (avcodec_send_packet(codec_ctx, packet) < 0) {\n  // فشل تمرير الحزمة إلى decoder\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavc__decoding.html'
          }),
          Object.freeze({
            name: 'avcodec_receive_frame',
            displayName: 'avcodec_receive_frame',
            kind: 'function',
            subsection: 'فك الترميز',
            description: 'تحاول سحب AVFrame مفكوك الترميز من AVCodecContext بعد تمرير الحزم إليه.',
            practicalMeaning: 'هذه هي اللحظة التي تحصل فيها على بيانات خام يمكن عرضها أو معالجتها أو تحويلها، مثل صورة YUV أو عينات صوت غير مضغوطة.',
            whyUse: 'تستدعيها بعد avcodec_send_packet ضمن حلقة حتى تتوقف بـ EAGAIN أو EOF.',
            actualBehavior: 'قد تعيد أكثر من frame من حزمة واحدة، أو لا تعيد شيئًا بعد أول send_packet بحسب الـ codec وحالته.',
            benefit: 'تعطيك واجهة موحدة للتعامل مع كل decoders الحديثة بدل APIs القديمة المعتمدة على استدعاء واحد.',
            example: "while (avcodec_receive_frame(codec_ctx, frame) == 0) {\n  // frame جاهز للاستخدام\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavc__decoding.html'
          }),
          Object.freeze({
            name: 'avcodec_send_frame',
            displayName: 'avcodec_send_frame',
            kind: 'function',
            subsection: 'الترميز',
            description: 'تدفع AVFrame خامًا إلى encoder ليحوّله إلى بيانات مضغوطة.',
            practicalMeaning: 'هذه الدالة هي مدخل الإطارات الخام إلى الترميز. بدل كتابة codec-specific API، تمرر frame موحدًا يحوي الصورة أو الصوت المراد ضغطه.',
            whyUse: 'تستخدم عندما تكون قد جهزت AVFrame بالبيانات الخام وتريد إنتاج AVPacket مضغوط مثل H.264 أو AAC.',
            actualBehavior: 'لا تضمن حزمة فورية بعد كل frame لأن encoder قد يحتفظ بإطارات داخليًا قبل الإخراج.',
            benefit: 'تجعل مسار الترميز مماثلًا لمسار فك الترميز: send ثم receive، ما يبسط دورة المعالجة.',
            example: "if (avcodec_send_frame(codec_ctx, frame) < 0) {\n  // فشل تمرير الإطار إلى encoder\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavc__encoding.html'
          }),
          Object.freeze({
            name: 'avcodec_receive_packet',
            displayName: 'avcodec_receive_packet',
            kind: 'function',
            subsection: 'الترميز',
            description: 'تسحب AVPacket مضغوطًا من encoder بعد تمرير AVFrame إليه.',
            practicalMeaning: 'هذا هو الناتج المضغوط الفعلي الذي يمكنك كتابته في muxer أو إرساله عبر الشبكة أو حفظه في ملف.',
            whyUse: 'تستدعيها بعد avcodec_send_frame داخل حلقة حتى يتوقف encoder عن إنتاج بيانات إضافية.',
            actualBehavior: 'قد ينتج encoder أكثر من packet أو يؤجل الإخراج حتى تتراكم إطارات كافية.',
            benefit: 'تفصل منطق البناء الداخلي للـ codec عن كود التطبيق لديك، فتبقى طريقة التعامل موحدة عبر encoders مختلفة.',
            example: "while (avcodec_receive_packet(codec_ctx, packet) == 0) {\n  // packet مضغوط وجاهز للكتابة\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavc__encoding.html'
          }),
          Object.freeze({
            name: 'AVCodecContext',
            displayName: 'AVCodecContext',
            kind: 'structure',
            subsection: 'البنى الأساسية',
            description: 'البنية الرئيسية التي تمثل حالة codec مفتوحًا للترميز أو لفك الترميز.',
            practicalMeaning: 'هذا هو الكائن الذي يحمل إعدادات الـ codec وحالته الجارية مع buffers والخيارات المرتبطة به. معظم استدعاءات libavcodec تدور حوله مباشرة.',
            whyUse: 'بدونه لا توجد جلسة ترميز أو فك ترميز فعلية، لأنه يجمع النوع والإعدادات والحالة الداخلية في مكان واحد.',
            actualBehavior: 'يُنشأ ويُهيأ ثم يفتح عبر avcodec_open2، وبعد ذلك يصبح هو الطرف الذي يستقبل packets أو frames.',
            benefit: 'يوحد الإعدادات العامة مثل معدل البت، نوع الـ pixel format، والدوال المساعدة الخاصة بالجلسة نفسها.',
            example: "AVCodecContext *codec_ctx = avcodec_alloc_context3(codec);\ncodec_ctx->bit_rate = 2'000'000;",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/structAVCodecContext.html'
          })
        ])
      }),
      Object.freeze({
        key: 'libavformat',
        title: 'libavformat',
        description: 'مكتبة الحاويات والقراءة والكتابة: فتح الملف أو المصدر، قراءة الحزم، وتجهيز مخرجات muxing.',
        iconType: 'file',
        sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__libavf.html',
        items: Object.freeze([
          Object.freeze({
            name: 'avformat_open_input',
            displayName: 'avformat_open_input',
            kind: 'function',
            subsection: 'فتح المصادر والقراءة',
            description: 'تفتح ملفًا أو stream وتربطه بـ AVFormatContext لبدء demuxing.',
            practicalMeaning: 'هذه هي بوابة الدخول إلى ملف الفيديو أو الصوت أو stream الشبكي قبل الوصول إلى أي packet فردي.',
            whyUse: 'تستخدم عندما تريد أن تجعل FFmpeg يتعرف على الحاوية والمصدر والبروتوكول ويجهز context للقراءة.',
            actualBehavior: 'تتعامل مع الحاوية والبروتوكول وتملأ AVFormatContext بالمعلومات الأساسية عن المصدر.',
            benefit: 'تختصر عليك منطق اكتشاف الصيغ والبروتوكولات وتوحّد قراءة مصادر مختلفة عبر API واحدة.',
            example: "if (avformat_open_input(&fmt_ctx, path, NULL, NULL) < 0) {\n  // تعذر فتح المصدر\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavf__decoding.html'
          }),
          Object.freeze({
            name: 'av_read_frame',
            displayName: 'av_read_frame',
            kind: 'function',
            subsection: 'فتح المصادر والقراءة',
            description: 'تقرأ AVPacket التالي من الحاوية بعد فتحها واكتشاف الـ streams.',
            practicalMeaning: 'هذه هي الحلقة التي تمر منها كل البيانات المضغوطة الخارجة من demuxer قبل إرسالها إلى decoders المناسبة.',
            whyUse: 'تستخدم داخل loop القراءة الأساسية حتى نهاية الملف أو stream.',
            actualBehavior: 'تعيد packets من streams مختلفة، لذلك يجب فحص stream_index قبل إرسالها إلى decoder الصحيح.',
            benefit: 'تفصل بين منطق الحاوية وبين منطق الترميز: demux أولًا ثم decode حسب نوع stream.',
            example: "while (av_read_frame(fmt_ctx, packet) >= 0) {\n  // افحص packet->stream_index\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavf__decoding.html'
          }),
          Object.freeze({
            name: 'avformat_close_input',
            displayName: 'avformat_close_input',
            kind: 'function',
            subsection: 'إدارة السياق',
            description: 'تغلق AVFormatContext الخاص بالإدخال وتحرر موارده المرتبطة.',
            practicalMeaning: 'هي نهاية دورة القراءة. تستخدم لإغلاق الملف أو المصدر وتفريغ الحالة المرتبطة بالحاوية والبروتوكول.',
            whyUse: 'تمنع التسربات وتحرر موارد I/O والـ streams المربوطة بالسياق.',
            actualBehavior: 'تتعامل مع الإغلاق والتحرير المناسبين بدل أن تترك التطبيق يحرر الحقول يدويًا بصورة ناقصة.',
            benefit: 'تحافظ على دورة حياة واضحة لمسار input وتقلل أخطاء التنظيف اليدوي.',
            example: "avformat_close_input(&fmt_ctx);",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavf__decoding.html'
          }),
          Object.freeze({
            name: 'avformat_alloc_output_context2',
            displayName: 'avformat_alloc_output_context2',
            kind: 'function',
            subsection: 'Muxing والكتابة',
            description: 'تنشئ AVFormatContext جديدًا للمخرجات بحسب اسم ملف أو format محدد.',
            practicalMeaning: 'هذه هي نقطة البداية عندما تريد كتابة ملف خرج: MP4 أو MKV أو غيره. هي التي تجهز الحاوية التي سيصب فيها muxer الحزم النهائية.',
            whyUse: 'تستخدم قبل إضافة streams وكتابة header ثم packets الخارجة من encoders.',
            actualBehavior: 'تختار muxer مناسبًا وتبني output context جاهزًا لتجهيز الـ streams والـ metadata.',
            benefit: 'تجعل كتابة المخرجات تسير بنفس منطق القراءة لكن بالعكس: context ثم streams ثم header ثم packets.',
            example: "avformat_alloc_output_context2(&out_ctx, NULL, NULL, output_path);",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavf__encoding.html'
          }),
          Object.freeze({
            name: 'AVFormatContext',
            displayName: 'AVFormatContext',
            kind: 'structure',
            subsection: 'البنى الأساسية',
            description: 'السياق المركزي الذي يمثل ملفًا أو stream وحاويته وstreams المرتبطة به.',
            practicalMeaning: 'هذا هو الكائن الذي تمسك به أثناء demuxing أو muxing. يحمل معلومات المصدر أو الوجهة والـ streams والـ metadata وطبقة I/O.',
            whyUse: 'بدونه لا توجد جلسة قراءة أو كتابة حقيقية في libavformat.',
            actualBehavior: 'يمر من مرحلة فتح أو إنشاء ثم يكتسب streams وخصائص إضافية قبل أن يصبح جاهزًا للقراءة أو الكتابة.',
            benefit: 'يجمع كل ما يتعلق بالحاوية في مكان واحد بدل توزيع الحالة على متغيرات منفصلة.',
            example: "AVFormatContext *fmt_ctx = NULL;\navformat_open_input(&fmt_ctx, path, NULL, NULL);",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/structAVFormatContext.html'
          })
        ])
      }),
      Object.freeze({
        key: 'libavfilter',
        title: 'libavfilter',
        description: 'مكتبة الفلاتر: بناء filter graph وربط العقد ثم تهيئتها لتعديل الإطارات.',
        iconType: 'variable',
        sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html',
        items: Object.freeze([
          Object.freeze({
            name: 'avfilter_graph_alloc',
            displayName: 'avfilter_graph_alloc',
            kind: 'function',
            subsection: 'إدارة الـ Filter Graph',
            description: 'تنشئ AVFilterGraph فارغًا ليصبح حاوية للعقد والوصلات.',
            practicalMeaning: 'هذه هي بداية أي pipeline فلاتر في FFmpeg. قبل إضافة filter واحدة تحتاج graph يجمعها ويحكم علاقاتها.',
            whyUse: 'تستخدم عندما تريد بناء سلسلة معالجة مثل scale ثم format ثم buffersink.',
            actualBehavior: 'تنشئ بنية graph فقط؛ الفلاتر نفسها لا تُضاف ولا تُهيأ إلا لاحقًا.',
            benefit: 'تعطيك نقطة مركزية لإدارة كل الفلاتر والوصلات بدل إدارة كل filter منفصلة بلا سياق جامع.',
            example: "AVFilterGraph *graph = avfilter_graph_alloc();",
            sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html'
          }),
          Object.freeze({
            name: 'avfilter_graph_create_filter',
            displayName: 'avfilter_graph_create_filter',
            kind: 'function',
            subsection: 'إنشاء وربط الفلاتر',
            description: 'تنشئ filter داخل graph من نوع معروف مثل buffer أو scale أو buffersink.',
            practicalMeaning: 'هي الخطوة التي تحوّل اسم filter إلى عقدة حية داخل graph مع خياراتها الأولية.',
            whyUse: 'تستخدم لإضافة عقد المصدر والمرشحات الوسطية وعقد المصب قبل تهيئة graph كاملة.',
            actualBehavior: 'تربط filter بالـ graph المعطى وتجهز context خاصًا بها، لكن الرسم كله لا يصبح صالحًا قبل config.',
            benefit: 'تسمح ببناء graph برمجيًا بدل الاعتماد على سلاسل نصية فقط.',
            example: "avfilter_graph_create_filter(&src_ctx, src_filter, \"in\", args, NULL, graph);",
            sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html'
          }),
          Object.freeze({
            name: 'avfilter_graph_parse2',
            displayName: 'avfilter_graph_parse2',
            kind: 'function',
            subsection: 'إنشاء وربط الفلاتر',
            description: 'تحلل وصف filter graph نصيًا وتحوّله إلى عقد ووصلات داخل AVFilterGraph.',
            practicalMeaning: 'بدل بناء graph يدويًا عقدةً عقدة، يمكنك تمرير تعبير filter_complex وتحويله إلى رسم قابل للتهيئة.',
            whyUse: 'تفيد عندما تأتي سلسلة الفلاتر من إعداد خارجي أو من وصف نصي مشابه لاستخدام FFmpeg CLI.',
            actualBehavior: 'تحلل النص وتعيد مداخل أو مخارج مفتوحة يجب ربطها أو التعامل معها قبل config النهائية.',
            benefit: 'تقرب API البرمجية من الطريقة التي يفكر بها كثير من المستخدمين عند كتابة filter chains.',
            example: "avfilter_graph_parse2(graph, \"scale=1280:720,format=yuv420p\", &inputs, &outputs);",
            sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html'
          }),
          Object.freeze({
            name: 'avfilter_graph_config',
            displayName: 'avfilter_graph_config',
            kind: 'function',
            subsection: 'إدارة الـ Filter Graph',
            description: 'تتحقق من graph وتثبت إعداداتها وتجهزها للتنفيذ الفعلي.',
            practicalMeaning: 'بعد إنشاء الفلاتر وربطها، هذه الدالة هي التي تجعل graph قابلة للاستخدام الحقيقي على الإطارات.',
            whyUse: 'تستخدم مرة أخيرة قبل بدء تمرير frames عبر buffersrc والحصول عليها من buffersink.',
            actualBehavior: 'تقوم بالتحقق من التوافق بين العقد والوصلات والتنسيقات وتجهز الحالة الداخلية للتنفيذ.',
            benefit: 'تكشف الأخطاء البنيوية مبكرًا قبل بدء المعالجة وتضمن أن graph صالحة فعلاً.',
            example: "if (avfilter_graph_config(graph, NULL) < 0) {\n  // graph غير صالحة\n}",
            sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/group__lavfi.html'
          }),
          Object.freeze({
            name: 'AVFilterGraph',
            displayName: 'AVFilterGraph',
            kind: 'structure',
            subsection: 'البنى',
            description: 'البنية التي تمثل الرسم الكامل للفلاتر والوصلات بينها.',
            practicalMeaning: 'هي الحاوية الأعلى لمشهد المعالجة داخل libavfilter: منها تبدأ وتُضاف إليها العقد وتُهيأ ثم تُحرر.',
            whyUse: 'تحتاجها كلما أردت سلسلة معالجة حقيقية بدل filter واحدة معزولة.',
            actualBehavior: 'تحمل قائمة الفلاتر ومعلومات التهيئة والمخازن المرتبطة بتنفيذ graph.',
            benefit: 'تعطيك تمثيلًا واحدًا واضحًا لخط المعالجة بدلاً من تجميع أجزاء متفرقة يدويًا.',
            example: "AVFilterGraph *graph = avfilter_graph_alloc();\n// أضف العقد ثم قم بالتهيئة",
            sourceUrl: 'https://www.ffmpeg.org/doxygen/trunk/structAVFilterGraph.html'
          })
        ])
      }),
      Object.freeze({
        key: 'libavutil',
        title: 'libavutil',
        description: 'مكتبة الأدوات والهياكل المشتركة: الإطارات، الكسور، الأخطاء، السجلات، والبيانات المساعدة.',
        iconType: 'structure',
        sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavu.html',
        items: Object.freeze([
          Object.freeze({
            name: 'AVFrame',
            displayName: 'AVFrame',
            kind: 'structure',
            subsection: 'الفيديو والصوت',
            description: 'البنية الأساسية التي تحمل إطار فيديو خامًا أو دفعة عينات صوت خامة.',
            practicalMeaning: 'هذا هو الوعاء القياسي للبيانات غير المضغوطة داخل FFmpeg. decoders تخرجه، encoders تستهلكه، والفلاتر تمرره بين العقد.',
            whyUse: 'لأنه يوحد شكل البيانات الخام والـ timestamps والخصائص المرافقة في بنية واحدة.',
            actualBehavior: 'يحمل buffers وحقولًا مثل width وheight وformat أو nb_samples وفق نوع المحتوى.',
            benefit: 'يجعل كل مكتبات FFmpeg تتفاهم على تمثيل واحد للبيانات الخام بدل هياكل منفصلة لكل مسار.',
            example: "AVFrame *frame = av_frame_alloc();\nframe->format = AV_PIX_FMT_YUV420P;",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/structAVFrame.html'
          }),
          Object.freeze({
            name: 'AVRational',
            displayName: 'AVRational',
            kind: 'structure',
            subsection: 'الرياضيات والزمن',
            description: 'بنية تمثل كسرًا مكونًا من بسط ومقام وتستخدم على نطاق واسع لتمثيل time base ومعدلات الإطارات.',
            practicalMeaning: 'بدل تخزين الزمن كـ float قد يفقد الدقة، يستخدم FFmpeg كسورًا صريحة تحافظ على المعنى الرياضي الحقيقي للمعدلات.',
            whyUse: 'تستخدم مع pts وdts وtime_base وframe_rate لأن هذه القيم غالبًا نسب دقيقة لا أعداد عشرية بسيطة.',
            actualBehavior: 'تمر بين الدوال المساعدة مثل av_rescale_q عند تحويل القيم الزمنية من قاعدة إلى أخرى.',
            benefit: 'تحافظ على الدقة وتقلل الأخطاء التراكمية عند تحويل timestamps بين المكتبات والسياقات.',
            example: "AVRational time_base = {1, 1000};",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/structAVRational.html'
          }),
          Object.freeze({
            name: 'AVDictionary',
            displayName: 'AVDictionary',
            kind: 'structure',
            subsection: 'هياكل البيانات',
            description: 'قاموس مفاتيح/قيم نصية يستخدم لتمرير metadata وخيارات متعددة في API.',
            practicalMeaning: 'هو الوسيلة الخفيفة لتمرير إعدادات نصية أو metadata دون الحاجة إلى بنى مخصصة لكل حالة.',
            whyUse: 'يستخدم في فتح المصادر أو ضبط metadata أو تمرير خيارات عامة إلى بعض الدوال.',
            actualBehavior: 'يحمل أزواجًا نصية مثل title أو encoder أو خيارات إضافية للفتح أو التهيئة.',
            benefit: 'يوفر قناة مرنة للإعدادات والنصوص بدل تضخيم التواقيع البرمجية بعدد كبير من المعاملات.',
            example: "AVDictionary *opts = NULL;\nav_dict_set(&opts, \"timeout\", \"5000000\", 0);",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavu__dict.html'
          }),
          Object.freeze({
            name: 'av_log',
            displayName: 'av_log',
            kind: 'function',
            subsection: 'الأخطاء والتسجيل',
            description: 'تكتب رسالة سجل عبر نظام logging الداخلي في FFmpeg بمستوى محدد.',
            practicalMeaning: 'هي الواجهة الموحدة التي تطبع عبرها FFmpeg التشخيصات والتحذيرات والأخطاء والمعلومات التطويرية.',
            whyUse: 'تفيد عندما تريد سلوك سجل متناسقًا مع بقية المكتبة أو عندما تكتب كودًا مبنيًا فوق FFmpeg.',
            actualBehavior: 'ترسل الرسالة إلى callback المسجل في نظام السجلات الحالي مع مستوى مثل AV_LOG_ERROR أو AV_LOG_INFO.',
            benefit: 'تعطيك نظام تشخيص موحدًا بدل طباعة نصوص عشوائية مباشرة إلى stderr.',
            example: "av_log(codec_ctx, AV_LOG_ERROR, \"decoder failed\\n\");",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavu__log.html'
          }),
          Object.freeze({
            name: 'AVERROR',
            displayName: 'AVERROR',
            kind: 'macro',
            subsection: 'الأخطاء والتسجيل',
            description: 'ماكرو يحوّل رمز خطأ من errno إلى قيمة خطأ سالبة تستخدمها واجهات FFmpeg.',
            practicalMeaning: 'كثير من دوال FFmpeg تعيد أخطاء سالبة بصياغة موحدة. هذا الماكرو يبني تلك القيم من أخطاء النظام أو يقارنها بها.',
            whyUse: 'تستخدمه لمقارنة EAGAIN أو EOF أو أخطاء نظامية أخرى بالطريقة التي تفهمها دوال FFmpeg.',
            actualBehavior: 'يبني قيمة سالبة متوافقة مع اصطلاح FFmpeg بدل استخدام errno الخام مباشرة.',
            benefit: 'يوحد التعامل مع الأخطاء عبر المنصة والمكتبة ويجعل المقارنات أوضح في الكود.',
            example: "if (ret == AVERROR(EAGAIN)) {\n  // حاول لاحقًا بعد دفع المزيد من البيانات\n}",
            sourceUrl: 'https://ffmpeg.org/doxygen/trunk/group__lavu__error.html'
          })
        ])
      })
    ])
  });

  function flattenFfmpegItems() {
    return FFMPEG_REFERENCE_DATA.sections.flatMap((section) =>
      (section.items || []).map((item) => Object.freeze({
        ...item,
        libraryKey: section.key,
        libraryTitle: section.title,
        libraryDescription: section.description,
        librarySourceUrl: section.sourceUrl,
        sectionKey: section.key,
        sectionTitle: section.title
      }))
    );
  }

  const FFMPEG_REFERENCE_ITEMS = Object.freeze(flattenFfmpegItems());

  function createFfmpegHomeRuntime(api = {}) {
    const {
      renderCodicon
    } = api;

    function getFfmpegHomeConfig() {
      return FFMPEG_REFERENCE_DATA;
    }

    function getFfmpegHomeSections() {
      return FFMPEG_REFERENCE_DATA.sections.map((section) => Object.freeze({
        key: section.key,
        title: section.title,
        description: section.description,
        iconType: section.iconType || 'file',
        count: Array.isArray(section.items) ? section.items.length : 0
      }));
    }

    function getFfmpegRecentItems(limit = 6) {
      return FFMPEG_REFERENCE_DATA.featuredTokens
        .slice(0, Math.max(1, Number(limit) || 6))
        .map((token) => FFMPEG_REFERENCE_ITEMS.find((item) => item.name === token))
        .filter(Boolean)
        .map((item) => ({
          label: item.displayName || item.name,
          iconType: item.kind === 'function' ? 'command' : item.kind === 'macro' ? 'macro' : 'structure',
          action: `showFfmpegReference('${String(item.name || '').replace(/'/g, "\\'")}')`,
          tooltip: `${item.displayName || item.name}\n${item.description || ''}`
        }));
    }

    function buildFfmpegHomeLibraryModel() {
      const config = getFfmpegHomeConfig();
      const sections = getFfmpegHomeSections();
      const totalCount = sections.reduce((total, section) => total + (Number(section.count) || 0), 0);

      return {
        key: 'ffmpeg',
        title: config.meta.title,
        iconType: 'file',
        kicker: config.meta.kicker,
        description: config.meta.description,
        summaryNote: config.meta.summaryNote,
        statusNote: config.meta.statusNote,
        totalCount,
        headerActions: [
          {label: 'افتح مرجع FFmpeg', iconType: 'file', action: 'showFfmpegIndex()', primary: true},
          {label: 'libavcodec', iconType: 'command', action: `showFfmpegIndex('libavcodec')`},
          {label: 'libavformat', iconType: 'file', action: `showFfmpegIndex('libavformat')`},
          {label: 'AVFrame', iconType: 'structure', action: `showFfmpegReference('AVFrame')`}
        ],
        cards: sections.map((section) => ({
          count: section.count,
          iconType: section.iconType || 'file',
          title: section.title,
          note: section.description,
          action: `showFfmpegIndex('${String(section.key || '').replace(/'/g, "\\'")}')`
        })),
        quickLinks: [
          {label: 'مرجع FFmpeg', iconType: 'file', action: 'showFfmpegIndex()', primary: true},
          {label: 'فتح ملف وقراءته', iconType: 'file', action: `showFfmpegReference('avformat_open_input')`},
          {label: 'بدء فك الترميز', iconType: 'command', action: `showFfmpegReference('avcodec_send_packet')`},
          {label: 'استلام frame', iconType: 'structure', action: `showFfmpegReference('AVFrame')`},
          {label: 'بناء filter graph', iconType: 'variable', action: `showFfmpegReference('avfilter_graph_alloc')`}
        ],
        recentIconType: 'file',
        recentItems: getFfmpegRecentItems(6),
        recentEmptyText: 'لا توجد عناصر FFmpeg بارزة حاليًا.',
        supportLinks: (config.meta.references || []).map((reference) => ({
          label: reference.label,
          href: reference.href,
          icon: typeof renderCodicon === 'function' ? renderCodicon('book', 'ui-codicon list-icon', 'مرجع') : ''
        })),
        extraSectionsHtml: ''
      };
    }

    return {
      getFfmpegHomeConfig,
      getFfmpegHomeSections,
      getFfmpegRecentItems,
      buildFfmpegHomeLibraryModel
    };
  }

  function createFfmpegPageRuntime(api = {}) {
    const {
      escapeHtml,
      escapeAttribute,
      renderEntityIcon,
      renderTutorialInfoGrid,
      showHomePage,
      syncRouteHistory,
      scrollMainContentToTop,
      highlightCode,
      safeRenderEntityLabel
    } = api;

    function getFfmpegSection(sectionKey = '') {
      return FFMPEG_REFERENCE_DATA.sections.find((section) => section.key === sectionKey) || null;
    }

    function getFfmpegReferenceItem(name = '') {
      const normalized = String(name || '').trim();
      return FFMPEG_REFERENCE_ITEMS.find((item) => item.name === normalized) || null;
    }

    function getFfmpegItemIconType(item = {}) {
      if (item.kind === 'function') return 'command';
      if (item.kind === 'macro') return 'macro';
      return 'structure';
    }

    function renderCodeBlock(code = '', language = 'cpp') {
      const safeCode = typeof escapeHtml === 'function' ? escapeHtml(code) : String(code || '');
      return `<pre class="code-block"><code class="language-${escapeAttribute(language)}">${safeCode}</code></pre>`;
    }

    async function showFfmpegReference(name, options = {}) {
      const content = document.getElementById('mainContent');
      if (!content) {
        return;
      }

      const item = getFfmpegReferenceItem(name);
      if (!item) {
        content.innerHTML = `
          <div class="page-header">
            <h1>${renderEntityIcon('file', 'ui-codicon page-icon', 'FFmpeg')} ${escapeHtml(name)}</h1>
            <p>لا توجد صفحة محلية لهذا العنصر من FFmpeg حاليًا.</p>
          </div>
        `;
        return;
      }

      content.innerHTML = `
        <div class="reference-unified-detail-page">
          <div class="page-header">
            <nav class="breadcrumb">
              <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
              <a href="#" onclick="showFfmpegIndex(); return false;">مرجع FFmpeg</a> /
              <a href="#" onclick="showFfmpegIndex('${escapeAttribute(item.sectionKey)}'); return false;">${escapeHtml(item.sectionTitle)}</a> /
              <span>${escapeHtml(item.displayName || item.name)}</span>
            </nav>
            <h1 class="page-title">${renderEntityIcon(getFfmpegItemIconType(item), 'ui-codicon page-icon', item.displayName || item.name)} ${escapeHtml(item.displayName || item.name)}</h1>
            <p class="page-description">${escapeHtml(item.description || '')}</p>
          </div>

          <section class="info-section">
            ${renderTutorialInfoGrid([
              {
                label: 'المكتبة',
                value: `<strong>${escapeHtml(item.libraryTitle)}</strong>`,
                note: escapeHtml(item.libraryDescription || '')
              },
              {
                label: 'نوع العنصر',
                value: `<strong>${escapeHtml(item.kind === 'function' ? 'دالة' : item.kind === 'macro' ? 'ماكرو' : 'بنية')}</strong>`,
                note: 'هذا يوضح كيف تتعامل معه برمجيًا: هل تستدعيه، أم تهيئه، أم تستخدمه كقيمة مساعدة.'
              },
              {
                label: 'التصنيف العملي',
                value: escapeHtml(item.subsection || 'عنصر أساسي'),
                note: 'هذا التصنيف محلي داخل المشروع لتجميع العناصر بحسب دورها الفعلي في سير العمل.'
              },
              {
                label: 'المصدر الرسمي',
                value: item.sourceUrl ? `<a class="doc-link" href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Doxygen الرسمي</a>` : '—',
                note: 'الرابط يعود إلى توثيق FFmpeg الرسمي الذي بُنيت منه هذه المرحلة التمهيدية.'
              }
            ])}
          </section>

          <section class="info-section">
            <div class="content-card prose-card">
              <h2>المعنى الحقيقي</h2>
              <p>${escapeHtml(item.practicalMeaning || item.description || '')}</p>
            </div>
          </section>

          <section class="info-section">
            <div class="content-card prose-card">
              <h2>متى تستخدمه؟</h2>
              <p>${escapeHtml(item.whyUse || '')}</p>
            </div>
          </section>

          <section class="info-section">
            <div class="content-card prose-card">
              <h2>ما الذي يفعله فعليًا؟</h2>
              <p>${escapeHtml(item.actualBehavior || '')}</p>
            </div>
          </section>

          <section class="info-section">
            <div class="content-card prose-card">
              <h2>الفائدة العملية</h2>
              <p>${escapeHtml(item.benefit || '')}</p>
            </div>
          </section>

          <section class="example-section">
            <h2>مثال</h2>
            ${renderCodeBlock(item.example || item.name, 'cpp')}
          </section>

          <section class="card">
            <div class="card-header"><h2>روابط سريعة</h2></div>
            <p>
              <a href="#" class="doc-link entity-link-with-icon" onclick="showFfmpegIndex(); return false;">${safeRenderEntityLabel('العودة إلى فهرس FFmpeg', 'file')}</a>
              /
              <a href="#" class="doc-link entity-link-with-icon" onclick="showFfmpegIndex('${escapeAttribute(item.sectionKey)}'); return false;">${safeRenderEntityLabel(`العودة إلى ${item.sectionTitle}`, 'file')}</a>
            </p>
          </section>
        </div>
      `;

      document.title = `${item.displayName || item.name} - FFmpeg - ArabicVulkan`;
      syncRouteHistory(`ffmpeg/${encodeURIComponent(item.name)}`, options);
      scrollMainContentToTop();
      highlightCode(content);
    }

    async function showFfmpegIndex(sectionKey = '', options = {}) {
      const content = document.getElementById('mainContent');
      if (!content) {
        return;
      }

      const targetSection = sectionKey ? getFfmpegSection(sectionKey) : null;
      const sections = targetSection ? [targetSection] : FFMPEG_REFERENCE_DATA.sections;

      let html = `
        <div class="page-header">
          <nav class="breadcrumb">
            <a href="#" onclick="showHomePage(); return false;">الرئيسية</a> /
            <span>مرجع FFmpeg</span>
          </nav>
          <h1>${renderEntityIcon('file', 'ui-codicon page-icon', 'FFmpeg')} مرجع FFmpeg</h1>
          <p>${escapeHtml(FFMPEG_REFERENCE_DATA.meta.description)}</p>
        </div>
        <section class="info-section">
          <div class="content-card prose-card">
            <p>المرحلة الحالية تغطي النواة العملية من FFmpeg كما تظهر في Doxygen الرسمي: <strong>libavcodec</strong> و<strong>libavformat</strong> و<strong>libavfilter</strong> و<strong>libavutil</strong>. الهدف هنا ليس نسخ المرجع كاملًا دفعة واحدة، بل بناء مسار عربي مفهوم يبدأ بالعناصر التي يلمسها المبرمج أولًا عند القراءة والترميز والمعالجة.</p>
            <p><a class="doc-link" href="${escapeAttribute(FFMPEG_REFERENCE_DATA.meta.officialUrl)}" target="_blank" rel="noopener noreferrer">فتح Doxygen الرسمي</a></p>
          </div>
        </section>
      `;

      sections.forEach((section) => {
        const grouped = {};
        (section.items || []).forEach((item) => {
          const groupKey = item.subsection || 'عناصر أساسية';
          if (!grouped[groupKey]) {
            grouped[groupKey] = [];
          }
          grouped[groupKey].push(item);
        });

        html += `
          <section class="category-section" id="ffmpeg-section-${escapeAttribute(section.key)}">
            <h2>${escapeHtml(section.title)}</h2>
            <div class="content-card prose-card">
              <p>${escapeHtml(section.description || '')}</p>
              <p><a class="doc-link" href="${escapeAttribute(section.sourceUrl || FFMPEG_REFERENCE_DATA.meta.officialUrl)}" target="_blank" rel="noopener noreferrer">المرجع الرسمي لهذا القسم</a></p>
            </div>
            ${Object.entries(grouped).map(([groupTitle, groupItems]) => `
              <div class="kind-index-group">
                <h3 class="kind-index-group-title">${escapeHtml(groupTitle)} <span class="kind-index-group-count">(${groupItems.length})</span></h3>
                <div class="items-grid">
                  ${groupItems.map((item) => `
                    <div class="item-card" onclick="showFfmpegReference('${escapeAttribute(item.name)}')">
                      <div class="item-icon">${renderEntityIcon(getFfmpegItemIconType(item), 'ui-codicon card-icon', item.displayName || item.name)}</div>
                      <div class="item-content">
                        <h3>${escapeHtml(item.displayName || item.name)}</h3>
                        <p>${escapeHtml(item.description || '')}</p>
                        ${item.example ? `<div class="item-example-preview"><pre class="code-block"><code class="language-cpp">${escapeHtml(item.example)}</code></pre></div>` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </section>
        `;
      });

      content.innerHTML = html;
      document.title = 'مرجع FFmpeg - ArabicVulkan';
      syncRouteHistory(sectionKey ? `ffmpeg-index/${encodeURIComponent(sectionKey)}` : 'ffmpeg-index', options);
      scrollMainContentToTop();
      highlightCode(content);
    }

    return {
      getFfmpegReferenceItem,
      showFfmpegReference,
      showFfmpegIndex
    };
  }

  if (typeof global.createFfmpegHomeRuntime !== 'function') {
    global.createFfmpegHomeRuntime = createFfmpegHomeRuntime;
  }
  global.createFfmpegPageRuntime = createFfmpegPageRuntime;
  global.__ARABIC_VULKAN_FFMPEG_RUNTIME__ = {
    createFfmpegHomeRuntime,
    createFfmpegPageRuntime,
    ffmpegReferenceData: FFMPEG_REFERENCE_DATA,
    ffmpegReferenceItems: FFMPEG_REFERENCE_ITEMS
  };
})(typeof window !== 'undefined' ? window : globalThis);
