from fastapi import APIRouter, Response, Depends

from app.exceptions import UserAlreadyExistsException, IncorrectPasswordOrEmailException, PasswordMissmatchException
from app.users.auth import get_password_hash, authenticate_user, create_access_token
from app.users.dependecies import current_user
from app.users.models import Users
from app.users.schemas import SUserAuth, SUserReg, SBriefUserProfile, SUserProfile
from app.users.services import UserService

router = APIRouter(prefix='/user', tags=['User', 'Auth'])


@router.post('/auth/register')
async def register_user(response: Response, user_data: SUserReg):
    existing_user = await UserService.find_one_or_none(email=user_data.email)
    if user_data.password1 != user_data.password2:
        raise PasswordMissmatchException()
    if existing_user:
        raise UserAlreadyExistsException()
    hashed_password = get_password_hash(user_data.password1)
    user_id = await UserService.add(email=user_data.email, hash_password=hashed_password)
    access_token = create_access_token({'sub': str(user_id)})
    response.set_cookie('auth_token', access_token)


@router.post('/auth/login')
async def login_user(response: Response, user_data: SUserAuth) -> dict:
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorrectPasswordOrEmailException()
    access_token = create_access_token({'sub': str(user.id)})
    response.set_cookie('auth_token', access_token)  # , httponly=True)
    return {'auth_token': access_token}


@router.post('/logout')
async def logout_user(response: Response):
    response.delete_cookie('auth_token')


@router.get('/profile')
async def get_user_profile(user: Users = Depends(current_user)) -> SUserProfile:
    user_data = await UserService.get_user_profile_by_id(user.id)
    return user_data


@router.patch('/profile')
async def change_user_profile(profile_data: SBriefUserProfile, user: Users = Depends(current_user)) -> SUserProfile:
    await UserService.update_user_profile(user_id=user.id,
                                          name=profile_data.name,
                                          second_name=profile_data.second_name,
                                          number_phone=profile_data.number_phone)
    user_data = await UserService.get_user_profile_by_id(user.id)
    return user_data
