# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import init_database
from app.routes import auth, user

# Initialize database
init_database()

# Create app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="SkillsPrint Backend API - Authentication & Authorization",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)

# Note: Frontend is now served by React (Vite) on port 5173
# Backend only serves API

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

@app.get("/")
def root():
    return {
        "message": "SkillsPrint API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "healthy"
    }