import requests
import urllib.parse

class DeezerClient:
    def search_artists(self, query):
        try:
            url = f"https://api.deezer.com/search/artist?q={urllib.parse.quote(query)}"
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                return []
            
            data = response.json()
            artists = []
            for item in data.get('data', []):
                artists.append({
                    "id": str(item.get('id')),
                    "name": item.get('name'),
                    "images": [{"url": item.get('picture_medium')}] if item.get('picture_medium') else [],
                    "followers": {"total": item.get('nb_fan', 0)}
                })
            return artists
        except Exception as e:
            print(f"Deezer search error: {e}")
            return []

    def get_top_tracks(self, artist_id):
        try:
            url = f"https://api.deezer.com/artist/{artist_id}/top?limit=50"
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                return []
            
            data = response.json()
            tracks = []
            for item in data.get('data', []):
                if item.get('preview'): # Only include tracks with previews
                    tracks.append({
                        "id": str(item.get('id')),
                        "name": item.get('title'),
                        "preview_url": item.get('preview'),
                        "album": {
                            "images": [{"url": item.get('album', {}).get('cover_medium')}]
                        },
                        "artists": [{"name": item.get('artist', {}).get('name')}]
                    })
            return tracks
        except Exception as e:
            print(f"Deezer tracks error: {e}")
            return []

    def get_artist_name(self, artist_id):
        try:
            url = f"https://api.deezer.com/artist/{artist_id}"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return response.json().get('name')
        except:
            pass
        return None

class ITunesClient:
    def search_artists(self, query):
        try:
            url = f"https://itunes.apple.com/search?term={urllib.parse.quote(query)}&entity=musicArtist&limit=5"
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                return []
            
            data = response.json()
            artists = []
            for item in data.get('results', []):
                artists.append({
                    "id": str(item.get('artistId')),
                    "name": item.get('artistName'),
                    "images": [], # iTunes search doesn't always give artist images easily
                    "followers": {"total": 0}
                })
            return artists
        except Exception as e:
            print(f"iTunes search error: {e}")
            return []

    def get_top_tracks(self, artist_id):
        try:
            # iTunes lookup by artist ID to get top songs
            url = f"https://itunes.apple.com/lookup?id={artist_id}&entity=song&limit=50"
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                return []
            
            data = response.json()
            tracks = []
            # First item is usually the artist info, subsequent are tracks
            for item in data.get('results', []):
                if item.get('wrapperType') == 'track' and item.get('previewUrl'):
                    # Replace 100x100 with 600x600 artwork
                    art_url = item.get('artworkUrl100', '')
                    art_url = art_url.replace('100x100bb.jpg', '600x600bb.jpg')
                    tracks.append({
                        "id": str(item.get('trackId')),
                        "name": item.get('trackName'),
                        "preview_url": item.get('previewUrl'),
                        "album": {
                            "images": [{"url": art_url}]
                        },
                        "artists": [{"name": item.get('artistName')}]
                    })
            return tracks
        except Exception as e:
            print(f"iTunes tracks error: {e}")
            return []

class MusicClient:
    def __init__(self):
        self.deezer = DeezerClient()
        self.itunes = ITunesClient()
        print("[MusicClient] Initialized (Deezer Primary, iTunes Secondary)")

    def search_artists(self, query):
        # Try Deezer first
        results = self.deezer.search_artists(query)
        if results:
            print(f"[MusicClient] Found {len(results)} artists on Deezer for '{query}'")
            for r in results: r['source'] = 'deezer'
            return results
        
        # Fallback to iTunes
        print(f"[MusicClient] Deezer empty, checking iTunes for '{query}'...")
        results = self.itunes.search_artists(query)
        if results:
            for r in results: r['source'] = 'itunes'
            return results
            
        return []

    def get_top_tracks(self, artist_id, source=None, name=None):
        print(f"[MusicClient] Fetching tracks for ID {artist_id} (Source: {source}, Name: {name})")
        
        # If explicitly iTunes sourced, fetch directly from iTunes
        if source == 'itunes':
            tracks = self.itunes.get_top_tracks(artist_id)
            if tracks:
                return tracks
            return []

        # 1. Try Deezer Tracks (or if unknown source assume Deezer ID)
        if source == 'deezer' or not source:
            tracks = self.deezer.get_top_tracks(artist_id)
            if tracks:
                print(f"[MusicClient] Found {len(tracks)} tracks on Deezer for ID {artist_id}")
                return tracks
                
            print(f"[MusicClient] Deezer tracks empty. Attempting iTunes fallback...")
        
        # 2. To use iTunes fallback, we need the Artist Name
        artist_name = name or self.deezer.get_artist_name(artist_id)
        
        if artist_name:
            print(f"[MusicClient] Searching iTunes tracks for artist name: '{artist_name}'")
            itunes_artists = self.itunes.search_artists(artist_name)
            if itunes_artists:
                itunes_id = itunes_artists[0]['id']
                print(f"[MusicClient] Found iTunes Artist ID: {itunes_id}")
                tracks = self.itunes.get_top_tracks(itunes_id)
                if tracks:
                    return tracks
        
        print(f"[MusicClient] Could not find tracks on Deezer or iTunes fallback for ID {artist_id}")
        return []
