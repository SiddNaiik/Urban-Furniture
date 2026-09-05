from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import (or_, select)
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.product import Product, ProductCategory
from app.schemas.product import (CategoryCreate, CategoryResponse, ProductCreate, ProductResponse, ProductUpdate)
from app.core.permissions import require_roles

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(
    body: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    existing = db.scalar(
        select(ProductCategory).where(ProductCategory.name.ilike(body.name.strip()))
    )

    if existing:
        raise HTTPException(status_code=409, detail="Category already exists")

    category = ProductCategory(name=body.name.strip())

    db.add(category)
    db.commit()
    db.refresh(category)

    return category

@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    categories = db.scalars(
        select(ProductCategory).order_by(ProductCategory.name)
    ).all()

    return categories

@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    body: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    category = db.get(ProductCategory, body.category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    product = Product(
        name=body.name.strip(),
        type=body.type,
        category_id=body.category_id,
        sales_price=body.sales_price,
        cost=body.cost,
        image_url=body.image_url
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        category_id=product.category_id,
        category_name=category.name,
        sales_price=product.sales_price,
        cost=product.cost,
        image_url=product.image_url,
        is_active=product.is_active
    )

@router.get("", response_model=list[ProductResponse])
def get_products(
    search: str | None = Query(default=None),
    product_type: str | None = Query(default=None),
    category_id: int | None = Query(default=None),
    include_archived: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    query = (
        select(Product, ProductCategory.name)
        .join(ProductCategory, Product.category_id == ProductCategory.id)
    )

    if not include_archived:
        query = query.where(Product.is_active.is_(True))

    if search:
        search_value = f"%{search.strip()}%"

        query = query.where(
            or_(
                Product.name.ilike(search_value),
                ProductCategory.name.ilike(search_value)
            )
        )

    if product_type:
        query = query.where(Product.type == product_type)

    if category_id:
        query = query.where(Product.category_id == category_id)

    query = (
        query
        .order_by(Product.name)
        .offset(skip)
        .limit(limit)
    )

    results = db.execute(query).all()

    return [
        ProductResponse(
            id=product.id,
            name=product.name,
            type=product.type,
            category_id=product.category_id,
            category_name=category_name,
            sales_price=product.sales_price,
            cost=product.cost,
            image_url=product.image_url,
            is_active=product.is_active
        )
        for product, category_name in results
    ]

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    result = db.execute(
        select(Product, ProductCategory.name)
        .join(ProductCategory, Product.category_id == ProductCategory.id)
        .where(Product.id == product_id)
    ).first()

    if not result:
        raise HTTPException(status_code=404, detail="Product not found")

    product, category_name = result

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        category_id=product.category_id,
        category_name=category_name,
        sales_price=product.sales_price,
        cost=product.cost,
        image_url=product.image_url,
        is_active=product.is_active
    )

@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    body: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "accountant"))
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if body.category_id is not None:
        category = db.get(ProductCategory, body.category_id)

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        product.category_id = body.category_id

    if body.name is not None:
        product.name = body.name.strip()

    if body.type is not None:
        product.type = body.type

    if body.sales_price is not None:
        product.sales_price = body.sales_price

    if body.cost is not None:
        product.cost = body.cost

    if body.image_url is not None:
        product.image_url = body.image_url

    db.commit()
    db.refresh(product)

    category = db.get(ProductCategory, product.category_id)

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        category_id=product.category_id,
        category_name=category.name,
        sales_price=product.sales_price,
        cost=product.cost,
        image_url=product.image_url,
        is_active=product.is_active
    )

@router.patch("/{product_id}/archive", response_model=ProductResponse)
def archive_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin"))
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if not product.is_active:
        raise HTTPException(status_code=400, detail="Product is already archived")

    product.is_active = False

    db.commit()
    db.refresh(product)

    category = db.get(ProductCategory, product.category_id)

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        category_id=product.category_id,
        category_name=category.name,
        sales_price=product.sales_price,
        cost=product.cost,
        image_url=product.image_url,
        is_active=product.is_active
    )

@router.patch("/{product_id}/restore", response_model=ProductResponse)
def restore_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin"))
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.is_active:
        raise HTTPException(status_code=400, detail="Product is already active")

    product.is_active = True

    db.commit()
    db.refresh(product)

    category = db.get(ProductCategory, product.category_id)

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        category_id=product.category_id,
        category_name=category.name,
        sales_price=product.sales_price,
        cost=product.cost,
        image_url=product.image_url,
        is_active=product.is_active
    )