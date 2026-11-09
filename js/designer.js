// SVF Simulator - Designer Core
class SVFDesigner {
    constructor() {
        this.components = [];
        this.selectedComponent = null;
        this.history = [];
        this.historyIndex = -1;
        this.componentCounter = 0;
        this.init();
    }

    init() {
        this.bindDragEvents();
        this.bindClickEvents();
        console.log('Designer initialized');
    }

    bindDragEvents() {
        const palette = document.querySelectorAll('.component-item');
        const designArea = document.getElementById('design-area');

        // Make palette items draggable
        palette.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('component-type', e.target.dataset.type);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        // Setup drop zone
        designArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            designArea.classList.add('drag-over');
        });

        designArea.addEventListener('dragleave', () => {
            designArea.classList.remove('drag-over');
        });

        designArea.addEventListener('drop', (e) => {
            e.preventDefault();
            designArea.classList.remove('drag-over');

            const type = e.dataTransfer.getData('component-type');
            if (type) {
                // Calculate drop position relative to design area
                const rect = designArea.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                this.addComponent(type, x, y);
            }
        });
    }

    bindClickEvents() {
        const designArea = document.getElementById('design-area');

        designArea.addEventListener('click', (e) => {
            if (e.target === designArea) {
                this.deselectAll();
            }
        });
    }

    addComponent(type, x, y) {
        const component = this.createComponent(type, x, y);
        this.components.push(component);
        this.renderComponent(component);
        this.saveState();
        return component;
    }

    createComponent(type, x, y) {
        const id = `comp-${++this.componentCounter}`;

        const componentConfig = {
            id,
            type,
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: this.getDefaultWidth(type),
            height: this.getDefaultHeight(type),
            properties: this.getDefaultProperties(type),
            dataBinding: null
        };

        return componentConfig;
    }

    getDefaultWidth(type) {
        const widths = {
            'text': 200,
            'label': 150,
            'table': 400,
            'image': 150,
            'barcode': 200,
            'qrcode': 100,
            'line': 200,
            'box': 200
        };
        return widths[type] || 100;
    }

    getDefaultHeight(type) {
        const heights = {
            'text': 30,
            'label': 30,
            'table': 150,
            'image': 150,
            'barcode': 60,
            'qrcode': 100,
            'line': 2,
            'box': 100
        };
        return heights[type] || 50;
    }

    getDefaultProperties(type) {
        const defaults = {
            'text': { text: 'Text Field', fontSize: 14, fontFamily: 'sans-serif', color: '#000000' },
            'label': { text: 'Label', fontSize: 14, fontFamily: 'sans-serif', color: '#000000', fontWeight: 'bold' },
            'table': { rows: 3, cols: 3, borderColor: '#e2e8f0' },
            'image': { src: '', alt: 'Image' },
            'barcode': { value: '1234567890', format: 'CODE128' },
            'qrcode': { value: 'https://example.com', size: 100 },
            'line': { thickness: 2, color: '#000000' },
            'box': { borderWidth: 2, borderColor: '#000000', borderStyle: 'solid' }
        };
        return defaults[type] || {};
    }

    renderComponent(component) {
        const designArea = document.getElementById('design-area');
        const element = document.createElement('div');

        element.id = component.id;
        element.className = `svf-component svf-${component.type}`;
        element.style.left = `${component.x}px`;
        element.style.top = `${component.y}px`;
        element.style.width = `${component.width}px`;
        element.style.height = `${component.height}px`;

        // Set component content
        element.innerHTML = this.getComponentHTML(component);

        // Add data field attribute if bound
        if (component.dataBinding) {
            element.dataset.field = component.dataBinding;
        }

        // Make draggable and resizable
        this.makeInteractive(element, component);

        // Add click handler
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component.id);
        });

        designArea.appendChild(element);

        // Add animation
        element.classList.add('component-enter');
    }

    getComponentHTML(component) {
        const { type, properties } = component;

        switch(type) {
            case 'text':
                return `<div class="component-content">${properties.text}</div>`;

            case 'label':
                return `<div class="component-content">${properties.text}</div>`;

            case 'table':
                const rows = properties.rows || 3;
                const cols = properties.cols || 3;
                let tableHTML = '<table class="component-content"><thead><tr>';
                for (let i = 0; i < cols; i++) {
                    tableHTML += `<th>Column ${i + 1}</th>`;
                }
                tableHTML += '</tr></thead><tbody>';
                for (let i = 0; i < rows - 1; i++) {
                    tableHTML += '<tr>';
                    for (let j = 0; j < cols; j++) {
                        tableHTML += '<td>Data</td>';
                    }
                    tableHTML += '</tr>';
                }
                tableHTML += '</tbody></table>';
                return tableHTML;

            case 'image':
                return `<div class="component-content">
                    <div class="placeholder-text">🖼️<br>Image</div>
                </div>`;

            case 'barcode':
                return `<div class="barcode-content">
                    <div class="barcode-bars">
                        ${'<div class="barcode-bar"></div>'.repeat(20)}
                    </div>
                    <div class="barcode-text">${properties.value}</div>
                </div>`;

            case 'qrcode':
                return `<div class="qrcode-content">
                    ${Array(100).fill('<div class="qr-module"></div>').join('')}
                </div>`;

            case 'line':
                return '';

            case 'box':
                return '';

            default:
                return '<div class="component-content">Component</div>';
        }
    }

    makeInteractive(element, component) {
        // Simple drag implementation (can be enhanced with interact.js)
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            if (e.target === element || e.target.closest('.component-content')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = component.x;
                initialY = component.y;
                element.classList.add('dragging');
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                component.x = initialX + dx;
                component.y = initialY + dy;
                element.style.left = `${component.x}px`;
                element.style.top = `${component.y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
                this.saveState();
            }
        });
    }

    selectComponent(id) {
        this.deselectAll();

        const component = this.components.find(c => c.id === id);
        if (component) {
            this.selectedComponent = component;
            document.getElementById(id).classList.add('selected');
            this.updatePropertiesPanel(component);
        }
    }

    deselectAll() {
        document.querySelectorAll('.svf-component').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedComponent = null;
        this.updatePropertiesPanel(null);
    }

    updatePropertiesPanel(component) {
        const panel = document.getElementById('properties-panel');

        if (!component) {
            panel.innerHTML = '<div class="no-selection"><p>请选择一个组件以编辑属性</p></div>';
            return;
        }

        panel.innerHTML = `
            <div class="property-group">
                <h4>基本属性</h4>
                <div class="form-group">
                    <label>类型:</label>
                    <input type="text" value="${component.type}" readonly />
                </div>
                <div class="form-group">
                    <label>X:</label>
                    <input type="number" id="prop-x" value="${component.x}" />
                </div>
                <div class="form-group">
                    <label>Y:</label>
                    <input type="number" id="prop-y" value="${component.y}" />
                </div>
                <div class="form-group">
                    <label>宽度:</label>
                    <input type="number" id="prop-width" value="${component.width}" />
                </div>
                <div class="form-group">
                    <label>高度:</label>
                    <input type="number" id="prop-height" value="${component.height}" />
                </div>
            </div>

            <div class="property-group">
                <h4>数据绑定</h4>
                <div class="form-group">
                    <label>字段路径:</label>
                    <input type="text" id="prop-binding" value="${component.dataBinding || ''}"
                           placeholder="例如: header.po_number" />
                </div>
            </div>

            ${this.getTypeSpecificProperties(component)}
        `;

        // Bind property change events
        this.bindPropertyEvents(component);
    }

    getTypeSpecificProperties(component) {
        if (component.type === 'text' || component.type === 'label') {
            return `
                <div class="property-group">
                    <h4>文本属性</h4>
                    <div class="form-group">
                        <label>文本:</label>
                        <input type="text" id="prop-text" value="${component.properties.text}" />
                    </div>
                    <div class="form-group">
                        <label>字体大小:</label>
                        <input type="number" id="prop-fontSize" value="${component.properties.fontSize}" />
                    </div>
                </div>
            `;
        }
        return '';
    }

    bindPropertyEvents(component) {
        const updateProp = (propName, value) => {
            if (propName.startsWith('prop-')) {
                const key = propName.replace('prop-', '');
                if (key in component) {
                    component[key] = parseFloat(value) || value;
                } else if (key === 'binding') {
                    component.dataBinding = value;
                } else if (key in component.properties) {
                    component.properties[key] = value;
                }
                this.updateComponentElement(component);
                this.saveState();
            }
        };

        document.querySelectorAll('#properties-panel input').forEach(input => {
            input.addEventListener('change', (e) => {
                updateProp(e.target.id, e.target.value);
            });
        });
    }

    updateComponentElement(component) {
        const element = document.getElementById(component.id);
        if (element) {
            element.style.left = `${component.x}px`;
            element.style.top = `${component.y}px`;
            element.style.width = `${component.width}px`;
            element.style.height = `${component.height}px`;

            if (component.dataBinding) {
                element.dataset.field = component.dataBinding;
            }
        }
    }

    deleteSelected() {
        if (this.selectedComponent) {
            const id = this.selectedComponent.id;
            this.components = this.components.filter(c => c.id !== id);
            document.getElementById(id)?.remove();
            this.selectedComponent = null;
            this.updatePropertiesPanel(null);
            this.saveState();
        }
    }

    // History Management
    saveState() {
        const state = JSON.parse(JSON.stringify(this.components));
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(state) {
        this.components = JSON.parse(JSON.stringify(state));
        this.render();
    }

    render() {
        const designArea = document.getElementById('design-area');
        designArea.innerHTML = '';
        this.components.forEach(comp => this.renderComponent(comp));
    }

    // Template Management
    clear() {
        this.components = [];
        this.selectedComponent = null;
        this.history = [];
        this.historyIndex = -1;
        this.componentCounter = 0;
        document.getElementById('design-area').innerHTML = '';
        this.updatePropertiesPanel(null);
    }

    getComponents() {
        return this.components;
    }

    getDataBinding() {
        const bindings = {};
        this.components.forEach(comp => {
            if (comp.dataBinding) {
                bindings[comp.id] = comp.dataBinding;
            }
        });
        return bindings;
    }

    loadTemplate(template) {
        this.clear();
        if (template.components) {
            this.components = JSON.parse(JSON.stringify(template.components));
            this.componentCounter = this.components.length;
            this.render();
            this.saveState();
        }
    }
}
