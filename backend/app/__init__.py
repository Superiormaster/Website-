from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_file
from .extensions import db, mail, jwt, socketio
from flask_cors import CORS
from flask_migrate import Migrate
import logging
import os
from config import Config
from .routes.portfolio_routes import bp as portfolio_bp
from .admin.routes import admin_bp

def create_app(config_object=Config):
    app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

    app.config.from_object(config_object)

    # ensure upload folder exists
    upload_folder = app.config.get("UPLOAD_FOLDER")
    if upload_folder:
        os.makedirs(upload_folder, exist_ok=True)

    # simple logging config
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}})

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    socketio.init_app(app, async_mode="threading", cors_allowed_origins=FRONTEND_URL)
    migrate = Migrate(app, db)

    with app.app_context():
      app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
      app.register_blueprint(admin_bp, url_prefix="/api/admin")

    return app