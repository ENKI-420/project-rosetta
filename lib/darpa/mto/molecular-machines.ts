/**
 * MTO-19: Molecular Machines for Advanced Materials
 * DARPA-RA-25-02-19
 *
 * Implements molecular machine simulation and control for material synthesis.
 * Uses CCCE metrics for coherent molecular assembly operations.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Molecular machine types
export type MachineType =
  | 'ROTARY_MOTOR'       // ATP synthase-like rotation
  | 'LINEAR_MOTOR'       // Kinesin-like linear motion
  | 'RIBOSOME'           // Protein synthesis
  | 'POLYMERASE'         // DNA/RNA synthesis
  | 'NANOFACTORY'        // General molecular assembly
  | 'TRANSPORTER'        // Molecular cargo transport
  | 'SWITCH'             // Molecular switching
  | 'SENSOR';            // Molecular detection

export type MachineState = 'IDLE' | 'ACTIVE' | 'STALLED' | 'ERROR' | 'ASSEMBLING' | 'DISASSEMBLING';

export interface MolecularPosition {
  x: number;  // Angstroms
  y: number;
  z: number;
}

export interface MolecularVelocity {
  vx: number; // Angstroms/ps
  vy: number;
  vz: number;
}

export interface MolecularMachine {
  id: string;
  type: MachineType;
  state: MachineState;
  position: MolecularPosition;
  velocity: MolecularVelocity;

  // Operational metrics
  efficiency: number;          // [0-1] operational efficiency
  coherence: number;           // Lambda - quantum coherence
  stability: number;           // 1 - Gamma - structural stability
  cycleCount: number;          // Total operation cycles
  errorRate: number;           // Errors per cycle

  // Physical properties
  mass: number;                // Daltons
  charge: number;              // Elementary charges
  temperature: number;         // Kelvin
  energy: number;              // kJ/mol

  // Assembly parameters
  assemblyRate: number;        // Operations per second
  cargoCapacity: number;       // Number of molecules
  currentCargo: number;        // Current cargo count
}

export interface AssemblyInstruction {
  operation: 'ADD' | 'REMOVE' | 'BOND' | 'ROTATE' | 'TRANSLATE' | 'FOLD';
  targetId: string;
  moleculeType: string;
  position?: MolecularPosition;
  angle?: number;              // Degrees
  bondType?: 'COVALENT' | 'IONIC' | 'HYDROGEN' | 'VAN_DER_WAALS';
}

export interface AssemblyResult {
  success: boolean;
  machineId: string;
  instruction: AssemblyInstruction;
  energyCost: number;          // kJ/mol
  timeElapsed: number;         // Picoseconds
  newStructure?: MolecularStructure;
  error?: string;
}

export interface MolecularStructure {
  id: string;
  name: string;
  atoms: number;
  bonds: number;
  mass: number;                // Daltons
  charge: number;
  stability: number;
  coherence: number;
}

export interface FactoryState {
  machines: Map<string, MolecularMachine>;
  structures: Map<string, MolecularStructure>;
  totalEnergy: number;
  temperature: number;
  globalCoherence: number;
  globalStability: number;
  xi: number;
  cyclesCompleted: number;
  errorsTotal: number;
}

/**
 * Molecular Machines Factory
 * Implements nanoscale assembly and material synthesis
 */
export class MolecularMachineFactory {
  private state: FactoryState;
  private readonly maxMachines: number;
  private readonly maxStructures: number;
  private simulationTime: number;  // Picoseconds

  constructor(maxMachines: number = 100, maxStructures: number = 1000) {
    this.maxMachines = maxMachines;
    this.maxStructures = maxStructures;
    this.simulationTime = 0;
    this.state = {
      machines: new Map(),
      structures: new Map(),
      totalEnergy: 0,
      temperature: 300,        // Room temperature
      globalCoherence: 0.9,
      globalStability: 0.95,
      xi: 0,
      cyclesCompleted: 0,
      errorsTotal: 0,
    };
    this.updateXi();
  }

  /**
   * Create a new molecular machine
   */
  createMachine(type: MachineType, position?: MolecularPosition): MolecularMachine | null {
    if (this.state.machines.size >= this.maxMachines) {
      return null;
    }

    const id = `machine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const machine: MolecularMachine = {
      id,
      type,
      state: 'IDLE',
      position: position || { x: 0, y: 0, z: 0 },
      velocity: { vx: 0, vy: 0, vz: 0 },
      efficiency: 0.85,
      coherence: 0.9,
      stability: 0.95,
      cycleCount: 0,
      errorRate: 0.001,
      mass: this.getMachineMass(type),
      charge: 0,
      temperature: this.state.temperature,
      energy: 0,
      assemblyRate: this.getAssemblyRate(type),
      cargoCapacity: this.getCargoCapacity(type),
      currentCargo: 0,
    };

    this.state.machines.set(id, machine);
    this.updateGlobalMetrics();

    return machine;
  }

  /**
   * Get typical mass for machine type
   */
  private getMachineMass(type: MachineType): number {
    const masses: Record<MachineType, number> = {
      ROTARY_MOTOR: 500000,     // ~500 kDa (ATP synthase)
      LINEAR_MOTOR: 380000,     // ~380 kDa (kinesin dimer)
      RIBOSOME: 4200000,        // ~4.2 MDa (eukaryotic ribosome)
      POLYMERASE: 450000,       // ~450 kDa
      NANOFACTORY: 10000000,    // ~10 MDa (large complex)
      TRANSPORTER: 150000,      // ~150 kDa
      SWITCH: 50000,            // ~50 kDa
      SENSOR: 100000,           // ~100 kDa
    };
    return masses[type];
  }

  /**
   * Get assembly rate for machine type
   */
  private getAssemblyRate(type: MachineType): number {
    const rates: Record<MachineType, number> = {
      ROTARY_MOTOR: 100,        // 100 rotations/s
      LINEAR_MOTOR: 1000,       // 1000 nm/s stepping
      RIBOSOME: 20,             // ~20 amino acids/s
      POLYMERASE: 1000,         // ~1000 nucleotides/s
      NANOFACTORY: 10,          // 10 operations/s
      TRANSPORTER: 50,          // 50 molecules/s
      SWITCH: 1000000,          // MHz switching
      SENSOR: 10000,            // 10 kHz sampling
    };
    return rates[type];
  }

  /**
   * Get cargo capacity for machine type
   */
  private getCargoCapacity(type: MachineType): number {
    const capacities: Record<MachineType, number> = {
      ROTARY_MOTOR: 1,
      LINEAR_MOTOR: 2,
      RIBOSOME: 1,
      POLYMERASE: 1,
      NANOFACTORY: 100,
      TRANSPORTER: 10,
      SWITCH: 0,
      SENSOR: 0,
    };
    return capacities[type];
  }

  /**
   * Execute assembly instruction
   */
  async executeInstruction(
    machineId: string,
    instruction: AssemblyInstruction
  ): Promise<AssemblyResult> {
    const machine = this.state.machines.get(machineId);

    if (!machine) {
      return {
        success: false,
        machineId,
        instruction,
        energyCost: 0,
        timeElapsed: 0,
        error: 'Machine not found',
      };
    }

    if (machine.state === 'ERROR' || machine.state === 'STALLED') {
      return {
        success: false,
        machineId,
        instruction,
        energyCost: 0,
        timeElapsed: 0,
        error: `Machine in ${machine.state} state`,
      };
    }

    // Activate machine
    machine.state = 'ASSEMBLING';

    // Calculate energy cost based on operation
    const energyCost = this.calculateEnergyCost(instruction);

    // Calculate time based on machine rate
    const timeElapsed = 1000 / machine.assemblyRate; // ps

    // Simulate with error probability
    const errorOccurred = Math.random() < machine.errorRate;

    if (errorOccurred) {
      machine.state = 'ERROR';
      machine.stability *= 0.99;
      this.state.errorsTotal++;

      return {
        success: false,
        machineId,
        instruction,
        energyCost: energyCost * 0.5, // Partial energy still consumed
        timeElapsed,
        error: 'Assembly error occurred',
      };
    }

    // Create or modify structure
    let newStructure: MolecularStructure | undefined;

    if (instruction.operation === 'ADD' || instruction.operation === 'BOND') {
      newStructure = this.createStructure(instruction);
    }

    // Update machine state
    machine.state = 'IDLE';
    machine.cycleCount++;
    machine.energy += energyCost;
    machine.coherence *= 0.9999; // Slight decoherence per operation

    // Update simulation time
    this.simulationTime += timeElapsed;
    this.state.totalEnergy += energyCost;
    this.state.cyclesCompleted++;

    this.updateGlobalMetrics();

    return {
      success: true,
      machineId,
      instruction,
      energyCost,
      timeElapsed,
      newStructure,
    };
  }

  /**
   * Calculate energy cost for operation
   */
  private calculateEnergyCost(instruction: AssemblyInstruction): number {
    const baseCosts: Record<string, number> = {
      ADD: 10,           // kJ/mol
      REMOVE: 5,
      BOND: 30,          // Bond formation
      ROTATE: 1,
      TRANSLATE: 0.5,
      FOLD: 50,          // Protein folding
    };

    let cost = baseCosts[instruction.operation] || 10;

    // Bond type modifier
    if (instruction.bondType) {
      const bondModifiers: Record<string, number> = {
        COVALENT: 3.0,
        IONIC: 2.0,
        HYDROGEN: 0.5,
        VAN_DER_WAALS: 0.1,
      };
      cost *= bondModifiers[instruction.bondType] || 1;
    }

    return cost;
  }

  /**
   * Create molecular structure
   */
  private createStructure(instruction: AssemblyInstruction): MolecularStructure {
    const id = `struct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const structure: MolecularStructure = {
      id,
      name: instruction.moleculeType,
      atoms: Math.floor(Math.random() * 100) + 10,
      bonds: Math.floor(Math.random() * 150) + 5,
      mass: Math.random() * 10000 + 100,
      charge: Math.floor(Math.random() * 5) - 2,
      stability: 0.9 + Math.random() * 0.09,
      coherence: 0.85 + Math.random() * 0.1,
    };

    this.state.structures.set(id, structure);
    return structure;
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.machines.size === 0) {
      this.state.globalCoherence = 0.9;
      this.state.globalStability = 0.95;
      return;
    }

    let coherenceSum = 0;
    let stabilitySum = 0;

    for (const machine of this.state.machines.values()) {
      coherenceSum += machine.coherence;
      stabilitySum += machine.stability;
    }

    this.state.globalCoherence = coherenceSum / this.state.machines.size;
    this.state.globalStability = stabilitySum / this.state.machines.size;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    const gamma = 1 - this.state.globalStability;
    if (gamma > 0) {
      this.state.xi = (this.state.globalCoherence * PHI_THRESHOLD) / gamma;
    }
  }

  /**
   * Apply phase conjugate healing to degraded machines
   */
  heal(): number {
    let healedCount = 0;

    for (const machine of this.state.machines.values()) {
      if (machine.state === 'ERROR' || machine.coherence < 0.8) {
        // Phase conjugate correction
        machine.coherence = Math.min(0.95, machine.coherence / (1 - CHI_PC));
        machine.stability = Math.min(0.98, machine.stability * (1 + CHI_PC * 0.5));
        machine.state = 'IDLE';
        machine.errorRate *= 0.9; // Reduce error rate after healing
        healedCount++;
      }
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Run thermal equilibration
   */
  equilibrate(targetTemp: number, steps: number = 1000): void {
    const tempDelta = (targetTemp - this.state.temperature) / steps;

    for (let i = 0; i < steps; i++) {
      this.state.temperature += tempDelta;

      // Adjust machine temperatures
      for (const machine of this.state.machines.values()) {
        machine.temperature = this.state.temperature;

        // Temperature affects efficiency (optimal around 310K for biological)
        const optimalTemp = 310;
        const tempFactor = 1 - Math.abs(machine.temperature - optimalTemp) / 500;
        machine.efficiency = Math.max(0.1, machine.efficiency * tempFactor);
      }
    }
  }

  /**
   * Calculate thermal noise
   */
  getThermalNoise(): number {
    // kT at current temperature (in kJ/mol)
    const kB = 0.008314; // kJ/(mol·K)
    return kB * this.state.temperature;
  }

  /**
   * Check if system is quantum coherent
   */
  isQuantumCoherent(): boolean {
    const thermalEnergy = this.getThermalNoise();
    const coherenceEnergy = this.state.globalCoherence * 10; // ~10 kJ/mol for quantum effects

    // Quantum effects dominate when coherence energy > thermal noise
    return coherenceEnergy > thermalEnergy && this.state.temperature < 100;
  }

  /**
   * Get machine by ID
   */
  getMachine(id: string): MolecularMachine | undefined {
    return this.state.machines.get(id);
  }

  /**
   * Get all machines of type
   */
  getMachinesByType(type: MachineType): MolecularMachine[] {
    return Array.from(this.state.machines.values()).filter(m => m.type === type);
  }

  /**
   * Get structure by ID
   */
  getStructure(id: string): MolecularStructure | undefined {
    return this.state.structures.get(id);
  }

  /**
   * Remove machine
   */
  removeMachine(id: string): boolean {
    const removed = this.state.machines.delete(id);
    if (removed) {
      this.updateGlobalMetrics();
    }
    return removed;
  }

  /**
   * Get factory state summary
   */
  getState(): Omit<FactoryState, 'machines' | 'structures'> & {
    machineCount: number;
    structureCount: number;
    machinesByType: Record<MachineType, number>;
    quantumCoherent: boolean;
    thermalNoise: number;
    simulationTime: number;
  } {
    const machinesByType: Partial<Record<MachineType, number>> = {};
    for (const machine of this.state.machines.values()) {
      machinesByType[machine.type] = (machinesByType[machine.type] || 0) + 1;
    }

    return {
      totalEnergy: this.state.totalEnergy,
      temperature: this.state.temperature,
      globalCoherence: this.state.globalCoherence,
      globalStability: this.state.globalStability,
      xi: this.state.xi,
      cyclesCompleted: this.state.cyclesCompleted,
      errorsTotal: this.state.errorsTotal,
      machineCount: this.state.machines.size,
      structureCount: this.state.structures.size,
      machinesByType: machinesByType as Record<MachineType, number>,
      quantumCoherent: this.isQuantumCoherent(),
      thermalNoise: this.getThermalNoise(),
      simulationTime: this.simulationTime,
    };
  }

  /**
   * Run assembly pipeline
   */
  async runPipeline(instructions: AssemblyInstruction[]): Promise<AssemblyResult[]> {
    const results: AssemblyResult[] = [];

    // Get available machines
    const availableMachines = Array.from(this.state.machines.values())
      .filter(m => m.state === 'IDLE');

    if (availableMachines.length === 0) {
      return [{
        success: false,
        machineId: '',
        instruction: instructions[0],
        energyCost: 0,
        timeElapsed: 0,
        error: 'No available machines',
      }];
    }

    // Execute instructions round-robin across machines
    let machineIndex = 0;
    for (const instruction of instructions) {
      const machine = availableMachines[machineIndex % availableMachines.length];
      const result = await this.executeInstruction(machine.id, instruction);
      results.push(result);
      machineIndex++;

      // Brief pause between operations
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    return results;
  }
}

// Export singleton instance
export const molecularFactory = new MolecularMachineFactory();
