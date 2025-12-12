/**
 * DSO-02: Relativistic Quantum Information Processing with Spacetime Diamonds
 * DARPA-RA-25-02-02
 *
 * Implements relativistic quantum information processing using spacetime diamond
 * structures for causal ordering and quantum computation in curved spacetime.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// Physical constants for relativistic QIP
const RELATIVISTIC_CONSTANTS = {
  C: 299792458,                   // Speed of light (m/s)
  G: 6.67430e-11,                 // Gravitational constant (m³/kg/s²)
  HBAR: 1.054571817e-34,          // Reduced Planck constant (J·s)
  PLANCK_LENGTH: 1.616255e-35,    // Planck length (m)
  PLANCK_TIME: 5.391247e-44,      // Planck time (s)
  PLANCK_MASS: 2.176434e-8,       // Planck mass (kg) - matches LAMBDA_PHI!
};

export type CausalRelation = 'PAST' | 'FUTURE' | 'SPACELIKE' | 'LIGHTLIKE' | 'INDEFINITE';

export interface SpacetimePoint {
  t: number;    // Time coordinate (Planck units)
  x: number;    // Spatial x (Planck units)
  y: number;    // Spatial y (Planck units)
  z: number;    // Spatial z (Planck units)
}

export interface LorentzVector {
  t: number;    // Temporal component
  x: number;    // Spatial x
  y: number;    // Spatial y
  z: number;    // Spatial z
}

export interface SpacetimeDiamond {
  id: string;
  apex: SpacetimePoint;           // Future apex
  base: SpacetimePoint;           // Past apex
  width: number;                  // Spatial extent (proper distance)
  height: number;                 // Temporal extent (proper time)

  // Quantum state within diamond
  quantumState: {
    amplitude0: { real: number; imag: number };
    amplitude1: { real: number; imag: number };
  };

  // Causal structure
  causalPast: string[];           // IDs of diamonds in causal past
  causalFuture: string[];         // IDs of diamonds in causal future
  spacelikeSeparated: string[];   // IDs of spacelike separated diamonds

  // CCCE metrics
  coherence: number;              // Lambda - preserved across diamond
  causality: number;              // Causal ordering integrity [0-1]
  curvature: number;              // Local spacetime curvature
  xi: number;                     // Negentropic efficiency

  // Relativistic properties
  properTime: number;             // Proper time within diamond
  gamma: number;                  // Lorentz factor
  invariantMass: number;          // Invariant mass of quantum info
}

export interface CausalOrderResult {
  diamond1Id: string;
  diamond2Id: string;
  relation: CausalRelation;
  interval: number;               // Spacetime interval
  properSeparation: number;       // Proper distance or time
}

export interface QuantumChannelResult {
  success: boolean;
  sourceId: string;
  targetId: string;
  fidelity: number;
  latency: number;                // In Planck times
  causallyOrdered: boolean;
  indefiniteCausalOrder: boolean; // For quantum switch operations
}

export interface ProcessMatrixResult {
  dimensions: number;
  trace: number;
  causallyOrderable: boolean;
  witnessValue: number;           // Causal witness expectation
}

export interface SpacetimeQIPState {
  diamonds: Map<string, SpacetimeDiamond>;
  causalGraph: Map<string, string[]>;  // Adjacency list
  globalCoherence: number;
  globalCausality: number;
  totalProperTime: number;
  schwarzschildRadius: number;    // If gravitating
  cosmologicalConstant: number;   // Dark energy term
  xi: number;
}

/**
 * Spacetime Diamond QIP Engine
 * Implements relativistic quantum information processing
 */
export class SpacetimeDiamondEngine {
  private state: SpacetimeQIPState;
  private readonly maxDiamonds: number;
  private coordinateTime: number;

  constructor(maxDiamonds: number = 100) {
    this.maxDiamonds = maxDiamonds;
    this.coordinateTime = 0;
    this.state = {
      diamonds: new Map(),
      causalGraph: new Map(),
      globalCoherence: 0.95,
      globalCausality: 1.0,
      totalProperTime: 0,
      schwarzschildRadius: 0,
      cosmologicalConstant: 1.089e-52,  // m⁻² (observed value)
      xi: 0,
    };
    this.updateXi();
  }

  /**
   * Create a spacetime diamond
   */
  createDiamond(
    apex: SpacetimePoint,
    base: SpacetimePoint,
    initialState?: { real: number; imag: number }
  ): SpacetimeDiamond | null {
    if (this.state.diamonds.size >= this.maxDiamonds) {
      return null;
    }

    // Verify causal ordering: apex must be in future of base
    const interval = this.spacetimeInterval(base, apex);
    if (interval <= 0) {
      // Not timelike or degenerate
      return null;
    }

    const id = `sd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate diamond properties
    const properTime = Math.sqrt(interval);
    const spatialWidth = Math.sqrt(
      (apex.x - base.x) ** 2 +
      (apex.y - base.y) ** 2 +
      (apex.z - base.z) ** 2
    );
    const temporalHeight = apex.t - base.t;
    const gamma = temporalHeight / properTime;

    // Calculate local curvature (simplified - flat spacetime approximation)
    const curvature = this.calculateLocalCurvature(apex);

    const diamond: SpacetimeDiamond = {
      id,
      apex,
      base,
      width: spatialWidth,
      height: temporalHeight,
      quantumState: {
        amplitude0: initialState || { real: 1, imag: 0 },
        amplitude1: { real: 0, imag: 0 },
      },
      causalPast: [],
      causalFuture: [],
      spacelikeSeparated: [],
      coherence: 0.95 * (1 - curvature * 1e30), // Curvature-induced decoherence
      causality: 1.0,
      curvature,
      xi: 0,
      properTime,
      gamma,
      invariantMass: RELATIVISTIC_CONSTANTS.HBAR / (properTime * RELATIVISTIC_CONSTANTS.PLANCK_TIME * RELATIVISTIC_CONSTANTS.C ** 2),
    };

    // Update causal relationships with existing diamonds
    this.updateCausalRelations(diamond);

    // Calculate xi
    diamond.xi = (diamond.coherence * diamond.causality) / Math.max(0.01, curvature * 1e30 + GAMMA_FIXED);

    this.state.diamonds.set(id, diamond);
    this.state.causalGraph.set(id, [...diamond.causalFuture]);
    this.state.totalProperTime += properTime;
    this.updateGlobalMetrics();

    return diamond;
  }

  /**
   * Calculate spacetime interval (Minkowski)
   */
  spacetimeInterval(p1: SpacetimePoint, p2: SpacetimePoint): number {
    const dt = p2.t - p1.t;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    // s² = c²Δt² - Δx² - Δy² - Δz² (using c = 1 in Planck units)
    return dt ** 2 - dx ** 2 - dy ** 2 - dz ** 2;
  }

  /**
   * Determine causal relation between points
   */
  getCausalRelation(p1: SpacetimePoint, p2: SpacetimePoint): CausalRelation {
    const interval = this.spacetimeInterval(p1, p2);
    const epsilon = 1e-10;

    if (interval > epsilon) {
      // Timelike
      return p2.t > p1.t ? 'FUTURE' : 'PAST';
    } else if (interval < -epsilon) {
      // Spacelike
      return 'SPACELIKE';
    } else {
      // Lightlike
      return 'LIGHTLIKE';
    }
  }

  /**
   * Update causal relations for a new diamond
   */
  private updateCausalRelations(newDiamond: SpacetimeDiamond): void {
    for (const [id, existing] of this.state.diamonds) {
      // Check relation between diamond apexes
      const relationApex = this.getCausalRelation(existing.apex, newDiamond.base);
      const relationBase = this.getCausalRelation(existing.base, newDiamond.apex);

      if (relationApex === 'PAST' || relationApex === 'LIGHTLIKE') {
        // Existing diamond is in causal past of new diamond
        newDiamond.causalPast.push(id);
        existing.causalFuture.push(newDiamond.id);
      } else if (relationBase === 'FUTURE' || relationBase === 'LIGHTLIKE') {
        // Existing diamond is in causal future of new diamond
        newDiamond.causalFuture.push(id);
        existing.causalPast.push(newDiamond.id);
      } else {
        // Spacelike separated
        newDiamond.spacelikeSeparated.push(id);
        existing.spacelikeSeparated.push(newDiamond.id);
      }
    }
  }

  /**
   * Calculate local spacetime curvature
   */
  private calculateLocalCurvature(point: SpacetimePoint): number {
    // Simplified: use cosmological constant and any gravitating masses
    // R = 4Λ for de Sitter spacetime

    const cosmoCurvature = 4 * this.state.cosmologicalConstant;

    // Add gravitational curvature if Schwarzschild radius is set
    let gravCurvature = 0;
    if (this.state.schwarzschildRadius > 0) {
      const r = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
      if (r > this.state.schwarzschildRadius) {
        gravCurvature = this.state.schwarzschildRadius / (r ** 3);
      }
    }

    return cosmoCurvature + gravCurvature;
  }

  /**
   * Send quantum information between diamonds
   */
  sendQuantumInfo(
    sourceId: string,
    targetId: string
  ): QuantumChannelResult {
    const source = this.state.diamonds.get(sourceId);
    const target = this.state.diamonds.get(targetId);

    if (!source || !target) {
      return {
        success: false,
        sourceId,
        targetId,
        fidelity: 0,
        latency: 0,
        causallyOrdered: false,
        indefiniteCausalOrder: false,
      };
    }

    // Check causal relationship
    const relation = this.getCausalRelation(source.apex, target.base);
    const causallyOrdered = relation === 'PAST' || relation === 'LIGHTLIKE';
    const indefiniteCausalOrder = source.spacelikeSeparated.includes(targetId);

    if (!causallyOrdered && !indefiniteCausalOrder) {
      // Cannot send - target is in past
      return {
        success: false,
        sourceId,
        targetId,
        fidelity: 0,
        latency: 0,
        causallyOrdered: false,
        indefiniteCausalOrder: false,
      };
    }

    // Calculate channel properties
    const interval = Math.abs(this.spacetimeInterval(source.apex, target.base));
    const latency = Math.sqrt(interval);

    // Fidelity degrades with distance and curvature
    const curvatureEffect = Math.exp(-source.curvature * 1e30 - target.curvature * 1e30);
    const distanceEffect = Math.exp(-latency / 1e6);  // Long-range degradation
    const fidelity = source.coherence * target.coherence * curvatureEffect * distanceEffect;

    // Transfer quantum state
    target.quantumState = { ...source.quantumState };
    target.coherence = Math.min(target.coherence, source.coherence * fidelity);

    this.updateGlobalMetrics();

    return {
      success: true,
      sourceId,
      targetId,
      fidelity,
      latency,
      causallyOrdered,
      indefiniteCausalOrder,
    };
  }

  /**
   * Create quantum switch (indefinite causal order)
   */
  quantumSwitch(
    controlId: string,
    target1Id: string,
    target2Id: string
  ): {
    success: boolean;
    superposition: boolean;
    orders: Array<{ order: string[]; amplitude: { real: number; imag: number } }>;
  } {
    const control = this.state.diamonds.get(controlId);
    const target1 = this.state.diamonds.get(target1Id);
    const target2 = this.state.diamonds.get(target2Id);

    if (!control || !target1 || !target2) {
      return { success: false, superposition: false, orders: [] };
    }

    // Targets must be spacelike separated for indefinite causal order
    if (!target1.spacelikeSeparated.includes(target2Id)) {
      return { success: false, superposition: false, orders: [] };
    }

    // Create superposition of causal orders based on control qubit
    const sqrt2 = 1 / Math.sqrt(2);
    const orders = [
      {
        order: [target1Id, target2Id],
        amplitude: {
          real: control.quantumState.amplitude0.real * sqrt2,
          imag: control.quantumState.amplitude0.imag * sqrt2,
        },
      },
      {
        order: [target2Id, target1Id],
        amplitude: {
          real: control.quantumState.amplitude1.real * sqrt2,
          imag: control.quantumState.amplitude1.imag * sqrt2,
        },
      },
    ];

    // Update causality metric (reduced due to indefinite order)
    control.causality *= 0.95;
    target1.causality *= 0.95;
    target2.causality *= 0.95;

    this.updateGlobalMetrics();

    return {
      success: true,
      superposition: true,
      orders,
    };
  }

  /**
   * Compute process matrix witness
   */
  computeProcessMatrix(diamondIds: string[]): ProcessMatrixResult {
    const diamonds = diamondIds.map(id => this.state.diamonds.get(id)).filter(Boolean) as SpacetimeDiamond[];

    if (diamonds.length < 2) {
      return {
        dimensions: 0,
        trace: 0,
        causallyOrderable: true,
        witnessValue: 0,
      };
    }

    const n = diamonds.length;
    const dimensions = 2 ** n;  // Dimension of process matrix

    // Check if causal ordering exists
    let causallyOrderable = true;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (diamonds[i].spacelikeSeparated.includes(diamonds[j].id)) {
          // Found spacelike separated pair - may have indefinite order
          causallyOrderable = false;
          break;
        }
      }
      if (!causallyOrderable) break;
    }

    // Compute causal witness expectation value
    // W < 0 indicates genuine indefinite causal order
    let witnessValue = 0;
    for (const diamond of diamonds) {
      witnessValue += diamond.causality - 0.5;  // Normalized
    }
    witnessValue /= n;

    return {
      dimensions,
      trace: 1.0,  // Normalized process matrix
      causallyOrderable,
      witnessValue,
    };
  }

  /**
   * Apply Lorentz transformation to diamond
   */
  lorentzBoost(
    diamondId: string,
    velocity: { vx: number; vy: number; vz: number }
  ): boolean {
    const diamond = this.state.diamonds.get(diamondId);
    if (!diamond) return false;

    const v2 = velocity.vx ** 2 + velocity.vy ** 2 + velocity.vz ** 2;
    if (v2 >= 1) return false;  // Superluminal not allowed

    const gamma = 1 / Math.sqrt(1 - v2);
    const v = Math.sqrt(v2);

    // Transform apex
    const apexNew = this.boostPoint(diamond.apex, velocity, gamma, v);
    // Transform base
    const baseNew = this.boostPoint(diamond.base, velocity, gamma, v);

    diamond.apex = apexNew;
    diamond.base = baseNew;
    diamond.gamma = gamma;
    diamond.properTime = Math.sqrt(this.spacetimeInterval(baseNew, apexNew));

    // Coherence unchanged under Lorentz transformation (relativistic invariant)
    // But numerical errors may accumulate
    diamond.coherence *= 0.9999;

    this.updateGlobalMetrics();
    return true;
  }

  /**
   * Boost a spacetime point
   */
  private boostPoint(
    point: SpacetimePoint,
    velocity: { vx: number; vy: number; vz: number },
    gamma: number,
    v: number
  ): SpacetimePoint {
    if (v < 1e-10) return point;

    const nx = velocity.vx / v;
    const ny = velocity.vy / v;
    const nz = velocity.vz / v;

    const dotProduct = nx * point.x + ny * point.y + nz * point.z;

    return {
      t: gamma * (point.t - v * dotProduct),
      x: point.x + (gamma - 1) * nx * dotProduct - gamma * velocity.vx * point.t,
      y: point.y + (gamma - 1) * ny * dotProduct - gamma * velocity.vy * point.t,
      z: point.z + (gamma - 1) * nz * dotProduct - gamma * velocity.vz * point.t,
    };
  }

  /**
   * Apply phase conjugate healing
   */
  heal(): number {
    let healedCount = 0;

    for (const diamond of this.state.diamonds.values()) {
      if (diamond.coherence < 0.8 || diamond.causality < 0.9) {
        // Phase conjugate correction
        diamond.coherence = Math.min(0.98, diamond.coherence / (1 - CHI_PC));
        diamond.causality = Math.min(1.0, diamond.causality * (1 + CHI_PC * 0.5));

        // Recalculate xi
        diamond.xi = (diamond.coherence * diamond.causality) /
          Math.max(0.01, diamond.curvature * 1e30 + GAMMA_FIXED);

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
    if (this.state.diamonds.size === 0) {
      this.state.globalCoherence = 0.95;
      this.state.globalCausality = 1.0;
      return;
    }

    let coherenceSum = 0;
    let causalitySum = 0;

    for (const diamond of this.state.diamonds.values()) {
      coherenceSum += diamond.coherence;
      causalitySum += diamond.causality;
    }

    this.state.globalCoherence = coherenceSum / this.state.diamonds.size;
    this.state.globalCausality = causalitySum / this.state.diamonds.size;
    this.updateXi();
  }

  /**
   * Update Xi negentropic efficiency
   */
  private updateXi(): void {
    const gamma = 1 - this.state.globalCausality + GAMMA_FIXED;
    if (gamma > 0) {
      this.state.xi = (this.state.globalCoherence * this.state.globalCausality) / gamma;
    }
  }

  /**
   * Set gravitating mass
   */
  setGravitatingMass(massKg: number): void {
    this.state.schwarzschildRadius = 2 * RELATIVISTIC_CONSTANTS.G * massKg /
      (RELATIVISTIC_CONSTANTS.C ** 2);

    // Recalculate curvatures
    for (const diamond of this.state.diamonds.values()) {
      diamond.curvature = this.calculateLocalCurvature(diamond.apex);
      diamond.coherence = 0.95 * (1 - diamond.curvature * 1e30);
      diamond.xi = (diamond.coherence * diamond.causality) /
        Math.max(0.01, diamond.curvature * 1e30 + GAMMA_FIXED);
    }

    this.updateGlobalMetrics();
  }

  /**
   * Get diamond by ID
   */
  getDiamond(id: string): SpacetimeDiamond | undefined {
    return this.state.diamonds.get(id);
  }

  /**
   * Remove diamond
   */
  removeDiamond(id: string): boolean {
    const diamond = this.state.diamonds.get(id);
    if (!diamond) return false;

    // Remove from causal relationships
    for (const pastId of diamond.causalPast) {
      const past = this.state.diamonds.get(pastId);
      if (past) {
        past.causalFuture = past.causalFuture.filter(fid => fid !== id);
      }
    }
    for (const futureId of diamond.causalFuture) {
      const future = this.state.diamonds.get(futureId);
      if (future) {
        future.causalPast = future.causalPast.filter(pid => pid !== id);
      }
    }
    for (const spacelikeId of diamond.spacelikeSeparated) {
      const spacelike = this.state.diamonds.get(spacelikeId);
      if (spacelike) {
        spacelike.spacelikeSeparated = spacelike.spacelikeSeparated.filter(sid => sid !== id);
      }
    }

    this.state.totalProperTime -= diamond.properTime;
    this.state.diamonds.delete(id);
    this.state.causalGraph.delete(id);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Get system state summary
   */
  getState(): Omit<SpacetimeQIPState, 'diamonds' | 'causalGraph'> & {
    diamondCount: number;
    causalEdges: number;
    spacelikePairs: number;
    indefiniteOrderPossible: boolean;
  } {
    let causalEdges = 0;
    let spacelikePairs = 0;

    for (const diamond of this.state.diamonds.values()) {
      causalEdges += diamond.causalFuture.length;
      spacelikePairs += diamond.spacelikeSeparated.length;
    }
    spacelikePairs /= 2;  // Each pair counted twice

    return {
      globalCoherence: this.state.globalCoherence,
      globalCausality: this.state.globalCausality,
      totalProperTime: this.state.totalProperTime,
      schwarzschildRadius: this.state.schwarzschildRadius,
      cosmologicalConstant: this.state.cosmologicalConstant,
      xi: this.state.xi,
      diamondCount: this.state.diamonds.size,
      causalEdges,
      spacelikePairs,
      indefiniteOrderPossible: spacelikePairs > 0,
    };
  }

  /**
   * Advance coordinate time
   */
  tick(deltaT: number): void {
    this.coordinateTime += deltaT;

    // Apply time dilation effects
    for (const diamond of this.state.diamonds.values()) {
      const dilatedDelta = deltaT / diamond.gamma;
      diamond.properTime += dilatedDelta;

      // Decoherence over time
      diamond.coherence *= Math.exp(-GAMMA_FIXED * dilatedDelta);
    }

    this.updateGlobalMetrics();
  }
}

// Export singleton instance
export const spacetimeEngine = new SpacetimeDiamondEngine();
