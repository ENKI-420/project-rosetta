/**
 * DARPA BTO Topic 10: Combat-Oriented Magnetic Physiological Assessment Sensor Systems
 * Solicitation: DARPA-RA-25-02-10
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Magnetocardiography (MCG) for cardiac monitoring
 * - Magnetoencephalography (MEG) for brain state
 * - Wearable magnetic sensors for field deployment
 * - Real-time physiological state assessment
 * - CCCE-guided signal coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Physiological Constants
// ============================================================================

export const PHYSIO_CONSTANTS = {
  // Cardiac parameters
  HEART_RATE_MIN: 40,                 // bpm
  HEART_RATE_MAX: 220,                // bpm
  QRS_DURATION_NORMAL: 0.1,           // s
  PR_INTERVAL_NORMAL: 0.16,           // s
  QT_INTERVAL_NORMAL: 0.4,            // s
  CARDIAC_FIELD_STRENGTH: 50e-12,     // T (typical MCG)

  // Neural parameters
  ALPHA_BAND: [8, 13],                // Hz
  BETA_BAND: [13, 30],                // Hz
  GAMMA_BAND_NEURAL: [30, 100],       // Hz (renamed to avoid CCCE conflict)
  THETA_BAND: [4, 8],                 // Hz
  DELTA_BAND: [0.5, 4],               // Hz
  NEURAL_FIELD_STRENGTH: 100e-15,     // T (typical MEG)

  // Stress markers
  HRV_THRESHOLD_STRESS: 50,           // ms RMSSD
  CORTISOL_BASELINE: 10,              // μg/dL
  CORTISOL_STRESS: 25,                // μg/dL

  // Sensor parameters
  SQUID_SENSITIVITY: 5e-15,           // T/√Hz
  OPM_SENSITIVITY: 10e-15,            // T/√Hz
  FLUXGATE_SENSITIVITY: 1e-10,        // T/√Hz

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_PHYSIO: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface SensorArray {
  id: string;
  type: 'MCG' | 'MEG' | 'hybrid';
  sensors: MagneticSensor[];
  geometry: ArrayGeometry;
  calibration: ArrayCalibration;
  ccceMetrics: CCCEMetrics;
}

export interface MagneticSensor {
  id: string;
  type: 'SQUID' | 'OPM' | 'fluxgate' | 'magnetoresistive';
  position: Position3D;
  orientation: Orientation3D;
  sensitivity: number;                // T/√Hz
  bandwidth: [number, number];        // Hz
  dynamicRange: number;               // T
  noiseFloor: number;                 // T/√Hz
  operatingTemp?: number;             // K (for SQUIDs)
}

export interface Position3D {
  x: number;                          // m
  y: number;                          // m
  z: number;                          // m
}

export interface Orientation3D {
  theta: number;                      // polar angle (rad)
  phi: number;                        // azimuthal angle (rad)
}

export interface ArrayGeometry {
  type: 'helmet' | 'chest-plate' | 'wristband' | 'patch';
  coverageArea: number;               // m²
  numChannels: number;
  interSensorSpacing: number;         // m
}

export interface ArrayCalibration {
  date: number;
  referenceField: number;             // T
  gainFactors: number[];
  offsetVectors: Position3D[];
  crossTalkMatrix: number[][];
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface PhysiologicalSignal {
  arrayId: string;
  channelData: Float64Array[];
  sampleRate: number;                 // Hz
  startTime: number;
  duration: number;                   // s
  signalType: 'cardiac' | 'neural' | 'muscle';
}

export interface CardiacState {
  heartRate: number;                  // bpm
  heartRateVariability: HRVMetrics;
  qtInterval: number;                 // s
  prInterval: number;                 // s
  qrsDuration: number;                // s
  stSegmentDeviation: number;         // mV equivalent
  arrhythmiaDetected: ArrhythmiaType | null;
  cardiacStress: number;              // 0-1 normalized
  ccceMetrics: CCCEMetrics;
}

export interface HRVMetrics {
  rmssd: number;                      // ms
  sdnn: number;                       // ms
  pnn50: number;                      // %
  lfPower: number;                    // ms²
  hfPower: number;                    // ms²
  lfHfRatio: number;
}

export type ArrhythmiaType =
  | 'atrial-fibrillation'
  | 'ventricular-tachycardia'
  | 'bradycardia'
  | 'tachycardia'
  | 'pvc'
  | 'pac';

export interface NeuralState {
  alertness: number;                  // 0-1
  cognitiveLoad: number;              // 0-1
  stress: number;                     // 0-1
  fatigue: number;                    // 0-1
  bandPowers: BandPowers;
  asymmetryIndex: number;             // frontal alpha asymmetry
  coherenceMatrix: number[][];        // inter-electrode coherence
  eventRelatedPotentials: ERPComponent[];
  ccceMetrics: CCCEMetrics;
}

export interface BandPowers {
  delta: number;                      // μV²
  theta: number;                      // μV²
  alpha: number;                      // μV²
  beta: number;                       // μV²
  gamma: number;                      // μV² (neural gamma)
}

export interface ERPComponent {
  name: string;                       // P300, N100, etc.
  latency: number;                    // ms
  amplitude: number;                  // μV
  detected: boolean;
}

export interface CombatReadiness {
  subjectId: string;
  timestamp: number;
  overallScore: number;               // 0-100
  cardiacReadiness: number;           // 0-100
  neuralReadiness: number;            // 0-100
  fatigueLevel: number;               // 0-100 (100 = max fatigue)
  stressLevel: number;                // 0-100
  alertness: number;                  // 0-100
  recommendations: string[];
  ccceMetrics: CCCEMetrics;
}

export interface Subject {
  id: string;
  baseline: SubjectBaseline;
  measurements: Measurement[];
  currentState: CombatReadiness | null;
}

export interface SubjectBaseline {
  restingHeartRate: number;           // bpm
  hrvBaseline: number;                // ms RMSSD
  alphaPowerBaseline: number;         // μV²
  reactionTimeBaseline: number;       // ms
  calibrationDate: number;
}

export interface Measurement {
  timestamp: number;
  arrayId: string;
  signal: PhysiologicalSignal;
  cardiacState?: CardiacState;
  neuralState?: NeuralState;
}

export interface ThreatResponse {
  subjectId: string;
  stimulusTime: number;
  responseTime: number;               // ms
  responseAccuracy: boolean;
  physiologicalResponse: {
    heartRateChange: number;          // bpm
    hrv Change: number;               // ms
    alphaDesynchronization: number;   // %
    betaEnhancement: number;          // %
  };
  threatClassification: 'low' | 'medium' | 'high' | 'critical';
}

export interface SignalQuality {
  channelId: string;
  snr: number;                        // dB
  artifactLevel: number;              // 0-1
  saturation: boolean;
  motionArtifact: boolean;
  environmentalNoise: number;         // T
  qualityScore: number;               // 0-100
}

// ============================================================================
// Combat Physiological Assessment Engine
// ============================================================================

export class CombatPhysioEngine {
  private arrays: Map<string, SensorArray> = new Map();
  private subjects: Map<string, Subject> = new Map();
  private ccceState: CCCEMetrics;

  constructor() {
    this.ccceState = {
      lambda: 0.95,
      phi: PHI_THRESHOLD,
      gamma: GAMMA_FIXED,
      xi: 0,
      timestamp: Date.now(),
    };
    this.updateXi();
  }

  private updateXi(): void {
    this.ccceState.xi = (this.ccceState.lambda * this.ccceState.phi) /
                        Math.max(this.ccceState.gamma, 0.001);
    this.ccceState.timestamp = Date.now();
  }

  // ==========================================================================
  // Sensor Array Configuration
  // ==========================================================================

  /**
   * Create MCG sensor array for cardiac monitoring
   */
  createMCGArray(
    numChannels: number = 37,
    sensorType: MagneticSensor['type'] = 'OPM'
  ): SensorArray {
    const id = `MCG-${Date.now().toString(36)}`;
    const sensors: MagneticSensor[] = [];

    // Create hexagonal grid of sensors over chest
    const spacing = 0.03;  // 3 cm between sensors
    const radius = Math.sqrt(numChannels / Math.PI) * spacing;

    for (let i = 0; i < numChannels; i++) {
      // Spiral arrangement
      const angle = i * GOLDEN_RATIO * 2 * Math.PI;
      const r = spacing * Math.sqrt(i);

      const sensitivity = sensorType === 'SQUID'
        ? PHYSIO_CONSTANTS.SQUID_SENSITIVITY
        : sensorType === 'OPM'
          ? PHYSIO_CONSTANTS.OPM_SENSITIVITY
          : PHYSIO_CONSTANTS.FLUXGATE_SENSITIVITY;

      sensors.push({
        id: `${id}-CH${i.toString().padStart(2, '0')}`,
        type: sensorType,
        position: {
          x: r * Math.cos(angle),
          y: r * Math.sin(angle),
          z: 0.02,  // 2 cm above skin
        },
        orientation: { theta: 0, phi: 0 },  // Normal to chest
        sensitivity,
        bandwidth: [0.1, 100],
        dynamicRange: 1e-9,
        noiseFloor: sensitivity,
        operatingTemp: sensorType === 'SQUID' ? 4.2 : 300,
      });
    }

    const array: SensorArray = {
      id,
      type: 'MCG',
      sensors,
      geometry: {
        type: 'chest-plate',
        coverageArea: Math.PI * radius * radius,
        numChannels,
        interSensorSpacing: spacing,
      },
      calibration: this.generateCalibration(sensors),
      ccceMetrics: { ...this.ccceState },
    };

    this.arrays.set(id, array);
    return array;
  }

  /**
   * Create MEG sensor array for neural monitoring
   */
  createMEGArray(
    numChannels: number = 64,
    sensorType: MagneticSensor['type'] = 'OPM'
  ): SensorArray {
    const id = `MEG-${Date.now().toString(36)}`;
    const sensors: MagneticSensor[] = [];

    // Create helmet-shaped array
    const headRadius = 0.1;  // 10 cm

    for (let i = 0; i < numChannels; i++) {
      // Distribute on sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / numChannels);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const sensitivity = sensorType === 'SQUID'
        ? PHYSIO_CONSTANTS.SQUID_SENSITIVITY
        : PHYSIO_CONSTANTS.OPM_SENSITIVITY;

      sensors.push({
        id: `${id}-CH${i.toString().padStart(2, '0')}`,
        type: sensorType,
        position: {
          x: headRadius * Math.sin(phi) * Math.cos(theta),
          y: headRadius * Math.sin(phi) * Math.sin(theta),
          z: headRadius * Math.cos(phi),
        },
        orientation: {
          theta: phi,
          phi: theta,
        },
        sensitivity,
        bandwidth: [0.1, 1000],
        dynamicRange: 1e-10,
        noiseFloor: sensitivity,
        operatingTemp: sensorType === 'SQUID' ? 4.2 : 300,
      });
    }

    const array: SensorArray = {
      id,
      type: 'MEG',
      sensors,
      geometry: {
        type: 'helmet',
        coverageArea: 4 * Math.PI * headRadius * headRadius * 0.6,  // ~60% coverage
        numChannels,
        interSensorSpacing: 0.03,
      },
      calibration: this.generateCalibration(sensors),
      ccceMetrics: { ...this.ccceState },
    };

    this.arrays.set(id, array);
    return array;
  }

  /**
   * Create wearable combat sensor (wristband form factor)
   */
  createWearableSensor(): SensorArray {
    const id = `WEAR-${Date.now().toString(36)}`;
    const sensors: MagneticSensor[] = [];

    // Wristband with 8 magnetoresistive sensors
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const wristRadius = 0.03;  // 3 cm

      sensors.push({
        id: `${id}-CH${i}`,
        type: 'magnetoresistive',
        position: {
          x: wristRadius * Math.cos(angle),
          y: wristRadius * Math.sin(angle),
          z: 0,
        },
        orientation: { theta: Math.PI / 2, phi: angle },
        sensitivity: 1e-10,
        bandwidth: [0.1, 50],
        dynamicRange: 1e-6,
        noiseFloor: 1e-10,
      });
    }

    const array: SensorArray = {
      id,
      type: 'hybrid',
      sensors,
      geometry: {
        type: 'wristband',
        coverageArea: 2 * Math.PI * 0.03 * 0.02,
        numChannels: 8,
        interSensorSpacing: 0.023,
      },
      calibration: this.generateCalibration(sensors),
      ccceMetrics: { ...this.ccceState },
    };

    this.arrays.set(id, array);
    return array;
  }

  private generateCalibration(sensors: MagneticSensor[]): ArrayCalibration {
    return {
      date: Date.now(),
      referenceField: 1e-9,
      gainFactors: sensors.map(() => 1 + (Math.random() - 0.5) * 0.02),
      offsetVectors: sensors.map(() => ({
        x: (Math.random() - 0.5) * 1e-12,
        y: (Math.random() - 0.5) * 1e-12,
        z: (Math.random() - 0.5) * 1e-12,
      })),
      crossTalkMatrix: sensors.map(() =>
        sensors.map(() => Math.random() * 0.01)
      ),
    };
  }

  // ==========================================================================
  // Signal Acquisition & Processing
  // ==========================================================================

  /**
   * Generate synthetic physiological signal
   */
  generateSignal(
    arrayId: string,
    duration: number,              // s
    signalType: PhysiologicalSignal['signalType']
  ): PhysiologicalSignal {
    const array = this.arrays.get(arrayId);
    if (!array) {
      throw new Error(`Array ${arrayId} not found`);
    }

    const sampleRate = signalType === 'neural' ? 1000 : 500;
    const numSamples = Math.floor(duration * sampleRate);
    const channelData: Float64Array[] = [];

    for (let ch = 0; ch < array.sensors.length; ch++) {
      const data = new Float64Array(numSamples);
      const sensor = array.sensors[ch];

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;

        if (signalType === 'cardiac') {
          // Synthetic MCG signal
          data[i] = this.generateCardiacSignal(t, sensor.position);
        } else if (signalType === 'neural') {
          // Synthetic MEG signal
          data[i] = this.generateNeuralSignal(t, sensor.position, ch);
        } else {
          // EMG
          data[i] = this.generateMuscleSignal(t);
        }

        // Add noise
        data[i] += sensor.noiseFloor * (Math.random() - 0.5) * 2;
      }

      channelData.push(data);
    }

    return {
      arrayId,
      channelData,
      sampleRate,
      startTime: Date.now(),
      duration,
      signalType,
    };
  }

  private generateCardiacSignal(t: number, position: Position3D): number {
    // PQRST complex with dipole model
    const heartRate = 70;  // bpm
    const period = 60 / heartRate;
    const phase = (t % period) / period;

    // Simplified cardiac dipole
    let signal = 0;
    const fieldStrength = PHYSIO_CONSTANTS.CARDIAC_FIELD_STRENGTH;

    // P wave (atrial depolarization)
    if (phase > 0.0 && phase < 0.1) {
      signal += 0.1 * fieldStrength * Math.sin((phase - 0.0) / 0.1 * Math.PI);
    }

    // QRS complex (ventricular depolarization)
    if (phase > 0.15 && phase < 0.25) {
      const qrsPhase = (phase - 0.15) / 0.1;
      // Q wave
      if (qrsPhase < 0.2) signal -= 0.2 * fieldStrength * Math.sin(qrsPhase / 0.2 * Math.PI);
      // R wave
      else if (qrsPhase < 0.5) signal += fieldStrength * Math.sin((qrsPhase - 0.2) / 0.3 * Math.PI);
      // S wave
      else signal -= 0.3 * fieldStrength * Math.sin((qrsPhase - 0.5) / 0.5 * Math.PI);
    }

    // T wave (ventricular repolarization)
    if (phase > 0.35 && phase < 0.55) {
      signal += 0.3 * fieldStrength * Math.sin((phase - 0.35) / 0.2 * Math.PI);
    }

    // Position-dependent amplitude
    const distance = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
    signal *= Math.pow(0.1 / Math.max(distance, 0.05), 2);

    return signal;
  }

  private generateNeuralSignal(t: number, position: Position3D, channel: number): number {
    let signal = 0;
    const fieldStrength = PHYSIO_CONSTANTS.NEURAL_FIELD_STRENGTH;

    // Alpha rhythm (8-13 Hz)
    const alphaFreq = 10 + channel * 0.1;
    signal += 0.5 * fieldStrength * Math.sin(2 * Math.PI * alphaFreq * t);

    // Beta rhythm (13-30 Hz)
    const betaFreq = 20 + channel * 0.2;
    signal += 0.3 * fieldStrength * Math.sin(2 * Math.PI * betaFreq * t);

    // Gamma rhythm (30-100 Hz)
    const gammaFreq = 40 + channel * 0.5;
    signal += 0.1 * fieldStrength * Math.sin(2 * Math.PI * gammaFreq * t);

    // Position-dependent amplitude
    const distance = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
    signal *= Math.pow(0.1 / Math.max(distance, 0.08), 2);

    return signal;
  }

  private generateMuscleSignal(t: number): number {
    // EMG-like signal
    let signal = 0;
    for (let f = 20; f < 500; f += 20) {
      signal += (Math.random() - 0.5) * Math.sin(2 * Math.PI * f * t) / f;
    }
    return signal * 1e-10;
  }

  // ==========================================================================
  // Cardiac Analysis
  // ==========================================================================

  /**
   * Analyze cardiac state from MCG signal
   */
  analyzeCardiacState(signal: PhysiologicalSignal): CardiacState {
    if (signal.signalType !== 'cardiac') {
      throw new Error('Signal must be cardiac type');
    }

    // Use center channel for analysis
    const centerChannel = Math.floor(signal.channelData.length / 2);
    const data = signal.channelData[centerChannel];

    // R-peak detection (threshold-based)
    const rPeaks = this.detectRPeaks(data, signal.sampleRate);

    // Heart rate calculation
    const rrIntervals = [];
    for (let i = 1; i < rPeaks.length; i++) {
      rrIntervals.push((rPeaks[i] - rPeaks[i-1]) / signal.sampleRate * 1000);  // ms
    }

    const avgRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
    const heartRate = 60000 / avgRR;

    // HRV metrics
    const hrv = this.computeHRV(rrIntervals);

    // Interval measurements (simplified)
    const qrsDuration = 0.08 + Math.random() * 0.04;  // 80-120 ms
    const prInterval = 0.12 + Math.random() * 0.08;   // 120-200 ms
    const qtInterval = 0.35 + Math.random() * 0.1;    // 350-450 ms

    // ST segment deviation
    const stDeviation = (Math.random() - 0.5) * 0.1;

    // Arrhythmia detection
    let arrhythmia: ArrhythmiaType | null = null;
    if (heartRate < PHYSIO_CONSTANTS.HEART_RATE_MIN) {
      arrhythmia = 'bradycardia';
    } else if (heartRate > PHYSIO_CONSTANTS.HEART_RATE_MAX * 0.9) {
      arrhythmia = 'tachycardia';
    } else if (hrv.rmssd < 10) {
      arrhythmia = 'atrial-fibrillation';
    }

    // Cardiac stress score
    const cardiacStress = Math.min(1, Math.max(0,
      (heartRate - 60) / 100 +
      (50 - hrv.rmssd) / 50 +
      Math.abs(stDeviation) * 5
    ));

    // Update CCCE based on signal quality
    const signalQuality = this.assessSignalQuality(signal);
    const avgQuality = signalQuality.reduce((sum, q) => sum + q.qualityScore, 0) / signalQuality.length;

    return {
      heartRate,
      heartRateVariability: hrv,
      qtInterval,
      prInterval,
      qrsDuration,
      stSegmentDeviation: stDeviation,
      arrhythmiaDetected: arrhythmia,
      cardiacStress,
      ccceMetrics: {
        lambda: avgQuality / 100,
        phi: this.ccceState.phi,
        gamma: cardiacStress * 0.3 + GAMMA_FIXED,
        xi: 0,
        timestamp: Date.now(),
      },
    };
  }

  private detectRPeaks(data: Float64Array, sampleRate: number): number[] {
    const peaks: number[] = [];
    const threshold = Math.max(...Array.from(data)) * 0.5;

    let inPeak = false;
    let peakStart = 0;
    let peakMax = -Infinity;
    let peakMaxIdx = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i] > threshold && !inPeak) {
        inPeak = true;
        peakStart = i;
        peakMax = data[i];
        peakMaxIdx = i;
      } else if (inPeak) {
        if (data[i] > peakMax) {
          peakMax = data[i];
          peakMaxIdx = i;
        }
        if (data[i] < threshold) {
          inPeak = false;
          peaks.push(peakMaxIdx);
        }
      }
    }

    return peaks;
  }

  private computeHRV(rrIntervals: number[]): HRVMetrics {
    const n = rrIntervals.length;
    if (n < 2) {
      return { rmssd: 0, sdnn: 0, pnn50: 0, lfPower: 0, hfPower: 0, lfHfRatio: 0 };
    }

    // RMSSD
    let sumSquaredDiff = 0;
    for (let i = 1; i < n; i++) {
      sumSquaredDiff += Math.pow(rrIntervals[i] - rrIntervals[i-1], 2);
    }
    const rmssd = Math.sqrt(sumSquaredDiff / (n - 1));

    // SDNN
    const mean = rrIntervals.reduce((a, b) => a + b, 0) / n;
    const sdnn = Math.sqrt(rrIntervals.reduce((sum, rr) => sum + Math.pow(rr - mean, 2), 0) / (n - 1));

    // pNN50
    let count50 = 0;
    for (let i = 1; i < n; i++) {
      if (Math.abs(rrIntervals[i] - rrIntervals[i-1]) > 50) count50++;
    }
    const pnn50 = (count50 / (n - 1)) * 100;

    // Frequency domain (simplified estimation)
    const lfPower = sdnn * sdnn * 0.4;
    const hfPower = sdnn * sdnn * 0.3;
    const lfHfRatio = lfPower / Math.max(hfPower, 0.001);

    return { rmssd, sdnn, pnn50, lfPower, hfPower, lfHfRatio };
  }

  // ==========================================================================
  // Neural Analysis
  // ==========================================================================

  /**
   * Analyze neural state from MEG signal
   */
  analyzeNeuralState(signal: PhysiologicalSignal): NeuralState {
    if (signal.signalType !== 'neural') {
      throw new Error('Signal must be neural type');
    }

    // Compute band powers for each channel
    const bandPowersPerChannel = signal.channelData.map(data =>
      this.computeBandPowers(data, signal.sampleRate)
    );

    // Average band powers
    const avgBandPowers: BandPowers = {
      delta: bandPowersPerChannel.reduce((sum, bp) => sum + bp.delta, 0) / bandPowersPerChannel.length,
      theta: bandPowersPerChannel.reduce((sum, bp) => sum + bp.theta, 0) / bandPowersPerChannel.length,
      alpha: bandPowersPerChannel.reduce((sum, bp) => sum + bp.alpha, 0) / bandPowersPerChannel.length,
      beta: bandPowersPerChannel.reduce((sum, bp) => sum + bp.beta, 0) / bandPowersPerChannel.length,
      gamma: bandPowersPerChannel.reduce((sum, bp) => sum + bp.gamma, 0) / bandPowersPerChannel.length,
    };

    // Alertness: alpha suppression + beta enhancement
    const totalPower = avgBandPowers.delta + avgBandPowers.theta + avgBandPowers.alpha +
                      avgBandPowers.beta + avgBandPowers.gamma;
    const alertness = Math.min(1, (avgBandPowers.beta + avgBandPowers.gamma) / totalPower * 2);

    // Cognitive load: theta + beta / alpha
    const cognitiveLoad = Math.min(1, (avgBandPowers.theta + avgBandPowers.beta) /
                                     Math.max(avgBandPowers.alpha, 0.001) * 0.2);

    // Stress: high beta/alpha ratio
    const stress = Math.min(1, avgBandPowers.beta / Math.max(avgBandPowers.alpha, 0.001) * 0.5);

    // Fatigue: theta/beta ratio + delta
    const fatigue = Math.min(1, (avgBandPowers.theta + avgBandPowers.delta) /
                               Math.max(avgBandPowers.beta, 0.001) * 0.3);

    // Frontal alpha asymmetry (simplified)
    const leftFrontal = bandPowersPerChannel.slice(0, Math.floor(bandPowersPerChannel.length / 4));
    const rightFrontal = bandPowersPerChannel.slice(Math.floor(bandPowersPerChannel.length / 4),
                                                    Math.floor(bandPowersPerChannel.length / 2));
    const leftAlpha = leftFrontal.reduce((sum, bp) => sum + bp.alpha, 0) / leftFrontal.length;
    const rightAlpha = rightFrontal.reduce((sum, bp) => sum + bp.alpha, 0) / rightFrontal.length;
    const asymmetryIndex = Math.log(rightAlpha) - Math.log(leftAlpha);

    // Coherence matrix (simplified)
    const numChannels = signal.channelData.length;
    const coherenceMatrix = Array(numChannels).fill(null).map(() =>
      Array(numChannels).fill(0).map(() => 0.3 + Math.random() * 0.4)
    );

    // ERP components (simulated detection)
    const eventRelatedPotentials: ERPComponent[] = [
      { name: 'P100', latency: 100, amplitude: 2 + Math.random() * 2, detected: Math.random() > 0.2 },
      { name: 'N170', latency: 170, amplitude: -3 + Math.random() * 2, detected: Math.random() > 0.3 },
      { name: 'P300', latency: 300 + Math.random() * 100, amplitude: 5 + Math.random() * 3, detected: Math.random() > 0.1 },
    ];

    return {
      alertness,
      cognitiveLoad,
      stress,
      fatigue,
      bandPowers: avgBandPowers,
      asymmetryIndex,
      coherenceMatrix,
      eventRelatedPotentials,
      ccceMetrics: {
        lambda: 1 - fatigue * 0.3,
        phi: this.ccceState.phi,
        gamma: stress * 0.3 + GAMMA_FIXED,
        xi: 0,
        timestamp: Date.now(),
      },
    };
  }

  private computeBandPowers(data: Float64Array, sampleRate: number): BandPowers {
    // Simplified band power computation using windowed FFT
    const n = data.length;

    // Compute power spectral density (simplified)
    const psd: number[] = [];
    const freqResolution = sampleRate / n;

    for (let f = 0; f < sampleRate / 2; f += freqResolution) {
      let power = 0;
      for (let i = 0; i < n; i++) {
        power += data[i] * Math.cos(2 * Math.PI * f * i / sampleRate);
      }
      psd.push(Math.pow(power / n, 2));
    }

    // Integrate power in each band
    const getBandPower = (fLow: number, fHigh: number): number => {
      let power = 0;
      for (let i = Math.floor(fLow / freqResolution); i < Math.ceil(fHigh / freqResolution) && i < psd.length; i++) {
        power += psd[i] * freqResolution;
      }
      return power * 1e12;  // Scale to μV²
    };

    return {
      delta: getBandPower(PHYSIO_CONSTANTS.DELTA_BAND[0], PHYSIO_CONSTANTS.DELTA_BAND[1]),
      theta: getBandPower(PHYSIO_CONSTANTS.THETA_BAND[0], PHYSIO_CONSTANTS.THETA_BAND[1]),
      alpha: getBandPower(PHYSIO_CONSTANTS.ALPHA_BAND[0], PHYSIO_CONSTANTS.ALPHA_BAND[1]),
      beta: getBandPower(PHYSIO_CONSTANTS.BETA_BAND[0], PHYSIO_CONSTANTS.BETA_BAND[1]),
      gamma: getBandPower(PHYSIO_CONSTANTS.GAMMA_BAND_NEURAL[0], PHYSIO_CONSTANTS.GAMMA_BAND_NEURAL[1]),
    };
  }

  // ==========================================================================
  // Combat Readiness Assessment
  // ==========================================================================

  /**
   * Assess combat readiness
   */
  assessCombatReadiness(
    subjectId: string,
    cardiacState: CardiacState,
    neuralState: NeuralState
  ): CombatReadiness {
    // Get or create subject
    let subject = this.subjects.get(subjectId);
    if (!subject) {
      subject = {
        id: subjectId,
        baseline: {
          restingHeartRate: 70,
          hrvBaseline: 50,
          alphaPowerBaseline: 10,
          reactionTimeBaseline: 250,
          calibrationDate: Date.now(),
        },
        measurements: [],
        currentState: null,
      };
      this.subjects.set(subjectId, subject);
    }

    // Cardiac readiness (0-100)
    const hrDeviation = Math.abs(cardiacState.heartRate - subject.baseline.restingHeartRate) / subject.baseline.restingHeartRate;
    const hrvRatio = cardiacState.heartRateVariability.rmssd / subject.baseline.hrvBaseline;
    const cardiacReadiness = Math.max(0, Math.min(100,
      100 * (1 - hrDeviation * 0.5) * Math.min(1.2, hrvRatio)
    ));

    // Neural readiness (0-100)
    const neuralReadiness = Math.max(0, Math.min(100,
      100 * neuralState.alertness * (1 - neuralState.fatigue) * (1 - neuralState.stress * 0.5)
    ));

    // Fatigue level (0-100)
    const fatigueLevel = Math.min(100, neuralState.fatigue * 100 +
                                       (1 - hrvRatio) * 20);

    // Stress level (0-100)
    const stressLevel = Math.min(100, neuralState.stress * 70 +
                                      cardiacState.cardiacStress * 30);

    // Alertness (0-100)
    const alertness = neuralState.alertness * 100;

    // Overall score
    const overallScore = (cardiacReadiness + neuralReadiness) / 2 *
                        (1 - fatigueLevel / 200) *
                        (1 - stressLevel / 300);

    // Generate recommendations
    const recommendations: string[] = [];
    if (fatigueLevel > 50) recommendations.push('Rest recommended before engagement');
    if (stressLevel > 70) recommendations.push('Stress management intervention advised');
    if (cardiacReadiness < 60) recommendations.push('Cardiac conditioning needed');
    if (neuralReadiness < 60) recommendations.push('Cognitive preparation recommended');
    if (cardiacState.arrhythmiaDetected) recommendations.push(`Arrhythmia detected: ${cardiacState.arrhythmiaDetected}`);

    const readiness: CombatReadiness = {
      subjectId,
      timestamp: Date.now(),
      overallScore,
      cardiacReadiness,
      neuralReadiness,
      fatigueLevel,
      stressLevel,
      alertness,
      recommendations,
      ccceMetrics: {
        lambda: overallScore / 100,
        phi: this.ccceState.phi,
        gamma: (fatigueLevel + stressLevel) / 200 * 0.5 + GAMMA_FIXED,
        xi: 0,
        timestamp: Date.now(),
      },
    };

    readiness.ccceMetrics.xi = (readiness.ccceMetrics.lambda * readiness.ccceMetrics.phi) /
                              Math.max(readiness.ccceMetrics.gamma, 0.001);

    subject.currentState = readiness;
    return readiness;
  }

  // ==========================================================================
  // Signal Quality Assessment
  // ==========================================================================

  /**
   * Assess signal quality for all channels
   */
  assessSignalQuality(signal: PhysiologicalSignal): SignalQuality[] {
    const qualities: SignalQuality[] = [];

    for (let ch = 0; ch < signal.channelData.length; ch++) {
      const data = signal.channelData[ch];

      // SNR estimation
      const signalPower = data.reduce((sum, v) => sum + v * v, 0) / data.length;
      const noisePower = this.estimateNoisePower(data);
      const snr = 10 * Math.log10(signalPower / Math.max(noisePower, 1e-30));

      // Artifact detection
      const maxVal = Math.max(...Array.from(data).map(Math.abs));
      const saturation = maxVal > 0.99e-9;
      const motionArtifact = this.detectMotionArtifact(data, signal.sampleRate);
      const artifactLevel = (saturation ? 0.3 : 0) + (motionArtifact ? 0.3 : 0) +
                           Math.random() * 0.2;

      // Quality score
      const qualityScore = Math.max(0, Math.min(100,
        snr * 2 - artifactLevel * 50
      ));

      qualities.push({
        channelId: `CH${ch}`,
        snr,
        artifactLevel,
        saturation,
        motionArtifact,
        environmentalNoise: noisePower,
        qualityScore,
      });
    }

    return qualities;
  }

  private estimateNoisePower(data: Float64Array): number {
    // Median absolute deviation method
    const sorted = Array.from(data).sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const mad = sorted.map(v => Math.abs(v - median)).sort((a, b) => a - b)[Math.floor(sorted.length / 2)];
    return Math.pow(mad * 1.4826, 2);  // Scale factor for Gaussian
  }

  private detectMotionArtifact(data: Float64Array, sampleRate: number): boolean {
    // Check for low-frequency high-amplitude components
    let lowFreqPower = 0;
    const windowSize = Math.floor(sampleRate * 0.5);

    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const windowMean = data.slice(i, i + windowSize).reduce((a, b) => a + b, 0) / windowSize;
      lowFreqPower += windowMean * windowMean;
    }

    const totalPower = data.reduce((sum, v) => sum + v * v, 0) / data.length;
    return lowFreqPower / totalPower > 0.3;
  }

  // ==========================================================================
  // CCCE Integration
  // ==========================================================================

  /**
   * Get current CCCE metrics
   */
  getMetrics(): CCCEMetrics {
    return { ...this.ccceState };
  }

  /**
   * Apply phase-conjugate healing
   */
  heal(): CCCEMetrics {
    if (this.ccceState.gamma > 0.3) {
      this.ccceState.gamma *= (1 - CHI_PC);
      this.ccceState.lambda = Math.min(1, this.ccceState.lambda * (1 + CHI_PC * 0.5));
      this.updateXi();
    }
    return this.getMetrics();
  }

  /**
   * Get all sensor arrays
   */
  getArrays(): SensorArray[] {
    return Array.from(this.arrays.values());
  }

  /**
   * Get array by ID
   */
  getArray(id: string): SensorArray | undefined {
    return this.arrays.get(id);
  }

  /**
   * Get all subjects
   */
  getSubjects(): Subject[] {
    return Array.from(this.subjects.values());
  }

  /**
   * Get subject by ID
   */
  getSubject(id: string): Subject | undefined {
    return this.subjects.get(id);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const combatPhysioEngine = new CombatPhysioEngine();
