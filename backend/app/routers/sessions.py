from fastapi import APIRouter, HTTPException, Path
from uuid import UUID
from ..models import Session, JoinSessionRequest, JoinSessionResponse, CreateSessionRequest
from ..store import store
import jwt
import datetime

router = APIRouter(prefix="/sessions", tags=["sessions"])

SECRET_KEY = "dev-secret-key"  # TODO: Move to env var

def create_token(participant_id: str, session_id: str) -> str:
    payload = {
        "sub": participant_id,
        "sid": session_id,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.post("", response_model=Session, status_code=201)
async def create_session(request: CreateSessionRequest = None):
    # Optional request body
    code = request.code if request else ""
    return store.create_session(code=code)

@router.get("/{id}", response_model=Session)
async def get_session(id: UUID = Path(...)):
    session = store.get_session(id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/{id}/join", response_model=JoinSessionResponse)
async def join_session(body: JoinSessionRequest, id: UUID = Path(...)):
    participant = store.add_participant(id, body.name)
    if not participant:
        raise HTTPException(status_code=404, detail="Session not found")
    
    token = create_token(participant.id, str(id))
    return JoinSessionResponse(participant=participant, token=token)
