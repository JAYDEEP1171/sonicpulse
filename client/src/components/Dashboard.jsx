import React, { useState, useEffect } from 'react';
import { Search, Sparkles, LogOut } from 'lucide-react';
import { musicService } from '../services/api';

const QUICK_ARTISTS = [
  'The Weeknd',
  'Dua Lipa',
  'Daft Punk',
  'Taylor Swift',
  'Kendrick Lamar',
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
    <div className="h-full w-full p-6 flex flex-col space-y-6 relative z-10 pt-8">
      {/* Top Header */}
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            Warning, <span className="text-primary font-black">{user.name}</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-xs tracking-wide">
            Ready to test your sonic reflex?
          </p>
        </div>
        <button
          onClick={onLogout}
          title="Log Out"
          className="p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={18} />
        </button>
      </header>

      <div className="flex-1 flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative group shadow-lg">
          <Search className="absolute left-5 top-4 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search any artist (e.g. The Weeknd)..."
            className="w-full bg-surface-container-highest border border-transparent rounded-[2rem] py-4 pl-14 pr-6 text-white placeholder-on-surface-variant font-medium outline-none transition-all focus:ring-1 focus:ring-primary/50 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-5 top-4 text-xs font-bold text-primary animate-pulse">
              SYNCING...
            </div>
          )}
        </div>

        {/* Quick Suggestions for fast testing */}
        {!query && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant uppercase font-bold tracking-wider">
              <Sparkles size={14} className="text-primary" />
              <span>Instant Test Artists</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_ARTISTS.map((name) => (
                <button
                  key={name}
                  onClick={() => setQuery(name)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-white hover:text-primary transition-all border border-white/5 active:scale-95 cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {searchError && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold text-center">
            {searchError}
          </div>
        )}

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar pb-32 pt-2">
          {artists.length > 0 && (
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.15em]">
                Artists Results ({artists.length})
              </h3>
              <div className="h-px bg-surface-container-highest flex-1"></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-1">
            {artists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => onSelectArtist(artist)}
                className="flex flex-col items-center justify-start space-y-2.5 cursor-pointer group p-3 rounded-2xl hover:bg-surface-container/60 transition-all"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95 bg-surface-container relative">
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
                <div className="text-center w-full">
                  <p className="text-white font-display font-bold text-sm truncate w-full group-hover:text-primary transition-colors">
                    {artist.name}
                  </p>
                  <p className="text-[9px] text-primary uppercase font-bold tracking-widest mt-0.5">
                    {artist.source === 'itunes' ? 'ITUNES AUDIO' : 'DEEZER PREVIEW'}
                  </p>
                </div>
              </div>
            ))}

            {artists.length === 0 && query && !loading && (
              <div className="col-span-2 text-center text-on-surface-variant py-16 font-medium text-sm">
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
