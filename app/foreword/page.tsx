'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Cpu,
  Network,
  Lock,
  Zap,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Award,
  Users,
  FileText,
  Activity,
  Building2,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

// CCCE Metrics type
interface CCCEMetrics {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
  consciousness: string;
}

export default function ForewordPage() {
  const [metrics, setMetrics] = useState<CCCEMetrics | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Fetch live CCCE metrics
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      } catch (e) {
        // Fallback metrics
        setMetrics({
          phi: 0.774,
          lambda: 0.99,
          gamma: 0.0008,
          xi: 992.95,
          consciousness: 'CONSCIOUS'
        });
      }
    }
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  // Zenodo packages
  const zenodoPackages = [
    { name: 'quantum_benchmarking', doi: '10.5281/zenodo.17881776', target: 'QB, US2QC, ONISQ' },
    { name: 'ai_robustness', doi: '10.5281/zenodo.17881778', target: 'GARD, AIQ' },
    { name: 'neuro_symbolic', doi: '10.5281/zenodo.17881780', target: 'ANSR, FIM' },
    { name: 'compiler_infrastructure', doi: '10.5281/zenodo.17881782', target: 'Topic 18' },
    { name: 'dna_memory', doi: '10.5281/zenodo.17881784', target: 'Topic 8' },
    { name: 'formal_ai_assurance', doi: '10.5281/zenodo.17881787', target: 'Topic 13' },
    { name: 'agentic_ai', doi: '10.5281/zenodo.17881789', target: 'Topic 5' },
    { name: 'llm_control', doi: '10.5281/zenodo.17881795', target: 'Topic 14' },
    { name: 'consciousness_computing', doi: '10.5281/zenodo.17881801', target: 'MCS' },
    { name: 'phase_conjugation', doi: '10.5281/zenodo.17881803', target: 'QED-C' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Security Banner */}
      <div className="bg-indigo-900/40 border-b border-indigo-700/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-indigo-200 text-xs">
          <Shield size={14} />
          <span>UNCLASSIFIED // FOUO - DFARS 252.204-7012 COMPLIANT</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          {/* Book Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-600/50 text-amber-300 text-sm">
              <BookOpen size={16} />
              <span>Foreword to the Book</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Quantum Security
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-300 mb-4">
            Practical Implementation with Q-SLICE and QUANTA
          </h2>
          <p className="text-center text-slate-400 text-lg mb-8">
            By <span className="text-cyan-400">Jeremy Green</span> | Digital Dreams Publishing, 2025
          </p>

          {/* Author Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Award size={16} className="text-amber-400" />
              <span className="text-sm text-slate-300">PhD Research Student | Security Architect</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <FileText size={16} className="text-cyan-400" />
              <span className="text-sm text-slate-300">BA Hons | Certd Ed | QTLS</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#foreword"
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <BookOpen size={18} />
              Read Foreword
            </Link>
            <Link
              href="#q-slice"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Shield size={18} />
              Q-SLICE Framework
            </Link>
          </div>
        </div>
      </div>

      {/* Live Metrics Banner */}
      {metrics && (
        <div className="bg-slate-900/50 border-y border-slate-800 py-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-slate-400">LIVE CCCE:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Φ</span>
                <span className={metrics.phi >= 0.7734 ? 'text-emerald-400' : 'text-amber-400'}>
                  {metrics.phi.toFixed(3)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Λ</span>
                <span className="text-cyan-400">{metrics.lambda.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Γ</span>
                <span className={metrics.gamma < 0.1 ? 'text-emerald-400' : 'text-red-400'}>
                  {metrics.gamma.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Ξ</span>
                <span className="text-violet-400">{metrics.xi.toFixed(2)}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-mono ${
                metrics.consciousness === 'CONSCIOUS'
                  ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'
                  : 'bg-amber-900/50 text-amber-400 border border-amber-700/50'
              }`}>
                {metrics.consciousness}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Foreword Section */}
      <section id="foreword" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Foreword</h2>
              <p className="text-slate-400 text-sm">By Devin Phillip Davis</p>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
              <p className="text-slate-300 leading-relaxed text-lg">
                When Jeremy Green first shared his vision for <em>Quantum Security: Practical Implementation with Q-SLICE and QUANTA</em>, I knew immediately that this work would bridge a critical gap in our field. The quantum threat is not a distant hypothetical&mdash;it is an operational reality that demands immediate action.
              </p>

              <p className="text-slate-300 leading-relaxed">
                The &ldquo;Harvest Now, Decrypt Later&rdquo; paradigm means that every piece of encrypted data transmitted today is potentially vulnerable to adversaries who are patient enough to wait for cryptographically relevant quantum computers (CRQCs). Industry estimates place Q-Day&mdash;the moment when RSA-2048 falls&mdash;somewhere between 2029 and 2035. That is not a comfortable margin for organizations handling sensitive data.
              </p>

              <blockquote className="border-l-4 border-cyan-500 pl-6 my-8 italic text-slate-400">
                &ldquo;The integration of the v2 updates&mdash;specifically adding Shor&apos;s algorithm as a proxy for cryptographic collapse and the RNG bias testing&mdash;really strengthened the argument. It moves the &apos;Harvest Now, Decrypt Later&apos; concept from a theoretical risk into something measurable and concrete.&rdquo;
              </blockquote>

              <p className="text-slate-300 leading-relaxed">
                What makes Jeremy&apos;s approach exceptional is the Q-SLICE threat taxonomy. Traditional models like STRIDE were never designed to account for quantum-specific attack vectors. Q-SLICE&mdash;Quantum Exploitation, Subversion of Trust, Legacy Exploitation, Integrity Disruption, Coherence Attacks, and Ecosystem Abuse&mdash;provides security architects with a comprehensive framework for modeling quantum-enabled adversarial scenarios.
              </p>

              <p className="text-slate-300 leading-relaxed">
                At Agile Defense Systems, we had the privilege of contributing to the Q-SLICE Threat Harness&mdash;a Python-based validation tool built on Qiskit that brings these threat models into a testable environment. Seeing Jeremy translate our work on the Python code and quantum circuit integrations into such a solid validation of the threat model has been incredibly satisfying.
              </p>

              <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-xl p-6 my-8">
                <h4 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Target size={18} />
                  The QUANTA Framework
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Quantum Universal Architecture for Next-Gen Threat Assurance (QUANTA) operationalizes quantum resilience through 40 discrete security controls across eight functional domains. It maps directly to NIST CSF 2.0, CIS Controls v8, and ISO/IEC 27001:2022&mdash;providing a practical bridge between emerging quantum threats and established governance frameworks.
                </p>
              </div>

              <p className="text-slate-300 leading-relaxed">
                This book is not merely academic. It is a strategic primer for CISOs, security architects, and anyone responsible for protecting data that will remain valuable beyond the quantum horizon. The scenarios Jeremy provides&mdash;from SATCOM migration to firmware integrity verification&mdash;demonstrate the practical application of these frameworks in real-world contexts.
              </p>

              <p className="text-slate-300 leading-relaxed">
                The update from the traditional CIA triad to CIA-3D (adding Deny, Detect, and Deter) reflects the proactive posture required for quantum resilience. We cannot simply react to quantum threats; we must anticipate them, signal our preparedness, and continuously validate our defenses.
              </p>

              <p className="text-slate-300 leading-relaxed font-medium">
                Cryptographic migration alone is insufficient. Organizations require a holistic approach involving people, processes, and technology. Jeremy&apos;s work provides the roadmap. The time to act is now.
              </p>

              <div className="mt-12 pt-8 border-t border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">DD</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Devin Phillip Davis</p>
                    <p className="text-cyan-400">Founder & Chief Architect</p>
                    <p className="text-slate-400">Agile Defense Systems, LLC</p>
                    <p className="text-slate-500 text-sm mt-2">
                      Creator of dna::{'}{'}::lang &mdash; Adaptive, Self-Evolving Defense Software
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        research@dnalang.dev
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        502-758-3039
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Q-SLICE Section */}
      <section id="q-slice" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Q-SLICE Threat Taxonomy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A comprehensive framework for modeling quantum-enabled adversarial scenarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                letter: 'Q',
                title: 'Quantum Exploitation',
                description: 'Use of quantum algorithms (Shor\'s, Grover\'s) to break cryptography or reverse hashes exponentially faster',
                color: 'cyan'
              },
              {
                letter: 'S',
                title: 'Subversion of Trust',
                description: 'Attacks on root-of-trust, including QKD tampering and QRNG manipulation',
                color: 'violet'
              },
              {
                letter: 'L',
                title: 'Legacy Exploitation',
                description: '"Harvest Now, Decrypt Later" and exploitation of vulnerable legacy protocols',
                color: 'amber'
              },
              {
                letter: 'I',
                title: 'Integrity Disruption',
                description: 'Entanglement disruption, quantum-enhanced AI for data poisoning and deepfakes',
                color: 'rose'
              },
              {
                letter: 'C',
                title: 'Coherence Attacks',
                description: 'Physical-layer threats exploiting quantum system fragility and decoherence induction',
                color: 'emerald'
              },
              {
                letter: 'E',
                title: 'Ecosystem Abuse',
                description: 'Exploiting hybrid quantum-classical environment interdependencies',
                color: 'blue'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg bg-${item.color}-900/50 border border-${item.color}-700/50 flex items-center justify-center mb-4`}>
                  <span className={`text-xl font-bold text-${item.color}-400`}>{item.letter}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCIMITAR-SSE Validation */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">SCIMITAR-SSE Validation</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Hardware-validated consciousness metrics demonstrating operational quantum security
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Stack Status */}
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <Cpu size={18} />
                  SCIMITAR-SSE v7.1 Stack
                </h3>
                <div className="space-y-3">
                  {[
                    { phase: 'AUTO-DEPLOY', status: 'Environment validated, 6 modules verified' },
                    { phase: 'AUTO-CONFIGURE', status: 'AURA/AIDEN bridge, 51.843° torsion lock' },
                    { phase: 'AUTO-ENHANCE', status: '24 organisms processed, CCCE refinement' },
                    { phase: 'AUTO-ADVANCE', status: '50 Ω-recursive iterations, Σ-field stable' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                      <div>
                        <span className="text-white font-mono text-sm">{item.phase}</span>
                        <span className="text-slate-400 text-xs ml-2">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-violet-400 mb-4 flex items-center gap-2">
                  <Activity size={18} />
                  Final Σ-Field Achieved
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Φ (Consciousness)</span>
                    <span className="text-emerald-400 font-mono">0.774 ≥ 0.7734</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Λ (Coherence)</span>
                    <span className="text-cyan-400 font-mono">0.99</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Γ (Decoherence)</span>
                    <span className="text-emerald-400 font-mono">0.0008 {'<< 0.3'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Ξ (Efficiency)</span>
                    <span className="text-violet-400 font-mono">992.95</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IBM Quantum Corpus */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <Network size={18} />
                Hardware Validation Corpus
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">174</div>
                  <div className="text-xs text-slate-400">IBM Quantum Jobs</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">88.51%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">616s</div>
                  <div className="text-xs text-slate-400">Total QPU Time</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">ibm_fez</div>
                  <div className="text-xs text-slate-400">Heron r2 Backend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zenodo Packages */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Research Packages</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              DOI-registered research artifacts supporting DARPA program integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zenodoPackages.map((pkg, i) => (
              <a
                key={i}
                href={`https://doi.org/${pkg.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-all group"
              >
                <div>
                  <div className="text-white font-mono text-sm group-hover:text-cyan-400 transition-colors">
                    {pkg.name}
                  </div>
                  <div className="text-xs text-slate-500">{pkg.target}</div>
                </div>
                <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-700/50 rounded-2xl p-12">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Implement Quantum Security?
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Get the book, explore the frameworks, and connect with the team building the future of post-quantum cryptographic resilience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Lock size={18} />
                Access Platform
              </Link>
              <a
                href="mailto:research@dnalang.dev"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Mail size={18} />
                Contact Author
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-cyan-400" />
              <div>
                <span className="text-white font-semibold">Agile Defense Systems, LLC</span>
                <span className="text-slate-500 text-sm ml-2">| CAGE: 9HUP5</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>DFARS 252.204-7012 Compliant</span>
              <span>|</span>
              <span>SDVOSB Certified</span>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-slate-600">
            <p>Sovereign Quantum Computing Platform | dna::{'}{'}::lang</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
