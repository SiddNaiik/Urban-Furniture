from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.journal import Journal
from app.models.chart_of_account import ChartOfAccount
from app.schemas.journal import (JournalCreate, JournalResponse)

from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles

router = APIRouter(prefix="/api/journals", tags=["Journals"])


@router.get("/", response_model=list[JournalResponse])
def get_journals(
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    return (
        db.query(Journal)
        .filter(Journal.is_active == True)
        .order_by(Journal.name)
        .all()
    )


@router.post("/", response_model=JournalResponse, status_code=201)
def create_journal(
    body: JournalCreate,
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    account = db.get(ChartOfAccount, body.default_account_id)

    if not account:
        raise HTTPException(status_code=404, detail="Default account not found")

    if not account.is_active:
        raise HTTPException(status_code=400, detail="Default account is archived")

    existing = (
        db.query(Journal)
        .filter(Journal.name == body.name)
        .first()
    )

    if existing:
        raise HTTPException(status_code=409, detail="Journal already exists")

    journal = Journal(
        name=body.name,
        journal_type=body.journal_type,
        default_account_id=body.default_account_id
    )

    db.add(journal)
    db.commit()
    db.refresh(journal)

    return journal