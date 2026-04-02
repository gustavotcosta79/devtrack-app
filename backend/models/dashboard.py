from pydantic import BaseModel
from typing import Dict,Any

# o que a nossa API vai devolver
class DashboardResponse (BaseModel):
    user_info : Dict[str,Any]

    total_repos:int
    total_stars:int
    current_devscore:float

    commits_per_month : Dict[str,int] # Ex: {"2023-10": 15, "2023-11": 42}
    devscore_evolution :Dict[str,float] # Ex: {"2023-10-25": 85.0, "2023-10-26": 92.5}
    languages_evolution : Dict[str,Dict[str,int]] # Ex: {"2023": {"Python": 2}, "2024": {"Python": 5, "C": 1}}
    projects_over_time : Dict[str,int]

