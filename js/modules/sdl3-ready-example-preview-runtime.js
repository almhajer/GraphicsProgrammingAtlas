(function(global) {
  'use strict';

  function createSdl3ReadyExamplePreviewRuntime(api = {}) {
    const {
      escapeAttribute,
      escapeHtml,
      getRawVulkanCatalogExampleById,
      renderVulkanReadyExamplePreview
    } = api;

    function renderSdl3ReadyExampleFallbackPreview(example) {
      const title = String(example.previewTitle || `معاينة ${example.title || 'SDL3'}`).trim();
      return `
        <figure class="sdl3-ready-example-shot">
          <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="220" rx="24" fill="#0b1016"/>
            <rect x="22" y="24" width="316" height="172" rx="22" fill="#101720"/>
            <rect x="22" y="24" width="316" height="28" rx="22" fill="#223447"/>
            <rect x="44" y="70" width="126" height="92" rx="18" fill="#182736"/>
            <rect x="190" y="70" width="126" height="92" rx="18" fill="#213548"/>
            <rect x="62" y="92" width="88" height="14" rx="7" fill="#dce8f7"/>
            <rect x="62" y="120" width="62" height="12" rx="6" fill="#7dc0ff"/>
            <circle cx="252" cy="106" r="24" fill="#ffd06e"/>
            <rect x="214" y="142" width="76" height="12" rx="6" fill="#7dd2a2"/>
            <text x="180" y="186" text-anchor="middle" font-size="15" fill="#eef6ff" font-family="Tahoma, Arial, sans-serif">SDL3 Example</text>
          </svg>
          <figcaption>${escapeHtml(title)}</figcaption>
        </figure>
      `;
    }

    function renderSdl3ReadyExamplePreview(example) {
      if (example?.sourceLibrary === 'vulkan' && example?.sourceExampleId) {
        const sourceExample = getRawVulkanCatalogExampleById(example.sourceExampleId);
        if (sourceExample) {
          return renderVulkanReadyExamplePreview(sourceExample);
        }
      }

      if (!example?.previewKind) {
        return renderSdl3ReadyExampleFallbackPreview(example);
      }

      const title = String(example.previewTitle || `معاينة ${example.title || 'SDL3'}`).trim();
      let svgMarkup = '';

      switch (example.previewKind) {
        case 'window':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#111923"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#1f3147"/>
            <circle cx="36" cy="30" r="5" fill="#ffb15a"/>
            <circle cx="54" cy="30" r="5" fill="#7fd2ff"/>
            <circle cx="72" cy="30" r="5" fill="#75e2aa"/>
            <rect x="38" y="72" width="120" height="16" rx="8" fill="#36516f"/>
            <rect x="38" y="104" width="284" height="64" rx="16" fill="#162331" stroke="#2d4764" stroke-width="2"/>
            <rect x="38" y="182" width="92" height="10" rx="5" fill="#4d7297"/>
          `;
          break;
        case 'input':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#121821"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#24364c"/>
            <rect x="128" y="84" width="92" height="92" rx="18" fill="#56abff"/>
            <rect x="252" y="124" width="16" height="16" rx="4" fill="#ffd165"/>
            <path d="M276 88 L304 112 L286 116 L292 134 Z" fill="#fff4dc"/>
            <rect x="40" y="182" width="180" height="10" rx="5" fill="#455f7c"/>
          `;
          break;
        case 'button':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#111822"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#22374d"/>
            <rect x="76" y="82" width="208" height="66" rx="18" fill="#4d84d4"/>
            <text x="180" y="122" text-anchor="middle" font-size="18" fill="#f5f8ff" font-family="Tahoma, Arial, sans-serif">زر تفاعلي</text>
            <rect x="76" y="164" width="136" height="14" rx="7" fill="#f0bf62"/>
          `;
          break;
        case 'image':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101722"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#203246"/>
            <rect x="78" y="62" width="206" height="112" rx="16" fill="#1a2a3a" stroke="#5e8bc7" stroke-width="3"/>
            <circle cx="124" cy="96" r="18" fill="#ffd46d"/>
            <path d="M92 156 L146 110 L190 142 L228 96 L270 156 Z" fill="#5bc0b2"/>
          `;
          break;
        case 'image-scale':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1621"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#203244"/>
            <rect x="52" y="50" width="256" height="136" rx="18" fill="#253649"/>
            <rect x="104" y="72" width="156" height="96" rx="12" fill="#162533" stroke="#76a8ee" stroke-width="3"/>
            <path d="M120 146 L150 110 L180 132 L214 88 L244 146 Z" fill="#7bcbbd"/>
            <circle cx="148" cy="102" r="14" fill="#ffd66d"/>
          `;
          break;
        case 'image-crop':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101823"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#1f3146"/>
            <rect x="50" y="58" width="92" height="92" rx="12" fill="#243749"/>
            <rect x="62" y="70" width="24" height="24" rx="4" fill="#6eb5ff"/>
            <rect x="88" y="70" width="24" height="24" rx="4" fill="#ffd56d"/>
            <rect x="62" y="96" width="24" height="24" rx="4" fill="#7bd0bf"/>
            <rect x="88" y="96" width="24" height="24" rx="4" fill="#f58f8f"/>
            <rect x="184" y="56" width="118" height="118" rx="18" fill="#162432" stroke="#6ca7f5" stroke-width="3"/>
            <rect x="80" y="88" width="58" height="58" rx="8" fill="none" stroke="#ffffff" stroke-width="3"/>
          `;
          break;
        case 'image-gallery':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1520"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#203143"/>
            <rect x="42" y="60" width="124" height="70" rx="14" fill="#233445"/>
            <rect x="194" y="60" width="124" height="70" rx="14" fill="#233445"/>
            <rect x="42" y="142" width="124" height="42" rx="14" fill="#233445"/>
            <rect x="54" y="72" width="100" height="42" rx="10" fill="#6ab8ff"/>
            <rect x="206" y="72" width="100" height="42" rx="10" fill="#ffd06b"/>
            <rect x="54" y="152" width="100" height="24" rx="8" fill="#76d0b5"/>
          `;
          break;
        case 'image-switch':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0e1420"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213347"/>
            <rect x="68" y="54" width="224" height="122" rx="18" fill="#223345"/>
            <rect x="86" y="72" width="188" height="86" rx="14" fill="#5daeff"/>
            <rect x="88" y="188" width="44" height="10" rx="5" fill="#5a728f"/>
            <rect x="156" y="188" width="44" height="10" rx="5" fill="#5a728f"/>
            <rect x="224" y="188" width="44" height="10" rx="5" fill="#f1c267"/>
          `;
          break;
        case 'image-drag':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0d141e"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#203245"/>
            <rect x="124" y="92" width="130" height="96" rx="16" fill="#0a0f16" opacity="0.45"/>
            <rect x="110" y="76" width="130" height="96" rx="16" fill="#f2f6ff"/>
            <rect x="124" y="88" width="102" height="18" rx="9" fill="#689ce3"/>
            <rect x="124" y="118" width="86" height="12" rx="6" fill="#d8deee"/>
            <path d="M264 72 L300 118 L278 122 L284 150 Z" fill="#ffe8b9"/>
          `;
          break;
        case 'image-button':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#23364c"/>
            <rect x="84" y="56" width="192" height="118" rx="24" fill="#25384b"/>
            <circle cx="180" cy="115" r="42" fill="#ffd16b"/>
            <path d="M166 92 L206 115 L166 138 Z" fill="#19314a"/>
            <rect x="94" y="184" width="144" height="12" rx="6" fill="#5eabff"/>
          `;
          break;
        case 'image-background':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0b1118"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#1d3043"/>
            <rect x="30" y="48" width="300" height="148" rx="18" fill="#274a68"/>
            <circle cx="88" cy="90" r="18" fill="#ffd16a"/>
            <path d="M34 180 L116 104 L176 146 L236 100 L326 188 Z" fill="#6fc0d3"/>
            <rect x="132" y="78" width="98" height="98" rx="18" fill="#ffe9b2" opacity="0.7"/>
            <rect x="96" y="182" width="180" height="10" rx="5" fill="#f3c46a"/>
          `;
          break;
        case 'audio-once':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10141d"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213145"/>
            <rect x="78" y="78" width="204" height="72" rx="18" fill="#47627d"/>
            <rect x="98" y="168" width="148" height="12" rx="6" fill="#ffc767"/>
            <path d="M260 94 L296 118 L260 142 Z" fill="#e7f1ff"/>
          `;
          break;
        case 'audio-loop':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10131b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223145"/>
            <circle cx="180" cy="108" r="52" fill="#29384a"/>
            <circle cx="180" cy="108" r="22" fill="#111923"/>
            <path d="M210 70 A58 58 0 0 1 234 116" fill="none" stroke="#77b8ff" stroke-width="10" stroke-linecap="round"/>
            <rect x="84" y="182" width="192" height="12" rx="6" fill="#ffc86d"/>
          `;
          break;
        case 'audio-transport':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f141d"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223146"/>
            <rect x="42" y="94" width="76" height="48" rx="12" fill="#5aa6ff"/>
            <rect x="142" y="94" width="76" height="48" rx="12" fill="#ffca6f"/>
            <rect x="242" y="94" width="76" height="48" rx="12" fill="#e86b6b"/>
            <rect x="78" y="158" width="204" height="10" rx="5" fill="#4a6280"/>
          `;
          break;
        case 'audio-volume':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10141d"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223246"/>
            <rect x="64" y="108" width="232" height="24" rx="12" fill="#40536d"/>
            <rect x="64" y="108" width="164" height="24" rx="12" fill="#5aaeff"/>
            <rect x="64" y="72" width="88" height="14" rx="7" fill="#ffc86d"/>
          `;
          break;
        case 'audio-gui':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10151d"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213147"/>
            <rect x="82" y="76" width="196" height="84" rx="18" fill="#5a7fae"/>
            <rect x="102" y="176" width="142" height="12" rx="6" fill="#ffc96d"/>
            <path d="M294 88 L318 112 L302 116 L306 136 Z" fill="#fce9b8"/>
          `;
          break;
        case 'audio-system':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f141c"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223145"/>
            <rect x="56" y="62" width="248" height="26" rx="13" fill="#5aaeff"/>
            <rect x="56" y="104" width="248" height="26" rx="13" fill="#ffd06f"/>
            <rect x="56" y="146" width="248" height="26" rx="13" fill="#7ad2b4"/>
          `;
          break;
        case 'audio-state':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10141c"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223145"/>
            <rect x="44" y="76" width="114" height="92" rx="18" fill="#5a92e4"/>
            <rect x="202" y="76" width="114" height="92" rx="18" fill="#d46b5e"/>
            <rect x="124" y="182" width="112" height="10" rx="5" fill="#ffc96d"/>
          `;
          break;
        case 'audio-dashboard':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10141d"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213146"/>
            <rect x="40" y="54" width="280" height="132" rx="18" fill="#1a2635"/>
            <rect x="64" y="78" width="180" height="14" rx="7" fill="#43556e"/>
            <rect x="64" y="78" width="132" height="14" rx="7" fill="#5aaeff"/>
            <rect x="64" y="106" width="180" height="14" rx="7" fill="#43556e"/>
            <rect x="64" y="106" width="104" height="14" rx="7" fill="#ffd06e"/>
            <rect x="64" y="134" width="180" height="14" rx="7" fill="#43556e"/>
            <rect x="64" y="134" width="150" height="14" rx="7" fill="#7ad2b4"/>
            <rect x="260" y="82" width="38" height="10" rx="5" fill="#ffc96d"/>
            <rect x="260" y="110" width="38" height="10" rx="5" fill="#d8e6f5"/>
            <rect x="64" y="162" width="90" height="10" rx="5" fill="#5aaeff"/>
            <rect x="160" y="162" width="90" height="10" rx="5" fill="#6ed9b2"/>
          `;
          break;
        case 'text':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#18131b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#3a2543"/>
            <text x="306" y="96" text-anchor="end" font-size="26" fill="#f8e4b8" font-family="Tahoma, Arial, sans-serif">مرحبا من SDL3_ttf</text>
            <rect x="48" y="122" width="260" height="12" rx="6" fill="#553766"/>
            <rect x="48" y="150" width="180" height="12" rx="6" fill="#6b4b7d"/>
          `;
          break;
        case 'text-title':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#16111b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#352541"/>
            <rect x="48" y="54" width="264" height="128" rx="18" fill="#23182d"/>
            <text x="180" y="102" text-anchor="middle" font-size="30" fill="#f7e6c3" font-family="Tahoma, Arial, sans-serif">لوحة الإحصاءات</text>
            <text x="180" y="136" text-anchor="middle" font-size="16" fill="#caa7d7" font-family="Tahoma, Arial, sans-serif">عنوان رئيسي مع وصف ثانوي</text>
            <rect x="100" y="152" width="160" height="8" rx="4" fill="#8e68b2"/>
          `;
          break;
        case 'text-lines':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#17131b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#362541"/>
            <rect x="44" y="54" width="272" height="132" rx="18" fill="#24182f"/>
            <rect x="74" y="78" width="180" height="10" rx="5" fill="#f3ddad"/>
            <rect x="92" y="108" width="162" height="10" rx="5" fill="#cfb0df"/>
            <rect x="112" y="138" width="142" height="10" rx="5" fill="#b991d2"/>
            <rect x="140" y="168" width="114" height="10" rx="5" fill="#9b73be"/>
          `;
          break;
        case 'text-counter':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#14151b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#293247"/>
            <rect x="64" y="54" width="232" height="130" rx="20" fill="#1b2030"/>
            <text x="180" y="96" text-anchor="middle" font-size="16" fill="#9ec7ff" font-family="Tahoma, Arial, sans-serif">الوقت المنقضي</text>
            <text x="180" y="146" text-anchor="middle" font-size="46" fill="#ffd27a" font-family="Tahoma, Arial, sans-serif">12</text>
            <rect x="106" y="162" width="148" height="10" rx="5" fill="#4f79ab"/>
          `;
          break;
        case 'text-status':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#15161c"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#2b3240"/>
            <rect x="48" y="58" width="264" height="122" rx="18" fill="#202631"/>
            <rect x="48" y="58" width="14" height="122" rx="7" fill="#7ccf89"/>
            <text x="286" y="110" text-anchor="end" font-size="26" fill="#eff8ee" font-family="Tahoma, Arial, sans-serif">تم الحفظ بنجاح</text>
            <text x="286" y="142" text-anchor="end" font-size="15" fill="#b4c0d4" font-family="Tahoma, Arial, sans-serif">1 نجاح  2 تحذير  3 خطأ</text>
          `;
          break;
        case 'text-button':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#17141c"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#342544"/>
            <rect x="88" y="78" width="184" height="54" rx="16" fill="#8d67c0"/>
            <text x="180" y="112" text-anchor="middle" font-size="20" fill="#f8f5ff" font-family="Tahoma, Arial, sans-serif">بدّل الحالة</text>
            <text x="180" y="166" text-anchor="middle" font-size="18" fill="#f1d59a" font-family="Tahoma, Arial, sans-serif">النص يتغير بعد النقر</text>
          `;
          break;
        case 'text-input':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#16141b"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#2f2540"/>
            <rect x="54" y="74" width="252" height="48" rx="14" fill="#21192b" stroke="#8f69c2" stroke-width="2"/>
            <text x="286" y="104" text-anchor="end" font-size="18" fill="#f3e8ff" font-family="Tahoma, Arial, sans-serif">اكتب هنا...</text>
            <rect x="54" y="142" width="200" height="10" rx="5" fill="#d6b6ee"/>
            <rect x="54" y="166" width="140" height="10" rx="5" fill="#a97ece"/>
          `;
          break;
        case 'ui-drag':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101722"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223447"/>
            <rect x="42" y="58" width="118" height="118" rx="20" fill="#1a2633" stroke="#33516d" stroke-width="2"/>
            <rect x="212" y="72" width="88" height="88" rx="18" fill="#dfe9f7"/>
            <rect x="228" y="88" width="56" height="14" rx="7" fill="#6aaeff"/>
            <rect x="224" y="116" width="64" height="12" rx="6" fill="#96aac2"/>
            <path d="M168 118 H206" stroke="#ffc86d" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 8"/>
            <path d="M286 60 L316 98 L296 102 L302 126 Z" fill="#ffe9b9"/>
          `;
          break;
        case 'ui-hover':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#111720"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213447"/>
            <rect x="56" y="66" width="248" height="104" rx="24" fill="#1c2937"/>
            <rect x="56" y="66" width="248" height="104" rx="24" fill="none" stroke="#7bc0ff" stroke-width="4"/>
            <rect x="88" y="98" width="108" height="12" rx="6" fill="#d8e5f5"/>
            <rect x="88" y="126" width="136" height="12" rx="6" fill="#88a7c6"/>
            <circle cx="264" cy="118" r="24" fill="#ffcf73"/>
            <path d="M272 84 L304 118 L286 122 L290 146 Z" fill="#fff1d3"/>
          `;
          break;
        case 'ui-collision':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161f"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223446"/>
            <rect x="58" y="74" width="110" height="82" rx="18" fill="#4d9cf3" opacity="0.88"/>
            <rect x="142" y="94" width="126" height="92" rx="20" fill="#ffbf67" opacity="0.8"/>
            <rect x="206" y="64" width="92" height="24" rx="12" fill="#243548"/>
            <text x="252" y="81" text-anchor="middle" font-size="12" fill="#f2f7ff" font-family="Tahoma, Arial, sans-serif">Drop Zone</text>
            <rect x="82" y="176" width="196" height="10" rx="5" fill="#7ecb8f"/>
          `;
          break;
        case 'ui-move':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1620"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213346"/>
            <path d="M52 154 C102 112, 148 112, 190 86 C220 68, 260 74, 304 118" fill="none" stroke="#446a92" stroke-width="6" stroke-linecap="round"/>
            <rect x="176" y="78" width="50" height="50" rx="14" fill="#6cb1ff"/>
            <rect x="186" y="90" width="30" height="10" rx="5" fill="#e9f3ff"/>
            <rect x="92" y="176" width="178" height="10" rx="5" fill="#ffca6c"/>
          `;
          break;
        case 'ui-animation':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161e"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223447"/>
            <rect x="68" y="66" width="224" height="102" rx="22" fill="#192531"/>
            <rect x="88" y="92" width="184" height="24" rx="12" fill="#31475e"/>
            <rect x="88" y="92" width="132" height="24" rx="12" fill="#68b4ff"/>
            <circle cx="220" cy="104" r="18" fill="#ffd16d"/>
            <rect x="118" y="136" width="124" height="14" rx="7" fill="#95b1ca"/>
            <rect x="86" y="178" width="188" height="10" rx="5" fill="#7ed19e"/>
          `;
          break;
        case 'ui-color':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#11161f"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223445"/>
            <rect x="56" y="60" width="248" height="120" rx="22" fill="#1a2633"/>
            <rect x="78" y="84" width="82" height="82" rx="18" fill="#4b96f0"/>
            <rect x="172" y="84" width="48" height="82" rx="12" fill="url(#sdlColorBar)"/>
            <rect x="232" y="84" width="48" height="82" rx="12" fill="#f4c262"/>
            <rect x="84" y="178" width="192" height="10" rx="5" fill="#d8e6f8"/>
            <defs>
              <linearGradient id="sdlColorBar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ff6b6b"/>
                <stop offset="50%" stop-color="#ffd56d"/>
                <stop offset="100%" stop-color="#6bd0ff"/>
              </linearGradient>
            </defs>
          `;
          break;
        case 'imgui-docking-pro':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#111822"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#233548"/>
            <rect x="26" y="50" width="306" height="22" rx="10" fill="#334b62"/>
            <rect x="38" y="56" width="40" height="10" rx="5" fill="#dce8f8"/>
            <rect x="92" y="56" width="40" height="10" rx="5" fill="#dce8f8"/>
            <rect x="146" y="56" width="40" height="10" rx="5" fill="#dce8f8"/>
            <rect x="26" y="82" width="104" height="98" rx="14" fill="#1a2838"/>
            <rect x="138" y="82" width="110" height="98" rx="14" fill="#1d3145"/>
            <rect x="256" y="82" width="76" height="46" rx="14" fill="#24384b"/>
            <rect x="256" y="134" width="76" height="46" rx="14" fill="#24384b"/>
            <rect x="38" y="96" width="60" height="10" rx="5" fill="#8bc5ff"/>
            <rect x="38" y="120" width="48" height="10" rx="5" fill="#dce8f8"/>
            <rect x="150" y="94" width="86" height="58" rx="10" fill="#16212f" stroke="#6db8ff" stroke-width="2"/>
            <rect x="270" y="94" width="42" height="8" rx="4" fill="#ffd06d"/>
            <rect x="270" y="146" width="42" height="8" rx="4" fill="#7ad2b4"/>
          `;
          break;
        case 'imgui-tree-combo':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223547"/>
            <rect x="34" y="54" width="112" height="124" rx="16" fill="#1a2837"/>
            <rect x="168" y="54" width="158" height="34" rx="14" fill="#1f3144"/>
            <rect x="168" y="96" width="158" height="82" rx="16" fill="#172432"/>
            <path d="M54 86 L66 86" stroke="#8cc6ff" stroke-width="4" stroke-linecap="round"/>
            <path d="M54 112 L66 112" stroke="#8cc6ff" stroke-width="4" stroke-linecap="round"/>
            <path d="M54 138 L66 138" stroke="#8cc6ff" stroke-width="4" stroke-linecap="round"/>
            <rect x="180" y="64" width="92" height="12" rx="6" fill="#dce8f8"/>
            <path d="M302 68 L312 68 L307 76 Z" fill="#ffc96d"/>
            <rect x="182" y="108" width="44" height="28" rx="8" fill="#5aaeff"/>
            <rect x="236" y="108" width="44" height="28" rx="8" fill="#ffd06e"/>
            <rect x="182" y="144" width="44" height="28" rx="8" fill="#7ad2b4"/>
            <rect x="236" y="144" width="64" height="10" rx="5" fill="#dce8f8"/>
          `;
          break;
        case 'imgui-text-keyboard':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#11161f"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223446"/>
            <rect x="34" y="54" width="292" height="74" rx="16" fill="#1b2531" stroke="#7e60b9" stroke-width="2"/>
            <rect x="50" y="72" width="220" height="10" rx="5" fill="#e7ddf8"/>
            <rect x="50" y="94" width="188" height="10" rx="5" fill="#c4b1e0"/>
            <rect x="50" y="116" width="150" height="10" rx="5" fill="#9d7dc6"/>
            <rect x="44" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="74" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="104" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="134" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="164" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="194" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="224" y="142" width="24" height="20" rx="6" fill="#334b62"/>
            <rect x="56" y="168" width="134" height="18" rx="8" fill="#5aaeff"/>
            <rect x="204" y="168" width="92" height="18" rx="8" fill="#ffd06e"/>
          `;
          break;
        case 'imgui-effects-lab':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161f"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223447"/>
            <rect x="34" y="52" width="94" height="22" rx="11" fill="#334b62"/>
            <rect x="136" y="52" width="82" height="22" rx="11" fill="#2a3c51"/>
            <rect x="226" y="52" width="82" height="22" rx="11" fill="#2a3c51"/>
            <rect x="34" y="84" width="292" height="96" rx="18" fill="#172432"/>
            <circle cx="180" cy="128" r="18" fill="#ffd06e" opacity="0.7"/>
            <circle cx="180" cy="128" r="38" fill="none" stroke="#ffb56a" stroke-width="4"/>
            <circle cx="180" cy="128" r="58" fill="none" stroke="#6cc0ff" stroke-width="6" opacity="0.45"/>
            <circle cx="132" cy="96" r="4" fill="#7ad2b4"/>
            <circle cx="222" cy="110" r="4" fill="#7ad2b4"/>
            <circle cx="116" cy="150" r="4" fill="#7ad2b4"/>
            <circle cx="244" cy="152" r="4" fill="#7ad2b4"/>
          `;
          break;
        case 'imgui-clock':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101823"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223547"/>
            <rect x="44" y="48" width="272" height="144" rx="18" fill="#162432"/>
            <circle cx="180" cy="108" r="54" fill="none" stroke="#7fbaf8" stroke-width="4"/>
            <path d="M180 108 L180 76" stroke="#ffd06d" stroke-width="5" stroke-linecap="round"/>
            <path d="M180 108 L214 108" stroke="#8cc6ff" stroke-width="4" stroke-linecap="round"/>
            <path d="M180 108 L196 146" stroke="#ff8d84" stroke-width="2" stroke-linecap="round"/>
            <circle cx="180" cy="108" r="5" fill="#f4f8ff"/>
            <rect x="110" y="170" width="140" height="10" rx="5" fill="#dce8f8"/>
          `;
          break;
        case 'imgui-car-orbit':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223547"/>
            <rect x="38" y="48" width="284" height="144" rx="18" fill="#172433"/>
            <circle cx="180" cy="120" r="54" fill="none" stroke="#537694" stroke-width="4"/>
            <circle cx="180" cy="120" r="68" fill="none" stroke="#2e465d" stroke-width="2"/>
            <rect x="220" y="98" width="28" height="18" rx="6" fill="#ffd06e"/>
            <circle cx="228" cy="116" r="4" fill="#232931"/>
            <circle cx="242" cy="116" r="4" fill="#232931"/>
            <rect x="92" y="170" width="176" height="10" rx="5" fill="#8bc5ff"/>
          `;
          break;
        case 'imgui-media-menus':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223547"/>
            <rect x="30" y="48" width="300" height="20" rx="10" fill="#32495f"/>
            <rect x="42" y="54" width="48" height="8" rx="4" fill="#dce8f8"/>
            <rect x="100" y="54" width="52" height="8" rx="4" fill="#dce8f8"/>
            <rect x="36" y="76" width="104" height="92" rx="16" fill="#172433"/>
            <rect x="134" y="92" width="98" height="84" rx="16" fill="#1a2b3d"/>
            <rect x="224" y="106" width="88" height="70" rx="16" fill="#223547"/>
            <rect x="242" y="122" width="24" height="18" rx="5" fill="#5aaeff"/>
            <rect x="272" y="122" width="24" height="18" rx="5" fill="#ffd06e"/>
            <rect x="242" y="148" width="24" height="18" rx="5" fill="#7ad2b4"/>
          `;
          break;
        case 'world-camera':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1620"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223346"/>
            <rect x="34" y="52" width="292" height="140" rx="18" fill="#162331"/>
            <rect x="46" y="64" width="84" height="54" rx="12" fill="#24384b"/>
            <rect x="138" y="64" width="84" height="54" rx="12" fill="#24384b"/>
            <rect x="230" y="64" width="84" height="54" rx="12" fill="#24384b"/>
            <rect x="122" y="104" width="116" height="72" rx="12" fill="none" stroke="#7dc1ff" stroke-width="4"/>
            <rect x="166" y="118" width="28" height="28" rx="7" fill="#ffcf71"/>
            <rect x="80" y="178" width="200" height="10" rx="5" fill="#6bc6a1"/>
          `;
          break;
        case 'sprite-pick':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101722"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213547"/>
            <rect x="214" y="70" width="92" height="92" rx="18" fill="#1d3043"/>
            <rect x="82" y="80" width="142" height="96" rx="18" fill="#eef4fd"/>
            <rect x="100" y="98" width="104" height="18" rx="9" fill="#679fe7"/>
            <rect x="100" y="128" width="82" height="12" rx="6" fill="#a4b6cd"/>
            <path d="M236 58 L272 106 L250 110 L256 140 Z" fill="#ffeabc"/>
            <path d="M224 118 H206" stroke="#ffd06e" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 8"/>
          `;
          break;
        case 'world-aabb':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161e"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223447"/>
            <rect x="72" y="66" width="54" height="54" rx="12" fill="#66b3ff"/>
            <rect x="158" y="58" width="46" height="122" rx="10" fill="#da7d66"/>
            <rect x="220" y="122" width="78" height="34" rx="10" fill="#da7d66"/>
            <path d="M126 94 H156" stroke="#ffd06d" stroke-width="6" stroke-linecap="round"/>
            <rect x="86" y="180" width="188" height="10" rx="5" fill="#8ecf94"/>
          `;
          break;
        case 'parallax':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0d1520"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223244"/>
            <rect x="30" y="48" width="300" height="148" rx="18" fill="#152232"/>
            <rect x="48" y="84" width="104" height="24" rx="12" fill="#355677"/>
            <rect x="176" y="74" width="116" height="28" rx="14" fill="#355677"/>
            <rect x="46" y="118" width="132" height="72" rx="18" fill="#294563"/>
            <rect x="164" y="132" width="154" height="64" rx="18" fill="#365575"/>
            <rect x="30" y="170" width="300" height="26" rx="13" fill="#5a7d4b"/>
            <rect x="150" y="134" width="28" height="36" rx="8" fill="#ffca69"/>
          `;
          break;
        case 'wire-cube':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223447"/>
            <rect x="38" y="48" width="284" height="144" rx="18" fill="#162433"/>
            <path d="M112 144 L112 88 L178 60 L178 120 Z" fill="none" stroke="#72b7ff" stroke-width="3"/>
            <path d="M178 120 L244 94 L244 150 L178 176 Z" fill="none" stroke="#72b7ff" stroke-width="3"/>
            <path d="M112 88 L178 60 L244 94 L178 120 Z" fill="none" stroke="#9ad0ff" stroke-width="3"/>
            <path d="M112 144 L178 176 L244 150" fill="none" stroke="#9ad0ff" stroke-width="3"/>
            <circle cx="112" cy="88" r="5" fill="#ffd178"/>
            <circle cx="178" cy="60" r="5" fill="#ffd178"/>
            <circle cx="244" cy="94" r="5" fill="#ffd178"/>
            <circle cx="112" cy="144" r="5" fill="#ffd178"/>
            <circle cx="178" cy="120" r="5" fill="#ffd178"/>
            <circle cx="244" cy="150" r="5" fill="#ffd178"/>
            <circle cx="178" cy="176" r="5" fill="#ffd178"/>
          `;
          break;
        case 'perspective-quad':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101822"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#233547"/>
            <rect x="38" y="48" width="284" height="144" rx="18" fill="#182736"/>
            <path d="M98 150 L152 82 L266 96 L222 168 Z" fill="none" stroke="#74b8ff" stroke-width="4"/>
            <path d="M98 150 L266 96" fill="none" stroke="#ffd177" stroke-width="3" stroke-dasharray="8 8"/>
            <path d="M152 82 L222 168" fill="none" stroke="#ffd177" stroke-width="3" stroke-dasharray="8 8"/>
            <circle cx="98" cy="150" r="5" fill="#ffffff"/>
            <circle cx="152" cy="82" r="5" fill="#ffffff"/>
            <circle cx="266" cy="96" r="5" fill="#ffffff"/>
            <circle cx="222" cy="168" r="5" fill="#ffffff"/>
          `;
          break;
        case 'resize-handles':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161f"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223446"/>
            <rect x="76" y="68" width="184" height="104" rx="8" fill="#243648" stroke="#71b4fb" stroke-width="3"/>
            <rect x="88" y="80" width="160" height="80" rx="6" fill="#1a2734"/>
            <rect x="68" y="60" width="16" height="16" rx="4" fill="#ffd16d"/>
            <rect x="252" y="60" width="16" height="16" rx="4" fill="#ffd16d"/>
            <rect x="68" y="164" width="16" height="16" rx="4" fill="#ffd16d"/>
            <rect x="252" y="164" width="16" height="16" rx="4" fill="#ffd16d"/>
            <path d="M278 52 L310 84 L292 88 L298 114 Z" fill="#fff0c9"/>
          `;
          break;
        case 'drag-layout':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1722"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223446"/>
            <rect x="32" y="48" width="296" height="148" rx="18" fill="#1a2837"/>
            <rect x="54" y="74" width="86" height="56" rx="12" fill="#69adfb"/>
            <rect x="158" y="96" width="98" height="62" rx="14" fill="#ffd173"/>
            <rect x="238" y="70" width="64" height="78" rx="12" fill="#7ad4af"/>
            <rect x="66" y="86" width="58" height="10" rx="5" fill="#eef5ff"/>
            <rect x="170" y="108" width="68" height="10" rx="5" fill="#25384d" opacity="0.9"/>
            <rect x="250" y="84" width="40" height="10" rx="5" fill="#18303f" opacity="0.9"/>
            <path d="M306 64 L326 94 L312 98 L316 118 Z" fill="#fff0ca"/>
          `;
          break;
        case 'primitives':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101722"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223546"/>
            <rect x="34" y="50" width="292" height="142" rx="18" fill="#172536"/>
            <path d="M70 70 V174 M120 70 V174 M170 70 V174 M220 70 V174 M270 70 V174" stroke="#324a64" stroke-width="2"/>
            <path d="M54 96 H306 M54 132 H306 M54 168 H306" stroke="#324a64" stroke-width="2"/>
            <path d="M78 88 L150 88" stroke="#78beff" stroke-width="4" stroke-linecap="round"/>
            <path d="M92 146 L154 168 L144 154 M154 168 L136 170" stroke="#ffd173" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M190 160 Q236 78 286 150" stroke="#77d9b4" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="190" cy="160" r="4" fill="#ffffff"/>
            <circle cx="236" cy="78" r="4" fill="#ffffff"/>
            <circle cx="286" cy="150" r="4" fill="#ffffff"/>
          `;
          break;
        case 'ui-menu':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#101721"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#223546"/>
            <rect x="36" y="54" width="288" height="20" rx="10" fill="#31485f"/>
            <rect x="48" y="58" width="46" height="12" rx="6" fill="#dbe7f6"/>
            <rect x="108" y="58" width="46" height="12" rx="6" fill="#dbe7f6"/>
            <rect x="168" y="58" width="46" height="12" rx="6" fill="#dbe7f6"/>
            <rect x="36" y="82" width="116" height="94" rx="18" fill="#172432" stroke="#456786" stroke-width="2"/>
            <rect x="56" y="102" width="74" height="12" rx="6" fill="#82c0ff"/>
            <rect x="56" y="126" width="60" height="12" rx="6" fill="#d9e6f7"/>
            <rect x="56" y="150" width="84" height="12" rx="6" fill="#ffc96d"/>
            <rect x="196" y="92" width="94" height="72" rx="16" fill="#223546"/>
            <circle cx="244" cy="128" r="20" fill="#f4c86c"/>
          `;
          break;
        case 'render':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#10161e"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#203245"/>
            <rect x="60" y="150" width="236" height="20" rx="10" fill="#394d67"/>
            <rect x="60" y="150" width="156" height="20" rx="10" fill="#61adff"/>
            <rect x="206" y="104" width="34" height="34" rx="10" fill="#f7bf61"/>
          `;
          break;
        case 'system-info':
          svgMarkup = `
            <rect x="14" y="16" width="332" height="188" rx="20" fill="#0f1620"/>
            <rect x="14" y="16" width="332" height="28" rx="20" fill="#213447"/>
            <rect x="36" y="54" width="288" height="34" rx="16" fill="#355674"/>
            <rect x="36" y="102" width="88" height="86" rx="16" fill="#172433"/>
            <rect x="136" y="102" width="88" height="86" rx="16" fill="#1d3044"/>
            <rect x="236" y="102" width="88" height="86" rx="16" fill="#172433"/>
            <rect x="50" y="124" width="60" height="10" rx="5" fill="#dfe9f8"/>
            <rect x="50" y="150" width="44" height="12" rx="6" fill="#6cb8ff"/>
            <rect x="150" y="124" width="60" height="10" rx="5" fill="#dfe9f8"/>
            <rect x="150" y="150" width="58" height="12" rx="6" fill="#ffd26f"/>
            <rect x="250" y="124" width="60" height="10" rx="5" fill="#dfe9f8"/>
            <rect x="250" y="150" width="52" height="12" rx="6" fill="#7fd6a5"/>
            <rect x="70" y="78" width="124" height="8" rx="4" fill="#eaf3ff"/>
            <rect x="198" y="78" width="84" height="8" rx="4" fill="#9fc3e8"/>
          `;
          break;
        default:
          return renderSdl3ReadyExampleFallbackPreview(example);
      }

      return `
        <figure class="sdl3-ready-example-shot">
          <svg viewBox="0 0 360 220" role="img" aria-label="${escapeAttribute(title)}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="360" height="220" rx="24" fill="#0b1016"/>
            ${svgMarkup}
          </svg>
          <figcaption>${escapeHtml(title)}</figcaption>
        </figure>
      `;
    }

    return {
      renderSdl3ReadyExampleFallbackPreview,
      renderSdl3ReadyExamplePreview
    };
  }

  global.__ARABIC_VULKAN_SDL3_READY_EXAMPLE_PREVIEW_RUNTIME__ = {
    createSdl3ReadyExamplePreviewRuntime
  };
})(window);
