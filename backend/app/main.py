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

# ============ FRONTEND ============
# The frontend dist directory
FRONTEND_DIR = "/app/frontend/dist"

# IMPORTANT: Mount the assets folder FIRST
# This ensures JavaScript files are served correctly
assets_dir = os.path.join(FRONTEND_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    print(f"✅ Mounted assets from: {assets_dir}")

# Serve index.html at root
@app.get("/")
async def serve_root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"error": "index.html not found"}

# Serve other static files (favicon, etc.)
@app.get("/{path:path}")
async def serve_static(path: str):
    # Skip API routes
    if path.startswith("auth") or path.startswith("questions") or path.startswith("users"):
        return {"error": "API route"}
    
    # Check if it's a file in the frontend directory
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        # Determine MIME type
        ext = os.path.splitext(file_path)[1].lower()
        mime_types = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        }
        media_type = mime_types.get(ext, 'application/octet-stream')
        return FileResponse(file_path, media_type=media_type)
    
    # For client-side routing, return index.html
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    
    return {"error": "File not found"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}