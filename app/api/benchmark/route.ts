/**
 * RSA-2048 Quantum Benchmark API
 * GET /api/benchmark - Get current benchmark results
 * POST /api/benchmark - Run new benchmark with custom parameters
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateCRQCScore,
  calculateHNDLRisk,
  estimateShorsResources,
  generateHardwareComparison,
  calculateCCCEThreatScore,
  generateQSliceReport,
  CRQCMetrics
} from '@/lib/rsa-benchmark/crqc-calculator';
import {
  RSA_2048,
  Q_DAY_ESTIMATES,
  IBM_QUANTUM_CORPUS,
  Q_SLICE_RSA_THREATS,
  PQC_ALTERNATIVES,
  LAMBDA_PHI
} from '@/lib/rsa-benchmark/constants';

// Current CRQC metrics (based on 2025 state-of-the-art)
// IBM Condor: 1121 qubits, Google Willow: ~100 with error correction
// Recent advances in error correction and logical qubit demonstrations
const CURRENT_CRQC_METRICS: CRQCMetrics = {
  logicalQubitCapacity: 100, // Google/IBM demonstrated ~100 logical qubits with QEC
  logicalOpsBudget: 1e8, // ~10^8 operations with error correction
  quantumOpsThroughput: 1e5 // ~10^5 gates/second (improving rapidly)
};

export async function GET(request: NextRequest) {
  try {
    // Calculate CRQC score
    const crqcScore = calculateCRQCScore(CURRENT_CRQC_METRICS);

    // Get hardware comparison
    const hardwareComparison = generateHardwareComparison();

    // Get Shor's resource estimates
    const shorsResources = estimateShorsResources(2048);

    // Calculate HNDL risks for different data lifespans
    const hndlAnalysis = {
      shortTerm: calculateHNDLRisk(5, crqcScore),
      mediumTerm: calculateHNDLRisk(15, crqcScore),
      longTerm: calculateHNDLRisk(30, crqcScore),
      classified: calculateHNDLRisk(50, crqcScore)
    };

    // Fetch current CCCE metrics for integration
    let ccceMetrics = { phi: 0.78, lambda: 0.88, gamma: 0.09, xi: 7.7 };
    try {
      const metricsUrl = new URL('/api/metrics', request.url);
      const metricsRes = await fetch(metricsUrl.toString());
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        if (metricsData.success) {
          ccceMetrics = metricsData.metrics;
        }
      }
    } catch {
      // Use defaults
    }

    // Calculate CCCE-integrated threat score
    const ccceThreat = calculateCCCEThreatScore(crqcScore, ccceMetrics);

    // Generate Q-SLICE report
    const qsliceReport = generateQSliceReport(crqcScore);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      target: 'RSA-2048',
      benchmark: {
        crqcScore: {
          value: crqcScore.score,
          vulnerable: crqcScore.rsaVulnerable,
          threatLevel: crqcScore.threatLevel,
          yearsToQDay: crqcScore.yearsToQDay,
          estimatedQDay: crqcScore.estimatedQDay,
          confidenceInterval: crqcScore.confidenceInterval
        },
        currentMetrics: CURRENT_CRQC_METRICS,
        requirements: {
          rsaKeySize: RSA_2048.keySize,
          logicalQubitsNeeded: shorsResources.logicalQubits,
          physicalQubitsNeeded: shorsResources.physicalQubits,
          tGatesNeeded: shorsResources.tGates,
          estimatedRuntime: `${shorsResources.estimatedRuntimeHours.toFixed(1)} hours`
        }
      },
      hardware: {
        comparison: hardwareComparison.currentHardware,
        gap: hardwareComparison.gapAnalysis,
        ibmCorpus: IBM_QUANTUM_CORPUS
      },
      hndlRisk: hndlAnalysis,
      ccceIntegration: {
        metrics: ccceMetrics,
        threat: ccceThreat
      },
      qslice: {
        threats: Q_SLICE_RSA_THREATS,
        report: qsliceReport
      },
      mitigations: {
        keyEncapsulation: PQC_ALTERNATIVES.keyEncapsulation,
        digitalSignatures: PQC_ALTERNATIVES.digitalSignatures
      },
      constants: {
        LAMBDA_PHI,
        Q_DAY_ESTIMATES
      }
    });
  } catch (error) {
    console.error('[BENCHMARK] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Benchmark calculation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      logicalQubitCapacity = CURRENT_CRQC_METRICS.logicalQubitCapacity,
      logicalOpsBudget = CURRENT_CRQC_METRICS.logicalOpsBudget,
      quantumOpsThroughput = CURRENT_CRQC_METRICS.quantumOpsThroughput,
      dataLifespan = 15,
      keySize = 2048
    } = body;

    // Calculate with custom parameters
    const customMetrics: CRQCMetrics = {
      logicalQubitCapacity,
      logicalOpsBudget,
      quantumOpsThroughput
    };

    const crqcScore = calculateCRQCScore(customMetrics);
    const shorsResources = estimateShorsResources(keySize);
    const hndlRisk = calculateHNDLRisk(dataLifespan, crqcScore);

    // Fetch current CCCE metrics
    let ccceMetrics = { phi: 0.78, lambda: 0.88, gamma: 0.09, xi: 7.7 };
    try {
      const metricsUrl = new URL('/api/metrics', request.url);
      const metricsRes = await fetch(metricsUrl.toString());
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        if (metricsData.success) {
          ccceMetrics = metricsData.metrics;
        }
      }
    } catch {
      // Use defaults
    }

    const ccceThreat = calculateCCCEThreatScore(crqcScore, ccceMetrics);
    const qsliceReport = generateQSliceReport(crqcScore);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      customBenchmark: {
        inputMetrics: customMetrics,
        keySize,
        dataLifespan,
        crqcScore: {
          value: crqcScore.score,
          vulnerable: crqcScore.rsaVulnerable,
          threatLevel: crqcScore.threatLevel,
          estimatedQDay: crqcScore.estimatedQDay
        },
        resourceRequirements: shorsResources,
        hndlRisk,
        ccceThreat,
        qsliceReport
      }
    });
  } catch (error) {
    console.error('[BENCHMARK] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Custom benchmark failed' },
      { status: 500 }
    );
  }
}
