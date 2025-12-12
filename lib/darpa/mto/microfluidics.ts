/**
 * DARPA MTO Topic 24: Advancing Fully Integrated Microfluidic Systems
 * DNA-Lang Sovereign Computing Platform
 *
 * Solicitation: DARPA-RA-25-02-24
 *
 * Advanced microfluidic systems with integrated sensors, actuators,
 * and control for lab-on-chip applications, point-of-care diagnostics,
 * and chemical/biological analysis.
 *
 * CCCE Integration:
 * - Lambda (Λ): Flow control precision coherence
 * - Phi (Φ): Multi-component integration organization
 * - Gamma (Γ): System failure/clogging decoherence
 * - Xi (Ξ): Analytical throughput negentropic efficiency
 */

import {
  LAMBDA_PHI,
  PHI_THRESHOLD,
  GAMMA_FIXED,
  CHI_PC,
} from '../../constants';

// ============================================================================
// Microfluidics Physical Constants
// ============================================================================

/** Water viscosity at 25°C [Pa·s] */
const WATER_VISCOSITY = 0.001;

/** Water density [kg/m³] */
const WATER_DENSITY = 1000;

/** Surface tension of water [N/m] */
const WATER_SURFACE_TENSION = 0.072;

/** Boltzmann constant [J/K] */
const BOLTZMANN_K = 1.380649e-23;

/** Typical channel height [μm] */
const DEFAULT_CHANNEL_HEIGHT = 50;

/** Maximum Reynolds number for laminar flow */
const MAX_LAMINAR_RE = 2300;

/** Minimum droplet volume [pL] */
const MIN_DROPLET_VOLUME = 0.1;

// ============================================================================
// Type Definitions
// ============================================================================

export type ChannelGeometry =
  | 'rectangular'
  | 'circular'
  | 'serpentine'
  | 'spiral'
  | 't_junction'
  | 'y_junction'
  | 'cross_flow';

export type PumpingMechanism =
  | 'pressure_driven'
  | 'electroosmotic'
  | 'capillary'
  | 'centrifugal'
  | 'pneumatic'
  | 'peristaltic';

export type SensorType =
  | 'optical_absorbance'
  | 'fluorescence'
  | 'electrochemical'
  | 'impedance'
  | 'thermal'
  | 'mass_spectrometry';

export type MixingMethod =
  | 'passive_diffusion'
  | 'chaotic_advection'
  | 'acoustic'
  | 'magnetic'
  | 'electrokinetic';

export type ValveType =
  | 'pneumatic_membrane'
  | 'phase_change'
  | 'electrochemical'
  | 'magnetic'
  | 'check_valve';

export type SubstrateMaterial =
  | 'pdms'
  | 'glass'
  | 'silicon'
  | 'pmma'
  | 'coc'
  | 'paper';

export interface Microchannel {
  id: string;
  geometry: ChannelGeometry;
  width_um: number;
  height_um: number;
  length_mm: number;
  hydraulic_diameter_um: number;
  surface_properties: {
    contact_angle_deg: number;
    roughness_nm: number;
    surface_treatment?: string;
  };
  ccce_lambda: number;
}

export interface FluidProperties {
  id: string;
  name: string;
  viscosity_pa_s: number;
  density_kg_m3: number;
  surface_tension_n_m: number;
  diffusivity_m2_s: number;
  ph?: number;
  ionic_strength_m?: number;
}

export interface FlowConditions {
  channel_id: string;
  fluid_id: string;
  flow_rate_ul_min: number;
  velocity_mm_s: number;
  reynolds_number: number;
  peclet_number: number;
  capillary_number: number;
  pressure_drop_pa: number;
  is_laminar: boolean;
}

export interface IntegratedSensor {
  id: string;
  type: SensorType;
  location: { x_mm: number; y_mm: number };
  detection_limit: number;
  dynamic_range: number;
  response_time_ms: number;
  selectivity: Map<string, number>;
  ccce_phi: number;
}

export interface MixingElement {
  id: string;
  method: MixingMethod;
  efficiency: number;
  mixing_length_mm: number;
  mixing_time_ms: number;
  energy_input_mw?: number;
  ccce_gamma: number;
}

export interface MicroValve {
  id: string;
  type: ValveType;
  response_time_ms: number;
  max_pressure_kpa: number;
  leakage_rate: number;
  actuation_voltage_v?: number;
  actuation_pressure_kpa?: number;
  state: 'open' | 'closed' | 'partial';
}

export interface DropletGenerator {
  id: string;
  geometry: 't_junction' | 'flow_focusing' | 'co_flow';
  droplet_volume_pl: number;
  droplet_rate_hz: number;
  monodispersity: number;
  continuous_phase: string;
  dispersed_phase: string;
  ccce_lambda: number;
}

export interface MicrofluidicChip {
  id: string;
  substrate: SubstrateMaterial;
  dimensions: {
    length_mm: number;
    width_mm: number;
    thickness_mm: number;
  };
  channels: Map<string, Microchannel>;
  sensors: Map<string, IntegratedSensor>;
  mixers: Map<string, MixingElement>;
  valves: Map<string, MicroValve>;
  droplet_generators: Map<string, DropletGenerator>;
  pumping: PumpingMechanism;
  ccce_xi: number;
}

export interface FlowSimulation {
  chip_id: string;
  timestamp: number;
  flow_map: Map<string, FlowConditions>;
  pressure_field: number[][];
  concentration_field: number[][];
  mixing_efficiency: number;
  throughput_ul_hr: number;
}

export interface AnalyticalResult {
  sensor_id: string;
  timestamp: number;
  analyte: string;
  concentration: number;
  signal_to_noise: number;
  confidence: number;
  calibration_curve?: { x: number[]; y: number[] };
}

export interface SystemDiagnostics {
  chip_id: string;
  clogging_risk: Map<string, number>;
  bubble_detection: Map<string, boolean>;
  sensor_drift: Map<string, number>;
  valve_failures: string[];
  estimated_lifetime_hours: number;
  maintenance_needed: string[];
}

export interface MicrofluidicsMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  total_chips: number;
  active_channels: number;
  integrated_sensors: number;
  throughput_ul_hr: number;
  detection_events: number;
  system_uptime_percent: number;
}

// ============================================================================
// Microfluidics Engine
// ============================================================================

export class MicrofluidicsEngine {
  private chips: Map<string, MicrofluidicChip> = new Map();
  private fluids: Map<string, FluidProperties> = new Map();
  private simulations: Map<string, FlowSimulation> = new Map();
  private results: Map<string, AnalyticalResult[]> = new Map();

  // CCCE metrics
  private lambda: number = PHI_THRESHOLD;
  private phi: number = PHI_THRESHOLD;
  private gamma: number = GAMMA_FIXED;

  constructor() {
    this.initializeDefaultFluids();
  }

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  private initializeDefaultFluids(): void {
    const defaultFluids: FluidProperties[] = [
      {
        id: 'water',
        name: 'Deionized Water',
        viscosity_pa_s: WATER_VISCOSITY,
        density_kg_m3: WATER_DENSITY,
        surface_tension_n_m: WATER_SURFACE_TENSION,
        diffusivity_m2_s: 2.3e-9,
        ph: 7.0,
      },
      {
        id: 'pbs',
        name: 'Phosphate Buffered Saline',
        viscosity_pa_s: 0.00101,
        density_kg_m3: 1005,
        surface_tension_n_m: 0.072,
        diffusivity_m2_s: 2.0e-9,
        ph: 7.4,
        ionic_strength_m: 0.15,
      },
      {
        id: 'mineral_oil',
        name: 'Mineral Oil',
        viscosity_pa_s: 0.025,
        density_kg_m3: 850,
        surface_tension_n_m: 0.030,
        diffusivity_m2_s: 1e-10,
      },
      {
        id: 'blood_plasma',
        name: 'Human Blood Plasma',
        viscosity_pa_s: 0.0012,
        density_kg_m3: 1025,
        surface_tension_n_m: 0.056,
        diffusivity_m2_s: 6e-11,
        ph: 7.4,
      },
    ];

    defaultFluids.forEach((f) => this.fluids.set(f.id, f));
  }

  // --------------------------------------------------------------------------
  // Channel Design
  // --------------------------------------------------------------------------

  /**
   * Design a microchannel with specified geometry
   */
  designChannel(config: {
    geometry: ChannelGeometry;
    width_um: number;
    height_um?: number;
    length_mm: number;
    surface_treatment?: string;
  }): Microchannel {
    const id = `channel_${config.geometry}_${Date.now()}`;
    const height = config.height_um ?? DEFAULT_CHANNEL_HEIGHT;

    // Calculate hydraulic diameter
    const hydraulicDiameter = this.calculateHydraulicDiameter(
      config.geometry,
      config.width_um,
      height
    );

    // Default surface properties based on typical PDMS
    const surfaceProps = {
      contact_angle_deg: config.surface_treatment === 'plasma' ? 20 : 110,
      roughness_nm: 5,
      surface_treatment: config.surface_treatment,
    };

    const channel: Microchannel = {
      id,
      geometry: config.geometry,
      width_um: config.width_um,
      height_um: height,
      length_mm: config.length_mm,
      hydraulic_diameter_um: hydraulicDiameter,
      surface_properties: surfaceProps,
      ccce_lambda: this.calculateChannelLambda(config.geometry, hydraulicDiameter),
    };

    this.updateMetrics();
    return channel;
  }

  private calculateHydraulicDiameter(
    geometry: ChannelGeometry,
    width: number,
    height: number
  ): number {
    if (geometry === 'circular') {
      return width; // width is diameter for circular
    }

    // Rectangular: D_h = 4A/P = 4wh / 2(w+h) = 2wh / (w+h)
    return (2 * width * height) / (width + height);
  }

  private calculateChannelLambda(geometry: ChannelGeometry, diameter: number): number {
    // Lambda based on flow controllability
    const geometryFactor: Record<ChannelGeometry, number> = {
      rectangular: 0.90,
      circular: 0.95,
      serpentine: 0.85,
      spiral: 0.82,
      t_junction: 0.88,
      y_junction: 0.89,
      cross_flow: 0.87,
    };

    // Smaller channels = higher precision but more clogging risk
    const sizeFactor = diameter > 50 ? 0.95 : 0.85;

    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * geometryFactor[geometry] * sizeFactor;
  }

  // --------------------------------------------------------------------------
  // Flow Analysis
  // --------------------------------------------------------------------------

  /**
   * Calculate flow conditions in a channel
   */
  calculateFlowConditions(
    channel: Microchannel,
    fluid_id: string,
    flow_rate_ul_min: number
  ): FlowConditions {
    const fluid = this.fluids.get(fluid_id);
    if (!fluid) {
      throw new Error(`Fluid ${fluid_id} not found`);
    }

    // Convert units
    const Q_m3_s = (flow_rate_ul_min * 1e-9) / 60; // μL/min to m³/s
    const A_m2 = (channel.width_um * channel.height_um) * 1e-12; // μm² to m²
    const D_h_m = channel.hydraulic_diameter_um * 1e-6; // μm to m
    const L_m = channel.length_mm * 1e-3; // mm to m

    // Velocity
    const velocity_m_s = Q_m3_s / A_m2;
    const velocity_mm_s = velocity_m_s * 1000;

    // Reynolds number: Re = ρvD/μ
    const reynolds = (fluid.density_kg_m3 * velocity_m_s * D_h_m) / fluid.viscosity_pa_s;

    // Peclet number: Pe = vL/D (diffusive transport)
    const peclet = (velocity_m_s * L_m) / fluid.diffusivity_m2_s;

    // Capillary number: Ca = μv/γ (viscous vs surface tension)
    const capillary = (fluid.viscosity_pa_s * velocity_m_s) / fluid.surface_tension_n_m;

    // Pressure drop (Hagen-Poiseuille for rectangular)
    const pressureDrop = this.calculatePressureDrop(
      channel,
      fluid,
      Q_m3_s,
      velocity_m_s
    );

    return {
      channel_id: channel.id,
      fluid_id,
      flow_rate_ul_min,
      velocity_mm_s,
      reynolds_number: reynolds,
      peclet_number: peclet,
      capillary_number: capillary,
      pressure_drop_pa: pressureDrop,
      is_laminar: reynolds < MAX_LAMINAR_RE,
    };
  }

  private calculatePressureDrop(
    channel: Microchannel,
    fluid: FluidProperties,
    Q_m3_s: number,
    velocity_m_s: number
  ): number {
    const D_h_m = channel.hydraulic_diameter_um * 1e-6;
    const L_m = channel.length_mm * 1e-3;

    // For rectangular channels: ΔP = 12μLQ/(wh³) * f(aspect ratio)
    const w = channel.width_um * 1e-6;
    const h = channel.height_um * 1e-6;
    const aspectRatio = w / h;

    // Aspect ratio correction factor
    let f_aspect = 1;
    if (aspectRatio > 1) {
      f_aspect = 1 - 0.63 / aspectRatio;
    } else {
      f_aspect = 1 - 0.63 * aspectRatio;
    }

    // Pressure drop
    const dP = (12 * fluid.viscosity_pa_s * L_m * Q_m3_s) / (w * Math.pow(h, 3) * f_aspect);

    return dP;
  }

  // --------------------------------------------------------------------------
  // Sensor Integration
  // --------------------------------------------------------------------------

  /**
   * Design an integrated sensor
   */
  designSensor(config: {
    type: SensorType;
    location: { x_mm: number; y_mm: number };
    target_analytes: string[];
  }): IntegratedSensor {
    const id = `sensor_${config.type}_${Date.now()}`;

    // Sensor-specific defaults
    const sensorDefaults = this.getSensorDefaults(config.type);

    // Build selectivity map
    const selectivity = new Map<string, number>();
    config.target_analytes.forEach((analyte, i) => {
      // Primary target has highest selectivity
      selectivity.set(analyte, i === 0 ? 1.0 : 0.8 - i * 0.1);
    });

    const sensor: IntegratedSensor = {
      id,
      type: config.type,
      location: config.location,
      detection_limit: sensorDefaults.detection_limit,
      dynamic_range: sensorDefaults.dynamic_range,
      response_time_ms: sensorDefaults.response_time,
      selectivity,
      ccce_phi: this.calculateSensorPhi(config.type, sensorDefaults),
    };

    this.updateMetrics();
    return sensor;
  }

  private getSensorDefaults(type: SensorType): {
    detection_limit: number;
    dynamic_range: number;
    response_time: number;
  } {
    const defaults: Record<SensorType, ReturnType<typeof this.getSensorDefaults>> = {
      optical_absorbance: {
        detection_limit: 1e-6, // 1 μM
        dynamic_range: 1e4,
        response_time: 100,
      },
      fluorescence: {
        detection_limit: 1e-9, // 1 nM
        dynamic_range: 1e6,
        response_time: 10,
      },
      electrochemical: {
        detection_limit: 1e-7, // 100 nM
        dynamic_range: 1e5,
        response_time: 50,
      },
      impedance: {
        detection_limit: 1e-5, // 10 μM
        dynamic_range: 1e3,
        response_time: 200,
      },
      thermal: {
        detection_limit: 0.01, // 10 mK
        dynamic_range: 1e2,
        response_time: 500,
      },
      mass_spectrometry: {
        detection_limit: 1e-12, // 1 pM
        dynamic_range: 1e8,
        response_time: 1000,
      },
    };

    return defaults[type];
  }

  private calculateSensorPhi(
    type: SensorType,
    defaults: { detection_limit: number; dynamic_range: number }
  ): number {
    // Phi based on sensitivity and dynamic range
    const sensitivityScore = Math.min(1, -Math.log10(defaults.detection_limit) / 12);
    const rangeScore = Math.min(1, Math.log10(defaults.dynamic_range) / 8);

    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * (0.6 * sensitivityScore + 0.4 * rangeScore);
  }

  // --------------------------------------------------------------------------
  // Mixing Elements
  // --------------------------------------------------------------------------

  /**
   * Design a mixing element
   */
  designMixer(config: {
    method: MixingMethod;
    target_efficiency: number;
    max_length_mm?: number;
  }): MixingElement {
    const id = `mixer_${config.method}_${Date.now()}`;

    // Calculate mixing parameters
    const mixingParams = this.calculateMixingParameters(
      config.method,
      config.target_efficiency,
      config.max_length_mm ?? 10
    );

    const mixer: MixingElement = {
      id,
      method: config.method,
      efficiency: Math.min(config.target_efficiency, mixingParams.max_efficiency),
      mixing_length_mm: mixingParams.length,
      mixing_time_ms: mixingParams.time,
      energy_input_mw: mixingParams.energy,
      ccce_gamma: this.calculateMixerGamma(config.method, mixingParams.max_efficiency),
    };

    this.updateMetrics();
    return mixer;
  }

  private calculateMixingParameters(
    method: MixingMethod,
    targetEfficiency: number,
    maxLength: number
  ): { length: number; time: number; max_efficiency: number; energy?: number } {
    // Method-specific mixing characteristics
    const methodParams: Record<MixingMethod, {
      length_factor: number;
      time_factor: number;
      max_eff: number;
      energy?: number;
    }> = {
      passive_diffusion: { length_factor: 10, time_factor: 1000, max_eff: 0.95 },
      chaotic_advection: { length_factor: 2, time_factor: 100, max_eff: 0.99 },
      acoustic: { length_factor: 0.5, time_factor: 10, max_eff: 0.99, energy: 10 },
      magnetic: { length_factor: 1, time_factor: 50, max_eff: 0.98, energy: 5 },
      electrokinetic: { length_factor: 1.5, time_factor: 80, max_eff: 0.97, energy: 2 },
    };

    const params = methodParams[method];

    // Scale length based on target efficiency
    const efficiencyFactor = -Math.log(1 - targetEfficiency);
    const length = Math.min(maxLength, params.length_factor * efficiencyFactor);

    return {
      length,
      time: params.time_factor * efficiencyFactor,
      max_efficiency: params.max_eff,
      energy: params.energy,
    };
  }

  private calculateMixerGamma(method: MixingMethod, efficiency: number): number {
    // Lower gamma = better (less decoherence)
    // Active methods have lower gamma but require energy
    const baseGamma: Record<MixingMethod, number> = {
      passive_diffusion: 0.15,
      chaotic_advection: 0.08,
      acoustic: 0.05,
      magnetic: 0.06,
      electrokinetic: 0.07,
    };

    // Higher efficiency = lower gamma
    return baseGamma[method] * (2 - efficiency);
  }

  // --------------------------------------------------------------------------
  // Valve Control
  // --------------------------------------------------------------------------

  /**
   * Design a microvalve
   */
  designValve(config: {
    type: ValveType;
    max_pressure_kpa?: number;
  }): MicroValve {
    const id = `valve_${config.type}_${Date.now()}`;

    const valveDefaults = this.getValveDefaults(config.type);

    const valve: MicroValve = {
      id,
      type: config.type,
      response_time_ms: valveDefaults.response_time,
      max_pressure_kpa: config.max_pressure_kpa ?? valveDefaults.max_pressure,
      leakage_rate: valveDefaults.leakage,
      actuation_voltage_v: valveDefaults.voltage,
      actuation_pressure_kpa: valveDefaults.actuation_pressure,
      state: 'closed',
    };

    return valve;
  }

  private getValveDefaults(type: ValveType): {
    response_time: number;
    max_pressure: number;
    leakage: number;
    voltage?: number;
    actuation_pressure?: number;
  } {
    const defaults: Record<ValveType, ReturnType<typeof this.getValveDefaults>> = {
      pneumatic_membrane: {
        response_time: 10,
        max_pressure: 200,
        leakage: 0.001,
        actuation_pressure: 30,
      },
      phase_change: {
        response_time: 1000,
        max_pressure: 500,
        leakage: 0.0001,
      },
      electrochemical: {
        response_time: 100,
        max_pressure: 50,
        leakage: 0.01,
        voltage: 5,
      },
      magnetic: {
        response_time: 5,
        max_pressure: 100,
        leakage: 0.005,
      },
      check_valve: {
        response_time: 1,
        max_pressure: 300,
        leakage: 0.0001,
      },
    };

    return defaults[type];
  }

  /**
   * Actuate a valve
   */
  actuateValve(valve: MicroValve, targetState: 'open' | 'closed' | 'partial'): {
    success: boolean;
    actual_state: 'open' | 'closed' | 'partial';
    response_time_actual_ms: number;
  } {
    // Simulate actuation with some variability
    const responseVariability = 1 + (Math.random() - 0.5) * 0.2;
    const actualResponseTime = valve.response_time_ms * responseVariability;

    // Check if valve can achieve partial state
    if (targetState === 'partial' && valve.type === 'check_valve') {
      return {
        success: false,
        actual_state: valve.state,
        response_time_actual_ms: 0,
      };
    }

    valve.state = targetState;

    return {
      success: true,
      actual_state: targetState,
      response_time_actual_ms: actualResponseTime,
    };
  }

  // --------------------------------------------------------------------------
  // Droplet Generation
  // --------------------------------------------------------------------------

  /**
   * Design a droplet generator
   */
  designDropletGenerator(config: {
    geometry: 't_junction' | 'flow_focusing' | 'co_flow';
    continuous_phase: string;
    dispersed_phase: string;
    target_volume_pl: number;
    target_rate_hz: number;
  }): DropletGenerator {
    const id = `droplet_gen_${config.geometry}_${Date.now()}`;

    // Calculate achievable parameters
    const achievableVolume = Math.max(MIN_DROPLET_VOLUME, config.target_volume_pl);

    // Monodispersity depends on geometry
    const monodispersity: Record<typeof config.geometry, number> = {
      t_junction: 0.95,
      flow_focusing: 0.98,
      co_flow: 0.92,
    };

    const generator: DropletGenerator = {
      id,
      geometry: config.geometry,
      droplet_volume_pl: achievableVolume,
      droplet_rate_hz: config.target_rate_hz,
      monodispersity: monodispersity[config.geometry],
      continuous_phase: config.continuous_phase,
      dispersed_phase: config.dispersed_phase,
      ccce_lambda: this.calculateDropletLambda(config.geometry, monodispersity[config.geometry]),
    };

    return generator;
  }

  private calculateDropletLambda(geometry: string, monodispersity: number): number {
    // Lambda based on droplet uniformity
    return PHI_THRESHOLD + (1 - PHI_THRESHOLD) * monodispersity;
  }

  // --------------------------------------------------------------------------
  // Chip Assembly
  // --------------------------------------------------------------------------

  /**
   * Create a complete microfluidic chip
   */
  createChip(config: {
    substrate: SubstrateMaterial;
    dimensions: { length_mm: number; width_mm: number; thickness_mm?: number };
    channels: Microchannel[];
    sensors?: IntegratedSensor[];
    mixers?: MixingElement[];
    valves?: MicroValve[];
    droplet_generators?: DropletGenerator[];
    pumping: PumpingMechanism;
  }): MicrofluidicChip {
    const id = `chip_${config.substrate}_${Date.now()}`;

    // Build component maps
    const channelMap = new Map<string, Microchannel>();
    config.channels.forEach((c) => channelMap.set(c.id, c));

    const sensorMap = new Map<string, IntegratedSensor>();
    config.sensors?.forEach((s) => sensorMap.set(s.id, s));

    const mixerMap = new Map<string, MixingElement>();
    config.mixers?.forEach((m) => mixerMap.set(m.id, m));

    const valveMap = new Map<string, MicroValve>();
    config.valves?.forEach((v) => valveMap.set(v.id, v));

    const dropletMap = new Map<string, DropletGenerator>();
    config.droplet_generators?.forEach((d) => dropletMap.set(d.id, d));

    const chip: MicrofluidicChip = {
      id,
      substrate: config.substrate,
      dimensions: {
        ...config.dimensions,
        thickness_mm: config.dimensions.thickness_mm ?? 2,
      },
      channels: channelMap,
      sensors: sensorMap,
      mixers: mixerMap,
      valves: valveMap,
      droplet_generators: dropletMap,
      pumping: config.pumping,
      ccce_xi: this.calculateChipXi(channelMap, sensorMap, mixerMap),
    };

    this.chips.set(id, chip);
    this.updateMetrics();

    return chip;
  }

  private calculateChipXi(
    channels: Map<string, Microchannel>,
    sensors: Map<string, IntegratedSensor>,
    mixers: Map<string, MixingElement>
  ): number {
    // Aggregate metrics
    let lambda = PHI_THRESHOLD;
    let phi = PHI_THRESHOLD;
    let gamma = GAMMA_FIXED;

    if (channels.size > 0) {
      lambda = Array.from(channels.values())
        .reduce((sum, c) => sum + c.ccce_lambda, 0) / channels.size;
    }

    if (sensors.size > 0) {
      phi = Array.from(sensors.values())
        .reduce((sum, s) => sum + s.ccce_phi, 0) / sensors.size;
    }

    if (mixers.size > 0) {
      gamma = Array.from(mixers.values())
        .reduce((sum, m) => sum + m.ccce_gamma, 0) / mixers.size;
    }

    return (lambda * phi) / Math.max(0.01, gamma);
  }

  // --------------------------------------------------------------------------
  // Flow Simulation
  // --------------------------------------------------------------------------

  /**
   * Simulate flow through a chip
   */
  simulateFlow(
    chipId: string,
    fluid_id: string,
    inlet_flow_rates: Map<string, number>
  ): FlowSimulation {
    const chip = this.chips.get(chipId);
    if (!chip) {
      throw new Error(`Chip ${chipId} not found`);
    }

    const flowMap = new Map<string, FlowConditions>();
    let totalThroughput = 0;
    let mixingEff = 0;
    let mixerCount = 0;

    // Calculate flow in each channel
    chip.channels.forEach((channel) => {
      const inletRate = inlet_flow_rates.get(channel.id) ?? 1.0; // Default 1 μL/min
      const conditions = this.calculateFlowConditions(channel, fluid_id, inletRate);
      flowMap.set(channel.id, conditions);
      totalThroughput += inletRate;
    });

    // Calculate mixing efficiency
    chip.mixers.forEach((mixer) => {
      mixingEff += mixer.efficiency;
      mixerCount++;
    });

    const avgMixingEff = mixerCount > 0 ? mixingEff / mixerCount : 1.0;

    // Generate simplified pressure/concentration fields
    const gridSize = 10;
    const pressureField: number[][] = [];
    const concentrationField: number[][] = [];

    for (let i = 0; i < gridSize; i++) {
      const pressureRow: number[] = [];
      const concRow: number[] = [];
      for (let j = 0; j < gridSize; j++) {
        // Simplified pressure gradient
        pressureField.push([(1 - j / gridSize) * 1000]);
        // Simplified concentration (diffusion)
        concentrationField.push([avgMixingEff * (1 - Math.exp(-j / gridSize))]);
      }
    }

    const simulation: FlowSimulation = {
      chip_id: chipId,
      timestamp: Date.now(),
      flow_map: flowMap,
      pressure_field: pressureField,
      concentration_field: concentrationField,
      mixing_efficiency: avgMixingEff,
      throughput_ul_hr: totalThroughput * 60,
    };

    this.simulations.set(chipId, simulation);
    this.updateMetrics();

    return simulation;
  }

  // --------------------------------------------------------------------------
  // Analysis and Detection
  // --------------------------------------------------------------------------

  /**
   * Perform analysis with an integrated sensor
   */
  performAnalysis(
    chipId: string,
    sensorId: string,
    analyte: string,
    sample_concentration: number
  ): AnalyticalResult {
    const chip = this.chips.get(chipId);
    if (!chip) {
      throw new Error(`Chip ${chipId} not found`);
    }

    const sensor = chip.sensors.get(sensorId);
    if (!sensor) {
      throw new Error(`Sensor ${sensorId} not found on chip ${chipId}`);
    }

    // Check if analyte is in selectivity map
    const selectivity = sensor.selectivity.get(analyte) ?? 0.5;

    // Calculate signal
    const signalStrength = sample_concentration * selectivity;
    const noise = sensor.detection_limit * 0.1 * Math.random();
    const snr = signalStrength / Math.max(noise, 1e-15);

    // Confidence based on SNR and selectivity
    const confidence = Math.min(1, (snr / 100) * selectivity);

    const result: AnalyticalResult = {
      sensor_id: sensorId,
      timestamp: Date.now(),
      analyte,
      concentration: sample_concentration,
      signal_to_noise: snr,
      confidence,
    };

    // Store result
    if (!this.results.has(chipId)) {
      this.results.set(chipId, []);
    }
    this.results.get(chipId)!.push(result);

    this.updateMetrics();
    return result;
  }

  // --------------------------------------------------------------------------
  // System Diagnostics
  // --------------------------------------------------------------------------

  /**
   * Run diagnostics on a chip
   */
  runDiagnostics(chipId: string): SystemDiagnostics {
    const chip = this.chips.get(chipId);
    if (!chip) {
      throw new Error(`Chip ${chipId} not found`);
    }

    const cloggingRisk = new Map<string, number>();
    const bubbleDetection = new Map<string, boolean>();
    const sensorDrift = new Map<string, number>();
    const valveFailures: string[] = [];
    const maintenanceNeeded: string[] = [];

    // Assess each channel for clogging
    chip.channels.forEach((channel) => {
      // Smaller channels have higher clogging risk
      const sizeRisk = 50 / channel.hydraulic_diameter_um;
      const risk = Math.min(1, sizeRisk * 0.1);
      cloggingRisk.set(channel.id, risk);

      // Bubble detection (random for simulation)
      const hasBubble = Math.random() < 0.05;
      bubbleDetection.set(channel.id, hasBubble);

      if (hasBubble) {
        maintenanceNeeded.push(`Remove bubble from ${channel.id}`);
      }

      if (risk > 0.3) {
        maintenanceNeeded.push(`High clogging risk in ${channel.id}`);
      }
    });

    // Check sensor drift
    chip.sensors.forEach((sensor) => {
      const drift = Math.random() * 0.1; // 0-10% drift
      sensorDrift.set(sensor.id, drift);

      if (drift > 0.05) {
        maintenanceNeeded.push(`Recalibrate sensor ${sensor.id}`);
      }
    });

    // Check valves
    chip.valves.forEach((valve) => {
      if (valve.leakage_rate > 0.05) {
        valveFailures.push(valve.id);
        maintenanceNeeded.push(`Replace leaky valve ${valve.id}`);
      }
    });

    // Estimate lifetime
    const avgCloggingRisk = Array.from(cloggingRisk.values())
      .reduce((sum, r) => sum + r, 0) / Math.max(1, cloggingRisk.size);
    const lifetimeHours = 1000 * (1 - avgCloggingRisk);

    return {
      chip_id: chipId,
      clogging_risk: cloggingRisk,
      bubble_detection: bubbleDetection,
      sensor_drift: sensorDrift,
      valve_failures: valveFailures,
      estimated_lifetime_hours: lifetimeHours,
      maintenance_needed: maintenanceNeeded,
    };
  }

  // --------------------------------------------------------------------------
  // CCCE Metrics
  // --------------------------------------------------------------------------

  private updateMetrics(): void {
    // Aggregate from all chips
    if (this.chips.size === 0) return;

    let totalLambda = 0;
    let totalPhi = 0;
    let totalGamma = 0;
    let channelCount = 0;
    let sensorCount = 0;
    let mixerCount = 0;

    this.chips.forEach((chip) => {
      chip.channels.forEach((c) => {
        totalLambda += c.ccce_lambda;
        channelCount++;
      });

      chip.sensors.forEach((s) => {
        totalPhi += s.ccce_phi;
        sensorCount++;
      });

      chip.mixers.forEach((m) => {
        totalGamma += m.ccce_gamma;
        mixerCount++;
      });
    });

    if (channelCount > 0) this.lambda = totalLambda / channelCount;
    if (sensorCount > 0) this.phi = totalPhi / sensorCount;
    if (mixerCount > 0) this.gamma = totalGamma / mixerCount;
  }

  /**
   * Get current CCCE metrics
   */
  getMetrics(): MicrofluidicsMetrics {
    const xi = (this.lambda * this.phi) / Math.max(0.01, this.gamma);

    // Calculate system statistics
    let activeChannels = 0;
    let integratedSensors = 0;
    let totalThroughput = 0;
    let detectionEvents = 0;

    this.chips.forEach((chip) => {
      activeChannels += chip.channels.size;
      integratedSensors += chip.sensors.size;
    });

    this.simulations.forEach((sim) => {
      totalThroughput += sim.throughput_ul_hr;
    });

    this.results.forEach((results) => {
      detectionEvents += results.length;
    });

    // System uptime estimate
    let uptime = 100;
    this.chips.forEach((chip) => {
      const diag = this.runDiagnostics(chip.id);
      uptime = Math.min(uptime, 100 - diag.maintenance_needed.length * 5);
    });

    return {
      lambda: this.lambda,
      phi: this.phi,
      gamma: this.gamma,
      xi,
      total_chips: this.chips.size,
      active_channels: activeChannels,
      integrated_sensors: integratedSensors,
      throughput_ul_hr: totalThroughput,
      detection_events: detectionEvents,
      system_uptime_percent: Math.max(0, uptime),
    };
  }

  /**
   * Phase-conjugate healing
   */
  heal(): void {
    // Apply CHI_PC correction
    this.gamma = this.gamma * (1 - CHI_PC);

    // Refresh Lambda using LAMBDA_PHI
    this.lambda = Math.min(1, this.lambda + LAMBDA_PHI * 1e6);

    // Boost Phi
    this.phi = Math.min(1, this.phi * (1 + CHI_PC * 0.1));

    // Heal individual chips
    this.chips.forEach((chip) => {
      chip.ccce_xi = this.calculateChipXi(chip.channels, chip.sensors, chip.mixers);
    });
  }

  // --------------------------------------------------------------------------
  // Utility
  // --------------------------------------------------------------------------

  /**
   * Register a custom fluid
   */
  registerFluid(fluid: FluidProperties): void {
    this.fluids.set(fluid.id, fluid);
  }

  /**
   * Get all registered fluids
   */
  getFluids(): FluidProperties[] {
    return Array.from(this.fluids.values());
  }

  /**
   * Get chip by ID
   */
  getChip(chipId: string): MicrofluidicChip | undefined {
    return this.chips.get(chipId);
  }

  /**
   * Get all chips
   */
  getAllChips(): MicrofluidicChip[] {
    return Array.from(this.chips.values());
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const microfluidicsEngine = new MicrofluidicsEngine();
