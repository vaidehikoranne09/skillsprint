# app/utils/jwt_handler.py
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt

from app.config import settings

class JWTHandler:
    """
    Handles JWT token creation and verification
    """
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a new JWT access token
        
        Args:
            data (Dict[str, Any]): Data to encode in the token
            expires_delta (Optional[timedelta]): Custom expiration time
            
        Returns:
            str: JWT token string
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token
        
        Args:
            token (str): JWT token to verify
            
        Returns:
            Optional[Dict[str, Any]]: Decoded token payload if valid, None otherwise
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def get_user_id_from_token(token: str) -> Optional[int]:
        """
        Extract user ID from JWT token
        
        Args:
            token (str): JWT token
            
        Returns:
            Optional[int]: User ID if found, None otherwise
        """
        payload = JWTHandler.verify_token(token)
        if payload:
            user_id = payload.get("sub")
            if user_id:
                try:
                    return int(user_id)
                except (ValueError, TypeError):
                    return None
        return None
    
    @staticmethod
    def get_token_expiry(token: str) -> Optional[datetime]:
        """
        Get token expiration time
        
        Args:
            token (str): JWT token
            
        Returns:
            Optional[datetime]: Expiration time if found, None otherwise
        """
        payload = JWTHandler.verify_token(token)
        if payload:
            exp = payload.get("exp")
            if exp:
                return datetime.fromtimestamp(exp, tz=timezone.utc)
        return None
    
    @staticmethod
    def is_token_expired(token: str) -> bool:
        """
        Check if a token has expired
        
        Args:
            token (str): JWT token
            
        Returns:
            bool: True if expired, False otherwise
        """
        expiry = JWTHandler.get_token_expiry(token)
        if expiry:
            return datetime.now(timezone.utc) > expiry
        return True