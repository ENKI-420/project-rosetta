import { NextRequest, NextResponse } from 'next/server';
import { computeQSliceCompliance, PHI_THRESHOLD, GAMMA_CRITICAL, XI_MINIMUM, THETA_LOCK } from '@/lib/constants';

export async function GET(request: NextRequest) {
  // Default CCCE metrics
  const phi = parseFloat(request.nextUrl.searchParams.get('phi') || '0.80');
  const lambda = parseFloat(request.nextUrl.searchParams.get('lambda') || '0.91');
  const gamma = parseFloat(request.nextUrl.searchParams.get('gamma') || '0.09');
  const xi = parseFloat(request.nextUrl.searchParams.get('xi') || '8.15');

  const compliance = computeQSliceCompliance(phi, lambda, gamma, xi);

  return NextResponse.json({
    success: true,
    metrics: { phi, lambda, gamma, xi },
    compliance,
    thresholds: {
      PHI_THRESHOLD,
      GAMMA_CRITICAL,
      XI_MINIMUM,
      THETA_LOCK
    },
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phi, lambda, gamma, xi } = body;

    if (phi === undefined || lambda === undefined || gamma === undefined) {
      return NextResponse.json({ error: 'Missing metrics' }, { status: 400 });
    }

    const calculatedXi = xi ?? (lambda * phi) / Math.max(gamma, 0.001);
    const compliance = computeQSliceCompliance(phi, lambda, gamma, calculatedXi);

    return NextResponse.json({
      success: true,
      metrics: { phi, lambda, gamma, xi: calculatedXi },
      compliance,
      timestamp: Date.now()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
