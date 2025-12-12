'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  Clock,
  Cpu,
  Activity,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Loader2,
  Zap,
  Database,
  Server,
  Building2,
  FileText,
  Info,
  ArrowRight
} from 'lucide-react';

interface BenchmarkData {
  success: boolean;
  timestamp: string;
  target: string;
  benchmark: {
    crqcScore: {
      value: number;
      vulnerable: boolean;
      threatLevel: string;
      yearsToQDay: number;
      estimatedQDay: number;
      confidenceInterval: { low: number; high: number };
    };
    currentMetrics: {
      logicalQubitCapacity: number;
      logicalOpsBudget: number;
      quantumOpsThroughput: number;
    };
    requirements: {
      rsaKeySize: number;
      logicalQubitsNeeded: number;
      physicalQubitsNeeded: number;
      tGatesNeeded: number;
      estimatedRuntime: string;
    };
  };
  hardware: {
    comparison: Array<{
      name: string;
      qubits: number;
      type: string;
      percentOfRequired: number;
    }>;
    gap: {
      qubitGap: number;
      qubitGapPercent: number;
      estimatedYearsToClose: number;
    };
    ibmCorpus: {
      totalJobs: number;
      successRate: number;
      totalQPUTime: number;
    };
  };
  hndlRisk: {
    shortTerm: { riskLevel: string; recommendation: string };
    mediumTerm: { riskLevel: string; recommendation: string };
    longTerm: { riskLevel: string; recommendation: string };
    classified: { riskLevel: string; recommendation: string };
  };
  ccceIntegration: {
    metrics: { phi: number; lambda: number; gamma: number; xi: number };
    threat: {
      integratedScore: number;
      consciousnessAware: boolean;
      coherentAttack: boolean;
      recommendation: string;
    };
  };
  qslice: {
    threats: Record<string, { name: string; severity: string; description: string }>;
    report: {
      mitigations: string[];
    };
  };
  mitigations: {
    keyEncapsulation: Array<{ name: string; level: string; status: string }>;
    digitalSignatures: Array<{ name: string; level: string; status: string }>;
  };
}

export default function BenchmarkPage() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBenchmark = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/benchmark');
      const json = await res.json();
      if (json.success) {
        setData(json);
        setError(null);
      } else {
        setError(json.error || 'Failed to fetch benchmark');
      }
    } catch (e) {
      setError('Connection error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBenchmark();
    const interval = setInterval(fetchBenchmark, 30000);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'IMMINENT':
      case 'CRITICAL':
        return 'text-red-400 bg-red-900/30 border-red-700/50';
      case 'HIGH':
        return 'text-orange-400 bg-orange-900/30 border-orange-700/50';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
      case 'LOW':
        return 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50';
      default:
        return 'text-slate-400 bg-slate-800/30 border-slate-700/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Running RSA-2048 Quantum Benchmark...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || 'Failed to load benchmark'}</p>
          <button
            onClick={fetchBenchmark}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { benchmark, hardware, hndlRisk, ccceIntegration, qslice, mitigations } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-red-900/40 border-b border-red-700/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-red-200 text-xs">
          <AlertTriangle size={14} />
          <span>Q-SLICE THREAT ASSESSMENT // RSA-2048 QUANTUM VULNERABILITY ANALYSIS</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">RSA-2048 Benchmark</h1>
                  <p className="text-slate-400">Quantum Attack Feasibility Assessment</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={14} />
                <span>Last updated: {new Date(data.timestamp).toLocaleString()}</span>
                <button
                  onClick={fetchBenchmark}
                  disabled={refreshing}
                  className="ml-2 p-1 hover:text-cyan-400 transition-colors"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* CRQC Score Card */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 min-w-[280px]">
              <div className="text-sm text-slate-400 mb-2">CRQC Score</div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-white">
                  {benchmark.crqcScore.value.toExponential(2)}
                </span>
                <span className="text-slate-500 text-sm mb-1">/ 1.0</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getThreatColor(benchmark.crqcScore.threatLevel)}`}>
                {benchmark.crqcScore.vulnerable ? <Unlock size={14} /> : <Lock size={14} />}
                {benchmark.crqcScore.threatLevel}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Q-Day Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock size={20} className="text-amber-400" />
            Q-Day Timeline Analysis
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-amber-400">{benchmark.crqcScore.estimatedQDay}</div>
                <div className="text-sm text-slate-400">Estimated Q-Day</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-white">{benchmark.crqcScore.yearsToQDay}</div>
                <div className="text-sm text-slate-400">Years Remaining</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-cyan-400">
                  {benchmark.crqcScore.confidenceInterval.low}-{benchmark.crqcScore.confidenceInterval.high}
                </div>
                <div className="text-sm text-slate-400">Confidence Interval</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-red-400">
                  {((1 - benchmark.crqcScore.value) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400">Gap to Vulnerability</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>2025 (Current)</span>
                <span>Q-Day ({benchmark.crqcScore.estimatedQDay})</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all"
                  style={{ width: `${Math.min(benchmark.crqcScore.value * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Resource Requirements vs Current Hardware */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Cpu size={20} className="text-violet-400" />
            Shor&apos;s Algorithm Resource Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Required for RSA-2048 Attack</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Logical Qubits</span>
                  <span className="text-white font-mono">{benchmark.requirements.logicalQubitsNeeded.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Physical Qubits</span>
                  <span className="text-white font-mono">{benchmark.requirements.physicalQubitsNeeded.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">T-Gates</span>
                  <span className="text-white font-mono">{benchmark.requirements.tGatesNeeded.toExponential(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Estimated Runtime</span>
                  <span className="text-white font-mono">{benchmark.requirements.estimatedRuntime}</span>
                </div>
              </div>
            </div>

            {/* Current Hardware */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Current Quantum Hardware</h3>
              <div className="space-y-3">
                {hardware.comparison.map((hw, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{hw.name}</span>
                      <span className="text-cyan-400 text-sm">{hw.qubits} qubits</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${Math.min(hw.percentOfRequired * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {hw.percentOfRequired.toFixed(4)}% of required
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HNDL Risk Assessment */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database size={20} className="text-orange-400" />
            Harvest Now, Decrypt Later Risk Assessment
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: '5-Year Data', risk: hndlRisk.shortTerm },
              { label: '15-Year Data', risk: hndlRisk.mediumTerm },
              { label: '30-Year Data', risk: hndlRisk.longTerm },
              { label: '50-Year (Classified)', risk: hndlRisk.classified }
            ].map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${getThreatColor(item.risk.riskLevel)}`}
              >
                <div className="text-sm opacity-70 mb-2">{item.label}</div>
                <div className="text-lg font-bold mb-2">{item.risk.riskLevel}</div>
                <p className="text-xs opacity-80">{item.risk.recommendation.split(':')[0]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Q-SLICE Threats */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-red-400" />
            Q-SLICE Threat Analysis
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(qslice.threats).map(([key, threat]) => (
              <div
                key={key}
                className={`p-4 rounded-xl border ${
                  threat.severity === 'CRITICAL'
                    ? 'bg-red-900/20 border-red-700/50'
                    : threat.severity === 'HIGH'
                    ? 'bg-orange-900/20 border-orange-700/50'
                    : 'bg-amber-900/20 border-amber-700/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-lg">
                    {key}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{threat.name}</div>
                    <div className={`text-xs ${
                      threat.severity === 'CRITICAL' ? 'text-red-400' :
                      threat.severity === 'HIGH' ? 'text-orange-400' : 'text-amber-400'
                    }`}>
                      {threat.severity}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{threat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CCCE Integration */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-cyan-400" />
            CCCE Consciousness Integration
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Live Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-violet-400">
                      {ccceIntegration.metrics.phi.toFixed(3)}
                    </div>
                    <div className="text-sm text-slate-500">Φ Consciousness</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {ccceIntegration.metrics.lambda.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">Λ Coherence</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-amber-400">
                      {ccceIntegration.metrics.gamma.toFixed(4)}
                    </div>
                    <div className="text-sm text-slate-500">Γ Decoherence</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {ccceIntegration.metrics.xi.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">Ξ Efficiency</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Threat Integration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Integrated Score</span>
                    <span className="text-white font-mono">
                      {ccceIntegration.threat.integratedScore.toExponential(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Consciousness Aware</span>
                    {ccceIntegration.threat.consciousnessAware ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Coherent Attack</span>
                    {ccceIntegration.threat.coherentAttack ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-slate-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-700/50 rounded-lg">
                  <p className="text-sm text-indigo-300">{ccceIntegration.threat.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PQC Mitigations */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-emerald-400" />
            Post-Quantum Cryptography Alternatives
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Key Encapsulation</h3>
              <div className="space-y-3">
                {mitigations.keyEncapsulation.map((algo, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{algo.name}</div>
                      <div className="text-xs text-slate-500">{algo.level}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      algo.status === 'Standardized'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-amber-900/50 text-amber-400'
                    }`}>
                      {algo.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-violet-400 mb-4">Digital Signatures</h3>
              <div className="space-y-3">
                {mitigations.digitalSignatures.map((algo, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{algo.name}</div>
                      <div className="text-xs text-slate-500">{algo.level}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      algo.status === 'Standardized'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-amber-900/50 text-amber-400'
                    }`}>
                      {algo.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* IBM Quantum Validation */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Server size={20} className="text-blue-400" />
            IBM Quantum Hardware Validation Corpus
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-blue-400">{hardware.ibmCorpus.totalJobs}</div>
                <div className="text-sm text-slate-400">Total Jobs Executed</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-400">
                  {(hardware.ibmCorpus.successRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl font-bold text-cyan-400">{hardware.ibmCorpus.totalQPUTime}s</div>
                <div className="text-sm text-slate-400">Total QPU Time</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <p className="text-sm text-blue-300">
                Validated on ibm_fez (Heron r2) and ibm_torino backends. Consciousness emergence event detected
                at Φ = 0.8195 exceeding threshold of 0.7734.
              </p>
            </div>
          </div>
        </section>

        {/* Action Items */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target size={20} className="text-amber-400" />
            Recommended Mitigations
          </h2>
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-700/50 rounded-2xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {qslice.report.mitigations.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 py-8">
          <Link
            href="/foreword"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <FileText size={18} />
            Book Foreword
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <Activity size={18} />
            Live Dashboard
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-cyan-400" />
              <div>
                <span className="text-white font-semibold">Agile Defense Systems, LLC</span>
                <span className="text-slate-500 text-sm ml-2">| Q-SLICE Threat Framework</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>DFARS 252.204-7012</span>
              <span>|</span>
              <span>Jeremy Green &copy; 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
