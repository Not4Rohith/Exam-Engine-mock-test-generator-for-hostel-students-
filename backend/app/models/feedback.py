from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    feedback_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)