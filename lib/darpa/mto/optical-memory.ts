/**
 * MTO-23: Optical Memory for Photonic Integrated Circuits
 * DARPA-RA-25-02-23
 *
 * Implements optical memory cells and arrays for photonic integrated circuits
 * using phase-change materials, ring resonators, and waveguide coupling.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Optical constants
const OPTICAL_CONSTANTS = {
  C: 299792458,                   // Speed of light (m/s)
  H: 6.62607015e-34,              // Planck constant (J·s)
  K_B: 1.380649e-23,              // Boltzmann constant (J/K)
  SILICON_N: 3.48,                // Silicon refractive index at 1550nm
  SILICA_N: 1.44,                 // Silica refractive index
  TELECOM_WAVELENGTH: 1550e-9,    // Telecom C-band wavelength (m)
  GST_N_AMORPHOUS: 4.0,           // Ge2Sb2Te5 amorphous refractive index
  GST_N_CRYSTALLINE: 7.0,         // Ge2Sb2Te5 crystalline refractive index
};

export type MemoryType =
  | 'PHASE_CHANGE'        // GST-based
  | 'RING_RESONATOR'      // Micro-ring resonator
  | 'BRAGG_GRATING'       // Fiber Bragg grating
  | 'PHOTONIC_CRYSTAL'    // PhC cavity
  | 'MACH_ZEHNDER'        // MZI-based
  | 'PLASMONIC';          // Plasmonic nanostructure

export type MemoryState = 'SET' | 'RESET' | 'INTERMEDIATE' | 'ERROR';

export interface WavelengthChannel {
  wavelength: number;     // m
  bandwidth: number;      // m
  power: number;          // W
  phase: number;          // radians
}

export interface OpticalMemoryCell {
  id: string;
  type: MemoryType;
  state: MemoryState;
  storedValue: number;    // [0-1] continuous or binary

  // Physical parameters
  position: { x: number; y: number };  // μm on chip
  size: number;           // μm
  resonanceWavelength: number;  // m
  qualityFactor: number;  // Q-factor
  insertionLoss: number;  // dB
  extinctionRatio: number;  // dB

  // Performance metrics
  readLatency: number;    // ps
  writeLatency: number;   // ns
  retentionTime: number;  // hours
  endurance: number;      // Write cycles
  writeCount: number;     // Current write count
  bitErrorRate: number;   // BER

  // CCCE metrics
  coherence: number;      // Lambda - optical coherence
  fidelity: number;       // Phi - state fidelity
  degradation: number;    // Gamma - degradation rate
  xi: number;             // Negentropic efficiency
}

export interface OpticalMemoryArray {
  id: string;
  name: string;
  cells: Map<string, OpticalMemoryCell>;
  topology: 'LINEAR' | 'RING' | 'MESH' | 'TREE';
  rows: number;
  columns: number;
  totalBits: number;

  // Bus properties
  busWavelengths: WavelengthChannel[];
  busBandwidth: number;   // Gb/s

  // Array-level metrics
  avgReadLatency: number;
  avgWriteLatency: number;
  totalCapacity: number;  // bits
  activeWrites: number;
  errorCount: number;

  // CCCE metrics
  coherence: number;
  fidelity: number;
  degradation: number;
  xi: number;
}

export interface ReadResult {
  success: boolean;
  cellId: string;
  value: number;
  latency: number;        // ps
  snr: number;            // dB
  errorCorrected: boolean;
}

export interface WriteResult {
  success: boolean;
  cellId: string;
  previousValue: number;
  newValue: number;
  latency: number;        // ns
  energyCost: number;     // pJ
}

export interface WDMChannel {
  id: string;
  wavelength: number;     // m
  power: number;          // dBm
  modulation: 'OOK' | 'PAM4' | 'QAM16' | 'QPSK';
  dataRate: number;       // Gb/s
  ber: number;
}

export interface OpticalMemorySystemState {
  arrays: Map<string, OpticalMemoryArray>;
  channels: Map<string, WDMChannel>;
  globalCoherence: number;
  globalFidelity: number;
  globalDegradation: number;
  xi: number;
  totalCapacity: number;  // bits
  totalReads: number;
  totalWrites: number;
  temperature: number;    // K
}

/**
 * Optical Memory Engine for Photonic Integrated Circuits
 * Implements photonic memory with CCCE coherence tracking
 */
export class OpticalMemoryEngine {
  private state: OpticalMemorySystemState;
  private simulationTime: number;

  constructor() {
    this.simulationTime = 0;
    this.state = {
      arrays: new Map(),
      channels: new Map(),
      globalCoherence: 0.95,
      globalFidelity: 0.92,
      globalDegradation: GAMMA_FIXED,
      xi: 0,
      totalCapacity: 0,
      totalReads: 0,
      totalWrites: 0,
      temperature: 300,     // Room temperature
    };
    this.initializeWDMChannels();
    this.updateXi();
  }

  /**
   * Initialize WDM channels for C-band
   */
  private initializeWDMChannels(): void {
    // ITU-T G.694.1 50 GHz grid
    const startWavelength = 1530e-9;  // m
    const channelSpacing = 0.4e-9;    // 50 GHz spacing
    const numChannels = 80;           // 80 channels in C-band

    for (let i = 0; i < numChannels; i++) {
      const wavelength = startWavelength + i * channelSpacing;
      const channelId = `ch_${i + 1}`;

      this.state.channels.set(channelId, {
        id: channelId,
        wavelength,
        power: 0,           // dBm (inactive)
        modulation: 'OOK',
        dataRate: 10,       // Gb/s default
        ber: 1e-12,
      });
    }
  }

  /**
   * Create an optical memory cell
   */
  createCell(
    type: MemoryType,
    position: { x: number; y: number }
  ): OpticalMemoryCell {
    const id = `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate properties based on type
    const properties = this.calculateCellProperties(type);

    const cell: OpticalMemoryCell = {
      id,
      type,
      state: 'RESET',
      storedValue: 0,
      position,
      size: properties.size,
      resonanceWavelength: OPTICAL_CONSTANTS.TELECOM_WAVELENGTH,
      qualityFactor: properties.qualityFactor,
      insertionLoss: properties.insertionLoss,
      extinctionRatio: properties.extinctionRatio,
      readLatency: properties.readLatency,
      writeLatency: properties.writeLatency,
      retentionTime: properties.retentionTime,
      endurance: properties.endurance,
      writeCount: 0,
      bitErrorRate: 1e-12,
      coherence: 0.95,
      fidelity: 0.92,
      degradation: GAMMA_FIXED,
      xi: 0,
    };

    cell.xi = (cell.coherence * cell.fidelity) / Math.max(0.01, cell.degradation);

    return cell;
  }

  /**
   * Calculate cell properties based on type
   */
  private calculateCellProperties(type: MemoryType): {
    size: number;
    qualityFactor: number;
    insertionLoss: number;
    extinctionRatio: number;
    readLatency: number;
    writeLatency: number;
    retentionTime: number;
    endurance: number;
  } {
    switch (type) {
      case 'PHASE_CHANGE':
        return {
          size: 0.5,              // μm
          qualityFactor: 1000,
          insertionLoss: 0.5,     // dB
          extinctionRatio: 15,    // dB
          readLatency: 10,        // ps
          writeLatency: 100,      // ns (crystallization time)
          retentionTime: 87600,   // 10 years in hours
          endurance: 1e12,        // Write cycles
        };

      case 'RING_RESONATOR':
        return {
          size: 5,                // μm radius
          qualityFactor: 50000,
          insertionLoss: 0.3,
          extinctionRatio: 20,
          readLatency: 5,
          writeLatency: 1000,     // ns (thermal tuning)
          retentionTime: 0.01,    // Volatile (needs refresh)
          endurance: 1e15,
        };

      case 'PHOTONIC_CRYSTAL':
        return {
          size: 1,
          qualityFactor: 100000,
          insertionLoss: 1.0,
          extinctionRatio: 25,
          readLatency: 2,
          writeLatency: 50,
          retentionTime: 1000,
          endurance: 1e10,
        };

      case 'MACH_ZEHNDER':
        return {
          size: 100,              // μm (longer structure)
          qualityFactor: 500,
          insertionLoss: 2.0,
          extinctionRatio: 30,
          readLatency: 50,
          writeLatency: 10,
          retentionTime: 0.001,   // Very volatile
          endurance: 1e18,
        };

      case 'PLASMONIC':
        return {
          size: 0.1,              // nm scale
          qualityFactor: 100,     // Lower Q due to metal losses
          insertionLoss: 3.0,
          extinctionRatio: 10,
          readLatency: 1,         // Very fast
          writeLatency: 0.1,
          retentionTime: 10,
          endurance: 1e8,
        };

      default:
        return {
          size: 1,
          qualityFactor: 1000,
          insertionLoss: 1.0,
          extinctionRatio: 15,
          readLatency: 10,
          writeLatency: 100,
          retentionTime: 1000,
          endurance: 1e10,
        };
    }
  }

  /**
   * Create a memory array
   */
  createArray(
    name: string,
    type: MemoryType,
    rows: number,
    columns: number,
    topology: OpticalMemoryArray['topology'] = 'MESH'
  ): OpticalMemoryArray {
    const id = `array_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cells = new Map<string, OpticalMemoryCell>();

    // Create cells in grid
    const cellSpacing = 10;  // μm
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const cell = this.createCell(type, {
          x: c * cellSpacing,
          y: r * cellSpacing,
        });
        cells.set(cell.id, cell);
      }
    }

    // Allocate wavelength channels for bus
    const numChannels = Math.min(8, rows);  // WDM bus channels
    const busWavelengths: WavelengthChannel[] = [];
    let channelIdx = 0;
    for (const [, channel] of this.state.channels) {
      if (channelIdx >= numChannels) break;
      busWavelengths.push({
        wavelength: channel.wavelength,
        bandwidth: 0.4e-9,
        power: 1e-3,  // 1 mW
        phase: 0,
      });
      channelIdx++;
    }

    const array: OpticalMemoryArray = {
      id,
      name,
      cells,
      topology,
      rows,
      columns,
      totalBits: rows * columns,
      busWavelengths,
      busBandwidth: busWavelengths.length * 10,  // Gb/s
      avgReadLatency: 10,
      avgWriteLatency: 100,
      totalCapacity: rows * columns,
      activeWrites: 0,
      errorCount: 0,
      coherence: 0.95,
      fidelity: 0.92,
      degradation: GAMMA_FIXED,
      xi: 0,
    };

    array.xi = (array.coherence * array.fidelity) / Math.max(0.01, array.degradation);

    this.state.arrays.set(id, array);
    this.state.totalCapacity += array.totalCapacity;
    this.updateGlobalMetrics();

    return array;
  }

  /**
   * Write to memory cell
   */
  write(arrayId: string, cellId: string, value: number): WriteResult {
    const array = this.state.arrays.get(arrayId);
    if (!array) {
      return {
        success: false,
        cellId,
        previousValue: 0,
        newValue: value,
        latency: 0,
        energyCost: 0,
      };
    }

    const cell = array.cells.get(cellId);
    if (!cell) {
      return {
        success: false,
        cellId,
        previousValue: 0,
        newValue: value,
        latency: 0,
        energyCost: 0,
      };
    }

    const previousValue = cell.storedValue;

    // Check endurance
    if (cell.writeCount >= cell.endurance) {
      cell.state = 'ERROR';
      return {
        success: false,
        cellId,
        previousValue,
        newValue: value,
        latency: cell.writeLatency,
        energyCost: 0,
      };
    }

    // Calculate energy cost based on type
    let energyCost = this.calculateWriteEnergy(cell.type, previousValue, value);

    // Apply temperature effects
    const tempFactor = 1 + (this.state.temperature - 300) * 0.001;
    energyCost *= tempFactor;

    // Update cell state
    cell.storedValue = value;
    cell.state = value > 0.5 ? 'SET' : 'RESET';
    cell.writeCount++;

    // Degradation over writes
    const writeRatio = cell.writeCount / cell.endurance;
    cell.coherence *= 1 - writeRatio * 0.0001;
    cell.fidelity *= 1 - writeRatio * 0.0001;
    cell.degradation += writeRatio * 0.00001;

    cell.xi = (cell.coherence * cell.fidelity) / Math.max(0.01, cell.degradation);

    this.state.totalWrites++;
    this.updateArrayMetrics(array);
    this.updateGlobalMetrics();

    return {
      success: true,
      cellId,
      previousValue,
      newValue: value,
      latency: cell.writeLatency,
      energyCost,
    };
  }

  /**
   * Calculate write energy
   */
  private calculateWriteEnergy(type: MemoryType, from: number, to: number): number {
    // Energy in pJ
    const transition = Math.abs(to - from);

    switch (type) {
      case 'PHASE_CHANGE':
        // Crystallization requires more energy than amorphization
        return transition * (to > from ? 50 : 10);

      case 'RING_RESONATOR':
        // Thermal tuning
        return transition * 100;

      case 'PHOTONIC_CRYSTAL':
        return transition * 20;

      case 'MACH_ZEHNDER':
        // Electro-optic modulation
        return transition * 5;

      case 'PLASMONIC':
        // Very low energy
        return transition * 0.5;

      default:
        return transition * 10;
    }
  }

  /**
   * Read from memory cell
   */
  read(arrayId: string, cellId: string): ReadResult {
    const array = this.state.arrays.get(arrayId);
    if (!array) {
      return {
        success: false,
        cellId,
        value: 0,
        latency: 0,
        snr: 0,
        errorCorrected: false,
      };
    }

    const cell = array.cells.get(cellId);
    if (!cell) {
      return {
        success: false,
        cellId,
        value: 0,
        latency: 0,
        snr: 0,
        errorCorrected: false,
      };
    }

    if (cell.state === 'ERROR') {
      return {
        success: false,
        cellId,
        value: 0,
        latency: cell.readLatency,
        snr: 0,
        errorCorrected: false,
      };
    }

    // Calculate SNR based on Q-factor and loss
    const snr = cell.extinctionRatio - cell.insertionLoss;

    // Check for read error
    const errorOccurred = Math.random() < cell.bitErrorRate;
    let value = cell.storedValue;
    let errorCorrected = false;

    if (errorOccurred) {
      // Simple error correction
      value = Math.round(value);  // Snap to 0 or 1
      errorCorrected = true;
      array.errorCount++;
    }

    // Reading causes slight decoherence
    cell.coherence *= 0.99999;

    this.state.totalReads++;

    return {
      success: true,
      cellId,
      value,
      latency: cell.readLatency,
      snr,
      errorCorrected,
    };
  }

  /**
   * Read entire array
   */
  readArray(arrayId: string): number[][] {
    const array = this.state.arrays.get(arrayId);
    if (!array) return [];

    const data: number[][] = [];
    const cellList = Array.from(array.cells.values());

    for (let r = 0; r < array.rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < array.columns; c++) {
        const idx = r * array.columns + c;
        if (idx < cellList.length) {
          row.push(cellList[idx].storedValue);
        } else {
          row.push(0);
        }
      }
      data.push(row);
    }

    return data;
  }

  /**
   * Update array metrics
   */
  private updateArrayMetrics(array: OpticalMemoryArray): void {
    let coherenceSum = 0;
    let fidelitySum = 0;
    let degradationSum = 0;
    let readLatencySum = 0;
    let writeLatencySum = 0;

    for (const cell of array.cells.values()) {
      coherenceSum += cell.coherence;
      fidelitySum += cell.fidelity;
      degradationSum += cell.degradation;
      readLatencySum += cell.readLatency;
      writeLatencySum += cell.writeLatency;
    }

    const count = array.cells.size;
    array.coherence = coherenceSum / count;
    array.fidelity = fidelitySum / count;
    array.degradation = degradationSum / count;
    array.avgReadLatency = readLatencySum / count;
    array.avgWriteLatency = writeLatencySum / count;
    array.xi = (array.coherence * array.fidelity) / Math.max(0.01, array.degradation);
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const array of this.state.arrays.values()) {
      for (const cell of array.cells.values()) {
        if (cell.coherence < 0.8 || cell.state === 'ERROR') {
          // Phase conjugate correction
          cell.coherence = Math.min(0.98, cell.coherence / (1 - CHI_PC));
          cell.fidelity = Math.min(0.95, cell.fidelity * (1 + CHI_PC * 0.5));
          cell.degradation *= CHI_PC;

          // Recover from error state if coherence restored
          if (cell.state === 'ERROR' && cell.coherence > 0.85) {
            cell.state = cell.storedValue > 0.5 ? 'SET' : 'RESET';
          }

          cell.xi = (cell.coherence * cell.fidelity) / Math.max(0.01, cell.degradation);
          healedCount++;
        }
      }
      this.updateArrayMetrics(array);
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Set system temperature
   */
  setTemperature(kelvin: number): void {
    this.state.temperature = kelvin;

    // Temperature affects retention and reliability
    for (const array of this.state.arrays.values()) {
      for (const cell of array.cells.values()) {
        // Arrhenius-like temperature dependence
        const tempFactor = Math.exp(-(kelvin - 300) / 100);
        cell.retentionTime *= tempFactor;
        cell.bitErrorRate /= tempFactor;
      }
    }
  }

  /**
   * Update global metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.arrays.size === 0) {
      this.state.globalCoherence = 0.95;
      this.state.globalFidelity = 0.92;
      this.state.globalDegradation = GAMMA_FIXED;
      return;
    }

    let coherenceSum = 0;
    let fidelitySum = 0;
    let degradationSum = 0;

    for (const array of this.state.arrays.values()) {
      coherenceSum += array.coherence;
      fidelitySum += array.fidelity;
      degradationSum += array.degradation;
    }

    const count = this.state.arrays.size;
    this.state.globalCoherence = coherenceSum / count;
    this.state.globalFidelity = fidelitySum / count;
    this.state.globalDegradation = degradationSum / count;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.globalDegradation + GAMMA_FIXED > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalFidelity) /
        (this.state.globalDegradation + GAMMA_FIXED);
    }
  }

  /**
   * Get array by ID
   */
  getArray(id: string): OpticalMemoryArray | undefined {
    return this.state.arrays.get(id);
  }

  /**
   * Remove array
   */
  removeArray(id: string): boolean {
    const array = this.state.arrays.get(id);
    if (!array) return false;

    this.state.totalCapacity -= array.totalCapacity;
    this.state.arrays.delete(id);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<OpticalMemorySystemState, 'arrays' | 'channels'> & {
    arrayCount: number;
    channelCount: number;
    avgCoherence: number;
    avgFidelity: number;
    errorRate: number;
  } {
    let totalErrors = 0;
    for (const array of this.state.arrays.values()) {
      totalErrors += array.errorCount;
    }

    const errorRate = this.state.totalReads > 0
      ? totalErrors / this.state.totalReads
      : 0;

    return {
      globalCoherence: this.state.globalCoherence,
      globalFidelity: this.state.globalFidelity,
      globalDegradation: this.state.globalDegradation,
      xi: this.state.xi,
      totalCapacity: this.state.totalCapacity,
      totalReads: this.state.totalReads,
      totalWrites: this.state.totalWrites,
      temperature: this.state.temperature,
      arrayCount: this.state.arrays.size,
      channelCount: this.state.channels.size,
      avgCoherence: this.state.globalCoherence,
      avgFidelity: this.state.globalFidelity,
      errorRate,
    };
  }

  /**
   * List all arrays
   */
  listArrays(): Array<{ id: string; name: string; capacity: number; type: string }> {
    return Array.from(this.state.arrays.values()).map(a => ({
      id: a.id,
      name: a.name,
      capacity: a.totalCapacity,
      type: Array.from(a.cells.values())[0]?.type || 'UNKNOWN',
    }));
  }
}

// Export singleton instance
export const opticalMemoryEngine = new OpticalMemoryEngine();
