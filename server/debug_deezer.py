import requests

artist_id = "525046"

# Check Artist details
print("--- Artist Details ---")
try:
    url = f"https://api.deezer.com/artist/{artist_id}"
    print(f"Fetching {url}")
    resp = requests.get(url).json()
    print("Name:", resp.get('name'))
    print("Nb Fan:", resp.get('nb_fan'))
except Exception as e:
    print(e)

# Check Search Track
print("\n--- Search Track 'artist:Kendrick Lamar' ---")
try:
    url = "https://api.deezer.com/search/track?q=artist:\"Kendrick Lamar\""
    print(f"Fetching {url}")
    resp = requests.get(url).json()
    items = resp.get('data', [])
    print(f"Found {len(items)} items")
    if items:
        print("First item:", items[0].get('title'), items[0].get('preview'))
except Exception as e:
    print(e)
