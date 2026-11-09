import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Play, Sparkles, ChevronRight, Layers, Flame, Music, Heart, Disc3 } from 'lucide-react';

/**
 * StackCard: Represents an individual item in the 3D recent-apps deck.
 */
function StackCard({
  item,
  index,
  total,
  onSwipe,
  onSelect,
  isTop,
  isGenre = false,
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const opacity = useTransform(x, [-180, 0, 180], [0.35, 1, 0.35]);

  const scale = 1 - index * 0.05;
  const translateY = index * 14;
  const zIndex = total - index;

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 400) {
      const direction = info.offset.x > 0 ? 1 : -1;
      onSwipe(direction);
    }
  };

  const imageSrc =
    item.image ||
    item.img ||
    item.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600';

  return (
    <motion.div
      style={{
        zIndex,
        ...(isTop ? { x, rotate, opacity } : {}),
      }}
      initial={{ scale: 0.9, y: translateY + 30, opacity: 0 }}
      animate={{
        scale,
        y: translateY,
        opacity: Math.max(0.2, 1 - index * 0.22),
      }}
      exit={{
        x: x.get() > 0 ? 320 : -320,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.22 },
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
      className={`absolute inset-0 rounded-[2rem] overflow-hidden select-none cursor-pointer border ${
        isTop ? 'border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'border-white/5 shadow-md'
      }`}
    >
      {/* Background Poster Image */}
      <img
        src={imageSrc}
        alt={item.name}
        className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
        draggable={false}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

      {/* Top Bar on Card */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider font-mono border border-white/20 shadow-sm">
          {item.tag || item.badge || (isGenre ? 'GENRE DECK' : 'SPOTLIGHT')}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white border border-white/10"
        >
          <Heart size={14} />
        </button>
      </div>

      {/* Card Content & Details */}
      <div className="absolute bottom-5 left-5 right-5 space-y-2.5">
        <div className="space-y-0.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
            {item.subtitle || item.description || 'Curated Sound Deck'}
          </p>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white leading-tight truncate">
            {item.name}
          </h3>
        </div>

        {/* Action Pill */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-white/70">
            {isGenre ? (
              <Disc3 size={13} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
            ) : (
              <Music size={13} className="text-primary" />
            )}
            <span className="truncate max-w-[130px] font-medium">
              {item.artists
                ? item.artists.slice(0, 3).join(', ')
                : item.topTracks
                ? item.topTracks.slice(0, 2).join(', ')
                : 'Featured Tracks'}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <Play size={12} fill="currentColor" />
            <span>Launch</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * DeckCardStack: 3D Gesture Stack
 */
export default function DeckCardStack({
  items,
  onSelectArtist,
  title = 'Spotlight Stack',
  subtitle = 'Swipe cards left or right',
  isGenre = false,
  height = 'h-[290px] sm:h-[310px]',
}) {
  const [deck, setDeck] = useState(items || []);

  const handleSwipe = (direction) => {
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handleSelect = (item) => {
    if (onSelectArtist) {
      onSelectArtist(item);
    }
  };

  const visibleCards = deck.slice(0, 3);

  return (
    <div className="w-full flex flex-col space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Layers size={14} className="text-primary" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {title}
          </h4>
        </div>
        <span className="text-[10px] text-on-surface-variant font-mono">
          {subtitle}
        </span>
      </div>

      <div className={`relative w-full ${height}`}>
        <AnimatePresence initial={false}>
          {visibleCards.map((item, index) => (
            <StackCard
              key={item.id}
              item={item}
              index={index}
              total={visibleCards.length}
              isTop={index === 0}
              onSwipe={handleSwipe}
              onSelect={handleSelect}
              isGenre={isGenre}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
