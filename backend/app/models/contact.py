from sqlalchemy import ( Column, Integer, String, Boolean, Enum, ForeignKey)
from app.db import Base

import enum

class ContactType(str, enum.Enum):
    CUSTOMER = "customer"
    VENDOR = "vendor"
    BOTH = "both"


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True )
    name = Column(String(150), nullable=False )
    contact_type = Column(Enum(ContactType), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True )
    street = Column(String(255), nullable=True )
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
