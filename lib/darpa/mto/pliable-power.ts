/**
 * DARPA MTO Topic 22: Pliable Packaging for Polymorphic Power (PPPP)
 * DNA-Lang Sovereign Computing Platform
 *
 * Solicitation: DARPA-RA-25-02-22
 *
 * Flexible and reconfigurable power electronics packaging with
 * shape-adaptive thermal management and power delivery optimization.
 *
 * CCCE Integration:
 * - Lambda (Λ): Power conversion efficiency coherence
 * - Phi (Φ): Thermal-electrical integration organization
 * - Gamma (Γ): Packaging stress decoherence
 * - Xi (Ξ): System-level negentropic efficiency
 */

import {
  LAMBDA_PHI,
  PHI_THRESHOLD,
  GAMMA_FIXED,
  CHI_PC,
} from '../../constants';

// ============================================================================
// PPPP Physical Constants
// ============================================================================

/** Thermal conductivity of flexible substrates [W/m·K] */
const FLEX_THERMAL_K = 0.2;

/** Power density limit for pliable packaging [W/cm²] */
const MAX_POWER_DENSITY = 50;

/** Minimum bend radius for flexible power [mm] */
const MIN_BEND_RADIUS = 5;

/** Phase change material melting point [°C] */
const PCM_MELT_TEMP = 45;

/** Maximum junction temperature [°C] */
const MAX_JUNCTION_TEMP = 150;

/** Thermal interface material thickness [μm] */
const TIM_THICKNESS = 50;

/** Power conversion efficiency target */
const EFFICIENCY_TARGET = 0.95;

// ============================================================================
// Type Definitions
// ============================================================================

export type PackagingMaterial =
  | 'polyimide'
  | 'silicone'
  | 'liquid_crystal_elastomer'
  | 'shape_memory_alloy'
  | 'conductive_hydrogel';

export type PowerTopology =
  | 'buck'
  | 'boost'
  | 'buck_boost'
  | 'flyback'
  | 'full_bridge'
  | 'multilevel';

export type ThermalStrategy =
  | 'passive_spreading'
  | 'phase_change'
  | 'microfluidic_cooling'
  | 'thermoelectric'
  | 'shape_adaptive';

export type MorphingMode =
  | 'static'
  | 'flex'
  | 'fold'
  | 'stretch'
  | 'twist'
  | 'origami';

export interface FlexibleSubstrate {
  id: string;
  material: PackagingMaterial;
  thickness_um: number;
  thermal_conductivity: number;
  dielectric_constant: number;
  youngs_modulus_mpa: number;
  max_strain_percent: number;
  temperature_range: {
    min_c: number;
    max_c: number;
  };
  ccce_lambda: number;
}

export interface PowerConverter {
  id: string;
  topology: PowerTopology;
  input_voltage_range: {
    min_v: number;
    max_v: number;
  };
  output_voltage: number;
  output_current_max_a: number;
  switching_frequency_khz: number;
  efficiency: number;
  power_density_w_cm2: number;
  morphing_compatible: boolean;
  ccce_phi: number;
}

export interface ThermalManagement {
  id: string;
  strategy: ThermalStrategy;
  max_heat_dissipation_w: number;
  thermal_resistance_k_w: number;
  response_time_s: number;
  adaptive_range?: {
    min_conductivity: number;
    max_conductivity: number;
  };
  phase_change?: {
    material: string;
    latent_heat_j_g: number;
    transition_temp_c: number;
  };
  ccce_gamma: number;
}

export interface MorphablePackage {
  id: string;
  mode: MorphingMode;
  substrate: FlexibleSubstrate;
  converters: PowerConverter[];
  thermal: ThermalManagement;
  dimensions: {
    length_mm: number;
    width_mm: number;
    thickness_mm: number;
  };
  min_bend_radius_mm: number;
  max_cycles: number;
  current_strain: number;
  ccce_xi: number;
}

export interface PowerDeliveryNetwork {
  id: string;
  packages: MorphablePackage[];
  total_power_w: number;
  bus_voltage_v: number;
  efficiency: number;
  redundancy_level: number;
  morphing_state: MorphingMode;
  thermal_map: Map<string, number>;
  ccce_metrics: {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  };
}

export interface StressAnalysis {
  package_id: string;
  von_mises_stress_mpa: number;
  max_principal_strain: number;
  fatigue_life_cycles: number;
  thermal_stress_mpa: number;
  electrical_stress_factor: number;
  failure_probability: number;
  recommendations: string[];
}

export interface EfficiencyMap {
  topology: PowerTopology;
  load_points: number[];
  efficiency_values: number[];
  thermal_derating: number[];
  morphing_penalty: number;
  optimal_operating_point: {
    load_percent: number;
    efficiency: number;
    temperature_c: number;
  };
}

export interface PPPPMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  total_packages: number;
  active_power_w: number;
  system_efficiency: number;
  thermal_headroom_c: number;
  morphing_cycles: number;
  mean_time_between_failure_hours: number;
}

// ============================================================================
// Pliable Power Packaging Engine
// ============================================================================

export class PliablePowerEngine {
  private substrates: Map<string, FlexibleSubstrate> = new Map();
  private converters: Map<string, PowerConverter> = new Map();
  private thermalUnits: Map<string, ThermalManagement> = new Map();
  private packages: Map<string, MorphablePackage> = new Map();
  private networks: Map<string, PowerDeliveryNetwork> = new Map();

  // CCCE metrics
  private lambda: number = PHI_THRESHOLD;
  private phi: number = PHI_THRESHOLD;
  private gamma: number = GAMMA_FIXED;

  constructor() {
    this.initializeDefaultComponents();
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  private initializeDefaultComponents(): void {
    // Initialize default flexible substrates
    const defaultSubstrates: FlexibleSubstrate[] = [
      {
        id: 'polyimide_flex',
        material: 'polyimide',
        thickness_um: 50,
        thermal_conductivity: 0.12,
        dielectric_constant: 3.4,
        youngs_modulus_mpa: 2500,
        max_strain_percent: 3,
        temperature_range: { min_c: -65, max_c: 260 },
        ccce_lambda: 0.92,
      },
      {
        id: 'silicone_stretch',
        material: 'silicone',
        thickness_um: 200,
        thermal_conductivity: 0.27,
        dielectric_constant: 2.7,
        youngs_modulus_mpa: 2,
        max_strain_percent: 100,
        temperature_range: { min_c: -55, max_c: 200 },
        ccce_lambda: 0.88,
      },
      {
        id: 'lce_adaptive',
        material: 'liquid_crystal_elastomer',
        thickness_um: 100,
        thermal_conductivity: 0.15,
        dielectric_constant: 4.2,
        youngs_modulus_mpa: 10,
        max_strain_percent: 40,
        temperature_range: { min_c: -20, max_c: 100 },
        ccce_lambda: 0.85,
      },
    ];

    defaultSubstrates.forEach((s) => this.substrates.set(s.id, s));
  }

  // --------------------------------------------------------------------------
  // Substrate Design
  // --------------------------------------------------------------------------

  /**
   * Create a flexible substrate for power packaging
   */
  createSubstrate(config: Partial<FlexibleSubstrate> & { material: PackagingMaterial }): FlexibleSubstrate {
    const id = config.id || `substrate_${Date.now()}`;

    // Material-specific defaults
    const materialDefaults = this.getMaterialDefaults(config.material);

    const substrate: FlexibleSubstrate = {
      id,
      material: config.material,
      thickness_um: config.thickness_um ?? materialDefaults.thickness,
      thermal_conductivity: config.thermal_conductivity ?? materialDefaults.thermalK,
      dielectric_constant: config.dielectric_constant ?? materialDefaults.dielectric,
      youngs_modulus_mpa: config.youngs_modulus_mpa ?? materialDefaults.youngsModulus,
      max_strain_percent: config.max_strain_percent ?? materialDefaults.maxStrain,
      temperature_range: config.temperature_range ?? materialDefaults.tempRange,
      ccce_lambda: this.calculateSubstrateLambda(config),
    };

    this.substrates.set(id, substrate);
    this.updateMetrics();

    return substrate;
  }

  private getMaterialDefaults(material: PackagingMaterial): {
    thickness: number;
    thermalK: number;
    dielectric: number;
    youngsModulus: number;
    maxStrain: number;
    tempRange: { min_c: number; max_c: number };
  } {
    const defaults: Record<PackagingMaterial, ReturnType<typeof this.getMaterialDefaults>> = {
      polyimide: {
        thickness: 50,
        thermalK: 0.12,
        dielectric: 3.4,
        youngsModulus: 2500,
        maxStrain: 3,
        tempRange: { min_c: -65, max_c: 260 },
      },
      silicone: {
        thickness: 200,
        thermalK: 0.27,
        dielectric: 2.7,
        youngsModulus: 2,
        maxStrain: 100,
        tempRange: { min_c: -55, max_c: 200 },
      },
      liquid_crystal_elastomer: {
        thickness: 100,
        thermalK: 0.15,
        dielectric: 4.2,
        youngsModulus: 10,
        maxStrain: 40,
        tempRange: { min_c: -20, max_c: 100 },
      },
      shape_memory_alloy: {
        thickness: 150,
        thermalK: 18,
        dielectric: 1.0,
        youngsModulus: 28000,
        maxStrain: 8,
        tempRange: { min_c: -40, max_c: 100 },
      },
      conductive_hydrogel: {
        thickness: 500,
        thermalK: 0.6,
        dielectric: 80,
        youngsModulus: 0.1,
        maxStrain: 200,
        tempRange: { min_c: 0, max_c: 60 },
      },
    };

    return defaults[material];
  }

  private calculateSubstrateLambda(config: Partial<FlexibleSubstrate>): number {
    // Lambda based on thermal and mechanical properties
    const thermalFactor = Math.min(1, (config.thermal_conductivity ?? FLEX_THERMAL_K) / 1.0);
    const strainFactor = Math.min(1, (config.max_strain_percent ?? 10) / 100);

    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * (0.6 * thermalFactor + 0.4 * strainFactor);
  }

  // --------------------------------------------------------------------------
  // Power Converter Design
  // --------------------------------------------------------------------------

  /**
   * Design a power converter for flexible packaging
   */
  designConverter(config: {
    topology: PowerTopology;
    input_range: { min_v: number; max_v: number };
    output_voltage: number;
    output_current_a: number;
    switching_freq_khz?: number;
    morphing_compatible?: boolean;
  }): PowerConverter {
    const id = `converter_${config.topology}_${Date.now()}`;

    // Calculate switching frequency based on topology
    const switchingFreq = config.switching_freq_khz ?? this.calculateOptimalSwitchingFreq(config.topology);

    // Calculate efficiency based on topology and operating point
    const efficiency = this.calculateConverterEfficiency(config.topology, switchingFreq);

    // Calculate power density
    const powerOutput = config.output_voltage * config.output_current_a;
    const estimatedArea = this.estimateConverterArea(powerOutput, config.topology);
    const powerDensity = powerOutput / estimatedArea;

    const converter: PowerConverter = {
      id,
      topology: config.topology,
      input_voltage_range: config.input_range,
      output_voltage: config.output_voltage,
      output_current_max_a: config.output_current_a,
      switching_frequency_khz: switchingFreq,
      efficiency,
      power_density_w_cm2: Math.min(powerDensity, MAX_POWER_DENSITY),
      morphing_compatible: config.morphing_compatible ?? true,
      ccce_phi: this.calculateConverterPhi(efficiency, powerDensity),
    };

    this.converters.set(id, converter);
    this.updateMetrics();

    return converter;
  }

  private calculateOptimalSwitchingFreq(topology: PowerTopology): number {
    // Higher frequencies allow smaller components but increase switching losses
    const baseFreqs: Record<PowerTopology, number> = {
      buck: 500,
      boost: 400,
      buck_boost: 350,
      flyback: 100,
      full_bridge: 200,
      multilevel: 50,
    };

    return baseFreqs[topology];
  }

  private calculateConverterEfficiency(topology: PowerTopology, freq_khz: number): number {
    // Base efficiency by topology
    const baseEfficiency: Record<PowerTopology, number> = {
      buck: 0.95,
      boost: 0.93,
      buck_boost: 0.91,
      flyback: 0.88,
      full_bridge: 0.94,
      multilevel: 0.96,
    };

    // Frequency derating (higher freq = more switching losses)
    const freqDerating = 1 - (freq_khz / 10000) * 0.05;

    return baseEfficiency[topology] * freqDerating;
  }

  private estimateConverterArea(power_w: number, topology: PowerTopology): number {
    // Area in cm² based on power and topology complexity
    const densityFactor: Record<PowerTopology, number> = {
      buck: 30,
      boost: 25,
      buck_boost: 20,
      flyback: 15,
      full_bridge: 25,
      multilevel: 35,
    };

    return power_w / densityFactor[topology];
  }

  private calculateConverterPhi(efficiency: number, powerDensity: number): number {
    // Phi based on efficiency and power density optimization
    const effFactor = efficiency / EFFICIENCY_TARGET;
    const densityFactor = Math.min(1, powerDensity / MAX_POWER_DENSITY);

    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * (0.7 * effFactor + 0.3 * densityFactor);
  }

  // --------------------------------------------------------------------------
  // Thermal Management
  // --------------------------------------------------------------------------

  /**
   * Design thermal management system
   */
  designThermalManagement(config: {
    strategy: ThermalStrategy;
    max_power_w: number;
    target_temp_c?: number;
  }): ThermalManagement {
    const id = `thermal_${config.strategy}_${Date.now()}`;
    const targetTemp = config.target_temp_c ?? (MAX_JUNCTION_TEMP - 30);

    // Calculate thermal resistance needed
    const ambientTemp = 25;
    const thermalResistance = (targetTemp - ambientTemp) / config.max_power_w;

    // Calculate response time based on strategy
    const responseTime = this.calculateThermalResponseTime(config.strategy);

    const thermal: ThermalManagement = {
      id,
      strategy: config.strategy,
      max_heat_dissipation_w: config.max_power_w,
      thermal_resistance_k_w: thermalResistance,
      response_time_s: responseTime,
      ccce_gamma: this.calculateThermalGamma(config.strategy, thermalResistance),
    };

    // Add strategy-specific properties
    if (config.strategy === 'shape_adaptive') {
      thermal.adaptive_range = {
        min_conductivity: 0.1,
        max_conductivity: 5.0,
      };
    } else if (config.strategy === 'phase_change') {
      thermal.phase_change = {
        material: 'paraffin_wax',
        latent_heat_j_g: 200,
        transition_temp_c: PCM_MELT_TEMP,
      };
    }

    this.thermalUnits.set(id, thermal);
    this.updateMetrics();

    return thermal;
  }

  private calculateThermalResponseTime(strategy: ThermalStrategy): number {
    const responseTimes: Record<ThermalStrategy, number> = {
      passive_spreading: 10,
      phase_change: 5,
      microfluidic_cooling: 0.5,
      thermoelectric: 1,
      shape_adaptive: 2,
    };

    return responseTimes[strategy];
  }

  private calculateThermalGamma(strategy: ThermalStrategy, resistance: number): number {
    // Lower gamma = better thermal management
    const baseGamma: Record<ThermalStrategy, number> = {
      passive_spreading: 0.15,
      phase_change: 0.10,
      microfluidic_cooling: 0.05,
      thermoelectric: 0.08,
      shape_adaptive: 0.07,
    };

    // Resistance penalty
    const resistancePenalty = Math.min(0.1, resistance / 10);

    return Math.min(0.3, baseGamma[strategy] + resistancePenalty);
  }

  // --------------------------------------------------------------------------
  // Morphable Package Assembly
  // --------------------------------------------------------------------------

  /**
   * Assemble a morphable power package
   */
  assemblePackage(config: {
    mode: MorphingMode;
    substrate_id: string;
    converter_ids: string[];
    thermal_id: string;
    dimensions: { length_mm: number; width_mm: number; thickness_mm: number };
  }): MorphablePackage {
    const substrate = this.substrates.get(config.substrate_id);
    if (!substrate) {
      throw new Error(`Substrate ${config.substrate_id} not found`);
    }

    const converters = config.converter_ids.map((id) => {
      const conv = this.converters.get(id);
      if (!conv) throw new Error(`Converter ${id} not found`);
      return conv;
    });

    const thermal = this.thermalUnits.get(config.thermal_id);
    if (!thermal) {
      throw new Error(`Thermal unit ${config.thermal_id} not found`);
    }

    const id = `package_${config.mode}_${Date.now()}`;

    // Calculate minimum bend radius based on substrate and thickness
    const minBendRadius = this.calculateMinBendRadius(substrate, config.dimensions.thickness_mm);

    // Estimate max cycles based on mode and materials
    const maxCycles = this.estimateMaxCycles(config.mode, substrate);

    const pkg: MorphablePackage = {
      id,
      mode: config.mode,
      substrate,
      converters,
      thermal,
      dimensions: config.dimensions,
      min_bend_radius_mm: minBendRadius,
      max_cycles: maxCycles,
      current_strain: 0,
      ccce_xi: this.calculatePackageXi(substrate, converters, thermal),
    };

    this.packages.set(id, pkg);
    this.updateMetrics();

    return pkg;
  }

  private calculateMinBendRadius(substrate: FlexibleSubstrate, thickness_mm: number): number {
    // Minimum bend radius = thickness / (2 * max_strain)
    const strainLimit = substrate.max_strain_percent / 100;
    const calculatedRadius = (thickness_mm / 2) / strainLimit;

    return Math.max(MIN_BEND_RADIUS, calculatedRadius);
  }

  private estimateMaxCycles(mode: MorphingMode, substrate: FlexibleSubstrate): number {
    // Base cycles by mode
    const baseCycles: Record<MorphingMode, number> = {
      static: 1000000,
      flex: 100000,
      fold: 50000,
      stretch: 10000,
      twist: 25000,
      origami: 20000,
    };

    // Material factor
    const materialFactor = substrate.max_strain_percent / 10;

    return Math.floor(baseCycles[mode] * materialFactor);
  }

  private calculatePackageXi(
    substrate: FlexibleSubstrate,
    converters: PowerConverter[],
    thermal: ThermalManagement
  ): number {
    // Xi = (Lambda * Phi) / Gamma
    const avgLambda = substrate.ccce_lambda;
    const avgPhi = converters.reduce((sum, c) => sum + c.ccce_phi, 0) / converters.length;
    const gamma = thermal.ccce_gamma;

    return (avgLambda * avgPhi) / Math.max(0.01, gamma);
  }

  // --------------------------------------------------------------------------
  // Power Delivery Network
  // --------------------------------------------------------------------------

  /**
   * Create a power delivery network from packages
   */
  createNetwork(config: {
    package_ids: string[];
    bus_voltage_v: number;
    redundancy_level?: number;
  }): PowerDeliveryNetwork {
    const packages = config.package_ids.map((id) => {
      const pkg = this.packages.get(id);
      if (!pkg) throw new Error(`Package ${id} not found`);
      return pkg;
    });

    const id = `network_${Date.now()}`;

    // Calculate total power capacity
    const totalPower = packages.reduce((sum, pkg) => {
      return sum + pkg.converters.reduce((cSum, c) => {
        return cSum + c.output_voltage * c.output_current_max_a;
      }, 0);
    }, 0);

    // Calculate system efficiency
    const avgEfficiency = packages.reduce((sum, pkg) => {
      return sum + pkg.converters.reduce((cSum, c) => cSum + c.efficiency, 0) / pkg.converters.length;
    }, 0) / packages.length;

    // Initialize thermal map
    const thermalMap = new Map<string, number>();
    packages.forEach((pkg) => {
      thermalMap.set(pkg.id, 25); // Start at ambient
    });

    const network: PowerDeliveryNetwork = {
      id,
      packages,
      total_power_w: totalPower,
      bus_voltage_v: config.bus_voltage_v,
      efficiency: avgEfficiency,
      redundancy_level: config.redundancy_level ?? 1,
      morphing_state: 'static',
      thermal_map: thermalMap,
      ccce_metrics: this.calculateNetworkCCCE(packages),
    };

    this.networks.set(id, network);
    this.updateMetrics();

    return network;
  }

  private calculateNetworkCCCE(packages: MorphablePackage[]): {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  } {
    const n = packages.length;
    if (n === 0) {
      return { lambda: PHI_THRESHOLD, phi: PHI_THRESHOLD, gamma: GAMMA_FIXED, xi: 1 };
    }

    // Aggregate metrics
    const lambda = packages.reduce((sum, p) => sum + p.substrate.ccce_lambda, 0) / n;
    const phi = packages.reduce((sum, p) => {
      return sum + p.converters.reduce((cSum, c) => cSum + c.ccce_phi, 0) / p.converters.length;
    }, 0) / n;
    const gamma = packages.reduce((sum, p) => sum + p.thermal.ccce_gamma, 0) / n;
    const xi = (lambda * phi) / Math.max(0.01, gamma);

    return { lambda, phi, gamma, xi };
  }

  // --------------------------------------------------------------------------
  // Morphing Operations
  // --------------------------------------------------------------------------

  /**
   * Morph a package to a new configuration
   */
  morphPackage(packageId: string, targetMode: MorphingMode, targetStrain: number): {
    success: boolean;
    stress_analysis: StressAnalysis;
    new_efficiency: number;
  } {
    const pkg = this.packages.get(packageId);
    if (!pkg) {
      throw new Error(`Package ${packageId} not found`);
    }

    // Check strain limits
    if (targetStrain > pkg.substrate.max_strain_percent) {
      return {
        success: false,
        stress_analysis: this.analyzeStress(pkg, targetStrain),
        new_efficiency: 0,
      };
    }

    // Check bend radius if flexing
    if (targetMode === 'flex' || targetMode === 'fold') {
      const requiredRadius = (pkg.dimensions.thickness_mm / 2) / (targetStrain / 100);
      if (requiredRadius < pkg.min_bend_radius_mm) {
        return {
          success: false,
          stress_analysis: this.analyzeStress(pkg, targetStrain),
          new_efficiency: 0,
        };
      }
    }

    // Perform morphing
    pkg.mode = targetMode;
    pkg.current_strain = targetStrain;

    // Calculate efficiency penalty from morphing
    const strainPenalty = targetStrain / pkg.substrate.max_strain_percent;
    const morphingPenalty = this.getMorphingPenalty(targetMode);
    const efficiencyLoss = strainPenalty * morphingPenalty;

    // Update converter efficiencies
    pkg.converters.forEach((conv) => {
      if (conv.morphing_compatible) {
        // Morphing-compatible converters have less penalty
        const newEff = conv.efficiency * (1 - efficiencyLoss * 0.5);
        this.converters.set(conv.id, { ...conv, efficiency: newEff });
      }
    });

    // Update Xi
    pkg.ccce_xi = this.calculatePackageXi(pkg.substrate, pkg.converters, pkg.thermal);
    this.updateMetrics();

    return {
      success: true,
      stress_analysis: this.analyzeStress(pkg, targetStrain),
      new_efficiency: pkg.converters.reduce((sum, c) => sum + c.efficiency, 0) / pkg.converters.length,
    };
  }

  private getMorphingPenalty(mode: MorphingMode): number {
    const penalties: Record<MorphingMode, number> = {
      static: 0,
      flex: 0.05,
      fold: 0.10,
      stretch: 0.15,
      twist: 0.12,
      origami: 0.08,
    };

    return penalties[mode];
  }

  // --------------------------------------------------------------------------
  // Stress Analysis
  // --------------------------------------------------------------------------

  /**
   * Analyze mechanical and thermal stress in a package
   */
  analyzeStress(pkg: MorphablePackage, strain: number): StressAnalysis {
    // Von Mises stress calculation
    const youngsModulus = pkg.substrate.youngs_modulus_mpa;
    const vonMisesStress = youngsModulus * (strain / 100);

    // Principal strain
    const maxPrincipalStrain = strain / 100;

    // Fatigue life (Coffin-Manson relation approximation)
    const strainAmplitude = maxPrincipalStrain / 2;
    const fatigueExponent = -0.6;
    const fatigueCoeff = 0.5;
    const fatigueLife = Math.pow(strainAmplitude / fatigueCoeff, 1 / fatigueExponent);

    // Thermal stress from power dissipation
    const powerDensity = pkg.converters.reduce((sum, c) => sum + c.power_density_w_cm2, 0);
    const thermalExpansion = 20e-6; // 20 ppm/°C typical
    const tempRise = powerDensity * pkg.thermal.thermal_resistance_k_w;
    const thermalStress = youngsModulus * thermalExpansion * tempRise;

    // Electrical stress factor (based on power density)
    const electricalStress = powerDensity / MAX_POWER_DENSITY;

    // Failure probability (Weibull-like)
    const stressRatio = vonMisesStress / (youngsModulus * pkg.substrate.max_strain_percent / 100);
    const failureProbability = 1 - Math.exp(-Math.pow(stressRatio, 3));

    // Generate recommendations
    const recommendations: string[] = [];
    if (vonMisesStress > youngsModulus * 0.5) {
      recommendations.push('Reduce strain to prevent yield');
    }
    if (thermalStress > vonMisesStress * 0.3) {
      recommendations.push('Improve thermal management');
    }
    if (fatigueLife < 10000) {
      recommendations.push('Consider more flexible substrate for better fatigue life');
    }
    if (failureProbability > 0.1) {
      recommendations.push('High failure probability - reduce operating strain');
    }

    return {
      package_id: pkg.id,
      von_mises_stress_mpa: vonMisesStress,
      max_principal_strain: maxPrincipalStrain,
      fatigue_life_cycles: Math.floor(fatigueLife),
      thermal_stress_mpa: thermalStress,
      electrical_stress_factor: electricalStress,
      failure_probability: failureProbability,
      recommendations,
    };
  }

  // --------------------------------------------------------------------------
  // Efficiency Mapping
  // --------------------------------------------------------------------------

  /**
   * Generate efficiency map for a converter
   */
  generateEfficiencyMap(converterId: string): EfficiencyMap {
    const converter = this.converters.get(converterId);
    if (!converter) {
      throw new Error(`Converter ${converterId} not found`);
    }

    const loadPoints = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const efficiencyValues: number[] = [];
    const thermalDerating: number[] = [];

    // Calculate efficiency at each load point
    loadPoints.forEach((load) => {
      // Light load has more overhead losses, heavy load has more conduction losses
      const overheadLoss = 0.02 / (load / 100);
      const conductionLoss = 0.01 * Math.pow(load / 100, 2);
      const switchingLoss = 0.02;

      const eff = converter.efficiency - overheadLoss - conductionLoss - switchingLoss;
      efficiencyValues.push(Math.max(0.5, eff));

      // Thermal derating at high loads
      const tempRise = (load / 100) * 50; // Assume 50°C rise at full load
      const derating = tempRise > 30 ? (tempRise - 30) * 0.002 : 0;
      thermalDerating.push(derating);
    });

    // Find optimal operating point
    let maxEff = 0;
    let optimalLoad = 50;
    let optimalTemp = 25;

    efficiencyValues.forEach((eff, i) => {
      const effectiveEff = eff - thermalDerating[i];
      if (effectiveEff > maxEff) {
        maxEff = effectiveEff;
        optimalLoad = loadPoints[i];
        optimalTemp = 25 + (loadPoints[i] / 100) * 50;
      }
    });

    // Morphing penalty
    const morphingPenalty = converter.morphing_compatible ? 0.02 : 0.10;

    return {
      topology: converter.topology,
      load_points: loadPoints,
      efficiency_values: efficiencyValues,
      thermal_derating: thermalDerating,
      morphing_penalty: morphingPenalty,
      optimal_operating_point: {
        load_percent: optimalLoad,
        efficiency: maxEff,
        temperature_c: optimalTemp,
      },
    };
  }

  // --------------------------------------------------------------------------
  // System Optimization
  // --------------------------------------------------------------------------

  /**
   * Optimize power delivery network for a target morphing state
   */
  optimizeNetwork(networkId: string, targetState: MorphingMode): {
    optimized_efficiency: number;
    thermal_distribution: Map<string, number>;
    recommended_loads: Map<string, number>;
    ccce_improvement: number;
  } {
    const network = this.networks.get(networkId);
    if (!network) {
      throw new Error(`Network ${networkId} not found`);
    }

    const recommendedLoads = new Map<string, number>();
    const thermalDist = new Map<string, number>();
    let totalEfficiency = 0;

    // Optimize each package
    network.packages.forEach((pkg) => {
      // Get efficiency maps for all converters
      const converterOptima = pkg.converters.map((conv) => {
        const map = this.generateEfficiencyMap(conv.id);
        return {
          converter: conv,
          optimal: map.optimal_operating_point,
          morphingPenalty: map.morphing_penalty,
        };
      });

      // Distribute load optimally
      converterOptima.forEach((opt) => {
        const adjustedLoad = targetState === 'static'
          ? opt.optimal.load_percent
          : opt.optimal.load_percent * (1 - opt.morphingPenalty);
        recommendedLoads.set(opt.converter.id, adjustedLoad);
      });

      // Calculate thermal distribution
      const totalPower = pkg.converters.reduce((sum, c) => {
        const load = recommendedLoads.get(c.id) ?? 50;
        return sum + c.output_voltage * c.output_current_max_a * (load / 100);
      }, 0);

      const tempRise = totalPower * pkg.thermal.thermal_resistance_k_w;
      thermalDist.set(pkg.id, 25 + tempRise);

      // Accumulate efficiency
      const pkgEfficiency = converterOptima.reduce((sum, opt) => {
        return sum + opt.optimal.efficiency - (targetState !== 'static' ? opt.morphingPenalty : 0);
      }, 0) / converterOptima.length;

      totalEfficiency += pkgEfficiency;
    });

    // Calculate optimized system efficiency
    const optimizedEfficiency = totalEfficiency / network.packages.length;

    // Calculate CCCE improvement
    const originalXi = network.ccce_metrics.xi;
    const newMetrics = this.calculateNetworkCCCE(network.packages);
    const ccceImprovement = (newMetrics.xi - originalXi) / originalXi;

    // Update network state
    network.morphing_state = targetState;
    network.thermal_map = thermalDist;
    network.ccce_metrics = newMetrics;

    return {
      optimized_efficiency: optimizedEfficiency,
      thermal_distribution: thermalDist,
      recommended_loads: recommendedLoads,
      ccce_improvement: ccceImprovement,
    };
  }

  // --------------------------------------------------------------------------
  // CCCE Metrics
  // --------------------------------------------------------------------------

  private updateMetrics(): void {
    // Aggregate Lambda from substrates
    if (this.substrates.size > 0) {
      this.lambda = Array.from(this.substrates.values())
        .reduce((sum, s) => sum + s.ccce_lambda, 0) / this.substrates.size;
    }

    // Aggregate Phi from converters
    if (this.converters.size > 0) {
      this.phi = Array.from(this.converters.values())
        .reduce((sum, c) => sum + c.ccce_phi, 0) / this.converters.size;
    }

    // Aggregate Gamma from thermal units
    if (this.thermalUnits.size > 0) {
      this.gamma = Array.from(this.thermalUnits.values())
        .reduce((sum, t) => sum + t.ccce_gamma, 0) / this.thermalUnits.size;
    }
  }

  /**
   * Get current CCCE metrics
   */
  getMetrics(): PPPPMetrics {
    const xi = (this.lambda * this.phi) / Math.max(0.01, this.gamma);

    // Calculate system-wide statistics
    let totalPower = 0;
    let totalEfficiency = 0;
    let converterCount = 0;
    let minThermalHeadroom = MAX_JUNCTION_TEMP;
    let totalCycles = 0;

    this.networks.forEach((network) => {
      totalPower += network.total_power_w;
      network.packages.forEach((pkg) => {
        pkg.converters.forEach((conv) => {
          totalEfficiency += conv.efficiency;
          converterCount++;
        });

        // Thermal headroom
        const pkgTemp = network.thermal_map.get(pkg.id) ?? 25;
        const headroom = MAX_JUNCTION_TEMP - pkgTemp;
        minThermalHeadroom = Math.min(minThermalHeadroom, headroom);

        // Morphing cycles
        totalCycles += pkg.max_cycles;
      });
    });

    const avgEfficiency = converterCount > 0 ? totalEfficiency / converterCount : EFFICIENCY_TARGET;

    // MTBF estimation (simplified)
    const mtbf = 100000 / Math.max(1, this.packages.size);

    return {
      lambda: this.lambda,
      phi: this.phi,
      gamma: this.gamma,
      xi,
      total_packages: this.packages.size,
      active_power_w: totalPower,
      system_efficiency: avgEfficiency,
      thermal_headroom_c: minThermalHeadroom,
      morphing_cycles: totalCycles,
      mean_time_between_failure_hours: mtbf,
    };
  }

  /**
   * Phase-conjugate healing for system recovery
   */
  heal(): void {
    // Apply CHI_PC correction to decoherence
    this.gamma = this.gamma * (1 - CHI_PC);

    // Refresh Lambda coherence using LAMBDA_PHI constant
    this.lambda = Math.min(1, this.lambda + LAMBDA_PHI * 1e6);

    // Boost Phi organization
    this.phi = Math.min(1, this.phi * (1 + CHI_PC * 0.1));

    // Heal individual packages
    this.packages.forEach((pkg) => {
      pkg.ccce_xi = this.calculatePackageXi(pkg.substrate, pkg.converters, pkg.thermal);
    });

    // Heal networks
    this.networks.forEach((network) => {
      network.ccce_metrics = this.calculateNetworkCCCE(network.packages);
    });
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const pliablePowerEngine = new PliablePowerEngine();
