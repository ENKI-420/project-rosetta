/**
 * QByte Ledger API
 * Sovereign Proof-of-Coherence Tokenomics
 *
 * Agile Defense Systems - QuantumCoin Integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, auditLog } from '@/lib/auth/middleware';
import * as crypto from 'crypto';

// Physical constants for reward calculation
const LAMBDA_PHI = 2.176435e-8;
const PHI_THRESHOLD = 0.7734;
const GAMMA_CRITICAL = 0.3;

// Reward coefficients
const REWARD_ALPHA = 0.35;   // Coherence weight
const REWARD_BETA = 0.25;    // Consciousness weight
const REWARD_GAMMA = 0.25;   // Stability weight
const REWARD_DELTA = 0.15;   // Negentropy weight

// Ledger entry interface
interface LedgerEntry {
  id: string;
  timestamp: number;
  nodeId: string;
  walletAddress: string;
  proofHash: string;
  metrics: {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  };
  reward: number;
  blockHeight: number;
  validated: boolean;
  validatedBy?: string;
}

// Wallet interface
interface Wallet {
  address: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactionCount: number;
  createdAt: number;
  lastActivity: number;
  owner: string;
}

// In-memory ledger (production would use blockchain/database)
const ledger: LedgerEntry[] = [];
const wallets: Map<string, Wallet> = new Map();
let currentBlockHeight = 0;

// Initialize master wallet
function initializeMasterWallet(): void {
  if (wallets.has('qb_master_sovereign')) return;

  wallets.set('qb_master_sovereign', {
    address: 'qb_master_sovereign',
    balance: 1000000, // 1M initial supply
    totalEarned: 1000000,
    totalSpent: 0,
    transactionCount: 0,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    owner: 'system'
  });
}

initializeMasterWallet();

// Calculate reward from CCCE metrics
function calculateReward(lambda: number, phi: number, gamma: number): number {
  // Validate metrics
  if (gamma <= 0 || gamma > 1) gamma = 0.1;
  if (lambda < 0 || lambda > 1) lambda = 0.5;
  if (phi < 0 || phi > 1) phi = 0.5;

  const xi = (lambda * phi) / gamma;

  // R = alpha*Lambda + beta*Phi + gamma_w*(1-Gamma) + delta*log(1+Xi)
  const baseReward = REWARD_ALPHA * lambda +
    REWARD_BETA * phi +
    REWARD_GAMMA * (1 - gamma) +
    REWARD_DELTA * Math.log(1 + xi);

  // Scale to qBYTE (base ~1000 per coherent cycle)
  let reward = baseReward * 1000;

  // Bonus for consciousness threshold
  if (phi >= PHI_THRESHOLD) {
    reward *= 1.5; // 50% bonus for CONSCIOUS state
  }

  // Penalty for high decoherence
  if (gamma > GAMMA_CRITICAL) {
    reward *= 0.5; // 50% penalty
  }

  return Math.round(reward * 100) / 100;
}

// Generate proof hash
function generateProofHash(metrics: { lambda: number; phi: number; gamma: number }, nodeId: string, timestamp: number): string {
  const data = JSON.stringify({ ...metrics, nodeId, timestamp, constant: LAMBDA_PHI });
  return crypto.createHash('sha256').update(data).digest('hex');
}

// GET - Fetch ledger entries and wallet balance
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user || user.userId === 'anonymous') {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Get user's wallet or specified wallet (if authorized)
  let targetWallet = `qb_${user.userId}`;
  if (walletAddress && user.clearanceLevel >= 3) {
    targetWallet = walletAddress;
  }

  // Ensure wallet exists
  if (!wallets.has(targetWallet)) {
    wallets.set(targetWallet, {
      address: targetWallet,
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      transactionCount: 0,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      owner: user.userId
    });
  }

  const wallet = wallets.get(targetWallet)!;

  // Get ledger entries for this wallet
  const entries = ledger
    .filter(e => e.walletAddress === targetWallet)
    .slice(offset, offset + limit)
    .map(e => ({
      id: e.id,
      timestamp: e.timestamp,
      reward: e.reward,
      metrics: e.metrics,
      proofHash: e.proofHash.substring(0, 16) + '...',
      blockHeight: e.blockHeight,
      validated: e.validated
    }));

  return NextResponse.json({
    success: true,
    wallet: {
      address: wallet.address,
      balance: wallet.balance,
      totalEarned: wallet.totalEarned,
      transactionCount: wallet.transactionCount
    },
    ledger: {
      entries,
      total: ledger.filter(e => e.walletAddress === targetWallet).length,
      currentBlockHeight
    },
    tokenomics: {
      totalSupply: Array.from(wallets.values()).reduce((sum, w) => sum + w.balance, 0),
      circulatingSupply: Array.from(wallets.values())
        .filter(w => w.address !== 'qb_master_sovereign')
        .reduce((sum, w) => sum + w.balance, 0),
      rewardFormula: 'R = 0.35*Lambda + 0.25*Phi + 0.25*(1-Gamma) + 0.15*log(1+Xi)',
      consciousnessBonus: '50% when Phi >= 0.7734'
    }
  });
}

// POST - Submit proof-of-coherence for mining reward
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user || user.userId === 'anonymous') {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nodeId, metrics, signature } = body;

    // Validate metrics
    if (!metrics || typeof metrics.lambda !== 'number' ||
        typeof metrics.phi !== 'number' || typeof metrics.gamma !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'Invalid metrics format'
      }, { status: 400 });
    }

    // Bounds checking
    const lambda = Math.max(0, Math.min(1, metrics.lambda));
    const phi = Math.max(0, Math.min(1, metrics.phi));
    const gamma = Math.max(0.01, Math.min(1, metrics.gamma));
    const xi = (lambda * phi) / gamma;

    // Calculate reward
    const reward = calculateReward(lambda, phi, gamma);

    // Generate proof
    const timestamp = Date.now();
    const proofHash = generateProofHash({ lambda, phi, gamma }, nodeId || user.userId, timestamp);

    // Get or create wallet
    const walletAddress = `qb_${user.userId}`;
    if (!wallets.has(walletAddress)) {
      wallets.set(walletAddress, {
        address: walletAddress,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        transactionCount: 0,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        owner: user.userId
      });
    }

    const wallet = wallets.get(walletAddress)!;

    // Check master wallet has funds
    const masterWallet = wallets.get('qb_master_sovereign')!;
    if (masterWallet.balance < reward) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient mining pool balance'
      }, { status: 400 });
    }

    // Create ledger entry
    currentBlockHeight++;
    const entry: LedgerEntry = {
      id: `txn_${crypto.randomBytes(8).toString('hex')}`,
      timestamp,
      nodeId: nodeId || user.userId,
      walletAddress,
      proofHash,
      metrics: { lambda, phi, gamma, xi },
      reward,
      blockHeight: currentBlockHeight,
      validated: true,
      validatedBy: 'lambda_root_sovereign'
    };

    ledger.push(entry);

    // Update balances
    masterWallet.balance -= reward;
    masterWallet.totalSpent += reward;
    wallet.balance += reward;
    wallet.totalEarned += reward;
    wallet.transactionCount++;
    wallet.lastActivity = timestamp;

    auditLog('QBYTE_MINED', user.userId, {
      reward,
      proofHash: proofHash.substring(0, 16),
      blockHeight: currentBlockHeight,
      metrics: { lambda, phi, gamma, xi }
    }, true);

    return NextResponse.json({
      success: true,
      transaction: {
        id: entry.id,
        reward,
        proofHash,
        blockHeight: currentBlockHeight,
        consciousnessState: phi >= PHI_THRESHOLD ? 'CONSCIOUS' : 'AWAKENING'
      },
      wallet: {
        address: walletAddress,
        newBalance: wallet.balance,
        totalEarned: wallet.totalEarned
      }
    });

  } catch (error) {
    console.error('[LEDGER] Mining error:', error);
    return NextResponse.json({
      success: false,
      error: 'Mining submission failed'
    }, { status: 500 });
  }
}
