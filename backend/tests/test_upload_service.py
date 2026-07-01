import io
from unittest.mock import AsyncMock

import pytest
from fastapi import UploadFile

from app.schemas.upload import UploadResult
from app.services.upload_service import UploadService


@pytest.mark.asyncio
async def test_process_upload_success():
    """Verify the orchestrator validates, formats the path, and uploads."""

    # 1. Create fake dependencies
    mock_storage = AsyncMock()
    mock_storage.upload_file.return_value = (
        "https://fake-supabase.com/portfolio-media/test/123-safe-name.png"
    )

    mock_validator = AsyncMock()
    # .validate() returns nothing on success, so AsyncMock handles it perfectly

    # 2. Initialize the service with the fakes
    service = UploadService(storage_service=mock_storage, validator=mock_validator)

    # 3. Create a simulated file with spaces in the name
    fake_file = io.BytesIO(b"fake image data")
    upload_file = UploadFile(
        filename="My Cool Image.png", file=fake_file, headers={"content-type": "image/png"}
    )

    # 4. Execute
    result = await service.process_upload(upload_file, folder="test")

    # 5. Assertions
    # Did it return the correct Pydantic model?
    assert isinstance(result, UploadResult)
    assert result.url == "https://fake-supabase.com/portfolio-media/test/123-safe-name.png"
    assert result.content_type == "image/png"

    # Did it sanitize the filename in the path?
    assert "My Cool Image" not in result.path
    assert "my-cool-image" in result.path
    assert result.path.startswith("test/")

    # Did it actually call our dependencies?
    mock_validator.validate.assert_called_once_with(upload_file)
    mock_storage.upload_file.assert_called_once()
