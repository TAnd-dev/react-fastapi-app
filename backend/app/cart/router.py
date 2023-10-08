from typing import Optional

from fastapi import APIRouter, Depends

from app.cart.schemas import SCart, SAddChangeCart, SDeleteCart
from app.cart.services import CartService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(
    prefix='/cart',
    tags=['Cart']
)


@router.get('/')
async def get_cart(user: Optional[Users] = Depends(current_user)) -> list[SCart]:
    return await CartService.find_model_by_user_id(user.id)


@router.get('/item_in_cart')
async def is_item_in_cart(item_id: int, user: Optional[Users] = Depends(current_user)) -> bool:
    return bool(await CartService.find_item_model(user.id, item_id))


@router.post('/add_item')
async def add_item_to_cart(cart: SAddChangeCart, user: Optional[Users] = Depends(current_user)):
    await CartService.add_item(related_id=user.id, item_id=cart.item_id, count=cart.count)


@router.patch('/set_count')
async def set_item_count_cart(cart: SAddChangeCart, user: Optional[Users] = Depends(current_user)):
    await CartService.set_count_items(user.id, cart.item_id, count=cart.count)


@router.delete('/remove_item')
async def remove_item_from_cart(cart: SDeleteCart, user: Optional[Users] = Depends(current_user)):
    await CartService.remove_item_from_model(user.id, cart.item_id)
