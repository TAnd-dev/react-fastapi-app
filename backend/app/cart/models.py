from sqlalchemy import Column, ForeignKey, Integer, Table
from sqlalchemy.orm import relationship

from app.database import Base

cart_item = Table(
    'cart_item_user',
    Base.metadata,
    Column('related_id', Integer, ForeignKey('carts.id'), nullable=False),
    Column('item_id', Integer, ForeignKey('items.id'), nullable=False),
    Column('count', Integer, default=1, nullable=False),
)


class Carts(Base):
    __tablename__ = 'carts'

    id = Column(Integer, primary_key=True)
    profile_id = Column(ForeignKey('profiles.id'))
    profile = relationship('Profiles', back_populates='cart')
    items = relationship('Items', secondary=cart_item)
