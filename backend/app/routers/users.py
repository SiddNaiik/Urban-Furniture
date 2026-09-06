from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import get_db
from app.dependencies.auth import require_admin
from app.models.user import User
from app.schemas.auth import UserCreateAdminRequest, UserResponse, UserUpdateAdminRequest

router = APIRouter(prefix="/api/users", tags=["User Management"])


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Admin-only create user",
)
def create_user(
    body: UserCreateAdminRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """
    Admin-only endpoint to create new users with assigned roles (admin, accountant, user).
    """
    normalized_login_id = body.login_id.strip().lower()
    normalized_email = body.email.strip().lower()

    if body.role not in ["admin", "accountant", "user"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role specified",
        )

    # Check case-insensitive login_id duplicate
    existing_login = (
        db.query(User).filter(func.lower(User.login_id) == normalized_login_id).first()
    )
    if existing_login:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Login ID already registered",
        )

    # Check case-insensitive email duplicate
    existing_email = (
        db.query(User).filter(func.lower(User.email) == normalized_email).first()
    )
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed_pw = hash_password(body.password)

    new_user = User(
        name=body.name,
        login_id=body.login_id.strip(),
        email=normalized_email,
        password_hash=hashed_pw,
        role=body.role,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get(
    "",
    response_model=List[UserResponse],
    summary="Admin-only list all users",
)
def list_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin-only endpoint to list all users."""
    return db.query(User).order_by(User.id.asc()).all()


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Admin-only get user by ID",
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin-only endpoint to fetch a single user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Admin-only update user",
)
def update_user(
    user_id: int,
    body: UserUpdateAdminRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    """Admin-only endpoint to update user fields (name, email, role, is_active, password)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = body.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        normalized_email = update_data["email"].strip().lower()
        existing = (
            db.query(User)
            .filter(func.lower(User.email) == normalized_email, User.id != user_id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )
        update_data["email"] = normalized_email

    if "password" in update_data and update_data["password"]:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    else:
        update_data.pop("password", None)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user
