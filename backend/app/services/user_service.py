from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User

class UserService:
    @staticmethod
    def get_current_user(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user