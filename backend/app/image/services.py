import os
from datetime import datetime

import aiofiles
from fastapi import UploadFile
from sqlalchemy import insert, delete

from app.database import async_session_maker
from app.image.models import Images
from app.services.base_services import BaseService
from app.shop.models import item_image
from app.users.services import UserService


class ImageService(BaseService):
    model = Images

    @classmethod
    async def load_file(cls, file: UploadFile, user_id=None, item_id=None):
        file_name = f'users/{user_id}' if user_id else f'items/{item_id}'
        file_name += f'--{datetime.timestamp(datetime.utcnow())}--{file.filename}'

        try:
            async with aiofiles.open(f'app/static/img/{file_name}', 'wb') as save_file:
                content = await file.read()
                await save_file.write(content)
        except Exception:
            return None

        photo_id = (await ImageService.add(file_path=f'static/img/{file_name}', description=file_name)).id
        if user_id:
            await UserService.update_user_profile(user_id=user_id, photo=photo_id)
        elif item_id:
            await cls.load_image_for_item(item_id=item_id, image_id=photo_id)

    @classmethod
    async def load_image_for_item(cls, **values):
        async with async_session_maker() as session:
            query = insert(item_image).values(**values)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def delete_image_by_item_id(cls, item_id):
        async with async_session_maker() as session:
            query = delete(item_image).where(item_image.c.item_id == item_id).returning(item_image.c.image_id)
            image_ids = await session.execute(query)
            for image_id in image_ids.scalars().all():
                query = delete(cls.model).where(cls.model.id == image_id)
                await session.execute(query)
            await session.commit()

        for file in os.listdir('app/static/img/items'):
            if file.startswith(f'{item_id}--'):
                os.remove(f'app/static/img/items/{file}')

