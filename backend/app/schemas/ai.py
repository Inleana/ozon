from pydantic import BaseModel


class AnalyzePriceRequest(BaseModel):
    product_info: str


class GenerateDescriptionRequest(BaseModel):
    name: str
    characteristics: dict | None = None


class FindProductRequest(BaseModel):
    query: str


class RecommendPriceRequest(BaseModel):
    competitor_prices: list[float]
    discount_percent: float = 7.0


class AIResponse(BaseModel):
    result: dict | str
