# ---------- Build React ----------
FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


# ---------- Python ----------
FROM python:3.12-slim

WORKDIR /app

# Backend
COPY backend/ /app/backend/

# Built React files
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

WORKDIR /app/backend

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app
ENV DB_TYPE=sqlite
ENV DB_NAME=skillsprint
ENV DB_ECHO=False
ENV DEBUG=False
ENV ENVIRONMENT=production

EXPOSE 10000

CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","10000"]