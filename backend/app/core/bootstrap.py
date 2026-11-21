from datetime import datetime
from backend.app.core.config import settings
from backend.app.core.security import get_password_hash
from backend.app.db.mongodb import db_manager, memory_db

async def get_or_bootstrap_user(clean_email: str):
    if db_manager.is_connected and db_manager.db is not None:
        user = await db_manager.db.users.find_one({"email": clean_email})
    else:
        user = next((u for u in memory_db["users"].values() if u["email"] == clean_email), None)

    # 1. Bootstrap Admin Akash
    if not user and clean_email == settings.ADMIN_EMAIL.lower():
        user_id = "admin-akash"
        user = {
            "id": user_id,
            "email": clean_email,
            "full_name": "Akash (Store Owner)",
            "phone": settings.ADMIN_PHONE,
            "address": "Admin Hub, Homies Clean HQ",
            "city": "Mumbai",
            "pincode": "400001",
            "role": "admin",
            "hashed_password": get_password_hash(settings.ADMIN_INITIAL_PASSWORD),
            "created_at": datetime.utcnow()
        }
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.insert_one(user)
        else:
            memory_db["users"][user_id] = user

    # 2. Bootstrap Test Customer User (test@gmail.com / akash123456)
    if not user and clean_email == "test@gmail.com":
        user_id = "user-test-customer"
        user = {
            "id": user_id,
            "email": "test@gmail.com",
            "full_name": "Test Customer",
            "phone": "+91 9876543210",
            "address": "Flat 402, Sunshine Apartments, MG Road",
            "city": "Mumbai",
            "pincode": "400001",
            "role": "customer",
            "hashed_password": get_password_hash("akash123456"),
            "created_at": datetime.utcnow()
        }
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.users.insert_one(user)
        else:
            memory_db["users"][user_id] = user

    return user
