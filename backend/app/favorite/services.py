from app.favorite.models import Favorites, favorites_item_user
from app.services.base_services import BaseCardPurchaseFavoriteService


class FavoriteService(BaseCardPurchaseFavoriteService):
    model = Favorites
    associated_table = favorites_item_user
