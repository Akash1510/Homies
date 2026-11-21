import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Homies Clean API"
    API_V1_STR: str = "/api"
    
    # MongoDB Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "homies")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "homies_clean_super_jwt_secret_token_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Admin Credentials
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "akashgj777@gmail.com")
    ADMIN_PHONE: str = os.getenv("ADMIN_PHONE", "+91 7776032964")
    ADMIN_INITIAL_PASSWORD: str = os.getenv("ADMIN_INITIAL_PASSWORD", "AdminPassword@777")
    
    # Razorpay
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_HomiesDemoKey")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "rzp_secret_HomiesDemoSecret")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "rzp_webhook_HomiesSecret")

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://checkout.razorpay.com",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
