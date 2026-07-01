import re
from typing import Any

from app.logging import logger


class SemanticChunker:
    """
    Slices Markdown content into semantic chunks based on structural boundaries
    (headings, paragraphs) rather than arbitrary character counts.
    """

    def __init__(self, max_chunk_size: int = 1500, min_chunk_size: int = 100):
        self.max_chunk_size = max_chunk_size
        self.min_chunk_size = min_chunk_size

    async def chunk(self, content: str) -> list[dict[str, Any]]:
        logger.info("chunking_started", content_length=len(content))

        # Split by double newlines to isolate logical blocks (paragraphs, lists, headings)
        blocks = content.split("\n\n")

        chunks = []
        current_chunk_text = ""
        current_heading = "Introduction"
        chunk_index = 0

        for block in blocks:
            block = block.strip()
            if not block:
                continue

            # Detect Markdown headings (## H2, ### H3, etc.)
            heading_match = re.match(r"^(#{1,6})\s+(.*)", block)
            is_heading = bool(heading_match)

            if is_heading:
                # If we encounter a new heading and the current chunk has decent content,
                # seal the current chunk so the new section starts fresh.
                if len(current_chunk_text) >= self.min_chunk_size:
                    chunks.append(
                        {
                            "content": current_chunk_text.strip(),
                            "chunk_index": chunk_index,
                            "metadata": {"section": current_heading},
                        }
                    )
                    chunk_index += 1
                    current_chunk_text = ""

                current_heading = heading_match.group(2).strip()

            # Append the current block to our running chunk
            if current_chunk_text:
                current_chunk_text += "\n\n" + block
            else:
                current_chunk_text = block

            # If the chunk has grown too large, seal it (even if we haven't hit a new heading)
            if len(current_chunk_text) >= self.max_chunk_size and not is_heading:
                chunks.append(
                    {
                        "content": current_chunk_text.strip(),
                        "chunk_index": chunk_index,
                        "metadata": {"section": current_heading},
                    }
                )
                chunk_index += 1
                current_chunk_text = ""

        # Catch any remaining text sitting in the buffer at the end of the document
        if current_chunk_text:
            chunks.append(
                {
                    "content": current_chunk_text.strip(),
                    "chunk_index": chunk_index,
                    "metadata": {"section": current_heading},
                }
            )

        logger.info("chunking_completed", total_chunks=len(chunks))
        return chunks


# Create a singleton instance
semantic_chunker = SemanticChunker()


# The wrapper function our IngestionPipeline expects
async def chunk_document(content: str) -> list[dict[str, Any]]:
    return await semantic_chunker.chunk(content)
