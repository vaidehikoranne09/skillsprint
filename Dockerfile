FROM python:3.12-slim

WORKDIR /app

# Copy backend - CORRECT
COPY backend/ /app/backend/

# Copy frontend dist - CORRECT (no leading slash)
COPY frontend/dist/ /app/frontend/dist/

# Install dependencies
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app
ENV DB_TYPE=sqlite
ENV DB_NAME=skillsprint
ENV DB_ECHO=False
ENV SECRET_KEY=${SECRET_KEY}
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=60
ENV DEBUG=False
ENV ENVIRONMENT=production
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS}

EXPOSE 10000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]