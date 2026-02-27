from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.models import question, report, feedback as feedback_model
import uvicorn
from backend.app.api.routes import health, reports, feedback, exams, mock, practice, pdf

# We will import these as we build them, starting with health
from backend.app.api.routes import health #, exams, mock, practice, etc.
from backend.app.core.database import engine


question.Base.metadata.create_all(bind=engine)
report.Base.metadata.create_all(bind=engine)
feedback_model.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Exam Engine API",
    description="Backend for generating custom KCET mock and practice tests.",
    version="1.0.0"
)

# CORS configuration - crucial for frontend to communicate with backend
# In production, you'd restrict this to your actual frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include Routers
# We map the health router to /api/health
app.include_router(health.router, prefix="/api/health", tags=["Health"])
# app.include_router(health.router, prefix="/api/health", tags=["Health"])
# app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
# app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])

# You will uncomment these as we build them out
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(mock.router, prefix="/api/mock", tags=["Mock Test"])
app.include_router(practice.router, prefix="/api/practice", tags=["Practice Test"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF Generation"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Exam Engine API. System is operational."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)