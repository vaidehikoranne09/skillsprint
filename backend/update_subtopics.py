"""
Update subtopic names to match frontend expectations
Run: python update_subtopics.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models.question import Question

def update_subtopics():
    print("=" * 60)
    print("📊 UPDATING SUBTOPIC NAMES")
    print("=" * 60)
    
    db = SessionLocal()
    
    # Update Synonyms subtopics
    updates = [
        ('Basic Synonyms', 'Basic'),
        ('Business Vocabulary', 'Business'),
        ('Technology Vocabulary', 'Technology'),
    ]
    
    for old_name, new_name in updates:
        count = db.query(Question).filter(
            Question.subject == 'Verbal Ability',
            Question.topic == 'Synonyms',
            Question.subtopic == old_name
        ).update({Question.subtopic: new_name})
        print(f"  • Updated {count} questions: {old_name} → {new_name}")
    
    db.commit()
    
    # Verify
    from sqlalchemy import func
    subtopics = db.query(Question.subtopic, func.count(Question.id)).filter(
        Question.subject == 'Verbal Ability',
        Question.topic == 'Synonyms'
    ).group_by(Question.subtopic).all()
    
    print("\n📊 Updated subtopics under Synonyms:")
    for subtopic, count in subtopics:
        print(f"  • {subtopic}: {count}")
    
    db.close()
    print("\n✅ Done!")

if __name__ == "__main__":
    update_subtopics()