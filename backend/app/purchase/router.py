from fastapi import APIRouter, Depends, Request

from app.purchase.schemas import SAddPurchase, SPurchase
from app.purchase.services import PurchaseService
from app.users.dependecies import current_user, get_token
from app.users.models import Users

router = APIRouter(prefix='/purchase', tags=['purchase'])


@router.get('')
async def get_purchase(user: Users = Depends(current_user)) -> list[SPurchase]:
    return await PurchaseService.find_model_by_user_id(user.id)


@router.post('/add_item')
async def add_item_to_purchase(purchase_details: SAddPurchase, request: Request):
    try:
        token = get_token(request)
        user = await current_user(token)
        user_id = user.id
    except Exception:
        user_id = 999999
    await PurchaseService.add_item(
        related_id=user_id,
        item_id=purchase_details.item_id,
        count=purchase_details.count,
        price=purchase_details.price,
        email=purchase_details.email,
        name=purchase_details.name,
        second_name=purchase_details.second_name,
        phone_number=purchase_details.phone_number
    )
