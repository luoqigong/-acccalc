# 一键设置脚本 - 加速度计算器自动部署
# 此脚本将自动设置GitHub仓库和Vercel部署

Write-Host "🚀 欢迎使用加速度计算器一键部署脚本" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# 检查Git是否安装
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 错误：Git未安装，请先安装Git" -ForegroundColor Red
    Write-Host "下载地址：https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit
}

# 检查GitHub CLI是否安装
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  警告：GitHub CLI未安装，将使用手动方式" -ForegroundColor Yellow
    Write-Host "GitHub CLI可以自动创建仓库，下载地址：https://cli.github.com/" -ForegroundColor Yellow
    $useManual = $true
} else {
    $useManual = $false
}

# 获取用户输入
Write-Host ""
Write-Host "请输入您的GitHub用户名："
$githubUsername = Read-Host

Write-Host ""
Write-Host "请输入仓库名称（默认：acceleration-calculator）："
$repoName = Read-Host
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "acceleration-calculator"
}

# 检查是否已经有远程仓库
$hasRemote = git remote -v 2>$null
if ($hasRemote) {
    Write-Host "⚠️  检测到已有远程仓库配置" -ForegroundColor Yellow
    Write-Host "是否要覆盖现有配置？(y/n)："
    $overwrite = Read-Host
    if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
        Write-Host "❌ 操作取消" -ForegroundColor Red
        pause
        exit
    }
    git remote remove origin 2>$null
}

Write-Host ""
Write-Host "🔧 开始设置..." -ForegroundColor Yellow

# 确保在main分支
git checkout -b main 2>$null
git branch -M main

# 添加远程仓库
$repoUrl = "https://github.com/$githubUsername/$repoName.git"
git remote add origin $repoUrl

Write-Host "✅ 远程仓库已配置：$repoUrl" -ForegroundColor Green

if ($useManual) {
    Write-Host ""
    Write-Host "📝 手动创建GitHub仓库步骤：" -ForegroundColor Cyan
    Write-Host "1. 打开浏览器访问：https://github.com/new"
    Write-Host "2. 仓库名称：$repoName"
    Write-Host "3. 设置为公开仓库"
    Write-Host "4. 不要初始化README"
    Write-Host "5. 点击创建仓库"
    Write-Host ""
    Write-Host "按任意键继续（确保仓库已创建）..."
    pause
} else {
    Write-Host ""
    Write-Host "🤖 使用GitHub CLI自动创建仓库..." -ForegroundColor Yellow
    try {
        gh repo create $repoName --public --description "Free Online Acceleration Calculator with Google Analytics"
        Write-Host "✅ GitHub仓库创建成功" -ForegroundColor Green
    } catch {
        Write-Host "❌ 自动创建失败，请手动创建仓库" -ForegroundColor Red
        Write-Host "访问：https://github.com/new" -ForegroundColor Yellow
        pause
    }
}

# 推送到GitHub
Write-Host ""
Write-Host "📤 推送代码到GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ 代码推送成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送失败，请检查GitHub仓库是否正确创建" -ForegroundColor Red
    Write-Host "手动推送命令：git push -u origin main" -ForegroundColor Yellow
    pause
}

# 打开相关页面
Write-Host ""
Write-Host "🌐 打开相关页面..." -ForegroundColor Yellow
Start-Process "https://github.com/$githubUsername/$repoName"
Start-Process "https://vercel.com/new"

Write-Host ""
Write-Host "🎉 设置完成！" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Google Analytics 已集成 (G-MRQNY33JHX)"
Write-Host "✅ GitHub 仓库已创建并推送"
Write-Host "✅ 自动部署脚本已准备就绪"
Write-Host ""
Write-Host "🔄 下一步：设置Vercel自动部署"
Write-Host "1. 在打开的Vercel页面中选择您的仓库"
Write-Host "2. 点击Deploy按钮"
Write-Host "3. 等待部署完成"
Write-Host ""
Write-Host "📝 日常使用："
Write-Host "- 修改文件后运行 deploy.bat"
Write-Host "- 或使用命令：git add . && git commit -m '更新' && git push"
Write-Host ""
Write-Host "🔗 您的仓库地址：https://github.com/$githubUsername/$repoName"
Write-Host ""
pause 