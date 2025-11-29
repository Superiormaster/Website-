from .extensions import db
from datetime import datetime

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.String(250))  # stored filename
    live_url = db.Column(db.String(250))
    github_url = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "image": self.image,
            "live_url": self.live_url,
            "github_url": self.github_url,
            "created_at": self.created_at.isoformat()
        }

class AppDownload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.String(250))
    download_url = db.Column(db.String(250))
    web_url = db.Column(db.String(250))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "download_url": self.download_url,
            "web_url": self.web_url
        }