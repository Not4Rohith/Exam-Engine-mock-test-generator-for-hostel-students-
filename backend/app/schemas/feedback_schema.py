from pydantic import BaseModel
from datetime import datetime

class FeedbackCreate(BaseModel):
    name: str
    feedback: str # Matches the 'feedback' key sent from React

class FeedbackResponse(FeedbackCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True