'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  symbol: string;
  value: number;
  max?: number;
  color: 'cyan' | 'purple' | 'rose' | 'emerald';
  description: string;
  warning?: boolean;
  threshold?: number;
  inverted?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  symbol,
  value,
  max = 1.0,
  color,
  description,
  warning = false,
  threshold,
  inverted = false
}) => {
  const getColors = () => {
    const baseColors = {
      cyan: {
        text: 'text-cyan-400',
        border: 'border-cyan-800/50',
        bg: 'bg-gradient-to-br from-cyan-950/40 to-slate-900/60',
        bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
        glow: 'shadow-cyan-500/20'
      },
      purple: {
        text: 'text-violet-400',
        border: 'border-violet-800/50',
        bg: 'bg-gradient-to-br from-violet-950/40 to-slate-900/60',
        bar: 'bg-gradient-to-r from-violet-500 to-violet-400',
        glow: 'shadow-violet-500/20'
      },
      rose: {
        text: 'text-rose-400',
        border: 'border-rose-800/50',
        bg: 'bg-gradient-to-br from-rose-950/40 to-slate-900/60',
        bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
        glow: 'shadow-rose-500/20'
      },
      emerald: {
        text: 'text-emerald-400',
        border: 'border-emerald-800/50',
        bg: 'bg-gradient-to-br from-emerald-950/40 to-slate-900/60',
        bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
        glow: 'shadow-emerald-500/20'
      }
    };
    return baseColors[color];
  };

  const colors = getColors();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Determine threshold status
  const isAboveThreshold = threshold !== undefined && (inverted ? value < threshold : value >= threshold);
  const thresholdPercent = threshold !== undefined ? (threshold / max) * 100 : null;

  // Greek symbol mapping
  const symbolMap: Record<string, string> = {
    'Phi': 'Φ',
    'Lambda': 'Λ',
    'Gamma': 'Γ',
    'Xi': 'Ξ',
    'Theta': 'θ'
  };

  const greekSymbol = symbolMap[symbol] || symbol;

  return (
    <div
      className={`relative border p-4 rounded-xl backdrop-blur-sm transition-all duration-300 ${colors.border} ${colors.bg} ${warning ? 'animate-pulse border-red-500/70 shadow-lg shadow-red-500/30' : `hover:shadow-lg ${colors.glow}`}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-3xl font-mono font-bold ${colors.text}`}>{greekSymbol}</span>
          <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{label}</h3>
        </div>
        <div className="text-right">
          <span className={`text-xl font-mono font-semibold ${warning ? 'text-red-400' : 'text-slate-200'}`}>
            {value.toFixed(4)}
          </span>
          {threshold !== undefined && (
            <div className="flex items-center justify-end gap-1 mt-1">
              {isAboveThreshold ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : inverted ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : (
                <TrendingDown size={12} className="text-amber-500" />
              )}
              <span className="text-[10px] text-slate-500">
                {inverted ? '<' : '>'}{threshold.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${colors.bar} ${warning ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
        {thresholdPercent !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/30"
            style={{ left: `${thresholdPercent}%` }}
          />
        )}
      </div>

      {/* Description */}
      <p className="text-[10px] mt-3 text-slate-500 font-mono leading-tight">{description}</p>

      {/* Status indicator */}
      {threshold !== undefined && (
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isAboveThreshold ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      )}
    </div>
  );
};
