import React, { useRef, useState, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Download, Share2, Zap, ArrowLeft, Check, Crown, Flame, Award, AlertCircle, RotateCcw, Search } from 'lucide-react';
import { recordGameScore } from '../services/supabase';

const Report = ({ score, totalRounds, correctCount, avgSpeed, artist, user, onRestart, onPlayAgain }) => {
  const ref = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const hasRecordedRef = useRef(false);

  // 1. Calculate Accuracy & Performance Tier
  const accuracy = totalRounds > 0 ? (correctCount / totalRounds) * 100 : 0;
  const speedNum = parseFloat(avgSpeed) || 0;

  // Dynamic Tier Themes
  let tier = {
    verdict: 'NOVICE',
    subTitle: 'WARMUP SESSION',
    accentColor: 'text-[#F87171]',
    badgeBg: 'bg-red-500/20 border-red-500/40 text-red-300',
    cardBorder: 'border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.15)]',
    scoreColor: 'text-red-400',
    icon: AlertCircle,
  };

  if (accuracy >= 95 || (accuracy >= 90 && speedNum <= 1.2)) {
    tier = {
      verdict: 'ELITE',
      subTitle: 'APEX MUSIC REFLEX',
      accentColor: 'text-[#FBBF24]', // Amber Gold
      badgeBg: 'bg-[#FBBF24]/20 border-[#FBBF24]/50 text-[#FDE68A]',
      cardBorder: 'border-[#FBBF24]/40 shadow-[0_0_60px_rgba(251,191,36,0.25)]',
      scoreColor: 'text-[#FBBF24]',
      icon: Crown,
    };
  } else if (accuracy >= 80) {
    tier = {
      verdict: 'PRODIGY',
      subTitle: 'SUPERFAN TIER',
      accentColor: 'text-[#88EBFF]', // Cyber Cyan
      badgeBg: 'bg-[#88EBFF]/20 border-[#88EBFF]/50 text-[#CFFAFE]',
      cardBorder: 'border-[#88EBFF]/40 shadow-[0_0_50px_rgba(136,235,255,0.2)]',
      scoreColor: 'text-[#88EBFF]',
      icon: Flame,
    };
  } else if (accuracy >= 50) {
    tier = {
      verdict: 'CASUAL',
      subTitle: 'RHYTHM CADET',
      accentColor: 'text-primary', // Electric Neon Green
      badgeBg: 'bg-primary/20 border-primary/40 text-primary',
      cardBorder: 'border-primary/20 shadow-[0_0_40px_rgba(114,254,143,0.15)]',
      scoreColor: 'text-primary',
      icon: Award,
    };
  }

  // Automatically record score to Supabase Leaderboard
  useEffect(() => {
    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;

    if (user && user.id && !user.id.startsWith('guest-')) {
      recordGameScore({
        userId: user.id,
        username: user.username || user.name,
        artistName: artist.name,
        score,
        accuracy,
        avgSpeed,
        tier: tier.verdict,
      });
    }
  }, [user, artist, score, accuracy, avgSpeed, tier.verdict]);

  const TierIcon = tier.icon;

  // 2. Helper to convert dataUrl to Blob/File for Web Share API
  const generateImageFile = async () => {
    if (!ref.current) return null;
    const blob = await toBlob(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
    });
    if (!blob) return null;
    return new File(
      [blob],
      `sonicpulse-dna-${artist.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`,
      { type: 'image/png' }
    );
  };

  // 3. Native Mobile Share (Instagram Stories, WhatsApp, TikTok, etc.)
  const handleNativeShare = async () => {
    setSharing(true);
    setFeedbackMsg('');
    try {
      const file = await generateImageFile();
      if (!file) throw new Error('Could not generate report image');

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SonicPulse DNA: ${artist.name}`,
          text: `⚡️ I achieved ${tier.verdict} status with ${Math.round(accuracy)}% accuracy on ${artist.name} in SonicPulse! Can you beat my reflex speed?`,
        });
        setFeedbackMsg('Shared successfully!');
      } else {
        await handleDirectDownload();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed, triggering direct download fallback:', err);
        await handleDirectDownload();
      }
    } finally {
      setSharing(false);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  // 4. Direct PNG Download (Desktop / Backup)
  const handleDirectDownload = async () => {
    if (!ref.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `sonicpulse-dna-${artist.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      setFeedbackMsg('Report downloaded as PNG!');
    } catch (err) {
      console.error('Failed to download report', err);
      setFeedbackMsg('Download failed. Please try again.');
    } finally {
      setSharing(false);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start bg-surface relative z-20 overflow-y-auto hidden-scrollbar p-3 pb-8">
      {/* 
        The Capture Canvas: EXACT 9:16 aspect ratio shareable card.
        Clean original photography (NO green distortion filter), dynamic tier colors, and generous bottom padding.
      */}
      <div
        ref={ref}
        className={`w-full max-w-[360px] aspect-[9/16] bg-[#0A0A0A] rounded-[2rem] border ${tier.cardBorder} flex flex-col items-center justify-between relative overflow-hidden p-5 sm:p-6 z-10 shrink-0 transition-all`}
      >
        {/* Top Header */}
        <div className="w-full text-center mt-1 z-10 space-y-1">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${tier.badgeBg} mb-1 shadow-md`}>
            <TierIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {tier.subTitle}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black italic tracking-tighter text-white">
            MUSIC <span className={tier.accentColor}>DNA</span>
          </h1>
          <p className="text-[9px] text-on-surface-variant font-bold tracking-[0.25em] uppercase">
            SESSION •{' '}
            {new Date()
              .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
              .replace(/\//g, '.')}
          </p>
        </div>

        {/* Hero Visual: Natural, Crisp Artist Photography with Cinematic Dark Vignette */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl mt-2 sm:mt-3 border border-white/10 bg-black">
          {artist?.images?.[0]?.url ? (
            <img
              src={artist.images[0].url}
              alt={artist.name}
              className="w-full h-full object-cover object-center"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container font-display font-black text-5xl text-white">
              {artist.name[0]}
            </div>
          )}

          {/* Vignette Overlay for Editorial Look */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30 pointer-events-none"></div>

          {/* Verified Badge */}
          <div className={`absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg font-display font-black text-[11px] tracking-widest uppercase shadow-lg ${tier.badgeBg}`}>
            DNA VERIFIED
          </div>

          {/* Score Badge */}
          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg border border-white/10 font-bold">
            {score.toLocaleString()} PTS
          </div>
        </div>

        {/* Artist Name */}
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase text-center mt-2.5 w-full truncate">
          {artist.name}
        </h2>

        {/* 2x2 Stats Grid with Dynamic Tier Accents */}
        <div className="grid grid-cols-2 gap-2 w-full mt-1.5 mb-1.5 px-1">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container border border-white/5 shadow-md">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-0.5">
              Accuracy
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter">
              {Math.round(accuracy)}
              <span className={`text-lg sm:text-xl ml-0.5 ${tier.accentColor}`}>%</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container border border-white/5 shadow-md">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-0.5">
              Reflex Class
            </span>
            <div className={`font-display font-black text-xl sm:text-2xl tracking-wider uppercase ${tier.accentColor}`}>
              {tier.verdict}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container border border-white/5 shadow-md">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-0.5">
              Avg. Reflex
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter">
              {avgSpeed}
              <span className="text-on-surface-variant text-sm sm:text-base ml-0.5">s</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container border border-white/5 shadow-md">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-0.5">
              Correct
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter">
              {correctCount}
              <span className="text-on-surface-variant text-xs sm:text-sm ml-0.5">/{totalRounds}</span>
            </div>
          </div>
        </div>

        {/* Clean Footer Brand Watermark */}
        <div className="text-[8px] sm:text-[9px] font-mono tracking-widest text-on-surface-variant/50 uppercase pb-1 text-center w-full">
          sonicpulse.app • audio reflex platform
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-primary text-surface px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-[0_0_25px_rgba(114,254,143,0.6)] z-50 animate-fade-in">
          <Check size={14} strokeWidth={3} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Primary Action: Replay with 10 Brand New Songs */}
      <div className="w-full max-w-[360px] flex flex-col items-center gap-2.5 mt-3 shrink-0">
        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-[#86febc] text-surface font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(114,254,143,0.3)] hover:shadow-[0_0_35px_rgba(114,254,143,0.5)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Play 10 New Songs ({artist.name})</span>
          </button>
        )}

        {/* Secondary Buttons Row */}
        <div className="flex items-center justify-between gap-2.5 w-full">
          {/* Back to search */}
          <button
            onClick={onRestart}
            title="Search Other Artists"
            className="flex-1 py-3 px-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/5 flex items-center justify-center gap-1.5 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-on-surface-variant" />
            <span>Search</span>
          </button>

          {/* Share Story */}
          <button
            onClick={handleNativeShare}
            disabled={sharing}
            title="Share to Instagram Stories / WhatsApp"
            className="flex-1 py-3 px-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-primary/20 flex items-center justify-center gap-1.5 text-primary text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            {sharing ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Direct Download PNG */}
          <button
            onClick={handleDirectDownload}
            disabled={sharing}
            title="Download PNG Card"
            className="w-12 h-11 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/5 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
