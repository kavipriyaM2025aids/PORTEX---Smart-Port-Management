import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'pink', trend }) => {
  const colorMap = {
    pink: {
      tile: 'from-[#fff0f6] via-white to-[#ffe4ee] border-pink-200/80 shadow-[0_4px_20px_-6px_rgba(244,63,94,0.12)]',
      icon: 'from-pink-500 to-rose-600 shadow-pink-500/30',
      glow: 'bg-pink-400/20',
      bar: 'from-pink-400 via-rose-400 to-purple-400',
      accent: 'text-pink-600'
    },
    purple: {
      tile: 'from-[#faf5ff] via-white to-[#f3e8ff] border-purple-200/80 shadow-[0_4px_20px_-6px_rgba(168,85,247,0.12)]',
      icon: 'from-purple-500 to-indigo-600 shadow-purple-500/30',
      glow: 'bg-purple-400/20',
      bar: 'from-purple-400 via-fuchsia-400 to-pink-400',
      accent: 'text-purple-600'
    },
    emerald: {
      tile: 'from-[#f0fdf4] via-white to-[#dcfce7] border-emerald-200/80 shadow-[0_4px_20px_-6px_rgba(16,185,129,0.12)]',
      icon: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
      glow: 'bg-emerald-400/20',
      bar: 'from-emerald-400 via-teal-400 to-cyan-400',
      accent: 'text-emerald-600'
    },
    peach: {
      tile: 'from-[#fff7ed] via-white to-[#ffedd5] border-orange-200/80 shadow-[0_4px_20px_-6px_rgba(249,115,22,0.12)]',
      icon: 'from-orange-400 to-amber-500 shadow-orange-400/30',
      glow: 'bg-orange-400/20',
      bar: 'from-orange-400 via-amber-400 to-yellow-400',
      accent: 'text-orange-600'
    },
    amber: {
      tile: 'from-[#fffbeb] via-white to-[#fef3c7] border-amber-200/80 shadow-[0_4px_20px_-6px_rgba(245,158,11,0.12)]',
      icon: 'from-amber-500 to-orange-500 shadow-amber-500/30',
      glow: 'bg-amber-400/20',
      bar: 'from-amber-400 via-orange-400 to-rose-400',
      accent: 'text-amber-600'
    },
    cyan: {
      tile: 'from-[#f0fdfa] via-white to-[#ccfbf1] border-teal-200/80 shadow-[0_4px_20px_-6px_rgba(20,184,166,0.12)]',
      icon: 'from-teal-500 to-cyan-600 shadow-teal-500/30',
      glow: 'bg-teal-400/20',
      bar: 'from-teal-400 via-cyan-400 to-blue-400',
      accent: 'text-teal-600'
    },
    blue: {
      tile: 'from-[#f0f9ff] via-white to-[#e0f2fe] border-sky-200/80 shadow-[0_4px_20px_-6px_rgba(14,165,233,0.12)]',
      icon: 'from-sky-500 to-blue-600 shadow-sky-500/30',
      glow: 'bg-sky-400/20',
      bar: 'from-sky-400 via-blue-400 to-indigo-400',
      accent: 'text-sky-600'
    },
    rose: {
      tile: 'from-[#fff1f2] via-white to-[#ffe4e6] border-rose-200/80 shadow-[0_4px_20px_-6px_rgba(244,63,94,0.12)]',
      icon: 'from-rose-500 to-pink-600 shadow-rose-500/30',
      glow: 'bg-rose-400/20',
      bar: 'from-rose-400 via-red-400 to-orange-400',
      accent: 'text-rose-600'
    }
  };

  const selectedColor = colorMap[color] || colorMap.pink;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 sp-lift backdrop-blur-sm transition-all duration-300 ${selectedColor.tile}`}
    >
      {/* Soft Ambient Corner Bloom */}
      <div
        className={`pointer-events-none absolute -top-10 -right-8 w-28 h-28 rounded-full blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-90 ${selectedColor.glow}`}
      />

      {/* Top Hairline Accent */}
      <span
        className={`absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity duration-300 ${selectedColor.bar}`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500 truncate">
            {title}
          </p>
          <p className="text-[26px] leading-tight font-black tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-2xl bg-gradient-to-br ${selectedColor.icon} text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="relative z-10 mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
          <span className="truncate">{subtitle}</span>
          {trend && (
            <span
              className={`shrink-0 inline-flex items-center gap-1 font-bold ${selectedColor.accent}`}
            >
              {String(trend).includes('-') ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;