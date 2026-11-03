import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Disc3, Radio, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { CURATED_GENRES } from '../services/api';

const ExploreView = ({ onSelectGenre }) => {
  const containerRef = useRef(null);

  const scrollToCard = (index) => {
    if (!containerRef.current) return;
    const cardEl = containerRef.current.querySelector(`[data-card-index="${index}"]`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            Scroll down to stack legendary musical movements.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-surface-container-high border border-white/5 font-mono text-xs font-bold text-primary">
          {CURATED_GENRES.length} <span className="text-white/30">Eras</span>
        </div>
      </header>

      {/* Sticky Card Stack Scroll Area (Inspired by Oaksun Dribbble Interaction) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto hidden-scrollbar px-3 sm:px-4 pb-28 pt-2 space-y-4 select-none"
      >
        {CURATED_GENRES.map((genre, index) => {
          // Staggered sticky top offset so each stacked card tab header stays neatly visible
          const stickyTopOffset = index * 38 + 6;

          return (
            <div
              key={genre.id}
              data-card-index={index}
              style={{
                top: `${stickyTopOffset}px`,
                zIndex: index + 10,
              }}
              className="sticky rounded-[2rem] overflow-hidden border border-white/10 bg-[#121212] shadow-[0_-8px_30px_rgba(0,0,0,0.85)] transition-transform duration-300"
            >
              {/* Header Tab Bar (Always visible when stacked) */}
              <div
                onClick={() => scrollToCard(index)}
                className={`p-3.5 sm:p-4 border-b border-white/5 flex items-center justify-between cursor-pointer bg-gradient-to-r ${genre.gradient}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-black/40 border border-primary/20 shrink-0">
                    0{index + 1}
                  </span>
                  <h3 className="font-display font-black text-sm sm:text-base text-white tracking-tight truncate">
                    {genre.name}
                  </h3>
                </div>

                <span
                  className={`inline-block text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 backdrop-blur-md ${genre.tagBg}`}
                >
                  {genre.badge}
                </span>
              </div>

              {/* Main Card Expanded Content */}
              <div className="p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#0E0E0E] relative overflow-hidden min-h-[260px] sm:min-h-[280px]">
                {/* Visual Backdrop with subtle gradient overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-2/5 z-0 pointer-events-none overflow-hidden opacity-30">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover scale-110 filter saturate-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent" />
                </div>

                {/* Content description & Artists */}
                <div className="relative z-10 space-y-3 max-w-[75%]">
                  <div>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">
                      {genre.description}
                    </p>
                  </div>

                  {/* Artists Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {genre.artists.map((artistName) => (
                      <span
                        key={artistName}
                        className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium text-white/90"
                      >
                        {artistName}
                      </span>
                    ))}
                  </div>

                  {/* Audio Specs Badges */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 text-[9px] font-mono uppercase text-white/60 bg-black/50 px-2 py-0.5 rounded border border-white/5">
                      <Radio size={10} className="text-primary animate-pulse" />
                      10 Blind Drops
                    </span>
                    <span className="text-[9px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      2X XP MULTIPLIER
                    </span>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="relative z-10 pt-2">
                  <button
                    onClick={() => onSelectGenre(genre)}
                    className="w-full py-3 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-surface font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(114,254,143,0.35)] transition-all active:scale-95 cursor-pointer"
                  >
                    <Play size={13} className="fill-surface" />
                    <span>Launch {genre.name.split(' ')[0]} Challenge</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreView;
