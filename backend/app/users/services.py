from sqlalchemy import insert, select, update

from backend.app.common.models import Images
from backend.app.database import async_session_maker
from backend.app.services.base_services import BaseService
from backend.app.users.models import Users, Profiles


class UserService(BaseService):
    model = Users

    @classmethod
    async def add(cls, **values):
        user_id = await super().add(**values)
        async with async_session_maker() as session:
            query = insert(Profiles).values(user=user_id)
            await session.execute(query)
            await session.commit()
            return user_id

    @classmethod
    async def get_user_by_id(cls, user_id):
        async with async_session_maker() as session:
            query = select(cls.model.id, cls.model.email).where(cls.model.id == user_id)
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def get_user_profile_by_id(cls, user_id):
        async with async_session_maker() as session:
            query = select(
                cls.model.email,
                cls.model.id,
                Profiles.name,
                Profiles.second_name,
                Profiles.number_phone,
                Images.file_path.label("photo")
            ).join(
                cls.model.profile
            ).where(
                cls.model.id == user_id
            ).join(
                Images
            ).where(
                Profiles.photo == Images.id
            )
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def update_user_profile(cls, user_id: int, **values):
        async with async_session_maker() as session:
            query = update(Profiles).where(Profiles.user == user_id).values(**values)
            await session.execute(query)
            await session.commit()
