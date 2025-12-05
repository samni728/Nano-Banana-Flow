# 🔧 故障排除指南

## 常见错误及解决方案

### ❌ 错误1："Could not establish connection. Receiving end does not exist"

**原因：** 插件的background service worker未正确响应

**解决方案：**
1. **重新加载插件**
   - 打开 `chrome://extensions/`
   - 找到"Gemini Auto PPT Generator"
   - 点击 🔄 "重新加载"按钮
   
2. **刷新Gemini页面**
   - 在Gemini页面按 `Cmd+R` (Mac) 或 `Ctrl+R` (Windows)
   - 重新打开插件

3. **检查Service Worker**
   - 在 `chrome://extensions/` 页面
   - 找到插件卡片
   - 点击"Service Worker"链接
   - 查看Console是否有错误

**已修复：** v1.0.1版本已自动处理此问题

---

### ❌ 错误2："无法找到输入框"

**原因：** Content script未能找到Gemini的输入框

**解决方案：**
1. **确认页面URL**
   - 必须在 `https://gemini.google.com/app` 页面
   - 不是 `https://gemini.google.com` 首页

2. **等待页面完全加载**
   - 确保Gemini聊天界面已完全显示
   - 可以看到输入框

3. **刷新页面重试**
   - 按 `Cmd+R` / `Ctrl+R` 刷新
   - 等待几秒后再使用插件

---

### ❌ 错误3："图片生成超时"

**原因：** 图片生成时间超过90秒

**解决方案：**
1. **检查网络连接**
   - 确保网络稳定
   - 尝试切换网络

2. **简化提示词**
   - 使用更简单的提示词
   - 避免过于复杂的描述

3. **重试**
   - 点击"清空"按钮
   - 重新输入提示词
   - 再次尝试

---

### ❌ 错误4："TabId未设置"

**原因：** 插件内部状态错误

**解决方案：**
1. **关闭并重新打开插件**
   - 点击插件图标关闭弹窗
   - 再次点击打开

2. **重新加载插件**
   - 在 `chrome://extensions/` 重新加载

---

### ❌ 错误5："请确保Gemini页面仍然打开"

**原因：** 在生成过程中关闭或切换了Gemini标签页

**解决方案：**
1. **保持Gemini页面打开**
   - 在生成过程中不要关闭Gemini标签页
   - 不要切换到其他标签页

2. **重新开始**
   - 确保在Gemini页面
   - 重新点击"开始生成"

---

## 调试技巧

### 查看Popup日志

1. 右键点击插件图标
2. 选择"检查弹出内容"
3. 切换到Console标签
4. 查看错误信息

### 查看Content Script日志

1. 在Gemini页面按 `F12` 打开开发者工具
2. 切换到Console标签
3. 查找以"Gemini Auto PPT Generator"开头的日志

### 查看Background日志

1. 打开 `chrome://extensions/`
2. 找到插件卡片
3. 点击"Service Worker"链接
4. 在Console标签查看日志

---

## 版本更新

### v1.0.1 更新内容

**修复的问题：**
- ✅ 修复"Could not establish connection"错误
- ✅ 自动注入content script
- ✅ 改进错误提示信息
- ✅ 添加tabId管理机制

**如何更新：**
1. 下载最新版本文件
2. 在 `chrome://extensions/` 点击"重新加载"

---

## 仍然有问题？

如果以上方法都无法解决问题，请：

1. **检查Chrome版本**
   - 确保使用Chrome 88或更高版本
   - 更新到最新版本

2. **检查权限**
   - 确保插件已启用
   - 检查是否被其他扩展程序冲突

3. **完全重新安装**
   ```
   1. 在chrome://extensions/移除插件
   2. 重启Chrome浏览器
   3. 重新加载插件
   ```

4. **联系支持**
   - 提交Issue到GitHub
   - 附上错误截图和Console日志

---

**祝您使用顺利！** 🎉
