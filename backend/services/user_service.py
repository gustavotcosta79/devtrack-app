from collections import Counter
from fastapi import HTTPException
from sqlalchemy.orm import Session
from db.schema import User, DevScoreHistory
from models.activity import ActivityCreate
from models.repository import RepositoryCreate, RepositoryUpdate
from models.user import UserCreate, UserUpdate
from services.activity_service import ActivityService
from services.devscore_service import DevscoreService
from services.github_service import GitHubService
from services.repository_service import RepositoryService


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user (self, user: UserCreate):
        user = User (
            github_id= user.github_id,
            username=user.username,
            email=user.email,
            avatar_url=user.avatar_url
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_by_github_id (self, github_id: int):
        return self.db.query(User).filter(User.github_id == github_id).first()

    def get_by_user_id (self, user_id:int):
        return self.db.query(User).filter(User.id==user_id).first()

    def update(self, user_id: int, user_update : UserUpdate):

        db_user = self.get_by_user_id(user_id)

        if not db_user:
            return None

        if user_update.username is not None:
            db_user.username = user_update.username

        if user_update.email is not None:
            db_user.email = user_update.email

        if user_update.stars_count is not None:
            db_user.avatar_url= user_update.avatar_url

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete(self, user_id: int):
        if self.db.query(User).filter(User.id == user_id).delete():
            self.db.commit()
            return True
        else:
            return False

    def get_user_dashboard (self, user_id:int):
        repo_service = RepositoryService (self.db)
        activity_service = ActivityService(self.db)

        db_user = self.get_by_user_id(user_id)
        if not db_user:
            return None

        repos = repo_service.get_all_repository_by_owner(user_id)
        activities = activity_service.get_all_activity_by_user_id(user_id)

        # Para a evolução do score, vamos buscar o histórico todo0 ordenado por data
        score_history = self.db.query(DevScoreHistory).filter(DevScoreHistory.user_id == user_id).order_by(
            DevScoreHistory.calculated_at).all()

        # Filtramos só os "PushEvent" (que representam commits) e extraímos os primeiros 7 caracteres da data (Ano e Mês)
        commits = [str(act.created_at)[:7] for act in activities if act.type == "PushEvent"]
        commits_per_month = dict(Counter(commits))

        # Mapeamos a data (YYYY-MM-DD) para o score que ele teve nesse dia
        devscore_evolution = {str(h.calculated_at)[:10]: h.score for h in score_history}

        languages_evolution = {}
        for repo in repos:
            if repo.language:
                year = str(repo.created_at)[:4] # Para extrair o ano

                if year not in languages_evolution:
                    languages_evolution[year] = {}

                if repo.language in languages_evolution[year]:
                    languages_evolution[year][repo.language] += 1
                else:
                    languages_evolution[year][repo.language] = 1

        projects_by_years = [str(repo.created_at)[:4] for repo in repos]
        projects_over_time = dict(Counter(projects_by_years))

        current_score = db_user.dev_score

        return {
            "user_info" : {
                "id" : db_user.id,
                "username": db_user.username,
                "avatar_url": db_user.avatar_url
            },
            "total_repos": len(repos),
            "total_stars": sum(repo.stars_count for repo in repos),
            "current_devscore": current_score,
            "commits_per_month": commits_per_month,
            "devscore_evolution": devscore_evolution,
            "languages_evolution": languages_evolution,
            "projects_over_time": projects_over_time
        }

    def sync_user_from_github (self, github_username:str):
        github_service = GitHubService()
        repo_service = RepositoryService(self.db)
        activity_service = ActivityService(self.db)

        github_data = github_service.get_user_profile(github_username)

        if not github_data:
            raise HTTPException(status_code=404, detail="Username does not exist on GitHub!")

        existing_user = self.get_by_github_id(github_data['id'])
        if existing_user:
            db_user = existing_user
        else:
            github_email = github_data.get("email")
            if not github_email:
                github_email = f"{github_data['login']}@users.noreply.github.com"

            new_user = UserCreate(
                github_id=github_data['id'],
                username=github_data['login'],
                email=github_email,
                avatar_url=github_data.get("avatar_url")
            )

            db_user = self.create_user(new_user)

        # Sincronizar repositórios
        repos_data = github_service.get_user_repos(github_username)

        for repo in repos_data:
            existing_repo = repo_service.get_by_github_repo_id(repo["id"])

            repo_size = repo.get("size", 0)
            repo_complexity = repo_service.calculate_complexity(repo_size)

            if existing_repo:
                repo_update = RepositoryUpdate(
                    name=repo["name"],
                    language=repo.get("language"),
                    stars_count=repo.get("stargazers_count", 0),
                    complexity=repo_complexity
                )
                repo_service.update(existing_repo.id, repo_update)
            else:
                new_repo = RepositoryCreate(
                    github_repo_id=repo["id"],
                    name=repo["name"],
                    language=repo.get("language"),  # porque a linguagem pode ser nula
                    stars_count=repo.get("stargazers_count"),
                    owner_id=db_user.id,
                    created_at=repo["created_at"],
                    complexity=repo_complexity

                )
                repo_service.create(new_repo)

        # SINCRONIZAR ACTIVITIES

        activities_data = github_service.get_user_activities(github_username)

        for event in activities_data:
            github_repo_id = event["repo"]["id"]

            existing_repo = repo_service.get_by_github_repo_id(github_repo_id)
            if existing_repo:
                new_activity = ActivityCreate(
                    type=event["type"],
                    repo_id=existing_repo.id,
                    user_id=db_user.id,
                    created_at=event["created_at"]
                )
                activity_service.create(new_activity)

        # CALCULAR O DEVSCORE
        devscore_service = DevscoreService(self.db)
        devscore_service.calculate_devscore_for_user(db_user.id)

        self.db.refresh(db_user)

        return db_user



