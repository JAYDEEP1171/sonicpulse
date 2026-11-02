import axios from 'axios';

// Dynamically determine the base API URL
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const CURATED_GENRES = [
  {
    id: 'dhh',
    name: 'DHH (Desi Hip Hop)',
    badge: 'UNDERGROUND BARS',
    description: 'Seedhe Maut, KR$NA, DIVINE & Raftaar',
    artists: ['Seedhe Maut', 'KR$NA', 'DIVINE', 'Raftaar'],
    gradient: 'from-orange-600/30 via-red-950/40 to-surface-container',
    border: 'border-orange-500/40',
    accent: 'text-orange-400',
    tagBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    iconColor: '#FB923C',
  },
  {
    id: 'rap-90s',
    name: '90s Golden Era Rap',
    badge: 'BOOM-BAP ERA',
    description: '2Pac, The Notorious B.I.G., Eminem & Nas',
    artists: ['2Pac', 'The Notorious B.I.G.', 'Eminem', 'Snoop Dogg'],
    gradient: 'from-amber-600/30 via-yellow-950/40 to-surface-container',
    border: 'border-amber-500/40',
    accent: 'text-amber-400',
    tagBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    iconColor: '#FBBF24',
  },
  {
    id: 'synthwave',
    name: '80s Retro & Synthwave',
    badge: 'NEON NOIR',
    description: 'The Weeknd, Michael Jackson, Daft Punk & Madonna',
    artists: ['The Weeknd', 'Michael Jackson', 'Daft Punk'],
    gradient: 'from-purple-600/30 via-fuchsia-950/40 to-surface-container',
    border: 'border-purple-500/40',
    accent: 'text-purple-400',
    tagBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    iconColor: '#C084FC',
  },
  {
    id: 'pop-2010s',
    name: '2010s Pop Anthems',
    badge: 'STADIUM HOOKS',
    description: 'Taylor Swift, Dua Lipa, Ariana Grande & Bruno Mars',
    artists: ['Taylor Swift', 'Dua Lipa', 'Ariana Grande', 'Bruno Mars'],
    gradient: 'from-emerald-600/30 via-teal-950/40 to-surface-container',
    border: 'border-emerald-500/40',
    accent: 'text-primary',
    tagBg: 'bg-primary/10 text-primary border-primary/20',
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=600&auto=format&fit=crop',
    iconColor: '#72FE8F',
  },
  {
    id: 'rock-legends',
    name: 'Rock & Alt Legends',
    badge: 'ARENA RIFFS',
    description: 'Queen, Nirvana, Arctic Monkeys & Coldplay',
    artists: ['Queen', 'Arctic Monkeys', 'Nirvana', 'Coldplay'],
    gradient: 'from-cyan-600/30 via-blue-950/40 to-surface-container',
    border: 'border-cyan-500/40',
    accent: 'text-cyan-400',
    tagBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
    iconColor: '#22D3EE',
  },
  {
    id: 'bollywood',
    name: 'Bollywood Hits & Classics',
    badge: 'DESI MELODIES',
    description: 'Arijit Singh, A.R. Rahman, KK & Kishore Kumar',
    artists: ['Arijit Singh', 'A. R. Rahman', 'KK', 'Kishore Kumar'],
    gradient: 'from-rose-600/30 via-pink-950/40 to-surface-container',
    border: 'border-rose-500/40',
    accent: 'text-rose-400',
    tagBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    iconColor: '#FB7185',
  },
];

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/api/login', { username, password });
    return res.data;
  },
};

export const musicService = {
  searchArtists: async (query) => {
    const res = await api.get('/api/search', { params: { q: query } });
    return res.data;
  },
  getArtistTracks: async (artistId, source = null, name = null) => {
    const res = await api.get(`/api/artist/${artistId}/tracks`, {
      params: { source, name },
    });
    return res.data;
  },
  getGenreTracks: async (genre) => {
    // Fetches top tracks from prominent artists of the chosen genre
    const trackPromises = genre.artists.map(async (artistName) => {
      try {
        const results = await musicService.searchArtists(artistName);
        if (results && results.length > 0) {
          const match = results[0];
          const artistTracks = await musicService.getArtistTracks(match.id, match.source, match.name);
          return (artistTracks || []).slice(0, 15);
        }
      } catch (e) {
        console.warn('Could not fetch genre tracks for:', artistName, e);
      }
      return [];
    });

    const nested = await Promise.all(trackPromises);
    const combined = nested.flat();
    return combined;
  },
};

export default api;
