import uuid
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class RealtimeSessionAnswer:
    provider_session_id: str | None
    sdp: str
    model: str
    voice: str


class RealtimeVoiceProvider(Protocol):
    provider_name: str

    async def create_session(
        self,
        *,
        offer_sdp: str,
        visitor_id: uuid.UUID,
        voice_session_id: uuid.UUID,
    ) -> RealtimeSessionAnswer:
        """Create a provider-backed realtime voice session from a browser SDP offer."""

    async def close_session(self, provider_session_id: str | None) -> None:
        """Close the provider-backed realtime voice session when the app session ends."""
