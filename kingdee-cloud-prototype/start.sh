#!/bin/bash

echo "🚀 启动金蝶星空云原型系统..."
echo "📦 正在安装依赖..."

if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🔧 启动开发服务器..."
echo "💡 登录信息: 用户名 admin, 密码 123456"
echo "🌐 访问地址: http://localhost:3000"
echo ""

npm run dev