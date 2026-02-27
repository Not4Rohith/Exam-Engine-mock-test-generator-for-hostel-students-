from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# The database file will be created in your root folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/app/db/exam_engine.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    # We import the models here so SQLAlchemy knows what tables to build
    from backend.app.models import question, report, feedback
    Base.metadata.create_all(bind=engine)
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()