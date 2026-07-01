from typing import Any

from pydantic import BaseModel


class ParsedDocument(BaseModel):
    """The normalized shape of all documents entering the knowledge base."""

    title: str
    content: str
    source_type: str
    metadata: dict[str, Any]


class DocumentParser:
    """
    Abstract interface for document parsers.
    The rest of the application should only depend on this interface,
    never the underlying library.
    """

    async def parse(self, raw_content: str, source_type: str, title: str) -> ParsedDocument:
        raise NotImplementedError("Subclasses must implement the parse method")
