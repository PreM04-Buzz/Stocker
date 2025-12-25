import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    FINNHUB_API_KEY: str = os.getenv("FINNHUB_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

settings = Settings()