import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Resolve the absolute path of the App_Server/.env file to ensure it loads correctly
# regardless of from where the python process is run.
APP_SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
env_file_path = os.path.join(APP_SERVER_DIR, ".env")

load_dotenv(env_file_path)

class Settings(BaseSettings):
    # MySQL Database connection URL
    MYSQL_URL: str = os.getenv(
        "MYSQL_URL",
        "your_sql_db_url_here"
    )
    
    # Static JWT/auth token for temporary simplified validation
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your_super_secret_jwt_key_here")
    
    # Admin password
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "your_dbpassword_here")
    
    # Uvicorn Port (Default to 3001 for proxy alignment with frontend)
    PORT: int = int(os.getenv("PORT", 3001))

    class Config:
        env_file = env_file_path
        extra = "ignore"

settings = Settings()
