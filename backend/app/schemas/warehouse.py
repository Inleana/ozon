from datetime import datetime

from pydantic import BaseModel, ConfigDict


class WarehouseStockOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    warehouse_id: str | None = None
    warehouse_name: str | None = None
    quantity: int
    reserved: int
    available: int
    updated_at: datetime
