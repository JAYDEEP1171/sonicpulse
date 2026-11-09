import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://opchvjqylafxpdufzdyg.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2h2anF5bGFmeHBkdWZ6ZHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MzM2NjcsImV4cCI6MjEwOTEwOTY2N30.sfRAjIIuF1lqnrVVWW7lo3Cl4OiqZ6JolZw3xm5tKUA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Helpers
export const signInWithGoogle = async () => {
  const redirectUrl =
    typeof window !== 'undefined' ? window.location.origin : undefined;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Sign out error:', error);
};

// Profile Helpers
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('getProfile exception:', err);
    return null;
  }
};

export const saveProfile = async ({ id, username, full_name, avatar_url }) => {
  const cleanUsername = username.trim().replace(/^@/, '');
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id,
      username: cleanUsername,
      full_name,
      avatar_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Leaderboard Helpers (with Artist/Genre Filtering & Deduplication)
export const recordGameScore = async ({
  userId,
  username,
  artistName,
  score,
  accuracy,
  avgSpeed,
  tier,
}) => {
  const historyItem = {
    id: `local_${Date.now()}`,
    user_id: userId,
    username,
    artist_name: artistName,
    score,
    accuracy: Math.round(accuracy),
    avg_speed: parseFloat(avgSpeed) || 0,
    tier,
    created_at: new Date().toISOString(),
  };

  // 1. Save to local storage history
  try {
    const existing = JSON.parse(localStorage.getItem('sonicpulse_history') || '[]');
    localStorage.setItem(
      'sonicpulse_history',
      JSON.stringify([historyItem, ...existing].slice(0, 50))
    );
  } catch (e) {}

  // 2. Persist to Supabase if available
  try {
    const { data, error } = await supabase.from('leaderboard').insert([
      {
        user_id: userId,
        username,
        artist_name: artistName,
        score,
        accuracy: Math.round(accuracy),
        avg_speed: parseFloat(avgSpeed) || 0,
        tier,
      },
    ]);

    if (error) {
      console.warn('Could not record score:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('recordGameScore exception:', err);
    return null;
  }
};

export const fetchLeaderboard = async (artistFilter = null, limit = 35) => {
  try {
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false });

    if (artistFilter && artistFilter !== 'ALL') {
      query = query.ilike('artist_name', `%${artistFilter.trim()}%`);
    }

    // Fetch batch so we can deduplicate down to unique highest personal scores
    const { data, error } = await query.limit(100);

    if (error) {
      console.warn('Could not fetch leaderboard:', error.message);
      return [];
    }

    const rows = data || [];
    // Deduplicate: Keep only the single highest score for each (user, artist)
    const seenUserArtist = new Set();
    const deduped = [];

    for (const entry of rows) {
      const userKey = entry.user_id || entry.username?.toLowerCase() || 'anon';
      const artistKey = entry.artist_name?.toLowerCase().trim() || 'all';
      const compoundKey = `${userKey}__${artistKey}`;

      if (!seenUserArtist.has(compoundKey)) {
        seenUserArtist.add(compoundKey);
        deduped.push(entry);
        if (deduped.length >= limit) break;
      }
    }

    return deduped;
  } catch (err) {
    console.error('fetchLeaderboard exception:', err);
    return [];
  }
};

export const fetchUserHistory = async (userId, username) => {
  try {
    let remoteData = [];
    if (userId || username) {
      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (username) {
        query = query.eq('username', username);
      }

      const { data, error } = await query.limit(60);
      if (!error && data) {
        remoteData = data;
      }
    }

    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem('sonicpulse_history') || '[]');
    } catch (e) {}

    const all = [...remoteData];
    const existingIds = new Set(all.map((item) => item.id || item.created_at));
    for (const item of localData) {
      const id = item.id || item.created_at;
      if (!existingIds.has(id)) {
        all.push(item);
      }
    }

    all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return all;
  } catch (err) {
    console.error('fetchUserHistory error:', err);
    return JSON.parse(localStorage.getItem('sonicpulse_history') || '[]');
  }
};

export const fetchLeaderboardArtists = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('artist_name')
      .order('artist_name');

    if (error || !data) return [];
    return Array.from(new Set(data.map((d) => d.artist_name))).filter(Boolean);
  } catch (e) {
    return [];
  }
};

// User Feedback Submission Helper
export const submitFeedback = async ({
  userId = null,
  username = 'Anonymous',
  rating = 5,
  category = 'general',
  message = '',
}) => {
  try {
    // 1. Try to record to Supabase feedback table if available
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: userId,
          username,
          rating,
          category,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase feedback insert note:', error.message);
    }

    // 2. Also record in local fallback storage so no feedback is ever lost
    try {
      const existing = JSON.parse(localStorage.getItem('sonicpulse_feedback') || '[]');
      existing.unshift({
        id: Date.now(),
        userId,
        username,
        rating,
        category,
        message,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('sonicpulse_feedback', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {}

    return { success: true };
  } catch (err) {
    console.error('submitFeedback error:', err);
    return { success: false, error: err.message };
  }
};

