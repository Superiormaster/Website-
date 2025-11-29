import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "app" / "static" / "uploads"
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = str(UPLOAD_FOLDER)
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB max

    # Allowed extensions for extra safety (upload_utils also checks)
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

    # Admin API key (use a secure random value in production)
    ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "replace_this_with_secure_key")

    # App
    JSON_SORT_KEYS = False