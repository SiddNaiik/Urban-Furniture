from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.db import Base


class Journal(Base):
    __tablename__ = "journals"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False, unique=True, index=True)

    journal_type = Column(String(20), nullable=False, index=True)

    default_account_id = Column(
        Integer,
        ForeignKey("chart_of_accounts.id"),
        nullable=False
    )

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )