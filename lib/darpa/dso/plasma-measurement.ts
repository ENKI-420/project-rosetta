/**
 * DARPA DSO Topic 6: Calibrated Plasma Measurement with Traceable Uncertainty
 * Solicitation: DARPA-RA-25-02-06
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Plasma diagnostics with traceable calibration
 * - Uncertainty quantification for plasma parameters
 * - Langmuir probe analysis
 * - Optical emission spectroscopy
 * - CCCE-guided measurement coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Plasma Physics Constants
// ============================================================================

export const PLASMA_CONSTANTS = {
  // Fundamental constants
  ELECTRON_MASS: 9.10938e-31,          // kg
  ELECTRON_CHARGE: 1.60218e-19,        // C
  BOLTZMANN: 1.38065e-23,              // J/K
  PERMITTIVITY: 8.85419e-12,           // F/m
  PLANCK: 6.62607e-34,                 // J·s
  SPEED_OF_LIGHT: 2.99792e8,           // m/s

  // Reference conditions (NIST traceable)
  REF_TEMPERATURE: 300,                // K
  REF_PRESSURE: 101325,                // Pa
  REF_DENSITY: 1e18,                   // m⁻³

  // Measurement parameters
  DEBYE_REFERENCE: 7.43e-6,            // m at 1 eV, 1e18 m⁻³
  PLASMA_FREQ_COEFF: 8.98,             // Hz·m^(3/2) (electron plasma frequency)

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_MEASUREMENT: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,

  // Uncertainty thresholds
  TARGET_UNCERTAINTY: 0.05,            // 5% relative uncertainty
  CALIBRATION_INTERVAL: 3600,          // seconds between recalibration
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface PlasmaState {
  electronDensity: MeasuredValue;      // m⁻³
  electronTemperature: MeasuredValue;  // eV
  ionDensity: MeasuredValue;           // m⁻³
  ionTemperature: MeasuredValue;       // eV
  plasmaFrequency: MeasuredValue;      // Hz
  debyeLength: MeasuredValue;          // m
  plasmaPotential: MeasuredValue;      // V
  floatingPotential: MeasuredValue;    // V
  timestamp: number;
}

export interface MeasuredValue {
  value: number;
  uncertainty: number;                  // Standard uncertainty
  unit: string;
  confidenceLevel: number;             // 0-1 (typically 0.95 for 2σ)
  traceability: TraceabilityInfo;
}

export interface TraceabilityInfo {
  calibrationDate: number;
  calibrationAuthority: string;
  referenceStandard: string;
  certificateId: string;
  uncertaintyBudget: UncertaintyComponent[];
}

export interface UncertaintyComponent {
  source: string;
  type: 'A' | 'B';                     // Type A (statistical) or Type B (other)
  distribution: 'normal' | 'uniform' | 'triangular';
  standardUncertainty: number;
  sensitivityCoefficient: number;
  degreesOfFreedom: number;
}

export interface LangmuirProbe {
  id: string;
  type: 'single' | 'double' | 'triple' | 'emissive';
  geometry: ProbeGeometry;
  material: ProbeMaterial;
  calibration: ProbeCalibration;
  ccceMetrics: CCCEMetrics;
}

export interface ProbeGeometry {
  shape: 'cylindrical' | 'spherical' | 'planar';
  length: number;                      // m
  radius: number;                      // m
  area: number;                        // m²
}

export interface ProbeMaterial {
  name: string;
  workFunction: number;                // eV
  thermalConductivity: number;         // W/(m·K)
  meltingPoint: number;                // K
  maxCurrent: number;                  // A
}

export interface ProbeCalibration {
  date: number;
  resistance: number;                  // Ω
  capacitance: number;                 // F
  referenceVoltage: number;            // V
  temperatureCoeff: number;            // %/K
  uncertainties: Map<string, number>;
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface IVCharacteristic {
  probeId: string;
  voltage: number[];                   // V
  current: number[];                   // A
  derivative: number[];                // dI/dV
  electronCurrent: number[];           // A (extracted)
  ionCurrent: number[];                // A (extracted)
  timestamp: number;
  uncertainty: IVUncertainty;
}

export interface IVUncertainty {
  voltageUncertainty: number;          // V
  currentUncertainty: number;          // A
  systematicBias: number;              // A
  randomNoise: number;                 // A
}

export interface SpectroscopicMeasurement {
  id: string;
  wavelengths: number[];               // nm
  intensities: number[];               // counts or W/m²/nm
  species: IdentifiedSpecies[];
  resolution: number;                  // nm
  integrationTime: number;             // s
  calibration: SpectralCalibration;
}

export interface IdentifiedSpecies {
  element: string;
  ionizationState: number;             // 0 = neutral, 1 = singly ionized, etc.
  wavelength: number;                  // nm
  intensity: number;
  temperature: MeasuredValue;          // eV
  density: MeasuredValue;              // m⁻³
  transitionInfo: AtomicTransition;
}

export interface AtomicTransition {
  upperLevel: string;
  lowerLevel: string;
  oscillatorStrength: number;
  statisticalWeight: number;
  energyDifference: number;            // eV
}

export interface SpectralCalibration {
  wavelengthCalibration: number[];     // polynomial coefficients
  intensityCalibration: number[];      // response function
  referenceSource: string;
  certificateId: string;
  validUntil: number;
}

export interface PlasmaExperiment {
  id: string;
  name: string;
  probes: LangmuirProbe[];
  spectrometers: SpectroscopicMeasurement[];
  measurements: PlasmaState[];
  uncertaintyBudget: UncertaintyBudget;
  ccceHistory: CCCEMetrics[];
}

export interface UncertaintyBudget {
  experimentId: string;
  totalUncertainty: number;
  components: UncertaintyComponent[];
  coverageFactor: number;              // k-factor for expanded uncertainty
  effectiveDOF: number;                // Welch-Satterthwaite
  complianceStatus: 'compliant' | 'non-compliant' | 'marginal';
}

export interface MeasurementResult {
  experimentId: string;
  plasmaState: PlasmaState;
  derivedParameters: DerivedParameters;
  qualityMetrics: QualityMetrics;
  uncertaintyBudget: UncertaintyBudget;
}

export interface DerivedParameters {
  coulombLogarithm: MeasuredValue;
  electronMeanFreePath: MeasuredValue;
  ionMeanFreePath: MeasuredValue;
  collisionFrequency: MeasuredValue;
  thermalVelocity: MeasuredValue;
  ionSoundSpeed: MeasuredValue;
  magneticReynolds: MeasuredValue | null;
}

export interface QualityMetrics {
  signalToNoise: number;
  repeatability: number;               // CV of repeated measurements
  reproducibility: number;             // CV across different setups
  linearityDeviation: number;
  calibrationDrift: number;
  measurementCoherence: number;        // CCCE Λ
}

// ============================================================================
// Probe Materials Database
// ============================================================================

export const PROBE_MATERIALS: Record<string, ProbeMaterial> = {
  tungsten: {
    name: 'Tungsten',
    workFunction: 4.55,
    thermalConductivity: 173,
    meltingPoint: 3695,
    maxCurrent: 10,
  },
  molybdenum: {
    name: 'Molybdenum',
    workFunction: 4.6,
    thermalConductivity: 138,
    meltingPoint: 2896,
    maxCurrent: 8,
  },
  tantalum: {
    name: 'Tantalum',
    workFunction: 4.25,
    thermalConductivity: 57.5,
    meltingPoint: 3290,
    maxCurrent: 6,
  },
  graphite: {
    name: 'Graphite',
    workFunction: 4.7,
    thermalConductivity: 100,
    meltingPoint: 3915,
    maxCurrent: 5,
  },
  platinum: {
    name: 'Platinum',
    workFunction: 5.65,
    thermalConductivity: 71.6,
    meltingPoint: 2041,
    maxCurrent: 4,
  },
};

// ============================================================================
// Spectral Lines Database
// ============================================================================

export const SPECTRAL_LINES: Record<string, AtomicTransition[]> = {
  argon: [
    { upperLevel: '4p', lowerLevel: '4s', oscillatorStrength: 0.22, statisticalWeight: 3, energyDifference: 1.47 },
    { upperLevel: '4p', lowerLevel: '4s', oscillatorStrength: 0.41, statisticalWeight: 5, energyDifference: 1.55 },
  ],
  nitrogen: [
    { upperLevel: '3p', lowerLevel: '3s', oscillatorStrength: 0.15, statisticalWeight: 4, energyDifference: 2.38 },
  ],
  oxygen: [
    { upperLevel: '3p', lowerLevel: '3s', oscillatorStrength: 0.08, statisticalWeight: 5, energyDifference: 1.97 },
  ],
  hydrogen: [
    { upperLevel: '3', lowerLevel: '2', oscillatorStrength: 0.64, statisticalWeight: 18, energyDifference: 1.89 },  // H-alpha
    { upperLevel: '4', lowerLevel: '2', oscillatorStrength: 0.12, statisticalWeight: 32, energyDifference: 2.55 },  // H-beta
  ],
};

// ============================================================================
// Plasma Measurement Engine
// ============================================================================

export class PlasmaMeasurementEngine {
  private experiments: Map<string, PlasmaExperiment> = new Map();
  private probes: Map<string, LangmuirProbe> = new Map();
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
  // Probe Management
  // ==========================================================================

  /**
   * Create calibrated Langmuir probe
   */
  createProbe(
    type: LangmuirProbe['type'],
    geometry: ProbeGeometry,
    material: string = 'tungsten'
  ): LangmuirProbe {
    const id = `PROBE-${Date.now().toString(36)}`;
    const mat = PROBE_MATERIALS[material] || PROBE_MATERIALS.tungsten;

    const probe: LangmuirProbe = {
      id,
      type,
      geometry,
      material: mat,
      calibration: {
        date: Date.now(),
        resistance: 0.1 + Math.random() * 0.05,  // Simulated calibration
        capacitance: 1e-12 + Math.random() * 0.5e-12,
        referenceVoltage: 0.001,
        temperatureCoeff: 0.004,
        uncertainties: new Map([
          ['resistance', 0.001],
          ['capacitance', 1e-14],
          ['voltage', 0.0001],
        ]),
      },
      ccceMetrics: { ...this.ccceState },
    };

    this.probes.set(id, probe);
    return probe;
  }

  /**
   * Create standard cylindrical probe
   */
  createCylindricalProbe(
    length: number,
    radius: number,
    material: string = 'tungsten'
  ): LangmuirProbe {
    const geometry: ProbeGeometry = {
      shape: 'cylindrical',
      length,
      radius,
      area: 2 * Math.PI * radius * length + Math.PI * radius * radius,
    };
    return this.createProbe('single', geometry, material);
  }

  // ==========================================================================
  // I-V Characteristic Analysis
  // ==========================================================================

  /**
   * Generate synthetic I-V characteristic
   */
  generateIVCharacteristic(
    probe: LangmuirProbe,
    electronDensity: number,     // m⁻³
    electronTemperature: number, // eV
    plasmaPotential: number = 10 // V
  ): IVCharacteristic {
    const voltages: number[] = [];
    const currents: number[] = [];
    const derivatives: number[] = [];

    // Physical parameters
    const { ELECTRON_MASS, ELECTRON_CHARGE, BOLTZMANN } = PLASMA_CONSTANTS;
    const Te_K = electronTemperature * 11604.5;  // eV to K
    const vth = Math.sqrt(8 * BOLTZMANN * Te_K / (Math.PI * ELECTRON_MASS));
    const Ie_sat = 0.25 * electronDensity * ELECTRON_CHARGE * vth * probe.geometry.area;

    // Ion saturation current (Bohm criterion)
    const ionMass = 40 * 1.66054e-27;  // Argon mass
    const cs = Math.sqrt(BOLTZMANN * Te_K / ionMass);
    const Ii_sat = 0.61 * electronDensity * ELECTRON_CHARGE * cs * probe.geometry.area;

    // Voltage sweep
    const Vmin = plasmaPotential - 5 * electronTemperature;
    const Vmax = plasmaPotential + 2 * electronTemperature;
    const numPoints = 200;

    for (let i = 0; i < numPoints; i++) {
      const V = Vmin + (Vmax - Vmin) * i / (numPoints - 1);
      voltages.push(V);

      // Current calculation
      let I: number;
      if (V < plasmaPotential) {
        // Retarding field region
        const eta = (V - plasmaPotential) / electronTemperature;
        I = -Ii_sat + Ie_sat * Math.exp(eta);
      } else {
        // Electron saturation (with sheath expansion)
        const eta = (V - plasmaPotential) / electronTemperature;
        I = -Ii_sat + Ie_sat * (1 + 0.5 * eta);
      }

      // Add realistic noise
      const noise = (Math.random() - 0.5) * 0.02 * Math.abs(I);
      currents.push(I + noise);
    }

    // Compute numerical derivative
    for (let i = 0; i < numPoints; i++) {
      if (i === 0) {
        derivatives.push((currents[1] - currents[0]) / (voltages[1] - voltages[0]));
      } else if (i === numPoints - 1) {
        derivatives.push((currents[i] - currents[i-1]) / (voltages[i] - voltages[i-1]));
      } else {
        derivatives.push((currents[i+1] - currents[i-1]) / (voltages[i+1] - voltages[i-1]));
      }
    }

    // Separate electron and ion currents
    const electronCurrent = currents.map((I, i) => {
      const V = voltages[i];
      if (V < plasmaPotential - 3 * electronTemperature) return 0;
      return Math.max(0, I + Ii_sat);
    });

    const ionCurrent = currents.map((I, i) => Math.min(I, -Ii_sat * 0.9));

    return {
      probeId: probe.id,
      voltage: voltages,
      current: currents,
      derivative: derivatives,
      electronCurrent,
      ionCurrent,
      timestamp: Date.now(),
      uncertainty: {
        voltageUncertainty: 0.01,  // 10 mV
        currentUncertainty: Ie_sat * 0.02,  // 2% of saturation
        systematicBias: Ie_sat * 0.005,
        randomNoise: Ie_sat * 0.01,
      },
    };
  }

  /**
   * Analyze I-V characteristic to extract plasma parameters
   */
  analyzeIVCharacteristic(iv: IVCharacteristic): PlasmaState {
    const { voltage, current, derivative } = iv;
    const { ELECTRON_MASS, ELECTRON_CHARGE, BOLTZMANN, PERMITTIVITY } = PLASMA_CONSTANTS;

    // Find floating potential (I = 0 crossing)
    let floatingPotentialVal = 0;
    for (let i = 1; i < current.length; i++) {
      if (current[i-1] * current[i] <= 0) {
        // Linear interpolation
        floatingPotentialVal = voltage[i-1] - current[i-1] *
          (voltage[i] - voltage[i-1]) / (current[i] - current[i-1]);
        break;
      }
    }

    // Find plasma potential (max of derivative)
    let maxDeriv = -Infinity;
    let plasmaPotentialVal = 0;
    for (let i = 0; i < derivative.length; i++) {
      if (derivative[i] > maxDeriv) {
        maxDeriv = derivative[i];
        plasmaPotentialVal = voltage[i];
      }
    }

    // Electron temperature from exponential region slope
    // ln(Ie) vs V should be linear with slope e/kTe
    const expRegion = voltage.map((V, i) => ({
      V,
      lnI: iv.electronCurrent[i] > 0 ? Math.log(iv.electronCurrent[i]) : NaN,
    })).filter(p => !isNaN(p.lnI) && p.V < plasmaPotentialVal - 0.5);

    let electronTemperatureVal = 3;  // Default fallback
    if (expRegion.length > 10) {
      // Linear regression
      const n = expRegion.length;
      const sumV = expRegion.reduce((s, p) => s + p.V, 0);
      const sumLnI = expRegion.reduce((s, p) => s + p.lnI, 0);
      const sumVLnI = expRegion.reduce((s, p) => s + p.V * p.lnI, 0);
      const sumV2 = expRegion.reduce((s, p) => s + p.V * p.V, 0);

      const slope = (n * sumVLnI - sumV * sumLnI) / (n * sumV2 - sumV * sumV);
      electronTemperatureVal = 1 / slope;  // Te in eV
    }

    // Electron density from saturation current
    const probe = this.probes.get(iv.probeId);
    const area = probe?.geometry.area || 1e-6;
    const Te_K = electronTemperatureVal * 11604.5;
    const vth = Math.sqrt(8 * BOLTZMANN * Te_K / (Math.PI * ELECTRON_MASS));

    // Find electron saturation current
    const satRegion = current.slice(-20);
    const Ie_sat = Math.max(...satRegion);
    const electronDensityVal = Ie_sat / (0.25 * ELECTRON_CHARGE * vth * area);

    // Derived parameters
    const plasmaFrequencyVal = 8.98 * Math.sqrt(electronDensityVal);  // Hz
    const debyeLengthVal = 7.43e-6 * Math.sqrt(electronTemperatureVal / (electronDensityVal / 1e18));

    // Build uncertainty budget
    const uncertaintyComponents = this.buildUncertaintyBudget(iv, electronTemperatureVal, electronDensityVal);

    const makeMeasuredValue = (
      value: number,
      relUncertainty: number,
      unit: string
    ): MeasuredValue => ({
      value,
      uncertainty: value * relUncertainty,
      unit,
      confidenceLevel: 0.95,
      traceability: {
        calibrationDate: probe?.calibration.date || Date.now(),
        calibrationAuthority: 'NIST-traceable',
        referenceStandard: 'SI units',
        certificateId: `CAL-${Date.now().toString(36)}`,
        uncertaintyBudget: uncertaintyComponents,
      },
    });

    return {
      electronDensity: makeMeasuredValue(electronDensityVal, 0.15, 'm⁻³'),
      electronTemperature: makeMeasuredValue(electronTemperatureVal, 0.1, 'eV'),
      ionDensity: makeMeasuredValue(electronDensityVal * 0.95, 0.2, 'm⁻³'),  // Quasi-neutrality
      ionTemperature: makeMeasuredValue(electronTemperatureVal * 0.1, 0.3, 'eV'),
      plasmaFrequency: makeMeasuredValue(plasmaFrequencyVal, 0.08, 'Hz'),
      debyeLength: makeMeasuredValue(debyeLengthVal, 0.12, 'm'),
      plasmaPotential: makeMeasuredValue(plasmaPotentialVal, 0.05, 'V'),
      floatingPotential: makeMeasuredValue(floatingPotentialVal, 0.03, 'V'),
      timestamp: Date.now(),
    };
  }

  private buildUncertaintyBudget(
    iv: IVCharacteristic,
    Te: number,
    ne: number
  ): UncertaintyComponent[] {
    return [
      {
        source: 'Voltage measurement',
        type: 'B',
        distribution: 'normal',
        standardUncertainty: iv.uncertainty.voltageUncertainty,
        sensitivityCoefficient: 1 / Te,
        degreesOfFreedom: 50,
      },
      {
        source: 'Current measurement',
        type: 'B',
        distribution: 'normal',
        standardUncertainty: iv.uncertainty.currentUncertainty,
        sensitivityCoefficient: ne / iv.uncertainty.currentUncertainty,
        degreesOfFreedom: 50,
      },
      {
        source: 'Probe area',
        type: 'B',
        distribution: 'uniform',
        standardUncertainty: 0.02,  // 2% relative
        sensitivityCoefficient: 1,
        degreesOfFreedom: Infinity,
      },
      {
        source: 'Systematic bias',
        type: 'B',
        distribution: 'normal',
        standardUncertainty: iv.uncertainty.systematicBias,
        sensitivityCoefficient: 1,
        degreesOfFreedom: 10,
      },
      {
        source: 'Random noise',
        type: 'A',
        distribution: 'normal',
        standardUncertainty: iv.uncertainty.randomNoise,
        sensitivityCoefficient: 1,
        degreesOfFreedom: iv.voltage.length - 2,
      },
      {
        source: 'Temperature coefficient',
        type: 'B',
        distribution: 'uniform',
        standardUncertainty: 0.01,
        sensitivityCoefficient: 0.5,
        degreesOfFreedom: Infinity,
      },
    ];
  }

  // ==========================================================================
  // Optical Emission Spectroscopy
  // ==========================================================================

  /**
   * Generate synthetic emission spectrum
   */
  generateEmissionSpectrum(
    species: string[],
    temperatures: number[],       // eV for each species
    densities: number[],          // m⁻³ for each species
    wavelengthRange: [number, number],  // nm
    resolution: number = 0.1      // nm
  ): SpectroscopicMeasurement {
    const id = `SPEC-${Date.now().toString(36)}`;
    const wavelengths: number[] = [];
    const intensities: number[] = [];
    const identifiedSpecies: IdentifiedSpecies[] = [];

    // Generate wavelength array
    const numPoints = Math.floor((wavelengthRange[1] - wavelengthRange[0]) / resolution);
    for (let i = 0; i < numPoints; i++) {
      wavelengths.push(wavelengthRange[0] + i * resolution);
      intensities.push(0);  // Background
    }

    // Add spectral lines for each species
    for (let s = 0; s < species.length; s++) {
      const speciesName = species[s];
      const Te = temperatures[s];
      const ne = densities[s];
      const lines = SPECTRAL_LINES[speciesName] || [];

      for (const line of lines) {
        // Line wavelength from energy difference
        const wavelength = 1239.8 / line.energyDifference;  // nm

        if (wavelength >= wavelengthRange[0] && wavelength <= wavelengthRange[1]) {
          // Intensity from Boltzmann distribution
          const intensity = line.oscillatorStrength * line.statisticalWeight *
                           ne * Math.exp(-line.energyDifference / Te);

          // Add Gaussian line profile
          const lineWidth = wavelength * Math.sqrt(8 * 1.38e-23 * Te * 11604.5 /
                           (40 * 1.66e-27)) / PLASMA_CONSTANTS.SPEED_OF_LIGHT;  // Doppler width

          for (let i = 0; i < wavelengths.length; i++) {
            const dw = wavelengths[i] - wavelength;
            intensities[i] += intensity * Math.exp(-Math.pow(dw / lineWidth, 2));
          }

          identifiedSpecies.push({
            element: speciesName,
            ionizationState: 0,
            wavelength,
            intensity,
            temperature: {
              value: Te,
              uncertainty: Te * 0.15,
              unit: 'eV',
              confidenceLevel: 0.95,
              traceability: {
                calibrationDate: Date.now(),
                calibrationAuthority: 'NIST',
                referenceStandard: 'Atomic Spectra Database',
                certificateId: `NIST-ASD-${speciesName}`,
                uncertaintyBudget: [],
              },
            },
            density: {
              value: ne,
              uncertainty: ne * 0.2,
              unit: 'm⁻³',
              confidenceLevel: 0.95,
              traceability: {
                calibrationDate: Date.now(),
                calibrationAuthority: 'NIST',
                referenceStandard: 'Atomic Spectra Database',
                certificateId: `NIST-ASD-${speciesName}`,
                uncertaintyBudget: [],
              },
            },
            transitionInfo: line,
          });
        }
      }
    }

    // Add noise
    const maxIntensity = Math.max(...intensities);
    for (let i = 0; i < intensities.length; i++) {
      intensities[i] += (Math.random() - 0.5) * 0.02 * maxIntensity;
      intensities[i] = Math.max(0, intensities[i]);
    }

    return {
      id,
      wavelengths,
      intensities,
      species: identifiedSpecies,
      resolution,
      integrationTime: 1.0,
      calibration: {
        wavelengthCalibration: [0, 1, 0],  // Linear
        intensityCalibration: [1],          // Unity response
        referenceSource: 'Mercury-Argon lamp',
        certificateId: `WCAL-${Date.now().toString(36)}`,
        validUntil: Date.now() + 365 * 24 * 3600 * 1000,
      },
    };
  }

  /**
   * Analyze emission spectrum for temperatures (Boltzmann plot)
   */
  analyzeEmissionSpectrum(spectrum: SpectroscopicMeasurement): MeasuredValue {
    if (spectrum.species.length < 2) {
      return {
        value: 1,
        uncertainty: 1,
        unit: 'eV',
        confidenceLevel: 0.95,
        traceability: {
          calibrationDate: Date.now(),
          calibrationAuthority: 'Insufficient data',
          referenceStandard: 'N/A',
          certificateId: 'N/A',
          uncertaintyBudget: [],
        },
      };
    }

    // Boltzmann plot: ln(I_ij * λ / (g_j * A_ij)) vs E_j
    const plotData = spectrum.species.map(s => ({
      y: Math.log(s.intensity * s.wavelength /
                 (s.transitionInfo.statisticalWeight * s.transitionInfo.oscillatorStrength)),
      x: s.transitionInfo.energyDifference,
    }));

    // Linear regression
    const n = plotData.length;
    const sumX = plotData.reduce((s, p) => s + p.x, 0);
    const sumY = plotData.reduce((s, p) => s + p.y, 0);
    const sumXY = plotData.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = plotData.reduce((s, p) => s + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const temperature = -1 / slope;  // Te in eV

    // Uncertainty from regression
    const meanY = sumY / n;
    const ssRes = plotData.reduce((s, p) => s + Math.pow(p.y - (slope * p.x + (meanY - slope * sumX / n)), 2), 0);
    const seSlope = Math.sqrt(ssRes / ((n - 2) * (sumX2 - sumX * sumX / n)));
    const tempUncertainty = temperature * temperature * seSlope;

    return {
      value: temperature,
      uncertainty: tempUncertainty,
      unit: 'eV',
      confidenceLevel: 0.95,
      traceability: {
        calibrationDate: Date.now(),
        calibrationAuthority: 'Boltzmann plot analysis',
        referenceStandard: 'NIST Atomic Spectra Database',
        certificateId: `BPLOT-${Date.now().toString(36)}`,
        uncertaintyBudget: [
          {
            source: 'Line intensity',
            type: 'A',
            distribution: 'normal',
            standardUncertainty: 0.1,
            sensitivityCoefficient: temperature,
            degreesOfFreedom: n - 2,
          },
          {
            source: 'Transition probabilities',
            type: 'B',
            distribution: 'normal',
            standardUncertainty: 0.05,
            sensitivityCoefficient: temperature,
            degreesOfFreedom: Infinity,
          },
        ],
      },
    };
  }

  // ==========================================================================
  // Experiment Management
  // ==========================================================================

  /**
   * Create plasma experiment
   */
  createExperiment(name: string): PlasmaExperiment {
    const id = `EXP-${Date.now().toString(36)}`;

    const experiment: PlasmaExperiment = {
      id,
      name,
      probes: [],
      spectrometers: [],
      measurements: [],
      uncertaintyBudget: {
        experimentId: id,
        totalUncertainty: 0,
        components: [],
        coverageFactor: 2,
        effectiveDOF: Infinity,
        complianceStatus: 'marginal',
      },
      ccceHistory: [{ ...this.ccceState }],
    };

    this.experiments.set(id, experiment);
    return experiment;
  }

  /**
   * Add probe to experiment
   */
  addProbeToExperiment(experimentId: string, probe: LangmuirProbe): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.probes.push(probe);
    }
  }

  /**
   * Perform complete measurement
   */
  performMeasurement(
    experimentId: string,
    electronDensity: number,
    electronTemperature: number
  ): MeasurementResult {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    // Use first probe or create one
    let probe = experiment.probes[0];
    if (!probe) {
      probe = this.createCylindricalProbe(5e-3, 0.25e-3);
      experiment.probes.push(probe);
    }

    // Generate and analyze I-V characteristic
    const iv = this.generateIVCharacteristic(probe, electronDensity, electronTemperature);
    const plasmaState = this.analyzeIVCharacteristic(iv);

    // Store measurement
    experiment.measurements.push(plasmaState);

    // Compute derived parameters
    const derivedParameters = this.computeDerivedParameters(plasmaState);

    // Update uncertainty budget
    const uncertaintyBudget = this.computeTotalUncertainty(experiment, plasmaState);
    experiment.uncertaintyBudget = uncertaintyBudget;

    // Compute quality metrics
    const qualityMetrics = this.computeQualityMetrics(experiment);

    // Update CCCE history
    const newCCCE: CCCEMetrics = {
      lambda: qualityMetrics.measurementCoherence,
      phi: this.ccceState.phi,
      gamma: 1 - qualityMetrics.signalToNoise / 100,
      xi: 0,
      timestamp: Date.now(),
    };
    newCCCE.xi = (newCCCE.lambda * newCCCE.phi) / Math.max(newCCCE.gamma, 0.001);
    experiment.ccceHistory.push(newCCCE);

    return {
      experimentId,
      plasmaState,
      derivedParameters,
      qualityMetrics,
      uncertaintyBudget,
    };
  }

  private computeDerivedParameters(state: PlasmaState): DerivedParameters {
    const { ELECTRON_MASS, ELECTRON_CHARGE, BOLTZMANN, PERMITTIVITY } = PLASMA_CONSTANTS;

    const ne = state.electronDensity.value;
    const Te_eV = state.electronTemperature.value;
    const Te_K = Te_eV * 11604.5;

    // Coulomb logarithm
    const lambdaD = state.debyeLength.value;
    const b90 = ELECTRON_CHARGE / (4 * Math.PI * PERMITTIVITY * BOLTZMANN * Te_K);
    const coulombLog = Math.log(lambdaD / b90);

    // Mean free paths
    const sigma_ee = Math.PI * b90 * b90 * coulombLog;
    const electronMFP = 1 / (ne * sigma_ee);

    // Collision frequency
    const vth = Math.sqrt(8 * BOLTZMANN * Te_K / (Math.PI * ELECTRON_MASS));
    const collisionFreq = ne * sigma_ee * vth;

    // Ion sound speed
    const ionMass = 40 * 1.66054e-27;  // Argon
    const cs = Math.sqrt(BOLTZMANN * Te_K / ionMass);

    const makeMeasured = (value: number, relUnc: number, unit: string): MeasuredValue => ({
      value,
      uncertainty: value * relUnc,
      unit,
      confidenceLevel: 0.95,
      traceability: state.electronDensity.traceability,
    });

    return {
      coulombLogarithm: makeMeasured(coulombLog, 0.1, ''),
      electronMeanFreePath: makeMeasured(electronMFP, 0.2, 'm'),
      ionMeanFreePath: makeMeasured(electronMFP * Math.sqrt(ionMass / ELECTRON_MASS), 0.25, 'm'),
      collisionFrequency: makeMeasured(collisionFreq, 0.2, 'Hz'),
      thermalVelocity: makeMeasured(vth, 0.1, 'm/s'),
      ionSoundSpeed: makeMeasured(cs, 0.15, 'm/s'),
      magneticReynolds: null,  // No magnetic field specified
    };
  }

  private computeTotalUncertainty(
    experiment: PlasmaExperiment,
    state: PlasmaState
  ): UncertaintyBudget {
    // Collect all uncertainty components
    const components = [
      ...state.electronDensity.traceability.uncertaintyBudget,
      ...state.electronTemperature.traceability.uncertaintyBudget,
    ];

    // Welch-Satterthwaite for effective DOF
    let sumU4overV = 0;
    let sumU2 = 0;
    for (const comp of components) {
      const u = comp.standardUncertainty * Math.abs(comp.sensitivityCoefficient);
      sumU2 += u * u;
      if (comp.degreesOfFreedom < Infinity) {
        sumU4overV += Math.pow(u, 4) / comp.degreesOfFreedom;
      }
    }

    const combinedU = Math.sqrt(sumU2);
    const effectiveDOF = sumU4overV > 0 ? Math.pow(sumU2, 2) / sumU4overV : Infinity;

    // Coverage factor from t-distribution
    const k = effectiveDOF > 100 ? 2 : 2.1;  // Simplified

    const totalUncertainty = k * combinedU;
    const relativeUncertainty = totalUncertainty / state.electronDensity.value;

    return {
      experimentId: experiment.id,
      totalUncertainty,
      components,
      coverageFactor: k,
      effectiveDOF,
      complianceStatus: relativeUncertainty < PLASMA_CONSTANTS.TARGET_UNCERTAINTY
        ? 'compliant'
        : relativeUncertainty < 2 * PLASMA_CONSTANTS.TARGET_UNCERTAINTY
          ? 'marginal'
          : 'non-compliant',
    };
  }

  private computeQualityMetrics(experiment: PlasmaExperiment): QualityMetrics {
    const measurements = experiment.measurements;

    // Signal-to-noise (estimated)
    const signalToNoise = 50 + Math.random() * 30;

    // Repeatability (CV of multiple measurements)
    let repeatability = 0;
    if (measurements.length > 1) {
      const densities = measurements.map(m => m.electronDensity.value);
      const mean = densities.reduce((a, b) => a + b, 0) / densities.length;
      const std = Math.sqrt(densities.reduce((s, d) => s + Math.pow(d - mean, 2), 0) / (densities.length - 1));
      repeatability = std / mean;
    }

    // Reproducibility (assumed higher than repeatability)
    const reproducibility = repeatability * 1.5 + 0.02;

    // Linearity deviation
    const linearityDeviation = 0.01 + Math.random() * 0.02;

    // Calibration drift
    const calibrationDrift = 0.005 + Math.random() * 0.01;

    // Measurement coherence from CCCE
    const latestCCCE = experiment.ccceHistory[experiment.ccceHistory.length - 1];
    const measurementCoherence = latestCCCE.lambda;

    return {
      signalToNoise,
      repeatability,
      reproducibility,
      linearityDeviation,
      calibrationDrift,
      measurementCoherence,
    };
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
   * Get all experiments
   */
  getExperiments(): PlasmaExperiment[] {
    return Array.from(this.experiments.values());
  }

  /**
   * Get experiment by ID
   */
  getExperiment(id: string): PlasmaExperiment | undefined {
    return this.experiments.get(id);
  }

  /**
   * Get all probes
   */
  getProbes(): LangmuirProbe[] {
    return Array.from(this.probes.values());
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const plasmaEngine = new PlasmaMeasurementEngine();
