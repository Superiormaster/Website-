from app import create_app
from config import Config
from app.extensions import socketio

app = create_app(Config)

if __name__ == "__main__":
    socketio.run(app, debug=True, host="127.0.0.1", port=5000)