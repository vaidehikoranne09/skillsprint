# app/utils/validators.py
import re
from typing import Optional, Tuple

class Validators:
    """
    Collection of validation utilities
    """
    
    @staticmethod
    def validate_email_format(email: str) -> bool:
        """
        Validate email format using regex
        
        Args:
            email (str): Email to validate
            
        Returns:
            bool: True if email is valid, False otherwise
        """
        if not email:
            return False
        
        # More flexible email regex pattern
        # This pattern allows:
        # - Local part: letters, numbers, dots, underscores, percent, plus, hyphen
        # - Domain part: letters, numbers, dots, hyphens
        # - TLD: at least 2 letters
        # - Does NOT allow consecutive dots in domain
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        try:
            email = email.strip()
            # Check if matches pattern
            if not re.match(pattern, email):
                return False
            
            # Additional check: no consecutive dots in domain part
            local_part, domain = email.split('@', 1)
            
            # Check for consecutive dots in domain
            if '..' in domain:
                return False
            
            # Check for consecutive dots in local part (allow but warn)
            # We'll allow it as some systems support it
            
            # Check domain parts length
            domain_parts = domain.split('.')
            for part in domain_parts:
                if len(part) == 0:
                    return False
                if len(part) > 63:  # Max domain label length
                    return False
            
            return True
        except Exception:
            return False
    
    @staticmethod
    def validate_email_normalize(email: str) -> Tuple[bool, Optional[str]]:
        """
        Validate and normalize email address
        
        Args:
            email (str): Email to validate
            
        Returns:
            Tuple[bool, Optional[str]]: (is_valid, normalized_email)
        """
        if not email:
            return False, None
        
        # Trim whitespace
        email = email.strip()
        
        # Validate format
        if not Validators.validate_email_format(email):
            return False, None
        
        # Normalize: lowercase domain part
        try:
            local_part, domain = email.split('@', 1)
            normalized_email = f"{local_part}@{domain.lower()}"
            return True, normalized_email
        except Exception:
            return True, email.lower()
    
    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, Optional[str]]:
        """
        Validate password strength
        
        Args:
            password (str): Password to validate
            
        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not password:
            return False, "Password is required"
            
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if len(password) > 100:
            return False, "Password must be less than 100 characters"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit"
        
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~"
        if not any(c in special_chars for c in password):
            return False, "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?/~)"
        
        return True, None
    
    @staticmethod
    def validate_name(name: str) -> Tuple[bool, Optional[str]]:
        """
        Validate user name
        
        Args:
            name (str): Name to validate
            
        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        if not name or len(name.strip()) == 0:
            return False, "Name is required"
        
        name = name.strip()
        
        if len(name) < 2:
            return False, "Name must be at least 2 characters long"
        
        if len(name) > 100:
            return False, "Name must be less than 100 characters"
        
        # Check if name contains only allowed characters
        if not re.match(r'^[a-zA-Z\s\-\.\']+$', name):
            return False, "Name contains invalid characters"
        
        return True, None
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """
        Sanitize input to prevent XSS and other attacks
        
        Args:
            text (str): Input text to sanitize
            
        Returns:
            str: Sanitized text
        """
        if not text:
            return ""
        
        # Convert to string if not already
        text = str(text)
        
        # Trim whitespace
        text = text.strip()
        
        # Remove any HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove any script tags
        text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        
        # Remove any javascript: protocol
        text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
        
        return text