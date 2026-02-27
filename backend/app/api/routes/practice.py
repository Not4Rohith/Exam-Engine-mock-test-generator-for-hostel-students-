from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import random

from backend.app.core.database import get_db
from backend.app.models.question import Question 
from backend.app.services.practice_engine import generate_practice_paper
from backend.app.schemas.generate import PracticeRequest

router = APIRouter()

@router.post("/generate")
def create_practice_test(request: PracticeRequest, db: Session = Depends(get_db)):
    # 1. Build the base filter (Subject, Topics, Years)
    base_query = db.query(Question).filter(
        Question.subject == request.subject,
        Question.topic.in_(request.topics),
        # Convert years to integers if your DB stores them as ints
        Question.year.in_([int(y) for y in request.years]) 
    )

    # 2. Helper function to fetch random questions by difficulty
    def get_qs(difficulty_level: str, limit: int):
        if limit <= 0:
            return []
        return base_query.filter(
            Question.difficulty.ilike(difficulty_level)
        ).order_by(func.random()).limit(limit).all()

    # 3. Fetch the exact counts requested
    easy_qs = get_qs("Easy", request.difficulty.easy)
    mod_qs = get_qs("Moderate", request.difficulty.moderate)
    hard_qs = get_qs("Hard", request.difficulty.hard)

    # 4. Combine and shuffle so they aren't ordered strictly by difficulty
    final_questions = easy_qs + mod_qs + hard_qs
    random.shuffle(final_questions)

    return {"questions": [q.__dict__ for q in final_questions]}


@router.get("/metadata")
def get_form_metadata(db: Session = Depends(get_db)):
    # 1. Get all unique subjects
    subjects = [s[0] for s in db.query(Question.subject).distinct().all() if s[0]]
    
    # 2. Get all unique years
    years = [str(y[0]) for y in db.query(Question.year).distinct().all() if y[0]]
    years.sort(reverse=True) # Sort newest to oldest

    puc_levels = [str(p[0]) for p in db.query(Question.puc_level).distinct().all() if p[0]]
    
    # 3. Group topics by subject
    topics_by_subject = {}
    for sub in subjects:
        # Query both columns
        topic_data = db.query(Question.topic, Question.puc_level).filter(Question.subject == sub).distinct().all()
        
        # Package them as a list of dictionaries: [{"name": "Kinematics", "level": "11th"}, ...]
        topics = [{"name": t[0], "level": str(t[1]) if t[1] else "N/A"} for t in topic_data if t[0]]
        topics_by_subject[sub] = topics
        
    return {
        "subjects": subjects,
        "years": years,
        "topics": topics_by_subject,
        "pucLevels": puc_levels # <-- Add this
    }