from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles
from app.models.user import User

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])

INITIAL_BUDGETS = [
    {
        "id": "bud-1",
        "name": "Q3 2026 Marketing Budget",
        "period": "Q3 2026",
        "date_from": "2026-07-01",
        "date_to": "2026-09-30",
        "total_amount": 10000.0,
        "status": "confirmed",
        "lines": [{"id": "bl-1", "analytic_account_id": "aa-1", "planned_amount": 10000.0, "practical_amount": 5000.0, "percentage": 50}],
    },
    {
        "id": "bud-2",
        "name": "Q3 2026 Operations Budget",
        "period": "Q3 2026",
        "date_from": "2026-07-01",
        "date_to": "2026-09-30",
        "total_amount": 20000.0,
        "status": "draft",
        "lines": [{"id": "bl-2", "analytic_account_id": "aa-2", "planned_amount": 20000.0, "practical_amount": 12000.0, "percentage": 60}],
    },
]

budgets_db = list(INITIAL_BUDGETS)


@router.get("")
def get_budgets(
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    """
    Returns list of budgets. Strictly requires accountant or admin role.
    """
    return budgets_db


@router.get("/{budget_id}")
def get_budget(
    budget_id: str,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    bud = next((b for b in budgets_db if b["id"] == budget_id), None)
    if not bud:
        raise HTTPException(status_code=404, detail="Budget not found")
    return bud


@router.post("", status_code=201)
def create_budget(
    data: dict,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    new_bud = {
        "id": f"bud-{len(budgets_db) + 1}",
        "name": data.get("name", "New Budget"),
        "period": data.get("period", "Q3 2026"),
        "date_from": data.get("date_from", "2026-07-01"),
        "date_to": data.get("date_to", "2026-09-30"),
        "total_amount": data.get("total_amount", 0.0),
        "status": "draft",
        "lines": data.get("lines", []),
    }
    budgets_db.append(new_bud)
    return new_bud
