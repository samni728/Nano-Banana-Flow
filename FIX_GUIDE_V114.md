# V1.1.4 修复说明：解决"启动失败"错误

## 🐛 问题诊断

**错误现象：**
- 点击"开始生成"后显示"启动失败：启动失败"
- Console可能显示重复声明错误

**根本原因：**
- `manifest.json` 已配置 `content_scripts` 自动注入
- `popup.js` 中仍有 `chrome.scripting.executeScript` 手动注入
- **导致 content.js 被注入两次**
- 全局变量（如 `isProcessing`, `isStopped`）重复声明冲突

## ✅ 已修复的问题

### 1. Popup.js ✅
**修复前（错误）：**
```javascript
// ❌ 重复注入 content.js
await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['content.js']
});
await new Promise(resolve => setTimeout(resolve, 500));
```

**修复后（正确）：**
```javascript
// ✅ 移除注入逻辑，直接发送消息
// manifest.json 已经自动注入 content.js
console.log('准备发送启动消息到 background...');
const response = await chrome.runtime.sendMessage({
  action: 'startGeneration',
  prompts: prompts,
  tabId: tab.id
});
```

### 2. Content.js ✅
- 修复了 `waitForIdle` 函数的语法错误
- 修复了第493行的注释格式
- 修复了变量声明错误

### 3. Manifest.json ✅
- 版本号更新为 1.1.4

## 🎯 修复要点

### 为什么移除 executeScript？

1. **Manifest V3 自动注入**
   ```json
   "content_scripts": [{
     "matches": ["https://gemini.google.com/*"],
     "js": ["content.js"],
     "run_at": "document_idle"
   }]
   ```
   - 当用户访问 Gemini 页面时，Chrome 自动注入 content.js
   - 无需手动注入

2. **重复注入的危害**
   ```javascript
   // 第一次注入（自动）
   let isProcessing = false; // ✅ 正常
   
   // 第二次注入（手动）
   let isProcessing = false; // ❌ 错误：重复声明
   ```
   - 导致 SyntaxError
   - 导致消息监听器重复注册
   - 导致状态管理混乱

## 🚀 应用更新

### 步骤1：重新加载插件

⚠️ **必须重新加载插件**，不是刷新页面！

1. 打开 `chrome://extensions/`
2. 找到"大香蕉批量生图"
3. 点击 **🔄 重新加载** 按钮

### 步骤2：刷新 Gemini 页面

1. 打开或刷新 `https://gemini.google.com/app`
2. 打开 Console（F12）
3. 应该看到：`Gemini Auto PPT Generator: Content script loaded`
4. **只应该出现一次**，不应该重复

### 步骤3：测试

1. 打开插件 Popup
2. 输入测试提示词
3. 点击"开始生成"
4. 应该正常启动，不再报错

## ✅ 验证清单

- [ ] Console 只显示一次 "Content script loaded"
- [ ] 点击"开始生成"不再报"启动失败"
- [ ] Console 显示 "准备发送启动消息到 background..."
- [ ] 任务正常启动
- [ ] 进度条正常显示

## 🔍 故障排查

### 如果仍然报错：

**1. 检查是否真的重新加载了插件**
- 不是刷新页面，是在 `chrome://extensions/` 点击重新加载
- 重新加载后，Service Worker 会重启

**2. 检查 Console 是否有重复加载**
```
✅ 正确：
Gemini Auto PPT Generator: Content script loaded (只出现1次)

❌ 错误：
Gemini Auto PPT Generator: Content script loaded
Gemini Auto PPT Generator: Content script loaded (出现2次)
```

**3. 完全移除并重新安装插件**
- 在 `chrome://extensions/` 点击"移除"
- 点击"加载已解压的扩展程序"
- 选择插件目录

## 📊 架构说明

### 正确的消息流

```
Popup                Background              Content
  │                      │                      │
  │  startGeneration     │                      │
  │─────────────────────>│                      │
  │                      │   generateImage      │
  │                      │─────────────────────>│
  │                      │                      │
  │                      │   (执行生成逻辑)     │
  │                      │                      │
  │                      │<─────────────────────│
  │  updateProgress      │                      │
  │<─────────────────────│                      │
```

### Content Script 注入时机

```
用户访问 Gemini
    ↓
Chrome 检测到 URL 匹配
    ↓
自动注入 content.js (manifest.json 配置)
    ↓
Content Script 就绪
    ↓
可以接收消息
```

## 🎉 预期结果

- ✅ 不再有"启动失败"错误
- ✅ 不再有重复声明错误
- ✅ 任务正常启动
- ✅ 进度正常显示
- ✅ 下载正常工作

## 📝 代码变更总结

| 文件 | 变更 | 行数变化 |
|------|------|----------|
| popup.js | 移除 executeScript | -13行 |
| content.js | 修复语法错误 | 格式化 |
| manifest.json | 版本号 1.1.4 | +1行 |

## 💡 最佳实践

**Manifest V3 中的 Content Script 注入：**

1. **优先使用 manifest.json 配置**
   - 自动注入，无需手动管理
   - 避免重复注入问题
   - 性能更好

2. **何时使用 executeScript？**
   - 只在需要动态注入时使用
   - 例如：用户点击后才注入到非匹配页面
   - 本插件不需要动态注入

3. **避免重复注入**
   - 如果 manifest 已配置，不要再用 executeScript
   - 如果必须用 executeScript，先检查是否已注入
