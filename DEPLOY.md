# Инструкция по деплою SIE EXAM Trainer

##  Предварительные требования

- VPS-сервер: 185.11.246.168
- Домен: tanya.didenko.space
- Docker и Docker Compose на сервере
- Nginx reverse proxy настроен

##  Шаги деплоя

### 1. Копирование файлов на сервер

```bash
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 -r "c:\AI-projects\SIE EXAM\*" root@185.11.246.168:/opt/didenko/sie-exam/
```

### 2. Подключение к серверу

```bash
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch
```

### 3. Сборка и запуск контейнера

```bash
cd /opt/didenko/sie-exam
docker-compose build
docker-compose up -d
```

### 4. Проверка контейнера

```bash
docker ps | grep sie-exam
docker logs sie-exam --tail 50
```

### 5. Настройка Nginx

Добавить в конфигурацию Nginx (обычно `/etc/nginx/sites-available/default` или отдельный файл):

```nginx
location /sie-exam/ {
    proxy_pass http://localhost:3008/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Перезапустить Nginx:

```bash
nginx -t
systemctl reload nginx
```

### 6. Проверка работоспособности

Открыть в браузере: https://tanya.didenko.space/sie-exam/

Проверить:
- [ ] Страница загружается
- [ ] Кнопки работают
- [ ] API endpoints отвечают
- [ ] Нет ошибок в консоли браузера

## 🔄 Обновление после изменений

```bash
# Копирование изменённых файлов
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 "c:\AI-projects\SIE EXAM\server.js" root@185.11.246.168:/opt/didenko/sie-exam/
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 "c:\AI-projects\SIE EXAM\frontend\index.html" root@185.11.246.168:/opt/didenko/sie-exam/frontend/

# Перезапуск контейнера
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "cd /opt/didenko/sie-exam && docker-compose restart"

# Проверка логов
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "docker logs sie-exam --tail 50"
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

### Nginx возвращает 502

```bash
# Проверить, что контейнер запущен
docker ps | grep sie-exam

# Проверить порт
docker exec sie-exam netstat -tlnp

# Проверить конфигурацию Nginx
nginx -t
```

### База данных не создаётся

```bash
# Проверить права на папку
ls -la /opt/didenko/sie-exam/

# Создать папку data вручную
mkdir -p /opt/didenko/sie-exam/data
chmod 755 /opt/didenko/sie-exam/data
```

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

##  Безопасность

**НЕ КОММИТИТЬ:**
- `.env` файл с секретами
- `data.db` с данными пользователей

**На сервере:**
- Файл `.env` должен быть с правами 600
- Папка `data/` должна быть с правами 755

## 📞 Поддержка

При проблемах проверить:
1. Логи контейнера: `docker logs sie-exam`
2. Логи Nginx: `tail -f /var/log/nginx/error.log`
3. Статус контейнера: `docker ps`
4. Доступность порта: `curl http://localhost:3008/`
