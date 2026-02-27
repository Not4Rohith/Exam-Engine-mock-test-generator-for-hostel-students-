import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Get the URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backend/app/exam_engine.db")

# 2. Fix the prefix for Postgres
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Create the engine with "Self-Healing" capabilities
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # 🌟 THIS IS THE FIX:
    # pool_pre_ping: Tests the connection before every query to avoid the SSL crash
    # pool_recycle: Forces a new connection every 5 minutes before the cloud provider kills it
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=300,
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()