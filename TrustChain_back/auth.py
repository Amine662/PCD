from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from bson import ObjectId
from pymongo.database import Database
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db import get_db
from models.user_model import LoginRequest, User

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "7dc378f37ad225c2712728e4644350c56f53abe1330d790567e676e10f1d54d8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class UserOut(BaseModel):
    name: str
    age: int
    email: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class UpdateUserRequest(BaseModel):
    name: str
    email: str
    age: int
    password: str = None     

@router.post("/register")
def register(user: User, db: Database = Depends(get_db)):
    if db["Infos"].find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["password"] = bcrypt_context.hash(user.password)
    db["Infos"].insert_one(user_dict)
    return {"message": "User created successfully"}

def authenticate_user(email: str, password: str, db: Database):
    user = db["Infos"].find_one({"email": email})
    if not user or not bcrypt_context.verify(password, user["password"]):
        return None
    return user

def create_access_token(email: str, expires_delta: timedelta = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Database = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", 0),
        }
    }

@router.post("/login-json", response_model=LoginResponse)
def login_with_json(data: LoginRequest, db: Database = Depends(get_db)):
    user = authenticate_user(data.email, data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", 0),
        }
    }

def get_current_user(token: str = Depends(oauth2_scheme), db: Database = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub") 
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = db["Infos"].find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "user_id": str(user["_id"]),  # Add the user_id
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", 0),
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.put("/update/{user_id}")
def update_user(user_id: str, update_data: UpdateUserRequest, db: Database = Depends(get_db)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_dict = update_data.dict(exclude_unset=True)

    # Hash new password if provided
    if "password" in update_dict:
        update_dict["password"] = bcrypt_context.hash(update_dict["password"])

    result = db["Infos"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}
