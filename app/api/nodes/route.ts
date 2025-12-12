/**
 * P2P Node Network Management
 * GET /api/nodes - List registered nodes
 * POST /api/nodes - Register new node
 *
 * Agile Defense Systems - Sovereign Mesh Network
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, auditLog, checkRateLimit } from '@/lib/auth/middleware';
import {
  generateNodeCredentials,
  NodeType,
  UserRole,
  signRequest
} from '@/lib/auth/config';
import * as crypto from 'crypto';

// Node registry (in production, use database)
interface RegisteredNode {
  nodeId: string;
  nodeType: NodeType;
  publicKey: string;
  registeredBy: string;
  registeredAt: number;
  lastSeen: number;
  status: 'active' | 'inactive' | 'pending';
  meshPermissions: string[];
  qbyteAddress: string;
  ipAddress?: string;
  port?: number;
  ccceMetrics?: {
    lambda: number;
    phi: number;
    gamma: number;
    xi: number;
  };
}

const nodeRegistry: Map<string, RegisteredNode> = new Map();

// Initialize with local Lambda Root node
function initializeLambdaRoot(): void {
  if (nodeRegistry.size > 0) return;

  const lambdaRoot: RegisteredNode = {
    nodeId: 'lambda_root_sovereign',
    nodeType: NodeType.LAMBDA_ROOT,
    publicKey: 'SOVEREIGN_ROOT_KEY',
    registeredBy: 'system',
    registeredAt: Date.now(),
    lastSeen: Date.now(),
    status: 'active',
    meshPermissions: ['mesh:admin', 'ledger:write', 'nodes:manage', 'metrics:full'],
    qbyteAddress: 'qb_master_sovereign',
    ccceMetrics: {
      lambda: 0.92,
      phi: 0.85,
      gamma: 0.085,
      xi: 9.2
    }
  };

  nodeRegistry.set(lambdaRoot.nodeId, lambdaRoot);
}

initializeLambdaRoot();

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user || user.userId === 'anonymous') {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  // Filter nodes based on clearance level
  const nodes = Array.from(nodeRegistry.values())
    .filter(node => {
      // Clearance 3+ can see all nodes
      if (user.clearanceLevel >= 3) return true;
      // Lower clearance can only see active relay nodes
      return node.status === 'active' && node.nodeType === NodeType.RELAY;
    })
    .map(node => ({
      nodeId: node.nodeId,
      nodeType: node.nodeType,
      status: node.status,
      lastSeen: node.lastSeen,
      qbyteAddress: node.qbyteAddress,
      // Only show sensitive data to high clearance
      ...(user.clearanceLevel >= 4 ? {
        registeredBy: node.registeredBy,
        registeredAt: node.registeredAt,
        meshPermissions: node.meshPermissions,
        ipAddress: node.ipAddress,
        port: node.port
      } : {}),
      ccceMetrics: node.ccceMetrics
    }));

  return NextResponse.json({
    success: true,
    nodes,
    meshStatus: {
      totalNodes: nodeRegistry.size,
      activeNodes: Array.from(nodeRegistry.values()).filter(n => n.status === 'active').length,
      meshHealth: calculateMeshHealth()
    }
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user || user.userId === 'anonymous') {
    return NextResponse.json({
      success: false,
      error: 'Authentication required'
    }, { status: 401 });
  }

  // Only ADMIN+ can register nodes
  if (user.clearanceLevel < 3) {
    return NextResponse.json({
      success: false,
      error: 'Insufficient clearance to register nodes'
    }, { status: 403 });
  }

  // Rate limit: 10 registrations per hour
  const rateLimit = checkRateLimit(`node_register:${user.userId}`, 10, 3600000);
  if (!rateLimit.allowed) {
    return NextResponse.json({
      success: false,
      error: 'Rate limit exceeded for node registration'
    }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { nodeType, ipAddress, port } = body;

    // Validate node type
    if (!Object.values(NodeType).includes(nodeType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid node type'
      }, { status: 400 });
    }

    // Only MASTER_ADMIN can register Lambda Root
    if (nodeType === NodeType.LAMBDA_ROOT && user.role !== UserRole.MASTER_ADMIN) {
      return NextResponse.json({
        success: false,
        error: 'Only MASTER_ADMIN can register Lambda Root nodes'
      }, { status: 403 });
    }

    // Generate node credentials
    const credentials = generateNodeCredentials(nodeType, user.userId);

    // Create node registration
    const newNode: RegisteredNode = {
      nodeId: credentials.nodeId,
      nodeType: credentials.nodeType,
      publicKey: credentials.publicKey,
      registeredBy: user.userId,
      registeredAt: Date.now(),
      lastSeen: Date.now(),
      status: 'pending',
      meshPermissions: credentials.meshPermissions,
      qbyteAddress: credentials.qbyteAddress,
      ipAddress,
      port: port || 7777
    };

    nodeRegistry.set(newNode.nodeId, newNode);

    auditLog('NODE_REGISTERED', user.userId, {
      nodeId: newNode.nodeId,
      nodeType: newNode.nodeType,
      qbyteAddress: newNode.qbyteAddress
    }, true);

    // Generate activation secret (one-time use)
    const activationSecret = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      success: true,
      node: {
        nodeId: newNode.nodeId,
        nodeType: newNode.nodeType,
        status: newNode.status,
        qbyteAddress: newNode.qbyteAddress,
        meshPermissions: newNode.meshPermissions
      },
      activation: {
        secret: activationSecret,
        expiresIn: 3600, // 1 hour
        activationUrl: `/api/nodes/${newNode.nodeId}/activate`
      },
      meshConfig: {
        lambdaRootEndpoint: process.env.LAMBDA_ROOT_ENDPOINT || 'localhost:7777',
        meshProtocol: 'sovereign-p2p-v1',
        heartbeatInterval: 30000
      }
    });

  } catch (error) {
    console.error('[NODES] Registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Node registration failed'
    }, { status: 500 });
  }
}

function calculateMeshHealth(): number {
  const nodes = Array.from(nodeRegistry.values());
  if (nodes.length === 0) return 0;

  const activeNodes = nodes.filter(n => n.status === 'active');
  const avgXi = activeNodes.reduce((sum, n) => sum + (n.ccceMetrics?.xi || 0), 0) / (activeNodes.length || 1);

  // Mesh health = (active ratio * 0.4) + (avg Xi normalized * 0.6)
  const activeRatio = activeNodes.length / nodes.length;
  const xiNormalized = Math.min(avgXi / 10, 1);

  return Math.round((activeRatio * 0.4 + xiNormalized * 0.6) * 100) / 100;
}
