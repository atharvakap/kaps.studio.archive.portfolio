import pytest


@pytest.mark.asyncio
async def test_health(client):
    """
    Verifies that the /health endpoint is operational
    """
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
