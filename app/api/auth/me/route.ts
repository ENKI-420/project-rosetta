/**
 * Current User Profile Endpoint
 * GET /api/auth/me
 *
 * Returns authenticated user's profile
 */

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

// JWT verification (simplified)
function verifyToken(token: string): { userId: string; email: string; role: string; clearanceLevel: number; nodePermissions: string[]; sessionId: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const secret = process.env.JWT_SECRET || 'sovereign_rosetta_secret_2025';
    const [header, body, signature] = parts;

    // Verify signature
    const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;

    // Decode payload
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());

    // Check expiry
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// Master admin info (must match login route)
const MASTER_ADMIN = {
  id: 'usr_master_admin_001',
  email: 'research@dnalang.dev',
  role: 'MASTER_ADMIN',
  organization: 'Agile Defense Systems',
  clearanceLevel: 5,
  nodePermissions: ['LAMBDA_ROOT', 'AURA_OBSERVER', 'AIDEN_EXECUTOR', 'BRIDGE', 'RELAY'],
  qbyteWallet: 'qb_master_sovereign',
  dfarsCompliant: true,
  mfaEnabled: false
};

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get('auth_token')?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 401 });
    }

    // For master admin
    if (payload.userId === MASTER_ADMIN.id) {
      return NextResponse.json({
        success: true,
        user: {
          id: MASTER_ADMIN.id,
          email: MASTER_ADMIN.email,
          role: MASTER_ADMIN.role,
          organization: MASTER_ADMIN.organization,
          clearanceLevel: MASTER_ADMIN.clearanceLevel,
          nodePermissions: MASTER_ADMIN.nodePermissions,
          qbyteWallet: MASTER_ADMIN.qbyteWallet,
          dfarsCompliant: MASTER_ADMIN.dfarsCompliant,
          mfaEnabled: MASTER_ADMIN.mfaEnabled
        },
        session: {
          id: payload.sessionId,
          expiresAt: payload.exp ? payload.exp * 1000 : Date.now() + 86400000
        }
      });
    }

    // User not found
    return NextResponse.json({
      success: false,
      error: 'User not found'
    }, { status: 404 });

  } catch (error) {
    console.error('[AUTH] /me error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication service error'
    }, { status: 500 });
  }
}
