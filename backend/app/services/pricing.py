from app.schemas.product import CostBreakdown

# Default marketplace economics; can be tuned per user later.
COMMISSION_RATE = 0.12
ACQUIRING_RATE = 0.02
FBS_DELIVERY_RATE = 0.15
FBO_STORAGE_RATE = 0.10
LOGISTICS_FIXED = 250.0
DROP_PVZ_FIXED = 50.0


def calculate_cost(price: float) -> CostBreakdown:
    commission = price * COMMISSION_RATE
    acquiring = price * ACQUIRING_RATE
    fbs = price * FBS_DELIVERY_RATE + LOGISTICS_FIXED
    fbo = price * FBO_STORAGE_RATE
    total = commission + acquiring + LOGISTICS_FIXED + DROP_PVZ_FIXED
    return CostBreakdown(
        price=price,
        commission=round(commission, 2),
        acquiring=round(acquiring, 2),
        logistics=LOGISTICS_FIXED,
        drop_pvz=DROP_PVZ_FIXED,
        fbs=round(fbs, 2),
        fbo=round(fbo, 2),
        total=round(total, 2),
        net_profit=round(price - total, 2),
    )


def recommend_price(
    competitor_prices: list[float], discount_percent: float = 7.0
) -> float:
    prices = [p for p in competitor_prices if p and p > 0]
    if not prices:
        return 0.0
    average = sum(prices) / len(prices)
    return round(average * (1 - discount_percent / 100), 2)
