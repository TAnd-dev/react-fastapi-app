from sqlalchemy import update, and_

from app.card.models import Cards, card_item
from app.database import async_session_maker
from app.services.base_services import BaseCardPurchaseFavoriteService


class CardService(BaseCardPurchaseFavoriteService):
    model = Cards
    associated_table = card_item

    @classmethod
    async def set_count_items(cls, user_id, item_id, **values):
        async with async_session_maker() as session:
            query = update(
                cls.associated_table
            ).where(
                and_(
                    cls.associated_table.c.related_id == user_id,
                    cls.associated_table.c.item_id == item_id
                )
            ).values(
                **values
            )
            await session.execute(query)
            await session.commit()
