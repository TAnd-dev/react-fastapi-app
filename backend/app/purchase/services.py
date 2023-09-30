from app.purchase.models import Purchases, purchase_item_user
from app.services.base_services import BaseCardPurchaseFavoriteService


class PurchaseService(BaseCardPurchaseFavoriteService):
    model = Purchases
    associated_table = purchase_item_user
