from app.voice.types import VoiceErrorCategory


class VoiceError(Exception):
    def __init__(
        self,
        category: VoiceErrorCategory,
        code: str,
        user_message: str,
        internal_message: str | None = None,
        status_code: int = 400,
    ):
        self.category = category
        self.code = code
        self.user_message = user_message
        self.internal_message = internal_message or user_message
        self.status_code = status_code
        super().__init__(self.internal_message)


class VoiceProviderError(VoiceError):
    def __init__(
        self,
        code: str,
        user_message: str = "Voice mode could not connect. Text chat is still available.",
        internal_message: str | None = None,
        status_code: int = 502,
    ):
        super().__init__(
            category=VoiceErrorCategory.PROVIDER,
            code=code,
            user_message=user_message,
            internal_message=internal_message,
            status_code=status_code,
        )


class VoiceSessionError(VoiceError):
    def __init__(
        self,
        code: str,
        user_message: str,
        internal_message: str | None = None,
        status_code: int = 400,
    ):
        super().__init__(
            category=VoiceErrorCategory.SESSION,
            code=code,
            user_message=user_message,
            internal_message=internal_message,
            status_code=status_code,
        )

