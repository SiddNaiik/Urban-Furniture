from decimal import Decimal

from pydantic import (BaseModel, Field, ConfigDict)

from app.models.product import ProductType


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    type: ProductType
    category_id: int
    sales_price: Decimal = Field(ge=0)
    cost: Decimal = Field(ge=0)
    image_url: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    type: ProductType | None = None
    category_id: int | None = None
    sales_price: Decimal | None = Field(default=None, ge=0)
    cost: Decimal | None = Field(default=None, ge=0)
    image_url: str | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    type: ProductType
    category_id: int
    category_name: str
    sales_price: Decimal
    cost: Decimal
    image_url: str | None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)