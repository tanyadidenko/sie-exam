@echo off
REM SIE EXAM - Деплой на VPS сервер
REM Этот скрипт копирует файлы на сервер и перезапускает контейнер

echo  Начало деплоя SIE EXAM Trainer...

REM Копирование файлов на сервер
echo 📦 Копирование файлов на сервер...
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 -r "c:\AI-projects\SIE EXAM\*" root@185.11.246.168:/opt/didenko/sie-exam/

REM Пересборка и перезапуск контейнера
echo 🔨 Пересборка контейнера...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "cd /opt/didenko/sie-exam && docker-compose build && docker-compose up -d"

REM Проверка статуса
echo ✅ Проверка статуса...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "docker ps | grep sie-exam"

echo 🎉 Деплой завершён!
echo 📱 Приложение доступно по адресу: https://tanya.didenko.space/sie-exam/
pause
