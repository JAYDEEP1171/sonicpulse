import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Navigation from './components/Navigation';
import { BarChart2, ShieldCheck, Zap } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  // Check stored session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sonicpulse_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('sonicpulse_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedArtist(null);
    localStorage.removeItem('sonicpulse_user');
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#050505] overflow-hidden font-sans">
      {/* 450px Max Width Desktop Frame -> 9:16 mobile viewport simulation on desktop */}
      <div className="w-full max-w-[450px] h-[100dvh] md:h-[88dvh] md:min-h-[800px] md:rounded-[2.5rem] bg-surface md:border-[6px] md:border-[#1A1A1A] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col z-10">
        
        {/* Main View Router */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar relative z-0">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : selectedArtist ? (
            <Game artist={selectedArtist} onBack={() => setSelectedArtist(null)} />
          ) : activeTab === 'search' ? (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              onSelectArtist={(artist) => setSelectedArtist(artist)}
            />
          ) : activeTab === 'stats' ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                <BarChart2 size={32} />
              </div>
              <h3 className="font-display font-black text-xl text-white">Global Leaderboard</h3>
              <p className="text-on-surface-variant text-xs max-w-xs leading-relaxed">
                Connect your database to store global user ranks, daily challenge percentiles, and weekly reflex champions.
              </p>
              <button
                onClick={() => setActiveTab('search')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-surface font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Play Reflex Quiz
              </button>
            </div>
          ) : activeTab === 'user' ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-surface-container-high border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-white">{user.name}</h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold mt-1">
                  <ShieldCheck size={14} />
                  <span>{user.role || 'Tester / Player'}</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-2xl p-4 border border-white/5 space-y-2 mt-4 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">User ID:</span>
                  <span className="text-white font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Audio Engine:</span>
                  <span className="text-primary font-semibold">Deezer / iTunes Dual</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Status:</span>
                  <span className="text-white font-semibold">Testing Active</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-500/20 transition-all cursor-pointer mt-4"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-on-surface-variant">
              View coming soon...
            </div>
          )}
        </div>

        {/* Floating Glass Bottom Nav */}
        {user && !selectedArtist && (
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </div>
  );
}

export default App;
