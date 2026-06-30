import uuid

import pytest

from app.models.project import Project
from app.services.project_service import ProjectService


@pytest.mark.asyncio
async def test_get_featured_projects(db_session):
    # Setup: Create a project with a random unique slug
    unique_slug = f"test-proj-{uuid.uuid4().hex[:8]}"
    project = Project(name="Test Project", slug=unique_slug, description="Desc", featured=True)
    db_session.add(project)
    await db_session.commit()

    # Execution
    service = ProjectService(db_session)
    featured = await service.get_featured_projects()

    # Assertion
    assert len(featured) >= 1

    # Cleanup: Delete it from Supabase so the next test run is clean
    await db_session.delete(project)
    await db_session.commit()
