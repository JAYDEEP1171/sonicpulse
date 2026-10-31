import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from music_client import MusicClient

load_dotenv()

app = Flask(__name__)
# Enable CORS for all domains for development and preview deployments
CORS(app, resources={r"/api/*": {"origins": "*"}})

music_client = MusicClient()

ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASS = os.getenv("ADMIN_PASS", "pass123")

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "status": "online",
        "service": "SonicPulse Music Reflex API",
        "version": "2.0.0",
        "endpoints": [
            "/api/health",
            "/api/login",
            "/api/search?q=<artist>",
            "/api/artist/<id>/tracks"
        ]
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "SonicPulse Backend Online",
        "audio_sources": ["Deezer (Primary)", "iTunes (Fallback)"]
    }), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')

    if username == ADMIN_USER and password == ADMIN_PASS:
        return jsonify({
            "success": True,
            "user": {
                "name": "Jaydeep",
                "role": "Developer / Tester",
                "id": "SP-001"
            }
        }), 200
    
    return jsonify({"success": False, "message": "Invalid credentials. Use admin / pass123"}), 401

@app.route('/api/search', methods=['GET'])
def search_artists():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])
    
    results = music_client.search_artists(query)
    return jsonify(results)

@app.route('/api/artist/<artist_id>/tracks', methods=['GET'])
def get_artist_tracks(artist_id):
    source = request.args.get('source')
    name = request.args.get('name')
    tracks = music_client.get_top_tracks(artist_id, source=source, name=name)
    return jsonify(tracks)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    print(f"[SonicPulse] Server starting on {host}:{port}")
    app.run(debug=debug, host=host, port=port)
