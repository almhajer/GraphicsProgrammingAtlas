window.__ARABIC_VULKAN_VULKAN_PATTERNS__ = (() => {
  const VULKAN_VENDOR_SUFFIX_SOURCE = 'KHR|EXT|AMD|NVX|NV|INTEL|ARM|QCOM|HUAWEI|FUCHSIA|ANDROID|GOOGLE|VALVE|LUNARG|SEC|NN|IMG|GGP|QNX|OHOS|AMDX|MSFT|MESA|MVK|APPLE';
  const VULKAN_IDENTIFIER_SOURCE = `vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|${VULKAN_VENDOR_SUFFIX_SOURCE}`;
  const VULKAN_IDENTIFIER_NOISE_REGEX = new RegExp(`\\b(?:${VULKAN_IDENTIFIER_SOURCE})\\b`, 'g');
  const VULKAN_IDENTIFIER_NOISE_WITH_DRM_REGEX = new RegExp(`\\b(?:${VULKAN_IDENTIFIER_SOURCE}|DRM)\\b`, 'g');
  const VULKAN_FUNCTION_TOKEN_REGEX = /\bvk[A-Za-z0-9_]+\b/g;
  const VULKAN_TYPE_TOKEN_REGEX = /\bVk[A-Za-z0-9_]+\b/g;
  const VULKAN_CONSTANT_TOKEN_REGEX = /\bVK_[A-Z0-9_]+\b/g;
  const VULKAN_CODE_TOKEN_REGEX = /\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|std::[A-Za-z_][A-Za-z0-9_:]*|nullptr)\b/g;
  const VULKAN_REFERENCE_TOKEN_REGEX = /\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|std::[A-Za-z_][A-Za-z0-9_:]*)\b/g;
  const VULKAN_ALLOWED_NARRATIVE_TOKENS_REGEX = /`[^`]+`|https?:\/\/\S+|\b(?:vk[A-Za-z0-9_]+|Vk[A-Za-z0-9_]+|VK_[A-Z0-9_]+|ImGui::[A-Za-z0-9_]+|pp?[A-Z][A-Za-z0-9_]*|[a-z]+(?:[A-Z][A-Za-z0-9_]*)+|nullptr|NULL|Vulkan|SPIR-V|GLSL|SDL3|GPU|CPU|glslangValidator|glslc|DRM|Xlib|X11|Wayland|Win32|Metal|Android|FUCHSIA|MSFT|MESA|MVK|APPLE)\b|[A-Za-z0-9_./-]+\.(?:vert|frag|comp|geom|tesc|tese|mesh|task|spv|cpp|cxx|cc|c|h|hpp|json|webp|png|jpg|jpeg|toml|md|txt)|0x[0-9A-Fa-f]+/g;
  const VULKAN_VENDOR_SUFFIX_REGEX = new RegExp(`^(?:${VULKAN_VENDOR_SUFFIX_SOURCE})$`);
  const NULLPTR_TOKEN_REGEX = /\bnullptr\b/;

  function collectRegexMatches(text = '', regex) {
    regex.lastIndex = 0;
    return String(text || '').match(regex) || [];
  }

  function uniqueTokens(tokens = []) {
    const seen = new Set();
    const unique = [];

    tokens.forEach((token) => {
      const value = String(token || '').trim();
      if (!value || seen.has(value)) {
        return;
      }

      seen.add(value);
      unique.push(value);
    });

    return unique;
  }

  function extractVulkanCodeTokens(text = '') {
    return collectRegexMatches(text, VULKAN_CODE_TOKEN_REGEX);
  }

  function extractUniqueVulkanCodeTokens(text = '') {
    return uniqueTokens(extractVulkanCodeTokens(text));
  }

  function extractVulkanReferenceTokens(text = '') {
    return collectRegexMatches(text, VULKAN_REFERENCE_TOKEN_REGEX);
  }

  function extractUniqueVulkanReferenceTokens(text = '') {
    return uniqueTokens(extractVulkanReferenceTokens(text));
  }

  function findVulkanFunctionTokens(text = '') {
    return collectRegexMatches(text, VULKAN_FUNCTION_TOKEN_REGEX);
  }

  function findUniqueVulkanFunctionTokens(text = '') {
    return uniqueTokens(findVulkanFunctionTokens(text));
  }

  function findVulkanTypeTokens(text = '') {
    return collectRegexMatches(text, VULKAN_TYPE_TOKEN_REGEX);
  }

  function findUniqueVulkanTypeTokens(text = '') {
    return uniqueTokens(findVulkanTypeTokens(text));
  }

  function findVulkanConstantTokens(text = '') {
    return collectRegexMatches(text, VULKAN_CONSTANT_TOKEN_REGEX);
  }

  function findUniqueVulkanConstantTokens(text = '') {
    return uniqueTokens(findVulkanConstantTokens(text));
  }

  function containsCppNullptrToken(text = '') {
    return NULLPTR_TOKEN_REGEX.test(String(text || ''));
  }

  function maskAllowedVulkanNarrativeTokens(text = '') {
    const tokens = [];
    const masked = String(text || '').replace(VULKAN_ALLOWED_NARRATIVE_TOKENS_REGEX, (match) => {
      const marker = `@@${tokens.length}@@`;
      tokens.push(match);
      return marker;
    });

    return {masked, tokens};
  }

  function unmaskAllowedVulkanNarrativeTokens(text = '', tokens = []) {
    return String(text || '').replace(/@@(\d+)@@/g, (_, index) => tokens[Number(index)] || '');
  }

  function stripVulkanTechnicalIdentifiers(text = '', options = {}) {
    const regex = options.includeDrm ? VULKAN_IDENTIFIER_NOISE_WITH_DRM_REGEX : VULKAN_IDENTIFIER_NOISE_REGEX;
    return String(text || '').replace(regex, '');
  }

  function getEnumVendorTokenPattern() {
    return VULKAN_VENDOR_SUFFIX_REGEX;
  }

  return Object.freeze({
    containsCppNullptrToken,
    extractUniqueVulkanCodeTokens,
    extractUniqueVulkanReferenceTokens,
    extractVulkanCodeTokens,
    extractVulkanReferenceTokens,
    findUniqueVulkanConstantTokens,
    findUniqueVulkanFunctionTokens,
    findUniqueVulkanTypeTokens,
    findVulkanConstantTokens,
    findVulkanFunctionTokens,
    findVulkanTypeTokens,
    getEnumVendorTokenPattern,
    maskAllowedVulkanNarrativeTokens,
    stripVulkanTechnicalIdentifiers,
    uniqueTokens,
    unmaskAllowedVulkanNarrativeTokens
  });
})();
