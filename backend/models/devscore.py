from pydantic import BaseModel
from datetime import datetime

class DevScoreCreate (BaseModel):
    user_id:int
    score:float

class DevScoreResponse (BaseModel):
    id: int
    user_id: int
    score: float
    calculated_at: datetime

    class Config:
        from_attributes = True