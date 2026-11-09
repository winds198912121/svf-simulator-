#!/bin/bash

echo "🚀 开始部署到GitHub..."
echo ""

# 添加远程仓库
git remote add origin https://github.com/winds198912121/svf-simulator.git 2>/dev/null || \
git remote set-url origin https://github.com/winds198912121/svf-simulator.git

echo "✓ 远程仓库已配置"
echo ""
echo "正在推送代码到GitHub..."
echo "请输入GitHub认证信息："
echo "  Username: winds198912121"
echo "  Password: 使用你的Personal Access Token（不是密码！）"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "  ✅ 成功推送到GitHub！"
    echo "================================================"
    echo ""
    echo "📋 下一步（在浏览器中完成）："
    echo ""
    echo "1. 访问: https://github.com/winds198912121/svf-simulator"
    echo ""
    echo "2. 点击 Settings（设置）"
    echo ""
    echo "3. 点击左侧 Pages"
    echo ""
    echo "4. 在Source部分选择："
    echo "   Branch: main"
    echo "   Folder: / (root)"
    echo ""
    echo "5. 点击 Save"
    echo ""
    echo "6. 等待1-2分钟"
    echo ""
    echo "7. 访问你的网站："
    echo "   https://winds198912121.github.io/svf-simulator/"
    echo ""
    echo "================================================"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 还没创建GitHub仓库"
    echo "   → 访问 https://github.com/new 创建"
    echo ""
    echo "2. Personal Access Token错误"
    echo "   → 访问 https://github.com/settings/tokens 重新生成"
    echo "   → 确保勾选了 'repo' 权限"
    echo ""
    echo "3. 用户名错误"
    echo "   → 确认你的GitHub用户名是 winds198912121"
    echo ""
fi
