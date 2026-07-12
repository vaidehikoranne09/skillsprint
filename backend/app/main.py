from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import init_database
from app.routes import auth, user, questions

# Initialize database
init_database()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="SkillsPrint Backend API - Placement Preparation Platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(questions.router)

# Health Check
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


# =====================================================
# Frontend (React) Serving
# =====================================================

# Location of the React build inside the Docker container
FRONTEND_DIR = "/app/frontend/dist"

if os.path.exists(FRONTEND_DIR):

    assets_dir = os.path.join(FRONTEND_DIR, "assets")

    if os.path.exists(assets_dir):
        app.mount(
            "/assets",
            StaticFiles(directory=assets_dir),
            name="assets",
        )

    favicon = os.path.join(FRONTEND_DIR, "favicon.svg")
    if os.path.exists(favicon):

        @app.get("/favicon.svg", include_in_schema=False)
        async def favicon_file():
            return FileResponse(favicon)

    @app.get("/", include_in_schema=False)
    async def serve_root():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react(full_path: str):

        # Don't intercept API routes
        if (
            full_path.startswith("auth")
            or full_path.startswith("user")
            or full_path.startswith("questions")
            or full_path.startswith("docs")
            or full_path.startswith("redoc")
            or full_path.startswith("openapi.json")
            or full_path.startswith("health")
        ):
            return {"detail": "Not Found"}

        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

else:

    @app.get("/", tags=["Root"])
    def root():
        return {
            "message": "Welcome to SkillsPrint API",
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "status": "healthy",
            "frontend": "React build not found",
        }