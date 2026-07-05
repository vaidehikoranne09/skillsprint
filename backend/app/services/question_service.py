from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status

from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionFilter
from app.utils.csv_loader import csv_loader

class QuestionService:
    
    @staticmethod
    def load_csv_data_to_db(db: Session) -> Dict[str, int]:
        """Load all CSV data into the database"""
        datasets = csv_loader.load_all_datasets()
        total_loaded = 0
        
        if not datasets:
            print("❌ No data found in CSV files")
            return {'total_loaded': 0}
        
        for subject, questions in datasets.items():
            print(f"📥 Loading {subject}...")
            for q_data in questions:
                existing = db.query(Question).filter(
                    Question.question == q_data.get('question', ''),
                    Question.subject == subject
                ).first()
                
                if not existing:
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
                        question_id=q_data.get('question_id', None)
                    )
                    db.add(question)
                    total_loaded += 1
        
        db.commit()
        print(f"✅ Loaded {total_loaded} questions total")
        return {'total_loaded': total_loaded}
    
    @staticmethod
    def get_subject_summary(db: Session) -> Dict[str, Any]:
        """Get summary of all subjects"""
        subjects = {}
        metadata = csv_loader.get_subject_metadata()
        
        for subject_name, meta in metadata.items():
            total = db.query(Question).filter(Question.subject == subject_name).count()
            topics = db.query(Question.topic).filter(
                Question.subject == subject_name
            ).distinct().count()
            
            subjects[subject_name] = {
                'name': subject_name,
                'icon': meta.get('icon', 'fa-book'),
                'description': meta.get('description', ''),
                'color': meta.get('color', '#7c3aed'),
                'total_questions': total,
                'topics_count': topics,
                'progress': 0.0
            }
        
        return subjects
    
    @staticmethod
    def get_topics_by_subject(db: Session, subject: str) -> List[Dict]:
        """Get all topics and subtopics for a subject"""
        # Get distinct topics
        topics_data = db.query(
            Question.topic,
            func.count(Question.id).label('total_questions')
        ).filter(Question.subject == subject).group_by(Question.topic).all()
        
        result = []
        for topic_data in topics_data:
            topic_name = topic_data[0]
            
            # Get subtopics for this topic
            subtopics_data = db.query(
                Question.subtopic,
                func.count(Question.id).label('count'),
                Question.difficulty
            ).filter(
                and_(
                    Question.subject == subject,
                    Question.topic == topic_name
                )
            ).group_by(Question.subtopic).all()
            
            subtopics = []
            for st in subtopics_data:
                diff_name = st[2].value if hasattr(st[2], 'value') else str(st[2]) if st[2] else 'Medium'
                subtopics.append({
                    'name': st[0],
                    'total_questions': st[1],
                    'difficulty': diff_name,
                    'progress': 0.0
                })
            
            result.append({
                'name': topic_name,
                'total_questions': topic_data[1],
                'subtopics': subtopics,
                'progress': 0.0
            })
        
        return result
    
    @staticmethod
    def get_questions(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[QuestionFilter] = None
    ) -> List[Question]:
        """Get questions with optional filters"""
        query = db.query(Question)
        
        if filters:
            if filters.subject:
                query = query.filter(Question.subject == filters.subject)
            if filters.topic:
                query = query.filter(Question.topic == filters.topic)
            if filters.subtopic:
                query = query.filter(Question.subtopic == filters.subtopic)
            if filters.difficulty:
                query = query.filter(Question.difficulty == filters.difficulty)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_question(db: Session, question_id: int) -> Optional[Question]:
        """Get a single question by ID"""
        return db.query(Question).filter(Question.id == question_id).first()
    
    @staticmethod
    def get_questions_by_topic(
        db: Session, 
        subject: str, 
        topic: str,
        subtopic: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> List[Question]:
        """Get questions filtered by subject, topic, subtopic, and difficulty"""
        query = db.query(Question).filter(
            and_(
                Question.subject == subject,
                Question.topic == topic
            )
        )
        
        if subtopic:
            query = query.filter(Question.subtopic == subtopic)
        if difficulty:
            query = query.filter(Question.difficulty == difficulty)
        
        return query.all()
    
    # backend/app/services/question_service.py
    @staticmethod
    def get_practice_questions(
        db: Session,
        subject: str,
        topic: str,
        subtopic: Optional[str] = None,
        difficulty: Optional[str] = None,
        limit: int = 50
    ) -> List[Question]:
        query = db.query(Question).filter(Question.subject == subject)
        query = query.filter(Question.topic == topic)
        if subtopic:
            query = query.filter(Question.subtopic == subtopic)
        return query.limit(limit).all()