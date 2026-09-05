from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.chart_of_account import ChartOfAccount
from app.schemas.chart_of_account import (
    ChartOfAccountCreate,
    ChartOfAccountResponse
)

from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles

router = APIRouter( 
    prefix="/api/chart-of-accounts",
    tags=["Chart of Accounts"]
)


@router.get("/", response_model=list[ChartOfAccountResponse])
def get_accounts(
    db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "accountant"))
):
    return (
        db.query(ChartOfAccount)
        .filter(ChartOfAccount.is_active == True)
        .order_by(ChartOfAccount.name)
        .all()
    )


@router.post(
    "/",
    response_model=ChartOfAccountResponse,
    status_code=201
)
def create_account(
    body: ChartOfAccountCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    existing = (
        db.query(ChartOfAccount)
        .filter(ChartOfAccount.name == body.name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Account already exists"
        )

    account = ChartOfAccount(
        name=body.name,
        account_type=body.account_type
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account


@router.patch(
    "/{account_id}/archive",
    response_model=ChartOfAccountResponse
)
def archive_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    account = db.get(ChartOfAccount, account_id)

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    account.is_active = False

    db.commit()
    db.refresh(account)

    return account