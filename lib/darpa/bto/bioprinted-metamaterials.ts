/**
 * BTO-12: Bioprinted Living Meta-Materials
 * DARPA-RA-25-02-12
 *
 * Implements living metamaterial design with programmable mechanical,
 * optical, and acoustic properties through bioprinting architectures.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Physical constants for metamaterials
const METAMATERIAL_CONSTANTS = {
  CELL_MODULUS: 1000,           // Pa (typical cell elastic modulus)
  ECM_MODULUS: 10000,           // Pa (extracellular matrix)
  WATER_DENSITY: 1000,          // kg/m³
  SOUND_SPEED_WATER: 1500,      // m/s
  VISIBLE_MIN: 380e-9,          // m (visible light minimum wavelength)
  VISIBLE_MAX: 700e-9,          // m (visible light maximum wavelength)
};

export type MetamaterialType =
  | 'MECHANICAL'      // Auxetic, stiffness gradients
  | 'ACOUSTIC'        // Phononic crystals, sound focusing
  | 'OPTICAL'         // Photonic crystals, structural color
  | 'THERMAL'         // Heat focusing, thermal cloaking
  | 'ELECTROMAGNETIC' // EM wave manipulation
  | 'MULTIFUNCTIONAL';

export type CellType =
  | 'FIBROBLAST'      // Collagen production
  | 'OSTEOBLAST'      // Bone matrix
  | 'CHONDROCYTE'     // Cartilage
  | 'MYOCYTE'         // Muscle
  | 'NEURON'          // Neural tissue
  | 'STEM_CELL';      // Multipotent

export interface UnitCell {
  id: string;
  geometry: 'CUBIC' | 'HEXAGONAL' | 'GYROID' | 'SCHWARZ_P' | 'DIAMOND' | 'CUSTOM';
  size: number;              // μm
  porosity: number;          // [0-1]
  wallThickness: number;     // μm
  cellTypes: CellType[];
  cellDensity: number;       // cells/mm³
  viability: number;         // [0-1]
}

export interface MetamaterialProperties {
  // Mechanical
  youngsModulus: number;     // Pa
  poissonRatio: number;      // [-1, 0.5]
  shearModulus: number;      // Pa
  bulkModulus: number;       // Pa

  // Acoustic
  acousticBandgap: [number, number] | null;  // Hz
  soundSpeed: number;        // m/s
  acousticImpedance: number; // kg/(m²·s)

  // Optical
  refractiveIndex: number;
  photonicBandgap: [number, number] | null;  // nm
  structuralColor: string | null;

  // Thermal
  thermalConductivity: number;  // W/(m·K)
  specificHeat: number;         // J/(kg·K)
}

export interface BioprintedStructure {
  id: string;
  name: string;
  type: MetamaterialType;
  unitCell: UnitCell;

  // Dimensions
  dimensions: { x: number; y: number; z: number };  // mm
  volume: number;           // mm³
  mass: number;             // mg

  // Properties
  properties: MetamaterialProperties;

  // Biological state
  cellCount: number;
  avgViability: number;
  metabolicRate: number;    // μmol O₂/(cell·h)
  maturationTime: number;   // hours

  // CCCE metrics
  coherence: number;        // Lambda - structural coherence
  organization: number;     // Phi - cellular organization
  degradation: number;      // Gamma - degradation rate
  xi: number;               // Negentropic efficiency

  // Printing metadata
  printTime: number;        // minutes
  layerHeight: number;      // μm
  nozzleDiameter: number;   // μm
  bioinkViscosity: number;  // Pa·s
}

export interface PrintingResult {
  success: boolean;
  structureId: string;
  printTime: number;
  cellViability: number;
  structuralFidelity: number;
  errors: string[];
}

export interface PropertyModulation {
  structureId: string;
  property: keyof MetamaterialProperties;
  fromValue: number;
  toValue: number;
  stimulus: 'MECHANICAL' | 'CHEMICAL' | 'OPTICAL' | 'ELECTRICAL' | 'THERMAL';
  responseTime: number;     // seconds
}

export interface MetamaterialSystemState {
  structures: Map<string, BioprintedStructure>;
  globalCoherence: number;
  globalOrganization: number;
  globalDegradation: number;
  xi: number;
  totalVolume: number;
  totalCells: number;
  avgViability: number;
}

/**
 * Bioprinted Living Meta-Materials Engine
 * Implements programmable living material architectures
 */
export class BioprintedMetamaterialEngine {
  private state: MetamaterialSystemState;
  private readonly maxStructures: number;
  private simulationTime: number;

  constructor(maxStructures: number = 100) {
    this.maxStructures = maxStructures;
    this.simulationTime = 0;
    this.state = {
      structures: new Map(),
      globalCoherence: 0.9,
      globalOrganization: 0.85,
      globalDegradation: GAMMA_FIXED,
      xi: 0,
      totalVolume: 0,
      totalCells: 0,
      avgViability: 1.0,
    };
    this.updateXi();
  }

  /**
   * Design a unit cell geometry
   */
  designUnitCell(
    geometry: UnitCell['geometry'],
    size: number,
    porosity: number,
    cellTypes: CellType[]
  ): UnitCell {
    const id = `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate wall thickness from porosity
    // For cubic: porosity = 1 - (1 - 2t/L)³ where L is size, t is thickness
    const wallThickness = size * (1 - Math.pow(porosity, 1/3)) / 2;

    // Cell density based on cell types and porosity
    const baseDensity = 1e6;  // cells/mm³
    const cellDensity = baseDensity * porosity * cellTypes.length;

    return {
      id,
      geometry,
      size,
      porosity,
      wallThickness,
      cellTypes,
      cellDensity,
      viability: 0.95,
    };
  }

  /**
   * Calculate mechanical properties from unit cell
   */
  private calculateMechanicalProperties(unitCell: UnitCell): Partial<MetamaterialProperties> {
    const { porosity, geometry } = unitCell;

    // Gibson-Ashby scaling for cellular solids
    // E/E_s = C * (ρ/ρ_s)^n where n ≈ 2 for bending-dominated
    const relativeDensity = 1 - porosity;
    const baseModulus = METAMATERIAL_CONSTANTS.CELL_MODULUS;

    let youngsModulus = baseModulus * Math.pow(relativeDensity, 2);
    let poissonRatio = 0.3;  // Default

    // Geometry-specific modifications
    switch (geometry) {
      case 'GYROID':
        // TPMS structures can have near-zero Poisson ratio
        poissonRatio = 0.1;
        youngsModulus *= 1.2;  // Stiffer due to continuous surface
        break;

      case 'HEXAGONAL':
        // Can achieve auxetic behavior with re-entrant design
        poissonRatio = -0.3;  // Auxetic
        youngsModulus *= 0.8;
        break;

      case 'DIAMOND':
        // High strength-to-weight
        youngsModulus *= 1.5;
        poissonRatio = 0.25;
        break;

      default:
        break;
    }

    const shearModulus = youngsModulus / (2 * (1 + poissonRatio));
    const bulkModulus = youngsModulus / (3 * (1 - 2 * poissonRatio));

    return {
      youngsModulus,
      poissonRatio,
      shearModulus,
      bulkModulus,
    };
  }

  /**
   * Calculate acoustic properties from unit cell
   */
  private calculateAcousticProperties(unitCell: UnitCell): Partial<MetamaterialProperties> {
    const { size, porosity } = unitCell;

    // Bragg scattering condition for phononic bandgap
    // f_gap ≈ c / (2a) where a is lattice constant
    const latticeConstant = size * 1e-6;  // Convert to meters
    const avgDensity = METAMATERIAL_CONSTANTS.WATER_DENSITY * (1 - porosity * 0.5);
    const soundSpeed = METAMATERIAL_CONSTANTS.SOUND_SPEED_WATER * Math.sqrt(1 - porosity * 0.3);

    const bandgapCenter = soundSpeed / (2 * latticeConstant);
    const bandgapWidth = bandgapCenter * 0.2;  // ~20% bandwidth

    const acousticBandgap: [number, number] = [
      bandgapCenter - bandgapWidth / 2,
      bandgapCenter + bandgapWidth / 2,
    ];

    const acousticImpedance = avgDensity * soundSpeed;

    return {
      acousticBandgap,
      soundSpeed,
      acousticImpedance,
    };
  }

  /**
   * Calculate optical properties from unit cell
   */
  private calculateOpticalProperties(unitCell: UnitCell): Partial<MetamaterialProperties> {
    const { size, porosity, geometry } = unitCell;

    // Effective medium theory for refractive index
    // n_eff = sqrt(ε_eff) where ε_eff ≈ ε_1 * f_1 + ε_2 * f_2 (Maxwell-Garnett)
    const n_water = 1.33;
    const n_cells = 1.38;

    const refractiveIndex = Math.sqrt(
      n_water * n_water * porosity + n_cells * n_cells * (1 - porosity)
    );

    // Photonic bandgap for periodic structures
    let photonicBandgap: [number, number] | null = null;
    let structuralColor: string | null = null;

    // Structural color from Bragg diffraction
    // λ = 2 * n_eff * d * sin(θ)
    // For normal incidence (θ = 90°): λ = 2 * n_eff * d
    const period = size * 1e-6 * 1000;  // Convert to nm
    const wavelength = 2 * refractiveIndex * period;

    if (wavelength >= METAMATERIAL_CONSTANTS.VISIBLE_MIN * 1e9 &&
        wavelength <= METAMATERIAL_CONSTANTS.VISIBLE_MAX * 1e9) {
      photonicBandgap = [wavelength * 0.9, wavelength * 1.1];
      structuralColor = this.wavelengthToColor(wavelength);
    }

    return {
      refractiveIndex,
      photonicBandgap,
      structuralColor,
    };
  }

  /**
   * Convert wavelength to approximate color name
   */
  private wavelengthToColor(wavelength: number): string {
    if (wavelength < 450) return 'violet';
    if (wavelength < 490) return 'blue';
    if (wavelength < 520) return 'cyan';
    if (wavelength < 565) return 'green';
    if (wavelength < 590) return 'yellow';
    if (wavelength < 625) return 'orange';
    return 'red';
  }

  /**
   * Bioprint a metamaterial structure
   */
  bioprintStructure(
    name: string,
    type: MetamaterialType,
    unitCell: UnitCell,
    dimensions: { x: number; y: number; z: number }
  ): PrintingResult {
    if (this.state.structures.size >= this.maxStructures) {
      return {
        success: false,
        structureId: '',
        printTime: 0,
        cellViability: 0,
        structuralFidelity: 0,
        errors: ['Maximum structure limit reached'],
      };
    }

    const id = `struct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const errors: string[] = [];

    // Calculate volume and cell count
    const volume = dimensions.x * dimensions.y * dimensions.z;
    const cellCount = Math.round(unitCell.cellDensity * volume);

    // Estimate print time (based on volume and resolution)
    const layerHeight = 100;  // μm
    const nozzleDiameter = 200;  // μm
    const printSpeed = 10;  // mm/s
    const numLayers = (dimensions.z * 1000) / layerHeight;
    const printTime = (numLayers * (dimensions.x + dimensions.y) * 2) / printSpeed / 60;  // minutes

    // Calculate viability loss during printing
    const viabilityLoss = 0.02 * printTime / 60;  // ~2% per hour
    const cellViability = Math.max(0.7, unitCell.viability - viabilityLoss);

    // Structural fidelity based on resolution vs feature size
    const resolutionRatio = unitCell.wallThickness / nozzleDiameter;
    const structuralFidelity = Math.min(0.95, resolutionRatio * 0.8 + 0.2);

    if (structuralFidelity < 0.7) {
      errors.push('Warning: Low structural fidelity due to resolution limits');
    }
    if (cellViability < 0.8) {
      errors.push('Warning: Cell viability below optimal threshold');
    }

    // Calculate all properties
    const mechanicalProps = this.calculateMechanicalProperties(unitCell);
    const acousticProps = this.calculateAcousticProperties(unitCell);
    const opticalProps = this.calculateOpticalProperties(unitCell);

    const properties: MetamaterialProperties = {
      youngsModulus: mechanicalProps.youngsModulus || 1000,
      poissonRatio: mechanicalProps.poissonRatio || 0.3,
      shearModulus: mechanicalProps.shearModulus || 400,
      bulkModulus: mechanicalProps.bulkModulus || 800,
      acousticBandgap: acousticProps.acousticBandgap || null,
      soundSpeed: acousticProps.soundSpeed || 1500,
      acousticImpedance: acousticProps.acousticImpedance || 1.5e6,
      refractiveIndex: opticalProps.refractiveIndex || 1.35,
      photonicBandgap: opticalProps.photonicBandgap || null,
      structuralColor: opticalProps.structuralColor || null,
      thermalConductivity: 0.6 * (1 - unitCell.porosity),  // W/(m·K)
      specificHeat: 4000 * (1 - unitCell.porosity * 0.3),  // J/(kg·K)
    };

    const structure: BioprintedStructure = {
      id,
      name,
      type,
      unitCell,
      dimensions,
      volume,
      mass: volume * 1.05,  // mg (slightly denser than water)
      properties,
      cellCount,
      avgViability: cellViability,
      metabolicRate: 1.0,  // μmol O₂/(cell·h)
      maturationTime: 0,
      coherence: structuralFidelity * 0.95,
      organization: cellViability * PHI_THRESHOLD,
      degradation: GAMMA_FIXED * (2 - structuralFidelity),
      xi: 0,
      printTime,
      layerHeight,
      nozzleDiameter,
      bioinkViscosity: 100,  // Pa·s
    };

    structure.xi = (structure.coherence * structure.organization) /
      Math.max(0.01, structure.degradation);

    this.state.structures.set(id, structure);
    this.state.totalVolume += volume;
    this.state.totalCells += cellCount;
    this.updateGlobalMetrics();

    return {
      success: true,
      structureId: id,
      printTime,
      cellViability,
      structuralFidelity,
      errors,
    };
  }

  /**
   * Modulate structure property through external stimulus
   */
  modulateProperty(
    structureId: string,
    property: keyof MetamaterialProperties,
    targetValue: number,
    stimulus: PropertyModulation['stimulus']
  ): PropertyModulation | null {
    const structure = this.state.structures.get(structureId);
    if (!structure) return null;

    const fromValue = structure.properties[property] as number;
    if (typeof fromValue !== 'number') return null;

    // Calculate response based on stimulus type
    let responseTime = 1;  // seconds (default)

    switch (stimulus) {
      case 'MECHANICAL':
        // Immediate elastic response
        responseTime = 0.01;
        break;
      case 'CHEMICAL':
        // Slow biological response
        responseTime = 3600;  // 1 hour
        break;
      case 'OPTICAL':
        // Fast photonic response
        responseTime = 1e-6;  // μs
        break;
      case 'ELECTRICAL':
        // Fast piezoelectric/ionic response
        responseTime = 0.001;
        break;
      case 'THERMAL':
        // Moderate thermal diffusion
        responseTime = 10;
        break;
    }

    // Apply modulation
    (structure.properties as Record<string, unknown>)[property] = targetValue;

    // Some modulations affect cell viability
    if (stimulus === 'THERMAL' && targetValue > 50) {
      structure.avgViability *= 0.9;
    }

    this.updateGlobalMetrics();

    return {
      structureId,
      property,
      fromValue,
      toValue: targetValue,
      stimulus,
      responseTime,
    };
  }

  /**
   * Mature structure (cell proliferation and matrix deposition)
   */
  matureStructure(structureId: string, hours: number): boolean {
    const structure = this.state.structures.get(structureId);
    if (!structure) return false;

    structure.maturationTime += hours;

    // Cell proliferation (doubling time ~24h for fibroblasts)
    const doublingTime = 24;  // hours
    const generations = hours / doublingTime;
    const proliferationFactor = Math.pow(2, generations * 0.5);  // Slower in 3D

    structure.cellCount = Math.round(structure.cellCount * proliferationFactor);
    this.state.totalCells += structure.cellCount * (proliferationFactor - 1);

    // Matrix stiffening with maturation
    structure.properties.youngsModulus *= 1 + 0.1 * hours / 24;

    // Viability decay with time
    structure.avgViability *= Math.exp(-0.001 * hours);

    // Organization improves with maturation
    structure.organization = Math.min(0.95, structure.organization * (1 + 0.01 * hours / 24));

    // Update xi
    structure.xi = (structure.coherence * structure.organization) /
      Math.max(0.01, structure.degradation);

    this.updateGlobalMetrics();
    return true;
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const structure of this.state.structures.values()) {
      if (structure.coherence < 0.7 || structure.avgViability < 0.8) {
        // Phase conjugate correction
        structure.coherence = Math.min(0.95, structure.coherence / (1 - CHI_PC));
        structure.organization = Math.min(0.95, structure.organization * (1 + CHI_PC * 0.5));
        structure.degradation *= CHI_PC;

        // Boost viability
        structure.avgViability = Math.min(0.95, structure.avgViability * 1.1);

        structure.xi = (structure.coherence * structure.organization) /
          Math.max(0.01, structure.degradation);

        healedCount++;
      }
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.structures.size === 0) {
      this.state.globalCoherence = 0.9;
      this.state.globalOrganization = 0.85;
      this.state.globalDegradation = GAMMA_FIXED;
      this.state.avgViability = 1.0;
      return;
    }

    let coherenceSum = 0;
    let organizationSum = 0;
    let degradationSum = 0;
    let viabilitySum = 0;

    for (const structure of this.state.structures.values()) {
      coherenceSum += structure.coherence;
      organizationSum += structure.organization;
      degradationSum += structure.degradation;
      viabilitySum += structure.avgViability;
    }

    const count = this.state.structures.size;
    this.state.globalCoherence = coherenceSum / count;
    this.state.globalOrganization = organizationSum / count;
    this.state.globalDegradation = degradationSum / count;
    this.state.avgViability = viabilitySum / count;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalDegradation > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalOrganization) /
        this.state.globalDegradation;
    }
  }

  /**
   * Get structure by ID
   */
  getStructure(id: string): BioprintedStructure | undefined {
    return this.state.structures.get(id);
  }

  /**
   * Remove structure
   */
  removeStructure(id: string): boolean {
    const structure = this.state.structures.get(id);
    if (!structure) return false;

    this.state.totalVolume -= structure.volume;
    this.state.totalCells -= structure.cellCount;
    this.state.structures.delete(id);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<MetamaterialSystemState, 'structures'> & {
    structureCount: number;
    typeDistribution: Partial<Record<MetamaterialType, number>>;
    simulationTime: number;
  } {
    const typeDistribution: Partial<Record<MetamaterialType, number>> = {};

    for (const structure of this.state.structures.values()) {
      typeDistribution[structure.type] = (typeDistribution[structure.type] || 0) + 1;
    }

    return {
      globalCoherence: this.state.globalCoherence,
      globalOrganization: this.state.globalOrganization,
      globalDegradation: this.state.globalDegradation,
      xi: this.state.xi,
      totalVolume: this.state.totalVolume,
      totalCells: this.state.totalCells,
      avgViability: this.state.avgViability,
      structureCount: this.state.structures.size,
      typeDistribution,
      simulationTime: this.simulationTime,
    };
  }

  /**
   * List all structures
   */
  listStructures(): Array<{ id: string; name: string; type: MetamaterialType; volume: number }> {
    return Array.from(this.state.structures.values()).map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      volume: s.volume,
    }));
  }
}

// Export singleton instance
export const metamaterialEngine = new BioprintedMetamaterialEngine();
