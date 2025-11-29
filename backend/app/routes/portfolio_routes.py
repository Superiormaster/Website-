from flask import Blueprint, request, jsonify, current_app, send_from_directory, url_for
from ..extensions import db
from ..models import Project, AppDownload
from ..utils.upload_utils import save_file
from ..auth import require_api_key
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
        projects = Project.query.order_by(Project.created_at.desc())
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
# CREATE NEW PROJECT (protected)
# -----------------------------
@bp.route("/", methods=["POST"])
@require_api_key
def create_project():
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        live_url = request.form.get("live_url")
        github_url = request.form.get("github_url")
        image_file = request.files.get("image")

        if not title:
            return jsonify({"error": "Title is required"}), 400

        filename = save_file(image_file) if image_file else None

        project = Project(
            title=title,
            description=description,
            image=filename,
            live_url=live_url,
            github_url=github_url
        )

        db.session.add(project)
        db.session.commit()

        return jsonify(project.to_dict()), 201

    except Exception:
        current_app.logger.exception("Failed to create project")
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
# CREATE APP ENTRY (protected)
# -----------------------------
@bp.route("/apps", methods=["POST"])
@require_api_key
def create_app_record():
    try:
        name = request.form.get("name")
        description = request.form.get("description")
        download_url = request.form.get("download_url")
        web_url = request.form.get("web_url")
        image_file = request.files.get("image")

        if not name:
            return jsonify({"error": "App name is required"}), 400

        filename = save_file(image_file) if image_file else None

        app_record = AppDownload(
            name=name,
            description=description,
            image=filename,
            download_url=download_url,
            web_url=web_url
        )

        db.session.add(app_record)
        db.session.commit()

        return jsonify(app_record.to_dict()), 201

    except Exception:
        current_app.logger.exception("Failed to create app record")
        return jsonify({"error": "Internal server error"}), 500

# -----------------------------
# SERVE UPLOADED FILES
# -----------------------------
@bp.route("/uploads/<path:filename>")
def uploaded_file(filename):
    upload_folder = current_app.config.get("UPLOAD_FOLDER")
    if not upload_folder:
        return jsonify({"error": "Upload folder not configured"}), 500

    try:
        return send_from_directory(upload_folder, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404