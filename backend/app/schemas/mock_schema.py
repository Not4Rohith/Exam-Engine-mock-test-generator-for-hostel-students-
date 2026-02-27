from pydantic import BaseModel

class DifficultyConfig(BaseModel):
    easy: int
    moderate: int
    hard: int

class MockRequest(BaseModel):
    subject: str
    difficulty: DifficultyConfig
    includeDeleted: bool = False