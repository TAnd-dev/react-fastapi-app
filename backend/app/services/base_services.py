from sqlalchemy import select, insert, update, and_, delete

from app.database import async_session_maker
from app.shop.models import Items


class BaseService:
    model = None

    @classmethod
    async def find_by_id(cls, id):
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == id)
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def find_all(cls, **filters):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filters)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def find_one_or_none(cls, **filters):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filters)
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def add(cls, **values):
        async with async_session_maker() as session:
            query = insert(cls.model).values(**values).returning(cls.model)
            result_id = await session.execute(query)
            await session.commit()
            return result_id.scalars().one_or_none()

    @classmethod
    async def delete_by_id(cls, id):
        async with async_session_maker() as session:
            query = delete(cls.model).where(cls.model.id == id)
            await session.execute(query)
            await session.commit()


class BaseCartPurchaseFavoriteService:
    model = None
    associated_table = None

    @classmethod
    async def find_item_model(cls, user_id, item_id):
        async with async_session_maker() as session:
            query = select(
                cls.associated_table
            ).where(
                and_(
                    cls.associated_table.c.related_id == user_id,
                    cls.associated_table.c.item_id == item_id
                )
            )
            result = await session.execute(query)
            return result.mappings().one_or_none()

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
            )
            result = await session.execute(query)
            return result.mappings().all()

    @classmethod
    async def add_item(cls, **values):
        async with async_session_maker() as session:
            query = insert(
                cls.associated_table
            ).values(
                **values
            )
            await session.execute(query)
            await session.commit()

    @classmethod
    async def remove_item_from_model(cls, user_id, item_id):
        async with async_session_maker() as session:
            query = delete(
                cls.associated_table
            ).where(
                and_(
                    cls.associated_table.c.related_id == user_id,
                    cls.associated_table.c.item_id == item_id
                )
            )
            await session.execute(query)
            await session.commit()

    @classmethod
    async def remove_all_items_from_model(cls, item_id):
        async with async_session_maker() as session:
            query = delete(
                cls.associated_table
            ).where(
                cls.associated_table.c.item_id == item_id
            )
            await session.execute(query)
            await session.commit()