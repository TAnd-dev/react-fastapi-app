from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from backend.app.database import Base


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    hash_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    profile = relationship('Profiles', uselist=False, backref='users')


class Profiles(Base):
    __tablename__ = 'profiles'

    id = Column(Integer, primary_key=True)
    user = Column(ForeignKey('users.id'), unique=True)
    name = Column(String)
    second_name = Column(String)
    number_phone = Column(BigInteger)
    photo = Column(ForeignKey('images.id'), default=8)
