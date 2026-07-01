from app.config import settings
from app.logging import logger
from app.storage.client import supabase


class StorageService:
    def __init__(self):
        self.bucket = settings.SUPABASE_STORAGE_BUCKET

    async def upload_file(self, path: str, file_bytes: bytes, content_type: str) -> str:
        """
        Purely handles the Supabase SDK upload interaction.
        """
        try:
            supabase.storage.from_(self.bucket).upload(
                path=path, file=file_bytes, file_options={"content-type": content_type}
            )
            public_url = supabase.storage.from_(self.bucket).get_public_url(path)

            logger.info("supabase_upload_success", path=path)
            return public_url
        except Exception as e:
            logger.error("supabase_upload_failed", error=str(e), path=path)
            raise ValueError(f"Storage upload failed: {str(e)}")

    async def delete_file(self, path: str) -> bool:
        """
        Purely handles the Supabase SDK delete interaction.
        """
        try:
            supabase.storage.from_(self.bucket).remove([path])
            logger.info("supabase_delete_success", path=path)
            return True
        except Exception as e:
            logger.error("supabase_delete_failed", error=str(e), path=path)
            return False

    async def get_public_url(self, path: str) -> str:
        """
        Generates a standard public URL for an asset (e.g., Project Images, Artwork).
        """
        try:
            public_url = supabase.storage.from_(self.bucket).get_public_url(path)
            return public_url
        except Exception as e:
            logger.error("public_url_generation_failed", error=str(e), path=path)
            raise ValueError(f"Could not generate public URL: {str(e)}")

    async def create_signed_url(self, path: str, expires_in: int = 3600) -> str:
        """
        Generates a temporary, expiring URL for an asset (e.g., Private Resumes).
        Default expiration is 3600 seconds (1 hour).
        """
        try:
            response = supabase.storage.from_(self.bucket).create_signed_url(path, expires_in)

            # The Supabase Python SDK can sometimes return a dict or a string
            # depending on the version.
            # This safely extracts the URL either way.
            signed_url = response.get("signedURL") if isinstance(response, dict) else response

            if not signed_url:
                raise ValueError("Signed URL generation returned None or empty.")

            return signed_url
        except Exception as e:
            logger.error("signed_url_generation_failed", error=str(e), path=path)
            raise ValueError(f"Could not generate signed URL: {str(e)}")
