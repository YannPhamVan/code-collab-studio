# Code Collab Studio Backend

FastAPI backend for Code Collab Studio.

## Setup

```bash
# Verify uv is installed
uv --version

# Run development server
uv run uvicorn app.main:app --reload --port 8000
```

## Testing

```bash
# Run tests
uv run pytest
```

## Structure
- `app/`: Application code
  - `routers/`: API endpoints
  - `models.py`: Pydantic models
  - `store.py`: In-memory persistence
- `tests/`: Pytest tests
