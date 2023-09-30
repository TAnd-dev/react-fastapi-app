from pydantic import BaseModel


class SFavorite(BaseModel):
    related_id: int
    item_id: int
    title: str
    price: int
