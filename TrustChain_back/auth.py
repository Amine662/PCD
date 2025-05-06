from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from bson import ObjectId
from pymongo.database import Database
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
import os
from dotenv import load_dotenv
from db import get_db
from models.user_model import LoginRequest, User  
from models.auth_model import LoginResponse, UpdateUserRequest 


load_dotenv()
router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def serialize_user(user):
    if user:
        user['_id'] = str(user['_id'])
    return user

def hash_password(password: str):
    return bcrypt_context.hash(password)

def authenticate_user(email: str, password: str, db: Database):
    user = db["Infos"].find_one({"email": email})
    if not user or not bcrypt_context.verify(password, user["password"]):
        return None
    return user

def create_access_token(email: str, expires_delta: timedelta = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user: User, db: Database = Depends(get_db)):
    if db["Infos"].find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    db["Infos"].insert_one(user_dict)
    return {"message": "User created successfully"}

@router.post("/register-seller")
def register_seller(user: User, db: Database = Depends(get_db)):
    if db["Infos"].find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["role"] = "seller"
    user_dict["password"] = hash_password(user.password)
    db["Infos"].insert_one(user_dict)
    return {"message": "Seller account created successfully"}

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
            "name": user.get("name"),
            "email": user.get("email"),
            "age": user.get("age", 0),
            "role": user.get("role", "user"),
            "user_id": str(user["_id"]),
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
            "name": user.get("name"),
            "email": user.get("email"),
            "age": user.get("age", 0),
            "role": user.get("role", "user"),
            "user_id": str(user["_id"]),
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
            "user_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", 0),
            "role": user.get("role", "user")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def get_current_admin(db: Database = Depends(get_db)):
    admin_user = db["Infos"].find_one({"role": "admin"})
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    return {
        "user_id": str(admin_user["_id"]),
        "name": admin_user["name"],
        "email": admin_user["email"],
        "age": admin_user.get("age", 0),
        "role": admin_user.get("role", "admin")
    }

@router.put("/update/{user_id}")
def update_user(user_id: str, update_data: UpdateUserRequest, db: Database = Depends(get_db)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    update_dict = update_data.dict(exclude_unset=True)
    if update_dict.get("password"):
        update_dict["password"] = hash_password(update_dict["password"])
    result = db["Infos"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully"}

class AdminLogin(BaseModel):
    email: str
    password: str

@router.post("/login-admin")
def login_admin(credentials: AdminLogin, db: Database = Depends(get_db)):
    admin = db["Infos"].find_one({"email": credentials.email, "role": "admin"})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    if not bcrypt_context.verify(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")
    token = create_access_token(admin["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": admin["name"],
            "email": admin["email"],
            "role": admin["role"],
            "user_id": str(admin["_id"]),
        }
    }
user_dependency = Annotated[dict, Depends(get_current_user)]
admin_dependency = Annotated[dict, Depends(get_current_admin)]

@router.get("/me", status_code=status.HTTP_200_OK)
def get_current_user_info(user: user_dependency):
    return {"user": user}

@router.get("/admin", status_code=status.HTTP_200_OK)
def get_current_admin_info(user: admin_dependency):
    return {"user": user}
