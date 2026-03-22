#include "plugin_api.hpp"

#include <filesystem>
#include <iostream>
#include <memory>
#include <set>
#include <string>
#include <vector>

#ifdef _WIN32
#include <windows.h>
using LibraryHandle = HMODULE;
#else
#include <dlfcn.h>
using LibraryHandle = void*;
#endif

namespace fs = std::filesystem;

struct LoadedPlugin {
    LibraryHandle handle = nullptr;
    DestroyPluginFn destroy = nullptr;
    std::unique_ptr<PluginApi, DestroyPluginFn> plugin{nullptr, nullptr};
    std::string fileName;
};

LibraryHandle OpenLibrary(const std::string& filePath) {
#ifdef _WIN32
    return LoadLibraryA(filePath.c_str());
#else
    return dlopen(filePath.c_str(), RTLD_NOW);
#endif
}

void* LoadSymbol(LibraryHandle handle, const char* symbolName) {
#ifdef _WIN32
    return reinterpret_cast<void*>(GetProcAddress(handle, symbolName));
#else
    return dlsym(handle, symbolName);
#endif
}

void CloseLibrary(LibraryHandle handle) {
#ifdef _WIN32
    if (handle) {
        FreeLibrary(handle);
    }
#else
    if (handle) {
        dlclose(handle);
    }
#endif
}

std::vector<std::string> GetPluginExtensions() {
#ifdef _WIN32
    return {".dll"};
#elif __APPLE__
    return {".dylib", ".so"};
#else
    return {".so"};
#endif
}

bool IsPluginFile(const fs::path& filePath, const std::vector<std::string>& extensions) {
    const std::string extension = filePath.extension().string();
    for (const std::string& candidate : extensions) {
        if (extension == candidate) {
            return true;
        }
    }
    return false;
}

std::string GetPluginLogicalName(const fs::path& filePath) {
    std::string logicalName = filePath.stem().string();
    if (logicalName.rfind("lib", 0) == 0) {
        logicalName.erase(0, 3);
    }
    return logicalName;
}

int main() {
    const fs::path pluginsDirectory = fs::current_path() / "plugins";
    std::cout << "=== Plugin Example ===\n";
    std::cout << "البحث عن الإضافات داخل: " << pluginsDirectory.string() << "\n";

    if (!fs::exists(pluginsDirectory) || !fs::is_directory(pluginsDirectory)) {
        std::cerr << "مجلد plugins/ غير موجود.\n";
        return 1;
    }

    std::vector<LoadedPlugin> loadedPlugins;
    const std::vector<std::string> extensions = GetPluginExtensions();
    std::set<std::string> seenPluginNames;

    for (const auto& entry : fs::directory_iterator(pluginsDirectory)) {
        if (!entry.is_regular_file() || !IsPluginFile(entry.path(), extensions)) {
            continue;
        }

        const std::string logicalName = GetPluginLogicalName(entry.path());
        if (seenPluginNames.count(logicalName) > 0) {
            continue;
        }
        seenPluginNames.insert(logicalName);

        const std::string pluginPath = entry.path().string();
        LibraryHandle handle = OpenLibrary(pluginPath);
        if (!handle) {
            std::cerr << "فشل تحميل الإضافة: " << pluginPath << "\n";
            continue;
        }

        auto createPlugin = reinterpret_cast<CreatePluginFn>(LoadSymbol(handle, "CreatePlugin"));
        auto destroyPlugin = reinterpret_cast<DestroyPluginFn>(LoadSymbol(handle, "DestroyPlugin"));
        if (!createPlugin || !destroyPlugin) {
            std::cerr << "الإضافة لا تحتوي CreatePlugin أو DestroyPlugin: " << pluginPath << "\n";
            CloseLibrary(handle);
            continue;
        }

        std::unique_ptr<PluginApi, DestroyPluginFn> plugin(createPlugin(), destroyPlugin);
        if (!plugin) {
            std::cerr << "فشل إنشاء كائن الإضافة: " << pluginPath << "\n";
            CloseLibrary(handle);
            continue;
        }

        loadedPlugins.push_back(
            LoadedPlugin{
                handle,
                destroyPlugin,
                std::move(plugin),
                entry.path().filename().string()
            }
        );
    }

    if (loadedPlugins.empty()) {
        std::cerr << "لم يتم العثور على أي plugin صالح داخل plugins/.\n";
        return 1;
    }

    std::cout << "عدد الإضافات المحمّلة: " << loadedPlugins.size() << "\n";
    for (LoadedPlugin& loaded : loadedPlugins) {
        std::cout << "تم تحميل Plugin من الملف: " << loaded.fileName
                  << " باسم: " << loaded.plugin->Name() << "\n";
        loaded.plugin->Execute();
    }
    for (LoadedPlugin& loaded : loadedPlugins) {
        loaded.plugin.reset();
        CloseLibrary(loaded.handle);
    }

    std::cout << "هذا المثال يمثل plugin لأن السلوك جاء من عدة مكتبات مستقلة حُمّلت وقت التشغيل من مجلد واحد.\n";
    return 0;
}
