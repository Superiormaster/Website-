from app import create_app
from app.extensions import db
from app.models import AdminUser
from passlib.hash import pbkdf2_sha256

app = create_app()

with app.app_context():
    if not AdminUser.query.filter_by(username="Superior Master").first():
        admin = AdminUser(
          username="Superior Master",
          password=pbkdf2_sha256.hash("Chidera@2006")
        ) # change this immediately!

        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin user created: {admin.username}, password: {password}")
    else:
        print("⚠ Admin user already exists")