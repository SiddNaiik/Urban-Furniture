from fastapi import APIRouter, Depends, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import require_accountant_or_admin
from app.models.budget import Budget
from app.models.purchase_order import PurchaseOrder
from app.models.sales_order import SalesOrder
from app.models.user import User
from app.schemas.dashboard import (
    BudgetSummary,
    DashboardSummaryResponse,
    OrderSummary,
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary counts",
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_accountant_or_admin),
):
    """
    Returns aggregated counts for Sales Orders, Purchase Orders, and Budgets.
    Requires authentication via JWT.
    """
    # Sales Counts
    sales_all = db.query(func.count(SalesOrder.id)).scalar() or 0
    sales_confirmed = (
        db.query(func.count(SalesOrder.id))
        .filter(func.lower(SalesOrder.status) == "confirmed")
        .scalar()
        or 0
    )
    sales_draft = (
        db.query(func.count(SalesOrder.id))
        .filter(func.lower(SalesOrder.status) == "draft")
        .scalar()
        or 0
    )

    # Purchase Counts
    purchase_all = db.query(func.count(PurchaseOrder.id)).scalar() or 0
    purchase_confirmed = (
        db.query(func.count(PurchaseOrder.id))
        .filter(func.lower(PurchaseOrder.status) == "confirmed")
        .scalar()
        or 0
    )
    purchase_draft = (
        db.query(func.count(PurchaseOrder.id))
        .filter(func.lower(PurchaseOrder.status) == "draft")
        .scalar()
        or 0
    )

    # Budget Counts
    budget_total = db.query(func.count(Budget.id)).scalar() or 0
    budget_committed = (
        db.query(func.count(Budget.id))
        .filter(
            or_(
                Budget.committed_amount > 0,
                func.lower(Budget.status) == "committed",
            )
        )
        .scalar()
        or 0
    )
    budget_achieved = (
        db.query(func.count(Budget.id))
        .filter(
            or_(
                Budget.achieved_amount > 0,
                func.lower(Budget.status) == "achieved",
            )
        )
        .scalar()
        or 0
    )

    return DashboardSummaryResponse(
        sales=OrderSummary(
            all=sales_all,
            confirmed=sales_confirmed,
            draft=sales_draft,
        ),
        purchase=OrderSummary(
            all=purchase_all,
            confirmed=purchase_confirmed,
            draft=purchase_draft,
        ),
        budget=BudgetSummary(
            achieved=budget_achieved,
            budget=budget_total,
            committed=budget_committed,
        ),
    )
