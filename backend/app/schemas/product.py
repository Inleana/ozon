from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CompetitorPriceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    marketplace: str
    price: Decimal | None = None
    url: str | None = None
    checked_at: datetime


class ProductBase(BaseModel):
    article: str | None = None
    oem_number: str | None = None
    name: str | None = None
    brand: str | None = None
    category: str | None = None
    price: Decimal | None = None
    description: str | None = None
    characteristics: dict | None = None
    images: list[str] | None = None
    videos: list[str] | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    status: str | None = None
    recommended_price: Decimal | None = None


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ozon_product_id: str | None = None
    recommended_price: Decimal | None = None
    status: str
    created_at: datetime
    updated_at: datetime | None = None
    last_sync_at: datetime | None = None


class ProductDetail(ProductOut):
    competitor_prices: list[CompetitorPriceOut] = []


class CostBreakdown(BaseModel):
    price: float
    commission: float
    acquiring: float
    logistics: float
    drop_pvz: float
    fbs: float
    fbo: float
    total: float
    net_profit: float
