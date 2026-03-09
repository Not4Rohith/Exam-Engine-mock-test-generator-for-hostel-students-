import httpx
import os

# Get the webhook from Render environment variables
GENERATION_WEBHOOK_URL = os.getenv("DISCORD_GENERATION_WEBHOOK_URL")

async def notify_generation(message: str):
    """
    Sends a simple text notification to Discord for internal tracking.
    """
    if not GENERATION_WEBHOOK_URL:
        return
        
    payload = {"content": message}
    
    async with httpx.AsyncClient() as client:
        try:
            await client.post(GENERATION_WEBHOOK_URL, json=payload)
        except Exception as e:
            print(f"Discord Generation Alert failed: {e}")