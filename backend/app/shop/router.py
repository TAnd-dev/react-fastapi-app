from typing import Optional

from fastapi import APIRouter, Depends

from app.shop.schemas import SItems, SortItems, SAddReview, SCategories, SBriefItems, SReview, SBriefReview
from app.shop.services import ShopService, CategoryService, ReviewService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(
    prefix='/shop',
    tags=['shop']
)


@router.get('')
async def get_items(sort: SortItems = Depends()) -> list[SItems]:
    return await ShopService.find_all_items(sort)


@router.get('/brief_items')
async def get_brief_items(search_text: str) -> list[SBriefItems]:
    return await ShopService.find_brief_items(search_text)


@router.get('/item/{item_id}')
async def get_item(item_id: int) -> Optional[SItems]:
    return await ShopService.find_by_id(item_id)


@router.get('/categories')
async def get_categories() -> list[SCategories]:
    return await CategoryService.find_all()


@router.get('/category/{category_id}')
async def get_items_by_category(category_id: int, sort: SortItems = Depends()) -> list[SItems]:
    return await ShopService.find_all_items(sort, category_id)


@router.get('/item/{item_id}/reviews')
async def get_reviews(item_id: int) -> list[SReview]:
    return await ReviewService.find_all_reviews(item_id)


@router.post('/item/{item_id}/add_review')
async def add_review(item_id: int, review: SAddReview, user: Users = Depends(current_user)) -> SBriefReview:
    return await ReviewService.add_review(item_id=item_id, text=review.text, rate=review.rate, user_id=user.id)
