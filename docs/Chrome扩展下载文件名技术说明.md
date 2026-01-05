# Chrome 扩展下载文件名控制技术说明

> 本文档记录了在 Nano-Banana-Flow 项目中实现"去水印后保留原文件名"功能时遇到的技术问题和最终解决方案。

---

## 📋 需求描述

用户上传图片（如 `unnamed.png`）进行去水印处理后，期望下载的文件名为 `unnamed_wr.png`，而不是随机生成的 UUID 或通用名称（如 `下载.png`）。

---

## 🚧 遇到的问题

### 问题 1：Data URL 导致 filename 被忽略

**现象**：使用 `chrome.downloads.download` API 并指定 `filename` 参数，但下载的文件名始终是 `下载.png`。

**代码示例（不工作）**：
```javascript
const dataUrl = canvas.toDataURL('image/png');
chrome.downloads.download({
  url: dataUrl,
  filename: 'my_custom_name.png'  // 被忽略！
});
```

**原因**：这是 Chrome 的一个**已知 Bug**（[Chromium Issue](https://bugs.chromium.org/p/chromium/issues/detail?id=373182)）。当 `url` 是 `data:` URI 时，Chrome 会忽略 `filename` 参数，使用默认名称。

---

### 问题 2：Blob URL 跨上下文无法访问

**现象**：将 Data URL 改为 Blob URL 后，filename 仍然是随机 UUID。

**代码示例（不工作）**：
```javascript
// popup.js
const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
const blobUrl = URL.createObjectURL(blob);

// 发送给 background.js
chrome.runtime.sendMessage({
  action: 'download',
  url: blobUrl,
  filename: 'my_custom_name.png'
});
```

```javascript
// background.js
chrome.downloads.download({
  url: request.url,      // blob:chrome-extension://xxx/yyy
  filename: request.filename
});
```

**原因**：`URL.createObjectURL()` 创建的 Blob URL **只在创建它的上下文中有效**。popup.js 和 background.js 运行在不同的上下文中，background.js 无法访问 popup.js 创建的 Blob，因此 Chrome 回退到默认命名。

---

## ✅ 最终解决方案

**核心思路**：不经过 `background.js`，直接在 popup.js 中使用 `<a download>` 标签触发下载。

**最终代码**：
```javascript
// popup.js - Watermark Lab 核心逻辑

// 1. 将 Canvas 转为 Blob
const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, 1.0));
const blobUrl = URL.createObjectURL(blob);

// 2. 构造文件名：原文件名 + _wr + 原扩展名
const fileName = file.name;                                    // "unnamed.png"
const lastDotIndex = fileName.lastIndexOf('.');
const baseName = fileName.substring(0, lastDotIndex);          // "unnamed"
const originalExt = fileName.substring(lastDotIndex + 1);      // "png"
const cleanName = `${baseName}_wr.${originalExt}`;             // "unnamed_wr.png"

// 3. 使用 <a download> 触发下载（关键！）
const downloadLink = document.createElement('a');
downloadLink.href = blobUrl;
downloadLink.download = cleanName;     // 这里指定文件名
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);

// 4. 延迟释放 Blob URL（等下载开始后）
setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
```

---

## 🔑 关键技术点

| 方法 | 是否支持自定义文件名 | 备注 |
|------|---------------------|------|
| `chrome.downloads.download` + Data URL | ❌ 不支持 | Chrome 已知 Bug |
| `chrome.downloads.download` + Blob URL (跨上下文) | ❌ 不支持 | Blob 无法跨上下文访问 |
| `chrome.downloads.download` + Blob URL (同上下文) | ✅ 支持 | 需要在 background.js 中创建 Blob |
| `<a download>` + Blob URL (同上下文) | ✅ 支持 | **推荐方案** |

---

## 📌 延伸知识

### 为什么批量下载可以使用自定义文件名？

批量下载功能使用的是**真实的网络 URL**（如 `https://lh3.googleusercontent.com/...`），而不是 Data URL 或 Blob URL。对于网络 URL，`chrome.downloads.download` 的 `filename` 参数正常工作。

### Manifest V3 的限制

在 Manifest V3 中，popup 页面的生命周期很短（用户点击其他地方就会关闭）。如果下载时间较长，可能需要考虑：
1. 使用 `chrome.downloads` API（适用于网络 URL）
2. 在 Service Worker 中处理（需要传递实际数据而非 Blob URL）
3. 使用 Offscreen Document（Manifest V3 新特性）

---

## 📁 相关文件

- `popup.js`: 去水印实验室核心逻辑，包含文件名处理和下载触发
- `background.js`: 处理批量下载请求（使用网络 URL）
- `lib/watermark.js`: 去水印算法引擎

---

## 📅 更新日志

| 日期 | 内容 |
|------|------|
| 2026-01-05 | 最终方案确定：使用 `<a download>` 直接下载 |
| 2026-01-05 | 发现 Blob URL 跨上下文问题 |
| 2026-01-04 | 发现 Data URL filename 被忽略问题 |

---

## 🔗 参考资料

- [Chromium Bug: Data URL ignores filename](https://bugs.chromium.org/p/chromium/issues/detail?id=373182)
- [MDN: URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [Chrome Downloads API](https://developer.chrome.com/docs/extensions/reference/downloads/)
