# Code Collab Studio

Collaborative coding interview platform.

## Backend

Located in `backend/`.

### Testing

Run integration and unit tests using `uv`:

```bash
# Run all tests (unit + integration)
uv run pytest

# Run quietly
uv run pytest -q
```

## Frontend

Located in `frontend/`.

```bash
cd frontend
npm run dev
npm test
```

### Code Execution

The platform supports secure client-side execution for:
- **JavaScript**: Using isolated Web Workers.
- **Python**: Using Pyodide in Web Workers.

To verify execution logic locally:
```bash
# Run executor integration tests
cd frontend
npm test -- src/lib/executor.test.ts
```
