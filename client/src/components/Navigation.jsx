import React from 'react';
import { Flame, Compass, Trophy, User } from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Artists', icon: Flame },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'stats', label: 'Ranks', icon: Trophy },
    { id: 'user', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[380px] bg-[#0E0E0E]/95 backdrop-blur-2xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.85)] border border-white/10 z-50 pointer-events-auto">
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            title={label}
            className={`px-3 py-2 rounded-full cursor-pointer transition-all duration-300 relative flex items-center gap-1.5 ${
              active
                ? 'bg-primary text-surface shadow-[0_0_20px_rgba(114,254,143,0.35)] scale-105'
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-all ${
                active ? 'text-surface fill-surface stroke-2' : 'stroke-2'
              }`}
            />
            {active && (
              <span className="text-[11px] font-black uppercase tracking-wider font-display text-surface">
                {label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
