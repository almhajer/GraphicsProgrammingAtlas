#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>

namespace fs = std::filesystem;

std::string ReadWholeFile(const fs::path& filePath) {
    std::ifstream input(filePath);
    return std::string(
        (std::istreambuf_iterator<char>(input)),
        std::istreambuf_iterator<char>()
    );
}

int main() {
    const fs::path root = fs::current_path();
    const fs::path configPath = root / "data" / "app.cfg";
    const fs::path bannerPath = root / "data" / "banner.txt";

    if (!fs::exists(configPath) || !fs::exists(bannerPath)) {
        std::cerr << "هذا المثال يجب تشغيله من داخل مجلد التوزيع النهائي.\n";
        return 1;
    }

    std::cout << "=== Package Example ===\n";
    std::cout << "تم العثور على ملفات package داخل مجلد التوزيع الجاهز.\n\n";
    std::cout << ReadWholeFile(bannerPath) << "\n";
    std::cout << "محتوى app.cfg:\n";
    std::cout << ReadWholeFile(configPath) << "\n";
    std::cout << "هذا المثال يمثل package لأننا نجمع التنفيذي وملفاته معاً داخل مجلد توزيع واحد جاهز للتشغيل.\n";

    return 0;
}
