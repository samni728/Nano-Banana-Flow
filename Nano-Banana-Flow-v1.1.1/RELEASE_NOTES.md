# 🍌 Nano Banana Flow

### v1.1.1 (2025-12-14)
- ✅ 修复了繁体中文（台湾地区）环境下无法识别"发送"和"停止"按钮的问题
- ✅ 增加了对 `?hl=zh-TW` 等带参数 URL 的兼容性支持
- ✅ 优化了多语言环境下的 DOM 元素查找逻辑

### v1.1.0 (2025-12-05) Release Notes

> 🌟 **Perfect Edition / 完美版**
>
> This release brings significant stability improvements, bug fixes, and internationalization support.
> 本次更新带来了重要的稳定性改进、Bug 修复以及国际化支持。

## 📝 What's New / 更新内容

### 🐛 Bug Fixes / 修复
- **Fixed Initialization Error**: Resolved an issue where the popup would fail to initialize due to a missing `statusIndicator` element.
  - **修复初始化错误**：解决了因缺少 `statusIndicator` 元素导致弹窗界面无法初始化的问题。
- **Download Error Handling**: Improved error handling logic for image downloads to provide clearer feedback.
  - **下载错误处理**：优化了图片下载的错误处理逻辑，提供更清晰的反馈。

### ⚡ Improvements / 优化
- **Enhanced Debugging**: Added detailed logging for message passing between Background and Content scripts to facilitate easier debugging.
  - **增强调试日志**：增加了后台和内容脚本之间消息传递的详细日志，便于排查问题。
- **Code Cleanup**: Removed redundant documentation files and unused scripts to keep the project clean.
  - **代码清理**：删除了冗余的文档文件和未使用的脚本，保持项目整洁。

### 🌍 Documentation / 文档
- **Internationalization**: Added English `README.md` and moved the Chinese documentation to `README_CN.md`.
  - **国际化**：新增了英文版 `README.md`，并将中文文档移动至 `README_CN.md`。

---

## 📦 Installation / 安装说明

1. Download the `Source code (zip)` below.
   下载下方的 `Source code (zip)`。
2. Unzip the file.
   解压文件。
3. Open Chrome and navigate to `chrome://extensions/`.
   打开 Chrome 并访问 `chrome://extensions/`。
4. Enable **Developer mode** in the top right corner.
   在右上角开启 **开发者模式**。
5. Click **Load unpacked** and select the unzipped folder.
   点击 **加载已解压的扩展程序** 并选择解压后的文件夹。

---

**Enjoy Batch Image Generation! / 享受批量生图的乐趣！** 🍌
