"""
Debug script to load CSV data
Run: python debug_load.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models.question import Question
from app.utils.csv_loader import csv_loader

print("=" * 60)
print("🔍 DEBUG: CSV LOADER")
print("=" * 60)

# 1. Check if CSV files exist
print("\n📁 Checking CSV files:")
datasets_path = Path(__file__).parent.parent / 'datasets' / 'raw'
print(f"📁 Datasets path: {datasets_path}")

if datasets_path.exists():
    files = list(datasets_path.glob('*.csv'))
    print(f"✅ Found {len(files)} CSV files:")
    for f in files:
        print(f"  • {f.name}")
else:
    print("❌ Datasets path not found!")
    sys.exit(1)

# 2. Try loading each CSV
print("\n🔄 Loading CSV files...")
csv_loader.datasets_path = datasets_path
datasets = csv_loader.load_all_datasets()

print(f"\n✅ Loaded {len(datasets)} subjects:")
for subject, data in datasets.items():
    print(f"  • {subject}: {len(data)} questions")

# 3. Print first row of each CSV for verification
print("\n📝 First row of each CSV:")
for subject, data in datasets.items():
    if data:
        print(f"\n  {subject}:")
        for key, value in data[0].items():
            print(f"    {key}: {value[:50] if len(str(value)) > 50 else value}")
        print(f"    ... ({len(data)} total rows)")

# 4. Load into database
print("\n📊 Loading into database...")
db = SessionLocal()

# Clear existing
print("🗑️ Clearing existing questions...")
db.query(Question).delete()
db.commit()

# Load new data
total_loaded = 0
for subject, questions in datasets.items():
    print(f"📥 Loading {subject}...")
    for q_data in questions:
        question = Question(
            subject=subject,
            topic=q_data.get('topic', 'General'),
            subtopic=q_data.get('subtopic', 'General'),
            difficulty=q_data.get('difficulty', 'Medium'),
            question=q_data.get('question', ''),
            options=q_data.get('options', ['', '', '', '']),
            correct_option=q_data.get('correct_option', 0),
            explanation=q_data.get('explanation', ''),
            hint=q_data.get('hint', ''),
            formula=q_data.get('formula', ''),
            shortcut=q_data.get('shortcut', ''),
        )
        db.add(question)
        total_loaded += 1

db.commit()
print(f"\n✅ Loaded {total_loaded} questions total")

# 5. Verify
from sqlalchemy import func
count = db.query(Question).count()
print(f"\n📊 Total questions in database: {count}")

subjects = db.query(Question.subject, func.count(Question.id)).group_by(Question.subject).all()
print("\n📊 By Subject:")
for subject, cnt in subjects:
    print(f"  • {subject}: {cnt}")

db.close()