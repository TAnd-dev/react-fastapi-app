from datetime import datetime

from pydantic import BaseModel


class SPurchase(BaseModel):
    related_id: int
    item_id: int
    created_at: datetime
    count: int
    title: str
    price: int
