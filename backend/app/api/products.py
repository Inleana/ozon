from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import (
    CostBreakdown,
    ProductCreate,
    ProductDetail,
    ProductOut,
    ProductUpdate,
)
from app.services.pricing import calculate_cost

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Product]:
    stmt = select(Product).where(Product.user_id == current_user.id)
    if search:
        like = f"%{search}%"
        stmt = stmt.where(Product.name.ilike(like) | Product.article.ilike(like))
    stmt = stmt.order_by(Product.id.desc()).offset(skip).limit(limit)
    return list(await db.scalars(stmt))


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Product:
    product = Product(user_id=current_user.id, **payload.model_dump(exclude_none=True))
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def _get_owned_product(
    product_id: int, user: User, db: AsyncSession
) -> Product:
    stmt = (
        select(Product)
        .where(Product.id == product_id, Product.user_id == user.id)
        .options(selectinload(Product.competitor_prices))
    )
    product = await db.scalar(stmt)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return product


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Product:
    return await _get_owned_product(product_id, current_user, db)


@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    payload: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Product:
    product = await _get_owned_product(product_id, current_user, db)
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(product, key, value)
    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    product = await _get_owned_product(product_id, current_user, db)
    await db.delete(product)
    await db.commit()


@router.get("/{product_id}/cost", response_model=CostBreakdown)
async def product_cost(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CostBreakdown:
    product = await _get_owned_product(product_id, current_user, db)
    if not product.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Product has no price"
        )
    return calculate_cost(float(product.price))
