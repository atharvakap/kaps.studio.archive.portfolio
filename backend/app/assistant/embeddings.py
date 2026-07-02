import re

from openai import AsyncOpenAI

from app.config import settings
from app.logging import logger

# Initialize the client once to reuse the connection pool across requests
openai_client = AsyncOpenAI(api_key=settings.openai_api_key)


async def generate_embedding(text: str) -> list[float]:
    """
    Generates a dense vector embedding for the given text using OpenAI.
    """
    if not text or not text.strip():
        logger.error("embedding_generation_failed", error="Empty text provided")
        raise ValueError("Cannot generate an embedding for empty text.")

    # ML Best Practice: Normalize whitespace to reduce token count
    # and improve the semantic quality of the embedding
    normalized_text = re.sub(r"\s+", " ", text).strip()

    logger.info("generating_embedding_started", text_length=len(normalized_text))

    try:
        response = await openai_client.embeddings.create(
            input=normalized_text, model=settings.openai_embedding_model
        )

        embedding = response.data[0].embedding

        logger.info(
            "generating_embedding_completed",
            dimensions=len(embedding),
            model=settings.openai_embedding_model,
        )

        return embedding

    except Exception as e:
        logger.error("embedding_generation_failed", error=str(e))
        raise ValueError(f"Failed to generate OpenAI embedding: {str(e)}")
