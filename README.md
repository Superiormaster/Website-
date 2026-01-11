SuperiormasterInt'l.com Website

Overview

This is a professional, modern, and fully responsive portfolio website built using React.js for the frontend and Flask for the backend. It showcases my skills, projects, and apps, and allows visitors to view and download my work.

The project demonstrates:

A modular Flask backend with API endpoints and admin panel

Dynamic React frontend fetching data from the backend

Responsive design with Tailwind CSS

Smooth animations with Framer Motion

File upload and management for projects and apps

Features

Frontend

Hero section with smooth animations

Portfolio section with project cards

Apps section with downloadable mobile apps

Contact section with email link

Responsive navbar with mobile-friendly menu

Tailwind CSS for clean styling

Backend

Flask modular structure

SQLite database (can switch to PostgreSQL for production)

RESTful API endpoints for portfolio projects and apps

Flask-Admin panel for managing content

Admin authentication with Flask-Login & Bcrypt

Image upload support with safe storage in static/uploads

Tech Stack

Layer	Technology

Frontend	React.js, Tailwind CSS, Framer Motion, Axios
Backend	Flask, Flask-CORS, Flask-SQLAlchemy, Flask-Login, Flask-Bcrypt, Flask-Admin
Database	SQLite (development)
Hosting	Backend: Railway/Heroku/Render, Frontend: Vercel/Netlify

Getting Started

Prerequisites

Node.js (v18+) & npm (v9+)

Python (v3.10+)

Git

1️⃣ Clone the repository

git clone https://github.com/Superiormaster/Website-.git
cd Website-

2️⃣ Setup Backend (Flask)

cd backend
python -m venv venv
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

Initialize the database:

python
>>> from app import create_app
>>> from app.extensions import db
>>> app = create_app()
>>> with app.app_context():
>>>     db.create_all()
>>> exit()

Run the backend:

python run.py

Backend API will be available at: http://127.0.0.1:5000/


---

3️⃣ Setup Frontend (React)

cd ../frontend
npm install
npm run dev

Frontend will be available at: http://localhost:3000/

Make sure backend is running, as frontend fetches data dynamically from Flask API.

Folder Structure

portfolio-project/
├── backend/           # Flask backend
│   ├── app/
│   │   ├── models.py
│   │   ├── routes/
│   │   ├── utils/
│   │   └── static/uploads
│   ├── config.py
│   └── run.py
├── frontend/          # React frontend
│   ├── src/components/
│   ├── src/pages/
│   ├── src/assets/
│   ├── App.jsx
│   └── index.js
├── README.md
└── package.json

API Endpoints

Endpoint	Method	Description

/api/portfolio	GET	Returns all portfolio projects
/api/apps	GET	Returns all apps
/admin	GET/POST	Admin panel to manage projects/apps

Adding Projects or Apps

Use the admin panel to add/edit/delete projects or apps.

Images should be uploaded via the panel and stored in static/uploads.

The frontend will automatically fetch new data.

Deployment

Backend: Deploy using Railway, Render, or Heroku

Frontend: Deploy using Vercel or Netlify

Ensure CORS is configured to allow frontend requests to the backend domain.

Contact

Email: ejeziepaschal@gmail.com

GitHub: https://github.com/Superiormaster

License

This project is open-source and available under the MIT License.



1️⃣ Project Overview
This is a full-stack Portfolio Website with a clean separation between:
React Public Website → For portfolio visitors
Flask API → Backend API only
React Admin Dashboard → For managing projects, apps, and messages
Key Principles:
Flask serves API only (no Jinja templates, no Flask-Admin)
React Admin is fully JWT-protected
Scalable architecture: future apps (dating, social media) can reuse backend and admin
2️⃣ Architecture
Copy code

React Public Website  →  Flask API  ←  React Admin Dashboard
Details:
Component
Tech Stack
Purpose
React Public Website
ReactJS
Display portfolio projects & contact form
Flask API
Flask + SQLAlchemy
Serve data, manage admin authentication
React Admin Dashboard
ReactJS + Axios
Admin CRUD for projects, messages, apps
3️⃣ Backend Structure (Flask)
Copy code

portfolio_backend/
│
├── app/
│   ├── __init__.py        # App factory
│   ├── config.py          # Config + JWT secret
│   ├── extensions.py      # DB, JWT, Migrate
│
│   ├── models/
│   │   ├── admin_user.py
│   │   ├── project.py
│   │   ├── app_download.py
│   │   └── contact_message.py
│
│   ├── routes/
│   │   ├── public.py      # Public routes
│   │   └── admin.py       # Admin routes (JWT protected)
│
│   ├── auth/
│   │   └── jwt.py         # JWT helpers (optional)
│
│   └── utils/
│       └── upload_utils.py  # File upload logic
│
├── migrations/            # DB migrations
├── seed_admin.py          # Create initial admin user
├── run.py                 # App entry point
└── requirements.txt
4️⃣ Backend Features
Admin routes (JWT protected)
POST /api/admin/login – login with username & password → returns JWT
POST /api/admin/projects – create new project
DELETE /api/admin/projects/<id> – delete project
GET /api/admin/messages – view contact messages
Public routes
GET /api/projects – list all projects
POST /api/contact – send contact message
5️⃣ React Admin Structure
Copy code

portfolio-admin/
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   └── Messages.jsx
│
├── services/
│   └── api.js           # Axios setup with JWT
│
└── utils/
    └── auth.js          # Token management
API Connection: Axios automatically sends Authorization: Bearer <token> header.
6️⃣ JWT Authentication
Installed with flask-jwt-extended
Secret key defined in config.py
Admin logs in → receives JWT → stored in localStorage → used in React Admin API calls
7️⃣ Deployment Guidelines
Backend (Flask API):
Host options: Render, Railway, VPS
Environment variables:
Copy code
Bash
FLASK_ENV=production
JWT_SECRET_KEY=change_this_secret
SQLALCHEMY_DATABASE_URI=sqlite:///portfolio.db   # or Postgres/Other
React Public & Admin:
Host public site: Netlify / Vercel
Host admin dashboard: private Netlify / password-protected Vercel (optional)
React Environment Variable:
Copy code
Bash
REACT_APP_API_URL=https://api.yoursite.com
8️⃣ Setup Instructions
Backend
Copy code
Bash
git clone <repo-url> portfolio_backend
cd portfolio_backend
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Run migrations
export FLASK_APP=run.py
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed admin
python seed_admin.py

# Run server
flask run
React Admin / Public
Copy code
Bash
cd portfolio-admin   # or portfolio-public
npm install
npm run dev
9️⃣ Notes & Best Practices
No Flask-Admin, no HTML login → React Admin handles everything
Scalable → You can reuse Flask API for future apps (Meet-Me, Tribe)
JWT security → Protect admin routes; never expose secret key publicly
Upload logic → utils/upload_utils.py handles files
Delete unused legacy code → Flask-Login, API key auth, Jinja templates