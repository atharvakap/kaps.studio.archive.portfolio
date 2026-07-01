import mimetypes
import uuid

from fastapi import UploadFile

from app.logging import logger
from app.schemas.upload import UploadResult
from app.storage.service import StorageService
from app.storage.validator import UploadValidator


class UploadService:
    def __init__(self, storage_service: StorageService, validator: UploadValidator):
        self.storage_service = storage_service
        self.validator = validator

    async def process_upload(self, file: UploadFile, folder: str = "general") -> UploadResult:
        """
        Orchestrates the file upload workflow.
        """
        # 1. VALIDATE FIRST (Raises exception if bad)
        await self.validator.validate(file)

        # 2. Generate deterministic storage path
        file_ext = mimetypes.guess_extension(file.content_type or "") or ""
        if not file_ext and file.filename:
            file_ext = "." + file.filename.split(".")[-1] if "." in file.filename else ""

        unique_id = uuid.uuid4().hex[:8]
        safe_filename = file.filename.replace(" ", "-").lower() if file.filename else "file"
        storage_path = f"{folder}/{unique_id}-{safe_filename}"

        # 3. Extract bytes and content type
        file_bytes = await file.read()
        content_type = file.content_type or "application/octet-stream"

        # 4. Call the StorageService
        public_url = await self.storage_service.upload_file(
            path=storage_path, file_bytes=file_bytes, content_type=content_type
        )

        logger.info("upload_workflow_completed", folder=folder, filename=safe_filename)

        # 5. Return clean application-level result
        return UploadResult(
            url=public_url,
            path=storage_path,
            content_type=content_type,
            filename=file.filename or safe_filename,
        )
