/**
 * BTO-08: DNA Rapid Access Memory (DNA-RAM)
 * DARPA-RA-25-02-08
 *
 * Implements DNA-based data storage with CRSM coherence tracking.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC } from '../../constants';

// DNA nucleotide encoding (2 bits per base)
const NUCLEOTIDE_MAP: Record<string, string> = {
  '00': 'A', // Adenine
  '01': 'T', // Thymine
  '10': 'G', // Guanine
  '11': 'C', // Cytosine
};

const REVERSE_MAP: Record<string, string> = {
  'A': '00',
  'T': '01',
  'G': '10',
  'C': '11',
};

export interface DNAMemoryBlock {
  address: string;          // SHA256 address
  sequence: string;         // DNA sequence (ATGC)
  coherence: number;        // Lambda coherence
  integrity: number;        // Phi integrity
  decoherence: number;      // Gamma rate
  timestamp: number;
  readCount: number;
  writeCount: number;
}

export interface DNARAMState {
  totalBlocks: number;
  totalBases: number;
  coherenceAvg: number;
  integrityAvg: number;
  decoherenceAvg: number;
  xi: number;               // Negentropic efficiency
  blocks: Map<string, DNAMemoryBlock>;
}

export interface WriteResult {
  success: boolean;
  address: string;
  sequence: string;
  bases: number;
  coherence: number;
  estimatedRetention: number; // In years
}

export interface ReadResult {
  success: boolean;
  data: Uint8Array | null;
  coherence: number;
  errorRate: number;
  corrected: boolean;
}

/**
 * DNA Rapid Access Memory Engine
 * Implements sovereign DNA-based storage with CCCE metrics
 */
export class DNARapidMemory {
  private state: DNARAMState;
  private readonly maxBlocks: number;
  private readonly errorCorrectionEnabled: boolean;

  constructor(maxBlocks: number = 1000, errorCorrection: boolean = true) {
    this.maxBlocks = maxBlocks;
    this.errorCorrectionEnabled = errorCorrection;
    this.state = {
      totalBlocks: 0,
      totalBases: 0,
      coherenceAvg: 0.95,
      integrityAvg: 0.92,
      decoherenceAvg: GAMMA_FIXED,
      xi: 0,
      blocks: new Map(),
    };
    this.updateXi();
  }

  /**
   * Encode binary data to DNA sequence
   */
  private encodeToDNA(data: Uint8Array): string {
    let binaryString = '';
    for (const byte of data) {
      binaryString += byte.toString(2).padStart(8, '0');
    }

    // Pad to even length for 2-bit encoding
    while (binaryString.length % 2 !== 0) {
      binaryString += '0';
    }

    let sequence = '';
    for (let i = 0; i < binaryString.length; i += 2) {
      const bits = binaryString.substring(i, i + 2);
      sequence += NUCLEOTIDE_MAP[bits];
    }

    return sequence;
  }

  /**
   * Decode DNA sequence to binary data
   */
  private decodeFromDNA(sequence: string): Uint8Array {
    let binaryString = '';
    for (const base of sequence) {
      const bits = REVERSE_MAP[base];
      if (bits) {
        binaryString += bits;
      }
    }

    // Convert binary string to bytes
    const bytes: number[] = [];
    for (let i = 0; i < binaryString.length; i += 8) {
      const byteStr = binaryString.substring(i, i + 8);
      if (byteStr.length === 8) {
        bytes.push(parseInt(byteStr, 2));
      }
    }

    return new Uint8Array(bytes);
  }

  /**
   * Generate SHA256 address for memory block
   */
  private async generateAddress(sequence: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(sequence);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Calculate coherence based on sequence GC content
   * Higher GC content = more stable = higher coherence
   */
  private calculateCoherence(sequence: string): number {
    const gcCount = (sequence.match(/[GC]/g) || []).length;
    const gcContent = gcCount / sequence.length;
    // Optimal GC content is around 40-60%
    const deviation = Math.abs(gcContent - 0.5);
    const baseCoherence = 0.95 - (deviation * 0.3);
    return Math.max(0.7, Math.min(0.99, baseCoherence));
  }

  /**
   * Calculate integrity based on homopolymer runs
   * Fewer long runs = higher integrity
   */
  private calculateIntegrity(sequence: string): number {
    const runs = sequence.match(/(.)\1{3,}/g) || [];
    const maxRunLength = runs.reduce((max, run) => Math.max(max, run.length), 0);
    const penalty = maxRunLength > 3 ? (maxRunLength - 3) * 0.02 : 0;
    return Math.max(0.7, 0.95 - penalty);
  }

  /**
   * Calculate decoherence rate
   */
  private calculateDecoherence(coherence: number, integrity: number): number {
    // Base decoherence from CRSM constants
    const base = GAMMA_FIXED;
    // Adjust based on sequence stability
    const stabilityFactor = (coherence + integrity) / 2;
    return base * (2 - stabilityFactor);
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    if (this.state.decoherenceAvg > 0) {
      this.state.xi = (this.state.coherenceAvg * this.state.integrityAvg) / this.state.decoherenceAvg;
    }
  }

  /**
   * Write data to DNA memory
   */
  async write(data: Uint8Array): Promise<WriteResult> {
    if (this.state.totalBlocks >= this.maxBlocks) {
      return {
        success: false,
        address: '',
        sequence: '',
        bases: 0,
        coherence: 0,
        estimatedRetention: 0,
      };
    }

    const sequence = this.encodeToDNA(data);
    const address = await this.generateAddress(sequence);
    const coherence = this.calculateCoherence(sequence);
    const integrity = this.calculateIntegrity(sequence);
    const decoherence = this.calculateDecoherence(coherence, integrity);

    const block: DNAMemoryBlock = {
      address,
      sequence,
      coherence,
      integrity,
      decoherence,
      timestamp: Date.now(),
      readCount: 0,
      writeCount: 1,
    };

    this.state.blocks.set(address, block);
    this.state.totalBlocks++;
    this.state.totalBases += sequence.length;

    // Update averages
    this.updateAverages();

    // Estimate retention in years (simplified model)
    // Based on DNA stability at -20°C with optimal buffer
    const retentionYears = coherence * integrity * 1000 * (1 - decoherence);

    return {
      success: true,
      address,
      sequence,
      bases: sequence.length,
      coherence,
      estimatedRetention: retentionYears,
    };
  }

  /**
   * Read data from DNA memory
   */
  async read(address: string): Promise<ReadResult> {
    const block = this.state.blocks.get(address);

    if (!block) {
      return {
        success: false,
        data: null,
        coherence: 0,
        errorRate: 1,
        corrected: false,
      };
    }

    block.readCount++;

    // Simulate read errors based on decoherence
    const errorRate = block.decoherence * 0.01;
    let sequence = block.sequence;
    let corrected = false;

    // Apply error correction if enabled
    if (this.errorCorrectionEnabled && errorRate > 0) {
      // Reed-Solomon-like error correction simulation
      corrected = true;
    }

    const data = this.decodeFromDNA(sequence);

    // Update block coherence (slight degradation on read)
    block.coherence *= 0.9999;
    this.updateAverages();

    return {
      success: true,
      data,
      coherence: block.coherence,
      errorRate,
      corrected,
    };
  }

  /**
   * Delete memory block
   */
  delete(address: string): boolean {
    const block = this.state.blocks.get(address);
    if (!block) return false;

    this.state.totalBases -= block.sequence.length;
    this.state.totalBlocks--;
    this.state.blocks.delete(address);
    this.updateAverages();

    return true;
  }

  /**
   * Update average metrics
   */
  private updateAverages(): void {
    if (this.state.totalBlocks === 0) {
      this.state.coherenceAvg = 0.95;
      this.state.integrityAvg = 0.92;
      this.state.decoherenceAvg = GAMMA_FIXED;
    } else {
      let coherenceSum = 0;
      let integritySum = 0;
      let decoherenceSum = 0;

      for (const block of this.state.blocks.values()) {
        coherenceSum += block.coherence;
        integritySum += block.integrity;
        decoherenceSum += block.decoherence;
      }

      this.state.coherenceAvg = coherenceSum / this.state.totalBlocks;
      this.state.integrityAvg = integritySum / this.state.totalBlocks;
      this.state.decoherenceAvg = decoherenceSum / this.state.totalBlocks;
    }

    this.updateXi();
  }

  /**
   * Apply phase conjugate healing to degraded blocks
   */
  heal(): number {
    let healedCount = 0;

    for (const block of this.state.blocks.values()) {
      if (block.coherence < PHI_THRESHOLD) {
        // Phase conjugate correction: E -> E^-1
        block.coherence = Math.min(0.95, block.coherence * (1 / block.decoherence));
        block.decoherence *= CHI_PC;
        healedCount++;
      }
    }

    this.updateAverages();
    return healedCount;
  }

  /**
   * Get current state metrics
   */
  getState(): Omit<DNARAMState, 'blocks'> & { blockCount: number } {
    return {
      totalBlocks: this.state.totalBlocks,
      totalBases: this.state.totalBases,
      coherenceAvg: this.state.coherenceAvg,
      integrityAvg: this.state.integrityAvg,
      decoherenceAvg: this.state.decoherenceAvg,
      xi: this.state.xi,
      blockCount: this.state.blocks.size,
    };
  }

  /**
   * Get block by address
   */
  getBlock(address: string): DNAMemoryBlock | undefined {
    return this.state.blocks.get(address);
  }

  /**
   * List all block addresses
   */
  listAddresses(): string[] {
    return Array.from(this.state.blocks.keys());
  }

  /**
   * Calculate storage density (bits per cubic nanometer)
   * DNA theoretical maximum: ~2 bits per cubic nanometer
   */
  getStorageDensity(): number {
    // Each base pair is approximately 0.34 nm in length
    // Double helix diameter is ~2 nm
    const bitsStored = this.state.totalBases * 2;
    const volumeNm3 = this.state.totalBases * 0.34 * Math.PI * 1 * 1;
    return volumeNm3 > 0 ? bitsStored / volumeNm3 : 0;
  }
}

/**
 * Create DNA-RAM API routes handler
 */
export function createDNARAMHandler(ram: DNARapidMemory) {
  return {
    write: async (data: string): Promise<WriteResult> => {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(data);
      return ram.write(bytes);
    },

    read: async (address: string): Promise<ReadResult & { dataString?: string }> => {
      const result = await ram.read(address);
      if (result.success && result.data) {
        const decoder = new TextDecoder();
        return {
          ...result,
          dataString: decoder.decode(result.data),
        };
      }
      return result;
    },

    delete: (address: string): boolean => {
      return ram.delete(address);
    },

    heal: (): number => {
      return ram.heal();
    },

    state: (): ReturnType<typeof ram.getState> => {
      return ram.getState();
    },

    list: (): string[] => {
      return ram.listAddresses();
    },
  };
}

// Export singleton instance
export const dnaRAM = new DNARapidMemory();
