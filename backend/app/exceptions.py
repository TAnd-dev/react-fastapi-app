from fastapi import HTTPException, status


class DefaultException(HTTPException):
    status_code = 500
    detail = ''

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class PasswordMissmatchException(DefaultException):
    status_code = status.HTTP_409_CONFLICT
    detail = 'Password missmatch'


class UserAlreadyExistsException(DefaultException):
    status_code = status.HTTP_409_CONFLICT
    detail = 'User already exists'


class IncorrectPasswordOrEmailException(DefaultException):
    status_code = status.HTTP_409_CONFLICT
    detail = 'Invalid password or email'


class TokenExpiredException(DefaultException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = 'Token expired'


class TokenAbsentException(DefaultException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = 'Token is absent'


class IncorrectTokenException(DefaultException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = 'Incorrect token'


class UserIsNotPresent(DefaultException):
    status_code = status.HTTP_401_UNAUTHORIZED


class UserIsNotAdmin(DefaultException):
    status_code = status.HTTP_405_METHOD_NOT_ALLOWED
    detail = 'User is not admin'


class NoSuchCategory(DefaultException):
    status_code = status.HTTP_404_NOT_FOUND
    detail = 'No such category'


class InvalidFile(DefaultException):
    status_code = status.HTTP_409_CONFLICT
    detail = 'Invalid file'


class InvalidFile(DefaultException):
    status_code = status.HTTP_409_CONFLICT
    detail = 'Invalid file'
