from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from models.cart_model import CartCreate, CartResponse, CartItem
from db import get_db
from models.Product_model import Product

router = APIRouter(prefix="/cart", tags=["cart"])

@router.post(
    "/",
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new cart (or overwrite existing)")
def create_cart(payload: CartCreate, db: Database = Depends(get_db)):
    user_oid = ObjectId(payload.user_id)
    cart = db["carts"].find_one({"user_id": user_oid})

    if cart:
        existing_items = cart.get("items", [])
        item_map = {
            (str(i["product_id"]), str(i["seller_id"])): i
            for i in existing_items
        }
        for i in payload.items:
            key = (i.product_id, i.seller_id)
            if key in item_map:
                item_map[key]["quantity"] += i.quantity
                item_map[key]["product_details"] = i.product_details.dict() if i.product_details else {}
            else:
                item_map[key] = {
                    "product_id": ObjectId(i.product_id),
                    "quantity": i.quantity,
                    "seller_id": ObjectId(i.seller_id),
                    "product_details": i.product_details.dict() if i.product_details else {}
                }
        updated_items = list(item_map.values())
        db["carts"].update_one(
            {"user_id": user_oid},
            {
                "$set": {
                    "items": updated_items,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    else:
        new_cart = {
            "user_id": user_oid,
            "items": [
                {
                    "product_id": ObjectId(i.product_id),
                    "quantity": i.quantity,
                    "seller_id": ObjectId(i.seller_id),
                    "product_details": i.product_details.dict() if i.product_details else {}
                }
                for i in payload.items
            ],
            "updated_at": datetime.utcnow()
        }
        db["carts"].insert_one(new_cart)

    raw = db["carts"].find_one({"user_id": user_oid})
    if not raw:
        raise HTTPException(status_code=500, detail="Failed to read back cart")

    return CartResponse(
        id=str(raw["_id"]),
        user_id=str(raw["user_id"]),
        items=[
            CartItem(
                product_id=str(i["product_id"]),
                quantity=i["quantity"],
                seller_id=str(i["seller_id"]),
                product_details=Product(**i.get("product_details", {}))
            )
            for i in raw["items"]
        ],
        updated_at=raw["updated_at"]
    )


@router.get(
    "/{user_id}",
    response_model=CartResponse,
    summary="Get the cart for a user (or empty if none)"
)
def get_cart(user_id: str, db: Database = Depends(get_db)):
    raw = db["carts"].find_one({"user_id": ObjectId(user_id)})
    if not raw:
        return CartResponse(user_id=user_id, items=[], id="", updated_at=datetime.utcnow())
    items = []
    for i in raw["items"]:
        product = db["products"].find_one({"_id": i["product_id"]})
        product_details = None
        if product:
            product_details = Product(
                name=product["name"],
                price=product["price"],
                image_url=product.get("image_url"),
                description=product.get("description", ""),
                quantity=product.get("quantity", 0),
                sellerId=str(product.get("sellerId", "")),
                category=product.get("category")
            )
        items.append(CartItem(
            product_id=str(i["product_id"]),
            quantity=i["quantity"],
            seller_id=str(i["seller_id"]),
            product_details=product_details 
        ))
    return CartResponse(
        id=str(raw["_id"]),
        user_id=str(raw["user_id"]),
        items=items,
        updated_at=raw["updated_at"]
    )

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user's cart"
)
def delete_cart(user_id: str, db: Database = Depends(get_db)):
    result = db["carts"].delete_one({"user_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart not found")
    return

@router.delete(
    "/cart/{user_id}/item/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a specific item from user's cart"
)
def delete_cart_item(user_id: str, product_id: str, db: Database = Depends(get_db)):
    try:
        user_oid = ObjectId(user_id)
        product_oid = ObjectId(product_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    cart = db["carts"].find_one({"user_id": user_oid, "items.product_id": product_oid})
    if not cart:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    result = db["carts"].update_one(
        {"user_id": user_oid},
        {"$pull": {"items": {"product_id": product_oid}}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return {"message": "Item removed successfully"}