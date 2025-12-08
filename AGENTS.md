# AGENTS.md — instructions for AI agents

Use `uv` for Python dependency management.

Useful commands:
- uv sync
- uv add <package>
- uv run pytest
- uv run uvicorn app.main:app --reload --port 8000
- uv run uvicorn backend.app.main:app --reload --port 8000 (if running from root)

Git rules:
- Commit often with clear messages.
- Push feature branches, create PRs for big changes.
- Use `uv run pytest` locally before commit.

Testing policy:
- Run unit tests first, then integration tests.
- Use in-memory SQLite for integration tests.

Security:
- Do not run untrusted code on server; code execution must be done in browser (WASM) later.

