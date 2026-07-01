import json
import logging
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)


class DeepSeekError(Exception):
    pass


class DeepSeekService:
    """Async client for the DeepSeek chat completions API."""

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        base_url: str | None = None,
    ) -> None:
        self.api_key = api_key or settings.deepseek_api_key
        self.model = model or settings.deepseek_model
        self.base_url = (base_url or settings.deepseek_api_url).rstrip("/")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    async def generate(
        self, prompt: str, system: str | None = None, json_mode: bool = False
    ) -> str:
        if not self.api_key:
            raise DeepSeekError("DEEPSEEK_API_KEY is not configured")
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        payload: dict[str, Any] = {"model": self.model, "messages": messages}
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if resp.status_code >= 400:
                logger.error("DeepSeek error %s: %s", resp.status_code, resp.text)
                raise DeepSeekError(f"{resp.status_code}: {resp.text}")
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def analyze_product(self, product_info: str) -> dict[str, Any]:
        prompt = f"""Проанализируй товар и дай рекомендации:
{product_info}

Ответь строго в формате JSON:
{{
    "recommended_price": число,
    "competitor_prices": [{{"marketplace": "название", "price": число}}],
    "best_marketplace": "название",
    "sales_tips": ["совет1", "совет2"],
    "product_quality": "оценка",
    "description_improvements": "рекомендации"
}}"""
        raw = await self.generate(prompt, json_mode=True)
        return _safe_json(raw)

    async def search_product_data(self, query: str) -> dict[str, Any]:
        prompt = f"""Найди информацию о товаре (автозапчасть): {query}
Ищи на Drive2, автофорумах, сайтах запчастей.
Верни строго JSON со структурой:
{{
    "name": "название",
    "brand": "марка авто",
    "model": "модель авто",
    "year": "год",
    "engine": "двигатель",
    "characteristics": {{}},
    "description": "описание",
    "analogs": ["аналог1"],
    "average_price": число
}}"""
        raw = await self.generate(prompt, json_mode=True)
        return _safe_json(raw)

    async def generate_description(
        self, name: str, characteristics: dict[str, Any] | None = None
    ) -> str:
        prompt = (
            f"Составь продающее описание товара для маркетплейса Ozon.\n"
            f"Название: {name}\nХарактеристики: {characteristics or {}}\n"
            f"Описание должно быть на русском, до 1000 символов."
        )
        return await self.generate(prompt)


def _safe_json(raw: str) -> dict[str, Any]:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"raw": raw}
