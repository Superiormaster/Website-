from functools import wraps
from flask import request, current_app, jsonify

def require_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Check header first
        key = request.headers.get("X-API-KEY") or request.args.get("api_key")
        if not key:
            return jsonify({"error": "Missing API key"}), 401

        expected = current_app.config.get("ADMIN_API_KEY")
        if not expected or key != expected:
            return jsonify({"error": "Invalid API key"}), 403

        return func(*args, **kwargs)
    return wrapper