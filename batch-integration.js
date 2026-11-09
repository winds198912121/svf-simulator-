// SVF Simulator - バッチ処理統合スクリプト
// batch-processing.html と index.html の連携

class BatchIntegration {
    constructor() {
        this.batchData = null;
        this.currentIndex = 0;
        this.autoMode = false;
    }

    // バッチ処理ページから呼び出し
    sendToSVF(data) {
        // データをlocalStorageに保存
        localStorage.setItem('svf_batch_data', JSON.stringify(data));
        localStorage.setItem('svf_batch_mode', 'true');

        // SVFページに遷移
        window.location.href = 'index.html?mode=batch';
    }

    // SVFページで初期化
    initSVFBatchMode() {
        // URLパラメータをチェック
        const urlParams = new URLSearchParams(window.location.search);
        const isBatchMode = urlParams.get('mode') === 'batch';

        if (isBatchMode) {
            // バッチデータを読み込み
            const batchDataStr = localStorage.getItem('svf_batch_data');

            if (batchDataStr) {
                this.batchData = JSON.parse(batchDataStr);
                this.currentIndex = 0;
                this.autoMode = true;

                // バッチ処理UIを表示
                this.showBatchControls();

                // 自動開始（確認後）
                this.confirmAndStart();
            }
        }
    }

    showBatchControls() {
        const html = `
            <div id="batch-control-panel" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border: 2px solid #2563eb;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 10000;
                min-width: 300px;
            ">
                <h3 style="margin: 0 0 15px 0; color: #2563eb;">
                    🔄 バッチ処理モード
                </h3>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 24px; font-weight: bold; color: #1e293b;">
                        <span id="batch-current">0</span> / <span id="batch-total">0</span>
                    </div>
                    <div style="font-size: 12px; color: #64748b;">
                        処理進捗
                    </div>
                </div>

                <div id="batch-progress-bar" style="
                    width: 100%;
                    height: 20px;
                    background: #e5e7eb;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 15px;
                ">
                    <div id="batch-progress-fill" style="
                        height: 100%;
                        background: linear-gradient(90deg, #2563eb, #10b981);
                        width: 0%;
                        transition: width 0.3s;
                    "></div>
                </div>

                <div id="batch-current-record" style="
                    background: #f8fafc;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    font-size: 12px;
                ">
                    準備中...
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="batch-start-btn" class="btn btn-primary" style="flex: 1;">
                        ▶️ 開始
                    </button>
                    <button id="batch-pause-btn" class="btn btn-secondary" style="flex: 1; display: none;">
                        ⏸️ 一時停止
                    </button>
                    <button id="batch-stop-btn" class="btn btn-secondary" style="flex: 1;">
                        ⏹️ 停止
                    </button>
                </div>

                <div style="margin-top: 10px; font-size: 11px; color: #64748b;">
                    自動処理間隔: <span id="batch-interval">2</span>秒
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // 総数を表示
        document.getElementById('batch-total').textContent = this.batchData.length;

        // イベントバインド
        this.bindBatchEvents();
    }

    bindBatchEvents() {
        document.getElementById('batch-start-btn').addEventListener('click', () => {
            this.startBatchProcessing();
        });

        document.getElementById('batch-pause-btn').addEventListener('click', () => {
            this.pauseBatchProcessing();
        });

        document.getElementById('batch-stop-btn').addEventListener('click', () => {
            this.stopBatchProcessing();
        });
    }

    confirmAndStart() {
        const confirmed = confirm(
            `バッチ処理を開始しますか？\n\n` +
            `処理件数: ${this.batchData.length}件\n` +
            `テンプレート: ZPOF001\n\n` +
            `各レコードを2秒間隔で自動表示します。`
        );

        if (confirmed) {
            // 少し待ってから開始
            setTimeout(() => {
                this.startBatchProcessing();
            }, 1000);
        }
    }

    startBatchProcessing() {
        this.autoMode = true;

        // ボタン表示切替
        document.getElementById('batch-start-btn').style.display = 'none';
        document.getElementById('batch-pause-btn').style.display = 'block';

        // 処理開始
        this.processNextRecord();
    }

    processNextRecord() {
        if (!this.autoMode) return;
        if (this.currentIndex >= this.batchData.length) {
            this.completeBatchProcessing();
            return;
        }

        const record = this.batchData[this.currentIndex];

        // SVFアプリにデータを適用
        this.applyDataToSVF(record);

        // 進捗更新
        this.updateProgress();

        // 現在のレコード情報を表示
        this.showCurrentRecord(record);

        // 次のレコードへ
        this.currentIndex++;

        // 2秒後に次のレコード
        setTimeout(() => {
            this.processNextRecord();
        }, 2000);
    }

    applyDataToSVF(record) {
        // ZPOF001テンプレートを読み込み
        if (window.svfApp) {
            window.svfApp.loadPredefinedTemplate('ZPOF001');

            // データを適用
            const dataEditor = document.getElementById('data-editor');
            if (dataEditor) {
                const formattedData = this.formatRecordToJSON(record);
                dataEditor.value = JSON.stringify(formattedData, null, 2);

                // プレビューを更新
                window.svfApp.updatePreview();
            }
        }
    }

    formatRecordToJSON(record) {
        // CSVレコードをSVF用JSONに変換
        return {
            header: {
                form_title: "発注書",
                po_number: record.po_number || record.po_no || "PO-000",
                po_date: record.po_date || new Date().toISOString().split('T')[0],
                vendor_name: record.vendor_name || record.vendor || "供給者名",
                vendor_address: record.vendor_address || record.address || "住所"
            },
            items: [
                {
                    line_no: "001",
                    material_code: record.material_code || "MAT-001",
                    material_name: record.material_name || record.item_name || "商品名",
                    quantity: parseInt(record.quantity || record.qty || 1),
                    unit: record.unit || "個",
                    unit_price: parseInt(record.unit_price || record.price || 0),
                    amount: parseInt(record.amount || record.total || 0)
                }
            ],
            summary: {
                subtotal: parseInt(record.subtotal || record.amount || 0),
                tax_rate: 0.1,
                tax_amount: parseInt(record.tax_amount || record.tax || 0),
                total: parseInt(record.total || 0)
            }
        };
    }

    updateProgress() {
        const percent = Math.round((this.currentIndex / this.batchData.length) * 100);

        document.getElementById('batch-current').textContent = this.currentIndex;
        document.getElementById('batch-progress-fill').style.width = percent + '%';
    }

    showCurrentRecord(record) {
        const display = document.getElementById('batch-current-record');
        display.innerHTML = `
            <strong>処理中:</strong><br>
            ${record.po_number || record.po_no || 'N/A'} -
            ${record.vendor_name || record.vendor || 'N/A'}<br>
            金額: ¥${(record.total || 0).toLocaleString()}
        `;
    }

    pauseBatchProcessing() {
        this.autoMode = false;

        document.getElementById('batch-start-btn').style.display = 'block';
        document.getElementById('batch-pause-btn').style.display = 'none';

        alert('一時停止しました。「開始」ボタンで再開できます。');
    }

    stopBatchProcessing() {
        this.autoMode = false;

        const confirmed = confirm('バッチ処理を停止しますか？');

        if (confirmed) {
            // クリーンアップ
            localStorage.removeItem('svf_batch_data');
            localStorage.removeItem('svf_batch_mode');

            // コントロールパネルを削除
            const panel = document.getElementById('batch-control-panel');
            if (panel) panel.remove();

            alert('バッチ処理を停止しました。');
        }
    }

    completeBatchProcessing() {
        this.autoMode = false;

        alert(
            `✅ バッチ処理が完了しました！\n\n` +
            `処理件数: ${this.batchData.length}件\n` +
            `成功: ${this.currentIndex}件`
        );

        // クリーンアップ
        localStorage.removeItem('svf_batch_data');
        localStorage.removeItem('svf_batch_mode');

        // 完了ボタンに変更
        const panel = document.getElementById('batch-control-panel');
        if (panel) {
            panel.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #10b981;">
                    ✅ 完了
                </h3>
                <p>全${this.batchData.length}件の処理が完了しました。</p>
                <button onclick="location.href='batch-processing.html'" class="btn btn-primary">
                    バッチ処理に戻る
                </button>
            `;
        }
    }
}

// グローバルインスタンス
window.batchIntegration = new BatchIntegration();

// ページロード時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.batchIntegration.initSVFBatchMode();
    });
} else {
    window.batchIntegration.initSVFBatchMode();
}
