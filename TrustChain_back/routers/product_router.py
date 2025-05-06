from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import List
from models.Product_model import Product, ProductInDB, ProductResponse, ProductUpdate
from db import get_db
from pymongo.database import Database
from fastapi.responses import JSONResponse

router = APIRouter(tags=["products"])

def convert_objectid_to_str(product):
    product["_id"] = str(product["_id"]) 
    return product

@router.post("/products", response_model=ProductInDB)
async def create_product(product: Product, db: Database = Depends(get_db)):
    product_dict = product.dict()
    result = db["products"].insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    return ProductInDB(**product_dict) 

@router.get("/products", response_model=List[ProductInDB])
async def get_products(db: Database = Depends(get_db)):
    products = list(db["products"].find())
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return [ProductInDB(**product) for product in products] 

@router.get("/products/seller/{seller_id}", response_model=List[ProductInDB])
async def get_products_by_seller(seller_id: str, db: Database = Depends(get_db)):
    products = list(db["products"].find({"sellerId": seller_id}))
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this seller")
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return [ProductInDB(**product) for product in products]

@router.delete("/products/{product_id}", response_model=dict)
async def delete_product(product_id: str, db: Database = Depends(get_db)):
    result = db["products"].delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"msg": "Product deleted successfully"}

@router.put("/products/{product_id}")
def update_product(product_id: str, product: ProductUpdate, db: Database = Depends(get_db)):
    product_id = ObjectId(product_id)
    existing_product = db["products"].find_one({"_id": product_id})

    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {key: value for key, value in product.dict(exclude_unset=True).items()}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_result = db["products"].update_one({"_id": product_id}, {"$set": update_data})

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update product")

    updated_product = db["products"].find_one({"_id": product_id})
    updated_product = convert_objectid_to_str(updated_product)

    return JSONResponse(content={"message": "Product updated successfully", "product": updated_product})
@router.post("/api/products/cart-products")
async def get_cart_products(ids: List[str], db: Database = Depends(get_db)):
    try:
        object_ids = [ObjectId(id) for id in ids]
        cursor = db["products"].find({"_id": {"$in": object_ids}})
        products = list(cursor)
        for product in products:
            product["_id"] = str(product["_id"])
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product_by_id(product_id: str, db: Database = Depends(get_db)):
    try:
        product = db["products"].find_one({"_id": ObjectId(product_id)})
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        product["id"] = str(product["_id"]) 
        del product["_id"] 
        if 'image_url' not in product:
            product['image_url'] = ''
        if 'sellerId' in product:
            product['seller_id'] = product.pop('sellerId') 
        return ProductResponse(**product)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
