@echo off
REM SVF Simulator - Quick Start Script for Windows

echo ================================
echo   SVF Simulator - 启动中...
echo ================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ 找到 Python
    echo.
    echo 启动本地服务器于 http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    echo ================================
    python -m http.server 8000
) else (
    echo ✗ 未找到 Python
    echo.
    echo 请安装 Python 或直接在浏览器中打开 index.html
    echo.
    echo 或者使用 Node.js:
    echo   npx http-server -p 8000
    echo.
    pause
)
