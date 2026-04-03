from pydantic import BaseModel
from datetime import datetime

class DevScoreCreate (BaseModel):
    user_id:int
    score:float

# o que a nossa API vai devolver
class DevScoreResponse (BaseModel):
    id: int
    user_id: int
    score: float
    calculated_at: datetime

    class Config:
        from_attributes = True # usado para o Pydantic ler os dados do SQLAlchemy
