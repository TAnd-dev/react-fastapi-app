from typing import Optional

from fastapi import APIRouter, Depends

from app.favorite.schemas import SFavorite
from app.favorite.services import FavoriteService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(
    prefix='/favorite',
    tags=['favorite']
)


@router.get('')
async def get_favorites(user: Users = Depends(current_user)) -> list[SFavorite]:
    return await FavoriteService.find_model_by_user_id(user.id)


@router.post('/add_item')
async def add_item_to_favorite(item_id: int, user: Optional[Users] = Depends(current_user)):
    await FavoriteService.add_item(related_id=user.id, item_id=item_id)


@router.delete('/remove_item')
async def remove_item_from_favorite(item_id: int, user: Optional[Users] = Depends(current_user)):
    await FavoriteService.remove_item_from_model(user.id, item_id)
