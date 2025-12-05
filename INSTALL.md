# 🚀 Chrome插件安装指南

## 快速开始

### 第一步：打开Chrome扩展程序页面

1. 打开Chrome浏览器
2. 在地址栏输入：`chrome://extensions/`
3. 按回车键

或者：
- 点击Chrome右上角的 **⋮** (三个点)
- 选择 **更多工具** → **扩展程序**

### 第二步：启用开发者模式

在扩展程序页面的右上角，找到"开发者模式"开关，**打开它**。

![开发者模式](https://via.placeholder.com/600x100?text=Developer+Mode+Toggle)

### 第三步：加载插件

1. 点击页面左上角的 **"加载已解压的扩展程序"** 按钮
2. 在弹出的文件选择器中，导航到插件文件夹：
   ```
   /Users/gt/AI_Code/2.Antigravity Build/4.Nano Banana Pro Plugging
   ```
3. 选择该文件夹，点击 **"选择"**

### 第四步：验证安装

安装成功后，您应该看到：

✅ 插件卡片出现在扩展程序列表中  
✅ 显示插件名称：**Gemini Auto PPT Generator**  
✅ 显示版本号：**1.0.0**  
✅ 插件图标显示在Chrome工具栏（可能需要点击拼图图标📌来固定）

## 开始使用

### 1. 打开Gemini页面

访问：[https://gemini.google.com/app](https://gemini.google.com/app)

### 2. 点击插件图标

在Chrome工具栏找到 🥖 图标，点击打开插件界面

### 3. 输入提示词

在输入框中，每行输入一个提示词，例如：
```
一只可爱的猫咪
一只金毛犬
一朵玫瑰花
```

### 4. 开始生成

点击 **"🎨 开始生成"** 按钮，等待自动生成和下载！

## 常见问题

### ❓ 插件图标没有显示在工具栏？

**解决方法：**
1. 点击Chrome工具栏右侧的拼图图标 🧩
2. 找到"Gemini Auto PPT Generator"
3. 点击📌图标将其固定到工具栏

### ❓ 加载插件时出现错误？

**可能原因：**
- 文件夹路径不正确
- 文件缺失或损坏
- manifest.json格式错误

**解决方法：**
1. 确认选择的是包含`manifest.json`的文件夹
2. 检查所有文件是否完整：
   - manifest.json
   - popup.html, popup.css, popup.js
   - content.js, background.js
   - icons/ 文件夹

### ❓ 插件无法在Gemini页面工作？

**检查清单：**
- [ ] 确保在 `https://gemini.google.com/app` 页面
- [ ] 确保已登录Google账号
- [ ] 刷新Gemini页面后重试
- [ ] 检查浏览器控制台是否有错误（F12）

## 调试技巧

### 查看Popup日志
1. 右键点击插件图标
2. 选择"检查弹出内容"
3. 在Console标签查看日志

### 查看Content Script日志
1. 在Gemini页面按 F12 打开开发者工具
2. 切换到Console标签
3. 查找以"Gemini Auto PPT Generator"开头的日志

### 查看Background日志
1. 在 `chrome://extensions/` 页面
2. 找到插件卡片
3. 点击"Service Worker"链接
4. 在Console标签查看日志

## 更新插件

当您修改了插件代码后：

1. 在 `chrome://extensions/` 页面
2. 找到插件卡片
3. 点击 🔄 **"重新加载"** 按钮

## 卸载插件

1. 在 `chrome://extensions/` 页面
2. 找到插件卡片
3. 点击 **"移除"** 按钮

---

**祝您使用愉快！** 🎉

如有问题，请查看 [README.md](README.md) 或提交Issue。
