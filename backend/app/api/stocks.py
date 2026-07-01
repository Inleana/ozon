from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.product import Product
from app.models.user import User
from app.models.warehouse import WarehouseStock
from app.schemas.warehouse import WarehouseStockOut

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("", response_model=list[WarehouseStockOut])
async def list_stocks(
    warehouse_id: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[WarehouseStock]:
    stmt = (
        select(WarehouseStock)
        .join(Product, Product.id == WarehouseStock.product_id)
        .where(Product.user_id == current_user.id)
    )
    if warehouse_id:
        stmt = stmt.where(WarehouseStock.warehouse_id == warehouse_id)
    return list(await db.scalars(stmt.order_by(WarehouseStock.id.desc())))
