from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from typing import List
from models.Product_model import Product, ProductInDB, ProductResponse, ProductUpdate
from db import get_db
from pymongo.database import Database
from fastapi.responses import JSONResponse

router = APIRouter(tags=["products"])

# Helper function to convert ObjectId to string
def convert_objectid_to_str(product):
    product["_id"] = str(product["_id"])  # Convert ObjectId to string
    return product

# Create a product
@router.post("/products", response_model=ProductInDB)
async def create_product(product: Product, db: Database = Depends(get_db)):
    product_dict = product.dict()
    result = db["products"].insert_one(product_dict)
    product_dict["id"] = str(result.inserted_id)
    return ProductInDB(**product_dict) 

# Get all products
@router.get("/products", response_model=List[ProductInDB])
async def get_products(db: Database = Depends(get_db)):
    products = list(db["products"].find())
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return [ProductInDB(**product) for product in products] 

# Get products by seller
@router.get("/products/seller/{seller_id}", response_model=List[ProductInDB])
async def get_products_by_seller(seller_id: str, db: Database = Depends(get_db)):
    products = list(db["products"].find({"sellerId": seller_id}))
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this seller")
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
    return [ProductInDB(**product) for product in products]

# Delete a product
@router.delete("/products/{product_id}", response_model=dict)
async def delete_product(product_id: str, db: Database = Depends(get_db)):
    result = db["products"].delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"msg": "Product deleted successfully"}

# Update a product
@router.put("/products/{product_id}")
def update_product(product_id: str, product: ProductUpdate, db: Database = Depends(get_db)):
    product_id = ObjectId(product_id)  # Convert to ObjectId
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

# Get products for the cart (using list of product ids)
@router.post("/api/products/cart-products")
async def get_cart_products(ids: List[str], db: Database = Depends(get_db)):
    try:
        object_ids = [ObjectId(id) for id in ids]  # Convert string IDs to ObjectId
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
        # Fetch the product from the database
        product = db["products"].find_one({"_id": ObjectId(product_id)})
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Convert _id to id field for the response
        product["id"] = str(product["_id"])  # Add the 'id' field from '_id'
        del product["_id"]  # Remove the '_id' field
        
        # Ensure 'image' and 'seller_id' are included, default to empty string if missing
        if 'image' not in product:
            product['image'] = ''
        if 'sellerId' in product:
            product['seller_id'] = product.pop('sellerId')  # Rename sellerId to seller_id

        # Convert the MongoDB product document to the ProductResponse model
        return ProductResponse(**product)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
