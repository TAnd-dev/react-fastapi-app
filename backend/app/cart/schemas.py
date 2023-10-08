from typing import Optional

from pydantic import BaseModel


class SCart(BaseModel):
    related_id: int
    item_id: int
    count: int
    title: str
    price: int


class SDeleteCart(BaseModel):
    item_id: int


class SAddChangeCart(SDeleteCart):
    count: Optional[int] = 1
