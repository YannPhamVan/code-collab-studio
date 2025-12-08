import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app

# WebSocket tests require TestClient for now as AsyncClient WS support is limited/different
client = TestClient(app)

@pytest.mark.asyncio
async def test_create_session(client: AsyncClient):
    response = await client.post("/api/sessions")
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert "code" in data
    assert data["language"] == "javascript"

@pytest.mark.asyncio
async def test_join_session(client: AsyncClient):
    # Create session
    create_res = await client.post("/api/sessions")
    session_id = create_res.json()["id"]

    # Join
    response = await client.post(f"/api/sessions/{session_id}/join", json={"name": "Test User"})
    assert response.status_code == 200
    data = response.json()
    assert data["participant"]["name"] == "Test User"
    assert "token" in data

def test_websocket():
    with client.websocket_connect("/ws/test-session-id") as websocket:
        websocket.send_json({"type": "join", "data": {"token": "fake"}})
        # Just verifying connection holds and doesn't crash
