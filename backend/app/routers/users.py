from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import get_db
from app.dependencies.auth import require_admin
from app.models.user import User
from app.schemas.auth import UserCreateAdminRequest, UserResponse

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
