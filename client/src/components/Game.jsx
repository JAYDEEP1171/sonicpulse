import React, { useState, useEffect, useRef } from 'react';
import { Zap, Play, ArrowLeft } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import Timer from './Timer';
import Report from './Report';
import { musicService } from '../services/api';

const TOTAL_ROUNDS = 10;

const Game = ({ artist, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [options, setOptions] = useState([]);

  // Scoring State
  const [score, setScore] = useState(0);
  const [roundTime, setRoundTime] = useState(10);
  const [correctCount, setCorrectCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState({ text: null, color: null, streak: null });
  const [isGameOver, setIsGameOver] = useState(false);

  // Animation / Feedback State
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isRoundProcessing, setIsRoundProcessing] = useState(false);

  const currentStreak = useRef(0);

  // 1. Fetch Tracks
  useEffect(() => {
    let isMounted = true;
    const fetchTracks = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await musicService.getArtistTracks(artist.id, artist.source, artist.name);
        if (!isMounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
        } else {
          setFetchError(`No playable previews found for ${artist.name}. Please try another artist.`);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to fetch tracks:', error);
        setFetchError('Could not load artist tracks. Please check connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (artist) fetchTracks();
    return () => {
      isMounted = false;
    };
  }, [artist]);

  // 2. Set up Options for Current Round
  useEffect(() => {
    if (loading || fetchError || tracks.length === 0) return;

    if (currentTrackIndex >= TOTAL_ROUNDS || currentTrackIndex >= tracks.length) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    const correctTrack = tracks[currentTrackIndex];
    const otherTracks = tracks.filter((t) => t.id !== correctTrack.id);

    // Fallback decoy pool if artist has fewer than 3 other tracks
    const fallbackDecoys = [
      { id: 'decoy-1', name: 'Blinding Lights', artists: [{ name: artist.name }] },
      { id: 'decoy-2', name: 'Starboy', artists: [{ name: artist.name }] },
      { id: 'decoy-3', name: 'Midnight City', artists: [{ name: artist.name }] },
      { id: 'decoy-4', name: 'Save Your Tears', artists: [{ name: artist.name }] },
    ];

    let wrongPool = [...otherTracks];
    if (wrongPool.length < 3) {
      const needed = 3 - wrongPool.length;
      wrongPool = [...wrongPool, ...fallbackDecoys.slice(0, needed)];
    }

    const shuffledWrong = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [correctTrack, ...shuffledWrong].sort(() => 0.5 - Math.random());

    setOptions(roundOptions);
    setIsPlaying(true);
    setRoundTime(10);
    setFeedback({ text: null, color: null, streak: null });
    setSelectedOptionId(null);
    setIsRoundProcessing(false);
  }, [currentTrackIndex, tracks, loading, fetchError]);

  // 3. Handle Answer Tap
  const handleAnswer = (selectedTrack) => {
    if (isRoundProcessing) return;
    setIsRoundProcessing(true);
    setSelectedOptionId(selectedTrack.id);
    setIsPlaying(false);

    const correctTrack = tracks[currentTrackIndex];
    const isCorrect = selectedTrack.id === correctTrack.id;
    const timeTaken = Math.max(0.1, 10 - roundTime);

    let points = 0;
    let text = null;
    let color = null;

    if (isCorrect) {
      currentStreak.current += 1;
      setReactionTimes((prev) => [...prev, timeTaken]);
      setCorrectCount((prev) => prev + 1);

      let roundScore = 1000 - timeTaken * 100;
      roundScore = Math.max(100, Math.floor(roundScore));

      // Haptic Vibration if supported on mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }

      // Reflex Speed Multiplier
      if (timeTaken <= 1.2) {
        roundScore = Math.floor(roundScore * 1.5);
        text = 'SUPER REFLEX!';
        color = 'text-primary';
      } else if (timeTaken < 3.0) {
        text = 'LIGHTNING GUESS!';
        color = 'text-primary';
      } else {
        text = 'CORRECT ANSWER';
        color = 'text-white';
      }

      const multiplier = Math.min(5, currentStreak.current);
      points = roundScore * multiplier;
      setFeedback({
        text,
        color,
        streak: `STREAK: ${multiplier}X MULTIPLIER`,
      });
    } else {
      currentStreak.current = 0;
      points = -500;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }
      setFeedback({
        text: 'INCORRECT MISS',
        color: 'text-red-500',
        streak: 'STREAK LOST',
      });
    }

    setScore((prev) => prev + points);

    setTimeout(() => {
      setCurrentTrackIndex((prev) => prev + 1);
    }, 1400);
  };

  // 4. Handle Time Expired
  const handleTimeUp = () => {
    if (!isGameOver && !isRoundProcessing) {
      setIsRoundProcessing(true);
      currentStreak.current = 0;
      setScore((prev) => prev - 500);
      setFeedback({ text: 'OUT OF TIME', color: 'text-red-500', streak: 'STREAK LOST' });
      setTimeout(() => setCurrentTrackIndex((prev) => prev + 1), 1400);
    }
  };

  // 5. Game Over View
  if (isGameOver) {
    const totalRoundsPlayed = Math.min(tracks.length, TOTAL_ROUNDS);
    const totalTime = reactionTimes.reduce((a, b) => a + b, 0);
    const avgSpeed = reactionTimes.length > 0 ? (totalTime / reactionTimes.length).toFixed(1) : '0.0';
    return (
      <Report
        score={score}
        totalRounds={totalRoundsPlayed}
        correctCount={correctCount}
        avgSpeed={avgSpeed}
        artist={artist}
        onRestart={onBack}
      />
    );
  }

  // 6. Loading View
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-spin">
          <Zap className="w-6 h-6 text-primary fill-primary" />
        </div>
        <div className="font-display text-primary font-bold tracking-[0.2em] text-sm uppercase animate-pulse">
          Loading {artist.name}...
        </div>
      </div>
    );
  }

  // 7. Error View
  if (fetchError) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 space-y-6 text-center">
        <p className="text-on-surface-variant text-sm font-medium">{fetchError}</p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-white font-bold text-xs uppercase tracking-widest border border-white/5 active:scale-95 cursor-pointer"
        >
          Choose Another Artist
        </button>
      </div>
    );
  }

  const currentTrack = tracks[currentTrackIndex];
  const totalRoundsCount = Math.min(tracks.length, TOTAL_ROUNDS);

  return (
    <div className="h-full flex flex-col w-full relative pt-5 pb-24 px-5 gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={onBack}
          title="Exit Quiz"
          className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-center font-display font-bold tracking-widest text-[11px] text-on-surface-variant uppercase">
          Round {String(currentTrackIndex + 1).padStart(2, '0')}/{String(totalRoundsCount).padStart(2, '0')}
        </div>
        <div className="font-display font-black text-sm text-primary tracking-wider">
          {score.toLocaleString()} <span className="text-[10px] text-white">PTS</span>
        </div>
      </div>

      {/* Album Art & Perimeter Countdown Tracker */}
      <div className="flex justify-center w-full z-10 px-2">
        <div className="w-full max-w-[290px]">
          <Timer
            key={currentTrackIndex}
            duration={10}
            active={isPlaying && !isRoundProcessing}
            onTimeUp={handleTimeUp}
            onTick={setRoundTime}
          >
            <img
              key={currentTrack?.id}
              src={currentTrack?.album?.images?.[0]?.url || artist?.images?.[0]?.url}
              alt="Track Artwork"
              className="w-full h-full object-cover opacity-90 transition-opacity"
            />
            {!isPlaying && !isRoundProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Play className="text-white fill-white w-10 h-10" />
              </div>
            )}
          </Timer>
        </div>
      </div>

      {/* Dynamic Feedback Zone */}
      <div className="flex flex-col items-center justify-center min-h-[50px] z-10 text-center">
        {feedback.text ? (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="flex items-center justify-center gap-1.5">
              {feedback.color === 'text-primary' && (
                <Zap className="text-yellow-400 fill-yellow-400 w-4 h-4 animate-pulse" />
              )}
              <span className={`font-display font-black text-lg uppercase tracking-tight ${feedback.color}`}>
                {feedback.text}
              </span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
              {feedback.streak}
            </span>
          </div>
        ) : (
          <span className="text-on-surface-variant/40 text-[11px] tracking-widest uppercase font-semibold">
            Tap the correct title
          </span>
        )}
      </div>

      {/* 2x2 Option Pad Grid */}
      <div className="w-full grid grid-cols-2 gap-2.5 z-10">
        {options.map((track) => {
          const isSelected = track.id === selectedOptionId;
          const isCorrect = track.id === currentTrack.id;

          let btnClass =
            'flex flex-col items-center justify-center text-center p-3.5 rounded-2xl transition-all duration-150 min-h-[72px] ';

          if (isRoundProcessing) {
            if (isCorrect) {
              btnClass +=
                'bg-primary text-surface scale-[1.02] z-10 shadow-[0_0_20px_rgba(114,254,143,0.4)] font-black';
            } else if (isSelected && !isCorrect) {
              btnClass += 'bg-red-500/20 border border-red-500/50 text-white/50 scale-95';
            } else {
              btnClass += 'bg-surface-container opacity-25 cursor-not-allowed';
            }
          } else {
            btnClass +=
              'bg-surface-container-highest hover:bg-[#2A2A2A] text-white active:scale-95 cursor-pointer shadow-md border border-white/5';
          }

          return (
            <button
              key={track.id}
              disabled={isRoundProcessing}
              onClick={() => handleAnswer(track)}
              className={btnClass}
            >
              <span
                className={`font-bold text-xs leading-snug line-clamp-2 ${
                  isRoundProcessing && isCorrect ? 'text-surface' : 'text-white'
                }`}
              >
                {track.name}
              </span>
              <span
                className={`text-[9px] mt-0.5 truncate max-w-full ${
                  isRoundProcessing && isCorrect ? 'text-surface/80 font-bold' : 'text-on-surface-variant'
                }`}
              >
                {track.artists?.[0]?.name || artist.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Audio Stream Controller */}
      {currentTrack && (
        <AudioPlayer
          src={currentTrack.preview_url}
          isPlaying={isPlaying}
          onEnded={() => {}}
          onError={() => {
            console.error('Audio stream failed to load:', currentTrack.preview_url);
            // Auto credit round if audio preview URL is blocked by network
            setIsPlaying(false);
            setIsRoundProcessing(true);
            currentStreak.current += 1;
            setScore((prev) => prev + 800);
            setFeedback({
              text: 'AUDIO UNREACHABLE: PASS',
              color: 'text-primary',
              streak: 'QA PASS',
            });
            setTimeout(() => setCurrentTrackIndex((prev) => prev + 1), 1400);
          }}
        />
      )}
    </div>
  );
};

export default Game;
