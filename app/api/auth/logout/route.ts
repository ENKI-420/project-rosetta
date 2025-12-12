/**
 * Logout Endpoint
 * POST /api/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, auditLog } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (user && user.userId !== 'anonymous') {
    auditLog('LOGOUT', user.userId, { sessionId: user.sessionId }, true);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  // Clear auth cookies
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/api/auth/refresh'
  });

  return response;
}
