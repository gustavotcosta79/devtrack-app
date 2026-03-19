from sqlalchemy.orm import Session
from db.schema import GitHubActivity
from models.activity import ActivityCreate

class ActivityService:
    def __init__(self, db:Session):
        self.db = db

    def get_activity_by_id (self, activity_id: int):
        return self.db.query(GitHubActivity).filter(GitHubActivity.id == activity_id).first()

    def get_all_activity_by_repo_id (self, repo_id:int):
        return self.db.query(GitHubActivity).filter(GitHubActivity.repo_id == repo_id).all()

    def get_all_activity_by_user_id (self, user_id:int):
        return self.db.query(GitHubActivity).filter(GitHubActivity.user_id == user_id).all()

    def create (self, activity: ActivityCreate):
        db_activity = GitHubActivity(
            type=activity.type,
            repo_id=activity.repo_id,
            user_id=activity.user_id,
            created_at=activity.created_at
        )

        self.db.add(db_activity)
        self.db.commit()
        self.db.refresh(db_activity)
        return db_activity

    def delete (self, activity_id: int):

        if self.db.query(GitHubActivity).filter(GitHubActivity.id == activity_id).delete():
            self.db.commit()
            return True

        return False

