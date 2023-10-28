import datetime

from sqlalchemy import Column, Integer, ForeignKey, Table, DateTime, String, BigInteger
from sqlalchemy.orm import relationship

from app.database import Base

purchase_item_user = Table('purchase_item_user', Base.metadata,
                           Column('related_id', Integer, ForeignKey('purchases.id'), nullable=False),
                           Column('item_id', Integer, ForeignKey('items.id', ondelete='SET NULL'), nullable=True),
                           Column('count', Integer, default=1, nullable=False),
                           Column('price', Integer),
                           Column('email', String),
                           Column('name', String),
                           Column('second_name', String),
                           Column('phone_number', BigInteger),
                           Column('created_at', DateTime, default=datetime.datetime.utcnow())
                           )


class Purchases(Base):
    __tablename__ = 'purchases'

    id = Column(Integer, primary_key=True)
    profile_id = Column(ForeignKey('profiles.id'), nullable=False)
    profile = relationship('Profiles', back_populates='purchases')
    items = relationship('Items', secondary=purchase_item_user)
