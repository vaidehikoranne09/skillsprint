"""
Force load Logical Reasoning data from CSV
Run: python force_load_reasoning.py
"""

import sys
import csv
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models.question import Question

def force_load():
    print("=" * 60)
    print("📊 FORCE LOAD LOGICAL REASONING")
    print("=" * 60)
    
    db = SessionLocal()
    
    # Clear existing
    print("🗑️ Clearing existing Logical Reasoning...")
    db.query(Question).filter(Question.subject == 'Logical Reasoning').delete()
    db.commit()
    
    # Find CSV
    csv_path = Path('../datasets/raw/reasoning.csv')
    if not csv_path.exists():
        csv_path = Path.cwd().parent / 'datasets' / 'raw' / 'reasoning.csv'
    
    if not csv_path.exists():
        print(f"❌ reasoning.csv not found!")
        return
    
    print(f"📁 Loading: {csv_path}")
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        # Read first line to check headers
        first_line = f.readline()
        print(f"📋 First line: {first_line[:200]}...")
        f.seek(0)  # Reset to start
        
        reader = csv.DictReader(f)
        
        # Debug: Check what the reader sees
        print(f"📋 Columns from CSV: {reader.fieldnames}")
        
        rows = list(reader)
        print(f"📝 Total rows found: {len(rows)}")
        
        if len(rows) == 0:
            print("❌ No data rows found!")
            return
        
        # Show first row for debugging
        print(f"\n📝 First row sample:")
        for key, value in rows[0].items():
            val_str = str(value)[:100] + "..." if len(str(value)) > 100 else value
            print(f"  {key}: {val_str}")
        
        loaded = 0
        for row in rows:
            try:
                # Get values
                subject = row.get('subject', 'Logical Reasoning').strip()
                topic = row.get('topic', 'General').strip()
                subtopic = row.get('subtopic', 'General').strip()
                difficulty = row.get('difficulty', 'Medium').strip()
                question = row.get('question', '').strip()
                
                if not question:
                    print(f"⚠️ Skipping row {loaded}: No question text")
                    continue
                
                # Create question
                q = Question(
                    subject=subject,
                    topic=topic or 'General',
                    subtopic=subtopic or 'General',
                    difficulty=difficulty.capitalize() if difficulty.lower() in ['easy', 'medium', 'hard'] else 'Medium',
                    question=question,
                    options=[
                        row.get('option_a', '').strip() or '',
                        row.get('option_b', '').strip() or '',
                        row.get('option_c', '').strip() or '',
                        row.get('option_d', '').strip() or ''
                    ],
                    correct_option=0,
                    explanation=row.get('explanation', '').strip() or '',
                    hint=row.get('hint', '').strip() or '',
                    formula=row.get('formula', '').strip() or '',
                    shortcut=row.get('shortcut', '').strip() or ''
                )
                db.add(q)
                loaded += 1
                
                if loaded % 50 == 0:
                    print(f"   Loaded {loaded} questions...")
                    
            except Exception as e:
                print(f"⚠️ Error loading row {loaded}: {e}")
        
        db.commit()
        print(f"\n✅ Loaded {loaded} Logical Reasoning questions")
    
    # Verify
    from sqlalchemy import func
    count = db.query(Question).filter(Question.subject == 'Logical Reasoning').count()
    print(f"\n📊 Total Logical Reasoning questions in database: {count}")
    
    if count > 0:
        sample = db.query(Question).filter(Question.subject == 'Logical Reasoning').first()
        print(f"\n📝 Sample question:")
        print(f"  Subject: {sample.subject}")
        print(f"  Topic: {sample.topic}")
        print(f"  Subtopic: {sample.subtopic}")
        print(f"  Question: {sample.question[:150]}...")
    else:
        print("\n❌ No questions loaded. Please check the CSV format.")
    
    db.close()

if __name__ == "__main__":
    force_load()