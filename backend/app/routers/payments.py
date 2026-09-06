from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles
from app.models.user import User

router = APIRouter(prefix="/api/payments", tags=["Payments"])

INITIAL_PAYMENTS = [
    {
        "id": "pay-1",
        "reference": "PAY/2026/0001",
        "partner_name": "Azure Interior",
        "partner_email": "rahul@example.com",
        "payment_type": "inbound",
        "amount": 25000.0,
        "date": "2026-08-22",
        "status": "posted",
    },
    {
        "id": "pay-2",
        "reference": "PAY/2026/0002",
        "partner_name": "Wood Corner Supplies",
        "partner_email": "wood@example.com",
        "payment_type": "outbound",
        "amount": 15000.0,
        "date": "2026-08-20",
        "status": "posted",
    },
]

payments_db = list(INITIAL_PAYMENTS)


@router.get("")
def get_payments(
    current_user: User = Depends(get_current_user),
):
    """
    Returns payments list.
    If role == 'user', enforces BACKEND ownership filtering (only user's payments).
    If role in ['admin', 'accountant'], returns all payments.
    """
    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        return [
            p for p in payments_db
            if p.get("partner_email", "").lower() == user_email or p.get("partner_name", "").lower() == user_login
        ]
    return payments_db


@router.get("/{payment_id}")
def get_payment(
    payment_id: str,
    current_user: User = Depends(get_current_user),
):
    pay = next((p for p in payments_db if p["id"] == payment_id or p.get("reference") == payment_id), None)
    if not pay:
        raise HTTPException(status_code=404, detail="Payment record not found")

    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        if pay.get("partner_email", "").lower() != user_email and pay.get("partner_name", "").lower() != user_login:
            raise HTTPException(status_code=403, detail="Access denied to this payment record")

    return pay


@router.post("", status_code=201)
def create_payment(
    data: dict,
    current_user: User = Depends(get_current_user),
):
    new_pay = {
        "id": f"pay-{len(payments_db) + 1}",
        "reference": f"PAY/2026/000{len(payments_db) + 1}",
        "partner_name": data.get("partner_name", current_user.name),
        "partner_email": data.get("partner_email", current_user.email),
        "payment_type": data.get("payment_type", "inbound"),
        "amount": data.get("amount", 0.0),
        "date": data.get("date", "2026-09-06"),
        "status": "posted",
    }
    payments_db.append(new_pay)
    return new_pay
