# 下载模块重构说明 v1.1.0

## 重要提示

**请手动完成以下操作：**

1. 打开 `content.js` 文件
2. 找到第413-569行的旧下载函数：
   - `downloadImageAsync` (XHR/Blob/Canvas方案)
   - `tryFallbackDownload` (模拟点击方案)
3. **删除这些旧函数**
4. 将 `download_new.js` 中的新函数复制到相同位置

## 核心变更

### 1. Content.js
- ✅ 已恢复下载调用（第86-93行）
- ⚠️ 需手动替换 `downloadImageAsync` 函数
- ❌ 删除所有 XHR/Blob/Canvas/tryFallbackDownload 代码
- ✅ 新方案：=s0 高清图 URL 替换

### 2. Background.js
- ✅ 删除 `pendingFilenames` 变量
- ✅ 删除 `registerFilename` 处理
- ✅ 删除 `onDeterminingFilename` 监听器
- ✅ 新增 `handleHighQualityDownload` 函数
- ✅ 新增 `download_hq` 消息处理

## 新下载流程

```
1. Content: 定位图片 (lh3.googleusercontent.com)
2. Content: 筛选 (>300px, 非profile_photo)
3. Content: URL替换 (=w400-h400 → =s0)
4. Content: 发送 download_hq 消息
5. Background: chrome.downloads.download(高清URL)
6. 完成：原图质量，正确文件名
```

## 验证标准

- [ ] 文件大小 > 1MB (非13KB/94KB)
- [ ] 文件名为 page1.png, page2.png...
- [ ] 图片分辨率为原图尺寸
- [ ] 串行流程：生成→下载→下一张

## 如何应用

1. 完成手动替换 `content.js`
2. `chrome://extensions/` → 🔄重新加载
3. 刷新Gemini页面
4. 测试批量生成

## 技术细节

**URL替换逻辑：**
```javascript
// 方法1: =w400-h400 → =s0
url.replace(/=w\d+-h\d+/, '=s0')

// 方法2: =s1024 → =s0  
url.replace(/=s\d+/, '=s0')

// 方法3: 添加 =s0
url + '=s0'
```

**下载API：**
```javascript
chrome.downloads.download({
  url: highQualityUrl,
  filename: 'page1.png',
  saveAs: false,
  conflictAction: 'uniquify'
})
```
