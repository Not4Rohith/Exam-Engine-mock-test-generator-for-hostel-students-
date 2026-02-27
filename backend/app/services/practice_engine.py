from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from backend.app.models.question import Question
from backend.app.schemas.practice_schema import PracticeRequest

def generate_practice_paper(db: Session, request: PracticeRequest):
    questions = []
    
    # Practice tests are completely flexible based on user choices
    difficulty_targets = {
        "Easy": request.difficulty.easy,
        "Moderate": request.difficulty.moderate,
        "Hard": request.difficulty.hard
    }
    
    # Handle the "Mixed (All 5 Years)" edge case, or specific years
    selected_years = [int(y) for y in request.years if y.isdigit()]
    
    for diff, count in difficulty_targets.items():
        if count <= 0:
            continue
            
        filters = [
            Question.subject == request.subject,
            Question.topic.in_(request.topics),
            Question.difficulty == diff
        ]
        
        if selected_years:
            filters.append(Question.year.in_(selected_years))
            
        # Fetch randomly matching the exact topics and difficulty
        qs = db.query(Question)\
                   .filter(*filters)\
                   .order_by(func.random())\
                   .limit(count)\
                   .all()
        questions.extend(qs)
        
    return questions