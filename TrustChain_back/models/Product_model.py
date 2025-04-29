from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    name: str
    description: str
    price: float
    quantity: int
    sellerId: str
    image_url: Optional[str] = None
    category: Optional[str] = None

    class Config:
        orm_mode = True

class ProductInDB(Product):
    id: str

    class Config:
        orm_mode = True


class ProductUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    quantity: Optional[int]
    image_url: Optional[str]
    category: Optional[str]


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    image: Optional[str] = None  # Optional field
    seller_id: Optional[str] = None  # Optional field

    class Config:
        orm_mode = True