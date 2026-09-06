from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles
from app.models.user import User

router = APIRouter(prefix="/api/purchase", tags=["Purchase"])

INITIAL_VENDOR_BILLS = [
    {
        "id": "bill-1",
        "reference": "BILL/2026/0001",
        "vendor": "Wood Corner Supplies",
        "vendor_email": "rahul@example.com", # Belongs to user rahul01 for testing
        "date": "2026-08-19",
        "due_date": "2026-09-18",
        "amount": 15000.0,
        "status": "posted",
        "lines": [
            {"id": "bl-1", "product_id": "prod-1", "name": "Air Conditioner", "quantity": 1, "price_unit": 15000.0, "amount": 15000.0}
        ],
    },
    {
        "id": "bill-2",
        "reference": "BILL/2026/0002",
        "vendor": "Metal Works Ltd",
        "vendor_email": "metal@example.com",
        "date": "2026-08-31",
        "due_date": "2026-09-30",
        "amount": 7000.0,
        "status": "draft",
        "lines": [
            {"id": "bl-2", "product_id": "prod-2", "name": "Refrigerator", "quantity": 1, "price_unit": 7000.0, "amount": 7000.0}
        ],
    },
]

INITIAL_PURCHASE_ORDERS = [
    {
        "id": "po-1",
        "reference": "P00001",
        "vendor": "Wood Corner Supplies",
        "date": "2026-08-18",
        "total": 15000.0,
        "status": "purchase",
        "order_lines": [
            {"id": "pol-1", "product_id": "prod-1", "name": "Air Conditioner", "quantity": 1, "unit_price": 15000.0, "subtotal": 15000.0}
        ],
    },
    {
        "id": "po-2",
        "reference": "P00002",
        "vendor": "Metal Works Ltd",
        "date": "2026-08-30",
        "total": 7000.0,
        "status": "draft",
        "order_lines": [
            {"id": "pol-2", "product_id": "prod-2", "name": "Refrigerator", "quantity": 1, "unit_price": 7000.0, "subtotal": 7000.0}
        ],
    },
]

vendor_bills_db = list(INITIAL_VENDOR_BILLS)
purchase_orders_db = list(INITIAL_PURCHASE_ORDERS)


@router.get("/vendor-bills")
def get_vendor_bills(
    current_user: User = Depends(get_current_user),
):
    """
    Returns vendor bills.
    If role == 'user', enforces BACKEND ownership filtering.
    If role in ['admin', 'accountant'], returns all bills.
    """
    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        return [
            b for b in vendor_bills_db
            if b.get("vendor_email", "").lower() == user_email or b.get("vendor", "").lower() == user_login
        ]
    return vendor_bills_db


@router.get("/vendor-bills/{bill_id}")
def get_vendor_bill(
    bill_id: str,
    current_user: User = Depends(get_current_user),
):
    bill = next((b for b in vendor_bills_db if b["id"] == bill_id or b.get("reference") == bill_id), None)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        if bill.get("vendor_email", "").lower() != user_email and bill.get("vendor", "").lower() != user_login:
            raise HTTPException(status_code=403, detail="Access denied to this bill")

    return bill


@router.post("/vendor-bills", status_code=201)
def create_vendor_bill(
    data: dict,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    new_bill = {
        "id": f"bill-{len(vendor_bills_db) + 1}",
        "reference": f"BILL/2026/000{len(vendor_bills_db) + 1}",
        "vendor": data.get("vendor", "Vendor"),
        "vendor_email": data.get("vendor_email", ""),
        "date": data.get("date", "2026-09-06"),
        "due_date": data.get("due_date", "2026-10-06"),
        "amount": data.get("amount", 0.0),
        "status": data.get("status", "draft"),
        "lines": data.get("lines", []),
    }
    vendor_bills_db.append(new_bill)
    return new_bill


@router.post("/vendor-bills/{bill_id}/register-payment")
@router.post("/vendor-bills/register-payment")
def register_bill_payment(
    body: dict,
    bill_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    target_id = bill_id or body.get("bill_id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Bill ID is required")

    bill = next((b for b in vendor_bills_db if b["id"] == target_id or b.get("reference") == target_id), None)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        if bill.get("vendor_email", "").lower() != user_email and bill.get("vendor", "").lower() != user_login:
            raise HTTPException(status_code=403, detail="Cannot pay another user's bill")

    bill["status"] = "paid"
    return {"message": "Bill payment registered successfully", "bill": bill}


@router.get("/orders")
def get_purchase_orders(
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    return purchase_orders_db


@router.post("/orders", status_code=201)
def create_purchase_order(
    data: dict,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    new_po = {
        "id": f"po-{len(purchase_orders_db) + 1}",
        "reference": f"P0000{len(purchase_orders_db) + 1}",
        "vendor": data.get("vendor", "Vendor"),
        "date": data.get("date", "2026-09-06"),
        "total": data.get("total", 0.0),
        "status": "draft",
        "order_lines": data.get("order_lines", []),
    }
    purchase_orders_db.append(new_po)
    return new_po
