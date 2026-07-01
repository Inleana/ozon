import logging
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)


class OzonAPIError(Exception):
    pass


class OzonService:
    """Thin async client for the Ozon Seller API.

    Docs: https://docs.ozon.ru/api/seller/
    """

    def __init__(
        self,
        client_id: str | None = None,
        api_key: str | None = None,
        base_url: str | None = None,
    ) -> None:
        self.client_id = client_id or settings.ozon_client_id
        self.api_key = api_key or settings.ozon_api_key
        self.base_url = (base_url or settings.ozon_api_url).rstrip("/")

    @property
    def _headers(self) -> dict[str, str]:
        return {
            "Client-Id": self.client_id,
            "Api-Key": self.api_key,
            "Content-Type": "application/json",
        }

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    async def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(url, headers=self._headers, json=payload)
            if resp.status_code >= 400:
                logger.error("Ozon API error %s: %s", resp.status_code, resp.text)
                raise OzonAPIError(f"{resp.status_code}: {resp.text}")
            return resp.json()

    async def get_products_list(
        self, limit: int = 100, last_id: str = ""
    ) -> dict[str, Any]:
        return await self._post(
            "/v2/product/list",
            {"filter": {"visibility": "ALL"}, "limit": limit, "last_id": last_id},
        )

    async def get_product_info(self, product_id: int) -> dict[str, Any]:
        return await self._post("/v2/product/info", {"product_id": product_id})

    async def get_stocks(self, limit: int = 100, last_id: str = "") -> dict[str, Any]:
        return await self._post(
            "/v4/product/info/stocks",
            {"filter": {"visibility": "ALL"}, "limit": limit, "last_id": last_id},
        )

    async def get_orders(
        self, status: str | None = None, limit: int = 100
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {"dir": "DESC", "limit": limit, "offset": 0}
        if status:
            payload["filter"] = {"status": status}
        return await self._post("/v2/posting/fbs/list", payload)

    async def create_product(self, product_data: dict[str, Any]) -> dict[str, Any]:
        return await self._post("/v2/product/import", {"items": [product_data]})

    async def upload_image(
        self, product_id: int, image_urls: list[str]
    ) -> dict[str, Any]:
        return await self._post(
            "/v1/product/pictures/import",
            {"product_id": product_id, "images": image_urls},
        )
