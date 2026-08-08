@echo off
REM SIE EXAM - Деплой с проверкой
REM Этот скрипт деплоит приложение и проверяет работоспособность

echo ====================================
echo SIE EXAM - Деплой и проверка
echo ====================================
echo.

REM Шаг 1: Копирование файлов
echo [1/5] Копирование файлов на сервер...
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 -r "c:\AI-projects\SIE EXAM\*" root@185.11.246.168:/opt/didenko/sie-exam/
if errorlevel 1 (
    echo ОШИБКА: Не удалось скопировать файлы
    pause
    exit /b 1
)
echo OK
echo.

REM Шаг 2: Пересборка контейнера
echo [2/5] Пересборка Docker контейнера...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "cd /opt/didenko/sie-exam && docker-compose build && docker-compose up -d"
if errorlevel 1 (
    echo ОШИБКА: Не удалось собрать контейнер
    pause
    exit /b 1
)
echo OK
echo.

REM Шаг 3: Проверка контейнера
echo [3/5] Проверка статуса контейнера...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "docker ps | grep sie-exam"
if errorlevel 1 (
    echo ОШИБКА: Контейнер не запущен
    pause
    exit /b 1
)
echo OK
echo.

REM Шаг 4: Проверка CSP заголовков
echo [4/5] Проверка CSP заголовков (JavaScript)...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "curl -sI https://tanya.didenko.space/sie-exam/ | grep -i 'content-security' | tr ';' '\n' | grep script"
echo.
echo Проверьте, что есть: script-src-attr 'unsafe-inline'
echo.

REM Шаг 5: Проверка API
echo [5/5] Проверка API endpoints...
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "curl -s https://tanya.didenko.space/sie-exam/api/topics | python3 -c 'import sys, json; data=json.load(sys.stdin); print(f\"Topics: {len(data)}\")'"
echo.

echo ====================================
echo Деплой завершён!
echo ====================================
echo.
echo Ссылка: https://tanya.didenko.space/sie-exam/
echo.
echo ВАЖНО: Очистите кэш браузера (Ctrl+Shift+Delete)
echo.
pause
