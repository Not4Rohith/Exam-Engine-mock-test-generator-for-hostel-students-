from fastapi import APIRouter, Depends, HTTPException
import httpx
import os
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.feedback import Feedback
from backend.app.schemas.feedback_schema import FeedbackCreate

router = APIRouter()

DISCORD_URL = os.getenv("https://discord.com/api/webhooks/1477252438582104156/XGtRyMwgWctVIBYIitoIeedTO2W4RycmEk7CHjrmoXbpFptIRc8n1qAkDvF31IlwE4Sc")

async def notify_discord(title: str, message: str, color: int):
    if not DISCORD_URL:
        return
    payload = {
        "embeds": [{
            "title": title,
            "description": message,
            "color": color
        }]
    }
    async with httpx.AsyncClient() as client:
        try:
            await client.post(DISCORD_URL, json=payload)
        except Exception as e:
            print(f"Discord notification failed: {e}")

# 🌟 CHANGED: Added 'async' so we can use 'await' inside
@router.post("/")
async def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    try:
        # 1. Save to Database
        new_feedback = Feedback(name=data.name, feedback_text=data.feedback)
        db.add(new_feedback)
        db.commit()

        # 2. Ping Discord (Moved inside the try block)
        # We use data.name and data.feedback from your Pydantic schema
        await notify_discord(
            title="💬 New Feedback Received!",
            message=f"**User:** {data.name}\n**Message:** {data.feedback}",
            color=3066993  # Blue color
        )

        # 3. Final Return (The absolute end of the function)
        return {"status": "success", "message": "Feedback received"}

    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")