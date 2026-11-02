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

// Leaderboard Helpers (with Artist/Genre Filtering)
export const recordGameScore = async ({
  userId,
  username,
  artistName,
  score,
  accuracy,
  avgSpeed,
  tier,
}) => {
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

    const { data, error } = await query.limit(limit);

    if (error) {
      console.warn('Could not fetch leaderboard:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('fetchLeaderboard exception:', err);
    return [];
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
