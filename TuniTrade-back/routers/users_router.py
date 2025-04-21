from fastapi import APIRouter
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import PyMongoError, DuplicateKeyError
from models.user_model import User, UserUpdate
from models.errors import ErrorCode, APIError

router = APIRouter(
    tags=["users"]
)

# MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['Users']
    collection = db['Infos']
except PyMongoError:
    raise APIError(ErrorCode.DATABASE_CONNECTION_ERROR)

def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
    return user

@router.get("/users")
async def get_users_by_name(name: str = None):
    try:
        if name:
            users = list(collection.find({"name": name}))
        else:
            users = list(collection.find())
        return [serialize_user(user) for user in users]
    except Exception as e:
        print(f"Error in get_users_by_name: {str(e)}")  
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)

@router.post("/users")
async def create_user(user: User):
    try:
        user_dict = user.dict()

        if collection.find_one({"email": user.email}):
            raise APIError(ErrorCode.USER_ALREADY_EXISTS)
        
        result = collection.insert_one(user_dict)
        user_dict['_id'] = str(result.inserted_id)
        return user_dict
    except DuplicateKeyError:
        raise APIError(ErrorCode.DUPLICATE_KEY_ERROR)
    except Exception as e:
        print(f"Error in create_user: {str(e)}")  
        raise APIError(ErrorCode.DATABASE_QUERY_ERROR)

@router.get("/users/{user_id}")
async def get_user(user_id: str):
    try:
        user = collection.find_one({"_id": ObjectId(user_id)})
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
async def update_user(user_id: str, user_update: UserUpdate):
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        if not update_data:
            raise APIError(
                ErrorCode.INVALID_INPUT,
                detail="No valid update data provided"
            )
        
        result = collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        
        updated_user = collection.find_one({"_id": ObjectId(user_id)})
        return serialize_user(updated_user)
    except Exception as e:
        if isinstance(e, APIError):
            raise e
        print(f"Error in update_user: {str(e)}")  
        raise APIError(
            ErrorCode.INVALID_USER_ID,
            detail=f"Invalid user ID format: {user_id}"
        )

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise APIError(ErrorCode.USER_NOT_FOUND)
        return {"message": "User deleted successfully"}
    except Exception as e:
        if isinstance(e, APIError):
            raise e
        print(f"Error in delete_user: {str(e)}")  
        raise APIError(
            ErrorCode.INVALID_USER_ID,
            detail=f"Invalid user ID format: {user_id}"
        )