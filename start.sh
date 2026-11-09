#!/bin/bash

# SVF Simulator - Quick Start Script

echo "================================"
echo "  SVF Simulator - 启动中..."
echo "================================"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✓ 找到 Python 3"
    echo ""
    echo "启动本地服务器于 http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    echo "================================"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ 找到 Python"
    echo ""
    echo "启动本地服务器于 http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    echo "================================"
    python -m http.server 8000
else
    echo "✗ 未找到 Python"
    echo ""
    echo "请安装 Python 或直接在浏览器中打开 index.html"
    echo ""
    echo "或者使用 Node.js:"
    echo "  npx http-server -p 8000"
    echo ""
fi
