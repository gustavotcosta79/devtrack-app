from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db
from models.activity import ActivityResponse, ActivityCreate
from models.devscore import DevScoreResponse
from models.repository import RepositoryResponse, RepositoryUpdate, RepositoryCreate
from models.user import UserResponse, UserCreate, UserUpdate
from services.activity_service import ActivityService
from services.devscore_service import DevscoreService
from services.repository_service import RepositoryService
from services.user_service import UserService
from services.github_service import GitHubService

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
    github_service = GitHubService()
    user_service = UserService(db)
    repo_service = RepositoryService(db)
    activity_service = ActivityService (db)

    github_data = github_service.get_user_profile(github_username)

    if not github_data:
        raise HTTPException(status_code=404, detail="Este username não existe no GitHub!")

    existing_user = user_service.get_by_github_id(github_data['id'])
    if existing_user:
        raise HTTPException(status_code=400, detail="Este utilizador já está registado no DevTrack.")
    
    github_email = github_data.get("email")
    if not github_email:
        github_email = f"{github_data['login']}@users.noreply.github.com"

    new_user = UserCreate (
        github_id=github_data['id'],
        username=github_data['login'],
        email=github_email,
        avatar_url=github_data.get("avatar_url")
    )

    db_user = user_service.create_user(new_user)

    # Sincronizar repositórios
    repos_data = github_service.get_user_repos(github_username)

    for repo in repos_data:
        existing_repo = repo_service.get_by_github_repo_id(repo["id"])

        if existing_repo:
            repo_update = RepositoryUpdate (
                name=repo["name"],
                language=repo.get("language"),
                stars_count=repo.get("stargazers_count", 0)
            )
            repo_service.update(existing_repo.id,repo_update)
        else:
            new_repo = RepositoryCreate(
                github_repo_id = repo["id"],
                name = repo["name"],
                language =  repo.get("language"),  # porque a linguagem pode ser nula
                stars_count = repo.get ("stargazers_count"),
                owner_id = db_user.id,
                created_at = repo["created_at"]
            )
            repo_service.create(new_repo)

    #SINCRONIZAR ACTIVITIES

    activities_data = github_service.get_user_activities(github_username)

    for event in activities_data:
        github_repo_id = event["repo"]["id"]

        existing_repo = repo_service.get_by_github_repo_id(github_repo_id)
        if existing_repo:
            new_activity = ActivityCreate (
                type=event["type"],
                repo_id=existing_repo.id,
                user_id=db_user.id,
                created_at=event["created_at"]
            )
            activity_service.create(new_activity)

    return db_user

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