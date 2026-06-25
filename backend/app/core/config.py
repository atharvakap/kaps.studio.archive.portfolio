from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application Settings.

    Every environment variable used by the backend should be defined here
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ---- Application ------------------------
    app_name: str = "kaps.studio.archive Portfolio Backend"
    app_version: str = "0.1.0"
    environment: str = Field(default="development")
    debug: bool = True


@lru_cache
def get_settings() -> Settings:
    """
    Returns a chached Settings instance
    """
    return Settings()

settings = get_settings()