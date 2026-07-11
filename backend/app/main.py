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
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(questions.router)

# ============ SERVE FRONTEND ============
# Try multiple possible frontend paths
frontend_paths = [
    "/app/frontend/dist",      # Docker path
    "/app/frontend",           # Docker path (without dist)
    "../frontend/dist",        # Local development
    "frontend/dist",           # Local development
]

FRONTEND_DIR = None
for path in frontend_paths:
    if os.path.exists(path):
        FRONTEND_DIR = path
        break

if FRONTEND_DIR:
    print(f"✅ Serving frontend from: {FRONTEND_DIR}")
    
    # Serve static files
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_frontend_path(path: str):
        # If it's an API path, skip
        if path.startswith("auth") or path.startswith("questions") or path.startswith("users"):
            pass
        
        file_path = os.path.join(FRONTEND_DIR, path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
else:
    print("⚠️ Frontend not found!")
    
    @app.get("/")
    def root():
        return {
            "message": "Welcome to SkillsPrint API",
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "status": "healthy"
        }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}