#!/usr/bin/env node

/**
 * تحويل محتوى data/ui/tutorials.js إلى ملف JSON منظم.
 * يعتمد على placeholders ترمز للعناصر التفاعلية التي تُعاد كتابتها في runtime.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PLACEHOLDER_PREFIX = '__TPL__';
const PLACEHOLDER_SUFFIX = '__TPL__END__';

function encodePlaceholder(type, payload) {
  const json = JSON.stringify(payload ?? {});
  const encoded = encodeURIComponent(json);
  return `${PLACEHOLDER_PREFIX}${type}__${encoded}${PLACEHOLDER_SUFFIX}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = globalThis.document?.createElement?.('div');
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createSandbox() {
  const sandbox = {
    window: {},
    console,
    escapeHtml,
    escapeAttribute,
    renderTutorialLesson: (config = {}) => config,
    renderTutorialList: (items = [], ordered = false) => encodePlaceholder('LIST', {items, ordered}),
    renderTutorialTable: (headers = [], rows = []) => encodePlaceholder('TABLE', {headers, rows}),
    renderTutorialCodeBlock: (label = '', code = '', language = 'cpp') => encodePlaceholder('CODE_BLOCK', {label, code, language}),
    renderTutorialInfoGrid: (items = []) => encodePlaceholder('INFO_GRID', {items}),
    renderTutorialConceptChip: (conceptId, label = '') => encodePlaceholder('CONCEPT_CHIP', {conceptId, label}),
    renderProjectReferenceChip: (name, options = {}) => encodePlaceholder('PROJECT_REF', {name, options}),
    renderTutorialConceptGlossary: (ids = []) => encodePlaceholder('CONCEPT_GLOSSARY', {ids}),
    renderTutorialVisualShot: (config = {}) => encodePlaceholder('VISUAL_SHOT', config),
    renderGlfwVulkanInstallGallery: () => encodePlaceholder('GLFW_GALLERY', {}),
    renderTutorialYoutubeEmbed: (config = {}) => encodePlaceholder('YOUTUBE_EMBED', config),
    renderPipelineStagesDiagram: () => encodePlaceholder('PIPELINE_DIAGRAM', {})
  };

  return sandbox;
}

function main() {
  const sandbox = createSandbox();
  const context = vm.createContext(sandbox);
  const tutorialsPath = path.join(process.cwd(), 'data/ui/tutorials.js');
  const source = fs.readFileSync(tutorialsPath, 'utf8');
  vm.runInContext(source, context, {filename: 'data/ui/tutorials.js'});

  const payload = sandbox.window.__ARABIC_VULKAN_TUTORIALS__;
  if (!payload) {
    throw new Error('لم يتم العثور على window.__ARABIC_VULKAN_TUTORIALS__ بعد تنفيذ السكربت.');
  }

  const outputDir = path.join(process.cwd(), 'data/ui/tutorials');
  fs.mkdirSync(outputDir, {recursive: true});
  const outputPath = path.join(outputDir, 'index.json');
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Generated ${outputPath}`);
}

main();
