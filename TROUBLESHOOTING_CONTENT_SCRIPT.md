# 🔍 Content Script 未加载问题诊断

## 问题现象

浏览器测试显示：
```
ReferenceError: handleGenerateImage is not defined
```

这说明 **Content Script 没有被加载到 Gemini 页面**。

## 🔧 解决方案

### 步骤1：完全重新加载插件

⚠️ **重要**：必须完全重新加载，不是刷新页面！

1. 打开 `chrome://extensions/`
2. 找到"大香蕉批量生图 (Nano Banana Flow)"
3. **先关闭插件**（点击开关）
4. **再打开插件**（点击开关）
5. 点击 **🔄 重新加载** 按钮
6. 检查是否有错误提示

### 步骤2：检查 Service Worker

1. 在插件卡片上，点击 "Service Worker"
2. 查看 Console，应该看到：
   ```
   🍌 Nano Banana Flow Service Worker 已启动
   🍌 Background Service Worker 监听器已注册
   ```
3. 如果有错误，记录下来

### 步骤3：硬刷新 Gemini 页面

1. 打开 `https://gemini.google.com/app`
2. 按 **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**) 硬刷新
3. 打开 Console (F12)
4. 查找：
   ```
   Gemini Auto PPT Generator: Content script loaded
   ```

### 步骤4：验证 Content Script

在 Gemini 页面的 Console 中执行：
```javascript
typeof handleGenerateImage
```

**期望结果：**
```
"function"
```

**如果返回 "undefined"：**
Content Script 没有加载，继续下一步。

### 步骤5：手动注入测试

在 Gemini 页面的 Console 中执行：
```javascript
console.log('Testing content script...');
console.log('isProcessing:', typeof isProcessing);
console.log('handleGenerateImage:', typeof handleGenerateImage);
console.log('inputPrompt:', typeof inputPrompt);
```

**期望结果：**
```
Testing content script...
isProcessing: "boolean"
handleGenerateImage: "function"
inputPrompt: "function"
```

## 🔍 常见问题

### 问题1：插件显示错误

**症状：**
- 插件卡片显示红色错误
- "Errors" 按钮可点击

**解决：**
1. 点击 "Errors" 查看详细错误
2. 如果是语法错误，检查 content.js
3. 如果是权限错误，检查 manifest.json

### 问题2：Service Worker 未启动

**症状：**
- 点击 "Service Worker" 没有反应
- 或显示 "inactive"

**解决：**
1. 完全移除插件
2. 重新加载插件
3. 刷新 Gemini 页面

### 问题3：Content Script 加载但函数未定义

**症状：**
- Console 显示 "Content script loaded"
- 但 `handleGenerateImage` 仍然 undefined

**解决：**
1. 检查 content.js 是否有语法错误
2. 运行：`node -c content.js`
3. 查看是否有未闭合的函数或括号

## 📝 完整检查清单

- [ ] 插件已重新加载
- [ ] 插件开关已打开
- [ ] 没有错误提示
- [ ] Service Worker 显示正常日志
- [ ] Gemini 页面已硬刷新
- [ ] Console 显示 "Content script loaded"
- [ ] `typeof handleGenerateImage` 返回 "function"
- [ ] 可以打开插件 Popup
- [ ] Popup 显示正常（无错误）

## 🚨 如果仍然失败

### 最后的手段：完全重新安装

1. **移除插件**
   - `chrome://extensions/`
   - 点击 "移除"

2. **清除缓存**
   - 关闭所有 Gemini 标签页
   - 清除浏览器缓存

3. **重新加载插件**
   - 点击 "加载已解压的扩展程序"
   - 选择插件目录

4. **测试**
   - 打开新的 Gemini 标签页
   - 检查 Console

## 📊 诊断命令

在插件目录运行：

```bash
# 检查语法
node -c content.js && echo "✅ content.js 语法正确"
node -c background.js && echo "✅ background.js 语法正确"
node -c popup.js && echo "✅ popup.js 语法正确"

# 检查文件大小
ls -lh content.js background.js popup.js

# 检查关键函数
grep -n "function handleGenerateImage" content.js
grep -n "function downloadImageAsync" content.js
grep -n "function inputPrompt" content.js
```

## 🎯 预期输出

```bash
✅ content.js 语法正确
✅ background.js 语法正确
✅ popup.js 语法正确

-rw-r--r--  1 user  staff   21K content.js
-rw-r--r--  1 user  staff   6.5K background.js
-rw-r--r--  1 user  staff   7.0K popup.js

26:async function handleGenerateImage(prompt, index, total) {
416:async function downloadImageAsync(index) {
98:async function inputPrompt(text) {
```

如果输出与预期不符，说明文件有问题。
