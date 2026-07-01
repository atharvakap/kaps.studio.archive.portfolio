import asyncio
import os
import tempfile

from docling.document_converter import DocumentConverter

from app.ingestion.parser import DocumentParser, ParsedDocument
from app.logging import logger


class DoclingParser(DocumentParser):
    """
    Docling-powered implementation of the DocumentParser.
    Extracts high-quality structural text from PDFs, Markdown, DOCX, etc.
    """

    def __init__(self):
        # Initialize the heavy Docling converter once
        self.converter = DocumentConverter()
        self.supported_formats = ["markdown", "pdf", "text", "resume", "json"]

    async def parse(self, raw_content: str, source_type: str, title: str) -> ParsedDocument:
        logger.info("docling_parsing_started", source_type=source_type, title=title)

        if source_type.lower() not in self.supported_formats:
            logger.error("unsupported_document_format", format=source_type)
            raise ValueError(
                f"Unsupported document format: '{source_type}'. Allowed: {self.supported_formats}"
            )

        # Determine if raw_content is already a file path, or raw text string
        is_existing_file = os.path.exists(raw_content) if len(raw_content) < 2048 else False

        file_to_parse = raw_content
        temp_file_path = None

        try:
            if not is_existing_file:
                # If it's raw text, write it to a temporary file for Docling to consume
                suffix = f".{source_type}" if source_type != "resume" else ".md"
                fd, temp_file_path = tempfile.mkstemp(suffix=suffix)
                with os.fdopen(fd, "w", encoding="utf-8") as f:
                    f.write(raw_content)
                file_to_parse = temp_file_path

            # Docling is synchronous and heavy, so we run it in an
            # async threadpool to not block FastAPI
            docling_result = await asyncio.to_thread(self.converter.convert, file_to_parse)

            # Export to clean Markdown (this preserves headings and lists
            # beautifully for chunking later!)
            exported_text = docling_result.document.export_to_markdown()

            logger.info("docling_parsing_completed", title=title, content_length=len(exported_text))

            return ParsedDocument(
                title=title,
                content=exported_text,
                source_type=source_type,
                metadata={"parser": "docling", "original_length": len(exported_text)},
            )

        except Exception as e:
            logger.error("docling_parsing_failed", error=str(e), title=title)
            raise ValueError(f"Docling failed to parse document: {str(e)}")

        finally:
            # Clean up the temp file if we created one
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)


# Create a singleton instance to be used by the pipeline
docling_parser = DoclingParser()
