# SVF シミュレーター - フォーム設計練習システム

## 📋 プロジェクト概要

SVF Simulatorは、SVF (Super Visual Formade) のフォーム設計フローを練習・学習するための純Webベースのシミュレーターです。

**特徴**:
- ✅ 純Web技術 (HTML/CSS/JavaScript)
- ✅ バックエンドサーバー不要
- ✅ オフライン使用可能
- ✅ ドラッグ&ドロップ式デザイナー
- ✅ データバインディング機能
- ✅ PDF出力サポート

---

## 🚀 クイックスタート

### デモサイト

**オンラインデモ**: https://YOUR-USERNAME.github.io/svf-simulator/

（デプロイ後、このURLを更新してください）

### ローカルで使用

**方法1: ワンクリック起動**
```bash
cd svf-simulator
./start.sh          # Mac/Linux
# または
start.bat           # Windows
```

**方法2: 直接開く**
- `index.html`をブラウザで開く

ブラウザで http://localhost:8000 にアクセス

---

## 🎨 使い方

### 1. フォームを設計

1. **コンポーネントをドラッグ**: 左側のパレットからキャンバスへ
2. **位置を調整**: コンポーネントをドラッグして配置
3. **サイズ変更**: 選択後、角をドラッグ
4. **プロパティ編集**: 右側のパネルで編集

**利用可能なコンポーネント**:
- 📝 テキストフィールド
- 🏷️ ラベル
- 📊 テーブル
- 🖼️ 画像
- 📠 バーコード
- 📱 QRコード
- ➖ 線
- ⬜ ボックス

### 2. データバインディング

1. コンポーネントを選択
2. プロパティパネルの「データバインディング」にフィールドパスを入力
3. 例: `header.po_number` または `items[0].material_name`

**データ形式例**:
```json
{
  "header": {
    "po_number": "PO-2026-001",
    "po_date": "2026-11-09",
    "vendor_name": "ABC商社"
  },
  "items": [
    {
      "material_code": "MAT-001",
      "material_name": "部品A",
      "quantity": 100
    }
  ]
}
```

### 3. プレビューとテスト

1. 下部の「データソース」タブに切り替え
2. テストデータを編集またはロード（JSON形式）
3. 「検証」ボタンでJSON形式をチェック
4. 「プレビュー」タブでデータ入力後の効果を確認

### 4. テンプレートの保存とロード

**保存**:
1. 上部の「💾 保存」ボタンをクリック
2. テンプレート名と説明を入力
3. ブラウザのLocalStorageに保存されます

**ロード**:
1. 上部の「📂 読込」ボタンをクリック
2. 保存済みテンプレートを選択

**エクスポート/インポート**:
- 📤 エクスポート: テンプレートをJSONファイルとして保存
- 📥 インポート: JSONファイルからテンプレートをロード

---

## ⌨️ キーボードショートカット

- `Ctrl/Cmd + S`: テンプレート保存
- `Ctrl/Cmd + Z`: 元に戻す
- `Ctrl/Cmd + Shift + Z`: やり直し
- `Delete/Backspace`: 選択したコンポーネントを削除
- `+`: ズームイン
- `-`: ズームアウト

---

## 📁 プロジェクト構造

```
svf-simulator/
│
├── index.html              # メインエントリー
│
├── css/                    # スタイルファイル
│   ├── main.css
│   ├── designer.css
│   └── components.css
│
├── js/                     # JavaScriptファイル
│   ├── app-ja.js          # 日本語版アプリロジック
│   ├── designer.js        # デザイナーコア
│   ├── utils.js           # ユーティリティ関数
│   └── ...
│
├── templates/              # サンプルテンプレート
│   └── examples/
│       └── po_form.json   # 発注書テンプレート
│
└── data/                   # サンプルデータ
    └── samples/
        └── po_data.json
```

---

## 🎯 実践例: 発注書（ZPOF001）の作成

### ステップ1: ヘッダーを設計

1. 「ラベル」コンポーネントをドラッグして「発注書」を入力
2. フォントサイズを24px、太字に設定
3. 「テキストフィールド」コンポーネントで発注番号を追加
4. データバインディング: `header.po_number`

### ステップ2: 基本情報を追加

以下のフィールドを追加（ラベル+テキストフィールドの組み合わせ）:
- 発注日: `header.po_date`
- 供給者名: `header.vendor_name`
- 供給者住所: `header.vendor_address`

### ステップ3: 明細テーブルを作成

1. 「テーブル」コンポーネントをドラッグ
2. 行数: 5、列数: 6に設定
3. ヘッダー: 行番号、品番、品名、数量、単価、金額
4. データバインディング: `items[]`配列

### ステップ4: 合計欄を追加

以下のフィールドを追加:
- 小計: `summary.subtotal`
- 消費税: `summary.tax_amount`
- 合計: `summary.total`

---

## 🌐 デプロイ

### GitHub Pagesへのデプロイ

詳細は [DEPLOY_GITHUB.md](DEPLOY_GITHUB.md) を参照してください。

**簡単な手順**:
```bash
# 1. GitHubリポジトリを作成
# 2. コードをプッシュ
git remote add origin https://github.com/YOUR-USERNAME/svf-simulator.git
git push -u origin main

# 3. GitHub Pagesを有効化（リポジトリ設定 > Pages）
```

アクセスURL: `https://YOUR-USERNAME.github.io/svf-simulator/`

---

## 🐛 トラブルシューティング

### 問題1: コンポーネントがドラッグできない
**解決策**: `interact.min.js`ライブラリが正しくロードされているか確認

### 問題2: テンプレートを保存できない
**解決策**: ブラウザのLocalStorageが無効化されていないか、または容量が一杯でないか確認

### 問題3: PDF出力が動作しない
**解決策**: `jspdf.min.js`ライブラリがロードされているか確認

### 問題4: プレビューにデータが表示されない
**解決策**: 
1. JSON形式が正しいか確認（「検証」ボタンをクリック）
2. データバインディングのフィールドパスが一致しているか確認

---

## 📚 参考資料

- **SVF公式資料**: （利用可能な場合）
- **interact.js ドキュメント**: https://interactjs.io/docs/
- **jsPDF ドキュメント**: https://artskydj.github.io/jsPDF/docs/

---

## 🤝 貢献

コードや提案の貢献を歓迎します！

1. このプロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成

---

## 📄 ライセンス

MIT License - 自由に使用・修正可能

---

## 🎓 トレーニング資料

### 初心者向け（30分）
1. 簡単な名刺デザインの作成
2. テキストと画像コンポーネントの追加
3. レイアウトとスタイルの調整

### データバインディング（45分）
1. サンプルデータのロード
2. フィールドとコンポーネントのバインディング
3. データ入力効果のプレビュー

### 複雑なフォーム（60分）
1. ZPOF001発注書の作成
2. テーブルコンポーネントの使用
3. 計算フィールドの追加

---

**バージョン**: v1.0  
**作成日**: 2026-11-09  
**最終更新**: 2026-11-09

---

**Happy Designing! 🎨**
