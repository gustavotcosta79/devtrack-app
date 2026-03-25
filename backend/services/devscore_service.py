from sqlalchemy.orm import Session
from models.devscore import DevScoreCreate
from db.schema import DevScoreHistory,User
from services.activity_service import ActivityService
from services.repository_service import RepositoryService


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

    def calculate_devscore_for_user (self,user_id : int):
        repo_service = RepositoryService(self.db)
        activity_service = ActivityService(self.db)

        repos = repo_service.get_all_repository_by_owner(user_id)
        activities = activity_service.get_all_activity_by_user_id(user_id)

        score = 0.0

        # FATOR A: REPOSITÓRIOS (MÁX: 20 PONTOS)
        # SE A COMPLEXIDADE DO REPOSITORIO FOR ELEVADO O UTILIZADOR GANHA 5 PONTOS
        # SE FOR MÉDIA GANHA 3, E SE FOR PEQUENA GANHA 1
        # A COMPLEXIDADE DEPENDE DO TAMANHO DO REPOSITÓRIO
        # SMALL < 1000 KB; 1000<=MEDIUM<=10000, LARGE > 10000

        repo_points = 0

        for repo in repos:
            if repo.complexity == "Large":
                repo_points = repo_points + 5
            elif repo.complexity == "Medium":
                repo_points = repo_points + 3
            else:
                repo_points = repo_points + 1

        if repo_points >= 20:
            score = score + 20
        elif repo_points >= 0 and repo_points < 20:
            score = score + repo_points

        # FATOR B: ESTRELAS (MÁX: 50 PONTOS)
        # POR CADA ESTRELA QUE UM UTILIZADOR POSSUIR NUM REPOSITÓRIO
        # GANHA 10 PONTOS, SENDO QUE COM 5 ESTRELAS TEM A NOTA MÁXIMA

        total_stars = sum(repo.stars_count for repo in repos)
        star_points = total_stars * 10
        if star_points >= 50:
            score = score + 50
        elif star_points >=0 and star_points <50:
            score = score + star_points

        # FATOR C: ACTIVITY (MÁX: 30 PONTOS)
        # POR CADA ACTIVITY (COMMIT,PULL,PUSH), O UTILIZADOR GANHA 2 PONTOS
        # SENDO QUE COM 15 ACTIVITIES TEM A NOTA MÁXIMA

        activity_points = len(activities) * 2
        if activity_points >=30:
            score = score + 30
        elif activity_points >= 0 and activity_points < 30:
            score = score + activity_points

        novo_devscore = DevScoreCreate (
            user_id=user_id,
            score=score
        )

        return self.create(novo_devscore)