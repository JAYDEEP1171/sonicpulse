import React, { useState, useEffect } from 'react';
import { ShieldCheck, History, Trophy, Zap, Target, Clock, RotateCcw, LogOut, Music } from 'lucide-react';
import { fetchUserHistory } from '../services/supabase';

const ProfileView = ({ user, onLogout, onReplayArtist }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      setLoading(true);
      const data = await fetchUserHistory(user?.id, user?.username);
      if (isMounted) {
        setHistory(data || []);
        setLoading(false);
      }
    };
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Calculate user stats
  const totalGames = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.score || 0)) : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((acc, h) => acc + (h.accuracy || 0), 0) / history.length)
      : 0;
  const avgSpeed =
    history.length > 0
      ? (history.reduce((acc, h) => acc + (parseFloat(h.avg_speed) || 0), 0) / history.length).toFixed(2)
      : '0.00';

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="h-full w-full p-4 sm:p-5 flex flex-col space-y-4 relative z-10 pt-5 sm:pt-6 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider font-mono">
            <ShieldCheck size={12} />
            <span>Verified Player Profile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Player <span className="text-primary">Card</span>
          </h2>
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-red-400 transition-all active:scale-95 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-24 space-y-4">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4 p-4 rounded-3xl bg-[#121212] border border-white/5 shadow-xl">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-primary/40 p-1 shrink-0">
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
            <div className="absolute -bottom-1 -right-1 bg-primary text-surface p-1 rounded-full shadow-md">
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-0.5 overflow-hidden">
            <h3 className="font-display font-black text-xl text-white truncate">
              {user.name}
            </h3>
            <p className="font-mono text-xs font-bold text-primary">
              @{user.username || 'user'}
            </p>
            <p className="text-[11px] text-white/50 font-medium">
              {user.role || 'Verified Superfan'}
            </p>
          </div>
        </div>

        {/* Lifetime Performance Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center justify-center text-center">
            <Trophy size={14} className="text-primary mb-1" />
            <span className="text-base font-display font-black text-white">{bestScore}</span>
            <span className="text-[9px] font-mono text-white/50 uppercase">Peak Score</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center justify-center text-center">
            <History size={14} className="text-[#88EBFF] mb-1" />
            <span className="text-base font-display font-black text-white">{totalGames}</span>
            <span className="text-[9px] font-mono text-white/50 uppercase">Quizzes</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center justify-center text-center">
            <Target size={14} className="text-[#FBBF24] mb-1" />
            <span className="text-base font-display font-black text-white">{avgAccuracy}%</span>
            <span className="text-[9px] font-mono text-white/50 uppercase">Accuracy</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center justify-center text-center">
            <Clock size={14} className="text-purple-400 mb-1" />
            <span className="text-base font-display font-black text-white">{avgSpeed}s</span>
            <span className="text-[9px] font-mono text-white/50 uppercase">Avg Reflex</span>
          </div>
        </div>

        {/* Full Session History Feed */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <History size={14} className="text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white font-mono">
                Quiz Session History ({history.length})
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs font-mono text-primary animate-pulse">
              SYNCING QUIZ SESSIONS...
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 text-center space-y-2">
              <Music size={24} className="text-white/20 mx-auto" />
              <p className="text-xs font-medium text-white/60">No quiz sessions recorded yet.</p>
              <p className="text-[10px] text-white/40">
                Complete an artist or genre test to see your history logged here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-2xl bg-[#121212] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-white group-hover:text-primary transition-colors">
                        {item.artist_name}
                      </span>
                      {item.tier && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-primary font-mono">
                          {item.tier}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                      <span>{formatDate(item.created_at)}</span>
                      <span>•</span>
                      <span>{item.accuracy}% Acc</span>
                      <span>•</span>
                      <span>{item.avg_speed}s Speed</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-display font-black text-sm text-primary">
                      {item.score?.toLocaleString()} pts
                    </span>
                    {onReplayArtist && (
                      <button
                        onClick={() => onReplayArtist(item.artist_name)}
                        className="text-[9px] font-mono text-white/40 hover:text-white uppercase font-bold flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <RotateCcw size={10} />
                        <span>Replay</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out CTA */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full py-3 px-5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
