#!/usr/bin/env node
/**
 * سكربت لجلب جميع الدوال والعناصر من cplusplus.com/reference/
 * ينتج ملف JSON يحتوي كل مكتبة وعناصرها
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// المكتبات الفعلية (بدون صفحات التجميع)
const LIBRARIES = [
  // C library
  'cassert', 'cctype', 'cerrno', 'cfenv', 'cfloat', 'cinttypes', 'ciso646',
  'climits', 'clocale', 'cmath', 'csetjmp', 'csignal', 'cstdarg', 'cstdbool',
  'cstddef', 'cstdint', 'cstdio', 'cstdlib', 'cstring', 'ctgmath', 'ctime',
  'cuchar', 'cwchar', 'cwctype',
  // Containers
  'array', 'deque', 'forward_list', 'list', 'map', 'queue', 'set', 'stack',
  'unordered_map', 'unordered_set', 'vector', 'bitset',
  // Input/Output
  'fstream', 'iomanip', 'ios', 'iosfwd', 'iostream', 'istream', 'ostream',
  'sstream', 'streambuf',
  // Multi-threading
  'atomic', 'condition_variable', 'future', 'mutex', 'thread',
  // Other
  'algorithm', 'chrono', 'codecvt', 'complex', 'exception',
  'functional', 'initializer_list', 'iterator', 'limits', 'locale', 'memory',
  'new', 'numeric', 'random', 'ratio', 'regex', 'stdexcept', 'string',
  'system_error', 'tuple', 'type_traits', 'typeindex', 'typeinfo', 'utility',
  'valarray'
];

// حاويات لها صفحة صنف متداخلة (lib/class/)
const CONTAINER_CLASSES = {
  'array': 'array', 'deque': 'deque', 'forward_list': 'forward_list',
  'list': 'list', 'map': 'map', 'multimap': 'map',
  'set': 'set', 'multiset': 'set', 'stack': 'stack',
  'queue': 'queue', 'priority_queue': 'queue',
  'unordered_map': 'unordered_map', 'unordered_multimap': 'unordered_map',
  'unordered_set': 'unordered_set', 'unordered_multiset': 'unordered_set',
  'vector': 'vector', 'bitset': 'bitset',
  'string': 'basic_string', 'wstring': 'basic_string',
};

// ترويسات ماكرو فقط (عناصرها في جداول وليس روابط)
const MACRO_ONLY_HEADERS = ['cfloat', 'climits', 'cstdbool', 'cstdint', 'ciso646', 'ctgmath'];

const DELAY_MS = 350;

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractItems(html, lib) {
  const items = [];
  const regex = new RegExp(`<a\\s+href="/reference/${lib}/([^/]+)/"\\s+title="([^"]+)"`, 'g');
  let match;
  while ((match = regex.exec(html)) !== null) {
    const name = match[1];
    const title = match[2];
    if (name === lib) continue;
    items.push({ name, title });
  }
  return items;
}

function extractNestedMembers(html, lib, className) {
  const items = [];
  // نمط: <a href="/reference/LIB/CLASS/MEMBER/" title="CLASS::MEMBER">
  const prefix = `${lib}/${className}/`;
  const regex = new RegExp(`<a\\s+href="/reference/${prefix}([^/]+)/"\\s+title="([^"]+)"`, 'g');
  let match;
  while ((match = regex.exec(html)) !== null) {
    const memberName = match[1];
    const fullTitle = match[2];
    // تخطي المُنشئ (نفس اسم الصنف)
    if (memberName === className) continue;
    items.push({ name: `${className}::${memberName}`, title: fullTitle });
  }
  return items;
}

function extractMacrosFromTable(html) {
  const items = [];
  // نمط: <samp>MACRO_NAME</samp>
  const regex = /<samp>([^<]+)<\/samp>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const name = match[1].trim();
    if (name.length > 0 && name.length < 60) {
      items.push({ name, title: name });
    }
  }
  return items;
}

function classifyItem(name, title) {
  const lower = name.toLowerCase();
  
  const macros = ['assert', 'errno', 'EXIT_SUCCESS', 'EXIT_FAILURE', 'RAND_MAX',
    'MB_CUR_MAX', 'NULL', 'offsetof', 'SIG_DFL', 'SIG_ERR', 'SIG_IGN',
    'SIGABRT', 'SIGFPE', 'SIGILL', 'SIGINT', 'SIGSEGV', 'SIGTERM',
    'HUGE_VAL', 'HUGE_VALF', 'HUGE_VALL', 'INFINITY', 'NAN', 'FP_INFINITE',
    'FP_NAN', 'FP_NORMAL', 'FP_SUBNORMAL', 'FP_ZERO', 'FP_FAST_FMA',
    'FP_FAST_FMAF', 'FP_FAST_FMAL', 'FP_ILOGB0', 'FP_ILOGBNAN',
    'MATH_ERRNO', 'MATH_ERREXCEPT', 'math_errhandling',
    'FE_DIVBYZERO', 'FE_INEXACT', 'FE_INVALID', 'FE_OVERFLOW', 'FE_UNDERFLOW',
    'FE_ALL_EXCEPT', 'FE_DOWNWARD', 'FE_TONEAREST', 'FE_TOWARDZERO', 'FE_UPWARD',
    'FE_DFL_ENV', 'FE_CLEANUP_ENV', 'FE_NOMASK_ENV',
    'CHAR_BIT', 'CHAR_MIN', 'CHAR_MAX', 'SCHAR_MIN', 'SCHAR_MAX', 'UCHAR_MAX',
    'SHRT_MIN', 'SHRT_MAX', 'USHRT_MAX', 'INT_MIN', 'INT_MAX', 'UINT_MAX',
    'LONG_MIN', 'LONG_MAX', 'ULONG_MAX', 'LLONG_MIN', 'LLONG_MAX', 'ULLONG_MAX',
    'FLT_RADIX', 'FLT_MANT_DIG', 'DBL_MANT_DIG', 'LDBL_MANT_DIG',
    'FLT_DIG', 'DBL_DIG', 'LDBL_DIG',
    'FLT_MIN_EXP', 'DBL_MIN_EXP', 'LDBL_MIN_EXP',
    'FLT_MIN', 'DBL_MIN', 'LDBL_MIN',
    'FLT_MAX_EXP', 'DBL_MAX_EXP', 'LDBL_MAX_EXP',
    'FLT_MAX', 'DBL_MAX', 'LDBL_MAX',
    'FLT_EPSILON', 'DBL_EPSILON', 'LDBL_EPSILON',
    'FLT_ROUNDS', 'FLT_HAS_SUBNORM', 'DBL_HAS_SUBNORM', 'LDBL_HAS_SUBNORM',
    'FLT_TRUE_MIN', 'DBL_TRUE_MIN', 'LDBL_TRUE_MIN',
    'CLOCKS_PER_SEC',
    'ATOMIC_BOOL_LOCK_FREE', 'ATOMIC_CHAR_LOCK_FREE', 'ATOMIC_INT_LOCK_FREE',
    'ATOMIC_LONG_LOCK_FREE', 'ATOMIC_LLONG_LOCK_FREE', 'ATOMIC_POINTER_LOCK_FREE',
    'ATOMIC_FLAG_INIT', 'memory_order_relaxed', 'memory_order_consume',
    'memory_order_acquire', 'memory_order_release', 'memory_order_acq_rel',
    'memory_order_seq_cst',
    'SIZE_MAX', 'PTRDIFF_MAX', 'PTRDIFF_MIN', 'INTPTR_MAX', 'INTPTR_MIN',
    'UINTPTR_MAX', 'INTMAX_MAX', 'INTMAX_MIN', 'UINTMAX_MAX', 'INT8_MAX',
    'INT8_MIN', 'INT16_MAX', 'INT16_MIN', 'INT32_MAX', 'INT32_MIN',
    'INT64_MAX', 'INT64_MIN', 'UINT8_MAX', 'UINT16_MAX', 'UINT32_MAX',
    'UINT64_MAX', 'INT_FAST8_MAX', 'INT_FAST8_MIN', 'INT_FAST16_MAX',
    'INT_FAST16_MIN', 'INT_FAST32_MAX', 'INT_FAST32_MIN', 'INT_FAST64_MAX',
    'INT_FAST64_MIN', 'UINT_FAST8_MAX', 'UINT_FAST16_MAX', 'UINT_FAST32_MAX',
    'UINT_FAST64_MAX', 'INT_LEAST8_MAX', 'INT_LEAST8_MIN', 'INT_LEAST16_MAX',
    'INT_LEAST16_MIN', 'INT_LEAST32_MAX', 'INT_LEAST32_MIN', 'INT_LEAST64_MAX',
    'INT_LEAST64_MIN', 'UINT_LEAST8_MAX', 'UINT_LEAST16_MAX', 'UINT_LEAST32_MAX',
    'UINT_LEAST64_MAX',
    'setjmp', 'longjmp',
    'va_start', 'va_end', 'va_arg', 'va_copy',
    'true', 'false', 'bool_true_false_are_defined'
  ];

  const types = ['size_t', 'ptrdiff_t', 'nullptr_t', 'max_align_t', 'wint_t',
    'wctrans_t', 'wctype_t', 'mbstate_t', 'FILE', 'fpos_t', 'tm', 'time_t',
    'clock_t', 'div_t', 'ldiv_t', 'lldiv_t', 'jmp_buf', 'sig_atomic_t',
    'va_list', 'fenv_t', 'fexcept_t', 'int8_t', 'int16_t', 'int32_t', 'int64_t',
    'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t', 'int_fast8_t', 'int_fast16_t',
    'int_fast32_t', 'int_fast64_t', 'uint_fast8_t', 'uint_fast16_t', 'uint_fast32_t',
    'uint_fast64_t', 'int_least8_t', 'int_least16_t', 'int_least32_t', 'int_least64_t',
    'uint_least8_t', 'uint_least16_t', 'uint_least32_t', 'uint_least64_t',
    'intmax_t', 'uintmax_t', 'intptr_t', 'uintptr_t', 'char16_t', 'char32_t',
    'Im', 'Re', 'C', 'bitset', 'string', 'wstring', 'u16string', 'u32string',
    'array', 'deque', 'forward_list', 'list', 'vector', 'map', 'multimap',
    'set', 'multiset', 'unordered_map', 'unordered_multimap', 'unordered_set',
    'unordered_multiset', 'stack', 'queue', 'priority_queue', 'pair', 'tuple',
    'complex', 'valarray', 'slice', 'gslice', 'mask_array', 'indirect_array',
    'mutex', 'recursive_mutex', 'timed_mutex', 'recursive_timed_mutex',
    'shared_mutex', 'shared_timed_mutex', 'thread', 'promise', 'future',
    'shared_future', 'packaged_task', 'condition_variable', 'condition_variable_any',
    'atomic', 'streambuf', 'istream', 'ostream', 'iostream', 'ifstream',
    'ofstream', 'fstream', 'istringstream', 'ostringstream', 'stringstream',
    'stringbuf', 'regex', 'smatch', 'cmatch', 'wsmatch', 'wcmatch',
    'wregex', 'error_code', 'error_condition', 'error_category', 'system_error',
    'exception', 'runtime_error', 'logic_error', 'bad_alloc', 'bad_cast',
    'bad_typeid', 'bad_exception', 'ios_base', 'basic_ios', 'basic_istream',
    'basic_ostream', 'basic_stringbuf', 'basic_istringstream', 'basic_ostringstream',
    'basic_stringstream', 'basic_ifstream', 'basic_ofstream', 'basic_fstream',
    'basic_filebuf', 'istreambuf_iterator', 'ostreambuf_iterator',
    'iterator', 'reverse_iterator', 'back_insert_iterator', 'front_insert_iterator',
    'insert_iterator', 'move_iterator', 'input_iterator_tag', 'output_iterator_tag',
    'forward_iterator_tag', 'bidirectional_iterator_tag', 'random_access_iterator_tag',
    'numeric_limits', 'ctype', 'ctype_base', 'codecvt', 'collate', 'messages',
    'money_get', 'money_put', 'num_get', 'num_put', 'numpunct', 'time_get',
    'time_put', 'locale', 'facet', 'type_info', 'type_index', 'bad_weak_ptr',
    'unique_ptr', 'shared_ptr', 'weak_ptr', 'owner_less', 'default_delete',
    'allocator', 'raw_storage_iterator', 'temporary_buffer', 'unary_function',
    'binary_function', 'plus', 'minus', 'multiplies', 'divides', 'modulus',
    'negate', 'equal_to', 'not_equal_to', 'greater', 'less', 'greater_equal',
    'less_equal', 'logical_and', 'logical_or', 'logical_not', 'bit_and',
    'bit_or', 'bit_xor', 'not1', 'not2', 'bind1st', 'bind2nd', 'ptr_fun',
    'mem_fun', 'mem_fun_ref', 'binder1st', 'binder2nd', 'pointer_to_unary_function',
    'pointer_to_binary_function', 'const_mem_fun_t', 'const_mem_fun1_t',
    'mem_fun_t', 'mem_fun1_t', 'const_mem_fun_ref_t', 'const_mem_fun1_ref_t',
    'mem_fun_ref_t', 'mem_fun1_ref_t', 'hash', 'linear_congruential_engine',
    'mersenne_twister_engine', 'subtract_with_carry_engine', 'discard_block_engine',
    'independent_bits_engine', 'shuffle_order_engine', 'random_device',
    'seed_seq', 'uniform_int_distribution', 'uniform_real_distribution',
    'bernoulli_distribution', 'binomial_distribution', 'negative_binomial_distribution',
    'geometric_distribution', 'poisson_distribution', 'exponential_distribution',
    'gamma_distribution', 'weibull_distribution', 'extreme_value_distribution',
    'normal_distribution', 'lognormal_distribution', 'chi_squared_distribution',
    'cauchy_distribution', 'fisher_f_distribution', 'student_t_distribution',
    'discrete_distribution', 'piecewise_constant_distribution',
    'piecewise_linear_distribution', 'ratio', 'nano', 'micro', 'milli',
    'centi', 'deci', 'deca', 'hecto', 'kilo', 'mega', 'giga', 'tera',
    'pico', 'femto', 'atto', 'yocto', 'zepto',
    'duration', 'time_point', 'steady_clock', 'system_clock', 'high_resolution_clock',
    'treat_as_floating_point', 'duration_values', 'common_type',
    'initializer_list',
    'sub_match', 'match_results', 'regex_iterator', 'regex_token_iterator',
    'basic_regex', 'regex_traits', 'char_traits',
    'memory_resource', 'polymorphic_allocator', 'synchronized_pool_resource',
    'unsynchronized_pool_resource', 'pool_options'
  ];

  if (macros.includes(name) || macros.includes(lower)) return 'ماكرو';
  if (types.includes(name)) return 'نوع';
  if (title.startsWith('class ')) return 'صنف';
  if (title.startsWith('template ') || title.startsWith('class template ')) return 'قالب صنف';
  if (title.startsWith('function template ')) return 'قالب دالة';
  
  if (name.startsWith('is_') || name.startsWith('has_') || 
      name.startsWith('can_') || name.startsWith('is_nothrow_') ||
      name.startsWith('is_trivially_') || name.startsWith('is_standard_') ||
      name.startsWith('is_polymorphic_') || name.startsWith('is_abstract_') ||
      name.startsWith('is_final_') || name.startsWith('is_constructible') ||
      name.startsWith('is_convertible') || name.startsWith('is_same') ||
      name.startsWith('is_base_of') || name.startsWith('is_invocable') ||
      name.startsWith('alignment_of') || name.startsWith('rank') ||
      name.startsWith('extent') || name.startsWith('remove_') ||
      name.startsWith('add_') || name.startsWith('make_') ||
      name.startsWith('underlying_type') || name.startsWith('decay') ||
      name.startsWith('enable_if') || name.startsWith('conditional') ||
      name.startsWith('common_type') || name.startsWith('invoke_result') ||
      name === 'void_t' || name === 'nat' || name === 'integral_constant' ||
      name === 'bool_constant') return 'trait';
  
  if (name.includes('::')) return 'عضو';
  if (name.startsWith('operator')) return 'عامل تشغيل';
  if (name.startsWith('~')) return 'مُدمّر';
  
  return 'دالة';
}

async function fetchLibrary(lib) {
  try {
    const url = `https://cplusplus.com/reference/${lib}/`;
    const html = await fetch(url);
    let items = extractItems(html, lib);
    
    // 1) ترويسات ماكرو فقط: استخراج من جداول
    if (MACRO_ONLY_HEADERS.includes(lib) && items.length === 0) {
      const macros = extractMacrosFromTable(html);
      return macros.map(m => ({
        name: m.name, title: m.title, type: 'ماكرو',
        url: `https://cplusplus.com/reference/${lib}/`, header: `<${lib}>`
      }));
    }
    
    // 2) حاويات: دائمًا اجلب صفحة الصنف المتداخلة لإكمال الأعضاء
    if (CONTAINER_CLASSES[lib]) {
      const className = CONTAINER_CLASSES[lib];
      const classUrl = `https://cplusplus.com/reference/${lib}/${className}/`;
      const classHtml = await fetch(classUrl);
      const members = extractNestedMembers(classHtml, lib, className);
      
      // بناء قائمة الأعضاء مع الصنف
      const containerItems = [{
        name: className, title: className, type: 'قالب صنف',
        url: classUrl, header: `<${lib}>`
      }];
      for (const m of members) {
        containerItems.push({
          name: m.name, title: m.title,
          type: classifyItem(m.name, m.title),
          url: `https://cplusplus.com/reference/${lib}/${className}/${m.name.split('::')[1]}/`,
          header: `<${lib}>`
        });
      }
      
      // إذا وُجدت عناصر من المستوى الأعلى (مثل multimap في صفحة map)، أضفها
      if (items.length > 0) {
        for (const item of items) {
          // تخطي إذا كان هو الصنف نفسه
          if (item.name === className) continue;
          // تخطي إذا كان موجودًا بالفعل كعضو
          if (containerItems.some(ci => ci.name === item.name)) continue;
          containerItems.push({
            name: item.name, title: item.title,
            type: classifyItem(item.name, item.title),
            url: `https://cplusplus.com/reference/${lib}/${item.name}/`,
            header: `<${lib}>`
          });
        }
      }
      
      return containerItems;
    }
    
    // 3) صفحات تحتوي صنف رئيسي واحد بنفس اسم المكتبة (مثل thread/thread/)
    if (items.length === 0) {
      const altRegex = new RegExp(`<a\\s+href="/reference/${lib}/${lib}/([^/]+)/"`, 'g');
      let altMatch;
      const altItems = [];
      while ((altMatch = altRegex.exec(html)) !== null) {
        const memberName = altMatch[1];
        if (memberName !== lib) {
          altItems.push({ name: `${lib}::${memberName}`, title: `${lib}::${memberName}` });
        }
      }
      if (altItems.length > 0) {
        const result = [{
          name: lib, title: lib, type: 'صنف',
          url: `https://cplusplus.com/reference/${lib}/${lib}/`, header: `<${lib}>`
        }];
        for (const m of altItems) {
          result.push({
            name: m.name, title: m.title,
            type: classifyItem(m.name, m.title),
            url: `https://cplusplus.com/reference/${lib}/${lib}/${m.name.split('::')[1]}/`,
            header: `<${lib}>`
          });
        }
        return result;
      }
    }
    
    return items.map(item => ({
      name: item.name, title: item.title,
      type: classifyItem(item.name, item.title),
      url: `https://cplusplus.com/reference/${lib}/${item.name}/`,
      header: `<${lib}>`
    }));
  } catch (err) {
    console.error(`  ✗ خطأ في ${lib}: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log(`جلب ${LIBRARIES.length} مكتبة من cplusplus.com/reference/...\n`);
  
  const result = {};
  let totalItems = 0;
  
  for (let i = 0; i < LIBRARIES.length; i++) {
    const lib = LIBRARIES[i];
    process.stdout.write(`[${i + 1}/${LIBRARIES.length}] ${lib}...`);
    
    const items = await fetchLibrary(lib);
    result[lib] = items;
    totalItems += items.length;
    
    console.log(` ${items.length} عنصر`);
    
    if (i < LIBRARIES.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
  
  const outputPath = path.join(__dirname, '..', 'data', 'ui', 'cpp', 'reference-cplusplus-all-functions.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  
  console.log(`\n✓ تم جلب ${totalItems} عنصر من ${LIBRARIES.length} مكتبة`);
  console.log(`✓ الملف: ${outputPath}`);
  
  // ملخص
  console.log('\n--- ملخص ---');
  const sorted = Object.entries(result)
    .sort((a, b) => b[1].length - a[1].length);
  for (const [lib, items] of sorted) {
    if (items.length > 0) {
      const functions = items.filter(i => i.type === 'دالة' || i.type === 'قالب دالة' || i.type === 'عضو').length;
      const types = items.filter(i => i.type === 'نوع' || i.type === 'صنف' || i.type === 'قالب صنف').length;
      const macros = items.filter(i => i.type === 'ماكرو').length;
      const traits = items.filter(i => i.type === 'trait').length;
      console.log(`  ${lib}: ${items.length} (دوال/أعضاء:${functions} أنواع:${types} ماكرو:${macros} traits:${traits})`);
    }
  }
}

main().catch(err => {
  console.error('خطأ عام:', err);
  process.exit(1);
});