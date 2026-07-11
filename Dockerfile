# Dockerfile - Place in project root (skillsprint/)
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy backend and frontend files
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/backend/
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONPATH=/app
ENV DB_TYPE=sqlite
ENV DB_NAME=skillsprint
ENV DB_ECHO=False
ENV SECRET_KEY=821355b02c1736a6d9d9c85f94f776bf0c7b2caa22926f2762d23027c02524b5
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=60
ENV DEBUG=False
ENV ENVIRONMENT=production
ENV ALLOWED_ORIGINS=https://skillsprint-ijwh.onrender.com,http://localhost:3000,https://skillsprint-api-97qw.onrender.com
# Expose the port
EXPOSE 10000

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]