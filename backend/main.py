from fastapi import FastAPI
from api.routers import users, repositories, activities, devscore
from db.schema import engine, Base

Base.metadata.create_all(bind=engine)
app = FastAPI()

# Ligamos os routers à nossa App principal!
app.include_router(users.router)
app.include_router(repositories.router)
app.include_router(activities.router)
app.include_router(devscore.router)
@app.get("/")
async def root():
    return {"message": "DevTrack API online"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}




