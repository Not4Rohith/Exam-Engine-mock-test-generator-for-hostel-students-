import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Looks for the cloud URL first. If not found, safely falls back to local SQLite.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backend/app/exam_engine.db")

# Ensures the URL starts with the correct SQLAlchemy prefix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs a special thread flag, Postgres doesn't
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()