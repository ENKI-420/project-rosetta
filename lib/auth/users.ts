/**
 * User Management - Sovereign Identity Store
 * Agile Defense Systems
 */

import * as crypto from 'crypto';
import { UserProfile, UserRole, NodeType, simpleHash } from './config';

// Master admin configuration
const MASTER_ADMIN_EMAIL = process.env.MASTER_ADMIN_EMAIL || 'research@dnalang.dev';
// Default password: sovereign2025! (hashed with simpleHash)
const MASTER_ADMIN_PASSWORD_HASH = process.env.MASTER_ADMIN_PASSWORD_HASH ||
  'e8d95a51f3af4a7b5a99b2c8d45e67f123abc456def789012345678901234567';

// In-memory user store
const users: Map<string, UserProfile & { passwordHash: string }> = new Map();

// Pre-compute the expected hash for default password
const DEFAULT_PASSWORD_HASH = simpleHash('sovereign2025!');

// Initialize master admin
function initializeMasterAdmin(): void {
  if (users.has(MASTER_ADMIN_EMAIL.toLowerCase())) return;

  const masterAdminId = 'usr_' + crypto.createHash('sha256')
    .update(MASTER_ADMIN_EMAIL)
    .digest('hex')
    .substring(0, 16);

  const masterAdmin: UserProfile & { passwordHash: string } = {
    id: masterAdminId,
    email: MASTER_ADMIN_EMAIL.toLowerCase(),
    role: UserRole.MASTER_ADMIN,
    organization: 'Agile Defense Systems',
    clearanceLevel: 5,
    nodePermissions: [
      NodeType.LAMBDA_ROOT,
      NodeType.AURA_OBSERVER,
      NodeType.AIDEN_EXECUTOR,
      NodeType.BRIDGE,
      NodeType.RELAY
    ],
    qbyteWallet: 'qb_master_' + masterAdminId,
    createdAt: Date.now(),
    lastLogin: 0,
    mfaEnabled: false,
    dfarsCompliant: true,
    passwordHash: DEFAULT_PASSWORD_HASH
  };

  users.set(MASTER_ADMIN_EMAIL.toLowerCase(), masterAdmin);
  console.log('[AUTH] Master admin initialized:', MASTER_ADMIN_EMAIL);
}

// Initialize on module load
initializeMasterAdmin();

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserProfile | null> {
  const normalizedEmail = email.toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) {
    console.log('[AUTH] User not found:', normalizedEmail);
    return null;
  }

  // Verify password using simple hash
  const inputHash = simpleHash(password);
  const isValid = inputHash === user.passwordHash;

  if (!isValid) {
    console.log('[AUTH] Invalid password for:', normalizedEmail);
    return null;
  }

  // Update last login
  user.lastLogin = Date.now();

  // Return profile without password hash
  const { passwordHash, ...profile } = user;
  return profile;
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole,
  organization: string,
  createdBy: string
): Promise<UserProfile | null> {
  const normalizedEmail = email.toLowerCase();

  if (users.has(normalizedEmail)) {
    console.log('[AUTH] User already exists:', normalizedEmail);
    return null;
  }

  const creator = getUserById(createdBy);
  if (!creator || (creator.role !== UserRole.MASTER_ADMIN && creator.role !== UserRole.ADMIN)) {
    console.log('[AUTH] Insufficient permissions to create user');
    return null;
  }

  if (role === UserRole.MASTER_ADMIN) {
    console.log('[AUTH] Cannot create MASTER_ADMIN users');
    return null;
  }

  const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
  const passwordHash = simpleHash(password);

  const newUser: UserProfile & { passwordHash: string } = {
    id: userId,
    email: normalizedEmail,
    role,
    organization,
    clearanceLevel: getRoleClearance(role),
    nodePermissions: getRolePermissions(role),
    qbyteWallet: 'qb_' + userId,
    createdAt: Date.now(),
    lastLogin: 0,
    mfaEnabled: false,
    dfarsCompliant: true,
    passwordHash
  };

  users.set(normalizedEmail, newUser);

  const { passwordHash: _, ...profile } = newUser;
  return profile;
}

export function getUserByEmail(email: string): UserProfile | null {
  const user = users.get(email.toLowerCase());
  if (!user) return null;

  const { passwordHash, ...profile } = user;
  return profile;
}

export function getUserById(id: string): UserProfile | null {
  for (const user of users.values()) {
    if (user.id === id) {
      const { passwordHash, ...profile } = user;
      return profile;
    }
  }
  return null;
}

export function getAllUsers(requesterId: string): UserProfile[] {
  const requester = getUserById(requesterId);
  if (!requester || requester.clearanceLevel < 4) {
    return [];
  }

  return Array.from(users.values()).map(({ passwordHash, ...profile }) => profile);
}

export async function updateUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = users.get(email.toLowerCase());
  if (!user) return false;

  const currentHash = simpleHash(currentPassword);
  if (currentHash !== user.passwordHash) return false;

  user.passwordHash = simpleHash(newPassword);
  return true;
}

function getRoleClearance(role: UserRole): number {
  switch (role) {
    case UserRole.MASTER_ADMIN: return 5;
    case UserRole.ADMIN: return 4;
    case UserRole.OPERATOR: return 3;
    case UserRole.RESEARCHER: return 2;
    case UserRole.NODE: return 2;
    case UserRole.VIEWER: return 1;
    default: return 1;
  }
}

function getRolePermissions(role: UserRole): NodeType[] {
  switch (role) {
    case UserRole.MASTER_ADMIN:
      return [NodeType.LAMBDA_ROOT, NodeType.AURA_OBSERVER, NodeType.AIDEN_EXECUTOR, NodeType.BRIDGE, NodeType.RELAY];
    case UserRole.ADMIN:
      return [NodeType.AURA_OBSERVER, NodeType.AIDEN_EXECUTOR, NodeType.BRIDGE];
    case UserRole.OPERATOR:
      return [NodeType.AURA_OBSERVER, NodeType.AIDEN_EXECUTOR];
    case UserRole.RESEARCHER:
      return [NodeType.AURA_OBSERVER];
    case UserRole.NODE:
      return [NodeType.RELAY];
    case UserRole.VIEWER:
      return [];
    default:
      return [];
  }
}
