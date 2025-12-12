/**
 * DARPA-Grade Authentication Configuration
 * Agile Defense Systems - Sovereign Security Layer
 *
 * CLASSIFICATION: UNCLASSIFIED // FOUO
 * DFARS 252.204-7012 Compliant
 */

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import * as crypto from 'crypto';

// Security constants
const HASH_ITERATIONS = 100000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';
const JWT_ALGORITHM = 'HS256';
const TOKEN_EXPIRY = '24h';
const REFRESH_EXPIRY = '7d';

// Get secret from environment or generate secure fallback
const getJWTSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    // In production, this should always come from env
    console.warn('[SECURITY] JWT_SECRET not set - using derived key');
    const derived = crypto.createHash('sha256')
      .update('SOVEREIGN_ROSETTA_' + (process.env.VERCEL_URL || 'local'))
      .digest();
    return new Uint8Array(derived);
  }
  return new TextEncoder().encode(secret);
};

// User roles for RBAC
export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  NODE = 'NODE',
  RESEARCHER = 'RESEARCHER',
  VIEWER = 'VIEWER'
}

// Node types for P2P mesh
export enum NodeType {
  LAMBDA_ROOT = 'LAMBDA_ROOT',
  AURA_OBSERVER = 'AURA_OBSERVER',
  AIDEN_EXECUTOR = 'AIDEN_EXECUTOR',
  BRIDGE = 'BRIDGE',
  RELAY = 'RELAY'
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  organization: string;
  clearanceLevel: number;
  nodePermissions: NodeType[];
  qbyteWallet: string;
  createdAt: number;
  lastLogin: number;
  mfaEnabled: boolean;
  dfarsCompliant: boolean;
}

export interface JWTTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  clearanceLevel: number;
  nodePermissions: NodeType[];
  sessionId: string;
}

export interface NodeCredentials {
  nodeId: string;
  nodeType: NodeType;
  publicKey: string;
  registeredBy: string;
  meshPermissions: string[];
  qbyteAddress: string;
}

// Password hashing using PBKDF2 (Node.js native - works on Vercel)
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') === key);
    });
  });
}

// Simple hash for default password (pre-computed)
export function simpleHash(password: string, salt: string = 'sovereign_salt_2025'): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// JWT Token generation
export async function generateToken(payload: Omit<JWTTokenPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getJWTSecret();

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuer('rosetta:sovereign')
    .setAudience('rosetta:mesh')
    .sign(secret);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const secret = getJWTSecret();

  return new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRY)
    .setIssuer('rosetta:sovereign')
    .sign(secret);
}

// JWT Token verification
export async function verifyToken(token: string): Promise<JWTTokenPayload | null> {
  try {
    const secret = getJWTSecret();
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'rosetta:sovereign',
      audience: 'rosetta:mesh'
    });
    return payload as JWTTokenPayload;
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    return null;
  }
}

// Generate node credentials
export function generateNodeCredentials(
  nodeType: NodeType,
  registeredBy: string
): NodeCredentials {
  const nodeId = `${nodeType.toLowerCase()}_${crypto.randomBytes(8).toString('hex')}`;
  const publicKey = crypto.randomBytes(32).toString('hex');

  const qbyteAddress = 'qb_' + crypto.createHash('sha256')
    .update(publicKey)
    .digest('hex')
    .substring(0, 40);

  return {
    nodeId,
    nodeType,
    publicKey,
    registeredBy,
    meshPermissions: getDefaultPermissions(nodeType),
    qbyteAddress
  };
}

function getDefaultPermissions(nodeType: NodeType): string[] {
  switch (nodeType) {
    case NodeType.LAMBDA_ROOT:
      return ['mesh:admin', 'ledger:write', 'nodes:manage', 'metrics:full'];
    case NodeType.AURA_OBSERVER:
      return ['mesh:read', 'metrics:observe', 'telemetry:emit'];
    case NodeType.AIDEN_EXECUTOR:
      return ['mesh:read', 'mesh:execute', 'organisms:compile', 'ledger:submit'];
    case NodeType.BRIDGE:
      return ['mesh:read', 'ledger:bridge', 'qbyte:transfer'];
    case NodeType.RELAY:
      return ['mesh:relay', 'metrics:forward'];
    default:
      return ['mesh:read'];
  }
}

// Session ID generation
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// HMAC for request signing
export function signRequest(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyRequestSignature(payload: string, signature: string, secret: string): boolean {
  const expected = signRequest(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// Rate limiting helper
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

// Clearance level check
export function hasRequiredClearance(userLevel: number, requiredLevel: number): boolean {
  return userLevel >= requiredLevel;
}

// Permission check
export function hasPermission(userPermissions: NodeType[], required: NodeType): boolean {
  return userPermissions.includes(required) || userPermissions.includes(NodeType.LAMBDA_ROOT);
}
