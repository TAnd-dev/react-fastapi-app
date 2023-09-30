from sqlalchemy import Column, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.database import Base

favorites_item_user = Table('favorites_item_user', Base.metadata,
                            Column('related_id', Integer, ForeignKey('favorites.id'), nullable=False),
                            Column('item_id', Integer, ForeignKey('items.id'), nullable=False)
                            )


class Favorites(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True)
    profile_id = Column(ForeignKey('profiles.id'))
    profile = relationship('Profiles', back_populates='favorites')
    items = relationship('Items', secondary=favorites_item_user)
