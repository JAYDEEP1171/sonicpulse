# Using royalty-free/public domain samples for demonstration
# In a real scenario with Spotify API, these would be 30s preview_urls provided by Spotify.

MOCK_ARTISTS = [
    {
        "id": "mock_weeknd",
        "name": "The Weeknd",
        # Using a reliable persistent image (Unsplash dark aesthetic)
        "images": [{"url": "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop", "height": 640, "width": 640}],
        "genres": ["canadian pop", "pop", "r&b"],
        "popularity": 98
    },
    {
        "id": "mock_daft_punk",
        "name": "Daft Punk",
        "images": [{"url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop", "height": 640, "width": 640}],
        "genres": ["electro", "filter house"],
        "popularity": 85
    }
]

# Using some reliable CDN hosted shortened samples or placeholder MP3s
# Note: These are example URLs. 
SAMPLE_MP3_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
SAMPLE_MP3_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
SAMPLE_MP3_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"

MOCK_TRACKS = [
    {"id": "t1", "name": "Blinding Lights", "album": {"name": "After Hours", "images": [{"url": "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_1},
    {"id": "t2", "name": "Starboy", "album": {"name": "Starboy", "images": [{"url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_2},
    {"id": "t3", "name": "The Hills", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_3},
    {"id": "t4", "name": "Save Your Tears", "album": {"name": "After Hours", "images": [{"url": "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_1},
    {"id": "t5", "name": "Can't Feel My Face", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_2},
    {"id": "t6", "name": "I Feel It Coming", "album": {"name": "Starboy", "images": [{"url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_3},
    {"id": "t7", "name": "Die For You", "album": {"name": "Starboy", "images": [{"url": "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_1},
    {"id": "t8", "name": "Call Out My Name", "album": {"name": "My Dear Melancholy,", "images": [{"url": "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_2},
    {"id": "t9", "name": "Wicked Games", "album": {"name": "Trilogy", "images": [{"url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_3},
    {"id": "t10", "name": "Often", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1621360841013-c768371e93cf?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_1},
    {"id": "t11", "name": "Earned It", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_2},
    {"id": "t12", "name": "In The Night", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_3},
    {"id": "t13", "name": "Acquainted", "album": {"name": "Beauty Behind The Madness", "images": [{"url": "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_1},
    {"id": "t14", "name": "Secrets", "album": {"name": "Starboy", "images": [{"url": "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_2},
    {"id": "t15", "name": "Reminder", "album": {"name": "Starboy", "images": [{"url": "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=300"}]}, "preview_url": SAMPLE_MP3_3},
]
