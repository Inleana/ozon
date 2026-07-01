#!/usr/bin/env bash
set -euo pipefail

# Deploy Ozonak.online to a VPS (Ubuntu 22.04) with Docker Compose + Nginx.

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Rebuilding containers..."
docker compose down
docker compose build --no-cache
docker compose up -d

echo ">>> Applying database migrations..."
docker compose exec -T backend alembic upgrade head

echo ">>> Deploy complete: https://${VPS_HOST:-ozonak.online}"
