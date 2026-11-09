import React, { useState, useEffect } from 'react';
import { ShieldCheck, History, Trophy, Zap, Target, Clock, RotateCcw, LogOut, Music, TrendingUp, Sparkles, Award, MessageSquare } from 'lucide-react';
import { fetchUserHistory } from '../services/supabase';
import FeedbackModal from './FeedbackModal';

const ProfileView = ({ user, onLogout, onReplayArtist }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
    <div className="h-full w-full px-4 sm:px-6 pt-5 sm:pt-7 pb-2 flex flex-col space-y-4 relative z-10 overflow-hidden box-border">
      {/* Top Header */}
      <header className="flex justify-between items-center shrink-0 w-full">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider font-mono">
            <ShieldCheck size={12} />
            <span>Verified Player Profile</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Player <span className="text-primary">Card</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeedbackOpen(true)}
            title="Send Feedback"
            className="p-2 sm:p-2.5 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-95 cursor-pointer border border-primary/20 flex items-center gap-1.5 text-xs font-bold"
          >
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400 transition-all active:scale-95 cursor-pointer border border-white/5"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Scrollable Body */}
      <div
        className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain pb-32 space-y-4 pr-0.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* User Identity Banner (Inspired by Clean Apple / Spotify Hero Cards) */}
        <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[2rem] bg-gradient-to-br from-[#1A1A22] via-[#121216] to-[#0D0D11] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary/50 p-1 shrink-0 shadow-lg">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-2xl font-black text-white">
                {user.username ? user.username[0]?.toUpperCase() : 'U'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-primary text-black p-1 rounded-full shadow-md font-black">
              <ShieldCheck size={13} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-xl sm:text-2xl text-white truncate">
                {user.name}
              </h3>
            </div>
            <p className="font-mono text-xs font-bold text-primary truncate">
              @{user.username || 'user'}
            </p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[9px] uppercase tracking-wider font-bold">
              {user.role || 'Verified Superfan'}
            </span>
          </div>
        </div>

        {/* 2x2 Metric Cards (Directly matching your uploaded reference images: Conan Gray stats style) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Card 1: Peak Score */}
          <div className="p-4 rounded-[1.75rem] bg-[#14151C] border border-white/10 shadow-lg flex flex-col justify-between space-y-2 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Peak Score</span>
              <Trophy size={14} className="text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {bestScore.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-primary font-bold mt-0.5">
                <TrendingUp size={11} />
                <span>High Performance</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Quizzes */}
          <div className="p-4 rounded-[1.75rem] bg-[#14151C] border border-white/10 shadow-lg flex flex-col justify-between space-y-2 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Quizzes Played</span>
              <History size={14} className="text-[#38BDF8]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {totalGames}
              </div>
              <span className="text-[10px] font-mono text-white/50 block mt-0.5">
                Lifetime sessions
              </span>
            </div>
          </div>

          {/* Card 3: Accuracy */}
          <div className="p-4 rounded-[1.75rem] bg-[#14151C] border border-white/10 shadow-lg flex flex-col justify-between space-y-2 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Accuracy</span>
              <Target size={14} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {avgAccuracy}%
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-0.5">
                {avgAccuracy >= 80 ? 'Elite precision' : 'Average rate'}
              </span>
            </div>
          </div>

          {/* Card 4: Reflex Speed */}
          <div className="p-4 rounded-[1.75rem] bg-[#14151C] border border-white/10 shadow-lg flex flex-col justify-between space-y-2 hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Reflex Speed</span>
              <Clock size={14} className="text-purple-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {avgSpeed}s
              </div>
              <span className="text-[10px] font-mono text-white/50 block mt-0.5">
                Average drop time
              </span>
            </div>
          </div>
        </div>

        {/* Full Session History Feed */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white font-mono">
                Recent Challenges ({history.length})
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs font-mono text-primary animate-pulse">
              SYNCING QUIZ SESSIONS...
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 rounded-[1.75rem] bg-[#14151C] border border-white/10 text-center space-y-2">
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
                  className="p-3.5 rounded-2xl bg-[#14151C] border border-white/5 hover:border-white/15 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                      <Music size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-xs sm:text-sm text-white truncate">
                          {item.artist_name || 'Mystery Artist'}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 shrink-0">
                          {item.tier || 'CHALLENGER'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 mt-0.5">
                        <span>{item.accuracy}% acc</span>
                        <span>•</span>
                        <span>{item.avg_speed}s speed</span>
                        <span>•</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="text-right">
                      <span className="block font-display font-black text-xs sm:text-sm text-primary">
                        {item.score?.toLocaleString()}
                      </span>
                      <span className="text-[8px] font-mono text-white/40 uppercase">PTS</span>
                    </div>

                    {onReplayArtist && (
                      <button
                        onClick={() => onReplayArtist(item.artist_name)}
                        title="Replay this test"
                        className="p-2 rounded-xl bg-white/5 hover:bg-primary/20 text-white/70 hover:text-primary transition-colors cursor-pointer"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ProfileView;
