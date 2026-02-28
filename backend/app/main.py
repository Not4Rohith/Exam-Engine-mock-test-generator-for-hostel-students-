from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.app.models import question, report, feedback as feedback_model
from backend.app.api.routes import health, reports, feedback, exams, mock, practice, pdf
from backend.app.core.database import engine

# 1. Initialize DB Tables
question.Base.metadata.create_all(bind=engine)
report.Base.metadata.create_all(bind=engine)
feedback_model.Base.metadata.create_all(bind=engine)

# 2. Define App once (Fixed Redirects)
app = FastAPI(
    title="Exam Engine API",
    description="Backend for generating custom KCET mock and practice tests.",
    version="1.0.0",
    redirect_slashes=False  # 🌟 FIX: Stops the 307 Redirect loop
)

# 3. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# 4. Include Routers (FIXED PREFIXES)
# 🌟 CRITICAL FIX: Your health router likely already has a "/" route. 
# If you use prefix="/api/health", the final URL becomes /api/health/ 
# We remove the suffix from the prefix to keep it clean.
app.include_router(health.router, prefix="/api", tags=["Health"]) 

# The rest are fine as they map to specific endpoints
# 🌟 Change all of these to just prefix="/api"
# app.include_router(health.router, prefix="/api", tags=["Health"])
# app.include_router(health.router, prefix="/api/health", tags=["Health"]) 
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(mock.router, prefix="/api/mock", tags=["Mock Test"])
app.include_router(practice.router, prefix="/api/practice", tags=["Practice Test"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(feedback.router, prefix="/api", tags=["Feedback"])
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF Generation"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Exam Engine API. System is operational."}

# Added a direct health check here just to be 100% sure Render finds it
@app.get("/api/health")
async def direct_health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)