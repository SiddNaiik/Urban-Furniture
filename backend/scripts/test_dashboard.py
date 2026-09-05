#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

# Add backend root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import SessionLocal
from app.models.budget import Budget
from app.models.purchase_order import PurchaseOrder
from app.models.sales_order import SalesOrder
from app.models.user import User

BASE_URL = "http://127.0.0.1:8006"


def request(method, path, data=None, headers=None):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.status
            body = resp.read().decode("utf-8")
            json_body = json.loads(body) if body else None
            return status_code, json_body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        json_body = json.loads(body) if body else None
        return e.code, json_body


def run_dashboard_tests():
    print("==================================================")
    print("Running Main Dashboard Backend API Test Suite...")
    print("==================================================\n")

    # Start uvicorn server on port 8006
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8006", "--host", "127.0.0.1"],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(2)  # Wait for server startup

    try:
        db = SessionLocal()

        # Clean existing tables for test reproducibility
        db.query(SalesOrder).delete()
        db.query(PurchaseOrder).delete()
        db.query(Budget).delete()
        db.commit()

        # Get or create an admin token for authentication
        status, body = request(
            "POST",
            "/api/auth/login",
            {"login_id": "admin01", "password": "AdminPassword@123"},
        )
        if status != 200:
            # Create admin if not present
            from app.core.security import hash_password

            admin = User(
                name="Admin User",
                login_id="admin01",
                email="admin@example.com",
                password_hash=hash_password("AdminPassword@123"),
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
            status, body = request(
                "POST",
                "/api/auth/login",
                {"login_id": "admin01", "password": "AdminPassword@123"},
            )

        token = body["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}"}

        # ----------------------------------------------------
        # Test 1: Unauthenticated request -> 401 Unauthorized
        # ----------------------------------------------------
        print("[Test 1] Unauthenticated GET /api/dashboard/summary")
        status, body = request("GET", "/api/dashboard/summary")
        print(f"Status: {status}, Body: {body}")
        assert status == 401, f"Expected 401, got {status}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 2: Authenticated request on Empty Database -> Zero Counts
        # ----------------------------------------------------
        print("[Test 2] Authenticated GET /api/dashboard/summary (Empty Database)")
        status, body = request("GET", "/api/dashboard/summary", headers=auth_headers)
        print(f"Status: {status}, Body: {body}")
        assert status == 200, f"Expected 200, got {status}"
        assert body == {
            "sales": {"all": 0, "confirmed": 0, "draft": 0},
            "purchase": {"all": 0, "confirmed": 0, "draft": 0},
            "budget": {"achieved": 0, "budget": 0, "committed": 0},
        }, f"Unexpected response: {body}"
        print("-> PASSED\n")

        # ----------------------------------------------------
        # Test 3 & 4 & 5: Seed database with manual test scenario data
        # Sales: 2 draft, 3 confirmed, 1 cancelled (total 6)
        # Purchase: 1 draft, 4 confirmed (total 5)
        # Budget: 5 total budgets (4 committed, 3 achieved)
        # ----------------------------------------------------
        print("[Seeding Database with Test Scenario Records...]")

        # 2 draft sales, 3 confirmed sales, 1 cancelled sale
        sales_data = [
            SalesOrder(order_number="SO001", status="draft"),
            SalesOrder(order_number="SO002", status="draft"),
            SalesOrder(order_number="SO003", status="confirmed"),
            SalesOrder(order_number="SO004", status="confirmed"),
            SalesOrder(order_number="SO005", status="confirmed"),
            SalesOrder(order_number="SO006", status="cancelled"),
        ]
        db.add_all(sales_data)

        # 1 draft purchase, 4 confirmed purchases
        purchase_data = [
            PurchaseOrder(order_number="PO001", status="draft"),
            PurchaseOrder(order_number="PO002", status="confirmed"),
            PurchaseOrder(order_number="PO003", status="confirmed"),
            PurchaseOrder(order_number="PO004", status="confirmed"),
            PurchaseOrder(order_number="PO005", status="confirmed"),
        ]
        db.add_all(purchase_data)

        # 5 budgets:
        # B1: committed=1000, achieved=500 -> committed & achieved
        # B2: committed=2000, achieved=0 -> committed only
        # B3: committed=0, achieved=1500 -> achieved only
        # B4: status="committed", achieved=0 -> committed only
        # B5: draft, amounts=0 -> neither
        budget_data = [
            Budget(name="Q1 Marketing", planned_amount=5000, committed_amount=1000, achieved_amount=500, status="active"),
            Budget(name="Q2 IT Infra", planned_amount=10000, committed_amount=2000, achieved_amount=0, status="active"),
            Budget(name="Q3 Logistics", planned_amount=8000, committed_amount=0, achieved_amount=1500, status="active"),
            Budget(name="Q4 R&D", planned_amount=12000, committed_amount=0, achieved_amount=0, status="committed"),
            Budget(name="Draft Budget", planned_amount=3000, committed_amount=0, achieved_amount=0, status="draft"),
        ]
        db.add_all(budget_data)

        db.commit()
        db.close()
        print("-> Seed completed.\n")

        # ----------------------------------------------------
        # Test 6: Authenticated request with Seeded Data
        # Expected:
        # sales: all=6, confirmed=3, draft=2
        # purchase: all=5, confirmed=4, draft=1
        # budget: budget=5, committed=3 (B1, B2, B4), achieved=2 (B1, B3)
        # ----------------------------------------------------
        print("[Test 6] Authenticated GET /api/dashboard/summary (Seeded Database)")
        status, body = request("GET", "/api/dashboard/summary", headers=auth_headers)
        print(f"Status: {status}")
        print(f"Body: {json.dumps(body, indent=2)}")
        assert status == 200, f"Expected 200, got {status}"

        # Verify sales counts
        assert body["sales"]["all"] == 6, f"Expected sales.all 6, got {body['sales']['all']}"
        assert body["sales"]["confirmed"] == 3, f"Expected sales.confirmed 3, got {body['sales']['confirmed']}"
        assert body["sales"]["draft"] == 2, f"Expected sales.draft 2, got {body['sales']['draft']}"

        # Verify purchase counts
        assert body["purchase"]["all"] == 5, f"Expected purchase.all 5, got {body['purchase']['all']}"
        assert body["purchase"]["confirmed"] == 4, f"Expected purchase.confirmed 4, got {body['purchase']['confirmed']}"
        assert body["purchase"]["draft"] == 1, f"Expected purchase.draft 1, got {body['purchase']['draft']}"

        # Verify budget counts
        assert body["budget"]["budget"] == 5, f"Expected budget.budget 5, got {body['budget']['budget']}"
        assert body["budget"]["committed"] == 3, f"Expected budget.committed 3, got {body['budget']['committed']}"
        assert body["budget"]["achieved"] == 2, f"Expected budget.achieved 2, got {body['budget']['achieved']}"

        print("-> PASSED\n")

        print("==================================================")
        print(" ALL DASHBOARD API TEST SUITE CHECKLIST ITEMS PASSED!")
        print("==================================================")

    finally:
        proc.terminate()
        proc.wait()


if __name__ == "__main__":
    run_dashboard_tests()
