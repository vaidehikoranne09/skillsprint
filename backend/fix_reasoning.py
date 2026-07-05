"""
Load Logical Reasoning data
Run: python load_reasoning.py
"""

import sys
import csv
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models.question import Question

def load_reasoning():
    print("=" * 60)
    print("📊 LOADING LOGICAL REASONING")
    print("=" * 60)
    
    db = SessionLocal()
    
    # Clear existing
    print("🗑️ Clearing existing Logical Reasoning questions...")
    db.query(Question).filter(Question.subject == 'Logical Reasoning').delete()
    db.commit()
    
    # Load CSV
    csv_path = Path(__file__).parent.parent / 'datasets' / 'raw' / 'reasoning.csv'
    print(f"📁 Loading from: {csv_path}")
    
    if not csv_path.exists():
        print(f"❌ File not found: {csv_path}")
        return
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        print(f"📋 Columns: {reader.fieldnames}")
        
        rows = list(reader)
        print(f"📝 Found {len(rows)} rows")
        
        loaded = 0
        for row in rows:
            try:
                subject = row.get('subject', 'Logical Reasoning').strip()
                topic = row.get('topic', 'General').strip()
                subtopic = row.get('subtopic', 'General').strip()
                difficulty = row.get('difficulty', 'Medium').strip()
                question_text = row.get('question', '').strip()
                
                if not question_text:
                    continue
                
                options = [
                    row.get('option_a', '').strip() or '',
                    row.get('option_b', '').strip() or '',
                    row.get('option_c', '').strip() or '',
                    row.get('option_d', '').strip() or ''
                ]
                
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
                
                question = Question(
                    subject=subject,
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
                
            except Exception as e:
                print(f"⚠️ Error: {e}")
                continue
        
        db.commit()
        print(f"✅ Loaded {loaded} Logical Reasoning questions")
    
    # Verify
    from sqlalchemy import func
    count = db.query(Question).filter(Question.subject == 'Logical Reasoning').count()
    print(f"\n📊 Logical Reasoning questions in database: {count}")
    
    # Show sample
    sample = db.query(Question).filter(Question.subject == 'Logical Reasoning').first()
    if sample:
        print(f"\n📝 Sample:")
        print(f"  Subject: {sample.subject}")
        print(f"  Topic: {sample.topic}")
        print(f"  Subtopic: {sample.subtopic}")
        print(f"  Question: {sample.question[:100]}...")
    
    db.close()
    print("\n✅ Done!")

if __name__ == "__main__":
    load_reasoning()