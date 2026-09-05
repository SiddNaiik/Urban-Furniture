from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db import Base


class ChartOfAccount(Base):
    __tablename__ = "chart_of_accounts"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False, unique=True, index=True)

    account_type = Column(String(30), nullable=False, index=True)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )