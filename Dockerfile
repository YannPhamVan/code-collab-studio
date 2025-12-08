# ==========================================
# Stage 1: Build Frontend (Node.js)
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy dependency definitions
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
# 'npm ci' is faster and more reliable for lockfile installs
RUN npm ci

# Copy source code
COPY frontend/ .

# Build for production
RUN npm run build

# ==========================================
# Stage 2: Backend Runtime (Python)
# ==========================================
FROM python:3.12-slim

WORKDIR /app

# Install uv for fast python package management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy backend dependency definitions
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies into system python (since we are in container)
# --system flag installs directly to site-packages
RUN uv sync --system --frozen

# Copy backend source code
COPY backend/app ./app

# Copy built frontend assets from Stage 1
# We place them in /app/static to be served by FastAPI
COPY --from=frontend-builder /app/frontend/dist /app/static

# Environment variables
# Ensure python output is sent straight to terminal (container logs)
ENV PYTHONUNBUFFERED=1
# Port defaults to 8000
ENV PORT=8000

# Expose the port
EXPOSE 8000

# Run the application
# We use uvicorn directly. Host 0.0.0.0 is crucial for Docker networking.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
