from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class ContactMessageBase(BaseModel):
    # Added strict boundary rules
    sender_name: str = Field(..., min_length=2, max_length=100)
    sender_email: EmailStr
    subject: str = Field(..., min_length=2, max_length=150)
    message: str = Field(..., min_length=10, max_length=2000)

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageUpdate(BaseModel):
    sender_name: Optional[str] = Field(None, min_length=2, max_length=100)
    sender_email: Optional[EmailStr] = None
    subject: Optional[str] = Field(None, min_length=2, max_length=150)
    message: Optional[str] = Field(None, min_length=10, max_length=2000)

class ContactMessageRead(ContactMessageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)