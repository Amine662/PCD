from fastapi import APIRouter, HTTPException, status, Depends
from pymongo.database import Database
from models.order_model import Order, OrderResponse, OrderInDB, OrderCreate
from typing import List
from bson import ObjectId
from db import get_db
import datetime

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

def serialize_order(order):
    order["id"] = str(order["_id"])
    del order["_id"]
    return order

@router.get("/", response_model=List[OrderResponse])
async def get_orders(db: Database = Depends(get_db)):
    orders_cursor = db["orders"].find()  # This returns a cursor
    orders_list = []
    
    # Use a simple for loop to iterate through the cursor
    for order in orders_cursor:
        orders_list.append(serialize_order(order))
    
    return orders_list

# GET a single order
@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, db: Database = Depends(get_db)):
    order = db["orders"].find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)

# CREATE a new order
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: Order, db: Database = Depends(get_db)):
    order_dict = order.dict()
    result = db["orders"].insert_one(order_dict)
    created_order = db["orders"].find_one({"_id": result.inserted_id})
    return serialize_order(created_order)

# UPDATE an order
@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: str, order_data: Order, db: Database = Depends(get_db)):
    existing_order = db["orders"].find_one({"_id": ObjectId(order_id)})
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db["orders"].update_one(
        {"_id": ObjectId(order_id)},
        {"$set": order_data.dict(exclude_unset=True)}
    )
    updated_order = db["orders"].find_one({"_id": ObjectId(order_id)})
    return serialize_order(updated_order)

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: str, db: Database = Depends(get_db)):
    order = db["orders"].find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db["orders"].delete_one({"_id": ObjectId(order_id)})
    return None

@router.get("/seller/{seller_id}", response_model=List[OrderResponse])
async def get_orders_by_seller(seller_id: str, db: Database = Depends(get_db)):
    orders = list(db["orders"].find({"sellerId": seller_id}))
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this seller")
    for order in orders:
        order["id"] = str(order["_id"])  
        del order["_id"]  
    return [OrderResponse(**order) for order in orders]

@router.post("/ord/", response_model=OrderInDB)
async def create_order(order: OrderCreate, db:Database = Depends(get_db)):
    cart = await db["carts"].find_one({"user_id": ObjectId(order.user_id)})
    if not cart or not cart.get("items"):
        raise HTTPException(400, "Cart is empty")

    doc = order.dict()
    doc["status"] = "pending"
    doc["created_at"] = datetime.utcnow()

    result = await db["orders"].insert_one({
        **doc,
        "user_id": ObjectId(order.user_id),
        "seller_id": ObjectId(order.seller_id),
        "items": [
            {
                "product_id": ObjectId(i.product_id),
                "quantity": i.quantity,
                "seller_id": ObjectId(i.seller_id)
            }
            for i in order.items
        ]
    })
    await db["carts"].delete_one({"user_id": ObjectId(order.user_id)})
    created = await db["orders"].find_one({"_id": result.inserted_id})
    created["_id"] = created.pop("_id")
    return created
