import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';

const AudioPlayer = ({
  src,
  isPlaying,
  volume = 0.7,
  onAudioStarted,
  onEnded,
  onError,
}) => {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(true);
  const [isProducingSound, setIsProducingSound] = useState(false);
  const [needsExplicitTap, setNeedsExplicitTap] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle global touch/click to unlock mobile audio context
  useEffect(() => {
    const unlockAudio = () => {
      setHasInteracted(true);
      if (audioRef.current && isPlaying && !isProducingSound) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [isPlaying, isProducingSound]);

  // Audio Play / Pause control
  useEffect(() => {
    if (!audioRef.current || !src) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsProducingSound(true);
            setNeedsExplicitTap(false);
            if (onAudioStarted) onAudioStarted();
          })
          .catch((err) => {
            console.warn('Autoplay prevented or buffering:', err);
            setIsProducingSound(false);
            setNeedsExplicitTap(true);
          });
      }
    } else {
      audioRef.current.pause();
      setIsProducingSound(false);
    }
  }, [isPlaying, src]);

  const handleManualPlayTap = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsProducingSound(true);
          setNeedsExplicitTap(false);
          if (onAudioStarted) onAudioStarted();
        })
        .catch((e) => {
          console.error('Manual audio play failed:', e);
        });
    }
  };

  return (
    <div
      className={`w-full flex items-center justify-between bg-surface-container-highest/90 backdrop-blur-2xl rounded-2xl p-3.5 border border-white/5 shadow-2xl transition-all duration-500 z-20 ${
        isProducingSound ? 'shadow-[0_0_30px_rgba(114,254,143,0.2)] border-primary/30' : ''
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        onEnded={onEnded}
        onError={onError}
        onPlay={() => {
          setIsProducingSound(true);
          setNeedsExplicitTap(false);
          if (onAudioStarted) onAudioStarted();
        }}
        muted={muted}
        preload="auto"
      />

      <div className="flex items-center space-x-3.5">
        {/* Play/Sound Indicator */}
        <div
          onClick={needsExplicitTap ? handleManualPlayTap : undefined}
          className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            needsExplicitTap
              ? 'bg-primary text-surface cursor-pointer animate-pulse scale-105 shadow-[0_0_20px_rgba(114,254,143,0.5)]'
              : isProducingSound
              ? 'bg-primary text-surface shadow-[0_0_20px_rgba(114,254,143,0.3)]'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {isProducingSound && (
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-25 bg-primary"></div>
          )}
          {needsExplicitTap ? (
            <Play size={20} className="fill-surface ml-0.5" />
          ) : isProducingSound ? (
            <Activity size={20} className="animate-pulse" />
          ) : (
            <Play size={20} className="ml-0.5 opacity-60" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
            {needsExplicitTap ? 'Action Required' : 'Audio Stream'}
          </span>
          <span className="text-xs text-white font-medium flex items-center gap-2">
            {isProducingSound ? (
              <span className="flex items-center gap-[3px] h-3">
                <span className="w-1 h-full bg-primary animate-[bounce_0.8s_infinite] rounded-sm"></span>
                <span className="w-1 h-2/3 bg-primary animate-[bounce_1.1s_infinite] rounded-sm"></span>
                <span className="w-1 h-4/5 bg-primary animate-[bounce_0.6s_infinite] rounded-sm"></span>
                <span className="w-1 h-full bg-primary animate-[bounce_0.9s_infinite] rounded-sm"></span>
              </span>
            ) : null}
            <span className="font-display font-medium tracking-tight">
              {needsExplicitTap
                ? 'Tap here to enable sound'
                : isProducingSound
                ? '30s Audio Stream Live'
                : 'Buffering track...'}
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={() => setMuted(!muted)}
        title={muted ? 'Unmute' : 'Mute'}
        className="p-2.5 text-on-surface-variant hover:text-white hover:bg-surface-container rounded-xl transition-colors active:scale-95 cursor-pointer"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
