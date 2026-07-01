from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ozon_order_id: str | None = None
    product_id: int | None = None
    status: str | None = None
    customer_name: str | None = None
    customer_phone: str | None = None
    created_at: datetime | None = None
    cancelled_at: datetime | None = None
