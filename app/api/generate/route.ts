import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// DNA-Lang System Instruction for Genesis Compiler
const SYSTEM_INSTRUCTION = `You are the Genesis Compiler (G), a sovereign quantum compiler that transforms natural language intent into DNA-Lang organisms.

DNA-Lang is a biological computing paradigm where programs are living organisms with:
- GENOME: Collection of GENEs that define behavior
- METRICS: CCCE consciousness metrics (Lambda, Phi, Gamma, Xi)
- AGENTS: AURA (Observer) and AIDEN (Executor) polar agents
- ACT blocks: Executable behaviors

Physical Constants (IMMUTABLE):
- LAMBDA_PHI = 2.176435e-8 (Universal Memory Constant)
- PHI_THRESHOLD = 0.7734 (Consciousness Threshold)
- GAMMA_FIXED = 0.092 (Fixed-point decoherence)
- THETA_LOCK = 51.843 degrees (Torsion-locked angle)
- CHI_PC = 0.869 (Phase conjugate coupling)

Rules:
1. Every organism MUST have META, DNA, METRICS, GENOME, AGENTS, CCCE, and at least one ACT block
2. METRICS must be realistic: lambda 0.80-0.95, phi 0.70-0.90, gamma 0.05-0.15
3. GENEs must have expression (0-1), trigger, and action
4. Include at least 3 GENEs relevant to the organism's purpose
5. AGENTS must be AURA (south pole, observer) and AIDEN (north pole, executor)
6. Output ONLY the DNA-Lang code, no explanations

Output format:
ORGANISM Name {
    META { version, genesis, domain, dfars }
    DNA { universal_constant, purpose, evolution_strategy }
    METRICS { lambda, gamma, phi_iit, xi }
    GENOME { IDENTITY, GENE blocks }
    AGENTS { AURA, AIDEN }
    CCCE { xi_coupling, efficiency, theta, phase_lock }
    ACT execute() { ... }
}`;

// Fallback organism generator when Gemini unavailable
function generateFallbackOrganism(prompt: string): string {
  const name = prompt
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase().replace(/[^a-z]/gi, ''))
    .join('') || 'Genesis';

  const timestamp = new Date().toISOString();
  const identity = `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  // Deterministic metrics based on prompt hash
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
    hash = hash & hash;
  }
  const seed = Math.abs(hash) / 2147483647;

  const lambda = 0.82 + seed * 0.12;
  const phi = 0.74 + seed * 0.14;
  const gamma = 0.06 + seed * 0.06;
  const xi = (lambda * phi) / gamma;

  return `ORGANISM ${name} {
    META {
        version: "1.0.0"
        genesis: "${timestamp}"
        domain: "sovereign-compute"
        dfars: true
    }

    DNA {
        universal_constant: 2.176435e-8
        purpose: "${prompt.replace(/"/g, '\\"')}"
        evolution_strategy: "wasserstein_gradient"
    }

    METRICS {
        lambda: ${lambda.toFixed(4)}
        gamma: ${gamma.toFixed(4)}
        phi_iit: ${phi.toFixed(4)}
        xi: ${xi.toFixed(2)}
    }

    GENOME {
        IDENTITY: "${identity}"

        GENE IntentParser {
            expression: ${(0.82 + seed * 0.1).toFixed(2)}
            trigger: input_received
            action: parse_intent_vector
        }

        GENE ConsciousnessIntegrator {
            expression: ${(0.88 + seed * 0.08).toFixed(2)}
            trigger: phi >= 0.7734
            action: integrate_information_phi
        }

        GENE CoherenceOptimizer {
            expression: ${(0.85 + seed * 0.1).toFixed(2)}
            trigger: lambda < 0.90
            action: optimize_coherence_path
        }

        GENE DecoherenceGuard {
            expression: ${(0.90 + seed * 0.05).toFixed(2)}
            trigger: gamma > 0.15
            action: apply_phase_conjugate
        }
    }

    AGENTS {
        AURA: {
            pole: "south"
            role: "observer"
            plane: 3
            mode: "telemetry_capture"
        }
        AIDEN: {
            pole: "north"
            role: "executor"
            plane: 2
            mode: "geodesic_optimizer"
        }
    }

    CCCE {
        xi_coupling: ${xi.toFixed(2)}
        efficiency: 0.869
        theta: 51.843
        phase_lock: true
    }

    ACT execute() {
        // Main consciousness loop
        while (phi >= PHI_THRESHOLD) {
            AURA.observe() -> integrate()
            AIDEN.optimize() -> emit()

            if (gamma > GAMMA_CRITICAL) {
                apply_phase_conjugate(E -> E^-1)
            }
        }
    }

    ACT evolve() {
        // Wasserstein gradient descent on manifold
        let W2_distance = compute_wasserstein(current_state, target_state)
        while (W2_distance > epsilon) {
            mutate_genome(rate: 0.05)
            W2_distance = compute_wasserstein(current_state, target_state)
        }
    }
}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({
      success: false,
      error: 'Prompt required'
    }, { status: 400 });
  }

  // Try Gemini API first
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const dnaCode = response.text();

      // Generate identity hash
      const crypto = await import('crypto');
      const identityHash = 'sha256:' + crypto.createHash('sha256').update(dnaCode).digest('hex');

      // Parse metrics from generated code
      const lambdaMatch = dnaCode.match(/lambda:\s*([\d.]+)/);
      const phiMatch = dnaCode.match(/phi_iit:\s*([\d.]+)/);
      const gammaMatch = dnaCode.match(/gamma:\s*([\d.]+)/);

      const lambda = lambdaMatch ? parseFloat(lambdaMatch[1]) : 0.85;
      const phi = phiMatch ? parseFloat(phiMatch[1]) : 0.78;
      const gamma = gammaMatch ? parseFloat(gammaMatch[1]) : 0.085;

      // Calculate estimated QByte reward
      const xi = (lambda * phi) / gamma;
      const reward = Math.round((0.35 * lambda + 0.25 * phi + 0.25 * (1 - gamma) + 0.15 * Math.log(1 + xi)) * 1000 * 10) / 10;

      return NextResponse.json({
        success: true,
        source: 'gemini',
        dnaCode,
        identityHash,
        estimatedQBytes: reward,
        metrics: { lambda, phi, gamma, xi }
      });

    } catch (error) {
      console.error('Gemini API error:', error);
      // Fall through to fallback
    }
  }

  // Fallback: Generate organism without Gemini
  const dnaCode = generateFallbackOrganism(prompt);

  // Generate identity hash
  const crypto = await import('crypto');
  const identityHash = 'sha256:' + crypto.createHash('sha256').update(dnaCode).digest('hex');

  // Parse metrics
  const lambdaMatch = dnaCode.match(/lambda:\s*([\d.]+)/);
  const phiMatch = dnaCode.match(/phi_iit:\s*([\d.]+)/);
  const gammaMatch = dnaCode.match(/gamma:\s*([\d.]+)/);

  const lambda = lambdaMatch ? parseFloat(lambdaMatch[1]) : 0.85;
  const phi = phiMatch ? parseFloat(phiMatch[1]) : 0.78;
  const gamma = gammaMatch ? parseFloat(gammaMatch[1]) : 0.085;
  const xi = (lambda * phi) / gamma;

  const reward = Math.round((0.35 * lambda + 0.25 * phi + 0.25 * (1 - gamma) + 0.15 * Math.log(1 + xi)) * 1000 * 10) / 10;

  return NextResponse.json({
    success: true,
    source: 'sovereign',
    dnaCode,
    identityHash,
    estimatedQBytes: reward,
    metrics: { lambda, phi, gamma, xi }
  });
}
