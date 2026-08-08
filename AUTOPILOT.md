# AUTOPILOT.md — Сценарий онбординга для SIE EXAM

> Этот файл помогает новой сессии Qwen быстро понять контекст проекта и продолжить работу.

##  Цель проекта

Создать веб-приложение тренажёр для подготовки к экзамену SIE (Securities Industry Essentials) для сына Татьяны.

## 📁 Структура проекта

```
SIE EXAM/
├── QWEN.md                      # Методология
├── AUTOPILOT.md                 # Этот файл
├── .business/INDEX.md           # Бизнес-контекст
├── plans/                       # Планы
├── prompts/                     # Промпты
├── retrospectives/              # Ретроспективы
├── templates/                   # Шаблоны
├── server.js                    # Backend (Express + SQLite)
├── package.json                 # Зависимости
├── .env                         # Конфигурация (НЕ КОММИТИТЬ)
├── .env.example                 # Шаблон конфигурации
├── .gitignore                   # Исключения Git
├── data.db                      # База данных (НЕ КОММИТИТЬ)
├── docker-compose.yml           # Docker
├── Dockerfile                   # Docker образ
├── nginx.conf                   # Nginx конфиг
├── topics.json                  # Темы экзамена
├── questions.json               # База вопросов
├── learning-methodology.json    # Методология обучения
├── achievements.json            # Достижения
├── daily-goals.json             # Ежедневные цели
└── frontend/                    # Frontend
    ├── index.html               # Главное приложение
    ├── manifest.json            # PWA манифест
    ├── icon.svg                 # Иконка
    └── sw.js                    # Service Worker
```

## 🚀 Быстрый старт

### Локальный запуск

```bash
cd "c:\AI-projects\SIE EXAM"
npm install
npm start
# Открыть http://localhost:3008/
```

### Деплой на VPS

```bash
# Копирование файлов
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 -r "c:\AI-projects\SIE EXAM\*" root@185.11.246.168:/opt/didenko/sie-exam/

# Перезапуск контейнера
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "cd /opt/didenko/sie-exam && docker-compose restart"

# Проверка логов
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "docker logs sie-exam --tail 50"
```

## 📊 Экзамен SIE

- **Организация:** FINRA
- **Вопросов:** 75
- **Время:** 105 минут
- **Проходной балл:** 70%
- **Темы:**
  1. Knowledge of Capital Markets (16%)
  2. Understanding Products and Their Risks (44%)
  3. Understanding Trading, Customer Accounts, and Prohibited Activities (31%)
  4. Overview of the Regulatory Framework (9%)

##  Ключевые файлы

- `questions.json` — база вопросов (21 вопрос в MVP, нужно расширить до 200+)
- `topics.json` — структура тем экзамена
- `server.js` — backend API
- `frontend/index.html` — frontend приложение

## ⚠️ Важные правила

1. **НЕ КОММИТИТЬ:** `.env`, `data.db`
2. **Деплой:** только на VPS `185.11.246.168`
3. **После деплоя:** проверять работоспособность JavaScript
4. **GitHub:** использовать SSH (`git@github.com:tanyadidenko/sie-exam`)

## 📞 Контакты

- **Разработчик:** Татьяна Диденко (с помощью Qwen Code)
- **Пользователь:** Сын Татьяны
- **Production:** https://tanya.didenko.space/sie-exam/
