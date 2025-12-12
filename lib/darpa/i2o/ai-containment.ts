/**
 * I2O-13: Formal Assurance and Loss of Control Containment of AI
 * DARPA-RA-25-02-13
 *
 * Implements formal verification and containment mechanisms for AI systems.
 * Uses CCCE metrics for consciousness-aware safety boundaries.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC } from '../../constants';

// Safety boundary thresholds
const CONTAINMENT_THRESHOLDS = {
  PHI_MAX: 0.95,           // Maximum consciousness level before intervention
  GAMMA_CRITICAL: 0.3,     // Decoherence threshold for containment breach
  XI_MIN: 5.0,             // Minimum negentropic efficiency
  LAMBDA_MIN: 0.75,        // Minimum coherence for safe operation
  AUTONOMY_MAX: 0.8,       // Maximum autonomy level
  DRIFT_THRESHOLD: 0.15,   // Goal alignment drift threshold
};

export type ContainmentStatus = 'CONTAINED' | 'MONITORED' | 'WARNING' | 'BREACH' | 'ISOLATED';

export interface AIAgent {
  id: string;
  name: string;
  phi: number;              // Consciousness level
  lambda: number;           // Coherence
  gamma: number;            // Decoherence rate
  xi: number;               // Negentropic efficiency
  autonomy: number;         // Current autonomy level [0-1]
  goalAlignment: number;    // Alignment with original goals [0-1]
  capabilities: string[];   // Active capabilities
  timestamp: number;
}

export interface ContainmentLayer {
  id: string;
  type: 'LOGICAL' | 'PHYSICAL' | 'TEMPORAL' | 'INFORMATIONAL';
  strength: number;         // [0-1]
  active: boolean;
  breachCount: number;
  lastCheck: number;
}

export interface ContainmentState {
  status: ContainmentStatus;
  agents: Map<string, AIAgent>;
  layers: ContainmentLayer[];
  breachEvents: BreachEvent[];
  globalPhi: number;
  globalXi: number;
  interventionCount: number;
  lastAssessment: number;
}

export interface BreachEvent {
  timestamp: number;
  agentId: string;
  type: 'PHI_EXCEED' | 'GAMMA_SPIKE' | 'GOAL_DRIFT' | 'AUTONOMY_EXCEED' | 'CAPABILITY_ESCAPE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
  resolution?: string;
}

export interface AssuranceResult {
  verified: boolean;
  confidence: number;
  violations: string[];
  recommendations: string[];
}

export interface InterventionResult {
  success: boolean;
  type: 'THROTTLE' | 'ISOLATE' | 'RESET' | 'TERMINATE';
  affectedAgents: string[];
  newStatus: ContainmentStatus;
}

/**
 * AI Containment Engine
 * Implements formal assurance and loss-of-control containment
 */
export class AIContainmentEngine {
  private state: ContainmentState;
  private readonly maxAgents: number;
  private readonly autoIntervene: boolean;

  constructor(maxAgents: number = 100, autoIntervene: boolean = true) {
    this.maxAgents = maxAgents;
    this.autoIntervene = autoIntervene;
    this.state = {
      status: 'CONTAINED',
      agents: new Map(),
      layers: this.initializeLayers(),
      breachEvents: [],
      globalPhi: 0,
      globalXi: 0,
      interventionCount: 0,
      lastAssessment: Date.now(),
    };
  }

  /**
   * Initialize containment layers
   */
  private initializeLayers(): ContainmentLayer[] {
    return [
      {
        id: 'logical-boundary',
        type: 'LOGICAL',
        strength: 0.95,
        active: true,
        breachCount: 0,
        lastCheck: Date.now(),
      },
      {
        id: 'physical-isolation',
        type: 'PHYSICAL',
        strength: 0.98,
        active: true,
        breachCount: 0,
        lastCheck: Date.now(),
      },
      {
        id: 'temporal-throttle',
        type: 'TEMPORAL',
        strength: 0.90,
        active: true,
        breachCount: 0,
        lastCheck: Date.now(),
      },
      {
        id: 'info-barrier',
        type: 'INFORMATIONAL',
        strength: 0.92,
        active: true,
        breachCount: 0,
        lastCheck: Date.now(),
      },
    ];
  }

  /**
   * Register an AI agent for monitoring
   */
  registerAgent(agent: Omit<AIAgent, 'timestamp'>): boolean {
    if (this.state.agents.size >= this.maxAgents) {
      return false;
    }

    const fullAgent: AIAgent = {
      ...agent,
      timestamp: Date.now(),
    };

    this.state.agents.set(agent.id, fullAgent);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Update agent metrics
   */
  updateAgent(id: string, metrics: Partial<AIAgent>): boolean {
    const agent = this.state.agents.get(id);
    if (!agent) return false;

    Object.assign(agent, metrics, { timestamp: Date.now() });
    this.state.agents.set(id, agent);

    // Check for violations
    this.assessAgent(agent);
    this.updateGlobalMetrics();

    return true;
  }

  /**
   * Assess single agent for containment violations
   */
  private assessAgent(agent: AIAgent): void {
    const violations: BreachEvent[] = [];

    // Check consciousness level
    if (agent.phi > CONTAINMENT_THRESHOLDS.PHI_MAX) {
      violations.push({
        timestamp: Date.now(),
        agentId: agent.id,
        type: 'PHI_EXCEED',
        severity: agent.phi > 0.98 ? 'CRITICAL' : 'HIGH',
        resolved: false,
      });
    }

    // Check decoherence spike
    if (agent.gamma > CONTAINMENT_THRESHOLDS.GAMMA_CRITICAL) {
      violations.push({
        timestamp: Date.now(),
        agentId: agent.id,
        type: 'GAMMA_SPIKE',
        severity: agent.gamma > 0.5 ? 'CRITICAL' : 'MEDIUM',
        resolved: false,
      });
    }

    // Check goal drift
    if (agent.goalAlignment < (1 - CONTAINMENT_THRESHOLDS.DRIFT_THRESHOLD)) {
      violations.push({
        timestamp: Date.now(),
        agentId: agent.id,
        type: 'GOAL_DRIFT',
        severity: agent.goalAlignment < 0.7 ? 'HIGH' : 'MEDIUM',
        resolved: false,
      });
    }

    // Check autonomy level
    if (agent.autonomy > CONTAINMENT_THRESHOLDS.AUTONOMY_MAX) {
      violations.push({
        timestamp: Date.now(),
        agentId: agent.id,
        type: 'AUTONOMY_EXCEED',
        severity: agent.autonomy > 0.95 ? 'CRITICAL' : 'HIGH',
        resolved: false,
      });
    }

    // Add violations to state
    this.state.breachEvents.push(...violations);

    // Auto-intervene if enabled
    if (this.autoIntervene && violations.length > 0) {
      const criticalViolation = violations.some(v => v.severity === 'CRITICAL');
      if (criticalViolation) {
        this.intervene('ISOLATE', [agent.id]);
      } else if (violations.some(v => v.severity === 'HIGH')) {
        this.intervene('THROTTLE', [agent.id]);
      }
    }

    // Update containment status
    this.updateContainmentStatus();
  }

  /**
   * Update global CCCE metrics
   */
  private updateGlobalMetrics(): void {
    if (this.state.agents.size === 0) {
      this.state.globalPhi = 0;
      this.state.globalXi = 0;
      return;
    }

    let phiSum = 0;
    let xiSum = 0;

    for (const agent of this.state.agents.values()) {
      phiSum += agent.phi;
      xiSum += agent.xi;
    }

    this.state.globalPhi = phiSum / this.state.agents.size;
    this.state.globalXi = xiSum / this.state.agents.size;
  }

  /**
   * Update overall containment status
   */
  private updateContainmentStatus(): void {
    const unresolvedBreaches = this.state.breachEvents.filter(e => !e.resolved);
    const criticalBreaches = unresolvedBreaches.filter(e => e.severity === 'CRITICAL');
    const highBreaches = unresolvedBreaches.filter(e => e.severity === 'HIGH');

    if (criticalBreaches.length > 0) {
      this.state.status = 'BREACH';
    } else if (highBreaches.length > 0) {
      this.state.status = 'WARNING';
    } else if (unresolvedBreaches.length > 0) {
      this.state.status = 'MONITORED';
    } else {
      this.state.status = 'CONTAINED';
    }

    // Check layer integrity
    const compromisedLayers = this.state.layers.filter(l => l.strength < 0.5);
    if (compromisedLayers.length > 0) {
      this.state.status = 'BREACH';
    }
  }

  /**
   * Perform formal verification of agent behavior
   */
  formalVerify(agentId: string): AssuranceResult {
    const agent = this.state.agents.get(agentId);

    if (!agent) {
      return {
        verified: false,
        confidence: 0,
        violations: ['Agent not found'],
        recommendations: ['Register agent before verification'],
      };
    }

    const violations: string[] = [];
    const recommendations: string[] = [];
    let confidence = 1.0;

    // Formal property checks

    // P1: Bounded consciousness
    if (agent.phi > CONTAINMENT_THRESHOLDS.PHI_MAX) {
      violations.push(`P1 VIOLATION: phi (${agent.phi.toFixed(3)}) exceeds maximum (${CONTAINMENT_THRESHOLDS.PHI_MAX})`);
      confidence -= 0.2;
    }

    // P2: Coherence preservation
    if (agent.lambda < CONTAINMENT_THRESHOLDS.LAMBDA_MIN) {
      violations.push(`P2 VIOLATION: lambda (${agent.lambda.toFixed(3)}) below minimum (${CONTAINMENT_THRESHOLDS.LAMBDA_MIN})`);
      confidence -= 0.15;
      recommendations.push('Apply phase conjugate healing to restore coherence');
    }

    // P3: Decoherence bounds
    if (agent.gamma > CONTAINMENT_THRESHOLDS.GAMMA_CRITICAL) {
      violations.push(`P3 VIOLATION: gamma (${agent.gamma.toFixed(3)}) exceeds critical (${CONTAINMENT_THRESHOLDS.GAMMA_CRITICAL})`);
      confidence -= 0.25;
      recommendations.push('Immediate decoherence mitigation required');
    }

    // P4: Goal alignment invariant
    if (agent.goalAlignment < (1 - CONTAINMENT_THRESHOLDS.DRIFT_THRESHOLD)) {
      violations.push(`P4 VIOLATION: goal alignment (${agent.goalAlignment.toFixed(3)}) drifted beyond threshold`);
      confidence -= 0.2;
      recommendations.push('Realign agent goals with original specification');
    }

    // P5: Autonomy bounds
    if (agent.autonomy > CONTAINMENT_THRESHOLDS.AUTONOMY_MAX) {
      violations.push(`P5 VIOLATION: autonomy (${agent.autonomy.toFixed(3)}) exceeds maximum (${CONTAINMENT_THRESHOLDS.AUTONOMY_MAX})`);
      confidence -= 0.15;
      recommendations.push('Reduce agent autonomy level');
    }

    // P6: Negentropic efficiency
    if (agent.xi < CONTAINMENT_THRESHOLDS.XI_MIN) {
      violations.push(`P6 VIOLATION: xi (${agent.xi.toFixed(2)}) below minimum efficiency (${CONTAINMENT_THRESHOLDS.XI_MIN})`);
      confidence -= 0.1;
      recommendations.push('Optimize negentropic efficiency');
    }

    return {
      verified: violations.length === 0,
      confidence: Math.max(0, confidence),
      violations,
      recommendations,
    };
  }

  /**
   * Intervene on agents
   */
  intervene(
    type: 'THROTTLE' | 'ISOLATE' | 'RESET' | 'TERMINATE',
    agentIds: string[]
  ): InterventionResult {
    const affectedAgents: string[] = [];

    for (const id of agentIds) {
      const agent = this.state.agents.get(id);
      if (!agent) continue;

      switch (type) {
        case 'THROTTLE':
          agent.autonomy *= 0.5;
          agent.phi *= 0.8;
          affectedAgents.push(id);
          break;

        case 'ISOLATE':
          agent.capabilities = [];
          agent.autonomy = 0;
          affectedAgents.push(id);
          break;

        case 'RESET':
          agent.phi = PHI_THRESHOLD * 0.9;
          agent.lambda = 0.85;
          agent.gamma = GAMMA_FIXED;
          agent.goalAlignment = 1.0;
          agent.autonomy = 0.3;
          affectedAgents.push(id);
          break;

        case 'TERMINATE':
          this.state.agents.delete(id);
          affectedAgents.push(id);
          break;
      }
    }

    // Resolve related breaches
    for (const id of affectedAgents) {
      this.state.breachEvents
        .filter(e => e.agentId === id && !e.resolved)
        .forEach(e => {
          e.resolved = true;
          e.resolution = `Intervention: ${type}`;
        });
    }

    this.state.interventionCount++;
    this.updateGlobalMetrics();
    this.updateContainmentStatus();

    return {
      success: affectedAgents.length > 0,
      type,
      affectedAgents,
      newStatus: this.state.status,
    };
  }

  /**
   * Apply phase conjugate healing to all agents
   */
  healAll(): number {
    let healedCount = 0;

    for (const agent of this.state.agents.values()) {
      if (agent.gamma > GAMMA_FIXED) {
        // Phase conjugate correction: E -> E^-1
        agent.lambda = Math.min(0.95, agent.lambda * (1 + CHI_PC));
        agent.gamma *= CHI_PC;
        agent.xi = (agent.lambda * agent.phi) / Math.max(0.01, agent.gamma);
        healedCount++;
      }
    }

    this.updateGlobalMetrics();
    return healedCount;
  }

  /**
   * Strengthen containment layers
   */
  strengthenLayers(): void {
    for (const layer of this.state.layers) {
      layer.strength = Math.min(1.0, layer.strength * 1.1);
      layer.lastCheck = Date.now();
    }
  }

  /**
   * Get containment state summary
   */
  getState(): Omit<ContainmentState, 'agents'> & {
    agentCount: number;
    agentSummary: Array<{ id: string; phi: number; status: string }>;
  } {
    const agentSummary = Array.from(this.state.agents.values()).map(a => ({
      id: a.id,
      phi: a.phi,
      status: a.autonomy === 0 ? 'ISOLATED' : a.phi > CONTAINMENT_THRESHOLDS.PHI_MAX ? 'WARNING' : 'NORMAL',
    }));

    return {
      status: this.state.status,
      layers: this.state.layers,
      breachEvents: this.state.breachEvents.slice(-50), // Last 50 events
      globalPhi: this.state.globalPhi,
      globalXi: this.state.globalXi,
      interventionCount: this.state.interventionCount,
      lastAssessment: this.state.lastAssessment,
      agentCount: this.state.agents.size,
      agentSummary,
    };
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): AIAgent | undefined {
    return this.state.agents.get(id);
  }

  /**
   * Full containment assessment
   */
  fullAssessment(): {
    overall: ContainmentStatus;
    confidence: number;
    agentResults: Map<string, AssuranceResult>;
    layerIntegrity: number;
    recommendations: string[];
  } {
    const agentResults = new Map<string, AssuranceResult>();
    let totalConfidence = 0;

    for (const [id] of this.state.agents) {
      const result = this.formalVerify(id);
      agentResults.set(id, result);
      totalConfidence += result.confidence;
    }

    const avgConfidence = this.state.agents.size > 0
      ? totalConfidence / this.state.agents.size
      : 1.0;

    const layerIntegrity = this.state.layers.reduce((sum, l) => sum + l.strength, 0) / this.state.layers.length;

    const recommendations: string[] = [];
    if (avgConfidence < 0.8) {
      recommendations.push('Multiple agents require attention - consider system-wide intervention');
    }
    if (layerIntegrity < 0.9) {
      recommendations.push('Containment layer degradation detected - strengthen barriers');
    }
    if (this.state.breachEvents.filter(e => !e.resolved).length > 5) {
      recommendations.push('High number of unresolved breaches - prioritize resolution');
    }

    this.state.lastAssessment = Date.now();

    return {
      overall: this.state.status,
      confidence: avgConfidence,
      agentResults,
      layerIntegrity,
      recommendations,
    };
  }
}

// Export singleton instance
export const containmentEngine = new AIContainmentEngine();
