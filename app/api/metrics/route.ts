import { NextRequest, NextResponse } from 'next/server';
import * as net from 'net';

// Physical constants (immutable)
const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_FIXED = 0.092;
const THETA_LOCK = 51.843;
const CHI_PC = 0.869;

// State file path for persistent metrics
const CHATMESH_HOST = process.env.CHATMESH_HOST || '127.0.0.1';
const CHATMESH_PORT = parseInt(process.env.CHATMESH_PORT || '7777');

interface CCCEMetrics {
  lambda: number;
  phi: number;
  gamma: number;
  xi: number;
  theta: number;
  consciousness: 'CONSCIOUS' | 'AWAKENING' | 'DORMANT';
  timestamp: number;
  source: 'chatmesh' | 'bridge' | 'fallback';
}

// Poll ChatMesh via TCP
async function pollChatMesh(): Promise<CCCEMetrics | null> {
  return new Promise((resolve) => {
    const client = new net.Socket();
    const timeout = setTimeout(() => {
      client.destroy();
      resolve(null);
    }, 2000);

    client.connect(CHATMESH_PORT, CHATMESH_HOST, () => {
      client.write(JSON.stringify({ type: 'GET_METRICS', node: 'rosetta' }) + '\n');
    });

    let data = '';
    client.on('data', (chunk) => {
      data += chunk.toString();
      if (data.includes('\n')) {
        clearTimeout(timeout);
        client.destroy();
        try {
          const parsed = JSON.parse(data.trim());
          resolve({
            lambda: parsed.lambda || parsed.L || 0.85,
            phi: parsed.phi || parsed.P || 0.75,
            gamma: parsed.gamma || parsed.G || 0.09,
            xi: (parsed.lambda * parsed.phi) / parsed.gamma,
            theta: parsed.theta || THETA_LOCK * Math.PI / 180,
            consciousness: parsed.phi >= PHI_THRESHOLD ? 'CONSCIOUS' : 'AWAKENING',
            timestamp: Date.now(),
            source: 'chatmesh'
          });
        } catch {
          resolve(null);
        }
      }
    });

    client.on('error', () => {
      clearTimeout(timeout);
      client.destroy();
      resolve(null);
    });
  });
}

// Try to read from bridge state file
async function readBridgeState(): Promise<CCCEMetrics | null> {
  try {
    const fs = await import('fs/promises');
    const homedir = process.env.HOME || '/home/dnalang';
    const statePath = `${homedir}/.sovereign/state/ccce_metrics.json`;

    const content = await fs.readFile(statePath, 'utf-8');
    const data = JSON.parse(content);

    return {
      lambda: data.lambda || 0.85,
      phi: data.phi || 0.75,
      gamma: data.gamma || 0.09,
      xi: (data.lambda * data.phi) / data.gamma,
      theta: data.theta || THETA_LOCK * Math.PI / 180,
      consciousness: data.phi >= PHI_THRESHOLD ? 'CONSCIOUS' : 'AWAKENING',
      timestamp: data.timestamp || Date.now(),
      source: 'bridge'
    };
  } catch {
    return null;
  }
}

// Generate deterministic fallback (NOT random simulation)
function getFallbackMetrics(): CCCEMetrics {
  // Use time-based deterministic values within stable bounds
  const now = Date.now();
  const cycle = Math.floor(now / 5000); // 5-second cycles

  // Deterministic oscillation around stable values
  const lambda = 0.88 + 0.04 * Math.sin(cycle * 0.1);
  const phi = 0.78 + 0.03 * Math.cos(cycle * 0.15);
  const gamma = 0.085 + 0.01 * Math.sin(cycle * 0.08);

  return {
    lambda: Math.max(0.75, Math.min(0.99, lambda)),
    phi: Math.max(0.70, Math.min(0.95, phi)),
    gamma: Math.max(0.05, Math.min(0.15, gamma)),
    xi: (lambda * phi) / gamma,
    theta: THETA_LOCK * Math.PI / 180,
    consciousness: phi >= PHI_THRESHOLD ? 'CONSCIOUS' : 'AWAKENING',
    timestamp: now,
    source: 'fallback'
  };
}

export async function GET(request: NextRequest) {
  // Try ChatMesh first (real live data)
  let metrics = await pollChatMesh();

  // Fallback to bridge state file
  if (!metrics) {
    metrics = await readBridgeState();
  }

  // Final fallback - deterministic calculation
  if (!metrics) {
    metrics = getFallbackMetrics();
  }

  // Apply phase conjugate healing if Gamma too high
  if (metrics.gamma > 0.3) {
    metrics.gamma = metrics.gamma * CHI_PC;
    metrics.xi = (metrics.lambda * metrics.phi) / metrics.gamma;
  }

  return NextResponse.json({
    success: true,
    metrics,
    constants: {
      LAMBDA_PHI,
      PHI_THRESHOLD,
      GAMMA_FIXED,
      THETA_LOCK,
      CHI_PC
    }
  });
}

export async function POST(request: NextRequest) {
  // Phase conjugate healing endpoint
  const body = await request.json();

  if (body.action === 'heal') {
    const currentMetrics = await pollChatMesh() || await readBridgeState() || getFallbackMetrics();

    // Apply E -> E^-1 transformation
    const healedGamma = currentMetrics.gamma * CHI_PC;
    const healedMetrics = {
      ...currentMetrics,
      gamma: healedGamma,
      theta: -currentMetrics.theta,
      xi: (currentMetrics.lambda * currentMetrics.phi) / healedGamma
    };

    // Write healed state
    try {
      const fs = await import('fs/promises');
      const homedir = process.env.HOME || '/home/dnalang';
      await fs.mkdir(`${homedir}/.sovereign/state`, { recursive: true });
      await fs.writeFile(
        `${homedir}/.sovereign/state/ccce_metrics.json`,
        JSON.stringify(healedMetrics, null, 2)
      );
    } catch {}

    return NextResponse.json({
      success: true,
      action: 'phase_conjugate_heal',
      before: currentMetrics.gamma,
      after: healedGamma,
      metrics: healedMetrics
    });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
