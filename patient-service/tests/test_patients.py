import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app

# Test 1 — Vérifier que le service est vivant
@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

# Test 2 — Vérifier la route de santé
@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

# Test 3 — Vérifier que la liste des patients retourne une liste
@pytest.mark.asyncio
async def test_get_patients():
    async def mock_find():
        return
        yield  # rend la fonction async generator

    with patch("app.routers.patients.get_database") as mock_db:
        mock_collection = MagicMock()
        mock_collection.find.return_value = mock_find()
        mock_db.return_value = {"patients": mock_collection}

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/patients")
    assert response.status_code == 200
    assert isinstance(response.json(), list)