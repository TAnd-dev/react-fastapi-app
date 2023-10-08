from typing import Optional

from fastapi import APIRouter, Depends

from app.purchase.schemas import SPurchase, SAddPurchase
from app.purchase.services import PurchaseService
from app.users.dependecies import current_user
from app.users.models import Users

router = APIRouter(
    prefix='/purchase',
    tags=['purchase']
)


@router.get('/')
async def get_purchase(user: Users = Depends(current_user)) -> list[SPurchase]:
    return await PurchaseService.find_model_by_user_id(user.id)


@router.post('/add_item')
async def add_item_to_purchase(purchase_details: SAddPurchase, user: Users = Depends(current_user)):
    await PurchaseService.add_item(related_id=user.id, item_id=purchase_details.item_id, count=purchase_details.count,
                                   price=purchase_details.price, email=purchase_details.email,
                                   name=purchase_details.name, second_name=purchase_details.second_name,
                                   phone_number=purchase_details.phone_number)


@router.delete('/remove_item')
async def remove_item_from_card(item_id: int, user: Optional[Users] = Depends(current_user)):
    await PurchaseService.remove_item_from_model(user.id, item_id)
