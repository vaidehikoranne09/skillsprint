# app/utils/password_handler.py
from passlib.context import CryptContext
from typing import Optional

# Create password context for bcrypt hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class PasswordHandler:
    """
    Handles password hashing and verification using bcrypt
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password using bcrypt
        
        Args:
            password (str): Plain text password
            
        Returns:
            str: Hashed password
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain text password against a hashed password
        
        Args:
            plain_password (str): Plain text password to verify
            hashed_password (str): Hashed password to compare against
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def is_password_strong(password: str) -> bool:
        """
        Check if password meets strength requirements
        
        Args:
            password (str): Password to check
            
        Returns:
            bool: True if password is strong enough, False otherwise
        """
        # At least 8 characters
        if len(password) < 8:
            return False
        
        # At least one uppercase letter
        if not any(c.isupper() for c in password):
            return False
        
        # At least one lowercase letter
        if not any(c.islower() for c in password):
            return False
        
        # At least one digit
        if not any(c.isdigit() for c in password):
            return False
        
        # At least one special character
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~"
        if not any(c in special_chars for c in password):
            return False
        
        return True