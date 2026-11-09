# SVF Simulator - 表单设计练习系统

## 📋 项目简介

SVF Simulator 是一个基于纯Web技术的表单设计模拟器，用于练习和学习SVF (Super Visual Formade) 表单设计流程。

**特点**:
- ✅ 纯Web技术 (HTML/CSS/JavaScript)
- ✅ 无需后端服务器
- ✅ 支持离线使用
- ✅ 拖拽式设计器
- ✅ 数据绑定功能
- ✅ PDF导出支持

---

## 🚀 快速开始

### 方法1: 本地文件直接打开

1. 下载必要的库文件（见下方"安装依赖"）
2. 双击 `index.html` 在浏览器中打开

### 方法2: 使用本地服务器（推荐）

**使用 Python**:
```bash
cd svf-simulator
python3 -m http.server 8000
```

**使用 Node.js**:
```bash
cd svf-simulator
npx http-server -p 8000
```

然后访问: http://localhost:8000

---

## 📦 安装依赖

下载以下库文件到 `libs/` 目录：

### 1. interact.js (拖拽功能)
下载地址: https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js

或使用 CDN（修改 index.html）:
```html
<script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js"></script>
```

### 2. jsPDF (PDF生成)
下载地址: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js

或使用 CDN（修改 index.html）:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

**快速下载脚本**:
```bash
cd libs/
curl -o interact.min.js https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js
curl -o jspdf.min.js https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

---

## 🎨 使用指南

### 1. 创建表单设计

1. **拖拽组件**: 从左侧组件库拖拽组件到画布
2. **调整位置**: 拖动组件到合适位置
3. **调整大小**: 选中组件后拖动边角调整大小
4. **编辑属性**: 选中组件后在右侧属性面板编辑

**可用组件**:
- 📝 文本框 (Text Field)
- 🏷️ 标签 (Label)
- 📊 表格 (Table)
- 🖼️ 图片 (Image)
- 📠 条形码 (Barcode)
- 📱 二维码 (QR Code)
- ➖ 线条 (Line)
- ⬜ 边框 (Box)

### 2. 数据绑定

1. 选中组件
2. 在属性面板的"数据绑定"部分输入字段路径
3. 例如: `header.po_number` 或 `items[0].material_name`

**数据格式示例**:
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
      "quantity": 100,
      "unit_price": 1500
    }
  ]
}
```

### 3. 预览和测试

1. 切换到底部"数据源"标签
2. 编辑或加载测试数据（JSON格式）
3. 点击"验证"按钮检查JSON格式
4. 切换到"预览"标签查看填充后的效果

### 4. 保存和加载模板

**保存模板**:
1. 点击顶部"💾 保存"按钮
2. 输入模板名称和描述
3. 模板将保存到浏览器LocalStorage

**加载模板**:
1. 点击顶部"📂 读取"按钮
2. 选择已保存的模板

**导出/导入**:
- 📤 导出: 将模板保存为JSON文件
- 📥 导入: 从JSON文件加载模板

### 5. 打印和导出

- 🖨️ **打印**: 点击工具栏"打印"按钮
- 📄 **导出PDF**: 点击工具栏"导出PDF"按钮（需要jsPDF库）

---

## 🛠️ 键盘快捷键

- `Ctrl/Cmd + S`: 保存模板
- `Ctrl/Cmd + Z`: 撤销
- `Ctrl/Cmd + Shift + Z`: 重做
- `Delete/Backspace`: 删除选中组件
- `+`: 放大
- `-`: 缩小

---

## 📁 项目结构

```
svf-simulator/
│
├── index.html              # 主入口
│
├── css/                    # 样式文件
│   ├── main.css           # 主样式
│   ├── designer.css       # 设计器样式
│   └── components.css     # 组件样式
│
├── js/                     # JavaScript文件
│   ├── app.js             # 应用主逻辑
│   ├── designer.js        # 设计器核心
│   ├── utils.js           # 工具函数
│   ├── data-binding.js    # 数据绑定
│   ├── preview.js         # 预览功能
│   ├── pdf-generator.js   # PDF生成
│   └── template-manager.js # 模板管理
│
├── libs/                   # 第三方库
│   ├── interact.min.js    # 拖拽库
│   └── jspdf.min.js       # PDF生成库
│
├── templates/              # 模板示例
│   └── examples/
│       ├── po_form.json   # 发注书模板
│       └── invoice.json   # 发票模板
│
├── data/                   # 示例数据
│   └── samples/
│       └── po_data.json   # 发注书数据
│
└── README.md              # 本文档
```

---

## 🎯 实战练习：创建发注书（ZPOF001）

### 步骤1: 设计表头

1. 拖拽"标签"组件，输入"発注書"（发注书标题）
2. 设置字体大小为24px，粗体
3. 拖拽"文本框"组件用于发注番号
4. 绑定数据: `header.po_number`

### 步骤2: 添加基本信息

添加以下字段（使用标签+文本框组合）:
- 发注日期: `header.po_date`
- 供应商名: `header.vendor_name`
- 供应商地址: `header.vendor_address`

### 步骤3: 创建明细表格

1. 拖拽"表格"组件
2. 设置行数: 5，列数: 6
3. 表头: 行番号、品番、品名、数量、单价、金额
4. 数据绑定: 
   - 使用循环绑定 `items[]` 数组
   - 每列绑定对应字段

### 步骤4: 添加合计栏

添加以下字段:
- 小计: `summary.subtotal`
- 消费税: `summary.tax_amount`
- 合计: `summary.total`

### 步骤5: 测试和预览

1. 切换到"数据源"标签
2. 加载示例数据或输入自定义数据
3. 切换到"预览"标签查看效果
4. 调整布局直到满意

### 步骤6: 保存模板

1. 点击"💾 保存"
2. 命名为"ZPOF001"
3. 描述为"发注书模板"

---

## 🌐 部署到网络

### 选项1: GitHub Pages（推荐）

1. 创建GitHub仓库
2. 上传svf-simulator文件夹
3. 在仓库设置中启用GitHub Pages
4. 访问: `https://your-username.github.io/svf-simulator/`

### 选项2: Netlify

1. 注册Netlify账号
2. 拖拽svf-simulator文件夹到Netlify
3. 获得访问链接: `https://your-site.netlify.app`

### 选项3: Vercel

```bash
npm i -g vercel
cd svf-simulator
vercel
```

---

## 🔧 高级功能（开发中）

以下功能正在开发中：

- [ ] 完整的interact.js拖拽集成
- [ ] 实时数据绑定预览
- [ ] PDF导出功能
- [ ] 模板库（预置常用模板）
- [ ] 多语言支持
- [ ] 协作功能（多人编辑）
- [ ] 版本历史
- [ ] 组件库扩展

---

## 🐛 故障排查

### 问题1: 组件无法拖拽
**解决**: 确保已正确加载 `interact.min.js` 库

### 问题2: 无法保存模板
**解决**: 检查浏览器LocalStorage是否被禁用或已满

### 问题3: PDF导出不工作
**解决**: 确保已加载 `jspdf.min.js` 库

### 问题4: 预览不显示数据
**解决**: 检查JSON格式是否正确，字段路径是否匹配

---

## 📚 参考资源

- **SVF官方资料**: (如有)
- **interact.js文档**: https://interactjs.io/docs/
- **jsPDF文档**: https://artskydj.github.io/jsPDF/docs/
- **SAP表单开发**: (相关SAP文档)

---

## 🤝 贡献

欢迎贡献代码和建议！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 自由使用和修改

---

## 📞 联系方式

如有问题或建议，请联系项目维护者。

---

**版本**: v1.0  
**创建日期**: 2026-11-09  
**最后更新**: 2026-11-09

---

## 🎓 培训材料

### 培训场景1: 新人入门

**目标**: 学习SVF基础设计流程

**练习**:
1. 创建简单的名片设计
2. 添加文本和图片组件
3. 调整布局和样式

**时间**: 30分钟

### 培训场景2: 数据绑定

**目标**: 理解数据绑定概念

**练习**:
1. 加载示例数据
2. 绑定字段到组件
3. 预览数据填充效果

**时间**: 45分钟

### 培训场景3: 复杂表单

**目标**: 设计复杂业务表单

**练习**:
1. 创建ZPOF001发注书
2. 使用表格组件
3. 添加计算字段

**时间**: 60分钟

---

**Happy Designing! 🎨**
