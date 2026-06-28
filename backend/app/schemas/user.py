# app/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class UserResponse(BaseModel):
    """
    Response schema for user data
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "is_active": True,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
    )
    
    id: int = Field(..., description="User ID")
    name: str = Field(..., description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    is_active: bool = Field(..., description="Whether user account is active")
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

class UserCreate(BaseModel):
    """
    Schema for creating a new user (internal use)
    """
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    password_hash: str = Field(...)

class UserUpdate(BaseModel):
    """
    Schema for updating user information
    """
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None