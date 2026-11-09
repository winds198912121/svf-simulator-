// SVF Simulator - Main Application
class SVFApp {
    constructor() {
        this.currentTemplate = null;
        this.currentData = null;
        this.zoomLevel = 1;
        this.designer = null;
        this.init();
    }

    init() {
        console.log('SVF Simulator initializing...');

        // Initialize Designer
        this.designer = new SVFDesigner();

        // Bind UI Events
        this.bindEvents();

        // Load initial data
        this.loadInitialData();

        console.log('SVF Simulator ready!');
    }

    bindEvents() {
        // Header Buttons
        document.getElementById('btn-save').addEventListener('click', () => this.saveTemplate());
        document.getElementById('btn-load').addEventListener('click', () => this.loadTemplate());
        document.getElementById('btn-export').addEventListener('click', () => this.exportTemplate());
        document.getElementById('btn-import').addEventListener('click', () => this.importTemplate());

        // Toolbar Buttons
        document.getElementById('btn-new').addEventListener('click', () => this.newTemplate());
        document.getElementById('btn-undo').addEventListener('click', () => this.designer.undo());
        document.getElementById('btn-redo').addEventListener('click', () => this.designer.redo());

        document.getElementById('btn-preview').addEventListener('click', () => this.switchMode('preview'));
        document.getElementById('btn-data').addEventListener('click', () => this.switchMode('data'));
        document.getElementById('btn-print').addEventListener('click', () => this.print());
        document.getElementById('btn-pdf').addEventListener('click', () => this.exportPDF());

        // Zoom Controls
        document.getElementById('btn-zoom-in').addEventListener('click', () => this.zoom(0.25));
        document.getElementById('btn-zoom-out').addEventListener('click', () => this.zoom(-0.25));

        // Tab Buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Data Editor Buttons
        document.getElementById('btn-validate-json').addEventListener('click', () => this.validateJSON());
        document.getElementById('btn-format-json').addEventListener('click', () => this.formatJSON());
        document.getElementById('btn-load-sample').addEventListener('click', () => this.loadSampleData());

        // Preview Controls
        document.getElementById('data-select').addEventListener('change', (e) => {
            this.currentData = e.target.value;
            this.updatePreview();
        });
        document.getElementById('btn-refresh-preview').addEventListener('click', () => this.updatePreview());

        // Modal
        document.getElementById('btn-confirm-save').addEventListener('click', () => this.confirmSave());
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Template Management
    newTemplate() {
        if (confirm('创建新模板？当前未保存的更改将丢失。')) {
            this.designer.clear();
            this.currentTemplate = {
                name: 'Untitled',
                components: [],
                dataBinding: {}
            };
        }
    }

    saveTemplate() {
        document.getElementById('modal-save').classList.add('active');
    }

    confirmSave() {
        const name = document.getElementById('template-name').value;
        const desc = document.getElementById('template-desc').value;

        if (!name) {
            alert('请输入模板名称');
            return;
        }

        const template = {
            name: name,
            description: desc,
            components: this.designer.getComponents(),
            dataBinding: this.designer.getDataBinding(),
            createdAt: new Date().toISOString()
        };

        // Save to LocalStorage
        const templates = this.getSavedTemplates();
        templates[name] = template;
        localStorage.setItem('svf_templates', JSON.stringify(templates));

        this.closeModal();
        this.showNotification(`模板 "${name}" 已保存`, 'success');
    }

    loadTemplate() {
        const templates = this.getSavedTemplates();
        const names = Object.keys(templates);

        if (names.length === 0) {
            alert('没有已保存的模板');
            return;
        }

        const selected = prompt(`选择模板:\n${names.join('\n')}`);
        if (selected && templates[selected]) {
            this.designer.loadTemplate(templates[selected]);
            this.currentTemplate = templates[selected];
            this.showNotification(`模板 "${selected}" 已加载`, 'success');
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
                    this.showNotification('模板已导入', 'success');
                } catch (err) {
                    alert('无效的模板文件: ' + err.message);
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

    // Mode & Tab Management
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
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === `tab-${tabName}`);
        });
    }

    // Zoom Controls
    zoom(delta) {
        this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel + delta));
        const canvas = document.getElementById('canvas');
        canvas.dataset.zoom = this.zoomLevel;
        document.getElementById('zoom-level').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    // Data Management
    loadSampleData() {
        const sampleData = {
            "header": {
                "form_title": "発注書",
                "po_number": "PO-2026-001",
                "po_date": "2026-11-09",
                "vendor_name": "ABC商社",
                "vendor_address": "東京都渋谷区恵比寿1-2-3"
            },
            "items": [
                {
                    "line_no": "001",
                    "material_code": "MAT-001",
                    "material_name": "部品A",
                    "quantity": 100,
                    "unit": "個",
                    "unit_price": 1500,
                    "amount": 150000
                },
                {
                    "line_no": "002",
                    "material_code": "MAT-002",
                    "material_name": "部品B",
                    "quantity": 50,
                    "unit": "個",
                    "unit_price": 2000,
                    "amount": 100000
                }
            ],
            "summary": {
                "subtotal": 250000,
                "tax_rate": 0.1,
                "tax_amount": 25000,
                "total": 275000
            }
        };

        document.getElementById('data-editor').value = JSON.stringify(sampleData, null, 2);
        this.showNotification('示例数据已加载', 'success');
    }

    validateJSON() {
        const editor = document.getElementById('data-editor');
        try {
            JSON.parse(editor.value);
            this.showNotification('JSON 格式有效', 'success');
        } catch (err) {
            this.showNotification(`JSON 错误: ${err.message}`, 'error');
        }
    }

    formatJSON() {
        const editor = document.getElementById('data-editor');
        try {
            const data = JSON.parse(editor.value);
            editor.value = JSON.stringify(data, null, 2);
            this.showNotification('JSON 已格式化', 'success');
        } catch (err) {
            this.showNotification(`无法格式化: ${err.message}`, 'error');
        }
    }

    // Preview & Output
    updatePreview() {
        const editor = document.getElementById('data-editor');
        try {
            const data = JSON.parse(editor.value);
            const preview = document.getElementById('preview-area');

            // Clone the design area for preview
            const designArea = document.getElementById('design-area');
            const cloned = designArea.cloneNode(true);

            // Apply data binding
            this.applyDataBinding(cloned, data);

            preview.innerHTML = '';
            preview.appendChild(cloned);
        } catch (err) {
            console.error('Preview error:', err);
        }
    }

    applyDataBinding(element, data) {
        // Simple data binding implementation
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
        this.showNotification('PDF导出功能开发中...', 'info');
        // Will be implemented with jsPDF
    }

    // Utilities
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        // Simple notification (can be enhanced with a proper notification library)
        const color = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        }[type];

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleKeyboard(e) {
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveTemplate();
        }
        // Ctrl/Cmd + Z: Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.designer.undo();
        }
        // Ctrl/Cmd + Shift + Z: Redo
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
            e.preventDefault();
            this.designer.redo();
        }
        // Delete: Remove selected component
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                this.designer.deleteSelected();
            }
        }
    }

    loadInitialData() {
        // Load sample data into editor
        this.loadSampleData();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.svfApp = new SVFApp();
});
