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
    
    # Security & JWT Tokens
    SECRET_KEY: str = os.getenv("SECRET_KEY", "homies_clean_super_jwt_secret_token_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Short-lived access token: 30 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30 # Long-lived refresh token: 30 days
    
    # Admin Credentials
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "akashgj777@gmail.com")
    ADMIN_PHONE: str = os.getenv("ADMIN_PHONE", "+91 7776032964")
    ADMIN_INITIAL_PASSWORD: str = os.getenv("ADMIN_INITIAL_PASSWORD", "AdminPassword@777")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Razorpay
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_HomiesDemoKey")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "rzp_secret_HomiesDemoSecret")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "rzp_webhook_HomiesSecret")

    # Vercel preview deployments regex
    CORS_ORIGIN_REGEX: str = r"^https:\/\/homies-.*\.vercel\.app$"

    def get_cors_origins(self) -> List[str]:
        verified_prod_domains = [
            "https://homiesclean.com",
            "https://www.homiesclean.com",
            "https://homies-gilt.vercel.app",
            "https://checkout.razorpay.com",
        ]
        if self.ENVIRONMENT.lower() == "development":
            dev_domains = [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3001",
            ]
            return verified_prod_domains + dev_domains
        return verified_prod_domains

    class Config:
        case_sensitive = True

settings = Settings()
