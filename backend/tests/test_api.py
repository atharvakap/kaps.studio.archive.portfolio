import uuid

import pytest
from httpx import AsyncClient

from app.models.project import Project


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Verify the API router is properly mounted."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Portfolio API is healthy"}


@pytest.mark.asyncio
async def test_create_contact_message_success(client: AsyncClient):
    """Verify valid contact submissions return 201 Created."""
    payload = {
        "sender_name": "API Tester",
        "sender_email": "tester@example.com",
        "subject": "Testing the API",
        "message": "This is a test message that comfortably meets the minimum length requirement.",
    }
    response = await client.post("/api/contact", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert data["sender_email"] == "tester@example.com"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_contact_validation_error(client: AsyncClient):
    """Verify Pydantic boundaries block invalid data with a 422."""
    payload = {
        "sender_name": "T",  # Too short (min 2)
        "sender_email": "not-an-email",  # Invalid email
        "subject": "Hi",
        "message": "Short",  # Too short (min 10)
    }
    response = await client.post("/api/contact", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_project_not_found(client: AsyncClient):
    """Verify the global exception handler translates NotFoundError to 404."""
    response = await client.get("/api/projects/does-not-exist")
    assert response.status_code == 404
    assert response.json() == {"detail": "Project with slug 'does-not-exist' not found."}


@pytest.mark.asyncio
async def test_get_project_success(client: AsyncClient, db_session):
    unique_slug = f"api-test-{uuid.uuid4().hex[:8]}"
    project = Project(
        name="API Test Project",
        slug=unique_slug,
        description="Testing the API Serialization",
        featured=True,
    )
    db_session.add(project)
    await db_session.commit()

    # Hit the endpoint using the unique slug
    response = await client.get(f"/api/projects/{unique_slug}")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "API Test Project"
    assert data["slug"] == unique_slug
    assert "skills" in data

    # Cleanup
    await db_session.delete(project)
    await db_session.commit()
