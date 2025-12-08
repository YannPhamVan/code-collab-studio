# Backend API Implementation Guide

This document outlines the API contracts and implementation details for the Code Collab Studio backend. The frontend expects a REST API and a WebSocket endpoints as defined in `openapi.yaml`.

## Authentication

All protected endpoints (currently only `/run` explicitly in spec, but broadly applicable) expect an `Authorization` header with a Bearer token.
The create/join endpoints return a token that the client will use.

Format: `Authorization: Bearer <token>`

## REST Endpoints

### 1. Create Session
**POST** `/sessions`

Returns a new session with a unique ID.

```bash
curl -X POST http://localhost:8000/api/sessions \
  -H "Content-Type: application/json"
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "// ...",
  "language": "javascript",
  "participants": [],
  "createdAt": "2023-10-27T10:00:00Z"
}
```

### 2. Get Session
**GET** `/sessions/{id}`

Retrieves session metadata.

```bash
curl http://localhost:8000/api/sessions/550e8400-e29b-41d4-a716-446655440000
```

### 3. Join Session
**POST** `/sessions/{id}/join`

Adds a user to the session. Returns the participant object AND an authentication token.

```bash
curl -X POST http://localhost:8000/api/sessions/550e8400-e29b-41d4-a716-446655440000/join \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
```

**Response**:
```json
{
  "participant": {
    "id": "user-123",
    "name": "Alice",
    "isOnline": true,
    "score": 0,
    "joinedAt": "..."
  },
  "token": "eyJhbG..."
}
```

### 4. Execute Code
**POST** `/run`

Executes code in a sandboxed environment.

```bash
curl -X POST http://localhost:8000/api/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "code": "print(\"Hello\")",
    "language": "python"
  }'
```

**Response**:
```json
{
  "success": true,
  "output": "Hello\n",
  "executionTime": 15
}
```

## WebSocket Protocol

**URL**: `ws://localhost:8000/ws/{sessionId}`
**Handshake**: Client connects to the session-specific URL.

### Client Messages
- **Join**: Sent immediately after connection to authenticate.
  ```json
  { "type": "join", "data": { "token": "..." } }
  ```
- **Code Update**: When user types.
  ```json
  { "type": "code_update", "data": { "code": "..." } }
  ```
- **Cursor Position**: Real-time cursor tracking.
  ```json
  { "type": "cursor_position", "data": { "line": 1, "column": 5 } }
  ```
- **Language Change**: Switching language.
  ```json
  { "type": "language_change", "data": { "language": "python" } }
  ```

### Server Messages
- **Participant Update**: Broadcast when someone joins/leaves.
  ```json
  { "type": "participant_update", "data": [ ...participant_list... ] }
  ```
- **Code Update**: Broadcast to other clients when code changes.
  ```json
  { "type": "code_update", "data": { "code": "..." } }
  ```
- **Cursor Update**: Broadcast other users' cursor positions.
  ```json
  { "type": "cursor_update", "data": { "participantId": "...", "position": { "line": 1, "column": 5 } } }
  ```
- **Run Result**: (Optional) if execution is triggered via Run Request.
  ```json
  { "type": "run_result", "data": { "success": true, "output": "..." } }
  ```
