from pydantic import BaseModel
from typing import List, Optional

class DifficultyCount(BaseModel):
    easy: int
    moderate: int
    hard: int

class PracticeRequest(BaseModel):
    subject: str
    topics: List[str]
    years: List[str]
    difficulty: DifficultyCount
    puc_levels: Optional[List[str]] = [] # <-- Add this!

class MockRequest(BaseModel):
    subject: str
    years: List[str]
    difficulty: DifficultyCount
    includeDeleted: bool = False