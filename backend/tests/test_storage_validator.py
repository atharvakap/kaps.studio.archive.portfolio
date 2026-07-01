import pytest
import io
from fastapi import UploadFile
from app.storage.validator import UploadValidator
from app.exceptions import InvalidFileTypeError, FileTooLargeError

@pytest.mark.asyncio
async def test_validator_success():
    """Verify that a valid file passes without raising exceptions."""
    validator = UploadValidator()
    
    # Simulate a valid 10-byte PNG file
    fake_file = io.BytesIO(b"0123456789")
    upload_file = UploadFile(filename="test.png", file=fake_file, headers={"content-type": "image/png"})
    
    # If this raises an exception, the test will fail
    await validator.validate(upload_file)

@pytest.mark.asyncio
async def test_validator_invalid_type():
    """Verify that an unsupported MIME type is blocked."""
    validator = UploadValidator()
    
    # Simulate a potentially malicious executable
    fake_file = io.BytesIO(b"malicious payload")
    upload_file = UploadFile(filename="virus.exe", file=fake_file, headers={"content-type": "application/x-msdownload"})
    
    with pytest.raises(InvalidFileTypeError):
        await validator.validate(upload_file)

@pytest.mark.asyncio
async def test_validator_too_large():
    """Verify that a file exceeding the maximum size is blocked."""
    validator = UploadValidator()
    
    # Artificially lower the limit to 5 bytes for this specific test
    validator.max_size_bytes = 5 
    
    # Simulate a 10-byte file (which now exceeds our 5-byte test limit)
    fake_file = io.BytesIO(b"0123456789")
    upload_file = UploadFile(filename="large.png", file=fake_file, headers={"content-type": "image/png"})
    
    with pytest.raises(FileTooLargeError):
        await validator.validate(upload_file)