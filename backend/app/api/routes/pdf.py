from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.question import Question
from backend.app.schemas.pdf import PDFRequest

# 🌟 Import the real engine we just built
from backend.app.services.pdf_engine import generate_pdf_bytes

router = APIRouter()

@router.post("/download")
def download_pdf(request: PDFRequest, db: Session = Depends(get_db)):
    try:
        # Fetch questions based on the IDs sent from React
        questions = db.query(Question).filter(Question.question_id.in_(request.question_ids)).all()        
        if not questions:
            raise HTTPException(status_code=404, detail="No questions found.")

        # 🌟 Generate the actual PDF bytes
        pdf_bytes = generate_pdf_bytes(
            questions=questions,
            doc_type=request.document_type,
            two_column=request.page_saving_mode,
            show_extra_info=request.show_extra_info
        )

        headers = {
            'Content-Disposition': f'attachment; filename="ExamEngine_{request.document_type}.pdf"'
        }
        
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

    except Exception as e:
        print(f"PDF Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))