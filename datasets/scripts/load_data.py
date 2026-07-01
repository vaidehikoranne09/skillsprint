#!/usr/bin/env python
"""
Load CSV data into the database.
Run from project root: python datasets/scripts/load_data.py
"""

import sys
import os
from pathlib import Path

# Get the project root
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent.parent
backend_dir = project_root / 'backend'

# Add backend to Python path
sys.path.insert(0, str(backend_dir))

print("=" * 60)
print("📊 SkillsPrint - CSV Data Loader")
print("=" * 60)
print(f"📁 Project root: {project_root}")
print(f"📁 Backend path: {backend_dir}")
print("=" * 60)

from app.database import SessionLocal, engine, Base
from app.models.question import Question
from app.services.question_service import QuestionService
from app.utils.csv_loader import csv_loader

def main():
    db = SessionLocal()
    try:
        # Check if data exists
        existing = db.query(Question).first()
        if existing:
            print(f"⚠️ Database already has {db.query(Question).count()} questions.")
            confirm = input("❓ Overwrite existing data? (y/N): ")
            if confirm.lower() != 'y':
                print("❌ Operation cancelled")
                return
            
            print("🗑️ Clearing existing questions...")
            db.query(Question).delete()
            db.commit()
        
        # Load data
        print("\n🔄 Loading CSV data...")
        result = QuestionService.load_csv_data_to_db(db)
        
        print("\n" + "=" * 60)
        print(f"✅ Successfully loaded {result['total_loaded']} questions")
        print("=" * 60)
        
        # Show summary
        from sqlalchemy import func
        subjects = db.query(Question.subject, func.count(Question.id)).group_by(Question.subject).all()
        print("\n📊 Subject Summary:")
        for subject, count in subjects:
            print(f"  • {subject}: {count} questions")
        
        # Show sample difficulties
        difficulties = db.query(Question.difficulty, func.count(Question.id)).group_by(Question.difficulty).all()
        print("\n📊 Difficulty Distribution:")
        for diff, count in difficulties:
            print(f"  • {diff.value if hasattr(diff, 'value') else diff}: {count} questions")
        
        print("\n🎉 Data loading complete!")
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()