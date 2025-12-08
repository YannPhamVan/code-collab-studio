import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routers import sessions, websocket

app = FastAPI(
    title="Code Collab Studio API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:8080",  # Frontend dev
    "http://127.0.0.1:8080",
    "http://localhost:3000",
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

# Serve Frontend (Static Files)
# Check if static directory exists (it will in Docker)
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")

if os.path.isdir(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    # Catch-all for SPA handling
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API routes to pass through (though they should be matched above)
        if full_path.startswith("api") or full_path.startswith("ws"):
            return {"error": "Not found"}
            
        # Serve index.html for all other routes
        return FileResponse(os.path.join(static_dir, "index.html"))
