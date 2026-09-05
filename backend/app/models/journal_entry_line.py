from sqlalchemy import (Column, Integer, Numeric, ForeignKey)
from app.db import Base


class JournalEntryLine(Base):
    __tablename__ = "journal_entry_lines"

    id = Column(Integer, primary_key=True, index=True)
    journal_entry_id = Column(Integer, ForeignKey("journal_entries.id", ondelete="CASCADE"), nullable=False, index=True)
    account_id = Column(Integer, ForeignKey("chart_of_accounts.id"), nullable=False, index=True)
    partner_id = Column(Integer, ForeignKey("contacts.id"), nullable=True, index=True)
    debit = Column(Numeric(15, 2), nullable=False, default=0)
    credit = Column(Numeric(15, 2), nullable=False, default=0)

