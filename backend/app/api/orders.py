from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderOut

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderOut])
async def list_orders(
    status: str | None = Query(None),
    only_cancelled: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Order]:
    stmt = select(Order).where(Order.user_id == current_user.id)
    if status:
        stmt = stmt.where(Order.status == status)
    if only_cancelled:
        stmt = stmt.where(Order.cancelled_at.isnot(None))
    return list(await db.scalars(stmt.order_by(Order.id.desc())))
