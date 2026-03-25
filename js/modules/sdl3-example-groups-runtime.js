(function(global) {
  'use strict';

  function createSdl3ExampleGroupsRuntime(api = {}) {
    const {
      getAppTextValue,
      SDL3_READY_EXAMPLES = [],
      isSdl3ExampleMovedToImgui = () => false,
      getSdl3BridgeExamples = () => []
    } = api;

    function getSdl3ReadyExamples(packageKey = '') {
      const normalizedPackageKey = String(packageKey || '').trim();
      const nativeExamples = SDL3_READY_EXAMPLES.filter((example) => {
        if (isSdl3ExampleMovedToImgui(example)) {
          return false;
        }
        return !normalizedPackageKey || example.packageKey === normalizedPackageKey;
      });

      return [
        ...nativeExamples,
        ...getSdl3BridgeExamples(normalizedPackageKey)
      ];
    }

    function getSdl3ExampleGroupMetaList(packageKey = 'core') {
      return getAppTextValue('SDL3_EXAMPLE_GROUP_META')?.[packageKey] || [
        {
          id: 'general',
          title: 'أمثلة عامة',
          description: 'يجمع أمثلة هذا الفرع من SDL3 داخل مسار واحد.'
        }
      ];
    }

    function inferSdl3ExampleGroupId(packageKey = 'core', example = {}) {
      const kind = String(example.previewKind || '').trim();
      const id = String(example.id || '').trim();

      switch (packageKey) {
        case 'core':
          if (/^imgui-/.test(kind) || /imgui/i.test(id)) return 'imgui-integration';
          if (/^(window|input|button|render)$/.test(kind)) return 'window-loop-input';
          if (/^(ui-drag|ui-hover|ui-collision|ui-color|sprite-pick|resize-handles|drag-layout)$/.test(kind)) return 'ui-interaction-canvas';
          if (/^(ui-move|ui-animation|world-camera|world-aabb|parallax)$/.test(kind)) return 'world-motion-camera';
          if (/^(wire-cube|perspective-quad|primitives)$/.test(kind)) return 'scene-3d-primitives';
          if (/^system-info$/.test(kind)) return 'system-inspection';
          return 'ui-interaction-canvas';
        case 'image':
          if (/^(image-drag|image-button|image-switch|image-background)$/.test(kind)) return 'image-interaction-layout';
          return 'image-loading-display';
        case 'mixer':
          if (/^(audio-gui|audio-dashboard)$/.test(kind)) return 'audio-feedback-interface';
          if (/^(audio-system|audio-state)$/.test(kind)) return 'audio-state-systems';
          return 'audio-playback-control';
        case 'audio':
          if (/^(audio-system|audio-format)$/.test(kind)) return 'audio-device-setup';
          if (/^(audio-playback|audio-callback)$/.test(kind)) return 'audio-playback-control';
          if (/^(audio-record)$/.test(kind)) return 'audio-capture';
          return 'audio-device-setup';
        case 'ttf':
          if (/^(text-counter|text-status)$/.test(kind)) return 'text-live-status';
          if (/^(text-button|text-input)$/.test(kind)) return 'text-interaction-input';
          return 'text-rendering-basics';
        default:
          return 'general';
      }
    }

    function getGroupedSdl3ReadyExamples(packageKey = 'core') {
      const examples = getSdl3ReadyExamples(packageKey);
      const metaList = getSdl3ExampleGroupMetaList(packageKey);
      const grouped = metaList.map((meta) => ({
        ...meta,
        examples: examples.filter((example) => inferSdl3ExampleGroupId(packageKey, example) === meta.id)
      })).filter((group) => group.examples.length);

      if (grouped.length) {
        return grouped;
      }

      return [{
        id: 'general',
        title: 'أمثلة عامة',
        description: 'يجمع أمثلة هذا الفرع داخل مسار واحد.',
        examples
      }].filter((group) => group.examples.length);
    }

    return {
      getSdl3ReadyExamples,
      getSdl3ExampleGroupMetaList,
      inferSdl3ExampleGroupId,
      getGroupedSdl3ReadyExamples
    };
  }

  global.__ARABIC_VULKAN_SDL3_EXAMPLE_GROUPS_RUNTIME__ = {
    createSdl3ExampleGroupsRuntime
  };
})(window);
