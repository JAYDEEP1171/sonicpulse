import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Flame, Award, Zap, RefreshCw, Music, Search, X, Sparkles } from 'lucide-react';
import { fetchLeaderboard, fetchLeaderboardArtists } from '../services/supabase';

const POPULAR_FILTERS = [
  'ALL',
  'Seedhe Maut',
  'The Weeknd',
  'Lana Del Rey',
  'DHH (Desi Hip Hop)',
  '90s Golden Era Rap',
  '80s Retro & Synthwave',
];

const Leaderboard = ({ onPlayArtist }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [customSearch, setCustomSearch] = useState('');
  const [availableArtists, setAvailableArtists] = useState([]);

  // Fetch distinct artists in DB on mount
  useEffect(() => {
    fetchLeaderboardArtists().then((artists) => {
      setAvailableArtists(artists || []);
    });
  }, []);

  const loadScores = async (filter) => {
    setLoading(true);
    const activeQuery = customSearch.trim() || (filter === 'ALL' ? null : filter);
    const data = await fetchLeaderboard(activeQuery, 40);
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadScores(selectedFilter);
  }, [selectedFilter, customSearch]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCustomSearch('');
  };

  // Top #1 Champion for current view
  const topChampion = entries.length > 0 ? entries[0] : null;

  return (
    <div className="h-full w-full p-4 sm:p-5 flex flex-col space-y-3 sm:space-y-4 relative z-10 pt-6 sm:pt-8 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider font-mono">
              <Trophy size={11} />
              <span>Artist Leaderboards</span>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase">
              • Best Run Ranked
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Hall of <span className="text-primary">Fame</span>
          </h2>
        </div>
        <button
          onClick={() => loadScores(selectedFilter)}
          title="Refresh Scores"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Filter / Search Bar */}
      <div className="relative group shrink-0">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Filter by artist name (e.g. Seedhe Maut)..."
          className="w-full bg-surface-container border border-transparent rounded-2xl py-2.5 pl-10 pr-9 text-xs font-medium text-white placeholder-on-surface-variant outline-none transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
          value={customSearch}
          onChange={(e) => {
            setCustomSearch(e.target.value);
            if (e.target.value) setSelectedFilter('CUSTOM');
            else setSelectedFilter('ALL');
          }}
        />
        {customSearch && (
          <button
            onClick={() => {
              setCustomSearch('');
              setSelectedFilter('ALL');
            }}
            className="absolute right-3 top-3 text-on-surface-variant hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Artist/Genre Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto hidden-scrollbar py-0.5 shrink-0">
        {POPULAR_FILTERS.map((item) => {
          const isActive = selectedFilter === item && !customSearch;
          return (
            <button
              key={item}
              onClick={() => handleFilterClick(item)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer border ${
                isActive
                  ? 'bg-primary text-surface border-primary shadow-[0_0_15px_rgba(114,254,143,0.3)]'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white border-white/5'
              }`}
            >
              {item === 'ALL' ? '🌐 All Tracks' : item}
            </button>
          );
        })}
      </div>

      {/* Champion Spotlight Banner (When an Artist is Selected) */}
      {selectedFilter !== 'ALL' && topChampion && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-surface-container to-surface-container border border-[#FBBF24]/30 shadow-lg flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FBBF24] text-surface flex items-center justify-center font-black shadow-md shrink-0">
              <Crown size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-[#FBBF24] tracking-widest block truncate">
                Reigning Champion • {selectedFilter}
              </span>
              <p className="font-display font-black text-xs sm:text-sm text-white truncate">
                @{topChampion.username}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs sm:text-sm font-display font-black text-[#FBBF24]">
              {topChampion.score?.toLocaleString()} PTS
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Entries List */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-24 space-y-2 pt-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Loading rankings...
            </span>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-surface-container/40 rounded-3xl p-6 border border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-1">
              <Trophy size={24} />
            </div>
            <h3 className="font-display font-bold text-white text-sm">
              No scores recorded for {customSearch || selectedFilter}!
            </h3>
            <p className="text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
              Be the first superfan to play this challenge and secure the #1 spot on the global board.
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
                <div className="w-6 h-6 rounded-full bg-[#FBBF24] text-surface font-black flex items-center justify-center text-xs shadow-[0_0_12px_rgba(251,191,36,0.5)]">
                  <Crown size={12} strokeWidth={2.5} />
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
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isTop1
                    ? 'bg-surface-container border-[#FBBF24]/30 shadow-[0_0_15px_rgba(251,191,36,0.12)]'
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
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-surface-container-highest text-primary uppercase">
                        {item.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant mt-0.5">
                      <span className="truncate max-w-[110px] text-white/80 font-medium">
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
                  <div className="font-display font-black text-xs sm:text-sm text-primary tracking-tight">
                    {item.score?.toLocaleString()}
                  </div>
                  <span className="text-[8px] font-mono text-on-surface-variant/70 uppercase">
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
