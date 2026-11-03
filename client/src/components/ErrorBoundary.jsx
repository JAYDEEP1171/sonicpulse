import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SonicPulse ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0A] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-display font-black text-white">
              Audio Reflex Interrupted
            </h2>
            <p className="text-xs text-white/60 max-w-[280px]">
              An audio stream or state conflict occurred. Tap below to reboot back to the arena.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-primary text-surface font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(114,254,143,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reboot Arena</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
