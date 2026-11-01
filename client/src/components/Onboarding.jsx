import React, { useState } from 'react';
import { Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { saveProfile } from '../services/supabase';

const Onboarding = ({ user, onComplete }) => {
  const defaultUsername = (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'SonicPlayer'
  )
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 15);

  const [username, setUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (clean.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profile = await saveProfile({
        id: user.id,
        username: clean,
        full_name: user.user_metadata?.full_name || clean,
        avatar_url: avatarUrl,
      });

      onComplete({
        id: user.id,
        name: profile.full_name || clean,
        username: profile.username,
        avatar_url: profile.avatar_url,
        email: user.email,
        role: 'Verified Superfan',
      });
    } catch (err) {
      console.error('Failed to save profile:', err);
      if (err.message?.includes('unique') || err.code === '23505') {
        setError('This handle is already taken! Try another one.');
      } else {
        setError(err.message || 'Could not save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 sm:p-8 relative z-20 animate-fade-in text-center overflow-hidden">
      {/* Header */}
      <div className="space-y-3 mt-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full p-1 border-2 border-primary/50 shadow-[0_0_35px_rgba(114,254,143,0.3)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Google Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center text-primary text-2xl font-bold">
              {username[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-primary text-surface p-1.5 rounded-full shadow-lg">
            <ShieldCheck size={14} strokeWidth={3} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Claim Your <span className="text-primary">Handle</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Choose how you will appear on the global leaderboards.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[340px] space-y-4 my-auto">
        <div className="space-y-1 text-left">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">
            Your Sonic Username
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-4 font-mono font-bold text-primary text-sm">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                setError('');
              }}
              maxLength={20}
              placeholder="username"
              className="w-full bg-surface-container-highest border border-transparent focus:border-primary/50 rounded-2xl py-3.5 pl-9 pr-4 text-white font-display font-bold outline-none transition-all text-sm tracking-wide"
              required
            />
          </div>
          <p className="text-[10px] text-on-surface-variant/60 pl-1">
            Only lowercase letters, numbers, and underscores.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username}
          className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-[#86febc] text-surface font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(114,254,143,0.3)] hover:shadow-[0_0_35px_rgba(114,254,143,0.45)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-surface border-t-transparent animate-spin"></div>
          ) : (
            <>
              <span>Lock In & Play</span>
              <ArrowRight size={16} strokeWidth={3} />
            </>
          )}
        </button>
      </form>

      <div className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest pb-4">
        Google ID Authenticated • Ready for Rankings
      </div>
    </div>
  );
};

export default Onboarding;
