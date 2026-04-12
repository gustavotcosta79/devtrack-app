import httpx
from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from starlette.responses import RedirectResponse
from api.deps import get_db
from core.config import config
from services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["users"])

@router.get("/github/login")
def github_login ():
    return RedirectResponse (url=f"https://github.com/login/oauth/authorize?client_id={config.github_client_id}")

@router.get("/github/callback")
def github_callback (code:str, db: Session =  Depends(get_db)):

    auth_service = AuthService(db)

    token_jwt = auth_service.process_github_login(code)

    return RedirectResponse(url=f"http://localhost:5173/dashboard?token={token_jwt}")
