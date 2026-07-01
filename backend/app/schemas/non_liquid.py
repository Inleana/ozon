from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class NonLiquidOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    oem_number: str | None = None
    article: str | None = None
    name: str | None = None
    brand: str | None = None
    description: str | None = None
    is_checked: bool
    is_uploaded: bool
    price: Decimal | None = None
    recommended_price: Decimal | None = None
    images: list[str] | None = None
    status: str
    created_at: datetime


class NonLiquidUploadResult(BaseModel):
    total_rows: int
    created: int
    duplicates: int
