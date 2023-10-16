from datetime import datetime

from fastapi import Request, Depends
from jose import JWTError, jwt

from app.config import settings
from app.exceptions import TokenExpiredException, TokenAbsentException, IncorrectTokenException, UserIsNotPresent
from app.users.services import UserService


def get_token(request: Request):
    token = request.cookies.get('auth_token')
    if not token:
        raise TokenAbsentException()
    return token


async def current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, settings.ALGORITHM)
    except JWTError:
        raise IncorrectTokenException()

    expire = payload.get('exp')
    if (not expire) or (int(expire) < datetime.utcnow().timestamp()):
        raise TokenExpiredException()

    user_id: str = payload.get('sub')
    if not user_id:
        raise UserIsNotPresent()
    user = await UserService.get_user_by_id(int(user_id))
    if not user:
        raise UserIsNotPresent()
    return user
