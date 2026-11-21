from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.db.mongodb import connect_to_mongodb, close_mongodb_connection
from backend.app.routes import auth, orders, products, payment

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB Atlas
    await connect_to_mongodb()
    yield
    # Shutdown: Close DB connection
    await close_mongodb_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack FastAPI backend for Homies Clean ecommerce app with MongoDB Atlas and Razorpay payment integration.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(products.router, prefix=settings.API_V1_STR)
app.include_router(payment.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "admin_contact": settings.ADMIN_PHONE,
        "admin_email": settings.ADMIN_EMAIL,
    }

@app.get("/api/health")
async def health_check():
    from backend.app.db.mongodb import db_manager
    return {
        "status": "healthy",
        "database": "connected (MongoDB Atlas)" if db_manager.is_connected else "local in-memory fallback",
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
