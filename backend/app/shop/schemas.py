from datetime import datetime
from typing import Optional

from fastapi import Query
from pydantic import BaseModel, EmailStr


class SImages(BaseModel):
    id: int
    file_path: str
    description: str


class SAddCategory(BaseModel):
    name: str
    parent: Optional[int] = None


class SCategories(SAddCategory):
    id: int


class SItems(BaseModel):
    id: int
    title: str
    description: str
    price: int
    categories: list[SCategories]
    images: list[SImages]
    created_at: Optional[datetime]
    avg_rate: Optional[float]
    count_reviews: Optional[int]
    count_purchases: Optional[int] = 0


class SBriefItems(BaseModel):
    id: int
    title: str
    price: int


class SAddReview(BaseModel):
    text: str
    rate: int = Query(ge=1, le=5)


class SBriefReview(SAddReview):
    created_at: Optional[datetime]


class SReview(SBriefReview):
    email: Optional[EmailStr]


class SCountReview(BaseModel):
    rate: int
    count_rate: int


class SortItems:
    def __init__(
            self, type_sort: str = '', min_price: str = '', max_price: str = '', s: str = ''
    ):
        try:
            self.min_price = int(min_price)
        except ValueError:
            self.min_price = 0
        try:
            self.max_price = int(max_price)
        except ValueError:
            self.max_price = 999999
        self.type_sort = type_sort
        self.s = s
