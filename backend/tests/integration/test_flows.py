import pytest
import uuid
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app

# Use TestClient for the WebSocket test as it handles ASGI WS testing better than pure httpx in simple setups
# For async REST tests, we keep using AsyncClient

def test_websocket_broadcast_flow():
    """
    Test full WS flow with FastAPI TestClient:
    1. Create session
    2. Connect Client A
    3. Connect Client B
    4. A sends 'code_update'
    5. B receives 'code_update'
    """
    client = TestClient(app)
    
    # 1. Create Session
    resp = client.post("/api/sessions")
    assert resp.status_code == 201
    session_id = resp.json()["id"]

    # 2. Connect Client A
    with client.websocket_connect(f"/ws/{session_id}") as ws_a:
        # Join
        ws_a.send_json({"type": "join", "data": {"token": "mock-token"}})
        
        # 3. Connect Client B
        with client.websocket_connect(f"/ws/{session_id}") as ws_b:
            ws_b.send_json({"type": "join", "data": {"token": "mock-token-2"}})
            
            # 4. A sends code update
            update_msg = {
                "type": "code_update",
                "data": {"code": "print('Hello Integration')"}
            }
            ws_a.send_json(update_msg)
            
            # 5. B should receive it
            # Note: B might receive multiple messages (like its own join ack if we implemented that, or A's join),
            # so we might need to filter. But in our simple broadcast impl, it should just broadcast.
            # Our current simple implementation echoes/broadcasts everything.
            
            received = ws_b.receive_json()
            # Ensure we eventually get the code update. 
            # In a real heavy-traffic scenario we'd loop, but here traffic is strictly controlled.
            
            # If the first message isn't code_update (e.g. it's the join message if we broadcast that),
            # we might check subsequent messages. 
            # Current impl routers/websocket.py:
            # - join: does pass pass
            # - code_update: store update + broadcast
            # - others: broadcast
            
            assert received["type"] == "code_update"
            assert received["data"]["code"] == "print('Hello Integration')"

@pytest.mark.asyncio
async def test_rest_session_lifecycle(client):
    """
    Test REST flow: Create -> Get -> Join
    """
    # 1. Create
    resp = await client.post("/api/sessions")
    assert resp.status_code == 201
    data = resp.json()
    session_id = data["id"]
    assert session_id is not None
    
    # 2. Get
    resp = await client.get(f"/api/sessions/{session_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == session_id
    
    # 3. Join
    resp = await client.post(f"/api/sessions/{session_id}/join", json={"name": "Integration User"})
    assert resp.status_code == 200
    join_data = resp.json()
    assert join_data["participant"]["name"] == "Integration User"
    assert "token" in join_data

