from sqlalchemy import select, insert

from backend.app.database import async_session_maker


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
            query = insert(cls.model).values(**values).returning(cls.model.id)
            result_id = await session.execute(query)
            await session.commit()
            return result_id.scalars().one_or_none()
