#!/bin/bash
# 一键修复脚本 - 替换 downloadImageAsync 函数

echo "🔧 开始修复 content.js..."

# 备份原文件
cp content.js content.js.backup
echo "✅ 已备份原文件为 content.js.backup"

# 使用 sed 删除第416-492行（旧的 downloadImageAsync 函数）
sed -i.tmp '416,492d' content.js
echo "✅ 已删除旧函数"

# 在第415行后插入新函数
sed -i.tmp '415r download_fixed.js' content.js
echo "✅ 已插入新函数"

# 清理临时文件
rm -f content.js.tmp

echo "🎉 修复完成！"
echo ""
echo "请执行以下步骤："
echo "1. 打开 chrome://extensions/"
echo "2. 点击 🔄 重新加载插件"
echo "3. 刷新 Gemini 页面"
echo "4. 测试生成功能"
