import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, CheckConstraint
from sqlalchemy.orm import relationship

from app.database import Base
from app.image.models import Images

item_image = Table('item_image', Base.metadata,
                   Column('item_id', Integer, ForeignKey('items.id'), nullable=False),
                   Column('image_id', Integer, ForeignKey('images.id'), nullable=False)
                   )

item_category = Table('category_item', Base.metadata,
                      Column('category_id', Integer, ForeignKey('categories.id'), nullable=False),
                      Column('item_id', Integer, ForeignKey('items.id'), nullable=False)
                      )


class Categories(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    parent = Column(ForeignKey('categories.id', ondelete='CASCADE'), nullable=True)

    def __str__(self):
        return f'{self.id} - {self.name}'


class Items(Base):
    __tablename__ = 'items'
    __table_args__ = (
        CheckConstraint('price >= 1', name='check_price'),
    )

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    categories = relationship('Categories', secondary=item_category)
    images = relationship('Images', secondary=item_image)
    reviews = relationship('Reviews', back_populates='item')

    def __str__(self):
        return self.title


class Reviews(Base):
    __tablename__ = 'reviews'
    __table_args__ = (
        CheckConstraint('rate <= 5 and rate >= 1', name='check_rate'),
    )

    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    item_id = Column(ForeignKey('items.id'), nullable=False)
    rate = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow())

    item = relationship('Items', back_populates='reviews')
    user = relationship('Users', backref='reviews')

    def __str__(self):
        return f'{self.user_id} - {self.item_id} - {self.text[:15]}'
