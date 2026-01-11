from app import create_app
from app.extensions import db
from app.models import AdminUser

app = create_app()

with app.app_context():
    if not AdminUser.query.filter_by(username="Superior Master").first():
        admin = AdminUser(username="Superior Master")
        admin.set_password("Chidera@2006")  # change this immediately!
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin user created: ", admin.username, admin.password)
    else:
        print("⚠ Admin user already exists")