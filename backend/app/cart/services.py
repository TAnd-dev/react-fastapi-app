from sqlalchemy import and_, update

from app.cart.models import Carts, cart_item
from app.database import async_session_maker
from app.services.base_services import BaseCartPurchaseFavoriteService


class CartService(BaseCartPurchaseFavoriteService):
    model = Carts
    associated_table = cart_item

    @classmethod
    async def add_item(cls, **values):
        item = await cls.find_item_model(values['related_id'], values['item_id'])
        if not item:
            await super().add_item(**values)

    @classmethod
    async def set_count_items(cls, user_id, item_id, **values):
        async with async_session_maker() as session:
            query = (
                update(cls.associated_table)
                .where(
                    and_(
                        cls.associated_table.c.related_id == user_id,
                        cls.associated_table.c.item_id == item_id,
                    )
                )
                .values(**values)
            )
            await session.execute(query)
            await session.commit()
