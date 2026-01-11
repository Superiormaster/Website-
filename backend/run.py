from app import create_app
from config import Config
from app.extensions import socketio

app = create_app(Config)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, debug=True, host="0.0.0.0", port=port)