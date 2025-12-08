from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import sessions, websocket

app = FastAPI(
    title="Code Collab Studio API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:8080",  # Frontend dev
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(sessions.router, prefix="/api")
app.include_router(websocket.router)  # /ws is at root
