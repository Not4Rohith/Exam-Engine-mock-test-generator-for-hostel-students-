from pydantic import BaseModel
from typing import List

class DifficultyConfig(BaseModel):
    easy: int
    moderate: int
    hard: int

class PracticeRequest(BaseModel):
    subject: str
    topics: List[str]
    years: List[str]
    difficulty: DifficultyConfig