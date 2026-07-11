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
    
    # Serve static files with correct MIME types
    @app.get("/{path:path}")
    async def serve_frontend_files(path: str):
        # Skip API routes
        if path.startswith("auth") or path.startswith("questions") or path.startswith("users"):
            return {"error": "API route"}
        
        # If path is empty, serve index.html
        if not path or path == "":
            file_path = os.path.join(FRONTEND_DIR, "index.html")
            if os.path.exists(file_path):
                return FileResponse(file_path)
        
        file_path = os.path.join(FRONTEND_DIR, path)
        
        # If file exists, serve it with correct MIME type
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # Determine MIME type based on extension
            extension = os.path.splitext(file_path)[1].lower()
            media_type = None
            
            if extension == '.js':
                media_type = 'application/javascript'
            elif extension == '.css':
                media_type = 'text/css'
            elif extension == '.html':
                media_type = 'text/html'
            elif extension == '.json':
                media_type = 'application/json'
            elif extension in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']:
                media_type = f'image/{extension[1:]}'
            
            return FileResponse(file_path, media_type=media_type)
        
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