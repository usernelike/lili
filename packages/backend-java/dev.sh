#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，请先创建并配置"
    echo ""
    echo "   方式一：复制模板并填写"
    echo "   cp .env.example .env"
    echo ""
    echo "   方式二：直接编辑已创建好的 .env 文件"
    echo "   vim .env"
    echo ""
    exit 1
fi

echo "🚀 加载 .env 配置并启动 Spring Boot..."
source .env
mvn spring-boot:run
