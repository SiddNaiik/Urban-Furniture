import os
import shutil
import uuid

from fastapi import (APIRouter, Depends, HTTPException, Query, UploadFile, File)
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional

from app.db import get_db
from app.models.contact import Contact
from app.schemas.contact import (ContactCreate, ContactUpdate, ContactResponse)

from app.dependencies.auth import get_current_user
from app.core.permissions import require_roles

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])

@router.post("", response_model=ContactResponse, status_code=201)
def create_contact(
    contact_data: ContactCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    normalized_email = contact_data.email.strip().lower()
    existing_contact = (
        db.query(Contact)
        .filter(func.lower(Contact.email) == normalized_email)
        .first()
    )

    if existing_contact:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_contact = Contact(
        name=contact_data.name.strip(),
        contact_type=contact_data.contact_type,
        email=normalized_email,
        phone=contact_data.phone,
        street=contact_data.street,
        city=contact_data.city,
        state=contact_data.state,
        country=contact_data.country,
        pincode=contact_data.pincode,
        image_url=contact_data.image_url,
        created_by=current_user.id,
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact

@router.get("", response_model=list[ContactResponse])
def get_contacts(
    search: Optional[str] = Query(default=None),
    contact_type: Optional[str] = Query(default=None),
    include_archived: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):

    query = db.query(Contact)

    if not include_archived:
        query = query.filter(Contact.is_active == True)

    if contact_type:
        query = query.filter(Contact.contact_type == contact_type)

    if search:
        search_pattern = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Contact.name.ilike(search_pattern),
                Contact.email.ilike(search_pattern),
                Contact.phone.ilike(search_pattern),
                Contact.city.ilike(search_pattern)
            )
        )

    contacts = (
        query
        .order_by(Contact.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return contacts

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    query = db.query(Contact).filter(Contact.id == contact_id)

    contact = query.first()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact_data: ContactUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):

    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id)
        .first()
    )

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    update_data = contact_data.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        normalized_email = update_data["email"].strip().lower()
        existing_contact = (
            db.query(Contact)
            .filter(
                func.lower(Contact.email) == normalized_email,
                Contact.id != contact_id
            )
            .first()
        )

        if existing_contact:
            raise HTTPException(status_code=400, detail="Email already exists")

        update_data["email"] = normalized_email

    for field, value in update_data.items():
        setattr(contact, field, value)

    db.commit()
    db.refresh(contact)

    return contact

@router.patch("/{contact_id}/archive", response_model=ContactResponse)
def archive_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin"))
):

    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id)
        .first()
    )

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    if not contact.is_active:
        raise HTTPException(status_code=400, detail="Contact is already archived")

    contact.is_active = False

    db.commit()
    db.refresh(contact)

    return contact

@router.patch("/{contact_id}/restore", response_model=ContactResponse)
def restore_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin"))
):

    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id)
        .first()
    )

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    if contact.is_active:
        raise HTTPException(status_code=400, detail="Contact is already active")

    contact.is_active = True

    db.commit()
    db.refresh(contact)

    return contact

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"}


@router.post("/{contact_id}/image", response_model=ContactResponse)
def upload_contact_image(
    contact_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):

    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id)
        .first()
    )

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG and PNG images are allowed"
        )

    file_extension = os.path.splitext(file.filename)[1]

    unique_filename = f"{uuid.uuid4()}{file_extension}"

    upload_directory = "uploads/contacts"

    os.makedirs(upload_directory, exist_ok=True)

    file_path = os.path.join(upload_directory, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    contact.image_url = f"/uploads/contacts/{unique_filename}"

    db.commit()
    db.refresh(contact)

    return contact