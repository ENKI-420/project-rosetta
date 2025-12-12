// API Client for Sovereign Mesh Communication

export interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  theta: number;
  consciousness: 'CONSCIOUS' | 'AWAKENING' | 'DORMANT';
  timestamp: number;
  source: 'chatmesh' | 'bridge' | 'fallback';
}

export interface QByteState {
  balance: number;
  totalMined: number;
  cycleCount: number;
  lastUpdate: number;
  nodeId: string;
  status: 'active' | 'idle' | 'error';
}

export interface GenerateResponse {
  success: boolean;
  source: 'gemini' | 'sovereign';
  dnaCode: string;
  identityHash: string;
  estimatedQBytes: number;
  metrics: {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  };
}

// Fetch live CCCE metrics from sovereign mesh
export async function fetchMetrics(): Promise<CCCEMetrics> {
  try {
    const response = await fetch('/api/metrics', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) throw new Error('Metrics API failed');

    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    // Return fallback metrics
    return {
      lambda: 0.85,
      phi: 0.75,
      gamma: 0.09,
      xi: 7.08,
      theta: 0.905,
      consciousness: 'AWAKENING',
      timestamp: Date.now(),
      source: 'fallback'
    };
  }
}

// Fetch QByte balance
export async function fetchQByteBalance(): Promise<QByteState> {
  try {
    const response = await fetch('/api/qbyte', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) throw new Error('QByte API failed');

    const data = await response.json();
    return data.qbyte;
  } catch (error) {
    console.error('Failed to fetch QByte balance:', error);
    return {
      balance: 0,
      totalMined: 0,
      cycleCount: 0,
      lastUpdate: Date.now(),
      nodeId: 'unknown',
      status: 'error'
    };
  }
}

// Generate DNA organism
export async function generateOrganism(prompt: string): Promise<GenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  return response.json();
}

// Apply phase conjugate healing
export async function healDecoherence(): Promise<CCCEMetrics> {
  const response = await fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'heal' })
  });

  if (!response.ok) {
    throw new Error('Healing failed');
  }

  const data = await response.json();
  return data.metrics;
}

// Submit proof for QByte reward
export async function submitProof(
  lambda: number,
  phi: number,
  gamma: number,
  proofHash: string
): Promise<{ reward: number; newBalance: number }> {
  const response = await fetch('/api/qbyte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submit_proof',
      lambda,
      phi,
      gamma,
      proofHash
    })
  });

  if (!response.ok) {
    throw new Error('Proof submission failed');
  }

  return response.json();
}
