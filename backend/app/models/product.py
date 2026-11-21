from typing import List, Optional
from pydantic import BaseModel, Field

class ProductBase(BaseModel):
    name: str
    category: str
    category_label: str
    price: float
    original_price: float
    unit: str
    rating: float = 4.8
    reviews_count: int = 100
    tag: Optional[str] = None
    in_stock: bool = True
    image: str
    additional_images: Optional[List[str]] = []
    description: str
    benefits: List[str] = []
    usage_instructions: str
    fragrance_or_type: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    in_stock: Optional[bool] = None
    description: Optional[str] = None
    image: Optional[str] = None
    tag: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
