from sqlalchemy import and_, delete, insert, select
from sqlalchemy.exc import SQLAlchemyError

from app.database import async_session_maker
from app.logger import logger
from app.shop.models import Items


class BaseService:
    model = None

    @classmethod
    async def find_by_id(cls, id):
        try:
            async with async_session_maker() as session:
                query = select(cls.model).where(cls.model.id == id)
                result = await session.execute(query)
                return result.scalars().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot find by id'
            extra = {
                'id': id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def find_all(cls, **filters):
        try:
            async with async_session_maker() as session:
                query = select(cls.model).filter_by(**filters)
                result = await session.execute(query)
                return result.scalars().all()
        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot find all'
            logger.error(msg, exc_info=True)

    @classmethod
    async def find_one_or_none(cls, **filters):
        try:
            async with async_session_maker() as session:
                query = select(cls.model).filter_by(**filters)
                result = await session.execute(query)
                return result.scalars().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot find one or none'
            logger.error(msg, exc_info=True)

    @classmethod
    async def add(cls, **values):
        try:
            async with async_session_maker() as session:
                query = insert(cls.model).values(**values).returning(cls.model)
                result_id = await session.execute(query)
                await session.commit()
                return result_id.scalars().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot add'
            logger.error(msg, exc_info=True)

    @classmethod
    async def delete_by_id(cls, id):
        try:
            async with async_session_maker() as session:
                query = delete(cls.model).where(cls.model.id == id)
                await session.execute(query)
                await session.commit()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot delete by id'
            extra = {
                'id': id,
            }
            logger.error(msg, extra=extra, exc_info=True)


class BaseCartPurchaseFavoriteService:
    model = None
    associated_table = None

    @classmethod
    async def find_item_model(cls, user_id, item_id):
        try:
            async with async_session_maker() as session:
                query = select(cls.associated_table).where(
                    and_(
                        cls.associated_table.c.related_id == user_id,
                        cls.associated_table.c.item_id == item_id,
                    )
                )
                result = await session.execute(query)
                return result.mappings().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot find item model'
            extra = {
                'user_id': user_id,
                'item_id': item_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def find_model_by_user_id(cls, user_id):
        try:
            async with async_session_maker() as session:
                query = (
                    select(
                        cls.associated_table,
                        Items.title,
                        Items.price,
                    )
                    .where(cls.associated_table.c.related_id == user_id)
                    .join(cls.model, cls.associated_table.c.related_id == cls.model.id)
                    .join(Items, cls.associated_table.c.item_id == Items.id)
                )
                result = await session.execute(query)
                return result.mappings().all()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot find model by user id'
            extra = {
                'user_id': user_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def add_item(cls, **values):
        try:
            async with async_session_maker() as session:
                query = insert(cls.associated_table).values(**values)
                await session.execute(query)
                await session.commit()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot add item'
            logger.error(msg, exc_info=True)

    @classmethod
    async def remove_item_from_model(cls, user_id, item_id):
        try:
            async with async_session_maker() as session:
                query = delete(cls.associated_table).where(
                    and_(
                        cls.associated_table.c.related_id == user_id,
                        cls.associated_table.c.item_id == item_id,
                    )
                )
                await session.execute(query)
                await session.commit()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot remove item from model'
            extra = {
                'user_id': user_id,
                'item_id': item_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def remove_all_items_from_model(cls, item_id):
        try:
            async with async_session_maker() as session:
                query = delete(cls.associated_table).where(
                    cls.associated_table.c.item_id == item_id
                )
                await session.execute(query)
                await session.commit()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot remove all items from model'
            extra = {
                'item_id': item_id,
            }
            logger.error(msg, extra=extra, exc_info=True)
