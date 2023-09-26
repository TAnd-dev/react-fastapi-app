from pydantic import BaseModel, EmailStr


class SUserAuth(BaseModel):
    email: EmailStr
    password: str


class SUserReg(BaseModel):
    email: EmailStr
    password1: str
    password2: str


class SBriefUserProfile(BaseModel):
    name: str
    second_name: str
    number_phone: int


class SUserProfile(SBriefUserProfile):
    id: int
    email: EmailStr
    photo: str
