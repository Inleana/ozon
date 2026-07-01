# Ozonak.online

SaaS-платформа для оптимизации работы продавца на Ozon: управление товарами,
остатками, неликвидом, создание карточек с помощью AI (DeepSeek) и мониторинг
цен конкурентов.

## Стек

- **Backend:** Python 3.12 + FastAPI (async), SQLAlchemy 2.0, Alembic
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **База данных:** PostgreSQL 16
- **Кэш / брокер:** Redis 7
- **Фоновые задачи:** Celery (worker + beat)
- **Инфраструктура:** Docker Compose, Nginx

## Структура

```
ozonak/
├── backend/          # FastAPI приложение
│   ├── app/
│   │   ├── api/      # эндпоинты
│   │   ├── core/     # config, database, security, cache
│   │   ├── models/   # SQLAlchemy модели
│   │   ├── schemas/  # Pydantic схемы
│   │   ├── services/ # бизнес-логика (Ozon, DeepSeek, pricing)
│   │   └── tasks/    # Celery задачи
│   └── alembic/      # миграции
├── frontend/         # React + Vite
├── nginx/            # reverse proxy
├── docker-compose.yml
├── deploy.sh
└── .env.example
```

## Быстрый старт (Docker)

```bash
cp .env.example .env
# заполните OZON_* и DEEPSEEK_API_KEY своими ключами
docker compose up --build
```

- Frontend + API через Nginx: http://localhost
- API напрямую: http://localhost:8000/api/docs
- Health-check: http://localhost:8000/api/health

## Локальная разработка

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# нужен запущенный Postgres + Redis (можно из docker compose)
alembic revision --autogenerate -m "init"   # первая генерация
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173 (проксирует /api на :8000)
```

## Реализовано (v1)

- JWT-аутентификация (register/login/refresh/me/logout)
- CRUD товаров, расчёт себестоимости (комиссия, эквайринг, логистика, FBS/FBO)
- Остатки по складам, заказы (в т.ч. отказы)
- Загрузка неликвида из Excel с проверкой дубликатов по OEM
- Скелеты интеграций OzonService и DeepSeekService
- Celery-задачи и beat-расписание (синхронизация, парсинг цен)
- Frontend: страницы Товары, Остатки, Неликвид, Создание карточки, Настройки

## Требует доработки (нужны реальные доступы/решения)

- Парсеры цен конкурентов (Emex, Exist, Wildberries, Яндекс.Маркет)
- Поиск и скачивание изображений по OEM-номеру
- Полная синхронизация с Ozon Seller API (нужны рабочие ключи)
- WebSockets для обновлений в реальном времени
- Деплой на VPS (`deploy.sh`, Nginx + Let's Encrypt)

## Деплой

См. `deploy.sh` и `nginx/nginx.conf`. На VPS (Ubuntu 22.04) с установленным
Docker: заполните `.env`, затем `./deploy.sh`.
