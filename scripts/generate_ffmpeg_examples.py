#!/usr/bin/env python3
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://www.ffmpeg.org/doxygen/8.0/"
GENERATED_AT = "2026-03-26T01:20:00.000Z"

LIBRARY_DESCRIPTION = "مرجع عربي تمهيدي ومتدرج لـ FFmpeg يركز على المكتبات الفرعية الأساسية، والدوال العملية، والبنى، وبعض التعدادات والثوابت التي تظهر باستمرار في مسار الفتح والقراءة وفك الترميز والتحويل."
EXAMPLES_DESCRIPTION = "أمثلة عملية مشتقة من أمثلة FFmpeg الرسمية، مع شرح عربي وتعليقات توضح المعنى الحقيقي للكود وخط الأنابيب الذي ينفذه."

META = {
    "avio_http_serve_files.c": {
        "group": "AVIO والشبكات والملفات", "titleArabic": "خادم HTTP صغير يقدّم ملفات عبر AVIO",
        "short": "يبين أن طبقة AVIO لا تقتصر على قراءة الملفات، بل يمكنها أيضًا تقديم ملفات عبر HTTP داخل مثال صغير.",
        "meaning": "هذا المثال يستخدم AVIO كطبقة إدخال وإخراج عامة، ويحوّلها هنا إلى خادم ملفات بسيط بدل اعتبارها مجرد wrapper لملف محلي.",
        "purpose": "يعلمك كيف تستعمل API الشبكة والـ IO في FFmpeg لبناء خدمة ملفات خفيفة.",
        "why": "يفيد عندما تريد فهم أن FFmpeg يحتوي طبقة IO مرنة يمكن توصيلها بملفات أو HTTP أو مصادر مخصصة.",
        "carried": "ينقل الفكرة من file I/O التقليدي إلى AVIO كسطح موحّد للقراءة والكتابة والخدمة الشبكية.",
        "code": "AVIOContext *server = NULL;\nint ret = avio_open2(&server, outputUrl, AVIO_FLAG_WRITE, NULL, NULL);\nif (ret < 0) {\n    // فشل فتح نقطة الإخراج الشبكية أو الملف الهدف\n    return ret;\n}\n\nwhile (read_next_chunk(input, buffer, &size)) {\n    // نكتب bytes الخام عبر نفس طبقة AVIO سواء كان الهدف ملفًا أو HTTP\n    avio_write(server, buffer, size);\n}\n\n// هذا الاستدعاء يضمن دفع البيانات المعلّقة قبل الإغلاق\navio_flush(server);\navio_close(server);",
        "related": ["libavformat"]
    },
    "avio_list_dir.c": {
        "group": "AVIO والشبكات والملفات", "titleArabic": "استعراض محتويات مجلد عبر AVIO",
        "short": "يبين أن AVIO تستطيع التعامل مع المجلدات ومصادر الملفات كطبقة موحّدة بدل استدعاءات نظام مباشرة.",
        "meaning": "الفكرة الحقيقية هنا أن FFmpeg يملك abstraction للملفات والمسارات، لذلك يمكن استعراض المجلدات عبر API نفسها التي تتعامل مع مصادر أخرى.",
        "purpose": "يعلمك كيف تفحص الملفات أو المصادر المتاحة من خلال AVIO.",
        "why": "يفيد عند بناء أدوات استكشاف وسائط أو اختيار ملفات قبل الفتح الفعلي.",
        "carried": "يوضح أن AVIO ليست طبقة stream فقط، بل طبقة وصول إلى موارد التخزين أيضًا.",
        "code": "AVIODirContext *dir = NULL;\nAVIODirEntry *entry = NULL;\n\nif (avio_open_dir(&dir, path, NULL) < 0) {\n    // لم نتمكن من فتح المجلد من خلال طبقة AVIO\n    return;\n}\n\nwhile (avio_read_dir(dir, &entry) >= 0 && entry) {\n    // كل عنصر هنا يمثل ملفًا أو مجلدًا مع metadata جاهزة من FFmpeg\n    printf(\"%s\\n\", entry->name);\n    avio_free_directory_entry(&entry);\n}\n\navio_close_dir(&dir);",
        "related": ["libavformat"]
    },
    "avio_read_callback.c": {
        "group": "AVIO والشبكات والملفات", "titleArabic": "قراءة مصدر مخصص عبر callback بدل ملف مباشر",
        "short": "يبين كيف تربط FFmpeg بمصدر بيانات مخصص في الذاكرة أو الشبكة عبر callback.",
        "meaning": "هذا المثال مهم لأن FFmpeg لا يشترط ملفًا على القرص؛ يمكنك تغذيته bytes من أي مكان إذا وفرت callback القراءة.",
        "purpose": "يعلمك بناء AVIOContext مخصص يقرأ من buffer أو socket أو container داخلي.",
        "why": "يستخدم عندما تكون البيانات في الذاكرة أو تأتي من نظام غير ملفي.",
        "carried": "ينقل مسؤولية جلب البيانات إلى تطبيقك، بينما يتولى FFmpeg parsing وفهم الحاوية.",
        "code": "unsigned char *avioBuffer = av_malloc(4096);\nAVIOContext *customIo = avio_alloc_context(avioBuffer, 4096, 0, opaqueState, read_packet, NULL, NULL);\nfmtCtx->pb = customIo;\nfmtCtx->flags |= AVFMT_FLAG_CUSTOM_IO;\n\n// من هذه النقطة سيقرأ libavformat عبر read_packet لا عبر fopen التقليدي\nif (avformat_open_input(&fmtCtx, NULL, NULL, NULL) < 0) {\n    return;\n}",
        "related": ["AVFormatContext", "avformat_open_input"]
    },
    "decode_audio.c": {
        "group": "فك الترميز", "titleArabic": "فك ملف صوتي مضغوط إلى صوت خام",
        "short": "يبين مسار decoder الصوتي من packet مضغوطة إلى samples خامة.",
        "meaning": "الفكرة الحقيقية ليست مجرد تشغيل ملف صوت؛ بل فهم الفصل بين bitstream المضغوط والـ frame الصوتية الخام التي يمكن تشغيلها أو معالجتها.",
        "purpose": "يعلمك دورة send_packet وreceive_frame للصوت.",
        "why": "أساسي عندما تريد تحليل الصوت أو تحويله أو تشغيله خارج ffplay.",
        "carried": "ينقل البيانات من codec format مضغوط إلى samples قابلة للمعالجة.",
        "code": "while (read_compressed_packet(input, &packet)) {\n    // نمرر الحزمة المضغوطة كما خرجت من المصدر إلى decoder\n    avcodec_send_packet(codecCtx, &packet);\n\n    while (avcodec_receive_frame(codecCtx, frame) == 0) {\n        // هذه samples خامة بعد فك الترميز ويمكن كتابتها أو إعادة أخذ عينات منها\n        write_pcm_samples(frame);\n    }\n\n    av_packet_unref(&packet);\n}",
        "related": ["avcodec_send_packet", "avcodec_receive_frame", "AVFrame", "AVPacket"]
    },
    "decode_filter_audio.c": {
        "group": "الفلاتر والمعالجة", "titleArabic": "فك الصوت ثم تمريره عبر filter graph",
        "short": "يجمع بين decoder الصوتية ومرشحات FFmpeg الصوتية داخل خط واحد.",
        "meaning": "المعنى الحقيقي أن الفلاتر لا تعمل على packet المضغوطة، بل على frames خامة بعد فك الترميز.",
        "purpose": "يعلمك أين تدخل filter graph في مسار الصوت.",
        "why": "يفيد عندما تريد volume أو resample أو تنقية أو تعديل زمني بعد الفك.",
        "carried": "يربط بين مرحلتين: الحصول على frame صوتية خامة ثم تعديلها عبر graph.",
        "code": "avcodec_send_packet(codecCtx, &packet);\nwhile (avcodec_receive_frame(codecCtx, frame) == 0) {\n    // ندخل الـ frame الخام إلى graph لتعديل الصوت لاستخراج نسخة معالجة\n    av_buffersrc_add_frame(srcCtx, frame);\n\n    while (av_buffersink_get_frame(sinkCtx, filteredFrame) == 0) {\n        write_filtered_audio(filteredFrame);\n        av_frame_unref(filteredFrame);\n    }\n}",
        "related": ["avcodec_send_packet", "avcodec_receive_frame", "AVFrame"]
    },
    "decode_filter_video.c": {
        "group": "الفلاتر والمعالجة", "titleArabic": "فك الفيديو ثم تمريره عبر filter graph",
        "short": "يبين دخول إطارات الفيديو الخام إلى سلسلة فلاتر بعد فك الترميز.",
        "meaning": "الفكرة هنا أن الفلاتر تعمل على frames فيديو خامة، لذلك يجب أن يكون موضعها بعد decoder وقبل العرض أو الحفظ.",
        "purpose": "يعلمك مزج decode مع video filters في خط واحد.",
        "why": "يستخدم عند القص أو التحويل اللوني أو التراكب أو أي معالجة إطار بإطار.",
        "carried": "ينقل الإطار من decoder إلى graph ثم إلى المخرج المعالج.",
        "code": "avcodec_send_packet(codecCtx, &packet);\nwhile (avcodec_receive_frame(codecCtx, frame) == 0) {\n    // هنا الإطار صار خامًا ويمكن إدخاله إلى فلتر فيديو\n    av_buffersrc_add_frame(videoSrc, frame);\n\n    while (av_buffersink_get_frame(videoSink, filteredFrame) == 0) {\n        save_filtered_video_frame(filteredFrame);\n        av_frame_unref(filteredFrame);\n    }\n}",
        "related": ["avcodec_send_packet", "avcodec_receive_frame", "AVFrame"]
    },
    "decode_video.c": {
        "group": "فك الترميز", "titleArabic": "فك ملف فيديو مضغوط إلى إطارات خامة",
        "short": "يبين كيف تتحول packet الفيديو إلى AVFrame خامة قابلة للعرض أو المعالجة.",
        "meaning": "الفكرة الأساسية هنا أن decoder لا يخرج دائمًا frame لكل packet؛ بل يعمل بخط أنابيب داخلي يجب سحبه تدريجيًا.",
        "purpose": "يعلمك واجهة send وreceive على فيديو بسيط.",
        "why": "أساس أي أداة تحليل أو التقاط صور أو تحويل فيديو.",
        "carried": "ينقل H.264 أو غيره من bitstream إلى frame بكسلية خامة.",
        "code": "avcodec_send_packet(codecCtx, &packet);\nwhile (avcodec_receive_frame(codecCtx, frame) == 0) {\n    // frame الآن تمثل صورة خامة بمقاس وصيغة محددين داخل AVFrame\n    dump_video_frame(frame);\n}\n\nav_packet_unref(&packet);",
        "related": ["avcodec_send_packet", "avcodec_receive_frame", "AVFrame"]
    },
    "demux_decode.c": {
        "group": "فك الترميز", "titleArabic": "فصل الحاوية ثم فك الصوت والفيديو",
        "short": "يبين الخط الكامل من فتح الحاوية إلى فصل الـ streams ثم فكها.",
        "meaning": "هذا المثال هو المسار الحقيقي الأكثر اكتمالًا: demuxer يختار stream ثم decoder تفك البيانات لكل نوع وسائط.",
        "purpose": "يعلمك كيف تعمل libavformat مع libavcodec معًا.",
        "why": "هذا هو المثال الأقرب لمسار مشغل وسائط أو أداة تحويل حقيقية.",
        "carried": "يفصل بين مرحلتين أساسيتين: استخراج packet من الحاوية ثم تفسيرها كصوت أو فيديو.",
        "code": "if (packet.stream_index == audioStreamIndex) {\n    // نرسل حزم الصوت فقط إلى decoder الصوتية المناسبة\n    avcodec_send_packet(audioDecCtx, &packet);\n    while (avcodec_receive_frame(audioDecCtx, audioFrame) == 0) {\n        write_audio_frame(audioFrame);\n    }\n} else if (packet.stream_index == videoStreamIndex) {\n    // ونرسل حزم الفيديو إلى decoder الفيديو الخاصة بها\n    avcodec_send_packet(videoDecCtx, &packet);\n    while (avcodec_receive_frame(videoDecCtx, videoFrame) == 0) {\n        write_video_frame(videoFrame);\n    }\n}",
        "related": ["avformat_open_input", "avformat_find_stream_info", "av_find_best_stream", "av_read_frame"]
    },
    "encode_audio.c": {
        "group": "الترميز والإخراج", "titleArabic": "ترميز samples صوتية خامة إلى حزم مضغوطة",
        "short": "يبين خط encoder الصوتية من AVFrame خامة إلى AVPacket مضغوطة.",
        "meaning": "الترميز هو عكس الفك: تدخل frames خامة، وتسحب packets مضغوطة مناسبة للحفظ أو الإرسال.",
        "purpose": "يعلمك واجهة send_frame وreceive_packet في الصوت.",
        "why": "أساس أي أداة تسجيل أو بث أو توليد ملف صوت مضغوط.",
        "carried": "ينقل البيانات من PCM خام إلى codec bitstream.",
        "code": "fill_audio_frame_with_samples(frame);\n\n// نمرر الـ frame الخام إلى encoder كي تبني منها packet مضغوطة\navcodec_send_frame(encCtx, frame);\n\nwhile (avcodec_receive_packet(encCtx, &packet) == 0) {\n    write_encoded_packet(&packet);\n    av_packet_unref(&packet);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet", "AVFrame", "AVPacket"]
    },
    "encode_video.c": {
        "group": "الترميز والإخراج", "titleArabic": "ترميز إطارات فيديو خامة إلى bitstream مضغوط",
        "short": "يبين كيف تنتقل الصورة الخام إلى packet فيديو مضغوطة.",
        "meaning": "المعنى الحقيقي هنا أن encoder ليست حفظ صورة، بل بناء bitstream متسلسلة وفق إعدادات codec مثل GOP وbitrate والوقت.",
        "purpose": "يعلمك دورة الترميز الأساسية للفيديو.",
        "why": "يستخدم في التصدير والتسجيل والبث وتوليد الملفات.",
        "carried": "ينقل frame بكسلية خامة إلى packet مضغوطة قابلة للمكس أو الإرسال.",
        "code": "prepare_video_frame(frame, nextPts);\n\navcodec_send_frame(encCtx, frame);\nwhile (avcodec_receive_packet(encCtx, &packet) == 0) {\n    // packet هنا جاهزة للكتابة داخل muxer أو ملف خام\n    write_video_packet(&packet);\n    av_packet_unref(&packet);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet", "AVFrame", "AVPacket"]
    },
    "extract_mvs.c": {
        "group": "التحليل والاستخراج", "titleArabic": "استخراج motion vectors من الفيديو",
        "short": "يبين كيف تستفيد من side data لاستخراج حركة blocks من decoder.",
        "meaning": "المثال لا يفك الفيديو فقط، بل يقرأ metadata تحليلية يضعها decoder عن الحركة الداخلية بين الإطارات.",
        "purpose": "يعلمك كيف تصل إلى motion vectors من side data.",
        "why": "يفيد في التحليل والرؤية الحاسوبية وقياس الحركة.",
        "carried": "ينقل decoder من مجرد صورة مرئية إلى مصدر بيانات تحليلية إضافية.",
        "code": "avcodec_send_packet(codecCtx, &packet);\nwhile (avcodec_receive_frame(codecCtx, frame) == 0) {\n    AVFrameSideData *sd = av_frame_get_side_data(frame, AV_FRAME_DATA_MOTION_VECTORS);\n    if (sd) {\n        // هنا لا نقرأ pixels فقط، بل نقرأ بيانات حركة استخرجها decoder\n        inspect_motion_vectors(sd->data, sd->size);\n    }\n}",
        "related": ["avcodec_send_packet", "avcodec_receive_frame", "AVFrame"]
    },
    "ffhash.c": {
        "group": "الأدوات والتحليل", "titleArabic": "حساب hash لتدفقات الوسائط",
        "short": "يبين أداة بسيطة لحساب بصمة للمحتوى المقروء عبر FFmpeg.",
        "meaning": "الفكرة هنا أن FFmpeg يمكن أن يكون جزءًا من أدوات تحقق وفحص، لا مجرد تشغيل أو تحويل وسائط.",
        "purpose": "يعلمك قراءة البيانات واحتساب digest عليها.",
        "why": "يفيد للتحقق من التكافؤ أو اختبار pipelines أو فحص integrity.",
        "carried": "ينقل data flow من وسائط إلى hash قابلة للمقارنة.",
        "code": "while (av_read_frame(fmtCtx, &packet) >= 0) {\n    // نغذي hash بالبيانات نفسها للتحقق أو المقارنة لاحقًا\n    update_hash(state, packet.data, packet.size);\n    av_packet_unref(&packet);\n}\n\nprint_hash_result(state);",
        "related": ["av_read_frame", "AVPacket"]
    },
    "filter_audio.c": {
        "group": "الفلاتر والمعالجة", "titleArabic": "تمرير صوت خام عبر filter graph مباشر",
        "short": "يبين بناء graph صوتي وإدخال frames صوتية خامة إليها مباشرة.",
        "meaning": "هنا لا يبدأ المثال من ملف مضغوط، بل من frame خامة جاهزة، لإبراز دور graph نفسها بوصفها مرحلة معالجة مستقلة.",
        "purpose": "يعلمك بناء graph صوتية مستقلة عن decode.",
        "why": "مفيد عندما يكون الصوت الخام موجودًا أصلًا من ميكروفون أو pipeline أخرى.",
        "carried": "يعزل مرحلة الفلترة عن مراحل الفك والترميز لتفهم دورها الحقيقي وحدها.",
        "code": "generate_input_samples(frame);\n\n// نضيف frame الخام إلى أول عقدة في graph الصوتية\nav_buffersrc_add_frame(srcCtx, frame);\n\nwhile (av_buffersink_get_frame(sinkCtx, filtered) == 0) {\n    consume_filtered_audio(filtered);\n    av_frame_unref(filtered);\n}",
        "related": ["AVFrame"]
    },
    "hw_decode.c": {
        "group": "التسريع العتادي", "titleArabic": "فك فيديو باستخدام تسريع عتادي",
        "short": "يبين نقل decoder من CPU إلى جهاز عتادي مدعوم.",
        "meaning": "الفكرة الحقيقية أن frame قد تخرج في ذاكرة الجهاز لا في ذاكرة CPU، لذلك قد تحتاج نقلًا صريحًا عند بعض المسارات.",
        "purpose": "يعلمك تهيئة hw device context واستخدامه في decoder.",
        "why": "يفيد لتقليل الحمل على CPU في الفيديو العالي الدقة.",
        "carried": "ينقل مسار الفك من تنفيذ برمجي صرف إلى تنفيذ يستفيد من GPU أو accelerator.",
        "code": "av_hwdevice_ctx_create(&hwDeviceCtx, AV_HWDEVICE_TYPE_D3D11VA, NULL, NULL, 0);\ncodecCtx->hw_device_ctx = av_buffer_ref(hwDeviceCtx);\navcodec_open2(codecCtx, decoder, NULL);\n\n// بعد هذا قد يعيد decoder frames موجودة في ذاكرة العتاد لا في RAM العادية\nwhile (avcodec_receive_frame(codecCtx, hwFrame) == 0) {\n    transfer_frame_if_needed(hwFrame, swFrame);\n}",
        "related": ["AVHWAccel", "avcodec_get_hw_frames_parameters", "avcodec_open2"]
    },
    "mux.c": {
        "group": "الترميز والإخراج", "titleArabic": "بناء حاوية خرج وكتابة streams إليها",
        "short": "يبين muxer الإخراجية: إنشاء ملف خرج وتجميع packets فيه.",
        "meaning": "الفكرة ليست ترميز البيانات فقط، بل تنظيمها في حاوية نهائية مع headers وstreams وtimestamps صحيحة.",
        "purpose": "يعلمك بناء output container وربط streams بها.",
        "why": "مهم لكل أداة تنتج ملف فيديو أو صوت كاملًا.",
        "carried": "ينقل packets من encoder إلى ملف نهائي منظم كميديا container.",
        "code": "avformat_alloc_output_context2(&outFmt, NULL, NULL, outputPath);\ncreate_output_streams(outFmt);\navformat_write_header(outFmt, NULL);\n\nwhile (get_next_encoded_packet(&packet)) {\n    // muxer تكتب packet داخل الحاوية مع stream_index وtimestamps المناسبة\n    av_interleaved_write_frame(outFmt, &packet);\n}\n\nav_write_trailer(outFmt);",
        "related": ["AVFormatContext", "avformat_close_input"]
    },
    "qsv_decode.c": {
        "group": "التسريع العتادي", "titleArabic": "فك فيديو باستخدام Intel QSV",
        "short": "يبين مسار Quick Sync Video في فك الترميز.",
        "meaning": "المثال يوضح أن بعض التسريعات العتادية لها إعدادات وسياقات خاصة تختلف عن المسار البرمجي التقليدي.",
        "purpose": "يعلمك المسار الخاص بـ QSV في decoder.",
        "why": "يفيد على الأنظمة التي تعتمد Intel Quick Sync لتسريع الفيديو.",
        "carried": "ينقل الفهم من decoder عامة إلى decoder مرتبطة بمنصة عتادية محددة.",
        "code": "setup_qsv_device(codecCtx);\navcodec_open2(codecCtx, decoder, NULL);\n\nwhile (avcodec_send_packet(codecCtx, &packet) == 0) {\n    while (avcodec_receive_frame(codecCtx, frame) == 0) {\n        // قد تكون frame مرتبطة بسطوح QSV وتحتاج تعاملًا خاصًا\n        process_qsv_frame(frame);\n    }\n}",
        "related": ["avcodec_open2", "avcodec_send_packet", "avcodec_receive_frame"]
    },
    "qsv_transcode.c": {
        "group": "التسريع العتادي", "titleArabic": "تحويل فيديو باستخدام Intel QSV",
        "short": "يجمع بين فك وترميز hardware-accelerated عبر Quick Sync.",
        "meaning": "هذا المثال يوضح pipeline كاملة داخل عتاد واحد لتقليل النقل بين CPU والـ accelerator.",
        "purpose": "يعلمك كيف تبني transcode عتادية بـ QSV.",
        "why": "يفيد عند الحاجة إلى throughput أعلى واستهلاك CPU أقل.",
        "carried": "يربط decode وencode ضمن مسار عتادي موحّد.",
        "code": "decode_with_qsv(inputPacket, decodedFrame);\n\n// نعيد تمرير frame نفسها أو نسخة متوافقة إلى encoder العتادية\navcodec_send_frame(qsvEncCtx, decodedFrame);\nwhile (avcodec_receive_packet(qsvEncCtx, &packet) == 0) {\n    write_transcoded_packet(&packet);\n    av_packet_unref(&packet);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet"]
    },
    "remux.c": {
        "group": "الحاويات والتحويل", "titleArabic": "نقل الحزم بين حاويتين دون إعادة ترميز",
        "short": "يبين remuxing: تغيير الحاوية مع الإبقاء على bitstream نفسها.",
        "meaning": "المعنى الحقيقي أن remux ليس transcode؛ أنت لا تلمس محتوى codec بل تعيد ترتيب الحزم في container أخرى.",
        "purpose": "يعلمك الفرق العملي بين remux وtranscode.",
        "why": "يفيد لتغيير MP4 إلى MKV مثلًا بسرعة عالية ومن دون فقد جديد.",
        "carried": "ينقل packet كما هي تقريبًا، مع تعديل timestamps وmetadata الحاوية فقط.",
        "code": "while (av_read_frame(inFmt, &packet) >= 0) {\n    // لا نفك ولا نعيد ترميز الحزمة، بل نعيد كتابتها في muxer أخرى\n    rescale_packet_timestamps(&packet, inStream, outStream);\n    av_interleaved_write_frame(outFmt, &packet);\n    av_packet_unref(&packet);\n}",
        "related": ["av_read_frame", "AVPacket", "AVFormatContext"]
    },
    "resample_audio.c": {
        "group": "الصوت وإعادة أخذ العينات", "titleArabic": "إعادة أخذ عينات الصوت وتحويل صيغة العينات",
        "short": "يبين كيف تغيّر sample rate أو sample format أو channel layout.",
        "meaning": "المعنى الحقيقي هنا أن resampling ليست تغيير sample rate فقط؛ قد تشمل format/layout أيضًا لتوافق encoder أو جهاز صوت.",
        "purpose": "يعلمك متى تحتاج libswresample في خطوط الصوت.",
        "why": "شائع قبل الترميز أو قبل التشغيل على جهاز يطلب صيغة محددة.",
        "carried": "ينقل الصوت الخام من تمثيل إلى آخر متوافق مع المرحلة التالية.",
        "code": "configure_resampler(swrCtx, inLayout, inFmt, inRate, outLayout, outFmt, outRate);\n\n// هذا الاستدعاء يحوّل عدد العينات وصيغتها وتوزيع القنوات عند الحاجة\noutSamples = swr_convert(swrCtx, outData, outCount, inData, inCount);\nif (outSamples < 0) {\n    return;\n}",
        "related": ["libswresample"]
    },
    "scale_video.c": {
        "group": "الصور والتحجيم", "titleArabic": "تحجيم الفيديو وتحويل صيغة البكسل",
        "short": "يبين استخدام libswscale لتغيير الحجم أو صيغة الصورة.",
        "meaning": "المثال يوضح أن التحجيم في FFmpeg مرتبط أيضًا بتحويل pixel format، لا مجرد تكبير أو تصغير الأبعاد.",
        "purpose": "يعلمك أين تستخدم SwsContext وsws_scale.",
        "why": "ضروري قبل العرض أو الترميز أو الحفظ بصيغة مختلفة.",
        "carried": "ينقل frame من تمثيل بكسلي إلى آخر مع أبعاد جديدة عند الحاجة.",
        "code": "SwsContext *sws = sws_getContext(srcW, srcH, srcFmt, dstW, dstH, dstFmt, SWS_BILINEAR, NULL, NULL, NULL);\n\n// هذا هو الاستدعاء الفعلي الذي ينسخ ويحوّل pixels بين المصدر والوجهة\nsws_scale(sws, srcFrame->data, srcFrame->linesize, 0, srcH, dstFrame->data, dstFrame->linesize);\n\nsws_freeContext(sws);",
        "related": ["sws_getContext", "sws_scale", "sws_freeContext", "SwsContext"]
    },
    "show_metadata.c": {
        "group": "الأدوات والتحليل", "titleArabic": "عرض metadata من الملف أو الـ streams",
        "short": "يبين قراءة metadata النصية من الحاوية والـ streams.",
        "meaning": "الفكرة أن AVFormatContext وAVStream لا تحمل فقط بيانات تشغيل، بل metadata وصفية مثل title وartist وlanguage وغيرها.",
        "purpose": "يعلمك كيف تستعرض metadata في FFmpeg.",
        "why": "مفيد لبناء متصفحات وسائط وأدوات فحص.",
        "carried": "ينقل الحاوية من مجرد بيانات bytes إلى مصدر معلومات وصفية مفيدة.",
        "code": "AVDictionaryEntry *tag = NULL;\nwhile ((tag = av_dict_get(fmtCtx->metadata, \"\", tag, AV_DICT_IGNORE_SUFFIX))) {\n    // metadata هنا أزواج مفتاح وقيمة تصف الملف أو الـ stream\n    printf(\"%s = %s\\n\", tag->key, tag->value);\n}",
        "related": ["AVFormatContext"]
    },
    "transcode.c": {
        "group": "الحاويات والتحويل", "titleArabic": "تحويل ملف كامل مع فلاتر صوت وفيديو",
        "short": "يبين pipeline كاملة: demux + decode + filter + encode + mux.",
        "meaning": "هذا أقرب مثال لمسار إنتاجي كامل في FFmpeg: كل طبقة تعمل بوضوح ضمن pipeline واحدة من الإدخال إلى الإخراج.",
        "purpose": "يعلمك كيف تربط طبقات FFmpeg كلها معًا في عملية تحويل.",
        "why": "هذا هو المثال المرجعي عند بناء أدوات transcode حقيقية.",
        "carried": "ينقل الملف من تمثيل إلى آخر مع إمكان تعديل الصورة والصوت أثناء الطريق.",
        "code": "read_and_demux_packet(&packet);\ndecode_packet_to_frame(decCtx, &packet, frame);\nfilter_frame(filterGraph, frame, filteredFrame);\navcodec_send_frame(encCtx, filteredFrame);\n\nwhile (avcodec_receive_packet(encCtx, &outPacket) == 0) {\n    // packet النهائية هنا جاهزة للدخول إلى muxer الخرج\n    av_interleaved_write_frame(outFmt, &outPacket);\n    av_packet_unref(&outPacket);\n}",
        "related": ["av_read_frame", "avcodec_send_packet", "avcodec_receive_frame", "avcodec_send_frame", "avcodec_receive_packet"]
    },
    "transcode_aac.c": {
        "group": "الحاويات والتحويل", "titleArabic": "تحويل الصوت إلى AAC مع معالجة مطلوبة قبل الترميز",
        "short": "مثال transcode صوتية أكثر تركيزًا على AAC والمتطلبات الشائعة قبل encoder.",
        "meaning": "يوضح أن بعض encoders مثل AAC تحتاج تنسيقًا أو معدل عينات أو frame size مناسبًا قبل نجاح الترميز.",
        "purpose": "يعلمك pipeline صوتية عملية تنتهي بملف AAC أو stream متوافقة.",
        "why": "مفيد عند بناء أدوات تحويل صوت شائعة الاستخدام.",
        "carried": "يربط decode وresample وencode في خط واحد يراعي متطلبات AAC.",
        "code": "decode_input_audio(&packet, decodedFrame);\nresample_if_needed(decodedFrame, encoderInputFrame);\navcodec_send_frame(aacEncCtx, encoderInputFrame);\nwhile (avcodec_receive_packet(aacEncCtx, &packetOut) == 0) {\n    write_output_packet(&packetOut);\n    av_packet_unref(&packetOut);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet"]
    },
    "vaapi_encode.c": {
        "group": "التسريع العتادي", "titleArabic": "ترميز فيديو باستخدام VAAPI",
        "short": "يبين encoder فيديو عتادية على Linux عبر VAAPI.",
        "meaning": "المثال يوضح أن encoder العتادية غالبًا تحتاج surfaces وتهيئة device خاصة قبل إدخال frames.",
        "purpose": "يعلمك مسار الترميز باستخدام VAAPI.",
        "why": "يفيد عند الرغبة في تسريع التصدير أو البث على Linux.",
        "carried": "ينقل الترميز من CPU إلى واجهة VAAPI العتادية.",
        "code": "setup_vaapi_encoder(encCtx);\nload_frame_into_vaapi_surface(swFrame, hwFrame);\navcodec_send_frame(encCtx, hwFrame);\n\nwhile (avcodec_receive_packet(encCtx, &packet) == 0) {\n    write_encoded_packet(&packet);\n    av_packet_unref(&packet);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet"]
    },
    "vaapi_transcode.c": {
        "group": "التسريع العتادي", "titleArabic": "تحويل فيديو باستخدام VAAPI",
        "short": "يجمع بين فك وترميز عتادي عبر VAAPI داخل pipeline واحدة.",
        "meaning": "الهدف الحقيقي هنا تقليل نسخ frames بين CPU وGPU قدر الإمكان في transcode.",
        "purpose": "يعلمك بناء transcode عتادية على Linux.",
        "why": "يفيد للمخرجات العالية أو السيرفرات التي تعالج فيديو كثيرًا.",
        "carried": "يربط decode وfilter وtransfer وencode ضمن مسار VAAPI واحد.",
        "code": "decode_to_hw_frame(decCtx, &packet, hwFrame);\nprepare_vaapi_output(hwFrame);\navcodec_send_frame(encCtx, hwFrame);\nwhile (avcodec_receive_packet(encCtx, &outPacket) == 0) {\n    mux_output_packet(&outPacket);\n    av_packet_unref(&outPacket);\n}",
        "related": ["avcodec_send_frame", "avcodec_receive_packet"]
    }
}

def fetch_examples():
    page = urllib.request.urlopen(BASE + "examples.html").read().decode("utf-8", "ignore")
    rows = re.findall(r'<a class="el" href="([^"]+)">([^<]+\.c)</a>', page)
    return [(name, href) for href, name in rows]

def fetch_brief(href):
    html = urllib.request.urlopen(BASE + href).read().decode("utf-8", "ignore")
    match = re.search(r'<div class="contents">([\\s\\S]{0,1000}?)<div class="fragment">', html)
    raw = re.sub(r"<[^>]+>", " ", match.group(1) if match else "")
    return " ".join(raw.split())

def load_index(folder):
    return json.loads((ROOT / f"content/reference/ffmpeg/{folder}/index.json").read_text())

INDEXES = {folder: load_index(folder) for folder in ["modules", "functions", "structures", "enums", "constants"]}

def find_related(name):
    for data in INDEXES.values():
        for group in data.get("groups", []):
            for item in group.get("items", []):
                if item.get("name") == name:
                    return {"name": item["name"], "hash": item["route"]}
    return None

def update_json(path, transformer):
    data = json.loads(path.read_text())
    data = transformer(data)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

def main():
    examples = fetch_examples()
    examples_dir = ROOT / "content/reference/ffmpeg/examples"
    examples_dir.mkdir(parents=True, exist_ok=True)
    for p in examples_dir.glob("*.json"):
        p.unlink()

    entities = {}
    index_groups = {}
    search_entries = []

    for filename, href in examples:
        info = META[filename]
        brief = fetch_brief(href)
        slug = filename[:-2].replace("_", "-")
        route = f"#ref/ffmpeg/examples/{slug}"
        official_url = BASE + href
        related = [entry for entry in (find_related(name) for name in info.get("related", [])) if entry]

        entity = {
            "schemaVersion": "2026-03-reference-architecture-1",
            "generatedAt": GENERATED_AT,
            "library": {"id": "ffmpeg", "displayName": "FFmpeg", "displayNameArabic": "FFmpeg", "description": LIBRARY_DESCRIPTION},
            "kind": {"id": "examples", "displayName": "Examples", "displayNameArabic": "الأمثلة", "description": EXAMPLES_DESCRIPTION},
            "identity": {"name": filename, "slug": slug, "titleArabic": info["titleArabic"], "aliases": [filename[:-2], filename.replace(".c", "")]},
            "route": {"hash": route, "contentPath": f"content/reference/ffmpeg/examples/{slug}.json"},
            "summary": {
                "actualTranslationArabic": info["titleArabic"],
                "actualMeaningArabic": info["meaning"],
                "purposeArabic": info["purpose"],
                "whyUseArabic": info["why"],
                "carriedValueArabic": info["carried"],
                "sourceDescription": brief
            },
            "signature": {"raw": "", "header": "", "headerUrl": official_url},
            "details": {
                "parameters": [], "fields": [], "values": [],
                "usage": [brief, f"ينتمي هذا المثال إلى مجموعة: {info['group']}."],
                "notes": [
                    "الكود هنا مبسط ومعلّق بالعربية لشرح الفكرة الحقيقية، وليس نسخة حرفية من المثال الرسمي.",
                    "الهدف من هذا المثال هو فهم خط الأنابيب والمرحلة التي يعمل فيها كل استدعاء داخل FFmpeg."
                ],
                "remarks": ["عند نقل الفكرة إلى مشروع فعلي ستحتاج معالجة أخطاء كاملة وتحرير موارد أدق من هذا المثال المختصر."],
                "instructions": [
                    "اقرأ أسماء الدوال في المثال بوصفها مراحل pipeline لا كسطور مستقلة فقط.",
                    "اربط بين هذا المثال والعناصر المرتبطة أسفل الصفحة لفهم البنى والدوال التي يعتمد عليها."
                ],
                "lifecycle": ["تهيئة الموارد أو السياقات المطلوبة", "تنفيذ مرحلة المثال الأساسية", "سحب الناتج أو تمريره للمرحلة التالية", "تحرير الموارد عند الانتهاء"],
                "returns": "",
                "threadSafety": "",
                "examples": [{"title": "الهيكل المبسط للمثال", "code": info["code"]}]
            },
            "links": {"officialUrl": official_url, "sourceUrl": official_url, "related": related},
            "source": {"dataset": "FFmpeg Doxygen 8.0 examples", "category": "الأمثلة", "packageKey": "", "packageName": "FFmpeg"}
        }
        (examples_dir / f"{slug}.json").write_text(json.dumps(entity, ensure_ascii=False, indent=2) + "\n")

        entities[f"examples/{slug}"] = {
            "summaryArabic": brief or info["short"],
            "officialReferences": [{
                "label": filename,
                "href": official_url,
                "sourceName": "FFmpeg Official Doxygen",
                "noteArabic": f"المرجع الرسمي لمثال {filename}."
            }]
        }

        item = {"name": filename, "slug": slug, "titleArabic": info["titleArabic"], "shortDescription": info["short"], "route": route, "officialUrl": official_url}
        index_groups.setdefault(info["group"], []).append(item)

        search_entries.append({
            "libraryId": "ffmpeg",
            "name": filename,
            "displayName": filename,
            "slug": slug,
            "kind": "examples",
            "kindLabelArabic": "الأمثلة",
            "iconType": "tutorial",
            "sectionKey": "examples",
            "sectionTitle": "الأمثلة",
            "titleArabic": info["titleArabic"],
            "description": info["short"],
            "groupTitle": info["group"],
            "route": route,
            "officialUrl": official_url,
            "aliases": [filename[:-2], filename.replace(".c", "")],
            "tooltip": info["titleArabic"]
        })

    examples_index = {
        "schemaVersion": "2026-03-reference-architecture-1",
        "generatedAt": GENERATED_AT,
        "library": {"id": "ffmpeg", "displayName": "FFmpeg", "displayNameArabic": "FFmpeg", "description": LIBRARY_DESCRIPTION},
        "kind": {"id": "examples", "displayName": "Examples", "displayNameArabic": "الأمثلة", "description": EXAMPLES_DESCRIPTION},
        "totalCount": len(search_entries),
        "routes": {"hub": "#ref", "library": "#ref/ffmpeg", "kind": "#ref/ffmpeg/examples"},
        "groups": [{"letter": title[:1], "title": title, "items": items} for title, items in index_groups.items()]
    }
    (examples_dir / "index.json").write_text(json.dumps(examples_index, ensure_ascii=False, indent=2) + "\n")

    def transform_ffmpeg_index(data):
        data["kinds"] = [k for k in data["kinds"] if k["id"] != "examples"] + [{
            "id": "examples",
            "displayName": "Examples",
            "displayNameArabic": "الأمثلة",
            "description": "أمثلة FFmpeg الرسمية مبسطة بالعربية مع تعليقات تشرح المعنى الحقيقي لخط الأنابيب البرمجي.",
            "count": len(search_entries),
            "path": "content/reference/ffmpeg/examples/index.json",
            "route": "#ref/ffmpeg/examples"
        }]
        data["totalCount"] = sum(int(k["count"]) for k in data["kinds"])
        data["generatedAt"] = GENERATED_AT
        return data

    update_json(ROOT / "content/reference/ffmpeg/index.json", transform_ffmpeg_index)

    def transform_manifest(data):
        for lib in data["libraries"]:
            if lib["id"] == "ffmpeg":
                lib["kinds"] = [k for k in lib["kinds"] if k["id"] != "examples"] + [{
                    "id": "examples",
                    "displayName": "Examples",
                    "displayNameArabic": "الأمثلة",
                    "description": "أمثلة FFmpeg الرسمية مبسطة بالعربية مع تعليقات تشرح المعنى الحقيقي لخط الأنابيب البرمجي.",
                    "count": len(search_entries),
                    "path": "content/reference/ffmpeg/examples/index.json",
                    "route": "#ref/ffmpeg/examples"
                }]
                lib["totalCount"] = sum(int(k["count"]) for k in lib["kinds"])
        data["generatedAt"] = GENERATED_AT
        return data

    update_json(ROOT / "content/reference/manifest.json", transform_manifest)

    def transform_official(data):
        for key in list(data.get("entities", {}).keys()):
            if key.startswith("examples/"):
                del data["entities"][key]
        data["entities"].update(entities)
        return data

    update_json(ROOT / "content/reference/ffmpeg/official-links.json", transform_official)

    def transform_search(data):
        data["entries"] = [e for e in data["entries"] if e.get("kind") != "examples"] + search_entries
        data["meta"]["sections"] = [s for s in data["meta"]["sections"] if s["key"] != "examples"] + [{
            "key": "examples",
            "title": "الأمثلة",
            "description": "أمثلة FFmpeg الرسمية مبسطة بالعربية مع تعليقات تشرح المعنى الحقيقي للكود.",
            "count": len(search_entries)
        }]
        data["meta"]["descriptions"]["examples"] = "أمثلة FFmpeg الرسمية مبسطة بالعربية مع تعليقات تشرح المعنى الحقيقي للكود."
        data["meta"]["totalCount"] = len(data["entries"])
        data["meta"]["generatedAt"] = GENERATED_AT
        return data

    update_json(ROOT / "data/ui/ffmpeg/search.json", transform_search)

    print(f"generated examples {len(search_entries)}")

if __name__ == "__main__":
    main()
