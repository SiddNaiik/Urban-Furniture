from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    UserResponse,
    UserSignupRequest,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Public user signup",
)
def signup(body: UserSignupRequest, db: Session = Depends(get_db)):
    """
    Public signup endpoint. Automatically sets role to 'user'.
    Checks for case-insensitive duplicate login_id and email.
    """
    normalized_login_id = body.login_id.strip().lower()
    normalized_email = body.email.strip().lower()

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
        role="user",  # Public signup ALWAYS creates role = user
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User login",
)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    User login endpoint. Authenticates login_id and password,
    returns JWT access token and user profile.
    """
    normalized_login_id = body.login_id.strip().lower()

    user = (
        db.query(User).filter(func.lower(User.login_id) == normalized_login_id).first()
    )

    if not user or not verify_password(body.password, user.password_hash):
        # Do NOT reveal whether user exists
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Login Id or Password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive",
        )

    token = create_access_token(data={"sub": str(user.id), "role": user.role})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns profile information for the authenticated user.
    """
    return current_user
