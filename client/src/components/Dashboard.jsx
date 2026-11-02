import React, { useState, useEffect } from 'react';
import { Search, Sparkles, LogOut, X, Zap, Flame, Radio, Music, ArrowRight, Play, Trophy } from 'lucide-react';
import { musicService, CURATED_GENRES } from '../services/api';

const TRENDING_ARTISTS = [
  { name: 'Seedhe Maut', subtitle: 'Desi Hip Hop', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300' },
  { name: 'The Weeknd', subtitle: 'R&B / Synthwave', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300' },
  { name: 'Lana Del Rey', subtitle: 'Cinematic Pop', img: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=300' },
  { name: 'Taylor Swift', subtitle: 'Pop / Country', img: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300' },
];

const Dashboard = ({ user, onLogout, onSelectArtist, onSelectGenre }) => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

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

  const handleLaunchGenre = (genre) => {
    onSelectArtist({
      id: genre.id,
      name: genre.name,
      isGenre: true,
      artists: genre.artists,
      images: [{ url: genre.image }],
    });
  };

  const handleLaunchTrendingArtist = (artistName) => {
    setQuery(artistName);
  };

  return (
    <div className="h-full w-full p-4 sm:p-5 flex flex-col space-y-4 relative z-10 pt-5 sm:pt-6 overflow-hidden">
      {/* Top Header with Equalizer Animation */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {/* Animated Equalizer Bars */}
            <div className="flex items-center gap-[3px] h-3.5">
              <span className="w-1 h-full bg-primary animate-[bounce_0.8s_infinite] rounded-sm"></span>
              <span className="w-1 h-3/4 bg-[#88EBFF] animate-[bounce_1.1s_infinite] rounded-sm"></span>
              <span className="w-1 h-full bg-primary animate-[bounce_0.6s_infinite] rounded-sm"></span>
              <span className="w-1 h-1/2 bg-[#FBBF24] animate-[bounce_0.9s_infinite] rounded-sm"></span>
            </div>
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">
              Live Sound Engine
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Warning, <span className="text-primary">{user.name?.split(' ')[0] || user.username}</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-xs tracking-wide">
            Select a genre or search your favorite artist.
          </p>
        </div>

        <button
          onClick={onLogout}
          title="Log Out"
          className="p-2 sm:p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Search Input Bar */}
      <div className="relative group shadow-lg shrink-0">
        <Search className="absolute left-4 top-3.5 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search any artist (e.g. Seedhe Maut, Lana Del Rey)..."
          className="w-full bg-surface-container-highest border border-transparent rounded-[2rem] py-3.5 sm:py-4 pl-12 pr-10 text-white placeholder-on-surface-variant font-medium outline-none transition-all focus:ring-1 focus:ring-primary/50 text-xs sm:text-sm"
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
          <div className="absolute right-10 top-4 text-[10px] font-bold text-primary animate-pulse">
            SYNCING...
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-24 space-y-5">
        {/* If user is typing in Search: Show Search Results */}
        {query ? (
          <div className="space-y-3">
            {searchError && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold text-center">
                {searchError}
              </div>
            )}

            {artists.length > 0 && (
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">
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
                  className="flex flex-col items-center justify-start space-y-2 cursor-pointer group p-2.5 rounded-2xl hover:bg-surface-container/60 active:scale-95 transition-all border border-transparent hover:border-white/5"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.04] bg-surface-container relative">
                    {artist.images?.[0]?.url ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-display font-medium text-3xl">
                        {artist.name ? artist.name[0] : '♪'}
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-white font-display font-bold text-xs sm:text-sm truncate w-full group-hover:text-primary transition-colors">
                      {artist.name}
                    </p>
                    <p className="text-[9px] text-primary uppercase font-bold tracking-widest mt-0.5">
                      {artist.source === 'itunes' ? 'ITUNES AUDIO' : 'DEEZER PREVIEW'}
                    </p>
                  </div>
                </div>
              ))}

              {artists.length === 0 && !loading && (
                <div className="col-span-2 text-center text-on-surface-variant py-14 font-medium text-xs sm:text-sm">
                  No audio signals found in the void for "{query}".
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Normal Animated Cyberpunk Home Feed */
          <>
            {/* 1. Hero Featured Challenge Banner */}
            <div
              onClick={() => handleLaunchGenre(CURATED_GENRES[0])}
              className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-orange-600/30 via-red-950/40 to-surface-container border border-orange-500/40 shadow-[0_0_35px_rgba(249,115,22,0.2)] cursor-pointer group transition-all active:scale-[0.98]"
            >
              {/* Background Glow */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

              <div className="relative z-10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-black uppercase tracking-wider">
                    <Flame size={12} className="animate-pulse" />
                    <span>Featured Genre Challenge</span>
                  </div>
                  <span className="text-[9px] font-mono text-orange-400 font-bold">
                    2X XP BONUS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">
                    DHH: Desi Hip Hop Clash
                  </h3>
                  <p className="text-xs text-white/70 font-medium line-clamp-1 mt-0.5">
                    Seedhe Maut, KR$NA, DIVINE & Raftaar
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">
                    10 Shuffled Rounds • 30s Drops
                  </span>
                  <div className="px-3.5 py-1.5 rounded-xl bg-primary text-surface font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md group-hover:scale-105 transition-all">
                    <span>Play Drop</span>
                    <Play size={11} className="fill-surface" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Curated Genre Quizzes Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
                    Choose Your Sound (Genre Quizzes)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {CURATED_GENRES.length} Playlists
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {CURATED_GENRES.map((genre) => (
                  <div
                    key={genre.id}
                    onClick={() => handleLaunchGenre(genre)}
                    className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${genre.gradient} border ${genre.border} shadow-lg cursor-pointer group transition-all active:scale-[0.97] hover:border-white/20 overflow-hidden flex flex-col justify-between min-h-[115px]`}
                  >
                    <div className="space-y-1 relative z-10">
                      <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${genre.tagBg}`}>
                        {genre.badge}
                      </span>
                      <h4 className="font-display font-black text-xs sm:text-sm text-white group-hover:text-primary transition-colors leading-tight">
                        {genre.name}
                      </h4>
                    </div>

                    <div className="relative z-10 pt-2 flex items-center justify-between">
                      <span className="text-[9px] text-white/60 line-clamp-1 font-medium">
                        {genre.description}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-surface transition-all">
                        <ArrowRight size={10} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Trending Artists Section */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary fill-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
                    Trending Superfan Artists
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto hidden-scrollbar py-1">
                {TRENDING_ARTISTS.map((artist) => (
                  <button
                    key={artist.name}
                    onClick={() => handleLaunchTrendingArtist(artist.name)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full p-0.5 border border-primary/30 group-hover:border-primary shadow-md overflow-hidden bg-surface-container relative">
                      <img
                        src={artist.img}
                        alt={artist.name}
                        className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-display font-bold text-white group-hover:text-primary transition-colors truncate max-w-[75px]">
                      {artist.name}
                    </span>
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
