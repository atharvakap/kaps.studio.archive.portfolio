from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from app.assistant.prompts import build_system_prompt
from app.config import settings

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