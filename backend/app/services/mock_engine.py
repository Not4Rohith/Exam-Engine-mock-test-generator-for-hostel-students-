from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from backend.app.models.question import Question
from backend.app.schemas.mock_schema import MockRequest

def generate_mock_paper(db: Session, request: MockRequest):
    questions = []
    
    # In KCET, there are exactly 60 questions.
    # Rule: ~25% from 11th grade, ~75% from 12th grade.
    
    difficulty_targets = {
        "Easy": request.difficulty.easy,
        "Moderate": request.difficulty.moderate,
        "Hard": request.difficulty.hard
    }
    
    for diff, total_count in difficulty_targets.items():
        if total_count <= 0:
            continue
            
        # Split this difficulty bucket into 11th and 12th
        count_11th = int(total_count * 0.25)
        count_12th = total_count - count_11th
        
        # Base query filters
        base_filter = [
            Question.subject == request.subject,
            Question.difficulty == diff
        ]
        
        # If we had an is_deleted column, we'd add: 
        # if not request.includeDeleted: base_filter.append(Question.is_deleted == False)

        # Fetch 11th grade questions randomly
        q_11 = db.query(Question).filter(*base_filter, Question.puc_level == "11th")\
                 .order_by(func.random()).limit(count_11th).all()
                 
        # Fetch 12th grade questions randomly
        q_12 = db.query(Question).filter(*base_filter, Question.puc_level == "12th")\
                 .order_by(func.random()).limit(count_12th).all()
                 
        questions.extend(q_11 + q_12)
        
    return questions