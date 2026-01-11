from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()

# ✅ Socket.IO instance
socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode="threading"  # or "gevent" or leave default
)