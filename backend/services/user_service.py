from sqlalchemy.orm import Session
from db.schema import User
from models.user import UserCreate


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

