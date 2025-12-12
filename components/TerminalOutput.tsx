'use client';

import React, { useEffect, useRef } from 'react';
import { Copy, Terminal } from 'lucide-react';

interface TerminalOutputProps {
  code: string;
  isCompiling: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ code, isCompiling }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [code, isCompiling]);

  return (
    <div className="relative w-full h-full bg-black/80 border border-slate-800 rounded-sm overflow-hidden flex flex-col font-mono text-sm shadow-inner">
      <div className="bg-slate-900/90 border-b border-slate-800 p-2 flex justify-between items-center text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span>Genesis Compiler Output (Ω-Plane)</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-4 text-emerald-500/90 relative">
        {isCompiling ? (
          <div className="flex flex-col gap-1">
            <span className="animate-pulse">&gt; Initializing Genesis Compiler...</span>
            <span className="animate-pulse">&gt; Connecting to Ω-Plane...</span>
            <span className="animate-pulse">&gt; Parsing Natural Language Intent...</span>
            <span className="animate-pulse">&gt; Calculating Wasserstein-2 Gradients...</span>
            <span className="animate-pulse text-cyan-400">&gt; Optimizing Genes...</span>
          </div>
        ) : code ? (
          <pre className="whitespace-pre-wrap break-words">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-700 italic">
            // Awaiting Input Stream...
          </div>
        )}
      </div>

      {code && !isCompiling && (
        <button
          className="absolute top-10 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded transition-colors"
          title="Copy DNA Code"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <Copy size={14} />
        </button>
      )}
    </div>
  );
};
