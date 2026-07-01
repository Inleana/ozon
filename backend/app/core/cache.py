import json
from typing import Any

import redis.asyncio as aioredis

from app.core.config import settings

_redis: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def cache_get(key: str) -> Any | None:
    value = await get_redis().get(key)
    return json.loads(value) if value is not None else None


async def cache_set(key: str, value: Any, ttl: int | None = None) -> None:
    await get_redis().set(
        key, json.dumps(value, default=str), ex=ttl or settings.cache_ttl_seconds
    )
