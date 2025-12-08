from enum import Enum
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field

class Language(str, Enum):
    JAVASCRIPT = "javascript"
    PYTHON = "python"

class Participant(BaseModel):
    id: str
    name: str
    avatar: Optional[str] = None
    isOnline: bool
    score: int = 0
    joinedAt: datetime

class SessionBase(BaseModel):
    code: str
    language: Language

class Session(SessionBase):
    id: UUID
    participants: List[Participant] = []
    createdAt: datetime

class CreateSessionRequest(SessionBase):
    pass

class JoinSessionRequest(BaseModel):
    name: str

class JoinSessionResponse(BaseModel):
    participant: Participant
    token: str

class CodeExecutionRequest(BaseModel):
    code: str
    language: Language

class CodeExecutionResult(BaseModel):
    success: bool = True
    output: str
    error: Optional[str] = None
    executionTime: float
