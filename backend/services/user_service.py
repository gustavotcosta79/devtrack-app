from sqlalchemy.orm import Session
from db.schema import User
from models.user import UserCreate, UserUpdate


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
