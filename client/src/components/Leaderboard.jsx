import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Flame, Award, Zap, RefreshCw, Music } from 'lucide-react';
import { fetchLeaderboard } from '../services/supabase';

const Leaderboard = ({ onPlayArtist }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadScores = async () => {
    setLoading(true);
    const data = await fetchLeaderboard(30);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="h-full w-full p-4 sm:p-6 flex flex-col space-y-4 relative z-10 pt-6 sm:pt-8 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
            <Trophy size={12} />
            <span>Global Reflex Ranks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Hall of <span className="text-primary">Fame</span>
          </h2>
        </div>
        <button
          onClick={loadScores}
          title="Refresh Scores"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Leaderboard Entries List */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-28 space-y-2 pt-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Syncing Global Rankings...
            </span>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-surface-container/40 rounded-3xl p-6 border border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-1">
              <Trophy size={28} />
            </div>
            <h3 className="font-display font-bold text-white text-base">The Board is Open!</h3>
            <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
              Play any artist quiz to claim the #1 rank on the global leaderboard.
            </p>
          </div>
        ) : (
          entries.map((item, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            let rankBadge = (
              <span className="font-mono text-xs font-bold text-on-surface-variant">
                #{index + 1}
              </span>
            );

            if (isTop1) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-[#FBBF24] text-surface font-black flex items-center justify-center text-xs shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  <Crown size={13} strokeWidth={2.5} />
                </div>
              );
            } else if (isTop2) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-slate-300 text-surface font-black flex items-center justify-center text-xs shadow-md">
                  2
                </div>
              );
            } else if (isTop3) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-md">
                  3
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isTop1
                    ? 'bg-surface-container border-[#FBBF24]/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                    : 'bg-surface-container/60 border-white/5 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    {rankBadge}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-display font-black text-xs sm:text-sm text-white truncate">
                        @{item.username}
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-primary uppercase">
                        {item.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5">
                      <span className="truncate max-w-[120px] text-white/70">
                        {item.artist_name}
                      </span>
                      <span>•</span>
                      <span>{item.accuracy}% acc</span>
                      <span>•</span>
                      <span>{item.avg_speed}s</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display font-black text-sm sm:text-base text-primary tracking-tight">
                    {item.score?.toLocaleString()}
                  </div>
                  <span className="text-[9px] font-mono text-on-surface-variant/70 uppercase">
                    PTS
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
