from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import (
    AIResponse,
    AnalyzePriceRequest,
    FindProductRequest,
    GenerateDescriptionRequest,
    RecommendPriceRequest,
)
from app.services.deepseek_service import DeepSeekService
from app.services.pricing import recommend_price

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze-price", response_model=AIResponse)
async def analyze_price(
    payload: AnalyzePriceRequest,
    _: User = Depends(get_current_user),
) -> AIResponse:
    result = await DeepSeekService().analyze_product(payload.product_info)
    return AIResponse(result=result)


@router.post("/generate-description", response_model=AIResponse)
async def generate_description(
    payload: GenerateDescriptionRequest,
    _: User = Depends(get_current_user),
) -> AIResponse:
    text = await DeepSeekService().generate_description(
        payload.name, payload.characteristics
    )
    return AIResponse(result=text)


@router.post("/find-product", response_model=AIResponse)
async def find_product(
    payload: FindProductRequest,
    _: User = Depends(get_current_user),
) -> AIResponse:
    result = await DeepSeekService().search_product_data(payload.query)
    return AIResponse(result=result)


@router.post("/recommend-price", response_model=AIResponse)
async def recommend_price_endpoint(
    payload: RecommendPriceRequest,
    _: User = Depends(get_current_user),
) -> AIResponse:
    price = recommend_price(payload.competitor_prices, payload.discount_percent)
    return AIResponse(result={"recommended_price": price})
