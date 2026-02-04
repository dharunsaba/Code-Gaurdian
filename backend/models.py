from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    mobile_number = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    history = relationship("History", back_populates="owner")

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    code_snippet = Column(Text)
    optimized_code = Column(Text)
    flaw_report = Column(Text)
    language = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="history")
