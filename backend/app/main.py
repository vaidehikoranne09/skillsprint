from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
FRONTEND_DIR = None

# Check multiple possible paths
possible_paths = [
    "/app/frontend/dist",
    "/app/frontend",
    "frontend/dist",
    "frontend",
    "../frontend/dist",
]

for path in possible_paths:
    if os.path.exists(path) and os.path.isdir(path):
        FRONTEND_DIR = path
        break

print(f"🔍 Frontend directory: {FRONTEND_DIR}")

if FRONTEND_DIR:
    print(f"✅ Serving frontend from: {FRONTEND_DIR}")
    
    # List files for debugging
    try:
        files = os.listdir(FRONTEND_DIR)
        print(f"📁 Files in frontend: {files}")
        
        # Check for assets folder
        assets_path = os.path.join(FRONTEND_DIR, "assets")
        if os.path.exists(assets_path):
            assets_files = os.listdir(assets_path)
            print(f"📁 Files in assets: {assets_files}")
    except Exception as e:
        print(f"Error listing files: {e}")
    
    # Serve index.html at root
    @app.get("/")
    async def serve_root():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type="text/html")
        return {"error": "index.html not found"}
    
    # Serve static files
    @app.get("/{path:path}")
    async def serve_static(path: str):
        # Skip API routes
        if path.startswith("auth") or path.startswith("questions") or path.startswith("users"):
            return {"error": "API route"}
        
        # Check if it's a file that exists
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
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
            }
            media_type = mime_types.get(ext, 'application/octet-stream')
            return FileResponse(file_path, media_type=media_type)
        
        # For client-side routing, return index.html
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type="text/html")
        
        return {"error": "File not found"}

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