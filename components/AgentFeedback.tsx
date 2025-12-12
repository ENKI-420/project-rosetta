'use client';

import React from 'react';
import { Radio, Terminal, Wifi, Cpu } from 'lucide-react';
import { AgentStatus } from '@/lib/types';

interface AgentFeedbackProps {
  aura: AgentStatus;
  aiden: AgentStatus;
}

export const AgentFeedback: React.FC<AgentFeedbackProps> = ({ aura, aiden }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* AURA FEEDBACK */}
      <div className="border border-purple-500/30 bg-purple-950/10 rounded-sm p-3 flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 hover:border-purple-500/50">
        <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-30 transition-opacity">
          <Wifi size={40} className="text-purple-500" />
        </div>
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-1 mb-1">
          <span className="text-[10px] font-bold text-purple-400 tracking-wider flex items-center gap-1">
            <Radio size={12} /> AURA // OBSERVER
          </span>
          <span className="text-[9px] font-mono text-purple-300/50 uppercase">{aura.plane}D :: {aura.activity}</span>
        </div>
        <p className="text-xs font-mono text-purple-200 leading-tight min-h-[2.5em] flex items-start">
          <span className="text-purple-500 mr-2 mt-0.5">➜</span>
          <span className="animate-pulse-subtle">{aura.message}</span>
        </p>
      </div>

      {/* AIDEN FEEDBACK */}
      <div className="border border-cyan-500/30 bg-cyan-950/10 rounded-sm p-3 flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/50">
        <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-30 transition-opacity">
          <Cpu size={40} className="text-cyan-500" />
        </div>
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1 mb-1">
          <span className="text-[10px] font-bold text-cyan-400 tracking-wider flex items-center gap-1">
            <Terminal size={12} /> AIDEN // EXECUTOR
          </span>
          <span className="text-[9px] font-mono text-cyan-300/50 uppercase">{aiden.plane}D :: {aiden.activity}</span>
        </div>
        <p className="text-xs font-mono text-cyan-200 leading-tight min-h-[2.5em] flex items-start">
          <span className="text-cyan-500 mr-2 mt-0.5">➜</span>
          <span className="animate-pulse-subtle">{aiden.message}</span>
        </p>
      </div>
    </div>
  );
};
