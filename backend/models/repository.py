from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# o que precisamos de receber para gravar um repositório
class RepositoryCreate(BaseModel):
    github_repo_id : int
    name: str
    language: Optional[str] = None #porque a linguagem pode ser nula
    stars_count: int = 0
    owner_id: int
    created_at: datetime
    complexity: Optional[str] = None

# o que a nossa API vai devolver quando alguém pedir os dados de um repositório
class RepositoryResponse (BaseModel):
    id:int
    github_repo_id : int
    name: str
    language: Optional[str] = None
    stars_count : int = 0
    owner_id : int
    created_at: datetime
    complexity: Optional[str] = None

    class Config:
        from_attributes = True # usado para o Pydantic ler os dados do SQLAlchemy

class RepositoryUpdate(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    stars_count: Optional[int] = None
    complexity: Optional[str] = None
