import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

const WAVEFORM_HEIGHTS = [
  35, 60, 40, 85, 95, 70, 50, 80, 100, 65, 45, 90, 75, 40, 60, 85, 50, 70, 95, 40, 60, 80, 45, 65,
];

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
  const [isProducingSound, setIsProducingSound] = useState(false);
  const [needsExplicitTap, setNeedsExplicitTap] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 30;
      setProgress((current / total) * 100);
      setDuration(Math.round(total));
    }
  };

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
      className={`w-full flex flex-col space-y-2 bg-[#121318]/90 backdrop-blur-2xl rounded-[1.75rem] p-3.5 border transition-all duration-300 shadow-xl ${
        isProducingSound
          ? 'border-primary/40 shadow-[0_10px_30px_rgba(114,254,143,0.15)]'
          : 'border-white/10'
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        onEnded={onEnded}
        onError={onError}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setIsProducingSound(true);
          setNeedsExplicitTap(false);
          if (onAudioStarted) onAudioStarted();
        }}
        muted={muted}
        preload="auto"
      />

      <div className="flex items-center justify-between">
        {/* Play Action Pill & Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={needsExplicitTap ? handleManualPlayTap : undefined}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              needsExplicitTap
                ? 'bg-primary text-black animate-pulse shadow-md scale-105'
                : isProducingSound
                ? 'bg-primary text-black shadow-md'
                : 'bg-white/10 text-white/70'
            }`}
          >
            {needsExplicitTap ? (
              <Play size={15} fill="currentColor" className="ml-0.5" />
            ) : isProducingSound ? (
              <Pause size={15} fill="currentColor" />
            ) : (
              <Play size={15} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold block">
              {needsExplicitTap ? 'Tap to Play' : isProducingSound ? 'Live Playing' : 'Preview Stream'}
            </span>
            <span className="text-xs font-semibold text-white">
              {needsExplicitTap ? 'Unmute Audio' : '30s Audio Drop'}
            </span>
          </div>
        </div>

        {/* Volume & Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            title={muted ? 'Unmute' : 'Mute'}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>

      {/* Pill Waveform Visualizer */}
      <div className="pt-1 px-1 flex items-center gap-1 h-7">
        {WAVEFORM_HEIGHTS.map((heightPercent, idx) => {
          const barProgressThreshold = (idx / WAVEFORM_HEIGHTS.length) * 100;
          const isPassed = progress >= barProgressThreshold;

          return (
            <div
              key={idx}
              className="flex-1 flex items-center justify-center h-full"
            >
              <div
                style={{
                  height: `${heightPercent}%`,
                  transition: 'height 0.25s ease, background-color 0.2s ease',
                }}
                className={`w-full max-w-[4px] rounded-full ${
                  isPassed
                    ? 'bg-primary shadow-[0_0_8px_rgba(114,254,143,0.5)]'
                    : 'bg-white/15'
                } ${isProducingSound ? 'animate-pulse' : ''}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioPlayer;
