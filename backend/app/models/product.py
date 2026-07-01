from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    ozon_product_id: Mapped[str | None] = mapped_column(
        String(50), unique=True, index=True
    )
    article: Mapped[str | None] = mapped_column(String(100), index=True)
    oem_number: Mapped[str | None] = mapped_column(String(100), index=True)
    name: Mapped[str | None] = mapped_column(String(500))
    brand: Mapped[str | None] = mapped_column(String(100))
    category: Mapped[str | None] = mapped_column(String(100))
    price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    recommended_price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    description: Mapped[str | None] = mapped_column(Text)
    characteristics: Mapped[dict | None] = mapped_column(JSONB)
    images: Mapped[list | None] = mapped_column(JSONB)
    videos: Mapped[list | None] = mapped_column(JSONB)
    status: Mapped[str] = mapped_column(String(20), default="draft")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="products")  # noqa: F821
    competitor_prices: Mapped[list["CompetitorPrice"]] = relationship(  # noqa: F821
        back_populates="product", cascade="all, delete-orphan"
    )
    warehouse_stock: Mapped[list["WarehouseStock"]] = relationship(  # noqa: F821
        back_populates="product", cascade="all, delete-orphan"
    )
