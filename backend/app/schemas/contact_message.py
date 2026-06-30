from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class ContactMessageBase(BaseModel):
    sender_name: str
    sender_email: EmailStr
    subject: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageUpdate(BaseModel):
    sender_name: Optional[str] = None
    sender_email: Optional[EmailStr] = None
    subject: Optional[str] = None
    message: Optional[str] = None

class ContactMessageRead(ContactMessageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)