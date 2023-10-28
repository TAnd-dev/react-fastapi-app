from sqlalchemy import select, and_, insert, func, delete, distinct
from sqlalchemy.orm import selectinload

from app.cart.services import CartService
from app.database import async_session_maker
from app.exceptions import NoSuchCategory
from app.favorite.services import FavoriteService
from app.image.services import ImageService
from app.purchase.models import purchase_item_user
from app.services.base_services import BaseService
from app.shop.models import Items, Reviews, Categories, item_category
from app.shop.schemas import SortItems
from app.users.models import Users

from app.tasks.tasks import process_pic


class ShopService(BaseService):
    model = Items

    async def __get_query_sort_items(self, query, type_sort):
        if type_sort == 'desc_price':
            query = query.order_by(self.model.price.desc())
        elif type_sort == 'asc_price':
            query = query.order_by(self.model.price)
        elif type_sort == 'best':
            query = query.order_by(func.avg(Reviews.rate).desc())
        elif type_sort == 'popular':
            query = query.order_by(func.count(purchase_item_user.c.item_id).desc())

        return query

    @staticmethod
    def __get_unpacked_dict(item, nested_key):
        item_dict = {}
        for key, value in item.items():
            if key == nested_key:
                for item_key, item_value in value.__dict__.items():
                    item_dict[item_key] = item_value
            else:
                item_dict[key] = value
        return item_dict

    @classmethod
    async def add_new_item(cls, categories, files, **values):
        for category_id in categories:
            category = await CategoryService.find_by_id(category_id)
            if not category:
                raise NoSuchCategory

        item_id = (await ShopService.add(**values)).id

        for category_id in categories:
            await CategoryService.add_category_for_item(item_id=item_id, category_id=category_id)

        for file in files:
            file_name = await ImageService.load_file(file, item_id=item_id)
            if file_name:
                process_pic.delay(f'app/static/img/{file_name}')

        return item_id

    @classmethod
    async def find_all_items(cls, sort: SortItems, category_id=None):
        async with async_session_maker() as session:
            query = select(
                cls.model,
                func.avg(Reviews.rate).label("avg_rate"),
                func.count(distinct(Reviews.id)).label("count_reviews"),
                func.count(distinct(purchase_item_user.c.created_at)).label("count_purchases")
            ).where(
                and_(
                    cls.model.price >= sort.min_price,
                    cls.model.price <= sort.max_price)
            ).options(
                selectinload(
                    cls.model.categories
                )
            ).options(
                selectinload(
                    cls.model.images
                )
            ).outerjoin(
                Reviews, cls.model.id == Reviews.item_id
            ).outerjoin(
                purchase_item_user, cls.model.id == purchase_item_user.c.item_id
            )

            if category_id and not sort.s:
                query = query.join(
                    item_category
                ).join(
                    Categories
                ).filter(
                    Categories.id == category_id
                )

            if sort.s:
                query = query.where(cls.model.title.ilike(f'%{sort.s}%'))

            query = query.group_by(
                cls.model.id
            )

            query = await cls.__get_query_sort_items(cls, query, sort.type_sort)
            items = await session.execute(query)

            items_list = []
            for item in items.mappings().all():
                item_dict = cls.__get_unpacked_dict(item, 'Items')
                items_list.append(item_dict)
            return items_list

    @classmethod
    async def find_brief_items(cls, search_text):
        async with async_session_maker() as session:
            query = select(cls.model.id, cls.model.title, cls.model.price).where(
                cls.model.title.ilike(f'%{search_text}%')).limit(10)
            items = await session.execute(query)
            return items.mappings().all()

    @classmethod
    async def find_by_id(cls, id):
        async with async_session_maker() as session:
            query = select(
                cls.model,
                func.avg(Reviews.rate).label("avg_rate"),
                func.count(Reviews.item_id).label("count_reviews")
            ).where(
                cls.model.id == id
            ).options(
                selectinload(cls.model.categories)
            ).options(
                selectinload(cls.model.images)
            ).join(
                Reviews, cls.model.id == Reviews.item_id, isouter=True
            ).group_by(
                cls.model.id
            )
            item = (await session.execute(query)).mappings().one_or_none()

            if not item:
                return item

            item_dict = cls.__get_unpacked_dict(item, 'Items')
            return item_dict

    @classmethod
    async def delete_item(cls, item_id):
        await ImageService.delete_image_by_item_id(item_id)
        await CategoryService.delete_category_by_item_id(item_id)
        await ReviewService.delete_review_by_item_id(item_id)
        await CartService.remove_all_items_from_model(item_id)
        await FavoriteService.remove_all_items_from_model(item_id)
        async with async_session_maker() as session:
            query = delete(cls.model).where(cls.model.id == item_id)
            await session.execute(query)
            await session.commit()


class ReviewService(BaseService):
    model = Reviews

    @classmethod
    async def find_all_reviews(cls, item_id):
        async with async_session_maker() as session:
            query = select(
                cls.model.text, cls.model.rate, cls.model.created_at, Users.email).where(
                cls.model.item_id == item_id).join(
                Users).where(
                cls.model.user_id == Users.id
            )
            comments = await session.execute(query)
            return comments.mappings().all()

    @classmethod
    async def delete_review_by_item_id(cls, item_id):
        async with async_session_maker() as session:
            query = delete(cls.model).where(cls.model.item_id == item_id)
            await session.execute(query)
            await session.commit()


class CategoryService(BaseService):
    model = Categories

    @classmethod
    async def add_category_for_item(cls, **values):
        async with async_session_maker() as session:
            query = insert(item_category).values(**values)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def delete_by_id(cls, id):
        async with async_session_maker() as session:
            query = delete(item_category).where(item_category.c.item_id == id)
            await session.execute(query)
        await super().delete_by_id(id)

    @classmethod
    async def delete_category_by_item_id(cls, item_id):
        async with async_session_maker() as session:
            query = delete(item_category).where(item_category.c.item_id == item_id)
            await session.execute(query)
            await session.commit()
