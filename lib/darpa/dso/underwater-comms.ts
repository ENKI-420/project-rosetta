/**
 * DARPA DSO Topic 7: Enhancing Underwater Communication and Detection
 * Solicitation: DARPA-RA-25-02-07
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Acoustic underwater communication
 * - Optical underwater links
 * - Magnetic anomaly detection
 * - Multi-path channel modeling
 * - CCCE-guided signal coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Underwater Physics Constants
// ============================================================================

export const UNDERWATER_CONSTANTS = {
  // Sound in seawater
  SOUND_SPEED_SURFACE: 1500,          // m/s at surface
  SOUND_SPEED_GRADIENT: 0.017,        // m/s per meter depth
  ABSORPTION_COEFF_1KHZ: 0.06,        // dB/km at 1 kHz
  ABSORPTION_COEFF_10KHZ: 1.0,        // dB/km at 10 kHz

  // Seawater properties
  SEAWATER_DENSITY: 1025,             // kg/m³
  SEAWATER_SALINITY: 35,              // ppt
  SEAWATER_CONDUCTIVITY: 4.8,         // S/m

  // Optical properties
  BLUE_ATTENUATION: 0.02,             // m⁻¹ (clearest water)
  GREEN_ATTENUATION: 0.04,            // m⁻¹
  RED_ATTENUATION: 0.6,               // m⁻¹
  SCATTERING_COEFF: 0.005,            // m⁻¹

  // Magnetic detection
  EARTH_MAGNETIC_FIELD: 50e-6,        // T (typical)
  MAGNETIC_NOISE_FLOOR: 1e-12,        // T/√Hz

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_SIGNAL: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface UnderwaterChannel {
  id: string;
  type: 'acoustic' | 'optical' | 'magnetic' | 'hybrid';
  transmitter: TransmitterConfig;
  receiver: ReceiverConfig;
  environment: OceanEnvironment;
  propagation: PropagationModel;
  ccceMetrics: CCCEMetrics;
}

export interface TransmitterConfig {
  id: string;
  type: 'acoustic' | 'optical' | 'magnetic';
  position: Position3D;
  power: number;                      // W
  frequency: number;                  // Hz (acoustic) or nm⁻¹ (optical)
  bandwidth: number;                  // Hz
  beamwidth: number;                  // degrees
  efficiency: number;                 // 0-1
  modulation: ModulationType;
}

export interface ReceiverConfig {
  id: string;
  type: 'hydrophone' | 'photodetector' | 'magnetometer';
  position: Position3D;
  sensitivity: number;                // V/Pa or V/W or V/T
  bandwidth: number;                  // Hz
  noiseFloor: number;                 // equivalent input noise
  directivity: number;                // dB
  dynamicRange: number;               // dB
}

export interface Position3D {
  x: number;                          // m (East)
  y: number;                          // m (North)
  z: number;                          // m (depth, positive down)
}

export interface ModulationType {
  scheme: 'BPSK' | 'QPSK' | 'FSK' | 'OFDM' | 'OOK' | 'PPM';
  symbolRate: number;                 // symbols/s
  codingRate: number;                 // 0-1
  spreadingFactor?: number;           // For spread spectrum
}

export interface OceanEnvironment {
  depth: number;                      // m (water column depth)
  temperature: TemperatureProfile;
  salinity: SalinityProfile;
  current: CurrentProfile;
  seaState: number;                   // 0-9 Douglas scale
  sedimentType: 'sand' | 'mud' | 'rock' | 'coral';
  turbidity: number;                  // NTU
}

export interface TemperatureProfile {
  surface: number;                    // °C
  thermoclineDepth: number;           // m
  thermoclineGradient: number;        // °C/m
  bottomTemperature: number;          // °C
}

export interface SalinityProfile {
  surface: number;                    // ppt
  haloclineDepth: number;             // m
  bottomSalinity: number;             // ppt
}

export interface CurrentProfile {
  surface: { speed: number; direction: number };  // m/s, degrees
  mid: { speed: number; direction: number };
  bottom: { speed: number; direction: number };
}

export interface PropagationModel {
  type: 'ray-tracing' | 'parabolic-equation' | 'normal-mode' | 'empirical';
  transmissionLoss: number;           // dB
  multipath: MultipathComponent[];
  doppler: DopplerEffect;
  coherenceTime: number;              // s
  coherenceBandwidth: number;         // Hz
}

export interface MultipathComponent {
  delay: number;                      // s
  amplitude: number;                  // relative to direct path
  phase: number;                      // radians
  dopplerShift: number;               // Hz
  arrivalAngle: { elevation: number; azimuth: number };
}

export interface DopplerEffect {
  relativeVelocity: number;           // m/s
  dopplerSpread: number;              // Hz
  maxDopplerShift: number;            // Hz
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface AcousticSignal {
  channelId: string;
  waveform: Float64Array;
  sampleRate: number;                 // Hz
  duration: number;                   // s
  frequency: number;                  // Center frequency Hz
  bandwidth: number;                  // Hz
  snr: number;                        // dB
  ber: number;                        // Bit error rate
}

export interface OpticalSignal {
  channelId: string;
  power: number[];                    // W over time
  sampleRate: number;                 // Hz
  wavelength: number;                 // nm
  attenuatedPower: number;            // W at receiver
  snr: number;                        // dB
  ber: number;
}

export interface MagneticAnomaly {
  id: string;
  position: Position3D;
  fieldVector: { Bx: number; By: number; Bz: number };  // T
  magnitude: number;                  // T
  gradient: { dBx: number; dBy: number; dBz: number };  // T/m
  signatureType: 'ferrous' | 'induced' | 'remnant' | 'eddy';
  estimatedMass: number;              // kg
  confidence: number;                 // 0-1
}

export interface DetectionResult {
  channelId: string;
  detected: boolean;
  snr: number;                        // dB
  position?: Position3D;
  velocity?: { vx: number; vy: number; vz: number };
  classification?: string;
  confidence: number;
  ccceMetrics: CCCEMetrics;
}

export interface CommunicationResult {
  channelId: string;
  bitRate: number;                    // bps
  ber: number;                        // Bit error rate
  throughput: number;                 // effective bps
  latency: number;                    // s
  packetLoss: number;                 // fraction
  linkMargin: number;                 // dB
  ccceMetrics: CCCEMetrics;
}

export interface SonarImage {
  channelId: string;
  type: 'side-scan' | 'synthetic-aperture' | 'multibeam';
  resolution: { azimuth: number; range: number };  // m
  swathWidth: number;                 // m
  data: Float32Array[];               // 2D image data
  targets: DetectedTarget[];
}

export interface DetectedTarget {
  position: Position3D;
  dimensions: { length: number; width: number; height: number };
  classification: string;
  confidence: number;
  acousticHighlight: number;          // dB above background
}

// ============================================================================
// Underwater Communication Engine
// ============================================================================

export class UnderwaterCommsEngine {
  private channels: Map<string, UnderwaterChannel> = new Map();
  private anomalies: Map<string, MagneticAnomaly> = new Map();
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
  // Channel Creation
  // ==========================================================================

  /**
   * Create acoustic underwater channel
   */
  createAcousticChannel(
    txPosition: Position3D,
    rxPosition: Position3D,
    frequency: number,           // Hz
    power: number,               // W
    environment: Partial<OceanEnvironment> = {}
  ): UnderwaterChannel {
    const id = `ACOUSTIC-${Date.now().toString(36)}`;

    const fullEnv: OceanEnvironment = {
      depth: environment.depth ?? 100,
      temperature: environment.temperature ?? {
        surface: 25,
        thermoclineDepth: 50,
        thermoclineGradient: -0.1,
        bottomTemperature: 10,
      },
      salinity: environment.salinity ?? {
        surface: 35,
        haloclineDepth: 30,
        bottomSalinity: 35,
      },
      current: environment.current ?? {
        surface: { speed: 0.5, direction: 90 },
        mid: { speed: 0.2, direction: 90 },
        bottom: { speed: 0.1, direction: 90 },
      },
      seaState: environment.seaState ?? 3,
      sedimentType: environment.sedimentType ?? 'sand',
      turbidity: environment.turbidity ?? 1,
    };

    const transmitter: TransmitterConfig = {
      id: `TX-${id}`,
      type: 'acoustic',
      position: txPosition,
      power,
      frequency,
      bandwidth: frequency * 0.1,  // 10% bandwidth
      beamwidth: 30,
      efficiency: 0.5,
      modulation: {
        scheme: 'OFDM',
        symbolRate: 1000,
        codingRate: 0.5,
      },
    };

    const receiver: ReceiverConfig = {
      id: `RX-${id}`,
      type: 'hydrophone',
      position: rxPosition,
      sensitivity: -180,  // dB re 1V/μPa
      bandwidth: frequency * 0.2,
      noiseFloor: 1e-6,
      directivity: 20,
      dynamicRange: 80,
    };

    // Compute propagation model
    const propagation = this.computeAcousticPropagation(
      txPosition, rxPosition, frequency, fullEnv
    );

    const channel: UnderwaterChannel = {
      id,
      type: 'acoustic',
      transmitter,
      receiver,
      environment: fullEnv,
      propagation,
      ccceMetrics: { ...this.ccceState },
    };

    this.channels.set(id, channel);
    return channel;
  }

  /**
   * Create optical underwater channel
   */
  createOpticalChannel(
    txPosition: Position3D,
    rxPosition: Position3D,
    wavelength: number,          // nm
    power: number,               // W
    environment: Partial<OceanEnvironment> = {}
  ): UnderwaterChannel {
    const id = `OPTICAL-${Date.now().toString(36)}`;

    const fullEnv: OceanEnvironment = {
      depth: environment.depth ?? 50,
      temperature: environment.temperature ?? {
        surface: 25,
        thermoclineDepth: 30,
        thermoclineGradient: -0.1,
        bottomTemperature: 15,
      },
      salinity: environment.salinity ?? {
        surface: 35,
        haloclineDepth: 20,
        bottomSalinity: 35,
      },
      current: environment.current ?? {
        surface: { speed: 0.3, direction: 0 },
        mid: { speed: 0.1, direction: 0 },
        bottom: { speed: 0.05, direction: 0 },
      },
      seaState: environment.seaState ?? 2,
      sedimentType: environment.sedimentType ?? 'sand',
      turbidity: environment.turbidity ?? 0.5,
    };

    const transmitter: TransmitterConfig = {
      id: `TX-${id}`,
      type: 'optical',
      position: txPosition,
      power,
      frequency: 3e8 / (wavelength * 1e-9),  // Convert to Hz
      bandwidth: 1e9,  // 1 GHz
      beamwidth: 10,
      efficiency: 0.3,
      modulation: {
        scheme: 'OOK',
        symbolRate: 1e6,
        codingRate: 0.75,
      },
    };

    const receiver: ReceiverConfig = {
      id: `RX-${id}`,
      type: 'photodetector',
      position: rxPosition,
      sensitivity: 0.5,  // A/W
      bandwidth: 1e9,
      noiseFloor: 1e-12,
      directivity: 10,
      dynamicRange: 60,
    };

    // Compute propagation model
    const propagation = this.computeOpticalPropagation(
      txPosition, rxPosition, wavelength, fullEnv
    );

    const channel: UnderwaterChannel = {
      id,
      type: 'optical',
      transmitter,
      receiver,
      environment: fullEnv,
      propagation,
      ccceMetrics: { ...this.ccceState },
    };

    this.channels.set(id, channel);
    return channel;
  }

  // ==========================================================================
  // Propagation Models
  // ==========================================================================

  /**
   * Compute acoustic propagation using ray-tracing approximation
   */
  private computeAcousticPropagation(
    tx: Position3D,
    rx: Position3D,
    frequency: number,
    env: OceanEnvironment
  ): PropagationModel {
    const distance = Math.sqrt(
      Math.pow(rx.x - tx.x, 2) +
      Math.pow(rx.y - tx.y, 2) +
      Math.pow(rx.z - tx.z, 2)
    );

    // Sound speed profile
    const soundSpeed = this.computeSoundSpeed(tx.z, env);

    // Transmission loss: spreading + absorption
    const spreadingLoss = 20 * Math.log10(distance);  // Cylindrical spreading
    const absorptionLoss = this.computeAbsorption(frequency) * distance / 1000;  // dB
    const transmissionLoss = spreadingLoss + absorptionLoss;

    // Multipath components
    const multipath = this.computeMultipath(tx, rx, env, frequency);

    // Doppler from motion and currents
    const doppler = this.computeDoppler(tx, rx, env, frequency);

    // Coherence parameters
    const coherenceTime = 1 / doppler.dopplerSpread;
    const coherenceBandwidth = 1 / (2 * Math.max(...multipath.map(m => m.delay)));

    return {
      type: 'ray-tracing',
      transmissionLoss,
      multipath,
      doppler,
      coherenceTime,
      coherenceBandwidth,
    };
  }

  private computeSoundSpeed(depth: number, env: OceanEnvironment): number {
    // Mackenzie equation (simplified)
    const T = depth < env.temperature.thermoclineDepth
      ? env.temperature.surface
      : env.temperature.surface + env.temperature.thermoclineGradient * (depth - env.temperature.thermoclineDepth);
    const S = env.salinity.surface;
    const D = depth;

    return 1449.2 + 4.6 * T - 0.055 * T * T + 0.00029 * T * T * T +
           (1.34 - 0.01 * T) * (S - 35) + 0.016 * D;
  }

  private computeAbsorption(frequency: number): number {
    // Francois-Garrison formula (simplified)
    const f_kHz = frequency / 1000;

    // Boric acid contribution
    const alpha1 = 0.106 * f_kHz * f_kHz / (1 + f_kHz * f_kHz);

    // Magnesium sulfate contribution
    const alpha2 = 0.52 * (1 + 0.025) * f_kHz * f_kHz / (4100 + f_kHz * f_kHz);

    // Pure water contribution
    const alpha3 = 0.00049 * f_kHz * f_kHz;

    return alpha1 + alpha2 + alpha3;  // dB/km
  }

  private computeMultipath(
    tx: Position3D,
    rx: Position3D,
    env: OceanEnvironment,
    frequency: number
  ): MultipathComponent[] {
    const multipath: MultipathComponent[] = [];
    const c = this.computeSoundSpeed((tx.z + rx.z) / 2, env);

    // Direct path
    const directDistance = Math.sqrt(
      Math.pow(rx.x - tx.x, 2) +
      Math.pow(rx.y - tx.y, 2) +
      Math.pow(rx.z - tx.z, 2)
    );
    const directDelay = directDistance / c;

    multipath.push({
      delay: directDelay,
      amplitude: 1.0,
      phase: 0,
      dopplerShift: 0,
      arrivalAngle: { elevation: 0, azimuth: 0 },
    });

    // Surface reflection
    const surfacePathLength = Math.sqrt(
      Math.pow(rx.x - tx.x, 2) +
      Math.pow(rx.y - tx.y, 2) +
      Math.pow(rx.z + tx.z, 2)  // Image source above surface
    );
    const surfaceDelay = surfacePathLength / c;
    const surfaceReflectionCoeff = -0.9;  // Phase reversal

    multipath.push({
      delay: surfaceDelay,
      amplitude: Math.abs(surfaceReflectionCoeff),
      phase: surfaceReflectionCoeff < 0 ? Math.PI : 0,
      dopplerShift: 0.1,
      arrivalAngle: { elevation: -10, azimuth: 0 },
    });

    // Bottom reflection
    const bottomPathLength = Math.sqrt(
      Math.pow(rx.x - tx.x, 2) +
      Math.pow(rx.y - tx.y, 2) +
      Math.pow(2 * env.depth - rx.z - tx.z, 2)
    );
    const bottomDelay = bottomPathLength / c;
    const bottomReflectionCoeff = this.computeBottomReflection(env.sedimentType, frequency);

    multipath.push({
      delay: bottomDelay,
      amplitude: Math.abs(bottomReflectionCoeff),
      phase: bottomReflectionCoeff < 0 ? Math.PI : 0,
      dopplerShift: 0,
      arrivalAngle: { elevation: 10, azimuth: 0 },
    });

    return multipath;
  }

  private computeBottomReflection(sediment: string, frequency: number): number {
    // Rayleigh reflection coefficient (simplified)
    const impedanceRatios: Record<string, number> = {
      sand: 1.95,
      mud: 1.35,
      rock: 2.5,
      coral: 2.2,
    };

    const Z_ratio = impedanceRatios[sediment] || 1.5;
    const R = (Z_ratio - 1) / (Z_ratio + 1);

    // Frequency-dependent loss
    return R * Math.exp(-frequency / 50000);
  }

  private computeDoppler(
    tx: Position3D,
    rx: Position3D,
    env: OceanEnvironment,
    frequency: number
  ): DopplerEffect {
    const c = this.computeSoundSpeed((tx.z + rx.z) / 2, env);

    // Relative velocity from currents (simplified)
    const currentSpeed = env.current.mid.speed;
    const relativeVelocity = currentSpeed * 0.5;  // Assume partial alignment

    const maxDopplerShift = relativeVelocity * frequency / c;
    const dopplerSpread = maxDopplerShift * 0.2;  // Due to multipath

    return {
      relativeVelocity,
      dopplerSpread,
      maxDopplerShift,
    };
  }

  /**
   * Compute optical propagation
   */
  private computeOpticalPropagation(
    tx: Position3D,
    rx: Position3D,
    wavelength: number,
    env: OceanEnvironment
  ): PropagationModel {
    const distance = Math.sqrt(
      Math.pow(rx.x - tx.x, 2) +
      Math.pow(rx.y - tx.y, 2) +
      Math.pow(rx.z - tx.z, 2)
    );

    // Attenuation coefficient based on wavelength
    let attenuation: number;
    if (wavelength < 500) {
      attenuation = UNDERWATER_CONSTANTS.BLUE_ATTENUATION * (1 + env.turbidity);
    } else if (wavelength < 550) {
      attenuation = UNDERWATER_CONSTANTS.GREEN_ATTENUATION * (1 + env.turbidity);
    } else {
      attenuation = UNDERWATER_CONSTANTS.RED_ATTENUATION * (1 + env.turbidity);
    }

    // Beer-Lambert law
    const transmissionLoss = 4.343 * attenuation * distance;  // dB

    // Scattering effects
    const scatteringLoss = UNDERWATER_CONSTANTS.SCATTERING_COEFF * distance * env.turbidity;

    return {
      type: 'empirical',
      transmissionLoss: transmissionLoss + scatteringLoss * 4.343,
      multipath: [{ delay: distance / 2.25e8, amplitude: 1, phase: 0, dopplerShift: 0, arrivalAngle: { elevation: 0, azimuth: 0 } }],
      doppler: { relativeVelocity: 0, dopplerSpread: 0, maxDopplerShift: 0 },
      coherenceTime: 1e-3,  // Limited by turbulence
      coherenceBandwidth: 1e9,  // Wideband optical
    };
  }

  // ==========================================================================
  // Communication Simulation
  // ==========================================================================

  /**
   * Simulate acoustic communication
   */
  simulateAcousticComm(
    channelId: string,
    dataRate: number,            // bps
    duration: number             // s
  ): CommunicationResult {
    const channel = this.channels.get(channelId);
    if (!channel || channel.type !== 'acoustic') {
      throw new Error(`Acoustic channel ${channelId} not found`);
    }

    const { transmitter, receiver, propagation, environment } = channel;

    // Source level
    const sourceLevel = 170.8 + 10 * Math.log10(transmitter.power * transmitter.efficiency);

    // Noise level (ambient + thermal)
    const ambientNoise = 50 + 20 * Math.log10(1 + environment.seaState);  // dB re 1μPa
    const noiseLevel = ambientNoise + 10 * Math.log10(transmitter.bandwidth);

    // SNR calculation
    const signalLevel = sourceLevel - propagation.transmissionLoss;
    const snr = signalLevel - noiseLevel + receiver.directivity;

    // BER estimation (BPSK/QPSK approximation)
    const ebN0 = snr - 10 * Math.log10(dataRate / transmitter.bandwidth);
    const ber = 0.5 * this.erfc(Math.sqrt(Math.pow(10, ebN0 / 10)));

    // Throughput accounting for errors and coding
    const effectiveRate = dataRate * transmitter.modulation.codingRate * (1 - ber);

    // Latency from propagation
    const latency = propagation.multipath[0].delay;

    // Packet loss from fading
    const packetLoss = Math.min(0.5, ber * 100);

    // Link margin
    const linkMargin = snr - 10;  // 10 dB required SNR

    // Update CCCE based on communication quality
    const commCoherence = Math.max(0.5, 1 - packetLoss);
    channel.ccceMetrics.lambda = commCoherence;
    channel.ccceMetrics.gamma = Math.min(1, ber * 10 + GAMMA_FIXED);
    channel.ccceMetrics.xi = (channel.ccceMetrics.lambda * channel.ccceMetrics.phi) /
                            Math.max(channel.ccceMetrics.gamma, 0.001);

    return {
      channelId,
      bitRate: dataRate,
      ber,
      throughput: effectiveRate,
      latency,
      packetLoss,
      linkMargin,
      ccceMetrics: { ...channel.ccceMetrics },
    };
  }

  /**
   * Simulate optical communication
   */
  simulateOpticalComm(
    channelId: string,
    dataRate: number,            // bps
    duration: number             // s
  ): CommunicationResult {
    const channel = this.channels.get(channelId);
    if (!channel || channel.type !== 'optical') {
      throw new Error(`Optical channel ${channelId} not found`);
    }

    const { transmitter, receiver, propagation } = channel;

    // Received power
    const txPower_dBm = 10 * Math.log10(transmitter.power * 1000);
    const rxPower_dBm = txPower_dBm - propagation.transmissionLoss;
    const rxPower = Math.pow(10, rxPower_dBm / 10) / 1000;

    // Noise (shot + thermal)
    const shotNoise = Math.sqrt(2 * 1.6e-19 * receiver.sensitivity * rxPower * receiver.bandwidth);
    const thermalNoise = receiver.noiseFloor;
    const totalNoise = Math.sqrt(shotNoise * shotNoise + thermalNoise * thermalNoise);

    // SNR
    const signalCurrent = receiver.sensitivity * rxPower;
    const snr = 20 * Math.log10(signalCurrent / totalNoise);

    // BER for OOK
    const ber = 0.5 * this.erfc(Math.sqrt(Math.pow(10, snr / 20) / 2));

    // Throughput
    const effectiveRate = dataRate * transmitter.modulation.codingRate * (1 - Math.min(ber, 0.5));

    // Latency (speed of light in water)
    const distance = Math.sqrt(
      Math.pow(receiver.position.x - transmitter.position.x, 2) +
      Math.pow(receiver.position.y - transmitter.position.y, 2) +
      Math.pow(receiver.position.z - transmitter.position.z, 2)
    );
    const latency = distance / 2.25e8;

    // Packet loss
    const packetLoss = Math.min(0.5, ber * 50);

    // Link margin
    const linkMargin = snr - 15;  // 15 dB required for OOK

    // Update CCCE
    channel.ccceMetrics.lambda = Math.max(0.5, 1 - packetLoss);
    channel.ccceMetrics.gamma = Math.min(1, ber * 5 + GAMMA_FIXED);
    channel.ccceMetrics.xi = (channel.ccceMetrics.lambda * channel.ccceMetrics.phi) /
                            Math.max(channel.ccceMetrics.gamma, 0.001);

    return {
      channelId,
      bitRate: dataRate,
      ber,
      throughput: effectiveRate,
      latency,
      packetLoss,
      linkMargin,
      ccceMetrics: { ...channel.ccceMetrics },
    };
  }

  // Complementary error function
  private erfc(x: number): number {
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau = t * Math.exp(-x * x - 1.26551223 +
                             t * (1.00002368 +
                             t * (0.37409196 +
                             t * (0.09678418 +
                             t * (-0.18628806 +
                             t * (0.27886807 +
                             t * (-1.13520398 +
                             t * (1.48851587 +
                             t * (-0.82215223 +
                             t * 0.17087277)))))))));
    return x >= 0 ? tau : 2 - tau;
  }

  // ==========================================================================
  // Detection
  // ==========================================================================

  /**
   * Detect magnetic anomaly
   */
  detectMagneticAnomaly(
    sensorPosition: Position3D,
    sensorSensitivity: number,   // T/√Hz
    measurementTime: number      // s
  ): MagneticAnomaly[] {
    const detectedAnomalies: MagneticAnomaly[] = [];

    // Simulate detection of ferrous objects
    const numTargets = Math.floor(Math.random() * 3);

    for (let i = 0; i < numTargets; i++) {
      const targetPos: Position3D = {
        x: sensorPosition.x + (Math.random() - 0.5) * 200,
        y: sensorPosition.y + (Math.random() - 0.5) * 200,
        z: sensorPosition.z + Math.random() * 50,
      };

      const distance = Math.sqrt(
        Math.pow(targetPos.x - sensorPosition.x, 2) +
        Math.pow(targetPos.y - sensorPosition.y, 2) +
        Math.pow(targetPos.z - sensorPosition.z, 2)
      );

      // Dipole magnetic field
      const moment = 1e3 + Math.random() * 1e4;  // A·m²
      const mu0 = 4 * Math.PI * 1e-7;
      const fieldMagnitude = mu0 * moment / (4 * Math.PI * Math.pow(distance, 3));

      // Detection threshold
      const noiseLevel = sensorSensitivity * Math.sqrt(1 / measurementTime);

      if (fieldMagnitude > 3 * noiseLevel) {
        // Direction to target
        const dx = targetPos.x - sensorPosition.x;
        const dy = targetPos.y - sensorPosition.y;
        const dz = targetPos.z - sensorPosition.z;
        const norm = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const anomaly: MagneticAnomaly = {
          id: `MAG-${Date.now().toString(36)}-${i}`,
          position: targetPos,
          fieldVector: {
            Bx: fieldMagnitude * dx / norm,
            By: fieldMagnitude * dy / norm,
            Bz: fieldMagnitude * dz / norm,
          },
          magnitude: fieldMagnitude,
          gradient: {
            dBx: -3 * fieldMagnitude * dx / (norm * norm),
            dBy: -3 * fieldMagnitude * dy / (norm * norm),
            dBz: -3 * fieldMagnitude * dz / (norm * norm),
          },
          signatureType: 'ferrous',
          estimatedMass: moment / 1e3,  // Rough estimate
          confidence: Math.min(0.99, fieldMagnitude / (10 * noiseLevel)),
        };

        detectedAnomalies.push(anomaly);
        this.anomalies.set(anomaly.id, anomaly);
      }
    }

    return detectedAnomalies;
  }

  /**
   * Active sonar detection
   */
  detectActiveSonar(
    channelId: string,
    pulseLength: number,         // s
    bandwidth: number            // Hz
  ): DetectionResult[] {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }

    const results: DetectionResult[] = [];

    // Simulate target detection
    const numTargets = Math.floor(Math.random() * 2);

    for (let i = 0; i < numTargets; i++) {
      const targetDistance = 100 + Math.random() * 2000;  // m
      const targetStrength = -10 - Math.random() * 20;     // dB

      // Sonar equation
      const sourceLevel = 170.8 + 10 * Math.log10(channel.transmitter.power);
      const transmissionLoss = channel.propagation.transmissionLoss * (targetDistance / 1000);
      const noiseLevel = 50 + 10 * Math.log10(bandwidth);

      const echoLevel = sourceLevel - 2 * transmissionLoss + targetStrength;
      const snr = echoLevel - noiseLevel;

      const detected = snr > 10;  // 10 dB detection threshold

      if (detected) {
        const bearing = Math.random() * 360;
        const radBearing = bearing * Math.PI / 180;

        results.push({
          channelId,
          detected: true,
          snr,
          position: {
            x: channel.transmitter.position.x + targetDistance * Math.sin(radBearing),
            y: channel.transmitter.position.y + targetDistance * Math.cos(radBearing),
            z: channel.transmitter.position.z + (Math.random() - 0.5) * 20,
          },
          velocity: {
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            vz: (Math.random() - 0.5) * 1,
          },
          classification: Math.random() > 0.5 ? 'submarine' : 'surface-vessel',
          confidence: Math.min(0.95, snr / 30),
          ccceMetrics: { ...channel.ccceMetrics },
        });
      }
    }

    // Update CCCE based on detection performance
    const avgSNR = results.length > 0
      ? results.reduce((sum, r) => sum + r.snr, 0) / results.length
      : 0;
    channel.ccceMetrics.lambda = Math.max(0.5, avgSNR / 50);
    channel.ccceMetrics.xi = (channel.ccceMetrics.lambda * channel.ccceMetrics.phi) /
                            Math.max(channel.ccceMetrics.gamma, 0.001);

    return results;
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

    // Heal all channels
    for (const channel of this.channels.values()) {
      if (channel.ccceMetrics.gamma > 0.3) {
        channel.ccceMetrics.gamma *= (1 - CHI_PC);
        channel.ccceMetrics.lambda = Math.min(1, channel.ccceMetrics.lambda * (1 + CHI_PC * 0.5));
        channel.ccceMetrics.xi = (channel.ccceMetrics.lambda * channel.ccceMetrics.phi) /
                                Math.max(channel.ccceMetrics.gamma, 0.001);
      }
    }

    return this.getMetrics();
  }

  /**
   * Get all channels
   */
  getChannels(): UnderwaterChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Get channel by ID
   */
  getChannel(id: string): UnderwaterChannel | undefined {
    return this.channels.get(id);
  }

  /**
   * Get all detected anomalies
   */
  getAnomalies(): MagneticAnomaly[] {
    return Array.from(this.anomalies.values());
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const underwaterEngine = new UnderwaterCommsEngine();
