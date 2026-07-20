from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from sqlalchemy import select

from app.assistant.prompts import build_system_prompt
from app.config import settings
from app.database.session import AsyncSessionLocal
from app.models.resume import Resume
from app.services.resume_service import ResumeService

# 1. Initialize the model using the dedicated OpenAIProvider for your API key
ai_model = OpenAIChatModel(
    'gpt-4o-mini',
    provider=OpenAIProvider(api_key=settings.openai_api_key)
)

# 2. Instantiate the Agent as a singleton
virtual_me_agent = Agent(
    model=ai_model,
    system_prompt=build_system_prompt()
)


@virtual_me_agent.tool
async def get_latest_resume(ctx: RunContext) -> dict:
    """Fetches the latest active resume details and download URL from the database."""
    async with AsyncSessionLocal() as session:
        resume_service = ResumeService(session)
        try:
            resume = await resume_service.get_active_resume()
            if not resume:
                return {"error": "No resume available at the moment."}
            
            return {
                "type": "resume",
                "title": f"Atharva_Kapile_Resume_v{resume.version}.pdf",
                "url": resume.file_url,
                "version": resume.version
            }
        except Exception:
            return {"error": "No resume available at the moment."}