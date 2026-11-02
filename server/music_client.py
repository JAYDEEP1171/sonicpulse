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

    def search_tracks(self, artist_name, limit=50):
        try:
            url = f"https://api.deezer.com/search?q=artist:\"{urllib.parse.quote(artist_name)}\"&limit={limit}"
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                return []
            data = response.json()
            tracks = []
            for item in data.get('data', []):
                if item.get('preview'):
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
            print(f"Deezer search tracks error: {e}")
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

    def search_tracks(self, artist_name, limit=100):
        try:
            url = f"https://itunes.apple.com/search?term={urllib.parse.quote(artist_name)}&entity=song&limit={limit}"
            response = requests.get(url, timeout=8)
            if response.status_code != 200:
                return []
            data = response.json()
            tracks = []
            for item in data.get('results', []):
                if item.get('wrapperType') == 'track' and item.get('previewUrl'):
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
            print(f"iTunes search tracks error: {e}")
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
        pool = []
        artist_name = name

        # 1. Fetch primary tracks based on source
        if source == 'itunes':
            pool.extend(self.itunes.get_top_tracks(artist_id))
        else:
            deezer_tracks = self.deezer.get_top_tracks(artist_id)
            pool.extend(deezer_tracks)
            if not artist_name:
                artist_name = self.deezer.get_artist_name(artist_id)

        # 2. Expand track pool with iTunes search (gives 40-100 tracks!)
        if artist_name:
            print(f"[MusicClient] Expanding track pool for '{artist_name}' via iTunes...")
            itunes_pool = self.itunes.search_tracks(artist_name, limit=60)
            pool.extend(itunes_pool)

            # Also try Deezer search if pool is still small
            if len(pool) < 25:
                deezer_pool = self.deezer.search_tracks(artist_name, limit=40)
                pool.extend(deezer_pool)

        # 3. Deduplicate tracks by normalized song title
        seen_titles = set()
        deduped = []
        for t in pool:
            if not t.get('preview_url') or not t.get('name'):
                continue
            clean_title = t['name'].lower().split('(')[0].split('-')[0].strip()
            if clean_title and clean_title not in seen_titles:
                seen_titles.add(clean_title)
                deduped.append(t)

        print(f"[MusicClient] Total unique preview tracks ready: {len(deduped)}")
        return deduped
