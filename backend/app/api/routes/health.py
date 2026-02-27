from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    message: str

@router.get("/", response_model=HealthResponse)
async def check_health():
    """
    Endpoint to check if the backend is active. 
    Frontend uses this to show the Green/Red light indicator.
    """
    # Later, we can add database connection checks here too.
    # For now, if this responds, the server is awake.
    return HealthResponse(
        status="active",
        message="Backend is up and running"
    )