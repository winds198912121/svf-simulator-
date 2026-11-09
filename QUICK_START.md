# SVF Simulator - 5分钟快速入门

## 🚀 最快启动方式

### 方法1: 一键启动（推荐）

**Mac/Linux**:
```bash
cd svf-simulator
./start.sh
```

**Windows**:
```cmd
cd svf-simulator
start.bat
```

然后浏览器访问: http://localhost:8000

### 方法2: 直接打开

1. 下载必要库文件（见下方）
2. 双击 `index.html`

---

## 📦 下载必要库文件

在 `libs/` 目录下执行：

```bash
# 下载 interact.js
curl -o interact.min.js https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js

# 下载 jsPDF
curl -o jspdf.min.js https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

或者修改 `index.html` 使用CDN（无需下载）:
```html
<!-- 找到这两行并取消注释 -->
<script src="https://cdn.jsdelivr.net/npm/interactjs@1.10.19/dist/interact.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

---

## 🎯 第一个表单（5分钟）

### Step 1: 打开应用
浏览器访问 http://localhost:8000

### Step 2: 添加标题
1. 从左侧拖拽"🏷️ 标签"到画布
2. 在右侧属性面板修改文本为"発注書"
3. 设置字体大小为24

### Step 3: 添加字段
1. 拖拽"📝 文本框"
2. 在属性面板的"数据绑定"输入: `header.po_number`

### Step 4: 预览
1. 点击底部"数据源"标签
2. 点击"📥 加载示例"按钮
3. 点击"预览"标签查看效果

### Step 5: 保存
1. 点击顶部"💾 保存"按钮
2. 输入名称"My First Form"
3. 点击"保存"

**完成！** 🎉

---

## 🎓 进阶练习

### 练习1: 加载示例模板（5分钟）

1. 点击底部"模板库"标签
2. 点击"ZPOF001"卡片的"加载"按钮
3. 查看完整的发注书模板
4. 修改部分组件位置
5. 保存为新模板

### 练习2: 自定义数据（10分钟）

1. 切换到"数据源"标签
2. 修改JSON数据:
```json
{
  "header": {
    "po_number": "PO-YOUR-001",
    "po_date": "2026-11-10",
    "vendor_name": "Your Company"
  }
}
```
3. 点击"✓ 验证"确认格式
4. 切换到"预览"查看更新

### 练习3: 创建表格（15分钟）

1. 拖拽"📊 表格"组件
2. 调整大小和位置
3. 在属性面板设置:
   - 行数: 5
   - 列数: 4
4. 绑定到数组数据: `items`
5. 预览查看表格填充

---

## 🔧 常见问题

### Q: 组件拖不动？
**A**: 确保已加载 `interact.min.js` 库

### Q: 预览没有数据？
**A**: 
1. 检查JSON格式（点击"验证"按钮）
2. 确认数据绑定字段路径正确
3. 例如: `header.po_number` 而非 `po_number`

### Q: 如何删除组件？
**A**: 
1. 点击选中组件
2. 按 `Delete` 或 `Backspace` 键

### Q: 如何撤销操作？
**A**: 
- Mac: `Cmd + Z`
- Windows/Linux: `Ctrl + Z`

---

## 📚 下一步

完成快速入门后，建议：

1. 📖 阅读完整的 [README.md](README.md)
2. 🏗️ 查看 [设计文档](../docs/SVF_SIMULATOR_DESIGN.md)
3. 🎨 尝试创建完整的发注书（ZPOF001）
4. 🌐 部署到网络供团队使用

---

## 💡 快捷键速查

| 功能 | Mac | Windows/Linux |
|------|-----|---------------|
| 保存 | `Cmd + S` | `Ctrl + S` |
| 撤销 | `Cmd + Z` | `Ctrl + Z` |
| 重做 | `Cmd + Shift + Z` | `Ctrl + Shift + Z` |
| 删除 | `Delete` | `Delete` |
| 放大 | `+` | `+` |
| 缩小 | `-` | `-` |

---

## 🎯 学习路径

### 初级（第1-2周）
- ✅ 完成快速入门
- ✅ 理解基础组件
- ✅ 掌握数据绑定
- ✅ 保存和加载模板

### 中级（第3-4周）
- 🎯 创建复杂表单（表格、计算）
- 🎯 使用所有组件类型
- 🎯 导入/导出模板
- 🎯 打印和PDF输出

### 高级（第5-6周）
- 🚀 自定义组件样式
- 🚀 复杂数据绑定（嵌套、循环）
- 🚀 批量模板创建
- 🚀 团队协作实践

---

**开始你的SVF之旅！** 🎨✨
