#!/usr/bin/env python3
import os
import sys
from getpass import getpass

# Add backend root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import func
from app.db import SessionLocal
from app.models.user import User
from app.core.security import hash_password, validate_password_complexity


def main():
    print("=== Admin Bootstrap Script ===")

    name = os.getenv("ADMIN_NAME")
    login_id = os.getenv("ADMIN_LOGIN_ID")
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not name:
        name = input("Enter Admin Name (default: System Admin): ").strip() or "System Admin"
    if not login_id:
        login_id = input("Enter Admin Login ID (6-12 chars, e.g. admin01): ").strip()
    if not email:
        email = input("Enter Admin Email (e.g. admin@example.com): ").strip()
    if not password:
        password = getpass("Enter Admin Password: ").strip()

    if len(login_id) < 6 or len(login_id) > 12:
        print("ERROR: Login ID must be between 6 and 12 characters.")
        sys.exit(1)

    try:
        validate_password_complexity(password)
    except ValueError as e:
        print(f"ERROR: Password complexity check failed: {e}")
        sys.exit(1)

    normalized_login_id = login_id.strip().lower()
    normalized_email = email.strip().lower()

    db = SessionLocal()
    try:
        existing_login = (
            db.query(User)
            .filter(func.lower(User.login_id) == normalized_login_id)
            .first()
        )
        if existing_login:
            print(f"ERROR: User with login_id '{login_id}' already exists.")
            sys.exit(1)

        existing_email = (
            db.query(User)
            .filter(func.lower(User.email) == normalized_email)
            .first()
        )
        if existing_email:
            print(f"ERROR: User with email '{email}' already exists.")
            sys.exit(1)

        hashed_pw = hash_password(password)

        admin_user = User(
            name=name,
            login_id=login_id.strip(),
            email=normalized_email,
            password_hash=hashed_pw,
            role="admin",
            is_active=True,
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"SUCCESS: Admin user created successfully (ID: {admin_user.id}, Login ID: {admin_user.login_id})")

    except Exception as e:
        db.rollback()
        print(f"ERROR: Failed to create admin user: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
