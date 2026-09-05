from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.chart_of_account import ChartOfAccount
from app.models.contact import Contact
from app.models.journal import Journal
from app.models.journal_entry import JournalEntry
from app.models.journal_entry_line import JournalEntryLine


def validate_lines(lines):
    if len(lines) < 2:
        raise HTTPException(
            status_code=400,
            detail="A journal entry must contain at least two lines"
        )

    total_debit = Decimal("0.00")
    total_credit = Decimal("0.00")

    for line in lines:
        debit = Decimal(line.debit)
        credit = Decimal(line.credit)

        if debit > 0 and credit > 0:
            raise HTTPException(
                status_code=400,
                detail="A line cannot contain both debit and credit"
            )

        if debit == 0 and credit == 0:
            raise HTTPException(
                status_code=400,
                detail="A line must contain either debit or credit"
            )

        total_debit += debit
        total_credit += credit

    if total_debit != total_credit:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Debit and credit must match. "
                f"Debit={total_debit}, Credit={total_credit}"
            )
        )

    return total_debit


def validate_references(
    db: Session,
    journal_id: int,
    partner_id: int | None,
    lines
):
    journal = db.get(Journal, journal_id)

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    if not journal.is_active:
        raise HTTPException(
            status_code=400,
            detail="Journal is archived"
        )

    if partner_id:
        partner = db.get(Contact, partner_id)

        if not partner:
            raise HTTPException(
                status_code=404,
                detail="Partner not found"
            )

    for line in lines:
        account = db.get(
            ChartOfAccount,
            line.account_id
        )

        if not account:
            raise HTTPException(
                status_code=404,
                detail=f"Account {line.account_id} not found"
            )

        if not account.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Account {line.account_id} is archived"
            )

        if line.partner_id:
            partner = db.get(
                Contact,
                line.partner_id
            )

            if not partner:
                raise HTTPException(
                    status_code=404,
                    detail=f"Partner {line.partner_id} not found"
                )


def create_journal_entry(
    db: Session,
    accounting_date,
    journal_id,
    partner_id,
    lines
):
    total = validate_lines(lines)

    validate_references(
        db,
        journal_id,
        partner_id,
        lines
    )

    year = accounting_date.year

    last_entry = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.number.like(f"JE/{year}/%")
        )
        .order_by(JournalEntry.id.desc())
        .first()
    )

    if last_entry:
        last_number = int(last_entry.number.split("/")[-1])
        next_number = last_number + 1
    else:
        next_number = 1

    number = f"JE/{year}/{next_number:04d}"

    entry = JournalEntry(
        number=number,
        accounting_date=accounting_date,
        journal_id=journal_id,
        partner_id=partner_id,
        total=total,
        status="DRAFT"
    )

    db.add(entry)
    db.flush()

    for line in lines:
        entry_line = JournalEntryLine(
            journal_entry_id=entry.id,
            account_id=line.account_id,
            partner_id=line.partner_id,
            debit=line.debit,
            credit=line.credit
        )

        db.add(entry_line)

    db.commit()
    db.refresh(entry)

    return entry