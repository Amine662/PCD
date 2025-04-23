from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from pymongo.database import Database
from typing import Annotated
from pymongo.errors import DuplicateKeyError
from models.user_model import User, UserUpdate, LoginRequest
from models.errors import ErrorCode, APIError
from db import get_db 
from auth import get_current_user

router = APIRouter(
    tags=["users"]
)

def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
    return user

@router.post("/login")
def login_user(data: LoginRequest, db: Database = Depends(get_db)):
    user = db["Infos"].find_one({"email": data.email})

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age"),
        }
    }

user_dependency = Annotated[dict,Depends(get_current_user)]

@router.get("/users")
async def get_users_by_name(name: str = None, db: Database = Depends(get_db)):
    try:
        query = {"name": name} if name else {}
        users = list(db["Infos"].find(query))
        return [serialize_user(user) for user in users]
    except Exception as e:
        print(f"Error in get_users_by_name: {str(e)}")  
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)

@router.post("/users")
async def create_user(user: User, db: Database = Depends(get_db)):
    try:
        user_dict = user.dict()

        if db["Infos"].find_one({"email": user.email}):
            raise APIError(ErrorCode.USER_ALREADY_EXISTS)
        
        result = db["Infos"].insert_one(user_dict)
        user_dict['_id'] = str(result.inserted_id)
        return user_dict
    except DuplicateKeyError:
        raise APIError(ErrorCode.DUPLICATE_KEY_ERROR)
    except Exception as e:
        print(f"Error in create_user: {str(e)}")  
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)

@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Database = Depends(get_db)):
    try:
        user = db["Infos"].find_one({"_id": ObjectId(user_id)})
        if user:
            return serialize_user(user)
        raise APIError(ErrorCode.USER_NOT_FOUND)
    except Exception as e:
        print(f"Error in get_user: {str(e)}")  
        raise APIError(
            ErrorCode.INVALID_USER_ID,
            detail=f"Invalid user ID format: {user_id}"
        )

@router.put("/users/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate, db: Database = Depends(get_db)):
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        if not update_data:
            raise APIError(ErrorCode.INVALID_INPUT, detail="No valid update data provided")

        result = db["Infos"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        
        updated_user = db["Infos"].find_one({"_id": ObjectId(user_id)})
        return serialize_user(updated_user)
    except Exception as e:
        print(f"Error in update_user: {str(e)}")  
        raise APIError(ErrorCode.INVALID_USER_ID, detail=f"Invalid user ID format: {user_id}")

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, db: Database = Depends(get_db)):
    try:
        result = db["Infos"].delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        return {"message": "User deleted successfully"}
    except Exception as e:
        print(f"Error in delete_user: {str(e)}")  
        raise APIError(ErrorCode.INVALID_USER_ID, detail=f"Invalid user ID format: {user_id}")


@router.get("/userssssssssssssssssssssss", response_model=dict)
def get_user(user: user_dependency):
    return {
        "name": user["name"],
        "email": user["email"],
        "age": user["age"]
    }
