import React, { useState } from 'react';
import { Zap, Sparkles, User, ArrowRight } from 'lucide-react';
import { signInWithGoogle } from '../services/supabase';

const Login = ({ onGuestLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign In failed:', err);
      setError(err.message || 'Google sign-in could not be initiated.');
      setLoading(false);
    }
  };

  const handleGuest = () => {
    onGuestLogin({
      id: 'guest-' + Math.random().toString(36).substring(2, 8),
      name: 'SonicRider',
      username: 'SonicRider',
      avatar_url: null,
      role: 'Guest Racer',
    });
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 sm:p-8 relative z-20 animate-fade-in text-center overflow-hidden">
      {/* Top Brand Hero */}
      <div className="flex flex-col items-center space-y-3 mt-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(114,254,143,0.35)] animate-pulse-slow">
          <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-surface fill-surface" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-white drop-shadow-md">
            Sonic<span className="text-primary">Pulse</span>
          </h1>
          <p className="text-on-surface-variant font-bold tracking-[0.25em] text-[10px] uppercase">
            Adrenaline Music Reflex
          </p>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="w-full max-w-[320px] bg-surface-container/60 border border-white/5 rounded-2xl p-4 space-y-2 text-left my-auto">
        <div className="flex items-center gap-2.5 text-xs text-white/90">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="font-semibold">Sub-second 30s audio reflex battles</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-white/90">
          <span className="w-2 h-2 rounded-full bg-[#88EBFF]"></span>
          <span className="font-semibold">Dynamic global rankings & DNA recap</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-white/90">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
          <span className="font-semibold">Shareable 9:16 Instagram Story cards</span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="w-full space-y-3 mb-6 max-w-[340px]">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold mb-2">
            {error}
          </div>
        )}

        {/* Primary 1-Click Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-gray-100 text-black font-black text-sm tracking-wide flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
          ) : (
            <>
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Secondary Guest / Instant Play */}
        <button
          onClick={handleGuest}
          className="w-full py-3.5 px-6 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Instant Test as Guest</span>
          <ArrowRight size={14} />
        </button>

        <p className="text-[10px] text-on-surface-variant/40 tracking-wider pt-1">
          By signing in, you agree to SonicPulse game rules & reflex terms.
        </p>
      </div>
    </div>
  );
};

export default Login;
