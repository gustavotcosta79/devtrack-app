from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session
from models.user import UserResponse, UserCreate
from db.schema import engine, Base, SessionLocal
from services.user_service import UserService

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.get("/")
async def root():
    return {"message": "DevTrack API online"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.post("/users/", response_model=UserResponse)
def register_user (user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)

    db_user = service.get_by_github_id(user.github_id)
    if db_user:
        raise HTTPException(status_code=400, detail="Este utilizador já está registado.")
    return service.create_user(user)

@app.get("/users/{github_id}", response_model= UserResponse)
def get_user (github_id : int, db: Session = Depends(get_db)):
    service = UserService(db)
    db_user = service.get_by_github_id(github_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado")
    return db_user