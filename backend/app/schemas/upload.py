from pydantic import BaseModel


class UploadResult(BaseModel):
    url: str
    path: str
    content_type: str
    filename: str
