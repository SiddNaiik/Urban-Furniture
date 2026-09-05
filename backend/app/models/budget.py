from sqlalchemy import Column, DateTime, Float, Integer, String, func
from app.db import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    planned_amount = Column(Float, nullable=False, default=0.0)
    committed_amount = Column(Float, nullable=False, default=0.0)
    achieved_amount = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="draft", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
