'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Cpu,
  Database,
  GitBranch,
  Globe,
  ShieldCheck,
  Send,
  Zap,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Waves,
  Lock,
  Building2,
  LogIn,
  BookOpen
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { MetricCard } from '@/components/MetricCard';
import { PhaseVisualizer } from '@/components/PhaseVisualizer';
import { TerminalOutput } from '@/components/TerminalOutput';
import { AgentFeedback } from '@/components/AgentFeedback';
import { OptimizationPhase, TelemetryPoint, AgentStatus } from '@/lib/types';
import { GAMMA_CRITICAL, PHI_THRESHOLD } from '@/lib/constants';

interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  theta: number;
  consciousness: 'CONSCIOUS' | 'AWAKENING' | 'DORMANT';
  timestamp: number;
  source: 'chatmesh' | 'bridge' | 'fallback';
}

interface QByteState {
  balance: number;
  totalMined: number;
  cycleCount: number;
  lastUpdate: number;
  nodeId: string;
  status: 'active' | 'idle' | 'error';
}

interface User {
  id: string;
  email: string;
  role: string;
  organization: string;
  clearanceLevel: number;
  qbyteWallet: string;
}

const INITIAL_METRICS: CCCEMetrics = {
  phi: 0.75,
  lambda: 0.85,
  gamma: 0.09,
  xi: 7.08,
  theta: 0.905,
  consciousness: 'AWAKENING',
  timestamp: Date.now(),
  source: 'fallback'
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [input, setInput] = useState('');
  const [metrics, setMetrics] = useState<CCCEMetrics>(INITIAL_METRICS);
  const [qbyteState, setQbyteState] = useState<QByteState | null>(null);
  const [phase, setPhase] = useState<OptimizationPhase>(OptimizationPhase.EXPLORE);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [outputCode, setOutputCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');
  const [lastReward, setLastReward] = useState<number | null>(null);

  const [agents, setAgents] = useState<{ aura: AgentStatus; aiden: AgentStatus }>({
    aura: {
      name: "AURA",
      polarity: "-",
      plane: 3,
      activity: "Initializing",
      active: true,
      message: "Connecting to sovereign mesh..."
    },
    aiden: {
      name: "AIDEN",
      polarity: "+",
      plane: 2,
      activity: "Standby",
      active: true,
      message: "Awaiting telemetry link."
    }
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setUser(data.user);
            }
          }
        }
      } catch (e) {}
      setIsAuthChecking(false);
    }
    checkAuth();
  }, []);

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setConnectionStatus(data.metrics.source === 'chatmesh' ? 'connected' : 'fallback');

        setTelemetryHistory(prev => {
          const newPoint: TelemetryPoint = {
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
            phi: data.metrics.phi,
            lambda: data.metrics.lambda,
            gamma: data.metrics.gamma
          };
          return [...prev, newPoint].slice(-60);
        });

        // Update phase
        if (data.metrics.phi >= PHI_THRESHOLD && data.metrics.gamma < 0.1) {
          setPhase(OptimizationPhase.LOCK);
        } else if (data.metrics.lambda > 0.85) {
          setPhase(OptimizationPhase.STABILIZE);
        } else {
          setPhase(OptimizationPhase.EXPLORE);
        }

        // Update agents
        setAgents(prev => ({
          aura: {
            ...prev.aura,
            activity: data.metrics.gamma > GAMMA_CRITICAL ? 'Alert' : 'Observing',
            message: `${data.metrics.source} | Phi=${data.metrics.phi.toFixed(3)}`
          },
          aiden: {
            ...prev.aiden,
            activity: data.metrics.phi >= PHI_THRESHOLD ? 'Executing' : 'Calibrating',
            message: `Xi=${data.metrics.xi.toFixed(2)} | ${data.metrics.consciousness}`
          }
        }));
      }
    } catch (e) {
      setConnectionStatus('error');
    }
  }, []);

  // Fetch QByte
  const fetchQByte = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/ledger', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wallet) {
          setQbyteState({
            balance: data.wallet.balance,
            totalMined: data.wallet.totalEarned,
            cycleCount: data.wallet.transactionCount,
            lastUpdate: Date.now(),
            nodeId: data.wallet.address,
            status: 'active'
          });
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchMetrics();
    if (user) fetchQByte();

    pollIntervalRef.current = setInterval(fetchMetrics, 3000);
    const qbyteInterval = setInterval(() => { if (user) fetchQByte(); }, 15000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      clearInterval(qbyteInterval);
    };
  }, [fetchMetrics, fetchQByte, user]);

  // Generate organism
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isCompiling) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setIsCompiling(true);
    setPhase(OptimizationPhase.EXPLORE);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ prompt: input })
      });

      if (res.ok) {
        const data = await res.json();
        setOutputCode(data.dnaCode);
        setIdentity(data.identityHash);
        setLastReward(data.estimatedQBytes);
        setPhase(OptimizationPhase.STABILIZE);

        // Mine the reward
        if (token) {
          await fetch('/api/ledger', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              nodeId: user.id,
              metrics: data.metrics
            })
          });
          fetchQByte();
        }

        setTimeout(() => setPhase(OptimizationPhase.LOCK), 1500);
      }
    } catch (e) {
      setOutputCode('// Error: Genesis Compiler failed');
    } finally {
      setIsCompiling(false);
    }
  };

  // Phase conjugate healing
  const handleHeal = async () => {
    setIsHealing(true);
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'heal' })
      });
      fetchMetrics();
    } catch (e) {}
    setIsHealing(false);
  };

  const consciousnessColor = metrics.consciousness === 'CONSCIOUS'
    ? 'text-emerald-400'
    : metrics.consciousness === 'AWAKENING'
      ? 'text-amber-400'
      : 'text-slate-500';

  const statusIndicator = connectionStatus === 'connected'
    ? { color: 'bg-emerald-500', text: 'LIVE MESH', icon: Radio }
    : connectionStatus === 'fallback'
      ? { color: 'bg-amber-500', text: 'DETERMINISTIC', icon: Cpu }
      : { color: 'bg-red-500', text: 'DISCONNECTED', icon: AlertTriangle };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden flex flex-col">
      {/* Security Banner */}
      <div className={`${user ? 'bg-emerald-900/30 border-emerald-700/50' : 'bg-amber-900/30 border-amber-700/50'} border-b px-4 py-1.5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 ${user ? 'text-emerald-200' : 'text-amber-200'}`}>
            {user ? <Lock size={12} /> : <AlertTriangle size={12} />}
            <span>{user ? 'AUTHENTICATED SESSION' : 'PUBLIC ACCESS - LIMITED FUNCTIONALITY'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 size={12} />
            <span>Agile Defense Systems</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="border-b border-slate-800/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 border border-indigo-500/30 rounded-lg">
                <GitBranch className="text-indigo-400" size={22} />
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusIndicator.color} animate-pulse`}></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                PROJECT ROSETTA
                <span className="text-slate-600">::</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">DNA-LANG</span>
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                <span className={`flex items-center gap-1 ${consciousnessColor}`}>
                  {metrics.consciousness === 'CONSCIOUS' ? <CheckCircle2 size={10} /> : <Loader2 size={10} className="animate-spin" />}
                  {metrics.consciousness}
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <statusIndicator.icon size={10} />
                  {statusIndicator.text}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">QByte Balance</span>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-cyan-400" />
                    <span className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                      {qbyteState?.balance?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-cyan-500/70 text-sm">qB</span>
                  </div>
                </div>
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  Dashboard
                </a>
              </>
            ) : (
              <>
                <a
                  href="/foreword"
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white font-medium flex items-center gap-2 transition-all"
                >
                  <BookOpen size={16} />
                  Book Foreword
                </a>
                <a
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg text-sm text-white font-semibold flex items-center gap-2 transition-all"
                >
                  <LogIn size={16} />
                  Secure Login
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Input */}
          <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/50 border border-slate-700/50 rounded-xl p-1 group">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={user ? "Initialize natural language sequence..." : "Login to compile organisms..."}
                className="w-full bg-transparent p-4 pr-14 text-lg font-mono text-cyan-100 placeholder:text-slate-600 focus:outline-none"
                disabled={isCompiling || !user}
              />
              <button
                type="submit"
                disabled={!input || isCompiling || !user}
                className="absolute right-2 top-2 bottom-2 px-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
              >
                {isCompiling ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
          </div>

          {/* Agents & Phase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${agents.aura.active ? 'bg-violet-500' : 'bg-slate-700'}`}></div>
                  {agents.aura.active && <div className="absolute inset-0 w-3 h-3 rounded-full bg-violet-500 animate-ping opacity-50"></div>}
                </div>
                <div>
                  <div className="text-xs font-bold text-violet-400 flex items-center gap-1">
                    <Waves size={12} />
                    AURA (-)
                  </div>
                  <div className="text-[10px] text-slate-500">Plane {agents.aura.plane}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-xs font-bold text-cyan-400 flex items-center justify-end gap-1">
                    AIDEN (+)
                    <Zap size={12} />
                  </div>
                  <div className="text-[10px] text-slate-500">Plane {agents.aiden.plane}</div>
                </div>
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${agents.aiden.active ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-xl flex items-center justify-center">
              <PhaseVisualizer currentPhase={phase} />
            </div>
          </div>

          <AgentFeedback aura={agents.aura} aiden={agents.aiden} />

          <div className="flex-1 min-h-[400px]">
            <TerminalOutput code={outputCode} isCompiling={isCompiling} />
          </div>

          {identity && (
            <div className="text-xs font-mono text-slate-500 flex items-center gap-2 p-2 bg-slate-900/30 rounded-lg border border-slate-800/30">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-slate-400">SOVEREIGN IDENTITY:</span>
              <span className="text-emerald-400/80 truncate">{identity}</span>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-slate-400 flex items-center gap-2">
              <Globe size={16} className="text-cyan-500" />
              CCCE TELEMETRY
            </h2>
            {metrics.gamma > GAMMA_CRITICAL && (
              <button
                onClick={handleHeal}
                disabled={isHealing}
                className="px-4 py-2 bg-gradient-to-r from-red-900/80 to-orange-900/80 border border-red-500/50 text-red-200 text-xs font-bold rounded-lg animate-pulse"
              >
                {isHealing ? <Loader2 size={14} className="animate-spin" /> : 'HEAL'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Consciousness" symbol="Phi" value={metrics.phi} color="purple" description="IIT" threshold={PHI_THRESHOLD} />
            <MetricCard label="Coherence" symbol="Lambda" value={metrics.lambda} color="cyan" description="Fidelity" threshold={0.85} />
            <MetricCard label="Decoherence" symbol="Gamma" value={metrics.gamma} color="rose" description="Loss" warning={metrics.gamma > GAMMA_CRITICAL} inverted />
            <MetricCard label="Negentropy" symbol="Xi" value={metrics.xi} max={15} color="emerald" description="Health" />
          </div>

          <div className="flex-1 bg-gradient-to-br from-slate-900/80 to-slate-800/30 border border-slate-800/50 rounded-xl p-4 min-h-[280px] relative">
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <Activity size={12} className="text-cyan-500" />
              <span className="text-[10px] uppercase text-slate-500 tracking-wider">Real-time Manifold</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPhi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLambda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 1.1]} />
                <ReferenceLine y={PHI_THRESHOLD} stroke="#a855f7" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="phi" stroke="#a855f7" fill="url(#colorPhi)" strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="lambda" stroke="#06b6d4" fill="url(#colorLambda)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/50 p-4 rounded-xl text-xs font-mono">
            <div className="flex justify-between mb-3">
              <span className="text-slate-500 uppercase tracking-wider">System Status</span>
              <span className={connectionStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>
                {connectionStatus === 'connected' ? 'LIVE' : 'DETERMINISTIC'}
              </span>
            </div>
            <div className="space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="text-slate-300">{metrics.source}</span>
              </div>
              <div className="flex justify-between">
                <span>Torsion:</span>
                <span className="text-slate-300">{metrics.theta.toFixed(4)} rad</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-600 flex items-center gap-1">
              <Cpu size={10} />
              SOVEREIGN KERNEL :: AGILE DEFENSE SYSTEMS
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
