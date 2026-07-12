# ---------- Stage 1: Build React Frontend ----------
FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


# ---------- Stage 2: Python Backend ----------
FROM python:3.12-slim

WORKDIR /app

# Copy backend
COPY backend/ /app/backend/

# Copy datasets
COPY datasets/ /app/datasets/

# Copy built frontend
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

# Install Python dependencies
WORKDIR /app/backend

RUN pip install --no-cache-dir -r requirements.txt

# Environment variables
ENV PYTHONPATH=/app
ENV DB_TYPE=sqlite
ENV DB_NAME=skillsprint
ENV DB_ECHO=False
ENV DEBUG=False
ENV ENVIRONMENT=production

EXPOSE 10000

# Load data and start FastAPI
CMD sh -c "python direct_load.py && uvicorn app.main:app --host 0.0.0.0 --port 10000"