import React, { useState, useEffect } from 'react';
import { Search, Sparkles, LogOut, X } from 'lucide-react';
import { musicService } from '../services/api';

const QUICK_ARTISTS = [
  'The Weeknd',
  'Lana Del Rey',
  'Seedhe Maut',
  'Dua Lipa',
  'Daft Punk',
  'Drake',
];

const Dashboard = ({ user, onLogout, onSelectArtist }) => {
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

  return (
    <div className="h-full w-full p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-5 relative z-10 pt-6 sm:pt-8 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Warning, <span className="text-primary font-black">{user.name}</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-xs tracking-wide">
            Ready to test your sonic reflex?
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

      <div className="flex-1 flex flex-col space-y-3 sm:space-y-4 overflow-hidden">
        {/* Search Bar with One-Tap Clear */}
        <div className="relative group shadow-lg shrink-0">
          <Search className="absolute left-4 top-3.5 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search any artist (e.g. Lana Del Rey)..."
            className="w-full bg-surface-container-highest border border-transparent rounded-[2rem] py-3.5 sm:py-4 pl-12 pr-10 text-white placeholder-on-surface-variant font-medium outline-none transition-all focus:ring-1 focus:ring-primary/50 text-xs sm:text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-on-surface-variant hover:text-white transition-colors"
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

        {/* Quick Suggestions for Instant Testing */}
        {!query && (
          <div className="space-y-2 pt-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
              <Sparkles size={13} className="text-primary" />
              <span>Instant Test Artists</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_ARTISTS.map((name) => (
                <button
                  key={name}
                  onClick={() => setQuery(name)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-white hover:text-primary transition-all border border-white/5 active:scale-95 cursor-pointer shadow-sm"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Error banner */}
        {searchError && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold text-center shrink-0">
            {searchError}
          </div>
        )}

        {/* Results Grid (Scrollable with mobile bottom dock buffer) */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar pb-28 pt-1">
          {artists.length > 0 && (
            <div className="flex items-center space-x-3 mb-3">
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

            {artists.length === 0 && query && !loading && (
              <div className="col-span-2 text-center text-on-surface-variant py-14 font-medium text-xs sm:text-sm">
                No audio signals found in the void for "{query}".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
