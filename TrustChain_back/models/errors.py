from enum import Enum
from typing import Dict, Any

class ErrorCode(Enum):
    INVALID_CREDENTIALS = (1000, "Invalid username or password")
    TOKEN_EXPIRED = (1001, "Authentication token has expired")
    INVALID_TOKEN = (1002, "Invalid authentication token")
    UNAUTHORIZED = (1003, "Unauthorized access")
    
    USER_NOT_FOUND = (1100, "User not found")
    USER_ALREADY_EXISTS = (1101, "User with this email already exists")
    INVALID_USER_ID = (1102, "Invalid user ID format")
    INVALID_EMAIL_FORMAT = (1103, "Invalid email format")
    WEAK_PASSWORD = (1104, "Password does not meet security requirements")
    
    DATABASE_CONNECTION_ERROR = (1200, "Unable to connect to database")
    DATABASE_QUERY_ERROR = (1201, "Database query failed")
    DUPLICATE_KEY_ERROR = (1202, "Duplicate key violation")
    
    INVALID_INPUT = (1300, "Invalid input data")
    MISSING_REQUIRED_FIELD = (1301, "Required field is missing")
    INVALID_DATA_FORMAT = (1302, "Invalid data format")
    
    INVALID_REQUEST = (1400, "Invalid request")
    RATE_LIMIT_EXCEEDED = (1401, "Rate limit exceeded")
    INVALID_API_VERSION = (1402, "Invalid API version")
    
    INTERNAL_SERVER_ERROR = (1500, "Internal server error")
    SERVICE_UNAVAILABLE = (1501, "Service temporarily unavailable")
    
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message

class APIError(Exception):
    def __init__(
        self,
        error_code: ErrorCode,
        detail: str = None,
        status_code: int = None,
        extra: Dict[str, Any] = None
    ):
        self.error_code = error_code
        self.detail = detail or error_code.message
        self.status_code = status_code
        self.extra = extra or {}
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": {
                "code": self.error_code.code,
                "message": self.error_code.message,
                "detail": self.detail,
                **self.extra
            }
        }

# HTTP Status code mapping
ERROR_STATUS_CODES = {
    # Authentication errors
    ErrorCode.INVALID_CREDENTIALS: 401,
    ErrorCode.TOKEN_EXPIRED: 401,
    ErrorCode.INVALID_TOKEN: 401,
    ErrorCode.UNAUTHORIZED: 403,
    
    # User errors
    ErrorCode.USER_NOT_FOUND: 404,
    ErrorCode.USER_ALREADY_EXISTS: 409,
    ErrorCode.INVALID_USER_ID: 400,
    ErrorCode.INVALID_EMAIL_FORMAT: 400,
    ErrorCode.WEAK_PASSWORD: 400,
    
    # Database errors
    ErrorCode.DATABASE_CONNECTION_ERROR: 503,
    ErrorCode.DATABASE_QUERY_ERROR: 500,
    ErrorCode.DUPLICATE_KEY_ERROR: 409,
    
    # Validation errors
    ErrorCode.INVALID_INPUT: 400,
    ErrorCode.MISSING_REQUIRED_FIELD: 400,
    ErrorCode.INVALID_DATA_FORMAT: 400,
    
    # Request errors
    ErrorCode.INVALID_REQUEST: 400,
    ErrorCode.RATE_LIMIT_EXCEEDED: 429,
    ErrorCode.INVALID_API_VERSION: 400,
    
    # Server errors
    ErrorCode.INTERNAL_SERVER_ERROR: 500,
    ErrorCode.SERVICE_UNAVAILABLE: 503,
}