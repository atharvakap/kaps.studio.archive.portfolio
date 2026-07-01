from fastapi import UploadFile

from app.config import settings
from app.exceptions import FileTooLargeError, InvalidFileTypeError
from app.logging import logger


class UploadValidator:
    def __init__(self):
        # Convert MB to Bytes for accurate checking
        self.max_size_bytes = settings.max_upload_size_mb * 1024 * 1024
        self.allowed_types = settings.allowed_mime_types

    async def validate(self, file: UploadFile) -> None:
        """
        Validates the incoming file's MIME type and size.
        Raises domain exceptions if validation fails.
        """
        # 1. Validate MIME Type
        if file.content_type not in self.allowed_types:
            logger.warning("upload_rejected_invalid_type", content_type=file.content_type)
            raise InvalidFileTypeError(
                f"File type '{file.content_type}' is not allowed. Allowed types: {
                    ', '.join(self.allowed_types)
                }"
            )

        # 2. Validate Size
        # To get the real file size, we move the cursor to
        # the end of the file, read the byte position, and reset.
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)  # CRITICAL: Reset cursor so the UploadService can read it!

        if file_size > self.max_size_bytes:
            logger.warning("upload_rejected_too_large", size_bytes=file_size)
            raise FileTooLargeError(
                f"File size exceeds the maximum limit of {settings.max_upload_size_mb}MB."
            )
