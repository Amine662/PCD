from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from pymongo.database import Database
from typing import Annotated
from pymongo.errors import DuplicateKeyError
from models.user_model import User, UserUpdate, LoginRequest
from models.errors import ErrorCode, APIError
from db import get_db
from auth import get_current_user
from auth import get_current_admin

router = APIRouter(tags=["users"])

def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
    return user

@router.get("/users")
async def get_users_by_name(name: str = None, db: Database = Depends(get_db)):
    try:
        query = {"name": name} if name else {}
        users = list(db["Infos"].find(query))
        return [serialize_user(user) for user in users]
    except Exception:
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)


@router.post("/users")
async def create_user(user: User, db: Database = Depends(get_db)):
    try:
        if db["Infos"].find_one({"email": user.email}):
            raise APIError(ErrorCode.USER_ALREADY_EXISTS)

        user_dict = user.dict()
        user_dict['_id'] = str(db["Infos"].insert_one(user_dict).inserted_id)
        return user_dict
    except DuplicateKeyError:
        raise APIError(ErrorCode.DUPLICATE_KEY_ERROR)
    except Exception:
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)


@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Database = Depends(get_db)):
    try:
        user = db["Infos"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        return serialize_user(user)
    except Exception:
        raise APIError(ErrorCode.INVALID_USER_ID, detail=f"Invalid user ID format: {user_id}")


@router.put("/users/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate, db: Database = Depends(get_db)):
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        if not update_data:
            raise APIError(ErrorCode.INVALID_INPUT, detail="No valid update data provided")

        result = db["Infos"].update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if result.modified_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)

        updated_user = db["Infos"].find_one({"_id": ObjectId(user_id)})
        return serialize_user(updated_user)
    except Exception:
        raise APIError(ErrorCode.INVALID_USER_ID, detail=f"Invalid user ID format: {user_id}")


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, db: Database = Depends(get_db)):
    try:
        result = db["Infos"].delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        return {"message": "User deleted successfully"}
    except Exception:
        raise APIError(ErrorCode.INVALID_USER_ID, detail=f"Invalid user ID format: {user_id}")
    

@router.get("/manage-users")
def get_all_users(db = Depends(get_db)):
    users = list(db["Infos"].find({"role": {"$ne": "admin"}})) 
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return {"users": users}
