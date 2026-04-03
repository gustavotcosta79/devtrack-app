from pydantic import BaseModel
from datetime import datetime

class ActivityCreate (BaseModel):
    type: str
    repo_id: int
    user_id: int
    created_at: datetime

# o que a nossa API vai devolver
class ActivityResponse (BaseModel):
    id:int
    type:str
    repo_id: int
    user_id:int
    created_at:datetime

    class Config:
        from_attributes = True # usado para o Pydantic ler os dados do SQLAlchemy


