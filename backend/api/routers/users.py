from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db
from models.activity import ActivityResponse
from models.devscore import DevScoreResponse
from models.repository import RepositoryResponse
from models.user import UserResponse, UserCreate, UserUpdate
from services.activity_service import ActivityService
from services.devscore_service import DevscoreService
from services.repository_service import RepositoryService
from services.user_service import UserService
from models.dashboard import DashboardResponse
router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def register_user (user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.get_by_github_id(user.github_id)
    if db_user:
        raise HTTPException(status_code=400, detail="Este utilizador já está registado.")
    return service.create_user(user)

@router.post("/import/{github_username}", response_model=UserResponse)
def import_user_from_github (github_username: str,db: Session = Depends(get_db)):
    service = UserService(db)

    return service.sync_user_from_github(github_username)

@router.get("/github/{github_id}", response_model= UserResponse)
def get_user_by_github_id (github_id : int, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.get_by_github_id(github_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado")
    return db_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user (user_id : int, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.get_by_user_id(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado")
    return db_user

@router.get("/{user_id}/repositories", response_model=List[RepositoryResponse])
def get_all_user_repositories(user_id: int, db: Session = Depends(get_db)):
    service = RepositoryService(db)

    db_repository = service.get_all_repository_by_owner(user_id)
    return db_repository

@router.get("/{user_id}/activities", response_model=List[ActivityResponse])
def get_all_activity_by_user_id (user_id:int, db: Session = Depends(get_db)):
    service = ActivityService(db)

    db_activity = service.get_all_activity_by_user_id(user_id)
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return db_activity

@router.get("/{user_id}/devscore", response_model=DevScoreResponse)
def get_devscore_by_user_id (user_id:int, db: Session = Depends(get_db)):
    service = DevscoreService(db)

    db_devscore = service.get_devscore_by_user_id(user_id)
    if db_devscore is None:
        raise HTTPException(status_code=404, detail="Devscore não encontrado para este utilizador")
    return db_devscore


@router.get("/{user_id}/dashboard", response_model=DashboardResponse)
def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)

    dashboard_data = service.get_user_dashboard(user_id)
    if not dashboard_data:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado")

    return dashboard_data

@router.put("/{user_id}",response_model=UserResponse)
def update_user (user_id:int, user_update: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.update(user_id,user_update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado")
    return db_user

@router.delete("/{user_id}")
def delete_user (user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)

    if service.delete(user_id):
        return {"message": "Utilizador apagado com sucesso!"}

    raise HTTPException(status_code=404, detail="Utilizador não encontrado")