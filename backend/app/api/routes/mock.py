from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.generate import MockRequest
from backend.app.services.mock_engine import generate_mock_paper
from backend.app.models.question import Question
import random
from sqlalchemy.sql.expression import func

router = APIRouter()

@router.post("/generate")
def generate_mock_test(request: MockRequest, db: Session = Depends(get_db)):
    # 1. Base filter for Mock (Only Subject, ignore topics)

    DELETED_TOPICS = [

]

    base_query = db.query(Question).filter(Question.subject == request.subject)

    if not request.includeDeleted:
        base_query = base_query.filter(~Question.topic.in_(DELETED_TOPICS)) #~ = NOT IN
    
    # Optional: If you want to filter by years when they aren't "Mixed"
    # if "Mixed" not in request.years[0]:
    #     base_query = base_query.filter(Question.year.in_([int(y) for y in request.years]))

    # 2. Helper function to fetch random questions
    def get_qs(difficulty_level: str, limit: int):
        if limit <= 0:
            return []
        return base_query.filter(
            Question.difficulty.ilike(difficulty_level)
        ).order_by(func.random()).limit(limit).all()

    # 3. Fetch the exact KCET counts (e.g., 25 Easy, 25 Mod, 10 Hard)
    easy_qs = get_qs("Easy", request.difficulty.easy)
    mod_qs = get_qs("Moderate", request.difficulty.moderate)
    hard_qs = get_qs("Hard", request.difficulty.hard)

    # 4. Combine and shuffle
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
    
    # 3. Group topics by subject
    # topics_by_subject = {}
    # for sub in subjects:
    #     topics = [t[0] for t in db.query(Question.topic).filter(Question.subject == sub).distinct().all() if t[0]]
    #     topics_by_subject[sub] = topics
        
    return {
        "subjects": subjects,
        "years": years
        # "topics": topics_by_subject
    }

