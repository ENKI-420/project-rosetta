import { NextRequest, NextResponse } from 'next/server';

// Ollama API integration for AURA model
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'aura' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Call Ollama API
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 512
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      model,
      response: data.response,
      eval_count: data.eval_count,
      timestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Ollama request failed',
      fallback: true
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check Ollama status and list models
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

    if (!response.ok) {
      throw new Error('Ollama not available');
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'online',
      models: data.models || [],
      timestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'offline',
      error: error.message,
      timestamp: Date.now()
    }, { status: 503 });
  }
}
