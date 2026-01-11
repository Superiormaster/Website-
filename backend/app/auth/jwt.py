from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity, get_jwt,
    verify_jwt_in_request
)
from ..models import AdminUser

def roles_required(*roles):
    """
    Decorator to check if the current admin has one of the allowed roles.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({"error": "Unauthorized"}), 401
            user = AdminUser.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({"error": "Access denied"}), 403
            claims = get_jwt()
            if claims.get("role") not in roles:
                return {"msg": "Access denied"}, 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def log_action(action, user_id=None):
    """
    Log an action to the AuditLog table.
    If user_id is not provided, attempt to get from JWT.
    """
    if user_id is None:
        user_id = get_jwt_identity()
    log = AuditLog(
        user_id=user_id,
        action=action,
        ip_address=request.remote_addr
    )
    try:
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Failed to log action:", e)

def generate_jwt(user, expires_delta=None):
    """
    Generate a JWT token for a given identity (e.g., admin user id)
    """
    return create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "token_version": user.token_version
        }, expires_delta=expires_delta
    )

def jwt_required_custom(func):
    """
    Custom decorator to protect routes with JWT.
    Works like @jwt_required() but returns consistent JSON on failure.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            return jsonify({"error": "Unauthorized", "message": str(e)}), 401
        claims = get_jwt()
        user_id = get_jwt_identity()

        user = AdminUser.query.get(user_id)
        if not user:
            return {"msg": "User not found"}, 401

        # 🔥 TOKEN VERSION CHECK
        if claims.get("token_version") != user.token_version:
            return {"msg": "Session expired. Please login again."}, 401
        return func(*args, **kwargs)
    return wrapper


def get_current_user_id():
    """
    Get the identity (admin id) from the current JWT
    """
    return get_jwt_identity()