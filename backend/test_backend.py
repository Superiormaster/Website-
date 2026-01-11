# test_full_backend.py
import requests
from app import create_app
from app.extensions import db
from app.models import AdminUser

# -----------------------------
# 1️⃣ Seed admin user if not exists
# -----------------------------
app = create_app()
with app.app_context():
    username = "Superior Master"
    password = "Chidera@2006"

    admin = AdminUser.query.filter_by(username=username).first()
    if not admin:
        admin = AdminUser(username=username)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin user created: {username}")
    else:
        print(f"⚠ Admin user already exists: {username}")

# -----------------------------
# 2️⃣ Login and get JWT
# -----------------------------
BASE_URL = "http://127.0.0.1:5000"
login_data = {"username": username, "password": password}

resp = requests.post(f"{BASE_URL}/api/admin/login", json=login_data)

if resp.status_code != 200:
    print("❌ Login failed:", resp.text)
    exit(1)

token = resp.json()["token"]
print("✅ Logged in successfully. JWT token obtained.")

headers = {"Authorization": f"Bearer {token}"}

# -----------------------------
# 3️⃣ Create a new project
# -----------------------------
project_data = {
    "title": "Test Project",
    "description": "This is a test project",
    "live_url": "https://example.com",
    "github_url": "https://github.com/example"
}

resp = requests.post(
    f"{BASE_URL}/api/admin/projects",
    headers=headers,
    data=project_data
)

if resp.status_code == 201:
    print("✅ Project created successfully:", resp.json())
else:
    print("❌ Failed to create project:", resp.status_code, resp.text)

# -----------------------------
# 4️⃣ Fetch all projects
# -----------------------------
resp = requests.get(f"{BASE_URL}/api/portfolio/", headers=headers)
if resp.status_code == 200:
    data = resp.json()
    print("✅ Fetched projects successfully:")
    for proj in data["items"]:
        print("-", proj["title"])
else:
    print("❌ Failed to fetch projects:", resp.status_code, resp.text)