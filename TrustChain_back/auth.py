from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database
from pydantic import BaseModel
from starlette import status
from models.user_model import User
from passlib.context import CryptContext
from jose import jwt, JWTError
from db import get_db

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# JWT Config
SECRET_KEY = "5957c70cba5e9973392b9412a3c3c7ed8614567be9b663040cce77262814f694"
ALGORITHM = "HS256"

# Password hashing
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Request models
class CreateUserRequest(BaseModel):
    name: str
    age: int
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Response models
class UserOut(BaseModel):
    name: str
    age: int
    email: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Create user route
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: CreateUserRequest, db: Database = Depends(get_db)):
    existing_user = db["Infos"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    hashed_password = bcrypt_context.hash(user.password)
    new_user = User(name=user.name, age=user.age, email=user.email, password=hashed_password)

    try:
        db["Infos"].insert_one(new_user.dict())
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user")

    return {"message": "User created successfully"}

# Login and return token + user
@router.post("/login", response_model=LoginResponse)
def login_for_access_token(
    login_data: LoginRequest,
    db: Database = Depends(get_db)
):
    user = authenticate_user(login_data.email, login_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(user["email"], user["name"])

    user_out = {
        "name": user["name"],
        "age": user["age"],
        "email": user["email"]
    }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_out
    }

# Helper: User authentication
def authenticate_user(email: str, password: str, db: Database):
    user = db["Infos"].find_one({"email": email})
    if not user or not bcrypt_context.verify(password, user["password"]):
        return False
    return user

# Helper: JWT creation
def create_access_token(email: str, name: str, expires_delta: timedelta = None):
    to_encode = {"sub": email, "name": name}
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency: Get current user
def get_current_user(
    token: str,
    db: Database = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db["Infos"].find_one({"email": email})
    if user is None:
        raise credentials_exception

    return user
