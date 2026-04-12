import httpx
import jwt
from sqlalchemy.orm import Session
from core.config import config
from services.user_service import UserService

class AuthService :
    def __init__(self, db: Session):
        self.db = db

    def process_github_login(self, code: str) -> str:
        response = httpx.post("https://github.com/login/oauth/access_token", headers={"Accept": "application/json"},
                              data={
                                  "client_id": config.github_client_id,
                                  "client_secret": config.github_client_secret,
                                  "code": code
                              })

        data = response.json()
        access_token = data['access_token']

        response = httpx.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})

        if response.status_code == 404:
            return None

        response.raise_for_status()

        github_user = response.json()

        user_service = UserService(self.db)
        user = user_service.get_by_github_id(github_user["id"])

        if not user:
            user = user_service.sync_user_from_github(github_user["login"])

        token_jwt = jwt.encode(
            {"sub": str(user.id)},  # "sub" significa "subject" (o sujeito deste token)
            config.jwt_secret_key,
            algorithm="HS256"
        )

        return token_jwt