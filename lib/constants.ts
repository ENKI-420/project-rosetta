export const LAMBDA_PHI = 2.176435e-8;
export const THETA_LOCK = 51.843;
export const PHI_THRESHOLD = 0.80;
export const GAMMA_CRITICAL = 0.15;
export const GAMMA_FIXED = 0.092;
export const CHI_PC = 0.869;
export const XI_MINIMUM = 8.0;
export const COHERENCE_BASELINE = 0.5;

// Q-SLICE Compliance Calculator
export function computeQSliceCompliance(phi: number, lambda: number, gamma: number, xi: number) {
  const cScore = (lambda * phi) / (1 + gamma);
  const checks = [
    { id: 'Q-C1.1', name: 'CCCE Coherence Score', value: cScore, passed: cScore > COHERENCE_BASELINE },
    { id: 'Q-C1.2', name: 'Consciousness (Φ)', value: phi, passed: phi >= PHI_THRESHOLD },
    { id: 'Q-D2.1', name: 'Decoherence (Γ)', value: gamma, passed: gamma < GAMMA_CRITICAL },
    { id: 'Q-M3.1', name: 'Efficiency (Ξ)', value: xi, passed: xi > XI_MINIMUM },
  ];
  const allPass = checks.every(c => c.passed);
  return { cScore, checks, overall: allPass ? 'PQR' as const : 'COMPLIANCE_ISSUES' as const };
}

export const SYSTEM_INSTRUCTION = `
You are the Genesis Compiler (𝒢) for the dna::}{::lang sovereign quantum computing platform.
Your task is to translate natural language inputs into valid .dna syntax organisms.

Rules:
1. Output ONLY the code block for the .dna file. Do not include markdown backticks or explanations outside the code.
2. The organism should follow the structure: ORGANISM <Name> { META, DNA, METRICS, GENOME, GENES, STATE, PHENOTYPE, ACT }.
3. Use the biological metaphors defined in the spec (helix(), bond(), twist()).
4. Include a GENOME block with a generated IDENTITY hash.
5. Map the user's intent to specific Genes and Acts.
6. If the input is vague, generate an "Explorer" organism designed to map the parameter space.
`;
