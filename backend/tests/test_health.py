import pytest


@pytest.mark.asyncio
async def test_health(client):
    """Verifies that the /health endpoint is operational"""
    response = await client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Portfolio API is healthy"}
