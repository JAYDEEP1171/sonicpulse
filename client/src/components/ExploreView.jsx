import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, ChevronUp, Radio, Disc3, Flame } from 'lucide-react';
import { CURATED_GENRES } from '../services/api';

const ExploreView = ({ onSelectGenre }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CURATED_GENRES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CURATED_GENRES.length) % CURATED_GENRES.length);
  };

  // Stack of 3 visible cards
  const visibleCards = [
    CURATED_GENRES[currentIndex],
    CURATED_GENRES[(currentIndex + 1) % CURATED_GENRES.length],
    CURATED_GENRES[(currentIndex + 2) % CURATED_GENRES.length],
  ];

  return (
    <div className="h-full w-full p-4 sm:p-5 flex flex-col justify-between relative z-10 pt-5 sm:pt-6 overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center shrink-0">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
            <Disc3 size={12} className="animate-spin text-primary" style={{ animationDuration: '6s' }} />
            <span>Curated Sound Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Explore <span className="text-primary">Genres</span>
          </h2>
          <p className="text-on-surface-variant font-medium text-xs">
            Swipe up through legendary eras & movements.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-surface-container-high border border-white/5 font-mono text-xs font-bold text-primary">
          0{currentIndex + 1} <span className="text-white/30">/ 0{CURATED_GENRES.length}</span>
        </div>
      </header>

      {/* Swipe-Up Card Stack Area */}
      <div className="relative flex-1 flex items-center justify-center my-2 select-none touch-none">
        <div className="relative w-full max-w-[340px] h-[410px] sm:h-[430px] flex items-center justify-center">
          {visibleCards.map((genre, index) => {
            const isTop = index === 0;

            return (
              <motion.div
                key={genre.id}
                className={`absolute w-full h-full rounded-[2rem] overflow-hidden border cursor-grab active:cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between p-5 sm:p-6 ${
                  genre.border
                } bg-[#111111]`}
                style={{
                  zIndex: 10 - index,
                }}
                initial={false}
                animate={{
                  top: index * 16,
                  scale: 1 - index * 0.05,
                  opacity: 1 - index * 0.22,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                }}
                drag={isTop ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -50 || info.velocity.y < -400) {
                    handleNext();
                  } else if (info.offset.y > 60 || info.velocity.y > 400) {
                    handlePrev();
                  }
                }}
              >
                {/* Background Cover Image with cinematic dark gradient */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} mix-blend-overlay`} />
                </div>

                {/* Card Top: Badges & Live Status */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${genre.tagBg}`}
                  >
                    {genre.badge}
                  </span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 text-[10px] font-mono">
                    <Radio size={11} className="text-primary animate-pulse" />
                    <span>30s DROPS</span>
                  </div>
                </div>

                {/* Card Center: Title & Artist Roster */}
                <div className="relative z-10 space-y-3">
                  <div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                      {genre.name}
                    </h3>
                    <p className="text-xs text-white/70 font-medium mt-1">
                      {genre.description}
                    </p>
                  </div>

                  {/* Artists Roster Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {genre.artists.map((artistName) => (
                      <span
                        key={artistName}
                        className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-white/90"
                      >
                        {artistName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: CTA & Specs */}
                <div className="relative z-10 space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-white/60">
                    <span>10 Shuffled Rounds</span>
                    <span className="text-primary font-bold">2X XP Multiplier</span>
                  </div>

                  {/* Start Quiz CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectGenre(genre);
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-surface font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(114,254,143,0.4)] transition-all active:scale-95 cursor-pointer"
                  >
                    <Play size={14} className="fill-surface" />
                    <span>Start Genre Challenge</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint & Indicator Controls */}
      <footer className="shrink-0 flex flex-col items-center space-y-2 pb-20">
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 border border-white/10 text-on-surface-variant hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
        >
          <ChevronUp size={12} className="text-primary animate-bounce" />
          <span>Swipe Up or Tap for Next</span>
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-1.5">
          {CURATED_GENRES.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};

export default ExploreView;
