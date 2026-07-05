"""
Check if questions exist for specific subtopics
Run: python check_questions.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models.question import Question

db = SessionLocal()

print("=" * 60)
print("🔍 CHECKING SPECIFIC SUBTOPICS")
print("=" * 60)

# Check each subtopic
checks = [
    ('Arithmetic', 'Algebra', 'Word Problems'),
    ('Logical Reasoning', 'Coding-Decoding', 'Letter Coding'),
    ('Verbal Ability', 'Active & Passive Voice', 'Future Tense'),
]

for subject, topic, subtopic in checks:
    count = db.query(Question).filter(
        Question.subject == subject,
        Question.topic == topic,
        Question.subtopic == subtopic
    ).count()
    
    print(f"\n📊 {subject} → {topic} → {subtopic}:")
    print(f"   Questions: {count}")
    
    if count > 0:
        # Show one sample
        sample = db.query(Question).filter(
            Question.subject == subject,
            Question.topic == topic,
            Question.subtopic == subtopic
        ).first()
        if sample:
            print(f"   Sample: {sample.question[:100]}...")

db.close()