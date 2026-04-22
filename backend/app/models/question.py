from sqlalchemy import Column, Integer, String, Text, Boolean
from backend.app.core.database import Base

#Base = declarative_base() # removed this faulty line

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, unique=True, index=True)

    exam = Column(String)   

    year = Column(Integer)
    subject = Column(String)
    topic = Column(String)
    chapter= Column(String)  # trying to add new column
    puc_level = Column(String)
    difficulty = Column(String)
    question_type = Column(String)

    question_text = Column(Text)

    option_a = Column(Text)
    option_b = Column(Text)
    option_c = Column(Text)
    option_d = Column(Text)

    correct_option = Column(String)
    solution_text = Column(Text)

    has_image = Column(Boolean, default=False)
    image_path = Column(String, nullable=True)
    image2_path = Column(String, nullable=True)