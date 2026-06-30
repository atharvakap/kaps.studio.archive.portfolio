import pytest
from app.services.project_service import ProjectService
from app.models.project import Project

@pytest.mark.asyncio
async def test_get_featured_projects(db_session):
    # Setup: Create a project
    project = Project(
        name="Test Project", 
        slug="test-proj", 
        description="Desc", 
        featured=True
    )
    db_session.add(project)
    await db_session.commit()

    # Execution: Use the service
    service = ProjectService(db_session)
    featured = await service.get_featured_projects()

    # Assertion
    assert len(featured) == 1
    assert featured[0].name == "Test Project"