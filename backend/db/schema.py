from sqlalchemy import create_engine, String, Float, DateTime, func, ForeignKey
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped,mapped_column
from datetime import datetime

from backend.core.config import config

engine = create_engine(config.database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine )

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    github_id: Mapped[int] = mapped_column(unique=True, index=True)
    username: Mapped[str] = mapped_column(String,unique=True,index=True)
    email: Mapped[str] = mapped_column(String,unique=True,nullable=False)
    avatar_url: Mapped[str] = mapped_column(String,nullable=True)

    dev_score: Mapped[float] = mapped_column(Float,default=0.0)
    last_sync: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Repository (Base):
    __tablename__ = "repositories"
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    github_repo_id: Mapped[int] = mapped_column(unique=True,index=True)
    name: Mapped[str] = mapped_column(String,nullable= False)
    language: Mapped[str] = mapped_column(String,nullable= True)
    stars_count: Mapped[int] = mapped_column(default=0,index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

class GitHubActivity (Base):
    __tablename__ = "github_activity"
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    type: Mapped[str] = mapped_column(String,nullable=False)
    repo_id: Mapped[int] = mapped_column(ForeignKey("repositories.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

class DevScoreHistory (Base):
    __tablename__ = "devscore_history"
    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    score: Mapped[float] = mapped_column(Float,index=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


