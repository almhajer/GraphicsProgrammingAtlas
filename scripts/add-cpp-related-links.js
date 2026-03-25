const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'ui', 'cpp', 'reference-keywords.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const relatedMap = {
  "auto": ["const", "std::vector", "size_t"],
  "const": ["auto", "void", "nullptr"],
  "struct": ["class", "public", "private", "constexpr"],
  "if": ["else", "bool", "true", "false", "return"],
  "else": ["if", "bool", "return"],
  "for": ["while", "break", "continue", "int"],
  "switch": ["case", "default", "break", "enum"],
  "case": ["switch", "default", "break"],
  "default": ["switch", "case", "break"],
  "while": ["do", "for", "break", "bool"],
  "break": ["continue", "for", "while", "switch"],
  "continue": ["break", "for", "while"],
  "try": ["catch", "throw", "std::exception", "std::runtime_error"],
  "catch": ["try", "throw", "std::exception"],
  "return": ["void", "auto", "if"],
  "enum": ["switch", "case", "default", "int"],
  "void": ["return", "nullptr", "const"],
  "throw": ["try", "catch", "std::exception", "std::runtime_error"],
  "namespace": ["using", "class", "struct"],
  "using": ["namespace", "typedef", "typename"],
  "typedef": ["using", "auto", "typename"],
  "typename": ["template", "using", "auto", "concept"],
  "template": ["typename", "concept", "requires", "auto"],
  "static": ["extern", "inline", "constexpr", "class"],
  "inline": ["static", "constexpr", "const"],
  "do": ["while", "break", "continue"],
  "extern": ["static", "namespace"],
  "new": ["delete", "std::unique_ptr", "std::make_unique", "nullptr"],
  "this": ["class", "const", "nullptr"],
  "friend": ["class", "private", "protected"],
  "virtual": ["override", "final", "class", "public"],
  "override": ["virtual", "final", "class"],
  "final": ["virtual", "override", "class"],
  "mutable": ["const", "class"],
  "noexcept": ["throw", "try", "catch", "constexpr"],
  "union": ["struct", "std::variant"],
  "delete": ["new", "std::unique_ptr", "nullptr"],
  "operator": ["class", "return", "const"],
  "goto": ["break", "continue"],
  "sizeof": ["size_t", "alignof", "alignas"],
  "alignas": ["alignof", "sizeof"],
  "alignof": ["alignas", "sizeof", "size_t"],
  "decltype": ["auto", "typename"],
  "consteval": ["constexpr", "const", "auto"],
  "constinit": ["constexpr", "const", "static"],
  "requires": ["concept", "template", "typename"],
  "concept": ["requires", "template", "typename", "auto"],
  "public": ["private", "protected", "class"],
  "private": ["public", "protected", "class"],
  "protected": ["public", "private", "class"],
  "explicit": ["class", "static_cast"],
  "export": ["module", "import"],
  "thread_local": ["static", "std::thread", "std::atomic"],
  "volatile": ["std::atomic", "const", "thread_local"],
  "nullptr": ["void", "const", "std::unique_ptr"],
  "class": ["struct", "public", "private", "protected", "virtual", "this"],
  "bool": ["true", "false", "if"],
  "int": ["uint32_t", "int32_t", "auto", "size_t"],
  "true": ["bool", "false", "if"],
  "false": ["bool", "true", "if"],
  "static_cast": ["dynamic_cast", "const_cast", "reinterpret_cast", "auto"],
  "dynamic_cast": ["virtual", "override", "static_cast", "nullptr"],
  "const_cast": ["const", "static_cast", "reinterpret_cast"],
  "reinterpret_cast": ["static_cast", "const_cast", "volatile"],
  "import": ["module", "export"],
  "module": ["export", "import", "namespace"],
  "char": ["std::string", "int8_t", "uint8_t"],
  "float": ["double", "int", "std::numeric_limits"],
  "double": ["float", "int", "std::numeric_limits"],
  "unsigned": ["int", "uint32_t", "size_t"],
  "long": ["int", "int64_t", "uint64_t"],
  "short": ["int", "int16_t", "uint16_t"],
  "signed": ["unsigned", "int", "int8_t"],
  "register": ["auto", "const"],
  "asm": ["volatile", "extern"],
  "size_t": ["uint32_t", "int", "sizeof"],
  "uint32_t": ["int32_t", "size_t", "int"],
  "uint64_t": ["int64_t", "uint32_t", "size_t"],
  "int32_t": ["uint32_t", "int", "static_cast"],
  "int64_t": ["uint64_t", "int32_t", "long"],
  "std::shared_ptr": ["std::make_shared", "std::unique_ptr"],
  "std::make_unique": ["std::unique_ptr", "new", "auto"],
  "std::make_shared": ["std::shared_ptr", "std::make_unique", "auto"],
  "std::runtime_error": ["std::exception", "throw", "try", "catch"],
  "std::map": ["std::set", "std::pair", "auto"],
  "std::pair": ["std::map", "std::tuple", "auto"],
  "std::function": ["auto", "std::move", "template"],
  "std::atomic": ["std::thread", "std::mutex", "volatile"],
  "std::thread": ["std::mutex", "std::atomic"],
  "std::mutex": ["std::thread", "std::atomic"],
  "constexpr": ["const", "inline", "static_assert", "auto"],
  "static_assert": ["constexpr", "const"],
  "char8_t": ["char", "char16_t", "std::string"],
  "char16_t": ["char32_t", "char8_t", "wchar_t"],
  "char32_t": ["char16_t", "wchar_t"],
  "co_await": ["co_return", "co_yield"],
  "co_return": ["co_await", "co_yield", "return"],
  "co_yield": ["co_await", "co_return"],
  "std::unique_ptr": ["std::make_unique", "new", "delete", "std::shared_ptr"],
  "std::string": ["std::string_view", "char", "std::stringstream"],
  "std::vector": ["std::array", "std::span", "size_t", "auto"],
  "std::array": ["std::vector", "std::span", "size_t", "auto"],
  "std::optional": ["std::variant", "std::any", "nullptr"],
  "std::variant": ["std::optional", "std::any", "union"],
  "std::move": ["std::forward", "std::unique_ptr", "auto"],
  "std::forward": ["std::move", "template", "typename"],
  "std::string_view": ["std::string", "const", "std::span"],
  "std::span": ["std::vector", "std::array", "std::string_view", "size_t"],
  "std::set": ["std::map", "std::vector", "auto"],
  "std::sort": ["std::vector", "std::array", "auto"],
  "std::numeric_limits": ["float", "double", "int", "size_t"],
  "std::memcpy": ["size_t", "void", "const"],
  "std::cout": ["std::cerr", "std::endl", "std::string"],
  "std::cerr": ["std::cout", "std::endl"],
  "std::endl": ["std::cout", "std::cerr"],
  "std::exception": ["std::runtime_error", "try", "catch", "throw"],
  "std::ifstream": ["std::string", "std::stringstream", "char"],
  "std::stringstream": ["std::string", "std::ifstream", "std::cout"],
  "int8_t": ["uint8_t", "char", "int"],
  "uint8_t": ["int8_t", "char", "size_t"],
  "int16_t": ["uint16_t", "short", "int"],
  "uint16_t": ["int16_t", "short", "unsigned"],
  "wchar_t": ["char", "char16_t", "char32_t"],
  "std::tuple": ["std::pair", "std::variant", "auto"],
  "std::any": ["std::variant", "std::optional"],
  "std::bitset": ["uint32_t", "std::atomic"],
  "std::initializer_list": ["std::vector", "std::array", "auto"],
  "ptrdiff_t": ["size_t", "int"]
};

const items = data.referenceData;
let added = 0;
let skipped = 0;

for (const key of Object.keys(items)) {
  if (items[key].related && Array.isArray(items[key].related) && items[key].related.length > 0) {
    skipped++;
    continue;
  }
  const rel = relatedMap[key];
  if (rel) {
    items[key].related = rel;
    added++;
  } else {
    items[key].related = [];
    added++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Added related to ${added} items, skipped ${skipped} (already had related)`);