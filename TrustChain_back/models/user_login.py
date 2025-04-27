from pydantic import BaseModel

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