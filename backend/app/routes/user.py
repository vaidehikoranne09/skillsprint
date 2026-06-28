from fastapi import APIRouter, Depends
from app.models import User
from app.dependencies import get_current_user
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get(
    "/me",
    summary="Get Current User",
    description="Get details of the currently authenticated user",
    response_model=UserResponse
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user.to_dict()