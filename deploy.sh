#!/bin/bash

# 自动部署脚本
# 这个脚本会自动提交更改到GitHub，然后Vercel会自动部署

echo "🚀 开始自动部署..."

# 检查git状态
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 错误：不在git仓库中"
    exit 1
fi

# 添加所有更改
echo "📦 添加文件..."
git add .

# 检查是否有更改
if git diff --cached --quiet; then
    echo "✅ 没有新的更改需要提交"
    exit 0
fi

# 提交更改
echo "💾 提交更改..."
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "🔄 自动部署 - Google Analytics 已添加 - $TIMESTAMP"

# 推送到GitHub
echo "🌐 推送到GitHub..."
git push origin main || git push origin master

echo "✅ 部署完成！"
echo "🔗 Vercel将在几分钟内自动部署您的网站"
echo "📊 Google Analytics现在已经集成到您的网站中" 