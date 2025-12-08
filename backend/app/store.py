from typing import Dict, Optional, List
from uuid import UUID, uuid4
from datetime import datetime, timezone
from .models import Session, Participant, Language

class SessionStore:
    def __init__(self):
        self._sessions: Dict[UUID, Session] = {}

    def create_session(self, code: str = "", language: Language = Language.JAVASCRIPT) -> Session:
        session_id = uuid4()
        now = datetime.now(timezone.utc)
        if not code:
            code = self._get_default_code(language)
            
        session = Session(
            id=session_id,
            code=code,
            language=language,
            participants=[],
            createdAt=now
        )
        self._sessions[session_id] = session
        return session

    def get_session(self, session_id: UUID) -> Optional[Session]:
        return self._sessions.get(session_id)

    def add_participant(self, session_id: UUID, name: str) -> Optional[Participant]:
        session = self.get_session(session_id)
        if not session:
            return None
        
        participant = Participant(
            id=str(uuid4()),
            name=name,
            isOnline=True,
            score=0,
            joinedAt=datetime.now(timezone.utc),
            avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}"
        )
        session.participants.append(participant)
        return participant

    def update_code(self, session_id: UUID, code: str):
        session = self.get_session(session_id)
        if session:
            session.code = code

    def _get_default_code(self, language: Language) -> str:
        if language == Language.JAVASCRIPT:
            return "// Welcome to Code Collab!\nconsole.log('Hello World');"
        return "# Welcome to Code Collab!\nprint('Hello World')"

# Singleton instance
store = SessionStore()
