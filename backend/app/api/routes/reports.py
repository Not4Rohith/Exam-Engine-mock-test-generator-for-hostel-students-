from fastapi import APIRouter, Depends, HTTPException
import httpx
import os
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.report import Report
from backend.app.schemas.report_schema import ReportCreate

router = APIRouter()

# loads from render
REPORT_WEBHOOK_URL = os.getenv("DISCORD_REPORT_WEBHOOK_URL")

async def notify_discord_report(question_id: int):
    if not REPORT_WEBHOOK_URL:
        return
    payload = {
        "embeds": [{
            "title": "🚨 Question Reported!",
            "description": f"A user has reported an issue with **Question ID: {question_id}**.",
            "color": 15158332, # Bright Red for alerts
            "footer": {"text": "Exam Engine Security"}
        }]
    }
    async with httpx.AsyncClient() as client:
        try:
            await client.post(REPORT_WEBHOOK_URL, json=payload)
        except Exception as e:
            print(f"Report notification failed: {e}")

# 🌟 FIX: Change "/" to "/reports" to match your frontend call
@router.post("/reports")
async def submit_report(data: ReportCreate, db: Session = Depends(get_db)):
    try:
        # 1. Save to DB
        new_report = Report(question_id=data.question_id)
        db.add(new_report)
        db.commit()

        # 2. Ping Discord
        await notify_discord_report(data.question_id)

        return {"status": "success", "message": "Report received"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))