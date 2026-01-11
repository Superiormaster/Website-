from flask import Blueprint, request, jsonify, current_app, flash, send_from_directory
import traceback
from sqlalchemy import func
from ..extensions import db, mail, socketio
from ..models import Project, ContactMessage, AppDownload
from ..utils.upload_utils import save_file
import os

bp = Blueprint("portfolio", __name__)

# Helper: pagination params
def get_pagination_params():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
    except ValueError:
        return None, None, jsonify({"error": "Invalid pagination parameters"}), 400

    per_page = min(max(1, per_page), 100)  # enforce 1..100
    page = max(1, page)
    return page, per_page, None, None

# -----------------------------
# GET ALL PROJECTS
# -----------------------------
@bp.route("/", methods=["GET"])
def list_projects():
    page, per_page, err, status = get_pagination_params()
    if err:
        return err, status
    try:
        q = Project.query.order_by(Project.created_at.desc())
        pagination = q.paginate(page=page, per_page=per_page, error_out=False)
        items = [p.to_dict() for p in pagination.items]
        return jsonify({
            "items": items,
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }), 200
    except Exception as e:
        current_app.logger.exception("Failed to list projects")
        return jsonify({"error": "Internal server error"}), 500

# -----------------------------
# GET APPS (paginated)
# -----------------------------
@bp.route("/apps", methods=["GET"])
def list_apps():
    page, per_page, err, status = get_pagination_params()
    if err:
        return err, status
    try:
        q = AppDownload.query.order_by(AppDownload.id.desc())
        pagination = q.paginate(page=page, per_page=per_page, error_out=False)
        items = [a.to_dict() for a in pagination.items]
        return jsonify({
            "items": items,
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "pages": pagination.pages
        }), 200
    except Exception:
        current_app.logger.exception("Failed to list apps")
        return jsonify({"error": "Internal server error"}), 500

# -----------------------------
@bp.route("/contact", methods=["POST"])
def contact():
    data = request.json
    if not data.get("email") or not data.get("message"):
        return jsonify({"error": "Email and message are required"}), 400

    msg = ContactMessage(
        name=data.get("name"),
        email=data.get("email"),
        message=data.get("message")
    )

    db.session.add(msg)
    db.session.commit()

    # ✅ Emit AFTER commit
    socketio.emit(
        "new_message",
        msg.to_dict(),
        namespace="/admin"
    )

    return jsonify({"success": True}), 201