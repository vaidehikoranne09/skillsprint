# app/models/__init__.py
from app.models.user import User

# This allows importing models directly from app.models
__all__ = ["User"]