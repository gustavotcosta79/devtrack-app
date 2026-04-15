from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db, get_current_user
from db.schema import User
from models.devscore import DevScoreResponse, DevScoreCreate
from services.devscore_service import DevscoreService

router = APIRouter(prefix="/devscore", tags=["repositories"])
@router.get("/{devscore_id}", response_model=DevScoreResponse)
def get_activity_by_devscore_id (devscore_id:int, db: Session = Depends(get_db)):
    service = DevscoreService(db)

    db_devscore = service.get_devscore_by_id(devscore_id)
    if db_devscore is None:
        raise HTTPException(status_code=404, detail="Devscore não encontrado")
    return db_devscore

@router.post("/", response_model=DevScoreResponse)
def create_devscore (devscore : DevScoreCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    if current_user.id != devscore.user_id:
        raise HTTPException(status_code=403, detail="Permission refused.")

    service = DevscoreService(db)

    db_devscore = service.create(devscore)
    return db_devscore
