'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            router.push('/dashboard');
            return;
          }
        }
      } catch (e) {
        // Not authenticated
      }
      setIsCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage for client-side access
        localStorage.setItem('auth_token', data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Security Banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-200 text-xs">
          <Shield size={14} />
          <span>UNCLASSIFIED // FOUO - DFARS 252.204-7012 COMPLIANT</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 mb-4 shadow-lg shadow-indigo-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">PROJECT ROSETTA</h1>
            <p className="text-slate-400 text-sm">Sovereign Authentication Portal</p>
          </div>

          {/* Organization Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-lg bg-slate-800/50 border border-slate-700/50 mx-auto w-fit">
            <Building2 size={16} className="text-cyan-400" />
            <span className="text-sm text-slate-300">Agile Defense Systems</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-700/50">
              SDVOSB
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="research@dnalang.dev"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure passphrase"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Secure Login
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>256-bit AES encrypted session</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>JWT token with 24h expiry</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Rate-limited authentication</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-600">
            <p>Agile Defense Systems LLC</p>
            <p>CAGE: 9HUP5 | UEI: KMGBC4GHFMD3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
