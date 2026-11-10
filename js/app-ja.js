// SVF Simulator - Main Application (Japanese Version)
class SVFApp {
    constructor() {
        this.currentTemplate = null;
        this.currentData = null;
        this.zoomLevel = 1;
        this.designer = null;
        this.messages = {
            newTemplate: '新しいテンプレートを作成しますか？保存されていない変更は失われます。',
            enterTemplateName: 'テンプレート名を入力してください',
            templateSaved: 'テンプレート "{name}" を保存しました',
            noTemplates: '保存されているテンプレートがありません',
            selectTemplate: 'テンプレートを選択:\n{names}',
            templateLoaded: 'テンプレート "{name}" を読み込みました',
            invalidTemplate: '無効なテンプレートファイル: {error}',
            templateImported: 'テンプレートをインポートしました',
            sampleDataLoaded: 'サンプルデータを読み込みました',
            jsonValid: 'JSON形式が正しいです',
            jsonError: 'JSONエラー: {error}',
            jsonFormatted: 'JSONを整形しました',
            formatError: '整形できません: {error}',
            pdfExporting: 'PDF出力機能は開発中です...'
        };
        this.init();
    }

    init() {
        console.log('SVF Simulator initializing...');
        this.designer = new SVFDesigner();
        this.bindEvents();
        this.loadInitialData();
        console.log('SVF Simulator ready!');
    }

    bindEvents() {
        // 安全なイベントバインディング用のヘルパー関数
        const bind = (id, event, handler) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener(event, handler);
            } else {
                console.warn(`Element not found: ${id}`);
            }
        };

        // ボタンイベント
        bind('btn-save', 'click', () => this.saveTemplate());
        bind('btn-load', 'click', () => this.loadTemplate());
        bind('btn-export', 'click', () => this.exportTemplate());
        bind('btn-import', 'click', () => this.importTemplate());
        bind('btn-new', 'click', () => this.newTemplate());
        bind('btn-undo', 'click', () => this.designer.undo());
        bind('btn-redo', 'click', () => this.designer.redo());
        bind('btn-preview', 'click', () => this.switchMode('preview'));
        bind('btn-data', 'click', () => this.switchMode('data'));
        bind('btn-print', 'click', () => this.print());
        bind('btn-pdf', 'click', () => this.exportPDF());
        bind('btn-zoom-in', 'click', () => this.zoom(0.25));
        bind('btn-zoom-out', 'click', () => this.zoom(-0.25));

        // タブボタン
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // データエディタ関連
        bind('btn-validate-json', 'click', () => this.validateJSON());
        bind('btn-format-json', 'click', () => this.formatJSON());
        bind('btn-load-sample', 'click', () => this.loadSampleData());
        bind('data-select', 'change', (e) => {
            this.currentData = e.target.value;
            this.updatePreview();
        });
        bind('btn-refresh-preview', 'click', () => this.updatePreview());
        bind('btn-confirm-save', 'click', () => this.confirmSave());

        // キャンセルボタン
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // キーボードイベント
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // テンプレートカードのボタンをバインド
        this.bindTemplateCards();
    }

    bindTemplateCards() {
        // 動的にテンプレートグリッドをレンダリング
        this.renderTemplateGrid();
    }

    renderTemplateGrid() {
        const gridEl = document.getElementById('template-grid');
        if (!gridEl) {
            console.warn('template-grid element not found');
            return;
        }

        // 既存のテンプレートを全て削除
        gridEl.innerHTML = '';

        // 予定義テンプレート
        const predefined = [
            { name: 'ZPOF001', title: '発注書', desc: '発注書テンプレート', preview: '発注書' },
            { name: 'Invoice', title: '請求書', desc: '請求書テンプレート', preview: '請求書' }
        ];

        // 保存されたカスタムテンプレート
        const savedTemplates = this.getSavedTemplates();
        const customTemplates = Object.keys(savedTemplates).map(key => ({
            name: key,
            title: key,
            desc: savedTemplates[key].description || 'カスタムテンプレート',
            preview: '📋',
            isCustom: true,
            createdAt: savedTemplates[key].createdAt
        }));

        // 全テンプレートを結合
        const allTemplates = [...predefined, ...customTemplates];

        // テンプレートカードを生成
        allTemplates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card' + (template.isCustom ? ' custom' : ' sample');

            card.innerHTML = `
                <div class="template-preview">
                    <div class="preview-placeholder">${this.escapeHtml(template.preview)}</div>
                </div>
                <div class="template-info">
                    <h4>${this.escapeHtml(template.title)}</h4>
                    <p>${this.escapeHtml(template.desc)}</p>
                    ${template.createdAt ? `<small style="font-size:11px;color:#94a3b8;">${new Date(template.createdAt).toLocaleString('ja-JP')}</small>` : ''}
                    <button class="btn btn-small" data-template="${this.escapeHtml(template.name)}">読込</button>
                    ${template.isCustom ? `<button class="btn btn-small btn-delete" data-template="${this.escapeHtml(template.name)}" style="background:#dc2626;margin-left:4px;">削除</button>` : ''}
                </div>
            `;

            gridEl.appendChild(card);
        });

        // イベントリスナーをバインド
        gridEl.querySelectorAll('.btn:not(.btn-delete)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateName = e.target.dataset.template;
                if (templateName === 'ZPOF001' || templateName === 'Invoice') {
                    this.loadPredefinedTemplate(templateName);
                } else {
                    this.loadSavedTemplate(templateName);
                }
            });
        });

        // 削除ボタンのイベントリスナー
        gridEl.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateName = e.target.dataset.template;
                this.deleteTemplate(templateName);
            });
        });

        console.log('テンプレートグリッドを更新しました:', allTemplates.length, '個');
    }

    loadSavedTemplate(name) {
        const templates = this.getSavedTemplates();
        if (templates[name]) {
            this.designer.loadTemplate(templates[name]);
            this.currentTemplate = templates[name];
            this.showNotification(`テンプレート "${name}" を読み込みました`, 'success');
        } else {
            this.showNotification(`テンプレート "${name}" が見つかりません`, 'error');
        }
    }

    deleteTemplate(name) {
        if (!confirm(`テンプレート "${name}" を削除しますか？`)) {
            return;
        }

        const templates = this.getSavedTemplates();
        if (templates[name]) {
            delete templates[name];
            localStorage.setItem('svf_templates', JSON.stringify(templates));
            this.renderTemplateGrid();
            this.showNotification(`テンプレート "${name}" を削除しました`, 'success');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadPredefinedTemplate(templateName) {
        console.log('Loading predefined template:', templateName);

        if (templateName === 'ZPOF001') {
            // ZPOF001 発注書テンプレート
            const template = {
                name: 'ZPOF001',
                description: '発注書テンプレート',
                components: [
                    { id: 'title', type: 'label', x: 300, y: 40, width: 200, height: 40,
                      properties: { text: '発注書', fontSize: 28, fontWeight: 'bold', color: '#1e293b' } },
                    { id: 'po-label', type: 'label', x: 50, y: 100, width: 100, height: 30,
                      properties: { text: '発注番号:', fontSize: 14, fontWeight: '600' } },
                    { id: 'po-number', type: 'text', x: 160, y: 100, width: 150, height: 30,
                      properties: { text: 'PO-2026-001', fontSize: 14 }, dataBinding: 'header.po_number' },
                    { id: 'date-label', type: 'label', x: 400, y: 100, width: 80, height: 30,
                      properties: { text: '発注日:', fontSize: 14, fontWeight: '600' } },
                    { id: 'date', type: 'text', x: 490, y: 100, width: 150, height: 30,
                      properties: { text: '2026-11-09', fontSize: 14 }, dataBinding: 'header.po_date' },
                    { id: 'vendor-label', type: 'label', x: 50, y: 150, width: 100, height: 30,
                      properties: { text: '供給者名:', fontSize: 14, fontWeight: '600' } },
                    { id: 'vendor', type: 'text', x: 160, y: 150, width: 300, height: 30,
                      properties: { text: 'ABC商社株式会社', fontSize: 14 }, dataBinding: 'header.vendor_name' },
                    { id: 'table', type: 'table', x: 50, y: 220, width: 690, height: 250,
                      properties: { rows: 5, cols: 6 } },
                    { id: 'subtotal-label', type: 'label', x: 500, y: 500, width: 80, height: 30,
                      properties: { text: '小計:', fontSize: 14, fontWeight: '600' } },
                    { id: 'subtotal', type: 'text', x: 590, y: 500, width: 150, height: 30,
                      properties: { text: '¥250,000', fontSize: 14 }, dataBinding: 'summary.subtotal' },
                    { id: 'tax-label', type: 'label', x: 500, y: 540, width: 80, height: 30,
                      properties: { text: '消費税:', fontSize: 14, fontWeight: '600' } },
                    { id: 'tax', type: 'text', x: 590, y: 540, width: 150, height: 30,
                      properties: { text: '¥25,000', fontSize: 14 }, dataBinding: 'summary.tax_amount' },
                    { id: 'total-label', type: 'label', x: 500, y: 580, width: 80, height: 30,
                      properties: { text: '合計:', fontSize: 16, fontWeight: 'bold' } },
                    { id: 'total', type: 'text', x: 590, y: 580, width: 150, height: 30,
                      properties: { text: '¥275,000', fontSize: 16, fontWeight: 'bold' }, dataBinding: 'summary.total' }
                ]
            };

            this.designer.loadTemplate(template);
            this.currentTemplate = template;
            this.showNotification('ZPOF001 発注書テンプレートを読み込みました', 'success');
        } else if (templateName === 'Invoice') {
            // Invoice 請求書テンプレート
            const template = {
                name: 'Invoice',
                description: '請求書テンプレート',
                components: [
                    { id: 'title', type: 'label', x: 300, y: 40, width: 200, height: 40,
                      properties: { text: '請求書', fontSize: 28, fontWeight: 'bold', color: '#1e293b' } },
                    { id: 'invoice-label', type: 'label', x: 50, y: 100, width: 100, height: 30,
                      properties: { text: '請求番号:', fontSize: 14, fontWeight: '600' } },
                    { id: 'invoice-number', type: 'text', x: 160, y: 100, width: 150, height: 30,
                      properties: { text: 'INV-2026-001', fontSize: 14 }, dataBinding: 'header.invoice_number' },
                    { id: 'date-label', type: 'label', x: 400, y: 100, width: 80, height: 30,
                      properties: { text: '請求日:', fontSize: 14, fontWeight: '600' } },
                    { id: 'date', type: 'text', x: 490, y: 100, width: 150, height: 30,
                      properties: { text: '2026-11-09', fontSize: 14 }, dataBinding: 'header.invoice_date' },
                    { id: 'client-label', type: 'label', x: 50, y: 150, width: 100, height: 30,
                      properties: { text: '請求先:', fontSize: 14, fontWeight: '600' } },
                    { id: 'client', type: 'text', x: 160, y: 150, width: 300, height: 30,
                      properties: { text: 'XYZ株式会社', fontSize: 14 }, dataBinding: 'header.client_name' },
                    { id: 'address-label', type: 'label', x: 50, y: 190, width: 100, height: 30,
                      properties: { text: '住所:', fontSize: 14, fontWeight: '600' } },
                    { id: 'address', type: 'text', x: 160, y: 190, width: 480, height: 30,
                      properties: { text: '東京都千代田区丸の内1-1-1', fontSize: 14 }, dataBinding: 'header.client_address' },
                    { id: 'table', type: 'table', x: 50, y: 250, width: 690, height: 250,
                      properties: { rows: 5, cols: 5 } },
                    { id: 'subtotal-label', type: 'label', x: 500, y: 530, width: 80, height: 30,
                      properties: { text: '小計:', fontSize: 14, fontWeight: '600' } },
                    { id: 'subtotal', type: 'text', x: 590, y: 530, width: 150, height: 30,
                      properties: { text: '¥500,000', fontSize: 14 }, dataBinding: 'summary.subtotal' },
                    { id: 'tax-label', type: 'label', x: 500, y: 570, width: 80, height: 30,
                      properties: { text: '消費税:', fontSize: 14, fontWeight: '600' } },
                    { id: 'tax', type: 'text', x: 590, y: 570, width: 150, height: 30,
                      properties: { text: '¥50,000', fontSize: 14 }, dataBinding: 'summary.tax_amount' },
                    { id: 'total-label', type: 'label', x: 500, y: 610, width: 80, height: 30,
                      properties: { text: '合計金額:', fontSize: 16, fontWeight: 'bold' } },
                    { id: 'total', type: 'text', x: 590, y: 610, width: 150, height: 30,
                      properties: { text: '¥550,000', fontSize: 16, fontWeight: 'bold' }, dataBinding: 'summary.total' },
                    { id: 'payment-label', type: 'label', x: 50, y: 670, width: 120, height: 30,
                      properties: { text: 'お支払期限:', fontSize: 13, fontWeight: '600' } },
                    { id: 'payment-due', type: 'text', x: 180, y: 670, width: 150, height: 30,
                      properties: { text: '2026-12-09', fontSize: 13 }, dataBinding: 'header.payment_due' }
                ]
            };

            this.designer.loadTemplate(template);
            this.currentTemplate = template;
            this.showNotification('Invoice 請求書テンプレートを読み込みました', 'success');
        }
    }

    newTemplate() {
        if (confirm(this.messages.newTemplate)) {
            this.designer.clear();
            this.currentTemplate = { name: 'Untitled', components: [], dataBinding: {} };
        }
    }

    saveTemplate() {
        const modal = document.getElementById('modal-save');
        if (modal) {
            modal.classList.add('active');
        } else {
            console.error('modal-save element not found');
            this.showNotification('保存ダイアログが見つかりません', 'error');
        }
    }

    confirmSave() {
        const nameInput = document.getElementById('template-name');
        const descInput = document.getElementById('template-desc');

        if (!nameInput || !descInput) {
            console.error('Template form elements not found');
            this.showNotification('フォーム要素が見つかりません', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const desc = descInput.value.trim();

        if (!name) {
            alert(this.messages.enterTemplateName);
            return;
        }

        const template = {
            name: name,
            description: desc,
            components: this.designer.getComponents(),
            dataBinding: this.designer.getDataBinding(),
            createdAt: new Date().toISOString()
        };

        const templates = this.getSavedTemplates();
        templates[name] = template;

        try {
            localStorage.setItem('svf_templates', JSON.stringify(templates));
            this.closeModal();
            this.renderTemplateGrid(); // テンプレートグリッドを更新
            this.showNotification(this.messages.templateSaved.replace('{name}', name), 'success');
            console.log('Template saved successfully:', name);
        } catch (err) {
            console.error('Failed to save template:', err);
            this.showNotification('テンプレートの保存に失敗しました: ' + err.message, 'error');
        }
    }

    loadTemplate() {
        const modal = document.getElementById('modal-load');
        const listEl = document.getElementById('template-load-list');

        if (!modal || !listEl) {
            console.error('modal-load elements not found');
            return;
        }

        // 既存のリストをクリア
        listEl.innerHTML = '';

        // 予定義テンプレート
        const predefined = [
            { name: 'ZPOF001', icon: '📋', desc: '発注書テンプレート', isPredefined: true },
            { name: 'Invoice', icon: '📄', desc: '請求書テンプレート', isPredefined: true }
        ];

        // 保存されたカスタムテンプレート
        const savedTemplates = this.getSavedTemplates();
        const custom = Object.keys(savedTemplates).map(key => ({
            name: key,
            icon: '💾',
            desc: savedTemplates[key].description || 'カスタムテンプレート',
            createdAt: savedTemplates[key].createdAt,
            template: savedTemplates[key]
        }));

        const allTemplates = [...predefined, ...custom];

        if (allTemplates.length === 0) {
            listEl.innerHTML = '<div class="template-load-empty">保存されているテンプレートはありません</div>';
        } else {
            allTemplates.forEach(t => {
                const item = document.createElement('div');
                item.className = `template-load-item ${t.isPredefined ? 'predefined' : 'custom'}`;

                const meta = t.createdAt
                    ? `<div class="template-load-meta">作成: ${new Date(t.createdAt).toLocaleString('ja-JP')}</div>`
                    : '';

                item.innerHTML = `
                    <div class="template-load-icon">${t.icon}</div>
                    <div class="template-load-info">
                        <div class="template-load-name">${this.escapeHtml(t.name)}</div>
                        <div class="template-load-desc">${this.escapeHtml(t.desc)}</div>
                        ${meta}
                    </div>
                `;

                item.addEventListener('click', () => {
                    if (t.isPredefined) {
                        this.loadPredefinedTemplate(t.name);
                    } else {
                        this.loadSavedTemplate(t.name);
                    }
                    this.closeModal();
                });

                listEl.appendChild(item);
            });
        }

        modal.classList.add('active');
        console.log('テンプレート選択ダイアログを表示:', allTemplates.length, '個');
    }

    exportTemplate() {
        const template = {
            name: this.currentTemplate?.name || 'export',
            components: this.designer.getComponents(),
            dataBinding: this.designer.getDataBinding()
        };
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name}.svf.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importTemplate() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const template = JSON.parse(event.target.result);
                    this.designer.loadTemplate(template);
                    this.currentTemplate = template;
                    this.showNotification(this.messages.templateImported, 'success');
                } catch (err) {
                    alert(this.messages.invalidTemplate.replace('{error}', err.message));
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    getSavedTemplates() {
        const stored = localStorage.getItem('svf_templates');
        return stored ? JSON.parse(stored) : {};
    }

    switchMode(mode) {
        document.querySelectorAll('.btn-tool.active').forEach(btn => {
            if (btn.id === `btn-${mode}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (mode === 'preview') {
            this.updatePreview();
        } else if (mode === 'data') {
            this.switchTab('data');
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `tab-${tabName}`);
        });
    }

    zoom(delta) {
        this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel + delta));
        const canvas = document.getElementById('canvas');
        canvas.dataset.zoom = this.zoomLevel;
        document.getElementById('zoom-level').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    loadSampleData() {
        const sampleData = {
            "header": {
                "form_title": "発注書",
                "po_number": "PO-2026-001",
                "po_date": "2026-11-09",
                "vendor_name": "ABC商社株式会社",
                "vendor_address": "〒150-0013 東京都渋谷区恵比寿1-2-3 恵比寿ビル5F"
            },
            "items": [
                { "line_no": "001", "material_code": "MAT-001", "material_name": "部品A", "quantity": 100, "unit": "個", "unit_price": 1500, "amount": 150000 },
                { "line_no": "002", "material_code": "MAT-002", "material_name": "部品B", "quantity": 50, "unit": "個", "unit_price": 2000, "amount": 100000 }
            ],
            "summary": { "subtotal": 250000, "tax_rate": 0.1, "tax_amount": 25000, "total": 275000 }
        };
        const editor = document.getElementById('data-editor');
        if (editor) {
            editor.value = JSON.stringify(sampleData, null, 2);
            this.showNotification(this.messages.sampleDataLoaded, 'success');
        } else {
            console.error('data-editor element not found');
            this.showNotification('データエディタが見つかりません', 'error');
        }
    }

    validateJSON() {
        const editor = document.getElementById('data-editor');
        if (!editor) {
            this.showNotification('データエディタが見つかりません', 'error');
            return;
        }
        try {
            JSON.parse(editor.value);
            this.showNotification(this.messages.jsonValid, 'success');
        } catch (err) {
            this.showNotification(this.messages.jsonError.replace('{error}', err.message), 'error');
        }
    }

    formatJSON() {
        const editor = document.getElementById('data-editor');
        if (!editor) {
            this.showNotification('データエディタが見つかりません', 'error');
            return;
        }
        try {
            const data = JSON.parse(editor.value);
            editor.value = JSON.stringify(data, null, 2);
            this.showNotification(this.messages.jsonFormatted, 'success');
        } catch (err) {
            this.showNotification(this.messages.formatError.replace('{error}', err.message), 'error');
        }
    }

    updatePreview() {
        const editor = document.getElementById('data-editor');
        const preview = document.getElementById('preview-area');
        const designArea = document.getElementById('design-area');

        if (!editor || !preview || !designArea) {
            console.error('Required elements not found for preview update');
            return;
        }

        try {
            const data = JSON.parse(editor.value);
            const cloned = designArea.cloneNode(true);
            this.applyDataBinding(cloned, data);
            preview.innerHTML = '';
            preview.appendChild(cloned);
        } catch (err) {
            console.error('Preview error:', err);
        }
    }

    applyDataBinding(element, data) {
        element.querySelectorAll('[data-field]').forEach(comp => {
            const field = comp.dataset.field;
            const value = this.getNestedValue(data, field);
            if (value !== undefined) {
                comp.textContent = value;
            }
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
    }

    print() {
        window.print();
    }

    exportPDF() {
        this.showNotification(this.messages.pdfExporting, 'info');
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        const color = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#2563eb' }[type];
        const notification = document.createElement('div');
        notification.style.cssText = `position: fixed; top: 80px; right: 20px; background: ${color}; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); z-index: 10000; animation: slideIn 0.3s ease-out;`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleKeyboard(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveTemplate();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.designer.undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
            e.preventDefault();
            this.designer.redo();
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                this.designer.deleteSelected();
            }
        }
    }

    loadInitialData() {
        this.loadSampleData();
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    window.svfApp = new SVFApp();
});
