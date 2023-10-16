from sqlalchemy import select

from app.database import async_session_maker
from app.purchase.models import Purchases, purchase_item_user
from app.services.base_services import BaseCartPurchaseFavoriteService
from app.shop.models import Items


class PurchaseService(BaseCartPurchaseFavoriteService):
    model = Purchases
    associated_table = purchase_item_user

    @classmethod
    async def find_model_by_user_id(cls, user_id):
        async with async_session_maker() as session:
            query = select(
                cls.associated_table,
                Items.title,
                Items.price,
            ).where(
                cls.associated_table.c.related_id == user_id
            ).join(
                cls.model, cls.associated_table.c.related_id == cls.model.id
            ).join(
                Items, cls.associated_table.c.item_id == Items.id
            ).order_by(
                cls.associated_table.c.created_at.desc()
            )
            result = await session.execute(query)
            return result.mappings().all()
