@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 请保持窗口开启，在浏览器打开 http://localhost:8080
where node >nul 2>nul
if %errorlevel% equ 0 (
  node scripts\serve.mjs
  goto done
)
where py >nul 2>nul
if %errorlevel% equ 0 (
  py -3 -m http.server 8080 --bind 127.0.0.1 --directory dist
  goto done
)
where python >nul 2>nul
if %errorlevel% equ 0 (
  python -m http.server 8080 --bind 127.0.0.1 --directory dist
  goto done
)
echo 未检测到 Node.js 或 Python。请从 https://nodejs.org/ 安装 Node.js LTS 后重试。
:done
pause
