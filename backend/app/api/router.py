from fastapi import APIRouter

from app.api import ai, auth, non_liquid, orders, products, stocks

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(stocks.router)
api_router.include_router(orders.router)
api_router.include_router(non_liquid.router)
api_router.include_router(ai.router)
