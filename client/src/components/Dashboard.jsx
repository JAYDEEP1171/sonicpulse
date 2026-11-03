import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, LogOut, X, Zap, Play, Flame, Radio, Disc3, ShieldCheck } from 'lucide-react';
import { musicService } from '../services/api';

const FEATURED_ARTISTS = [
  {
    id: 'seedhe_maut',
    name: 'Seedhe Maut',
    subtitle: 'Desi Hip Hop Pioneers',
    tag: 'DHH NO.1',
    gradient: 'from-orange-600/35 via-red-950/40 to-surface-container',
    border: 'border-orange-500/30',
    tagBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    accentColor: '#FB923C',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    topTracks: ['Nanchaku', 'Namastute', '11K', 'Tour Shiit'],
  },
  {
    id: 'the_weeknd',
    name: 'The Weeknd',
    subtitle: 'R&B / Synthwave Titan',
    tag: 'GLOBAL NO.1',
    gradient: 'from-purple-600/35 via-fuchsia-950/40 to-surface-container',
    border: 'border-purple-500/30',
    tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accentColor: '#C084FC',
    img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    topTracks: ['Blinding Lights', 'Starboy', 'The Hills'],
  },
  {
    id: 'taylor_swift',
    name: 'Taylor Swift',
    subtitle: 'Pop & Storytelling Icon',
    tag: 'BILLION CLUB',
    gradient: 'from-emerald-600/35 via-teal-950/40 to-surface-container',
    border: 'border-emerald-500/30',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentColor: '#72FE8F',
    img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
    topTracks: ['Cruel Summer', 'Blank Space', 'Anti-Hero'],
  },
  {
    id: 'drake',
    name: 'Drake',
    subtitle: 'OVO Sound / 6 God',
    tag: 'CERTIFIED HITMAKER',
    gradient: 'from-cyan-600/35 via-blue-950/40 to-surface-container',
    border: 'border-cyan-500/30',
    tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    accentColor: '#38BDF8',
    img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
    topTracks: ['Gods Plan', 'One Dance', 'Hotline Bling'],
  },
  {
    id: 'arijit_singh',
    name: 'Arijit Singh',
    subtitle: 'The Soul of Bollywood',
    tag: 'DESI MELODY KING',
    gradient: 'from-rose-600/35 via-pink-950/40 to-surface-container',
    border: 'border-rose-500/30',
    tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    accentColor: '#FB7185',
    img: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=600&auto=format&fit=crop',
    topTracks: ['Tum Hi Ho', 'Kesariya', 'Channa Mereya'],
  },
  {
    id: 'travis_scott',
    name: 'Travis Scott',
    subtitle: 'Cactus Jack / Utopia',
    tag: 'RAGE ARENA',
    gradient: 'from-amber-600/35 via-yellow-950/40 to-surface-container',
    border: 'border-amber-500/30',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accentColor: '#FBBF24',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    topTracks: ['FE!N', 'SICKO MODE', 'Goosebumps'],
  },
];

const Dashboard = ({ user, onLogout, onSelectArtist }) => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const containerRef = useRef(null);

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

  const handleStartFeaturedQuiz = async (featured) => {
    setLoading(true);
    try {
      const results = await musicService.searchArtists(featured.name);
      if (results && results.length > 0) {
        onSelectArtist(results[0]);
      } else {
        onSelectArtist({
          id: featured.id || featured.name.toLowerCase().replace(/\s+/g, '_'),
          name: featured.name,
          images: [{ url: featured.img }],
        });
      }
    } catch (e) {
      onSelectArtist({
        id: featured.id || featured.name.toLowerCase().replace(/\s+/g, '_'),
        name: featured.name,
        images: [{ url: featured.img }],
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToArtist = (index) => {
    if (!containerRef.current) return;
    const cardEl = containerRef.current.querySelector(`[data-artist-index="${index}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative z-10 pt-4 sm:pt-5 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 sm:px-5 shrink-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-primary/40 p-0.5 shadow-md shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center font-black text-white text-sm">
                {user.username ? user.username[0]?.toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                Live Reflex Arena
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight">
              Hello, <span className="text-primary">{user.name?.split(' ')[0] || user.username}</span>
            </h2>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Log Out"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Sleek Minimalist Search Bar */}
      <div className="px-4 sm:px-5 my-2 shrink-0">
        <div className="relative group shadow-lg">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search any artist (e.g. Seedhe Maut, Drake, Lana Del Rey)..."
            className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3 pl-10 pr-9 text-white placeholder-on-surface-variant font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/40 text-xs sm:text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-on-surface-variant hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          )}
          {loading && (
            <div className="absolute right-9 top-3.5 text-[9px] font-bold text-primary animate-pulse font-mono">
              SYNCING...
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto hidden-scrollbar px-3 sm:px-4 pb-28 pt-1 space-y-4"
      >
        {query ? (
          /* Search Results Grid */
          <div className="space-y-3">
            {searchError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold text-center">
                {searchError}
              </div>
            )}

            {artists.length > 0 && (
              <div className="flex items-center space-x-3 mb-2 px-1">
                <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] font-mono">
                  Found {artists.length} Artists
                </h3>
                <div className="h-px bg-surface-container-highest flex-1"></div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 p-1">
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
          /* Normal View: Visual Card Banner (Sandra Style) + Sticky Card Stack */
          <>
            {/* 1. Visual Card Advertisement Banner (Inspired by Sandra Daily Challenge Card) */}
            <div
              onClick={() => handleStartFeaturedQuiz(FEATURED_ARTISTS[0])}
              className="relative overflow-hidden rounded-[2rem] p-5 bg-gradient-to-br from-[#7C3AED]/35 via-[#4C1D95]/40 to-[#0F0F13] border border-purple-500/30 shadow-[0_15px_40px_rgba(124,58,237,0.25)] cursor-pointer group active:scale-[0.98] transition-all"
            >
              {/* Floating 3D Geometric Music Ornament on the right */}
              <div className="absolute -right-4 -bottom-6 w-36 h-36 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <div className="relative w-full h-full">
                  {/* Glowing 3D Vinyl / Spheres */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 blur-[1px] shadow-[0_10px_30px_rgba(245,158,11,0.5)] absolute right-2 top-2 border-2 border-white/20 animate-[spin_12s_linear_infinite]" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_8px_25px_rgba(34,211,238,0.4)] absolute right-16 bottom-2 border border-white/30 backdrop-blur-md" />
                  <div className="w-10 h-10 rounded-full bg-primary/80 shadow-[0_4px_15px_rgba(114,254,143,0.5)] absolute right-10 top-0 border border-white/40" />
                </div>
              </div>

              <div className="relative z-10 space-y-2.5 max-w-[70%]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-black uppercase tracking-wider font-mono">
                  <Flame size={11} className="text-amber-400 fill-amber-400 animate-pulse" />
                  <span>Daily Superfan Challenge</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                    How well do you know your artist?
                  </h3>
                  <p className="text-xs text-white/70 font-medium mt-1 leading-snug">
                    10 Blind Drops. 30 Seconds. Prove you are a true superfan.
                  </p>
                </div>

                {/* Overlapping Challenger Avatar Bubbles */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                      alt="Player 1"
                      className="w-6 h-6 rounded-full border-2 border-[#121212] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                      alt="Player 2"
                      className="w-6 h-6 rounded-full border-2 border-[#121212] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop"
                      alt="Player 3"
                      className="w-6 h-6 rounded-full border-2 border-[#121212] object-cover"
                    />
                    <div className="w-6 h-6 rounded-full bg-purple-600/80 border-2 border-[#121212] flex items-center justify-center text-[9px] font-black text-white font-mono">
                      +1.4k
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">
                    Challengers active
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Top Artists Sticky Card Stack (Dribbble Interaction) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-primary fill-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
                    Artist Stack (Scroll to Layer)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant font-semibold">
                  {FEATURED_ARTISTS.length} Artists Deck
                </span>
              </div>

              {/* Stacking Cards Container */}
              <div className="space-y-4">
                {FEATURED_ARTISTS.map((artist, index) => {
                  const stickyTopOffset = index * 38 + 6;

                  return (
                    <div
                      key={artist.id}
                      data-artist-index={index}
                      style={{
                        top: `${stickyTopOffset}px`,
                        zIndex: index + 10,
                      }}
                      className="sticky rounded-[2rem] overflow-hidden border border-white/10 bg-[#121212] shadow-[0_-8px_30px_rgba(0,0,0,0.85)] transition-transform duration-300"
                    >
                      {/* Sticky Header Tab Bar */}
                      <div
                        onClick={() => scrollToArtist(index)}
                        className={`p-3.5 sm:p-4 border-b border-white/5 flex items-center justify-between cursor-pointer bg-gradient-to-r ${artist.gradient}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-black/40 border border-primary/20 shrink-0">
                            0{index + 1}
                          </span>
                          <h4 className="font-display font-black text-sm sm:text-base text-white tracking-tight truncate">
                            {artist.name}
                          </h4>
                        </div>

                        <span
                          className={`inline-block text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 backdrop-blur-md ${artist.tagBg}`}
                        >
                          {artist.tag}
                        </span>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#0E0E0E] relative overflow-hidden min-h-[250px] sm:min-h-[270px]">
                        {/* Artist photo backdrop on right */}
                        <div className="absolute right-0 top-0 bottom-0 w-2/5 z-0 pointer-events-none overflow-hidden opacity-30">
                          <img
                            src={artist.img}
                            alt={artist.name}
                            className="w-full h-full object-cover scale-110 filter saturate-125"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent" />
                        </div>

                        {/* Metadata & Top Track Badges */}
                        <div className="relative z-10 space-y-3 max-w-[75%]">
                          <div>
                            <p className="text-xs text-white/80 font-medium">
                              {artist.subtitle}
                            </p>
                          </div>

                          {/* Track Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {artist.topTracks.map((trackName) => (
                              <span
                                key={trackName}
                                className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium text-white/90"
                              >
                                {trackName}
                              </span>
                            ))}
                          </div>

                          {/* Audio Specs */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="flex items-center gap-1 text-[9px] font-mono uppercase text-white/60 bg-black/50 px-2 py-0.5 rounded border border-white/5">
                              <Radio size={10} className="text-primary animate-pulse" />
                              10 Shuffled Drops
                            </span>
                            <span className="text-[9px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              REFLEX TEST
                            </span>
                          </div>
                        </div>

                        {/* Card Bottom CTA */}
                        <div className="relative z-10 pt-2">
                          <button
                            onClick={() => handleStartFeaturedQuiz(artist)}
                            className="w-full py-3 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-surface font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(114,254,143,0.35)] transition-all active:scale-95 cursor-pointer"
                          >
                            <Play size={13} className="fill-surface" />
                            <span>Challenge {artist.name.split(' ')[0]} Reflex</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
