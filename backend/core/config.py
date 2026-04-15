from pydantic_settings import BaseSettings,SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Config (BaseSettings):
    app_name:str = "DevTrack API"
    database_url : str
    github_token: str
    groq_api_key: str
    github_client_id: str
    github_client_secret: str
    jwt_secret_key: str

    model_config = SettingsConfigDict(env_file=".env",extra='ignore')

config = Config()