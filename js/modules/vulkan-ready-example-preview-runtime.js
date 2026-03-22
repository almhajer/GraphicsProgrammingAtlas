window.__ARABIC_VULKAN_VULKAN_READY_EXAMPLE_PREVIEW_RUNTIME__ = (() => {
  function createVulkanReadyExamplePreviewRuntime(api = {}) {
    const {
      escapeAttribute,
      escapeHtml,
      getVulkanExampleDisplayTitle,
      localizeVulkanPreviewLabels,
      localizeVulkanUiText
    } = api;

function renderVulkanReadyExampleFallbackPreview(example) {
  const title = localizeVulkanUiText(String(example.previewTitle || `معاينة ${getVulkanExampleDisplayTitle(example)}`).trim());
  const svgMarkup = localizeVulkanPreviewLabels(`
    <rect x="24" y="26" width="312" height="168" rx="22" fill="#101821"/>
    <rect x="24" y="26" width="312" height="28" rx="22" fill="#23374d"/>
    <rect x="48" y="72" width="112" height="92" rx="18" fill="#162736"/>
    <rect x="180" y="72" width="132" height="92" rx="18" fill="#20384f"/>
    <rect x="62" y="94" width="74" height="12" rx="6" fill="#dbe8f7"/>
    <rect x="62" y="122" width="58" height="12" rx="6" fill="#82c1ff"/>
    <rect x="198" y="96" width="92" height="14" rx="7" fill="#ffcb72"/>
    <rect x="198" y="124" width="74" height="14" rx="7" fill="#7bc6a6"/>
    <path d="M160 118 H180" stroke="#ffc76a" stroke-width="6" stroke-linecap="round"/>
    <text x="180" y="186" text-anchor="middle" font-size="15" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">Vulkan Example</text>
  `);
  return `
    <figure class="vulkan-ready-example-shot">
      <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="360" height="220" rx="24" fill="#0a0f16"/>
        ${svgMarkup}
      </svg>
      <figcaption>${escapeHtml(title)}</figcaption>
    </figure>
  `;
}

function renderVulkanReadyExamplePreview(example) {
  if (!example?.previewKind) {
    return renderVulkanReadyExampleFallbackPreview(example);
  }

  const title = localizeVulkanUiText(String(example.previewTitle || `معاينة ${getVulkanExampleDisplayTitle(example)}`).trim());
  let svgMarkup = '';

  switch (example.previewKind) {
    case 'window':
      svgMarkup = `
        <rect x="16" y="18" width="328" height="184" rx="20" fill="#0f1721"/>
        <rect x="16" y="18" width="328" height="30" rx="20" fill="#17324a"/>
        <circle cx="38" cy="34" r="5" fill="#ffb86a"/>
        <circle cx="56" cy="34" r="5" fill="#75d7ff"/>
        <circle cx="74" cy="34" r="5" fill="#8be7a6"/>
        <rect x="62" y="72" width="236" height="92" rx="18" fill="#132534" stroke="#355473" stroke-width="2"/>
        <rect x="72" y="86" width="216" height="14" rx="7" fill="#40617f"/>
        <rect x="72" y="110" width="164" height="12" rx="6" fill="#51799f"/>
        <rect x="72" y="136" width="114" height="12" rx="6" fill="#6ca0d1"/>
      `;
      break;
    case 'instance':
      svgMarkup = `
        <rect x="24" y="30" width="312" height="164" rx="22" fill="#101922"/>
        <rect x="42" y="54" width="78" height="116" rx="16" fill="#1b3044"/>
        <rect x="140" y="42" width="88" height="140" rx="20" fill="#294a6c"/>
        <rect x="248" y="54" width="70" height="116" rx="16" fill="#182d40"/>
        <rect x="56" y="80" width="50" height="10" rx="5" fill="#dce8f7"/>
        <rect x="56" y="104" width="36" height="10" rx="5" fill="#7bc2ff"/>
        <rect x="154" y="74" width="60" height="12" rx="6" fill="#eef6ff"/>
        <rect x="154" y="100" width="60" height="12" rx="6" fill="#79c2ff"/>
        <rect x="154" y="126" width="60" height="12" rx="6" fill="#ffd26f"/>
        <rect x="154" y="152" width="48" height="10" rx="5" fill="#80d3a9"/>
        <rect x="262" y="78" width="42" height="10" rx="5" fill="#dce8f7"/>
        <rect x="262" y="102" width="42" height="10" rx="5" fill="#6fb9ff"/>
        <rect x="262" y="126" width="34" height="10" rx="5" fill="#ffd06f"/>
        <path d="M120 112 H140" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M228 112 H248" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <circle cx="184" cy="34" r="8" fill="#7dc2ff"/>
      `;
      break;
    case 'gpu':
      svgMarkup = `
        <rect x="28" y="34" width="304" height="156" rx="22" fill="#101922"/>
        <rect x="42" y="58" width="82" height="108" rx="16" fill="#192937"/>
        <rect x="138" y="48" width="84" height="128" rx="18" fill="#24435f" stroke="#8fd1ff" stroke-width="2"/>
        <rect x="236" y="58" width="82" height="108" rx="16" fill="#192937"/>
        <rect x="54" y="76" width="58" height="10" rx="5" fill="#6a86a0"/>
        <rect x="150" y="70" width="60" height="12" rx="6" fill="#eef6ff"/>
        <rect x="248" y="76" width="58" height="10" rx="5" fill="#6a86a0"/>
        <rect x="54" y="104" width="46" height="36" rx="10" fill="#38546f"/>
        <rect x="150" y="102" width="60" height="40" rx="12" fill="#78c0ff"/>
        <rect x="248" y="104" width="46" height="36" rx="10" fill="#38546f"/>
        <rect x="152" y="150" width="56" height="10" rx="5" fill="#ffd36f"/>
        <circle cx="180" cy="34" r="8" fill="#ffd36f"/>
        <path d="M180 42 V48" stroke="#ffd36f" stroke-width="4" stroke-linecap="round"/>
      `;
      break;
    case 'device':
      svgMarkup = `
        <rect x="30" y="40" width="300" height="150" rx="22" fill="#101821"/>
        <rect x="48" y="66" width="98" height="98" rx="18" fill="#1b3044"/>
        <rect x="214" y="54" width="98" height="122" rx="20" fill="#274d72"/>
        <rect x="64" y="90" width="66" height="12" rx="6" fill="#dce8f7"/>
        <rect x="64" y="116" width="54" height="10" rx="5" fill="#7abfff"/>
        <rect x="228" y="82" width="68" height="12" rx="6" fill="#eef6ff"/>
        <rect x="228" y="108" width="52" height="10" rx="5" fill="#7abfff"/>
        <rect x="228" y="132" width="24" height="24" rx="12" fill="#7abfff"/>
        <rect x="258" y="132" width="24" height="24" rx="12" fill="#84dbaa"/>
        <path d="M146 115 H214" stroke="#ffc267" stroke-width="5" stroke-linecap="round"/>
        <circle cx="180" cy="115" r="9" fill="#ffd36f"/>
      `;
      break;
    case 'buffer':
      svgMarkup = `
        <rect x="26" y="38" width="308" height="148" rx="22" fill="#12212e"/>
        <rect x="44" y="70" width="84" height="84" rx="16" fill="#1e3348"/>
        <rect x="152" y="84" width="74" height="56" rx="14" fill="#284766"/>
        <rect x="250" y="62" width="58" height="100" rx="16" fill="#20394d"/>
        <rect x="58" y="92" width="56" height="12" rx="6" fill="#eef6ff"/>
        <rect x="58" y="116" width="44" height="10" rx="5" fill="#79c1ff"/>
        <rect x="166" y="104" width="46" height="10" rx="5" fill="#ffd36f"/>
        <rect x="166" y="122" width="30" height="10" rx="5" fill="#85d9aa"/>
        <rect x="264" y="88" width="30" height="48" rx="10" fill="#7abfff"/>
        <path d="M128 112 H152" stroke="#ffc267" stroke-width="5" stroke-linecap="round"/>
        <path d="M226 112 H250" stroke="#ffc267" stroke-width="5" stroke-linecap="round"/>
        <rect x="106" y="170" width="148" height="8" rx="4" fill="#5b7d9d"/>
      `;
      break;
    case 'version':
      svgMarkup = `
        <rect x="26" y="38" width="308" height="144" rx="22" fill="#12212f"/>
        <rect x="44" y="64" width="74" height="64" rx="16" fill="#20364d"/>
        <rect x="142" y="64" width="74" height="64" rx="16" fill="#274767"/>
        <rect x="240" y="64" width="74" height="64" rx="16" fill="#2d5680"/>
        <text x="81" y="104" text-anchor="middle" font-size="26" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">1</text>
        <text x="179" y="104" text-anchor="middle" font-size="26" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">3</text>
        <text x="277" y="104" text-anchor="middle" font-size="26" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">0</text>
        <path d="M118 96 H142" stroke="#ffc56c" stroke-width="5" stroke-linecap="round"/>
        <path d="M216 96 H240" stroke="#ffc56c" stroke-width="5" stroke-linecap="round"/>
        <rect x="62" y="148" width="236" height="12" rx="6" fill="#3f5f7d"/>
        <rect x="62" y="148" width="156" height="12" rx="6" fill="#75bfff"/>
      `;
      break;
    case 'handles':
      svgMarkup = `
        <rect x="28" y="42" width="304" height="140" rx="22" fill="#12212e"/>
        <rect x="48" y="68" width="110" height="42" rx="14" fill="#22384d"/>
        <rect x="48" y="122" width="110" height="42" rx="14" fill="#22384d"/>
        <rect x="206" y="84" width="102" height="64" rx="18" fill="#29496a"/>
        <text x="103" y="95" text-anchor="middle" font-size="13" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">VkInstance</text>
        <text x="103" y="149" text-anchor="middle" font-size="13" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">VkBuffer</text>
        <text x="257" y="122" text-anchor="middle" font-size="15" fill="#ffd16e" font-family="Tahoma, Arial, sans-serif">VK_NULL_HANDLE</text>
        <path d="M158 89 H206" stroke="#7cc2ff" stroke-width="5" stroke-linecap="round"/>
        <path d="M158 143 H206" stroke="#7cc2ff" stroke-width="5" stroke-linecap="round"/>
      `;
      break;
    case 'constants':
      svgMarkup = `
        <rect x="28" y="36" width="304" height="148" rx="22" fill="#12202d"/>
        <rect x="48" y="58" width="78" height="44" rx="14" fill="#22384d"/>
        <rect x="140" y="58" width="78" height="44" rx="14" fill="#274668"/>
        <rect x="232" y="58" width="78" height="44" rx="14" fill="#22384d"/>
        <rect x="48" y="118" width="78" height="44" rx="14" fill="#274668"/>
        <rect x="140" y="118" width="78" height="44" rx="14" fill="#22384d"/>
        <rect x="232" y="118" width="78" height="44" rx="14" fill="#274668"/>
        <text x="87" y="85" text-anchor="middle" font-size="12" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">WHOLE</text>
        <text x="179" y="85" text-anchor="middle" font-size="12" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">MIPS</text>
        <text x="271" y="85" text-anchor="middle" font-size="12" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">LAYERS</text>
        <text x="87" y="145" text-anchor="middle" font-size="12" fill="#ffd06f" font-family="Tahoma, Arial, sans-serif">IGNORED</text>
        <text x="179" y="145" text-anchor="middle" font-size="12" fill="#ffd06f" font-family="Tahoma, Arial, sans-serif">EXTERNAL</text>
        <text x="271" y="145" text-anchor="middle" font-size="12" fill="#ffd06f" font-family="Tahoma, Arial, sans-serif">UNUSED</text>
      `;
      break;
    case 'swapchain':
      svgMarkup = `
        <rect x="20" y="30" width="320" height="160" rx="22" fill="#101821"/>
        <rect x="36" y="46" width="288" height="38" rx="14" fill="#1b3044"/>
        <rect x="48" y="98" width="72" height="76" rx="16" fill="#21384e"/>
        <rect x="144" y="86" width="72" height="88" rx="16" fill="#2a4b6d" stroke="#8fd0ff" stroke-width="2"/>
        <rect x="240" y="98" width="72" height="76" rx="16" fill="#21384e"/>
        <rect x="64" y="116" width="40" height="26" rx="8" fill="#5d809f"/>
        <rect x="160" y="112" width="40" height="34" rx="10" fill="#7dc2ff"/>
        <rect x="256" y="116" width="40" height="26" rx="8" fill="#5d809f"/>
        <path d="M120 132 H144" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M216 132 H240" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <rect x="84" y="58" width="112" height="10" rx="5" fill="#dce8f7"/>
      `;
      break;
    case 'renderpass':
      svgMarkup = `
        <rect x="24" y="36" width="312" height="148" rx="22" fill="#101821"/>
        <rect x="40" y="58" width="88" height="104" rx="18" fill="#1d3148"/>
        <rect x="146" y="46" width="96" height="128" rx="20" fill="#294b6e"/>
        <rect x="260" y="58" width="60" height="104" rx="18" fill="#1d3148"/>
        <rect x="56" y="78" width="56" height="16" rx="8" fill="#dce8f7"/>
        <rect x="56" y="108" width="44" height="14" rx="7" fill="#7cc0ff"/>
        <rect x="56" y="134" width="52" height="14" rx="7" fill="#ffd36f"/>
        <rect x="160" y="74" width="68" height="12" rx="6" fill="#eef6ff"/>
        <rect x="160" y="102" width="68" height="12" rx="6" fill="#7bc2ff"/>
        <rect x="160" y="130" width="68" height="12" rx="6" fill="#85d7aa"/>
        <rect x="274" y="96" width="32" height="24" rx="10" fill="#7bc2ff"/>
        <path d="M128 110 H146" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M242 110 H260" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
      `;
      break;
    case 'pipeline':
      svgMarkup = `
        <rect x="20" y="34" width="320" height="152" rx="22" fill="#101821"/>
        <rect x="32" y="90" width="54" height="42" rx="12" fill="#1c324a"/>
        <rect x="102" y="90" width="54" height="42" rx="12" fill="#244265"/>
        <rect x="172" y="90" width="54" height="42" rx="12" fill="#2c547c"/>
        <rect x="242" y="90" width="54" height="42" rx="12" fill="#356796"/>
        <rect x="82" y="58" width="104" height="10" rx="5" fill="#dce8f7"/>
        <rect x="192" y="58" width="78" height="10" rx="5" fill="#ffd36f"/>
        <path d="M86 111 H102" stroke="#ffbe66" stroke-width="4" stroke-linecap="round"/>
        <path d="M156 111 H172" stroke="#ffbe66" stroke-width="4" stroke-linecap="round"/>
        <path d="M226 111 H242" stroke="#ffbe66" stroke-width="4" stroke-linecap="round"/>
        <text x="59" y="116" text-anchor="middle" font-size="12" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">VS</text>
        <text x="129" y="116" text-anchor="middle" font-size="12" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">IA</text>
        <text x="199" y="116" text-anchor="middle" font-size="12" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">RS</text>
        <text x="269" y="116" text-anchor="middle" font-size="12" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">FS</text>
        <rect x="88" y="152" width="184" height="10" rx="5" fill="#5d7b98"/>
      `;
      break;
    case 'frame':
      svgMarkup = `
        <rect x="24" y="40" width="312" height="144" rx="22" fill="#101821"/>
        <rect x="34" y="92" width="58" height="36" rx="12" fill="#20354d"/>
        <rect x="108" y="92" width="58" height="36" rx="12" fill="#27496d"/>
        <rect x="182" y="92" width="58" height="36" rx="12" fill="#2e5f8f"/>
        <rect x="256" y="92" width="58" height="36" rx="12" fill="#3476b0"/>
        <path d="M92 110 H108" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M166 110 H182" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M240 110 H256" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <text x="63" y="114" text-anchor="middle" font-size="10" fill="#f0f7ff" font-family="Tahoma, Arial, sans-serif">Acquire</text>
        <text x="137" y="114" text-anchor="middle" font-size="10" fill="#f0f7ff" font-family="Tahoma, Arial, sans-serif">Record</text>
        <text x="211" y="114" text-anchor="middle" font-size="10" fill="#f0f7ff" font-family="Tahoma, Arial, sans-serif">Submit</text>
        <text x="285" y="114" text-anchor="middle" font-size="10" fill="#f0f7ff" font-family="Tahoma, Arial, sans-serif">Present</text>
        <rect x="64" y="150" width="232" height="10" rx="5" fill="#5f7d99"/>
        <circle cx="88" cy="155" r="7" fill="#ffd36f"/>
      `;
      break;
    case 'imgui':
      svgMarkup = `
        <rect x="24" y="28" width="312" height="170" rx="22" fill="#101720"/>
        <rect x="52" y="54" width="160" height="120" rx="16" fill="#203245"/>
        <rect x="52" y="54" width="160" height="24" rx="16" fill="#365372"/>
        <rect x="70" y="92" width="18" height="18" rx="4" fill="#7cc5ff"/>
        <rect x="100" y="92" width="78" height="12" rx="6" fill="#ddeaf7"/>
        <rect x="70" y="122" width="102" height="14" rx="7" fill="#6e8faf"/>
        <circle cx="152" cy="129" r="10" fill="#ffc268"/>
        <rect x="70" y="148" width="84" height="22" rx="11" fill="#4f86d5"/>
      `;
      break;
    case 'imgui-panels':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101821"/>
        <rect x="20" y="24" width="320" height="22" rx="22" fill="#2a4158"/>
        <rect x="36" y="58" width="92" height="118" rx="16" fill="#182736"/>
        <rect x="136" y="58" width="116" height="118" rx="16" fill="#203548"/>
        <rect x="260" y="58" width="64" height="118" rx="16" fill="#182736"/>
        <rect x="46" y="76" width="50" height="10" rx="5" fill="#dbe8f6"/>
        <rect x="46" y="100" width="62" height="10" rx="5" fill="#7cbfff"/>
        <rect x="150" y="76" width="72" height="10" rx="5" fill="#dbe8f6"/>
        <rect x="150" y="104" width="86" height="12" rx="6" fill="#7eafde"/>
        <circle cx="292" cy="92" r="16" fill="#f5c66e"/>
        <rect x="274" y="122" width="36" height="38" rx="10" fill="#5eaaf7"/>
      `;
      break;
    case 'imgui-color':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#111821"/>
        <rect x="40" y="46" width="132" height="132" rx="18" fill="url(#vkColorWheel)"/>
        <rect x="194" y="54" width="106" height="108" rx="18" fill="#1d3144"/>
        <rect x="212" y="74" width="70" height="18" rx="9" fill="#dce9f8"/>
        <rect x="212" y="106" width="58" height="18" rx="9" fill="#7fc0ff"/>
        <rect x="212" y="138" width="44" height="18" rx="9" fill="#ffc667"/>
        <rect x="64" y="184" width="232" height="10" rx="5" fill="#6dc6a0"/>
        <defs>
          <linearGradient id="vkColorWheel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff6b6b"/>
            <stop offset="32%" stop-color="#ffd56d"/>
            <stop offset="66%" stop-color="#6dd5ff"/>
            <stop offset="100%" stop-color="#8e7dff"/>
          </linearGradient>
        </defs>
      `;
      break;
    case 'imgui-drag':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101821"/>
        <rect x="38" y="54" width="110" height="118" rx="16" fill="#182736"/>
        <rect x="208" y="62" width="96" height="102" rx="16" fill="#213548" stroke="#4d7398" stroke-width="2"/>
        <rect x="56" y="78" width="72" height="14" rx="7" fill="#dbe8f7"/>
        <rect x="56" y="108" width="58" height="14" rx="7" fill="#7cbfff"/>
        <rect x="56" y="138" width="82" height="14" rx="7" fill="#ffc96f"/>
        <path d="M150 112 H206" stroke="#ffd173" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 8"/>
        <path d="M288 64 L320 100 L298 104 L304 130 Z" fill="#fff0cc"/>
      `;
      break;
    case 'imgui-anim':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101721"/>
        <rect x="52" y="60" width="256" height="108" rx="20" fill="#192838"/>
        <rect x="78" y="88" width="180" height="22" rx="11" fill="#324a63"/>
        <rect x="78" y="88" width="132" height="22" rx="11" fill="#67b5ff"/>
        <circle cx="210" cy="99" r="16" fill="#ffd06c"/>
        <rect x="92" y="130" width="96" height="14" rx="7" fill="#dce8f6"/>
        <rect x="198" y="130" width="64" height="14" rx="7" fill="#8ec8ff"/>
        <rect x="84" y="180" width="192" height="10" rx="5" fill="#86d9a7"/>
      `;
      break;
    case 'imgui-gizmo':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#0f1720"/>
        <rect x="40" y="48" width="160" height="124" rx="18" fill="#172533"/>
        <rect x="216" y="56" width="92" height="116" rx="16" fill="#203547"/>
        <path d="M120 140 V84" stroke="#7cbfff" stroke-width="6" stroke-linecap="round"/>
        <path d="M92 112 H148" stroke="#ffd06d" stroke-width="6" stroke-linecap="round"/>
        <circle cx="120" cy="112" r="18" fill="#f1f6ff"/>
        <rect x="232" y="82" width="58" height="14" rx="7" fill="#dbe8f7"/>
        <rect x="232" y="112" width="44" height="14" rx="7" fill="#7dc0ff"/>
        <rect x="232" y="142" width="52" height="14" rx="7" fill="#ffcb6d"/>
      `;
      break;
    case 'scene-3d':
      svgMarkup = `
        <rect x="18" y="22" width="324" height="176" rx="22" fill="#0f1721"/>
        <rect x="40" y="44" width="280" height="140" rx="18" fill="#132331"/>
        <path d="M72 154 H286" stroke="#27445f" stroke-width="4" stroke-linecap="round"/>
        <path d="M126 94 L176 68 L230 100 L180 126 Z" fill="#66b5ff"/>
        <path d="M126 94 L126 146 L180 176 L180 126 Z" fill="#3e84cb"/>
        <path d="M180 126 L230 100 L230 150 L180 176 Z" fill="#8fd0ff"/>
        <circle cx="268" cy="78" r="18" fill="#ffcd71"/>
        <rect x="84" y="186" width="192" height="8" rx="4" fill="#7bd3a7"/>
      `;
      break;
    case 'camera':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#0f1720"/>
        <rect x="44" y="52" width="272" height="126" rx="18" fill="#132331"/>
        <circle cx="180" cy="116" r="42" fill="none" stroke="#5c89b4" stroke-width="4"/>
        <circle cx="180" cy="116" r="12" fill="#ffd06e"/>
        <circle cx="242" cy="82" r="14" fill="#7cc0ff"/>
        <path d="M242 82 L198 108" stroke="#dfe9f6" stroke-width="4" stroke-linecap="round"/>
        <rect x="232" y="142" width="48" height="12" rx="6" fill="#7cc0ff"/>
      `;
      break;
    case 'picking':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#101821"/>
        <rect x="34" y="48" width="192" height="132" rx="18" fill="#152635"/>
        <rect x="246" y="58" width="74" height="112" rx="16" fill="#1d3144"/>
        <rect x="72" y="82" width="54" height="54" rx="12" fill="#4f9cf5"/>
        <rect x="142" y="94" width="64" height="46" rx="12" fill="#ffd06d"/>
        <path d="M54 66 L124 108" stroke="#f6f1d6" stroke-width="4" stroke-linecap="round"/>
        <circle cx="54" cy="66" r="8" fill="#fff2d4"/>
        <rect x="258" y="82" width="50" height="12" rx="6" fill="#dce8f7"/>
        <rect x="258" y="110" width="42" height="12" rx="6" fill="#7dc0ff"/>
      `;
      break;
    case 'postprocess':
      svgMarkup = `
        <rect x="20" y="24" width="320" height="172" rx="22" fill="#0f1720"/>
        <rect x="32" y="78" width="86" height="76" rx="16" fill="#172b3d"/>
        <rect x="136" y="62" width="92" height="108" rx="18" fill="#274563"/>
        <rect x="246" y="78" width="82" height="76" rx="16" fill="#182b3e"/>
        <text x="74" y="120" text-anchor="middle" font-size="13" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">Scene</text>
        <text x="182" y="120" text-anchor="middle" font-size="13" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">Bloom</text>
        <text x="286" y="120" text-anchor="middle" font-size="13" fill="#edf6ff" font-family="Tahoma, Arial, sans-serif">Present</text>
        <path d="M118 116 H136" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
        <path d="M228 116 H246" stroke="#ffc267" stroke-width="4" stroke-linecap="round"/>
      `;
      break;
    case 'triangle-scene':
      svgMarkup = `
        <defs>
          <linearGradient id="vkTriangleSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#11253a"/>
            <stop offset="100%" stop-color="#09111a"/>
          </linearGradient>
          <linearGradient id="vkTriangleFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6bc4ff"/>
            <stop offset="100%" stop-color="#ffd470"/>
          </linearGradient>
        </defs>
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#111923"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#20364d"/>
        <circle cx="36" cy="30" r="5" fill="#ffb76d"/>
        <circle cx="54" cy="30" r="5" fill="#79d1ff"/>
        <circle cx="72" cy="30" r="5" fill="#8be3af"/>
        <rect x="34" y="52" width="292" height="132" rx="18" fill="url(#vkTriangleSky)"/>
        <path d="M74 154 H286" stroke="#2c4762" stroke-width="4" stroke-linecap="round"/>
        <path d="M180 70 L258 158 L102 158 Z" fill="url(#vkTriangleFill)"/>
        <path d="M180 78 L244 150 L116 150 Z" fill="none" stroke="#f9fbff" stroke-width="3" opacity="0.35"/>
        <rect x="50" y="192" width="76" height="8" rx="4" fill="#5f8db5"/>
        <rect x="138" y="192" width="120" height="8" rx="4" fill="#ffd470"/>
      `;
      break;
    case 'texture-window':
      svgMarkup = `
        <defs>
          <linearGradient id="vkTextureHeader" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1e3349"/>
            <stop offset="100%" stop-color="#294865"/>
          </linearGradient>
          <pattern id="vkTexturePreviewPattern" width="42" height="42" patternUnits="userSpaceOnUse">
            <rect width="42" height="42" fill="#24405d"/>
            <rect width="21" height="21" fill="#ffcf6e"/>
            <rect x="21" y="21" width="21" height="21" fill="#7fd3a8"/>
            <circle cx="31" cy="11" r="6" fill="#7bc4ff"/>
          </pattern>
        </defs>
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1620"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="url(#vkTextureHeader)"/>
        <circle cx="36" cy="30" r="5" fill="#ffb468"/>
        <circle cx="54" cy="30" r="5" fill="#7dd0ff"/>
        <circle cx="72" cy="30" r="5" fill="#84e0aa"/>
        <rect x="36" y="52" width="288" height="136" rx="20" fill="#132230"/>
        <rect x="84" y="70" width="192" height="100" rx="16" fill="url(#vkTexturePreviewPattern)" stroke="#dce9f7" stroke-width="3"/>
        <rect x="58" y="182" width="108" height="8" rx="4" fill="#5c7b98"/>
        <rect x="178" y="182" width="124" height="8" rx="4" fill="#78c1ff"/>
      `;
      break;
    case 'multi-texture':
      svgMarkup = `
        <defs>
          <pattern id="vkSpriteA" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#22384f"/>
            <rect width="15" height="15" fill="#6ab8ff"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffd16d"/>
          </pattern>
          <pattern id="vkSpriteB" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill="#1f3145"/>
            <circle cx="9" cy="9" r="6" fill="#ffab7f"/>
            <rect x="14" y="14" width="10" height="10" fill="#7dd1ab"/>
          </pattern>
        </defs>
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#101720"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#20354a"/>
        <rect x="32" y="50" width="296" height="142" rx="18" fill="#132130"/>
        <rect x="48" y="68" width="88" height="72" rx="14" fill="url(#vkSpriteA)" stroke="#e7f2ff" stroke-width="2"/>
        <rect x="146" y="106" width="112" height="70" rx="14" fill="url(#vkSpriteB)" stroke="#f0f6ff" stroke-width="2"/>
        <rect x="248" y="66" width="60" height="60" rx="14" fill="#6bbdff"/>
        <circle cx="278" cy="96" r="16" fill="#ffd36f"/>
        <rect x="56" y="176" width="84" height="8" rx="4" fill="#6aa6d6"/>
        <rect x="152" y="176" width="104" height="8" rx="4" fill="#ffd36f"/>
      `;
      break;
    case 'transform-lab':
      svgMarkup = `
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#111923"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#21364b"/>
        <rect x="36" y="54" width="188" height="132" rx="18" fill="#132230"/>
        <rect x="246" y="54" width="78" height="132" rx="18" fill="#182a3c"/>
        <path d="M58 154 H206" stroke="#294863" stroke-width="3" stroke-linecap="round"/>
        <path d="M132 74 V168" stroke="#294863" stroke-width="3" stroke-linecap="round"/>
        <rect x="96" y="90" width="72" height="72" rx="16" fill="#6bbdff" transform="rotate(22 132 126)"/>
        <path d="M132 126 L188 88" stroke="#ffd470" stroke-width="5" stroke-linecap="round"/>
        <rect x="260" y="74" width="48" height="12" rx="6" fill="#dce8f7"/>
        <rect x="260" y="104" width="34" height="12" rx="6" fill="#7bc3ff"/>
        <rect x="260" y="134" width="40" height="12" rx="6" fill="#ffd470"/>
        <rect x="260" y="164" width="54" height="8" rx="4" fill="#7bd4aa"/>
      `;
      break;
    case 'obj-viewer':
      svgMarkup = `
        <defs>
          <linearGradient id="vkObjGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7cc2ff"/>
            <stop offset="100%" stop-color="#4f86d6"/>
          </linearGradient>
        </defs>
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#101821"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#203447"/>
        <rect x="34" y="50" width="214" height="140" rx="18" fill="#132230"/>
        <rect x="258" y="50" width="68" height="140" rx="18" fill="#182938"/>
        <path d="M76 166 H212" stroke="#29465f" stroke-width="4" stroke-linecap="round"/>
        <path d="M104 92 L150 70 L196 94 L150 116 Z" fill="url(#vkObjGradient)"/>
        <path d="M104 92 L104 142 L150 170 L150 116 Z" fill="#376fb3"/>
        <path d="M150 116 L196 94 L196 146 L150 170 Z" fill="#9bd7ff"/>
        <rect x="270" y="76" width="44" height="10" rx="5" fill="#dce8f7"/>
        <rect x="270" y="102" width="38" height="10" rx="5" fill="#7fc2ff"/>
        <rect x="270" y="128" width="32" height="10" rx="5" fill="#ffd470"/>
        <rect x="270" y="154" width="46" height="10" rx="5" fill="#83d7ab"/>
      `;
      break;
    case 'shader-files':
      svgMarkup = `
        <rect x="16" y="18" width="328" height="184" rx="20" fill="#101721"/>
        <rect x="16" y="18" width="328" height="30" rx="20" fill="#203548"/>
        <rect x="34" y="66" width="82" height="118" rx="16" fill="#182938"/>
        <rect x="138" y="66" width="82" height="118" rx="16" fill="#21374c"/>
        <rect x="242" y="66" width="82" height="118" rx="16" fill="#182938"/>
        <text x="75" y="92" text-anchor="middle" font-size="11" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">mesh.vert</text>
        <text x="179" y="92" text-anchor="middle" font-size="12" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">SPIR-V</text>
        <text x="283" y="92" text-anchor="middle" font-size="11" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">mesh.frag</text>
        <rect x="50" y="112" width="50" height="10" rx="5" fill="#dce8f7"/>
        <rect x="50" y="136" width="38" height="10" rx="5" fill="#7dc1ff"/>
        <rect x="154" y="118" width="50" height="14" rx="7" fill="#ffd470"/>
        <rect x="258" y="112" width="50" height="10" rx="5" fill="#dce8f7"/>
        <rect x="258" y="136" width="38" height="10" rx="5" fill="#7fd6ad"/>
        <path d="M116 124 H138" stroke="#ffd470" stroke-width="4" stroke-linecap="round"/>
        <path d="M220 124 H242" stroke="#ffd470" stroke-width="4" stroke-linecap="round"/>
        <rect x="126" y="162" width="106" height="10" rx="5" fill="#5f7991"/>
      `;
      break;
    case 'rotating-sprites':
      svgMarkup = `
        <defs>
          <pattern id="vkRotatePattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="#23384d"/>
            <rect width="15" height="15" fill="#6ab8ff"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffd470"/>
          </pattern>
        </defs>
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#101822"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#21364a"/>
        <rect x="34" y="52" width="292" height="136" rx="18" fill="#132230"/>
        <rect x="92" y="78" width="64" height="64" rx="14" fill="url(#vkRotatePattern)" transform="rotate(14 124 110)"/>
        <rect x="182" y="92" width="88" height="88" rx="16" fill="#f2f6ff" transform="rotate(-19 226 136)"/>
        <rect x="198" y="110" width="56" height="18" rx="9" fill="#6eb8ff"/>
        <path d="M124 68 A40 40 0 0 1 164 108" fill="none" stroke="#ffd470" stroke-width="4" stroke-linecap="round"/>
        <path d="M226 76 A60 60 0 0 1 286 136" fill="none" stroke="#7cd2a8" stroke-width="4" stroke-linecap="round"/>
        <rect x="60" y="178" width="78" height="8" rx="4" fill="#7ac2ff"/>
        <rect x="150" y="178" width="110" height="8" rx="4" fill="#ffd470"/>
      `;
      break;
    case 'hardware-dashboard':
      svgMarkup = `
        <rect x="14" y="16" width="332" height="188" rx="20" fill="#101821"/>
        <rect x="14" y="16" width="332" height="28" rx="20" fill="#21354a"/>
        <rect x="34" y="52" width="292" height="138" rx="18" fill="#142231"/>
        <rect x="48" y="68" width="126" height="50" rx="14" fill="#1c2f42"/>
        <rect x="186" y="68" width="126" height="50" rx="14" fill="#1c2f42"/>
        <rect x="48" y="130" width="126" height="44" rx="14" fill="#1c2f42"/>
        <rect x="186" y="130" width="126" height="44" rx="14" fill="#1c2f42"/>
        <text x="72" y="88" font-size="11" fill="#91a8c0" font-family="Tahoma, Arial, sans-serif">GPU</text>
        <text x="210" y="88" font-size="11" fill="#91a8c0" font-family="Tahoma, Arial, sans-serif">VRAM</text>
        <text x="72" y="148" font-size="11" fill="#91a8c0" font-family="Tahoma, Arial, sans-serif">CPU</text>
        <text x="210" y="148" font-size="11" fill="#91a8c0" font-family="Tahoma, Arial, sans-serif">RAM</text>
        <rect x="64" y="94" width="78" height="10" rx="5" fill="#7dc2ff"/>
        <rect x="202" y="94" width="88" height="10" rx="5" fill="#ffd470"/>
        <rect x="64" y="154" width="68" height="10" rx="5" fill="#7fd5ad"/>
        <rect x="202" y="154" width="96" height="10" rx="5" fill="#dce8f7"/>
        <rect x="54" y="182" width="252" height="6" rx="3" fill="#5c7c99"/>
      `;
      break;
    default:
      return renderVulkanReadyExampleFallbackPreview(example);
  }

  svgMarkup = localizeVulkanPreviewLabels(svgMarkup);

  return `
    <figure class="vulkan-ready-example-shot">
      <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="360" height="220" rx="24" fill="#0a0f16"/>
        ${svgMarkup}
      </svg>
      <figcaption>${escapeHtml(title)}</figcaption>
    </figure>
  `;
}

    return Object.freeze({
      renderVulkanReadyExampleFallbackPreview,
      renderVulkanReadyExamplePreview
    });
  }

  return Object.freeze({
    createVulkanReadyExamplePreviewRuntime
  });
})();
