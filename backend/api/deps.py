from typing import Optional
from sqlalchemy.orm import Session
from db.schema import SessionLocal, User
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from core.config import config

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

reusable_oauth2 = HTTPBearer()

def get_current_user(db: Session = Depends(get_db),
                     token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token.credentials,config.jwt_secret_key,algorithms=['HS256'])

        user_id_str: str = payload.get('sub')
        if user_id_str is None:
            raise credentials_exception

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="O teu bilhete de sessão expirou. Faz login novamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    user: Optional[User] = db.query(User).filter(User.id == int(user_id_str)).first()

    if user is None:
        raise credentials_exception

    return user

