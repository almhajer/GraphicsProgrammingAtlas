// كتالوجات الأمثلة الجاهزة وخرائط النقل بين الأقسام.
window.__ARABIC_VULKAN_CONTENT_CATALOGS__ = (() => {

const SDL3_HOME_FALLBACK_PACKAGE_META = {
  core: {
    key: 'core',
    displayName: 'SDL3 API',
    packageName: 'SDL3',
    description: 'النواة الأساسية لـ SDL3 وتشمل إدارة النافذة والإدخال والأحداث والصوت والربط مع واجهات الرسوميات مثل Vulkan.',
    overviewUrl: 'https://wiki.libsdl.org/SDL3/APIByCategory',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3/FrontPage',
    visibleCounts: {
      functions: 1245,
      macros: 1290,
      constants: 1152,
      variables: 95,
      structures: 157
    }
  },
  audio: {
    key: 'audio',
    displayName: 'SDL3Audio',
    packageName: 'SDL3Audio',
    description: 'فرع الصوت في SDL3: الأجهزة الصوتية، SDL_AudioStream، تحميل WAV، تحويل PCM، والمواصفات والماكرو الرسمية المرتبطة بالصوت.',
    overviewUrl: 'https://wiki.libsdl.org/SDL3/CategoryAudio',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3/CategoryAudio',
    visibleCounts: {
      functions: 58,
      macros: 16,
      constants: 15,
      variables: 5,
      structures: 1
    }
  },
  image: {
    key: 'image',
    displayName: 'SDL3_image',
    packageName: 'SDL3_image',
    description: 'ملحق الصور الرسمي لتحميل الصور والرسوم المتحركة وتحويلها إلى بيانات قابلة للاستهلاك داخل SDL3.',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_image/CategoryAPI',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_image/FrontPage',
    visibleCounts: {
      functions: 110,
      macros: 41,
      constants: 4,
      variables: 0,
      structures: 4
    }
  },
  mixer: {
    key: 'mixer',
    displayName: 'SDL3_mixer',
    packageName: 'SDL3_mixer',
    description: 'ملحق الصوت الرسمي لتحميل وتشغيل ومزج الملفات والمسارات الصوتية فوق SDL3.',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_mixer/CategorySDLMixer',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_mixer/FrontPage',
    visibleCounts: {
      functions: 94,
      macros: 5,
      constants: 0,
      variables: 4,
      structures: 7
    }
  },
  ttf: {
    key: 'ttf',
    displayName: 'SDL3_ttf',
    packageName: 'SDL3_ttf',
    description: 'ملحق الخطوط والنصوص الرسمي في SDL3 لتحميل الخطوط ورسم النصوص وإدارة محركات عرض النص.',
    overviewUrl: 'https://wiki.libsdl.org/SDL3_ttf/CategoryAPI',
    frontPageUrl: 'https://wiki.libsdl.org/SDL3_ttf/FrontPage',
    visibleCounts: {
      functions: 119,
      macros: 48,
      constants: 22,
      variables: 2,
      structures: 7
    }
  }
};

const SDL3_READY_EXAMPLES = Object.freeze([
  {
    id: 'audio-open-device-stream',
    packageKey: 'audio',
    title: 'مثال فتح جهاز صوت وتشغيل SDL_AudioStream',
    goal: 'يبين هذا المثال المسار الحديث في SDL3 للصوت: فتح جهاز تشغيل، إنشاء SDL_AudioStream، دفع عينات PCM إلى stream، ثم استئناف الجهاز ليبدأ التشغيل.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'يحتاج إلى SDL3 الأساسية فقط.',
      'الكود يفترض أنك تملك عينات PCM جاهزة داخل الذاكرة أو ولّدتها مسبقًا.',
      'الدفق يبدأ فعليًا بعد SDL_ResumeAudioDevice لأن بعض مسارات الصوت تبدأ في حالة paused.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = {
        .format = SDL_AUDIO_F32,
        .channels = 2,
        .freq = 48000
    };

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) {
        SDL_Log("فشل فتح جهاز الصوت: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream) {
        SDL_Log("فشل إنشاء SDL_AudioStream: %s", SDL_GetError());
        SDL_CloseAudioDevice(device);
        SDL_Quit();
        return 1;
    }

    if (!SDL_BindAudioStream(device, stream)) {
        SDL_Log("فشل ربط stream بالجهاز: %s", SDL_GetError());
        SDL_DestroyAudioStream(stream);
        SDL_CloseAudioDevice(device);
        SDL_Quit();
        return 1;
    }

    float samples[48000 * 2] = {0};

    // هنا نضع بيانات PCM داخل stream بدل التعامل المباشر مع callback قديم.
    if (!SDL_PutAudioStreamData(stream, samples, sizeof(samples))) {
        SDL_Log("فشل ضخ البيانات الصوتية: %s", SDL_GetError());
    }

    // الجهاز قد يكون متوقفًا مؤقتًا بعد الفتح، لذا نعيد تشغيله صراحة.
    SDL_ResumeAudioDevice(device);

    SDL_Delay(1000);

    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_OpenAudioDevice يفتح المسار الفعلي نحو جهاز التشغيل، بينما SDL_CreateAudioStream يصبح نقطة التعامل اليومية مع البيانات.',
      'SDL_BindAudioStream يربط الدفق بالجهاز كي يسحب الجهاز البيانات من stream عند الحاجة بدل أن تدير مخازن الخرج بنفسك.',
      'SDL_PutAudioStreamData يضع PCM داخل الدفق، ثم SDL_ResumeAudioDevice يبدأ السحب الفعلي للعينات إلى السماعات.'
    ],
    expectedResult: 'يُفتح جهاز التشغيل، ويُنشأ AudioStream مربوط به، ثم يبدأ الجهاز في استهلاك عينات PCM من الدفق حتى ينتهي المخزن.',
    related: [
      'SDL_Init',
      'SDL_INIT_AUDIO',
      'SDL_AudioSpec',
      'SDL_AUDIO_F32',
      'SDL_OpenAudioDevice',
      'SDL_CreateAudioStream',
      'SDL_BindAudioStream',
      'SDL_PutAudioStreamData',
      'SDL_ResumeAudioDevice',
      'SDL_UnbindAudioStream',
      'SDL_DestroyAudioStream',
      'SDL_CloseAudioDevice'
    ],
    previewKind: 'audio-system',
    previewTitle: 'فتح جهاز تشغيل وربطه بـ SDL_AudioStream.'
  },
  {
    id: 'audio-load-wav-stream',
    packageKey: 'audio',
    title: 'مثال تحميل WAV وضخه إلى SDL_AudioStream',
    goal: 'يوضح هذا المثال كيف تستخدم SDL_LoadWAV لتحميل ملف WAV إلى الذاكرة ثم تدفعه إلى SDL_AudioStream بدل الكتابة إلى جهاز الصوت يدويًا.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'يحتاج ملف WAV صالحًا مثل sample.wav.',
      'يصلح هذا المسار عندما يكون المصدر WAV بسيطًا ولا تحتاج فك ترميز خارجيًا.',
      'إذا اختلف تنسيق الملف عن تنسيق الخرج فـ SDL_AudioStream يتولى التحويل بينهما.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec wav_spec;
    Uint8 *wav_data = NULL;
    Uint32 wav_size = 0;

    if (!SDL_LoadWAV("sample.wav", &wav_spec, &wav_data, &wav_size)) {
        SDL_Log("فشل تحميل WAV: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &wav_spec);
    SDL_AudioStream *stream = device ? SDL_CreateAudioStream(&wav_spec, &wav_spec) : NULL;

    if (!device || !stream || !SDL_BindAudioStream(device, stream)) {
        SDL_Log("فشل تجهيز مسار تشغيل WAV: %s", SDL_GetError());
        SDL_DestroyAudioStream(stream);
        SDL_CloseAudioDevice(device);
        SDL_free(wav_data);
        SDL_Quit();
        return 1;
    }

    // نمرر كل بيانات الملف مرة واحدة، والـ stream يوزعها على الجهاز حسب حاجته.
    SDL_PutAudioStreamData(stream, wav_data, wav_size);
    SDL_ResumeAudioDevice(device);

    SDL_Delay(1500);

    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_free(wav_data);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_LoadWAV يمنحك مواصفات الملف والبيانات الخام داخل الذاكرة مباشرة إذا كان المصدر WAV.',
      'استخدام WAV spec نفسه عند فتح الجهاز وإنشاء stream يجعل المثال واضحًا قبل إدخال تحويلات إضافية في التنسيق.',
      'الذاكرة التي تعيدها SDL_LoadWAV يجب تحريرها بعد انتهاء الضخ والتشغيل.'
    ],
    expectedResult: 'يُحمَّل ملف WAV إلى الذاكرة، ثم يُشغَّل عبر جهاز التشغيل الافتراضي باستخدام SDL_AudioStream.',
    related: [
      'SDL_LoadWAV',
      'SDL_AudioSpec',
      'SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK',
      'SDL_OpenAudioDevice',
      'SDL_CreateAudioStream',
      'SDL_BindAudioStream',
      'SDL_PutAudioStreamData',
      'SDL_ResumeAudioDevice'
    ],
    previewKind: 'audio-playback-control',
    previewTitle: 'تحميل WAV ثم ضخه إلى الدفق الصوتي.'
  },
  {
    id: 'audio-enumerate-devices',
    packageKey: 'audio',
    title: 'مثال تعداد أجهزة الصوت والاستعلام عن خصائصها',
    goal: 'يجمع هذا المثال أجهزة التشغيل المتاحة، يطبع أسماءها، ثم يقرأ تنسيق أحد الأجهزة كي تعرف ما يقبله العتاد أو النظام فعليًا.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'يحتاج إلى SDL3 الأساسية فقط.',
      'هذا المثال مناسب قبل فتح الجهاز إذا كنت تريد عرض قائمة اختيار للمستخدم.',
      'الاستعلامات الصوتية هنا تساعدك على فهم ما يقدمه النظام قبل بناء stream أو تحويل البيانات.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    int count = 0;
    SDL_AudioDeviceID *devices = SDL_GetAudioPlaybackDevices(&count);
    if (!devices) {
        SDL_Log("فشل تعداد أجهزة التشغيل: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    for (int i = 0; i < count; ++i) {
        const char *name = SDL_GetAudioDeviceName(devices[i]);
        SDL_Log("جهاز %d: %s", i, name ? name : "غير معروف");
    }

    if (count > 0) {
        SDL_AudioSpec obtained;

        // نقرأ المواصفات الفعلية للجهاز بدل افتراض تنسيق ثابت في التطبيق.
        if (SDL_GetAudioDeviceFormat(devices[0], &obtained, NULL)) {
            SDL_Log("freq=%d channels=%d format=%s",
                obtained.freq,
                obtained.channels,
                SDL_GetAudioFormatName(obtained.format));
        }
    }

    SDL_free(devices);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_GetAudioPlaybackDevices يعيد قائمة معرفات منطقية تمثل أجهزة التشغيل التي يمكن للمستخدم الاختيار منها.',
      'SDL_GetAudioDeviceName يحول المعرّف إلى اسم مناسب للعرض في الإعدادات أو الواجهة.',
      'SDL_GetAudioDeviceFormat وSDL_GetAudioFormatName يكشفان التنسيق الفعلي المتوقع قبل بناء بقية مسار الصوت.'
    ],
    expectedResult: 'تظهر قائمة أجهزة التشغيل المتاحة، ومع أول جهاز تُطبع تردداته وعدد قنواته وصيغة العينات بصيغة مفهومة.',
    related: [
      'SDL_GetAudioPlaybackDevices',
      'SDL_GetAudioDeviceName',
      'SDL_GetAudioDeviceFormat',
      'SDL_GetAudioFormatName',
      'SDL_AudioDeviceID',
      'SDL_AudioSpec'
    ],
    previewKind: 'audio-state',
    previewTitle: 'تعداد أجهزة الصوت وقراءة خصائص أول جهاز متاح.'
  },
  {
    id: 'audio-generate-tone',
    packageKey: 'audio',
    title: 'مثال توليد نغمة جيبية وتشغيلها',
    goal: 'يولّد هذا المثال موجة جيبية بسيطة عند تردد 440Hz (نغمة A4) ويدفعها إلى جهاز التشغيل عبر SDL_AudioStream. هذا أساس أي تطبيق يصدر صوتًا مبرمجًا.',
    headers: ['SDL3/SDL.h', 'math.h'],
    requirements: [
      'SDL3 الأساسية فقط، لا حاجة لملفات خارجية.',
      'الموجة الجيبية هي أبسط شكل لبناء صوت صناعي، ويمكن تعديل التردد بسهولة.',
      'عدد العينات في كل إطار يعتمد على التردد وعدد القنوات ومعدل العينات.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

#define TONE_FREQ 440.0f
#define SAMPLE_RATE 48000
#define DURATION_SEC 2

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = {
        .format = SDL_AUDIO_F32,
        .channels = 1,
        .freq = SAMPLE_RATE
    };

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) {
        SDL_Log("فشل فتح جهاز الصوت: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream || !SDL_BindAudioStream(device, stream)) {
        SDL_Log("فشل تجهيز الدفق: %s", SDL_GetError());
        SDL_DestroyAudioStream(stream);
        SDL_CloseAudioDevice(device);
        SDL_Quit();
        return 1;
    }

    int total_samples = SAMPLE_RATE * DURATION_SEC;
    float *buf = SDL_malloc(total_samples * sizeof(float));

    for (int i = 0; i < total_samples; ++i) {
        float t = (float)i / SAMPLE_RATE;
        buf[i] = 0.3f * sinf(2.0f * 3.14159265f * TONE_FREQ * t);
    }

    SDL_PutAudioStreamData(stream, buf, total_samples * sizeof(float));
    SDL_ResumeAudioDevice(device);
    SDL_Delay(DURATION_SEC * 1000 + 200);

    SDL_free(buf);
    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'صيغة توليد الموجة الجيبية: A * sin(2 * PI * freq * t) حيث A السعة وfreq التردد وt الزمن.',
      'عدد العينات الكلي = معدل العينات × المدة بالثواني × عدد القنوات.',
      'السعة 0.3f تمنع التشبع وتحمي السماعات من صوت عالٍ جدًا.'
    ],
    expectedResult: 'يُسمع نغمة A4 (440Hz) لمدة ثانيتين من السماعات الافتراضية.',
    related: [
      'SDL_OpenAudioDevice',
      'SDL_CreateAudioStream',
      'SDL_BindAudioStream',
      'SDL_PutAudioStreamData',
      'SDL_ResumeAudioDevice',
      'SDL_AUDIO_F32'
    ],
    previewKind: 'audio-system',
    previewTitle: 'توليد موجة جيبية 440Hz وتشغيلها.'
  },
  {
    id: 'audio-record-capture',
    packageKey: 'audio',
    title: 'مثال تسجيل صوت من الميكروفون وقراءة العينات',
    goal: 'يفتح هذا المثال جهاز التسجيل (capture) ويقرأ عينات PCM من الميكروفون. هذا أساس أي تطبيق يعالج المدخلات الصوتية مثل VOIP أو تحليل الصوت.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'يحتاج إلى ميكروفون متصل بالنظام.',
      'بعض الأنظمة تطلب صلاحيات وصول إلى الميكروفون.',
      'المثال يقرأ العينات فقط ولا يحفظها إلى ملف، لكن يمكن تمديده بسهولة.'
    ],
    code: `#include <SDL3/SDL.h>

#define CAPTURE_SEC 3

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = {
        .format = SDL_AUDIO_F32,
        .channels = 1,
        .freq = 48000
    };

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_RECORDING, &spec);
    if (!device) {
        SDL_Log("فشل فتح جهاز التسجيل: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    SDL_Log("جاري التسجيل لمدة %d ثانية...", CAPTURE_SEC);

    int total_samples = spec.freq * CAPTURE_SEC;
    float *buf = SDL_malloc(total_samples * sizeof(float));
    int obtained = 0;

    while (obtained < total_samples) {
        int remaining = total_samples - obtained;
        int got = SDL_GetAudioStreamData(
            SDL_GetAudioStreamDevice(device), (void *)(buf + obtained),
            remaining * sizeof(float));
        if (got <= 0) {
            SDL_Delay(10);
            continue;
        }
        obtained += got / (int)sizeof(float);
    }

    SDL_Log("تم تسجيل %d عينة (%.2f ثانية)", obtained, (float)obtained / spec.freq);

    float peak = 0.0f;
    for (int i = 0; i < obtained; ++i) {
        float abs_val = buf[i] < 0 ? -buf[i] : buf[i];
        if (abs_val > peak) peak = abs_val;
    }
    SDL_Log("أعلى ذروة: %.4f", peak);

    SDL_free(buf);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_AUDIO_DEVICE_DEFAULT_RECORDING يفتح جهاز الإدخال بدل الإخراج.',
      'SDL_GetAudioStreamDevice يحصل على الدفق المرتبط بالجهاز مباشرة لقراءة العينات.',
      'حساب الذروة (peak) يوضح كيف تحلل البيانات الخام بعد التسجيل.'
    ],
    expectedResult: 'يُسجّل الصوت من الميكروفون لمدة 3 ثوانٍ ثم يُطبع عدد العينات وأعلى ذروة صوتية.',
    related: [
      'SDL_OpenAudioDevice',
      'SDL_AUDIO_DEVICE_DEFAULT_RECORDING',
      'SDL_GetAudioStreamDevice',
      'SDL_GetAudioStreamData',
      'SDL_AudioSpec'
    ],
    previewKind: 'audio-system',
    previewTitle: 'تسجيل صوت من الميكروفون وقراءة العينات.'
  },
  {
    id: 'audio-format-conversion',
    packageKey: 'audio',
    title: 'مثال تحويل تنسيق صوتي بين S16 و F32',
    goal: 'يوضح هذا المثال كيف يستخدم SDL_AudioStream لتحويل البيانات الصوتية من تنسيق إلى آخر. هذا أساسي عند التعامل مع مكتبات أو أجهزة تتطلب تنسيقات مختلفة.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'SDL3 الأساسية فقط.',
      'التحويل بين S16 (صحيح 16-bit) و F32 (عائم 32-bit) هو الأكثر شيوعًا في تطبيقات الوسائط.',
      'يمكن تعديل التنسيقات ليشمل قنوات متعددة أو معدلات عينات مختلفة.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec src_spec = {
        .format = SDL_AUDIO_S16,
        .channels = 2,
        .freq = 44100
    };

    SDL_AudioSpec dst_spec = {
        .format = SDL_AUDIO_F32,
        .channels = 1,
        .freq = 48000
    };

    SDL_AudioStream *stream = SDL_CreateAudioStream(&src_spec, &dst_spec);
    if (!stream) {
        SDL_Log("فشل إنشاء الدفق: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    int src_frame_size = 1024;
    Sint16 src_buf[1024 * 2] = {0};

    for (int i = 0; i < src_frame_size * 2; ++i) {
        src_buf[i] = (Sint16)(10000 * sinf(2.0f * 3.14159f * 440.0f * i / 44100.0f));
    }

    if (!SDL_PutAudioStreamData(stream, src_buf, sizeof(src_buf))) {
        SDL_Log("فشل ضخ البيانات: %s", SDL_GetError());
    }

    float dst_buf[4096];
    int got = SDL_GetAudioStreamData(stream, dst_buf, sizeof(dst_buf));
    if (got > 0) {
        int samples = got / (int)sizeof(float);
        SDL_Log("تم تحويل %d عينة: S16/44100/stereo -> F32/48000/mono", samples);
    }

    SDL_DestroyAudioStream(stream);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_CreateAudioStream يأخذ مواصفات المصدر والهدف ويقوم بالتحويل تلقائيًا عند النقل.',
      'التحويل يشمل: نوع العينات، عدد القنوات، ومعدل العينات في خطوة واحدة.',
      'SDL_PutAudioStreamData للإدخال و SDL_GetAudioStreamData للإخراج المحوّل.'
    ],
    expectedResult: 'يُحوّل 2048 عينة S16 ستيريو 44100Hz إلى عينات F32 مونو 48000Hz ويطبع العدد.',
    related: [
      'SDL_CreateAudioStream',
      'SDL_PutAudioStreamData',
      'SDL_GetAudioStreamData',
      'SDL_AUDIO_S16',
      'SDL_AUDIO_F32',
      'SDL_AudioSpec'
    ],
    previewKind: 'audio-system',
    previewTitle: 'تحويل تنسيق صوتي بين S16 و F32.'
  },
  {
    id: 'audio-volume-control',
    packageKey: 'audio',
    title: 'مثال التحكم بمستوى الصوت قبل التشغيل',
    goal: 'يوضح هذا المثال كيف تضبط مستوى الصوت برمجيًا بضرب كل عينة في معامل مضروب قبل دفعها إلى الدفق. هذا أبسط طريقة لبناء تحكم بالصوت.',
    headers: ['SDL3/SDL.h', 'math.h'],
    requirements: [
      'SDL3 الأساسية فقط.',
      'ضرب العينات في قيمة بين 0.0 و 1.0 يتحكم بالصوت بدون تغيير البيانات الأصلية.',
      'يمكن تمديد هذا المثال لتشمل مؤثرات أخرى مثل التلاشي (fade in/out).'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

#define SAMPLE_RATE 48000
#define DURATION_SEC 2
#define TONE_FREQ 440.0f

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = { .format = SDL_AUDIO_F32, .channels = 1, .freq = SAMPLE_RATE };
    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) { SDL_Quit(); return 1; }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream || !SDL_BindAudioStream(device, stream)) { SDL_Quit(); return 1; }

    int total = SAMPLE_RATE * DURATION_SEC;
    float *buf = SDL_malloc(total * sizeof(float));
    float volume = 0.15f;

    for (int i = 0; i < total; ++i) {
        float t = (float)i / SAMPLE_RATE;
        float fade_in = (i < 4800) ? (float)i / 4800.0f : 1.0f;
        float fade_out = (i > total - 4800) ? (float)(total - i) / 4800.0f : 1.0f;
        float sample = sinf(2.0f * 3.14159f * TONE_FREQ * t);
        buf[i] = sample * volume * fade_in * fade_out;
    }

    SDL_PutAudioStreamData(stream, buf, total * sizeof(float));
    SDL_ResumeAudioDevice(device);
    SDL_Delay(DURATION_SEC * 1000 + 200);

    SDL_free(buf);
    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'ضرب كل عينة في volume (0.0 - 1.0) يتحكم بالسعة بدون تغيير البيانات الأصلية.',
      'fade_in و fade_out تمنعان النقرة الصوتية عند بداية ونهاية التشغيل.',
      '4800 عينة = 0.1 ثانية عند 48000Hz وهي مدة التلاشي.'
    ],
    expectedResult: 'يُسمع نغمة 440Hz بهدوء (15% سعة) مع تلاشي سلس في البداية والنهاية.',
    related: [
      'SDL_PutAudioStreamData',
      'SDL_AudioStream',
      'SDL_AUDIO_F32'
    ],
    previewKind: 'audio-playback-control',
    previewTitle: 'التحكم بالصوت مع fade in/out.'
  },
  {
    id: 'audio-pause-resume',
    packageKey: 'audio',
    title: 'مثال إيقاف واستئناف التشغيل الصوتي',
    goal: 'يوضح هذا المثال كيف توقف التشغيل مؤقتًا ثم تستأنفه باستخدام SDL_PauseAudioDevice و SDL_ResumeAudioDevice. هذا أساس أي زر إيقاف/تشغيل في مشغل صوت.',
    headers: ['SDL3/SDL.h', 'math.h'],
    requirements: [
      'SDL3 الأساسية فقط.',
      'SDL_PauseAudioDevice يوقف سحب البيانات من الدفق، و SDL_ResumeAudioDevice يعيده.',
      'المثال يولّد نغمة لمدة 4 ثوانٍ ثم يوقفها ثانيتين ثم يستأنفها.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

#define SAMPLE_RATE 48000

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = { .format = SDL_AUDIO_F32, .channels = 1, .freq = SAMPLE_RATE };
    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) { SDL_Quit(); return 1; }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream || !SDL_BindAudioStream(device, stream)) { SDL_Quit(); return 1; }

    int total = SAMPLE_RATE * 6;
    float *buf = SDL_malloc(total * sizeof(float));

    for (int i = 0; i < total; ++i) {
        float t = (float)i / SAMPLE_RATE;
        buf[i] = 0.2f * sinf(2.0f * 3.14159f * 440.0f * t);
    }

    SDL_PutAudioStreamData(stream, buf, total * sizeof(float));
    SDL_ResumeAudioDevice(device);

    SDL_Log("تشغيل لمدة 2 ثانية...");
    SDL_Delay(2000);

    SDL_Log("إيقاف مؤقت لمدة 2 ثانية...");
    SDL_PauseAudioDevice(device);
    SDL_Delay(2000);

    SDL_Log("استئناف التشغيل...");
    SDL_ResumeAudioDevice(device);
    SDL_Delay(2500);

    SDL_free(buf);
    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_PauseAudioDevice يوقف سحب البيانات من الدفق فورًا.',
      'SDL_ResumeAudioDevice يعيد السحب من النقطة التي توقفت عندها.',
      'البيانات المتبقية في الدفق لا تضيع عند الإيقاف المؤقت.'
    ],
    expectedResult: 'يُسمع النغمة لمدة ثانيتين، ثم صمت لثانيتين، ثم تعود النغمة.',
    related: [
      'SDL_PauseAudioDevice',
      'SDL_ResumeAudioDevice',
      'SDL_AudioStream'
    ],
    previewKind: 'audio-playback-control',
    previewTitle: 'إيقاف واستئناف التشغيل الصوتي.'
  },
  {
    id: 'audio-mix-stereo',
    packageKey: 'audio',
    title: 'مثال مزج قناتين صوتيتين في إطار ستيريو',
    goal: 'يبني هذا المثال إطارًا ستيريو (قناتين) يضع نغمة مختلفة في كل قناة. هذا أساس فهم كيف يعمل الصوت المجسم (stereo) وكيف تمزج القنوات معًا.',
    headers: ['SDL3/SDL.h', 'math.h'],
    requirements: [
      'SDL3 الأساسية فقط.',
      'في التنسيق interleaved، العينات تتناوب: L R L R L R ...',
      'كل قناة يمكن أن تحتوي بيانات مختلفة تمامًا عن الأخرى.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

#define SAMPLE_RATE 48000
#define DURATION_SEC 3

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = { .format = SDL_AUDIO_F32, .channels = 2, .freq = SAMPLE_RATE };
    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) { SDL_Quit(); return 1; }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream || !SDL_BindAudioStream(device, stream)) { SDL_Quit(); return 1; }

    int total = SAMPLE_RATE * DURATION_SEC * 2;
    float *buf = SDL_malloc(total * sizeof(float));

    for (int i = 0; i < total; i += 2) {
        int frame = i / 2;
        float t = (float)frame / SAMPLE_RATE;
        buf[i]     = 0.2f * sinf(2.0f * 3.14159f * 440.0f * t);
        buf[i + 1] = 0.2f * sinf(2.0f * 3.14159f * 554.4f * t);
    }

    SDL_PutAudioStreamData(stream, buf, total * sizeof(float));
    SDL_ResumeAudioDevice(device);
    SDL_Delay(DURATION_SEC * 1000 + 200);

    SDL_free(buf);
    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'في التنسيق interleaved، الفهرس i هو القناة اليسرى و i+1 هو القناة اليمنى.',
      '440Hz (A4) في اليسار و 554Hz (C#5) في اليمين ينتجان صوتًا مجسمًا.',
      'عدد العينات الكلي = معدل العينات × المدة × عدد القنوات.'
    ],
    expectedResult: 'يُسمع نغمة 440Hz في الأذن اليسرى ونغمة 554Hz في الأذن اليمنى لمدة 3 ثوانٍ.',
    related: [
      'SDL_AudioSpec',
      'SDL_AUDIO_F32',
      'SDL_CreateAudioStream',
      'SDL_PutAudioStreamData'
    ],
    previewKind: 'audio-system',
    previewTitle: 'مزج قناتين صوتيتين في إطار ستيريو.'
  },
  {
    id: 'audio-callback-device',
    packageKey: 'audio',
    title: 'مثال فتح جهاز صوت مع callback للتعبئة',
    goal: 'يوضح هذا المثال الطريقة الكلاسيكية لفتح جهاز الصوت مع callback يُستدعى تلقائيًا عند الحاجة إلى عينات جديدة. هذه الطريقة مفيدة للتشغيل المستمر بدون إدارة يدوية.',
    headers: ['SDL3/SDL.h', 'math.h'],
    requirements: [
      'SDL3 الأساسية فقط.',
      'Callback يُستدعى من خيط صوتي منفصل، لذا يجب توخي الحذر عند الوصول لمتغيرات مشتركة.',
      'هذه الطريقة أقل تحكمًا من SDL_AudioStream لكنها أبسط للتشغيل المستمر.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

static int phase = 0;

static void audio_callback(void *userdata, SDL_AudioStream *stream, int additional_amount, int total_amount)
{
    (void)userdata;
    (void)total_amount;

    float buf[4096];
    int frames = additional_amount / (int)sizeof(float);
    if (frames > 2048) frames = 2048;

    for (int i = 0; i < frames; ++i) {
        float t = (float)phase / 48000.0f;
        buf[i] = 0.2f * sinf(2.0f * 3.14159f * 440.0f * t);
        phase++;
    }

    SDL_PutAudioStreamData(stream, buf, frames * (int)sizeof(float));
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec = { .format = SDL_AUDIO_F32, .channels = 1, .freq = 48000 };
    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    if (!device) { SDL_Quit(); return 1; }

    SDL_AudioStream *stream = SDL_CreateAudioStream(&spec, &spec);
    if (!stream || !SDL_BindAudioStream(device, stream)) { SDL_Quit(); return 1; }

    SDL_SetAudioStreamCallback(stream, audio_callback, NULL);
    SDL_ResumeAudioDevice(device);

    SDL_Log("تشغيل لمدة 3 ثوانٍ مع callback...");
    SDL_Delay(3000);

    SDL_SetAudioStreamCallback(stream, NULL, NULL);
    SDL_UnbindAudioStream(stream);
    SDL_DestroyAudioStream(stream);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'SDL_SetAudioStreamCallback يربط callback بالدفق بحيث يُستدعى تلقائيًا عند الحاجة لعينات.',
      'الـ callback يُستدعى من خيط صوتي، لذا يجب أن يكون سريعًا ولا يحتوي عمليات حظر.',
      'SDL_SetAudioStreamCallback(stream, NULL, NULL) يزيل الـ callback عند الانتهاء.'
    ],
    expectedResult: 'يُسمع نغمة 440Hz مستمرة لمدة 3 ثوانٍ مع التعبئة التلقائية عبر callback.',
    related: [
      'SDL_SetAudioStreamCallback',
      'SDL_CreateAudioStream',
      'SDL_BindAudioStream',
      'SDL_PutAudioStreamData'
    ],
    previewKind: 'audio-playback-control',
    previewTitle: 'فتح جهاز صوت مع callback للتعبئة.'
  },
  {
    id: 'window-main-loop',
    packageKey: 'core',
    title: 'مثال إنشاء نافذة وحلقة رئيسية',
    goal: 'يبني هذا المثال نقطة بداية عملية لتطبيق SDL3: تهيئة المكتبة، إنشاء SDL_Window و SDL_Renderer، تشغيل الحلقة الرئيسية، ثم تحرير الموارد بترتيب صحيح عند الإغلاق.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يُوضع هذا الكود داخل ملف بدء التطبيق مثل main.c أو main.cpp.',
      'لا يحتاج إلى ملفات خارجية إضافية، لذلك يصلح كنقطة انطلاق لأول مشروع.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow(
        "SDL3 window example",
        1280,
        720,
        SDL_WINDOW_RESIZABLE
    );
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 18, 24, 38, 255);
        SDL_RenderClear(renderer);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يبدأ المثال من SDL_Init حتى تكون أنظمة الفيديو والأحداث جاهزة قبل أي استدعاء يعتمد على النافذة أو الرسم.',
      'يُنشأ SDL_Renderer مباشرة بعد SDL_CreateWindow لأن معظم أمثلة الرسم اللاحقة داخل SDL3 تحتاجه كي تمسح الإطار أو ترسم أو تقدّم الصورة النهائية.',
      'الحلقة الرئيسية تقرأ SDL_Event باستمرار، ثم تنفذ الرسم داخل كل إطار قبل استدعاء SDL_RenderPresent.'
    ],
    expectedResult: 'النتيجة نافذة قابلة لتغيير الحجم بخلفية داكنة ثابتة. يبقى التطبيق يعمل حتى يرسل المستخدم حدث إغلاق من SDL_EVENT_QUIT.',
    related: [
      'SDL_Init',
      'SDL_INIT_VIDEO',
      'SDL_CreateWindow',
      'SDL_WINDOW_RESIZABLE',
      'SDL_CreateRenderer',
      'SDL_RenderClear',
      'SDL_RenderPresent',
      'SDL_DestroyRenderer',
      'SDL_DestroyWindow',
      'SDL_Quit',
      'SDL_Window',
      'SDL_Renderer',
      'SDL_Event',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'window',
    previewTitle: 'شكل النافذة الناتجة من مثال إنشاء نافذة وحلقة رئيسية.'
  },
  {
    id: 'events-input',
    packageKey: 'core',
    title: 'مثال الحلقة الرئيسية ومعالجة الأحداث والإدخال',
    goal: 'يوضح هذا المثال كيف تربط SDL3 بين SDL_PollEvent والإدخال من لوحة المفاتيح والفأرة، ثم تعكس هذا الإدخال مباشرة على عناصر مرئية داخل الإطار.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يُكتب الكود داخل الحلقة الرئيسية نفسها لأن قراءة الأحداث يجب أن تحدث في كل إطار.',
      'لا يحتاج المثال إلى أصول خارجية؛ كل التفاعل يعتمد على SDL_Event و SDL_RenderFillRect.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 input example", 960, 640, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect player = { 420.0f, 260.0f, 92.0f, 92.0f };
    SDL_FRect marker = { 448.0f, 288.0f, 16.0f, 16.0f };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_ESCAPE) {
                    running = false;
                } else if (event.key.key == SDLK_LEFT) {
                    player.x -= 18.0f;
                } else if (event.key.key == SDLK_RIGHT) {
                    player.x += 18.0f;
                } else if (event.key.key == SDLK_UP) {
                    player.y -= 18.0f;
                } else if (event.key.key == SDLK_DOWN) {
                    player.y += 18.0f;
                }
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT) {
                marker.x = event.button.x - marker.w * 0.5f;
                marker.y = event.button.y - marker.h * 0.5f;
            }
        }

        SDL_SetRenderDrawColor(renderer, 24, 27, 34, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 76, 172, 255, 255);
        SDL_RenderFillRect(renderer, &player);

        SDL_SetRenderDrawColor(renderer, 255, 201, 79, 255);
        SDL_RenderFillRect(renderer, &marker);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تقرأ SDL_EVENT_KEY_DOWN الحقول الموجودة داخل event.key لتحديد المفتاح الفعلي الذي ضغطه المستخدم قبل تعديل موضع العنصر.',
      'تستخدم SDL_EVENT_MOUSE_BUTTON_DOWN مع event.button.x و event.button.y لتسجيل موضع النقرة نفسها بدل الاعتماد على قيمة ثابتة.',
      'الرسم يحدث بعد معالجة جميع أحداث الإطار، لذلك يرى المستخدم النتيجة المرئية مباشرة في نفس الدورة.'
    ],
    expectedResult: 'يظهر مربع رئيسي يمكن تحريكه بمفاتيح الأسهم، ومع كل نقرة بالزر الأيسر تنتقل علامة صغيرة إلى موضع الفأرة. ضغط SDLK_ESCAPE أو إغلاق النافذة ينهي التطبيق.',
    related: [
      'SDL_PollEvent',
      'SDL_Event',
      'SDL_KeyboardEvent',
      'SDL_MouseButtonEvent',
      'SDL_EVENT_KEY_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT',
      'SDLK_ESCAPE',
      'SDLK_LEFT',
      'SDLK_RIGHT',
      'SDLK_UP',
      'SDLK_DOWN',
      'SDL_FRect',
      'SDL_RenderFillRect'
    ],
    previewKind: 'input',
    previewTitle: 'شكل تفاعل الإدخال بين لوحة المفاتيح والفأرة داخل نافذة SDL3.'
  },
  {
    id: 'interactive-button',
    packageKey: 'core',
    title: 'مثال زر تفاعلي مرسوم داخل SDL_Renderer',
    goal: 'يبين هذا المثال طريقة بناء زر بصري قابل للنقر داخل SDL3 عندما تريد عنصرًا تفاعليًا بسيطًا دون مكتبة GUI إضافية.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يُستخدم عندما يكون المشروع رسوميًا بسيطًا أو عندما تريد اختبار منطق النقر قبل دمج GUI كامل.',
      'لا يحتاج المثال إلى خطوط أو صور، لأن الزر نفسه يُرسم كمستطيل مع حالة تحويم ونقر.'
    ],
    code: `#include <SDL3/SDL.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= (rect->x + rect->w) &&
           y >= rect->y && y <= (rect->y + rect->h);
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 button example", 960, 540, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect button = { 300.0f, 210.0f, 260.0f, 82.0f };
    SDL_FRect indicator = { 300.0f, 320.0f, 0.0f, 18.0f };
    bool hovered = false;
    int click_count = 0;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                hovered = PointInRect(event.motion.x, event.motion.y, &button);
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &button)) {
                click_count += 1;
                indicator.w = (float)(click_count % 11) * 22.0f;
            }
        }

        SDL_SetRenderDrawColor(renderer, 20, 24, 32, 255);
        SDL_RenderClear(renderer);

        if (hovered) {
            SDL_SetRenderDrawColor(renderer, 82, 170, 255, 255);
        } else {
            SDL_SetRenderDrawColor(renderer, 58, 107, 184, 255);
        }
        SDL_RenderFillRect(renderer, &button);

        SDL_SetRenderDrawColor(renderer, 255, 196, 84, 255);
        SDL_RenderFillRect(renderer, &indicator);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تعالج PointInRect منطق الاختبار الفعلي للنقر، لذلك يصبح القرار البرمجي مستقلاً عن الرسم نفسه.',
      'تتغير حالة hovered أثناء SDL_EVENT_MOUSE_MOTION، وبذلك يعكس اللون إن كان المؤشر فوق الزر قبل النقر.',
      'click_count لا يرسم كنص هنا، لكنه يتحول إلى مؤشر تعبئة مرئي حتى ترى أثر النقر داخل الواجهة من دون أدوات إضافية.'
    ],
    expectedResult: 'يظهر زر مستطيل في منتصف النافذة. عند المرور فوقه يتبدل لونه، وعند النقر عليه يزداد شريط المؤشر أسفله، مما يوضح التفاعل والناتج البصري فورًا.',
    related: [
      'SDL_Renderer',
      'SDL_FRect',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT',
      'SDL_RenderFillRect',
      'SDL_PollEvent'
    ],
    previewKind: 'button',
    previewTitle: 'شكل زر تفاعلي مرسوم يدويًا داخل SDL_Renderer.'
  },
  {
    id: 'image-loading',
    packageKey: 'image',
    title: 'مثال الصور وتحويلها إلى SDL_Texture',
    goal: 'يشرح هذا المثال المسار العملي الأكثر شيوعًا في SDL3_image: تحميل الصورة إلى SDL_Surface ثم تحويلها إلى SDL_Texture لعرضها داخل النافذة.',
    shows: 'يوضح المسار الأساسي الذي ستبني عليه بقية سيناريوهات SDL3_image: تحميل الملف مرة واحدة، ثم تحويله إلى مورد رسم مستقر يعاد استخدامه داخل كل إطار.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ملف صورة صالح مثل assets/images/logo.png.',
      'يوضع الكود داخل مشروع يملك SDL_Renderer جاهزًا للرسم.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image example", 960, 640, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *image_surface = NULL;
    SDL_Texture *image_texture = NULL;

    if (window && renderer) {
        image_surface = IMG_Load("assets/images/logo.png");
        image_texture = image_surface
            ? SDL_CreateTextureFromSurface(renderer, image_surface)
            : NULL;
    }

    if (!window || !renderer || !image_surface || !image_texture) {
        SDL_Log("فشل تحميل الصورة أو تحويلها إلى SDL_Texture: %s", SDL_GetError());
        SDL_DestroyTexture(image_texture);
        SDL_DestroySurface(image_surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    float texture_w = 0.0f;
    float texture_h = 0.0f;
    SDL_GetTextureSize(image_texture, &texture_w, &texture_h);
    SDL_FRect dst = { 180.0f, 80.0f, texture_w, texture_h };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 17, 20, 26, 255);
        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, image_texture, NULL, &dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(image_texture);
    SDL_DestroySurface(image_surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تعيد IMG_Load سطحًا من النوع SDL_Surface لأن SDL3_image تتعامل أولًا مع بيانات الصورة الخام قبل تحويلها إلى مورد مناسب للرسم.',
      'تحويل السطح إلى SDL_Texture عبر SDL_CreateTextureFromSurface هو الخطوة التي تجعل الصورة قابلة للإرسال إلى SDL_Renderer كل إطار.',
      'SDL_GetTextureSize يقرأ الحجم الحقيقي للصورة بعد التحويل، وبذلك لا تضطر إلى تخمين الأبعاد عند تجهيز مستطيل العرض.'
    ],
    expectedResult: 'تظهر الصورة المحددة داخل النافذة فوق خلفية داكنة، وتبقى معروضة حتى يغلق المستخدم التطبيق. إذا كان المسار خاطئًا فستظهر رسالة خطأ واضحة عبر SDL_Log.',
    related: [
      'IMG_Load',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_Texture',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_DestroySurface',
      'SDL_DestroyTexture'
    ],
    previewKind: 'image',
    previewTitle: 'شكل مثال تحميل صورة وعرضها داخل نافذة SDL3.'
  },
  {
    id: 'image-position-scale',
    packageKey: 'image',
    title: 'مثال تحديد الموضع وتغيير حجم الصورة أثناء الرسم',
    goal: 'يبين هذا المثال كيف تتحكم في موضع الصورة وحجمها عبر SDL_FRect بعد تحميلها مرة واحدة فقط، بحيث تعيد استخدام SDL_Texture نفسه مع أكثر من وضع عرض.',
    shows: 'يوضح الاستخدام العملي لمستطيل الوجهة عند بناء بطاقات واجهة أو شاشات عرض تحتاج نقل الصورة أو تكبيرها وتصغيرها دون إعادة التحميل من القرص.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ملف صورة صالح مثل assets/images/panel.png.',
      'يفيد المثال عندما تريد تحريك الصورة بمفاتيح الأسهم وتبديل حجمها بمفاتيح سريعة مثل SDLK_1 و SDLK_2 و SDLK_3.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image scale example", 1100, 720, SDL_WINDOW_RESIZABLE);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *surface = NULL;
    SDL_Texture *texture = NULL;

    if (window && renderer) {
        surface = IMG_Load("assets/images/panel.png");
        texture = surface ? SDL_CreateTextureFromSurface(renderer, surface) : NULL;
    }

    if (!window || !renderer || !surface || !texture) {
        SDL_Log("فشل تجهيز الصورة: %s", SDL_GetError());
        SDL_DestroyTexture(texture);
        SDL_DestroySurface(surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    float texture_w = 0.0f;
    float texture_h = 0.0f;
    SDL_GetTextureSize(texture, &texture_w, &texture_h);

    SDL_FRect dst = { 180.0f, 120.0f, texture_w * 0.65f, texture_h * 0.65f };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_LEFT) {
                    dst.x -= 20.0f;
                } else if (event.key.key == SDLK_RIGHT) {
                    dst.x += 20.0f;
                } else if (event.key.key == SDLK_UP) {
                    dst.y -= 20.0f;
                } else if (event.key.key == SDLK_DOWN) {
                    dst.y += 20.0f;
                } else if (event.key.key == SDLK_1) {
                    dst.w = texture_w * 0.45f;
                    dst.h = texture_h * 0.45f;
                } else if (event.key.key == SDLK_2) {
                    dst.w = texture_w * 0.70f;
                    dst.h = texture_h * 0.70f;
                } else if (event.key.key == SDLK_3) {
                    dst.w = texture_w;
                    dst.h = texture_h;
                }
            }
        }

        SDL_SetRenderDrawColor(renderer, 16, 19, 25, 255);
        SDL_RenderClear(renderer);

        SDL_FRect frame = { dst.x - 18.0f, dst.y - 18.0f, dst.w + 36.0f, dst.h + 36.0f };
        SDL_SetRenderDrawColor(renderer, 44, 61, 84, 255);
        SDL_RenderFillRect(renderer, &frame);
        SDL_RenderTexture(renderer, texture, NULL, &dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(texture);
    SDL_DestroySurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يجري IMG_Load مرة واحدة فقط، ثم يصبح تغيير الموضع والحجم مسؤولية SDL_FRect بدل إعادة تحميل الملف أو إنشاء مورد جديد.',
      'مفاتيح SDLK_1 و SDLK_2 و SDLK_3 تعطيك نسب تكبير عملية توضح أن الحجم النهائي يحدد وقت الرسم لا وقت التحميل.',
      'إضافة إطار مرسوم حول SDL_FRect تساعدك على رؤية الفرق بين أبعاد الصورة نفسها وبين المساحة البصرية التي تخصصها لها داخل الواجهة.'
    ],
    expectedResult: 'تظهر الصورة داخل إطار مرئي، ويمكن نقلها بمفاتيح الأسهم وتبديل حجمها بين ثلاث درجات. هذا يوضح كيف تستخدم موردًا واحدًا لعدة مواضع وأحجام داخل نافذة واحدة.',
    related: [
      'IMG_Load',
      'SDL_Surface',
      'SDL_Texture',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_FRect',
      'SDLK_LEFT',
      'SDLK_RIGHT',
      'SDLK_UP',
      'SDLK_DOWN',
      'SDLK_1',
      'SDLK_2',
      'SDLK_3'
    ],
    previewKind: 'image-scale',
    previewTitle: 'معاينة لتغيير موضع الصورة وحجمها أثناء الرسم.'
  },
  {
    id: 'image-crop-source-rect',
    packageKey: 'image',
    title: 'مثال قص جزء من صورة كبيرة وعرضه',
    goal: 'يوضح هذا المثال كيف تقرأ جزءًا محددًا من صورة كبيرة أو sprite sheet عبر srcrect، ثم تعرض هذا الجزء فقط داخل الوجهة النهائية.',
    shows: 'يبين الاستخدام الحقيقي لقص الصور عندما تبني atlas للرموز أو إطارات حركة داخل ملف واحد، ثم تختار المقطع المطلوب بدل إنشاء ملف منفصل لكل جزء.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ملف صورة كبيرة مثل assets/images/spritesheet.png يحتوي على عدة مناطق مرئية.',
      'استخدم هذا المثال عندما تريد اختيار جزء من atlas أو قص صورة كبيرة إلى معاينة أصغر.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image crop example", 1100, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *surface = NULL;
    SDL_Texture *texture = NULL;

    if (window && renderer) {
        surface = IMG_Load("assets/images/spritesheet.png");
        texture = surface ? SDL_CreateTextureFromSurface(renderer, surface) : NULL;
    }

    if (!window || !renderer || !surface || !texture) {
        SDL_Log("فشل تجهيز صورة القص: %s", SDL_GetError());
        SDL_DestroyTexture(texture);
        SDL_DestroySurface(surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect src = { 0.0f, 0.0f, 128.0f, 128.0f };
    SDL_FRect dst = { 360.0f, 170.0f, 320.0f, 320.0f };
    int frame_index = 0;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_RIGHT) {
                    frame_index = (frame_index + 1) % 4;
                } else if (event.key.key == SDLK_LEFT) {
                    frame_index = (frame_index + 3) % 4;
                }

                src.x = (float)(frame_index * 128);
            }
        }

        SDL_SetRenderDrawColor(renderer, 18, 22, 30, 255);
        SDL_RenderClear(renderer);

        SDL_FRect preview_panel = { 312.0f, 122.0f, 416.0f, 416.0f };
        SDL_SetRenderDrawColor(renderer, 32, 46, 67, 255);
        SDL_RenderFillRect(renderer, &preview_panel);
        SDL_RenderTexture(renderer, texture, &src, &dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(texture);
    SDL_DestroySurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يمثل SDL_FRect src المقطع الذي يقرأه SDL_RenderTexture من الصورة الأصلية، لذلك يمكنك التنقل بين الإطارات داخل ملف واحد عبر تغيير src.x و src.y فقط.',
      'يبقى SDL_Texture واحدًا في الذاكرة رغم تبديل المنطقة المعروضة، وهذا هو الأسلوب المعتاد عند العمل مع sprite sheets وواجهات الأيقونات.',
      'يكبر dst الجزء المقصوص إلى حجم أوضح، وبذلك ترى كيف ينفصل حجم المصدر عن حجم العرض الفعلي على الشاشة.'
    ],
    expectedResult: 'تظهر منطقة واحدة مكبرة من صورة كبيرة. عند الضغط على مفاتيح الأسهم اليمنى أو اليسرى ينتقل القص بين أربعة مقاطع أفقية مختلفة داخل الملف نفسه.',
    related: [
      'IMG_Load',
      'SDL_Surface',
      'SDL_Texture',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_FRect',
      'SDL_Event',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_LEFT',
      'SDLK_RIGHT'
    ],
    previewKind: 'image-crop',
    previewTitle: 'معاينة لقص جزء من صورة كبيرة وعرضه بحجم مختلف.'
  },
  {
    id: 'image-gallery-layout',
    packageKey: 'image',
    title: 'مثال عرض عدة صور داخل معرض بسيط',
    goal: 'يبني هذا المثال معرضًا مصغرًا يحمل عدة صور في البداية، ثم يرتبها داخل نافذة واحدة على شكل شبكة مرتبة يسهل البناء عليها لاحقًا.',
    shows: 'يوضح كيف تدير عدة SDL_Texture داخل نفس المشهد بدل صورة منفردة، وكيف تحسب مواضعها عند بناء شريط مصغرات أو لوحة اختيار مرئية.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ثلاث صور على الأقل مثل assets/images/gallery-1.png و assets/images/gallery-2.png و assets/images/gallery-3.png.',
      'مناسب لشاشات المعرض أو اللوحات التي تعرض أكثر من صورة داخل نفس النافذة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image gallery example", 1180, 760, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Texture *textures[3] = { NULL, NULL, NULL };
    SDL_Surface *surfaces[3] = { NULL, NULL, NULL };
    const char *paths[3] = {
        "assets/images/gallery-1.png",
        "assets/images/gallery-2.png",
        "assets/images/gallery-3.png"
    };

    if (window && renderer) {
        for (int i = 0; i < 3; ++i) {
            surfaces[i] = IMG_Load(paths[i]);
            textures[i] = surfaces[i]
                ? SDL_CreateTextureFromSurface(renderer, surfaces[i])
                : NULL;
        }
    }

    if (!window || !renderer || !textures[0] || !textures[1] || !textures[2]) {
        SDL_Log("فشل تجهيز صور المعرض: %s", SDL_GetError());
        for (int i = 0; i < 3; ++i) {
            SDL_DestroyTexture(textures[i]);
            SDL_DestroySurface(surfaces[i]);
        }
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 16, 18, 25, 255);
        SDL_RenderClear(renderer);

        for (int i = 0; i < 3; ++i) {
            float column = (float)(i % 2);
            float row = (float)(i / 2);
            SDL_FRect card = { 120.0f + column * 380.0f, 90.0f + row * 270.0f, 300.0f, 210.0f };
            SDL_FRect image_dst = { card.x + 18.0f, card.y + 18.0f, 264.0f, 150.0f };
            SDL_FRect footer = { card.x + 18.0f, card.y + 178.0f, 180.0f, 12.0f };

            SDL_SetRenderDrawColor(renderer, 31, 44, 61, 255);
            SDL_RenderFillRect(renderer, &card);
            SDL_RenderTexture(renderer, textures[i], NULL, &image_dst);
            SDL_SetRenderDrawColor(renderer, 101, 150, 214, 255);
            SDL_RenderFillRect(renderer, &footer);
        }

        SDL_RenderPresent(renderer);
    }

    for (int i = 0; i < 3; ++i) {
        SDL_DestroyTexture(textures[i]);
        SDL_DestroySurface(surfaces[i]);
    }
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يحمل المثال كل SDL_Texture مرة واحدة في البداية، لذلك يصبح الإطار نفسه نظيفًا: حساب مواضع ثم SDL_RenderTexture داخل حلقة واحدة.',
      'استعمال مصفوفات للصور والمسارات يمهد مباشرة لبناء معرض أو لائحة مصغرات دون تكرار منطق التحميل أو التنظيف لكل عنصر على حدة.',
      'تفصل البطاقات والخطوط السفلية بين منطقة الصورة وبقية الواجهة، وبذلك ترى كيف تدمج الصورة داخل تخطيط بصري حقيقي بدل عرضها عائمة وحدها.'
    ],
    expectedResult: 'تظهر ثلاث صور داخل بطاقات مرتبة في شبكة بسيطة. كل بطاقة تحتوي منطقة للصورة وشريطًا سفليًا يمثل مساحة عنوان أو وصف يمكن تطويرها لاحقًا.',
    related: [
      'IMG_Load',
      'SDL_Texture',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_RenderFillRect',
      'SDL_FRect',
      'SDL_DestroyTexture',
      'SDL_DestroySurface'
    ],
    previewKind: 'image-gallery',
    previewTitle: 'معاينة لمعرض صور بسيط داخل نافذة واحدة.'
  },
  {
    id: 'image-switch-keyboard',
    packageKey: 'image',
    title: 'مثال تبديل الصورة المعروضة عند الضغط على مفتاح',
    goal: 'يوضح هذا المثال كيف تحمل عدة صور مسبقًا، ثم تبدل الصورة النشطة لحظيًا عبر لوحة المفاتيح من غير العودة إلى القرص أثناء التفاعل.',
    shows: 'يبين سيناريو عمليًا لعارض حالة شخصية أو معرض منتجات أو شاشة تعليمية تحتاج الانتقال بين صور متعددة مع استجابة فورية للأزرار.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ثلاث صور على الأقل مثل assets/images/state-1.png و assets/images/state-2.png و assets/images/state-3.png.',
      'يُستخدم المثال عندما تريد الإبقاء على الصور محملة مسبقًا ثم تغيير ما يعرضه التطبيق لحظيًا.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image switch example", 1100, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Texture *textures[3] = { NULL, NULL, NULL };
    SDL_Surface *surfaces[3] = { NULL, NULL, NULL };
    const char *paths[3] = {
        "assets/images/state-1.png",
        "assets/images/state-2.png",
        "assets/images/state-3.png"
    };

    if (window && renderer) {
        for (int i = 0; i < 3; ++i) {
            surfaces[i] = IMG_Load(paths[i]);
            textures[i] = surfaces[i]
                ? SDL_CreateTextureFromSurface(renderer, surfaces[i])
                : NULL;
        }
    }

    if (!window || !renderer || !textures[0] || !textures[1] || !textures[2]) {
        SDL_Log("فشل تجهيز الصور البديلة: %s", SDL_GetError());
        for (int i = 0; i < 3; ++i) {
            SDL_DestroyTexture(textures[i]);
            SDL_DestroySurface(surfaces[i]);
        }
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    int current = 0;
    SDL_FRect dst = { 250.0f, 100.0f, 600.0f, 420.0f };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_1) {
                    current = 0;
                } else if (event.key.key == SDLK_2) {
                    current = 1;
                } else if (event.key.key == SDLK_3) {
                    current = 2;
                } else if (event.key.key == SDLK_RIGHT) {
                    current = (current + 1) % 3;
                } else if (event.key.key == SDLK_LEFT) {
                    current = (current + 2) % 3;
                }
            }
        }

        SDL_SetRenderDrawColor(renderer, 15, 18, 24, 255);
        SDL_RenderClear(renderer);

        SDL_FRect selector = { 250.0f + (float)current * 126.0f, 560.0f, 110.0f, 12.0f };
        SDL_RenderTexture(renderer, textures[current], NULL, &dst);
        SDL_SetRenderDrawColor(renderer, 92, 149, 224, 255);
        SDL_RenderFillRect(renderer, &selector);
        SDL_RenderPresent(renderer);
    }

    for (int i = 0; i < 3; ++i) {
        SDL_DestroyTexture(textures[i]);
        SDL_DestroySurface(surfaces[i]);
    }
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تحميل كل صورة مرة واحدة قبل دخول الحلقة الرئيسية يمنع تأخير التبديل عند ضغط المفاتيح، لأن التفاعل يختار فقط أي SDL_Texture سيستخدم في هذا الإطار.',
      'تسمح لك مفاتيح SDLK_1 و SDLK_2 و SDLK_3 باختبار التبديل المباشر، بينما تعطي الأسهم اليمنى واليسرى أسلوب تنقل متتابع أكثر قربًا من المعارض العملية.',
      'شريط المؤشر السفلي يترجم الحالة الداخلية current إلى نتيجة مرئية، فيفهم القارئ مباشرة أي صورة نشطة الآن.'
    ],
    expectedResult: 'تظهر صورة واحدة كبيرة في الوسط. الضغط على 1 أو 2 أو 3 أو على السهمين الأيسر والأيمن يبدل الصورة الحالية مباشرة، مع تحرك مؤشر سفلي يوضح الحالة النشطة.',
    related: [
      'IMG_Load',
      'SDL_Texture',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_1',
      'SDLK_2',
      'SDLK_3',
      'SDLK_LEFT',
      'SDLK_RIGHT'
    ],
    previewKind: 'image-switch',
    previewTitle: 'معاينة لتبديل الصورة المعروضة عبر لوحة المفاتيح.'
  },
  {
    id: 'image-drag-mouse',
    packageKey: 'image',
    title: 'مثال سحب صورة بالفأرة داخل النافذة',
    goal: 'يبني هذا المثال عنصرًا مرئيًا يمكن التقاطه بالفأرة ثم سحبه داخل النافذة، وهو أساس مفيد لأدوات التحرير واللوحات القابلة للتنظيم.',
    shows: 'يوضح كيف تجعل الصورة نفسها منطقة تفاعل نشطة عبر SDL_Event بدل أن تكون عنصر عرض فقط، وكيف تحتفظ بإزاحة السحب كي يبقى الالتقاط طبيعيًا.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ملف صورة صالح مثل assets/images/card.png.',
      'مناسب للمشاريع التي تتضمن لوحات تحرير أو عناصر مرئية يمكن إعادة ترتيبها بالفأرة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= (rect->x + rect->w) &&
           y >= rect->y && y <= (rect->y + rect->h);
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image drag example", 1180, 760, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *surface = NULL;
    SDL_Texture *texture = NULL;

    if (window && renderer) {
        surface = IMG_Load("assets/images/card.png");
        texture = surface ? SDL_CreateTextureFromSurface(renderer, surface) : NULL;
    }

    if (!window || !renderer || !surface || !texture) {
        SDL_Log("فشل تجهيز صورة السحب: %s", SDL_GetError());
        SDL_DestroyTexture(texture);
        SDL_DestroySurface(surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect dst = { 360.0f, 160.0f, 340.0f, 340.0f };
    bool dragging = false;
    float drag_offset_x = 0.0f;
    float drag_offset_y = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &dst)) {
                dragging = true;
                drag_offset_x = event.button.x - dst.x;
                drag_offset_y = event.button.y - dst.y;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                dragging = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION && dragging) {
                dst.x = event.motion.x - drag_offset_x;
                dst.y = event.motion.y - drag_offset_y;
            }
        }

        SDL_SetRenderDrawColor(renderer, 14, 18, 25, 255);
        SDL_RenderClear(renderer);

        SDL_FRect shadow = { dst.x + 14.0f, dst.y + 14.0f, dst.w, dst.h };
        SDL_SetRenderDrawColor(renderer, 10, 12, 18, 255);
        SDL_RenderFillRect(renderer, &shadow);
        SDL_RenderTexture(renderer, texture, NULL, &dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(texture);
    SDL_DestroySurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يحسم PointInRect ما إذا كانت الفأرة بدأت السحب من داخل الصورة نفسها، لذلك يبقى السلوك منضبطًا بدل التقاط أي حركة للفأرة داخل النافذة كلها.',
      'تسجل drag_offset_x و drag_offset_y الفرق بين موضع النقر وأعلى الصورة، فيبقى موضع الالتقاط ثابتًا أثناء السحب ولا تقفز الصورة إلى زاويتها.',
      'يمثل الظل المرسوم تحت الصورة طبقة بصرية تجعل حركة العنصر أوضح، وهذا قريب من شكل الأدوات التي تسمح بإعادة الترتيب داخل الواجهات.'
    ],
    expectedResult: 'تظهر بطاقة صورية كبيرة يمكن التقاطها بالزر الأيسر للفأرة وسحبها بحرية داخل النافذة. عند إفلات الزر تتوقف الحركة ويبقى العنصر في موضعه الجديد.',
    related: [
      'IMG_Load',
      'SDL_Texture',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_FRect',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_BUTTON_LEFT'
    ],
    previewKind: 'image-drag',
    previewTitle: 'معاينة لسحب صورة بالفأرة داخل نافذة SDL3.'
  },
  {
    id: 'image-button-hover',
    packageKey: 'image',
    title: 'مثال استخدام صورة كزر مع تحويم ونقر',
    goal: 'يوضح هذا المثال كيف تحول صورة أو أيقونة إلى زر مرئي يغير مظهره عند التحويم ويشغّل إجراءً عند النقر عليه.',
    shows: 'يبين الاستخدام العملي للصور كعناصر تفاعل داخل قوائم الأدوات والأزرار المصورة، مع الحفاظ على منطق التحويم والنقر داخل SDL3 فقط.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'ملف صورة مناسب كأيقونة مثل assets/images/icon-play.png.',
      'يناسب أشرطة الأدوات أو الأزرار المرئية التي تعتمد على صورة بدل رسم مستطيل تقليدي.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= (rect->x + rect->w) &&
           y >= rect->y && y <= (rect->y + rect->h);
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image button example", 960, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *surface = NULL;
    SDL_Texture *icon = NULL;

    if (window && renderer) {
        surface = IMG_Load("assets/images/icon-play.png");
        icon = surface ? SDL_CreateTextureFromSurface(renderer, surface) : NULL;
    }

    if (!window || !renderer || !surface || !icon) {
        SDL_Log("فشل تجهيز صورة الزر: %s", SDL_GetError());
        SDL_DestroyTexture(icon);
        SDL_DestroySurface(surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect button = { 380.0f, 180.0f, 180.0f, 180.0f };
    SDL_FRect progress = { 280.0f, 420.0f, 0.0f, 16.0f };
    bool hovered = false;
    int click_count = 0;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                hovered = PointInRect(event.motion.x, event.motion.y, &button);
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &button)) {
                click_count += 1;
                progress.w = (float)(click_count % 8) * 48.0f;
            }
        }

        SDL_SetRenderDrawColor(renderer, 16, 20, 27, 255);
        SDL_RenderClear(renderer);

        SDL_FRect panel = { 280.0f, 120.0f, 380.0f, 340.0f };
        SDL_SetRenderDrawColor(renderer, 30, 41, 58, 255);
        SDL_RenderFillRect(renderer, &panel);

        if (hovered) {
            SDL_SetTextureColorMod(icon, 255, 228, 136);
            SDL_SetTextureAlphaMod(icon, 255);
        } else {
            SDL_SetTextureColorMod(icon, 220, 235, 255);
            SDL_SetTextureAlphaMod(icon, 224);
        }

        SDL_RenderTexture(renderer, icon, NULL, &button);
        SDL_SetRenderDrawColor(renderer, 102, 168, 255, 255);
        SDL_RenderFillRect(renderer, &progress);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(icon);
    SDL_DestroySurface(surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يربط المثال بين التحويم والنقر وبين صورة واحدة عبر SDL_SetTextureColorMod و SDL_SetTextureAlphaMod بدل الحاجة إلى رسم عنصر بديل كامل.',
      'يحوّل progress أثر النقر إلى نتيجة بصرية واضحة، لذلك ترى أن الصورة لم تعد للعرض فقط بل أصبحت زرًا يفعّل حالة داخلية في الواجهة.',
      'يمكنك استبدال صورة الأيقونة أو الإجراء المرتبط بسهولة لاحقًا مع بقاء منطق التفاعل نفسه صالحًا لأشرطة الأدوات والبطاقات المصورة.'
    ],
    expectedResult: 'تظهر أيقونة كبيرة في منتصف لوحة. عند المرور فوقها يزداد سطوعها، وعند النقر عليها يتمدد شريط سفلي يوضح أن الصورة استُخدمت كزر نفذ إجراءً داخليًا.',
    related: [
      'IMG_Load',
      'SDL_Texture',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_SetTextureColorMod',
      'SDL_SetTextureAlphaMod',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT',
      'SDL_FRect'
    ],
    previewKind: 'image-button',
    previewTitle: 'معاينة لصورة مستخدمة كزر مع تحويم ونقر.'
  },
  {
    id: 'image-background-alpha',
    packageKey: 'image',
    title: 'مثال استخدام صورة كخلفية مع طبقة شفافة فوقها',
    goal: 'يبني هذا المثال مشهدًا بسيطًا يستخدم صورة خلفية تملأ النافذة ثم يرسم فوقها صورة ثانية بشفافية متغيرة، وهو نمط شائع في شاشات الترحيب واللوحات البصرية.',
    shows: 'يوضح كيف توظف SDL3_image مع alpha modulation لبناء مشهد بصري مركب من أكثر من صورة، بحيث تظهر الخلفية والثيمة والطبقة الأمامية ضمن واجهة واحدة.',
    headers: ['SDL3/SDL.h', 'SDL3_image/SDL_image.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_image.',
      'صورة خلفية مثل assets/images/background.png وصورة أمامية مثل assets/images/badge.png.',
      'يفيد هذا السيناريو في شاشات البداية، لوحات المنتجات، والواجهات التي تحتاج طبقة بصرية فوق الخلفية.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_image/SDL_image.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 image background example", 1280, 720, SDL_WINDOW_RESIZABLE);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    SDL_Surface *background_surface = NULL;
    SDL_Surface *badge_surface = NULL;
    SDL_Texture *background = NULL;
    SDL_Texture *badge = NULL;

    if (window && renderer) {
        background_surface = IMG_Load("assets/images/background.png");
        badge_surface = IMG_Load("assets/images/badge.png");
        background = background_surface
            ? SDL_CreateTextureFromSurface(renderer, background_surface)
            : NULL;
        badge = badge_surface
            ? SDL_CreateTextureFromSurface(renderer, badge_surface)
            : NULL;
    }

    if (!window || !renderer || !background || !badge) {
        SDL_Log("فشل تجهيز الخلفية أو الطبقة الشفافة: %s", SDL_GetError());
        SDL_DestroyTexture(badge);
        SDL_DestroyTexture(background);
        SDL_DestroySurface(badge_surface);
        SDL_DestroySurface(background_surface);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    Uint8 badge_alpha = 210;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_UP && badge_alpha < 245) {
                    badge_alpha += 10;
                } else if (event.key.key == SDLK_DOWN && badge_alpha > 75) {
                    badge_alpha -= 10;
                }
            }
        }

        SDL_SetTextureAlphaMod(badge, badge_alpha);

        SDL_SetRenderDrawColor(renderer, 10, 12, 18, 255);
        SDL_RenderClear(renderer);

        SDL_FRect background_dst = { 0.0f, 0.0f, 1280.0f, 720.0f };
        SDL_FRect badge_dst = { 420.0f, 150.0f, 440.0f, 440.0f };
        SDL_FRect footer = { 380.0f, 620.0f, (float)badge_alpha * 2.0f, 14.0f };

        SDL_RenderTexture(renderer, background, NULL, &background_dst);
        SDL_RenderTexture(renderer, badge, NULL, &badge_dst);
        SDL_SetRenderDrawColor(renderer, 255, 210, 114, 255);
        SDL_RenderFillRect(renderer, &footer);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(badge);
    SDL_DestroyTexture(background);
    SDL_DestroySurface(badge_surface);
    SDL_DestroySurface(background_surface);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تفصل الخلفية عن الطبقة الأمامية في موردين مستقلين، لذلك يمكنك تحديث الشفافية أو الاستبدال أو التلوين في الطبقة العليا دون المساس بالصورة الأساسية.',
      'تعرض SDL_SetTextureAlphaMod فائدة عملية مباشرة هنا: تغيير قوة ظهور الصورة الأمامية من غير تعديل الملف الأصلي أو توليد نسخ بديلة منه.',
      'يبين الشريط السفلي قيمة badge_alpha بصريًا، فيربط المطور بين قيمة الشفافية العددية والناتج الفعلي على الشاشة.'
    ],
    expectedResult: 'تملأ الخلفية النافذة كلها، وتظهر فوقها طبقة مرئية في الوسط. يمكن زيادة وضوحها أو تقليله بالسهمين الأعلى والأسفل، مع شريط سفلي يعكس مستوى الشفافية الحالي.',
    related: [
      'IMG_Load',
      'SDL_Texture',
      'SDL_Surface',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture',
      'SDL_SetTextureAlphaMod',
      'SDL_FRect',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_UP',
      'SDLK_DOWN'
    ],
    previewKind: 'image-background',
    previewTitle: 'معاينة لاستخدام صورة كخلفية مع طبقة شفافة فوقها.'
  },
  {
    id: 'mixer-short-sfx',
    packageKey: 'mixer',
    title: 'مثال تشغيل صوت قصير مرة واحدة',
    goal: 'يوضح هذا المثال أبسط مسار عملي لتشغيل مؤثر صوتي قصير داخل SDL3_mixer: فتح جهاز الصوت، إنشاء MIX_Mixer، تحميل ملف صوتي، ثم تشغيله مرة واحدة عند ضغط مفتاح أو نقر زر.',
    shows: 'يبين كيف يختلف تشغيل المؤثر القصير عن الموسيقى الخلفية: لا تحتاج هنا إلى إدارة طويلة للمسار، بل يكفي MIX_LoadAudio مع MIX_PlayAudio لتشغيل الأثر فورًا عند الحدث.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملف صوتي قصير مثل assets/audio/ui-click.wav أو assets/audio/button.wav.',
      'يفضل استخدام ملف WAV أو OGG قصير المدة حتى يكون الاستدعاء مناسبًا لمؤثرات الواجهة أو أصوات النقر.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *click_sound = mixer ? MIX_LoadAudio(mixer, "assets/audio/ui-click.wav", true) : NULL;
    SDL_Window *window = SDL_CreateWindow("مؤثر صوتي قصير", 980, 560, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !click_sound || !window || !renderer) {
        SDL_Log("فشل تجهيز جهاز الصوت أو المؤثر الصوتي: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyAudio(click_sound);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);

    SDL_FRect trigger = { 330.0f, 180.0f, 320.0f, 110.0f };
    float flash = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN && event.key.key == SDLK_SPACE) {
                MIX_PlayAudio(mixer, click_sound);
                flash = 1.0f;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                event.button.x >= trigger.x && event.button.x <= trigger.x + trigger.w &&
                event.button.y >= trigger.y && event.button.y <= trigger.y + trigger.h) {
                MIX_PlayAudio(mixer, click_sound);
                flash = 1.0f;
            }
        }

        if (flash > 0.0f) {
            flash -= 0.025f;
            if (flash < 0.0f) {
                flash = 0.0f;
            }
        }

        Uint8 accent = (Uint8)(70 + flash * 160.0f);
        SDL_SetRenderDrawColor(renderer, 16, 20, 27, 255);
        SDL_RenderClear(renderer);
        SDL_SetRenderDrawColor(renderer, 48, 66, accent, 255);
        SDL_RenderFillRect(renderer, &trigger);

        SDL_FRect pulse = { 330.0f, 330.0f, flash * 320.0f, 18.0f };
        SDL_SetRenderDrawColor(renderer, 255, 198, 101, 255);
        SDL_RenderFillRect(renderer, &pulse);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyAudio(click_sound);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يفتح SDL_OpenAudioDevice جهاز التشغيل الفعلي أولًا، ثم ينشأ MIX_CreateMixerDevice المازج الذي سيخلط الأصوات ويرسلها إلى هذا الجهاز.',
      'تحميل المؤثر عبر MIX_LoadAudio مع predecode يجهزه للتشغيل السريع، وهو مناسب للأصوات القصيرة التي تريد إطلاقها فور وقوع الحدث.',
      'يستدعي MIX_PlayAudio تشغيل الصوت مباشرة من غير إدارة مسار دائم، وهذا يجعل المثال مناسبًا لأصوات النقر والتنبيهات القصيرة.'
    ],
    expectedResult: 'تظهر لوحة تفاعلية بسيطة. عند الضغط على مفتاح المسافة أو النقر على المستطيل يشغل التطبيق صوتًا قصيرًا مرة واحدة، ويظهر وميض بصري سريع يؤكد أن الحدث الصوتي انطلق.',
    related: [
      'SDL_Init',
      'SDL_INIT_AUDIO',
      'SDL_OpenAudioDevice',
      'SDL_CloseAudioDevice',
      'SDL_ResumeAudioDevice',
      'SDL_AudioSpec',
      'SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK',
      'SDL_AUDIO_F32',
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_PlayAudio',
      'MIX_DestroyAudio',
      'MIX_DestroyMixer',
      'MIX_Mixer',
      'MIX_Audio',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_SPACE',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT'
    ],
    previewKind: 'audio-once',
    previewTitle: 'معاينة لمؤثر صوتي قصير يعمل مرة واحدة عند التفاعل.'
  },
  {
    id: 'mixer-background-loop',
    packageKey: 'mixer',
    title: 'مثال تشغيل موسيقى خلفية بشكل مستمر',
    goal: 'يبين هذا المثال كيف تستخدم MIX_Track لتشغيل ملف صوتي طويل كخلفية مستمرة داخل التطبيق، مع إبقائه يعمل أثناء الحلقة الرئيسية كلها.',
    shows: 'يوضح الفرق بين MIX_PlayAudio للمؤثرات السريعة وبين MIX_CreateTrack مع MIX_SetTrackAudio عندما تريد إدارة موسيقى تبقى مرافقة للتطبيق وتدور باستمرار.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملف موسيقى مناسب مثل assets/audio/menu-theme.ogg.',
      'استخدم هذا المثال عندما تحتاج موسيقى خلفية تستمر أثناء التنقل داخل الواجهة أو اللعبة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *music = mixer ? MIX_LoadAudio(mixer, "assets/audio/menu-theme.ogg", false) : NULL;
    MIX_Track *music_track = mixer ? MIX_CreateTrack(mixer) : NULL;
    SDL_Window *window = SDL_CreateWindow("موسيقى خلفية مستمرة", 1080, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !music || !music_track || !window || !renderer ||
        !MIX_SetTrackAudio(music_track, music)) {
        SDL_Log("فشل تجهيز موسيقى الخلفية: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyTrack(music_track);
        MIX_DestroyAudio(music);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);
    MIX_PlayTrack(music_track, 0);
    MIX_SetTrackLoops(music_track, -1);

    bool running = true;
    SDL_Event event;
    float spin = 0.0f;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        spin += 0.04f;
        if (spin > 1.0f) {
            spin = 0.0f;
        }

        SDL_SetRenderDrawColor(renderer, 18, 20, 28, 255);
        SDL_RenderClear(renderer);

        SDL_FRect ring = { 400.0f, 120.0f, 280.0f, 280.0f };
        SDL_SetRenderDrawColor(renderer, 44, 58, 78, 255);
        SDL_RenderFillRect(renderer, &ring);

        SDL_FRect pulse = { 280.0f, 462.0f, 520.0f * spin, 20.0f };
        SDL_SetRenderDrawColor(renderer, 255, 200, 104, 255);
        SDL_RenderFillRect(renderer, &pulse);
        SDL_RenderPresent(renderer);
    }

    MIX_StopTrack(music_track, 0);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyTrack(music_track);
    MIX_DestroyAudio(music);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يعطي MIX_CreateTrack مسار تشغيل قابلًا للإدارة المستمرة، وهو الأنسب للموسيقى الخلفية التي تحتاج بقاءها فعالة خارج لحظة حدث واحدة.',
      'يربط MIX_SetTrackAudio بين المسار والملف المحمّل، ثم يبدأ MIX_PlayTrack التشغيل الفعلي للمسار على المازج.',
      'يحوّل MIX_SetTrackLoops بقيمة -1 هذا المسار إلى موسيقى تدور بلا نهاية، وهو سلوك مناسب للقوائم الرئيسية أو المشاهد الطويلة.'
    ],
    expectedResult: 'يبدأ تشغيل موسيقى الخلفية فور فتح النافذة وتستمر بلا توقف. على الشاشة تظهر معاينة بصرية بسيطة تؤكد أن المسار ما يزال يدور كخلفية ثابتة للتطبيق.',
    related: [
      'SDL_OpenAudioDevice',
      'SDL_CloseAudioDevice',
      'SDL_ResumeAudioDevice',
      'SDL_AudioSpec',
      'SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK',
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_CreateTrack',
      'MIX_SetTrackAudio',
      'MIX_PlayTrack',
      'MIX_SetTrackLoops',
      'MIX_StopTrack',
      'MIX_DestroyTrack',
      'MIX_DestroyAudio',
      'MIX_DestroyMixer',
      'MIX_Track',
      'MIX_Mixer',
      'MIX_Audio'
    ],
    previewKind: 'audio-loop',
    previewTitle: 'معاينة لمسار موسيقى خلفية يعمل باستمرار.'
  },
  {
    id: 'mixer-transport-controls',
    packageKey: 'mixer',
    title: 'مثال إيقاف الموسيقى وإيقافها مؤقتًا ثم استئنافها',
    goal: 'يعرض هذا المثال التحكم المباشر في مسار موسيقي أثناء التشغيل عبر أوامر Pause و Resume و Stop، مع ربط كل أمر بمفتاح واضح داخل الحلقة الرئيسية.',
    shows: 'يوضح كيف تنتقل من مجرد تشغيل الموسيقى إلى إدارتها أثناء التنفيذ، بحيث تتجاوب الخلفية الصوتية مع حالة التطبيق أو أوامر المستخدم.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملف موسيقى مثل assets/audio/ambient-theme.ogg.',
      'يُستخدم المثال عندما تحتاج إيقاف الخلفية مؤقتًا أثناء نافذة إيقاف أو استئنافها عند العودة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *music = mixer ? MIX_LoadAudio(mixer, "assets/audio/ambient-theme.ogg", false) : NULL;
    MIX_Track *track = mixer ? MIX_CreateTrack(mixer) : NULL;
    SDL_Window *window = SDL_CreateWindow("التحكم في تشغيل الموسيقى", 1040, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !music || !track || !window || !renderer ||
        !MIX_SetTrackAudio(track, music)) {
        SDL_Log("فشل تجهيز مثال النقل الصوتي: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyTrack(track);
        MIX_DestroyAudio(music);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);
    MIX_PlayTrack(track, 0);
    MIX_SetTrackLoops(track, -1);

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_P) {
                    MIX_PauseTrack(track);
                } else if (event.key.key == SDLK_R) {
                    MIX_ResumeTrack(track);
                } else if (event.key.key == SDLK_S) {
                    MIX_StopTrack(track, 0);
                } else if (event.key.key == SDLK_SPACE) {
                    MIX_PlayTrack(track, 0);
                    MIX_SetTrackLoops(track, -1);
                }
            }
        }

        bool paused = MIX_TrackPaused(track);
        bool playing = MIX_TrackPlaying(track);

        SDL_SetRenderDrawColor(renderer, 17, 21, 29, 255);
        SDL_RenderClear(renderer);

        SDL_FRect play_box = { 220.0f, 220.0f, 160.0f, 90.0f };
        SDL_FRect pause_box = { 440.0f, 220.0f, 160.0f, 90.0f };
        SDL_FRect stop_box = { 660.0f, 220.0f, 160.0f, 90.0f };

        SDL_SetRenderDrawColor(renderer, playing && !paused ? 91 : 53, playing && !paused ? 170 : 70, 255, 255);
        SDL_RenderFillRect(renderer, &play_box);
        SDL_SetRenderDrawColor(renderer, paused ? 255 : 90, paused ? 198 : 112, paused ? 102 : 121, 255);
        SDL_RenderFillRect(renderer, &pause_box);
        SDL_SetRenderDrawColor(renderer, (!playing && !paused) ? 235 : 96, (!playing && !paused) ? 102 : 89, (!playing && !paused) ? 102 : 104, 255);
        SDL_RenderFillRect(renderer, &stop_box);
        SDL_RenderPresent(renderer);
    }

    MIX_StopTrack(track, 0);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyTrack(track);
    MIX_DestroyAudio(music);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'توقف MIX_PauseTrack مزج المسار الحالي من دون فقد حالته، لذلك يمكن استئنافه لاحقًا عبر MIX_ResumeTrack من نفس الموضع تقريبًا.',
      'يوقف MIX_StopTrack التشغيل نهائيًا لهذا المسار، وعندها تحتاج إلى MIX_PlayTrack من جديد كي يعود من البداية.',
      'تعطي MIX_TrackPlaying و MIX_TrackPaused طبقة حالة برمجية واضحة، فيصبح من السهل عكس وضع النقل الصوتي على الواجهة.'
    ],
    expectedResult: 'تبدأ الموسيقى في الخلفية، ويمكنك ضغط P للإيقاف المؤقت، وR للاستئناف، وS للإيقاف الكامل، ومفتاح المسافة لإعادة التشغيل من البداية. تتغير الصناديق الملونة بحسب الحالة الحالية.',
    related: [
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_CreateTrack',
      'MIX_SetTrackAudio',
      'MIX_PlayTrack',
      'MIX_PauseTrack',
      'MIX_ResumeTrack',
      'MIX_StopTrack',
      'MIX_TrackPlaying',
      'MIX_TrackPaused',
      'MIX_SetTrackLoops',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_P',
      'SDLK_R',
      'SDLK_S',
      'SDLK_SPACE'
    ],
    previewKind: 'audio-transport',
    previewTitle: 'معاينة لتحكم النقل الصوتي: تشغيل وإيقاف مؤقت واستئناف وإيقاف.'
  },
  {
    id: 'mixer-volume-settings',
    packageKey: 'mixer',
    title: 'مثال التحكم في مستوى الصوت والكتم',
    goal: 'يبني هذا المثال إعدادات صوت بسيطة تتحكم في مستوى الخرج العام للمازج، بحيث يمكن خفض الصوت ورفعه أو كتمه بالكامل أثناء التشغيل.',
    shows: 'يوضح الفارق بين تشغيل الصوت نفسه وبين التحكم في مستواه العام، مع استعمال MIX_SetMixerGain و MIX_GetMixerGain لبناء واجهة إعدادات صوت عملية.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملف موسيقى أو صوت مستمر مثل assets/audio/room-loop.ogg.',
      'يضغط المستخدم السهمين الأعلى والأسفل لرفع المستوى أو خفضه، وM للكتم أو الاستعادة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *music = mixer ? MIX_LoadAudio(mixer, "assets/audio/room-loop.ogg", false) : NULL;
    MIX_Track *track = mixer ? MIX_CreateTrack(mixer) : NULL;
    SDL_Window *window = SDL_CreateWindow("إعدادات مستوى الصوت", 1040, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !music || !track || !window || !renderer ||
        !MIX_SetTrackAudio(track, music)) {
        SDL_Log("فشل تجهيز إعدادات الصوت: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyTrack(track);
        MIX_DestroyAudio(music);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);
    MIX_PlayTrack(track, 0);
    MIX_SetTrackLoops(track, -1);
    MIX_SetMixerGain(mixer, 0.85f);

    float remembered_gain = 0.85f;
    bool muted = false;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                float gain = MIX_GetMixerGain(mixer);

                if (event.key.key == SDLK_UP) {
                    gain += 0.05f;
                    if (gain > 1.0f) gain = 1.0f;
                    MIX_SetMixerGain(mixer, gain);
                    remembered_gain = gain;
                    muted = false;
                } else if (event.key.key == SDLK_DOWN) {
                    gain -= 0.05f;
                    if (gain < 0.0f) gain = 0.0f;
                    MIX_SetMixerGain(mixer, gain);
                    remembered_gain = gain;
                    muted = (gain == 0.0f);
                } else if (event.key.key == SDLK_M) {
                    if (muted) {
                        MIX_SetMixerGain(mixer, remembered_gain > 0.0f ? remembered_gain : 0.65f);
                        muted = false;
                    } else {
                        remembered_gain = gain;
                        MIX_SetMixerGain(mixer, 0.0f);
                        muted = true;
                    }
                }
            }
        }

        float current_gain = MIX_GetMixerGain(mixer);
        SDL_SetRenderDrawColor(renderer, 15, 19, 27, 255);
        SDL_RenderClear(renderer);

        SDL_FRect base = { 220.0f, 250.0f, 600.0f, 26.0f };
        SDL_FRect fill = { 220.0f, 250.0f, 600.0f * current_gain, 26.0f };
        SDL_FRect icon = { 220.0f, 180.0f, muted ? 42.0f : 96.0f, 18.0f };

        SDL_SetRenderDrawColor(renderer, 52, 65, 87, 255);
        SDL_RenderFillRect(renderer, &base);
        SDL_SetRenderDrawColor(renderer, muted ? 225 : 92, muted ? 92 : 171, muted ? 92 : 255, 255);
        SDL_RenderFillRect(renderer, &fill);
        SDL_SetRenderDrawColor(renderer, 255, 198, 104, 255);
        SDL_RenderFillRect(renderer, &icon);
        SDL_RenderPresent(renderer);
    }

    MIX_StopTrack(track, 0);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyTrack(track);
    MIX_DestroyAudio(music);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يضبط MIX_SetMixerGain مستوى الخرج العام لكل ما يمر عبر المازج، لذلك يصلح لبناء إعداد رئيسي للصوت بدل تعديل كل مسار على حدة.',
      'يعيد MIX_GetMixerGain القراءة الحالية للمستوى، وهو ما تحتاجه لرسم شريط التحكم أو لتخزين آخر قيمة قبل الكتم.',
      'يبقي remembered_gain آخر مستوى مسموع حتى يعود الكتم إلى القيمة السابقة بدل العودة إلى رقم ثابت كل مرة.'
    ],
    expectedResult: 'تعمل الموسيقى في الخلفية، ويمكنك رفع المستوى أو خفضه بالسهمين الأعلى والأسفل، أو كتمه وإعادته بمفتاح M. يتغير شريط أفقي على الشاشة ليعكس مستوى الصوت الحالي.',
    related: [
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_CreateTrack',
      'MIX_SetTrackAudio',
      'MIX_PlayTrack',
      'MIX_SetTrackLoops',
      'MIX_SetMixerGain',
      'MIX_GetMixerGain',
      'MIX_StopTrack',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_UP',
      'SDLK_DOWN',
      'SDLK_M'
    ],
    previewKind: 'audio-volume',
    previewTitle: 'معاينة لإعدادات مستوى الصوت والكتم.'
  },
  {
    id: 'mixer-gui-feedback',
    packageKey: 'mixer',
    title: 'مثال صوت Hover و Click عند التفاعل مع عنصر واجهة',
    goal: 'يوضح هذا المثال كيف تربط مؤثرين صوتيين مختلفين مع التحويم والنقر فوق عنصر واجهة بسيط داخل نافذة SDL3.',
    shows: 'يبين الاستخدام الحقيقي للصوت في الواجهة: مؤثر خفيف عند المرور فوق العنصر، ومؤثر أوضح عند النقر عليه، مع تمييز بصري يعكس الحدث نفسه.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملفا صوت قصيران مثل assets/audio/ui-hover.wav و assets/audio/ui-press.wav.',
      'يفيد هذا النمط في القوائم، الأزرار، وأدوات GUI التي تحتاج تغذية سمعية سريعة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= (rect->x + rect->w) &&
           y >= rect->y && y <= (rect->y + rect->h);
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *hover_sound = mixer ? MIX_LoadAudio(mixer, "assets/audio/ui-hover.wav", true) : NULL;
    MIX_Audio *click_sound = mixer ? MIX_LoadAudio(mixer, "assets/audio/ui-press.wav", true) : NULL;
    SDL_Window *window = SDL_CreateWindow("تغذية سمعية للواجهة", 980, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !hover_sound || !click_sound || !window || !renderer) {
        SDL_Log("فشل تجهيز أصوات الواجهة: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyAudio(click_sound);
        MIX_DestroyAudio(hover_sound);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);

    SDL_FRect button = { 300.0f, 190.0f, 380.0f, 140.0f };
    bool hovered = false;
    bool was_hovered = false;
    float click_flash = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                hovered = PointInRect(event.motion.x, event.motion.y, &button);
                if (hovered && !was_hovered) {
                    MIX_PlayAudio(mixer, hover_sound);
                }
                was_hovered = hovered;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &button)) {
                MIX_PlayAudio(mixer, click_sound);
                click_flash = 1.0f;
            }
        }

        if (click_flash > 0.0f) {
            click_flash -= 0.03f;
            if (click_flash < 0.0f) {
                click_flash = 0.0f;
            }
        }

        SDL_SetRenderDrawColor(renderer, 19, 22, 29, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, hovered ? 92 : 63, hovered ? 154 : 95, hovered ? 255 : 162, 255);
        SDL_RenderFillRect(renderer, &button);

        SDL_FRect feedback = { 300.0f, 370.0f, click_flash * 380.0f, 16.0f };
        SDL_SetRenderDrawColor(renderer, 255, 201, 96, 255);
        SDL_RenderFillRect(renderer, &feedback);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyAudio(click_sound);
    MIX_DestroyAudio(hover_sound);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يفصل المثال بين حدث التحويم وحدث النقر، لذلك يحصل كل منهما على مؤثره الصوتي المناسب بدل إعادة استخدام نفس الملف لكل التفاعلات.',
      'تمنع مقارنة hovered مع was_hovered تكرار صوت Hover في كل حركة للفأرة داخل العنصر نفسه، فلا يعمل المؤثر إلا عند الدخول الفعلي إلى المساحة.',
      'يحافظ MIX_PlayAudio هنا على بساطة دمج الصوت مع الواجهة لأنك لا تحتاج مسارًا دائمًا لكل مؤثر UI قصير.'
    ],
    expectedResult: 'عند دخول المؤشر فوق الزر يسمع المستخدم صوت Hover مرة واحدة، وعند النقر عليه يعمل صوت Click ويظهر شريط وميض سفلي يؤكد الحدث بصريًا.',
    related: [
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_PlayAudio',
      'MIX_DestroyAudio',
      'MIX_DestroyMixer',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT',
      'SDL_FRect'
    ],
    previewKind: 'audio-gui',
    previewTitle: 'معاينة لتغذية سمعية عند Hover و Click داخل عنصر واجهة.'
  },
  {
    id: 'mixer-sfx-system',
    packageKey: 'mixer',
    title: 'مثال نظام مؤثرات صوتية بسيط بعدة مسارات',
    goal: 'يبني هذا المثال نظامًا صغيرًا للمؤثرات الصوتية يعتمد على عدة MIX_Track مستقلة، مع إمكان تشغيل أصوات متعددة في الوقت نفسه والتحكم بها كمجموعة.',
    shows: 'يوضح كيف تنتقل من تشغيل صوت منفرد إلى إدارة عدة مؤثرات مرتبطة بالأحداث، مع استخدام وسوم وتحكم جماعي في المستوى لتكوين نواة نظام مؤثرات صوتية حقيقي.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ثلاثة ملفات صوتية قصيرة مثل assets/audio/hit.wav و assets/audio/pickup.wav و assets/audio/success.wav.',
      'يضغط المستخدم 1 و2 و3 لتشغيل المسارات منفردة، ومفتاح المسافة لتشغيل المجموعة كلها، والسهمين الأعلى والأسفل لتعديل مستوى المجموعة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *hit = mixer ? MIX_LoadAudio(mixer, "assets/audio/hit.wav", true) : NULL;
    MIX_Audio *pickup = mixer ? MIX_LoadAudio(mixer, "assets/audio/pickup.wav", true) : NULL;
    MIX_Audio *success = mixer ? MIX_LoadAudio(mixer, "assets/audio/success.wav", true) : NULL;
    MIX_Track *tracks[3] = { NULL, NULL, NULL };
    SDL_Window *window = SDL_CreateWindow("نظام المؤثرات الصوتية", 1120, 680, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (mixer) {
        for (int i = 0; i < 3; ++i) {
            tracks[i] = MIX_CreateTrack(mixer);
        }
    }

    if (!device || !mixer || !hit || !pickup || !success || !tracks[0] || !tracks[1] || !tracks[2] ||
        !window || !renderer ||
        !MIX_SetTrackAudio(tracks[0], hit) ||
        !MIX_SetTrackAudio(tracks[1], pickup) ||
        !MIX_SetTrackAudio(tracks[2], success) ||
        !MIX_TagTrack(tracks[0], "sfx") ||
        !MIX_TagTrack(tracks[1], "sfx") ||
        !MIX_TagTrack(tracks[2], "sfx")) {
        SDL_Log("فشل تجهيز نظام المؤثرات: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        for (int i = 0; i < 3; ++i) {
            MIX_DestroyTrack(tracks[i]);
        }
        MIX_DestroyAudio(success);
        MIX_DestroyAudio(pickup);
        MIX_DestroyAudio(hit);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);
    float sfx_gain = 0.85f;
    MIX_SetTagGain(mixer, "sfx", sfx_gain);

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_1) {
                    MIX_PlayTrack(tracks[0], 0);
                } else if (event.key.key == SDLK_2) {
                    MIX_PlayTrack(tracks[1], 0);
                } else if (event.key.key == SDLK_3) {
                    MIX_PlayTrack(tracks[2], 0);
                } else if (event.key.key == SDLK_SPACE) {
                    MIX_PlayTag(mixer, "sfx", 0);
                } else if (event.key.key == SDLK_UP) {
                    sfx_gain += 0.05f;
                    if (sfx_gain > 1.0f) sfx_gain = 1.0f;
                    MIX_SetTagGain(mixer, "sfx", sfx_gain);
                } else if (event.key.key == SDLK_DOWN) {
                    sfx_gain -= 0.05f;
                    if (sfx_gain < 0.0f) sfx_gain = 0.0f;
                    MIX_SetTagGain(mixer, "sfx", sfx_gain);
                }
            }
        }

        SDL_SetRenderDrawColor(renderer, 17, 21, 28, 255);
        SDL_RenderClear(renderer);

        for (int i = 0; i < 3; ++i) {
            SDL_FRect lane = { 220.0f, 140.0f + (float)i * 120.0f, 680.0f, 64.0f };
            bool active = MIX_TrackPlaying(tracks[i]);
            SDL_SetRenderDrawColor(renderer, active ? 90 : 51, active ? 169 : 70, active ? 255 : 90, 255);
            SDL_RenderFillRect(renderer, &lane);
        }

        SDL_RenderPresent(renderer);
    }

    for (int i = 0; i < 3; ++i) {
        MIX_DestroyTrack(tracks[i]);
    }
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyAudio(success);
    MIX_DestroyAudio(pickup);
    MIX_DestroyAudio(hit);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'ينشئ المثال عدة MIX_Track مستقلة، وهذا هو النظير العملي لتعدد القنوات في هذا الملحق: كل مسار يمكن تشغيله أو إيقافه من دون التأثير في الآخر.',
      'تجعل MIX_TagTrack مع MIX_PlayTag و MIX_SetTagGain من السهل التعامل مع المؤثرات كمجموعة منطقية واحدة مثل `sfx` بدل إدارة كل صوت منفردًا في كل مرة.',
      'تعرض MIX_TrackPlaying حالة كل مسار، مما يسهّل تحويل نشاط النظام الصوتي إلى مؤشرات مرئية داخل الواجهة.'
    ],
    expectedResult: 'يمكن تشغيل ثلاثة مؤثرات منفصلة بالمفاتيح 1 و2 و3، أو تشغيلها كلها معًا عبر مفتاح المسافة. وتظهر ثلاثة أشرطة تضيء عندما يكون كل مسار نشطًا، مع تحكم جماعي في مستوى مجموعة المؤثرات.',
    related: [
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_CreateTrack',
      'MIX_SetTrackAudio',
      'MIX_PlayTrack',
      'MIX_PlayTag',
      'MIX_TagTrack',
      'MIX_SetTagGain',
      'MIX_TrackPlaying',
      'MIX_DestroyTrack',
      'MIX_DestroyAudio',
      'MIX_DestroyMixer',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_1',
      'SDLK_2',
      'SDLK_3',
      'SDLK_SPACE',
      'SDLK_UP',
      'SDLK_DOWN'
    ],
    previewKind: 'audio-system',
    previewTitle: 'معاينة لنظام مؤثرات صوتية بسيط بعدة مسارات.'
  },
  {
    id: 'mixer-music-states',
    packageKey: 'mixer',
    title: 'مثال نظام موسيقى يتغير حسب حالة التطبيق',
    goal: 'يوضح هذا المثال كيف تبدل بين موسيقى حالة القائمة وموسيقى حالة اللعب أو النشاط، بحيث يتغير المسار الخلفي مع تغير وضع التطبيق.',
    shows: 'يبين سيناريو تنظيميًا أقرب للمشاريع الحقيقية: أكثر من مسار موسيقي، وكل واحد يرتبط بحالة معينة، مع إيقاف المسار السابق وتشغيل الجديد عند الانتقال.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_mixer.',
      'ملفا موسيقى مثل assets/audio/menu-theme.ogg و assets/audio/action-theme.ogg.',
      'يضغط المستخدم 1 للعودة إلى موسيقى القائمة و2 للانتقال إلى موسيقى الحالة النشطة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_AudioSpec spec;
    SDL_zero(spec);
    spec.format = SDL_AUDIO_F32;
    spec.channels = 2;
    spec.freq = 48000;

    SDL_AudioDeviceID device = SDL_OpenAudioDevice(SDL_AUDIO_DEVICE_DEFAULT_PLAYBACK, &spec);
    MIX_Mixer *mixer = device ? MIX_CreateMixerDevice(device, &spec) : NULL;
    MIX_Audio *menu_music = mixer ? MIX_LoadAudio(mixer, "assets/audio/menu-theme.ogg", false) : NULL;
    MIX_Audio *action_music = mixer ? MIX_LoadAudio(mixer, "assets/audio/action-theme.ogg", false) : NULL;
    MIX_Track *menu_track = mixer ? MIX_CreateTrack(mixer) : NULL;
    MIX_Track *action_track = mixer ? MIX_CreateTrack(mixer) : NULL;
    SDL_Window *window = SDL_CreateWindow("حالات الموسيقى", 1100, 650, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;

    if (!device || !mixer || !menu_music || !action_music || !menu_track || !action_track ||
        !window || !renderer ||
        !MIX_SetTrackAudio(menu_track, menu_music) ||
        !MIX_SetTrackAudio(action_track, action_music)) {
        SDL_Log("فشل تجهيز نظام تبديل الموسيقى: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        MIX_DestroyTrack(action_track);
        MIX_DestroyTrack(menu_track);
        MIX_DestroyAudio(action_music);
        MIX_DestroyAudio(menu_music);
        MIX_DestroyMixer(mixer);
        if (device) {
            SDL_CloseAudioDevice(device);
        }
        SDL_Quit();
        return 1;
    }

    SDL_ResumeAudioDevice(device);
    MIX_PlayTrack(menu_track, 0);
    MIX_SetTrackLoops(menu_track, -1);

    int state = 1;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_1 && state != 1) {
                    MIX_StopTrack(action_track, 0);
                    MIX_PlayTrack(menu_track, 0);
                    MIX_SetTrackLoops(menu_track, -1);
                    state = 1;
                } else if (event.key.key == SDLK_2 && state != 2) {
                    MIX_StopTrack(menu_track, 0);
                    MIX_PlayTrack(action_track, 0);
                    MIX_SetTrackLoops(action_track, -1);
                    state = 2;
                }
            }
        }

        SDL_SetRenderDrawColor(renderer, 16, 19, 27, 255);
        SDL_RenderClear(renderer);

        SDL_FRect menu_card = { 170.0f, 180.0f, 300.0f, 180.0f };
        SDL_FRect action_card = { 620.0f, 180.0f, 300.0f, 180.0f };
        SDL_SetRenderDrawColor(renderer, state == 1 ? 86 : 45, state == 1 ? 144 : 62, state == 1 ? 228 : 88, 255);
        SDL_RenderFillRect(renderer, &menu_card);
        SDL_SetRenderDrawColor(renderer, state == 2 ? 224 : 58, state == 2 ? 116 : 73, state == 2 ? 88 : 94, 255);
        SDL_RenderFillRect(renderer, &action_card);
        SDL_RenderPresent(renderer);
    }

    MIX_StopTrack(menu_track, 0);
    MIX_StopTrack(action_track, 0);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    MIX_DestroyTrack(action_track);
    MIX_DestroyTrack(menu_track);
    MIX_DestroyAudio(action_music);
    MIX_DestroyAudio(menu_music);
    MIX_DestroyMixer(mixer);
    SDL_CloseAudioDevice(device);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يبقي المثال لكل حالة مسارها الخاص، وهذا يجعل تبديل الموسيقى منظمًا بدل إعادة تعيين ملف جديد داخل نفس الكيان في كل مرة.',
      'يعكس state العلاقة بين منطق التطبيق ومساره الخلفي الحالي، وهو ما تحتاجه في القوائم والمشاهد الانتقالية واللعب الفعلي.',
      'إيقاف المسار السابق قبل تشغيل الجديد يمنع تراكب الخلفيتين فوق بعضهما ما لم يكن ذلك مقصودًا تصميميًا.'
    ],
    expectedResult: 'تبدأ موسيقى القائمة أولًا. عند الضغط على 2 تنتقل الخلفية إلى موسيقى الحالة النشطة، وعند الضغط على 1 تعود إلى موسيقى القائمة، مع بطاقتين بصريتين توضحان الحالة الجارية.',
    related: [
      'MIX_CreateMixerDevice',
      'MIX_LoadAudio',
      'MIX_CreateTrack',
      'MIX_SetTrackAudio',
      'MIX_PlayTrack',
      'MIX_SetTrackLoops',
      'MIX_StopTrack',
      'MIX_DestroyTrack',
      'MIX_DestroyAudio',
      'MIX_DestroyMixer',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_1',
      'SDLK_2'
    ],
    previewKind: 'audio-state',
    previewTitle: 'معاينة لتبديل موسيقى الخلفية بحسب حالة التطبيق.'
  },
  {
    id: 'mixer-audio-dashboard-imgui',
    packageKey: 'mixer',
    title: 'مثال لوحة تحكم صوتية احترافية فوق SDL3_mixer',
    goal: 'يجمع هذا المثال بين SDL3_mixer كطبقة صوت فعلية وبين Dear ImGui كلوحة تحكم مرئية داخل نافذة SDL3، بحيث يستطيع المستخدم تعديل مستوى الصوت العام والموسيقى والمؤثرات ومفاتيح الكتم ومعاينة خرج الصوت لحظيًا.',
    shows: 'هذا المثال ليس من SDL3 الأساسية وحدها، بل من SDL3 + SDL3_mixer + Dear ImGui. SDL3 تدير النافذة والأحداث، SDL3_mixer تتولى المزج الفعلي، وDear ImGui تبني لوحة التحكم الرسومية.',
    headers: ['SDL3/SDL.h', 'SDL3_mixer/SDL_mixer.h'],
    requirements: [
      'تهيئة SDL3 وSDL3_mixer أولًا مع مسار موسيقى ومؤثر قصير جاهزين للتشغيل.',
      'تهيئة Dear ImGui فوق SDL3 مثل أمثلة SDL3 + Dear ImGui الأخرى داخل المشروع.',
      'يناسب المثال إعدادات الصوت داخل لعبة أو أداة تحرير أكثر من كونه واجهة صوت مستقلة بذاتها.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_mixer/SDL_mixer.h>
#include <imgui.h>

void DrawAudioDashboardExample(MIX_Mixer* mixer, MIX_Track* music_track, MIX_Audio* click_sfx)
{
    static float master_gain = 0.82f;
    static float music_gain = 0.74f;
    static float sfx_gain = 0.90f;
    static bool mute_master = false;
    static bool mute_music = false;
    static bool mute_sfx = false;
    static float fake_vu_left = 0.18f;
    static float fake_vu_right = 0.26f;

    fake_vu_left = fmodf(fake_vu_left + ImGui::GetIO().DeltaTime * 0.42f, 1.0f);
    fake_vu_right = fmodf(fake_vu_right + ImGui::GetIO().DeltaTime * 0.34f, 1.0f);

    ImGui::Begin("لوحة التحكم الصوتية");
    ImGui::Text("عناصر تحكم SDL3_mixer مدمجة داخل لوحة Dear ImGui.");
    ImGui::Separator();

    ImGui::SliderFloat("الصوت العام", &master_gain, 0.0f, 1.0f);
    ImGui::SliderFloat("الموسيقى", &music_gain, 0.0f, 1.0f);
    ImGui::SliderFloat("المؤثرات", &sfx_gain, 0.0f, 1.0f);

    ImGui::Checkbox("كتم الصوت العام", &mute_master);
    ImGui::SameLine();
    ImGui::Checkbox("كتم الموسيقى", &mute_music);
    ImGui::SameLine();
    ImGui::Checkbox("كتم المؤثرات", &mute_sfx);

    if (ImGui::Button("تشغيل صوت الواجهة") && click_sfx && !mute_sfx) {
        MIX_PlayAudio(mixer, click_sfx);
    }
    ImGui::SameLine();
    if (ImGui::Button("إيقاف الموسيقى مؤقتًا") && music_track) {
        MIX_PauseTrack(music_track);
    }
    ImGui::SameLine();
    if (ImGui::Button("استئناف الموسيقى") && music_track) {
        MIX_ResumeTrack(music_track);
    }

    float effective_master = mute_master ? 0.0f : master_gain;
    MIX_SetMixerGain(mixer, effective_master);
    if (music_track) {
        MIX_SetTrackGain(music_track, mute_music ? 0.0f : music_gain);
    }

    ImGui::Separator();
    ImGui::Text("مؤشرات الخرج");
    ImGui::ProgressBar(fake_vu_left * effective_master, ImVec2(-1.0f, 0.0f), "القناة اليسرى");
    ImGui::ProgressBar(fake_vu_right * effective_master, ImVec2(-1.0f, 0.0f), "القناة اليمنى");
    ImGui::Text("العام=%.2f  الموسيقى=%.2f  المؤثرات=%.2f", effective_master, mute_music ? 0.0f : music_gain, mute_sfx ? 0.0f : sfx_gain);
    ImGui::End();
}`,
    highlights: [
      'يوضح المثال الفصل بين الطبقات بوضوح: SDL3 للنافذة والأحداث، وSDL3_mixer للمزج، وDear ImGui لبناء لوحة تحكم صوتية مفهومة بصريًا.',
      'تطبيق MIX_SetMixerGain وMIX_SetTrackGain يتم من القيم التي يديرها المستخدم من الواجهة مباشرة، لذلك يرى أثر الإعداد فورًا في لوحة واحدة.',
      'زر تشغيل صوت الواجهة يفيد لفحص مستوى المؤثرات بسرعة من داخل اللوحة نفسها بدل مغادرة صفحة الإعدادات أو انتظار حدث آخر في التطبيق.'
    ],
    expectedResult: 'تظهر نافذة أدوات صوتية فيها منزلقات ومستويات ومفاتيح كتم وأزرار تشغيل وإيقاف مؤقت، ويمكن ضبط الصوت العام والموسيقى والمؤثرات من مكان واحد داخل تطبيق SDL3.',
    related: [
      'SDL_Init',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_OpenAudioDevice',
      'MIX_CreateMixerDevice',
      'MIX_SetMixerGain',
      'MIX_SetTrackGain',
      'MIX_PlayAudio',
      'MIX_PauseTrack',
      'MIX_ResumeTrack'
    ],
    previewKind: 'audio-dashboard',
    previewTitle: 'معاينة للوحة تحكم صوتية احترافية مبنية فوق SDL3_mixer.'
  },
  {
    id: 'font-text',
    packageKey: 'ttf',
    title: 'مثال الخطوط والنصوص عبر SDL3_ttf',
    goal: 'يعرض هذا المثال المسار العملي لفتح خط، توليد سطح نصي من SDL3_ttf، ثم تحويله إلى SDL_Texture حتى يظهر النص داخل النافذة.',
    shows: 'يوضح الخطوات الأساسية التي يبدأ منها أي استخدام للنصوص في SDL3_ttf: فتح الخط، تكوين اللون، توليد SDL_Surface للنص، ثم تحويله إلى SDL_Texture للرسم.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'رسالة نصية تريد تحويلها إلى مورد مرئي داخل النافذة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf text example", 960, 540, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 30.0f)
        : NULL;

    const char *message = "مرحبا من SDL3_ttf";
    SDL_Color text_color = { 245, 232, 210, 255 };
    SDL_Surface *text_surface = font
        ? TTF_RenderText_Blended(font, message, SDL_strlen(message), text_color)
        : NULL;
    SDL_Texture *text_texture = text_surface
        ? SDL_CreateTextureFromSurface(renderer, text_surface)
        : NULL;

    if (!window || !renderer || !font || !text_surface || !text_texture) {
        SDL_Log("فشل تجهيز الخط أو النص: %s", SDL_GetError());
        SDL_DestroyTexture(text_texture);
        SDL_DestroySurface(text_surface);
        TTF_CloseFont(font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    float text_w = 0.0f;
    float text_h = 0.0f;
    SDL_GetTextureSize(text_texture, &text_w, &text_h);
    SDL_FRect dst = { 60.0f, 72.0f, text_w, text_h };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 28, 24, 34, 255);
        SDL_RenderClear(renderer);
        SDL_RenderTexture(renderer, text_texture, NULL, &dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(text_texture);
    SDL_DestroySurface(text_surface);
    TTF_CloseFont(font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تهيئة TTF_Init إلزامية قبل فتح أي TTF_Font لأن مكتبة الخطوط تحتاج بناء حالتها الداخلية أولًا.',
      'TTF_RenderText_Blended يحول النص إلى SDL_Surface، لذلك يظل المسار العام شبيهًا بمثال الصور: سطح أولًا ثم SDL_Texture للرسم.',
      'SDL_strlen يمرر طول النص الفعلي إلى TTF_RenderText_Blended، وهو ما يجعل المثال صريحًا في التعامل مع السلسلة المعروضة.'
    ],
    expectedResult: 'تظهر رسالة نصية واضحة داخل النافذة باستخدام الخط المحدد. إذا تعذر فتح ملف الخط أو توليد السطح النصي فسيظهر الخطأ عبر SDL_Log مع تنظيف الموارد الجزئية.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_strlen',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture'
    ],
    previewKind: 'text',
    previewTitle: 'شكل مثال النص والخط الناتج من SDL3_ttf داخل النافذة.'
  },
  {
    id: 'text-title-subtitle',
    packageKey: 'ttf',
    title: 'مثال عنوان رئيسي ونص فرعي بأحجام وألوان مختلفة',
    goal: 'يبين هذا المثال كيف تعرض عنوانًا كبيرًا مع وصف ثانوي أصغر منه، بحيث يصبح الفرق بين دور النصين واضحًا بصريًا داخل بطاقة أو واجهة لوحة معلومات.',
    shows: 'يوضح الفرق العملي بين تغيير حجم الخط وتغيير لونه ومحاذاته داخل مساحة محددة، مع استعمال خطين مختلفين للعنوان والمحتوى الوصفي.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'مناسب لشاشات البداية، بطاقات الملخص، والعناوين التي تحتاج طبقتين بصريتين واضحتين.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf title example", 1100, 640, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *title_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 54.0f)
        : NULL;
    TTF_Font *subtitle_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 24.0f)
        : NULL;

    SDL_Color title_color = { 247, 231, 195, 255 };
    SDL_Color subtitle_color = { 203, 167, 224, 255 };
    float title_w = 0.0f;
    float title_h = 0.0f;
    float subtitle_w = 0.0f;
    float subtitle_h = 0.0f;
    SDL_Texture *title_texture = (title_font && subtitle_font)
        ? CreateTextTexture(renderer, title_font, "لوحة الإحصاءات", title_color, &title_w, &title_h)
        : NULL;
    SDL_Texture *subtitle_texture = (title_font && subtitle_font)
        ? CreateTextTexture(renderer, subtitle_font, "ملخص سريع يوضح كيف يختلف العنوان عن النص الوصفي", subtitle_color, &subtitle_w, &subtitle_h)
        : NULL;

    if (!window || !renderer || !title_font || !subtitle_font || !title_texture || !subtitle_texture) {
        SDL_Log("فشل تجهيز العنوان أو النص الفرعي: %s", SDL_GetError());
        SDL_DestroyTexture(subtitle_texture);
        SDL_DestroyTexture(title_texture);
        TTF_CloseFont(subtitle_font);
        TTF_CloseFont(title_font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    SDL_FRect panel = { 140.0f, 120.0f, 820.0f, 300.0f };
    SDL_FRect title_dst = {
        panel.x + (panel.w - title_w) * 0.5f,
        panel.y + 72.0f,
        title_w,
        title_h
    };
    SDL_FRect subtitle_dst = {
        panel.x + (panel.w - subtitle_w) * 0.5f,
        panel.y + 170.0f,
        subtitle_w,
        subtitle_h
    };

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 23, 18, 29, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 37, 26, 48, 255);
        SDL_RenderFillRect(renderer, &panel);
        SDL_RenderTexture(renderer, title_texture, NULL, &title_dst);
        SDL_RenderTexture(renderer, subtitle_texture, NULL, &subtitle_dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(subtitle_texture);
    SDL_DestroyTexture(title_texture);
    TTF_CloseFont(subtitle_font);
    TTF_CloseFont(title_font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'فتح الخط نفسه بحجمين مختلفين يوضح أن التحكم في التسلسل البصري للنص يبدأ من TTF_OpenFont لا من الرسم وحده.',
      'يقرأ SDL_GetTextureSize الأبعاد النهائية لكل سطر بعد التوليد، لذلك تستطيع توسيط العنوان والوصف داخل بطاقة ثابتة المساحة.',
      'اختلاف اللون والحجم بين العنوان والوصف يصنع طبقة معلومات واضحة، وهو ما تحتاجه عادة في البطاقات ولوحات التحكم.'
    ],
    expectedResult: 'تظهر بطاقة وسط النافذة تحتوي عنوانًا كبيرًا بلون فاتح ووصفًا أصغر تحته بلون مختلف، مع محاذاة مركزية تبين الفرق بين طبقات النص داخل نفس المساحة.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_FRect'
    ],
    previewKind: 'text-title',
    previewTitle: 'معاينة لعنوان رئيسي مع نص فرعي بأحجام وألوان مختلفة.'
  },
  {
    id: 'text-multi-line-panel',
    packageKey: 'ttf',
    title: 'مثال عرض عدة أسطر نصية مع محاذاة داخل لوحة',
    goal: 'يبني هذا المثال لوحة وصفية تعرض عدة أسطر مستقلة داخل مساحة واحدة، مع محاذاة واضحة تجعل قراءة البنود المتعددة أكثر تنظيمًا.',
    shows: 'يوضح طريقة تقسيم المحتوى النصي إلى عدة SDL_Texture منفصلة بدل محاولة التعامل معه كسطر واحد، مع حساب موضع كل سطر داخل لوحة محددة.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'مناسب للحوارات، القوائم الوصفية، ولوحات التعليمات التي تعرض أكثر من سطر.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf lines example", 1180, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 28.0f)
        : NULL;

    const char *lines[4] = {
        "ابدأ بتحميل الموارد قبل دخول الحلقة الرئيسية.",
        "حدّث حالة التطبيق أولاً ثم ارسم النصوص النهائية.",
        "احسب موضع كل سطر داخل اللوحة بدل الاعتماد على أرقام مبعثرة.",
        "حرر SDL_Texture و TTF_Font عند الإغلاق دائمًا."
    };
    SDL_Texture *textures[4] = { NULL, NULL, NULL, NULL };
    float widths[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
    float heights[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
    SDL_Color colors[4] = {
        { 243, 224, 175, 255 },
        { 213, 190, 231, 255 },
        { 196, 170, 223, 255 },
        { 170, 142, 204, 255 }
    };

    if (font) {
        for (int i = 0; i < 4; ++i) {
            textures[i] = CreateTextTexture(renderer, font, lines[i], colors[i], &widths[i], &heights[i]);
        }
    }

    if (!window || !renderer || !font || !textures[0] || !textures[1] || !textures[2] || !textures[3]) {
        SDL_Log("فشل تجهيز الأسطر النصية: %s", SDL_GetError());
        for (int i = 0; i < 4; ++i) {
            SDL_DestroyTexture(textures[i]);
        }
        TTF_CloseFont(font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    SDL_FRect panel = { 180.0f, 120.0f, 820.0f, 360.0f };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 24, 18, 30, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 39, 28, 49, 255);
        SDL_RenderFillRect(renderer, &panel);

        for (int i = 0; i < 4; ++i) {
            SDL_FRect line_dst = {
                panel.x + panel.w - widths[i] - 34.0f,
                panel.y + 54.0f + (float)i * 68.0f,
                widths[i],
                heights[i]
            };
            SDL_RenderTexture(renderer, textures[i], NULL, &line_dst);
        }

        SDL_RenderPresent(renderer);
    }

    for (int i = 0; i < 4; ++i) {
        SDL_DestroyTexture(textures[i]);
    }
    TTF_CloseFont(font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يولد المثال كل سطر في SDL_Texture مستقل، وهذا يجعل إدارة المسافات والتلوين والمحاذاة أسهل بكثير من معاملة اللوحة كلها كسلسلة واحدة.',
      'حساب موضع السطر من الحافة اليمنى للوحة يبين كيف تضبط المحاذاة داخل مساحة محددة بدل الاعتماد على موضع ثابت واحد للجميع.',
      'اختلاف اللون بين الأسطر يوضح أن كل سطر يمكن أن يحمل وزنه البصري أو أهميته الخاصة ضمن نفس اللوحة.'
    ],
    expectedResult: 'تظهر لوحة وصفية كبيرة تحتوي أربعة أسطر منظمة ومحاذاة من اليمين إلى الداخل، بحيث تبدو كقائمة تعليمات أو نقاط سريعة داخل واجهة التطبيق.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_FRect'
    ],
    previewKind: 'text-lines',
    previewTitle: 'معاينة لعدة أسطر نصية منظمة داخل لوحة واحدة.'
  },
  {
    id: 'text-live-counter',
    packageKey: 'ttf',
    title: 'مثال تحديث نص رقمي أثناء التشغيل',
    goal: 'يركز هذا المثال على تحديث النص ديناميكيًا أثناء التنفيذ، من خلال عرض عدد الثواني المنقضية داخل الواجهة مع إعادة توليد SDL_Texture عند تغير القيمة فقط.',
    shows: 'يوضح كيف تربط النص بحالة متغيرة في التطبيق بدل جعله قيمة ثابتة، وكيف تعيد بناء مورد النص عند تغير البيانات دون إهدار في كل إطار.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'مناسب للعدادات، شاشات القياس، ولوحات الحالة التي تعرض أرقامًا تتغير مع الوقت.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf counter example", 960, 600, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *label_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 26.0f)
        : NULL;
    TTF_Font *value_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 72.0f)
        : NULL;

    SDL_Texture *label_texture = NULL;
    SDL_Texture *value_texture = NULL;
    float label_w = 0.0f;
    float label_h = 0.0f;
    float value_w = 0.0f;
    float value_h = 0.0f;
    int displayed_seconds = -1;
    char counter_text[64];

    if (label_font && value_font) {
        label_texture = CreateTextTexture(renderer, label_font, "الوقت المنقضي داخل الجلسة", (SDL_Color){ 160, 199, 255, 255 }, &label_w, &label_h);
    }

    if (!window || !renderer || !label_font || !value_font || !label_texture) {
        SDL_Log("فشل تجهيز عداد النصوص: %s", SDL_GetError());
        SDL_DestroyTexture(label_texture);
        TTF_CloseFont(value_font);
        TTF_CloseFont(label_font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        int seconds = (int)(SDL_GetTicks() / 1000);
        if (seconds != displayed_seconds) {
            displayed_seconds = seconds;
            SDL_snprintf(counter_text, sizeof(counter_text), "%d", displayed_seconds);
            SDL_DestroyTexture(value_texture);
            value_texture = CreateTextTexture(renderer, value_font, counter_text, (SDL_Color){ 255, 210, 122, 255 }, &value_w, &value_h);
        }

        SDL_SetRenderDrawColor(renderer, 19, 22, 30, 255);
        SDL_RenderClear(renderer);

        SDL_FRect card = { 240.0f, 120.0f, 480.0f, 300.0f };
        SDL_SetRenderDrawColor(renderer, 26, 32, 45, 255);
        SDL_RenderFillRect(renderer, &card);

        SDL_FRect label_dst = { card.x + (card.w - label_w) * 0.5f, card.y + 56.0f, label_w, label_h };
        SDL_FRect value_dst = { card.x + (card.w - value_w) * 0.5f, card.y + 128.0f, value_w, value_h };
        SDL_RenderTexture(renderer, label_texture, NULL, &label_dst);
        if (value_texture) {
            SDL_RenderTexture(renderer, value_texture, NULL, &value_dst);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(value_texture);
    SDL_DestroyTexture(label_texture);
    TTF_CloseFont(value_font);
    TTF_CloseFont(label_font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يعتمد المثال على SDL_GetTicks لاستخراج حالة متغيرة من وقت التشغيل، ثم يحولها إلى نص مرئي عند تغير القيمة لا في كل إطار بلا داع.',
      'يفصل بين خط الوصف وخط القيمة الرقمية حتى تكون القراءة أوضح، وهو أسلوب شائع في لوحات الإحصاءات والمؤشرات.',
      'استخدام SDL_snprintf قبل إعادة التوليد يجعل النص المعروض مرتبطًا مباشرة بالحالة الرقمية الحالية داخل التطبيق.'
    ],
    expectedResult: 'تظهر بطاقة عداد في منتصف النافذة، يعلوها وصف قصير وتحتها رقم كبير يزداد كل ثانية. هذا يوضح كيف يتحول تغير حالة التطبيق إلى نص متجدد على الشاشة.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_GetTicks',
      'SDL_snprintf'
    ],
    previewKind: 'text-counter',
    previewTitle: 'معاينة لعداد نصي يتحدث أثناء التشغيل.'
  },
  {
    id: 'text-status-messages',
    packageKey: 'ttf',
    title: 'مثال رسائل الحالة والتنبيه مع تغيير اللون',
    goal: 'يوضح هذا المثال كيف تعرض رسالة نجاح أو تحذير أو خطأ داخل الواجهة، مع تغيير لون النص والشريط الجانبي بحسب الحالة الحالية للتطبيق.',
    shows: 'يبين طريقة ربط النص بحالة منطقية داخل التطبيق، بحيث لا يتغير المحتوى فقط بل تتغير معه الدلالة البصرية التي تساعد المستخدم على فهم الرسالة بسرعة.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'استخدم المفاتيح 1 و 2 و 3 للتبديل بين النجاح والتحذير والخطأ أثناء التشغيل.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf status example", 1100, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *message_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 34.0f)
        : NULL;
    TTF_Font *hint_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 20.0f)
        : NULL;

    SDL_Texture *message_texture = NULL;
    SDL_Texture *hint_texture = NULL;
    float message_w = 0.0f;
    float message_h = 0.0f;
    float hint_w = 0.0f;
    float hint_h = 0.0f;
    SDL_Color stripe_color = { 124, 207, 137, 255 };
    const char *message_text = "تم الحفظ بنجاح";

    if (message_font && hint_font) {
        message_texture = CreateTextTexture(renderer, message_font, message_text, (SDL_Color){ 239, 248, 238, 255 }, &message_w, &message_h);
        hint_texture = CreateTextTexture(renderer, hint_font, "1 نجاح   2 تحذير   3 خطأ", (SDL_Color){ 182, 194, 214, 255 }, &hint_w, &hint_h);
    }

    if (!window || !renderer || !message_font || !hint_font || !message_texture || !hint_texture) {
        SDL_Log("فشل تجهيز رسائل الحالة: %s", SDL_GetError());
        SDL_DestroyTexture(hint_texture);
        SDL_DestroyTexture(message_texture);
        TTF_CloseFont(hint_font);
        TTF_CloseFont(message_font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                SDL_Color message_color = { 239, 248, 238, 255 };

                if (event.key.key == SDLK_1) {
                    message_text = "تم الحفظ بنجاح";
                    stripe_color = (SDL_Color){ 124, 207, 137, 255 };
                } else if (event.key.key == SDLK_2) {
                    message_text = "تحذير: توجد حقول تحتاج مراجعة";
                    stripe_color = (SDL_Color){ 255, 197, 92, 255 };
                } else if (event.key.key == SDLK_3) {
                    message_text = "خطأ: تعذر إرسال البيانات";
                    stripe_color = (SDL_Color){ 239, 109, 109, 255 };
                } else {
                    continue;
                }

                SDL_DestroyTexture(message_texture);
                message_texture = CreateTextTexture(renderer, message_font, message_text, message_color, &message_w, &message_h);
            }
        }

        SDL_SetRenderDrawColor(renderer, 20, 23, 30, 255);
        SDL_RenderClear(renderer);

        SDL_FRect card = { 160.0f, 140.0f, 780.0f, 220.0f };
        SDL_FRect stripe = { card.x, card.y, 16.0f, card.h };
        SDL_FRect message_dst = { card.x + card.w - message_w - 44.0f, card.y + 64.0f, message_w, message_h };
        SDL_FRect hint_dst = { card.x + card.w - hint_w - 44.0f, card.y + 126.0f, hint_w, hint_h };

        SDL_SetRenderDrawColor(renderer, 32, 38, 49, 255);
        SDL_RenderFillRect(renderer, &card);
        SDL_SetRenderDrawColor(renderer, stripe_color.r, stripe_color.g, stripe_color.b, stripe_color.a);
        SDL_RenderFillRect(renderer, &stripe);
        SDL_RenderTexture(renderer, message_texture, NULL, &message_dst);
        SDL_RenderTexture(renderer, hint_texture, NULL, &hint_dst);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(hint_texture);
    SDL_DestroyTexture(message_texture);
    TTF_CloseFont(hint_font);
    TTF_CloseFont(message_font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يربط المثال بين الحالة الداخلية واللون والنص في آن واحد، لذلك لا يقتصر التبديل على الجملة وحدها بل يشمل الإشارة البصرية المواكبة لها.',
      'تعاد توليد message_texture فقط عند تبدل الحالة، وهذا هو النمط العملي الصحيح عندما يتغير النص بناءً على حدث وليس في كل إطار.',
      'يمثل الشريط الجانبي طبقة دعم بصرية مناسبة لشاشات التنبيه والرسائل في الواجهات الإدارية أو أدوات التحرير.'
    ],
    expectedResult: 'تظهر بطاقة رسالة في الوسط. الضغط على 1 أو 2 أو 3 يبدل النص بين نجاح وتحذير وخطأ، ويتغير معه لون الشريط الجانبي ليعكس نوع الحالة مباشرة.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_EVENT_KEY_DOWN',
      'SDLK_1',
      'SDLK_2',
      'SDLK_3'
    ],
    previewKind: 'text-status',
    previewTitle: 'معاينة لرسائل حالة قابلة للتبديل مع ألوان مختلفة.'
  },
  {
    id: 'text-button-toggle',
    packageKey: 'ttf',
    title: 'مثال تغيير النص عند الضغط على زر',
    goal: 'يبين هذا المثال كيف تستخدم SDL3_ttf مع عنصر زر بسيط لتغيير النص المعروض داخل الواجهة عند النقر، وهو سيناريو متكرر في الشاشات التفاعلية.',
    shows: 'يوضح كيف يندمج النص مع التفاعل: زر يحمل عنوانًا نصيًا، ورسالة حالة أسفله تتغير عند الضغط، مع إعادة توليد SDL_Texture فقط عند تبدل الحالة.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'مثال مناسب للأزرار النصية، لوحات الضبط، ورسائل التأكيد داخل الواجهة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= (rect->x + rect->w) &&
           y >= rect->y && y <= (rect->y + rect->h);
}

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf button example", 980, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *button_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 26.0f)
        : NULL;
    TTF_Font *status_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 30.0f)
        : NULL;

    float button_w = 0.0f;
    float button_h = 0.0f;
    float status_w = 0.0f;
    float status_h = 0.0f;
    SDL_Texture *button_texture = (button_font && status_font)
        ? CreateTextTexture(renderer, button_font, "بدّل الحالة", (SDL_Color){ 248, 245, 255, 255 }, &button_w, &button_h)
        : NULL;
    SDL_Texture *status_texture = (button_font && status_font)
        ? CreateTextTexture(renderer, status_font, "المزامنة متوقفة", (SDL_Color){ 241, 214, 154, 255 }, &status_w, &status_h)
        : NULL;
    bool enabled = false;

    if (!window || !renderer || !button_font || !status_font || !button_texture || !status_texture) {
        SDL_Log("فشل تجهيز زر النص: %s", SDL_GetError());
        SDL_DestroyTexture(status_texture);
        SDL_DestroyTexture(button_texture);
        TTF_CloseFont(status_font);
        TTF_CloseFont(button_font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    SDL_FRect button_rect = { 330.0f, 170.0f, 320.0f, 86.0f };
    bool hovered = false;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                hovered = PointInRect(event.motion.x, event.motion.y, &button_rect);
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &button_rect)) {
                enabled = !enabled;
                SDL_DestroyTexture(status_texture);

                if (enabled) {
                    status_texture = CreateTextTexture(renderer, status_font, "تم تفعيل المزامنة", (SDL_Color){ 146, 222, 171, 255 }, &status_w, &status_h);
                } else {
                    status_texture = CreateTextTexture(renderer, status_font, "المزامنة متوقفة", (SDL_Color){ 241, 214, 154, 255 }, &status_w, &status_h);
                }
            }
        }

        SDL_SetRenderDrawColor(renderer, 24, 20, 31, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, hovered ? 148 : 109, hovered ? 106 : 80, hovered ? 202 : 160, 255);
        SDL_RenderFillRect(renderer, &button_rect);

        SDL_FRect button_text_dst = {
            button_rect.x + (button_rect.w - button_w) * 0.5f,
            button_rect.y + (button_rect.h - button_h) * 0.5f,
            button_w,
            button_h
        };
        SDL_FRect status_dst = { 490.0f - status_w * 0.5f, 320.0f, status_w, status_h };

        SDL_RenderTexture(renderer, button_texture, NULL, &button_text_dst);
        if (status_texture) {
            SDL_RenderTexture(renderer, status_texture, NULL, &status_dst);
        }
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(status_texture);
    SDL_DestroyTexture(button_texture);
    TTF_CloseFont(status_font);
    TTF_CloseFont(button_font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يتحول الزر هنا إلى مساحة تفاعل مرئية بينما تبقى القيمة النصية نفسها منفصلة وقابلة لإعادة التوليد عند كل نقرة.',
      'تبدل الحالة enabled الجملة ولونها، فيفهم المطور كيف يستخدم النص لتجسيد نتيجة الإجراء بدل إبقائه وصفًا ثابتًا.',
      'تغيير لون الزر عند التحويم يوضح أن النصوص في SDL3_ttf غالبًا ما تعمل مع عناصر رسومية أخرى لا بمعزل عنها.'
    ],
    expectedResult: 'يظهر زر نصي في الوسط. عند المرور فوقه يتغير لونه، وعند النقر عليه تتبدل الرسالة أسفله بين حالة مفعلة وأخرى متوقفة مع اختلاف لون النص.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_Color',
      'SDL_CreateTextureFromSurface',
      'SDL_GetTextureSize',
      'SDL_RenderTexture',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_BUTTON_LEFT',
      'SDL_FRect'
    ],
    previewKind: 'text-button',
    previewTitle: 'معاينة لزر نصي يغيّر الرسالة المعروضة بعد النقر.'
  },
  {
    id: 'text-input-preview',
    packageKey: 'ttf',
    title: 'مثال إدخال نص ثم عرضه داخل الواجهة',
    goal: 'يعرض هذا المثال المسار العملي لإدخال النص من المستخدم ثم تحويله مباشرة إلى مورد نصي مرئي داخل النافذة، وهو أساس مفيد للحقول البسيطة وشاشات الإدخال.',
    shows: 'يوضح دمج SDL_StartTextInput و SDL_EVENT_TEXT_INPUT مع SDL3_ttf، بحيث تتحول السلسلة المدخلة إلى نص معروض يتحدث فورًا داخل واجهة التطبيق.',
    headers: ['SDL3/SDL.h', 'SDL3_ttf/SDL_ttf.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع ترويسة SDL3_ttf.',
      'ملف خط صالح مثل assets/fonts/NotoSansArabic-Regular.ttf.',
      'يحتاج المثال إلى SDL_StartTextInput على النافذة نفسها حتى يبدأ استقبال النص من المستخدم.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3_ttf/SDL_ttf.h>

static SDL_Texture *CreateTextTexture(SDL_Renderer *renderer, TTF_Font *font, const char *message, SDL_Color color, float *out_w, float *out_h)
{
    SDL_Surface *surface = TTF_RenderText_Blended(font, message, SDL_strlen(message), color);
    if (!surface) {
        return NULL;
    }

    SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
    if (texture && out_w && out_h) {
        SDL_GetTextureSize(texture, out_w, out_h);
    }

    SDL_DestroySurface(surface);
    return texture;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO) || !TTF_Init()) {
        SDL_Log("فشل تهيئة SDL3 أو SDL3_ttf: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3_ttf input example", 1120, 680, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    TTF_Font *font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 28.0f)
        : NULL;
    TTF_Font *label_font = renderer
        ? TTF_OpenFont("assets/fonts/NotoSansArabic-Regular.ttf", 22.0f)
        : NULL;

    if (!window || !renderer || !font || !label_font || !SDL_StartTextInput(window)) {
        SDL_Log("فشل تجهيز مثال الإدخال النصي: %s", SDL_GetError());
        TTF_CloseFont(label_font);
        TTF_CloseFont(font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    char input_buffer[256];
    input_buffer[0] = '\\0';

    float label_w = 0.0f;
    float label_h = 0.0f;
    SDL_Texture *label_texture = CreateTextTexture(renderer, label_font, "اكتب داخل الحقل ثم شاهد النص المعروض أسفله", (SDL_Color){ 204, 184, 230, 255 }, &label_w, &label_h);
    SDL_Texture *value_texture = NULL;
    float value_w = 0.0f;
    float value_h = 0.0f;
    bool dirty = true;
    bool running = true;
    SDL_Event event;

    if (!label_texture) {
        SDL_Log("فشل تجهيز عنوان مثال الإدخال النصي: %s", SDL_GetError());
        SDL_StopTextInput(window);
        TTF_CloseFont(label_font);
        TTF_CloseFont(font);
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        TTF_Quit();
        SDL_Quit();
        return 1;
    }

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_TEXT_INPUT) {
                SDL_strlcat(input_buffer, event.text.text, sizeof(input_buffer));
                dirty = true;
            }

            if (event.type == SDL_EVENT_KEY_DOWN) {
                if (event.key.key == SDLK_RETURN) {
                    input_buffer[0] = '\\0';
                    dirty = true;
                } else if (event.key.key == SDLK_BACKSPACE && input_buffer[0] != '\\0') {
                    const char *cursor = input_buffer + SDL_strlen(input_buffer);
                    SDL_StepBackUTF8(input_buffer, &cursor);
                    ((char *)cursor)[0] = '\\0';
                    dirty = true;
                }
            }
        }

        if (dirty) {
            const char *shown_text = input_buffer[0] ? input_buffer : "اكتب هنا ليظهر النص مباشرة";
            SDL_Color shown_color = input_buffer[0]
                ? (SDL_Color){ 245, 235, 210, 255 }
                : (SDL_Color){ 167, 148, 191, 255 };

            SDL_DestroyTexture(value_texture);
            value_texture = CreateTextTexture(renderer, font, shown_text, shown_color, &value_w, &value_h);
            dirty = false;
        }

        SDL_SetRenderDrawColor(renderer, 25, 21, 32, 255);
        SDL_RenderClear(renderer);

        SDL_FRect input_box = { 180.0f, 150.0f, 760.0f, 72.0f };
        SDL_FRect preview_panel = { 180.0f, 280.0f, 760.0f, 160.0f };
        SDL_FRect label_dst = { 940.0f - label_w, 100.0f, label_w, label_h };
        SDL_FRect value_dst = { preview_panel.x + preview_panel.w - value_w - 26.0f, preview_panel.y + 60.0f, value_w, value_h };

        SDL_SetRenderDrawColor(renderer, 35, 28, 45, 255);
        SDL_RenderFillRect(renderer, &input_box);
        SDL_SetRenderDrawColor(renderer, 43, 34, 56, 255);
        SDL_RenderFillRect(renderer, &preview_panel);

        SDL_RenderTexture(renderer, label_texture, NULL, &label_dst);
        if (value_texture) {
            SDL_RenderTexture(renderer, value_texture, NULL, &value_dst);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(value_texture);
    SDL_DestroyTexture(label_texture);
    SDL_StopTextInput(window);
    TTF_CloseFont(label_font);
    TTF_CloseFont(font);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    TTF_Quit();
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يبدأ استقبال النص فعليًا عبر SDL_StartTextInput على النافذة نفسها، ثم تصل الأحرف من خلال SDL_EVENT_TEXT_INPUT لا من أحداث لوحة المفاتيح الخام.',
      'تعاد توليد value_texture كلما تغيرت السلسلة، فيصبح النص الظاهر أسفل الحقل انعكاسًا مباشرًا لما أدخله المستخدم.',
      'استخدام SDL_StepBackUTF8 مع SDLK_BACKSPACE يحذف آخر محرف UTF-8 بشكل صحيح بدل قص بايت عشوائي من السلسلة.'
    ],
    expectedResult: 'تظهر مساحة إدخال علوية ولوحة معاينة أسفلها. عند الكتابة يتحدث النص المعروض فورًا، ويمكن حذف آخر محرف بمفتاح Backspace أو مسح الحقل كاملًا بمفتاح Enter.',
    related: [
      'TTF_Init',
      'TTF_OpenFont',
      'TTF_RenderText_Blended',
      'TTF_CloseFont',
      'TTF_Quit',
      'TTF_Font',
      'SDL_StartTextInput',
      'SDL_StopTextInput',
      'SDL_EVENT_TEXT_INPUT',
      'SDL_EVENT_KEY_DOWN',
      'SDL_TextInputEvent',
      'SDL_strlcat',
      'SDL_StepBackUTF8',
      'SDLK_BACKSPACE',
      'SDLK_RETURN',
      'SDL_CreateTextureFromSurface',
      'SDL_RenderTexture'
    ],
    previewKind: 'text-input',
    previewTitle: 'معاينة لإدخال نص ثم عرضه مباشرة داخل الواجهة.'
  },
  {
    id: 'frame-rendering-colors',
    packageKey: 'core',
    title: 'مثال التحديث والرسم داخل الإطار مع الألوان',
    goal: 'يركز هذا المثال على منطق الإطار نفسه: تحديث حالة مرئية بسيطة، ثم رسم النتيجة بالألوان داخل SDL_Renderer قبل تقديم الإطار النهائي.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يُستخدم هذا النمط عندما تريد فصل مرحلة التحديث عن مرحلة الرسم داخل كل إطار.',
      'لا يحتاج إلى أصول خارجية لأن كل العناصر المرسومة مستطيلات وأشرطة لونية.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 frame example", 960, 540, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    float progress = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        progress += 2.5f;
        if (progress > 360.0f) {
            progress = 0.0f;
        }

        SDL_FRect base_bar = { 140.0f, 320.0f, 360.0f, 24.0f };
        SDL_FRect fill_bar = { 140.0f, 320.0f, progress, 24.0f };
        SDL_FRect accent = { 140.0f + progress, 248.0f, 34.0f, 34.0f };

        SDL_SetRenderDrawColor(renderer, 16, 19, 25, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 56, 68, 92, 255);
        SDL_RenderFillRect(renderer, &base_bar);

        SDL_SetRenderDrawColor(renderer, 88, 171, 255, 255);
        SDL_RenderFillRect(renderer, &fill_bar);

        SDL_SetRenderDrawColor(renderer, 255, 191, 87, 255);
        SDL_RenderFillRect(renderer, &accent);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يزيد progress في بداية كل دورة، لذلك توجد مرحلة تحديث فعلية قبل الرسم داخل الإطار نفسه.',
      'تعبر base_bar و fill_bar و accent عن عناصر مرئية مختلفة، وبذلك ترى كيف يحول SDL_RenderFillRect الحالة الحالية إلى خرج بصري بسيط ومباشر.',
      'الترتيب بين SDL_RenderClear ثم رسم المستطيلات ثم SDL_RenderPresent هو التسلسل القياسي لمعظم مشاهد SDL3 المعتمدة على الرسم كل إطار.'
    ],
    expectedResult: 'تظهر واجهة بسيطة بخلفية داكنة وشريط تقدم يتحرك باستمرار مع مؤشر لوني متزامن معه. هذا المثال يوضح عمليًا أين تضع التحديث وأين تضع أوامر الرسم داخل كل إطار.',
    related: [
      'SDL_Renderer',
      'SDL_FRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderClear',
      'SDL_RenderFillRect',
      'SDL_RenderPresent',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'render',
    previewTitle: 'شكل مثال التحديث والرسم داخل الإطار مع الألوان.'
  },
  {
    id: 'drag-card-inside-window',
    packageKey: 'core',
    title: 'مثال سحب عنصر أو صورة داخل نافذة SDL3',
    goal: 'يبين هذا المثال كيفية سحب بطاقة مرئية داخل نافذة SDL3 نفسها باستخدام أحداث الفأرة فقط، من دون الاعتماد على مكتبة GUI خارجية.',
    shows: 'المثال SDL3 خالص: SDL3 تنشئ النافذة، تقرأ SDL_EVENT_MOUSE_BUTTON_DOWN و SDL_EVENT_MOUSE_MOTION و SDL_EVENT_MOUSE_BUTTON_UP، ثم يحدث التطبيق موضع العنصر ويرسمه مجددًا داخل SDL_Renderer.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'العنصر المسحوب هنا مستطيل يمثل Sprite أو بطاقة أو صورة مبسطة، لكن المنطق نفسه يصلح إذا استبدلته بـ SDL_Texture.',
      'يخزن المثال حالة السحب والإزاحة بين المؤشر والعنصر داخل متغيرات محلية مستمرة بين الإطارات.'
    ],
    code: `#include <SDL3/SDL.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 drag card", 1100, 700, SDL_WINDOW_RESIZABLE);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect card = { 120.0f, 180.0f, 180.0f, 120.0f };
    SDL_FRect viewport = { 660.0f, 120.0f, 280.0f, 360.0f };
    bool dragging = false;
    float drag_offset_x = 0.0f;
    float drag_offset_y = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &card)) {
                dragging = true;
                drag_offset_x = event.button.x - card.x;
                drag_offset_y = event.button.y - card.y;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                dragging = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION && dragging) {
                card.x = event.motion.x - drag_offset_x;
                card.y = event.motion.y - drag_offset_y;
            }
        }

        SDL_SetRenderDrawColor(renderer, 15, 20, 28, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 32, 47, 64, 255);
        SDL_RenderFillRect(renderer, &viewport);

        SDL_SetRenderDrawColor(renderer, 218, 228, 241, 255);
        SDL_RenderFillRect(renderer, &card);

        SDL_FRect accent = { card.x + 18.0f, card.y + 20.0f, 78.0f, 14.0f };
        SDL_FRect caption = { card.x + 18.0f, card.y + 52.0f, 110.0f, 12.0f };
        SDL_SetRenderDrawColor(renderer, 101, 169, 255, 255);
        SDL_RenderFillRect(renderer, &accent);
        SDL_SetRenderDrawColor(renderer, 124, 142, 163, 255);
        SDL_RenderFillRect(renderer, &caption);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'بداية السحب تعتمد على اختبار موضع النقر داخل العنصر عبر PointInRect، لذلك يكون مصدر السحب هو البطاقة نفسها داخل الواجهة لا كائنًا فيزيائيًا في عالم اللعبة.',
      'يحفظ التطبيق drag_offset_x و drag_offset_y حتى لا يقفز العنصر إلى زاوية المؤشر فور بداية السحب، بل يظل متماسكًا مع موضع الإمساك الحقيقي.',
      'بعد تحديث الإحداثيات في حدث SDL_EVENT_MOUSE_MOTION يعاد الرسم في نفس الإطار، فتظهر الحركة مباشرة داخل نافذة SDL3.'
    ],
    expectedResult: 'يمكن للمستخدم إمساك البطاقة بالزر الأيسر وسحبها داخل النافذة. هذا المثال مناسب كأساس لتحريك Sprite أو بطاقة أو صورة أو عنصر واجهة بسيط.',
    related: [
      'SDL_CreateWindow',
      'SDL_CreateRenderer',
      'SDL_PollEvent',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_BUTTON_LEFT',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_RenderPresent'
    ],
    previewKind: 'ui-drag',
    previewTitle: 'معاينة لسحب بطاقة مرئية داخل نافذة SDL3.'
  },
  {
    id: 'hover-enter-exit-region',
    packageKey: 'core',
    title: 'مثال التفاعل عند دخول وخروج المؤشر من منطقة واجهة',
    goal: 'يوضح هذا المثال كيف يتحقق تطبيق SDL3 من مرور المؤشر فوق منطقة محددة، ثم يسجل لحظة الدخول والخروج ويعكس ذلك بصريًا على اللوحة نفسها.',
    shows: 'هذا ليس تصادمًا فيزيائيًا. نحن فقط نختبر هل موضع المؤشر الحالي يقع داخل مستطيل واجهة، ثم نحدث حالة hover ودخول وخروج المنطقة وفق SDL_EVENT_MOUSE_MOTION.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال مناسب للأزرار الكبيرة، ولوحات الأدوات، ومناطق الإسقاط، وأي عنصر يحتاج استجابة Hover واضحة.',
      'تحتاج حالة hover الحالية، وعدادات enter و exit، إلى متغيرات تحفظ بين الإطارات.'
    ],
    code: `#include <SDL3/SDL.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 hover region", 960, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect panel = { 180.0f, 140.0f, 600.0f, 250.0f };
    bool hovered = false;
    int enter_count = 0;
    int exit_count = 0;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                const bool now_hovered = PointInRect(event.motion.x, event.motion.y, &panel);
                if (now_hovered && !hovered) {
                    enter_count += 1;
                } else if (!now_hovered && hovered) {
                    exit_count += 1;
                }
                hovered = now_hovered;
            }
        }

        SDL_SetRenderDrawColor(renderer, 14, 18, 25, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, hovered ? 49 : 28, hovered ? 94 : 40, hovered ? 146 : 52, 255);
        SDL_RenderFillRect(renderer, &panel);

        SDL_FRect top_line = { panel.x + 28.0f, panel.y + 32.0f, 220.0f, 16.0f };
        SDL_FRect mid_line = { panel.x + 28.0f, panel.y + 72.0f, 320.0f, 12.0f };
        SDL_FRect enter_bar = { panel.x + 28.0f, panel.y + 170.0f, (float)(enter_count % 12) * 22.0f, 14.0f };
        SDL_FRect exit_bar = { panel.x + 28.0f, panel.y + 200.0f, (float)(exit_count % 12) * 22.0f, 14.0f };

        SDL_SetRenderDrawColor(renderer, 222, 233, 245, 255);
        SDL_RenderFillRect(renderer, &top_line);
        SDL_SetRenderDrawColor(renderer, 152, 173, 198, 255);
        SDL_RenderFillRect(renderer, &mid_line);
        SDL_SetRenderDrawColor(renderer, 120, 193, 255, 255);
        SDL_RenderFillRect(renderer, &enter_bar);
        SDL_SetRenderDrawColor(renderer, 255, 191, 103, 255);
        SDL_RenderFillRect(renderer, &exit_bar);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يعتمد المثال على SDL_EVENT_MOUSE_MOTION لتحديد موضع المؤشر الحالي، ثم يقارن بين hovered السابقة والحالية لاكتشاف لحظة الدخول والخروج نفسها.',
      'التحقق هنا مرتبط بعنصر واجهة داخل نافذة SDL3، لذلك يجب شرحه كاستهداف أو Hover وليس كتصادم فيزيائي لعناصر محرك ألعاب.',
      'تغيير لون اللوحة وشريطي العدادات يجعل أثر enter و exit مرئيًا مباشرة حتى لو لم نستخدم نصًا أو مكتبة خطوط.'
    ],
    expectedResult: 'تتغير اللوحة بصريًا عند دخول المؤشر إليها، ثم تعود إلى حالتها السابقة عند الخروج منها. كما تتحرك أشرطة بسيطة لتعكس مرات الدخول والخروج المتكررة.',
    related: [
      'SDL_PollEvent',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderPresent'
    ],
    previewKind: 'ui-hover',
    previewTitle: 'معاينة لمنطقة واجهة تستجيب لدخول المؤشر وخروجه.'
  },
  {
    id: 'rect-overlap-drop-target',
    packageKey: 'core',
    title: 'مثال تداخل مستطيلات بسيط لعناصر الواجهة أو الصور',
    goal: 'يعرض هذا المثال حالة قريبة من Drop Target داخل SDL3: عنصر مسحوب، ومنطقة هدف، وفحص تداخل مستطيلات بسيط يقرر هل يثبت العنصر داخل الهدف بعد الإفلات.',
    shows: 'المقصود هنا تداخل واجهة بسيط بين مستطيلات ثنائية الأبعاد. هذا ليس نظام فيزياء، بل اختبار هندسي خفيف لعناصر UI أو بطاقات أو صور داخل نافذة SDL3.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال يصلح لمناطق الإسقاط البسيطة أو التحقق من استهداف صور وSprites داخل واجهة مرسومة يدويًا.',
      'يحفظ التطبيق حالة السحب وحالة الالتقاط داخل الهدف بين الإطارات.'
    ],
    code: `#include <SDL3/SDL.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

static bool RectsOverlap(const SDL_FRect *a, const SDL_FRect *b)
{
    return a->x < b->x + b->w &&
           a->x + a->w > b->x &&
           a->y < b->y + b->h &&
           a->y + a->h > b->y;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 drop target", 1100, 700, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect draggable = { 120.0f, 240.0f, 140.0f, 110.0f };
    SDL_FRect target = { 710.0f, 180.0f, 220.0f, 220.0f };
    bool dragging = false;
    float drag_offset_x = 0.0f;
    float drag_offset_y = 0.0f;
    bool snapped = false;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &draggable)) {
                dragging = true;
                drag_offset_x = event.button.x - draggable.x;
                drag_offset_y = event.button.y - draggable.y;
                snapped = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION && dragging) {
                draggable.x = event.motion.x - drag_offset_x;
                draggable.y = event.motion.y - drag_offset_y;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                dragging = false;
                if (RectsOverlap(&draggable, &target)) {
                    draggable.x = target.x + (target.w - draggable.w) * 0.5f;
                    draggable.y = target.y + (target.h - draggable.h) * 0.5f;
                    snapped = true;
                }
            }
        }

        const bool overlapping = RectsOverlap(&draggable, &target);

        SDL_SetRenderDrawColor(renderer, 14, 18, 24, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, overlapping ? 54 : 32, overlapping ? 110 : 58, overlapping ? 82 : 78, 255);
        SDL_RenderFillRect(renderer, &target);

        SDL_SetRenderDrawColor(renderer, snapped ? 255 : 93, snapped ? 194 : 168, snapped ? 101 : 255, 255);
        SDL_RenderFillRect(renderer, &draggable);

        SDL_FRect status = { 180.0f, 540.0f, overlapping ? 360.0f : 220.0f, 18.0f };
        SDL_SetRenderDrawColor(renderer, overlapping ? 126 : 82, overlapping ? 214 : 117, overlapping ? 142 : 148, 255);
        SDL_RenderFillRect(renderer, &status);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تستخدم RectsOverlap اختبارًا هندسيًا مباشرًا بين مستطيلين لتحديد هل العنصر المسحوب دخل منطقة الهدف أو لا، وهذا كافٍ لكثير من واجهات SDL3 البسيطة.',
      'لحظة الإفلات الحقيقية تقع في SDL_EVENT_MOUSE_BUTTON_UP، وهناك فقط يقرر التطبيق هل يثبت العنصر داخل الهدف أم يعيده كما هو.',
      'عند حدوث الالتقاط snapped لا يعني ذلك فيزياء أو تصادم عالم ثلاثي الأبعاد، بل نتيجة منطق واجهة تعتمد على تداخل المستطيل مع Drop Zone.'
    ],
    expectedResult: 'عند سحب المستطيل فوق منطقة الهدف ثم إفلاته يلتقطه الهدف ويثبته في وسطه. وإذا أفلت خارج المنطقة يبقى العنصر في آخر موضع وصل إليه.',
    related: [
      'SDL_PollEvent',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_BUTTON_LEFT',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_RenderPresent'
    ],
    previewKind: 'ui-collision',
    previewTitle: 'معاينة لتداخل مستطيل مسحوب مع منطقة هدف داخل SDL3.'
  },
  {
    id: 'sprite-movement-over-time',
    packageKey: 'core',
    title: 'مثال تحريك Sprite أو عنصر بمرور الوقت',
    goal: 'يوضح هذا المثال كيف يحدث تطبيق SDL3 موضع عنصر مرئي بمرور الوقت عبر Delta Time، ثم يعكس الحركة على الرسم في كل إطار داخل SDL_Renderer.',
    shows: 'هذا هو معنى الحركة في SDL3 هنا: التطبيق نفسه يحسب الإحداثيات والسرعة في كل Frame، ثم يرسم العنصر في موضعه الجديد. لا يوجد نظام Movement عالي المستوى جاهز داخل SDL3 الأساسية.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يجب حفظ الموضع والسرعة وآخر زمن إطار بين الإطارات حتى يكون التحديث مستقرًا.',
      'يمكن استبدال المستطيل هنا بـ SDL_Texture أو Sprite sheet من دون تغيير منطق الحركة الأساسي.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 movement example", 1080, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect sprite = { 120.0f, 260.0f, 78.0f, 78.0f };
    float velocity = 260.0f;
    Uint64 last_ticks = SDL_GetTicks();
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        Uint64 now = SDL_GetTicks();
        float delta_time = (float)(now - last_ticks) / 1000.0f;
        last_ticks = now;

        sprite.x += velocity * delta_time;
        if (sprite.x < 120.0f) {
            sprite.x = 120.0f;
            velocity = 260.0f;
        } else if (sprite.x + sprite.w > 920.0f) {
            sprite.x = 920.0f - sprite.w;
            velocity = -260.0f;
        }

        SDL_SetRenderDrawColor(renderer, 16, 20, 27, 255);
        SDL_RenderClear(renderer);

        SDL_FRect track = { 120.0f, 292.0f, 800.0f, 14.0f };
        SDL_SetRenderDrawColor(renderer, 55, 72, 94, 255);
        SDL_RenderFillRect(renderer, &track);

        SDL_SetRenderDrawColor(renderer, 96, 176, 255, 255);
        SDL_RenderFillRect(renderer, &sprite);

        SDL_FRect accent = { sprite.x + 16.0f, sprite.y + 16.0f, 44.0f, 12.0f };
        SDL_SetRenderDrawColor(renderer, 245, 198, 98, 255);
        SDL_RenderFillRect(renderer, &accent);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يعتمد المثال على Delta Time المستخرجة من SDL_GetTicks حتى تبقى السرعة مرتبطة بالزمن الفعلي لا بعدد الإطارات فقط.',
      'حالة الحركة محفوظة في sprite.x و velocity و last_ticks، لذلك يعاد استخدامها وتحديثها في كل دورة من الحلقة الرئيسية.',
      'بعد تحديث الإحداثيات يرسم SDL_RenderFillRect العنصر في موقعه الجديد مباشرة، وهذا هو الرابط العملي بين التحديث والرسم داخل كل Frame.'
    ],
    expectedResult: 'يتحرك العنصر ذهابًا وإيابًا فوق مسار أفقي، مع سرعة مستقرة نسبيًا بين الإطارات المختلفة. هذا يوضح كيف تنفذ حركة بسيطة لعناصر الواجهة أو الصور في SDL3.',
    related: [
      'SDL_GetTicks',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_FRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderFillRect',
      'SDL_RenderPresent'
    ],
    previewKind: 'ui-move',
    previewTitle: 'معاينة لحركة عنصر مرئي يتم تحديث موضعه بمرور الوقت.'
  },
  {
    id: 'frame-animation-strip',
    packageKey: 'core',
    title: 'مثال أنيميشن بسيط بإطارات أو بتغيير القيم',
    goal: 'يعرض هذا المثال شكلين شائعين للأنيميشن في SDL3: تبديل frame index بمرور الوقت، وتغيير الحجم أو الشريط اللوني تدريجيًا داخل كل إطار.',
    shows: 'SDL3 نفسها لا تقدم Animation system عالي المستوى. التطبيق هو من يحسب current_frame و pulse و progress في كل Frame، ثم يرسم النتيجة باستخدام SDL_RenderFillRect أو SDL_RenderTexture.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'الفكرة تصلح مع Sprite sheet حقيقية أو مع عناصر بسيطة مرسومة يدويًا كما في المثال.',
      'يجب حفظ current_frame والقيم المتغيرة زمنيًا أو استخراجها من الزمن الحالي في كل إطار.'
    ],
    code: `#include <SDL3/SDL.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 animation example", 1024, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        const Uint64 now = SDL_GetTicks();
        const int current_frame = (int)((now / 120) % 4);
        const float progress = (float)((now % 1800) / 1800.0);
        const float pulse = 1.0f + 0.18f * SDL_sinf((float)now * 0.008f);

        SDL_SetRenderDrawColor(renderer, 15, 19, 26, 255);
        SDL_RenderClear(renderer);

        SDL_FRect strip[4] = {
            { 170.0f, 120.0f, 92.0f, 92.0f },
            { 280.0f, 120.0f, 92.0f, 92.0f },
            { 390.0f, 120.0f, 92.0f, 92.0f },
            { 500.0f, 120.0f, 92.0f, 92.0f }
        };

        for (int i = 0; i < 4; ++i) {
            SDL_SetRenderDrawColor(renderer,
                i == current_frame ? 98 : 48,
                i == current_frame ? 176 : 72,
                i == current_frame ? 255 : 102,
                255);
            SDL_RenderFillRect(renderer, &strip[i]);
        }

        SDL_FRect actor = {
            700.0f - 70.0f * pulse,
            240.0f - 70.0f * pulse,
            140.0f * pulse,
            140.0f * pulse
        };
        SDL_SetRenderDrawColor(renderer, 255, 199, 97, 255);
        SDL_RenderFillRect(renderer, &actor);

        SDL_FRect progress_base = { 170.0f, 420.0f, 520.0f, 22.0f };
        SDL_FRect progress_fill = { 170.0f, 420.0f, 520.0f * progress, 22.0f };
        SDL_SetRenderDrawColor(renderer, 49, 64, 84, 255);
        SDL_RenderFillRect(renderer, &progress_base);
        SDL_SetRenderDrawColor(renderer, 111, 204, 146, 255);
        SDL_RenderFillRect(renderer, &progress_fill);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'current_frame يتبدل مع الزمن ليحاكي أنيميشن إطارات بسيط، بينما pulse و progress يعرضان شكل الأنيميشن المبني على تغيير القيم لا على تبديل الصور فقط.',
      'يمكن استبدال مربعات strip بمناطق source rectangles من Sprite sheet حقيقية لاحقًا، لأن منطق current_frame نفسه يبقى متشابهًا.',
      'النتيجة المرئية تأتي من إعادة حساب القيم ثم الرسم بها كل Frame، وهذا هو أساس الأنيميشن العملي في كثير من تطبيقات SDL3 الخفيفة.'
    ],
    expectedResult: 'ترى شريط إطارات يضيء إطارًا مختلفًا مع الزمن، وعنصرًا رئيسيًا ينبض بالحجم، وشريط تقدم متحركًا. المثال يوضح أن الأنيميشن قد يكون بالإطارات أو بتغيير القيم المرئية تدريجيًا.',
    related: [
      'SDL_GetTicks',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_RenderPresent'
    ],
    previewKind: 'ui-animation',
    previewTitle: 'معاينة لأنيميشن مبني على تبديل الإطارات وتغيير القيم داخل SDL3.'
  },
  {
    id: 'renderer-color-controls',
    packageKey: 'core',
    title: 'مثال ألوان وتغيير ألوان الرسم أو الخلفية',
    goal: 'يوضح هذا المثال كيف يغير تطبيق SDL3 الخلفية واللون الرئيسي لعناصره المرئية، مع عرض نتيجة التعديل مباشرة داخل نافذة الرسم نفسها.',
    shows: 'هذا المثال SDL3 خالص أيضًا. لا يوجد Color Picker جاهز في SDL3 الأساسية، لذلك يغير التطبيق القيم اللونية مباشرة ثم يعيد الرسم. إذا احتجت محرر ألوان تفاعليًا أعلى مستوى فعادة تضيف طبقة GUI فوق SDL3.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يعتمد المثال على SDL_GetKeyboardState لتعديل RGB مباشرة أثناء التشغيل.',
      'لا يحتاج إلى خطوط أو مكتبة واجهة؛ يعكس الألوان بصريًا عبر الخلفية وبطاقات المعاينة وعنوان النافذة.'
    ],
    code: `#include <SDL3/SDL.h>
#include <stdio.h>

static Uint8 ClampChannel(int value)
{
    if (value < 0) return 0;
    if (value > 255) return 255;
    return (Uint8)value;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 colors", 980, 620, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    int accent_r = 90;
    int accent_g = 166;
    int accent_b = 255;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        const bool *keys = SDL_GetKeyboardState(NULL);
        if (keys[SDL_SCANCODE_Q]) accent_r += 2;
        if (keys[SDL_SCANCODE_A]) accent_r -= 2;
        if (keys[SDL_SCANCODE_W]) accent_g += 2;
        if (keys[SDL_SCANCODE_S]) accent_g -= 2;
        if (keys[SDL_SCANCODE_E]) accent_b += 2;
        if (keys[SDL_SCANCODE_D]) accent_b -= 2;

        accent_r = ClampChannel(accent_r);
        accent_g = ClampChannel(accent_g);
        accent_b = ClampChannel(accent_b);

        char title[96];
        SDL_snprintf(title, sizeof(title), "SDL3 colors - RGB(%d, %d, %d)", accent_r, accent_g, accent_b);
        SDL_SetWindowTitle(window, title);

        SDL_SetRenderDrawColor(renderer, accent_r / 6, accent_g / 6, accent_b / 6, 255);
        SDL_RenderClear(renderer);

        SDL_FRect swatch = { 120.0f, 120.0f, 240.0f, 240.0f };
        SDL_FRect background_panel = { 430.0f, 120.0f, 360.0f, 240.0f };
        SDL_FRect meter = { 120.0f, 420.0f, (float)accent_r + accent_g + accent_b / 3.0f, 24.0f };

        SDL_SetRenderDrawColor(renderer, accent_r, accent_g, accent_b, 255);
        SDL_RenderFillRect(renderer, &swatch);

        SDL_SetRenderDrawColor(renderer, accent_b, accent_r, accent_g, 255);
        SDL_RenderFillRect(renderer, &background_panel);

        SDL_SetRenderDrawColor(renderer, 240, 241, 244, 255);
        SDL_RenderFillRect(renderer, &meter);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تعديل القنوات اللونية يحدث في منطق التطبيق نفسه، ثم تنتقل القيم الجديدة مباشرة إلى SDL_SetRenderDrawColor في الخلفية والعينات اللونية.',
      'استخدام SDL_GetKeyboardState يجعل التغيير مستمرًا أثناء الضغط بدل الاكتفاء بخطوات متفرقة من أحداث لوحة المفاتيح.',
      'يعرض عنوان النافذة قيمة RGB الحالية، وبذلك يحصل المستخدم على قراءة رقمية بسيطة حتى من دون مكتبة نصوص إضافية أو Color Picker كامل.'
    ],
    expectedResult: 'تتغير الخلفية وعينات الألوان مباشرة مع مفاتيح Q/A وW/S وE/D، كما يظهر عنوان النافذة قيمة RGB الحالية. هذا المثال يوضح تغيير ألوان الرسم أو الخلفية في SDL3 الأساسية.',
    related: [
      'SDL_GetKeyboardState',
      'SDL_SetWindowTitle',
      'SDL_SetRenderDrawColor',
      'SDL_RenderClear',
      'SDL_RenderFillRect',
      'SDL_RenderPresent',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'ui-color',
    previewTitle: 'معاينة لتغيير ألوان الخلفية والعناصر مباشرة داخل SDL3.'
  },
  {
    id: 'camera-follow-world',
    packageKey: 'core',
    title: 'مثال كاميرا ثنائية الأبعاد تتابع اللاعب داخل عالم أكبر من النافذة',
    goal: 'يوضح هذا المثال كيف تبني SDL3 كاميرا 2D بسيطة: حالة لاعب في إحداثيات عالمية، وكاميرا تحفظ موضع العرض الحالي، ثم ترسم البلاطات والعناصر بإزاحة معاكسة لموضع الكاميرا.',
    shows: 'يركز المثال على ما هو من SDL3 نفسها: قراءة الإدخال، تحديث إحداثيات العالم، ثم تحويلها إلى إحداثيات شاشة داخل SDL_Renderer. لا توجد GUI خارجية هنا، بل كاميرا لعب أساسية.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال مناسب للألعاب ثنائية الأبعاد أو أدوات المشهد التي تحتاج World Space وViewport منفصلًا عنه.',
      'يمكن استبدال المربعات المرسومة هنا بـ SDL_Texture لاحقًا من دون تغيير منطق الكاميرا نفسه.'
    ],
    code: `#include <SDL3/SDL.h>

static float ClampFloat(float value, float min_value, float max_value)
{
    if (value < min_value) return min_value;
    if (value > max_value) return max_value;
    return value;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 camera follow", 1280, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    const float world_width = 2400.0f;
    const float world_height = 1600.0f;
    SDL_FRect player = { 280.0f, 220.0f, 72.0f, 72.0f };
    SDL_FRect camera = { 0.0f, 0.0f, 1280.0f, 720.0f };
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        const bool *keys = SDL_GetKeyboardState(NULL);
        float move_x = 0.0f;
        float move_y = 0.0f;

        if (keys[SDL_SCANCODE_A]) move_x -= 6.0f;
        if (keys[SDL_SCANCODE_D]) move_x += 6.0f;
        if (keys[SDL_SCANCODE_W]) move_y -= 6.0f;
        if (keys[SDL_SCANCODE_S]) move_y += 6.0f;

        player.x = ClampFloat(player.x + move_x, 0.0f, world_width - player.w);
        player.y = ClampFloat(player.y + move_y, 0.0f, world_height - player.h);

        camera.x = ClampFloat(player.x + player.w * 0.5f - camera.w * 0.5f, 0.0f, world_width - camera.w);
        camera.y = ClampFloat(player.y + player.h * 0.5f - camera.h * 0.5f, 0.0f, world_height - camera.h);

        SDL_SetRenderDrawColor(renderer, 18, 24, 34, 255);
        SDL_RenderClear(renderer);

        for (int y = 0; y < (int)world_height; y += 160) {
            for (int x = 0; x < (int)world_width; x += 160) {
                SDL_FRect tile = {
                    x - camera.x + 8.0f,
                    y - camera.y + 8.0f,
                    144.0f,
                    144.0f
                };

                if (tile.x + tile.w < 0.0f || tile.y + tile.h < 0.0f ||
                    tile.x > camera.w || tile.y > camera.h) {
                    continue;
                }

                SDL_SetRenderDrawColor(renderer, 32, 46, 62, 255);
                SDL_RenderFillRect(renderer, &tile);
            }
        }

        SDL_FRect player_screen = {
            player.x - camera.x,
            player.y - camera.y,
            player.w,
            player.h
        };

        SDL_SetRenderDrawColor(renderer, 94, 176, 255, 255);
        SDL_RenderFillRect(renderer, &player_screen);

        SDL_FRect focus = { 28.0f, 28.0f, 220.0f, 18.0f };
        SDL_SetRenderDrawColor(renderer, 245, 197, 102, 255);
        SDL_RenderFillRect(renderer, &focus);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يحفظ التطبيق موضع اللاعب والكاميرا في World Space، ثم يحول الرسم إلى Screen Space بطرح camera.x وcamera.y من كل عنصر قبل SDL_RenderFillRect.',
      'تحديث الكاميرا يحدث بعد تحديث اللاعب، لذلك تبقى الكاميرا تابعة للهدف نفسه لا للإدخال الخام مباشرة.',
      'إظهار عالم أكبر من النافذة يوضح الفرق بين منطق الحركة داخل العالم ومنطق العرض داخل نافذة SDL3.'
    ],
    expectedResult: 'يرى المستخدم عالمًا أكبر من النافذة مع بلاطات كثيرة، بينما يبقى اللاعب تقريبًا في منتصف الشاشة وتتحرك الكاميرا معه عند استخدام W/A/S/D.',
    related: [
      'SDL_GetKeyboardState',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_RenderClear',
      'SDL_RenderPresent',
      'SDL_CreateRenderer',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'world-camera',
    previewTitle: 'كاميرا 2D تتابع اللاعب داخل عالم أكبر من نافذة SDL3.'
  },
  {
    id: 'mouse-drag-sprite',
    packageKey: 'core',
    title: 'مثال التقاط عنصر مرسوم بالفأرة وسحبه داخل النافذة',
    goal: 'يبين هذا المثال كيف يختبر التطبيق هل المؤشر فوق Sprite أو بطاقة مرسومة، ثم يبدأ السحب ويحافظ على offset صحيح حتى يتبع العنصر الفأرة بسلاسة.',
    shows: 'المثال يخص SDL3 نفسها: أحداث الفأرة، اختبار النقطة داخل المستطيل، وتحديث الموضع. إذا أضفت GUI فوق SDL3 لاحقًا فسيكون هذا منطق لعب أو Canvas مستقلًا عن طبقة GUI.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يمكن استبدال البطاقة المرسومة هنا بصورة فعلية أو SDL_Texture من دون تغيير منطق الالتقاط والسحب.',
      'المثال مناسب لمسارات level editor البسيطة أو واجهات Canvas داخل SDL3.'
    ],
    code: `#include <SDL3/SDL.h>

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 drag sprite", 1024, 640, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect card = { 360.0f, 180.0f, 240.0f, 160.0f };
    float drag_offset_x = 0.0f;
    float drag_offset_y = 0.0f;
    bool dragging = false;
    bool hovered = false;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION) {
                hovered = PointInRect(event.motion.x, event.motion.y, &card);
                if (dragging) {
                    card.x = event.motion.x - drag_offset_x;
                    card.y = event.motion.y - drag_offset_y;
                }
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT &&
                PointInRect(event.button.x, event.button.y, &card)) {
                dragging = true;
                drag_offset_x = event.button.x - card.x;
                drag_offset_y = event.button.y - card.y;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                dragging = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 16, 22, 30, 255);
        SDL_RenderClear(renderer);

        SDL_FRect drop_zone = { 700.0f, 160.0f, 220.0f, 220.0f };
        SDL_SetRenderDrawColor(renderer, 35, 52, 72, 255);
        SDL_RenderFillRect(renderer, &drop_zone);

        if (hovered || dragging) {
            SDL_SetRenderDrawColor(renderer, 102, 182, 255, 255);
        } else {
            SDL_SetRenderDrawColor(renderer, 225, 232, 242, 255);
        }
        SDL_RenderFillRect(renderer, &card);

        SDL_FRect title_bar = { card.x + 18.0f, card.y + 18.0f, card.w - 36.0f, 18.0f };
        SDL_SetRenderDrawColor(renderer, 84, 127, 180, 255);
        SDL_RenderFillRect(renderer, &title_bar);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تبدأ عملية السحب فقط عندما تضغط الفأرة داخل حدود العنصر نفسه، لذلك يبقى القرار المنطقي منفصلًا عن الرسم.',
      'يحفظ drag_offset_x وdrag_offset_y الفرق بين موضع الفأرة وركن العنصر حتى لا يقفز العنصر عند بداية السحب.',
      'هذا المثال يوضح التقاط عنصر رسومي داخل نافذة SDL3، وهو يختلف عن Drag & Drop الخاص بمكتبات GUI المبنية فوقها.'
    ],
    expectedResult: 'يمكن للمستخدم التقاط البطاقة المرسومة بالزر الأيسر وسحبها داخل النافذة بسلاسة، مع تمييز بصري عندما تكون البطاقة مستهدفة أو أثناء سحبها.',
    related: [
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_BUTTON_LEFT',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_PollEvent'
    ],
    previewKind: 'sprite-pick',
    previewTitle: 'التقاط عنصر مرسوم وسحبه مباشرة بالفأرة داخل SDL3.'
  },
  {
    id: 'aabb-collision-playfield',
    packageKey: 'core',
    title: 'مثال تصادم مستطيلات بسيط بين اللاعب والعوائق',
    goal: 'يشرح هذا المثال تصادم AABB بسيطًا داخل SDL3 لعناصر اللعب أو الصور: يبني التطبيق مستطيلًا للاعب ومجموعة عوائق، ثم يمنع الحركة التي ستؤدي إلى تداخل غير مقبول.',
    shows: 'هذا ليس نظام فيزياء كاملًا، بل فحص Rect/Rect بسيط مناسب للألعاب ثنائية الأبعاد أو لعناصر Canvas. وهو من SDL3 نفسها لأنه يعتمد على الإحداثيات والرسم والأحداث فقط.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال يصلح كبداية لمنع اختراق الجدران أو الأزرار الكبيرة أو عناصر الواجهة المرسومة يدويًا.',
      'يمكن توسيعه لاحقًا إلى خرائط Tilemap أو طبقات تصادم أكثر تعقيدًا.'
    ],
    code: `#include <SDL3/SDL.h>

static bool Intersects(const SDL_FRect *a, const SDL_FRect *b)
{
    return a->x < b->x + b->w &&
           a->x + a->w > b->x &&
           a->y < b->y + b->h &&
           a->y + a->h > b->y;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 AABB collision", 1100, 680, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect player = { 120.0f, 120.0f, 72.0f, 72.0f };
    SDL_FRect walls[3] = {
        { 360.0f, 120.0f, 80.0f, 320.0f },
        { 580.0f, 320.0f, 260.0f, 80.0f },
        { 260.0f, 500.0f, 420.0f, 60.0f }
    };
    bool collided = false;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        const bool *keys = SDL_GetKeyboardState(NULL);
        SDL_FRect next = player;
        const float speed = 5.0f;

        if (keys[SDL_SCANCODE_LEFT])  next.x -= speed;
        if (keys[SDL_SCANCODE_RIGHT]) next.x += speed;
        if (keys[SDL_SCANCODE_UP])    next.y -= speed;
        if (keys[SDL_SCANCODE_DOWN])  next.y += speed;

        collided = false;
        for (int i = 0; i < 3; ++i) {
            if (Intersects(&next, &walls[i])) {
                collided = true;
                break;
            }
        }

        if (!collided) {
            player = next;
        }

        SDL_SetRenderDrawColor(renderer, 17, 23, 31, 255);
        SDL_RenderClear(renderer);

        for (int i = 0; i < 3; ++i) {
            SDL_SetRenderDrawColor(renderer, 203, 104, 92, 255);
            SDL_RenderFillRect(renderer, &walls[i]);
        }

        if (collided) {
            SDL_SetRenderDrawColor(renderer, 255, 202, 109, 255);
        } else {
            SDL_SetRenderDrawColor(renderer, 92, 178, 255, 255);
        }
        SDL_RenderFillRect(renderer, &player);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يبني التطبيق next أولًا ثم يختبره ضد العوائق، وبهذا يبقى فحص التداخل منفصلًا عن اللاعب الحالي حتى لا يطبق حركة غير صالحة.',
      'يعرض المثال التصادم هنا كتصادم Rect/Rect بسيط لعناصر 2D أو صور، لا كنظام فيزيائي عام أو محرك تصادم متكامل.',
      'تغيير لون اللاعب عند الاصطدام يعطي نتيجة مرئية مباشرة توضح متى رفضت الحركة بسبب التداخل.'
    ],
    expectedResult: 'يمكن للمستخدم تحريك اللاعب بمفاتيح الأسهم، لكن الحركة تتوقف عند الجدران الحمراء، كما يتغير لون اللاعب عندما يحاول الدخول في مستطيل متداخل معها.',
    related: [
      'SDL_GetKeyboardState',
      'SDL_FRect',
      'SDL_RenderFillRect',
      'SDL_RenderClear',
      'SDL_RenderPresent',
      'SDL_EVENT_QUIT',
      'SDL_PollEvent'
    ],
    previewKind: 'world-aabb',
    previewTitle: 'تصادم AABB بسيط بين اللاعب والعوائق داخل SDL3.'
  },
  {
    id: 'parallax-scrolling-layers',
    packageKey: 'core',
    title: 'مثال طبقات Parallax مع حركة كاميرا وأنيميشن بسيط',
    goal: 'يجمع هذا المثال بين تحريك اللاعب، وتحريك الكاميرا أفقياً، وبناء طبقات Parallax تتحرك بسرعات مختلفة، مع مؤثر زمني بسيط للسحب أو العوالم البعيدة.',
    shows: 'هذا المثال من SDL3 نفسها: الكاميرا والطبقات والأنيميشن كلها قيم يحدثها التطبيق ثم يرسمها بـ SDL_Renderer. إذا أضفت GUI لاحقًا فستكون طبقة منفصلة عن هذا المشهد.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال مناسب للألعاب الجانبية أو شاشات العرض التي تريد عمقًا بصريًا من دون 3D حقيقي.',
      'يمكن استبدال المستطيلات هنا بصور طبقات وسحب وخلفيات فعلية لاحقًا.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

static float WrapOffset(float value, float width)
{
    while (value < -width) value += width;
    while (value > 0.0f) value -= width;
    return value;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 parallax layers", 1280, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    float player_x = 180.0f;
    float camera_x = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        const bool *keys = SDL_GetKeyboardState(NULL);
        if (keys[SDL_SCANCODE_A]) player_x -= 5.0f;
        if (keys[SDL_SCANCODE_D]) player_x += 5.0f;
        if (player_x < 0.0f) player_x = 0.0f;
        if (player_x > 2600.0f) player_x = 2600.0f;

        camera_x = player_x - 360.0f;
        if (camera_x < 0.0f) camera_x = 0.0f;

        const float time = (float)SDL_GetTicks() * 0.001f;
        const float far_offset = WrapOffset(-camera_x * 0.15f, 520.0f);
        const float mid_offset = WrapOffset(-camera_x * 0.38f, 520.0f);
        const float cloud_offset = WrapOffset(-camera_x * 0.08f - sinf(time) * 12.0f, 480.0f);

        SDL_SetRenderDrawColor(renderer, 11, 17, 27, 255);
        SDL_RenderClear(renderer);

        for (int i = 0; i < 4; ++i) {
            SDL_FRect cloud = { cloud_offset + i * 480.0f, 96.0f + (float)(i % 2) * 28.0f, 180.0f, 44.0f };
            SDL_SetRenderDrawColor(renderer, 47, 78, 116, 255);
            SDL_RenderFillRect(renderer, &cloud);
        }

        for (int i = 0; i < 4; ++i) {
            SDL_FRect mountain = { far_offset + i * 520.0f, 260.0f, 340.0f, 220.0f };
            SDL_SetRenderDrawColor(renderer, 31, 53, 79, 255);
            SDL_RenderFillRect(renderer, &mountain);
        }

        for (int i = 0; i < 5; ++i) {
            SDL_FRect hill = { mid_offset + i * 360.0f, 360.0f, 260.0f, 170.0f };
            SDL_SetRenderDrawColor(renderer, 52, 86, 124, 255);
            SDL_RenderFillRect(renderer, &hill);
        }

        SDL_FRect ground = { 0.0f, 560.0f, 1280.0f, 160.0f };
        SDL_SetRenderDrawColor(renderer, 95, 127, 75, 255);
        SDL_RenderFillRect(renderer, &ground);

        SDL_FRect player = { 260.0f, 500.0f, 72.0f, 72.0f };
        SDL_SetRenderDrawColor(renderer, 255, 205, 104, 255);
        SDL_RenderFillRect(renderer, &player);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تتحرك طبقات Parallax بسرعات مختلفة مشتقة من camera_x، لذلك تبدو العناصر البعيدة أبطأ من العناصر القريبة من دون 3D حقيقي.',
      'يضيف time حركة دورية خفيفة للسحب، وبذلك يجمع المثال بين حركة اللاعب والأنيميشن المبني على القيم بمرور الزمن.',
      'هذا المثال مناسب لتوضيح أن SDL3 تكفي لبناء حركة كاميرا ومشهد طبقات وأنيميشن قيم حتى قبل إدخال أي GUI.'
    ],
    expectedResult: 'يتحرك المشهد الجانبي مع اللاعب أفقيًا، بينما تتحرك السحب والجبال والتلال بسرعات مختلفة، فيظهر عمق Parallax واضح داخل نافذة SDL3.',
    related: [
      'SDL_GetKeyboardState',
      'SDL_GetTicks',
      'SDL_SetRenderDrawColor',
      'SDL_RenderFillRect',
      'SDL_RenderPresent',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'parallax',
    previewTitle: 'مشهد طبقات Parallax مع حركة كاميرا وأنيميشن بسيط داخل SDL3.'
  },
  {
    id: 'sdl3-imgui-menu-color-tools',
    packageKey: 'core',
    title: 'مثال SDL3 مع Dear ImGui لقوائم الأدوات وColor Picker',
    goal: 'يبين هذا المثال الفرق الواضح بين SDL3 نفسها وبين طبقة GUI مبنية فوقها: SDL3 تنشئ النافذة وسياق OpenGL وتمرر الأحداث، بينما Dear ImGui تبني MenuBar والقوائم الفرعية وColor Picker ولوحة الخصائص.',
    shows: 'SDL3 هنا مسؤولة عن النافذة، حلقة الأحداث، والسياق الرسومي. أما القوائم وMenuItem وColorEdit وColorPicker فهي من Dear ImGui وليست من SDL3 الأساسية. المثال موجود في قسم SDL3 لأنه يشرح التكامل العملي فوق SDL3.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'SDL3 مع سياق OpenGL أو أي Renderer Backend آخر مناسب لـ Dear ImGui.',
      'ترويسات Dear ImGui وملفات backends مثل imgui_impl_sdl3.* و imgui_impl_opengl3.*.',
      'محمل OpenGL مثل glad أو ما يكافئه قبل استدعاء وظائف OpenGL الفعلية.'
    ],
    code: `#include <SDL3/SDL.h>
#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_opengl3.h>
#include <glad/gl.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);

    SDL_Window *window = SDL_CreateWindow(
        "SDL3 + Dear ImGui",
        1280,
        720,
        SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE
    );
    SDL_GLContext gl_context = window ? SDL_GL_CreateContext(window) : NULL;

    if (!window || !gl_context) {
        SDL_Log("فشل إنشاء نافذة SDL3 أو سياق OpenGL: %s", SDL_GetError());
        SDL_GL_DestroyContext(gl_context);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_GL_MakeCurrent(window, gl_context);
    SDL_GL_SetSwapInterval(1);
    gladLoadGL((GLADloadfunc)SDL_GL_GetProcAddress);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui::StyleColorsDark();
    ImGui_ImplSDL3_InitForOpenGL(window, gl_context);
    ImGui_ImplOpenGL3_Init("#version 330");

    bool running = true;
    bool show_scene = true;
    bool show_properties = true;
    ImVec4 clear_color(0.10f, 0.12f, 0.16f, 1.0f);
    ImVec4 accent_color(0.29f, 0.61f, 0.96f, 1.0f);
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            ImGui_ImplSDL3_ProcessEvent(&event);
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplSDL3_NewFrame();
        ImGui::NewFrame();

        ImGui::Begin("Editor Tools", nullptr, ImGuiWindowFlags_MenuBar);
        if (ImGui::BeginMenuBar()) {
            if (ImGui::BeginMenu("File")) {
                ImGui::MenuItem("Save");
                ImGui::MenuItem("Save As");
                ImGui::EndMenu();
            }
            if (ImGui::BeginMenu("View")) {
                ImGui::MenuItem("Scene Panel", nullptr, &show_scene);
                ImGui::MenuItem("Properties", nullptr, &show_properties);
                ImGui::EndMenu();
            }
            if (ImGui::BeginMenu("Theme")) {
                ImGui::ColorEdit4("Accent", (float*)&accent_color);
                ImGui::EndMenu();
            }
            ImGui::EndMenuBar();
        }

        ImGui::ColorPicker4("Background", (float*)&clear_color);
        ImGui::TextColored(accent_color, "هذا اللون من Dear ImGui لكنه يعرض داخل نافذة SDL3.");
        ImGui::End();

        ImGui::Render();

        glViewport(0, 0, 1280, 720);
        glClearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
        glClear(GL_COLOR_BUFFER_BIT);
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        SDL_GL_SwapWindow(window);
    }

    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplSDL3_Shutdown();
    ImGui::DestroyContext();
    SDL_GL_DestroyContext(gl_context);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يظهر الفرق هنا بوضوح: SDL3 تتكفل بإنشاء SDL_Window وسياق OpenGL وتمرير SDL_Event، بينما تبني Dear ImGui MenuBar وMenuItem وColorPicker داخل النافذة نفسها.',
      'تمرير الحدث عبر ImGui_ImplSDL3_ProcessEvent هو الجسر الذي يسمح لطبقة GUI المبنية فوق SDL3 بقراءة الفأرة ولوحة المفاتيح من نظام أحداث SDL3.',
      'رغم أن القوائم وأدوات اللون ليست من SDL3 نفسها، فإن المثال عملي ومهم داخل قسم SDL3 لأنه يوضح كيف تصبح SDL3 منصة تشغيل لطبقة GUI أعلى منها.'
    ],
    expectedResult: 'تظهر نافذة SDL3 حقيقية تحتوي لوحة Dear ImGui مع MenuBar وقوائم فرعية وColorPicker، كما ينعكس لون الخلفية على خرج OpenGL داخل نفس نافذة SDL3.',
    related: [
      'SDL_Init',
      'SDL_CreateWindow',
      'SDL_GL_CreateContext',
      'SDL_GL_MakeCurrent',
      'SDL_GL_SetSwapInterval',
      'SDL_GL_SwapWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window',
      'SDL_GLContext'
    ],
    previewKind: 'ui-menu',
    previewTitle: 'معاينة لتكامل SDL3 مع Dear ImGui لقوائم الأدوات ومحرر الألوان.'
  },
  {
    id: 'sdl3-imgui-docking-studio',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui لمساحة Docking احترافية مع Toggles ونوافذ متعددة',
    goal: 'يبني هذا المثال مساحة عمل تحرير كاملة فوق SDL3: DockSpace رئيسية، عدة نوافذ مستقلة، ومفاتيح Toggle تتحكم في ظهور اللوحات مثل Scene وHierarchy وInspector وConsole وAssets.',
    shows: 'SDL3 هنا تدير النافذة والسياق والأحداث فقط، بينما Dear ImGui هي التي تبني Docking وMenuBar والنوافذ المتعددة وMenuItem وCheckbox الخاصة بالتحكم في اللوحات.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا مثل المثال الأساسي الخاص بالقوائم داخل هذا القسم.',
      'يجب تفعيل ImGuiConfigFlags_DockingEnable قبل بناء الإطار.',
      'هذا المثال موجه لواجهات المحررات والأدوات الاحترافية أكثر من كونه واجهة SDL3 خام فقط.'
    ],
    code: `#include <imgui.h>

void DrawSdl3DockingStudioExample()
{
    static bool show_scene = true;
    static bool show_hierarchy = true;
    static bool show_inspector = true;
    static bool show_console = true;
    static bool show_assets = true;
    static bool compact_mode = false;
    static bool show_grid = true;
    static int selected_entity = 0;
    static float tint[4] = {0.36f, 0.66f, 1.0f, 1.0f};

    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;
    ImGui::DockSpaceOverViewport();

    if (ImGui::BeginMainMenuBar()) {
        if (ImGui::BeginMenu("View")) {
            ImGui::MenuItem("Scene", nullptr, &show_scene);
            ImGui::MenuItem("Hierarchy", nullptr, &show_hierarchy);
            ImGui::MenuItem("Inspector", nullptr, &show_inspector);
            ImGui::MenuItem("Console", nullptr, &show_console);
            ImGui::MenuItem("Assets", nullptr, &show_assets);
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Layout")) {
            ImGui::MenuItem("Compact Mode", nullptr, &compact_mode);
            ImGui::MenuItem("Show Grid", nullptr, &show_grid);
            ImGui::EndMenu();
        }
        ImGui::EndMainMenuBar();
    }

    if (show_scene && ImGui::Begin("Scene")) {
        ImGui::Text("Viewport placeholder");
        ImGui::Checkbox("Grid", &show_grid);
        ImGui::SameLine();
        ImGui::Button("Play");
        ImGui::SameLine();
        ImGui::Button("Pause");
    }
    if (show_scene) ImGui::End();

    if (show_hierarchy && ImGui::Begin("Hierarchy")) {
        if (ImGui::Selectable("Camera", selected_entity == 0)) selected_entity = 0;
        if (ImGui::Selectable("Player Car", selected_entity == 1)) selected_entity = 1;
        if (ImGui::Selectable("Point Light", selected_entity == 2)) selected_entity = 2;
    }
    if (show_hierarchy) ImGui::End();

    if (show_inspector && ImGui::Begin("Inspector")) {
        ImGui::Text("Entity: %d", selected_entity);
        ImGui::Checkbox("Active", &show_grid);
        ImGui::SliderFloat4("Tint", tint, 0.0f, 1.0f);
        ImGui::ColorEdit4("Preview Color", tint);
    }
    if (show_inspector) ImGui::End();

    if (show_console && ImGui::Begin("Console")) {
        ImGui::Text("[Info] SDL3 window ready.");
        ImGui::Text("[Info] Docking layout synced.");
        ImGui::Text("[Warn] One texture is still streaming.");
    }
    if (show_console) ImGui::End();

    if (show_assets && ImGui::Begin("Assets")) {
        ImGui::BulletText("Player.mesh");
        ImGui::BulletText("Roadster.png");
        ImGui::BulletText("GlowMask.png");
        ImGui::BulletText("KeyboardAtlas.png");
    }
    if (show_assets) ImGui::End();
}`,
    highlights: [
      'يجمع المثال في صفحة واحدة الإرساء Docking والنوافذ المتعددة والـ Toggles، لذلك يصلح كنموذج محرر كامل فوق SDL3.',
      'التمييز مهم هنا: SDL3 لا تبني هذه اللوحات بنفسها، بل توفر النافذة وحلقة الأحداث، بينما Dear ImGui هي طبقة الواجهة العليا.',
      'ربط MenuItem وCheckbox بحالات show_* يجعل الفتح والإغلاق فعليين لا شكليين، وهذا هو الفرق بين مثال احترافي ومجرد نافذة مزينة.'
    ],
    expectedResult: 'يرى المستخدم مساحة عمل احترافية فيها DockSpace علوية ونوافذ متعددة قابلة للإظهار والإخفاء، مع Toggle واضحة لفتح Scene وHierarchy وInspector وConsole وAssets.',
    related: [
      'SDL_CreateWindow',
      'SDL_GL_CreateContext',
      'SDL_GL_SwapWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-docking-pro',
    previewTitle: 'معاينة لمساحة SDL3 + Dear ImGui احترافية مع Docking ونوافذ متعددة.'
  },
  {
    id: 'sdl3-imgui-tree-combo-gallery',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui للشجرة وصندوق اختيار مع صور',
    goal: 'يوضح هذا المثال كيف تبني شجرة عناصر منظمة مع صندوق اختيار BeginCombo يعرض صورًا مصغرة ونصوصًا داخل نافذة SDL3 تعمل فوقها Dear ImGui.',
    shows: 'هذا المثال واجهي بحت فوق SDL3: SDL3 تدير التشغيل، بينما الشجرة TreeNode وصندوق الاختيار مع الصور من Dear ImGui نفسها بعد رفع الصور كمصادر قابلة للعرض.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'صور مصغرة أو texture IDs جاهزة للعرض داخل Dear ImGui.',
      'يناسب هذا النمط متصفحات الأصول، واختيار القوالب، ولوحات الأنماط داخل الأدوات.'
    ],
    code: `#include <imgui.h>

void DrawSdl3TreeAndComboExample(ImTextureID thumbnails[3])
{
    static const char* names[3] = {"Roadster", "Pickup", "Service Van"};
    static int selected_thumb = 0;
    static bool show_debug_overlay = false;

    ImGui::Begin("Asset Browser");

    if (ImGui::TreeNode("Vehicles")) {
        ImGui::BulletText("Sports");
        ImGui::BulletText("Utility");
        ImGui::BulletText("Service");
        ImGui::TreePop();
    }

    if (ImGui::TreeNode("UI Layers")) {
        ImGui::Selectable("HUD");
        ImGui::Selectable("Inventory");
        ImGui::Selectable("Mini Map");
        ImGui::TreePop();
    }

    if (ImGui::BeginCombo("Vehicle Preset", names[selected_thumb])) {
        for (int i = 0; i < 3; ++i) {
            ImGui::PushID(i);
            ImGui::Image(thumbnails[i], ImVec2(52.0f, 36.0f));
            ImGui::SameLine();
            if (ImGui::Selectable(names[i], selected_thumb == i)) {
                selected_thumb = i;
            }
            ImGui::PopID();
        }
        ImGui::EndCombo();
    }

    ImGui::Checkbox("Show Debug Overlay", &show_debug_overlay);
    ImGui::Text("Selected preset: %s", names[selected_thumb]);
    ImGui::End();
}`,
    highlights: [
      'يجمع المثال بين TreeNode وBeginCombo مع صور، وهي تركيبة عملية جدًا لمتصفحات الأصول ولوحات الاختيار داخل الأدوات.',
      'وجود الصور داخل صندوق الاختيار يرفع المثال من قائمة نصية بسيطة إلى واجهة أوضح وأكثر مهنية للمستخدم.',
      'مرة أخرى، SDL3 لا توفر هذه العناصر مباشرة، بل تشغل البيئة التي ترسم فيها Dear ImGui هذه المكونات.'
    ],
    expectedResult: 'تظهر نافذة تحتوي شجرة منظمة للفئات، وأسفلها صندوق اختيار يعرض صورًا مصغرة لكل خيار مع اسمه، ويمكن تبديل العنصر المختار مباشرة.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-tree-combo',
    previewTitle: 'معاينة لشجرة عناصر وصندوق اختيار مع صور داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'sdl3-imgui-text-editor-keyboard',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui لمحرر نصي مع كيبورد افتراضي',
    goal: 'يبني هذا المثال محرر نصي متعدد الأسطر داخل نافذة SDL3 مع لوحة مفاتيح افتراضية على الشاشة، بحيث يمكن كتابة النص وتحريره من داخل الواجهة نفسها.',
    shows: 'المثال يوضح أن SDL3 تدير النافذة والإدخال الأساسي، بينما Dear ImGui تبني محرر النص والكيبورد الافتراضي والعمليات المرئية المرتبطة بهما.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'المثال مناسب للأدوات اللمسية أو الشاشات المدمجة أو الواجهات التي لا تريد الاعتماد الكامل على لوحة مفاتيح النظام.',
      'يمكن استبدال النصوص الإنجليزية هنا بعربية أو مفاتيح وظيفية إضافية بحسب المشروع.'
    ],
    code: `#include <imgui.h>
#include <cstring>

static void AppendKey(char* buffer, size_t capacity, const char* key)
{
    size_t len = strlen(buffer);
    size_t key_len = strlen(key);
    if (len + key_len + 1 < capacity) {
        memcpy(buffer + len, key, key_len + 1);
    }
}

void DrawSdl3TextEditorKeyboardExample()
{
    static char editor[2048] = "PlayerSpeed = 14.0\\nGlowEnabled = true\\n";
    static const char* row1[] = {"Q","W","E","R","T","Y","U","I","O","P"};
    static const char* row2[] = {"A","S","D","F","G","H","J","K","L"};
    static const char* row3[] = {"Z","X","C","V","B","N","M"};

    ImGui::Begin("Text Editor");
    ImGui::InputTextMultiline("##editor", editor, IM_ARRAYSIZE(editor), ImVec2(-1.0f, 220.0f));
    ImGui::Separator();

    for (int i = 0; i < 10; ++i) {
        if (ImGui::Button(row1[i], ImVec2(34.0f, 32.0f))) AppendKey(editor, IM_ARRAYSIZE(editor), row1[i]);
        if (i != 9) ImGui::SameLine();
    }
    for (int i = 0; i < 9; ++i) {
        if (ImGui::Button(row2[i], ImVec2(34.0f, 32.0f))) AppendKey(editor, IM_ARRAYSIZE(editor), row2[i]);
        if (i != 8) ImGui::SameLine();
    }
    for (int i = 0; i < 7; ++i) {
        if (ImGui::Button(row3[i], ImVec2(34.0f, 32.0f))) AppendKey(editor, IM_ARRAYSIZE(editor), row3[i]);
        if (i != 6) ImGui::SameLine();
    }
    if (ImGui::Button("Space", ImVec2(200.0f, 34.0f))) AppendKey(editor, IM_ARRAYSIZE(editor), " ");
    ImGui::SameLine();
    if (ImGui::Button("Backspace", ImVec2(120.0f, 34.0f))) {
        size_t len = strlen(editor);
        if (len > 0) editor[len - 1] = '\\0';
    }
    ImGui::End();
}`,
    highlights: [
      'يجمع المثال بين محرر نصي فعلي وكيبورد افتراضي، لذلك يغطي وظيفتين شائعتين في واجهات الأدوات والأنظمة المدمجة.',
      'InputTextMultiline مسؤول عن التحرير المرئي، بينما الأزرار هي التي تضيف الأحرف فعليًا إلى المخزن النصي.',
      'هذا مثال واضح على أن SDL3 يمكن أن تكون منصة تشغيل لواجهة متقدمة، حتى لو كانت عناصر التحرير نفسها من Dear ImGui.'
    ],
    expectedResult: 'تظهر نافذة فيها محرر نصي كبير وأسفلها صفوف أزرار تمثل لوحة مفاتيح مصغرة، ويمكن الكتابة داخل المحرر بالضغط على هذه الأزرار مباشرة.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-text-keyboard',
    previewTitle: 'معاينة لمحرر نصي مع كيبورد افتراضي داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'sdl3-imgui-effects-lab',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui لمختبر الانفجار والوهج والتطاير',
    goal: 'يجمع هذا المثال ثلاثة أنماط مؤثرات مطلوبة داخل صفحة واحدة: انفجار بنبضة وشظايا، وهج بطبقات سطوع، وتطاير جسيمات من مركز واحد، مع معاينات واضحة وتعديل مباشر للقيم.',
    shows: 'المشهد يعمل فوق SDL3 لكن المؤثرات هنا مبنية بوساطة Dear ImGui وImDrawList، لذلك هو مختبر واجهة وأدوات تحرير أكثر من كونه renderer مؤثرات نهائيًا.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'هذا المثال مناسب لمحررات المؤثرات البصرية ولوحات الضبط السريعة داخل الأدوات.',
      'Dear ImGui لا تقدم نظام مؤثرات عالي المستوى هنا، بل التطبيق هو من يحدّث القيم ويرسم المعاينة في كل إطار.'
    ],
    code: `#include <imgui.h>

void DrawSdl3EffectsLabExample()
{
    static float blast_time = 0.8f;
    static float blast_speed = 94.0f;
    static float glow_radius = 28.0f;
    static float glow_intensity = 0.82f;
    static float scatter_time = 0.0f;
    static float scatter_spread = 78.0f;
    static float scatter_speed = 1.2f;
    static int scatter_count = 14;

    ImGuiIO& io = ImGui::GetIO();
    blast_time += io.DeltaTime;
    scatter_time += io.DeltaTime * scatter_speed;
    if (scatter_time > 1.2f) scatter_time = 0.0f;

    ImGui::Begin("Effects Lab");
    if (ImGui::Button("Trigger Explosion")) blast_time = 0.0f;
    ImGui::SameLine();
    ImGui::SliderFloat("Blast Speed", &blast_speed, 30.0f, 180.0f);

    if (ImGui::BeginTabBar("effects_tabs")) {
        if (ImGui::BeginTabItem("Explosion")) {
            ImVec2 a = ImGui::GetCursorScreenPos();
            ImVec2 s(320.0f, 180.0f);
            ImGui::InvisibleButton("explosion_canvas", s);
            ImDrawList* d = ImGui::GetWindowDrawList();
            ImVec2 c(a.x + 160.0f, a.y + 90.0f);
            float radius = blast_time * blast_speed;
            float alpha = ImClamp(1.0f - blast_time * 0.55f, 0.0f, 1.0f);
            d->AddRectFilled(a, ImVec2(a.x + s.x, a.y + s.y), IM_COL32(18, 25, 36, 255), 12.0f);
            d->AddCircleFilled(c, 18.0f + blast_time * 16.0f, IM_COL32(255, 188, 92, (int)(alpha * 120.0f)));
            d->AddCircle(c, radius, IM_COL32(255, 214, 116, (int)(alpha * 255.0f)), 0, 3.0f);
            for (int i = 0; i < 8; ++i) {
                float x = c.x + ((i - 3.5f) * 12.0f) * blast_time;
                float y = c.y + ((i % 3) - 1.0f) * 24.0f * blast_time;
                d->AddRectFilled(ImVec2(x - 3.0f, y - 3.0f), ImVec2(x + 3.0f, y + 3.0f), IM_COL32(255, 206, 132, (int)(alpha * 255.0f)), 2.0f);
            }
            ImGui::EndTabItem();
        }
        if (ImGui::BeginTabItem("Glow")) {
            ImGui::SliderFloat("Glow Radius", &glow_radius, 12.0f, 72.0f);
            ImGui::SliderFloat("Glow Intensity", &glow_intensity, 0.1f, 1.0f);
            ImVec2 a = ImGui::GetCursorScreenPos();
            ImVec2 s(320.0f, 180.0f);
            ImGui::InvisibleButton("glow_canvas", s);
            ImDrawList* d = ImGui::GetWindowDrawList();
            ImVec2 c(a.x + 160.0f, a.y + 90.0f);
            d->AddRectFilled(a, ImVec2(a.x + s.x, a.y + s.y), IM_COL32(16, 23, 34, 255), 12.0f);
            for (int layer = 4; layer >= 1; --layer) {
                float layer_radius = glow_radius + layer * 16.0f;
                int alpha = (int)(glow_intensity * 34.0f * layer);
                d->AddCircleFilled(c, layer_radius, IM_COL32(92, 184, 255, alpha));
            }
            d->AddCircleFilled(c, glow_radius, IM_COL32(255, 244, 226, 255));
            ImGui::EndTabItem();
        }
        if (ImGui::BeginTabItem("Particles")) {
            ImGui::SliderFloat("Spread", &scatter_spread, 20.0f, 140.0f);
            ImGui::SliderInt("Count", &scatter_count, 6, 24);
            ImVec2 a = ImGui::GetCursorScreenPos();
            ImVec2 s(320.0f, 180.0f);
            ImGui::InvisibleButton("scatter_canvas", s);
            ImDrawList* d = ImGui::GetWindowDrawList();
            ImVec2 c(a.x + 160.0f, a.y + 90.0f);
            d->AddRectFilled(a, ImVec2(a.x + s.x, a.y + s.y), IM_COL32(17, 24, 35, 255), 12.0f);
            d->AddCircleFilled(c, 7.0f, IM_COL32(255, 206, 114, 255));
            for (int i = 0; i < scatter_count; ++i) {
                float n = (float)i / (float)scatter_count;
                float dx = cosf(n * IM_PI * 2.0f);
                float dy = sinf(n * IM_PI * 2.0f);
                float dist = scatter_spread * scatter_time;
                d->AddCircleFilled(ImVec2(c.x + dx * dist, c.y + dy * dist * 0.72f), 3.0f + n * 2.0f, IM_COL32(111, 192, 255, 220));
            }
            ImGui::EndTabItem();
        }
        ImGui::EndTabBar();
    }
    ImGui::End();
}`,
    highlights: [
      'يوفر المثال ثلاث معاينات مستقلة داخل مختبر واحد، لذلك يغطي الانفجار والوهج والتطاير من دون تكرار طبقة التهيئة نفسها.',
      'كل ما يراه المستخدم هنا ناتج عن تحديث قيم بسيطة بين الإطارات ثم تحويلها إلى دوائر وشظايا وجسيمات عبر ImDrawList.',
      'هذا المثال عملي جدًا كمحرر مؤثرات بصري فوق SDL3 حتى لو لم يكن renderer نهائيًا للمحرك.'
    ],
    expectedResult: 'تظهر نافذة مختبر تحتوي تبويبات Explosion وGlow وParticles، وفي كل تبويب معاينة واضحة مع أدوات ضبط مباشرة للقيم والسلوك المرئي.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-effects-lab',
    previewTitle: 'معاينة لمختبر انفجار ووهج وتطاير داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'sdl3-imgui-clock-dashboard',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui لساعة تناظرية ورقمية',
    goal: 'يبني هذا المثال ساعة واضحة داخل نافذة SDL3 تعمل فوقها Dear ImGui، مع عقارب تناظرية وقراءة رقمية تتغير في كل إطار.',
    shows: 'SDL3 تشغل النافذة وتغذي Dear ImGui بالإدخال والزمن، بينما Dear ImGui وImDrawList تتوليان رسم الساعة والعقارب والقراءة الرقمية داخل لوحة أدوات.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'المثال مناسب للوحات القياس والمحاكاة وواجهات الأدوات التي تحتاج مؤشر وقت بصريًا.',
      'يمكنك استبدال ImGui::GetTime بزمن منطقي من تطبيقك إذا أردت ساعة مرتبطة بالمشهد نفسه.'
    ],
    code: `#include <imgui.h>

void DrawSdl3ClockDashboardExample()
{
    float t = (float)ImGui::GetTime();
    float seconds = fmodf(t, 60.0f);
    float minutes = fmodf(t / 60.0f, 60.0f);
    float hours = fmodf(t / 3600.0f, 12.0f);

    ImGui::Begin("Clock Dashboard");
    ImVec2 a = ImGui::GetCursorScreenPos();
    ImVec2 s(260.0f, 220.0f);
    ImGui::InvisibleButton("clock_canvas", s);
    ImDrawList* d = ImGui::GetWindowDrawList();
    ImVec2 c(a.x + 130.0f, a.y + 96.0f);
    float radius = 68.0f;

    d->AddRectFilled(a, ImVec2(a.x + s.x, a.y + s.y), IM_COL32(18, 27, 39, 255), 14.0f);
    d->AddCircle(c, radius, IM_COL32(86, 120, 160, 255), 0, 3.0f);
    for (int i = 0; i < 12; ++i) {
        float angle = -IM_PI / 2.0f + (IM_PI * 2.0f * i) / 12.0f;
        ImVec2 p1(c.x + cosf(angle) * (radius - 8.0f), c.y + sinf(angle) * (radius - 8.0f));
        ImVec2 p2(c.x + cosf(angle) * radius, c.y + sinf(angle) * radius);
        d->AddLine(p1, p2, IM_COL32(225, 233, 244, 255), 2.0f);
    }

    float second_angle = -IM_PI / 2.0f + (seconds / 60.0f) * IM_PI * 2.0f;
    float minute_angle = -IM_PI / 2.0f + (minutes / 60.0f) * IM_PI * 2.0f;
    float hour_angle = -IM_PI / 2.0f + (hours / 12.0f) * IM_PI * 2.0f;
    d->AddLine(c, ImVec2(c.x + cosf(hour_angle) * (radius - 30.0f), c.y + sinf(hour_angle) * (radius - 30.0f)), IM_COL32(255, 214, 116, 255), 5.0f);
    d->AddLine(c, ImVec2(c.x + cosf(minute_angle) * (radius - 20.0f), c.y + sinf(minute_angle) * (radius - 20.0f)), IM_COL32(116, 191, 255, 255), 4.0f);
    d->AddLine(c, ImVec2(c.x + cosf(second_angle) * (radius - 12.0f), c.y + sinf(second_angle) * (radius - 12.0f)), IM_COL32(255, 116, 116, 255), 2.0f);
    d->AddCircleFilled(c, 5.0f, IM_COL32(243, 247, 252, 255));

    ImGui::Text("h=%.1f  m=%.1f  s=%.1f", hours, minutes, seconds);
    ImGui::End();
}`,
    highlights: [
      'يبني المثال ساعة فعلية لا مجرد رقم، لذلك يغطي إنشاء مؤشر بصري مخصص داخل واجهة SDL3 + Dear ImGui.',
      'العقارب والقراءة الرقمية معًا تجعل المثال مناسبًا للوحات المحاكاة والعدادات داخل المحررات.',
      'مرة أخرى، لا تأتي الساعة كـ widget جاهزة من SDL3، بل كتجميع قيم ورسم فوري داخل Dear ImGui.'
    ],
    expectedResult: 'تظهر ساعة تناظرية واضحة مع عقارب متحركة وقراءة رقمية أسفلها داخل نافذة أدوات تعمل فوق SDL3.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-clock',
    previewTitle: 'معاينة لساعة تناظرية ورقمية داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'sdl3-imgui-circular-car',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui للحركة الدائرية وتحريك سيارة',
    goal: 'يجمع هذا المثال بين الحركة الدائرية وتحريك عنصر مرئي يشبه سيارة صغيرة داخل مسار دائري، مع إمكانية ضبط السرعة من نافذة أدوات تعمل فوق SDL3.',
    shows: 'هذا المثال واجهي فوق SDL3: SDL3 تشغل النافذة، بينما Dear ImGui تحسب الحركة الدائرية وترسم المسار والسيارة داخل Canvas مباشرة.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'يناسب هذا النمط الرادارات والخرائط المصغرة ومؤشرات المسار وأدوات التدريب.',
      'يمكن استبدال السيارة بأي أيقونة أو marker أو صورة بحسب طبيعة مشروعك.'
    ],
    code: `#include <imgui.h>

void DrawSdl3CircularCarExample()
{
    static float angle = 0.0f;
    static float speed = 1.25f;

    ImGuiIO& io = ImGui::GetIO();
    angle += speed * io.DeltaTime;

    ImGui::Begin("Circular Motion");
    ImGui::SliderFloat("Speed", &speed, 0.2f, 3.5f);

    ImVec2 a = ImGui::GetCursorScreenPos();
    ImVec2 s(340.0f, 240.0f);
    ImGui::InvisibleButton("car_canvas", s);
    ImDrawList* d = ImGui::GetWindowDrawList();
    ImVec2 c(a.x + 170.0f, a.y + 118.0f);
    float radius = 78.0f;
    ImVec2 car(c.x + cosf(angle) * radius, c.y + sinf(angle) * radius);

    d->AddRectFilled(a, ImVec2(a.x + s.x, a.y + s.y), IM_COL32(17, 25, 36, 255), 14.0f);
    d->AddCircle(c, radius, IM_COL32(78, 108, 140, 255), 0, 4.0f);
    d->AddCircle(c, radius + 14.0f, IM_COL32(40, 62, 86, 255), 0, 1.0f);
    d->AddRectFilled(ImVec2(car.x - 16.0f, car.y - 10.0f), ImVec2(car.x + 16.0f, car.y + 10.0f), IM_COL32(255, 198, 104, 255), 6.0f);
    d->AddCircleFilled(ImVec2(car.x - 10.0f, car.y + 10.0f), 4.0f, IM_COL32(29, 32, 37, 255));
    d->AddCircleFilled(ImVec2(car.x + 10.0f, car.y + 10.0f), 4.0f, IM_COL32(29, 32, 37, 255));

    ImGui::Text("Angle: %.2f", angle);
    ImGui::Text("Car Pos: %.1f, %.1f", car.x, car.y);
    ImGui::End();
}`,
    highlights: [
      'يغطي المثال طلب الحركة الدائرية وتحريك سيارة في صفحة واحدة واضحة بصريًا وسهلة الضبط.',
      'النتيجة تأتي من sin/cos وقيم محفوظة بين الإطارات، لا من نظام فيزياء أو scene graph خاص بـ SDL3.',
      'هذا النمط مناسب جدًا عندما تريد عنصرًا مرئيًا متحركًا داخل أدواتك لا داخل مشهد اللعبة الأساسي فقط.'
    ],
    expectedResult: 'تظهر سيارة صغيرة تتحرك باستمرار على مسار دائري داخل Canvas، ويمكن زيادة السرعة أو تخفيضها مباشرة من منزلق داخل نافذة الأدوات.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-car-orbit',
    previewTitle: 'معاينة لحركة دائرية مع سيارة داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'sdl3-imgui-nested-media-menus',
    packageKey: 'core',
    title: 'مثال SDL3 + Dear ImGui لقوائم متداخلة مع صور',
    goal: 'يبني هذا المثال شريط قوائم احترافيًا يتضمن قوائم فرعية متداخلة حتى ثلاثة مستويات، مع صور مصغرة للخيارات النهائية مثل المركبات أو الثيمات أو الأصول.',
    shows: 'هذا المثال واجهي بوضوح: SDL3 تشغل البيئة، بينما Dear ImGui تبني MenuBar والقوائم الفرعية المتعددة وImage مع MenuItem داخل المسار النهائي.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'تطبيق SDL3 + Dear ImGui مهيأ مسبقًا.',
      'صور مصغرة أو texture IDs جاهزة للعناصر النهائية داخل القوائم.',
      'يناسب هذا النمط متصفحات الأصول والقوالب والثيمات والأدوات الاحترافية.'
    ],
    code: `#include <imgui.h>

void DrawSdl3NestedMediaMenusExample(ImTextureID thumbs[3])
{
    static const char* names[3] = {"Coupe", "Roadster", "Track"};
    static int selected_vehicle = 0;

    ImGui::Begin("Media Menus", nullptr, ImGuiWindowFlags_MenuBar);
    if (ImGui::BeginMenuBar()) {
        if (ImGui::BeginMenu("Assets")) {
            if (ImGui::BeginMenu("Vehicles")) {
                if (ImGui::BeginMenu("Sports")) {
                    for (int i = 0; i < 3; ++i) {
                        ImGui::PushID(i);
                        ImGui::Image(thumbs[i], ImVec2(46.0f, 30.0f));
                        ImGui::SameLine();
                        if (ImGui::MenuItem(names[i], nullptr, selected_vehicle == i)) {
                            selected_vehicle = i;
                        }
                        ImGui::PopID();
                    }
                    ImGui::EndMenu();
                }
                if (ImGui::BeginMenu("Utility")) {
                    ImGui::MenuItem("Pickup");
                    ImGui::MenuItem("Support Van");
                    ImGui::EndMenu();
                }
                ImGui::EndMenu();
            }
            if (ImGui::BeginMenu("Themes")) {
                if (ImGui::BeginMenu("Studio")) {
                    ImGui::MenuItem("Cobalt");
                    ImGui::MenuItem("Amber");
                    ImGui::EndMenu();
                }
                ImGui::EndMenu();
            }
            ImGui::EndMenu();
        }
        ImGui::EndMenuBar();
    }

    ImGui::Text("Selected vehicle: %s", names[selected_vehicle]);
    ImGui::End();
}`,
    highlights: [
      'هذا المثال يغطي القوائم المتداخلة مع الصور بوضوح، من المستوى الرئيسي حتى العنصر النهائي داخل MenuItem.',
      'عرض الصور داخل المسار الأخير يجعل المثال مهنيًا أكثر من القوائم النصية البسيطة ويعطي معاينة مباشرة للاختيار.',
      'مرة أخرى، SDL3 هي منصة التشغيل هنا، بينما كل منطق MenuBar وSubmenu وImage يأتي من Dear ImGui.'
    ],
    expectedResult: 'تظهر نافذة فيها MenuBar احترافية، وعند فتح Assets ثم Vehicles ثم Sports تظهر صور مصغرة مع أسماء المركبات النهائية وتحديد العنصر المختار.',
    related: [
      'SDL_CreateWindow',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT',
      'SDL_Window'
    ],
    previewKind: 'imgui-media-menus',
    previewTitle: 'معاينة لقوائم متداخلة مع صور داخل SDL3 + Dear ImGui.'
  },
  {
    id: 'wireframe-cube-sdl3',
    packageKey: 'core',
    title: 'مثال مكعب ثلاثي الأبعاد سلكي داخل SDL3',
    goal: 'يوضح هذا المثال كيف يمكن بناء معاينة 3D سلكية داخل SDL3 نفسها من دون OpenGL أو Vulkan: تحديث دوران نقاط مجسم، إسقاطها إلى الشاشة، ثم رسم الأضلاع عبر SDL_RenderLine في كل إطار.',
    shows: 'هذا المثال من SDL3 نفسها لا أكثر. لا يوجد renderer ثلاثي الأبعاد جاهز هنا؛ التطبيق يحسب الإسقاط المنظوري للمكعب ويحوّل النتيجة إلى خطوط ثنائية الأبعاد على SDL_Renderer.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع math.h للحسابات المثلثية.',
      'المثال يشرح wireframe 3D مبسطًا، وليس خط أنابيب ثلاثي الأبعاد كاملاً.',
      'يمكن استبدال المكعب بأي مجسم نقاط/أضلاع آخر لاحقًا مع الاحتفاظ بنفس دالة الإسقاط.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

typedef struct Vec3 {
    float x, y, z;
} Vec3;

static SDL_FPoint ProjectPoint(Vec3 p, float angle_x, float angle_y, float center_x, float center_y)
{
    float cy = cosf(angle_y);
    float sy = sinf(angle_y);
    float cx = cosf(angle_x);
    float sx = sinf(angle_x);

    float rx = p.x * cy - p.z * sy;
    float rz = p.x * sy + p.z * cy;
    float ry = p.y * cx - rz * sx;
    rz = p.y * sx + rz * cx;

    float depth = 4.4f + rz;
    float scale = 150.0f / depth;

    SDL_FPoint out = {
        center_x + rx * scale,
        center_y + ry * scale
    };
    return out;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 wireframe cube", 1120, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    const Vec3 cube[8] = {
        {-1.0f, -1.0f, -1.0f}, { 1.0f, -1.0f, -1.0f},
        { 1.0f,  1.0f, -1.0f}, {-1.0f,  1.0f, -1.0f},
        {-1.0f, -1.0f,  1.0f}, { 1.0f, -1.0f,  1.0f},
        { 1.0f,  1.0f,  1.0f}, {-1.0f,  1.0f,  1.0f}
    };
    const int edges[12][2] = {
        {0,1},{1,2},{2,3},{3,0},
        {4,5},{5,6},{6,7},{7,4},
        {0,4},{1,5},{2,6},{3,7}
    };

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        float t = (float)SDL_GetTicks() * 0.001f;
        SDL_FPoint projected[8];
        for (int i = 0; i < 8; ++i) {
            projected[i] = ProjectPoint(cube[i], t * 0.8f, t * 1.2f, 560.0f, 360.0f);
        }

        SDL_SetRenderDrawColor(renderer, 12, 18, 28, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 95, 174, 255, 255);
        for (int i = 0; i < 12; ++i) {
            SDL_RenderLine(renderer,
                projected[edges[i][0]].x, projected[edges[i][0]].y,
                projected[edges[i][1]].x, projected[edges[i][1]].y);
        }

        SDL_SetRenderDrawColor(renderer, 255, 205, 112, 255);
        for (int i = 0; i < 8; ++i) {
            SDL_FRect p = { projected[i].x - 4.0f, projected[i].y - 4.0f, 8.0f, 8.0f };
            SDL_RenderFillRect(renderer, &p);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يخزن المثال نقاط المكعب وأضلاعه فقط، ثم يحسب الدوران والإسقاط في كل إطار بدل الاعتماد على API ثلاثية الأبعاد منفصلة.',
      'الخطوة المهمة هنا هي ProjectPoint: تحوّل النقطة من فضاء ثلاثي الأبعاد مبسط إلى موضع ثنائي الأبعاد على نافذة SDL3.',
      'هذا يوضح الفرق بين SDL3 الأساسية وبين محرك 3D كامل: SDL3 ترسم الخطوط، بينما التطبيق نفسه يبني الرياضيات والإسقاط.'
    ],
    expectedResult: 'يرى المستخدم مكعبًا سلكيًا يدور بمرور الوقت داخل نافذة SDL3، مع رؤوس بارزة وأضلاع واضحة توضح شكل المجسم ثلاثي الأبعاد.',
    related: [
      'SDL_GetTicks',
      'SDL_RenderLine',
      'SDL_RenderFillRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderPresent',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'wire-cube',
    previewTitle: 'معاينة لمكعب ثلاثي الأبعاد سلكي مرسوم داخل SDL3.'
  },
  {
    id: 'perspective-quad-sdl3',
    packageKey: 'core',
    title: 'مثال لوح منظور ثلاثي الأبعاد داخل SDL3',
    goal: 'يعرض هذا المثال مربعًا أو لوحًا رباعي الأضلاع في فضاء ثلاثي الأبعاد مبسط، ثم يسقطه بمنظور واضح على الشاشة حتى ترى الفرق بين مستطيل 2D عادي وبين Quad مائل في فضاء 3D.',
    shows: 'هذا أيضًا من SDL3 نفسها. التطبيق يحسب مواضع الرؤوس ويصل بينها بخطوط، لذلك هو مثال هندسي/رياضي فوق SDL_Renderer لا أكثر.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع math.h.',
      'يناسب هذا المثال لوحات العرض المائلة أو البطاقات المنظورية أو شاشات HUD داخل أدواتك.',
      'لا يعتمد على تعبئة مضلع صلبة؛ يوضح المنظور عبر حدود اللوح والقطرين وخطوط إرشاد.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

typedef struct Vec3 {
    float x, y, z;
} Vec3;

static SDL_FPoint ProjectQuadPoint(Vec3 p, float tilt_x, float tilt_y, float cx, float cy)
{
    float sy = sinf(tilt_y);
    float cy_rot = cosf(tilt_y);
    float sx = sinf(tilt_x);
    float cx_rot = cosf(tilt_x);

    float rx = p.x * cy_rot - p.z * sy;
    float rz = p.x * sy + p.z * cy_rot;
    float ry = p.y * cx_rot - rz * sx;
    rz = p.y * sx + rz * cx_rot;

    float perspective = 210.0f / (5.0f + rz);
    SDL_FPoint out = {
        cx + rx * perspective,
        cy + ry * perspective
    };
    return out;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 perspective quad", 1080, 680, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    const Vec3 quad[4] = {
        {-1.6f, -1.0f, 0.0f},
        { 1.6f, -1.0f, 0.0f},
        { 1.6f,  1.0f, 0.0f},
        {-1.6f,  1.0f, 0.0f}
    };

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        float t = (float)SDL_GetTicks() * 0.001f;
        float tilt_x = 0.35f + sinf(t * 0.7f) * 0.22f;
        float tilt_y = 0.50f + cosf(t * 0.9f) * 0.30f;
        SDL_FPoint p[4];
        for (int i = 0; i < 4; ++i) {
            p[i] = ProjectQuadPoint(quad[i], tilt_x, tilt_y, 540.0f, 340.0f);
        }

        SDL_SetRenderDrawColor(renderer, 13, 19, 29, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 90, 164, 244, 255);
        SDL_RenderLine(renderer, p[0].x, p[0].y, p[1].x, p[1].y);
        SDL_RenderLine(renderer, p[1].x, p[1].y, p[2].x, p[2].y);
        SDL_RenderLine(renderer, p[2].x, p[2].y, p[3].x, p[3].y);
        SDL_RenderLine(renderer, p[3].x, p[3].y, p[0].x, p[0].y);

        SDL_SetRenderDrawColor(renderer, 255, 196, 102, 255);
        SDL_RenderLine(renderer, p[0].x, p[0].y, p[2].x, p[2].y);
        SDL_RenderLine(renderer, p[1].x, p[1].y, p[3].x, p[3].y);

        for (int i = 0; i < 4; ++i) {
            SDL_FRect marker = { p[i].x - 5.0f, p[i].y - 5.0f, 10.0f, 10.0f };
            SDL_RenderFillRect(renderer, &marker);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يبين المثال Quad منظورياً بدل رسم مستطيل شاشة عادي، لذلك يفهم القارئ معنى الميلان والعمق حتى من دون mesh كامل.',
      'يركز هذا المثال على مفهوم اللوح ثلاثي الأبعاد أو البطاقة المائلة، وهو قريب من شاشات HUD أو بطاقات العرض المائلة داخل المحررات.',
      'المنظور هنا يحسب بالكامل في التطبيق، ثم تستخدم SDL3 فقط لرسم الحواف والعلامات الناتجة.'
    ],
    expectedResult: 'تظهر بطاقة أو لوح رباعي الأضلاع يدور ويميل بوضوح، مع منظور يغيّر شكل الزوايا والأقطار بمرور الوقت داخل نافذة SDL3.',
    related: [
      'SDL_GetTicks',
      'SDL_RenderLine',
      'SDL_RenderFillRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderPresent',
      'SDL_PollEvent'
    ],
    previewKind: 'perspective-quad',
    previewTitle: 'معاينة للوح منظور ثلاثي الأبعاد مرسوم بخطوط داخل SDL3.'
  },
  {
    id: 'resize-square-handles',
    packageKey: 'core',
    title: 'مثال تكبير وتصغير مربع بمقابض سحب بالفأرة',
    goal: 'يبني هذا المثال مربعًا قابلًا للتحجيم عبر مقابض ظاهرة في الزوايا، ثم يحدّث العرض والارتفاع مباشرة عند سحب كل مقبض بالماوس مثل أدوات التحويل داخل المحررات.',
    shows: 'هذا المثال من SDL3 نفسها: كشف موضع الفأرة، معرفة أي Handle التُقط، ثم تحديث أبعاد المستطيل والموضع الناتج. لا توجد طبقة GUI خارجية هنا.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'المثال مناسب لأدوات القص والتحويل وواجهات التخطيط ومحررات العناصر.',
      'يفضل تطبيق حد أدنى للحجم حتى لا ينعكس المستطيل أو ينهار أثناء السحب.'
    ],
    code: `#include <SDL3/SDL.h>

typedef enum ResizeHandle {
    HANDLE_NONE = -1,
    HANDLE_TOP_LEFT = 0,
    HANDLE_TOP_RIGHT = 1,
    HANDLE_BOTTOM_RIGHT = 2,
    HANDLE_BOTTOM_LEFT = 3
} ResizeHandle;

static SDL_FRect MakeHandleRect(const SDL_FRect *box, ResizeHandle handle)
{
    const float size = 14.0f;
    switch (handle) {
        case HANDLE_TOP_LEFT:     return (SDL_FRect){ box->x - size * 0.5f, box->y - size * 0.5f, size, size };
        case HANDLE_TOP_RIGHT:    return (SDL_FRect){ box->x + box->w - size * 0.5f, box->y - size * 0.5f, size, size };
        case HANDLE_BOTTOM_RIGHT: return (SDL_FRect){ box->x + box->w - size * 0.5f, box->y + box->h - size * 0.5f, size, size };
        case HANDLE_BOTTOM_LEFT:  return (SDL_FRect){ box->x - size * 0.5f, box->y + box->h - size * 0.5f, size, size };
        default:                  return (SDL_FRect){ 0.0f, 0.0f, 0.0f, 0.0f };
    }
}

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 resize handles", 1080, 680, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    SDL_FRect box = { 280.0f, 170.0f, 260.0f, 180.0f };
    ResizeHandle active_handle = HANDLE_NONE;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT) {
                for (int i = 0; i < 4; ++i) {
                    SDL_FRect handle = MakeHandleRect(&box, (ResizeHandle)i);
                    if (PointInRect(event.button.x, event.button.y, &handle)) {
                        active_handle = (ResizeHandle)i;
                        break;
                    }
                }
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                active_handle = HANDLE_NONE;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION && active_handle != HANDLE_NONE) {
                const float min_size = 70.0f;
                float left = box.x;
                float top = box.y;
                float right = box.x + box.w;
                float bottom = box.y + box.h;

                if (active_handle == HANDLE_TOP_LEFT || active_handle == HANDLE_BOTTOM_LEFT) {
                    left = event.motion.x;
                }
                if (active_handle == HANDLE_TOP_RIGHT || active_handle == HANDLE_BOTTOM_RIGHT) {
                    right = event.motion.x;
                }
                if (active_handle == HANDLE_TOP_LEFT || active_handle == HANDLE_TOP_RIGHT) {
                    top = event.motion.y;
                }
                if (active_handle == HANDLE_BOTTOM_LEFT || active_handle == HANDLE_BOTTOM_RIGHT) {
                    bottom = event.motion.y;
                }

                if (right - left < min_size) right = left + min_size;
                if (bottom - top < min_size) bottom = top + min_size;

                box.x = left;
                box.y = top;
                box.w = right - left;
                box.h = bottom - top;
            }
        }

        SDL_SetRenderDrawColor(renderer, 15, 21, 31, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 82, 144, 220, 255);
        SDL_RenderRect(renderer, &box);

        SDL_FRect inner = { box.x + 6.0f, box.y + 6.0f, box.w - 12.0f, box.h - 12.0f };
        SDL_SetRenderDrawColor(renderer, 34, 50, 71, 255);
        SDL_RenderFillRect(renderer, &inner);

        for (int i = 0; i < 4; ++i) {
            SDL_FRect handle = MakeHandleRect(&box, (ResizeHandle)i);
            SDL_SetRenderDrawColor(renderer,
                active_handle == i ? 255 : 255,
                active_handle == i ? 201 : 214,
                active_handle == i ? 102 : 138,
                255);
            SDL_RenderFillRect(renderer, &handle);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'كل مقبض هو مستطيل صغير مستقل، لذلك قرار التحجيم يبدأ من اختبار Handle محددة لا من اختبار العنصر كله.',
      'التطبيق يحدث left/right/top/bottom أولاً ثم يعيد بناء المستطيل النهائي، وهذا أوضح من تعديل العرض والارتفاع مباشرة من دون مرجع واضح.',
      'المثال قريب جدًا من أدوات التصميم والمحررات، ويغطي تكبير وتصغير عنصر عبر السحب بالفأرة داخل SDL3 نفسها.'
    ],
    expectedResult: 'يرى المستخدم مربعًا بحدود واضحة ومقابض في الزوايا، ويمكنه سحب أي مقبض لتكبير العنصر أو تصغيره مع تحديث مرئي مباشر للحجم.',
    related: [
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_BUTTON_LEFT',
      'SDL_RenderRect',
      'SDL_RenderFillRect',
      'SDL_PollEvent'
    ],
    previewKind: 'resize-handles',
    previewTitle: 'معاينة لمربع قابل للتحجيم بمقابض سحب داخل SDL3.'
  },
  {
    id: 'drag-multiple-elements-layout',
    packageKey: 'core',
    title: 'مثال تغيير موضع عناصر متعددة أو صور بالسحب بالفأرة',
    goal: 'يوضح هذا المثال كيف يدير التطبيق أكثر من عنصر قابل للسحب داخل نفس النافذة، مع التقاط العنصر العلوي وتحريك موضعه بالفأرة وإبقاء بقية العناصر في أماكنها.',
    shows: 'المثال يركز على SDL3 نفسها: اختبار الاستهداف، اختيار العنصر النشط، حفظ offset، ثم تحديث موضع بطاقة أو صورة أو مربع أثناء السحب.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية فقط.',
      'يمكن استبدال البطاقات المرسومة هنا بـ SDL_Texture أو صور مصغرة لاحقًا من دون تغيير المنطق الأساسي.',
      'يفيد هذا المثال في شاشات layout editors وinventory boards وkanban-like canvases.'
    ],
    code: `#include <SDL3/SDL.h>

typedef struct DragItem {
    SDL_FRect rect;
    SDL_Color color;
} DragItem;

static bool PointInRect(float x, float y, const SDL_FRect *rect)
{
    return x >= rect->x && x <= rect->x + rect->w &&
           y >= rect->y && y <= rect->y + rect->h;
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 drag layout", 1180, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    DragItem items[3] = {
        { {120.0f, 120.0f, 220.0f, 140.0f}, { 95, 168, 255, 255 } },
        { {420.0f, 160.0f, 240.0f, 150.0f}, { 255, 198, 108, 255 } },
        { {760.0f, 120.0f, 220.0f, 180.0f}, { 119, 210, 168, 255 } }
    };

    int active_index = -1;
    float offset_x = 0.0f;
    float offset_y = 0.0f;
    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
                event.button.button == SDL_BUTTON_LEFT) {
                for (int i = 2; i >= 0; --i) {
                    if (PointInRect(event.button.x, event.button.y, &items[i].rect)) {
                        active_index = i;
                        offset_x = event.button.x - items[i].rect.x;
                        offset_y = event.button.y - items[i].rect.y;
                        break;
                    }
                }
            }

            if (event.type == SDL_EVENT_MOUSE_BUTTON_UP &&
                event.button.button == SDL_BUTTON_LEFT) {
                active_index = -1;
            }

            if (event.type == SDL_EVENT_MOUSE_MOTION && active_index >= 0) {
                items[active_index].rect.x = event.motion.x - offset_x;
                items[active_index].rect.y = event.motion.y - offset_y;
            }
        }

        SDL_SetRenderDrawColor(renderer, 14, 20, 29, 255);
        SDL_RenderClear(renderer);

        SDL_FRect board = { 60.0f, 70.0f, 1060.0f, 580.0f };
        SDL_SetRenderDrawColor(renderer, 25, 36, 50, 255);
        SDL_RenderFillRect(renderer, &board);

        for (int i = 0; i < 3; ++i) {
            SDL_SetRenderDrawColor(renderer, items[i].color.r, items[i].color.g, items[i].color.b, 255);
            SDL_RenderFillRect(renderer, &items[i].rect);

            SDL_FRect header = { items[i].rect.x + 14.0f, items[i].rect.y + 14.0f, items[i].rect.w - 28.0f, 16.0f };
            SDL_SetRenderDrawColor(renderer, 240, 245, 250, 255);
            SDL_RenderFillRect(renderer, &header);
        }

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يميز المثال بين عنصر واحد قابل للسحب وبين layout يحتوي عدة عناصر؛ لذلك يبحث عن العنصر العلوي أولاً قبل بدء السحب.',
      'حفظ offset بين الفأرة وحافة العنصر يمنع القفز المفاجئ عند بداية الإمساك بالعنصر.',
      'هذا المثال مناسب عندما تريد تغيير موضع صور أو بطاقات أو مربعات متعددة داخل Canvas مبنية بـ SDL3.'
    ],
    expectedResult: 'يمكن للمستخدم سحب أي بطاقة من البطاقات الثلاث داخل اللوحة وتغيير موضعها بحرية، مع بقاء بقية العناصر في مواقعها الحالية حتى يتم التقاطها هي الأخرى.',
    related: [
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_BUTTON_LEFT',
      'SDL_RenderFillRect',
      'SDL_PollEvent'
    ],
    previewKind: 'drag-layout',
    previewTitle: 'معاينة لتحريك عدة عناصر داخل لوحة SDL3 بالسحب بالفأرة.'
  },
  {
    id: 'draw-lines-curves-arrows',
    packageKey: 'core',
    title: 'مثال رسم خطوط ومنحنيات وأسهم داخل Canvas في SDL3',
    goal: 'يبني هذا المثال لوحة رسم مبسطة داخل SDL3 توضح كيف ترسم خطوطًا مستقيمة ومنحنيات تربيعية وأسهمًا ومؤشرات توجيه على نفس السطح باستخدام SDL_RenderLine ونقاط مساعدة.',
    shows: 'هذا المثال SDL3 خالص. لا توجد مكتبة Canvas عالية المستوى هنا؛ التطبيق نفسه يجزّئ المنحنى إلى مقاطع صغيرة ويستدعي أوامر الرسم الأساسية.',
    headers: ['SDL3/SDL.h'],
    requirements: [
      'ترويسة SDL3 الأساسية مع math.h.',
      'المثال مناسب لمحررات المسارات والـ gizmos والـ HUD والرسومات التوضيحية داخل المشاريع.',
      'يمكن توسيع الفكرة لاحقًا إلى أسهم متعددة الرؤوس أو منحنيات Cubic أو أدوات رسم تفاعلية.'
    ],
    code: `#include <SDL3/SDL.h>
#include <math.h>

static void DrawArrow(SDL_Renderer *renderer, float x1, float y1, float x2, float y2)
{
    float angle = atan2f(y2 - y1, x2 - x1);
    float wing = 18.0f;

    SDL_RenderLine(renderer, x1, y1, x2, y2);
    SDL_RenderLine(renderer, x2, y2, x2 - cosf(angle - 0.45f) * wing, y2 - sinf(angle - 0.45f) * wing);
    SDL_RenderLine(renderer, x2, y2, x2 - cosf(angle + 0.45f) * wing, y2 - sinf(angle + 0.45f) * wing);
}

static void DrawQuadraticCurve(SDL_Renderer *renderer, SDL_FPoint p0, SDL_FPoint p1, SDL_FPoint p2)
{
    SDL_FPoint prev = p0;
    for (int i = 1; i <= 32; ++i) {
        float t = (float)i / 32.0f;
        float u = 1.0f - t;
        SDL_FPoint p = {
            u * u * p0.x + 2.0f * u * t * p1.x + t * t * p2.x,
            u * u * p0.y + 2.0f * u * t * p1.y + t * t * p2.y
        };
        SDL_RenderLine(renderer, prev.x, prev.y, p.x, p.y);
        prev = p;
    }
}

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("SDL3 primitives", 1180, 720, 0);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 13, 19, 28, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 60, 86, 116, 255);
        for (int x = 90; x <= 1090; x += 100) {
            SDL_RenderLine(renderer, (float)x, 90.0f, (float)x, 620.0f);
        }
        for (int y = 90; y <= 620; y += 88) {
            SDL_RenderLine(renderer, 90.0f, (float)y, 1090.0f, (float)y);
        }

        SDL_SetRenderDrawColor(renderer, 108, 188, 255, 255);
        SDL_RenderLine(renderer, 140.0f, 160.0f, 420.0f, 160.0f);
        SDL_RenderLine(renderer, 140.0f, 190.0f, 420.0f, 250.0f);

        SDL_SetRenderDrawColor(renderer, 255, 206, 114, 255);
        DrawArrow(renderer, 170.0f, 340.0f, 420.0f, 420.0f);

        SDL_SetRenderDrawColor(renderer, 116, 216, 172, 255);
        DrawQuadraticCurve(renderer,
            (SDL_FPoint){ 520.0f, 470.0f },
            (SDL_FPoint){ 720.0f, 190.0f },
            (SDL_FPoint){ 930.0f, 460.0f });

        SDL_SetRenderDrawColor(renderer, 240, 244, 248, 255);
        SDL_FRect p0 = { 514.0f, 464.0f, 12.0f, 12.0f };
        SDL_FRect p1 = { 714.0f, 184.0f, 12.0f, 12.0f };
        SDL_FRect p2 = { 924.0f, 454.0f, 12.0f, 12.0f };
        SDL_RenderFillRect(renderer, &p0);
        SDL_RenderFillRect(renderer, &p1);
        SDL_RenderFillRect(renderer, &p2);

        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يرسم المثال المنحنى عبر تقسيمه إلى مقاطع صغيرة، وهذا هو الأسلوب العملي المباشر عندما لا تملك SDL3 primitive جاهزًا للمنحنيات.',
      'دالة DrawArrow تبين أن السهم ليس نوعًا رسوميًا خاصًا هنا؛ بل خط رئيسي مع جناحين محسوبين زاويًا.',
      'هذا المثال يغطي الخطوط والمنحنيات والأسهم وغيرها داخل SDL3 من دون الاعتماد على GUI أو محرك رسم متقدم.'
    ],
    expectedResult: 'تظهر لوحة رسم تحتوي شبكة إرشاد، وخطوطًا مستقيمة، وسهمًا واضحًا، ومنحنى سلسًا مع نقاط تحكم مرئية، وكلها مرسومة مباشرة داخل نافذة SDL3.',
    related: [
      'SDL_RenderLine',
      'SDL_RenderFillRect',
      'SDL_SetRenderDrawColor',
      'SDL_RenderPresent',
      'SDL_PollEvent',
      'SDL_EVENT_QUIT'
    ],
    previewKind: 'primitives',
    previewTitle: 'معاينة للخطوط والمنحنيات والأسهم داخل Canvas مبنية بـ SDL3.'
  },
  {
    id: 'system-device-info',
    packageKey: 'core',
    title: 'مثال معرفة معلومات الجهاز باستخدام SDL3',
    goal: 'يجمع هذا المثال أهم معلومات الجهاز التي يحتاجها مطور SDL3 في خطوة واحدة: اسم النظام، برنامج الفيديو الحالي، عدد الأنوية المنطقية، الرام، معلومات الشاشة، ومعلومات بطاقة الرسوميات إذا كانت واجهة SDL GPU متاحة.',
    shows: 'يعرض للمستخدم بيانات النظام بالعربية داخل رسالة واضحة، ويحتفظ أيضًا بنافذة مرئية حتى ترى نتيجة المثال داخل سطح SDL3 نفسه.',
    headers: ['SDL3/SDL.h', 'SDL3/SDL_gpu.h'],
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'يعمل المثال على الأنظمة الثلاثة لأن SDL3 توفر نفس الواجهة العامة، بينما قد يختلف اسم برنامج العرض أو اسم الـ GPU بحسب المشغل الفعلي على الجهاز.',
    requirements: [
      'ترويسة SDL3 الأساسية مع SDL_gpu لقراءة اسم المشغل أو اسم بطاقة الرسوميات عندما تكون متاحة.',
      'لا يحتاج المثال إلى ملفات خارجية؛ كل البيانات تأتي من النظام نفسه وقت التشغيل.',
      'إذا تعذر إنشاء SDL_GPUDevice يبقى المثال صالحًا ويعرض بقية معلومات الجهاز ثم يشير إلى أن مسار GPU غير متاح.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3/SDL_gpu.h>
#include <stdio.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow("معلومات الجهاز - SDL3", 1180, 720, SDL_WINDOW_RESIZABLE);
    SDL_Renderer *renderer = window ? SDL_CreateRenderer(window, NULL) : NULL;
    if (!window || !renderer) {
        SDL_Log("فشل إنشاء النافذة أو SDL_Renderer: %s", SDL_GetError());
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    const char *platform_name = SDL_GetPlatform();
    const char *video_driver = SDL_GetCurrentVideoDriver();
    int logical_cores = SDL_GetNumLogicalCPUCores();
    int system_ram_mb = SDL_GetSystemRAM();

    SDL_DisplayID primary_display = SDL_GetPrimaryDisplay();
    SDL_DisplayMode desktop_mode = {0};
    if (primary_display != 0) {
        SDL_GetDesktopDisplayMode(primary_display, &desktop_mode);
    }

    int display_count = 0;
    SDL_DisplayID *displays = SDL_GetDisplays(&display_count);

    SDL_GPUDevice *gpu_device = SDL_CreateGPUDevice(
        SDL_GPU_SHADERFORMAT_SPIRV |
        SDL_GPU_SHADERFORMAT_DXIL |
        SDL_GPU_SHADERFORMAT_MSL,
        false,
        NULL
    );

    const char *gpu_driver = gpu_device ? SDL_GetGPUDeviceDriver(gpu_device) : "غير متاح";
    SDL_PropertiesID gpu_props = gpu_device ? SDL_GetGPUDeviceProperties(gpu_device) : 0;
    const char *gpu_name = gpu_props
        ? SDL_GetStringProperty(gpu_props, SDL_PROP_GPU_DEVICE_NAME_STRING, "غير معروف")
        : "غير معروف";

    char info_message[2048];
    SDL_snprintf(
        info_message,
        sizeof(info_message),
        "اسم النظام: %s\\n"
        "برنامج الفيديو: %s\\n"
        "عدد الأنوية المنطقية: %d\\n"
        "الرام: %d MB\\n"
        "عدد الشاشات: %d\\n"
        "الشاشة الأساسية: %dx%d @ %.0fHz\\n"
        "مشغل الرسوميات: %s\\n"
        "اسم كرت الشاشة: %s\\n",
        platform_name ? platform_name : "غير معروف",
        video_driver ? video_driver : "غير معروف",
        logical_cores,
        system_ram_mb,
        display_count,
        desktop_mode.w,
        desktop_mode.h,
        desktop_mode.refresh_rate,
        gpu_driver ? gpu_driver : "غير متاح",
        gpu_name ? gpu_name : "غير معروف"
    );

    SDL_ShowSimpleMessageBox(
        SDL_MESSAGEBOX_INFORMATION,
        "معلومات الجهاز",
        info_message,
        window
    );

    bool running = true;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 11, 16, 24, 255);
        SDL_RenderClear(renderer);

        SDL_SetRenderDrawColor(renderer, 36, 62, 90, 255);
        SDL_FRect header = { 40.0f, 32.0f, 1100.0f, 96.0f };
        SDL_RenderFillRect(renderer, &header);

        SDL_SetRenderDrawColor(renderer, 27, 41, 58, 255);
        SDL_FRect cpu_card = { 56.0f, 168.0f, 320.0f, 180.0f };
        SDL_FRect gpu_card = { 430.0f, 168.0f, 320.0f, 180.0f };
        SDL_FRect display_card = { 804.0f, 168.0f, 320.0f, 180.0f };
        SDL_RenderFillRect(renderer, &cpu_card);
        SDL_RenderFillRect(renderer, &gpu_card);
        SDL_RenderFillRect(renderer, &display_card);

        SDL_SetRenderDrawColor(renderer, 103, 183, 255, 255);
        SDL_FRect cpu_bar = { 74.0f, 296.0f, (float)(logical_cores * 14), 16.0f };
        SDL_RenderFillRect(renderer, &cpu_bar);

        SDL_SetRenderDrawColor(renderer, 255, 206, 114, 255);
        SDL_FRect ram_bar = { 74.0f, 322.0f, (float)(system_ram_mb / 128), 14.0f };
        SDL_RenderFillRect(renderer, &ram_bar);

        SDL_SetRenderDrawColor(renderer, 111, 216, 170, 255);
        SDL_FRect gpu_bar = { 448.0f, 322.0f, gpu_device ? 220.0f : 80.0f, 16.0f };
        SDL_RenderFillRect(renderer, &gpu_bar);

        SDL_SetRenderDrawColor(renderer, 151, 173, 198, 255);
        SDL_FRect display_bar = { 822.0f, 322.0f, (float)(desktop_mode.w / 10), 16.0f };
        SDL_RenderFillRect(renderer, &display_bar);

        SDL_RenderPresent(renderer);
    }

    SDL_free(displays);
    SDL_DestroyGPUDevice(gpu_device);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'يقرأ SDL_GetPlatform وSDL_GetCurrentVideoDriver معلومات النظام والواجهة الرسومية النشطة بدل الاعتماد على شروط منصة يدوية داخل الكود.',
      'تعطي SDL_GetNumLogicalCPUCores وSDL_GetSystemRAM بيانات سريعة عن قدرات الجهاز يمكن استخدامها في أدوات التشخيص أو شاشة الإعدادات.',
      'عند نجاح SDL_CreateGPUDevice يمكن قراءة اسم كرت الشاشة ومشغل الرسوميات من SDL_GetGPUDeviceDriver وSDL_GetGPUDeviceProperties من دون ربط المثال بواجهة منصة واحدة فقط.'
    ],
    expectedResult: 'تظهر رسالة معلومات بالعربية تحتوي اسم النظام، برنامج الفيديو، عدد الأنوية، الرام، مواصفات الشاشة الأساسية، ومعلومات GPU المتاحة. وبعد إغلاق الرسالة تبقى نافذة SDL3 تعرض لوحة مرئية تمثل الأقسام نفسها حتى يغلقها المستخدم.',
    related: [
      'SDL_GetPlatform',
      'SDL_GetCurrentVideoDriver',
      'SDL_GetNumLogicalCPUCores',
      'SDL_GetSystemRAM',
      'SDL_GetPrimaryDisplay',
      'SDL_GetDesktopDisplayMode',
      'SDL_GetDisplays',
      'SDL_CreateGPUDevice',
      'SDL_GetGPUDeviceDriver',
      'SDL_GetGPUDeviceProperties',
      'SDL_GetStringProperty',
      'SDL_PROP_GPU_DEVICE_NAME_STRING',
      'SDL_ShowSimpleMessageBox'
    ],
    previewKind: 'system-info',
    previewTitle: 'لوحة معلومات جهاز مبنية بـ SDL3 تعرض النظام والمعالج والرام والـ GPU والشاشة.'
  }
]);

const BASE_VULKAN_READY_EXAMPLES = [
  {
    id: 'sdl3-window-surface',
    title: 'مثال إنشاء نافذة Vulkan باستخدام SDL3',
    goal: 'يبني هذا المثال أول نقطة ربط عملية بين SDL3 وVulkan: نافذة تدعم Vulkan، ثم VkInstance، ثم VkSurfaceKHR صالح للعرض فوق النافذة نفسها.',
    requirements: [
      'Vulkan SDK مثبت ومربوط مع المشروع.',
      'SDL3 مفعّل مع ترويسة SDL_vulkan.',
      'يوضع هذا المثال في ملف بدء التطبيق لأنه يهيئ النافذة والمثيل والسطح معًا.'
    ],
    code: `#include <SDL3/SDL.h>
#include <SDL3/SDL_vulkan.h>
#include <vulkan/vulkan.h>

int main(void)
{
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SDL_Log("فشل SDL_Init: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *window = SDL_CreateWindow(
        "SDL3 + Vulkan Window",
        1280,
        720,
        SDL_WINDOW_VULKAN | SDL_WINDOW_RESIZABLE
    );
    if (!window) {
        SDL_Log("فشل إنشاء النافذة: %s", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    Uint32 extension_count = 0;
    char const * const *sdl_extensions = SDL_Vulkan_GetInstanceExtensions(&extension_count);

    VkApplicationInfo app_info = {};
    app_info.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
    app_info.pApplicationName = "SDL3 Vulkan Bootstrap";
    app_info.applicationVersion = VK_MAKE_API_VERSION(0, 1, 0, 0);
    app_info.pEngineName = "ArabicVulkan";
    app_info.engineVersion = VK_MAKE_API_VERSION(0, 1, 0, 0);
    app_info.apiVersion = VK_API_VERSION_1_3;

    VkInstanceCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
    create_info.pApplicationInfo = &app_info;
    create_info.enabledExtensionCount = extension_count;
    create_info.ppEnabledExtensionNames = sdl_extensions;

    VkInstance instance = VK_NULL_HANDLE;
    if (vkCreateInstance(&create_info, nullptr, &instance) != VK_SUCCESS) {
        SDL_Log("فشل vkCreateInstance");
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    VkSurfaceKHR surface = VK_NULL_HANDLE;
    if (!SDL_Vulkan_CreateSurface(window, instance, nullptr, &surface)) {
        SDL_Log("فشل SDL_Vulkan_CreateSurface: %s", SDL_GetError());
        vkDestroyInstance(instance, nullptr);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event event;
    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }
    }

    vkDestroySurfaceKHR(instance, surface, nullptr);
    vkDestroyInstance(instance, nullptr);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}`,
    highlights: [
      'تبدأ النافذة بعلم SDL_WINDOW_VULKAN حتى يسمح SDL بإنشاء سطح Vulkan فوقها بدل مسار Renderer التقليدي.',
      'ترجع SDL_Vulkan_GetInstanceExtensions الامتدادات التي يحتاجها VkInstance كي يفهم نظام النوافذ الحالي ويستطيع إنشاء VkSurfaceKHR منه.',
      'بعد نجاح SDL_Vulkan_CreateSurface يصبح لديك سطح عرض حقيقي يمكن لاحقًا فحص دعمه عند اختيار VkPhysicalDevice وبناء VkSwapchainKHR.'
    ],
    expectedResult: 'يظهر للمستخدم إطار نافذة فارغ يدعم Vulkan. داخل التطبيق تصبح VkInstance وVkSurfaceKHR جاهزتين لبقية مراحل الإعداد حتى لو لم يبدأ الرسم بعد.',
    related: [
      'VkInstance',
      'VkSurfaceKHR',
      'VkApplicationInfo',
      'VkInstanceCreateInfo',
      'vkCreateInstance',
      'vkDestroyInstance',
      'vkDestroySurfaceKHR',
      'SDL_Vulkan_GetInstanceExtensions',
      'SDL_Vulkan_CreateSurface',
      'SDL_WINDOW_VULKAN',
      'SDL_Window'
    ],
    previewKind: 'window',
    previewTitle: 'شكل نافذة SDL3 المجهزة لاستقبال سطح Vulkan.'
  },
  {
    id: 'instance-creation',
    title: 'مثال إنشاء Vulkan Instance',
    aliases: [
      'vkCreateInstance_example'
    ],
    goal: 'يركز هذا المثال على بناء VkInstance نفسه: تجميع الامتدادات المطلوبة من SDL3، إضافة طبقة التحقق عند الحاجة، ثم تمرير كل ذلك داخل VkInstanceCreateInfo بوضوح.',
    requirements: [
      'Vulkan SDK مع ترويسات Vulkan.',
      'SDL3 إذا كنت تريد ربط VkInstance بنوافذ SDL3.',
      'مترجم C++ حديث لأن المثال يستخدم std::vector لتجميع الامتدادات.'
    ],
    code: `#include <SDL3/SDL_vulkan.h>
#include <vulkan/vulkan.h>
#include <vector>

VkInstance CreateInstanceForSdl3(bool enable_validation)
{
    Uint32 sdl_extension_count = 0;
    char const * const *sdl_extensions = SDL_Vulkan_GetInstanceExtensions(&sdl_extension_count);
    std::vector<const char*> instance_extensions(
        sdl_extensions,
        sdl_extensions + sdl_extension_count
    );

    const char* validation_layers[] = {
        "VK_LAYER_KHRONOS_validation"
    };

    if (enable_validation) {
        instance_extensions.push_back(VK_EXT_DEBUG_UTILS_EXTENSION_NAME);
    }

    VkApplicationInfo app_info = {};
    app_info.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
    app_info.pApplicationName = "Instance Example";
    app_info.applicationVersion = VK_MAKE_API_VERSION(0, 1, 0, 0);
    app_info.pEngineName = "ArabicVulkan";
    app_info.engineVersion = VK_MAKE_API_VERSION(0, 1, 0, 0);
    app_info.apiVersion = VK_API_VERSION_1_3;

    VkInstanceCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
    create_info.pApplicationInfo = &app_info;
    create_info.enabledExtensionCount = static_cast<uint32_t>(instance_extensions.size());
    create_info.ppEnabledExtensionNames = instance_extensions.data();
    create_info.enabledLayerCount = enable_validation ? 1u : 0u;
    create_info.ppEnabledLayerNames = enable_validation ? validation_layers : nullptr;

    VkInstance instance = VK_NULL_HANDLE;
    VkResult result = vkCreateInstance(&create_info, nullptr, &instance);
    if (result != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    return instance;
}`,
    highlights: [
      'يعتمد المثال على SDL_Vulkan_GetInstanceExtensions بدل كتابة أسماء الامتدادات يدويًا، لأن SDL3 يعرف ما يحتاجه نظام النوافذ الحالي على هذه المنصة تحديدًا.',
      'إضافة VK_EXT_DEBUG_UTILS_EXTENSION_NAME ليست للعرض نفسه، بل لربط رسائل التحقق والتشخيص أثناء التطوير عندما تكون طبقات التحقق مفعلة.',
      'تجميع البيانات في VkApplicationInfo وVkInstanceCreateInfo هو ما يجعل vkCreateInstance يرى هوية التطبيق والنسخة المطلوبة وقائمة الامتدادات والطبقات في استدعاء واحد.'
    ],
    expectedResult: 'بعد نجاح المثال تحصل على VkInstance صالح يمثل نقطة دخول التطبيق إلى كل بقية عناصر Vulkan مثل VkSurfaceKHR وVkPhysicalDevice وVkDevice.',
    related: [
      'VkInstance',
      'VkApplicationInfo',
      'VkInstanceCreateInfo',
      'vkCreateInstance',
      'VK_EXT_DEBUG_UTILS_EXTENSION_NAME',
      'VK_API_VERSION_1_3',
      'SDL_Vulkan_GetInstanceExtensions'
    ],
    previewKind: 'instance',
    previewTitle: 'إنشاء VkInstance بعد تجهيز معلومات التطبيق وتجميع الامتدادات المطلوبة.'
  },
  {
    id: 'pick-physical-device',
    title: 'مثال اختيار Physical Device',
    aliases: [
      'vkEnumeratePhysicalDevices_example'
    ],
    goal: 'يبين هذا المثال كيف يفحص التطبيق المعالجات الرسومية المتاحة، ثم يختار VkPhysicalDevice مناسبًا يملك طابور رسوميات ودعم تقديم على السطح الحالي.',
    requirements: [
      'VkInstance منشأ مسبقًا.',
      'VkSurfaceKHR جاهز إذا كان التطبيق يحتاج العرض على نافذة.',
      'مترجم C++ مع std::vector لأن المثال يمر على الأجهزة والطوابير ديناميكيًا.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <vector>
#include <limits>

struct DeviceSelection {
    VkPhysicalDevice device = VK_NULL_HANDLE;
    uint32_t graphics_family = std::numeric_limits<uint32_t>::max();
    uint32_t present_family = std::numeric_limits<uint32_t>::max();
};

DeviceSelection PickPhysicalDevice(VkInstance instance, VkSurfaceKHR surface)
{
    uint32_t device_count = 0;
    vkEnumeratePhysicalDevices(instance, &device_count, nullptr);

    std::vector<VkPhysicalDevice> devices(device_count);
    vkEnumeratePhysicalDevices(instance, &device_count, devices.data());

    DeviceSelection selected = {};

    for (VkPhysicalDevice candidate : devices) {
        DeviceSelection current = {};
        current.device = candidate;

        uint32_t family_count = 0;
        vkGetPhysicalDeviceQueueFamilyProperties(candidate, &family_count, nullptr);
        std::vector<VkQueueFamilyProperties> families(family_count);
        vkGetPhysicalDeviceQueueFamilyProperties(candidate, &family_count, families.data());

        for (uint32_t index = 0; index < family_count; ++index) {
            if (families[index].queueFlags & VK_QUEUE_GRAPHICS_BIT) {
                current.graphics_family = index;
            }

            VkBool32 supports_present = VK_FALSE;
            vkGetPhysicalDeviceSurfaceSupportKHR(candidate, index, surface, &supports_present);
            if (supports_present) {
                current.present_family = index;
            }
        }

        VkPhysicalDeviceProperties properties = {};
        vkGetPhysicalDeviceProperties(candidate, &properties);

        const bool complete =
            current.graphics_family != std::numeric_limits<uint32_t>::max() &&
            current.present_family != std::numeric_limits<uint32_t>::max();

        if (!complete) {
            continue;
        }

        selected = current;
        if (properties.deviceType == VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU) {
            break;
        }
    }

    return selected;
}`,
    highlights: [
      'تبدأ العملية من vkEnumeratePhysicalDevices لأن VkInstance قد يرى أكثر من GPU أو محول عرض، وليس بطاقة واحدة فقط.',
      'تفحص vkGetPhysicalDeviceQueueFamilyProperties ما إذا كان الجهاز يملك عائلة طوابير تحتوي VK_QUEUE_GRAPHICS_BIT، بينما يفحص vkGetPhysicalDeviceSurfaceSupportKHR قدرة هذه العائلة على التقديم إلى السطح الحالي.',
      'قراءة VkPhysicalDeviceProperties تسمح بتفضيل جهاز منفصل عند توفره، لكن المثال لا يقبل جهازًا ناقصًا حتى لو كان أسرع؛ شرط الاكتمال الوظيفي يأتي أولًا.'
    ],
    expectedResult: 'النتيجة ليست صورة على الشاشة بعد، بل VkPhysicalDevice مختار مع فهارس الطوابير الأساسية التي سيبنى فوقها VkDevice وVkSwapchainKHR.',
    related: [
      'VkPhysicalDevice',
      'VkPhysicalDeviceProperties',
      'VkQueueFamilyProperties',
      'vkEnumeratePhysicalDevices',
      'vkGetPhysicalDeviceProperties',
      'vkGetPhysicalDeviceQueueFamilyProperties',
      'vkGetPhysicalDeviceSurfaceSupportKHR',
      'VkSurfaceKHR',
      'VK_QUEUE_GRAPHICS_BIT'
    ],
    previewKind: 'gpu',
    previewTitle: 'فحص عدة أجهزة ثم اختيار VkPhysicalDevice المناسب للتطبيق.'
  },
  {
    id: 'logical-device',
    title: 'مثال إنشاء Logical Device',
    aliases: [
      'vkCreateDevice_example',
      'vkGetDeviceQueue_example'
    ],
    goal: 'يوضح هذا المثال كيف يتحول VkPhysicalDevice المختار إلى VkDevice فعلي مع VkQueue جاهزة للرسم والتقديم.',
    requirements: [
      'VkPhysicalDevice مختار مسبقًا مع أرقام عائلات الطوابير.',
      'امتداد VK_KHR_swapchain مطلوب إذا كان التطبيق سيعرض إلى الشاشة.',
      'مترجم C++ يدعم std::set وstd::vector.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <set>
#include <vector>

struct QueueSelection {
    uint32_t graphics_family;
    uint32_t present_family;
};

VkDevice CreateLogicalDevice(
    VkPhysicalDevice physical_device,
    const QueueSelection& queues,
    VkQueue *graphics_queue,
    VkQueue *present_queue)
{
    float queue_priority = 1.0f;
    std::set<uint32_t> unique_families = {
        queues.graphics_family,
        queues.present_family
    };

    std::vector<VkDeviceQueueCreateInfo> queue_infos;
    for (uint32_t family : unique_families) {
        VkDeviceQueueCreateInfo queue_info = {};
        queue_info.sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
        queue_info.queueFamilyIndex = family;
        queue_info.queueCount = 1;
        queue_info.pQueuePriorities = &queue_priority;
        queue_infos.push_back(queue_info);
    }

    const char* device_extensions[] = {
        VK_KHR_SWAPCHAIN_EXTENSION_NAME
    };

    VkPhysicalDeviceFeatures device_features = {};

    VkDeviceCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
    create_info.queueCreateInfoCount = static_cast<uint32_t>(queue_infos.size());
    create_info.pQueueCreateInfos = queue_infos.data();
    create_info.pEnabledFeatures = &device_features;
    create_info.enabledExtensionCount = 1;
    create_info.ppEnabledExtensionNames = device_extensions;

    VkDevice device = VK_NULL_HANDLE;
    if (vkCreateDevice(physical_device, &create_info, nullptr, &device) != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    vkGetDeviceQueue(device, queues.graphics_family, 0, graphics_queue);
    vkGetDeviceQueue(device, queues.present_family, 0, present_queue);
    return device;
}`,
    highlights: [
      'تجمع VkDeviceQueueCreateInfo معلومات كل عائلة طوابير مطلوبة داخل الجهاز المنطقي، ولهذا يمر المثال أولًا على العائلات الفريدة قبل إنشاء VkDevice.',
      'وجود VK_KHR_SWAPCHAIN_EXTENSION_NAME داخل امتدادات الجهاز ليس زينة؛ بدونه لا يمكن بناء VkSwapchainKHR لاحقًا حتى لو كان السطح صالحًا.',
      'بعد نجاح vkCreateDevice يصبح vkGetDeviceQueue هو الخطوة التي تعطيك المقابض التنفيذية الفعلية التي سترسل إليها أوامر الرسم والتقديم.'
    ],
    expectedResult: 'النتيجة جهاز منطقي VkDevice مع طابور رسوميات وطابور تقديم صالحين للاستخدام في المراحل التالية من التطبيق.',
    related: [
      'VkDevice',
      'VkQueue',
      'VkDeviceQueueCreateInfo',
      'VkDeviceCreateInfo',
      'vkCreateDevice',
      'vkGetDeviceQueue',
      'VK_KHR_SWAPCHAIN_EXTENSION_NAME',
      'VkPhysicalDevice'
    ],
    previewKind: 'device',
    previewTitle: 'تحويل VkPhysicalDevice إلى VkDevice مع طوابير قابلة للاستخدام.'
  },
  {
    id: 'buffer-memory-upload',
    title: 'مثال إنشاء Buffer وربط الذاكرة',
    aliases: [
      'vkCreateBuffer_example',
      'vkAllocateMemory_example',
      'vkBindBufferMemory_example',
      'vkMapMemory_example',
      'VkBuffer_example'
    ],
    goal: 'يجمع هذا المثال الخطوات العملية لإنشاء VkBuffer، ثم حجز VkDeviceMemory مناسبة له، ثم ربطها بالمخزن وأخيرًا فتحها عبر vkMapMemory لكتابة البيانات من المعالج.',
    requirements: [
      'VkPhysicalDevice وVkDevice جاهزان مسبقًا.',
      'المثال مناسب لمسار staging buffer أو أي مورد يحتاج ذاكرة Host Visible.',
      'يحتاج مترجم C++ حديث لأنه يستخدم std::memcpy وstatic_cast.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <cstring>

uint32_t FindMemoryType(
    VkPhysicalDevice physical_device,
    uint32_t type_filter,
    VkMemoryPropertyFlags properties)
{
    VkPhysicalDeviceMemoryProperties memory_properties = {};
    vkGetPhysicalDeviceMemoryProperties(physical_device, &memory_properties);

    for (uint32_t i = 0; i < memory_properties.memoryTypeCount; ++i) {
        const bool type_matches = (type_filter & (1u << i)) != 0;
        const bool property_matches =
            (memory_properties.memoryTypes[i].propertyFlags & properties) == properties;

        if (type_matches && property_matches) {
            return i;
        }
    }

    return UINT32_MAX;
}

bool CreateUploadBuffer(
    VkPhysicalDevice physical_device,
    VkDevice device,
    VkDeviceSize size,
    VkBuffer* buffer,
    VkDeviceMemory* memory)
{
    VkBufferCreateInfo buffer_info = {};
    buffer_info.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
    buffer_info.size = size;
    buffer_info.usage = VK_BUFFER_USAGE_VERTEX_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
    buffer_info.sharingMode = VK_SHARING_MODE_EXCLUSIVE;

    if (vkCreateBuffer(device, &buffer_info, nullptr, buffer) != VK_SUCCESS) {
        return false;
    }

    VkMemoryRequirements memory_requirements = {};
    vkGetBufferMemoryRequirements(device, *buffer, &memory_requirements);

    VkMemoryAllocateInfo allocate_info = {};
    allocate_info.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
    allocate_info.allocationSize = memory_requirements.size;
    allocate_info.memoryTypeIndex = FindMemoryType(
        physical_device,
        memory_requirements.memoryTypeBits,
        VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT
    );

    if (allocate_info.memoryTypeIndex == UINT32_MAX) {
        return false;
    }

    if (vkAllocateMemory(device, &allocate_info, nullptr, memory) != VK_SUCCESS) {
        return false;
    }

    vkBindBufferMemory(device, *buffer, *memory, 0);

    void* mapped = nullptr;
    if (vkMapMemory(device, *memory, 0, size, 0, &mapped) != VK_SUCCESS) {
        return false;
    }

    const float triangle_vertices[] = {
        0.0f, -0.5f,
        0.5f,  0.5f,
       -0.5f,  0.5f
    };
    std::memcpy(mapped, triangle_vertices, sizeof(triangle_vertices));
    vkUnmapMemory(device, *memory);
    return true;
}`,
    highlights: [
      'يبدأ المسار من vkCreateBuffer فقط لإنشاء الغلاف المنطقي للمورد؛ هذا لا يعني أن الذاكرة الفعلية أصبحت مرتبطة به تلقائيًا.',
      'تقرأ vkGetBufferMemoryRequirements المتطلبات الحقيقية من المشغل، ثم تختار FindMemoryType نوع الذاكرة المناسب قبل استدعاء vkAllocateMemory.',
      'بعد vkBindBufferMemory يصبح المورد قابلًا للاستخدام، ثم يسمح vkMapMemory بكتابة البيانات من جهة المضيف داخل الذاكرة المرتبطة بالمخزن.'
    ],
    expectedResult: 'ينتهي المثال بمخزن VkBuffer مرتبط بذاكرة مضيفة قابلة للكتابة، ويمكن استخدامه لاحقًا كـ staging buffer أو كمخزن بيانات بسيط داخل التطبيق.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'VkMemoryRequirements',
      'VkMemoryAllocateInfo',
      'vkCreateBuffer',
      'vkAllocateMemory',
      'vkBindBufferMemory',
      'vkMapMemory',
      'vkUnmapMemory',
      'vkGetBufferMemoryRequirements',
      'vkGetPhysicalDeviceMemoryProperties',
      'VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT',
      'VK_MEMORY_PROPERTY_HOST_COHERENT_BIT'
    ],
    previewKind: 'buffer',
    previewTitle: 'مخطط يوضح إنشاء VkBuffer ثم حجز الذاكرة وربطها وفتحها للنسخ.'
  },
  {
    id: 'swapchain',
    title: 'مثال إنشاء Swapchain',
    aliases: [
      'vkCreateSwapchainKHR_example',
      'VkSwapchainKHR_example'
    ],
    goal: 'يعرض هذا المثال التسلسل العملي الكامل لاختيار Format وPresent Mode وExtent ثم إنشاء VkSwapchainKHR وجلب صورها.',
    requirements: [
      'VkPhysicalDevice وVkDevice وVkSurfaceKHR جاهزة مسبقًا.',
      'امتداد VK_KHR_swapchain مفعّل على الجهاز المنطقي.',
      'مترجم C++ مع std::vector وstd::algorithm.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <algorithm>
#include <vector>

struct SwapchainSupportDetails {
    VkSurfaceCapabilitiesKHR capabilities = {};
    std::vector<VkSurfaceFormatKHR> formats;
    std::vector<VkPresentModeKHR> present_modes;
};

SwapchainSupportDetails QuerySwapchainSupport(VkPhysicalDevice device, VkSurfaceKHR surface)
{
    SwapchainSupportDetails details = {};

    vkGetPhysicalDeviceSurfaceCapabilitiesKHR(device, surface, &details.capabilities);

    uint32_t format_count = 0;
    vkGetPhysicalDeviceSurfaceFormatsKHR(device, surface, &format_count, nullptr);
    details.formats.resize(format_count);
    vkGetPhysicalDeviceSurfaceFormatsKHR(device, surface, &format_count, details.formats.data());

    uint32_t present_mode_count = 0;
    vkGetPhysicalDeviceSurfacePresentModesKHR(device, surface, &present_mode_count, nullptr);
    details.present_modes.resize(present_mode_count);
    vkGetPhysicalDeviceSurfacePresentModesKHR(device, surface, &present_mode_count, details.present_modes.data());

    return details;
}

VkSurfaceFormatKHR ChooseSurfaceFormat(const std::vector<VkSurfaceFormatKHR>& formats)
{
    for (const VkSurfaceFormatKHR& format : formats) {
        if (format.format == VK_FORMAT_B8G8R8A8_UNORM &&
            format.colorSpace == VK_COLOR_SPACE_SRGB_NONLINEAR_KHR) {
            return format;
        }
    }
    return formats[0];
}

VkPresentModeKHR ChoosePresentMode(const std::vector<VkPresentModeKHR>& modes)
{
    for (VkPresentModeKHR mode : modes) {
        if (mode == VK_PRESENT_MODE_MAILBOX_KHR) {
            return mode;
        }
    }
    return VK_PRESENT_MODE_FIFO_KHR;
}

VkSwapchainKHR CreateSwapchain(
    VkPhysicalDevice physical_device,
    VkDevice device,
    VkSurfaceKHR surface,
    uint32_t graphics_family,
    uint32_t present_family,
    VkExtent2D window_extent,
    std::vector<VkImage>* images)
{
    SwapchainSupportDetails support = QuerySwapchainSupport(physical_device, surface);
    VkSurfaceFormatKHR surface_format = ChooseSurfaceFormat(support.formats);
    VkPresentModeKHR present_mode = ChoosePresentMode(support.present_modes);

    VkExtent2D extent = support.capabilities.currentExtent;
    if (extent.width == UINT32_MAX) {
        extent.width = std::max(support.capabilities.minImageExtent.width,
                                std::min(support.capabilities.maxImageExtent.width, window_extent.width));
        extent.height = std::max(support.capabilities.minImageExtent.height,
                                 std::min(support.capabilities.maxImageExtent.height, window_extent.height));
    }

    uint32_t image_count = support.capabilities.minImageCount + 1;
    if (support.capabilities.maxImageCount > 0 &&
        image_count > support.capabilities.maxImageCount) {
        image_count = support.capabilities.maxImageCount;
    }

    uint32_t queue_family_indices[] = { graphics_family, present_family };

    VkSwapchainCreateInfoKHR create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_SWAPCHAIN_CREATE_INFO_KHR;
    create_info.surface = surface;
    create_info.minImageCount = image_count;
    create_info.imageFormat = surface_format.format;
    create_info.imageColorSpace = surface_format.colorSpace;
    create_info.imageExtent = extent;
    create_info.imageArrayLayers = 1;
    create_info.imageUsage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT;
    create_info.preTransform = support.capabilities.currentTransform;
    create_info.compositeAlpha = VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR;
    create_info.presentMode = present_mode;
    create_info.clipped = VK_TRUE;

    if (graphics_family != present_family) {
        create_info.imageSharingMode = VK_SHARING_MODE_CONCURRENT;
        create_info.queueFamilyIndexCount = 2;
        create_info.pQueueFamilyIndices = queue_family_indices;
    } else {
        create_info.imageSharingMode = VK_SHARING_MODE_EXCLUSIVE;
    }

    VkSwapchainKHR swapchain = VK_NULL_HANDLE;
    if (vkCreateSwapchainKHR(device, &create_info, nullptr, &swapchain) != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    vkGetSwapchainImagesKHR(device, swapchain, &image_count, nullptr);
    images->resize(image_count);
    vkGetSwapchainImagesKHR(device, swapchain, &image_count, images->data());
    return swapchain;
}`,
    highlights: [
      'تقرأ QuerySwapchainSupport قدرات السطح الحقيقية من المشغل بدل افتراض أن كل Format أو Present Mode متاح على كل منصة.',
      'اختيار VK_PRESENT_MODE_MAILBOX_KHR يعطي أقل تأخير عندما يكون متاحًا، لكن المثال يعود إلى VK_PRESENT_MODE_FIFO_KHR لأنه الوضع المضمون وجوده في المواصفة.',
      'بعد vkCreateSwapchainKHR لا تكفي معرفة أن السلسلة أُنشئت؛ يجب طلب الصور الفعلية عبر vkGetSwapchainImagesKHR لأن هذه الصور هي هدف الرسم والتقديم لاحقًا.'
    ],
    expectedResult: 'لا يظهر رسم نهائي بعد، لكن التطبيق يملك VkSwapchainKHR وصورها وأبعادها الفعلية، وهي الموارد التي سيبني فوقها VkImageView وVkFramebuffer ومسار التقديم.',
    related: [
      'VkSwapchainKHR',
      'VkSurfaceFormatKHR',
      'VkPresentModeKHR',
      'VkSwapchainCreateInfoKHR',
      'vkCreateSwapchainKHR',
      'vkGetSwapchainImagesKHR',
      'vkGetPhysicalDeviceSurfaceCapabilitiesKHR',
      'vkGetPhysicalDeviceSurfaceFormatsKHR',
      'vkGetPhysicalDeviceSurfacePresentModesKHR'
    ],
    previewKind: 'swapchain',
    previewTitle: 'اختيار إعدادات VkSwapchainKHR ثم استرجاع صور السلسلة الفعلية الجاهزة للرسم.'
  },
  {
    id: 'render-pass',
    title: 'مثال إنشاء Render Pass',
    aliases: [
      'vkCreateRenderPass_example',
      'VkRenderPass_example'
    ],
    goal: 'يشرح هذا المثال كيف يعرّف التطبيق VkRenderPass بسيطًا لمرفق لوني واحد يقرأه الرسم ثم يقدَّم إلى الشاشة.',
    requirements: [
      'VkDevice جاهز.',
      'Format الصورة المختار من Swapchain معروف مسبقًا.',
      'المثال مناسب لبداية مسار الرسوميات قبل الانتقال إلى Subpasses أكثر تعقيدًا.'
    ],
    code: `#include <vulkan/vulkan.h>

VkRenderPass CreateRenderPass(VkDevice device, VkFormat swapchain_format)
{
    VkAttachmentDescription color_attachment = {};
    color_attachment.format = swapchain_format;
    color_attachment.samples = VK_SAMPLE_COUNT_1_BIT;
    color_attachment.loadOp = VK_ATTACHMENT_LOAD_OP_CLEAR;
    color_attachment.storeOp = VK_ATTACHMENT_STORE_OP_STORE;
    color_attachment.stencilLoadOp = VK_ATTACHMENT_LOAD_OP_DONT_CARE;
    color_attachment.stencilStoreOp = VK_ATTACHMENT_STORE_OP_DONT_CARE;
    color_attachment.initialLayout = VK_IMAGE_LAYOUT_UNDEFINED;
    color_attachment.finalLayout = VK_IMAGE_LAYOUT_PRESENT_SRC_KHR;

    VkAttachmentReference color_reference = {};
    color_reference.attachment = 0;
    color_reference.layout = VK_IMAGE_LAYOUT_COLOR_ATTACHMENT_OPTIMAL;

    VkSubpassDescription subpass = {};
    subpass.pipelineBindPoint = VK_PIPELINE_BIND_POINT_GRAPHICS;
    subpass.colorAttachmentCount = 1;
    subpass.pColorAttachments = &color_reference;

    VkSubpassDependency dependency = {};
    dependency.srcSubpass = VK_SUBPASS_EXTERNAL;
    dependency.dstSubpass = 0;
    dependency.srcStageMask = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    dependency.dstStageMask = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;
    dependency.dstAccessMask = VK_ACCESS_COLOR_ATTACHMENT_WRITE_BIT;

    VkRenderPassCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_CREATE_INFO;
    create_info.attachmentCount = 1;
    create_info.pAttachments = &color_attachment;
    create_info.subpassCount = 1;
    create_info.pSubpasses = &subpass;
    create_info.dependencyCount = 1;
    create_info.pDependencies = &dependency;

    VkRenderPass render_pass = VK_NULL_HANDLE;
    if (vkCreateRenderPass(device, &create_info, nullptr, &render_pass) != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    return render_pass;
}`,
    highlights: [
      'يحدد VkAttachmentDescription شكل الصورة التي سيديرها Render Pass: من أين تبدأ، وكيف تُحمَّل، وماذا يبقى منها بعد نهاية المرور.',
      'يربط VkAttachmentReference بين المرفق المعلن وSubpass الفعلي، وبذلك يعرف خط الأنابيب أين يكتب ناتجه اللوني أثناء الرسم.',
      'تجعل VkSubpassDependency الانتقال من الخارج إلى Subpass الرسم واضحًا، بحيث لا يبدأ مسار الكتابة على المرفق اللوني قبل أن تصبح المرحلة المناسبة جاهزة.'
    ],
    expectedResult: 'لا ترى صورة نهائية بعد، لكن VkRenderPass الناتج يحدد العقد الرسمي الذي سيستخدمه VkPipeline وVkFramebuffer ومسجّل الأوامر أثناء الرسم.',
    related: [
      'VkFormat',
      'VkRenderPass',
      'VkAttachmentDescription',
      'VkAttachmentReference',
      'VkSubpassDescription',
      'VkSubpassDependency',
      'VkRenderPassCreateInfo',
      'vkCreateRenderPass',
      'VK_IMAGE_LAYOUT_PRESENT_SRC_KHR'
    ],
    previewKind: 'renderpass',
    previewTitle: 'العلاقة بين Attachment وSubpass داخل VkRenderPass بسيط.'
  },
  {
    id: 'graphics-pipeline',
    title: 'مثال إنشاء Graphics Pipeline',
    aliases: [
      'vkCreateShaderModule_example',
      'vkCreatePipelineLayout_example',
      'vkCreateGraphicsPipelines_example',
      'VkPipeline_example',
      'VkShaderModule_example'
    ],
    goal: 'يجمع هذا المثال المراحل الرئيسية لإنشاء VkPipeline رسومي: Shader Modules، Pipeline Layout، الحالات الثابتة، ثم vkCreateGraphicsPipelines.',
    requirements: [
      'ملفا SPIR-V صالحان مثل triangle.vert.spv وtriangle.frag.spv.',
      'VkDevice وVkRenderPass وExtent صالحون مسبقًا.',
      'مترجم C++ مع دعم <vector> و<fstream> لقراءة ملفات الشيدر.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <fstream>
#include <vector>

std::vector<char> ReadFile(const char* path)
{
    std::ifstream file(path, std::ios::ate | std::ios::binary);
    const size_t size = static_cast<size_t>(file.tellg());
    std::vector<char> buffer(size);
    file.seekg(0);
    file.read(buffer.data(), static_cast<std::streamsize>(size));
    return buffer;
}

VkShaderModule CreateShaderModule(VkDevice device, const std::vector<char>& code)
{
    VkShaderModuleCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
    create_info.codeSize = code.size();
    create_info.pCode = reinterpret_cast<const uint32_t*>(code.data());

    VkShaderModule shader_module = VK_NULL_HANDLE;
    vkCreateShaderModule(device, &create_info, nullptr, &shader_module);
    return shader_module;
}

VkPipeline CreateGraphicsPipeline(
    VkDevice device,
    VkExtent2D extent,
    VkRenderPass render_pass,
    VkPipelineLayout* pipeline_layout)
{
    const std::vector<char> vert_code = ReadFile("shaders/triangle.vert.spv");
    const std::vector<char> frag_code = ReadFile("shaders/triangle.frag.spv");

    VkShaderModule vert_module = CreateShaderModule(device, vert_code);
    VkShaderModule frag_module = CreateShaderModule(device, frag_code);

    VkPipelineShaderStageCreateInfo vert_stage = {};
    vert_stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    vert_stage.stage = VK_SHADER_STAGE_VERTEX_BIT;
    vert_stage.module = vert_module;
    vert_stage.pName = "main";

    VkPipelineShaderStageCreateInfo frag_stage = {};
    frag_stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    frag_stage.stage = VK_SHADER_STAGE_FRAGMENT_BIT;
    frag_stage.module = frag_module;
    frag_stage.pName = "main";

    VkPipelineShaderStageCreateInfo shader_stages[] = { vert_stage, frag_stage };

    VkPipelineVertexInputStateCreateInfo vertex_input = {};
    vertex_input.sType = VK_STRUCTURE_TYPE_PIPELINE_VERTEX_INPUT_STATE_CREATE_INFO;

    VkPipelineInputAssemblyStateCreateInfo input_assembly = {};
    input_assembly.sType = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO;
    input_assembly.topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;

    VkViewport viewport = {};
    viewport.width = static_cast<float>(extent.width);
    viewport.height = static_cast<float>(extent.height);
    viewport.maxDepth = 1.0f;

    VkRect2D scissor = {};
    scissor.extent = extent;

    VkPipelineViewportStateCreateInfo viewport_state = {};
    viewport_state.sType = VK_STRUCTURE_TYPE_PIPELINE_VIEWPORT_STATE_CREATE_INFO;
    viewport_state.viewportCount = 1;
    viewport_state.pViewports = &viewport;
    viewport_state.scissorCount = 1;
    viewport_state.pScissors = &scissor;

    VkPipelineRasterizationStateCreateInfo rasterizer = {};
    rasterizer.sType = VK_STRUCTURE_TYPE_PIPELINE_RASTERIZATION_STATE_CREATE_INFO;
    rasterizer.polygonMode = VK_POLYGON_MODE_FILL;
    rasterizer.lineWidth = 1.0f;
    rasterizer.cullMode = VK_CULL_MODE_BACK_BIT;
    rasterizer.frontFace = VK_FRONT_FACE_COUNTER_CLOCKWISE;

    VkPipelineMultisampleStateCreateInfo multisampling = {};
    multisampling.sType = VK_STRUCTURE_TYPE_PIPELINE_MULTISAMPLE_STATE_CREATE_INFO;
    multisampling.rasterizationSamples = VK_SAMPLE_COUNT_1_BIT;

    VkPipelineColorBlendAttachmentState color_blend_attachment = {};
    color_blend_attachment.colorWriteMask =
        VK_COLOR_COMPONENT_R_BIT |
        VK_COLOR_COMPONENT_G_BIT |
        VK_COLOR_COMPONENT_B_BIT |
        VK_COLOR_COMPONENT_A_BIT;

    VkPipelineColorBlendStateCreateInfo color_blending = {};
    color_blending.sType = VK_STRUCTURE_TYPE_PIPELINE_COLOR_BLEND_STATE_CREATE_INFO;
    color_blending.attachmentCount = 1;
    color_blending.pAttachments = &color_blend_attachment;

    VkPipelineLayoutCreateInfo layout_info = {};
    layout_info.sType = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO;
    vkCreatePipelineLayout(device, &layout_info, nullptr, pipeline_layout);

    VkGraphicsPipelineCreateInfo pipeline_info = {};
    pipeline_info.sType = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
    pipeline_info.stageCount = 2;
    pipeline_info.pStages = shader_stages;
    pipeline_info.pVertexInputState = &vertex_input;
    pipeline_info.pInputAssemblyState = &input_assembly;
    pipeline_info.pViewportState = &viewport_state;
    pipeline_info.pRasterizationState = &rasterizer;
    pipeline_info.pMultisampleState = &multisampling;
    pipeline_info.pColorBlendState = &color_blending;
    pipeline_info.layout = *pipeline_layout;
    pipeline_info.renderPass = render_pass;
    pipeline_info.subpass = 0;

    VkPipeline pipeline = VK_NULL_HANDLE;
    vkCreateGraphicsPipelines(
        device,
        VK_NULL_HANDLE,
        1,
        &pipeline_info,
        nullptr,
        &pipeline
    );

    vkDestroyShaderModule(device, frag_module, nullptr);
    vkDestroyShaderModule(device, vert_module, nullptr);
    return pipeline;
}`,
    highlights: [
      'تبدأ العملية من ملفات SPIR-V لأن VkPipeline لا يقرأ شيفرة GLSL الخام، بل يعتمد على VkShaderModule المبني من التمثيل الوسيط الجاهز للمشغل.',
      'تجمع VkGraphicsPipelineCreateInfo كل حالات خط الأنابيب الثابتة في مكان واحد: المراحل البرمجية، التجميع، القص، التنقيط، والدمج اللوني.',
      'وجود VkPipelineLayout قبل vkCreateGraphicsPipelines ضروري لأن التخطيط يحدد كيف سترتبط الواصفات وPush Constants مع الشيدر داخل هذا الخط.'
    ],
    expectedResult: 'لا يظهر شيء على الشاشة مباشرة، لكنك تحصل على VkPipeline رسومي جاهز للربط داخل VkCommandBuffer أثناء رسم الإطار.',
    related: [
      'VkPipeline',
      'VkPipelineLayout',
      'VkShaderModule',
      'VkGraphicsPipelineCreateInfo',
      'VkPipelineShaderStageCreateInfo',
      'vkCreateShaderModule',
      'vkCreatePipelineLayout',
      'vkCreateGraphicsPipelines',
      'VkRenderPass'
    ],
    previewKind: 'pipeline',
    previewTitle: 'تجميع مراحل الشيدر والحالات الثابتة داخل Graphics Pipeline.'
  },
  {
    id: 'frame-rendering',
    title: 'مثال رسم إطار Frame Rendering',
    aliases: [
      'vkCreateCommandPool_example',
      'vkAllocateCommandBuffers_example',
      'vkBeginCommandBuffer_example',
      'vkEndCommandBuffer_example',
      'vkQueueSubmit_example',
      'vkCreateFramebuffer_example',
      'vkCmdBeginRenderPass_example',
      'vkCmdBindPipeline_example',
      'vkCmdDraw_example',
      'vkCmdEndRenderPass_example',
      'vkAcquireNextImageKHR_example',
      'vkQueuePresentKHR_example',
      'VkCommandBuffer_example',
      'VkFramebuffer_example',
      'VkSemaphore_example',
      'VkFence_example'
    ],
    goal: 'يوضح هذا المثال التسلسل الفعلي لإطار واحد: انتظار المزامنة، اكتساب صورة من Swapchain، تسجيل الأوامر، الإرسال إلى الطابور، ثم تقديم الصورة.',
    requirements: [
      'VkDevice وVkSwapchainKHR وVkRenderPass وVkPipeline وVkFramebuffer مهيأة مسبقًا.',
      'Semaphores وFence وCommand Buffer جاهزة للإطار الحالي.',
      'هذا المثال يمثل قلب الحلقة الرسومية الفعلية في تطبيق Vulkan.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <vector>

struct FrameContext {
    VkDevice device;
    VkSwapchainKHR swapchain;
    VkRenderPass render_pass;
    VkExtent2D extent;
    VkPipeline pipeline;
    VkQueue graphics_queue;
    VkQueue present_queue;
    VkSemaphore image_available;
    VkSemaphore render_finished;
    VkFence in_flight_fence;
    VkCommandBuffer command_buffer;
    std::vector<VkFramebuffer> framebuffers;
};

void DrawFrame(FrameContext& frame)
{
    vkWaitForFences(frame.device, 1, &frame.in_flight_fence, VK_TRUE, UINT64_MAX);

    uint32_t image_index = 0;
    VkResult acquire_result = vkAcquireNextImageKHR(
        frame.device,
        frame.swapchain,
        UINT64_MAX,
        frame.image_available,
        VK_NULL_HANDLE,
        &image_index
    );

    if (acquire_result == VK_ERROR_OUT_OF_DATE_KHR) {
        return;
    }

    vkResetFences(frame.device, 1, &frame.in_flight_fence);
    vkResetCommandBuffer(frame.command_buffer, 0);

    VkCommandBufferBeginInfo begin_info = {};
    begin_info.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    vkBeginCommandBuffer(frame.command_buffer, &begin_info);

    VkClearValue clear_value = {};
    clear_value.color = {{ 0.08f, 0.09f, 0.12f, 1.0f }};

    VkRenderPassBeginInfo render_pass_info = {};
    render_pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    render_pass_info.renderPass = frame.render_pass;
    render_pass_info.framebuffer = frame.framebuffers[image_index];
    render_pass_info.renderArea.extent = frame.extent;
    render_pass_info.clearValueCount = 1;
    render_pass_info.pClearValues = &clear_value;

    vkCmdBeginRenderPass(frame.command_buffer, &render_pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(frame.command_buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, frame.pipeline);
    vkCmdDraw(frame.command_buffer, 3, 1, 0, 0);
    vkCmdEndRenderPass(frame.command_buffer);
    vkEndCommandBuffer(frame.command_buffer);

    VkPipelineStageFlags wait_stage = VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT;

    VkSubmitInfo submit_info = {};
    submit_info.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;
    submit_info.waitSemaphoreCount = 1;
    submit_info.pWaitSemaphores = &frame.image_available;
    submit_info.pWaitDstStageMask = &wait_stage;
    submit_info.commandBufferCount = 1;
    submit_info.pCommandBuffers = &frame.command_buffer;
    submit_info.signalSemaphoreCount = 1;
    submit_info.pSignalSemaphores = &frame.render_finished;

    vkQueueSubmit(frame.graphics_queue, 1, &submit_info, frame.in_flight_fence);

    VkPresentInfoKHR present_info = {};
    present_info.sType = VK_STRUCTURE_TYPE_PRESENT_INFO_KHR;
    present_info.waitSemaphoreCount = 1;
    present_info.pWaitSemaphores = &frame.render_finished;
    present_info.swapchainCount = 1;
    present_info.pSwapchains = &frame.swapchain;
    present_info.pImageIndices = &image_index;

    vkQueuePresentKHR(frame.present_queue, &present_info);
}`,
    highlights: [
      'يبدأ الإطار من vkWaitForFences لأن التطبيق لا يستطيع الكتابة فوق موارد لا يزال الإطار السابق يستخدمها على الجهاز.',
      'يربط vkAcquireNextImageKHR الرسم بصورة فعلية من VkSwapchainKHR، لذلك لا يبدأ تسجيل الأوامر لفراغ مجهول بل لصورة محددة ستقدَّم لاحقًا.',
      'يجمع vkQueueSubmit وvkQueuePresentKHR مرحلتي التنفيذ والعرض: الأولى تدفع العمل إلى VkQueue الرسومية، والثانية تسلّم الصورة الناتجة إلى محرك العرض.'
    ],
    expectedResult: 'عند اكتمال بقية الموارد سيؤدي هذا التسلسل إلى تنظيف الإطار، رسم محتوى بسيط مثل مثلث، ثم تقديمه على الشاشة في كل دورة من الحلقة الرئيسية.',
    related: [
      'VkResult',
      'VkPipelineStageFlagBits',
      'VkAccessFlagBits',
      'VkCommandBuffer',
      'VkSubmitInfo',
      'VkPresentInfoKHR',
      'vkAcquireNextImageKHR',
      'vkBeginCommandBuffer',
      'vkCmdBeginRenderPass',
      'vkCmdBindPipeline',
      'vkCmdDraw',
      'vkEndCommandBuffer',
      'vkQueueSubmit',
      'vkQueuePresentKHR',
      'VkFramebuffer'
    ],
    previewKind: 'frame',
    previewTitle: 'المسار التنفيذي لإطار واحد من الاكتساب حتى التقديم.'
  },
  {
    id: 'imgui-integration',
    title: 'مثال دمج ImGui مع Vulkan',
    goal: 'يبين هذا المثال كيف يضيف التطبيق طبقة أدوات Dear ImGui فوق مسار Vulkan القائم، بحيث تعرض الأزرار والقوائم والعناصر التفاعلية داخل نفس نافذة العرض.',
    requirements: [
      'Dear ImGui مع backends الخاصة بـ SDL3 وVulkan.',
      'VkInstance وVkPhysicalDevice وVkDevice وVkRenderPass وVkQueue جاهزة مسبقًا.',
      'Descriptor Pool مستقل لـ ImGui لأن backend يحتاج أوصافًا وموارد خاصة به.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>

VkDescriptorPool CreateImGuiDescriptorPool(VkDevice device)
{
    VkDescriptorPoolSize pool_sizes[] = {
        { VK_DESCRIPTOR_TYPE_SAMPLER, 64 },
        { VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER, 64 },
        { VK_DESCRIPTOR_TYPE_SAMPLED_IMAGE, 64 },
        { VK_DESCRIPTOR_TYPE_STORAGE_IMAGE, 64 },
        { VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER, 64 },
        { VK_DESCRIPTOR_TYPE_STORAGE_BUFFER, 64 }
    };

    VkDescriptorPoolCreateInfo pool_info = {};
    pool_info.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO;
    pool_info.flags = VK_DESCRIPTOR_POOL_CREATE_FREE_DESCRIPTOR_SET_BIT;
    pool_info.maxSets = 64 * IM_ARRAYSIZE(pool_sizes);
    pool_info.poolSizeCount = IM_ARRAYSIZE(pool_sizes);
    pool_info.pPoolSizes = pool_sizes;

    VkDescriptorPool pool = VK_NULL_HANDLE;
    vkCreateDescriptorPool(device, &pool_info, nullptr, &pool);
    return pool;
}

void InitImGuiForVulkan(
    SDL_Window *window,
    VkInstance instance,
    VkPhysicalDevice physical_device,
    VkDevice device,
    uint32_t graphics_family,
    VkQueue graphics_queue,
    VkRenderPass render_pass,
    uint32_t image_count)
{
    VkDescriptorPool imgui_pool = CreateImGuiDescriptorPool(device);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui::StyleColorsDark();
    ImGui_ImplSDL3_InitForVulkan(window);

    ImGui_ImplVulkan_InitInfo init_info = {};
    init_info.Instance = instance;
    init_info.PhysicalDevice = physical_device;
    init_info.Device = device;
    init_info.QueueFamily = graphics_family;
    init_info.Queue = graphics_queue;
    init_info.DescriptorPool = imgui_pool;
    init_info.MinImageCount = image_count;
    init_info.ImageCount = image_count;
    init_info.MSAASamples = VK_SAMPLE_COUNT_1_BIT;

    ImGui_ImplVulkan_Init(&init_info, render_pass);
}

void RecordImGuiTools(VkCommandBuffer command_buffer)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGui::Begin("Tools");
    static bool show_grid = true;
    static float exposure = 1.0f;
    ImGui::Checkbox("Show Grid", &show_grid);
    ImGui::SliderFloat("Exposure", &exposure, 0.1f, 4.0f);
    if (ImGui::Button("Rebuild Pipeline")) {
        // ضع منطق إعادة البناء أو إعادة التحميل هنا
    }
    ImGui::End();

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'تحتاج Dear ImGui في Vulkan إلى VkDescriptorPool مستقل لأن backend يولد أوصافًا وموارد خاصة بعناصر الواجهة والخطوط والقوامات الداخلية.',
      'يُنفذ InitImGuiForVulkan مرة واحدة بعد اكتمال VkRenderPass وVkDevice، بينما تعمل RecordImGuiTools داخل كل إطار قبل إنهاء تسجيل VkCommandBuffer.',
      'تمثل ImGui::Checkbox وImGui::SliderFloat وImGui::Button طبقة واجهة فعلية فوق الرسم؛ النتيجة ليست شرحًا نظريًا، بل أوامر GUI تسجل وتُرسم داخل نفس الإطار المقدم من Vulkan.'
    ],
    expectedResult: 'يظهر فوق مشهد Vulkan صندوق أدوات Dear ImGui يحتوي على عنصر Checkbox ومنزلق وزر، ويمكن للمستخدم التفاعل معها داخل نفس النافذة الرسومية.',
    related: [
      'VkDescriptorPool',
      'VkDescriptorPoolCreateInfo',
      'VkRenderPass',
      'VkCommandBuffer',
      'VkDevice',
      'VkInstance',
      'VkPhysicalDevice'
    ],
    previewKind: 'imgui',
    previewTitle: 'واجهة أدوات Dear ImGui مرسومة فوق نافذة Vulkan.'
  },
  {
    id: 'imgui-editor-shell-panels',
    title: 'مثال واجهة محرر فوق Vulkan مع MenuBar وScene وProperties وColor Panels',
    goal: 'يبني هذا المثال غلاف محرر فعلي فوق Vulkan: نافذة رئيسية مع MenuBar، ولوحة Scene، ولوحة Properties، ولوحة ألوان منفصلة، بحيث يرى المستخدم واجهة أدوات كاملة داخل نفس نافذة العرض الرسومي.',
    requirements: [
      'Dear ImGui مع backends الخاصة بـ SDL3 وVulkan.',
      'VkDevice وVkRenderPass وVkCommandBuffer وVkDescriptorPool جاهزة قبل تسجيل الواجهة.',
      'هذا المثال يوضع داخل مرحلة تسجيل الإطار لأنه يبني الواجهة ويرسمها فعليًا فوق Vulkan في كل Frame.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>

struct EditorShellState {
    bool show_scene = true;
    bool show_properties = true;
    bool show_colors = true;
    int selected_entity = 0;
    float position[3] = { 0.0f, 1.4f, -4.0f };
    float tint[4] = { 0.24f, 0.56f, 0.96f, 1.0f };
    float exposure = 1.0f;
};

void RecordEditorShellUi(VkCommandBuffer command_buffer, EditorShellState* ui)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGui::Begin("Editor Shell", nullptr, ImGuiWindowFlags_MenuBar);
    if (ImGui::BeginMenuBar()) {
        if (ImGui::BeginMenu("File")) {
            ImGui::MenuItem("Open Project");
            ImGui::MenuItem("Save");
            ImGui::MenuItem("Save As");
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("View")) {
            ImGui::MenuItem("Scene Panel", nullptr, &ui->show_scene);
            ImGui::MenuItem("Properties", nullptr, &ui->show_properties);
            ImGui::MenuItem("Color Panel", nullptr, &ui->show_colors);
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Tools")) {
            ImGui::MenuItem("Rebuild Pipeline");
            ImGui::MenuItem("Reload Textures");
            ImGui::EndMenu();
        }
        ImGui::EndMenuBar();
    }
    ImGui::Text("Vulkan frame is active and Dear ImGui is layered on top of it.");
    ImGui::End();

    if (ui->show_scene) {
        static const char* scene_items[] = {
            "Camera",
            "SunLight",
            "Player.mesh",
            "SmokeEmitter"
        };
        ImGui::Begin("Scene Panel");
        for (int i = 0; i < IM_ARRAYSIZE(scene_items); ++i) {
            ImGui::Selectable(scene_items[i], ui->selected_entity == i);
            if (ImGui::IsItemClicked()) {
                ui->selected_entity = i;
            }
        }
        ImGui::End();
    }

    if (ui->show_properties) {
        ImGui::Begin("Properties Panel");
        ImGui::DragFloat3("Position", ui->position, 0.05f);
        ImGui::SliderFloat("Exposure", &ui->exposure, 0.1f, 4.0f);
        ImGui::Text("Selected entity index: %d", ui->selected_entity);
        ImGui::End();
    }

    if (ui->show_colors) {
        ImGui::Begin("Color Panel");
        ImGui::ColorEdit4("Tint", ui->tint);
        ImGui::ColorButton("Current Tint", ImVec4(ui->tint[0], ui->tint[1], ui->tint[2], ui->tint[3]));
        ImGui::Text("The same tint can feed a mapped UBO or push constants.");
        ImGui::End();
    }

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'هذا ليس مثال ImGui نظريًا فقط؛ بل غلاف محرر حقيقي فوق نافذة Vulkan يوزع الأدوات بين MenuBar ولوحات Scene وProperties وColor Panel في نفس الإطار.',
      'تُحفظ الحالة في EditorShellState بين الإطارات، ثم تقرأها الواجهة وتحدثها، ويمكن في الطبقة نفسها تمرير tint أو position إلى Uniform Buffer أو Push Constants.',
      'استدعاء ImGui_ImplVulkan_RenderDrawData داخل VkCommandBuffer هو ما يجعل هذه الأدوات جزءًا من خرج Vulkan الفعلي لا نافذة منفصلة خارج المسار الرسومي.'
    ],
    expectedResult: 'يرى المستخدم واجهة محرر عملية داخل نافذة Vulkan نفسها: شريط قوائم، لوحة مشهد، خصائص قابلة للتعديل، ولوحة ألوان تؤثر في القيم التي يمكن ربطها بالمشهد.',
    related: [
      'VkCommandBuffer',
      'VkRenderPass',
      'VkDescriptorPool',
      'ImGui::BeginMenuBar',
      'ImGui::MenuItem',
      'ImGui::Selectable',
      'ImGui::DragFloat3',
      'ImGui::ColorEdit4',
      'ImGui_ImplVulkan_RenderDrawData'
    ],
    previewKind: 'imgui-panels',
    previewTitle: 'غلاف محرر فوق Vulkan مع قوائم ولوحات Scene وProperties وColor.'
  },
  {
    id: 'imgui-color-picker-live-material',
    title: 'مثال Color Picker فوق Vulkan مع تطبيق اللون مباشرة على عنصر مرسوم',
    goal: 'يوضح هذا المثال كيف يتحول ColorPicker داخل واجهة ImGui فوق Vulkan إلى لون فعلي يصل إلى المشهد: تحديث لون مادة أو Clear Color أو قيمة Uniform في كل إطار.',
    requirements: [
      'تكامل Dear ImGui مع Vulkan وSDL3 جاهز مسبقًا.',
      'هناك Uniform Buffer أو Push Constants مخصصة لتمرير اللون إلى الشيدر أو إلى بيانات الرسم.',
      'المثال يفترض وجود مسار BeginRenderPass وDraw فعلي داخل VkCommandBuffer نفسه.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>
#include <cstring>

struct MaterialUiState {
    float current_color[4] = { 0.22f, 0.54f, 0.94f, 1.0f };
    float previous_color[4] = { 0.18f, 0.22f, 0.28f, 1.0f };
};

struct MappedMaterialUniform {
    float base_color[4];
};

void RecordMaterialColorUi(
    VkCommandBuffer command_buffer,
    MaterialUiState* ui,
    MappedMaterialUniform* mapped_uniform,
    VkClearValue* clear_values)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGui::Begin("Material Color");
    ImGui::Text("Pick a color and apply it directly to the rendered object.");
    ImGui::ColorPicker4("Base Color", ui->current_color);
    ImGui::ColorButton("Current", ImVec4(
        ui->current_color[0],
        ui->current_color[1],
        ui->current_color[2],
        ui->current_color[3]));
    ImGui::SameLine();
    ImGui::ColorButton("Previous", ImVec4(
        ui->previous_color[0],
        ui->previous_color[1],
        ui->previous_color[2],
        ui->previous_color[3]));
    if (ImGui::Button("Store As Previous")) {
        std::memcpy(ui->previous_color, ui->current_color, sizeof(ui->current_color));
    }
    ImGui::End();

    std::memcpy(mapped_uniform->base_color, ui->current_color, sizeof(ui->current_color));
    clear_values[0].color.float32[0] = ui->current_color[0] * 0.18f;
    clear_values[0].color.float32[1] = ui->current_color[1] * 0.18f;
    clear_values[0].color.float32[2] = ui->current_color[2] * 0.18f;
    clear_values[0].color.float32[3] = 1.0f;

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'يحفظ التطبيق اللون الحالي داخل MaterialUiState، ثم ينسخه مباشرة إلى Uniform Buffer أو Push Constants قبل أو أثناء تسجيل أوامر الرسم في الإطار نفسه.',
      'وجود Current وPrevious داخل الواجهة يجعل المثال عمليًا كلون مادة أو Theme editor، لا مجرد ColorPicker معزول بلا نتيجة مرئية بعد التعديل.',
      'يمكن استخدام اللون نفسه في أكثر من موضع: Clear Color خفيفة للخلفية، وقيمة مادة للكائن، ومعاينة فورية داخل أدوات الواجهة.'
    ],
    expectedResult: 'عند تعديل اللون من ColorPicker يتغير لون العنصر المرسوم أو الخلفية المرتبطة به مباشرة في نافذة Vulkan، مع بقاء المعاينة السابقة والحالية مرئية داخل لوحة الأدوات.',
    related: [
      'VkCommandBuffer',
      'VkClearValue',
      'vkCmdBeginRenderPass',
      'ImGui::ColorPicker4',
      'ImGui::ColorButton',
      'ImGui::SameLine',
      'ImGui_ImplVulkan_RenderDrawData'
    ],
    previewKind: 'imgui-color',
    previewTitle: 'Color Picker فوق Vulkan يحدّث لون المادة والخرج المرئي مباشرة.'
  },
  {
    id: 'imgui-drag-drop-asset-browser',
    title: 'مثال Drag & Drop داخل واجهة ImGui فوق Vulkan',
    goal: 'يبين هذا المثال كيف يبني التطبيق Asset Browser وViewport target داخل واجهة Dear ImGui فوق Vulkan، ثم ينقل payload من مصدر سحب واضح إلى هدف إفلات واضح داخل نفس نافذة العرض.',
    requirements: [
      'تكامل Dear ImGui مع Vulkan وSDL3 جاهز داخل الحلقة الرئيسية.',
      'هناك حالة خارجية تمثل الأصل النشط أو المورد الذي يجب ربطه بالمشهد بعد الإفلات.',
      'المثال يفترض أن التطبيق يملك منطقًا فعليًا لاستبدال النموذج أو الخامة أو الصورة عند تغير active_asset.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>

struct AssetBrowserState {
    int active_asset = 0;
    const char* assets[4] = {
        "Spaceship.mesh",
        "Crate.mesh",
        "FoliagePatch.mesh",
        "UIBanner.texture"
    };
};

void RecordAssetBrowserUi(VkCommandBuffer command_buffer, AssetBrowserState* ui)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGui::Begin("Asset Browser");
    ImGui::Text("Source: drag one asset from the list.");
    ImGui::Separator();
    for (int i = 0; i < IM_ARRAYSIZE(ui->assets); ++i) {
        ImGui::Selectable(ui->assets[i], ui->active_asset == i);
        if (ImGui::BeginDragDropSource()) {
            ImGui::SetDragDropPayload("ASSET_INDEX", &i, sizeof(int));
            ImGui::Text("Source: %s", ui->assets[i]);
            ImGui::Text("Payload type: ASSET_INDEX");
            ImGui::EndDragDropSource();
        }
    }
    ImGui::End();

    ImGui::Begin("Viewport");
    ImGui::Text("Target: drop here to replace the rendered asset.");
    ImGui::Text("Current asset: %s", ui->assets[ui->active_asset]);
    ImGui::InvisibleButton("viewport_drop_target", ImVec2(360.0f, 220.0f));
    if (ImGui::BeginDragDropTarget()) {
        if (const ImGuiPayload* payload = ImGui::AcceptDragDropPayload("ASSET_INDEX")) {
            ui->active_asset = *(const int*)payload->Data;
            // هنا تربط Mesh أو Texture جديدة بالمشهد الجاري رسمه.
        }
        ImGui::EndDragDropTarget();
    }
    ImGui::Text("After drop: the viewport can bind a different resource next frame.");
    ImGui::End();

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'المثال يوضح دورة Drag & Drop كاملة فوق Vulkan: المصدر هو Asset Browser، والهدف هو Viewport، ونوع البيانات المنقولة هو ASSET_INDEX، وما بعد الإفلات هو استبدال المورد المعروض.',
      'رغم أن الواجهة مبنية بـ Dear ImGui، فإن النتيجة عملية داخل نافذة Vulkan نفسها، لأن الأصل النشط يمكن أن يغير Mesh أو Texture أو مادة في الإطار التالي مباشرة.',
      'هذا المثال يشرح السحب والإفلات كسلوك واجهة فوق Vulkan، لا كتصادم فيزيائي أو منطق عالم ثلاثي الأبعاد.'
    ],
    expectedResult: 'يستطيع المستخدم سحب أصل من قائمة الأدوات وإفلاته على Viewport داخل نافذة Vulkan نفسها، ثم يتغير الأصل النشط الذي يفترض أن يستخدمه المشهد في الإطار اللاحق.',
    related: [
      'VkCommandBuffer',
      'ImGui::Selectable',
      'ImGui::BeginDragDropSource',
      'ImGui::SetDragDropPayload',
      'ImGui::BeginDragDropTarget',
      'ImGui::AcceptDragDropPayload',
      'ImGui::InvisibleButton',
      'ImGui_ImplVulkan_RenderDrawData'
    ],
    previewKind: 'imgui-drag',
    previewTitle: 'Asset Browser وViewport target مع Drag & Drop فوق Vulkan.'
  },
  {
    id: 'imgui-animated-profiler-overlay',
    title: 'مثال أنيميشن Overlay وأشرطة تقدم متحركة فوق Vulkan',
    goal: 'يجمع هذا المثال بين واجهة Overlay عملية فوق Vulkan وبين أنيميشن مبنية على قيم تحدث بين الإطارات: Fade للوحة، شريط تقدم متحرك، وتغيرات Hover/Press لبطاقات الأداء.',
    requirements: [
      'Dear ImGui مدمجة مع Vulkan داخل الحلقة الرئيسية.',
      'يوجد وصول إلى Delta Time وقيم أداء أو تحميل أو GPU timings يمررها التطبيق إلى الواجهة كل Frame.',
      'المثال مناسب لـ profiler overlay أو loading overlay أو أدوات runtime diagnostics.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>
#include <cmath>

struct OverlayUiState {
    bool visible = true;
    float alpha = 0.18f;
    float progress = 0.0f;
    float hover_mix = 0.0f;
    float gpu_ms = 6.8f;
    float cpu_ms = 3.2f;
};

void RecordAnimatedOverlay(VkCommandBuffer command_buffer, OverlayUiState* ui)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGuiIO& io = ImGui::GetIO();
    const float target_alpha = ui->visible ? 0.94f : 0.08f;
    ui->alpha += (target_alpha - ui->alpha) * io.DeltaTime * 8.0f;
    ui->progress = fmodf(ui->progress + io.DeltaTime * 0.22f, 1.0f);

    ImGui::SetNextWindowBgAlpha(ui->alpha);
    ImGui::Begin("Profiler Overlay");
    if (ImGui::Button(ui->visible ? "Fade Out" : "Fade In")) {
        ui->visible = !ui->visible;
    }

    const bool hovered = ImGui::IsItemHovered();
    ui->hover_mix += ((hovered ? 1.0f : 0.0f) - ui->hover_mix) * io.DeltaTime * 10.0f;

    ImVec4 base(0.22f, 0.36f, 0.54f, 1.0f);
    ImVec4 hover(0.33f, 0.55f, 0.86f, 1.0f);
    ImVec4 mixed(
        base.x + (hover.x - base.x) * ui->hover_mix,
        base.y + (hover.y - base.y) * ui->hover_mix,
        base.z + (hover.z - base.z) * ui->hover_mix,
        1.0f
    );

    ImGui::PushStyleColor(ImGuiCol_PlotHistogram, mixed);
    ImGui::ProgressBar(ui->progress, ImVec2(260.0f, 0.0f), "Streaming");
    ImGui::PopStyleColor();

    ImGui::Text("GPU: %.2f ms", ui->gpu_ms);
    ImGui::Text("CPU: %.2f ms", ui->cpu_ms);
    ImGui::Text("hover_mix: %.2f", ui->hover_mix);
    ImGui::End();

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'الأنيميشن هنا لا تأتي من نظام عالي المستوى جاهز في ImGui أو Vulkan؛ التطبيق نفسه يحدث alpha وprogress وhover_mix بين الإطارات ثم يمرر القيم الناتجة إلى عناصر الواجهة.',
      'المثال عملي لأنه يشبه Overlays الأداء الحقيقية فوق Vulkan: قيم CPU وGPU، شريط تقدم أو تحميل، وتأثيرات Hover وFade تجعل القراءة البصرية أوضح.',
      'استمرار التحديث من Delta Time يجعل السلوك متسقًا نسبيًا بين الأجهزة المختلفة، وهو ما تحتاجه أدوات runtime الفعلية.'
    ],
    expectedResult: 'تظهر فوق نافذة Vulkan لوحة Overlay تتغير شفافيتها تدريجيًا، ويتحرك فيها شريط تقدم بشكل مستمر، كما تتأثر بعض الألوان بحالة Hover على الزر داخل نفس الإطار.',
    related: [
      'VkCommandBuffer',
      'ImGuiIO',
      'ImGui::SetNextWindowBgAlpha',
      'ImGui::Button',
      'ImGui::IsItemHovered',
      'ImGui::ProgressBar',
      'ImGui::PushStyleColor',
      'ImGui_ImplVulkan_RenderDrawData'
    ],
    previewKind: 'imgui-anim',
    previewTitle: 'Overlay متحرك فوق Vulkan مع Fade وProgress وHover.'
  },
  {
    id: 'imgui-frame-updated-values',
    title: 'مثال تحديث اللون والموضع والقيم عبر الإطارات داخل واجهة Vulkan',
    goal: 'يركز هذا المثال على الربط بين قيم واجهة الأدوات وبين البيانات المرئية في المشهد: تحريك موضع عنصر، وتحديث لون، وعرضها داخل Properties panel مع إرسال النتيجة إلى الرسم في كل Frame.',
    requirements: [
      'تكامل Dear ImGui مع Vulkan داخل نافذة حقيقية.',
      'هناك بيانات رسم قابلة للتحديث كل إطار مثل Uniform Buffer mapped أو Push Constants.',
      'المثال مناسب لأدوات المحرر التي تعرض Scene gizmo أو Transform editor أو Properties panel مرتبطة بالمشهد.'
    ],
    code: `#include <imgui.h>
#include <backends/imgui_impl_sdl3.h>
#include <backends/imgui_impl_vulkan.h>
#include <vulkan/vulkan.h>

struct TransformUiState {
    float position[3] = { -1.8f, 0.2f, 0.0f };
    float velocity = 1.25f;
    float tint[4] = { 0.95f, 0.74f, 0.22f, 1.0f };
};

struct MappedObjectUniform {
    float position[4];
    float tint[4];
};

void RecordTransformEditor(
    VkCommandBuffer command_buffer,
    TransformUiState* ui,
    MappedObjectUniform* mapped_uniform)
{
    ImGui_ImplVulkan_NewFrame();
    ImGui_ImplSDL3_NewFrame();
    ImGui::NewFrame();

    ImGuiIO& io = ImGui::GetIO();
    ui->position[0] += ui->velocity * io.DeltaTime;
    if (ui->position[0] > 1.8f) {
        ui->position[0] = 1.8f;
        ui->velocity = -ui->velocity;
    } else if (ui->position[0] < -1.8f) {
        ui->position[0] = -1.8f;
        ui->velocity = -ui->velocity;
    }

    ImGui::Begin("Scene Panel");
    ImGui::Text("Selected: MovingLight");
    ImGui::Text("This panel reflects a value updated every frame.");
    ImGui::End();

    ImGui::Begin("Properties Panel");
    ImGui::DragFloat3("Position", ui->position, 0.02f);
    ImGui::SliderFloat("Velocity", &ui->velocity, -3.0f, 3.0f);
    ImGui::ColorEdit4("Tint", ui->tint);
    ImGui::End();

    mapped_uniform->position[0] = ui->position[0];
    mapped_uniform->position[1] = ui->position[1];
    mapped_uniform->position[2] = ui->position[2];
    mapped_uniform->position[3] = 1.0f;
    mapped_uniform->tint[0] = ui->tint[0];
    mapped_uniform->tint[1] = ui->tint[1];
    mapped_uniform->tint[2] = ui->tint[2];
    mapped_uniform->tint[3] = ui->tint[3];

    ImGui::Render();
    ImGui_ImplVulkan_RenderDrawData(ImGui::GetDrawData(), command_buffer);
}`,
    highlights: [
      'يحفظ التطبيق position وvelocity وtint داخل TransformUiState، ثم يحدثها بمرور الوقت ويعرضها في Properties panel ويرسلها في الوقت نفسه إلى بيانات الرسم.',
      'هذا المثال يوضح بوضوح كيف تنعكس القيم المحدثة كل Frame على شيئين معًا: على واجهة الأدوات نفسها، وعلى العنصر الذي يرسمه Vulkan في المشهد.',
      'وجود Scene Panel وProperties Panel هنا يجعل المثال أقرب لأدوات المحررات الفعلية حيث تتحرك القيم وتتبدل عبر الإطارات بدل أن تبقى ثابتة ونظرية.'
    ],
    expectedResult: 'يرى المستخدم لوحة مشهد ولوحة خصائص داخل نافذة Vulkan، بينما يتغير موضع العنصر ولونه بمرور الوقت أو عبر التعديل اليدوي، وتظهر القيم نفسها داخل الواجهة في كل Frame.',
    related: [
      'VkCommandBuffer',
      'ImGuiIO',
      'ImGui::Text',
      'ImGui::DragFloat3',
      'ImGui::SliderFloat',
      'ImGui::ColorEdit4',
      'ImGui_ImplVulkan_RenderDrawData'
    ],
    previewKind: 'imgui-gizmo',
    previewTitle: 'تحديث موضع ولون وقيم خصائص عبر الإطارات داخل واجهة Vulkan.'
  },
  {
    id: 'depth-tested-3d-cube',
    title: 'مثال رسم مشهد ثلاثي الأبعاد مع Depth Buffer في Vulkan',
    goal: 'يوضح هذا المثال قلب الرسم ثلاثي الأبعاد في Vulkan: تحديث مصفوفات النموذج والرؤية والإسقاط، ثم بدء Render Pass يملك Color + Depth، وأخيرًا رسم مجسم مفهرس مع اختبار عمق صحيح.',
    requirements: [
      'تهيئة VkDevice وVkSwapchainKHR وVkRenderPass وVkPipeline للمشهد أُنجزت مسبقًا.',
      'هناك VkImageView وVkFramebuffer لعمق المشهد داخل كل إطار عرض.',
      'المثال يفترض وجود Vertex Buffer وIndex Buffer وUniform Buffer mapped أو قابلة للتحديث كل Frame.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vulkan/vulkan.h>

struct SceneUniform {
    glm::mat4 model;
    glm::mat4 view;
    glm::mat4 proj;
};

void RecordDepthTestedCube(
    VkCommandBuffer command_buffer,
    VkRenderPass render_pass,
    VkFramebuffer framebuffer,
    VkExtent2D extent,
    VkPipeline pipeline,
    VkPipelineLayout pipeline_layout,
    VkBuffer vertex_buffer,
    VkBuffer index_buffer,
    VkDescriptorSet scene_set,
    uint32_t index_count,
    SceneUniform* mapped_uniform,
    float elapsed_seconds)
{
    mapped_uniform->model = glm::rotate(
        glm::mat4(1.0f),
        elapsed_seconds * glm::radians(42.0f),
        glm::vec3(0.0f, 1.0f, 0.0f)
    );
    mapped_uniform->view = glm::lookAt(
        glm::vec3(2.8f, 2.0f, 4.2f),
        glm::vec3(0.0f, 0.0f, 0.0f),
        glm::vec3(0.0f, 1.0f, 0.0f)
    );
    mapped_uniform->proj = glm::perspective(
        glm::radians(60.0f),
        extent.width / (float)extent.height,
        0.1f,
        100.0f
    );
    mapped_uniform->proj[1][1] *= -1.0f;

    VkClearValue clear_values[2] = {};
    clear_values[0].color = {{0.07f, 0.10f, 0.14f, 1.0f}};
    clear_values[1].depthStencil = {1.0f, 0};

    VkRenderPassBeginInfo begin_info = {};
    begin_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    begin_info.renderPass = render_pass;
    begin_info.framebuffer = framebuffer;
    begin_info.renderArea.extent = extent;
    begin_info.clearValueCount = 2;
    begin_info.pClearValues = clear_values;

    vkCmdBeginRenderPass(command_buffer, &begin_info, VK_SUBPASS_CONTENTS_INLINE);

    VkViewport viewport = {0.0f, 0.0f, (float)extent.width, (float)extent.height, 0.0f, 1.0f};
    VkRect2D scissor = {{0, 0}, extent};
    vkCmdSetViewport(command_buffer, 0, 1, &viewport);
    vkCmdSetScissor(command_buffer, 0, 1, &scissor);

    VkDeviceSize offsets[] = {0};
    vkCmdBindPipeline(command_buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
    vkCmdBindVertexBuffers(command_buffer, 0, 1, &vertex_buffer, offsets);
    vkCmdBindIndexBuffer(command_buffer, index_buffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdBindDescriptorSets(
        command_buffer,
        VK_PIPELINE_BIND_POINT_GRAPHICS,
        pipeline_layout,
        0,
        1,
        &scene_set,
        0,
        nullptr
    );
    vkCmdDrawIndexed(command_buffer, index_count, 1, 0, 0, 0);
    vkCmdEndRenderPass(command_buffer);
}`,
    highlights: [
      'وجود Clear Value ثانية للعمق مع depthStencil = {1.0f, 0} هو ما يسمح لاختبار العمق أن يبدأ من حالة صحيحة في كل Frame.',
      'تحديث model/view/proj في Uniform واحد يربط الرسم ثلاثي الأبعاد بالكاميرا والتحريك داخل نفس الإطار.',
      'هذا المثال يوضح أن الرسم 3D في Vulkan ليس مجرد VkPipeline، بل Render Pass بعمق ومخازن مؤشرات/رؤوس ومصفوفات كاميرا ترسل كل Frame.'
    ],
    expectedResult: 'يرى المستخدم مجسمًا ثلاثي الأبعاد أو صندوقًا دوارًا مع اختبار عمق صحيح، بحيث تختفي الأوجه الخلفية وراء الأوجه الأقرب بدل الظهور فوقها عشوائيًا.',
    related: [
      'VkRenderPass',
      'VkFramebuffer',
      'VkPipeline',
      'VkPipelineLayout',
      'VkCommandBuffer',
      'vkCmdBeginRenderPass',
      'vkCmdBindPipeline',
      'vkCmdBindVertexBuffers',
      'vkCmdBindIndexBuffer',
      'vkCmdDrawIndexed',
      'VkViewport',
      'VkRect2D'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'مشهد Vulkan ثلاثي الأبعاد مع مجسم وكاميرا وDepth Buffer.'
  },
  {
    id: 'orbit-camera-controller',
    title: 'مثال كاميرا Orbit قابلة للتحكم فوق مشهد Vulkan',
    goal: 'يبين هذا المثال كيف تبني كاميرا Orbit عملية: أحداث SDL3 تغيّر yaw وpitch وdistance، ثم تتحول هذه القيم إلى View Matrix ترسل إلى الشيدر في كل Frame.',
    requirements: [
      'نافذة SDL3 ومشهد Vulkan ثلاثي الأبعاد جاهزان مسبقًا.',
      'هناك Uniform أو Push Constants تقبل View/Projection matrices من الكاميرا.',
      'المثال مناسب لمحرر مشهد أو أداة معاينة نماذج أو Viewport فوق Vulkan.'
    ],
    code: `#include <cmath>
#include <SDL3/SDL.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vulkan/vulkan.h>

struct OrbitCameraState {
    float yaw = 0.7f;
    float pitch = 0.35f;
    float distance = 5.0f;
    glm::vec3 target = glm::vec3(0.0f, 0.8f, 0.0f);
    bool rotating = false;
};

static glm::mat4 BuildOrbitView(const OrbitCameraState& camera)
{
    const float x = camera.target.x + cosf(camera.pitch) * sinf(camera.yaw) * camera.distance;
    const float y = camera.target.y + sinf(camera.pitch) * camera.distance;
    const float z = camera.target.z + cosf(camera.pitch) * cosf(camera.yaw) * camera.distance;
    return glm::lookAt(glm::vec3(x, y, z), camera.target, glm::vec3(0.0f, 1.0f, 0.0f));
}

void HandleOrbitCameraEvent(const SDL_Event* event, OrbitCameraState* camera)
{
    if (event->type == SDL_EVENT_MOUSE_BUTTON_DOWN &&
        event->button.button == SDL_BUTTON_RIGHT) {
        camera->rotating = true;
    }

    if (event->type == SDL_EVENT_MOUSE_BUTTON_UP &&
        event->button.button == SDL_BUTTON_RIGHT) {
        camera->rotating = false;
    }

    if (event->type == SDL_EVENT_MOUSE_MOTION && camera->rotating) {
        camera->yaw += event->motion.xrel * 0.01f;
        camera->pitch -= event->motion.yrel * 0.01f;
        if (camera->pitch > 1.35f) camera->pitch = 1.35f;
        if (camera->pitch < -1.25f) camera->pitch = -1.25f;
    }

    if (event->type == SDL_EVENT_MOUSE_WHEEL) {
        camera->distance -= event->wheel.y * 0.35f;
        if (camera->distance < 1.5f) camera->distance = 1.5f;
        if (camera->distance > 15.0f) camera->distance = 15.0f;
    }
}

void UpdateCameraUniform(
    const OrbitCameraState& camera,
    VkExtent2D extent,
    glm::mat4* view_out,
    glm::mat4* proj_out)
{
    *view_out = BuildOrbitView(camera);
    *proj_out = glm::perspective(
        glm::radians(60.0f),
        extent.width / (float)extent.height,
        0.1f,
        100.0f
    );
    (*proj_out)[1][1] *= -1.0f;
}`,
    highlights: [
      'تُحفظ حالة الكاميرا خارج الرسم نفسه في OrbitCameraState، وبذلك تبقى yaw وpitch وdistance مستمرة بين الإطارات.',
      'SDL3 هنا تقرأ الإدخال فقط، ثم يحول Vulkan تلك القيم إلى View/Projection matrices ترسل للمشهد في الإطار نفسه.',
      'هذا النمط هو الأساس العملي لكاميرات المحررات، ومعاينات النماذج، وواجهات Viewport فوق Vulkan.'
    ],
    expectedResult: 'يمكن للمستخدم تدوير الكاميرا بالزر الأيمن للفأرة والتقريب أو الإبعاد بعجلة الفأرة، بينما يتحدث منظور المشهد المعروض في Vulkan مباشرة.',
    related: [
      'SDL_Event',
      'SDL_EVENT_MOUSE_BUTTON_DOWN',
      'SDL_EVENT_MOUSE_BUTTON_UP',
      'SDL_EVENT_MOUSE_MOTION',
      'SDL_EVENT_MOUSE_WHEEL',
      'VkExtent2D',
      'glm::lookAt',
      'glm::perspective'
    ],
    previewKind: 'camera',
    previewTitle: 'كاميرا Orbit تتحكم في Viewport Vulkan حول هدف ثلاثي الأبعاد.'
  },
  {
    id: 'viewport-ray-picking',
    title: 'مثال Picking واختبار تقاطع Ray مع AABB داخل Viewport Vulkan',
    goal: 'يوضح هذا المثال كيف تلتقط نقرة المستخدم داخل Viewport، ثم تحول موضع الشاشة إلى شعاع Ray في فضاء العالم، ثم تختبر تقاطعه مع AABB لاختيار الكائن أو تمييزه.',
    requirements: [
      'مصفوفات View وProjection الحالية متاحة من الكاميرا.',
      'هناك قائمة كائنات تملك world bounds مثل AABB أو bounding boxes مبسطة.',
      'المثال يخص الالتقاط والاختيار أو collision query داخل المشهد، وليس محرك فيزياء عام كامل.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_inverse.hpp>
#include <vector>

struct Ray {
    glm::vec3 origin;
    glm::vec3 direction;
};

struct PickableObject {
    int id;
    glm::vec3 bounds_min;
    glm::vec3 bounds_max;
};

static Ray ScreenPointToRay(
    float mouse_x,
    float mouse_y,
    float viewport_x,
    float viewport_y,
    float viewport_width,
    float viewport_height,
    const glm::mat4& view,
    const glm::mat4& proj)
{
    const float ndc_x = ((mouse_x - viewport_x) / viewport_width) * 2.0f - 1.0f;
    const float ndc_y = 1.0f - ((mouse_y - viewport_y) / viewport_height) * 2.0f;

    const glm::mat4 inv_view_proj = glm::inverse(proj * view);
    const glm::vec4 near_point = inv_view_proj * glm::vec4(ndc_x, ndc_y, 0.0f, 1.0f);
    const glm::vec4 far_point = inv_view_proj * glm::vec4(ndc_x, ndc_y, 1.0f, 1.0f);

    const glm::vec3 near_world = glm::vec3(near_point) / near_point.w;
    const glm::vec3 far_world = glm::vec3(far_point) / far_point.w;

    Ray ray = {};
    ray.origin = near_world;
    ray.direction = glm::normalize(far_world - near_world);
    return ray;
}

static bool IntersectRayAabb(const Ray& ray, const PickableObject& object)
{
    const glm::vec3 inv_dir = 1.0f / ray.direction;
    const glm::vec3 t0 = (object.bounds_min - ray.origin) * inv_dir;
    const glm::vec3 t1 = (object.bounds_max - ray.origin) * inv_dir;
    const glm::vec3 tmin = glm::min(t0, t1);
    const glm::vec3 tmax = glm::max(t0, t1);
    const float near_hit = glm::max(glm::max(tmin.x, tmin.y), tmin.z);
    const float far_hit = glm::min(glm::min(tmax.x, tmax.y), tmax.z);
    return far_hit >= near_hit && far_hit >= 0.0f;
}

int PickViewportObject(
    float mouse_x,
    float mouse_y,
    float viewport_x,
    float viewport_y,
    float viewport_width,
    float viewport_height,
    const glm::mat4& view,
    const glm::mat4& proj,
    const std::vector<PickableObject>& objects)
{
    const Ray ray = ScreenPointToRay(
        mouse_x, mouse_y,
        viewport_x, viewport_y,
        viewport_width, viewport_height,
        view, proj
    );

    for (const PickableObject& object : objects) {
        if (IntersectRayAabb(ray, object)) {
            return object.id;
        }
    }

    return -1;
}`,
    highlights: [
      'يحصل الالتقاط هنا داخل مساحة Viewport حقيقية، لا كنظرية عامة، لأن النقر يبدأ من إحداثيات شاشة ثم يتحول إلى Ray في فضاء العالم.',
      'اختبار التقاطع مع AABB هو شكل من collision query أو picking داخل المشهد، وهو مناسب للمحررات أو تحديد الأجسام قبل إدخال محرك فيزياء كامل.',
      'بعد الحصول على id المختار يمكن تلوين الكائن، أو ملء Properties panel، أو فتح Gizmo في الإطار التالي.'
    ],
    expectedResult: 'عند النقر داخل Viewport يستطيع التطبيق تحديد الكائن الذي أصابه الشعاع، ثم يميزه بصريًا أو يربطه بلوحة الخصائص داخل واجهة Vulkan.',
    related: [
      'glm::inverse',
      'glm::normalize',
      'VkViewport',
      'VkRect2D',
      'VkCommandBuffer',
      'ImGui::InvisibleButton',
      'ImGui::IsItemHovered'
    ],
    previewKind: 'picking',
    previewTitle: 'Picking داخل Viewport Vulkan عبر Ray واختبار تقاطع مع AABB.'
  },
  {
    id: 'offscreen-postprocess-bloom',
    title: 'مثال رسم Offscreen ثم Post-Process فوق خرج Vulkan',
    goal: 'يجمع هذا المثال بين مرحلتين عمليتين شائعتين في Vulkan: رسم المشهد أولًا إلى Offscreen Color Target، ثم تمريره إلى Fullscreen Pass ثانية تطبق Exposure أو Bloom أو Color Grading قبل التقديم النهائي.',
    requirements: [
      'هناك Offscreen VkImage وVkImageView وVkFramebuffer منفصلة عن صور Swapchain.',
      'المشهد الأساسي والرندر الكامل للشاشة يملكان Graphics Pipelines منفصلين.',
      'المثال مناسب لمسارات bloom وtone mapping وfullscreen effects في التطبيقات الحقيقية.'
    ],
    code: `#include <cmath>
#include <vulkan/vulkan.h>

struct PostProcessUniform {
    float exposure;
    float bloom_strength;
    float vignette_strength;
    float time;
};

void RecordOffscreenAndComposite(
    VkCommandBuffer command_buffer,
    VkExtent2D extent,
    VkRenderPass offscreen_pass,
    VkFramebuffer offscreen_framebuffer,
    VkPipeline scene_pipeline,
    VkPipelineLayout scene_layout,
    VkRenderPass composite_pass,
    VkFramebuffer swapchain_framebuffer,
    VkPipeline composite_pipeline,
    VkPipelineLayout composite_layout,
    VkDescriptorSet composite_set,
    PostProcessUniform* mapped_uniform,
    float elapsed_seconds)
{
    mapped_uniform->exposure = 1.05f + sinf(elapsed_seconds * 0.7f) * 0.08f;
    mapped_uniform->bloom_strength = 0.42f;
    mapped_uniform->vignette_strength = 0.18f;
    mapped_uniform->time = elapsed_seconds;

    VkClearValue offscreen_clear[2] = {};
    offscreen_clear[0].color = {{0.01f, 0.01f, 0.02f, 1.0f}};
    offscreen_clear[1].depthStencil = {1.0f, 0};

    VkRenderPassBeginInfo offscreen_begin = {};
    offscreen_begin.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    offscreen_begin.renderPass = offscreen_pass;
    offscreen_begin.framebuffer = offscreen_framebuffer;
    offscreen_begin.renderArea.extent = extent;
    offscreen_begin.clearValueCount = 2;
    offscreen_begin.pClearValues = offscreen_clear;

    vkCmdBeginRenderPass(command_buffer, &offscreen_begin, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(command_buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, scene_pipeline);
    vkCmdDraw(command_buffer, 36, 1, 0, 0);
    vkCmdEndRenderPass(command_buffer);

    VkClearValue swapchain_clear = {};
    swapchain_clear.color = {{0.03f, 0.04f, 0.06f, 1.0f}};

    VkRenderPassBeginInfo composite_begin = {};
    composite_begin.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    composite_begin.renderPass = composite_pass;
    composite_begin.framebuffer = swapchain_framebuffer;
    composite_begin.renderArea.extent = extent;
    composite_begin.clearValueCount = 1;
    composite_begin.pClearValues = &swapchain_clear;

    vkCmdBeginRenderPass(command_buffer, &composite_begin, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(command_buffer, VK_PIPELINE_BIND_POINT_GRAPHICS, composite_pipeline);
    vkCmdBindDescriptorSets(
        command_buffer,
        VK_PIPELINE_BIND_POINT_GRAPHICS,
        composite_layout,
        0,
        1,
        &composite_set,
        0,
        nullptr
    );
    vkCmdDraw(command_buffer, 3, 1, 0, 0);
    vkCmdEndRenderPass(command_buffer);
}`,
    highlights: [
      'يفصل المثال بوضوح بين Scene Pass وComposite Pass، وهو ما يجعل تأثيرات ما بعد المعالجة في Vulkan قابلة للإدارة بدل خلطها مع رسم المشهد نفسه.',
      'تحديث exposure وtime في كل Frame يوضح أن post-process يمكن أن يكون متحركًا أو تفاعليًا، لا مجرد فلتر ثابت.',
      'هذا النمط هو الأساس العملي لمسارات bloom وtone mapping وfullscreen color tools في التطبيقات الرسومية الحقيقية.'
    ],
    expectedResult: 'يرسم التطبيق المشهد أولًا إلى هدف Offscreen، ثم يعرضه على الشاشة عبر Fullscreen Pass مع تعريض لوني متغير أو تأثير bloom/vignette واضح.',
    related: [
      'VkRenderPass',
      'VkFramebuffer',
      'VkDescriptorSet',
      'VkPipeline',
      'VkPipelineLayout',
      'vkCmdBeginRenderPass',
      'vkCmdBindPipeline',
      'vkCmdBindDescriptorSets',
      'vkCmdDraw'
    ],
    previewKind: 'postprocess',
    previewTitle: 'مسار Vulkan يرسم Offscreen ثم يركب النتيجة عبر Fullscreen Post-Process.'
  },
  {
    id: 'version-macros',
    title: 'مثال بناء وقراءة إصدارات Vulkan',
    aliases: [
      'VK_API_VERSION_example',
      'VK_MAKE_VERSION_example',
      'VK_MAKE_API_VERSION_example',
      'VK_API_VERSION_MAJOR_example',
      'VK_API_VERSION_MINOR_example',
      'VK_API_VERSION_PATCH_example'
    ],
    goal: 'يوضح هذا المثال الفرق العملي بين بناء رقم إصدار Vulkan عبر VK_MAKE_VERSION أو VK_MAKE_API_VERSION، ثم استخراج مكوناته مرة أخرى قبل تمريرها إلى VkApplicationInfo أو طباعتها للمستخدم.',
    requirements: [
      'يكفي تضمين ترويسة Vulkan الأساسية فقط.',
      'المثال مناسب عندما تريد تحديد apiVersion أو قراءة إصدار معاد من العتاد أو من الترويسة.',
      'يفضل استخدام VK_MAKE_API_VERSION مع Vulkan الحديثة، مع معرفة أن VK_MAKE_VERSION ما زال شائعًا في الأمثلة القديمة.'
    ],
    code: `#include <vulkan/vulkan.h>
#include <cstdio>

void PrintRequestedApiVersion()
{
    uint32_t legacy_version = VK_MAKE_VERSION(1, 2, 3);
    uint32_t api_version = VK_MAKE_API_VERSION(0, 1, 3, 0);

    std::printf(
        "Legacy version: %u.%u.%u\\n",
        VK_VERSION_MAJOR(legacy_version),
        VK_VERSION_MINOR(legacy_version),
        VK_VERSION_PATCH(legacy_version)
    );

    std::printf(
        "API version: %u.%u.%u\\n",
        VK_API_VERSION_MAJOR(api_version),
        VK_API_VERSION_MINOR(api_version),
        VK_API_VERSION_PATCH(api_version)
    );

    VkApplicationInfo app_info = {};
    app_info.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
    app_info.pApplicationName = "Version Example";
    app_info.apiVersion = api_version;
}`,
    highlights: [
      'يبني VK_MAKE_VERSION القيمة القديمة ذات الحقول الثلاثة، بينما يبني VK_MAKE_API_VERSION الصيغة الحديثة التي تتضمن variant أيضًا.',
      'تستخرج ماكروهات VK_VERSION_* وVK_API_VERSION_* الأجزاء المخزنة داخل العدد النهائي بدل كتابة أقنعة البتات وإزاحاتها يدويًا.',
      'أكثر مكان عملي يظهر فيه هذا المثال هو حقل apiVersion داخل VkApplicationInfo، لأن التطبيق يصرح هناك بالإصدار الذي يتوقعه من الواجهة.'
    ],
    expectedResult: 'تحصل على أرقام إصدار صحيحة قابلة للطباعة أو للمقارنة أو للتمرير إلى Vulkan دون بناء يدوي معرّض للخطأ في تموضع البتات.',
    related: [
      'VkApplicationInfo',
      'VK_API_VERSION',
      'VK_MAKE_VERSION',
      'VK_MAKE_API_VERSION',
      'VK_VERSION_MAJOR',
      'VK_VERSION_MINOR',
      'VK_VERSION_PATCH',
      'VK_API_VERSION_MAJOR',
      'VK_API_VERSION_MINOR',
      'VK_API_VERSION_PATCH'
    ],
    previewKind: 'version',
    previewTitle: 'بطاقة تبين بناء رقم إصدار Vulkan ثم تفكيكه إلى Major وMinor وPatch.'
  },
  {
    id: 'handle-basics',
    title: 'مثال المقابض الأساسية و VK_NULL_HANDLE',
    aliases: [
      'VK_NULL_HANDLE_example',
      'VK_DEFINE_HANDLE_example',
      'VK_DEFINE_NON_DISPATCHABLE_HANDLE_example'
    ],
    goal: 'يجمع هذا المثال بين الجانب النظري لتعريف المقابض عبر ماكروهات Vulkan وبين الاستخدام العملي لـ VK_NULL_HANDLE كقيمة آمنة لتهيئة المقابض والتحقق منها قبل الإنشاء وبعد التنظيف.',
    requirements: [
      'يكفي تضمين ترويسة Vulkan الأساسية.',
      'جزء VK_DEFINE_HANDLE وVK_DEFINE_NON_DISPATCHABLE_HANDLE أقرب إلى ما يحدث داخل الترويسات لا داخل منطق التطبيق اليومي.',
      'المثال مفيد عندما تريد فهم لماذا تبدو بعض المقابض كمؤشرات وبعضها كقيم معتمة في الكود.'
    ],
    code: `#include <vulkan/vulkan.h>

// هذا يشبه ما يحدث داخل ترويسات Vulkan لبناء أنواع المقابض الرسمية.
VK_DEFINE_HANDLE(VkDemoDispatchable)
VK_DEFINE_NON_DISPATCHABLE_HANDLE(VkDemoResource)

void ResetTrackedHandles(VkInstance* instance, VkBuffer* staging_buffer)
{
    if (staging_buffer && *staging_buffer != VK_NULL_HANDLE) {
        // هنا يأتي الاستدعاء الفعلي للتدمير مثل vkDestroyBuffer(...)
        *staging_buffer = VK_NULL_HANDLE;
    }

    if (instance && *instance != VK_NULL_HANDLE) {
        vkDestroyInstance(*instance, nullptr);
        *instance = VK_NULL_HANDLE;
    }
}`,
    highlights: [
      'تولد VK_DEFINE_HANDLE وVK_DEFINE_NON_DISPATCHABLE_HANDLE تعريفات أنواع المقابض نفسها أثناء وقت الترجمة، لذلك مكانها الطبيعي هو الترويسات لا دوال التطبيق اليومية.',
      'يمثل VK_NULL_HANDLE قيمة موحدة تعني غياب مورد صالح، ولهذا يستعمل في التهيئة الأولية وفي إعادة الضبط بعد التدمير.',
      'التحقق من المقبض قبل استعماله أو تدميره يمنع كثيرًا من الأخطاء المرتبطة باستخدام قيمة قديمة أو غير مهيأة في مسار Vulkan.'
    ],
    expectedResult: 'يفهم القارئ شكل أنواع المقابض في Vulkan، ويصبح لديه نمط واضح لتهيئة المقابض وفحصها ثم إعادة ضبطها إلى VK_NULL_HANDLE بعد انتهاء عمرها.',
    related: [
      'VkInstance',
      'VkBuffer',
      'VK_NULL_HANDLE',
      'VK_DEFINE_HANDLE',
      'VK_DEFINE_NON_DISPATCHABLE_HANDLE',
      'vkDestroyInstance'
    ],
    previewKind: 'handles',
    previewTitle: 'معاينة للمقابض الأساسية مع إعادة الضبط إلى VK_NULL_HANDLE بعد التنظيف.'
  },
  {
    id: 'glfw-triangle',
    title: 'مثال رسم مثلث في Vulkan باستخدام GLFW3',
    goal: 'يعرض هذا المثال المسار العملي الأبسط لرسم مثلث في Vulkan فوق نافذة GLFW3: حلقة نافذة، أوامر رسم، واستدعاء vkCmdDraw داخل Render Pass فعلي.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'الكود نفسه يعمل على الأنظمة الثلاثة لأن GLFW3 تتكفل بالنافذة والسطح، بينما يبقى مسار الرسم في Vulkan موحدًا.',
    requirements: [
      'Vulkan SDK مثبت مع GLFW3 جاهزة في CMake أو مدير الحزم لديك.',
      'يعتمد المثال على نفس دوال الإنشاء الأساسية التي ظهرت في أمثلة Instance وDevice وSwapchain وPipeline داخل هذا القسم.',
      'ملفا `shaders/triangle.vert.spv` و`shaders/triangle.frag.spv` مترجمان مسبقًا قبل التشغيل.'
    ],
    commandBlocks: [
      {title: 'Vertex Shader', code: 'glslangValidator -V shaders/triangle.vert -o shaders/triangle.vert.spv', language: 'bash', iconType: 'glsl'},
      {title: 'Fragment Shader', code: 'glslangValidator -V shaders/triangle.frag -o shaders/triangle.frag.spv', language: 'bash', iconType: 'glsl'}
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <vulkan/vulkan.h>
#include <vector>

struct TriangleApp {
    GLFWwindow* window = nullptr;
    VkInstance instance = VK_NULL_HANDLE;
    VkSurfaceKHR surface = VK_NULL_HANDLE;
    VkDevice device = VK_NULL_HANDLE;
    VkSwapchainKHR swapchain = VK_NULL_HANDLE;
    VkRenderPass renderPass = VK_NULL_HANDLE;
    VkPipeline pipeline = VK_NULL_HANDLE;
    VkExtent2D swapchainExtent{};
    VkQueue graphicsQueue = VK_NULL_HANDLE;
    VkQueue presentQueue = VK_NULL_HANDLE;
    std::vector<VkFramebuffer> framebuffers;
    std::vector<VkCommandBuffer> commandBuffers;
    VkSemaphore imageAvailable = VK_NULL_HANDLE;
    VkSemaphore renderFinished = VK_NULL_HANDLE;
    VkFence inFlightFence = VK_NULL_HANDLE;
};

// هذه الدالة تجمع تهيئة Instance وSurface وDevice وSwapchain وRenderPass وPipeline
// بالاستفادة من الأمثلة الأساسية السابقة داخل هذا القسم.
TriangleApp CreateTriangleApp(GLFWwindow* window,
                              const char* vertex_spv,
                              const char* fragment_spv);
void DestroyTriangleApp(TriangleApp& app);

void RecordTriangleCommands(TriangleApp& app, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    vkResetCommandBuffer(cmd, 0);

    VkCommandBufferBeginInfo begin_info = {};
    begin_info.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    vkBeginCommandBuffer(cmd, &begin_info);

    VkClearValue clear_value = {{{0.07f, 0.08f, 0.11f, 1.0f}}};

    VkRenderPassBeginInfo pass_info = {};
    pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    pass_info.renderPass = app.renderPass;
    pass_info.framebuffer = app.framebuffers[image_index];
    pass_info.renderArea.extent = app.swapchainExtent;
    pass_info.clearValueCount = 1;
    pass_info.pClearValues = &clear_value;

    vkCmdBeginRenderPass(cmd, &pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);
    vkCmdDraw(cmd, 3, 1, 0, 0);
    vkCmdEndRenderPass(cmd);
    vkEndCommandBuffer(cmd);
}

void DrawTriangleFrame(TriangleApp& app)
{
    uint32_t image_index = 0;
    vkAcquireNextImageKHR(
        app.device,
        app.swapchain,
        UINT64_MAX,
        app.imageAvailable,
        VK_NULL_HANDLE,
        &image_index
    );

    RecordTriangleCommands(app, image_index);

    VkPipelineStageFlags wait_stages[] = {
        VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT
    };

    VkSubmitInfo submit_info = {};
    submit_info.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;
    submit_info.waitSemaphoreCount = 1;
    submit_info.pWaitSemaphores = &app.imageAvailable;
    submit_info.pWaitDstStageMask = wait_stages;
    submit_info.commandBufferCount = 1;
    submit_info.pCommandBuffers = &app.commandBuffers[image_index];
    submit_info.signalSemaphoreCount = 1;
    submit_info.pSignalSemaphores = &app.renderFinished;

    vkQueueSubmit(app.graphicsQueue, 1, &submit_info, app.inFlightFence);

    VkPresentInfoKHR present_info = {};
    present_info.sType = VK_STRUCTURE_TYPE_PRESENT_INFO_KHR;
    present_info.waitSemaphoreCount = 1;
    present_info.pWaitSemaphores = &app.renderFinished;
    present_info.swapchainCount = 1;
    present_info.pSwapchains = &app.swapchain;
    present_info.pImageIndices = &image_index;
    vkQueuePresentKHR(app.presentQueue, &present_info);

    vkWaitForFences(app.device, 1, &app.inFlightFence, VK_TRUE, UINT64_MAX);
    vkResetFences(app.device, 1, &app.inFlightFence);
}

int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
    GLFWwindow* window = glfwCreateWindow(1280, 720, "مثلث Vulkan", nullptr, nullptr);

    TriangleApp app = CreateTriangleApp(
        window,
        "shaders/triangle.vert.spv",
        "shaders/triangle.frag.spv"
    );

    while (!glfwWindowShouldClose(app.window)) {
        glfwPollEvents();
        DrawTriangleFrame(app);
    }

    DestroyTriangleApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'جوهر المثال هو `vkCmdDraw(cmd, 3, 1, 0, 0)`؛ ثلاث رؤوس فقط تكفي لرسم أول شكل مرئي عندما تكون بقية الموارد جاهزة.',
      'تبقي GLFW3 طبقة النافذة منفصلة، بينما يدخل رسم المثلث نفسه بالكامل في مسار أوامر Vulkan.',
      'التعليقات حول `CreateTriangleApp` و`DestroyTriangleApp` توضح أن المثال الكامل يبنى فوق أمثلة الإنشاء السابقة بدل تكرار كل خطوة في كل صفحة.'
    ],
    expectedResult: 'تظهر نافذة GLFW3 بعنوان عربي وخلفية داكنة يتوسطها مثلث واضح، ويبقى الرسم مستمرًا حتى يغلق المستخدم النافذة.',
    related: [
      'GLFWwindow',
      'glfwCreateWindow',
      'glfwPollEvents',
      'vkAcquireNextImageKHR',
      'vkCmdBeginRenderPass',
      'vkCmdBindPipeline',
      'vkCmdDraw',
      'vkQueueSubmit',
      'vkQueuePresentKHR'
    ],
    previewKind: 'triangle-scene',
    previewTitle: 'نافذة GLFW3 تعرض مثلث Vulkan واضحًا داخل إطار داكن حقيقي.'
  },
  {
    id: 'texture-image',
    title: 'مثال رسم صورة في Vulkan',
    goal: 'يوضح هذا المثال دورة texture كاملة: تحميل الصورة من القرص، رفعها إلى VkImage، إنشاء Image View وSampler، ثم رسمها على Quad داخل نافذة GLFW3.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'يعتمد المثال على GLFW3 وstb_image وVulkan، لذلك لا يختلف منطقيًا بين الأنظمة الثلاثة سوى أسلوب تثبيت الحزم.',
    requirements: [
      'ملف صورة صالح مثل `assets/images/logo.png`.',
      'مكتبة تحميل صور مثل `stb_image.h` أو ما يكافئها داخل مشروعك.',
      'Descriptor Set Layout يحتوي UBO أو sampler مطابقًا لما يطلبه الشيدر.'
    ],
    commandBlocks: [
      {title: 'Vertex Shader', code: 'glslangValidator -V shaders/textured_quad.vert -o shaders/textured_quad.vert.spv', language: 'bash', iconType: 'glsl'},
      {title: 'Fragment Shader', code: 'glslangValidator -V shaders/textured_quad.frag -o shaders/textured_quad.frag.spv', language: 'bash', iconType: 'glsl'}
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <stb_image.h>
#include <vulkan/vulkan.h>
#include <vector>

struct TextureQuad {
    VkImage image = VK_NULL_HANDLE;
    VkDeviceMemory imageMemory = VK_NULL_HANDLE;
    VkImageView imageView = VK_NULL_HANDLE;
    VkSampler sampler = VK_NULL_HANDLE;
    VkBuffer vertexBuffer = VK_NULL_HANDLE;
    VkBuffer indexBuffer = VK_NULL_HANDLE;
    VkDescriptorSet descriptorSet = VK_NULL_HANDLE;
};

// يعتمد المثال على AppContext يملك Device وQueues وCommand Pool وSwapchain وPipeline جاهزين.
struct AppContext;
AppContext CreateTexturedApp(GLFWwindow* window);
void DestroyTexturedApp(AppContext& app);

TextureQuad CreateTextureQuad(AppContext& app, const char* path)
{
    int width = 0;
    int height = 0;
    int channels = 0;
    stbi_uc* pixels = stbi_load(path, &width, &height, &channels, STBI_rgb_alpha);

    TextureQuad quad = {};
    VkDeviceSize upload_size = (VkDeviceSize)width * (VkDeviceSize)height * 4;

    VkBuffer staging_buffer = VK_NULL_HANDLE;
    VkDeviceMemory staging_memory = VK_NULL_HANDLE;
    CreateUploadBuffer(app, upload_size, &staging_buffer, &staging_memory);
    UploadBytes(app.device, staging_memory, pixels, upload_size);

    CreateTextureImage(app, width, height, &quad.image, &quad.imageMemory);
    CopyBufferToImage(app, staging_buffer, quad.image, width, height);
    quad.imageView = CreateTextureImageView(app.device, quad.image);
    quad.sampler = CreateTextureSampler(app.device);
    quad.vertexBuffer = CreateQuadVertexBuffer(app);
    quad.indexBuffer = CreateQuadIndexBuffer(app);
    quad.descriptorSet = WriteTextureDescriptor(app, quad.imageView, quad.sampler);

    stbi_image_free(pixels);
    DestroyBuffer(app.device, staging_buffer, staging_memory);
    return quad;
}

void RecordTexturedQuad(AppContext& app, TextureQuad& quad, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    VkBuffer vertex_buffers[] = { quad.vertexBuffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, vertex_buffers, offsets);
    vkCmdBindIndexBuffer(cmd, quad.indexBuffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdBindDescriptorSets(
        cmd,
        VK_PIPELINE_BIND_POINT_GRAPHICS,
        app.pipelineLayout,
        0,
        1,
        &quad.descriptorSet,
        0,
        nullptr
    );
    vkCmdDrawIndexed(cmd, 6, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}

int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
    GLFWwindow* window = glfwCreateWindow(1280, 720, "صورة Vulkan", nullptr, nullptr);

    AppContext app = CreateTexturedApp(window);
    TextureQuad quad = CreateTextureQuad(app, "assets/images/logo.png");

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        DrawFrame(app, [&](uint32_t image_index) {
            RecordTexturedQuad(app, quad, image_index);
        });
    }

    DestroyTextureQuad(app, quad);
    DestroyTexturedApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'ينقل المثال الصورة من `stbi_load` إلى Staging Buffer ثم إلى `VkImage` بدل محاولة القراءة من القرص مباشرة داخل الشيدر.',
      'بعد إنشاء `VkImageView` و`VkSampler` يكتب المثال Descriptor صالحًا يستطيع Fragment Shader قراءته كـ `sampler2D`.',
      'استدعاء `vkCmdDrawIndexed` بستة فهارس يرسم Quad مكوّنًا من مثلثين ويعرض الصورة عليه بشكل مباشر.'
    ],
    expectedResult: 'تظهر الصورة المختارة داخل نافذة Vulkan على Quad واضح في مركز الشاشة، مع مطابقة صحيحة للـ UV والـ sampler.',
    related: [
      'glfwCreateWindow',
      'VkImage',
      'VkImageView',
      'VkSampler',
      'VkDescriptorSet',
      'vkCmdBindDescriptorSets',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'texture-window',
    previewTitle: 'نافذة Vulkan تعرض Texture فعلية على Quad داخل واجهة واضحة.'
  },
  {
    id: 'multi-image-draw',
    title: 'مثال رسم أكثر من صورة في Vulkan',
    goal: 'يبين هذا المثال كيف تحمّل عدة صور وتربط لكل واحدة Descriptor أو بيانات transform مستقلة ثم ترسمها في مواضع مختلفة داخل الإطار نفسه.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'الفكرة نفسها محمولة بين الأنظمة الثلاثة لأن الاختلاف المنصي محصور في نافذة GLFW3، لا في إدارة textures أو الأوامر.',
    requirements: [
      'صورتان أو أكثر داخل مجلد الأصول مثل `card_a.png` و`card_b.png` و`card_c.png`.',
      'Push Constants أو UBO بسيط لنقل موضع كل صورة وحجمها إلى الشيدر.',
      'Descriptor Set Layout يحتوي binding للخامة المستخدمة في Fragment Shader.'
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <vulkan/vulkan.h>
#include <vector>

struct SpriteInstance {
    VkDescriptorSet descriptorSet = VK_NULL_HANDLE;
    VkBuffer vertexBuffer = VK_NULL_HANDLE;
    VkBuffer indexBuffer = VK_NULL_HANDLE;
    float x = 0.0f;
    float y = 0.0f;
    float width = 0.0f;
    float height = 0.0f;
};

struct SpritePushConstants {
    float offset[2];
    float size[2];
};

void RecordSpriteBatch(AppContext& app, const std::vector<SpriteInstance>& sprites, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    for (const SpriteInstance& sprite : sprites) {
        VkBuffer vertex_buffers[] = { sprite.vertexBuffer };
        VkDeviceSize offsets[] = { 0 };
        SpritePushConstants push = {
            { sprite.x, sprite.y },
            { sprite.width, sprite.height }
        };

        vkCmdBindVertexBuffers(cmd, 0, 1, vertex_buffers, offsets);
        vkCmdBindIndexBuffer(cmd, sprite.indexBuffer, 0, VK_INDEX_TYPE_UINT32);
        vkCmdBindDescriptorSets(
            cmd,
            VK_PIPELINE_BIND_POINT_GRAPHICS,
            app.pipelineLayout,
            0,
            1,
            &sprite.descriptorSet,
            0,
            nullptr
        );
        vkCmdPushConstants(
            cmd,
            app.pipelineLayout,
            VK_SHADER_STAGE_VERTEX_BIT,
            0,
            sizeof(SpritePushConstants),
            &push
        );
        vkCmdDrawIndexed(cmd, 6, 1, 0, 0, 0);
    }

    EndFramePass(app, cmd);
}

int main()
{
    GLFWwindow* window = CreateGlfwWindow("عدة صور Vulkan");
    AppContext app = CreateSpriteApp(window);

    std::vector<SpriteInstance> sprites = {
        CreateSprite(app, "assets/images/card_a.png", -0.62f,  0.28f, 0.34f, 0.34f),
        CreateSprite(app, "assets/images/card_b.png",  0.00f, -0.12f, 0.42f, 0.42f),
        CreateSprite(app, "assets/images/card_c.png",  0.54f,  0.24f, 0.30f, 0.30f)
    };

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        DrawFrame(app, [&](uint32_t image_index) {
            RecordSpriteBatch(app, sprites, image_index);
        });
    }

    DestroySprites(app, sprites);
    DestroySpriteApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'يمثل كل عنصر `SpriteInstance` صورة مستقلة تملك descriptor وموضعًا وحجمًا، لذلك لا يحتاج المثال إلى Pipeline جديد لكل صورة.',
      'تسمح Push Constants بتمرير transform صغير لكل صورة قبل أمر الرسم مباشرة من دون إعادة إنشاء buffers لكل حركة صغيرة.',
      'يتكرر `vkCmdDrawIndexed` على نفس الإطار عدة مرات مع Descriptor مختلف لكل صورة، فتظهر العناصر في مواضع مستقلة داخل النافذة نفسها.'
    ],
    expectedResult: 'تظهر عدة صور في مواقع مختلفة داخل النافذة، مع بقاء كل صورة مستقلة في موضعها وحجمها داخل نفس الإطار.',
    related: [
      'VkDescriptorSet',
      'VkPushConstantRange',
      'vkCmdPushConstants',
      'vkCmdBindDescriptorSets',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'multi-texture',
    previewTitle: 'عدة صور معروضة داخل نافذة Vulkan في مواقع وأحجام مختلفة.'
  },
  {
    id: 'transform-rotation-scale',
    title: 'مثال التحويل والحركة والتدوير في Vulkan',
    goal: 'يجمع هذا المثال Translation وRotation وScale داخل UBO واحد يحدّث كل إطار، ثم يمرره إلى Vertex Shader لرسم كائن يتحرك ويدور ويكبر أو يصغر بوضوح.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'تحديث المصفوفات والـ UBO في Vulkan لا يختلف بين الأنظمة؛ الاختلاف المنصي يبقى في طبقة النافذة فقط.',
    requirements: [
      'مكتبة رياضيات مثل GLM لتوليد مصفوفات الترجمة والدوران والتكبير.',
      'Uniform Buffer مربوط إلى الشيدر عند `set = 0, binding = 0` أو ما يكافئه في مشروعك.',
      'Pipeline يرسم Quad أو مجسمًا بسيطًا حتى ترى أثر التحويلات بوضوح.'
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vulkan/vulkan.h>

struct TransformUBO {
    glm::mat4 model;
    glm::mat4 view;
    glm::mat4 proj;
};

void UpdateTransformUbo(AppContext& app, VkDeviceMemory ubo_memory, float time_seconds)
{
    TransformUBO ubo = {};

    glm::mat4 translation = glm::translate(glm::mat4(1.0f), glm::vec3(sinf(time_seconds) * 0.65f, 0.0f, 0.0f));
    glm::mat4 rotation = glm::rotate(glm::mat4(1.0f), time_seconds * glm::radians(90.0f), glm::vec3(0.0f, 0.0f, 1.0f));
    glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(0.75f + fabsf(sinf(time_seconds)) * 0.35f));

    ubo.model = translation * rotation * scale;
    ubo.view = glm::lookAt(glm::vec3(0.0f, 0.0f, 2.2f), glm::vec3(0.0f), glm::vec3(0.0f, 1.0f, 0.0f));
    ubo.proj = glm::perspective(glm::radians(45.0f),
                                app.swapchainExtent.width / (float)app.swapchainExtent.height,
                                0.1f,
                                10.0f);
    ubo.proj[1][1] *= -1.0f;

    void* mapped = nullptr;
    vkMapMemory(app.device, ubo_memory, 0, sizeof(TransformUBO), 0, &mapped);
    memcpy(mapped, &ubo, sizeof(TransformUBO));
    vkUnmapMemory(app.device, ubo_memory);
}

int main()
{
    GLFWwindow* window = CreateGlfwWindow("التحويل والحركة والتدوير");
    AppContext app = CreateTransformApp(window);
    VkDeviceMemory transform_ubo = CreateTransformBuffer(app);

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        float time_seconds = (float)glfwGetTime();
        UpdateTransformUbo(app, transform_ubo, time_seconds);

        DrawFrame(app, [&](uint32_t image_index) {
            RecordTransformScene(app, image_index);
        });
    }

    DestroyTransformBuffer(app, transform_ubo);
    DestroyTransformApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'يفصل المثال الترجمة والدوران والتكبير في مصفوفات مستقلة ثم يضربها بالترتيب قبل رفعها إلى الشيدر.',
      'تحديث UBO كل إطار يجعل الحركة الزمنية جزءًا من دورة الرسم نفسها بدل أن تكون قيمة ثابتة وقت الإنشاء.',
      'يظهر أثر `ubo.proj[1][1] *= -1.0f` لأن إحداثيات Vulkan تختلف عن كثير من أمثلة OpenGL الجاهزة.'
    ],
    expectedResult: 'يتحرك الكائن أفقيًا، ويدور باستمرار، ويتغير حجمه بنعومة داخل المشهد نفسه، ما يجعل Translation وRotation وScale واضحة بصريًا في وقت واحد.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory',
      'VkDescriptorSetLayoutBinding',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'transform-lab',
    previewTitle: 'واجهة Vulkan تعرض كائنًا يتحرك ويدور ويتغير حجمه بوضوح.'
  },
  {
    id: 'obj-model-loading',
    title: 'مثال تحميل نموذج OBJ في Vulkan',
    goal: 'يعرض هذا المثال دورة تحميل نموذج OBJ حقيقي: قراءة الملف، تحويله إلى رؤوس وفهارس، إنشاء Vertex Buffer وIndex Buffer، ثم رسم النموذج عبر vkCmdDrawIndexed.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'تحميل OBJ نفسه محمول بين الأنظمة الثلاثة، ويختلف فقط مسار الملف أو ربط المكتبة المساعدة مثل tinyobjloader.',
    requirements: [
      'ملف OBJ صالح مثل `assets/models/helmet.obj` أو أي نموذج بسيط مشابه.',
      'مكتبة صغيرة للقراءة مثل `tiny_obj_loader.h` أو كود محلي يفسر صيغة OBJ.',
      'Pipeline يملك توصيف Vertex Input يطابق البنية `Vertex` المستخدمة في النموذج.'
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <tiny_obj_loader.h>
#include <unordered_map>
#include <vector>
#include <vulkan/vulkan.h>

struct Vertex {
    float position[3];
    float uv[2];
};

struct ModelBuffers {
    VkBuffer vertexBuffer = VK_NULL_HANDLE;
    VkDeviceMemory vertexMemory = VK_NULL_HANDLE;
    VkBuffer indexBuffer = VK_NULL_HANDLE;
    VkDeviceMemory indexMemory = VK_NULL_HANDLE;
    uint32_t indexCount = 0;
};

ModelBuffers LoadObjModel(AppContext& app, const char* path)
{
    tinyobj::attrib_t attrib;
    std::vector<tinyobj::shape_t> shapes;
    std::vector<tinyobj::material_t> materials;
    std::string warn;
    std::string err;
    tinyobj::LoadObj(&attrib, &shapes, &materials, &warn, &err, path);

    std::vector<Vertex> vertices;
    std::vector<uint32_t> indices;

    for (const tinyobj::shape_t& shape : shapes) {
        for (const tinyobj::index_t& index : shape.mesh.indices) {
            Vertex vertex = {};
            vertex.position[0] = attrib.vertices[3 * index.vertex_index + 0];
            vertex.position[1] = attrib.vertices[3 * index.vertex_index + 1];
            vertex.position[2] = attrib.vertices[3 * index.vertex_index + 2];

            if (index.texcoord_index >= 0) {
                vertex.uv[0] = attrib.texcoords[2 * index.texcoord_index + 0];
                vertex.uv[1] = 1.0f - attrib.texcoords[2 * index.texcoord_index + 1];
            }

            indices.push_back((uint32_t)vertices.size());
            vertices.push_back(vertex);
        }
    }

    ModelBuffers model = {};
    model.vertexBuffer = CreateDeviceLocalVertexBuffer(app, vertices.data(), vertices.size() * sizeof(Vertex), &model.vertexMemory);
    model.indexBuffer = CreateDeviceLocalIndexBuffer(app, indices.data(), indices.size() * sizeof(uint32_t), &model.indexMemory);
    model.indexCount = (uint32_t)indices.size();
    return model;
}

void RecordModelScene(AppContext& app, const ModelBuffers& model, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    VkBuffer vertex_buffers[] = { model.vertexBuffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, vertex_buffers, offsets);
    vkCmdBindIndexBuffer(cmd, model.indexBuffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdDrawIndexed(cmd, model.indexCount, 1, 0, 0, 0);

    EndFramePass(app, cmd);
}

int main()
{
    GLFWwindow* window = CreateGlfwWindow("نموذج OBJ في Vulkan");
    AppContext app = CreateModelApp(window);
    ModelBuffers model = LoadObjModel(app, "assets/models/helmet.obj");

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        DrawFrame(app, [&](uint32_t image_index) {
            RecordModelScene(app, model, image_index);
        });
    }

    DestroyModelBuffers(app, model);
    DestroyModelApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'يتحول ملف OBJ أولًا إلى قوائم رؤوس وفهارس، ثم تنشأ buffers فعلية من هذه البيانات قبل أول رسم.',
      'يستخدم `vkCmdDrawIndexed` عدد الفهارس الناتج من الملف، لذلك يصبح المثال مناسبًا لنماذج حقيقية لا لمثلثات ثابتة فقط.',
      'يعكس قلب الإحداثي `v` في UV الفرق الشائع بين تنسيق OBJ وطريقة قراءة معظم textures داخل شيدر Vulkan.'
    ],
    expectedResult: 'يظهر نموذج OBJ حقيقي داخل نافذة Vulkan بدل الأشكال الاصطناعية البسيطة، مع رسم كل أوجهه من Vertex Buffer وIndex Buffer فعليين.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'VkVertexInputBindingDescription',
      'VkVertexInputAttributeDescription',
      'vkCmdBindVertexBuffers',
      'vkCmdBindIndexBuffer',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'obj-viewer',
    previewTitle: 'عارض نموذج OBJ داخل نافذة Vulkan مع لوحة خصائص جانبية.'
  },
  {
    id: 'glsl-file-pipeline',
    title: 'مثال قراءة ملفات GLSL وتحويلها واستخدامها في Pipeline',
    goal: 'يربط هذا المثال بين الملفات النصية ومرحلة الإنشاء داخل Vulkan: قراءة shader من ملف، ترجمته إلى SPIR-V، ثم إنشاء Shader Modules وربطها في Graphics Pipeline.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'الملفات النصية والأوامر نفسها محمولة بين الأنظمة الثلاثة، بينما يختلف فقط أسلوب استدعاء الأداة من build script أو الطرفية.',
    requirements: [
      'ملفا `mesh.vert` و`mesh.frag` بصيغة GLSL داخل مجلد الشيدر.',
      'أداة `glslangValidator` موجودة في `PATH` أو معروفة المسار داخل نظام البناء.',
      'Pipeline Layout وRender Pass جاهزان قبل استدعاء vkCreateGraphicsPipelines.'
    ],
    commandBlocks: [
      {title: 'تحويل Vertex Shader', code: 'glslangValidator -V shaders/mesh.vert -o shaders/mesh.vert.spv', language: 'bash', iconType: 'glsl'},
      {title: 'تحويل Fragment Shader', code: 'glslangValidator -V shaders/mesh.frag -o shaders/mesh.frag.spv', language: 'bash', iconType: 'glsl'}
    ],
    code: `#include <fstream>
#include <string>
#include <vector>
#include <vulkan/vulkan.h>

std::vector<char> ReadBinaryFile(const std::string& path)
{
    std::ifstream file(path, std::ios::ate | std::ios::binary);
    size_t size = (size_t)file.tellg();
    std::vector<char> bytes(size);
    file.seekg(0);
    file.read(bytes.data(), (std::streamsize)size);
    return bytes;
}

VkShaderModule CreateShaderModule(VkDevice device, const std::vector<char>& bytes)
{
    VkShaderModuleCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
    create_info.codeSize = bytes.size();
    create_info.pCode = reinterpret_cast<const uint32_t*>(bytes.data());

    VkShaderModule shader_module = VK_NULL_HANDLE;
    vkCreateShaderModule(device, &create_info, nullptr, &shader_module);
    return shader_module;
}

VkPipeline BuildPipelineFromShaderFiles(VkDevice device,
                                        VkRenderPass render_pass,
                                        VkPipelineLayout pipeline_layout,
                                        VkExtent2D extent)
{
    const std::vector<char> vert_spv = ReadBinaryFile("shaders/mesh.vert.spv");
    const std::vector<char> frag_spv = ReadBinaryFile("shaders/mesh.frag.spv");

    VkShaderModule vert_module = CreateShaderModule(device, vert_spv);
    VkShaderModule frag_module = CreateShaderModule(device, frag_spv);

    VkPipelineShaderStageCreateInfo stages[2] = {};
    stages[0].sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    stages[0].stage = VK_SHADER_STAGE_VERTEX_BIT;
    stages[0].module = vert_module;
    stages[0].pName = "main";

    stages[1].sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    stages[1].stage = VK_SHADER_STAGE_FRAGMENT_BIT;
    stages[1].module = frag_module;
    stages[1].pName = "main";

    VkGraphicsPipelineCreateInfo pipeline_info = {};
    pipeline_info.sType = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
    pipeline_info.stageCount = 2;
    pipeline_info.pStages = stages;
    pipeline_info.renderPass = render_pass;
    pipeline_info.layout = pipeline_layout;
    pipeline_info.subpass = 0;
    FillFixedFunctionBlocks(extent, &pipeline_info);

    VkPipeline pipeline = VK_NULL_HANDLE;
    vkCreateGraphicsPipelines(device, VK_NULL_HANDLE, 1, &pipeline_info, nullptr, &pipeline);

    vkDestroyShaderModule(device, frag_module, nullptr);
    vkDestroyShaderModule(device, vert_module, nullptr);
    return pipeline;
}`,
    highlights: [
      'يبقي المثال ملفات GLSL النصية مستقلة عن Vulkan وقت التشغيل، ثم يقرأ نسخ SPIR-V الثنائية فقط عند إنشاء Shader Module.',
      'تجعل أوامر glslangValidator خطوة التحويل واضحة وقابلة للإضافة إلى CMake أو أي build script آخر.',
      'بعد إنشاء `VkShaderModule` لا يعود البرنامج بحاجة إلى الملفات الثنائية في الذاكرة، لذلك يتلفها بعد بناء الـ Pipeline.'
    ],
    expectedResult: 'يستطيع التطبيق قراءة shaders من ملفات منفصلة وتحويلها إلى Pipeline صالح، ما يجعل تحديث الشيدر أو استبداله عملية منظمة بدل كتابة البايتات يدويًا داخل الكود.',
    related: [
      'VkShaderModule',
      'VkShaderModuleCreateInfo',
      'VkPipelineShaderStageCreateInfo',
      'vkCreateShaderModule',
      'vkCreateGraphicsPipelines',
      'vkDestroyShaderModule'
    ],
    previewKind: 'shader-files',
    previewTitle: 'ملفات GLSL تتحول إلى SPIR-V ثم تدخل مباشرة في Pipeline Vulkan.'
  },
  {
    id: 'rotating-images',
    title: 'مثال تدوير الصور في Vulkan',
    goal: 'يركز هذا المثال على تدوير صور textures داخل Vulkan باستخدام مصفوفة تحويل لكل Sprite، بحيث ترى أثر الدوران من دون تغيير بيانات الصورة نفسها.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'يعتمد المثال على تحديث transform صغير لكل صورة، وهو نفس النمط على جميع الأنظمة عند استخدام Vulkan وGLFW3.',
    requirements: [
      'Texture جاهزة لكل صورة تريد تدويرها.',
      'Push Constants أو UBO يحتوي مصفوفة model لكل Sprite.',
      'Vertex Shader يقرأ مصفوفة التحويل ويطبقها قبل كتابة gl_Position.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vulkan/vulkan.h>

struct SpriteRotationPush {
    glm::mat4 model;
};

void RecordRotatingSprites(AppContext& app,
                           const std::vector<SpriteInstance>& sprites,
                           uint32_t image_index,
                           float time_seconds)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    for (size_t i = 0; i < sprites.size(); ++i) {
        const SpriteInstance& sprite = sprites[i];
        glm::mat4 translation = glm::translate(glm::mat4(1.0f), glm::vec3(sprite.x, sprite.y, 0.0f));
        glm::mat4 rotation = glm::rotate(glm::mat4(1.0f),
                                         time_seconds * (0.6f + (float)i * 0.35f),
                                         glm::vec3(0.0f, 0.0f, 1.0f));
        glm::mat4 scale = glm::scale(glm::mat4(1.0f), glm::vec3(sprite.width, sprite.height, 1.0f));

        SpriteRotationPush push = { translation * rotation * scale };

        vkCmdBindDescriptorSets(cmd,
                                VK_PIPELINE_BIND_POINT_GRAPHICS,
                                app.pipelineLayout,
                                0,
                                1,
                                &sprite.descriptorSet,
                                0,
                                nullptr);
        vkCmdPushConstants(cmd,
                           app.pipelineLayout,
                           VK_SHADER_STAGE_VERTEX_BIT,
                           0,
                           sizeof(SpriteRotationPush),
                           &push);
        vkCmdDrawIndexed(cmd, 6, 1, 0, 0, 0);
    }

    EndFramePass(app, cmd);
}

int main()
{
    GLFWwindow* window = CreateGlfwWindow("تدوير الصور في Vulkan");
    AppContext app = CreateSpriteApp(window);
    std::vector<SpriteInstance> sprites = CreateRotatingSpriteSet(app);

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
        float time_seconds = (float)glfwGetTime();
        DrawFrame(app, [&](uint32_t image_index) {
            RecordRotatingSprites(app, sprites, image_index, time_seconds);
        });
    }

    DestroySprites(app, sprites);
    DestroySpriteApp(app);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'لا تتغير الصورة الأصلية نفسها؛ ما يتغير هو مصفوفة `model` التي يطبقها Vertex Shader على Quad الحامل للصورة.',
      'يمنح Push Constants تحديثًا سريعًا لكل صورة، لذلك يصبح تدوير أكثر من Sprite في إطار واحد مباشرًا وواضحًا.',
      'اختلاف سرعة الدوران بحسب فهرس العنصر يجعل النتيجة البصرية أوضح من تدوير كل الصور بنفس السرعة.'
    ],
    expectedResult: 'تظهر عدة صور تدور بسلاسة داخل المشهد، وكل صورة تدور حول مركزها من دون أن تتشوه بيانات texture الأصلية.',
    related: [
      'VkPushConstantRange',
      'vkCmdPushConstants',
      'vkCmdBindDescriptorSets',
      'vkCmdDrawIndexed',
      'VkDescriptorSet'
    ],
    previewKind: 'rotating-sprites',
    previewTitle: 'مجموعة صور تدور داخل نافذة Vulkan باستخدام مصفوفة تحويل لكل صورة.'
  },
  {
    id: 'device-info-dashboard',
    title: 'مثال معرفة معلومات الجهاز في Vulkan',
    goal: 'يعرض هذا المثال معلومات العتاد والنظام التي يحتاجها مطور Vulkan عادة: اسم GPU، نوع البطاقة، إجمالي VRAM المحلي، نظام التشغيل، المعالج، والرام، ثم يطبعها بشكل منظم قبل فتح النافذة.',
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'يستخدم المثال استدعاءات Vulkan نفسها لقراءة معلومات GPU، ويضيف طبقة نظام خفيفة لاستخراج OS وRAM وCPU بشكل مناسب لكل منصة.',
    requirements: [
      'Vulkan SDK مثبت حتى يستطيع المثال تعداد الأجهزة الفيزيائية وقراءة خصائص الذاكرة.',
      'نافذة GLFW3 بسيطة فقط للإبقاء على التطبيق مفتوحًا بعد طباعة النتائج.',
      'بعض تفاصيل CPU أو RAM تعتمد على استدعاءات منصة أصلية خفيفة مثل `GlobalMemoryStatusEx` أو `sysinfo` أو `sysctlbyname`.'
    ],
    code: `#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <vulkan/vulkan.h>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#if defined(_WIN32)
#include <windows.h>
#elif defined(__APPLE__)
#include <sys/sysctl.h>
#include <sys/utsname.h>
#else
#include <sys/sysinfo.h>
#include <sys/utsname.h>
#endif

uint64_t GetSystemRamMB()
{
#if defined(_WIN32)
    MEMORYSTATUSEX state = {};
    state.dwLength = sizeof(state);
    GlobalMemoryStatusEx(&state);
    return (uint64_t)(state.ullTotalPhys / (1024ull * 1024ull));
#elif defined(__APPLE__)
    uint64_t bytes = 0;
    size_t size = sizeof(bytes);
    sysctlbyname("hw.memsize", &bytes, &size, NULL, 0);
    return bytes / (1024ull * 1024ull);
#else
    struct sysinfo info = {};
    sysinfo(&info);
    return (uint64_t)(info.totalram * info.mem_unit / (1024ull * 1024ull));
#endif
}

std::string GetCpuLabel()
{
#if defined(_WIN32)
    const char* identifier = std::getenv("PROCESSOR_IDENTIFIER");
    return identifier ? identifier : "Unknown CPU";
#elif defined(__APPLE__)
    char buffer[256] = {};
    size_t size = sizeof(buffer);
    if (sysctlbyname("machdep.cpu.brand_string", buffer, &size, NULL, 0) == 0) {
        return std::string(buffer);
    }
    return "Unknown CPU";
#else
    std::ifstream cpuinfo("/proc/cpuinfo");
    std::string line;
    const std::string prefix = "model name\\t: ";

    while (std::getline(cpuinfo, line)) {
        if (line.rfind(prefix, 0) == 0) {
            return line.substr(prefix.size());
        }
    }

    return "Unknown CPU";
#endif
}

std::string GetPlatformLabel()
{
#if defined(_WIN32)
    return "Windows";
#elif defined(__APPLE__)
    return "macOS";
#else
    return "Linux";
#endif
}

const char* GetGpuTypeLabel(VkPhysicalDeviceType type)
{
    switch (type) {
        case VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU:
            return "بطاقة مدمجة";
        case VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU:
            return "بطاقة منفصلة";
        case VK_PHYSICAL_DEVICE_TYPE_VIRTUAL_GPU:
            return "بطاقة افتراضية";
        case VK_PHYSICAL_DEVICE_TYPE_CPU:
            return "تنفيذ على المعالج";
        default:
            return "غير معروف";
    }
}

VkInstance CreateInstanceForInfo()
{
    VkApplicationInfo app_info = {};
    app_info.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
    app_info.pApplicationName = "Hardware Info";
    app_info.apiVersion = VK_API_VERSION_1_3;

    VkInstanceCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
    create_info.pApplicationInfo = &app_info;

    VkInstance instance = VK_NULL_HANDLE;
    vkCreateInstance(&create_info, nullptr, &instance);
    return instance;
}

VkPhysicalDevice PickFirstDevice(VkInstance instance)
{
    uint32_t count = 0;
    vkEnumeratePhysicalDevices(instance, &count, nullptr);
    std::vector<VkPhysicalDevice> devices(count);
    vkEnumeratePhysicalDevices(instance, &count, devices.data());
    return devices.empty() ? VK_NULL_HANDLE : devices[0];
}

int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
    GLFWwindow* window = glfwCreateWindow(960, 540, "معلومات جهاز Vulkan", nullptr, nullptr);

    VkInstance instance = CreateInstanceForInfo();
    VkPhysicalDevice gpu = PickFirstDevice(instance);

    VkPhysicalDeviceProperties props = {};
    VkPhysicalDeviceMemoryProperties memory = {};
    vkGetPhysicalDeviceProperties(gpu, &props);
    vkGetPhysicalDeviceMemoryProperties(gpu, &memory);

    uint64_t vram_mb = 0;
    for (uint32_t i = 0; i < memory.memoryHeapCount; ++i) {
        if (memory.memoryHeaps[i].flags & VK_MEMORY_HEAP_DEVICE_LOCAL_BIT) {
            vram_mb += memory.memoryHeaps[i].size / (1024ull * 1024ull);
        }
    }

    std::cout
        << "النظام: " << GetPlatformLabel() << "\\n"
        << "المعالج: " << GetCpuLabel() << "\\n"
        << "اسم بطاقة الرسوميات: " << props.deviceName << "\\n"
        << "نوع البطاقة: " << GetGpuTypeLabel(props.deviceType) << "\\n"
        << "ذاكرة VRAM بالميغابايت: " << vram_mb << "\\n"
        << "الرام بالميغابايت: " << GetSystemRamMB() << "\\n";

    while (!glfwWindowShouldClose(window)) {
        glfwPollEvents();
    }

    vkDestroyInstance(instance, nullptr);
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}`,
    highlights: [
      'يعتمد اسم GPU ونوعه وخصائص الذاكرة على `vkGetPhysicalDeviceProperties` و`vkGetPhysicalDeviceMemoryProperties` مباشرة، لذلك تبقى بيانات Vulkan الرسمية في قلب المثال.',
      'تجمع الحلقة على heaps التي تحمل `VK_MEMORY_HEAP_DEVICE_LOCAL_BIT` حجم VRAM المحلي القابل للاستخدام من جهة البطاقة.',
      'إضافة طبقة نظام خفيفة للرام ونظام التشغيل تجعل المثال عمليًا لأدوات diagnostics داخل المحركات أو شاشات الإعدادات.'
    ],
    expectedResult: 'يطبع التطبيق معلومات العتاد والنظام في الطرفية، ثم يبقي نافذة بسيطة مفتوحة حتى يتأكد المطور من أن المعلومات قُرئت من نفس الجلسة الرسومية الصحيحة.',
    related: [
      'VkPhysicalDevice',
      'VkPhysicalDeviceProperties',
      'VkPhysicalDeviceMemoryProperties',
      'vkEnumeratePhysicalDevices',
      'vkGetPhysicalDeviceProperties',
      'vkGetPhysicalDeviceMemoryProperties',
      'VK_MEMORY_HEAP_DEVICE_LOCAL_BIT',
      'glfwCreateWindow'
    ],
    previewKind: 'hardware-dashboard',
    previewTitle: 'لوحة معلومات جهاز في Vulkan تعرض GPU وVRAM والنظام والذاكرة.'
  },
  {
    id: 'special-constants',
    title: 'مثال الثوابت الخاصة والحدود الجاهزة',
    aliases: [
      'VK_MAX_PHYSICAL_DEVICE_NAME_SIZE_example',
      'VK_UUID_SIZE_example',
      'VK_MAX_EXTENSION_NAME_SIZE_example',
      'VK_MAX_DESCRIPTION_SIZE_example',
      'VK_WHOLE_SIZE_example',
      'VK_ATTACHMENT_UNUSED_example',
      'VK_QUEUE_FAMILY_IGNORED_example',
      'VK_SUBPASS_EXTERNAL_example',
      'VK_REMAINING_MIP_LEVELS_example',
      'VK_REMAINING_ARRAY_LAYERS_example'
    ],
    goal: 'يجمع هذا المثال أشهر الثوابت الخاصة في Vulkan داخل مقطع واحد يوضح كيف تستخدم الحدود الجاهزة وقيم التمثيل الخاصة داخل النسخ والانتقالات والتبعيات وتعريفات السلاسل النصية.',
    requirements: [
      'يكفي تضمين ترويسة Vulkan، مع `<array>` إذا أردت مصفوفات ثابتة للحجوم.',
      'المثال توضيحي ويصلح كمرجع سريع عند نسيان معنى الثوابت الخاصة في النسخ أو التبعيات أو التحقق من الأحجام.',
      'بعض هذه القيم لا تعني رقماً عادياً، بل ترمز إلى سلوك خاص تفهمه Vulkan مباشرة.'
    ],
    code: `#include <array>
#include <vulkan/vulkan.h>

void FillSpecialRanges()
{
    char device_name[VK_MAX_PHYSICAL_DEVICE_NAME_SIZE] = {};
    char extension_name[VK_MAX_EXTENSION_NAME_SIZE] = {};
    char description[VK_MAX_DESCRIPTION_SIZE] = {};
    std::array<uint8_t, VK_UUID_SIZE> uuid = {};

    VkBufferCopy full_copy = {};
    full_copy.size = VK_WHOLE_SIZE;

    VkImageSubresourceRange full_range = {};
    full_range.baseMipLevel = 0;
    full_range.levelCount = VK_REMAINING_MIP_LEVELS;
    full_range.baseArrayLayer = 0;
    full_range.layerCount = VK_REMAINING_ARRAY_LAYERS;

    VkImageMemoryBarrier barrier = {};
    barrier.srcQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;
    barrier.dstQueueFamilyIndex = VK_QUEUE_FAMILY_IGNORED;

    VkSubpassDependency dependency = {};
    dependency.srcSubpass = VK_SUBPASS_EXTERNAL;
    dependency.dstSubpass = 0;

    VkAttachmentReference resolve_attachment = {};
    resolve_attachment.attachment = VK_ATTACHMENT_UNUSED;
}`,
    highlights: [
      'لا تمثل ثوابت الأحجام مثل VK_MAX_PHYSICAL_DEVICE_NAME_SIZE وVK_UUID_SIZE أسماءً تجميلية فقط، بل تحدد سعات يجب احترامها عند قراءة البيانات من العتاد أو من خصائص الامتدادات.',
      'تعني قيم مثل VK_WHOLE_SIZE وVK_REMAINING_MIP_LEVELS وVK_REMAINING_ARRAY_LAYERS أن Vulkan ستكمل النطاق تلقائيًا بدل مطالبتك بحساب العدد يدويًا.',
      'أما قيم مثل VK_QUEUE_FAMILY_IGNORED وVK_SUBPASS_EXTERNAL وVK_ATTACHMENT_UNUSED فهي ليست أرقام تشغيل عامة، بل إشارات خاصة تغيّر تفسير الحقل نفسه داخل التبعيات والحواجز والمرفقات.'
    ],
    expectedResult: 'يحصل القارئ على مرجع عملي واحد لأكثر الثوابت الخاصة تكرارًا في Vulkan، مع فهم واضح لماذا لا ينبغي استبدالها بأرقام حرفية أو افتراضات محلية.',
    related: [
      'VK_MAX_PHYSICAL_DEVICE_NAME_SIZE',
      'VK_UUID_SIZE',
      'VK_MAX_EXTENSION_NAME_SIZE',
      'VK_MAX_DESCRIPTION_SIZE',
      'VK_WHOLE_SIZE',
      'VK_ATTACHMENT_UNUSED',
      'VK_QUEUE_FAMILY_IGNORED',
      'VK_SUBPASS_EXTERNAL',
      'VK_REMAINING_MIP_LEVELS',
      'VK_REMAINING_ARRAY_LAYERS'
    ],
    previewKind: 'constants',
    previewTitle: 'شبكة سريعة تلخص الثوابت الخاصة والحدود الجاهزة الأكثر استخدامًا في Vulkan.'
  },
  {
    id: 'instance-cleanup',
    title: 'مثال تنظيف الموارد ثم تدمير VkInstance',
    aliases: [
      'vkDestroyInstance_example'
    ],
    goal: 'يركز هذا المثال على نهاية عمر التهيئة: تدمير الموارد التابعة للمثيل مثل السطح ومرسال التصحيح أولًا، ثم استدعاء vkDestroyInstance أخيرًا مع إعادة المقابض إلى VK_NULL_HANDLE.',
    requirements: [
      'VkInstance أُنشئ مسبقًا، وربما معه VkSurfaceKHR أو VkDebugUtilsMessengerEXT.',
      'يجب أن تكون الموارد التابعة للمثيل غير مستخدمة عند لحظة التدمير.',
      'المثال مناسب لوضعه داخل دالة الإغلاق أو مرحلة shutdown الخاصة بالتطبيق.'
    ],
    code: `#include <vulkan/vulkan.h>

void ShutdownInstanceObjects(
    VkInstance* instance,
    VkSurfaceKHR* surface,
    VkDebugUtilsMessengerEXT* debug_messenger)
{
    if (!instance || *instance == VK_NULL_HANDLE) {
        return;
    }

    if (surface && *surface != VK_NULL_HANDLE) {
        vkDestroySurfaceKHR(*instance, *surface, nullptr);
        *surface = VK_NULL_HANDLE;
    }

    if (debug_messenger && *debug_messenger != VK_NULL_HANDLE) {
        PFN_vkDestroyDebugUtilsMessengerEXT destroy_debug_messenger =
            reinterpret_cast<PFN_vkDestroyDebugUtilsMessengerEXT>(
                vkGetInstanceProcAddr(*instance, "vkDestroyDebugUtilsMessengerEXT"));

        if (destroy_debug_messenger) {
            destroy_debug_messenger(*instance, *debug_messenger, nullptr);
        }
        *debug_messenger = VK_NULL_HANDLE;
    }

    vkDestroyInstance(*instance, nullptr);
    *instance = VK_NULL_HANDLE;
}`,
    highlights: [
      'ينتمي vkDestroyInstance إلى آخر خطوة في هذا المسار، لأن أي كائن مشتق من VkInstance يجب أن يختفي قبله لا بعده.',
      'استخدام vkGetInstanceProcAddr مع vkDestroyDebugUtilsMessengerEXT يوضح كيف تتعامل بعض عمليات التدمير الخاصة بالامتدادات مع دوال لا ترتبط مباشرة بالترويسة الأساسية فقط.',
      'إعادة المقابض إلى VK_NULL_HANDLE بعد التدمير ليست تجميلًا، بل تمنع عودة استعمال قيمة قديمة في مسار shutdown أو إعادة التهيئة.'
    ],
    expectedResult: 'ينتهي التطبيق بترتيب تنظيف واضح: الموارد التابعة للمثيل تُدمَّر أولًا، ثم يُغلق VkInstance نفسه من دون ترك مقابض قديمة صالحة ظاهريًا.',
    related: [
      'VkInstance',
      'VkSurfaceKHR',
      'VkDebugUtilsMessengerEXT',
      'vkDestroySurfaceKHR',
      'vkDestroyInstance',
      'vkGetInstanceProcAddr',
      'VK_NULL_HANDLE'
    ],
    previewKind: 'instance',
    previewTitle: 'تنظيف كائنات المثيل قبل إغلاق VkInstance نفسه.'
  }
];

function createVulkanCatalogExample(config = {}) {
  return {
    platforms: ['Windows', 'Linux', 'macOS'],
    platformNote: 'الفكرة البرمجية نفسها تعمل على Windows وLinux وmacOS، بينما يختلف فقط ربط الحزم أو طبقة النافذة أو مسار الملفات.',
    difficulty: 'متوسط',
    requirements: [],
    highlights: [],
    related: [],
    ...config
  };
}

const ADDITIONAL_VULKAN_READY_EXAMPLES = Object.freeze([
  createVulkanCatalogExample({
    id: 'image-views',
    title: 'مثال إنشاء Image Views',
    difficulty: 'أساسي',
    goal: 'يوضح هذا المثال كيف تتحول صور VkSwapchainKHR الخام إلى VkImageView قابلة للاستخدام داخل Framebuffer وRender Pass.',
    requirements: [
      'VkDevice جاهز وصيغة صور Swapchain معروفة مسبقاً.',
      'مصفوفة صور VkImage صادرة من vkGetSwapchainImagesKHR.',
      'معرفة التنسيق النهائي الذي سيقرأه Render Pass وPipeline لاحقاً.'
    ],
    code: `#include <vector>
#include <vulkan/vulkan.h>

std::vector<VkImageView> CreateSwapchainImageViews(VkDevice device,
                                                   VkFormat format,
                                                   const std::vector<VkImage>& images)
{
    std::vector<VkImageView> views;
    views.reserve(images.size());

    for (VkImage image : images) {
        VkImageViewCreateInfo create_info = {};
        create_info.sType = VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO;
        create_info.image = image;
        create_info.viewType = VK_IMAGE_VIEW_TYPE_2D;
        create_info.format = format;
        create_info.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        create_info.subresourceRange.baseMipLevel = 0;
        create_info.subresourceRange.levelCount = 1;
        create_info.subresourceRange.baseArrayLayer = 0;
        create_info.subresourceRange.layerCount = 1;

        VkImageView view = VK_NULL_HANDLE;
        if (vkCreateImageView(device, &create_info, nullptr, &view) == VK_SUCCESS) {
            views.push_back(view);
        }
    }

    return views;
}`,
    highlights: [
      'الصورة VkImage وحدها لا تكفي لمعظم مسارات الرسم؛ يجب إنشاء VkImageView يحدد كيف ستقرأ هذه الصورة فعلياً.',
      'الحقل aspectMask هو ما يحدد أن هذا العرض خاص باللون، لا بالعمق أو الاستنسل.',
      'ينتج المثال Image View مستقلاً لكل صورة في Swapchain حتى يمكن بناء Framebuffer مقابل كل صورة لاحقاً.'
    ],
    expectedResult: 'ينتهي المثال بقائمة من VkImageView جاهزة للربط في Framebuffers ومسار الرسم اللاحق.',
    related: [
      'VkImage',
      'VkImageView',
      'VkImageViewCreateInfo',
      'vkCreateImageView',
      'VK_IMAGE_VIEW_TYPE_2D',
      'VK_IMAGE_ASPECT_COLOR_BIT'
    ],
    previewKind: 'swapchain',
    previewTitle: 'صور Swapchain بعد تحويلها إلى Image Views جاهزة للربط في Framebuffer.'
  }),
  createVulkanCatalogExample({
    id: 'framebuffers',
    title: 'مثال إنشاء Framebuffers',
    difficulty: 'أساسي',
    goal: 'يشرح هذا المثال كيف يربط التطبيق بين VkRenderPass وVkImageView عبر VkFramebuffer حتى يصبح لكل صورة هدف رسم كامل.',
    requirements: [
      'VkRenderPass صالح وصور العرض Image Views موجودة مسبقاً.',
      'أبعاد Swapchain معروفة عبر VkExtent2D.',
      'يمكن إضافة مرفق عمق لاحقاً بنفس النمط عند الحاجة.'
    ],
    code: `#include <vector>
#include <vulkan/vulkan.h>

std::vector<VkFramebuffer> CreateFramebuffers(VkDevice device,
                                              VkRenderPass render_pass,
                                              const std::vector<VkImageView>& color_views,
                                              VkExtent2D extent)
{
    std::vector<VkFramebuffer> framebuffers;
    framebuffers.reserve(color_views.size());

    for (VkImageView color_view : color_views) {
        VkImageView attachments[] = { color_view };

        VkFramebufferCreateInfo create_info = {};
        create_info.sType = VK_STRUCTURE_TYPE_FRAMEBUFFER_CREATE_INFO;
        create_info.renderPass = render_pass;
        create_info.attachmentCount = 1;
        create_info.pAttachments = attachments;
        create_info.width = extent.width;
        create_info.height = extent.height;
        create_info.layers = 1;

        VkFramebuffer framebuffer = VK_NULL_HANDLE;
        if (vkCreateFramebuffer(device, &create_info, nullptr, &framebuffer) == VK_SUCCESS) {
            framebuffers.push_back(framebuffer);
        }
    }

    return framebuffers;
}`,
    highlights: [
      'كل VkFramebuffer يربط Render Pass محدداً بمرفقات فعلية قابلة للرسم في هذه اللحظة.',
      'يحتاج التطبيق عادة Framebuffer واحداً لكل صورة من صور Swapchain.',
      'يطابق عرض وارتفاع Framebuffer أبعاد الصور التي سيرسم فيها فعلياً.'
    ],
    expectedResult: 'يصبح لكل صورة معروضة Framebuffer مستقل يمكن بدء Render Pass فوقه عند تسجيل الأوامر.',
    related: [
      'VkFramebuffer',
      'VkFramebufferCreateInfo',
      'VkRenderPass',
      'VkImageView',
      'vkCreateFramebuffer'
    ],
    previewKind: 'renderpass',
    previewTitle: 'ربط Render Pass مع Image Views لتكوين Framebuffers جاهزة للرسم.'
  }),
  createVulkanCatalogExample({
    id: 'command-pool',
    title: 'مثال إنشاء Command Pool',
    difficulty: 'أساسي',
    goal: 'يوضح هذا المثال كيف ينشئ التطبيق Command Pool مرتبطاً بعائلة طوابير الرسوميات حتى يستطيع تخصيص Command Buffers منها.',
    requirements: [
      'VkDevice جاهز ورقم graphics queue family معروف.',
      'فهم أن Command Pool يرتبط بعائلة طوابير واحدة محددة.',
      'الحاجة إلى تسجيل وإعادة استخدام Command Buffers في مرحلة الرسم.'
    ],
    code: `#include <vulkan/vulkan.h>

VkCommandPool CreateGraphicsCommandPool(VkDevice device, uint32_t graphics_family)
{
    VkCommandPoolCreateInfo create_info = {};
    create_info.sType = VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO;
    create_info.queueFamilyIndex = graphics_family;
    create_info.flags = VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT;

    VkCommandPool command_pool = VK_NULL_HANDLE;
    if (vkCreateCommandPool(device, &create_info, nullptr, &command_pool) != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    return command_pool;
}`,
    highlights: [
      'يربط queueFamilyIndex هذا الـ pool بعائلة الطوابير التي ستنفذ الأوامر الخارجة منه.',
      'يسمح العلم VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT بإعادة ضبط Command Buffer منفرد بدل إعادة ضبط الـ pool كله.',
      'بدون Command Pool لا يمكن تخصيص أي VkCommandBuffer بطريقة رسمية في Vulkan.'
    ],
    expectedResult: 'يحصل التطبيق على VkCommandPool صالح يستطيع تخصيص Command Buffers للرسم أو النقل منه.',
    related: [
      'VkCommandPool',
      'VkCommandPoolCreateInfo',
      'vkCreateCommandPool',
      'VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT'
    ],
    previewKind: 'frame',
    previewTitle: 'تجهيز Command Pool قبل تخصيص Command Buffers للرسم.'
  }),
  createVulkanCatalogExample({
    id: 'command-buffer-recording',
    title: 'مثال تسجيل Command Buffer',
    difficulty: 'أساسي',
    goal: 'يركز هذا المثال على دورة Begin وRecord وEnd الخاصة بـ VkCommandBuffer عند تسجيل أوامر رسم إطار واحد.',
    requirements: [
      'VkCommandPool وVkFramebuffer وVkRenderPass وVkPipeline جاهزة مسبقاً.',
      'وجود VkCommandBuffer مخصص سلفاً من الـ pool المناسب.',
      'الرغبة في فهم أين توضع أوامر vkCmdBeginRenderPass وvkCmdBindPipeline وvkCmdDraw.'
    ],
    code: `#include <vulkan/vulkan.h>

bool RecordSingleFrame(VkCommandBuffer cmd,
                       VkRenderPass render_pass,
                       VkFramebuffer framebuffer,
                       VkExtent2D extent,
                       VkPipeline pipeline)
{
    VkCommandBufferBeginInfo begin_info = {};
    begin_info.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    if (vkBeginCommandBuffer(cmd, &begin_info) != VK_SUCCESS) {
        return false;
    }

    VkClearValue clear_value = {{{0.08f, 0.09f, 0.12f, 1.0f}}};
    VkRenderPassBeginInfo pass_info = {};
    pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    pass_info.renderPass = render_pass;
    pass_info.framebuffer = framebuffer;
    pass_info.renderArea.extent = extent;
    pass_info.clearValueCount = 1;
    pass_info.pClearValues = &clear_value;

    vkCmdBeginRenderPass(cmd, &pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
    vkCmdDraw(cmd, 3, 1, 0, 0);
    vkCmdEndRenderPass(cmd);

    return vkEndCommandBuffer(cmd) == VK_SUCCESS;
}`,
    highlights: [
      'يبدأ التسجيل رسمياً مع vkBeginCommandBuffer وينتهي مع vkEndCommandBuffer، وما بينهما هو فقط ما سينفذ لاحقاً على GPU.',
      'تسجل أوامر vkCmd* داخل الـ buffer ولا تنفذ لحظياً لحظة استدعائها.',
      'هذا المثال هو المكان الطبيعي لفهم الفرق بين تسجيل الأوامر وإرسالها لاحقاً عبر vkQueueSubmit.'
    ],
    expectedResult: 'ينتهي المثال بـ Command Buffer جاهز للإرسال إلى الطابور بعد أن حُفظت بداخله أوامر الرسم المطلوبة للإطار.',
    related: [
      'VkCommandBuffer',
      'VkCommandBufferBeginInfo',
      'VkRenderPassBeginInfo',
      'vkBeginCommandBuffer',
      'vkCmdBeginRenderPass',
      'vkCmdBindPipeline',
      'vkCmdDraw',
      'vkEndCommandBuffer'
    ],
    previewKind: 'frame',
    previewTitle: 'تسجيل أوامر الإطار داخل Command Buffer قبل الإرسال إلى الطابور.'
  }),
  createVulkanCatalogExample({
    id: 'square-draw',
    title: 'مثال رسم مربع',
    difficulty: 'أساسي',
    goal: 'يعرض هذا المثال أبسط طريقة عملية لرسم مربع مكوّن من مثلثين داخل Render Pass واحد.',
    requirements: [
      'Pipeline رسومي صالح ونافذة Vulkan مهيأة مسبقاً.',
      'Vertex Shader قادر على تفسير ستة رؤوس أو أربعة رؤوس مع فهارس.',
      'وجود حلقة رسم أساسية مشابهة لمثال المثلث.'
    ],
    code: `#include <vulkan/vulkan.h>

void RecordSquare(VkCommandBuffer cmd,
                  VkRenderPass render_pass,
                  VkFramebuffer framebuffer,
                  VkExtent2D extent,
                  VkPipeline pipeline)
{
    VkCommandBufferBeginInfo begin_info = {};
    begin_info.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
    vkBeginCommandBuffer(cmd, &begin_info);

    VkClearValue clear_value = {{{0.05f, 0.06f, 0.09f, 1.0f}}};
    VkRenderPassBeginInfo pass_info = {};
    pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    pass_info.renderPass = render_pass;
    pass_info.framebuffer = framebuffer;
    pass_info.renderArea.extent = extent;
    pass_info.clearValueCount = 1;
    pass_info.pClearValues = &clear_value;

    vkCmdBeginRenderPass(cmd, &pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, pipeline);
    vkCmdDraw(cmd, 6, 1, 0, 0);
    vkCmdEndRenderPass(cmd);
    vkEndCommandBuffer(cmd);
}`,
    highlights: [
      'المربع هنا مكوّن من ستة رؤوس تمثل مثلثين متجاورين، لذلك يكفي استدعاء vkCmdDraw بعدد رؤوس يساوي 6.',
      'يحافظ المثال على نفس مسار المثلث، لكنه يغيّر كمية البيانات المرسلة إلى خط الأنابيب فقط.',
      'هذا المثال مفيد قبل الانتقال إلى Vertex Buffer أو Index Buffer حتى تبقى الفكرة البصرية واضحة.'
    ],
    expectedResult: 'يظهر مربع واضح في مركز النافذة، مكوّن من مثلثين متصلين داخل نفس الإطار.',
    related: [
      'VkCommandBuffer',
      'VkPipeline',
      'vkCmdBindPipeline',
      'vkCmdDraw'
    ],
    previewKind: 'transform-lab',
    previewTitle: 'مربع واضح مرسوم داخل إطار Vulkan بدلاً من مثلث منفرد.'
  }),
  createVulkanCatalogExample({
    id: 'vertex-buffer',
    title: 'مثال استخدام Vertex Buffer',
    difficulty: 'أساسي',
    goal: 'يشرح هذا المثال كيف ينشئ التطبيق Vertex Buffer ويرفع إليه بيانات الرؤوس ثم يربطه قبل الرسم.',
    requirements: [
      'VkDevice وVkPhysicalDevice وCommand Pool جاهزة مسبقاً.',
      'تنسيق الرؤوس معروف داخل Vertex Shader وVertex Input.',
      'إمكانية إنشاء Staging Buffer لرفع البيانات إلى ذاكرة الجهاز.'
    ],
    code: `#include <vulkan/vulkan.h>

struct Vertex2D {
    float position[2];
    float color[3];
};

VkBuffer CreateTriangleVertexBuffer(AppContext& app, VkDeviceMemory* vertex_memory)
{
    const Vertex2D vertices[] = {
        {{ 0.0f, -0.55f }, { 1.0f, 0.3f, 0.2f }},
        {{ 0.55f, 0.45f }, { 0.2f, 0.8f, 1.0f }},
        {{-0.55f, 0.45f }, { 0.3f, 1.0f, 0.5f }}
    };

    return CreateDeviceLocalVertexBuffer(app, vertices, sizeof(vertices), vertex_memory);
}

void RecordVertexBufferDraw(AppContext& app, VkBuffer vertex_buffer, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    VkBuffer buffers[] = { vertex_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, buffers, offsets);
    vkCmdDraw(cmd, 3, 1, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'يوضع ترتيب بيانات الرؤوس في VkBuffer منفصل بدل الاعتماد على رؤوس مولدة ضمنياً داخل الشيدر.',
      'يخبر vkCmdBindVertexBuffers خط الأنابيب من أين تبدأ قراءة الرؤوس داخل الذاكرة.',
      'هذا المثال هو الخطوة العملية الأولى نحو رسم Mesh حقيقي أو نموذج محمّل من ملف.'
    ],
    expectedResult: 'يظهر الشكل اعتماداً على بيانات Vertex Buffer الفعلية، لا على قيم ثابتة داخل الشيدر فقط.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkCmdBindVertexBuffers',
      'vkCmdDraw',
      'VK_BUFFER_USAGE_VERTEX_BUFFER_BIT'
    ],
    previewKind: 'triangle-scene',
    previewTitle: 'الرسم بعد ربط Vertex Buffer حقيقي ببيانات الرؤوس.'
  }),
  createVulkanCatalogExample({
    id: 'index-buffer',
    title: 'مثال استخدام Index Buffer',
    difficulty: 'أساسي',
    goal: 'يوضح هذا المثال كيف يقلل Index Buffer تكرار الرؤوس عبر إعادة استخدام نفس Vertex Buffer مع فهارس منفصلة.',
    requirements: [
      'Vertex Buffer جاهز لتغذية خط الأنابيب.',
      'تنسيق الفهارس معروف مثل uint16_t أو uint32_t.',
      'أمر الرسم النهائي سيستخدم vkCmdDrawIndexed بدل vkCmdDraw.'
    ],
    code: `#include <vulkan/vulkan.h>

struct QuadVertex {
    float position[2];
    float uv[2];
};

void RecordIndexedQuad(AppContext& app,
                       VkBuffer vertex_buffer,
                       VkBuffer index_buffer,
                       uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    VkBuffer vertex_buffers[] = { vertex_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, vertex_buffers, offsets);
    vkCmdBindIndexBuffer(cmd, index_buffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdDrawIndexed(cmd, 6, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'يستخدم Index Buffer ستة فهارس لرسم مربع بأربعة رؤوس فقط، لذلك يقلل التكرار مقارنةً بتكرار الرؤوس الستة كاملة.',
      'يحدد VK_INDEX_TYPE_UINT32 كيف ستفسر Vulkan حجم كل عنصر فهرسة داخل المخزن.',
      'بعد ربط Vertex Buffer وIndex Buffer يصبح أمر الرسم الصحيح هنا هو vkCmdDrawIndexed.'
    ],
    expectedResult: 'يرسم التطبيق الشكل نفسه بعدد رؤوس أقل في الذاكرة، لأن الفهارس تعيد استخدام الرؤوس المشتركة بين المثلثات.',
    related: [
      'VkBuffer',
      'vkCmdBindIndexBuffer',
      'vkCmdDrawIndexed',
      'VK_INDEX_TYPE_UINT32',
      'VK_BUFFER_USAGE_INDEX_BUFFER_BIT'
    ],
    previewKind: 'multi-texture',
    previewTitle: 'إعادة استخدام الرؤوس عبر Index Buffer أثناء رسم الشكل.'
  }),
  createVulkanCatalogExample({
    id: 'uniform-buffer',
    title: 'مثال استخدام Uniform Buffer',
    difficulty: 'متوسط',
    goal: 'يركز هذا المثال على إنشاء Uniform Buffer وربطه في Descriptor Set لتمرير بيانات ثابتة أو متغيرة مثل المصفوفات والألوان إلى الشيدر.',
    requirements: [
      'Descriptor Set Layout يحتوي binding من نوع VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER.',
      'VkBuffer وVkDeviceMemory قابلان للوصول من CPU لتحديث البيانات.',
      'الشيدر يعلن uniform block مطابقاً للبنية المستخدمة في التطبيق.'
    ],
    code: `#include <cstring>
#include <vulkan/vulkan.h>

struct SceneUniforms {
    float color[4];
    float time;
    float padding[3];
};

void UpdateUniformBuffer(VkDevice device, VkDeviceMemory uniform_memory, float time_seconds)
{
    SceneUniforms uniforms = {
        { 0.18f, 0.72f, 1.0f, 1.0f },
        time_seconds,
        { 0.0f, 0.0f, 0.0f }
    };

    void* mapped = nullptr;
    vkMapMemory(device, uniform_memory, 0, sizeof(SceneUniforms), 0, &mapped);
    std::memcpy(mapped, &uniforms, sizeof(SceneUniforms));
    vkUnmapMemory(device, uniform_memory);
}

VkDescriptorSet WriteUniformDescriptor(AppContext& app, VkBuffer uniform_buffer)
{
    VkDescriptorBufferInfo buffer_info = {};
    buffer_info.buffer = uniform_buffer;
    buffer_info.offset = 0;
    buffer_info.range = sizeof(SceneUniforms);

    return AllocateAndWriteUniformDescriptor(app, buffer_info);
}`,
    highlights: [
      'Uniform Buffer هو المسار المعتاد لإرسال بيانات صغيرة ومنظمة مثل الألوان والمصفوفات وأزمنة الإطارات إلى الشيدر.',
      'يحدد VkDescriptorBufferInfo أي جزء من المخزن سيقرأه الشيدر عند الربط.',
      'يحدث التطبيق محتوى الـ UBO من CPU قبل الرسم، ثم يبقى الوصول إليه داخل الشيدر عبر descriptor set.'
    ],
    expectedResult: 'تصل القيم المرسلة عبر Uniform Buffer إلى الشيدر وتؤثر فعلياً في لون الرسم أو تحوله أو أي معاملات عامة أخرى.',
    related: [
      'VkBuffer',
      'VkDescriptorBufferInfo',
      'VkDescriptorSet',
      'vkMapMemory',
      'vkUnmapMemory',
      'VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER'
    ],
    previewKind: 'transform-lab',
    previewTitle: 'تحديث بيانات Uniform Buffer قبل الرسم داخل الإطار الحالي.'
  }),
  createVulkanCatalogExample({
    id: 'translation-transform',
    title: 'مثال التحويل Translation',
    difficulty: 'أساسي',
    goal: 'يبين هذا المثال كيف يغير التطبيق موضع العنصر على الشاشة باستخدام مصفوفة ترجمة فقط من دون دوران أو تكبير.',
    requirements: [
      'مكتبة رياضيات مثل GLM أو بنية محلية تولد مصفوفة translation.',
      'Uniform Buffer أو Push Constants لتمرير المصفوفة إلى Vertex Shader.',
      'عنصر مرسوم بسيط مثل Quad أو مثلث حتى يظهر التحريك بوضوح.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

glm::mat4 BuildTranslationOnly(float x, float y)
{
    glm::mat4 model = glm::mat4(1.0f);
    model = glm::translate(model, glm::vec3(x, y, 0.0f));
    return model;
}

void UpdateTranslationOnly(AppContext& app, VkDeviceMemory transform_memory)
{
    glm::mat4 model = BuildTranslationOnly(0.45f, -0.20f);
    UploadBytes(app.device, transform_memory, &model, sizeof(model));
}`,
    highlights: [
      'Translation يغيّر موضع العنصر فقط من دون أن يغيّر زاويته أو حجمه.',
      'القيمة النهائية للمصفوفة تنتقل إلى الشيدر تماماً مثل أي UBO أو Push Constant آخر.',
      'هذا المثال هو أبسط مدخل لفهم نظام التحويلات قبل دمج الدوران والتكبير معاً.'
    ],
    expectedResult: 'يظهر العنصر مزاحاً عن مركز الشاشة إلى الموضع الجديد الذي تحدده قيم الترجمة.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'transform-lab',
    previewTitle: 'تغيير موضع العنصر عبر Translation فقط.'
  }),
  createVulkanCatalogExample({
    id: 'rotation-transform',
    title: 'مثال التدوير Rotation',
    difficulty: 'أساسي',
    goal: 'يوضح هذا المثال كيف يدوّر التطبيق العنصر حول محوره باستخدام مصفوفة دوران فقط من دون تغيير موضعه الأساسي.',
    requirements: [
      'مكتبة رياضيات تولد مصفوفة دوران حول محور Z أو أي محور مطلوب.',
      'تمرير مصفوفة النموذج إلى الشيدر قبل الرسم.',
      'عنصر مرئي واضح مثل مربع أو Sprite حتى يظهر التدوير بسهولة.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

glm::mat4 BuildRotationOnly(float radians)
{
    glm::mat4 model = glm::mat4(1.0f);
    model = glm::rotate(model, radians, glm::vec3(0.0f, 0.0f, 1.0f));
    return model;
}

void UpdateRotationOnly(AppContext& app, VkDeviceMemory transform_memory, float time_seconds)
{
    glm::mat4 model = BuildRotationOnly(time_seconds * 1.4f);
    UploadBytes(app.device, transform_memory, &model, sizeof(model));
}`,
    highlights: [
      'Rotation يغيّر اتجاه العنصر من دون تغيير حجمه الفعلي أو موقعه المرجعي إذا بقيت المصفوفة تبدأ من الوحدة.',
      'المثال مناسب لفهم محور الدوران قبل الانتقال إلى مصفوفات مركبة أكثر تعقيداً.',
      'يزداد تأثير الدوران وضوحاً مع العناصر المربعة أو الصور ذات الاتجاه الواضح.'
    ],
    expectedResult: 'يدور العنصر حول مركزه تدريجياً داخل الإطار من دون حركة انتقالية إضافية.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'rotating-sprites',
    previewTitle: 'تدوير عنصر مرئي حول مركزه باستخدام مصفوفة Rotation فقط.'
  }),
  createVulkanCatalogExample({
    id: 'scale-transform',
    title: 'مثال التكبير والتصغير Scale',
    difficulty: 'أساسي',
    goal: 'يعرض هذا المثال أثر مصفوفة Scale على حجم العنصر من دون تغيير موضعه أو اتجاهه.',
    requirements: [
      'عنصر مرئي بسيط يمكن ملاحظة حجمه بوضوح عند تغييره.',
      'Uniform Buffer أو Push Constants لنقل مصفوفة التكبير إلى الشيدر.',
      'مكتبة رياضيات أو كود محلي لبناء مصفوفة scale.'
    ],
    code: `#include <cmath>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

glm::mat4 BuildScaleOnly(float scale_amount)
{
    return glm::scale(glm::mat4(1.0f), glm::vec3(scale_amount, scale_amount, 1.0f));
}

void UpdateScaleOnly(AppContext& app, VkDeviceMemory transform_memory, float time_seconds)
{
    float scale_amount = 0.6f + std::fabs(std::sin(time_seconds)) * 0.5f;
    glm::mat4 model = BuildScaleOnly(scale_amount);
    UploadBytes(app.device, transform_memory, &model, sizeof(model));
}`,
    highlights: [
      'Scale يغير حجم العنصر فقط من دون تعديل لونه أو خامته أو بيانات رؤوسه الأصلية.',
      'القيمة الأكبر من 1.0 تكبّر، بينما القيمة بين 0 و1 تصغّر.',
      'هذا المثال مفيد قبل دمج التكبير مع الحركة أو الدوران في مصفوفة واحدة.'
    ],
    expectedResult: 'يكبر العنصر ويصغر بسلاسة داخل المشهد مع بقاء مركزه الأساسي ثابتاً.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'transform-lab',
    previewTitle: 'تغيير حجم العنصر عبر Scale فقط.'
  }),
  createVulkanCatalogExample({
    id: 'animation-basic',
    title: 'مثال الحركة Animation',
    difficulty: 'متوسط',
    goal: 'يجمع هذا المثال تحديثاً زمنياً بسيطاً يجعل العنصر يتحرك أو يغير خصائصه كل إطار اعتماداً على الزمن الجاري.',
    requirements: [
      'حلقة رسم مستمرة تقرأ قيمة الزمن الحالي في كل إطار.',
      'Uniform Buffer أو Push Constants لتحديث الحالة المرئية للمشهد.',
      'عنصر بسيط يمكن رؤية حركته بسهولة داخل النافذة.'
    ],
    code: `#include <cmath>

struct AnimationState {
    float offset_x;
    float color_mix;
};

AnimationState BuildAnimationState(float time_seconds)
{
    AnimationState state = {};
    state.offset_x = std::sin(time_seconds) * 0.55f;
    state.color_mix = 0.5f + 0.5f * std::cos(time_seconds * 1.6f);
    return state;
}

void UpdateAnimatedUniforms(AppContext& app, VkDeviceMemory animation_memory, float time_seconds)
{
    AnimationState state = BuildAnimationState(time_seconds);
    UploadBytes(app.device, animation_memory, &state, sizeof(state));
}`,
    highlights: [
      'الحركة هنا ناتجة من الزمن، لا من حدث إدخال مباشر، لذلك يتغير المشهد باستمرار حتى دون ضغط مفاتيح.',
      'يمكن استخدام الحالة نفسها لتحريك الموضع وتغيير اللون أو الشفافية داخل الشيدر.',
      'هذا المثال هو المدخل الطبيعي لرسوميات HUD المتحركة أو sprites المتغيرة أو التحويلات الزمنية.'
    ],
    expectedResult: 'يتحرك العنصر أو يغيّر مظهره بسلاسة مع الزمن، ما يعطي مثالاً واضحاً على Animation بسيط في Vulkan.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'frame',
    previewTitle: 'تحريك العنصر أو خصائصه عبر تحديث زمني مستمر بين الإطارات.'
  }),
  createVulkanCatalogExample({
    id: 'image-cropping',
    title: 'مثال قص جزء من صورة',
    difficulty: 'متوسط',
    goal: 'يوضح هذا المثال كيف يعرض التطبيق جزءاً محدداً فقط من Texture كاملة عبر تعديل مجال UV داخل الشيدر أو Push Constants.',
    requirements: [
      'Texture محمّلة وصالحة للعرض داخل الشيدر.',
      'Push Constants أو Uniforms تحمل uv_min وuv_max أو ما يعادلهما.',
      'Quad مرسوم على الشاشة يقرأ مجال الإحداثيات الجديد.'
    ],
    code: `#include <vulkan/vulkan.h>

struct CropPush {
    float uvMin[2];
    float uvMax[2];
};

void RecordCroppedImage(AppContext& app,
                        VkDescriptorSet texture_set,
                        uint32_t image_index)
{
    CropPush crop = {{ 0.15f, 0.12f }, { 0.62f, 0.58f }};
    VkCommandBuffer cmd = app.commandBuffers[image_index];

    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);
    vkCmdBindDescriptorSets(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipelineLayout, 0, 1, &texture_set, 0, nullptr);
    vkCmdPushConstants(cmd, app.pipelineLayout, VK_SHADER_STAGE_FRAGMENT_BIT, 0, sizeof(CropPush), &crop);
    vkCmdDrawIndexed(cmd, 6, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'لا يقتطع المثال الصورة الأصلية من الذاكرة، بل يغير فقط الجزء الذي يقرأه الشيدر منها.',
      'يحدد uvMin وuvMax المجال المرئي داخل Texture، وبذلك يمكن استعمال spritesheets أو أجزاء الصور الكبيرة.',
      'هذا الأسلوب أسرع وأكثر مرونة من إنشاء Texture جديدة لكل قصاصة تريد عرضها.'
    ],
    expectedResult: 'يظهر جزء محدد فقط من الصورة الأصلية داخل النافذة بدلاً من عرض الصورة كاملة.',
    related: [
      'VkDescriptorSet',
      'vkCmdBindDescriptorSets',
      'vkCmdPushConstants',
      'vkCmdDrawIndexed',
      'VK_SHADER_STAGE_FRAGMENT_BIT'
    ],
    previewKind: 'texture-window',
    previewTitle: 'عرض جزء مقصوص فقط من Texture كبيرة داخل إطار Vulkan.'
  }),
  createVulkanCatalogExample({
    id: 'image-file-loading',
    title: 'مثال تحميل صورة من ملف',
    difficulty: 'أساسي',
    goal: 'يركز هذا المثال على مرحلة قراءة ملف الصورة نفسها وتحويلها إلى بيانات pixels وعرض أبعادها قبل رفعها إلى Vulkan.',
    requirements: [
      'مكتبة تحميل صور مثل stb_image مضافة إلى المشروع.',
      'ملف صورة صالح على القرص.',
      'إمكانية التعامل مع مسار الملف محلياً في التطبيق.'
    ],
    code: `#include <iostream>
#define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>

struct LoadedImage {
    stbi_uc* pixels = nullptr;
    int width = 0;
    int height = 0;
    int channels = 0;
};

LoadedImage LoadImageFile(const char* path)
{
    LoadedImage result = {};
    result.pixels = stbi_load(path, &result.width, &result.height, &result.channels, STBI_rgb_alpha);
    return result;
}

int main()
{
    LoadedImage image = LoadImageFile("assets/images/logo.png");
    if (!image.pixels) {
        std::cout << "فشل تحميل الصورة من الملف\\n";
        return 1;
    }

    std::cout << "تم تحميل الصورة بنجاح: "
              << image.width << "x" << image.height << "\\n";

    stbi_image_free(image.pixels);
    return 0;
}`,
    highlights: [
      'المثال يركز على خطوة القراءة من الملف نفسها قبل أي تعامل مع VkImage أو Descriptor.',
      'معرفة العرض والارتفاع وعدد القنوات مهمة قبل حساب حجم الرفع إلى Staging Buffer.',
      'إذا فشلت stbi_load فلا معنى للانتقال إلى مرحلة إنشاء Texture داخل Vulkan.'
    ],
    expectedResult: 'يقرأ التطبيق الصورة من الملف ويطبع أبعادها بنجاح قبل الانتقال لاحقاً إلى مرحلة إنشاء Texture.',
    related: [
      'VkImage',
      'VkDeviceSize'
    ],
    previewKind: 'texture-window',
    previewTitle: 'تحميل ملف صورة محلي قبل تحويله إلى Texture داخل Vulkan.'
  }),
  createVulkanCatalogExample({
    id: 'glsl-file-reading',
    title: 'مثال قراءة ملفات GLSL',
    difficulty: 'أساسي',
    goal: 'يوضح هذا المثال كيف يقرأ التطبيق ملفات GLSL النصية من القرص حتى يفحصها أو يمررها إلى أداة التحويل أو نظام البناء.',
    requirements: [
      'ملفات شيدر نصية موجودة مثل basic.vert وbasic.frag.',
      'استخدام std::ifstream أو أي طبقة قراءة ملفات مشابهة.',
      'الرغبة في فصل ملفات الشيدر عن كود التطبيق.'
    ],
    code: `#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

std::string ReadTextFile(const std::string& path)
{
    std::ifstream file(path);
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

int main()
{
    std::string vertex_source = ReadTextFile("shaders/basic.vert");
    std::string fragment_source = ReadTextFile("shaders/basic.frag");

    std::cout << "عدد حروف Vertex Shader: " << vertex_source.size() << "\\n";
    std::cout << "عدد حروف Fragment Shader: " << fragment_source.size() << "\\n";
    return 0;
}`,
    highlights: [
      'يحافظ هذا المثال على ملفات GLSL كنصوص منفصلة يسهل تعديلها أو فحصها أو تمريرها إلى أدوات البناء.',
      'قراءة المصدر النصي مفيدة قبل التحويل إلى SPIR-V أو قبل أنظمة المراقبة وإعادة التحميل الحي.',
      'هذا المثال منفصل عن إنشاء VkShaderModule نفسه حتى يبقى التركيز على مرحلة القراءة فقط.'
    ],
    expectedResult: 'يقرأ التطبيق ملفات GLSL النصية بنجاح ويؤكد ذلك عبر أحجام النصوص أو محتواها.',
    related: [
      'VkShaderModule'
    ],
    previewKind: 'shader-files',
    previewTitle: 'قراءة ملفات GLSL النصية قبل تحويلها إلى SPIR-V.'
  }),
  createVulkanCatalogExample({
    id: 'glsl-to-spirv',
    title: 'مثال تحويل GLSL إلى SPIR-V',
    difficulty: 'أساسي',
    goal: 'يشرح هذا المثال كيف يجهز التطبيق أو نظام البناء أمر glslangValidator لتحويل ملفات GLSL إلى ملفات SPIR-V ثنائية قابلة للاستهلاك داخل Vulkan.',
    requirements: [
      'أداة glslangValidator مثبتة وموجودة في PATH أو مسار معروف.',
      'ملف GLSL صالح مثل shader.vert أو shader.frag.',
      'صلاحية الكتابة إلى مجلد نواتج الشيدر الثنائية.'
    ],
    commandBlocks: [
      {title: 'تحويل Vertex Shader', code: 'glslangValidator -V shaders/shader.vert -o shaders/shader.vert.spv', language: 'bash', iconType: 'glsl'},
      {title: 'تحويل Fragment Shader', code: 'glslangValidator -V shaders/shader.frag -o shaders/shader.frag.spv', language: 'bash', iconType: 'glsl'}
    ],
    code: `#include <cstdlib>
#include <string>

bool CompileShaderToSpirv(const char* input_path, const char* output_path)
{
    std::string command = "glslangValidator -V ";
    command += input_path;
    command += " -o ";
    command += output_path;
    return std::system(command.c_str()) == 0;
}

int main()
{
    bool vert_ok = CompileShaderToSpirv("shaders/shader.vert", "shaders/shader.vert.spv");
    bool frag_ok = CompileShaderToSpirv("shaders/shader.frag", "shaders/shader.frag.spv");
    return (vert_ok && frag_ok) ? 0 : 1;
}`,
    highlights: [
      'يمثل glslangValidator الخطوة الفاصلة بين شيدر GLSL النصي وملف SPIR-V الثنائي الذي تقبله Vulkan.',
      'يمكن استدعاء الأداة من الطرفية أو من CMake أو حتى من أداة بناء محلية كما في المثال.',
      'نجاح التحويل هنا شرط عملي قبل إنشاء أي VkShaderModule يعتمد على هذه الملفات.'
    ],
    expectedResult: 'تُنتج الأداة ملفات .spv جديدة يمكن تحميلها مباشرة لاحقاً عند بناء Shader Modules وPipelines.',
    related: [
      'VkShaderModule',
      'VkPipelineShaderStageCreateInfo'
    ],
    previewKind: 'shader-files',
    previewTitle: 'تحويل ملفات GLSL النصية إلى SPIR-V قبل مرحلة إنشاء Shader Module.'
  })
]);

const EXTENDED_VULKAN_READY_EXAMPLES = Object.freeze([
  createVulkanCatalogExample({
    id: 'multi-shader-stage',
    title: 'مثال استخدام أكثر من Shader Stage',
    difficulty: 'متوسط',
    goal: 'يعرض هذا المثال كيف يجهز التطبيق أكثر من مرحلة Shader داخل VkGraphicsPipelineCreateInfo مثل Vertex وGeometry وFragment حتى يوزع المعالجة الرسومية عبر مراحل متخصصة.',
    requirements: [
      'ملفات SPIR-V جاهزة لكل مرحلة ستستخدم داخل الـ pipeline.',
      'دعم المرحلة الإضافية مثل Geometry Shader على الجهاز الحالي إذا كانت مستخدمة.',
      'VkPipelineLayout وVkRenderPass معدّان مسبقاً قبل إنشاء الـ pipeline.'
    ],
    code: `#include <array>
#include <vulkan/vulkan.h>

VkPipeline CreatePipelineWithMultipleStages(VkDevice device,
                                            VkPipelineLayout pipeline_layout,
                                            VkRenderPass render_pass,
                                            VkShaderModule vertex_shader,
                                            VkShaderModule geometry_shader,
                                            VkShaderModule fragment_shader)
{
    VkPipelineShaderStageCreateInfo vertex_stage = {};
    vertex_stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    vertex_stage.stage = VK_SHADER_STAGE_VERTEX_BIT;
    vertex_stage.module = vertex_shader;
    vertex_stage.pName = "main";

    VkPipelineShaderStageCreateInfo geometry_stage = {};
    geometry_stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    geometry_stage.stage = VK_SHADER_STAGE_GEOMETRY_BIT;
    geometry_stage.module = geometry_shader;
    geometry_stage.pName = "main";

    VkPipelineShaderStageCreateInfo fragment_stage = {};
    fragment_stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
    fragment_stage.stage = VK_SHADER_STAGE_FRAGMENT_BIT;
    fragment_stage.module = fragment_shader;
    fragment_stage.pName = "main";

    std::array<VkPipelineShaderStageCreateInfo, 3> shader_stages = {
        vertex_stage,
        geometry_stage,
        fragment_stage
    };

    VkGraphicsPipelineCreateInfo pipeline_info = {};
    pipeline_info.sType = VK_STRUCTURE_TYPE_GRAPHICS_PIPELINE_CREATE_INFO;
    pipeline_info.stageCount = static_cast<uint32_t>(shader_stages.size());
    pipeline_info.pStages = shader_stages.data();
    pipeline_info.layout = pipeline_layout;
    pipeline_info.renderPass = render_pass;

    VkPipeline pipeline = VK_NULL_HANDLE;
    if (vkCreateGraphicsPipelines(device, VK_NULL_HANDLE, 1, &pipeline_info, nullptr, &pipeline) != VK_SUCCESS) {
        return VK_NULL_HANDLE;
    }

    return pipeline;
}`,
    highlights: [
      'يحدد كل VkPipelineShaderStageCreateInfo مرحلة مستقلة داخل خط الأنابيب مع ملف SPIR-V ونقطة دخول خاصة بها.',
      'يزداد stageCount عندما تضيف مراحل مثل Geometry Shader أو Tessellation ولا يبقى محصوراً في مرحلتي Vertex وFragment.',
      'هذا المثال مهم عندما تريد توليد هندسة إضافية أو توزيع المسؤوليات بين مراحل الرسم المختلفة.'
    ],
    expectedResult: 'يُنشأ Graphics Pipeline متعدد المراحل بنجاح، بحيث يمرر الرسم عبر أكثر من Shader Stage داخل المسار نفسه.',
    related: [
      'VkPipelineShaderStageCreateInfo',
      'VkShaderModule',
      'vkCreateGraphicsPipelines',
      'VK_SHADER_STAGE_VERTEX_BIT',
      'VK_SHADER_STAGE_GEOMETRY_BIT',
      'VK_SHADER_STAGE_FRAGMENT_BIT'
    ],
    previewKind: 'pipeline',
    previewTitle: 'خط أنابيب رسومي يضم أكثر من مرحلة Shader داخل مثال Vulkan واحد.'
  }),
  createVulkanCatalogExample({
    id: 'obj-mesh-draw',
    title: 'مثال رسم Mesh من ملف OBJ',
    difficulty: 'متوسط',
    goal: 'يكمل هذا المثال مرحلة تحميل OBJ عبر تحويل بيانات النموذج إلى Vertex Buffer وIndex Buffer ثم إصدار أمر الرسم الفعلي داخل Command Buffer.',
    requirements: [
      'تم تحميل بيانات OBJ مسبقاً إلى مصفوفات رؤوس وفهارس.',
      'Vertex Buffer وIndex Buffer منشآن ومرفوعان إلى ذاكرة الجهاز.',
      'Pipeline ورسوميات ثلاثية الأبعاد جاهزة للرسم داخل Render Pass صالح.'
    ],
    code: `#include <vulkan/vulkan.h>

void RecordObjMeshDraw(AppContext& app,
                       VkBuffer vertex_buffer,
                       VkBuffer index_buffer,
                       uint32_t index_count,
                       VkDescriptorSet scene_descriptor,
                       uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipeline);

    VkBuffer vertex_buffers[] = { vertex_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, vertex_buffers, offsets);
    vkCmdBindIndexBuffer(cmd, index_buffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdBindDescriptorSets(
        cmd,
        VK_PIPELINE_BIND_POINT_GRAPHICS,
        app.pipelineLayout,
        0,
        1,
        &scene_descriptor,
        0,
        nullptr);

    vkCmdDrawIndexed(cmd, index_count, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'يمثل هذا المثال الخطوة التي تجعل بيانات OBJ المحملة تظهر فعلياً على الشاشة بدلاً من بقائها في الذاكرة فقط.',
      'يربط vkCmdBindVertexBuffers وvkCmdBindIndexBuffer المخازن قبل أمر vkCmdDrawIndexed النهائي.',
      'وجود scene_descriptor يعني أن النموذج يمكن أن يستقبل مصفوفات كاميرا أو إضاءة أو خامات في المسار نفسه.'
    ],
    expectedResult: 'يظهر النموذج المحمّل من ملف OBJ مرسوماً داخل المشهد باستخدام Mesh حقيقي ومخازن رؤوس وفهارس فعلية.',
    related: [
      'VkBuffer',
      'VkDescriptorSet',
      'vkCmdBindVertexBuffers',
      'vkCmdBindIndexBuffer',
      'vkCmdBindDescriptorSets',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'obj-viewer',
    previewTitle: 'رسم Mesh حقيقي بعد تحميله من ملف OBJ وربطه داخل Command Buffer.'
  }),
  createVulkanCatalogExample({
    id: 'simple-camera',
    title: 'مثال كاميرا بسيطة',
    difficulty: 'متوسط',
    goal: 'يوضح هذا المثال كيف تبنى كاميرا أساسية عبر مصفوفتَي View وProjection ثم تمرر إلى الشيدر حتى يرى المشهد من زاوية منظمة.',
    requirements: [
      'مكتبة رياضيات مثل GLM لبناء المصفوفات بسهولة.',
      'Uniform Buffer يحمل مصفوفات الكاميرا إلى Vertex Shader.',
      'مشهد ثلاثي الأبعاد بسيط مثل مكعب أو نموذج OBJ قابل للعرض.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

struct CameraUniforms {
    glm::mat4 view;
    glm::mat4 projection;
};

CameraUniforms BuildSimpleCamera(float aspect_ratio)
{
    CameraUniforms camera = {};
    camera.view = glm::lookAt(
        glm::vec3(0.0f, 1.4f, 3.5f),
        glm::vec3(0.0f, 0.0f, 0.0f),
        glm::vec3(0.0f, 1.0f, 0.0f));
    camera.projection = glm::perspective(glm::radians(60.0f), aspect_ratio, 0.1f, 100.0f);
    camera.projection[1][1] *= -1.0f;
    return camera;
}

void UpdateSimpleCamera(AppContext& app, VkDeviceMemory camera_memory, float aspect_ratio)
{
    CameraUniforms camera = BuildSimpleCamera(aspect_ratio);
    UploadBytes(app.device, camera_memory, &camera, sizeof(camera));
}`,
    highlights: [
      'تحدد view أين تقف الكاميرا وإلى أين تنظر، بينما تحدد projection كيف يتحول المشهد إلى مساحة القص والمنظور.',
      'يجب قلب المحور Y في projection داخل Vulkan عند استخدام أسلوب GLM الشائع حتى لا ينقلب العرض رأسياً.',
      'هذا المثال هو القاعدة التي تبنى فوقها الحركة الحرة أو الدوران المداري أو الكاميرات المتقدمة.'
    ],
    expectedResult: 'يرى المستخدم المشهد من زاوية كاميرا ثابتة وواضحة بدلاً من الاعتماد على تحويلات محلية فقط.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory',
      'VkBuffer',
      'VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER'
    ],
    previewKind: 'camera',
    previewTitle: 'كاميرا ثابتة تبني View وProjection قبل رسم المشهد.'
  }),
  createVulkanCatalogExample({
    id: 'camera-movement',
    title: 'مثال Camera Movement',
    difficulty: 'متوسط',
    goal: 'يعرض هذا المثال كيف تتحرك الكاميرا داخل المشهد بناءً على إدخال المستخدم مع تحديث موضعها واتجاهها في كل إطار.',
    requirements: [
      'نظام إدخال يقرأ لوحة المفاتيح أو الفأرة أو الاثنين معاً.',
      'بنية حالة للكamera تحتفظ بالموقع والاتجاه والسرعة.',
      'Uniform Buffer يحدث View Matrix في كل إطار بعد قراءة الإدخال.'
    ],
    code: `#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

struct CameraState {
    glm::vec3 position;
    glm::vec3 forward;
    glm::vec3 up;
    float speed;
};

void UpdateCameraMovement(CameraState* camera, const InputState& input, float delta_time)
{
    if (input.moveForward) {
        camera->position += camera->forward * camera->speed * delta_time;
    }
    if (input.moveBackward) {
        camera->position -= camera->forward * camera->speed * delta_time;
    }

    glm::vec3 right = glm::normalize(glm::cross(camera->forward, camera->up));
    if (input.moveRight) {
        camera->position += right * camera->speed * delta_time;
    }
    if (input.moveLeft) {
        camera->position -= right * camera->speed * delta_time;
    }
}

glm::mat4 BuildCameraView(const CameraState& camera)
{
    return glm::lookAt(camera.position, camera.position + camera.forward, camera.up);
}`,
    highlights: [
      'تعتمد الحركة هنا على delta_time حتى تبقى السرعة متسقة بين الأجهزة ومعدلات الإطارات المختلفة.',
      'يولد المتجه right من حاصل الضرب الاتجاهي حتى تتحرك الكاميرا يميناً ويساراً نسبةً إلى اتجاهها الحالي.',
      'بعد تحديث الموضع يجب إعادة بناء View Matrix وتمريرها للشيدر في كل إطار.'
    ],
    expectedResult: 'تتحرك الكاميرا داخل المشهد بسلاسة عند ضغط المستخدم على مفاتيح الحركة، ما يجعل المثال أقرب إلى أنماط العرض الحديثة.',
    related: [
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory',
      'VkBuffer'
    ],
    previewKind: 'camera',
    previewTitle: 'تحريك الكاميرا داخل المشهد وفق إدخال المستخدم بين الإطارات.'
  }),
  createVulkanCatalogExample({
    id: 'basic-lighting',
    title: 'مثال Lighting أساسي',
    difficulty: 'متوسط',
    goal: 'يقدم هذا المثال إضاءة Lambert الأساسية عبر اتجاه ضوء واحد وحساب حاصل الضرب بين normal واتجاه الضوء داخل Fragment Shader.',
    requirements: [
      'النموذج أو الـ mesh يحتوي normals صحيحة لكل رأس أو لكل سطح.',
      'Uniform Buffer يمرر اتجاه الضوء ولونه إلى الشيدر.',
      'Pipeline ثلاثي الأبعاد مع Vertex وFragment Shader جاهزان لاستقبال هذه القيم.'
    ],
    code: `#include <glm/glm.hpp>

struct BasicLightUniforms {
    glm::vec4 lightDirection;
    glm::vec4 lightColor;
};

void UpdateBasicLighting(VkDevice device, VkDeviceMemory uniform_memory)
{
    BasicLightUniforms light = {};
    light.lightDirection = glm::vec4(glm::normalize(glm::vec3(-0.5f, -1.0f, -0.2f)), 0.0f);
    light.lightColor = glm::vec4(1.0f, 0.95f, 0.85f, 1.0f);
    UploadBytes(device, uniform_memory, &light, sizeof(light));
}

// داخل Fragment Shader:
// float diffuse = max(dot(normalize(inNormal), normalize(-ubo.lightDirection.xyz)), 0.0);
// vec3 color = baseColor.rgb * ubo.lightColor.rgb * diffuse;`,
    highlights: [
      'الإضاءة الأساسية هنا تعتمد فقط على diffuse lighting، لذلك يسهل فهم العلاقة بين normal واتجاه الضوء مباشرة.',
      'كلما اقترب السطح من مواجهة اتجاه الضوء ارتفعت قيمة diffuse وازداد السطوع.',
      'هذا المثال هو القاعدة التي تسبق Directional وPoint وSpecular Lighting.'
    ],
    expectedResult: 'تظهر المجسمات بإضاءة واتجاه واضحين بدلاً من لون مسطح ثابت، ما يبرز الحجم والسطوح بصورة عملية.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory',
      'VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'مشهد ثلاثي الأبعاد بإضاءة أساسية تبرز اتجاه الضوء على السطوح.'
  }),
  createVulkanCatalogExample({
    id: 'directional-light',
    title: 'مثال Directional Light',
    difficulty: 'متوسط',
    goal: 'يوضح هذا المثال كيف تمثل Directional Light ضوءاً بعيداً ذا اتجاه ثابت مثل ضوء الشمس من دون موضع محلي داخل المشهد.',
    requirements: [
      'Normals صالحة داخل النموذج.',
      'Uniform Buffer يمرر اتجاه الضوء وشدته.',
      'Fragment Shader يستخدم اتجاهاً موحداً لكل أجزاء المشهد.'
    ],
    code: `#include <glm/glm.hpp>

struct DirectionalLightUniforms {
    glm::vec4 direction;
    glm::vec4 colorIntensity;
};

DirectionalLightUniforms BuildDirectionalLight()
{
    DirectionalLightUniforms light = {};
    light.direction = glm::vec4(glm::normalize(glm::vec3(-0.35f, -1.0f, -0.45f)), 0.0f);
    light.colorIntensity = glm::vec4(1.0f, 0.96f, 0.88f, 2.2f);
    return light;
}

void UploadDirectionalLight(VkDevice device, VkDeviceMemory light_memory)
{
    DirectionalLightUniforms light = BuildDirectionalLight();
    UploadBytes(device, light_memory, &light, sizeof(light));
}`,
    highlights: [
      'لا يحتاج Directional Light إلى موضع داخل العالم لأن جميع الأشعة فيه متوازية تقريباً.',
      'يستخدم هذا النوع كثيراً مع السماء والنهار والظلال الكبيرة بعيدة المدى.',
      'القيمة الرابعة يمكن استعمالها لشدة الضوء أو معامل إضافي حسب تصميم الـ uniform.'
    ],
    expectedResult: 'يظهر المشهد بإضاءة متجانسة الاتجاه كأن ضوءاً شمسياً واحداً يضيء جميع العناصر.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'Directional Light يضيء المشهد من اتجاه ثابت مثل ضوء الشمس.'
  }),
  createVulkanCatalogExample({
    id: 'point-light',
    title: 'مثال Point Light',
    difficulty: 'متوسط',
    goal: 'يشرح هذا المثال إضاءة Point Light ذات الموضع المحلي والاضمحلال مع المسافة، كما يحدث مع المصابيح أو الأجسام المضيئة داخل العالم.',
    requirements: [
      'الشيدر يحسب المسافة بين الضوء والسطح الحالي.',
      'Uniform Buffer يحمل موقع الضوء ولونه وإعدادات attenuation.',
      'المشهد ثلاثي الأبعاد يحتوي على نموذج واضح ليستفيد من اختلاف شدة الضوء.'
    ],
    code: `#include <glm/glm.hpp>

struct PointLightUniforms {
    glm::vec4 position;
    glm::vec4 color;
    glm::vec4 attenuation;
};

void UpdatePointLight(VkDevice device, VkDeviceMemory light_memory, float time_seconds)
{
    PointLightUniforms light = {};
    light.position = glm::vec4(1.5f * std::sin(time_seconds), 1.8f, 1.5f * std::cos(time_seconds), 1.0f);
    light.color = glm::vec4(1.0f, 0.82f, 0.68f, 6.0f);
    light.attenuation = glm::vec4(1.0f, 0.14f, 0.07f, 0.0f);
    UploadBytes(device, light_memory, &light, sizeof(light));
}`,
    highlights: [
      'يملك Point Light موضعاً حقيقياً داخل العالم، لذلك تختلف شدته حسب المسافة بينه وبين السطح.',
      'إعدادات attenuation تحدد سرعة تناقص الإضاءة مع الابتعاد عن مصدر الضوء.',
      'يمكن تحريك الضوء عبر الزمن للحصول على مثال بصري واضح على تغير الإضاءة داخل المشهد.'
    ],
    expectedResult: 'تظهر مناطق أكثر إضاءة قرب مصدر الضوء، بينما تضعف الإضاءة تدريجياً كلما ابتعدنا عنه.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'Point Light متحرك يغير شدة الإضاءة حسب قربه من السطوح.'
  }),
  createVulkanCatalogExample({
    id: 'specular-lighting',
    title: 'مثال Specular Lighting',
    difficulty: 'متوسط',
    goal: 'يركز هذا المثال على اللمعان Specular عبر قياس انعكاس الضوء تجاه الكاميرا لإظهار البقع اللامعة على الأسطح المصقولة.',
    requirements: [
      'Normals دقيقة وموضع كاميرا معروف داخل الشيدر.',
      'حساب اتجاه الضوء واتجاه المشاهد لكل fragment.',
      'Uniforms تحمل موضع الضوء وموضع الكاميرا ومعامل اللمعان.'
    ],
    code: `#include <glm/glm.hpp>

struct SpecularUniforms {
    glm::vec4 lightPosition;
    glm::vec4 cameraPosition;
    glm::vec4 specularSettings;
};

void UpdateSpecularUniforms(VkDevice device,
                            VkDeviceMemory specular_memory,
                            glm::vec3 light_position,
                            glm::vec3 camera_position)
{
    SpecularUniforms uniforms = {};
    uniforms.lightPosition = glm::vec4(light_position, 1.0f);
    uniforms.cameraPosition = glm::vec4(camera_position, 1.0f);
    uniforms.specularSettings = glm::vec4(1.0f, 32.0f, 0.0f, 0.0f);
    UploadBytes(device, specular_memory, &uniforms, sizeof(uniforms));
}

// داخل Fragment Shader:
// vec3 viewDir = normalize(ubo.cameraPosition.xyz - inWorldPos);
// vec3 reflectDir = reflect(-lightDir, normal);
// float spec = pow(max(dot(viewDir, reflectDir), 0.0), ubo.specularSettings.y);`,
    highlights: [
      'الجزء specular يعتمد على موضع الكاميرا، لذلك لا يكفي اتجاه الضوء وحده كما في diffuse lighting.',
      'كلما ارتفعت قيمة shininess أصبح اللمعان أضيق وأكثر حدة على السطح.',
      'هذا المثال يعطي النماذج المعدنية أو اللامعة مظهراً أكثر واقعية مقارنة بالإضاءة الأساسية فقط.'
    ],
    expectedResult: 'تظهر بقع لمعان واضحة على الأسطح المواجهة للضوء والكاميرا، ما يضيف عمقاً بصرياً أعلى للمشهد.',
    related: [
      'VkBuffer',
      'VkDeviceMemory',
      'vkMapMemory',
      'vkUnmapMemory'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'انعكاس Specular يضيف لمعاناً واضحاً إلى السطح داخل المشهد.'
  }),
  createVulkanCatalogExample({
    id: 'shadow-mapping',
    title: 'مثال Shadow Mapping',
    difficulty: 'متقدم',
    goal: 'يعرض هذا المثال المسار العملي لرسم خريطة عمق من منظور الضوء أولاً، ثم استعمالها في تمرير الرسم الأساسي لاختبار ما إذا كان السطح داخل الظل أم لا.',
    requirements: [
      'Image عمق منفصلة تستخدم كـ depth attachment وكـ sampled image لاحقاً.',
      'Pipeline أول لرسم خريطة الظل وPipeline ثانٍ للمشهد النهائي.',
      'Descriptor Set يمرر shadow map ومصفوفة light view projection إلى الشيدر النهائي.'
    ],
    code: `#include <vulkan/vulkan.h>

struct ShadowPass {
    VkImage depthImage;
    VkImageView depthView;
    VkFramebuffer framebuffer;
    VkRenderPass renderPass;
    VkSampler sampler;
};

void RecordShadowMapPass(AppContext& app, const ShadowPass& shadow_pass, VkCommandBuffer cmd)
{
    VkClearValue clear_value = {};
    clear_value.depthStencil = {1.0f, 0};

    VkRenderPassBeginInfo pass_info = {};
    pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    pass_info.renderPass = shadow_pass.renderPass;
    pass_info.framebuffer = shadow_pass.framebuffer;
    pass_info.renderArea.extent = app.shadowExtent;
    pass_info.clearValueCount = 1;
    pass_info.pClearValues = &clear_value;

    vkCmdBeginRenderPass(cmd, &pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.shadowPipeline);
    vkCmdDrawIndexed(cmd, app.shadowIndexCount, 1, 0, 0, 0);
    vkCmdEndRenderPass(cmd);
}

void RecordLitScenePass(AppContext& app, VkCommandBuffer cmd, VkDescriptorSet shadow_descriptor)
{
    BeginFramePass(app, app.currentImageIndex, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.litPipeline);
    vkCmdBindDescriptorSets(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.pipelineLayout, 0, 1, &shadow_descriptor, 0, nullptr);
    vkCmdDrawIndexed(cmd, app.sceneIndexCount, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'يتكون Shadow Mapping من تمريرين: الأول يولد خريطة العمق من منظور الضوء، والثاني يقارن موضع السطح الحالي بهذه الخريطة.',
      'يصبح VkImage العمق مورداً مزدوج الاستخدام: depth attachment أولاً ثم texture مقروءة داخل الشيدر النهائي.',
      'هذا المثال مهم لأنه يربط إنشاء الصور وframebuffers وpipelines وdescriptor sets في مسار متقدم واحد.'
    ],
    expectedResult: 'تظهر ظلال حقيقية على الأسطح البعيدة عن الضوء، مع تمييز واضح بين المناطق المضاءة والمناطق المحجوبة.',
    related: [
      'VkImage',
      'VkImageView',
      'VkFramebuffer',
      'VkRenderPass',
      'VkSampler',
      'vkCmdBeginRenderPass',
      'vkCmdBindDescriptorSets',
      'vkCmdDrawIndexed'
    ],
    previewKind: 'postprocess',
    previewTitle: 'تمرير ظل منفصل يولد Shadow Map ثم يستخدمها في الإضاءة النهائية.'
  }),
  createVulkanCatalogExample({
    id: 'skybox-rendering',
    title: 'مثال Skybox',
    difficulty: 'متقدم',
    goal: 'يوضح هذا المثال كيف يرسم التطبيق Skybox حول المشهد باستخدام Cubemap حتى يظهر خلفية ثلاثية الأبعاد تحيط بالكاميرا.',
    requirements: [
      'Cubemap صالحة أو ست صور مترابطة تمثل وجوه السماء.',
      'Pipeline خاصة بالـ skybox مع تعطيل الكتابة إلى العمق أو ضبطها بالشكل المناسب.',
      'كاميرا تمرر View Matrix من دون الترجمة حتى تبقى السماء ثابتة حول اللاعب.'
    ],
    code: `#include <glm/glm.hpp>

struct SkyboxUniforms {
    glm::mat4 viewProjection;
};

glm::mat4 BuildSkyboxViewProjection(const glm::mat4& view, const glm::mat4& projection)
{
    glm::mat4 rotation_only_view = glm::mat4(glm::mat3(view));
    return projection * rotation_only_view;
}

void RecordSkyboxPass(AppContext& app,
                      VkDescriptorSet skybox_set,
                      VkBuffer cube_vertex_buffer,
                      uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.skyboxPipeline);
    vkCmdBindDescriptorSets(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.skyboxPipelineLayout, 0, 1, &skybox_set, 0, nullptr);

    VkBuffer buffers[] = { cube_vertex_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, buffers, offsets);
    vkCmdDraw(cmd, 36, 1, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'تحذف الترجمة من View Matrix حتى لا تبدو السماء وكأنها تتحرك بعيداً عند انتقال الكاميرا داخل العالم.',
      'يرسم skybox عادة قبل بقية العناصر أو بعدها مع إعدادات عمق خاصة حتى يبقى خلف كل شيء.',
      'يساعد هذا المثال في جعل المشهد أكثر اكتمالاً وعمقاً بصرياً حتى قبل إضافة تفاصيل كثيرة.'
    ],
    expectedResult: 'تظهر خلفية سماوية أو بيئية تحيط بالمشهد بالكامل وتدور مع اتجاه الكاميرا من دون أن تنزاح مع الحركة.',
    related: [
      'VkBuffer',
      'VkDescriptorSet',
      'vkCmdBindPipeline',
      'vkCmdBindDescriptorSets',
      'vkCmdBindVertexBuffers',
      'vkCmdDraw'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'Skybox تحيط بالمشهد وتتحرك مع اتجاه الكاميرا فقط.'
  }),
  createVulkanCatalogExample({
    id: 'post-processing-basic',
    title: 'مثال Post Processing',
    difficulty: 'متقدم',
    goal: 'يشرح هذا المثال كيف يرسم التطبيق المشهد أولاً إلى صورة خارجية Offscreen ثم يمررها إلى Fullscreen Pass ثانٍ لتطبيق تأثير لوني أو بصري قبل العرض النهائي.',
    requirements: [
      'Color attachment خارجية قابلة لأن تُقرأ لاحقاً كـ sampled image.',
      'Render Pass أو Dynamic Rendering لكل من تمرير المشهد وتمرير الشاشة الكاملة.',
      'Pipeline ثانية ترسم full-screen triangle أو quad لتمرير الصورة المعالجة.'
    ],
    code: `#include <vulkan/vulkan.h>

struct OffscreenTarget {
    VkImage image;
    VkImageView view;
    VkFramebuffer framebuffer;
    VkSampler sampler;
};

void RecordSceneToOffscreen(AppContext& app, VkCommandBuffer cmd, const OffscreenTarget& offscreen)
{
    VkRenderPassBeginInfo pass_info = {};
    pass_info.sType = VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO;
    pass_info.renderPass = app.offscreenRenderPass;
    pass_info.framebuffer = offscreen.framebuffer;
    pass_info.renderArea.extent = app.swapchainExtent;

    vkCmdBeginRenderPass(cmd, &pass_info, VK_SUBPASS_CONTENTS_INLINE);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.scenePipeline);
    vkCmdDrawIndexed(cmd, app.sceneIndexCount, 1, 0, 0, 0);
    vkCmdEndRenderPass(cmd);
}

void RecordFullscreenPostProcess(AppContext& app, VkCommandBuffer cmd, VkDescriptorSet offscreen_descriptor)
{
    BeginFramePass(app, app.currentImageIndex, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.postProcessPipeline);
    vkCmdBindDescriptorSets(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.postProcessLayout, 0, 1, &offscreen_descriptor, 0, nullptr);
    vkCmdDraw(cmd, 3, 1, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'الفكرة الأساسية في Post Processing هي فصل رسم المشهد عن عرضه المباشر حتى يصبح بالإمكان معالجته كصورة كاملة.',
      'يمكن استبدال التأثير اللوني البسيط هنا بأي فلتر آخر مثل blur أو tone mapping أو vignette.',
      'هذا المثال هو الأساس الذي يبنى عليه bloom وHDR والعديد من تأثيرات المعالجة اللاحقة الحديثة.'
    ],
    expectedResult: 'يظهر المشهد النهائي بعد مروره بمرحلة معالجة لاحقة مستقلة بدلاً من عرضه الخام مباشرة من تمرير الرسم الأول.',
    related: [
      'VkImage',
      'VkImageView',
      'VkFramebuffer',
      'VkSampler',
      'vkCmdBindPipeline',
      'vkCmdBindDescriptorSets',
      'vkCmdDraw'
    ],
    previewKind: 'postprocess',
    previewTitle: 'رسم المشهد إلى هدف خارجي ثم تطبيق معالجة لاحقة قبل العرض النهائي.'
  }),
  createVulkanCatalogExample({
    id: 'particle-system',
    title: 'مثال Particle System',
    difficulty: 'متقدم',
    goal: 'يعرض هذا المثال بنية جسيمات عملية تعتمد على Storage Buffer أو Vertex Buffer ديناميكي لتحديث مواقع الجسيمات وأعمارها ثم رسمها على شكل billboards أو نقاط.',
    requirements: [
      'بنية بيانات للجسيمات تحفظ الموقع والسرعة والعمر واللون.',
      'آلية تحديث CPU أو Compute أو Vertex Shader تحرك الجسيمات بين الإطارات.',
      'Pipeline مناسبة لرسم billboards أو نقاط شفافة داخل المشهد.'
    ],
    code: `#include <glm/glm.hpp>

struct Particle {
    glm::vec4 positionAge;
    glm::vec4 velocityLife;
    glm::vec4 color;
};

void UpdateParticles(Particle* particles, uint32_t count, float delta_time)
{
    for (uint32_t i = 0; i < count; ++i) {
        particles[i].positionAge += particles[i].velocityLife * delta_time;
        particles[i].positionAge.w -= delta_time;
        if (particles[i].positionAge.w <= 0.0f) {
            RespawnParticle(&particles[i]);
        }
    }
}

void RecordParticleDraw(AppContext& app, VkBuffer particle_buffer, uint32_t particle_count, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.particlePipeline);
    VkBuffer buffers[] = { particle_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, buffers, offsets);
    vkCmdDraw(cmd, 6, particle_count, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'يجمع المثال بين تحديث حالة كل جسيم وبين رسم عدد كبير من النسخ بطريقة عملية داخل الإطار نفسه.',
      'القيمة w داخل positionAge تستخدم هنا عمراً متبقياً للجسيم، وعند انتهائه يعاد توليد الجسيم من جديد.',
      'هذا النمط يستعمل في الدخان والنار والشرر والثلج والتأثيرات البيئية الحديثة.'
    ],
    expectedResult: 'يظهر سيل من الجسيمات المتحركة والمتجددة داخل المشهد، ما يبرهن على قدرة Vulkan على إدارة تأثيرات ديناميكية كثيفة.',
    related: [
      'VkBuffer',
      'VkCommandBuffer',
      'vkCmdBindPipeline',
      'vkCmdBindVertexBuffers',
      'vkCmdDraw'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'جسيمات متحركة تتجدد باستمرار داخل مشهد Vulkan.'
  }),
  createVulkanCatalogExample({
    id: 'terrain-rendering',
    title: 'مثال Terrain Rendering',
    difficulty: 'متقدم',
    goal: 'يوضح هذا المثال كيف يولد التطبيق شبكة أرضية Terrain من شبكة منتظمة أو من Heightmap ثم يرسمها مع تحويلات وكاميرا ومؤشرات ارتفاع فعلية.',
    requirements: [
      'بيانات ارتفاع Height data أو دالة تولد الارتفاع لكل نقطة.',
      'Vertex Buffer وIndex Buffer لشبكة الأرضية.',
      'كاميرا ثلاثية الأبعاد حتى تظهر تضاريس المشهد وعمقه بوضوح.'
    ],
    code: `#include <vector>
#include <glm/glm.hpp>

struct TerrainVertex {
    glm::vec3 position;
    glm::vec3 normal;
    glm::vec2 uv;
};

std::vector<TerrainVertex> BuildTerrainVertices(uint32_t width, uint32_t height, const float* heights)
{
    std::vector<TerrainVertex> vertices;
    vertices.reserve(width * height);

    for (uint32_t z = 0; z < height; ++z) {
        for (uint32_t x = 0; x < width; ++x) {
            uint32_t index = z * width + x;
            TerrainVertex vertex = {};
            vertex.position = glm::vec3(static_cast<float>(x), heights[index], static_cast<float>(z));
            vertex.normal = glm::vec3(0.0f, 1.0f, 0.0f);
            vertex.uv = glm::vec2(static_cast<float>(x) / width, static_cast<float>(z) / height);
            vertices.push_back(vertex);
        }
    }

    return vertices;
}

void RecordTerrainDraw(AppContext& app, VkBuffer terrain_vertex_buffer, VkBuffer terrain_index_buffer, uint32_t index_count, uint32_t image_index)
{
    VkCommandBuffer cmd = app.commandBuffers[image_index];
    BeginFramePass(app, image_index, cmd);
    vkCmdBindPipeline(cmd, VK_PIPELINE_BIND_POINT_GRAPHICS, app.terrainPipeline);

    VkBuffer buffers[] = { terrain_vertex_buffer };
    VkDeviceSize offsets[] = { 0 };
    vkCmdBindVertexBuffers(cmd, 0, 1, buffers, offsets);
    vkCmdBindIndexBuffer(cmd, terrain_index_buffer, 0, VK_INDEX_TYPE_UINT32);
    vkCmdDrawIndexed(cmd, index_count, 1, 0, 0, 0);
    EndFramePass(app, cmd);
}`,
    highlights: [
      'Terrain Rendering يحول بيانات ارتفاع بسيطة إلى Mesh واسعة يمكن للكاميرا التحرك فوقها أو حولها.',
      'يمكن لاحقاً استبدال الارتفاعات الثابتة بخريطة ارتفاع أو توليد إجرائي أكثر تعقيداً.',
      'هذا المثال مهم لفهم المشاريع الكبيرة مثل المحررات والمحاكاة والألعاب المفتوحة.'
    ],
    expectedResult: 'تظهر أرضية واسعة ذات ارتفاعات مرئية بدل سطح مسطح، مع إمكانية ربطها لاحقاً بإضاءة وخامات وكاميرا متقدمة.',
    related: [
      'VkBuffer',
      'vkCmdBindVertexBuffers',
      'vkCmdBindIndexBuffer',
      'vkCmdDrawIndexed',
      'VK_INDEX_TYPE_UINT32'
    ],
    previewKind: 'scene-3d',
    previewTitle: 'شبكة Terrain واسعة مرسومة داخل مشهد Vulkan ثلاثي الأبعاد.'
  })
]);

const VULKAN_READY_EXAMPLES = Object.freeze([
  ...BASE_VULKAN_READY_EXAMPLES,
  ...ADDITIONAL_VULKAN_READY_EXAMPLES,
  ...EXTENDED_VULKAN_READY_EXAMPLES
]);

const VULKAN_TO_SDL3_EXAMPLE_IDS = Object.freeze([
  'sdl3-window-surface',
  'instance-creation',
  'orbit-camera-controller'
]);

const VULKAN_TO_IMGUI_EXAMPLE_IDS = Object.freeze([
  'imgui-integration',
  'imgui-editor-shell-panels',
  'imgui-color-picker-live-material',
  'imgui-drag-drop-asset-browser',
  'imgui-animated-profiler-overlay',
  'imgui-frame-updated-values'
]);

const SDL3_TO_IMGUI_EXAMPLE_SPECS = Object.freeze([
  {packageKey: 'mixer', id: 'mixer-audio-dashboard-imgui'},
  {packageKey: 'core', id: 'sdl3-imgui-menu-color-tools'},
  {packageKey: 'core', id: 'sdl3-imgui-docking-studio'},
  {packageKey: 'core', id: 'sdl3-imgui-tree-combo-gallery'},
  {packageKey: 'core', id: 'sdl3-imgui-text-editor-keyboard'},
  {packageKey: 'core', id: 'sdl3-imgui-effects-lab'},
  {packageKey: 'core', id: 'sdl3-imgui-clock-dashboard'},
  {packageKey: 'core', id: 'sdl3-imgui-circular-car'},
  {packageKey: 'core', id: 'sdl3-imgui-nested-media-menus'}
]);

const VULKAN_TO_SDL3_EXAMPLE_ID_SET = new Set(VULKAN_TO_SDL3_EXAMPLE_IDS);
const VULKAN_TO_IMGUI_EXAMPLE_ID_SET = new Set(VULKAN_TO_IMGUI_EXAMPLE_IDS);
const SDL3_TO_IMGUI_EXAMPLE_KEY_SET = new Set(
  SDL3_TO_IMGUI_EXAMPLE_SPECS.map((entry) => `${entry.packageKey}::${entry.id}`)
);

function getRawVulkanCatalogExampleById(exampleId = '') {
  const normalizedId = String(exampleId || '').trim();
  if (!normalizedId) {
    return null;
  }

  return VULKAN_READY_EXAMPLES.find((example) =>
    example.id === normalizedId
    || ((example.aliases || []).includes(normalizedId))
  ) || null;
}

function getRawSdl3CatalogExampleById(packageKey = '', exampleId = '') {
  const normalizedPackageKey = String(packageKey || '').trim();
  const normalizedExampleId = String(exampleId || '').trim();
  if (!normalizedPackageKey || !normalizedExampleId) {
    return null;
  }

  return SDL3_READY_EXAMPLES.find((example) =>
    example.packageKey === normalizedPackageKey
    && example.id === normalizedExampleId
  ) || null;
}

function isVulkanExampleMovedOut(example = null) {
  const exampleId = String(example?.id || '').trim();
  return VULKAN_TO_SDL3_EXAMPLE_ID_SET.has(exampleId)
    || VULKAN_TO_IMGUI_EXAMPLE_ID_SET.has(exampleId);
}

function isSdl3ExampleMovedToImgui(example = null) {
  const exampleKey = `${String(example?.packageKey || '').trim()}::${String(example?.id || '').trim()}`;
  return SDL3_TO_IMGUI_EXAMPLE_KEY_SET.has(exampleKey);
}

function buildSdl3BridgeExampleFromVulkan(sourceExample, packageKey = 'core') {
  if (!sourceExample) {
    return null;
  }

  const originText = sourceExample.id === 'orbit-camera-controller'
    ? 'نُقل هذا المثال إلى قسم SDL3 لأن الإدخال والأحداث في المثال مبنية على SDL3، بينما يستخدم Vulkan فقط كطبقة رسم للمشهد.'
    : 'نُقل هذا المثال إلى قسم SDL3 لأن SDL3 هي التي توفّر النافذة أو الامتدادات المنصية أو السطح الذي يعتمد عليه المثال عمليًا.';

  return {
    ...sourceExample,
    packageKey,
    sourceLibrary: 'vulkan',
    sourceExampleId: sourceExample.id,
    shows: originText,
    bridgeOriginText: originText
  };
}

function getSdl3BridgeExamples(packageKey = '') {
  const normalizedPackageKey = String(packageKey || '').trim();
  const bridgeExamples = VULKAN_TO_SDL3_EXAMPLE_IDS
    .map((exampleId) => buildSdl3BridgeExampleFromVulkan(getRawVulkanCatalogExampleById(exampleId), 'core'))
    .filter(Boolean);

  if (!normalizedPackageKey) {
    return bridgeExamples;
  }

  return bridgeExamples.filter((example) => example.packageKey === normalizedPackageKey);
}

return {
  SDL3_HOME_FALLBACK_PACKAGE_META,
  SDL3_READY_EXAMPLES,
  VULKAN_READY_EXAMPLES,
  VULKAN_TO_IMGUI_EXAMPLE_IDS,
  SDL3_TO_IMGUI_EXAMPLE_SPECS,
  VULKAN_TO_SDL3_EXAMPLE_ID_SET,
  VULKAN_TO_IMGUI_EXAMPLE_ID_SET,
  getRawVulkanCatalogExampleById,
  getRawSdl3CatalogExampleById,
  isVulkanExampleMovedOut,
  isSdl3ExampleMovedToImgui,
  getSdl3BridgeExamples
};
})();
