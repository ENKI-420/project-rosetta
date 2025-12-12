/**
 * DARPA Program Modules Index
 * DNA-Lang Sovereign Computing Platform
 *
 * Phase 6-11 Implementation - Complete DARPA BAAT Module Suite
 * 25 Modules across BTO, I2O, MTO, DSO offices
 * Includes SCIMITAR Intent Deduction Engine with 369 Harmonic Analysis
 */

// BTO - Biological Technologies Office
export * from './bto/dna-rapid-memory';
export * from './bto/designer-biocondensates';
export * from './bto/bioprinted-metamaterials';
export * from './bto/combat-physio-sensors';
export * from './bto/next-gen-separations';

// I2O - Information Innovation Office
export * from './i2o/ai-containment';
export * from './i2o/llm-control-theory';
export * from './i2o/formal-informal-math';
export * from './i2o/symbolic-robotics';
export * from './i2o/advanced-compiler';
export * from './i2o/ai-future-work';

// MTO - Microsystems Technology Office
export * from './mto/molecular-machines';
export * from './mto/optical-memory';
export * from './mto/lunar-energy';
export * from './mto/uv-photonics';
export * from './mto/pliable-power';
export * from './mto/microfluidics';

// DSO - Defense Sciences Office
export * from './dso/nuclear-coherence';
export * from './dso/spacetime-diamond-qip';
export * from './dso/mems-microsystems';
export * from './dso/agentic-ai-analysis';
export * from './dso/plasma-measurement';
export * from './dso/underwater-comms';
export * from './dso/neural-biomarkers';
export * from './dso/scimitar-intent-engine';

// Re-export singleton instances for convenience
export {
  dnaRAM,
  DNARapidMemory,
  createDNARAMHandler,
} from './bto/dna-rapid-memory';

export {
  biocondensateEngine,
  BiocondensateEngine,
} from './bto/designer-biocondensates';

export {
  metamaterialEngine,
  BioprintedMetamaterialEngine,
} from './bto/bioprinted-metamaterials';

export {
  combatPhysioEngine,
  CombatPhysioEngine,
} from './bto/combat-physio-sensors';

export {
  separationsEngine,
  SeparationsEngine,
} from './bto/next-gen-separations';

export {
  containmentEngine,
  AIContainmentEngine,
} from './i2o/ai-containment';

export {
  llmController,
  LLMControlEngine,
} from './i2o/llm-control-theory';

export {
  formalMathEngine,
  FormalInformalMathEngine,
} from './i2o/formal-informal-math';

export {
  symbolicRoboticsEngine,
  SymbolicRoboticsEngine,
} from './i2o/symbolic-robotics';

export {
  advancedCompilerEngine,
  AdvancedCompilerEngine,
} from './i2o/advanced-compiler';

export {
  molecularFactory,
  MolecularMachineFactory,
} from './mto/molecular-machines';

export {
  opticalMemoryEngine,
  OpticalMemoryEngine,
} from './mto/optical-memory';

export {
  nuclearEngine,
  NuclearCoherenceEngine,
  NUCLEI,
} from './dso/nuclear-coherence';

export {
  spacetimeEngine,
  SpacetimeDiamondEngine,
} from './dso/spacetime-diamond-qip';

export {
  memsEngine,
  MEMSMicrosystemsEngine,
} from './dso/mems-microsystems';

export {
  agenticEngine,
  AgenticAIEngine,
} from './dso/agentic-ai-analysis';

export {
  plasmaEngine,
  PlasmaMeasurementEngine,
} from './dso/plasma-measurement';

export {
  underwaterEngine,
  UnderwaterCommsEngine,
} from './dso/underwater-comms';

export {
  neuralBiomarkerEngine,
  NeuralBiomarkerEngine,
} from './dso/neural-biomarkers';

export {
  lunarEnergyEngine,
  LunarEnergyEngine,
} from './mto/lunar-energy';

export {
  uvPhotonicsEngine,
  UVPhotonicsEngine,
} from './mto/uv-photonics';

export {
  pliablePowerEngine,
  PliablePowerEngine,
} from './mto/pliable-power';

export {
  microfluidicsEngine,
  MicrofluidicsEngine,
} from './mto/microfluidics';

export {
  aiFutureWorkEngine,
  AIFutureWorkEngine,
} from './i2o/ai-future-work';

export {
  scimitarEngine,
  ScimitarIntentEngine,
  QuaternionOps,
  MultivectorOps,
  SphericalTrig,
} from './dso/scimitar-intent-engine';

/**
 * DARPA Module Registry
 * Maps solicitation numbers to module implementations
 */
export const DARPA_MODULES = {
  // BTO - Biological Technologies Office
  'DARPA-RA-25-02-08': {
    name: 'DNA Rapid Access Memory',
    office: 'BTO',
    module: 'dna-rapid-memory',
    description: 'DNA-based data storage with CRSM coherence tracking',
  },
  'DARPA-RA-25-02-09': {
    name: 'Designer Biocondensates',
    office: 'BTO',
    module: 'designer-biocondensates',
    description: 'Programmable biomolecular condensates for compartmentalized biochemistry',
  },
  'DARPA-RA-25-02-10': {
    name: 'Combat Magnetic Physiological Sensors',
    office: 'BTO',
    module: 'combat-physio-sensors',
    description: 'MCG/MEG-based physiological monitoring for combat readiness assessment',
  },
  'DARPA-RA-25-02-11': {
    name: 'Next Generation Separations',
    office: 'BTO',
    module: 'next-gen-separations',
    description: 'Advanced membrane, adsorption, and chromatographic separation technologies',
  },
  'DARPA-RA-25-02-12': {
    name: 'Bioprinted Living Meta-Materials',
    office: 'BTO',
    module: 'bioprinted-metamaterials',
    description: 'Living metamaterial design with programmable mechanical/optical properties',
  },

  // I2O - Information Innovation Office
  'DARPA-RA-25-02-13': {
    name: 'Formal Assurance & AI Containment',
    office: 'I2O',
    module: 'ai-containment',
    description: 'Formal verification and containment for AI systems',
  },
  'DARPA-RA-25-02-14': {
    name: 'Control Theory of LLMs',
    office: 'I2O',
    module: 'llm-control-theory',
    description: 'Control-theoretic framework for LLM behavior regulation',
  },
  'DARPA-RA-25-02-16': {
    name: 'Formal Foundations for Informal Math',
    office: 'I2O',
    module: 'formal-informal-math',
    description: 'Bridging informal mathematical reasoning with formal proof systems',
  },
  'DARPA-RA-25-02-17': {
    name: 'Grounding Symbolic Robotic Knowledge',
    office: 'I2O',
    module: 'symbolic-robotics',
    description: 'Bridging symbolic AI and embodied robotic perception/action',
  },
  'DARPA-RA-25-02-18': {
    name: 'Compiler Infrastructure Beyond Traditional',
    office: 'I2O',
    module: 'advanced-compiler',
    description: 'Advanced compiler infrastructure with quantum and autopoietic optimization',
  },

  // MTO - Microsystems Technology Office
  'DARPA-RA-25-02-19': {
    name: 'Molecular Machines for Advanced Materials',
    office: 'MTO',
    module: 'molecular-machines',
    description: 'Molecular machine simulation and control for material synthesis',
  },
  'DARPA-RA-25-02-23': {
    name: 'Optical Memory for PICs',
    office: 'MTO',
    module: 'optical-memory',
    description: 'Optical memory cells and arrays for photonic integrated circuits',
  },

  // DSO - Defense Sciences Office
  'DARPA-RA-25-02-01': {
    name: 'Coherence & Entanglement in Nuclear Processes',
    office: 'DSO',
    module: 'nuclear-coherence',
    description: 'Nuclear-scale quantum coherence and entanglement management',
  },
  'DARPA-RA-25-02-02': {
    name: 'Relativistic QIP with Spacetime Diamonds',
    office: 'DSO',
    module: 'spacetime-diamond-qip',
    description: 'Relativistic quantum information processing with causal ordering',
  },
  'DARPA-RA-25-02-03': {
    name: '3D Micromachined MEMS Microsystems',
    office: 'DSO',
    module: 'mems-microsystems',
    description: 'High aspect ratio MEMS fabrication with resonator and inertial sensor design',
  },
  'DARPA-RA-25-02-05': {
    name: 'Numerical Analysis of Agentic AI',
    office: 'DSO',
    module: 'agentic-ai-analysis',
    description: 'Multi-agent system dynamics, stability analysis, and game-theoretic equilibria',
  },
  'DARPA-RA-25-02-06': {
    name: 'Calibrated Plasma Measurement',
    office: 'DSO',
    module: 'plasma-measurement',
    description: 'NIST-traceable plasma diagnostics with uncertainty quantification',
  },
  'DARPA-RA-25-02-07': {
    name: 'Underwater Communication & Detection',
    office: 'DSO',
    module: 'underwater-comms',
    description: 'Acoustic/optical underwater links and magnetic anomaly detection',
  },

  // Phase 9 - DSO
  'DARPA-RA-25-02-04': {
    name: 'Biomarkers of Psychological/Neural Damage',
    office: 'DSO',
    module: 'neural-biomarkers',
    description: 'TBI/PTSD biomarker detection, longitudinal analysis, and risk assessment',
  },

  // Phase 9 - MTO
  'DARPA-RA-25-02-20': {
    name: 'Energy Harvesting in Lunar Regolith',
    office: 'MTO',
    module: 'lunar-energy',
    description: 'Solar arrays, RTGs, He-3 fusion, and ISRU for lunar power systems',
  },
  'DARPA-RA-25-02-21': {
    name: 'Visible and UV Photonic Integrated Circuits',
    office: 'MTO',
    module: 'uv-photonics',
    description: 'UV/visible PICs with waveguides, sources, and detectors for sensing',
  },
  'DARPA-RA-25-02-22': {
    name: 'Pliable Packaging for Polymorphic Power',
    office: 'MTO',
    module: 'pliable-power',
    description: 'Flexible power electronics with shape-adaptive thermal management',
  },
  'DARPA-RA-25-02-24': {
    name: 'Advanced Microfluidic Systems',
    office: 'MTO',
    module: 'microfluidics',
    description: 'Integrated lab-on-chip with sensors, actuators, and droplet generation',
  },

  // Phase 10 - I2O
  'DARPA-RA-25-02-15': {
    name: 'AI and the Future of Work',
    office: 'I2O',
    module: 'ai-future-work',
    description: 'Task-level AI adoption analysis, workforce impact assessment, and transition pathways',
  },

  // Phase 11 - DSO Advanced Research
  'DARPA-DSO-SCIMITAR': {
    name: 'SCIMITAR Intent Deduction Engine',
    office: 'DSO',
    module: 'scimitar-intent-engine',
    description: 'Quaternion-based intent analysis, 369 harmonic substrate engineering, Planck-scale acoustic coupling',
  },
} as const;

export type DARPASolicitation = keyof typeof DARPA_MODULES;

/**
 * Get all modules by office
 */
export function getModulesByOffice(office: 'BTO' | 'I2O' | 'MTO' | 'DSO'): typeof DARPA_MODULES[DARPASolicitation][] {
  return Object.values(DARPA_MODULES).filter(m => m.office === office);
}

/**
 * Get total module count
 */
export function getTotalModuleCount(): number {
  return Object.keys(DARPA_MODULES).length;
}

/**
 * Get module by solicitation number
 */
export function getModuleBySolicitation(solicitation: DARPASolicitation): typeof DARPA_MODULES[DARPASolicitation] {
  return DARPA_MODULES[solicitation];
}

/**
 * Get all solicitation numbers
 */
export function getAllSolicitations(): DARPASolicitation[] {
  return Object.keys(DARPA_MODULES) as DARPASolicitation[];
}
