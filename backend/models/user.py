from pydantic import BaseModel,EmailStr
from typing import Optional


# o que recebemos quando alguém se regista
class UserCreate (BaseModel):
    github_id: int
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None

# o que enviamos de volta para o frontend (protegendo os dados sensíveis
class UserResponse (BaseModel):
    id:int
    username: str
    dev_score: float
    avatar_url: Optional[str]

    class Config:
        from_attributes = True