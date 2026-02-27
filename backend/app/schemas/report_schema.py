from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    question_id: str

class ReportResponse(ReportCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True