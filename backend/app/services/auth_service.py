from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User
from app.schemas.auth import SignupRequest, LoginRequest
from app.utils.password_handler import PasswordHandler
from app.utils.jwt_handler import JWTHandler
from app.utils.validators import Validators

class AuthService:
    @staticmethod
    def signup(db: Session, request: SignupRequest):
        # Validate input
        is_valid, error = Validators.validate_name(request.name)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        
        # Check if user exists
        existing = db.query(User).filter(User.email == request.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed = PasswordHandler.hash_password(request.password)
        
        # Create user
        user = User(
            name=request.name.strip(),
            email=request.email.lower(),
            password_hash=hashed
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return {"id": user.id, "email": user.email, "name": user.name}
    
    @staticmethod
    def login(db: Session, request: LoginRequest):
        # Find user
        user = db.query(User).filter(User.email == request.email.lower()).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not PasswordHandler.verify_password(request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate token
        token = JWTHandler.create_access_token({"sub": str(user.id)})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user.to_dict()
        }