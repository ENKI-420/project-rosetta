/**
 * BTO-09: Designer Biocondensates
 * DARPA-RA-25-02-09
 *
 * Implements programmable biomolecular condensates using phase separation
 * principles for compartmentalized biochemistry and computation.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Biocondensate physical constants
const CONDENSATE_CONSTANTS = {
  BOLTZMANN: 1.380649e-23,        // J/K
  AVOGADRO: 6.02214076e23,        // mol⁻¹
  GAS_CONSTANT: 8.314462,         // J/(mol·K)
  WATER_VISCOSITY: 0.001,         // Pa·s at 25°C
  DEBYE_LENGTH: 1e-9,             // m (typical for physiological conditions)
};

export type CondensatePhase = 'DILUTE' | 'DENSE' | 'GEL' | 'AGGREGATE' | 'DISSOLVED';

export type InteractionType =
  | 'ELECTROSTATIC'
  | 'HYDROPHOBIC'
  | 'PI_PI'           // π-π stacking
  | 'CATION_PI'       // Cation-π interactions
  | 'HYDROGEN_BOND'
  | 'PRION_LIKE';     // Prion-like domains

export interface AminoAcidSequence {
  sequence: string;
  length: number;
  charge: number;
  hydropathy: number;      // GRAVY score [-4.5, 4.5]
  disorderPropensity: number;
  prionLikeDomains: number;
}

export interface CondensateComponent {
  id: string;
  name: string;
  type: 'PROTEIN' | 'RNA' | 'DNA' | 'SMALL_MOLECULE' | 'POLYMER';
  sequence?: AminoAcidSequence;
  concentration: number;    // μM
  molecularWeight: number;  // Da
  radius: number;          // nm (hydrodynamic radius)
  charge: number;
  valency: number;         // Number of binding sites
  partitionCoeff: number;  // Partition coefficient [0-1]
}

export interface Condensate {
  id: string;
  name: string;
  phase: CondensatePhase;
  components: Map<string, { component: CondensateComponent; enrichment: number }>;

  // Physical properties
  radius: number;          // μm
  volume: number;          // μm³
  density: number;         // g/mL
  viscosity: number;       // Pa·s
  surfaceTension: number;  // mN/m

  // Thermodynamic properties
  temperature: number;     // K
  pH: number;
  ionicStrength: number;   // mM
  saturationConc: number;  // μM (critical concentration)

  // CCCE metrics
  coherence: number;       // Lambda - structural coherence
  organization: number;    // Phi - organizational complexity
  dissolution: number;     // Gamma - dissolution rate
  xi: number;              // Negentropic efficiency

  // Dynamics
  fusionRate: number;      // Events/min
  fissionRate: number;     // Events/min
  exchangeRate: number;    // Component exchange with bulk (1/s)
  age: number;             // Seconds since formation
}

export interface PhaseTransitionResult {
  success: boolean;
  condensateId: string;
  fromPhase: CondensatePhase;
  toPhase: CondensatePhase;
  energyChange: number;    // kJ/mol
  reversible: boolean;
}

export interface ComputationResult {
  success: boolean;
  condensateId: string;
  operation: string;
  input: number[];
  output: number[];
  fidelity: number;
  executionTime: number;   // ms
}

export interface BiocondensateSystemState {
  condensates: Map<string, Condensate>;
  bulkComponents: Map<string, CondensateComponent>;
  temperature: number;
  pH: number;
  ionicStrength: number;
  globalCoherence: number;
  globalOrganization: number;
  globalDissolution: number;
  xi: number;
  totalVolume: number;     // μm³
  totalMass: number;       // pg
}

/**
 * Designer Biocondensates Engine
 * Implements programmable phase-separated compartments
 */
export class BiocondensateEngine {
  private state: BiocondensateSystemState;
  private readonly maxCondensates: number;
  private simulationTime: number;

  constructor(maxCondensates: number = 1000) {
    this.maxCondensates = maxCondensates;
    this.simulationTime = 0;
    this.state = {
      condensates: new Map(),
      bulkComponents: new Map(),
      temperature: 310,      // 37°C (physiological)
      pH: 7.4,
      ionicStrength: 150,    // mM (physiological)
      globalCoherence: 0.9,
      globalOrganization: 0.85,
      globalDissolution: GAMMA_FIXED,
      xi: 0,
      totalVolume: 0,
      totalMass: 0,
    };
    this.updateXi();
  }

  /**
   * Create a component for condensate formation
   */
  createComponent(
    name: string,
    type: CondensateComponent['type'],
    properties: Partial<CondensateComponent>
  ): CondensateComponent {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const component: CondensateComponent = {
      id,
      name,
      type,
      concentration: properties.concentration || 1.0,
      molecularWeight: properties.molecularWeight || 50000,
      radius: properties.radius || 3.0,
      charge: properties.charge || 0,
      valency: properties.valency || 2,
      partitionCoeff: properties.partitionCoeff || 0.8,
      sequence: properties.sequence,
    };

    this.state.bulkComponents.set(id, component);
    return component;
  }

  /**
   * Calculate Flory-Huggins chi parameter
   */
  private calculateChiParameter(
    comp1: CondensateComponent,
    comp2: CondensateComponent
  ): number {
    // Simplified chi calculation based on hydropathy and charge
    const hydropathyDiff = Math.abs(
      (comp1.sequence?.hydropathy || 0) - (comp2.sequence?.hydropathy || 0)
    );
    const chargeDiff = Math.abs(comp1.charge - comp2.charge);

    // chi = chi_0 + chi_electrostatic + chi_hydrophobic
    const chi0 = 0.5;  // Base interaction
    const chiElec = -0.1 * chargeDiff;  // Opposite charges attract
    const chiHydro = 0.05 * hydropathyDiff;

    return chi0 + chiElec + chiHydro;
  }

  /**
   * Calculate critical concentration for phase separation
   */
  private calculateCriticalConcentration(components: CondensateComponent[]): number {
    // Simplified: based on average valency and interaction strength
    const avgValency = components.reduce((sum, c) => sum + c.valency, 0) / components.length;
    const avgMW = components.reduce((sum, c) => sum + c.molecularWeight, 0) / components.length;

    // Csat ~ 1 / (valency * sqrt(MW))
    const baseCsat = 100;  // μM
    return baseCsat / (avgValency * Math.sqrt(avgMW / 50000));
  }

  /**
   * Nucleate a new condensate
   */
  nucleateCondensate(
    name: string,
    componentIds: string[],
    temperature?: number
  ): Condensate | null {
    if (this.state.condensates.size >= this.maxCondensates) {
      return null;
    }

    const components = componentIds
      .map(id => this.state.bulkComponents.get(id))
      .filter(Boolean) as CondensateComponent[];

    if (components.length === 0) {
      return null;
    }

    // Check if concentration exceeds critical
    const criticalConc = this.calculateCriticalConcentration(components);
    const avgConc = components.reduce((sum, c) => sum + c.concentration, 0) / components.length;

    if (avgConc < criticalConc) {
      return null;  // Below saturation, no phase separation
    }

    const id = `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate initial condensate properties
    const totalMW = components.reduce((sum, c) => sum + c.molecularWeight, 0);
    const avgPartition = components.reduce((sum, c) => sum + c.partitionCoeff, 0) / components.length;

    // Initial radius based on nucleation (small)
    const initialRadius = 0.1;  // μm
    const volume = (4 / 3) * Math.PI * initialRadius ** 3;

    const componentMap = new Map<string, { component: CondensateComponent; enrichment: number }>();
    for (const comp of components) {
      componentMap.set(comp.id, {
        component: comp,
        enrichment: comp.partitionCoeff * (1 + Math.random() * 0.2),
      });
    }

    const condensate: Condensate = {
      id,
      name,
      phase: 'DENSE',
      components: componentMap,
      radius: initialRadius,
      volume,
      density: 1.1,  // g/mL (slightly denser than water)
      viscosity: 0.1,  // Pa·s (100x water)
      surfaceTension: 0.001,  // mN/m
      temperature: temperature || this.state.temperature,
      pH: this.state.pH,
      ionicStrength: this.state.ionicStrength,
      saturationConc: criticalConc,
      coherence: 0.9 * avgPartition,
      organization: PHI_THRESHOLD * avgPartition,
      dissolution: GAMMA_FIXED * (1 - avgPartition),
      xi: 0,
      fusionRate: 0.1,
      fissionRate: 0.05,
      exchangeRate: 1.0,
      age: 0,
    };

    condensate.xi = (condensate.coherence * condensate.organization) /
      Math.max(0.01, condensate.dissolution);

    this.state.condensates.set(id, condensate);
    this.state.totalVolume += volume;
    this.updateGlobalMetrics();

    return condensate;
  }

  /**
   * Grow condensate through Ostwald ripening
   */
  growCondensate(condensateId: string, growthRate: number = 0.1): boolean {
    const condensate = this.state.condensates.get(condensateId);
    if (!condensate) return false;

    // Ostwald ripening: larger condensates grow, smaller shrink
    const newRadius = condensate.radius * (1 + growthRate);
    const oldVolume = condensate.volume;
    const newVolume = (4 / 3) * Math.PI * newRadius ** 3;

    condensate.radius = newRadius;
    condensate.volume = newVolume;

    // Viscosity increases with size (aging)
    condensate.viscosity *= 1.01;

    // Update total volume
    this.state.totalVolume += (newVolume - oldVolume);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Fuse two condensates
   */
  fuseCondensates(id1: string, id2: string): Condensate | null {
    const cond1 = this.state.condensates.get(id1);
    const cond2 = this.state.condensates.get(id2);

    if (!cond1 || !cond2) return null;

    // Create fused condensate
    const newVolume = cond1.volume + cond2.volume;
    const newRadius = Math.pow(3 * newVolume / (4 * Math.PI), 1 / 3);

    const fusedId = `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Merge components
    const mergedComponents = new Map(cond1.components);
    for (const [compId, data] of cond2.components) {
      if (mergedComponents.has(compId)) {
        const existing = mergedComponents.get(compId)!;
        existing.enrichment = (existing.enrichment + data.enrichment) / 2;
      } else {
        mergedComponents.set(compId, data);
      }
    }

    const fused: Condensate = {
      id: fusedId,
      name: `${cond1.name}+${cond2.name}`,
      phase: 'DENSE',
      components: mergedComponents,
      radius: newRadius,
      volume: newVolume,
      density: (cond1.density + cond2.density) / 2,
      viscosity: Math.max(cond1.viscosity, cond2.viscosity),
      surfaceTension: (cond1.surfaceTension + cond2.surfaceTension) / 2,
      temperature: this.state.temperature,
      pH: this.state.pH,
      ionicStrength: this.state.ionicStrength,
      saturationConc: Math.min(cond1.saturationConc, cond2.saturationConc),
      coherence: (cond1.coherence + cond2.coherence) / 2,
      organization: (cond1.organization + cond2.organization) / 2,
      dissolution: Math.max(cond1.dissolution, cond2.dissolution),
      xi: 0,
      fusionRate: (cond1.fusionRate + cond2.fusionRate) / 2,
      fissionRate: (cond1.fissionRate + cond2.fissionRate) / 2,
      exchangeRate: (cond1.exchangeRate + cond2.exchangeRate) / 2,
      age: 0,
    };

    fused.xi = (fused.coherence * fused.organization) / Math.max(0.01, fused.dissolution);

    // Remove old condensates
    this.state.condensates.delete(id1);
    this.state.condensates.delete(id2);

    // Add fused condensate
    this.state.condensates.set(fusedId, fused);
    this.updateGlobalMetrics();

    return fused;
  }

  /**
   * Trigger phase transition
   */
  inducePhaseTransition(
    condensateId: string,
    targetPhase: CondensatePhase,
    trigger: 'TEMPERATURE' | 'PH' | 'SALT' | 'LIGAND'
  ): PhaseTransitionResult {
    const condensate = this.state.condensates.get(condensateId);

    if (!condensate) {
      return {
        success: false,
        condensateId,
        fromPhase: 'DISSOLVED',
        toPhase: targetPhase,
        energyChange: 0,
        reversible: false,
      };
    }

    const fromPhase = condensate.phase;
    let energyChange = 0;
    let reversible = true;

    // Apply phase transition
    switch (targetPhase) {
      case 'GEL':
        // Gelation: increased viscosity, reduced dynamics
        condensate.viscosity *= 100;
        condensate.exchangeRate *= 0.01;
        condensate.coherence *= 0.95;
        energyChange = -20;  // Favorable
        break;

      case 'AGGREGATE':
        // Aggregation: irreversible in most cases
        condensate.viscosity *= 1000;
        condensate.exchangeRate = 0;
        condensate.dissolution *= 0.1;
        energyChange = -50;
        reversible = false;
        break;

      case 'DISSOLVED':
        // Dissolution
        condensate.coherence *= 0.5;
        condensate.organization *= 0.3;
        condensate.dissolution = 1.0;
        energyChange = 30;  // Unfavorable (requires energy)
        break;

      case 'DILUTE':
        // Partial dissolution
        condensate.radius *= 0.5;
        condensate.volume = (4 / 3) * Math.PI * condensate.radius ** 3;
        condensate.coherence *= 0.7;
        energyChange = 15;
        break;

      default:
        break;
    }

    condensate.phase = targetPhase;
    condensate.xi = (condensate.coherence * condensate.organization) /
      Math.max(0.01, condensate.dissolution);

    this.updateGlobalMetrics();

    return {
      success: true,
      condensateId,
      fromPhase,
      toPhase: targetPhase,
      energyChange,
      reversible,
    };
  }

  /**
   * Perform computation using condensate (biochemical logic)
   */
  computeInCondensate(
    condensateId: string,
    operation: 'AND' | 'OR' | 'NOT' | 'THRESHOLD' | 'AMPLIFY',
    inputs: number[]
  ): ComputationResult {
    const condensate = this.state.condensates.get(condensateId);

    if (!condensate || condensate.phase !== 'DENSE') {
      return {
        success: false,
        condensateId,
        operation,
        input: inputs,
        output: [],
        fidelity: 0,
        executionTime: 0,
      };
    }

    const startTime = Date.now();
    let output: number[] = [];
    let fidelity = condensate.coherence * condensate.organization;

    switch (operation) {
      case 'AND':
        output = [inputs.every(x => x > 0.5) ? 1 : 0];
        break;

      case 'OR':
        output = [inputs.some(x => x > 0.5) ? 1 : 0];
        break;

      case 'NOT':
        output = inputs.map(x => x > 0.5 ? 0 : 1);
        break;

      case 'THRESHOLD':
        const threshold = 0.5;
        output = inputs.map(x => x > threshold ? 1 : 0);
        break;

      case 'AMPLIFY':
        const gain = condensate.components.size;
        output = inputs.map(x => Math.min(1, x * gain));
        break;
    }

    // Add noise based on dissolution
    output = output.map(x => {
      const noise = (Math.random() - 0.5) * condensate.dissolution * 0.2;
      return Math.max(0, Math.min(1, x + noise));
    });

    const executionTime = Date.now() - startTime + condensate.viscosity * 10;

    return {
      success: true,
      condensateId,
      operation,
      input: inputs,
      output,
      fidelity,
      executionTime,
    };
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const condensate of this.state.condensates.values()) {
      if (condensate.coherence < 0.7 || condensate.phase === 'AGGREGATE') {
        // Phase conjugate correction
        condensate.coherence = Math.min(0.95, condensate.coherence / (1 - CHI_PC));
        condensate.organization = Math.min(0.9, condensate.organization * (1 + CHI_PC * 0.5));
        condensate.dissolution *= CHI_PC;

        // Restore dynamics
        if (condensate.phase === 'AGGREGATE') {
          condensate.phase = 'GEL';
          condensate.viscosity *= 0.01;
          condensate.exchangeRate = 0.1;
        }

        condensate.xi = (condensate.coherence * condensate.organization) /
          Math.max(0.01, condensate.dissolution);

        healedCount++;
      }
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Advance simulation time
   */
  tick(deltaSeconds: number): void {
    this.simulationTime += deltaSeconds;

    for (const condensate of this.state.condensates.values()) {
      condensate.age += deltaSeconds;

      // Maturation: viscosity increases with age
      condensate.viscosity *= 1 + 0.001 * deltaSeconds;

      // Dissolution over time
      condensate.coherence *= Math.exp(-condensate.dissolution * deltaSeconds * 0.01);

      // Update xi
      condensate.xi = (condensate.coherence * condensate.organization) /
        Math.max(0.01, condensate.dissolution);
    }

    this.updateGlobalMetrics();
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.condensates.size === 0) {
      this.state.globalCoherence = 0.9;
      this.state.globalOrganization = 0.85;
      this.state.globalDissolution = GAMMA_FIXED;
      return;
    }

    let coherenceSum = 0;
    let organizationSum = 0;
    let dissolutionSum = 0;
    let volumeSum = 0;
    let massSum = 0;

    for (const condensate of this.state.condensates.values()) {
      coherenceSum += condensate.coherence;
      organizationSum += condensate.organization;
      dissolutionSum += condensate.dissolution;
      volumeSum += condensate.volume;
      massSum += condensate.volume * condensate.density;
    }

    this.state.globalCoherence = coherenceSum / this.state.condensates.size;
    this.state.globalOrganization = organizationSum / this.state.condensates.size;
    this.state.globalDissolution = dissolutionSum / this.state.condensates.size;
    this.state.totalVolume = volumeSum;
    this.state.totalMass = massSum;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalDissolution > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalOrganization) /
        this.state.globalDissolution;
    }
  }

  /**
   * Get condensate by ID
   */
  getCondensate(id: string): Condensate | undefined {
    return this.state.condensates.get(id);
  }

  /**
   * Remove condensate
   */
  removeCondensate(id: string): boolean {
    const condensate = this.state.condensates.get(id);
    if (!condensate) return false;

    this.state.totalVolume -= condensate.volume;
    this.state.condensates.delete(id);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<BiocondensateSystemState, 'condensates' | 'bulkComponents'> & {
    condensateCount: number;
    componentCount: number;
    phaseDistribution: Record<CondensatePhase, number>;
    simulationTime: number;
  } {
    const phaseDistribution: Record<CondensatePhase, number> = {
      DILUTE: 0,
      DENSE: 0,
      GEL: 0,
      AGGREGATE: 0,
      DISSOLVED: 0,
    };

    for (const condensate of this.state.condensates.values()) {
      phaseDistribution[condensate.phase]++;
    }

    return {
      temperature: this.state.temperature,
      pH: this.state.pH,
      ionicStrength: this.state.ionicStrength,
      globalCoherence: this.state.globalCoherence,
      globalOrganization: this.state.globalOrganization,
      globalDissolution: this.state.globalDissolution,
      xi: this.state.xi,
      totalVolume: this.state.totalVolume,
      totalMass: this.state.totalMass,
      condensateCount: this.state.condensates.size,
      componentCount: this.state.bulkComponents.size,
      phaseDistribution,
      simulationTime: this.simulationTime,
    };
  }

  /**
   * Set environmental conditions
   */
  setConditions(conditions: {
    temperature?: number;
    pH?: number;
    ionicStrength?: number;
  }): void {
    if (conditions.temperature !== undefined) {
      this.state.temperature = conditions.temperature;
    }
    if (conditions.pH !== undefined) {
      this.state.pH = conditions.pH;
    }
    if (conditions.ionicStrength !== undefined) {
      this.state.ionicStrength = conditions.ionicStrength;
    }

    // Update condensate properties based on new conditions
    for (const condensate of this.state.condensates.values()) {
      condensate.temperature = this.state.temperature;
      condensate.pH = this.state.pH;
      condensate.ionicStrength = this.state.ionicStrength;
    }
  }
}

// Export singleton instance
export const biocondensateEngine = new BiocondensateEngine();
