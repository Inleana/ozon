---
name: testing-ozonak
description: Bring up the Ozonak.online stack locally and test the core auth → create-product → cost-breakdown flow end-to-end. Use when verifying Ozonak UI/API changes.
---

# Testing Ozonak.online

## Local stack bring-up (no external keys needed for core flow)

Postgres + Redis via Docker, backend via venv, frontend via Vite dev:

```bash
# DB + cache
docker start ozonak_pg ozonak_redis 2>/dev/null || {
  docker run -d --name ozonak_pg -e POSTGRES_USER=ozonak_user -e POSTGRES_PASSWORD=secure_password -e POSTGRES_DB=ozonak_db -p 5433:5432 postgres:16-alpine
  docker run -d --name ozonak_redis -p 6399:6379 redis:7-alpine
}

# backend (from backend/, venv created by blueprint: python -m venv .venv && pip install -r requirements.txt)
cd backend && . .venv/bin/activate
export DATABASE_URL="postgresql+asyncpg://ozonak_user:secure_password@localhost:5433/ozonak_db" \
       REDIS_URL="redis://localhost:6399/0" SECRET_KEY="testsecret" BACKEND_CORS_ORIGINS="*"
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# frontend (from frontend/) — Vite dev proxies /api → :8000
cd frontend && npm run dev &   # http://localhost:5173
```

Health check: `curl localhost:8000/api/health` → `{"status":"ok",...}`.

## Core E2E flow (UI at http://localhost:5173)

1. **Register**: `/login` → "Нет аккаунта? Регистрация" → fill логин/email/пароль → submit. Expect redirect to `/` (Dashboard) with username in header.
2. **Create card**: sidebar "Создание карточки" (`/create`), fill Название/Артикул/Бренд/Цена=2500. Click "Рекомендовать цену" → expect exactly **1023 ₽** (avg(1000,1200,1100)−7%, from hardcoded demo prices in CreateProductPage).
3. **Publish**: click "Опубликовать" → redirect to `/products`, product row visible.
4. **Cost breakdown**: click the product row → modal. For price 2500 expect: Комиссия 300, Эквайринг 50, Логистика 250, Дроп/ПВЗ 50, Итого расходы 650, Чистая прибыль 1850 ₽.

## Gotchas
- **Recommend-price button shifts down** after the result line appears — re-locate "Опубликовать" before clicking.
- **Cyrillic input via automation may be dropped** — use ASCII text for typed values if the harness swallows Cyrillic; the app itself handles Cyrillic fine.
- **"Найти через AI"** and Ozon sync need real keys and will error/stay empty without them — expected, out of scope for the core flow.
- Auth is JWT in localStorage; reload of a protected route should NOT redirect to `/login`.

## Devin Secrets Needed
- None for the core flow.
- `DEEPSEEK_API_KEY` — only to test AI product search/description.
- `OZON_CLIENT_ID` / `OZON_API_KEY` — only to test Ozon sync (products/stocks/orders).
