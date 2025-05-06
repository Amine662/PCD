from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    age: int
    email: str
    password: str
    role: Optional[str] = "user"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role : Optional[str] = None 

class LoginRequest(BaseModel):
    email: str
    password: str
