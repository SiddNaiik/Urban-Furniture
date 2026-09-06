from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles
from app.models.user import User

router = APIRouter(prefix="/api/sales", tags=["Sales"])

# In-memory invoice/order store reusing existing backend data structure
INITIAL_INVOICES = [
    {
        "id": "inv-1",
        "number": "INV/2026/0001",
        "customer": "Azure Interior",
        "customer_email": "rahul@example.com", # Belongs to user rahul01 for testing
        "date": "2026-08-21",
        "due_date": "2026-09-20",
        "amount": 25000.0,
        "status": "posted",
        "lines": [
            {"id": "il-1", "product_id": "prod-1", "name": "Air Conditioner", "quantity": 1, "price_unit": 25000.0, "amount": 25000.0}
        ],
    },
    {
        "id": "inv-2",
        "number": "INV/2026/0002",
        "customer": "Deco Addict",
        "customer_email": "deco@example.com",
        "date": "2026-08-29",
        "due_date": "2026-09-28",
        "amount": 10000.0,
        "status": "overdue",
        "lines": [
            {"id": "il-2", "product_id": "prod-2", "name": "Refrigerator", "quantity": 1, "price_unit": 10000.0, "amount": 10000.0}
        ],
    },
]

INITIAL_SALES_ORDERS = [
    {
        "id": "so-1",
        "reference": "S00001",
        "customer": "Azure Interior",
        "date": "2026-08-20",
        "total": 770.0,
        "status": "sale",
        "order_lines": [
            {"id": "sol-1", "product_id": "prod-1", "name": "Air Conditioner", "quantity": 1, "unit_price": 25000.0, "subtotal": 25000.0}
        ],
    },
    {
        "id": "so-2",
        "reference": "S00002",
        "customer": "Deco Addict",
        "date": "2026-08-28",
        "total": 10000.0,
        "status": "draft",
        "order_lines": [
            {"id": "sol-2", "product_id": "prod-2", "name": "Refrigerator", "quantity": 1, "unit_price": 10000.0, "subtotal": 10000.0}
        ],
    },
]

invoices_db = list(INITIAL_INVOICES)
sales_orders_db = list(INITIAL_SALES_ORDERS)


@router.get("/invoices")
def get_customer_invoices(
    current_user: User = Depends(get_current_user),
):
    """
    Returns customer invoices.
    If role == 'user', enforces BACKEND ownership filtering (returns only user's invoices).
    If role in ['admin', 'accountant'], returns all invoices.
    """
    if current_user.role == "user":
        # Ownership check: filter invoices matching user's email or login_id
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        return [
            inv for inv in invoices_db
            if inv.get("customer_email", "").lower() == user_email or inv.get("customer", "").lower() == user_login
        ]
    return invoices_db


@router.get("/invoices/{invoice_id}")
def get_customer_invoice(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
):
    inv = next((i for i in invoices_db if i["id"] == invoice_id or i.get("number") == invoice_id), None)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        if inv.get("customer_email", "").lower() != user_email and inv.get("customer", "").lower() != user_login:
            raise HTTPException(status_code=403, detail="Access denied to this invoice")

    return inv


@router.post("/invoices", status_code=201)
def create_customer_invoice(
    data: dict,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    new_inv = {
        "id": f"inv-{len(invoices_db) + 1}",
        "number": f"INV/2026/000{len(invoices_db) + 1}",
        "customer": data.get("customer", "Customer"),
        "customer_email": data.get("customer_email", ""),
        "date": data.get("date", "2026-09-06"),
        "due_date": data.get("due_date", "2026-10-06"),
        "amount": data.get("amount", 0.0),
        "status": data.get("status", "draft"),
        "lines": data.get("lines", []),
    }
    invoices_db.append(new_inv)
    return new_inv


@router.post("/invoices/{invoice_id}/register-payment")
@router.post("/invoices/register-payment")
def register_invoice_payment(
    body: dict,
    invoice_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
):
    target_id = invoice_id or body.get("invoice_id")
    if not target_id:
        raise HTTPException(status_code=400, detail="Invoice ID is required")

    inv = next((i for i in invoices_db if i["id"] == target_id or i.get("number") == target_id), None)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if current_user.role == "user":
        user_email = current_user.email.lower()
        user_login = current_user.login_id.lower()
        if inv.get("customer_email", "").lower() != user_email and inv.get("customer", "").lower() != user_login:
            raise HTTPException(status_code=403, detail="Cannot pay another user's invoice")

    inv["status"] = "paid"
    return {"message": "Payment registered successfully", "invoice": inv}


@router.get("/orders")
def get_sales_orders(
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    return sales_orders_db


@router.post("/orders", status_code=201)
def create_sales_order(
    data: dict,
    current_user: User = Depends(require_roles("admin", "accountant")),
):
    new_so = {
        "id": f"so-{len(sales_orders_db) + 1}",
        "reference": f"S0000{len(sales_orders_db) + 1}",
        "customer": data.get("customer", "Customer"),
        "date": data.get("date", "2026-09-06"),
        "total": data.get("total", 0.0),
        "status": "draft",
        "order_lines": data.get("order_lines", []),
    }
    sales_orders_db.append(new_so)
    return new_so
