(function(global) {
  'use strict';

  function createTreeRuntime(api = {}) {
    const {
      renderEntityIcon,
      vulkanData
    } = api;

    function countItems(obj) {
      let count = 0;
      Object.values(obj || {}).forEach((cat) => {
        count += (cat.items || []).length;
      });
      return count;
    }

    function generateTreeHTML() {
      let html = '<div class="tree-container">';

      html += `
        <div class="tree-category">
          <div class="tree-header" onclick="toggleTree(this)">
            <span class="tree-icon">📁</span>
            <span class="tree-title">${renderEntityIcon('command', 'ui-codicon list-icon', 'دوال')} Commands (${countItems(vulkanData.commands)})</span>
          </div>
          <div class="tree-items">
      `;

      Object.entries(vulkanData.commands || {}).forEach(([key, category]) => {
        html += `
          <div class="tree-subcategory">
            <div class="tree-subheader" onclick="toggleTree(this)">
              <span class="tree-icon">📂</span>
              <span>${category.title}</span>
              <span class="tree-count">(${(category.items || []).length})</span>
            </div>
            <div class="tree-leafs">
        `;

        (category.items || []).forEach((item) => {
          html += `
            <div class="tree-leaf" onclick="showCommand('${item.name}', '${key}')">
              <span class="leaf-icon">${renderEntityIcon('command', 'ui-codicon list-icon', 'دالة')}</span>
              <span class="leaf-name">${item.name}</span>
            </div>
          `;
        });

        html += '</div></div>';
      });

      html += '</div></div>';

      html += `
        <div class="tree-category">
          <div class="tree-header" onclick="toggleTree(this)">
            <span class="tree-icon">📁</span>
            <span class="tree-title">${renderEntityIcon('structure', 'ui-codicon list-icon', 'هياكل')} Structures (${countItems(vulkanData.structures)})</span>
          </div>
          <div class="tree-items">
      `;

      Object.entries(vulkanData.structures || {}).forEach(([key, category]) => {
        html += `
          <div class="tree-subcategory">
            <div class="tree-subheader" onclick="toggleTree(this)">
              <span class="tree-icon">📂</span>
              <span>${category.title}</span>
            </div>
            <div class="tree-leafs">
        `;

        (category.items || []).forEach((item) => {
          html += `
            <div class="tree-leaf" onclick="showStructure('${item.name}')">
              <span class="leaf-icon">${renderEntityIcon('structure', 'ui-codicon list-icon', 'هيكل')}</span>
              <span class="leaf-name">${item.name}</span>
            </div>
          `;
        });

        html += '</div></div>';
      });

      html += '</div></div>';

      html += `
        <div class="tree-category">
          <div class="tree-header" onclick="toggleTree(this)">
            <span class="tree-icon">📁</span>
            <span class="tree-title">${renderEntityIcon('enum', 'ui-codicon list-icon', 'تعدادات')} Enumerations (${countItems(vulkanData.enums)})</span>
          </div>
          <div class="tree-items">
      `;

      Object.entries(vulkanData.enums || {}).forEach(([key, category]) => {
        html += `
          <div class="tree-subcategory">
            <div class="tree-subheader" onclick="toggleTree(this)">
              <span class="tree-icon">📂</span>
              <span>${category.title}</span>
            </div>
            <div class="tree-leafs">
        `;

        (category.items || []).forEach((item) => {
          html += `
            <div class="tree-leaf" onclick="showEnum('${item.name}')">
              <span class="leaf-icon">${renderEntityIcon('enum', 'ui-codicon list-icon', 'تعداد')}</span>
              <span class="leaf-name">${item.name}</span>
            </div>
          `;
        });

        html += '</div></div>';
      });

      html += '</div></div>';

      html += `
        <div class="tree-category">
          <div class="tree-header" onclick="toggleTree(this)">
            <span class="tree-icon">📁</span>
            <span class="tree-title">${renderEntityIcon('constant', 'ui-codicon list-icon', 'ثوابت')} Constants (${countItems(vulkanData.constants)})</span>
          </div>
          <div class="tree-items">
      `;

      Object.entries(vulkanData.constants || {}).forEach(([key, category]) => {
        html += `
          <div class="tree-subcategory">
            <div class="tree-subheader" onclick="toggleTree(this)">
              <span class="tree-icon">📂</span>
              <span>${category.title}</span>
            </div>
            <div class="tree-leafs">
        `;

        (category.items || []).forEach((item) => {
          html += `
            <div class="tree-leaf" onclick="showConstant('${item.name}')">
              <span class="leaf-icon">${renderEntityIcon('constant', 'ui-codicon list-icon', 'ثابت')}</span>
              <span class="leaf-name">${item.name}</span>
            </div>
          `;
        });

        html += '</div></div>';
      });

      html += '</div></div></div>';
      return html;
    }

    return {
      countItems,
      generateTreeHTML
    };
  }

  global.createTreeRuntime = createTreeRuntime;
  global.__ARABIC_VULKAN_TREE_RUNTIME__ = {
    createTreeRuntime
  };
})(typeof window !== 'undefined' ? window : globalThis);
