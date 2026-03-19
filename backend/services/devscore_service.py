from sqlalchemy.orm import Session
from db.schema import DevScoreHistory,User
from models.devscore import DevScoreCreate


class DevscoreService:
    def __init__(self, db: Session):
        self.db = db

    def get_devscore_by_user_id (self,user_id:int):
        return self.db.query(DevScoreHistory).filter(DevScoreHistory.user_id == user_id).first()

    def get_devscore_by_id(self, id: int):
        return self.db.query(DevScoreHistory).filter(DevScoreHistory.id == id).first()

    def create (self, devscore : DevScoreCreate):

        db_devscore = DevScoreHistory (
            user_id=devscore.user_id,
            score=devscore.score
        )
        self.db.add(db_devscore)

        user = self.db.query(User).filter(User.id == devscore.user_id).first()

        if user:
            user.dev_score = devscore.score

        self.db.commit()
        self.db.refresh(db_devscore)

        return db_devscore

    def delete (self, devscore_id:int):
        if self.db.query(DevScoreHistory).filter(DevScoreHistory.id == devscore_id).delete():
            self.db.commit()
            return True

        return False