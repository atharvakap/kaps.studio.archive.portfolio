from functools import lru_cache
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "kaps.studio.archive Portfolio Project"
    app_version: str = "0.1.0"
    debug: bool = True

    database_url: str | None = None

    openai_api_key: str | None = None

    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None
    SUPABASE_STORAGE_BUCKET: str = "portfolio-media"

    max_upload_size_mb: int = 5
    allowed_mime_types: list[str] = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("database_url", mode="after")
    @classmethod
    def normalize_database_url(cls, v: str | None) -> str | None:
        """
        Normalizes Supabase connection strings for SQLAlchemy + psycopg v3.
        - Forces the 'postgresql+psycopg' scheme.
        - Strips 'hostaddr' to prevent SNI routing failures (ENOTFOUND).
        """
        if not v:
            return v

        # 1. Parse the raw URL
        parsed = urlparse(v)

        # 2. Force the correct async psycopg3 scheme
        scheme = parsed.scheme
        if scheme.startswith("postgres"):
            scheme = "postgresql+psycopg"

        # 3. Clean up the query parameters (strip hostaddr)
        query_params = parse_qs(parsed.query)
        if "hostaddr" in query_params:
            del query_params["hostaddr"]

        # 4. Rebuild the query string
        new_query = urlencode(query_params, doseq=True)

        # 5. Rebuild and return the pristine URL
        normalized_url = urlunparse(
            (scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment)
        )

        return normalized_url


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
