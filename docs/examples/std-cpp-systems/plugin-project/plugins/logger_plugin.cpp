#include "../src/plugin_api.hpp"

#include <iostream>

class LoggerPlugin final : public PluginApi {
public:
    const char* Name() const override {
        return "LoggerPlugin";
    }

    void Execute() override {
        std::cout << "LoggerPlugin: يسجل رسالة تنفيذ تجريبية من إضافة مستقلة.\n";
    }
};

extern "C" PluginApi* CreatePlugin() {
    return new LoggerPlugin();
}

extern "C" void DestroyPlugin(PluginApi* plugin) {
    delete plugin;
}
