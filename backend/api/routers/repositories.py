from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db, get_current_user
from db.schema import User
from models.activity import ActivityResponse
from models.repository import RepositoryResponse, RepositoryCreate,RepositoryUpdate
from services.activity_service import ActivityService
from services.repository_service import RepositoryService

router = APIRouter(prefix="/repositories", tags=["repositories"])


@router.post("/", response_model=RepositoryResponse)
def create_repository (repo : RepositoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    if current_user.id != repo.owner_id:
        raise HTTPException(status_code=403, detail="Permission refused.")

    service = RepositoryService(db)

    db_repository = service.get_by_github_repo_id(repo.github_repo_id)
    if db_repository:
        raise HTTPException(status_code=400, detail="This repository is already registered.")
    return service.create(repo)

@router.get ("/{repo_id}", response_model=RepositoryResponse)
def get_repository_by_repo_id (repo_id: int, db: Session = Depends(get_db)):
    service = RepositoryService(db)

    db_repo = service.get_repository_by_id(repo_id)

    if db_repo is None:
        raise HTTPException(status_code=404, detail="Repository not found.")
    return db_repo


@router.get("/github/{github_id}", response_model=RepositoryResponse)
def get_repository_by_github_id(github_id: int, db: Session = Depends(get_db)):
    service = RepositoryService(db)

    db_repo = service.get_by_github_repo_id(github_id)

    if db_repo is None:
        raise HTTPException(status_code=404, detail="Repository not found.")
    return db_repo


@router.get("/{repo_id}/activities", response_model=List[ActivityResponse])
def get_activity_by_repo_id (repo_id:int, db: Session = Depends(get_db)):
    service = ActivityService(db)

    db_activity = service.get_all_activity_by_repo_id(repo_id)
    if db_activity is None:
        raise HTTPException(status_code=404, detail="There isn't any activity on this repository.")
    return db_activity


@router.delete("/{repo_id}")
def delete_repository (repo_id : int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    service = RepositoryService(db)

    repo = service.get_repository_by_id(repo_id)

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found.")

    if current_user.id != repo.owner_id:
        raise HTTPException(status_code=403, detail="Permission refused.")

    if service.delete(repo_id):
        return {"message": "Repositório apagado com sucesso!"}
    else:
        raise HTTPException(status_code=404, detail="Repository not found.")

@router.put("/{repo_id}", response_model=RepositoryResponse)
def update_repository (repo_id : int, repo_update : RepositoryUpdate,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    service = RepositoryService(db)

    repo = service.get_repository_by_id(repo_id)

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found.")

    if current_user.id != repo.owner_id:
        raise HTTPException(status_code=403, detail="Permission refused.")


    db_repo = service.update(repo_id,repo_update)

    if db_repo is None:
        raise HTTPException(status_code=404, detail="Repository not found.")
    return db_repo