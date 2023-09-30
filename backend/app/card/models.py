from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.database import Base

card_item = Table('card_item_user', Base.metadata,
                  Column('related_id', Integer, ForeignKey('cards.id'), nullable=False),
                  Column('item_id', Integer, ForeignKey('items.id'), nullable=False),
                  Column('count', Integer, default=1)
                  )


class Cards(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True)
    profile_id = Column(ForeignKey('profiles.id'))
    profile = relationship('Profiles', back_populates='card')
    items = relationship('Items', secondary=card_item)

