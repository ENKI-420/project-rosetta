/**
 * DARPA BTO Topic 11: Unlocking Next Generation Separations
 * Solicitation: DARPA-RA-25-02-11
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Advanced separation technologies
 * - Membrane-based separations
 * - Molecular sieving
 * - Ion exchange and chromatography
 * - CCCE-guided process optimization
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Separation Physics Constants
// ============================================================================

export const SEPARATION_CONSTANTS = {
  // Gas constants
  R_GAS: 8.314,                       // J/(mol·K)
  AVOGADRO: 6.022e23,                 // mol⁻¹
  BOLTZMANN: 1.38065e-23,             // J/K

  // Membrane properties
  KNUDSEN_THRESHOLD: 0.1,             // Kn > 0.1 for Knudsen diffusion
  VISCOUS_THRESHOLD: 0.01,            // Kn < 0.01 for viscous flow

  // Separation metrics targets
  TARGET_SELECTIVITY: 100,            // For gas pairs
  TARGET_PERMEANCE: 1000,             // GPU
  TARGET_RECOVERY: 0.95,              // 95% recovery

  // Process parameters
  STANDARD_TEMP: 298.15,              // K
  STANDARD_PRESSURE: 101325,          // Pa

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_SEPARATION: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface SeparationSystem {
  id: string;
  type: 'membrane' | 'adsorption' | 'distillation' | 'chromatography' | 'extraction';
  feedStream: ProcessStream;
  products: ProcessStream[];
  equipment: SeparationEquipment[];
  operatingConditions: OperatingConditions;
  performance: SeparationPerformance;
  ccceMetrics: CCCEMetrics;
}

export interface ProcessStream {
  id: string;
  components: Component[];
  flowRate: number;                   // mol/s
  temperature: number;                // K
  pressure: number;                   // Pa
  phase: 'gas' | 'liquid' | 'supercritical' | 'mixed';
}

export interface Component {
  name: string;
  moleFraction: number;
  molecularWeight: number;            // g/mol
  kineticDiameter: number;            // m
  criticalTemp: number;               // K
  criticalPressure: number;           // Pa
  dipoleMoment: number;               // Debye
  polarizability: number;             // Å³
}

export interface SeparationEquipment {
  id: string;
  type: 'membrane-module' | 'packed-bed' | 'column' | 'exchanger' | 'reactor';
  specifications: EquipmentSpecs;
  material: MaterialProperties;
}

export interface EquipmentSpecs {
  area?: number;                      // m² (for membranes)
  volume?: number;                    // m³ (for beds)
  length?: number;                    // m
  diameter?: number;                  // m
  stages?: number;                    // For multi-stage
  pressure: number;                   // Pa (design)
  temperature: number;                // K (design)
}

export interface MaterialProperties {
  name: string;
  type: 'polymer' | 'ceramic' | 'metallic' | 'MOF' | 'zeolite' | 'carbon';
  poreSize: number;                   // m
  porosity: number;                   // void fraction
  surfaceArea: number;                // m²/g
  thermalConductivity: number;        // W/(m·K)
  chemicalStability: number;          // 0-1
}

export interface OperatingConditions {
  feedPressure: number;               // Pa
  permeatePressure: number;           // Pa (for membranes)
  temperature: number;                // K
  sweepGasRate?: number;              // mol/s
  regenerationCycle?: number;         // s (for adsorption)
}

export interface SeparationPerformance {
  recovery: Record<string, number>;   // Component recovery %
  purity: Record<string, number>;     // Product purity %
  selectivity: Record<string, number>;// Separation factor
  energyConsumption: number;          // kWh/mol product
  productivity: number;               // mol/(m²·s) or mol/(m³·s)
  efficiency: number;                 // 0-1 thermodynamic efficiency
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface Membrane {
  id: string;
  type: 'dense' | 'porous' | 'mixed-matrix' | 'facilitated';
  material: MaterialProperties;
  thickness: number;                  // m
  area: number;                       // m²
  permeability: Record<string, number>;  // Barrer
  selectivity: Record<string, number>;   // Pair selectivity
  performance: MembranePerformance;
}

export interface MembranePerformance {
  flux: number;                       // mol/(m²·s)
  permeance: Record<string, number>;  // mol/(m²·s·Pa)
  separationFactor: number;
  stagecut: number;                   // permeate/feed ratio
  pressureRatio: number;
}

export interface Adsorbent {
  id: string;
  type: 'zeolite' | 'MOF' | 'activated-carbon' | 'silica-gel' | 'alumina';
  material: MaterialProperties;
  isotherms: Record<string, AdsorptionIsotherm>;
  kinetics: Record<string, AdsorptionKinetics>;
  capacity: Record<string, number>;   // mol/kg at saturation
}

export interface AdsorptionIsotherm {
  model: 'langmuir' | 'freundlich' | 'sips' | 'dsl';
  parameters: Record<string, number>;
  maxLoading: number;                 // mol/kg
  heatOfAdsorption: number;           // kJ/mol
}

export interface AdsorptionKinetics {
  model: 'LDF' | 'pore-diffusion' | 'surface-diffusion';
  massTransferCoeff: number;          // 1/s
  diffusionCoeff: number;             // m²/s
}

export interface PSAcycle {
  id: string;
  adsorbentId: string;
  steps: PSAstep[];
  cycleTime: number;                  // s
  productivity: number;               // mol/(kg·s)
  recovery: number;                   // %
  purity: number;                     // %
}

export interface PSAstep {
  name: 'pressurization' | 'adsorption' | 'depressurization' | 'purge' | 'equalization';
  duration: number;                   // s
  pressure: number;                   // Pa
  flowDirection: 'forward' | 'reverse';
}

export interface DistillationColumn {
  id: string;
  type: 'binary' | 'multicomponent' | 'extractive' | 'reactive';
  numStages: number;
  feedStage: number;
  refluxRatio: number;
  boilupRatio: number;
  stageEfficiency: number;            // Murphree efficiency
  vaporLiquidEquilibrium: VLEmodel;
}

export interface VLEmodel {
  type: 'ideal' | 'NRTL' | 'UNIQUAC' | 'SRK' | 'PR';
  parameters: Record<string, number[]>;
}

export interface ChromatographyColumn {
  id: string;
  type: 'HPLC' | 'GC' | 'ion-exchange' | 'SEC' | 'affinity';
  stationaryPhase: MaterialProperties;
  mobilePhase: ProcessStream;
  length: number;                     // m
  diameter: number;                   // m
  particleSize: number;               // m
  plateCount: number;                 // theoretical plates
  resolution: Record<string, number>; // between pairs
}

export interface SimulationResult {
  systemId: string;
  converged: boolean;
  iterations: number;
  materialBalance: MaterialBalance;
  energyBalance: EnergyBalance;
  performance: SeparationPerformance;
  profiles: ConcentrationProfile[];
  ccceEvolution: CCCEMetrics[];
}

export interface MaterialBalance {
  feedIn: number;                     // mol/s
  productsOut: number;                // mol/s
  loss: number;                       // mol/s
  closureError: number;               // %
}

export interface EnergyBalance {
  heatInput: number;                  // W
  workInput: number;                  // W
  heatRejected: number;               // W
  efficiency: number;                 // %
}

export interface ConcentrationProfile {
  componentName: string;
  position: number[];                 // normalized position
  concentration: number[];            // mol/m³ or mol fraction
}

// ============================================================================
// Common Molecules Database
// ============================================================================

export const MOLECULES: Record<string, Component> = {
  N2: {
    name: 'Nitrogen',
    moleFraction: 0,
    molecularWeight: 28.01,
    kineticDiameter: 3.64e-10,
    criticalTemp: 126.2,
    criticalPressure: 3.39e6,
    dipoleMoment: 0,
    polarizability: 1.76,
  },
  O2: {
    name: 'Oxygen',
    moleFraction: 0,
    molecularWeight: 32.00,
    kineticDiameter: 3.46e-10,
    criticalTemp: 154.6,
    criticalPressure: 5.04e6,
    dipoleMoment: 0,
    polarizability: 1.60,
  },
  CO2: {
    name: 'Carbon Dioxide',
    moleFraction: 0,
    molecularWeight: 44.01,
    kineticDiameter: 3.30e-10,
    criticalTemp: 304.1,
    criticalPressure: 7.38e6,
    dipoleMoment: 0,
    polarizability: 2.91,
  },
  CH4: {
    name: 'Methane',
    moleFraction: 0,
    molecularWeight: 16.04,
    kineticDiameter: 3.80e-10,
    criticalTemp: 190.6,
    criticalPressure: 4.60e6,
    dipoleMoment: 0,
    polarizability: 2.59,
  },
  H2: {
    name: 'Hydrogen',
    moleFraction: 0,
    molecularWeight: 2.02,
    kineticDiameter: 2.89e-10,
    criticalTemp: 33.2,
    criticalPressure: 1.30e6,
    dipoleMoment: 0,
    polarizability: 0.80,
  },
  H2O: {
    name: 'Water',
    moleFraction: 0,
    molecularWeight: 18.02,
    kineticDiameter: 2.65e-10,
    criticalTemp: 647.1,
    criticalPressure: 22.06e6,
    dipoleMoment: 1.85,
    polarizability: 1.45,
  },
  He: {
    name: 'Helium',
    moleFraction: 0,
    molecularWeight: 4.00,
    kineticDiameter: 2.60e-10,
    criticalTemp: 5.2,
    criticalPressure: 0.23e6,
    dipoleMoment: 0,
    polarizability: 0.20,
  },
  Ar: {
    name: 'Argon',
    moleFraction: 0,
    molecularWeight: 39.95,
    kineticDiameter: 3.40e-10,
    criticalTemp: 150.9,
    criticalPressure: 4.87e6,
    dipoleMoment: 0,
    polarizability: 1.64,
  },
};

// ============================================================================
// Membrane Materials Database
// ============================================================================

export const MEMBRANE_MATERIALS: Record<string, MaterialProperties> = {
  'PDMS': {
    name: 'Polydimethylsiloxane',
    type: 'polymer',
    poreSize: 0,  // Dense polymer
    porosity: 0,
    surfaceArea: 0,
    thermalConductivity: 0.15,
    chemicalStability: 0.7,
  },
  'PIM-1': {
    name: 'Polymer of Intrinsic Microporosity',
    type: 'polymer',
    poreSize: 0.8e-9,
    porosity: 0.25,
    surfaceArea: 800,
    thermalConductivity: 0.2,
    chemicalStability: 0.8,
  },
  'CMS': {
    name: 'Carbon Molecular Sieve',
    type: 'carbon',
    poreSize: 0.5e-9,
    porosity: 0.3,
    surfaceArea: 500,
    thermalConductivity: 1.0,
    chemicalStability: 0.9,
  },
  'Zeolite-13X': {
    name: 'Zeolite 13X',
    type: 'zeolite',
    poreSize: 1.0e-9,
    porosity: 0.45,
    surfaceArea: 700,
    thermalConductivity: 0.3,
    chemicalStability: 0.95,
  },
  'MOF-5': {
    name: 'Metal-Organic Framework 5',
    type: 'MOF',
    poreSize: 1.5e-9,
    porosity: 0.79,
    surfaceArea: 3800,
    thermalConductivity: 0.1,
    chemicalStability: 0.6,
  },
  'ZIF-8': {
    name: 'Zeolitic Imidazolate Framework 8',
    type: 'MOF',
    poreSize: 0.34e-9,
    porosity: 0.48,
    surfaceArea: 1600,
    thermalConductivity: 0.15,
    chemicalStability: 0.85,
  },
};

// ============================================================================
// Next Generation Separations Engine
// ============================================================================

export class SeparationsEngine {
  private systems: Map<string, SeparationSystem> = new Map();
  private membranes: Map<string, Membrane> = new Map();
  private adsorbents: Map<string, Adsorbent> = new Map();
  private simulations: Map<string, SimulationResult> = new Map();
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
  // Membrane Creation & Modeling
  // ==========================================================================

  /**
   * Create gas separation membrane
   */
  createMembrane(
    materialName: string,
    thickness: number,              // m
    area: number                    // m²
  ): Membrane {
    const id = `MEM-${Date.now().toString(36)}`;
    const material = MEMBRANE_MATERIALS[materialName] || MEMBRANE_MATERIALS['PDMS'];

    // Calculate permeabilities based on material type
    const permeability = this.calculatePermeabilities(material);
    const selectivity = this.calculateSelectivities(permeability);

    const membrane: Membrane = {
      id,
      type: material.poreSize > 0 ? 'porous' : 'dense',
      material,
      thickness,
      area,
      permeability,
      selectivity,
      performance: {
        flux: 0,
        permeance: {},
        separationFactor: 0,
        stagecut: 0,
        pressureRatio: 1,
      },
    };

    this.membranes.set(id, membrane);
    return membrane;
  }

  private calculatePermeabilities(material: MaterialProperties): Record<string, number> {
    // Permeability in Barrer (10^-10 cm³(STP)·cm / (cm²·s·cmHg))
    const basePermeabilities: Record<string, number> = {
      N2: 250,
      O2: 600,
      CO2: 3000,
      CH4: 800,
      H2: 5000,
      H2O: 40000,
      He: 20000,
    };

    // Adjust based on material properties
    const poreFactor = material.poreSize > 0 ? Math.exp(material.porosity) : 1;
    const surfaceFactor = 1 + material.surfaceArea / 1000;

    const permeability: Record<string, number> = {};
    for (const [gas, base] of Object.entries(basePermeabilities)) {
      permeability[gas] = base * poreFactor * surfaceFactor *
                         (material.chemicalStability * 0.5 + 0.5);
    }

    return permeability;
  }

  private calculateSelectivities(permeability: Record<string, number>): Record<string, number> {
    const selectivity: Record<string, number> = {};

    // Common separation pairs
    const pairs = [
      ['CO2', 'N2'],
      ['CO2', 'CH4'],
      ['O2', 'N2'],
      ['H2', 'CO2'],
      ['H2', 'CH4'],
      ['H2', 'N2'],
    ];

    for (const [a, b] of pairs) {
      if (permeability[a] && permeability[b]) {
        selectivity[`${a}/${b}`] = permeability[a] / permeability[b];
      }
    }

    return selectivity;
  }

  /**
   * Simulate membrane separation
   */
  simulateMembraneSeparation(
    membraneId: string,
    feed: ProcessStream,
    permeatePressure: number        // Pa
  ): SimulationResult {
    const membrane = this.membranes.get(membraneId);
    if (!membrane) {
      throw new Error(`Membrane ${membraneId} not found`);
    }

    const { area, thickness, permeability } = membrane;
    const feedPressure = feed.pressure;
    const temperature = feed.temperature;
    const pressureRatio = feedPressure / permeatePressure;

    // Calculate permeance (mol/(m²·s·Pa))
    const permeance: Record<string, number> = {};
    for (const [gas, perm] of Object.entries(permeability)) {
      // Convert Barrer to mol/(m²·s·Pa)
      // 1 Barrer = 3.35e-16 mol/(m·s·Pa)
      permeance[gas] = perm * 3.35e-16 / thickness;
    }

    // Mass balance for each component
    const recovery: Record<string, number> = {};
    const profiles: ConcentrationProfile[] = [];
    const ccceEvolution: CCCEMetrics[] = [{ ...this.ccceState }];

    let totalPermeateFlow = 0;
    let totalRetentateFlow = 0;

    for (const comp of feed.components) {
      const perm = permeance[comp.name] || permeance['N2'];
      const partialPressureFeed = comp.moleFraction * feedPressure;
      const partialPressurePerm = comp.moleFraction * permeatePressure * 0.5;  // Approximation

      // Flux for this component
      const flux = perm * (partialPressureFeed - partialPressurePerm);
      const permeateFlow = flux * area;
      const feedFlow = comp.moleFraction * feed.flowRate;

      recovery[comp.name] = Math.min(0.99, permeateFlow / feedFlow);
      totalPermeateFlow += permeateFlow;
      totalRetentateFlow += feedFlow - permeateFlow;

      profiles.push({
        componentName: comp.name,
        position: [0, 0.25, 0.5, 0.75, 1],
        concentration: [
          comp.moleFraction,
          comp.moleFraction * (1 - recovery[comp.name] * 0.25),
          comp.moleFraction * (1 - recovery[comp.name] * 0.5),
          comp.moleFraction * (1 - recovery[comp.name] * 0.75),
          comp.moleFraction * (1 - recovery[comp.name]),
        ],
      });
    }

    // Calculate purity
    const purity: Record<string, number> = {};
    for (const comp of feed.components) {
      const permFlow = recovery[comp.name] * comp.moleFraction * feed.flowRate;
      purity[comp.name] = permFlow / totalPermeateFlow;
    }

    // Energy consumption (compression work)
    const compressionWork = feed.flowRate * SEPARATION_CONSTANTS.R_GAS * temperature *
                           Math.log(pressureRatio) / 0.8;  // 80% efficiency
    const energyConsumption = compressionWork / (totalPermeateFlow * 3600);  // kWh/mol

    // Update membrane performance
    membrane.performance = {
      flux: totalPermeateFlow / area,
      permeance,
      separationFactor: Math.max(...Object.values(membrane.selectivity)),
      stagecut: totalPermeateFlow / feed.flowRate,
      pressureRatio,
    };

    // Update CCCE
    const separationQuality = Object.values(recovery).reduce((a, b) => a + b, 0) / Object.keys(recovery).length;
    const newCCCE: CCCEMetrics = {
      lambda: separationQuality,
      phi: this.ccceState.phi,
      gamma: (1 - separationQuality) * 0.3 + GAMMA_FIXED,
      xi: 0,
      timestamp: Date.now(),
    };
    newCCCE.xi = (newCCCE.lambda * newCCCE.phi) / Math.max(newCCCE.gamma, 0.001);
    ccceEvolution.push(newCCCE);

    const result: SimulationResult = {
      systemId: membraneId,
      converged: true,
      iterations: 10,
      materialBalance: {
        feedIn: feed.flowRate,
        productsOut: totalPermeateFlow + totalRetentateFlow,
        loss: feed.flowRate - totalPermeateFlow - totalRetentateFlow,
        closureError: Math.abs(1 - (totalPermeateFlow + totalRetentateFlow) / feed.flowRate) * 100,
      },
      energyBalance: {
        heatInput: 0,
        workInput: compressionWork,
        heatRejected: compressionWork * 0.2,
        efficiency: separationQuality * 100,
      },
      performance: {
        recovery,
        purity,
        selectivity: membrane.selectivity,
        energyConsumption,
        productivity: totalPermeateFlow / area,
        efficiency: separationQuality,
      },
      profiles,
      ccceEvolution,
    };

    this.simulations.set(membraneId, result);
    return result;
  }

  // ==========================================================================
  // Adsorption / PSA Systems
  // ==========================================================================

  /**
   * Create adsorbent material
   */
  createAdsorbent(
    materialName: string,
    targetGases: string[]
  ): Adsorbent {
    const id = `ADS-${Date.now().toString(36)}`;
    const material = MEMBRANE_MATERIALS[materialName] || MEMBRANE_MATERIALS['Zeolite-13X'];

    // Generate isotherms for target gases
    const isotherms: Record<string, AdsorptionIsotherm> = {};
    const kinetics: Record<string, AdsorptionKinetics> = {};
    const capacity: Record<string, number> = {};

    for (const gas of targetGases) {
      const mol = MOLECULES[gas];
      if (!mol) continue;

      // Langmuir isotherm parameters
      const qmax = material.surfaceArea * 0.001 * (1 / mol.kineticDiameter);  // mol/kg
      const b = Math.exp(20 / (mol.criticalTemp / 100)) * 1e-5;  // 1/Pa
      const heat = 20 + mol.polarizability * 5;  // kJ/mol

      isotherms[gas] = {
        model: 'langmuir',
        parameters: { qmax, b },
        maxLoading: qmax,
        heatOfAdsorption: heat,
      };

      kinetics[gas] = {
        model: 'LDF',
        massTransferCoeff: 0.1 / (mol.kineticDiameter * 1e9),  // 1/s
        diffusionCoeff: 1e-10 * (material.poreSize / mol.kineticDiameter),  // m²/s
      };

      capacity[gas] = qmax;
    }

    const adsorbent: Adsorbent = {
      id,
      type: material.type as Adsorbent['type'],
      material,
      isotherms,
      kinetics,
      capacity,
    };

    this.adsorbents.set(id, adsorbent);
    return adsorbent;
  }

  /**
   * Design PSA cycle
   */
  designPSAcycle(
    adsorbentId: string,
    feedPressure: number,           // Pa
    purgePress: number,             // Pa
    cycleTime: number               // s
  ): PSAcycle {
    const adsorbent = this.adsorbents.get(adsorbentId);
    if (!adsorbent) {
      throw new Error(`Adsorbent ${adsorbentId} not found`);
    }

    const id = `PSA-${Date.now().toString(36)}`;

    // 4-step Skarstrom cycle
    const steps: PSAstep[] = [
      {
        name: 'pressurization',
        duration: cycleTime * 0.15,
        pressure: feedPressure,
        flowDirection: 'forward',
      },
      {
        name: 'adsorption',
        duration: cycleTime * 0.35,
        pressure: feedPressure,
        flowDirection: 'forward',
      },
      {
        name: 'depressurization',
        duration: cycleTime * 0.15,
        pressure: purgePress,
        flowDirection: 'reverse',
      },
      {
        name: 'purge',
        duration: cycleTime * 0.35,
        pressure: purgePress,
        flowDirection: 'reverse',
      },
    ];

    // Estimate performance
    const pressureRatio = feedPressure / purgePress;
    const avgCapacity = Object.values(adsorbent.capacity).reduce((a, b) => a + b, 0) /
                       Object.keys(adsorbent.capacity).length;

    const productivity = avgCapacity * 0.3 / cycleTime;  // 30% working capacity
    const recovery = Math.min(0.95, 0.7 + 0.1 * Math.log10(pressureRatio));
    const purity = Math.min(0.999, 0.9 + 0.05 * Math.log10(pressureRatio));

    return {
      id,
      adsorbentId,
      steps,
      cycleTime,
      productivity,
      recovery,
      purity,
    };
  }

  /**
   * Simulate PSA process
   */
  simulatePSA(
    cycle: PSAcycle,
    feed: ProcessStream,
    bedVolume: number               // m³
  ): SimulationResult {
    const adsorbent = this.adsorbents.get(cycle.adsorbentId);
    if (!adsorbent) {
      throw new Error(`Adsorbent ${cycle.adsorbentId} not found`);
    }

    const ccceEvolution: CCCEMetrics[] = [{ ...this.ccceState }];
    const profiles: ConcentrationProfile[] = [];

    // Material balance
    const feedIn = feed.flowRate;
    const productFlow = feedIn * cycle.recovery;
    const wasteFlow = feedIn * (1 - cycle.recovery);

    // Energy balance (compression + regeneration heat)
    const compressionWork = feedIn * SEPARATION_CONSTANTS.R_GAS * feed.temperature *
                           Math.log(feed.pressure / (feed.pressure * 0.1)) / 0.75;

    // Regeneration heat
    let regenHeat = 0;
    for (const [gas, isotherm] of Object.entries(adsorbent.isotherms)) {
      const loading = isotherm.maxLoading * 0.3;  // Working capacity
      regenHeat += loading * isotherm.heatOfAdsorption * 1000;  // J/kg adsorbent
    }
    const bedMass = bedVolume * 800;  // Approximate bulk density
    const heatInput = regenHeat * bedMass / cycle.cycleTime;

    // Generate concentration profiles
    for (const comp of feed.components) {
      const iso = adsorbent.isotherms[comp.name];
      const selectivity = iso ? iso.maxLoading : 1;

      profiles.push({
        componentName: comp.name,
        position: [0, 0.2, 0.4, 0.6, 0.8, 1],
        concentration: [
          comp.moleFraction,
          comp.moleFraction * Math.exp(-selectivity * 0.2),
          comp.moleFraction * Math.exp(-selectivity * 0.4),
          comp.moleFraction * Math.exp(-selectivity * 0.6),
          comp.moleFraction * Math.exp(-selectivity * 0.8),
          comp.moleFraction * Math.exp(-selectivity * 1.0),
        ],
      });
    }

    // Performance metrics
    const recovery: Record<string, number> = {};
    const purity: Record<string, number> = {};

    for (const comp of feed.components) {
      const iso = adsorbent.isotherms[comp.name];
      if (iso && iso.maxLoading > Object.values(adsorbent.capacity).reduce((a, b) => a + b, 0) / 2) {
        // Strongly adsorbed - goes to waste
        recovery[comp.name] = 1 - cycle.recovery;
        purity[comp.name] = comp.moleFraction * (1 - cycle.recovery);
      } else {
        // Weakly adsorbed - goes to product
        recovery[comp.name] = cycle.recovery;
        purity[comp.name] = cycle.purity;
      }
    }

    // Update CCCE
    const newCCCE: CCCEMetrics = {
      lambda: cycle.recovery,
      phi: this.ccceState.phi,
      gamma: (1 - cycle.purity) * 0.3 + GAMMA_FIXED,
      xi: 0,
      timestamp: Date.now(),
    };
    newCCCE.xi = (newCCCE.lambda * newCCCE.phi) / Math.max(newCCCE.gamma, 0.001);
    ccceEvolution.push(newCCCE);

    const result: SimulationResult = {
      systemId: cycle.id,
      converged: true,
      iterations: 20,
      materialBalance: {
        feedIn,
        productsOut: productFlow + wasteFlow,
        loss: 0,
        closureError: 0,
      },
      energyBalance: {
        heatInput,
        workInput: compressionWork,
        heatRejected: heatInput * 0.8,
        efficiency: cycle.recovery * cycle.purity * 100,
      },
      performance: {
        recovery,
        purity,
        selectivity: {},
        energyConsumption: (compressionWork + heatInput) / (productFlow * 3600),
        productivity: cycle.productivity,
        efficiency: cycle.recovery * cycle.purity,
      },
      profiles,
      ccceEvolution,
    };

    this.simulations.set(cycle.id, result);
    return result;
  }

  // ==========================================================================
  // Separation System Creation
  // ==========================================================================

  /**
   * Create complete separation system
   */
  createSeparationSystem(
    type: SeparationSystem['type'],
    feed: ProcessStream,
    targetComponent: string,
    targetRecovery: number
  ): SeparationSystem {
    const id = `SEP-${Date.now().toString(36)}`;

    // Create appropriate equipment based on type
    const equipment: SeparationEquipment[] = [];

    if (type === 'membrane') {
      const membrane = this.createMembrane('ZIF-8', 1e-6, 100);
      equipment.push({
        id: membrane.id,
        type: 'membrane-module',
        specifications: {
          area: membrane.area,
          pressure: feed.pressure,
          temperature: feed.temperature,
        },
        material: membrane.material,
      });
    } else if (type === 'adsorption') {
      const ads = this.createAdsorbent('Zeolite-13X', feed.components.map(c => c.name));
      equipment.push({
        id: ads.id,
        type: 'packed-bed',
        specifications: {
          volume: 10,
          diameter: 1,
          length: 12.7,
          pressure: feed.pressure,
          temperature: feed.temperature,
        },
        material: ads.material,
      });
    }

    const system: SeparationSystem = {
      id,
      type,
      feedStream: feed,
      products: [],
      equipment,
      operatingConditions: {
        feedPressure: feed.pressure,
        permeatePressure: feed.pressure * 0.1,
        temperature: feed.temperature,
      },
      performance: {
        recovery: {},
        purity: {},
        selectivity: {},
        energyConsumption: 0,
        productivity: 0,
        efficiency: 0,
      },
      ccceMetrics: { ...this.ccceState },
    };

    this.systems.set(id, system);
    return system;
  }

  /**
   * Optimize separation system
   */
  optimizeSystem(systemId: string, objective: 'recovery' | 'purity' | 'energy' | 'cost'): SeparationSystem {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    // Simple optimization by adjusting operating conditions
    const { feedPressure, temperature } = system.operatingConditions;

    switch (objective) {
      case 'recovery':
        system.operatingConditions.permeatePressure = feedPressure * 0.05;  // Lower permeate pressure
        break;
      case 'purity':
        system.operatingConditions.permeatePressure = feedPressure * 0.2;   // Higher selectivity regime
        break;
      case 'energy':
        system.operatingConditions.permeatePressure = feedPressure * 0.3;   // Lower compression ratio
        break;
      case 'cost':
        // Balance recovery and energy
        system.operatingConditions.permeatePressure = feedPressure * 0.15;
        break;
    }

    // Update CCCE based on optimization
    system.ccceMetrics.lambda = Math.min(1, system.ccceMetrics.lambda * 1.1);
    system.ccceMetrics.gamma = Math.max(GAMMA_FIXED, system.ccceMetrics.gamma * 0.9);
    system.ccceMetrics.xi = (system.ccceMetrics.lambda * system.ccceMetrics.phi) /
                           Math.max(system.ccceMetrics.gamma, 0.001);

    return system;
  }

  // ==========================================================================
  // Process Stream Creation
  // ==========================================================================

  /**
   * Create process stream from composition
   */
  createProcessStream(
    composition: Record<string, number>,  // Component name -> mole fraction
    flowRate: number,                     // mol/s
    temperature: number = 298.15,         // K
    pressure: number = 101325,            // Pa
    phase: ProcessStream['phase'] = 'gas'
  ): ProcessStream {
    const id = `STREAM-${Date.now().toString(36)}`;
    const components: Component[] = [];

    // Normalize mole fractions
    const total = Object.values(composition).reduce((a, b) => a + b, 0);

    for (const [name, frac] of Object.entries(composition)) {
      const mol = MOLECULES[name];
      if (mol) {
        components.push({
          ...mol,
          moleFraction: frac / total,
        });
      }
    }

    return {
      id,
      components,
      flowRate,
      temperature,
      pressure,
      phase,
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

    // Heal all systems
    for (const system of this.systems.values()) {
      if (system.ccceMetrics.gamma > 0.3) {
        system.ccceMetrics.gamma *= (1 - CHI_PC);
        system.ccceMetrics.lambda = Math.min(1, system.ccceMetrics.lambda * (1 + CHI_PC * 0.5));
        system.ccceMetrics.xi = (system.ccceMetrics.lambda * system.ccceMetrics.phi) /
                               Math.max(system.ccceMetrics.gamma, 0.001);
      }
    }

    return this.getMetrics();
  }

  /**
   * Get all systems
   */
  getSystems(): SeparationSystem[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get system by ID
   */
  getSystem(id: string): SeparationSystem | undefined {
    return this.systems.get(id);
  }

  /**
   * Get all membranes
   */
  getMembranes(): Membrane[] {
    return Array.from(this.membranes.values());
  }

  /**
   * Get all adsorbents
   */
  getAdsorbents(): Adsorbent[] {
    return Array.from(this.adsorbents.values());
  }

  /**
   * Get simulation result
   */
  getSimulation(id: string): SimulationResult | undefined {
    return this.simulations.get(id);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const separationsEngine = new SeparationsEngine();
