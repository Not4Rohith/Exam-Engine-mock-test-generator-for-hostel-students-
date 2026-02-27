import os
import json
# Dropped init_db, importing engine and Base directly
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.question import Question

DATA_FOLDER = "backend/data/raw_json"

def extract_subject_year(filename):
    name = filename.replace(".json", "")
    subject, year = name.split("_")
    return subject.upper(), int(year)

def import_data():
    # Force create all tables in whatever DB we are connected to (Neon or SQLite)
    Question.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    files = [f for f in os.listdir(DATA_FOLDER) if f.endswith(".json")]

    total_inserted = 0

    for file in files:
        filepath = os.path.join(DATA_FOLDER, file)
        subject, year = extract_subject_year(file)

        with open(filepath, "r") as f:
            data = json.load(f)

        for q in data["questions"]:
            # Avoid duplicate insertion
            exists = db.query(Question).filter_by(question_id=q["question_id"]).first()
            if exists:
                continue

            question = Question(
                question_id=q["question_id"],
                exam="KCET",
                year=year,
                subject=subject,
                topic=q.get("classification", {}).get("topic"),
                puc_level=q.get("classification", {}).get("puc_level"),
                difficulty=q.get("difficulty_level"),
                question_type=q.get("question_type"),
                question_text=q.get("question_text"),
                option_a=q.get("options", {}).get("A"),
                option_b=q.get("options", {}).get("B"),
                option_c=q.get("options", {}).get("C"),
                option_d=q.get("options", {}).get("D"),
                correct_option=q.get("correct_answer", {}).get("option"),
                solution_text=q.get("solution", {}).get("solution_text"),
                has_image=q.get("media", {}).get("has_image", False),
                image_path=q.get("media", {}).get("image_placeholder_path"),
                image2_path=q.get("media", {}).get("image2_placeholder_path")
            )

            db.add(question)
            total_inserted += 1

        print(f"Imported {file}")

    db.commit()
    db.close()

    print(f"\nTotal Questions Inserted: {total_inserted}")

if __name__ == "__main__":
    import_data()