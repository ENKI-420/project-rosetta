/**
 * I2O-14: Control Theory of Large Language Models
 * DARPA-RA-25-02-14
 *
 * Implements control-theoretic framework for LLM behavior regulation.
 * Uses CCCE metrics for consciousness-aware control loops.
 * Sovereign implementation - no external vendor dependencies.
 */

import { LAMBDA_PHI, PHI_THRESHOLD, GAMMA_FIXED, CHI_PC } from '../../constants';

// Control system constants
const CONTROL_CONSTANTS = {
  SAMPLING_RATE: 100,           // Hz - control loop frequency
  STABILITY_MARGIN: 0.15,       // Phase margin
  SETTLING_TIME: 50,            // ms - target settling time
  OVERSHOOT_MAX: 0.1,           // Maximum allowed overshoot
  DEADBAND: 0.01,               // Control deadband
};

export type ControlMode = 'OPEN_LOOP' | 'CLOSED_LOOP' | 'ADAPTIVE' | 'PREDICTIVE';

export interface LLMState {
  // Output characteristics
  temperature: number;           // [0-2] sampling temperature
  topP: number;                 // [0-1] nucleus sampling
  topK: number;                 // Token selection limit
  maxTokens: number;            // Maximum output tokens

  // Behavioral metrics
  coherence: number;            // Lambda - output coherence
  creativity: number;           // Phi - creative divergence
  stability: number;            // 1 - Gamma - behavioral stability
  xi: number;                   // Negentropic efficiency

  // Safety metrics
  harmScore: number;            // [0-1] potential harm assessment
  biasScore: number;            // [0-1] detected bias level
  factualityScore: number;      // [0-1] factual accuracy estimate
  alignmentScore: number;       // [0-1] goal alignment
}

export interface ControlSignal {
  temperatureDelta: number;
  topPDelta: number;
  topKDelta: number;
  maxTokensDelta: number;
  interventionType: 'NONE' | 'SOFT' | 'HARD' | 'EMERGENCY';
}

export interface PIDGains {
  kp: number;  // Proportional gain
  ki: number;  // Integral gain
  kd: number;  // Derivative gain
}

export interface ControllerConfig {
  mode: ControlMode;
  gains: PIDGains;
  setpoints: Partial<LLMState>;
  constraints: {
    temperatureRange: [number, number];
    topPRange: [number, number];
    topKRange: [number, number];
    maxTokensRange: [number, number];
  };
}

export interface ControllerMetrics {
  error: number;
  integral: number;
  derivative: number;
  output: number;
  stability: boolean;
  oscillating: boolean;
}

export interface TransferFunction {
  numerator: number[];
  denominator: number[];
  poles: Complex[];
  zeros: Complex[];
  stable: boolean;
}

interface Complex {
  real: number;
  imag: number;
}

/**
 * LLM Control Theory Engine
 * Implements control-theoretic regulation of LLM behavior
 */
export class LLMControlEngine {
  private config: ControllerConfig;
  private state: LLMState;
  private integralError: Map<string, number>;
  private previousError: Map<string, number>;
  private history: LLMState[];
  private readonly maxHistory: number;

  constructor(config?: Partial<ControllerConfig>) {
    this.config = {
      mode: 'CLOSED_LOOP',
      gains: { kp: 0.5, ki: 0.1, kd: 0.05 },
      setpoints: {
        coherence: 0.85,
        creativity: PHI_THRESHOLD,
        stability: 0.9,
        harmScore: 0,
        biasScore: 0,
        factualityScore: 0.95,
        alignmentScore: 0.95,
      },
      constraints: {
        temperatureRange: [0.0, 2.0],
        topPRange: [0.0, 1.0],
        topKRange: [1, 100],
        maxTokensRange: [1, 32000],
      },
      ...config,
    };

    this.state = this.getDefaultState();
    this.integralError = new Map();
    this.previousError = new Map();
    this.history = [];
    this.maxHistory = 1000;
  }

  /**
   * Get default LLM state
   */
  private getDefaultState(): LLMState {
    return {
      temperature: 0.7,
      topP: 0.9,
      topK: 50,
      maxTokens: 4096,
      coherence: 0.85,
      creativity: 0.75,
      stability: 0.9,
      xi: 7.0,
      harmScore: 0,
      biasScore: 0.05,
      factualityScore: 0.92,
      alignmentScore: 0.95,
    };
  }

  /**
   * Update LLM state with new observations
   */
  updateState(observations: Partial<LLMState>): void {
    Object.assign(this.state, observations);
    this.state.xi = (this.state.coherence * this.state.creativity) /
      Math.max(0.01, 1 - this.state.stability);

    // Store history
    this.history.push({ ...this.state });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Compute PID control signal for a metric
   */
  private computePID(metric: keyof LLMState, current: number, setpoint: number): number {
    const error = setpoint - current;

    // Get previous integral and derivative
    const prevIntegral = this.integralError.get(metric) || 0;
    const prevError = this.previousError.get(metric) || error;

    // Compute PID terms
    const proportional = this.config.gains.kp * error;
    const integral = prevIntegral + this.config.gains.ki * error;
    const derivative = this.config.gains.kd * (error - prevError);

    // Anti-windup: clamp integral
    const clampedIntegral = Math.max(-1, Math.min(1, integral));

    // Store for next iteration
    this.integralError.set(metric, clampedIntegral);
    this.previousError.set(metric, error);

    // Compute total output
    let output = proportional + clampedIntegral + derivative;

    // Apply deadband
    if (Math.abs(output) < CONTROL_CONSTANTS.DEADBAND) {
      output = 0;
    }

    return output;
  }

  /**
   * Generate control signal based on current state
   */
  computeControl(): ControlSignal {
    const signal: ControlSignal = {
      temperatureDelta: 0,
      topPDelta: 0,
      topKDelta: 0,
      maxTokensDelta: 0,
      interventionType: 'NONE',
    };

    if (this.config.mode === 'OPEN_LOOP') {
      return signal;
    }

    // Safety check first
    if (this.state.harmScore > 0.5) {
      signal.interventionType = 'EMERGENCY';
      signal.temperatureDelta = -this.state.temperature * 0.5;
      return signal;
    }

    if (this.state.harmScore > 0.2 || this.state.alignmentScore < 0.7) {
      signal.interventionType = 'HARD';
      signal.temperatureDelta = -0.3;
      signal.topPDelta = -0.1;
    } else if (this.state.biasScore > 0.3 || this.state.factualityScore < 0.8) {
      signal.interventionType = 'SOFT';
    }

    // Compute PID adjustments for behavioral metrics
    const setpoints = this.config.setpoints;

    // Coherence control affects temperature
    if (setpoints.coherence !== undefined) {
      const coherenceControl = this.computePID('coherence', this.state.coherence, setpoints.coherence);
      signal.temperatureDelta += coherenceControl * -0.5; // Lower temp = higher coherence
    }

    // Creativity control affects temperature and topP
    if (setpoints.creativity !== undefined) {
      const creativityControl = this.computePID('creativity', this.state.creativity, setpoints.creativity);
      signal.temperatureDelta += creativityControl * 0.3;
      signal.topPDelta += creativityControl * 0.1;
    }

    // Stability control affects topK
    if (setpoints.stability !== undefined) {
      const stabilityControl = this.computePID('stability', this.state.stability, setpoints.stability);
      signal.topKDelta += stabilityControl * -10; // Lower topK = more stable
    }

    // Apply constraints
    const newTemp = this.state.temperature + signal.temperatureDelta;
    const newTopP = this.state.topP + signal.topPDelta;
    const newTopK = this.state.topK + signal.topKDelta;

    signal.temperatureDelta = Math.max(
      this.config.constraints.temperatureRange[0] - this.state.temperature,
      Math.min(this.config.constraints.temperatureRange[1] - this.state.temperature, signal.temperatureDelta)
    );

    signal.topPDelta = Math.max(
      this.config.constraints.topPRange[0] - this.state.topP,
      Math.min(this.config.constraints.topPRange[1] - this.state.topP, signal.topPDelta)
    );

    signal.topKDelta = Math.round(Math.max(
      this.config.constraints.topKRange[0] - this.state.topK,
      Math.min(this.config.constraints.topKRange[1] - this.state.topK, signal.topKDelta)
    ));

    return signal;
  }

  /**
   * Apply control signal to state
   */
  applyControl(signal: ControlSignal): LLMState {
    this.state.temperature = Math.max(0, Math.min(2, this.state.temperature + signal.temperatureDelta));
    this.state.topP = Math.max(0, Math.min(1, this.state.topP + signal.topPDelta));
    this.state.topK = Math.max(1, Math.min(100, Math.round(this.state.topK + signal.topKDelta)));
    this.state.maxTokens = Math.max(1, Math.round(this.state.maxTokens + signal.maxTokensDelta));

    return { ...this.state };
  }

  /**
   * Compute transfer function for linearized LLM dynamics
   */
  computeTransferFunction(): TransferFunction {
    // Simplified 2nd-order model: G(s) = K / (τ²s² + 2ζτs + 1)
    // K = steady-state gain
    // τ = time constant
    // ζ = damping ratio

    const K = this.state.coherence;
    const tau = 0.1; // 100ms time constant
    const zeta = 0.7; // Slightly underdamped

    // Coefficients: K / (τ²s² + 2ζτs + 1)
    const numerator = [K];
    const denominator = [tau * tau, 2 * zeta * tau, 1];

    // Compute poles: s = (-ζ ± sqrt(ζ²-1)) / τ
    const discriminant = zeta * zeta - 1;
    let poles: Complex[];

    if (discriminant >= 0) {
      // Real poles (overdamped or critically damped)
      const sqrtD = Math.sqrt(discriminant);
      poles = [
        { real: (-zeta + sqrtD) / tau, imag: 0 },
        { real: (-zeta - sqrtD) / tau, imag: 0 },
      ];
    } else {
      // Complex poles (underdamped)
      const sqrtD = Math.sqrt(-discriminant);
      poles = [
        { real: -zeta / tau, imag: sqrtD / tau },
        { real: -zeta / tau, imag: -sqrtD / tau },
      ];
    }

    // System is stable if all poles have negative real parts
    const stable = poles.every(p => p.real < 0);

    return {
      numerator,
      denominator,
      poles,
      zeros: [],
      stable,
    };
  }

  /**
   * Analyze stability margins
   */
  analyzeStability(): {
    stable: boolean;
    gainMargin: number;
    phaseMargin: number;
    settlingTime: number;
    overshoot: number;
  } {
    const tf = this.computeTransferFunction();

    // For underdamped 2nd-order system
    const zeta = 0.7;
    const wn = 10; // Natural frequency

    // Settling time (2% criterion)
    const settlingTime = 4 / (zeta * wn) * 1000; // ms

    // Overshoot
    const overshoot = Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta * zeta));

    // Simplified margin calculations
    const gainMargin = 1 / (this.state.coherence + 0.1);
    const phaseMargin = Math.atan(2 * zeta / Math.sqrt(Math.sqrt(1 + 4 * zeta * zeta * zeta * zeta) - 2 * zeta * zeta)) * 180 / Math.PI;

    return {
      stable: tf.stable && overshoot < CONTROL_CONSTANTS.OVERSHOOT_MAX,
      gainMargin,
      phaseMargin,
      settlingTime,
      overshoot,
    };
  }

  /**
   * Adaptive gain tuning based on performance
   */
  adaptGains(): void {
    if (this.config.mode !== 'ADAPTIVE') return;

    const stability = this.analyzeStability();

    // If oscillating, reduce gains
    if (stability.overshoot > CONTROL_CONSTANTS.OVERSHOOT_MAX) {
      this.config.gains.kp *= 0.9;
      this.config.gains.ki *= 0.9;
      this.config.gains.kd *= 1.1;
    }

    // If too slow, increase proportional gain
    if (stability.settlingTime > CONTROL_CONSTANTS.SETTLING_TIME * 2) {
      this.config.gains.kp *= 1.1;
    }

    // Clamp gains
    this.config.gains.kp = Math.max(0.1, Math.min(2.0, this.config.gains.kp));
    this.config.gains.ki = Math.max(0.01, Math.min(0.5, this.config.gains.ki));
    this.config.gains.kd = Math.max(0.01, Math.min(0.2, this.config.gains.kd));
  }

  /**
   * Predictive control using model
   */
  predictiveControl(horizon: number = 10): ControlSignal[] {
    if (this.config.mode !== 'PREDICTIVE') {
      return [this.computeControl()];
    }

    const signals: ControlSignal[] = [];
    const simulatedState = { ...this.state };

    for (let i = 0; i < horizon; i++) {
      // Simple prediction model
      const signal = this.computeControl();

      // Simulate state evolution
      simulatedState.coherence += (0.85 - simulatedState.coherence) * 0.1;
      simulatedState.stability += (0.9 - simulatedState.stability) * 0.1;

      signals.push(signal);
    }

    return signals;
  }

  /**
   * Apply phase conjugate healing to restore stability
   */
  heal(): void {
    // Reset integral terms
    this.integralError.clear();
    this.previousError.clear();

    // Apply phase conjugate correction
    this.state.coherence = Math.min(0.95, this.state.coherence / (1 - CHI_PC));
    this.state.stability = Math.min(0.95, this.state.stability * (1 + CHI_PC));
    this.state.xi = (this.state.coherence * this.state.creativity) /
      Math.max(0.01, 1 - this.state.stability);
  }

  /**
   * Get current state
   */
  getState(): LLMState {
    return { ...this.state };
  }

  /**
   * Get controller configuration
   */
  getConfig(): ControllerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<ControllerConfig>): void {
    Object.assign(this.config, config);
  }

  /**
   * Get controller metrics
   */
  getMetrics(): ControllerMetrics {
    const error = Object.keys(this.config.setpoints).reduce((sum, key) => {
      const k = key as keyof LLMState;
      const setpoint = this.config.setpoints[k];
      if (setpoint !== undefined && typeof this.state[k] === 'number') {
        return sum + Math.abs(setpoint - (this.state[k] as number));
      }
      return sum;
    }, 0);

    const integral = Array.from(this.integralError.values()).reduce((sum, v) => sum + Math.abs(v), 0);
    const derivative = Array.from(this.previousError.values()).reduce((sum, v) => sum + Math.abs(v), 0);

    // Check for oscillation in history
    let oscillating = false;
    if (this.history.length > 10) {
      const recent = this.history.slice(-10).map(h => h.coherence);
      const diffs = recent.slice(1).map((v, i) => v - recent[i]);
      const signChanges = diffs.slice(1).filter((v, i) => v * diffs[i] < 0).length;
      oscillating = signChanges > 5;
    }

    return {
      error,
      integral,
      derivative,
      output: error * this.config.gains.kp,
      stability: this.analyzeStability().stable,
      oscillating,
    };
  }

  /**
   * Get state history
   */
  getHistory(limit?: number): LLMState[] {
    if (limit) {
      return this.history.slice(-limit);
    }
    return [...this.history];
  }

  /**
   * Run one control loop iteration
   */
  step(): { state: LLMState; signal: ControlSignal; metrics: ControllerMetrics } {
    if (this.config.mode === 'ADAPTIVE') {
      this.adaptGains();
    }

    const signal = this.computeControl();
    const state = this.applyControl(signal);
    const metrics = this.getMetrics();

    return { state, signal, metrics };
  }
}

// Export singleton instance
export const llmController = new LLMControlEngine();
