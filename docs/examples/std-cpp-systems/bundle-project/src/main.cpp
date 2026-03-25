#include <filesystem>
#include <fstream>
#include <iostream>
#include <map>
#include <string>
#include <vector>

namespace fs = std::filesystem;

std::map<std::string, std::string> LoadKeyValueFile(const fs::path& filePath) {
    std::ifstream input(filePath);
    std::map<std::string, std::string> values;
    std::string line;

    while (std::getline(input, line)) {
        if (line.empty() || line[0] == '#') {
            continue;
        }

        const std::size_t equals = line.find('=');
        if (equals == std::string::npos) {
            continue;
        }

        const std::string key = line.substr(0, equals);
        const std::string value = line.substr(equals + 1);
        values[key] = value;
    }

    return values;
}

std::vector<std::string> LoadTextLines(const fs::path& filePath) {
    std::ifstream input(filePath);
    std::vector<std::string> lines;
    std::string line;

    while (std::getline(input, line)) {
        if (!line.empty()) {
            lines.push_back(line);
        }
    }

    return lines;
}

void MergeKeyValueFile(
    const fs::path& filePath,
    std::map<std::string, std::string>& target
) {
    if (!fs::exists(filePath)) {
        return;
    }

    for (const auto& [key, value] : LoadKeyValueFile(filePath)) {
        target[key] = value;
    }
}

int main() {
    const fs::path bundlesRoot = fs::current_path() / "resources" / "bundles";
    if (!fs::exists(bundlesRoot) || !fs::is_directory(bundlesRoot)) {
        std::cerr << "فشل العثور على مجلد bundles داخل resources/\n";
        return 1;
    }

    std::map<std::string, std::string> config;
    std::map<std::string, std::string> language;
    std::vector<std::string> menuEntries;
    std::vector<std::string> loadedBundles;

    for (const auto& entry : fs::directory_iterator(bundlesRoot)) {
        if (!entry.is_directory()) {
            continue;
        }

        const fs::path bundlePath = entry.path();
        loadedBundles.push_back(bundlePath.filename().string());

        // كل مجلد فرعي هنا يمثل bundle مستقلاً يمكن إضافته أو حذفه دون تعديل الكود.
        MergeKeyValueFile(bundlePath / "config.cfg", config);
        MergeKeyValueFile(bundlePath / "lang" / "ar.txt", language);

        const fs::path menuPath = bundlePath / "menu.txt";
        if (fs::exists(menuPath)) {
            const auto lines = LoadTextLines(menuPath);
            menuEntries.insert(menuEntries.end(), lines.begin(), lines.end());
        }
    }

    if (loadedBundles.empty()) {
        std::cerr << "لا توجد أي bundles داخل resources/bundles/\n";
        return 1;
    }

    const std::string appName = config.count("app_name") ? config.at("app_name") : "App";
    const std::string theme = config.count("theme") ? config.at("theme") : "default";
    const std::string languageCode = config.count("language") ? config.at("language") : "ar";
    const std::string welcome = language.count("welcome")
        ? language.at("welcome")
        : "مرحباً";

    std::cout << "=== Bundle Example ===\n";
    std::cout << "تم تحميل الحزم من المجلد resources/bundles/: ";
    for (std::size_t index = 0; index < loadedBundles.size(); ++index) {
        if (index > 0) {
            std::cout << ", ";
        }
        std::cout << loadedBundles[index];
    }
    std::cout << "\n";
    std::cout << "اسم التطبيق: " << appName << "\n";
    std::cout << "الثيم: " << theme << "\n";
    std::cout << "اللغة الحالية: " << languageCode << "\n";
    std::cout << "\n";

    std::cout << welcome << "\n";
    for (const std::string& item : menuEntries) {
        std::cout << "- " << item << "\n";
    }
    std::cout << "\n";

    std::cout << "هذا المثال يمثل bundle لأن البرنامج يعتمد على أكثر من مجلد موارد مرافقة له:\n";
    std::cout << "- core/config.cfg لإعدادات التطبيق الأساسية\n";
    std::cout << "- core/lang/ar.txt للنصوص المشتركة\n";
    std::cout << "- menu/menu.txt لقائمة مستقلة يمكن إضافتها أو حذفها\n";
    std::cout << "- يمكن إضافة bundle جديد داخل resources/bundles/ دون إعادة ترجمة البرنامج\n";

    return 0;
}
