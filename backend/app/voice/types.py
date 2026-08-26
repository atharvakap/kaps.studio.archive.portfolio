import uuid
from dataclasses import dataclass, field
from enum import Enum
from time import perf_counter
from typing import Any

VOICE_LATENCY_PAIRS = {
    "stt_latency_ms": ("speech_ended", "transcription_completed"),
    "retrieval_latency_ms": ("retrieval_started", "retrieval_completed"),
    "llm_time_to_first_token_ms": ("generation_started", "first_response_token"),
    "generation_latency_ms": ("generation_started", "generation_completed"),
    "tts_time_to_first_audio_ms": ("tts_started", "first_audio"),
    "playback_startup_latency_ms": ("first_audio", "playback_started"),
    "end_to_end_perceived_latency_ms": ("speech_ended", "playback_started"),
    "interruption_latency_ms": ("interruption_started", "playback_stopped"),
}


class VoiceSessionState(str, Enum):
    CREATED = "created"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"
    INTERRUPTED = "interrupted"
    RECONNECTING = "reconnecting"
    ERROR = "error"
    DISCONNECTED = "disconnected"


class VoiceTurnState(str, Enum):
    IDLE = "idle"
    LISTENING = "listening"
    TRANSCRIBING = "transcribing"
    RETRIEVING = "retrieving"
    GENERATING = "generating"
    SPEAKING = "speaking"
    INTERRUPTED = "interrupted"
    COMPLETED = "completed"
    FAILED = "failed"


class VoiceErrorCategory(str, Enum):
    MICROPHONE = "microphone"
    WEBRTC = "webrtc"
    STT = "stt"
    VIRTUAL_ME = "virtual_me"
    TTS = "tts"
    PROVIDER = "provider"
    SESSION = "session"


@dataclass
class VoiceLatencyTimeline:
    marks: dict[str, float] = field(default_factory=dict)

    def mark(self, event_name: str) -> float:
        value = perf_counter()
        self.marks[event_name] = value
        return value

    def mark_once(self, event_name: str) -> float:
        existing = self.marks.get(event_name)
        if existing is not None:
            return existing
        return self.mark(event_name)

    def elapsed_ms(self, start_event: str, end_event: str) -> float | None:
        start = self.marks.get(start_event)
        end = self.marks.get(end_event)
        if start is None or end is None:
            return None
        return round((end - start) * 1000, 2)

    def snapshot(self) -> dict[str, float]:
        first_mark = min(self.marks.values(), default=0.0)
        return {
            name: round((value - first_mark) * 1000, 2)
            for name, value in self.marks.items()
        }

    def durations_ms(self) -> dict[str, float]:
        return {
            metric_name: elapsed
            for metric_name, (start_event, end_event) in VOICE_LATENCY_PAIRS.items()
            if (elapsed := self.elapsed_ms(start_event, end_event)) is not None
        }


@dataclass
class VoiceTurn:
    session_id: uuid.UUID
    thread_id: uuid.UUID
    transcript: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    provider_item_id: str | None = None
    state: VoiceTurnState = VoiceTurnState.TRANSCRIBING
    timeline: VoiceLatencyTimeline = field(default_factory=VoiceLatencyTimeline)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class VoiceSession:
    visitor_id: uuid.UUID
    thread_id: uuid.UUID
    provider: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    state: VoiceSessionState = VoiceSessionState.CREATED
    provider_session_id: str | None = None
    current_turn_id: uuid.UUID | None = None
    timeline: VoiceLatencyTimeline = field(default_factory=VoiceLatencyTimeline)
    turns: dict[uuid.UUID, VoiceTurn] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)
