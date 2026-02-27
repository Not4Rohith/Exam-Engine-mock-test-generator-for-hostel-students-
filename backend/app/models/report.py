from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)