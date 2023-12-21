from fastapi import APIRouter, Depends, Response, UploadFile

from app.exceptions import (IncorrectPasswordOrEmailException,
                            PasswordMissmatchException
                            )
from app.image.services import ImageService
from app.tasks.tasks import process_pic
from app.users.auth import (authenticate_user, create_access_token,
                            get_password_hash)
from app.users.dependecies import current_user
from app.users.models import Users
from app.users.schemas import (SBriefUserProfile, SUserAuth, SUserProfile,
                               SUserReg)
from app.users.services import UserService

router = APIRouter(prefix='/user', tags=['User'])


@router.post('/auth/register')
async def register_user(response: Response, user_data: SUserReg):
    if user_data.password1 != user_data.password2:
        raise PasswordMissmatchException()
    hashed_password = get_password_hash(user_data.password1)
    user_id = await UserService.add(
        email=user_data.email, hash_password=hashed_password
    )
    access_token = create_access_token({'sub': str(user_id)})
    response.set_cookie('auth_token', access_token, httponly=True, samesite='none', secure=True)


@router.post('/auth/login')
async def login_user(response: Response, user_data: SUserAuth) -> dict:
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorrectPasswordOrEmailException()
    access_token = create_access_token({'sub': str(user.id)})
    response.set_cookie('auth_token', access_token, httponly=True, samesite='none', secure=True)
    return {'auth_token': access_token}


@router.post('/logout')
async def logout_user(response: Response):
    response.delete_cookie('auth_token')


@router.get('/profile')
async def get_user_profile(user: Users = Depends(current_user)) -> SUserProfile:
    user_data = await UserService.get_user_profile_by_id(user.id)
    return user_data


@router.patch('/profile')
async def change_user_profile(
        profile_data: SBriefUserProfile, user: Users = Depends(current_user)
) -> SUserProfile:
    await UserService.update_user_profile(
        user_id=user.id,
        name=profile_data.name,
        second_name=profile_data.second_name,
        number_phone=profile_data.number_phone,
    )
    user_data = await UserService.get_user_profile_by_id(user.id)
    return user_data


@router.post('/upload_photo')
async def set_photo(file: UploadFile, user: Users = Depends(current_user)):
    file_name = await ImageService.load_file(file, user_id=user.id)
    if file_name:
        process_pic.delay(f'app/static/img/{file_name}')
    return await UserService.get_user_profile_by_id(user.id)
