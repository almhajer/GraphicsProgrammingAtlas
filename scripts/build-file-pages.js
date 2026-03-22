const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sdkRoot = path.join(rootDir, 'sdk_include', 'vulkan');
const utilityRoot = path.join(sdkRoot, 'utility');
const outputDir = path.join(rootDir, 'pages', 'files');
const assetVersion = '20260318-file-pages-cursor106';
const LARGE_FILE_LINE_THRESHOLD = 1200;
const SOURCE_CHUNK_LINE_COUNT = 450;

const sections = [
  {
    key: 'headers',
    title: 'ملفات vulkan',
    dir: sdkRoot,
    sectionPath: 'vulkan'
  },
  {
    key: 'utility',
    title: 'ملفات vulkan/utility',
    dir: utilityRoot,
    sectionPath: 'vulkan/utility'
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readSource(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function discoverFiles(section) {
  if (!fs.existsSync(section.dir)) {
    return [];
  }

  return fs.readdirSync(section.dir)
    .filter((fileName) => /\.(h|hpp|cppm)$/.test(fileName))
    .sort((left, right) => left.localeCompare(right));
}

function inferCategoryLabel(fileName, sectionKey) {
  if (sectionKey === 'utility') return 'utility';
  if (fileName === 'vulkan.h') return 'الرئيسي';
  if (fileName === 'vulkan_core.h') return 'النواة';
  if (fileName.endsWith('.cppm')) return 'C++ Modules';
  if (fileName.endsWith('.hpp')) return 'C++ / HPP';
  if (/win32|android|wayland|xlib|xcb|metal|macos|ios|screen|directfb|fuchsia|ggp|ohos|vi/.test(fileName)) return 'منصات';
  if (/^vk_/.test(fileName)) return 'مساعدات';
  return 'عام';
}

function inferDescription(fileName, sectionKey) {
  if (sectionKey === 'utility') {
    return `ملف مساعد ضمن vulkan/utility يضيف طبقة خدمية فوق تعريفات Vulkan الأساسية لتبسيط مهام متكررة أو داخلية.`;
  }
  if (fileName === 'vulkan_core.h') {
    return 'يحتوي على النواة الأساسية لواجهة Vulkan: الأنواع، الهياكل، التعدادات، وتصريحات الدوال العامة بعيداً عن ترويسات المنصات.';
  }
  if (fileName === 'vulkan.h') {
    return 'الملف الرئيسي الذي يجمع تعريفات Vulkan الأساسية ويضم الترويسات القياسية الشائعة في أغلب المشاريع.';
  }
  if (fileName.endsWith('.cppm')) {
    return `وحدة C++ Modules خاصة بالملف ${fileName} ضمن طبقة Vulkan-Hpp.`;
  }
  if (fileName.endsWith('.hpp')) {
    return `ترويسة C++ ضمن طبقة Vulkan-Hpp تعرض واجهات وأنواعاً مغلفة بصياغة أحدث من الواجهة C التقليدية.`;
  }
  return `ترويسة ${fileName} ضمن مجلد vulkan وتغطي جزءاً محدداً من واجهة Vulkan أو إحدى طبقاتها أو امتداداتها.`;
}

function inferUsage(fileName, sectionKey) {
  if (sectionKey === 'utility') {
    return `استخدم ${fileName} عندما تحتاج وظائف أو بنى مساعدة تدعم الطبقات أو الأدوات أو الشيفرات المساندة حول Vulkan.`;
  }
  if (fileName.endsWith('.cppm')) {
    return `استخدم ${fileName} إذا كان مشروعك يعتمد C++ Modules بدلاً من تضمين الترويسات التقليدية.`;
  }
  if (fileName.endsWith('.hpp')) {
    return `استخدم ${fileName} عندما تبني التطبيق بواجهة Vulkan-Hpp وتريد أصناف C++ وواجهاتها الحديثة.`;
  }
  return `استخدم ${fileName} عندما تحتاج الجزء الذي يغطيه هذا الملف من واجهة Vulkan بدلاً من الاكتفاء بالترويسة العامة وحدها.`;
}

function buildExample(fileName, sectionPath) {
  if (fileName.endsWith('.cppm')) {
    return `import ${fileName.replace(/\.cppm$/, '')};`;
  }

  return `#include <${sectionPath}/${fileName}>`;
}

function normalizeLocalInclude(includePath) {
  const normalized = String(includePath || '').trim();
  if (normalized.startsWith('vulkan/utility/')) {
    return normalized.slice('vulkan/utility/'.length);
  }
  if (normalized.startsWith('vulkan/')) {
    return normalized.slice('vulkan/'.length);
  }
  return '';
}

function extractIncludes(sourceText) {
  const includes = [];
  const seen = new Set();

  for (const match of String(sourceText || '').matchAll(/^#include\s+[<"]([^>"]+)[>"]/gm)) {
    const includePath = match[1];
    if (seen.has(includePath)) {
      continue;
    }
    seen.add(includePath);
    includes.push(includePath);
  }

  return includes;
}

function cleanCommentText(rawComment) {
  return String(rawComment || '')
    .replace(/^\/\*+/, '')
    .replace(/\*+\/$/, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\/\/\s?/, '').replace(/^\s*\*\s?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCommentUseful(commentText) {
  if (!commentText) {
    return false;
  }

  if (/copyright|spdx-license-identifier/i.test(commentText)) {
    return false;
  }

  if (commentText.length < 18) {
    return false;
  }

  return true;
}

function extractCommentInsights(sourceText) {
  const lines = String(sourceText || '').split(/\r?\n/);
  const insights = [];
  const seen = new Set();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    let rawComment = '';

    if (line.startsWith('/*')) {
      rawComment = lines[index];
      while (index + 1 < lines.length && !lines[index].includes('*/')) {
        index += 1;
        rawComment += `\n${lines[index]}`;
        if (lines[index].includes('*/')) {
          break;
        }
      }
    } else if (line.startsWith('//')) {
      rawComment = lines[index];
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith('//')) {
        index += 1;
        rawComment += `\n${lines[index]}`;
      }
    } else {
      continue;
    }

    const text = cleanCommentText(rawComment);
    if (!isCommentUseful(text) || seen.has(text)) {
      continue;
    }

    let context = '';
    for (let lookAhead = index + 1; lookAhead < Math.min(lines.length, index + 8); lookAhead += 1) {
      const candidate = lines[lookAhead].trim();
      if (!candidate || candidate.startsWith('//') || candidate.startsWith('/*') || candidate.startsWith('*')) {
        continue;
      }

      const contextMatch =
        candidate.match(/^#define\s+([A-Za-z_][A-Za-z0-9_]*)/) ||
        candidate.match(/^typedef\s+enum\s+([A-Za-z_][A-Za-z0-9_]*)/) ||
        candidate.match(/^typedef\s+struct\s+([A-Za-z_][A-Za-z0-9_]*_?)?/) ||
        candidate.match(/^(?:VKAPI_ATTR\s+)?[A-Za-z_][A-Za-z0-9_*\s]+\s+VKAPI_CALL\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/) ||
        candidate.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(/);

      context = (contextMatch && contextMatch[1]) ? contextMatch[1] : candidate.slice(0, 120);
      break;
    }

    seen.add(text);
    insights.push({text, context});
  }

  return insights;
}

function analyzeSource(sourceText, entry, includes) {
  const text = String(sourceText || '');
  const commentInsights = extractCommentInsights(text);

  const facts = {
    includeCount: includes.length,
    defineCount: (text.match(/^\s*#define\b/gm) || []).length,
    ifdefCount: (text.match(/^\s*#(?:if|ifdef|ifndef|elif|else|endif)\b/gm) || []).length,
    enumCount: (text.match(/\btypedef\s+enum\b/g) || []).length,
    structCount: (text.match(/\btypedef\s+struct\b/g) || []).length,
    handleCount: (text.match(/\bVK_DEFINE_(?:NON_DISPATCHABLE_)?HANDLE\(/g) || []).length,
    functionPointerCount: (text.match(/\bPFN_vk[A-Za-z0-9_]+/g) || []).length,
    prototypeCount: (text.match(/\bVKAPI_CALL\s+vk[A-Za-z0-9_]+\s*\(/g) || []).length,
    classCount: (text.match(/\bclass\s+[A-Za-z_][A-Za-z0-9_]*/g) || []).length,
    namespaceCount: (text.match(/\bnamespace\s+[A-Za-z_][A-Za-z0-9_]*/g) || []).length,
    inlineMethodCount: (text.match(/\binline\b/g) || []).length,
    extensionMentionCount: (text.match(/\b(?:KHR|EXT|NV|AMD|QCOM|ANDROID|MVK|FUCHSIA|OHOS|VALVE|LUNARG)\b/g) || []).length,
    commentInsights
  };

  const intents = [];

  if (/generated from the khronos vulkan xml api registry/i.test(text)) {
    intents.push('هذا الملف مولد آلياً من Vulkan XML Registry، لذلك دوره الأساسي هو تثبيت التعريفات الرسمية كما يفهمها الـ loader والسواقات والتطبيقات، لا تقديم منطق تنفيذي مستقل.');
  }

  if (entry.fileName === 'vulkan_core.h') {
    intents.push('هذا هو المرجع المركزي لـ ABI وواجهة C الأساسية في Vulkan: الأنواع العددية، المقابض، الثوابت، التعدادات، والهياكل ثم تصريحات الدوال العامة. أغلب الترويسات الأخرى تبني فوقه ولا تستبدله.');
  } else if (entry.fileName === 'vulkan.h') {
    intents.push('هذا الملف يعمل كنقطة دخول جامعة: يضم الترويسات الأساسية والمنصاتية الشائعة حتى لا تحتاج اختيار كل ملف جزئي يدوياً عند بدء مشروع Vulkan عادي.');
  } else if (entry.fileName === 'vk_layer.h') {
    intents.push('هذا الملف ليس للاستخدام اليومي داخل تطبيق يرسم بالمباشر، بل هو عقد الربط بين الـ loader والـ layers: التفاوض على الواجهة، تمرير dispatch tables، وربط سلاسل CreateInstance/CreateDevice بين الطبقات.');
  } else if (entry.fileName === 'vk_icd.h') {
    intents.push('هذا الملف يركز على الحدود بين Vulkan loader وـ ICD، لذلك قيمته العملية تظهر عند تطوير سواقة أو مكوّن منخفض المستوى يتحدث مباشرة مع واجهة التحميل.');
  } else if (entry.sectionKey === 'utility') {
    intents.push('هذا الملف أداة مساندة أكثر من كونه جزءاً من عقد API الرسمي؛ الغرض منه تسهيل النسخ، التحويل، dispatch، أو التعامل مع هياكل Vulkan المساعدة داخل الأدوات والطبقات.');
  } else if (entry.fileName.endsWith('.hpp')) {
    intents.push('هذا الملف جزء من طبقة Vulkan-Hpp: يعيد تقديم المفاهيم نفسها لكن بصياغة C++ أقوى نوعياً، لذلك الهدف الحقيقي هنا ليس تعريف API جديدة بل تغليف الـ API الرسمية بطريقة أكثر أماناً ووضوحاً.');
  } else if (entry.fileName.endsWith('.cppm')) {
    intents.push('هذا الملف يقدّم نفس مفاهيم Vulkan-Hpp تقريباً لكن عبر C++ Modules، أي أن هدفه الرئيسي تحسين أسلوب الاستيراد والبناء لا تغيير محتوى الواجهة نفسها.');
  }

  if (facts.prototypeCount > 50 || facts.enumCount > 10 || facts.structCount > 25) {
    intents.push(`محتواه يغلب عليه الطابع المرجعي التجميعي: ${facts.structCount} بنية، ${facts.enumCount} تعداد، و${facts.prototypeCount} تصريح دالة تقريباً، ما يعني أنه خريطة تعريفات أكثر من كونه ملف منطق إجرائي.`);
  }

  if (facts.functionPointerCount > 20 && /layer|dispatch|icd/i.test(entry.fileName)) {
    intents.push('كثرة مؤشرات الدوال هنا تعني أن الملف يصف آلية تمرير الاستدعاءات وربطها ديناميكياً بين أطراف مختلفة، لا مجرد إعلان دوال ثابتة للاستدعاء المباشر.');
  }

  if (facts.ifdefCount > 20 && facts.extensionMentionCount > 20) {
    intents.push('كثرة شروط المعالج المسبق ووسوم الامتدادات تشير إلى أن الملف يوفّر طبقة توافق واسعة بين إصدارات وامتدادات ومنصات متعددة، لذلك تنظيم الحراس والماكرو جزء أساسي من هدفه.');
  }

  if (!intents.length) {
    intents.push('هدف هذا الملف هو تعريف السطح البرمجي أو البنية المساندة المرتبطة بالمجال الذي يغطيه، مع ترك المنطق التنفيذي الفعلي غالباً للتطبيق أو للـ loader أو للسواقة.');
  }

  const anatomy = [];
  if (facts.includeCount) anatomy.push(`يستورد ${facts.includeCount} ملفاً آخر قبل بناء تعريفاته الخاصة.`);
  if (facts.defineCount) anatomy.push(`فيه ${facts.defineCount} ماكرو/تعريفاً مسبقاً لتنظيم التوافق، النسخ، أو بناء الأنواع.`);
  if (facts.handleCount) anatomy.push(`يعرف أو يعلن ${facts.handleCount} مقبضاً من مقابض Vulkan.`);
  if (facts.enumCount) anatomy.push(`يحتوي على ${facts.enumCount} تعداداً يعبّر عن الحالات أو الأنواع أو الأعلام.`);
  if (facts.structCount) anatomy.push(`يحتوي على ${facts.structCount} بنية لتمرير البيانات بين التطبيق والواجهة.`);
  if (facts.prototypeCount) anatomy.push(`يعلن ${facts.prototypeCount} دالة أو نقطة دخول من API.`);
  if (facts.functionPointerCount) anatomy.push(`يستخدم ${facts.functionPointerCount} مؤشراً لدالة، ما يبرز دور الربط الديناميكي أو dispatch.`);
  if (facts.classCount || facts.namespaceCount || facts.inlineMethodCount) {
    anatomy.push(`ملامحه C++ واضحة: ${facts.namespaceCount} namespace، ${facts.classCount} class، و${facts.inlineMethodCount} استعمالاً لـ inline تقريباً.`);
  }

  return {
    intents,
    anatomy,
    commentInsights: commentInsights.slice(0, 8)
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function splitSourceIntoChunks(sourceText) {
  const lines = String(sourceText || '').split(/\r?\n/);
  if (lines.length <= LARGE_FILE_LINE_THRESHOLD) {
    return [{
      index: 0,
      startLine: 1,
      endLine: lines.length,
      lineCount: lines.length,
      content: sourceText
    }];
  }

  const chunks = [];
  for (let start = 0; start < lines.length; start += SOURCE_CHUNK_LINE_COUNT) {
    const end = Math.min(start + SOURCE_CHUNK_LINE_COUNT, lines.length);
    chunks.push({
      index: chunks.length,
      startLine: start + 1,
      endLine: end,
      lineCount: end - start,
      content: lines.slice(start, end).join('\n')
    });
  }

  return chunks;
}

function getChunkPageFileName(fileName, chunkIndex) {
  return `${fileName}--section-${chunkIndex + 1}.html`;
}

function getChunkDataFileName(fileName, chunkIndex) {
  return `${fileName}--section-${chunkIndex + 1}.json`;
}

function getFileManifestFileName(fileName) {
  return `${fileName}.manifest.json`;
}

function getChunkTitle(chunk, totalChunks) {
  return `القسم ${chunk.index + 1} من ${totalChunks} • الأسطر ${chunk.startLine}-${chunk.endLine}`;
}

function getChunkPreview(chunk) {
  return String(chunk.content || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*'))
    || 'مقطع من المصدر';
}

function buildFileManifest(entry, chunks, lineCount, totalBytes, stat) {
  return {
    fileName: entry.fileName,
    relativeSourcePath: entry.relativeSourcePath,
    lineCount,
    totalBytes,
    lastModified: new Date(stat.mtimeMs).toISOString(),
    chunks: chunks.map((chunk) => ({
      index: chunk.index,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      lineCount: chunk.lineCount,
      preview: getChunkPreview(chunk)
    }))
  };
}

function buildChunkPayload(entry, chunk) {
  return {
    fileName: entry.fileName,
    index: chunk.index,
    startLine: chunk.startLine,
    endLine: chunk.endLine,
    lineCount: chunk.lineCount,
    content: chunk.content
  };
}

function renderChunkCards(entry, chunks) {
  return `
    <div class="chunk-grid">
      ${chunks.map((chunk) => `
        <a class="chunk-card" href="./${encodeURIComponent(getChunkPageFileName(entry.fileName, chunk.index))}">
          <strong>${escapeHtml(getChunkTitle(chunk, chunks.length))}</strong>
          <span>${escapeHtml(getChunkPreview(chunk).slice(0, 160))}</span>
        </a>
      `).join('')}
    </div>
  `;
}

function renderChunkPager(entry, chunks, currentIndex) {
  const previous = currentIndex > 0 ? chunks[currentIndex - 1] : null;
  const next = currentIndex < chunks.length - 1 ? chunks[currentIndex + 1] : null;

  return `
    <div class="chunk-pager">
      <a class="standalone-link" href="./${encodeURIComponent(entry.fileName)}.html">ملخص الملف</a>
      ${previous ? `<a class="standalone-link" href="./${encodeURIComponent(getChunkPageFileName(entry.fileName, previous.index))}">القسم السابق</a>` : '<span class="standalone-link is-disabled">لا يوجد قسم سابق</span>'}
      ${next ? `<a class="standalone-link" href="./${encodeURIComponent(getChunkPageFileName(entry.fileName, next.index))}">القسم التالي</a>` : '<span class="standalone-link is-disabled">لا يوجد قسم لاحق</span>'}
    </div>
  `;
}

function renderIncludeLinks(includes, knownFiles) {
  if (!includes.length) {
    return '<li>لا توجد ملفات مضمنة مباشرة في هذا الملف.</li>';
  }

  return includes.map((includePath) => {
    const localFileName = normalizeLocalInclude(includePath);
    if (localFileName && knownFiles.has(localFileName)) {
      return `<li><a class="standalone-link" href="./${encodeURIComponent(localFileName)}.html"><code>${escapeHtml(includePath)}</code></a></li>`;
    }

    return `<li><code>${escapeHtml(includePath)}</code></li>`;
  }).join('');
}

function renderStandaloneHead({title, description}) {
  return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/main.css?v=${assetVersion}">
  <link rel="stylesheet" href="../../css/file-pages.css?v=${assetVersion}">
</head>`;
}

function renderIndexPage(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    if (!grouped.has(entry.sectionTitle)) {
      grouped.set(entry.sectionTitle, []);
    }
    grouped.get(entry.sectionTitle).push(entry);
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
${renderStandaloneHead({
  title: 'فهرس ملفات Vulkan - ArabicVulkan',
  description: 'فهرس ملفات Vulkan الثابتة'
})}
<body class="file-standalone-body">
  <main class="standalone-page is-index">
    <div class="standalone-topbar">
      <a class="standalone-link" href="../../index.html">العودة إلى الصفحة الرئيسية</a>
    </div>

    <div class="page-header">
      <h1 class="page-title">📄 فهرس ملفات Vulkan</h1>
      <p class="page-description">صفحات HTML ثابتة لكل ملفات <span dir="ltr">sdk_include/vulkan</span> حتى تُفتح مباشرة من دون بناء ديناميكي داخل المتصفح.</p>
    </div>

    ${Array.from(grouped.entries()).map(([title, group]) => `
      <section class="standalone-section">
        <h2>${escapeHtml(title)}</h2>
        <div class="file-grid">
          ${group.map((entry) => `
            <a class="file-card" href="./${encodeURIComponent(entry.fileName)}.html">
              <code>${escapeHtml(entry.fileName)}</code>
              <span>${escapeHtml(entry.category)}</span>
            </a>
          `).join('')}
        </div>
      </section>
    `).join('')}
  </main>
</body>
</html>
`;
}

function renderFilePage(entry, knownFiles) {
  const sourceText = readSource(entry.absolutePath);
  const chunks = splitSourceIntoChunks(sourceText);
  const localIncludes = extractIncludes(sourceText);
  const analysis = analyzeSource(sourceText, entry, localIncludes);
  const stat = fs.statSync(entry.absolutePath);
  const lineCount = sourceText.split(/\r?\n/).length;
  const bytes = Buffer.byteLength(sourceText, 'utf8');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
${renderStandaloneHead({
  title: `${entry.fileName} - ArabicVulkan`,
  description: entry.description
})}
<body class="file-standalone-body">
  <main class="standalone-page">
    <div class="standalone-topbar">
      <a class="standalone-link" href="../../index.html">العودة إلى الصفحة الرئيسية</a>
      <a class="standalone-link" href="./index.html">فهرس الملفات</a>
      <a class="standalone-link" href="../../${escapeHtml(entry.relativeSourcePath)}">فتح الملف الأصلي</a>
    </div>

    <div class="page-header">
      <nav class="breadcrumb">
        <a href="../../index.html">الرئيسية</a> /
        <a href="./index.html">الملفات</a> /
        <span>${escapeHtml(entry.fileName)}</span>
      </nav>
      <h1 class="page-title">📄 ${escapeHtml(entry.fileName)}</h1>
      <p class="page-description">${escapeHtml(entry.description)}</p>
      <div class="standalone-badges">
        <span class="standalone-badge">${escapeHtml(entry.sectionTitle)}</span>
        <span class="standalone-badge">${escapeHtml(entry.category)}</span>
        <span class="standalone-badge"><span dir="ltr">${escapeHtml(entry.sectionPath + '/' + entry.fileName)}</span></span>
      </div>
    </div>

    <div class="standalone-grid">
      <section class="standalone-card">
        <h2>الهدف الفعلي للملف</h2>
        <ul class="insight-list">
          ${analysis.intents.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
      <section class="standalone-card">
        <h2>متى تستخدمه؟</h2>
        <p>${escapeHtml(entry.usage)}</p>
      </section>
      <section class="standalone-card">
        <h2>مثال تضمين</h2>
        <pre class="code-block" dir="ltr"><code class="language-cpp">${escapeHtml(entry.example)}</code></pre>
      </section>
      <section class="standalone-card">
        <h2>الملفات المضمنة</h2>
        <ul>${renderIncludeLinks(localIncludes, knownFiles)}</ul>
      </section>
      <section class="standalone-card">
        <h2>تركيب الملف</h2>
        <ul class="insight-list">
          ${analysis.anatomy.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>لا توجد مؤشرات تركيبية بارزة لهذا الملف.</li>'}
        </ul>
      </section>
      <section class="standalone-card">
        <h2>ما الذي تقوله التعليقات نفسها؟</h2>
        <ul class="insight-list">
          ${analysis.commentInsights.map((item) => `
            <li>
              ${escapeHtml(item.text)}
              ${item.context ? `<span class="comment-context">${escapeHtml(item.context)}</span>` : ''}
            </li>
          `).join('') || '<li>لا توجد تعليقات تفسيرية بارزة في هذا الملف تتجاوز التعليقات القانونية أو الشكلية.</li>'}
        </ul>
      </section>
    </div>

    ${chunks.length === 1 ? `
    <section class="source-panel">
      <div class="source-toolbar">
        <span class="source-stat">الأسطر: ${lineCount.toLocaleString('en-US')}</span>
        <span class="source-stat">الحجم: ${formatBytes(bytes)}</span>
        <span class="source-stat">آخر تعديل: ${new Date(stat.mtimeMs).toISOString().slice(0, 10)}</span>
      </div>
      <pre class="source-block"><code>${escapeHtml(sourceText)}</code></pre>
    </section>
    ` : `
    <section class="source-overview">
      <h2>📚 أقسام المصدر</h2>
      <p>هذا الملف كبير (${lineCount.toLocaleString('en-US')} سطر)، لذلك قُسِّم إلى صفحات أقسام ثابتة متتابعة حتى لا يعلق المتصفح. افتح القسم المطلوب ثم انتقل عبر السابق/التالي.</p>
      <div class="source-toolbar">
        <span class="source-stat">الأسطر: ${lineCount.toLocaleString('en-US')}</span>
        <span class="source-stat">الحجم: ${formatBytes(bytes)}</span>
        <span class="source-stat">عدد الأقسام: ${chunks.length}</span>
        <span class="source-stat">آخر تعديل: ${new Date(stat.mtimeMs).toISOString().slice(0, 10)}</span>
      </div>
      ${renderChunkCards(entry, chunks)}
    </section>
    `}
  </main>
</body>
</html>
`;
}

function renderChunkPage(entry, chunk, chunks, stat, totalBytes) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
${renderStandaloneHead({
  title: `${entry.fileName} • ${getChunkTitle(chunk, chunks.length)} - ArabicVulkan`,
  description: entry.description
})}
<body class="file-standalone-body">
  <main class="standalone-page">
    <div class="standalone-topbar">
      <a class="standalone-link" href="../../index.html">العودة إلى الصفحة الرئيسية</a>
      <a class="standalone-link" href="./index.html">فهرس الملفات</a>
      <a class="standalone-link" href="./${encodeURIComponent(entry.fileName)}.html">ملخص الملف</a>
      <a class="standalone-link" href="../../${escapeHtml(entry.relativeSourcePath)}">فتح الملف الأصلي</a>
    </div>

    <div class="page-header">
      <nav class="breadcrumb">
        <a href="../../index.html">الرئيسية</a> /
        <a href="./index.html">الملفات</a> /
        <a href="./${encodeURIComponent(entry.fileName)}.html">${escapeHtml(entry.fileName)}</a> /
        <span>${escapeHtml(getChunkTitle(chunk, chunks.length))}</span>
      </nav>
      <h1 class="page-title">📄 ${escapeHtml(entry.fileName)}</h1>
      <p class="page-description">${escapeHtml(getChunkTitle(chunk, chunks.length))}</p>
    </div>

    ${renderChunkPager(entry, chunks, chunk.index)}

    <section class="source-panel">
      <div class="source-toolbar">
        <span class="source-stat">الملف: ${escapeHtml(entry.fileName)}</span>
        <span class="source-stat">القسم: ${chunk.index + 1}/${chunks.length}</span>
        <span class="source-stat">الأسطر: ${chunk.startLine}-${chunk.endLine}</span>
        <span class="source-stat">حجم الملف: ${formatBytes(totalBytes)}</span>
        <span class="source-stat">آخر تعديل: ${new Date(stat.mtimeMs).toISOString().slice(0, 10)}</span>
      </div>
      <pre class="source-block"><code>${escapeHtml(chunk.content)}</code></pre>
    </section>

    ${renderChunkPager(entry, chunks, chunk.index)}
  </main>
</body>
</html>
`;
}

function buildEntries() {
  const entries = [];

  sections.forEach((section) => {
    discoverFiles(section).forEach((fileName) => {
      entries.push({
        fileName,
        sectionKey: section.key,
        sectionTitle: section.title,
        sectionPath: section.sectionPath,
        absolutePath: path.join(section.dir, fileName),
        relativeSourcePath: path.relative(rootDir, path.join(section.dir, fileName)),
        category: inferCategoryLabel(fileName, section.key),
        description: inferDescription(fileName, section.key),
        usage: inferUsage(fileName, section.key),
        example: buildExample(fileName, section.sectionPath)
      });
    });
  });

  return entries;
}

function main() {
  ensureDir(outputDir);

  const entries = buildEntries();
  const knownFiles = new Set(entries.map((entry) => entry.fileName));

  entries.forEach((entry) => {
    const sourceText = readSource(entry.absolutePath);
    const chunks = splitSourceIntoChunks(sourceText);
    const stat = fs.statSync(entry.absolutePath);
    const totalBytes = Buffer.byteLength(sourceText, 'utf8');
    const lineCount = sourceText.split(/\r?\n/).length;
    const outputPath = path.join(outputDir, `${entry.fileName}.html`);
    fs.writeFileSync(outputPath, renderFilePage(entry, knownFiles));
    fs.writeFileSync(
      path.join(outputDir, getFileManifestFileName(entry.fileName)),
      JSON.stringify(buildFileManifest(entry, chunks, lineCount, totalBytes, stat))
    );
    if (chunks.length > 1) {
      chunks.forEach((chunk) => {
        const chunkPath = path.join(outputDir, getChunkPageFileName(entry.fileName, chunk.index));
        fs.writeFileSync(chunkPath, renderChunkPage(entry, chunk, chunks, stat, totalBytes));
        fs.writeFileSync(
          path.join(outputDir, getChunkDataFileName(entry.fileName, chunk.index)),
          JSON.stringify(buildChunkPayload(entry, chunk))
        );
      });
    } else if (chunks[0]) {
      fs.writeFileSync(
        path.join(outputDir, getChunkDataFileName(entry.fileName, chunks[0].index)),
        JSON.stringify(buildChunkPayload(entry, chunks[0]))
      );
    }
  });

  fs.writeFileSync(path.join(outputDir, 'index.html'), renderIndexPage(entries));

  console.log(JSON.stringify({
    output: path.relative(rootDir, outputDir),
    files: entries.length
  }, null, 2));
}

main();
