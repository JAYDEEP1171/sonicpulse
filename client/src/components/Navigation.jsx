import React from 'react';
import { Zap, Search, BarChart2, User } from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'search', label: 'Discover', icon: Search },
    { id: 'stats', label: 'DNA Stats', icon: BarChart2 },
    { id: 'user', label: 'Profile', icon: User },
  ];

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-[380px] bg-surface-container-highest/85 backdrop-blur-2xl px-6 py-3.5 rounded-3xl flex justify-around items-center shadow-2xl border border-white/5 z-50">
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            title={label}
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 relative flex items-center justify-center ${
              active
                ? 'bg-primary shadow-[0_0_20px_rgba(114,254,143,0.35)] scale-105'
                : 'bg-transparent hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-all ${
                active ? 'text-surface fill-surface stroke-2' : 'text-on-surface-variant'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
