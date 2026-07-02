import os
from pydantic_ai import Agent
from app.assistant.prompts import build_system_prompt

# Define the model to use.
AGENT_MODEL = os.getenv("AGENT_MODEL", "openai:gpt-4o-mini")

# Instantiate the Agent as a singleton so it is only created once on server startup.
virtual_me_agent = Agent(
    model=AGENT_MODEL,
    system_prompt=build_system_prompt()
)