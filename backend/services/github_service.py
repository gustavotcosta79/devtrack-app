import httpx
from core.config import config

class GitHubService:
    def __init__(self):
        self.base_url = ("https://api.github.com")
        self.headers = {
            "Accept" : "application/vnd.github.v3+json",
            "Authorization": f"Bearer {config.github_token}"
        }

    def get_user_profile (self, github_username:str):
        #Exemplo: https://api.github.com/users/gustavocosta-dev
        url = f"{self.base_url}/users/{github_username}"

        # Fazemos o pedido GET à API do GitHub
        response = httpx.get(url,headers=self.headers)

        if response.status_code == 404:
            return None

        response.raise_for_status()

        # Devolvemos o JSON gigante que o GitHub nos dá!
        return response.json()

    def get_user_repos (self,username:str):
        url = f"{self.base_url}/users/{username}/repos?per_page=100"

        response = httpx.get(url,headers=self.headers)

        if response.status_code == 404:
            return None

        response.raise_for_status()

        return response.json()

    def get_user_activities (self, username:str):
        url = f"{self.base_url}/users/{username}/events/public?per_page=100"

        response = httpx.get(url,headers=self.headers)

        if response.status_code== 404:
            return []
        response.raise_for_status()
        return response.json()

