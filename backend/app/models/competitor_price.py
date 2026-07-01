from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CompetitorPrice(Base):
    __tablename__ = "competitor_prices"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), index=True
    )
    marketplace: Mapped[str] = mapped_column(String(50))
    price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    url: Mapped[str | None] = mapped_column(String(500))
    checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    product: Mapped["Product"] = relationship(  # noqa: F821
        back_populates="competitor_prices"
    )
