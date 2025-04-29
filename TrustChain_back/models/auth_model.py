from pydantic import BaseModel
from typing import Optional

class UserOut(BaseModel):
    name: str
    age: int
    email: str
    role: str = "user"
    user_id: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    password: Optional[str] = None
