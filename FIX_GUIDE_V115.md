# V1.1.5 紧急修复：恢复 Background 任务队列

## 🐛 问题诊断

**现象：**
- Console 只显示1次 "Content script loaded" ✅
- 但仍然显示"启动失败: 启动失败" ❌

**根本原因：**
- V1.1.3 简化 background.js 时，**删除了 `startGeneration` 处理逻辑**
- Popup 发送 `startGeneration` 消息
- Background 没有处理该消息
- 返回 undefined
- Popup 收到 undefined → "启动失败"

## ✅ 已修复

### Background.js 恢复完整功能

**缺失的代码（已恢复）：**
```javascript
// --- 处理启动生成请求 ---
if (request.action === 'startGeneration') {
  console.log('[BG] 启动生成任务，提示词数量:', request.prompts.length);
  
  if (isProcessing) {
    sendResponse({ success: false, error: '已有任务正在执行中' });
    return false;
  }
  
  // 保存 tabId
  currentTabId = request.tabId;
  
  // 初始化任务队列
  taskQueue = request.prompts.map((prompt, index) => ({
    prompt,
    index: index + 1,
    total: request.prompts.length,
    status: 'pending'
  }));
  
  currentTaskIndex = 0;
  isProcessing = true;
  
  // 开始处理队列
  processQueue();
  
  sendResponse({ success: true }); // ✅ 关键：返回成功
  return false;
}
```

## 🎯 完整架构

### 消息流
```
Popup                    Background                Content
  │                          │                        │
  │  startGeneration         │                        │
  │─────────────────────────>│                        │
  │                          │ 初始化队列             │
  │                          │ processQueue()         │
  │<─────────────────────────│                        │
  │  {success: true}         │                        │
  │                          │                        │
  │                          │  generateImage         │
  │                          │───────────────────────>│
  │                          │                        │ 执行生成
  │                          │<───────────────────────│
  │                          │  {success: true}       │
  │                          │                        │
  │  updateProgress          │                        │
  │<─────────────────────────│                        │
```

### Background 职责
1. ✅ 接收 `startGeneration` 并初始化队列
2. ✅ 管理任务队列（串行执行）
3. ✅ 向 Content Script 发送 `generateImage`
4. ✅ 处理 `download_hq` 下载请求
5. ✅ 通知 Popup 进度更新

## 🚀 应用更新

### 步骤1：重新加载插件

1. 打开 `chrome://extensions/`
2. 找到"大香蕉批量生图"
3. 点击 **🔄 重新加载** 按钮
4. 检查 Service Worker 状态

### 步骤2：刷新 Gemini 页面

1. 刷新 `https://gemini.google.com/app`
2. 打开 Console（F12）

### 步骤3：测试

1. 打开插件 Popup
2. 输入测试提示词
3. 点击"开始生成"
4. 检查 Console 输出

## ✅ 成功标志

### Console 应该显示：
```
🍌 Nano Banana Flow Service Worker 已启动
🍌 Background Service Worker 监听器已注册
Gemini Auto PPT Generator: Content script loaded
准备发送启动消息到 background...
[BG] 收到消息: startGeneration
[BG] 启动生成任务，提示词数量: 2
[BG] 处理任务 1/2: 一只可爱的猫
```

### Popup 应该显示：
- 进度条
- "正在生成第 1 张图片..."
- **不再显示"启动失败"**

## 📊 版本历史

| 版本 | 问题 | 状态 |
|------|------|------|
| 1.1.3 | 连接断开 | ✅ 已修复 |
| 1.1.4 | 启动失败（重复注入） | ✅ 已修复 |
| 1.1.5 | 启动失败（缺少处理） | ✅ 已修复 |

## 🔍 调试技巧

### 如何检查 Background 是否正常

1. 打开 `chrome://extensions/`
2. 找到插件，点击 "Service Worker"
3. 查看 Console 输出
4. 应该看到：
   ```
   🍌 Nano Banana Flow Service Worker 已启动
   🍌 Background Service Worker 监听器已注册
   ```

### 如何检查消息是否到达 Background

在 Service Worker Console 中：
```javascript
// 应该看到这些日志
[BG] 收到消息: startGeneration
[BG] 启动生成任务，提示词数量: X
```

如果没有看到，说明消息没有到达 Background。

## 🎉 预期结果

- ✅ 不再有"启动失败"错误
- ✅ 任务队列正常工作
- ✅ 串行生成稳定
- ✅ 进度显示正常
- ✅ 下载功能正常

现在应该可以正常使用了！
