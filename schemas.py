from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class IssueCreate(BaseModel):
    description: str

class IssueResponse(BaseModel):
    id: int
    issue_description: str
    diagnosis: str
    follow_up_questions: Optional[str] = None
    solutions: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DiagnosticResponse(BaseModel):
    diagnosis: str
    confidence: float
    follow_up_questions: List[str]
    solutions: List[str]
    issue_type: str
