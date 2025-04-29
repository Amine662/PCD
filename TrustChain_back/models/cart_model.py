from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from models.Product_model import Product
from typing import Optional

class CartItem(BaseModel):
    product_id: str = Field(..., description="Mongo ObjectId of the product")
    quantity:   int = Field(..., gt=0, description="How many the user intends to buy")
    seller_id:  str = Field(..., description="Mongo ObjectId of the seller")
    product_details: Optional[Product] = None

class CartCreate(BaseModel):
    user_id: str              = Field(..., description="Mongo ObjectId of the user")
    items:   List[CartItem]   = Field(..., description="List of items in the cart")

class CartResponse(CartCreate):
    id:         str           = Field(..., description="Mongo ObjectId of this cart document")
    updated_at: datetime      = Field(..., description="When this cart was last saved")

    class Config:
        orm_mode = True

