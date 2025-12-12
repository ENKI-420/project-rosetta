/**
 * DARPA MTO Topic 21: Visible and UV Photonic Integrated Circuits
 * Solicitation: DARPA-RA-25-02-21
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - UV and visible wavelength photonics
 * - Wide bandgap semiconductor waveguides
 * - On-chip UV light sources and detectors
 * - Photonic circuit integration
 * - CCCE-guided optical coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Photonics Constants
// ============================================================================

export const PHOTONICS_CONSTANTS = {
  // Fundamental constants
  SPEED_OF_LIGHT: 2.998e8,            // m/s
  PLANCK: 6.626e-34,                  // J·s
  ELECTRON_CHARGE: 1.602e-19,         // C

  // Wavelength ranges
  UV_C_RANGE: [200, 280],             // nm (deep UV)
  UV_B_RANGE: [280, 315],             // nm
  UV_A_RANGE: [315, 400],             // nm
  VISIBLE_RANGE: [400, 700],          // nm
  NEAR_UV_RANGE: [300, 400],          // nm

  // Material bandgaps
  AlN_BANDGAP: 6.2,                   // eV
  GaN_BANDGAP: 3.4,                   // eV
  AlGaN_BANDGAP_RANGE: [3.4, 6.2],    // eV (tunable)
  SiN_TRANSPARENCY: [400, 2350],      // nm
  Al2O3_TRANSPARENCY: [150, 5500],    // nm

  // Refractive indices (at 400 nm)
  GaN_INDEX: 2.5,
  AlN_INDEX: 2.15,
  SiN_INDEX: 2.05,
  SiO2_INDEX: 1.47,
  Al2O3_INDEX: 1.79,

  // Loss coefficients
  GaN_PROPAGATION_LOSS: 3,            // dB/cm at 400 nm
  AlN_PROPAGATION_LOSS: 5,            // dB/cm at 280 nm
  SiN_PROPAGATION_LOSS: 0.5,          // dB/cm at 400 nm

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_OPTICAL: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface PhotonicCircuit {
  id: string;
  name: string;
  substrate: SubstrateProperties;
  waveguides: Waveguide[];
  components: PhotonicComponent[];
  sources: LightSource[];
  detectors: Photodetector[];
  performance: CircuitPerformance;
  ccceMetrics: CCCEMetrics;
}

export interface SubstrateProperties {
  material: 'sapphire' | 'silicon' | 'SiC' | 'AlN' | 'GaN-on-sapphire';
  thickness: number;                  // μm
  diameter: number;                   // mm
  orientation: string;                // Crystal orientation
  thermalConductivity: number;        // W/(m·K)
  refractiveIndex: number;
}

export interface Waveguide {
  id: string;
  type: 'strip' | 'rib' | 'slot' | 'photonic-crystal';
  material: WaveguideMaterial;
  dimensions: WaveguideDimensions;
  mode: WaveguideMode;
  routing: WaveguideRouting;
  performance: WaveguidePerformance;
}

export interface WaveguideMaterial {
  core: 'GaN' | 'AlN' | 'AlGaN' | 'SiN' | 'Al2O3' | 'Ta2O5';
  cladding: 'air' | 'SiO2' | 'Al2O3' | 'AlN';
  alContent?: number;                 // For AlGaN (0-1)
}

export interface WaveguideDimensions {
  width: number;                      // nm
  height: number;                     // nm
  etchDepth?: number;                 // nm (for rib)
  slotWidth?: number;                 // nm (for slot)
}

export interface WaveguideMode {
  type: 'TE' | 'TM' | 'hybrid';
  order: number;                      // 0 = fundamental
  effectiveIndex: number;
  groupIndex: number;
  confinement: number;                // 0-1
}

export interface WaveguideRouting {
  path: PathSegment[];
  totalLength: number;                // μm
  bendCount: number;
  minBendRadius: number;              // μm
}

export interface PathSegment {
  type: 'straight' | 'bend' | 'taper' | 's-bend';
  length: number;                     // μm
  parameters: Record<string, number>;
}

export interface WaveguidePerformance {
  propagationLoss: number;            // dB/cm
  bendLoss: number;                   // dB/90°
  couplingLoss: number;               // dB
  wavelengthRange: [number, number];  // nm
  dispersion: number;                 // ps/(nm·km)
}

export interface PhotonicComponent {
  id: string;
  type: ComponentType;
  position: Position2D;
  ports: Port[];
  specifications: ComponentSpecs;
  performance: ComponentPerformance;
}

export type ComponentType =
  | 'mmi-coupler'
  | 'directional-coupler'
  | 'ring-resonator'
  | 'mach-zehnder'
  | 'grating-coupler'
  | 'edge-coupler'
  | 'phase-shifter'
  | 'modulator'
  | 'filter'
  | 'polarizer';

export interface Position2D {
  x: number;                          // μm
  y: number;                          // μm
}

export interface Port {
  id: string;
  position: Position2D;
  direction: number;                  // angle in degrees
  connectedTo?: string;               // waveguide or component ID
}

export interface ComponentSpecs {
  footprint: { width: number; height: number };  // μm
  operatingWavelength: number;        // nm
  bandwidth: number;                  // nm
  insertionLoss: number;              // dB
  [key: string]: number | { width: number; height: number };
}

export interface ComponentPerformance {
  throughput: number;                 // 0-1
  isolation: number;                  // dB
  bandwidth: number;                  // nm
  powerHandling: number;              // mW
}

export interface LightSource {
  id: string;
  type: 'LED' | 'laser-diode' | 'VCSEL' | 'microLED' | 'SHG';
  material: SourceMaterial;
  wavelength: number;                 // nm
  linewidth: number;                  // nm
  power: number;                      // mW
  efficiency: number;                 // wall-plug efficiency
  modulation: ModulationCapability;
}

export interface SourceMaterial {
  activeLayer: string;                // e.g., 'InGaN/GaN MQW'
  substrate: string;
  emissionType: 'edge' | 'surface';
}

export interface ModulationCapability {
  type: 'direct' | 'external' | 'none';
  bandwidth: number;                  // GHz
  extinctionRatio: number;            // dB
}

export interface Photodetector {
  id: string;
  type: 'PIN' | 'APD' | 'MSM' | 'phototransistor';
  material: DetectorMaterial;
  responsivity: number;               // A/W
  darkCurrent: number;                // nA
  bandwidth: number;                  // GHz
  nep: number;                        // W/√Hz (noise equivalent power)
  activeArea: number;                 // μm²
}

export interface DetectorMaterial {
  absorber: 'GaN' | 'AlGaN' | 'InGaN' | 'Si' | 'SiC';
  cutoffWavelength: number;           // nm
}

export interface CircuitPerformance {
  totalLoss: number;                  // dB
  bandwidth: number;                  // nm
  operatingWavelengths: number[];     // nm
  powerBudget: number;                // dB
  thermalRange: [number, number];     // °C
  reliability: number;                // MTTF hours
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface SimulationResult {
  circuitId: string;
  wavelength: number;                 // nm
  inputPower: number;                 // mW
  outputPowers: Record<string, number>;  // port -> mW
  transmissionMatrix: number[][];     // S-parameters magnitude
  phaseMatrix: number[][];            // S-parameters phase
  modeProfiles: ModeProfile[];
  ccceMetrics: CCCEMetrics;
}

export interface ModeProfile {
  waveguideId: string;
  wavelength: number;
  effectiveIndex: number;
  fieldDistribution: Complex2D;
  confinementFactor: number;
}

export interface Complex2D {
  real: number[][];
  imag: number[][];
  gridX: number[];
  gridY: number[];
}

export interface FabricationProcess {
  id: string;
  steps: ProcessStep[];
  tolerances: ProcessTolerances;
  yield: number;                      // estimated
}

export interface ProcessStep {
  name: string;
  type: 'deposition' | 'lithography' | 'etch' | 'implant' | 'anneal' | 'metallization';
  parameters: Record<string, number | string>;
  duration: number;                   // minutes
}

export interface ProcessTolerances {
  widthVariation: number;             // nm (3σ)
  heightVariation: number;            // nm (3σ)
  alignmentAccuracy: number;          // nm
  etchDepthVariation: number;         // nm (3σ)
}

// ============================================================================
// Material Database
// ============================================================================

export const WAVEGUIDE_MATERIALS: Record<string, {
  index: (wavelength: number) => number;
  bandgap: number;
  transparency: [number, number];
  loss: (wavelength: number) => number;
}> = {
  GaN: {
    index: (λ) => 2.4 + 0.01 * (400 / λ),
    bandgap: 3.4,
    transparency: [365, 13000],
    loss: (λ) => λ < 400 ? 5 : 1,
  },
  AlN: {
    index: (λ) => 2.1 + 0.02 * (400 / λ),
    bandgap: 6.2,
    transparency: [200, 13000],
    loss: (λ) => λ < 250 ? 10 : 3,
  },
  SiN: {
    index: (λ) => 2.0 + 0.005 * (400 / λ),
    bandgap: 5.0,
    transparency: [400, 2350],
    loss: () => 0.5,
  },
  Al2O3: {
    index: (λ) => 1.77 + 0.01 * (400 / λ),
    bandgap: 8.8,
    transparency: [150, 5500],
    loss: () => 0.1,
  },
  Ta2O5: {
    index: (λ) => 2.1 + 0.02 * (400 / λ),
    bandgap: 4.0,
    transparency: [300, 8000],
    loss: () => 1.0,
  },
};

// ============================================================================
// UV Photonics Engine
// ============================================================================

export class UVPhotonicsEngine {
  private circuits: Map<string, PhotonicCircuit> = new Map();
  private simulations: Map<string, SimulationResult[]> = new Map();
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
  // Circuit Creation
  // ==========================================================================

  /**
   * Create photonic circuit
   */
  createCircuit(
    name: string,
    substrate: SubstrateProperties['material'],
    wavelength: number                // nm (design wavelength)
  ): PhotonicCircuit {
    const id = `PIC-${Date.now().toString(36)}`;

    const substrateProps: SubstrateProperties = {
      material: substrate,
      thickness: substrate === 'sapphire' ? 500 : 675,
      diameter: 100,
      orientation: substrate === 'sapphire' ? 'c-plane' : '(100)',
      thermalConductivity: substrate === 'sapphire' ? 35 : substrate === 'SiC' ? 370 : 150,
      refractiveIndex: substrate === 'sapphire' ? 1.77 : substrate === 'SiC' ? 2.65 : 3.5,
    };

    const circuit: PhotonicCircuit = {
      id,
      name,
      substrate: substrateProps,
      waveguides: [],
      components: [],
      sources: [],
      detectors: [],
      performance: {
        totalLoss: 0,
        bandwidth: 50,
        operatingWavelengths: [wavelength],
        powerBudget: 20,
        thermalRange: [-40, 85],
        reliability: 100000,
      },
      ccceMetrics: { ...this.ccceState },
    };

    this.circuits.set(id, circuit);
    return circuit;
  }

  // ==========================================================================
  // Waveguide Design
  // ==========================================================================

  /**
   * Design single-mode waveguide for target wavelength
   */
  designWaveguide(
    circuitId: string,
    material: WaveguideMaterial,
    wavelength: number,               // nm
    type: Waveguide['type'] = 'strip'
  ): Waveguide {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `WG-${Date.now().toString(36)}-${circuit.waveguides.length}`;

    // Get material properties
    const coreMat = WAVEGUIDE_MATERIALS[material.core];
    if (!coreMat) {
      throw new Error(`Unknown core material: ${material.core}`);
    }

    const nCore = coreMat.index(wavelength);
    const nClad = material.cladding === 'air' ? 1.0 :
                 material.cladding === 'SiO2' ? 1.46 :
                 WAVEGUIDE_MATERIALS[material.cladding]?.index(wavelength) || 1.5;

    // Calculate single-mode dimensions
    // V-number criterion: V = (2π/λ) * w * sqrt(n_core² - n_clad²) < π
    const deltaN = Math.sqrt(nCore * nCore - nClad * nClad);
    const maxWidth = (wavelength * 1e-9 * Math.PI) / (2 * Math.PI * deltaN) * 1e9;  // nm

    // Target 70-80% of cutoff for robust single-mode
    const width = maxWidth * 0.75;
    const height = width * 0.8;  // Aspect ratio for good confinement

    // Calculate effective index (approximation)
    const confinement = 1 - Math.exp(-width / (wavelength * 0.5));
    const effectiveIndex = nClad + (nCore - nClad) * confinement;

    // Group index (approximation from dispersion)
    const dn_dlambda = 0.02 / 100;  // nm⁻¹ typical
    const groupIndex = effectiveIndex - wavelength * dn_dlambda;

    // Calculate minimum bend radius for <0.1 dB loss
    const bendRadius = wavelength * 10 / (deltaN * deltaN);  // μm

    const waveguide: Waveguide = {
      id,
      type,
      material,
      dimensions: {
        width,
        height,
        etchDepth: type === 'rib' ? height * 0.6 : undefined,
        slotWidth: type === 'slot' ? 100 : undefined,
      },
      mode: {
        type: 'TE',
        order: 0,
        effectiveIndex,
        groupIndex,
        confinement,
      },
      routing: {
        path: [],
        totalLength: 0,
        bendCount: 0,
        minBendRadius: bendRadius,
      },
      performance: {
        propagationLoss: coreMat.loss(wavelength),
        bendLoss: 0.05,
        couplingLoss: 3,
        wavelengthRange: [wavelength - 25, wavelength + 25],
        dispersion: 100,
      },
    };

    circuit.waveguides.push(waveguide);
    return waveguide;
  }

  /**
   * Add routing to waveguide
   */
  addWaveguideRouting(
    circuitId: string,
    waveguideId: string,
    startPos: Position2D,
    endPos: Position2D
  ): void {
    const circuit = this.circuits.get(circuitId);
    const waveguide = circuit?.waveguides.find(w => w.id === waveguideId);
    if (!waveguide) return;

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Simple Manhattan routing with bends
    const needsBend = Math.abs(dx) > 1 && Math.abs(dy) > 1;

    if (needsBend) {
      // Add horizontal segment
      waveguide.routing.path.push({
        type: 'straight',
        length: Math.abs(dx),
        parameters: { direction: dx > 0 ? 0 : 180 },
      });

      // Add 90° bend
      waveguide.routing.path.push({
        type: 'bend',
        length: Math.PI * waveguide.routing.minBendRadius / 2,
        parameters: { radius: waveguide.routing.minBendRadius, angle: 90 },
      });
      waveguide.routing.bendCount++;

      // Add vertical segment
      waveguide.routing.path.push({
        type: 'straight',
        length: Math.abs(dy),
        parameters: { direction: dy > 0 ? 90 : 270 },
      });
    } else {
      // Direct connection
      waveguide.routing.path.push({
        type: 'straight',
        length: distance,
        parameters: { direction: Math.atan2(dy, dx) * 180 / Math.PI },
      });
    }

    waveguide.routing.totalLength = waveguide.routing.path.reduce((sum, s) => sum + s.length, 0);
  }

  // ==========================================================================
  // Component Design
  // ==========================================================================

  /**
   * Add MMI coupler (multimode interference)
   */
  addMMICoupler(
    circuitId: string,
    position: Position2D,
    numInputs: number,
    numOutputs: number,
    wavelength: number
  ): PhotonicComponent {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `MMI-${Date.now().toString(36)}`;

    // MMI length calculation (beat length)
    const referenceWG = circuit.waveguides[0];
    const neff = referenceWG?.mode.effectiveIndex || 2.0;
    const wMMI = 5000;  // nm (MMI width)
    const Lπ = (4 * neff * wMMI * wMMI) / (3 * wavelength);  // beat length in nm

    // N×M coupler length
    const length = numInputs === numOutputs ? Lπ : (3 * Lπ) / (4 * numOutputs);

    // Generate ports
    const ports: Port[] = [];
    const inputSpacing = wMMI / (numInputs + 1);
    const outputSpacing = wMMI / (numOutputs + 1);

    for (let i = 0; i < numInputs; i++) {
      ports.push({
        id: `in${i}`,
        position: { x: position.x, y: position.y - wMMI/2000 + inputSpacing * (i + 1) / 1000 },
        direction: 180,
      });
    }

    for (let i = 0; i < numOutputs; i++) {
      ports.push({
        id: `out${i}`,
        position: { x: position.x + length / 1000, y: position.y - wMMI/2000 + outputSpacing * (i + 1) / 1000 },
        direction: 0,
      });
    }

    const component: PhotonicComponent = {
      id,
      type: 'mmi-coupler',
      position,
      ports,
      specifications: {
        footprint: { width: length / 1000, height: wMMI / 1000 },
        operatingWavelength: wavelength,
        bandwidth: 30,
        insertionLoss: 0.5 + 0.2 * (numInputs + numOutputs),
        numInputs,
        numOutputs,
        mmiWidth: wMMI,
        mmiLength: length,
      },
      performance: {
        throughput: Math.pow(0.95, numInputs),
        isolation: 20,
        bandwidth: 30,
        powerHandling: 100,
      },
    };

    circuit.components.push(component);
    return component;
  }

  /**
   * Add ring resonator
   */
  addRingResonator(
    circuitId: string,
    position: Position2D,
    radius: number,                   // μm
    wavelength: number,
    couplingGap: number = 200         // nm
  ): PhotonicComponent {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `RING-${Date.now().toString(36)}`;

    const referenceWG = circuit.waveguides[0];
    const neff = referenceWG?.mode.effectiveIndex || 2.0;
    const ng = referenceWG?.mode.groupIndex || 2.2;

    // Calculate FSR (Free Spectral Range)
    const circumference = 2 * Math.PI * radius * 1000;  // nm
    const fsr = wavelength * wavelength / (ng * circumference);  // nm

    // Calculate Q factor (approximation)
    const alpha = 0.5;  // dB/cm loss
    const roundTripLoss = alpha * (circumference / 1e7);  // dB
    const coupling = Math.exp(-couplingGap / 100);  // coupling coefficient
    const Q = (Math.PI * ng * circumference) / (wavelength * (1 - coupling * Math.exp(-roundTripLoss / 8.686)));

    const ports: Port[] = [
      { id: 'input', position: { x: position.x - radius, y: position.y }, direction: 180 },
      { id: 'through', position: { x: position.x + radius, y: position.y }, direction: 0 },
      { id: 'drop', position: { x: position.x + radius, y: position.y + radius * 2 + 1 }, direction: 0 },
      { id: 'add', position: { x: position.x - radius, y: position.y + radius * 2 + 1 }, direction: 180 },
    ];

    const component: PhotonicComponent = {
      id,
      type: 'ring-resonator',
      position,
      ports,
      specifications: {
        footprint: { width: radius * 2 + 2, height: radius * 2 + 2 },
        operatingWavelength: wavelength,
        bandwidth: wavelength / Q,
        insertionLoss: roundTripLoss,
        radius,
        fsr,
        qFactor: Q,
        couplingGap,
      },
      performance: {
        throughput: 1 - coupling,
        isolation: 10 * Math.log10(Q / 1000),
        bandwidth: wavelength / Q,
        powerHandling: 50,
      },
    };

    circuit.components.push(component);
    return component;
  }

  /**
   * Add grating coupler
   */
  addGratingCoupler(
    circuitId: string,
    position: Position2D,
    wavelength: number,
    fiberAngle: number = 10           // degrees
  ): PhotonicComponent {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `GC-${Date.now().toString(36)}`;

    const referenceWG = circuit.waveguides[0];
    const neff = referenceWG?.mode.effectiveIndex || 2.0;

    // Grating period calculation (Bragg condition)
    // n_eff = n_fiber * sin(θ) + m * λ / Λ
    const nFiber = 1.46;  // SMF effective index
    const period = wavelength / (neff - nFiber * Math.sin(fiberAngle * Math.PI / 180));

    // Typical grating dimensions
    const numPeriods = 20;
    const gratingLength = numPeriods * period / 1000;  // μm
    const gratingWidth = 12;  // μm (to match fiber mode)

    const ports: Port[] = [
      { id: 'waveguide', position: { x: position.x, y: position.y }, direction: 0 },
      { id: 'fiber', position: { x: position.x + gratingLength / 2, y: position.y + 5 }, direction: 90 - fiberAngle },
    ];

    const component: PhotonicComponent = {
      id,
      type: 'grating-coupler',
      position,
      ports,
      specifications: {
        footprint: { width: gratingLength, height: gratingWidth },
        operatingWavelength: wavelength,
        bandwidth: 40,
        insertionLoss: 4,  // dB (typical for UV)
        period: period,
        dutyCycle: 0.5,
        etchDepth: 150,
        fiberAngle,
      },
      performance: {
        throughput: 0.4,  // 4 dB loss
        isolation: 15,
        bandwidth: 40,
        powerHandling: 200,
      },
    };

    circuit.components.push(component);
    return component;
  }

  // ==========================================================================
  // Light Sources
  // ==========================================================================

  /**
   * Add UV LED source
   */
  addUVLED(
    circuitId: string,
    wavelength: number,               // nm
    power: number                     // mW
  ): LightSource {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `LED-${Date.now().toString(36)}`;

    // Determine material system based on wavelength
    let activeLayer: string;
    if (wavelength < 280) {
      activeLayer = 'AlGaN/AlN MQW (high Al)';
    } else if (wavelength < 365) {
      activeLayer = 'AlGaN/GaN MQW';
    } else {
      activeLayer = 'InGaN/GaN MQW';
    }

    // Efficiency degrades at shorter wavelengths
    const efficiency = wavelength < 300 ? 0.02 :
                      wavelength < 350 ? 0.05 :
                      wavelength < 400 ? 0.1 : 0.3;

    const source: LightSource = {
      id,
      type: wavelength < 300 ? 'microLED' : 'LED',
      material: {
        activeLayer,
        substrate: wavelength < 300 ? 'AlN' : 'sapphire',
        emissionType: 'surface',
      },
      wavelength,
      linewidth: 15,  // nm FWHM
      power,
      efficiency,
      modulation: {
        type: 'direct',
        bandwidth: 0.5,  // GHz
        extinctionRatio: 10,
      },
    };

    circuit.sources.push(source);
    return source;
  }

  /**
   * Add laser diode
   */
  addLaserDiode(
    circuitId: string,
    wavelength: number,
    power: number
  ): LightSource {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `LD-${Date.now().toString(36)}`;

    // UV laser diodes are challenging - typically need GaN or AlGaN
    const activeLayer = wavelength < 365 ? 'AlGaN/GaN MQW' : 'InGaN/GaN MQW';

    const source: LightSource = {
      id,
      type: 'laser-diode',
      material: {
        activeLayer,
        substrate: 'GaN',
        emissionType: 'edge',
      },
      wavelength,
      linewidth: 0.1,  // nm (narrow for laser)
      power,
      efficiency: 0.15,
      modulation: {
        type: 'direct',
        bandwidth: 5,  // GHz
        extinctionRatio: 15,
      },
    };

    circuit.sources.push(source);
    return source;
  }

  // ==========================================================================
  // Photodetectors
  // ==========================================================================

  /**
   * Add UV photodetector
   */
  addPhotodetector(
    circuitId: string,
    type: Photodetector['type'],
    wavelength: number,
    activeArea: number = 100          // μm²
  ): Photodetector {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    const id = `PD-${Date.now().toString(36)}`;

    // Select absorber material based on wavelength
    let absorber: DetectorMaterial['absorber'];
    let cutoff: number;

    if (wavelength < 280) {
      absorber = 'AlGaN';  // High Al content
      cutoff = 280;
    } else if (wavelength < 365) {
      absorber = 'GaN';
      cutoff = 365;
    } else if (wavelength < 450) {
      absorber = 'InGaN';
      cutoff = 450;
    } else {
      absorber = 'Si';
      cutoff = 1100;
    }

    // Responsivity calculation
    const quantumEfficiency = type === 'APD' ? 0.8 : 0.5;
    const gain = type === 'APD' ? 50 : 1;
    const responsivity = (wavelength / 1240) * quantumEfficiency * gain;  // A/W

    // Bandwidth depends on device type and area
    const bandwidth = type === 'MSM' ? 10 :
                     type === 'PIN' ? 5 :
                     type === 'APD' ? 2 : 0.1;  // GHz

    // Dark current (increases with temperature)
    const darkCurrent = type === 'APD' ? 10 : 0.1;  // nA

    // NEP calculation
    const nep = Math.sqrt(2 * 1.6e-19 * darkCurrent * 1e-9 * bandwidth * 1e9) / responsivity;

    const detector: Photodetector = {
      id,
      type,
      material: {
        absorber,
        cutoffWavelength: cutoff,
      },
      responsivity,
      darkCurrent,
      bandwidth,
      nep,
      activeArea,
    };

    circuit.detectors.push(detector);
    return detector;
  }

  // ==========================================================================
  // Simulation
  // ==========================================================================

  /**
   * Simulate circuit transmission
   */
  simulate(
    circuitId: string,
    inputWavelength: number,
    inputPower: number                // mW
  ): SimulationResult {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) {
      throw new Error(`Circuit ${circuitId} not found`);
    }

    // Calculate total loss through circuit
    let totalLoss = 0;

    // Waveguide losses
    for (const wg of circuit.waveguides) {
      const propagationLoss = wg.performance.propagationLoss * (wg.routing.totalLength / 10000);  // dB
      const bendLoss = wg.performance.bendLoss * wg.routing.bendCount;
      totalLoss += propagationLoss + bendLoss;
    }

    // Component losses
    for (const comp of circuit.components) {
      totalLoss += comp.specifications.insertionLoss as number;
    }

    // Calculate output powers
    const outputPowers: Record<string, number> = {};
    const transmissionFactor = Math.pow(10, -totalLoss / 10);

    // Find output components (grating couplers, edge couplers)
    const outputs = circuit.components.filter(c =>
      c.type === 'grating-coupler' || c.type === 'edge-coupler'
    );

    if (outputs.length > 0) {
      const powerPerOutput = inputPower * transmissionFactor / outputs.length;
      for (const out of outputs) {
        outputPowers[out.id] = powerPerOutput;
      }
    } else {
      outputPowers['through'] = inputPower * transmissionFactor;
    }

    // Build transmission matrix
    const n = circuit.components.length + 2;  // +2 for input/output
    const transmissionMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
    const phaseMatrix = Array(n).fill(null).map(() => Array(n).fill(0));

    // Simplified: set diagonal to transmission factor
    for (let i = 0; i < n; i++) {
      transmissionMatrix[i][i] = transmissionFactor;
    }

    // Mode profiles for waveguides
    const modeProfiles: ModeProfile[] = circuit.waveguides.map(wg => ({
      waveguideId: wg.id,
      wavelength: inputWavelength,
      effectiveIndex: wg.mode.effectiveIndex,
      fieldDistribution: {
        real: [[1]],
        imag: [[0]],
        gridX: [0],
        gridY: [0],
      },
      confinementFactor: wg.mode.confinement,
    }));

    // Update circuit performance
    circuit.performance.totalLoss = totalLoss;

    // Update CCCE based on simulation quality
    const efficiency = transmissionFactor;
    circuit.ccceMetrics.lambda = 0.8 + efficiency * 0.2;
    circuit.ccceMetrics.gamma = GAMMA_FIXED + (1 - efficiency) * 0.1;
    circuit.ccceMetrics.xi = (circuit.ccceMetrics.lambda * circuit.ccceMetrics.phi) /
                            Math.max(circuit.ccceMetrics.gamma, 0.001);

    const result: SimulationResult = {
      circuitId,
      wavelength: inputWavelength,
      inputPower,
      outputPowers,
      transmissionMatrix,
      phaseMatrix,
      modeProfiles,
      ccceMetrics: { ...circuit.ccceMetrics },
    };

    // Store simulation
    if (!this.simulations.has(circuitId)) {
      this.simulations.set(circuitId, []);
    }
    this.simulations.get(circuitId)!.push(result);

    return result;
  }

  /**
   * Wavelength sweep simulation
   */
  wavelengthSweep(
    circuitId: string,
    startWavelength: number,
    endWavelength: number,
    steps: number,
    inputPower: number
  ): SimulationResult[] {
    const results: SimulationResult[] = [];
    const stepSize = (endWavelength - startWavelength) / (steps - 1);

    for (let i = 0; i < steps; i++) {
      const wavelength = startWavelength + i * stepSize;
      results.push(this.simulate(circuitId, wavelength, inputPower));
    }

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
    return this.getMetrics();
  }

  /**
   * Get all circuits
   */
  getCircuits(): PhotonicCircuit[] {
    return Array.from(this.circuits.values());
  }

  /**
   * Get circuit by ID
   */
  getCircuit(id: string): PhotonicCircuit | undefined {
    return this.circuits.get(id);
  }

  /**
   * Get simulations for circuit
   */
  getSimulations(circuitId: string): SimulationResult[] {
    return this.simulations.get(circuitId) || [];
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const uvPhotonicsEngine = new UVPhotonicsEngine();
