import React from 'react';
import { Disc3, Sparkles } from 'lucide-react';
import { CURATED_GENRES } from '../services/api';
import DeckCardStack from './DeckCardStack';

const ExploreView = ({ onSelectGenre }) => {
  return (
    <div className="h-full w-full flex flex-col relative z-10 pt-5 sm:pt-6 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 sm:px-5 shrink-0 pb-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider font-mono">
            <Disc3 size={12} className="animate-spin text-primary" style={{ animationDuration: '6s' }} />
            <span>Curated Sound Deck</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Explore <span className="text-primary">Genres</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-xs">
            Swipe through musical eras & test your ear.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-surface-container-high border border-white/5 font-mono text-xs font-bold text-primary">
          {CURATED_GENRES.length} <span className="text-white/30">Eras</span>
        </div>
      </header>

      {/* Main Body */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-4 pb-32 pt-2 space-y-5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* 1. 3D Swipe Deck for Genres */}
        <DeckCardStack
          items={CURATED_GENRES}
          onSelectArtist={onSelectGenre}
          title="Genre Stack"
          subtitle="Swipe to browse eras"
          isGenre={true}
          height="h-[320px] sm:h-[340px]"
        />

        {/* 2. Quick Genre Grid */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              All Musical Movements
            </h3>
            <span className="text-[10px] text-on-surface-variant font-mono">
              Quick Tap
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {CURATED_GENRES.map((genre) => (
              <div
                key={genre.id}
                onClick={() => onSelectGenre(genre)}
                className="p-3.5 rounded-2xl bg-[#13141B] border border-white/5 hover:border-primary/40 active:scale-95 transition-all cursor-pointer flex flex-col justify-between space-y-2 shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-bold uppercase">
                    {genre.badge}
                  </span>
                  <Disc3 size={14} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
                </div>

                <div>
                  <h4 className="font-display font-black text-sm text-white truncate group-hover:text-primary transition-colors">
                    {genre.name}
                  </h4>
                  <p className="text-[10px] text-white/50 truncate mt-0.5">
                    {genre.artists.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreView;
