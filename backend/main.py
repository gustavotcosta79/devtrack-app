import os

from fastapi import FastAPI
from api.routers import users, repositories, activities, devscore, auth
from db.schema import engine, Base
from fastapi.middleware.cors import CORSMiddleware # 1. Importa o CORS

Base.metadata.create_all(bind=engine)
app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

# 2. Configura as "Portas Abertas" para o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
        frontend_url], # Permite o teu Frontend Vite!
    allow_credentials=True,
    allow_methods=["*"], # Permite POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

# Ligamos os routers à nossa App principal!
app.include_router(users.router)
app.include_router(repositories.router)
app.include_router(activities.router)
app.include_router(devscore.router)
app.include_router(auth.router)
@app.get("/")
async def root():
    return {"message": "DevTrack API online"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}




