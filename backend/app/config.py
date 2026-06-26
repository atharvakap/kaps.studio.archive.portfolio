from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "kaps.studio.archive Portfolio Project"
    app_version: str = "0.1.0"
    debug: bool = True

    database_url: str | None=None

    openai_api_key: str | None=None

    supabase_url: str | None=None
    supabase_anon_key: str | None=None
    supabase_service_role_key: str | None=None


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
