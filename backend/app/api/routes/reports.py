from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.report import Report
from backend.app.schemas.report_schema import ReportCreate

router = APIRouter()

@router.post("/")
def submit_report(data: ReportCreate, db: Session = Depends(get_db)):
    try:
        new_report = Report(question_id=data.question_id)
        db.add(new_report)
        db.commit()
        return {"status": "success", "message": "Report received"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))