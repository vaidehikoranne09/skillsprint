"""
Directly load CSV data into the database
Run: python direct_load.py
"""

import sys
import csv
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models.question import Question

def load_data():
    print("=" * 60)
    print("📊 DIRECT DATA LOADER")
    print("=" * 60)

    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Clear existing
    print("🗑️ Clearing existing questions...")
    count = db.query(Question).count()

    if count > 0:
        print(f"Database already contains {count} questions.")
        db.close()
        return

    # CSV files
    csv_files = [
        ('Arithmetic', '../datasets/raw/arithmetic.csv'),
        ('Logical Reasoning', '../datasets/raw/reasoning.csv'),
        ('Verbal Ability', '../datasets/raw/verbal.csv'),
    ]

    total_loaded = 0
    total_skipped = 0

    for subject_name, csv_path in csv_files:
        print(f"\n📥 Loading {subject_name} from {csv_path}...")

        full_path = Path(__file__).parent / csv_path

        if not full_path.exists():
            print(f"❌ File not found: {full_path}")
            continue

        with open(full_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            print(f"📝 Found {len(rows)} rows")

            loaded = 0
            for row in rows:
                try:
                    # Get question text
                    question_text = row.get('question', '').strip()
                    if not question_text:
                        total_skipped += 1
                        continue

                    # Get values
                    topic = row.get('topic', 'General').strip() or 'General'
                    subtopic = row.get('subtopic', 'General').strip() or 'General'
                    difficulty = row.get('difficulty', 'Medium').strip() or 'Medium'

                    # Options
                    options = [
                        row.get('option_a', '').strip() or '',
                        row.get('option_b', '').strip() or '',
                        row.get('option_c', '').strip() or '',
                        row.get('option_d', '').strip() or ''
                    ]

                    # Correct option
                    correct_option = 0
                    correct_val = row.get('correct_option', '').strip()
                    if correct_val:
                        if correct_val.upper() in ['A', 'B', 'C', 'D']:
                            correct_option = ord(correct_val.upper()) - 65
                        else:
                            try:
                                correct_option = int(correct_val) - 1
                            except:
                                correct_option = 0

                    # Create question
                    question = Question(
                        subject=subject_name,
                        topic=topic,
                        subtopic=subtopic,
                        difficulty=difficulty.capitalize() if difficulty.lower() in ['easy', 'medium', 'hard'] else 'Medium',
                        question=question_text,
                        options=options,
                        correct_option=correct_option,
                        explanation=row.get('explanation', '').strip() or '',
                        hint=row.get('hint', '').strip() or '',
                        formula=row.get('formula', '').strip() or '',
                        shortcut=row.get('shortcut', '').strip() or ''
                    )
                    db.add(question)
                    loaded += 1
                    total_loaded += 1

                except Exception as e:
                    total_skipped += 1
                    # print(f"⚠️ Error loading row: {e}")

            print(f"✅ Loaded {loaded} questions from {subject_name}")

    # Commit
    print(f"\n💾 Committing {total_loaded} questions to database...")
    db.commit()

    # Verify
    from sqlalchemy import func
    count = db.query(Question).count()
    print(f"\n📊 Total questions in database: {count}")

    subjects = db.query(Question.subject, func.count(Question.id)).group_by(Question.subject).all()
    print("\n📊 By Subject:")
    for subject, cnt in subjects:
        print(f"  • {subject}: {cnt}")

    # Check sample
    sample = db.query(Question).first()
    if sample:
        print(f"\n📝 Sample:")
        print(f"  Subject: {sample.subject}")
        print(f"  Topic: {sample.topic}")
        print(f"  Subtopic: {sample.subtopic}")
        print(f"  Question: {sample.question[:100]}...")

    db.close()
    print("\n✅ Done!")

if __name__ == "__main__":
    load_data()