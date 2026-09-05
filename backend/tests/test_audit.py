import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.db import SessionLocal
from app.models.user import User
from app.models.contact import Contact, ContactType
from app.models.product import Product, ProductCategory, ProductType
from app.core.security import hash_password, create_access_token

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    db: Session = SessionLocal()
    try:
        # Cleanup test data
        db.query(Contact).delete()
        db.query(Product).delete()
        db.query(ProductCategory).delete()
        db.query(User).filter(User.login_id.in_(["audit_admin", "audit_accountant", "audit_user"])).delete()
        db.commit()

        # Seed test users
        admin_user = User(
            name="Audit Admin",
            login_id="audit_admin",
            email="audit_admin@example.com",
            password_hash=hash_password("Pass@1234"),
            role="admin",
            is_active=True
        )
        accountant_user = User(
            name="Audit Accountant",
            login_id="audit_accountant",
            email="audit_accountant@example.com",
            password_hash=hash_password("Pass@1234"),
            role="accountant",
            is_active=True
        )
        regular_user = User(
            name="Audit User",
            login_id="audit_user",
            email="audit_user@example.com",
            password_hash=hash_password("Pass@1234"),
            role="user",
            is_active=True
        )
        db.add_all([admin_user, accountant_user, regular_user])
        db.commit()

        db.refresh(admin_user)
        db.refresh(accountant_user)
        db.refresh(regular_user)

        admin_token = create_access_token({"sub": str(admin_user.id), "role": admin_user.role})
        accountant_token = create_access_token({"sub": str(accountant_user.id), "role": accountant_user.role})
        user_token = create_access_token({"sub": str(regular_user.id), "role": regular_user.role})

        yield {
            "admin_headers": {"Authorization": f"Bearer {admin_token}"},
            "accountant_headers": {"Authorization": f"Bearer {accountant_token}"},
            "user_headers": {"Authorization": f"Bearer {user_token}"},
            "admin_id": admin_user.id,
            "accountant_id": accountant_user.id,
            "user_id": regular_user.id
        }
    finally:
        db.close()


def test_1_admin_contacts(setup_db):
    headers = setup_db["admin_headers"]

    # 1. Create Contact
    create_resp = client.post(
        "/api/contacts",
        json={
            "name": "Admin Contact",
            "contact_type": "customer",
            "email": "admin_contact@example.com",
            "phone": "1234567890",
            "city": "Mumbai"
        },
        headers=headers
    )
    assert create_resp.status_code == 201, create_resp.text
    contact_id = create_resp.json()["id"]

    # 2. Read Contact
    get_resp = client.get(f"/api/contacts/{contact_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Admin Contact"

    # 3. Update Contact
    put_resp = client.put(
        f"/api/contacts/{contact_id}",
        json={"name": "Admin Contact Updated"},
        headers=headers
    )
    assert put_resp.status_code == 200
    assert put_resp.json()["name"] == "Admin Contact Updated"

    # 4. Archive Contact
    archive_resp = client.patch(f"/api/contacts/{contact_id}/archive", headers=headers)
    assert archive_resp.status_code == 200
    assert archive_resp.json()["is_active"] is False


def test_2_accountant_contacts(setup_db):
    headers = setup_db["accountant_headers"]
    admin_headers = setup_db["admin_headers"]

    # 1. Create Contact
    create_resp = client.post(
        "/api/contacts",
        json={
            "name": "Accountant Contact",
            "contact_type": "vendor",
            "email": "accountant_contact@example.com",
        },
        headers=headers
    )
    assert create_resp.status_code == 201
    contact_id = create_resp.json()["id"]

    # 2. Read Contacts list
    list_resp = client.get("/api/contacts", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

    # 3. Update Contact
    update_resp = client.put(
        f"/api/contacts/{contact_id}",
        json={"city": "Delhi"},
        headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["city"] == "Delhi"

    # 4. Accountant CANNOT Archive Contact
    archive_resp = client.patch(f"/api/contacts/{contact_id}/archive", headers=headers)
    assert archive_resp.status_code == 403, "Accountant must not be able to archive contact"


def test_3_user_cannot_access_contacts(setup_db):
    headers = setup_db["user_headers"]

    # Read contacts list
    assert client.get("/api/contacts", headers=headers).status_code == 403
    # Create contact
    assert client.post(
        "/api/contacts",
        json={"name": "X", "contact_type": "customer", "email": "x@ex.com"},
        headers=headers
    ).status_code == 403
    # Get contact
    assert client.get("/api/contacts/1", headers=headers).status_code == 403
    # Update contact
    assert client.put("/api/contacts/1", json={"name": "Y"}, headers=headers).status_code == 403
    # Archive contact
    assert client.patch("/api/contacts/1/archive", headers=headers).status_code == 403


def test_4_admin_products(setup_db):
    headers = setup_db["admin_headers"]

    # Create Category
    cat_resp = client.post("/api/products/categories", json={"name": "Office Chairs"}, headers=headers)
    assert cat_resp.status_code == 201
    cat_id = cat_resp.json()["id"]

    # Create Product
    prod_resp = client.post(
        "/api/products",
        json={
            "name": "Ergonomic Chair",
            "type": "goods",
            "category_id": cat_id,
            "sales_price": 250.00,
            "cost": 150.00
        },
        headers=headers
    )
    assert prod_resp.status_code == 201
    prod_id = prod_resp.json()["id"]

    # Read Product
    assert client.get(f"/api/products/{prod_id}", headers=headers).status_code == 200

    # Update Product
    update_resp = client.patch(f"/api/products/{prod_id}", json={"sales_price": 275.00}, headers=headers)
    assert update_resp.status_code == 200
    assert float(update_resp.json()["sales_price"]) == 275.00

    # Archive Product
    arch_resp = client.patch(f"/api/products/{prod_id}/archive", headers=headers)
    assert arch_resp.status_code == 200
    assert arch_resp.json()["is_active"] is False


def test_5_accountant_products(setup_db):
    headers = setup_db["accountant_headers"]

    # Create Category
    cat_resp = client.post("/api/products/categories", json={"name": "Desks"}, headers=headers)
    assert cat_resp.status_code == 201
    cat_id = cat_resp.json()["id"]

    # Create Product
    prod_resp = client.post(
        "/api/products",
        json={
            "name": "Standing Desk",
            "type": "goods",
            "category_id": cat_id,
            "sales_price": 500.00,
            "cost": 300.00
        },
        headers=headers
    )
    assert prod_resp.status_code == 201
    prod_id = prod_resp.json()["id"]

    # Accountant CANNOT Archive Product
    arch_resp = client.patch(f"/api/products/{prod_id}/archive", headers=headers)
    assert arch_resp.status_code == 403, "Accountant must not be able to archive product"


def test_6_user_cannot_access_products(setup_db):
    headers = setup_db["user_headers"]

    # List categories
    assert client.get("/api/products/categories", headers=headers).status_code == 403
    # Create category
    assert client.post("/api/products/categories", json={"name": "Filing"}, headers=headers).status_code == 403
    # List products
    assert client.get("/api/products", headers=headers).status_code == 403
    # Create product
    assert client.post(
        "/api/products",
        json={"name": "P", "type": "goods", "category_id": 1, "sales_price": 10, "cost": 5},
        headers=headers
    ).status_code == 403
    # Update product
    assert client.patch("/api/products/1", json={"name": "P2"}, headers=headers).status_code == 403
    # Archive product
    assert client.patch("/api/products/1/archive", headers=headers).status_code == 403


def test_7_duplicate_contact_email_rejected(setup_db):
    headers = setup_db["admin_headers"]

    res1 = client.post(
        "/api/contacts",
        json={"name": "First", "contact_type": "customer", "email": "dup@example.com"},
        headers=headers
    )
    assert res1.status_code == 201

    res2 = client.post(
        "/api/contacts",
        json={"name": "Second", "contact_type": "customer", "email": "DUP@EXAMPLE.COM"},
        headers=headers
    )
    assert res2.status_code == 400
    assert "Email already exists" in res2.json()["detail"]


def test_8_invalid_product_category_rejected(setup_db):
    headers = setup_db["admin_headers"]

    res = client.post(
        "/api/products",
        json={
            "name": "Invalid Cat Product",
            "type": "goods",
            "category_id": 999999,
            "sales_price": 100.00,
            "cost": 50.00
        },
        headers=headers
    )
    assert res.status_code == 404
    assert "Category not found" in res.json()["detail"]


def test_9_archived_records_excluded_by_default(setup_db):
    headers = setup_db["admin_headers"]

    # Category
    cat_resp = client.post("/api/products/categories", json={"name": "Storage"}, headers=headers)
    cat_id = cat_resp.json()["id"]

    # Active product
    p1 = client.post(
        "/api/products",
        json={"name": "Active Cabinet", "type": "goods", "category_id": cat_id, "sales_price": 100, "cost": 50},
        headers=headers
    ).json()["id"]

    # Archived product
    p2 = client.post(
        "/api/products",
        json={"name": "Archived Cabinet", "type": "goods", "category_id": cat_id, "sales_price": 100, "cost": 50},
        headers=headers
    ).json()["id"]
    client.patch(f"/api/products/{p2}/archive", headers=headers)

    # Active contact
    c1 = client.post(
        "/api/contacts",
        json={"name": "Active Contact", "contact_type": "customer", "email": "act@ex.com"},
        headers=headers
    ).json()["id"]

    # Archived contact
    c2 = client.post(
        "/api/contacts",
        json={"name": "Archived Contact", "contact_type": "customer", "email": "arc@ex.com"},
        headers=headers
    ).json()["id"]
    client.patch(f"/api/contacts/{c2}/archive", headers=headers)

    # Verify default list excludes archived
    prods = client.get("/api/products", headers=headers).json()
    prod_ids = [p["id"] for p in prods]
    assert p1 in prod_ids
    assert p2 not in prod_ids

    contacts = client.get("/api/contacts", headers=headers).json()
    contact_ids = [c["id"] for c in contacts]
    assert c1 in contact_ids
    assert c2 not in contact_ids

    # Verify include_archived=True returns archived
    prods_all = client.get("/api/products?include_archived=true", headers=headers).json()
    prod_all_ids = [p["id"] for p in prods_all]
    assert p2 in prod_all_ids


def test_10_unauthenticated_requests_rejected(setup_db):
    assert client.get("/api/contacts").status_code == 401
    assert client.post("/api/contacts", json={}).status_code == 401
    assert client.get("/api/products").status_code == 401
    assert client.post("/api/products", json={}).status_code == 401
    assert client.get("/api/products/categories").status_code == 401
    assert client.get("/api/dashboard/summary").status_code == 401
