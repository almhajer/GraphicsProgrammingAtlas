#include "../src/plugin_api.hpp"

#include <iostream>

class SamplePlugin final : public PluginApi {
public:
    const char* Name() const override {
        return "SamplePlugin";
    }

    void Execute() override {
        std::cout << "SamplePlugin: يضيف رسالة ترحيب قادمة من مكتبة مستقلة.\n";
    }
};

extern "C" PluginApi* CreatePlugin() {
    return new SamplePlugin();
}

extern "C" void DestroyPlugin(PluginApi* plugin) {
    delete plugin;
}
