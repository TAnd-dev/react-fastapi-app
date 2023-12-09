from app.image.services import ImageService
from app.users.auth import get_password_hash
from app.users.services import UserService


async def add_default_photo():
    image = await ImageService.find_by_id(1)
    if not image:
        await ImageService.add(id=1, file_path='static/img/users/default-user.png', description='default-user')


async def create_super_user():
    admin = await UserService.find_one_or_none(email='admin@admin.com')
    if not admin:
        hashed_password = get_password_hash('admin')
        await UserService.add(email='admin@admin.com', hash_password=hashed_password, is_admin=True)
