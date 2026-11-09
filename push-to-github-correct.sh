#!/bin/bash

echo "🚀 推送到 svf-simulator- 仓库"
echo ""

# 添加正确的远程仓库
git remote add origin https://github.com/winds198912121/svf-simulator-.git 2>/dev/null || \
git remote set-url origin https://github.com/winds198912121/svf-simulator-.git

echo "✓ 远程仓库已配置为: svf-simulator-"
echo ""
echo "正在推送代码..."
echo ""
echo "请输入GitHub认证信息："
echo "  Username: winds198912121"
echo "  Password: Personal Access Token (不是密码！)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║              ✅ 推送成功！                              ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "📋 下一步："
    echo ""
    echo "1. 访问: https://github.com/winds198912121/svf-simulator-/settings/pages"
    echo ""
    echo "2. 在 Source 部分选择："
    echo "   Branch: main"
    echo "   Folder: / (root)"
    echo ""
    echo "3. 点击 Save"
    echo ""
    echo "4. 等待 1-2 分钟"
    echo ""
    echo "5. 你的网站地址:"
    echo "   https://winds198912121.github.io/svf-simulator-/"
    echo ""
    echo "════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "需要 Personal Access Token:"
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. 勾选 'repo'"
    echo "4. 复制token并使用它作为密码"
    echo ""
fi
