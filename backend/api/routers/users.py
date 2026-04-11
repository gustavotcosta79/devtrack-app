from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db
from models.activity import ActivityResponse
from models.devscore import DevScoreResponse
from models.repository import RepositoryResponse
from models.user import UserResponse, UserCreate, UserUpdate
from services import ai_service
from services.activity_service import ActivityService
from services.ai_service import AIService
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
        raise HTTPException(status_code=400, detail="User already registered.")
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
        raise HTTPException(status_code=404, detail="User not found.")
    return db_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user (user_id : int, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.get_by_user_id(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found.")
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
        raise HTTPException(status_code=404, detail="This user doesn't have any activity.")
    return db_activity

@router.get("/{user_id}/devscore", response_model=DevScoreResponse)
def get_devscore_by_user_id (user_id:int, db: Session = Depends(get_db)):
    service = DevscoreService(db)

    db_devscore = service.get_devscore_by_user_id(user_id)
    if db_devscore is None:
        raise HTTPException(status_code=404, detail="DevScore not found for this user.")
    return db_devscore


@router.get("/{user_id}/dashboard", response_model=DashboardResponse)
def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)

    dashboard_data = service.get_user_dashboard(user_id)
    if not dashboard_data:
        raise HTTPException(status_code=404, detail="User not found.")

    return dashboard_data

@router.put("/{user_id}",response_model=UserResponse)
def update_user (user_id:int, user_update: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.update(user_id,user_update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return db_user

@router.delete("/{user_id}")
def delete_user (user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)

    if service.delete(user_id):
        return {"message": "User deleted successfully!"}

    raise HTTPException(status_code=404, detail="User not found.")

@router.get("/{user_id}/recommendation")
def generate_recommendation (user_id:int, db: Session = Depends(get_db)):
    devscore_service = DevscoreService(db)
    repository_service = RepositoryService(db)
    service_ai = AIService ()

    devscore = devscore_service.get_devscore_by_user_id(user_id)
    user_devscore = devscore.score if devscore else 0.0
    user_repositories = repository_service.get_all_repository_by_owner(user_id)

    languages = []
    #complexities = {"Small": 0, "Medium": 0, "Large": 0} -> se metessemos o dicionário assim
    # em caso de empate entre, por exemplo, "small" e "medium" o python escolheria o que vem primeiro
    # no dicionário, ou seja, small. Como faria mais sentidos a AI considerar os casos mais complexos,
    # neste exemplo o "Medium" invertemos a ordem, para em caso de empate, passarmos sempre
    # a complexidade mais complexa.
    complexities = {"Large": 0, "Medium": 0, "Small": 0}


    for repo in user_repositories:
        # o segundo repo.language é só para garantir que a linguagem não é nula, caso haja um repo
        # só com um ficheiro .md por exemplo
        if repo.language and repo.language not in languages:
            languages.append(repo.language)

        if repo.complexity in complexities:
            complexities[repo.complexity] += 1

    most_common_complexity = max(complexities, key = complexities.get)

    languages_string = ", ".join(languages)

    recommendation_text = service_ai.generate_recommendation(user_devscore,languages_string,most_common_complexity)

    return recommendation_text