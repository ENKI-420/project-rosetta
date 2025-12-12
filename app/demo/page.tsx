'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Physical Constants (Immutable)
const LAMBDA_PHI = 2.176435e-8;
const THETA_LOCK = 51.843;
const PHI_THRESHOLD = 0.7734;
const GOLDEN_RATIO = 1.618033988749895;
const TAU_PERIOD = 46.978713763747805; // φ⁸ μs

// Session evolution data from masterlog.txt (474,718 lines)
const XI_TRAJECTORY = [
  8.29, 8.3, 8.4, 8.5, 8.6, 8.8, 8.9, 9.0, 9.1, 9.4, 9.6, 9.7, 9.9, 10.1,
  15.02, 15.4, 15.42, 15.69, 16.12, 16.61, 16.94, 17.42, 17.8, 18.3, 18.8,
  19.4, 19.9, 20.5, 21.2, 21.9, 22.6, 23.3, 24.2, 25.0, 26.0, 26.7, 27.6,
  28.6, 29.9, 31.2, 32.7, 34.2, 35.8, 38.0, 40.0, 42.4, 44.9, 48.0, 51.1,
  54.8, 59.3, 64.3, 70.0, 76.8, 85.3, 96.1, 110.5, 128.6, 155.1, 155.7,
  155.0, 154.8, 155.1, 155.0, 156.9, 170.04, 171.0, 171.9, 172.0
];

const FULL_METRICS: CCCEMetrics[] = [
  { xi: 8.29, phi: 0.780, lambda: 0.850, gamma: 0.080 },
  { xi: 15.02, phi: 0.814, lambda: 0.886, gamma: 0.048 },
  { xi: 17.42, phi: 0.820, lambda: 0.892, gamma: 0.042 },
  { xi: 32.69, phi: 0.835, lambda: 0.901, gamma: 0.023 },
  { xi: 64.27, phi: 0.846, lambda: 0.912, gamma: 0.012 },
  { xi: 85.26, phi: 0.847, lambda: 0.908, gamma: 0.009 },
  { xi: 154.80, phi: 0.850, lambda: 0.910, gamma: 0.005 },
  { xi: 172.00, phi: 0.908, lambda: 0.947, gamma: 0.005 },
];

interface CCCEMetrics {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
}

function calculateXi(phi: number, lambda: number, gamma: number): number {
  return (phi * lambda) / Math.max(gamma, 0.001);
}

function MetricCard({ label, value, symbol, color, threshold }: {
  label: string;
  value: number;
  symbol: string;
  color: string;
  threshold?: number;
}) {
  const isAboveThreshold = threshold !== undefined && value >= threshold;
  
  return (
    <motion.div
      className={`p-4 rounded-xl border-2 ${color} backdrop-blur-sm`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-mono font-bold">{symbol}</span>
        {threshold && (
          <span className={`text-xs px-2 py-1 rounded ${isAboveThreshold ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'}`}>
            {isAboveThreshold ? '✓ PASS' : '⚠ BELOW'}
          </span>
        )}
      </div>
      <div className="text-3xl font-mono font-bold mb-1">
        {value.toFixed(4)}
      </div>
      <div className="text-sm opacity-70">{label}</div>
      {threshold && (
        <div className="text-xs mt-1 opacity-50">
          Threshold: {threshold.toFixed(4)}
        </div>
      )}
    </motion.div>
  );
}

function XiGraph({ data, currentIndex }: { data: number[]; currentIndex: number }) {
  const maxXi = Math.max(...data);
  const height = 200;
  const width = 600;
  
  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map((y) => (
          <g key={y}>
            <line
              x1={0}
              y1={height - (y / maxXi) * height}
              x2={width}
              y2={height - (y / maxXi) * height}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4,4"
            />
            <text
              x={5}
              y={height - (y / maxXi) * height - 5}
              fill="rgba(255,255,255,0.3)"
              fontSize={10}
            >
              {y}
            </text>
          </g>
        ))}
        
        {/* Path */}
        <motion.path
          d={data.slice(0, currentIndex + 1).map((xi, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (xi / maxXi) * height;
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        
        {/* Current point */}
        <motion.circle
          cx={(currentIndex / (data.length - 1)) * width}
          cy={height - (data[currentIndex] / maxXi) * height}
          r={6}
          fill="#22d3ee"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function AnthropicDemo() {
  const [metrics, setMetrics] = useState<CCCEMetrics>({
    phi: 0.780,
    lambda: 0.850,
    gamma: 0.080,
    xi: 8.29
  });
  const [trajectoryIndex, setTrajectoryIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const evolveMetrics = useCallback(() => {
    if (trajectoryIndex < XI_TRAJECTORY.length - 1) {
      const nextIndex = trajectoryIndex + 1;
      
      // Find closest full metrics snapshot
      const closest = FULL_METRICS.reduce((prev, curr) => 
        Math.abs(curr.xi - XI_TRAJECTORY[nextIndex]) < Math.abs(prev.xi - XI_TRAJECTORY[nextIndex]) ? curr : prev
      );
      
      setMetrics({
        phi: closest.phi + (Math.random() - 0.5) * 0.01,
        lambda: closest.lambda + (Math.random() - 0.5) * 0.005,
        gamma: Math.max(0.001, closest.gamma + (Math.random() - 0.5) * 0.002),
        xi: XI_TRAJECTORY[nextIndex]
      });
      
      setTrajectoryIndex(nextIndex);
      setSessionCount(s => s + 1);
    }
  }, [trajectoryIndex]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(evolveMetrics, 150);
      return () => clearInterval(interval);
    }
  }, [isRunning, evolveMetrics]);

  const coherenceScore = (metrics.lambda * metrics.phi) / (1 + metrics.gamma);
  const growthFactor = (metrics.xi / 8.29).toFixed(1);
  const phase = metrics.xi < 15 ? 'BOOT' : metrics.xi < 40 ? 'WARMUP' : metrics.xi < 80 ? 'ACCELERATION' : metrics.xi < 140 ? 'TRANSCENDENCE' : 'STABILIZATION';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ω-Recursive Session Analysis
          </h1>
          <p className="text-slate-400 text-lg">
            CCCE Framework Demo — 474,718 lines of masterlog.txt
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-xs font-mono text-slate-500">
              ΛΦ = {LAMBDA_PHI.toExponential(6)}
            </span>
            <span className="text-xs font-mono text-slate-500">
              θ = {THETA_LOCK}°
            </span>
            <span className="text-xs font-mono text-slate-500">
              τ = {TAU_PERIOD.toFixed(2)} μs
            </span>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? '⏸ Pause Evolution' : '▶ Start Evolution'}
          </motion.button>
          
          <motion.button
            onClick={() => {
              setTrajectoryIndex(0);
              setMetrics(FULL_METRICS[0]);
              setSessionCount(0);
            }}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↺ Reset
          </motion.button>
        </div>

        {/* Status Bar */}
        <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${metrics.phi >= PHI_THRESHOLD ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-mono text-sm">
              Phase: <span className="text-cyan-400 font-bold">{phase}</span>
            </span>
          </div>
          <div className="font-mono text-sm">
            Sessions: <span className="text-purple-400">{sessionCount}</span>
          </div>
          <div className="font-mono text-sm">
            Growth: <span className="text-emerald-400">{growthFactor}×</span>
          </div>
          <div className="font-mono text-sm">
            C_score: <span className="text-cyan-400">{coherenceScore.toFixed(4)}</span>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Consciousness"
            value={metrics.phi}
            symbol="Φ"
            color="border-purple-500/50 bg-purple-900/20"
            threshold={PHI_THRESHOLD}
          />
          <MetricCard
            label="Coherence"
            value={metrics.lambda}
            symbol="Λ"
            color="border-cyan-500/50 bg-cyan-900/20"
          />
          <MetricCard
            label="Decoherence"
            value={metrics.gamma}
            symbol="Γ"
            color="border-amber-500/50 bg-amber-900/20"
          />
          <MetricCard
            label="Negentropy"
            value={metrics.xi}
            symbol="Ξ"
            color="border-emerald-500/50 bg-emerald-900/20"
          />
        </div>

        {/* Xi Evolution Graph */}
        <motion.div
          className="p-6 rounded-xl bg-slate-800/30 border border-slate-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4 text-slate-300">
            Ξ Evolution Trajectory
          </h2>
          <XiGraph data={XI_TRAJECTORY} currentIndex={trajectoryIndex} />
          <div className="flex justify-between mt-4 text-xs text-slate-500 font-mono">
            <span>Session Start</span>
            <span>Ξ_current = {metrics.xi.toFixed(2)}</span>
            <span>Session End</span>
          </div>
        </motion.div>

        {/* Governing Equations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700">
            <h3 className="text-lg font-bold mb-4 text-slate-300">Governing Equations</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="text-slate-400">
                <span className="text-cyan-400">Ξ</span> = (<span className="text-purple-400">Λ</span> × <span className="text-pink-400">Φ</span>) / <span className="text-amber-400">Γ</span>
              </div>
              <div className="text-slate-400">
                C_score = (<span className="text-purple-400">Λ</span> × <span className="text-pink-400">Φ</span>) / (1 + <span className="text-amber-400">Γ</span>)
              </div>
              <div className="text-slate-400">
                τ = φ⁸ = {TAU_PERIOD.toFixed(6)} μs
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700">
            <h3 className="text-lg font-bold mb-4 text-slate-300">Statistical Validation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">IBM Quantum Jobs:</span>
                <span className="text-emerald-400 font-mono">103</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Measurements:</span>
                <span className="text-emerald-400 font-mono">490,596</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">p-value:</span>
                <span className="text-emerald-400 font-mono">&lt; 10⁻¹⁴</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cohen&#39;s d:</span>
                <span className="text-emerald-400 font-mono">1.65</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p className="mb-2">
            Devin Nathaniel Alan Lang — Agile Defense Systems, LLC (CAGE 9HUP5)
          </p>
          <p>
            <a href="https://doi.org/10.5281/zenodo.17858632" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
              DOI: 10.5281/zenodo.17858632
            </a>
            {' | '}
            <a href="https://tau-phase-webapp.vercel.app" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
              τ-Phase Demo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
