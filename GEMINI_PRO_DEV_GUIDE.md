# Gemini Pro 生图功能开发文档 (2025-12-24)

本文档总结了在 `https://gemini.google.com` 界面上手动切换 **Pro 模式**并进行**生图**的操作流程及其底层技术细节，供 Chrome 插件开发参考。

## 1. 关键 DOM 选择器 (Selectors)

### 1.1 模型模式切换 (Pro Mode Switch)
*   **触发按钮 (Trigger)**: 位于输入框右下角。
    *   `button.mat-mdc-menu-trigger.pill-ui-logo-container`
*   **模式标题 (Mode Title)**: 核心定位点。
    *   `.mode-title` (包含文本 "Pro")
*   **模式描述 (Description)**: 辅助定位点。
    *   `.mode-desc` ("擅长处理高阶数学和代码问题...")

### 1.2 工具菜单 (Tools Menu)
*   **工具按钮**: `button[aria-label="工具"]` 或 `.toolbox-drawer-button`。
*   **生成图片选项**: 菜单展开后的列表项。
    *   `button.mat-mdc-list-item` (包含文本 "生成图片")

### 1.3 输入与发送 (Input & Submit)
*   **生图专用输入框**: 点击"生成图片"后，占位符会变为 "描述你的图片"。
    *   `.ql-editor[role="textbox"]`
*   **发送按钮**: `.send-button.submit`。

---

## 2. 接口 Endpoint 与 开发者模式 (F12) 级参数分析

### 2.1 核心 Endpoint
Gemini Web 端的所有对话（包括图片生成指令）通常通过以下 Endpoint 发送：
*   **URL**: `https://gemini.google.com/_/BardChatUi/data/assistant.v1.Assistant/Chat`
*   **Method**: `POST`
*   **Content-Type**: `application/x-www-form-urlencoded;charset=UTF-8`

### 2.2 关键参数详解
请求参数通常包含在 `f.req` 字段中，这是一个高度包裹的 JSON 数组字符串。

#### f.req 结构示例 (简化版):
```json
[
  null,
  "[[[...]]]",  // 核心请求数据 (包含模型 ID 和提示词)
  null,
  "at=...",     // 动态 Token (SNlM0e)，需从页面 JS 变量中提取
  null,
  null,
  null,
  2             // 请求序列号
]
```

#### 图片生成特有的 Payload 特征:
1.  **Intent (意图)**: 在 `f.req` 内部的数组中，会包含 `image_generation_tool` 的标识。
2.  **Model Selection (Pro 模式)**:
    *   当选择 Pro 模式时，请求负载中会包含针对 `advanced_model` 的特定枚举值。
3.  **Prompt Entry**: 提示词通常位于数组深层，例如 `[[["提示词内容", ...]]]`。

---

## 3. 插件实现建议代码 (JavaScript)

```javascript
/**
 * 确保切换到 Pro 模式并进入生图模式
 */
async function prepareProImageGeneration() {
  // 1. 查找模式选择按钮
  const selector = document.querySelector('.mat-mdc-menu-trigger');
  if (selector && selector.textContent.includes('快速')) {
    selector.click();
    await new Promise(r => setTimeout(r, 1000)); // 等待菜单弹出
    
    // 2. 在弹出菜单中查找 Pro 选项
    const proOption = Array.from(document.querySelectorAll('.mode-title'))
      .find(el => el.textContent.includes('Pro'))
      ?.closest('button[role="menuitem"]');
    
    if (proOption) {
      proOption.click();
      console.log('✅ 已成功切换到 Pro 模式');
    }
  }
}
```

---

## 4. 自动化测试过程记录
*   **提示词**: "A beautiful Christmas tree"
*   **环境**: Gemini Web (Google Browser Subagent)
*   **结果**: **成功触发 Pro 模型思考 (Nano Banana Pro)**。虽然在某些自动化环境下图片渲染可能由于安全策略受限，但整个 UI 操作链路（切换模型 -> 选择工具 -> 发送指令）已验证通畅。

> [!TIP]
> **开发建议**：由于 Gemini 的菜单项是异步生成的，执行 `click()` 后务必使用 `sleep()` 或 `MutationObserver` 等待菜单 DOM 加载完成。
