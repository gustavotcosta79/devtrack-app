from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.deps import get_db, get_current_user
from db.schema import User
from models.activity import ActivityResponse, ActivityCreate
from services.activity_service import ActivityService

router = APIRouter(prefix="/activities", tags=["repositories"])
@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity_by_user_id (activity_id:int, db: Session = Depends(get_db)):
    service = ActivityService(db)

    db_activity = service.get_activity_by_id(activity_id)
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return db_activity

@router.post("/", response_model=ActivityResponse)
def create_activity (activity : ActivityCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    if current_user.id != activity.user_id:
        raise HTTPException(status_code=403, detail="Permission refused.")

    service = ActivityService(db)

    db_activity = service.create(activity)
    return db_activity