from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SAddPurchase(BaseModel):
    item_id: int
    created_at: Optional[datetime] = datetime.utcnow()
    count: int
    price: int
    email: str
    name: str
    second_name: str
    phone_number: int


class SPurchase(SAddPurchase):
    related_id: int
    created_at: datetime
    title: str
    price_1: int
