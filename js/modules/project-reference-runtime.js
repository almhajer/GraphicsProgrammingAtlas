(function initProjectReferenceRuntime(global) {
  'use strict';

  function createProjectReferenceRuntime(deps = {}) {
    const {
      resolveReferenceNavigation,
      findEnumOwnerOfValue,
      getEnumValueAnchorId,
      buildEnumValueTooltip,
      getCmakeReferenceAlias,
      buildCmakeEntryTooltip,
      findCmakeSearchEntryByName,
      buildTooltipText,
      findCommandItemByName,
      findMacroItemByName,
      findConstantItemByName,
      findItemInCategories,
      findTypeItemByName,
      vulkanData,
      buildEnumItemTooltip,
      getCppReferenceItem,
      buildCppReferenceTooltip,
      buildExternalReferenceTooltip,
      sanitizeTooltipText,
      safeRenderEntityLabel,
      escapeAttribute,
      escapeHtml,
      getNavigationEntityIconType,
      getExternalReferenceUrl,
      resolveReferenceIconType
    } = deps;

    function resolveProjectReferenceAlias(name, options = {}) {
      const raw = String(name || '').trim();
      if (!raw) {
        return null;
      }

      if (resolveReferenceNavigation(raw)) {
        return {targetName: raw, label: raw};
      }

      const aliasMap = {
        'vk::Instance': 'VkInstance',
        'vk::Device': 'VkDevice',
        'vk::Queue': 'VkQueue',
        'vk::Buffer': 'VkBuffer',
        'vk::Image': 'VkImage',
        'vk::ImageView': 'VkImageView',
        'vk::Sampler': 'VkSampler',
        'vk::Pipeline': 'VkPipeline',
        'vk::PipelineLayout': 'VkPipelineLayout',
        'vk::RenderPass': 'VkRenderPass',
        'vk::Framebuffer': 'VkFramebuffer',
        'vk::DescriptorSetLayout': 'VkDescriptorSetLayout',
        'vk::DescriptorPool': 'VkDescriptorPool',
        'vk::DescriptorSet': 'VkDescriptorSet',
        'vk::CommandBuffer': 'VkCommandBuffer',
        'vk::CommandPool': 'VkCommandPool',
        'vk::SwapchainKHR': 'VkSwapchainKHR',
        'vk::SurfaceKHR': 'VkSurfaceKHR',
        'vk::Result': 'VkResult',
        'vk::Format': 'VkFormat',
        'vk::ImageLayout': 'VkImageLayout',
        'vk::ApplicationInfo': 'VkApplicationInfo',
        'vk::InstanceCreateInfo': 'VkInstanceCreateInfo',
        'vk::DeviceCreateInfo': 'VkDeviceCreateInfo',
        'vk::createInstance': 'vkCreateInstance',
        'vk::createDevice': 'vkCreateDevice',
        'vk::Queue::submit': 'vkQueueSubmit',
        'vk::Device::waitIdle': 'vkDeviceWaitIdle',
        'vk::raii::Instance': 'VkInstance',
        'vk::raii::Device': 'VkDevice',
        'vk::raii::Context': 'VkInstance'
      };

      const mapped = aliasMap[raw];
      if (mapped && resolveReferenceNavigation(mapped)) {
        return {targetName: mapped, label: raw};
      }

      const enumValueMatch = findEnumOwnerOfValue(raw, options.preferredEnumName || options.currentItem?.name || '');
      if (enumValueMatch) {
        return {
          targetName: enumValueMatch.enumItem.name,
          label: raw,
          anchorId: getEnumValueAnchorId(enumValueMatch.enumItem.name, raw),
          tooltip: buildEnumValueTooltip(enumValueMatch.enumItem, enumValueMatch.row),
          relationKind: 'enumValue'
        };
      }

      return null;
    }

    function buildNavigationTooltipForName(name, navigation) {
      if (!navigation) {
        return buildExternalReferenceTooltip(name);
      }

      if (navigation.type === 'cmake') {
        const alias = navigation.semanticAlias || getCmakeReferenceAlias(name);
        const resolvedName = alias?.targetName || name;
        const baseTooltip = alias?.tooltip || buildCmakeEntryTooltip(findCmakeSearchEntryByName(resolvedName, navigation.kind || '')) || resolvedName;
        if (!alias) {
          return baseTooltip;
        }
        if (alias.anchorId) {
          return `${baseTooltip}\nسبب الربط هنا: ${name} كلمة مفتاحية أو قيمة مرتبطة بصياغة ${resolvedName}، لذلك يأخذك الرابط إلى موضعها المشرح داخل الصفحة المناسبة.`;
        }
        return `${baseTooltip}\nسبب الربط هنا: ${name} يدخل ضمن هذا المفهوم أو هذا التعبير في CMake ولا يُوثق كصفحة مستقلة في هذا الموضع.`;
      }
      if (navigation.type === 'command') {
        return buildTooltipText('function', findCommandItemByName(name)) || name;
      }
      if (navigation.type === 'macro') {
        return buildTooltipText('macro', findMacroItemByName(name)) || name;
      }
      if (navigation.type === 'constant') {
        return buildTooltipText('constant', findConstantItemByName(name)) || name;
      }
      if (navigation.type === 'type') {
        const enumItem = findItemInCategories(vulkanData.enums, name);
        if (enumItem) {
          return buildEnumItemTooltip(enumItem) || name;
        }
        return buildTooltipText('type', findTypeItemByName(name)) || name;
      }
      if (navigation.type === 'cpp') {
        const cppItem = getCppReferenceItem(name);
        return cppItem ? buildCppReferenceTooltip(cppItem) : name;
      }

      return name;
    }

    function appendTooltipContext(baseTooltip = '', contextLine = '') {
      const normalizedBase = sanitizeTooltipText(baseTooltip);
      const normalizedContext = sanitizeTooltipText(contextLine);

      if (!normalizedContext) return normalizedBase;
      if (!normalizedBase) return normalizedContext;
      if (normalizedBase.includes(normalizedContext)) return normalizedBase;
      return `${normalizedBase}\n${normalizedContext}`;
    }

    function buildReferenceTooltipContextLine(name, options = {}) {
      const label = String(name || 'هذا العنصر').trim() || 'هذا العنصر';
      if (options.tooltipContext === 'reference-summary') {
        return `سبب الإدراج: ذُكر ${label} صراحة داخل المثال الحالي لتسهيل الوصول إلى صفحته المحلية.`;
      }
      if (options.tooltipContext === 'note') {
        const currentName = String(options.currentItem?.name || '').trim();
        if (currentName) {
          return `دوره هنا: ورد ${label} في هذه الملاحظة لأنه يرتبط مباشرة بالمسار الذي يشرحه ${currentName}.`;
        }
        return `دوره هنا: ورد ${label} في هذه الملاحظة لأنه جزء من السياق البرمجي الجاري شرحه.`;
      }
      return '';
    }

    function buildContextualReferenceTooltip(name, baseTooltip = '', options = {}) {
      return appendTooltipContext(baseTooltip, buildReferenceTooltipContextLine(name, options));
    }

    function renderContextualTokenLink(token = '', {
      href = '#',
      onclick = '',
      tooltip = '',
      iconType = '',
      className = 'related-link code-token',
      title = '',
      staticElement = false
    } = {}) {
      const text = String(token || '').trim();
      if (!text) return '';

      const content = iconType
        ? safeRenderEntityLabel(text, iconType, {code: true})
        : escapeHtml(text);
      const decoratedClassName = iconType && !className.includes('entity-link-with-icon')
        ? `${className} entity-link-with-icon`
        : className;
      const escapedTooltip = escapeAttribute(tooltip);
      const escapedAria = escapeAttribute(`${text}: ${String(tooltip || text).replace(/\n/g, ' - ')}`);
      const titleAttr = title ? ` title="${escapeAttribute(title)}"` : '';

      if (staticElement) {
        return `<span class="${decoratedClassName}" data-tooltip="${escapedTooltip}" tabindex="0" aria-label="${escapedAria}"${titleAttr}>${content}</span>`;
      }

      return `<a href="${escapeAttribute(href)}" class="${decoratedClassName}" data-tooltip="${escapedTooltip}" tabindex="0" aria-label="${escapedAria}"${titleAttr} onclick="${onclick}; return false;">${content}</a>`;
    }

    function resolveAliasBaseTooltip(alias, fallbackName = '', navigation = null) {
      const targetName = alias?.targetName || fallbackName;
      return alias?.tooltip || buildNavigationTooltipForName(targetName, navigation) || alias?.label || fallbackName || targetName || '';
    }

    function resolveProjectAliasTooltip(alias, options = {}) {
      const navigation = options.navigation || resolveReferenceNavigation(alias?.targetName);
      return options.tooltipOverride || resolveAliasBaseTooltip(alias, alias?.label || alias?.targetName || '', navigation);
    }

    function getProjectAliasAnchorIconType(alias) {
      if (alias?.iconType) return alias.iconType;
      if (alias?.relationKind === 'enumValue') return 'constant';
      return '';
    }

    function getProjectAliasLinkIconType(navigation, targetName = '') {
      return getNavigationEntityIconType(navigation, targetName);
    }

    function buildProjectAliasAnchorOnclick(alias, navigation = null, currentItem = null) {
      const anchorId = String(alias?.anchorId || '').trim();
      if (!anchorId) return '';

      const samePage = currentItem?.name && currentItem.name === alias.targetName;
      if (alias?.relationKind === 'cmakeParameter') {
        if (samePage) return `scrollToAnchor('${anchorId}')`;
        return navigation?.type === 'cmake'
          ? `${navigation.command}; setTimeout(() => scrollToAnchor('${anchorId}'), 30)`
          : `scrollToAnchor('${anchorId}')`;
      }
      if (samePage) return `scrollToAnchor('${anchorId}')`;
      return `showEnum('${alias.targetName}'); setTimeout(() => scrollToAnchor('${anchorId}'), 30)`;
    }

    function buildProjectAliasElement(alias, options = {}) {
      if (!alias) return '';

      const labelText = String(alias.label || alias.targetName || '').trim();
      const className = options.className || 'related-link';
      const navigation = options.navigation || resolveReferenceNavigation(alias.targetName);
      const tooltip = String(resolveProjectAliasTooltip(alias, {...options, navigation}) || labelText).trim();
      const isInlineCodeReference = /\binline-code-reference\b/.test(className);

      if (options.anchorId) {
        return renderContextualTokenLink(labelText, {
          href: `#${options.anchorId}`,
          onclick: options.onclick || `scrollToAnchor('${options.anchorId}')`,
          tooltip,
          iconType: options.iconType || '',
          className
        });
      }

      if (options.staticElement || !navigation) {
        const staticClassName = isInlineCodeReference
          ? (/\binline-code-reference-static\b/.test(className) ? className : `${className} inline-code-reference-static`)
          : (navigation ? className : `${className} related-link-static`);
        return renderContextualTokenLink(labelText, {
          tooltip,
          iconType: options.iconType || '',
          className: staticClassName,
          staticElement: true
        });
      }

      return renderContextualTokenLink(labelText, {
        tooltip,
        iconType: options.iconType || '',
        className,
        onclick: options.onclick || navigation.command
      });
    }

    function buildProjectAliasLink(alias, options = {}) {
      if (!alias) return '';
      const className = options.className || 'related-link';
      const navigation = resolveReferenceNavigation(alias.targetName);
      const tooltip = resolveProjectAliasTooltip(alias, {...options, navigation});

      if (alias.anchorId) {
        return buildProjectAliasElement(alias, {
          className,
          navigation,
          tooltipOverride: tooltip,
          anchorId: alias.anchorId,
          onclick: buildProjectAliasAnchorOnclick(alias, navigation, options.currentItem || null),
          iconType: getProjectAliasAnchorIconType(alias)
        });
      }

      return buildProjectAliasElement(alias, {
        className,
        navigation,
        tooltipOverride: tooltip,
        iconType: navigation ? getProjectAliasLinkIconType(navigation, alias.targetName) : '',
        staticElement: !navigation
      });
    }

    function buildReferenceTooltip(name, navigation = null, fallback = '') {
      const text = String(name || fallback || '').trim();
      const resolvedNavigation = navigation || (text ? resolveReferenceNavigation(text) : null);
      if (resolvedNavigation) {
        return buildNavigationTooltipForName(text, resolvedNavigation) || text;
      }
      const externalUrl = getExternalReferenceUrl(text);
      if (externalUrl) {
        return buildExternalReferenceTooltip(text) || text;
      }
      return String(fallback || text || '').trim();
    }

    function renderRelatedReferenceLink(name, options = {}) {
      const alias = resolveProjectReferenceAlias(name, options);
      if (alias) {
        const aliasNavigation = resolveReferenceNavigation(alias.targetName);
        const baseTooltip = resolveAliasBaseTooltip(alias, name, aliasNavigation);
        return buildProjectAliasLink(alias, {
          className: 'related-link',
          currentItem: options.currentItem || null,
          tooltipOverride: buildContextualReferenceTooltip(alias.label || name, baseTooltip, options)
        });
      }

      const navigation = resolveReferenceNavigation(name);
      if (!navigation) {
        const fallbackTooltip = buildContextualReferenceTooltip(name, buildReferenceTooltip(name, null, `مرجع محلي مرتبط بالعنصر الحالي: ${name}`), options);
        return renderContextualTokenLink(name, {
          tooltip: fallbackTooltip,
          className: 'related-link related-link-static',
          staticElement: true
        });
      }

      const iconType = getNavigationEntityIconType(navigation, name);
      const tooltip = buildContextualReferenceTooltip(name, buildNavigationTooltipForName(name, navigation) || name, options);
      return renderContextualTokenLink(name, {
        tooltip,
        iconType,
        className: 'related-link',
        onclick: navigation.command
      });
    }

    function renderProjectReferenceChip(name, options = {}) {
      const alias = resolveProjectReferenceAlias(name, options);
      if (!alias) {
        return renderContextualTokenLink(name, {
          tooltip: buildExternalReferenceTooltip(name),
          className: 'related-link related-link-static',
          staticElement: true
        });
      }
      return buildProjectAliasLink(alias, {
        className: 'related-link',
        currentItem: options.currentItem || null
      });
    }

    function renderProjectReferenceInline(name, options = {}) {
      const alias = resolveProjectReferenceAlias(name, options);
      if (!alias) {
        return `<code>${escapeHtml(name)}</code>`;
      }
      return buildProjectAliasLink(alias, {
        className: 'doc-link',
        currentItem: options.currentItem || null
      });
    }

    function renderProjectReferenceLink(name, options = {}) {
      const alias = resolveProjectReferenceAlias(name, options);
      if (!alias) return '';
      const navigation = resolveReferenceNavigation(alias.targetName);
      const baseTooltip = resolveAliasBaseTooltip(alias, name, navigation);
      return buildProjectAliasLink(alias, {
        className: 'related-link reference-summary-link',
        currentItem: options.currentItem || null,
        tooltipOverride: buildContextualReferenceTooltip(alias.label || name, baseTooltip, options)
      });
    }

    function renderAnalysisReference(name, currentItem = null, options = {}) {
      const text = options.label || name;
      const currentName = currentItem?.name || '';
      const samePageAnchor = options.samePageAnchor || 'page-meaning-anchor';
      const selfIconType = currentName && name === currentName
        ? resolveReferenceIconType(name, options)
        : '';
      const inlineAnalysisClassName = selfIconType
        ? 'inline-code-reference code-token analysis-inline-link entity-link-with-icon'
        : 'inline-code-reference code-token analysis-inline-link';
      const resolvedTooltip = String(options.tooltip || buildReferenceTooltip(name, null, text)).trim();
      const tooltipAttr = resolvedTooltip
        ? ` data-tooltip="${escapeAttribute(resolvedTooltip)}" tabindex="0" aria-label="${escapeAttribute(`${text}: ${resolvedTooltip.replace(/\n/g, ' - ')}`)}"`
        : '';

      if (name && currentName && name === currentName) {
        return `<a href="#${samePageAnchor}" class="${inlineAnalysisClassName}" ${tooltipAttr} onclick="scrollToAnchor('${samePageAnchor}'); return false;">${selfIconType ? safeRenderEntityLabel(text, selfIconType, {code: true}) : escapeHtml(text)}</a>`;
      }

      if (options.anchorId) {
        const anchorIconType = resolveReferenceIconType(name, options);
        const content = anchorIconType ? safeRenderEntityLabel(text, anchorIconType, {code: true}) : escapeHtml(text);
        const className = anchorIconType
          ? 'inline-code-reference code-token analysis-inline-link entity-link-with-icon'
          : 'inline-code-reference code-token analysis-inline-link';
        return `<a href="#${escapeAttribute(options.anchorId)}" class="${className}" ${tooltipAttr} onclick="scrollToAnchor('${escapeAttribute(options.anchorId)}'); return false;">${content}</a>`;
      }

      const navigation = resolveReferenceNavigation(name);
      if (!navigation) {
        return `<code class="code-token"${tooltipAttr}>${escapeHtml(text)}</code>`;
      }

      const iconType = getNavigationEntityIconType(navigation, name);
      const className = iconType
        ? 'inline-code-reference code-token analysis-inline-link entity-link-with-icon'
        : 'inline-code-reference code-token analysis-inline-link';
      return `<a href="#" class="${className}" ${tooltipAttr} onclick="${navigation.command}; return false;">${iconType ? safeRenderEntityLabel(text, iconType, {code: true}) : escapeHtml(text)}</a>`;
    }

    function renderUsageBridgeToken(token, options = {}) {
      const usageBridgeClassName = options.inlineNarrative
        ? 'inline-code-reference code-token usage-bridge-link usage-bridge-inline-link'
        : 'related-link code-token usage-bridge-link';

      const alias = resolveProjectReferenceAlias(token, options);
      if (alias) {
        const aliasNavigation = resolveReferenceNavigation(alias.targetName);
        const baseTooltip = resolveAliasBaseTooltip(alias, token, aliasNavigation);
        return buildProjectAliasLink(alias, {
          className: usageBridgeClassName,
          currentItem: options.currentItem || null,
          tooltipOverride: buildContextualReferenceTooltip(alias.label || token, baseTooltip, options)
        });
      }

      const navigation = resolveReferenceNavigation(token);
      if (!navigation) {
        if (/^(vk|Vk|VK_)/.test(token)) {
          const tooltip = buildContextualReferenceTooltip(token, buildReferenceTooltip(token, null, token), options);
          const iconType = /^VK_/.test(token) ? 'constant' : (/^Vk/.test(token) ? 'structure' : 'command');
          return renderContextualTokenLink(token, {
            tooltip,
            iconType,
            className: options.inlineNarrative
              ? `${usageBridgeClassName} inline-code-reference-static entity-link-with-icon`
              : `${usageBridgeClassName} related-link-static entity-link-with-icon`,
            staticElement: true
          });
        }
        return escapeHtml(token);
      }

      let kind = '';
      let item = null;
      if (navigation.type === 'command') {
        kind = 'function';
        item = findCommandItemByName(token);
      } else if (navigation.type === 'macro') {
        kind = 'macro';
        item = findMacroItemByName(token);
      } else if (navigation.type === 'constant') {
        kind = 'constant';
        item = findConstantItemByName(token);
      } else if (navigation.type === 'type') {
        kind = 'type';
        item = findTypeItemByName(token);
      }

      const tooltip = buildContextualReferenceTooltip(token, buildTooltipText(kind, item) || token, options);
      const iconType = getNavigationEntityIconType(navigation, token);
      const className = iconType ? `${usageBridgeClassName} entity-link-with-icon` : usageBridgeClassName;
      return renderContextualTokenLink(token, {
        tooltip,
        iconType,
        className,
        onclick: navigation.command
      });
    }

    return {
      resolveProjectReferenceAlias,
      buildNavigationTooltipForName,
      appendTooltipContext,
      buildReferenceTooltipContextLine,
      buildContextualReferenceTooltip,
      renderContextualTokenLink,
      resolveAliasBaseTooltip,
      resolveProjectAliasTooltip,
      buildProjectAliasAnchorOnclick,
      buildProjectAliasElement,
      renderRelatedReferenceLink,
      getRelatedReferenceIconType: (navigation, name = '') => getNavigationEntityIconType(navigation, name),
      getProjectAliasAnchorIconType,
      getProjectAliasLinkIconType,
      getProjectReferenceIconType: (navigation, name = '') => getNavigationEntityIconType(navigation, name),
      buildProjectAliasLink,
      buildReferenceTooltip,
      renderProjectReferenceLink,
      renderProjectReferenceChip,
      renderProjectReferenceInline,
      renderAnalysisReference,
      renderUsageBridgeToken
    };
  }

  global.__ARABIC_VULKAN_PROJECT_REFERENCE_RUNTIME__ = Object.freeze({
    createProjectReferenceRuntime
  });
})(window);
