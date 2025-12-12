/**
 * DARPA MTO Topic 20: Energy Harvesting in Lunar Regolith
 * Solicitation: DARPA-RA-25-02-20
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - In-situ resource utilization (ISRU)
 * - Regolith thermal and electrical properties
 * - Solar energy collection in lunar environment
 * - Nuclear thermal conversion
 * - CCCE-guided energy coherence
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Lunar Environment Constants
// ============================================================================

export const LUNAR_CONSTANTS = {
  // Physical constants
  SOLAR_CONSTANT_MOON: 1361,          // W/m² (same as Earth, no atmosphere)
  LUNAR_DAY_SECONDS: 2551443,         // 29.53 Earth days
  LUNAR_GRAVITY: 1.62,                // m/s²
  SURFACE_TEMP_DAY: 400,              // K (maximum)
  SURFACE_TEMP_NIGHT: 100,            // K (minimum)
  TEMP_GRADIENT: 1.5,                 // K/cm (subsurface)

  // Regolith properties
  REGOLITH_DENSITY: 1500,             // kg/m³ (bulk)
  REGOLITH_POROSITY: 0.45,            // void fraction
  THERMAL_CONDUCTIVITY: 0.01,         // W/(m·K) (vacuum)
  SPECIFIC_HEAT: 800,                 // J/(kg·K)
  DIELECTRIC_CONSTANT: 2.5,           // relative permittivity

  // Elemental composition (mass %)
  OXYGEN_CONTENT: 0.45,               // Bound in oxides
  SILICON_CONTENT: 0.21,
  IRON_CONTENT: 0.13,
  ALUMINUM_CONTENT: 0.07,
  TITANIUM_CONTENT: 0.05,
  ILMENITE_CONTENT: 0.08,             // FeTiO₃

  // Nuclear isotopes
  HE3_CONCENTRATION: 20e-9,           // kg/kg regolith
  U238_CONCENTRATION: 0.5e-6,         // kg/kg regolith

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_ENERGY: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface LunarSite {
  id: string;
  name: string;
  coordinates: LunarCoordinates;
  terrain: TerrainProperties;
  regolith: RegolithSample;
  illumination: IlluminationProfile;
  resources: ResourceAssessment;
  ccceMetrics: CCCEMetrics;
}

export interface LunarCoordinates {
  latitude: number;                   // degrees
  longitude: number;                  // degrees
  elevation: number;                  // m relative to datum
}

export interface TerrainProperties {
  slope: number;                      // degrees
  roughness: number;                  // RMS height variation (m)
  craterDensity: number;              // craters/km²
  boulderCoverage: number;            // fraction
}

export interface RegolithSample {
  depth: number;                      // m
  density: number;                    // kg/m³
  porosity: number;
  grainSize: number;                  // median (μm)
  composition: ElementalComposition;
  minerals: MineralComposition;
}

export interface ElementalComposition {
  O: number;                          // mass fraction
  Si: number;
  Fe: number;
  Al: number;
  Ca: number;
  Mg: number;
  Ti: number;
  Na: number;
  K: number;
  H: number;                          // From solar wind implantation
  He3: number;                        // ppb by mass
}

export interface MineralComposition {
  plagioclase: number;                // Feldspar
  pyroxene: number;
  olivine: number;
  ilmenite: number;
  glass: number;
  agglutinates: number;
}

export interface IlluminationProfile {
  annualSunFraction: number;          // 0-1
  maxContinuousDark: number;          // hours
  peakIrradiance: number;             // W/m²
  solarAngleRange: [number, number];  // elevation angles
  earthVisibility: boolean;
}

export interface ResourceAssessment {
  waterIce: number;                   // kg/m³ estimated
  he3: number;                        // ppb
  titanium: number;                   // mass %
  iron: number;                       // mass %
  volatiles: number;                  // total volatiles (ppm)
}

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  timestamp: number;
}

export interface EnergySystem {
  id: string;
  siteId: string;
  type: 'solar' | 'rtg' | 'nuclear-thermal' | 'thermoelectric' | 'he3-fusion';
  components: SystemComponent[];
  performance: EnergyPerformance;
  ccceMetrics: CCCEMetrics;
}

export interface SystemComponent {
  id: string;
  type: string;
  mass: number;                       // kg
  volume: number;                     // m³
  efficiency: number;                 // 0-1
  operatingTemp: [number, number];    // K range
  powerOutput: number;                // W (nominal)
  lifetime: number;                   // hours
}

export interface EnergyPerformance {
  peakPower: number;                  // W
  averagePower: number;               // W
  capacityFactor: number;             // 0-1
  specificPower: number;              // W/kg
  energyDensity: number;              // Wh/kg
  systemEfficiency: number;           // 0-1
  degradationRate: number;            // %/year
}

export interface SolarArray {
  id: string;
  type: 'rigid' | 'flexible' | 'concentrator';
  area: number;                       // m²
  cellType: 'Si' | 'GaAs' | 'perovskite' | 'multijunction';
  efficiency: number;                 // 0-1 (at AM0)
  mass: number;                       // kg
  trackingType: 'fixed' | 'single-axis' | 'dual-axis';
  concentrationRatio?: number;
  thermalManagement: ThermalSystem;
}

export interface ThermalSystem {
  type: 'passive' | 'active' | 'hybrid';
  radiatorArea: number;               // m²
  heatPipeCount: number;
  operatingRange: [number, number];   // K
  thermalMass: number;                // kJ/K
}

export interface RTG {
  id: string;
  isotope: 'Pu238' | 'Am241' | 'Sr90';
  thermalPower: number;               // W (thermal)
  electricPower: number;              // W (electrical)
  mass: number;                       // kg
  halfLife: number;                   // years
  conversionType: 'thermoelectric' | 'stirling' | 'thermophotovoltaic';
  conversionEfficiency: number;       // 0-1
}

export interface ThermoelectricGenerator {
  id: string;
  hotSideTemp: number;                // K
  coldSideTemp: number;               // K
  material: 'BiTe' | 'PbTe' | 'SiGe' | 'skutterudite';
  figureOfMerit: number;              // ZT
  power: number;                      // W
  efficiency: number;
  couples: number;
}

export interface He3Reactor {
  id: string;
  fusionType: 'D-He3' | 'He3-He3';
  plasmaTemp: number;                 // keV
  confinement: 'magnetic' | 'inertial' | 'hybrid';
  burnFraction: number;               // 0-1
  fuelRate: number;                   // kg/hour
  thermalPower: number;               // MW
  electricPower: number;              // MW
  qValue: number;                     // Energy gain
}

export interface ExtractionSystem {
  id: string;
  targetResource: string;
  method: 'thermal' | 'chemical' | 'magnetic' | 'electrostatic';
  processingRate: number;             // kg/hour
  efficiency: number;                 // 0-1 (recovery)
  energyInput: number;                // W
  outputPurity: number;               // 0-1
}

export interface SimulationResult {
  systemId: string;
  duration: number;                   // hours
  energyGenerated: number;            // Wh
  peakPower: number;                  // W
  minPower: number;                   // W
  thermalCycles: number;
  degradation: number;                // fraction
  resourcesExtracted?: Record<string, number>;
  ccceEvolution: CCCEMetrics[];
}

// ============================================================================
// Lunar Sites Database
// ============================================================================

export const LUNAR_SITES: Record<string, Partial<LunarSite>> = {
  'shackleton': {
    name: 'Shackleton Crater Rim',
    coordinates: { latitude: -89.9, longitude: 0, elevation: 0 },
    illumination: {
      annualSunFraction: 0.89,
      maxContinuousDark: 52,
      peakIrradiance: 1361,
      solarAngleRange: [1.5, 3.0],
      earthVisibility: true,
    },
    resources: {
      waterIce: 5.6,          // kg/m³ in PSR
      he3: 15,
      titanium: 3.2,
      iron: 12.5,
      volatiles: 1500,
    },
  },
  'aristarchus': {
    name: 'Aristarchus Plateau',
    coordinates: { latitude: 23.7, longitude: -47.4, elevation: 2000 },
    illumination: {
      annualSunFraction: 0.50,
      maxContinuousDark: 354,
      peakIrradiance: 1361,
      solarAngleRange: [0, 90],
      earthVisibility: true,
    },
    resources: {
      waterIce: 0,
      he3: 25,
      titanium: 8.5,           // High-Ti mare
      iron: 18.0,
      volatiles: 500,
    },
  },
  'mare-tranquillitatis': {
    name: 'Mare Tranquillitatis',
    coordinates: { latitude: 8.5, longitude: 31.4, elevation: -1000 },
    illumination: {
      annualSunFraction: 0.50,
      maxContinuousDark: 354,
      peakIrradiance: 1361,
      solarAngleRange: [0, 90],
      earthVisibility: true,
    },
    resources: {
      waterIce: 0,
      he3: 22,
      titanium: 7.8,
      iron: 15.0,
      volatiles: 300,
    },
  },
};

// ============================================================================
// Lunar Energy Harvesting Engine
// ============================================================================

export class LunarEnergyEngine {
  private sites: Map<string, LunarSite> = new Map();
  private systems: Map<string, EnergySystem> = new Map();
  private extractors: Map<string, ExtractionSystem> = new Map();
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
  // Site Management
  // ==========================================================================

  /**
   * Initialize lunar site
   */
  createSite(
    name: string,
    coordinates: LunarCoordinates,
    illumination?: Partial<IlluminationProfile>
  ): LunarSite {
    const id = `SITE-${Date.now().toString(36)}`;

    // Check for known site data
    const knownSite = Object.values(LUNAR_SITES).find(s => s.name === name);

    const site: LunarSite = {
      id,
      name,
      coordinates,
      terrain: {
        slope: 5 + Math.random() * 10,
        roughness: 0.1 + Math.random() * 0.2,
        craterDensity: 100 + Math.random() * 200,
        boulderCoverage: 0.05 + Math.random() * 0.1,
      },
      regolith: this.generateRegolithSample(coordinates),
      illumination: {
        annualSunFraction: illumination?.annualSunFraction ?? (knownSite?.illumination?.annualSunFraction ?? 0.5),
        maxContinuousDark: illumination?.maxContinuousDark ?? 354,
        peakIrradiance: LUNAR_CONSTANTS.SOLAR_CONSTANT_MOON,
        solarAngleRange: illumination?.solarAngleRange ?? [0, 90],
        earthVisibility: Math.abs(coordinates.latitude) < 80,
      },
      resources: knownSite?.resources ?? {
        waterIce: Math.abs(coordinates.latitude) > 85 ? 5 + Math.random() * 5 : 0,
        he3: 15 + Math.random() * 15,
        titanium: 3 + Math.random() * 5,
        iron: 10 + Math.random() * 8,
        volatiles: 200 + Math.random() * 800,
      },
      ccceMetrics: { ...this.ccceState },
    };

    this.sites.set(id, site);
    return site;
  }

  private generateRegolithSample(coords: LunarCoordinates): RegolithSample {
    // Generate composition based on latitude (maria vs highlands)
    const isHighland = Math.abs(coords.latitude) > 30 || Math.random() > 0.5;

    return {
      depth: 5 + Math.random() * 10,
      density: LUNAR_CONSTANTS.REGOLITH_DENSITY * (0.9 + Math.random() * 0.2),
      porosity: LUNAR_CONSTANTS.REGOLITH_POROSITY * (0.9 + Math.random() * 0.2),
      grainSize: 40 + Math.random() * 60,  // 40-100 μm
      composition: {
        O: 0.45,
        Si: isHighland ? 0.22 : 0.19,
        Fe: isHighland ? 0.05 : 0.15,
        Al: isHighland ? 0.14 : 0.07,
        Ca: isHighland ? 0.11 : 0.08,
        Mg: isHighland ? 0.04 : 0.06,
        Ti: isHighland ? 0.01 : 0.06,
        Na: 0.003,
        K: 0.001,
        H: 50e-6,   // Solar wind implanted
        He3: 20e-9,
      },
      minerals: {
        plagioclase: isHighland ? 0.65 : 0.25,
        pyroxene: isHighland ? 0.10 : 0.45,
        olivine: isHighland ? 0.02 : 0.10,
        ilmenite: isHighland ? 0.01 : 0.10,
        glass: 0.10,
        agglutinates: 0.12,
      },
    };
  }

  // ==========================================================================
  // Solar Power Systems
  // ==========================================================================

  /**
   * Design solar array for site
   */
  designSolarArray(
    siteId: string,
    targetPower: number,               // W
    cellType: SolarArray['cellType'] = 'multijunction'
  ): SolarArray {
    const site = this.sites.get(siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    // Cell efficiencies (AM0, 25°C)
    const efficiencies: Record<SolarArray['cellType'], number> = {
      Si: 0.22,
      GaAs: 0.29,
      perovskite: 0.26,
      multijunction: 0.32,
    };

    const efficiency = efficiencies[cellType];
    const irradiance = site.illumination.peakIrradiance;
    const capacityFactor = site.illumination.annualSunFraction;

    // Required area for peak power
    const area = targetPower / (irradiance * efficiency);

    // Mass estimate (kg/m²)
    const specificMass: Record<SolarArray['cellType'], number> = {
      Si: 2.5,
      GaAs: 3.0,
      perovskite: 1.5,
      multijunction: 4.0,
    };
    const mass = area * specificMass[cellType];

    // Thermal management sizing
    const thermalLoad = targetPower * (1 - efficiency) / efficiency;
    const radiatorArea = thermalLoad / (5.67e-8 * Math.pow(350, 4) - 5.67e-8 * Math.pow(100, 4));

    const id = `SOLAR-${Date.now().toString(36)}`;

    return {
      id,
      type: cellType === 'multijunction' ? 'concentrator' : 'rigid',
      area,
      cellType,
      efficiency,
      mass,
      trackingType: 'dual-axis',
      concentrationRatio: cellType === 'multijunction' ? 500 : undefined,
      thermalManagement: {
        type: 'passive',
        radiatorArea,
        heatPipeCount: Math.ceil(thermalLoad / 100),
        operatingRange: [200, 400],
        thermalMass: mass * 0.9,  // J/K per kg
      },
    };
  }

  /**
   * Calculate solar power output at given time
   */
  calculateSolarPower(
    array: SolarArray,
    siteId: string,
    lunarTime: number                  // 0-1 (fraction of lunar day)
  ): number {
    const site = this.sites.get(siteId);
    if (!site) return 0;

    // Solar angle calculation (simplified)
    const solarAngle = Math.sin(lunarTime * 2 * Math.PI) * 90;  // degrees

    if (solarAngle < site.illumination.solarAngleRange[0]) {
      return 0;  // Night or below horizon
    }

    // Effective irradiance
    const effectiveAngle = Math.max(0, solarAngle - site.illumination.solarAngleRange[0]);
    const cosine = Math.cos(effectiveAngle * Math.PI / 180);

    // Temperature derating
    const cellTemp = 250 + 150 * cosine;  // K (approximation)
    const tempCoeff = cellTemp > 300 ? -0.004 * (cellTemp - 300) : 0;
    const tempFactor = 1 + tempCoeff;

    // Power output
    const irradiance = site.illumination.peakIrradiance * cosine;
    const power = array.area * irradiance * array.efficiency * tempFactor;

    return Math.max(0, power);
  }

  // ==========================================================================
  // Nuclear Power Systems
  // ==========================================================================

  /**
   * Design RTG system
   */
  designRTG(
    targetPower: number,               // W electrical
    isotope: RTG['isotope'] = 'Pu238'
  ): RTG {
    const id = `RTG-${Date.now().toString(36)}`;

    // Isotope properties
    const isotopeProps: Record<RTG['isotope'], { halfLife: number; specificPower: number }> = {
      Pu238: { halfLife: 87.7, specificPower: 0.57 },   // W/g thermal
      Am241: { halfLife: 432.2, specificPower: 0.11 },
      Sr90: { halfLife: 28.8, specificPower: 0.93 },
    };

    const props = isotopeProps[isotope];

    // Thermoelectric efficiency (~6-7% for SiGe)
    const conversionEfficiency = 0.065;

    // Required thermal power
    const thermalPower = targetPower / conversionEfficiency;

    // Fuel mass
    const fuelMass = thermalPower / (props.specificPower * 1000);  // kg

    // Total system mass (fuel + converter + shielding)
    const mass = fuelMass * 15;  // Typical mass multiplier

    return {
      id,
      isotope,
      thermalPower,
      electricPower: targetPower,
      mass,
      halfLife: props.halfLife,
      conversionType: 'thermoelectric',
      conversionEfficiency,
    };
  }

  /**
   * Design thermoelectric generator using regolith thermal gradient
   */
  designThermoelectric(
    siteId: string,
    targetPower: number                // W
  ): ThermoelectricGenerator {
    const site = this.sites.get(siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    const id = `TEG-${Date.now().toString(36)}`;

    // Temperature difference from day/night cycling or subsurface gradient
    const hotSideTemp = LUNAR_CONSTANTS.SURFACE_TEMP_DAY * 0.9;  // Absorber
    const coldSideTemp = LUNAR_CONSTANTS.SURFACE_TEMP_NIGHT * 1.2;  // Radiator to space

    // Carnot efficiency limit
    const carnotEfficiency = 1 - coldSideTemp / hotSideTemp;

    // ZT figure of merit for material selection
    const zt = 1.5;  // Good thermoelectric at these temps

    // Actual efficiency (fraction of Carnot)
    const efficiency = carnotEfficiency * (Math.sqrt(1 + zt) - 1) / (Math.sqrt(1 + zt) + coldSideTemp / hotSideTemp);

    // Heat flow needed
    const heatFlow = targetPower / efficiency;

    // Number of thermoelectric couples
    const powerPerCouple = 0.1;  // W per couple typical
    const couples = Math.ceil(targetPower / powerPerCouple);

    return {
      id,
      hotSideTemp,
      coldSideTemp,
      material: 'SiGe',
      figureOfMerit: zt,
      power: targetPower,
      efficiency,
      couples,
    };
  }

  // ==========================================================================
  // He-3 Fusion (Future)
  // ==========================================================================

  /**
   * Model He-3 fusion reactor (conceptual)
   */
  modelHe3Reactor(
    fuelRate: number                   // kg/year He-3
  ): He3Reactor {
    const id = `HE3-${Date.now().toString(36)}`;

    // D-He3 fusion energy: 18.3 MeV per reaction
    // 1 kg He-3 = 2e26 atoms = 3.6e27 MeV = 5.8e14 J
    const energyPerKg = 5.8e14;  // J/kg He-3

    // Conversion to power (assuming 60% capture efficiency)
    const thermalPower = (fuelRate / (365.25 * 24 * 3600)) * energyPerKg * 0.6 / 1e6;  // MW

    // Electrical conversion (40% thermal to electric)
    const electricPower = thermalPower * 0.4;

    // Q value (power out / power in for confinement)
    const qValue = 10;  // Target for economical fusion

    return {
      id,
      fusionType: 'D-He3',
      plasmaTemp: 60,              // keV
      confinement: 'magnetic',
      burnFraction: 0.3,
      fuelRate: fuelRate / (365.25 * 24),  // kg/hour
      thermalPower,
      electricPower,
      qValue,
    };
  }

  // ==========================================================================
  // Resource Extraction
  // ==========================================================================

  /**
   * Design He-3 extraction system
   */
  designHe3Extractor(
    siteId: string,
    targetRate: number                 // kg/year He-3
  ): ExtractionSystem {
    const site = this.sites.get(siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    const id = `EXTRACT-${Date.now().toString(36)}`;

    // He-3 concentration in regolith
    const he3Concentration = site.regolith.composition.He3;

    // Regolith processing rate needed
    const regolithRate = targetRate / he3Concentration;  // kg/year
    const hourlyRate = regolithRate / (365.25 * 24);     // kg/hour

    // Thermal extraction requires heating to ~700°C
    // Energy per kg regolith: ~800 J/(kg·K) × 700K = 560 kJ/kg
    const energyPerKg = 560e3;  // J/kg
    const powerRequired = hourlyRate * energyPerKg / 3600;  // W

    // Extraction efficiency (He-3 is deeply implanted, difficult to extract)
    const efficiency = 0.5;

    return {
      id,
      targetResource: 'He-3',
      method: 'thermal',
      processingRate: hourlyRate,
      efficiency,
      energyInput: powerRequired,
      outputPurity: 0.99,
    };
  }

  /**
   * Design water ice extraction (for polar sites)
   */
  designWaterExtractor(
    siteId: string,
    targetRate: number                 // kg/hour water
  ): ExtractionSystem {
    const site = this.sites.get(siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    const id = `WATER-${Date.now().toString(36)}`;

    // Check if site has water ice
    if (site.resources.waterIce < 0.1) {
      throw new Error('Site has insufficient water ice resources');
    }

    // Sublimation energy for water ice
    // Heat to 273K + latent heat of sublimation = ~2800 kJ/kg
    const energyPerKg = 2800e3;  // J/kg
    const powerRequired = targetRate * energyPerKg / 3600;  // W

    return {
      id,
      targetResource: 'H2O',
      method: 'thermal',
      processingRate: targetRate,
      efficiency: 0.85,
      energyInput: powerRequired,
      outputPurity: 0.95,
    };
  }

  // ==========================================================================
  // Energy System Integration
  // ==========================================================================

  /**
   * Create integrated energy system
   */
  createEnergySystem(
    siteId: string,
    type: EnergySystem['type'],
    targetPower: number
  ): EnergySystem {
    const site = this.sites.get(siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    const id = `ESYS-${Date.now().toString(36)}`;
    const components: SystemComponent[] = [];

    let performance: EnergyPerformance;

    switch (type) {
      case 'solar': {
        const array = this.designSolarArray(siteId, targetPower);
        components.push({
          id: array.id,
          type: 'solar-array',
          mass: array.mass,
          volume: array.area * 0.05,
          efficiency: array.efficiency,
          operatingTemp: array.thermalManagement.operatingRange,
          powerOutput: targetPower,
          lifetime: 15 * 365.25 * 24,
        });

        performance = {
          peakPower: targetPower,
          averagePower: targetPower * site.illumination.annualSunFraction,
          capacityFactor: site.illumination.annualSunFraction,
          specificPower: targetPower / array.mass,
          energyDensity: targetPower * site.illumination.annualSunFraction * 8760 / array.mass,
          systemEfficiency: array.efficiency,
          degradationRate: 1.5,
        };
        break;
      }

      case 'rtg': {
        const rtg = this.designRTG(targetPower);
        components.push({
          id: rtg.id,
          type: 'rtg',
          mass: rtg.mass,
          volume: rtg.mass / 1500,
          efficiency: rtg.conversionEfficiency,
          operatingTemp: [200, 500],
          powerOutput: rtg.electricPower,
          lifetime: rtg.halfLife * 0.8 * 365.25 * 24,
        });

        performance = {
          peakPower: targetPower,
          averagePower: targetPower * 0.95,  // Near constant
          capacityFactor: 0.95,
          specificPower: targetPower / rtg.mass,
          energyDensity: targetPower * 0.95 * 8760 / rtg.mass,
          systemEfficiency: rtg.conversionEfficiency,
          degradationRate: 0.787 / rtg.halfLife * 100,  // Based on half-life
        };
        break;
      }

      case 'thermoelectric': {
        const teg = this.designThermoelectric(siteId, targetPower);
        const mass = teg.couples * 0.05;  // kg per couple
        components.push({
          id: teg.id,
          type: 'thermoelectric',
          mass,
          volume: mass / 1000,
          efficiency: teg.efficiency,
          operatingTemp: [teg.coldSideTemp, teg.hotSideTemp],
          powerOutput: teg.power,
          lifetime: 20 * 365.25 * 24,
        });

        performance = {
          peakPower: targetPower,
          averagePower: targetPower * 0.5,  // Day/night variation
          capacityFactor: 0.5,
          specificPower: targetPower / mass,
          energyDensity: targetPower * 0.5 * 8760 / mass,
          systemEfficiency: teg.efficiency,
          degradationRate: 0.5,
        };
        break;
      }

      default:
        throw new Error(`Unsupported system type: ${type}`);
    }

    const system: EnergySystem = {
      id,
      siteId,
      type,
      components,
      performance,
      ccceMetrics: { ...this.ccceState },
    };

    this.systems.set(id, system);
    return system;
  }

  // ==========================================================================
  // Simulation
  // ==========================================================================

  /**
   * Simulate energy system over lunar day
   */
  simulate(
    systemId: string,
    lunarDays: number = 1
  ): SimulationResult {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    const site = this.sites.get(system.siteId);
    if (!site) {
      throw new Error(`Site ${system.siteId} not found`);
    }

    const ccceEvolution: CCCEMetrics[] = [{ ...system.ccceMetrics }];
    const hoursPerDay = LUNAR_CONSTANTS.LUNAR_DAY_SECONDS / 3600;
    const totalHours = lunarDays * hoursPerDay;
    const timeStep = 1;  // hour

    let totalEnergy = 0;
    let peakPower = 0;
    let minPower = Infinity;
    let thermalCycles = 0;
    let lastDayNight = false;

    for (let t = 0; t < totalHours; t += timeStep) {
      const lunarTime = (t % hoursPerDay) / hoursPerDay;

      let power = 0;

      switch (system.type) {
        case 'solar':
          const array = system.components.find(c => c.type === 'solar-array');
          if (array) {
            // Simplified solar array object for calculation
            power = this.calculateSolarPower({
              id: array.id,
              type: 'rigid',
              area: array.volume / 0.05,
              cellType: 'multijunction',
              efficiency: array.efficiency,
              mass: array.mass,
              trackingType: 'dual-axis',
              thermalManagement: {
                type: 'passive',
                radiatorArea: 0,
                heatPipeCount: 0,
                operatingRange: array.operatingTemp,
                thermalMass: 0,
              },
            }, system.siteId, lunarTime);
          }
          break;

        case 'rtg':
        case 'nuclear-thermal':
          // Constant power (with slight decay)
          const age = t / (365.25 * 24);  // years
          const decayFactor = Math.exp(-age * system.performance.degradationRate / 100);
          power = system.performance.peakPower * decayFactor;
          break;

        case 'thermoelectric':
          // Varies with temperature differential
          const isDaytime = lunarTime > 0.25 && lunarTime < 0.75;
          power = isDaytime ? system.performance.peakPower : system.performance.peakPower * 0.3;
          break;
      }

      totalEnergy += power * timeStep;
      peakPower = Math.max(peakPower, power);
      minPower = Math.min(minPower, power);

      // Count thermal cycles
      const isDay = lunarTime > 0.25 && lunarTime < 0.75;
      if (isDay !== lastDayNight) {
        thermalCycles++;
        lastDayNight = isDay;
      }

      // Update CCCE periodically
      if (t % (hoursPerDay / 4) < timeStep) {
        const efficiency = power / system.performance.peakPower;
        ccceEvolution.push({
          lambda: 0.9 + efficiency * 0.1,
          phi: system.ccceMetrics.phi,
          gamma: GAMMA_FIXED + (1 - efficiency) * 0.1,
          xi: 0,
          timestamp: Date.now(),
        });
        ccceEvolution[ccceEvolution.length - 1].xi =
          (ccceEvolution[ccceEvolution.length - 1].lambda * ccceEvolution[ccceEvolution.length - 1].phi) /
          Math.max(ccceEvolution[ccceEvolution.length - 1].gamma, 0.001);
      }
    }

    // Degradation from thermal cycling
    const degradation = thermalCycles * 0.0001;  // 0.01% per cycle

    return {
      systemId,
      duration: totalHours,
      energyGenerated: totalEnergy,
      peakPower,
      minPower: minPower === Infinity ? 0 : minPower,
      thermalCycles,
      degradation,
      ccceEvolution,
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
   * Get all sites
   */
  getSites(): LunarSite[] {
    return Array.from(this.sites.values());
  }

  /**
   * Get site by ID
   */
  getSite(id: string): LunarSite | undefined {
    return this.sites.get(id);
  }

  /**
   * Get all energy systems
   */
  getSystems(): EnergySystem[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get system by ID
   */
  getSystem(id: string): EnergySystem | undefined {
    return this.systems.get(id);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const lunarEnergyEngine = new LunarEnergyEngine();
