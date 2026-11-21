import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings

logger = logging.getLogger("uvicorn")

class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

db_manager = MongoDBManager()

# In-memory mock store fallback for local development when Atlas URI is not yet configured
memory_db = {
    "users": {},
    "products": {},
    "orders": {}
}

async def connect_to_mongodb():
    if not settings.MONGODB_URL:
        logger.warning("⚠️  MONGODB_URL not provided in .env. Running with local in-memory store fallback.")
        return

    try:
        db_manager.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000
        )
        # Verify connection
        await db_manager.client.admin.command('ping')
        db_manager.db = db_manager.client[settings.MONGODB_DB_NAME]
        db_manager.is_connected = True
        logger.info(f"✅ Successfully connected to MongoDB Atlas: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB Atlas: {e}. Falling back to in-memory store.")
        db_manager.is_connected = False

async def close_mongodb_connection():
    if db_manager.client:
        db_manager.client.close()
        logger.info("MongoDB Atlas connection closed.")

def get_database():
    return db_manager.db
