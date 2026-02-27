from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, unique=True, index=True)

    exam = Column(String)   # ← ADD THIS

    year = Column(Integer)
    subject = Column(String)
    topic = Column(String)
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