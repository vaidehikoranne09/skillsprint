# app/main.py
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

# CORS middleware
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

# ========== Frontend Setup ==========
print("\n" + "="*50)
print("🔍 DEBUGGING FRONTEND PATH")
print("="*50)

current_file = os.path.abspath(__file__)
main_dir = os.path.dirname(current_file)
backend_dir = os.path.dirname(main_dir)
project_dir = os.path.dirname(backend_dir)
frontend_dir = os.path.join(project_dir, "frontend")

print(f"📁 Frontend directory: {frontend_dir}")
print(f"📁 Frontend exists: {os.path.exists(frontend_dir)}")

if os.path.exists(frontend_dir):
    # Mount static files
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")
    
    # Serve HTML pages with no-cache headers
    @app.get("/")
    async def serve_login():
        return FileResponse(
            os.path.join(frontend_dir, "index.html"),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
        )
    
    @app.get("/signup")
    async def serve_signup():
        return FileResponse(
            os.path.join(frontend_dir, "signup.html"),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
        )
    
    @app.get("/dashboard")
    async def serve_dashboard():
        return FileResponse(
            os.path.join(frontend_dir, "dashboard.html"),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
        )
    
    print("✅ Frontend served successfully!")
else:
    @app.get("/")
    def root():
        return {
            "message": "Welcome to SkillsPrint API",
            "version": settings.APP_VERSION,
            "docs": "/docs"
        }
    print("❌ Frontend not found!")

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}