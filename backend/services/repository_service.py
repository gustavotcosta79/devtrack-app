from sqlalchemy.orm import Session
from db.schema import Repository
from models.repository import RepositoryCreate, RepositoryUpdate


class RepositoryService:
    def __init__(self, db:Session):
        self.db = db

    def get_by_github_repo_id (self, github_repo_id : int):
        return self.db.query(Repository).filter(Repository.github_repo_id == github_repo_id).first()

    def get_all_repository_by_owner (self, owner_id :int):
        return self.db.query(Repository).filter(Repository.owner_id == owner_id).all()

    def create (self,repo: RepositoryCreate):
        db_repo = Repository (
            github_repo_id=repo.github_repo_id,
            name=repo.name,
            language=repo.language,
            stars_count=repo.stars_count,
            owner_id=repo.owner_id,
            created_at=repo.created_at,
            complexity=repo.complexity
        )

        self.db.add(db_repo)
        self.db.commit()
        self.db.refresh(db_repo)
        return db_repo

    def get_repository_by_id (self, repo_id:int):
        return self.db.query(Repository).filter(Repository.id == repo_id).first()

    def update (self,repo_id: int, repo_update: RepositoryUpdate):

        db_repo = self.get_repository_by_id(repo_id)

        if not db_repo:
            return None

        if repo_update.name is not None:
            db_repo.name = repo_update.name

        if repo_update.language is not None:
            db_repo.language = repo_update.language

        if repo_update.stars_count is not None:
            db_repo.stars_count = repo_update.stars_count

        if repo_update.complexity is not None:
            db_repo.complexity = repo_update.complexity

        self.db.commit()
        self.db.refresh(db_repo)
        return db_repo

    def delete(self, repo_id: int):
        repo = self.get_repository_by_id(repo_id)

        if repo:
            self.db.delete(repo)
            self.db.commit()
            return True

        return False

    def calculate_complexity(self,size_kb:int) -> str:

        if size_kb < 1000:
            return "Small"
        elif size_kb <= 10000:
            return "Medium"
        else:
            return "Large"
