import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import Navigation from './components/Navigation';
import { ShieldCheck, Database, LogOut } from 'lucide-react';
import { supabase, getProfile, signOut } from './services/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
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
    <div className="min-h-screen w-full flex justify-center items-center bg-[#050505] overflow-hidden font-sans">
      {/* 450px Max Width Desktop Frame -> 9:16 mobile viewport on desktop */}
      <div className="w-full max-w-[450px] h-[100dvh] md:h-[88dvh] md:min-h-[800px] md:rounded-[2.5rem] bg-surface md:border-[6px] md:border-[#1A1A1A] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col z-10">
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
          ) : activeTab === 'search' ? (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              onSelectArtist={(artist) => setSelectedArtist(artist)}
            />
          ) : activeTab === 'stats' ? (
            <Leaderboard onPlayArtist={(artist) => setSelectedArtist(artist)} />
          ) : activeTab === 'user' ? (
            <div className="h-full flex flex-col items-center justify-between p-6 sm:p-8 text-center overflow-y-auto hidden-scrollbar">
              <div className="w-full flex flex-col items-center space-y-3 mt-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/40 p-1 shadow-2xl">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-2xl font-black text-white">
                      {user.username ? user.username[0]?.toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-surface p-1.5 rounded-full shadow-lg">
                    <ShieldCheck size={14} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    {user.name}
                  </h3>
                  <p className="font-mono text-xs font-bold text-primary mt-0.5">
                    @{user.username || 'user'}
                  </p>
                </div>
              </div>

              {/* Status details card */}
              <div className="w-full bg-surface-container rounded-2xl p-4 border border-white/5 space-y-2.5 text-left my-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Account Type:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} className="text-primary" />
                    <span>{user.role || 'Player'}</span>
                  </span>
                </div>
                {user.email && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Google ID:</span>
                    <span className="text-white font-mono text-[11px] truncate max-w-[170px]">
                      {user.email}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Database Cloud:</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Database size={12} />
                    <span>Supabase Live</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Leaderboard Sync:</span>
                  <span className="text-[#88EBFF] font-semibold">Active</span>
                </div>
              </div>

              {/* Sign Out CTA */}
              <button
                onClick={handleLogout}
                className="w-full py-3.5 px-6 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mb-20"
              >
                <LogOut size={14} />
                <span>Disconnect & Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-on-surface-variant">
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

export default App;
