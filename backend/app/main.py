from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import mimetypes

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
# Register MIME types
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('image/svg+xml', '.svg')

# Check if frontend dist exists
frontend_paths = [
    "/app/frontend/dist",
    "/app/frontend",
    "frontend/dist",
    "frontend",
    "../frontend/dist",
]

FRONTEND_DIR = None
for path in frontend_paths:
    if os.path.exists(path) and os.path.isdir(path):
        FRONTEND_DIR = path
        break

print(f"🔍 Frontend directory: {FRONTEND_DIR}")

if FRONTEND_DIR:
    print(f"✅ Serving frontend from: {FRONTEND_DIR}")
    
    # Check for assets directory - if it exists, mount it
    assets_dir = os.path.join(FRONTEND_DIR, "assets")
    if os.path.exists(assets_dir) and os.path.isdir(assets_dir):
        print(f"📁 Mounting assets from: {assets_dir}")
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    # Check for static directory
    static_dir = os.path.join(FRONTEND_DIR, "static")
    if os.path.exists(static_dir) and os.path.isdir(static_dir):
        print(f"📁 Mounting static from: {static_dir}")
        app.mount("/static", StaticFiles(directory=static_dir), name="static")
    
    # Root route - serve index.html
    @app.get("/")
    async def serve_root():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type='text/html')
        return {"error": "index.html not found"}
    
    # Catch-all route for client-side routing
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Skip API routes
        if full_path.startswith("auth") or full_path.startswith("questions") or full_path.startswith("users"):
            return {"error": "API route"}
        
        # Check if it's a file that exists
        file_path = os.path.join(FRONTEND_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                mime_type = 'application/octet-stream'
            return FileResponse(file_path, media_type=mime_type)
        
        # For all other routes, return index.html (for client-side routing)
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type='text/html')
        
        return {"error": "File not found"}

else:
    print("⚠️ Frontend not found!")
    
    @app.get("/")
    def root():
        return {
            "message": "Welcome to SkillsPrint API",
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "status": "healthy",
            "frontend_not_found": True
        }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}