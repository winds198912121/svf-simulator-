# 大規模データ帳票作成ガイド

## 📋 目次
1. [基本的なワークフロー](#基本的なワークフロー)
2. [データ準備](#データ準備)
3. [実装方法](#実装方法)
4. [実践例](#実践例)
5. [パフォーマンス最適化](#パフォーマンス最適化)

---

## 基本的なワークフロー

### 🔄 処理フロー

```
┌─────────────────┐
│ 1. データ準備    │
│ (CSV/Excel)     │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 2. データ読込    │
│ (ファイル選択)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 3. プレビュー    │
│ (確認)          │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 4. 一括生成      │
│ (ループ処理)    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 5. PDF出力       │
│ (ダウンロード)  │
└─────────────────┘
```

---

## データ準備

### CSV フォーマット例

**発注書用データ (po_data.csv)**
```csv
po_number,po_date,vendor_name,vendor_address,material_name,quantity,unit_price,subtotal,tax,total
PO-001,2026-11-10,ABC商社,東京都渋谷区1-1-1,部品A,100,1500,150000,15000,165000
PO-002,2026-11-10,XYZ株式会社,大阪府大阪市2-2-2,部品B,200,2000,400000,40000,440000
PO-003,2026-11-10,DEF工業,愛知県名古屋市3-3-3,部品C,150,1800,270000,27000,297000
```

### Excel フォーマット

| po_number | po_date    | vendor_name | quantity | unit_price | total   |
|-----------|------------|-------------|----------|------------|---------|
| PO-001    | 2026-11-10 | ABC商社     | 100      | 1500       | 165000  |
| PO-002    | 2026-11-10 | XYZ株式会社 | 200      | 2000       | 440000  |
| PO-003    | 2026-11-10 | DEF工業     | 150      | 1800       | 297000  |

### JSON フォーマット

```json
[
  {
    "po_number": "PO-001",
    "po_date": "2026-11-10",
    "vendor_name": "ABC商社",
    "total": 165000
  },
  {
    "po_number": "PO-002",
    "po_date": "2026-11-10",
    "vendor_name": "XYZ株式会社",
    "total": 440000
  }
]
```

---

## 実装方法

### 方法1: JavaScript ループ処理

```javascript
// データ配列を1件ずつ処理
uploadedData.forEach((record, index) => {
    // テンプレートにデータを適用
    applyDataToTemplate(record);
    
    // PDF生成
    generatePDF(`PO-${record.po_number}.pdf`);
    
    // 進捗表示
    updateProgress(index + 1, uploadedData.length);
});
```

### 方法2: 明細行の展開

**1つの発注書に複数明細がある場合**

```javascript
// グループ化
const grouped = groupByPONumber(data);

// 各発注書ごとに処理
Object.keys(grouped).forEach(poNumber => {
    const items = grouped[poNumber];
    
    // 明細テーブルに複数行を展開
    renderItemsTable(items);
    
    // PDF生成
    generatePDF(`PO-${poNumber}.pdf`);
});
```

### 方法3: 条件分岐

```javascript
data.forEach(record => {
    // 金額で テンプレート切り替え
    const template = record.total >= 100000 
        ? 'high_value_template' 
        : 'standard_template';
    
    loadTemplate(template);
    applyData(record);
    generatePDF();
});
```

---

## 実践例

### 例1: 月次請求書の一括発行

**シナリオ**: 100件の顧客に月次請求書を発行

```javascript
// 1. 顧客データ読込
const customers = readCSV('customers.csv');

// 2. 各顧客ごとに処理
customers.forEach(customer => {
    // 3. 請求書テンプレート読込
    loadTemplate('invoice');
    
    // 4. データ適用
    const invoiceData = {
        invoice_number: `INV-${customer.id}-202611`,
        client_name: customer.name,
        client_address: customer.address,
        total: customer.monthly_charge
    };
    
    applyData(invoiceData);
    
    // 5. PDF生成
    generatePDF(`Invoice_${customer.id}.pdf`);
});
```

**処理時間**: 100件 × 0.5秒 = 約50秒

### 例2: 出荷ラベル印刷

**シナリオ**: 500個の商品ラベルを印刷

```javascript
// 1ページに複数ラベル配置
const LABELS_PER_PAGE = 10;
const products = readCSV('products.csv');

for (let i = 0; i < products.length; i += LABELS_PER_PAGE) {
    const batch = products.slice(i, i + LABELS_PER_PAGE);
    
    // ページ作成
    createPage();
    
    // ラベル配置
    batch.forEach((product, index) => {
        placeLabel(index, {
            product_code: product.code,
            product_name: product.name,
            barcode: generateBarcode(product.code)
        });
    });
    
    // PDF出力
    generatePDF(`Labels_Page_${Math.floor(i / LABELS_PER_PAGE) + 1}.pdf`);
}
```

### 例3: データ結合（マスタ参照）

**シナリオ**: 注文データ + 顧客マスタ

```javascript
// マスタデータ読込
const customerMaster = readCSV('customer_master.csv');
const orders = readCSV('orders.csv');

// 顧客マスタを辞書化
const customerDict = {};
customerMaster.forEach(c => {
    customerDict[c.customer_id] = c;
});

// 注文データに顧客情報を結合
orders.forEach(order => {
    const customer = customerDict[order.customer_id];
    
    const data = {
        po_number: order.po_number,
        customer_name: customer.name,
        customer_address: customer.address,
        customer_phone: customer.phone,
        items: order.items,
        total: order.total
    };
    
    applyData(data);
    generatePDF(`PO_${order.po_number}.pdf`);
});
```

---

## パフォーマンス最適化

### 1. バッチ処理

```javascript
// 10件ずつまとめて処理
const BATCH_SIZE = 10;

for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    
    await processBatch(batch);
    
    // 進捗表示
    console.log(`処理済み: ${i + batch.length} / ${data.length}`);
}
```

### 2. 並列処理

```javascript
// 複数のワーカーで並列実行
const workers = 4;
const chunkSize = Math.ceil(data.length / workers);

const promises = [];
for (let i = 0; i < workers; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    promises.push(processChunk(chunk));
}

await Promise.all(promises);
```

### 3. メモリ管理

```javascript
// 大量データは分割処理
if (data.length > 1000) {
    // ストリーム処理
    processInStream(data);
} else {
    // 通常処理
    processAll(data);
}
```

---

## ベストプラクティス

### ✅ やるべきこと

1. **事前チェック**
   - データ形式の検証
   - 必須フィールドの確認
   - 異常値のチェック

2. **エラーハンドリング**
   - try-catch で例外処理
   - エラーログの記録
   - 部分的な失敗に対応

3. **進捗表示**
   - プログレスバー表示
   - 処理件数の表示
   - 予想残り時間の表示

### ❌ 避けるべきこと

1. **全データをメモリに展開**
   - 大量データは分割処理

2. **同期処理のみ**
   - 適切に非同期処理を使用

3. **エラー時の全停止**
   - スキップして続行可能にする

---

## 実装サンプル

### 完全な実装例

```javascript
class BatchProcessor {
    constructor(template, data) {
        this.template = template;
        this.data = data;
        this.results = [];
        this.errors = [];
    }
    
    async process() {
        const total = this.data.length;
        
        for (let i = 0; i < total; i++) {
            try {
                const record = this.data[i];
                
                // データ適用
                const filled = this.applyTemplate(record);
                
                // PDF生成
                const pdf = await this.generatePDF(filled);
                
                this.results.push({
                    index: i,
                    record: record,
                    pdf: pdf,
                    status: 'success'
                });
                
                // 進捗通知
                this.notifyProgress(i + 1, total);
                
            } catch (error) {
                this.errors.push({
                    index: i,
                    record: this.data[i],
                    error: error.message
                });
            }
        }
        
        return {
            success: this.results.length,
            failed: this.errors.length,
            results: this.results,
            errors: this.errors
        };
    }
    
    applyTemplate(data) {
        // テンプレートにデータ適用
        // 実装詳細...
    }
    
    async generatePDF(content) {
        // PDF生成
        // 実装詳細...
    }
    
    notifyProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        console.log(`処理中: ${current}/${total} (${percent}%)`);
    }
}

// 使用例
const processor = new BatchProcessor(template, data);
const result = await processor.process();

console.log(`成功: ${result.success}件`);
console.log(`失敗: ${result.failed}件`);
```

---

## 次のステップ

1. ✅ バッチ処理ページを試す
   - https://winds198912121.github.io/svf-simulator-/batch-processing.html

2. ✅ サンプルCSVで練習

3. ✅ 実データで小規模テスト

4. ✅ 本番環境で大規模実行

---

**質問・サポート**

このガイドに関する質問は、GitHubのIssuesまでお願いします。
