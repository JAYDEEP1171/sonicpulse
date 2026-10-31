import React, { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Download, Share2, Zap, ArrowLeft, Check } from 'lucide-react';

const Report = ({ score, totalRounds, correctCount, avgSpeed, artist, onRestart }) => {
  const ref = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Calculate Performance Tier
  const accuracy = totalRounds > 0 ? (correctCount / totalRounds) * 100 : 0;
  let verdict = 'NOVICE';
  let badgeColor = 'text-primary';

  if (accuracy >= 95) {
    verdict = 'ELITE';
  } else if (accuracy >= 80) {
    verdict = 'PRODIGY';
    badgeColor = 'text-tertiary';
  } else if (accuracy >= 50) {
    verdict = 'CASUAL';
    badgeColor = 'text-on-surface-variant';
  }

  // Helper to convert dataUrl to Blob/File for Web Share API
  const generateImageFile = async () => {
    if (!ref.current) return null;
    const blob = await toBlob(ref.current, {
      cacheBust: true,
      pixelRatio: 2,
    });
    if (!blob) return null;
    return new File([blob], `sonicpulse-dna-${artist.name.toLowerCase().replace(/\s+/g, '-')}.png`, {
      type: 'image/png',
    });
  };

  // 1. Native Mobile Share (Instagram Stories, WhatsApp, TikTok, etc.)
  const handleNativeShare = async () => {
    setSharing(true);
    setFeedbackMsg('');
    try {
      const file = await generateImageFile();
      if (!file) throw new Error('Could not generate image');

      // Check if Web Share API with files is supported (iOS Safari / Android Chrome)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `SonicPulse DNA: ${artist.name}`,
          text: `⚡️ I scored ${score} pts with ${Math.round(accuracy)}% accuracy on ${artist.name} in SonicPulse! Can you beat my reflex speed?`,
        });
        setFeedbackMsg('Shared successfully!');
      } else {
        // Fallback directly to PNG download if native file share is unsupported
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

  // 2. Direct PNG Download (Desktop / Direct Save)
  const handleDirectDownload = async () => {
    if (!ref.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `sonicpulse-dna-${artist.name.toLowerCase().replace(/\s+/g, '-')}.png`;
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
    <div className="h-full w-full flex flex-col items-center justify-start p-0 bg-surface relative z-20 overflow-y-auto hidden-scrollbar pb-32">
      {/* The Capture Canvas - EXACTLY 9:16 portrait */}
      <div
        ref={ref}
        className="w-full aspect-[9/16] bg-[#0A0A0A] flex flex-col items-center justify-between relative overflow-hidden p-6 z-10 shrink-0"
      >
        {/* Header: DNA REPORT */}
        <div className="w-full text-center mt-4 z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-1">
            <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">
              Sonic Reflex Report
            </span>
          </div>
          <h1 className="text-4xl font-display font-black italic tracking-tighter text-white">
            MUSIC <span className="text-primary">DNA</span>
          </h1>
          <p className="text-[9px] text-on-surface-variant font-bold tracking-[0.25em] uppercase">
            SESSION •{' '}
            {new Date()
              .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
              .replace(/\//g, '.')}
          </p>
        </div>

        {/* Hero Visual Wrap */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl mt-4 border border-white/5">
          <div className="absolute inset-0 bg-black">
            {artist?.images?.[0]?.url && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full h-full object-cover opacity-60 mix-blend-screen"
                style={{
                  filter: 'blur(8px) contrast(1.5) sepia(100%) hue-rotate(80deg) saturate(300%)',
                }}
              />
            )}
          </div>
          <div className="absolute bottom-4 left-4 bg-primary text-[#004D1B] font-display font-black text-xs px-3 py-1.5 rounded-lg tracking-widest uppercase shadow-lg">
            DNA VERIFIED
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-md border border-white/10">
            {score.toLocaleString()} PTS
          </div>
        </div>

        {/* Artist Name Large */}
        <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase text-center mt-4 w-full truncate">
          {artist.name}
        </h2>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4 mb-4 px-1">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container border border-white/5">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-1">
              Accuracy
            </span>
            <div className="font-display font-black text-4xl text-white tracking-tighter">
              {Math.round(accuracy)}
              <span className="text-primary text-2xl">%</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container border border-white/5">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-1">
              Class
            </span>
            <div className={`font-display font-black text-2xl tracking-widest uppercase ${badgeColor}`}>
              {verdict}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container border border-white/5">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-1">
              Avg. Reflex
            </span>
            <div className="font-display font-black text-3xl text-white tracking-tighter">
              {avgSpeed}
              <span className="text-on-surface-variant text-lg">s</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container border border-white/5">
            <span className="text-[9px] text-on-surface-variant font-bold tracking-[0.2em] uppercase mb-1">
              Correct
            </span>
            <div className="font-display font-black text-3xl text-white tracking-tighter">
              {correctCount}
              <span className="text-on-surface-variant text-base">/{totalRounds}</span>
            </div>
          </div>
        </div>

        {/* Footer brand watermark */}
        <div className="text-[9px] font-mono tracking-widest text-on-surface-variant/40 uppercase pb-2">
          sonicpulse.app • strict music reflex
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-primary text-surface px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(114,254,143,0.5)] z-50 animate-fade-in">
          <Check size={14} strokeWidth={3} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Floating Action Menu Overlay (Kept OUTSIDE capture ref) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        <button
          onClick={onRestart}
          title="Play Another Artist"
          className="w-14 h-14 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center hover:bg-[#2A2A2A] shadow-2xl transition-all active:scale-95 cursor-pointer text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Primary Share CTA (Web Share API for Instagram Stories / WhatsApp) */}
        <button
          onClick={handleNativeShare}
          disabled={sharing}
          title="Share to Instagram Stories / WhatsApp"
          className="px-6 h-14 rounded-full bg-primary flex items-center justify-center gap-2 hover:scale-[1.03] shadow-[0_0_35px_rgba(114,254,143,0.35)] transition-all active:scale-95 cursor-pointer font-black text-sm text-[#004D1B] uppercase tracking-wider"
        >
          {sharing ? (
            <div className="w-5 h-5 rounded-full border-3 border-[#004D1B] border-t-transparent animate-spin"></div>
          ) : (
            <>
              <Share2 className="w-5 h-5" strokeWidth={2.5} />
              <span>Share Story</span>
            </>
          )}
        </button>

        {/* Direct Download Icon */}
        <button
          onClick={handleDirectDownload}
          disabled={sharing}
          title="Download PNG Card"
          className="w-14 h-14 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center hover:bg-[#2A2A2A] shadow-2xl transition-all active:scale-95 cursor-pointer text-white"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Report;
