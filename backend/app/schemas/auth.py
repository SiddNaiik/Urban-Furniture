from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

from app.core.security import validate_password_complexity


class UserSignupRequest(BaseModel):
    name: str
    login_id: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty.")
        return v

    @field_validator("login_id")
    @classmethod
    def validate_login_id(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 6 or len(v) > 12:
            raise ValueError("Login ID must be between 6 and 12 characters.")
        return v

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        validate_password_complexity(v)
        return v


class UserCreateAdminRequest(BaseModel):
    name: str
    login_id: str
    email: EmailStr
    password: str
    role: Literal["admin", "accountant", "user"]

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty.")
        return v

    @field_validator("login_id")
    @classmethod
    def validate_login_id(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 6 or len(v) > 12:
            raise ValueError("Login ID must be between 6 and 12 characters.")
        return v

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        validate_password_complexity(v)
        return v


class LoginRequest(BaseModel):
    login_id: str
    password: str

    @field_validator("login_id")
    @classmethod
    def normalize_login_id(cls, v: str) -> str:
        return v.strip()


class UserResponse(BaseModel):
    id: int
    name: str
    login_id: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdateAdminRequest(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: Literal["admin", "accountant", "user"] | None = None
    is_active: bool | None = None
    password: str | None = None

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v):
        if v is None:
            return v
        return str(v).strip().lower()
