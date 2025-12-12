/**
 * DSO-01: Coherence and Entanglement in Nuclear Processes
 * DARPA-RA-25-02-01
 *
 * Implements nuclear-scale quantum coherence and entanglement management.
 * Uses CCCE metrics for coherence preservation in nuclear systems.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Physical constants for nuclear processes
const NUCLEAR_CONSTANTS = {
  HBAR: 1.054571817e-34,         // Reduced Planck constant (J·s)
  C: 299792458,                   // Speed of light (m/s)
  FINE_STRUCTURE: 7.2973525693e-3,// Fine structure constant α
  NUCLEAR_MAGNETON: 5.0507837e-27,// Nuclear magneton (J/T)
  FERMI_COUPLING: 1.166379e-5,    // Fermi coupling constant (GeV⁻²)
  PROTON_MASS: 1.67262192e-27,    // Proton mass (kg)
  NEUTRON_MASS: 1.67492749e-27,   // Neutron mass (kg)
  FM_TO_M: 1e-15,                 // Femtometer to meter conversion
};

export type NuclearParticle = 'PROTON' | 'NEUTRON' | 'ALPHA' | 'DEUTERON' | 'TRITON' | 'HELION';

export type NuclearState = 'GROUND' | 'EXCITED' | 'SUPERPOSITION' | 'ENTANGLED' | 'DECAYING';

export interface NucleusConfig {
  Z: number;           // Atomic number (protons)
  A: number;           // Mass number (nucleons)
  spin: number;        // Nuclear spin
  parity: '+' | '-';   // Parity
  binding: number;     // Binding energy (MeV)
}

export interface NuclearQubit {
  id: string;
  nucleus: NucleusConfig;
  state: NuclearState;

  // Quantum state vector (simplified)
  amplitude0: { real: number; imag: number };  // |0⟩ coefficient
  amplitude1: { real: number; imag: number };  // |1⟩ coefficient

  // Coherence metrics
  coherence: number;      // Lambda - quantum coherence
  fidelity: number;       // State fidelity
  decoherence: number;    // Gamma - decoherence rate (s⁻¹)
  t1: number;             // Relaxation time (s)
  t2: number;             // Dephasing time (s)

  // Physical properties
  position: { x: number; y: number; z: number };  // fm
  magneticMoment: number; // Nuclear magnetons
  temperature: number;    // Kelvin

  // Entanglement
  entangledWith: string[];  // IDs of entangled qubits
  bellState?: 'PHI_PLUS' | 'PHI_MINUS' | 'PSI_PLUS' | 'PSI_MINUS';
}

export interface EntanglementResult {
  success: boolean;
  qubit1Id: string;
  qubit2Id: string;
  bellState: string;
  fidelity: number;
  concurrence: number;  // Entanglement measure [0-1]
}

export interface MeasurementResult {
  qubitId: string;
  outcome: 0 | 1;
  probability: number;
  postMeasurementState: NuclearQubit;
  collapsed: boolean;
}

export interface NuclearSystemState {
  qubits: Map<string, NuclearQubit>;
  entanglementPairs: Array<[string, string]>;
  globalCoherence: number;
  globalFidelity: number;
  globalDecoherence: number;
  xi: number;
  temperature: number;
  magneticField: number;  // Tesla
  totalEnergy: number;    // MeV
}

/**
 * Nuclear Coherence Engine
 * Implements quantum coherence management for nuclear systems
 */
export class NuclearCoherenceEngine {
  private state: NuclearSystemState;
  private readonly maxQubits: number;
  private simulationTime: number;  // Seconds

  constructor(maxQubits: number = 100) {
    this.maxQubits = maxQubits;
    this.simulationTime = 0;
    this.state = {
      qubits: new Map(),
      entanglementPairs: [],
      globalCoherence: 0.95,
      globalFidelity: 0.98,
      globalDecoherence: GAMMA_FIXED,
      xi: 0,
      temperature: 0.015,     // 15 mK - typical dilution fridge
      magneticField: 1.0,     // 1 Tesla
      totalEnergy: 0,
    };
    this.updateXi();
  }

  /**
   * Create a nuclear qubit
   */
  createQubit(nucleus: NucleusConfig, position?: { x: number; y: number; z: number }): NuclearQubit | null {
    if (this.state.qubits.size >= this.maxQubits) {
      return null;
    }

    const id = `nq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate T1 and T2 times based on nucleus properties
    const t1 = this.calculateT1(nucleus);
    const t2 = this.calculateT2(nucleus, t1);

    const qubit: NuclearQubit = {
      id,
      nucleus,
      state: 'GROUND',
      amplitude0: { real: 1, imag: 0 },  // Initialize in |0⟩
      amplitude1: { real: 0, imag: 0 },
      coherence: 0.95,
      fidelity: 0.99,
      decoherence: 1 / t2,
      t1,
      t2,
      position: position || { x: 0, y: 0, z: 0 },
      magneticMoment: this.calculateMagneticMoment(nucleus),
      temperature: this.state.temperature,
      entangledWith: [],
    };

    this.state.qubits.set(id, qubit);
    this.state.totalEnergy += nucleus.binding;
    this.updateGlobalMetrics();

    return qubit;
  }

  /**
   * Calculate T1 relaxation time
   */
  private calculateT1(nucleus: NucleusConfig): number {
    // Simplified model: T1 increases with nuclear spin and mass
    const basetime = 1.0;  // Base T1 of 1 second
    const spinFactor = Math.sqrt(nucleus.spin + 0.5);
    const massFactor = Math.sqrt(nucleus.A / 12);  // Normalized to Carbon-12
    const tempFactor = 300 / this.state.temperature;  // Better at lower temps

    return basetime * spinFactor * massFactor * tempFactor;
  }

  /**
   * Calculate T2 dephasing time
   */
  private calculateT2(nucleus: NucleusConfig, t1: number): number {
    // T2 ≤ 2*T1 (fundamental limit)
    // For nuclear systems, T2 is often close to 2*T1
    const t2Limit = 2 * t1;
    const fieldInhomogeneity = 0.001;  // 0.1% field variation
    const t2Star = 1 / (Math.PI * fieldInhomogeneity * this.state.magneticField * NUCLEAR_CONSTANTS.NUCLEAR_MAGNETON / NUCLEAR_CONSTANTS.HBAR);

    return Math.min(t2Limit, t2Star);
  }

  /**
   * Calculate magnetic moment
   */
  private calculateMagneticMoment(nucleus: NucleusConfig): number {
    // Simplified: use spin and g-factor estimate
    const gFactor = nucleus.Z / nucleus.A * 5.586;  // Approximate g-factor
    return gFactor * nucleus.spin;
  }

  /**
   * Apply X gate (bit flip)
   */
  applyX(qubitId: string): boolean {
    const qubit = this.state.qubits.get(qubitId);
    if (!qubit) return false;

    // Swap amplitudes: |0⟩ ↔ |1⟩
    const temp = { ...qubit.amplitude0 };
    qubit.amplitude0 = qubit.amplitude1;
    qubit.amplitude1 = temp;

    qubit.state = 'SUPERPOSITION';
    this.applyDecoherence(qubit, 1e-6);  // 1 μs gate time

    return true;
  }

  /**
   * Apply Y gate
   */
  applyY(qubitId: string): boolean {
    const qubit = this.state.qubits.get(qubitId);
    if (!qubit) return false;

    // Y = i * σ_y
    const a0 = qubit.amplitude0;
    const a1 = qubit.amplitude1;

    qubit.amplitude0 = { real: a1.imag, imag: -a1.real };
    qubit.amplitude1 = { real: -a0.imag, imag: a0.real };

    qubit.state = 'SUPERPOSITION';
    this.applyDecoherence(qubit, 1e-6);

    return true;
  }

  /**
   * Apply Z gate (phase flip)
   */
  applyZ(qubitId: string): boolean {
    const qubit = this.state.qubits.get(qubitId);
    if (!qubit) return false;

    // |1⟩ → -|1⟩
    qubit.amplitude1.real *= -1;
    qubit.amplitude1.imag *= -1;

    this.applyDecoherence(qubit, 0.5e-6);  // Fast gate

    return true;
  }

  /**
   * Apply Hadamard gate
   */
  applyH(qubitId: string): boolean {
    const qubit = this.state.qubits.get(qubitId);
    if (!qubit) return false;

    const sqrt2 = 1 / Math.sqrt(2);
    const a0 = { ...qubit.amplitude0 };
    const a1 = { ...qubit.amplitude1 };

    // H|0⟩ = (|0⟩ + |1⟩)/√2
    // H|1⟩ = (|0⟩ - |1⟩)/√2
    qubit.amplitude0 = {
      real: sqrt2 * (a0.real + a1.real),
      imag: sqrt2 * (a0.imag + a1.imag),
    };
    qubit.amplitude1 = {
      real: sqrt2 * (a0.real - a1.real),
      imag: sqrt2 * (a0.imag - a1.imag),
    };

    qubit.state = 'SUPERPOSITION';
    this.applyDecoherence(qubit, 2e-6);

    return true;
  }

  /**
   * Create entanglement between two qubits
   */
  entangle(qubitId1: string, qubitId2: string, bellState: 'PHI_PLUS' | 'PHI_MINUS' | 'PSI_PLUS' | 'PSI_MINUS' = 'PHI_PLUS'): EntanglementResult {
    const q1 = this.state.qubits.get(qubitId1);
    const q2 = this.state.qubits.get(qubitId2);

    if (!q1 || !q2) {
      return {
        success: false,
        qubit1Id: qubitId1,
        qubit2Id: qubitId2,
        bellState,
        fidelity: 0,
        concurrence: 0,
      };
    }

    // Set up Bell state amplitudes
    const sqrt2 = 1 / Math.sqrt(2);

    switch (bellState) {
      case 'PHI_PLUS':
        // |Φ+⟩ = (|00⟩ + |11⟩)/√2
        q1.amplitude0 = { real: sqrt2, imag: 0 };
        q1.amplitude1 = { real: sqrt2, imag: 0 };
        q2.amplitude0 = { real: 1, imag: 0 };
        q2.amplitude1 = { real: 0, imag: 0 };
        break;
      case 'PHI_MINUS':
        // |Φ-⟩ = (|00⟩ - |11⟩)/√2
        q1.amplitude0 = { real: sqrt2, imag: 0 };
        q1.amplitude1 = { real: -sqrt2, imag: 0 };
        q2.amplitude0 = { real: 1, imag: 0 };
        q2.amplitude1 = { real: 0, imag: 0 };
        break;
      case 'PSI_PLUS':
        // |Ψ+⟩ = (|01⟩ + |10⟩)/√2
        q1.amplitude0 = { real: sqrt2, imag: 0 };
        q1.amplitude1 = { real: sqrt2, imag: 0 };
        q2.amplitude0 = { real: 0, imag: 0 };
        q2.amplitude1 = { real: 1, imag: 0 };
        break;
      case 'PSI_MINUS':
        // |Ψ-⟩ = (|01⟩ - |10⟩)/√2
        q1.amplitude0 = { real: sqrt2, imag: 0 };
        q1.amplitude1 = { real: -sqrt2, imag: 0 };
        q2.amplitude0 = { real: 0, imag: 0 };
        q2.amplitude1 = { real: 1, imag: 0 };
        break;
    }

    // Update entanglement tracking
    q1.state = 'ENTANGLED';
    q2.state = 'ENTANGLED';
    q1.bellState = bellState;
    q2.bellState = bellState;
    q1.entangledWith.push(qubitId2);
    q2.entangledWith.push(qubitId1);

    this.state.entanglementPairs.push([qubitId1, qubitId2]);

    // Apply decoherence for entangling operation
    this.applyDecoherence(q1, 10e-6);
    this.applyDecoherence(q2, 10e-6);

    // Calculate concurrence (simplified)
    const concurrence = Math.min(q1.coherence, q2.coherence) * (1 - Math.max(q1.decoherence, q2.decoherence));

    this.updateGlobalMetrics();

    return {
      success: true,
      qubit1Id: qubitId1,
      qubit2Id: qubitId2,
      bellState,
      fidelity: (q1.fidelity + q2.fidelity) / 2,
      concurrence,
    };
  }

  /**
   * Measure a qubit
   */
  measure(qubitId: string): MeasurementResult | null {
    const qubit = this.state.qubits.get(qubitId);
    if (!qubit) return null;

    // Calculate probabilities
    const prob0 = qubit.amplitude0.real ** 2 + qubit.amplitude0.imag ** 2;
    const prob1 = qubit.amplitude1.real ** 2 + qubit.amplitude1.imag ** 2;

    // Normalize (should already be normalized)
    const total = prob0 + prob1;
    const normProb0 = prob0 / total;

    // Perform measurement
    const outcome: 0 | 1 = Math.random() < normProb0 ? 0 : 1;

    // Collapse state
    if (outcome === 0) {
      qubit.amplitude0 = { real: 1, imag: 0 };
      qubit.amplitude1 = { real: 0, imag: 0 };
    } else {
      qubit.amplitude0 = { real: 0, imag: 0 };
      qubit.amplitude1 = { real: 1, imag: 0 };
    }

    qubit.state = 'GROUND';

    // Break entanglement
    if (qubit.entangledWith.length > 0) {
      for (const partnerId of qubit.entangledWith) {
        const partner = this.state.qubits.get(partnerId);
        if (partner) {
          partner.entangledWith = partner.entangledWith.filter(id => id !== qubitId);
          if (partner.entangledWith.length === 0) {
            partner.state = 'GROUND';
            partner.bellState = undefined;
          }
        }
      }
      qubit.entangledWith = [];
      qubit.bellState = undefined;

      // Update entanglement pairs
      this.state.entanglementPairs = this.state.entanglementPairs.filter(
        ([id1, id2]) => id1 !== qubitId && id2 !== qubitId
      );
    }

    this.updateGlobalMetrics();

    return {
      qubitId,
      outcome,
      probability: outcome === 0 ? normProb0 : 1 - normProb0,
      postMeasurementState: { ...qubit },
      collapsed: true,
    };
  }

  /**
   * Apply decoherence effects
   */
  private applyDecoherence(qubit: NuclearQubit, deltaTime: number): void {
    // T2 dephasing
    const dephasingFactor = Math.exp(-deltaTime / qubit.t2);
    qubit.coherence *= dephasingFactor;
    qubit.fidelity *= Math.sqrt(dephasingFactor);

    // Update decoherence rate
    qubit.decoherence = (1 - dephasingFactor) / deltaTime;

    this.simulationTime += deltaTime;
    this.updateGlobalMetrics();
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const qubit of this.state.qubits.values()) {
      if (qubit.coherence < 0.8) {
        // Phase conjugate correction: E → E⁻¹
        qubit.coherence = Math.min(0.98, qubit.coherence / (1 - CHI_PC));
        qubit.fidelity = Math.min(0.99, qubit.fidelity * (1 + CHI_PC * 0.5));
        qubit.t2 *= 1.2;  // Extend dephasing time
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
    if (this.state.qubits.size === 0) {
      this.state.globalCoherence = 0.95;
      this.state.globalFidelity = 0.98;
      this.state.globalDecoherence = GAMMA_FIXED;
      return;
    }

    let coherenceSum = 0;
    let fidelitySum = 0;
    let decoherenceSum = 0;

    for (const qubit of this.state.qubits.values()) {
      coherenceSum += qubit.coherence;
      fidelitySum += qubit.fidelity;
      decoherenceSum += qubit.decoherence;
    }

    this.state.globalCoherence = coherenceSum / this.state.qubits.size;
    this.state.globalFidelity = fidelitySum / this.state.qubits.size;
    this.state.globalDecoherence = decoherenceSum / this.state.qubits.size;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalDecoherence > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalFidelity) / this.state.globalDecoherence;
    }
  }

  /**
   * Set magnetic field
   */
  setMagneticField(tesla: number): void {
    this.state.magneticField = tesla;

    // Recalculate T2 for all qubits
    for (const qubit of this.state.qubits.values()) {
      qubit.t2 = this.calculateT2(qubit.nucleus, qubit.t1);
      qubit.decoherence = 1 / qubit.t2;
    }

    this.updateGlobalMetrics();
  }

  /**
   * Set temperature
   */
  setTemperature(kelvin: number): void {
    this.state.temperature = kelvin;

    // Recalculate T1 and T2 for all qubits
    for (const qubit of this.state.qubits.values()) {
      qubit.temperature = kelvin;
      qubit.t1 = this.calculateT1(qubit.nucleus);
      qubit.t2 = this.calculateT2(qubit.nucleus, qubit.t1);
      qubit.decoherence = 1 / qubit.t2;
    }

    this.updateGlobalMetrics();
  }

  /**
   * Get qubit by ID
   */
  getQubit(id: string): NuclearQubit | undefined {
    return this.state.qubits.get(id);
  }

  /**
   * Remove qubit
   */
  removeQubit(id: string): boolean {
    const qubit = this.state.qubits.get(id);
    if (!qubit) return false;

    // Remove from entanglement
    for (const partnerId of qubit.entangledWith) {
      const partner = this.state.qubits.get(partnerId);
      if (partner) {
        partner.entangledWith = partner.entangledWith.filter(pid => pid !== id);
      }
    }

    this.state.entanglementPairs = this.state.entanglementPairs.filter(
      ([id1, id2]) => id1 !== id && id2 !== id
    );

    this.state.totalEnergy -= qubit.nucleus.binding;
    this.state.qubits.delete(id);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<NuclearSystemState, 'qubits'> & {
    qubitCount: number;
    entanglementCount: number;
    simulationTime: number;
  } {
    return {
      entanglementPairs: this.state.entanglementPairs,
      globalCoherence: this.state.globalCoherence,
      globalFidelity: this.state.globalFidelity,
      globalDecoherence: this.state.globalDecoherence,
      xi: this.state.xi,
      temperature: this.state.temperature,
      magneticField: this.state.magneticField,
      totalEnergy: this.state.totalEnergy,
      qubitCount: this.state.qubits.size,
      entanglementCount: this.state.entanglementPairs.length,
      simulationTime: this.simulationTime,
    };
  }
}

// Export singleton instance
export const nuclearEngine = new NuclearCoherenceEngine();

// Common nuclei configurations
export const NUCLEI: Record<string, NucleusConfig> = {
  HYDROGEN: { Z: 1, A: 1, spin: 0.5, parity: '+', binding: 0 },
  DEUTERIUM: { Z: 1, A: 2, spin: 1, parity: '+', binding: 2.225 },
  HELIUM3: { Z: 2, A: 3, spin: 0.5, parity: '+', binding: 7.718 },
  HELIUM4: { Z: 2, A: 4, spin: 0, parity: '+', binding: 28.296 },
  CARBON13: { Z: 6, A: 13, spin: 0.5, parity: '-', binding: 97.108 },
  NITROGEN15: { Z: 7, A: 15, spin: 0.5, parity: '-', binding: 115.491 },
  PHOSPHORUS31: { Z: 15, A: 31, spin: 0.5, parity: '+', binding: 262.917 },
};
