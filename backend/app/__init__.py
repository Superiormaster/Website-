from flask import Flask
from .extensions import db
from flask_cors import CORS
import logging
import os

def create_app(config_object=None):
    app = Flask(__name__, static_folder="static", static_url_path="/static")
    if config_object:
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

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)

    with app.app_context():
        from .routes.portfolio_routes import bp as portfolio_bp
        app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
        db.create_all()

    return app