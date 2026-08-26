from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.voice.types import VoiceSessionState


class VoiceSessionCreate(BaseModel):
    visitor_id: UUID
    thread_id: UUID
    sdp: str = Field(min_length=1)


class VoiceSessionResponse(BaseModel):
    id: UUID
    provider: str
    provider_session_id: str | None = None
    state: VoiceSessionState
    sdp: str
    model: str
    voice: str


class VoiceTurnCreate(BaseModel):
    thread_id: UUID
    transcript: str = Field(min_length=1)
    provider_item_id: str | None = None


class VoiceClientEventCreate(BaseModel):
    event_name: str = Field(min_length=1)
    turn_id: UUID | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class VoiceInterruptCreate(BaseModel):
    turn_id: UUID | None = None
    reason: str = "barge_in"


class VoiceSessionClosedResponse(BaseModel):
    id: UUID
    state: VoiceSessionState

