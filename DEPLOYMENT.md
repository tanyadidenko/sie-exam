# SIE EXAM - Инструкция по деплою

##  Архитектура деплоя

```
GitHub Repository          VPS Server
(tanyadidenko/sie-exam)    (185.11.246.168)
        │                         │
        │  git push               │
        ├────────────────────────►│
        │                         │
        │                    ┌────▼────┐
        │                    │  Docker  │
        │                    │ Container│
        │                    │  sie-exam│
        │                    └────┬────
        │                         │
        │                    ┌────▼────┐
        │                    │  Nginx   │
        │                    │  Proxy   │
        │                    ────┬────┘
        │                         │
        └─────────────────────────
                     │
              https://tanya.didenko.space/sie-exam/
```

## 📦 Компоненты

### 1. GitHub Репозиторий
- **URL:** https://github.com/tanyadidenko/sie-exam
- **Ветка:** master
- **Доступ:** SSH или HTTPS с токеном

### 2. VPS Сервер
- **IP:** 185.11.246.168
- **Путь:** /opt/didenko/sie-exam
- **Контейнер:** sie-exam (порт 3008)
- **Nginx:** маршрутизация /sie-exam/

### 3. Docker Контейнер
- **Образ:** sie-exam-sie-exam:latest
- **Порт:** 3008
- **База данных:** SQLite (data.db)

##  Способы деплоя

### Способ 1: Автоматический (GitHub Actions)

При каждом push в ветку master автоматически запускается деплой.

**Настройка:**
1. Добавить секрет в GitHub Repository Settings → Secrets:
   - Name: `VPS_PASSWORD`
   - Value: `towH5zJWZ3`

2. Workflow файл: `.github/workflows/deploy.yml`

**Процесс:**
```bash
git push origin master
# → GitHub Actions автоматически деплоит на сервер
```

### Способ 2: Ручной (Windows)

Использовать скрипт `deploy.bat`:

```bash
cd "c:\AI-projects\SIE EXAM"
deploy.bat
```

**Что делает скрипт:**
1. Копирует файлы на сервер через pscp
2. Пересобирает Docker образ
3. Перезапускает контейнер

### Способ 3: Ручной (Linux/Mac)

Использовать скрипт `deploy.sh`:

```bash
cd /path/to/SIE EXAM
chmod +x deploy.sh
./deploy.sh
```

### Способ 4: Вручную через SSH

```bash
# 1. Подключение к серверу
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3

# 2. Переход в папку проекта
cd /opt/didenko/sie-exam

# 3. Обновление кода из GitHub
git pull origin master

# 4. Пересборка и перезапуск
docker-compose build
docker-compose up -d

# 5. Проверка
docker ps | grep sie-exam
docker logs sie-exam --tail 20
```

## 📁 Структура на сервере

```
/opt/didenko/sie-exam/
├── .git/                    # Git репозиторий
├── server.js                # Backend сервер
├── package.json             # Зависимости
├── docker-compose.yml       # Docker оркестрация
├── Dockerfile               # Образ контейнера
├── .env                     # Конфигурация
├── frontend/                # Frontend файлы
│   ├── index.html           # Главное приложение
│   ├── manifest.json        # PWA манифест
│   ├── icon.svg             # Иконка
│   └── sw.js                # Service Worker
├── topics.json              # Темы экзамена
├── questions.json           # База вопросов
├── achievements.json        # Достижения
├── daily-goals.json         # Ежедневные цели
├── learning-methodology.json # Методология
└── data/                    # База данных (монтируется)
    └── data.db
```

## 🔧 Nginx Конфигурация

Nginx маршрутизирует запросы `/sie-exam/` на контейнер:

```nginx
location /sie-exam/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://172.17.0.1:3008/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
    proxy_read_timeout 60s;
}
```

## 🐛 Troubleshooting

### Контейнер не запускается

```bash
# Проверить логи
docker logs sie-exam

# Проверить конфигурацию
docker-compose config

# Пересобрать образ
docker-compose build --no-cache
```

### API не отвечает

```bash
# Проверить, что контейнер запущен
docker ps | grep sie-exam

# Проверить порт
curl http://localhost:3008/api/topics

# Проверить логи
docker logs sie-exam --tail 50
```

### Nginx возвращает 502

```bash
# Проверить конфигурацию nginx
docker exec nginx-proxy nginx -t

# Перезагрузить nginx
docker exec nginx-proxy nginx -s reload

# Проверить, что контейнер доступен
curl http://172.17.0.1:3008/
```

### Кнопки не работают в браузере

1. Открыть консоль браузера (F12)
2. Проверить ошибки JavaScript
3. Проверить, что API endpoints отвечают:
   - https://tanya.didenko.space/sie-exam/api/topics
   - https://tanya.didenko.space/sie-exam/api/questions

## 📊 Мониторинг

### Логи приложения

```bash
docker logs sie-exam --tail 100
docker logs sie-exam -f  # в реальном времени
```

### Статус контейнера

```bash
docker stats sie-exam
docker inspect sie-exam
```

### База данных

```bash
docker exec sie-exam ls -la /app/data/
```

## 🔐 Безопасность

**Секреты:**
- Пароль VPS: хранится в GitHub Secrets
- .env файл: не коммитить в Git
- data.db: не коммитить в Git

**Права доступа:**
- Файл .env: chmod 600
- Папка data/: chmod 755

## 📞 Поддержка

При проблемах:
1. Проверить логи контейнера: `docker logs sie-exam`
2. Проверить статус: `docker ps`
3. Проверить API: `curl https://tanya.didenko.space/sie-exam/api/topics`
4. Проверить GitHub Actions: https://github.com/tanyadidenko/sie-exam/actions
