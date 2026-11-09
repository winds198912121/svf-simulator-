# GitHub Pages デプロイガイド

## 🚀 5分でデプロイ完了

### ステップ1: GitHubリポジトリを作成

1. **GitHub.comにアクセス**: https://github.com
2. **ログイン**（アカウントがない場合は作成）
3. **新しいリポジトリを作成**:
   - 右上の「+」→「New repository」をクリック
   - リポジトリ名: `svf-simulator`（または任意の名前）
   - 公開/非公開: **Public**（無料でGitHub Pages使用）
   - 「Create repository」をクリック

### ステップ2: コードをプッシュ

GitHubに表示される手順に従います：

```bash
# 既にgit initは完了しているので、リモートを追加
cd svf-simulator
git remote add origin https://github.com/YOUR-USERNAME/svf-simulator.git

# プッシュ
git push -u origin main
```

**注意**: `YOUR-USERNAME`を自分のGitHubユーザー名に置き換えてください

### ステップ3: GitHub Pagesを有効化

1. GitHubリポジトリページで「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. **Source**セクションで:
   - Branch: `main`を選択
   - Folder: `/root`を選択
4. 「Save」をクリック

### ステップ4: デプロイ完了を待つ

- 通常1-2分でデプロイ完了
- ページが表示されます: `https://YOUR-USERNAME.github.io/svf-simulator/`

---

## 🎉 完了！

アクセスURL: **https://YOUR-USERNAME.github.io/svf-simulator/**

このURLをチームメンバーと共有すれば、誰でもアクセスできます。

---

## 📝 更新方法

コードを変更した後:

```bash
cd svf-simulator
git add .
git commit -m "更新内容の説明"
git push origin main
```

数分後、GitHub Pagesが自動的に更新されます。

---

## 🔧 トラブルシューティング

### エラー: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/svf-simulator.git
```

### エラー: "git push rejected"
```bash
git pull origin main --rebase
git push origin main
```

### ページが404エラー
- 5-10分待ってから再度アクセス
- リポジトリ設定でGitHub Pagesが有効になっているか確認

### ライブラリが読み込まれない
index.htmlはCDN版を使用しているので問題ありません。
もし問題があれば、ブラウザのコンソール（F12）でエラーを確認してください。

---

## 🌐 カスタムドメイン（オプション）

独自ドメイン（例: svf.yourcompany.com）を使用する場合:

1. GitHub Pages設定で「Custom domain」に入力
2. DNSレコードを設定:
   ```
   CNAME svf YOUR-USERNAME.github.io
   ```

詳細: https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## 📊 アクセス統計（オプション）

Google Analyticsを追加する場合、`index.html`の`</head>`前に追加:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔒 プライベートアクセス

GitHub Pagesを非公開にする場合（GitHub Pro/Enterpriseが必要）:

1. リポジトリをPrivateに設定
2. GitHub Pages設定で公開範囲を調整

無料プランの場合は、Basic認証などを使用してアクセス制限を追加できます。

---

## 💡 ヒント

- **ブランチ戦略**: `main`は本番環境、`dev`は開発環境として使用
- **自動デプロイ**: `main`にマージすると自動的にデプロイ
- **バージョン管理**: タグを使用してバージョンを管理
  ```bash
  git tag -a v1.0 -m "Version 1.0"
  git push origin v1.0
  ```

---

**デプロイ完了後、このURLを共有してください！** 🎉

https://YOUR-USERNAME.github.io/svf-simulator/
