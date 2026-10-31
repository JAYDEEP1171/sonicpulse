import React, { useState, useEffect, useRef } from 'react';
import { Zap, Play, ArrowLeft, Volume2, ShieldAlert, Sparkles, Music } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import Timer from './Timer';
import Report from './Report';
import { musicService } from '../services/api';

const TOTAL_ROUNDS = 10;

const Game = ({ artist, onBack }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false); // Timer only runs when audio is truly playing
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [options, setOptions] = useState([]);

  // Ready Countdown State (3... 2... 1... DROP!)
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);

  // Scoring State
  const [score, setScore] = useState(0);
  const [roundTime, setRoundTime] = useState(10);
  const [correctCount, setCorrectCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState({ text: null, color: null, streak: null });
  const [isGameOver, setIsGameOver] = useState(false);

  // Feedback / Selection State
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isRoundProcessing, setIsRoundProcessing] = useState(false);

  const currentStreak = useRef(0);

  // 1. Fetch Tracks for Artist
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
          setFetchError(`No playable previews found for ${artist.name}. Try another artist.`);
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

  // 2. 3-Second "Ready" Countdown Loop
  useEffect(() => {
    if (loading || fetchError || tracks.length === 0 || !isCountingDown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished -> Start Round 1
      setIsCountingDown(false);
      setIsPlaying(true);
    }
  }, [countdown, isCountingDown, loading, fetchError, tracks]);

  // Skip countdown on user tap (acts as instant audio unlock gesture)
  const handleSkipCountdown = () => {
    setCountdown(0);
    setIsCountingDown(false);
    setIsPlaying(true);
  };

  // 3. Assemble Round Options
  useEffect(() => {
    if (loading || fetchError || tracks.length === 0 || isCountingDown) return;

    if (currentTrackIndex >= TOTAL_ROUNDS || currentTrackIndex >= tracks.length) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    const correctTrack = tracks[currentTrackIndex];
    const otherTracks = tracks.filter((t) => t.id !== correctTrack.id);

    // Fallback pool of believable song titles if the artist catalog is small
    const fallbackDecoys = [
      { id: 'decoy-1', name: 'Midnight Shadows', artists: [{ name: artist.name }] },
      { id: 'decoy-2', name: 'Electric Rush', artists: [{ name: artist.name }] },
      { id: 'decoy-3', name: 'Echoes in the Dark', artists: [{ name: artist.name }] },
      { id: 'decoy-4', name: 'After Hours Glow', artists: [{ name: artist.name }] },
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
    setIsAudioActive(false); // Reset until audio confirms playback
    setRoundTime(10);
    setFeedback({ text: null, color: null, streak: null });
    setSelectedOptionId(null);
    setIsRoundProcessing(false);
  }, [currentTrackIndex, tracks, loading, fetchError, isCountingDown]);

  // Callback from AudioPlayer when audio actually starts playing
  const handleAudioStarted = () => {
    setIsAudioActive(true);
  };

  // 4. Handle Answer Selection
  const handleAnswer = (selectedTrack) => {
    if (isRoundProcessing) return;
    setIsRoundProcessing(true);
    setSelectedOptionId(selectedTrack.id);
    setIsPlaying(false);
    setIsAudioActive(false);

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

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }

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
        streak: 'STREAK RESET',
      });
    }

    setScore((prev) => prev + points);

    setTimeout(() => {
      setCurrentTrackIndex((prev) => prev + 1);
    }, 1500);
  };

  // 5. Handle Time Expiry
  const handleTimeUp = () => {
    if (!isGameOver && !isRoundProcessing) {
      setIsRoundProcessing(true);
      setIsPlaying(false);
      setIsAudioActive(false);
      currentStreak.current = 0;
      setScore((prev) => prev - 500);
      setFeedback({ text: 'OUT OF TIME', color: 'text-red-500', streak: 'STREAK RESET' });
      setTimeout(() => setCurrentTrackIndex((prev) => prev + 1), 1500);
    }
  };

  // 6. Game Over View
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

  // 7. Loading View
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-spin">
          <Zap className="w-6 h-6 text-primary fill-primary" />
        </div>
        <div className="font-display text-primary font-bold tracking-[0.2em] text-sm uppercase animate-pulse">
          Syncing {artist.name}...
        </div>
      </div>
    );
  }

  // 8. Error View
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

  // 9. 3-Second "Ready" Countdown Overlay (Fix for BUG-01)
  if (isCountingDown) {
    return (
      <div
        onClick={handleSkipCountdown}
        className="h-full flex flex-col items-center justify-center p-6 space-y-8 cursor-pointer relative z-20 select-none animate-fade-in text-center"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Music className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">
              Audio Reflex Challenge
            </span>
          </div>
          <h2 className="text-2xl font-display font-black text-white">{artist.name}</h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
            Tap anywhere to launch immediately
          </p>
        </div>

        {/* Big Animated Kinetic Countdown Circle */}
        <div className="relative w-36 h-36 rounded-full border-4 border-primary/20 flex items-center justify-center shadow-[0_0_50px_rgba(114,254,143,0.25)]">
          <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-25"></div>
          <span className="font-display font-black text-7xl text-primary tracking-tighter drop-shadow-[0_0_20px_rgba(114,254,143,0.8)]">
            {countdown > 0 ? countdown : 'GO!'}
          </span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-primary font-bold tracking-widest uppercase animate-pulse">
            {countdown === 0 ? 'AUDIO DROPPING...' : 'GET YOUR EARS READY'}
          </span>
          <span className="text-[10px] text-on-surface-variant/60 tracking-wider">
            10 Rounds • Sub-second answers earn 5X streaks
          </span>
        </div>
      </div>
    );
  }

  const currentTrack = tracks[currentTrackIndex];
  const totalRoundsCount = Math.min(tracks.length, TOTAL_ROUNDS);

  return (
    <div className="h-full flex flex-col w-full relative pt-5 pb-24 px-5 gap-4">
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

      {/* Album Art & Perimeter Countdown Tracker (Fix for BUG-02: Anti-Cheat Shield) */}
      <div className="flex justify-center w-full z-10 px-2">
        <div className="w-full max-w-[280px]">
          <Timer
            key={currentTrackIndex}
            duration={10}
            active={isAudioActive && !isRoundProcessing}
            onTimeUp={handleTimeUp}
            onTick={setRoundTime}
          >
            <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
              {/* Actual Album Art: Heavy frosted blur while guessing, unblurs on answer */}
              <img
                key={currentTrack?.id}
                src={currentTrack?.album?.images?.[0]?.url || artist?.images?.[0]?.url}
                alt="Track Artwork"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isRoundProcessing
                    ? 'filter-none blur-0 scale-100 opacity-100'
                    : 'filter blur-2xl scale-125 opacity-60'
                }`}
              />

              {/* Anti-Cheat Shield Overlay during active guess */}
              {!isRoundProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/30 backdrop-blur-sm p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest/80 border border-primary/30 flex items-center justify-center shadow-[0_0_25px_rgba(114,254,143,0.3)] mb-2 animate-pulse">
                    <Music className="w-7 h-7 text-primary fill-primary/20" />
                  </div>
                  <span className="font-display font-black text-[11px] tracking-[0.2em] text-white uppercase drop-shadow">
                    Audio Reflex Only
                  </span>
                  <span className="text-[9px] text-primary/80 font-mono tracking-widest mt-0.5">
                    {isAudioActive ? 'PREVIEW STREAMING' : 'BUFFERING BEATS...'}
                  </span>
                </div>
              )}
            </div>
          </Timer>
        </div>
      </div>

      {/* Dynamic Feedback Zone */}
      <div className="flex flex-col items-center justify-center min-h-[44px] z-10 text-center">
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
          <span className="text-on-surface-variant/50 text-[11px] tracking-widest uppercase font-semibold">
            {isAudioActive ? 'Identify this track' : 'Syncing audio...'}
          </span>
        )}
      </div>

      {/* 2x2 Option Pad Grid */}
      <div className="w-full grid grid-cols-2 gap-2.5 z-10">
        {options.map((track) => {
          const isSelected = track.id === selectedOptionId;
          const isCorrect = track.id === currentTrack.id;

          let btnClass =
            'flex flex-col items-center justify-center text-center p-3 rounded-2xl transition-all duration-150 min-h-[70px] ';

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

      {/* Audio Stream Controller with Auto-Play & Live Sync */}
      {currentTrack && (
        <AudioPlayer
          src={currentTrack.preview_url}
          isPlaying={isPlaying}
          onAudioStarted={handleAudioStarted}
          onEnded={() => {}}
          onError={() => {
            console.error('Audio stream failed to load:', currentTrack.preview_url);
            setIsPlaying(false);
            setIsAudioActive(false);
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
