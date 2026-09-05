from sqlalchemy import (Column, Integer, String, Date, Numeric, ForeignKey, DateTime)
from sqlalchemy.sql import func

from app.db import Base


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(50), nullable=False, unique=True, index=True)
    accounting_date = Column(Date, nullable=False)
    journal_id = Column(Integer, ForeignKey("journals.id"), nullable=False, index=True)
    partner_id = Column(Integer, ForeignKey("contacts.id"), nullable=True, index=True)
    total = Column(Numeric(15, 2), nullable=False, default=0)
    status = Column(String(20), nullable=False, default="DRAFT", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())