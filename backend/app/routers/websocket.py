from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
from uuid import UUID
from ..store import store

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # session_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)

    async def broadcast(self, message: dict, session_id: str):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Handle potential broken pipe
                    pass

manager = ConnectionManager()

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_json()
            
            # Simple echoing/broadcasting logic based on type
            msg_type = data.get("type")
            
            if msg_type == "join":
                # In real app, validate token here
                pass
            elif msg_type == "code_update":
                code = data.get("data", {}).get("code")
                if code:
                    store.update_code(UUID(session_id), code)
                # Broadcast back to others
                await manager.broadcast(data, session_id)
            else:
                # Forward other messages (cursor, etc.)
                await manager.broadcast(data, session_id)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        # Optional: broadcast participant left
