from app.favorite.models import Favorites, favorites_item_user
from app.services.base_services import BaseCartPurchaseFavoriteService


class FavoriteService(BaseCartPurchaseFavoriteService):
    model = Favorites
    associated_table = favorites_item_user

    @classmethod
    async def add_item(cls, **values):
        item = await cls.find_item_model(values['related_id'], values['item_id'])
        if not item:
            await super().add_item(**values)
