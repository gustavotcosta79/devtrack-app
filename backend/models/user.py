from pydantic import BaseModel,EmailStr
from typing import Optional


# o que recebemos quando alguém se regista
class UserCreate (BaseModel):
    github_id: int
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None

# o que a nossa API vai devolver quando alguém pedir os dados de um user
class UserResponse (BaseModel):
    id:int
    username: str
    dev_score: float
    avatar_url: Optional[str]

    class Config:
        from_attributes = True # usado para o Pydantic ler os dados do SQLAlchemy


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None