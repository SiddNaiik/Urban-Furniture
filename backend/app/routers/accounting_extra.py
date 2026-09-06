from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles
from app.models.user import User
from app.models.chart_of_account import ChartOfAccount
from app.models.journal import Journal
from app.models.journal_entry import JournalEntry
from app.models.journal_entry_line import JournalEntryLine
from app.schemas.chart_of_account import ChartOfAccountResponse
from app.schemas.journal import JournalResponse
from app.schemas.journal_entry import JournalEntryResponse

router = APIRouter(prefix="/api/accounting", tags=["Accounting Alias"])

INITIAL_ANALYTIC_ACCOUNTS = [
    {"id": "aa-1", "name": "Marketing", "code": "MKT", "balance": 5000.0},
    {"id": "aa-2", "name": "Operations", "code": "OPS", "balance": 12000.0},
]
analytic_db = list(INITIAL_ANALYTIC_ACCOUNTS)

# Chart of accounts aliases under /api/accounting/accounts
@router.get("/accounts", response_model=list[ChartOfAccountResponse])
def get_accounts_alias(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    return db.query(ChartOfAccount).filter(ChartOfAccount.is_active == True).order_by(ChartOfAccount.name).all()


@router.get("/accounts/{account_id}", response_model=ChartOfAccountResponse)
def get_account_alias(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    acc = db.get(ChartOfAccount, account_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    return acc


# Journals aliases under /api/accounting/journals
@router.get("/journals", response_model=list[JournalResponse])
def get_journals_alias(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    return db.query(Journal).filter(Journal.is_active == True).order_by(Journal.name).all()


# Journal entries aliases under /api/accounting/journal-entries
@router.get("/journal-entries", response_model=list[JournalEntryResponse])
def get_journal_entries_alias(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    entries = db.query(JournalEntry).order_by(JournalEntry.accounting_date.desc()).all()
    for entry in entries:
        entry.lines = db.query(JournalEntryLine).filter(JournalEntryLine.journal_entry_id == entry.id).all()
    return entries


# Analytic accounts
@router.get("/analytic-accounts")
def get_analytic_accounts(
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    return analytic_db


@router.get("/analytic-accounts/{id}")
def get_analytic_account(
    id: str,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    acc = next((a for a in analytic_db if a["id"] == id), None)
    if not acc:
        raise HTTPException(status_code=404, detail="Analytic account not found")
    return acc
