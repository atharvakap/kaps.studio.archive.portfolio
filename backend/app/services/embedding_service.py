import uuid
from typing import Any

from pydantic import BaseModel
from sqlalchemy import select

from app.assistant.embeddings import generate_embedding
from app.database.session import AsyncSessionLocal
from app.logging import logger
from app.models.document_chunk import DocumentChunk


class EmbeddingResult(BaseModel):
    """The structured result of an embedding operation."""

    chunk_id: uuid.UUID
    embedding: list[float]
    metadata: dict[str, Any]


class EmbeddingService:
    """
    Orchestrates the generation of vector embeddings for document chunks
    and securely persists them back to the database.
    """

    async def process_chunks(self, force: bool = False) -> list[EmbeddingResult]:
        logger.info("embedding_pipeline_started", force_reembed=force)
        results = []

        try:
            async with AsyncSessionLocal() as session:
                if force:
                    # Grab EVERYTHING if we are forcing a refresh
                    stmt = select(DocumentChunk)
                else:
                    # Otherwise, just grab the chunks missing their embeddings
                    stmt = select(DocumentChunk).where(DocumentChunk.embedding.is_(None))

                db_chunks = (await session.execute(stmt)).scalars().all()

                logger.info("chunks_found_for_embedding", count=len(db_chunks))

                if not db_chunks:
                    return results

                # 2. Iterate over each eligible chunk
                for chunk in db_chunks:
                    try:
                        # 3. Call the dumb embedding client from Step 1
                        vector = await generate_embedding(chunk.content)

                        # 4. Assign the vector to the ORM model to queue it for saving
                        chunk.embedding = vector

                        # 5. Produce the result object on success
                        results.append(
                            EmbeddingResult(
                                chunk_id=chunk.id,
                                embedding=vector,
                                metadata={"status": "success", "chunk_index": chunk.chunk_index},
                            )
                        )
                    except Exception as e:
                        logger.error("chunk_embedding_failed", chunk_id=str(chunk.id), error=str(e))
                        # Produce a failure result object so the caller knows what happened
                        results.append(
                            EmbeddingResult(
                                chunk_id=chunk.id,
                                embedding=[],
                                metadata={"status": "failed", "error": str(e)},
                            )
                        )

                # 6. Commit the transaction to save all newly embedded chunks to PostgreSQL
                await session.commit()

            success_count = sum(1 for r in results if r.metadata.get("status") == "success")
            logger.info(
                "embedding_pipeline_completed",
                total_processed=len(results),
                successes=success_count,
            )

            return results

        except Exception as e:
            logger.error("embedding_pipeline_failed", error=str(e))
            raise ValueError(f"Embedding pipeline execution failed: {str(e)}")


# Create a singleton instance to be used by the rest of the application
embedding_service = EmbeddingService()
