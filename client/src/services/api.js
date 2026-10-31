import axios from 'axios';

// Dynamically determine the base API URL
// In development: uses VITE_API_URL or falls back to current host:5000
// In production: uses VITE_API_URL set in deployment environment
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
};

export default api;
