#!/bin/bash
echo "================================================"
echo "  SVF Simulator - GitHub Pages デプロイ"
echo "================================================"
echo ""
echo "ステップ1: リモートリポジトリの設定"
echo ""
read -p "GitHubリポジトリを作成しましたか？ (y/n): " created

if [ "$created" != "y" ]; then
    echo ""
    echo "まず、以下でGitHubリポジトリを作成してください："
    echo "https://github.com/new"
    echo ""
    echo "リポジトリ名: svf-simulator"
    echo "Public を選択"
    echo ""
    exit 1
fi

echo ""
echo "ステップ2: コードをプッシュ"
echo ""
echo "リモートリポジトリを追加中..."
git remote add origin https://github.com/winds198912121/svf-simulator.git 2>/dev/null || echo "リモートは既に設定されています"

echo ""
echo "コードをプッシュ中..."
echo "GitHubの認証情報を入力してください："
echo "  Username: winds198912121"
echo "  Password: Personal Access Token (パスワードではありません)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "  ✅ プッシュ成功！"
    echo "================================================"
    echo ""
    echo "次のステップ："
    echo "1. https://github.com/winds198912121/svf-simulator にアクセス"
    echo "2. Settings → Pages をクリック"
    echo "3. Source を設定："
    echo "   - Branch: main"
    echo "   - Folder: / (root)"
    echo "4. Save をクリック"
    echo ""
    echo "1-2分後、以下のURLでアクセス可能："
    echo "https://winds198912121.github.io/svf-simulator/"
    echo ""
    echo "================================================"
else
    echo ""
    echo "エラーが発生しました。"
    echo ""
    echo "Personal Access Tokenを取得していますか？"
    echo "https://github.com/settings/tokens"
    echo ""
fi
