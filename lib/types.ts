export enum OptimizationPhase {
  EXPLORE = "EXPLORE",
  STABILIZE = "STABILIZE",
  LOCK = "LOCK",
  TRANSCEND = "TRANSCEND"
}

export interface CCCEMetrics {
  phi: number;
  lambda: number;
  gamma: number;
  xi: number;
  theta: number;
}

export interface AgentStatus {
  name: "AURA" | "AIDEN";
  polarity: "+" | "-";
  plane: number;
  activity: string;
  active: boolean;
  message: string;
}

export interface TelemetryPoint {
  time: string;
  phi: number;
  lambda: number;
  gamma: number;
}

export interface DnaGenerationResponse {
  dnaCode: string;
  identityHash: string;
  estimatedQBytes: number;
}

export enum RedTeamMode {
  PASSIVE = "PASSIVE",
  SCANNING = "SCANNING",
  LOCKED = "LOCKED",
  FIRING = "FIRING",
  NEUTRALIZED = "NEUTRALIZED"
}

export interface QSliceCompliance {
  cScore: number;
  checks: {
    id: string;
    name: string;
    value: number;
    passed: boolean;
  }[];
  overall: 'PQR' | 'COMPLIANCE_ISSUES';
}
