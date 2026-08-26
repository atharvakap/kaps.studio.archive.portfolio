import asyncio
import uuid
from collections.abc import AsyncGenerator, Callable
from typing import Any

from app.voice.errors import VoiceSessionError
from app.voice.instrumentation import log_voice_error, log_voice_event
from app.voice.providers.base import RealtimeSessionAnswer, RealtimeVoiceProvider
from app.voice.types import VoiceSession, VoiceSessionState, VoiceTurn, VoiceTurnState

AssistantStreamFactory = Callable[..., AsyncGenerator[str, None]]

VOICE_CLIENT_EVENT_NAMES = {
    "data_channel_open",
    "first_audio",
    "microphone_muted",
    "microphone_ready",
    "microphone_unmuted",
    "playback_completed",
    "playback_started",
    "playback_stopped",
    "provider_response_created",
    "session_connected",
    "session_ended",
    "speech_ended",
    "speech_started",
    "transcription_completed",
    "transcription_started",
    "tts_completed",
    "tts_output_item_added",
    "tts_started",
    "voice_error",
}

MARK_ONCE_EVENT_NAMES = {
    "first_audio",
    "first_response_token",
    "interruption_started",
    "playback_started",
    "playback_stopped",
    "retrieval_started",
    "speech_ended",
    "speech_started",
    "transcription_completed",
    "transcription_started",
    "tts_started",
}


class VoiceOrchestrator:
    def __init__(self, provider: RealtimeVoiceProvider):
        self.provider = provider
        self._sessions: dict[uuid.UUID, VoiceSession] = {}

    async def create_session(
        self,
        *,
        visitor_id: uuid.UUID,
        thread_id: uuid.UUID,
        offer_sdp: str,
    ) -> tuple[VoiceSession, RealtimeSessionAnswer]:
        voice_session = VoiceSession(
            visitor_id=visitor_id,
            thread_id=thread_id,
            provider=self.provider.provider_name,
        )
        voice_session.timeline.mark("session_started")
        voice_session.state = VoiceSessionState.CONNECTING
        self._sessions[voice_session.id] = voice_session

        log_voice_event(
            "session_started",
            session_id=voice_session.id,
            thread_id=str(thread_id),
            visitor_id=str(visitor_id),
            provider=self.provider.provider_name,
        )

        try:
            answer = await self.provider.create_session(
                offer_sdp=offer_sdp,
                visitor_id=visitor_id,
                voice_session_id=voice_session.id,
            )
        except Exception as exc:
            voice_session.state = VoiceSessionState.ERROR
            log_voice_error(
                "session_failed",
                session_id=voice_session.id,
                error=str(exc),
                category="provider",
                code=getattr(exc, "code", "provider_error"),
            )
            self._sessions.pop(voice_session.id, None)
            raise

        voice_session.provider_session_id = answer.provider_session_id
        voice_session.timeline.mark("provider_session_created")
        voice_session.state = VoiceSessionState.CONNECTING

        log_voice_event(
            "provider_session_created",
            session_id=voice_session.id,
            provider_session_id=answer.provider_session_id,
            model=answer.model,
            voice=answer.voice,
        )

        return voice_session, answer

    def get_session(self, session_id: uuid.UUID) -> VoiceSession:
        voice_session = self._sessions.get(session_id)
        if not voice_session:
            raise VoiceSessionError(
                code="voice_session_not_found",
                user_message="Voice mode has expired. Please start voice mode again.",
                status_code=404,
            )
        return voice_session

    def record_client_event(
        self,
        *,
        session_id: uuid.UUID,
        event_name: str,
        turn_id: uuid.UUID | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        if event_name not in VOICE_CLIENT_EVENT_NAMES:
            raise VoiceSessionError(
                code="invalid_voice_event",
                user_message="Voice mode received an unsupported event.",
                status_code=422,
            )

        voice_session = self.get_session(session_id)
        turn = voice_session.turns.get(turn_id) if turn_id else None

        self._mark_timeline(voice_session, event_name)
        self._sync_session_state(voice_session, event_name)

        if turn:
            self._mark_timeline(turn, event_name)
            self._sync_turn_state(turn, event_name)

        log_voice_event(
            event_name,
            session_id=session_id,
            turn_id=turn_id,
            metadata=metadata or {},
            session_state=voice_session.state.value,
            turn_state=turn.state.value if turn else None,
        )

    def interrupt_turn(
        self,
        *,
        session_id: uuid.UUID,
        turn_id: uuid.UUID | None = None,
        reason: str = "barge_in",
    ) -> None:
        voice_session = self.get_session(session_id)
        resolved_turn_id = turn_id or voice_session.current_turn_id
        turn = voice_session.turns.get(resolved_turn_id) if resolved_turn_id else None

        voice_session.state = VoiceSessionState.INTERRUPTED
        voice_session.timeline.mark_once("interruption_started")

        if turn:
            turn.state = VoiceTurnState.INTERRUPTED
            turn.timeline.mark_once("interruption_started")

        log_voice_event(
            "interruption_started",
            session_id=session_id,
            turn_id=resolved_turn_id,
            reason=reason,
        )

    def begin_turn(
        self,
        *,
        session_id: uuid.UUID,
        thread_id: uuid.UUID,
        transcript: str,
        provider_item_id: str | None,
    ) -> VoiceTurn:
        voice_session = self.get_session(session_id)
        if voice_session.thread_id != thread_id:
            raise VoiceSessionError(
                code="voice_thread_mismatch",
                user_message="Voice mode is not attached to this conversation.",
                status_code=403,
            )

        normalized_transcript = transcript.strip()
        if not normalized_transcript:
            raise VoiceSessionError(
                code="empty_transcript",
                user_message="I did not catch that. Please try again.",
                status_code=422,
            )

        turn = VoiceTurn(
            session_id=session_id,
            thread_id=thread_id,
            transcript=normalized_transcript,
            provider_item_id=provider_item_id,
        )
        turn.timeline.mark_once("transcription_completed")
        voice_session.timeline.mark_once("transcription_completed")
        voice_session.turns[turn.id] = turn
        voice_session.current_turn_id = turn.id
        voice_session.state = VoiceSessionState.PROCESSING

        log_voice_event(
            "turn_started",
            session_id=session_id,
            turn_id=turn.id,
            provider_item_id=provider_item_id,
            transcript_length=len(normalized_transcript),
        )

        return turn

    async def process_turn_stream(
        self,
        *,
        session_id: uuid.UUID,
        turn_id: uuid.UUID,
        db_session: Any,
        assistant_streamer: AssistantStreamFactory,
    ) -> AsyncGenerator[str, None]:
        voice_session = self.get_session(session_id)
        turn = voice_session.turns.get(turn_id)
        if not turn:
            raise VoiceSessionError(
                code="voice_turn_not_found",
                user_message="Voice mode could not find the current turn.",
                status_code=404,
            )

        if turn.state == VoiceTurnState.INTERRUPTED:
            return

        user_metadata = {
            "modality": "voice",
            "voice_session_id": str(session_id),
            "voice_turn_id": str(turn.id),
            "provider": voice_session.provider,
            "provider_item_id": turn.provider_item_id,
        }
        assistant_metadata = {
            "modality": "voice",
            "voice_session_id": str(session_id),
            "voice_turn_id": str(turn.id),
            "provider": voice_session.provider,
        }

        def on_lifecycle_event(event_name: str, payload: dict[str, Any] | None = None) -> None:
            self._mark_timeline(turn, event_name)
            self._mark_timeline(voice_session, event_name)
            self._sync_turn_state(turn, event_name)
            self._sync_session_state(voice_session, event_name)
            log_voice_event(
                event_name,
                session_id=session_id,
                turn_id=turn.id,
                metadata=payload or {},
                turn_state=turn.state.value,
                session_state=voice_session.state.value,
            )

        try:
            async for chunk in assistant_streamer(
                query=turn.transcript,
                thread_id=turn.thread_id,
                session=db_session,
                user_message_type="voice",
                assistant_message_type="voice",
                user_metadata=user_metadata,
                assistant_metadata=assistant_metadata,
                on_lifecycle_event=on_lifecycle_event,
            ):
                if chunk:
                    yield chunk

            turn.state = VoiceTurnState.COMPLETED
            turn.timeline.mark("turn_completed")
            voice_session.timeline.mark("turn_completed")
            voice_session.state = VoiceSessionState.LISTENING
            log_voice_event(
                "turn_completed",
                session_id=session_id,
                turn_id=turn.id,
                latency_marks=turn.timeline.snapshot(),
                latency_metrics=turn.timeline.durations_ms(),
            )
        except asyncio.CancelledError:
            turn.state = VoiceTurnState.INTERRUPTED
            turn.timeline.mark_once("interruption_started")
            voice_session.timeline.mark_once("interruption_started")
            voice_session.state = VoiceSessionState.INTERRUPTED
            log_voice_event(
                "turn_interrupted",
                session_id=session_id,
                turn_id=turn.id,
                latency_marks=turn.timeline.snapshot(),
                latency_metrics=turn.timeline.durations_ms(),
            )
            raise
        except Exception as exc:
            turn.state = VoiceTurnState.FAILED
            turn.timeline.mark("turn_failed")
            voice_session.timeline.mark("turn_failed")
            voice_session.state = VoiceSessionState.ERROR
            log_voice_error(
                "turn_failed",
                session_id=session_id,
                turn_id=turn.id,
                error=str(exc),
                category="virtual_me",
                code=getattr(exc, "code", "turn_processing_failed"),
            )
            raise

    async def close_session(self, session_id: uuid.UUID) -> VoiceSession:
        voice_session = self.get_session(session_id)

        try:
            await self.provider.close_session(voice_session.provider_session_id)
        except Exception as exc:
            log_voice_error(
                "provider_session_close_failed",
                session_id=session_id,
                error=str(exc),
                category="provider",
                code=getattr(exc, "code", "provider_close_failed"),
            )

        voice_session.state = VoiceSessionState.DISCONNECTED
        voice_session.timeline.mark("session_ended")

        log_voice_event(
            "session_ended",
            session_id=session_id,
            latency_marks=voice_session.timeline.snapshot(),
            latency_metrics=voice_session.timeline.durations_ms(),
        )
        return self._sessions.pop(session_id)

    @staticmethod
    def _mark_timeline(target: VoiceSession | VoiceTurn, event_name: str) -> None:
        if event_name in MARK_ONCE_EVENT_NAMES:
            target.timeline.mark_once(event_name)
        else:
            target.timeline.mark(event_name)

    @staticmethod
    def _sync_turn_state(turn: VoiceTurn, event_name: str) -> None:
        if event_name == "retrieval_started":
            turn.state = VoiceTurnState.RETRIEVING
        elif event_name in {"generation_started", "first_response_token"}:
            turn.state = VoiceTurnState.GENERATING
        elif event_name in {"tts_started", "first_audio", "playback_started"}:
            turn.state = VoiceTurnState.SPEAKING

    @staticmethod
    def _sync_session_state(voice_session: VoiceSession, event_name: str) -> None:
        if event_name in {"session_connected", "data_channel_open"}:
            voice_session.state = VoiceSessionState.CONNECTED
        elif event_name in {"microphone_ready", "speech_started"}:
            voice_session.state = VoiceSessionState.LISTENING
        elif event_name in {
            "speech_ended",
            "transcription_started",
            "transcription_completed",
            "retrieval_started",
            "retrieval_completed",
            "generation_started",
            "generation_completed",
        }:
            voice_session.state = VoiceSessionState.PROCESSING
        elif event_name in {"tts_started", "first_audio", "playback_started"}:
            voice_session.state = VoiceSessionState.SPEAKING
        elif event_name == "playback_stopped":
            voice_session.state = VoiceSessionState.INTERRUPTED
