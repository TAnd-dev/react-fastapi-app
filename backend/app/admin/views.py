from sqladmin import ModelView

from app.cart.models import Carts
from app.favorite.models import Favorites
from app.image.models import Images
from app.purchase.models import Purchases
from app.shop.models import Categories, Items, Reviews
from app.users.models import Profiles, Users


class UserAdmin(ModelView, model=Users):
    column_list = [Users.id, Users.email]
    column_details_exclude_list = [Users.hash_password]
    can_delete = False
    name = 'User'
    name_plural = 'Users'


class ProfileAdmin(ModelView, model=Profiles):
    column_list = [profile.name for profile in Profiles.__table__.c]
    name = 'Profile'
    name_plural = 'Profiles'


class ItemAdmin(ModelView, model=Items):
    column_list = [Items.id, Items.title, Items.price]
    can_delete = True
    name = 'Item'
    name_plural = 'Items'


class ReviewAdmin(ModelView, model=Reviews):
    column_list = [review.name for review in Reviews.__table__.c]
    column_details_list = [review.name for review in Reviews.__table__.c] + [
        Reviews.user
    ]
    can_delete = True
    name = 'Review'
    name_plural = 'Reviews'


class CategoryAdmin(ModelView, model=Categories):
    column_list = [category.name for category in Categories.__table__.c]
    can_delete = True
    name = 'Category'
    name_plural = 'Categories'


class ImageAdmin(ModelView, model=Images):
    column_list = [image.name for image in Images.__table__.c]
    can_delete = True
    name = 'Image'
    name_plural = 'Images'


class CartAdmin(ModelView, model=Carts):
    column_list = [Carts.id, Carts.profile]
    can_delete = False
    name = 'Cart'
    name_plural = 'Carts'


class FavoriteAdmin(ModelView, model=Favorites):
    column_list = [Favorites.id, Favorites.profile]
    can_delete = False
    name = 'Favorite'
    name_plural = 'Favorites'


class PurchaseAdmin(ModelView, model=Purchases):
    column_list = [Purchases.id, Purchases.profile]
    can_delete = False
    name = 'Purchase'
    name_plural = 'Purchases'
