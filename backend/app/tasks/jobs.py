import logging

from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.jobs.sync_ozon_products")
def sync_ozon_products(user_id: int | None = None) -> dict:
    """Synchronise products from Ozon into the local DB.

    Placeholder: wire OzonService.get_products_list + DB upsert here.
    """
    logger.info("sync_ozon_products user_id=%s", user_id)
    return {"status": "queued", "user_id": user_id}


@celery_app.task(name="app.tasks.jobs.sync_ozon_stocks")
def sync_ozon_stocks(user_id: int | None = None) -> dict:
    logger.info("sync_ozon_stocks user_id=%s", user_id)
    return {"status": "queued", "user_id": user_id}


@celery_app.task(name="app.tasks.jobs.sync_ozon_orders")
def sync_ozon_orders(user_id: int | None = None) -> dict:
    logger.info("sync_ozon_orders user_id=%s", user_id)
    return {"status": "queued", "user_id": user_id}


@celery_app.task(name="app.tasks.jobs.check_competitor_prices")
def check_competitor_prices(product_id: int | None = None) -> dict:
    """Scrape competitor marketplaces (Emex, Exist, WB, Yandex, Ozon).

    Placeholder: implement per-marketplace scrapers/parsers here.
    """
    logger.info("check_competitor_prices product_id=%s", product_id)
    return {"status": "queued", "product_id": product_id}


@celery_app.task(name="app.tasks.jobs.process_excel_upload")
def process_excel_upload(user_id: int, file_path: str) -> dict:
    logger.info("process_excel_upload user_id=%s file=%s", user_id, file_path)
    return {"status": "queued", "user_id": user_id}


@celery_app.task(name="app.tasks.jobs.download_product_images")
def download_product_images(oem_number: str) -> dict:
    """Search + download product images by OEM number.

    Placeholder: integrate an image search provider here.
    """
    logger.info("download_product_images oem=%s", oem_number)
    return {"status": "queued", "oem_number": oem_number}


@celery_app.task(name="app.tasks.jobs.generate_ai_description")
def generate_ai_description(product_id: int) -> dict:
    logger.info("generate_ai_description product_id=%s", product_id)
    return {"status": "queued", "product_id": product_id}
