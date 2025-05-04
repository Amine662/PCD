from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from TrustChain_back.services.blockchain_service import

router = APIRouter(prefix="/blockchain", tags=["blockchain"])

class AddProductRequest(BaseModel):
    name: str
    description: str
    price: int  # in Wei
    quantity: int
    seller_private_key: str

class UpdateProductRequest(BaseModel):
    product_id: int
    name: str
    description: str
    price: int
    quantity: int
    available: bool
    seller_private_key: str

class BuyProductRequest(BaseModel):
    product_id: int
    buyer_private_key: str
    value: int  # in Wei

@router.post("/add_product")
def add_product(req: AddProductRequest):
    try:
        tx_hash = blockchain_service.add_product(
            req.name, req.description, req.price, req.quantity, req.seller_private_key
        )
        return {"tx_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update_product")
def update_product(req: UpdateProductRequest):
    try:
        tx_hash = blockchain_service.update_product(
            req.product_id, req.name, req.description, req.price, req.quantity, req.available, req.seller_private_key
        )
        return {"tx_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/buy_product")
def buy_product(req: BuyProductRequest):
    try:
        tx_hash = blockchain_service.buy_product(
            req.product_id, req.buyer_private_key, req.value
        )
        return {"tx_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
