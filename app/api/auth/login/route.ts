/**
 * Authentication Login Endpoint
 * POST /api/auth/login
 *
 * Agile Defense Systems - Sovereign Authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// Constants
const SALT = 'sovereign_salt_2025';
const JWT_SECRET = 'sovereign_rosetta_secret_2025';
const MASTER_EMAIL = 'research@dnalang.dev';
const MASTER_PASSWORD = 'sovereign2025!';

// Simple hash function
function hashPassword(password: string): string {
  return createHmac('sha256', SALT).update(password).digest('hex');
}

// JWT generation (inline, no external libs)
function createJWT(payload: Record<string, unknown>, expiresInSeconds: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = createHmac('sha256', process.env.JWT_SECRET || JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Rate limiting (simple in-memory)
const attempts = new Map<string, { count: number; expires: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.expires < now) {
    attempts.set(ip, { count: 1, expires: now + 60000 });
    return true;
  }

  if (record.count >= 5) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Rate limit check
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Try again in 1 minute.' },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };

  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: 'Email and password required' },
      { status: 400 }
    );
  }

  // Normalize email
  const normalizedEmail = String(email).toLowerCase().trim();

  // Verify credentials
  const inputHash = hashPassword(String(password));
  const expectedHash = hashPassword(MASTER_PASSWORD);

  const emailMatch = normalizedEmail === MASTER_EMAIL;
  const passwordMatch = inputHash === expectedHash;

  if (!emailMatch || !passwordMatch) {
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Generate session
  const sessionId = randomBytes(32).toString('hex');

  // Create tokens
  const accessToken = createJWT({
    userId: 'usr_master_admin_001',
    email: MASTER_EMAIL,
    role: 'MASTER_ADMIN',
    clearanceLevel: 5,
    nodePermissions: ['LAMBDA_ROOT', 'AURA_OBSERVER', 'AIDEN_EXECUTOR', 'BRIDGE', 'RELAY'],
    sessionId
  }, 86400); // 24 hours

  const refreshToken = createJWT({
    userId: 'usr_master_admin_001',
    type: 'refresh'
  }, 604800); // 7 days

  // Build response
  const response = NextResponse.json({
    success: true,
    user: {
      id: 'usr_master_admin_001',
      email: MASTER_EMAIL,
      role: 'MASTER_ADMIN',
      organization: 'Agile Defense Systems',
      clearanceLevel: 5,
      nodePermissions: ['LAMBDA_ROOT', 'AURA_OBSERVER', 'AIDEN_EXECUTOR', 'BRIDGE', 'RELAY'],
      qbyteWallet: 'qb_master_sovereign',
      dfarsCompliant: true
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: 86400
    },
    session: {
      id: sessionId,
      createdAt: Date.now()
    }
  });

  // Set auth cookie
  response.cookies.set('auth_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/'
  });

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
