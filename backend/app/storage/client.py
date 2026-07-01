from supabase import Client, create_client

from app.config import settings
from app.logging import logger


def get_supabase_client() -> Client:
    """
    Initializes and returns a Supabase client using the Service Role Key.
    This client has admin privileges and should only be used by the backend.
    """
    if not settings.supabase_url or not settings.supabase_service_role_key:
        logger.error(
            "supabase_client_initialization_failed", reason="Missing credentials in environment"
        )
        raise ValueError("Supabase URL and Service Role Key must be configured.")

    try:
        client = create_client(
            supabase_url=settings.supabase_url, supabase_key=settings.supabase_service_role_key
        )
        logger.info("supabase_client_initialized", bucket=settings.SUPABASE_STORAGE_BUCKET)
        return client
    except Exception as e:
        logger.error("supabase_client_initialization_failed", error=str(e))
        raise


supabase: Client = get_supabase_client()
