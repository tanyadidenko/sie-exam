#!/bin/bash
# SIE EXAM - Автоматический деплой через GitHub
# Этот скрипт клонирует репозиторий, собирает и запускает контейнер

set -e

echo "🚀 Начало деплоя SIE EXAM Trainer..."

# Конфигурация
REPO_URL="https://github.com/tanyadidenko/sie-exam.git"
DEPLOY_DIR="/opt/didenko/sie-exam"
CONTAINER_NAME="sie-exam"

# Шаг 1: Клонирование или обновление репозитория
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "📦 Обновление репозитория..."
    cd "$DEPLOY_DIR"
    git pull origin master
else
    echo "📦 Клонирование репозитория..."
    git clone "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# Шаг 2: Сборка образа
echo "🔨 Сборка Docker образа..."
docker-compose build

# Шаг 3: Запуск контейнера
echo "🚀 Запуск контейнера..."
docker-compose up -d

# Шаг 4: Проверка
echo "✅ Проверка статуса..."
docker ps | grep "$CONTAINER_NAME"

echo "🎉 Деплой завершён!"
echo "📱 Приложение доступно по адресу: https://tanya.didenko.space/sie-exam/"
