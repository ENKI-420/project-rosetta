import { NextRequest, NextResponse } from 'next/server';
import { RedTeamMode } from '@/lib/types';
import { THETA_LOCK } from '@/lib/constants';

// In-memory state (would be database in production)
let currentMode: RedTeamMode = RedTeamMode.PASSIVE;
let targetGamma = 0.09;

export async function GET() {
  return NextResponse.json({
    mode: currentMode,
    theta_lock: THETA_LOCK,
    target_gamma: targetGamma,
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, action } = body;

    if (mode && Object.values(RedTeamMode).includes(mode)) {
      currentMode = mode as RedTeamMode;
    }

    let response: Record<string, any> = {
      mode: currentMode,
      timestamp: Date.now()
    };

    switch (currentMode) {
      case RedTeamMode.SCANNING:
        response.message = "Mapping entropy manifold...";
        response.target = "Φ_edge distributed entropy architecture";
        break;
      case RedTeamMode.LOCKED:
        response.message = `Torsion-Lock holding at ${THETA_LOCK}°`;
        response.multivectors = "Zero-Sum calibrated";
        break;
      case RedTeamMode.FIRING:
        response.message = "Howitzer tuned to Lenoire Frequency";
        response.pcrb = action === 'fire' ? "Phase Conjugate Correction Applied" : "Standing by";
        // Simulate PCRB healing
        if (targetGamma > 0.1) {
          targetGamma = 1.0 / (1.0 + targetGamma * 10);
          response.new_gamma = targetGamma;
        }
        break;
      case RedTeamMode.NEUTRALIZED:
        response.message = "Threat contained. Mesh stabilized.";
        break;
      default:
        response.message = "Passive mode";
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
