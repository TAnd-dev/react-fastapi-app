from typing import Optional

from fastapi import APIRouter, Depends

from app.card.schemas import SCard
from app.card.services import CardService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(
    prefix='/card',
    tags=['Card']
)


@router.get('/')
async def get_card(user: Optional[Users] = Depends(current_user)) -> list[SCard]:
    return await CardService.find_model_by_user_id(user.id)


@router.post('/add_item')
async def add_item_to_card(item_id: int, count: int = 1, user: Optional[Users] = Depends(current_user)):
    await CardService.add_item(related_id=user.id, item_id=item_id, count=count)


@router.patch('/set_count')
async def set_item_count_card(item_id: int, count: int, user: Optional[Users] = Depends(current_user)):
    await CardService.set_count_items(user.id, item_id, count=count)


@router.delete('/remove_item')
async def remove_item_from_card(item_id: int, user: Optional[Users] = Depends(current_user)):
    await CardService.remove_item_from_model(user.id, item_id)
