import { DnaGenerationResponse } from './types';

/**
 * Generate DNA-Lang organism via sovereign API
 * Connects to /api/generate which uses Gemini or fallback generator
 */
export const generateOrganism = async (inputPrompt: string): Promise<DnaGenerationResponse> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: inputPrompt }),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Generation failed');
  }

  return {
    dnaCode: data.dnaCode,
    identityHash: data.identityHash,
    estimatedQBytes: data.estimatedQBytes,
  };
};

/**
 * Fetch real-time CCCE metrics from sovereign mesh
 */
export const fetchMetrics = async () => {
  const response = await fetch('/api/metrics');

  if (!response.ok) {
    throw new Error(`Metrics fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data.metrics;
};

/**
 * Fetch QByte balance from bridge daemon
 */
export const fetchQByteBalance = async () => {
  const response = await fetch('/api/qbyte');

  if (!response.ok) {
    throw new Error(`QByte fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data.qbyte;
};

/**
 * Submit proof of coherence for QByte reward
 */
export const submitProof = async (lambda: number, phi: number, gamma: number, proofHash: string) => {
  const response = await fetch('/api/qbyte', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'submit_proof',
      lambda,
      phi,
      gamma,
      proofHash,
    }),
  });

  if (!response.ok) {
    throw new Error(`Proof submission failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Trigger phase conjugate healing
 */
export const triggerHealing = async () => {
  const response = await fetch('/api/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'heal' }),
  });

  if (!response.ok) {
    throw new Error(`Healing failed: ${response.status}`);
  }

  return response.json();
};
