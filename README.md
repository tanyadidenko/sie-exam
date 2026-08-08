# SIE Exam Trainer

Веб-приложение для подготовки к экзамену **SIE (Securities Industry Essentials)**.

**Локальная версия:** http://localhost:3008/
**Production:** https://tanya.didenko.space/sie-exam/

## 📋 О проекте

SIE Exam Trainer — это мобильное веб-приложение (PWA) для систематической подготовки к экзамену SIE, который проводится FINRA (Financial Industry Regulatory Authority) для работы в финансовой индустрии США.

### Возможности

- 📚 **База вопросов** по всем темам экзамена SIE
- 🎯 **Практика по темам** — тренировка по конкретным разделам
-  **Полные тесты** — симуляция реального экзамена (75 вопросов, 105 минут)
- 🔄 **Повторение ошибок** — работа над проблемными вопросами
- 📊 **Статистика прогресса** — отслеживание результатов
-  **Система достижений** — геймификация обучения
- 📱 **PWA** — работает на мобильных устройствах

## ️ Технологический стек

**Backend:**
- Node.js 20+ (Express.js)
- SQLite (better-sqlite3) — база данных пользователей и прогресса

**Frontend:**
- Vanilla JavaScript (без фреймворков)
- HTML5 + CSS3
- PWA (Progressive Web App)
- Service Worker для оффлайн-работы

**Инфраструктура:**
- Docker + Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL

##  Быстрый старт

### Локальный запуск

```bash
cd "c:\AI-projects\SIE EXAM"
npm install
npm start
```

Откройте http://localhost:3008/ в браузере.

### Деплой на VPS

```bash
# Копирование файлов на сервер
echo towH5zJWZ3 | pscp -pw towH5zJWZ3 -r "c:\AI-projects\SIE EXAM\*" root@185.11.246.168:/opt/didenko/sie-exam/

# Перезапуск контейнера
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "cd /opt/didenko/sie-exam && docker-compose restart"

# Проверка логов
echo towH5zJWZ3 | plink -ssh root@185.11.246.168 -pw towH5zJWZ3 -batch "docker logs sie-exam --tail 50"
```

## 📊 Структура экзамена SIE

| Тема | Вес |
|------|-----|
| Knowledge of Capital Markets | 16% |
| Understanding Products and Their Risks | 44% |
| Understanding Trading, Customer Accounts, and Prohibited Activities | 31% |
| Overview of the Regulatory Framework | 9% |

**Всего вопросов:** 75
**Время:** 105 минут
**Проходной балл:** 70%

## 📁 Структура проекта

```
SIE EXAM/
├── server.js                    # Backend сервер (Express + API)
├── package.json                 # Зависимости Node.js
├── .env                         # Конфигурация (НЕ КОММИТИТЬ)
├── .env.example                 # Шаблон конфигурации
├── .gitignore                   # Исключения для Git
├── data.db                      # SQLite база данных (НЕ КОММИТИТЬ)
├── docker-compose.yml           # Docker оркестрация
├── Dockerfile                   # Образ контейнера
├── nginx.conf                   # Конфигурация Nginx
├── topics.json                  # Структура тем экзамена
├── questions.json               # База вопросов
├── learning-methodology.json    # Методология обучения
├── achievements.json            # Система достижений
├── daily-goals.json             # Ежедневные цели
├── frontend/                    # Frontend приложение
│   ├── index.html               # Главное приложение
│   ├── manifest.json            # PWA манифест
│   ├── icon.svg                 # Иконка приложения
│   └── sw.js                    # Service Worker
├── .business/                   # Бизнес-контекст
├── plans/                       # Технические планы
├── prompts/                     # Библиотека промптов
├── retrospectives/              # Итоги итераций
└── templates/                   # Шаблоны
```

## 🔐 Безопасность

**НЕ КОММИТИТЬ:**
- `.env` — содержит конфигурацию
- `data.db` — база данных пользователей и прогресса

##  Поддержка

**Разработчик:** Татьяна Диденко (с помощью Qwen Code)
**Пользователь:** Сын Татьяны
**Production:** https://tanya.didenko.space/sie-exam/
