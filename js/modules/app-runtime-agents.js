(function (global) {
  const runtimeAgentRegistry = global.__ARABIC_VULKAN_RUNTIME_AGENTS__
    || (global.__ARABIC_VULKAN_RUNTIME_AGENTS__ = {});
  const runtimeAgentSources = Object.freeze({
    referenceInsights: {
      path: 'js/runtime/reference-insights-runtime.js'
    },
    tutorialUi: {
      path: 'js/runtime/tutorial-runtime.js',
      deps: ['referenceInsights']
    }
  });

  function createRuntimeAgentController(options = {}) {
    const instances = {};
    const promises = {};
    const loadDeferredScript = typeof options.loadDeferredScript === 'function'
      ? options.loadDeferredScript
      : async () => {};
    const warn = typeof options.warn === 'function'
      ? options.warn
      : (...args) => global.console?.warn?.(...args);

    function getRuntimeAgent(agentKey) {
      if (instances[agentKey]) {
        return instances[agentKey];
      }
      const instance = runtimeAgentRegistry[agentKey];
      if (instance) {
        instances[agentKey] = instance;
      }
      return instance || null;
    }

    async function ensureRuntimeAgent(agentKey) {
      const cached = getRuntimeAgent(agentKey);
      if (cached) {
        return cached;
      }
      if (promises[agentKey]) {
        return promises[agentKey];
      }

      const source = runtimeAgentSources[agentKey];
      if (!source?.path) {
        return null;
      }

      promises[agentKey] = (async () => {
        if (Array.isArray(source.deps)) {
          for (const dependency of source.deps) {
            await ensureRuntimeAgent(dependency);
          }
        }
        await loadDeferredScript(source.path, `runtime-agent-${agentKey}`);
        const instance = getRuntimeAgent(agentKey);
        if (!instance) {
          throw new Error(`تعذر تهيئة وكيل runtime ${agentKey}`);
        }
        return instance;
      })()
        .catch((error) => {
          warn(`تعذر تحميل وكيل runtime ${agentKey}:`, error);
          throw error;
        })
        .finally(() => {
          delete promises[agentKey];
        });

      return promises[agentKey];
    }

    function preloadRuntimeAgent(agentKey) {
      ensureRuntimeAgent(agentKey).catch(() => {});
    }

    function callRuntimeAgentMethod(agentKey, methodName, args = [], fallback) {
      const runtime = getRuntimeAgent(agentKey);
      if (runtime?.[methodName]) {
        try {
          return runtime[methodName](...args);
        } catch (error) {
          warn(`تعذر تنفيذ ${methodName} عبر وكيل runtime ${agentKey}:`, error);
        }
      }

      if (typeof fallback === 'function') {
        try {
          return fallback(...args);
        } catch (fallbackError) {
          warn(`تعذر تنفيذ بديل ${methodName}:`, fallbackError);
        }
      }

      return '';
    }

    return {
      getRuntimeAgent,
      ensureRuntimeAgent,
      preloadRuntimeAgent,
      callRuntimeAgentMethod
    };
  }

  global.__ARABIC_VULKAN_APP_RUNTIME_AGENTS__ = {
    createRuntimeAgentController
  };
})(window);
