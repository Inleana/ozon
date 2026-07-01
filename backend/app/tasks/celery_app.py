from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "ozonak",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.jobs"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

celery_app.conf.beat_schedule = {
    "sync-products-every-30-min": {
        "task": "app.tasks.jobs.sync_ozon_products",
        "schedule": 30 * 60,
    },
    "sync-stocks-every-15-min": {
        "task": "app.tasks.jobs.sync_ozon_stocks",
        "schedule": 15 * 60,
    },
    "sync-orders-every-5-min": {
        "task": "app.tasks.jobs.sync_ozon_orders",
        "schedule": 5 * 60,
    },
    "check-competitor-prices-hourly": {
        "task": "app.tasks.jobs.check_competitor_prices",
        "schedule": 60 * 60,
    },
}
