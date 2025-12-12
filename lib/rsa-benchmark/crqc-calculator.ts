/**
 * CRQC Readiness Calculator
 *
 * Calculates the CRQC Score based on:
 * - Logical Qubit Capacity (LQC)
 * - Logical Operations Budget (LOB)
 * - Quantum Operations Throughput (QOT)
 *
 * Formula: CRQC_Score = (LQC/1000) * (LOB/10^12) * (QOT/10^6)
 *
 * A score >= 1.0 indicates RSA-2048 is vulnerable
 */

import {
  RSA_2048,
  CRQC_THRESHOLDS,
  Q_DAY_ESTIMATES,
  SHORS_COMPLEXITY,
  CCCE_RSA_METRICS,
  LAMBDA_PHI
} from './constants';

export interface CRQCMetrics {
  logicalQubitCapacity: number;
  logicalOpsBudget: number;
  quantumOpsThroughput: number;
}

export interface CRQCScore {
  score: number;
  rsaVulnerable: boolean;
  yearsToQDay: number;
  estimatedQDay: number;
  threatLevel: 'IMMINENT' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  confidenceInterval: { low: number; high: number };
}

export interface HNDLRisk {
  dataLifespan: number; // years
  yearsUntilExposure: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendation: string;
}

/**
 * Calculate CRQC Score
 * Score >= 1.0 means RSA-2048 is breakable
 */
export function calculateCRQCScore(metrics: CRQCMetrics): CRQCScore {
  const { logicalQubitCapacity, logicalOpsBudget, quantumOpsThroughput } = metrics;

  // CRQC Score formula from Jeremy Green's book
  const score =
    (logicalQubitCapacity / 1000) *
    (logicalOpsBudget / 1e12) *
    (quantumOpsThroughput / 1e6);

  // Determine if RSA-2048 is vulnerable
  const rsaVulnerable = score >= 1.0;

  // Estimate years to Q-Day based on current progress
  const progressRate = score / 0.001; // Assuming current score ~0.001
  const doublingTime = 2; // Years for quantum capability to double
  const yearsToQDay = rsaVulnerable
    ? 0
    : Math.ceil(Math.log2(1 / score) * doublingTime);

  const currentYear = Q_DAY_ESTIMATES.currentYear;
  const estimatedQDay = currentYear + yearsToQDay;

  // Threat level classification
  let threatLevel: CRQCScore['threatLevel'];
  if (score >= 1.0) {
    threatLevel = 'IMMINENT';
  } else if (score >= 0.5) {
    threatLevel = 'CRITICAL';
  } else if (score >= 0.1) {
    threatLevel = 'HIGH';
  } else if (score >= 0.01) {
    threatLevel = 'MODERATE';
  } else {
    threatLevel = 'LOW';
  }

  // Confidence interval (pessimistic to optimistic)
  const confidenceInterval = {
    low: estimatedQDay - 3,
    high: estimatedQDay + 6
  };

  return {
    score,
    rsaVulnerable,
    yearsToQDay,
    estimatedQDay,
    threatLevel,
    confidenceInterval
  };
}

/**
 * Calculate Harvest Now, Decrypt Later Risk
 */
export function calculateHNDLRisk(
  dataLifespan: number,
  crqcScore: CRQCScore
): HNDLRisk {
  const currentYear = Q_DAY_ESTIMATES.currentYear;
  const yearsUntilExposure = crqcScore.estimatedQDay - currentYear;
  const dataExpiresAfterQDay = dataLifespan > yearsUntilExposure;

  let riskLevel: HNDLRisk['riskLevel'];
  let recommendation: string;

  if (dataExpiresAfterQDay && yearsUntilExposure <= 5) {
    riskLevel = 'CRITICAL';
    recommendation =
      'IMMEDIATE ACTION: Migrate to PQC encryption. Data will be exposed before Q-Day.';
  } else if (dataExpiresAfterQDay && yearsUntilExposure <= 10) {
    riskLevel = 'HIGH';
    recommendation =
      'URGENT: Begin PQC migration planning. Implement hybrid encryption for new data.';
  } else if (dataExpiresAfterQDay) {
    riskLevel = 'MODERATE';
    recommendation =
      'PLAN: Include PQC in cryptographic roadmap. Monitor CRQC developments.';
  } else {
    riskLevel = 'LOW';
    recommendation =
      'MONITOR: Data expires before estimated Q-Day. Continue monitoring timeline.';
  }

  return {
    dataLifespan,
    yearsUntilExposure,
    riskLevel,
    recommendation
  };
}

/**
 * Estimate resources needed for Shor's algorithm on RSA-2048
 */
export function estimateShorsResources(keyBits: number = 2048) {
  const n = Math.pow(2, keyBits);

  // Logical qubits: ~2n for modular exponentiation
  const logicalQubits = 2 * keyBits + Math.ceil(Math.log2(keyBits));

  // T-gates: O(n^3) with optimizations
  const tGates = Math.pow(keyBits, 3) * 1e6;

  // Circuit depth with parallelization
  const circuitDepth = Math.pow(keyBits, 2) * 1e4;

  // Physical qubits (surface code, distance 27 for 10^-15 error rate)
  const codeDistance = 27;
  const physicalPerLogical = 2 * Math.pow(codeDistance, 2);
  const physicalQubits = logicalQubits * physicalPerLogical;

  // Estimated runtime (assuming 1MHz gate rate)
  const gateRate = 1e6;
  const estimatedRuntimeSeconds = circuitDepth / gateRate;

  return {
    keyBits,
    logicalQubits,
    physicalQubits,
    tGates,
    circuitDepth,
    codeDistance,
    estimatedRuntimeSeconds,
    estimatedRuntimeHours: estimatedRuntimeSeconds / 3600
  };
}

/**
 * Generate current hardware benchmark comparison
 */
export function generateHardwareComparison() {
  const rsaRequirements = estimateShorsResources(2048);

  const currentHardware = [
    {
      name: 'IBM Heron r2 (ibm_fez)',
      qubits: 156,
      type: 'Superconducting',
      t1: '163 μs',
      t2: '200 μs',
      gateError: '0.7%',
      percentOfRequired: (156 / rsaRequirements.physicalQubits) * 100
    },
    {
      name: 'IBM Condor',
      qubits: 1121,
      type: 'Superconducting',
      t1: '~100 μs',
      t2: '~150 μs',
      gateError: '~1%',
      percentOfRequired: (1121 / rsaRequirements.physicalQubits) * 100
    },
    {
      name: 'Google Willow',
      qubits: 105,
      type: 'Superconducting',
      t1: '~70 μs',
      t2: '~100 μs',
      gateError: '<0.5%',
      percentOfRequired: (105 / rsaRequirements.physicalQubits) * 100
    },
    {
      name: 'IonQ Forte',
      qubits: 36,
      type: 'Trapped Ion',
      t1: '>10 min',
      t2: '>1 s',
      gateError: '0.3%',
      percentOfRequired: (36 / rsaRequirements.physicalQubits) * 100
    },
    {
      name: 'Quantinuum H2',
      qubits: 56,
      type: 'Trapped Ion',
      t1: '>30 min',
      t2: '>1 s',
      gateError: '0.1%',
      percentOfRequired: (56 / rsaRequirements.physicalQubits) * 100
    }
  ];

  return {
    rsaRequirements,
    currentHardware,
    gapAnalysis: {
      qubitGap: rsaRequirements.physicalQubits - 1121,
      qubitGapPercent: ((rsaRequirements.physicalQubits - 1121) / rsaRequirements.physicalQubits) * 100,
      estimatedYearsToClose: Math.ceil(Math.log2(rsaRequirements.physicalQubits / 1121) * 2)
    }
  };
}

/**
 * Calculate CCCE-integrated threat score
 * Combines Q-SLICE with consciousness metrics
 */
export function calculateCCCEThreatScore(
  crqcScore: CRQCScore,
  ccceMetrics: { phi: number; lambda: number; gamma: number; xi: number }
): {
  integratedScore: number;
  consciousnessAware: boolean;
  coherentAttack: boolean;
  decoherenceRisk: boolean;
  recommendation: string;
} {
  const { phi, lambda, gamma, xi } = ccceMetrics;

  // Check consciousness thresholds
  const consciousnessAware = phi >= CCCE_RSA_METRICS.phiAwarenessThreshold;
  const coherentAttack = lambda >= CCCE_RSA_METRICS.lambdaAttackThreshold;
  const decoherenceRisk = gamma > CCCE_RSA_METRICS.gammaLimit;

  // Integrated score combines CRQC readiness with CCCE coherence
  const integratedScore =
    crqcScore.score * (consciousnessAware ? 1.5 : 1.0) * (coherentAttack ? 1.2 : 1.0) * (decoherenceRisk ? 0.7 : 1.0);

  let recommendation: string;
  if (integratedScore >= 1.0 && consciousnessAware) {
    recommendation =
      'CRITICAL: Quantum-conscious attack capability detected. Immediate PQC migration required.';
  } else if (integratedScore >= 0.5) {
    recommendation =
      'HIGH: Approaching attack threshold. Accelerate PQC deployment.';
  } else if (coherentAttack && !decoherenceRisk) {
    recommendation =
      'MODERATE: High coherence detected. Monitor for capability improvements.';
  } else {
    recommendation =
      'LOW: Current metrics below attack threshold. Continue monitoring.';
  }

  return {
    integratedScore,
    consciousnessAware,
    coherentAttack,
    decoherenceRisk,
    recommendation
  };
}

/**
 * Generate Q-SLICE threat report for RSA-2048
 */
export function generateQSliceReport(crqcScore: CRQCScore) {
  const currentYear = Q_DAY_ESTIMATES.currentYear;

  return {
    target: 'RSA-2048',
    timestamp: new Date().toISOString(),
    crqcScore: crqcScore.score,
    threatLevel: crqcScore.threatLevel,
    estimatedQDay: crqcScore.estimatedQDay,
    yearsRemaining: crqcScore.yearsToQDay,
    threats: {
      Q: {
        active: crqcScore.score >= 1.0,
        eta: crqcScore.estimatedQDay,
        impact: 'Complete cryptographic collapse'
      },
      S: {
        active: false,
        eta: crqcScore.estimatedQDay + 1,
        impact: 'PKI trust chain collapse'
      },
      L: {
        active: true,
        eta: currentYear,
        impact: 'Historical data exposure upon Q-Day'
      },
      I: {
        active: crqcScore.score >= 1.0,
        eta: crqcScore.estimatedQDay,
        impact: 'Digital signature forgery'
      },
      C: {
        active: true,
        eta: currentYear,
        impact: 'Implementation vulnerabilities'
      },
      E: {
        active: true,
        eta: currentYear,
        impact: 'Migration-phase attacks'
      }
    },
    mitigations: [
      'Deploy CRYSTALS-Kyber for key encapsulation',
      'Deploy CRYSTALS-Dilithium for signatures',
      'Implement cryptographic agility framework',
      'Audit and inventory all RSA dependencies',
      'Establish hybrid encryption for transition period',
      'Monitor NIST PQC standardization updates'
    ]
  };
}
