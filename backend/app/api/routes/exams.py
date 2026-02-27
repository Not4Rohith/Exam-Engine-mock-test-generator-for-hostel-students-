from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.question import Question

router = APIRouter()

@router.get("/metadata")
def get_exam_metadata(db: Session = Depends(get_db)):
    """Fetches dynamic subjects, topics, and years directly from the database."""
    
    # 1. Get unique subjects
    subjects = [s[0] for s in db.query(Question.subject).distinct().all() if s[0]]
    
    # 2. Get topics organized by subject
    topics_by_subject = {}
    for sub in subjects:
        topics = [t[0] for t in db.query(Question.topic).filter(Question.subject == sub).distinct().all() if t[0]]
        topics_by_subject[sub] = topics
        
    # 3. Get unique years
    years = [str(y[0]) for y in db.query(Question.year).distinct().order_by(Question.year.desc()).all() if y[0]]

    return {
        "subjects": subjects,
        "topics": topics_by_subject,
        "years": years
    }