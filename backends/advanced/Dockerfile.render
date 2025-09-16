FROM python:3.12-slim-bookworm

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    git \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.6.10 /uv /uvx /bin/

# Set up the working directory
WORKDIR /app

# Copy package structure and dependency files first
COPY pyproject.toml README.md ./
COPY uv.lock .
RUN mkdir -p src/advanced_omi_backend
COPY src/advanced_omi_backend/__init__.py src/advanced_omi_backend/

# Install dependencies using uv with deepgram extra
RUN uv sync --extra deepgram

# Copy all application code
COPY . .

# Copy configuration files
COPY memory_config.yaml* ./
COPY diarization_config.json* ./

# Create data directory for local storage
RUN mkdir -p /app/data

# Set environment variables for Render
ENV HOST=0.0.0.0
ENV PORT=10000
ENV PYTHONPATH=/app

# Expose the port that Render will use
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:10000/health || exit 1

# Run the application
CMD ["uv", "run", "python", "src/advanced_omi_backend/main.py", "--host", "0.0.0.0", "--port", "10000"]