from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.feedback import Feedback
from backend.app.schemas.feedback_schema import FeedbackCreate

router = APIRouter()

@router.post("/")
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    try:
        # We map data.feedback from React to feedback_text in your DB
        new_feedback = Feedback(name=data.name, feedback_text=data.feedback)
        db.add(new_feedback)
        db.commit()
        return {"status": "success", "message": "Feedback received"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))