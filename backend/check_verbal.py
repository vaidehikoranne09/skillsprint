"""
Check Verbal Ability data in database
Run: python check_verbal.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models.question import Question
from sqlalchemy import func

db = SessionLocal()

print("=" * 60)
print("📊 CHECKING VERBAL ABILITY DATA")
print("=" * 60)

# 1. Total Verbal questions
total = db.query(Question).filter(Question.subject == 'Verbal Ability').count()
print(f"\n📝 Total Verbal Ability questions: {total}")

# 2. All topics in Verbal
topics = db.query(Question.topic, func.count(Question.id)).filter(
    Question.subject == 'Verbal Ability'
).group_by(Question.topic).all()
print("\n📊 Topics in Verbal Ability:")
for topic, count in topics:
    print(f"  • {topic}: {count}")

# 3. Check Synonyms topic specifically
synonyms = db.query(Question).filter(
    Question.subject == 'Verbal Ability',
    Question.topic == 'Synonyms'
).all()
print(f"\n📝 Synonyms questions: {len(synonyms)}")

if synonyms:
    # Check subtopics under Synonyms
    subtopics = db.query(Question.subtopic, func.count(Question.id)).filter(
        Question.subject == 'Verbal Ability',
        Question.topic == 'Synonyms'
    ).group_by(Question.subtopic).all()
    print("\n📊 Subtopics under Synonyms:")
    for subtopic, count in subtopics:
        print(f"  • {subtopic}: {count}")
    
    # Show first sample
    sample = synonyms[0]
    print(f"\n📝 Sample Synonyms question:")
    print(f"  Topic: {sample.topic}")
    print(f"  Subtopic: {sample.subtopic}")
    print(f"  Question: {sample.question[:100]}...")
else:
    print("\n❌ No Synonyms questions found!")
    
    # Try to find similar topics
    all_topics = db.query(Question.topic).filter(
        Question.subject == 'Verbal Ability'
    ).distinct().all()
    print("\n🔍 All topics in Verbal Ability:")
    for topic in all_topics:
        print(f"  • {topic[0]}")

db.close()