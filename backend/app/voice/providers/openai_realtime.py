import hashlib
import json
import uuid

import httpx

from app.config import settings
from app.voice.errors import VoiceProviderError
from app.voice.providers.base import RealtimeSessionAnswer


class OpenAIRealtimeProvider:
    provider_name = "openai_realtime"

    def __init__(
        self,
        *,
        api_key: str | None,
        model: str,
        transcription_model: str,
        voice: str,
        endpoint: str,
        timeout_seconds: float,
    ):
        self.api_key = api_key
        self.model = model
        self.transcription_model = transcription_model
        self.voice = voice
        self.endpoint = endpoint.rstrip("/")
        self.timeout_seconds = timeout_seconds

    @classmethod
    def from_settings(cls) -> "OpenAIRealtimeProvider":
        return cls(
            api_key=settings.openai_api_key,
            model=settings.openai_realtime_model,
            transcription_model=settings.openai_realtime_transcription_model,
            voice=settings.openai_realtime_voice,
            endpoint=settings.openai_realtime_endpoint,
            timeout_seconds=settings.openai_realtime_timeout_seconds,
        )

    async def create_session(
        self,
        *,
        offer_sdp: str,
        visitor_id: uuid.UUID,
        voice_session_id: uuid.UUID,
    ) -> RealtimeSessionAnswer:
        if not self.api_key:
            raise VoiceProviderError(
                code="missing_openai_api_key",
                internal_message="OPENAI_API_KEY is required for OpenAI Realtime voice sessions.",
                status_code=503,
            )

        session_config = self._build_session_config()
        form = {
            "sdp": ("offer.sdp", offer_sdp, "application/sdp"),
            "session": (None, json.dumps(session_config), "application/json"),
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "OpenAI-Safety-Identifier": self._safety_identifier(visitor_id),
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(self.endpoint, headers=headers, files=form)
        except httpx.TimeoutException as exc:
            raise VoiceProviderError(
                code="openai_realtime_timeout",
                internal_message=str(exc),
                status_code=504,
            ) from exc
        except httpx.HTTPError as exc:
            raise VoiceProviderError(
                code="openai_realtime_connection_failed",
                internal_message=str(exc),
            ) from exc

        if response.status_code >= 400:
            raise VoiceProviderError(
                code="openai_realtime_session_rejected",
                internal_message=response.text,
                status_code=502,
            )

        location = response.headers.get("Location")
        provider_session_id = location.rstrip("/").split("/")[-1] if location else None

        return RealtimeSessionAnswer(
            provider_session_id=provider_session_id,
            sdp=response.text,
            model=self.model,
            voice=self.voice,
        )

    async def close_session(self, provider_session_id: str | None) -> None:
        if not provider_session_id or not self.api_key:
            return

        url = f"{self.endpoint}/{provider_session_id}/hangup"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "*/*",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(url, headers=headers)
        except httpx.TimeoutException as exc:
            raise VoiceProviderError(
                code="openai_realtime_hangup_timeout",
                internal_message=str(exc),
                status_code=504,
            ) from exc
        except httpx.HTTPError as exc:
            raise VoiceProviderError(
                code="openai_realtime_hangup_failed",
                internal_message=str(exc),
            ) from exc

        if response.status_code >= 400:
            raise VoiceProviderError(
                code="openai_realtime_hangup_rejected",
                internal_message=response.text,
                status_code=502,
            )

    def _build_session_config(self) -> dict:
        return {
            "type": "realtime",
            "model": self.model,
            "instructions": (
                "You are the realtime voice rendering layer for Virtual Me. "
                "Do not answer visitor questions from your own knowledge. "
                "Do not invent facts. Only transcribe visitor speech and, when the "
                "application asks you to speak, read the provided text exactly."
            ),
            "output_modalities": ["audio"],
            "tools": [],
            "tool_choice": "none",
            "parallel_tool_calls": False,
            "audio": {
                "input": {
                    "transcription": {"model": self.transcription_model},
                    "turn_detection": {
                        "type": "server_vad",
                        "threshold": 0.5,
                        "prefix_padding_ms": 300,
                        "silence_duration_ms": 500,
                        "create_response": False,
                        "interrupt_response": True,
                    },
                },
                "output": {
                    "voice": self.voice,
                },
            },
        }

    @staticmethod
    def _safety_identifier(visitor_id: uuid.UUID) -> str:
        return hashlib.sha256(str(visitor_id).encode("utf-8")).hexdigest()
