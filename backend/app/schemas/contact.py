from pydantic import (BaseModel, ConfigDict, EmailStr, Field)
from typing import Optional
from app.models.contact import ContactType

class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    contact_type: ContactType
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    street: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    country: Optional[str] = Field(default=None, max_length=100)
    pincode: Optional[str] = Field(default=None, max_length=20)
    image_url: Optional[str] = Field(default=None, max_length=500)


class ContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    contact_type: Optional[ContactType] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=20)
    street: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    country: Optional[str] = Field(default=None, max_length=100)
    pincode: Optional[str] = Field(default=None, max_length=20)
    image_url: Optional[str] = Field(default=None, max_length=500)


class ContactResponse(BaseModel):
    id: int
    name: str
    contact_type: ContactType
    email: EmailStr
    phone: Optional[str]
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    pincode: Optional[str]
    image_url: Optional[str]
    is_active: bool

    model_config = ConfigDict(from_attributes=True)