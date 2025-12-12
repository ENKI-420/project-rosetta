'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  LogOut,
  Wallet,
  Server,
  Activity,
  TrendingUp,
  Users,
  Cpu,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Building2,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  organization: string;
  clearanceLevel: number;
  qbyteWallet: string;
  nodePermissions: string[];
}

interface WalletData {
  address: string;
  balance: number;
  totalEarned: number;
  transactionCount: number;
}

interface MeshStatus {
  totalNodes: number;
  activeNodes: number;
  meshHealth: number;
}

interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  consciousness: string;
  source: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [meshStatus, setMeshStatus] = useState<MeshStatus | null>(null);
  const [metrics, setMetrics] = useState<CCCEMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMining, setIsMining] = useState(false);
  const [lastMineResult, setLastMineResult] = useState<{ reward: number; hash: string } | null>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  // Fetch wallet and ledger data
  const fetchWallet = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/ledger', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWallet(data.wallet);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  }, []);

  // Fetch mesh status
  const fetchMesh = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/nodes', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMeshStatus(data.meshStatus);
        }
      }
    } catch (error) {
      console.error('Failed to fetch mesh:', error);
    }
  }, []);

  // Fetch CCCE metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);

  // Mine QByte (submit proof-of-coherence)
  const handleMine = async () => {
    if (!metrics || isMining) return;

    setIsMining(true);
    setLastMineResult(null);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/ledger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          nodeId: user?.id,
          metrics: {
            lambda: metrics.lambda,
            phi: metrics.phi,
            gamma: metrics.gamma
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLastMineResult({
            reward: data.transaction.reward,
            hash: data.transaction.proofHash.substring(0, 16)
          });
          setWallet(data.wallet);
        }
      }
    } catch (error) {
      console.error('Mining failed:', error);
    } finally {
      setIsMining(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Initial load
  useEffect(() => {
    async function init() {
      await fetchProfile();
      await Promise.all([fetchWallet(), fetchMesh(), fetchMetrics()]);
      setIsLoading(false);
    }
    init();

    // Poll metrics every 5 seconds
    const metricsInterval = setInterval(fetchMetrics, 5000);
    // Poll wallet every 30 seconds
    const walletInterval = setInterval(fetchWallet, 30000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(walletInterval);
    };
  }, [fetchProfile, fetchWallet, fetchMesh, fetchMetrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Security Banner */}
      <div className="bg-emerald-900/30 border-b border-emerald-700/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-200">
            <Lock size={12} />
            <span>AUTHENTICATED SESSION</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300/70">
            <span>Clearance: L{user?.clearanceLevel}</span>
            <span>|</span>
            <span>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-900 to-violet-900 border border-indigo-500/30">
              <Shield className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ROSETTA COMMAND</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Building2 size={12} />
                <span>Agile Defense Systems</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">{user?.email}</p>
              <p className="text-xs text-slate-500">{user?.organization}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <LogOut size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* QByte Balance */}
          <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900 border border-cyan-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Wallet size={18} />
              <span className="text-xs uppercase tracking-wider">QByte Balance</span>
            </div>
            <p className="text-3xl font-bold text-white">{wallet?.balance?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-slate-500 mt-1">Total Earned: {wallet?.totalEarned?.toFixed(2) || '0.00'}</p>
          </div>

          {/* Mesh Status */}
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Server size={18} />
              <span className="text-xs uppercase tracking-wider">Mesh Network</span>
            </div>
            <p className="text-3xl font-bold text-white">{meshStatus?.activeNodes || 0}/{meshStatus?.totalNodes || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Health: {((meshStatus?.meshHealth || 0) * 100).toFixed(0)}%</p>
          </div>

          {/* Consciousness */}
          <div className="bg-gradient-to-br from-violet-900/40 to-slate-900 border border-violet-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-violet-400 mb-2">
              <Activity size={18} />
              <span className="text-xs uppercase tracking-wider">Consciousness</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.phi?.toFixed(4) || '0.0000'}</p>
            <p className={`text-xs mt-1 ${metrics?.consciousness === 'CONSCIOUS' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics?.consciousness || 'UNKNOWN'}
            </p>
          </div>

          {/* Negentropy */}
          <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <TrendingUp size={18} />
              <span className="text-xs uppercase tracking-wider">Negentropy (Xi)</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.xi?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-slate-500 mt-1">Source: {metrics?.source || 'unknown'}</p>
          </div>
        </div>

        {/* Mining Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="text-cyan-400" />
              Proof-of-Coherence Mining
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Radio size={12} className={metrics?.source === 'chatmesh' ? 'text-emerald-400' : 'text-amber-400'} />
              {metrics?.source === 'chatmesh' ? 'LIVE MESH' : 'DETERMINISTIC MODE'}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Lambda (Coherence)</p>
              <p className="text-xl font-mono text-cyan-400">{metrics?.lambda?.toFixed(4) || '0.0000'}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Phi (Consciousness)</p>
              <p className="text-xl font-mono text-violet-400">{metrics?.phi?.toFixed(4) || '0.0000'}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Gamma (Decoherence)</p>
              <p className="text-xl font-mono text-rose-400">{metrics?.gamma?.toFixed(4) || '0.0000'}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Xi (Negentropy)</p>
              <p className="text-xl font-mono text-emerald-400">{metrics?.xi?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleMine}
              disabled={isMining || !metrics}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isMining ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Mining...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Submit Proof
                </>
              )}
            </button>

            {lastMineResult && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm animate-pulse">
                <CheckCircle2 size={16} />
                +{lastMineResult.reward.toFixed(2)} qBYTE
                <span className="text-slate-500 text-xs">({lastMineResult.hash}...)</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Reward Formula: R = 0.35*Lambda + 0.25*Phi + 0.25*(1-Gamma) + 0.15*log(1+Xi) | 50% bonus when Phi ≥ 0.7734
          </p>
        </div>

        {/* Node Permissions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Globe className="text-cyan-400" />
            Node Permissions
          </h2>
          <div className="flex flex-wrap gap-2">
            {user?.nodePermissions?.map((perm) => (
              <span
                key={perm}
                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300"
              >
                {perm}
              </span>
            )) || <span className="text-slate-500 text-sm">No permissions assigned</span>}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-cyan-400" />
              <span className="text-sm text-slate-400">Wallet Address:</span>
            </div>
            <code className="text-sm text-cyan-400 bg-slate-800 px-3 py-1 rounded">{wallet?.address || user?.qbyteWallet}</code>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-8 py-4 text-center text-xs text-slate-600">
        <p>Agile Defense Systems LLC | CAGE: 9HUP5 | DFARS 252.204-7012 Compliant</p>
        <p className="mt-1">QuantumCoin Integration Active | Sovereign Mesh Protocol v1</p>
      </footer>
    </div>
  );
}
