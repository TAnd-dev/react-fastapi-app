from pydantic import BaseModel


class SCard(BaseModel):
    related_id: int
    item_id: int
    count: int
    title: str
    price: int
