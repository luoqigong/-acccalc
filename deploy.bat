@echo off
chcp 65001 > nul
title 自动部署到GitHub和Vercel

echo 🚀 开始自动部署...

REM 检查git状态
git rev-parse --git-dir > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：不在git仓库中
    pause
    exit /b 1
)

REM 添加所有更改
echo 📦 添加文件...
git add .

REM 检查是否有更改
git diff --cached --quiet > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 没有新的更改需要提交
    pause
    exit /b 0
)

REM 获取当前时间
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set timestamp=%mydate% %mytime%

REM 提交更改
echo 💾 提交更改...
git commit -m "🔄 自动部署 - Google Analytics 已添加 - %timestamp%"

REM 推送到GitHub (使用仓库 acccalc)
echo 🌐 推送到GitHub...
git push origin main
if %errorlevel% neq 0 (
    git push origin master
)

echo.
echo ✅ 部署完成！
echo 🔗 Vercel将在几分钟内自动部署您的网站
echo 📊 Google Analytics现在已经集成到您的网站中
echo.
pause 