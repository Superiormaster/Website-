import os
from werkzeug.utils import secure_filename
from flask import current_app
import uuid

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

def ensure_upload_folder():
    folder = current_app.config.get("UPLOAD_FOLDER")
    if not folder:
        return None
    os.makedirs(folder, exist_ok=True)
    return folder
    
def unique_filename(filename):
    name = secure_filename(filename)
    base, ext = os.path.splitext(name)
    # use uuid to avoid collisions
    return f"{base}_{uuid.uuid4().hex}{ext}"

def save_file(file):
    if not file:
        return None
    filename = secure_filename(file.filename)
    if not filename or not allowed_file(filename):
        return None
    upload_folder = ensure_upload_folder()
    if not upload_folder:
        return None
    final_name = unique_filename(filename)
    path = os.path.join(upload_folder, final_name)
    # file.save will raise if filesystem error occurs
    file.save(path)
    return final_name