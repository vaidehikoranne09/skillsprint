# app/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional

class SignupRequest(BaseModel):
    """
    Request schema for user registration
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "SecurePass123!"
            }
        }
    )
    
    name: str = Field(..., min_length=2, max_length=100, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=100,
        description="Password must be at least 8 characters long"
    )

class LoginRequest(BaseModel):
    """
    Request schema for user login
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "john@example.com",
                "password": "SecurePass123!"
            }
        }
    )
    
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class TokenResponse(BaseModel):
    """
    Response schema for successful authentication
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com"
                }
            }
        }
    )
    
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: dict = Field(..., description="User information")

class LogoutResponse(BaseModel):
    """
    Response schema for logout
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Successfully logged out"
            }
        }
    )
    
    success: bool = Field(..., description="Indicates if logout was successful")
    message: str = Field(..., description="Logout message")