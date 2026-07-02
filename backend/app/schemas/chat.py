from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.chat_message import MessageRole

# --- Requests (Data coming IN from the frontend) ---

class VisitorCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class ThreadCreate(BaseModel):
    visitor_id: UUID
    title: str = "New Conversation"

# --- Responses (Data going OUT to the frontend) ---

class VisitorResponse(BaseModel):
    id: UUID
    name: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime
    last_active_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ThreadResponse(BaseModel):
    id: UUID
    visitor_id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    id: UUID
    thread_id: UUID
    role: MessageRole
    content: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)