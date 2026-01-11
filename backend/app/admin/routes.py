from flask import Blueprint, request, jsonify, current_app, make_response, render_template, send_from_directory, Response
from ..extensions import db
from passlib.hash import pbkdf2_sha256
from ..models import AdminUser, Project, AppDownload, ContactMessage, AuditLog
from sqlalchemy import func
from datetime import datetime, timedelta
from ..auth.jwt import generate_jwt, jwt_required_custom, roles_required, get_current_user_id, log_action
from ..utils.upload_utils import save_file
from functools import wraps
from weasyprint import HTML
import csv, pyotp
from io import StringIO

admin_bp = Blueprint("admin", __name__)

secret = pyotp.random_base32()
# -----------------------------
# SERVE UPLOADED FILES
# -----------------------------
@admin_bp.route("/uploads/<path:filename>")
def uploaded_file(filename):
    upload_folder = current_app.config.get("UPLOAD_FOLDER")
    if not upload_folder:
        return jsonify({"error": "Upload folder not configured"}), 500

    try:
        return send_from_directory(upload_folder, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    print("Login data received:", data)
    username = data["username"].strip()
    user = AdminUser.query.filter_by(username=username, is_deleted=False).first()

    if not user or not pbkdf2_sha256.verify(data["password"], user.password_hash):
        print("ERROR: User not found")
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ 2FA only if enabled
    if user.two_factor_enabled:
        code = data.get("otp")
        if not code:
            return jsonify({"error": "OTP required", "requires_otp": True}), 400

        totp = pyotp.TOTP(user.two_factor_secret)
        if not totp.verify(code):
            print("ERROR: Password mismatch")
            return jsonify({"error": "Invalid OTP"}), 401

    token = generate_jwt(user)
    print("LOGIN SUCCESS")
    return jsonify({"token": token, "role": user.role})

@admin_bp.route("/settings/password", methods=["POST"])
@jwt_required_custom
def change_password():
    data = request.json
    new_password = data.get("password")

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user = AdminUser.query.get(get_current_user_id())
    user.password_hash = pbkdf2_sha256.hash(new_password)
    db.session.commit()

    log_action("Changed password")

    return jsonify({"success": True})

@admin_bp.route("/settings/2fa/toggle", methods=["POST"])
@jwt_required_custom
def toggle_2fa():
    user = AdminUser.query.get(get_current_user_id())

    if user.two_factor_enabled:
        user.two_factor_enabled = False
        user.two_factor_secret = None
        action = "Disabled 2FA"
    else:
        secret = pyotp.random_base32()
        user.two_factor_enabled = True
        user.two_factor_secret = secret
        action = "Enabled 2FA"

    db.session.commit()
    log_action(action)

    return jsonify({
        "success": True,
        "two_factor_enabled": user.two_factor_enabled,
        "secret": user.two_factor_secret if user.two_factor_enabled else None
    })

@admin_bp.route("/me", methods=["GET"])
@jwt_required_custom
def current_admin():
    user = AdminUser.query.get(get_current_user_id())
    return jsonify(user.to_dict())

@admin_bp.route("/audit-logs", methods=["GET"])
@jwt_required_custom
@roles_required("admin")
def audit_logs():
    logs = (
        AuditLog.query
        .order_by(AuditLog.created_at.desc())
        .limit(100)
        .all()
    )

    return jsonify([log.to_dict() for log in logs])

# -----------------------------
# CREATE APP ENTRY (protected)
# -----------------------------
@admin_bp.route("/apps", methods=["POST"])
@jwt_required_custom
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

@admin_bp.route("/apps")
@jwt_required_custom
@roles_required("admin")
def list_apps():
    apps = AppDownload.query.filter_by(is_deleted=False).order_by(AppDownload.id.desc()).all()
    return jsonify([a.to_dict() for a in apps])

@admin_bp.route("/apps/<int:id>", methods=["DELETE"])
@jwt_required_custom
@roles_required("admin")
def delete_app(id):
    app = AppDownload.query.get_or_404(id)

    if app.is_deleted:
        return jsonify({"error": "Project already deleted"}), 400

    app.is_deleted = True
    db.session.commit()
    log_action(f"Soft deleted project {app.id} - {app.name}")

    return jsonify({"success": True, "message": f"App '{app.title}' deleted"})

@admin_bp.route("/apps/<int:id>/restore", methods=["POST"])
@jwt_required_custom
@roles_required("admin")
def restore_app(id):
    app = AppDownload.query.get_or_404(id)

    if not app.is_deleted:
        return jsonify({"error": "App is not deleted"}), 400

    app.is_deleted = False
    db.session.commit()
    log_action(f"Restored app {app.id} - {app.name}")

    return jsonify({"success": True, "message": f"App '{app.title}' restored successfully"})

@admin_bp.route("/apps/deleted", methods=["GET"])
@jwt_required_custom
@roles_required("admin")
def deleted_apps():
    apps = AppDownload.query.filter_by(is_deleted=True).all()
    return jsonify([a.to_dict() for a in apps])

# -----------------------------
# CREATE NEW PROJECT (protected)
# -----------------------------
@admin_bp.route("/projects", methods=["POST"])
@jwt_required_custom
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

@admin_bp.route("/projects", methods=["GET"])
@jwt_required_custom
@roles_required("admin")
def list_projects():
    projects = Project.query.filter_by(is_deleted=False).order_by(Project.id.desc()).all()
    return jsonify([p.to_dict() for p in projects])

@admin_bp.route("/debug/all-records", methods=["GET"])
def debug_all_records():
    projects = Project.query.order_by(Project.id.desc()).all()
    apps = AppDownload.query.order_by(AppDownload.id.desc()).all()

    return jsonify({
        "projects": [{ "id": p.id, "title": p.title, "is_deleted": p.is_deleted } for p in projects],
        "apps": [{ "id": a.id, "name": a.name, "is_deleted": a.is_deleted } for a in apps]
    })

@admin_bp.route("/projects/<int:id>", methods=["DELETE"])
@jwt_required_custom
@roles_required("admin")
def delete_project(id):
    project = Project.query.get_or_404(id)

    if project.is_deleted:
        return jsonify({"error": "Project already deleted"}), 400

    project.is_deleted = True
    db.session.commit()
    log_action(f"Soft deleted project {project.id} - {project.title}")

    return jsonify({"success": True, "message": f"Project '{project.title}' deleted"})

@admin_bp.route("/projects/<int:id>/restore", methods=["POST"])
@jwt_required_custom
@roles_required("admin")
def restore_project(id):
    project = Project.query.get_or_404(id)

    if not project.is_deleted:
        return jsonify({"error": "Project is not deleted"}), 400

    project.is_deleted = False
    db.session.commit()
    log_action(f"Restored project {project.id} - {project.title}")

    return jsonify({"success": True, "message": f"Project '{project.title}' restored successfully"})

@admin_bp.route("/projects/deleted", methods=["GET"])
@jwt_required_custom
@roles_required("admin")
def deleted_projects():
    projects = Project.query.filter_by(is_deleted=True).all()
    return jsonify([p.to_dict() for p in projects])

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required_custom
@roles_required("admin")
def dashboard_stats():
    total_projects = Project.query.count()
    total_apps = AppDownload.query.count()
    total_messages = ContactMessage.query.count()

    recent_projects = (
        Project.query
        .order_by(Project.id.desc())
        .limit(5)
        .all()
    )
    
    recent_apps = (
      AppDownload.query
      .order_by(AppDownload.id.desc())
      .limit(5)
      .all()
    )

    recent_messages = (
        ContactMessage.query
        .order_by(ContactMessage.id.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "counts": {
            "projects": total_projects,
            "apps": total_apps,
            "messages": total_messages
        },
        "recent_projects": [p.to_dict() for p in recent_projects],
        "recent_apps": [a.to_dict() for a in recent_apps],
        "recent_messages": [m.to_dict() for m in recent_messages]
    })

@admin_bp.route("/export/messages/pdf")
@roles_required("admin")
def export_messages_pdf():
    messages = ContactMessage.query.all()
    html = render_template("messages_pdf.html", messages=messages)

    pdf = HTML(string=html).write_pdf()

    response = make_response(pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "attachment; filename=messages.pdf"
    return response

@admin_bp.route("/export/messages/csv")
@roles_required("admin")
def export_messages_csv():
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Message"])

    for m in ContactMessage.query.all():
        writer.writerow([m.name, m.email, m.message])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=messages.csv"}
    )

@admin_bp.route("/analytics/messages", methods=["GET"])
@jwt_required_custom
def messages_analytics():
    days = int(request.args.get("days", 7))
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=days-1)
    
    results = (
        db.session.query(
            func.date(ContactMessage.created_at).label("day"),
            func.count(ContactMessage.id)
        )
        .filter(ContactMessage.created_at >= start_date)
        .group_by(func.date(ContactMessage.created_at))
        .order_by(func.date(ContactMessage.created_at))
        .all()
    )

    data = {str(day): count for day, count in results}

    output = []
    for i in range(days):
        d = start_date + timedelta(days=i)
        output.append({"date": str(d), "count": data.get(str(d), 0)})

    return jsonify(output)

@admin_bp.route("/messages", methods=["GET"])
@jwt_required_custom
def messages():
    msgs = ContactMessage.query.order_by(ContactMessage.id.desc()).all()
    return jsonify([m.to_dict() for m in msgs])

@admin_bp.route("/logout-all", methods=["POST"])
@jwt_required_custom
@roles_required("admin")
def logout_all():
    user_id = get_jwt_identity()
    user = AdminUser.query.get(user_id)

    user.token_version += 1
    db.session.commit()

    log_action("Logged out all sessions")

    return jsonify({
        "success": True,
        "message": "All sessions invalidated"
    })

@admin_bp.route("/logout", methods=["POST"])
@jwt_required_custom
def logout():
    return jsonify({"success": True})