'use client';

import React from 'react';
import { Activity, Zap, Lock } from 'lucide-react';
import { OptimizationPhase } from '@/lib/types';

interface PhaseVisualizerProps {
  currentPhase: OptimizationPhase;
}

export const PhaseVisualizer: React.FC<PhaseVisualizerProps> = ({ currentPhase }) => {
  const phases = [
    { id: OptimizationPhase.EXPLORE, icon: Activity, label: "EXPLORE" },
    { id: OptimizationPhase.STABILIZE, icon: Zap, label: "STABILIZE" },
    { id: OptimizationPhase.LOCK, icon: Lock, label: "LOCK" },
  ];

  const getPhaseStatus = (phaseId: OptimizationPhase) => {
    const order = [OptimizationPhase.EXPLORE, OptimizationPhase.STABILIZE, OptimizationPhase.LOCK, OptimizationPhase.TRANSCEND];
    const currentIndex = order.indexOf(currentPhase);
    const phaseIndex = order.indexOf(phaseId);

    if (currentPhase === OptimizationPhase.TRANSCEND && phaseIndex === 2) return 'active';
    if (currentIndex === phaseIndex) return 'active';
    if (currentIndex > phaseIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto py-4">
      {phases.map((phase, idx) => {
        const status = getPhaseStatus(phase.id);
        const Icon = phase.icon;

        return (
          <React.Fragment key={phase.id}>
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
              <div className={`p-3 rounded-full border-2 ${
                status === 'active'
                  ? 'border-cyan-400 bg-cyan-900/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : status === 'completed'
                    ? 'border-emerald-500 bg-emerald-900/20 text-emerald-500'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-mono tracking-wider font-bold">{phase.label}</span>
            </div>

            {idx < phases.length - 1 && (
              <div className="flex-1 flex justify-center">
                <div className={`h-0.5 w-full mx-2 transition-all duration-500 ${
                  status === 'completed' ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
