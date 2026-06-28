from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, LogoutResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/signup",
    summary="User Registration",
    description="Register a new user with email and password",
    response_model=dict,
    status_code=status.HTTP_201_CREATED
)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    return AuthService.signup(db, request)

@router.post(
    "/login",
    summary="User Login",
    description="Authenticate user and return JWT token",
    response_model=TokenResponse
)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return AuthService.login(db, request)

@router.post(
    "/logout",
    summary="User Logout",
    description="Logout user (client-side token discard)",
    response_model=LogoutResponse
)
def logout():
    # JWT is stateless, so logout is handled client-side
    return {"success": True, "message": "Successfully logged out"}