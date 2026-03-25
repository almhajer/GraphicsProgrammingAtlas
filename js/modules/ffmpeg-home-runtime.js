(function(global) {
  'use strict';

  const FALLBACK_FFMPEG_HOME_CONFIG = Object.freeze({
    meta: Object.freeze({
      title: 'FFmpeg',
      kicker: 'معالجة الوسائط وترميزها',
      description: 'مدخل عربي عملي إلى FFmpeg يربط المكتبات الفرعية الأساسية مع الدوال والبنى والتعدادات والثوابت التي يبدأ منها معظم التكامل الحقيقي.',
      summaryNote: 'هذا المدخل يوسّع FFmpeg داخل طبقة المرجع المعياري الحالية مع الحفاظ على نفس أسلوب البطاقات والروابط الداخلية المستخدم في C++ وبقية المكتبات.',
      statusNote: 'الدفعة الحالية تغطي ست طبقات مترابطة: المكتبات الفرعية، والدوال العملية، والبنى الأساسية وبنى hwaccel وأجهزة libavdevice وفلاتر libswscale، والتعدادات المتكررة، والثوابت والأعلام وثوابت النسخة، ثم أمثلة FFmpeg الرسمية المبسطة بالعربية مع تعليقات تشرح المعنى الحقيقي لخط الأنابيب البرمجي.',
      references: Object.freeze([
        Object.freeze({label: 'FFmpeg Doxygen: Main Page', href: 'https://www.ffmpeg.org/doxygen/trunk/index.html'}),
        Object.freeze({label: 'FFmpeg Doxygen: libavformat', href: 'https://www.ffmpeg.org/doxygen/trunk/avformat_8h.html'}),
        Object.freeze({label: 'FFmpeg Doxygen: libavcodec', href: 'https://www.ffmpeg.org/doxygen/trunk/avcodec_8h.html'})
      ])
    }),
    featuredEntries: Object.freeze([
      Object.freeze({kindId: 'modules', slug: 'libavformat', label: 'libavformat'}),
      Object.freeze({kindId: 'functions', slug: 'avformat-open-input', label: 'avformat_open_input'}),
      Object.freeze({kindId: 'functions', slug: 'av-read-frame', label: 'av_read_frame'}),
      Object.freeze({kindId: 'structures', slug: 'av-format-context', label: 'AVFormatContext'}),
      Object.freeze({kindId: 'enums', slug: 'av-media-type', label: 'AVMediaType'}),
      Object.freeze({kindId: 'constants', slug: 'av-time-base', label: 'AV_TIME_BASE'}),
      Object.freeze({kindId: 'structures', slug: 'av-codec-context', label: 'AVCodecContext'}),
      Object.freeze({kindId: 'structures', slug: 'av-frame', label: 'AVFrame'}),
      Object.freeze({kindId: 'examples', slug: 'decode-video', label: 'decode_video.c'}),
      Object.freeze({kindId: 'examples', slug: 'transcode', label: 'transcode.c'})
    ]),
    sections: Object.freeze([
      Object.freeze({
        key: 'modules',
        title: 'المكتبات الفرعية',
        description: 'المكتبات الأساسية مقسّمة حسب الوظيفة: مسار فك الترميز، معالجة وتحويل الوسائط، والدعم والأجهزة.',
        iconType: 'file',
        count: 7
      }),
      Object.freeze({
        key: 'functions',
        title: 'الدوال',
        description: 'الدوال العملية مقسّمة حسب المرحلة: فتح المصدر، واختيار الـ stream والـ decoder، ثم التحويل والتحجيم والتنظيف.',
        iconType: 'function',
        count: 40
      }),
      Object.freeze({
        key: 'structures',
        title: 'البنى',
        description: 'السياقات والحاويات مقسّمة حسب الدور: سياقات المسار الرئيسي، وحاويات البيانات المضغوطة والمفكوكة، وسياقات hwaccel المنصاتية، وحاويات الأجهزة وفلاتر swscale.',
        iconType: 'structure',
        count: 13
      }),
      Object.freeze({
        key: 'enums',
        title: 'التعدادات',
        description: 'تعدادات أساسية مثل AVMediaType وAVPixelFormat وAVCodecID وAVDiscard إضافة إلى رسائل التحكم في libavdevice تشرح كيف يميز FFmpeg نوع الوسائط وصيغة الصورة وسياسات الإسقاط والأحداث.',
        iconType: 'enum',
        count: 6
      }),
      Object.freeze({
        key: 'constants',
        title: 'الثوابت',
        description: 'ثوابت عملية متكررة مثل AV_TIME_BASE وAVERROR_EOF وAV_INPUT_BUFFER_PADDING_SIZE إضافة إلى أعلام وقدرات codec مثل AV_CODEC_FLAG_COPY_OPAQUE وAV_CODEC_CAP_DR1 وثوابت النسخة مثل LIBAVCODEC_VERSION_INT وLIBAVCODEC_IDENT وLIBAVDEVICE_IDENT.',
        iconType: 'constant',
        count: 18
      }),
      Object.freeze({
        key: 'examples',
        title: 'الأمثلة',
        description: 'أمثلة FFmpeg الرسمية مبسطة بالعربية مع تعليقات تشرح لماذا تُستدعى كل مرحلة في pipeline، مثل فك الترميز، والتحويل، والفلترة، والترميز، والـ remuxing، والتسريع العتادي.',
        iconType: 'book',
        count: 25
      })
    ])
  });

  function createFfmpegHomeRuntime(api = {}) {
    const {renderCodicon} = api;

    function getFfmpegHomeConfig() {
      return FALLBACK_FFMPEG_HOME_CONFIG;
    }

    function getFfmpegHomeSections() {
      return getFfmpegHomeConfig().sections.slice();
    }

    function getFfmpegHomeRecentItems() {
      return getFfmpegHomeConfig().featuredEntries.map((entry) => ({
        label: entry.label,
        iconType: entry.kindId === 'examples'
          ? 'book'
          : (entry.kindId === 'structures'
            ? 'structure'
            : (entry.kindId === 'functions'
              ? 'function'
              : (entry.kindId === 'enums'
                ? 'enum'
                : (entry.kindId === 'constants' ? 'constant' : 'file')))),
        action: `showReferenceEntity('ffmpeg', '${entry.kindId}', '${entry.slug}')`,
        tooltip: `يفتح ${entry.label} داخل مرجع FFmpeg المحلي.`
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
          {label: 'افتح مرجع FFmpeg', iconType: 'file', action: `showReferenceLibraryIndex('ffmpeg')`, primary: true},
          {label: 'المكتبات الفرعية', iconType: 'file', action: `showReferenceKindIndex('ffmpeg', 'modules')`},
          {label: 'الدوال', iconType: 'function', action: `showReferenceKindIndex('ffmpeg', 'functions')`},
          {label: 'البنى', iconType: 'structure', action: `showReferenceKindIndex('ffmpeg', 'structures')`},
          {label: 'التعدادات', iconType: 'enum', action: `showReferenceKindIndex('ffmpeg', 'enums')`},
          {label: 'الثوابت', iconType: 'constant', action: `showReferenceKindIndex('ffmpeg', 'constants')`},
          {label: 'الأمثلة', iconType: 'book', action: `showReferenceKindIndex('ffmpeg', 'examples')`}
        ],
        cards: sections.map((section) => ({
          count: Number(section.count) || 0,
          iconType: section.iconType || 'file',
          title: section.title,
          note: section.description,
          action: `showReferenceKindIndex('ffmpeg', '${section.key}')`
        })),
        quickLinks: [
          {label: 'مرجع FFmpeg الكامل', iconType: 'file', action: `showReferenceLibraryIndex('ffmpeg')`, primary: true},
          {label: 'libavformat', iconType: 'file', action: `showReferenceEntity('ffmpeg', 'modules', 'libavformat')`},
          {label: 'avformat_open_input', iconType: 'function', action: `showReferenceEntity('ffmpeg', 'functions', 'avformat-open-input')`},
          {label: 'avcodec_send_packet', iconType: 'function', action: `showReferenceEntity('ffmpeg', 'functions', 'avcodec-send-packet')`},
          {label: 'AVMediaType', iconType: 'enum', action: `showReferenceEntity('ffmpeg', 'enums', 'av-media-type')`},
          {label: 'AV_TIME_BASE', iconType: 'constant', action: `showReferenceEntity('ffmpeg', 'constants', 'av-time-base')`},
          {label: 'AVFormatContext', iconType: 'structure', action: `showReferenceEntity('ffmpeg', 'structures', 'av-format-context')`},
          {label: 'AVFrame', iconType: 'structure', action: `showReferenceEntity('ffmpeg', 'structures', 'av-frame')`},
          {label: 'decode_video.c', iconType: 'book', action: `showReferenceEntity('ffmpeg', 'examples', 'decode-video')`},
          {label: 'transcode.c', iconType: 'book', action: `showReferenceEntity('ffmpeg', 'examples', 'transcode')`}
        ],
        recentIconType: 'file',
        recentItems: getFfmpegHomeRecentItems(),
        recentEmptyText: 'لا توجد عناصر FFmpeg بارزة في هذه اللحظة.',
        supportLinks: [
          {label: 'المرجع المحلي', action: `showReferenceLibraryIndex('ffmpeg')`, iconType: 'file'},
          {
            label: 'FFmpeg Doxygen',
            href: 'https://www.ffmpeg.org/doxygen/trunk/index.html',
            icon: typeof renderCodicon === 'function' ? renderCodicon('book', 'ui-codicon list-icon', 'مرجع') : ''
          }
        ],
        extraSectionsHtml: ''
      };
    }

    return {
      getFfmpegHomeConfig,
      getFfmpegHomeSections,
      getFfmpegHomeRecentItems,
      buildFfmpegHomeLibraryModel
    };
  }

  global.createFfmpegHomeRuntime = createFfmpegHomeRuntime;
  global.__ARABIC_VULKAN_FFMPEG_HOME_RUNTIME__ = {
    createFfmpegHomeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
