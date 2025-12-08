import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.store import store

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

@pytest.fixture(autouse=True)
def clean_store():
    store._sessions.clear()
