import os
import requests
import base64
import time
from mock_data import MOCK_ARTISTS, MOCK_TRACKS

class SpotifyClient:
    def __init__(self, use_mock=False):
        self.use_mock = use_mock or os.getenv('MOCK_MODE', 'false').lower() == 'true'
        self.client_id = os.getenv('SPOTIPY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')
        self.token = None
        self.token_expiry = 0
        
        if self.use_mock:
            print("🚀 SpotifyClient initialized in MOCK MODE")

    def _get_auth_header(self):
        auth_str = f"{self.client_id}:{self.client_secret}"
        b64_auth = base64.b64encode(auth_str.encode()).decode()
        return {"Authorization": f"Basic {b64_auth}"}

    def get_token(self):
        if self.use_mock:
            return "mock_token"

        # Refresh token if expired or close to expiry (within 60s)
        if not self.token or time.time() > self.token_expiry - 60:
            if not self.client_id or not self.client_secret:
                print("⚠️  Missing Credentials. Switching to Mock Mode.")
                self.use_mock = True
                return "mock_token"

            url = "https://accounts.spotify.com/api/token"
            headers = self._get_auth_header()
            data = {"grant_type": "client_credentials"}
            
            try:
                response = requests.post(url, headers=headers, data=data)
                if response.status_code != 200:
                    print(f"Failed to get token: {response.text}")
                    return None
                
                json_response = response.json()
                self.token = json_response['access_token']
                self.token_expiry = time.time() + json_response['expires_in']
            except Exception as e:
                print(f"Error connecting to Spotify: {e}")
                return None
        
        return self.token

    def search_artists(self, query):
        if self.use_mock:
            # Simple case-insensitive mock search
            return [a for a in MOCK_ARTISTS if query.lower() in a['name'].lower()]

        token = self.get_token()
        if not token: # Fallback if token fails
            return [a for a in MOCK_ARTISTS if query.lower() in a['name'].lower()]
        
        headers = {"Authorization": f"Bearer {token}"}
        params = {"q": query, "type": "artist", "limit": 5}
        
        try:
            response = requests.get("https://api.spotify.com/v1/search", headers=headers, params=params)
            if response.status_code != 200:
                return []
            return response.json().get("artists", {}).get("items", [])
        except Exception:
            return []

    def get_top_tracks(self, artist_id):
        if self.use_mock:
            # Return all mock tracks for any artist for now (or filter by artist if we had that mapping)
            return MOCK_TRACKS

        token = self.get_token()
        if not token:
            return MOCK_TRACKS

        headers = {"Authorization": f"Bearer {token}"}
        # Hardcoding country=US for now to ensure availability
        url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?market=US"
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                return []

            tracks = response.json().get("tracks", [])
            # Critical: Filter for tracks with preview_url
            playable_tracks = [t for t in tracks if t.get('preview_url')]
            return playable_tracks
        except Exception:
            return []
