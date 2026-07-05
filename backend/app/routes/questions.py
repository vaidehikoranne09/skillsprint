from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.question import (
    QuestionResponse, 
    QuestionFilter, 
    SubjectSummary,
    SubjectDetail
)
from app.services.question_service import QuestionService
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get(
    "/subjects",
    summary="Get all subjects",
    description="Get summary of all subjects with question counts",
    response_model=List[SubjectSummary]
)
async def get_subjects(
    db: Session = Depends(get_db)
):
    """Get all subjects and their metadata"""
    subjects = QuestionService.get_subject_summary(db)
    return list(subjects.values())

@router.get(
    "/topics/{subject}",
    summary="Get topics by subject",
    description="Get all topics and subtopics for a specific subject"
)
async def get_topics(
    subject: str,
    db: Session = Depends(get_db)
):
    """Get topics and subtopics for a subject"""
    topics = QuestionService.get_topics_by_subject(db, subject)
    return {
        "subject": subject,
        "topics": topics
    }

@router.get(
    "/practice",
    summary="Get practice questions",
    description="Get practice questions with filtering by subject, topic, and subtopic"
)
async def get_practice_questions(
    subject: str = Query(..., description="Subject name"),
    topic: str = Query(..., description="Topic name"),
    subtopic: Optional[str] = Query(None, description="Subtopic name"),
    difficulty: Optional[str] = Query(None, description="Difficulty level"),
    limit: int = Query(50, ge=1, le=100, description="Number of questions"),
    db: Session = Depends(get_db)
):
    """
    Get practice questions for a specific subject, topic, and optionally subtopic.
    
    This is the main endpoint for fetching practice questions.
    It filters by subject, topic, and subtopic to ensure the correct questions are returned.
    """
    try:
        questions = QuestionService.get_practice_questions(
            db=db,
            subject=subject,
            topic=topic,
            subtopic=subtopic,
            difficulty=difficulty,
            limit=limit
        )
        
        return {
            "total": len(questions),
            "subject": subject,
            "topic": topic,
            "subtopic": subtopic,
            "questions": [q.to_dict() for q in questions]
        }
    except Exception as e:
        print(f"❌ Error getting practice questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/{question_id}",
    summary="Get question by ID",
    description="Get a single question by its ID",
    response_model=QuestionResponse
)
async def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    """Get a question by ID"""
    question = QuestionService.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post(
    "/search",
    summary="Search questions",
    description="Search questions with filters"
)
async def search_questions(
    filters: QuestionFilter,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Search questions with filters"""
    questions = QuestionService.get_questions(
        db=db, 
        skip=skip, 
        limit=limit,
        filters=filters
    )
    return {
        "total": len(questions),
        "questions": [q.to_dict() for q in questions]
    }