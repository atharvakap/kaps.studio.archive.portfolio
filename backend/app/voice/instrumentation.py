import uuid
from typing import Any

from app.logging import logger


def log_voice_event(
    event_name: str,
    *,
    session_id: uuid.UUID | str | None = None,
    turn_id: uuid.UUID | str | None = None,
    **fields: Any,
) -> None:
    payload: dict[str, Any] = {"event": event_name, **fields}
    if session_id is not None:
        payload["voice_session_id"] = str(session_id)
    if turn_id is not None:
        payload["voice_turn_id"] = str(turn_id)

    logger.info("voice_lifecycle_event", **payload)


def log_voice_error(
    event_name: str,
    *,
    session_id: uuid.UUID | str | None = None,
    turn_id: uuid.UUID | str | None = None,
    error: str,
    category: str,
    code: str,
) -> None:
    log_voice_event(
        event_name,
        session_id=session_id,
        turn_id=turn_id,
        error=error,
        category=category,
        code=code,
    )

