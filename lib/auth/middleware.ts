/**
 * Authentication Middleware
 * DARPA-Grade Request Validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTTokenPayload, UserRole } from './config';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTTokenPayload;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/health',
  '/login',
  '/'
];

// Routes requiring specific clearance levels
const CLEARANCE_REQUIREMENTS: Record<string, number> = {
  '/api/nodes/register': 4,
  '/api/nodes/manage': 4,
  '/api/users': 4,
  '/api/ledger/admin': 5,
  '/api/auth/create-user': 4
};

// Routes requiring specific roles
const ROLE_REQUIREMENTS: Record<string, UserRole[]> = {
  '/api/ledger/admin': [UserRole.MASTER_ADMIN],
  '/api/nodes/manage': [UserRole.MASTER_ADMIN, UserRole.ADMIN],
  '/api/auth/create-user': [UserRole.MASTER_ADMIN, UserRole.ADMIN]
};

export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: true; user: JWTTokenPayload } | { success: false; error: string; status: number }> {
  const path = new URL(request.url).pathname;

  // Check if route is public
  if (PUBLIC_ROUTES.some(route => path === route || path.startsWith(route + '/'))) {
    // Return a minimal user for public routes
    return {
      success: true,
      user: {
        userId: 'anonymous',
        email: 'anonymous',
        role: UserRole.VIEWER,
        clearanceLevel: 0,
        nodePermissions: [],
        sessionId: 'public'
      }
    };
  }

  // Extract token from Authorization header or cookie
  const authHeader = request.headers.get('Authorization');
  const cookieToken = request.cookies.get('auth_token')?.value;

  const token = authHeader?.replace('Bearer ', '') || cookieToken;

  if (!token) {
    return {
      success: false,
      error: 'Authentication required',
      status: 401
    };
  }

  // Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    return {
      success: false,
      error: 'Invalid or expired token',
      status: 401
    };
  }

  // Check clearance level requirements
  const requiredClearance = CLEARANCE_REQUIREMENTS[path];
  if (requiredClearance && payload.clearanceLevel < requiredClearance) {
    return {
      success: false,
      error: `Insufficient clearance level. Required: ${requiredClearance}, Current: ${payload.clearanceLevel}`,
      status: 403
    };
  }

  // Check role requirements
  const requiredRoles = ROLE_REQUIREMENTS[path];
  if (requiredRoles && !requiredRoles.includes(payload.role)) {
    return {
      success: false,
      error: `Insufficient role permissions. Required: ${requiredRoles.join(' or ')}`,
      status: 403
    };
  }

  return { success: true, user: payload };
}

export function createAuthResponse(
  error: string,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      timestamp: Date.now(),
      classification: 'UNCLASSIFIED'
    },
    { status }
  );
}

// Helper to extract user from request in API routes
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<JWTTokenPayload | null> {
  const result = await authenticateRequest(request);
  if (result.success) {
    return result.user;
  }
  return null;
}

// Rate limiting store (in production, use Redis)
const rateLimitStore: Map<string, { count: number; resetAt: number }> = new Map();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
}

// Audit logging
export function auditLog(
  action: string,
  userId: string,
  details: Record<string, unknown>,
  success: boolean
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    success,
    details,
    classification: 'UNCLASSIFIED // FOUO'
  };

  // In production, write to secure audit log
  console.log('[AUDIT]', JSON.stringify(entry));
}
