#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'data', 'ui', 'sdl3.json');
const SDL_AUDIO_META = {
  key: 'audio',
  displayName: 'SDL3Audio',
  packageName: 'SDL3Audio',
  title: 'SDL3Audio',
  overviewUrl: 'https://wiki.libsdl.org/SDL3/CategoryAudio',
  frontPageUrl: 'https://wiki.libsdl.org/SDL3/CategoryAudio',
  description: 'فرع الصوت في SDL3: فتح الأجهزة الصوتية، إدارة SDL_AudioStream، تحويل PCM، وتهيئة المواصفات والماكرو الرسمية المرتبطة بالصوت.'
};
const KIND_KEYS = ['functions', 'types', 'enums', 'constants', 'macros'];

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html) {
  const withBreaks = String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n');
  return normalizeWhitespace(decodeHtml(withBreaks.replace(/<[^>]+>/g, ' ')));
}

function sanitizePageName(value) {
  return String(value || '')
    .replace(/^\.?\//, '')
    .replace(/^SDL3\//, '')
    .replace(/\.html$/, '')
    .trim();
}

async function fetchPage(pageName) {
  const cleanName = sanitizePageName(pageName);
  const url = `https://wiki.libsdl.org/SDL3/${encodeURIComponent(cleanName)}`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'GraphicsProgrammingAtlas SDL3Audio builder'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractSectionHtml(html, sectionIds) {
  for (const sectionId of sectionIds) {
    const pattern = new RegExp(
      `<h2[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?<\\/h2>([\\s\\S]*?)(?=<h2\\b|<hr\\b|<div class="viewtoolbar")`,
      'i'
    );
    const match = pattern.exec(html);
    if (match) {
      return match[1];
    }
  }
  return '';
}

function extractLinks(sectionHtml) {
  const links = [];
  const linkMatches = String(sectionHtml || '').matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of linkMatches) {
    const href = sanitizePageName(match[1]);
    const label = stripTags(match[2]);
    if (!href || !label) continue;
    links.push({href, label});
  }
  return links;
}

function extractParagraphs(sectionHtml) {
  const texts = [];
  const paragraphMatches = String(sectionHtml || '').match(/<(p|li)[^>]*>[\s\S]*?<\/\1>/gi) || [];
  paragraphMatches.forEach((chunk) => {
    const text = stripTags(chunk);
    if (text && text !== '(none.)') {
      texts.push(text);
    }
  });
  return texts;
}

function extractCodeBlock(sectionHtml) {
  const codeMatch = String(sectionHtml || '').match(/<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/i);
  if (!codeMatch) {
    return '';
  }
  return normalizeWhitespace(decodeHtml(codeMatch[1].replace(/<[^>]+>/g, '')));
}

function extractFirstParagraphAfterH1(html) {
  const afterH1 = /<\/h1>([\s\S]*?)(?=<h2\b|<hr\b)/i.exec(html);
  if (!afterH1) {
    return '';
  }
  const paragraphs = afterH1[1].match(/<p>[\s\S]*?<\/p>/gi) || [];
  for (const paragraph of paragraphs) {
    const text = stripTags(paragraph);
    if (!text || /^Defined in\b/i.test(text)) {
      continue;
    }
    return text;
  }
  return '';
}

function extractHeaderInfo(html) {
  const section = extractSectionHtml(html, ['header-file']);
  const text = stripTags(section);
  const linkMatch = section.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  if (!text) {
    return {header: '', headerUrl: ''};
  }
  return {
    header: linkMatch ? stripTags(linkMatch[2]) : text.replace(/^Defined in\s+/i, ''),
    headerUrl: linkMatch ? decodeHtml(linkMatch[1]) : ''
  };
}

function extractParameters(html) {
  const section = extractSectionHtml(html, ['function-parameters', 'parameters']);
  const rows = [];
  const rowMatches = section.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  for (const match of rowMatches) {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((entry) => stripTags(entry[1]));
    if (cells.length < 3) continue;
    rows.push({
      type: cells[0],
      name: cells[1],
      description: cells[2]
    });
  }
  return rows;
}

function extractFooterCategories(html) {
  const footerMatch = /<hr\s*\/?>\s*<p>([\s\S]*?)<\/p>\s*(?:<div class="viewtoolbar">|<\/body>)/i.exec(html);
  if (!footerMatch) {
    return [];
  }
  return Array.from(footerMatch[1].matchAll(/<a[^>]+>([\s\S]*?)<\/a>/gi), (match) => stripTags(match[1])).filter(Boolean);
}

function inferKind(categories, syntax) {
  if (/^\s*#define\b/i.test(syntax || '')) {
    return 'macro';
  }
  if ((categories || []).includes('CategoryAPIFunction')) return 'function';
  if ((categories || []).includes('CategoryAPIEnum')) return 'enum';
  if ((categories || []).includes('CategoryAPIMacro')) return 'macro';
  if (/^typedef\s+enum\b/i.test(syntax || '')) return 'enum';
  if (/\b[A-Z0-9_]+\s*\(/.test(syntax || '') && !/^typedef\b/i.test(syntax || '')) return 'function';
  return 'type';
}

function extractReferenceName(summaryText) {
  const match = /Please refer to\s+([A-Za-z0-9_]+)/i.exec(summaryText || '');
  return match ? match[1] : '';
}

function parseEnumValues(syntax) {
  const values = [];
  const lines = String(syntax || '').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^typedef\b/i.test(line) || line === '{' || /^}\s*/.test(line)) {
      continue;
    }
    const match = /^([A-Z0-9_]+)\s*(?:=\s*([^,\/]+))?\s*,?\s*(?:\/\*\*<\s*(.*?)\s*\*\/)?\s*$/.exec(line);
    if (!match) continue;
    values.push({
      name: match[1],
      value: normalizeWhitespace(match[2] || ''),
      description: normalizeWhitespace(match[3] || '')
    });
  }
  return values;
}

function localizeAudioFormatValue(valueName) {
  const map = {
    SDL_AUDIO_UNKNOWN: 'تشير هذه القيمة إلى أن تنسيق العينات الصوتية غير معروف بعد أو غير صالح للاعتماد عليه في هذا الموضع.',
    SDL_AUDIO_U8: 'تشير هذه القيمة إلى عينات PCM غير موقعة بعرض 8 بت.',
    SDL_AUDIO_S8: 'تشير هذه القيمة إلى عينات PCM موقعة بعرض 8 بت.',
    SDL_AUDIO_S16LE: 'تشير هذه القيمة إلى عينات PCM موقعة بعرض 16 بت وبترتيب بايتات صغير الطرفية.',
    SDL_AUDIO_S16BE: 'تشير هذه القيمة إلى عينات PCM موقعة بعرض 16 بت وبترتيب بايتات كبير الطرفية.',
    SDL_AUDIO_S32LE: 'تشير هذه القيمة إلى عينات PCM صحيحة بعرض 32 بت وبترتيب بايتات صغير الطرفية.',
    SDL_AUDIO_S32BE: 'تشير هذه القيمة إلى عينات PCM صحيحة بعرض 32 بت وبترتيب بايتات كبير الطرفية.',
    SDL_AUDIO_F32LE: 'تشير هذه القيمة إلى عينات PCM عائمة بعرض 32 بت وبترتيب بايتات صغير الطرفية.',
    SDL_AUDIO_F32BE: 'تشير هذه القيمة إلى عينات PCM عائمة بعرض 32 بت وبترتيب بايتات كبير الطرفية.'
  };
  return map[String(valueName || '')] || '';
}

function localizeEnumValue(enumName, value) {
  if (enumName === 'SDL_AudioFormat') {
    return localizeAudioFormatValue(value.name) || value.description || `قيمة من التعداد ${enumName}.`;
  }
  return value.description || `قيمة من التعداد ${enumName}.`;
}

function buildDerivedConstants(enumItems) {
  const constants = [];
  enumItems.forEach((item) => {
    (item.values || []).forEach((value) => {
      constants.push({
        name: value.name,
        packageKey: 'audio',
        packageName: SDL_AUDIO_META.packageName,
        packageDisplayName: SDL_AUDIO_META.displayName,
        packageDescription: SDL_AUDIO_META.description,
        categoryKey: 'CategoryAudio',
        categoryTitle: 'SDL3 Audio API',
        categorySectionTitle: 'SDL3Audio',
        kind: 'constant',
        description: value.description || `قيمة من التعداد ${item.name}.`,
        value: value.value,
        parentEnum: item.name,
        officialUrl: `https://wiki.libsdl.org/SDL3/${encodeURIComponent(value.name)}`,
        referenceName: item.name
      });
    });
  });
  return constants;
}

function sortByName(items) {
  items.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'en'));
}

async function parseItemPage(pageName) {
  const html = await fetchPage(pageName);
  const nameMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!nameMatch) return null;
  const name = stripTags(nameMatch[1]);
  const summary = extractFirstParagraphAfterH1(html);
  const headerInfo = extractHeaderInfo(html);
  const syntax = extractCodeBlock(extractSectionHtml(html, ['syntax']));
  const parameters = extractParameters(html);
  const returnValue = extractParagraphs(extractSectionHtml(html, ['return-value']))[0] || '';
  const remarks = extractParagraphs(extractSectionHtml(html, ['remarks']));
  const threadSafety = extractParagraphs(extractSectionHtml(html, ['thread-safety'])).join(' ');
  const version = extractParagraphs(extractSectionHtml(html, ['version']))[0] || '';
  const seeAlsoLinks = extractLinks(extractSectionHtml(html, ['see-also']));
  const categories = extractFooterCategories(html);
  const kind = inferKind(categories, syntax);
  const item = {
    name,
    packageKey: 'audio',
    packageName: SDL_AUDIO_META.packageName,
    packageDisplayName: SDL_AUDIO_META.displayName,
    packageDescription: SDL_AUDIO_META.description,
    categoryKey: 'CategoryAudio',
    categoryTitle: 'SDL3 Audio API',
    categorySectionTitle: 'SDL3Audio',
    kind,
    sourceCategories: categories,
    description: summary,
    header: headerInfo.header,
    headerUrl: headerInfo.headerUrl,
    syntax,
    parameters,
    returns: returnValue,
    remarks,
    threadSafety,
    version,
    seeAlso: seeAlsoLinks.map((entry) => sanitizePageName(entry.href)).filter(Boolean),
    seeAlsoLabels: seeAlsoLinks,
    referenceName: extractReferenceName(summary),
    officialUrl: `https://wiki.libsdl.org/SDL3/${encodeURIComponent(name)}`
  };

  if (item.kind === 'enum') {
    item.values = parseEnumValues(item.syntax).map((value) => ({
      ...value,
      description: localizeEnumValue(item.name, value)
    }));
  }

  return item;
}

async function collectCategoryEntries() {
  const html = await fetchPage('CategoryAudio');
  const result = {
    functions: [],
    datatypes: [],
    structs: [],
    enums: [],
    macros: []
  };
  const sectionMap = {
    functions: ['functions'],
    datatypes: ['datatypes'],
    structs: ['structs'],
    enums: ['enums'],
    macros: ['macros']
  };

  Object.entries(sectionMap).forEach(([key, ids]) => {
    const section = extractSectionHtml(html, ids);
    result[key] = Array.from(new Set(
      extractLinks(section)
        .map((entry) => sanitizePageName(entry.href))
        .filter((entry) => entry && !entry.startsWith('Category'))
    ));
  });

  return result;
}

async function buildAudioData() {
  const categoryEntries = await collectCategoryEntries();
  const entityData = {
    functions: [],
    types: [],
    enums: [],
    constants: [],
    macros: []
  };

  const pageNames = [
    ...categoryEntries.functions,
    ...categoryEntries.datatypes,
    ...categoryEntries.structs,
    ...categoryEntries.enums,
    ...categoryEntries.macros
  ];

  for (const pageName of pageNames) {
    const item = await parseItemPage(pageName);
    if (!item || !item.name) continue;
    if (item.kind === 'function') {
      entityData.functions.push(item);
    } else if (item.kind === 'enum') {
      entityData.enums.push(item);
    } else if (item.kind === 'macro') {
      entityData.macros.push(item);
    } else {
      entityData.types.push(item);
    }
  }

  entityData.constants = buildDerivedConstants(entityData.enums);
  KIND_KEYS.forEach((key) => sortByName(entityData[key]));
  return entityData;
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const audioData = await buildAudioData();
  const audioNameSets = KIND_KEYS.reduce((acc, key) => {
    acc[key] = new Set(audioData[key].map((item) => item.name));
    return acc;
  }, {});

  KIND_KEYS.forEach((key) => {
    const baseItems = Array.isArray(existing?.sdl3EntityData?.[key]) ? existing.sdl3EntityData[key] : [];
    existing.sdl3EntityData[key] = baseItems
      .filter((item) => {
        const packageKey = String(item?.packageKey || '');
        const name = String(item?.name || '');
        if (packageKey === 'audio') return false;
        if (packageKey === 'core' && audioNameSets[key].has(name)) return false;
        return true;
      })
      .concat(audioData[key]);
    sortByName(existing.sdl3EntityData[key]);
  });

  existing.sdl3PackageMeta = existing.sdl3PackageMeta || {};
  existing.sdl3PackageMeta.audio = {
    ...SDL_AUDIO_META,
    counts: {}
  };

  Object.entries(existing.sdl3PackageMeta).forEach(([packageKey, meta]) => {
    existing.sdl3PackageMeta[packageKey] = {
      ...meta,
      counts: KIND_KEYS.reduce((acc, key) => {
        acc[key] = (existing.sdl3EntityData[key] || []).filter((item) => String(item?.packageKey || '') === packageKey).length;
        return acc;
      }, {})
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  process.stdout.write(`${JSON.stringify(existing.sdl3PackageMeta.audio.counts)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
