from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.journal_entry import JournalEntry
from app.models.journal_entry_line import JournalEntryLine
from app.schemas.journal_entry import (JournalEntryCreate, JournalEntryResponse)
from app.services.journal_entry_service import (create_journal_entry, validate_lines, validate_references)

from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles

router = APIRouter(prefix="/api/journal-entries", tags=["Journal Entries"])


@router.get("/", response_model=list[JournalEntryResponse])
def get_journal_entries(
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    entries = (
        db.query(JournalEntry)
        .order_by(JournalEntry.accounting_date.desc())
        .all()
    )

    for entry in entries:
        entry.lines = (
            db.query(JournalEntryLine)
            .filter(JournalEntryLine.journal_entry_id == entry.id)
            .all()
        )

    return entries


@router.get("/{entry_id}", response_model=JournalEntryResponse)
def get_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    entry = db.get(JournalEntry, entry_id)

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    entry.lines = (
        db.query(JournalEntryLine)
        .filter(JournalEntryLine.journal_entry_id == entry.id)
        .all()
    )

    return entry


@router.post("/", response_model=JournalEntryResponse, status_code=201)
def create_entry(
    body: JournalEntryCreate,
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    entry = create_journal_entry(
        db=db,
        accounting_date=body.accounting_date,
        journal_id=body.journal_id,
        partner_id=body.partner_id,
        lines=body.lines
    )

    entry.lines = (
        db.query(JournalEntryLine)
        .filter(JournalEntryLine.journal_entry_id == entry.id)
        .all()
    )

    return entry


@router.post("/{entry_id}/post", response_model=JournalEntryResponse)
def post_entry(
    entry_id: int,
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    entry = db.get(JournalEntry, entry_id)

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    if entry.status == "POSTED":
        raise HTTPException(status_code=400, detail="Journal entry is already posted")

    lines = (
        db.query(JournalEntryLine)
        .filter(JournalEntryLine.journal_entry_id == entry.id)
        .all()
    )

    if not lines:
        raise HTTPException(status_code=400, detail="Journal entry has no lines")

    total_debit = sum(line.debit for line in lines)
    total_credit = sum(line.credit for line in lines)

    if total_debit != total_credit:
        raise HTTPException(
            status_code=400,
            detail="Cannot post journal entry. Debit and credit amounts must match."
        )

    entry.total = total_debit
    entry.status = "POSTED"

    db.commit()
    db.refresh(entry)

    entry.lines = lines

    return entry


@router.post("/{entry_id}/cancel", response_model=JournalEntryResponse)
def cancel_entry(
    entry_id: int,
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    entry = db.get(JournalEntry, entry_id)

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    if entry.status == "POSTED":
        raise HTTPException(
            status_code=400,
            detail="Posted journal entries cannot be cancelled"
        )

    entry.status = "CANCELLED"

    db.commit()
    db.refresh(entry)

    entry.lines = (
        db.query(JournalEntryLine)
        .filter(JournalEntryLine.journal_entry_id == entry.id)
        .all()
    )

    return entry