from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class JournalEntryLineCreate(BaseModel):
    account_id: int
    partner_id: Optional[int] = None

    debit: Decimal = Field(default=Decimal("0.00"), ge=0)
    credit: Decimal = Field(default=Decimal("0.00"), ge=0)


class JournalEntryCreate(BaseModel):
    accounting_date: date
    journal_id: int
    partner_id: Optional[int] = None

    lines: list[JournalEntryLineCreate]


class JournalEntryLineResponse(BaseModel):
    id: int
    account_id: int
    partner_id: Optional[int]

    debit: Decimal
    credit: Decimal

    model_config = {
        "from_attributes": True
    }


class JournalEntryResponse(BaseModel):
    id: int
    number: str
    accounting_date: date
    journal_id: int
    partner_id: Optional[int]

    total: Decimal
    status: str

    lines: list[JournalEntryLineResponse]

    model_config = {
        "from_attributes": True
    }