import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ExploreView from './components/ExploreView';
import ProfileView from './components/ProfileView';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase, getProfile, signOut } from './services/supabase';
import { musicService } from './services/api';

function MainApp() {
  const [user, setUser] = useState(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Check Supabase Auth State & Restore Session
  useEffect(() => {
    let isMounted = true;

    const syncUser = async (sessionUser) => {
      if (!sessionUser) {
        // Fallback to local guest user if available
        const stored = localStorage.getItem('sonicpulse_user');
        if (stored && isMounted) {
          try {
            setUser(JSON.parse(stored));
          } catch (e) {}
        }
        if (isMounted) setAuthLoading(false);
        return;
      }

      // Check if user already claimed a username in public.profiles
      const profile = await getProfile(sessionUser.id);

      if (!isMounted) return;

      if (profile && profile.username) {
        const fullUser = {
          id: sessionUser.id,
          name: profile.full_name || profile.username,
          username: profile.username,
          avatar_url:
            profile.avatar_url ||
            sessionUser.user_metadata?.avatar_url ||
            sessionUser.user_metadata?.picture,
          email: sessionUser.email,
          role: 'Verified Superfan',
        };
        setUser(fullUser);
        localStorage.setItem('sonicpulse_user', JSON.stringify(fullUser));
        setNeedsOnboarding(false);
      } else {
        // First-time Google user -> Show "Claim Your Handle" Onboarding
        setPendingGoogleUser(sessionUser);
        setNeedsOnboarding(true);
      }
      setAuthLoading(false);
    };

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user);
    });

    // Listen to OAuth redirect / auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Guest login handler
  const handleGuestLogin = (guestData) => {
    setUser(guestData);
    localStorage.setItem('sonicpulse_user', JSON.stringify(guestData));
  };

  // Onboarding completion
  const handleOnboardingComplete = (profileData) => {
    setUser(profileData);
    localStorage.setItem('sonicpulse_user', JSON.stringify(profileData));
    setNeedsOnboarding(false);
    setPendingGoogleUser(null);
  };

  // Sign out
  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setSelectedArtist(null);
    setNeedsOnboarding(false);
    setPendingGoogleUser(null);
    localStorage.removeItem('sonicpulse_user');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-primary font-display font-bold uppercase tracking-widest text-xs animate-pulse">
        Connecting to SonicPulse Cloud...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#070709] overflow-hidden font-sans p-0 sm:p-2 md:p-4">
      {/* 
        Responsive viewport shell:
        - Full viewport on mobile
        - Expands cleanly for foldables (e.g. Z Fold passport ratio up to 680px)
        - Constrained max-w-[540px] or adaptive on larger screens
      */}
      <div className="w-full h-[100dvh] sm:h-[94dvh] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[580px] sm:rounded-[2.5rem] bg-surface sm:border-[4px] sm:border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col z-10 transition-all">
        {/* Main View Router */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar relative z-0">
          {needsOnboarding && pendingGoogleUser ? (
            <Onboarding
              user={pendingGoogleUser}
              onComplete={handleOnboardingComplete}
            />
          ) : !user ? (
            <Login onGuestLogin={handleGuestLogin} />
          ) : selectedArtist ? (
            <Game
              artist={selectedArtist}
              user={user}
              onBack={() => setSelectedArtist(null)}
            />
          ) : activeTab === 'home' || activeTab === 'search' ? (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              onSelectArtist={(artist) => setSelectedArtist(artist)}
            />
          ) : activeTab === 'explore' ? (
            <ExploreView
              onSelectGenre={(genre) =>
                setSelectedArtist({
                  id: genre.id,
                  name: genre.name,
                  isGenre: true,
                  artists: genre.artists,
                  images: [{ url: genre.image }],
                })
              }
            />
          ) : activeTab === 'stats' ? (
            <Leaderboard onPlayArtist={(artist) => setSelectedArtist(artist)} />
          ) : activeTab === 'user' ? (
            <ProfileView
              user={user}
              onLogout={handleLogout}
              onReplayArtist={async (artistName) => {
                try {
                  const results = await musicService.searchArtists(artistName);
                  if (results && results[0]) {
                    setSelectedArtist(results[0]);
                  } else {
                    setSelectedArtist({ id: artistName, name: artistName });
                  }
                } catch (e) {
                  setSelectedArtist({ id: artistName, name: artistName });
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-on-surface-variant font-mono text-xs">
              View coming soon...
            </div>
          )}
        </div>

        {/* Floating Glass Bottom Nav */}
        {user && !selectedArtist && !needsOnboarding && (
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

export default App;
