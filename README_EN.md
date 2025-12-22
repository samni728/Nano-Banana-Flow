# 🍌 Nano Banana Flow

> **As long as the banana 🍌 works, generating images till dawn.**
>
> Batch Image Generation Tool for Gemini AI

[![Version](https://img.shields.io/badge/version-1.2.0-gold.svg)](https://github.com/AppleResearcher/Nano-Banana-Flow)
[![Chrome](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://github.com/AppleResearcher/Nano-Banana-Flow)

[中文文档](README.md)

A powerful Chrome extension that helps you batch generate images on Gemini and automatically download them.

## ✨ Features

- 🎨 **Batch Generation**: Input multiple prompts at once, automatically generate images one by one
- 📥 **Auto Download**: Generated images are automatically downloaded with sequential naming
- 📄 **TXT Import**: [v1.2.0+] Load bulk prompts from local .txt files with one click.
- 🖼️ **Image-to-Image**: [v1.2.0+] Support uploading local reference images with smart matching.
- 📊 **Real-time Progress**: Intuitive progress bar showing current generation status
- 💾 **Smart Save**: Automatically saves your last input prompts
- ⏹️ **Task Control**: Stop running tasks at any time

---

## 🚀 Usage Tips
### Import & Matching (New in v1.2.0)
1. **Prompt Import**: Click **[📄 Import]** to select a `.txt` file.
2. **Image Matching**:
   - Click **[🖼️ Image]** to batch select local images.
   - **Naming Rule**: Filenames must start with `LineNumber_`. E.g., `1_style.jpg` matches the 1st prompt.
   - **Multi-image**: Supports multiple images for a single line.

## 📦 Installation

### Load in Developer Mode

1. **Download the extension**
   - Clone this repository or download the ZIP file

2. **Open Chrome Extensions page**
   - Enter `chrome://extensions/` in Chrome address bar

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the extension folder

5. **Done!**
   - The extension icon will appear in Chrome toolbar
   - If not visible, click the puzzle icon 📌 to pin it

## 🚀 Usage

### Step 1: Open Gemini

Visit [https://gemini.google.com/app](https://gemini.google.com/app) and make sure you're logged in
> **Note**: v1.1.1 now fully supports Traditional Chinese interface (Hong Kong, Macau, Taiwan).

### Step 2: Prepare Prompts

Enter one prompt per line in the extension input box:

```
A cute cat sitting by the window
A golden retriever playing in the park
A blooming rose flower
```

### Step 3: Start Generation

1. Click the extension icon to open the interface
2. Paste or type your prompts (one per line)
3. Optional: Set save directory
4. Click the "🎨 Batch Generate" button
5. Wait for automatic generation and download

### Step 4: Check Results

- Images are automatically downloaded to your default download folder (or your specified directory)
- File naming format: `page1.png`, `page2.png`, `page3.png`...

## 🔧 FAQ

### Basic
- **Q: What does this tool do?**
  It allows you to input multiple prompts at once, automatically generating images one by one and downloading them locally, without manual intervention.
- **Q: How to input prompts?**
  One prompt per line.
- **Q: Filename format?**
  Sequential naming: `page1.png`, `page2.png`... Saved in your browser's default download folder.

### Troubleshooting
- **Q: Extension can't find the input field?**
  1. Ensure you are on `https://gemini.google.com/app`.
  2. **Refresh the page** (issues often occur if the input box hasn't loaded yet).
  3. Check if your network node redirects the URL.
- **Q: My interface is in Traditional Chinese?**
  Please upgrade to **v1.1.1** or higher (fixed compatibility). If issues persist, try temporarily switching your system/account language to English or Simplified Chinese.
- **Q: Files are downloaded as .html?**
  This is because the browser blocked automatic downloads. Click the "Lock" icon in the address bar -> Site Settings -> **Allow Automatic downloads**.
- **Q: Sidebar blocking the view?**
  Click the extension icon to toggle the sidebar. This won't interrupt the task.

### Downloads
*   **GitHub Releases**: [Download Here](https://github.com/AppleResearcher/Nano-Banana-Flow/releases) (Latest)
*   **Baidu Pan**: [Download](https://pan.baidu.com/s/1I9DMwu_NQVhAqIGeqgEa7g?pwd=saec) (Code: `saec`)
*   **Google Drive**: [Download](https://drive.google.com/file/d/1aK4ls54SSc64WcK56pQpYyKxoIEXIiUv/view?usp=sharing)

## 📁 Project Structure

```
Nano-Banana-Flow/
├── manifest.json      # Extension configuration
├── popup.html         # Popup interface
├── popup.css          # Styles
├── popup.js           # Popup logic
├── content.js         # Content script (core)
├── background.js      # Background service
├── icons/             # Icon assets
└── images/            # Theme images
```

## 🛠️ Tech Stack

- **Manifest V3**: Latest Chrome extension standard
- **Content Script**: DOM manipulation and page interaction
- **Service Worker**: Background task management
- **Chrome APIs**: Downloads API, Storage API

## 📝 Changelog

### v1.2.0 (2025-12-22)
- ✅ **TXT Import Support**: One-click bulk loading of prompts.
- ✅ **Image-to-Image Automation**: Match local reference images via filename line numbers.
- ✅ **Workflow Optimization**: Simulated image uploading with state detection for Gemini.

### v1.1.1 (2025-12-14)
- ✅ Added full support for Traditional Chinese (Hong Kong, Macau, Taiwan) interface
- ✅ Fixed issue where "Send" and "Stop" buttons were unrecognized in Traditional Chinese
- ✅ Added compatibility for URL parameters like `?hl=zh-TW`
- ⚠️ Note: Hong Kong, Macau, Taiwan regions tested; other regions pending verification

### v1.1.0 (2025-12-05)
- ✅ Fixed statusIndicator missing initialization error
- ✅ Enhanced message passing debug logs
- ✅ Optimized download flow error handling
- ✅ Cleaned up redundant code and documentation

### v1.0.1
- Initial release
- Batch image generation
- Auto download functionality
- Progress display

## 📄 License

MIT License

---

**Enjoy batch image generation!** 🍌
