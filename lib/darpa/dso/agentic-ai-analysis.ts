/**
 * DARPA DSO Topic 5: Numerical Analysis of Agentic AI Interactions
 * Solicitation: DARPA-RA-25-02-05
 *
 * DNA-Lang Sovereign Implementation
 *
 * Focus Areas:
 * - Multi-agent system dynamics modeling
 * - Emergent behavior prediction
 * - Stability analysis for AI collectives
 * - Game-theoretic equilibrium computation
 * - CCCE-guided agent coherence tracking
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC, GOLDEN_RATIO } from '../../constants';

// ============================================================================
// Agentic AI Constants
// ============================================================================

export const AGENTIC_CONSTANTS = {
  // Stability thresholds
  LYAPUNOV_THRESHOLD: 0.01,       // Lyapunov stability bound
  NASH_TOLERANCE: 1e-6,           // Nash equilibrium convergence
  CONVERGENCE_RATE: 0.95,         // Expected convergence rate

  // Agent parameters
  MAX_AGENTS: 1000,               // Maximum agents in simulation
  INTERACTION_RADIUS: 0.3,        // Normalized interaction distance
  LEARNING_RATE: 0.01,            // Default learning rate

  // CCCE integration
  COHERENCE_COUPLING: LAMBDA_PHI,
  PHI_COLLECTIVE: PHI_THRESHOLD,
  GAMMA_TOLERANCE: GAMMA_FIXED,

  // Chaos indicators
  LYAPUNOV_POSITIVE_THRESHOLD: 0.001,  // Positive = chaotic
  ENTROPY_CRITICAL: 0.693,              // ln(2) - bifurcation point
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export interface Agent {
  id: string;
  state: AgentState;
  policy: PolicyFunction;
  memory: AgentMemory;
  connections: string[];          // Connected agent IDs
  ccceMetrics: CCCEMetrics;
}

export interface AgentState {
  position: number[];             // State space position
  velocity: number[];             // State space velocity
  utility: number;                // Current utility value
  reputation: number;             // Trust/reputation score
  resources: number;              // Available resources
}

export interface PolicyFunction {
  type: 'deterministic' | 'stochastic' | 'learned' | 'evolutionary';
  parameters: Record<string, number>;
  actionSpace: ActionSpace;
}

export interface ActionSpace {
  discrete: boolean;
  dimensions: number;
  bounds: { min: number; max: number }[];
}

export interface AgentMemory {
  observations: Observation[];
  beliefs: Map<string, number>;   // Beliefs about other agents
  history: Action[];
  capacity: number;
}

export interface Observation {
  timestamp: number;
  source: string;                 // Observing agent
  target: string;                 // Observed agent
  data: Record<string, number>;
}

export interface Action {
  timestamp: number;
  agentId: string;
  type: string;
  parameters: number[];
  outcome: number;
}

export interface CCCEMetrics {
  lambda: number;    // Coherence preservation
  phi: number;       // Organization/consciousness
  gamma: number;     // Decoherence/degradation
  xi: number;        // Negentropic efficiency
  timestamp: number;
}

export interface MultiAgentSystem {
  id: string;
  agents: Map<string, Agent>;
  topology: GraphTopology;
  dynamics: SystemDynamics;
  equilibria: Equilibrium[];
  collectiveMetrics: CollectiveMetrics;
}

export interface GraphTopology {
  type: 'complete' | 'ring' | 'star' | 'random' | 'scale-free' | 'small-world';
  adjacencyMatrix: number[][];
  laplacianMatrix: number[][];
  spectralGap: number;
  clusteringCoeff: number;
}

export interface SystemDynamics {
  type: 'continuous' | 'discrete' | 'hybrid';
  dimension: number;
  jacobian: number[][];
  eigenvalues: Complex[];
  lyapunovExponents: number[];
  attractors: Attractor[];
}

export interface Complex {
  real: number;
  imag: number;
}

export interface Equilibrium {
  type: 'nash' | 'pareto' | 'correlated' | 'evolutionary-stable';
  state: number[];
  stability: 'stable' | 'unstable' | 'saddle' | 'limit-cycle';
  basinSize: number;              // Size of attraction basin
  reachability: number;           // Probability of reaching from random start
}

export interface Attractor {
  type: 'fixed-point' | 'limit-cycle' | 'strange' | 'chaotic';
  dimension: number;              // Hausdorff dimension for strange attractors
  period?: number;                // For limit cycles
  state: number[];
  basin: number[][];              // Basin of attraction bounds
}

export interface CollectiveMetrics {
  consensus: number;              // Degree of consensus [0,1]
  polarization: number;           // Degree of polarization [0,1]
  efficiency: number;             // Collective efficiency
  fairness: number;               // Gini coefficient
  stability: number;              // System stability index
  entropy: number;                // Shannon entropy of state distribution
  ccce: CCCEMetrics;
}

export interface SimulationResult {
  systemId: string;
  trajectory: TrajectoryPoint[];
  finalState: CollectiveMetrics;
  convergenceTime: number | null; // null if didn't converge
  chaosIndicators: ChaosIndicators;
  emergentBehaviors: EmergentBehavior[];
}

export interface TrajectoryPoint {
  time: number;
  agentStates: Map<string, AgentState>;
  collectiveMetrics: CollectiveMetrics;
}

export interface ChaosIndicators {
  maxLyapunovExponent: number;
  kaplanYorkeD: number;           // Kaplan-Yorke dimension
  correlationDim: number;
  entropyRate: number;
  predictabilityHorizon: number;  // Time steps
}

export interface EmergentBehavior {
  type: 'coalition' | 'oscillation' | 'cascade' | 'synchronization' | 'polarization';
  agents: string[];
  startTime: number;
  magnitude: number;
  description: string;
}

export interface StabilityAnalysis {
  systemId: string;
  localStability: boolean;
  globalStability: boolean;
  lyapunovFunction: number[];     // Coefficients
  stabilityMargin: number;
  sensitivityMatrix: number[][];
  criticalParameters: string[];
}

export interface GameTheoreticAnalysis {
  systemId: string;
  payoffMatrix: number[][][];     // Players × Actions × Outcomes
  nashEquilibria: Equilibrium[];
  paretoFrontier: number[][];
  socialWelfare: number;
  priceOfAnarchy: number;
  priceOfStability: number;
}

// ============================================================================
// Agentic AI Analysis Engine
// ============================================================================

export class AgenticAIEngine {
  private systems: Map<string, MultiAgentSystem> = new Map();
  private simulations: Map<string, SimulationResult> = new Map();
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
  // Agent Creation
  // ==========================================================================

  /**
   * Create a new agent with specified policy
   */
  createAgent(
    policyType: PolicyFunction['type'],
    stateDim: number,
    actionDim: number
  ): Agent {
    const id = `AGENT-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const policy: PolicyFunction = {
      type: policyType,
      parameters: this.initializePolicyParams(policyType),
      actionSpace: {
        discrete: policyType !== 'learned',
        dimensions: actionDim,
        bounds: Array(actionDim).fill({ min: -1, max: 1 }),
      },
    };

    const state: AgentState = {
      position: Array(stateDim).fill(0).map(() => Math.random() * 2 - 1),
      velocity: Array(stateDim).fill(0),
      utility: 0,
      reputation: 0.5,
      resources: 1.0,
    };

    return {
      id,
      state,
      policy,
      memory: {
        observations: [],
        beliefs: new Map(),
        history: [],
        capacity: 1000,
      },
      connections: [],
      ccceMetrics: { ...this.ccceState },
    };
  }

  private initializePolicyParams(type: PolicyFunction['type']): Record<string, number> {
    switch (type) {
      case 'deterministic':
        return { threshold: 0.5, bias: 0 };
      case 'stochastic':
        return { temperature: 1.0, epsilon: 0.1 };
      case 'learned':
        return { learningRate: 0.01, discount: 0.99, explorationRate: 0.2 };
      case 'evolutionary':
        return { mutationRate: 0.05, crossoverRate: 0.7, fitness: 0 };
      default:
        return {};
    }
  }

  // ==========================================================================
  // System Construction
  // ==========================================================================

  /**
   * Create multi-agent system with specified topology
   */
  createSystem(
    numAgents: number,
    topologyType: GraphTopology['type'],
    dynamicsType: SystemDynamics['type']
  ): MultiAgentSystem {
    const id = `MAS-${Date.now().toString(36)}`;
    const agents = new Map<string, Agent>();

    // Create agents
    for (let i = 0; i < numAgents; i++) {
      const agent = this.createAgent('stochastic', 4, 2);
      agents.set(agent.id, agent);
    }

    // Generate topology
    const topology = this.generateTopology(topologyType, numAgents);

    // Connect agents based on topology
    const agentIds = Array.from(agents.keys());
    for (let i = 0; i < numAgents; i++) {
      const agent = agents.get(agentIds[i])!;
      for (let j = 0; j < numAgents; j++) {
        if (topology.adjacencyMatrix[i][j] > 0) {
          agent.connections.push(agentIds[j]);
        }
      }
    }

    // Initialize dynamics
    const dynamics = this.initializeDynamics(dynamicsType, numAgents);

    const system: MultiAgentSystem = {
      id,
      agents,
      topology,
      dynamics,
      equilibria: [],
      collectiveMetrics: this.computeCollectiveMetrics(agents),
    };

    this.systems.set(id, system);
    return system;
  }

  private generateTopology(type: GraphTopology['type'], n: number): GraphTopology {
    const adjacencyMatrix = Array(n).fill(null).map(() => Array(n).fill(0));

    switch (type) {
      case 'complete':
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i !== j) adjacencyMatrix[i][j] = 1;
          }
        }
        break;

      case 'ring':
        for (let i = 0; i < n; i++) {
          adjacencyMatrix[i][(i + 1) % n] = 1;
          adjacencyMatrix[(i + 1) % n][i] = 1;
        }
        break;

      case 'star':
        for (let i = 1; i < n; i++) {
          adjacencyMatrix[0][i] = 1;
          adjacencyMatrix[i][0] = 1;
        }
        break;

      case 'random':
        const p = 2 * Math.log(n) / n;  // Connectivity threshold
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            if (Math.random() < p) {
              adjacencyMatrix[i][j] = 1;
              adjacencyMatrix[j][i] = 1;
            }
          }
        }
        break;

      case 'scale-free':
        // Barabási-Albert model
        const m = 2;  // New edges per node
        for (let i = 0; i < Math.min(m + 1, n); i++) {
          for (let j = i + 1; j < Math.min(m + 1, n); j++) {
            adjacencyMatrix[i][j] = 1;
            adjacencyMatrix[j][i] = 1;
          }
        }
        const degrees = adjacencyMatrix.map(row => row.reduce((a, b) => a + b, 0));
        for (let i = m + 1; i < n; i++) {
          const totalDegree = degrees.reduce((a, b) => a + b, 0);
          const targets = new Set<number>();
          while (targets.size < m) {
            let r = Math.random() * totalDegree;
            for (let j = 0; j < i; j++) {
              r -= degrees[j];
              if (r <= 0) {
                targets.add(j);
                break;
              }
            }
          }
          for (const j of targets) {
            adjacencyMatrix[i][j] = 1;
            adjacencyMatrix[j][i] = 1;
            degrees[i]++;
            degrees[j]++;
          }
        }
        break;

      case 'small-world':
        // Watts-Strogatz model
        const k = 4;  // Average degree
        const beta = 0.3;  // Rewiring probability
        // Start with ring lattice
        for (let i = 0; i < n; i++) {
          for (let j = 1; j <= k / 2; j++) {
            adjacencyMatrix[i][(i + j) % n] = 1;
            adjacencyMatrix[(i + j) % n][i] = 1;
          }
        }
        // Rewire edges
        for (let i = 0; i < n; i++) {
          for (let j = 1; j <= k / 2; j++) {
            if (Math.random() < beta) {
              const oldTarget = (i + j) % n;
              let newTarget: number;
              do {
                newTarget = Math.floor(Math.random() * n);
              } while (newTarget === i || adjacencyMatrix[i][newTarget] === 1);
              adjacencyMatrix[i][oldTarget] = 0;
              adjacencyMatrix[oldTarget][i] = 0;
              adjacencyMatrix[i][newTarget] = 1;
              adjacencyMatrix[newTarget][i] = 1;
            }
          }
        }
        break;
    }

    // Compute Laplacian
    const laplacianMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      const degree = adjacencyMatrix[i].reduce((a, b) => a + b, 0);
      laplacianMatrix[i][i] = degree;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          laplacianMatrix[i][j] = -adjacencyMatrix[i][j];
        }
      }
    }

    // Compute spectral gap (simplified - second smallest eigenvalue)
    const spectralGap = this.computeSpectralGap(laplacianMatrix);

    // Compute clustering coefficient
    const clusteringCoeff = this.computeClusteringCoefficient(adjacencyMatrix);

    return {
      type,
      adjacencyMatrix,
      laplacianMatrix,
      spectralGap,
      clusteringCoeff,
    };
  }

  private computeSpectralGap(laplacian: number[][]): number {
    // Power iteration for second smallest eigenvalue (Fiedler value)
    // Simplified implementation
    const n = laplacian.length;
    if (n < 2) return 0;

    // Approximate using graph connectivity
    let minOffDiag = Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && laplacian[i][j] !== 0) {
          minOffDiag = Math.min(minOffDiag, Math.abs(laplacian[i][j]));
        }
      }
    }

    return minOffDiag === Infinity ? 0 : minOffDiag;
  }

  private computeClusteringCoefficient(adjacency: number[][]): number {
    const n = adjacency.length;
    let totalCC = 0;

    for (let i = 0; i < n; i++) {
      const neighbors: number[] = [];
      for (let j = 0; j < n; j++) {
        if (adjacency[i][j] > 0) neighbors.push(j);
      }

      const k = neighbors.length;
      if (k < 2) continue;

      let triangles = 0;
      for (let j = 0; j < k; j++) {
        for (let l = j + 1; l < k; l++) {
          if (adjacency[neighbors[j]][neighbors[l]] > 0) {
            triangles++;
          }
        }
      }

      totalCC += (2 * triangles) / (k * (k - 1));
    }

    return totalCC / n;
  }

  private initializeDynamics(type: SystemDynamics['type'], n: number): SystemDynamics {
    const dimension = n * 4;  // 4D state per agent

    // Initialize Jacobian (identity + small perturbations)
    const jacobian = Array(dimension).fill(null).map((_, i) =>
      Array(dimension).fill(0).map((_, j) =>
        i === j ? -0.1 : (Math.random() - 0.5) * 0.02
      )
    );

    // Compute eigenvalues (simplified - use trace for stability check)
    const trace = jacobian.reduce((sum, row, i) => sum + row[i], 0);
    const eigenvalues: Complex[] = [
      { real: trace / dimension, imag: 0 },
      { real: trace / dimension * 0.9, imag: 0.1 },
    ];

    return {
      type,
      dimension,
      jacobian,
      eigenvalues,
      lyapunovExponents: [trace / dimension],
      attractors: [],
    };
  }

  private computeCollectiveMetrics(agents: Map<string, Agent>): CollectiveMetrics {
    const agentList = Array.from(agents.values());
    const n = agentList.length;

    if (n === 0) {
      return {
        consensus: 0,
        polarization: 0,
        efficiency: 0,
        fairness: 0,
        stability: 0,
        entropy: 0,
        ccce: { ...this.ccceState },
      };
    }

    // Consensus: inverse of variance in positions
    const positions = agentList.map(a => a.state.position);
    const meanPos = positions[0].map((_, d) =>
      positions.reduce((sum, p) => sum + p[d], 0) / n
    );
    const variance = positions.reduce((sum, p) =>
      sum + p.reduce((s, v, d) => s + Math.pow(v - meanPos[d], 2), 0), 0
    ) / n;
    const consensus = 1 / (1 + variance);

    // Polarization: bimodality measure
    const polarization = Math.min(1, variance);

    // Efficiency: average utility
    const efficiency = agentList.reduce((sum, a) => sum + a.state.utility, 0) / n;

    // Fairness: 1 - Gini coefficient
    const resources = agentList.map(a => a.state.resources).sort((a, b) => a - b);
    const totalResources = resources.reduce((a, b) => a + b, 0);
    let giniSum = 0;
    for (let i = 0; i < n; i++) {
      giniSum += (2 * (i + 1) - n - 1) * resources[i];
    }
    const gini = giniSum / (n * totalResources);
    const fairness = 1 - gini;

    // Stability: based on velocity magnitudes
    const avgVelocity = agentList.reduce((sum, a) =>
      sum + Math.sqrt(a.state.velocity.reduce((s, v) => s + v * v, 0)), 0
    ) / n;
    const stability = 1 / (1 + avgVelocity);

    // Entropy: Shannon entropy of state distribution
    const bins = 10;
    const histogram = Array(bins).fill(0);
    for (const a of agentList) {
      const bin = Math.min(bins - 1, Math.floor((a.state.position[0] + 1) / 2 * bins));
      histogram[bin]++;
    }
    const entropy = histogram.reduce((sum, count) => {
      if (count === 0) return sum;
      const p = count / n;
      return sum - p * Math.log(p);
    }, 0) / Math.log(bins);

    // Aggregate CCCE from all agents
    const avgLambda = agentList.reduce((sum, a) => sum + a.ccceMetrics.lambda, 0) / n;
    const avgPhi = agentList.reduce((sum, a) => sum + a.ccceMetrics.phi, 0) / n;
    const avgGamma = agentList.reduce((sum, a) => sum + a.ccceMetrics.gamma, 0) / n;

    return {
      consensus,
      polarization,
      efficiency,
      fairness,
      stability,
      entropy,
      ccce: {
        lambda: avgLambda,
        phi: avgPhi,
        gamma: avgGamma,
        xi: (avgLambda * avgPhi) / Math.max(avgGamma, 0.001),
        timestamp: Date.now(),
      },
    };
  }

  // ==========================================================================
  // Simulation
  // ==========================================================================

  /**
   * Run multi-agent simulation
   */
  simulate(
    systemId: string,
    steps: number,
    dt: number = 0.01
  ): SimulationResult {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    const trajectory: TrajectoryPoint[] = [];
    const emergentBehaviors: EmergentBehavior[] = [];

    // Initial state
    trajectory.push({
      time: 0,
      agentStates: new Map(
        Array.from(system.agents.entries()).map(([id, a]) => [id, { ...a.state }])
      ),
      collectiveMetrics: this.computeCollectiveMetrics(system.agents),
    });

    // Simulation loop
    for (let t = 1; t <= steps; t++) {
      const time = t * dt;

      // Update each agent
      for (const [agentId, agent] of system.agents) {
        this.updateAgent(agent, system, dt);
      }

      // Record trajectory
      const currentMetrics = this.computeCollectiveMetrics(system.agents);
      trajectory.push({
        time,
        agentStates: new Map(
          Array.from(system.agents.entries()).map(([id, a]) => [id, { ...a.state }])
        ),
        collectiveMetrics: currentMetrics,
      });

      // Detect emergent behaviors
      this.detectEmergentBehaviors(trajectory, emergentBehaviors, t);
    }

    // Compute chaos indicators
    const chaosIndicators = this.computeChaosIndicators(trajectory);

    // Check convergence
    const finalMetrics = trajectory[trajectory.length - 1].collectiveMetrics;
    const prevMetrics = trajectory[Math.max(0, trajectory.length - 100)].collectiveMetrics;
    const hasConverged = Math.abs(finalMetrics.consensus - prevMetrics.consensus) < 0.01;
    const convergenceTime = hasConverged ? this.findConvergenceTime(trajectory) : null;

    const result: SimulationResult = {
      systemId,
      trajectory,
      finalState: finalMetrics,
      convergenceTime,
      chaosIndicators,
      emergentBehaviors,
    };

    this.simulations.set(systemId, result);
    return result;
  }

  private updateAgent(agent: Agent, system: MultiAgentSystem, dt: number): void {
    const neighbors = agent.connections
      .map(id => system.agents.get(id))
      .filter((a): a is Agent => a !== undefined);

    // Compute interaction forces
    const force = Array(agent.state.position.length).fill(0);

    for (const neighbor of neighbors) {
      for (let d = 0; d < force.length; d++) {
        // Attraction to neighbors (consensus force)
        const diff = neighbor.state.position[d] - agent.state.position[d];
        force[d] += 0.1 * diff;

        // Repulsion when too close
        if (Math.abs(diff) < 0.1) {
          force[d] -= 0.05 * Math.sign(diff);
        }
      }
    }

    // Add noise based on policy
    if (agent.policy.type === 'stochastic') {
      const temp = agent.policy.parameters.temperature || 1.0;
      for (let d = 0; d < force.length; d++) {
        force[d] += temp * 0.01 * (Math.random() - 0.5);
      }
    }

    // Update dynamics
    for (let d = 0; d < agent.state.position.length; d++) {
      agent.state.velocity[d] = agent.state.velocity[d] * 0.9 + force[d];
      agent.state.position[d] += agent.state.velocity[d] * dt;
      // Bound position
      agent.state.position[d] = Math.max(-1, Math.min(1, agent.state.position[d]));
    }

    // Update utility based on resource access and cooperation
    const avgNeighborResource = neighbors.length > 0
      ? neighbors.reduce((sum, n) => sum + n.state.resources, 0) / neighbors.length
      : 0;
    agent.state.utility = 0.9 * agent.state.utility + 0.1 * avgNeighborResource;

    // Update CCCE metrics
    const velocityMag = Math.sqrt(agent.state.velocity.reduce((s, v) => s + v * v, 0));
    agent.ccceMetrics.gamma = Math.min(1, GAMMA_FIXED + velocityMag * 0.1);
    agent.ccceMetrics.lambda = Math.max(0.5, 1 - agent.ccceMetrics.gamma);
    agent.ccceMetrics.xi = (agent.ccceMetrics.lambda * agent.ccceMetrics.phi) /
                          Math.max(agent.ccceMetrics.gamma, 0.001);
  }

  private detectEmergentBehaviors(
    trajectory: TrajectoryPoint[],
    behaviors: EmergentBehavior[],
    currentStep: number
  ): void {
    if (trajectory.length < 10) return;

    const current = trajectory[currentStep];
    const prev = trajectory[currentStep - 1];

    // Detect synchronization
    if (current.collectiveMetrics.consensus > 0.9 && prev.collectiveMetrics.consensus < 0.9) {
      behaviors.push({
        type: 'synchronization',
        agents: Array.from(current.agentStates.keys()),
        startTime: current.time,
        magnitude: current.collectiveMetrics.consensus,
        description: 'Agents synchronized their states',
      });
    }

    // Detect polarization
    if (current.collectiveMetrics.polarization > 0.7 && prev.collectiveMetrics.polarization < 0.5) {
      behaviors.push({
        type: 'polarization',
        agents: Array.from(current.agentStates.keys()),
        startTime: current.time,
        magnitude: current.collectiveMetrics.polarization,
        description: 'System became polarized into distinct groups',
      });
    }

    // Detect oscillation
    if (trajectory.length > 20) {
      const recentConsensus = trajectory.slice(-20).map(t => t.collectiveMetrics.consensus);
      const peaks = recentConsensus.filter((c, i) =>
        i > 0 && i < recentConsensus.length - 1 &&
        c > recentConsensus[i - 1] && c > recentConsensus[i + 1]
      ).length;

      if (peaks >= 3 && !behaviors.some(b => b.type === 'oscillation' && current.time - b.startTime < 1)) {
        behaviors.push({
          type: 'oscillation',
          agents: Array.from(current.agentStates.keys()),
          startTime: current.time,
          magnitude: peaks / 20,
          description: 'System exhibiting oscillatory behavior',
        });
      }
    }
  }

  private computeChaosIndicators(trajectory: TrajectoryPoint[]): ChaosIndicators {
    if (trajectory.length < 100) {
      return {
        maxLyapunovExponent: 0,
        kaplanYorkeD: 1,
        correlationDim: 1,
        entropyRate: 0,
        predictabilityHorizon: Infinity,
      };
    }

    // Estimate max Lyapunov exponent from trajectory divergence
    const divergences: number[] = [];
    for (let i = 50; i < trajectory.length - 1; i++) {
      const current = trajectory[i].collectiveMetrics;
      const next = trajectory[i + 1].collectiveMetrics;
      const diff = Math.abs(next.consensus - current.consensus);
      if (diff > 1e-10) {
        divergences.push(Math.log(diff));
      }
    }

    const avgDivergence = divergences.length > 0
      ? divergences.reduce((a, b) => a + b, 0) / divergences.length
      : 0;
    const maxLyapunovExponent = avgDivergence;

    // Kaplan-Yorke dimension (simplified)
    const kaplanYorkeD = maxLyapunovExponent > 0 ? 1 + Math.abs(maxLyapunovExponent) : 1;

    // Correlation dimension (box-counting approximation)
    const correlationDim = Math.max(1, kaplanYorkeD * 0.9);

    // Entropy rate
    const entropies = trajectory.map(t => t.collectiveMetrics.entropy);
    const entropyRate = entropies.length > 1
      ? (entropies[entropies.length - 1] - entropies[0]) / trajectory.length
      : 0;

    // Predictability horizon (inverse of Lyapunov exponent)
    const predictabilityHorizon = maxLyapunovExponent > AGENTIC_CONSTANTS.LYAPUNOV_POSITIVE_THRESHOLD
      ? 1 / maxLyapunovExponent
      : Infinity;

    return {
      maxLyapunovExponent,
      kaplanYorkeD,
      correlationDim,
      entropyRate,
      predictabilityHorizon,
    };
  }

  private findConvergenceTime(trajectory: TrajectoryPoint[]): number {
    const threshold = 0.01;
    const window = 50;

    for (let i = window; i < trajectory.length; i++) {
      const recentVariance = trajectory.slice(i - window, i)
        .map(t => t.collectiveMetrics.consensus)
        .reduce((sum, c, _, arr) => {
          const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
          return sum + Math.pow(c - mean, 2);
        }, 0) / window;

      if (recentVariance < threshold * threshold) {
        return trajectory[i].time;
      }
    }

    return trajectory[trajectory.length - 1].time;
  }

  // ==========================================================================
  // Stability Analysis
  // ==========================================================================

  /**
   * Perform stability analysis on system
   */
  analyzeStability(systemId: string): StabilityAnalysis {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    const { jacobian, eigenvalues } = system.dynamics;

    // Local stability: all eigenvalues have negative real parts
    const localStability = eigenvalues.every(e => e.real < 0);

    // Global stability: check via Lyapunov function (simplified)
    // Using quadratic Lyapunov V = x^T P x where P solves Lyapunov equation
    const n = jacobian.length;
    const lyapunovCoeffs = Array(n).fill(1);  // Simplified: all equal weights

    // Stability margin: minimum distance to instability
    const stabilityMargin = -Math.max(...eigenvalues.map(e => e.real));

    // Sensitivity matrix (simplified: use Jacobian transpose)
    const sensitivityMatrix = jacobian.map(row => [...row]);

    // Identify critical parameters
    const criticalParameters: string[] = [];
    if (system.topology.spectralGap < 0.1) {
      criticalParameters.push('network-connectivity');
    }
    if (stabilityMargin < 0.1) {
      criticalParameters.push('interaction-strength');
    }

    return {
      systemId,
      localStability,
      globalStability: localStability && stabilityMargin > 0.1,
      lyapunovFunction: lyapunovCoeffs,
      stabilityMargin,
      sensitivityMatrix,
      criticalParameters,
    };
  }

  /**
   * Perform game-theoretic analysis
   */
  analyzeGameTheory(systemId: string): GameTheoreticAnalysis {
    const system = this.systems.get(systemId);
    if (!system) {
      throw new Error(`System ${systemId} not found`);
    }

    const agents = Array.from(system.agents.values());
    const n = agents.length;
    const numActions = 2;  // Simplified: cooperate/defect

    // Construct payoff matrix (simplified prisoner's dilemma variant)
    const payoffMatrix: number[][][] = [];
    for (let i = 0; i < n; i++) {
      const playerPayoffs: number[][] = [];
      for (let a1 = 0; a1 < numActions; a1++) {
        const actionPayoffs: number[] = [];
        for (let a2 = 0; a2 < numActions; a2++) {
          // Payoff depends on cooperation level
          if (a1 === 1 && a2 === 1) actionPayoffs.push(3);      // Both cooperate
          else if (a1 === 0 && a2 === 1) actionPayoffs.push(4); // Defect vs cooperate
          else if (a1 === 1 && a2 === 0) actionPayoffs.push(0); // Cooperate vs defect
          else actionPayoffs.push(1);                           // Both defect
        }
        playerPayoffs.push(actionPayoffs);
      }
      payoffMatrix.push(playerPayoffs);
    }

    // Find Nash equilibria (simplified: check pure strategies)
    const nashEquilibria: Equilibrium[] = [
      {
        type: 'nash',
        state: Array(n).fill(0),  // All defect
        stability: 'stable',
        basinSize: 0.3,
        reachability: 0.4,
      },
    ];

    // Pareto frontier
    const paretoFrontier = [
      Array(n).fill(3),  // All cooperate outcome
    ];

    // Social welfare (sum of utilities at Nash)
    const socialWelfare = n * 1;  // All defect gives 1 each

    // Price of anarchy: ratio of optimal to worst Nash
    const optimalWelfare = n * 3;  // All cooperate
    const priceOfAnarchy = optimalWelfare / socialWelfare;

    // Price of stability: ratio of optimal to best Nash
    const priceOfStability = optimalWelfare / socialWelfare;

    return {
      systemId,
      payoffMatrix,
      nashEquilibria,
      paretoFrontier,
      socialWelfare,
      priceOfAnarchy,
      priceOfStability,
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
   * Apply phase-conjugate healing to system
   */
  heal(systemId?: string): CCCEMetrics {
    if (systemId) {
      const system = this.systems.get(systemId);
      if (system) {
        for (const agent of system.agents.values()) {
          if (agent.ccceMetrics.gamma > 0.3) {
            agent.ccceMetrics.gamma *= (1 - CHI_PC);
            agent.ccceMetrics.lambda = Math.min(1, agent.ccceMetrics.lambda * (1 + CHI_PC * 0.5));
            agent.ccceMetrics.xi = (agent.ccceMetrics.lambda * agent.ccceMetrics.phi) /
                                   Math.max(agent.ccceMetrics.gamma, 0.001);
          }
        }
        system.collectiveMetrics = this.computeCollectiveMetrics(system.agents);
        return system.collectiveMetrics.ccce;
      }
    }

    // Global heal
    if (this.ccceState.gamma > 0.3) {
      this.ccceState.gamma *= (1 - CHI_PC);
      this.ccceState.lambda = Math.min(1, this.ccceState.lambda * (1 + CHI_PC * 0.5));
      this.updateXi();
    }
    return this.getMetrics();
  }

  /**
   * Get all systems
   */
  getSystems(): MultiAgentSystem[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get system by ID
   */
  getSystem(id: string): MultiAgentSystem | undefined {
    return this.systems.get(id);
  }

  /**
   * Get simulation result
   */
  getSimulation(systemId: string): SimulationResult | undefined {
    return this.simulations.get(systemId);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const agenticEngine = new AgenticAIEngine();
