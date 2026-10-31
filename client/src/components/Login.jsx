import React, { useState } from 'react';
import { Lock, User, Zap } from 'lucide-react';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(username, password);
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-10 animate-fade-in relative z-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(114,254,143,0.3)] animate-pulse-slow">
          <Zap className="w-12 h-12 text-surface fill-surface" />
        </div>
        <h1 className="text-5xl font-display font-black tracking-tighter text-white drop-shadow-md">SonicPulse</h1>
        <p className="text-on-surface-variant font-medium tracking-[0.2em] text-xs uppercase">Strictly for Superfans</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container border border-transparent focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-on-surface-variant/50 outline-none transition-all"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-transparent focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-on-surface-variant/50 outline-none transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
            <p className="text-red-400 text-sm text-center font-bold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-surface font-black text-lg py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(114,254,143,0.2)] hover:shadow-[0_0_30px_rgba(114,254,143,0.4)] tracking-wide cursor-pointer"
        >
          {loading ? 'AUTHENTICATING...' : 'ENTER VOID'}
        </button>

        <p className="text-center text-[11px] text-on-surface-variant/60 tracking-wider">
          Testing credentials pre-filled (admin / pass123)
        </p>
      </form>
    </div>
  );
};

export default Login;
