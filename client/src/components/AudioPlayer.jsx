import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity } from 'lucide-react';

const AudioPlayer = ({ src, isPlaying, volume = 0.5, onEnded, onError }) => {
    const audioRef = useRef(null);
    const [muted, setMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isProducingSound, setIsProducingSound] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const unlockAudio = () => {
            if (!hasInteracted) setHasInteracted(true);
        };
        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);
        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        }
    }, [hasInteracted]);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying && hasInteracted) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsProducingSound(true))
                    .catch(e => {
                        console.log("Autoplay blocked or Failed audio", e);
                        setIsProducingSound(false);
                    });
            }
        } else {
            audioRef.current.pause();
            setIsProducingSound(false);
        }
    }, [isPlaying, hasInteracted, src]);

    const handleError = () => {
        console.error("AudioPlayer: Failed to load src:", src);
        if (onError) onError();
    };

    return (
        <div className={`w-full flex items-center justify-between bg-surface-container-highest/90 backdrop-blur-2xl rounded-2xl p-4 border border-white/5 shadow-2xl transition-all duration-500 z-20 ${isProducingSound ? 'shadow-[0_0_30px_rgba(114,254,143,0.15)] border-primary/20' : ''}`}>
            <audio
                ref={audioRef}
                src={src}
                onEnded={onEnded}
                onError={handleError}
                muted={muted}
                loop={false}
            />

            <div className="flex items-center space-x-4">
                {/* Play/Pause Indicator */}
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isProducingSound ? 'bg-primary text-surface shadow-[0_0_20px_rgba(114,254,143,0.3)]' : 'bg-surface-container text-on-surface-variant'}`}>
                    {isProducingSound && <div className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-primary"></div>}
                    {isProducingSound ? <Activity size={24} className="animate-pulse" /> : <Play size={24} className="ml-1" />}
                </div>

                <div className="flex flex-col">
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Now Playing</span>
                    <span className="text-sm text-white font-medium flex items-center gap-2">
                        {isProducingSound ? (
                            <span className="flex items-center gap-[3px] h-3">
                                <span className="w-1 h-full bg-primary animate-[bounce_1s_infinite] rounded-sm"></span>
                                <span className="w-1 h-2/3 bg-primary animate-[bounce_1.2s_infinite] rounded-sm"></span>
                                <span className="w-1 h-full bg-primary animate-[bounce_0.8s_infinite] rounded-sm"></span>
                            </span>
                        ) : 'Waiting...'}
                        {isProducingSound ? <span className="font-display font-medium tracking-tight">Preview Clip</span> : <span className="font-display font-medium tracking-tight">Tap to Unlock</span>}
                    </span>
                </div>
            </div>

            <button onClick={() => setMuted(!muted)} className="p-3 text-on-surface-variant hover:text-white hover:bg-surface-container rounded-2xl transition-colors active:scale-95">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>
    );
};

export default AudioPlayer;
