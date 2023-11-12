from sqlalchemy import func, insert, select, update
from sqlalchemy.exc import SQLAlchemyError

from app.cart.models import Carts, cart_item
from app.database import async_session_maker
from app.exceptions import UserAlreadyExistsException
from app.favorite.models import Favorites, favorites_item_user
from app.image.models import Images
from app.logger import logger
from app.purchase.models import Purchases
from app.services.base_services import BaseService
from app.users.models import Profiles, Users


class UserService(BaseService):
    model = Users

    @classmethod
    async def add(cls, **values):
        existing_user = await UserService.find_one_or_none(email=values['email'])
        if existing_user:
            raise UserAlreadyExistsException()
        user_id = (await super().add(**values)).id
        try:
            async with async_session_maker() as session:
                query = insert(Profiles).values(id=user_id, user=user_id)
                await session.execute(query)

                for model in (Carts, Favorites, Purchases):
                    query = insert(model).values(id=user_id, profile_id=user_id)
                    await session.execute(query)

                await session.commit()
                return user_id

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot add'
            extra = {
                'user_id': user_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def get_user_by_id(cls, user_id):
        try:
            async with async_session_maker() as session:
                query = select(cls.model.id, cls.model.email, cls.model.is_admin).where(
                    cls.model.id == user_id
                )
                result = await session.execute(query)
                return result.mappings().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot get user by id'
            extra = {
                'user_id': user_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def get_user_profile_by_id(cls, user_id):
        try:
            async with async_session_maker() as session:
                query = (
                    select(
                        cls.model.email,
                        cls.model.id,
                        cls.model.is_admin,
                        Profiles.name,
                        Profiles.second_name,
                        Profiles.number_phone,
                        Images.file_path.label("photo"),
                        func.count(cart_item.c.related_id).label('count_cart'),
                        func.count(favorites_item_user.c.related_id).label(
                            'count_favorite'
                        ),
                    )
                    .join(cls.model.profile)
                    .where(cls.model.id == user_id)
                    .join(Images, Profiles.photo == Images.id)
                    .join(cart_item, Profiles.id == cart_item.c.related_id, isouter=True)
                    .join(
                        favorites_item_user,
                        Profiles.id == favorites_item_user.c.related_id,
                        isouter=True,
                    )
                    .group_by(
                        cls.model.id,
                        Profiles.name,
                        Profiles.second_name,
                        Profiles.number_phone,
                        Images.file_path,
                    )
                )
                result = await session.execute(query)
                return result.mappings().one_or_none()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot get user profile by id'
            extra = {
                'user_id': user_id,
            }
            logger.error(msg, extra=extra, exc_info=True)

    @classmethod
    async def update_user_profile(cls, user_id: int, **values):
        try:
            async with async_session_maker() as session:
                query = update(Profiles).where(Profiles.user == user_id).values(**values)
                await session.execute(query)
                await session.commit()

        except (SQLAlchemyError, Exception) as e:
            msg = 'Database' if isinstance(e, SQLAlchemyError) else 'Unknown'
            msg += ' Exc. Cannot update user profile'
            extra = {
                'user_id': user_id,
            }
            logger.error(msg, extra=extra, exc_info=True)
