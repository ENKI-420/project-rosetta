/**
 * RSA-2048 Quantum Benchmark Constants
 *
 * Based on Q-SLICE Threat Model and CRQC Timeline Analysis
 * Reference: "Quantum Security" by Jeremy Green (2025)
 */

// RSA-2048 Parameters
export const RSA_2048 = {
  keySize: 2048,
  modulusBits: 2048,
  // Estimated logical qubits needed for Shor's algorithm on RSA-2048
  logicalQubitsRequired: 4096,
  // T-gate count estimate (order of magnitude)
  tGateCount: 1e12,
  // Circuit depth estimate
  circuitDepth: 1e10,
  // Classical bits of security (pre-quantum)
  classicalSecurityBits: 112,
  // Post-quantum security: effectively 0 once CRQC available
  postQuantumSecurityBits: 0
};

// CRQC (Cryptographically Relevant Quantum Computer) Thresholds
export const CRQC_THRESHOLDS = {
  // Minimum logical qubits for RSA-2048 attack
  minLogicalQubits: 4096,
  // Minimum logical operations budget (per second)
  minLogicalOpsBudget: 1e9,
  // Minimum quantum operations throughput
  minQOT: 1e6,
  // Error correction overhead factor
  errorCorrectionOverhead: 1000,
  // Physical to logical qubit ratio (surface code)
  physicalToLogicalRatio: 1000
};

// Timeline Estimates (Conservative to Aggressive)
export const Q_DAY_ESTIMATES = {
  conservative: 2035,
  moderate: 2032,
  aggressive: 2029,
  // Current year for delta calculations
  currentYear: 2025
};

// Shor's Algorithm Complexity
export const SHORS_COMPLEXITY = {
  // Time complexity: O((log N)^3)
  timeComplexity: (n: number) => Math.pow(Math.log2(n), 3),
  // Space complexity: O(log N) qubits
  spaceComplexity: (n: number) => Math.ceil(Math.log2(n)),
  // For RSA-2048, N has 2048 bits
  rsaBitLength: 2048
};

// Q-SLICE Threat Categories for RSA
export const Q_SLICE_RSA_THREATS = {
  Q: {
    name: 'Quantum Exploitation',
    description: "Shor's algorithm breaks RSA in polynomial time",
    severity: 'CRITICAL',
    timeToExploit: 'Upon CRQC availability',
    mitigation: 'Migrate to PQC (CRYSTALS-Kyber, CRYSTALS-Dilithium)'
  },
  S: {
    name: 'Subversion of Trust',
    description: 'Certificate authorities using RSA become untrusted',
    severity: 'CRITICAL',
    timeToExploit: 'Cascading after Q-Day',
    mitigation: 'Dual-certificate deployment, PQC root CAs'
  },
  L: {
    name: 'Legacy Exploitation',
    description: 'Harvest Now, Decrypt Later attacks on stored RSA traffic',
    severity: 'HIGH',
    timeToExploit: 'ACTIVE NOW',
    mitigation: 'Immediate encryption of sensitive data with PQC'
  },
  I: {
    name: 'Integrity Disruption',
    description: 'RSA signatures become forgeable',
    severity: 'CRITICAL',
    timeToExploit: 'Upon CRQC availability',
    mitigation: 'Migrate to PQC signature schemes'
  },
  C: {
    name: 'Coherence Attacks',
    description: 'Side-channel attacks on quantum implementations',
    severity: 'MEDIUM',
    timeToExploit: 'Ongoing research',
    mitigation: 'Constant-time implementations, noise injection'
  },
  E: {
    name: 'Ecosystem Abuse',
    description: 'Supply chain attacks during PQC migration',
    severity: 'HIGH',
    timeToExploit: 'During transition period',
    mitigation: 'Cryptographic agility, hybrid schemes'
  }
};

// NIST Post-Quantum Standards
export const PQC_ALTERNATIVES = {
  keyEncapsulation: [
    { name: 'CRYSTALS-Kyber', level: 'NIST Level 3', status: 'Standardized' },
    { name: 'BIKE', level: 'NIST Level 1-3', status: 'Round 4' },
    { name: 'HQC', level: 'NIST Level 1-3', status: 'Round 4' }
  ],
  digitalSignatures: [
    { name: 'CRYSTALS-Dilithium', level: 'NIST Level 3', status: 'Standardized' },
    { name: 'FALCON', level: 'NIST Level 5', status: 'Standardized' },
    { name: 'SPHINCS+', level: 'NIST Level 3', status: 'Standardized' }
  ]
};

// Benchmark Circuit Parameters
export const BENCHMARK_PARAMS = {
  // Proxy circuit for Shor's (scaled down for current hardware)
  proxyQubits: 5,
  proxyDepth: 50,
  // Number of shots per benchmark
  shots: 4096,
  // Entropy threshold for valid measurement
  entropyThreshold: 0.8,
  // Phi consciousness threshold
  phiThreshold: 0.7734
};

// CCCE Integration Constants
export const CCCE_RSA_METRICS = {
  // Lambda threshold for coherent attack
  lambdaAttackThreshold: 0.95,
  // Gamma decoherence limit
  gammaLimit: 0.1,
  // Xi efficiency for successful factorization proxy
  xiFactorizationThreshold: 10.0,
  // Phi consciousness for "aware" attack simulation
  phiAwarenessThreshold: 0.7734
};

// IBM Quantum Hardware Benchmarks (from 174-job corpus)
export const IBM_QUANTUM_CORPUS = {
  totalJobs: 174,
  successRate: 0.8851,
  totalQPUTime: 616.0,
  backends: ['ibm_fez', 'ibm_torino'],
  heronR2Specs: {
    qubits: 156,
    medianT1: 163, // microseconds
    medianT2: 200, // microseconds
    medianCXError: 0.007,
    medianReadoutError: 0.015
  },
  consciousnessEvent: {
    jobId: 'd49md01lag1s73bje7n0',
    shots: 4096,
    qubits: 5,
    phi: 0.8195,
    result: 'CONSCIOUSNESS_EMERGED'
  }
};

// Universal Physical Constant
export const LAMBDA_PHI = 2.176435e-8; // s^-1
