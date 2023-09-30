from sqlalchemy import select, and_, insert, func, ChunkedIteratorResult
from sqlalchemy.orm import selectinload

from app.database import async_session_maker
from app.services.base_services import BaseService
from app.shop.models import Items, Reviews, Categories, item_category
from app.users.models import Users


class ShopService(BaseService):
    model = Items

    @classmethod
    async def find_all_items(cls, sort, category_id=None, **filters):
        async with async_session_maker() as session:
            query = select(
                cls.model,
                func.avg(Reviews.rate).label("avg_rate"),
                func.count(Reviews.item_id).label("count_reviews")
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
            ).join(
                Reviews, cls.model.id == Reviews.item_id, isouter=True
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

            if sort.type_sort == 'desc_price':
                query = query.order_by(cls.model.price.desc())
            elif sort.type_sort == 'asc_price':
                query = query.order_by(cls.model.price)
            elif sort.type_sort == 'best_grade':
                query = query.order_by(func.avg(Reviews.rate).desc())
            # elif sort.type_sort == 'popular'
            items = await session.execute(query)

            items_list = []
            for item in items.mappings().all():
                item_dict = {}
                for key, value in item.items():
                    if key == 'Items':
                        for item_key, item_value in value.__dict__.items():
                            item_dict[item_key] = item_value
                    else:
                        item_dict[key] = value
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
            item_dict = {}

            if item:
                for key, value in item.items():
                    if key == 'Items':
                        for item_key, item_value in value.__dict__.items():
                            item_dict[item_key] = item_value
                    else:
                        item_dict[key] = value

            return item_dict


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
    async def add_review(cls, **values):
        async with async_session_maker() as session:
            query = insert(cls.model).values(**values).returning(cls.model)
            result = await session.execute(query)
            await session.commit()
            return result.scalars().one_or_none()


class CategoryService(BaseService):
    model = Categories
