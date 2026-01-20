import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()


class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///financial_life.db")
    
    # Fix Render's PostgreSQL URL format
    # Render provides postgres:// but SQLAlchemy 1.4+ requires postgresql://
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = 3600

    # News API
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")

    # CORS
    CORS_HEADERS = "Content-Type"