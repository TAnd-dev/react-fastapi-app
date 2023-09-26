from sqlalchemy import Column, Integer, String

from backend.app.database import Base


class Images(Base):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True)
    file_path = Column(String, nullable=False, unique=True)
    description = Column(String)
