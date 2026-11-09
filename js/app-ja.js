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
        document.getElementById('btn-save').addEventListener('click', () => this.saveTemplate());
        document.getElementById('btn-load').addEventListener('click', () => this.loadTemplate());
        document.getElementById('btn-export').addEventListener('click', () => this.exportTemplate());
        document.getElementById('btn-import').addEventListener('click', () => this.importTemplate());
        document.getElementById('btn-new').addEventListener('click', () => this.newTemplate());
        document.getElementById('btn-undo').addEventListener('click', () => this.designer.undo());
        document.getElementById('btn-redo').addEventListener('click', () => this.designer.redo());
        document.getElementById('btn-preview').addEventListener('click', () => this.switchMode('preview'));
        document.getElementById('btn-data').addEventListener('click', () => this.switchMode('data'));
        document.getElementById('btn-print').addEventListener('click', () => this.print());
        document.getElementById('btn-pdf').addEventListener('click', () => this.exportPDF());
        document.getElementById('btn-zoom-in').addEventListener('click', () => this.zoom(0.25));
        document.getElementById('btn-zoom-out').addEventListener('click', () => this.zoom(-0.25));
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        document.getElementById('btn-validate-json').addEventListener('click', () => this.validateJSON());
        document.getElementById('btn-format-json').addEventListener('click', () => this.formatJSON());
        document.getElementById('btn-load-sample').addEventListener('click', () => this.loadSampleData());
        document.getElementById('data-select').addEventListener('change', (e) => {
            this.currentData = e.target.value;
            this.updatePreview();
        });
        document.getElementById('btn-refresh-preview').addEventListener('click', () => this.updatePreview());
        document.getElementById('btn-confirm-save').addEventListener('click', () => this.confirmSave());
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // テンプレートカードのボタンをバインド
        this.bindTemplateCards();
    }

    bindTemplateCards() {
        // DOMが完全にロードされた後にバインド
        setTimeout(() => {
            const templateCards = document.querySelectorAll('.template-card');
            templateCards.forEach((card, index) => {
                const btn = card.querySelector('.btn');
                if (btn) {
                    btn.addEventListener('click', () => {
                        if (index === 0) {
                            this.loadPredefinedTemplate('ZPOF001');
                        } else if (index === 1) {
                            this.loadPredefinedTemplate('Invoice');
                        }
                    });
                }
            });
        }, 100);
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
        document.getElementById('modal-save').classList.add('active');
    }

    confirmSave() {
        const name = document.getElementById('template-name').value;
        const desc = document.getElementById('template-desc').value;
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
        localStorage.setItem('svf_templates', JSON.stringify(templates));
        this.closeModal();
        this.showNotification(this.messages.templateSaved.replace('{name}', name), 'success');
    }

    loadTemplate() {
        const templates = this.getSavedTemplates();
        const names = Object.keys(templates);
        if (names.length === 0) {
            alert(this.messages.noTemplates);
            return;
        }
        const selected = prompt(this.messages.selectTemplate.replace('{names}', names.join('\n')));
        if (selected && templates[selected]) {
            this.designer.loadTemplate(templates[selected]);
            this.currentTemplate = templates[selected];
            this.showNotification(this.messages.templateLoaded.replace('{name}', selected), 'success');
        }
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
        document.getElementById('data-editor').value = JSON.stringify(sampleData, null, 2);
        this.showNotification(this.messages.sampleDataLoaded, 'success');
    }

    validateJSON() {
        const editor = document.getElementById('data-editor');
        try {
            JSON.parse(editor.value);
            this.showNotification(this.messages.jsonValid, 'success');
        } catch (err) {
            this.showNotification(this.messages.jsonError.replace('{error}', err.message), 'error');
        }
    }

    formatJSON() {
        const editor = document.getElementById('data-editor');
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
        try {
            const data = JSON.parse(editor.value);
            const preview = document.getElementById('preview-area');
            const designArea = document.getElementById('design-area');
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
