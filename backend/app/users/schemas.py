from typing import Optional

from pydantic import BaseModel, EmailStr


class SUserAuth(BaseModel):
    email: EmailStr
    password: str


class SUserReg(BaseModel):
    email: EmailStr
    password1: str
    password2: str


class SBriefUserProfile(BaseModel):
    name: Optional[str]
    second_name: Optional[str]
    number_phone: Optional[int]


class SUserProfile(SBriefUserProfile):
    id: int
    email: EmailStr
    photo: Optional[str]
