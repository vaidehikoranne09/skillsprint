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
# Register MIME types for JavaScript files
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.jsx')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('image/png', '.png')
mimetypes.add_type('image/jpeg', '.jpg')
mimetypes.add_type('image/jpeg', '.jpeg')
mimetypes.add_type('image/gif', '.gif')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('image/x-icon', '.ico')
mimetypes.add_type('font/woff', '.woff')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/ttf', '.ttf')
mimetypes.add_type('application/vnd.ms-fontobject', '.eot')

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
    
    # List files for debugging
    try:
        files = os.listdir(FRONTEND_DIR)
        print(f"📁 Files: {files}")
    except:
        pass
    
    # Mount static files with correct MIME types
    @app.get("/{path:path}")
    async def serve_frontend_files(path: str):
        # Skip API routes
        if path.startswith("auth") or path.startswith("questions") or path.startswith("users"):
            return {"error": "API route"}
        
        # If path is empty, serve index.html
        if not path or path == "":
            file_path = os.path.join(FRONTEND_DIR, "index.html")
            if os.path.exists(file_path):
                return FileResponse(file_path, media_type='text/html')
        
        file_path = os.path.join(FRONTEND_DIR, path)
        
        # If file exists, serve it with correct MIME type
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Use mimetypes to get the correct MIME type
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                # Default to application/javascript for .js files
                if file_path.endswith('.js'):
                    mime_type = 'application/javascript'
                elif file_path.endswith('.css'):
                    mime_type = 'text/css'
                elif file_path.endswith('.html'):
                    mime_type = 'text/html'
                else:
                    mime_type = 'application/octet-stream'
            
            return FileResponse(file_path, media_type=mime_type)
        
        # For client-side routing, return index.html
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type='text/html')
        
        return {"error": "File not found"}
    
    # Root route
    @app.get("/")
    async def serve_root():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path, media_type='text/html')
        return {"error": "index.html not found"}

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