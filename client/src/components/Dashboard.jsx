import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, LogOut, X, Zap, Play, ChevronLeft, ChevronRight, Volume2, ShieldCheck, Flame } from 'lucide-react';
import { musicService } from '../services/api';

const FEATURED_ARTISTS = [
  {
    name: 'Seedhe Maut',
    subtitle: 'Desi Hip Hop Pioneers',
    tag: 'DHH NO.1',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    color: '#FB923C',
  },
  {
    name: 'The Weeknd',
    subtitle: 'R&B / Synthwave Titan',
    tag: 'GLOBAL CHART-TOPPER',
    img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    color: '#C084FC',
  },
  {
    name: 'Taylor Swift',
    subtitle: 'Pop & Storytelling Icon',
    tag: 'BILLION CLUB',
    img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
    color: '#72FE8F',
  },
  {
    name: 'Drake',
    subtitle: 'OVO Sound / Hip-Hop',
    tag: 'CERTIFIED HITMAKER',
    img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    color: '#38BDF8',
  },
  {
    name: 'Arijit Singh',
    subtitle: 'The Soul of Bollywood',
    tag: 'DESI MELODY KING',
    img: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=600&auto=format&fit=crop',
    color: '#FB7185',
  },
  {
    name: 'Travis Scott',
    subtitle: 'Cactus Jack / Utopia',
    tag: 'RAGE ARENA',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    color: '#FBBF24',
  },
];

const Dashboard = ({ user, onLogout, onSelectArtist }) => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Horizontal Card Stack State
  const [cardIndex, setCardIndex] = useState(0);

  // 300ms Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search API effect
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        setArtists([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setSearchError(null);
      try {
        const data = await musicService.searchArtists(debouncedQuery);
        setArtists(data || []);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchError('Could not reach audio service. Please check connection.');
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debouncedQuery]);

  const handleNextCard = () => {
    setCardIndex((prev) => (prev + 1) % FEATURED_ARTISTS.length);
  };

  const handlePrevCard = () => {
    setCardIndex((prev) => (prev - 1 + FEATURED_ARTISTS.length) % FEATURED_ARTISTS.length);
  };

  const handleQuickArtistClick = (artistName) => {
    setQuery(artistName);
  };

  const handleStartFeaturedQuiz = async (featured) => {
    setLoading(true);
    try {
      const results = await musicService.searchArtists(featured.name);
      if (results && results.length > 0) {
        onSelectArtist(results[0]);
      } else {
        onSelectArtist({
          id: featured.name.toLowerCase().replace(/\s+/g, '_'),
          name: featured.name,
          images: [{ url: featured.img }],
        });
      }
    } catch (e) {
      onSelectArtist({
        id: featured.name.toLowerCase().replace(/\s+/g, '_'),
        name: featured.name,
        images: [{ url: featured.img }],
      });
    } finally {
      setLoading(false);
    }
  };

  const activeFeatured = FEATURED_ARTISTS[cardIndex];

  return (
    <div className="h-full w-full p-4 sm:p-5 flex flex-col space-y-4 relative z-10 pt-5 sm:pt-6 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-[3px] h-3.5">
              <span className="w-1 h-full bg-primary animate-[bounce_0.8s_infinite] rounded-sm"></span>
              <span className="w-1 h-3/4 bg-[#88EBFF] animate-[bounce_1.1s_infinite] rounded-sm"></span>
              <span className="w-1 h-full bg-primary animate-[bounce_0.6s_infinite] rounded-sm"></span>
              <span className="w-1 h-1/2 bg-[#FBBF24] animate-[bounce_0.9s_infinite] rounded-sm"></span>
            </div>
            <span className="text-[10px] font-black uppercase text-primary tracking-widest font-mono">
              Artist Superfan Arena
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Welcome, <span className="text-primary">{user.name?.split(' ')[0] || user.username}</span>
          </h2>
        </div>

        <button
          onClick={onLogout}
          title="Log Out"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Sleek Minimalist Search Bar */}
      <div className="relative group shadow-lg shrink-0">
        <Search className="absolute left-4 top-3.5 sm:top-4 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search any artist (e.g. Seedhe Maut, Taylor Swift)..."
          className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3.5 pl-11 pr-10 text-white placeholder-on-surface-variant font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40 text-xs sm:text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-3.5 sm:top-4 text-on-surface-variant hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <div className="absolute right-10 top-4 text-[10px] font-bold text-primary animate-pulse font-mono">
            SYNCING...
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-24 space-y-4">
        {query ? (
          /* Search Results View */
          <div className="space-y-3">
            {searchError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold text-center">
                {searchError}
              </div>
            )}

            {artists.length > 0 && (
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-mono">
                  Found {artists.length} Artists
                </h3>
                <div className="h-px bg-surface-container-highest flex-1"></div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 p-1">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => onSelectArtist(artist)}
                  className="flex flex-col items-center justify-start space-y-2 cursor-pointer group p-3 rounded-2xl bg-[#111111] hover:bg-[#161616] active:scale-95 transition-all border border-white/5 hover:border-primary/30"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 bg-surface-container relative border border-white/10">
                    {artist.images?.[0]?.url ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-display font-medium text-2xl">
                        {artist.name ? artist.name[0] : '♪'}
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-white font-display font-bold text-xs sm:text-sm truncate w-full group-hover:text-primary transition-colors">
                      {artist.name}
                    </p>
                    <span className="text-[9px] text-primary uppercase font-mono font-bold tracking-wider mt-0.5 inline-block">
                      10 Drop Quiz
                    </span>
                  </div>
                </div>
              ))}

              {artists.length === 0 && !loading && (
                <div className="col-span-2 text-center text-on-surface-variant py-14 font-medium text-xs sm:text-sm">
                  No artist signals found for "{query}".
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Default Feed: Advertisement Billboard + Horizontal 3D Card Stack */
          <>
            {/* 1. Artist Superfan Advertisement Billboard */}
            <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#121212] via-[#161616] to-[#0A0A0A] border border-primary/30 shadow-[0_0_35px_rgba(114,254,143,0.12)]">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/15 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-wider font-mono">
                    <Zap size={11} className="fill-primary text-primary" />
                    <span>SUPERFAN AUDIT ENGINE</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/50 uppercase font-semibold">
                    10 Blind Snips
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight">
                    How well do you <span className="text-primary underline decoration-primary/40 underline-offset-4">REALLY</span> know your artist?
                  </h3>
                  <p className="text-xs text-white/70 font-medium mt-1 leading-relaxed">
                    Casual listeners know the chorus. True superfans recognize the 0.5-second intro drop. Test your reflex & claim your verified rank.
                  </p>
                </div>

                {/* Stat Badges */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/80">
                    ⚡ Instant Drops
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/80">
                    🎯 Reflex Rating
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-primary font-bold">
                    🏆 Global Ranks
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Top Artists Horizontal / Rotating Card Stack */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className="text-primary fill-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
                    Featured Artist Stack
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevCard}
                    className="p-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="p-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Horizontal 3D Card Stack Container */}
              <div className="relative h-[230px] sm:h-[240px] flex items-center justify-center select-none touch-none">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeFeatured.name}
                    initial={{ opacity: 0, scale: 0.88, x: 60 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.88, x: -60 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) handleNextCard();
                      else if (info.offset.x > 40) handlePrevCard();
                    }}
                    className="absolute w-full rounded-3xl overflow-hidden border border-white/10 bg-[#121212] p-5 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing"
                  >
                    {/* Background artist art with dark overlay */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={activeFeatured.img}
                        alt={activeFeatured.name}
                        className="w-full h-full object-cover opacity-20 scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-black uppercase tracking-wider text-white/90 font-mono">
                        {activeFeatured.tag}
                      </span>
                      <span className="text-[10px] font-mono text-primary font-bold">
                        0{cardIndex + 1} / 0{FEATURED_ARTISTS.length}
                      </span>
                    </div>

                    <div className="relative z-10 my-2">
                      <h4 className="font-display font-black text-2xl text-white tracking-tight">
                        {activeFeatured.name}
                      </h4>
                      <p className="text-xs text-white/60 font-medium">
                        {activeFeatured.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 pt-1">
                      <button
                        onClick={() => handleStartFeaturedQuiz(activeFeatured)}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-surface font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(114,254,143,0.3)] transition-all active:scale-95 cursor-pointer"
                      >
                        <Play size={12} className="fill-surface" />
                        <span>Test {activeFeatured.name} Reflex</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick Pick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto hidden-scrollbar py-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase shrink-0 font-bold">
                  Quick Pick:
                </span>
                {FEATURED_ARTISTS.map((artist) => (
                  <button
                    key={artist.name}
                    onClick={() => handleQuickArtistClick(artist.name)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-white/5 text-[10px] font-medium text-white/80 hover:text-white shrink-0 transition-all cursor-pointer active:scale-95"
                  >
                    {artist.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
